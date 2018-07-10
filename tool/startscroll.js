function getAllWeeks(arg) {
    var year = arg.getFullYear();
    //获取year这年所有的周
    var d = new Date(year, 0, 1);

    while (d.getDay() != 1) {
        d.setDate(d.getDate() - 1);
    }
    var nowTime = new Date(); //当前时间
    var nowYear = nowTime.getFullYear(); //今年
    var allToisTrue = false;
    if (nowYear == year) {
        var to = new Date(); //界定条件 非全年
        allToisTrue = true;
        var allTo = new Date(year + 1, 0, 1); //界定条件 全年
    } else {
        var to = new Date(year + 1, 0, 1); //界定条件 全年
    }
    var i = 1;
    var alli = 1;
    var D = [];
    var allD = [];
    var D_point = 0;
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
        i++;
    }
    //获取本年的所有周
    if (allToisTrue) {
        for (var allfrom = d; allfrom < allTo;) {

            var allstr1 = '';
            var allstr2 = '';
            allstr1 = allstr1 + allfrom.getFullYear() + "-" + ((allfrom.getMonth() + 1) <= 9 ? ('0' + (allfrom.getMonth() + 1)) : (allfrom.getMonth() + 1)) + "-" + (allfrom.getDate() <= 9 ? ('0' + allfrom.getDate()) : allfrom.getDate());
            allfrom.setDate(allfrom.getDate() + 6);
            if (allfrom < allTo) {
                allstr2 = allstr2 + allfrom.getFullYear() + "-" + ((allfrom.getMonth() + 1) <= 9 ? ('0' + (allfrom.getMonth() + 1)) : (allfrom.getMonth() + 1)) + "-" + (allfrom.getDate() <= 9 ? ('0' + allfrom.getDate()) : allfrom.getDate());
                allfrom.setDate(allfrom.getDate() + 1);
            } else {
                allstr2 = allstr2 + allfrom.getFullYear() + "-" + ((allfrom.getMonth() + 1) <= 9 ? ('0' + (allfrom.getMonth() + 1)) : (allfrom.getMonth() + 1)) + "-" + (allfrom.getDate() <= 9 ? ('0' + allfrom.getDate()) : allfrom.getDate());
            }
            allD.push([allstr1, allstr2]);
            alli++;
        }
    }
    var nowMonth = nowTime.getMonth();
    var nowDay = nowTime.getDate();
    var T1 = year + '-' + (nowMonth + 1) + '-' + nowDay;
    T1 = T1.replace(/-/g, "/");
    var NowT = new Date(T1); //当前时间在传入年份的时间段

    for (var ti = 0; ti < D.length; ti++) {
        var T2 = new Date(D[ti][1]);
        if (NowT <= T2) {
            D_point = ti;
            break;
        }
    }
    return {
        D: D,
        i: D_point,
        allD: allD
    }
}