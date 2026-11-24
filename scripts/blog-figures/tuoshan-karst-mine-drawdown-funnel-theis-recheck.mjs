// Figures for src/blog/discoveries/tuoshan-karst-mine-drawdown-funnel-theis-recheck.md, made with the maths of the
// Well field drawdown tool (src/lib/sci/wellfield.ts, which adds up Theis drawdowns from src/lib/sci/pumptest.ts).
// Run: node scripts/blog-figures/tuoshan-karst-mine-drawdown-funnel-theis-recheck.mjs
import fs from 'node:fs';
import { drawdown } from '../../src/lib/sci/wellfield.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/tuoshan-karst-mine-drawdown-funnel-theis-recheck.md', import.meta.url);

// Inputs from the paper: Chen, Zhu and Lu (2026), Applied Sciences 16(8): 3998 (CC BY).
// Mine pumping 200 m3/h = 4800 m3/day; central drawdown 4.3 m after one year of mining; 1.9-2.2 m within one week;
// drawdown funnel about 1.2 km across during mining (radius about 600 m); karstified C2d dolomite hydraulic
// conductivity 0.042 m/s from a single-well test at borehole ZK87; recovery about 0.3 m per year after mining.
// OUR ASSUMPTIONS: an effective drainage radius of 10 m for the mine, an aquifer thickness of 50 m where a
// conductivity is turned into a transmissivity, and S = 1 as a physically extreme upper bound on storage.
const Q = 4800, RW = 10, B = 50, SMAX = 1;
const WELLS = [{ name: 'mine', x: 0, y: 0, Q, t0: 0 }];
const s = (r, t, T, S) => drawdown(r, 0, t, WELLS, T, S, RW);

// 1. Transmissivity from the shape of the funnel alone. For small u the Theis drawdown difference between two radii
// is Q/(2 pi T) ln(r2/r1), with no storage in it: 4.3 m at the mine and 0.1 m at 600 m therefore fix T.
const T = (Q * Math.log(600 / RW)) / (2 * Math.PI * (4.3 - 0.1));
const Kof = (TT, b) => TT / b / 86400; // m2/day -> m/s
// 2. What the paper's own conductivity would give.
const Tpaper = 0.042 * B * 86400;

const rads = Array.from({ length: 200 }, (_, i) => 10 + i * 10); // 10 m to 2000 m
const TIMES = [7, 30, 365];
const fig1 = chart({
  title: 'How wide a Theis funnel is after a week, a month and a year', xLabel: 'Distance from the mine (m)', yLabel: 'Drawdown (m)',
  series: TIMES.map((t) => ({ name: t === 365 ? '1 year' : `${t} days`, kind: 'line', x: rads, y: rads.map((r) => +s(r, t, T, SMAX).toFixed(3)) })),
  xDomain: [0, 2000], yDomain: [0, 5],
  vlines: [{ x: 600, text: "paper's funnel edge" }], hlines: [{ y: 0.5, text: '0.5 m contour' }],
  desc: 'Modelled Theis drawdown against distance from the mine after 7 days, 30 days and one year, for a transmissivity of 745 square metres a day. The dashed line marks the 600 m radius of the funnel mapped in the paper.', height: 280,
});

const tt = Array.from({ length: 120 }, (_, i) => 10 ** (i / 119 * Math.log10(1825)));
const fig2 = chart({
  title: 'Drawdown at the mine over time', xLabel: 'Time pumping', yLabel: 'Drawdown at the mine (m)',
  series: [
    { name: 'Theis (T 745 m²/day, S 1)', kind: 'line', x: tt.map((t) => Math.log10(t)), y: tt.map((t) => +s(RW, t, T, SMAX).toFixed(3)) },
    { name: "Paper's model", kind: 'dots', x: [7, 365].map(Math.log10), y: [2.05, 4.3], size: 4 },
  ],
  xDomain: [0, Math.log10(1825)], yDomain: [0, 6],
  xTicks: [1, 7, 30, 365, 1825].map((v) => Math.log10(v)), xFmt: (v) => ({ 1: '1 day', 7: '1 week', 30: '1 month', 365: '1 year', 1825: '5 years' })[Math.round(10 ** v)] ?? '',
  desc: 'Theis drawdown at the mine against time for a transmissivity of 745 square metres a day and a storage coefficient of 1, with the two drawdown values the paper reports.', height: 280,
});

const radiusOf = (lev, t, S) => { let a = RW, b = 1e6; for (let k = 0; k < 200; k++) { const m = Math.sqrt(a * b); (s(m, t, T, S) > lev) ? a = m : b = m; } return Math.sqrt(a * b); };
const out = {
  T: +T.toFixed(1), K_from_T: [20, 50, 100].map((b) => +Kof(T, b).toPrecision(3)),
  Tpaper: +Tpaper.toPrecision(4), Kpaper_ratio: +(Tpaper / T).toPrecision(3),
  paperK_centre: +s(RW, 365, Tpaper, 0.02).toFixed(3), paperK_600: +s(600, 365, Tpaper, 0.02).toFixed(3),
  centre365: +s(RW, 365, T, SMAX).toFixed(2), at600: +s(600, 365, T, SMAX).toFixed(3),
  week: +s(RW, 7, T, SMAX).toFixed(2), month: +s(RW, 30, T, SMAX).toFixed(2), y5: +s(RW, 1825, T, SMAX).toFixed(2),
  ratioTool: +(s(RW, 7, T, SMAX) / s(RW, 365, T, SMAX)).toFixed(3), ratioPaper: +(2.05 / 4.3).toFixed(3),
  ratioSmallS: [1, 0.2, 0.02, 0.002].map((S) => +(s(RW, 7, T, S) / s(RW, 365, T, S)).toFixed(3)),
  r05: Math.round(radiusOf(0.5, 365, SMAX)), r01: Math.round(radiusOf(0.1, 365, SMAX)), r05week: Math.round(radiusOf(0.5, 7, SMAX)),
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'funnel', figure(fig1, "Figure 1. Theis drawdown against distance from the mine for a transmissivity of 745 m² a day, the value the paper's own funnel shape implies, with storage at its extreme upper bound. The 0.5 m contour reaches 545 m after a year, close to the mapped funnel edge; the 0.1 m contour is already past 1 km. Our model, not the paper's output."));
  md = inject(md, 'time', figure(fig2, "Figure 2. The same model's drawdown at the mine against time, with the paper's two reported values. Theis rises too far by five years, because it has no recharge to stop it."));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
