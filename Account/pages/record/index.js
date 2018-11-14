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
        }
    },
    onReady: function() {
        this.selectComponent('#timeHaveIcon').loadChangeDate();
        this.setDefaultDate();
    },
    setDefaultDate() {
        let that = this,
            nowDate = new Date(),
            nowYear = nowDate.getFullYear(),
            nowMonth = (nowDate.getMonth() + 1) + '',
            nowDay = nowDate.getDate() + '',
            today = nowYear + '-' + (nowMonth.length < 2 ? '0' + nowMonth : nowMonth) + '-' + (nowDay.length < 2 ? '0' + nowDay : nowDay);

        wx.getStorage({
            key: 'todayData',
            success: function(res) {
                // success
                console.log(res)
                const resData = res.data;
                if (resData.time == today) {
                    const detail = resData.detail,
                        foodCount = `food.count`,
                        foodMarks = `food.marks`,
                        travelCount = `travel.count`,
                        travelMarks = `food.marks`,
                        recreationCount = `recreation.count`,
                        recreationMarks = `food.marks`,
                        otherCount = `other.count`,
                        otherMarks = `food.marks`;
                    that.setData({
                        [foodCount]: detail.food.count,
                        [foodMarks]: detail.food.marks,
                        [travelCount]: detail.travel.count,
                        [travelMarks]: detail.travel.marks,
                        [recreationCount]: detail.recreation.count,
                        [recreationMarks]: detail.recreation.marks,
                        [otherCount]: detail.other.count,
                        [otherMarks]: detail.other.marks,
                    });

                    console.log(this.data)
                }
            }
        })
    },
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        })
    },
    onGetEditListstateNum: function(e) {
        let val = e.detail;
        console.log(val)
            //赋值
    },
    submitForm() {
        let data = this.data,
            obj = {
                time: data.date,
                detail: {
                    food: {
                        count: data.food.count,
                        marks: data.food.marks
                    },
                    travel: {
                        count: data.travel.count,
                        marks: data.travel.marks
                    },
                    recreation: {
                        count: data.recreation.count,
                        marks: data.travel.marks
                    },
                    other: {
                        count: data.other.count,
                        marks: data.travel.marks
                    }
                }
            };
        wx.setStorage({
            key: 'todayData',
            data: obj
        })
        wx.request({
            url: '',
            data: obj,
            success() {
                console.log(ok)
            }
        })
    }
})