(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.ItCropper = factory());
}(this, (function() {
    'use strict';

    var itCropper = function() {
        function ItCropper(id, o, url) {
            // 类名 itCropper ==> ic
            this.tp = function() {
                return '<div class="ic_video"><div class="ic_video_mask"><div class="ic_video_redmask"></div></div><video controls="controls" muted class="ic_video_main ic_video_id"></video></div>' +
                    '<div class="ic_button_box"><div class="ic_button_right"><button class="ic_button ic_picture_id" title="截取视频上图片">截取图片</button><div class="ic_input_box" type=""><button class="ic_button">上传图片</button><input class="ic_only ic_input_id" name="file" accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff" type="file" style="width:100%;height:100%;"></div></div></div>' +
                    '<div class="ic_panel idsplay_none"><div class="ic_panel_left"><div class="ic_panel_box"><div class="ic_panel_top ic_panel_top_box">' +
                    '<canvas style="display: none" class="ic_canvas_l" width="" height=""></canvas><div style="height:100%;"><img src="" alt="" class="ic_img_l" crossOrigin="Anonymous"></div></div>' +
                    '</div></div><div class="ic_panel_right"><div class="ic_panel_box"><div class="ic_panel_top ic_panel_top2"><div class="ic_panel_img">' +
                    '<canvas class="ic_canvas_l2" width="" height=""></canvas><img src="" alt="" id="ceshi" style="display: none"> </div></div>' +
                    '<div class="ic_panel_bottom ic_panel_bottom2"><div class="ic_panel_bottom2_center"><button class="ic_button ic_save_id">完成</button><button class="ic_button ic_back_id">返回</button></div></div></div> </div></div>';
            }
            this.tp2 = function() {
                return '<div class="ic_panel"><div class="ic_panel_left"><div class="ic_panel_box"><div class="ic_panel_top ic_panel_top_box">' +
                    '<canvas style="display: none" class="ic_canvas_l" width="" height=""></canvas><div style="height:100%;"><img src="" alt="" class="ic_img_l" crossOrigin="Anonymous"></div></div>' +
                    '</div></div><div class="ic_panel_right"><div class="ic_panel_box"><div class="ic_panel_top ic_panel_top2"><div class="ic_panel_img">' +
                    '<canvas class="ic_canvas_l2" width="" height=""></canvas><img src="" alt="" id="ceshi" style="display: none"> </div></div>' +
                    '<div class="ic_panel_bottom ic_panel_bottom2"><div class="ic_panel_bottom2_center"><button class="ic_button ic_save_id" style="margin-top: 60px;">完成</button></div></div></div> </div></div>';
            }

            this.ID = document.getElementsByName(id)[0] || document.getElementById(id);
            this.obj = !o.options ? {
                viewMode: 1,
                dragMode: 'none',
                aspectRatio: 148 / 207,
                cropBoxResizable: false,
                // zoomOnWheel: false, //不允许缩放图片
            } : o.options;
            this.canvas = !o.canvas ? [560, 440, 148, 207] : o.canvas;
            this.url = url;
            this.base; //保存图片base64
            this.cropper = null;

            //创建新的input
            this.newInput = '<input class="ic_only ic_input_id" name="file" accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff" type="file" style="width:100%;height:100%;">';
            //生成截屏区的canvas
            this.canvas_l;
            //生成预览效果区的canvas
            this.canvas_l2;
            //截屏区被操作img
            this.img_l;
            //截屏区canvas的画布
            this.context_l;
            //预览效果区canvas的画布
            this.context_l2;

            //清空画布
            this.clearCanvas = function(ctx, w, h) {
                ctx.fillStyle = "#000000";
                ctx.beginPath();
                ctx.fillRect(0, 0, w, h);
                ctx.closePath();
            }
            this.crop = function(context_l2, canvas_l2, img_l) {
                var that = this;
                return function(e) {
                    //清空画布
                    that.clearCanvas(context_l2, 148, 207);
                    context_l2.drawImage(img_l, e.detail.x, e.detail.y, e.detail.width, e.detail.height, 0, 0, 148, 207);
                    that.base = canvas_l2.toDataURL("image/png"); //这个就是base64编码
                }
            }

            //返回视频界面
            this.back = function(c) {
                this.ID.getElementsByClassName(c)[0].classList.add('idsplay_none');
            }

            //进入截图界面
            this.goin = function(c) {
                this.ID.getElementsByClassName(c)[0].classList.remove('idsplay_none');
            }

            //截取视频图片
            this.getPic = function(context_l, video, canvas_l, img_l) {
                var that = this;
                that.goin('ic_panel');
                //清空画布
                that.clearCanvas(context_l, 640, 480);
                context_l.drawImage(video, 0, 0, 640, 480, 0, 0, 640, 480);
                //第一个参数video是图片来源，第二、三个是提取图片的X、Y轴的开始点（相对video），
                //第四、五个参数是提取图片的宽度和高度，第六、七个参数是把提取出来的图片放置在canvas的开始位置，
                //第八、九个参数是图片放置的结束位置。
                var base = canvas_l.toDataURL("image/png"); //这个就是base64编码
                img_l.src = base;
                if (that.cropper) {
                    that.cropper.destroy();
                }
                that.cropper = new Cropper(img_l, that.obj);
            }

            //上传图片
            this.upPic = function(imgurl, img_l) {
                var that = this;
                that.goin('ic_panel');
                img_l.src = imgurl;
                if (that.cropper) {
                    that.cropper.destroy();
                }
                that.cropper = new Cropper(img_l, that.obj);
            }

            this.initCanvas = function() {
                var that = this;
                that.canvas_l = that.ID.getElementsByClassName("ic_canvas_l")[0];
                that.canvas_l2 = that.ID.getElementsByClassName("ic_canvas_l2")[0];
                that.img_l = that.ID.getElementsByClassName('ic_img_l')[0];
                that.context_l = that.canvas_l.getContext("2d");
                that.context_l2 = that.canvas_l2.getContext("2d");

                //设置canvas宽高
                that.canvas_l.setAttribute('width', that.canvas[0]);
                that.canvas_l.setAttribute('height', that.canvas[1]);
                that.canvas_l2.setAttribute('width', that.canvas[2]);
                that.canvas_l2.setAttribute('height', that.canvas[3]);

                //设置图片抓取函数
                that.obj.crop = that.crop(that.context_l2, that.canvas_l2, that.img_l);
            }

            //video
            this.startVideo = function(imgT, imgValue, callback, upload, result) {
                //截图后 用以展示最终截图图片的img元素
                //截图后 用以保存最终截图图片的base64的input元素
                //截图完成后 需要调用的回调函数
                //是否直接跳过摄像头采集图片，使用上传图片界面
                //外部上传的图片的地址
                var that = this;
                that.ID.classList.add('itCropper');

                //window.addEventListener("DOMContentLoaded", function() {
                if (upload) {
                    //直接上传图片
                    that.ID.innerHTML = that.tp2();
                    that.initCanvas();
                    that.upPic(result, that.img_l);
                } else {
                    //通过摄像头截取
                    that.ID.innerHTML = that.tp();

                    that.initCanvas();

                    var video = that.ID.getElementsByClassName("ic_video_id")[0],
                        videoObj = {
                            "video": true
                        },
                        errBack = function(error) {
                            console.log("Video capture error: ", error.code);
                        };
                    if (navigator.webkitGetUserMedia) { //navigator.getUsermedia兼容问题
                        navigator.webkitGetUserMedia(videoObj, function(stream) {
                            mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[1];
                            video.src = window.URL.createObjectURL(stream);
                            video.play();
                        }, errBack);
                    } else if (navigator.mozGetUserMedia) {
                        navigator.mozGetUserMedia(videoObj, function(stream) {
                            video.src = window.URL.createObjectURL(stream);
                            video.play();
                        }, errBack);
                    } else if (navigator.getUserMedia) {
                        navigator.getUserMedia(videoObj, function(stream) {
                            video.src = stream;
                            video.play();
                        }, errBack);
                    }

                    that.ID.getElementsByClassName("ic_picture_id")[0].addEventListener("click", function() {
                        that.getPic(that.context_l, video, that.canvas_l, that.img_l);
                    })

                    $(that.ID).find('.ic_input_id').change(function() {
                        var reads = new FileReader();
                        var f = $(this)[0].files[0];
                        reads.readAsDataURL(f);
                        reads.onload = function(e) {
                            that.upPic(this.result, that.img_l);
                        };
                        //替换该input：在每次设置完input的file值后，重置该input，可以防止change多次触发，并且可以上传同样的文件
                        $(this).replaceWith(that.newInput);
                    })

                    that.ID.getElementsByClassName("ic_back_id")[0].addEventListener("click", function() {
                        that.back('ic_panel');
                    })
                }

                //完成截图后的操作
                that.ID.getElementsByClassName("ic_save_id")[0].addEventListener("click", function() {
                    $(imgT).attr('src', that.base);
                    $(imgValue).attr('value', that.base);
                    if (callback) {
                        callback();
                    }
                })

                //}, false);
            }
        }
        return ItCropper
    }
    return itCropper
}())))