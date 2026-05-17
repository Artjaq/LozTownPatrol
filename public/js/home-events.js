// =============================================================
//  Loz Town Patrol — Home : prochains événements
//  Charge les events avec status "upcoming" depuis Firestore
//  et génère les cards .flyer dans #home-events-list.
// =============================================================

import { db } from './firebase.js';
import {
  collection,
  getDocs,
  query,
  where,
  limit
} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const list = document.getElementById('home-events-list');

function formatDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('fr-CH', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderFlyer(event, index) {
  const { id, title, date, city, location, description } = event;
  const dateStr  = formatDate(date);
  const metaStr  = [dateStr, city].filter(Boolean).join(' — ');
  const altClass = index % 2 === 1 ? ' alt' : '';

  return `
    <article class="card event flyer${altClass}">
      <div class="flyer-edge"></div>
      <div class="event-head">
        <div class="event-meta">${metaStr}</div>
        <h3 class="event-title">${title}</h3>
      </div>
      <div class="sep"></div>
      ${description ? `<p>${description}</p>` : ''}
      ${location    ? `<p class="muted"><strong>Lieu :</strong> ${location}</p>` : ''}
      <div class="event-actions">
        <a class="btn btn-solid" href="event.html?id=${id}">Plus d'infos</a>
      </div>
    </article>
  `;
}

async function loadUpcomingEvents() {
  try {
    const q    = query(
      collection(db, 'events'),
      where('status', '==', 'upcoming'),
      limit(4)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      list.innerHTML = `<p class="muted" style="text-align:center;grid-column:1/-1;">Aucun événement à venir pour le moment.</p>`;
      return;
    }

    const events = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const da = a.date?.toDate ? a.date.toDate() : new Date(a.date);
        const db_ = b.date?.toDate ? b.date.toDate() : new Date(b.date);
        return da - db_;
      });
    list.innerHTML = events.map((ev, i) => renderFlyer(ev, i)).join('');
  } catch (err) {
    console.error('[home-events.js]', err);
    list.innerHTML = `<p class="muted" style="text-align:center;grid-column:1/-1;">Impossible de charger les événements.</p>`;
  }
}

loadUpcomingEvents();
