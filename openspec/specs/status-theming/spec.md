## ADDED Requirements

### Requirement: Apply status CSS class to all card root elements
The system SHALL add a CSS class matching the module's `status` value (formatted as `status-<value>`, e.g., `status-normal`, `status-warning`) to the root element of every rendered card, regardless of card type. This class is the sole mechanism for status-driven visual styling.

#### Scenario: Normal status card
- **WHEN** a module has `status: "normal"`
- **THEN** the card root element has the class `status-normal`

#### Scenario: Danger status card
- **WHEN** a module has `status: "danger"`
- **THEN** the card root element has the class `status-danger`

### Requirement: Define distinct visual treatment for each status level
The stylesheet SHALL define visually distinct styles for the four status levels. `warning` and `danger` MUST use high-contrast colours (amber/orange and red respectively) that are immediately distinguishable from `normal` (neutral) and `info` (blue). Status styling SHALL apply to at minimum: the card left border or top border accent, and the card header background colour.

#### Scenario: Danger card is visually prominent
- **WHEN** a `status-danger` card is rendered alongside a `status-normal` card
- **THEN** the danger card has a red border accent and red-tinted header, clearly distinguishable from the normal card

#### Scenario: Warning card is visually distinct from danger
- **WHEN** a `status-warning` card is rendered
- **THEN** it uses amber/orange styling, distinct from the red used for danger

### Requirement: Status styling is purely CSS — no JS presentation logic
The JavaScript render functions SHALL NOT make styling decisions based on status (e.g., no inline `style` attributes, no conditional class names beyond applying `status-<value>`). All visual differentiation SHALL be expressed in `style.css`.

#### Scenario: Renderer adds only the status class
- **WHEN** a card element is created by a render function
- **THEN** the function adds `status-<value>` as a class and sets no inline style attributes related to status colour
