//index.js
//获取应用实例
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

Page({
    data: {
        count: '',
        title: '消费总额',
        dataList: [],
        dataList11: [{
                value: 30,
                name: '饮食'
            },
            {
                value: 8,
                name: '出行'
            },
            {
                value: 20,
                name: '娱乐'
            },
            {
                value: 10,
                name: '一般'
            }
        ],
        dataList12: [{
                value: 34,
                name: '饮食'
            },
            {
                value: 120,
                name: '出行'
            },
            {
                value: 10,
                name: '娱乐'
            },
            {
                value: 50,
                name: '一般'
            }
        ],
        ec: {
            lazyLoad: true
        },
        dateArray: [],
        dateIndex: [],
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
    onLoad: function() {
        wx.getStorage({
            key: 'todayData',
            success(res) {
                // console.log(res.data)
            }
        });
        //时间下拉框
        this.setDateArray();
        //图表初始化
        this.echartsComponment = this.selectComponent('#mychart-dom-line');
        //数据初始化
        this.categoryChangeIconFun(11);
    },
    onReady: function() {},
    onShow() {},
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
        const that = this,
            dateArray = this.data.dateArray,
            dateIndex = [e.detail.value[0], e.detail.value[1]],
            date = dateArray[0][dateIndex[0]] + '-' + dateArray[1][dateIndex[1]].split('月')[0];
        this.setData({
            dateIndex: dateIndex
        })

        wx.request({
            url: '',
            data: {
                date: date
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success(res) {
                // success
            },
            fail(res) {
                console.log(res)
            },
            complete(res) {
                //假设的数据
                const month = dateArray[1][dateIndex[1]].split('月')[0];
                that.categoryChangeIconFun(month)
            }
        })
    },
    categoryChangeIconFun: function(val) {

        //重新加载数据
        const dataList = `dataList${val}`;
        this.setData({
            dataList: this.data[dataList]
        });

        if (!this.data.chart) {
            this.init_charts();
        } else {
            this.set_option(this.data.chart);
        }
        let num = this.data.dataList.reduce((sum, { value }) => {
            return sum + value;
        }, 0)
        this.changeTheShowMoney(num);
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
    //图表配置
    get_option: function(dataList) {
        let option = {
            color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
            series: [{
                label: {
                    normal: {
                        fontSize: 14,
                        position: 'inner'
                    }
                },
                selectedMode: 'single',
                type: 'pie',
                radius: [0, '60%'],
                center: ['50%', '50%'],
                data: dataList,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.3)'
                    }
                }
            }]
        };
        return option
    }
})