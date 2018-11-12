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
                value: 30.355,
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
            percentage: "100%",
            count: "-12.00",
            iconPath: "../../img/UI/icon/a_food_active.png"
        },
        travel: {
            title: "出行",
            percentage: "100%",
            count: "-8.23",
            iconPath: "../../img/UI/icon/a_car_active.png"
        },
        recreation: {
            title: "娱乐",
            percentage: "100%",
            count: "-453.45",
            iconPath: "../../img/UI/icon/a_shopping_active.png"
        },
        other: {
            title: "一般",
            percentage: "100%",
            count: "-50.00",
            iconPath: "../../img/UI/icon/a_shopping_active.png"
        },
        income: {
            title: "收入",
            percentage: "100%",
            count: "4453.45",
            iconPath: "../../img/UI/icon/a_shopping_active.png"
        },
        categoryState: '',
        categoryDis: false,
        detailState: 'tab_selected',
        detailDis: true
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
    },
    onReady() {
        //数据初始化
        if (this.data.categoryDis) {
            const month = (new Date()).getMonth() + 1;
            this.categoryChangeIconFun(month);
        }
    },
    onShow() {},
    categoryClickFun() {
        this.setData({
            categoryState: 'tab_selected',
            categoryDis: true,
            detailState: '',
            detailDis: false
        });
        const month = this.data.dateArray[1][this.data.dateIndex[1]];
        this.categoryChangeIconFun(month);
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
            date = dateArray[0][dateIndex[0]] + '-' + dateArray[1][dateIndex[1]];
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
                const month = dateArray[1][dateIndex[1]];
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