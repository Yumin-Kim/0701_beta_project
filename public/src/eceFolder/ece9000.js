const minerTimer = 0
AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece1000` })
    .then(async (response) => {
        const { data } = response
        const { data: resourceBannerText } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3500?member=${member}` })
        let bannerList = "채굴된 자원이 없습니다.";
        const { data: tileAdmin } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece8000/ece8210` })
        const { data: minerAdmin } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece8000/ece8110` })

        if (resourceBannerText.resoureList.length !== 0) {
            bannerList = resourceBannerText.resoureList.map((v) => {
                const description = selectCodeNameTpCodeTable({ data, codeName: v.resource })
                return `${description}: ${v.amount}`
            })
            bannerList = bannerList.join(",").replaceAll(",", " ")
        }
        $('#resourceText').text(bannerList)
        const { data: requestReceipt } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece9000/ece9100?member=${member}` })
        if (requestReceipt.length !== 0) {
            let innerHTMLText = requestReceipt.map((historyList) => {
                // title
                let title = titleInnerHTML({ createdt: historyList.createdt })
                let historyUlTag = historyList.dayminingData.map(([_, selectData]) => {
                    const { transactionData } = selectData
                    const { action, extracode2: amount, extrastr2: code, extrastr1: xrp } = transactionData[0]
                    const actionName = selectCodeNameTpCodeTable({ data, codeName: action })
                    let toggleName;
                    let per;
                    let wallet;
                    if (action > 7200) {
                        toggleName = "채굴기"
                        per = "대"
                        wallet = minerAdmin.walletaddress
                    } else {
                        toggleName = "타일"
                        per = "Tiles"
                        wallet = tileAdmin[0].walletaddress
                    }

                    return textInnerHTML({ action: actionName, toggleName, code, xrp, amount, per, wallet })
                    // resoureInner = resoureInner.join(",").replaceAll(",", "").replace("undefined", "TestTest");
                    // let innerHTML_1 = textInnerHTML({ minerCount: defaultInfo.minerCount, tileCount: defaultInfo.tileCount, spAmount })
                    // // innerHTML_1 += resoureInner;
                    // // innerHTML_1 += endInnerHTML1();
                    // return innerHTML_1
                })
                historyUlTag = historyUlTag.join(",").replaceAll(",", "")
                title += historyUlTag
                title += endulInnerHTM2()
                return title
            })
            innerHTMLText = innerHTMLText.join(",").replace(",", "")
            $("#template").html(innerHTMLText)
        } else {
            $("#ece6000_txt").text("구매 내역이 존재하지 않습니다.")
        }
    })


function titleInnerHTML({ createdt }) {
    return `
    <div
          class="notebooks"
          ng-app="notebooks"
          ng-controller="NotebookListCtrl"
        >
          <ul id="notebook_ul">
          <h3> ${createdt}</h3>
    `
}
function textInnerHTML({ action, toggleName, wallet, code, xrp, amount, per }) {
    return `<li>
    <div style="overflow: hidden">
      <h3 style="float: left" id="status">${action}</h3>
      <h4 style="float: right" id="xrp">${xrp} TRX</h4>
    </div>
    <p class="ece9000_txt" id="amount">${toggleName} : ${amount} ${per}</p>
    <p class="ece9000_txt">
      전송 주소 :
      <span style="font-size: 10px" id="ece9000_address"
        >${wallet}</span
      >
    </p>
    <p class="ece9000_txt">
      Destination Tag : <span id="ece9000_code">${code}</span>
    </p>
  </li>
    `
}

function endulInnerHTM2() {
    return `</ul>
    </div>`
}