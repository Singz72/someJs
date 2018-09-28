Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     * 用于组件自定义设置
     */
    properties: {
        'iconPath': {
            type: String, //必填，目前接受的类型包括：String,Number,Boolean, Object, Array, null（表示任意类型）
            value: "" //可选，默认值，如果页面没传值过来就会使用默认值 
        },
        'title': {
            type: String, //必填，目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: "" //可选，默认值，如果页面没传值过来就会使用默认值 
        }
    },
    data: {
        value: "",
        num: 0,
        right: "../../img/UI/icon/right.png"
    },
    methods: {
        numToFixed(e) {
            var num = e.detail.value - 1 + 1;
            if (num) {
                this.setData({
                    value: num.toFixed(2)
                })
            }
        },
        changeNum(e) {
            var that = this;
            //判断是否有输入值
            var val = e.detail.value ? e.detail.value : that.data.num;
            val = val - 1 + 1;
            this.setData({
                num: val
            })
            var myEditListEventDetail = {
                val: val,
                title: that.data.title
            }
            this.triggerEvent('myEditListEvent', myEditListEventDetail);
        }
    }
})