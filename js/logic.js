const api_key = "pk.eyJ1Ijoicm9zYXpodSIsImEiOiJja2ZvbTFvbzEyM2c1MnVwbTFjdmVycXk5In0.71jVP2vD8pBWO2bsKtI48Q";

var queryUrl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


  
 d3.json(queryUrl).then(function (data) {
 console.log(data);

  createFeatures(data.features);
});

function markerSize(magnitude) {
  return magnitude * 2000;
};

function chooseColor(depth) {
      switch(true) {
        case depth > 90:
          return "red";
        case depth > 70:
          return "orangered";
        case depth > 50:
          return "orange";
        case depth > 30:
          return "gold";
        case depth > 10:
          return "yellow";
        default:
          return "green";
      }
    }



function createFeatures(earthquakeData) {


  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

 var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    pointToLayer: function(feature, latlng) {

      var markers = {
        radius: markerSize(feature.properties.mag),
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.7,
          color: "black",
          stroke: true,
          weight: 0.5
      }
      return L.circle(latlng,markers);
    }
  });


  createMap(earthquakes);
}

function createMap(earthquakes) {

  var street = L.tileLayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}?access_token={access_token}', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    style: 'mapbox/light-v11',
    access_token: api_key
  });
  

  var baseMaps = {
        "street Map": street

  }

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]
  });

var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend"),
  depth = [-10, 10, 30, 50, 70, 90];

  div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

  for (var i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(myMap)


  L.control.layers(baseMaps , overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}