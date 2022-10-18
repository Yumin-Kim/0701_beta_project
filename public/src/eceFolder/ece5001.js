let newResourceName;
let removeResourceName;
AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece1000` })
    .then(async (response) => {
        const { data } = response
        $("#popupchange").css("display", "none");
        $("#qtySelect").change(() => {
            const e = document.getElementById("qtySelect");
            const value = e.value; // value
            const text = e.options[e.selectedIndex].text;
            $("#destmetalqty").html(value)
        })

        $("#doClose").click(function () {
            $("#popupchange").css("display", "none");
        });
        const locationList = location.search.split("=");
        if (locationList.length < 3) {
            const { data: minerIdList } = await AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece1000/ece1000?member=${member}` })
            if (minerIdList.length !== 0) {
                let minerId = minerIdList[0].miner
                AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3730?member=${member}&miner=${minerId}` })
                    .then((response) => {
                        const { data: responseData } = response
                        if (responseData.length !== 0) {
                            const [chartCategoryData, chartData] = responseData.reduce((prev, cur) => {
                                const categoryName = selectCodeNameTpCodeTable({ data, codeName: cur.resource })
                                if (prev.length === 0) {
                                    prev[0] = [categoryName];
                                    prev[1] = [cur.amount];
                                }
                                else {
                                    prev[0] = [...prev[0], categoryName];
                                    prev[1] = [...prev[1], cur.amount];
                                }
                                return prev;
                            }, [])
                            const chartCategoryDataTitle = ["금", "은", "동", "다이아몬드"]
                            const resourceText = document.getElementsByClassName('resourceitem')
                            const resourceTitleList = document.getElementsByClassName('resourceitemtitle')
                            const tagbg = document.getElementsByClassName('sc-timeline-info')
                            const tagicon = document.getElementsByClassName('sc-timeline-icon')
                            console.log(chartData);
                            Array(resourceText.length).fill().forEach((v, index) => {
                                const item = resourceText.item(index)
                                const itemTitle = resourceTitleList.item(index)
                                item.innerHTML = chartData[index]
                                itemTitle.innerHTML = chartCategoryData[index]
                                if (chartCategoryData[index] === "동") {
                                    tagicon.item(index).style.backgroundImage = `url('./assets/aa.png')`;
                                    tagbg.item(index).style.background = `#fea47857`;

                                }
                                if (chartCategoryData[index] === "금") {
                                    tagicon.item(index).style.backgroundImage = `url('./assets/gold.png')`;
                                    tagbg.item(index).style.background = `#cfaf3d3d`;
                                }
                                if (chartCategoryData[index] === "다이아몬드") {
                                    tagicon.item(index).style.backgroundImage = `url('./assets/dia.png')`;
                                    tagbg.item(index).style.background = `#ffffff49`;
                                }
                                if (chartCategoryData[index] === "은") {
                                    tagicon.item(index).style.backgroundImage = `url('./assets/sliver.png')`;
                                    tagbg.item(index).style.background = `#fffafa3d`;
                                }
                            })
                            var chart = new ApexCharts(document.querySelector("#chart"), options({ chartCategoryData, chartData }));
                            const convertNumberChartData = chartData.map((v) => Number(v))
                            //반환
                            if (convertNumberChartData[0] >= 1000) {
                                $("#d2s").click(function (e) {
                                    $("#popupchange").css("display", "block");
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.scrollTo({ top: 0 });
                                    ece5200_txt("동", "은");
                                    removeResourceName = "7507"
                                    newResourceName = "7508"
                                    $("#resourceInput").attr("max", convertNumberChartData[0])
                                    $("#resourceInput").attr("min", 1000)
                                    $("#resourceInput").keyup(() => {
                                        let value = $("#resourceInput").val()
                                        value = Math.floor(Number(value) / 1000)
                                        $("#destmetalqty").html(value);
                                    })
                                    $("#doExchange").click(async (e) => {
                                        let value = $("#resourceInput").val()
                                        let isFormValid = document.getElementById('myForm').checkValidity();
                                        console.log(isFormValid);
                                        if (!isFormValid) {
                                            document.getElementById('myForm').reportValidity();
                                        } else {
                                            e.preventDefault();
                                            let newResource = Math.floor(Number(value) / 1000)
                                            const resoureMember = {
                                                newResourceName,
                                                removeResourceName,
                                                removeResource: newResource * 1000,
                                                newResource: newResource
                                            }
                                            const response = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece3000/ece3740?member=${member}&miner=${minerId}`, data: resoureMember })
                                            if (response.status === 1310) {
                                                location.href = `./ece3601.html?member=${member}&miner=${minerId}`
                                            }
                                        }
                                    })

                                });
                            }
                            if (convertNumberChartData[1] >= 100) {
                                $("#s2g").click(function (e) {
                                    $("#popupchange").css("display", "block");
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.scrollTo({ top: 0 });
                                    ece5200_txt("은", "금");
                                    removeResourceName = "7508"
                                    newResourceName = "7509"
                                    console.log("Hello");
                                    $("#resourceInput").attr("max", convertNumberChartData[1])
                                    $("#resourceInput").attr("min", 100)
                                    $("#resourceInput").keyup(() => {
                                        let value = $("#resourceInput").val()
                                        value = Math.floor(Number(value) / 100)
                                        $("#destmetalqty").html(value);
                                    })
                                    $("#doExchange").click(async (e) => {
                                        let value = $("#resourceInput").val()
                                        let isFormValid = document.getElementById('myForm').checkValidity();
                                        console.log(isFormValid);
                                        if (!isFormValid) {
                                            document.getElementById('myForm').reportValidity();
                                        } else {
                                            e.preventDefault();
                                            let newResource = Math.floor(Number(value) / 100)
                                            const resoureMember = {
                                                newResourceName,
                                                removeResourceName,
                                                removeResource: newResource * 100,
                                                newResource: newResource
                                            }
                                            const response = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece3000/ece3740?member=${member}&miner=${minerId}`, data: resoureMember })
                                            if (response.status === 1310) {
                                                location.href = `./ece3601.html?member=${member}&miner=${minerId}`
                                            }
                                        }
                                    })

                                });
                            }
                            if (convertNumberChartData[2] >= 10) {
                                $("#g2d").click(function (e) {
                                    $("#popupchange").css("display", "block");
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.scrollTo({ top: 0 });
                                    ece5200_txt("금", "다이아몬드");
                                    removeResourceName = "7509"
                                    newResourceName = "7602";
                                    $("#resourceInput").attr("max", convertNumberChartData[2])
                                    $("#resourceInput").attr("min", 10)
                                    $("#resourceInput").keyup(() => {
                                        let value = $("#resourceInput").val()
                                        value = Math.floor(Number(value) / 10)
                                        $("#destmetalqty").html(value);
                                    })
                                    $("#doExchange").click(async (e) => {
                                        let value = $("#resourceInput").val()
                                        let isFormValid = document.getElementById('myForm').checkValidity();
                                        console.log(isFormValid);
                                        if (!isFormValid) {
                                            document.getElementById('myForm').reportValidity();
                                        } else {
                                            e.preventDefault();
                                            let newResource = Math.floor(Number(value) / 10)
                                            const resoureMember = {
                                                newResourceName,
                                                removeResourceName,
                                                removeResource: newResource * 10,
                                                newResource: newResource
                                            }
                                            const response = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece3000/ece3740?member=${member}&miner=${minerId}`, data: resoureMember })
                                            if (response.status === 1310) {
                                                location.href = `./ece3601.html?member=${member}&miner=${minerId}`
                                            }
                                        }
                                    })
                                });
                            }
                            //분해
                            if (convertNumberChartData[1] >= 1) {
                                $("#s2d").click(function (e) {
                                    $("#ece5200_txt").html("분해하기")
                                    $("#popupchange").css("display", "block");
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.scrollTo({ top: 0 });
                                    ece5200_txt("은", "동");
                                    removeResourceName = "7508"
                                    newResourceName = "7507"
                                    $("#resourceInput").attr("max", convertNumberChartData[1])
                                    $("#resourceInput").attr("min", 1)
                                    $("#resourceInput").keyup(() => {
                                        let value = $("#resourceInput").val()
                                        value = Math.floor(Number(value) * 1000)
                                        $("#destmetalqty").html(value);
                                    })
                                    $("#doExchange").click(async (e) => {
                                        let value = $("#resourceInput").val()
                                        let data = $("#destmetalqty").text();
                                        console.log(data, value);
                                        let isFormValid = document.getElementById('myForm').checkValidity();
                                        console.log(isFormValid);
                                        if (!isFormValid) {
                                            document.getElementById('myForm').reportValidity();
                                        } else {
                                            e.preventDefault();
                                            const resoureMember = {
                                                newResourceName,
                                                removeResourceName,
                                                removeResource: value,
                                                newResource: data
                                            }
                                            const response = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece3000/ece3740?member=${member}&miner=${minerId}`, data: resoureMember })
                                            if (response.status === 1310) {
                                                location.href = `./ece3601.html?member=${member}&miner=${minerId}`
                                            }
                                        }
                                    })
                                });
                            }
                            if (convertNumberChartData[2] >= 1) {
                                $("#g2s").click(function (e) {
                                    $("#ece5200_txt").html("분해하기")
                                    $("#popupchange").css("display", "block");
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.scrollTo({ top: 0 });
                                    ece5200_txt("금", "은");
                                    removeResourceName = "7509"
                                    newResourceName = "7508";
                                    $("#resourceInput").attr("max", convertNumberChartData[2])
                                    $("#resourceInput").attr("min", 1)
                                    $("#resourceInput").keyup(() => {
                                        let value = $("#resourceInput").val()
                                        value = Math.floor(Number(value) * 100)
                                        $("#destmetalqty").html(value);
                                    })
                                    $("#doExchange").click(async (e) => {
                                        let value = $("#resourceInput").val()
                                        let data = $("#destmetalqty").text();
                                        let isFormValid = document.getElementById('myForm').checkValidity();
                                        if (!isFormValid) {
                                            document.getElementById('myForm').reportValidity();
                                        } else {
                                            e.preventDefault();
                                            const resoureMember = {
                                                newResourceName,
                                                removeResourceName,
                                                removeResource: value,
                                                newResource: data
                                            }
                                            const response = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece3000/ece3740?member=${member}&miner=${minerId}`, data: resoureMember })
                                            if (response.status === 1310) {
                                                location.href = `./ece3601.html?member=${member}&miner=${minerId}`
                                            }
                                        }
                                    })
                                });
                            }
                            if (convertNumberChartData[3] >= 1) {
                                $("#d2g").click(function (e) {
                                    $("#ece5200_txt").html("분해하기")
                                    $("#popupchange").css("display", "block");
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.scrollTo({ top: 0 });
                                    ece5200_txt("다이아몬드", "금");
                                    removeResourceName = "7602"
                                    newResourceName = "7509";
                                    $("#resourceInput").attr("max", convertNumberChartData[3])
                                    $("#resourceInput").attr("min", 1)
                                    $("#resourceInput").keyup(() => {
                                        let value = $("#resourceInput").val()
                                        value = Math.floor(Number(value) * 10)
                                        $("#destmetalqty").html(value);
                                    })
                                    $("#doExchange").click(async (e) => {
                                        let value = $("#resourceInput").val()
                                        let data = $("#destmetalqty").text();
                                        let isFormValid = document.getElementById('myForm').checkValidity();
                                        if (!isFormValid) {
                                            document.getElementById('myForm').reportValidity();
                                        } else {
                                            e.preventDefault();
                                            const resoureMember = {
                                                newResourceName,
                                                removeResourceName,
                                                removeResource: value,
                                                newResource: data
                                            }
                                            const response = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece3000/ece3740?member=${member}&miner=${minerId}`, data: resoureMember })
                                            if (response.status === 1310) {
                                                location.href = `./ece3601.html?member=${member}&miner=${minerId}`
                                            }
                                        }
                                    })
                                });
                            }
                            chart.render();
                        } else {
                            const chartCategoryData = ["금", "은", "동", "다이아몬드"]
                            const chartData = [0, 0, 0, 0, 0]
                            const resourceText = document.getElementsByClassName('resourceitem')
                            const resourceTitleList = document.getElementsByClassName('resourceitemtitle')
                            Array(chartData.length).fill().forEach((v, index) => {
                                const item = resourceText.item(index)
                                const itemTitle = resourceTitleList.item(index)
                                item.innerHTML = chartData[index]
                                itemTitle.innerHTML = chartCategoryData[index]
                            })
                            var chart = new ApexCharts(document.querySelector("#chart"), options({ chartCategoryData, chartData }));
                            chart.render();
                        }
                    })
            }
        } else {
            let [miner, minerId] = location.search.split("&")[1].split("=");
            AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece3000/ece3730?member=${member}&miner=${minerId}` })
                .then((response) => {
                    const { data: responseData } = response
                    if (responseData.length !== 0) {
                        const [chartCategoryData, chartData] = responseData.reduce((prev, cur) => {
                            const categoryName = selectCodeNameTpCodeTable({ data, codeName: cur.resource })
                            if (prev.length === 0) {
                                prev[0] = [categoryName];
                                prev[1] = [cur.amount];
                            }
                            else {
                                prev[0] = [...prev[0], categoryName];
                                prev[1] = [...prev[1], cur.amount];
                            }
                            return prev;
                        }, [])
                        const chartCategoryDataTitle = ["금", "은", "동", "다이아몬드"]
                        const resourceText = document.getElementsByClassName('resourceitem')
                        const resourceTitleList = document.getElementsByClassName('resourceitemtitle')
                        const tagbg = document.getElementsByClassName('sc-timeline-info')
                        const tagicon = document.getElementsByClassName('sc-timeline-icon')
                        console.log(chartData);
                        Array(resourceText.length).fill().forEach((v, index) => {
                            const item = resourceText.item(index)
                            const itemTitle = resourceTitleList.item(index)
                            item.innerHTML = chartData[index]
                            itemTitle.innerHTML = chartCategoryData[index]
                            if (chartCategoryData[index] === "동") {
                                tagicon.item(index).style.backgroundImage = `url('./assets/aa.png')`;
                                tagbg.item(index).style.background = `#fea47857`;

                            }
                            if (chartCategoryData[index] === "금") {
                                tagicon.item(index).style.backgroundImage = `url('./assets/gold.png')`;
                                tagbg.item(index).style.background = `#cfaf3d3d`;
                            }
                            if (chartCategoryData[index] === "다이아몬드") {
                                tagicon.item(index).style.backgroundImage = `url('./assets/dia.png')`;
                                tagbg.item(index).style.background = `#ffffff49`;
                            }
                            if (chartCategoryData[index] === "은") {
                                tagicon.item(index).style.backgroundImage = `url('./assets/sliver.png')`;
                                tagbg.item(index).style.background = `#fffafa3d`;
                            }
                        })
                        var chart = new ApexCharts(document.querySelector("#chart"), options({ chartCategoryData, chartData }));
                        const convertNumberChartData = chartData.map((v) => Number(v))
                        //반환
                        if (convertNumberChartData[0] >= 1000) {
                            $("#d2s").click(function (e) {
                                $("#popupchange").css("display", "block");
                                e.preventDefault();
                                e.stopPropagation();
                                window.scrollTo({ top: 0 });
                                ece5200_txt("동", "은");
                                removeResourceName = "7507"
                                newResourceName = "7508"
                                $("#resourceInput").attr("max", convertNumberChartData[0])
                                $("#resourceInput").attr("min", 1000)
                                $("#resourceInput").keyup(() => {
                                    let value = $("#resourceInput").val()
                                    value = Math.floor(Number(value) / 1000)
                                    $("#destmetalqty").html(value);
                                })
                                $("#doExchange").click(async (e) => {
                                    let value = $("#resourceInput").val()
                                    let isFormValid = document.getElementById('myForm').checkValidity();
                                    console.log(isFormValid);
                                    if (!isFormValid) {
                                        document.getElementById('myForm').reportValidity();
                                    } else {
                                        e.preventDefault();
                                        let newResource = Math.floor(Number(value) / 1000)
                                        const resoureMember = {
                                            newResourceName,
                                            removeResourceName,
                                            removeResource: newResource * 1000,
                                            newResource: newResource
                                        }
                                        const response = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece3000/ece3740?member=${member}&miner=${minerId}`, data: resoureMember })
                                        if (response.status === 1310) {
                                            location.href = `./ece3601.html?member=${member}&miner=${minerId}`
                                        }
                                    }
                                })

                            });
                        }
                        if (convertNumberChartData[1] >= 100) {
                            $("#s2g").click(function (e) {
                                $("#popupchange").css("display", "block");
                                e.preventDefault();
                                e.stopPropagation();
                                window.scrollTo({ top: 0 });
                                ece5200_txt("은", "금");
                                removeResourceName = "7508"
                                newResourceName = "7509"
                                console.log("Hello");
                                $("#resourceInput").attr("max", convertNumberChartData[1])
                                $("#resourceInput").attr("min", 100)
                                $("#resourceInput").keyup(() => {
                                    let value = $("#resourceInput").val()
                                    value = Math.floor(Number(value) / 100)
                                    $("#destmetalqty").html(value);
                                })
                                $("#doExchange").click(async (e) => {
                                    let value = $("#resourceInput").val()
                                    let isFormValid = document.getElementById('myForm').checkValidity();
                                    console.log(isFormValid);
                                    if (!isFormValid) {
                                        document.getElementById('myForm').reportValidity();
                                    } else {
                                        e.preventDefault();
                                        let newResource = Math.floor(Number(value) / 100)
                                        const resoureMember = {
                                            newResourceName,
                                            removeResourceName,
                                            removeResource: newResource * 100,
                                            newResource: newResource
                                        }
                                        const response = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece3000/ece3740?member=${member}&miner=${minerId}`, data: resoureMember })
                                        if (response.status === 1310) {
                                            location.href = `./ece3601.html?member=${member}&miner=${minerId}`
                                        }
                                    }
                                })

                            });
                        }
                        if (convertNumberChartData[2] >= 10) {
                            $("#g2d").click(function (e) {
                                $("#popupchange").css("display", "block");
                                e.preventDefault();
                                e.stopPropagation();
                                window.scrollTo({ top: 0 });
                                ece5200_txt("금", "다이아몬드");
                                removeResourceName = "7509"
                                newResourceName = "7602";
                                $("#resourceInput").attr("max", convertNumberChartData[2])
                                $("#resourceInput").attr("min", 10)
                                $("#resourceInput").keyup(() => {
                                    let value = $("#resourceInput").val()
                                    value = Math.floor(Number(value) / 10)
                                    $("#destmetalqty").html(value);
                                })
                                $("#doExchange").click(async (e) => {
                                    let value = $("#resourceInput").val()
                                    let isFormValid = document.getElementById('myForm').checkValidity();
                                    console.log(isFormValid);
                                    if (!isFormValid) {
                                        document.getElementById('myForm').reportValidity();
                                    } else {
                                        e.preventDefault();
                                        let newResource = Math.floor(Number(value) / 10)
                                        const resoureMember = {
                                            newResourceName,
                                            removeResourceName,
                                            removeResource: newResource * 10,
                                            newResource: newResource
                                        }
                                        const response = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece3000/ece3740?member=${member}&miner=${minerId}`, data: resoureMember })
                                        if (response.status === 1310) {
                                            location.href = `./ece3601.html?member=${member}&miner=${minerId}`
                                        }
                                    }
                                })
                            });
                        }
                        //분해
                        if (convertNumberChartData[1] >= 1) {
                            $("#s2d").click(function (e) {
                                $("#ece5200_txt").html("분해하기")
                                $("#popupchange").css("display", "block");
                                e.preventDefault();
                                e.stopPropagation();
                                window.scrollTo({ top: 0 });
                                ece5200_txt("은", "동");
                                removeResourceName = "7508"
                                newResourceName = "7507"
                                $("#resourceInput").attr("max", convertNumberChartData[1])
                                $("#resourceInput").attr("min", 1)
                                $("#resourceInput").keyup(() => {
                                    let value = $("#resourceInput").val()
                                    value = Math.floor(Number(value) * 1000)
                                    $("#destmetalqty").html(value);
                                })
                                $("#doExchange").click(async (e) => {
                                    let value = $("#resourceInput").val()
                                    let data = $("#destmetalqty").text();
                                    console.log(data, value);
                                    let isFormValid = document.getElementById('myForm').checkValidity();
                                    console.log(isFormValid);
                                    if (!isFormValid) {
                                        document.getElementById('myForm').reportValidity();
                                    } else {
                                        e.preventDefault();
                                        const resoureMember = {
                                            newResourceName,
                                            removeResourceName,
                                            removeResource: value,
                                            newResource: data
                                        }
                                        const response = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece3000/ece3740?member=${member}&miner=${minerId}`, data: resoureMember })
                                        if (response.status === 1310) {
                                            location.href = `./ece3601.html?member=${member}&miner=${minerId}`
                                        }
                                    }
                                })
                            });
                        }
                        if (convertNumberChartData[2] >= 1) {
                            $("#g2s").click(function (e) {
                                $("#ece5200_txt").html("분해하기")
                                $("#popupchange").css("display", "block");
                                e.preventDefault();
                                e.stopPropagation();
                                window.scrollTo({ top: 0 });
                                ece5200_txt("금", "은");
                                removeResourceName = "7509"
                                newResourceName = "7508";
                                $("#resourceInput").attr("max", convertNumberChartData[2])
                                $("#resourceInput").attr("min", 1)
                                $("#resourceInput").keyup(() => {
                                    let value = $("#resourceInput").val()
                                    value = Math.floor(Number(value) * 100)
                                    $("#destmetalqty").html(value);
                                })
                                $("#doExchange").click(async (e) => {
                                    let value = $("#resourceInput").val()
                                    let data = $("#destmetalqty").text();
                                    let isFormValid = document.getElementById('myForm').checkValidity();
                                    if (!isFormValid) {
                                        document.getElementById('myForm').reportValidity();
                                    } else {
                                        e.preventDefault();
                                        const resoureMember = {
                                            newResourceName,
                                            removeResourceName,
                                            removeResource: value,
                                            newResource: data
                                        }
                                        const response = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece3000/ece3740?member=${member}&miner=${minerId}`, data: resoureMember })
                                        if (response.status === 1310) {
                                            location.href = `./ece3601.html?member=${member}&miner=${minerId}`
                                        }
                                    }
                                })
                            });
                        }
                        if (convertNumberChartData[3] >= 1) {
                            $("#d2g").click(function (e) {
                                $("#ece5200_txt").html("분해하기")
                                $("#popupchange").css("display", "block");
                                e.preventDefault();
                                e.stopPropagation();
                                window.scrollTo({ top: 0 });
                                ece5200_txt("다이아몬드", "금");
                                removeResourceName = "7602"
                                newResourceName = "7509";
                                $("#resourceInput").attr("max", convertNumberChartData[3])
                                $("#resourceInput").attr("min", 1)
                                $("#resourceInput").keyup(() => {
                                    let value = $("#resourceInput").val()
                                    value = Math.floor(Number(value) * 10)
                                    $("#destmetalqty").html(value);
                                })
                                $("#doExchange").click(async (e) => {
                                    let value = $("#resourceInput").val()
                                    let data = $("#destmetalqty").text();
                                    let isFormValid = document.getElementById('myForm').checkValidity();
                                    if (!isFormValid) {
                                        document.getElementById('myForm').reportValidity();
                                    } else {
                                        e.preventDefault();
                                        const resoureMember = {
                                            newResourceName,
                                            removeResourceName,
                                            removeResource: value,
                                            newResource: data
                                        }
                                        const response = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece3000/ece3740?member=${member}&miner=${minerId}`, data: resoureMember })
                                        if (response.status === 1310) {
                                            location.href = `./ece3601.html?member=${member}&miner=${minerId}`
                                        }
                                    }
                                })
                            });
                        }
                        chart.render();
                    } else {
                        const chartCategoryData = ["금", "은", "동", "다이아몬드"]
                        const chartData = [0, 0, 0, 0, 0]
                        const resourceText = document.getElementsByClassName('resourceitem')
                        const resourceTitleList = document.getElementsByClassName('resourceitemtitle')
                        Array(chartData.length).fill().forEach((v, index) => {
                            const item = resourceText.item(index)
                            const itemTitle = resourceTitleList.item(index)
                            item.innerHTML = chartData[index]
                            itemTitle.innerHTML = chartCategoryData[index]
                        })
                        var chart = new ApexCharts(document.querySelector("#chart"), options({ chartCategoryData, chartData }));
                        chart.render();
                    }
                })
        }


    })
// #cfaf3d3d;bbbbbb3d;bf7c5b57;ffffff49
const colors = ["#bf7c5b57", "#fffafa3d", "#cfaf3d3d", "#ffffff49"]
function options({ chartData, chartCategoryData }) {

    let sortingNumber = chartData.map(v => Number(v))
    let sortingNumber1 = chartData.map(v => {
        let a = Math.log(Number(v))
        if ('-Infinity' === `${a}`) {
            a = 0
        }
        return a;
    })
    let sortingNumber2 = chartData.map(v => {
        let a = Math.log(Number(v))
        if ('-Infinity' === `${a}`) {
            a = 0
        }
        return a;
    })

    sortingNumber2.sort(function (a, b) {
        if (a > b) return 1;
        if (a === b) return 0;
        if (a < b) return -1;
    });
    sortingNumber.sort(function (a, b) {
        if (a > b) return 1;
        if (a === b) return 0;
        if (a < b) return -1;
    });
    return {
        tooltip: { enabled: false },
        series: [{
            data: sortingNumber1
        }],
        markers: {
            colors: ['#000000']
        },

        chart: {
            height: 350,
            type: 'bar',
            events: {
                click: false
            },
            foreColor: '#ffffff'
        },
        colors: colors,
        plotOptions: {
            bar: {
                columnWidth: '45%',
                distributed: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false,
            style: {
                colors: ["#000000"]
            }
        },
        xaxis: {
            categories: chartCategoryData,
            labels: {
                style: {
                    // colors:,
                    fontSize: '12px',
                    cssClass: 'apexcharts-text-title',
                    textColor: "#fff"
                }
            },
            title: { style: { color: "#fdfdfdf" } }
        }, yaxis: {
            // min: 0,
            max: () => {
                let data;
                if (sortingNumber2[2] === 0) {
                    data = sortingNumber2[3]
                } else {
                    data = Math.round(sortingNumber2[2] * 1.5)
                }
                return data;
            },
            tickAmount: 4,
            // categories: ["0", "1", "234", "1234"],
            labels: {
                show: false,
                style: {
                    colors: "#fff"
                },
            }
        }
    }
}
function ece5200_txt(prev, cur, defaultprice) {
    $("#destmetalqty").text(defaultprice)
    $("#starttmetal").text(prev);
    $("#destmetal").text(cur);
}