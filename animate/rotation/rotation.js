/***********************轮播js*********************************/


var D_rotation = {
    rotation: 'rotation', //获取类名为rotation的id
    aRotation: 'rotation_content', //获取类名为rotation_content的id
    oNext: 'rotation_next', //获取类名为rotation_next的id
    Oprev: 'rotation_prev', //获取类名为rotation_prev的id
    siteTitle: 'site_category_bar_header_title', //获取类名为site_category_bar_header_title的id
    title: [],
    timerNextPage: '', //翻页时间
    Aswitch: '', //控制竖向是否滚动，控制横向是否自动滚动
}
var rotation = {

    /*轮播结构
     * 包含这个div结构的上级需要样式 position：relative之类的来限制ab；
<div class="rotation" id="rotation">
<div id="rotation_content" class="rotation_content">
    <!-- 滚动的对象 -->
    <div class="rotation_banner">
        <!-- 隐藏的辖区名称 -->
        <input type="hidden" value="${key}" name="sitePerson_siteOrg_hidden_title" />
        <div class="rotation_banner_i">
            <!-- 插入内容 -->
        </div>
    </div>
</div>
<div class="rotation_prev rotation_icon" id="rotation_prev"></div>
<div class="rotation_next rotation_icon" id="rotation_next"></div>
</div>*/

    rotationFun: function(D) {
        var atitle = D.title;
        var notitle;
        var atitle;
        var timerNextPage = '';
        //有小标题或者没有
        if (!atitle) {
            notitle = false;
        } else {
            notitle = true;
            var acitytitle = $("#" + D.siteTitle); //小标题
            acitytitle.html(atitle[0]);
        }
        if (!D.hasOwnProperty("timerNextPage")) {
            timerNextPage = 5000;
        } else {
            if (D.timerNextPage == '' || !D.timerNextPage) {
                timerNextPage = 5000;
            } else {
                timerNextPage = D.timerNextPage;
            }
        }

        //上移动画-->
        var oBody = $("#" + D.rotation)[0]; //鼠标移入移出对象

        var aRotation = $("#" + D.aRotation); //滚条对象
        var aBanner = $('#' + D.aRotation + ' .rotation_banner'); //内容 
        var oNext = $("#" + D.oNext)[0]; //下一页
        var Oprev = $("#" + D.Oprev)[0]; //上一页

        var aRotation_height = aRotation.height();
        var aBanneri = $('#' + D.aRotation + ' .rotation_banner_i');
        var aBanneri_l = aBanneri.length;
        aBanneri.height(aRotation_height) //内容框

        var num = 0; //锁定当前图片
        var l = aBanner.length;
        //隐藏所有div
        for (var i = 0; i < l; i++) {
            aBanner[i].style.display = 'none';
        }
        aBanner[0].style.display = 'block';
        aBanner[0].style.opacity = "1";
        aBanner[0].setAttribute("class", "rotation_banner rotation_on");

        var timerTop = null; //上移计时器
        var timerLeftright = null; //下一页计时器
        var timerRemake = null; //重启动画计时器


        //动画启动
        function startAnimate() {
            var bDiv_height;
            var bDiv = $('#' + D.aRotation + ' .rotation_on')
            var bDiv_height = bDiv.height();
            //        	var bDiv_height = aBanneri_l*aRotation_height;


            if (aRotation_height < bDiv_height) {

                //上移动化内部函数
                if (D.Aswitch) {
                    //不自动上下滚动
                    return
                }
                var h = Math.round(bDiv_height - aRotation_height);
                timerTop = setTimeout(function() {
                    var scroll_height = aRotation[0].scrollTop;
                    if (Math.round(scroll_height) < h) {
                        aRotation[0].scrollTop += aRotation_height;
                        startAnimate();
                    } else {
                        clearTimeout(timerTop);
                        timerLeftright = setTimeout(TimeToNext, timerNextPage); //下一页
                    }
                }, timerNextPage)
            } else {
                //直接左右翻转动画
                if (D.Aswitch) {
                    //不自动翻转
                    return
                }
                clearTimeout(timerTop);
                clearTimeout(timerLeftright);
                aRotation[0].scrollTop = 0;
                timerLeftright = setTimeout(TimeToNext, timerNextPage);

            }
        }
        clearTimeout(timerTop);
        clearTimeout(timerLeftright);
        startAnimate();


        oNext.onclick = function() { //按下图片切换到后一张
            clearTimeout(timerTop);
            var i = 0;
            for (; i < l; i++) {
                if (aBanner[i].className == "rotation_banner rotation_on") {
                    var bDiv = $('#' + D.aRotation + ' .rotation_on')
                    aRotation[0].scrollTop = 0;
                    aBanner[i].setAttribute("class", "rotation_banner");
                    aBanner[i].style.opacity = "0";
                    aBanner[i].style.display = 'none';
                    i++;
                    num++;
                    if (num > l - 1) {
                        num = 0
                    }
                    if (i > l - 1) {
                        i = 0;
                    }
                    if (notitle) {
                        acitytitle.html(atitle[num]);
                    }
                    aBanner[i].style.display = 'block';
                    aBanner[i].setAttribute("class", "rotation_banner rotation_on");
                    aBanner[i].style.opacity = "1";
                }
            }
            clearTimeout(timerTop);
            startAnimate();
        }

        Oprev.onclick = function() { //按下图片切换到前一张
            clearTimeout(timerTop);
            var i = 0;
            for (; i < l; i++) {
                if (aBanner[i].className == "rotation_banner rotation_on") {
                    var bDiv = $('#' + D.aRotation + ' .rotation_on')
                    aRotation[0].scrollTop = 0;
                    aBanner[i].setAttribute("class", "rotation_banner");
                    aBanner[i].style.opacity = "0";
                    aBanner[i].style.display = 'none';
                    i--;
                    num--;
                    if (num < 0) {
                        num = l - 1
                    }
                    if (i < 0) {
                        i = l - 1;
                    }
                    if (notitle) {
                        acitytitle.html(atitle[num]);
                    }

                    aBanner[i].style.display = 'block';
                    aBanner[i].setAttribute("class", "rotation_banner rotation_on");
                    aBanner[i].style.opacity = "1";
                }
            }
            clearTimeout(timerTop);
            startAnimate();
        }

        //自动向下一页转换
        function showhide(num) {
            var i = 0;
            for (; i < l; i++) {
                aBanner[i].setAttribute("class", "rotation_banner");
                aBanner[i].style.opacity = "0";
                aBanner[i].style.display = 'none';
            }
            aBanner[num].style.display = 'block';
            aBanner[num].setAttribute("class", "rotation_banner rotation_on");
            aBanner[num].style.opacity = "1";

            clearTimeout(timerLeftright);
            clearTimeout(timerTop);
            aRotation[0].scrollTop = 0;
            startAnimate();
        }

        function TimeToNext() { /*设置定时器运行的函数*/
            num++;
            if (num < l) {
                if (notitle) {
                    acitytitle.html(atitle[num]);
                }
                showhide(num);
            } else {
                num = 0;
                if (notitle) {
                    acitytitle.html(atitle[num]);
                }
                showhide(num);
            }
        }

        oBody.onmouseover = function() { /*鼠标引入，清除定时器，轮播图停止*/
            clearTimeout(timerTop);
            clearTimeout(timerLeftright);
        };
        oBody.onmouseout = function() { /*鼠标移出，重新调用定时器，轮播图开始*/
            clearTimeout(timerTop);
            clearTimeout(timerLeftright);
            startAnimate();
        };

        //停止动画，并且使其回到顶部,根据传入时间重启动画
        function toTopFun(Time) {
            clearTimeout(timerTop);
            clearTimeout(timerLeftright);
            clearTimeout(timerRemake);
            aRotation[0].scrollTop = 0;

            timerRemake = setTimeout(function() {
                startAnimate();
            }, Time)
        }

        return toTopFun;
    }
}