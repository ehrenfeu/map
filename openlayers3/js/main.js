function init() {
    sidebarservices = [];
    queryStrings = getQueryValues();
    layerNamespaces = [OpenStreetMap, BingAerial, Stamen, SeaMarks,
        Elevation, MarineProfile, WaterLevels, Weather, CoordinateGrid]

    var zoom = parseInt(queryStrings['z']) || 9;
    var centerStrings = (queryStrings['c'] || "").split(',');
    var center = ol.proj.transform([9, 53.5], 'EPSG:4326', 'EPSG:3857');
    var x, y;
    if (centerStrings.length == 2 && (x = parseFloat(centerStrings[0])) &&
        (y = parseFloat(centerStrings[1])))
        center = [x, y];

    map = new ol.Map({
        target: 'map',
        layers: [],
        renderer: 'canvas',
        view: new ol.View({
          center: center,
          zoom: zoom,
          minZoom: 1,
          maxZoom: 17
        }),
        controls: [
            new ol.control.Zoom(),
            new ol.control.Attribution({collapsible: false}),
            new ol.control.ScaleLine({className: 'scale-nautical', units: 'nautical'}),
            new ol.control.ScaleLine({className: 'scale-metric'}),
            new ol.control.FullScreen(),
            new ol.control.ZoomSlider()
        ]
      });

    for (var i = 0; i < layerNamespaces.length; i++)
        layerNamespaces[i].registerLayers(queryStrings);
    
    WaterLevels.registerInteraction();

    MousePosition.registerControl();
    LayerSelector.registerControl();
    Search.registerControl();
    ZoomLevel.registerControl();
    TripPlanner.registerControl();
    PermaLink.registerControl();
}
