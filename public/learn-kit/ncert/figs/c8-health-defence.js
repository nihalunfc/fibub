// Class 8 Science, Health (step player): the body's layers of defence against germs: skin and mucus (barriers),
// then white blood cells that eat germs, then antibodies that tag them, then memory so the next attack is faster.
import { canvas, text, title, dot, line, arrow, loop } from '../../kit.js';

const NAMES = ['Skin and mucus', 'Stomach acid and tears', 'White blood cells', 'Antibodies', 'Memory'];
const CAP = ['Skin is a tough wall. Mucus in the nose traps germs and tiny hairs sweep them out.', 'Tears, saliva and strong stomach acid kill many germs that get past the first wall.', 'If germs get in, white blood cells find them and swallow them. Pus is a heap of dead white cells.', 'Special white cells make antibodies that stick to one kind of germ and mark it for destruction.', 'Some cells remember the germ. Next time the answer is quick, which is why you rarely get measles twice.'];
export default function (host) {
  let k = 0, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Layers of defence of the body against germs' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, NAMES[k], col);
    const top = 46, bh = h * 0.5;
    const layers = [col.s[2], col.s[3], col.s[4], col.s[5], col.s[6]];
    for (let i = 0; i < 5; i++) { ctx.fillStyle = layers[i]; ctx.globalAlpha = i <= k ? 0.5 : 0.12; ctx.fillRect(14, top + i * (bh / 5), w - 28, bh / 5 - 3); ctx.globalAlpha = 1; text(ctx, NAMES[i], 22, top + i * (bh / 5) + bh / 10, { color: i === k ? col.ink : col.muted, size: 11, weight: i === k ? 700 : 400 }); }
    const gx = w - 50, gy = top + k * (bh / 5) + bh / 10 - 1 + Math.sin(t * 4) * 3;
    dot(ctx, gx, gy - (k ? 0 : 0), 9, col.bad, col.ink);
    if (k === 0) { line(ctx, [[gx - 16, gy + 2], [gx + 16, gy + 2]], col.ink, 3); text(ctx, 'blocked', gx, gy - 17, { color: col.good, size: 10, align: 'center' }); }
    if (k === 2) dot(ctx, gx - 24 + (t % 2) * 9, gy, 12, col.panel, col.s[4]);
    if (k === 3) for (let i = 0; i < 3; i++) { line(ctx, [[gx - 26 - i * 8, gy - 6], [gx - 14, gy]], col.s[5], 2); }
    if (k === 4) text(ctx, 'remembered', gx - 4, gy - 17, { color: col.s[6], size: 10, weight: 700, align: 'center' });
    ctx.font = '400 11px system-ui'; const L = []; let cur = '';
    CAP[k].split(' ').forEach((wd) => { const tt = cur ? cur + ' ' + wd : wd; if (ctx.measureText(tt).width > w - 24) { L.push(cur); cur = wd; } else cur = tt; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, top + bh + 22 + i * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { k = Math.min(Math.max(0, i), 4); t = 0; cv.redraw(); } };
}
