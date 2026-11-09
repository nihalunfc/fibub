// Turns the daily count files in data/views/days/ into the summary tables: one row per period and
// page, with the whole site as page "(site)". Weeks are ISO weeks (Monday to Sunday, e.g. 2026-W46).
// Kept free of file access so tests/views.mjs can check it.

export function isoWeek(day) {
  const d = new Date(day + 'T00:00:00Z');
  const dow = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dow + 3); // the Thursday of this week decides its year
  const year = d.getUTCFullYear();
  const week = 1 + Math.floor((d - Date.UTC(year, 0, 1)) / 86_400_000 / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

// days: [{ date, site, pages: {path: n}, uses: {toolId: n} }]; toolPages: {toolId: path}
// totals: all-time counts from the live counters (they include views from before daily counting began).
export function summarise(days, toolPages, totals) {
  const pageTool = Object.fromEntries(Object.entries(toolPages).map(([id, p]) => [p, id]));
  const periods = { daily: (d) => d, weekly: isoWeek, monthly: (d) => d.slice(0, 7), yearly: (d) => d.slice(0, 4) };
  const out = {};
  for (const [name, key] of Object.entries(periods)) {
    const m = new Map();
    const add = (period, page, field, n) => {
      const k = `${period}\t${page}`;
      const row = m.get(k) ?? m.set(k, { period, page, tool: page === '(site)' ? '' : pageTool[page] ?? '', views: 0, uses: 0 }).get(k);
      row[field] += n;
    };
    for (const day of days) {
      const p = key(day.date);
      add(p, '(site)', 'views', day.site ?? 0);
      for (const [page, n] of Object.entries(day.pages ?? {})) add(p, page, 'views', n);
      for (const [id, n] of Object.entries(day.uses ?? {})) { add(p, toolPages[id] ?? `tool:${id}`, 'uses', n); add(p, '(site)', 'uses', n); }
    }
    out[name] = [...m.values()].sort((a, b) => a.period.localeCompare(b.period) || (a.page === '(site)' ? -1 : b.page === '(site)' ? 1 : b.views - a.views || a.page.localeCompare(b.page)));
  }
  if (totals) {
    const rows = new Map([['(site)', { page: '(site)', tool: '', views: totals.site, uses: Object.values(totals.uses).reduce((s, n) => s + n, 0) }]]);
    for (const [page, n] of Object.entries(totals.pages)) rows.set(page, { page, tool: pageTool[page] ?? '', views: n, uses: 0 });
    for (const [id, n] of Object.entries(totals.uses)) {
      const page = toolPages[id] ?? `tool:${id}`;
      (rows.get(page) ?? rows.set(page, { page, tool: id, views: 0, uses: 0 }).get(page)).uses = n;
    }
    out['all-time'] = [...rows.values()].sort((a, b) => (a.page === '(site)' ? -1 : b.page === '(site)' ? 1 : b.views - a.views || a.page.localeCompare(b.page)));
  }
  return out;
}

export function toCsv(rows) {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  const cell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  return [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n') + '\n';
}
