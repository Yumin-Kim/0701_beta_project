const { executeQuery, dbPool } = require("./config/db.js")
const sql = require("./config/sql.js")
const schedule = require('node-schedule');
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
// const findTilesR1 = tileFindELC * resourceRange_1 * resourceRange_2 * resourceRange_3;
const miningTileCount = tileFindELC * resourceRange_3;
const CURRENT_CONFIG_TIME = process.env.TIME === undefined ? TIMER_1H : TIMER_1M;

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
(async () => {
    console.log(`=======================================`);
    console.log(`[${process.env.NODE_ENV}] start mining`);
    console.log(`Mining ${CURRENT_CONFIG_TIME}`);
    console.log(`=======================================`);
    const j = await schedule.scheduleJob(CURRENT_CONFIG_TIME, async () => {
        const instance = await dbPool.getConnection(async conn => conn)
        await interval_mining({ instance });
    });
})()