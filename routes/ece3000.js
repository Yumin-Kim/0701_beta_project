const { executeQuery, dbPool } = require("../config/db");
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
    // console.log(points);
    const getcenterLandquery = points.map(value => sql.ece3300.findLandsByAroundLand({ minLandIndex: value[0], maxLandIndex: value[1] }))
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
router.get("/ece3401", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.failure)
        const instance = await dbPool.getConnection(async conn => conn)
        await instance.beginTransaction();
        await executeQuery(sql.ece3400.insertRemainMiningTransaction({ member }))
        const data = await executeQuery(sql.ece3400.findAllByCurrentMinigResource({ member }))
        instance.rollback();
        instance.release();
        if (data.length !== 0) {
            res.send(resultResponseFormat({ data, msg: ece3000.ece3400.success, status: 1310 }))
        } else {
            res.send(resultResponseFormat({ data, msg: ece3000.ece3400.failure, status: 1320 }))
        }
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.get("/ece3500", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.failure)
        const currentResoureList = await executeQuery(sql.ece3500.findByMemberResource({ member }));
        const getMemberTileAndMiner = await executeQuery(sql.ece3500.findMemberByMinerAndTiles({ member }))
        res.send(resultResponseFormat({ data: { resoureList: currentResoureList, memberInfo: getMemberTileAndMiner }, status: 1310, msg: ece3000.ece3500.success }))
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
module.exports = router;