var BingAerial = BingAerial || {};

BingAerial.queryKey = "la";

BingAerial.registerLayers = function() {
    var key = 'aerial';
    var show = evaluateLayerVisibility(BingAerial.queryKey, key, false);
    var layer = new ol.layer.Tile({
        name: 'Aerial photo',
        visible: show,
        preload: Infinity,
        source: new ol.source.BingMaps({
            key: 'AuA1b41REXrEohfokJjbHgCSp1EmwTcW8PEx_miJUvZERC0kbRnpotPTzGsPjGqa',
            imagerySet: 'AerialWithLabels'
        })
    });
    layer.isBaseLayer = true;
    addCookieUpdater(layer, key);
    map.addLayer(layer);
}
