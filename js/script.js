import { db } from './firebase-config.js';
import {
  ref,
  get,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 📍 Initialisation de la carte Leaflet
const map = L.map('map').setView([48.8566, 2.3522], 13); // Paris

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// 📍 Données des lieux (coordonnées + nom + ID Firebase)
const places = [
  {
    id: 'place1',
    name: 'Café de la Gare',
    lat: 48.8566,
    lng: 2.3522
  },
  {
    id: 'place2',
    name: 'Librairie du Centre',
    lat: 48.8606,
    lng: 2.3376
  }
];

// 🔄 Fonction pour afficher un marqueur + écouter Firebase
places.forEach(place => {
  const marker = L.marker([place.lat, place.lng]).addTo(map);

  const statusRef = ref(db, `places/${place.id}/status`);

  // 🔔 Écoute en temps réel du statut
  onValue(statusRef, (snapshot) => {
    const isOpen = snapshot.exists() ? snapshot.val() : false;
    const popupContent = `
      <strong>${place.name}</strong><br>
      Statut : <span>${isOpen ? 'Ouvert' : 'Fermé'}</span><br>
      <button onclick="toggleOpenStatus('${place.id}')">Changer statut</button>
    `;
    marker.bindPopup(popupContent);
  });
});

// 📤 Fonction appelée au clic sur le bouton
window.toggleOpenStatus = async function(placeId) {
  const statusRef = ref(db, `places/${placeId}/status`);
  const snapshot = await get(statusRef);
  const current = snapshot.exists() ? snapshot.val() : false;
  set(statusRef, !current);
};
