//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        date: '2018-09-20',
        count: '437.00',
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
    onGetEditListNum: function(e) {
        var that = this;
        var num;
        if (e.detail.title == that.data.countTitle) {
            num = e.detail.val;
        } else {
            debugger
            this.setData({
                countTitle: e.detail.title
            })
            num = that.data.countNum + e.detail.val;
        }
        var count = (num).toFixed(2);
        console.log(num)
        console.log(count)
        this.setData({
            countNum: num,
            count: count
        })
    }
})