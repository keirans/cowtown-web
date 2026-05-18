## ADDED Requirements

### Requirement: Dispatch each module to its type renderer
The system SHALL iterate over the `modules[]` array in order and dispatch each element to the render function registered for its `type` field. The dispatch map SHALL cover `kv_metrics`, `alert_status`, and `banner`. Each rendered card DOM node SHALL be appended to the `#cards` container in the same order as the source array.

#### Scenario: All known module types are rendered in order
- **WHEN** the payload contains modules of types `banner`, `kv_metrics`, and `alert_status`
- **THEN** each is rendered and appended to `#cards` in the order they appear in `modules[]`

### Requirement: Skip unknown module types without crashing
The system SHALL skip any module whose `type` value is not in the dispatch map. A `console.warn` message identifying the unknown `module_id` and `type` SHALL be emitted. The remaining modules SHALL continue to render normally.

#### Scenario: Payload contains an unrecognised module type
- **WHEN** a module has `type: "future_type"` not in the dispatch map
- **THEN** the module is skipped, a console warning is logged, and all other modules render correctly

### Requirement: Clear previous cards before each render
The system SHALL clear the `#cards` container before rendering a new payload. This prevents duplicate cards if the page ever re-fetches data without a full navigation.

#### Scenario: Render is invoked with a new payload
- **WHEN** the renderer runs
- **THEN** any previously appended card DOM nodes are removed before new ones are inserted
