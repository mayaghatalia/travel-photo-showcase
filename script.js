// Initialize the map
var map = L.map('map').setView([20, 0], 2);

// Add the dark tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CartoDB',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// List of countries to highlight
const highlightedCountries = ['France', 'Japan', 'United States', 'Italy', 'Australia'];

// Define the default style for highlighted countries
function countryStyle(feature) {
  return {
    fillColor: '#ff69b4', // Pink color
    weight: 1,
    opacity: 1,
    color: 'white', // Border color
    fillOpacity: 0.6,
    className: 'country-highlight' // Add a custom class
  };
}

// Fetch and add the GeoJSON data
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: function(feature) {
        // Only style the selected countries
        if (highlightedCountries.includes(feature.properties.name)) {
          return countryStyle(feature);
        } else {
          return { fillOpacity: 0 }; // Hide other countries
        }
      },
      onEachFeature: function (feature, layer) {
        if (highlightedCountries.includes(feature.properties.name)) {
          // Set hover events
          layer.on({
            mouseover: function(e) {
              e.target.setStyle({
                fillOpacity: 0.8,
                color: 'white',
                fillColor: '#ff69b4',
                weight: 1,
              });
              e.target._path.style.filter = 'drop-shadow(0 0 12px #ff69b4) drop-shadow(0 0 24px #ff69b4)';
            },
            mouseout: function(e) {
              e.target.setStyle({
                fillOpacity: 0.6,
                color: 'white',
                fillColor: '#ff69b4',
                weight: 1,
              });
              e.target._path.style.filter = 'drop-shadow(0 0 6px #ff69b4) drop-shadow(0 0 12px #ff69b4)';
            }
          });
        }
      }
    }).addTo(map);
  });