// Class 11 Biology, Excretory products (step player): one nephron from glomerulus to collecting duct. About 180 L of filtrate a day is made; the tubule takes back what the body needs,
// the loop of Henle builds a salty medulla, and the collecting duct decides how concentrated the urine is. Numbers are typical textbook values (osmolarity in mOsm/L).
import { canvas, text, title, line, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 290, label: 'A nephron drawn as a tube with the part being studied highlighted: glomerulus, proximal tubule, loop of Henle, distal tubule and collecting duct' });
  const T = ['1  Filtration in the glomerulus', '2  Proximal tubule: reabsorb most', '3  Descending limb: water leaves', '4  Ascending limb: salt leaves', '5  Distal tubule: fine tuning', '6  Collecting duct: make urine'];
  const OSM = ['Filtrate 300 mOsm/L (same as blood)', 'Filtrate still 300 (water follows salt)', 'Filtrate climbs from 300 to 1200', 'Filtrate falls from 1200 to about 100', 'Filtrate about 100 to 300', 'Urine up to 1200 (with ADH) or 100 (without)'];
  const SAY = [['180 L/day', 'water, glucose, salts, urea'], ['65-70 % of water,', 'Na⁺, glucose, amino acids back; H⁺ out'], ['water out,', 'salt stays in'], ['Na⁺ Cl⁻ out,', 'water stays in'], ['Na⁺ water (ADH, aldosterone)', 'HCO₃⁻ back; K⁺ H⁺ out'], ['water out (ADH), urea in,', 'urine to the pelvis']];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[step], col), top = t0 + 10, H = h - top - 70, X = (u) => 14 + u * (w - 28), Y = (v) => top + v * H;
    // cortex / medulla band
    ctx.fillStyle = col.soft; ctx.fillRect(0, Y(0.5), w, h - Y(0.5) - 56);
    text(ctx, 'CORTEX', 8, Y(0.5) - 8, { color: col.muted, size: 10, weight: 700 }); text(ctx, 'MEDULLA', 8, Y(0.5) + 10, { color: col.muted, size: 10, weight: 700 });
    const seg = [
      [[0.2, 0.3], [0.2, 0.46]],                                  // PCT
      [[0.2, 0.46], [0.2, 0.8], [0.29, 0.88], [0.38, 0.8]],        // descending + tip
      [[0.38, 0.8], [0.38, 0.4]],                                  // ascending
      [[0.38, 0.4], [0.6, 0.4], [0.6, 0.3]],                       // DCT
      [[0.72, 0.28], [0.72, 0.84]],                                // collecting duct
    ];
    const hi = [-1, 0, 1, 2, 3, 4][step];
    const P = (s) => s.map(([u, v]) => [X(u), Y(v)]);
    line(ctx, P([[0.6, 0.3], [0.6, 0.26], [0.72, 0.26], [0.72, 0.28]]), col.line, 7);
    seg.forEach((s, i) => line(ctx, P(s), i === hi ? col.s[3] : col.line, i === hi ? 9 : 7));
    // glomerulus and capsule
    const gx = X(0.2), gy = Y(0.18);
    ctx.beginPath(); ctx.arc(gx, gy, 24, 0, 7); ctx.fillStyle = step === 0 ? col.s[3] : col.line; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 3; ctx.strokeStyle = step === 0 ? col.s[3] : col.muted; ctx.stroke();
    ctx.beginPath(); ctx.arc(gx, gy, 11, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill();
    line(ctx, [[gx, gy + 24], [gx, Y(0.3)]], step === 0 ? col.s[3] : col.line, 7);
    text(ctx, 'glomerulus', gx - 30, gy - 32, { color: col.muted, size: 10, align: 'left' });
    arrow(ctx, X(0.04), gy - 6, gx - 12, gy - 6, col.s[0], 2.5, 7); text(ctx, 'blood in', X(0.02), gy - 16, { color: col.s[0], size: 10 });
    // labels
    const lab = (s, u, v, a = 'left') => text(ctx, s, X(u), Y(v), { color: col.muted, size: 10, align: a });
    lab('PCT', 0.04, 0.38); lab('loop of Henle', 0.07, 0.92); lab('DCT', 0.47, 0.35, 'center'); lab('collecting duct', 0.74, 0.55);
    // arrows showing movement for current step
    const out = (u, v, du, dv, c) => arrow(ctx, X(u), Y(v), X(u + du), Y(v + dv), c, 2, 7);
    if (step === 1) { out(0.2, 0.38, -0.08, 0, col.s[2]); }
    if (step === 2) { for (let k = 0; k < 3; k++) out(0.2, 0.55 + k * 0.1, 0.07, 0, col.s[0]); }
    if (step === 3) { for (let k = 0; k < 3; k++) out(0.38, 0.5 + k * 0.1, 0.07, 0, col.s[2]); }
    if (step === 4) { out(0.5, 0.4, 0, 0.1, col.s[2]); }
    if (step === 5) { for (let k = 0; k < 3; k++) out(0.72, 0.5 + k * 0.1, -0.07, 0, col.s[0]); arrow(ctx, X(0.72), Y(0.84), X(0.72), Y(0.84) + 22, col.s[3], 3, 8); text(ctx, 'urine', X(0.72) + 8, Y(0.84) + 20, { color: col.s[3], size: 10.5, weight: 700 }); }
    text(ctx, SAY[step][0], w / 2, h - 44, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, SAY[step][1], w / 2, h - 30, { color: col.ink, size: 11, align: 'center' });
    text(ctx, OSM[step], w / 2, h - 12, { color: col.s[3], size: 11, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
