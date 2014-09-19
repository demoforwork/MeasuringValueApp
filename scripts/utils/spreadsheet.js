
(function(window, JSON) {
    var spreadsheet = {};
    window.spreadsheet = spreadsheet;

    spreadsheet.pushResult = function (callback, result) {
        settings.log("spreadsheet.pushResult(" + callback + ", " + result + ") enter");

        var d = result;
        var url = settings.prepareURL(null, settings.MACRO_URL);

        $.ajax({
            type: "POST",
            url: url,
            data: { data: d}
        }).done(callback);
        settings.log("spreadsheet.pushResult() exit");
    };

})(window, JSON);
