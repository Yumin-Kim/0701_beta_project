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
        const currentResoureList = await executeQuery(`SELECT resource , sum(amount) as 'amount' FROM wicfaie.ResourceTransactions where member = ${member} and 
        extracode is not null group by resource order by resource desc;`);
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
/**
 * @Deprecated
 */
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
router.get("/ece3700", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.failure)
        let data = await executeQuery(`select 
        m.name,m.tileamount,t.action , min,m.miner,m.createdt,
        if(m.extracode is null ,"" ,m.extracode) as 'minerStat' 
        from Miners as m
        left join
        (select * from Transactions where action in (7235,7236)) as t
        on t.miner = m.miner 
        left join
        (select min(remainamount) as min , miner from MinerTransactions where member =${member} group by miner) as mt
        on mt.miner= m.miner
        where m.member = ${member}`)
        data = data.map((value) => {
            const { name, tileamount, action, min } = value
            const convertPer = 100 - Math.floor(min / 10000)
            value.min = convertPer + "%"
            return value
        })
        res.send(resultResponseFormat({ status: 1310, msg: "사용자 채굴기 리스트 정보 제공", data }))
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
// 채굴기 이름 , 진행도 채굴기 
router.get("/ece3710", async (req, res) => {
    try {
        const { member, miner } = req.query;
        if (member === undefined || miner === undefined) throw new Error(intergrateMSG.failure)
        const [selectReferMemberCount] = await executeQuery(`select count(*) as count from Transactions where action = 9501 and miner = ${miner};`)
        const { count } = selectReferMemberCount
        let selectDoReferCode = await executeQuery(`
        SELECT 
    if(extrastr1 is null , "" , extrastr1) as 'doReferCode'
FROM
    Transactions
WHERE
    extracode1 = (SELECT 
            extrastr1
        FROM
            Transactions
        WHERE
            member = ${member} AND action IN (7235)
                AND miner = ${miner}
        LIMIT 1)
        AND member = ${member};`)

        let selectMinerInfo = await executeQuery(`select m.name,m.tileamount,t.action , min,m.miner from Miners as m
        left join
        (select * from Transactions where action in (7235,7236)) as t
        on t.miner = m.miner 
        left join
        (select min(remainamount) as min , miner from MinerTransactions where member = ${member} group by miner) as mt
        on mt.miner= m.miner
        where m.member = ${member} and m.miner = ${miner}`)
        selectMinerInfo = selectMinerInfo.map((value) => {
            const { name, tileamount, action, min } = value
            const convertPer = 100 - Math.floor(min / 10000)
            value.min = convertPer + "%"
            return value
        })
        let doReferName = await executeQuery(`select name from Miners where
        miner = (select miner from Transactions where action = 9501 and extracode2 = ${miner})`);
        if (doReferName.length !== 0) {
            doReferName = doReferName[0].name
        } else {
            doReferName = null
        }
        const referList = await executeQuery(`select * from Transactions where action = 9501 and miner = ${miner}`)
        const result = { doReferCode: doReferName, minerInfo: selectMinerInfo[0], count, referList }
        res.send(resultResponseFormat({ status: 1310, msg: "사용자 채굴기 리스트 정보 제공", data: result }))
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})

router.get("/ece3720", async (req, res) => {
    try {
        const { member, miner } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.failure)
        let data = await executeQuery(`select extracode1,createdt from Transactions 
        where action = 9501 and miner = ${miner};
        `)
        data = await data.map(async (v) => {
            const { extracode1, createdt } = v
            const [minerName] = await executeQuery(`select name from Miners 
            where miner = (select miner 
                from Transactions where action = 7235 and extrastr1 = ${extracode1} 
                order by transaction asc limit 1)`)
            return { name: minerName.name, createdt }
        })
        console.log(data);
        data = await Promise.all(data)
        res.send(resultResponseFormat({ status: 1310, msg: "사용자 채굴기 리스트 정보 제공", data }))
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
// 체굴기 별 자원 정보
router.get("/ece3730", async (req, res) => {
    try {
        const { member, miner } = req.query;
        const [selectData] = await executeQuery(`select transaction from Transactions where action in(7235,7236)  and miner = ${miner} and member = ${member}`)
        console.log(selectData);
        let data = await executeQuery(`select  if( 0 = 99, 0, 7507) as "resource", if(sum(amount) is null , 0 , sum(amount) )  as 'amount' from ResourceTransactions
        where member = ${member} and resource = 7507 and extracode is not null and transaction = ${selectData.transaction}
        union all
        select  if( 0 = 99, 0, 7508) as "resource", if(sum(amount) is null , 0 , sum(amount) ) as 'amount' from ResourceTransactions
        where member = ${member} and resource = 7508 and extracode is not null and transaction = ${selectData.transaction}
        union all
        select  if( 0 = 99, 0, 7509) as "resource", if(sum(amount) is null , 0 , sum(amount) ) as 'amount'  from ResourceTransactions
        where member = ${member} and resource = 7509 and extracode is not null and transaction = ${selectData.transaction}
        union all
        select  if( 0 = 99, 0, 7602) as "resource", if(sum(amount) is null , 0 , sum(amount) ) as 'amount'  from ResourceTransactions
        where member = ${member} and resource = 7602 and extracode is not null and transaction = ${selectData.transaction}`)

        res.send(resultResponseFormat({ status: 1310, msg: "사용자 채굴기 리스트 정보 제공", data }))
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})

router.post("/ece3740", async (req, res) => {
    try {
        const { member, miner } = req.query;
        const { newResourceName, removeResourceName, removeResource, newResource } = req.body
        const [selectData] = await executeQuery(`select transaction from Transactions where action in( 7235 , 7236) and miner = ${miner} and member = ${member}`)
        await executeQuery(`insert ResourceTransactions (resource , amount ,member,extracode ,transaction,miner) values 
    (${removeResourceName},-${removeResource},${member},9910,${selectData.transaction},${miner}),
    (${newResourceName},${newResource},${member},9910,${selectData.transaction},${miner});`);
        await res.send(resultResponseFormat({ status: 1310, msg: "자원 반환 완료", data: null }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
module.exports = router;