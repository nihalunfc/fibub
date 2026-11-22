// Class 10 Trigonometry (step player): proving an identity by working on one side only. Prove
// sin θ/(1 + cos θ) + (1 + cos θ)/sin θ = 2 cosec θ: join into one fraction, expand, use sin² + cos² = 1, factor and cancel.
import { canvas, axes, text, title, line, dot, arrow, row, slider, button, choice, readout, loop } from '../../kit.js';

const D = Math.PI / 180, f3 = (v) => (Math.abs(v) < 5e-10 ? '0' : String(+v.toFixed(3)));
const arcAt = (ctx, x, y, r, a0, a1, color, wd = 2) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); };
const rmark = (ctx, x, y, dx, dy, col, s = 9) => line(ctx, [[x + dx * s, y], [x + dx * s, y + dy * s], [x, y + dy * s]], col, 1.3);
const wrap = (ctx, s, w, y, col, size = 12) => { const words = s.split(' '); let a = '', ls = []; for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / (size * 0.53)) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; } ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, y - (ls.length - 1 - i) * (size + 4), { color: col.ink, size, align: 'center', halo: col.panel })); };
const lab = (ctx, s, x, y, tone, col, al = 'center', size = 12) => text(ctx, s, x, y, { color: tone, size, weight: 700, align: al, halo: col && col.panel });

const L = [['Left side = sinθ/(1 + cosθ) + (1 + cosθ)/sinθ', 'Start from the more complicated side.'], ['= [sin²θ + (1 + cosθ)²] / [sinθ(1 + cosθ)]', 'Common denominator: multiply each top by the other bottom.'], ['= [sin²θ + 1 + 2cosθ + cos²θ] / [sinθ(1 + cosθ)]', 'Expand (1 + cosθ)².'], ['= [1 + 1 + 2cosθ] / [sinθ(1 + cosθ)]', 'Use sin²θ + cos²θ = 1.'], ['= 2(1 + cosθ) / [sinθ(1 + cosθ)]', 'Take out the common factor 2 on top.'], ['= 2/sinθ = 2 cosecθ = Right side ✓', 'Cancel (1 + cosθ) and use 1/sin = cosec.']];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 310, label: 'Line by line proof of a trigonometric identity with the reason for each line' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Prove: sinθ/(1+cosθ) + (1+cosθ)/sinθ = 2cosecθ', col);
    for (let i = 0; i <= Math.min(s, 5); i++) { const y = t + 24 + i * 44, on = i === s; lab(ctx, L[i][0], 12, y, on ? col.ink : col.muted, col, 'left', on ? 13 : 12); text(ctx, L[i][1], 22, y + 18, { color: on ? col.s[0] : col.muted, size: 11, halo: col.panel }); }
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
