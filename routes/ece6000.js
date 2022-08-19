const { executeQuery } = require("../config/db");
const { resultResponseFormat, resultMSG } = require("../config/result");
const sql = require("../config/sql");
const { parseIndexNumberToArray, convertArrayToLocation } = require("../config/tiles");
const { intergrateMSG } = resultMSG
const router = require("express").Router()

router.get("/ece6100", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.notSendclientInfo)
        const resoureTransactionList = await executeQuery(sql.ece6100.findTransactionByResoureceTransactions({ member }))
        const pendingQuery = await resoureTransactionList.map(async (value) => {
            const resourceData = await executeQuery(sql.ece6100.findResourceTrnsactionByResouce({ transaction: value.transaction }))
            return [value, { resourceData }]
        })
        const data = await Promise.all(pendingQuery)
        res.send(resultResponseFormat({ status: 1310, msg: "내 토지 조회 완료", data }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})

module.exports = router;