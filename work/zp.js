(function(window, z, plugin, $, undefined) {
    if (z && plugin && !plugin.AjPageGroPlugin) {
        z.setMembers(plugin, {
            AjPageGroPlugin: function() {
                plugin.BasePlugin.apply(this, arguments);
            }
        });
        z.inherit(plugin.BasePlugin, plugin.AjPageGroPlugin, {
            refName: "z.plugin.AjPageGroPlugin.instance",
            pageDom: null,
            $dataGrid: $('#ajyp1-main-list'),
            $data: {},
            listItemHtmTemplete: $('#ajyp1-main-list').html(),
            init_page: function(callback) {
                var $this = this;
                $this.$callback = callback;
                // $.messager.progress();

                var $obj = z.plugin.AjypPlugin.instance;
                var data_copy = {

                };
                if (typeof $this.$data != 'object') {
                    $this.$data = $this.$data.toJson();
                }

                $this.$data.isYp = "true";
                $this.$data.sjqx = "";

                if ($obj.$sjqx) {
                    $this.$data.sjqx = $obj.$sjqx;
                }

                // 排序方式
                if ($obj.$pxfs == "zxypsj_desc") {
                    $this.$data.sort = "ypfqzxTime";
                    $this.$data.order = "desc";
                } else if ($obj.$pxfs == "fqsj_asc") {
                    $this.$data.sort = "djTime";
                    $this.$data.order = "asc";
                } else if ($obj.$pxfs == "fqsj_desc") {
                    $this.$data.sort = "djTime";
                    $this.$data.order = "desc";
                } else {
                    $this.$data.sort = "ypfqzxTime";
                    $this.$data.order = "desc";
                }

                if ($(".active").find(".menu3-center").attr("name") == "ypz") {
                    $this.$data.szjdCode = "2";

                } else if ($(".active").find(".menu3-center").attr("name") == "ypwj") {
                    $this.$data.szjdCode = "4";
                }

                data_copy = $this.$data;
                data_copy.rows = $this.rows; // 动态变量不能放在$data里面

                function installAll(data) {
                    var Data = parseInt(data.total);

                    $this.pageInstall(data);
                    // 分页控件初始化
                    $('#pageGro_ajyp').pagination({
                        total: Data,
                        pageSize: $this.rows,
                        pageNumber: $this.curentpage,
                        layout: [
                            'list', 'sep', 'first', 'prev', 'links', 'next', 'last', 'sep', 'refresh'
                        ],
                        pageList: [
                            $this.rows_copy, 2 * $this.rows_copy
                        ],
                        onSelectPage: function(pageNumber, pageSize) {
                            $.messager.progress();
                            $this.rows = pageSize;
                            $this.curentpage = pageNumber;
                            $this.pageInstall();
                        },
                        onRefresh: function(pageNumber, pageSize) {
                            $.messager.progress();
                            $this.rows = pageSize;
                            $this.curentpage = pageNumber;
                            $this.pageInstall();
                        },
                        onChangePageSize: function(pageSize) {
                            $.messager.progress();
                            $this.rows = pageSize;
                            $this.pageInstall();
                        }
                    });

                }
                var D = {
                    total: 2,
                    rows: [{
                            index: 'A',
                            ypq: 'A',
                            id: 'A',
                            ajyps: 'A',
                            tlq: 'A',
                            ajtls: 'a',
                            jqhs: false,
                            hsq: 'A',
                            ajhss: '11'
                        },
                        {
                            index: 'B',
                            ypq: 'B',
                            id: 'B',
                            ajyps: 'B',
                            tlq: 'B',
                            ajtls: 'b',
                            jqhs: false,
                            hsq: 'B',
                            ajhss: '22'
                        }
                    ]
                }
                installAll(D)
            },
            rows: 10,
            rows_copy: 10,
            curentpage: 1,
            pageCount: 1, // 总页数
            pageInit: function() {
                var $this = this;
                // 生成分页按钮
                if ($this.pageCount > 5) {
                    $this.page_icon(1, 5, 0);
                } else {
                    $this.page_icon(1, $this.pageCount, 0);
                }

                // 点击分页按钮触
                $("#pageGro_ajyp").on("click", "li", function() {
                    var pageNum = parseInt($(this).html()); // 获取当前页数
                    $this.curentpage = pageNum;
                    if ($this.pageCount > 5) {

                        $this.pageGroup(pageNum, $this.pageCount);
                    } else {
                        $(this).addClass("on");
                        $(this).siblings("li").removeClass("on");
                    }
                    $this.pageInstall();
                });

                // 点击上一页触发
                $("#pageGro_ajyp .pageUp").click(function() {
                    if ($this.pageCount > 5) {
                        var pageNum = parseInt($("#pageGro_ajyp li.on").html()); // 获取当前页
                        //
                        $this.curentpage = pageNum - 1;
                        $this.pageUp(pageNum, $this.pageCount);
                    } else {
                        var index = $("#pageGro_ajyp ul li.on").index(); // 获取当前页
                        if (index >= 1) {
                            $this.curentpage = index;
                        }
                        if (index > 0) {
                            $("#pageGro_ajyp li").removeClass("on"); // 清除所有选中
                            $("#pageGro_ajyp ul li").eq(index - 1).addClass("on"); // 选中上一页
                        }
                    }
                    $this.pageInstall();
                });

                // 点击下一页触发
                $("#pageGro_ajyp .pageDown").click(function() {
                    if ($this.pageCount > 5) {
                        var pageNum = parseInt($("#pageGro_ajyp li.on").html()); // 获取当前页
                        if (pageNum < $this.pageCount) {
                            $this.curentpage = pageNum + 1;
                        }
                        $this.pageDown(pageNum, $this.pageCount);
                    } else {
                        var index = $("#pageGro_ajyp ul li.on").index(); // 获取当前页
                        if (index + 2 <= $this.pageCount) {
                            $this.curentpage = index + 2;
                        }
                        if (index + 1 < $this.pageCount) {
                            $("#pageGro_ajyp li").removeClass("on"); // 清除所有选中
                            $("#pageGro_ajyp ul li").eq(index + 1).addClass("on"); // 选中上一页
                        }
                    }
                    $this.pageInstall();
                });

            },
            // 生成分页按钮

            // 点击跳转页面
            pageGroup: function(pageNum, pageCount) {
                var $this = this;
                switch (pageNum) {
                    case 1:
                        $this.page_icon(1, 5, 0);
                        break;
                    case 2:
                        $this.page_icon(1, 5, 1);
                        break;
                    case pageCount - 1:
                        $this.page_icon(pageCount - 4, pageCount, 3);
                        break;
                    case pageCount:
                        $this.page_icon(pageCount - 4, pageCount, 4);
                        break;
                    default:
                        $this.page_icon(pageNum - 2, pageNum + 2, 2);
                        break;
                }
            },

            // 根据当前选中页生成页面点击按钮
            page_icon: function(page, count, eq) {
                var $this = this;
                var ul_html = "";
                for (var i = page; i <= count; i++) {
                    ul_html += "<li>" + i + "</li>";
                }
                $("#pageGro_ajyp ul").html(ul_html);
                $("#pageGro_ajyp ul li").eq(eq).addClass("on");
            },
            // 上一页
            pageUp: function(pageNum, pageCount) {
                var $this = this;
                switch (pageNum) {
                    case 1:
                        break;
                    case 2:
                        $this.page_icon(1, 5, 0);
                        break;
                    case pageCount - 1:
                        $this.page_icon(pageCount - 4, pageCount, 2);
                        break;
                    case pageCount:
                        $this.page_icon(pageCount - 4, pageCount, 3);
                        break;
                    default:
                        $this.page_icon(pageNum - 2, pageNum + 2, 1);
                        break;
                }

            },
            // 下一页
            pageDown: function(pageNum, pageCount) {
                var $this = this;
                switch (pageNum) {
                    case 1:
                        $this.page_icon(1, 5, 1);
                        break;
                    case 2:
                        $this.page_icon(1, 5, 2);
                        break;
                    case pageCount - 1:
                        $this.page_icon(pageCount - 4, pageCount, 4);
                        break;
                    case pageCount:
                        break;
                    default:
                        $this.page_icon(pageNum - 2, pageNum + 2, 3);
                        break;
                }
            },
            pageInstall: function(datagrid) {
                console.log(datagrid)
                var $this = this;
                $this.$dataGrid.html("1");
                if (datagrid != null && datagrid.rows != null && datagrid.rows.length > 0) {
                    var html = "";
                    for (var i = 0, l = datagrid.rows.length; i < l; i++) {
                        if (datagrid.rows[i] != null) {
                            datagrid.rows[i].index = i + 1;

                            // 研判区 讨论区 会商区
                            datagrid.rows[i].ypq = "<li class=\"li1\"><span>研判区</span><b class=\"yanpan\">" +
                                datagrid.rows[i].ajyps +
                                "</b></li>";
                            datagrid.rows[i].tlq = "<li class=\"li2\"><span>讨论区</span><b class=\"taolun\">" +
                                datagrid.rows[i].ajtls +
                                "</b></li>";
                            if (datagrid.rows[i].jqhs == false) {
                                datagrid.rows[i].hsq = "<li class=\"li3\"><span>会商区</span><b class=\"huishang\">" +
                                    (datagrid.rows[i].ajhss ? datagrid.rows[i].ajhss : "0") +
                                    "</b></li>";
                            } else {
                                datagrid.rows[i].hsq = "";
                            }

                            // 案件研判次数，如果不是第1次 就显示 xx次研判
                            if (datagrid.rows[i].ajypcs != null && datagrid.rows[i].ajypcs != "") {
                                if (Number(datagrid.rows[i].ajypcs) > 1) {
                                    datagrid.rows[i].ypcs = "[" + z.plugin.SetUtilsPlugin.instance.convertToChinese(datagrid.rows[i].ajypcs) +
                                        "次研判]";
                                } else {
                                    datagrid.rows[i].ypcs = "";
                                }
                            } else {
                                datagrid.rows[i].ajypcs = "";
                            }

                            if (datagrid.rows[i].hcypqqtg != null) {
                                if (datagrid.rows[i].hcypqqtg == "ypqqtg") {
                                    datagrid.rows[i].status = '<span style="color:red">研判请求已通过</span>';
                                } else if (datagrid.rows[i].hcypqqtg == "sqth") {
                                    datagrid.rows[i].status = '<span style="color:red">研判请求退回中</span>';
                                } else {
                                    datagrid.rows[i].status = '<span style="color:red">已发起研判请求</span>';
                                }
                            } else {
                                datagrid.rows[i].status = '';
                            }
                            // 判断是的有研判报告
                            if (datagrid.rows[i].ypBgZt != null) {
                                if (datagrid.rows[i].ypBgZt) {
                                    datagrid.rows[i].ypBgZt = "<div class='yp_hyjy'><div class='huiyi'>研判</div><div class='jiyao'>报告</div></div>";
                                } else {
                                    datagrid.rows[i].ypBgZt = "<div class='yp_hyjy2'><div class='huiyi'>研判</div><div class='jiyao'>报告</div>" +
                                        "<i class='iconfont'></i></div>";
                                }
                            } else {
                                datagrid.rows[i].ypBgZt = "<div class='yp_hyjy2'><div class='huiyi'>研判</div><div class='jiyao'>报告</div>" +
                                    "<i class='iconfont'></i></div>";
                            }
                            html += z.replace(datagrid.rows[i], $this.listItemHtmTemplete, "item");
                        }
                    }
                    $this.$dataGrid.html(html);
                } else {
                    this.initData();
                }
                // $.messager.progress('close');
            },
            /**
             * 案件研判信息列表
             */
            initData: function() {
                console.log(1)
                var $this = this;
                $this.$dataGrid.html("");
                // $.messager.progress();

                var data_copy = {

                };
                if (typeof $this.$data == 'object') {
                    data_copy = $this.$data;
                    data_copy.rows = $this.rows;
                    data_copy.page = $this.curentpage;
                } else {
                    data_copy = $this.$data;
                    data_copy += "&page=" + $this.curentpage + "&rows=" + $this.rows;
                }

                // $this.$data.page = $this.curentpage;
                z.request({
                    url: "hzhczz/agencytask/datagrid.json",
                    dataType: "json",
                    data: data_copy,
                    success: function(datagrid) {
                        var html = "";
                        for (var i = 0, l = datagrid.rows.length; i < l; i++) {
                            if (datagrid.rows[i] != null) {
                                datagrid.rows[i].index = i + 1 + ($this.curentpage - 1) * $this.rows;

                                // 研判区 讨论区 会商区
                                datagrid.rows[i].ypq = "<li class=\"li1\" ><span>研判区</span><b class=\"yanpan\">" +
                                    datagrid.rows[i].ajyps +
                                    "</b></li>";
                                datagrid.rows[i].tlq = "<li class=\"li2\" ><span>讨论区</span><b class=\"taolun\">" +
                                    datagrid.rows[i].ajtls +
                                    "</b></li>";
                                if (datagrid.rows[i].jqhs == false) {
                                    datagrid.rows[i].hsq = "<li class=\"li3\" ><span>会商区</span><b class=\"huishang\">" +
                                        (datagrid.rows[i].ajhss ? datagrid.rows[i].ajhss : "0") +
                                        "</b></li>";
                                } else {
                                    datagrid.rows[i].hsq = "";
                                }

                                // 案件研判次数，如果不是第1次 就显示 xx次研判
                                if (datagrid.rows[i].ajypcs != null && datagrid.rows[i].ajypcs != "") {
                                    if (Number(datagrid.rows[i].ajypcs) > 1) {
                                        datagrid.rows[i].ypcs = "[" + z.plugin.SetUtilsPlugin.instance.convertToChinese(datagrid.rows[i].ajypcs) +
                                            "次研判]";
                                    } else {
                                        datagrid.rows[i].ypcs = "";
                                    }
                                } else {
                                    datagrid.rows[i].ajypcs = "";
                                }

                                if (datagrid.rows[i].hcypqqtg != null) {
                                    if (datagrid.rows[i].hcypqqtg == "ypqqtg") {
                                        datagrid.rows[i].status = '<span style="color:red">研判请求已通过</span>';
                                    } else if (datagrid.rows[i].hcypqqtg == "sqth") {
                                        datagrid.rows[i].status = '<span style="color:red">研判请求退回中</span>';
                                    } else {
                                        datagrid.rows[i].status = '<span style="color:red">已发起研判请求</span>';
                                    }
                                } else {
                                    datagrid.rows[i].status = '';
                                }
                                // 判断是的有研判报告
                                if (datagrid.rows[i].ypBgZt != null) {
                                    if (datagrid.rows[i].ypBgZt) {
                                        datagrid.rows[i].ypBgZt = "<div class='yp_hyjy'><div class='huiyi'>研判</div><div class='jiyao'>报告</div></div>";
                                    } else {
                                        datagrid.rows[i].ypBgZt = "<div class='yp_hyjy2'><div class='huiyi'>研判</div><div class='jiyao'>报告</div>" +
                                            "<i class='iconfont'></i></div>";
                                    }
                                } else {
                                    datagrid.rows[i].ypBgZt = "<div class='yp_hyjy2'><div class='huiyi'>研判</div><div class='jiyao'>报告</div>" +
                                        "<i class='iconfont'></i></div>";
                                }

                                html += z.replace(datagrid.rows[i], $this.listItemHtmTemplete, "item");
                            }
                        }
                        $this.$dataGrid.html(html);
                        $.messager.progress('close');
                    }
                })
            }

        });
        z.getInstance("z.plugin.AjPageGroPlugin", null, "AjPageGroPlugin");
        AjPageGroPlugin.init_page();
    }
})(window, z, z.plugin, $);