var quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var myMap = L.map("mapid", {
    center: [36.15, -112.30],
    zoom: 4
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 15,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

function mapCol(dep) {
    var color = "lime";
    if (dep > 90) {
        color = "darkred";
    }
    else if (dep > 70) {
        color = "indianred";
    }
    else if (dep > 50) {
        color = "darkorange";
    }
    else if (dep > 30) {
        color = "orange";
    }
    else if (dep > 10) {
        color = "greenyellow";
    }
    return color;
}
d3.json(quakeUrl).then(data => {
    console.log(data);

    var quakes = data.features;
        for (var i = 0; i < quakes.length; i++) {
        var lat = quakes[i].geometry.coordinates[1];
        var long = quakes[i].geometry.coordinates[0];
        var mag = quakes[i].properties.mag;
        var dep = quakes[i].geometry.coordinates[2];
        var epi = L.circleMarker([lat, long], {
            radius: mag**2,
            color: "black",
            fillColor: mapCol(dep),
            weight: 1,
            fillOpacity: 0.8
            });
         epi.addTo(myMap);
         epi.bindPopup("<h3> " +  Date(quakes[i].properties.time) + "</h3><h4>Magnitude: " + mag +
            "<br>Location: " + quakes[i].properties.place + "</h4><br>");
        }

        var legend = L.control({ position: "bottomright" });
            legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend");
            var limits = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
            var colors = ["lime", "greenyellow", "orange", "darkorange", "indianred", "darkred"];
            var labels = [];

            limits.forEach(function(limit, index) {
                labels.push("<i style=\"background-color: " + colors[index] + "\"></i>" + limit+ "<br>");
              });

              div.innerHTML += labels.join("");
              return div;
            };


             legend.addTo(myMap);
        })