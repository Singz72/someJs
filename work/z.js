(function(window, undefined) {
    if (!window.z) {
        if (typeof(window.WEB_ROOT_PATH) == "undefined") {
            window.WEB_ROOT_PATH = "";
        }
        if (typeof(window.Z_REQUEST_CACHE) == "undefined") {
            window.Z_REQUEST_CACHE = true;
        }
        if (typeof(window.Z_REQUEST_PROGRESS) == "undefined") {
            window.Z_REQUEST_PROGRESS = true;
        }
        if (typeof(window.JS_API_PATH) == "undefined") {
            window.JS_API_PATH = window.WEB_ROOT_PATH + "/lib";
        }
        if (typeof(window.JSON_JS_API_PATH) == "undefined") {
            window.JSON_JS_API_PATH = window.JS_API_PATH + "/json";
        }
        if (typeof(window.JQUERY_JS_API_PATH) == "undefined") {
            window.JQUERY_JS_API_PATH = window.JS_API_PATH + "/jquery";
        }
        if (typeof(window.Z_JS_API_PATH) == "undefined") {
            window.Z_JS_API_PATH = window.JS_API_PATH + "/z";
        }
        var z = window.z = {
            inherit: function(parentClass, subClass, subMembers) {
                var prototypes = [];
                if (parentClass instanceof Array) {
                    for (var i = 0, length = parentClass.length; i < length; i++) {
                        prototypes.push(parentClass[i].prototype);
                    }
                    parentClass = parentClass[0];
                } else {
                    prototypes = [
                        parentClass.prototype
                    ];
                }
                var fun = function() {};
                fun.prototype = parentClass.prototype;
                subClass.prototype = new fun();
                for (var i = 1, length = prototypes.length; i < length; i++) {
                    z.setMembers(subClass.prototype, prototypes[i], "constructor");
                }
                subClass.prototype.constructor = subClass;
                if (parentClass.prototype.constructor == Object.prototype.constructor) {
                    parentClass.prototype.constructor = parentClass;
                }
                z.setMembers(subClass.prototype, subMembers);
            },
            getName: function(type) {
                type = String(type);
                return type.replace(/^function(\s|\n)+(.+)\((.|\n)+$/, '$2');
            },
            getInstance: function(type, args, variable) {
                var instance = null;
                eval("instance = " + type + ".instance;");
                if (instance === undefined) {
                    var params = new Array();
                    if (args instanceof Array) {
                        for (var i = 0; i < args.length; i++) {
                            params[i] = "args[" + i + "]";
                        }
                    }
                    eval("instance = " + type + ".instance = new " + type + "(" + params.join(", ") + ");");
                }
                if (variable) {
                    window[variable] = instance;
                }
                return instance;
            },
            getMembers: function(obj) {
                var members = {};
                if (obj) {
                    for (var key in obj) {
                        members[key] = obj[key];
                    }
                }
                return members;
            },
            setMembers: function(obj, members, ignoreMenbers) {
                if (!obj) {
                    obj = {};
                }
                if (members) {
                    for (var key in members) {
                        if (!z.containKey(ignoreMenbers, key)) {
                            var value = members[key];
                            if (typeof(value) != "undefined") {
                                obj[key] = members[key];
                            }
                        }
                    }
                }
                return obj;
            },
            addEvent: function(obj, target, handler, toTop) {
                if (obj && target && typeof(handler) == "function") {
                    var fun = obj[target];
                    obj[target] = function() {
                        if (toTop) {
                            var result = handler.apply(obj, arguments);
                            if (result !== false) {
                                if (typeof(fun) == "function") {
                                    result = fun.apply(obj, arguments);
                                }
                            }
                            return result;
                        } else {
                            var result = undefined;
                            if (typeof(fun) == "function") {
                                result = fun.apply(obj, arguments);
                            }
                            if (handler.apply(obj, arguments) === false) {
                                return false;
                            } else {
                                return result;
                            }
                        }
                    }
                    return obj[target];
                }
                return null;
            },
            containKey: function(obj, key) {
                if (obj && key) {
                    if (obj instanceof Array) {
                        obj = obj.join(",");
                    }
                    if (typeof(obj) == "string") {
                        return obj.indexOf(key) >= 0;
                    } else {
                        for (var item in obj) {
                            if (item == key) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            asyncUpload: function(options, isBackground) {
                if (typeof($) !== "undefined" && options) {
                    var isProgress = window.Z_REQUEST_PROGRESS && $.messager && !isBackground;
                    if (isProgress) {
                        $.messager.progress({
                            text: "正在上传",
                            msg: ""
                        });
                    }
                    var name = new Date().getTime();
                    var iframeName = "iframe_" + name;
                    var $div = $("<div style='display: none'></div>").appendTo("body");
                    var $iframe = $("<iframe name='" + iframeName + "'></iframe>").appendTo($div);
                    var $form = null;
                    if (options.form) {
                        $form = $(options.form);
                        if (!$form.form("validate")) {
                            if (isProgress) {
                                $.messager.progress("close");
                            }
                            return false;
                        }
                    } else {
                        var formName = "form_" + name;
                        $form = $("<form name='" + formName + "'").appendTo($div);
                    }
                    $form.attr({
                        method: "post",
                        enctype: "multipart/form-data",
                        encoding: "multipart/form-data",
                        target: iframeName,
                        action: options.url
                    });
                    if (options.files) {
                        for (var key in options.files) {
                            var $file = $(options.files[key]);
                            $file.clone(true).insertBefore($file);
                            $file.appendTo($form).removeAttr("id");
                        }
                    }
                    if (options.data) {
                        for (var key in options.data) {
                            $("<input type='hidden' name='" + key + "' />").appendTo($form).val(options.data[key]);
                        }
                    }
                    $iframe.load(function() {
                        if (isProgress) {
                            $.messager.progress("close");
                        }
                        if (typeof(options.success) == "function") {
                            var iframe = this;
                            var data = {
                                responseText: "",
                                responseXML: ""
                            };
                            if (iframe.contentWindow) {
                                data.responseText = iframe.contentWindow.document.body ? iframe.contentWindow.document.body.innerHTML : null;
                                data.responseXML = iframe.contentWindow.document.XMLDocument ? iframe.contentWindow.document.XMLDocument : iframe.contentWindow.document;
                            } else if (iframe.contentDocument) {
                                data.responseText = iframe.contentDocument.document.body ? iframe.contentDocument.document.body.innerHTML : null;
                                data.responseXML = iframe.contentDocument.document.XMLDocument ? iframe.contentDocument.document.XMLDocument : iframe.contentDocument.document;
                            }
                            $div.remove();
                            var args = null;
                            var dataType = $.trim(options.dataType);
                            if (dataType == "json") {
                                if (data.responseText) {
                                    eval("args = " + data.responseText + ";");
                                }
                                args = [
                                    args
                                ];
                            } else if (dataType == "xml") {
                                args = [
                                    data.responseXML
                                ];
                            } else {
                                args = [
                                    data.responseText, data.responseXML
                                ];
                            }
                            options.success.apply(iframe, args);
                        } else {
                            $div.remove();
                        }
                    });
                    $form.submit();
                }
            },
            request: function(options, isBackground) {
                if (typeof($) !== "undefined" && $.ajax && options) {
                    var isProgress = window.Z_REQUEST_PROGRESS && $.messager && !isBackground && options.async !== false;
                    if (isProgress) {
                        $.messager.progress({
                            text: "正在请求",
                            msg: ""
                        });
                    }
                    if (typeof(options.cache) == "undefined") {
                        options.cache = window.Z_REQUEST_CACHE;
                    }
                    if (typeof(options.async) == "undefined") {
                        options.async = true;
                    }
                    if (typeof(options.dataType) == "undefined") {
                        options.dataType = "json";
                    }
                    if (typeof(options.type) == "undefined") {
                        var dataType = options.dataType.toLowerCase();
                        if (dataType == "html" || dataType == "script") {
                            options.type = "GET";
                        } else {
                            options.type = "POST";
                        }
                    }
                    if (options.isJson) {
                        if (typeof(options.contentType) == "undefined") {
                            options.contentType = "application/json; charset=utf-8";
                        }
                        var data = options.data;
                        if (typeof(data) == "string") {
                            var params = data.split("&");
                            data = {};
                            for (var index in params) {
                                var item = params[index].split("=");
                                var key = item[0];
                                if (key.length > 0) {
                                    var value = "";
                                    if (item.length > 1 && item[1].length > 0) {
                                        value = item[1];
                                    }
                                    data[key] = value;
                                }
                            }
                        }
                        options.data = z.json.getString(data);
                    }
                    if (options.form) {
                        var $form = $(options.form);
                        if (!$form.form("validate")) {
                            if (isProgress) {
                                $.messager.progress("close");
                            }
                            if (!isBackground) {
                                if ($.messager) {
                                    $.messager.alert("警告", "表单验证有误，请检查", "warning");
                                } else {
                                    alert("表单验证有无，请检查有误");
                                }
                            }
                            return false;
                        }
                        var data = [];
                        if (typeof(options.data) == "object") {
                            for (var key in options.data) {
                                data.push(key + "=" + options.data[key]);
                            }
                        } else if (typeof(options.data) == "string") {
                            data.push(options.data);
                        }
                        var items = $form.serialize().split("&");
                        var formNames = {};
                        for (var i = 0, length = items.length; i < length; i++) {
                            var item = items[i];
                            var index = item.indexOf("=");
                            if (index > 0 /* && index < item.length - 1 */ ) {
                                var keyValue = item.split("=");
                                var key = keyValue[0];
                                var value = keyValue[1];
                                if (formNames[key] || formNames[key] === "") {
                                    formNames[key] = formNames[key] + "," + value;
                                } else {
                                    formNames[key] = value;
                                }
                            }
                        }
                        for (var formName in formNames) {
                            if (formNames[formName]) {
                                var item = formName + "=" + formNames[formName];
                                data.push(item);
                            }
                        }
                        // data.push($form.serialize());
                        options.data = data.join("&");
                    }
                    if (typeof(options.data) == "string") {
                        var data = options.data.replace(/=null&/g, "=&").replace(/=undefined&/g, "=&");
                        var tempIndex = data.length - "=null".length;
                        if (data.lastIndexOf("=null") == tempIndex) {
                            data = data.substring(0, tempIndex);
                        }
                        tempIndex = data.length - "=undefined".length;
                        if (data.lastIndexOf("=undefined") == tempIndex) {
                            data = data.substring(0, tempIndex);
                        }
                        options.data = data;
                    } else if (typeof(options.data) == "object") {
                        data = [];
                        for (var key in options.data) {
                            var value = options.data[key];
                            if (typeof(value) != "undefined" && value !== null && value !== "undefined" && value !== "null") {
                                data.push(key + "=" + value);
                            }
                        }
                        options.data = data.join("&");
                    }
                    var fun = function(args, type) {
                        if (!this.isClosed && isProgress) {
                            $.messager.progress("close");
                            this.isClosed = true;
                        }
                        if (!this.isRedirect && args) {
                            var response = args.responseText || args;
                            if (typeof(response.indexOf) == "function" && response.indexOf("DOCTYPE") >= 0 && response.indexOf("登入") >= 0) {
                                this.isRedirect = true;
                                this.isAlert = true;
                                var index = response.indexOf("alert");
                                var temp = response.substring(index);
                                var startIndex = temp.indexOf("\"") + 1;
                                var stopIndex = temp.substring(startIndex).indexOf("\"");
                                var msg = temp.substr(startIndex, stopIndex);
                                if ($.messager) {
                                    $.messager.alert("错误", msg, "error", function() {
                                        window.location.href = window.WEB_ROOT_PATH + "/system/login.do?url=" + encodeURIComponent(window.location.href);
                                    });
                                } else {
                                    alert(msg);
                                    window.location.href = window.WEB_ROOT_PATH + "/system/login.do?url=" + encodeURIComponent(window.location.href);
                                }
                                return false;
                            }
                        }
                        if (!this.isAlert && (type == "error" || type == "parsererror")) {
                            if (!isBackground) {
                                if ($.messager) {
                                    $.messager.alert("错误", "请求失败", "error");
                                } else {
                                    alert("请求失败");
                                }
                            }
                            this.isAlert = true;
                        }
                    }
                    z.addEvent(options, "complete", fun, true);
                    z.addEvent(options, "error", fun, true);
                    z.addEvent(options, "success", fun, true);
                    return $.ajax(options);
                }
            },
            replace: function(obj, string, refName) {
                if (obj && string) {
                    for (var key in obj) {
                        var regExp = null;
                        if (refName) {
                            regExp = new RegExp("\\{" + refName + "." + key + "\\}", "g");
                        } else {
                            regExp = new RegExp("\\{" + key + "\\}", "g");
                        }
                        string = string.replace(regExp, obj[key]);
                    }
                }
                return string;
            },
            browser: {
                getVersions: function() {
                    var u = navigator.userAgent;
                    var version = {
                        trident: u.indexOf("Trident") > -1,
                        presto: u.indexOf("Presto") > -1,
                        webKit: u.indexOf("AppleWebKit") > -1,
                        gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1,
                        mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                        android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
                        iPhone: u.indexOf("iPhone") > -1 || u.indexOf("Mac") > -1,
                        iPad: u.indexOf("iPad") > -1,
                        webApp: u.indexOf("Safari") == -1,
                        language: (u.browserLanguage || u.language).toLowerCase()
                    };
                    return version;
                }
            },
            json: {
                getString: function(value, replacer, space) {
                    if (typeof(JSON) !== "undefined" && JSON.stringify) {
                        return JSON.stringify(value, replacer, space);
                    } else {
                        return String(value);
                    }
                },
                getObject: function(text) {
                    var jsonObj = null;
                    eval("jsonObj = " + text + ";");
                    return jsonObj;
                },
                request: function(options, isBackground) {
                    options.isJson = true;
                    return z.request(options, isBackground);
                }
            },
            html: {
                escape: function(html) {
                    if (typeof(html) == "string") {
                        html = html.replace(/&/g, "&amp;");
                        html = html.replace(/</g, "&lt;");
                        html = html.replace(/>/g, "&gt;");
                        html = html.replace(/\"/g, "&quot;");
                        html = html.replace(/\'/g, "&#39;");
                        return html;
                    } else {
                        return html;
                    }
                },
                unescape: function(html) {
                    if (typeof(html) == "string") {
                        html = html.replace(/&amp;/g, "&");
                        html = html.replace(/&lt;/g, "<");
                        html = html.replace(/&gt;/g, ">");
                        html = html.replace(/&quot;/g, "\"");
                        html = html.replace(/&#39;/g, "'");
                    } else {
                        return html;
                    }
                }
            },
            cookie: {
                getValue: function(key) {
                    if (typeof($) !== "undefined" && $.cookie) {
                        return $.cookie(key);
                    } else {
                        return null;
                    }
                },
                setValue: function(key, value, options) {
                    if (typeof($) !== "undefined" && $.cookie) {
                        return $.cookie(key, value, options);
                    } else {
                        return false;
                    }
                },
                removeValue: function(key, options) {
                    if (typeof($) !== "undefined" && $.removeCookie) {
                        return $.removeCookie(key, options);
                    } else {
                        return false;
                    }
                }
            },
            uri: {
                containUri: function(uri, subUri, whole) {
                    if (uri && subUri) {
                        if (!whole) {
                            var index = subUri.indexOf("./");
                            if (index >= 0) {
                                subUri = subUri.substring(index + "./".length);
                            }
                            index = subUri.indexOf("?");
                            if (index >= 0) {
                                subUri = subUri.substring(0, index);
                            }
                        }
                        return uri.indexOf(subUri) >= 0;
                    }
                    return false;
                },
                getValue: function(uri, key) {
                    var value = "";
                    var index = uri.indexOf("?");
                    if (index >= 0) {
                        var params = uri.substr(index + 1);
                        params = params.split("&");
                        for (var param in params) {
                            param = params[param];
                            index = param.indexOf("=");
                            if (index >= 0 && key == param.substring(0, index)) {
                                value = param.substr(index + 1);
                            }
                        }
                    }
                    return value;
                },
                setValue: function(uri, key, value) {
                    var index = uri.indexOf("?");
                    if (index >= 0) {
                        var baseUri = uri.substring(0, index);
                        var hasKey = false;
                        var newParams = new Array();
                        var oldParams = uri.substr(index + 1);
                        oldParams = oldParams.split("&");
                        for (var oldParam in oldParams) {
                            oldParam = oldParams[oldParam];
                            index = oldParam.indexOf("=");
                            if (index >= 0 && key == oldParam.substring(0, index)) {
                                newParams.push(key + "=" + value);
                                hasKey = true;
                            } else {
                                newParams.push(oldParam);
                            }
                        }
                        if (!hasKey) {
                            newParams.push(key + "=" + value);
                        }
                        newParams = newParams.join("&");
                        uri = baseUri + "?" + newParams;
                    } else {
                        uri += "?" + key + "=" + value;
                    }
                    return uri;
                },
                getHash: function(url) {
                    var hash = window.location.hash;
                    var index = -1;
                    if (url && (index = url.lastIndexOf("#")) >= 0) {
                        hash = url.substring(index + 1);
                    } else {
                        if (hash && hash.lastIndexOf("#") == 0) {
                            hash = hash.substring(1);
                        }
                    }
                    if (!hash) {
                        hash = "";
                    }
                    return hash;
                },
                getJs: function(url, whole) {
                    var scripts = document.getElementsByTagName("script");
                    for (var i = 0; i < scripts.length; i++) {
                        var script = scripts[i];
                        if (script.type == "text/javascript" && z.uri.containUri(script.src, url, whole)) {
                            return script;
                        }
                    }
                    return null;
                },
                setJs: function(url, callback, whole, isAjax) {
                    var script = z.uri.getJs(url, whole);
                    if (script) {
                        if (typeof(callback) == "function") {
                            callback.apply(script);
                        }
                    } else {
                        if (isAjax) {
                            z.request({
                                callback: callback,
                                url: url,
                                dataType: "script",
                                success: function() {
                                    if (typeof(this.callback) == "function") {
                                        this.callback.apply(this, arguments);
                                    }
                                }
                            }, true);
                        } else {
                            var done = false;
                            script = document.createElement("script");
                            script.type = "text/javascript";
                            script.language = "javascript";
                            script.src = url;
                            script.onload = script.onreadystatechange = function() {
                                if (!done && (!script.readyState || script.readyState == "loaded" || script.readyState == "complete")) {
                                    done = true;
                                    script.onload = script.onreadystatechange = null;
                                    if (typeof(callback) == "function") {
                                        callback.apply(script);
                                    }
                                }
                            }
                            document.getElementsByTagName("head")[0].appendChild(script);
                        }
                    }
                },
                getCss: function(url, whole) {
                    var links = document.getElementsByTagName("link");
                    for (var i = 0; i < links.length; i++) {
                        var link = links[i];
                        if (link.type == "text/css" && z.uri.containUri(link.href, url, whole)) {
                            return link;
                        }
                    }
                    return null;
                },
                setCss: function(url, callback, whole) {
                    var link = z.uri.getCss(url, whole);
                    if (link) {
                        if (typeof(callback) == "function") {
                            callback.apply(link);
                        }
                    } else {
                        link = document.createElement("link");
                        link.rel = "stylesheet";
                        link.type = "text/css";
                        link.media = "screen";
                        link.href = url;
                        document.getElementsByTagName("head")[0].appendChild(link);
                        if (typeof(callback) == "function") {
                            callback.apply(link);
                        }
                    }
                },
                setHtm: function(url, callback) {
                    z.request({
                        callback: callback,
                        url: url,
                        dataType: "html",
                        success: function() {
                            if (typeof(this.callback) == "function") {
                                this.callback.apply(this, arguments);
                            }
                        }
                    }, true);
                },
                getIcon: function(url, format, extension) {
                    if (url) {
                        if (url.indexOf("http://") != 0 && url.indexOf("https://") != 0 && url.indexOf("ftp://") != 0 && url.indexOf("/") != 0) {
                            url = window.WEB_ROOT_PATH + "/" + url;
                        }
                        if (!extension) {
                            extension = z.uri.getExtension(url);
                        }
                    }
                    if (!extension) {
                        extension = format;
                    }
                    if (!format) {
                        format = extension;
                    }
                    if (extension && format && "png,jpg,jpeg,gif,bmp,tiff,svg".indexOf(extension) < 0) {
                        url = z.uri.getFormatIcon(format);
                    }
                    return url;
                },
                getFormatIcon: function(format) {
                    return window.WEB_ROOT_PATH + "/img/icon/format/" + format + ".png"
                },
                getFileName: function(path) {
                    var index = path.lastIndexOf("\\");
                    if (index >= 0) {
                        path = path.substring(index + 1);
                    }
                    index = path.lastIndexOf("/");
                    if (index >= 0) {
                        path = path.substring(index + 1);
                    }
                    return path;
                },
                getFileNameWithoutExtension: function(path) {
                    path = z.uri.getFileName(path);
                    var index = path.lastIndexOf(".");
                    if (index >= 0) {
                        path = path.substring(0, index);
                    }
                    return path;
                },
                getExtension: function(path) {
                    var index = path.lastIndexOf(".");
                    if (index >= 0) {
                        path = path.substring(index + 1);
                    }
                    return path;
                }
            },
            date: {
                getString: function(date, format) {
                    var o = {
                        "M+": date.getMonth() + 1,
                        "d+": date.getDate(),
                        "H+": date.getHours(),
                        "m+": date.getMinutes(),
                        "s+": date.getSeconds(),
                        "q+": Math.floor((date.getMonth() + 3) / 3),
                        "S": date.getMilliseconds()
                    };
                    if (/(y+)/.test(format)) {
                        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                    }
                    for (var k in o) {
                        if (new RegExp("(" + k + ")").test(format)) {
                            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                        }
                    }
                    return format;
                },
                addYears: function(date, years) {
                    date = new Date(date);
                    var year = date.getFullYear();
                    year += years;
                    date.setFullYear(year);
                    return date;
                },
                addMonths: function(date, months) {
                    date = new Date(date);
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    month += months;
                    var years = parseInt(month / 12);
                    month = parseInt(month % 12);
                    year += years;
                    date.setFullYear(year);
                    date.setMonth(month);
                    return date;
                },
                addDays: function(date, days) {
                    date = new Date(date);
                    var milliseconds = date.getTime();
                    milliseconds += days * 24 * 60 * 60 * 1000;
                    date.setTime(milliseconds);
                    return date;
                },
                addHours: function(date, hours) {
                    date = new Date(date);
                    var milliseconds = date.getTime();
                    milliseconds += hours * 60 * 60 * 1000;
                    date.setTime(milliseconds);
                    return date;
                },
                addMinutes: function(date, minutes) {
                    date = new Date(date);
                    var milliseconds = date.getTime();
                    milliseconds += minutes * 60 * 1000;
                    date.setTime(milliseconds);
                    return date;
                },
                addSeconds: function(date, seconds) {
                    date = new Date(date);
                    var milliseconds = date.getTime();
                    milliseconds += seconds * 1000;
                    date.setTime(milliseconds);
                    return date;
                },
                addMilliseconds: function(date, milliseconds) {
                    date = new Date(date);
                    milliseconds = date.getTime() + milliseconds;
                    date.setTime(milliseconds);
                    return date;
                }
            },
            ui: {
                getWindowHeight: function() {
                    var height = false;
                    if (window.innerHeight) {
                        height = window.innerHeight;
                    } else if (document.body && document.body.clientHeight) {
                        height = document.body.clientHeight;
                    }
                    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                        height = document.documentElement.clientHeight;
                    }
                    return height;
                },
                getWindowWidth: function() {
                    var width = false;
                    if (window.innerWidth) {
                        width = window.innerWidth;
                    } else if (document.body && document.body.clientWidth) {
                        width = document.body.clientWidth;
                    }
                    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                        width = document.documentElement.clientWidth;
                    }
                    return width;
                },
                imgPreview: function(options) {
                    options = z.setMembers({}, options);
                    if ($ && options && options.selector && options.images && options.images.length > 0) {
                        var imageLength = options.images.length;
                        var $dom = $(options.selector).html("");
                        var dom = $dom.get(0);
                        var $top = $("<div class='s-imgPreview-top'></div>").appendTo($dom);
                        var $maxPrevious = $("<a class='s-imgPreview-previous'><span class='icon-maxArrow-left'></span></a>").appendTo($top);
                        var $maxNext = $("<a class='s-imgPreview-next'><span class='icon-maxArrow-right'></span></a>").appendTo($top);
                        var $topPadding = $("<div class='s-imgPreview-padding'></div>").appendTo($top);
                        var $maxImg = $("<a class='s-img'><img /></a>").appendTo($topPadding);
                        var $imgContent = $("<div class='s-imgPreview-content'></div>").appendTo($topPadding);
                        var $bottom = $("<div class='s-imgPreview-bottom'></div>").appendTo($dom);
                        var $minPrevious = $("<a class='s-imgPreview-previous'><span class='icon-minArrow-left'></span></a>").appendTo($bottom);
                        var $minNext = $("<a class='s-imgPreview-next'><span class='icon-minArrow-right'></span></a>").appendTo($bottom);
                        var $bottomPadding = $("<div class='s-imgPreview-padding'></div>").appendTo($bottom);
                        var $minImgs = $("<ul class='s-imgPreview-min'></ul>").appendTo($bottomPadding);
                        var changeImage = function(index) {
                            if (index < 0) {
                                index = imageLength - 1;
                            }
                            if (index >= imageLength) {
                                index = 0;
                            }
                            dom.currentIndex = index;
                            var image = options.images[index];
                            $minImgs.find("a.s-imgPreview-selected").removeClass("s-imgPreview-selected");
                            var $li = $minImgs.find("li").eq(index);
                            $li.find("a.s-img").addClass("s-imgPreview-selected");
                            $maxImg.find("img").attr("src", image.src);
                            var content = image.content || "";
                            $imgContent.html(content);
                            if (content) {
                                $imgContent.removeClass("s-hide");
                            } else {
                                $imgContent.addClass("s-hide");
                            }
                            var marginLeft = parseInt($minImgs.css("margin-left"));
                            var liWidth = $li.width();
                            var minWidth = $minImgs.width();
                            var left = index * liWidth;
                            if (marginLeft < -left) {
                                $minImgs.animate({
                                    "margin-left": (-left) + "px"
                                });
                            } else if (minWidth < (left + liWidth)) {
                                $minImgs.animate({
                                    "margin-left": (marginLeft - (left + liWidth - minWidth)) + "px"
                                });
                            }
                        };
                        for (var i = 0, length = options.images.length; i < length; i++) {
                            var image = options.images[i];
                            var $img = $("<li><a class='s-img'><img src='" + image.src + "' /></a></li>").appendTo($minImgs);
                            $img.click(function() {
                                changeImage($minImgs.find("li").index(this));
                            });
                        }
                        var topHeight = $dom.height() - $bottom.height() - 4;
                        topHeight = topHeight > 0 ? topHeight : 360;
                        $maxPrevious.css({
                            "height": 352 + "px",
                            "line-height": 352 + "px"
                        }).click(function() {
                            changeImage(dom.currentIndex - 1);
                        });
                        $maxPrevious.find("span.icon-maxArrow-left").css({
                            "margin-top": 145 + "px"
                        });
                        $maxNext.css({
                            "height": 352 + "px",
                            "line-height": 352 + "px"
                        }).click(function() {
                            changeImage(dom.currentIndex + 1);
                        });
                        $maxNext.find("span.icon-maxArrow-right").css({
                            "margin-top": 145 + "px"
                        });
                        $maxImg.css({
                            "height": 350 + "px",
                            "line-height": 350 + "px"
                        }).click(function() {
                            var image = options.images[dom.currentIndex];
                            if (typeof(image.onClick) == "function") {
                                image.onClick.apply(this, arguments);
                            }
                        });
                        $minPrevious.click(function() {
                            changeImage(dom.currentIndex - 1);
                        });
                        $minNext.click(function() {
                            changeImage(dom.currentIndex + 1);
                        });
                        changeImage(0);
                    } else if ($ && options && options.selector && options.images) {
                        var $dom = $(options.selector).html("");
                    }
                }
            },
            plugin: {
                hooks: [],
                BaseHook: function() {
                    z.Class.apply(this);
                    z.plugin.hooks.push(this);
                },
                BasePlugin: function() {
                    z.Class.apply(this);
                    for (var i = 0, length = z.plugin.hooks.length; i < length; i++) {
                        var hook = z.plugin.hooks[i];
                        hook.plugins.push(this);
                        hook.pluginKeys[this.pluginKey] = this;
                    }
                },
                MenuPlugin: function() {
                    z.plugin.BasePlugin.apply(this, arguments);
                },
                ListPlugin: function() {
                    z.plugin.BasePlugin.apply(this, arguments);
                },
                MisPlugin: function() {
                    z.plugin.BasePlugin.apply(this, arguments);
                },
                MapPlugin: function() {
                    z.plugin.BasePlugin.apply(this, arguments);
                }
            },
            command: {
                commands: {},
                init: function() {
                    if (typeof(JS) !== "undefined" && JS.Engine && JS.Engine.on) {
                        JS.Engine.on({
                            start: function(cId, aml, engine) {
                                var workStyle = engine.getConnector().workStyle;
                                workStyle = workStyle === 'stream' ? '长连接' : '长轮询';
                                console.log("comet4j已连接：" + workStyle);
                            },
                            stop: function(cause, cId, url, engine) {
                                console.log("comet4j已停止，5秒后尝试重连...");
                                setTimeout(function() {
                                    z.command.start();
                                }, 5000);
                            },
                            command: function(args, timespan, engine) {
                                if (args) {
                                    if (typeof(args) == "string") {
                                        args = z.json.getObject(args);
                                    }
                                    var command = z.command.commands[args.command];
                                    if (typeof(command) == "function") {
                                        command(args, timespan, engine);
                                    }
                                }
                            }
                        });
                        z.command.start();
                    }
                },
                addEvent: function(command, callback) {
                    z.command.commands[command] = callback;
                },
                removeEvent: function(command) {
                    z.command.commands[command] = undefined;
                },
                start: function() {
                    JS.Engine.start(window.WEB_ROOT_PATH + "/command");
                }
            },
            Class: function(members) {
                Object.apply(this);
                this.setMembers(members);
            }
        };

        z.inherit(Object, z.Class, {
            getObject: function() {
                return this.getMembers();
            },
            getMembers: function() {
                return z.getMembers(this);
            },
            setMembers: function(members, ignoreMenbers) {
                return z.setMembers(this, members, ignoreMenbers);
            },
            addEvent: function(target, handler) {
                return z.addEvent(this, target, handler);
            }
        });

        z.inherit(z.Class, z.plugin.BaseHook, {
            pluginTypes: [
                "BasePlugin", "MenuPlugin", "ListPlugin", "MisPlugin", "MapPlugin"
            ],
            plugins: [],
            pluginKeys: {},
            inited: null,
            init: function() {
                this.addPlugins(this.plugins);
                if (typeof(this.inited) == "function") {
                    this.inited.apply(this, arguments);
                }
            },
            destroy: function() {
                for (var i = 0, length = this.plugins.length; i < length; i++) {
                    var item = this.plugins[i];
                    item.destroy();
                }
                delete this;
            },
            hasPluginType: function(pluginType) {
                if (this.pluginTypes) {
                    for (var i = 0, length = this.pluginTypes.length; i < length; i++) {
                        if (pluginType.indexOf(this.pluginTypes[i]) >= 0) {
                            return true;
                        }
                    }
                }
                return false;
            },
            getTitle: function() {
                return $.trim($("title").html());
            },
            tooltip: function(target, options) {},
            showPopover: function(target, options) {},
            hidePopover: function(target) {},
            alert: function(content, title, callback, theme, okText) {},
            confirm: function(content, title, okCallback, cancelCallback, theme, okText, cancelText) {},
            showProgress: function(title, progress, theme) {},
            hideProgress: function() {},
            beforeAddPlugins: null,
            afterAddPlugins: null,
            addPlugins: function(plugins) {
                if (typeof(this.beforeAddPlugins) == "function") {
                    this.beforeAddPlugins.apply(this, arguments);
                }
                for (var i = 0, length = plugins.length; i < length; i++) {
                    var item = plugins[i];
                    item.hook = this;
                    item.render(this);
                    if (item instanceof z.plugin.MenuPlugin || z.containKey(item.pluginTypes, "MenuPlugin")) {
                        this.addMenuPlugin(item);
                    }
                    if (item instanceof z.plugin.MisPlugin || z.containKey(item.pluginTypes, "MisPlugin")) {
                        this.addMisPlugin(item);
                    }
                    if (item instanceof z.plugin.MapPlugin || item.pluginTypes.indexOf("MapPlugin") >= 0) {
                        this.addMapPlugin(item);
                        this.mapPlugin = item;
                    }
                }
                for (var i = 0, length = plugins.length; i < length; i++) {
                    var item = plugins[i];
                    item.init(this);
                }
                if (typeof(this.afterAddPlugins) == "function") {
                    this.afterAddPlugins.apply(this, arguments);
                }
            },
            menuPluginContainer: ".s-header-tools",
            addMenuPlugin: function(menuPlugin) {},
            misPluginContainer: ".easyui-layout",
            addMisPlugin: function(misPlugin) {},
            activeMisPlugin: function(misPlugin, isForced) {},
            mapPluginContainer: "body",
            addMapPlugin: function(mapPlugin) {}
        });

        z.inherit(z.Class, z.plugin.BasePlugin, {
            pluginTypes: "BasePlugin",
            pluginKey: "zBasePlugin",
            name: null,
            hook: null,
            inited: null,
            render: function(hook) {},
            init: function(hook) {
                if (typeof(this.inited) == "function") {
                    this.inited.apply(this, arguments);
                }
            },
            destroy: function() {
                delete this;
            }
        });

        z.inherit(z.plugin.BasePlugin, z.plugin.MenuPlugin, {
            pluginTypes: "MenuPlugin",
            pluginKey: "zMenuPlugin",
            group: null,
            tooltip: null,
            style: "icon label tooltip",
            themeCls: "",
            iconCls: "",
            sortIndex: null,
            href: null,
            click: null,
            menuDom: null
        });

        z.inherit(z.plugin.BasePlugin, z.plugin.ListPlugin, {
            pluginTypes: "ListPlugin",
            pluginKey: "zListPlugin",
            pageTag: "div",
            pageDom: null,
            pageContainer: null,
            pageSrc: null,
            isParsed: false,
            isPageHtmLoaded: false,
            pageHtmSuccess: null,
            pageHtmParsed: null,
            pageParsed: null,
            parsePage: function(options) {
                if (typeof(this.pageParsed) == "function") {
                    this.pageParsed.apply(this, arguments);
                }
            },
            parsePageContainer: function(options) {
                if (typeof(this.pageHtmParsed) == "function") {
                    this.pageHtmParsed.apply(this, arguments);
                }
            }
        });

        z.inherit([
            z.plugin.BasePlugin, z.plugin.ListPlugin
        ], z.plugin.MisPlugin, {
            pluginTypes: "MisPlugin",
            pluginKey: "zMisPlugin",
            group: null,
            iconCls: "",
            ignoreMenu: false,
            sortIndex: null,
            selected: null,
            select: function() {
                if (typeof(this.selected) == "function") {
                    this.selected.apply(this, arguments);
                }
            }
        });

        z.inherit(z.plugin.BasePlugin, z.plugin.MapPlugin, {
            pluginTypes: "MapPlugin",
            pluginKey: "zMapPlugin",
            options: {},
            mapDom: null,
            mapObj: null,
            destroy: function() {
                $(this.mapDom).remove();
                delete this.mapObj;
                delete this;
            },
            isMapObjFun: function(target) {
                return this.mapObj && typeof(this.mapObj[target]) == "function";
            },
            getCenter: function() {
                if (this.isMapObjFun("getCenter")) {
                    return this.mapObj.getCenter();
                } else {
                    return this.mapObj.center;
                }
            },
            setCenter: function(point) {
                if (this.isMapObjFun("setCenter")) {
                    this.mapObj.setCenter(point);
                } else {
                    this.mapObj.center = center;
                }
            },
            getZoom: function() {
                if (this.isMapObjFun("getZoom")) {
                    return this.mapObj.getZoom();
                } else {
                    return this.mapObj.zoom;
                }
            },
            setZoom: function(zoom) {
                if (this.isMapObjFun("setZoom")) {
                    this.mapObj.setZoom(zoom);
                } else {
                    this.mapObj.zoom = zoom;
                }
            },
            getMaxZoom: function() {
                if (this.isMapObjFun("getMaxZoom")) {
                    return this.mapObj.getMaxZoom();
                } else {
                    return this.mapObj.maxZoom;
                }
            },
            getMinZoom: function() {
                if (this.isMapObjFun("getMinZoom")) {
                    return this.mapObj.getMinZoom();
                } else {
                    return this.mapObj.minZoom;
                }
            },
            getScale: function() {
                if (this.isMapObjFun("getScale")) {
                    return this.mapObj.getScale();
                } else {
                    return this.mapObj.scale;
                }
            },
            setScale: function(scale) {
                if (this.isMapObjFun("setScale")) {
                    this.mapObj.setScale(scale);
                } else {
                    this.mapObj.scale = scale;
                }
            },
            getMaxScale: function() {
                if (this.isMapObjFun("getMaxScale")) {
                    return this.mapObj.getMaxScale();
                } else {
                    return this.mapObj.maxScale;
                }
            },
            getMinScale: function() {
                if (this.isMapObjFun("getMinScale")) {
                    return this.mapObj.getMinScale();
                } else {
                    return this.mapObj.minScale;
                }
            },
            clear: function() {},
            print: function(callback, option) {},
            getDrawStatus: function() {},
            startDraw: function(type, style, callback, option) {},
            drawStoped: null,
            stopDraw: function() {
                if (typeof(this.stopDrawed) == "function") {
                    this.stopDrawed.apply(this, arguments);
                }
            },
            calcLength: function() {},
            calcArea: function() {},
            getMeasureStatus: function() {},
            startMeasure: function(type, style, callback, option) {},
            measureStoped: null,
            stopMeasure: function() {
                if (typeof(this.measureStoped) == "function") {
                    this.measureStoped.apply(this, arguments);
                }
            }
        });

        $(function() {
            z.command.init();
            for (var i = 0, length = z.plugin.hooks.length; i < length; i++) {
                var hook = z.plugin.hooks[i];
                hook.init();
            }
        });
    }
})(window);