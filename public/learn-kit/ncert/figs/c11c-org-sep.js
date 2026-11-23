// Class 11 Chemistry, Organic Chemistry basics: choosing a purification method. Pick a mixture; the figure compares the property that differs (solubility, volatility, boiling points, partition) and names the method.
// Crystallisation (solubility differs with temperature), sublimation (one solid sublimes), simple distillation (boiling points differ by more than ~40 K), fractional distillation (differ by less),
// distillation under reduced pressure (decomposes before boiling), steam distillation (immiscible with water, volatile in steam), differential extraction (solute prefers an organic solvent), chromatography (adsorption).
import { canvas, text, title, choice, readout, row } from '../../kit.js';

const M = {
  sug: { n: 'sugar + common salt', a: ['sugar', 'dissolves well in hot ethanol', 7], b: ['salt', 'hardly dissolves in ethanol', 1], meth: 'Crystallisation', why: 'Dissolve in a hot solvent that dissolves one component well; the less soluble one crystallises first on cooling.', prop: 'solubility in hot ethanol' },
  cam: { n: 'camphor + salt', a: ['camphor', 'sublimes on heating', 9], b: ['salt', 'does not sublime', 0.5], meth: 'Sublimation', why: 'Heat gently: camphor turns directly to vapour and re-forms as solid on a cold surface; the salt stays behind.', prop: 'tendency to sublime' },
  chl: { n: 'chloroform + aniline', a: ['chloroform', 'b.p. 334 K', 3.34], b: ['aniline', 'b.p. 457 K', 4.57], meth: 'Simple distillation', why: 'The boiling points differ by about 120 K, so chloroform boils off first and is condensed and collected.', prop: 'boiling point' },
  ace: { n: 'acetone + methanol', a: ['acetone', 'b.p. 329 K', 3.29], b: ['methanol', 'b.p. 338 K', 3.38], meth: 'Fractional distillation', why: 'The boiling points are only 9 K apart; a fractionating column repeats evaporation and condensation to separate them.', prop: 'boiling point' },
  gly: { n: 'glycerol from spent lye', a: ['glycerol', 'b.p. 563 K, decomposes', 5.63], b: ['water + salts', 'lower b.p.', 3.7], meth: 'Distillation under reduced pressure', why: 'Lowering the pressure lowers the boiling point, so glycerol distils before it can decompose.', prop: 'boiling point at 1 atm' },
  ani: { n: 'aniline in water', a: ['aniline', 'volatile in steam, immiscible', 8], b: ['impurity', 'not steam volatile', 0.5], meth: 'Steam distillation', why: 'Steam carries the immiscible compound over at a temperature below 373 K (it boils with the water); the vapours are condensed and aniline is separated from the water.', prop: 'volatility in steam' },
  eth: { n: 'benzoic acid in water', a: ['benzoic acid', 'far more soluble in ether', 9], b: ['water', 'little benzoic acid', 1.5], meth: 'Differential extraction', why: 'Shake with ether in a separating funnel. The compound moves into the organic layer, which is separated and evaporated.', prop: 'solubility in the solvent' },
  pig: { n: 'plant pigments', a: ['carotene', 'sticks weakly, Rf high', 9], b: ['chlorophyll b', 'sticks strongly, Rf low', 4], meth: 'Chromatography', why: 'Components that differ in how strongly they cling to the stationary phase move at different speeds with the solvent.', prop: 'adsorption on the stationary phase' },
};
export default function (host) {
  let k = 'sug';
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A mixture with its two components and the purification method that suits it' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'mixture', Object.entries(M).map(([a, d]) => [a, d.n]), k, (v) => { k = v; go(); });
  const go = () => { ro.textContent = `${M[k].meth}: ${M[k].why}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const d = M[k], top = title(ctx, d.n, col) + 16, bw = w - 120;
    text(ctx, 'what differs: ' + d.prop, 14, top, { color: col.muted, size: 10.5 });
    [d.a, d.b].forEach((c, i) => { const y = top + 22 + i * 62; text(ctx, c[0], 14, y, { color: col.ink, size: 12.5, weight: 700 }); ctx.fillStyle = col.line; ctx.fillRect(14, y + 12, bw, 16); ctx.fillStyle = i ? col.s[0] : col.s[3]; ctx.globalAlpha = 0.85; ctx.fillRect(14, y + 12, bw * Math.min(1, c[2] / 10), 16); ctx.globalAlpha = 1; text(ctx, c[1], 14, y + 42, { color: col.muted, size: 10.5 }); });
    const by = top + 160; ctx.fillStyle = col.soft; ctx.fillRect(10, by, w - 20, 52); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.strokeRect(10, by, w - 20, 52);
    text(ctx, 'Method: ' + d.meth, w / 2, by + 18, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, 'the bigger the difference in this property, the easier the split', w / 2, by + 38, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
