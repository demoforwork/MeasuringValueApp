var foldername = "ValueMeasureApp";
var valueMeasureColumnOffset = 2;
// Script-as-app template.

function uploadFile(blob) {
    var file;
    file = DriveApp.getFoldersByName(foldername).next().getFoldersByName("pictures").next().createFile(blob);
    Logger.log("Created new image in Folder named 'pictures': pictures/" + file.getName());
    return file;
}

function doPost(event) {
    var response = {};
    response.message = '';
    response.status = 200;
    response.data = {};

    var json;
    var spreadsheet;
    try {
        json = JSON.parse(event.parameter.data);
    } catch (e) {
        response.status = 400;
        return ContentService.createTextOutput(JSON.stringify(response));
    }
    var folder;
    try {
        var folder1 = DriveApp.getFoldersByName(foldername);
        if (folder1.hasNext()) {
            folder = folder1.next();
        } else {
            folder = DriveApp.createFolder(foldername);
        }
    } catch (e) {
        response.status = 401;
        return ContentService.createTextOutput(JSON.stringify(response));
    }
    var file;
    var sheet;
    try { 

        file = folder.getFilesByName(json.business_function);
        if (!file.hasNext()) {
            spreadsheet = SpreadsheetApp.create(json.business_function);
            var tmpfile = DocsList.getFileById(spreadsheet.getId());
            var tmpfolder = DocsList.getFolder(foldername);
            tmpfile.addToFolder(tmpfolder);
            tmpfile.removeFromFolder(DocsList.getRootFolder());
        } else {
            var f;
            var done = false;
            while (file.hasNext() && !done) {
                f = file.next();
                spreadsheet = SpreadsheetApp.openById(f.getId());
                try {
                    sheet = spreadsheet.insertSheet(json.company);
                    done = true;
                } catch (e) {
                    done = false;
                }
            }
            if (!done) {
                spreadsheet = SpreadsheetApp.create(json.business_function);
                var tmpfile = DocsList.getFileById(spreadsheet.getId());
                var tmpfolder = DocsList.getFolder(foldername);
                tmpfile.addToFolder(tmpfolder);
                tmpfile.removeFromFolder(DocsList.getRootFolder());
            }

        }

    } catch (e) {
        response.status = 402;
        return ContentService.createTextOutput(JSON.stringify(response));
    }

    try {
        var list = [];
        list.push("Rank");
        list.push("Key processes");

        for (var i = 0; i < json.measures.length; i++) {
            list.push(json.measures[i].name);
        }
        sheet.appendRow(list);
        var firstrow = sheet.getRange("R[0]C[0]:R[0]C["+sheet.getLastColumn()+"]");
        firstrow.setFontWeight("bold");
        for (var j = 0; j < json.business_processes.length; j++) {
            list = [];
            list.push(json.business_processes[j].rank);
            list.push(json.business_processes[j].name);
            for (var k = 0; k < json.business_processes[j].measures.length; k++) {
                list.push(json.business_processes[j].measures[k].value);
            }
            sheet.appendRow(list);
        }

    } catch (e) {
        response.status = 404;
        response.message = e;
        return ContentService.createTextOutput(JSON.stringify(response));
    }
    var totalrow;
    try {
        var lr = sheet.getLastRow() - 1;
        sheet.appendRow([" ", "Total"]);
        var row = lr + 1;
        var cell;
        for (var i = valueMeasureColumnOffset; i < json.measures.length + valueMeasureColumnOffset; i++) {
            cell = sheet.getRange("R["+row+"]C["+i+"]");
            cell.setFormulaR1C1("=SUM(R[-"+lr+"]C[0]:R[-1]C[0])");
        }
        totalrow = sheet.getRange("R["+row+"]C[0]:R["+row+"]C["+sheet.getLastColumn()+"]");
        totalrow.setFontWeight("bold");
        sheet.insertRows(row+1);
    } catch (e) {
        response.status = 405;
        return ContentService.createTextOutput(JSON.stringify(response));
    }

    try {
        var optional_metrics;
        sheet.appendRow(["Optional metrics", "Before", "After"]);
        //sheet.getRange("R["+sheet.getLastRow()+"]C[0]:R["+sheet.getLastRow()+"]C["+sheet.getLastColumn()+"]").setFontWeight("bold");
        sheet.insertRows(sheet.getLastRow(), 2);
        for (var i = 0; i < json.business_processes.length; i++) {
            for (var j = 0; j < json.business_processes[i].optional_metrics.length; j++) {
                optional_metrics = json.business_processes[i].optional_metrics[j];
                sheet.appendRow([optional_metrics.name, optional_metrics.before, optional_metrics.after]);
            }
        }

    } catch (e) {
        response.status = 406;
        return ContentService.createTextOutput(JSON.stringify(response));
    }
    try {
        var stories;
        sheet.appendRow(["Key process", "Industry", "Before", "After", "Impact", "Salesforce ID", "Contact name", "Contact role", "Contact data", "Picture"]);
        //sheet.getRange("R["+sheet.getLastRow()+"]C[0]:R["+sheet.getLastRow()+"]C["+sheet.getLastColumn()+"]").setFontWeight("bold");
        sheet.insertRows(sheet.getLastRow(), 2);

        for (var i = 0; i < json.business_processes.length; i++) {
            try {
                var story = json.business_processes[i].story;

                try {
                    var blob = Utilities.newBlob(Utilities.base64Decode(story.blob), story.data_type, "Picture");
                    var upd_file = uploadFile(blob);
                    sheet.appendRow([json.business_processes[i].name,
                            story.name, story.before,
                            story.after, story.impact,
                            story.salesforce_id,
                            story.contact_name, story.contact_role,
                            story.contact_data, upd_file.getUrl()]);
                } catch (e) {
                    Logger.log("No picture");
                    sheet.appendRow([json.business_processes[i].name,
                            story.name, story.before,
                            story.after, story.impact,
                            story.salesforce_id,
                            story.contact_name, story.contact_role,
                            story.contact_data]);
                }
            } catch (e) {
                response.message = "No story" + response.message;
            }
        }
    } catch (e) {
        response.status = 408;
        return ContentService.createTextOutput(JSON.stringify(response));
    }
    try {
        var data = sheet.getRange("R[0]C[1]:R["+totalrow.getRowIndex()+"]C["+(sheet.getLastColumn()-1)+"]");
        var chart = sheet.newChart()
            .asColumnChart()
            .addRange(data)
            .setChartType(Charts.ChartType.COLUMN)
            .setPosition(sheet.getLastRow() + 5, 1, 0, 0)
            .build();
        sheet.insertChart(chart);
    } catch (e) {
        response.status = 407;
        return ContentService.createTextOutput(JSON.stringify(response));
    }
    return ContentService.createTextOutput(JSON.stringify(response));
}
