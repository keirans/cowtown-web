## Why

The fire safety and bin collection cards both show a generic "NORMAL" badge that tells users nothing actionable. Users need to immediately see the actual fire danger level and which bin to put out this week — and for the bin card, the visual colour should match the physical bin they need to use.

## What Changes

- **Fire safety card badge**: Replaces the generic "NORMAL" status badge with the actual fire danger rating text drawn from the module's metrics (e.g., "MODERATE", "HIGH"), so the urgency is immediately readable without digging into the card body.
- **Bin collection card badge**: Replaces "NORMAL" with the waste type name (e.g., "Recyclables", "Landfill") so users know at a glance what goes out this week.
- **Bin collection card colour**: The card's left-border accent, header background, and badge are styled in the bin's physical colour — yellow for recyclables, red for landfill — rather than the generic neutral grey, so the card is a visual match for the physical bin.

## Capabilities

### New Capabilities
- `bin-color-theming`: CSS classes and JS rendering logic for bin-specific colour theming (yellow, red). These exist outside the four standard status levels and require their own palette entries and card style rules.

### Modified Capabilities
- `card-alert-status`: Badge text is now derived from a module-specific data field rather than always reflecting `module.status`. For `fire_management` modules the badge shows the "Fire Danger Rating" metric value; for `waste_collection` modules it shows the waste type parsed from the "Weekly Collection" metric value.

## Impact

- `app.js`: `renderAlertStatus()` updated with module-ID-aware badge text logic and bin-colour class injection.
- `style.css`: New `.bin-yellow` and `.bin-red` CSS classes for card border, header background, and badge background.
- No changes to the data schema, data repository, or HTML structure.
