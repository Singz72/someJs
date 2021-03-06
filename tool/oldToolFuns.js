/***********************轮播js*********************************/


var D_rotation = {
    rotation: 'rotation', //获取类名为rotation的id
    aRotation: 'rotation_content', //获取类名为rotation_content的id
    oNext: 'rotation_next', //获取类名为rotation_next的id
    Oprev: 'rotation_prev', //获取类名为rotation_prev的id
    siteTitle: 'site_category_bar_header_title', //获取类名为site_category_bar_header_title的id
    title: [],
    timerNextPage: '', //翻页时间
    Aswitch: '', //控制竖向是否滚动，控制横向是否自动滚动
}
var rotation = {

    /*轮播结构
     * 包含这个div结构的上级需要样式 position：relative之类的来限制ab；
<div class="rotation" id="rotation">
<div id="rotation_content" class="rotation_content">
    <!-- 滚动的对象 -->
    <div class="rotation_banner">
        <!-- 隐藏的辖区名称 -->
        <input type="hidden" value="${key}" name="sitePerson_siteOrg_hidden_title" />
        <div class="rotation_banner_i">
            <!-- 插入内容 -->
        </div>
    </div>
</div>
<div class="rotation_prev rotation_icon" id="rotation_prev"></div>
<div class="rotation_next rotation_icon" id="rotation_next"></div>
</div>*/

    rotationFun: function(D) {
        var atitle = D.title;
        var notitle;
        var atitle;
        var timerNextPage = '';
        //有小标题或者没有
        if (!atitle) {
            notitle = false;
        } else {
            notitle = true;
            var acitytitle = $("#" + D.siteTitle); //小标题
            acitytitle.html(atitle[0]);
        }
        if (!D.hasOwnProperty("timerNextPage")) {
            timerNextPage = 5000;
        } else {
            if (D.timerNextPage == '' || !D.timerNextPage) {
                timerNextPage = 5000;
            } else {
                timerNextPage = D.timerNextPage;
            }
        }

        //上移动画-->
        var oBody = $("#" + D.rotation)[0]; //鼠标移入移出对象

        var aRotation = $("#" + D.aRotation); //滚条对象
        var aBanner = $('#' + D.aRotation + ' .rotation_banner'); //内容 
        var oNext = $("#" + D.oNext)[0]; //下一页
        var Oprev = $("#" + D.Oprev)[0]; //上一页

        var aRotation_height = aRotation.height();
        var aBanneri = $('#' + D.aRotation + ' .rotation_banner_i');
        var aBanneri_l = aBanneri.length;
        aBanneri.height(aRotation_height) //内容框

        var num = 0; //锁定当前图片
        var l = aBanner.length;
        //隐藏所有div
        for (var i = 0; i < l; i++) {
            aBanner[i].style.display = 'none';
        }
        aBanner[0].style.display = 'block';
        aBanner[0].style.opacity = "1";
        aBanner[0].setAttribute("class", "rotation_banner rotation_on");

        var timerTop = null; //上移计时器
        var timerLeftright = null; //下一页计时器
        var timerRemake = null; //重启动画计时器


        //动画启动
        function startAnimate() {
            var bDiv_height;
            var bDiv = $('#' + D.aRotation + ' .rotation_on')
            var bDiv_height = bDiv.height();
            //        	var bDiv_height = aBanneri_l*aRotation_height;


            if (aRotation_height < bDiv_height) {

                //上移动化内部函数
                if (D.Aswitch) {
                    //不自动上下滚动
                    return
                }
                var h = Math.round(bDiv_height - aRotation_height);
                timerTop = setTimeout(function() {
                    var scroll_height = aRotation[0].scrollTop;
                    if (Math.round(scroll_height) < h) {
                        aRotation[0].scrollTop += aRotation_height;
                        startAnimate();
                    } else {
                        clearTimeout(timerTop);
                        timerLeftright = setTimeout(TimeToNext, timerNextPage); //下一页
                    }
                }, timerNextPage)
            } else {
                //直接左右翻转动画
                if (D.Aswitch) {
                    //不自动翻转
                    return
                }
                clearTimeout(timerTop);
                clearTimeout(timerLeftright);
                aRotation[0].scrollTop = 0;
                timerLeftright = setTimeout(TimeToNext, timerNextPage);

            }
        }
        clearTimeout(timerTop);
        clearTimeout(timerLeftright);
        startAnimate();


        oNext.onclick = function() { //按下图片切换到后一张
            clearTimeout(timerTop);
            var i = 0;
            for (; i < l; i++) {
                if (aBanner[i].className == "rotation_banner rotation_on") {
                    var bDiv = $('#' + D.aRotation + ' .rotation_on')
                    aRotation[0].scrollTop = 0;
                    aBanner[i].setAttribute("class", "rotation_banner");
                    aBanner[i].style.opacity = "0";
                    aBanner[i].style.display = 'none';
                    i++;
                    num++;
                    if (num > l - 1) {
                        num = 0
                    }
                    if (i > l - 1) {
                        i = 0;
                    }
                    if (notitle) {
                        acitytitle.html(atitle[num]);
                    }
                    aBanner[i].style.display = 'block';
                    aBanner[i].setAttribute("class", "rotation_banner rotation_on");
                    aBanner[i].style.opacity = "1";
                }
            }
            clearTimeout(timerTop);
            startAnimate();
        }

        Oprev.onclick = function() { //按下图片切换到前一张
            clearTimeout(timerTop);
            var i = 0;
            for (; i < l; i++) {
                if (aBanner[i].className == "rotation_banner rotation_on") {
                    var bDiv = $('#' + D.aRotation + ' .rotation_on')
                    aRotation[0].scrollTop = 0;
                    aBanner[i].setAttribute("class", "rotation_banner");
                    aBanner[i].style.opacity = "0";
                    aBanner[i].style.display = 'none';
                    i--;
                    num--;
                    if (num < 0) {
                        num = l - 1
                    }
                    if (i < 0) {
                        i = l - 1;
                    }
                    if (notitle) {
                        acitytitle.html(atitle[num]);
                    }

                    aBanner[i].style.display = 'block';
                    aBanner[i].setAttribute("class", "rotation_banner rotation_on");
                    aBanner[i].style.opacity = "1";
                }
            }
            clearTimeout(timerTop);
            startAnimate();
        }

        //自动向下一页转换
        function showhide(num) {
            var i = 0;
            for (; i < l; i++) {
                aBanner[i].setAttribute("class", "rotation_banner");
                aBanner[i].style.opacity = "0";
                aBanner[i].style.display = 'none';
            }
            aBanner[num].style.display = 'block';
            aBanner[num].setAttribute("class", "rotation_banner rotation_on");
            aBanner[num].style.opacity = "1";

            clearTimeout(timerLeftright);
            clearTimeout(timerTop);
            aRotation[0].scrollTop = 0;
            startAnimate();
        }

        function TimeToNext() { /*设置定时器运行的函数*/
            num++;
            if (num < l) {
                if (notitle) {
                    acitytitle.html(atitle[num]);
                }
                showhide(num);
            } else {
                num = 0;
                if (notitle) {
                    acitytitle.html(atitle[num]);
                }
                showhide(num);
            }
        }

        oBody.onmouseover = function() { /*鼠标引入，清除定时器，轮播图停止*/
            clearTimeout(timerTop);
            clearTimeout(timerLeftright);
        };
        oBody.onmouseout = function() { /*鼠标移出，重新调用定时器，轮播图开始*/
            clearTimeout(timerTop);
            clearTimeout(timerLeftright);
            startAnimate();
        };

        //停止动画，并且使其回到顶部,根据传入时间重启动画
        function toTopFun(Time) {
            clearTimeout(timerTop);
            clearTimeout(timerLeftright);
            clearTimeout(timerRemake);
            aRotation[0].scrollTop = 0;

            timerRemake = setTimeout(function() {
                startAnimate();
            }, Time)
        }

        return toTopFun;
    }
}


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

    //传入地区，返回对应的身份证头两地区，例如["北京","天津"]=>[11,12]
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



var domFuns = {

    /*zhzay主页插入标题方法，需要jQuery*/
    /*传入数据格式
		 * var D = {
            id: '',//类名为ssg_panel的父级div的id
            text: ''//标题的内容
        }*/
    prependTitle: function(D) {
        var div = $("#" + D.id);
        var T1 = '<div class="ssg_zhzay_title">\
				<div class="ssg_zhzay_title_box">\
				<img style="vertical-align: middle;height: 110%;">\
				<span>';
        var T2 = '</span></div></div>';
        $("#" + D.id + " .ssg_panel").addClass('ssg_zhzay_titlePanel');
        div.prepend(T1 + D.text + T2)
    },
    //IE8
    //判断getElemengtsByName是否存在
    getByEleName: function(aname) {
        var i = document.getElementsByName(aname);
        if (i > 0) {
            return i;
        } else {
            var aele = document.getElementsByTagName('*');
            var arr = [];
            for (var i = 0; i < aele.length; i++) {
                if (aele[i].getAttribute("name") == aname) {
                    arr.push(aele[i]);
                }
            }
            return arr;
        }
    }
}


var calendarData = {
    //获取当年整年阳历和阴历
    _getDateArray: function() {
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
    //easyui专用阴阳历,short为true则只返回含相应事件的日期，startTime和endTime截取指定时间内的日期
    _addArray: function(dateA, D, short, startTime, endTime) {
        var dateArray1 = dateA.concat();
        var D_data = [];
        var newDateArray1 = [];
        var resultArray = [];
        startTime = startTime || '2018-01-01';
        endTime = endTime || '2018-12-31';
        for (var i = 0; i < D.length; i++) {
            var start = D[i].beginTime.slice(0, 10);
            var end = D[i].endTime.slice(0, 10);
            var name = D[i].name;
            var k = 0,
                l = dateArray1.length,
                begin, stop;
            for (; k < l; k++) {
                if (dateArray1[k][0] == start) {
                    begin = k
                }
                if (dateArray1[k][0] == end) {
                    stop = k
                }
            }

            for (var j = begin; j <= stop; j++) {
                if (short) {
                    newDateArray1[j] = dateArray1[j]
                    newDateArray1[j].push(name)
                } else {
                    dateArray1[j].push(name)
                }
            }
        }
        if (short) {
            var o = newDateArray1.filter(function(value) {
                return value !== undefined;
            })
            for (var slice_k = 0; slice_k < o.length; slice_k++) {
                if (o[slice_k][0] >= startTime && o[slice_k][0] <= endTime) {
                    resultArray[slice_k] = o[slice_k];
                }
            }
            var o1 = resultArray.filter(function(value) {
                return value !== undefined;
            })
            return o1
        } else {
            for (var slice_k = 0; slice_k < dateArray1.length; slice_k++) {
                if (dateArray1[slice_k][0] >= startTime && dateArray1[slice_k][0] <= endTime) {
                    resultArray[slice_k] = dateArray1[slice_k];
                }
            }
            return resultArray
        }
    },
    //获取当月首尾时间点
    getSectionOfDate: function(year, mouth) {
        var date = new Date();
        var y, m;
        if (year == undefined || year == "" || year == " ") {
            var y = date.getFullYear();
        } else {
            var y = year;
        }
        if (mouth == undefined || mouth == "") {
            var m = date.getMonth() + 1;
        } else {
            var m = mouth;
        }
        var d = new Date(y, m, 0);
        var d_num = d.getDate() //当月所有天数

        var t_start = y + "-" + m + "-" + "01" + " " + "00:00:00"
        var t_end = y + "-" + m + "-" + d_num + " " + "23:59:59"

        return {
            t_start: t_start,
            t_end: t_end
        }
    },
    //easyui专用阴阳历
    getYinInYang: function() {
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
            var key = year + "-" + m + "-" + d;
            // dateArray.push({
            //     key: [GetLunarDay(year, m, d)]
            // });
            dateArray[key] = [GetLunarDay(year, m, d)]
            startDate.setDate(startDate.getDate() + 1);
        }
        return dateArray;
    },
    //easyui专用阴阳历,short为true则只返回含相应事件的日期，startTime和endTime截取指定时间内的日期
    addDataToYinyang: function(dateA, D, short, startTime, endTime) {

        var objDeepCopy = function(source) {
            var sourceCopy = {};
            for (var item in source) sourceCopy[item] = source[item];
            return sourceCopy;
        }
        var dateArray1 = objDeepCopy(dateA);
        var D_data = [];
        var newDateArray1 = {};
        var resultArray = {};
        startTime = startTime || '2018-01-01';
        endTime = endTime || '2018-12-31';
        for (var i = 0; i < D.length; i++) {
            var start = D[i].beginTime.slice(0, 10);
            var end = D[i].endTime.slice(0, 10);
            var name = D[i].name;
            var begin, stop;
            for (var k_i in dateArray1) {
                if (k_i == start) {
                    begin = k_i
                }
                if (k_i == end) {
                    stop = k_i
                }
            }
            for (var key in dateArray1) {
                if (key >= begin && key <= stop) {
                    if (short) {
                        newDateArray1[key] = dateArray1[key]
                        newDateArray1[key].push(name)
                    } else {
                        dateArray1[key].push(name)
                    }
                }
            }
        }
        if (short) {
            for (var slice_k in newDateArray1) {
                if (slice_k >= startTime && slice_k <= endTime) {
                    resultArray[slice_k] = newDateArray1[slice_k];
                }
            }
            return resultArray
        } else {
            for (var slice_k in dateArray1) {
                if (slice_k >= startTime && slice_k <= endTime) {
                    resultArray[slice_k] = dateArray1[slice_k];
                }
            }
            return resultArray
        }
    }
}

var getYearMonthDay = {
    /**
     * 保留小数函数
     * num:待转换的数
     * x:保留的位数
     * floor:是否直接截取不四舍五入
     */
    toDecimal: function(num, x, floor) {
        if (isNaN(num)) {
            console.log("请传入数字！！")
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
                return Math.floor(num * Math.pow(10, x)) / Math.pow(10, x)
            }
            return Math.round(num * Math.pow(10, x)) / Math.pow(10, x);
        }
    },
    //判断某个数组中是否含有某个值
    IsInArray: function(arr, val) {
        var testStr = ',' + arr.join(',') + ',';
        return testStr.indexOf("," + val + ",") != -1;
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
    //在原有日期基础上，增加days天数，默认增加1天
    addDaysOnDate: function(date, days) {
        if (days == undefined || days == '') {
            days = 1;
        }
        var date = new Date(date);
        date.setDate(date.getDate() + days);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return date.getFullYear() + '-' + this.getFormatDate(month) + '-' + this.getFormatDate(day);
    },
    //日期月份/天的显示，如果是1位数，则在前面加上'0'
    getFormatDate: function(arg) {
        if (arg == undefined || arg == '') {
            return '';
        }
        var re = arg + '';
        if (re.length < 2) {
            re = '0' + re;
        }
        return re;
    },
    //对日期进行处理，返回xxxx-xx-xx格式
    format: function() {
        var s = '';
        s += this.getFullYear() + '-'; // 获取年份。
        s += (this.getMonth() + 1) > 9 ? (this.getMonth() + 1) : '0' + (this.getMonth() + 1) + "-"; // 获取月份。
        s += this.getDate() > 9 ? this.getDate() : '0' + this.getDate(); // 获取日。
        return (s); // 返回日期。
    },
    //获取时间区间内所有的月份 参数格式: '2018-05-23'
    getMonthAll: function(begin, end) {
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
    getDayAll: function(begin, end) {
        Date.prototype.format = this.format

        begin = new Date(begin).format()
        end = new Date(end).format()

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
    //返回时间所在年份的所有周数
    //obj:为true则返回对象格式
    getAllWeeks: function(arg, obj) {
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
    getPointNumForWeek: function(arg) {
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
    getPointWeekForNum: function(arg, T) {
        var that = this;
        var D = that.getAllWeeks(new Date(T)); //week array
        return D[arg - 1]
    },
    //检查时间是否过期
    checkTimeisOver: function(t) {
        //检测传入时间与当前时间比较大小
        //t:格式'2018-09-09 16:00:00'
        //也可以不含有时分秒，叫自动设定为00:00:00
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
    },
    //判断时间是否为今天
    checkTimeisToday: function(d) {
        var td = new Date();
        td = new Date(td.getFullYear(), td.getMonth(), td.getDate());
        var checkd = new Date(d);
        checkd = new Date(checkd.getFullYear(), checkd.getMonth(), checkd.getDate());
        var x = (checkd - td) / 1000 / 60 / 60 / 24;
        if (x == 0) {
            return true
        }
        return false
    }
}

//跳转函数
var hopLink = {
    goToURL: function(URL, data, openUrl) {
        $.ajax({
            type: "GET",
            async: false,
            data: data,
            url: URL,
            success: function(msg) {
                window.open(openUrl);
            },
            error: function() {
                window.open(openUrl);
            }
        });
    }
}