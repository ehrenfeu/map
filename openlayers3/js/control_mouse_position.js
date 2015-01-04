var MousePosition = MousePosition || {};


MousePosition.registerControl = function() {
    var ctrl = new ol.control.MousePosition({
        coordinateFormat: coordinateToString,
        projection: ol.proj.get('EPSG:4326')});
    map.addControl(ctrl);
};
