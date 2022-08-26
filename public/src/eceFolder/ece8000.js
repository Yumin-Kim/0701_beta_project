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
        const { data: adminXRP } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece8000/ece8210?member=${member}` })
        const [admin] = adminXRP
        console.log(admin);
        $("#message").html(`현재 채굴기 개당 가격은 ${admin.currentamount}XRP 입니다.`)
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
            const minerCount = $("#minerCount").val()
            let valid = true
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
                const xrp = (Number(adminInfo[0].currentamount) * minerCount).toFixed(2)
                const requestMiner = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece8000/ece8220?member=${member}`, data: { miner: minerCount, xrp } })
                if (requestMiner.status === 1310) {
                    location.href = `./ece8220.html?member=${member}&xrp=${xrp}&miner=${minerCount}&dt=${requestMiner.data}`
                }
            }
        })
        const a = querystring.split("&")
        const ece8210_data = { miner: null, xrp: null, dt: null }
        a.forEach(v => {
            const [key, value] = v.split("=");
            ece8210_data[`${key}`] = value
        })
        if (ece8210_data.miner !== null) {
            const { data: adminInfo } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece8000/ece8210?member=${member}` })
            $("#admin").html(adminInfo[0].walletaddress)
            $("#xrp").html(ece8210_data.xrp + "XRP")
            $("#miner").html(ece8210_data.miner)
            $("#dt").html(ece8210_data.dt)

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
            <span style="float: left">[${createdt}]</span>
            <span style="float: left; margin-left:10px">${minerCount}대</span>
            <span style="float: right">
              <span style="font-size:12px">${xrp}XRP</span>
              <h4>${status.slice(4)}</h4>
            </span>
          </div>`
}
