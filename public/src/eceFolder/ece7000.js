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
        const memberInfoList = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece7000/ece7100?member=${member}` })
        let { firstname, lastname, email, gender, walletaddress } = memberInfoList.data[0]
        $("#firstname").val(firstname)
        $("#lastname").val(lastname)
        $("#email").val(email)

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
            if (valid) {
                const updateMemberInfo = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece7000/ece7200?member=${member}`, data: { email, firstname, lastname, gender, walletaddress } })
                $("#btn9211").removeClass("selectBtn")
                $("#btn9212").removeClass("selectBtn")
                $("#firstname").val(updateMemberInfo.data[0].firstname)
                $("#lastname").val(updateMemberInfo.data[0].lastname)
                $("#email").val(updateMemberInfo.data[0].email)
                if (updateMemberInfo.data[0].gender === 9211) {
                    $("#btn9211").addClass("selectBtn")
                }
                if (updateMemberInfo.data[0].gender === 9212) {
                    $("#btn9212").addClass("selectBtn")
                }
            }
        })
    })


