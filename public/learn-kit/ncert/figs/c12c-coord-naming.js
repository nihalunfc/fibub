// Class 12 Chemistry, Coordination Compounds (step player): naming [Co(NH3)4Cl2]Cl by the IUPAC rules, one rule at a time.
// 1 cation before anion; 2 ligands in alphabetical order (ammine before chlorido), ignoring the multiplying prefixes; 3 prefixes di, tri, tetra count the ligands; 4 the metal is named last with its
// oxidation state in Roman numerals (found from the charges); 5 join without spaces inside the complex.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'Step by step naming of tetraamminedichloridocobalt(III) chloride' });
  const TT = ['Read the formula', 'Cation first, anion second', 'Ligands in alphabetical order', 'Count the ligands: prefixes', 'Metal and oxidation state', 'The finished name'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), cx = w / 2;
    const tok = (parts, y, size) => { ctx.font = `700 ${size}px system-ui,sans-serif`; const total = parts.reduce((s, p) => s + ctx.measureText(p[0]).width, 0); let x = cx - total / 2; parts.forEach(([t, c]) => { ctx.fillStyle = c; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(t, x, y); x += ctx.measureText(t).width; }); };
    const B = col.s[3], G = col.s[2], O = col.s[0], I = col.ink, M = col.muted;
    tok([['[', I], ['Co', O], ['(NH₃)₄', B], ['Cl₂', G], [']', I], ['Cl', col.s[1] || G]], top + 36, 22);
    const L = (s, y, c = I, wt = 400, sz = 13) => text(ctx, s, cx, y, { color: c, size: sz, weight: wt, align: 'center' });
    if (step === 0) { L('The square brackets hold the complex ion.', top + 78); L('Outside the bracket: the counter ion, Cl⁻.', top + 100); L('Inside: Co with 4 NH₃ and 2 Cl⁻.', top + 122); }
    if (step === 1) { L('The complex part is the cation, so it is named first;', top + 78); L('the anion (chloride) comes last, as a separate word.', top + 100); tok([['… cobalt(III) ', M], ['chloride', col.s[1] || G]], top + 140, 18); }
    if (step === 2) { L('Ligands are listed alphabetically by name.', top + 78); L('a (ammine) comes before c (chlorido).', top + 100); tok([['ammine', B], ['chlorido', G]], top + 140, 20); L('(NH₃ is “ammine” with two m; Cl⁻ is “chlorido”)', top + 172, M, 400, 12); }
    if (step === 3) { L('4 NH₃ → tetra; 2 Cl⁻ → di. Prefixes do not change the order.', top + 78); tok([['tetra', M], ['ammine', B], ['di', M], ['chlorido', G]], top + 130, 20); }
    if (step === 4) { L('The metal comes after the ligands. Find its oxidation state x:', top + 78); L('x + 4(0) + 2(−1) = +1  (the complex ion is 1+)', top + 100, I, 700); L('x = +3, so cobalt(III)', top + 122, O, 700); tok([['tetraamminedichlorido', M], ['cobalt(III)', O]], top + 166, 17); }
    if (step === 5) { tok([['tetraammine', B], ['dichlorido', G], ['cobalt(III)', O]], top + 90, 18); tok([['chloride', col.s[1] || G]], top + 122, 20); L('tetraamminedichloridocobalt(III) chloride', top + 168, I, 700, 14); L('(for a neutral or anionic complex the metal ends in “-ate”: ferrate, cuprate)', top + 196, M, 400, 11); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
