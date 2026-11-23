// Class 11 Chemistry, Hydrocarbons (step player): electrophilic addition of HBr to propene, CH3-CH=CH2 + HBr -> CH3-CHBr-CH3 (Markovnikov). The pi electrons attack H+; H adds to the carbon that gives the more stable
// carbocation (2 deg, CH3-CH+-CH3, not 1 deg). Bromide then attacks the cation. Markovnikov's rule: in HX addition to an unsymmetrical alkene, the negative part goes to the carbon with fewer hydrogens.
// With peroxide (and HBr only) a free radical mechanism gives the anti-Markovnikov product, 1-bromopropane (Kharasch effect).
import { canvas, text, title } from '../../kit.js';

const S = [
  ['1. Propene meets HBr', ['CH₃–CH=CH₂ + H–Br', 'H is δ+ (electrophile); the C=C π bond is electron-rich']],
  ['2. The π electrons attack the H of HBr', ['curved arrow: π pair → H; H–Br pair → Br', 'H joins one carbon, the other becomes C⁺']],
  ['3. Two carbocations are possible', ['H on CH₂ gives CH₃–C⁺H–CH₃ (secondary, 6 α C–H)', 'H on CH gives CH₃–CH₂–C⁺H₂ (primary, 3 α C–H)']],
  ['4. The more stable (secondary) cation forms faster', ['2° > 1°: lower energy, lower barrier', 'so almost all the reaction goes through CH₃–C⁺H–CH₃']],
  ['5. Bromide attacks the carbocation', ['Br⁻ donates a pair to C⁺: new C–Br bond', 'product: CH₃–CHBr–CH₃, 2-bromopropane (Markovnikov)']],
  ['6. With a peroxide, HBr adds the other way round', ['free radicals: Br· adds first to the CH₂ end', 'product: CH₃CH₂CH₂Br, 1-bromopropane (anti-Markovnikov)']],
];
export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 1.0, max: 480, min: 340, label: 'Electrophilic addition of HBr to propene in six steps' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, S[st][0], col) + 12, cy = top + 70, R = col.s[3], B = col.s[0], G = col.s[2];
    const at = (x, y, s, c) => { ctx.beginPath(); ctx.arc(x, y, 17, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = c || col.ink; ctx.lineWidth = 2; ctx.stroke(); text(ctx, s, x, y, { color: col.ink, size: 11, weight: 700, align: 'center' }); };
    const bd = (x0, y0, x1, y1, dbl) => { ctx.strokeStyle = col.ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); if (dbl) { ctx.beginPath(); ctx.moveTo(x0, y0 + 5); ctx.lineTo(x1, y1 + 5); ctx.stroke(); } };
    const cur = (x0, y0, x1, y1) => { ctx.strokeStyle = G; ctx.fillStyle = G; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, Math.min(y0, y1) - 30, x1, y1); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 4, y1 - 9); ctx.lineTo(x1 + 7, y1 - 6); ctx.fill(); };
    const x1 = w * 0.1, x2 = w * 0.28, x3 = w * 0.46, xh = w * 0.7, xb = w * 0.9;
    // propene chain
    const chain = (lbl2, lbl3, dbl, plus) => { at(x1, cy, 'CH₃'); bd(x1 + 17, cy, x2 - 17, cy); at(x2, cy, lbl2, plus === 2 ? R : null); bd(x2 + 17, cy, x3 - 17, cy, dbl); at(x3, cy, lbl3, plus === 3 ? R : null); };
    if (st === 0) { chain('CH', 'CH₂', true); at(xh, cy, 'H', B); bd(xh + 17, cy, xb - 17, cy); at(xb, cy, 'Br', B); text(ctx, 'δ+', xh, cy - 28, { color: R, size: 11, weight: 700, align: 'center' }); }
    if (st === 1) { chain('CH', 'CH₂', true); at(xh - 24, cy, 'H', B); at(xb, cy, 'Br', B); bd(xh - 6, cy, xb - 17, cy); cur(x2 + 28, cy + 6, xh - 36, cy - 10); cur(xh - 12, cy + 10, xb - 6, cy + 20); }
    if (st === 2) { text(ctx, 'path A', 12, cy - 32, { color: G, size: 11, weight: 700 }); chain('C⁺H', 'CH₃', false, 2); text(ctx, '2° (stable)', x2, cy + 28, { color: R, size: 10.5, weight: 700, align: 'center' }); text(ctx, 'path B', 12, cy + 52, { color: B, size: 11, weight: 700 }); at(x1, cy + 90, 'CH₃'); bd(x1 + 17, cy + 90, x2 - 17, cy + 90); at(x2, cy + 90, 'CH₂'); bd(x2 + 17, cy + 90, x3 - 17, cy + 90); at(x3, cy + 90, 'C⁺H₂', R); text(ctx, '1° (less stable)', x3, cy + 118, { color: col.muted, size: 10.5, weight: 700, align: 'center' }); }
    if (st === 3) { chain('C⁺H', 'CH₃', false, 2); text(ctx, 'major path', x2, cy + 28, { color: G, size: 11, weight: 700, align: 'center' }); const bw = (w - 60) / 2; ctx.fillStyle = G; ctx.fillRect(30, cy + 56, bw * 0.95, 14); ctx.fillStyle = col.line; ctx.fillRect(30, cy + 80, bw * 0.12, 14); text(ctx, '2° path: much faster', 36 + bw, cy + 63, { color: col.ink, size: 10.5 }); text(ctx, '1° path: slow', 36 + bw * 0.14, cy + 87, { color: col.ink, size: 10.5 }); }
    if (st === 4) { chain('C⁺H', 'CH₃', false, 2); at(xb, cy, 'Br⁻', B); cur(xb - 18, cy + 8, x2 + 22, cy + 8); text(ctx, 'CH₃–CHBr–CH₃', w / 2, cy + 56, { color: G, size: 14, weight: 700, align: 'center' }); }
    if (st === 5) { text(ctx, 'CH₃CH=CH₂ + HBr  (+ peroxide)', w / 2, cy - 10, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, '→ CH₃CH₂CH₂Br', w / 2, cy + 20, { color: R, size: 14, weight: 700, align: 'center' }); text(ctx, 'only for HBr; HCl and HI do not do this', w / 2, cy + 50, { color: col.muted, size: 10.5, align: 'center' }); }
    S[st][1].forEach((l, i) => text(ctx, l, 14, cy + 140 + i * 20, { color: col.ink, size: 11, weight: i ? 400 : 700 }));
    text(ctx, `step ${st + 1} of ${S.length}`, w - 12, h - 12, { color: col.muted, size: 10.5, align: 'right' });
  };
  return { step(i) { st = Math.min(i, S.length - 1); cv.redraw(); } };
}
