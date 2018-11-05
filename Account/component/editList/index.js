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
        },
        'value': {
            type: Number, //必填，目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: 0 //可选，默认值，如果页面没传值过来就会使用默认值 
        }
    },
    data: {
        right: "../../img/UI/icon/right.png"
    },
    methods: {
        numToFixed(e) {
            var myBlurEditListValDetail = {
                val: e.detail.value - 1 + 1,
                title: this.data.title
            }
            this.triggerEvent('myBlurEditListVal', myBlurEditListValDetail);
        }
    }
})