// 7.2 Bragg reflection. Two rays reflect from neighbouring atomic planes a distance d apart. The ray from the lower
// plane travels 2d sin θ further (shown in colour). Move the glancing angle θ: when the extra path is a whole number
// of wavelengths the reflections add (a Bragg peak). The small graph shows the reflected intensity from 12 planes.
import { canvas, axes, line, dot, arrow, text, row, slider, readout, fmt, title } from '../../kit.js';

const D = Math.PI / 180, NPL = 12;

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 480, min: 330, label: 'Two X-ray beams reflecting from neighbouring crystal planes, and the reflected intensity against angle' });
  let th = 20, d = 2.0, lam = 1.54;
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'Glancing angle θ (°)', min: 3, max: 85, step: 0.1, value: th, fmt: (v) => fmt(v, 3), oninput: (v) => { th = v; re(); } });
  slider(ctl, { label: 'Plane spacing d (Å)', min: 1, max: 4, step: 0.05, value: d, fmt: (v) => fmt(v, 3), oninput: (v) => { d = v; re(); } });
  slider(ctl, { label: 'Wavelength λ (Å)', min: 0.5, max: 2.5, step: 0.01, value: lam, fmt: (v) => fmt(v, 3), oninput: (v) => { lam = v; re(); } });
  const out = readout(host);
  const I = (t) => { const ph = 2 * Math.PI * 2 * d * Math.sin(t * D) / lam; const s = Math.sin(ph / 2); return Math.abs(s) < 1e-9 ? 1 : (Math.sin(NPL * ph / 2) / (NPL * s)) ** 2; };
  const show = () => {
    const path = 2 * d * Math.sin(th * D), m = path / lam, near = Math.round(m);
    const peaks = []; for (let n = 1; n * lam <= 2 * d; n++) peaks.push(`n = ${n} at ${fmt(Math.asin(n * lam / (2 * d)) / D, 3)}°`);
    out.innerHTML = `Extra path 2d sin θ = ${fmt(path, 3)} Å = <b>${fmt(m, 3)} λ</b>. ${Math.abs(m - near) < 0.03 && near > 0 ? `A whole number: <b>Bragg peak of order ${near}</b>.` : 'Not a whole number of wavelengths: the waves from many planes cancel.'} Peaks for these d and λ: ${peaks.join(', ') || 'none (λ > 2d)'}.`;
  };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, '2d sin θ = nλ', col);
    const top = 40, mid = H * 0.58, gap = Math.min(70, (mid - top) / 3) * Math.min(1.3, d / 2.0 + 0.3);
    const y1 = top + (mid - top) * 0.45, y2 = y1 + gap, y3 = y2 + gap;
    const sp = 34;
    for (const y of [y1, y2, y3]) { line(ctx, [[10, y], [W - 10, y]], col.line, 1); for (let x = 20; x < W - 10; x += sp) dot(ctx, x, y, 3.5, col.muted); }
    text(ctx, 'd', W - 22, (y1 + y2) / 2, { color: col.ink, size: 12, weight: 600 });
    line(ctx, [[W - 30, y1], [W - 30, y2]], col.ink, 1);
    const t = th * D, cx = W / 2, L = Math.min(W * 0.45, 260);
    const ray = (yy, c) => {
      const x0 = cx - L * Math.cos(t), y0 = yy - L * Math.sin(t), x2 = cx + L * Math.cos(t), y2b = yy - L * Math.sin(t);
      arrow(ctx, x0, y0, cx - 4 * Math.cos(t), yy - 4 * Math.sin(t), c, 2); arrow(ctx, cx, yy, x2, y2b, c, 2);
    };
    ray(y1, col.s[0]); ray(y2, col.s[2]);
    // extra path: from the foot of the perpendiculars on the lower ray
    const g = y2 - y1, a = g * Math.sin(t);
    const pIn = [cx - a * Math.cos(t), y2 - a * Math.sin(t)], pOut = [cx + a * Math.cos(t), y2 - a * Math.sin(t)];
    line(ctx, [[cx, y1], pIn], col.muted, 1, [3, 3]); line(ctx, [[cx, y1], pOut], col.muted, 1, [3, 3]);
    line(ctx, [pIn, [cx, y2], pOut], col.s[3], 4);
    text(ctx, 'extra path 2d sin θ', cx + 10, y2 + 14, { color: col.s[3], size: 11, weight: 600 });
    text(ctx, `θ = ${fmt(th, 3)}°`, cx - L * Math.cos(t) * 0.6, y1 - 8, { color: col.ink, size: 11 });
    // intensity graph
    const g0 = mid + 10;
    ctx.save(); ctx.translate(0, g0);
    const ax = axes(ctx, W, H - g0, col, { x: [0, 90], y: [0, 1.05], t: 8, b: 34, xlabel: 'glancing angle θ (degrees)', ylabel: 'I', yt: [0, 1], grid: false });
    const pts = []; for (let x = 0.2; x <= 90; x += 0.05) pts.push([ax.X(x), ax.Y(I(x))]);
    line(ctx, pts, col.s[0], 1.5);
    line(ctx, [[ax.X(th), ax.Y(0)], [ax.X(th), ax.Y(1.05)]], col.s[3], 1.5, [4, 3]);
    ctx.restore();
  };
  re();
}
