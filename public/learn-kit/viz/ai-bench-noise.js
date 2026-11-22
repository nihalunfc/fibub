// Is a 3-point lead on a benchmark real? Two models with a true accuracy gap are tested on n questions. Each score is
// a bell curve around the truth that gets narrower as n grows. Slide n and the true gap, then press "Run 100 tests": the dots
// show 100 imaginary benchmark runs, and the count says how often the better model actually ranks first.
import { canvas, text, row, slider, button, readout, title, axes, line, dot } from '../kit.js';
import { rng } from '../kit.js';
import { gauss } from './_ai.js';

const phi = (z) => { const t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989423 * Math.exp(-z * z / 2), p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; };
export default function (host) {
  let n = 200, gap = 3, runs = null; const R = rng(17), pa = 0.7;
  const cv = canvas(host, { aspect: 0.85, max: 400, min: 290, label: 'Score distributions of two models on a benchmark of n questions' });
  const ctl = row(host);
  slider(ctl, { label: 'Questions n', min: 20, max: 5000, value: n, log: true, fmt: (v) => Math.round(v), oninput: (v) => { n = Math.round(v); runs = null; show(); } });
  slider(ctl, { label: 'True gap (points)', min: 0, max: 10, step: 0.5, value: gap, fmt: (v) => v.toFixed(1), oninput: (v) => { gap = v; runs = null; show(); } });
  button(ctl, 'Run 100 tests', () => { const pb = pa + gap / 100; runs = Array.from({ length: 100 }, () => { const sa = pa + Math.sqrt(pa * (1 - pa) / n) * gauss(R), sb = pb + Math.sqrt(pb * (1 - pb) / n) * gauss(R); return [sa, sb]; }); show(); });
  const out = readout(host);
  const sd = (p) => Math.sqrt(p * (1 - p) / n);
  function show() {
    const pb = pa + gap / 100, win = phi((pb - pa) / Math.hypot(sd(pa), sd(pb)));
    out.innerHTML = `Each score is uncertain by about ±<b>${(196 * sd(pa)).toFixed(1)}</b> points (95%). The better model (true ${(pb * 100).toFixed(1)}% vs ${(pa * 100).toFixed(0)}%) is expected to rank first <b>${(win * 100).toFixed(0)}%</b> of the time${gap === 0 ? ' (the models are truly equal, so it is a coin toss)' : ''}.${runs ? ` In your 100 tests it ranked first <b>${runs.filter((r) => r[1] > r[0]).length}</b> times.` : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'What the benchmark might report', col);
    const pb = pa + gap / 100, lo = 0.6, hi = 0.84, ax = axes(ctx, w, h, col, { x: [lo * 100, hi * 100], y: [0, 1], xlabel: 'measured score (%)', t: 44, b: 38, l: 14, r: 14, yt: [], fx: (v) => v.toFixed(0) });
    const dens = (p, x) => { const s = sd(p) * 100, z = (x - p * 100) / s; return Math.exp(-z * z / 2) / (s * 2.5066); };
    const peak = Math.max(dens(pa, 70), dens(pb, pb * 100)), pts = (p) => Array.from({ length: 121 }, (_, i) => { const x = lo * 100 + (i / 120) * (hi - lo) * 100; return [ax.X(x), ax.Y(Math.min(1, dens(p, x) / peak * 0.5 * 1.0))]; });
    ax.clip(); line(ctx, pts(pa), col.s[0], 2.5); line(ctx, pts(pb), col.s[1], 2.5);
    text(ctx, 'model A', ax.X(pa * 100) - 30, ax.Y(0.55) , { color: col.s[0], size: 11, weight: 700, fit: false });
    text(ctx, 'model B (better)', ax.X(pb * 100) + 4, ax.Y(0.62), { color: col.s[1], size: 11, weight: 700 });
    if (runs) runs.forEach(([a, b], i) => { const y = ax.Y(0.04 + 0.4 * ((i % 20) / 20)); dot(ctx, ax.X(a * 100), y, 2.4, col.s[0]); dot(ctx, ax.X(b * 100), y + 4, 2.4, col.s[1]); });
  };
  show();
}
