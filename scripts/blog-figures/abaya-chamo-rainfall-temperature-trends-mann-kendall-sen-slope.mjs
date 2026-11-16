// Figures for src/blog/discoveries/abaya-chamo-rainfall-temperature-trends-mann-kendall-sen-slope.md, made with the maths
// of the Trend analyser (src/lib/sci/trend.ts: Mann-Kendall, Hamed-Rao, Sen slope).
// Run: node scripts/blog-figures/abaya-chamo-rainfall-temperature-trends-mann-kendall-sen-slope.mjs
// Every series here is SIMULATED: the paper gives its slopes and Z values only in tables (images), so we build
// made-up series whose straight-line R² equals the R² the paper states in its text, and ask what Mann-Kendall says.
import fs from 'node:fs';
import { mannKendall, hamedRao, senSlope, senCI } from '../../src/lib/sci/trend.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/abaya-chamo-rainfall-temperature-trends-mann-kendall-sen-slope.md', import.meta.url);

// R² (as fractions) and the paper's verdict (H0 rejected = significant trend), from the text of Shomre et al. (2026),
// PLOS ONE 21(8): e0354913 (CC BY 4.0). Sign: Arbaminch rainfall falls, Dilla max temperature and Hageremariam/Dilla min fall.
const RAIN = [
  { st: 'Fisehagenet', r2: 0.000007, sig: false, s: 1 }, { st: 'Hageremariam', r2: 0.0078, sig: false, s: 1 },
  { st: 'Yirgachefe', r2: 0.00006, sig: false, s: 1 }, { st: 'Dilla', r2: 0.0121, sig: false, s: 1 },
  { st: 'Hagereselam', r2: 0.316, sig: true, s: 1 }, { st: 'Arbaminch', r2: 0.0013, sig: false, s: -1 },
];
const TMAX = [
  { st: 'Fisehagenet', r2: 0.6551, sig: true }, { st: 'Hageremariam', r2: 0.3606, sig: true }, { st: 'Arbaminch', r2: 0.4229, sig: true },
  { st: 'Hagereselam', r2: 0.6174, sig: true }, { st: 'Dilla', r2: 0.1093, sig: true }, { st: 'Yirgachefe', r2: 0.000004, sig: false },
];
const TMIN = [
  { st: 'Fisehagenet', r2: 0.4458, sig: true }, { st: 'Hageremariam', r2: 0.1662, sig: false }, { st: 'Dilla', r2: 0.0159, sig: false },
  { st: 'Hagereselam', r2: 0.3426, sig: true }, { st: 'Arbaminch', r2: 0.0159, sig: false }, { st: 'Yirgachefe', r2: 0.351, sig: true },
];
const Y0 = 1987, Y1 = 2019, N = Y1 - Y0 + 1; // 33 years of weather data (the paper's data statement)

// Seeded random numbers so the figures are the same every run.
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const gauss = (u) => () => Math.sqrt(-2 * Math.log(u() || 1e-12)) * Math.cos(2 * Math.PI * u());

/** A series of length n with mean m and SD sd whose least-squares line has exactly R² = r2 (sign s). */
function withR2(n, r2, s, m, sd, seed) {
  const g = gauss(rng(seed)), t = Array.from({ length: n }, (_, i) => i - (n - 1) / 2);
  let e = t.map(() => g());
  const tt = t.reduce((a, v) => a + v * v, 0), em = e.reduce((a, v) => a + v, 0) / n;
  e = e.map((v) => v - em); const b = e.reduce((a, v, i) => a + v * t[i], 0) / tt; e = e.map((v, i) => v - b * t[i]);
  const ee = Math.sqrt(e.reduce((a, v) => a + v * v, 0) / n), st = Math.sqrt(tt / n);
  return t.map((ti, i) => m + sd * (s * Math.sqrt(r2) * ti / st + Math.sqrt(1 - r2) * e[i] / ee));
}

// Median Mann-Kendall p over many simulated series with a given R² (n = 33 and n = 396).
function medianP(n, r2, reps = 200, hr = false) {
  const ps = [];
  for (let k = 0; k < reps; k++) { const x = withR2(n, r2, 1, 0, 1, 1000 + k); ps.push((hr ? hamedRao(x) : mannKendall(x)).p); }
  ps.sort((a, b) => a - b); return ps[Math.floor(reps / 2)];
}
const grid = [0, 0.01, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.2, 0.25, 0.3, 0.4];
const curve33 = grid.map((r) => medianP(33, r)), curve396 = grid.map((r) => medianP(396, r, 60));
const thresh = (n) => { let lo = 0, hi = 0.5; for (let i = 0; i < 25; i++) { const mid = (lo + hi) / 2; if (medianP(n, mid, n > 100 ? 60 : 200) > 0.05) lo = mid; else hi = mid; } return hi; };
const t33 = thresh(33), t396 = thresh(396);

// One simulated rainfall series per station (mean 1,100 mm and SD 180 mm are OUR assumption, not the paper's).
const years = Array.from({ length: N }, (_, i) => Y0 + i);
const rain = RAIN.map((r, k) => {
  const x = withR2(N, r.r2, r.s, 1100, 180, 77 + k), mk = mannKendall(x), ss = senSlope(years, x), ci = senCI(ss.slopes, mk.varS);
  return { ...r, Z: +mk.Z.toFixed(2), p: +mk.p.toPrecision(3), sen: +(ss.slope * 10).toFixed(1), ci: [+(ci.lo * 10).toFixed(1), +(ci.hi * 10).toFixed(1)], x, ss };
});
// For each station: the median p and the share of 200 simulated 33-year series with its R² that Mann-Kendall calls significant.
const share = (r2) => { let k = 0; for (let i = 0; i < 200; i++) if (mannKendall(withR2(N, r2, 1, 0, 1, 1000 + i)).p < 0.05) k++; return k / 200; };
const temp = (rows) => rows.map((r) => ({ st: r.st, r2: r.r2, paperSig: r.sig, medP: +medianP(33, r.r2).toPrecision(2), share: share(r.r2) }));
const tmax = temp(TMAX), tmin = temp(TMIN);

// Figure 1: simulated Hagereselam-like series (R² 31.6 %) with its Sen line.
const H = rain[4];
const fig1 = chart({
  title: 'A simulated 33-year rainfall series with R² = 31.6 %', xLabel: 'Year', yLabel: 'Annual rainfall (mm, simulated)',
  series: [
    { name: 'Simulated year', kind: 'dots', x: years, y: H.x.map((v) => Math.round(v)), size: 3 },
    { name: `Sen slope +${H.sen} mm per decade`, kind: 'line', x: [Y0, Y1], y: [Y0, Y1].map((t) => Math.round(H.ss.intercept + H.ss.slope * t)) },
  ],
  xDomain: [1986, 2020], height: 280,
  desc: `A made-up rainfall series shaped like the paper's Hagereselam station: Mann-Kendall Z = ${H.Z}, p = ${H.p}, Sen slope about ${H.sen} mm per decade.`,
});

// Figure 2: Mann-Kendall p against R², with the stations placed on it.
const pct = (v) => +(v * 100).toFixed(2);
const fig2 = chart({
  title: 'How strong a straight-line trend Mann-Kendall needs', xLabel: 'Straight-line R² (%)', yLabel: 'Median Mann-Kendall p (simulated)',
  series: [
    { name: '33 annual values', kind: 'line', x: grid.map(pct), y: curve33.map((p) => +p.toFixed(4)) },
    { name: '396 monthly values', kind: 'line', x: grid.map(pct), y: curve396.map((p) => +p.toFixed(4)), dash: '5 4' },
    { name: 'Rainfall stations (paper R²)', kind: 'dots', x: RAIN.map((r) => pct(r.r2)), y: RAIN.map((r) => +medianP(33, r.r2, 100).toFixed(4)), size: 4 },
  ],
  xDomain: [0, 40], yDomain: [0, 1], hlines: [{ y: 0.05, text: 'p = 0.05' }], height: 280,
  desc: `With 33 yearly values, Mann-Kendall reaches p = 0.05 at a straight-line R² of about ${(t33 * 100).toFixed(1)} %; with 396 monthly values, at about ${(t396 * 100).toFixed(1)} %.`,
});

// The rounded series readers paste into the tool (Check it yourself), and what the tool's maths gives for it.
const Hr = H.x.map((v) => Math.round(v)), mkR = mannKendall(Hr), ssR = senSlope(years, Hr), ciR = senCI(ssR.slopes, mkR.varS), hrR = hamedRao(Hr);
console.log('paste:\n' + years.map((y, i) => `${y}\t${Hr[i]}`).join('\n'));
console.log(JSON.stringify({ S: mkR.S, Z: mkR.Z.toFixed(3), p: mkR.p.toPrecision(3), tau: mkR.tau.toFixed(3), senDec: (ssR.slope * 10).toFixed(2), ci: [ciR.lo * 10, ciR.hi * 10].map((v) => v.toFixed(1)), change: (ssR.slope * 32).toFixed(0), hrP: hrR.p.toPrecision(3), hrF: hrR.factor.toFixed(3) }));
console.log(JSON.stringify({ t33: +(t33 * 100).toFixed(1), t396: +(t396 * 100).toFixed(2), rain: rain.map(({ x, ss, ...r }) => r), rainSim: temp(RAIN), tmax, tmin }, null, 0));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'series', figure(fig1, 'Figure 1. A simulated 33-year series built to have the R² the paper states for Hagereselam (31.6 %), with the Sen slope line from the Trend analyser\'s maths. Mean and spread are our assumptions; this is not the station\'s data.'));
  md = inject(md, 'power', figure(fig2, 'Figure 2. Median Mann-Kendall p-value of simulated series against their straight-line R², for 33 yearly and 396 monthly values, with the six rainfall stations placed at the R² the paper states. Simulation, not the paper\'s data.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
