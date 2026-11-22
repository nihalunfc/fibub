// Why servers batch requests. Making one token means reading the whole model from memory, whether one person or 32 are
// waiting. So extra users ride almost free until the chip runs out of arithmetic. Pick a device and a model size, slide
// the number of users: total tokens/s climbs, each person's own speed barely drops, until the compute limit bends the curve.
// Numbers are rounded, illustrative figures (memory and arithmetic speeds are typical for each class of device).
import { canvas, text, row, slider, choice, readout, title, axes, line, dot } from '../kit.js';

const DEV = { laptop: ['Laptop', 100, 5], gpu: ['Gaming GPU', 900, 60], big: ['Data-centre GPU', 3000, 400] };
const MOD = { 3: ['3B 4-bit', 3, 1.7], 8: ['8B 4-bit', 8, 4.5], 32: ['32B 4-bit', 32, 18] };
export default function (host) {
  let dev = 'gpu', mod = 8, b = 8;
  const cv = canvas(host, { aspect: 0.85, max: 400, min: 290, label: 'Total and per-user tokens per second against the number of simultaneous users' });
  const ctl = row(host);
  choice(ctl, 'Device', Object.entries(DEV).map(([k, v]) => [k, v[0]]), dev, (v) => { dev = v; show(); });
  choice(ctl, 'Model', Object.entries(MOD).map(([k, v]) => [+k, v[0]]), mod, (v) => { mod = v; show(); });
  slider(ctl, { label: 'Users at once', min: 1, max: 128, step: 1, value: b, fmt: (v) => Math.round(v), oninput: (v) => { b = Math.round(v); show(); } });
  const out = readout(host);
  const f = (n) => { const [, bw, tf] = DEV[dev], [, par, gb] = MOD[mod], kv = 0.15 * (par / 8), tm = (gb + n * kv) / bw, tc = (n * 2 * par * 1e9) / (tf * 1e12); return { t: Math.max(tm, tc), mem: tm >= tc }; };
  const tot = (n) => n / f(n).t, per = (n) => 1 / f(n).t;
  function show() {
    const r = f(b);
    out.innerHTML = `<b>${b}</b> user${b > 1 ? 's' : ''}: total <b>${tot(b).toFixed(0)}</b> tokens/s, each user gets <b>${per(b).toFixed(0)}</b> tokens/s (a single user would get ${per(1).toFixed(0)}). The limit here is <b>${r.mem ? 'memory: the model is read once for everybody, so more users are nearly free' : 'arithmetic: the chip is busy computing, so more users now slow everyone'}</b>.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'More users at once: who pays?', col);
    const ymax = 10 ** Math.ceil(Math.log10(tot(128) * 1.05)), ax = axes(ctx, w, h, col, { x: [1, 128], y: [1, ymax], xlog: true, ylog: true, xlabel: 'users at once', ylabel: 'tokens per second (log)', t: 44, b: 38, l: 52, r: 12, xt: [1, 2, 4, 8, 16, 32, 64, 128] });
    ax.clip(); const A = [], B = [];
    for (let n = 1; n <= 128; n *= 1.05) { A.push([ax.X(n), ax.Y(tot(n))]); B.push([ax.X(n), ax.Y(per(n))]); }
    line(ctx, A, col.s[0], 2.5); line(ctx, B, col.s[1], 2.5);
    let kn = 1; while (kn < 128 && f(kn).mem) kn++;
    if (kn < 128) line(ctx, [[ax.X(kn), ax.T], [ax.X(kn), ax.B]], col.muted, 1, [4, 4]);
    dot(ctx, ax.X(b), ax.Y(tot(b)), 5, col.s[0], col.ink); dot(ctx, ax.X(b), ax.Y(per(b)), 5, col.s[1], col.ink);
    text(ctx, 'total', ax.X(2), ax.Y(tot(2)) - 12, { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'per user', ax.X(2), ax.Y(per(2)) + 14, { color: col.s[1], size: 11, weight: 700 });
    if (kn < 128) text(ctx, 'memory → arithmetic limit', ax.X(kn) + 4, ax.B - 10, { color: col.muted, size: 10 });
  };
  show();
}
