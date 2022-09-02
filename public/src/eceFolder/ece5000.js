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
                    Array(resourceText.length).fill().forEach((v, index) => {
                        const item = resourceText.item(index)
                        const itemTitle = resourceTitleList.item(index)
                        item.innerHTML = chartData[index]
                        itemTitle.innerHTML = chartCategoryDataTitle[index]
                    })
                    var chart = new ApexCharts(document.querySelector("#chart"), options({ chartCategoryData, chartData }));
                    chart.render();
                } else {
                    const chartCategoryData = ["금", "은", "동", "다이아몬드"]
                    const chartData = [0, 0, 0, 0, 0]
                    const resourceText = document.getElementsByClassName('resourceitem')
                    const resourceTitleList = document.getElementsByClassName('resourceitemtitle')
                    console.log(resourceTitleList);
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

const colors = ["#239DF5", "#824949", "#A8A8A8", "#A62C2C", "#32C981"]
function options({ chartData, chartCategoryData }) {
    return {
        series: [{
            data: chartData
        }],
        markers: {
            colors: ['#000000',]
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
                    colors,
                    fontSize: '10px'
                }
            }
        }
    }
}

