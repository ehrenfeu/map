function init() {
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

    OpenStreetMap.registerLayers();
    BingAerial.registerLayers();
    Stamen.registerLayers();
    SeaMarks.registerLayers();
    Elevation.registerLayers();
    MarineProfile.registerLayers();
    WaterLevels.registerLayers();
    Weather.registerLayers();
    
    WaterLevels.registerInteraction();

    MousePosition.registerControl();
    LayerSelector.registerControl();
    Search.registerControl();
    ZoomLevel.registerControl();
}
