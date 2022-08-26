const WebSocket = require('ws');
const xrpl = require('xrpl')
const sql = require("./config/sql.js")
/**
 * Test Admin rUfu2PWiaaRPGW7xt17zHLJVcKnqeaoHVv
 * rUfu2PWiaaRPGW7xt17zHLJVcKnqeaoHVv
 * rLdEdyo4YYMUaCAGwPJauDSiheoSdqxczM 
 * rGHfaBmr2hvZwuDkFc8N2YCigo36BJ1yqd
 */
const fundWalletTest = {
    publicKey: 'EDD4F9708A95FE99037F90D41C526AEF9D36D04D5637C3057B2B1A09EA8FA616FD',
    privateKey: 'EDC09323D204A369E363AD0B6896888F02F60B3640C34E3F93E56BCD7C681AC153',
    classicAddress: 'rnMda7o4oDHxj944LmFovNuazzHvdTTMeC',
    seed: 'sEdSqHJh6ekcm87MtEhTq5rN15ou8wq'
}
const generateWalletTest = {
    wallet: {
        ublicKey: 'EDD615924DFA0EDA8C5A23E7E36F7FB0D9D71BDBD443EEAF3565AFFB115A8E3C95',
        privateKey: 'ED3E3DF93D23E3117FCEA93131FBD631F17CA94C864EE440C6B8C51CC8D1ECE48A',
        classicAddress: 'rMpqxa58sUihrmcQMAZM1A8KwbVvwWFRBy',
        seed: 'sEd7XNnDQuRA5nS5he8oLowVfoy11GP'
    },
    balance: 1000
}
const XRPWSURL = process.env.NODE_ENV !== "PRD" ? "wss://s.altnet.rippletest.net:51233" : "wss://s1.ripple.com:51233"
let XRPWALLETADDRESS;


const ws = new WebSocket(XRPWSURL, {
    perMessageDeflate: false
});



async function main() {
    const client = await new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    const member1 = {
        wallet: {
            publicKey: 'EDD629E5EDB1288ABB6D26DA207C51D0AF486B3E5AB36921546A959C6F4DA75024',
            privateKey: 'EDFB1A6656B68E1164D298C73C147986353237C85D13E418DD41377107DFC6DE99',
            classicAddress: 'rnuFTg8oSQSoAGktnXQnnWtEkSdjmTYZ2b',
            seed: 'sEdT9yrgZvU7mEsrCnZ8ybZqkoJt6xb'
        },
        balance: 1000
    };
    const member2 = {
        wallet: {
            publicKey: 'EDC101E61AB9C329B1532C83036312DB283DF8DEBE77CC6CF09C159C864D4C49D6',
            privateKey: 'EDFD096ED38F1FC552A661FBACEAEF64725C9ADFE748CB1D2DC14F5BC61B997DC7',
            classicAddress: 'rDdsvD13DPWAFNJVTufy8JXuPACqXrTSzM',
            seed: 'sEdSxfLrUTJzosLps4xfu5kCcrAzRAS'
        },
        balance: 1000
    };
    const member3 = {
        wallet: {
            publicKey: 'ED3E8467F8ECADEFAD6C8CC63E66BABE81433315DA2DAE1D5CF0E4AD5872B89A8E',
            privateKey: 'ED993D7E081F269FEB1C78853A78DC1EF3617CD10010CBA4890D0A7548753C221F',
            classicAddress: 'rBPBneG96J5qDgRq1RYC82cJuhB4joywwg',
            seed: 'sEd7YZnFWzFVwUMQdVkUwXDCFTMXhE4'
        },
        balance: 1000
    };
    await client.connect();
    // const fund_result = await client.fundWallet()
    const memberWallet1 = xrpl.Wallet.fromSeed(member1.wallet.seed)
    const memberWallet2 = xrpl.Wallet.fromSeed(member2.wallet.seed)
    const memberWallet3 = xrpl.Wallet.fromSeed(member3.wallet.seed)
    // console.log(fund_result);
    // console.log('wallet1 >>>', fund_result.balance);
    // console.log('wallet1 >>>', wallet1);
    // console.log('wallet1 >>>', wallet2);
    // console.log('wallet1 >>>', memberWallet1.address);
    // console.log('wallet1 >>>', memberWallet2.address);
    // console.log('wallet1 >>>', memberWallet3.address);
    // console.log('wallet1 >>>', wallet2.address);
    const a1 = await client.getBalances(memberWallet1.address)
    const a2 = await client.getBalances(memberWallet2.address)
    const a3 = await client.getBalances(memberWallet3.address)
    console.log(memberWallet1.address, a1);
    console.log(memberWallet2.address, a2);
    console.log(memberWallet3.address, a3);
    // console.log('wallet1 >>>', wallet1.wallet.address);
    // let to = await client.getBalances("rfw6aaLSJ9YnjwYD1poeaPDv9ypULmVTpx");

    // console.log('wallet2 >>>', to);
    // await sendTransaction({ client, wallet1: memberWallet3, wallet2: "raNdXUYutrKKiHjBcb9ZKnrKp5dFry75tE", price: "384" })
    client.disconnect()
    process.exit()
}
main()
async function sendTransaction({ client, wallet1, wallet2, price }) {
    console.log(`from : ${wallet1.address}`);
    console.log(`to : ${wallet2}`);
    let from = await client.getBalances(wallet1.address);
    console.log("===================Before Sign Transaction===============");
    console.log(from);
    console.log("===================Before Sign Transaction===============");
    const prepared = await client.autofill({
        "TransactionType": "Payment",
        "Account": wallet1.address,
        "Amount": xrpl.xrpToDrops(price),
        "Destination": wallet2
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
    to = await client.getBalances(wallet2);
    console.log(from);
    console.log(to);
}