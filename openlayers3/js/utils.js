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
