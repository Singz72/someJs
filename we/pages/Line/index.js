import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function initCharts(canvas, width, height) {
    const chart = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(chart);

    var option = {
        title: {
            text: '',
            left: 'center'
        },
        color: ["#ffcc33"],
        legend: {
            data: [''],
            top: 50,
            left: 'center',
            z: 100
        },
        grid: {
            containLabel: true
        },
        tooltip: {
            show: true,
            trigger: 'axis'
        },
        axisPointer: {
            type: 'line',
            lineStyle: {
                type: 'dashed'
            }
        },
        xAxis: {
            name: '',
            type: 'value',
            // boundaryGap: true,
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            // show: false,
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#7f8389'
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: ['rgba(0,0,0,0)', '#ddd']
                }
            },
            interval: 3,
            scale: true,
            axisTick: {
                show: false
            }
        },
        yAxis: {
            name: '',
            x: 'center',
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: ['rgba(0,0,0,0)', '#ddd']
                }
            },
            // show: false
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#7f8389'
                }
            },
            axisTick: {
                show: false
            }
        },
        series: [{
            name: '消费',
            type: 'line',
            smooth: true,
            data: [
                [1, 18],
                [2, 36],
                [3, 65],
                [4, 30],
                [5, 78],
                [6, 40],
                [7, 33],
                [8, 12],
                [9, 50],
                [10, 51],
                [11, 35],
                [12, 70],
                [13, 35],
                [14, 70],
                [15, 35],
                [16, 70],
                [17, 35],
                [18, 70],
                [19, 35],
                [20, 70],
                [21, 18],
                [22, 36],
                [23, 65],
                [24, 30],
                [25, 78],
                [26, 40],
                [27, 33],
                [28, 12],
                [29, 50],
                [30, 51],
            ]
        }]
    };

    chart.setOption(option);
    return chart;
}

Page({
    data: {
        ec: {
            onInit: initCharts
        }
    }
})