// Figures for src/blog/discoveries/cape-town-wet-season-rain-days-wet-spell-dry-spell-length-weather-log.md, made with the maths of the Weather observer's log
// (src/lib/sci/weatherlog.ts: monthly(log, units, rainDay) counts the days with rain at or above the rain-day threshold, and sums the rain).
// Run: node scripts/blog-figures/cape-town-wet-season-rain-days-wet-spell-dry-spell-length-weather-log.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { monthly, DEFAULT_UNITS } from '../../src/lib/sci/weatherlog.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/cape-town-wet-season-rain-days-wet-spell-dry-spell-length-weather-log.md', import.meta.url);

// Inputs from Ndebele, Grab and Hove (2022), Climate of the Past 18: 2463-2482, doi:10.5194/cp-18-2463-2022 (CC BY 4.0), SAAO record 1950-2018, wet season:
// a wet day is at least 1 mm; 55.6 wet days per season (all-station mean 57.4); wet-season rain 608 mm; season about 188 days (onset about 13 April, end about 18 October);
// wet spells 28 to 31 per season, mean length 1.8 d; 1-day wet spells 16.5 per season (SD 4.17), 2-day 8.7, longer than 2 d about 6; dry spells 4.4 to 5.6 d, 21.7 short (5 d or less) and
// about 10 long (6 d or more) per season; trend in wet days -1 d per decade for 1950-2018.
// OUR assumptions: wet and dry days follow a two-state Markov chain (tomorrow depends only on today), fitted by the two numbers above that define it (55.6 wet days in 188 and a mean wet
// spell of 1.8 d), wet-day rain 1 mm plus an exponential with mean 9.9 mm (mean 10.9 mm, which gives 608 mm), no seasonal shape inside the season, 69 seasons, seeded random numbers.
const DAYS = 188, WET = 55.6, WSPELL = 1.8, YEARS = 69, R = (x, n = 2) => +x.toFixed(n);
const p10 = 1 / WSPELL, frac = WET / DAYS, p01 = (frac * p10) / (1 - frac); // wet->dry and dry->wet probabilities
let seed = 618; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const date = (y, i) => new Date(Date.UTC(y, 3, 14) + i * 864e5).toISOString().slice(0, 10); // 14 April + i
function season(y, scale = 1) {
  const log = []; let wet = rnd() < frac;
  for (let i = 0; i < DAYS; i++) {
    wet = wet ? rnd() >= p10 : rnd() < p01 * scale;
    log.push({ date: date(y, i), tmax: null, tmin: null, rain: wet ? R(1 + -9.9 * Math.log(1 - rnd()), 1) : 0, snow: null, wind: null, dir: '', pres: null, cloud: null, notes: '' });
  }
  return log;
}
const spells = (log) => { const w = [], d = []; let cur = null, n = 0; for (const e of log) { const x = e.rain >= 1; if (x === cur) n++; else { if (cur !== null) (cur ? w : d).push(n); cur = x; n = 1; } } (cur ? w : d).push(n); return { w, d }; };
const wetDays = (log, thr = 1) => monthly(log, DEFAULT_UNITS, thr).reduce((s, m) => s + m.rainDays, 0);
const totalRain = (log) => monthly(log, DEFAULT_UNITS, 1).reduce((s, m) => s + m.rain.sum, 0);
// Part 1: many seasons without a trend, compared with the paper's statistics.
const NS = 600; const ones = [], wdays = [], rain = [], st = { w: 0, one: 0, two: 0, long: 0, d: 0, dshort: 0, dlong: 0, dmean: 0, wmean: 0, maxdry: 0 }; const monthRows = new Map();
for (let k = 0; k < NS; k++) {
  const log = season(1900 + k), s = spells(log);
  wdays.push(wetDays(log)); ones.push(s.w.filter((x) => x === 1).length); rain.push(totalRain(log));
  st.w += s.w.length; st.one += s.w.filter((x) => x === 1).length; st.two += s.w.filter((x) => x === 2).length; st.long += s.w.filter((x) => x > 2).length;
  st.d += s.d.length; st.dshort += s.d.filter((x) => x <= 5).length; st.dlong += s.d.filter((x) => x >= 6).length; st.dmean += s.d.reduce((a, b) => a + b, 0) / s.d.length; st.wmean += s.w.reduce((a, b) => a + b, 0) / s.w.length; st.maxdry += Math.max(...s.d);
  if (k < 200) for (const m of monthly(log, DEFAULT_UNITS, 1)) { const a = monthRows.get(m.key.slice(5)) ?? { n: 0, days: 0, rd: 0, rd5: 0, rd10: 0 }; a.n++; a.days += m.days; a.rd += m.rainDays; a.rd5 += monthly(log.filter((e) => e.date.slice(0, 7) === m.key), DEFAULT_UNITS, 5)[0].rainDays; a.rd10 += monthly(log.filter((e) => e.date.slice(0, 7) === m.key), DEFAULT_UNITS, 10)[0].rainDays; monthRows.set(m.key.slice(5), a); }
}
const mean = (x) => x.reduce((a, b) => a + b, 0) / x.length, sd = (x) => { const m = mean(x); return Math.sqrt(x.reduce((a, b) => a + (b - m) ** 2, 0) / (x.length - 1)); };
const part1 = { p01: R(p01, 3), p10: R(p10, 3), wetDays: R(mean(wdays), 1), sdWet: R(sd(wdays), 1), rain: R(mean(rain), 0), sdRain: R(sd(rain), 0), wSpells: R(st.w / NS, 1), one: R(st.one / NS, 1), two: R(st.two / NS, 1), long: R(st.long / NS, 1), dSpells: R(st.d / NS, 1), dShort: R(st.dshort / NS, 1), dLong: R(st.dlong / NS, 1), dLongShare: R(st.dlong / st.d, 3), sdOne: R(sd(ones), 2), dmeanLen: R(st.dmean / NS, 2), wmeanLen: R(st.wmean / NS, 2), maxDry: R(st.maxdry / NS, 1) };
const by = [...monthRows.entries()].sort().map(([m, a]) => ({ m, rd: R(a.rd / a.n, 1), rd5: R(a.rd5 / a.n, 1), rd10: R(a.rd10 / a.n, 1), days: R(a.days / a.n, 1) }));
const maxDry69 = (() => { const m = []; for (let r = 0; r < 100; r++) { let mx = 0; for (let k = 0; k < 69; k++) mx = Math.max(mx, ...spells(season(7000 + r * 69 + k)).d); m.push(mx); } return R(mean(m), 1); })();
const thr = [1, 5, 10, 20].map((t) => { const x = []; for (let k = 0; k < 120; k++) x.push(wetDays(season(3000 + k), t)); return [t, R(mean(x), 1)]; });
// Part 2: a trend. Wet-day probability falls so that wet days fall by `dec` days per decade over 69 seasons; ordinary least squares and a t test on the seasonal counts.
function ols(y) { const n = y.length, xm = (n - 1) / 2, ym = mean(y); let sxy = 0, sxx = 0; y.forEach((v, i) => { sxy += (i - xm) * (v - ym); sxx += (i - xm) ** 2; }); const b = sxy / sxx, res = y.map((v, i) => v - ym - b * (i - xm)), se = Math.sqrt(res.reduce((s, r) => s + r * r, 0) / (n - 2) / sxx); return { b, t: b / se }; }
const wetOnly = (target) => { const f = target / DAYS, q = (f * p10) / (1 - f); let w = rnd() < f, c = 0; for (let i = 0; i < DAYS; i++) { w = w ? rnd() >= p10 : rnd() < q; if (w) c++; } return c; };
const power = (dec, reps = 600) => { let hit = 0, bs = 0; for (let r = 0; r < reps; r++) { const y = []; for (let k = 0; k < YEARS; k++) { const target = WET - (dec / 10) * (k - (YEARS - 1) / 2); y.push(wetOnly(target)); } const o = ols(y); bs += o.b * 10; if (o.t < -1.995) hit++; } return { power: hit / reps, slope: bs / reps }; };
const decs = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3];
const pw = decs.map((d) => ({ d, ...power(d) }));
const one = (() => { const y = []; for (let k = 0; k < YEARS; k++) y.push(wetOnly(WET - 0.1 * (k - (YEARS - 1) / 2))); return y; })();
const o1 = ols(one);
// Part 3: the paper's 20-year-or-so sub-record is not needed; a 30-year window.
const pw30 = (() => { let hit = 0; for (let r = 0; r < 600; r++) { const y = []; for (let k = 0; k < 30; k++) y.push(wetOnly(WET - 0.1 * (k - 14.5))); if (ols(y).t < -2.048) hit++; } return hit / 600; })();
const fig1 = chart({
  title: 'Wet days per season: one simulated 69-season record', xLabel: 'Season number (1 to 69)', yLabel: 'Wet days (1 mm or more)',
  series: [
    { name: 'Wet days', kind: 'dots', colour: 'var(--c-tools)', size: 2.6, x: one.map((_, i) => i + 1), y: one },
    { name: `Fitted trend ${R(o1.b * 10, 2)} d per decade`, kind: 'line', colour: 'var(--c-blog)', x: [1, YEARS], y: (() => { const ym = mean(one), xm = (YEARS - 1) / 2; return [1, YEARS].map((x) => R(ym + o1.b * (x - 1 - xm), 1)); })() },
  ],
  xDomain: [1, YEARS], desc: 'Wet days per season for 69 simulated seasons in which wet days decline by 1 day per decade on average, with the least-squares line. The scatter from season to season is large compared with the total decline of about 7 days.', height: 300,
});
const fig2 = chart({
  title: 'How often is a decline found? (69 seasons, 5 per cent test)', xLabel: 'True decline (wet days per decade)', yLabel: 'Share of simulated records that detect it',
  series: [{ name: 'Detection rate', kind: 'line', colour: 'var(--c-blog)', x: pw.map((p) => p.d), y: pw.map((p) => R(p.power, 3)) }, { name: 'Detection rate', kind: 'dots', colour: 'var(--c-blog)', size: 3, noLegend: true, x: pw.map((p) => p.d), y: pw.map((p) => R(p.power, 3)) }],
  xDomain: [0, 3], yDomain: [0, 1], vlines: [{ x: 1, text: '1 d per decade' }],
  desc: 'Share of simulated 69-season records in which a two-sided 5 per cent least-squares trend test finds a decline in wet days, against the true decline in days per decade from 0 to 3. At zero it is about 5 per cent; at 1 day per decade it is moderate.', height: 290,
});
const res = { maxDry69, part1, by, thr, pw, o1: { b10: R(o1.b * 10, 2), t: R(o1.t, 2) }, pw30, expect: { oneDay: R(WET / WSPELL * p10, 1), twoDay: R(WET / WSPELL * (1 - p10) * p10, 1), longer: R(WET / WSPELL * (1 - p10) ** 2, 1), wetSpells: R(WET / WSPELL, 1), dryMean: R(1 / p01, 2), dryLongShare: R((1 - p01) ** 5, 3) } };
console.log(JSON.stringify(res));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'series', figure(fig1, 'Figure 1. One simulated record of 69 wet seasons (1950 to 2018 in length) with a decline of 1 wet day per decade built in. Wet days per season come from the Weather observer\'s log monthly maths; the line is the least-squares trend. Our simulation, not the paper\'s data.'));
  md = inject(md, 'power', figure(fig2, 'Figure 2. How often a 5 per cent least-squares test finds a decline in 69 simulated seasons, for true declines of 0 to 3 wet days per decade (600 records for each point). Our simulation.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
