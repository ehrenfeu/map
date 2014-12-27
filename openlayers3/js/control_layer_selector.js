var LayerSelector = LayerSelector || {};

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
LayerSelector.showOrHideLayerSelector = function(opt_options) {
    var options = opt_options || {};
    var element = document.createElement('a');
    element.className = 'layerselectoricon';
    element.innerHTML = 'L';
    LayerSelector.addLayerSelectorPanel(options.layers);
    
    element.addEventListener('click', function(e) {
        var panel = document.getElementById('layerselector');
        if (panel.getAttribute("hidden") == null)
            panel.setAttribute("hidden", "hidden");
        else
            sidePanelShowOnly("layerselector");
        }, 
       false);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};
ol.inherits(LayerSelector.showOrHideLayerSelector, ol.control.Control);

LayerSelector.addLayerSelectorPanel = function(layers) {
    var element = document.createElement('div');
    element.id = 'layerselector';
    element.setAttribute("title", "Layers");
    element.setAttribute("hidden", "hidden"); 
    var sidebar = document.getElementById('sidebar');
    sidebar.appendChild(element);
    var addSelectorForLayer = function(elem, index, arr) {
        var div = document.createElement("div");
        div.className = 'layerselectorentry';
        var checkbox = document.createElement("INPUT");
        checkbox.setAttribute("type", "checkbox"); 
        checkbox.setAttribute("name", elem.get('name'));
        if (elem.getVisible())
            checkbox.setAttribute("checked", "checked"); 
        checkbox.setAttribute("value", index); 
        checkbox.addEventListener('click', function(e) {
            var layers_ = map.getLayers();
            var button = e.currentTarget
            layers_.item(e.currentTarget.value).setVisible(e.currentTarget.checked);
        });
        var label = document.createTextNode(elem.get('name'));
        div.appendChild(checkbox);
        div.appendChild(label);
        element.appendChild(div);
    };
    layers.forEach(addSelectorForLayer);
};

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
LayerSelector.LayerSelectorPanel = function (opt_options) {
    var options = opt_options || {};
    var element = document.createElement('ul');
    var layers = map.getLayers();
    var addSelectorForLayer = function(elem, index, arr) {
        var li = document.createElement("li");
        var checkbox = document.createElement("INPUT");
        checkbox.setAttribute("type", "checkbox"); 
        checkbox.setAttribute("name", elem.get('name'));
        if (elem.getVisible())
            checkbox.setAttribute("checked", "checked"); 
        checkbox.setAttribute("value", index); 
        checkbox.addEventListener('click', function(e) {
            var layers = map.getLayers();
            var button = e.currentTarget
            layers.item(e.currentTarget.value).setVisible(e.currentTarget.checked);
        });
        var label = document.createTextNode(elem.get('name'));
        li.appendChild(checkbox);
        li.appendChild(label);
        element.appendChild(li);
    };
    layers.forEach(addSelectorForLayer);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};
ol.inherits(LayerSelector.LayerSelectorPanel, ol.control.Control);

LayerSelector.registerControl = function() {
    var layers = map.getLayers();
    map.addControl(new LayerSelector.showOrHideLayerSelector({target: 'showlayerselector', layers: layers}));
};
