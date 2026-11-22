// Class 12 Moving Charges: the magnetic force on a moving charge, F = q v × B, in a plane with B into or out of the page.
// F is always at right angles to v (so it only turns the charge, never speeds it up) and flips when the charge sign or B flips.
// The dot circles round the arc the force bends it into (a circle of radius mv/qB).
import { canvas, text, title, row, slider, choice, readout, arrow, loop, dot } from '../../kit.js';
import { bgrid, rot, rad } from '../c12p-mmlib.js';

export default function (host) {
  let phi = 20, q = 1, into = true, s = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 270, label: 'A charge moving in a magnetic field and the force on it' });
  const ctl = row(host);
  slider(ctl, { label: 'Direction of v', min: 0, max: 360, step: 5, value: phi, fmt: (v) => `${Math.round(v)}°`, oninput: (v) => { phi = v; s = 0; } });
  choice(ctl, 'Charge', [[1, 'Positive'], [-1, 'Negative']], q, (v) => { q = v; s = 0; });
  choice(ctl, 'B points', [[true, 'Into page'], [false, 'Out of page']], into, (v) => { into = v; s = 0; });
  const out = readout(host);
  loop(host, (dt) => { s += dt * 1.1; cv.redraw(); });
  const sigma = () => q * (into ? 1 : -1);
  const upd = () => { out.innerHTML = `The force is <b>${sigma() > 0 ? 'anticlockwise' : 'clockwise'} of v by 90°</b>. Right-hand rule for q v × B: fingers along v, curl them towards B, thumb gives F (for a negative charge, reverse it). The speed never changes.`; };
  upd();
  cv.draw = (ctx, w, h, col) => {
    upd();
    const top = title(ctx, 'F = q v × B: always sideways to the motion', col);
    bgrid(ctx, 0, top, w, h, into, col.line, 36, 6);
    const cx = w / 2, cy = (h + top) / 2 + 6, R = Math.min(w, h - top) * 0.2, sg = sigma();
    const v = [Math.cos(rad(phi)), Math.sin(rad(phi))], F = rot(v, sg * Math.PI / 2);
    const C = [cx + F[0] * R, cy - F[1] * R];
    ctx.save(); ctx.setLineDash([4, 5]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(C[0], C[1], R, 0, 7); ctx.stroke(); ctx.restore();
    const a = sg * s, p = rot([-F[0], -F[1]], a);
    dot(ctx, C[0] + p[0] * R, C[1] - p[1] * R, 6, q > 0 ? col.s[1] : col.s[0], col.ink);
    text(ctx, q > 0 ? '+' : '−', C[0] + p[0] * R, C[1] - p[1] * R - 12, { color: col.ink, size: 12, weight: 700, align: 'center' });
    dot(ctx, cx, cy, 4, col.ink);
    arrow(ctx, cx, cy, cx + v[0] * 70, cy - v[1] * 70, col.s[2], 3);
    text(ctx, 'v', cx + v[0] * 82, cy - v[1] * 82, { color: col.s[2], size: 14, weight: 700, align: 'center' });
    arrow(ctx, cx, cy, cx + F[0] * 56, cy - F[1] * 56, col.s[1], 3);
    text(ctx, 'F', cx + F[0] * 68, cy - F[1] * 68, { color: col.s[1], size: 14, weight: 700, align: 'center' });
    text(ctx, into ? 'B into the page' : 'B out of the page', 10, h - 12, { color: col.muted, size: 11 });
  };
  cv.redraw();
}
