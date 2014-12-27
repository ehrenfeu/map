var MousePosition = MousePosition || {};

MousePosition.coordinateToString = function(coordinate) {
    padWithZeros = function(no, length) {
        no = no + '';
        return no.length >= length ? no : new Array(length - no.length + 1).join('0') + no;
    };
    var normalizedLatDegrees = ((coordinate[1] + 180) % 360) - 180;
    var normalizedLonDegrees = ((coordinate[0] + 180) % 360) - 180;
    var latsec = Math.abs(Math.round(3600 * normalizedLatDegrees));
    var result = normalizedLatDegrees < 0 ? "S" : "N";
    result += padWithZeros(Math.floor(latsec/3600), 2) + '\u00b0';
    result += padWithZeros(Math.floor((latsec/60) % 60), 2) + ".";
    result += padWithZeros(Math.floor(((latsec % 60)/60)*1000), 3) + '\u2032 ';
    var lonsec = Math.abs(Math.round(3600 * normalizedLonDegrees));
    result += normalizedLonDegrees < 0 ? "W" : "E";
    result += padWithZeros(Math.floor(lonsec/3600), 3) + '\u00b0';
    result += padWithZeros(Math.floor((lonsec/60) % 60), 2) + ".";
    result += padWithZeros(Math.floor(((lonsec % 60)/60)*1000), 3) + '\u2032 ';
    return result;
};

MousePosition.registerControl = function() {
    var ctrl = new ol.control.MousePosition({
        coordinateFormat: MousePosition.coordinateToString,
        projection: ol.proj.get('EPSG:4326')});
    map.addControl(ctrl);
};
