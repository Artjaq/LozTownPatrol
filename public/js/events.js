// =============================================================
//  Loz Town Patrol — Events page
//  Charge tous les événements depuis Firestore et génère
//  les cards dans #events-container, groupées par année.
// =============================================================

import { db } from './firebase.js';
import {
  collection,
  getDocs,
  orderBy,
  query
} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const container = document.getElementById('events-container');

// ── Helpers ────────────────────────────────────────────────────

function formatDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('fr-CH', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getYear(ts) {
  if (!ts) return 'Inconnu';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.getFullYear();
}

function renderTags(tags = []) {
  return tags
    .map(t => `<span class="chip">${t}</span>`)
    .join('');
}

function renderCard(event) {
  const { id, title, date, city, location, description, coverUrl, tags } = event;
  const dateStr   = formatDate(date);
  const metaStr   = [dateStr, city].filter(Boolean).join(' — ');
  const imgHtml   = coverUrl
    ? `<img src="${coverUrl}" alt="${title}" loading="lazy">`
    : `<div class="event-media-placeholder"></div>`;

  return `
    <article class="event-card">
      <a class="event-media" href="event.html?id=${id}" aria-label="Voir ${title}">
        ${imgHtml}
      </a>
      <div class="event-body">
        <div class="event-meta">${metaStr}</div>
        <h3 class="event-name">${title}</h3>
        ${description ? `<p class="event-desc">${description}</p>` : ''}
        ${tags?.length ? `<div class="event-tags">${renderTags(tags)}</div>` : ''}
        <div class="event-actions">
          <a class="btn btn-solid" href="event.html?id=${id}">Voir les détails</a>
        </div>
      </div>
    </article>
  `;
}

function renderByYear(events) {
  // Groupe par année décroissante
  const years = {};
  for (const ev of events) {
    const y = getYear(ev.date);
    if (!years[y]) years[y] = [];
    years[y].push(ev);
  }

  return Object.keys(years)
    .sort((a, b) => b - a)
    .map(year => `
      <div class="year-section">
        <h2 class="year-title">${year}</h2>
        <div class="event-grid">
          ${years[year].map(renderCard).join('')}
        </div>
      </div>
    `)
    .join('');
}

function showLoading() {
  container.innerHTML = `
    <div class="load-state">
      <div class="load-spinner"></div>
      <p>Chargement des événements…</p>
    </div>
  `;
}

function showError(msg) {
  container.innerHTML = `
    <div class="load-state load-error">
      <p>Impossible de charger les événements.</p>
      <p class="muted">${msg}</p>
    </div>
  `;
}

function showEmpty() {
  container.innerHTML = `
    <div class="load-state">
      <p class="muted">Aucun événement pour le moment.</p>
    </div>
  `;
}

// ── Main ───────────────────────────────────────────────────────

async function loadEvents() {
  showLoading();

  try {
    const q      = query(collection(db, 'events'), orderBy('date', 'desc'));
    const snap   = await getDocs(q);

    if (snap.empty) { showEmpty(); return; }

    const events = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    container.innerHTML = renderByYear(events);
  } catch (err) {
    console.error('[events.js]', err);
    showError(err.message);
  }
}

loadEvents();
