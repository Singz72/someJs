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
        gameTitle: 'Gmae',
        gameIcon: '../../img/UI/icon/trophy.png',
        otherTitle: 'Other',
        otherIcon: '../../img/UI/icon/read.png',
        food: {
            title: 'Food',
            icon: '../../img/UI/icon/meh.png',
            count: ''
        },
        travel: {
            title: 'Travel',
            icon: '../../img/UI/icon/car.png',
            count: ''
        },
        game: {
            title: 'Game',
            icon: '../../img/UI/icon/trophy.png',
            count: ''
        },
        other: {
            title: 'Other',
            icon: '../../img/UI/icon/read.png',
            count: ''
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
                const resData = res.data;
                if (resData.time == today) {
                    const count = resData.count,
                        food = `food.count`,
                        travel = `travel.count`,
                        game = `game.count`,
                        other = `other.count`;
                    that.setData({
                        [food]: count.food,
                        [travel]: count.travel,
                        [game]: count.game,
                        [other]: count.other,
                    });
                    that.setCount();
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
        let val = e.detail.val,
            title = e.detail.title.toLowerCase(),
            key = `${title}.count`,
            sum, data;
        this.setData({
            [key]: val
        });
        this.setCount();
    },
    setCount() {
        let data = this.data,
            sum = data.food.count +
            data.travel.count +
            data.game.count +
            data.other.count;

        this.setData({
            countNum: sum,
            count: sum + ''
        })
    },
    submitForm() {
        let data = this.data,
            obj = {
                time: data.date,
                count: {
                    food: data.food.count,
                    travel: data.travel.count,
                    game: data.game.count,
                    other: data.other.count
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