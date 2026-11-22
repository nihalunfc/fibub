// Class 12 Moving Charges: a charged particle in a uniform magnetic field. The part of v across B makes it go round in a circle
// (radius r = m v sinθ / qB); the part along B is untouched, so it drifts along B at v cosθ: a helix of pitch p = 2π m v cosθ / qB.
// Set θ = 90° for a circle, θ = 0° for a straight line. Real proton and electron values, view scaled to fit.
import { canvas, text, title, row, slider, choice, readout, line, dot, loop, arrow } from '../../kit.js';
import { rad, si } from '../c12p-mmlib.js';

export default function (host) {
  let th = 50, v = 3, B = 0.2, who = 'p', s = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'A charged particle spiralling along a magnetic field' });
  const ctl = row(host);
  slider(ctl, { label: 'Angle θ between v and B', min: 0, max: 90, step: 1, value: th, fmt: (x) => `${Math.round(x)}°`, oninput: (x) => { th = x; s = 0; } });
  slider(ctl, { label: 'Speed v', min: 1, max: 10, step: 0.5, value: v, fmt: (x) => `${x}×10⁶ m/s`, oninput: (x) => { v = x; s = 0; } });
  slider(ctl, { label: 'Field B', min: 0.05, max: 0.5, step: 0.05, value: B, fmt: (x) => `${x.toFixed(2)} T`, oninput: (x) => { B = x; s = 0; } });
  choice(ctl, 'Particle', [['p', 'Proton'], ['e', 'Electron']], who, (x) => { who = x; s = 0; });
  const out = readout(host);
  const mq = () => (who === 'p' ? 1.673e-27 / 1.602e-19 : 9.109e-31 / 1.602e-19);
  loop(host, (dt) => { s += dt * 4; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'A helix: circle across B, drift along B', col);
    const vv = v * 1e6, r = mq() * vv * Math.sin(rad(th)) / B, T = 2 * Math.PI * mq() / B, p = vv * Math.cos(rad(th)) * T;
    out.innerHTML = `Radius r = mv sinθ/qB = <b>${si(r, 'm')}</b>. Time for one turn T = 2πm/qB = <b>${si(T, 's')}</b> (it does not depend on v or θ). Pitch p = v cosθ × T = <b>${si(p, 'm')}</b>.`;
    const W = w - 60, cy = (h + top) / 2 + 4, x0 = 28;
    const k = Math.min(((h - top) * 0.32) / Math.max(r, 1e-12), W / Math.max(p * 4, r * 3, 1e-12));
    const Rp = r * k, Pp = p * k, sg = who === 'p' ? 1 : -1;
    const pt = (a) => [x0 + (Pp * a) / (2 * Math.PI) + 0.45 * Rp * Math.cos(a), cy - sg * Rp * Math.sin(a) - 0.25 * Rp * Math.cos(a)];
    arrow(ctx, x0 - 12, h - 18, x0 + 36, h - 18, col.s[0], 2); text(ctx, 'B', x0 + 46, h - 18, { color: col.s[0], size: 13, weight: 700 });
    if ((Pp * s) / (2 * Math.PI) > W - 0.5 * Rp || s > 14 * Math.PI) s = 0;
    const pts = []; for (let a = 0; a <= s; a += 0.12) pts.push(pt(a)); pts.push(pt(s));
    line(ctx, [[x0 - 8, cy], [x0 + W, cy]], col.line, 1, [3, 5]);
    line(ctx, pts, who === 'p' ? col.s[1] : col.s[0], 2.2);
    const P = pt(s); dot(ctx, P[0], P[1], 6, who === 'p' ? col.s[1] : col.s[0], col.ink);
    text(ctx, who === 'p' ? 'proton' : 'electron', P[0], P[1] - 14, { color: col.ink, size: 11, align: 'center' });
    text(ctx, `view scaled to fit: circle radius ${si(r, 'm')}`, 10, h - 36, { color: col.muted, size: 10.5 });
  };
  cv.redraw();
}
