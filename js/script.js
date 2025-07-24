const map = L.map('map').setView([48.8566, 2.3522], 13); // Paris

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

    const status = place.open ? '🟢 OUVERT' : '🔴 FERMÉ';

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
