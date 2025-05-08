// List of countries to glow (names must match GeoJSON exactly)
const glowingCountries = new Set([
  "Austria", "Bhutan", "Botswana", "Cambodia", "Canada",
  "Cayman Islands", "Chile", "China", "Czech Republic", "Denmark",
  "Egypt", "France", "Germany", "Greece", "Hong Kong",
  "Hungary", "India", "Indonesia", "Italy", "Japan",
  "Kenya", "Malaysia", "Mexico", "New Zealand", "Peru",
  "Philippines", "South Africa", "Spain", "Sri Lanka", "Taiwan",
  "Tanzania", "Thailand", "United Kingdom", "United States of America",
  "Vietnam", "Vatican City", "Zambia", "Zimbabwe"
]);

// Map of visited countries and their gallery links
const visitedCountries = {
  "France": "photos/france.html",
  "Kenya": "photos/kenya.html",
  "India": "photos/india.html",
};

// Initialize Leaflet map
const map = L.map('map', {
  zoomSnap: 0.25,
  maxBounds: [[-85, -180], [85, 180]],
  maxBoundsViscosity: 1.0,
  preferCanvas: true
}).setView([20, 0], 2);

// Add dark tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap & CARTO',
  subdomains: 'abcd',
  noWrap: true
}).addTo(map);

// Style function for countries
function getCountryStyle(feature) {
  const name = feature.properties.name;
  const isGlowing = glowingCountries.has(name);
  const isVisited = visitedCountries[name];
  return {
    fillColor: isVisited ? "#77dd77" : (isGlowing ? "#2a2a2a" : "#111"),
    fillOpacity: isVisited ? 0.7 : (isGlowing ? 0.3 : 0.2),
    color: isVisited ? "#9eff9e" : (isGlowing ? "#555" : "#333"),
    weight: isVisited ? 1.5 : (isGlowing ? 1.2 : 0.8)
  };
}

// Function to handle each country feature
function onEachCountry(feature, layer) {
  const name = feature.properties.name;
  const isGlowing = glowingCountries.has(name);
  const isVisited = visitedCountries[name];

  // Add glow class and accessibility attributes
  function addGlowClass() {
    const path = layer.getElement ? layer.getElement() : layer._path;
    if (isGlowing && path) {
      path.classList.add('glow-country');
      path.setAttribute('tabindex', '0');
      path.setAttribute('aria-label', name);
    }
  }
  addGlowClass();
  layer.on('add', addGlowClass);

  // Visited countries: interactions and tooltip
  if (isVisited) {
    layer.on('click', () => window.location.href = visitedCountries[name]);
    layer.on('keypress', function (e) {
      if (e.originalEvent.key === "Enter" || e.originalEvent.key === " ") {
        window.location.href = visitedCountries[name];
      }
    });
    layer.on('mouseover', () => layer.setStyle({ weight: 2.5 }));
    layer.on('mouseout', () => layer.setStyle({ weight: 1.5 }));
    layer.bindTooltip(name, {
      permanent: false,
      className: 'country-tooltip'
    });
  }
}

// Load and add GeoJSON country shapes
fetch('countries.geojson')
  .then(res => res.json())
  .then(geojson => {
    L.geoJSON(geojson, {
      style: getCountryStyle,
      onEachFeature: onEachCountry
    }).addTo(map);
  });
