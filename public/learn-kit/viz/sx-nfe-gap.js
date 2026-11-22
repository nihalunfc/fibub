// Nearly free electrons: why a gap opens at the zone boundary. The ions' weak potential (strength U) couples the plane
// waves k and k − G, which have equal energy at k = π/a. Top: the bands E(k), reduced zone (energy in units of ħ²π²/2ma²).
// Bottom: the probability density of the chosen state over two cells. At the edge the lower state piles up on the ions
// (low energy), the upper one sits between them. Move k to the edge and raise U.
import { canvas, axes, line, dot, text, row, slider, choice, readout, title, fmt } from '../kit.js';

// eigenpair of [[e1, -U],[-U, e2]]; returns { lo, hi, v: [a, b] for the chosen branch }
function states(kap, U) {
  const e1 = kap * kap, e2 = (kap - 2) * (kap - 2), m = (e1 + e2) / 2, r = Math.sqrt(((e1 - e2) / 2) ** 2 + U * U);
  const vec = (E) => { let a = -U, b = e1 - E; if (Math.abs(a) + Math.abs(b) < 1e-9) { a = 1; b = 0; } const n = Math.hypot(a, b); return [b / n, -a / n].map((x) => x); };
  const solve = (E) => { // (e1-E) a - U b = 0
    let a = U, b = e1 - E; if (Math.abs(a) < 1e-9 && Math.abs(b) < 1e-9) return [Math.SQRT1_2, Math.SQRT1_2];
    const n = Math.hypot(a, b); return [a / n, b / n];
  };
  return { lo: m - r, hi: m + r, vlo: solve(m - r), vhi: solve(m + r), vec };
}
export default function (host) {
  let band = 'lo';
  const cv = canvas(host, { aspect: 1.0, max: 400, min: 320, label: 'Nearly-free-electron bands and probability densities' });
  const ctl = row(host);
  const sk = slider(ctl, { label: 'k (units of π/a)', min: 0.02, max: 1, step: 0.01, value: 1, fmt: (v) => v.toFixed(2), oninput: () => cv.redraw() });
  const su = slider(ctl, { label: 'Potential U', min: 0, max: 0.6, step: 0.01, value: 0.3, fmt: (v) => v.toFixed(2), oninput: () => cv.redraw() });
  choice(ctl, 'State', [['lo', 'Lower band'], ['hi', 'Upper band']], band, (v) => { band = v; cv.redraw(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const H1 = h * 0.52, U = su.value, kap = sk.value;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, H1); ctx.clip();
    const A = axes(ctx, w, H1, col, { x: [-1, 1], y: [0, 2.7], xlabel: 'k (π/a)', l: 40, b: 30, t: 24, xt: [-1, -0.5, 0, 0.5, 1], yt: [0, 1, 2] });
    const free = [], bl = [], bh = [], bl2 = [], bh2 = [];
    for (let i = 0; i <= 100; i++) { const k = i / 100, s = states(k, U); free.push([A.X(k), A.Y(k * k)], [A.X(k), A.Y((k - 2) ** 2)]); bl.push([A.X(k), A.Y(s.lo)]); bh.push([A.X(k), A.Y(s.hi)]); bl2.push([A.X(-k), A.Y(s.lo)]); bh2.push([A.X(-k), A.Y(s.hi)]); }
    A.clip();
    for (let i = 0; i <= 100; i++) { const k = i / 100; dot(ctx, A.X(k), A.Y(k * k), 0.8, col.muted); dot(ctx, A.X(-k), A.Y(k * k), 0.8, col.muted); if ((k - 2) ** 2 < 2.2) { dot(ctx, A.X(k), A.Y((k - 2) ** 2), 0.8, col.muted); dot(ctx, A.X(-k), A.Y((k - 2) ** 2), 0.8, col.muted); } }
    line(ctx, bl, col.s[0], 2.5); line(ctx, bl2, col.s[0], 2.5); line(ctx, bh, col.s[1], 2.5); line(ctx, bh2, col.s[1], 2.5);
    const s = states(kap, U), E = band === 'lo' ? s.lo : s.hi;
    dot(ctx, A.X(kap), A.Y(E), 6, band === 'lo' ? col.s[0] : col.s[1], col.ink);
    ctx.restore();
    title(ctx, 'Bands: grey = free electrons', col);
    // density panel
    const T = H1 + 12, B = h - 22, L = 14, Rr = w - 14, X = (x) => L + (x / 2) * (Rr - L);
    const v = band === 'lo' ? s.vlo : s.vhi, pts = [];
    let mx = 0;
    for (let i = 0; i <= 200; i++) { const x = (i / 200) * 2, re = v[0] * Math.cos(kap * Math.PI * x) + v[1] * Math.cos((kap - 2) * Math.PI * x), im = v[0] * Math.sin(kap * Math.PI * x) + v[1] * Math.sin((kap - 2) * Math.PI * x), p = re * re + im * im; pts.push([x, p]); mx = Math.max(mx, p); }
    const top = Math.max(2, mx * 1.1);
    line(ctx, [[L, B], [Rr, B]], col.muted, 1);
    line(ctx, pts.map(([x, p]) => [X(x), B - (p / top) * (B - T - 12)]), band === 'lo' ? col.s[0] : col.s[1], 2.5);
    [0, 1, 2].forEach((n) => { dot(ctx, X(n), B + 8, 5, col.s[5]); line(ctx, [[X(n), B - 4], [X(n), T + 8]], col.line, 1, [3, 3]); });
    text(ctx, '|ψ|² along the chain (dots = ions, spacing a)', 10, T + 4, { color: col.ink, size: 11, weight: 600 });
  };
  const rd = cv.redraw; cv.redraw = () => { rd(); const U = su.value, s = states(sk.value, U); out.innerHTML = `<b>k = ${sk.value.toFixed(2)} π/a, U = ${U.toFixed(2)}.</b> Lower E = ${s.lo.toFixed(2)}, upper E = ${s.hi.toFixed(2)}; free-electron E = ${(sk.value ** 2).toFixed(2)}. ${sk.value > 0.97 ? `At the boundary the gap is 2U = ${(2 * U).toFixed(2)} (units ħ²π²/2ma²): the standing waves cos(πx/a) and sin(πx/a) have different energies because one sits on the ions and the other between them.` : 'Away from the boundary the state is mostly one travelling wave, so the density only ripples gently.'}`; }; cv.redraw();
}
