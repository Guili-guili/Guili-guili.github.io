import { db } from "./firebase-config.js";

import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Exemple : changer un statut
function toggleOpenStatus(id, isOpen) {
  set(ref(db, 'places/' + id + '/status'), isOpen);
}
