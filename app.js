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

  if (module.metrics && module.metrics.length > 0) {
    const table = document.createElement('table');
    table.className = 'metrics-table';
    const tbody = document.createElement('tbody');

    for (const { label, value } of module.metrics) {
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

function renderAlertStatus(module) {
  const card = makeCard(module);

  const header = makeCardHeader(module);
  const badge = document.createElement('span');
  badge.className = 'status-badge';
  badge.textContent = module.status.toUpperCase();
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
