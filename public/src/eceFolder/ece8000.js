const minerTimer = 0
$("#errorminer").css("display", "none")
$("#erroraddress").css("display", "none")
AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece1000` })
    .then(async (response) => {
        const { data } = response
        const { data: resourceBannerText } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3500_beta?member=${member}` })
        let bannerList = "채굴된 자원이 없습니다."
        if (resourceBannerText.resoureList.length !== 0) {
            bannerList = resourceBannerText.resoureList.map((v) => {
                const description = selectCodeNameTpCodeTable({ data, codeName: v.resource })
                if (description === "동") {
                    return `${description}: <span id ="resourceTrick">${v.amount}</span>`
                } else {
                    return `${description}: ${v.amount}`
                }
            })
            bannerList = bannerList.join(",").replaceAll(",", " ")

        }
        $('#resourceText').html(bannerList)
        const trickResource = $("#resourceTrick").text()
        setInterval(() => {
            const unixtime = Math.floor(new Date().getTime() / 1000)
            $("#resourceTrick").text(`${trickResource}.${String(unixtime).slice(5, 10)}`)
        }, 1000)
        const { data: adminXRP } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece8000/ece8210?member=${member}` })
        const [admin] = adminXRP
        let [firstDecimal, secondDecimal] = admin.currentamount.split(".")
        firstDecimal = firstDecimal.slice(0, firstDecimal.length - 2) + generateRandomCode(2)
        secondDecimal = generateRandomCode(2);
        console.log(firstDecimal);
        const adminDecimalTronAmount = `${firstDecimal}.${secondDecimal}`
        $("#message").html(`현재 채굴기 개당 가격은 ${adminDecimalTronAmount}TRX 입니다.`)
        let sellMinerList = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece8000/ece8211_beta?member=${member}` })
        console.log(sellMinerList);
        if (sellMinerList.data.length !== 0) {
            sellMinerList = sellMinerList.data
            sellMinerList = sellMinerList.map((v) => {
                // return innerHTML_MinerHistory({ createdt: v.createdt.split("T")[0], status: selectCodeNameTpCodeTable({ data, codeName: v.action }), xrp: v.xrp, minerCount: v.minercount })
                return innerHTML_MinerHistory({ createdt: v.createdt.split("T")[0], status: selectCodeNameTpCodeTable({ data, codeName: v.action }), xrp: v.amount, minerCount: v.minerCount })
            })
            sellMinerList = sellMinerList.join(",").replaceAll(",", "")
            $(".ece8210_history_template").html(sellMinerList)
        }
        $("#ece8210_ece8220").click(async () => {
            const minerCount = $("#minerCount").val()
            const address = $("#address").val()
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
            if (address.trim() === "") {
                valid = false;
                $("#erroraddress").fadeIn();
            } else if (Number(address.length) < 33) {
                valid = false;
                $("#erroraddress").html("트론 지갑 주소는 최소 34자리 이상 입력하셔야합니다")
                $("#erroraddress").fadeIn()
            } else {
                $("#erroraddress").fadeOut()
            }
            if (valid) {
                const amount = (Number(adminDecimalTronAmount) * minerCount).toFixed(2)
                const requestMiner = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece8000/ece8220_beta?member=${member}`, data: { miner: minerCount, amount, address } })
                if (requestMiner.status === 1310) {
                    location.href = `./ece8220.html?member=${member}&amount=${amount}&miner=${minerCount}&address=${address}`
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
            $("#xrp").html(ece8210_data.amount + "TRX")
            $("#miner").html(ece8210_data.miner)
            $("#address").html(ece8210_data.address)
            // $("#dt").html(ece8210_data.dt)

        }
        $("#ece8110_ece8120").click(async () => {
            //타일수 , 가격 , 멤버 , 타일 정보 
            let duplicateTile = false;
            const tileInfo = ece8110_data;
            const tileLength = $("#selecttile").text().split(" ")[0];
            const price = $("#selecttileprice").text().split(" ")[0]
            tileInfo.forEach(({ width, height }) => {
                const indexing = parseArrayToIndexNumber(width, height)
                if (locationIndexingList.includes(indexing)) {
                    duplicateTile = true;
                }
            })
            // 0913 막음
            duplicateTile = true;
            //0913 막음
            if (!duplicateTile) {
                const requestData = {
                    data: tileInfo,
                    xrp: price
                }
                const ece8120Code = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece8000/ece8120?member=${member}`, data: requestData })
                if (ece8120Code.status === 1310) {
                    location.href = `./ece8120.html?member=${member}&xrp=${price}&miner=${tileLength}&dt=${ece8120Code.data}`
                }
            } else {
                $("#selectlocation").text("좌표 :")
                $("#selecttile").text("선택해주세요")
                $("#selecttileprice").text("선택해주세요")

                var x = document.getElementById("snackbar");
                x.className = "show";
                setTimeout(function () {
                    x.className = x.className.replace("show", "");
                }, 3000);
                // $("#snackbar").html('<h3>타일 구매</h3><p>사용자가 존재하는 타일을 선택하셨습니다.<p/>')
                $("#snackbar").html('<h3>타일 구매</h3><p>준비중입니다.<p/>')
                selectedTiles_g()
            }

        })
    })

function innerHTML_MinerHistory({ createdt, status, xrp, minerCount }) {
    return `<div class="ece8210_history">
            <span style="float: left">[${createdt}]</span>
            <span style="float: left; margin-left:10px">${minerCount}대</span>
            <span style="float: right">
              <span style="font-size:12px">${xrp}TRX</span>
              <h4>${status.slice(4)}</h4>
            </span>
          </div>`
}
function parseArrayToIndexNumber(x, y) {
    return Math.floor(y * point_lng + x)
}

function generateRandomCode(n) {
    let str = ''
    for (let i = 0; i < n; i++) {
        str += Math.floor(Math.random() * 10)
    }
    return str
}