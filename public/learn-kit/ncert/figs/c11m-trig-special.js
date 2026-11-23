// Class 11 Maths, Trigonometric Functions: exact values for 0°, 30°, 45°, 60°, 90°. Draw a right triangle with hypotenuse 1: the side opposite the angle
// is sin and the side next to it is cos. sin takes the values √0/2, √1/2, √2/2, √3/2, √4/2, and cos takes them in reverse.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { r2 } from '../c11m-lib.js';

const ANG = [0, 30, 45, 60, 90], EX = ['0', '1/2', '√2/2', '√3/2', '1'];
export default function (host) {
  let a = 30;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 290, label: 'A right triangle with hypotenuse one for a chosen angle and a table of exact sine and cosine values' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Triangle with hypotenuse 1 and angle ${a}°`, col), rad = (a * Math.PI) / 180, S = Math.min(150, w * 0.38), bx = 30, by = top + 22 + S, tx = bx + S * Math.cos(rad), ty = by - S * Math.sin(rad);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.14; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, by); ctx.lineTo(tx, ty); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.lineWidth = 2.4; ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty); ctx.stroke(); ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, by); ctx.stroke(); ctx.strokeStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(tx, by); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; if (a > 0 && a < 90) ctx.strokeRect(tx - 9, by - 9, 9, 9);
    text(ctx, 'hypotenuse 1', (bx + tx) / 2 - 8, (by + ty) / 2 - 10, { color: col.ink, size: 11.5, weight: 700, align: 'right' });
    const i = ANG.indexOf(a);
    text(ctx, `cos ${a}° = ${EX[4 - i]}  (next to the angle)`, (bx + tx) / 2 + 20, by + 14, { color: col.s[0], size: 12.5, weight: 800, align: 'center' });
    text(ctx, `sin ${a}° = ${EX[i]}`, tx + 8, Math.min(by - 8, (by + ty) / 2), { color: col.s[3], size: 12.5, weight: 800 });
    text(ctx, `${a}°`, bx + 30, by - 6, { color: col.ink, size: 12, weight: 700 });
    const gy = by + 52, cw = (w - 20) / 6;
    ['θ', ...ANG.map((v) => v + '°')].forEach((t, j) => text(ctx, t, 10 + j * cw + cw / 2, gy, { color: j === i + 1 ? col.s[2] : col.ink, size: 12, weight: 800, align: 'center' }));
    ['sin θ', ...EX].forEach((t, j) => text(ctx, t, 10 + j * cw + cw / 2, gy + 22, { color: j === i + 1 ? col.s[2] : col.s[3], size: 11.5, weight: 700, align: 'center' }));
    ['cos θ', ...[...EX].reverse()].forEach((t, j) => text(ctx, t, 10 + j * cw + cw / 2, gy + 44, { color: j === i + 1 ? col.s[2] : col.s[0], size: 11.5, weight: 700, align: 'center' }));
    const tn = ['0', '1/√3', '1', '√3', 'not defined'];
    ['tan θ', ...tn].forEach((t, j) => text(ctx, t, 10 + j * cw + cw / 2, gy + 66, { color: j === i + 1 ? col.s[2] : col.ink, size: 11, weight: 700, align: 'center' }));
    out.innerHTML = `sin ${a}° = ${r2(Math.sin(rad), 4)}, cos ${a}° = ${r2(Math.cos(rad), 4)}, tan ${a}° = ${a === 90 ? 'not defined' : r2(Math.tan(rad), 4)}.`;
  };
  choice(row(host), 'Angle', ANG.map((v) => [String(v), v + '°']), '30', (v) => { a = +v; cv.redraw(); });
  cv.redraw();
}
