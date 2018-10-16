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
        a_food: 'a_food',
        a_car: 'a_car',
        a_shopping: 'a_shopping',
        a_money: 'a_money',
        a_food_data: [
            [1, 1],
            [2, 5],
            [3, 10],
            [4, 15],
            [5, 3],
            [6, 5],
            [7, 7],
            [8, 4],
            [9, 10],
            [10, 13],
            [11, 11],
            [12, 5]
        ],
        a_car_data: [
            [1, 11],
            [2, 15],
            [3, 2],
            [4, 10],
            [5, 13],
            [6, 15],
            [7, 17],
            [8, 14],
            [9, 10],
            [10, 3],
            [11, 11],
            [12, 5]
        ],
        a_shopping_data: [
            [1, 11],
            [2, 5],
            [3, 13],
            [4, 6],
            [5, 3],
            [6, 15],
            [7, 9],
            [8, 14],
            [9, 3],
            [10, 13],
            [11, 5],
            [12, 9]
        ],
        a_money_data: [
            [1, 4],
            [2, 6],
            [3, 2],
            [4, 19],
            [5, 13],
            [6, 11],
            [7, 17],
            [8, 8],
            [9, 12],
            [10, 5],
            [11, 2],
            [12, 16]
        ],
    },
    onLoad: function() {
        this.echartsComponment = this.selectComponent('#mychart-dom-line');
        this.getData();
    },
    onReady: function() {
        this.selectComponent('#timeHaveIcon').loadChangeDate();
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
    categoryChangeIcon: function(e) {
        const category = e.currentTarget.dataset.state.split('_active');
        const state = category.length > 1;
        const key = category[0];
        const data = key + '_data';
        if (state) {
            this.setData({
                [key]: key
            })
        } else {
            let val = key + '_active';
            this.setData({
                [key]: val
            })
        }
        //根据key发送对应请求
        dataList = this.data[data];
        this.set_option(Chart);
    }
})