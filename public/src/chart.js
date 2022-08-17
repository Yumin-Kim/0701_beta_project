const colors = ["#1e81b0", "#76b5c5", "#873e23", "#eab676", "#b603fc"]
var options = {
    series: [{
        data: [21, 22, 10, 28, 16]
    }],
    chart: {
        height: 350,
        type: 'bar',
        events: {
            click: function (chart, w, e) {
                // console.log(chart, w, e)
            }
        }
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
        show: false
    },
    xaxis: {
        categories: [
            '물',
            '목재',
            '철광석',
            '석탄',
            '크립토나이트',
        ],
        labels: {
            style: {
                colors,
                fontSize: '10px'
            }
        }
    }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();