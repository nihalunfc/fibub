// Class 12 Chemistry, Aldehydes, Ketones and Carboxylic Acids: the Cannizzaro reaction (step player). An aldehyde with NO alpha hydrogen (methanal, benzaldehyde) with concentrated NaOH gives
// an alcohol and a carboxylate: one molecule is oxidised and the other reduced (disproportionation). OH- adds to C=O, then a hydride (H-) moves from that adduct to a second aldehyde.
import { canvas, text, title, arrow, loop, ease } from '../../kit.js';

const TT = ['No α hydrogen, so no enolate', 'OH⁻ attacks the C=O', 'A hydride jumps across', 'Two different products', 'Who was oxidised, who reduced?'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 360, min: 290, label: 'Cannizzaro reaction step by step' });
  loop(host, (dt) => { t = Math.min(1, t + dt * 0.8); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), cy = top + (h - top) * 0.34, e = ease(t), cx = w / 2;
    const box = (s, x, y, c, mw = 0) => { ctx.font = '700 13px system-ui'; const tw = Math.max(mw, ctx.measureText(s).width + 16); ctx.fillStyle = col.panel; ctx.strokeStyle = c; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.roundRect(x - tw / 2, y - 15, tw, 30, 8); ctx.fill(); ctx.stroke(); text(ctx, s, x, y, { color: col.ink, size: 13, weight: 700, align: 'center' }); };
    const N = (a, b) => { text(ctx, a, w / 2, h - 44, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, b, w / 2, h - 24, { color: col.muted, size: 11, align: 'center' }); };
    if (step === 0) { box('H–CHO', cx - 70, cy, col.s[0]); box('C₆H₅–CHO', cx + 62, cy, col.s[0]); text(ctx, 'no H on the carbon next to C=O', cx, cy + 36, { color: col.s[3], size: 11.5, align: 'center' }); N('Methanal and benzaldehyde cannot form an enolate.', 'So with strong base they take another path.'); }
    if (step === 1) { box('H–CHO', cx - 78, cy, col.s[0]); text(ctx, '+ OH⁻', cx - 20, cy, { color: col.ink, size: 13, align: 'center' }); arrow(ctx, cx + 20, cy, cx + 54, cy, col.ink, 2, 8); box('H–CH(OH)–O⁻', cx + 100 > w - 70 ? w - 70 : cx + 100, cy, col.s[3]); N('Hydroxide (a nucleophile) adds to the carbonyl carbon.', 'The adduct carries a negative charge on O and still has its H on the carbon.'); }
    if (step === 2) { box('H–CH(OH)–O⁻', cx - 78, cy, col.s[3]); box('H–CHO', cx + 70, cy + 38, col.s[0]); const hx = cx - 78 + 38 + (cx + 70 - (cx - 78 + 38)) * e, hy = cy - 4 + (cy + 38 - 28 - (cy - 4)) * e - 22 * Math.sin(Math.PI * e); ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.arc(hx, hy, 6, 0, 7); ctx.fill(); text(ctx, 'H⁻', hx, hy - 14, { color: col.s[1], size: 11, weight: 700, align: 'center' }); N('The H on the adduct leaves with its electron pair (a hydride).', 'It attacks the C=O of a second aldehyde molecule.'); }
    if (step === 3) { box('H–COO⁻  (methanoate)', cx, cy - 12, col.s[1]); box('CH₃–OH  (methanol)', cx, cy + 36, col.s[3]); text(ctx, '2 HCHO + NaOH → HCOONa + CH₃OH', cx, cy + 74, { color: col.ink, size: 12, align: 'center' }); N('One molecule ends as the acid salt, the other as the alcohol.', 'Benzaldehyde gives sodium benzoate and benzyl alcohol.'); }
    if (step === 4) { box('HCHO → HCOO⁻', cx, cy - 12, col.s[1]); text(ctx, 'oxidised (carbon +0 → +2)', cx, cy + 14, { color: col.s[1], size: 11.5, align: 'center' }); box('HCHO → CH₃OH', cx, cy + 44, col.s[3]); text(ctx, 'reduced (carbon 0 → −2)', cx, cy + 70, { color: col.s[3], size: 11.5, align: 'center' }); N('Disproportionation: one substance is both oxidised and reduced.', 'A cross-Cannizzaro with excess HCHO reduces the other aldehyde and gives HCOO⁻.'); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
