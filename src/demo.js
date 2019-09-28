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


function onSuccessGeocode(result) {
    var location = result.Response.View[0].Result[0];
    alert(JSON.stringify(location.Location));
    return location.Location.Address.Label;
}

function get_location(coord) {
    var reverseGeocodingParameters = {
        prox: coord['lat']+','+coord['lng'],
        mode: 'retrieveAddresses',
        maxresults: 1
    };
    alert('cvxv');
    var geocoder = platform.getGeocodingService();
    geocoder.reverseGeocode(
        reverseGeocodingParameters,
        onSuccessGeocode,
        function(e) { alert(e); });

}


var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(mapContainer,
    defaultLayers.vector.normal.map,{
        center: {lat:53.5160, lng:37.3779},
        zoom: 6,
        pixelRatio: window.devicePixelRatio || 1
    });


function calculateRouteFromAtoB (platform, coords) {
    var router = platform.getRoutingService(),
        routeRequestParams = {
            mode: 'fastest;car',
            representation: 'display',
            routeattributes : 'waypoints,summary,shape,legs',
            maneuverattributes: 'direction,action',
            waypoint0: coords[0]['lat']+','+coords[0]['lng'],
            waypoint1: coords[1]['lat']+','+coords[1]['lng']
        };
    router.calculateRoute(
        routeRequestParams,
        onSuccess,
        onError
    );
}


function onSuccess(result) {
    var route = result.response.route[0];

    addRouteShapeToMap(route);
    // addManueversToMap(route);
}


function onError(error) {
    alert('Can\'t reach the remote server');
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

function addMarkerToGroup(group, coordinate, html) {
    var marker = new H.map.Marker(coordinate);
    // add custom data to the marker
    marker.setData(html);
    group.addObject(marker);
}
function addManueversToMap(route){
        var group = new  H.map.Group(),
        i,
        j;

    for (i = 0;  i < route.leg.length; i += 1) {
        for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
            // Get the next maneuver.
            maneuver = route.leg[i].maneuver[j];
            // Add a marker to the maneuvers group
            var marker =  new H.map.Marker({
                lat: maneuver.position.latitude,
                lng: maneuver.position.longitude} ,
            );
            // alert(get_location(maneuver.position.latitude, maneuver.position.longitude));
            marker.instruction = maneuver.instruction;
            group.addObject(marker);
        }
    }

    group.addEventListener('tap', function (evt) {
        map.setCenter(evt.target.getGeometry());
        openBubble(
            evt.target.getGeometry(), evt.target.instruction);
    }, false);

    map.addObject(group);
}


// calculateRouteFromAtoB (platform);
switchMapLanguage(map, platform);


function addDraggableMarker(map, behavior){
    var marker = new H.map.Marker({lat:55.9028, lng:48.1148}, {
        // mark the object as volatile for the smooth dragging
        volatility: true
    });
    marker.draggable = true;
    map.addObject(marker);

    map.addEventListener('dragstart', function(ev) {
        var target = ev.target,
            pointer = ev.currentPointer;
        if (target instanceof H.map.Marker) {
            var targetPosition = map.geoToScreen(target.getGeometry());
            target['offset'] = new H.math.Point(pointer.viewportX - targetPosition.x, pointer.viewportY - targetPosition.y);
            behavior.disable();
        }
    }, false);


    map.addEventListener('dragend', function(ev) {
        var target = ev.target;
        if (target instanceof H.map.Marker) {
            behavior.enable();
        }
    }, false);

    map.addEventListener('drag', function(ev) {
        var target = ev.target,
            pointer = ev.currentPointer;
        if (target instanceof H.map.Marker) {
            target.setGeometry(map.screenToGeo(pointer.viewportX - target['offset'].x, pointer.viewportY - target['offset'].y));
        }
    }, false);
}
// Add the click event listener.
// addDraggableMarker(map, behavior);

function setUpClickListener(map) {
    var count = 0;
    var coords = [];
    map.addEventListener('tap', function d(evt) {
        count += 1;
        if (count > 2){
            map.removeEventListener('tap', d, false);
            return;
        }
        var coord = map.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);
        coords.push(coord);
        var group = new  H.map.Group();
        // get_location(coord);
        var marker = new H.map.Marker(coord, {
            // mark the object as volatile for the smooth dragging
            volatility: true
        });
        marker.draggable = true;
        if (count == 1){
        marker.instruction = 'Начало пути';}
        else {
            if(count==2){
                marker.instruction = 'Конец пути';}
            }
        // marker.draggable = true;
        openBubble(
            marker.getGeometry(), marker.instruction);
        map.addObject(marker);
        if(count==2){
            calculateRouteFromAtoB(platform, coords);
            // addRouteShapeToMap(coords);
        }


    });
}


// Step 4: create custom logging facilities
var logContainer = document.createElement('ul');
logContainer.className ='log';
logContainer.innerHTML = 'Try clicking on the map';
map.getElement().appendChild(logContainer);

// Helper for logging events
function logEvent(str) {
    var entry = document.createElement('li');
    entry.className = 'log-entry';
    entry.textContent = str;
    alert(entry);
    logContainer.insertBefore(entry, logContainer.firstChild);
}


setUpClickListener(map);
