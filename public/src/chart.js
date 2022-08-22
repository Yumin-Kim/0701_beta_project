const colors = ["#239DF5", "#824949", "#A8A8A8", "#A62C2C", "#32C981"]
var options = {
    series: [{
        data: [21, 22, 10, 28, 16]
    }],
    markers: {
        colors: ['#000000',]
    },

    chart: {
        height: 350,
        type: 'bar',
        events: {
            click: function (chart, w, e) {
                // console.log(chart, w, e)
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