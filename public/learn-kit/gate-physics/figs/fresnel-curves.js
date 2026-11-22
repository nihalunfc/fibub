// 3.7 Fresnel reflection. Reflectance R_s and R_p (or the amplitude coefficients r_s, r_p) against the angle of
// incidence for chosen indices n1 → n2, with the Brewster angle and (going to a rarer medium) the critical angle.
// Beyond the critical angle both reflectances are 1; in amplitude view the s-p phase difference is shown instead.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt, title } from '../../kit.js';

const D = Math.PI / 180;
const coef = (n1, n2, t) => {
  const ci = Math.cos(t * D), st = (n1 / n2) * Math.sin(t * D);
  if (st >= 1) return null;
  const ct = Math.sqrt(1 - st * st);
  return { rs: (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct), rp: (n2 * ci - n1 * ct) / (n2 * ci + n1 * ct) };
};
const tirDelta = (t, n) => { const s = Math.sin(t * D), c = Math.cos(t * D); return (2 * Math.atan((c * Math.sqrt(Math.max(0, s * s - n * n))) / (s * s))) / D; };

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Fresnel reflection coefficients against angle of incidence, with Brewster and critical angles marked' });
  let n1 = 1, n2 = 1.5, view = 'R', th = 45;
  const ctl = row(host), ctl2 = row(host);
  slider(ctl, { label: 'n₁ (incident side)', min: 1, max: 2.5, step: 0.01, value: n1, fmt: (v) => fmt(v, 3), oninput: (v) => { n1 = v; upd(); } });
  slider(ctl, { label: 'n₂', min: 1, max: 2.5, step: 0.01, value: n2, fmt: (v) => fmt(v, 3), oninput: (v) => { n2 = v; upd(); } });
  choice(ctl2, 'Show', [['R', 'Reflectance R'], ['r', 'Amplitude r']], view, (v) => { view = v; upd(); });
  slider(ctl2, { label: 'Angle θᵢ (°)', min: 0, max: 89.5, step: 0.5, value: th, fmt: (v) => fmt(v, 3), oninput: (v) => { th = v; upd(); } });
  const out = readout(host);
  const upd = () => {
    const thB = Math.atan(n2 / n1) / D, thc = n1 > n2 ? Math.asin(n2 / n1) / D : null, k = coef(n1, n2, th);
    let s = `Brewster angle ${fmt(thB, 3)}°` + (thc ? `, critical angle ${fmt(thc, 3)}°.` : ' (no critical angle going into a denser medium).');
    if (k) s += ` At ${fmt(th, 3)}°: r<sub>s</sub> = ${fmt(k.rs, 3)}, r<sub>p</sub> = ${fmt(k.rp, 3)}, R<sub>s</sub> = <b>${fmt(k.rs ** 2, 3)}</b>, R<sub>p</sub> = <b>${fmt(k.rp ** 2, 3)}</b>.`;
    else s += ` At ${fmt(th, 3)}°: total internal reflection, R<sub>s</sub> = R<sub>p</sub> = 1, s-p phase difference <b>${fmt(tirDelta(th, n2 / n1), 3)}°</b>.`;
    out.innerHTML = s; cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Reflection from n₁ = ${fmt(n1, 3)} into n₂ = ${fmt(n2, 3)}`, col);
    const yr = view === 'R' ? [0, 1.05] : [-1.05, 1.05];
    const ax = axes(ctx, w, h, col, { x: [0, 90], y: yr, t: 40, xlabel: 'angle of incidence (degrees)', ylabel: view === 'R' ? 'reflectance' : 'amplitude r', fy: (v) => fmt(v, 2) });
    const S = [], P = [];
    for (let t = 0; t <= 89.9; t += 0.25) {
      const k = coef(n1, n2, t);
      if (k) { S.push([ax.X(t), ax.Y(view === 'R' ? k.rs ** 2 : k.rs)]); P.push([ax.X(t), ax.Y(view === 'R' ? k.rp ** 2 : k.rp)]); }
      else if (view === 'R') { S.push([ax.X(t), ax.Y(1)]); P.push([ax.X(t), ax.Y(1)]); }
    }
    line(ctx, S, col.s[0], 3); line(ctx, P, col.s[1], 3, [7, 4]);
    const thB = Math.atan(n2 / n1) / D;
    line(ctx, [[ax.X(thB), ax.T], [ax.X(thB), ax.B]], col.s[2], 1.5, [2, 3]);
    text(ctx, 'Brewster', ax.X(thB) + 4, ax.T + 10, { color: col.s[2], size: 11, halo: col.panel });
    if (n1 > n2) { const thc = Math.asin(n2 / n1) / D; line(ctx, [[ax.X(thc), ax.T], [ax.X(thc), ax.B]], col.s[3], 1.5, [2, 3]); text(ctx, 'critical', ax.X(thc) + 4, ax.T + 24, { color: col.s[3], size: 11, halo: col.panel }); }
    if (view === 'r') line(ctx, [[ax.X(0), ax.Y(0)], [ax.X(90), ax.Y(0)]], col.muted, 1);
    const k = coef(n1, n2, th);
    if (k) { dot(ctx, ax.X(th), ax.Y(view === 'R' ? k.rs ** 2 : k.rs), 5, col.s[0], col.panel); dot(ctx, ax.X(th), ax.Y(view === 'R' ? k.rp ** 2 : k.rp), 5, col.s[1], col.panel); }
    text(ctx, 's (E ⊥ plane)', ax.L + 8, ax.B - 30, { color: col.s[0], size: 12, weight: 700, halo: col.panel });
    text(ctx, 'p (E in plane)', ax.L + 8, ax.B - 14, { color: col.s[1], size: 12, weight: 700, halo: col.panel });
  };
  upd();
}
