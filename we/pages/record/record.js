//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        name: ''
    },
    onLoad: function() {
        this.setData({
            name: '记录今日的各种消费'
        })
    }
})