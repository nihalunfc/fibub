// Class 9 Work and Energy (step player): why kinetic energy is (1/2) m v^2. A constant force F pushes a block of mass m
// from rest over a distance s. Work done W = F s. Newton: F = m a. From v^2 = 2 a s the distance is s = v^2 / (2a).
// So W = m a x v^2 / (2a) = (1/2) m v^2: the work done on the block is stored as its kinetic energy.
import { canvas, text, title, line, arrow, loop } from '../../kit.js';

const TITLES = ['A block at rest', 'A constant force F pushes it a distance s', 'The work done is W = F s', 'Use F = ma and v² = 2as', 'Put them together: W = ½ m v²', 'The work becomes kinetic energy'];
const EQ = ['u = 0, so KE = 0', 'F pushes over distance s', 'W = F × s', 'F = m a   and   s = v² / (2a)', 'W = m a × v²/(2a) = ½ m v²', 'KE = ½ m v² = W'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 290, label: 'A block pushed by a constant force and the steps that give kinetic energy equals half m v squared' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, TITLES[step], col);
    const floor = h * 0.5, x0 = 40, x1 = w - 60, bw = 44;
    line(ctx, [[8, floor], [w - 8, floor]], col.ink, 2);
    const ph = step < 1 ? 0 : step === 1 ? Math.min(1, (t * 0.5) % 1.6) : 1;
    const bx = x0 + (step >= 2 ? 1 : ph) * (x1 - x0 - bw) * (step >= 2 ? 1 : 1);
    if (step >= 1) { ctx.setLineDash([4, 3]); line(ctx, [[x0 + bw / 2, floor + 14], [x0 + bw / 2, floor + 22], [bx + bw / 2, floor + 22], [bx + bw / 2, floor + 14]], col.s[2], 1.5); ctx.setLineDash([]); text(ctx, 's', (x0 + bx + bw) / 2, floor + 34, { color: col.s[2], size: 13, weight: 700, align: 'center' }); }
    ctx.fillStyle = col.soft; ctx.fillRect(bx, floor - 34, bw, 34); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, floor - 34, bw, 34);
    text(ctx, 'm', bx + bw / 2, floor - 17, { color: col.ink, size: 13, weight: 700, align: 'center' });
    if (step >= 1 && step <= 3) { arrow(ctx, bx - 46, floor - 17, bx - 2, floor - 17, col.s[0], 3); text(ctx, 'F', bx - 24, floor - 30, { color: col.s[0], size: 13, weight: 700, align: 'center' }); }
    if (step >= 1) { const sp = Math.min(1, ph) * 60; if (sp > 4) { arrow(ctx, bx + bw + 4, floor - 40, bx + bw + 4 + sp * 0.45, floor - 40, col.s[3], 2); text(ctx, 'v', bx + bw + 8 + sp * 0.45, floor - 40, { color: col.s[3], size: 12, weight: 700 }); } }
    // equation card
    ctx.fillStyle = col.soft; ctx.fillRect(14, floor + 48, w - 28, 56); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(14, floor + 48, w - 28, 56);
    text(ctx, EQ[step], w / 2, floor + 76, { color: step >= 4 ? col.s[2] : col.ink, size: 14, weight: 700, align: 'center' });
    // KE bar for last steps
    const k = step >= 5 ? Math.min(1, t * 0.8 % 2) : 0; if (step >= 5) { ctx.fillStyle = col.line; ctx.fillRect(14, h - 28, w - 28, 10); ctx.fillStyle = col.s[2]; ctx.fillRect(14, h - 28, (w - 28) * Math.min(1, k), 10); text(ctx, 'work done → kinetic energy gained', 14, h - 38, { color: col.muted, size: 10.5 }); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
