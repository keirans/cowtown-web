## ADDED Requirements

### Requirement: Render kv_metrics module as a structured metric card
The system SHALL render a `kv_metrics` module as a card element containing: a header with the module `title`, a summary paragraph, and a metric table or list where each entry in `metrics[]` is displayed as a label–value pair. The card root element SHALL carry the module's `status` as a CSS class.

#### Scenario: Card with populated metrics array
- **WHEN** a `kv_metrics` module has a non-empty `metrics[]` array
- **THEN** each `{label, value}` pair is rendered as a row with the label left-aligned and value right-aligned (or visually distinct)

#### Scenario: Card with empty metrics array
- **WHEN** a `kv_metrics` module has `metrics: []`
- **THEN** the card still renders with its title and summary but the metric rows section is absent or empty

### Requirement: Render summary text for kv_metrics cards
The system SHALL display the `summary` field as a paragraph of text below the card header and above the metrics rows.

#### Scenario: Summary is present
- **WHEN** a `kv_metrics` module has a non-empty `summary` string
- **THEN** the summary is visible as a paragraph element within the card

### Requirement: Set text content via DOM API only
All `title`, `summary`, `label`, and `value` strings from the payload SHALL be set using `textContent` or equivalent DOM text node APIs — never via `innerHTML` — to prevent XSS from untrusted payload values.

#### Scenario: Module fields set safely
- **WHEN** a module field contains a string like `<script>alert(1)</script>`
- **THEN** the string is rendered as literal text, not executed as HTML
