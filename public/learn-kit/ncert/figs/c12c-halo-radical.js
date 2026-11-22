// Class 12 Chemistry, Haloalkanes (step player): free radical chlorination of methane, CH4 + Cl2 -> CH3Cl + HCl, in light. A chain reaction in three stages:
// initiation (light splits Cl2 into two Cl atoms), propagation (two steps that regenerate a radical, so one photon can make thousands of CH3Cl) and termination (two radicals meet).
// Because every H of the alkane can be replaced, the product is a mixture (CH3Cl, CH2Cl2, CHCl3, CCl4): a poor way to make one pure haloalkane.
import { canvas, text, title, arrow, loop, ease } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'The steps of free radical chlorination of methane' });
  const TT = ['Initiation: light splits Cl₂', 'Propagation 1: Cl· attacks CH₄', 'Propagation 2: CH₃· attacks Cl₂', 'The chain goes round and round', 'Termination: two radicals meet'];
  loop(host, (dt) => { t = Math.min(1, t + dt * 0.7); cv.redraw(); });
  const EQ = ['Cl–Cl  →(light)  Cl· + Cl·', 'Cl· + CH₄  →  HCl + CH₃·', 'CH₃· + Cl–Cl  →  CH₃Cl + Cl·', '', 'Cl· + Cl· → Cl₂     CH₃· + CH₃· → C₂H₆     CH₃· + Cl· → CH₃Cl'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), e = ease(t), cy = top + 56;
    const at = (x, y, s, f, r = 15, dot = false) => { ctx.fillStyle = f; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); text(ctx, s, x, y, { color: col.panel, size: 11, weight: 700, align: 'center' }); if (dot) { ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(x + r * 0.9, y - r * 0.9, 3.2, 0, 7); ctx.fill(); } };
    const Cl = col.s[2], C = col.ink, H = col.muted, L = w * 0.22, Rr = w * 0.78, mid = w / 2;
    if (step === 0) { const d = 20 + e * 70; at(mid - d, cy, 'Cl', Cl, 16, e > 0.9); at(mid + d, cy, 'Cl', Cl, 16, e > 0.9); if (e < 0.9) { ctx.strokeStyle = Cl; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(mid - d, cy); ctx.lineTo(mid + d, cy); ctx.stroke(); } text(ctx, '☀ UV light', mid, cy - 36, { color: col.s[0], size: 12, weight: 700, align: 'center' }); }
    if (step === 1) { at(L + e * 70, cy, 'Cl', Cl, 16, e < 1); at(L + 66, cy - 30 * 0, 'H', H, 10); at(mid + 12 + e * 20, cy, 'CH₃', C, 17, e > 0.8); at(L + 64 + e * 24, cy + 0, 'H', H, 10); arrow(ctx, L + 20, cy + 40, L + 80, cy + 40, col.s[3], 2, 7); text(ctx, 'H is taken off methane', mid, cy + 62, { color: col.muted, size: 11, align: 'center' }); }
    if (step === 2) { at(L + 6, cy, 'CH₃', C, 17, e < 1); at(mid - 6 + e * 22, cy, 'Cl', Cl, 15); at(mid + 40 + e * 36, cy, 'Cl', Cl, 15, e > 0.8); arrow(ctx, L + 26, cy + 38, mid + 6, cy + 38, col.s[3], 2, 7); text(ctx, 'CH₃Cl is made, a new Cl· is freed', mid, cy + 62, { color: col.muted, size: 11, align: 'center' }); }
    if (step === 3) { const r = Math.min(w, h) * 0.2, cx = w / 2, c2 = cy + 70; ctx.strokeStyle = col.line; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(cx, c2, r, 0, 7); ctx.stroke(); const a = -Math.PI / 2 + t * 0; const ph = (performance.now() / 1500) % (2 * Math.PI); const px = cx + r * Math.cos(ph), py = c2 + r * Math.sin(ph); at(px, py, ph < Math.PI ? 'Cl·' : 'CH₃·', ph < Math.PI ? Cl : C, 15); text(ctx, 'Cl·', cx, c2 - r - 20, { color: col.s[2], size: 12, weight: 700, align: 'center' }); text(ctx, 'CH₃·', cx, c2 + r + 20, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'each turn makes one CH₃Cl and one HCl', cx, c2 - r - 40, { color: col.muted, size: 11, align: 'center' }); }
    if (step === 4) { at(L - 8 + e * 30, cy, 'Cl', Cl, 14, true); at(L + 40 - e * 0, cy, 'Cl', Cl, 14, true); at(mid + 20, cy, 'CH₃', C, 15, true); at(Rr - 16, cy, 'CH₃', C, 15, true); text(ctx, 'any two radicals joining ends the chain', mid, cy + 40, { color: col.muted, size: 11, align: 'center' }); }
    if (step !== 3) text(ctx, EQ[step], w / 2, cy + 110, { color: col.ink, size: step === 4 ? 11 : 14, weight: 700, align: 'center' });
    text(ctx, step === 3 ? 'one photon can start thousands of cycles' : step === 4 ? 'the more CH₃Cl there is, the more Cl· attack it: mixtures form' : 'a dot (·) is an unpaired electron', w / 2, h - 14, { color: col.muted, size: 11, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
