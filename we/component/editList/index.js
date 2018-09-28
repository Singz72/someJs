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
        // oldVal: 0,
        right: "../../img/UI/icon/right.png"
    },
    methods: {
        numToFixed(e) {
            var that = this;
            var num = e.detail.value - 1 + 1;
            if (num) {
                // var oldVal = that.data.oldVal;
                var myBlurEditListValDetail = {
                    val: num
                }
                this.setData({
                    value: num.toFixed(2)
                        // oldVal: num
                });
                this.triggerEvent('myBlurEditListVal', myBlurEditListValDetail);
            }
        },
        changeNum(e) {
            var that = this;
            //判断是否有输入值
            //
            //暂时关闭
            //该功能主要用于
            //当在输入框中键入数字时，会自动计算出总额
            //但是目前遇到的情况是
            //无法正确计算每个组件键入值的总额
            //主要原因还是在每次输入值的时候就在计算总额了
            //增加了一些无关紧要的值
            //比如当我准备输入123
            //总额就被计算称为1+12+123
            //当我在其他输入框中输入值
            //总额也将改变
            //
            // var val = e.detail.value ? e.detail.value : 0;
            // val = val - 1 + 1;
            // var myEditListEventDetail = {
            //     val: val,
            //     title: that.data.title
            // }
            // this.triggerEvent('myEditListEvent', myEditListEventDetail);
        }
    }
})