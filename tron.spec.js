/**
 * tronGrid를 통해서 api key 받기
 */
const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const { appendFile } = require('fs').promises;
// const privateKey = "your private key";

const testAccount1 = { "privateKey": "A00420D94507C143CD82DCC284908D7435DEA2DCA434138A077DE32CE666BEA7", "publicKey": "0434D971B2F08CA53B708E95D6E9E7FD0801CF909297665F0A04F838C4B3A916EC8513E481C357A876AA1BAD91AB5E1D5A5CFA85D5C624EA56C2DC2BAB0E2CFF02", "address": { "base58": "TSob7eFAqN4Ax1qbWzqqjZJxmY3ikUMRmy", "hex": "41B8A87029F71D51A41261BB5B58CE62DB153A8DB8" } };
const testAccount2 = { "privateKey": "A629BBAFA446119D0163EF01FB7C4CECEFC15529601C9A6855757CB766279FA3", "publicKey": "049F2642CFEB25059671CE7AADC87A87449B3F8C6E07C8F2C9B929F67834C4C5496DA5C75FB98244592685845A366CD382A5FA5937D47A77307FE49A32247C18CD", "address": { "base58": "TEYppPY32D15xgmherMATLkkc3xdrTroPy", "hex": "41323C20AA571F9F5276DE14AC9E847F6C80C4ACE3" } };


(async () => {
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
    tronWeb.setHeader({ "TRON-PRO-API-KEY": process.env.TRON_PRO_API_KEY });
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