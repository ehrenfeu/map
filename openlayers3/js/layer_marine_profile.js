var MarineProfile = MarineProfile || {};

MarineProfile.registerLayers = function() {
    // TODO how can we make these layers wrap around the world?
    var key_shading = 'marine_shading';
    var layer_shading = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http:///osm.franken.de:8080/geoserver/wms',
            params: {layers: 'gebco:deepshade_2014', format:"image/png", transparent:"true"},
        }),
        name: "Deepwater shading",
        opacity: 0.5,
        minResolution: 38.22,
        extent: ol.proj.transformExtent([-180, -85, 180, 85], 'EPSG:4326', 'EPSG:3857'),
        visible: showLayerAccordingToCookie(key_shading, true),
    });
    addCookieUpdater(layer_shading, key_shading);
 
    var key_profile = 'marine_profile';
    var layer_profile = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://osm.franken.de:8080/geoserver/wms',
            params: {layers: 'gebco_new', format: "image/png"},
        }),
        name: "Profile",
        opacity: 0.5,
        extent: ol.proj.transformExtent([-180, -85, 180, 85], 'EPSG:4326', 'EPSG:3857'),
        visible: showLayerAccordingToCookie(key_profile, true),
    });
    addCookieUpdater(layer_profile, key_profile);
    var key = 'marine'
    var group = new ol.layer.Group({
        layers: [layer_profile, layer_shading],
        name: "Marine Profile",
        visible: showLayerAccordingToCookie(key, false),
    });
    addCookieUpdater(group, key);
    map.addLayer(group);
};
