var SeaMarks = SeaMarks || {};

SeaMarks.queryKey = "ls";
SeaMarks.layer = 'undefined';

SeaMarks.registerLayers = function() {
    var key = "seamarks";
    var show = evaluateLayerVisibility(SeaMarks.queryKey, key, true);
    var layer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://t1.openseamap.org/seamark/{z}/{x}/{y}.png'
        }),
        name: "Sea marks",
        visible: show,
    });
    addCookieUpdater(layer, key);
    map.addLayer(layer);
    SeaMarks.layer = layer;
};

SeaMarks.updateQueryParam = function(query) {
    query[SeaMarks.queryKey] = SeaMarks.layer.getVisible() ? 's' : 'h';
}
