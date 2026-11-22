// The central limit theorem with dice. Roll n dice, add them, and repeat many times: the bars show how often each
// total came up. With one die the bars are flat; with 2, 3, 5 dice the heap becomes a bell, centred on n × 3.5 with
// width σ√n (σ = 1.708 for one die), matching the normal curve drawn over it. Pick a different kind of die to see the
// bell appear anyway.
import { canvas, axes, row, slider, choice, button, readout, loop, line, text, rng } from '../kit.js';
import { f2 } from './_math.js';

const DIE = { fair: ['Fair die', [1, 2, 3, 4, 5, 6]], skew: ['Loaded die', [1, 1, 1, 1, 2, 6]], two: ['Coin (0 or 1)', [0, 1]] };
export default function (host) {
  let n = 3, kind = 'fair', rolls = 0, hist = new Map(), R = rng(11), tm = 0;
  const cv = canvas(host, { aspect: 0.66, max: 360, min: 240, label: 'Histogram of sums of dice with a normal curve' });
  const c = row(host), c2 = row(host);
  choice(c, 'Die', Object.entries(DIE).map(([id, v]) => [id, v[0]]), kind, (v) => { kind = v; clear(); });
  slider(c2, { label: 'dice added n', min: 1, max: 12, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = v; clear(); } });
  button(c2, 'Roll 500 sets', () => { roll(500); });
  const anim = loop(host, () => roll(8), { autoplay: false }); anim.button(c2);
  button(c2, 'Clear', () => clear());
  const out = readout(host);
  const faces = () => DIE[kind][1], mean1 = () => faces().reduce((s, x) => s + x, 0) / faces().length, sd1 = () => Math.sqrt(faces().reduce((s, x) => s + (x - mean1()) ** 2, 0) / faces().length);
  function roll(m) { const F = faces(); for (let i = 0; i < m; i++) { let s = 0; for (let j = 0; j < n; j++) s += F[Math.floor(R() * F.length)]; hist.set(s, (hist.get(s) || 0) + 1); rolls++; } re(); }
  function clear() { hist = new Map(); rolls = 0; roll(0); }
  function re() { cv.redraw(); const keys = [...hist.keys()], m = keys.reduce((s, k) => s + k * hist.get(k), 0) / (rolls || 1), v = keys.reduce((s, k) => s + (k - m) ** 2 * hist.get(k), 0) / (rolls || 1);
    out.innerHTML = rolls ? `${rolls} sums of ${n} dice. Average ${f2(m)} (theory n × μ = ${f2(n * mean1())}), spread σ = ${f2(Math.sqrt(v))} (theory σ√n = ${f2(sd1() * Math.sqrt(n))}). The shape looks more normal as n grows, whatever the single die looks like.` : 'Press Roll 500 sets or Play.'; }
  cv.draw = (ctx, w, h, col) => {
    const F = faces(), lo = n * Math.min(...F), hi = n * Math.max(...F), mu = n * mean1(), sd = sd1() * Math.sqrt(n);
    const dens = (x) => Math.exp(-0.5 * ((x - mu) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));
    const top = Math.max(1e-9, ...[...hist.values()].map((c) => c / (rolls || 1)), dens(mu)) * 1.12;
    const A = axes(ctx, w, h, col, { x: [lo - 1, hi + 1], y: [0, top], l: 36, b: 38, t: 22, r: 10, xlabel: 'sum of the dice', xt: Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((v, i, a) => a.length < 12 || i % Math.ceil(a.length / 8) === 0), fy: (v) => f2(v * 100, 0) + '%', grid: false });
    const bw = Math.max(1, (A.R - A.L) / (hi - lo + 2) - 1);
    hist.forEach((c, k) => { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.8; ctx.fillRect(A.X(k) - bw / 2, A.Y(c / rolls), bw, A.Y(0) - A.Y(c / rolls)); ctx.globalAlpha = 1; });
    ctx.beginPath(); for (let i = 0; i <= 160; i++) { const x = lo - 1 + ((hi - lo + 2) * i) / 160; i ? ctx.lineTo(A.X(x), A.Y(dens(x))) : ctx.moveTo(A.X(x), A.Y(dens(x))); } ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.stroke();
    text(ctx, 'orange: normal curve with the same mean and σ', A.L + 6, A.T + 8, { color: col.muted, size: 10 });
  };
  roll(300);
}
