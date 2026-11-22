// Trigonometric functions: a point P moves round the unit circle. Its x-coordinate is cos θ, its y-coordinate is
// sin θ, and the tangent line x = 1 shows tan θ. On the right the angle is unrolled into the graphs of sin and cos,
// so the reader sees why the graphs repeat every 2π and where each function is positive.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  let deg = 210, show = 'all';
  const cv = canvas(host, { aspect: 0.58, max: 360, min: 260, label: 'Unit circle with sin, cos and tan of an angle, and the sine and cosine graphs' });
  const ctl = row(host);
  const re = () => { cv.redraw(); out_(); };
  slider(ctl, { label: 'θ (degrees)', min: 0, max: 360, step: 5, value: deg, fmt: (v) => v + '°', oninput: (v) => { deg = v; re(); } });
  choice(ctl, 'Show', [['all', 'all'], ['sin', 'sin'], ['cos', 'cos'], ['tan', 'tan']], show, (v) => { show = v; re(); });
  const out = readout(host);
  const quad = (d) => (d % 90 === 0 ? 'on an axis' : ['first quadrant (all positive)', 'second quadrant (only sin positive)', 'third quadrant (only tan positive)', 'fourth quadrant (only cos positive)'][Math.floor((d % 360) / 90)]);
  const out_ = () => {
    const t = (deg * Math.PI) / 180, s = Math.sin(t), c = Math.cos(t);
    const tn = Math.abs(c) < 1e-9 ? 'not defined (cos θ = 0)' : fmt(s / c, 3);
    const ref = deg % 180 === 0 ? 0 : Math.min(deg % 180, 180 - (deg % 180));
    out.innerHTML = `θ = ${deg}° = ${fmt(t, 4)} rad, ${quad(deg)}. sin θ = <b>${fmt(Math.abs(s) < 1e-12 ? 0 : s, 3)}</b>, cos θ = <b>${fmt(Math.abs(c) < 1e-12 ? 0 : c, 3)}</b>, tan θ = <b>${tn}</b>. Reference angle ${ref}°: the size of each ratio equals its value at ${ref}°, only the sign changes. Check: sin² θ + cos² θ = ${fmt(s * s + c * c, 4)}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const t = (deg * Math.PI) / 180, s = Math.sin(t), c = Math.cos(t);
    // left: the circle
    const R = Math.min(h * 0.36, w * 0.2), cx = R + 24, cy = h / 2;
    line(ctx, [[cx - R - 12, cy], [cx + R + 16, cy]], col.muted, 1);
    line(ctx, [[cx, cy - R - 12], [cx, cy + R + 12]], col.muted, 1);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.strokeStyle = col.line; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.22, 0, -t, true); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
    const px = cx + R * c, py = cy - R * s;
    line(ctx, [[cx, cy], [px, py]], col.ink, 2);
    if (show === 'all' || show === 'cos') line(ctx, [[cx, cy], [px, cy]], col.s[1], 4);
    if (show === 'all' || show === 'sin') line(ctx, [[px, cy], [px, py]], col.s[0], 4);
    if ((show === 'all' || show === 'tan') && Math.abs(c) > 0.06) {
      const tv = Math.max(-2.2, Math.min(2.2, s / c));
      line(ctx, [[cx + R, cy - R * 1.2], [cx + R, cy + R * 1.2]], col.muted, 1, [4, 4]);
      line(ctx, [[cx, cy], [cx + R, cy - R * tv]], col.s[2], 1.5, [5, 4]);
      line(ctx, [[cx + R, cy], [cx + R, cy - R * tv]], col.s[2], 4);
    }
    dot(ctx, px, py, 5, col.ink);
    text(ctx, 'P', px + (c >= 0 ? 8 : -14), py - 8, { color: col.ink, weight: 700 });
    ['I', 'II', 'III', 'IV'].forEach((q, i) => { const a = Math.PI / 4 + (i * Math.PI) / 2; text(ctx, q, cx + R * 0.62 * Math.cos(a), cy - R * 0.62 * Math.sin(a), { color: col.muted, size: 11, align: 'center' }); });
    // right: the graphs
    const { X, Y } = axes(ctx, w, h, col, { x: [0, 360], y: [-1.5, 1.5], l: cx + R + 54, r: 12, xt: [0, 90, 180, 270, 360], yt: [-1, 0, 1], fx: (v) => v + '°', xlabel: 'θ' });
    const ps = [], pc = [], pt = [];
    for (let d = 0; d <= 360; d += 2) {
      const r_ = (d * Math.PI) / 180; ps.push([X(d), Y(Math.sin(r_))]); pc.push([X(d), Y(Math.cos(r_))]);
    }
    if (show === 'all' || show === 'sin') line(ctx, ps, col.s[0], 2.2);
    if (show === 'all' || show === 'cos') line(ctx, pc, col.s[1], 2.2);
    if (show === 'tan') {
      for (let d = 0; d <= 360; d += 1) {
        if (d % 180 === 90) { line(ctx, pt.splice(0), col.s[2], 2.2); line(ctx, [[X(d), Y(-1.5)], [X(d), Y(1.5)]], col.muted, 1, [3, 4]); continue; }
        const v = Math.tan((d * Math.PI) / 180); if (Math.abs(v) < 1.5) pt.push([X(d), Y(v)]); else if (pt.length) line(ctx, pt.splice(0), col.s[2], 2.2);
      }
      line(ctx, pt, col.s[2], 2.2);
    }
    line(ctx, [[X(deg), Y(-1.5)], [X(deg), Y(1.5)]], col.ink, 1, [4, 4]);
    if (show === 'all' || show === 'sin') dot(ctx, X(deg), Y(s), 4.5, col.s[0]);
    if (show === 'all' || show === 'cos') dot(ctx, X(deg), Y(c), 4.5, col.s[1]);
    if (show === 'tan' && Math.abs(c) > 1e-6 && Math.abs(s / c) < 1.5) dot(ctx, X(deg), Y(s / c), 4.5, col.s[2]);
    if (show === 'all') { text(ctx, 'sin θ', X(8), Y(1.38), { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'cos θ', X(60), Y(1.38), { color: col.s[1], size: 11, weight: 700 }); }
    else text(ctx, show + ' θ', X(8), Y(1.38), { color: show === 'sin' ? col.s[0] : show === 'cos' ? col.s[1] : col.s[2], size: 11, weight: 700 });
  };
  re();
}
