// Class 11 Structural Organisation in Animals: the earthworm (Pheretima), the first 26 of its 100-120 segments. Switch the system to see which segments carry which organ.
// Digestive: mouth, pharynx, oesophagus, gizzard, stomach, intestine. Circulatory: dorsal and ventral vessels with hearts. Reproductive: spermathecae, testes, ovaries, clitellum.
import { canvas, text, title, row, choice } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

const SYS = {
  dig: ['Digestive', [[1, 3, 'mouth + buccal cavity'], [4, 4, 'pharynx'], [5, 7, 'oesophagus'], [8, 9, 'gizzard'], [9, 14, 'stomach'], [15, 26, 'intestine →']], 'Soil goes in through the mouth. The muscular pharynx sucks it, the gizzard grinds it with small stones, the stomach (with calciferous glands) neutralises it and the long intestine absorbs food. A fold called the typhlosole (from segment 26) adds surface area.'],
  cir: ['Circulatory', [[1, 26, 'dorsal vessel (blood runs forwards)'], [7, 7, 'heart'], [9, 9, 'heart'], [12, 13, 'hearts']], 'A closed system: blood stays in vessels. The dorsal vessel carries blood forward, the ventral vessel carries it back, and the hearts (in segments 7, 9, 12 and 13) pump it round. The blood has red haemoglobin in the plasma, not in cells.'],
  rep: ['Reproductive', [[6, 9, 'spermathecae'], [10, 11, 'testes'], [12, 13, 'ovaries'], [14, 16, 'clitellum']], 'Earthworms are hermaphrodite: each has both testes and ovaries. Two worms swap sperm (stored in spermathecae), then the clitellum makes a cocoon in which the eggs develop. Development is direct: young worms, no larva.'],
};
export default function (host) {
  let k = 'dig';
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'The first 26 segments of an earthworm with the organs of the digestive, circulatory or reproductive system marked' });
  const ctl = row(host);
  choice(ctl, 'System', Object.entries(SYS).map(([v, a]) => [v, a[0]]), k, (v) => { k = v; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `Earthworm: ${SYS[k][0].toLowerCase()} system`, col), fy = footer(ctx, w, h, col, SYS[k][2]);
    const x0 = 16, W = w - 32, sw = W / 26, by = Math.max(t0 + 50, Math.round((t0 + fy) / 2 - 50)), bh = 34, cyb = by + bh / 2;
    ctx.fillStyle = col.s[4] + '55'; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(x0, by, W + 6, bh, 15); ctx.fill(); ctx.stroke();
    for (let i = 1; i < 26; i++) { ctx.beginPath(); ctx.moveTo(x0 + i * sw, by + 3); ctx.lineTo(x0 + i * sw, by + bh - 3); ctx.strokeStyle = col.s[4] + '99'; ctx.stroke(); }
    [1, 5, 10, 15, 20, 25].forEach((n) => text(ctx, String(n), x0 + (n - 0.5) * sw, by - 8, { color: col.muted, size: 10, align: 'center', fit: false }));
    text(ctx, 'segment number (front of the worm on the left)', x0, by - 24, { color: col.muted, size: 10, fit: false });
    const seg = (a, b) => [x0 + (a - 1) * sw, x0 + b * sw];
    const cs = [col.s[0], col.s[3], col.s[2], col.s[5], col.s[1], col.s[6]];
    SYS[k][1].forEach(([a, b, name], i) => {
      const [xa, xb] = seg(a, b), c = cs[i % cs.length];
      if (k === 'cir' && name.startsWith('dorsal')) { ctx.strokeStyle = col.s[4]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(xa, by + 8); ctx.lineTo(xb, by + 8); ctx.stroke(); ctx.strokeStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(xa, by + bh - 8); ctx.lineTo(xb, by + bh - 8); ctx.stroke(); text(ctx, 'ventral vessel (blood backwards)', xa + 4, by + bh + 14, { color: col.s[3], size: 10, weight: 700, fit: false }); text(ctx, 'dorsal vessel (blood forwards)', xa + 4, by + bh + 28, { color: col.s[4], size: 10, weight: 700, fit: false }); return; }
      if (k === 'cir') { ellipse(ctx, (xa + xb) / 2, cyb, Math.max(4, (xb - xa) / 2), 8, col.s[4], col.panel, 1.5); text(ctx, name, (xa + xb) / 2, by + bh + 46 + (i % 2) * 14, { color: col.ink, size: 10, align: 'center', fit: false }); return; }
      ctx.fillStyle = c + 'cc'; ctx.fillRect(xa, by + 4, xb - xa, bh - 8); ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.strokeRect(xa, by + 4, xb - xa, bh - 8);
      const ly = by + bh + 16 + (i % 3) * 16;
      ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo((xa + xb) / 2, by + bh); ctx.lineTo((xa + xb) / 2, ly - 6); ctx.stroke();
      text(ctx, `${name} (${a === b ? a : a + '-' + (b >= 26 && k === 'dig' ? 'end' : b)})`, Math.max(x0 + 4, Math.min((xa + xb) / 2, x0 + W - 4)), ly, { color: col.ink, size: 10, weight: 700, align: 'center', halo: col.panel });
    });
    if (k === 'cir') text(ctx, 'hearts at segments 7, 9, 12, 13', w / 2, by + bh + 74, { color: col.muted, size: 10, align: 'center' });
  };
}
