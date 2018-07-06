(function(window, z, plugin, $, undefined) {
    if (z && plugin && !plugin.HomePlugin) {
        z.setMembers(plugin, {
            HomePlugin: function() {
                plugin.BasePlugin.apply(this, arguments);
            }
        });
        z.inherit(plugin.BasePlugin, plugin.HomePlugin, {
            refreshCodes: [], //需要刷新的编码
            refreshdivs: [], //需要刷新的div

            // //left Start
            // zhzay_mainLeft_1: "zhzay_mainLeft_1",
            // zhzay_mainLeft_1_div: "#zhzay_mainLeft_1",

            // zhzay_mainLeft_2: "zhzay_mainLeft_2",
            // zhzay_mainLeft_2_div: "#zhzay_mainLeft_2",

            // zhzay_mainLeft_3: "zhzay_mainLeft_3",
            // zhzay_mainLeft_3_div: "#zhzay_mainLeft_3",

            // zhzay_mainLeft_4: "zhzay_mainLeft_4",
            // zhzay_mainLeft_4_div: "#zhzay_mainLeft_4",
            // //left end
            // //Middle Start
            // zhzay_mainMiddle_1: "zhzay_mainMiddle_1",
            // zhzay_mainMiddle_1_div: "#zhzay_mainMiddle_1",

            // zhzay_mainMiddle_2: "zhzay_mainMiddle_2",
            // zhzay_mainMiddle_2_div: "#zhzay_mainMiddle_2",
            // //Middle end
            // //Middle Start
            // zhzay_mainRight_1: "zhzay_mainRight_1",
            // zhzay_mainRight_1_div: "#zhzay_mainRight_1",

            // zhzay_mainRight_2: "zhzay_mainRight_2",
            // zhzay_mainRight_2_div: "#zhzay_mainRight_2",
            // //Middle end

            //页面布局数据
            serialization: null,
            //刷新页面内容
            setDivTypeName: function(obj) {
                var $this = this;
                var div_type = 'zhzay_colrow_';
                var div_name = '#zhzay_colrow_';
                var i = 0,
                    l = obj.length;
                for (; i < l; i++) {
                    var n = obj[i].id.split('_')[1];
                    $this[div_type + n] = div_type + n;
                    $this[div_type + n + '_div'] = div_name + n;
                    $this.setHomeDivView($this[div_type + n], $this[div_type + n + '_div'], null);
                }
            },

            inited: function() {
                var $this = this;
                /************************************************************************************************************************** */
                $this.serialization = [{
                    col: 1,
                    row: 1,
                    size_x: 2,
                    size_y: 3,
                    id: "colrow_0"
                }, {
                    col: 1,
                    row: 4,
                    size_x: 2,
                    size_y: 3,
                    id: "colrow_1"
                }, {
                    col: 1,
                    row: 7,
                    size_x: 2,
                    size_y: 3,
                    id: "colrow_2"
                }, {
                    col: 1,
                    row: 10,
                    size_x: 2,
                    size_y: 3,
                    id: "colrow_3"
                }, {
                    col: 3,
                    row: 1,
                    size_x: 4,
                    size_y: 7,
                    id: "colrow_4"
                }, {
                    col: 3,
                    row: 8,
                    size_x: 4,
                    size_y: 5,
                    id: "colrow_5"
                }, {
                    col: 7,
                    row: 1,
                    size_x: 2,
                    size_y: 4,
                    id: "colrow_6"
                }, {
                    col: 7,
                    row: 5,
                    size_x: 2,
                    size_y: 4,
                    id: "colrow_7"
                }, {
                    col: 7,
                    row: 9,
                    size_x: 2,
                    size_y: 4,
                    id: "colrow_8"
                }]

                var obj = {
                    widget_base_dimensions: ['auto', 68], //模块的宽高 [宽,高]
                    autogenerate_stylesheet: true,
                    min_cols: 1,
                    max_cols: 8,
                    min_rows: 1,
                    max_rows: 12,
                    widget_margins: [5, 5], //模块的间距 [上下,左右]
                    nomove: true //不能移动
                }
                $(function() {
                    //构建页面布局
                    setGridster_('ssg_main_body', obj, $this.serialization);
                });

                $this.setDivTypeName($this.serialization);

                /************************************************************************************************************************** */
                // $this.getHomeDivView();
                $this.leftbuttonInit();
            },
            //左侧按钮初始化
            leftbuttonInit: function() {
                var $this = this;
                var span_btn = document.getElementById('show_ssg_main_header_button_lists');
                var show_div = document.getElementById('ssg_main_header_button_lists');
                var show_div_li = '';
                //判断 getElementsByClassName 是否存在
                if (show_div.getElementsByClassName)
                    show_div_li = show_div.getElementsByClassName('ssg_main_header_button_list');
                else {
                    var result = [];
                    var tags = show_div.getElementsByTagName("*");
                    for (var i = 0, len = tags.length; i < len; i++) {
                        var classNames = tags[i].className.split(" ");
                        for (var j = 0, l = classNames.length; j < l; j++) {
                            if (classNames[j] === 'ssg_main_header_button_list') {
                                result.push(tags[i]);
                                break;
                            }
                        }
                    }
                    show_div_li = result;
                }

                span_btn.onclick = function() {
                    var show_div_dis = show_div.style.display;
                    if (show_div_dis == 'none') {
                        show_div.style.display = 'block';
                    }
                    if (show_div_dis == 'block') {
                        show_div.style.display = 'none';
                    }
                }
                var show_i = 0,
                    show_l = show_div_li.length;
                for (; show_i < show_l; show_i++) {
                    //每一个li的点击事件
                    show_div_li[show_i].onclick = function() {
                        var show_div_dis = show_div.style.display;
                        if (show_div_dis == 'block') {
                            show_div.style.display = 'none';
                        }
                        $("#zhzay_main_page_bigEvent_name").html($(this).find("a").html());
                        //						var all_cir_active = document.getElementsByClassName('ssg_main_header_button_list_cir');
                        //						for(var all_cir_active_i=0;all_cir_active_i<all_cir_active.length;all_cir_active_i++){
                        //							all_cir_active[all_cir_active_i].classList.remove('ssg_main_header_button_list_cir_active')
                        //						}
                        $('.ssg_main_header_button_list_cir').removeClass('ssg_main_header_button_list_cir_active');
                        $(this).find('.ssg_main_header_button_list_cir').addClass('ssg_main_header_button_list_cir_active');
                        //重新刷新首页
                        // $this.getHomeDivView();
                        $this.setDivTypeName($this.serialization);

                    }
                }
            },
            getHomeDivView: function() {
                var $this = this;
                $this.setHomeDivView($this.zhzay_mainLeft_1, $this.zhzay_mainLeft_1_div, null);
                $this.setHomeDivView($this.zhzay_mainLeft_2, $this.zhzay_mainLeft_2_div, null);
                $this.setHomeDivView($this.zhzay_mainLeft_3, $this.zhzay_mainLeft_3_div, null);
                $this.setHomeDivView($this.zhzay_mainLeft_4, $this.zhzay_mainLeft_4_div, null);
                $this.setHomeDivView($this.zhzay_mainMiddle_1, $this.zhzay_mainMiddle_1_div, null);
                $this.setHomeDivView($this.zhzay_mainMiddle_2, $this.zhzay_mainMiddle_2_div, null);
                $this.setHomeDivView($this.zhzay_mainRight_1, $this.zhzay_mainRight_1_div, null);
                $this.setHomeDivView($this.zhzay_mainRight_2, $this.zhzay_mainRight_2_div, null);
            },
            //设置首页div块的界面  param传json对象
            setHomeDivView: function(div_type, divName, param) {
                var $this = this;
                var data = {};
                data.div_type = div_type;
                var div = $(divName);
                if (param) {
                    for (var key in param) {
                        data[key] = param[key];
                    }
                }
                z.request({
                    url: window.WEB_ROOT_PATH + "/homeConfig/getSiteHomeDivView.do",
                    data: data,
                    dataType: "html",
                    success: function(args) {
                        div.html(args);
                    }
                }, true);
            }
        });
        z.getInstance("z.plugin.HomePlugin", null, "ssgHomePlugin");
    }
})(window, z, z.plugin, $);