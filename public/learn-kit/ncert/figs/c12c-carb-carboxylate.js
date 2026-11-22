// Class 12 Chemistry, Aldehydes, Ketones and Carboxylic Acids: why carboxylic acids are so much more acidic than alcohols (step player).
// In RCOOH the two C-O bonds differ (C=O about 123 pm, C-O about 136 pm). When H+ leaves, the carboxylate ion RCOO- has two EQUAL C-O bonds (about 127 pm): the negative charge is shared by both oxygens by resonance, which is a large stabilisation.
// An alkoxide RO- has nowhere to put its charge, so alcohols (pKa about 16) are far weaker than carboxylic acids (pKa about 4 to 5).
import { canvas, text, title, arrow, loop, ease } from '../../kit.js';

const TT = ['A carboxylic acid', 'The acid gives up H⁺', 'The charge is on one oxygen', 'Resonance: the other structure', 'Equal bonds, shared charge'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 360, min: 290, label: 'Resonance in the carboxylate ion' });
  loop(host, (dt) => { t = Math.min(1, t + dt * 0.8); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), cx = w * 0.42, cy = top + (h - top) * 0.4, e = ease(t), L = Math.min(70, w * 0.18);
    const Cc = [cx, cy], O1 = [cx + L * 0.9, cy - L * 0.7], O2 = [cx + L * 0.9, cy + L * 0.7], R = [cx - L, cy];
    const ln = (a, b, c, wd = 2.4, off = 0) => { const dx = b[1] - a[1], dy = a[0] - b[0], d = Math.hypot(dx, dy) || 1; ctx.strokeStyle = c; ctx.lineWidth = wd; ctx.beginPath(); ctx.moveTo(a[0] + dx / d * off, a[1] + dy / d * off); ctx.lineTo(b[0] + dx / d * off, b[1] + dy / d * off); ctx.stroke(); };
    const at = (s, p, c) => { ctx.fillStyle = col.panel; ctx.beginPath(); ctx.arc(p[0], p[1], 12, 0, 7); ctx.fill(); text(ctx, s, p[0], p[1], { color: c || col.ink, size: 14, weight: 700, align: 'center' }); };
    const delocal = step >= 4, flip = step === 3;
    ln(R, Cc, col.muted); text(ctx, 'R', R[0] - 14, R[1], { color: col.muted, size: 14, weight: 700, align: 'center' });
    const acid = step <= 1;
    // bonds
    if (acid) { ln(Cc, O1, col.ink, 2.4, 2.5); ln(Cc, O1, col.ink, 2.4, -2.5); ln(Cc, O2, col.ink); }
    else if (delocal) { ctx.save(); ctx.setLineDash([6, 4]); ln(Cc, O1, col.s[1], 2.4, 3); ctx.restore(); ln(Cc, O1, col.ink, 2.4, -2); ctx.save(); ctx.setLineDash([6, 4]); ln(Cc, O2, col.s[1], 2.4, 3); ctx.restore(); ln(Cc, O2, col.ink, 2.4, -2); }
    else if (flip) { ln(Cc, O2, col.ink, 2.4, 2.5); ln(Cc, O2, col.ink, 2.4, -2.5); ln(Cc, O1, col.ink); }
    else { ln(Cc, O1, col.ink, 2.4, 2.5); ln(Cc, O1, col.ink, 2.4, -2.5); ln(Cc, O2, col.ink); }
    at('C', Cc); at('O', O1, delocal ? col.s[3] : (flip ? col.s[3] : col.ink)); at('O', O2, step === 2 ? col.s[3] : (flip ? col.ink : acid ? col.ink : col.s[3]));
    if (step === 0) { const Hp = [O2[0] + 38, O2[1] + 8]; ln(O2, Hp, col.muted, 2); text(ctx, 'H', Hp[0] + 10, Hp[1], { color: col.s[0], size: 13, weight: 700, align: 'center' }); text(ctx, 'C=O 123 pm', O1[0] + 26, O1[1] - 14, { color: col.muted, size: 10.5 }); text(ctx, 'C–O 136 pm', O2[0] + 30, O2[1] + 24, { color: col.muted, size: 10.5 }); }
    if (step === 1) { const Hp = [O2[0] + 38 + 60 * e, O2[1] + 8 + 20 * e]; ln(O2, [O2[0] + 38 * (1 - e) + 10, O2[1] + 8 * (1 - e)], col.muted, 2 * (1 - e)); text(ctx, 'H⁺', Hp[0] + 10, Hp[1], { color: col.s[0], size: 14, weight: 700, align: 'center' }); arrow(ctx, O2[0] + 22, O2[1] + 10, O2[0] + 22 + 28, O2[1] + 22, col.s[0], 1.8, 7); }
    if (step === 2) text(ctx, '−', O2[0] + 18, O2[1] + 8, { color: col.s[3], size: 22, weight: 700, align: 'center' });
    if (step === 3) { text(ctx, '−', O1[0] + 18, O1[1] - 6, { color: col.s[3], size: 22, weight: 700, align: 'center' }); text(ctx, '↔', w * 0.84, cy, { color: col.ink, size: 20, align: 'center' }); }
    if (step === 4) { text(ctx, '½−', O1[0] + 24, O1[1] - 4, { color: col.s[3], size: 15, weight: 700, align: 'center' }); text(ctx, '½−', O2[0] + 24, O2[1] + 4, { color: col.s[3], size: 15, weight: 700, align: 'center' }); text(ctx, '127 pm each', O1[0] + 38, cy, { color: col.muted, size: 10.5, align: 'center' }); }
    const N = (a, b) => { text(ctx, a, w / 2, h - 44, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, b, w / 2, h - 24, { color: col.muted, size: 11, align: 'center' }); };
    if (step === 0) N('The two C–O bonds are different: C=O is shorter than C–O.', 'The O–H hydrogen is lost as H⁺ in water.');
    if (step === 1) N('The O–H bond breaks and H⁺ goes to water.', 'The oxygen keeps the electron pair and becomes O⁻.');
    if (step === 2) N('The anion: − on one oxygen, as in a Lewis structure.', 'But the other oxygen is next to it with a π bond.');
    if (step === 3) N('The π pair and the charge swap places (resonance).', 'Either oxygen can carry the charge; the two structures are equal.');
    if (step === 4) N('The real ion has two equal C–O bonds and ½− on each O.', 'Sharing the charge stabilises the anion: pKa about 4.8, against about 16 for an alcohol.');
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
