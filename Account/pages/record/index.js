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
            count: 0
        },
        travel: {
            title: 'Travel',
            icon: '../../img/UI/icon/car.png',
            count: 0
        },
        game: {
            title: 'Game',
            icon: '../../img/UI/icon/trophy.png',
            count: 0
        },
        other: {
            title: 'Other',
            icon: '../../img/UI/icon/read.png',
            count: 0
        }
    },
    onReady: function() {
        this.selectComponent('#timeHaveIcon').loadChangeDate();
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
        data = this.data;
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
        console.log(obj)
        wx.request({
            url: '',
            data: obj,
            success() {
                console.log(ok)
            }
        })
    }
})