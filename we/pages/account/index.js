//index.js
//获取应用实例
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();


var dataList = [
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
    [12, 70]
];
var Chart = null;

Page({
    data: {
        count: '100.00',
        ec: {
            lazyLoad: true
        },
        aFood: 'a_food',
        aCar: 'a_car',
        aShopping: 'a_shopping',
        aMoney: 'a_money',
    },
    onLoad: function() {
        this.echartsComponment = this.selectComponent('#mychart-dom-line');
        this.getData();
    },
    onReady: function() {
        this.selectComponent('#timeHaveIcon').loadChangeDate();
        setInterval(() => {
            this.set_option(Chart);
        }, 4000)
    },
    getData: function() {
        if (!Chart) {
            this.init_charts();
        } else {
            this.set_option(Chart);
        }
    },
    init_charts: function() {
        this.echartsComponment.init((canvas, width, height) => {
            Chart = echarts.init(canvas, null, {
                width: width,
                height: height
            });

            this.set_option(Chart);
            return Chart;
        })
    },
    set_option: function(Chart) {
        // Chart.clear();
        Chart.setOption(this.get_option());
    },
    get_option: function() {
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
                trigger: 'axis',
                renderMode: 'richText',
                confine: true
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
                data: dataList
            }]
        };
        return option
    },
    categoryChangeIcon: function() {}
})