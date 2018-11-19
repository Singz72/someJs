//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        date: '2018-09-20',
        count: '00.00',
        countNum: 0,
        foodTitle: 'Food',
        foodIcon: '../../img/UI/icon/meh.png',
        travelTitle: 'Travel',
        travelIcon: '../../img/UI/icon/car.png',
        recreationTitle: 'recreation',
        recreationIcon: '../../img/UI/icon/trophy.png',
        otherTitle: 'Other',
        otherIcon: '../../img/UI/icon/read.png',
        food: {
            title: '饮食',
            idTitle: 'food',
            count: '',
            marks: ''
        },
        travel: {
            title: '出行',
            idTitle: 'travel',
            count: '',
            marks: ''
        },
        recreation: {
            title: '娱乐',
            idTitle: 'recreation',
            count: '',
            marks: ''
        },
        other: {
            title: '一般',
            idTitle: 'other',
            count: '',
            marks: ''
        },
        income: {
            title: '收入',
            idTitle: 'income',
            count: '',
            marks: ''
        },
        attr: ['food', 'travel', 'recreation', 'other', 'income']
    },
    onReady() {
        this.selectComponent('#timeHaveIcon').loadChangeDate();
        this.setDefaultData();
    },
    setDefaultData() {
        let that = this,
            nowDate = new Date(),
            nowYear = nowDate.getFullYear(),
            nowMonth = (nowDate.getMonth() + 1) + '',
            nowDay = nowDate.getDate() + '',
            today = nowYear + '-' + (nowMonth.length < 2 ? '0' + nowMonth : nowMonth) + '-' + (nowDay.length < 2 ? '0' + nowDay : nowDay);

        //模拟请求获取初始值
        wx.getStorage({
            key: 'todayData',
            success(res) {
                // success
                const resData = res.data,
                    attr = that.data.attr;
                if (resData.time == today) {
                    const detail = resData.detail;
                    for (let i = 0, l = attr.length; i < l; i++) {
                        let type = detail[attr[i]];
                        that.saveDefaultDetail(attr[i], type.count, type.marks);
                    }
                }
            }
        })
    },
    //单个初识类型设值
    saveDefaultDetail(attr, count, marks = "无备注信息") {
        let attrCount = `${attr}.count`,
            attrMarks = `${attr}.marks`;
        this.setData({
            [attrCount]: count,
            [attrMarks]: marks
        });
    },
    bindDateChange(e) {
        this.setData({
            date: e.detail.value
        })
    },
    onGetEditListstateNum(e) {
        let val = e.detail;
        //赋值
        let attrType = `${val.idTitle}.${val.type}`;
        this.setData({
            [attrType]: val.value
        });
    },
    submitForm() {
        let data = this.data,
            obj = {
                time: data.date,
                detail: {}
            };
        const attr = this.data.attr;;
        for (let i = 0, l = attr.length; i < l; i++) {
            let { count, marks } = data[attr[i]];
            obj.detail[attr[i]] = {
                count,
                marks
            };
        }
        //模拟存储数据
        wx.setStorage({
            key: 'todayData',
            data: obj
        })

        // wx.request({
        //     url: '',
        //     data: obj,
        //     success() {
        //         console.log(ok)
        //     }
        // })
    }
})