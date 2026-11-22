// 7.5 The acoustic peaks, live (simplified model, acoustic-peaks-model.js). The angular power spectrum: how
// strong the ripples are (D_ℓ, in µK²) on each angular scale (multipole ℓ ≈ 180° / angle). The peak positions
// come from the sound horizon and the distance to last scattering, computed for your recipe; the heights from a
// tuned toy. Slide the atoms (Ω_b h²), the dark matter (Ω_c h²) and the curvature (Ω_k) and watch the peaks
// move. The grey dashed curve is the Planck 2018 recipe.
import { canvas, axes, line, dot, text, title, row, slider, button, readout } from '../../kit.js';
import { curve, peaks, geometry, BASE } from './acoustic-peaks-model.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 420, min: 310, label: 'The CMB power spectrum with its acoustic peaks, changing with the recipe' });
  const p = { ...BASE };
  const ref = curve(BASE, 2000, 4);
  const ctl = row(host);
  const sb = slider(ctl, { label: 'Atoms Ω_b h²', min: 0.010, max: 0.040, step: 0.001, value: p.wb, fmt: (v) => v.toFixed(3), oninput: (v) => { p.wb = v; upd(); } });
  const sc = slider(ctl, { label: 'Dark matter Ω_c h²', min: 0.06, max: 0.20, step: 0.005, value: p.wc, fmt: (v) => v.toFixed(3), oninput: (v) => { p.wc = v; upd(); } });
  const sk = slider(ctl, { label: 'Curvature Ω_k', min: -0.1, max: 0.1, step: 0.01, value: 0, fmt: (v) => (Math.abs(v) < 0.005 ? '0 (flat)' : v < 0 ? `${v.toFixed(2)} (closed)` : `+${v.toFixed(2)} (open)`), oninput: (v) => { p.Ok = v; upd(); } });
  button(ctl, 'Planck 2018 recipe', () => { Object.assign(p, BASE); sb.set(p.wb); sc.set(p.wc); sk.set(0); upd(); });
  const out = readout(host);
  let cur = curve(p, 2000, 2), pk = peaks(cur), g = geometry(p);
  const upd = () => { cur = curve(p, 2000, 2); pk = peaks(cur); g = geometry(p); show(); cv.redraw(); };
  const show = () => {
    const [a, b] = pk;
    out.innerHTML = `First peak at <b>ℓ ≈ ${a[0]}</b> (180° ÷ ℓ ≈ ${(180 / a[0]).toFixed(2)}°; Planck measures ℓ ≈ 220). Sound horizon at last scattering ${g.rs.toFixed(0)} Mpc, seen from ${(g.DM / 1000).toFixed(1)} thousand Mpc away, an angle of ${g.theta.toFixed(3)}°. First peak ÷ second peak = <b>${(a[1] / b[1]).toFixed(2)}</b> (more atoms, bigger ratio). <i>Simplified teaching model.</i>`;
  };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0, 2000], y: [0, 7500], t: 40, l: 52, xlabel: 'Multipole ℓ  (≈ 180° ÷ spot size)', ylabel: 'Ripple power D_ℓ (µK²)', fy: (v) => (v ? (v / 1000) + 'k' : '0') });
    ctx.save(); A.clip();
    line(ctx, ref.map(([l, d]) => [A.X(l), A.Y(d)]), col.muted, 1.5, [5, 4]);
    line(ctx, cur.map(([l, d]) => [A.X(l), A.Y(d)]), col.s[0], 2.5);
    ctx.restore();
    pk.slice(0, 3).forEach(([l, d], i) => {
      dot(ctx, A.X(l), A.Y(d), 4, col.s[1], col.panel);
      text(ctx, ['1st', '2nd', '3rd'][i], A.X(l), A.Y(d) - 12, { color: col.s[1], size: 11.5, weight: 700, align: 'center', halo: col.panel });
    });
    const tick = w < 500 ? [[180, '1°'], [1800, '0.1°']] : [[90, '2°'], [180, '1°'], [360, '0.5°'], [1800, '0.1°']];
    tick.forEach(([l, s]) => { if (A.X(l) < A.R - 10) text(ctx, s, A.X(l), A.B - 10, { color: col.muted, size: 10, align: 'center', halo: col.panel }); });
    title(ctx, 'Sound waves in the CMB: the peaks', col);
  };
  show(); cv.redraw();
}
