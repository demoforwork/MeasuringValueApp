$(document).ready(function() {
    main.initialize();
});

//Main Scope
var main = {};
/**
 * Initialize the app
 * @returns {undefined}
 */
main.initialize = function() {
    settings.log("main.initialize() enter");
    //Load Data
    data.initialize();

    $("#company input[type=submit]").click(function () {
        // unique name of the company (just in case we have 2 companies with
        // the same name or 2 entries from one company
        data.company = $("#company input[type=text]").val() + '_' + $.now();
        flipper.openPage("#page-bf");
    });

    // selecting business function to assess and setting up the whole environment
    $("#page-bf .options button").click(function() {
        data.business_function = data.business_functions[$("#page-bf .options select").val()];
        data.result.setBusinessFunction(data.business_function);
        data.result.company = data.company;
        var list = [];
        for (var i = 0; i < data.business_function.business_processes.length; i++) {
            var bp = new BusinessProcess();
            bp.business_process = data.business_function.business_processes[i].name;
            list.push(bp);
        }
        data.result.business_processes = list;
        settings.log(data.business_function);
        settings.log(data.result.getJSON());
        flipper.openPage("#page-bp");
    });

    // creating sortable business processes
    $("#page-bp").on(flipper.Event.BEFORE_OPEN, function () {
        settings.log("page-bp BEFORE_OPEN");
        var select = $("#page-bp .options #select_options ul.select");
        var select2 = $("#page-bp .options #select_options ul.droppable").sortable();
        settings.log(data.business_function.business_processes.length);
        for (var i = 0; i < data.business_function.business_processes.length; i++) {
            var option = $("<li/>").text(data.business_function.business_processes[i].name).attr("data-value", i);
            select.append(option);
        }
    });

    // clicking business process on the first list makes it "jump" to the other section
    $(document).on('click', "#page-bp .options .select li", function () {
        var html = $(this).html();
        var li = $("<li/>").html(html).attr("data-value", $(this).attr("data-value"));
        $("ul.droppable").append(li);
        $(this).remove();
    });
    $(document).on('click', "#page-bp .options .droppable li", function () {
        var html = $(this).html();
        var li = $("<li/>").html(html).attr("data-value", $(this).attr("data-value"));
        $("ul.select").append(li);
        $(this).remove();
    });

    $("#page-bp .options button").click(function () {
        settings.log("All business processes were selected");
        if ($("#page-bp .options #select_options .droppable li").size() > 0) {
            var i = data.business_function.business_processes.length;
            $("#page-bp .options #select_options .droppable li").each(function () {
                if (data.business_processes === null) data.business_processes = [];
                data.business_processes.push($(this).attr("data-value"));
                data.ranks.push(i);
                i--;
            });
            settings.log(data.business_processes);
            flipper.openPage("#measures");
        } else {
            main.showError("You have to choose at least one business process affected by Google");
        }
    });

    $("#measures").on(flipper.Event.BEFORE_OPEN, function() {
        settings.log("measures BEFORE_OPEN");
        $("#measures .options button").attr("disabled", "disabled");
        $("#measures .options div").remove();
        if (data.business_processes !== null && data.business_processes.length > 0) {
            data.business_process = data.business_function.business_processes[data.business_processes[0]];
            data.bp_num = data.business_processes[0];
            settings.log(data.business_process);
            data.business_processes.splice(0, 1);

            // something with measures
            for (var i = data.measures.length - 1; i >= 0; i--) {
                var div = $("<div/>");
                div.text(data.measures[i].name);
                var select = $("<select/>").attr('data-name', div.text());
                for (var j = 0; j <= 10; j++) {
                    var option = $("<option/>").text(j);
                    select.append(option);
                }
                div.append(select);
                $("#measures .options").prepend(div);
            }

            $("#measures .options").prepend($("<div/>").html("<h2>"+data.business_process.name+"</h2>"));

        } else {
            flipper.openPage("#confirmation");
        }
    });

    $(document).on("change", "#measures .options select", function () {
        settings.log("select change!");
        var all = 0;
        $("#measures .options select").each(function () {
            all += parseInt($(this).val(), 10);
        });
        if (all > 10) {
            main.showError("You can't spread more than 10 points!");
            $("#measures .options button").attr("disabled", "disabled");
        } else if (all ===  10) {
            $("#measures .points .points_left").text(10-all);
            $("#measures .options button").removeAttr("disabled");
        } else {
            $("#measures .points .points_left").text(10-all);
            $("#measures .options button").attr("disabled", "disabled");
        }
        settings.log(all);
    });

    $("#measures .options button").click(function () {
        var all = 0;
        $("#measures .options select").each(function () {
            all += parseInt($(this).val(), 10);
        });
        if (all === 10) {
            var x = $("#measures .options select");
            var l = [];
            x.each(function () {
                var m = new Measures();
                m.value = $(this).val();
                l.push(m);

            });
            var rank = data.ranks[0];
            data.ranks.splice(0,1);
            data.result.addBusinessProcess(data.bp_num, data.business_process, l, rank);
            settings.log(data.result);
            if (data.business_process.optional_metrics.length > 0) {
                flipper.openPage("#optional_metrics");
            } else {
                flipper.openPage("#optional_stories");
            }
            // } else if (data.business_processes !== null && data.business_processes.length > 0) {
                // flipper.openPage("#measures2");
            // } else {
                // flipper.openPage("#confirmation");
            // }
        } else {
            main.showError("You have to spread exactly 10 points!");
        }
    });

    $("#optional_metrics").on(flipper.Event.BEFORE_OPEN, function () {
        var div = $("<div/>").addClass("optional_metric");
        for (var i = 0; i < data.business_process.optional_metrics.length; i++) {
            var option = $("<div/>").html("<h4>"+data.business_process.optional_metrics[i].name+"</h4>");
            var before = $("<div/>").text("Before: ").addClass("before");
            var after = $("<div/>").text("After: ").addClass("after");
            var input = $("<input/>").addClass("form-control").attr("type", "numeric").val(0);
            var input2 = $("<input/>").addClass("form-control").attr("type", "numeric").val(0);
            before.append(input);
            after.append(input2);
            option.append(before).append(after);
            div.append(option);
        }
        $("#optional_metrics .options").prepend(div);
    });

    $("#optional_metrics .options button").click(function () {
        var metrics = [];
        $("#optional_metrics .options .optional_metric").each(function () {
            var metric = new OptMetrics();
            metric.name = $(this).find("h4").text();
            metric.before = $(this).find(".before input").val();
            metric.after = $(this).find(".after input").val();
            metrics.push(metric);
        });
        data.result.business_processes[data.bp_num].optional_metrics = metrics;
        flipper.openPage("#optional_stories");
    });

    $(document).on("change", ".blob input[type='file']", function (event) {
        settings.log(event);
        var story;
        if (data.result.business_processes[data.bp_num].story === null) {
            story = new Story();
        } else {
            story = data.result.business_processes[data.bp_num].story;
        }
        var files = event.target.files; // FileList object

        story.data_type = files[0].type;

        var f = files[0];
        if (f) {
            var r = new FileReader();
            r.onload = function(e) { 
                var contents = e.target.result;
                story.blob = contents.replace(/^data:.*;base64,/, "");
                console.log(story.blob);
            };
            r.readAsDataURL(f);
        } else { 
            alert("Failed to load file");
        }

        data.result.business_processes[data.bp_num].story = story;
        
    });

    $("#optional_stories .options button").click(function () {
        var story;
        if (data.result.business_processes[data.bp_num].story === null) {
            story = new Story();
        } else {
            story = data.result.business_processes[data.bp_num].story;
        }
        story.name = $("select[name='industry']").val();
        story.before = JSON.stringify($(".before textarea").val());
        story.after = JSON.stringify($(".after textarea").val());
        story.impact = JSON.stringify($(".impact textarea").val());
        story.contact_name = JSON.stringify($(".contact_name input").val());
        story.contact_role = JSON.stringify($(".contact_role input").val());
        story.contact_data = JSON.stringify($(".contact_data input").val());
        story.salesforce_id = JSON.stringify($(".salesforce_id input").val());
        data.result.business_processes[data.bp_num].story = story;

        if (data.business_processes !== null && data.business_processes.length > 0) {
            flipper.openPage("#measures2");
        } else {
            flipper.openPage("#confirmation");
        }

    });

    $("#optional_stories").on(flipper.Event.BEFORE_OPEN, function () {
        var div = $("<div/>").addClass("optional_stories");
        var title = $("<h4/>").text("Industry");
        var select = $("<select/>").attr("name", "industry");
        for (var i = 0; i < data.industry.length; i++) {
            var option = $("<option/>").text(data.industry[i].name);
            select.append(option);
        }
        div.append(title);
        div.append(select);
        var before = $("<div/>").addClass("before");
        before.append($("<h4/>").text("Old Process before 'Going Google'"));
        before.append($("<textarea/>").attr("name", "before").addClass("form-control"));
        div.append(before);

        var after = $("<div/>").addClass("after");
        after.append($("<h4/>").text("New Process after 'Going Google'"));
        after.append($("<textarea/>").attr("name", "after").addClass("form-control"));
        div.append(after);

        var impact = $("<div/>").addClass("impact");
        impact.append($("<h4/>").text("Impact"));
        impact.append($("<textarea/>").attr("name", "impact").addClass("form-control"));
        div.append(impact);

        var salesforce_id = $("<div/>").addClass("salesforce_id");
        salesforce_id.append($("<h4/>").text("Salesforce Customer Account ID"));
        salesforce_id.append($("<input/>").attr("name", "salesforce_id").addClass("form-control"));
        div.append(salesforce_id);

        var contact_name = $("<div/>").addClass("contact_name");
        contact_name.append($("<h4/>").text("Customer contact name"));
        contact_name.append($("<input/>").attr("name", "contact_name").addClass("form-control"));
        div.append(contact_name);

        var contact_role = $("<div/>").addClass("contact_role");
        contact_role.append($("<h4/>").text("Customer contact role"));
        contact_role.append($("<input/>").attr("name", "contact_role").addClass("form-control"));
        div.append(contact_role);

        var contact_data = $("<div/>").addClass("contact_data");
        contact_data.append($("<h4/>").text("Customer contact data"));
        contact_data.append($("<input/>").attr("name", "contact_data").addClass("form-control"));
        div.append(contact_data);

        var blob = $("<div/>").addClass("blob");
        blob.append($("<h4/>").text("Please upload any relevant picture or screenshot of the Solution"));
        blob.append($("<input/>").attr("type", "file").addClass("form-control"));
        div.append(blob);

        $("#optional_stories .options").prepend(div);
    });

    $("#measures2 button").click(function () {
        flipper.openPage("#measures");
    });

    $("#confirmation").on(flipper.Event.BEFORE_OPEN, function () {
        settings.log("sending to the spreadsheet");
        data.result.measures = data.measures;
        settings.log(data.result.getJSON());
        spreadsheet.pushResult(function (e) { settings.log(e); }, data.result.getJSON());
    });


    //Overlay Close Buttons
    $('#overlay-error .continue').click(main.closeOverlay);
    $('#overlay-success .continue').click(main.closeOverlaySuccess);

    flipper.openPage('#company');
    settings.log("main.initialize() exit");
};

/**
 * Starts the app and resets the current session.
 * @returns {undefined}
 */
main.start = function() {
    flipper.openPage('#company');

    // reseting current session
    data.business_functions = null;
    data.business_function = null; // the one chosen in the first form
    data.business_processes = null; // all selected business processes
    data.business_process = null; // current business processes
    data.bp_num = null;
    data.measures = null;
    data.result = new Result();
    data.company = null;
    data.ranks = [];
};


/*******************************************************************************
 * Actions
 ******************************************************************************/
main.showError = function(message) {
    $('#overlay-error .error').html(message);
    flipper.openOverlay('#overlay-error');
};

/*******************************************************************************
 * Listeners
 ******************************************************************************/
main.closeOverlay = function() {
    flipper.closeOverlay();
};
