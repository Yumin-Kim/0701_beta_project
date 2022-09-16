const { sendMail } = require("../config/aws.ses.js");
const { executeQuery } = require("../config/db.js");
const { resultResponseFormat, resultMSG } = require("../config/result.js");
const sql = require("../config/sql.js");
const { ece2000, intergrateMSG } = resultMSG
const router = require("express").Router()
const MAINSENDER = ' ecoinsbay" <ecoinsbay@ecoinsbay.net>'
const SENDMAILTITLE = "ELC Miner on our jejuiland 인증 코드"
/**
 * 이메일 인증 코드 요청
 */
router.post("/ece2310", async (req, res) => {
    try {
        const { email } = req.body;
        if (email === undefined) throw new Error(ece2000.ece2310.failure)
        const [data] = await executeQuery(sql.ece2310.findByMember({ email }))
        const code = generateRandomCode(6);
        console.log(code)
        if (data !== undefined) {
            const { member, email: validEmail } = data
            await executeQuery(sql.ece2310.insertEmailAuthCodeOnMember({ member, validEmail, code }))
        } else {
            await executeQuery(sql.ece2310.insertEmailAuthCode({ email, code }))
        }
        const result = await sendMail({ from: MAINSENDER, to: email, code, subject: SENDMAILTITLE, router: "ece2310" })
        await res.send(resultResponseFormat({ status: 1310, msg: ece2000.ece2310.success, extraData: result }))
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
/**
 * 이메일 인증 코드 확인 절차
 */
router.post("/ece2320", async (req, res) => {
    try {
        const { email, code } = req.body;
        const [data] = await executeQuery(sql.ece2320({ code, email }))
        if (data === undefined) throw new Error(ece2000.ece2320.faliure)
        const { status } = data;
        // 비회원
        if (status === 9110) {
            await res.send(resultResponseFormat({ data, msg: ece2000.ece2320.notFoundMember, status: 9110 }))
        } else {
            await res.send(resultResponseFormat({ data, msg: ece2000.ece2320.success, status: 9120 }))
        }
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message, extraData: { msg: ece2000.ece2320.awssesError } }))
    }
})

/**
 * 닉네임 정보 중복 검사
 */
router.post("/ece2321", async (req, res) => {
    try {
        const { nickname } = req.body;
        const validrefer = await executeQuery(`select member,nickname from Members where nickname = '${nickname}' limit 1`);
        if (validrefer.length !== 0) throw new Error("존재하는 닉네임입니다.")
        res.send(resultResponseFormat({ status: 1310, msg: "사용가능한 닉네임입니다." }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
/**
 * 추천인 정보 중복 검사
 */
router.post("/ece2322", async (req, res) => {
    try {
        const { nickname } = req.body;
        const data = await executeQuery(`select member,nickname from Members where nickname = '${nickname}' limit 1`);
        if (data.length == 0) throw new Error("존재하지 않은 추천인 닉네임 입니다.");
        res.send(resultResponseFormat({ status: 1310, msg: "존재하는 추천인 입니다.", data: { referCode: data[0].member, nickname: data[0].nickname } }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
/**
 * 회원가입
 */
router.post("/ece2323", async (req, res) => {
    try {
        let { email, gender, firstname, lastname, pin, nickname, referCode, referNickname } = req.body;
        const [member] = await executeQuery(sql.ece2310.findByMember({ email }));
        let validReferCode = false;
        if (member !== undefined) throw new Error(ece2000.ece2323.validEmail)
        /**
         * @TODO 추천인 미입력
         */
        if (referCode.trim() === "" || referCode === 0 || referNickname.trim() === "") {
            validReferCode = true
            // referCode = 999999;
            // referNickname = "ELC NOT ReferCode";
        }
        const { affectedRows, insertId } = await executeQuery(sql.ece2323.insertMember({ email, firstname, lastname, pin, gender, nickname }))
        if (affectedRows !== 1) throw new Error(ece2000.ece2323.failure);
        if (!validReferCode) {
            const validMiner = await executeQuery(`select * from Transactions where action = 7235 and member = ${referCode}`)
            if (validMiner.length !== 0) {
                const referMemberList = await executeQuery(`SELECT * FROM wicfaie.Transactions where action = 9501 and extracode1 = ${referCode};`)
                if (referMemberList < 10) {
                    await executeQuery(sql.ece2323.insertReferCode({ member: insertId, referCode, referNickname }))
                }
            }
        } else {
            await executeQuery(sql.ece2323.insertNotReferCode({ member: insertId }))
        }
        if (affectedRows === 1) await res.send(resultResponseFormat({ data: { member: insertId }, msg: ece2000.ece2323.success, status: 1310 }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
/**
 * 회원 가입 완료 사용자 로그인 안내 페이지 접근
 */
router.post("/ece2324", async (req, res) => {
    try {
        const { member } = req.body
        const [memberInfo] = await executeQuery(sql.ece2324({ member }))
        await res.send(resultResponseFormat({ data: memberInfo, msg: ece2000.ece2324.success, status: 1310 }))
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: ece2000.ece2324.failure }))
    }
})
/**
 * 비밀 번호 입력
 */
router.post("/ece2330", async (req, res) => {
    try {
        const { member, email, pin } = req.body
        const [data] = await executeQuery(sql.ece2330({ member, pin }))
        if (data !== undefined) {
            await res.send(resultResponseFormat({ data, status: 1310, msg: ece2000.ece2330.success }))
        } else {
            throw new Error(ece2000.ece2330)
        }
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: ece2000.ece2330.failure }))
    }
})
/**
 * @swagger
 * 비밀 번호 재설정을 위한 이메일 인증 요청
 */
router.post("/ece2332", async (req, res) => {
    try {
        const { email } = req.body;
        if (email === undefined) throw new Error(intergrateMSG.failure)
        const [data] = await executeQuery(sql.ece2332.findByMember({ email }))
        const code = generateRandomCode(6)
        if (data !== undefined) {
            const { member, email: validEmail } = data
            await executeQuery(sql.ece2332.insertEmailAuthCodeOnMember({ member, validEmail, code }))
            const result = await sendMail({ from: MAINSENDER, to: email, code, subject: SENDMAILTITLE, router: "ece2332" })
            console.log(code);
            await res.send(resultResponseFormat({ status: 1310, msg: ece2000.ece2332.success, extraData: result }))
        } else {
            throw new Error(ece2000.ece2332.failure)
        }
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
/**
 * 비밀번호 재설정 이메일 인증 코드 인증
 */
router.post("/ece2333", async (req, res) => {
    try {
        const { email, code } = req.body;
        if (email === undefined || code === undefined) throw new Error(intergrateMSG.failure)
        const [data] = await executeQuery(sql.ece2333({ code, email }))
        console.log(ece2000.ece2333.failure);
        if (data === undefined) throw new Error(ece2000.ece2333.failure)
        await res.send(resultResponseFormat({ data, msg: ece2000.ece2333.success, status: 1310 }))
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
/**
 * 비밀번호 재설정 입력
 */
router.post("/ece2334", async (req, res) => {
    try {
        const { pin, member } = req.body;
        if (pin === undefined && member === undefined) throw new Error(intergrateMSG.failure)
        const { affectedRows } = await executeQuery(sql.ece2334.updatePin({ pin, member }))
        if (affectedRows === undefined) throw new Error(ece2000.ece2334.failure)
        const [data] = await executeQuery(sql.ece2334.findByMember({ member }))
        await res.send(resultResponseFormat({ data, msg: ece2000.ece2334.success, status: 1310 }))
    }
    catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})

/**
 * 로그인
 */
router.post("/ece2400", async (req, res) => {
    try {
        const { email, pin } = req.body
        const [data] = await executeQuery(sql.ece2400.findByMember({ email, pin }))
        if (data !== undefined) {
            await executeQuery(sql.ece2400.insertLoginMemberInfo({ member: data.member }))
            await res.send(resultResponseFormat({ data, status: 1310, msg: ece2000.ece2400.success }))
        } else {
            throw new Error(ece2000.ece2400.failure)
        }
    } catch (error) {
        res.send(resultResponseFormat({ status: 1320, msg: error.message }))
    }
})
function generateRandomCode(n) {
    let str = ''
    for (let i = 0; i < n; i++) {
        str += Math.floor(Math.random() * 10)
    }
    return str
}
module.exports = router;