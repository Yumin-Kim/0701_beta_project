const { executeQuery } = require("../config/db");
const { resultResponseFormat, resultMSG } = require("../config/result");
const sql = require("../config/sql");
const { parseIndexNumberToArray, convertArrayToLocation } = require("../config/tiles");
const { intergrateMSG } = resultMSG
const router = require("express").Router()
const currentResource = [7505, 7506, 7507, 7602]
router.get("/ece5100", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.notSendclientInfo)
        let data = await executeQuery(sql.ece5100({ member }));
        if (data.length !== currentResource.length) {
            console.log(data);
            await currentResource.map(async (name) => {
                if (data.resource !== name) {
                    const obj = {
                        resource: name,
                        amount: 0,
                    }
                    data.push(obj)
                }
            })
        }
        console.log(data);
        res.send(resultResponseFormat({ status: 1310, msg: "자원 통계 데이터 전송 완료", data }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})

module.exports = router;