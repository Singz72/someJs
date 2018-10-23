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
            title: '总额',
            ec: {
                lazyLoad: true
            },
            state: {
                a_food: {
                    title: '饮食',
                    type: 'a_food',
                    data: [
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
                    ]
                },
                a_car: {
                    title: '出行',
                    type: 'a_car',
                    data: [
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
                    ]
                },
                a_shopping: {
                    title: '娱乐',
                    type: 'a_shopping',
                    data: [
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
                    ]
                },
                a_money: {
                    title: '总额',
                    type: 'a_money',
                    data: [
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
                    ]
                }
            }
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
                grid: {
                    containLabel: true
                },
                tooltip: {
                    show: false,
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

            const stateObj = this.data.state;
            const key = e.currentTarget.dataset.state.split('_active')[0];

            //设置所有据处于未激活状态
            Object.keys(stateObj).forEach((k) => {
                var val = stateObj[k].type.split('_active')[0];
                var keys = `state.${k}.type`;
                this.setData({
                    [keys]: val
                })
            })

            //激活当前点击状态
            let val = key + '_active';
            let keys = `state.${key}.type`;
            this.setData({
                [keys]: val
            })

            //设置总额title
            let title = stateObj[key].title;
            this.setData({
                title: title
            })

            //根据key发送对应请求
            dataList = stateObj[key].data;
            this.set_option(Chart);

            let num = dataList.reduce((sum, arr) => {
                return sum + arr[1];
            }, 0)
            console.log(this.changeTheShowMoney(num))
        },
        //改变显示的金钱数
        changeTheShowMoney: function(num) {
            let strNum;
            num = num + '';
            if (num.indexOf('.') > -1) {
                const numArr = num.split('.');
                const l = numArr[1].length;
                if (l == 1) {
                    strNum = num + '0';
                } else if (l > 2) {
                    strNum = numArr[0] + '.' + numArr[1].substring(0, 2);
                } else {
                    strNum = num;
                }
            } else {
                strNum = num + '.00';
            }

            this.setData({
                count: strNum
            })
            return strNum;
        }
    })
    //可选按钮：食、行、娱、其他和总
    //添加类别明细（折线图下面）