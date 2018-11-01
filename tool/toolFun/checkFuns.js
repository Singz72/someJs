//身份证有关的函数
var idcardFuns = {
    CityArray: {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外",
        "other": "其他"
    },
    CityArray2: {
        "上海": "31",
        "云南": "53",
        "其他": "other",
        "内蒙古": "15",
        "北京": "11",
        "台湾": "71",
        "吉林": "22",
        "四川": "51",
        "国外": "91",
        "天津": "12",
        "宁夏": "64",
        "安徽": "34",
        "山东": "37",
        "山西": "14",
        "广东": "44",
        "广西": "45",
        "新疆": "65",
        "江苏": "32",
        "江西": "36",
        "河北": "13",
        "河南": "41",
        "浙江": "33",
        "海南": "46",
        "湖北": "42",
        "湖南": "43",
        "澳门": "82",
        "甘肃": "62",
        "福建": "35",
        "西藏": "54",
        "贵州": "52",
        "辽宁": "21",
        "重庆": "50",
        "陕西": "61",
        "青海": "63",
        "香港": "81",
        "黑龙江": "23"
    },

    //传入地区，返回对应的身份证头两位，例如["北京","天津"]=>[11,12]
    AddressToidCard(D) {
        var i = 0,
            l = D.length,
            data = [];
        for (; i < l; i++) {
            if (this.CityArray2[D[i]]) {
                data.push(this.CityArray2[D[i]])
            } else {
                data.push(" ")
            }

        }
        return data
    },
    //传入身份证头两位，返回对应的地区，例如[11,12]=>["北京","天津"]
    idCardToAddress(D) {
        var i = 0,
            l = D.length,
            data = [];
        for (; i < l; i++) {
            if (this.CityArray[D[i]]) {
                data.push(this.CityArray[D[i]])
            } else {
                data.push(" ")
            }
        }
        return data
    },


    //验证身份证及返回地区、出生年月、性别 
    //sId:身份证号码 
    CheckIdCard(sId) {
        if (sId.length == 15) {
            sId = sId.replace(/([\d]{6})(\d{9})/, "$119$2x");
        }
        var iSum = 0;
        var info = "";
        if (!/^\d{17}(\d|x)$/i.test(sId)) return "非法的身份证号";
        sId = sId.replace(/x$/i, "a");
        if (this.CityArray[parseInt(sId.substr(0, 2))] == null) return "Error:非法地区";
        sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
        var d = new Date(sBirthday.replace(/-/g, "/"))
        if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return "Error:非法生日";
        for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
        if (iSum % 11 != 1) return "Error:非法证号";

        var data = {
            Province: this.CityArray[parseInt(sId.substr(0, 2))],
            birthday: sBirthday,
            sex: (sId.substr(16, 1) % 2 ? "男" : "女")
        }
        return data
    }
}