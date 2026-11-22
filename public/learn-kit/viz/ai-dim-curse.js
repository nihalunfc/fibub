// The curse of dimensionality: scatter 80 random points in a cube with d features and measure every pairwise distance
// (shown as a share of the average distance). In 2 features the distances are spread wide: some points are clearly near,
// some far. Slide d up to 1000: nearly all distances become the same, so "nearest neighbour" stops meaning much.
import { canvas, text, row, slider, readout, title, axes, line } from '../kit.js';
import { rng } from '../kit.js';

export default function (host) {
  let d = 2; const cache = new Map();
  const cv = canvas(host, { aspect: 0.7, max: 340, min: 240, label: 'Histogram of distances between random points in d dimensions' });
  const ctl = row(host);
  slider(ctl, { label: 'Features (dimensions) d', min: 1, max: 1000, value: d, log: true, fmt: (v) => Math.round(v), oninput: (v) => { d = Math.round(v); show(); } });
  const out = readout(host);
  function dists(dd) {
    if (cache.has(dd)) return cache.get(dd);
    const R = rng(dd + 5), P = Array.from({ length: 80 }, () => Array.from({ length: dd }, () => R())), D = [];
    for (let i = 0; i < 80; i++) for (let j = i + 1; j < 80; j++) { let s = 0; for (let k = 0; k < dd; k++) s += (P[i][k] - P[j][k]) ** 2; D.push(Math.sqrt(s)); }
    const mean = D.reduce((a, b) => a + b, 0) / D.length, rel = D.map((v) => v / mean); cache.set(dd, rel); return rel;
  }
  function show() {
    const r = dists(d), mn = Math.min(...r), mx = Math.max(...r), sd = Math.sqrt(r.reduce((s, v) => s + (v - 1) ** 2, 0) / r.length);
    out.innerHTML = `d = <b>${d}</b>: the nearest pair is ${(mn * 100).toFixed(0)}% of the average distance, the farthest ${(mx * 100).toFixed(0)}%. Spread (std) ${(sd * 100).toFixed(1)}%. ${sd < 0.1 ? 'Everything is about equally far from everything, so nearest-neighbour methods struggle. Fixes: fewer features (PCA, feature selection) or much more data.' : 'Distances still tell near from far.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'How far apart are random points?', col);
    const r = dists(d), ax = axes(ctx, w, h, col, { x: [0, 2.2], y: [0, 1], xlabel: 'distance ÷ average distance', t: 40, b: 38, l: 14, r: 14, yt: [], fx: (v) => v.toFixed(1) });
    const bins = new Array(44).fill(0); r.forEach((v) => { const b = Math.floor((v / 2.2) * 44); if (b >= 0 && b < 44) bins[b]++; });
    const mx = Math.max(...bins);
    bins.forEach((c, i) => { const x0 = ax.X((i / 44) * 2.2), x1 = ax.X(((i + 1) / 44) * 2.2); ctx.fillStyle = col.s[0]; ctx.fillRect(x0, ax.Y(c / mx), x1 - x0 - 1, ax.B - ax.Y(c / mx)); });
    line(ctx, [[ax.X(1), ax.T], [ax.X(1), ax.B]], col.s[1], 1.5, [4, 4]);
    text(ctx, 'average', ax.X(1) + 4, ax.T + 8, { color: col.s[1], size: 10.5, weight: 700 });
  };
  show();
}
