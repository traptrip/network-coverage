function switchMapLanguage(map, platform){
  // Create default layers
  let defaultLayers = platform.createDefaultLayers({
    lg: 'ru'
  });
  map.setBaseLayer(defaultLayers.vector.normal.map);
  var ui = H.ui.UI.createDefault(map, defaultLayers, 'ru-RU');
  ui.removeControl('mapsettings');
}

/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  apikey: "1w5O8XpMpthHnoTrBw1NqsXyrIiug4cGfyy-B-ag-M4"
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map
var map = new H.Map(
    document.getElementById('map'),
  defaultLayers.raster.normal.map,{
  center: {lat: 53, lng: 50},
  zoom: 9,
  pixelRatio: window.devicePixelRatio || 1
});


window.addEventListener('resize', () => map.getViewPort().resize());
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
var ui = H.ui.UI.createDefault(map, defaultLayers);
window.onload = function () {
};

switchMapLanguage(map, platform);

/*
var colors = new H.data.heatmap.Colors({
  '0': 'red',   // half-transparent red
  '0.5': 'yellow', // half-transparent yellow
  '1': 'blue'  // half-transparent white
  }, true );

  // Create heat map provider
  var heatmapProvider = new H.data.heatmap.Provider({
    colors: colors,
    // Paint assumed values in regions where no data is available
    assumeValues: true
});

// Create a semi-transparent heat map layer
var heatmapLayer = new H.map.layer.TileLayer(heatmapProvider, {
  opacity: 0.6
});
*/

// Create a provider for a semi-transparent heat map:
var heatmapProvider = new H.data.heatmap.Provider({
  colors: new H.data.heatmap.Colors({
  '0': 'blue',
  '0.5': 'yellow',
  '1': 'red'
  }, true),
  opacity: 0.6,
  type: "value",
  // Paint assumed values in regions where no data is available
  assumeValues: false
});// Add the data

heatmapProvider.addData([
  {lat: 52, lng: 50, value: 100},
  {lat: 53, lng: 50, value: 20}
]);



// Add the layer to the map
map.addLayer(new H.map.layer.TileLayer(heatmapProvider));