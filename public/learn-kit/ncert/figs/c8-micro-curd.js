// Class 8 Science, Microscopic world (step player): how milk becomes curd. A spoon of curd carries Lactobacillus
// bacteria; in warm milk they multiply and turn the milk sugar (lactose) into lactic acid, which makes the milk proteins
// clump into curd. Warmth (about 30 to 40 degrees C) is needed. The microbes are far too small to see; they are drawn big.
import { canvas, text, title, dot, line, rng, loop } from '../../kit.js';

const CAP = ['Boil and cool the milk until it is just warm. Too hot would kill the helpful bacteria.', 'Stir in a spoonful of old curd. It carries a few Lactobacillus bacteria.', 'Cover and keep it warm. The bacteria feed on milk sugar and divide again and again.', 'They make lactic acid. The acid makes the milk proteins clump together and the milk starts to set.', 'After some hours: curd! It tastes sour because of the lactic acid. Keep it in the fridge to slow the bacteria.'];
export default function (host) {
  let k = 0, t = 0;
  const R = rng(9), P = Array.from({ length: 70 }, () => [R(), R(), R() * 6.28]);
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A bowl of milk where bacteria multiply and make it into curd' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['Warm milk', 'Add a spoon of curd', 'Bacteria multiply', 'Lactic acid is made', 'Curd is ready'][k], col);
    const bx = w * 0.15, bw = w * 0.7, by = 60, bh = h * 0.42;
    ctx.fillStyle = k === 4 ? '#f4efe2' : '#fff'; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + bw, by); ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw / 2, by + bh); ctx.quadraticCurveTo(bx, by + bh, bx, by); ctx.closePath(); ctx.fill(); ctx.stroke();
    if (k === 0) text(ctx, '35 °C', bx + bw / 2, by + bh / 2 - 8, { color: col.s[1], size: 14, weight: 700, align: 'center' });
    if (k === 1) { line(ctx, [[bx + bw * 0.5, by - 30], [bx + bw * 0.5, by + 14]], col.muted, 6); dot(ctx, bx + bw * 0.5, by - 34, 9, '#f4efe2', col.ink); text(ctx, 'curd', bx + bw * 0.5 + 16, by - 34, { color: col.ink, size: 11 }); }
    const n = [0, 4, 18, 40, 70][k];
    for (let i = 0; i < n; i++) { const x = bx + 12 + P[i][0] * (bw - 24), y = by + 12 + P[i][1] * (bh * 0.62) + Math.sin(t * 2 + i) * 2; ctx.save(); ctx.translate(x, y); ctx.rotate(P[i][2]); ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.ellipse(0, 0, 6, 2.6, 0, 0, 7); ctx.fill(); ctx.restore(); }
    if (k === 3) for (let i = 0; i < 8; i++) text(ctx, 'acid', bx + 20 + (i * 53 + t * 8) % (bw - 40), by + 20 + (i * 37) % (bh * 0.6), { color: col.bad, size: 9.5 });
    if (k >= 2) text(ctx, 'bacteria drawn 100 times bigger', bx + bw / 2, by + bh + 16, { color: col.muted, size: 10, align: 'center' });
    ctx.font = '400 11px system-ui'; const L = []; let cur = '';
    CAP[k].split(' ').forEach((wd) => { const tt = cur ? cur + ' ' + wd : wd; if (ctx.measureText(tt).width > w - 24) { L.push(cur); cur = wd; } else cur = tt; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 12 - (L.length - 1 - i) * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { k = Math.min(Math.max(0, i), 4); cv.redraw(); } };
}
