var OpenStreetMap = OpenStreetMap || {};

OpenStreetMap.registerLayers = function() {
    var layer =  new ol.layer.Tile({
        source: new ol.source.OSM(),
        name: "OpenStreetMap"
    });
    layer.isBaseLayer = true;
    map.addLayer(layer);
};
