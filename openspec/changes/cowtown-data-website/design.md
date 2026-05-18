## Context

The cowtown-web site is a greenfield static website with no existing code. It will be hosted on GitHub Pages and served from the repository root on the `main` branch. Data is produced by a separate n8n automation pipeline and written to a companion public data repository as `live/data.json`. The frontend is entirely decoupled from data production — it only reads.

The JSON payload schema is fixed and versioned (`schema_version: "1.0.0"`). The `modules[]` array is the primary rendering surface; each element is a self-describing, polymorphic card that carries its own type, status, title, summary, metrics, and bullet points.

## Goals / Non-Goals

**Goals:**
- Render all `modules[]` entries from the live data payload as styled cards
- Apply urgency-level visual treatment per module `status` (`normal`, `info`, `warning`, `danger`)
- Handle fetch failures and malformed payloads with a visible, informative error state
- Deploy with zero build tooling — no bundler, no package manager, no CI pipeline needed
- Cache-bust every fetch so stale CDN responses never mask fresh data

**Non-Goals:**
- No user authentication, accounts, or personalisation
- No write operations or form submissions
- No service worker / offline mode
- No dark mode toggle (keep initial scope minimal)
- No support for the `dev/data.json` environment in the initial release (live only)
- No historical data views or charting

## Decisions

### 1. Vanilla JS with no framework or build step

**Decision:** Plain `index.html` + `style.css` + `app.js`. No npm, no bundler, no transpiler.

**Rationale:** GitHub Pages serves static files directly. The data schema is simple enough that a small dispatcher function replaces any framework abstraction. Introducing a build step (Vite, webpack, etc.) adds CI complexity for zero user-visible benefit at this scale.

**Alternatives considered:**
- React/Vite: more familiar component model, but requires a build pipeline and adds ongoing dependency maintenance.
- Web Components: clean encapsulation but heavier boilerplate than warranted for three card types.

### 2. Module dispatch via a type → render function map

**Decision:** `app.js` maintains a plain object mapping each `type` string to a render function (`{ kv_metrics: renderKvMetrics, alert_status: renderAlertStatus, banner: renderBanner }`). Unknown types are skipped with a console warning, not a thrown error.

**Rationale:** Keeps the rendering logic isolated per card type. Adding a new type in the future requires only one new function and one map entry — no conditional chains to modify.

### 3. Status-level styling via CSS classes on the card root element

**Decision:** Each card element receives a CSS class matching its `status` value (e.g., `class="card status-danger"`). All visual urgency treatment (border colour, header background, icon) is expressed purely in CSS.

**Rationale:** Keeps JS free of presentation logic. The urgency palette can be tuned in `style.css` without touching `app.js`.

### 4. Cache-busting via query string timestamp

**Decision:** All fetches append `?t=${Date.now()}` to the CDN URL.

**Rationale:** GitHub's Raw CDN caches aggressively (5-minute TTL at the edge). Without a busting parameter, users may see hour-old data. A timestamp query string forces a fresh request every page load.

**Alternatives considered:**
- ETags / conditional GET: requires CORS headers on the CDN response that GitHub Raw does not expose.
- Service worker cache invalidation: overkill for a page that is refreshed manually.

### 5. Single HTML file with inline card scaffold

**Decision:** `index.html` contains the page shell (header showing location name + data timestamp, a `#cards` container, and a `#error-banner` hidden by default). `app.js` populates `#cards` by creating DOM nodes, not by injecting raw HTML strings.

**Rationale:** DOM API manipulation avoids XSS risk from inserting untrusted string values from the payload directly into `innerHTML`. Card content (title, metric values, bullet text) is always set via `textContent` or `createElement`.

## Risks / Trade-offs

- **CDN propagation lag** → The 5-minute GitHub CDN TTL is bypassed per-request with cache-busting, but intermediate proxies (corporate firewalls, ISP caches) may still serve stale content. Mitigation: document expected freshness; nothing further is possible without a custom domain + CDN control.
- **Schema drift** → If the data pipeline changes the JSON shape without incrementing `schema_version`, the frontend may silently render incomplete cards. Mitigation: the renderer validates `schema_version` on load and surfaces a visible warning if it is not `"1.0.0"`.
- **Data repository URL coupling** → The CDN URL is hardcoded in `app.js`. If the data repository is renamed or moved, the site breaks. Mitigation: document the dependency clearly; extract the URL to a named constant at the top of `app.js` to make it easy to find and change.
- **No HTTPS enforcement** → GitHub Pages provides HTTPS automatically when using a github.io domain; no action required unless a custom domain is added later.
