var WaterLevels = WaterLevels || {};

WaterLevels.registerLayers = function() {
    var vectorSource = new ol.source.ServerVector({
            format: new WaterLevels.LevelFormat(),
            loader: function(extent, resolution, projection) {
                var url = 'http://www.pegelonline.wsv.de/webservices/rest-api/v2' +
                    '/stations.json?includeTimeseries=true&includeCurrentMeasurement=true&prettyprint=false';

                $.ajax({
                    url: url,
                    success: function(data) {
                        vectorSource.addFeatures(vectorSource.readFeatures(data));
                    }
                });
            },
            strategy: ol.loadingstrategy.all,
            projection: 'EPSG:3857',
        });
    var layer = new ol.layer.Vector({
        title: 'Water levels Germany',
        source: vectorSource,
            style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 3,
                fill: new ol.style.Fill({color: 'red'})
            })
        }),
        name: "Levels",
        visible: true,
    });
    map.addLayer(layer);
};

WaterLevels.registerInteraction = function() {
    function getLevelHtml(feature) {
        timeseries = feature.get('timeseries')[0];
        currentMeasurement = timeseries.currentMeasurement;
        trend = "";
        switch(currentMeasurement.trend) {
            case -1:
                trend = "falling";
                break;
            case 0:
                trend = "stable";
                break;
            case 1:
                trend = "rising";
                break;
        } 
        desc = '<table class="table">' + 
               '<tr><td>Water</td><td>' + feature.get('water').longname + '</td></tr>' +
               '<tr><td>km</td><td>' + feature.get('km') + '</td></tr>' +
               '<tr><td>Measurement</td><td>' + currentMeasurement.value + ' ' + timeseries.unit + '</td></tr>' +
               '<tr><td>Time</td><td>' + currentMeasurement.timestamp + '</td></tr>' +
               '<tr><td>Trend</td><td>' + trend + '</td></tr>' +
               '<tr><td>Chart</td>' +
               '<td><a href="http://www.pegelonline.wsv.de/webservices/zeitreihe/visualisierung?parameter=WASSERSTAND%20ROHDATEN&pegelnummer='
                    + feature.get('number') + '" target="_blank">water level</a></td></tr>' +
               '</table>' 
        return desc;
    };

    var element = document.getElementById('popup');
    var popup = new ol.Overlay({
      element: element,
      positioning: 'bottom-center',
      stopEvent: false
    });
    map.addOverlay(popup);
    var select = new ol.interaction.Select({condition: ol.events.condition.mouseMove});
    select.getFeatures().on('add', function(evt) {
    $(element).popover('destroy');
    feature = evt.element;
    if (feature) {
        var geometry = feature.getGeometry();
        var coord = geometry.getCoordinates();
        popup.setPosition(coord);
        $(element).popover({
          'animation': false,
          'placement': function(node, source) {
                var position = source.getBoundingClientRect();;
                if (position.left > 515) { return "left"; }
                if (position.left < 515) { return "right"; }
                if (position.top < 110){ return "bottom"; }
                return "top";
           },
          'html': true,
          'title': feature.get('longname'),
          'content': getLevelHtml(feature)
        });
        $(element).popover('show');
      }
    });
    map.addInteraction(select);
};

WaterLevels.LevelFormat =  function(opt_options) {
    var options = goog.isDef(opt_options) ? opt_options : {};
    goog.base(this);
    this.defaultDataProjection = ol.proj.get(
            goog.isDefAndNotNull(options.defaultDataProjection) ?
            options.defaultDataProjection : 'EPSG:4326');
};
goog.inherits(WaterLevels.LevelFormat, ol.format.JSONFeature);

WaterLevels.LevelFormat.prototype.readProjectionFromObject = function(object) {
    return this.defaultDataProjection;
};

WaterLevels.LevelFormat.prototype.readGeometryFromObject = function(object, opt_options) {
    if (goog.isDefAndNotNull(object.latitude) && goog.isDefAndNotNull(object.longitude)) {
        var geom = new ol.geom.Point([object.longitude, object.latitude]);
        return ol.format.Feature.transformWithOptions(geom, false, opt_options);
    } else {
        return undefined;
    }
};

WaterLevels.LevelFormat.prototype.readFeatureFromObject = function(object, opt_options) {
    var geometry = this.readGeometry(object, opt_options);
    var feature = new ol.Feature();
    feature.setGeometry(geometry);
    feature.setId(object.uuid);
    feature.setProperties(object);
    return feature;
};

WaterLevels.LevelFormat.prototype.readFeaturesFromObject = function(object, opt_options) {
    var features = [];
    for (i = 0, ii = object.length; i < ii; ++i)
        features.push(this.readFeatureFromObject(object[i],
                    opt_options));
    return features;
};
