const DATA_URL = 'https://raw.githubusercontent.com/keirans/cowtown-data/refs/heads/main/live/data.json';

const EXPECTED_SCHEMA_VERSION = '1.0.0';

// ── Error / warning UI ──────────────────────────────────────────

function showError(message) {
  const banner = document.getElementById('error-banner');
  const detail = document.getElementById('error-detail');
  detail.textContent = message ? ` ${message}` : '';
  banner.hidden = false;
}

function showSchemaWarning() {
  document.getElementById('schema-warning').hidden = false;
}

// ── Data fetch ──────────────────────────────────────────────────

async function fetchData() {
  const url = `${DATA_URL}?t=${Date.now()}`;
  let response;
  try {
    response = await fetch(url);
  } catch {
    showError('Unable to reach the data source. Check your connection.');
    return null;
  }

  if (!response.ok) {
    showError(`Server returned ${response.status} ${response.statusText}.`);
    return null;
  }

  let data;
  try {
    data = await response.json();
  } catch {
    showError('The data response was not valid JSON.');
    return null;
  }

  return data;
}

// ── Metadata header ─────────────────────────────────────────────

function renderHeader(metadata) {
  document.getElementById('location-name').textContent = metadata.location.name;

  const ts = new Date(metadata.generated_at);
  const formatted = ts.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  document.getElementById('data-timestamp').textContent = `Updated ${formatted}`;
}

// ── Time formatting ─────────────────────────────────────────────
// Perth is AWST = UTC+8, no DST.
const UTC_TIME_RE  = /^(\d{2}:\d{2}) UTC \((\d{4}-\d{2}-\d{2})\)$/;
const UTC_RANGE_RE = /^(\d{2}:\d{2})[–-](\d{2}:\d{2}) UTC$/;

function toPerth12h(utcTimeStr, refDate = '2000-01-01') {
  return new Date(`${refDate}T${utcTimeStr}:00Z`).toLocaleTimeString('en-AU', {
    timeZone: 'Australia/Perth',
    hour:     'numeric',
    minute:   '2-digit',
    hour12:   true,
  });
}

function formatAsPerth(value) {
  const single = value.match(UTC_TIME_RE);
  if (single) return `${toPerth12h(single[1], single[2])} AWST`;

  const range = value.match(UTC_RANGE_RE);
  if (range) return `${toPerth12h(range[1])} – ${toPerth12h(range[2])} AWST`;

  return value;
}

const PERTH_TIME_LABELS = new Set(['Sunrise', 'Sunset', 'UV Active Period']);

// ── Metric row extraction ────────────────────────────────────────
// Returns [{label, value}] from module.metrics (old schema) or by
// splitting module.bullet_points on ": " (new schema, kv_metrics only).
function getMetricRows(module) {
  if (module.metrics?.length > 0) return module.metrics;
  if (module.bullet_points?.length > 0) {
    return module.bullet_points.map(s => {
      const idx = s.indexOf(': ');
      return idx !== -1
        ? { label: s.slice(0, idx), value: s.slice(idx + 2) }
        : { label: s, value: '' };
    });
  }
  return [];
}

// ── Module-specific badge helpers ───────────────────────────────

function getFireBadgeText(module) {
  const metric = module.metrics?.find(m => m.label === 'Fire Danger Rating');
  return metric ? metric.value.toUpperCase() : module.status.toUpperCase();
}

function getBinBadgeText(module) {
  const metric = module.metrics?.find(m => m.label === 'Weekly Collection');
  if (!metric) return module.status.toUpperCase();
  const type = metric.value.split(' (')[0];
  return type ? type.toUpperCase() : module.status.toUpperCase();
}

function getBinColourClass(module) {
  const metric = module.metrics?.find(m => m.label === 'Weekly Collection');
  if (!metric) return null;
  const match = metric.value.match(/\((\w+)\)/);
  return match ? `bin-${match[1].toLowerCase()}` : null;
}

// ── Card renderers ──────────────────────────────────────────────

function makeCard(module) {
  const card = document.createElement('div');
  card.className = `card status-${module.status}`;
  return card;
}

function makeCardHeader(module) {
  const header = document.createElement('div');
  header.className = 'card-header';

  const title = document.createElement('h2');
  title.textContent = module.title;
  header.appendChild(title);

  return header;
}

function makeCardBody() {
  const body = document.createElement('div');
  body.className = 'card-body';
  return body;
}

function makeSummary(text) {
  const p = document.createElement('p');
  p.className = 'card-summary';
  p.textContent = text;
  return p;
}

function renderKvMetrics(module) {
  const card = makeCard(module);
  card.appendChild(makeCardHeader(module));

  const body = makeCardBody();
  body.appendChild(makeSummary(module.summary));

  const rows = getMetricRows(module);
  if (rows.length > 0) {
    const table = document.createElement('table');
    table.className = 'metrics-table';
    const tbody = document.createElement('tbody');

    for (const { label, value } of rows) {
      const row = document.createElement('tr');

      const labelCell = document.createElement('td');
      labelCell.className = 'metric-label';
      labelCell.textContent = label;

      const valueCell = document.createElement('td');
      valueCell.className = 'metric-value';
      valueCell.textContent = PERTH_TIME_LABELS.has(label) ? formatAsPerth(value) : value;

      row.appendChild(labelCell);
      row.appendChild(valueCell);
      tbody.appendChild(row);
    }

    table.appendChild(tbody);
    body.appendChild(table);
  }

  card.appendChild(body);
  return card;
}

function renderAlertStatus(module) {
  const card = makeCard(module);

  if (module.module_id === 'waste_collection') {
    const binClass = getBinColourClass(module);
    if (binClass) card.classList.add(binClass);
  }

  const header = makeCardHeader(module);
  const badge = document.createElement('span');
  badge.className = 'status-badge';

  if (module.module_id === 'fire_management') {
    badge.textContent = getFireBadgeText(module);
  } else if (module.module_id === 'waste_collection') {
    badge.textContent = getBinBadgeText(module);
  } else {
    badge.textContent = module.status.toUpperCase();
  }

  header.appendChild(badge);
  card.appendChild(header);

  const body = makeCardBody();
  body.appendChild(makeSummary(module.summary));

  if (module.bullet_points && module.bullet_points.length > 0) {
    const ul = document.createElement('ul');
    ul.className = 'bullet-list';
    for (const point of module.bullet_points) {
      const li = document.createElement('li');
      li.textContent = point;
      ul.appendChild(li);
    }
    body.appendChild(ul);
  }

  card.appendChild(body);
  return card;
}

function renderBanner(module) {
  const card = makeCard(module);
  card.classList.add('banner');
  card.appendChild(makeCardHeader(module));

  const body = makeCardBody();
  body.appendChild(makeSummary(module.summary));

  const rows = getMetricRows(module);
  if (rows.length > 0) {
    const table = document.createElement('table');
    table.className = 'metrics-table';
    const tbody = document.createElement('tbody');

    for (const { label, value } of rows) {
      const row = document.createElement('tr');

      const labelCell = document.createElement('td');
      labelCell.className = 'metric-label';
      labelCell.textContent = label;

      const valueCell = document.createElement('td');
      valueCell.className = 'metric-value';
      valueCell.textContent = value;

      row.appendChild(labelCell);
      row.appendChild(valueCell);
      tbody.appendChild(row);
    }

    table.appendChild(tbody);
    body.appendChild(table);
  }

  card.appendChild(body);
  return card;
}

// ── Module dispatch ─────────────────────────────────────────────

const RENDERERS = {
  kv_metrics:   renderKvMetrics,
  alert_status: renderAlertStatus,
  banner:       renderBanner,
};

function renderModules(modules) {
  const container = document.getElementById('cards');
  container.innerHTML = '';

  for (const module of modules) {
    const renderer = RENDERERS[module.type];
    if (!renderer) {
      console.warn(`Unknown module type "${module.type}" (id: ${module.module_id}) — skipping`);
      continue;
    }
    container.appendChild(renderer(module));
  }
}

// ── Entry point ─────────────────────────────────────────────────

async function init() {
  const data = await fetchData();
  if (!data) return;

  if (data.metadata?.schema_version !== EXPECTED_SCHEMA_VERSION) {
    showSchemaWarning();
  }

  renderHeader(data.metadata);
  renderModules(data.modules);
}

init();
