/**
 * tronGrid를 통해서 api key 받기
 * TVWcEHdHx3s1rJy8nCTvLnJAsrR6rTWmf6 0.000005
 * TTS91bphWN2hWnHQ2QnKjvhQSm1d1Qvddd 0.000028
 * TB8D9NmLBQKSLbbq64q8CyizDRPNBTybza 0.000018
 * TQ1tKTUUuoxZdzp4Vaa6eD7CVaMfhP2Jmp 1176.856301
 */
const TronWeb = require('tronweb');
const TronGrid = require("trongrid")
const { executeQuery, dbPool } = require("./config/db.js")
const schedule = require('node-schedule');
const TIMER_1M = '59 * * * * *';

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "0209833647c93b1e34f333b519c46d9f005fc9e0f332c74d3b87104f74c29a63";
const TRONWALLET = 'TWwnZgk83H9rFo4cn6P3qrDNGgokJMemvL'
const TRONAPIKEY = process.env.NODE_ENV === "PRD" ? "1eec9900-b417-426e-aa65-fb65615c7040" : '96e8ccd9-1048-448d-9d45-1887d30e267f';
const CURRENT_CONFIG_TIME = TIMER_1M;
const axios = require("axios")
const { requestAPI_internationalCurrencyPrice_usdt } = require('./config/utils.js');
///
const day = 24 * 11 * 30;
let usd_price;
let elc_price;
const MINERPRICE = 1000000;
const URL_LABK_ELCPRICE = "https://api.lbkex.com/v2/ticker/24hr.do?symbol=elc_usdt"
//

async function getOffserDIAResourceData() {
    let usd_price;
    let elc_price;
    const URL_LABK_ELCPRICE = "https://api.lbkex.com/v2/ticker/24hr.do?symbol=elc_usdt"
    const MINERPRICE = 1000000;
    const { data: ELCPrice } = await axios.get(URL_LABK_ELCPRICE)
    usd_price = await requestAPI_internationalCurrencyPrice_usdt()
    elc_price = ELCPrice.data[0].ticker.latest
    let elc_price_kr = (usd_price * elc_price)
    return MINERPRICE / elc_price_kr
}

const options = {
    limit: 200,
    order_by: 'timestamp,desc',
};
const tronDecimal = 1000000;
(async () => {
    console.log(`=======================================`);
    console.log(`[${process.env.NODE_ENV}] START TRON MONITERING`);
    console.log(`TRON MONITERING ${CURRENT_CONFIG_TIME}`);
    console.log(`TRON PRO API KEY ${TRONAPIKEY}`);
    console.log(`=======================================`);
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
    const trongrid = new TronGrid(tronWeb)
    tronWeb.setHeader({ "TRON-PRO-API-KEY": TRONAPIKEY });
    const j = await schedule.scheduleJob(CURRENT_CONFIG_TIME, async () => {
        const ece8210_minerList = await executeQuery(`select extrastr1 as 'userInputAddress',extracode1 as 'minerCount',member , transaction ,extrastr2 as 'amount' , extrastr4 as 'minername'  from Transactions where action = 7231 order by transaction desc`)
        const ece8110_tileList = await executeQuery(`select extrastr1 as 'userInputAddress',extracode1 as 'minerCount',member , transaction ,extrastr2 as 'amount' , extrastr4 as 'minername'  from Transactions where action = 7241 order by transaction desc`)
        console.log(`>>>>>>>>>>>>>>>>START NODE TRON MOINTER SCADULE<<<<<<<<<<<<<<<<<<`);

        const { data: ownerTransactions } = await trongrid.account.getTransactions(TRONWALLET, options)
        await ownerTransactions.map(async (transaction, index) => {
            const { txID, signature, blockNumber, raw_data } = transaction
            const TRONtimestamp = raw_data.timestamp;
            const userTransaction = await tronWeb.trx.getTransaction(txID);
            const userAddress = tronWeb.address.fromHex(userTransaction.raw_data.contract[0].parameter.value.owner_address)
            // const ownerAddress = tronWeb.address.fromHex(userTransaction.raw_data.contract[0].parameter.value.to_address)
            const userAmount = userTransaction.raw_data.contract[0].parameter.value.amount;
            /**
             * 채굴기 구매자 승인
             */
            await ece8210_minerList.map(async (value) => {
                const { userInputAddress, transaction, amount, minerCount, member, minername } = value;
                const userRequestPrice = Number(amount) * tronDecimal
                if (userInputAddress === userAddress) {
                    if (userRequestPrice === userAmount) {
                        console.log("================MINER Purchase==================");
                        console.log(`VERIFY TRON User Address: ${userAddress}`);
                        console.log(`VERIFY TRON TX ID: ${txID}`);
                        console.log(`VERIFY TRON MEMBER ID: ${member}`);
                        console.log(`TRON TYPE : ${userTransaction.raw_data.contract[0].type}`);
                        console.log("==================MINER Purchase================");
                        console.log("");
                        await executeQuery(`update Transactions set action  = 7232 ,updatedt=NOW()  where transaction = ${transaction}`)
                        //  await executeQuery(`insert into Transactions ()`)
                        const inserstMiner = await Array(minerCount).fill().map(async (count) => {
                            const minername = generateRandomString(2) + generateRandomCode(6)
                            const amount = 1;
                            const { affectedRows, insertId } = await executeQuery(`insert Miners (name , mineramount , tileamount , member) values ('${minername}' , ${amount} , ${Number(amount) * 1000} , ${member})`);
                            if (affectedRows !== 0) {
                                const memberAllRes = await getOffserDIAResourceData()
                                await executeQuery(`insert ResourceTransactions (resource , amount ,member,extracode,minercount) values 
                                (7602,${Math.floor(memberAllRes * amount)},${member},9910,${amount});`);
                                /**
                                 * 마이닝 활성화
                                 * 총 채굴량 
                                 * 현 채굴량
                                 * 마이너 갯수
                                 */
                                await executeQuery(`insert into Transactions (action , status , extracode1,extracode2,extrastr1,extrastr2,member,miner) values 
                                 (7235,1310,${Number(amount) * 1000},0,'${transaction}','${amount}',${member},${insertId}),
                                 (6202,1310,${userAmount},${transaction},'${txID}','${blockNumber}',${member},${insertId})`);
                                const { data: ELCPrice } = await axios.get(URL_LABK_ELCPRICE)
                                usd_price = await requestAPI_internationalCurrencyPrice_usdt()
                                elc_price = ELCPrice.data[0].ticker.latest
                                let elc_price_kr = (usd_price * elc_price)
                                const toFixedKR = elc_price_kr.toFixed(5);
                                const memberRemainAmount = (Number(MINERPRICE * amount)).toFixed(2);

                                await executeQuery(`insert MinerTransactions (transaction , member, minerlife , resourceamount , remainamount , offeramount , elcKRW , elcUSD , tileamount , mineramount ,name,miner) values
                                (${transaction} , ${member} , ${day} , 0 , ${memberRemainAmount} , 0,${toFixedKR},${elc_price},${Number(amount) * 1000},${amount} , '${minername}',${insertId})`)
                                return { minerTable: insertId, member, transaction }
                            }
                        })
                        await Promise.all(inserstMiner)
                    } else {
                        //금액 틀린경우
                    }
                } else {
                    //다른 사용자
                    // await executeQuery(`insert into Transactions (action , status , extracode1,extracode2,extrastr1,extrastr2,member) values 
                    //     (6203,1310,${userAmount},${transaction},'${txID}','${userAddress}')`)
                }
            })
            /**
             * 타일 구매자 승인
             */
            await ece8110_tileList.map(async (value) => {
                const { userInputAddress, transaction, amount, minerCount, member, minername } = value;
                const userRequestPrice = Number(amount) * tronDecimal
                if (userInputAddress === userAddress) {
                    if (userRequestPrice === userAmount) {
                        console.log("=================TILE Purchase=================");
                        console.log(`VERIFY TRON User Address: ${userAddress}`);
                        console.log(`VERIFY TRON TX ID: ${txID}`);
                        console.log(`VERIFY TRON MEMBER ID: ${member}`);
                        console.log(`TRON TYPE : ${userTransaction.raw_data.contract[0].type}`);
                        console.log("=================TILE Purchase=================");
                        console.log("");
                        await executeQuery(`update Transactions set action  = 7242 ,updatedt=NOW()  where transaction = ${transaction}`)
                        const inserstMiner = await Array(minerCount).fill().map(async (count) => {
                            const amount = 1;
                            const minername = generateRandomString(2) + generateRandomCode(6)
                            const { affectedRows, insertId } = await executeQuery(`insert Miners (name , mineramount , tileamount , member) values ('${minername}' , ${amount} , ${Number(amount) * 1000} , ${member})`);
                            if (affectedRows !== 0) {
                                const memberAllRes = await getOffserDIAResourceData()
                                await executeQuery(`insert ResourceTransactions (resource , amount ,member,extracode,minercount) values 
                                (7602,${Math.floor(memberAllRes * amount)},${member},9910,${amount});`);
                                /**
                                 * 마이닝 활성화
                                 * 총 채굴량 
                                 * 현 채굴량
                                 * 마이너 갯수
                                 */
                                await executeQuery(`insert into Transactions (action , status , extracode1,extracode2,extrastr1,extrastr2,member,miner) values 
                                 (7235,1310,${Number(amount) * 1000},0,'${transaction}','${amount}',${member},${insertId}),
                                 (7602,${Math.floor(memberAllRes * minerCount)},${member},9910,${minerCount});`);
                                const { data: ELCPrice } = await axios.get(URL_LABK_ELCPRICE)
                                usd_price = await requestAPI_internationalCurrencyPrice_usdt()
                                elc_price = ELCPrice.data[0].ticker.latest
                                let elc_price_kr = (usd_price * elc_price)
                                const toFixedKR = elc_price_kr.toFixed(5);
                                const memberRemainAmount = (Number(MINERPRICE * amount)).toFixed(2);

                                await executeQuery(`insert MinerTransactions (transaction , member, minerlife , resourceamount , remainamount , offeramount , elcKRW , elcUSD , tileamount , mineramount ,name,miner) values
                                (${transaction} , ${member} , ${day} , 0 , ${memberRemainAmount} , 0,${toFixedKR},${elc_price},${Number(amount) * 1000},${amount} , '${minername}',${insertId})`)
                                return { minerTable: insertId, member, transaction }
                            }
                        })
                        await Promise.all(inserstMiner)
                    } else {
                        //금액 틀린경우
                    }
                } else {
                    //다른 사용자
                    // await executeQuery(`insert into Transactions (action , status , extracode1,extracode2,extrastr1,extrastr2,member) values 
                    //     (6203,1310,${userAmount},${transaction},'${txID}','${userAddress}')`)
                }
            })

        })
        console.log(`>>>>>>>>>>>>>>>>END NODE TRON MOINTER SCADULE<<<<<<<<<<<<<<<<<<`);

    })
})()
