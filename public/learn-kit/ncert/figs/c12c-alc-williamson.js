// Class 12 Chemistry, Alcohols, Phenols and Ethers: Williamson ether synthesis (step player). Alkoxide (RO-) + primary alkyl halide -> ether + halide, by SN2.
// Step 1 makes the alkoxide with sodium. Step 2-3: the nucleophile attacks the back of the C-Br carbon, inverting it, as Br leaves. Step 4: a tertiary halide cannot be attacked from the back, so the alkoxide acts as a base and gives an alkene.
import { canvas, text, title, arrow, loop, ease } from '../../kit.js';

const TT = ['Make the alkoxide', 'Nucleophile meets a primary halide', 'Back-side attack (SN2)', 'The ether forms', 'Why a tertiary halide fails'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 360, min: 290, label: 'Williamson ether synthesis step by step' });
  loop(host, (dt) => { t = Math.min(1, t + dt * 0.7); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), cy = top + (h - top) * 0.36, e = ease(t);
    const box = (s, x, y, c, wd = 0) => { ctx.font = '700 13px system-ui'; const tw = Math.max(wd, ctx.measureText(s).width + 16); ctx.fillStyle = col.panel; ctx.strokeStyle = c; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.roundRect(x - tw / 2, y - 15, tw, 30, 8); ctx.fill(); ctx.stroke(); text(ctx, s, x, y, { color: col.ink, size: 13, weight: 700, align: 'center' }); };
    const note = (a, b) => { text(ctx, a, w / 2, h - 46, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, b, w / 2, h - 26, { color: col.muted, size: 11, align: 'center' }); };
    if (step === 0) {
      box('CH₃CH₂–OH', w * 0.22, cy, col.s[0]); text(ctx, '+ Na', w * 0.42, cy, { color: col.ink, size: 13, align: 'center' }); arrow(ctx, w * 0.5, cy, w * 0.62, cy, col.ink, 2, 8); box('CH₃CH₂–O⁻ Na⁺', w * 0.8, cy, col.s[3]);
      for (let i = 0; i < 4; i++) { const y = cy + 40 - ((t * 60 + i * 15) % 60), x = w * 0.7 + 8 * Math.sin(i * 2 + t * 5); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.arc(x, y + 10, 3.5, 0, 7); ctx.stroke(); }
      text(ctx, '+ ½ H₂ ↑', w * 0.82, cy + 36, { color: col.muted, size: 11, align: 'center' });
      note('Sodium removes the O–H hydrogen as H₂ gas.', 'The alkoxide ion is a strong nucleophile (it has a full negative charge).');
    } else if (step <= 3) {
      const ox = step === 1 ? w * 0.2 : step === 2 ? w * 0.2 + (w * 0.18) * e : w * 0.72, cx = step === 3 ? w * 0.55 : w * 0.58, bx = step === 1 ? w * 0.85 : step === 2 ? w * 0.85 + (w * 0.0) + 12 * e : w * 0.9 + 6;
      const cxx = step === 3 ? w * 0.56 : w * 0.58;
      if (step < 3) { box('CH₃CH₂–O⁻', ox, cy, col.s[3]); } else { box('CH₃CH₂–O–CH₂CH₃', w * 0.42, cy, col.s[3]); }
      if (step < 3) { text(ctx, 'CH₃CH₂', cxx, cy - 26, { color: col.ink, size: 11, align: 'center' }); box('C', cxx, cy, col.ink, 30); box('Br', bx, cy, col.s[2]); ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cxx + 15, cy); ctx.lineTo(bx - 20, cy); ctx.stroke(); }
      if (step === 1) { note('Primary halide: the carbon is easy to reach.', 'The alkoxide is attracted to the slightly positive C–Br carbon (δ⁺).'); text(ctx, 'δ⁺', cxx, cy + 26, { color: col.s[0], size: 11, align: 'center' }); }
      if (step === 2) { arrow(ctx, ox + 40, cy - 30, cxx - 14, cy - 18, col.s[0], 2.4, 9); note('One step: O attacks C from the side opposite Br.', 'Rate = k [RO⁻][RX]: second order (SN2), with inversion at carbon.'); }
      if (step === 3) { box('Br⁻', w * 0.82, cy, col.s[2]); text(ctx, '+', w * 0.7, cy, { color: col.ink, size: 14, align: 'center' }); note('Product: ethoxyethane (diethyl ether) and NaBr.', 'To make an unsymmetrical ether, put the bulky group on the alkoxide, not the halide.'); }
    } else {
      box('(CH₃)₃C–Br  +  CH₃CH₂O⁻', w / 2, cy - 14, col.s[2]); arrow(ctx, w / 2, cy + 8, w / 2, cy + 38, col.ink, 2, 8); text(ctx, 'base, not nucleophile', w / 2 + 12, cy + 24, { color: col.muted, size: 10.5 }); box('(CH₃)₂C=CH₂  +  CH₃CH₂OH  +  Br⁻', w / 2, cy + 56, col.bad || col.s[3]);
      note('Tertiary halide: back side blocked, so the alkoxide acts as a base.', 'Result: an alkene (elimination), not the ether. Use primary or methyl halides.');
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
