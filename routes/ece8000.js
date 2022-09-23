const { executeQuery } = require("../config/db");
const { resultResponseFormat, resultMSG } = require("../config/result");
const { parseArrayToIndexNumber, parseIndexNumberToArray } = require('../config/tiles.js');
const sql = require("../config/sql");
const { digifinax_request, requestAPI_https, requestAPI_internationalCurrencyPrice_usdt } = require("../config/utils");
const { default: axios } = require("axios");
const { intergrateMSG, ece8000 } = resultMSG
const router = require("express").Router()
let priceAPI = [{ cur_unit: "USD", bkpr: "1,389.94" }];
/**
 * 토지 구매전 판매자 정보 제공
 */
router.get("/ece8110", async (req, res) => {
    try {
        const tronPrice = await digifinax_request("GET", "/ticker", { symbol: "trx_usdt" });
        let usd_price = await requestAPI_internationalCurrencyPrice_usdt()
        const [data] = await executeQuery(sql.ece8110())
        data.currentamount = String(Math.floor((1000000 / usd_price) * (1 / tronPrice)))
        const memberPrice = await executeQuery(`select extrastr2 from Transactions where action in (7231, 7241 , 7242 , 7232) order by transaction desc limit 1;`)
        if (memberPrice.length === 0) {
            data.currentamount = data.currentamount + ".001"
        } else {
            let decimal = Number(String(memberPrice[0].extrastr2).split(".")[1])
            if (String(decimal) === `NaN`) decimal = 189
            if (decimal > 200) {
                data.currentamount = data.currentamount + ".001"
            } else {
                decimal += 1;
                if (decimal < 10) {
                    data.currentamount = `${data.currentamount}.00${decimal}`
                } else if (decimal < 100) {
                    data.currentamount = `${data.currentamount}.0${decimal}`
                } else {
                    data.currentamount = `${data.currentamount}.${decimal}`
                }
            }
        }
        res.send(resultResponseFormat({ data, status: 1310, msg: ece8000.ece8110.success }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
/**
 * 마이너 정보 밑 갯수 제공
 */
router.get("/ece8111_beta", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.failure)
        const data = await executeQuery(`select action , extracode1 as 'minerCount' , extrastr2 as 'amount' , createdt from Transactions where action in (7241,7242) and member = ${member} order by transaction desc`)
        const minerInfoList = await executeQuery(`select * from Miners where member = ${member}`)
        const [minerAmountInfo] = await executeQuery(`select if(sum(mineramount) is null , 0 ,sum(mineramount) ) as 'minerAmount' from Miners where member = ${member};`)
        const { minerAmount } = minerAmountInfo
        res.send(resultResponseFormat({
            data, status: 1310, msg: ece8000.ece8210.success, extraData: {
                minerInfoList, minerAmount
            }
        }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
/**
 * 토지 구매 요청
 * transaction 구매 요청 기록
 * bulkup insert
 * @deprecated
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
 * @deprecated
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
/**
 * 추천인 레코드 추가
 */
router.post("/ece8120_beta", async (req, res) => {
    try {
        const { member } = req.query;
        const { tileSet, address, amount, referMinerName } = req.body;
        let extraData = "추천인을 입력하지 않았습니다.";
        let insertId = 0;
        if (member === undefined || tileSet === undefined || address === undefined) throw new Error(intergrateMSG.failure)
        if (Number(tileSet) > 11) throw new Error("최대 10대 구매 가능합니다.")
        // 채굴기 이름
        if (referMinerName.trim() !== "") {
            extraData = await insertReferMiner({ referMinerName, member, insertId });
        }
        const [minerAmountInfo] = await executeQuery(`select sum(extrastr2) as 'minerAmount' from Transactions where action = 7235 and member = ${member}`)
        const { minerAmount } = minerAmountInfo
        if (Number(minerAmount) + Number(tileSet) < 11) {
            const minerName = generateRandomString(2) + generateRandomCode(6)
            const insertData = await executeQuery(`insert  Transactions (action , status , extracode1, extrastr1 ,extrastr2,extrastr4,member ) values (7241,1310 , ${tileSet} , '${address}' , '${amount}','${minerName}',${member})`);
            insertId = insertData.insertId
            // 채굴기 이름
            if (referMinerName.trim() !== "") {
                if (insertId === 0) throw new Error("구매 요청 정보가 등록 되지 않았습니다.")
                extraData = await insertReferMiner({ referMinerName, member, insertId });
            }
            res.send(resultResponseFormat({ status: 1310, msg: ece8000.ece8220.success }))
        } else {
            throw new Error("최대 구매는 100000Tiles 입니다.")
        }
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.get("/ece8210", async (req, res) => {
    try {
        const tronPrice = await digifinax_request("GET", "/ticker", { symbol: "trx_usdt" });
        let usd_price = await requestAPI_internationalCurrencyPrice_usdt()
        const data = await executeQuery(sql.ece8210())
        data[0].currentamount = String(Math.floor((1000000 / usd_price) * (1 / tronPrice)))
        const memberPrice = await executeQuery(`select extrastr2 from Transactions where action in (7231, 7241 , 7242 , 7232) order by transaction desc limit 1;`)
        if (memberPrice.length === 0) {
            data[0].currentamount = data[0].currentamount + ".001"
        } else {
            let decimal = Number(String(memberPrice[0].extrastr2).split(".")[1])
            if (String(decimal) === `NaN`) decimal = 189
            if (decimal > 200) {
                data[0].currentamount = data[0].currentamount + ".001"
            } else {
                decimal += 1;
                if (decimal < 10) {
                    data[0].currentamount = `${data[0].currentamount}.00${decimal}`
                } else if (decimal < 100) {
                    data[0].currentamount = `${data[0].currentamount}.0${decimal}`
                } else {
                    data[0].currentamount = `${data[0].currentamount}.${decimal}`
                }
            }
        }
        res.send(resultResponseFormat({ data, status: 1310, msg: ece8000.ece8210.success }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
/**
 * @deprecated
 */
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
        const data = await executeQuery(`select action , extracode1 as 'minerCount' , extrastr2 as 'amount' , createdt from Transactions where action in (7231,7232) and member = ${member} order by transaction desc`)
        res.send(resultResponseFormat({ data, status: 1310, msg: ece8000.ece8210.success }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
// @deprecated
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
/**
 * 추천인 레코드 추가
 */
router.post("/ece8220_beta", async (req, res) => {
    try {
        const { member } = req.query;
        const { miner, address, amount, referMinerName } = req.body;
        let extraData = "추천인을 입력하지 않았습니다.";
        let insertId = 0;
        if (member === undefined || miner === undefined || address === undefined) throw new Error(intergrateMSG.failure)
        if (Number(miner) > 11) throw new Error("최대 10대 구매 가능합니다.")
        const [minerAmountInfo] = await executeQuery(`select sum(extrastr2) as 'minerAmount' from Transactions where action = 7235 and member = ${member}`)
        const { minerAmount } = minerAmountInfo
        if (Number(minerAmount) + Number(miner) < 11) {
            const minerName = generateRandomString(2) + generateRandomCode(6)
            const insertData = await executeQuery(`insert  Transactions (action , status , extracode1, extrastr1 ,extrastr2,extrastr4,member ) values (7231,1310 , ${miner} , '${address}' , '${amount}','${minerName}',${member})`);
            insertId = insertData.insertId
            // 채굴기 이름
            if (referMinerName.trim() !== "") {
                if (insertId === 0) throw new Error("구매 요청 정보가 등록 되지 않았습니다.")
                extraData = await insertReferMiner({ referMinerName, member, insertId });
            }
            res.send(resultResponseFormat({ status: 1310, msg: ece8000.ece8220.success, extraData }))
        } else {
            throw new Error("현재 동작하는 채굴기는 10대입니다.")
        }

    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
// 미승인 상태 추천인 기록
async function insertReferMiner({ referMinerName, member, insertId }) {
    const validMiner = await executeQuery(`select if(m.miner is null , "0",m.miner) as miner,m.member , m.name from Miners as m left outer join 
    (select * from Transactions where action = 7235) as t1
    on t1.miner = m.miner where BINARY name = '${referMinerName}'`)
    if (validMiner.length !== 0) {
        const { miner, member: minerOwner } = validMiner[0]
        if (Number(member) === minerOwner) return "본인 채굴기는 추천할 수 없습니다."
        const referMemberList = await executeQuery(`select count(*) as 'count' from Transactions where action = 9501 and miner = ${miner};`)
        const { count } = referMemberList[0]
        if (count < 5) {
            await executeQuery(`insert Transactions (action , status ,extracode1,extrastr1,member,miner) values (9502,1310,${insertId},'${referMinerName}',${member},${miner})`)
            return "추천인 미승인 처리 완료"
        } else {
            return "추천인 5명 초과 했습니다"
        }
    } else {
        return "추천인이 존재하지 않습니다."
    }

}
function generateRandomCode(n) {
    let str = ''
    for (let i = 0; i < n; i++) {
        let num = Math.floor(Math.random() * 10)
        num === 0 ? num = 1 : num = num;
        str += num
    }
    return str
}
const generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
module.exports = router;