var foldername = "ValueMeasureAppSettings";
function doPost(request) {
    var response = {};
    response.message = '';
    response.status = 200;
    response.data = {};

    var action;

    try {
        action = request.parameter.action;
        if (action == 'getJSON') {
            var fileit = DriveApp.getFoldersByName(foldername).next().getFilesByName("settings.json");
            var file;
            if (fileit.hasNext()) {
                file = fileit.next();
                response.data = file.getBlob().getDataAsString();
            } else {
                response.status = 2962;
            }
        } else if (action == 'postJSON') {
            try {
                var content = request.parameter.content;
                var fileit = DriveApp.getFoldersByName(foldername).next().getFilesByName("settings.json");
                if (fileit.hasNext()) {
                    var file = fileit.next();
                    // file.setContent(JSON.stringify(content));
                    file.setContent(content);
                } else {
                    // tworz nowy 
                }
            } catch (e) {
                response.status = 2963;
            }
        } else {
            response.status = 2961;
        }
    } catch (e) {
        response.status = 2960;
    }
    return ContentService.createTextOutput(JSON.stringify(response));
}
