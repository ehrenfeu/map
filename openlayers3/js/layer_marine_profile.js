var MarineProfile = MarineProfile || {};

MarineProfile.registerLayers = function() {
    // TODO how can we make these layers wrap around the world?
    var layer_shading = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http:///osm.franken.de:8080/geoserver/wms',
            params: {layers: 'gebco:deepshade_2014', format:"image/png", transparent:"true"},
        }),
        name: "Deepshade",
        opacity: 0.6, 
        minResolution: 38.22,
        extent: ol.proj.transformExtent([-180, -85, 180, 85], 'EPSG:4326', 'EPSG:3857'),
        visible: false,
    });
    map.addLayer(layer_shading);
 
    var layer_contours = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://osm.franken.de:8080/geoserver/wms',
            params: {layers: 'gebco_new', format: "image/png"},
        }),
        name: "Contours",
        opacity: 0.4, 
        extent: ol.proj.transformExtent([-180, -85, 180, 85], 'EPSG:4326', 'EPSG:3857'),
        visible: false,
    });
    map.addLayer(layer_contours);
};
