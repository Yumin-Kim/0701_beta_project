const { executeQuery, dbPool } = require("../../config/db");
const { resultResponseFormat, resultMSG } = require("../../config/result");
const { parseArrayToIndexNumber } = require('../../config/tiles.js');
const sql = require("../../config/sql");
const { intergrateMSG, ece4000 } = resultMSG
const router = require("express").Router()
const axios = require("axios")

async function getOffserDIAResourceData() {
    let usd_price;
    let elc_price;
    const URL_LABK_ELCPRICE = "https://api.lbkex.com/v2/ticker/24hr.do?symbol=elc_usdt"
    const CURRENCY_PRICE = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=QYT1SYyVeJk4SgY9syEe8ncle3EvNqAi&searchdate=${new Date().toISOString().split("T")[0].replaceAll("-", "")}&data=AP01`
    const MINERPRICE = 1000000;
    const { data: ELCPrice } = await axios.get(URL_LABK_ELCPRICE)
    const { data: priceAPI } = await axios.get(CURRENCY_PRICE)
    if (priceAPI.length !== 0) {
        priceAPI.forEach(element => {
            if (element.cur_unit === "USD") {
                usd_price = Number(element.bkpr.replace(",", ""))
            }
        });
    } else {
        usd_price = 1394;
    }
    elc_price = ELCPrice.data[0].ticker.latest
    let elc_price_kr = (usd_price * elc_price)
    return MINERPRICE / elc_price_kr
}


router.post("/sellerinfo_tiles", async (req, res) => {
    const { xrpWallet, xrp } = req.body
    await executeQuery(sql.admin.insertTileSellerInfo({ xrpWallet, xrp }));
    res.send(resultResponseFormat({ data: `판매자 주소 ${xrpWallet} , 타일당 판매가 :${xrp}`, status: 1310, msg: "채굴기 판매자 정보 입력 완료" }))
})
router.post("/sellerinfo_miner", async (req, res) => {
    const { xrpWallet, xrp } = req.body
    await executeQuery(sql.admin.insertMinerSellerInfo({ xrpWallet, xrp }));
    res.send(resultResponseFormat({ data: `판매자 주소 ${xrpWallet} , 채굴기당 판매가 :${xrp}`, status: 1310, msg: "타일 판매자 정보 입력 완료" }))
})
router.get("/buytiles", async (req, res) => {
    const data = await executeQuery(sql.xrpWebsocket.updateTileByAllMember_NoCash());
    res.send(resultResponseFormat({ data, status: 1310, msg: "타일 구매 정보 업데이트" }))
})

router.get("/buytiles_rev", async (req, res) => {
    const a = await executeQuery(`select transaction , extrastr3 as "data", member from Transactions where action =7131`)
    const buyTiles_AffectRowList = await a.map(async ({ data, member, transaction }) => {
        let bulkupInsert = `insert into Lands (landkey,member,extracode) values `
        const insertQuery = JSON.parse(data).map((landIndex) => `(${landIndex},${member},7120)`)
        bulkupInsert += insertQuery.join(",")
        const { affectedRows: bulkAffectRows } = await executeQuery(bulkupInsert)
        const { affectedRows: updateAffectRow } = await executeQuery(`update Transactions set action = 7132 where transaction = ${transaction}`)
        return { bulkAffectRows, updateAffectRow, transaction, member }
    })
    const ResolveList = await Promise.all(buyTiles_AffectRowList)
    res.send(resultResponseFormat({ data: ResolveList, status: 1310, msg: "타일 구매 정보 모두 업데이트" }))

})
// router.get("/")
router.get("/buyminers", async (req, res) => {
    const data = await executeQuery(sql.xrpWebsocket.updateMinerByAllMember_NoCash());
    res.send(resultResponseFormat({ data, status: 1310, msg: "채굴기 구매 정보 업데이트" }))
})
router.get("/requestile", async (req, res) => {
    const { member } = req.query
    const data = await executeQuery(sql.xrpWebsocket.findByMemberBuyRequestTilies({ member }));
    let arr = []
    let landList;
    if (data.length !== 0) {
        data.forEach((v) => {
            arr = [...arr, ...v.tiles]
            const set = new Set(arr)
            landList = [...set]
        },)
        await executeQuery(sql.xrpWebsocket.updateLandByOwner({ member, landList: landList.join(',') }))
    }

    res.send(resultResponseFormat({ data, status: 1310, msg: "타일 구매 요청자 단수" }))
})
router.get("/requestilelist", async (req, res) => {
    const data = await executeQuery(sql.xrpWebsocket.findByMemberAllBuyRequestTilies());
    res.send(resultResponseFormat({ data, status: 1310, msg: "타일 구매 요청자 리스트" }))
})
router.post("/ece8220", async (req, res) => {
    try {
        const { tron, amount } = req.body;
        const [selectData] = await executeQuery(`select * from Transactions where action = 7231 and extrastr1 = '${tron}' and extrastr2='${amount}' order by transaction desc limit 1;`)
        if (selectData === undefined) throw new Error("입력하신 정보는 조회 할 수 없는 트론 주소 , 금액 입니다.")
        const { transaction, extrastr4: minername, extracode1: minerCount, member } = selectData
        await executeQuery(`update Transactions set action  = 7232 ,updatedt=NOW()  where transaction = ${selectData.transaction}`)
        /**
         * 채굴기 테이블 저장
         */
        const { affectedRows, insertId } = await executeQuery(`insert Miners (name , mineramount , tileamount , member) values ('${minername}' , ${minerCount} , ${Number(minerCount) * 1000} , ${member})`);
        if (affectedRows !== 0) {
            const memberAllRes = await getOffserDIAResourceData()
            await executeQuery(`insert ResourceTransactions (resource , amount ,member,extracode) values 
            (7602,${Math.floor(memberAllRes * minerCount)},${member},9910);`);
            /**
             * 마이닝 활성화
             * 총 채굴량 
             * 현 채굴량
             * 마이너 갯수
             */
            await executeQuery(`insert into Transactions (action , status , extracode1,extracode2,extrastr1,extrastr2,member,miner) values 
             (7235,1310,${Number(minerCount) * 1000},0,'${transaction}','${minerCount}',${member},${insertId}),
             (6203,1310,${amount},${transaction},'관리자 처리','처리',${member},${insertId})`);
            res.send(resultResponseFormat({ status: 1310, msg: "채굴기 구매 입금 확인 처리 되었습니다.", data: { member, minerCount, amount, tron } }))
        }
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.post("/ece8120", async (req, res) => {
    try {
        const { tron, amount } = req.body;
        const [selectData] = await executeQuery(`select * from Transactions where action = 7241 and extrastr1 = '${tron}' and extrastr2='${amount}' order by transaction desc limit 1;`)
        if (selectData === undefined) throw new Error("입력하신 정보는 조회 할 수 없는 트론 주소 , 금액 입니다.")
        const { transaction, extrastr4: minername, extracode1: minerCount, member } = selectData
        await executeQuery(`update Transactions set action  = 7242 ,updatedt=NOW()  where transaction = ${selectData.transaction}`)
        /**
         * 채굴기 테이블 저장
         */
        const { affectedRows, insertId } = await executeQuery(`insert Miners (name , mineramount , tileamount , member) values ('${minername}' , ${minerCount} , ${Number(minerCount) * 1000} , ${member})`);
        if (affectedRows !== 0) {
            const memberAllRes = await getOffserDIAResourceData()
            await executeQuery(`insert ResourceTransactions (resource , amount ,member,extracode) values 
            (7602,${Math.floor(memberAllRes * minerCount)},${member},9910);`);
            /**
             * 마이닝 활성화
             * 총 채굴량 
             * 현 채굴량
             * 마이너 갯수
             */
            await executeQuery(`insert into Transactions (action , status , extracode1,extracode2,extrastr1,extrastr2,member,miner) values 
             (7235,1310,${Number(minerCount) * 1000},0,'${transaction}','${minerCount}',${member},${insertId}),
             (6203,1310,${amount},${transaction},'관리자 처리','처리',${member},${insertId})`);
            res.send(resultResponseFormat({ status: 1310, msg: "타일 구매 입금 확인 처리 되었습니다.", data: { member, minerCount, amount, tron } }))
        }
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
module.exports = router;