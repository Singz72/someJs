(function(window, z, plugin, $, undefined) {
    if (z && plugin && !plugin.AjypPlugin) {
        z.setMembers(plugin, {
            AjypPlugin: function() {
                plugin.NewBasePlugin.apply(this, arguments);
            }
        });
        z.inherit(plugin.NewBasePlugin, plugin.AjypPlugin, {
            $page_url: "hzhczz/home/ajyp.do",
            $pxfs: "zxypsj_desc",
            $sxzt: "qb",
            $maximumWords: 800,
            $ypbg_Edit: null,
            $sjqx: "wfq",

            init_page: function(xq, id) {

                var $this = this,
                    $yp_wanjie = false,
                    $ypbg_page = false,
                    $yp_chexiao = false;

                // 加载command方法
                if (z.plugin.JqhsPagePlugin && z.plugin.JqhsPagePlugin.instance) {
                    z.plugin.JqhsPagePlugin.instance.addCommand();
                }
                $("#m1").html("");

                $("#m1").css({
                    display: "block",

                })

                $("#m2").css({
                    display: "none"
                })
                var div1 = $("#m1");

                $this.loadPage(div1, $this.$page_url, null, function(div1) {
                    // 设置平台代码参数
                    z.plugin.AgencyTaskPlugin.instance.$xmType = "hzhczz";
                    z.plugin.AjblPlugin.instance.$xmType = "hzhczz";
                    z.plugin.AjcbgxPlugin.instance.$xmType = "hzhczz";

                    // 排序点击事件
                    var $pageGroObj = z.plugin.AjPageGroPlugin.instance;
                    var $ypwjGroObj = z.plugin.AjYpwjPageGroPlugin.instance;
                    var $bgpageGroObj = z.plugin.YpbgPageGroPlugin.instance;
                    var $ypcxpageGroObj = z.plugin.AjYpCxPageGroPlugin.instance;
                    $(".paixu2-list li").click(function() {
                        var pxfs = $(this).attr("data-type");
                        $this.$pxfs = pxfs;
                        if ($(".active").find(".menu3-center").attr("name") == "ypwj") {
                            $ypwjGroObj.init_page();
                        } else if ($(".active").find(".menu3-center").attr("name") == "ypz") {
                            $pageGroObj.init_page();
                        } else {

                        }

                    })

                    // 筛选点击事件
                    $("#daishen0rwanjie-aj-list li").click(function() {
                        var sxzt = $(this).attr("data-type");
                        $this.$sxzt = sxzt;
                        $ypwjGroObj.init_page();
                    })

                    $("#myOrall-aj-list li").click(function() {
                        var sjqx = $(this).attr("data-type");
                        $this.$sjqx = sjqx;
                        if ($(".active").find(".menu3-center").attr("name") == "ypz") {
                            $pageGroObj.init_page();
                            // / console.log($(".menu3").find(".menu3-center").attr("name"));
                        } else if ($(".active").find(".menu3-center").attr("name") == "ypwj") {
                            $ypwjGroObj.init_page();
                        }

                    })

                    // var aaa = $("#index-mian").height() - $(".ajyp1-header").height() - $(".ajyp1-menu").height() - 44;
                    // $(".main-list-box").css("min-height", aaa);
                    //
                    // // 窗口resize事件
                    // $(window).resize(function () {
                    // var aaa = $("#index-mian").height() - $(".ajyp1-header").height() - $(".ajyp1-menu").height() - 44;
                    // $(".main-list-box").css("min-height", aaa);
                    // });

                    var div2 = $("#header-center-search");
                    var $url = "hzhczz/search/ajyp_search.do";
                    if (xq && xq == 'xq' && id) {
                        z.plugin.YpxxPlugin.instance.init_page(id);
                    }
                    div2.show();

                    // 加载搜索框
                    $this.loadPage(div2, $url, null, function(div2) {
                        div2.find(".gj-search .mis-page-search-clear").click(function() {
                            $this.$searchForm = div2.find(".gj-search");
                            $this.$searchForm.form("clear");
                        });
                        div2.find(".gj-search .mis-page-search-submit").click(function() {
                            $this.$searchForm = div2.find(".gj-search");
                            var $element = $(".search-more");
                            $element.fadeOut();
                            $(".search-more-icon").css("background-position", "-70px 355px");

                            var tabName = $(".menu3").find(".active").find(".menu3-center").attr("name")
                            var $GroObj = z.plugin.AjPageGroPlugin.instance;
                            if (tabName === "ypwj") {
                                $GroObj = z.plugin.AjYpwjPageGroPlugin.instance;
                            } else if (tabName === "ypcx") {
                                $GroObj = z.plugin.AjYpCxPageGroPlugin.instance;
                            }

                            $GroObj.$data = $this.$searchForm.serialize();
                            $GroObj.init_page();

                        });
                    });

                    // 加载右侧菜单栏
                    z.plugin.HomePlugin.instance.right_add([{
                        "href": "z.plugin.AgencyTaskPlugin.instance.synAjxx()",
                        "name": "研判发起",
                        "icon": "&#xe63c;"
                    }, {
                        "href": "z.plugin.ComfunctionPlugin.instance.showAjdaEdit()",
                        "name": "案件登记",
                        "icon": "&#xe606;"
                    }]);

                    $pageGroObj.$dataGrid = $("#ajyp1-main-list");
                    $pageGroObj.listItemHtmTemplete = $pageGroObj.$dataGrid.html();
                    $pageGroObj.$dataGrid.html("");
                    $pageGroObj.$data = {};

                    // 加载数据 分页器
                    $pageGroObj.init_page();
                    // tap标签页点击事件与加载数据
                    $(".menu3 li").click(function() {
                        $(this).addClass("active").siblings().removeClass("active");
                        // console.log($(this).find(".menu3-center").attr("name"));
                        if ($(this).find(".menu3-center").attr("name") == "ypwj") { // 研判完结的处理
                            $("#daishen0rwanjie-aj").show();
                            $("#myorall-aj").show();
                            $(".paixu").show();
                            if ($yp_wanjie) {
                                $("#ajyp1-main-list_ypz").hide();
                                $("#ajyp1-main-list_bg").hide();
                                $("#ajyp1-main-list_wj").show();

                            } else {
                                $ypwjGroObj.$dataGrid = $("#ajyp1-main-list2");
                                $ypwjGroObj.listItemHtmTemplete = $ypwjGroObj.$dataGrid.html();
                                $ypwjGroObj.$dataGrid.html("");
                                $ypwjGroObj.init_page();
                                $("#ajyp1-main-list_ypz").hide();
                                $("#ajyp1-main-list_bg").hide();
                                $("#ajyp1-main-list_cx").hide();
                                $("#ajyp1-main-list_wj").show();
                                $yp_wanjie = true;
                            }

                        } else if ($(this).find(".menu3-center").attr("name") == "ypz") { // 研判中的处理
                            $("#daishen0rwanjie-aj").hide();
                            $("#myorall-aj").show();

                            $(".paixu").show();
                            if ($("#ajyp1-main-list_ypz") != null) {
                                $("#ajyp1-main-list_bg").hide();
                                $("#ajyp1-main-list_cx").hide();
                                $("#ajyp1-main-list_wj").hide();
                                $("#ajyp1-main-list_ypz").show();

                            }
                        } else if ($(this).find(".menu3-center").attr("name") == "ypbg") {
                            $("#daishen0rwanjie-aj").hide();
                            $("#myorall-aj").hide();

                            $(".paixu").hide();
                            if (!$ypbg_page) {
                                $("#ajyp1-main-list_wj").hide();
                                $("#ajyp1-main-list_ypz").hide();
                                $("#ajyp1-main-list_cx").hide();
                                $("#ajyp1-main-list_bg").show();
                                $bgpageGroObj.init_page();
                                $ypbg_page = true;
                            } else {
                                $("#ajyp1-main-list_wj").hide();
                                $("#ajyp1-main-list_ypz").hide();
                                $("#ajyp1-main-list_cx").hide();
                                $("#ajyp1-main-list_bg").show();

                            }

                        } else if ($(this).find(".menu3-center").attr("name") == "ypcx") {

                            $("#daishen0rwanjie-aj").hide();
                            $("#myorall-aj").hide();
                            $(".paixu").hide();
                            if (!$yp_chexiao) {
                                $("#ajyp1-main-list_wj").hide();
                                $("#ajyp1-main-list_ypz").hide();
                                $("#ajyp1-main-list_bg").hide();
                                $("#ajyp1-main-list_cx").show();
                                $ypcxpageGroObj.init_page();
                                $yp_chexiao = true;
                            } else {
                                $("#ajyp1-main-list_wj").hide();
                                $("#ajyp1-main-list_ypz").hide();
                                $("#ajyp1-main-list_bg").hide();
                                $("#ajyp1-main-list_cx").show();

                            }

                        }
                    });

                });

            },
            searchMore: function() {
                var $this = this;
                var $element = $(".search-more");
                if ($element.is(":hidden")) {

                    $element.fadeIn();
                    $(".search-more-icon").css("background-position", "-95px 355px");
                } else {

                    $element.fadeOut();
                    $(".search-more-icon").css("background-position", "-70px 355px");
                }
            },
            mh_query: function() {
                var content = $("#ajyp_content_search").val();
                var tabName = $(".menu3").find(".active").find(".menu3-center").attr("name")
                var $pageGroObj = z.plugin.AjPageGroPlugin.instance;
                if (tabName === "ypwj") {
                    $pageGroObj = z.plugin.AjYpwjPageGroPlugin.instance;
                } else if (tabName === "ypcx") {
                    $pageGroObj = z.plugin.AjYpCxPageGroPlugin.instance;
                }
                $pageGroObj.$data = {
                    queryContent: content
                }
                $pageGroObj.init_page();
            },
            loadPage: function($page, url, data, callback) {
                $.messager.progress();
                var $this = this;
                z.request({
                    url: url,
                    dataType: "html",
                    data: data,
                    success: function(htm) {
                        $page.empty();
                        $page.html($(htm));
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
            laodYpBg_Editpage: function(id) {

                var $this = this;
                z.request({
                    url: "hzhczz/ypcz/ypbg_edit_page.do",
                    dataType: "html",
                    data: {
                        id: id,
                        ypTy: 'AjypPlugin'
                    },
                    success: function(html) {

                        $("#ypbg_edit_page").html(html);
                        $("#ypbg_edit_page").dialog("open");
                        $this.$ypbg_Edit = UE.getEditor($("script[id^='ajypbgxxnr_editor_']").attr("id"), {
                            maximumWords: $this.$maximumWords,
                            // scaleEnabled: true
                            // 是否可以拉伸长高，默认false(当开启时，自动长高失效)
                        });
                        $.parser.parse($("#ypbg_edit_page"));
                    }
                });
                var $ajypWjPageGroObj = z.plugin.ajypwjPageGroPlugin.instance;
                $ajypWjPageGroObj.init_page();

            },
            closeYpbg_edit_pageDialog: function() {
                $("#ypbg_edit_page").dialog('close');
            },
            SaveYpbg: function(ajxx_id) {
                var $this = this;

                var ypbgxxnr = $this.$ypbg_Edit.getContentTxt();
                var content_len = $this.$ypbg_Edit.getContentLength(true);
                if (content_len <= 0) {
                    $this.hook.alert("会商内容不能为空！");
                    return;
                } else if (content_len > $this.$maximumWords) {
                    $this.hook.alert("会商内容字数不能超过" + $this.$maximumWords + "！");
                    return;
                }
                z.request({
                    url: "hzhczz/ypcz/ypbg_save.json",
                    dataType: "json",
                    data: {
                        id: ajxx_id,
                        ypbgxxnr: ypbgxxnr
                    },
                    success: function(data) {
                        $this.hook.alert(data.message);
                        $("#ypbg_edit_page").dialog('close');
                    }
                });
                var $ypwjGroObj = z.plugin.AjYpwjPageGroPlugin.instance;
                $ypwjGroObj.init_page();
            },
            laodYpBg: function(id) {
                z.request({
                    url: "hzhczz/ypcz/ypbg_get.do",
                    dataType: "html",
                    data: {
                        id: id
                    },
                    success: function(html) {
                        $("#yanPanBaoGao_show").html(html);
                        $("#yanPanBaoGao_show").dialog('open');

                        $.parser.parse($("#yanPanBaoGao_show"));
                    }

                })
            },
            exportHyjy: function(id, type) {
                window.location.href = "hzhczz/ajbl/export.do?itemId=" + id + "&type=" + type + "&M=" + Math.random();
            },

        });
    }
    z.getInstance("z.plugin.AjypPlugin");
})(window, z, z.plugin, $);