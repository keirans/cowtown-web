## 1. CSS — Bin Colour Classes

- [x] 1.1 Add CSS custom properties for the yellow bin palette (amber border colour and light amber tint background) to the `:root` block in `style.css`
- [x] 1.2 Add `.card.bin-yellow` rule with `border-left` using the yellow bin border colour
- [x] 1.3 Add `.card.bin-yellow .card-header` rule with `background` using the yellow bin tint
- [x] 1.4 Add `.card.bin-red` rule with `border-left` reusing `var(--color-danger)`
- [x] 1.5 Add `.card.bin-red .card-header` rule with `background` reusing `var(--tint-danger)`

## 2. JS — Badge Text Extraction Helpers

- [x] 2.1 Add helper `getFireBadgeText(module)` in `app.js` that finds the metric with `label === "Fire Danger Rating"` and returns its value uppercased, falling back to `module.status.toUpperCase()`
- [x] 2.2 Add helper `getBinBadgeText(module)` that finds the metric with `label === "Weekly Collection"`, splits on ` (` to extract the waste type, and returns it uppercased, falling back to `module.status.toUpperCase()`
- [x] 2.3 Add helper `getBinColourClass(module)` that extracts the colour word from inside the parentheses of the "Weekly Collection" metric value (e.g., `"Yellow"` → `"bin-yellow"`), returning `null` if parsing fails

## 3. JS — renderAlertStatus Updates

- [x] 3.1 Update `renderAlertStatus()` to determine badge text via module_id: call `getFireBadgeText` for `fire_management`, `getBinBadgeText` for `waste_collection`, and use `module.status.toUpperCase()` for all other modules
- [x] 3.2 Update `renderAlertStatus()` to call `getBinColourClass()` for `waste_collection` modules and, if a class is returned, add it to the card root element

## 4. Verification

- [ ] 4.1 Open the live site and confirm the Fire Danger & Safety card badge shows the danger rating text (e.g., "MODERATE") instead of "NORMAL"
- [ ] 4.2 Confirm the Bin Collection Schedule card badge shows the waste type (e.g., "RECYCLABLES THIS WEEK") instead of "NORMAL"
- [ ] 4.3 Confirm the Bin Collection card border and header background reflect the physical bin colour (amber for yellow bin week, red for landfill week)
- [ ] 4.4 Confirm the Weather card and any other cards are unaffected and still show their standard status badge
