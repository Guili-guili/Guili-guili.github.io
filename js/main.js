// js/main.js
import { db } from './firebase-config.js';
import {
  ref,
  get,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🧠 Met à jour l'état local du statut (et dans le DOM)
function updateStatusDisplay(placeId, isOpen) {
  const el = document.getElementById(`status-${placeId}`);
  el.textContent = isOpen ? "Ouvert" : "Fermé";
}

// 📤 Fonction appelée quand on clique sur un bouton
window.toggleOpenStatus = async function(placeId) {
  const statusRef = ref(db, `places/${placeId}/status`);
  const snapshot = await get(statusRef);
  const current = snapshot.exists() ? snapshot.val() : false;
  set(statusRef, !current); // Inverse le statut
}

// 🔄 Écoute en temps réel pour mettre à jour l'affichage
["place1", "place2"].forEach(placeId => {
  const statusRef = ref(db, `places/${placeId}/status`);
  onValue(statusRef, (snapshot) => {
    const status = snapshot.exists() ? snapshot.val() : false;
    updateStatusDisplay(placeId, status);
  });
});
