const minerTimer = 0
let trickTimer;
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
        console.log(resourceBannerText.memberInfo);
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
                const { data } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3401_beta?member=${member}` })
                // 누적 채굴 X
                if (data.length === 0) {
                    $("#mining").css("display", "none")
                    let check = false;
                    const clearTimer = window.setInterval(() => {
                        let today = new Date();
                        let minutes = today.getMinutes();  // 분
                        let seconds = today.getSeconds();  // 초
                        if (!check) {
                            $("#timer").text(`채굴 완료 까지 ${60 - Number(minutes)}:${60 - Number(seconds)} 남았습니다.`);
                            if (seconds === 59 && minutes === 59) {
                                check = true;
                            }
                        }
                        else {
                            $("#timer").text("채굴하기를 눌러주세요")
                            $("#mining").css("display", "block")
                            clearInterval(clearTimer)
                        }
                    }, 1000)
                } else {
                    $("#timer").text("채굴하기를 눌러주세요")
                }
            }
        } else {
            $("#mining").css("display", "none")
            $("#timer").text("채굴기 또는 타일을 모두 구매하셔야합니다.")
        }
        const a = selectCodeNameTpCodeTable({ data, codeName: 7212 })
        $('#resourceText').html(bannerList)
        const trickResource = $("#resourceTrick").text()
        trickTimer = setInterval(() => {
            const unixtime = Math.floor(new Date().getTime() / 1000)
            $("#resourceTrick").text(`${trickResource}.${String(unixtime).slice(5, 10)}`)
        }, 1000)
        // $("#mining").click(async () => {
        //     const response = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3400_beta?member=${member}` })
        //     if (response.status === 1320) {
        //         $("#snackbar").html('<h3>체굴 실패</h3><p>채굴할 자원이 없습니다.<p/>')
        //     } else {
        //         let sp = ""
        //         const text = response.data.map((v) => {
        //             if (v.category !== 7601) {
        //                 const description = selectCodeNameTpCodeTable({ data, codeName: v.category })
        //                 return `${description}: ${v.amount}`
        //             } else {
        //                 const description = selectCodeNameTpCodeTable({ data, codeName: v.category })
        //                 sp = `${description}: ${v.amount}`
        //             }
        //         })
        //         $("#snackbar").html(`
        //         <h3>채굴 완료</h3>
        //         <p>${text.join(",").replaceAll(",", " ")}</p>
        //         <p>${sp}</p>`)
        //         const { data: resourceBannerText } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3500_beta?member=${member}` })
        //         let bannerList = "채굴된 자원이 없습니다."
        //         if (resourceBannerText.resoureList.length !== 0) {
        //             bannerList = resourceBannerText.resoureList.map((v) => {
        //                 const description = selectCodeNameTpCodeTable({ data, codeName: v.resource })
        //                 if (description === "동") {
        //                     return `${description}: <span id ="resourceTrick">${v.amount}</span>`
        //                 } else {
        //                     return `${description}: ${v.amount}`
        //                 }
        //             })
        //             bannerList = bannerList.join(",").replaceAll(",", " ")
        //         }
        //         $('#resourceText').html(bannerList)
        //         const trickResource = $("#resourceTrick").text()
        //         clearInterval(trickTimer)
        //         trickTimer = setInterval(() => {
        //             const unixtime = Math.floor(new Date().getTime() / 1000)
        //             $("#resourceTrick").text(`${trickResource}.${String(unixtime).slice(5, 10)}`)
        //         }, 1000)
        //     }
        //     $("#mining").css("display", "none")
        //     let check = false;
        //     const clearTimer = window.setInterval(() => {
        //         let today = new Date();
        //         let minutes = today.getMinutes();  // 분
        //         let seconds = today.getSeconds();  // 초
        //         if (!check) {
        //             $("#timer").text(`채굴 완료 까지 ${60 - Number(minutes)}:${60 - Number(seconds)} 남았습니다.`);
        //             if (seconds === 59 && minutes === 59) {
        //                 check = true;
        //             }
        //         }
        //         else {
        //             $("#timer").text("채굴하기를 눌러주세요")
        //             $("#mining").css("display", "block")
        //             clearInterval(clearTimer)

        //         }
        //     }, 1000)
        // })
        const { data: validMinig } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3401_beta?member=${member}` })
        if (validMinig.length !== 0) {
            $('#mining').fadeIn();
            if (location.pathname === "/ece3601.html") {
                $("#mining").click(async () => {
                    const [miner, minerId] = location.search.split("&")[1].split("=");
                    const response = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3400_beta_01?member=${member}&miner=${minerId}` })
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
                    <p>${sp}</p>`);
                        clearInterval(trickTimer)
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
                        trickTimer = setInterval(() => {
                            const unixtime = Math.floor(new Date().getTime() / 1000)
                            $("#resourceTrick").text(`${trickResource}.${String(unixtime).slice(5, 10)}`)
                        }, 1000)
                    }
                    $("#mining").css("display", "none")
                    let check = false;
                    // const clearTimer = window.setInterval(() => {
                    //     let today = new Date();
                    //     let minutes = today.getMinutes();  // 분
                    //     let seconds = today.getSeconds();  // 초
                    //     if (!check) {
                    //         $("#timer").text(`채굴 완료 까지 ${60 - Number(minutes)}:${60 - Number(seconds)} 남았습니다.`);
                    //         if (seconds === 59 && minutes === 59) {
                    //             check = true;
                    //         }
                    //     }
                    //     else {
                    //         $("#timer").text("채굴하기를 눌러주세요")
                    //         $("#mining").css("display", "block")
                    //         clearInterval(clearTimer)

                    //     }
                    // }, 1000)
                })

            }
        }

    })


