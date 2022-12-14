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
        const memberInfoList = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece7000/ece7100?member=${member}` })
        let { firstname, lastname, email, gender, walletaddress, nickname } = memberInfoList.data[0]
        console.log(nickname);
        $("#firstname").val(firstname)
        $("#lastname").val(lastname)
        $("#email").val(email)
        $("#nickname").val(nickname)

        if (gender === 9211) {
            $("#btn9211").addClass("selectBtn")
        }
        if (gender === 9212) {
            $("#btn9212").addClass("selectBtn")
        }
        $("#btn9212").click(() => {
            $("#btn9211").removeClass("selectBtn")
            $("#btn9212").addClass("selectBtn")
            gender = 9212;
        })
        $("#btn9211").click(() => {
            $("#btn9212").removeClass("selectBtn")
            $("#btn9211").addClass("selectBtn")
            gender = 9211;
        })
        $("#updatememberInfo").click(async () => {
            firstname = $("#firstname").val()
            lastname = $("#lastname").val()
            email = $("#email").val()
            nickname = $("#nickname").val()
            let valid = true;
            if (firstname.trim() === "") {
                valid = false;
                $("#errorfirstname").fadeIn()
            } else {
                $("#errorfirstname").fadeOut()
            }
            if (lastname.trim() === "") {
                valid = false;
                $("#errorlastname").fadeIn()
            } else {
                $("#errorlastname").fadeOut()
            }
            if (email.trim() === "") {
                valid = false;
                $("#erroremail").fadeIn()
            } else {
                $("#erroremail").fadeOut()
            }
            if (nickname.trim() === "") {
                valid = false;
                $("#errornickname").fadeIn()
            } else {
                $("#errornickname").fadeOut()
            }
            if (valid) {
                const updateMemberInfo = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece7000/ece7200?member=${member}`, data: { email, firstname, lastname, gender, walletaddress, nickname } })
                if (updateMemberInfo.status === 1320) {
                    $("#errornickname").html(updateMemberInfo.msg)
                    $("#errornickname").fadeIn()
                    return;
                }
                $("#btn9211").removeClass("selectBtn")
                $("#btn9212").removeClass("selectBtn")
                $("#firstname").val(updateMemberInfo.data[0].firstname)
                $("#lastname").val(updateMemberInfo.data[0].lastname)
                $("#email").val(updateMemberInfo.data[0].email)
                $("#nickname").val(updateMemberInfo.data[0].nickname)
                if (updateMemberInfo.data[0].gender === 9211) {
                    $("#btn9211").addClass("selectBtn")
                }
                if (updateMemberInfo.data[0].gender === 9212) {
                    $("#btn9212").addClass("selectBtn")
                }
            }
        })
    })


