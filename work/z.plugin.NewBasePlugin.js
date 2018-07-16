(function(window, z, plugin, $, undefined) {
    if (z && plugin && !plugin.NewBasePlugin) {
        z.setMembers(plugin, {
            NewBasePlugin: function() {
                plugin.BasePlugin.apply(this, arguments);
            }
        });
        z.inherit(plugin.BasePlugin, plugin.NewBasePlugin, {
            $xmType: null, // 系统类型
            loading_area: null, // 加载区域 (目前分为两种m1和m2)
            searchUrl: null, // 搜索链接
            searchDateUrl: null, // 高级查询的数据地址
            echartUrl: null, // 右侧图表连接
            headUrl: null, // m2头部链接
            rightModelUrl: null, // m2右边echart展示链接
            wlr_button: false, // 我录入的
            refName_data: null, // 记载数据的js名称
            refName_obj: null, // 记载数据的js对象
            $my_dataurl: null, // 我录入的数据链接
            $all_dataurl: null, // 所有的数据链接
            data_type: "my", //根据模块情况自己设置（默认为active）
            searchId: "header-center-search",
            searchDom: null,
            _inited: function(obj) {
                var $this = this;
                this.searchDom = $("#" + this.searchId);
                this.searchDom.html("");
                // 清空右边收缩栏菜单
                this.right_add([

                ]);
                if (typeof this.choose_ui_area == "function") {
                    this.choose_ui_area();
                }
                if (typeof this.searchFunction == "function") {
                    this.searchFunction();
                }
                if (typeof this.echartFunction == "function") {
                    this.echartFunction();
                }
                if (typeof this.init_page == "function") {

                    // 表格类展示模块 专用加载方法
                    if (this.loading_area == "m2") {
                        $this.headDom = $("#m2").find(".base-head");
                        $this.rightModelDom = $("#m2").find(".tubiao-box");

                        if ($this.headUrl != null && $this.headUrl != "") {
                            $this.loadPage($this.headDom, $this.headUrl, null, function() {

                                if (typeof $this.headHtmSuccess == "function") {
                                    $this.headHtmSuccess();
                                }

                                // 如果需要数据切换按钮
                                if ($this.wlr_button) {
                                    if (!$this.refName_obj) {
                                        $this.refName_obj = z.getInstance($this.refName_data); // 实例化对象
                                    }

                                    // 找到当前头部的录入数据开关按钮
                                    var $div = $this.headDom.find(".button-circle");
                                    if ($this.data_type == "my") {
                                        $div.parent().addClass('active');
                                    } else {
                                        $div.parent().removeClass('active');
                                    }
                                    $div.click(function() {
                                        var $obj = $(this);
                                        if ($obj.parent().hasClass('active')) {
                                            $obj.parent().removeClass('active');
                                            if ($this.refName_obj.$dataGrid) {
                                                $this.refName_obj.$dataGrid.datagrid({
                                                    url: $this.$all_dataurl
                                                });
                                            }
                                            $("#lrrOrgId_da").combotree({
                                                disabled: false
                                            });
                                            $("#inserterId_da").combobox({
                                                disabled: false
                                            });
                                            $this.data_type = "all";
                                        } else {
                                            $obj.parent().addClass('active');
                                            if ($this.refName_obj.$dataGrid) {
                                                $this.refName_obj.$dataGrid.datagrid({
                                                    url: $this.$my_dataurl
                                                });
                                            }
                                            $("#lrrOrgId_da").combotree("loadData", "");
                                            $("#lrrOrgId_da").combotree({
                                                disabled: true
                                            });
                                            $("#inserterId_da").combobox("setValue", "");
                                            $("#inserterId_da").combobox({
                                                disabled: true
                                            });
                                            $this.data_type = "my";
                                        }
                                    })
                                }
                            });
                        }

                        if ($this.rightModelUrl != null && $this.rightModelUrl != "") {
                            $this.loadPage($this.rightModelDom, $this.rightModelUrl, null, function() {
                                $('.date_select').riqixuanze();
                                var date_select = true;
                                $(".date_select_show").click(function() {

                                    $(".date_select").toggle(400);

                                    if (date_select) {
                                        $(this).children("i").html("&#xe68f;");
                                        date_select = false;
                                    } else {
                                        $(this).children("i").html("&#xe68e;");
                                        date_select = true;
                                    }

                                });

                                if (typeof $this.rightModelHtmSuccess == "function") {
                                    $this.rightModelHtmSuccess();
                                }
                            });
                        }

                    }
                    this.init_page(obj);
                }
                // 修复表格变形
                $(window).resize();
            },
            headHtmSuccess: null, // 头部加载成功事件
            rightModelHtmSuccess: null, // 头部加载成功事件
            init_page: null,
            // 选择加载界面区域调用方法
            choose_ui_area: function() {
                if (this.loading_area != null && this.loading_area != "") {
                    // $("#" + loading_area).html("");
                    $(".ui-area").css({
                        display: "none"
                    })
                    $("#" + this.loading_area).css({
                        display: "block"
                    })
                }
            },
            searchDateBefore: null, //高级查询前拼接searchDateUrl的方法
            gjsearchSuccess: null, //高级查询成功后的方法
            mhsearchSuccess: null, //模糊查询成功后的方法
            searchHtmSuccess: null, //查询界面加载成功后调用的事件
            // 加载收索框调用方法
            searchFunction: function() {
                var $this = this;
                $this.searchDom = $("#" + this.searchId);
                if (!$this.refName_obj && $this.refName_data) {
                    $this.refName_obj = z.getInstance($this.refName_data); // 实例化对象
                }
                if ($this.searchUrl == null || $this.searchUrl == "") {
                    $this.searchDom.empty();
                    $this.searchDom.hide();
                } else {
                    $this.searchDom.show();
                    // 加载搜索框
                    $this.loadPage($this.searchDom, $this.searchUrl, null, function() {
                        if (typeof $this.searchHtmSuccess == "function") {
                            $this.searchHtmSuccess();
                        }
                        $this.searchDom.find(".gj-search .mis-page-search-clear").click(function() {
                            $this.$searchForm = $this.searchDom.find(".gj-search");
                            $this.$searchForm.form("clear");
                        });
                        if ($this.searchDateUrl) {
                            $this.searchDom.find(".search-gj-button .search").click(function() {
                                var $element = $(".search-more");
                                $this.searchDom.find(".txt").val("");
                                if ($element.is(":hidden")) {
                                    $element.fadeIn();
                                } else {
                                    $element.fadeOut();
                                }
                            });
                        }
                        $this.searchDom.find(".gj-search .mis-page-search-submit").click(function() {
                            $this.$searchForm = $this.searchDom.find(".gj-search");
                            var $element = $(".search-more");
                            $element.fadeOut();
                            $(".search-more-icon").css("background-position", "-70px 355px");
                            if ($this.searchDateUrl && $this.searchDateUrl != "" && $this.refName_obj) { //如果高级查询地址存在的话就去查询数据
                                if (typeof $this.searchDateBefore == "function") {
                                    $this.searchDateBefore();
                                }
                                var serializeObj = {};
                                var array = $element.find("form").serializeArray();
                                $(array).each(function() {
                                    if (serializeObj[this.name]) {
                                        if ($.isArray(serializeObj[this.name])) {
                                            serializeObj[this.name].push(this.value);
                                        } else {
                                            serializeObj[this.name] = [serializeObj[this.name], this.value];
                                        }
                                    } else {
                                        serializeObj[this.name] = this.value;
                                    }
                                });
                                $this.refName_obj.$dataGrid.datagrid({
                                    url: $this.searchDateUrl,
                                    queryParams: serializeObj,
                                    onLoadSuccess: function() {
                                        if (typeof $this.gjsearchSuccess == "function") {
                                            $this.gjsearchSuccess();
                                        }
                                    }
                                });
                            }
                        });
                        //模糊查询按钮点击事件
                        $this.searchDom.find(".search-gj-button .btn").click(function() {
                            if ($this.searchDateUrl && $this.$all_dataurl && this.$all_dataurl != "" && $this.searchDom.find(".txt") && $this.refName_obj) {
                                $this.refName_obj.$dataGrid.datagrid({
                                    url: $this.$all_dataurl,
                                    queryParams: {
                                        queryContent: $this.searchDom.find(".txt").val()
                                    },
                                    onLoadSuccess: function() {
                                        if (typeof $this.mhsearchSuccess == "function") {
                                            $this.mhsearchSuccess();
                                        }
                                    }
                                });
                                if ($this.headDom && $this.headDom.find(".button-circle")) {
                                    var $div = $this.headDom.find(".button-circle");
                                    if ($this.data_type == "my" && $div.parent().hasClass('active')) {
                                        $div.parent().removeClass('active');
                                        $("#lrrOrgId_da").combotree({
                                            disabled: false
                                        });
                                        $("#inserterId_da").combobox({
                                            disabled: false
                                        });
                                        $this.data_type = "all";
                                    }
                                }
                                $this.searchDom.find(".gj-search").form("clear");
                            }
                        });
                    });
                }
            },
            // 加载右侧按钮调用方法
            right_add: function(obj) {
                var $hrul = $('#home-right>.home-right-body>ul');
                $hrul.html("");
                for (n in obj) {
                    var li = $('<li/>');
                    var div = $('<div/>');
                    var i = $('<i/>').addClass('iconfont');
                    var span = $('<span/>');
                    if (typeof(obj[n].href) != undefined && typeof(obj[n].name) != undefined && typeof(obj[n].icon) != undefined) {
                        div.attr({
                            'onclick': obj[n].href,
                            'title': obj[n].name
                        });
                        i.html(obj[n].icon);
                        span.html(obj[n].name);
                        div.append(i).append(span);
                        li.append(div);
                        $hrul.append(li);

                    } else {
                        console.log('第' + (n + 1) + '条数据不完整');
                    }
                }
                $('#home-right').removeClass('big middle none').addClass('middle');
            },
            // 加载右侧图表调用方法
            echartFunction: function() {
                var $this = this;
                $this.echartDom = $("#" + $this.loading_area).find(".tubiao-box");
                if ($this.echartUrl == null || $this.echartUrl == "") {
                    // 链接不存在的模块，直接清空图表区域
                    if ($this.echartDom) {
                        $this.echartDom.empty();
                    }
                } else {
                    $this.loadPage($this.echartDom, $this.echartUrl, null, function() {
                        // 之后在完善
                    });
                }
            },
            // 请求页面调用方法
            loadPage: function($page, url, data, callback, add_type) {
                $.messager.progress();
                var $this = this;
                z.request({
                    url: url,
                    dataType: "html",
                    data: data,
                    success: function(htm) {
                        // 根据指定的加载方式去加载界面
                        if (add_type == "append") {
                            $page.append($(htm));
                        } else {
                            $page.empty().html($(htm));
                        }

                        $.parser.parse($page);
                        if (typeof(callback) == "function") {
                            callback($page);
                        }
                        $.messager.progress('close');
                    },
                    error: function() {
                        $.messager.progress('close');
                    }
                });
            },
            // 绑定点击事件调用方法
            _bindClick: function($page, url, before_request, success_request, error_request) {
                if ($page) {
                    if ($page.find("mis-page-edit-save")) {
                        $page.find("mis-page-edit-save").click(function() {

                            var data = null;
                            if (typeof(before_request) == "function") {
                                var a = before_request();
                                if (a && a.data) {
                                    data = a.data;
                                }
                            }
                            z.request({
                                url: url,
                                dataType: "json",
                                data: data,
                                type: "POST",
                                success: function() {
                                    if (typeof(success_request) == "function") {
                                        success_request();
                                    }
                                },
                                error: function() {
                                    if (typeof(error_request) == "function") {
                                        error_request();
                                    }
                                }
                            })

                        })
                    }

                    if ($page.find("mis-page-edit-back")) {
                        $page.find("mis-page-edit-save").click(function() {
                            $page.dialog("close");
                        })
                    }
                }

            }
        });

    }
    z.getInstance("z.plugin.NewBasePlugin");
})(window, z, z.plugin, $);