const mysql = require("mysql2/promise")
let instanceConfig;
console.log(`[${process.env.NODE_ENV}] DATABASE CONFIG`);
if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === "DEV") {
    instanceConfig = {
        host: "localhost",
        port: "3306",
        user: "root",
        password: "1234",
        database: "wicfaie",
        charset: "UTF8_GENERAL_CI",
        waitForConnections: true,
        connectionLimit: 45,
        queueLimit: 30,
    };
} else {
    instanceConfig = {
        host: process.env.ECOIN_HOST,
        port: "3306",
        user: process.env.ECOIN_USER,
        password: process.env.ECOIN_PIN,
        database: "wicfaie",
        charset: "UTF8_GENERAL_CI",
        waitForConnections: true,
        connectionLimit: 45,
    };
}
const dbPool = mysql.createPool(instanceConfig);


const executeQuery = async (dbquery) => {
    const instance = await dbPool.getConnection(async conn => conn)
    try {
        await instance.beginTransaction()
        const [result] = await instance.query(dbquery);
        await instance.commit();
        return result;
    } catch (error) {
        console.log(error)
        await instance.rollback();
        process.exit()
    } finally {
        instance.release()
    }
}
const executeQueryList = async (sqlList) => {
    const instance = await dbPool.getConnection(async conn => conn);
    try {
        await instance.beginTransaction();
        const result = await sqlList.map(async (v, index) => {
            const [data] = await instance.query(v);
            return { queryName: v, data, index }
        })
        await instance.commit();
        return await Promise.all(result)
    } catch (error) {
        await instance.rollback();
        return { error }
    }
}

module.exports = {
    executeQuery, executeQueryList, dbPool
}

