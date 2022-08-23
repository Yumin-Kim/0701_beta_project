const { executeQuery } = require("../config/db");
const { resultResponseFormat, resultMSG } = require("../config/result");
const sql = require("../config/sql");
const { parseIndexNumberToArray, convertArrayToLocation } = require("../config/tiles");
const { intergrateMSG, ece4000 } = resultMSG
const router = require("express").Router()
router.get("/ece4100", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.notSendclientInfo)
        const tileList = await executeQuery(`select extrastr3,createdt from Transactions where member = ${member} and action = 7132 order by transaction desc`)
        // const tilesCount = await executeQuery(`select count(*) from Lands where member = ${member}`)
        const [memberInfo] = await executeQuery(`select firstname,lastname from Members where member = ${member}`)
        const memberTileInfoList = tileList.reduce((prev, cur) => {
            const locationList = JSON.parse(cur.extrastr3)
            const locationListAdddate = locationList.map((v) => {
                return { landkey: v, createdt: cur.createdt }
            })
            return [...prev, ...locationListAdddate]
        }, [])
        // console.log(a);
        const tilesInfoList = memberTileInfoList.map((value, index) => {
            const { landkey, createdt } = value
            const [width, height] = parseIndexNumberToArray(landkey)
            const location = convertArrayToLocation(width, height)
            return { blockLocation: [location[0], location[1], location[0] + 0.00009, location[1] - 0.00009], createdt }
        })
        res.send(resultResponseFormat({ status: 1310, msg: "내 토지 조회 완료", data: { tileCount: memberTileInfoList.length, name: `${memberInfo.firstname} ${memberInfo.lastname}`, tilesInfoList } }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
module.exports = router;