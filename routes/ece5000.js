const { executeQuery } = require("../config/db");
const { resultResponseFormat, resultMSG } = require("../config/result");
const sql = require("../config/sql");
const { parseIndexNumberToArray, convertArrayToLocation } = require("../config/tiles");
const { intergrateMSG } = resultMSG
const router = require("express").Router()
const currentResource = [7507, 7508, 7509, 7602]
router.get("/ece5100", async (req, res) => {
    try {
        const { member } = req.query;
        if (member === undefined) throw new Error(intergrateMSG.notSendclientInfo)
        let data = await executeQuery(`select  if( 0 = 99, 0, 7507) as "resource", if(sum(amount) is null , 0 , sum(amount) )  as 'amount' from ResourceTransactions
        where member = ${member} and resource = 7507 and extracode is not null
        union all
        select  if( 0 = 99, 0, 7508) as "resource", if(sum(amount) is null , 0 , sum(amount) ) as 'amount' from ResourceTransactions
        where member = ${member} and resource = 7508 and extracode is not null
        union all
        select  if( 0 = 99, 0, 7509) as "resource", if(sum(amount) is null , 0 , sum(amount) ) as 'amount'  from ResourceTransactions
        where member = ${member} and resource = 7509 and extracode is not null
        union all
        select  if( 0 = 99, 0, 7602) as "resource", if(sum(amount) is null , 0 , sum(amount) ) as 'amount'  from ResourceTransactions
        where member = ${member} and resource = 7602 and extracode is not null;`);
        // if (data.length !== currentResource.length) {
        //     await currentResource.map(async (name) => {
        //         let check = false;
        //         await data.forEach(({ resource, amount }) => {
        //             if (resource === name) {
        //                 check = true;
        //             }
        //         })
        //         if (!check) {
        //             const obj = {
        //                 resource: name,
        //                 amount: 0,
        //             }
        //             let checkIndexing = 0;
        //             console.log(data.length);
        //             data.forEach((value, index) => {
        //                 if (Number(value.resource) > name) {
        //                     checkIndexing = index
        //                 }
        //             })
        //             console.log(checkIndexing);
        //             if (checkIndexing < data.length) {
        //                 data.unshift(obj)
        //             } else {
        //                 data.push(obj)

        //             }
        //         }
        //     })
        // }
        res.send(resultResponseFormat({ status: 1310, msg: "자원 통계 데이터 전송 완료", data }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
/**
 * 자원 변환
 * 10,000 >> 10
 * 
 */
router.post("/ece5200", async (req, res) => {
    try {
        const { member } = req.query;
        const { newResourceName, removeResourceName, removeResource, newResource } = req.body
        if (member === undefined || newResourceName === undefined || removeResourceName === undefined || removeResource === undefined || newResource === undefined) throw new Error(intergrateMSG.notSendclientInfo)
        const [prevSumResource] = await executeQuery(`select sum(amount) as 'sumResource' from ResourceTransactions where member = ${member} and extracode is not null and resource = ${removeResourceName}`)
        console.log(prevSumResource);
        if (Number(prevSumResource.sumResource) < Number(removeResource)) {
            throw new Error("요청한 자원의 수가 큽니다.")
        }
        await executeQuery(`insert ResourceTransactions (resource , amount ,member,extracode) values 
        (${removeResourceName},-${removeResource},${member},9910),
        (${newResourceName},${newResource},${member},9910);`);
        let data = await executeQuery(`select  if( 0 = 99, 0, 7507) as "resource", if(sum(amount) is null , 0 , sum(amount) )  as 'amount' from ResourceTransactions
        where member = ${member} and resource = 7507 and extracode is not null
        union all
        select  if( 0 = 99, 0, 7508) as "resource", if(sum(amount) is null , 0 , sum(amount) ) as 'amount' from ResourceTransactions
        where member = ${member} and resource = 7508 and extracode is not null
        union all
        select  if( 0 = 99, 0, 7509) as "resource", if(sum(amount) is null , 0 , sum(amount) ) as 'amount'  from ResourceTransactions
        where member = ${member} and resource = 7509 and extracode is not null
        union all
        select  if( 0 = 99, 0, 7602) as "resource", if(sum(amount) is null , 0 , sum(amount) ) as 'amount'  from ResourceTransactions
        where member = ${member} and resource = 7602 and extracode is not null;`);
        res.send(resultResponseFormat({ status: 1310, msg: "자원 반환 완료", data }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})


module.exports = router;