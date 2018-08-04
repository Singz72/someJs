// http://127.0.0.1:8080/ssg-pluginPlat-abzz/mobile/mobileRegiste.do?id=35b3846c-bc7a-4ecf-bfc8-bcd7912e895c
var $R = 'http://127.0.0.1:8080/ssg-pluginPlat-abzz';
//人员类型请求路径
var getUrl_personTypeCategoryId = $R + '/mobile/dicDropdown.json?code=personType-Category';
//证件类型请求路径
var getUrl_cardTypeCategoryId = $R + '/mobile/dicDropdown.json?code=cardType-Category';
//职务请求路径
var getUrl_postCategoryId = $R + '/mobile/dicDropdown.json?code=post-Category';
//主页信息请求路径
var getPageUrl = $R + '/mobile/mobileRegiste.do';
//发送路径
var postUrl = $R + '/mobile/personRegiste.json';
//存储id
var IDOBJ = {};
//监听文件上传
function fileC(e) {
    var newInput = '<input name="file" class="fs-uploadInput" accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff" type="file"  onchange="fileC(this)">';
    var reads = new FileReader();
    var f = $(e)[0].files[0];
    reads.readAsDataURL(f);
    reads.onload = function(e) {
        $('#fs-img').attr('src', this.result);
        $('input[name="base64Image"]').attr('value', this.result);
    };
    //替换该input：在每次设置完input的file值后，重置该input，可以防止change多次触发，并且可以上传同样的文件
    $(e).replaceWith(newInput);
}
//提交
function submitData() {
    var name = $('input[name="name"]').val();
    var idCardCode = $('input[name="idCardCode"]').val();
    //检测人员名称
    if (!name) {
        alert('请填写人员名称')
        return
    }
    //检测证件号
    if (!idCardCode) {
        alert('请填写证件号')
        return
    }

    var data = formInputVal.serializeForm('msform');

    if (true) {
        data.cardTypeCategoryId = IDOBJ[data.cardTypeCategoryId];
        data.personTypeCategoryId = IDOBJ[data.personTypeCategoryId];
        data.postCategoryId = IDOBJ[data.postCategoryId];
    }

    data.id = $('#bigEventId').val();

    $.ajax({
        type: 'POST',
        url: postUrl,
        data: data,
        dataType: "json",
        success: function(data) {
            console.log(1)
            callPanel();
        },
        error: function() {
            console.log(2)
            callPanel();
        }
    })

}
//提交成功动画
function callPanel() {
    var Timer = setTimeout(function() {
        $('.fadePanel').show();
        $('.fadePanel').find('.fadeInUpdiv>div').addClass('fadeInUp').removeClass('fadeOutUp');
        setTimeout(function() {
            $('.fadePanel').find('.fadeInUpdiv>div').addClass('fadeOutUp').removeClass('fadeInUp');
            setTimeout(function() {
                $('.fadePanel').hide();
                clearTimeout(Timer);
            }, 800)
        }, 2500)
    }, 100)
}
//获取后台传来的数据，刷新部分input
function refreshData(id, D) {
    var personTypeCategoryId = $('#' + id);
    personTypeCategoryId.html('')
    var i = 0,
        l = D.length,
        op1 = '<option>',
        op2 = '</option>';
    for (; i < l; i++) {
        personTypeCategoryId.append(op1 + D[i][1] + op2);
    }
}

function dealData(data) {
    var i = 0,
        l = data.length,
        arr = [];
    for (; i < l; i++) {
        arr.push([data[i].id, data[i].name]);
        if (!IDOBJ[data[i].name]) {
            IDOBJ[data[i].name] = data[i].id;
        }
    }
    return arr;
}

$(document).ready(function() {
    initH5();

    var base = $('input[name="base64Image"]').val();
    if (!base) {
        $('.msform-info-img').hide();
        $('.msform-info-text').css('width', '100%');
    } else {
        $('#msform-info-img').attr('src', base);
    }


    $.ajax({
        type: 'GET',
        url: getUrl_cardTypeCategoryId,
        dataType: "json",
        success: function(data) {
            refreshData('cardTypeCategoryId', dealData(data));
        }
    });
    $.ajax({
        type: 'GET',
        url: getUrl_personTypeCategoryId,
        dataType: "json",
        success: function(data) {
            refreshData('personTypeCategoryId', dealData(data));
        }
    });
    $.ajax({
        type: 'GET',
        url: getUrl_postCategoryId,
        dataType: "json",
        success: function(data) {
            refreshData('postCategoryId', dealData(data));
        }
    })
})