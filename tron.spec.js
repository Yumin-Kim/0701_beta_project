// /**
//  * tronGrid를 통해서 api key 받기
//  */
// const TronWeb = require('tronweb');
// const TronGrid = require("trongrid")
// const { executeQuery, dbPool } = require("./config/db.js")
// const sql = require("./config/sql.js")
// const schedule = require('node-schedule');
// const TIMER_1M = '59 * * * * *'
// const TIMER_1S = '1 * * * * *'
// const TIMER_1H = '59 59 * * * *'

// const HttpProvider = TronWeb.providers.HttpProvider;
// const fullNode = new HttpProvider("https://api.trongrid.io");
// const solidityNode = new HttpProvider("https://api.trongrid.io");
// const eventServer = new HttpProvider("https://api.trongrid.io");
// const privateKey = "0209833647c93b1e34f333b519c46d9f005fc9e0f332c74d3b87104f74c29a63";
// const TRONWALLET = 'TWwnZgk83H9rFo4cn6P3qrDNGgokJMemvL'
// const tronDecimal = 1000000;
// const TRONAPIKEY = process.env.NODE_ENV !== "PRD" ? "1eec9900-b417-426e-aa65-fb65615c7040" : '96e8ccd9-1048-448d-9d45-1887d30e267f';
// (async () => {
//     const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
//     const trongrid = new TronGrid(tronWeb)
//     tronWeb.setHeader({ "TRON-PRO-API-KEY": TRONAPIKEY });
//     // const j = await schedule.scheduleJob(TIMER_1M, async () => {
//     const ece8210_minerList = await executeQuery(`select extrastr1 as 'userInputAddress',extracode1 as 'minerCount',member , transaction ,extrastr2 as 'amount'  from Transactions where action = 7231 order by transaction desc`)
//     console.log(`>>>>>>>>>>>>>>>>START NODE SCADULE<<<<<<<<<<<<<<<<<<`);
//     const options = {
//         limit: 200,
//         order_by: 'timestamp,desc',
//     };
//     const { data: ownerTransactions } = await trongrid.account.getTransactions(TRONWALLET, options)
//     await ownerTransactions.map(async (transaction, index) => {
//         const { txID, signature, blockNumber, raw_data } = transaction
//         const TRONtimestamp = raw_data.timestamp;
//         const userTransaction = await tronWeb.trx.getTransaction(txID);
//         const userAddress = tronWeb.address.fromHex(userTransaction.raw_data.contract[0].parameter.value.owner_address)
//         // const ownerAddress = tronWeb.address.fromHex(userTransaction.raw_data.contract[0].parameter.value.to_address)
//         const userAmount = userTransaction.raw_data.contract[0].parameter.value.amount;
//         await ece8210_minerList.map(async (value) => {
//             const { userInputAddress, transaction, amount, minerCount, member } = value;
//             const userRequestPrice = Number(amount) * tronDecimal
//             if (userInputAddress === userAddress) {
//                 if (userRequestPrice === userAmount) {
//                     console.log("==================================");
//                     console.log(`VERIFY TRON User Address: ${userAddress}`);
//                     console.log(`VERIFY TRON TX ID: ${txID}`);
//                     console.log(`VERIFY TRON MEMBER ID: ${member}`);
//                     console.log(`TRON TYPE : ${userTransaction.raw_data.contract[0].type}`);
//                     console.log("==================================");
//                     console.log("");
//                     await executeQuery(`update Transactions set action  = 7232 ,updatedt=NOW()  where transaction = ${transaction}`)
//                     /**
//                      * 마이닝 활성화
//                      * 총 채굴량 
//                      * 현 채굴량
//                      * 마이너 갯수
//                      * 트론 입금 정보 기록
//                      * 사용자 실 입금 금액 , 트랜잭션 번호 , 트랜잭션 hash , 블럭 번호 
//                      */
//                     await executeQuery(`insert into Transactions (action , status , extracode1,extracode2,extrastr1,extrastr2,member) values 
//                     (7235,1310,${Number(minerCount) * 1000},0,'${transaction}','${minerCount}',${member}),
//                     (6202,1310,${userAmount},${transaction},'${txID}','${blockNumber}',${member})`)
//                 } else {
//                     //금액 틀린경우
//                 }
//             } else {
//                 //다른 사용자
//                 // await executeQuery(`insert into Transactions (action , status , extracode1,extracode2,extrastr1,extrastr2,member) values 
//                 //     (6203,1310,${userAmount},${transaction},'${txID}','${userAddress}')`)
//             }
//         })


//     })
//     console.log(`>>>>>>>>>>>>>>>>END NODE SCADULE<<<<<<<<<<<<<<<<<<`);

//     // await interval_mining({ instance });
//     // });
// })()






// // '96e8ccd9-1048-448d-9d45-1887d30e267f'
// // (async () => {
// //     // const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
// //     // tronWeb.setHeader({ "TRON-PRO-API-KEY": process.env.TRON_PRO_API_KEY });
// //     const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
// //     const trongrid = new TronGrid(tronWeb)
// //     tronWeb.setHeader({ "TRON-PRO-API-KEY": "1eec9900-b417-426e-aa65-fb65615c7040" });
// //     // const accountInfo = await tronWeb.trx.getAccount(TRONWALLET)
// //     // const latestBlcok = await tronWeb.trx.getBlock("latest")
// //     // const brokerange = await tronWeb.trx.getBrokerage(TRONWALLET)
// //     const b1 = await trongrid.account.getTransactions(TRONWALLET, options)
// //     // console.log(b.meta.fingerprint);
// //     console.log(b1.data[0]);
// //     // options.fingerprint = b.meta.fingerprint
// //     // const b2 = await trongrid.account.getTransactions(TRONWALLET, options)
// //     // tronWeb.trx.getTransaction()
// //     // await writeFile("./transaction.json", JSON.stringify(b))
// //     // console.log(latestBlcok);
// //     // console.log(accountInfo)
// //     // await tronWeb.trx.getBalance(TRONWALLET)

// //     // const account = await tronWeb.createAccount();
// //     // await appendFile("./tronaccount.txt", JSON.stringify(account))
// // })()
// //  //Example 2
// //  const TronWeb = require('tronweb')
// //  const tronWeb = new TronWeb({
// //      fullHost: 'https://api.trongrid.io',
// //      headers: { "TRON-PRO-API-KEY": 'your api key' },
// //      privateKey: 'your private key'
// //  })
// //Example 1
// // async function start() {
// //     let trSend = await tronWeb.transactionBuilder.sendTrx("TWwnZgk83H9rFo4cn6P3qrDNGgokJMemvL", 5)
// //     const trSendwithNote = await tronWeb.transactionBuilder.addUpdateData(trSend, "some t2", 'utf8');
// //     console.log(trSend)
// //     const signedTransaction = await tronWeb.trx.sign(trSendwithNote);
// //     const sendRaw = await tronWeb.trx.sendRawTransaction(signedTransaction);
// // }

// // start()
// // console.log ( trSend )

// // sendTransaction = await tronWeb.transactionBuilder.sendTrx('TWwnZgk83H9rFo4cn6P3qrDNGgokJMemvL', 1);    
// // sendTransaction.raw_data.data = 'hex message';

// QYT1SYyVeJk4SgY9syEe8ncle3EvNqAi

// (async () => {
//     const tronPrice = await do_request("GET", "/ticker", { symbol: "trx_usdt" });
//     const a = await requestAPI_https(`https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=QYT1SYyVeJk4SgY9syEe8ncle3EvNqAi&searchdate=${new Date().toISOString().split("T")[0].replaceAll("-", "")}&data=AP01`)
//     let usd_price = 0;
//     a.forEach(element => {
//         if (element.cur_unit === "USD") {
//             usd_price = Number(element.bkpr.replace(",", ""))
//         }
//     });
//     console.log(tronPrice);
//     console.log(usd_price);
//     const cc = Number((tronPrice * usd_price).toFixed(2))
//     console.log(1300000 / cc);
// })()