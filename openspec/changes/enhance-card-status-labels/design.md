## Context

The dashboard renders `alert_status` cards for fire management (`fire_management`) and bin collection (`waste_collection`). Both currently display a badge in the card header by calling `module.status.toUpperCase()`, which always produces "NORMAL" when the data generator signals no urgency. The actual useful label is held elsewhere in the payload: the fire danger rating is in a `metrics` entry, and the bin type and physical colour are encoded in another `metrics` entry as a freeform string like `"Recyclables (Yellow)"`.

No changes to the data schema or the separate data repository are in scope.

## Goals / Non-Goals

**Goals:**
- Replace the "NORMAL" badge on the fire management card with the fire danger rating text (e.g., "MODERATE")
- Replace the "NORMAL" badge on the bin collection card with the waste type name (e.g., "RECYCLABLES")
- Style the bin collection card with the physical bin colour (yellow or red) regardless of the module's status value

**Non-Goals:**
- No changes to the JSON data schema or the cowtown-data repository
- No changes to any other card types (kv_metrics, banner) or other modules (weather)
- No new module types
- No server-side or build-time processing

## Decisions

### Decision 1: Module-ID-aware badge text extraction in the frontend

**Chosen:** The `renderAlertStatus()` function checks `module.module_id` and, for known IDs, extracts the badge text from a specific `metrics` entry rather than always using `module.status`.

**Alternative considered:** Add a `badge_label` field to the JSON payload so the frontend is purely data-driven. Rejected because it requires coordinated changes to the data schema and data generator in a separate repository — disproportionate for a two-card visual tweak.

**Extraction rules:**
- `fire_management`: find the metric where `label === "Fire Danger Rating"` and use its `value` (uppercased). Fallback to `status.toUpperCase()` if the metric is absent.
- `waste_collection`: parse the metric where `label === "Weekly Collection"`. The value format is `"<Type> (<Colour>)"` (e.g., `"Recyclables (Yellow)"`). Extract the type string before ` (` as the badge text (uppercased). Fallback to `status.toUpperCase()` if parsing fails.

### Decision 2: Bin colour as a supplemental CSS class, not a new status level

**Chosen:** Parse the bin colour from the metric value and add a `.bin-yellow` or `.bin-red` CSS class to the card root element alongside the existing `status-<value>` class. The bin colour class overrides the border and header background.

**Alternative considered:** Expand the `status` vocabulary to include colour names (`"yellow"`, `"red"`). Rejected because it would break the four-level urgency semantic used across all cards and would require schema changes.

**Colour extraction:** Split on ` (` and extract the word before `)`. Lowercase it to produce the class name (e.g., `"Yellow"` → `bin-yellow`). If no match, no bin class is added and the standard status styling applies.

## Risks / Trade-offs

- **Metric label coupling** → The logic depends on exact metric label strings ("Fire Danger Rating", "Weekly Collection"). If the data generator renames these labels, the extraction silently falls back to the status badge. Risk is low given both labels are stable domain terms; mitigation is the graceful fallback.
- **Bin value format coupling** → Parsing relies on the `"<Type> (<Colour>)"` string format. A format change in the data generator would cause fallback to the status badge. Mitigation: fallback behaviour is safe and visible.
- **CSS specificity** → `.bin-yellow` and `.bin-red` must override `.card.status-normal` styles. Achieved by using the compound selector `.card.bin-yellow` which has equal specificity to `.card.status-normal` — source order in the stylesheet ensures bin rules win.

## Migration Plan

1. Add `.bin-yellow` and `.bin-red` CSS rules to `style.css`
2. Update `renderAlertStatus()` in `app.js` to apply module-ID-aware badge text and bin colour class
3. Deploy to GitHub Pages — no data migration or rollback procedure required; the change is purely additive to the frontend
