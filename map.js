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
    color: isVisited ? "#77dd77" : (isGlowing ? "#fff" : "#333"),
    weight: isVisited ? 2 : (isGlowing ? 2 : 0.8)
  };
}

// Function to handle each country feature
function onEachCountry(feature, layer) {
  const name = feature.properties.name;
  const isGlowing = glowingCountries.has(name);
  const isVisited = visitedCountries[name];

  // Add glow class for styling
  function addGlowClass() {
    const path = layer.getElement ? layer.getElement() : layer._path;
    if (isGlowing && path) {
      if (isVisited) {
        path.classList.add('glow-country-green');
      } else {
        path.classList.add('glow-country-white');
      }
      path.setAttribute('tabindex', '0');
      path.setAttribute('aria-label', name);
    }
  }
  addGlowClass();
  layer.on('add', addGlowClass);

  // Show capital city tooltip for ALL glowing countries
  if (isGlowing) {
    layer.on('mouseover', function(e) {
      fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`)
        .then(res => res.json())
        .then(data => {
          let capital = "Unknown";
          if (data && data[0] && data[0].capital && data[0].capital[0]) {
            capital = data[0].capital[0];
          }
          layer.bindTooltip(
            `<b>${name}</b><br>Capital: ${capital}`,
            { permanent: false, className: 'country-fact-tooltip' }
          ).openTooltip();
        })
        .catch(() => {
          layer.bindTooltip(
            `<b>${name}</b><br>Capital: Unknown`,
            { permanent: false, className: 'country-fact-tooltip' }
          ).openTooltip();
        });
    });
    layer.on('mouseout', function(e) {
      layer.closeTooltip();
    });
  }

  // Add interactivity for visited countries
  if (isVisited) {
    layer.on('click', () => window.location.href = visitedCountries[name]);
    layer.on('keypress', function (e) {
      if (e.originalEvent.key === "Enter" || e.originalEvent.key === " ") {
        window.location.href = visitedCountries[name];
      }
    });
    layer.on('mouseover', () => layer.setStyle({ weight: 2.5 }));
    layer.on('mouseout', () => layer.setStyle({ weight: 2 }));
    // Don't bind a static tooltip here, since the capital tooltip will appear
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
