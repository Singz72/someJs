//数值函数
var NumFuns = {
    /**
     * 保留小数函数
     * num:待转换的数
     * x:保留的位数
     * floor:是否直接截取不四舍五入
     */
    toDecimal(num, x, floor) {
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
    }
}