# Loz Town Patrol

Site web d'une association sound system & culture dub basée à Lausanne : agenda des soirées, archives des sessions passées, et un back-office pour que l'association publie ses événements sans toucher au code.

## Description

Projet réalisé pour **Loz Town Patrol**, association à but non lucratif organisant des soirées roots / dub / steppas en Suisse romande. Le besoin de départ : les membres de l'association devaient pouvoir annoncer un événement (date, lieu, line-up, affiche, photos, vidéos) eux-mêmes, sans dépendre d'un développeur et sans base de données à maintenir.

La première version du site reposait sur des pages HTML statiques et Firebase (Firestore + Storage) pour les données d'événements. Elle a été réécrite en **générateur de site statique (Eleventy)** avec **Decap CMS** : les événements sont désormais des fichiers Markdown versionnés dans Git, l'édition passe par une interface d'admin, et chaque publication déclenche un rebuild automatique sur Netlify. Résultat : plus de coût d'infrastructure, plus de runtime JS côté données, et un historique complet des modifications dans l'historique Git.

Côté technique, l'intérêt du projet tient surtout au découpage automatique passé / à venir (collections Eleventy calculées à la date du build), aux filtres personnalisés (formats de dates `fr-CH`, extraction d'ID YouTube pour les embeds) et à un design entièrement fait main en CSS vanilla — pas de framework UI.

## Site en ligne

👉 **https://loztownpatrol.netlify.app/**

Interface d'administration : `/admin/` (accès réservé, authentification via DecapBridge).

## Stack technique

- **[Eleventy 3](https://www.11ty.dev/)** (`@11ty/eleventy` ^3.0.0) — générateur de site statique, seule dépendance du projet
- **Nunjucks** — templates, layouts et partials (`.njk`)
- **Markdown + front matter YAML** — chaque événement est un fichier dans `src/events/`
- **[Decap CMS 3](https://decapcms.org/)** — back-office d'édition, chargé via CDN
- **DecapBridge** (git-gateway, auth PKCE) — passerelle d'authentification et de commits vers GitHub
- **CSS vanilla** (~1400 lignes, custom properties, grid/flexbox) — aucun framework CSS
- **JavaScript vanilla** (ES modules) — menu mobile, slider, lightbox
- **Netlify** — build (`npm run build`) et hébergement, Node 20
- **Font Awesome 6** et **Google Fonts** (Space Grotesk, IBM Plex Mono) via CDN

> Historique : le dossier `public/` et `firebase.json` correspondent à l'ancienne version hébergée sur Firebase Hosting avec Firestore. Ils sont conservés pour référence mais ne font plus partie du build.

## Fonctionnalités principales

- **Agenda automatique** — les événements sont triés en « à venir » et « passés » par des collections Eleventy comparant la date du front matter à la date du build ; aucune action manuelle pour archiver une soirée.
- **Édition sans code** — Decap CMS expose un formulaire complet (titre, date, lieu, heure, prix, genres, line-up, affiche, galerie photos, vidéos YouTube, lien Facebook, statut publié) qui écrit directement des fichiers Markdown dans le repo.
- **Publication contrôlée** — le champ `publie` permet de préparer un événement sans qu'il apparaisse sur le site.
- **Page détail riche** — hero avec l'affiche en fond, fiche récapitulative (date / lieu / heure / entrée / line-up), galerie photos avec lightbox (fermeture au clic extérieur et à Échap) et embeds YouTube générés depuis une simple URL collée dans le CMS.
- **Filtres personnalisés** — dates formatées en français suisse (`dateLocale`, `dateJourMois` pour les badges d'affiche), extraction d'ID YouTube, limitation du nombre d'éléments affichés en page d'accueil.
- **Navigation responsive** — menu hamburger accessible (`aria-expanded`, verrouillage du scroll) et grilles fluides, sans dépendance JS externe.

## Aperçu visuel

<!-- capture d'écran à ajouter -->

## Installation locale

Prérequis : Node.js 20+.

```bash
git clone https://github.com/Artjaq/LozTownPatrol.git
cd LozTownPatrol
npm install
```

Serveur de développement avec rechargement à chaud (http://localhost:8080) :

```bash
npm run dev
```

Build de production dans `_site/` :

```bash
npm run build
```

Build verbeux pour diagnostiquer la configuration Eleventy :

```bash
npm run debug
```

L'interface `/admin/` nécessite l'authentification DecapBridge configurée dans [src/admin/config.yml](src/admin/config.yml) et ne fonctionne donc pas en local sans configuration supplémentaire ; en développement, les événements s'éditent directement dans `src/events/*.md`.

## Structure du projet

```
src/
├── _data/site.yaml      # données globales (nom, description, réseaux sociaux)
├── _includes/           # header et footer (Nunjucks)
├── _layouts/            # base.njk (gabarit global) et event.njk (page détail)
├── events/              # un fichier .md par événement (source de vérité)
├── admin/               # Decap CMS : index.html + config.yml (collections & champs)
├── uploads/             # médias envoyés depuis le CMS
├── image/               # logos et visuels de l'association
├── index.njk            # accueil (hero + 3 prochains événements + slider)
├── events.njk           # agenda complet (à venir / passés)
├── about.njk, contact.njk
├── style.css, script.js # copiés tels quels vers _site (passthrough)
│
eleventy.config.js       # collections, filtres, passthrough, arborescence
netlify.toml             # commande de build et dossier publié
_site/                   # sortie du build (ignoré par Git)
public/                  # ancienne version Firebase (héritage, non buildée)
```

## Points ouverts

- Le formulaire de contact ([src/contact.njk](src/contact.njk)) valide les champs côté client mais n'envoie encore rien : il reste à brancher sur un service d'envoi (Netlify Forms ou équivalent).
- Les liens réseaux sociaux dans [src/_data/site.yaml](src/_data/site.yaml) sont des placeholders (`#`).
- Le slider de la page d'accueil utilise encore des images de placeholder.

---

Auteur : Artjaq 
