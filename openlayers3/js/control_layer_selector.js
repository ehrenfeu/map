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
    var addSelectorForLayer = function(elem, index, parentElement) {
        var div = document.createElement("div");
        div.className = 'layerselectorentry';
        var checkbox = document.createElement("INPUT");
        checkbox.setAttribute("type", "checkbox"); 
        checkbox.setAttribute("name", elem.get('name'));
        if (elem.getVisible())
            checkbox.setAttribute("checked", "checked"); 
        checkbox.setAttribute("value", index); 
        checkbox.addEventListener('click', function(e) {
            elem.setVisible(e.currentTarget.checked);
            var showChildren = e.currentTarget.checked ? 'block' : 'none';
            next =  e.currentTarget.nextElementSibling;
            while (goog.isDefAndNotNull(next)) {
                next.style.display = showChildren;
                next = next.nextElementSibling;
            }
        });
        var label = document.createTextNode(elem.get('name'));
        div.appendChild(checkbox);
        div.appendChild(label);
        var layers = elem.get('layers');
        if (goog.isDefAndNotNull(layers)) {
            var subdiv = document.createElement("div");
            div.appendChild(subdiv);
            if (!elem.getVisible())
                subdiv.style.display = 'none';
            if (goog.isDefAndNotNull(elem.selectorEntryFunction)) {
                var groupOption = elem.selectorEntryFunction();
                subdiv.appendChild(groupOption);
            }
            for (var i = 0; i < layers.getLength(); i++)
                addSelectorForLayer(layers.item(i), i, subdiv);
        }
        parentElement.appendChild(div);
    };
    for (var i = 0; i < layers.getLength(); i++)
        addSelectorForLayer(layers.item(i), i, element);
};


LayerSelector.registerControl = function() {
    var layers = map.getLayers();
    map.addControl(new LayerSelector.showOrHideLayerSelector({target: 'showlayerselector', layers: layers}));
};
