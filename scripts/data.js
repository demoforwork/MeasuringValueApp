//Data Scope
var data = {};
window.data = data;

data.business_functions = null;
data.business_function = null; // the one chosen in the first form
data.business_processes = null; // all selected business processes
data.business_process = null; // current business processes
data.bp_num = null;
data.measures = null;
data.industry = null;
data.result = new Result();
data.company = null;
data.ranks = [];

data.initialize = function() {
    settings.log("data.initialize() enter");
    serve_json.getJSON(function(e) {
        var d = $.parseJSON($.parseJSON(e).data);
        settings.log( d );
        data.business_functions = d.business_functions;
        data.measures = d.measures;
        data.industry = d.industry;
        settings.log(data.business_functions);
        var select = $("#bp-select");
        settings.log(data.business_functions.length);
        for (var i = 0; i < data.business_functions.length; i++) {
            var option = $("<option/>").text(data.business_functions[i].name).attr("value", i);
            select.append(option);
        }
    });

    settings.log("data.initialize() exit");
};
