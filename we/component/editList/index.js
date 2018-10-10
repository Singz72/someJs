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
        oldVal: 0,
        right: "../../img/UI/icon/right.png"
    },
    methods: {
        numToFixed(e) {
            var that = this;
            var num = e.detail.value - 1 + 1;

            //当删除完数字传入0时
            //应当判断一下
            // if (num) {
            // var oldVal = that.data.oldVal;
            var myBlurEditListValDetail = {
                val: num - that.data.oldVal,
                oldVal: that.data.oldVal
            }
            this.setData({
                value: num.toFixed(0),
                oldVal: num
            });
            this.triggerEvent('myBlurEditListVal', myBlurEditListValDetail);
            // }
        }
    }
})