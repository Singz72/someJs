/*
 *传入参数数据格式
 * DOM				
 * 数据	
 * 横坐标			
 * 数据类别				
 * 自定义图形颜色
 * 标题
 * */
var D = {
    _div: "", //必填，原生代码获取需要假如表格的div document.getElement
    _data: "", //每个_legend对应一组数 例如:_legend:['z','x'],_data:['11','22']或者_data:[['11'],['2','12']]
    _xAxis: "", //图表中有横坐标的需要填 ['ss','dd','ff','gg'] 没有就空着 但传入数据D中必须包含
    _legend: "", //必填 ['d','f','g','h']
    _color: "", //如果需要更改每个饼块的颜色可自定义 ['#aaaaaa','#cccccc'....] 没有就空着 但传入数据D中必须包含
    _title: "", //字符串，可以空值但必传
    _gradient: "", //true表示颜色渐变，false或者""表示不渐变，数据中必有，目前只有条形图具备渐变条件
    _rotate: "", //横坐标文字倾斜程度，0为默认表示不倾斜，负数表示向右倾斜，正数反之
    _indicator: "", //雷达图专用，必需，格式[{name:'极点名字',max:'极点值，数字表示'},{name:'极点名字',max:'极点值，数字表示'},....]
    _pathSymbols: "", //香柱形图专用，必需，图片路径，和传入的坐标名称必需一一对应 格式 pathSymbols = {man: 'image://font/man.png',woman: 'image://font/woman.png'}
    _opacity: "",    //折线图专用，且折线图必传，内容为数字，0-1，表示折线图是否填充
    _time:"",       //日历图专用，用以指定当前月份
    _dateList:"",   //日历图专用，当年所有日期'xxxx-xx'格式
}
//十六进制颜色值的正则表达式  
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*16进制颜色转为RGBA格式*/
String.prototype.colorRgba = function (g) {
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
                color: "rgba(" + sColorChange.join(",") + ",0.25)"
            }];
        } else {
            return "rgba(" + sColorChange.join(",") + ",1)";
        }
    } else {
        return sColor;
    }
};
var makeCharts = {
    makepictorialBar: function (D) {
        if (D._div == undefined || D._div == null) {
            alert('创建象柱形图时，未能成功获取到元素!')
        } //验证元素
        let e = echarts.init(D._div);
        D._color = D._color == "" ? ['#1efcfd', '#fedf84', '#fd8bb8', '#71ecf2'] : D._color;
        D._title = D._title == "" ? "" : D._title;


        var options = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'none'
                },
                formatter: function (params) {
                    return params[0].name + ': ' + params[0].value;
                }
            },
            xAxis: {
                data: D._xAxis,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                },
            },
            grid: {
                bottom: 30
            },
            yAxis: {
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            },
            color: ['#fff'],
            series: [{
                name: 'hill',
                type: 'pictorialBar',
                barCategoryGap: '10%',
                // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
                symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
                itemStyle: {
                    normal: {
                        color: '#6decf3',
                        opacity: 0.9
                    },
                    emphasis: {
                        color: '#6decf3',
                        opacity: 1
                    }
                },
                data: D._data,
                z: 10
            }, {
                name: 'glyph',
                type: 'pictorialBar',
                barGap: '-100%',
                symbolPosition: 'end',
                symbolSize: 50,
                symbolOffset: [0, '-120%'],
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                data: (function () {
                    var i = 0,
                        l = D._data.length,
                        data = [];
                    var keys = Object.keys(D._pathSymbols);
                    for (; i < l; i++) {
                        data.push({
                            value: D._data[i],
                            symbol: D._pathSymbols[keys[i]],
                            symbolSize: [32, 32]
                        })
                    }
                    return data
                })()
            }]
        };
        e.setOption(options);
    },
    makeRadar: function (D) {
        if (D._div == undefined || D._div == null) {
            alert('创建雷达图时，未能成功获取到元素!')
        } //验证元素
        let e = echarts.init(D._div);
        D._color = D._color == "" ? ['#6decf3', '#2f4554', '#61a0a8', '#d48265', '#91c7ae'] : D._color;
        D._title = D._title == "" ? "" : D._title;

        var options = {
            title: {
                text: D._title,
                textStyle: {
                    color: '#fff'
                },
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: (function () {
                    let i = 0,
                        l = D._legend.length,
                        data = [];
                    for (; i < l; i++) {
                        data.push({
                            name: D._legend[i],
                            textStyle: {
                                color: 'rgba(255,255,255,0.8)'
                            }
                        });
                    }
                    return data;
                })(),
                orient: 'horizontal',
                right: 'right',
            },
            radar: {
                // shape: 'circle',
                center: ['50%', '50%'],
                radius: '65%', //大小
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['rgba(0,0,0,0)']
                    }
                },
                indicator: D._indicator
            },
            series: [{
                name: D._title,
                type: 'radar',
                tooltip: {
                    trigger: 'item'
                },
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                // areaStyle: {normal: {}},
                data: (function () {
                    var dataob = [],
                        i = 0,
                        l = D._data.length;
                    for (; i < l; i++) {
                        dataob.push({
                            value: D._data[i],
                            name: D._legend[i]
                        })
                    }
                    return dataob;
                })()
            }],
            color: D._color
        }
        e.setOption(options);
    },
    makeGauge: function (D) {
        if (D._div == undefined || D._div == null) {
            alert('创建仪表图时，未能成功获取到元素!')
        } //验证元素
        let e = echarts.init(D._div);
        D._color = D._color == "" ? ['#fedf84', '#ccc'] : D._color;
        D._title = D._title == "" ? "" : D._title;
        var gaugeOptions = {
            chart: {
                backgroundColor: '',
                type: 'solidgauge'
            },

            title: 'sd',

            pane: {
                center: ['50%', '85%'],
                size: '120%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) ||
                        '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },

            tooltip: {
                enabled: false
            },

            // the value axis
            yAxis: {
                stops: [
                    [0.1, 'rgba(109,236,243,0.2)'], // green
                    [0.5, 'rgba(109,236,243,0.6)'], // yellow
                    [0.9, 'rgba(109,236,243,1)'] // red
                ],
                lineWidth: 0,
                minorTickInterval: null,
                tickAmount: 2,
                title: {
                    y: -70
                },
                labels: {
                    y: 16
                }
            },

            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            }
        };

        // The speed gauge
        var chartSpeed = Highcharts.chart(D._div, Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: D._title,
                    style: {
                        color: '#fff',
                    }
                }
            },

            credits: {
                enabled: false
            },
            series: [{
                name: D._legend,
                data: D._data,
                dataLabels: {
                    format: '<div style="text-align:center;"><span style="font-size:25px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'white') +
                        '">{y}%</span><br/>' +
                        '<span style="font-size:12px;color:silver"></span></div>'
                },
                tooltip: {
                    valueSuffix: ''
                },
            }]
        }));
    },
    makeRadiuspie: function (D) {
        if (D._div == undefined || D._div == null) {
            alert('创建环形图时，未能成功获取到元素!')
        } //验证元素
        let e = echarts.init(D._div);
        D._color = D._color == "" ? ['#6decf3', '#ccc'] : D._color;
        D._title = D._title == "" ? "" : D._title;
        D._rotate = D._rotate == "" ? 0 : D._rotate;


        var labelTop = {
            normal: {
                label: {
                    show: true,
                    position: 'center',
                    formatter: '{b}',
                    textStyle: {
                        baseline: 'bottom'
                    }
                },
                labelLine: {
                    show: false
                }
            }
        };
        var labelFromatter = {
            normal: {
                label: {
                    formatter: function Percentage() {
                        return (Math.round(D._data[1] / (D._data[0] + D._data[1]) * 10000) / 100.00 + "%");
                    },
                    textStyle: {
                        baseline: 'top',
                        color: D._color
                    }
                }
            },
        }
        var labelBottom = {
            normal: {
                color: '#ccc',
                label: {
                    show: true,
                    position: 'center'
                },
                labelLine: {
                    show: false
                }
            }
        };
        var radius = [40, 55];
        options = {
            legend: {
                data: (function () {
                    let i = 0,
                        l = D._legend.length,
                        data = [];
                    for (; i < l; i++) {
                        data.push({
                            name: D._legend[i],
                            textStyle: {
                                color: 'rgba(255,255,255,0.8)'
                            }
                        });
                    }
                    return data;
                })(),
                orient: 'horizontal',
                left: 'left',
            },
            title: {
                text: D._title,
                x: 'center',
                textStyle: {
                    color: '#fff'
                },
            },
            series: [{
                type: 'pie',
                center: ['50%', '60%'],
                radius: radius,
                itemStyle: labelFromatter,
                data: [{
                    name: D._legend[0],
                    value: D._data[0],
                    itemStyle: labelBottom
                },
                {
                    name: D._legend[1],
                    value: D._data[1],
                    itemStyle: labelTop
                }
                ]
            }],
            color: D._color
        };
        e.setOption(options);
    },
    makeLine: function (D) {
        if (D._div == undefined || D._div == null) {
            alert('创建折线图时，未能成功获取到元素!')
        } //验证元素
        let e = echarts.init(D._div);
        D._color = D._color == "" ? ['#fedf84', '#1efcfd', '#fd8bb8', '#71ecf2'] : D._color;
        D._title = D._title == "" ? "" : D._title;
        D._rotate = D._rotate == "" ? 0 : D._rotate;

        D._opacity = D._opacity == "" ? 0 : D._opacity;

        var options = {
            title: {
                text: D._title,
                textStyle: {
                    color: '#fff'
                },
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: (function () {
                    let i = 0,
                        l = D._legend.length,
                        data = [];
                    for (; i < l; i++) {
                        data.push({
                            name: D._legend[i],
                            textStyle: {
                                color: 'rgba(255,255,255,0.8)'
                            }
                        });
                    }
                    return data;
                })(),
                align: 'left'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: D._xAxis,
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                    }
                },
                axisLabel: {
                    interval: 0,
                    rotate: D._rotate
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                    }
                },
            },
            series: (function () {
                let i = 0,
                    l = D._legend.length,
                    seriesData = [];
                for (; i < l; i++) {
                    seriesData.push({
                        name: D._legend[i],
                        type: 'line',
                        data: D._data[i],
                        areaStyle: {
                            opacity: D._opacity
                        },
                        animationDelay: function (idx) {
                            return idx * 10;
                        }
                    })
                }
                return seriesData;
            })(),
            color: D._color
        };
        e.setOption(options);
    },
    makePie: function (D) {
        if (D._div == undefined || D._div == null) {
            alert('创建饼状图时，未能成功获取到元素!')
        } //验证元素
        let e = echarts.init(D._div);
        D._color = D._color == "" ? ['#1efcfd', '#fedf84', '#fd8bb8', '#ffa48c', '#686ab1', '#c9fe8b'] : D._color;
        D._title = D._title == "" ? "" : D._title;

        var options = {
            title: {
                text: '',
                subtext: '',
                x: 'center',
                textStyle: {
                    color: '#fff'
                },
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                left: 'left',
                data: (function () {
                    let i = 0,
                        l = D._legend.length,
                        data = [];
                    for (; i < l; i++) {
                        data.push({
                            name: D._legend[i],
                            textStyle: {
                                color: 'rgba(255,255,255,0.8)'
                            }
                        });
                    }
                    return data;
                })(),
            },
            series: [{
                name: D._title,
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: (function () {
                    let i = 0,
                        data = [],
                        l = D._legend.length;
                    for (; i < l; i++) {
                        data.push({
                            value: D._data[i],
                            name: D._legend[i]
                        });
                    }
                    return data;
                })(),
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }],
            color: D._color
        };
        e.setOption(options);
    },
    makeBar: function (D) {

        if (D._div == undefined || D._div == null) {
            alert('创建条形图时，未能成功获取到元素!')
        } //验证元素
        let e = echarts.init(D._div);
        //颜色渐变判断、转换
        if (D._gradient) {
            D._color = D._color == "" ? ['#6decf3', '#fedf84', '#fedf84', '#1efcfd', '#fd8bb8', '#71ecf2'] : D._color;

            var i = 0,
                newColor = [],
                l = D._color.length;
            for (; i < l; i++) {
                if (D._color[i] instanceof Object) {
                    newColor.push(D._color[i])
                } else {
                    newColor.push(new echarts.graphic.LinearGradient(0, 0, 0, 1, D._color[i].colorRgba(D._gradient)));
                }
            }
            D._color = newColor;
        } else {
            D._color = D._color == "" ? ['#6decf3', '#fedf84', '#fedf84', '#1efcfd', '#fd8bb8', '#71ecf2'] : D._color;
            var i = 0,
                l = D._color.length,
                newColor = [];
            for (; i < l; i++) {
                newColor.push(D._color[i].colorRgba(D._gradient))
            }
            D._color = newColor;
        }
        D._title = D._title == "" ? "" : D._title;
        D._rotate = D._rotate == "" ? 0 : D._rotate;

        var options = {
            title: {
                text: D._title,
                textStyle: {
                    color: '#fff'
                },
            },
            legend: {
                data: (function () {
                    let i = 0,
                        l = D._legend.length,
                        data = [];
                    for (; i < l; i++) {
                        data.push({
                            name: D._legend[i],
                            textStyle: {
                                color: 'rgba(255,255,255,0.8)'
                            }
                        });
                    }
                    return data;
                })(),
                align: 'left'
            },

            tooltip: {},
            xAxis: {
                data: D._xAxis,
                silent: false,
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                    }
                },
                axisLabel: {
                    interval: 0,
                    rotate: D._rotate
                }
            },
            yAxis: {
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                    }
                },
            },
            series: (function () {
                let i = 0,
                    l = D._legend.length,
                    seriesData = [];
                for (; i < l; i++) {
                    seriesData.push({
                        name: D._legend[i],
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: D._color
                                }
                            }
                        },
                        data: D._data[i],
                        animationDelay: function (idx) {
                            return idx * 10;
                        }
                    })
                }
                return seriesData;
            })(),
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
                return idx * 5;
            },
            color: D._color
        };
        e.setOption(options);
    },
    makeCalendar: function () {
        if (D._div == undefined || D._div == null) {
            alert('创建日历图时，未能成功获取到元素!')
        } //验证元素
        let e = echarts.init(D._div);

        var heatmapData = [];
        var lunarData = [];
        for (var i = 0; i < D._dateList.length; i++) {
            heatmapData.push([
                D._dateList[i][0],
                Math.random() * 300
            ]);
            lunarData.push([
                D._dateList[i][0],
                1,
                D._dateList[i][1],
                D._dateList[i][2]
            ]);
        }

        var options = {
            tooltip: {
                formatter: function (params) {
                    return '销售量: ' + params.value[1].toFixed(2);
                }
            },

            visualMap: {
                show: false,
                min: 0,
                max: 300,
                calculable: true,
                seriesIndex: [2],
                orient: 'horizontal',
                left: 'center',
                bottom: 20,
                inRange: {
                    color: ['#e0ffff', '#006edd'],
                    opacity: 0.3
                },
                controller: {
                    inRange: {
                        opacity: 0.5
                    }
                }
            },

            calendar: [{
                left: 'center',
                top: 'middle',
                cellSize: [60, 25],
                yearLabel: { show: false },
                orient: 'vertical',
                dayLabel: {
                    firstDay: 1,
                    nameMap: 'cn'
                },
                monthLabel: {
                    show: true
                },
                range: D._time
            }],

            series: [{
                type: 'scatter',
                coordinateSystem: 'calendar',
                symbolSize: 1,
                label: {
                    normal: {
                        show: true,
                        formatter: function (params) {
                            var d = echarts.number.parseDate(params.value[0]);
                            // return d.getDate() + '\n\n' + params.value[2] + '\n\n';
                            return d.getDate();
                        },
                        textStyle: {
                            color: '#000'
                        }
                    }
                },
                data: lunarData
            }, {
                type: 'scatter',
                coordinateSystem: 'calendar',
                symbolSize: 1,
                label: {
                    normal: {
                        show: true,
                        formatter: function (params) {
                            return '\n\n\n' + (params.value[3] || '');
                        },
                        textStyle: {
                            fontSize: 14,
                            fontWeight: 700,
                            color: '#a00'
                        }
                    }
                },
                data: lunarData
            }, {
                name: '销售量',
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: heatmapData
            }]
        };
        
        e.setOption(options);
    }
}