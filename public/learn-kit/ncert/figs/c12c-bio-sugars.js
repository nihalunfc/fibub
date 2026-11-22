// Class 12 Chemistry, Biomolecules: carbohydrates. Pick a sugar to see what it is made of, how the units are joined (glycosidic link), whether it is reducing, and what happens on hydrolysis.
// Monosaccharides: glucose, fructose, galactose. Disaccharides: sucrose = glucose + fructose (alpha-1,beta-2, non-reducing), maltose = 2 glucose (alpha-1,4, reducing), lactose = galactose + glucose (beta-1,4, reducing).
// Polysaccharides: starch (amylose alpha-1,4 and amylopectin with alpha-1,6 branches), glycogen (more branched), cellulose (beta-1,4, straight chains).
import { canvas, text, title, row, choice, button, readout, loop } from '../../kit.js';

const S = {
  glu: ['glucose', 'monosaccharide (aldohexose)', [['G', 0]], 'free', 'reducing', 'Grape sugar; blood sugar (about 5 mmol/L fasting).'],
  fru: ['fructose', 'monosaccharide (ketohexose)', [['F', 1]], 'free', 'reducing', 'Fruit sugar, sweetest sugar; in honey.'],
  suc: ['sucrose', 'disaccharide: glucose + fructose, α-1,β-2 link', [['G', 0], ['F', 1]], 'both anomeric carbons used', 'NON-reducing', 'Table sugar from sugarcane and beet. Hydrolysis (invert sugar) gives a glucose–fructose mixture.'],
  mal: ['maltose', 'disaccharide: glucose + glucose, α-1,4 link', [['G', 0], ['G', 0]], 'one free anomeric carbon', 'reducing', 'Malt sugar, from the breakdown of starch by amylase.'],
  lac: ['lactose', 'disaccharide: galactose + glucose, β-1,4 link', [['Ga', 2], ['G', 0]], 'one free anomeric carbon', 'reducing', 'Milk sugar. People without the enzyme lactase cannot digest it (lactose intolerance).'],
  sta: ['starch', 'polysaccharide: glucose, α-1,4 chains with α-1,6 branches', [['G', 0], ['G', 0], ['G', 0], ['G', 0], ['G', 0], ['G', 0]], 'ends only', 'non-reducing', 'Plant food store in rice, wheat, potato. Iodine turns it blue-black.'],
  cel: ['cellulose', 'polysaccharide: glucose, β-1,4 straight chains', [['G', 0], ['G', 0], ['G', 0], ['G', 0], ['G', 0], ['G', 0]], 'ends only', 'non-reducing', 'Plant cell walls, cotton, paper. Humans lack the enzyme to digest the β-1,4 link.'],
};
export default function (host) {
  let k = 'suc', hyd = 0, goal = 0;
  const cv = canvas(host, { aspect: 0.8, max: 360, min: 290, label: 'Sugar units joined by glycosidic links, which break apart on hydrolysis' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'sugar', Object.entries(S).map(([id, o]) => [id, o[0]]), k, (v) => { k = v; hyd = goal = 0; go(); });
  button(ctl, 'Add water and enzyme (hydrolysis)', () => { goal = 1; });
  button(ctl, 'Reset', () => { goal = 0; });
  loop(host, (dt) => { const d = goal - hyd; if (Math.abs(d) > 0.001) { hyd += Math.sign(d) * Math.min(Math.abs(d), dt * 0.7); cv.redraw(); } });
  const go = () => { const o = S[k]; ro.textContent = `${o[0]}: ${o[1]}. ${o[4] === 'reducing' ? 'Reducing: it has a free anomeric carbon (hemiacetal), so the ring can open to a CHO group and reduce Tollens’ and Fehling’s reagents.' : o[4] === 'NON-reducing' ? 'Non-reducing: both anomeric carbons are tied up in the link, so no ring can open.' : 'Starch and cellulose are very long chains with only one free end, so they do not reduce Fehling’s solution.'} ${o[5]}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const o = S[k], top = title(ctx, `${o[0]}: ${o[1].split(':')[0]}`, col), n = o[2].length, cy = top + (h - top) * 0.36;
    const sp = Math.min(60, (w - 40) / n), x0 = w / 2 - sp * (n - 1) / 2, r = Math.min(22, sp * 0.4);
    const C = [col.s[0], col.s[1], col.s[2]];
    o[2].forEach(([lab, ci], i) => { const dx = (i - (n - 1) / 2) * hyd * 12, x = x0 + sp * i + dx, y = cy + (i % 2 ? 1 : -1) * 0 + hyd * (i % 2 ? 14 : -4); if (i > 0 && hyd < 0.98) { ctx.strokeStyle = col.ink; ctx.globalAlpha = 1 - hyd; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - sp + r * 0.7 + (i - 1 - (n - 1) / 2 + 0) * 0, cy); ctx.lineTo(x - r * 0.7, y); ctx.stroke(); ctx.globalAlpha = 1; if (hyd < 0.5) text(ctx, k === 'cel' ? 'β' : 'α', x - sp / 2, cy - 12, { color: col.muted, size: 10, align: 'center' }); } ctx.fillStyle = col.panel; ctx.strokeStyle = C[ci]; ctx.lineWidth = 3; ctx.beginPath(); for (let j = 0; j < 6; j++) { const a = Math.PI / 6 + j * Math.PI / 3; ctx[j ? 'lineTo' : 'moveTo'](x + r * Math.cos(a - Math.PI / 6), y + r * Math.sin(a - Math.PI / 6)); } ctx.closePath(); ctx.fill(); ctx.stroke(); text(ctx, lab, x, y, { color: col.ink, size: 11, weight: 700, align: 'center' }); });
    if (hyd > 0.2 && n > 1) text(ctx, 'H₂O + enzyme splits each glycosidic link', w / 2, cy + r + 34 + 0, { color: col.s[3], size: 11, weight: 700, align: 'center' });
    const ys = cy + r + 60; text(ctx, 'link: ' + (n > 1 ? { suc: 'α-1,β-2 (both C1/C2 tied up)', mal: 'α-1,4', lac: 'β-1,4', sta: 'α-1,4 (and α-1,6 at branches)', cel: 'β-1,4 (straight, strong fibres)' }[k] : 'none: one unit'), w / 2, ys, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    text(ctx, 'anomeric carbon: ' + o[3], w / 2, ys + 20, { color: col.muted, size: 11, align: 'center' });
    const red = o[4] !== 'NON-reducing' && o[4] !== 'non-reducing'; ctx.fillStyle = red ? col.s[1] : col.s[3]; ctx.globalAlpha = 0.18; ctx.fillRect(w / 2 - 80, ys + 34, 160, 26); ctx.globalAlpha = 1; text(ctx, o[4].toLowerCase() + ' sugar', w / 2, ys + 47, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
    text(ctx, 'G glucose   F fructose   Ga galactose', w / 2, h - 12, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
