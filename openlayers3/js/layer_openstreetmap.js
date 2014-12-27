var OpenStreetMap = OpenStreetMap || {};

OpenStreetMap.registerLayers = function() {
    var layer =  new ol.layer.Tile({
        source: new ol.source.OSM(),
        name: "OpenStreetMap"
    });
    map.addLayer(layer);
};
