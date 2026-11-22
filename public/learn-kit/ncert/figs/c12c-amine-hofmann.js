// Class 12 Chemistry, Amines: Hofmann bromamide degradation (step player). RCONH2 + Br2 + 4 NaOH -> RNH2 + Na2CO3 + 2 NaBr + 2 H2O. The amine has ONE CARBON FEWER than the amide.
// Steps: N-bromination; loss of H+ to give the bromamide anion; the R group migrates from C to N as Br- leaves, giving an isocyanate R-N=C=O; hydroxide adds to give carbamate; loss of CO2 (as carbonate) leaves RNH2.
import { canvas, text, title, arrow, loop, ease } from '../../kit.js';

const TT = ['Start: the amide', 'N is brominated', 'Base removes N–H', 'R migrates to N', 'Water adds to the isocyanate', 'CO₂ is lost: the amine'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.86, max: 380, min: 310, label: 'Hofmann bromamide degradation step by step' });
  loop(host, (dt) => { t = Math.min(1, t + dt * 0.8); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), cx = w / 2, cy = top + (h - top) * 0.3, e = ease(t);
    const box = (s, x, y, c, mw = 0) => { ctx.font = '700 13px system-ui'; const tw = Math.max(mw, ctx.measureText(s).width + 18); ctx.fillStyle = col.panel; ctx.strokeStyle = c; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.roundRect(x - tw / 2, y - 15, tw, 30, 8); ctx.fill(); ctx.stroke(); text(ctx, s, x, y, { color: col.ink, size: 13, weight: 700, align: 'center' }); };
    const N = (a, b) => { text(ctx, a, cx, h - 62, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, b, cx, h - 42, { color: col.muted, size: 11, align: 'center' }); };
    const C = [['propanamide', 'CH₃CH₂CONH₂'], ['N-bromo amide', 'CH₃CH₂CONHBr'], ['bromamide anion', 'CH₃CH₂CON⁻Br'], ['isocyanate', 'CH₃CH₂–N=C=O'], ['carbamate', 'CH₃CH₂NHCOO⁻'], ['ethanamine', 'CH₃CH₂NH₂ + CO₃²⁻']][step];
    box(C[1], cx, cy, step === 5 ? col.s[1] : col.s[0], Math.min(w - 30, 190)); text(ctx, C[0], cx, cy + 26, { color: col.muted, size: 11, align: 'center' });
    const rg = ['', '+ Br₂ + NaOH → − NaBr, − H₂O', '+ OH⁻ → − H₂O', '− Br⁻ (R shifts from C to N)', '+ OH⁻', '− CO₃²⁻ (after H⁺ shifts)'][step];
    if (step) text(ctx, '↓  ' + rg, cx, cy - 34, { color: col.s[3], size: 11, weight: 700, align: 'center' });
    // carbon counter
    const bx = 22, by = cy + 64, cnt = step >= 3 ? 2 : 3;
    text(ctx, 'carbon atoms in the chain:', bx, by, { color: col.muted, size: 11 });
    [0, 1, 2].forEach((i) => { const live = i < cnt, x = bx + 148 + i * 28; ctx.fillStyle = live ? col.s[0] : col.line; ctx.beginPath(); ctx.arc(x, by, 9, 0, 7); ctx.fill(); text(ctx, 'C', x, by, { color: live ? col.panel : col.muted, size: 10, weight: 700, align: 'center' }); });
    if (step === 5) text(ctx, '3 carbons in, 2 carbons out', cx, by + 26, { color: col.s[1], size: 12, weight: 700, align: 'center' });
    const NN = ['The amide R–CO–NH₂ (here propanamide, three carbons). Hofmann turns it into the amine with one carbon fewer.', 'Br₂ in alkaline solution replaces an H on nitrogen.', 'Strong base takes the remaining N–H hydrogen as H⁺, leaving a negative charge on nitrogen.', 'The ethyl group shifts from carbon to nitrogen as bromide leaves: an isocyanate forms.', 'Hydroxide attacks the C=O of the isocyanate and gives a carbamate.', 'The carbamate loses CO₂ (kept as carbonate in base) and the amine remains.'][step];
    const ws = NN.split(' '); let l = '', yy = h - 22; const lines = []; ws.forEach((wd) => { if ((l + ' ' + wd).length > 54) { lines.push(l); l = wd; } else l = l ? l + ' ' + wd : wd; }); lines.push(l); lines.forEach((ln, i) => text(ctx, ln, cx, yy + i * 0 - (lines.length - 1) * 7 + i * 14, { color: col.muted, size: 10.5, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
