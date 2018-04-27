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
        console.log(0)
        return sColor;
    }
};

var sHex = "#00538b";
var sRgbColor = sHex.colorRgba(); //转为RGBA颜色值的方法  
console.log(sRgbColor); //rgba(0,83,139,1)