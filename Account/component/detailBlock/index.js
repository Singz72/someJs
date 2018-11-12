Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     * 用于组件自定义设置
     */
    properties: {
        '_date': {
            type: String, //必填，目前接受的类型包括：String,Number,Boolean, Object, Array, null（表示任意类型）
            value: "12日-星期一" //可选，默认值，如果页面没传值过来就会使用默认值 
        },
        '_pay': {
            type: String, //必填，目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: "0:00" //可选，默认值，如果页面没传值过来就会使用默认值 
        },
        '_income': {
            type: String,
            value: "0:00"
        },
        '_food': {
            type: String,
            value: ""
        },
        '_travel': {
            type: String,
            value: ""
        },
        '_recreation': {
            type: String,
            value: ""
        },
        '_other': {
            type: String,
            value: ""
        },
    },
    data: {
        food: {
            title: "饮食快上飞机就看到",
            iconPath: "../../img/UI/icon/a_food_active.png"
        },
        travel: {
            title: "出行赶快给机体健康的",
            iconPath: "../../img/UI/icon/a_car_active.png"
        },
        recreation: {
            title: "娱乐看 i 人就开始大哭",
            iconPath: "../../img/UI/icon/a_shopping_active.png"
        },
        other: {
            title: "一般收到了恐惧感 i",
            iconPath: "../../img/UI/icon/a_shopping_active.png"
        },
    },
    methods: {

    }
})