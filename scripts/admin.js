$(document).ready(function () {
    admin.init();
});
var admin = {};

admin.init = function () {
    serve_json.getJSON(function(e) {
        var d = $.parseJSON($.parseJSON(e).data);
        console.log(d);
        admin.data = d;
        console.log(admin.data);

        var i = 0;
        var adm = $(".admin-panel");


        var m = $("<div/>").addClass("measures").attr("data-arrayname", "measures").html("<h2>Measures</h2>");
        for (i = 0; i < d.measures.length; i++) {
            var mm = $("<div/>").attr("data-object-attr-name", "name")
                    .attr("data-object-attr-value", d.measures[i].name)
                    .html("<span>"+d.measures[i].name+"</span>");
            m.append(mm);
        }
        adm.append(m);

        var ind = $("<div/>").addClass("industry").attr("data-arrayname", "industry").html("<h2>Industry</h2>");
        for (i = 0; i < d.industry.length; i++) {
            var indi = $("<div/>").attr("data-object-attr-name", "name")
                        .attr("data-object-attr-value", d.industry[i].name)
                        .html("<span>"+d.industry[i].name+"</span>");
            ind.append(indi);
        }
        adm.append(ind);


        var bfs = $("<div/>").attr("data-arrayname", "business_functions")
                .attr("data-arraysize", d.business_functions.length)
                .html("<h2>Business functions</h2>").addClass("bf");

        for (i = 0; i < d.business_functions.length; i++) {
            var bf = $("<div/>").attr("data-object-attr-name", "name")
                    .attr("data-object-attr-value", d.business_functions[i].name)
                    .html("<h3>"+d.business_functions[i].name+"</h3>");

            var bps = $("<div/>").attr("data-arrayname", "business_processes")
                    .attr("data-arraysize", d.business_functions[i].business_processes.length)
                    .html("<h4>Business processes</h4>")
                    .addClass("bp");
            for (var j = 0; j < d.business_functions[i].business_processes.length; j++) {
                var bp = $("<div/>").attr("data-object-attr-name", "name")
                        .attr("data-object-attr-value", d.business_functions[i].business_processes[j].name)
                        .html("<span>"+d.business_functions[i].business_processes[j].name+"</span>");
                var opts = $("<div/>").attr("data-arrayname", "optional_metrics")
                        .attr("data-arraysize", d.business_functions[i].business_processes[j].optional_metrics.length)
                        .html("<h5>Optional metrics</h5>")
                        .addClass("om");
                for (var k = 0; k < d.business_functions[i].business_processes[j].optional_metrics.length; k++) {
                    var opt = $("<div/>").attr("data-object-attr-name", "name")
                            .attr("data-object-attr-value", d.business_functions[i].business_processes[j].optional_metrics[k].name)
                            .html("<span>"+d.business_functions[i].business_processes[j].optional_metrics[k].name+"</span>");
                    opts.append(opt);
                }
                bp.append(opts);
                bps.append(bp);
            }
            bf.append(bps);
            bfs.append(bf);
        }
        var emptyopt = $("<div/>").attr("data-object-attr-name", "name")
                        .attr("data-object-attr-value", "")
                        .html("<span></span>")
                        .addClass("emptyopt");
        adm.append(emptyopt);

        var emptybp = $("<div/>").attr("data-object-attr-name", "name")
                    .attr("data-object-attr-value", "")
                    .addClass("emptybp")
                    .html("<span></span>");
        var emptyopts = $("<div/>").attr("data-arrayname", "optional_metrics")
                    .attr("data-arraysize", "")
                    .html("<h5>Optional metrics</h5>")
                    .addClass("om");
        emptybp.append(emptyopts);
        adm.append(emptybp);

        var emptybf = $("<div/>").attr("data-object-attr-name", "name")
                .attr("data-object-attr-value", "")
                .addClass("emptybf")
                .html("<h3></h3>");
        var emptybps = $("<div/>").attr("data-arrayname", "business_processes")
                .attr("data-arraysize", "")
                .html("<h4>Business processes</h4>")
                .addClass("bp");

        emptybf.append(emptybps);
        adm.append(emptybf);

        var emptymm = $("<div/>").attr("data-object-attr-name", "name")
                .attr("data-object-attr-value", "")
                .addClass("emptymm")
                .html("<span></span>");

        adm.append(emptymm);
        
        var emptyind = $("<div/>").attr("data-object-attr-name", "name")
                .attr("data-object-attr-value", "")
                .addClass("emptyind")
                .html("<span></span>");

        adm.append(emptyind);

        adm.append(bfs);

        var savebutton = $("<input/>").attr("type", "submit").addClass("btn").attr("value", "Save all");
        adm.append(savebutton);

        savebutton.click(function () {
            var string = admin.toJSON();
            serve_json.postJSON(admin.showMsg("Saved!"), string);
        });

        flipper.openPage("#admin");
    });
};

admin.ok = function (obj, what) {
    settings.log("save");
    settings.log(obj);
    settings.log(what);
    var value = obj.prev("input").val();
    if (value === "") {
        obj.prev("input").remove();
        obj.parent().remove();
        obj.remove();
    } else {
        obj.prev("input").remove();
        obj.parent().attr("data-object-attr-value", value);
        what.text(value);
        obj.after(what);
        obj.remove();
    }
};

admin.addnew = function (obj, what, name, inside) {
    settings.log("add new");
    var elem = $("."+name).clone().removeClass(name);
    obj.parent().append(elem);
    elem.find(inside).trigger("click");
    settings.log(elem);
};

admin.edit = function (obj, what) {
    var value = obj.text();
    var input = $("<input/>").addClass("form-control").attr("type", "text").val(value);
    var ok = $("<input/>").attr("type", "submit").addClass("btn").attr("value", "OK");

    obj.after(ok).after(input);
    obj.remove();
    ok.click(function() {
        admin.ok($(this), what);
    });
};

$(document).on("click", ".om h5", function() {
    admin.addnew($(this), $("<span/>"), "emptyopt", "span");
});

$(document).on("click", ".om div span", function () {
    admin.edit($(this), $("<span/>"));
});

$(document).on("click", ".bp h4", function() {
    admin.addnew($(this), $("<span/>"), "emptybp", "span");
});

$(document).on("click", ".bp div span", function () {
    admin.edit($(this), $("<span/>"));
});
$(document).on("click", ".bf h2", function() {
    admin.addnew($(this), $("<h3/>"), "emptybf", "h3");
});

$(document).on("click", ".bf div h3", function () {
    admin.edit($(this), $("<h3/>"));
});

$(document).on("click", ".measures h2", function() {
    admin.addnew($(this), $("<span/>"), "emptymm", "span");
});

$(document).on("click", ".measures div span", function () {
    admin.edit($(this), $("<span/>"));
});

$(document).on("click", ".industry h2", function() {
    admin.addnew($(this), $("<span/>"), "emptyind", "span");
});

$(document).on("click", ".industry div span", function () {
    admin.edit($(this), $("<span/>"));
});
admin.objToJSON = function (obj) {
    var string = "";
    string += '"'+ obj.attr('data-object-attr-name') + '": ';
    string += '"' + obj.attr('data-object-attr-value') + '"';
    return string;
};

admin.measuresToJSON = function () {
    var string = ' "measures": [ ';
    var i = 0;
    $(".measures div").each(function () {
        if (i > 0) string += ", ";
        string += " { ";
        string += admin.objToJSON($(this));
        string += " } ";
        ++i;
    });
    string += " ]";
    settings.log(string);
    return string;
};
admin.industryToJSON = function () {
    var string = ' "industry": [ ';
    var i = 0;
    $(".industry div").each(function () {
        if (i > 0) string += ", ";
        string += " { ";
        string += admin.objToJSON($(this));
        string += " } ";
        ++i;
    });
    string += " ]";
    settings.log(string);
    return string;
};

admin.omToJSON = function (obj) {
    var string = ' { ';

    string += admin.objToJSON(obj);

    string += ' } ';
    return string;
};

admin.bpToJSON = function (obj) {
    var string = ' { ';

    string += admin.objToJSON(obj);

    string += ', ';
    string += ' "optional_metrics": [ ';
    var i = 0;
    obj.find(".om").children("div").each(function () {
        if (i > 0) string += ', ';
        string += admin.omToJSON($(this));
        ++i;
    });

    string += ' ]';
    string += ' } ';
    return string;
};

admin.bfToJSON = function (obj) {
    var string = ' { ';
    string += admin.objToJSON(obj);
    string += ', ';
    string += ' "business_processes": [ ';
    var i = 0;
    obj.find(".bp").children("div").each(function () {
        if (i > 0) string += ', ';
        string += admin.bpToJSON($(this));
        ++i;
    });

    string += ' ]';
    string += ' } ';
    return string;
};

admin.bfsToJSON = function () {
    var string = ' "business_functions": [ ';
    var i = 0;
    $(".bf").children("div").each(function () {
        if (i > 0) string += ", ";
        string += admin.bfToJSON($(this));
        ++i;
    });

    string += ' ]';
    settings.log(string);
    return string;
};

admin.toJSON = function () {
    var string = " { ";
    
    string += admin.measuresToJSON();
    string += ', ';

    string += admin.bfsToJSON();
    
    string += ', ';
    string += admin.industryToJSON();

    string += " } ";
    settings.log(string);
    return string;
};
admin.showMsg = function(message) {
    $('#overlay-error .error').html(message);
    flipper.openOverlay('#overlay-error');
};
admin.closeOverlay = function() {
    settings.log("close");
    flipper.closeOverlay();
};
$(document).on("click", '#overlay-error .continue', admin.closeOverlay);
