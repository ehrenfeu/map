var OpenStreetMap = OpenStreetMap || {};

OpenStreetMap.queryKey = "lo";
OpenStreetMap.layer = 'undefined';

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
    OpenStreetMap.layer = layer;
};

OpenStreetMap.updateQueryParam = function(query) {
    query[OpenStreetMap.queryKey] = OpenStreetMap.layer.getVisible() ? 's' : 'h';
}
