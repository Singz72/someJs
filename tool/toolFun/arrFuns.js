//数组函数
var arrayFun = {
    //去重，也可以用ES6的set()去重
    distinct(arr) {
        var result = [];
        arr.forEach(function(v, i, arr) { //这里利用map，filter方法也可以实现
            var bool = arr.indexOf(v, i + 1); //从传入参数的下一个索引值开始寻找是否存在重复
            if (bool === -1) {
                result.push(v);
            }
        })
        return result;
    },
    //去重方法2
    distinctFilter(arr) {
        let newArr = arr.filter((value, index) => {
            return index === arr.indexOf(value);
        })
        return newArr;
    },
    //深拷贝数组
    objDeepCopyByJSON(arr) {
        let jsonArr = JSON.parse(JSON.stringify(arr));
        return jsonArr;
    },
    //数组中含对象元素  深拷贝
    objDeepCopy(source) {
        var sourceCopy = source instanceof Array ? [] : {};
        for (var item in source) {
            sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
        }
        return sourceCopy;
    },
    //判断某个数组中是否含有某个值
    IsInArray(arr, val) {
        var testStr = ',' + arr.join(',') + ',';
        return testStr.indexOf("," + val + ",") != -1;
    }
}