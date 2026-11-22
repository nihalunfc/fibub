// Class 12 Biology, Biodiversity and Conservation (step player): an alien species invasion. The Nile perch, a large predatory fish, was introduced into
// Lake Victoria in East Africa to improve the fishery. It ate the lake's cichlid fishes and, together with other changes, the lake lost more than 200 native
// cichlid species. Illustrative counts show the idea. Water hyacinth (Eichhornia) in Indian water bodies and Parthenium weed are other invaders.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A lake with native fishes and the effect of an introduced predator, step by step' });
  const TITLES = ['1. A lake rich in native fishes', '2. A new fish is introduced', '3. The newcomer eats the natives', '4. Many species disappear', '5. The food web is changed for good'];
  const NATIVE = [18, 18, 11, 3, 1], ALIEN = [0, 1, 4, 8, 8];
  const NOTE = ['The lake holds hundreds of native cichlid fish species found nowhere else (endemic).', 'The Nile perch, a big predator, is put in to improve the fishery. It has no natural enemy in the lake.', 'The perch eats the small native fishes, which have no defence against this kind of predator. Its numbers explode.', 'Hundreds of native species decline and many go extinct. Alien species invasions are one of the four main causes of biodiversity loss.', 'The loss of algae-eating fish is followed by algal blooms and low oxygen. Such changes are very hard to reverse.'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[st], col) + 8, ly = top + 4, lh = 120;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fillRect(14, ly, w - 28, lh); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(14, ly, w - 28, lh);
    const fish = (x, y, c, s) => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, 7 * s, 3.5 * s, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 6 * s, y); ctx.lineTo(x - 11 * s, y - 4 * s); ctx.lineTo(x - 11 * s, y + 4 * s); ctx.fill(); };
    for (let i = 0; i < NATIVE[st]; i++) fish(30 + (i % 9) * ((w - 70) / 8) + (Math.floor(i / 9) * 14), ly + 22 + Math.floor(i / 9) * 40 + (i % 3) * 8, col.s[(i % 4) + 1], 1);
    for (let i = 0; i < ALIEN[st]; i++) fish(40 + (i % 4) * 70, ly + 40 + (i % 3) * 22, col.bad, 2.2);
    if (st === 4) for (let i = 0; i < 20; i++) dot(ctx, 24 + (i * 37) % (w - 48), ly + 8 + (i * 19) % (lh - 16), 3, col.good);
    const x0 = 24, bw = w - 48; text(ctx, 'native species left (of 200+)', x0, ly + lh + 18, { color: col.muted, size: 10.5, weight: 700 });
    const pct = [100, 100, 60, 15, 5][st]; ctx.fillStyle = col.line; ctx.fillRect(x0, ly + lh + 26, bw, 14); ctx.fillStyle = col.s[1]; ctx.fillRect(x0, ly + lh + 26, bw * pct / 100, 14); text(ctx, pct + ' %', x0 + bw * pct / 100 + 6, ly + lh + 33, { color: col.ink, size: 11, weight: 700 });
    NOTE[st].match(/.{1,52}(\s|$)/g).forEach((ln, i) => text(ctx, ln.trim(), 14, ly + lh + 66 + i * 15, { color: col.ink, size: 11 }));
    void arrow; void line;
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 4); cv.redraw(); } };
}
