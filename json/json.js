for (let i = 1, l = 13; i < l; i++) {

    let obj = {
        "date": `2018-${i<10?"0"+i:i}`,
        "data": []
    }

    let j = 1,
        k, income = 0;
    if (i == 2) {
        k = 29;
    } else if (i == 4 || i == 6 || i == 9 || i == 11) {
        k = 31;
    } else {
        k = 32;
    }
    for (; j < k; j++) {
        if (j == 15) {
            income = 5000;
        }
        let food = (Math.random() * (50 - 10) + 10).toFixed(2) - 1 + 1,
            foodM,
            travel = (Math.random() * (8 - 6) + 6).toFixed(2) - 1 + 1,
            travelM,
            recreation = (Math.random() * (100 - 20) + 20).toFixed(2) - 1 + 1,
            recreationM,
            other = (Math.random() * (100 - 5) + 5).toFixed(2) - 1 + 1,
            otherM;

        let foodRandom = Math.round(Math.random() * (12 - 1) + 1),
            travelRandom = Math.round(Math.random() * (12 - 1) + 1),
            recreationRandom = Math.round(Math.random() * (12 - 1) + 1),
            otherRandom = Math.round(Math.random() * (12 - 1) + 1);
        if (foodRandom < 5) {
            foodM = '点了比较好吃的外卖';
        } else if (foodRandom < 9) {
            foodM = '喝了很多奶茶！';
        } else {
            foodM = '我是真的没有喝可乐！！';
        }

        if (travelRandom < 5) {
            travelM = '应该坐了地铁';
        } else if (travelRandom < 9) {
            travelM = '出去玩了一趟';
        } else {
            travelM = '虽然宅在家但也花了路费！！';
        }

        if (recreationRandom < 5) {
            recreationM = '买了一款新游戏';
        } else if (recreationRandom < 9) {
            recreationM = '去了KTV';
        } else {
            recreationM = '又买皮肤了！！';
        }

        if (otherRandom < 5) {
            otherM = '话费充值';
        } else if (otherRandom < 9) {
            otherM = '买了几本书';
        } else {
            otherM = '又淘宝啦！！！';
        }
        obj.data.push({
            'food': {
                value: food,
                marks: foodM
            },
            'travel': {
                value: travel,
                marks: travelM
            },
            'recreation': {
                value: recreation,
                marks: recreationM
            },
            'other': {
                value: other,
                marks: otherM
            },
            'income': {
                value: income,
                marks: '工资'
            }
        })
    }
    console.log(JSON.stringify(obj))
}