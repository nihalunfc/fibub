// Class 11 Maths, AM and GM: for two positive numbers a and b, AM = (a + b)/2 and GM = √(ab). Draw a semicircle on a
// diameter of length a + b. Its radius is the AM. Where the two parts of the diameter meet, the perpendicular up to the
// circle has length √(ab), the GM. A chord is never longer than the radius, so GM ≤ AM, with equality only when a = b.
import { canvas, row, slider, readout, line, dot, text, title, touchGuard } from '../../kit.js';

export default function (host) {
  let a = 2, b = 8, g;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 290, label: 'A semicircle on a diameter of a plus b showing that the geometric mean is below the arithmetic mean' });
  const c1 = row(host), out = readout(host);
  slider(c1, { label: 'a', min: 0.5, max: 9, step: 0.5, value: a, fmt: String, oninput: (v) => { a = v; re(); } });
  slider(c1, { label: 'b', min: 0.5, max: 9, step: 0.5, value: b, fmt: String, oninput: (v) => { b = v; re(); } });
  const re = () => { cv.redraw(); const am = (a + b) / 2, gm = Math.sqrt(a * b); out.innerHTML = `AM = (${a} + ${b})/2 = <b>${am}</b>, GM = √(${a}×${b}) = <b>${+gm.toFixed(3)}</b>. ${a === b ? 'a = b: AM = GM.' : `GM is ${+(am - gm).toFixed(3)} below AM.`} Also AM × HM = GM² (HM = ${+(2 * a * b / (a + b)).toFixed(3)}).`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'AM ≥ GM on a semicircle', col), D = a + b, y0t = h - 40, u = Math.min((w - 40) / D, (y0t - top - 24) / (D / 2)), x0 = (w - D * u) / 2, y0 = h - 40, R = D * u / 2, cx = x0 + R, xm = x0 + a * u, gm = Math.sqrt(a * b), am = D / 2;
    ctx.beginPath(); ctx.arc(cx, y0, R, Math.PI, 0); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.stroke();
    line(ctx, [[x0, y0], [x0 + D * u, y0]], col.ink, 2); line(ctx, [[cx, y0], [cx, y0 - R]], col.s[2], 2.5); line(ctx, [[xm, y0], [xm, y0 - gm * u]], col.s[1], 2.5);
    dot(ctx, xm, y0, 4, col.ink); dot(ctx, xm, y0 - gm * u, 5, col.s[1]); dot(ctx, cx, y0 - R, 5, col.s[2]);
    text(ctx, 'a', (x0 + xm) / 2, y0 + 14, { color: col.s[0], size: 12, weight: 700, align: 'center' }); text(ctx, 'b', (xm + x0 + D * u) / 2, y0 + 14, { color: col.s[0], size: 12, weight: 700, align: 'center' });
    text(ctx, 'AM', cx + 8, y0 - R / 2, { color: col.s[2], size: 12, weight: 700 }); text(ctx, 'GM', xm + 8, y0 - gm * u / 2, { color: col.s[1], size: 12, weight: 700 });
  };
  re();
}
