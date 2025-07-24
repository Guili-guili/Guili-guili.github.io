const map = L.map('map').setView([44.84503782649243, -0.5794620035318856], 13); // Bordeaux

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Reference to 'places' node in Firebase
const placesRef = db.ref("places");

// Load data and display markers
placesRef.on("value", (snapshot) => {
  const data = snapshot.val();

  // Clear existing markers
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) map.removeLayer(layer);
  });

  for (let key in data) {
    const place = data[key];

    // Determine display label based on status
    let label;
    switch (place.status) {
      case 'open':
        label = '🟢 OK';
        break;
      case 'closed':
        label = '🔴 CONTAMINÉ';
        break;
      case 'unknown':
      default:
        label = '🟡 INCONNU';
    }

    // Add marker to map
    const marker = L.marker([place.lat, place.lng]).addTo(map);

    // Create popup with 3 status buttons
    //❓
    const popup = `
      <b>${place.name}</b><br>
      Statut : <span id="status-${key}">${label}</span><br><br>
      <button onclick="setStatus('${key}', 'open')">🟢 OK</button>
      <button onclick="setStatus('${key}', 'closed')">🔴 CONTAMINÉ</button>
      <button onclick="setStatus('${key}', 'unknown')">🟡 INCONNU</button>
    `;

    marker.bindPopup(popup);
  }
});

// Update place status in Firebase
function setStatus(key, newStatus) {
  const ref = db.ref(`places/${key}`);
  ref.update({ status: newStatus });
}
