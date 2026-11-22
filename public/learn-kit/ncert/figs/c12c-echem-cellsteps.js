// Class 12 Chemistry, Electrochemistry (step player): reading the cell notation Zn(s) | Zn2+(aq) || Cu2+(aq) | Cu(s). Anode on the left (oxidation, negative), cathode on the right (reduction, positive),
// || is the salt bridge. E0cell = E0(right) - E0(left) = 0.34 - (-0.76) = 1.10 V. Electrons go through the wire from Zn to Cu; the conventional current goes the other way.
import { canvas, text, title, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const TITLES = ['Two half-cells joined by a salt bridge', 'Left electrode: oxidation (anode, −)', 'Right electrode: reduction (cathode, +)', 'Electrons in the wire, ions in the bridge', 'Add the half-reactions: the cell reaction', 'Cell voltage E°cell = E°right − E°left'];
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 320, label: 'A zinc copper cell in six steps with electrons moving from zinc to copper' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, TITLES[step], col) + 8, bw = (w - 60) / 2.2, by = t0 + 70, bh = 96, xl = 20, xr = w - 20 - bw;
    const beaker = (x, c, hi) => { ctx.fillStyle = c; ctx.globalAlpha = hi ? 0.28 : 0.14; ctx.fillRect(x, by + 14, bw, bh - 14); ctx.globalAlpha = 1; ctx.strokeStyle = hi ? col.s[2] : col.ink; ctx.lineWidth = hi ? 3 : 2; ctx.strokeRect(x, by, bw, bh); };
    beaker(xl, col.s[0], step === 1); beaker(xr, col.s[1], step === 2);
    ctx.fillStyle = col.muted; ctx.fillRect(xl + bw / 2 - 6, by - 26, 12, bh + 10); ctx.fillRect(xr + bw / 2 - 6, by - 26, 12, bh + 10);
    text(ctx, 'Zn', xl + bw / 2, by + bh + 22, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'Zn²⁺ (aq)', xl + bw / 2, by + bh - 10, { color: col.ink, size: 10.5, align: 'center' });
    text(ctx, 'Cu', xr + bw / 2, by + bh + 22, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'Cu²⁺ (aq)', xr + bw / 2, by + bh - 10, { color: col.ink, size: 10.5, align: 'center' });
    // salt bridge
    ctx.strokeStyle = col.s[4]; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(xl + bw - 10, by + 24); ctx.lineTo(xl + bw - 10, by - 10); ctx.lineTo(xr + 10, by - 10); ctx.lineTo(xr + 10, by + 24); ctx.stroke();
    // wire
    const wy = by - 40, x1 = xl + bw / 2, x2 = xr + bw / 2; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x1, by - 26); ctx.lineTo(x1, wy); ctx.lineTo(x2, wy); ctx.lineTo(x2, by - 26); ctx.stroke();
    if (step >= 3) { for (let i = 0; i < 5; i++) { const u = ((t * 0.3 + i / 5) % 1) * (x2 - x1); ctx.beginPath(); ctx.arc(x1 + u, wy, 3.5, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill(); } text(ctx, 'e⁻', w / 2, wy - 10, { color: col.s[2], size: 11, weight: 700, align: 'center' }); text(ctx, 'ions move through the bridge', w / 2, by - 24, { color: col.s[4], size: 10, align: 'center', halo: col.panel }); }
    if (step === 0) { text(ctx, 'Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s)', w / 2, by + bh + 52, { color: col.ink, size: 12.5, weight: 700, align: 'center' }); text(ctx, '| = phase boundary, || = salt bridge', w / 2, by + bh + 72, { color: col.muted, size: 11, align: 'center' }); }
    if (step === 1) { text(ctx, 'Zn → Zn²⁺ + 2e⁻   (E° of Zn²⁺/Zn = −0.76 V)', w / 2, by + bh + 52, { color: col.s[3], size: 12, weight: 700, align: 'center' }); text(ctx, 'zinc atoms lose electrons and dissolve', w / 2, by + bh + 72, { color: col.muted, size: 11, align: 'center' }); }
    if (step === 2) { text(ctx, 'Cu²⁺ + 2e⁻ → Cu   (E° of Cu²⁺/Cu = +0.34 V)', w / 2, by + bh + 52, { color: col.s[0], size: 12, weight: 700, align: 'center' }); text(ctx, 'copper ions take electrons and plate out', w / 2, by + bh + 72, { color: col.muted, size: 11, align: 'center' }); }
    if (step === 3) text(ctx, 'Electrons: Zn → Cu. Conventional current: Cu → Zn.', w / 2, by + bh + 52, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    if (step === 4) { text(ctx, 'Zn + Cu²⁺ → Zn²⁺ + Cu', w / 2, by + bh + 52, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, 'the 2e⁻ cancel: they travel, they are not left over', w / 2, by + bh + 72, { color: col.muted, size: 11, align: 'center' }); }
    if (step === 5) { text(ctx, 'E°cell = 0.34 − (−0.76) = 1.10 V', w / 2, by + bh + 52, { color: col.s[2], size: 14, weight: 700, align: 'center' }); text(ctx, 'Positive, so the reaction runs by itself (ΔG° < 0).', w / 2, by + bh + 72, { color: col.muted, size: 11, align: 'center' }); }
    if (step >= 1) { text(ctx, 'anode −', xl + 6, by + 30, { color: col.s[3], size: 10.5, weight: 700 }); text(ctx, 'cathode +', xr + bw - 6, by + 30, { color: col.s[0], size: 10.5, weight: 700, align: 'right' }); }
  };
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
