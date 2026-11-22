// Class 12 Chemistry, Alcohols, Phenols and Ethers: oxidation of primary, secondary and tertiary alcohols.
// A primary alcohol (CH2OH) loses H twice: aldehyde, then (with a strong oxidant and water) carboxylic acid. A secondary alcohol stops at a ketone. A tertiary alcohol has no H on the carbinol carbon, so nothing happens.
// Mild: PCC or Cu at 573 K (dehydrogenation). Strong: acidified KMnO4 or K2Cr2O7. Oxidation numbers of the carbinol carbon: -1 (1 deg), 0 (2 deg) before; aldehyde +1, ketone +2, acid +3 after.
import { canvas, text, title, arrow, row, choice, readout } from '../../kit.js';

const A = { p: { n: 'propan-1-ol', f: 'CH₃CH₂CH₂OH', mid: ['propanal', 'CH₃CH₂CHO'], end: ['propanoic acid', 'CH₃CH₂COOH'] }, s: { n: 'propan-2-ol', f: '(CH₃)₂CHOH', mid: ['propanone', '(CH₃)₂C=O'], end: null }, t: { n: 'tert-butanol', f: '(CH₃)₃COH', mid: null, end: null } };
export default function (host) {
  let k = 'p', ox = 'mild';
  const cv = canvas(host, { aspect: 0.72, max: 320, min: 260, label: 'Oxidation of a primary, secondary or tertiary alcohol with a mild or a strong oxidising agent' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'alcohol', [['p', '1° (propan-1-ol)'], ['s', '2° (propan-2-ol)'], ['t', '3° (tert-butyl)']], k, (v) => { k = v; go(); });
  choice(ctl, 'oxidant', [['mild', 'mild: PCC or Cu, 573 K'], ['strong', 'strong: KMnO₄ or K₂Cr₂O₇']], ox, (v) => { ox = v; go(); });
  const result = () => { const a = A[k]; if (k === 't') return [null, 'no reaction: no H on the C–OH carbon (strong, hot conditions break C–C bonds)']; if (k === 's') return [a.mid, 'ketone: stops here, there is no second H to remove']; return ox === 'mild' ? [a.mid, 'aldehyde: mild oxidant stops here (distil it out as it forms)'] : [a.end, 'carboxylic acid: aldehyde is oxidised further in water']; };
  const go = () => { const [p, m] = result(); ro.textContent = `${A[k].n} with a ${ox} oxidant gives ${p ? p[0] : 'nothing'}: ${m}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Oxidation depends on how many H are on the C–OH carbon', col), a = A[k], [p] = result(), bx = [w * 0.16, w * 0.5, w * 0.84], by = top + 60, bw = w * 0.24;
    const stages = [[a.n, a.f, '−1'], a.mid ? [a.mid[0], a.mid[1], k === 's' ? '+2' : '+1'] : null, a.end ? [a.end[0], a.end[1], '+3'] : null];
    if (k === 's') stages[1] = [a.mid[0], a.mid[1], '+2'];
    if (k === 's') stages[0][2] = '0';
    const reached = [true, !!p && (p === a.mid || p === a.end), p === a.end && !!a.end];
    stages.forEach((s, i) => {
      if (!s) { ctx.setLineDash([4, 4]); ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.strokeRect(bx[i] - bw / 2, by - 30, bw, 60); ctx.setLineDash([]); text(ctx, i === 1 ? 'not possible' : '—', bx[i], by, { color: col.muted, size: 10.5, align: 'center' }); return; }
      ctx.fillStyle = reached[i] ? col.soft : col.panel; ctx.strokeStyle = reached[i] ? col.s[3] : col.line; ctx.lineWidth = reached[i] ? 2.4 : 1.2; ctx.fillRect(bx[i] - bw / 2, by - 30, bw, 60); ctx.strokeRect(bx[i] - bw / 2, by - 30, bw, 60);
      text(ctx, s[0], bx[i], by - 14, { color: col.ink, size: 10, weight: 700, align: 'center' }); text(ctx, s[1], bx[i], by + 3, { color: col.ink, size: 11, align: 'center' }); text(ctx, 'C ox. no. ' + s[2], bx[i], by + 20, { color: col.muted, size: 9.5, align: 'center' });
    });
    [0, 1].forEach((i) => { const ok = reached[i + 1], x0 = bx[i] + bw / 2 + 2, x1 = bx[i + 1] - bw / 2 - 2; arrow(ctx, x0, by, x1, by, ok ? col.s[3] : col.line, ok ? 3 : 1.5, 9); text(ctx, '−2H', (x0 + x1) / 2, by - 12, { color: ok ? col.s[3] : col.muted, size: 10, align: 'center' }); });
    text(ctx, ox === 'mild' ? 'mild oxidant: PCC, or Cu at 573 K' : 'strong oxidant: KMnO₄ / K₂Cr₂O₇ with acid', w / 2, by + 56, { color: col.muted, size: 11, align: 'center' });
    ctx.fillStyle = p ? col.good || col.s[1] : col.bad || col.s[3]; ctx.globalAlpha = 0.14; ctx.fillRect(14, by + 74, w - 28, 60); ctx.globalAlpha = 1;
    text(ctx, p ? 'Product: ' + p[0] : 'Product: none', w / 2, by + 92, { color: col.ink, size: 14, weight: 700, align: 'center' });
    text(ctx, result()[1].split(':')[0].split('(')[0].trim(), w / 2, by + 116, { color: col.muted, size: 11, align: 'center' });
  };
  go();
}
