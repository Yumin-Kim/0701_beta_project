const WebSocket = require('ws');
const xrpl = require('xrpl')
const sql = require("./config/sql.js")
const { executeQuery } = require("./config/db.js")
const XRPWSURL = "wss://s1.ripple.com:51233"
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
                // "raQwCVAJVqjrVm1Nj5SFRcX8i22BhdC9WA"
            ]
        }

        ws.send(JSON.stringify(command));
    });

    ws.on('message', async (event) => {
        const parsed_data = JSON.parse(event)
        if (parsed_data.transaction !== undefined && parsed_data.type === "transaction") {
            console.log("[WebSocket XRP]Sign Transaction");
            // console.log(parsed_data);
            const { Account: to, Amount: amount, Destination: from, hash: txHash, validated, DestinationTag } = parsed_data.transaction
            const requestMinerRecipt = await executeQuery(`select * from Transactions where action in (7211,7131) and extrastr2 = '${DestinationTag}' order by transaction desc limit 1`);
            const mapRequestMinerReceipt = requestMinerRecipt.map((v) => {
                // extrastr1 >> 1000000 === 1xrp
                if (Number(v.extrastr1) * 1000000 === Number(amount)) {
                    if (v.action === 7211) {
                        return { action: v.action, member: v.member, minerCount: v.extracode2, amount: v.extrastr1, xrpAmout: amount, transaction: v.transaction }
                    } else {
                        return { action: v.action, member: v.member, tileCount: v.extracode2, extrastr: JSON.parse(v.extrastr3), amount: v.extrastr1, xrpAmout: amount, transaction: v.transaction }
                    }
                }
            })
            // 사용자 정보 변경
            // 리플 거래 승인 쿼리
            const filterMemberInfo = mapRequestMinerReceipt.filter(v => v !== undefined)
            if (filterMemberInfo.length !== 0) {
                console.log("입금 대상을 찾았습니다.");
                const updateMemberInfo = await filterMemberInfo.map(async (value) => {
                    const { member, minerCount, amount, xrpAmout, transaction, action } = value
                    if (action === 7211) {
                        await executeQuery(sql.xrpWebsocket.v1.updateECE8220({ transaction }))
                        console.log(`
[채굴기] 리플 전송 확인 완료
txHash : ${txHash}                        
member : ${member}
transaction : ${transaction}
                        `)
                    } else {
                        const data = {
                            land: value.extrastr,
                            txHash
                        }
                        await executeQuery(sql.xrpWebsocket.v1.updateECE8120({ transaction }))
                        let bulkupInsert = `insert into Lands (landkey,member,extracode) values `
                        const insertQuery = value.extrastr.map((landIndex) => `(${landIndex},${member},7120)`)
                        bulkupInsert += insertQuery.join(",")
                        const { affectedRows: bulkAffectRows } = await executeQuery(bulkupInsert)
                        console.log(`
[타일] 리플 전송 확인 완료
txHash : ${txHash}                        
member : ${member}
bulkAffectRows : ${bulkAffectRows}
transaction : ${transaction}
                        `);
                    }
                    await executeQuery(sql.xrpWebsocket.v1.findMemberAndObserveTransaction({ transaction, xrpAmout, txHash, from, member }))
                })
            } else {

                await executeQuery(sql.xrpWebsocket.v1.notSelectMemberAndObserveTransaction({ to, amount, txHash }))
            }
        }
    });

})()


