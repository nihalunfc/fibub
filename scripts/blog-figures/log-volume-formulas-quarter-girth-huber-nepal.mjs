// Figures for src/blog/discoveries/log-volume-formulas-quarter-girth-huber-nepal.md, made with the maths of the
// Log scale calculator (src/lib/sci/logscale.ts: area, smalian, huber, newton, scaleLog).
// Run: node scripts/blog-figures/log-volume-formulas-quarter-girth-huber-nepal.mjs
import fs from 'node:fs';
import { area, smalian, huber, newton, scaleLog } from '../../src/lib/sci/logscale.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/log-volume-formulas-quarter-girth-huber-nepal.md', import.meta.url);

// Values from the paper (Karki, Dangal and Cedamon 2026, Scientifica 2026: 4884890, CC BY): Huber's formula gives
// 27.34 % more volume than the quarter-girth formula; timber losses in felling and bucking were 37.06 % with the
// quarter-girth formula and 19.86 % with Huber's. Log sizes below are OUR OWN made-up logs.
const FACTOR = 4 / Math.PI; // the quarter-girth (Hoppus) constant: (pi/4) d girth, squared, instead of the circle's area

// One made-up log, metric: small end 25 cm, 2.5 m long, large end 30 cm, middle 27.5 cm.
const L1 = scaleLog({ id: 'L1', small: 25, length: 2.5, large: 30, mid: 27.5 }, false);
const qg1 = (Math.PI * 27.5 / 4 / 100) ** 2 * 2.5; // quarter girth at mid-length, m^3

// Figure 1: each formula against the exact frustum volume, as the log's taper grows.
// A cone frustum is the reference shape: V = pi L (ds^2 + ds dl + dl^2) / 12, and Newton's formula is exact for it.
const Lm = 2.5, ds = 25; // cm
const tapers = Array.from({ length: 61 }, (_, i) => i * 0.1); // cm of extra diameter per metre of length
const exact = (dl) => (Math.PI * Lm * (ds * ds + ds * dl + dl * dl)) / 12 / 10000;
const rows = tapers.map((t) => {
  const dl = ds + t * Lm, dm = (ds + dl) / 2;
  const As = area(ds, false), Al = area(dl, false), Am = area(dm, false);
  const V = exact(dl);
  return {
    t, dl, sm: smalian(As, Al, Lm) / V, hu: huber(Am, Lm) / V, ne: newton(As, Am, Al, Lm) / V,
    qg: ((Math.PI * dm / 4 / 100) ** 2 * Lm) / V,
  };
});
const fig1 = chart({
  title: 'Each formula against the log’s true volume', xLabel: 'Taper (cm of diameter per metre)', yLabel: 'Volume ÷ true volume',
  series: [
    { name: 'Smalian', kind: 'line', x: tapers, y: rows.map((r) => +r.sm.toFixed(5)) },
    { name: 'Huber', kind: 'line', x: tapers, y: rows.map((r) => +r.hu.toFixed(5)) },
    { name: 'Quarter girth', kind: 'line', x: tapers, y: rows.map((r) => +r.qg.toFixed(5)), colour: 'var(--ink)' },
  ],
  xDomain: [0, 6], yDomain: [0.75, 1.1], hlines: [{ y: 1, text: 'true volume (Newton)' }],
  desc: 'For a 2.5 m log with a 25 cm small end, Smalian rises above the true volume as the taper grows, Huber falls a little below it, and the quarter-girth formula sits a flat 21.5 per cent below it whatever the taper.', height: 280,
});

// Figure 2: the share of the tree that reaches the log yard, worked out with each formula.
// If the same logs are measured by the two formulas, the retained share is multiplied by 4/pi.
const keptQG = Array.from({ length: 81 }, (_, i) => 0.2 + i * 0.01); // retained share by quarter girth
const fig2 = chart({
  title: 'Timber "loss" depends on the formula', xLabel: 'Loss worked out with the quarter-girth formula (%)', yLabel: 'Loss with Huber’s formula (%)',
  series: [
    { name: '', noLegend: true, kind: 'line', x: keptQG.map((k) => +(100 * (1 - k)).toFixed(3)), y: keptQG.map((k) => +(100 * (1 - k * FACTOR)).toFixed(3)) },
    { name: '', noLegend: true, kind: 'dots', x: [37.06], y: [19.86], size: 4, colour: 'var(--c-tools)' },
  ],
  xDomain: [20, 60], yDomain: [-10, 50], hlines: [{ y: 0, text: 'no loss at all' }],
  vlines: [{ x: 37.06, text: 'the paper: 37.06 % and 19.86 %' }],
  desc: 'A straight line: swapping the quarter-girth formula for Huber multiplies the volume that reaches the yard by 4 divided by pi, so a 37.06 per cent loss becomes 19.86 per cent.', height: 270,
});

const out = {
  factor: FACTOR, pctMore: 100 * (FACTOR - 1),
  log1: { smalian: L1.smalian, huber: L1.huber, newton: L1.newton, qg: qg1, huberOverQg: L1.huber / qg1 },
  lossCheck: { keptQG: 0.6294, keptHu: 0.6294 * FACTOR, ratio: 0.8014 / 0.6294, lossHu: 100 * (1 - 0.6294 * FACTOR) },
  taper0: rows[0], taper2: rows.find((r) => Math.abs(r.t - 2) < 1e-9), taper5: rows.find((r) => Math.abs(r.t - 5) < 1e-9),
  cross: { a25: area(25, false), a275: area(27.5, false), a30: area(30, false) },
  imperialDemo: scaleLog({ id: 'D', small: 16, length: 16, large: 19, mid: 17.4 }, true),
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ratios', figure(fig1, 'Figure 1. Our own made-up log, 2.5 m long with a 25 cm small end, as its taper grows. Each formula is divided by the true volume of a cone frustum, which is what Newton’s formula gives. Worked out with the Log scale calculator’s own functions.'));
  md = inject(md, 'loss', figure(fig2, 'Figure 2. The same logs, the same trees, two formulas. Because the quarter-girth formula is a fixed 4/π below the true cross-section, a felling-and-bucking loss of 37.06 % by quarter girth is 19.86 % by Huber. The dot is the pair of figures the paper reports.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
