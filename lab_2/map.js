var mymap = L.map("map").setView([49.9935, 36.2304], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGFuZmVkb3JlbmtvIiwiYSI6ImNrejh6dzkyajFxN2cydm5mZDZjMXUwajIifQ.WmIAhKYTVluS0N1QKUmv6w', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

L.marker([49.9935, 36.2304])
    .addTo(mymap)
    .bindPopup("<b>Hello!</b><br>This is my home city in Ukraine where I grew up.")
    .openPopup();