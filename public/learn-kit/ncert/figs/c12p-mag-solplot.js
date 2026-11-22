// Class 12 Moving Charges: the field along the axis of a solenoid of finite length, B(z) = (μ0 n I / 2)(cos α1 + cos α2).
// Inside a long solenoid the field is flat and equal to μ0 n I; at either end it drops to half of that. A short, fat coil
// never gets a flat part. Change the length, the turns per metre and the current.
import { canvas, text, title, row, slider, readout, axes, line, dot } from '../../kit.js';
import { MU0, si } from '../c12p-mmlib.js';

export default function (host) {
  let L = 30, n = 1000, I = 2;
  const R = 0.02;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 280, label: 'The field along the axis of a solenoid' });
  const ctl = row(host);
  slider(ctl, { label: 'Length L', min: 4, max: 60, step: 1, value: L, fmt: (x) => `${x} cm`, oninput: (x) => { L = x; cv.redraw(); } });
  slider(ctl, { label: 'Turns per metre n', min: 200, max: 2000, step: 100, value: n, fmt: (x) => `${x}`, oninput: (x) => { n = x; cv.redraw(); } });
  slider(ctl, { label: 'Current I', min: 0.5, max: 5, step: 0.5, value: I, fmt: (x) => `${x} A`, oninput: (x) => { I = x; cv.redraw(); } });
  const out = readout(host);
  const B = (z) => { const l = L / 200; return ((MU0 * n * I) / 2) * ((z + l) / Math.hypot(z + l, R) - (z - l) / Math.hypot(z - l, R)); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Field along the axis of a solenoid', col);
    const ideal = MU0 * n * I, g = axes(ctx, w, h, col, { x: [-40, 40], y: [0, ideal * 1.2], t: top + 52, b: 34, l: 62, r: 12, xt: [-40, -20, 0, 20, 40], fy: (v) => si(v, 'T').replace(/ /, ''), xlabel: 'position along the axis (cm)' });
    const cy = top + 26, xa = g.X(-L / 2), xb = g.X(L / 2), turns = Math.min(40, Math.round(L / 2));
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(xa, cy - 14, xb - xa, 28);
    ctx.lineWidth = 1; for (let k = 1; k < turns; k++) { const x = xa + ((xb - xa) * k) / turns; ctx.beginPath(); ctx.moveTo(x, cy - 14); ctx.lineTo(x + 4, cy + 14); ctx.stroke(); } ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip();
    line(ctx, [[g.L, g.Y(ideal)], [g.R, g.Y(ideal)]], col.muted, 1, [4, 4]);
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath(); for (let k = 0; k <= 160; k++) { const z = -40 + k * 0.5, X = g.X(z), Y = g.Y(B(z / 100)); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); ctx.restore();
    text(ctx, 'μ0 n I', g.R - 4, g.Y(ideal) - 8, { color: col.muted, size: 10.5, align: 'right' });
    dot(ctx, g.X(0), g.Y(B(0)), 5, col.s[1], col.ink); dot(ctx, g.X(L / 2), g.Y(B(L / 200)), 5, col.s[2], col.ink);
    out.innerHTML = `Centre: <b>${si(B(0), 'T')}</b> (ideal long solenoid: μ0nI = ${si(ideal, 'T')}). At the end: <b>${si(B(L / 200), 'T')}</b>, about half. ${L < 8 ? 'This coil is short compared with its width, so there is no flat part.' : 'Length ≫ radius, so the middle is almost exactly μ0nI.'}`;
  };
  cv.redraw();
}
