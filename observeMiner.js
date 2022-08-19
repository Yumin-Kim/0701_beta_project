const { executeQuery, dbPool } = require("./config/db.js")
const sql = require("./config/sql.js")
const schedule = require('node-schedule');
const resouceList = [7501, 7502, 7503, 7504, 7601]
const TIMER_30S = '30 * * * * *'
const TIMER_1S = '1 * * * * *'
const TIMER_1H = '* * 1 * * *'
const interval_mining = async ({ instance }) => {
    await instance.beginTransaction();
    const [selectContainByMiner] = await instance.query(sql.miner_getMinerOnTiles())
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
                if (index === resouceList.length - 1) {
                    return ele[index] = `(${ele},${Math.floor(Math.random() * 3)},${resultMember.tileCount},${resultMember.minerCount},${resultMember.member},${transactionRow.insertId})`
                } else {
                    return ele[index] = `(${ele},${miningLogic({ minerCount: Number(resultMember.minerCount) }) * Number(resultMember.tileCount)},${resultMember.tileCount},${resultMember.minerCount},${resultMember.member},${transactionRow.insertId})`
                }
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
function miningLogic({ minerCount }) {
    if (minerCount === 0 || minerCount === undefined) return;
    const unixTime = Math.floor(new Date().getTime() / 1000)
    const mainLogic = (x) => x / unixTime
    return Math.floor(mainLogic(Math.floor(Math.random() * unixTime)) * minerCount);
}
(async () => {
    const j = await schedule.scheduleJob(TIMER_1H, async () => {
        const instance = await dbPool.getConnection(async conn => conn)
        await interval_mining({ instance });
    });
})()
// setInterval(async () => {
//     const instance = await dbPool.getConnection(async conn => conn)
//     await interval_mining({ instance });
// }, 1000 * 5)
