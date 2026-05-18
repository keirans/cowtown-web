## 1. Project Scaffold

- [x] 1.1 Create `index.html` with page shell: `<header>` for location name + timestamp, `#cards` container div, and a hidden `#error-banner` div
- [x] 1.2 Create `style.css` with CSS reset, base layout (responsive single-column on mobile, max-width centered on desktop), and font/colour variables
- [x] 1.3 Create `app.js` as an ES module with a `DATA_URL` constant at the top set to the companion data repository raw CDN URL for `live/data.json`
- [x] 1.4 Link `style.css` and `app.js` (as `type="module"`) from `index.html`

## 2. Data Fetch & Schema Validation

- [x] 2.1 Implement `fetchData()` in `app.js` that appends `?t=${Date.now()}` to `DATA_URL` and calls `fetch()`
- [x] 2.2 Handle non-2xx responses: show `#error-banner` with a descriptive message and abort rendering
- [x] 2.3 Handle JSON parse errors (`SyntaxError`): show `#error-banner` with a format-error message and abort rendering
- [x] 2.4 Handle network exceptions: show `#error-banner` with a connectivity error message and abort rendering
- [x] 2.5 After successful parse, check `metadata.schema_version === "1.0.0"` and display a visible schema-mismatch warning banner if it does not match

## 3. Metadata Header

- [x] 3.1 Populate the `<header>` with `metadata.location.name` via `textContent`
- [x] 3.2 Format `metadata.generated_at` (ISO 8601 UTC) as a human-readable local date + time string and render it in the header

## 4. Module Renderer

- [x] 4.1 Implement a `RENDERERS` dispatch map object: `{ kv_metrics: renderKvMetrics, alert_status: renderAlertStatus, banner: renderBanner }`
- [x] 4.2 Implement `renderModules(modules)` that clears `#cards`, iterates `modules[]`, looks up each `type` in `RENDERERS`, appends the returned node to `#cards`, and emits `console.warn` for unknown types

## 5. Card: kv_metrics

- [x] 5.1 Implement `renderKvMetrics(module)` that creates a card root `<div>` with classes `card status-<module.status>`
- [x] 5.2 Append a `<h2>` header element with `module.title` set via `textContent`
- [x] 5.3 Append a `<p>` summary element with `module.summary` set via `textContent`
- [x] 5.4 If `module.metrics` is non-empty, create a `<dl>` (or `<table>`) and append one `<dt>`/`<dd>` (or `<tr>`) pair per `{label, value}` entry, all set via `textContent`

## 6. Card: alert_status

- [x] 6.1 Implement `renderAlertStatus(module)` that creates a card root `<div>` with classes `card status-<module.status>`
- [x] 6.2 Append a `<header>` containing the `module.title` and a status badge `<span>` with `module.status.toUpperCase()` via `textContent`
- [x] 6.3 Append a `<p>` summary element with `module.summary` via `textContent`
- [x] 6.4 If `module.bullet_points` is non-empty, create a `<ul>` and append one `<li>` per entry via `textContent`

## 7. Card: banner

- [x] 7.1 Implement `renderBanner(module)` that creates a card root `<div>` with classes `card banner status-<module.status>`
- [x] 7.2 Append a `<h2>` with `module.title` via `textContent`
- [x] 7.3 Append a `<p>` with `module.summary` via `textContent`
- [x] 7.4 Add CSS to `style.css` so `.card.banner` spans the full container width (e.g., `grid-column: 1 / -1` if using CSS Grid)

## 8. Status Theming

- [x] 8.1 Define CSS custom properties (or static rules) for the four status levels: `status-normal` (neutral grey), `status-info` (blue), `status-warning` (amber/orange), `status-danger` (red)
- [x] 8.2 Apply status colour to card left-border accent using `border-left: 4px solid var(--status-color)` (or equivalent)
- [x] 8.3 Apply status colour as a tinted background on the card header element
- [x] 8.4 Verify no `style` attributes related to status colour are set in any JS render function

## 9. GitHub Pages Deployment

- [ ] 9.1 Enable GitHub Pages on the repository (Settings → Pages → Source: `main` branch, root `/`)
- [ ] 9.2 Verify the deployed site URL resolves and loads data correctly by opening it in a browser
- [ ] 9.3 Confirm cache-busting is working: open DevTools Network tab, hard-reload, and confirm the `data.json` request URL includes a `?t=` parameter

## 10. End-to-End Smoke Test

- [ ] 10.1 Open the live GitHub Pages URL and confirm all modules from the current `live/data.json` payload render as cards
- [ ] 10.2 Confirm `warning` and `danger` status cards are visually distinct from `normal` and `info` cards
- [ ] 10.3 Temporarily break `DATA_URL` (misspell it) and confirm the error banner appears instead of a blank page, then restore
