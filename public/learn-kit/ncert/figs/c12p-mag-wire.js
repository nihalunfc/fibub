// Class 12 Moving Charges: the magnetic field round a long straight wire, from Ampère's circuital law.
// A circle of radius r round the wire has ∮B·dl = B(2πr) = μ0 I, so B = μ0 I / 2πr. The field lines are circles
// (right-hand grip rule), compass needles lie along them, and B falls off as 1/r (graph).
import { canvas, text, title, row, slider, choice, readout, arrow, axes, line, dot, loop } from '../../kit.js';
import { into, outof, headed, MU0, si } from '../c12p-mmlib.js';

export default function (host) {
  let I = 10, r = 4, out0 = true, t = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'The magnetic field of a straight current-carrying wire' });
  const ctl = row(host);
  slider(ctl, { label: 'Current I', min: 1, max: 20, step: 1, value: I, fmt: (x) => `${x} A`, oninput: (x) => { I = x; } });
  slider(ctl, { label: 'Loop radius r', min: 1, max: 10, step: 0.5, value: r, fmt: (x) => `${x} cm`, oninput: (x) => { r = x; } });
  choice(ctl, 'Current', [[true, 'Out of page'], [false, 'Into page']], out0, (x) => { out0 = x; });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Ampère: B × 2πr = μ0 I', col);
    const ht = h * 0.58, cx = w / 2, cy = top + (ht - top) / 2 + 2, Rm = Math.min(w / 2 - 12, (ht - top) / 2 - 4), px = Rm / 10, sg = out0 ? 1 : -1;
    for (const f of [0.28, 0.55, 0.82, 1]) { const rr = Rm * f, pts = []; for (let k = 0; k <= 48; k++) { const a = (k / 48) * 2 * Math.PI; pts.push([cx + rr * Math.cos(a), cy - rr * Math.sin(a)]); } headed(ctx, sg > 0 ? pts : pts.slice().reverse(), 3, col.s[0], 1.2); }
    ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r * px, 0, 7); ctx.stroke(); ctx.restore();
    (out0 ? outof : into)(ctx, cx, cy, 8, col.ink, 2.5);
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.6, x = cx + r * px * Math.cos(a), y = cy - r * px * Math.sin(a), sx = -Math.sin(a) * sg, sy = -Math.cos(a) * sg; arrow(ctx, x - sx * 9, y - sy * 9, x + sx * 9, y + sy * 9, col.s[1], 3, 8); }
    const B = (MU0 * I) / (2 * Math.PI * r / 100);
    text(ctx, 'B', cx + r * px * Math.cos(0.6) + 10, cy - r * px * Math.sin(0.6) - 10, { color: col.s[1], size: 13, weight: 700 });
    out.innerHTML = `On a loop of radius ${r} cm: B = μ0I/2πr = 2×10⁻⁷ × ${I} ÷ ${(r / 100).toFixed(3)} = <b>${si(B, 'T')}</b>, along the circle (${out0 ? 'anticlockwise' : 'clockwise'}). Double r, B halves. Right-hand rule: thumb along the current, fingers curl the way B goes round.`;
    const g = axes(ctx, w, h, col, { x: [0, 10], y: [0, (MU0 * I) / (2 * Math.PI * 0.01) * 1.05], t: ht + 12, b: 32, l: 58, r: 14, xt: [0, 2, 4, 6, 8, 10], fx: (v) => v, fy: (v) => si(v, 'T').replace(/ /, ''), xlabel: 'distance r (cm)' });
    ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let k = 0; k <= 100; k++) { const x = 0.3 + k * 0.097, X = g.X(x), Y = g.Y((MU0 * I) / (2 * Math.PI * x / 100)); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); ctx.restore();
    dot(ctx, g.X(r), g.Y(B), 6, col.s[1], col.ink);
  };
  cv.redraw();
}
