var settings = {};

settings.MACRO_URL = 'https://script.google.com/macros/s/AKfycbyDiOgyn7Otd-GL7Vt5CDerVvy-lBAeoOe1JtCpMcfPIowAlUpn/exec';

settings.SERVE_JSON_URL = 'https://script.google.com/macros/s/AKfycbxXRtCe6l56Z76VcYuf0o23SAmZgrXPHAHbWncnhTx_JxzIVb9c/exec';

/**
 * prepares URL for get & post requests
 * @param {Map (String->String)} params parameters that will be appended to the URL
 * @param {String} macro URL for the call endpoint
 * @returns {String} prepared URL
 */
settings.prepareURL = function(params, macro) {
    var url = [];
    url.push(macro);
    url.push('?');
    if (params) {
        for (var key in params) {
            url.push(key);
            url.push('=');
            url.push(params[key]);
            url.push('&');
        }
    }
    url.pop();
    console.log(url.join(''));
    return url.join('');
};


settings.debug = true;

settings.log = function (string) {
    if (settings.debug) console.log(string);
};

