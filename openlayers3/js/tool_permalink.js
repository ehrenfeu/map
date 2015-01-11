var PermaLink = PermaLink || {};

PermaLink.featureOverlay = null;

PermaLink.query = {};
PermaLink.viewListeners = [];

PermaLink.addPanel = function(opt_options) {
    var options = opt_options || {};
    var element = document.createElement('div');
    element.id = 'permalink';
    element.className = 'permalink';
    element.setAttribute("hidden", "hidden"); 
    var sidebar = document.getElementById('sidebar');
    sidebar.appendChild(element);
    var text = document.createElement('span');
    text.innerHTML = "Copy this URL for the current map view:";
    element.appendChild(text);
    var input = document.createElement('textarea');
    input.setAttribute("readonly", "");
    input.id = 'currentPermalink';
    element.appendChild(input);
};

PermaLink.showOrHideButton = function(opt_options) {
    var options = opt_options || {};
    var element = document.createElement('a');
    element.className = 'permalinkicon';
    element.innerHTML = 'P';
    element.setAttribute("title", "permalink");
    PermaLink.addPanel();

    element.addEventListener('click', function(e) {
        var planner = document.getElementById('permalink');
        if (planner.getAttribute("hidden") == null) {
            PermaLink.stop();
        } else {
            stopAllSidebarServices();
            PermaLink.start();
        }},
       false);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};
ol.inherits(PermaLink.showOrHideButton, ol.control.Control);

PermaLink.registerControl = function() {
    PermaLink.featureOverlay = new ol.FeatureOverlay({
        source : new ol.source.Vector(),
        style : new ol.style.Style({
            fill : new ol.style.Fill({
                color : 'rgba(255, 255, 255, 0.2)'
            }),
            image : new ol.style.Circle({
                radius : 7,
                fill : new ol.style.Fill({
                    color : '#ffcc33'
                })
            })
        })
    });
    sidebarservices.push(PermaLink);
    
    PermaLink.draw = new ol.interaction.Draw({
        features: PermaLink.featureOverlay.getFeatures(),
        type: 'Point',
    });
    PermaLink.draw.setActive(false);
    map.addInteraction(PermaLink.draw);
    var ctrl = new PermaLink.showOrHideButton({target: 'showpermalink'});
    map.addControl(ctrl);
};

PermaLink.updateZoom_ = function() {
    PermaLink.query["z"] = map.getView().getZoom();
}

PermaLink.updateCenter_ = function() {
    PermaLink.query["c"] = map.getView().getCenter();
}

PermaLink.createCurrentQuery = function() {
    PermaLink.query = {};
    PermaLink.updateCenter_();    
    PermaLink.updateZoom_();    
    for (var i = 0; i < layerNamespaces.length; i++)
        layerNamespaces[i].updateQueryParam(PermaLink.query);
}

PermaLink.updateCurrentField = function(query) {
    var queryParts = [];
    for (var key in query)
        queryParts.push(key + "=" + query[key]);
    var url = window.location.href.split('?')[0] + '?' + queryParts.join("&");
    var current = document.getElementById('currentPermalink');
    current.value = url;
    current.style.height = current.scrollHeight + "px";
}

PermaLink.start = function() {
    var panel = document.getElementById('permalink');
    panel.removeAttribute("hidden");
    PermaLink.createCurrentQuery();
    PermaLink.updateCurrentField(PermaLink.query);
    var l = map.getView().on('change:center', function(evt) {
            PermaLink.updateCenter_();
            PermaLink.updateCurrentField(PermaLink.query);
        });
    PermaLink.viewListeners.push(l);
    var l = map.getView().on('change:resolution', function(evt) {
            PermaLink.updateZoom_();
            PermaLink.updateCurrentField(PermaLink.query);
        });
    PermaLink.viewListeners.push(l);
    // We currently do not need listeners on the layers (for visibility)
    // because these can only be changed while the permalink tool is stoped.
}

PermaLink.stop = function() {
    PermaLink.featureOverlay.setMap(null);
    PermaLink.draw.setActive(false);
    var panel = document.getElementById('permalink');
    panel.setAttribute("hidden", "hidden");
    for (var i = 0; i < PermaLink.viewListeners.length; i++)
        map.getView().unByKey(PermaLink.viewListeners[i]);
    PermaLink.viewListeners = [];
}
