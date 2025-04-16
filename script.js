const accessKey = "YOUR_UNSPLASH_ACCESS_KEY"; // Replace with your real key when you get it

// Leaflet map
const map = L.map('map').setView([20, 0], 2); // Center of map

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

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