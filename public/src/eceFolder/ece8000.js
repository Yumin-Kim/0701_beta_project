const minerTimer = 0
$("#errorminer").css("display", "none")
$("#erroraddress").css("display", "none")
AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece1000` })
    .then(async (response) => {
        const { data } = response
        console.log(data);
        const { data: resourceBannerText } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3500?member=${member}` })
        let bannerList = "채굴된 자원이 없습니다."
        if (resourceBannerText.resoureList.length !== 0) {
            bannerList = resourceBannerText.resoureList.map((v) => {
                const description = selectCodeNameTpCodeTable({ data, codeName: v.resource })
                return `${description}: ${v.amount}`
            })
            bannerList = bannerList.join(",").replaceAll(",", " ")
        }
        $('#resourceText').text(bannerList)
        await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3500?member=${member}` })
        let sellMinerList = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece8000/ece8211?member=${member}` })
        if (sellMinerList.data.length !== 0) {
            sellMinerList = sellMinerList.data
            sellMinerList = sellMinerList.map((v) => {
                return innerHTML_MinerHistory({ createdt: v.createdt.split("T")[0], status: selectCodeNameTpCodeTable({ data, codeName: v.action }), xrp: v.xrp, minerCount: v.minercount })
            })
            sellMinerList = sellMinerList.join(",").replaceAll(",", "")
            $(".ece8210_history_template").html(sellMinerList)
        }
        console.log(sellMinerList);
        $("#ece8210_ece8220").click(async () => {
            console.log("asdasd");
            const address = $("#address").val()
            const minerCount = $("#minerCount").val()
            let valid = true
            if (address.trim() === "") {
                $("#erroraddress").fadeIn()
            } else if (address.length < 30) {
                $("#erroraddress").html("최소 30자리 이상의 주소를 입력해주세요 ")
                $("#erroraddress").fadeIn()
                valid = false;
            } else {
                $("#erroraddress").fadeOut()
            }
            if (minerCount.trim() === "") {
                valid = false;
                $("#errorminer").fadeIn()
            } else if (Number(minerCount) < 1) {
                valid = false;
                $("#errorminer").html("최소 1개 이상 구매 가능합니다.")
                $("#errorminer").fadeIn()
            } else {
                $("#errorminer").fadeOut()
            }
            if (valid) {
                const { data: adminInfo } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece8000/ece8210?member=${member}` })
                const xrp = Number(adminInfo[0].currentamount) * minerCount
                const requestMiner = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece8000/ece8220?member=${member}`, data: { miner: minerCount, xrp, address } })
                if (requestMiner.status === 1310) {
                    console.log("rere");
                    location.href = `./ece8220.html?member=${member}&xrp=${xrp}&miner=${minerCount}`
                }
            }
        })
        const a = querystring.split("&")
        const ece8210_data = { miner: null, xrp: null }
        a.forEach(v => {
            const [key, value] = v.split("=");
            ece8210_data[`${key}`] = value
        })
        if (ece8210_data.miner !== null) {
            const { data: adminInfo } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece8000/ece8210?member=${member}` })
            $("#admin").html(adminInfo[0].walletaddress)
            $("#xrp").html(ece8210_data.xrp + "XRP")
            $("#miner").html(ece8210_data.miner)

        }
    })
//     return `<div class="ece8210_history">
//     <span style="float: left">${createdt}</span>
//     <span style="float: right">
//       <span style="font-size:12px">${minerCount}</span>
//       <span style="font-size:12px">${xrp}XRP</span>
//       <h4>${status}</h4>
//     </span>
//   </div>`
function innerHTML_MinerHistory({ createdt, status, xrp, minerCount }) {
    return `<div class="ece8210_history">
            <span style="float: left">${createdt}</span>
            <span style="float: right">
              <span style="font-size:12px">${xrp}XRP</span>
              <h4>${status.slice(4)}</h4>
            </span>
          </div>`
}
