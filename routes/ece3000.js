const { executeQuery } = require("../config/db");
const { resultResponseFormat, resultMSG } = require("../config/result");
const sql = require("../config/sql");
const { ece3300_getCenterPoint, parseIndexNumberToArray, tiles, convertArrayToLocation } = require("../config/tiles");
const { intergrateMSG, ece3000 } = resultMSG
const { requestAPI } = require("../config/utils");
const MINERSERVER = 'http://127.0.0.1:5010'
const router = require("express").Router()

router.post("/ece3300", async (req, res) => {
    const { width, height } = req.body
    const points = ece3300_getCenterPoint(width, height)
    console.log(points);
    const getcenterLandquery = points.map(value => `(select * from Lands where landkey >= ${value[0]} and landkey <= ${value[1]})`)
    let selectQuery = getcenterLandquery.join(",")
    selectQuery = selectQuery.replaceAll(",", " union all ")
    const result = await executeQuery(selectQuery)
    const data = result.map((value, index) => {
        const { land, landkey, member, createdt, updatedt } = value
        const [width, height] = parseIndexNumberToArray(landkey)
        const location = convertArrayToLocation(width, height)
        return { land, blockLocation: [location[0], location[1], location[0] + 0.00009, location[1] - 0.00009], member, createdt, updatedt }
    })
    res.json({ data, msg: ece3000.ece3200.msg })
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