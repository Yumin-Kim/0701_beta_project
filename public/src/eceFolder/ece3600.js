let clearTimer;
let REFERMEBER;
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
        // const trickResource = $("#resourceTrick").text()
        // setInterval(() => {
        //     const unixtime = Math.floor(new Date().getTime() / 1000)
        //     $("#resourceTrick").text(`${trickResource}.${String(unixtime).slice(5, 10)}`)
        // }, 1000)

        $("#ece3620").click(async () => {
            const ece3620_txt = $("#ece3620_txt").val()
            $("#ece3620_txt").val("")
            if (REFERMEBER.length > 9) {
                $("#errornickname").html("최대 추천인은 10명입니다.")
                $("#errornickname").fadeIn();
                return;
            }
            if (ece3620_txt.trim() === "") {
                $("#errornickname").html("추천인 닉네임을 입력해주세요")
                $("#errornickname").fadeIn();
                return;
            }
            // if(REFERMEBER.length > 10)
            clearInterval(clearTimer)
            $("#errornickname").fadeOut();
            const { status: ece3620Data, msg } = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece3000/ece3620?member=${member}`, data: { referNickName: ece3620_txt } })
            if (ece3620Data === 1310) {
                const { data: ece3610Data } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3610?member=${member}` })
                const { referMemberList, minerSpeedElement, minerCount } = ece3610Data;
                const minerSpeed = Math.round(Number(minerSpeedElement) * 0.1 * 1000)
                REFERMEBER = referMemberList
                $("#referLevel").text(`현황 : ${referMemberList.length}명 `)
                var opts = {
                    angle: -0.1, // The span of the gauge arc
                    lineWidth: 0.1, // The line thickness
                    radiusScale: 1, // Relative radius
                    pointer: {
                        length: 0.7, // // Relative to gauge radius
                        strokeWidth: 0.035, // The thickness
                        color: "#dae029", // Fill color
                    },
                    staticZones: [
                        {
                            strokeStyle: "rgba(188,244,255, 0.2)",
                            min: 0,
                            max: 500,
                            height: 3,
                        },
                        {
                            strokeStyle: "rgba(112,255,212, 0.3)",
                            min: 500,
                            max: 1000,
                            height: 3,
                        },
                        {
                            strokeStyle: "rgba(127,255,112, 0.4)",
                            min: 1000,
                            max: 1500,
                            height: 3,
                        },
                        {
                            strokeStyle: "rgba(224,255,123, 0.6)",
                            min: 1500,
                            max: 2300,
                            height: 3,
                        },
                        {
                            strokeStyle: "rgba(255,75,57, 0.9)",
                            min: 2300,
                            max: 3000,
                            height: 3,
                        },
                    ],
                    limitMax: false, // If false, max value increases automatically if value > maxValue
                    limitMin: false, // If true, the min value of the gauge will be fixed
                    colorStart: "#03f7ff", // Colors
                    colorStop: "#03f7ff", // just experiment with them
                    strokeColor: "#03f7ff", // to see which ones work best for you
                    generateGradient: true,
                    highDpiSupport: true, // High resolution support
                    // renderTicks is Optional
                    renderTicks: {
                        divisions: 9,
                        divWidth: 1.1,
                        divLength: 0.7,
                        divColor: "#000000",
                        subDivisions: 3,
                        subLength: 0.5,
                        subWidth: 0.6,
                        subColor: "#333333",
                    },
                };
                var target = document.getElementById("foo"); // your canvas element
                var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
                gauge.maxValue = 3000; // set max gauge value
                gauge.setMinValue(0); // Prefer setter over gauge.minValue = 0
                gauge.animationSpeed = 32; // set animation speed (32 is default value)
                gauge.set(2000); // set actual value

                var title = document.getElementById("title");
                var notMiner = document.getElementById("notMiner");
                gauge.set(0);
                clearTimer = setInterval(() => {
                    if (minerCount !== null) {
                        var rnd = Math.round(minerSpeed + Math.floor(Math.random() * 100));
                        title.innerHTML = rnd + "%";
                        gauge.set(rnd); // set actual value
                    } else {
                        title.style.display = "none";
                        notMiner.style.display = "block";
                    }
                }, 500);


                if (referMemberList.length !== 0) {
                    let referList = referMemberList.map((v) => {
                        // return innerHTML_MinerHistory({ createdt: v.createdt.split("T")[0], status: selectCodeNameTpCodeTable({ data, codeName: v.action }), xrp: v.xrp, minerCount: v.minercount })
                        return innerHTML_MinerHistory({ createdt: v.createdt.split("T")[0], nickname: v.referNickname })
                    })
                    referList = referList.join(",").replaceAll(",", "")
                    $(".ece8210_history_template").html(referList)
                }
            } else {
                $("#errornickname").html(msg)
                $("#errornickname").fadeIn();
            }
            // if(ece3620_txt)
        })
        const { data: ece3610Data } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3610?member=${member}` })
        const { referMemberList, minerSpeedElement, minerCount } = ece3610Data;
        const minerSpeed = Math.round(Number(minerSpeedElement) * 0.1 * 1000)
        REFERMEBER = referMemberList
        $("#referLevel").text(`현황 : ${referMemberList.length}명 `)
        var opts = {
            angle: -0.1, // The span of the gauge arc
            lineWidth: 0.1, // The line thickness
            radiusScale: 1, // Relative radius
            pointer: {
                length: 0.7, // // Relative to gauge radius
                strokeWidth: 0.035, // The thickness
                color: "#dae029", // Fill color
            },
            staticZones: [
                {
                    strokeStyle: "rgba(188,244,255, 0.2)",
                    min: 0,
                    max: 500,
                    height: 3,
                },
                {
                    strokeStyle: "rgba(112,255,212, 0.3)",
                    min: 500,
                    max: 1000,
                    height: 3,
                },
                {
                    strokeStyle: "rgba(127,255,112, 0.4)",
                    min: 1000,
                    max: 1500,
                    height: 3,
                },
                {
                    strokeStyle: "rgba(224,255,123, 0.6)",
                    min: 1500,
                    max: 2300,
                    height: 3,
                },
                {
                    strokeStyle: "rgba(255,75,57, 0.9)",
                    min: 2300,
                    max: 3000,
                    height: 3,
                },
            ],
            limitMax: false, // If false, max value increases automatically if value > maxValue
            limitMin: false, // If true, the min value of the gauge will be fixed
            colorStart: "#03f7ff", // Colors
            colorStop: "#03f7ff", // just experiment with them
            strokeColor: "#03f7ff", // to see which ones work best for you
            generateGradient: true,
            highDpiSupport: true, // High resolution support
            // renderTicks is Optional
            renderTicks: {
                divisions: 9,
                divWidth: 1.1,
                divLength: 0.7,
                divColor: "#000000",
                subDivisions: 3,
                subLength: 0.5,
                subWidth: 0.6,
                subColor: "#333333",
            },
        };
        var target = document.getElementById("foo"); // your canvas element
        var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
        gauge.maxValue = 3000; // set max gauge value
        gauge.setMinValue(0); // Prefer setter over gauge.minValue = 0
        gauge.animationSpeed = 32; // set animation speed (32 is default value)
        gauge.set(2000); // set actual value

        var title = document.getElementById("title");
        var notMiner = document.getElementById("notMiner");
        gauge.set(0);
        clearTimer = setInterval(() => {
            if (minerCount !== null) {
                var rnd = Math.round(minerSpeed + Math.floor(Math.random() * 100));
                title.innerHTML = rnd + "%";
                gauge.set(rnd); // set actual value
            } else {
                title.style.display = "none";
                notMiner.style.display = "block";
            }
        }, 500);


        if (referMemberList.length !== 0) {
            let referList = referMemberList.map((v) => {
                // return innerHTML_MinerHistory({ createdt: v.createdt.split("T")[0], status: selectCodeNameTpCodeTable({ data, codeName: v.action }), xrp: v.xrp, minerCount: v.minercount })
                return innerHTML_MinerHistory({ createdt: v.createdt.split("T")[0], nickname: v.referNickname })
            })
            referList = referList.join(",").replaceAll(",", "")
            $(".ece8210_history_template").html(referList)
        }
    })


function innerHTML_MinerHistory({ createdt, nickname }) {
    return `<div class="ece8210_history">
                <span style="float: left">[${createdt}]</span>
                <h4 style="font-size:14px; margin-left:11px">${nickname}</h4>
                <span style="float: right">
                  <h4>추천인 등록 완료</h4>
                </span>
              </div>`
}
