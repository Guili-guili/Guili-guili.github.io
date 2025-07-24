const map = L.map('map').setView([44.84503782649243, -0.5794620035318856], 13); // Bordeaux

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Reference to 'places' node in Firebase
const placesRef = db.ref("places");

// Load data and display markers
placesRef.on("value", (snapshot) => {
  const data = snapshot.val();

// Markers definition
  const statusIcons = {
  open: L.icon({
    iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  closed: L.icon({
    iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  unknown: L.icon({
    iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
};

  // Supprime les anciens marqueurs
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) map.removeLayer(layer);
  });

  // Compteur d'arrachage
  let tornCount=0;

  for (let key in data) {
    const place = data[key];
    tornCount += place.tearings || 0;

    // Update badge in header
    const totalTornCounts = document.getElementById("torn-count");
    if (totalTornCounts) totalTornCounts.textContent = `Affiches arrachées: ${tornCount}`;

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
    const icon = statusIcons[place.status] || statusIcons.unknown;
    const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);

    // Create popup with 3 status buttons
    //❓
    const popup = `
      <b>${place.name}</b><br>
      Statut : <span id="status-${key}">${label}</span><br><br>
      <button onclick="setStatus('${key}', 'open')">🟢 OK</button>
      <button onclick="setStatus('${key}', 'unknown')">🟡 INCONNU</button>
      <button onclick="setStatus('${key}', 'closed')">🔴 CONTAMINÉ</button>
      Arrachages : <span id="tearings-${key}">${place.tearings || 0}</span><br>
      <button onclick="incrementTearings('${key}')">👣 J’ai arraché une affiche</button>
    `;

    marker.bindPopup(popup);
  }
});

// Update place status in Firebase
function setStatus(key, newStatus) {
  const ref = db.ref(`places/${key}`);
  ref.update({ status: newStatus });
}

//Tearings increment
function incrementTearings(key) {
  const ref = db.ref(`places/${key}/tearings`);

  ref.transaction(current => {
    return (current || 0) + 1;
  });
}

});
