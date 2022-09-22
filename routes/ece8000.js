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
router.get("/ece8111_beta", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.failure)
        const data = await executeQuery(`select action , extracode1 as 'minerCount' , extrastr2 as 'amount' , createdt from Transactions where action in (7241,7242) and member = ${member} order by transaction desc`)
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
        // 채굴기 이름
        const minerName = generateRandomString(2) + generateRandomCode(6)
        await executeQuery(`insert  Transactions (action , status , extracode1, extrastr1 ,extrastr2,extrastr4,member ) values (7241,1310 , ${tileSet} , '${address}' , '${amount}','${minerName}',${member})`);
        res.send(resultResponseFormat({ status: 1310, msg: ece8000.ece8220.success }))
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
        // 채굴기 이름
        const minerName = generateRandomString(2) + generateRandomCode(6)
        await executeQuery(`insert  Transactions (action , status , extracode1, extrastr1 ,extrastr2,extrastr4,member ) values (7231,1310 , ${miner} , '${address}' , '${amount}','${minerName}',${member})`);
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