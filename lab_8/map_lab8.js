$(document).ready(function() {
    $("#btn1").click(function(){
        $("#splasher1").show();
    });
    $("#btn2").click(function(){
        $("#splasher1").hide();
    });
    $("#btn3").click(function(){
        $("#splasher2").fadeIn();
    });
    $("#btn4").click(function(){
        $("#splasher2").fadeOut();
    });
});

var mymap = L.map('map', {
    center: [38.85250119246977, -99.60815961021089],
    zoom: 4,
});
    
 var grayscale = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
     attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.',
     maxZoom: 11,
     minZoom: 2
 }).addTo(mymap);

var icon = L.icon({
    iconUrl: "img/icon.png",
    iconSize: [20, 20],
    iconAnchor: [2.5, 2.5],
    popupAnchor: [0, -11]
});

var cities = L.esri.featureLayer({
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer/0',
    pointToLayer: function (geojson, latlng) {
            return L.marker(latlng, {
              icon: icon
            });
    }
}).addTo(mymap);

cities.bindPopup(function (layer) {
        return L.Util.template(
          "<p><strong>{NAME}</strong>, {ST}</p>",
          layer.feature.properties
        );
});

var wildfireRisk = L.esri.dynamicMapLayer({
    url: 'https://maps7.arcgisonline.com/arcgis/rest/services/USDA_USFS_2014_Wildfire_Hazard_Potential/MapServer',
    // server response content type can be either 'json' (default) or 'image'
    f: 'image'
}).addTo(mymap);

wildfireRisk.bindPopup(function (error, featureCollection) {
    if (error || featureCollection.features.length === 0) {
      return false;
    } else {
      return 'Risk Level: ' + featureCollection.features[0].properties.CLASS_DESC;
    }
});

var overlays = {
    'Widlfire':wildfireRisk,
    "<img src='img/icon.png' height=20> Major Cities": cities
};

//Creating the menu
var layerControl = L.control.layers({}, overlays, {collapsed: false}).addTo(mymap); //collapsed: true is defaults