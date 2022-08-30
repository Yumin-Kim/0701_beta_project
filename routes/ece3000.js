const { executeQuery, dbPool } = require("../config/db");
const { resultResponseFormat, resultMSG } = require("../config/result");
const sql = require("../config/sql");
const { ece3300_getCenterPoint, parseIndexNumberToArray, tiles, convertArrayToLocation, parseArrayToIndexNumber, ece3200_getCenterPoint } = require("../config/tiles");
const { intergrateMSG, ece3000 } = resultMSG
const { requestAPI } = require("../config/utils");
const MINERSERVER = 'http://127.0.0.1:5010'
const router = require("express").Router()

router.post("/ece3200", async (req, res) => {
    try {
        const { width, height } = req.body
        const points = parseArrayToIndexNumber(width, height)
        const [selectLandMemberInfo] = await executeQuery(`select * from Lands where landkey = ${points} limit 1`);
        console.log(selectLandMemberInfo);
        if (selectLandMemberInfo === undefined) throw new Error("선택한타일은 사용자가 존재하지 않습니다.")
        const [memberInfo] = await executeQuery(`select member , email , firstname , lastname from Members where member = ${selectLandMemberInfo.member}`)
        const memberCenterLocation = ece3200_getCenterPoint(width, height)
        let getcenterLandquery = memberCenterLocation.map(value => `(select * from Lands where landkey >= ${value[0]} and landkey <= ${value[1]} and member = ${selectLandMemberInfo.member})`)
        getcenterLandquery = getcenterLandquery.join(",")
        getcenterLandquery = getcenterLandquery.replaceAll(",", " union all ")
        const result = await executeQuery(getcenterLandquery)
        const landInfo = result.map((value, index) => {
            const { land, landkey, member, createdt, updatedt } = value
            const [width, height] = parseIndexNumberToArray(landkey)
            const location = convertArrayToLocation(width, height)
            return { land, blockLocation: [location[0], location[1], location[0] + 0.00009, location[1] - 0.00009], member, createdt, updatedt }
        })
        await res.send(resultResponseFormat({ status: 1310, data: { landInfo, memberInfo }, msg: "선탣한 근처 타일 정보 제공" }))
    } catch (error) {
        res.send(resultResponseFormat({ data: null, extraData: error, msg: "선택한 타일은 사용자가 존재하지 않습니다.", status: 1320 }))
    }

})

router.post("/ece3300", async (req, res) => {
    const { width, height } = req.body
    const points = ece3300_getCenterPoint(width, height)
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
    await res.send({ data, msg: "타일 불러오기 성공" })
})
router.get("/ece3400", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.failure)
        await executeQuery(sql.ece3400.insertRemainMiningTransaction({ member }))
        const data = await executeQuery(sql.ece3400.findAllByCurrentMinigResource({ member }))
        if (data.length === 0) throw new Error(ece3000.ece3400.failure)
        await executeQuery(sql.ece3400.updateMiningResource({ member }))
        await res.send(resultResponseFormat({ data, msg: ece3000.ece3400.success, status: 1310 }))
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
        await instance.query(sql.ece3400.insertRemainMiningTransaction({ member }))
        const [data] = await instance.query(sql.ece3400.findAllByCurrentMinigResource({ member }))
        instance.rollback();
        instance.release();
        if (data.length !== 0) {
            await res.send(resultResponseFormat({ data, msg: ece3000.ece3400.success, status: 1310 }))
        } else {
            await res.send(resultResponseFormat({ data, msg: ece3000.ece3400.failure, status: 1320 }))
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
        await res.send(resultResponseFormat({ data: { resoureList: currentResoureList, memberInfo: getMemberTileAndMiner }, status: 1310, msg: ece3000.ece3500.success }))
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
module.exports = router;