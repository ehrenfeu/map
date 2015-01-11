function init() {
    sidebarservices = [];
    queryStrings = getQueryValues();
    console.log(window.location.href);

    map = new ol.Map({
        target: 'map',
        layers: [],
        renderer: 'canvas',
        view: new ol.View({
          center: ol.proj.transform([9, 53.5], 'EPSG:4326', 'EPSG:3857'),
          zoom: 9,
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


    var layers = [OpenStreetMap, BingAerial, Stamen, SeaMarks, Elevation,
        MarineProfile, WaterLevels, Weather, CoordinateGrid]

    for (var i = 0; i < layers.length; i++)
        layers[i].registerLayers(queryStrings);
    
    WaterLevels.registerInteraction();

    MousePosition.registerControl();
    LayerSelector.registerControl();
    Search.registerControl();
    ZoomLevel.registerControl();
    TripPlanner.registerControl();
    PermaLink.registerControl();
}
