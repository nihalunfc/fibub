// Class 10 Life Processes: respiration pathways. Glucose (6 C) is first broken into two pyruvate (3 C) in the cytoplasm
// (glycolysis, a little ATP). Then: with oxygen, in the mitochondria, pyruvate is broken down fully to CO2 + H2O and
// about 30 ATP per glucose (aerobic). Without oxygen, yeast makes ethanol + CO2 and muscle makes lactic acid, so only
// about 2 ATP per glucose in all. Dots = ATP made from one glucose. ATP counts: textbook values (Berg, Biochemistry).
import { canvas, text, title, line, dot, row, choice, readout, loop, arrow } from '../../kit.js';

const P = {
  aer: { n: 'With oxygen (aerobic)', where: 'cytoplasm, then mitochondria', mid: ['CO₂ + H₂O', 'complete breakdown'], atp: 30, eq: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy (about 30 ATP)', note: 'The mitochondria break pyruvate down completely using oxygen. This releases about 15 times more energy than the other routes. This is what your muscles do when you walk or jog.' },
  yeast: { n: 'Yeast, no oxygen', where: 'cytoplasm only', mid: ['ethanol + CO₂', 'fermentation'], atp: 2, eq: 'C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ + energy (2 ATP)', note: 'Yeast in dough or fruit juice has little oxygen. It makes ethanol and CO₂. The CO₂ makes dough rise (idli batter, bread); the ethanol is in wine and beer. Only 2 ATP per glucose.' },
  musc: { n: 'Muscle, no oxygen', where: 'cytoplasm only', mid: ['lactic acid', '3-carbon acid'], atp: 2, eq: 'C₆H₁₂O₆ → 2C₃H₆O₃ (lactic acid) + energy (2 ATP)', note: 'In a sprint the blood cannot bring oxygen fast enough. Muscle cells make lactic acid for quick energy. Its build-up causes cramps; rest and oxygen clear it.' },
};
export default function (host) {
  let k = 'aer', t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Aerobic and anaerobic respiration pathways from one glucose molecule with ATP counts' });
  const ctl = row(host);
  choice(ctl, 'Pathway', Object.entries(P).map(([v, o]) => [v, o.n]), k, (v) => { k = v; say(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const out = readout(host);
  function say() { out.innerHTML = `<b>${P[k].n}.</b> ${P[k].note}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const p = P[k], top = title(ctx, p.n + ': about ' + p.atp + ' ATP', col) + 8, cx = w / 2;
    const box = (x, y, bw, bh, a, b, c) => { ctx.fillStyle = col.soft; ctx.fillRect(x, y, bw, bh); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.strokeRect(x, y, bw, bh); text(ctx, a, x + bw / 2, y + bh / 2 - (b ? 6 : 0), { color: col.ink, size: 12, weight: 700, align: 'center' }); if (b) text(ctx, b, x + bw / 2, y + bh / 2 + 9, { color: col.muted, size: 9.5, align: 'center' }); };
    const bw = Math.min(150, w * 0.5), y1 = top + 6, y2 = y1 + 74, y3 = y2 + 78;
    box(cx - bw / 2, y1, bw, 38, 'Glucose', '6 carbons', col.s[1]);
    arrow(ctx, cx, y1 + 38, cx, y2 - 2, col.ink, 2, 8); text(ctx, 'cytoplasm: ×2', cx + 8, y1 + 56, { color: col.muted, size: 10 });
    box(cx - bw / 2, y2, bw, 38, 'Pyruvate ×2', '3 carbons each', col.s[0]);
    // animated pyruvate dots
    for (let i = 0; i < 2; i++) dot(ctx, cx - 16 + i * 32, y2 + 48 + Math.sin(t * 4 + i) * 2, 3.5, col.s[0]);
    const here = p.where.includes('mitochondria');
    arrow(ctx, cx, y2 + 52, cx, y3 - 2, col.ink, 2, 8); text(ctx, here ? 'with O₂ (mitochondria)' : 'no O₂', cx + 8, y2 + 66, { color: col.s[here ? 3 : 7], size: 10.5, weight: 700 });
    box(cx - bw / 2 - 20, y3, bw + 40, 40, p.mid[0], p.mid[1], here ? col.s[3] : col.s[7]);
    // ATP dots
    const ax = 16, ay = y3 + 62, per = Math.min(11, (w - 40) / 15);
    text(ctx, 'ATP from one glucose:', ax, ay - 12, { color: col.ink, size: 11, weight: 700 });
    for (let i = 0; i < p.atp; i++) { const x = ax + 6 + (i % 15) * per, y = ay + 4 + Math.floor(i / 15) * 12 + Math.sin(t * 3 + i) * (i % 3 === 0 ? 1 : 0); dot(ctx, x, y, 4, col.s[4]); }
    text(ctx, p.eq, w / 2, h - 12, { color: col.s[2], size: 10.5, weight: 700, align: 'center' });
  };
  say();
}
