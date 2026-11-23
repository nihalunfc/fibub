// Class 11 Chemistry, Hydrocarbons: what happens at the double bond. Pick an alkene and a reagent. Ozonolysis (O3, then Zn/H2O) cuts C=C and puts C=O on each end (aldehyde if the carbon had H, ketone if not;
// CH2 gives methanal). Hot acidic KMnO4 cuts the same bond but oxidises aldehydes further to acids (CH2 to CO2 + H2O). Cold dilute alkaline KMnO4 (Baeyer's reagent, purple fades) only adds two OH: a diol.
import { canvas, text, title, choice, readout, row } from '../../kit.js';

const AL = {
  eth: { n: 'ethene', e: [['H', 'H'], ['H', 'H']], diol: 'ethane-1,2-diol' },
  pro: { n: 'propene', e: [['CH₃', 'H'], ['H', 'H']], diol: 'propane-1,2-diol' },
  but: { n: 'but-2-ene', e: [['CH₃', 'H'], ['CH₃', 'H']], diol: 'butane-2,3-diol' },
  ib: { n: '2-methylpropene', e: [['CH₃', 'CH₃'], ['H', 'H']], diol: '2-methylpropane-1,2-diol' },
  mb: { n: '2-methylbut-2-ene', e: [['CH₃', 'CH₃'], ['CH₃', 'H']], diol: '2-methylbutane-2,3-diol' },
};
const NAMEC = (a, b, hot) => { const k = a + '|' + b; if (a === 'H' && b === 'H') return hot ? 'CO₂ + H₂O' : 'methanal HCHO'; if (a === 'CH₃' && b === 'H') return hot ? 'ethanoic acid CH₃COOH' : 'ethanal CH₃CHO'; if (a === 'CH₃' && b === 'CH₃') return 'propanone (CH₃)₂C=O'; return '?'; };
export default function (host) {
  let k = 'pro', rg = 'o3';
  const cv = canvas(host, { aspect: 0.72, max: 460, min: 290, label: 'An alkene cut or hydroxylated by ozone or potassium permanganate' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'alkene', Object.entries(AL).map(([a, d]) => [a, d.n]), k, (v) => { k = v; go(); });
  choice(ctl, 'reagent', [['o3', 'O₃ then Zn/H₂O'], ['hot', 'hot KMnO₄/H⁺'], ['cold', 'cold dilute KMnO₄']], rg, (v) => { rg = v; go(); });
  const res = () => { const a = AL[k]; if (rg === 'cold') return [a.diol]; return a.e.map(([x, y]) => NAMEC(x, y, rg === 'hot')); };
  const go = () => { const r = res(); ro.textContent = rg === 'cold' ? `Cold dilute KMnO₄ (Baeyer’s reagent, purple turns brown): the C=C stays as C–C and both carbons gain an OH: ${r[0]}. A test for unsaturation.` : `${AL[k].n} is cut at the C=C. Products: ${r.join(' and ')}. ${rg === 'o3' ? 'Zn stops the oxidation at the aldehyde stage.' : 'Strong oxidation turns every aldehyde into an acid.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const a = AL[k], top = title(ctx, a.n + ' + ' + { o3: 'ozone (ozonolysis)', hot: 'hot KMnO₄/H⁺', cold: 'cold dilute KMnO₄' }[rg], col) + 12, cy = top + 50, cx = w / 2;
    const grp = (x, y, l, c) => text(ctx, l, x, y, { color: c || col.ink, size: 12, weight: 700, align: 'center' });
    const cut = rg !== 'cold';
    const dx = cut ? 26 : 0;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx - 20 - dx, cy); ctx.lineTo(cx - 20 - dx + (cut ? 0 : 40), cy); ctx.stroke();
    text(ctx, 'C', cx - 30 - dx, cy, { color: col.ink, size: 15, weight: 700, align: 'center' }); text(ctx, 'C', cx + 30 + dx, cy, { color: col.ink, size: 15, weight: 700, align: 'center' });
    if (!cut) { ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.moveTo(cx - 16, cy); ctx.lineTo(cx + 16, cy); ctx.stroke(); text(ctx, 'OH', cx - 30, cy - 36, { color: col.s[3], size: 12, weight: 700, align: 'center' }); text(ctx, 'OH', cx + 30, cy - 36, { color: col.s[3], size: 12, weight: 700, align: 'center' }); }
    else { ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.2; [[cx - 30 - dx, -1], [cx + 30 + dx, 1]].forEach(([x, s]) => { ctx.beginPath(); ctx.moveTo(x + s * 14 - 3, cy - 4); ctx.lineTo(x + s * 28 - 3, cy - 4); ctx.moveTo(x + s * 14 - 3, cy + 4); ctx.lineTo(x + s * 28 - 3, cy + 4); ctx.stroke(); text(ctx, 'O', x + s * 38, cy, { color: col.s[3], size: 12, weight: 700, align: 'center' }); }); }
    const eL = a.e[0], eR = a.e[1];
    const gx = cut ? 52 + dx : 78; grp(cx - gx, cy - 32, eL[0]); grp(cx - gx, cy + 32, eL[1]); grp(cx + gx, cy - 32, eR[0]); grp(cx + gx, cy + 32, eR[1]);
    const r = res(); ctx.fillStyle = col.soft; ctx.fillRect(10, cy + 76, w - 20, 40 + (cut ? 22 : 0)); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.strokeRect(10, cy + 76, w - 20, 40 + (cut ? 22 : 0));
    if (cut) { text(ctx, 'product 1: ' + r[0], w / 2, cy + 96, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'product 2: ' + r[1], w / 2, cy + 118, { color: col.ink, size: 12, weight: 700, align: 'center' }); }
    else text(ctx, r[0], w / 2, cy + 96, { color: col.ink, size: 13, weight: 700, align: 'center' });
  };
  go();
}
