//-------------------------------------  

/*16进制颜色转为RGB格式*/
String.prototype.colorRgba = function(g) {
    //十六进制颜色值的正则表达式  
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var sColor = this.toLowerCase();
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值  
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        if (g) {
            return [{
                offset: 0,
                color: "rgba(" + sColorChange.join(",") + ",1)"
            }, {
                offset: 1,
                color: "rgba(" + sColorChange.join(",") + ",0)"
            }];
        } else {
            return "rgba(" + sColorChange.join(",") + ",1)";
        }
    } else {
        return sColor;
    }
};

var sHex = "#00538b";
var sRgbColor = sHex.colorRgba(); //转为RGBA颜色值的方法  
// console.log(sRgbColor); //rgba(0,83,139,1)


const _zx = {
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
    //获取时间
    format: function() {
        var s = '';
        s += this.getFullYear() + '-'; // 获取年份。
        s += (this.getMonth() + 1) > 9 ? (this.getMonth() + 1) : '0' + (this.getMonth() + 1) + "-"; // 获取月份。
        s += this.getDate() > 9 ? this.getDate() : '0' + this.getDate(); // 获取日。
        return (s); // 返回日期。
    },
    //获取区间时间内所有的日期
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
    //获取区间时间内所有的周数，按周一计算
    getWeekAll: function(begin, end) {
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
            k = k + 7 * 24 * 60 * 60 * 1000;
        }
        return dateAllArr;
    },
    //获取区间时间内所有的月份
    getMonthAll: function(begin, end) {
        Date.prototype.format = this.format
        begin = new Date(begin).format()
        end = new Date(end).format()
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
                    // M.push(startM)
                    dateArry[i] = startY + "-" + (startM > 9 ? startM : "0" + startM);
                    startM += 1;
                } else {
                    dateArry[i] = startY + "-" + (startM > 9 ? startM : "0" + startM);
                    startM = 1;
                    startY += 1;
                }
            }
        }
        return dateArry
    },
    //获取区间时间内所有的年份
    getYearAll: function(begin, end) {
        Date.prototype.format = this.format
        begin = new Date(begin).format()
        end = new Date(end).format()
        var d1 = begin;
        var d2 = end;
        var dateArry = new Array();
        var s1 = d1.split("-");
        var s2 = d2.split("-");
        var mYearCount = parseInt(s2[0]) - parseInt(s1[0]) + 1;
        var startY = parseInt(s1[0]);
        for (var i = 0; i < mYearCount; i++) {
            dateArry[i] = startY;
            startY += 1;
        }
        return dateArry;
    },
}