var TripPlanner = TripPlanner || {};

TripPlanner.featureOverlay = null;

TripPlanner.draw = null;
TripPlanner.modify = null;

TripPlanner.addPanel = function(opt_options) {
    var options = opt_options || {};
    var element = document.createElement('div');
    element.id = 'tripplanner';
    element.className = 'tripplanner';
    element.setAttribute("hidden", "hidden"); 
    var sidebar = document.getElementById('sidebar');
    sidebar.appendChild(element);

    var addTableRow = function(table, label) {
        var index = table.rows.length;
        var row = table.insertRow(index);
        row.insertCell(0).innerHTML = label;
        row.cells[0].setAttribute('class', 'label');
        row.insertCell(1);
    }

    var table = document.createElement('table');
    table.id = 'tripplannertable';
    addTableRow(table, "Start");
    addTableRow(table, "Finish");
    addTableRow(table, "Distance");
    element.appendChild(table);

    var route = document.createElement('div');
    route.id = 'route';
    element.appendChild(route);
    
    var clearbutton = document.createElement('INPUT');
    clearbutton.addEventListener('click', function(evt) {TripPlanner.clear();});
    clearbutton.setAttribute("type", "button"); 
    clearbutton.setAttribute("value", "Clear"); 
    element.appendChild(clearbutton);
    TripPlanner.updateRoute();
};

TripPlanner.showOrHideButton = function(opt_options) {
    var options = opt_options || {};
    var element = document.createElement('a');
    element.className = 'tripplannericon';
    element.innerHTML = 'T';
    element.setAttribute("title", "Trip planner");
    TripPlanner.addPanel();

    element.addEventListener('click', function(e) {
        var planner = document.getElementById('tripplanner');
        if (planner.getAttribute("hidden") == null) {
            TripPlanner.stop();
        } else {
            stopAllSidebarServices();
            TripPlanner.start();
        }},
       false);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};
ol.inherits(TripPlanner.showOrHideButton, ol.control.Control);

TripPlanner.registerControl = function() {
    TripPlanner.featureOverlay = new ol.FeatureOverlay({
        source : new ol.source.Vector(),
        style : new ol.style.Style({
            fill : new ol.style.Fill({
                color : 'rgba(255, 255, 255, 0.2)'
            }),
            stroke : new ol.style.Stroke({
                color : '#003C88',
                width : 2
            }),
            image : new ol.style.Circle({
                radius : 7,
                fill : new ol.style.Fill({
                    color : '#ffcc33'
                })
            })
        })
    });
    sidebarservices.push(TripPlanner);
    
    TripPlanner.draw = new ol.interaction.Draw({
        features: TripPlanner.featureOverlay.getFeatures(),
        type: 'LineString',
    });
    TripPlanner.draw.setActive(false);
    map.addInteraction(TripPlanner.draw);
    TripPlanner.modify = new ol.interaction.MyModify({
        features: TripPlanner.featureOverlay.getFeatures(),
    });
    TripPlanner.modify.setActive(false);
    map.addInteraction(TripPlanner.modify);
    
    TripPlanner.modify.on('modified', function (evt) {
        TripPlanner.updateRoute();
    });
    
    TripPlanner.draw.on('drawend', function (evt) {
        TripPlanner.draw.setActive(false);
        TripPlanner.modify.setActive(true);
        TripPlanner.updateRoute();
    });
    
    var ctrl = new TripPlanner.showOrHideButton({target: 'showtripplanner'});
    map.addControl(ctrl);
};

TripPlanner.updateRoute = function() {
    var table = document.getElementById('tripplannertable');
    var route = document.getElementById('route');
    while (route.firstChild)
        route.removeChild(route.firstChild);
    var features = TripPlanner.featureOverlay.getFeatures();
    if (!features.getLength()) {
        table.rows[0].cells[1].innerHTML = '&mdash;'; 
        table.rows[1].cells[1].innerHTML = '&mdash;'; 
        table.rows[2].cells[1].innerHTML = '&mdash; nm'; 
    } else {
        var linefeature = features.item(0);
        coords = linefeature.getGeometry().getCoordinates();
        var next = coords[0];
        var pos = ol.proj.transform(next, 'EPSG:3857', 'EPSG:4326')
        var total_distance = 0;
        table.rows[0].cells[1].innerHTML = coordinateToString(pos).replace(' ', '<br/>');
        var position = document.createElement('div');
        position.className = 'position';
        position.innerHTML = coordinateToString(pos);
        route.appendChild(position);
        for (var i = 1; i < coords.length; i++) {
            var last = next;
            var last_4326 = pos;
            next = coords[i];
            var pos = ol.proj.transform(next, 'EPSG:3857', 'EPSG:4326')
            var entry = document.createElement('div');
            entry.className = 'routesegment';
            var distance_meter = ol.sphere.WGS84.haversineDistance(last_4326, pos);
            var distance_nm = distance_meter * 0.000539957;
            total_distance += distance_nm;
            var initialbearing = ol.sphere.WGS84.initialBearing(last_4326, pos);
            var finalbearing = ol.sphere.WGS84.finalBearing(last_4326, pos);
            var distance_meter_cosine = ol.sphere.WGS84.cosineDistance(last_4326, pos);
            var distance_nm_cosine = distance_meter_cosine * 0.000539957;
            entry.innerHTML = round(distance_nm_cosine, 2) + ' nm<br/>' +
                'initial bearing ' + round((initialbearing + 360)%360, 2) + '\u00b0<br/>' + 
                'final bearing ' + round((finalbearing + 360)%360, 2) + '\u00b0';
            route.appendChild(entry);
            position = document.createElement('div');
            position.innerHTML = coordinateToString(pos);
            route.appendChild(position);
        }
        table.rows[1].cells[1].innerHTML = coordinateToString(pos).replace(' ', '<br/>');
        table.rows[2].cells[1].innerHTML = round(total_distance, 2) + ' nm'; 
    }
}

TripPlanner.start = function() {
    var panel = document.getElementById('tripplanner');
    panel.removeAttribute("hidden");
    TripPlanner.featureOverlay.setMap(map);
    if (!TripPlanner.featureOverlay.getFeatures().getLength())
        TripPlanner.draw.setActive(true);
    else
        TripPlanner.modify.setActive(true);
}

TripPlanner.stop = function() {
    TripPlanner.featureOverlay.setMap(null);
    TripPlanner.draw.setActive(false);
    TripPlanner.modify.setActive(false);
    var panel = document.getElementById('tripplanner');
    panel.setAttribute("hidden", "hidden");
}

TripPlanner.clear = function() {
    TripPlanner.featureOverlay.getFeatures().clear();
    TripPlanner.updateRoute();
    TripPlanner.start();
}
