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
        $('#popupchange').on('scroll touchmove mousewheel', e => {

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
                    console.log(chartCategoryData);
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
    sortingNumber.sort(function (a, b) {
        if (a > b) return 1;
        if (a === b) return 0;
        if (a < b) return -1;
    });
    return {
        series: [{
            data: chartData
        }],
        markers: {
            colors: ['#000000']
        },

        chart: {
            height: 350,
            type: 'bar',
            events: {
                click: function (chart, w, e) {
                }
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
                if (sortingNumber[2] === 0) {
                    data = sortingNumber[3]
                } else {
                    data = Math.round(sortingNumber[2] + sortingNumber[2] / 3)
                }
                return data
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

