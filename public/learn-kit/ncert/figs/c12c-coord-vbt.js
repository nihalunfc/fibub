// Class 12 Chemistry, Coordination Compounds (step player): valence bond theory in orbital boxes. The metal ion supplies empty orbitals that hybridise; each ligand donates a lone pair into one.
// A strong-field ligand (CN-, NH3 in this simple picture) first pushes the d electrons together to free inner 3d orbitals: d2sp3, low spin, "inner orbital" complex.
// A weak-field ligand (F-, Cl-) leaves the d electrons alone and uses the outer 4d orbitals: sp3d2, high spin, "outer orbital". Unpaired electrons give mu = sqrt(n(n+2)) BM.
// Box numbers: 0-4 = 3d, 5 = 4s, 6-8 = 4p, 9-10 = 4d.
import { canvas, text, title, arrow, row, choice } from '../../kit.js';

const C = {
  fecn: { n: '[Fe(CN)₆]⁴⁻', ion: 'Fe²⁺', d: 6, strong: true, hyb: [3, 4, 5, 6, 7, 8], name: 'd²sp³', shape: 'octahedral', kind: 'inner orbital' },
  fef: { n: '[FeF₆]³⁻', ion: 'Fe³⁺', d: 5, strong: false, hyb: [5, 6, 7, 8, 9, 10], name: 'sp³d²', shape: 'octahedral', kind: 'outer orbital' },
  conh: { n: '[Co(NH₃)₆]³⁺', ion: 'Co³⁺', d: 6, strong: true, hyb: [3, 4, 5, 6, 7, 8], name: 'd²sp³', shape: 'octahedral', kind: 'inner orbital' },
  nicn: { n: '[Ni(CN)₄]²⁻', ion: 'Ni²⁺', d: 8, strong: true, hyb: [4, 5, 6, 7], name: 'dsp²', shape: 'square planar', kind: 'inner d orbital' },
  nicl: { n: '[NiCl₄]²⁻', ion: 'Ni²⁺', d: 8, strong: false, hyb: [5, 6, 7, 8], name: 'sp³', shape: 'tetrahedral', kind: 'outer orbital' },
};
const fill = (d, pair) => { const b = [0, 0, 0, 0, 0]; if (pair) { for (let i = 0; i < 5 && d > 0; i++) { b[i] = Math.min(2, d); d -= b[i]; } return b; } for (let i = 0; i < 5 && d > 0; i++) { b[i] = 1; d--; } for (let i = 0; i < 5 && d > 0; i++) { b[i] = 2; d--; } return b; };

export default function (host) {
  let step = 0, key = 'fecn';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Orbital box diagram of a complex with hybridisation' });
  const ctl = row(host);
  choice(ctl, 'complex', [['fecn', 'Fe(CN)₆⁴⁻'], ['fef', 'FeF₆³⁻'], ['conh', 'Co(NH₃)₆³⁺'], ['nicn', 'Ni(CN)₄²⁻'], ['nicl', 'NiCl₄²⁻']], key, (v) => { key = v; cv.redraw(); });
  const TT = ['Free metal ion', 'Does the ligand force pairing?', 'Choose the empty orbitals', 'Ligand lone pairs move in', 'Result'];
  cv.draw = (ctx, w, h, col) => {
    const c = C[key], top = title(ctx, `${c.n}: ${TT[step]}`, col), bs = Math.min(26, (w - 24) / 11.5), gap = bs * 0.5;
    const x0 = (w - (11 * bs + 2 * gap)) / 2, y0 = top + 46;
    const X = (i) => x0 + (i < 5 ? i * bs : i < 6 ? 5 * bs + gap : i < 9 ? 6 * bs + gap + (i - 6) * bs + 0 : 9 * bs + 2 * gap + (i - 9) * bs) - (i >= 6 && i < 9 ? 0 : 0);
    const pos = (i) => (i < 5 ? x0 + i * bs : i < 6 ? x0 + 5 * bs + gap : i < 9 ? x0 + 6 * bs + gap + (i - 6) * bs : x0 + 9 * bs + 2 * gap + (i - 9) * bs);
    const pair = step >= 1 && c.strong, dd = fill(c.d, pair), hy = c.hyb, hybOn = step >= 2, lig = step >= 3;
    const lab = [['3d', 2, 0], ['4s', 5, 5], ['4p', 7, 6], ['4d', 9.5, 9]];
    [['3d', 0, 4], ['4s', 5, 5], ['4p', 6, 8], ['4d', 9, 10]].forEach(([nm, a, b]) => text(ctx, nm, (pos(a) + pos(b) + bs) / 2, y0 - 14, { color: col.muted, size: 11, weight: 700, align: 'center' }));
    for (let i = 0; i < 11; i++) {
      const x = pos(i), inH = hybOn && hy.includes(i);
      ctx.fillStyle = inH ? col.soft : col.panel; ctx.fillRect(x, y0, bs, bs); ctx.strokeStyle = inH ? col.s[0] : col.ink; ctx.lineWidth = inH ? 2.5 : 1.3; ctx.strokeRect(x, y0, bs, bs);
      const e = i < 5 ? dd[i] : 0;
      if (e >= 1) arrow(ctx, x + bs * 0.32, y0 + bs * 0.85, x + bs * 0.32, y0 + bs * 0.15, col.s[2], 2, 5);
      if (e === 2) arrow(ctx, x + bs * 0.68, y0 + bs * 0.15, x + bs * 0.68, y0 + bs * 0.85, col.s[2], 2, 5);
      if (lig && inH) { arrow(ctx, x + bs * 0.32, y0 + bs * 0.85, x + bs * 0.32, y0 + bs * 0.15, col.s[3], 2, 5); arrow(ctx, x + bs * 0.68, y0 + bs * 0.15, x + bs * 0.68, y0 + bs * 0.85, col.s[3], 2, 5); }
    }
    const un = dd.reduce((s, v) => s + (v === 1 ? 1 : 0), 0), mu = Math.sqrt(un * (un + 2));
    const L = (s, i, cl = col.ink, wt = 400) => text(ctx, s, w / 2, y0 + bs + 34 + i * 20, { color: cl, size: 12.5, weight: wt, align: 'center' });
    if (step === 0) { L(`${c.ion} has ${c.d} d electrons, placed one per box first (Hund).`, 0); L(`unpaired: ${fill(c.d, false).filter((v) => v === 1).length}`, 1, col.muted); }
    if (step === 1) { if (c.strong) { L('Strong-field ligand: the d electrons are pushed', 0, col.s[2], 700); L('together in pairs, freeing 3d boxes.', 1, col.s[2], 700); } else { L('Weak-field ligand: the d electrons stay as they are.', 0, col.s[3], 700); L('No 3d box is freed.', 1, col.muted); } }
    if (step === 2) { L('Empty orbitals (outlined) hybridise:', 0); L(`${c.name}  →  ${c.shape}`, 1, col.s[0], 700); }
    if (step === 3) { L(`${hy.length} ligand lone pairs (blue arrows) fill the hybrid orbitals.`, 0, col.s[3], 700); L('Each ligand donates both electrons of its pair.', 1, col.muted); }
    if (step === 4) { L(`${c.name}, ${c.shape}, ${c.kind}`, 0, col.ink, 700); L(un ? `${un} unpaired: μ = ${mu.toFixed(2)} BM, paramagnetic` : 'no unpaired electrons: diamagnetic', 1, un ? col.s[3] : col.s[2], 700); L(c.strong ? 'low spin' : 'high spin', 2, col.muted); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
