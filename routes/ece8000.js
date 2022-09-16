const { executeQuery } = require("../config/db");
const { resultResponseFormat, resultMSG } = require("../config/result");
const { parseArrayToIndexNumber, parseIndexNumberToArray } = require('../config/tiles.js');
const sql = require("../config/sql");
const { digifinax_request, requestAPI_https } = require("../config/utils");
const { intergrateMSG, ece8000 } = resultMSG
const router = require("express").Router()
let priceAPI = null;
/**
 * 토지 구매전 판매자 정보 제공
 */
router.get("/ece8110", async (req, res) => {
    try {
        console.log(`https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=QYT1SYyVeJk4SgY9syEe8ncle3EvNqAi&searchdate=${new Date().toISOString().split("T")[0].replaceAll("-", "")}&data=AP01`);
        const tronPrice = await digifinax_request("GET", "/ticker", { symbol: "trx_usdt" });
        try {
            priceAPI = await requestAPI_https(`https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=QYT1SYyVeJk4SgY9syEe8ncle3EvNqAi&searchdate=${new Date().toISOString().split("T")[0].replaceAll("-", "")}&data=AP01`)
        } catch (error) {
            if (priceAPI == null) {
                priceAPI = [{ cur_unit: "USD", bkpr: "1,389.94" }]
            }
        }
        let usd_price = 0;
        priceAPI.forEach(element => {
            if (element.cur_unit === "USD") {
                usd_price = Number(element.bkpr.replace(",", ""))
            }
        });
        const [data] = await executeQuery(sql.ece8110())
        data.currentamount = ((1000000 / usd_price) * (1 / tronPrice)).toFixed(2)
        res.send(resultResponseFormat({ data, status: 1310, msg: ece8000.ece8110.success }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.get("/ece8111_beta", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.failure)
        const data = await executeQuery(`select action , extracode1 as 'minerCount' , extrastr2 as 'amount' , createdt from Transactions where action in (7241,7242) and member = ${member}`)
        res.send(resultResponseFormat({ data, status: 1310, msg: ece8000.ece8210.success }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
/**
 * 토지 구매 요청
 * transaction 구매 요청 기록
 * bulkup insert
 */
router.post("/ece8120", async (req, res) => {
    try {
        const { member } = req.query;
        const { data, xrp } = req.body;
        if (member === undefined || data === undefined) throw new Error(intergrateMSG.failure)
        const indexingNumberTilesList = data.map(({ width, height }) => {
            return parseArrayToIndexNumber(width, height)
        })
        const code = generateRandomCode(9)
        // console.log(indexingNumberTilesList.join(","));
        // const findLandByMember = await executeQuery(`select * from Lands where landkey in (${indexingNumberTilesList.join(",")})`)
        // if (findLandByMember.length !== 0) throw new Error(ece8000.ece8120.validLand);
        const { insertId, affectedRows } = await executeQuery(sql.ece8120.requsetBuyTilesTransaction({ code, xrp, member, tile: indexingNumberTilesList[0], tileInfo: JSON.stringify(indexingNumberTilesList), tileLength: indexingNumberTilesList.length }))
        if (affectedRows === undefined) throw new Error(ece8000.ece8120.failure);
        res.send(resultResponseFormat({ status: 1310, msg: ece8000.ece8120.success, data: code }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
/**
 * 토지 바로 구매 >> 사용자 정보 입력용도
 */
router.post("/ece8120_rev", async (req, res) => {
    try {
        const { member } = req.query;
        const { data } = req.body;
        console.log(req.query);
        console.log(req.body);
        if (member === undefined || data === undefined) throw new Error(intergrateMSG.failure)
        const indexingNumberTilesList = data.map(({ width, height }) => {
            return parseArrayToIndexNumber(width, height)
        })
        await executeQuery(sql.ece8120.directBuyTilesTransaction({ member, tile: indexingNumberTilesList[0], tileInfo: JSON.stringify(indexingNumberTilesList), tileLength: indexingNumberTilesList.length }))
        let bulkupInsert = `insert into Lands (landkey,member,extracode) values `
        const insertQuery = indexingNumberTilesList.map((landIndex) => `(${landIndex},${member},7110)`)
        bulkupInsert += insertQuery.join(",")
        const { affectedRows } = await executeQuery(bulkupInsert)
        if (affectedRows === undefined) throw new Error(ece8000.ece8120.failure);
        res.send(resultResponseFormat({ status: 1310, msg: ece8000.ece8120.success }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.post("/ece8120_beta", async (req, res) => {
    try {
        const { member } = req.query;
        const { tileSet, address, amount } = req.body;
        if (member === undefined || tileSet === undefined || address === undefined) throw new Error(intergrateMSG.failure)
        await executeQuery(`insert  Transactions (action , status , extracode1, extrastr1 ,extrastr2,member ) values (7241,1310 , ${tileSet} , '${address}' , '${amount}',${member})`);
        res.send(resultResponseFormat({ status: 1310, msg: ece8000.ece8220.success }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.get("/ece8210", async (req, res) => {
    try {
        const tronPrice = await digifinax_request("GET", "/ticker", { symbol: "trx_usdt" });
        try {
            priceAPI = await requestAPI_https(`https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=QYT1SYyVeJk4SgY9syEe8ncle3EvNqAi&searchdate=${new Date().toISOString().split("T")[0].replaceAll("-", "")}&data=AP01`)
        } catch (error) {
            if (priceAPI == null) {
                priceAPI = [{ cur_unit: "USD", bkpr: "1,389.94" }]
            }
        }
        let usd_price = 0;
        priceAPI.forEach(element => {
            if (element.cur_unit === "USD") {
                usd_price = Number(element.bkpr.replace(",", ""))
            }
        });
        // const cc = Number(( * 100).toFixed(2))
        // console.log(1300000 / cc);

        const data = await executeQuery(sql.ece8210())
        data[0].currentamount = ((1000000 / usd_price) * (1 / tronPrice)).toFixed(2)
        res.send(resultResponseFormat({ data, status: 1310, msg: ece8000.ece8210.success }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.get("/ece8211", async (req, res) => {
    try {
        const { member } = req.query;

        if (member === undefined) throw new Error(intergrateMSG.failure)
        const data = await executeQuery(sql.ece8211({ member }))
        console.log(data);
        res.send(resultResponseFormat({ data, status: 1310, msg: ece8000.ece8210.success }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.get("/ece8211_beta", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.failure)
        const data = await executeQuery(`select action , extracode1 as 'minerCount' , extrastr2 as 'amount' , createdt from Transactions where action in (7231,7232) and member = ${member}`)
        res.send(resultResponseFormat({ data, status: 1310, msg: ece8000.ece8210.success }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.post("/ece8220", async (req, res) => {
    try {
        const { member } = req.query;
        const { miner, xrp } = req.body;
        let memberAddress;
        if (memberAddress === null) throw new Error(ece8000.ece8220.notFoundMemberXRPWallerAddress);
        if (member === undefined || miner === undefined || xrp === undefined) throw new Error(intergrateMSG.failure)
        const code = generateRandomCode(9)
        await executeQuery(sql.ece8220({ member, miner, amount: xrp, code }))
        res.send(resultResponseFormat({ status: 1310, msg: ece8000.ece8220.success, data: code }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.post("/ece8220_beta", async (req, res) => {
    try {
        const { member } = req.query;
        const { miner, address, amount } = req.body;
        if (member === undefined || miner === undefined || address === undefined) throw new Error(intergrateMSG.failure)
        await executeQuery(`insert  Transactions (action , status , extracode1, extrastr1 ,extrastr2,member ) values (7231,1310 , ${miner} , '${address}' , '${amount}',${member})`);
        res.send(resultResponseFormat({ status: 1310, msg: ece8000.ece8220.success }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
function generateRandomCode(n) {
    let str = ''
    for (let i = 0; i < n; i++) {
        let num = Math.floor(Math.random() * 10)
        num === 0 ? num = 1 : num = num;
        str += num
    }
    return str
}
module.exports = router;