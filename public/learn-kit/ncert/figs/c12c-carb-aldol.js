// Class 12 Chemistry, Aldehydes, Ketones and Carboxylic Acids: aldol condensation of ethanal (step player).
// An aldehyde or ketone with an alpha hydrogen is deprotonated by dilute base to give an enolate. The enolate carbon attacks the C=O of a second molecule (C-C bond), and protonation gives the aldol (3-hydroxybutanal). Heat removes water to give but-2-enal.
import { canvas, text, title, arrow, loop, ease } from '../../kit.js';

const TT = ['Ethanal has α hydrogens', 'Base removes an α hydrogen', 'The enolate attacks a second ethanal', 'Protonation gives the aldol', 'Heating removes water'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 360, min: 290, label: 'Aldol condensation of ethanal step by step' });
  loop(host, (dt) => { t = Math.min(1, t + dt * 0.8); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), cy = top + (h - top) * 0.34, e = ease(t);
    const box = (s, x, y, c, mw = 0) => { ctx.font = '700 13px system-ui'; const tw = Math.max(mw, ctx.measureText(s).width + 16); ctx.fillStyle = col.panel; ctx.strokeStyle = c; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.roundRect(x - tw / 2, y - 15, tw, 30, 8); ctx.fill(); ctx.stroke(); text(ctx, s, x, y, { color: col.ink, size: 13, weight: 700, align: 'center' }); };
    const N = (a, b) => { text(ctx, a, w / 2, h - 44, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, b, w / 2, h - 24, { color: col.muted, size: 11, align: 'center' }); };
    const cx = w / 2;
    if (step === 0) { box('CH₃–CHO', cx, cy, col.s[0]); text(ctx, 'α carbon: the carbon next to C=O', cx, cy + 34, { color: col.s[3], size: 11.5, align: 'center' }); text(ctx, 'its H atoms are slightly acidic (pKa about 17)', cx, cy + 54, { color: col.muted, size: 11, align: 'center' }); N('Aldol needs at least one α hydrogen.', 'Methanal and benzaldehyde have none, so they do something else (Cannizzaro).'); }
    if (step === 1) { box('⁻CH₂–CHO', cx + 30, cy, col.s[3]); text(ctx, 'OH⁻ +', cx - 70, cy, { color: col.ink, size: 13, align: 'center' }); box('CH₃CHO', cx - 100, cy + 40, col.s[0]); arrow(ctx, cx - 62, cy + 40, cx - 20, cy + 6, col.s[0], 2, 8); text(ctx, '− H₂O', cx + 30, cy + 32, { color: col.muted, size: 11, align: 'center' }); N('Dilute NaOH takes an α hydrogen as H⁺, forming water.', 'The enolate ion has its charge shared between the α carbon and oxygen.'); }
    if (step === 2) { box('⁻CH₂–CHO', cx - 75, cy - 20, col.s[3]); box('CH₃–CH=O', cx + 62, cy + 30 - 0, col.s[0]); arrow(ctx, cx - 30, cy - 4, cx + 24, cy + 18 + 0 * e, col.s[3], 2.4, 9); text(ctx, 'new C–C bond forms', cx - 20, cy + 16, { color: col.s[1], size: 11, align: 'center' }); N('The nucleophilic carbon attacks the C=O carbon of another molecule.', 'A carbon–carbon bond forms: the chain grows. This is the point of the reaction.'); }
    if (step === 3) { box('CH₃–CH(OH)–CH₂–CHO', cx, cy, col.s[1]); text(ctx, 'aldol: 3-hydroxybutanal', cx, cy + 34, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'ald(ehyde) + (alcoh)ol, hence “aldol”', cx, cy + 54, { color: col.muted, size: 11, align: 'center' }); N('The alkoxide picks up H⁺ from water; OH⁻ is regenerated (a catalyst).', 'The product has both an –OH and a –CHO group.'); }
    if (step === 4) { box('CH₃–CH(OH)–CH₂–CHO', cx, cy - 6, col.muted); arrow(ctx, cx, cy + 14, cx, cy + 50, col.s[3], 2.4, 9); text(ctx, 'heat, − H₂O', cx + 12, cy + 33, { color: col.s[3], size: 11.5 }); box('CH₃–CH=CH–CHO', cx, cy + 68, col.s[1]); N('Heat removes the β–OH and an α–H as water: aldol condensation.', 'But-2-enal is conjugated (C=C next to C=O), which makes the dehydration easy.'); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
