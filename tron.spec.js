/**
 * tronGrid를 통해서 api key 받기
 */
const TronWeb = require('tronweb');
const TronGrid = require("trongrid")
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "0209833647c93b1e34f333b519c46d9f005fc9e0f332c74d3b87104f74c29a63";
const { appendFile, writeFile } = require('fs').promises;
const TRONWALLET = 'TVWcEHdHx3s1rJy8nCTvLnJAsrR6rTWmf6'
// const privateKey = "your private key";

const testAccount1 = { "privateKey": "A00420D94507C143CD82DCC284908D7435DEA2DCA434138A077DE32CE666BEA7", "publicKey": "0434D971B2F08CA53B708E95D6E9E7FD0801CF909297665F0A04F838C4B3A916EC8513E481C357A876AA1BAD91AB5E1D5A5CFA85D5C624EA56C2DC2BAB0E2CFF02", "address": { "base58": "TSob7eFAqN4Ax1qbWzqqjZJxmY3ikUMRmy", "hex": "41B8A87029F71D51A41261BB5B58CE62DB153A8DB8" } };
const testAccount2 = { "privateKey": "A629BBAFA446119D0163EF01FB7C4CECEFC15529601C9A6855757CB766279FA3", "publicKey": "049F2642CFEB25059671CE7AADC87A87449B3F8C6E07C8F2C9B929F67834C4C5496DA5C75FB98244592685845A366CD382A5FA5937D47A77307FE49A32247C18CD", "address": { "base58": "TEYppPY32D15xgmherMATLkkc3xdrTroPy", "hex": "41323C20AA571F9F5276DE14AC9E847F6C80C4ACE3" } };
const options = {
    // only_to: true,
    // only_confirmed: true,
    // fir
    limit: 2,
    order_by: 'timestamp,asc',
    // min_timestamp: Date.now() - 60000 // from a minute ago to go on
};
// '96e8ccd9-1048-448d-9d45-1887d30e267f'
(async () => {
    // const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
    // tronWeb.setHeader({ "TRON-PRO-API-KEY": process.env.TRON_PRO_API_KEY });
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
    const trongrid = new TronGrid(tronWeb)
    tronWeb.setHeader({ "TRON-PRO-API-KEY": "1eec9900-b417-426e-aa65-fb65615c7040" });
    // const accountInfo = await tronWeb.trx.getAccount(TRONWALLET)
    // const latestBlcok = await tronWeb.trx.getBlock("latest")
    // const brokerange = await tronWeb.trx.getBrokerage(TRONWALLET)
    const b1 = await trongrid.account.getTransactions(TRONWALLET, options)
    console.log(b.meta.fingerprint);
    console.log(b.data[0]);
    options.fingerprint = b.meta.fingerprint
    const b2 = await trongrid.account.getTransactions(TRONWALLET, options)
    // tronWeb.trx.getTransaction()
    // await writeFile("./transaction.json", JSON.stringify(b))
    // console.log(latestBlcok);
    // console.log(accountInfo)
    // await tronWeb.trx.getBalance(TRONWALLET)

    // const account = await tronWeb.createAccount();
    // await appendFile("./tronaccount.txt", JSON.stringify(account))
})()
//  //Example 2
//  const TronWeb = require('tronweb')
//  const tronWeb = new TronWeb({
//      fullHost: 'https://api.trongrid.io',
//      headers: { "TRON-PRO-API-KEY": 'your api key' },
//      privateKey: 'your private key'
//  })
//Example 1
// async function start() {
//     let trSend = await tronWeb.transactionBuilder.sendTrx("TWwnZgk83H9rFo4cn6P3qrDNGgokJMemvL", 5)
//     const trSendwithNote = await tronWeb.transactionBuilder.addUpdateData(trSend, "some t2", 'utf8');
//     console.log(trSend)
//     const signedTransaction = await tronWeb.trx.sign(trSendwithNote);
//     const sendRaw = await tronWeb.trx.sendRawTransaction(signedTransaction);
// }

// start()
// console.log ( trSend )

// sendTransaction = await tronWeb.transactionBuilder.sendTrx('TWwnZgk83H9rFo4cn6P3qrDNGgokJMemvL', 1);    
// sendTransaction.raw_data.data = 'hex message';