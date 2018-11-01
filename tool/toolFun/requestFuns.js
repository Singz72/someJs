//跳转函数
var hopLink = {
    goToURL(URL, data, openUrl) {
        $.ajax({
            type: "GET",
            async: false,
            data: data,
            url: URL,
            success: function(msg) {
                window.open(openUrl);
            },
            error: function() {
                window.open(openUrl);
            }
        });
    }
}