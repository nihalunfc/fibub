// 1.5 Width in x against width in k. Pick a pulse shape and its width a; the top panel shows f(x), the bottom its
// Fourier transform F(k) = integral f(x) e^{-ikx} dx (all three are real and even). Narrow pulse, wide spectrum.
import { canvas, axes, line, row, slider, choice, readout, fmt, title } from '../../kit.js';

const SHAPES = {
  box: { name: 'Box', f: (x, a) => (Math.abs(x) < a ? 1 : 0), F: (k, a) => (Math.abs(k) < 1e-9 ? 2 * a : (2 * Math.sin(k * a)) / k), note: (a) => `box of half-width a = ${fmt(a, 2)} → F(k) = 2 sin(ka)/k, first zero at k = π/a = ${fmt(Math.PI / a, 3)}. The sharp edges give slowly decaying side lobes (∝ 1/k).` },
  gauss: { name: 'Gaussian', f: (x, a) => Math.exp(-(x * x) / (2 * a * a)), F: (k, a) => Math.sqrt(2 * Math.PI) * a * Math.exp(-(a * a * k * k) / 2), note: (a) => `Gaussian of width σ = ${fmt(a, 2)} → a Gaussian of width 1/σ = ${fmt(1 / a, 3)}; the product of widths is always 1, the smallest possible.` },
  exp: { name: 'e^(−|x|/a)', f: (x, a) => Math.exp(-Math.abs(x) / a), F: (k, a) => (2 / a) / (1 / (a * a) + k * k), note: (a) => `two-sided exponential of decay length a = ${fmt(a, 2)} → a Lorentzian 2a/(1 + a²k²) of half-width 1/a = ${fmt(1 / a, 3)}. The kink at x = 0 gives a 1/k² tail.` },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 280, label: 'A pulse f(x) and its Fourier transform F(k), showing that a narrower pulse has a wider spectrum' });
  let key = 'box', a = 1;
  const ctl = row(host);
  choice(ctl, 'Pulse', Object.entries(SHAPES).map(([k, v]) => [k, v.name]), key, (v) => { key = v; cv.redraw(); upd(); });
  slider(ctl, { label: 'Width a', min: 0.3, max: 3, step: 0.05, value: a, fmt: (v) => fmt(v, 2), oninput: (v) => { a = v; cv.redraw(); upd(); } });
  const out = readout(host);
  const upd = () => { out.innerHTML = `The ${SHAPES[key].note(a)} The area under F(k) is 2π f(0) = ${fmt(2 * Math.PI, 3)} whatever the width: as the spectrum widens it also gets lower.`; };
  cv.draw = (ctx, w, h, col) => {
    const S = SHAPES[key], mid = h * 0.47;
    title(ctx, `${S.name} pulse (top) and its transform (bottom)`, col);
    // top panel: f(x)
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, mid); ctx.clip();
    const A = axes(ctx, w, mid, col, { x: [-6, 6], y: [0, 1.15], t: 30, b: 34, xlabel: 'x', ylabel: 'f(x)' });
    const pts = []; for (let i = 0; i <= 600; i++) { const x = -6 + (12 * i) / 600; pts.push([A.X(x), A.Y(S.f(x, a))]); }
    line(ctx, pts, col.s[0], 2.5);
    ctx.restore();
    // bottom panel: F(k)
    ctx.save(); ctx.translate(0, mid); ctx.beginPath(); ctx.rect(0, 0, w, h - mid); ctx.clip();
    const ymax = 7.8, B = axes(ctx, w, h - mid, col, { x: [-12, 12], y: [-0.25 * ymax, ymax], t: 12, b: 38, xlabel: 'k', ylabel: 'F(k)' });
    line(ctx, [[B.X(-12), B.Y(0)], [B.X(12), B.Y(0)]], col.muted, 1);
    const q = []; for (let i = 0; i <= 800; i++) { const k = -12 + (24 * i) / 800; q.push([B.X(k), B.Y(Math.max(-0.25 * ymax, Math.min(ymax, S.F(k, a))))]); }
    line(ctx, q, col.s[2], 2.5);
    ctx.restore();
  };
  cv.redraw(); upd();
}
