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
            let nowDate = this.setTimeType(this.properties.startTime, this.dateFormat(new Date()));
            this.setData({
                date: nowDate
            })
        },
        setTimeType: function(startTime, value) {
            let arr = startTime.split('-'),
                l = arr.length;
            if (l == 1) {
                return value.substring(0, 4);
            } else if (l == 2) {
                return value.substring(0, 7);
            } else {
                return value;
            }
        },
        selectDateChangeDisplay: function(e) {
            let nowDate = this.setTimeType(this.properties.startTime, this.dateFormat(e.detail.value));
            this.setData({
                date: nowDate
            })
        },
        //返回'2018-08-08'格式
        dateFormat: function(T) {
            let t = new Date(T)
            let s = '';
            s += t.getFullYear() + '-'; // 获取年份。
            s += (t.getMonth() + 1) > 9 ? (t.getMonth() + 1) + "-" : '0' + (t.getMonth() + 1) + "-"; // 获取月份。
            s += t.getDate() > 9 ? t.getDate() : '0' + t.getDate(); // 获取日。
            return (s); // 返回日期。
        },
    }
})