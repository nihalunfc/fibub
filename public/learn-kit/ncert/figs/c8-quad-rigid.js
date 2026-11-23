// Class 8 Quadrilaterals: why a quadrilateral needs five measurements. A triangle with fixed sides cannot change shape, but a
// four-bar frame with fixed sides can lean over into many shapes (a parallelogram frame is a railway gate). Slide to lean it.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let a = 90;
  const cv = canvas(host, { aspect: 0.5, max: 440, min: 250, label: 'A four-bar frame that leans and a triangle frame that does not' });
  const out = readout(host); const ctl = row(host);
  slider(ctl, { label: 'Lean the frame', min: 50, max: 130, step: 1, value: a, fmt: (v) => Math.round(v) + '°', oninput: (v) => { a = Math.round(v); sync(); } });
  function sync() { out.innerHTML = `Four sticks of fixed length (3 and 2): the angle at the base changes freely (now <b>${a}°</b>), so the shape is not fixed. The triangle with three fixed sticks cannot change. A quadrilateral needs <b>5</b> measurements, such as 4 sides and a diagonal, to be fixed.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Triangle: rigid. Four sides: floppy', col), u = Math.min((w - 30) / 9, (h - top - 30) / 3.2), r = (a * Math.PI) / 180, y0 = h - 22;
    const quad = [[14, y0], [14 + 3 * u, y0], [14 + 3 * u + 2 * u * Math.cos(r) * -1 * -1 * -1 + 0, y0 - 2 * u * Math.sin(r)]];
    const A = [14, y0], B = [14 + 3 * u, y0], D = [A[0] + 2 * u * Math.cos(r), y0 - 2 * u * Math.sin(r)], C = [B[0] + 2 * u * Math.cos(r), D[1]];
    void quad;
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.beginPath(); [A, B, C, D].forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke();
    [A, B, C, D].forEach((p) => { ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(p[0], p[1], 4.5, 0, 7); ctx.fill(); });
    const tx = w - 14 - 3 * u, T = [[tx, y0], [tx + 3 * u, y0], [tx + 1.5 * u, y0 - 2.2 * u]];
    ctx.strokeStyle = col.s[2]; ctx.beginPath(); T.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke(); T.forEach((p) => { ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(p[0], p[1], 4.5, 0, 7); ctx.fill(); });
    text(ctx, 'four sides: leans', 14 + 2.5 * u, top + 10, { color: col.s[0], size: 11.5, weight: 700, align: 'center' }); text(ctx, 'triangle: stays', tx + 1.5 * u, top + 10, { color: col.s[2], size: 11.5, weight: 700, align: 'center' });
  };
  sync();
}
