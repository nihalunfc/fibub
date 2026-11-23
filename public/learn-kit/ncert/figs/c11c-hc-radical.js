// Class 11 Chemistry, Hydrocarbons (step player): free radical chlorination of methane, CH4 + Cl2 -> CH3Cl + HCl (light or heat, UV). A chain mechanism: initiation (Cl2 splits into two Cl radicals),
// propagation (Cl. + CH4 -> HCl + CH3. then CH3. + Cl2 -> CH3Cl + Cl., the Cl. is regenerated, so one photon can cause thousands of cycles), termination (two radicals meet).
import { canvas, text, title } from '../../kit.js';

const S = [
  ['1. Initiation: light splits Cl₂ into two chlorine radicals', ['Cl–Cl  →(UV light)→  Cl· + ·Cl', 'homolytic fission: one electron to each Cl'], 'init'],
  ['2. Propagation, step 1: Cl· takes H from methane', ['Cl· + H–CH₃ → H–Cl + ·CH₃', 'a methyl radical is made; HCl is a product'], 'p1'],
  ['3. Propagation, step 2: ·CH₃ takes Cl from Cl₂', ['·CH₃ + Cl–Cl → CH₃Cl + Cl·', 'chloromethane is made and a new Cl· is regenerated'], 'p2'],
  ['4. The chain repeats thousands of times', ['Cl· → step 1 → step 2 → Cl· → …', 'one photon of light can make about 10⁴ molecules of CH₃Cl'], 'cycle'],
  ['5. Termination: two radicals meet and the chain stops', ['Cl· + ·Cl → Cl₂', '·CH₃ + ·CH₃ → CH₃–CH₃   or   ·CH₃ + Cl· → CH₃Cl'], 'term'],
  ['6. Overall: further substitution is possible', ['CH₄ → CH₃Cl → CH₂Cl₂ → CHCl₃ → CCl₄ with excess Cl₂', 'overall for the first step: CH₄ + Cl₂ → CH₃Cl + HCl'], 'all'],
];
export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 290, label: 'Free radical chlorination of methane in six steps' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, S[st][0], col) + 14, cy = top + 64, k = S[st][2];
    const atom = (x, y, s, c, r = 22) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.stroke(); text(ctx, s, x, y, { color: col.ink, size: 12, weight: 700, align: 'center' }); };
    const bond = (x0, x1, y) => { ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); };
    const arrowR = (x0, x1, y, lab) => { ctx.strokeStyle = col.s[4]; ctx.fillStyle = col.s[4]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1 - 9, y - 5); ctx.lineTo(x1 - 9, y + 5); ctx.fill(); if (lab) text(ctx, lab, (x0 + x1) / 2, y - 12, { color: col.muted, size: 10, align: 'center' }); };
    const R = col.s[3], B = col.s[0];
    if (k === 'init') { atom(w * 0.18, cy, 'Cl', B); bond(w * 0.18 + 22, w * 0.34, cy); atom(w * 0.34 + 22, cy, 'Cl', B); arrowR(w * 0.5, w * 0.62, cy, 'UV'); atom(w * 0.72, cy, 'Cl·', R); atom(w * 0.9, cy, '·Cl', R); }
    if (k === 'p1') { atom(w * 0.1, cy, 'Cl·', R); atom(w * 0.4, cy, 'H', B, 15); bond(w * 0.4 + 15, w * 0.5, cy); atom(w * 0.5 + 22, cy, 'CH₃', B); arrowR(w * 0.64, w * 0.74, cy); text(ctx, 'HCl + ·CH₃', w * 0.87, cy, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    if (k === 'p2') { atom(w * 0.1, cy, '·CH₃', R, 24); atom(w * 0.34, cy, 'Cl', B, 17); bond(w * 0.34 + 17, w * 0.42, cy); atom(w * 0.42 + 17, cy, 'Cl', B, 17); arrowR(w * 0.57, w * 0.66, cy); text(ctx, 'CH₃Cl + Cl·', w * 0.84, cy, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); }
    if (k === 'cycle') { const rr = 50, x = w / 2, y = cy + 6; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, rr, 0.3, 2 * Math.PI - 0.3); ctx.stroke(); text(ctx, 'Cl·', x, y - rr, { color: R, size: 13, weight: 700, align: 'center', halo: col.panel }); text(ctx, '·CH₃', x, y + rr, { color: R, size: 13, weight: 700, align: 'center', halo: col.panel }); text(ctx, '+CH₄', x - rr - 6, y, { color: col.muted, size: 10.5, align: 'right' }); text(ctx, '+Cl₂', x + rr + 6, y, { color: col.muted, size: 10.5 }); text(ctx, 'chain', x, y, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    if (k === 'term') { ['Cl· + ·Cl → Cl₂', '·CH₃ + ·CH₃ → C₂H₆', '·CH₃ + Cl· → CH₃Cl'].forEach((s, i) => text(ctx, s, w / 2, cy - 20 + i * 30, { color: R, size: 13, weight: 700, align: 'center' })); text(ctx, 'rare, because radicals are few and far apart', w / 2, cy + 70, { color: col.muted, size: 10.5, align: 'center' }); }
    if (k === 'all') { ['CH₄', 'CH₃Cl', 'CH₂Cl₂', 'CHCl₃', 'CCl₄'].forEach((s, i) => { const x = w * (0.1 + i * 0.2); text(ctx, s, x, cy, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); if (i < 4) arrowR(x + 22, x + w * 0.2 - 24, cy + 18, ''); }); text(ctx, '+Cl₂ each time (HCl lost)', w / 2, cy + 44, { color: col.muted, size: 10.5, align: 'center' }); }
    S[st][1].forEach((l, i) => text(ctx, l, 14, cy + 90 + i * 22, { color: col.ink, size: 11.5, weight: i ? 400 : 700 }));
    text(ctx, `step ${st + 1} of ${S.length}`, w - 12, h - 12, { color: col.muted, size: 10.5, align: 'right' });
  };
  return { step(i) { st = Math.min(i, S.length - 1); cv.redraw(); } };
}
