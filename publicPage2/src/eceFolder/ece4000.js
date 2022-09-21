const minerTimer = 0
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
    const { data: tileData } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece4000/ece4100?member=${member}` })
    $("#name").text(`닉네임 : ${tileData.name}`)
    $("#tilecount").text(`현재 타일 수량 : Made up of ${tileData.tileCount} tiles`)
    if (tileData.tilesInfoList.length !== 0) {
      let innerHTMLTileCardView = tileData.tilesInfoList.map((v) => {
        const { createdt, blockLocation } = v
        return tileInfoMappingTag({ createdt, blockLocation, location: `?member=${member}&lng=${blockLocation[0]}&lat=${blockLocation[1]}` })
      })
      innerHTMLTileCardView = innerHTMLTileCardView.join(",").replaceAll(",", "");
      $("#ece4000").html(innerHTMLTileCardView)
    } else {
      $("#ece4000_txt").text("구매한 타일이 존재하지 않습니다.")
    }
  })


function tileInfoMappingTag({ blockLocation, location, createdt }) {
  return ` 
<div class="cardview">

<section class="content">
  <h1>Jeollabuk-do, Republic of Korea</h1>

  <p>
    <span class="sc-timeline-time">구매날짜 :${createdt.split("T")[0]}</span>
  </p>
  <p>
    <span class="sc-timeline-time">좌표<br/ >${blockLocation[0]} ${blockLocation[1]}</span>
  </p>
  <div style="margin-bottom: 15px">
    <button type="button" onclick="location.href = './index.html${location}'" class="cardviewbtn">보기</button>
    <button type="button" class="cardviewbtn_right">팔기</button>
  </div>
</section>
</div>`}