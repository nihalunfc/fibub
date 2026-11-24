// Figures for src/blog/discoveries/tide-age-form-factor-gesla-tide-gauges-harmonic-prediction.md, made with the maths
// of the Tide predictor (src/lib/sci/tide.ts: harmonic prediction with nodal corrections, high/low waters, windows).
// Run: node scripts/blog-figures/tide-age-form-factor-gesla-tide-gauges-harmonic-prediction.mjs   (rewrites the charts)
import fs from 'node:fs';
import { predict, extremes, windows, astro, speed } from '../../src/lib/sci/tide.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/tide-age-form-factor-gesla-tide-gauges-harmonic-prediction.md', import.meta.url);

// Inputs: NOAA CO-OPS published harmonic constituents (amplitude m, Greenwich phase lag G in degrees, UTC), stations
// 8518750 The Battery NY, 9414290 San Francisco CA, 1612340 Honolulu HI, read from the NOAA metadata API on 2026-11-24.
// The paper (Hart-Davis et al. 2026, Ocean Science 22: 1681) gives the age of the tide for these places in words only.
const C = (s) => s.trim().split('\n').map((l) => { const [name, H, G] = l.trim().split(/\s+/); return { name, H: +H, G: +G }; });
const ST = [
  { id: 'New York (The Battery)', short: 'New York', paper: '18 h', cons: C(`M2 0.671 18.2
S2 0.128 42.9
N2 0.156 0.5
K2 0.036 44.5
K1 0.103 178.5
O1 0.051 176.3
P1 0.033 178.8
Q1 0.011 196.6
M4 0.024 264.1`) },
  { id: 'San Francisco', short: 'San Francisco', paper: '8 h', cons: C(`M2 0.576 208.2
S2 0.137 216.2
N2 0.122 183.2
K2 0.04 206.0
K1 0.37 225.4
O1 0.23 208.4
P1 0.114 222.1
Q1 0.041 202.4
M4 0.022 136.8`) },
  { id: 'Honolulu', short: 'Honolulu', paper: 'negative', cons: C(`M2 0.171 59.4
S2 0.056 54.7
N2 0.033 48.8
K2 0.016 45.7
K1 0.149 226.8
O1 0.081 215.9
P1 0.045 224.9
Q1 0.014 209.6`) },
];
const g = (c, n) => c.find((x) => x.name === n);
const HOUR = 3600000, DAY = 86400000;

// Syzygies (new and full Moon, mean elongation s − h a multiple of 180°) from the same mean longitudes the tool uses.
const syzygies = (a, b) => { const out = []; let prev = null; for (let t = a; t < b; t += HOUR) { const e = (((astro(t).s - astro(t).h) % 180) + 180) % 180; if (prev !== null && e < prev) out.push(t); prev = e; } return out; };
const T0 = Date.UTC(2027, 0, 1), T1 = Date.UTC(2037, 0, 1);
const SYZ = syzygies(T0, T1);

const res = ST.map((s) => {
  const c = s.cons;
  const FF = (g(c, 'K1').H + g(c, 'O1').H) / (g(c, 'M2').H + g(c, 'S2').H);
  const age = (g(c, 'S2').G - g(c, 'M2').G) / (speed('S2') - speed('M2'));
  const ageD = (g(c, 'K1').G - g(c, 'O1').G) / (speed('K1') - speed('O1'));
  // Ten years of predicted high and low waters; range of each half-cycle, smoothed over a lunar day.
  const ex = extremes(c, 0, T0 - 6 * DAY, T1 + 6 * DAY, true);
  const rng = []; for (let i = 1; i < ex.length; i++) rng.push({ t: (ex[i].t + ex[i - 1].t) / 2, r: Math.abs(ex[i].h - ex[i - 1].h) });
  const sm = []; for (let i = 2; i < rng.length - 2; i++) sm.push({ t: rng[i].t, r: (rng[i - 2].r / 2 + rng[i - 1].r + rng[i].r + rng[i + 1].r + rng[i + 2].r / 2) / 4 });
  const lags = SYZ.map((z) => { let best = null; for (const x of sm) if (Math.abs(x.t - z) < 5 * DAY && (!best || x.r > best.r)) best = x; return (best.t - z) / HOUR; });
  const lag = lags.reduce((a, b) => a + b, 0) / lags.length, se = Math.sqrt(lags.reduce((a, b) => a + (b - lag) ** 2, 0) / lags.length / lags.length);
  // High-water stand at spring tides in 2027: hours the level stays within 0.20 m of the highest high water near each syzygy.
  const durs = SYZ.filter((z) => z < Date.UTC(2028, 0, 1)).map((z) => {
    const hw = ex.filter((e) => e.kind === 'high' && Math.abs(e.t - z) < 3 * DAY).sort((a, b) => b.h - a.h)[0];
    const tt = []; for (let t = hw.t - 12 * HOUR; t <= hw.t + 12 * HOUR; t += 2 * 60000) tt.push(t);
    const w = windows({ t: tt, h: predict(c, 0, tt, true) }, hw.h - 0.2).find(([a, b]) => a <= hw.t && b >= hw.t);
    return (w[1] - w[0]) / HOUR;
  });
  const dur = durs.reduce((a, b) => a + b, 0) / durs.length;
  return { ...s, FF, age, ageD, lag, se, sm, dur, dmin: Math.min(...durs), dmax: Math.max(...durs), ex };
});

// Figure 1: lunar-day mean range through January and February 2027, with the new and full Moons marked.
const F0 = Date.UTC(2027, 0, 1), F1 = Date.UTC(2027, 1, 15), dd = (t) => +((t - F0) / DAY).toFixed(2);
const fig1 = chart({
  title: 'Spring tides come after new and full Moon', xLabel: 'Days from 1 January 2027 (UTC)', yLabel: 'Tidal range (m)',
  series: res.map((r) => { const p = r.sm.filter((x) => x.t >= F0 && x.t <= F1); return { name: r.short, kind: 'line', x: p.map((x) => dd(x.t)), y: p.map((x) => +x.r.toFixed(3)) }; }),
  vlines: SYZ.filter((z) => z >= F0 && z <= F1).map((z, i) => ({ x: dd(z), text: i % 2 ? '' : '' })),
  xDomain: [0, dd(F1)], yDomain: [0, 2.4], height: 280,
  desc: `Predicted tidal range (smoothed over a lunar day) at New York, San Francisco and Honolulu, January to mid-February 2027, with dashed lines at new and full Moon. Over ten years the range peaks on average ${res[0].lag.toFixed(0)} h after new or full Moon at New York, ${res[1].lag.toFixed(0)} h at San Francisco and ${res[2].lag.toFixed(0)} h at Honolulu.`,
});

// Figure 2: the shape of a spring high water, level relative to its peak, ±7 h.
const spring = res.map((r) => { const z = SYZ.find((t) => t > Date.UTC(2027, 2, 1)); const hw = r.ex.filter((e) => e.kind === 'high' && Math.abs(e.t - z) < 3 * DAY).sort((a, b) => b.h - a.h)[0]; const x = Array.from({ length: 85 }, (_, i) => -7 + i / 6); return { r, hw, x, y: predict(r.cons, 0, x.map((h) => hw.t + h * HOUR), true).map((v) => +(v - hw.h).toFixed(3)) }; });
const fig2 = chart({
  title: 'How long a spring high water stands within 20 cm', xLabel: 'Hours from high water', yLabel: 'Level below the peak (m)',
  series: spring.map((s) => ({ name: s.r.short, kind: 'line', x: s.x.map((v) => +v.toFixed(3)), y: s.y })),
  hlines: [{ y: -0.2, text: '20 cm below the peak' }], xDomain: [-7, 7], yDomain: [-1.2, 0.05], height: 280,
  desc: `Predicted level around the highest high water near the first new Moon of March 2027, relative to the peak. The water stays within 20 cm of the peak for about ${res.map((r) => r.dur.toFixed(1)).join(', ')} hours (2027 spring-tide average) at New York, San Francisco and Honolulu.`,
});

const out = res.map((r) => ({ id: r.id, FF: +r.FF.toFixed(3), age: +r.age.toFixed(1), ageDiurnal: +r.ageD.toFixed(1), lagFromPredictions: +r.lag.toFixed(1), se: +r.se.toFixed(1), stand20cm: { mean: +r.dur.toFixed(2), min: +r.dmin.toFixed(2), max: +r.dmax.toFixed(2) } }));
console.log(JSON.stringify({ syzygies: SYZ.length, out, marchSpring: spring.map((s) => ({ id: s.r.short, t: new Date(s.hw.t).toISOString(), h: +s.hw.h.toFixed(3) })) }, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'range', figure(fig1, 'Figure 1. Tidal range predicted by the Tide predictor\'s maths from NOAA\'s published constituents, smoothed over one lunar day (about 25 hours). Dashed lines: new and full Moon (mean elongation). Each range peak comes a fixed time after the dashed line: the age of the tide. A prediction, not measured water levels.'));
  md = inject(md, 'stand', figure(fig2, 'Figure 2. The highest predicted high water within three days of the first new Moon of March 2027 at each place (before it at Honolulu), shifted so the peak sits at zero. Where each curve crosses the dashed line marks the start and end of the 20 cm high-water stand.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
