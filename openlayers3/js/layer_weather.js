var Weather = Weather || {};

Weather.queryKey = "lw";

Weather.layer = 'undefined';
Weather.subLayers = [];

Weather.sourceUrls = [
    ['Wind', 'http://www.openportguide.org/tiles/actual/wind_vector/TIME/{z}/{x}/{y}.png', true, "lww"],
    ['Air Pressure', 'http://www.openportguide.org/tiles/actual/surface_pressure/TIME/{z}/{x}/{y}.png', false, "lwa"],
    ['Temperature', 'http://www.openportguide.org/tiles/actual/air_temperature/TIME/{z}/{x}/{y}.png', false, "lwt"],
    ['Precipitation', 'http://www.openportguide.org/tiles/actual/precipitation/TIME/{z}/{x}/{y}.png', false, "lwp"],
    ['Wave Height', 'http://www.openportguide.org/tiles/actual/significant_wave_height/TIME/{z}/{x}/{y}.png', false, "lwh"],
];

Weather.possibleTimes = [5, 7, 9, 11, 15, 19, 23, 27];

Weather.sources = [];

Weather.time = 5; // current weather

Weather.WindScale = function(opt_options) {
    var colors = ['#a000c8', '#8200dc', '#1e3cff', '#00a0ff', '#00c8c8',
                  '#00d28c', '#00dc00', '#a0e632', '#e6dc32', '#e6af2d',
                  '#f08228', '#fa3c3c', '#f00082'];

    var options = opt_options || {};
    var element = document.createElement('div');
    element.className = 'windscale';
    var entry = document.createElement('div');
    entry.className = 'windscale_color';
    entry.style.background = "rgba(255, 255, 255, 0.5)";
    entry.style.color = "black";
    entry.innerHTML = "Bft";
    element.appendChild(entry);
    for (var i = 0; i < colors.length; i++) {
        var entry = document.createElement('div');
        entry.className = 'windscale_color';
        entry.style.background = colors[i];
        entry.innerHTML = i;
        element.appendChild(entry);
    }

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};
ol.inherits(Weather.WindScale, ol.control.Control);
Weather.windScale = new Weather.WindScale();
   
Weather.registerLayers = function() {
    var layers = [];
    for (i = 0; i < Weather.sourceUrls.length; i++) {
        var key = 'weather_' +
            Weather.sourceUrls[i][0].replace(RegExp(' ', 'g'), '_').toLowerCase();
        var show = evaluateLayerVisibility(Weather.sourceUrls[i][3], key,
                                           Weather.sourceUrls[i][2]);
        var source = new ol.source.XYZ({
                url: Weather.sourceUrls[i][1].replace('TIME', Weather.time)
            });
        Weather.sources[Weather.sources.length] = source;

        var layer = new ol.layer.Tile({
            source: source,
            name: Weather.sourceUrls[i][0],
            visible: show,
        });
        if (key === "weather_wind") {
            layer.on('change:visible', function (evt) {
                if (evt.oldValue)
                    map.removeControl(Weather.windScale);
                else
                    map.addControl(Weather.windScale);
            });
        }
        addCookieUpdater(layer, key);
        Weather.subLayers.push(layer);
    }
    var key = "weather";
    var show = evaluateLayerVisibility(Weather.queryKey, key, false);
    var group = new ol.layer.Group({
        layers: Weather.subLayers,
        name: "Weather",
        visible: show
    });
    group.selectorEntryFunction = Weather.createLayerSelectorEntry;
    group.on('change:visible', function (evt) {
        if (evt.oldValue)
            map.removeControl(Weather.windScale);
        else if (evt.currentTarget.getLayers().item(0).getVisible()) 
            map.addControl(Weather.windScale);
    });
    addCookieUpdater(group, key);
    map.addLayer(group);
    Weather.layer = group;
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

Weather.updateQueryParam = function(query) {
    query[Weather.queryKey] = Weather.layer.getVisible() ? 's' : 'h';
    for (var i = 0; i < Weather.sourceUrls.length; i++) {
        var layer = Weather.subLayers[i];
        var key = Weather.sourceUrls[i][3];
        query[key] = layer.getVisible() ? 's' : 'h';
    }
}
