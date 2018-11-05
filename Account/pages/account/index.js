//index.js
//获取应用实例
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

Page({
    data: {
        date: '2018',
        count: '',
        title: '',
        dataList: [],
        ec: {
            lazyLoad: true
        },
        dateArray: [],
        dateIndex: [],
        state: {
            month: {
                title: '月花费',
                type: 'month_active',
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
            }
        },
        food: {
            title: "饮食",
            count: "12",
            iconPath: "../../img/UI/icon/a_food_active.png"
        },
        travel: {
            title: "出行",
            count: "8",
            iconPath: "../../img/UI/icon/a_car_active.png"
        },
        recreation: {
            title: "娱乐",
            count: "453",
            iconPath: "../../img/UI/icon/a_shopping_active.png"
        }
    },
    selectDateChangeDisplay: function(e) {
        this.setData({
            date: e.detail.value
        })
    },
    onLoad: function() {
        //时间下拉框
        this.setDateArray();
        this.echartsComponment = this.selectComponent('#mychart-dom-line');
        this.categoryChangeIconFun('month');
    },
    onReady: function() {
        // this.selectComponent('#timeHaveIcon').loadChangeDate();
    },
    onShow() {
        wx.getStorage({
            key: 'todayData',
            success(res) {
                // console.log(res.data)
            }
        });
    },
    setDateArray() {
        let monthArr = [],
            yearArr = [],
            nowDate = new Date(),
            nowYear = nowDate.getFullYear(),
            nowMonth = nowDate.getMonth();
        for (let i = 0; i < 12; i++) {
            monthArr.push((i + 1) + '月');
        }
        for (let j = 1989; j < 2051; j++) {
            yearArr.push(j)
        }

        this.setData({
            dateArray: [yearArr, monthArr],
            dateIndex: [nowYear - 1989, nowMonth]
        })
    },
    bindPickerDateChange(e) {
        this.setData({
            dateIndex: [e.detail.value[0], e.detail.value[1]]
        })
    },
    init_charts: function() {
        const that = this;
        this.echartsComponment.init((canvas, width, height) => {
            let echart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            that.set_option(echart);
            return echart;
        })
    },
    set_option: function(chart) {
        // chart.clear();
        chart.setOption(this.get_option(this.data.dataList));
    },
    //icon点击事件触发器
    categoryChangeIcon: function(e) {
        const name = e.currentTarget.dataset.state.split('_active')[0]; //被点击icon的名字

        this.categoryChangeIconFun(name);
    },
    //icon点击事件触发器
    categoryChangeIconFun: function(key) {

        const stateObj = this.data.state;
        //设置所有据处于未激活状态
        Object.keys(stateObj).forEach((k) => {
            let val = stateObj[k].type.split('_active')[0];
            let keys = `state.${k}.type`;
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
        // dataList = stateObj[key].data;
        this.setData({
            dataList: stateObj[key].data
        })
        if (!this.data.chart) {
            this.init_charts();
        } else {
            this.set_option(this.data.chart);
        }

        let num = this.data.dataList.reduce((sum, arr) => {
            return sum + arr[1];
        }, 0)
        this.changeTheShowMoney(num)
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
    }, //图表配置
    get_option: function(dataList) {
        let option = {
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
    }
})