//构造函数
function Gridster_(ID, obj) {
    this.ID = ID;
    this.obj = obj;
    //特制的主页
    this.templateStr0 = '\
                    <li>\
                        <div class="ssg_panel_body">\
                            <div class="ssg_panel_body_box">\
                                <div>\
                                    <div class="ssg_panel_content" id="';
    this.templateStr1 = '\
                    <li>\
                        <div class="removeli" onclick="removeTemplate(this)">×</div>\
                        <div class="ssg_panel_body">\
                            <div class="ssg_panel_body_box">\
                                <div>\
                                    <div class="ssg_panel_content" id="';
    this.templateStr2 = '">\
                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </li>';

    this.templateStr3 = '">\
                        <img alt="map" src="[#if imgs??&&imgs.mainBottomLeft_img??]..${imgs.mainBottomLeft_img}[#else]../img/ssg-home/eventPerson_safecheck.png[/#if]" style="width: 100%; height: 100%;">\
                    <div><div class="s-list_ssg_panel_content_icon"><i class="icon iconfont icon-xiugai"></i>&nbsp&nbsp更换</div><div class="s-list_ssg_panel_content_combobox">\
                            <input name="';
    this.templateStr4 = '" type="text" class="easyui-combobox"\
                                data-options="valueField: ' + "'code'" + ',textField: ' + "'name'" + ',url:  ' + "'${root}/system/dictionary/dropdown.json?code=home-config'" + ',editable:false,onSelect:zHomeConfigPlugin.selectConfig" />\
                    </div></div></div></div></div></div></li>';

    //布局对象
    this.gridster_ = function() {
        return $('#' + this.ID).find(".gridster ul").gridster(this.obj).data('gridster');
    };

    //增加方块
    this.addTemplate = function() {
        //此处this指向当前对象
        var templateStr1 = this.templateStr1;
        var templateStr3 = this.templateStr3;
        var templateStr4 = this.templateStr4;
        var removeID = this.removeID;
        var serializationID = this.serializationID;
        return function() {
            var id = "";
            //首先便利被删除ID的数组
            //如果数组长度大于一，则从里面获取ID
            //否则从备用数组里获取ID
            if (removeID.length > 0) {
                id = removeID.shift();
                if (id === undefined) {
                    alert('超出最大添加');
                    return
                } else {
                    id = "colrow_" + id;
                }
            } else {
                id = serializationID.shift();
                if (id === undefined) {
                    alert('超出最大添加值');
                    return
                } else {
                    id = "colrow_" + id;
                }
            }


            var T = templateStr1 + id + templateStr3 + id + templateStr4;
            var widgets = [
                [T, 1, 1]
            ];
            //此处this指向调用对象，但一般指的是window
            var gridster = this.gridster;
            $.each(widgets, function(i, widget) {
                gridster.add_widget.apply(gridster, widget);
            });
        }
    }


    //被删除ID
    this.removeID = [];
    //未被使用的ID
    this.serializationID = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];

    this.setserializationID = function(obj) {
        var i, j,
            l = obj.length,
            jl = this.serializationID.length;
        for (i = 0; i < l; i++) {
            for (j = 0; j < jl; j++) {
                if (this.serializationID[j] === obj[i].id.split('_')[1]) {
                    var arr = this.serializationID;
                    (function(j) {
                        arr.splice(j, 1);
                    })(j)
                }
            }
        }
    }

    //删除方块
    this.removeTemplate = function() {
        var removeID = this.removeID;
        return function(e) {
            var Te = $(e).parent('li');
            var serialization = Te.find('.ssg_panel_content').attr('id').split('_')[1];
            removeID.push(serialization)
            removeID.sort(function(a, b) {
                return a > b
            });
            //此处this指向调用对象，但一般指的是window
            this.gridster.remove_widget(Te);
        }
    }

    //输出布局信息
    this.logTemplate = function() {
        var layout = this.gridster.serialize();
        return JSON.stringify(layout); //JSON序列化
    }
}

//配置
function setGridster_(ID, obj, serialization) {
    var height = Math.floor($('#' + ID).height() / 13) - 0.5;
    obj.widget_base_dimensions = ['auto', height];
    var gridster_ = new Gridster_(ID, obj);
    gridster_.setserializationID(serialization);
    var gridster = gridster_.gridster_();
    //渲染页面
    //可以根绝接收到的布局信息，清除之前的布局，重新渲染页面
    gridster.remove_all_widgets();
    $.each(serialization, function() {
        var newTemplate;
        if (obj.nomove) {
            newTemplate = gridster_.templateStr0 + arguments[1].id + gridster_.templateStr2;
        } else {
            newTemplate = gridster_.templateStr1 + arguments[1].id + gridster_.templateStr3 + arguments[1].id + gridster_.templateStr4;
        }
        gridster.add_widget(newTemplate, this.size_x, this.size_y, this.col, this.row);
    });
    if (obj.nomove) {
        gridster.disable(); //禁止拖动
        $("#" + ID).find('#gridsterUl').children().css('cursor', 'auto');
    }

    return {
        gridster: gridster,
        removeTemplate: gridster_.removeTemplate(),
        addTemplate: gridster_.addTemplate(),
        logTemplate: gridster_.logTemplate
    }
}