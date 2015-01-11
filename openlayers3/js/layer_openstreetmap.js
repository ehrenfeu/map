var OpenStreetMap = OpenStreetMap || {};

OpenStreetMap.queryKey = "lo";

OpenStreetMap.registerLayers = function() {
    var key = 'openstreetmap';
    var show = evaluateLayerVisibility(OpenStreetMap.queryKey, key, true);
    var layer =  new ol.layer.Tile({
        source: new ol.source.OSM(),
        name: "OpenStreetMap",
        visible: show,
    });
    layer.isBaseLayer = true;
    addCookieUpdater(layer, key);
    map.addLayer(layer);
};
