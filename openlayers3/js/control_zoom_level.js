var ZoomLevel = ZoomLevel || {};

ZoomLevel.ZoomLevel = function(opt_options) {
    var options = opt_options || {};
    var element = document.createElement('div');
    element.className = 'zoom_level';
    element.innerHTML = map.getView().getZoom();

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });

    map.getView().on('change:resolution', function(evt) {
        var zoomInfo = map.getView().getZoom();
        if (goog.isDefAndNotNull(zoomInfo))
            element.innerHTML = zoomInfo;
    });
};
ol.inherits(ZoomLevel.ZoomLevel, ol.control.Control);

ZoomLevel.registerControl = function() {
    var ctrl = new ZoomLevel.ZoomLevel({target: map.getControls().item(0).element});
    map.addControl(ctrl);
};
