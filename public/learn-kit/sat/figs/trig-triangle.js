// 5.3 A right triangle with a hypotenuse of 1 unit scaled up: slide the angle and read sine, cosine and tangent as
// side ratios. The ratios depend only on the angle, never on the size of the triangle.
import { canvas, line, text, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  const S = { a: 35, size: 1 };
  const cv = canvas(host, { aspect: 0.6, max: 330, min: 230, label: 'A right triangle with an adjustable angle and its side ratios' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'angle A (°)', min: 5, max: 85, step: 1, value: S.a, fmt: (v) => String(v), oninput: (v) => { S.a = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'size', min: 0.5, max: 1, step: 0.05, value: S.size, fmt: (v) => fmt(v), oninput: (v) => { S.size = v; cv.redraw(); show(); } });
  cv.draw = (ctx, w, h, col) => {
    const t = (S.a * Math.PI) / 180, H = Math.min(w * 0.75, (h - 50) / Math.max(Math.sin(t), 0.35)) * S.size;
    const ax = 30, ay = h - 26, bx = ax + H * Math.cos(t), by = ay - H * Math.sin(t);
    line(ctx, [[ax, ay], [bx, ay]], col.s[1], 3);
    line(ctx, [[bx, ay], [bx, by]], col.s[0], 3);
    line(ctx, [[ax, ay], [bx, by]], col.ink, 3);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.strokeRect(bx - 12, ay - 12, 12, 12);
    ctx.beginPath(); ctx.arc(ax, ay, 26, -t, 0); ctx.stroke();
    text(ctx, 'A', ax - 14, ay, { color: col.ink, size: 13, weight: 700 });
    text(ctx, 'adjacent', (ax + bx) / 2, ay + 14, { color: col.s[1], size: 12, weight: 700, align: 'center' });
    text(ctx, 'opposite', bx + 6, (ay + by) / 2, { color: col.s[0], size: 12, weight: 700 });
    text(ctx, 'hypotenuse', (ax + bx) / 2 - 10, (ay + by) / 2 - 12, { color: col.ink, size: 12, weight: 700, align: 'right' });
  };
  const show = () => {
    const t = (S.a * Math.PI) / 180;
    out.innerHTML = `sin A = opposite/hypotenuse = <b>${fmt(Math.sin(t))}</b> · cos A = adjacent/hypotenuse = <b>${fmt(Math.cos(t))}</b> · tan A = opposite/adjacent = <b>${fmt(Math.tan(t))}</b>. Change the size: the ratios do not move. Only the angle sets them.`;
  };
  cv.redraw(); show();
}
