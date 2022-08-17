// 채굴기 구매시 구매승인 상태 변경
// 토지 구매시 구매 승인 상태 변경 => 
const WebSocket = require('ws');
const xrpl = require('xrpl')
/**
 * 계좌 조회
 * 해당 계좌 트랜잭션 유무 파악
 * 
 */
// const generateXRP_wallet = {
//     publicKey: 'EDEEE94E57402D49CF9020EBEE2F223D5412325C665227A03DC2AF489958565AF8',
//     privateKey: 'ED3B82EDACC451FBA9649E0CEAB9770104E25E83FF9AF547FDBED29F865CC3F501',
//     classicAddress: 'rLGEbCCZRTZcw7Wt7uGCP9VAUj9hCNf5uu',
//     seed: 'sEdS1tXNWnvGD3eJsTzWcFHR8w15Y5K'
// }
async function main() {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect();
    const fund_result = await client.fundWallet()
    const test_wallet_fund = fund_result.wallet
    // const test_wallet = xrpl.Wallet.generate()
    const response = await client.request({
        "command": "account_info",
        "account": fund_result.wallet.address,
        "ledger_index": "validated"
    })
    console.log(response);
    client.request({
        "command": "subscribe",
        "streams": ["ledger"]
    })
    client.on("ledgerClosed", async (ledger) => {
        console.log(`Ledger #${ledger.ledger_index} validated with ${ledger.txn_count} transactions!`)
    })
    // console.log(test_wallet);
    // console.log(test_wallet_fund);
    client.disconnect()
}
async function do_subscribe() {
    const sub_response = await api_request({
        command: "subscribe",
        accounts: ["rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"]
    })
    if (sub_response.status === "success") {
        console.log("Successfully subscribed!")
    } else {
        console.error("Error subscribing: ", sub_response)
    }
}
// Add do_subscribe() to the 'open' listener for socket

const log_tx = function (tx) {
    console.log(tx.transaction.TransactionType + " transaction sent by " +
        tx.transaction.Account +
        "\n  Result: " + tx.meta.TransactionResult +
        " in ledger " + tx.ledger_index +
        "\n  Validated? " + tx.validated)
}
// main()

const ws = new WebSocket('wss://s.altnet.rippletest.net:51233', {
    perMessageDeflate: false
});
ws.on('open', function () {
    console.log('connected');
    const command = {
        "id": "Example watch one account and all new ledgers",
        "command": "subscribe",
        "streams": [
            "ledger"
        ],
        "accounts": [
            "r3GghreSS8HhT84iVtfaQNER6N65Pv3hAn"
        ]
    }
    ws.send(JSON.stringify(command));
});

ws.on('message', function (event) {
    console.log('Got message from server:', JSON.parse(event))
    const parsed_data = JSON.parse(event)
});