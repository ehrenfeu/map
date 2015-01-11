var Elevation = Elevation || {};

Elevation.queryKey = "le";
Elevation.queryKeyShading = "les";
Elevation.queryKeyContour = "lec";

Elevation.layer = 'undefined';
Elevation.layerShading = 'undefined';
Elevation.layerContour = 'undefined';

Elevation.registerLayers = function() {
    var keyShading = "elev_shade";
    var showShading = evaluateLayerVisibility(Elevation.queryKeyShading,
                                              keyShading, true);
    var layerShading = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://openmapsurfer.uni-hd.de/tiles/asterh/x={x}&y={y}&z={z}'
        }),
        minResolution: 19.109257068634033,
        name: "Shading",
        preload: 2, // TODO
        visible: showShading,
    });
    addCookieUpdater(layerShading, keyShading);
    Elevation.layerShading = layerShading;

    var keyContour = "elev_cont";
    var showContour = evaluateLayerVisibility(Elevation.queryKeyContour,
                                              keyContour, true);
    var layerContour = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://openmapsurfer.uni-hd.de/tiles/asterc/x={x}&y={y}&z={z}'
        }),
        minResolution: 1.194328566789627,
        maxResolution: 19.109257068634033,
        name: "Contour lines",
        preload: 2,
        visible: showContour,
    });
    addCookieUpdater(layerContour, keyContour);
    Elevation.layerContour = layerContour;

    var keyElevation = "elev";
    var showElevation = evaluateLayerVisibility(Elevation.queryKey,
                                                keyElevation, false);
    var group = new ol.layer.Group({
        layers: [layerShading, layerContour],
        name: "Elevation Profile",
        visible: showElevation,
    });
    addCookieUpdater(group, keyElevation);
    Elevation.layer = group;
    map.addLayer(group);
};

Elevation.updateQueryParam = function(query) {
    query[Elevation.queryKey] = Elevation.layer.getVisible() ? 's' : 'h';
    query[Elevation.queryKeyShading] = Elevation.layerShading.getVisible() ? 's' : 'h';
    query[Elevation.queryKeyContour] = Elevation.layerContour.getVisible() ? 's' : 'h';
}
