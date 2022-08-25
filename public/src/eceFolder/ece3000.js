const minerTimer = 0
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
        if (resourceBannerText.memberInfo.length !== 0) {
            let count = 0;
            resourceBannerText.memberInfo.forEach((v) => {
                if (v.amount === null) {
                    count++;
                }
            })
            if (count > 0) {
                $("#mining").css("display", "none")
                $("#timer").text("채굴기 또는 타일을 모두 구매하셔야합니다.")
            } else {
                const { data } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3401?member=${member}` })
                // 누적 채굴 X
                console.log("test", data);
                if (data.length === 0) {
                    $("#mining").css("display", "none")
                    const clearTimer = window.setInterval(() => {
                        let today = new Date();
                        let minutes = today.getMinutes();  // 분
                        let seconds = today.getSeconds();  // 초
                        $("#timer").text(`채굴 완료 까지 ${60 - Number(minutes)}:${60 - Number(seconds)} 남았습니다.`)
                        if (60 - Number(minutes) < minerTimer) {
                            $("#timer").text("채굴하기를 눌러주세요")
                            $("#mining").css("display", "block")
                            clearInterval(clearTimer)
                        }
                    }, 1000)
                } else {
                    $("#timer").text("채굴하기를 눌러주세요")
                }
            }
        }
        const a = selectCodeNameTpCodeTable({ data, codeName: 7212 })
        console.log(resourceBannerText.memberInfo);

        $('#resourceText').text(bannerList)
        $("#mining").click(async () => {
            const response = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3400?member=${member}` })
            if (response.status === 1320) {
                $("#snackbar").html('<h3>체굴 실패</h3><p>채굴할 자원이 없습니다.<p/>')
            } else {
                let sp = ""
                const text = response.data.map((v) => {
                    if (v.category !== 7601) {
                        const description = selectCodeNameTpCodeTable({ data, codeName: v.category })
                        return `${description}: ${v.amount}`
                    } else {
                        const description = selectCodeNameTpCodeTable({ data, codeName: v.category })
                        sp = `${description}: ${v.amount}`
                    }
                })
                $("#snackbar").html(`
                <h3>채굴 완료</h3>
                <p>${text.join(",").replaceAll(",", " ")}</p>
                <p>${sp}</p>`)
                const { data: resourceBannerText } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3500?member=${member}` })
                let bannerList = "채굴된 자원이 없습니다."
                if (resourceBannerText.resoureList.length !== 0) {
                    bannerList = resourceBannerText.resoureList.map((v) => {
                        const description = selectCodeNameTpCodeTable({ data, codeName: v.resource })
                        return `${description}: ${v.amount}`
                    })
                    bannerList = bannerList.join(",").replaceAll(",", " ")
                    $('#resourceText').text(bannerList)
                }
            }
            $("#mining").css("display", "none")
            console.log("Hello");
            const clearTimer = window.setInterval(() => {
                let today = new Date();
                let minutes = today.getMinutes();  // 분
                let seconds = today.getSeconds();  // 초
                $("#timer").text(`채굴 완료 까지 ${60 - Number(minutes)}:${60 - Number(seconds)} 남았습니다.`)
                if (60 - Number(minutes) < minerTimer) {
                    $("#timer").text("채굴하기를 눌러주세요")
                    $("#mining").css("display", "block")
                    clearInterval(clearTimer)
                }
            }, 1000)
        })
    })


