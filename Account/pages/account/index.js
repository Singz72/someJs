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
        dataList: [], //当月消费明细
        dateArray: [],
        dateIndex: [],
        lastCount: '',
        nowLastPer: '', //当月目前消费减去上月消费后的占上月消费总额的比例
        lastCountTitle: '相比上月支出',
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
        for (let j = 2017; j < 2019; j++) {
            yearArr.push(j)
        }

        this.setData({
            dateArray: [yearArr, monthArr],
            dateIndex: [nowYear - 2017, nowMonth]
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
    },
    numTotalCount(data) {
        let obj = {},
            arr = ['food', 'travel', 'recreation', 'other', 'income'],
            i = 0,
            l = data.length,
            k = arr.length,
            num100 = 100;
        for (; i < l; i++) {
            for (let j = 0; j < k; j++) {
                let str = arr[j],
                    strs = `${str}Data`;
                if (!obj[strs]) {
                    obj[strs] = 0;
                }
                obj[strs] += Math.round(data[i][str].value * num100) / num100;
            }
        }
        obj.totalData = obj.foodData + obj.travelData + obj.recreationData + obj.otherData;

        return obj
    },
    dealDataForchart(data) {
        let foodPer,
            travelPer,
            recreationPer,
            otherPer;

        const {
            foodData,
            travelData,
            recreationData,
            otherData,
            incomeData,
            totalData
        } = this.numTotalCount(data),
            num100 = 100,
            num10000 = 10000;

        this.setData({
            count: totalData.toFixed(2),
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
            // percentage
            [`food.count`]: -Math.round(foodData * num100) / num100,
            [`travel.count`]: -Math.round(travelData * num100) / num100,
            [`recreation.count`]: -Math.round(recreationData * num100) / num100,
            [`other.count`]: -Math.round(otherData * num100) / num100,
            [`income.count`]: Math.round(incomeData * num100) / num100,
            [`food.percentage`]: Math.round(foodData / totalData * num10000) / num100 + "%",
            [`travel.percentage`]: Math.round(travelData / totalData * num10000) / num100 + "%",
            [`recreation.percentage`]: Math.round(recreationData / totalData * num10000) / num100 + "%",
            [`other.percentage`]: Math.round(otherData / totalData * num10000) / num100 + "%"
        });
    },
    refreshData(year, month) {
        let accountRequest = this.accountRequest;
        let dealDataForchart = this.dealDataForchart;
        let dealLastMonthDetail = this.dealLastMonthDetail;
        let refreshPage = this.refreshPage;
        wx.getStorage({
                key: `${year}-${month}`,
                success(res) {
                    if (res.errMsg === "getStorage:ok") {
                        dealDataForchart(res.data);
                        dealLastMonthDetail(year, month);
                        refreshPage();
                    }
                },
                fail(res) {
                    if (res.errMsg === "getStorage:fail data not found") {
                        accountRequest(year, month, (arg) => {
                            wx.setStorage({
                                key: arg.date,
                                data: arg.data,
                                success(res) {
                                    // success
                                    if (res.errMsg === "setStorage:ok") {
                                        dealDataForchart(arg.data);
                                        dealLastMonthDetail(year, month);
                                        refreshPage();
                                    }
                                }
                            })
                        });
                    }
                }
            })
            //数据重载
    },
    refreshPage() {
        //UI渲染
        this.init_charts();
    },
    //保存上月消费情况
    dealLastMonthDetail(year, month) {
        let setNowLastPer = this.setNowLastPer,
            accountRequest = this.accountRequest;
        wx.getStorage({
            key: `${year}-${month-1}`,
            success(res) {
                if (res.errMsg === "getStorage:ok") {
                    setNowLastPer(res.data);
                }
            },
            fail(res) {
                if (res.errMsg === "getStorage:fail data not found") {
                    accountRequest(year, month - 1, (arg) => {
                        wx.setStorage({
                            key: arg.date,
                            data: arg.data,
                            success(res) {
                                // success
                                if (res.errMsg === "setStorage:ok") {
                                    setNowLastPer(arg.data);
                                }
                            }
                        })
                    });
                }
            }
        })
    },
    setNowLastPer(data) {
        const {
            totalData
        } = this.numTotalCount(data),
            count = this.data.count;
        this.setData({
            lastCount: totalData,
            nowLastPer: Math.round((count - totalData) / totalData * 10000) / 100 + "%"
        })
    },
    init_charts: function() {
        //图表初始化
        this.selectComponent('#mychart-dom-line').init((canvas, width, height) => {
            let echart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            echart.setOption(this.get_option(this.data.dataListForEcharts));
            return echart;
        })
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
    },
    //请求-包装
    accountRequest(year, month, successFun, failFun, completeFun) {
        wx.request({
            url: `https://www.singz72.com/account/json/${year}/${year}-${(month+'').length<2?'0'+month:month}.json`,
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
})