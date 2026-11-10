// Fleet fuel analysis from a fuel-card table. Plain TypeScript, no DOM. Full-tank method: each fill is
// assumed to fill the tank, so distance since the last fill / litres in this fill = economy for that stretch.

export function parseCsv(text: string): string[][] {
  text = text.replace(/^﻿/, '');
  const first = text.split(/\r?\n/, 1)[0] || '';
  const delim = [',', ';', '\t'].map((d) => [d, first.split(d).length] as const).sort((a, b) => b[1] - a[1])[0][0];
  const rows: string[][] = []; let row: string[] = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === delim) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); cell = ''; if (row.some((x) => x.trim())) rows.push(row); row = []; }
    else cell += c;
  }
  row.push(cell); if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}

export function toNum(s: string | undefined): number {
  if (s == null) return NaN;
  let t = String(s).trim().replace(/[^\d.,\-]/g, '');
  if (!t) return NaN;
  if (/^-?\d+,\d{1,2}$/.test(t)) t = t.replace(',', '.'); else t = t.replace(/,/g, '');
  const v = Number(t);
  return Number.isFinite(v) ? v : NaN;
}

export type Field = 'date' | 'vehicle' | 'odo' | 'qty' | 'amount';
const GUESS: Record<Field, RegExp> = {
  date: /date|day|time/i, vehicle: /vehicle|truck|unit|plate|reg|asset|card/i, odo: /odo|mileage|km|miles|reading/i,
  qty: /litre|liter|gallon|volume|qty|quantity|fuel/i, amount: /amount|cost|total|price|value|spend/i,
};
export function guessColumns(header: string[]): Record<Field, number> {
  const used = new Set<number>(); const out = {} as Record<Field, number>;
  for (const f of ['odo', 'qty', 'date', 'vehicle', 'amount'] as Field[]) {
    let k = header.findIndex((h, i) => !used.has(i) && GUESS[f].test(h));
    if (f === 'vehicle') { const strong = header.findIndex((h, i) => !used.has(i) && /vehicle|truck|unit|plate|asset/i.test(h)); if (strong >= 0) k = strong; }
    if (f === 'amount') { const exact = header.findIndex((h, i) => !used.has(i) && /amount|cost|total/i.test(h)); if (exact >= 0) k = exact; }
    out[f] = k; if (k >= 0) used.add(k);
  }
  return out;
}

export interface Fill { date: string; vehicle: string; odo: number; qty: number; amount: number }
export interface Flag { vehicle: string; date: string; odo: number; kind: 'big' | 'close' | 'economy'; text: string }
export interface VehicleStat {
  vehicle: string; fills: number; distance: number; qty: number; amount: number;
  economy: number; costPerDist: number; points: { odo: number; econ: number; flagged: boolean }[]; median: number; flags: number;
}
export interface Opts { tank: number; tankBy: Record<string, number>; closeDist: number; worsePct: number }

export function median(a: number[]): number {
  const s = [...a].sort((x, y) => x - y), m = s.length >> 1;
  return s.length ? (s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) : NaN;
}

export function rowsToFills(rows: string[][], map: Record<Field, number>): { fills: Fill[]; skipped: number } {
  const fills: Fill[] = []; let skipped = 0;
  for (const r of rows) {
    const odo = toNum(r[map.odo]), qty = toNum(r[map.qty]);
    const vehicle = map.vehicle >= 0 ? (r[map.vehicle] || '').trim() : 'All vehicles';
    const amount = map.amount >= 0 ? toNum(r[map.amount]) : NaN;
    if (!vehicle || !(odo >= 0) || !(qty > 0)) { skipped++; continue; }
    fills.push({ date: map.date >= 0 ? (r[map.date] || '').trim() : '', vehicle, odo, qty, amount });
  }
  return { fills, skipped };
}

export function analyse(fills: Fill[], o: Opts): { stats: VehicleStat[]; flags: Flag[] } {
  const by = new Map<string, Fill[]>();
  for (const f of fills) (by.get(f.vehicle) || by.set(f.vehicle, []).get(f.vehicle)!).push(f);
  const stats: VehicleStat[] = [], flags: Flag[] = [];
  for (const [vehicle, list] of [...by].sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))) {
    list.sort((a, b) => a.odo - b.odo || a.date.localeCompare(b.date));
    const tank = o.tankBy[vehicle] > 0 ? o.tankBy[vehicle] : o.tank;
    const vf: Flag[] = [];
    const pts: { odo: number; econ: number; fill: Fill }[] = [];
    list.forEach((f, k) => {
      if (tank > 0 && f.qty > tank) vf.push({ vehicle, date: f.date, odo: f.odo, kind: 'big', text: `${f.qty} in a ${tank} tank` });
      if (k > 0) {
        const gap = f.odo - list[k - 1].odo;
        if (gap < o.closeDist) vf.push({ vehicle, date: f.date, odo: f.odo, kind: 'close', text: `only ${+gap.toFixed(1)} since the last fill` });
        else pts.push({ odo: f.odo, econ: gap / f.qty, fill: f });
      }
    });
    const med = pts.length >= 3 ? median(pts.map((p) => p.econ)) : NaN;
    const worse = new Set<Fill>();
    if (med > 0) for (const p of pts) if (p.econ < med * (1 - o.worsePct / 100)) {
      worse.add(p.fill);
      vf.push({ vehicle, date: p.fill.date, odo: p.fill.odo, kind: 'economy', text: `${+p.econ.toFixed(2)} is ${Math.round((1 - p.econ / med) * 100)}% under the usual ${+med.toFixed(2)}` });
    }
    const distance = list.length > 1 ? list[list.length - 1].odo - list[0].odo : 0;
    const rest = list.slice(1);
    const qty = rest.reduce((s, f) => s + f.qty, 0);
    const amounts = rest.filter((f) => Number.isFinite(f.amount));
    const amount = amounts.reduce((s, f) => s + f.amount, 0);
    stats.push({
      vehicle, fills: list.length, distance, qty, amount, economy: qty > 0 ? distance / qty : NaN,
      costPerDist: distance > 0 && amounts.length === rest.length ? amount / distance : NaN,
      points: pts.map((p) => ({ odo: p.odo, econ: p.econ, flagged: worse.has(p.fill) })), median: med, flags: vf.length,
    });
    flags.push(...vf);
  }
  return { stats, flags };
}

/** Small SVG: economy for each fill, the usual (median) as a dashed line, flagged fills in red. */
export function econChart(s: VehicleStat, unit: string): string {
  const W = 320, H = 120, L = 34, R = 8, T = 10, B = 18, ps = s.points;
  if (ps.length < 2) return '';
  const hi = Math.max(...ps.map((p) => p.econ), s.median || 0) * 1.1, lo = 0;
  const x = (k: number) => L + (k / (ps.length - 1)) * (W - L - R), y = (v: number) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const line = ps.map((p, k) => `${x(k).toFixed(1)},${y(p.econ).toFixed(1)}`).join(' ');
  const med = Number.isFinite(s.median) ? `<line x1="${L}" x2="${W - R}" y1="${y(s.median)}" y2="${y(s.median)}" stroke="var(--muted)" stroke-dasharray="5 4"/>` : '';
  const dots = ps.map((p, k) => `<circle cx="${x(k).toFixed(1)}" cy="${y(p.econ).toFixed(1)}" r="${p.flagged ? 5 : 3}" fill="${p.flagged ? 'var(--bad)' : 'var(--accent)'}"/>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${s.vehicle}: ${unit} for each fill${s.flags ? ', flagged fills in red' : ''}" style="width:100%;height:auto;display:block">` +
    `<line x1="${L}" x2="${L}" y1="${T}" y2="${H - B}" stroke="var(--line)"/><line x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}" stroke="var(--line)"/>` +
    `<text x="${L - 4}" y="${T + 4}" text-anchor="end" font-size="10" fill="var(--muted)">${+hi.toFixed(1)}</text><text x="${L - 4}" y="${H - B}" text-anchor="end" font-size="10" fill="var(--muted)">0</text>` +
    `<text x="${W - R}" y="${H - 4}" text-anchor="end" font-size="10" fill="var(--muted)">each fill, oldest to newest</text>` +
    `${med}<polyline fill="none" stroke="var(--accent)" stroke-width="2" points="${line}"/>${dots}</svg>`;
}
