#!/usr/bin/env node
// Charts for the Rent compare guide (blog/guides/rent-compare). Every number is worked out with the tool's own
// maths (src/lib/money/rental.ts) and the same postal-area table the tool loads (public/geo/ca-fsa.json), then drawn
// as one-line inline SVG between <!-- fig:<name> --> and <!-- /fig -->. Colours use the site's CSS variables.
// Run: node scripts/rent-figures.mjs   (rewrites the figures in place; prints one line per figure and the key numbers)
import { readFileSync, writeFileSync } from 'node:fs';
import { REGIONS, locate, haversineKm, leg, travel, monthly } from '../src/lib/money/rental.ts';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const T = (x, y, s, a = 'start', st = 'fill:var(--ink)') => `<text x="${x}" y="${y}" text-anchor="${a}" style="${st};font:12px system-ui,sans-serif">${esc(s)}</text>`;
const M = (x, y, s, a = 'start') => T(x, y, s, a, 'fill:var(--muted)');
const svg = (w, h, label, body) => `<figure class="fig"><svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${esc(label)}">${body}</svg><figcaption>${esc(label)}</figcaption></figure>`;
const f0 = (v) => Math.round(v).toLocaleString('en-US');

const table = JSON.parse(readFileSync('public/geo/ca-fsa.json', 'utf8'));
const region = REGIONS[0];
const base = { fuelPrice: 1.4, l100: 8.5, wearPerKm: 0.1, fare: 3.3, passMonthly: 0, timeValue: 0, roadFactor: 1.3 };
const homes = [
  { name: 'A', loc: 'L5B', rent: 2250, bills: { hydro: 60, internet: 65, parking: 75, insurance: 25 } },
  { name: 'B', loc: 'L6Y', rent: 1850, bills: { hydro: 70, heat: 60, water: 35, internet: 65, insurance: 25 } },
];
const places = [{ loc: 'M5V', mode: 'car', perWeek: 5 }, { loc: 'L4W', mode: 'transit', perWeek: 2 }];
const cost = (h, s) => {
  const hp = locate(h.loc, region, table);
  const legs = places.map((p) => ({ ...leg(haversineKm(hp, locate(p.loc, region, table)), p, s), trip: p }));
  return monthly(h, travel(legs, s), s);
};
const figs = {};

// 1. The two example homes, money only and with time at $15 an hour.
{
  const rows = [];
  for (const tv of [0, 15]) for (const h of homes) rows.push({ label: `${h.name}, time at $${tv}/h`, tv, c: cost(h, { ...base, timeValue: tv }) });
  const parts = [['Rent', 'var(--accent)', (c) => c.rent], ['Bills', 'var(--muted)', (c) => c.bills], ['Travel', 'var(--warn)', (c) => c.travel], ['Time', 'var(--bad)', (c, tv) => c.hours * tv]];
  const W = 640, x0 = 120, bw = W - x0 - 70, max = Math.max(...rows.map((r) => r.c.withTime)), H = rows.length * 36 + 36;
  let b = '';
  rows.forEach((r, k) => {
    const y = 6 + k * 36; let x = x0;
    b += T(x0 - 8, y + 17, r.label, 'end');
    for (const [, col, f] of parts) { const w = (bw * f(r.c, r.tv)) / max; b += `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="24" style="fill:${col}"/>`; x += w; }
    b += T((x + 6).toFixed(1), y + 17, '$' + f0(r.c.withTime));
    console.log(`  ${r.label}: rent ${r.c.rent} bills ${r.c.bills} travel ${r.c.travel.toFixed(2)} hours ${r.c.hours.toFixed(2)} total ${r.c.withTime.toFixed(2)}`);
  });
  let lx = x0;
  for (const [l, col] of parts) { b += `<rect x="${lx}" y="${H - 22}" width="12" height="12" rx="2" style="fill:${col}"/>` + M(lx + 16, H - 12, l); lx += 80; }
  figs['two-homes'] = svg(W, H, 'The two example homes, worked out with the Rent compare maths. Counting money only, B is cheaper; once each hour of travel is valued at $15, A wins.', b);
}

// 2. What a commute costs a month by one-way distance (5 round trips a week), by car and by bus, with and without time.
{
  const kms = Array.from({ length: 51 }, (_, i) => i);
  const series = [
    ['Car, money only', 'var(--warn)', 'car', 0, 0],
    ['Car, time at $15/h', 'var(--bad)', 'car', 15, 0],
    ['Bus with a $156 pass, money only', 'var(--accent)', 'transit', 0, 156],
    ['Bus with a $156 pass, time at $15/h', 'var(--ink)', 'transit', 15, 156],
  ].map(([l, col, mode, tv, pass]) => {
    const s = { ...base, timeValue: tv, passMonthly: pass }, trip = { mode, perWeek: 5 };
    return [l, col, kms.map((km) => { if (!km) return 0; const tr = travel([{ ...leg(null, { ...trip, km }, s), trip }], s); return tr.money + tr.hours * tv; })];
  });
  const W = 640, H = 280, x0 = 50, y0 = 230, top = 16, ymax = 1500, xs = (k) => x0 + (k * (W - x0 - 20)) / 50, ys = (v) => y0 - ((y0 - top) * Math.min(v, ymax)) / ymax;
  let b = '';
  for (const v of [0, 500, 1000, 1500]) b += `<line x1="${x0}" x2="${W - 20}" y1="${ys(v)}" y2="${ys(v)}" style="stroke:var(--line)"/>` + M(x0 - 6, ys(v) + 4, '$' + f0(v), 'end');
  for (const k of [0, 10, 20, 30, 40, 50]) b += M(xs(k), y0 + 16, k, 'middle');
  b += M((x0 + W) / 2, y0 + 34, 'one-way road distance to work, km (5 round trips a week)', 'middle');
  series.forEach(([l, col, v], i) => {
    b += `<polyline fill="none" stroke-width="2.5" style="stroke:${col}" points="${v.map((y, k) => `${xs(k).toFixed(1)},${ys(y).toFixed(1)}`).join(' ')}"/>`;
    b += `<rect x="${x0 + 10}" y="${top + 4 + i * 18}" width="12" height="3" style="fill:${col}"/>` + T(x0 + 28, top + 10 + i * 18, l);
    console.log(`  ${l}: 10 km ${v[10].toFixed(2)}, 25 km ${v[25].toFixed(2)}, 40 km ${v[40].toFixed(2)}`);
  });
  figs['km-cost'] = svg(W, H, 'Monthly cost of getting to work 5 days a week by distance, from the Rent compare maths: gas $1.40/L, 8.5 L/100 km, $0.10/km wear, $3.30 fare capped at a $156 pass (example values). Valued time costs more than gas.', b);
}

const f = 'src/blog/guides/rent-compare.md';
let s = readFileSync(f, 'utf8');
for (const n of Object.keys(figs)) {
  const re = new RegExp(`<!-- fig:${n} -->[\\s\\S]*?<!-- /fig -->`);
  if (!re.test(s)) throw new Error(`${f}: no <!-- fig:${n} --> marker`);
  s = s.replace(re, `<!-- fig:${n} -->${figs[n]}<!-- /fig -->`);
  console.log(`${f}: ${n}`);
}
writeFileSync(f, s);
