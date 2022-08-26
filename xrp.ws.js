const WebSocket = require('ws');
const xrpl = require('xrpl')
const sql = require("./config/sql.js")
const { executeQuery } = require("./config/db.js")
const XRPWSURL = process.env.NODE_ENV !== "PRD" ? "wss://s.altnet.rippletest.net:51233" : "wss://s1.ripple.com:51233"
let XRPWALLETADDRESS;
// Address
// raNdXUYutrKKiHjBcb9ZKnrKp5dFry75tE
// Secret
// snbkmm3TDbtL4QKwVK6kWCtASDo8m
// Balance
// 1,000 XRP

const ws = new WebSocket(XRPWSURL, {
    perMessageDeflate: false
});
(async () => {
    const [data] = await executeQuery(sql.ece8210())
    let { walletaddress, currentamount } = data
    XRPWALLETADDRESS = walletaddress
    var to = "rUfu2PWiaaRPGW7xt17zHLJVcKnqeaoHVv";
    var amount = 1024000000;

    ws.on('open', function () {
        console.log(`[XRP INFO Admin Address] ${XRPWALLETADDRESS}`);
        console.log(`[XRP INFO URL] ${XRPWSURL}`);
        const command = {
            "id": "Example watch one account and all new ledgers",
            "command": "subscribe",
            "streams": [
                "ledger"
            ],
            "accounts": [
                `${XRPWALLETADDRESS}`
            ]
        }

        ws.send(JSON.stringify(command));
    });

    ws.on('message', async (event) => {
        const parsed_data = JSON.parse(event)
        // console.log(parsed_data);
        if (parsed_data.transaction !== undefined && parsed_data.type === "transaction") {
            console.log("[WebSocket XRP]Sign Transaction");
            const { Account: to, Amount: amount, Destination: from, hash: txHash, validated, DestinationTag } = parsed_data.transaction
            const requestMinerRecipt = await executeQuery(`select * from Transactions where action = 7211 and extrastr2 = '${DestinationTag}' order by transaction desc`);
            const mapRequestMinerReceipt = requestMinerRecipt.map((v) => {
                // extrastr1 >> 1000000 === 1xrp
                if (Number(v.extrastr1) * 1000000 === Number(amount)) {
                    return { member: v.member, minerCount: v.extracode2, amount: v.extrastr1, xrpAmout: amount, transaction: v.transaction }
                }
            })
            // 사용자 정보 변경
            // 리플 거래 승인 쿼리
            const filterMemberInfo = mapRequestMinerReceipt.filter(v => v !== undefined)
            if (filterMemberInfo.length !== 0) {
                console.log("입금 대상을 찾았습니다.");
                const updateMemberInfo = await filterMemberInfo.map(async (value) => {
                    const { member, minerCount, amount, xrpAmout, transaction } = value
                    await executeQuery(`
                    update Transactions 
                    set action = 7212 , extracode1 = 6102 , updatedt=NOW(),extrastr3 = '["${txHash}"]' 
                    where transaction = ${transaction};
                    `)
                    /**
                     * 사용자 입금 내용 한번 더 기록
                     * action : 6102
                     * extracode1 transaction id
                     * extracode2 입금 xrp >> 1000000
                     * extrastr1 txHash
                     * extrastr2 from
                     * member member ID
                     */
                    await executeQuery(`insert into Transactions (action , status, extracode1,extracode2,extrastr1,extrastr2,member) 
                    values (6102,1310,${transaction},${xrpAmout} , '${txHash}' , '${from}' ,${member})`)
                })
            } else {
                /**
                      * 사용자 입금 내용 한번 더 기록
                      * action : 6104
                      * extracode1 입금 xrp >> 1000000
                      * extrastr1 txHash
                      * extrastr2 from
                      */
                await executeQuery(`insert into Transactions (action , status, extracode1,extrastr1,extrastr2) 
                values (6104,1310,${amount} , '${txHash}' , '${from}')`)
            }
        }
    });

})()