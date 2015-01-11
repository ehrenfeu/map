var Elevation = Elevation || {};

Elevation.queryKey = "le";
Elevation.queryKeyShading = "les";
Elevation.queryKeyContour = "lec";

Elevation.registerLayers = function() {
    var keyShading = "elev_shade";
    var showShading = evaluateLayerVisibility(Elevation.queryKeyShading,
                                              keyShading, true);
    var layer_shading = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://openmapsurfer.uni-hd.de/tiles/asterh/x={x}&y={y}&z={z}'
        }),
        minResolution: 19.109257068634033,
        name: "Shading",
        preload: 2, // TODO
        visible: showShading,
    });
    addCookieUpdater(layer_shading, keyShading);

    var keyContour = "elev_cont";
    var showContour = evaluateLayerVisibility(Elevation.queryKeyContour,
                                              keyContour, true);
    var layer_contour_lines = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://openmapsurfer.uni-hd.de/tiles/asterc/x={x}&y={y}&z={z}'
        }),
        minResolution: 1.194328566789627,
        maxResolution: 19.109257068634033,
        name: "Contour lines",
        preload: 2,
        visible: showContour,
    });
    addCookieUpdater(layer_contour_lines, keyContour);

    var keyElevation = "elev";
    var showElevation = evaluateLayerVisibility(Elevation.queryKey,
                                                keyElevation, false);
    var group = new ol.layer.Group({
        layers: [layer_shading, layer_contour_lines],
        name: "Elevation Profile",
        visible: showElevation,
    });
    addCookieUpdater(group, keyElevation);
    map.addLayer(group);
};
