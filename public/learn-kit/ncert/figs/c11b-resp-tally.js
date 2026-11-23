// Class 11 Biology, Respiration in Plants: ATP yield per glucose by stage. Aerobic respiration (glycolysis, link reaction, Krebs cycle, electron transport) against lactic acid and alcohol fermentation.
// "Textbook" counts 3 ATP per NADH and 2 per FADH2 (38 in all); "modern" counts 2.5 and 1.5, and about 2 ATP are spent moving things across the mitochondrial membranes (about 30 in all).
import { canvas, text, title, axes, row, choice, readout } from '../../kit.js';

export default function (host) {
  let mode = 'aer', count = 'old';
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Stacked bar of ATP made per glucose in aerobic respiration and fermentation' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Pathway', [['aer', 'With O₂'], ['lac', 'Lactic acid'], ['alc', 'Alcohol']], mode, (v) => { mode = v; go(); });
  choice(ctl, 'Count', [['old', 'Textbook (3 and 2)'], ['new', 'Modern (2.5 and 1.5)']], count, (v) => { count = v; go(); });
  const parts = () => {
    const nad = count === 'old' ? 3 : 2.5, fad = count === 'old' ? 2 : 1.5;
    if (mode !== 'aer') return [['glycolysis', 2]];
    const sh = count === 'old' ? 0 : -2;
    return [['glycolysis', 2], ['2 NADH (glycolysis)', 2 * nad + sh], ['link reaction', 2 * nad], ['Krebs: ATP', 2], ['Krebs: NADH', 6 * nad], ['Krebs: FADH₂', 2 * fad]];
  };
  const go = () => {
    const p = parts(), tot = p.reduce((a, [, v]) => a + v, 0);
    ro.textContent = mode === 'aer' ? `About ${tot} ATP per glucose (glycolysis 2 net, link 2 NADH, Krebs cycle 2 + 6 NADH + 2 FADH₂). About 40 % of the energy of glucose is caught in ATP.` : `Only 2 ATP per glucose. ${mode === 'lac' ? 'Pyruvate is reduced to lactic acid (muscle, some bacteria) and no CO₂ is released.' : 'Pyruvate gives ethanol and 2 CO₂ (yeast).'} NADH is used up to remake NAD⁺ so glycolysis can go on.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const p = parts(), tot = p.reduce((a, [, v]) => a + v, 0), t0 = title(ctx, `ATP per glucose: about ${+tot.toFixed(1)}`, col);
    const A = axes(ctx, w, h, col, { x: [0, 1], y: [0, 40], xlabel: '', ylabel: 'ATP', l: 44, t: t0 + 8, b: 12, xt: [], yt: [0, 10, 20, 30, 40] });
    let y = 0; const bx = A.L + 14, bw = Math.min(110, (A.R - A.L) * 0.38);
    p.forEach(([n, v], i) => { const y0 = A.Y(y), y1 = A.Y(y + v); ctx.fillStyle = col.s[i % 8]; ctx.fillRect(bx, y1, bw, y0 - y1); if (y0 - y1 > 12) text(ctx, '+' + +v.toFixed(1), bx + bw / 2, (y0 + y1) / 2, { color: col.bg, size: 11, weight: 700, align: 'center' }); text(ctx, n, bx + bw + 10, (y0 + y1) / 2, { color: col.ink, size: 10.5 }); y += v; });
    if (mode !== 'aer') text(ctx, mode === 'lac' ? 'end product: lactic acid' : 'end products: ethanol + CO₂', bx, A.Y(2) - 26, { color: col.muted, size: 10.5 });
  };
  go();
}
