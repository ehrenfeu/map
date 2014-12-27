var SeaMarks = SeaMarks || {};

SeaMarks.registerLayers = function() {
    var layer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://t1.openseamap.org/seamark/{z}/{x}/{y}.png'
        }),
        name: "Sea marks"
    });
    map.addLayer(layer);
};
