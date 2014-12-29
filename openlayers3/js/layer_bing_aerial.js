var BingAerial = BingAerial || {};

BingAerial.registerLayers = function() {
    var layer = new ol.layer.Tile({
        name: 'Aerial photo',
        visible: false,
        preload: Infinity,
        source: new ol.source.BingMaps({
            key: 'AuA1b41REXrEohfokJjbHgCSp1EmwTcW8PEx_miJUvZERC0kbRnpotPTzGsPjGqa',
            imagerySet: 'AerialWithLabels'
        })
    });
    layer.isBaseLayer = true;
    map.addLayer(layer);
}
