/***********************图表js*********************************/
var D_makeCharts = {
        _div: "", //必填，原生代码获取需要假如表格的div document.getElement
        _data: "", //每个_legend对应一组数 例如:_legend:['z','x'],_data:['11','22']或者_data:[['11'],['2','12']]
        _xAxis: "", //图表中有横坐标的需要填 ['ss','dd','ff','gg'] 没有就空着 但传入数据D中必须包含
        _yAxis: [{
            name: '', //y轴名称
            type: 'value', //y轴类型，默认为value
            max: '', //y轴最大值
            nameLocation: 'end', //y轴名称位于朝向的起始或终点位置
            inverse: true //y轴的朝向，true即从上往下，默认为false
        }],
        _legend: "", //必填 ['d','f','g','h']
        _color: "", //如果需要更改每个饼块的颜色可自定义 ['#aaaaaa','#cccccc'....] 没有就空着 但传入数据D中必须包含
        _title: "", //字符串，可以空值但必传
        _xyColor: "", //条形图轴线颜色
        _gradient: "", //true表示颜色渐变，false或者""表示不渐变，数据中必有，目前只有条形图具备渐变条件
        _rotate: "", //横坐标文字倾斜程度，0为默认表示不倾斜，负数表示向右倾斜，正数反之
        _indicator: "", //雷达图专用，必需，格式[{name:'极点名字',max:'极点值，数字表示'},{name:'极点名字',max:'极点值，数字表示'},....]
        _pathSymbols: "", //香柱形图专用，必需，图片路径，和传入的坐标名称必需一一对应 格式 pathSymbols = {man: 'image://font/man.png',woman: 'image://font/woman.png'}
        _opacity: "", //折线图专用，且折线图必传，内容为数字，0-1，表示折线图是否填充
        _splitNumber: "", //纵坐标的分割线间隔，传入数字
        _dataZoom: {
            _dataZoom: "", //是否加入x拖动框，true
            _start: "", //拖动框起始值，按横坐标数值区间判定，传入数值，（0-100），小于end
            _end: "", //拖动框结束值，按横坐标数值区间判定，传入数值，（0-100），大于start
            _bottom: "" //拖动框距离底部的距离，默认为2%
        }, //条形图纵坐标拖动框
        _dateList: '', //日历图需要的数据，即包含全年的日期和其中某些日期含有的特殊事件
        _calendarTime: '', //日历显示的时间 格式为   2018-04
        _markLine: {
            _num: '',
            _color: ''
        }, //折线图条形图基准线，基准线数值和颜色
    }
    //十六进制颜色值的正则表达式  
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*16进制颜色转为RGBA格式*/
String.prototype.colorRgba = function(g) {
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
    chartsColor: ['#6decf3', '#fedf84', '#9ff048', '#81c2d6', '#f6d6ff', '#dcf7a1', '#83fcd8'],
    makepictorialBar: function(D) {
        if (D._div == undefined || D._div == null) {
            alert('创建象柱形图时，未能成功获取到元素!');
        } //验证元素
        //判定是否有这个属性，再赋值
        var e = echarts.init(D._div);
        if (!D.hasOwnProperty("_color")) {
            D._color = ['#1efcfd', '#fedf84', '#fd8bb8', '#71ecf2'];
        } else {
            D._color = D._color == "" ? ['#1efcfd', '#fedf84', '#fd8bb8', '#71ecf2'] : D._color;
        }
        if (!D.hasOwnProperty("_title")) {
            D._title = "";
        } else {
            D._title = D._title == "" ? "" : D._title;
        }


        var options = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'none'
                },
                formatter: function(params) {
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
                }
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
                data: D._data[0],
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
                data: (function() {
                    var i = 0,
                        l = D._data[0].length,
                        data = [];
                    var keys = Object.keys(D._pathSymbols);
                    for (; i < l; i++) {
                        data.push({
                            value: D._data[0][i],
                            symbol: D._pathSymbols[keys[i]],
                            symbolSize: [32, 32]
                        })
                    }
                    return data
                })()
            }]
        };
        e.setOption(options);
        //返回echarts对象
        return echarts.getInstanceByDom(D._div)
    },
    makeRadar: function(D) {
        if (D._div == undefined || D._div == null) {
            alert('创建雷达图时，未能成功获取到元素!');
        } //验证元素
        var e = echarts.init(D._div);
        if (!D.hasOwnProperty("_color")) {
            D._color = this.chartsColor;
        } else {
            D._color = D._color == "" ? this.chartsColor : D._color;
        }
        if (!D.hasOwnProperty("_title")) {
            D._title = ""
        } else {
            D._title = D._title == "" ? "" : D._title;
        }

        var options = {
            title: {
                text: D._title,
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: (function() {
                    var i = 0,
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
                    return data
                })(),
                orient: 'horizontal',
                right: 'right'
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
                indicator: D._indicator,
                axisLabel: {
                    margin: 8
                }
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
                data: (function() {
                    var dataob = [],
                        i = 0,
                        l = D._data.length;
                    for (; i < l; i++) {
                        dataob.push({
                            value: D._data[i],
                            name: D._legend[i]
                        })
                    }
                    return dataob
                })()
            }],
            color: D._color
        }
        e.setOption(options);
        //返回echarts对象
        return echarts.getInstanceByDom(D._div)
    },
    makeGauge: function(D) {
        if (D._div == undefined || D._div == null) {
            alert('创建仪表图时，未能成功获取到元素!');
        } //验证元素
        var e = echarts.init(D._div);
        if (!D.hasOwnProperty("_color")) {
            D._color = ['#fedf84', '#ccc'];
        } else {
            D._color = D._color == "" ? ['#fedf84', '#ccc'] : D._color;
        }
        if (!D.hasOwnProperty("_title")) {
            D._title = "";
        } else {
            D._title = D._title == "" ? "" : D._title;
        }
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
                    y: -85
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
                    format: '<div style="text-align:center;"><span style="font-size:1.4em;color:' +
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
    makeRadiuspie: function(D) {
        if (D._div == undefined || D._div == null) {
            alert('创建环形图时，未能成功获取到元素!');
        } //验证元素
        var e = echarts.init(D._div);
        if (!D.hasOwnProperty("_color")) {
            D._color = this.chartsColor;
        } else {
            D._color = D._color == "" ? this.chartsColor : D._color;
        }
        if (!D.hasOwnProperty("_title")) {
            D._title = "";
        } else {
            D._title = D._title == "" ? "" : D._title;
        }
        if (!D.hasOwnProperty("_rotation")) {
            D._rotation = 0;
        } else {
            D._rotate = D._rotate == "" ? 0 : D._rotate;
        }



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
                data: (function() {
                    var i = 0,
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
                    return data
                })(),
                orient: 'horizontal',
                left: 'left'
            },
            title: {
                text: D._title,
                x: 'center',
                textStyle: {
                    color: '#fff'
                }
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
        //返回echarts对象
        return echarts.getInstanceByDom(D._div)
    },
    //线性条形图
    makeBarAndLine: function(D) {
        if (D._div == undefined || D._div == null) {
            alert('创建线性条形图时，未能成功获取到元素!');
        } //验证元素
        var e = echarts.init(D._div);
        //颜色渐变判断、转换
        if (D._gradient) {
            if (!D.hasOwnProperty("_color")) {
                D._color = this.chartsColor;
            } else {
                D._color = D._color == "" ? this.chartsColor : D._color;
            }


            var i = 0,
                newColor = [],
                l = D._color.length;
            for (; i < l; i++) {
                if (D._color[i] instanceof Object) {
                    newColor.push(D._color[i]);
                } else {
                    newColor.push(new echarts.graphic.LinearGradient(0, 0, 0, 1, D._color[i].colorRgba(D._gradient)));
                }
            }
            D._color = newColor;
        } else {
            if (!D.hasOwnProperty("_color")) {
                D._color = this.chartsColor;
            } else {
                D._color = D._color == "" ? this.chartsColor : D._color;
            }
            var i = 0,
                l = D._color.length,
                newColor = [];
            for (; i < l; i++) {
                newColor.push(D._color[i].colorRgba(D._gradient));
            }
            D._color = newColor;
        }
        if (!D.hasOwnProperty("_title")) {
            D._title = "";
        } else {
            D._title = D._title == "" ? "" : D._title;
        }
        if (!D.hasOwnProperty("_rotate")) {
            D._rotate = "";
        } else {
            D._rotate = D._rotate == "" ? 0 : D._rotate;
        }

        if (!D.hasOwnProperty("_xyColor")) {
            D._xyColor = '#fff';
        } else {
            D._xyColor = D._xyColor == ' ' ? '#fff' : D._xyColor;
        }

        if (!D.hasOwnProperty("_markLine")) {
            //不需要基准线
            D._markLine = {
                _num: -1,
                _color: 'rgba(0 ,0,0,0)'
            }
        } else {
            D._markLine._num = D._markLine._num == ' ' ? 0 : D._markLine._num;
            D._markLine._color = D._markLine._color == ' ' ? 'rgba(0,0,0,0)' : D._markLine._color;
        }


        var options = {
            title: {
                text: D._title,
                textStyle: {
                    color: D._xyColor
                }
            },
            legend: {
                data: (function() {
                    var i = 0,
                        l = D._legend.length,
                        data = [];
                    for (; i < l; i++) {
                        data.push({
                            name: D._legend[i],
                            textStyle: {
                                color: D._xyColor
                            }
                        });
                    }
                    return data
                })(),
                orient: 'horizontal',
                right: 'right'
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
                        color: D._xyColor
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
                        color: D._xyColor
                    }
                },
                /*interval:0*/
                /*splitNumber:4,*/
                axisTick: {
                    show: true
                },
                splitLine: {
                    show: false
                }
            },
            grid: {
                top: 40,
                bottom: 35
            },
            color: D._color,
            series: (function() {
                var i = 0,
                    j = 0,
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
                        animationDelay: function(idx) {
                            return idx * 10
                        },
                        markLine: {
                            data: [
                                { type: 'Y 轴值为' + D._markLine._num + ' 的水平线', yAxis: D._markLine._num }
                            ],
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        color: D._markLine._color
                                    }
                                }
                            }
                        }
                    })
                }
                for (; j < l; j++) {
                    seriesData.push({
                        name: D._legend[j],
                        type: 'line',
                        data: D._data[j],
                        animationDelay: function(idx) {
                            return idx * 10
                        },
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    color: D._color[1]
                                }
                            }
                        }
                    })
                }
                return seriesData
            })(),
            animationEasing: 'elasticOut',
            animationDelayUpdate: function(idx) {
                return idx * 5
            },
            //	            color: D._color
        };
        if (D.hasOwnProperty("_splitNumber")) {
            options.yAxis.splitNumber = parseInt(D._splitNumber);
        }
        if (D.hasOwnProperty("_dataZoom")) {
            if (!D._dataZoom.hasOwnProperty("_start")) {
                D._dataZoom._start = 30;
            } else {
                D._dataZoom._start = D._dataZoom._start == "" ? 30 : D._dataZoom._start;
            }
            if (!D._dataZoom.hasOwnProperty("_end")) {
                D._dataZoom._end = 70;
            } else {
                D._dataZoom._end = D._dataZoom._end == "" ? 70 : D._dataZoom._end;
            }
            if (!D._dataZoom.hasOwnProperty("_bottom")) {
                D._dataZoom._bottom = "2%";
            } else {
                D._dataZoom._bottom = D._dataZoom._bottom == "" ? "2%" : D._dataZoom._bottom;
            }
            if (D._dataZoom._dataZoom) {
                var roomstart = Number(D._dataZoom._start);
                var roomstartend = Number(D._dataZoom._end);
                options.dataZoom = [{
                        type: 'inside',
                        start: roomstart,
                        end: roomstartend,
                        filterMode: 'filter'
                    },
                    {
                        start: roomstart,
                        end: roomstartend,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: 14,
                        handleStyle: {
                            color: '#fff',
                            borderWidth: 0,
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        },
                        height: 11,
                        bottom: D._dataZoom._bottom,
                        textStyle: {
                            color: D._xyColor
                        }
                    }
                ]
            }
        }
        e.setOption(options);
        //返回echarts对象
        return echarts.getInstanceByDom(D._div)
    },
    makeLine: function(D) {
        if (D._div == undefined || D._div == null) {
            alert('创建折线图时，未能成功获取到元素!');
        } //验证元素
        var e = echarts.init(D._div);
        if (!D.hasOwnProperty("_color")) {
            D._color = this.chartsColor;
        } else {
            D._color = D._color == "" ? this.chartsColor : D._color;
        }
        if (!D.hasOwnProperty("_title")) {
            D._title = "";
        } else {
            D._title = D._title == "" ? "" : D._title;
        }
        if (!D.hasOwnProperty("_rotate")) {
            D._rotate = 0;
        } else {
            D._rotate = D._rotate == "" ? 0 : D._rotate;
        }
        if (!D.hasOwnProperty("_title")) {
            D._opacity = 0;
        } else {
            D._opacity = D._opacity == "" ? 0 : D._opacity;
        }
        if (!D.hasOwnProperty("_xyColor")) {
            D._xyColor = '#fff';
        } else {
            D._xyColor = D._xyColor == ' ' ? '#fff' : D._xyColor;
        }

        if (!D.hasOwnProperty("_markLine")) {
            //不需要基准线
            D._markLine = {
                _num: -1,
                _color: 'rgba(0,0,0,0)'
            }
        } else {
            D._markLine._num = D._markLine._num == ' ' ? 0 : D._markLine._num;
            D._markLine._color = D._markLine._color == ' ' ? 'rgba(0,0,0,0)' : D._markLine._color;
        }

        var options = {
            title: {
                text: D._title,
                textStyle: {
                    color: D._xyColor
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: (function() {
                    var i = 0,
                        l = D._legend.length,
                        data = [];
                    for (; i < l; i++) {
                        data.push({
                            name: D._legend[i],
                            textStyle: {
                                color: D._xyColor
                            }
                        });
                    }
                    return data
                })(),
                align: 'left'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: D._xAxis,
                axisLine: {
                    lineStyle: {
                        color: D._xyColor
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
                        color: D._xyColor
                    }
                }
            },
            grid: {
                top: 40,
                bottom: 35
            },
            series: (function() {
                var i = 0,
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
                        animationDelay: function(idx) {
                            return idx * 10
                        },
                        markLine: {
                            data: [
                                { type: 'Y 轴值为' + D._markLine._num + ' 的水平线', yAxis: D._markLine._num }
                            ],
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        color: D._markLine._color
                                    }
                                }
                            }
                        }
                    })
                }
                return seriesData
            })(),
            color: D._color
        };
        if (D.hasOwnProperty("_splitNumber")) {
            options.yAxis.splitNumber = parseInt(D._splitNumber);
        }
        if (D.hasOwnProperty("_dataZoom")) {
            if (!D._dataZoom.hasOwnProperty("_start")) {
                D._dataZoom._start = 30;
            } else {
                D._dataZoom._start = D._dataZoom._start == "" ? 30 : D._dataZoom._start;
            }
            if (!D._dataZoom.hasOwnProperty("_end")) {
                D._dataZoom._end = 70;
            } else {
                D._dataZoom._end = D._dataZoom._end == "" ? 70 : D._dataZoom._end;
            }
            if (!D._dataZoom.hasOwnProperty("_bottom")) {
                D._dataZoom._bottom = "2%";
            } else {
                D._dataZoom._bottom = D._dataZoom._bottom == "" ? "2%" : D._dataZoom._bottom;
            }
            if (D._dataZoom._dataZoom) {
                var roomstart = Number(D._dataZoom._start);
                var roomstartend = Number(D._dataZoom._end);
                options.dataZoom = [{
                        type: 'inside',
                        start: roomstart,
                        end: roomstartend,
                        filterMode: 'filter'
                    },
                    {
                        start: roomstart,
                        end: roomstartend,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: 14,
                        handleStyle: {
                            color: '#fff',
                            borderWidth: 0,
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        },
                        height: 11,
                        bottom: D._dataZoom._bottom,
                        textStyle: {
                            color: D._xyColor
                        }
                    }
                ]
            }
        }
        e.setOption(options);
        //返回echarts对象
        return echarts.getInstanceByDom(D._div)
    },
    /*双y轴折线*/
    //双y轴折线图
    makeTwoYLine: function(D) {
        if (D._div == undefined || D._div == null) {
            alert('创建折线图时，未能成功获取到元素!');
        } //验证元素
        var e = echarts.init(D._div);
        if (!D.hasOwnProperty("_color")) {
            D._color = this.chartsColor;
        } else {
            D._color = D._color == "" ? this.chartsColor : D._color;
        }
        if (!D.hasOwnProperty("_title")) {
            D._title = "";
        } else {
            D._title = D._title == "" ? "" : D._title;
        }
        if (!D.hasOwnProperty("_rotate")) {
            D._rotate = 0;
        } else {
            D._rotate = D._rotate == "" ? 0 : D._rotate;
        }
        if (!D.hasOwnProperty("_title")) {
            D._opacity = 0;
        } else {
            D._opacity = D._opacity == "" ? 0 : D._opacity;
        }
        if (!D.hasOwnProperty("_xyColor")) {
            D._xyColor = '#fff';
        } else {
            D._xyColor = D._xyColor == ' ' ? '#fff' : D._xyColor;
        }

        if (!D.hasOwnProperty("_markLine")) {
            //不需要基准线
            D._markLine = {
                _num: -1,
                _color: 'rgba(0,0,0,0)'
            }
        } else {
            D._markLine._num = D._markLine._num == ' ' ? 0 : D._markLine._num;
            D._markLine._color = D._markLine._color == ' ' ? 'rgba(0,0,0,0)' : D._markLine._color;
        }

        var options = {
            title: {
                text: D._title,
                textStyle: {
                    color: D._xyColor
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: (function() {
                    var i = 0,
                        l = D._legend.length,
                        data = [];
                    for (; i < l; i++) {
                        data.push({
                            name: D._legend[i],
                            textStyle: {
                                color: D._xyColor
                            }
                        });
                    }
                    return data
                })(),
                align: 'left'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: D._xAxis,
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: D._xyColor
                    }
                }
            },
            yAxis: D._yAxis,
            grid: {
                bottom: 65
            },
            series: (function() {
                var i = 0,
                    l = D._legend.length,
                    seriesData = [];
                for (; i < l; i++) {
                    seriesData.push({
                        name: D._legend[i],
                        type: 'line',
                        yAxisIndex: D._yAxisIndex[i],
                        data: D._data[i],
                        areaStyle: {
                            opacity: D._opacity
                        },
                        animationDelay: function(idx) {
                            return idx * 10
                        },
                        markLine: {
                            data: [
                                { type: 'Y 轴值为' + D._markLine._num + ' 的水平线', yAxis: D._markLine._num }
                            ],
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        color: D._markLine._color
                                    }
                                }
                            }
                        }
                    })
                }
                return seriesData
            })(),
            color: D._color
        };
        if (D.hasOwnProperty("_dataZoom")) {
            if (!D._dataZoom.hasOwnProperty("_start")) {
                D._dataZoom._start = 30;
            } else {
                D._dataZoom._start = D._dataZoom._start == "" ? 30 : D._dataZoom._start;
            }
            if (!D._dataZoom.hasOwnProperty("_end")) {
                D._dataZoom._end = 70;
            } else {
                D._dataZoom._end = D._dataZoom._end == "" ? 70 : D._dataZoom._end;
            }
            if (!D._dataZoom.hasOwnProperty("_bottom")) {
                D._dataZoom._bottom = "2%";
            } else {
                D._dataZoom._bottom = D._dataZoom._bottom == "" ? "2%" : D._dataZoom._bottom;
            }
            if (D._dataZoom._dataZoom) {
                var roomstart = Number(D._dataZoom._start);
                var roomstartend = Number(D._dataZoom._end);
                options.dataZoom = [{
                        type: 'inside',
                        start: roomstart,
                        end: roomstartend,
                        filterMode: 'filter'
                    },
                    {
                        start: roomstart,
                        end: roomstartend,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: 14,
                        handleStyle: {
                            color: '#fff',
                            borderWidth: 0,
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        },
                        height: 11,
                        bottom: D._dataZoom._bottom,
                        textStyle: {
                            color: D._xyColor
                        }
                    }
                ]
            }
        }
        e.setOption(options);
        //返回echarts对象
        return echarts.getInstanceByDom(D._div)
    },
    makePie: function(D) {
        if (D._div == undefined || D._div == null) {
            alert('创建饼状图时，未能成功获取到元素!');
        } //验证元素
        var e = echarts.init(D._div);
        if (!D.hasOwnProperty("_color")) {
            D._color = this.chartsColor;
        } else {
            D._color = D._color == "" ? this.chartsColor : D._color;
        }
        if (!D.hasOwnProperty("_title")) {
            D._title = "";
        } else {
            D._title = D._title == "" ? "" : D._title;
        }

        var options = {
            title: {
                text: '',
                subtext: '',
                x: 'center',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                left: 'left',
                data: (function() {
                    var i = 0,
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
                    return data
                })(),
            },
            series: [{
                name: D._title,
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: (function() {
                    var i = 0,
                        data = [],
                        l = D._legend.length;
                    for (; i < l; i++) {
                        data.push({
                            value: D._data[i],
                            name: D._legend[i]
                        });
                    }
                    return data
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
        //返回echarts对象
        return echarts.getInstanceByDom(D._div)
    },
    makeYaxisBar: function(D) {
        if (D._div == undefined || D._div == null) {
            alert('创建横向条形图时，未能成功获取到元素!');
        } //验证元素
        var e = echarts.init(D._div);
        //颜色渐变判断、转换
        if (D._gradient) {
            if (!D.hasOwnProperty("_color")) {
                D._color = this.chartsColor;
            } else {
                D._color = D._color == "" ? this.chartsColor : D._color;
            }


            var i = 0,
                newColor = [],
                l = D._color.length;
            for (; i < l; i++) {
                if (D._color[i] instanceof Object) {
                    newColor.push(D._color[i]);
                } else {
                    newColor.push(new echarts.graphic.LinearGradient(0, 0, 0, 1, D._color[i].colorRgba(D._gradient)));
                }
            }
            D._color = newColor;
        } else {
            if (!D.hasOwnProperty("_color")) {
                D._color = this.chartsColor;
            } else {
                D._color = D._color == "" ? this.chartsColor : D._color;
            }
            var i = 0,
                l = D._color.length,
                newColor = [];
            for (; i < l; i++) {
                newColor.push(D._color[i].colorRgba(D._gradient));
            }
            D._color = newColor;
        }
        if (!D.hasOwnProperty("_title")) {
            D._title = "";
        } else {
            D._title = D._title == "" ? "" : D._title;
        }
        if (!D.hasOwnProperty("_rotate")) {
            D._rotate = "";
        } else {
            D._rotate = D._rotate == "" ? 0 : D._rotate;
        }

        if (!D.hasOwnProperty("_xyColor")) {
            D._xyColor = '#fff';
        } else {
            D._xyColor = D._xyColor == ' ' ? '#fff' : D._xyColor;
        }

        if (!D.hasOwnProperty("_markLine")) {
            //不需要基准线
            D._markLine = {
                _num: -1,
                _color: 'rgba(0 ,0,0,0)'
            }
        } else {
            D._markLine._num = D._markLine._num == ' ' ? 0 : D._markLine._num;
            D._markLine._color = D._markLine._color == ' ' ? 'rgba(0,0,0,0)' : D._markLine._color;
        }


        var options = {
            title: {
                text: D._title,
                textStyle: {
                    color: D._xyColor
                }
            },
            legend: {
                data: (function() {
                    var i = 0,
                        l = D._legend.length,
                        data = [];
                    for (; i < l; i++) {
                        data.push({
                            name: D._legend[i],
                            textStyle: {
                                color: D._xyColor
                            }
                        });
                    }
                    return data
                })(),
                orient: 'horizontal',
                right: 'right'
            },
            tooltip: {},
            //与bar的不同是x、y轴互换
            yAxis: {
                type: 'category',
                data: D._xAxis,
                silent: false,
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: D._xyColor
                    }
                },
                axisLabel: {
                    interval: 0,
                    rotate: D._rotate
                }
            },
            xAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: D._xyColor
                    }
                },
                /*interval:0*/
                /*splitNumber:4,*/
                axisTick: {
                    show: true
                },
                splitLine: {
                    show: false
                }
            },
            grid: {
                top: 40,
                bottom: 35
            },
            color: D._color,
            series: (function() {
                var i = 0,
                    l = D._legend.length,
                    seriesData = [];
                for (; i < l; i++) {
                    seriesData.push({
                        name: D._legend[i],
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight',
                                textStyle: {
                                    // color: D._xyColor
                                    color: 'rgba(0,0,0,.8)'
                                }
                            }
                        },
                        data: D._data[i],
                        animationDelay: function(idx) {
                            return idx * 10
                        },
                        markLine: {
                            data: [
                                { type: 'Y 轴值为' + D._markLine._num + ' 的水平线', yAxis: D._markLine._num }
                            ],
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        color: D._markLine._color
                                    }
                                }
                            }
                        }
                    })
                }
                return seriesData
            })(),
            animationEasing: 'elasticOut',
            animationDelayUpdate: function(idx) {
                return idx * 5
            }
        };
        if (D.hasOwnProperty("_splitNumber")) {
            options.yAxis.splitNumber = parseInt(D._splitNumber);
        }
        if (D.hasOwnProperty("_dataZoom")) {
            if (!D._dataZoom.hasOwnProperty("_start")) {
                D._dataZoom._start = 30;
            } else {
                D._dataZoom._start = D._dataZoom._start == "" ? 30 : D._dataZoom._start;
            }
            if (!D._dataZoom.hasOwnProperty("_end")) {
                D._dataZoom._end = 70;
            } else {
                D._dataZoom._end = D._dataZoom._end == "" ? 70 : D._dataZoom._end;
            }
            if (!D._dataZoom.hasOwnProperty("_bottom")) {
                D._dataZoom._bottom = "2%";
            } else {
                D._dataZoom._bottom = D._dataZoom._bottom == "" ? "2%" : D._dataZoom._bottom;
            }
            if (D._dataZoom._dataZoom) {
                var roomstart = Number(D._dataZoom._start);
                var roomstartend = Number(D._dataZoom._end);
                options.dataZoom = [{
                        type: 'inside',
                        start: roomstart,
                        end: roomstartend,
                        filterMode: 'filter'
                    },
                    {
                        start: roomstart,
                        end: roomstartend,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: 14,
                        handleStyle: {
                            color: '#fff',
                            borderWidth: 0,
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        },
                        height: 11,
                        bottom: D._dataZoom._bottom,
                        textStyle: {
                            color: D._xyColor
                        }
                    }
                ]
            }
        }
        e.setOption(options);
        //返回echarts对象
        return echarts.getInstanceByDom(D._div)
    },
    makeBar: function(D) {
        if (D._div == undefined || D._div == null) {
            alert('创建条形图时，未能成功获取到元素!');
        } //验证元素
        var e = echarts.init(D._div);
        //颜色渐变判断、转换
        if (D._gradient) {
            if (!D.hasOwnProperty("_color")) {
                D._color = this.chartsColor;
            } else {
                D._color = D._color == "" ? this.chartsColor : D._color;
            }


            var i = 0,
                newColor = [],
                l = D._color.length;
            for (; i < l; i++) {
                if (D._color[i] instanceof Object) {
                    newColor.push(D._color[i]);
                } else {
                    newColor.push(new echarts.graphic.LinearGradient(0, 0, 0, 1, D._color[i].colorRgba(D._gradient)));
                }
            }
            D._color = newColor;
        } else {
            if (!D.hasOwnProperty("_color")) {
                D._color = this.chartsColor;
            } else {
                D._color = D._color == "" ? this.chartsColor : D._color;
            }
            var i = 0,
                l = D._color.length,
                newColor = [];
            for (; i < l; i++) {
                newColor.push(D._color[i].colorRgba(D._gradient));
            }
            D._color = newColor;
        }
        if (!D.hasOwnProperty("_title")) {
            D._title = "";
        } else {
            D._title = D._title == "" ? "" : D._title;
        }
        if (!D.hasOwnProperty("_rotate")) {
            D._rotate = "";
        } else {
            D._rotate = D._rotate == "" ? 0 : D._rotate;
        }

        if (!D.hasOwnProperty("_xyColor")) {
            D._xyColor = '#fff';
        } else {
            D._xyColor = D._xyColor == ' ' ? '#fff' : D._xyColor;
        }

        if (!D.hasOwnProperty("_markLine")) {
            //不需要基准线
            D._markLine = {
                _num: -1,
                _color: 'rgba(0 ,0,0,0)'
            }
        } else {
            D._markLine._num = D._markLine._num == ' ' ? 0 : D._markLine._num;
            D._markLine._color = D._markLine._color == ' ' ? 'rgba(0,0,0,0)' : D._markLine._color;
        }


        var options = {
            title: {
                text: D._title,
                textStyle: {
                    color: D._xyColor
                }
            },
            legend: {
                data: (function() {
                    var i = 0,
                        l = D._legend.length,
                        data = [];
                    for (; i < l; i++) {
                        data.push({
                            name: D._legend[i],
                            textStyle: {
                                color: D._xyColor
                            }
                        });
                    }
                    return data
                })(),
                orient: 'horizontal',
                right: 'right'
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
                        color: D._xyColor
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
                        color: D._xyColor
                    }
                },
                /*interval:0*/
                /*splitNumber:4,*/
                axisTick: {
                    show: true
                },
                splitLine: {
                    show: false
                }
            },
            grid: {
                top: 40,
                bottom: 35
            },
            color: D._color,
            series: (function() {
                var i = 0,
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
                        animationDelay: function(idx) {
                            return idx * 10
                        },
                        markLine: {
                            data: [
                                { type: 'Y 轴值为' + D._markLine._num + ' 的水平线', yAxis: D._markLine._num }
                            ],
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        color: D._markLine._color
                                    }
                                }
                            }
                        }
                    })
                }
                return seriesData
            })(),
            animationEasing: 'elasticOut',
            animationDelayUpdate: function(idx) {
                return idx * 5
            },
            //	            color: D._color
        };
        if (D.hasOwnProperty("_splitNumber")) {
            options.yAxis.splitNumber = parseInt(D._splitNumber);
        }
        if (D.hasOwnProperty("_dataZoom")) {
            if (!D._dataZoom.hasOwnProperty("_start")) {
                D._dataZoom._start = 30;
            } else {
                D._dataZoom._start = D._dataZoom._start == "" ? 30 : D._dataZoom._start;
            }
            if (!D._dataZoom.hasOwnProperty("_end")) {
                D._dataZoom._end = 70;
            } else {
                D._dataZoom._end = D._dataZoom._end == "" ? 70 : D._dataZoom._end;
            }
            if (!D._dataZoom.hasOwnProperty("_bottom")) {
                D._dataZoom._bottom = "2%";
            } else {
                D._dataZoom._bottom = D._dataZoom._bottom == "" ? "2%" : D._dataZoom._bottom;
            }
            if (D._dataZoom._dataZoom) {
                var roomstart = Number(D._dataZoom._start);
                var roomstartend = Number(D._dataZoom._end);
                options.dataZoom = [{
                        type: 'inside',
                        start: roomstart,
                        end: roomstartend,
                        filterMode: 'filter'
                    },
                    {
                        start: roomstart,
                        end: roomstartend,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: 14,
                        handleStyle: {
                            color: '#fff',
                            borderWidth: 0,
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        },
                        height: 11,
                        bottom: D._dataZoom._bottom,
                        textStyle: {
                            color: D._xyColor
                        }
                    }
                ]
            }
        }
        e.setOption(options);
        //返回echarts对象
        return echarts.getInstanceByDom(D._div)
    },
    makeCalendar: function(D) {
        if (D._div == undefined || D._div == null) {
            alert('创建日历图时，未能成功获取到元素!');
        } //验证元素
        var e = echarts.init(D._div);
        //			e.on('click', function (params) {
        //			    // 控制台打印数据的名称
        //			    console.log(params.value);
        //			});
        var heatmapData = [];
        var lunarData = [];
        var lunarData_no1 = [];
        for (var i = 0; i < D._dateList.length; i++) {
            //利用随机值，来填充每个格子的值，后期可根据传入值来改动，悬浮框使用
            heatmapData.push([
                D._dateList[i][0],
                Math.round(Math.random() * 300)
            ]);
            //给lunarData数组加值
            lunarData.push([D._dateList[i][0],
                1,
                D._dateList[i][1]
                //D._dateList[i][2]
            ]);
            for (var _dateList_i = 2; _dateList_i < D._dateList[i].length; _dateList_i++) {
                lunarData[i].push(
                    D._dateList[i][_dateList_i]
                );
            }
            //lunarData_no1,目前特殊用的数组
            lunarData_no1.push([D._dateList[i][0], -1, D._dateList[i][1], D._dateList[i][2]]);

        }

        var options = {
            tooltip: {
                formatter: function(params) {
                    var i = 3,
                        l = params.value.length,
                        result = '';
                    if (l == 3) {
                        result = '活动列表: 无'
                    } else {
                        result = '活动列表: \n'
                        for (; i < l; i++) {
                            if (params.value[i] != undefined) {
                                result += '\n\n' + params.value[i]
                            }
                        }
                    }
                    //return '活动列表: ' + params.value[1].toFixed(2);
                    return result
                },
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
                cellSize: [90, 65],
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(0,0,0,.4)',
                        width: 1,
                        type: 'solid'
                    }
                },
                yearLabel: { show: false },
                orient: 'vertical',
                dayLabel: {
                    firstDay: 1,
                    nameMap: 'cn'
                },
                monthLabel: {
                    show: true,
                    nameMap: 'cn',
                    margin: 20
                },
                range: D._calendarTime,
                itemStyle: {
                    normal: {
                        color: '#fff',
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,.2)'
                    }
                }
            }],

            series: [{
                    type: 'scatter',
                    coordinateSystem: 'calendar',
                    symbolSize: 1,
                    label: {
                        normal: {
                            show: true,
                            formatter: function(params) {
                                var result;
                                if (params.value[1] == -1) {
                                    //特殊数组
                                    result = echarts.number.parseDate(params.value[0]).getDate() + ' ' + params.value[2];
                                    if (params.value[3] != undefined) {
                                        var slice_str
                                        if (params.value[3].length > 6) {
                                            slice_str = params.value[3].slice(0, 6) + '...';
                                        } else {
                                            slice_str = params.value[3];
                                        }
                                        result += '\n\n' + slice_str
                                    }
                                } else {
                                    //正常使用
                                    var l = params.value.length;
                                    var d = echarts.number.parseDate(params.value[0]);
                                    var i = 1;
                                    result = d.getDate();
                                    result += '  '
                                    for (; i < l; i++) {
                                        if (params.value[i] != undefined) {
                                            result += '\n\n' + params.value[i]
                                        }
                                    }
                                }
                                return result
                            },
                            textStyle: {
                                color: '#000',
                                lineHeight: 70
                            }
                        }
                    },
                    data: lunarData_no1
                }, {
                    type: 'scatter',
                    coordinateSystem: 'calendar',
                    symbolSize: 1,
                    label: {
                        normal: {
                            show: false,
                            formatter: function(params) {
                                return '\n\n\n' + (params.value[3] || '');
                            },
                            textStyle: {
                                fontSize: 1,
                                fontWeight: 700,
                                color: '#a00'
                            }
                        }
                    },
                    data: lunarData
                },
                {
                    //悬浮框
                    name: '',
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    data: lunarData,
                    color: '#fff'
                }
            ]
        };
        e.setOption(options);
        //返回echarts对象
        return echarts.getInstanceByDom(D._div)

    }
}