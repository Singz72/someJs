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
        dataList: [], //月消费情况
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
    },
    dealDataForchart(data) {
        let totalData,
            foodData = 0,
            travelData = 0,
            recreationData = 0,
            otherData = 0,
            foodPer,
            travelPer,
            recreationPer,
            otherPer,
            income = 0,
            i = 0,
            l = data.length;
        for (; i < l; i++) {
            foodData += data[i].food.value;
            travelData += data[i].travel.value;
            recreationData += data[i].recreation.value;
            otherData += data[i].other.value;
            income += data[i].income.value;
        }
        foodData = Math.round(foodData * 100) / 100;
        travelData = Math.round(travelData * 100) / 100;
        recreationData = Math.round(recreationData * 100) / 100;
        otherData = Math.round(otherData * 100) / 100;
        income = Math.round(income * 100) / 100;
        totalData = foodData + travelData + recreationData + otherData;
        foodPer = Math.round(foodData / totalData * 10000) / 100 + "%";
        travelPer = Math.round(travelData / totalData * 10000) / 100 + "%";
        recreationPer = Math.round(recreationData / totalData * 10000) / 100 + "%";
        otherPer = Math.round(otherData / totalData * 10000) / 100 + "%";
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
            [`food.count`]: -foodData,
            [`travel.count`]: -travelData,
            [`recreation.count`]: -recreationData,
            [`other.count`]: -otherData,
            [`income.count`]: income,
            [`food.percentage`]: foodPer,
            [`travel.percentage`]: travelPer,
            [`recreation.percentage`]: recreationPer,
            [`other.percentage`]: otherPer
        });
    },
    refreshData(year, month) {
        //数据重载
        this.accountRequest(year, month, (arg) => {
            let dealDataForchart = this.dealDataForchart;
            let refreshPage = this.refreshPage;
            wx.setStorage({
                key: arg.date,
                data: arg.data,
                success(res) {
                    // success
                    if (res.errMsg === "setStorage:ok") {
                        dealDataForchart(arg.data);
                        refreshPage();
                    }
                }
            })
        });
    },
    refreshPage() {
        //UI渲染
        this.init_charts();
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