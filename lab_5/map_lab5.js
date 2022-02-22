//Create the map variable
var mymap = L.map("map", {
    center: [6.794952075439587, 20.91148703911037], 
    zoom: 3,});

//Set up the baselayers and WMS layer
var streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2NoYXVkaHVyaSIsImEiOiJjazBtcG5odG8wMDltM2JtcjdnYTgyanBnIn0.qwqjMomdrBMG36GQKXBlMw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

var grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2NoYXVkaHVyaSIsImEiOiJjazBtcG5odG8wMDltM2JtcjdnYTgyanBnIn0.qwqjMomdrBMG36GQKXBlMw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);


//Set up icon variables
var myIcon1 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30,30],
    iconAnchor: [0,0],
    popupAnchor: [15,10],
});
var myIcon2 = L.icon({
    iconUrl: 'images/icon_2.png',
    iconSize: [30,30],
    iconAnchor: [0,0],
    popupAnchor: [15,10],
});
var myIcon3 = L.icon({
    iconUrl: 'images/icon_3.png',
    iconSize: [30,30],
    iconAnchor: [0,0],
    popupAnchor: [15,10],
});
var myIcon4 = L.icon({
    iconUrl: 'images/icon_4.png',
    iconSize: [30,30],
    iconAnchor: [0,0],
    popupAnchor: [15,10],
});
var myIcon5 = L.icon({
    iconUrl: 'images/icon_5.png',
    iconSize: [30,30],
    iconAnchor: [0,0],
    popupAnchor: [15,10],
});
var myIcon6 = L.icon({
    iconUrl: 'images/icon_6.png',
    iconSize: [30,30],
    iconAnchor: [0,0],
    popupAnchor: [15,10],
});
var myIcon7 = L.icon({
    iconUrl: 'images/icon_7.png',
    iconSize: [30,30],
    iconAnchor: [0,0],
    popupAnchor: [15,10],
});


// Create custom popups with images
var greatwallPopup = "Great Wall of China<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/20090529_Great_Wall_8185.jpg/256px-20090529_Great_Wall_8185.jpg' alt='great wall wiki' width='150px'/>";
var chichenPopup = "Chichen-Itza<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/003_El_Castillo_o_templo_de_Kukulkan._Chich%C3%A9n_Itz%C3%A1%2C_M%C3%A9xico._MPLC.jpg/256px-003_El_Castillo_o_templo_de_Kukulkan._Chich%C3%A9n_Itz%C3%A1%2C_M%C3%A9xico._MPLC.jpg' alt='Chichen-Itza wiki' width='150px'/>";
var petraPopup = "Petra<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/The_Monastery%2C_Petra%2C_Jordan8.jpg/256px-The_Monastery%2C_Petra%2C_Jordan8.jpg' alt='Petra wiki' width='150px'/>";
var machuPopup = "Machu Pichu<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/256px-Machu_Picchu%2C_Peru.jpg' alt='Machu Pichu wiki' width='150px'/>";
var christPopup = "Christ the Redeemer<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Aerial_view_of_the_Statue_of_Christ_the_Redeemer.jpg/256px-Aerial_view_of_the_Statue_of_Christ_the_Redeemer.jpg' alt='Christ the Redeemer wiki' width='150px'/>";
var coloPopup = "Colosseum<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg/256px-Colosseum_in_Rome-April_2007-1-_copie_2B.jpg' alt='Colosseum wiki' width='150px'/>";
var tajPopup  = "Taj Mahal<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Taj-Mahal.jpg/256px-Taj-Mahal.jpg' alt='Taj Mahal wiki' width='150px'/>";

var customOptions ={'maxWidth': '150','className' : 'custom'};


//Data points
coords = [
    [40.43208734303398, 116.570439270903],
    [41.89040186252818, 12.492252355598225],
    [30.328713676465735, 35.44444802834926],
    [20.6793437423211, -88.56829451227937],
    [-13.162932251747211, -72.54500581780444],
    [-22.951728275037908, -43.210412100446604],
    [27.175354762373193, 78.04214219760772]
];


//Marker Layergroups
var loc = L.layerGroup();
L.marker(coords[0], {icon: myIcon1}).bindPopup(greatwallPopup, customOptions).addTo(loc);
L.marker(coords[1], {icon: myIcon2}).bindPopup(coloPopup, customOptions).addTo(loc);
L.marker(coords[2], {icon: myIcon3}).bindPopup(petraPopup, customOptions).addTo(loc);
L.marker(coords[3], {icon: myIcon4}).bindPopup(chichenPopup, customOptions).addTo(loc);
L.marker(coords[4], {icon: myIcon5}).bindPopup(machuPopup, customOptions).addTo(loc);
L.marker(coords[5], {icon: myIcon6}).bindPopup(christPopup, customOptions).addTo(loc);
L.marker(coords[6], {icon: myIcon7}).bindPopup(tajPopup, customOptions).addTo(loc);
loc.addTo(mymap);

//Add line
var line = L.polyline(coords, {color: "red", weight: 7}).bindPopup("Travel Path");
line.addTo(mymap);


//Add scale bar
L.control.scale({position: 'bottomright', maxWidth: '150', metric: 'True'}).addTo(mymap);


// Create menu items
var baseLayers = {
    'Grayscale': grayscale,
    'Streets': streets,
    };
var overlays = {
    '7 Wonders of the World': loc,
    'Travel Path': line,
};


//Create menu
 var layerControl = L.control.layers(baseLayers, overlays, {collapsed: false}).addTo(mymap);


//Create locator map
var miniMap = new L.Control.MiniMap(L.tileLayer('https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=tZnptaeI9RvKHsX18rbW'),{
    toggleDisplay: true,
    minimized: true,
    position: 'bottomleft'
}).addTo(mymap);


//Pop-up for showing XY coordinates on map
//Create empty popup
var popup = L.popup();

//Function to set popup contents
function onMapClick(e){
    popup   
        .setLatLng(e.latlng)
        .setContent(
        "You clicked the map at -<br>" +
        "<b>long: </b>" + e.latlng.lng + "<br>" +
        "<b>lat: </b>" + e.latlng.lat
    ).openOn(mymap);}

//Add event listener for clicke events to show lat long on the map
mymap.addEventListener("click",onMapClick);

//Add navigation buttons
L.easyButton(('1 height=50%'), function(btn, map){
    map.setView(coords[0], 15);
}).addTo(mymap);
L.easyButton(('2 height=50%'), function(btn, map){
    map.setView(coords[1], 15);
}).addTo(mymap);
L.easyButton(('3 height=50%'), function(btn, map){
    map.setView(coords[2], 15);
}).addTo(mymap);
L.easyButton(('4 height=50%'), function(btn, map){
    map.setView(coords[3], 15);
}).addTo(mymap);
L.easyButton(('5 height=50%'), function(btn, map){
    map.setView(coords[4], 15);
}).addTo(mymap);
L.easyButton(('6 height=50%'), function(btn, map){
    map.setView(coords[5], 15);
}).addTo(mymap);
L.easyButton(('7 height=50%'), function(btn, map){
    map.setView(coords[6], 15);
}).addTo(mymap);
L.easyButton(('<img src="images/globe_icon.png", height=85%>'), function(btn, map){
    map.setView([6.794952075439587, 20.91148703911037], 3);
}).addTo(mymap);

//Making International Space Station marker with a custom icon
var issIcon = L.icon({
    iconUrl: 'images/iss200.png',
    iconSize: [80,52],
    iconAnchor: [25,16]
});
var marker = L.marker([0,0], {icon: issIcon}).addTo(mymap);

//Call the ISS real time data URL
var api_url = 'https://api.wheretheiss.at/v1/satellites/25544';
var firstTime = true;

//Update the Lat/Long based on the updated reading everytime
async function getISS(){
    var response = await fetch(api_url);
    var data = await response.json();
    var {latitude, longitude} = data;
    
    // Change the marker location based on updated reading 
    // but keep the map view in default center
    marker.setLatLng([latitude, longitude]);
    if(firstTime){
        mymap.setView([6.794952075439587, 20.91148703911037], 3);
        firstTime = false;
    }
    document.getElementById('lat').textContent = latitude.toFixed(3);
    document.getElementById('lon').textContent = longitude.toFixed(3);
}

getISS();

setInterval(getISS, 1000);