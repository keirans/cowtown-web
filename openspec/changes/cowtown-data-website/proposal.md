## Why

Cowaramup residents need a single, always-current view of the town's daily data (weather, fire danger, bin day) without navigating multiple sources. A GitHub Pages site consuming structured JSON from a companion data repository delivers this as a zero-infrastructure, zero-cost solution.

## What Changes

- New static website published to GitHub Pages (`index.html` + assets)
- JavaScript runtime that fetches the current `live/data.json` payload from the data repository via the GitHub Raw CDN and renders it dynamically
- Module-driven card renderer that maps each `modules[]` entry to a styled UI card based on its `type` discriminator (`kv_metrics`, `alert_status`, `banner`)
- Status-aware visual styling: cards reflect `normal`, `info`, `warning`, and `danger` urgency levels with distinct color treatment
- Cache-busting on every fetch to bypass the GitHub CDN 5-minute edge cache

## Capabilities

### New Capabilities

- `data-fetch`: Fetches the live JSON payload from the public data repository CDN with cache-busting; handles network errors and falls back to a visible error state
- `module-renderer`: Loops over `modules[]` and dispatches each entry to the correct card template based on the `type` field
- `card-kv-metrics`: Renders a `kv_metrics` module as a structured card with key-value metric rows
- `card-alert-status`: Renders an `alert_status` module as a high-priority card with status header and bullet-point checklist
- `card-banner`: Renders a `banner` module as a prominent daily information banner
- `status-theming`: Applies status-level CSS classes (`normal`, `info`, `warning`, `danger`) across all card types for consistent urgency signalling

### Modified Capabilities

## Impact

- New files: `index.html`, `style.css`, `app.js` (or equivalent bundled assets)
- GitHub Pages must be enabled on the repository (serves from `main` branch root or `/docs`)
- No build step required — vanilla JS/HTML/CSS only
- No backend, no dependencies beyond the companion data repository URL
