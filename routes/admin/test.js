const { executeQuery, dbPool } = require("../../config/db");
const { resultResponseFormat, resultMSG } = require("../../config/result");
const sql = require("../../config/sql");
const { intergrateMSG, ece4000 } = resultMSG
const router = require("express").Router()

router.post("/sellerinfo_tiles", async (req, res) => {
    const { xrpWallet, xrp } = req.body
    await executeQuery(sql.admin.insertTileSellerInfo({ xrpWallet, xrp }));
    res.send(resultResponseFormat({ data: `판매자 주소 ${xrpWallet} , 타일당 판매가 :${xrp}`, status: 1310, msg: "채굴기 판매자 정보 입력 완료" }))
})
router.post("/sellerinfo_miner", async (req, res) => {
    const { xrpWallet, xrp } = req.body
    await executeQuery(sql.admin.insertMinerSellerInfo({ xrpWallet, xrp }));
    res.send(resultResponseFormat({ data: `판매자 주소 ${xrpWallet} , 채굴기당 판매가 :${xrp}`, status: 1310, msg: "타일 판매자 정보 입력 완료" }))
})
router.get("/buytiles", async (req, res) => {
    const data = await executeQuery(sql.xrpWebsocket.updateTileByAllMember_NoCash());
    res.send(resultResponseFormat({ data, status: 1310, msg: "타일 구매 정보 업데이트" }))
})


router.get("/buytiles_rev", async (req, res) => {
    const a = await executeQuery('select extrastr3 from Transactions where action = 7131')
    console.log(a);
    // const data = await executeQuery(sql.xrpWebsocket.updateTileByAllMember_NoCash());
    // res.send(resultResponseFormat({ data, status: 1310, msg: "타일 구매 정보 업데이트" }))

})
// router.get("/")
router.get("/buyminers", async (req, res) => {
    const data = await executeQuery(sql.xrpWebsocket.updateMinerByAllMember_NoCash());
    res.send(resultResponseFormat({ data, status: 1310, msg: "채굴기 구매 정보 업데이트" }))
})
router.get("/requestile", async (req, res) => {
    const { member } = req.query
    const data = await executeQuery(sql.xrpWebsocket.findByMemberBuyRequestTilies({ member }));
    let arr = []
    let landList;
    if (data.length !== 0) {
        data.forEach((v) => {
            arr = [...arr, ...v.tiles]
            const set = new Set(arr)
            landList = [...set]
        },)
        await executeQuery(sql.xrpWebsocket.updateLandByOwner({ member, landList: landList.join(',') }))
    }

    res.send(resultResponseFormat({ data, status: 1310, msg: "타일 구매 요청자 단수" }))
})
router.get("/requestilelist", async (req, res) => {
    const data = await executeQuery(sql.xrpWebsocket.findByMemberAllBuyRequestTilies());
    res.send(resultResponseFormat({ data, status: 1310, msg: "타일 구매 요청자 리스트" }))
})

module.exports = router;