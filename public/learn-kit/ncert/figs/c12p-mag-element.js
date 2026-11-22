// Class 12 Moving Charges: the Biot–Savart law for one small piece of wire (a current element I dl).
// dB = (μ0/4π) I dl sin θ / r²: strongest to the side (θ = 90°), zero straight along the wire (θ = 0°), falling as 1/r².
// Direction: dl × r̂ (right-hand rule), out of the page above the element, into the page below it. Drag the point P.
import { canvas, text, title, row, slider, readout, arrow, line, dot } from '../../kit.js';
import { into, outof, drag, si, rad } from '../c12p-mmlib.js';

export default function (host) {
  let I = 5, P = null;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 270, label: 'The field of a small current element at a point you can drag' });
  const ctl = row(host);
  slider(ctl, { label: 'Current I', min: 1, max: 10, step: 1, value: I, fmt: (x) => `${x} A`, oninput: (x) => { I = x; cv.redraw(); } });
  const out = readout(host);
  drag(cv, (x, y) => { P = [x, y]; cv.redraw(); }, (x, y) => !P || Math.hypot(x - P[0], y - P[1]) < 44);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Drag the point P around the current element', col);
    const cx = w / 2, cy = (top + h) / 2 + 6, Rm = Math.min(w / 2 - 14, (h - top) / 2 - 12), pxcm = Rm / 10;
    if (!P) P = [cx + Rm * 0.55, cy - Rm * 0.65];
    let rx = P[0] - cx, ry = cy - P[1], rr = Math.hypot(rx, ry);
    if (rr > Rm) { rx *= Rm / rr; ry *= Rm / rr; rr = Rm; } if (rr < 0.12 * Rm) { rx = 0.12 * Rm; ry = 0; rr = 0.12 * Rm; }
    P = [cx + rx, cy - ry];
    // ring of marks showing dB at this distance all the way round
    for (let k = 0; k < 24; k++) { const a = (k / 24) * 2 * Math.PI, s = Math.sin(a), m = 1.5 + 4.5 * Math.abs(s); if (Math.abs(s) < 0.08) { dot(ctx, cx + rr * Math.cos(a), cy - rr * Math.sin(a), 1.5, col.line); continue; } (s > 0 ? outof : into)(ctx, cx + rr * Math.cos(a), cy - rr * Math.sin(a), m, col.line, 1.2); }
    arrow(ctx, cx - 26, cy, cx + 26, cy, col.s[1], 5, 12); text(ctx, 'I dl', cx, cy + 18, { color: col.s[1], size: 12, weight: 700, align: 'center' });
    line(ctx, [[cx, cy], P], col.muted, 1.5, [4, 4]); text(ctx, 'r', cx + rx / 2 - 6, cy - ry / 2 - 8, { color: col.muted, size: 13, weight: 700 });
    const th = Math.atan2(Math.abs(ry), rx), sgn = ry >= 0 ? 1 : -1;
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, 24 + 10, sgn > 0 ? -th : 0, sgn > 0 ? 0 : th); ctx.stroke(); ctx.restore();
    text(ctx, 'θ', cx + 44, cy - sgn * 12, { color: col.ink, size: 12 });
    (sgn > 0 ? outof : into)(ctx, P[0], P[1], 5 + 9 * Math.sin(th), col.s[0], 2.5); dot(ctx, P[0], P[1], 2, col.s[0]);
    text(ctx, 'P', P[0] + 16, P[1] - 12, { color: col.s[0], size: 13, weight: 700 });
    const rm = rr / pxcm / 100, dB = 1e-7 * I * 0.01 * Math.sin(th) / (rm * rm);
    out.innerHTML = `r = ${(rm * 100).toFixed(1)} cm, θ = ${Math.round(th / Math.PI * 180)}°, I dl = ${I} A × 1 cm. dB = (μ0/4π) I dl sinθ / r² = <b>${si(dB, 'T')}</b>, ${sgn > 0 ? 'out of' : 'into'} the page at P. Each small mark on the ring shows the field at that angle: big at the sides, none along the wire.`;
  };
  cv.redraw();
}
