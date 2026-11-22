// Class 12 Electric Charges and Fields: how a dipole's field dies away with distance. Log-log graph of E against r for a point charge
// (falls as 1/r^2), a dipole's axial field (about 2kp/r^3) and equatorial field (about kp/r^3). Exact two-charge formulas are plotted;
// far from the dipole (r >> a) they follow the 1/r^3 lines. Axial is twice equatorial. Charges are +-1 nC, separation 2a is set by a slider.
import { canvas, text, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let a = 0.03, r = 0.5;
  const k = 9e9, q = 1e-9;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Log-log graph of electric field against distance for a point charge and a dipole' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'separation 2a (cm)', min: 1, max: 10, step: 0.5, value: 6, fmt: (v) => v.toFixed(1), oninput: (v) => { a = v / 200; go(); } });
  slider(ctl, { label: 'distance r (m)', min: 0.15, max: 3, value: r, log: true, fmt: (v) => v.toFixed(2), oninput: (v) => { r = v; go(); } });
  const ax = (x) => k * q * (1 / ((x - a) ** 2) - 1 / ((x + a) ** 2)), eq = (x) => 2 * k * q * a / (x * x + a * a) ** 1.5, pt = (x) => k * q / (x * x);
  const go = () => { ro.textContent = `r = ${r.toFixed(2)} m:  one charge ${pt(r).toPrecision(3)} N/C,  dipole axial ${ax(r).toPrecision(3)},  equatorial ${eq(r).toPrecision(3)}  (axial / equatorial = ${(ax(r) / eq(r)).toFixed(2)}).`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0.1, 3], y: [0.1, 1000], xlog: true, ylog: true, xlabel: 'distance r (m)', ylabel: 'field E (N/C)', xt: [0.1, 0.3, 1, 3], yt: [0.1, 1, 10, 100, 1000], fx: (v) => String(v), fy: (v) => String(v), l: 50 });
    ctx.save(); A.clip();
    const xs = []; for (let i = 0; i <= 80; i++) xs.push(0.1 * Math.pow(30, i / 80));
    const plot = (f, c, wd, d) => line(ctx, xs.filter((x) => x > a * 1.2).map((x) => [A.X(x), A.Y(Math.max(1e-3, f(x)))]), c, wd, d);
    plot(pt, col.muted, 1.5, [4, 3]); plot(ax, col.s[2], 2.5); plot(eq, col.s[0], 2.5);
    ctx.restore();
    ctx.strokeStyle = col.line; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(A.X(r), A.T); ctx.lineTo(A.X(r), A.B); ctx.stroke(); ctx.setLineDash([]);
    dot(ctx, A.X(r), A.Y(ax(r)), 5, col.s[2], col.panel); dot(ctx, A.X(r), A.Y(eq(r)), 5, col.s[0], col.panel); dot(ctx, A.X(r), A.Y(pt(r)), 4, col.muted, col.panel);
    text(ctx, 'single charge, 1/r²', A.R - 4, A.T + 8, { color: col.muted, size: 11, align: 'right' });
    text(ctx, 'dipole, axial', A.R - 4, A.T + 24, { color: col.s[2], size: 11, weight: 700, align: 'right' });
    text(ctx, 'dipole, equatorial', A.R - 4, A.T + 40, { color: col.s[0], size: 11, weight: 700, align: 'right' });
    text(ctx, 'dipole falls faster: 1/r³', A.R - 4, A.B - 14, { color: col.ink, size: 11, align: 'right' });
  };
  go();
}
