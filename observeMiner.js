const { executeQuery, dbPool } = require("./config/db.js")
const sql = require("./config/sql.js")
const resouceList = [7501, 7502, 7503, 7504, 7601]
const interval_mining = async ({ instance }) => {
    await instance.beginTransaction();
    const [selectContainByMiner] = await instance.query(sql.miner_getMinerOnTiles())
    if (selectContainByMiner.length !== 0) {
        console.log(`Miner Member Length : ${selectContainByMiner.length}`);
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
    const mainLogic = (minerCount) => minerCount
    // return Math.round(Math.random(1 / unixTime + mainLogic(minerCount)));
}
// function miningLogic_1() {
//     if (minerCount === 0 || minerCount === undefined) return;
//     return Math.round(Math.random(1 / unixTime + mainLogic(minerCount)));
// }
const unixTime = Math.floor(new Date().getTime() / 1000)
const mainLogic = (x) => x / unixTime
console.log(mainLogic(Math.round(Math.random(0, 100) * 10)) * 100000000);
console.log();
// setInterval(async () => {
//     const instance = await dbPool.getConnection(async conn => conn)
//     await interval_mining({ instance });
// }, 1000 * 5)