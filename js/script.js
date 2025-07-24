const map = L.map('map').setView([44.84209223220714, -0.5790196426522859], 13); // Bordeaux

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const placesRef = db.ref("places");

placesRef.on("value", (snapshot) => {
  const data = snapshot.val();

  // Supprime les anciens marqueurs
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) map.removeLayer(layer);
  });

  for (let key in data) {
    const place = data[key];
    const marker = L.marker([place.lat, place.lng]).addTo(map);

    const status = place.open ? '🟢 OK' : '🔴 CONTAMINÉ';

    const popup = `
      <b>${place.name}</b><br>
      Statut : <span id="status-${key}">${status}</span><br>
      <button onclick="toggleStatus('${key}')">Changer le statut</button>
    `;

    marker.bindPopup(popup);
  }
});

function toggleStatus(key) {
  const ref = db.ref(`places/${key}`);
  ref.once('value').then(snapshot => {
    const current = snapshot.val();
    ref.update({ open: !current.open });
  });
}
