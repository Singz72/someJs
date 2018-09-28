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
    //总额随着输入框数值变化
    onGetEditListNum: function(e) {
        // 原因见组件
        // var that = this;
        // var num;
        // if (e.detail.val == 0) {
        //     num = that.data.countNum;
        // } else {
        //     num = that.data.countNum + e.detail.val;
        // }
        // var count = (num).toFixed(2);
        // this.setData({
        //     count: count
        // })
    },
    onGetEditListstateNum: function(e) {
        var that = this;
        var num = e.detail.val + that.data.countNum;
        this.setData({
            countNum: num
        });
        var count = (num).toFixed(2);
        this.setData({
            count: count
        })
    }
})