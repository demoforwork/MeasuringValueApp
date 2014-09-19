(function(window, JSON) {
    var serve_json = {};
    window.serve_json = serve_json;

    serve_json.getJSON = function (callback) {

        var url = settings.prepareURL(null, settings.SERVE_JSON_URL);

        $.ajax({
            type: "POST",
            url: url,
            data: { action: "getJSON" }
        }).done(callback);
    };

    serve_json.postJSON = function (callback, data) {
        var url = settings.prepareURL(null, settings.SERVE_JSON_URL);

        $.ajax({
            type: "POST",
            url: url,
            data: { action: "postJSON", content: data }
        }).done(callback);
    };

})(window, JSON);
