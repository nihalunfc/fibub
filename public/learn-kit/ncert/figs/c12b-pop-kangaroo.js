// Class 12 Biology, Organisms and Populations (step player): how a kangaroo rat lives in the desert without drinking. It eats dry seeds, makes water by
// oxidising fat in its body (about 1.07 g of water from each gram of fat), passes very concentrated urine and cools the air it breathes out in its nose
// so less water vapour is lost. Its small daily water budget then balances without drinking. The numbers are round figures for the idea.
import { canvas, text, title, line } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A water budget for a desert kangaroo rat: water made from fat in, and water lost in urine and breath out' });
  const TITLES = ['1. A desert, no water to drink', '2. Water from fat', '3. Concentrated urine', '4. Less water lost by breathing', '5. The budget balances'];
  const IN = [0, 10, 10, 10, 10], URINE = [0, 0, 4, 4, 4], BREATH = [0, 0, 0, 6, 6];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[st], col) + 14, bw = (w - 60) / 3, base = top + 150, sc = 11;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; line(ctx, [[14, base], [w - 14, base]], col.muted, 1.5);
    [['water made from fat', IN[st], col.s[0]], ['lost in urine', URINE[st], col.s[2]], ['lost in breath', BREATH[st], col.s[3]]].forEach(([n, v, c], i) => { const x = 22 + i * (bw + 8); ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(x, base - v * sc, bw, Math.max(1, v * sc)); ctx.globalAlpha = 1; text(ctx, v + ' units', x + bw / 2, base - v * sc - 8, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, n, x + bw / 2, base + 14, { color: col.ink, size: 10, weight: 700, align: 'center' }); });
    const bal = IN[st] - URINE[st] - BREATH[st];
    text(ctx, st === 4 ? `10 in, ${URINE[st]} + ${BREATH[st]} out: balanced` : st === 0 ? 'Nothing to drink: the animal must make its own water' : `Balance: ${IN[st]} − ${URINE[st] + BREATH[st]} = ${bal}`, w / 2, base + 36, { color: st === 4 ? col.good : bal > 0 ? col.s[0] : col.muted, size: 12, weight: 800, align: 'center' });
    const NOTES = ['Kangaroo rats of the Arizona desert live on dry seeds and never drink. The same ideas help desert plants and animals everywhere, like the Thar.', 'Oxidising fat in the body releases water: 1 g of fat gives about 1.07 g of water.', 'Its kidneys pass a very concentrated urine, so little water leaves with the waste.', 'Air breathed out in the nose is cooled, so water vapour condenses and is kept.', 'Water gained equals water lost, so it can live without drinking.'];
    NOTES[st].match(/.{1,50}(\s|$)/g).forEach((ln, i) => text(ctx, ln.trim(), w / 2, base + 62 + i * 15, { color: col.ink, size: 11, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 4); cv.redraw(); } };
}
