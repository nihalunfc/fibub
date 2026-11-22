// 3.8 From one slit to a grating. Fraunhofer intensity against sin(theta) for N slits of width a and spacing d:
// I = (sin b / b)^2 * (sin(N g) / (N sin g))^2 with b = pi a sin(theta)/lambda and g = pi d sin(theta)/lambda.
// The dashed curve is the single-slit envelope. N = 1 gives the single slit. Sliders: N, d/lambda, a/d.
import { canvas, axes, line, text, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 380, min: 260, label: 'Diffraction pattern of N slits with the single-slit envelope' });
  let N = 5, dl = 4, ad = 0.25;
  const ctl = row(host);
  const out = readout(host);
  const sinc2 = (x) => (Math.abs(x) < 1e-9 ? 1 : (Math.sin(x) / x) ** 2);
  const inter = (g) => { const s = Math.sin(g); return Math.abs(s) < 1e-9 ? 1 : (Math.sin(N * g) / (N * s)) ** 2; };
  const I = (s) => sinc2(Math.PI * ad * dl * s) * (N > 1 ? inter(Math.PI * dl * s) : 1);
  const show = () => {
    if (N === 1) { out.innerHTML = `One slit of width a = ${fmt(ad * dl, 3)} λ: minima where a sin θ = mλ, at sin θ = ±${fmt(1 / (ad * dl), 3)}, ±${fmt(2 / (ad * dl), 3)}, ... The central peak is twice as wide as the others.`; return; }
    const orders = [], missing = [];
    for (let m = -Math.floor(dl - 1e-9); m <= Math.floor(dl - 1e-9); m++) {
      const r = m * ad; // a sin(theta)/lambda at order m, in units: m * a/d
      if (m !== 0 && Math.abs(r - Math.round(r)) < 1e-6) missing.push(m); else orders.push(m);
    }
    out.innerHTML = `N = ${N}: principal maxima at d sin θ = mλ, i.e. sin θ = m/${fmt(dl, 3)}. Orders seen: <b>${orders.length}</b>${missing.length ? ` (missing: ${missing.filter((m) => m > 0).map((m) => '±' + m).join(', ')}, which fall on single-slit zeros)` : ''}. Between neighbouring principal maxima: ${N - 1} zeros and ${N - 2} small maxima. Each peak has half-width Δ(sin θ) = λ/(Nd) = ${fmt(1 / (N * dl), 3)}.`;
  };
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'Number of slits N', min: 1, max: 12, step: 1, value: N, fmt: (v) => String(v), oninput: (v) => { N = Math.round(v); re(); } });
  slider(ctl, { label: 'Spacing d / λ', min: 1.5, max: 8, step: 0.5, value: dl, fmt: (v) => fmt(v, 2), oninput: (v) => { dl = v; re(); } });
  slider(ctl, { label: 'Slit width a / d', min: 0.1, max: 1, step: 0.05, value: ad, fmt: (v) => fmt(v, 2), oninput: (v) => { ad = v; re(); } });

  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [-1, 1], y: [0, 1.1], t: 26, xlabel: 'sin θ', ylabel: 'I / I_max', yt: [0, 0.5, 1] });
    const M = 1600, pts = [], env = [];
    for (let i = 0; i <= M; i++) { const s = -1 + (2 * i) / M; pts.push([ax.X(s), ax.Y(I(s))]); env.push([ax.X(s), ax.Y(sinc2(Math.PI * ad * dl * s))]); }
    ctx.save(); ax.clip();
    if (N > 1) line(ctx, env, col.muted, 1.2, [4, 4]);
    line(ctx, pts, col.s[0], 2);
    ctx.restore();
    text(ctx, N > 1 ? `${N} slits · dashed: one-slit envelope` : 'single slit', ax.L + 6, ax.T + 6, { color: col.ink, size: 11, weight: 600 });
  };
  re();
}
