// Two atoms in their bond: a Lennard-Jones well V(r) = 4ε[(σ/r)¹² − (σ/r)⁶] (ε = σ = 1). The pair vibrates with the energy you
// give it (more heat = bigger swings). Because the well is steep on the left and shallow on the right, the swing is lopsided
// and the average separation grows: that is thermal expansion. The dashed parabola is the harmonic approximation, which
// would have no expansion at all. Raise the energy and watch the mean position (dark line) drift right.
import { canvas, axes, line, dot, text, row, slider, readout, loop, title, fmt } from '../kit.js';

const V = (r) => 4 * (r ** -12 - r ** -6), F = (r) => 4 * (12 * r ** -13 - 6 * r ** -7), R0 = 2 ** (1 / 6);
const turn = (E) => { const f = (lo, hi) => { for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; ((V(m) - E) * (V(lo) - E) > 0 ? (lo = m) : (hi = m)); } return (lo + hi) / 2; }; return [f(0.9, R0), f(R0, 12)]; };
export default function (host) {
  let r = 1.2, v = 0, mean = R0;
  const cv = canvas(host, { aspect: 0.78, max: 360, min: 270, label: 'Lennard-Jones potential well with a vibrating pair of atoms' });
  const ctl = row(host);
  const sE = slider(ctl, { label: 'Vibration energy E (ε)', min: -0.97, max: -0.15, step: 0.01, value: -0.6, fmt: (v) => v.toFixed(2), oninput: () => start() });
  loop(host, (dt) => { for (let k = 0; k < 20; k++) { const h = dt / 20 * 2; v += 0.5 * h * F(r); r += h * v; v += 0.5 * h * F(r); } cv.redraw(); }).button(ctl);
  const out = readout(host);
  function start() { const [a, b] = turn(sE.value); r = a; v = 0; mean = orbitMean(sE.value); show(); queueMicrotask(() => cv.redraw()); }
  function orbitMean(E) { let x = turn(E)[0], u = 0, s = 0, tt = 0; const h = 0.002; for (let i = 0; i < 40000; i++) { u += 0.5 * h * F(x); x += h * u; u += 0.5 * h * F(x); s += x; tt++; if (i > 10 && u <= 0) break; } return s / tt; }
  function show() { const [a, b] = turn(sE.value); out.innerHTML = `<b>E = ${sE.value.toFixed(2)} ε:</b> the atoms swing between r = ${a.toFixed(3)} σ and ${b.toFixed(3)} σ. The equilibrium (bottom of the well) is r₀ = 2^(1/6) σ = ${R0.toFixed(3)} σ, but the average separation is ${mean.toFixed(3)} σ, ${((mean / R0 - 1) * 100).toFixed(2)}% larger. The harmonic (parabola) approximation would keep the mean exactly at r₀: no thermal expansion without the anharmonic part. The same asymmetry makes heat capacity and thermal conductivity differ from the harmonic crystal.`; }
  cv.draw = (ctx, w, h, col) => {
    const top = 70, A = axes(ctx, w, h - 0, col, { x: [0.9, 2.4], y: [-1.1, 0.8], xlabel: 'separation r (σ)', ylabel: 'V(r) (ε)', l: 44, t: top, b: 38, yt: [-1, -0.5, 0, 0.5] });
    A.clip();
    line(ctx, Array.from({ length: 150 }, (_, i) => { const x = 0.95 + i * 0.01; return [A.X(x), A.Y(V(x))]; }), col.s[0], 2.5);
    line(ctx, Array.from({ length: 80 }, (_, i) => { const x = 1.0 + i * 0.012; return [A.X(x), A.Y(-1 + 28.55 * (x - R0) ** 2)]; }), col.muted, 1.5, [4, 4]);
    const E = sE.value, [a, b] = turn(E);
    line(ctx, [[A.X(a), A.Y(E)], [A.X(Math.min(b, 2.4)), A.Y(E)]], col.s[1], 2);
    line(ctx, [[A.X(R0), A.T], [A.X(R0), A.B]], col.line, 1.2, [3, 3]);
    line(ctx, [[A.X(mean), A.T], [A.X(mean), A.B]], col.ink, 2);
    dot(ctx, A.X(r), A.Y(V(r)), 6.5, col.s[1], col.ink);
    ctx.restore?.();
    // the two atoms drawn at separation r, anchored at the left one
    const ax = 30, sc = Math.min(70, (w - 80) / 3);
    dot(ctx, ax, 44, 9, col.s[2]); dot(ctx, ax + r * sc * 0.9, 44, 9, col.s[2], col.ink);
    line(ctx, [[ax + 9, 44], [ax + r * sc * 0.9 - 9, 44]], col.muted, 2, [3, 3]);
    text(ctx, `r = ${r.toFixed(2)} σ`, ax + r * sc * 0.9 + 16, 44, { color: col.ink, size: 11, weight: 600 });
    text(ctx, 'black line: mean r', w - 10, top + 8, { color: col.ink, size: 10.5, align: 'right' }); text(ctx, 'dashed: harmonic parabola', w - 10, top + 22, { color: col.muted, size: 10.5, align: 'right' });
    title(ctx, 'Anharmonic bond', col, 16);
  };
  start();
}
