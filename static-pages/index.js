   // This will let you use the .remove() function later on
         if (!('remove' in Element.prototype)) {
             Element.prototype.remove = function() {
                 if (this.parentNode) {
                     this.parentNode.removeChild(this);
                 }
             };
         }


mapboxgl.accessToken = 'pk.eyJ1Ijoia2luZ29mdGhlanVuZ2xlIiwiYSI6ImNqa29kZjdlajB2Z24za296ZGRkZDJjZmsifQ.B5CQFlk2i-fc1r9MjbAh5g';

var all_locations = [];

         // This adds the map
var map = new mapboxgl.Map({
    // container id specified in the HTML
    container: 'map',
    // style URL
    style: 'mapbox://styles/mapbox/light-v9',
    // initial position in [long, lat] format
    center: [-77.034084142948, 38.909671288923],
    // initial zoom
    zoom: 13,
    scrollZoom: false
});

//map.addControl(L.mapbox.geocoderControl('mapbox.places', {autocomplete: true}));

//var geocoder = new MapboxGeocoder({ accessToken: mapboxgl.accessToken });
//map.addControl(geocoder);

var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
});

map.addControl(geocoder);

var stores = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                         "type": "Point",
                "coordinates": [
                    -77.043959498405,
                    38.903883387232
                ]
            },
            "properties": {
                "phoneFormatted": "(202) 331-3355",
                         "phone": "2023313355",
                "address": "1901 L St. NW",
                "city": "Washington DC",
                "country": "United States",
                "crossStreet": "at 19th St",
                "postalCode": "20036",
                "state": "D.C."
            }
        }]
         };
// This adds the data to the map
map.on('load', function (e) {
    // This is where your '.addLayer()' used to be, instead add only the source without styling a layer
    map.addSource("places", {
                 "type": "geojson",
        "data": stores
    });
    // Initialize the list
    buildLocationList(stores);
    
    map.addSource('single-point', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
    });
    
    map.addLayer({
        "id": "point",
        "source": "single-point",
        "type": "circle",
        "paint": {
                     "circle-radius": 10,
            "circle-color": "#007cbf"
        }
    });
    // Listen for the `result` event from the MapboxGeocoder that is triggered when a user
    // makes a selection and add a symbol that matches the result.
    geocoder.on('result', function(ev) {
        console.log(JSON.stringify(ev));
        // here i need to be pushing the points to a list that i can contain
        all_locations.push(ev);
        // add a marker that will stay
        // then populate the side bar

        // then add a button to send it to the lisp server and
        // optimize the route
        map.getSource('single-point').setData(ev.result.geometry);
             });
});

function request_route_optimization() {
    // use the all_locations variable as data source
    // fires request off to the server and serves the response back as an alert
    var coordinates_lst = all_locations.map(obj => obj['result']['center']);


    $.ajax({
        url:"optimize-route",
        type:"POST",
        data:"coordinates="+JSON.stringify(coordinates_lst),
        contentType:"application/x-www-form-urlencoded",
        dataType:"json",
        success: function(resp){
            console.log("server response = " + resp);
        }
    });

    // $.post("optimize-route", function(resp){
    //     console.log("server response = " + resp);
    // },
    //        data="coordinates="+JSON.stringify(coordinates_lst));
    return true;
}

// This is where your interactions with the symbol layer used to be
// Now you have interactions with DOM markers instead
stores.features.forEach(function(marker, i) {
    // Create an img element for the marker
    var el = document.createElement('div');
    el.id = "marker-" + i;
    el.className = 'marker';
    // Add markers to the map at all points
    new mapboxgl.Marker(el, {offset: [0, -23]})
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
    
    el.addEventListener('click', function(e){
        // 1. Fly to the point
        flyToStore(marker);
        
        // 2. Close all other popups and display popup for clicked store
        createPopUp(marker);
        
        // 3. Highlight listing in sidebar (and remove highlight for all other listings)
        var activeItem = document.getElementsByClassName('active');
        
        e.stopPropagation();
        if (activeItem[0]) {
            activeItem[0].classList.remove('active');
        }
        
        var listing = document.getElementById('listing-' + i);
        listing.classList.add('active');

    });
});


function flyToStore(currentFeature) {
    map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 15
    });
}

function createPopUp(currentFeature) {
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();

    
    var popup = new mapboxgl.Popup({closeOnClick: false})
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML('<h3>Sweetgreen</h3>' +
                 '<h4>' + currentFeature.properties.address + '</h4>')
        .addTo(map);
}


function buildLocationList(data) {
    for (i = 0; i < data.features.length; i++) {
        var currentFeature = data.features[i];
        var prop = currentFeature.properties;
        
        var listings = document.getElementById('listings');
        var listing = listings.appendChild(document.createElement('div'));
        listing.className = 'item';
        listing.id = "listing-" + i;
        
        var link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.dataPosition = i;
        link.innerHTML = prop.address;
        
        var details = listing.appendChild(document.createElement('div'));
        details.innerHTML = prop.city;
        if (prop.phone) {
            details.innerHTML += ' &middot; ' + prop.phoneFormatted;
        }
        
        
        
        link.addEventListener('click', function(e){
            // Update the currentFeature to the store associated with the clicked link
            var clickedListing = data.features[this.dataPosition];
            
            // 1. Fly to the point
            flyToStore(clickedListing);
            
            // 2. Close all other popups and display popup for clicked store
            createPopUp(clickedListing);
            
            // 3. Highlight listing in sidebar (and remove highlight for all other listings)
            var activeItem = document.getElementsByClassName('active');
            
            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            this.parentNode.classList.add('active');
            
        });
    }
}

