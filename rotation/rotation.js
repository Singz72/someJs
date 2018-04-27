
    var D = {
        rotation:'rotation',//获取类名为rotation的id
        aRotation:'rotation_content',//获取类名为rotation_content的id
        oNext:'rotation_next',//获取类名为rotation_next的id
        Oprev:'rotation_prev',//获取类名为rotation_prev的id
        siteTitle:'site_category_bar_header_title',//获取类名为site_category_bar_header_title的id
        title:[]
    }
var rotation={
		
    /*轮播结构
    <div class="rotation" id="rotation">
        <div id="rotation_content" class="rotation_content">
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
    
    rotationFun:function(D){
        var atitle = D.title,notitle,atitle;
        //有小标题或者没有
        if(!atitle){
            notitle = false;
        }else{
            notitle = true;
            var acitytitle = $("#"+D.siteTitle);//小标题
            acitytitle.html(atitle[0]);
        }

        //上移动画-->
        var oBody = $("#"+D.rotation)[0];//鼠标移入移出对象

        var aRotation = $("#"+D.aRotation);//滚条对象
        var aBanner = aRotation.find('.rotation_banner');//内容 
        var oNext = $("#"+D.oNext)[0];//下一页
        var Oprev = $("#"+D.Oprev)[0];//上一页

        var aRotation_height = aRotation.height();
        var aBanneri = aBanner.find('.rotation_banner_i');
        aBanneri.height(aRotation_height)//内容框

        var num = 0;//锁定当前图片
        var l = aBanner.length;
        //隐藏所有div
        for(var i = 0;i<l;i++){
            aBanner[i].style.display='none';
        }
        aBanner[0].style.display = 'block';
        aBanner[0].style.opacity = "1";
        aBanner[0].classList.add('rotation_on')

        var timerTop;//上移计时器
        var timerLeftright;//下一页计时器

        //动画启动
        function startAnimate() {
            var bDiv = $('.rotation_on')
            var bDiv_height = bDiv.height();
            if (aRotation_height < bDiv_height) {
                var h = bDiv_height - aRotation_height;
                timerTop = setInterval(function() {
                    var scroll_height = aRotation[0].scrollTop;
                    if (Math.round(scroll_height) < h) {
                        aRotation[0].scrollTop += aRotation_height;
                    } else {
                        clearInterval(timerTop);
                        timerLeftright = setInterval(TimeToNext, 5000);
                    }
                }, 5000)
            } else {
                clearInterval(timerTop);
                clearInterval(timerLeftright);
                aRotation[0].scrollTop = 0;
                timerLeftright = setInterval(TimeToNext, 4000);
            }
        }
        clearInterval(timerTop);
        startAnimate();

        oNext.onclick = function() { //按下图片切换到后一张
            clearInterval(timerTop);
            var i = 0;
            for (; i < l; i++) {
                if (aBanner[i].className == "rotation_banner rotation_on") {
                    var bDiv = $('.rotation_on')
                    aRotation[0].scrollTop = 0;
                    aBanner[i].classList.remove("rotation_on");
                    aBanner[i].style.opacity = "0";
                    aBanner[i].style.display='none';
                    i++;
                    num++;
                    if (num > l - 1) {
                        num = 0
                    }
                    if (i > l - 1) {
                        i = 0;
                    }
                    if(notitle){
                        acitytitle.html(atitle[num]);
                    }
                    aBanner[i].style.display='block';
                    aBanner[i].classList.add("rotation_on");
                    aBanner[i].style.opacity = "1";
                }
            }
            clearInterval(timerTop);
            startAnimate();
        }

        Oprev.onclick = function() { //按下图片切换到前一张
            clearInterval(timerTop);
            var i = 0;
            for (; i < l; i++) {
                if (aBanner[i].className == "rotation_banner rotation_on") {
                    var bDiv = $('.rotation_on')
                    aRotation[0].scrollTop = 0;
                    aBanner[i].classList.remove("rotation_on");
                    aBanner[i].style.opacity = "0";
                    aBanner[i].style.display='none';
                    i--;
                    num--;
                    if (num < 0) {
                        num = l - 1
                    }
                    if (i < 0) {
                        i = l - 1;
                    }
                    if(notitle){
                        acitytitle.html(atitle[num]);
                    }

                    aBanner[i].style.display='block';
                    aBanner[i].classList.add("rotation_on");
                    aBanner[i].style.opacity = "1";
                }
            }
            clearInterval(timerTop);
            startAnimate();
        }

        //自动向下一页转换
        function showhide(num) {
            var i = 0;
            for (; i < l; i++) {
                console.log(aBanner[i])
                aBanner[i].classList.remove("rotation_on");
                aBanner[i].style.opacity = "0";
                aBanner[i].style.display='none';
            }
            aBanner[num].style.display='block';
            aBanner[num].classList.add("rotation_on");
            aBanner[num].style.opacity = "1";

            clearInterval(timerLeftright);
            clearInterval(timerTop);
            aRotation[0].scrollTop = 0;
            startAnimate();
        }

        function TimeToNext() { /*设置定时器运行的函数*/
            num++;
            if (num < l) {
                if(notitle){
                    acitytitle.html(atitle[num]);
                }
                showhide(num);
            } else {
                num = 0;
                if(notitle){
                    acitytitle.html(atitle[num]);
                }
                showhide(num);
            }
        }

        oBody.onmouseover = function() { /*鼠标引入，清除定时器，轮播图停止*/
            clearInterval(timerTop);
        };
        oBody.onmouseout = function() { /*鼠标移出，重新调用定时器，轮播图开始*/
            clearInterval(timerTop);
            startAnimate();
        };
    }
}