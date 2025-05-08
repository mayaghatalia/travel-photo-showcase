// List of countries to glow
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

// Add GeoJSON country shapes
L.geoJSON(countriesdata, {
  style: getCountryStyle,
  onEachFeature: function (feature, layer) {
    const name = feature.properties.name;
    const isGlowing = glowingCountries.has(name);
    const isVisited = visitedCountries[name];

    // Helper to add glow class to SVG path
    function addGlowClass() {
      // For Leaflet 1.7+ use getElement(), for older use _path
      const path = layer.getElement ? layer.getElement() : layer._path;
      if (isGlowing && path) {
        path.classList.add('glow-country');
      }
    }

    // Add glow class immediately if possible
    addGlowClass();
    // Also add on 'add' event as fallback
    layer.on('add', addGlowClass);

    // Visited countries: interactions and tooltip
    if (isVisited) {
      // Make country focusable for keyboard navigation
      layer.on('add', function () {
        const path = layer.getElement ? layer.getElement() : layer._path;
        if (path) path.setAttribute('tabindex', '0');
      });

      // Click and keyboard enter/space to open gallery
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
}).addTo(map);