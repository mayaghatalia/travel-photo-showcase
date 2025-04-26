// Initialize the Map
var map = L.map('map').setView([20, 0], 2); // [latitude, longitude], zoom level

// Add a dark basemap
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Load GeoJSON data for countries
fetch('countries.geojson') // your GeoJSON file with country shapes
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
          click: onCountryClick, // ADD THIS
          mouseover: highlightCountry,
          mouseout: resetHighlight
        });
      }
    }).addTo(map);
  });

// Highlight on hover
function highlightCountry(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 2,
    color: '#ff69b4',
    fillOpacity: 0.7
  });
}

// Reset highlight on mouseout
function resetHighlight(e) {
  var layer = e.target;
  layer.setStyle({
    fillColor: 'palevioletred',
    fillOpacity: 0.5,
    color: 'palevioletred',
    weight: 1
  });
}

// Handle country click and redirect
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
    // Add more countries as you build pages
  };

  if (countryPages[countryName]) {
    window.location.href = countryPages[countryName];
  } else {
    alert("Photos for " + countryName + " coming soon!");
  }
}