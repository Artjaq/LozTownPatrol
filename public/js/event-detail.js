// =============================================================
//  Loz Town Patrol — Event detail page
//  Lit ?id=XXX dans l'URL, charge le document Firestore correspondant
//  et injecte le contenu dans #event-detail-root.
//
//  Structure Firestore attendue (collection "events") :
//  {
//    title:       string,
//    date:        Timestamp,
//    location:    string,           // nom du lieu
//    city:        string,
//    description: string,
//    coverUrl:    string,           // URL HTTPS (Storage ou externe)
//    tags:        string[],
//    status:      "upcoming" | "past",
//    photos:      string[],         // URLs HTTPS publiques (Firebase Storage)
//    videos:      { platform: "youtube"|"vimeo", embedId: string, title?: string }[]
//  }
// =============================================================

import { db } from './firebase.js';
import {
  doc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const root = document.getElementById('event-detail-root');

// ── Helpers ────────────────────────────────────────────────────

function formatDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('fr-CH', { day: 'numeric', month: 'long', year: 'numeric' });
}

function embedUrl(video) {
  if (video.platform === 'youtube') {
    return `https://www.youtube.com/embed/${video.embedId}?rel=0`;
  }
  if (video.platform === 'vimeo') {
    return `https://player.vimeo.com/video/${video.embedId}`;
  }
  return null;
}

function renderPhotos(photos) {
  if (!photos?.length) return '';
  return `
    <section class="detail-section">
      <h2 class="detail-section-title">Photos</h2>
      <div class="photo-grid">
        ${photos.map((url, i) => `
          <a class="photo-item" href="${url}" target="_blank" rel="noopener" aria-label="Photo ${i + 1}">
            <img src="${url}" alt="Photo ${i + 1}" loading="lazy">
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

function renderVideos(videos) {
  if (!videos?.length) return '';
  return `
    <section class="detail-section">
      <h2 class="detail-section-title">Vidéos</h2>
      <div class="video-grid">
        ${videos.map(v => {
          const url = embedUrl(v);
          if (!url) return '';
          return `
            <div class="video-item">
              ${v.title ? `<p class="video-title">${v.title}</p>` : ''}
              <div class="video-wrap">
                <iframe
                  src="${url}"
                  title="${v.title || 'Vidéo'}"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderDetail(id, data) {
  const {
    title, date, city, location, description,
    coverUrl, tags, photos, videos, status
  } = data;

  const dateStr = formatDate(date);
  const metaStr = [dateStr, location, city].filter(Boolean).join(' — ');

  document.title = `${title} — Loz Town Patrol`;

  return `
    <section class="detail-hero" ${coverUrl ? `style="--cover:url('${coverUrl}')"` : ''}>
      <div class="detail-hero-overlay"></div>
      <div class="container detail-hero-inner">
        <a href="events.html" class="back-link">
          <i class="fa-solid fa-arrow-left"></i> Tous les événements
        </a>
        ${status === 'upcoming' ? '<span class="badge-upcoming">À venir</span>' : ''}
        <h1 class="detail-title">${title}</h1>
        <p class="detail-meta">${metaStr}</p>
        ${tags?.length
          ? `<div class="event-tags">${tags.map(t => `<span class="chip">${t}</span>`).join('')}</div>`
          : ''}
      </div>
    </section>

    <div class="container detail-body">
      ${description ? `
        <section class="detail-section">
          <p class="detail-desc">${description}</p>
        </section>
      ` : ''}

      ${renderPhotos(photos)}
      ${renderVideos(videos)}

      <div class="detail-back-row">
        <a href="events.html" class="btn btn-ghost">
          <i class="fa-solid fa-arrow-left"></i> Retour aux événements
        </a>
      </div>
    </div>
  `;
}

function showError(msg) {
  root.innerHTML = `
    <div class="container" style="padding: 48px 16px;">
      <div class="load-state load-error">
        <p>Impossible de charger cet événement.</p>
        <p class="muted">${msg}</p>
        <a href="events.html" class="btn btn-ghost" style="margin-top:16px;">
          Retour aux événements
        </a>
      </div>
    </div>
  `;
}

// ── Main ───────────────────────────────────────────────────────

async function loadEvent() {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');

  if (!id) {
    showError('Aucun identifiant d\'événement fourni.');
    return;
  }

  try {
    const snap = await getDoc(doc(db, 'events', id));

    if (!snap.exists()) {
      showError('Événement introuvable.');
      return;
    }

    root.innerHTML = renderDetail(snap.id, snap.data());
    initLightbox();
  } catch (err) {
    console.error('[event-detail.js]', err);
    showError(err.message);
  }
}

// ── Lightbox ───────────────────────────────────────────────────

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const img   = lightbox.querySelector('.lightbox-img');
  const close = lightbox.querySelector('.lightbox-close');

  function open(src, alt) {
    img.src = src;
    img.alt = alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    img.src = '';
    document.body.style.overflow = '';
  }

  // Clic sur une photo
  document.querySelectorAll('.photo-item').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      open(link.href, link.querySelector('img')?.alt || '');
    });
  });

  // Fermeture : bouton X
  close.addEventListener('click', closeLightbox);

  // Fermeture : clic sur le fond (overlay), pas sur l'image
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Fermeture : touche Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
}

loadEvent();
