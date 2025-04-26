// Initialize the Map
var map = L.map('map', {
  worldCopyJump: false,
  maxBounds: [[-90, -180], [90, 180]],
  maxBoundsViscosity: 0.8,
  minZoom: 2,
  maxZoom: 5
}).setView([20, 0], 2);

// Add Dark Tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Load Countries
fetch('countries.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJson(data, {
      style: feature => ({
        fillColor: 'palevioletred',
        fillOpacity: 0.5,
        color: 'palevioletred',
        weight: 1,
      }),
      onEachFeature: function (feature, layer) {
        layer.on({
          click: onCountryClick,
          mouseover: highlightCountry,
          mouseout: resetHighlight
        });
      }
    }).addTo(map);
  });

// Hover Highlight
function highlightCountry(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 3,
    color: '#ff69b4',
    fillOpacity: 0.7,
    dashArray: '5,5'
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

// Reset Highlight
function resetHighlight(e) {
  var layer = e.target;
  layer.setStyle({
    fillColor: 'palevioletred',
    fillOpacity: 0.5,
    color: 'palevioletred',
    weight: 1,
    dashArray: ''
  });
}

// Redirect on Click
function onCountryClick(e) {
  const countryName = e.target.feature.properties.name;
  
  const countryPages = {
    "United States of America": "usa.html",
    "Italy": "italy.html",
    "Japan": "japan.html",
    "France": "france.html",
    "India": "india.html",
    "Australia": "australia.html",
    "Spain": "spain.html",
    // Add more countries here
  };

  if (countryPages[countryName]) {
    window.location.href = countryPages[countryName];
  } else {
    alert("Photos for " + countryName + " coming soon!");
  }
}