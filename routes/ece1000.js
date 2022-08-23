const { executeQuery } = require("../config/db");
const { resultResponseFormat, resultMSG } = require("../config/result");
const sql = require("../config/sql");
const { intergrateMSG } = resultMSG
const router = require("express").Router()

/**
 * 세션확인
 */
router.get("/", async (req, res) => {
    try {
        const data = await executeQuery(`select * from Code`)
        res.send(resultResponseFormat({ status: 1310, msg: "코드 테이블 조회 성공", data }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
module.exports = router;