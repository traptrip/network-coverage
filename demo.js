function switchMapLanguage(map, platform){

    let defaultLayers = platform.createDefaultLayers({
        lg: 'ru'
    });
    map.setBaseLayer(defaultLayers.vector.normal.map);

    var ui = H.ui.UI.createDefault(map, defaultLayers, 'ru-RU');

    ui.removeControl('mapsettings');
}


var mapContainer = document.getElementById('map'),
    routeInstructionsContainer = document.getElementById('panel');
var platform = new H.service.Platform({
    apikey: "1w5O8XpMpthHnoTrBw1NqsXyrIiug4cGfyy-B-ag-M4"
});

var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(mapContainer,
    defaultLayers.vector.normal.map,{
        center: {lat:53.5160, lng:37.3779},
        zoom: 13,
        pixelRatio: window.devicePixelRatio || 1
    });


function calculateRouteFromAtoB (platform) {
    var router = platform.getRoutingService(),
        routeRequestParams = {
            mode: 'fastest;car',
            representation: 'display',
            routeattributes : 'waypoints,summary,shape,legs',
            maneuverattributes: 'direction,action',
            waypoint0: '55.9028,49.1148',
            waypoint1: '55.7504,45.1438'
        };
    router.calculateRoute(
        routeRequestParams,
        onSuccess,
        onError
    );
}


function onSuccess(result) {
    var route = result.response.route[0];
    /*
     * The styling of the route response on the map is entirely under the developer's control.
     * A representitive styling can be found the full JS + HTML code of this example
     * in the functions below:
     */
    addRouteShapeToMap(route);
    // addManueversToMap(route);

}


function onError(error) {
    alert('Can\'t reach the remote server');
}


function addMarkerToGroup(group, coordinate, html) {
    var marker = new H.map.Marker(coordinate);
    // add custom data to the marker
    marker.setData(html);
    group.addObject(marker);
}
var group = new H.map.Group();
function addInfoBubble(map, lat, lng, html) {

    map.addObject(group);
    group.addEventListener('tap', function (evt) {
        var bubble =  new H.ui.InfoBubble(evt.target.getGeometry(), {
            content: evt.target.getData()
        });
        ui.addBubble(bubble);
    }, false);

    addMarkerToGroup(group, {lat:lat, lng:lng},html);
    // addMarkerToGroup(group, {lat:53.430, lng:-2.961},'Liverpool');
}

function do_magic() {
    var lat_lng_list = [];
    function createCallback(item) {
        return function(data) {
            var lat = data['Response']['View'][0]['Result'][0]['Location']['DisplayPosition']['Latitude'];
            var lng = data['Response']['View'][0]['Result'][0]['Location']['DisplayPosition']['Longitude'];
            addInfoBubble(map, lat, lng, item);
            lat_lng_list.push({lat:lat, lng:lng});
            // addMarkerToGroup(group, {lat:lat, lng:lng}, city);
        };
    }

    var list = 'Челябинск, Кыштым, Верхний Уфалей, Екатеринбург';
    var seplist = list.split(',');
    for (var city_num in seplist){
        var city = seplist[city_num];
        var url = 'https://geocoder.api.here.com/6.2/geocode.json?searchtext='+city+'&app_id=ZTBMxHwg26B6S3l3Keb5&app_code=SGmKOd_JWvUtGi9OrX0BRA&gen=9';
        $.getJSON(url, createCallback(city));
    }
}


// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Hold a reference to any infobubble opened
var bubble;


function openBubble(position, text){
    if(!bubble){
        bubble =  new H.ui.InfoBubble(
            position,
            // The FO property holds the province name.
            {content: text});
        ui.addBubble(bubble);
    } else {
        bubble.setPosition(position);
        bubble.setContent(text);
        bubble.open();
    }
}


function addRouteShapeToMap(route){
    // alert(JSON.stringify(route.shape));
    var lineString = new H.geo.LineString(),
        polyline;
    var routeShape = route.shape;
    routeShape.forEach(function(point) {
        var parts = point.split(',');
        lineString.pushLatLngAlt(parts[0], parts[1]);
    });

    polyline = new H.map.Polyline(lineString, {
        style: {
            lineWidth: 4,
            strokeColor: 'rgba(0, 128, 255, 0.7)'
        }
    });
    // Add the polyline to the map
    map.addObject(polyline);
    // And zoom to its bounding rectangle
    map.getViewModel().setLookAtData({
        bounds: polyline.getBoundingBox()
    });
}


function addManueversToMap(route){
    var svgMarkup = '<svg width="18" height="18" ' +
        'xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="8" cy="8" r="8" ' +
        'fill="#1b468d" stroke="white" stroke-width="1"  />' +
        '</svg>',
        dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
        group = new  H.map.Group(),
        i,
        j;

    // Add a marker for each maneuver
    for (i = 0;  i < route.leg.length; i += 1) {
        for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
            // Get the next maneuver.
            maneuver = route.leg[i].maneuver[j];
            // Add a marker to the maneuvers group
            var marker =  new H.map.Marker({
                    lat: maneuver.position.latitude,
                    lng: maneuver.position.longitude} ,
                {icon: dotIcon});
            marker.instruction = maneuver.instruction;
            group.addObject(marker);
        }
    }

    group.addEventListener('tap', function (evt) {
        map.setCenter(evt.target.getGeometry());
        openBubble(
            evt.target.getGeometry(), evt.target.instruction);
    }, false);

    // Add the maneuvers group to the map
    map.addObject(group);
}


Number.prototype.toMMSS = function () {
    return  Math.floor(this / 60)  +' minutes '+ (this % 60)  + ' seconds.';
}

calculateRouteFromAtoB (platform);
alert('Done');
switchMapLanguage(map, platform);
addMarkersToMap(map);
addInfoBubble(map);