var mymap = L.map('map', {
    center: [43.0672902307, -89.418123],
    zoom: 7,
});

var grayscale = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.',
    maxZoom: 11,
    minZoom: 2,
}).addTo(mymap);

var migrationLayer = new L.migrationLayer({
    map: mymap,
    data: data,
    pulseRadius:30,
    pulseBorderWidth:3,
    arcWidth:1,
    arcLabel:true,
    arcLabelFont:'10px sans-serif',
    maxWidth:10,
});

migrationLayer.addTo(mymap)

$(document).ready(function() {
    $("#btn1").click(function(){
        migrationLayer.hide();
    });
    $("#btn2").click(function(){
        migrationLayer.show();
    });
    $("#btn3").click(function(){
        migrationLayer.pause();
    });
    $("#btn4").click(function(){
        migrationLayer.play();
    });
});