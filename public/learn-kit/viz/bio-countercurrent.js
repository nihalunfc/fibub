// The loop of Henle and collecting duct building a salty medulla (the countercurrent mechanism), and ADH deciding how
// much water is taken back. Pick the ADH level: with a lot of ADH the collecting duct is leaky to water, water follows
// the gradient out into the medulla, and the urine becomes concentrated (up to about 1200 mOsm/L in humans).
import { canvas, loop, row, choice, readout, text, title } from '../kit.js';

export default function (host) {
  let adh = 'normal', t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 420, min: 330, label: 'Loop of Henle and collecting duct with water and salt moving, depending on ADH' });
  const ctl = row(host);
  choice(ctl, 'ADH (antidiuretic hormone)', [['low', 'Low (drank a lot)'], ['normal', 'Normal'], ['high', 'High (dehydrated)']], adh, (v) => { adh = v; show(); });
  loop(host, (dt) => { t += dt; cv.redraw(); }).button(ctl);
  const out = readout(host);
  const URINE = { low: 100, normal: 600, high: 1200 }, VOL = { low: 'large volume, dilute', normal: 'normal volume', high: 'small volume, concentrated' };
  const show = () => { out.innerHTML = `ADH <b>${adh}</b>: urine about <b>${URINE[adh]} mOsm/L</b> (${VOL[adh]}). Descending limb: permeable to water, not to salt, so water leaves and the fluid gets saltier going down. Ascending limb: pumps out Na⁺ and Cl⁻ but is impermeable to water, so the fluid gets dilute going up. The salt it pumps out keeps the medulla gradient (300 to 1200 mOsm/L).`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Medulla gradient (mOsm/L)', col);
    const T = 46, B = h - 40, x1 = w * 0.3, x2 = w * 0.48, x3 = w * 0.74, flow = (t * 40);
    // gradient background (cortex to deep medulla)
    for (let i = 0; i < 24; i++) { const f = i / 23; ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.08 + 0.4 * f; ctx.fillRect(0, T + (B - T) * f, w, (B - T) / 23 + 1); }
    ctx.globalAlpha = 1;
    [[0, '300'], [0.5, '700'], [1, '1200']].forEach(([f, s]) => text(ctx, s, 6, T + (B - T) * f + (f === 1 ? -6 : 6), { color: col.ink, size: 11, weight: 700 }));
    text(ctx, 'cortex', w - 8, T + 6, { color: col.muted, size: 10, align: 'right' }); text(ctx, 'deep medulla', w - 8, B - 6, { color: col.muted, size: 10, align: 'right' });
    const tube = (x, up, c, lab) => { ctx.strokeStyle = c; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, T); ctx.lineTo(x, B); ctx.stroke(); text(ctx, lab, x, T - 6, { color: c, size: 10, weight: 700, align: 'center' }); };
    // loop: descending (x1) joined at the bottom to ascending (x2); collecting duct x3
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 12; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(x1, T); ctx.lineTo(x1, B); ctx.arc((x1 + x2) / 2, B, (x2 - x1) / 2, Math.PI, 0, true); ctx.lineTo(x2, T); ctx.stroke();
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x3, T); ctx.lineTo(x3, B); ctx.stroke();
    text(ctx, 'descending', x1 - 6, T + 18, { color: col.s[0], size: 10, weight: 700, align: 'right' });
    text(ctx, 'ascending', x2 + 12, T + 40, { color: col.s[0], size: 10, weight: 700 });
    text(ctx, 'collecting duct', x3, T - 8, { color: col.s[2], size: 10, weight: 700, align: 'center' });
    text(ctx, 'filtrate in', x1, T - 8, { color: col.muted, size: 9.5, align: 'center', fit: false });
    // moving filtrate dots (darker lower down inside the descending limb)
    const dots = (x, dir, n) => { for (let i = 0; i < n; i++) { const f = ((i / n) + dir * t * 0.12 + 1000) % 1, y = T + f * (B - T); ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 7); ctx.fillStyle = col.ink; ctx.globalAlpha = 0.5; ctx.fill(); } ctx.globalAlpha = 1; };
    dots(x1, 1, 9); dots(x2, -1, 9); dots(x3, 1, 9);
    // water (blue) leaving descending limb, salt (orange arrows) leaving ascending limb, water leaving collecting duct if ADH
    const rate = { low: 0.2, normal: 0.7, high: 1.4 }[adh];
    for (let i = 0; i < 6; i++) {
      const f = ((i / 6) + t * 0.35) % 1, y = T + 30 + f * (B - T - 60);
      ctx.fillStyle = col.s[4]; ctx.beginPath(); ctx.arc(x1 - 10 - f * 22, y, 3.2, 0, 7); ctx.fill();
      ctx.strokeStyle = col.s[5]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x2 + 8, y + 10); ctx.lineTo(x2 + 24 + f * 6, y + 10); ctx.stroke();
    }
    const nW = Math.round(8 * rate);
    for (let i = 0; i < nW; i++) { const f = ((i / Math.max(1, nW)) + t * 0.3) % 1, y = T + 20 + f * (B - T - 40); ctx.fillStyle = col.s[4]; ctx.beginPath(); ctx.arc(x3 + 10 + f * 26, y, 3.2, 0, 7); ctx.fill(); }
    text(ctx, 'water out', x3 + 18, T + 70, { color: col.s[4], size: 10, weight: 700, fit: false });
    text(ctx, 'Na⁺ Cl⁻ pumped out', x2 + 14, B - 60, { color: col.s[5], size: 10, weight: 700, fit: false });
    text(ctx, `Urine: ${URINE[adh]} mOsm/L`, x3, B + 20, { color: col.ink, size: 12, weight: 700, align: 'center' });
  };
  show();
}
