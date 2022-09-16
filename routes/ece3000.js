const { executeQuery, dbPool } = require("../config/db");
const { resultResponseFormat, resultMSG } = require("../config/result");
const sql = require("../config/sql");
const { ece3300_getCenterPoint, parseIndexNumberToArray, tiles, convertArrayToLocation, parseArrayToIndexNumber, ece3200_getCenterPoint } = require("../config/tiles");
const { intergrateMSG, ece3000 } = resultMSG
const { requestAPI } = require("../config/utils");
const MINERSERVER = 'http://127.0.0.1:5010'
const router = require("express").Router()
/**
 * 추천인 배속 정보 제공
 */
const REFERPLUSELEMENT = [3, 5, 7, 9, 11, 14, 17, 21, 24, 29]

router.post("/ece3200", async (req, res) => {
    try {
        const { width, height } = req.body
        const points = parseArrayToIndexNumber(width, height)
        const [selectLandMemberInfo] = await executeQuery(`select * from Lands where landkey = ${points} limit 1`);
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
    const landKeyList = []
    const data = result.map((value, index) => {
        const { land, landkey, member, createdt, updatedt } = value
        const [width, height] = parseIndexNumberToArray(landkey)
        const location = convertArrayToLocation(width, height)
        landKeyList.push(landkey)
        return { land, blockLocation: [location[0], location[1], location[0] + 0.00009, location[1] - 0.00009], member, createdt, updatedt, landkey }
    })
    await res.send(resultResponseFormat({ data, msg: "타일 불러오기 성공", extraData: landKeyList, status: 1310 }))
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
router.get("/ece3400_beta", async (req, res) => {
    try {
        const { member } = req.query;
        const historyMember = await executeQuery(`select sum(amount) as 'amount' , transaction ,resource from ResourceTransactions 
    where member = ${member} and extracode is null GROUP by transaction , resource;`)

        if (historyMember.length !== 0) {
            const miningResult = await executeQuery(`select sum(amount) as 'amount' ,resource as 'category' from ResourceTransactions 
    where member = ${member} and extracode is null group by resource;`)
            const mapPromise = await historyMember.map(async (data) => {
                /**
                 * 사용자 채굴 트리거
                 * 채굴 자원수 , 자원 종류  , 채굴기 정보
                 */
                const insertData = await executeQuery(` insert Transactions (action , status , extracode1 , extracode2,extrastr1,member) 
            values (9901 , 1310 ,${data.amount}, ${data.resource},${data.transaction} ,${member} )`);
                return insertData
            })
            const result = await Promise.all(mapPromise)
            await executeQuery(`update ResourceTransactions as r left join (select resourcetransaction from ResourceTransactions where member = ${member} and extracode is null) as rt
            on rt.resourcetransaction = r.resourcetransaction set extracode = 9902 where r.resourcetransaction = rt.resourcetransaction ;`)
            await res.send(resultResponseFormat({ data: miningResult, msg: ece3000.ece3400.success, status: 1310 }))
        } else {
            throw new Error("채굴할 자원이 없습니다.")
        }
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
router.get("/ece3401_beta", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.failure)
        const data = await executeQuery(`select sum(amount) as 'amount' , transaction ,resource from ResourceTransactions 
        where member = ${member} and extracode is null GROUP by transaction , resource;`)
        if (data.length !== 0) {
            await res.send(resultResponseFormat({ data, msg: ece3000.ece3401.success, status: 1310 }))
        } else {
            await res.send(resultResponseFormat({ data, msg: ece3000.ece3401.failure, status: 1320 }))
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
router.get("/ece3500_beta", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.failure)
        const currentResoureList = await executeQuery(`SELECT resource , sum(amount) as 'amount' FROM wicfaie.ResourceTransactions where member = ${member} and extracode is not null group by resource;`);
        const getMemberTileAndMiner = await executeQuery(`select action , sum(extrastr2) as amount from Transactions where action = 7235 and member = ${member} group by action`)
        await res.send(resultResponseFormat({ data: { resoureList: currentResoureList, memberInfo: getMemberTileAndMiner }, status: 1310, msg: ece3000.ece3500.success }))
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})

router.get("/ece3610", async (req, res) => {
    try {

        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.failure)
        const data = await executeQuery(`SELECT 
        t.createdt,
        t.action,
        t.extracode1 AS 'referMemberCode',
        m.nickname AS 'referNickname'
    FROM
        Transactions AS t
            LEFT JOIN
        (SELECT 
            *
        FROM
            Members) AS m ON m.member = t.member
    WHERE
        action = 9501 AND t.extracode1 = ${member}
    ORDER BY transaction DESC`)
        const [miner] = await executeQuery(`select sum(extracode1) as 'minerCount' from Transactions where action = 7232 and member = ${member}`)
        let minerSpeedElement = 1;
        if (data.length > 0) {
            minerSpeedElement = REFERPLUSELEMENT[data.length - 1]
        }
        res.send(resultResponseFormat({ status: 1310, msg: "추천인 코드 등록 완료", data: { referMemberList: data, minerSpeedElement, minerCount: miner.minerCount } }))
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
router.post("/ece3620", async (req, res) => {
    try {
        const { member } = req.query;
        const { referNickName } = req.body
        if (member === undefined || referNickName == undefined) throw new Error(intergrateMSG.failure)
        const [referMember] = await executeQuery(`select member,nickname from Members where nickname = '${referNickName}' limit 1`)
        const dataRefer = await executeQuery(`select * from Transactions where action = 7232 and member = ${member}`)
        if (dataRefer.length === 0) {
            throw new Error("")
        }
        if (referMember === undefined) {
            throw new Error("존재하지 않는 추천인입니다.")
        }
        const reerMemberMinerCount = await executeQuery(`select * from Transactions where action = 7235 and member = ${referMember.member}`)
        if (reerMemberMinerCount.length !== 0) {
            if (referMember !== undefined) {
                const referMemberList = await executeQuery(`select * from Transactions where action = 9501 and extracode1 = ${referMember.member} and member = ${member} limit 1`)
                if (referMemberList.length !== 0) throw new Error("등록한 추천인 입니다.")
                await executeQuery(`insert into Transactions (action,status,extracode1,extrastr1,member) values (9501,1310,${referMember.member},'${referMember.nickname}',${member})`)
                res.send(resultResponseFormat({ status: 1310, msg: "추천인 코드 등록 완료" }))
            } else {
                throw new Error("존재하지 않는 추천인입니다.")
            }
        } else {
            throw new Error("")
        }
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
module.exports = router;