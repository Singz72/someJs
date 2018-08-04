var formInputVal = {
    //获取指定form中的所有的<input>对象  
    getElements: function(formId) {
        var form = document.getElementById(formId);
        var elements = new Array();
        var tagElements = form.getElementsByTagName('input');
        for (var j = 0; j < tagElements.length; j++) {
            elements.push(tagElements[j]);
        }
        return elements;
    },
    //获取单个input中的[name,value]数组 
    inputSelector: function(element) {
        if (element.checked)
            return [element.name, element.value];
    },

    input: function(element) {
        switch (element.type.toLowerCase()) {
            case 'hidden':
                return [element.name, element.value];
            case 'text':
                return [element.name, element.value];
        }
        return false;
    },
    //组合URL 
    serializeElement: function(element) {
        var that = this;
        var parameter = that.input(element);

        if (parameter) {
            var key = encodeURIComponent(parameter[0]);
            if (key.length == 0) return;

            if (parameter[1].constructor != Array)
                parameter[1] = [parameter[1]];

            var values = parameter[1];
            var results = [];
            for (var i = 0; i < values.length; i++) {
                results.push(key, values[i]);
            }
            return results;
        }
    },
    //调用方法   
    serializeForm: function(formId, hInput) {
        var that = this;
        //给隐藏的input赋值
        if (true) {
            hInput = !hInput ? ['sex', 'cardTypeCategoryId', 'personTypeCategoryId', 'postCategoryId', ] : hInput;
            var hi = 0,
                hl = hInput.length;
            for (; hi < hl; hi++) {
                $('input[name="' + hInput[hi] + '"]').val($('#' + hInput[hi]).val());
            }
        }
        var elements = that.getElements(formId);
        var i = 0,
            l = elements.length,
            obj = {};
        for (; i < l; i++) {
            var queryComponent = that.serializeElement(elements[i]);
            if (queryComponent) {
                // queryComponents.push(queryComponent);
                obj[queryComponent[0]] = queryComponent[1];
            }
        }
        return obj;
    }
}

function initH5() {
    //jQuery time
    var current_fs, next_fs, previous_fs; //fieldsets
    var left, opacity, scale; //fieldset properties which we will animate
    var animating; //flag to prevent quick multi-click glitches
    //创建新的input
    $(".next").click(function() {
        if (true) {
            if (animating) return false;
            animating = true;

            current_fs = $(this).parent();
            next_fs = $(this).parent().next();

            //activate next step on progressbar using the index of next_fs
            $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

            //show the next fieldset
            next_fs.show();
            //hide the current fieldset with style
            current_fs.animate({ opacity: 0 }, {
                step: function(now, mx) {
                    //as the opacity of current_fs reduces to 0 - stored in "now"
                    //1. scale current_fs down to 80%
                    scale = 1 - (1 - now) * 0.2;
                    //2. bring next_fs from the right(50%)
                    left = (now * 50) + "%";
                    //3. increase opacity of next_fs to 1 as it moves in
                    opacity = 1 - now;
                    current_fs.css({ 'transform': 'scale(' + scale + ')' });
                    next_fs.css({ 'left': left, 'opacity': opacity });
                },
                duration: 800,
                complete: function() {
                    current_fs.hide();
                    animating = false;
                },
                //this comes from the custom easing plugin
                easing: 'easeInOutBack'
            });
        }
    });

    $(".previous").click(function() {
        if (animating) return false;
        animating = true;

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        //de-activate current step on progressbar
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        //show the previous fieldset
        previous_fs.show();
        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function(now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale previous_fs from 80% to 100%
                scale = 0.8 + (1 - now) * 0.2;
                //2. take current_fs to the right(50%) - from 0%
                left = ((1 - now) * 50) + "%";
                //3. increase opacity of previous_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({ 'left': left });
                previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
            },
            duration: 800,
            complete: function() {
                current_fs.hide();
                animating = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
    });

    $(".submit").click(function() {
        return false;
    })
}