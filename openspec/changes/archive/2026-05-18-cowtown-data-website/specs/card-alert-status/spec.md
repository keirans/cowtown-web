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
The system SHALL render the `status` value as a visible badge or label within the `alert_status` card header so the urgency level is immediately identifiable without relying on colour alone (accessibility).

#### Scenario: Danger-status card header
- **WHEN** an `alert_status` module has `status: "danger"`
- **THEN** the card header contains a visible text label or badge reading "DANGER" (or equivalent uppercase label)

#### Scenario: Normal-status card header
- **WHEN** an `alert_status` module has `status: "normal"`
- **THEN** the card header contains a visible text label or badge reading "NORMAL"

### Requirement: Set text content via DOM API only
All `title`, `summary`, and `bullet_points` strings SHALL be set via `textContent` or DOM text node APIs, never `innerHTML`.

#### Scenario: Bullet point contains HTML-like string
- **WHEN** a `bullet_points` entry contains `<b>bold</b>`
- **THEN** the string is rendered as literal text, not parsed as HTML
