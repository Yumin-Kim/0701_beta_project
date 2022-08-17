const { executeQuery } = require("../config/db");
const { resultResponseFormat, resultMSG } = require("../config/result");
const sql = require("../config/sql");
const { intergrateMSG, ece4000 } = resultMSG
const router = require("express").Router()

router.get("/", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.failure)

    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
// router.get("/")
router.get("/ece3400", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.failure)
        await executeQuery(sql.ece3400.insertRemainMiningTransaction({ member }))
        const data = await executeQuery(sql.ece3400.findAllByCurrentMinigResource({ member }))
        if (data.length === 0) throw new Error(ece3000.ece3400.failure)
        await executeQuery(sql.ece3400.updateMiningResource({ member }))
        res.send(resultResponseFormat({ data, msg: ece3000.ece3400.success, status: 1310 }))
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.post("/ece3410", async (req, res) => {
    const { memberId } = req.body
    const data = await requestAPI(`${MINERSERVER}?act=ece3420&member=${123}&transactionId=${12}&timestamp=${new Date().getTime()}`)
    res.json(data)
})
module.exports = router;