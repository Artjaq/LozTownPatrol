// =============================================================
//  Loz Town Patrol — Firebase init
//  Remplis les valeurs ci-dessous :
//  Firebase Console → Paramètres du projet → Vos applications → SDK
// =============================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';
import { getStorage }   from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyDuzOvnhiPH0c55Mm0Y4kN8vTwrrn0dsMI",
  authDomain: "loztownpatrol.firebaseapp.com",
  projectId: "loztownpatrol",
  storageBucket: "loztownpatrol.firebasestorage.app",
  messagingSenderId: "330966941297",
  appId: "1:330966941297:web:6d8d3b09ff70b415fd25d0",
  measurementId: "G-3CR3MWCB15"
};

const app = initializeApp(firebaseConfig);

export const db      = getFirestore(app);
export const storage = getStorage(app);
