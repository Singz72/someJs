Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     * 用于组件自定义设置
     */
    properties: {
        'startTime': {
            type: String,
            value: ""
        }
    },
    data: {
        date: '2018-09-20',
    },
    methods: {
        loadChangeDate: function() {
            var nowDate = this.dateFormat(new Date());
            console.log(nowDate)
            this.setData({
                date: nowDate
            })
        },
        selectDateChangeDisplay: function(e) {
            this.setData({
                date: e.detail.value
            })
        },
        //返回'2018-08-08'格式
        dateFormat: function(T) {
            var t = new Date(T)
            var s = '';
            s += t.getFullYear() + '-'; // 获取年份。
            s += (t.getMonth() + 1) > 9 ? (t.getMonth() + 1) + "-" : '0' + (t.getMonth() + 1) + "-"; // 获取月份。
            s += t.getDate() > 9 ? t.getDate() : '0' + t.getDate(); // 获取日。
            return (s); // 返回日期。
        },
    }
})