const minerTimer = 0
AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece1000` })
    .then(async (response) => {
        const { data } = response
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
        const { data: mininghistoryList } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece6000/ece6100?member=${member}` })
        if (mininghistoryList.length !== 0) {
            let innerHTMLText = mininghistoryList.map((historyList) => {
                // title
                let title = titleInnerHTML({ createdt: historyList.createdt })
                let historyUlTag = historyList.dayminingData.map(([defaultInfo, resourceList]) => {
                    const { resourceData } = resourceList
                    let spAmount;
                    let resoureInner = resourceData.map(({ resource, amount }) => {
                        if (resource === 7601) {
                            spAmount = amount
                        } else {
                            return resourceInnerHTML({ cateogoryName: selectCodeNameTpCodeTable({ data, codeName: resource }), amount })
                        }
                    })
                    resoureInner = resoureInner.join(",").replaceAll(",", "").replace("undefined", "");

                    let innerHTML_1 = textInnerHTML({ minerCount: defaultInfo.minerCount, tileCount: defaultInfo.tileCount, spAmount })
                    innerHTML_1 += resoureInner;
                    innerHTML_1 += endInnerHTML1();
                    return innerHTML_1
                })
                historyUlTag += historyUlTag.join(",").replace(",", "")
                title += historyUlTag
                title += endulInnerHTM2()
                return title
            })
            innerHTMLText = innerHTMLText.join(",").replace(",", "")
            $("#template").html(innerHTMLText)
        } else {
            $("#ece6000_txt").text("채굴한 내역이 존재하지 않습니다.")
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
function textInnerHTML({ minerCount, spAmount, tileCount }) {
    return `<li>
    <div style="overflow: hidden">
      <h4 style="float: left">채굴기 : ${minerCount}</h4>
      <h4 style="color: #12e1f0; float: right">CR : ${spAmount}</h4>
    </div>
    <p>타일 갯수 : ${tileCount}</p>
    <div class="flex2">
    `
}
function resourceInnerHTML({ cateogoryName, amount }) {
    return `<div class="flex-items">${cateogoryName} : ${amount}</div>`
}
function endInnerHTML1() {
    return `</div>
    </li>`
}
function endulInnerHTM2() {
    return `</ul>
    </div>`
}