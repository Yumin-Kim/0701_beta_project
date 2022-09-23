const { executeQuery } = require("../config/db");
const { resultResponseFormat, resultMSG } = require("../config/result");
const { ece8210 } = require("../config/sql");
const sql = require("../config/sql");
const { parseIndexNumberToArray, convertArrayToLocation } = require("../config/tiles");
const { intergrateMSG } = resultMSG
const router = require("express").Router()
// @deprecated
router.get("/ece9100", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.notSendclientInfo)
        const resoureTransactionList = await executeQuery(sql.ece9100.findTransactionList({ member }))
        const pendingQuery = await resoureTransactionList.map(async (value) => {
            const transactionData = await executeQuery(sql.ece9100.selectDetailTransaction({ transaction: value.transaction }))
            return [value, { transactionData }]
        })
        const resolveList = await Promise.all(pendingQuery)
        const data = await resolveList.reduce(async (prev, cur) => {
            const prevData = await prev.then();
            const curData = await cur
            const { createdt } = curData[0]
            if (prevData.length === 0) {
                prevData.push({ createdt, dayminingData: [curData] })
            } else {
                const result = prevData.filter(v => v.createdt === createdt)
                let indexing;
                prevData.forEach((v, index) => {
                    if (v.createdt === createdt) {
                        indexing = index
                    }
                })
                if (result.length !== 0) {
                    //존재
                    prevData[indexing].dayminingData.push(curData)
                } else {
                    //없음
                    prevData.push({ createdt, dayminingData: [curData] })
                }
            }
            return Promise.resolve([...prevData]);
        }, Promise.resolve([]))
        res.send(resultResponseFormat({ status: 1310, msg: "내 토지 조회 완료", data }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.get("/ece9100_beta", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.notSendclientInfo)
        const adminInfo = await executeQuery(sql.ece8210())
        const resoureTransactionList = await executeQuery(`
        SELECT 
            DATE_FORMAT(createdt, '%Y.%m.%d') AS createdt,
            action,extracode1,extrastr1,extrastr2
        FROM
            Transactions
        WHERE
            action IN (7231,7232,7241,7242,7233,7243) AND member = ${member} order by transaction desc;
        `)
        const data = await resoureTransactionList.reduce((prev, cur) => {
            if (prev.length === 0) {
                prev.push({ createdt: cur.createdt, dayminingData: [cur] })
            } else {
                const result = prev.filter(v => v.createdt === cur.createdt);
                let indexing;
                prev.forEach((val, index) => {
                    if (val.createdt === cur.createdt) {
                        indexing = index
                    }
                })
                if (result.length !== 0) {
                    prev[indexing].dayminingData.push(cur)
                } else {
                    prev.push({ createdt: cur.createdt, dayminingData: [cur] })
                }
            }
            return prev
        }, [])
        res.send(resultResponseFormat({ status: 1310, msg: "내 토지 조회 완료", data, extraData: adminInfo }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})

module.exports = router;