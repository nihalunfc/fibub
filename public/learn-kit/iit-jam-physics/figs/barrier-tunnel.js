// 6.3 Tunnelling through a rectangular barrier. The exact stationary wave for an electron sent in from the left:
// incident plus reflected wave on the left, a decaying (or, above the top, oscillating) wave inside, and a weaker
// transmitted wave on the right. Sliders set the energy, the barrier height and the width; the readout compares
// the exact transmission with the thick-barrier estimate exp(-2 kappa a).
import { canvas, axes, line, text, row, slider, choice, readout, fmt } from '../../kit.js';

const H2M = 0.0381; // hbar^2 / (2 m_e) in eV nm^2
// tiny complex helpers: [re, im]
const add = (a, b) => [a[0] + b[0], a[1] + b[1]], sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const div = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const cexp = (t) => [Math.cos(t), Math.sin(t)];

/** Wave with transmitted amplitude 1 at x >= a; returns psi(x) [re, im] (unnormalised) and the incident amplitude A. */
function solve(E, V, a) {
  const k = Math.sqrt(E / H2M), ik = [0, k];
  const inside = E < V ? { q: Math.sqrt((V - E) / H2M), hyp: true } : { q: Math.sqrt(Math.max(E - V, 1e-9) / H2M), hyp: false };
  const q = inside.q;
  // inside: psi = c(q(x-a)) + (ik/q) s(q(x-a)), psi' = q s'(..) ... with c, s = cosh, sinh or cos, sin
  const psiIn = (x) => {
    const u = q * (x - a);
    if (inside.hyp) return add([Math.cosh(u), 0], mul(div(ik, [q, 0]), [Math.sinh(u), 0]));
    return add([Math.cos(u), 0], mul(div(ik, [q, 0]), [Math.sin(u), 0]));
  };
  const dpsiIn = (x) => {
    const u = q * (x - a);
    if (inside.hyp) return add([q * Math.sinh(u), 0], mul(ik, [Math.cosh(u), 0]));
    return add([-q * Math.sin(u), 0], mul(ik, [Math.cos(u), 0]));
  };
  const p0 = psiIn(0), d0 = dpsiIn(0);
  const A = mul([0.5, 0], add(p0, div(d0, ik))), B = mul([0.5, 0], sub(p0, div(d0, ik)));
  const psi = (x) => {
    if (x < 0) return add(mul(A, cexp(k * x)), mul(B, cexp(-k * x)));
    if (x <= a) return psiIn(x);
    return cexp(k * (x - a));
  };
  return { psi, A, k, q, T: 1 / (A[0] * A[0] + A[1] * A[1]) };
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 270, label: 'An electron wave meeting a rectangular barrier: reflected, decaying inside, transmitted' });
  let E = 1, V = 3, a = 0.4, view = 're';
  const ctl = row(host);
  const out = readout(host);
  const show = () => {
    const s = solve(E, V, a);
    const est = E < V ? Math.exp(-2 * s.q * a) : null;
    out.innerHTML = `Exact transmission T = <b>${fmt(s.T, 3)}</b>, reflection R = ${fmt(1 - s.T, 3)}. ` +
      (E < V ? `Inside, κ = √(2m(V₀ − E))/ħ = ${fmt(s.q, 3)} nm⁻¹, κa = ${fmt(s.q * a, 3)}; the thick-barrier estimate e<sup>−2κa</sup> = ${fmt(est, 3)}${s.q * a < 1.5 ? ' (poor here: κa is not large)' : ''}.` : 'The energy is above the barrier, yet some of the wave is still reflected.');
  };
  slider(ctl, { label: 'Energy E (eV)', min: 0.1, max: 6, step: 0.05, value: E, fmt: (v) => fmt(v, 3), oninput: (v) => { E = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Height V₀ (eV)', min: 0.5, max: 8, step: 0.1, value: V, fmt: (v) => fmt(v, 3), oninput: (v) => { V = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Width a (nm)', min: 0.05, max: 1.2, step: 0.01, value: a, fmt: (v) => fmt(v, 3), oninput: (v) => { a = v; cv.redraw(); show(); } });
  choice(ctl, 'Draw', [['re', 'Re ψ'], ['abs', '|ψ|²']], view, (v) => { view = v; cv.redraw(); });

  cv.draw = (ctx, w, h, col) => {
    const s = solve(E, V, a), x0 = -1.6, x1 = a + 1.6;
    const norm = (z) => div(z, s.A); // incident amplitude 1
    const N = 600, xs = Array.from({ length: N + 1 }, (_, i) => x0 + ((x1 - x0) * i) / N);
    const vals = xs.map((x) => { const z = norm(s.psi(x)); return view === 're' ? z[0] : z[0] * z[0] + z[1] * z[1]; });
    const ymax = view === 're' ? 2.1 : 4.2, ymin = view === 're' ? -2.1 : 0;
    const ax = axes(ctx, w, h, col, { x: [x0, x1], y: [ymin, ymax * 1.1], xlabel: 'position x (nm)', ylabel: view === 're' ? 'Re ψ' : '|ψ|²', t: 24 });
    // barrier drawn to scale against E: the energy line sits at E / V0 of the barrier height
    const bh = (ymax * 1.1 - ymin) * 0.8 * Math.min(1, V / Math.max(V, E * 1.2));
    ctx.fillStyle = col.soft;
    ctx.fillRect(ax.X(0), ax.Y(ymin + bh), ax.X(a) - ax.X(0), ax.Y(ymin) - ax.Y(ymin + bh));
    line(ctx, [[ax.X(x0), ax.Y(ymin)], [ax.X(0), ax.Y(ymin)], [ax.X(0), ax.Y(ymin + bh)], [ax.X(a), ax.Y(ymin + bh)], [ax.X(a), ax.Y(ymin)], [ax.X(x1), ax.Y(ymin)]], col.muted, 1.5);
    const eY = ymin + bh * E / V;
    line(ctx, [[ax.X(x0), ax.Y(eY)], [ax.X(x1), ax.Y(eY)]], col.s[3], 1, [4, 4]);
    text(ctx, 'E', ax.X(x0) + 4, ax.Y(eY) - 8, { color: col.s[3], size: 11, weight: 600 });
    text(ctx, 'V₀', ax.X(a / 2), ax.Y(ymin + bh) - 9, { color: col.muted, size: 11, align: 'center' });
    ctx.save(); ax.clip();
    line(ctx, xs.map((x, i) => [ax.X(x), ax.Y(vals[i])]), col.s[0], 2);
    ctx.restore();
  };
  cv.redraw(); show();
}
