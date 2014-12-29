var Stamen = Stamen || {};

Stamen.registerLayers = function() {
    var layer = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'watercolor'
        }),
        name: 'Watercolor',
        visible: false
    });
    map.addLayer(layer);
    
    var layer = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'terrain-labels'
        }),
        name: 'Terrain labels',
        visible: false
    });
    map.addLayer(layer);
};
