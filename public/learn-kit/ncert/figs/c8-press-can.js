// Class 8 Pressure (step player): air pressure can crush a can. Steam pushes the air out of a can with a little
// water; the can is sealed and cooled, the steam turns back to water, the pressure inside drops, and the air pressure
// outside (about 100 000 Pa, a weight of 10 tonnes on each square metre) squeezes the can flat.
import { canvas, text, title, dot, line, arrow, loop, font } from '../../kit.js';

const NAMES = ['Heat the can', 'Seal and flip', 'Cool it', 'Crushed'];
const CAP = ['A little water boils in the open can. Steam pushes most of the air out.', 'Quickly turn the can upside down into cold water: nothing can get in or out.', 'The steam inside turns back to water drops. Few particles are left, so the pressure inside falls.', 'Air outside pushes with far more pressure than the air inside, and the can is crushed.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A can heated, sealed in cold water and crushed by outside air pressure' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, NAMES[step], col);
    const cx = w / 2, by = h * 0.6, cw = 64, ch = 96, sq = step === 3 ? 0.55 : step === 2 ? 0.85 + 0.15 * Math.max(0, 1 - (t % 4) / 3) : 1;
    const W = cw * (step === 3 ? 0.75 : 1), top = step === 0 ? by - ch : by - ch;
    if (step >= 1) { ctx.fillStyle = col.soft; ctx.fillRect(10, by - 22, w - 20, h - by + 12 - 40 + 28); text(ctx, 'cold water', 16, by + 12, { color: col.muted, size: 10.5 }); }
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(160,160,160,0.18)';
    ctx.beginPath(); ctx.roundRect(cx - W / 2, top + (1 - sq) * 20, W, ch * (step === 3 ? 0.7 : 1) , step === 3 ? 4 : 6); ctx.fill(); ctx.stroke(); ctx.restore();
    const inside = step === 0 ? 14 : step === 1 ? 14 : step === 2 ? 4 : 4;
    for (let i = 0; i < inside; i++) { const px = cx - W / 2 + 8 + ((i * 37 + Math.sin(t * 3 + i) * 5) % (W - 16)), py = top + 22 + (i * 53 % (ch - 40)) + Math.cos(t * 3.5 + i) * 4; dot(ctx, px, py, 3, step === 2 || step === 3 ? col.s[0] : col.s[1]); }
    if (step === 0) for (let k = 0; k < 4; k++) { const f = (t * 0.6 + k / 4) % 1; dot(ctx, cx - 14 + k * 10, top - f * 40, 4, col.muted); }
    if (step === 0) { for (let k = 0; k < 5; k++) line(ctx, [[cx - 30 + k * 15, by + 30 + 8], [cx - 30 + k * 15 + 4, by + 30 - 2 - (k % 2) * 6]], col.s[1], 3); text(ctx, 'flame', cx, by + 44, { color: col.s[1], size: 10.5, align: 'center' }); }
    if (step >= 2) { const n = step === 3 ? 7 : 4; const a = step === 3 ? 1 : 0.4 + 0.3 * Math.sin(t * 3); [[-1], [1]].forEach(([d]) => { arrow(ctx, cx + d * (W / 2 + 42), by - 46, cx + d * (W / 2 + 4), by - 46, col.s[3], 2 + a * 2, 8); arrow(ctx, cx + d * (W / 2 + 42), by - 20, cx + d * (W / 2 + 4), by - 20, col.s[3], 2 + a * 2, 8); }); text(ctx, 'outside air pushes in', cx, by - 124, { color: col.s[3], size: 11, weight: 700, align: 'center' }); text(ctx, 'little inside', cx, by - 106, { color: col.s[0], size: 10.5, align: 'center' }); }
    ctx.font = font(11, 400);
    const L = []; let cur = ''; CAP[step].split(' ').forEach((wd) => { const s2 = cur ? cur + ' ' + wd : wd; if (ctx.measureText(s2).width > w - 24) { L.push(cur); cur = wd; } else cur = s2; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 10 - (L.length - 1 - i) * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 3); t = 0; cv.redraw(); } };
}
