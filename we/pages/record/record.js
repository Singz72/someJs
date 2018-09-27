//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        date: '2018-09-20',
        count: '437.00',
        foodTitle: 'Food',
        foodIcon: '../../img/UI/icon/meh.png',
        drinkTitle: 'Drink',
        drinkIcon: '../../img/UI/icon/rest.png'
    },
    onLoad: function() {

    },
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        })
    }
})