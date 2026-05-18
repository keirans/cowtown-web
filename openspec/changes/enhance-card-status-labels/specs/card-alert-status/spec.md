## MODIFIED Requirements

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
