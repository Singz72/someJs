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
        drinkTitle: 'Drink',
        drinkIcon: '../../img/UI/icon/rest.png',
        travelTitle: 'Travel',
        travelIcon: '../../img/UI/icon/car.png',
        gameTitle: 'Gmae',
        gameIcon: '../../img/UI/icon/trophy.png',
        wearTitle: 'Wear',
        wearIcon: '../../img/UI/icon/shopping.png',
        otherTitle: 'Other',
        otherIcon: '../../img/UI/icon/read.png'
    },
    onLoad: function() {

    },
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        })
    },
    onGetEditListstateNum: function(e) {
        var that = this;
        var nowVal = e.detail.val,
            oldVal = e.detail.oldVal;
        if (nowVal !== oldVal) {
            var num = nowVal + that.data.countNum;
            var count = (num).toFixed(0);
            this.setData({
                count: count,
                countNum: num
            })
        } else {
            // console.log('未改变值')
        }
    }
})