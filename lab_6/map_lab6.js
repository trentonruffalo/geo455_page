var mymap = L.map('map', {center: [51.48882027639122, -0.1028811094342392],zoom: 11});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2NoYXVkaHVyaSIsImEiOiJjazBtcG5odG8wMDltM2JtcjdnYTgyanBnIn0.qwqjMomdrBMG36GQKXBlMw', {
    maxZoom: 11,
    minZoom: 5,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
}).addTo(mymap);



function getColor(value) {
    return value > 139 ? '#54278f':
           value > 87  ? '#756bb1':
           value > 53  ? '#9e9ac8':
           value > 32  ? '#cbc9e2':
                         '#f2f0f7';
}

function style(feature){
    return {
        fillColor: getColor(feature.properties.pop_den),   // pop_den is the field name for the population density data
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
}

function highlightFeature(e) {
    // Get access to the feature that was hovered through e.target
    var feature = e.target;

    // Set a thick grey border on the feature as mouseover effect
    // Adjust the values below to change the highlighting styles of features on mouseover
    // Check out https://leafletjs.com/reference-1.3.4.html#path for more options for changing style
    feature.setStyle({
        weight: 5,
        color: '#666',
        fillOpacity: 0.7
    });

    // Bring the highlighted feature to front so that the border doesn’t clash with nearby states
    // But not for IE, Opera or Edge, since they have problems doing bringToFront on mouseover
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        feature.bringToFront();
    }
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature, // Do what defined by the highlightFeature function on mouseover
        mouseout: resetHighlight,    // Do what defined by the resetHighlight function on mouseout
    });
}

var geojson; // define a variable to make the geojson layer accessible for the funtion to use   

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
}).bindPopup(function (layer){
return layer.feature.properties.NAME 
        + '<p style="color:purple">' + layer.feature.properties.pop_den.toString() + ' people/hectare </p>';       
}).addTo(mymap);

//geojson = L.geoJson(all_english, {
//    style: style,
//    onEachFeature: onEachFeature
//}).bindPopup(function (layer){
//return layer.feature.properties.NAME 
//        + '<p style="color:purple">' + layer.feature.properties.desity.toString() + ' all_english/hectare </p>';       
//}).addTo(mymap);

var legend = L.control({position: 'bottomright'}); // Try the other three corners if you like.

legend.onAdd = function (mymap) {

    var div = L.DomUtil.create('div', 'legend'),
        grades = [0, 32, 53, 87, 139]; // The break values to define the intervals of population, note we begin from 0 here

        div.innerHTML = '<b>Population Density <br></b>'; // The legend title (HTML-based), in this case it's Population Density 2011

        // Loop through our the classes and generate a label with a color box for each interval.
        // If you are creating a choropleth map, you DO NOT need to change lines below.
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i>' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
};

legend.addTo(mymap);