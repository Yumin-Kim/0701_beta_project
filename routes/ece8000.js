const { executeQuery } = require("../config/db");
const { resultResponseFormat, resultMSG } = require("../config/result");
const sql = require("../config/sql");
const { intergrateMSG, ece8000 } = resultMSG
const router = require("express").Router()
/**
 * 토지 구매전 판매자 정보 제공
 */
router.get("/ece8110", async (req, res) => {
    try {
        const [data] = await executeQuery(sql.ece8110())
        res.send(resultResponseFormat({ data, status: 1310, msg: ece8000.ece8110.success }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
/**
 * 토지 구매 요청
 * transaction 구매 요청 기록
 * 
 */
router.post("/ece8120", async (req, res) => {
    try {
        const { member } = req.query;
        const { startLand, landInfo } = req.body;
        // console.log(req.body);
        if (member === undefined || startLand === undefined || landInfo === undefined) throw new Error(intergrateMSG.failure)
        await executeQuery(sql.ece8120({ member, tile: startLand, tileInfo: landInfo, tileLength: landInfo.length }))
        res.send(resultResponseFormat({ status: 1310, msg: ece8000.ece8120.success }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.get("/ece8120", async (req, res) => {
    const data = await executeQuery(sql.xrpWebsocket.updateTileByAllMember_NoCach());
    console.log(data);
    res.send(resultResponseFormat({ data, status: 1310, msg: intergrateMSG.success }))
})
// router.get("/")
router.get("/ece8210", async (req, res) => {
    try {
        await executeQuery(sql.admin.insertMinerSellerInfo({}))
        const [data] = await executeQuery(sql.ece8210())
        res.send(resultResponseFormat({ data, status: 1310, msg: ece8000.ece8210.success }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.post("/ece8220", async (req, res) => {
    try {
        const { member } = req.query;
        const { miner, xrp, address } = req.body;
        let memberAddress;
        if (address === undefined) {
            const [memberInfo] = await executeQuery(sql.utils.findByMember({ member }))
            memberAddress = memberInfo.walletaddress
        } else {
            memberAddress = address;
        }
        if (member === undefined || miner === undefined || xrp === undefined) throw new Error(intergrateMSG.failure)
        await executeQuery(sql.ece8220({ member, miner, xrp, memberAddress }))
        res.send(resultResponseFormat({ status: 1310, msg: ece8000.ece8220.success }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
module.exports = router;