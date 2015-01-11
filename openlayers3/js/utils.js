function stopAllSidebarServices() {
    for (var i = 0; i < sidebarservices.length; i++)
        sidebarservices[i].stop();
}

function degreesToStringShort(degrees, hemispheres) {
    var normalizedDegrees = ((degrees + 180) % 360) - 180;
    var sec = Math.abs(Math.round(3600 * normalizedDegrees));
    var min = (sec/60)%60;
    var result = Math.floor(sec/3600) + '\u00b0';
    if (!min)
        return result;
    if (min%1 === 0) // min is integer
        return result + min + '\u2032 ';
    return result + min.toFixed(1) + '\u2032 ';
}

function degreesToString(degrees, hemispheres) {
    var padWithZeros = function(no, length) {
        no = no + '';
        return no.length >= length ? no : new Array(length - no.length + 1).join('0') + no;
    };
    var normalizedDegrees = ((degrees + 180) % 360) - 180;
    var sec = Math.abs(Math.round(3600 * normalizedDegrees));
    var result = '';
    var pos = degrees < 0 ? 0 : 1;
    var padding = hemispheres[0] == 'W' ? 3 : 2;
    var result = hemispheres[pos];
    result += padWithZeros(Math.floor(sec/3600), padding) + '\u00b0';
    var min = (sec/60)%60;
    result += padWithZeros(Math.floor(min), 2) + ".";
    result += padWithZeros(Math.floor(((sec % 60)/60)*1000), 3) + '\u2032 ';
    return result;
}

function coordinateToString(coordinate) {
    return degreesToString(coordinate[1], ["S","N"]) +
           degreesToString(coordinate[0], ["W","E"]);
};

function round(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number*factor)/factor; 
};

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC"; 
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function addCookieUpdater(layer, cname) {
    layer.addEventListener('change:visible', function(e) {
        var val = e.currentTarget.getVisible() ? "show" : "hide";
        setCookie(cname, val, 180);
    });
}

function showLayerAccordingToCookie(cname, defaultValue) {
    if (defaultValue)
        return !(getCookie(cname) === 'hide');
    return getCookie(cname) === 'show';
}

queryStrings = {};
function registerQueryStringKey(key, defaultVal) {
    // TODO error if key is already tegistered
    queryStrings[key] = defaultVal;
}

function getQueryValues() {
    var queryStrings = {};
    var query = window.location.search.substring(1);
    console.log(query);
    var vars = query.split("&");
    for (var i=0; i<vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair.length == 2)
            queryStrings[pair[0]] = pair[1];
    }
    return queryStrings;
}

function evaluateLayerVisibility(queryKey, cookieKey, defaultVal) {
    if (queryStrings[queryKey] === 's')
        return true;
    if (queryStrings[queryKey] === 'h')
        return false;
    return showLayerAccordingToCookie(cookieKey, defaultVal);
}
