var MarineProfile = MarineProfile || {};

MarineProfile.registerLayers = function() {
    // TODO how can we make these layers wrap around the world?
    var layer_shading = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http:///osm.franken.de:8080/geoserver/wms',
            params: {layers: 'gebco:deepshade_2014', format:"image/png", transparent:"true"},
        }),
        name: "Deepwater shading",
        opacity: 0.5,
        minResolution: 38.22,
        extent: ol.proj.transformExtent([-180, -85, 180, 85], 'EPSG:4326', 'EPSG:3857'),
    });
 
    var layer_profile = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://osm.franken.de:8080/geoserver/wms',
            params: {layers: 'gebco_new', format: "image/png"},
        }),
        name: "Profile",
        opacity: 0.5,
        extent: ol.proj.transformExtent([-180, -85, 180, 85], 'EPSG:4326', 'EPSG:3857'),
    });
    var group = new ol.layer.Group({
        layers: [layer_profile, layer_shading],
        name: "Marine Profile",
        visible: false
    });
    map.addLayer(group);
};
