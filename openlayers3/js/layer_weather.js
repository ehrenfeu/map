var Weather = Weather || {};

Weather.sourceUrls = [
    ['Wind', 'http://www.openportguide.org/tiles/actual/wind_vector/TIME/{z}/{x}/{y}.png', true],
    ['Air Pressure', 'http://www.openportguide.org/tiles/actual/surface_pressure/TIME/{z}/{x}/{y}.png', false],
    ['Temperature', 'http://www.openportguide.org/tiles/actual/air_temperature/TIME/{z}/{x}/{y}.png', false],
    ['Precipitation', 'http://www.openportguide.org/tiles/actual/precipitation/TIME/{z}/{x}/{y}.png', false],
    ['Wave Height', 'http://www.openportguide.org/tiles/actual/significant_wave_height/TIME/{z}/{x}/{y}.png', false],
];

Weather.possibleTimes = [5, 7, 9, 11, 15, 19, 23, 27];

Weather.sources = [];

Weather.time = 11;
   
Weather.registerLayers = function() {
    var layers = [];
    for (i = 0; i < Weather.sourceUrls.length; i++) {
        var source = new ol.source.XYZ({
                url: Weather.sourceUrls[i][1].replace('TIME', Weather.time)
            });
        Weather.sources[Weather.sources.length] = source;

        var layer = new ol.layer.Tile({
            source: source,
            name: Weather.sourceUrls[i][0],
            visible: Weather.sourceUrls[i][2]
        });
        layers[layers.length] = layer;
    }
    var group = new ol.layer.Group({
        layers: layers,
        name: "Weather",
        visible: false
    });
    group.selectorEntryFunction = Weather.createLayerSelectorEntry;
    map.addLayer(group);
};

Weather.refreshLayers = function(time) {
    Weather.time = time;
    for (i = 0; i < Weather.sources.length; i++) {
        var url = Weather.sourceUrls[i][1].replace('TIME', time);
        Weather.sources[i].setUrl(url);
    }
};

Weather.createLayerSelectorEntry = function() {
    var select = document.createElement("select");
    function getTimeString(value) {
        var url = "http://openportguide.org/tiles/actual/wind_vector/TIME/time.txt".replace("TIME", value);
        // TODO this is a somewhat evil hack to get arond the same-origin policy
        // In the final online version we need the server to mirror or provide the data instead
        return $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?',
            function(data){ data.value = value; });
    }
    var jsonCalls = [];
    for (var i = 0; i < Weather.possibleTimes.length; i++) {
        var value = Weather.possibleTimes[i];
        jsonCalls.push(getTimeString(value));
    }

    $.when.apply($, jsonCalls).done(function() {
        for(var i = 0, len = arguments.length; i < len; i++){
            var entry = arguments[i][0];
            var value = entry.value;
            var desc = entry.contents;
            var option = document.createElement("option");
            option.setAttribute("value", value);
            if (value == Weather.time)
                option.setAttribute("selected", "selected");
            option.innerHTML = desc;
            select.appendChild(option);
            select.addEventListener('change', function(e) {
                Weather.refreshLayers(e.target.value);
            });
        }
    });
    select.id = "weather_time_select";
    return select;
};
