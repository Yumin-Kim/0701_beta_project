const { executeQuery } = require("../config/db");
const { resultResponseFormat, resultMSG } = require("../config/result");
const sql = require("../config/sql");
const { intergrateMSG, ece7000 } = resultMSG
const router = require("express").Router()

router.get("/ece7100", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.notSendclientInfo)
        const data = await executeQuery(sql.ece7100({ member }))
        res.send(resultResponseFormat({ status: 1310, msg: ece7000.ece7100.success, data }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.post("/ece7200", async (req, res) => {
    try {
        const { member } = req.query;
        const { firstname, lastname, gender, walletaddress, email, pin } = req.body;
        if (member === undefined || lastname === undefined || firstname === undefined || email === undefined || gender === undefined || walletaddress === undefined) throw new Error(intergrateMSG.notSendclientInfo)
        if (pin !== undefined) {
            await executeQuery(sql.ece7200.updateMemberPin({ member, pin }))
        }
        await executeQuery(sql.ece7200.updateMemberInfo({ member, email, lastname, firstname, walletaddress, gender }))
        const data = await executeQuery(sql.ece7200.findByMember({ member }))
        await res.send(resultResponseFormat({ status: 1310, msg: ece7000.ece7100.success, data }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
module.exports = router;