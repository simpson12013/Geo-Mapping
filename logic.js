var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2018-11-06&endtime=" +
  "2018-11-13&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";


d3.json(queryUrl, function(data) {

    createFeatures(data.features);
});


function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng){
          var color;
          var r = 255;
          var g = Math.floor(255-80*feature.properties.mag);
          var b = Math.floor(255-80*feature.properties.mag);
          color = "rgb("+r+" , "+g+", "+b+")"
          var geojsonMarkerOptions = {
              radius: 4*feature.properties.mag,
              fillColor: color,
              color: "black",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
          };
          return L.circleMarker(latlng, geojsonMarkerOptions);
      }
    });
    createMap(earthquakes);
}

function createMap(earthquakes) {

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });

    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };

    var overlayMaps = {
      Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
}