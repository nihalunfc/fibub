// Class 9 Quadrilaterals: build a quadrilateral from its diagonals. Two diagonals that cut each other in half always
// make a parallelogram. Equal diagonals make it a rectangle, perpendicular diagonals make it a rhombus, both make a square.
import { canvas, text, title, row, slider, button, readout } from '../../kit.js';
import { note } from './c9-quad-lib.js';

export default function (host) {
  let d1 = 9, d2 = 6, th = 60, s1, s2, s3;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A quadrilateral built from two diagonals that bisect each other, with sliders for their lengths and angle' });
  const ctl = row(host);
  s1 = slider(ctl, { label: 'Diagonal AC', min: 4, max: 12, step: 1, value: d1, fmt: (v) => v + ' cm', oninput: (v) => { d1 = v; sync(); } });
  s2 = slider(ctl, { label: 'Diagonal BD', min: 4, max: 12, step: 1, value: d2, fmt: (v) => v + ' cm', oninput: (v) => { d2 = v; sync(); } });
  s3 = slider(ctl, { label: 'Angle between them', min: 30, max: 90, step: 5, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; sync(); } });
  const b2 = row(host);
  button(b2, 'Make the diagonals equal', () => { d2 = d1; s2.set(d2); sync(); });
  button(b2, 'Make them perpendicular', () => { th = 90; s3.set(90); sync(); });
  const out = readout(host);
  const pts = () => { const t = (th * Math.PI) / 180, u = [d1 / 2, 0], v = [(d2 / 2) * Math.cos(t), (d2 / 2) * Math.sin(t)]; return [[-u[0], -u[1]], [-v[0], -v[1]], [u[0], u[1]], [v[0], v[1]]]; };
  const name = () => (d1 === d2 && th === 90 ? 'a square' : d1 === d2 ? 'a rectangle' : th === 90 ? 'a rhombus' : 'a parallelogram');
  function sync() {
    const p = pts(), L = (i, j) => Math.hypot(p[i][0] - p[j][0], p[i][1] - p[j][1]);
    out.innerHTML = `Both diagonals are cut in half at the crossing point, so the shape is a parallelogram at least. It is <b>${name()}</b>. Sides: ${L(0, 1).toFixed(2)}, ${L(1, 2).toFixed(2)}, ${L(2, 3).toFixed(2)}, ${L(3, 0).toFixed(2)} cm.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Build it from the diagonals', col), p = pts(), k = Math.min((w - 40) / 13, (h - top - 50) / 10), cx = w / 2, cy = top + (h - top - 40) / 2 + 6;
    const X = (q) => cx + q[0] * k, Y = (q) => cy - q[1] * k;
    ctx.beginPath(); p.forEach((q, i) => (i ? ctx.lineTo(X(q), Y(q)) : ctx.moveTo(X(q), Y(q)))); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.22; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); [[0, 2], [1, 3]].forEach(([i, j]) => { ctx.beginPath(); ctx.moveTo(X(p[i]), Y(p[i])); ctx.lineTo(X(p[j]), Y(p[j])); ctx.stroke(); }); ctx.setLineDash([]);
    ['A', 'B', 'C', 'D'].forEach((n, i) => { const q = p[i], L = Math.hypot(q[0], q[1]) || 1; text(ctx, n, X(q) + (q[0] / L) * 14, Y(q) - (q[1] / L) * 14, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel }); });
    text(ctx, name().replace('a ', '').toUpperCase(), w / 2, h - 56, { color: col.s[3], size: 14, weight: 700, align: 'center' });
    note(ctx, 'Equal diagonals give right angles at every corner. Perpendicular diagonals give four equal sides.', w, h, col);
  };
  sync();
}
