const accessKey = "YOUR_UNSPLASH_ACCESS_KEY"; // Replace with your real key when you get it

// Initialize map
var map = L.map('map').setView([20, 0], 2);

// Add dark tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CartoDB',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Define a style for the countries
function countryStyle(feature) {
  return {
    fillColor: '#ff69b4', // PINK color
    weight: 1,
    opacity: 1,
    color: 'white', // Border color
    fillOpacity: 0.5
  };
}

// Load the countries GeoJSON and add to map
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: function(feature) {
        // Only highlight countries you care about
        const highlightedCountries = ['France', 'Japan', 'United States', 'Italy', 'Australia'];
        
        if (highlightedCountries.includes(feature.properties.name)) {
          return countryStyle(feature);
        } else {
          return { fillOpacity: 0 }; // Hide the rest
        }
      }
    }).addTo(map);
  });


// Countries your mom has visited
const visitedCountries = {
  Japan: [36.2048, 138.2529],
  France: [46.2276, 2.2137],
  Peru: [-9.19, -75.0152]
};

// Add map markers for visited countries
for (const [country, coords] of Object.entries(visitedCountries)) {
  const marker = L.marker(coords).addTo(map)
    .bindPopup(`<strong>${country}</strong><br>Click to view photos`)
    .on('click', () => {
      fetchPhotosFromUnsplash(country);
    });
}

// Photos from Unsplash API
function fetchPhotosFromUnsplash(country) {
  const url = `https://api.unsplash.com/search/photos?query=${country}&per_page=6`;

  fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const gallery = document.getElementById("gallery");
      gallery.innerHTML = ""; // Clear previous photos

      data.results.forEach(photo => {
        const img = document.createElement("img");
        img.src = photo.urls.small;
        img.alt = photo.alt_description || "Travel photo";
        gallery.appendChild(img);
      });
    })
    .catch(err => {
      console.error("Error fetching from Unsplash:", err);
    });
}