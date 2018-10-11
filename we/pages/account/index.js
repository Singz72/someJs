//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        count: '100.00'
    },
    onReady: function() {
        this.selectComponent('#timeHaveIcon').loadChangeDate();
    }
})