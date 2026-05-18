### Requirement: Apply bin colour class to waste_collection card
For `alert_status` modules with `module_id: "waste_collection"`, the renderer SHALL parse the bin colour from the metric whose `label` equals `"Weekly Collection"`. The colour is the word inside the parentheses (e.g., `"Recyclables (Yellow)"` → `"yellow"`). The renderer SHALL add the class `bin-<colour>` (lowercased) to the card root element in addition to the existing `status-<value>` class. If the colour cannot be extracted, no bin class is added.

#### Scenario: Yellow bin week
- **WHEN** the `waste_collection` module has `"Weekly Collection": "Recyclables (Yellow)"`
- **THEN** the card root element has class `bin-yellow` alongside its status class

#### Scenario: Red bin week
- **WHEN** the `waste_collection` module has `"Weekly Collection": "Landfill (Red)"`
- **THEN** the card root element has class `bin-red` alongside its status class

#### Scenario: Unparseable colour
- **WHEN** the `waste_collection` module metric value does not contain a parenthesised colour word
- **THEN** no `bin-*` class is added and the card renders with only its status class

### Requirement: Define distinct visual styles for bin colour classes
The stylesheet SHALL define `.card.bin-yellow` and `.card.bin-red` rules that override the left-border accent and card-header background for waste_collection cards. Yellow bin styling SHALL use an amber/yellow palette distinct from the warning orange; red bin styling SHALL reuse the danger red palette. The bin colour class applies only to the card's decorative chrome (border and header background) — the badge background continues to follow the status class rules.

#### Scenario: Yellow bin card is amber-styled
- **WHEN** a card has class `bin-yellow`
- **THEN** the card's left-border accent is amber/yellow and the header background is a light amber tint, visually distinct from the `status-warning` orange

#### Scenario: Red bin card is red-styled
- **WHEN** a card has class `bin-red`
- **THEN** the card's left-border accent and header background match the danger red palette

#### Scenario: Non-bin cards are unaffected
- **WHEN** a card does not have a `bin-*` class
- **THEN** the card's styling is determined solely by its `status-<value>` class as before

### Requirement: Bin colour styling is purely CSS — no inline styles
The JS render function SHALL NOT set any inline `style` attributes for bin colour. All bin visual differentiation SHALL be expressed in `style.css` via the `.bin-yellow` and `.bin-red` class selectors.

#### Scenario: Renderer adds only the bin class
- **WHEN** the `waste_collection` card is created
- **THEN** the renderer adds `bin-<colour>` as a class and sets no inline style attributes related to bin colour
