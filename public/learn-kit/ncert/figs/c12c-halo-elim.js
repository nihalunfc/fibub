// Class 12 Chemistry, Haloalkanes: dehydrohalogenation (E2) and Saytzeff's rule. With alcoholic KOH a haloalkane loses HX; the H comes from a beta carbon (next to C-X).
// If there are two kinds of beta hydrogen, the more substituted (more stable) alkene is the major product. Typical product ratios with ethoxide in ethanol (CRC and textbook data, rounded).
// 1-bromobutane has only one beta carbon, so only but-1-ene forms.
import { canvas, text, title, arrow, row, choice, readout } from '../../kit.js';

const S = {
  a: { n: '2-bromobutane', chain: ['CH₃', 'CHBr', 'CH₂', 'CH₃'], br: 1, beta: [0, 2], prod: [['but-2-ene (disubstituted)', 81, 2], ['but-1-ene (monosubstituted)', 19, 1]], note: 'H leaves C3 (2 H, more substituted alkene) or C1 (3 H). Saytzeff: but-2-ene wins even though C1 has more H.' },
  b: { n: '2-bromo-2-methylbutane', chain: ['CH₃', 'CBr(CH₃)', 'CH₂', 'CH₃'], br: 1, beta: [0, 2], prod: [['2-methylbut-2-ene (trisubstituted)', 70, 3], ['2-methylbut-1-ene (disubstituted)', 30, 2]], note: 'The trisubstituted alkene is more stable, so it is the major product.' },
  c: { n: '1-bromobutane', chain: ['CH₂Br', 'CH₂', 'CH₂', 'CH₃'], br: 0, beta: [1], prod: [['but-1-ene (only choice)', 100, 1]], note: 'One beta carbon only, so there is no choice. Note: SN2 competes with E2 for a primary halide.' },
};
export default function (host) {
  let k = 'a';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Beta hydrogens, the alkenes formed and their percentages for three haloalkanes' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'haloalkane', [['a', '2-bromobutane'], ['b', '2-bromo-2-methylbutane'], ['c', '1-bromobutane']], k, (v) => { k = v; go(); });
  const go = () => { ro.textContent = `${S[k].n} + alcoholic KOH, heat. ${S[k].note}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const s = S[k], top = title(ctx, s.n + ' → alkenes', col), n = 4, dx = (w - 60) / (n - 1), y = top + 62;
    s.chain.forEach((l, i) => { const x = 30 + i * dx; if (i < n - 1) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x + 18, y); ctx.lineTo(x + dx - 18, y); ctx.stroke(); } const isB = i === s.br, isBeta = s.beta.includes(i); ctx.fillStyle = isB ? col.s[2] : isBeta ? col.s[3] : col.s[7] ?? col.muted; ctx.beginPath(); ctx.arc(x, y, 18, 0, 7); ctx.fill(); text(ctx, 'C' + (i + 1), x, y, { color: col.panel, size: 12, weight: 700, align: 'center' }); text(ctx, l, x, y + 30, { color: col.muted, size: 10, align: 'center' }); });
    s.beta.forEach((b) => { const x = 30 + b * dx, x2 = 30 + s.br * dx; arrow(ctx, x, y - 22, (x + x2) / 2, y - 44, col.s[3], 1.8, 6); text(ctx, 'β: H leaves', x, y - 52, { color: col.s[3], size: 10, weight: 700, align: 'center' }); });
    text(ctx, 'Br on C' + (s.br + 1), 30 + s.br * dx, y + 50, { color: col.s[2], size: 10.5, weight: 700, align: 'center' });
    const by = y + 84, bw = w - 40;
    s.prod.forEach(([nm, p, sub], i) => { const yy = by + i * 56; text(ctx, nm, 20, yy, { color: col.ink, size: 11.5, weight: i === 0 ? 700 : 400 }); ctx.fillStyle = col.line; ctx.fillRect(20, yy + 10, bw, 16); ctx.fillStyle = i === 0 ? col.s[2] : col.s[0]; ctx.fillRect(20, yy + 10, bw * p / 100, 16); text(ctx, p + ' %', 26, yy + 18, { color: col.panel, size: 11, weight: 700 }); });
    text(ctx, 'more substituted alkene = more stable = major (Saytzeff)', w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
