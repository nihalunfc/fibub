// Class 11 Chemistry, Hydrocarbons (step player): electrophilic substitution in benzene, shown for Friedel-Crafts alkylation, C6H6 + CH3Cl --AlCl3--> C6H5CH3 + HCl.
// General pattern for every electrophilic substitution (nitration, halogenation, sulphonation, acylation): (1) make a strong electrophile E+, (2) the aromatic pi system attacks it and forms the arenium ion
// (sigma complex, aromaticity lost, charge spread over three carbons), (3) loss of H+ restores aromaticity. Substitution, not addition, because the ring keeps its extra stability.
import { canvas, text, title } from '../../kit.js';

const S = [
  ['1. A Lewis acid makes the electrophile', ['CH₃–Cl + AlCl₃ → CH₃⁺ + AlCl₄⁻', 'AlCl₃ pulls the Cl away: a methyl cation (electrophile)']],
  ['2. The ring’s π cloud attacks CH₃⁺', ['curved arrow: π pair of the ring → CH₃⁺', 'benzene is a weak nucleophile, so a strong electrophile is needed']],
  ['3. The arenium ion (σ complex) forms', ['aromaticity is lost; the + charge is spread over 3 carbons', 'high energy: this is the slow, rate-determining step']],
  ['4. H⁺ leaves, the ring becomes aromatic again', ['the C–H bond electrons return to the ring', 'AlCl₄⁻ takes the H⁺: HCl is formed and AlCl₃ is regenerated']],
  ['5. Product: methylbenzene (toluene)', ['C₆H₆ + CH₃Cl → C₆H₅CH₃ + HCl (AlCl₃ catalyst)', 'a substitution: one ring H replaced; the ring stays aromatic']],
];
export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.8, max: 460, min: 300, label: 'Friedel-Crafts methylation of benzene in five steps' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, S[st][0], col) + 8, cy = top + 74, R = col.s[3], B = col.s[0], G = col.s[2];
    const hex = (cx, y, r, ring, gap) => { ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = (i / 6) * 2 * Math.PI - Math.PI / 2; if (gap && i === 5) { continue; } const x = cx + r * Math.cos(a), yy = y + r * Math.sin(a); i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } if (!gap) ctx.closePath(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke(); if (ring) { ctx.beginPath(); ctx.arc(cx, y, r * 0.58, 0, 7); ctx.strokeStyle = B; ctx.lineWidth = 2; ctx.stroke(); } };
    const hx = w * 0.3, r = 36;
    if (st === 0) { text(ctx, 'CH₃–Cl', w * 0.2, cy, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, '+ AlCl₃', w * 0.42, cy, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, '→', w * 0.58, cy, { color: col.muted, size: 16, align: 'center' }); text(ctx, 'CH₃⁺', w * 0.7, cy, { color: R, size: 15, weight: 700, align: 'center' }); text(ctx, '+ AlCl₄⁻', w * 0.88, cy, { color: B, size: 13, weight: 700, align: 'center' }); }
    if (st === 1) { hex(hx, cy, r, true); text(ctx, 'CH₃⁺', w * 0.72, cy - 4, { color: R, size: 15, weight: 700, align: 'center' }); ctx.strokeStyle = G; ctx.fillStyle = G; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(hx + r * 0.4, cy - r * 0.4); ctx.quadraticCurveTo(w * 0.52, cy - 62, w * 0.65, cy - 8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(w * 0.65, cy - 8); ctx.lineTo(w * 0.65 - 10, cy - 12); ctx.lineTo(w * 0.65 - 3, cy - 20); ctx.fill(); }
    if (st === 2) { hex(hx, cy, r, false, true); ctx.beginPath(); ctx.arc(hx, cy, r * 0.6, Math.PI * 1.15, Math.PI * 2.45); ctx.strokeStyle = R; ctx.lineWidth = 2; ctx.stroke(); text(ctx, '+', hx, cy, { color: R, size: 18, weight: 700, align: 'center' }); text(ctx, 'H', hx + r * 0.9, cy - r * 0.9, { color: col.ink, size: 11, weight: 700 }); text(ctx, 'CH₃', hx + r * 0.9, cy - r * 0.9 + 14, { color: col.ink, size: 11, weight: 700 }); text(ctx, 'arenium ion', w * 0.7, cy, { color: col.muted, size: 12, weight: 700, align: 'center' }); }
    if (st === 3) { hex(hx, cy, r, true); text(ctx, 'CH₃', hx + r + 8, cy - r * 0.9, { color: col.ink, size: 12, weight: 700 }); text(ctx, '+ H⁺ → HCl', w * 0.74, cy, { color: G, size: 13, weight: 700, align: 'center' }); }
    if (st === 4) { hex(w * 0.3, cy, r, true); text(ctx, 'CH₃', w * 0.3 + r + 6, cy - r * 0.9, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'methylbenzene', w * 0.7, cy, { color: G, size: 14, weight: 700, align: 'center' }); }
    S[st][1].forEach((l, i) => text(ctx, l, 14, cy + 70 + i * 22, { color: col.ink, size: 11.5, weight: i ? 400 : 700 }));
    text(ctx, `step ${st + 1} of ${S.length}`, w - 12, h - 12, { color: col.muted, size: 10.5, align: 'right' });
  };
  return { step(i) { st = Math.min(i, S.length - 1); cv.redraw(); } };
}
