## ADDED Requirements

### Requirement: Render banner module as a full-width information strip
The system SHALL render a `banner` module as a full-width card element containing the module `title` and `summary`. The card SHALL span the full width of the card grid/column layout to signal its page-level importance. The card root element SHALL carry the module's `status` as a CSS class.

#### Scenario: Banner renders title and summary
- **WHEN** a `banner` module is in the payload
- **THEN** the rendered card displays the `title` prominently and the `summary` as body text below it

#### Scenario: Banner is visually full-width
- **WHEN** multiple cards are present including a banner
- **THEN** the banner card spans the full container width, not sharing a row with other cards

### Requirement: Set text content via DOM API only
All `title` and `summary` strings SHALL be set via `textContent` or DOM text node APIs, never `innerHTML`.

#### Scenario: Banner summary contains special characters
- **WHEN** a `summary` contains characters like `<`, `>`, or `&`
- **THEN** the characters are displayed as literal text, not interpreted as HTML entities or tags
