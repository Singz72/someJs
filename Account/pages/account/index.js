//index.js
//获取应用实例
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

Page({
    data: {
        ec: {
            lazyLoad: true
        },
        count: '', //消费总额
        title: '消费总额',
        dataListForEcharts: [],
        dataList: [],
        dateArray: [],
        dateIndex: [],
        food: {
            title: "饮食",
            percentage: "100%",
            count: 0,
            iconPath: "../../img/UI/icon/a_food_active.png"
        },
        travel: {
            title: "出行",
            percentage: "100%",
            count: 0,
            iconPath: "../../img/UI/icon/a_car_active.png"
        },
        recreation: {
            title: "娱乐",
            percentage: "100%",
            count: 0,
            iconPath: "../../img/UI/icon/a_shopping_active.png"
        },
        other: {
            title: "一般",
            percentage: "100%",
            count: 0,
            iconPath: "../../img/UI/icon/a_shopping_active.png"
        },
        income: {
            title: "收入",
            percentage: "",
            count: 0,
            iconPath: "../../img/UI/icon/a_shopping_active.png"
        },
        categoryState: 'tab_selected',
        categoryDis: true,
        detailState: '',
        detailDis: false,
        detailCount: true,
        detailNoCount: false
    },
    onLoad: function() {
        //时间下拉框
        this.setDateArray();
        wx.getStorage({
            key: 'todayData',
            success(res) {
                // console.log(res.data)
            }
        });
    },
    onReady() {
        this.refreshData((new Date()).getFullYear(), (new Date()).getMonth() + 1);
    },
    onShow() {
        this.refreshPage();
    },
    categoryClickFun() {
        this.setData({
            categoryState: 'tab_selected',
            categoryDis: true,
            detailState: '',
            detailDis: false
        });
        this.refreshPage();
    },
    detailClickFun() {
        this.setData({
            categoryState: '',
            categoryDis: false,
            detailState: 'tab_selected',
            detailDis: true
        })
    },
    setDateArray() {
        let monthArr = [],
            yearArr = [],
            nowDate = new Date(),
            nowYear = nowDate.getFullYear(),
            nowMonth = nowDate.getMonth();
        for (let i = 0; i < 12; i++) {
            monthArr.push((i + 1));
        }
        for (let j = 1989; j < 2099; j++) {
            yearArr.push(j)
        }

        this.setData({
            dateArray: [yearArr, monthArr],
            dateIndex: [nowYear - 1989, nowMonth]
        })
    },
    //选择时间后调用函数
    bindPickerDateChange(e) {
        const that = this,
            dateArray = this.data.dateArray,
            dateIndex = [e.detail.value[0], e.detail.value[1]];
        this.setData({
            dateIndex: dateIndex
        })

        this.refreshData(dateArray[0][dateIndex[0]], dateArray[1][dateIndex[1]]);
        this.refreshPage();

    },
    dealDataForchart(data) {
        let foodData = 0,
            travelData = 0,
            recreationData = 0,
            otherData = 0,
            income = 0,
            incomeCount = `income.count`,
            i = 0,
            l = data.length;
        for (; i < l; i++) {
            foodData += data[i].food.value;
            travelData += data[i].travel.value;
            recreationData += data[i].recreation.value;
            otherData += data[i].other.value;
            income += data[i].income.value;
        }
        foodData = foodData.toFixed(2);
        travelData = travelData.toFixed(2);
        recreationData = recreationData.toFixed(2);
        otherData = otherData.toFixed(2);
        income = income.toFixed(2);
        this.setData({
            dataList: data,
            dataListForEcharts: [{
                    value: foodData,
                    name: '饮食'
                },
                {
                    value: travelData,
                    name: '出行'
                },
                {
                    value: recreationData,
                    name: '娱乐'
                },
                {
                    value: otherData,
                    name: '一般'
                }
            ],
            [`food.count`]: -foodData,
            [`travel.count`]: -travelData,
            [`recreation.count`]: -recreationData,
            [`other.count`]: -otherData,
            [`income.count`]: income
        })
        console.log(this.data);
    },
    refreshData(year, month) {
        //数据重载
        this.accountRequest(year, month, (arg) => {
            let dealDataForchart = this.dealDataForchart;
            wx.setStorage({
                key: arg.date,
                data: arg.data,
                success(res) {
                    // success
                    if (res.errMsg === "setStorage:ok") {
                        console.log(arg)
                        dealDataForchart(arg.data);
                    }
                }
            })
        });
    },
    refreshPage() {
        //UI渲染
        if (!this.data.chart) {
            this.init_charts();
        } else {
            this.set_option(this.data.chart);
        }
        let num = this.data.dataList.reduce((sum, {
            value
        }) => {
            return sum + value;
        }, 0)
        this.changeTheShowMoney(num);
    },
    accountRequest(year, month, successFun, failFun, completeFun) {
        wx.request({
            url: `https://www.singz72.com/account/json/${year}/${year}-${month.length<2?'0'+month:month}.json`,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success(res) {
                // success
                if (successFun) {
                    if (typeof res.data === String) {
                        successFun(JSON.parse(res.data));
                    } else {
                        successFun(res.data);
                    }
                }
            },
            fail(res) {
                if (failFun) {
                    failFun(res);
                }
            },
            complete(res) {
                if (completeFun) {
                    completeFun(res);
                }
            }
        })
    },
    //改变显示的金钱数
    changeTheShowMoney: function(num) {
        let strNum = num.toFixed(2) + '';
        this.setData({
            count: strNum
        })
        return strNum;
    },
    init_charts: function() {
        const that = this;
        //图表初始化
        this.selectComponent('#mychart-dom-line').init((canvas, width, height) => {
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
            color: ["#f7994e", "#f7d151", "#f7994e", "#f7d151", "#f7994e", "#f7d151"],
            series: [{
                label: {
                    normal: {
                        fontSize: 14,
                        position: 'inner'
                    }
                },
                selectedMode: 'single',
                type: 'pie',
                radius: [0, '80%'],
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