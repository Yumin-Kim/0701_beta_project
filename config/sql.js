const emailLimitCount = 600;
module.exports = {
    utils: {
        findByMember: ({ member }) => `select * from Members where member = ${member}`
    },
    ece2310: {
        findByMember: ({ email }) => `select member,email from Members where email = '${email}' limit 1`,
        /**
         * action 이메일 승인 번호 요청
         * status 회원 상태 회원, 비회원
         */
        insertEmailAuthCodeOnMember: ({ member, validEmail, code }) => `insert into Transactions (action, status , member, extrastr1, extrastr2) values (9314 ,9120, ${member} ,'${validEmail}', '${code}');`,
        insertEmailAuthCode: ({ email, code }) => `insert into Transactions (action, status , extrastr1, extrastr2) values (9314 ,9110,'${email}', '${code}');`,
    },
    ece2320: ({ email, code }) => `select  action,extrastr1 as 'email', member , status from Transactions where extrastr1 = '${email}' and extrastr2 = '${code}' and action = 9314 and timestampdiff(second, createdt, now()) < ${emailLimitCount}`,
    ece2323: ({ email, gender, firstname, lastname, pin }) => `INSERT INTO Members (email, firstname, lastname, gender, pin) VALUES ('${email}','${firstname}','${lastname}',${gender},hex(aes_encrypt('${pin}','ELC')));`,
    ece2324: ({ member }) => `select * from Members where member = ${member}`,
    ece2330: ({ member, pin }) => `SELECT * FROM Members where  CONVERT(AES_DECRYPT(unhex(pin), 'ELC') using utf8) = '${pin}' and member = ${member}`,
    ece2332: {
        findByMember: ({ email }) => `select member,email from Members where email = '${email}' limit 1`,
        /**
         * action 비밀번호 재설정을 위한 승인 번호 요청
         * status 회원 상태 회원
         */
        insertEmailAuthCodeOnMember: ({ member, validEmail, code }) => `insert into Transactions (action, status , member, extrastr1, extrastr2) values (9315 ,9120, ${member} ,'${validEmail}', '${code}');`,
    },
    ece2333: ({ email, code }) => `select  action,extrastr1 as 'email', member from Transactions where extrastr1 = '${email}' and extrastr2 = '${code}' and action = 9315 and timestampdiff(second, createdt, now()) < ${emailLimitCount}`,
    ece2334: {
        updatePin: ({ pin, member }) => `UPDATE Members SET pin = hex(aes_encrypt('${pin}','ELC')) WHERE member = ${member};`,
        findByMember: ({ member }) => `select * from Members where member = ${member}`
    },
    ece2400: ({ email, pin }) => `SELECT member FROM Members where  CONVERT(AES_DECRYPT(unhex(pin), 'ELC') using utf8) = '${pin}' and email = '${email}'`,
    ece3300: {
        findLandsByAroundLand: ({ minLandIndex, maxLandIndex }) => `(select * from Lands where landkey >= ${minLandIndex} and landkey <= ${maxLandIndex})`
    },
    ece3400: {
        /**step1
         * 채굴 요청 시점 기록 
         * extrastr1 => 이전 채굴 정보 기록 
         */
        insertRemainMiningTransaction: ({ member }) => `insert into Transactions (action,status,member,extrastr1) 
        values (9901 , 1310 , ${member} ,
            (select createdt from Transactions as i where action = 7223 and member=${member} 
                order by transaction asc limit 1));`,
        /**step2 */
        findAllByCurrentMinigResource: ({ member }) => `
                select sum(ResourceTransactions.amount) as 'amount',ResourceTransactions.resource as 'category' from ResourceTransactions 
                where (createdt BETWEEN 
                    (select createdt as 'before' from Transactions as a where action=7223 and member = ${member} order by transaction asc limit 1) 
                    and 
                    (select createdt as 'after' from Transactions as b where action=9901 and member = ${member} order by transaction desc limit 1)) 
                    and member = ${member} group by ResourceTransactions.resource ;
                    `,
        /**step3 */
        updateMiningResource: ({ member }) => `update Transactions as t left join (select transaction from Transactions where action = 7223 and member = ${member}) as b 
            on t.transaction = b.transaction  
            set action = 7224 where t.transaction = b.transaction;`,
        findAllMiningInfo: ({ member }) =>
            `select sum(rt.amount) as 'amount',rt.resource as 'category' from ResourceTransactions as rt left join 
        (select transaction from Transactions where action = 7224 and member = ${member}) as t
        on rt.transaction = t.transaction where member = ${member} and rt.transaction is not null group by rt.resource;`,
    },
    ece3500: {
        findByMemberResource: ({ member }) => `select sum(rt.amount) as 'amount',rt.resource from ResourceTransactions as rt left join 
        (select transaction from Transactions where action = 7224 and member = ${member}) as t
        on rt.transaction = t.transaction where member = ${member} and rt.transaction is not null and t.transaction is not null group by rt.resource;`,
        findMemberByMinerAndTiles: ({ member }) => `(select sum(extracode2) as 'amount',action from Transactions where member = ${member} and action = 7132)
        union all
        (select sum(extracode2) as 'amount' , action from Transactions where member = ${member} and action = 7212)`,
    },
    ece5100: ({ member }) => `select sum(rt.amount) as 'amount',rt.resource from ResourceTransactions as rt left join 
    (select transaction from Transactions where action = 7224 and member = ${member}) as t
    on rt.transaction = t.transaction where member = ${member} and rt.transaction is not null group by rt.resource;`,
    ece6100: {
        findTransactionByResoureceTransactions: ({ member }) => `SELECT DATE_FORMAT(createdt, '%Y.%m.%d') as createdt,transaction,extracode1 as 'tileCount' , extracode2 as 'minerCount'  FROM Transactions where action = 7224 and member = ${member} group by createdt , transaction order by  transaction desc;`,
        findResourceTrnsactionByResouce: ({ transaction }) => `SELECT resource,amount,tiles,minercount FROM  ResourceTransactions where transaction =${transaction}`
    },
    ece7100: ({ member }) => `select member, email,firstname,lastname,walletaddress,gender from Members where member = ${member}`,
    ece7200: {
        updateMemberInfo: ({ member, email, firstname, lastname, walletaddress, gender }) => `update Members set email = '${email}' , 
      firstname = '${firstname}' ,lastname = '${lastname}' , walletaddress = '${walletaddress}' , gender = ${gender} where member = ${member}`,
        updateMemberPin: ({ member, pin }) => `UPDATE Members SET pin = hex(aes_encrypt('${pin}','ELC')) WHERE member = ${member};`,
        findByMember: ({ member }) => `select member, email,firstname,lastname,walletaddress,gender from Members where member = ${member}`,
    },

    /** 토지 판매자 정보 제공
     * action 판매자 장보
     * extracode1 리플(현) 크레딧 중 하나
     * extrastr1 리플 주소
     * extrastr2 현재 가격
     */
    ece8110: () => `select extracode1 as 'purchaseway' , extrastr1 as 'walletaddress' , extrastr2 as 'currentamount' from Transactions where action = 8201 order by transaction desc limit 1`,
    ece8120: {
        requsetBuyTilesTransaction: ({ member, tile, tileInfo, tileLength, xrp, code }) => `insert into Transactions (action , status , extracode1,extracode2,extrastr1 , extrastr2 , extrastr3,member,land) 
        values (7131 , 1310 , ${tile} , ${tileLength} ,'${xrp}','${code}' ,'${JSON.stringify(tileInfo)}' , ${member},${tile})`,
        directBuyTilesTransaction: ({ member, tile, tileInfo, tileLength }) => `insert into Transactions (action , status , extracode1,extracode2,extrastr3,member,land) 
        values (7132 , 1310 , ${tile} , ${tileLength} , '${JSON.stringify(tileInfo)}' , ${member},${tile})`,
        insertTile_direct: ({ landIndex, member }) => `insert into Lands (landkey,member,extracode) values (${landIndex},${member},7110)`,
        insertTile_requset: ({ landIndex, member }) => `insert into Lands (landkey,member,extracode) values (${landIndex},${member},7120)`,
    },
    ece8210: () => `select extracode1 as 'purchaseway' , extrastr1 as 'walletaddress' , extrastr2 as 'currentamount' from Transactions where action = 8202 order by transaction desc limit 1`,
    ece8211: ({ member }) => `select action,extracode1,extrastr1 as "xrp",extracode2 as "minercount" ,createdt from Transactions where action in (7211 , 7212) and member = ${member} order by transaction desc`,
    /** 채굴기 구매 
     * action 채굴기 구매 요청
     * extracode1 리플 승인 대기
     * extracode2 채굴기 갯수
     * extrastr1 리플 가격
     * extrastr2 사용자 지갑 명
     */
    // ece8220: ({ member, miner, xrp, memberAddress }) => `insert into Transactions (action , status,member,extracode1,extracode2,extrastr1,extrastr2) values (7211  , 1310 , ${member}, 6101 ,${miner},${xrp},'${memberAddress}' );`,
    ece8220: ({ member, miner, xrp, code }) => `insert into Transactions (action , status,member,extracode1,extracode2,extrastr1,extrastr2) values (7211  , 1310 , ${member}, 6101 ,${miner},${xrp},'${code}' );`,
    ece9100: {
        findTransactionList: ({ member }) => `select transaction , DATE_FORMAT(createdt, '%Y.%m.%d') as createdt from Transactions where action in (7131 , 7132 , 7212,7211) and member = ${member}  group by createdt,transaction order by transaction desc;`,
        selectDetailTransaction: ({ transaction }) => `select action , extracode1,extracode2,extrastr1,extrastr2,extrastr3,member from Transactions where transaction = ${transaction}`
    },
    /*
        임의 토지 구매
        action 7110 소유
        status 1310 데이터 상태
        extracode1 시작 타일 또는 선택 타일중 가장 작은 값
        extracode2 타일 수 
        extrastr1
        extrastr2
        extrastr3 json 정보 저장 [123,1234,1235]
        land 
    */
    miner_buyToTiles: ({ member, jsondata }) => `insert into Transactions (action , status , member , extracode1,extracode2,extrastr3) value (7110 ,1310,${member},${jsondata[0]},${jsondata.length},'${JSON.stringify(jsondata)}')`,
    /** 채굴기 구매(요청)
     * 
     */
    miner_requestToMiner: ({ member, miner, xrp }) => `insert into Transactions (action , status,member,extracode1,extrastr1,extrastr2) values (7211  , 1310 , ${member}, 6101 ,${miner},${xrp} );`,
    /** 채굴기 구매 (승인)
     * 
    */
    miner_buyToSuccessMiner: ({ member, miner, xrp }) => `insert into Transactions (action , status,member,extracode1,extrastr1,extrastr2) values (7212  , 1310 , ${member}, 6102 ,${miner},${xrp} );`,
    // miningToResource:()=>`insert ingo ResourceTrnasctions(action , status , member , )`
    miner_getMinerOnTiles: () => `    select t2.member , sum(t1.extracode2) as 'tileCount',t2.minerCount  from Transactions as t1 left join 
    (select member , sum(extracode2) as 'minerCount' from Transactions where action = 7212   group by member) as t2
    on t1.member = t2.member where t1.action = 7132  and t2.minerCount is not null  group by t1.member`,
    admin: {
        insertTileSellerInfo: ({ xrpWallet, xrp }) => `insert into Transactions (action ,status,extracode1,extrastr1,extrastr2) values(8201,1310,6520,'${xrpWallet}','${xrp}')`,
        insertMinerSellerInfo: ({ xrpWallet, xrp }) => `insert into Transactions (action ,status,extracode1,extrastr1,extrastr2) values(8202,1310,6520,'${xrpWallet}','${xrp}')`,
    },
    xrpWebsocket: {
        v1: {
            updateECE8220: ({ transaction }) => `
            update Transactions 
            set action = 7212 , extracode1 = 6102 , updatedt=NOW() 
            where transaction = ${transaction};
            `,
            updateECE8120: ({ transaction }) => `
            update Transactions 
            set action = 7132 , extracode1 = 6102 , updatedt=NOW() 
            where transaction = ${transaction};
            `,
            /** 사용자 입금 내용 한번 더 기록  extracode1 BIGIN T(20) 변경
             * 
             * action : 6104
             * extracode1 입금 xrp >> 1000000
             * extrastr1 txHash
             * extrastr2 from
             */
            notSelectMemberAndObserveTransaction: ({ to, amount, txHash }) => `insert into Transactions (action , status, extracode1,extrastr1,extrastr2) 
            values (6104,1310,${amount} , '${txHash}' , '${to}')`,
            /** 사용자 입금 내용 한번 더 기록
             * action : 6102
             * extracode1 transaction id
             * extracode2 입금 xrp >> 1000000
             * extrastr1 txHash
             * extrastr2 from
             * member member ID
             */
            findMemberAndObserveTransaction: ({ transaction, xrpAmout, txHash, from, member }) => `insert into Transactions (action , status, extracode1,extracode2,extrastr1,extrastr2,member) 
            values (6102,1310,${transaction},${xrpAmout} , '${txHash}' , '${from}' ,${member})`
        },
        /** 토지 구매 승인
         *  
         */
        findByMemberBuyRequestTilies: ({ member }) => `select transaction , extrastr3 as 'tiles',extracode2 as 'tileCount' , member from Transactions where action = 7131 and member = ${member}`,
        findByMemberAllBuyRequestTilies: () => `select transaction , extrastr3 as 'tiles' , extracode2 as 'tileCount' , member from Transactions where action = 7131`,
        updateLandByOwner: ({ landList, member }) => `update Lands set isowner = 7110 , extrastr1 = ${member} where land in (${landList})`,
        updateTileByMember: ({ address }) => ``,
        updateMinerByMember: ({ address }) => ``,
        /** 무조건 승인
         */
        updateMinerByAllMember_NoCash: () => `
        update Transactions as t left join
        (select transaction from Transactions where action= 7211) as t1
        on t.transaction = t1.transaction
        set action = 7212 , extracode1 = 6102 , updatedt = NOW() 
        where action = 7211;
`,
        updateTileByAllMember_NoCash: () => `
        update Transactions as t1 left join
        (select transaction from Transactions where action = 7131) as t
        on t1.transaction = t.transaction
        set action = 7132 , updatedt = NOW()  where action = 7131;
        `,
    }
}