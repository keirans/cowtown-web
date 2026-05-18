## ADDED Requirements

### Requirement: Render alert_status module as a high-priority card
The system SHALL render an `alert_status` module as a card element with a visually prominent header showing the module `title` and `status`, a summary paragraph, and a bullet-point checklist derived from `bullet_points[]`. The card root element SHALL carry the module's `status` as a CSS class, producing strong visual differentiation for `warning` and `danger` statuses.

#### Scenario: Card with populated bullet_points array
- **WHEN** an `alert_status` module has a non-empty `bullet_points[]` array
- **THEN** each string in the array is rendered as a list item (`<li>`) within an unordered list

#### Scenario: Card with empty bullet_points array
- **WHEN** an `alert_status` module has `bullet_points: []`
- **THEN** the card renders with title and summary only; the bullet list is absent

### Requirement: Display status label in card header
The system SHALL render a visible badge or label in the `alert_status` card header. For most modules the badge text is `module.status` uppercased. For the `fire_management` module the badge text SHALL be the value of the metric whose `label` equals `"Fire Danger Rating"`, uppercased. For the `waste_collection` module the badge text SHALL be the waste type name extracted from the metric whose `label` equals `"Weekly Collection"` (the portion before ` (` in the value string), uppercased. If the required metric is absent or unparseable the badge SHALL fall back to `module.status.toUpperCase()`.

#### Scenario: Danger-status card header
- **WHEN** an `alert_status` module has `status: "danger"` and a `module_id` other than `fire_management` or `waste_collection`
- **THEN** the card header contains a visible badge reading "DANGER"

#### Scenario: Normal-status card header
- **WHEN** an `alert_status` module has `status: "normal"` and a `module_id` other than `fire_management` or `waste_collection`
- **THEN** the card header contains a visible badge reading "NORMAL"

#### Scenario: Fire management badge shows danger rating
- **WHEN** the `fire_management` module has a metric with `label: "Fire Danger Rating"` and `value: "Moderate"`
- **THEN** the card header badge reads "MODERATE"

#### Scenario: Fire management badge fallback
- **WHEN** the `fire_management` module has no metric with `label: "Fire Danger Rating"`
- **THEN** the card header badge falls back to the module's `status.toUpperCase()`

#### Scenario: Bin collection badge shows waste type
- **WHEN** the `waste_collection` module has a metric with `label: "Weekly Collection"` and `value: "Recyclables (Yellow)"`
- **THEN** the card header badge reads "RECYCLABLES"

#### Scenario: Bin collection badge shows landfill type
- **WHEN** the `waste_collection` module has a metric with `label: "Weekly Collection"` and `value: "Landfill (Red)"`
- **THEN** the card header badge reads "LANDFILL"

#### Scenario: Bin collection badge fallback
- **WHEN** the `waste_collection` module has no metric with `label: "Weekly Collection"` or the value does not match the expected format
- **THEN** the card header badge falls back to the module's `status.toUpperCase()`

### Requirement: Set text content via DOM API only
All `title`, `summary`, and `bullet_points` strings SHALL be set via `textContent` or DOM text node APIs, never `innerHTML`.

#### Scenario: Bullet point contains HTML-like string
- **WHEN** a `bullet_points` entry contains `<b>bold</b>`
- **THEN** the string is rendered as literal text, not parsed as HTML
