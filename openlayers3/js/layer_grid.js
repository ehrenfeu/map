var CoordinateGrid = CoordinateGrid || {};
CoordinateGrid.queryKey = "lg";

CoordinateGrid.getStepWidth = function(distance_seconds, max_lines) {
    var min_dist = distance_seconds / max_lines;
    var possible_steps = [
        6, 12, 30, 1*60, 2*60, 3*60, 5*60, 10*60, 20*60, 30*60,
        1*3600, 2*3600, 3*3600, 4*3600, 6*3600, 10*3600, 15*3600, 30*3600, 45*3600
    ];

    for (var i = 0; i < possible_steps.length; i++)
        if (min_dist < possible_steps[i])
            return possible_steps[i];
    return null;
}

CoordinateGrid.featureCoordFunction = function(fixedPos, value) {
    var varPos = 1 - fixedPos;
    return function(variableValue) {
        var coord = [];
        coord[fixedPos] = value;
        coord[varPos] = variableValue;
        return coord;
    }
}

CoordinateGrid.createFeatures = function(source, min, max, step, coordStart,
    coordEnd, projection, isLongitude) {
    var curr = min;
    while (curr <= max) {
        var coord1 = ol.proj.transform(coordStart(curr/3600), 'EPSG:4326', projection);
        var coord2 = ol.proj.transform(coordEnd(curr/3600), 'EPSG:4326', projection);
        var feature = new ol.Feature({
            geometry: new ol.geom.LineString([coord1, coord2]),
            line: true
        });
        source.addFeature(feature);
        feature = new ol.Feature({
            geometry: new ol.geom.Point(coord2),
            label: degreesToStringShort(curr/3600),
            line: false,
            lon: isLongitude
        });
        source.addFeature(feature);
        curr += step;
    }

}

CoordinateGrid.registerLayers = function() {
    var vectorSource = new ol.source.ServerVector({
        loader: function(extent, resolution, projection) {
            this.clear();
            var ext = ol.proj.transformExtent(extent, projection, 'EPSG:4326');
            var lon_distance = (ext[2]-ext[0])*3600; // in seconds
            var step_width = CoordinateGrid.getStepWidth(lon_distance, 14);

            // compute position of first longitude line (integer number of
            // steps left of a full degree)
            var lon = ext[0]*3600 + step_width - (ext[0]*3600)%step_width;
            CoordinateGrid.createFeatures(this, lon, ext[2]*3600, step_width,
                CoordinateGrid.featureCoordFunction(1, ext[1]),
                CoordinateGrid.featureCoordFunction(1, ext[3]-0.00001),
                projection, true);
            var lat = ext[1]*3600 + step_width - (ext[1]*3600)%step_width;
            CoordinateGrid.createFeatures(this, lat, ext[3]*3600, step_width,
                CoordinateGrid.featureCoordFunction(0, ext[2]),
                CoordinateGrid.featureCoordFunction(0, ext[0]+0.00001),
                projection, false);
        }, 
        strategy: function(extent, resolution) {
                // reload on extent and resolution changes
                if(this.resolution && this.resolution != resolution) {
                    this.loadedExtents_.clear();
                    this.resolution = resolution; 
                } else if (!this.resolution)
                    this.resolution = resolution; 
                return [extent];
            }
        });
    var key = "grid";
    var show = evaluateLayerVisibility(CoordinateGrid.queryKey, key, false);
    var layer = new ol.layer.Vector({
        source: vectorSource,
        style: (function() {
            var lineStyle = [new ol.style.Style({
                stroke: new ol.style.Stroke({color: 'gray', width: 1})
            })];
            var textFill = new ol.style.Fill({color: 'black'});
            return function(feature, resolution) {
                if (feature.get('line')) {
                  return lineStyle;
                } else {
                    var offX = feature.get('lon') ? 3 : 110;
                    var offY = feature.get('lon') ? 110 : 10;
                    
                    return  [new ol.style.Style({
                        text: new ol.style.Text({
                            font: '12px Calibri,sans-serif',
                            text: feature.get('label'),
                            textAlign: 'left',
                            textBaseline: 'middle',
                            fill: textFill,
                            offsetX: offX,
                            offsetY: offY
                            })
                    })];
                }
            };
        })(),
        title: 'Coordinate Grid',
        name: "Coordinate Grid",
        visible: show,
    });
    addCookieUpdater(layer, key);
    map.addLayer(layer);
};
