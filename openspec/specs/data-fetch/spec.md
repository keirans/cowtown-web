## ADDED Requirements

### Requirement: Fetch live data payload on page load
The system SHALL fetch `live/data.json` from the companion data repository via the GitHub Raw CDN (`raw.githubusercontent.com`) when the page loads. The fetch URL SHALL include a cache-busting query parameter (`?t=<current unix timestamp in ms>`) appended to the path to prevent the CDN from serving stale responses.

#### Scenario: Successful fetch on page load
- **WHEN** the page loads and the CDN is reachable
- **THEN** the system fetches the JSON payload, parses it, and passes it to the module renderer

#### Scenario: Cache-busting parameter is always present
- **WHEN** the fetch URL is constructed
- **THEN** the URL SHALL include `?t=<Date.now()>` as a query string parameter on every request

### Requirement: Validate schema version before rendering
The system SHALL inspect the `metadata.schema_version` field of the parsed payload. If the value is not `"1.0.0"`, the system SHALL display a visible schema-mismatch warning banner above the cards but SHALL still attempt to render received modules.

#### Scenario: Matching schema version
- **WHEN** `metadata.schema_version` equals `"1.0.0"`
- **THEN** no warning is shown and rendering proceeds normally

#### Scenario: Mismatched schema version
- **WHEN** `metadata.schema_version` is any value other than `"1.0.0"`
- **THEN** the system displays a visible warning: "Data schema version mismatch — display may be incomplete"

### Requirement: Display metadata header
The system SHALL render a page header that shows the location name (`metadata.location.name`) and the data generation timestamp (`metadata.generated_at`) formatted as a human-readable local date and time string.

#### Scenario: Header renders location and timestamp
- **WHEN** the payload is successfully fetched and parsed
- **THEN** the header displays the location name and the formatted `generated_at` timestamp

### Requirement: Handle fetch failure gracefully
The system SHALL catch any network error or non-2xx HTTP response and display a visible error banner to the user. The error banner SHALL explain that data could not be loaded and suggest refreshing. No cards SHALL be rendered in the failure state.

#### Scenario: Network error during fetch
- **WHEN** the fetch throws a network exception (e.g., offline, DNS failure)
- **THEN** the `#error-banner` element is made visible with a descriptive error message and no cards are rendered

#### Scenario: Non-2xx HTTP response
- **WHEN** the CDN returns a 404 or 5xx status code
- **THEN** the `#error-banner` element is made visible and no cards are rendered

### Requirement: Handle JSON parse failure gracefully
The system SHALL catch `SyntaxError` thrown during JSON parsing and display the error banner rather than crashing silently.

#### Scenario: Malformed JSON response body
- **WHEN** the response body is not valid JSON
- **THEN** the error banner is displayed with a message indicating a data format error
