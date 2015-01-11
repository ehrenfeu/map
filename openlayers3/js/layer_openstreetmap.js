var OpenStreetMap = OpenStreetMap || {};

OpenStreetMap.registerLayers = function() {
    var key = 'openstreetmap';
    var layer =  new ol.layer.Tile({
        source: new ol.source.OSM(),
        name: "OpenStreetMap",
        visible: showLayerAccordingToCookie(key, true),
    });
    layer.isBaseLayer = true;
    addCookieUpdater(layer, key);
    map.addLayer(layer);
};
