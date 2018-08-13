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
    AddressToidCard: function(D) {
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
    idCardToAddress: function(D) {
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
    CheckIdCard: function(sId) {
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

//时间有关函数
var TimeFuns = {
    //获取当年整年阳历和阴历  
    _getSolarAndLunar: function() {
        /*设置农历日期*/
        var CalendarData = new Array(100);
        var madd = new Array(12);
        var numString = "一二三四五六七八九十";
        var monString = "正二三四五六七八九十冬腊";
        var cYear, cMonth, cDay, TheDate;
        // 农历每月仅仅能是29或30天，一年用12(或13)个二进制位表示，从高到低，相应位为1表示30天，否则29天
        CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD,
            0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA,
            0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95,
            0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B,
            0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95,
            0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B,
            0xA93, 0x40E95);
        madd[0] = 0;
        madd[1] = 31;
        madd[2] = 59;
        madd[3] = 90;
        madd[4] = 120;
        madd[5] = 151;
        madd[6] = 181;
        madd[7] = 212;
        madd[8] = 243;
        madd[9] = 273;
        madd[10] = 304;
        madd[11] = 334;

        function GetBit(m, n) {
            return (m >> n) & 1
        }

        function e2c() {
            TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
            var total, m, n, k;
            var isEnd = false;
            var tmp = TheDate.getYear();
            if (tmp < 1900) {
                tmp += 1900;
            }
            total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;
            if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
                total++;
            }
            for (m = 0;; m++) {
                k = (CalendarData[m] < 0xfff) ? 11 : 12;
                for (n = k; n >= 0; n--) {
                    if (total <= 29 + GetBit(CalendarData[m], n)) {
                        isEnd = true;
                        break;
                    }
                    total = total - 29 - GetBit(CalendarData[m], n);
                }
                if (isEnd) break;
            }
            cYear = 1921 + m;
            cMonth = k - n + 1;
            cDay = total;
            if (k == 12) {
                if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
                    cMonth = 1 - cMonth;
                }
                if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
                    cMonth--;
                }
            }
        }

        function GetcDateString() {
            var tmp = "";
            var tmpm = "";
            //获取农历月份 ↓
            if (cMonth < 1) {
                tmpm += "(闰)";
                tmpm += monString.charAt(-cMonth - 1);
            } else {
                tmpm += monString.charAt(cMonth - 1);
            }
            tmpm += "月";
            tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay == 20) ? "二十" : (cDay < 30) ? "廿" : "三十"));
            if (cDay % 10 != 0 || cDay == 10) {
                tmp += numString.charAt((cDay - 1) % 10);
            }
            if (tmp == '初一') tmp = tmpm;
            return tmp;
        }

        function GetLunarDay(solarYear, solarMonth, solarDay) {
            //solarYear = solarYear<1900?(1900+solarYear):solarYear;
            if (solarYear < 1921 || solarYear > 2020) {
                return "";
            } else {
                solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
                e2c(solarYear, solarMonth, solarDay);
                return GetcDateString();
            }
        }

        function getDate(datestr) {
            //转换为国际标准时间
            var temp = datestr.split("-");
            var date = new Date(temp[0], temp[1] - 1, temp[2]);
            return date;
        }

        var date = new Date();
        var year = date.getFullYear();
        var startDate = getDate(year + "-01-01"); //当年起始时间
        var endDate = getDate(year + "-12-31"); //当年结束时间
        var dateArray = [];
        while (endDate >= startDate) {
            var m = startDate.getMonth().toString().length == 1 ? "0" + (startDate.getMonth() + 1).toString() : startDate.getMonth() + 1;
            var d = startDate.getDate().toString().length == 1 ? "0" + startDate.getDate().toString() : startDate.getDate();
            if (year < 100) year = "19" + year;
            dateArray.push([year + "-" + m + "-" + d, GetLunarDay(year, m, d)]);
            startDate.setDate(startDate.getDate() + 1);
        }
        return dateArray;
    },
    //获取参数月首尾时间点
    _getSectionOfDate: function(year, mouth) {
        var date = new Date();
        var y, m;
        y = year || date.getFullYear();
        m = mouth || date.getMonth() + 1;
        var d = new Date(y, m, 0);
        var d_num = d.getDate() //当月所有天数

        var t_start = y + "-" + m + "-" + "01" + " " + "00:00:00"
        var t_end = y + "-" + m + "-" + d_num + " " + "23:59:59"

        return {
            t_start: t_start,
            t_end: t_end
        }
    },
    //传入时间，返回'xxxx-xx-xx'格式
    _format: function(T) {
        var t = T ? new Date(T) : this;
        var s = '';
        s += t.getFullYear() + '-'; // 获取年份。
        s += (t.getMonth() + 1) > 9 ? (t.getMonth() + 1) : '0' + (t.getMonth() + 1) + "-"; // 获取月份。
        s += t.getDate() > 9 ? t.getDate() : '0' + t.getDate(); // 获取日。
        return (s); // 返回日期。
    },
    //获取时间区间内所有的月份 参数格式: '2018-05-23'
    _getMonthsAll: function(begin, end) {
        var d1 = begin;
        var d2 = end;
        var dateArry = new Array();
        var s1 = d1.split("-");
        var s2 = d2.split("-");
        var mCount = 0;
        if (parseInt(s1[0]) < parseInt(s2[0])) {
            mCount = (parseInt(s2[0]) - parseInt(s1[0])) * 12 + parseInt(s2[1]) - parseInt(s1[1]) + 1;
        } else {
            mCount = parseInt(s2[1]) - parseInt(s1[1]) + 1;
        }
        if (mCount > 0) {
            var startM = parseInt(s1[1]);
            var startY = parseInt(s1[0]);
            for (var i = 0; i < mCount; i++) {
                if (startM < 12) {
                    dateArry[i] = startY + "-" + (startM > 9 ? startM : "0" + startM);
                    startM += 1;
                } else {
                    dateArry[i] = startY + "-" + (startM > 9 ? startM : "0" + startM);
                    startM = 1;
                    startY += 1;
                }
            }
        }
        return dateArry;
    },
    //获取时间区间内所有的天数 参数格式: '2018-05-23'
    _getDaysAll: function(begin, end) {
        Date.prototype.format = this._format;

        begin = new Date(begin).format();
        end = new Date(end).format();

        var dateAllArr = new Array();
        var ab = begin.split("-");
        var ae = end.split("-");
        var db = new Date();
        db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
        var de = new Date();
        de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
        var unixDb = db.getTime();
        var unixDe = de.getTime();
        for (var k = unixDb; k <= unixDe;) {
            dateAllArr.push((new Date(parseInt(k))).format().toString());
            k = k + 24 * 60 * 60 * 1000;
        }
        return dateAllArr;
    },
    //返回时间所在年份的所有周数
    //obj:为true则返回对象格式
    //当年初始几天如果不是完整一周，则会把去年末尾几天归入当年第一周
    _getWeeksAll: function() {
        var year = arg.getFullYear();
        //获取year这年所有的周
        var d = new Date(year, 0, 1);
        while (d.getDay() != 1) {
            d.setDate(d.getDate() - 1);
        }
        var to = new Date(year + 1, 0, 1);
        var D = [];
        for (var from = d; from < to;) {
            var str1 = '';
            var str2 = '';
            str1 = str1 + from.getFullYear() + "-" + ((from.getMonth() + 1) <= 9 ? ('0' + (from.getMonth() + 1)) : (from.getMonth() + 1)) + "-" + (from.getDate() <= 9 ? ('0' + from.getDate()) : from.getDate());
            from.setDate(from.getDate() + 6);
            if (from < to) {
                str2 = str2 + from.getFullYear() + "-" + ((from.getMonth() + 1) <= 9 ? ('0' + (from.getMonth() + 1)) : (from.getMonth() + 1)) + "-" + (from.getDate() <= 9 ? ('0' + from.getDate()) : from.getDate());
                from.setDate(from.getDate() + 1);
            } else {
                str2 = str2 + from.getFullYear() + "-" + ((from.getMonth() + 1) <= 9 ? ('0' + (from.getMonth() + 1)) : (from.getMonth() + 1)) + "-" + (from.getDate() <= 9 ? ('0' + from.getDate()) : from.getDate());
            }
            D.push([str1, str2]);
        }
        if (obj) {
            var oi = 0,
                ol = D.length,
                Do = [];
            for (; oi < ol; oi++) {

                Do.push({
                    name: oi + 1,
                    value: D[oi]
                });
            }
            return Do
        }
        return D
    },
    //根据时间获取该时间在当年所在的第几周
    //arg:时间
    _getPointNumForWeek: function(arg) {
        var that = this;
        var D = that.getAllWeeks(new Date(arg)); //week array
        var d1 = new Date(arg);
        var d2 = new Date(D[0][1]);
        var rq = d1 - d2;
        var s1 = Math.ceil(rq / (24 * 60 * 60 * 1000));
        var s2 = Math.ceil(s1 / 7) + 1;
        return s2
    },
    //根据当年第几周获取所在的时间段
    //arg:数字
    //T:年份
    _getPointWeekForNum: function(arg, T) {
        var that = this;
        var D = that.getAllWeeks(new Date(T)); //week array
        return D[arg - 1]
    },
    //计算倒推的时间，按小时算，返回倒退后的时间和当前时间
    timeBack: function(n, settime) {
        //n:倒退的小时数0-24
        if (n < 0 || n > 24) {
            alert('反推时间必须在0至24小时以内')
            return
        }
        var startTime = ""; //倒推的时间
        var endTime = ""; //当前时间字符串

        if (settime) {
            var now = new Date(settime);
            var now_y = now.getFullYear(), //指定时间年 
                now_m = now.getMonth() + 1, //指定时间月
                now_d = now.getDate(), //指定时间日
                now_hour = now.getHours(), //指定时间时
                now_min = now.getMinutes(), //指定时间分
                now_sec = now.getSeconds(); //指定时间秒
        } else {
            var now = new Date();
            var now_y = now.getFullYear(), //当前年 
                now_m = now.getMonth() + 1, //当前月
                now_d = now.getDate(), //当前日
                now_hour = now.getHours(), //当前时
                now_min = now.getMinutes(), //当前分
                now_sec = now.getSeconds(); //当前秒
        }

        endTime = now_y + '-' + now_m + '-' + now_d + ' ' + now_hour + ':' + now_min + ':' + now_sec;
        var old_y, old_m, old_d, old_hour;

        //前推n小时
        old_hour = (now_hour - n);
        //当天不够倒退
        if (old_hour < 0) {
            old_hour = 24 + old_hour; //到昨天某个时间
            old_d = now_d - 1; //天数减1
            //当月不足扣减 当天1号的时候
            if (old_d == 0) {
                //当月不足扣减，需要回到上一个月，如果本月为当年一月，则年份减一
                if (now_m == 1) {
                    //年份减一
                    //在去年操作
                    old_y = now_y - 1; //去年
                    old_m = 12; //去年12月
                    old_d = 31; //去年最后一天
                } else {
                    //在本年操作
                    //判断上个月是31还是30，是28还是29
                    //获取上月天数
                    old_y = now_y;
                    old_m = now_m - 1;
                    var temp = new Date(old_y, old_m, 0)
                    old_d = temp.getDate();
                }
            }
            //当天不是1号
            else {
                old_y = now_y;
                old_m = now_m;
            }
        }
        //当天时间够减
        else {
            old_d = now_d;
            old_y = now_y;
            old_m = now_m;
        }
        startTime = old_y + '-' + old_m + '-' + old_d + ' ' + old_hour + ':' + now_min + ':' + now_sec;

        return {
            startTime: startTime,
            endTime: endTime
        }
    },
    //检查时间是否过期
    checkTimeisOver: function(t) {
        //检测传入时间与当前时间比较大小
        //t:格式'2018-09-09 16:00:00'
        //也可以不含有时分秒，则自动设定为00:00:00
        var str = t;
        str_y = str.substring(0, 4);
        str_m = str.substring(5, 7) - 1;
        str_d = str.substring(8, 10);
        str_h = str.substring(11, 13);
        str_min = str.substring(14, 16);
        str_sec = str.substring(17, 19);
        var date = new Date(str_y, str_m, str_d, str_h, str_min, str_sec);
        var now = new Date();
        if (date < now) {
            //过期
            return true;
        } else {
            return false;
        }
    }
}

var NumFuns = {
    /**
     * 保留小数函数
     * num:待转换的数
     * x:保留的位数
     * floor:是否直接截取不四舍五入
     */
    toDecimal: function(num, x, floor) {
        if (isNaN(num)) {
            console.log("请传入数字！！");
            return
        }

        if (parseInt(num) == num) {
            var s = num.toString() + '.';
            var i = 0;
            for (; i < x; i++) {
                s = s + "0";
            }
            return s
        } else {
            if (floor == true) {
                return Math.floor(num * Math.pow(10, x)) / Math.pow(10, x);
            }
            return Math.round(num * Math.pow(10, x)) / Math.pow(10, x);
        }
    },
    //判断某个数组中是否含有某个值
    IsInArray: function(arr, val) {
        var testStr = ',' + arr.join(',') + ',';
        return testStr.indexOf("," + val + ",") != -1;
    }
}