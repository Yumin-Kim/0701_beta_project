const WebSocket = require('ws');
const xrpl = require('xrpl')
const sql = require("./config/sql.js")
const { executeQuery } = require("./config/db.js")
/**
 * rUfu2PWiaaRPGW7xt17zHLJVcKnqeaoHVv
 * rLdEdyo4YYMUaCAGwPJauDSiheoSdqxczM 
 * rGHfaBmr2hvZwuDkFc8N2YCigo36BJ1yqd
 */
const fundWalletTest = {
    wallet: {
        publicKey: 'EDABDFDF9AAE8B29ACE58806DBCDD68FAF48D3ED05B4595DAF9F6F15D24A3E7B96',
        privateKey: 'ED53227ABE7E7862EA266789715CB616BC0087043FE83C752E5A84BC1BEFA4036B',
        classicAddress: 'rs1ReurnZAWtc5HR44xSn2HgTxwFG24tE1',
        seed: 'sEdTkywtuR2nU7WRa3ngEEbpQHBzAiY'
    },
    balance: 1000
}
const generateWalletTest = {
    wallet: {
        publicKey: 'ED08806197E294D7689FE6BA8FD62F2FACB80C217E016D505764CAE60A5A46BE54',
        privateKey: 'EDAE77442EA6EEB5E99CF12607B7A23A9A17537BC761A1DB314FECA50F2A1F978E',
        classicAddress: 'rrpDRARtXvcQ26ZvHCPuC5fUYumvAe7UhX',
        seed: 'sEdSvCwZh82XvHEfhzwt7xqGuQaYCuB'
    },
    balance: 1000
}
const XRPWSURL = process.env.NODE_ENV !== "PRD" ? "wss://s.altnet.rippletest.net:51233" : "wss://s1.ripple.com:51233"
let XRPWALLETADDRESS;


const ws = new WebSocket(XRPWSURL, {
    perMessageDeflate: false
});



async function main() {
    const client = new xrpl.Client(XRPWSURL)
    await client.connect();
    const test_wallet = await xrpl.Wallet.generate()
    // const fund_result = await client.fundWallet()
    const wallet1 = await xrpl.Wallet.fromSeed(test_wallet.seed)
    // const wallet2 = xrpl.Wallet.fromSeed(fundWalletTest.wallet.seed)
    console.log('wallet1 >>>', wallet1.address);
    // let to = await client.getBalances("rwXh4bPAjbaRW6AuvBs1c7Rm9z8zm13FfG");

    // console.log('wallet2 >>>', to);
    // await sendTransaction({ client, wallet1, wallet2, price: "1000000" })
    client.disconnect()
    process.exit()
}
// main()
(async () => {
    const [data] = await executeQuery(sql.ece8210())
    let { walletaddress, currentamount } = data
    XRPWALLETADDRESS = walletaddress
    currentamount = Number(currentamount) * 1000000
    var to = "rUfu2PWiaaRPGW7xt17zHLJVcKnqeaoHVv";
    var amount = 1
    const requestMinerRecipt = await executeQuery(`select * from Transactions where action = 7211 and extrastr2 = '${to}' order by transaction desc`);
    let selectMember = {};
    const a = requestMinerRecipt.map((v) => {
        if (v.extracode2 === amount) {
            return { member: v.member, minerCount: v.extrastr1, amount: v.extrastr1, }
        }
    })
    console.log(a);
    // ws.on('open', function () {
    //     console.log(`[XRP INFO Admin Address] ${XRPWALLETADDRESS}`);
    //     console.log(`[XRP INFO URL] ${XRPWSURL}`);
    //     const command = {
    //         "id": "Example watch one account and all new ledgers",
    //         "command": "subscribe",
    //         "streams": [
    //             "ledger"
    //         ],
    //         "accounts": [
    //             XRPWALLETADDRESS
    //         ]
    //     }

    //     ws.send(JSON.stringify(command));
    // });

    // ws.on('message', async (event) => {
    //     const parsed_data = JSON.parse(event)
    //     if (parsed_data.transaction !== undefined && parsed_data.type === "transaction") {
    //         console.log("[WebSocket XRP]Sign Transaction");
    //         const { Account: from, Amount: amount, Destination: to, hash: txHash, validated } = parsed_data.transaction

    //         console.log(from);
    //         console.log(amount);
    //         console.log(to);
    //         console.log(txHash);
    //         // await executeQuery(`select `)
    //     }
    // });

})()


async function sendTransaction({ client, wallet1, wallet2, price }) {
    let from = await client.getBalances(wallet1.address);
    let to = await client.getBalances(wallet2.address);
    console.log("===================Before Sign Transaction===============");
    console.log(from);
    console.log(to);
    console.log("===================Before Sign Transaction===============");
    const prepared = await client.autofill({
        "TransactionType": "Payment",
        "Account": wallet1.address,
        "Amount": xrpl.xrpToDrops(price),
        "Destination": wallet2.address
    })
    const max_ledger = prepared.LastLedgerSequence
    console.log("Prepared transaction instructions:", prepared)
    console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP")
    console.log("Transaction expires after ledger:", max_ledger)


    const signed = wallet1.sign(prepared)
    console.log("Identifying hash:", signed.hash)
    console.log("Signed blob:", signed.tx_blob)

    const tx = await client.submitAndWait(signed.tx_blob)

    console.log("Transaction result:", tx.result.meta.TransactionResult)
    console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
    from = await client.getBalances(wallet1.address);
    to = await client.getBalances(wallet2.address);
    console.log(from);
    console.log(to);
}