var Elevation = Elevation || {};

Elevation.registerLayers = function() {
    var layer_elevation = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://openmapsurfer.uni-hd.de/tiles/asterh/x={x}&y={y}&z={z}'
        }),
        minResolution: 19.109257068634033,
        name: "Elevation profile",
        preload: 2,
        visible: false,
    });
    map.addLayer(layer_elevation);

    var layer_contour_lines = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://openmapsurfer.uni-hd.de/tiles/asterc/x={x}&y={y}&z={z}'
        }),
        minResolution: 1.194328566789627,
        maxResolution: 19.109257068634033,
        name: "Contour lines",
        preload: 2,
        visible: false,
    });
    map.addLayer(layer_contour_lines);
};
