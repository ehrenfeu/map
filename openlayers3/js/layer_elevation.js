var Elevation = Elevation || {};

Elevation.registerLayers = function() {
    var key_shading = "elev_shade";
    var layer_shading = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://openmapsurfer.uni-hd.de/tiles/asterh/x={x}&y={y}&z={z}'
        }),
        minResolution: 19.109257068634033,
        name: "Shading",
        preload: 2, // TODO
        visible: showLayerAccordingToCookie(key_shading, true),
    });
    addCookieUpdater(layer_shading, key_shading);

    var key_contour = "elev_cont";
    var layer_contour_lines = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://openmapsurfer.uni-hd.de/tiles/asterc/x={x}&y={y}&z={z}'
        }),
        minResolution: 1.194328566789627,
        maxResolution: 19.109257068634033,
        name: "Contour lines",
        preload: 2,
        visible: showLayerAccordingToCookie(key_contour, true),
    });
    addCookieUpdater(layer_contour_lines, key_contour);

    var key_elevation = "elev";
    var group = new ol.layer.Group({
        layers: [layer_shading, layer_contour_lines],
        name: "Elevation Profile",
        visible: showLayerAccordingToCookie(key_elevation, false),
    });
    addCookieUpdater(group, key_elevation);
    map.addLayer(group);
};
