// Class 8 Science, Health (step player): how a vaccine trains the body. A vaccine holds a harmless piece or weakened
// form of a germ. White blood cells learn to make antibodies against it and some become memory cells that stay for
// years. When the real germ comes, the response is fast and strong, so you do not get ill (or only mildly).
import { canvas, text, title, dot, line, arrow, loop } from '../../kit.js';

const CAP = ['A harmless piece of the germ (or a weakened germ) is given in a vaccine, often by an injection.', 'White blood cells meet it and spot that it is foreign. You do not fall ill because it is harmless.', 'The body makes antibodies and keeps memory cells that remember the germ, sometimes for years.', 'Later the real germ enters. Memory cells recognise it at once.', 'Antibodies flood in quickly and destroy the germ before it can make you ill.'];
export default function (host) {
  let k = 0, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'How a vaccine trains white blood cells to fight a germ' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const germ = (ctx, x, y, r, c, ink) => { dot(ctx, x, y, r, c, ink); for (let a = 0; a < 8; a++) line(ctx, [[x + Math.cos(a * 0.785) * r, y + Math.sin(a * 0.785) * r], [x + Math.cos(a * 0.785) * (r + 5), y + Math.sin(a * 0.785) * (r + 5)]], ink, 1.5); };
  const ab = (ctx, x, y, c) => { line(ctx, [[x - 4, y - 7], [x, y], [x + 4, y - 7]], c, 2.2); line(ctx, [[x, y], [x, y + 8]], c, 2.2); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['Vaccine given', 'White cells notice', 'Antibodies and memory', 'Real germ arrives', 'Fast defence'][k], col);
    const cy = h * 0.42, bob = Math.sin(t * 3) * 3;
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(10, 44, w - 20, h * 0.58 - 24, 14); ctx.fill(); ctx.stroke();
    const wc = (x, y, c) => { dot(ctx, x, y, 17, col.panel, c); dot(ctx, x, y, 7, c); };
    if (k === 0) { germ(ctx, w * 0.5, cy + bob, 10, col.s[3], col.ink); text(ctx, 'weakened germ', w * 0.5, cy + 36, { color: col.muted, size: 10.5, align: 'center' }); line(ctx, [[w * 0.5 + 40, 60], [w * 0.5 + 12, cy - 20]], col.ink, 5); }
    if (k === 1) { germ(ctx, w * 0.35, cy, 10, col.s[3], col.ink); wc(w * 0.65, cy + bob, col.s[2]); arrow(ctx, w * 0.6, cy, w * 0.42, cy, col.s[2], 2, 7); text(ctx, 'spots it', w * 0.5, cy - 22, { color: col.ink, size: 11, align: 'center' }); }
    if (k === 2) { wc(w * 0.3, cy, col.s[2]); wc(w * 0.7, cy, col.s[4]); text(ctx, 'makes antibodies', w * 0.3, cy + 32, { color: col.ink, size: 10.5, align: 'center' }); text(ctx, 'memory cell', w * 0.7, cy + 32, { color: col.ink, size: 10.5, align: 'center' }); for (let i = 0; i < 4; i++) ab(ctx, w * 0.3 + (i - 1.5) * 16, cy - 36 + Math.sin(t * 3 + i) * 3, col.s[2]); }
    if (k === 3) { wc(w * 0.7, cy, col.s[4]); germ(ctx, w * 0.22 + (t % 3) * 8, cy, 10, col.bad, col.ink); text(ctx, 'real germ', w * 0.25, cy + 34, { color: col.bad, size: 10.5, align: 'center' }); text(ctx, 'remembers!', w * 0.7, cy - 28, { color: col.s[4], size: 11, weight: 700, align: 'center' }); }
    if (k === 4) { const n = Math.min(10, Math.floor((t % 4) * 4)); for (let i = 0; i < n; i++) ab(ctx, w * 0.3 + (i % 5) * 20, cy - 20 + Math.floor(i / 5) * 20, col.s[2]); germ(ctx, w * 0.5, cy + 4, 10, n >= 9 ? col.line : col.bad, col.ink); text(ctx, n >= 9 ? 'germ destroyed' : 'antibodies arriving', w * 0.5, cy + 40, { color: col.good, size: 11, weight: 700, align: 'center' }); }
    ctx.font = '400 11px system-ui'; const L = []; let cur = '';
    CAP[k].split(' ').forEach((wd) => { const tt = cur ? cur + ' ' + wd : wd; if (ctx.measureText(tt).width > w - 24) { L.push(cur); cur = wd; } else cur = tt; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h * 0.68 + 14 + i * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { k = Math.min(Math.max(0, i), 4); t = 0; cv.redraw(); } };
}
