var mymap = L.map("map").setView([26.766825, 35.160864], 7);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGFuZmVkb3JlbmtvIiwiYSI6ImNrejh6dzkyajFxN2cydm5mZDZjMXUwajIifQ.WmIAhKYTVluS0N1QKUmv6w', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

var myIcon1 = L.icon({
    iconUrl: 'images/diver_down_flag1.png',
    iconSize: [30, 20],
    iconAnchor: [0, 0],
    popupAnchor: [15,10],
});
var myIcon2 = L.icon({
    iconUrl: 'images/diver_down_flag2.png',
    iconSize: [30, 20],
    iconAnchor: [0, 0],
    popupAnchor: [15,10],
});
var myIcon3 = L.icon({
    iconUrl: 'images/diver_down_flag3.png',
    iconSize: [30, 20],
    iconAnchor: [0, 0],
    popupAnchor: [15,10],
});
var myIcon4 = L.icon({
    iconUrl: 'images/diver_down_flag4.png',
    iconSize: [30, 20],
    iconAnchor: [0, 0],
    popupAnchor: [15,10],
});
var myIcon5 = L.icon({
    iconUrl: 'images/diver_down_flag5.png',
    iconSize: [30, 20],
    iconAnchor: [0, 0],
    popupAnchor: [15,10],
});
var myIcon6 = L.icon({
    iconUrl: 'images/diver_down_flag6.png',
    iconSize: [30, 20],
    iconAnchor: [0, 0],
    popupAnchor: [15,10],
});
var myIcon7 = L.icon({
    iconUrl: 'images/diver_down_flag7.png',
    iconSize: [30, 20],
    iconAnchor: [0, 0],
    popupAnchor: [15,10],
});
var myIcon8 = L.icon({
    iconUrl: 'images/diver_down_flag8.png',
    iconSize: [30, 20],
    iconAnchor: [0, 0],
    popupAnchor: [15,10],
});
var myIcon9 = L.icon({
    iconUrl: 'images/diver_down_flag9.png',
    iconSize: [30, 20],
    iconAnchor: [0, 0],
    popupAnchor: [15,10],
});
var myIcon10 = L.icon({
    iconUrl: 'images/diver_down_flag10.png',
    iconSize: [30, 20],
    iconAnchor: [0, 0],
    popupAnchor: [15,10],
});
var myIcon11 = L.icon({
    iconUrl: 'images/diver_down_flag11.png',
    iconSize: [30, 20],
    iconAnchor: [0, 0],
    popupAnchor: [15,10],
});
var myIcon12 = L.icon({
    iconUrl: 'images/diver_down_flag12.png',
    iconSize: [30, 20],
    iconAnchor: [0, 0],
    popupAnchor: [15,10],
});

var blue_hole = L.marker([28.572219, 34.537375], {icon: myIcon1}).bindPopup("<b>Blue Hole").addTo(mymap);
var gordon = L.marker([27.987189, 34.453417], {icon: myIcon2}).bindPopup("<b>Gordon Reef").addTo(mymap);
var thomas = L.marker([27.993364, 34.460531], {icon: myIcon3}).bindPopup("<b>Thomas Reef").addTo(mymap);
var tiran = L.marker([27.95, 34.55], {icon: myIcon4}).bindPopup("<b>Tiran Island").addTo(mymap);
var mohammed = L.marker([27.722222, 34.253889], {icon: myIcon5}).bindPopup("<b>Ras Mohammed").addTo(mymap);
var thistlegorm = L.marker([27.814167, 33.92], {icon: myIcon6}).bindPopup("<b>SS Thistlegorm").addTo(mymap);
var giftun = L.marker([27.216667, 33.933333], {icon: myIcon7}).bindPopup("<b>Giftun Islands").addTo(mymap);
var salem = L.marker([26.63945, 34.061083], {icon: myIcon8}).bindPopup("<b>MV Salem Express").addTo(mymap);
var brothers = L.marker([26.313808, 34.844864], {icon: myIcon9}).bindPopup("<b>Al Ikhwan (Brothers Island)").addTo(mymap);
var dabbab = L.marker([25.5, 34.85], {icon: myIcon10}).bindPopup("<b>Abu Dabbab").addTo(mymap);
var elphinstone = L.marker([25.308611, 34.860278], {icon: myIcon11}).bindPopup("<b>Elphinstone Reef").addTo(mymap);
var johns = L.marker([23.590628, 36.189706], {icon: myIcon12}).bindPopup("<b>St. John's Island").addTo(mymap);