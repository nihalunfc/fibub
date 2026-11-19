// Figures for src/blog/together/gta-6-download-size-cheats-console-vs-pc-cost.md, made with the maths of the
// Speed Test (src/lib/net/speed.ts: transferSeconds) and the Electricity cost tool (src/lib/money/household.ts:
// electricity). Also prints the phone-keypad numbers for the guessed cheat words.
// Run: node scripts/blog-figures/gta-6-download-size-cheats-console-vs-pc-cost.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { register } from 'node:module';
// The money library imports its neighbours without the .ts ending (as Astro allows); add it so plain Node can load it.
register('data:text/javascript,' + encodeURIComponent(`export async function resolve(s, c, next) { try { return await next(s, c); } catch (e) { if (/^\\.{1,2}\\//.test(s) && !/\\.\\w+$/.test(s)) return next(s + '.ts', c); throw e; } }`));
const { transferSeconds } = await import('../../src/lib/net/speed.ts');
const { electricity } = await import('../../src/lib/money/household.ts');
const { chart, figure, inject } = await import('./svg.mjs');

const ART = new URL('../../src/blog/together/gta-6-download-size-cheats-console-vs-pc-cost.md', import.meta.url);

// 1. Download time for the 212 GB pre-load (Rockstar's "up to 212 GB"), at line speeds from 10 to 1,000 Mbps.
// Two cases: the full line speed, and 60 % of it (Wi-Fi, busy evenings, shared line). 60 % is our assumption.
const GB = 212e9;
const lx = Array.from({ length: 81 }, (_, i) => 1 + i * (2 / 80)); // log10(Mbps) from 1 (10 Mbps) to 3 (1,000 Mbps)
const hours = (mbps, share = 1) => transferSeconds(GB, mbps * share) / 3600;
const fig1 = chart({
  title: 'Time to download 212 GB', xLabel: 'Internet speed (Mbps, log scale)', yLabel: 'Hours',
  series: [
    { name: 'At the full speed', kind: 'line', x: lx, y: lx.map((v) => +hours(10 ** v).toFixed(2)) },
    { name: 'At 60 % of it', kind: 'line', dash: '5 4', x: lx, y: lx.map((v) => +hours(10 ** v, 0.6).toFixed(2)) },
  ],
  xTicks: [1, Math.log10(25), Math.log10(50), 2, Math.log10(300), 3], xFmt: (v) => String(Math.round(10 ** v)),
  yDomain: [0, 80], yTicks: [0, 20, 40, 60, 80],
  desc: 'At 25 Mbps the download takes about 19 hours; at 100 Mbps about 4.7 hours; at 1,000 Mbps under half an hour.',
});

// 2. Electricity a year against hours of play a day. Watts are our round assumptions (not measurements):
// console about 200 W while playing, mid-range gaming PC about 400 W, high-end gaming PC about 650 W.
// Price 0.15 per kWh (the tool's default; works in any currency). 30 days a month, standby left out.
const flat = (p) => ({ mode: 'flat', flat: p, on: 0, mid: 0, off: 0, onShare: 0, midShare: 0, fixed: 0 });
const yearCost = (w, h, p = 0.15) => electricity([{ name: 'x', watts: w, hoursPerDay: h, daysPerMonth: 30, standbyWatts: 0 }], flat(p)).year;
const hx = Array.from({ length: 25 }, (_, i) => i * 0.25);
const MACHINES = [['Console 200 W', 200], ['Mid PC 400 W', 400], ['High-end PC 650 W', 650]];
const fig2 = chart({
  title: 'Electricity a year at 0.15 per kWh', xLabel: 'Hours of play a day', yLabel: 'Cost a year (any currency)',
  series: MACHINES.map(([name, w], i) => ({ name, kind: 'line', x: hx, y: hx.map((h) => +yearCost(w, h).toFixed(2)), dash: i === 2 ? '5 4' : undefined })),
  xDomain: [0, 6], xTicks: [0, 1, 2, 3, 4, 5, 6], yDomain: [0, 220], yTicks: [0, 50, 100, 150, 200],
  desc: 'At 3 hours a day a 200 W console uses about 33 a year, a 400 W PC about 65 and a 650 W PC about 106.',
});

// 3. Money spent over five years in the USA: list price on day one plus electricity (3 hours a day, 0.15 USD/kWh).
// Prices: Sony (2 April 2026), Microsoft via Pure Xbox (1 August 2026), Tom's Hardware best gaming PCs (6 Nov 2026).
const BUY = [['PS5 (disc)', 649.99, 200], ['Xbox Series X (disc)', 799.99, 200], ['PS5 Pro', 899.99, 230], ['PC, RTX 5070', 1699.99, 400]];
const yrs = Array.from({ length: 21 }, (_, i) => i * 0.25);
const fig3 = chart({
  title: 'Five-year cost in the USA (US$)', xLabel: 'Years of use', yLabel: 'Money spent (US$)',
  series: BUY.map(([name, price, w], i) => ({ name, kind: 'line', x: yrs, y: yrs.map((t) => Math.round(price + yearCost(w, 3) * t)), dash: i === 1 ? '5 4' : i === 3 ? '2 3' : undefined })),
  xDomain: [0, 5], xTicks: [0, 1, 2, 3, 4, 5], yDomain: [0, 2200], yTicks: [0, 500, 1000, 1500, 2000], yFmt: (v) => v.toLocaleString('en-US'), height: 320,
  desc: 'Electricity adds only about 33 to 65 US dollars a year, so the gap set by the price on day one barely changes in five years.',
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'download', figure(fig1, 'Download time for 212 GB, worked out with the Speed Test\'s own transfer-time maths. Real downloads are often slower than the line speed, so the dashed line assumes 60 % of it.'));
md = inject(md, 'power', figure(fig2, 'Yearly electricity cost from the Electricity cost tool\'s maths. The watts are round assumptions: measure your own machine with a plug-in meter.'));
md = inject(md, 'fiveyear', figure(fig3, 'List price on day one plus electricity at 3 hours a day and 0.15 US$ per kWh. Games, subscriptions and resale are left out.'));
fs.writeFileSync(ART, md);

// Numbers quoted in the text.
for (const s of [10, 25, 50, 100, 300, 500, 1000]) console.log(`${s} Mbps: ${hours(s).toFixed(2)} h full, ${hours(s, 0.6).toFixed(2)} h at 60%`);
for (const [n, w] of MACHINES) console.log(n, [1, 2, 3, 4].map((h) => yearCost(w, h).toFixed(2)).join(' '));
for (const [n, p, w] of BUY) console.log(n, 'year electricity', yearCost(w, 3).toFixed(2), '5y total', (p + 5 * yearCost(w, 3)).toFixed(2));
const KEY = { A: 2, B: 2, C: 2, D: 3, E: 3, F: 3, G: 4, H: 4, I: 4, J: 5, K: 5, L: 5, M: 6, N: 6, O: 6, P: 7, Q: 7, R: 7, S: 7, T: 8, U: 8, V: 8, W: 9, X: 9, Y: 9, Z: 9 };
export const phone = (w) => '1-999-' + [...w.toUpperCase()].map((c) => KEY[c]).join('');
if (process.argv[2]) for (const w of process.argv.slice(2)) console.log(w, phone(w));
