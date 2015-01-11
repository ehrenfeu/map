var SeaMarks = SeaMarks || {};

SeaMarks.registerLayers = function() {
    var key = "seamarks";
    var layer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://t1.openseamap.org/seamark/{z}/{x}/{y}.png'
        }),
        name: "Sea marks",
        visible: showLayerAccordingToCookie(key, true),
    });
    addCookieUpdater(layer, key);
    map.addLayer(layer);
};
