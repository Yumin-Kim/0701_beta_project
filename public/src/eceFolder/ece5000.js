const minerTimer = 0
let newResourceName;
let removeResourceName;
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
        $("#qtySelect").change(() => {
            const e = document.getElementById("qtySelect");
            const value = e.value; // value
            const text = e.options[e.selectedIndex].text;
            $("#destmetalqty").html(value)
        })
        $("#doExchange").click(async () => {
            const e = document.getElementById("qtySelect");
            const value = e.value; // value
            const text = e.options[e.selectedIndex].text; // text
            const resoureMember = {
                newResourceName,
                removeResourceName,
                removeResource: text,
                newResource: value
            }
            const { data: resourceList, status } = await AJAXRequestMethod({ method: "POST", requestURL: `${serverURL}/ece5000/ece5200?member=${member}`, data: resoureMember })
            if (status === 1310) {
                const [chartCategoryData, chartData] = resourceList.reduce((prev, cur) => {
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
                Array(resourceText.length).fill().forEach((v, index) => {
                    const item = resourceText.item(index)
                    const itemTitle = resourceTitleList.item(index)
                    item.innerHTML = chartData[index]
                    itemTitle.innerHTML = chartCategoryData[index]
                    // if (chartCategoryData[index] === "동") {
                    //     tagicon.item(index).style.backgroundImage = `url('./assets/aa.png')`;
                    //     tagbg.item(index).style.background = `#fea47857`;
                    // }
                    // if (chartCategoryData[index] === "금") {
                    //     tagicon.item(index).style.backgroundImage = `url('./assets/gold.png')`;
                    //     tagbg.item(index).style.background = `#cfaf3d3d`;
                    // }
                    // if (chartCategoryData[index] === "다이아몬드") {
                    //     tagicon.item(index).style.backgroundImage = `url('./assets/dia.png')`;
                    //     tagbg.item(index).style.background = `#ffffff49`;
                    // }
                    // if (chartCategoryData[index] === "은") {
                    //     tagicon.item(index).style.backgroundImage = `url('./assets/sliver.png')`;
                    //     tagbg.item(index).style.background = `#fffafa3d`;
                    // }
                })
                const convertNumberChartData = chartData.map((v) => Number(v))
                $("#d2s").off("click")
                $("#s2g").off("click")
                $("#g2d").off("click")
                $("#s2d").off("click")
                $("#g2s").off("click")
                $("#d2g").off("click")
                //반환
                if (convertNumberChartData[0] >= 1000) {
                    $("#d2s").click(function (e) {
                        $("#popupchange").css("display", "block");
                        e.preventDefault();
                        e.stopPropagation();
                        window.scrollTo({ top: 0 });
                        ece5200_txt("동", "은");
                        ece5200_selectBox(convertNumberChartData[0], 7507);
                        removeResourceName = "7507"
                        newResourceName = "7508"
                    });
                }
                if (convertNumberChartData[1] >= 100) {
                    $("#s2g").click(function (e) {
                        $("#popupchange").css("display", "block");
                        e.preventDefault();
                        e.stopPropagation();
                        window.scrollTo({ top: 0 });
                        ece5200_txt("은", "금");
                        ece5200_selectBox(convertNumberChartData[1], 7508)
                        removeResourceName = "7508"
                        newResourceName = "7509"
                    });
                }
                if (convertNumberChartData[2] >= 10) {
                    $("#g2d").click(function (e) {
                        $("#popupchange").css("display", "block");
                        e.preventDefault();
                        e.stopPropagation();
                        window.scrollTo({ top: 0 });
                        ece5200_txt("금", "다이아몬드");
                        ece5200_selectBox(convertNumberChartData[2], 7509)
                        removeResourceName = "7509"
                        newResourceName = "7602"
                    });
                }
                //분해
                if (convertNumberChartData[1] >= 1) {
                    $("#s2d").click(function (e) {
                        $("#popupchange").css("display", "block");
                        e.preventDefault();
                        e.stopPropagation();
                        window.scrollTo({ top: 0 });
                        ece5200_txt("은", "동");
                        ece5200_selectBox_2(convertNumberChartData[1], 7507)
                        removeResourceName = "7508"
                        newResourceName = "7507"
                    });
                }
                if (convertNumberChartData[2] >= 1) {
                    $("#g2s").click(function (e) {
                        $("#popupchange").css("display", "block");
                        e.preventDefault();
                        e.stopPropagation();
                        window.scrollTo({ top: 0 });
                        ece5200_txt("금", "은");
                        ece5200_selectBox_2(convertNumberChartData[2], 7508);
                        removeResourceName = "7509"
                        newResourceName = "7508"
                    });
                }
                if (convertNumberChartData[3] >= 1) {
                    $("#d2g").click(function (e) {
                        $("#popupchange").css("display", "block");
                        e.preventDefault();
                        e.stopPropagation();
                        window.scrollTo({ top: 0 });
                        ece5200_txt("다이아몬드", "금");
                        ece5200_selectBox_2(convertNumberChartData[3], 7509);
                        removeResourceName = "7602"
                        newResourceName = "7509"
                    });
                }
                var chart = new ApexCharts(document.querySelector("#chart"), options({ chartCategoryData, chartData }));
                var div = document.querySelector("#chart")
                while (div.hasChildNodes()) {
                    div.removeChild(div.firstChild);
                }
                chart.render();
                $("#popupchange").fadeOut();
            }
        })
        $("#doClose").click(function () {

            $("#popupchange").css("display", "none");
        });


        $('#resourceText').html(bannerList)
        const trickResource = $("#resourceTrick").text()
        setInterval(() => {
            const unixtime = Math.floor(new Date().getTime() / 1000)
            $("#resourceTrick").text(`${trickResource}.${String(unixtime).slice(5, 10)}`)
        }, 1000)
        AJAXRequestMethod({ method: "GET", requestURL: `${serverURL}/ece5000/ece5100?member=${member}` })
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
                            ece5200_selectBox(convertNumberChartData[0], 7507);
                            removeResourceName = "7507"
                            newResourceName = "7508"
                        });
                    }
                    if (convertNumberChartData[1] >= 100) {
                        $("#s2g").click(function (e) {
                            $("#popupchange").css("display", "block");
                            e.preventDefault();
                            e.stopPropagation();
                            window.scrollTo({ top: 0 });
                            ece5200_txt("은", "금");
                            ece5200_selectBox(convertNumberChartData[1], 7508)
                            removeResourceName = "7508"
                            newResourceName = "7509"
                        });
                    }
                    if (convertNumberChartData[2] >= 10) {
                        $("#g2d").click(function (e) {
                            $("#popupchange").css("display", "block");
                            e.preventDefault();
                            e.stopPropagation();
                            window.scrollTo({ top: 0 });
                            ece5200_txt("금", "다이아몬드");
                            ece5200_selectBox(convertNumberChartData[2], 7509)
                            removeResourceName = "7509"
                            newResourceName = "7602"
                        });
                    }
                    //분해
                    if (convertNumberChartData[1] >= 1) {
                        $("#s2d").click(function (e) {
                            $("#popupchange").css("display", "block");
                            e.preventDefault();
                            e.stopPropagation();
                            window.scrollTo({ top: 0 });
                            ece5200_txt("은", "동");
                            ece5200_selectBox_2(convertNumberChartData[1], 7507)
                            removeResourceName = "7508"
                            newResourceName = "7507"
                        });
                    }
                    if (convertNumberChartData[2] >= 1) {
                        $("#g2s").click(function (e) {
                            $("#popupchange").css("display", "block");
                            e.preventDefault();
                            e.stopPropagation();
                            window.scrollTo({ top: 0 });
                            ece5200_txt("금", "은");
                            ece5200_selectBox_2(convertNumberChartData[2], 7508);
                            removeResourceName = "7509"
                            newResourceName = "7508"
                        });
                    }
                    if (convertNumberChartData[3] >= 1) {
                        $("#d2g").click(function (e) {
                            $("#popupchange").css("display", "block");
                            e.preventDefault();
                            e.stopPropagation();
                            window.scrollTo({ top: 0 });
                            ece5200_txt("다이아몬드", "금");
                            ece5200_selectBox_2(convertNumberChartData[3], 7509);
                            removeResourceName = "7602"
                            newResourceName = "7509"
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
function ece5200_selectBox(price, type) {
    let decimal;
    if (type === 7507) {
        decimal = 1000;
    } else if (type === 7508) {
        decimal = 100;
    } else {
        decimal = 10;
    }
    const data = Math.floor(price / decimal);
    const mapping = Array(data).fill().map((v, i) => {
        const value = decimal * (i + 1)
        return `<option value="${i + 1}">${value}</option>`
    })
    const HTML = mapping.join(",").replaceAll(",", "")
    $("#optionBox").html(HTML)
    $("#destmetalqty").html(1)
}
function ece5200_selectBox_2(price, type) {
    let decimal;
    if (type === 7507) {
        decimal = 1000;
    } else if (type === 7508) {
        decimal = 100;
    } else {
        decimal = 10;
    }
    const mapping = Array(price).fill().map((v, i) => {
        const value = decimal * (i + 1)
        return `<option value="${value}">${(i + 1)}</option>`
    })
    const HTML = mapping.join(",").replaceAll(",", "")
    $("#optionBox").html(HTML)
    $("#destmetalqty").html(1 * decimal)
}