const { executeQuery, dbPool } = require("./config/db.js")
const sql = require("./config/sql.js")
const schedule = require('node-schedule');
const axios = require("axios")
const { default: axiosOBJ } = require("axios");
const { requestAPI_internationalCurrencyPrice_usdt } = require("./config/utils.js");

// const resouceList = [7505, 7506, 7507, 7602]
const resouceList = [7507]
const TIMER_1M = '59 * * * * *'
const TIMER_1S = '1 * * * * *'
const TIMER_1H = '59 59 * * * *'
const ELCPrice = 200;
const minerPrice = 120000;
const minerHeart = 3;
const tileELCPrice = minerPrice / minerHeart;
const date = 14
const miningDate = 24 * date;
const tileFindELC = tileELCPrice / ELCPrice
const resourceRange_1 = 10000;
const resourceRange_2 = 1000;
const resourceRange_3 = 100;
// v1 version variable
const day = 24 * 11 * 30;
let usd_price;
let elc_price;
const MINERPRICE = 1000000;
const DONGDECIMAL = 1000000;
const URL_LABK_ELCPRICE = "https://api.lbkex.com/v2/ticker/24hr.do?symbol=elc_usdt"
const CURRENCY_PRICE = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=QYT1SYyVeJk4SgY9syEe8ncle3EvNqAi&searchdate=${new Date().toISOString().split("T")[0].replaceAll("-", "")}&data=AP01`
// v1 version variable

// const findTilesR1 = tileFindELC * resourceRange_1 * resourceRange_2 * resourceRange_3;
const miningTileCount = tileFindELC * resourceRange_3;
const CURRENT_CONFIG_TIME = process.env.TIME === "1S" ? TIMER_1H : TIMER_1M;

const interval_mining = async ({ instance }) => {
    await instance.beginTransaction();
    const [selectContainByMiner] = await instance.query(sql.miner.getMinerOnTiles())
    if (selectContainByMiner.length !== 0) {
        console.log(`Miner Member Length : ${selectContainByMiner.length}`);
        /**
         * 마이닝 
         * Transaction
         * extracode1 >> tile count
         * extracode2 >> miner count
         */
        let bulkinsertByMineToResourceTransaction = `insert into ResourceTransactions (resource , amount ,tiles , minercount,member,transaction) values`
        const createResourceInsertQuerysOnPromise = await selectContainByMiner.map(async (resultMember) => {
            const [transactionRow] = await instance.query(`insert into Transactions (action , status ,extracode1 , extracode2 , member ) values (7223 , 1310 ,${resultMember.tileCount},${resultMember.minerCount} ,${resultMember.member})`)
            const resourceInsertQuery = resouceList.map((ele, index) => {
                // if (ele === 7602) {
                //     return ele[index] = `(${ele},${Math.floor(Math.random() * 3)},${resultMember.tileCount},${resultMember.minerCount},${resultMember.member},${transactionRow.insertId})`
                // } else if (ele === 7506 || ele === 7507) {
                //     return ele[index] = `(${ele},${Number(resultMember.minerCount) * Number(resultMember.tileCount) * Math.floor(Math.random() * 3)},${resultMember.tileCount},${resultMember.minerCount},${resultMember.member},${transactionRow.insertId})`
                // } else {
                return ele[index] = `(${ele},${miningLogic_v1({ minerCount: Number(resultMember.minerCount), tileCount: Number(resultMember.tileCount) })},${resultMember.tileCount},${resultMember.minerCount},${resultMember.member},${transactionRow.insertId})`
                // }
            })
            return resourceInsertQuery.join(",")
        })
        const createReouceInsertQuery = await Promise.all(createResourceInsertQuerysOnPromise)
        bulkinsertByMineToResourceTransaction = bulkinsertByMineToResourceTransaction + createReouceInsertQuery.join(",")
        const [insertByMinerInfoTransactions] = await instance.query(bulkinsertByMineToResourceTransaction);
        console.log(`
    insertByResourceTransactions affect Rows : ${JSON.stringify(insertByMinerInfoTransactions)}
        `);

    }
    await instance.commit();
    await instance.release();
}
// 타일 갯수 평균 >> 상위 30프로는
function miningLogic({ minerCount, tileCount }) {
    if (minerCount === 0 || minerCount === undefined) return;
    const unixTime = Math.floor(new Date().getTime() / 1000)
    const mainLogic = (x) => x / unixTime
    return Math.floor(mainLogic(Math.floor(Math.random() * unixTime) * minerCount * tileCount));
}
function miningLogic_v1({ minerCount, tileCount }) {
    if (minerCount === 0 || minerCount === undefined) return;
    const unixTime = Math.floor(new Date().getTime() / 1000)
    console.log();
    const mainLogic = (x) => x / unixTime
    return Math.round(Math.floor(mainLogic(Math.random() * unixTime) * (Math.random() * 100) + 5) + miningTileCount / miningDate * Math.round((Math.random() * 12) + 1) * tileCount)
}

async function mining_beta({ instance }) {
    await instance.beginTransaction();
    const [selectContainByMiner] = await instance.query(sql.miner.getMinerOnTiles())
    if (selectContainByMiner.length !== 0) {
        console.log(`Miner Member Length : ${selectContainByMiner.length}`);
        /**
         * 마이닝 
         * Transaction
         * extracode1 >> tile count
         * extracode2 >> miner count
         */
        let bulkinsertByMineToResourceTransaction = `insert into ResourceTransactions (resource , amount ,tiles , minercount,member,transaction) values`
        const createResourceInsertQuerysOnPromise = await selectContainByMiner.map(async (resultMember) => {
            const [transactionRow] = await instance.query(`insert into Transactions (action , status ,extracode1 , extracode2 , member ) values (7223 , 1310 ,${resultMember.tileCount},${resultMember.minerCount} ,${resultMember.member})`)
            const resourceInsertQuery = resouceList.map((ele, index) => {
                // if (ele === 7602) {
                //     return ele[index] = `(${ele},${Math.floor(Math.random() * 3)},${resultMember.tileCount},${resultMember.minerCount},${resultMember.member},${transactionRow.insertId})`
                // } else if (ele === 7506 || ele === 7507) {
                //     return ele[index] = `(${ele},${Number(resultMember.minerCount) * Number(resultMember.tileCount) * Math.floor(Math.random() * 3)},${resultMember.tileCount},${resultMember.minerCount},${resultMember.member},${transactionRow.insertId})`
                // } else {
                return ele[index] = `(${ele},${miningLogic_v1({ minerCount: Number(resultMember.minerCount), tileCount: Number(resultMember.tileCount) })},${resultMember.tileCount},${resultMember.minerCount},${resultMember.member},${transactionRow.insertId})`
                // }
            })
            return resourceInsertQuery.join(",")
        })
        const createReouceInsertQuery = await Promise.all(createResourceInsertQuerysOnPromise)
        bulkinsertByMineToResourceTransaction = bulkinsertByMineToResourceTransaction + createReouceInsertQuery.join(",")
        const [insertByMinerInfoTransactions] = await instance.query(bulkinsertByMineToResourceTransaction);
        console.log(`
    insertByResourceTransactions affect Rows : ${JSON.stringify(insertByMinerInfoTransactions)}
        `);

    }
    await instance.commit();
    await instance.release();
}
async function interval_minig_beta({ instance }) {
    const referPlusEle = [3, 5, 7, 9, 11, 14, 17, 21, 24, 29]
    await instance.beginTransaction()
    const [findMiningMember] = await instance.query('select * from Transactions where action = 7235;')
    if (findMiningMember.length !== 0) {
        const craetePromiseLoop = await findMiningMember.map(async (v) => {
            const currentAmount = v.extracode2;
            const id = v.transaction;
            const member = v.member;
            const minerCount = v.extrastr2
            const amount = v.extracode1;
            if (currentAmount === (10000000 * minerCount) || currentAmount > (10000000 * minerCount)) {
                await instance.query(`update Transactions set action = 7236 where transaction = ${v.transaction}`)
                return { id, member, amount, minerCount, msg: "채굴 종료" };
            } else {
                const [checkReferCodeCount] = await executeQuery(`select count(*) as count from Transactions where action = 9501 and extracode1 = ${v.member}`)
                let referCount;
                if (checkReferCodeCount.count === 0) {
                    referCount = 1
                } else {
                    referCount = referPlusEle[checkReferCodeCount.count - 1];
                }
                let userAssignAmount = Math.round((10000000 * minerCount) / 22000 * referCount)
                let updateData = currentAmount + Math.round((10000000 * minerCount) / 22000 * referCount)
                if ((10000000 * minerCount) <= currentAmount + userAssignAmount) {
                    updateData = (10000000 * minerCount) - currentAmount;
                    await instance.query(`insert ResourceTransactions (resource,amount,minercount,member,transaction) values(7507,${updateData},${minerCount},${member},${id}) `)
                    await instance.query(`update Transactions set action = 7236 ,extracode2 = ${(10000000 * minerCount)} where transaction = ${v.transaction}`)
                    return { id, member, amount, minerCount, msg: "채굴 종료" };
                } else {
                    await instance.query(`insert ResourceTransactions (resource,amount,minercount,member,transaction) values(7507,${userAssignAmount},${minerCount},${member},${id}) `)
                    await instance.query(`update Transactions set extracode2 = ${updateData} where transaction = ${v.transaction}`)
                    return { id, member, amount, minerCount, referCount }
                }
            }
        })
        const craetePromiseLoopResolve = await Promise.all(craetePromiseLoop)
        console.log(`${JSON.stringify(craetePromiseLoopResolve)}`);
        console.log(`총 : ${craetePromiseLoopResolve.length} 업데이트 완료 했습니다.`);
        await instance.query(`insert  Transactions (action , status ,extracode1) values (1410 , 1310 , ${craetePromiseLoopResolve.length})`)
        await instance.commit();
        await instance.release();
    }
}
async function interval_mining_v1({ instance }) {
    const { data: ELCPrice } = await axios.get(URL_LABK_ELCPRICE)
    usd_price = await requestAPI_internationalCurrencyPrice_usdt()
    elc_price = ELCPrice.data[0].ticker.latest
    let elc_price_kr = (usd_price * elc_price)
    let memberAllRes = MINERPRICE / elc_price_kr
    let HourOfferAmount = MINERPRICE / elc_price_kr / day;
    let HourOfferResDong = Math.floor(MINERPRICE / elc_price_kr / day * DONGDECIMAL);
    let HourOfferKRPrice = HourOfferAmount * elc_price_kr
    console.log(`11달 주는 횟수 ${day}`);
    console.log(`USDT Price ${usd_price}`);
    console.log(`ELC Price ${elc_price}`);
    console.log(`현재 사용자 총 채굴 다이아 ${memberAllRes} DIA`);
    console.log(`ELC KR Price ${usd_price * elc_price}`);
    console.log(`1시간 채굴 금액 ELC ${HourOfferAmount} ELC`);
    console.log(`1시간 채굴 금액 KR ${HourOfferAmount * elc_price_kr} 원`);
    console.log(`1시간 채굴 금액 Resource convert dong ${HourOfferResDong}`);
    const [findMemberByMiner] = await instance.query(`SELECT 
    t.transaction,
    t.member,
    t.miner,
    t.extracode1,
    t.createdt,
    t.extrastr2,
    m.name
FROM
    Transactions AS t
        LEFT JOIN
    (SELECT 
        *
    FROM
        Miners) AS m ON m.miner = t.miner
WHERE
    action = 7235;
`)
    const toFixedKR = elc_price_kr.toFixed(5);
    let count = 0;
    let resourceQuery = `insert ResourceTransactions (resource,amount,minercount,member,transaction) values`
    let minerTransactionQuery = `insert MinerTransactions (transaction , member, minerlife , resourceamount , remainamount , offeramount , elcKRW , elcUSD , tileamount , mineramount ,name,miner) values`
    const createbulkQuery = await findMemberByMiner.map(async (data) => {
        const { transaction, member, extrastr2: minerCount, extracode1: tileCount, createdt, name, miner } = data;
        if (new Date().getMinutes() !== createdt.getMinutes()) return;
        else {
            const [validMemberList] = await instance.query(`select * from MinerTransactions where transaction = ${transaction} order by minertransaction desc `)
            if (validMemberList.length === 0) {
                // 초기
                const memberOfferAmount = (HourOfferKRPrice * minerCount).toFixed(2);
                const memberOfferResourceDong = HourOfferResDong * minerCount;
                const memberRemainAmount = (Number(MINERPRICE * minerCount) - Number(memberOfferAmount)).toFixed(2);
                minerTransactionQuery += `(${transaction} , ${member} , ${day - 1} , ${memberOfferResourceDong} , ${memberRemainAmount} , ${memberOfferAmount},${toFixedKR},${elc_price},${tileCount},${minerCount} , '${name}',${miner}),`
                resourceQuery += `(7507,${memberOfferResourceDong},${minerCount},${member},${transaction}),`
            } else {
                const { transaction, member, minerlife, resourceamount, remainamount, offeramount, tileamount, mineramount } = validMemberList[0]
                const memberOfferAmount = (HourOfferKRPrice * minerCount).toFixed(2);
                const memberOfferResourceDong = HourOfferResDong * minerCount;
                const memberRemainAmount = (Number(remainamount) - Number(memberOfferAmount)).toFixed(2);
                // 제공금액 > 잔여 금액보다 큰경우
                if (Number(memberOfferAmount) > Number(remainamount)) {
                    const memberFinishDong = Math.floor((remainamount / toFixedKR) * DONGDECIMAL)
                    minerTransactionQuery += `(${transaction} , ${member} , ${0} , ${memberFinishDong} , 0 , ${remainamount},${toFixedKR},${elc_price},${tileCount},${minerCount},'${name}',${miner}),`
                    resourceQuery += `(7507,${memberOfferResourceDong},${minerCount},${member},${transaction}),`
                    await instance.query(`update Transactions set action = 7236 ,extracode2 = ${99999999} where transaction = ${transaction}`)
                } else if (minerlife === 1) {
                    const memberFinishDong = Math.floor((remainamount / toFixedKR) * DONGDECIMAL)
                    minerTransactionQuery += `(${transaction} , ${member} , ${0} , ${memberFinishDong} , 0 , ${remainamount},${toFixedKR},${elc_price},${tileCount},${minerCount},'${name}',${miner}),`
                    resourceQuery += `(7507,${memberOfferResourceDong},${minerCount},${member},${transaction}),`
                    await instance.query(`update Transactions set action = 7236 ,extracode2 = ${99999999} where transaction = ${transaction}`)
                } else if (minerlife === 0 || remainamount === 0) {
                    await instance.query(`update Transactions set action = 7236 ,extracode2 = ${99999999} where transaction = ${transaction}`)
                    return;
                }
                else {
                    //존재시
                    minerTransactionQuery += `(${transaction} , ${member} , ${minerlife - 1} , ${memberOfferResourceDong} , ${memberRemainAmount} , ${memberOfferAmount},${toFixedKR},${elc_price},${tileCount},${minerCount},'${name}',${miner}),`
                    resourceQuery += `(7507,${memberOfferResourceDong},${minerCount},${member},${transaction}),`
                }
            }
            count++;
            return {
                minerTransactionQuery,
                resourceQuery
            }
        }

    })
    await Promise.all(createbulkQuery)
    if (count !== 0) {
        resourceQuery = resourceQuery.slice(0, -1)
        minerTransactionQuery = minerTransactionQuery.slice(0, -1)
        // 채굴기 정보 저장
        await instance.query(minerTransactionQuery)
        // 자원 정보 저장
        await instance.query(resourceQuery)
        console.log(`총 ${count}대 동작완료 성공`);
    }
    console.log(`총 ${findMemberByMiner.length}대 채굴기 존재`);
    console.log(`==========END : ${new Date()}==========`);
    await instance.query(`insert  Transactions (action , status ,extracode1) values (1410 , 1310 , ${findMemberByMiner.length})`)
    await instance.commit();
    await instance.release();

}
(async () => {
    console.log(`=======================================`);
    console.log(`[${process.env.NODE_ENV}] start mining`);
    console.log(`Mining ${CURRENT_CONFIG_TIME}`);
    console.log(`=======================================`);
    await executeQuery(`insert Transactions (action , status ) values (1410 , 1310)`);
    const j = await schedule.scheduleJob(CURRENT_CONFIG_TIME, async () => {
        console.log(`=======================================`);
        console.log(`Mining ${CURRENT_CONFIG_TIME} START`);
        console.log(`=======================================`);
        const instance = await dbPool.getConnection(async conn => conn)
        try {
            console.log(`==========START : ${new Date()}==========`);
            await interval_mining_v1({ instance })
        } catch (error) {
            await instance.query(`insert Transactions (action , status ) values (1420 , 1310)`)
            await instance.commit();
            await instance.release();
            process.exit();
        }
    });
    // await setInterval(async () => {
    //     await interval_mining_v1({ instance })
    // }, 1000 * 5)

})()