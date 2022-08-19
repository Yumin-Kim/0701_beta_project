const { executeQuery } = require("../config/db");
const { resultResponseFormat, resultMSG } = require("../config/result");
const sql = require("../config/sql");
const { parseIndexNumberToArray } = require("../config/tiles");
const { intergrateMSG, ece4000 } = resultMSG
const router = require("express").Router()

router.get("/ece4100", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.notSendclientInfo)
        const result = await executeQuery(`select * from Lands where member = ${member}`)
        const data = result.map((value, index) => {
            const { land, landkey, member, createdt, updatedt } = value
            const tmpArray = parseIndexNumberToArray(landkey)
            const location = tiles[tmpArray[1]][tmpArray[0]]
            // const location = convertArrayToLocation(tmpArray[0], tmpArray[1])

            return { land, blockLocation: [location[0], location[1], location[0] + 0.00009, location[1] - 0.00009], member, createdt, updatedt }
        })
        res.send(resultResponseFormat({ status: 1310, msg: "내 토지 조회 완료", data }))


    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})

module.exports = router;