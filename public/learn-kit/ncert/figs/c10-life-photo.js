// Class 10 Life Processes (step player): photosynthesis in a leaf. Water rises from the roots, CO2 enters through the
// stomata, chlorophyll in the chloroplasts absorbs light, light energy splits water (releasing O2) and the hydrogen is
// used to reduce CO2 to carbohydrate (glucose, stored as starch): 6CO2 + 6H2O -> C6H12O6 + 6O2.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';

const CAP = ['Roots take up water and minerals; water climbs the stem through the xylem.', 'Carbon dioxide from the air enters through the stomata, tiny pores on the leaf.', 'Sunlight is absorbed by chlorophyll, the green pigment inside chloroplasts.', 'Light energy splits water into hydrogen and oxygen. The oxygen leaves through the stomata.', 'The hydrogen is used to turn CO₂ into carbohydrate: glucose.', 'Glucose is sent to other parts, or stored as starch. Starch turns blue-black with iodine.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 1.04, max: 440, min: 290, label: 'A leaf taking in water, carbon dioxide and light and making glucose and oxygen' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Photosynthesis, step ' + (step + 1) + ' of 6', col) + 6, cx = w * 0.5, ly = top + (h - top) * 0.36, lw = w * 0.34, lh = 46;
    // stem + root
    const sy = ly + lh, by = h - 92;
    line(ctx, [[cx, sy], [cx, by]], col.s[3], 6); line(ctx, [[cx, by], [cx - 22, by + 18]], col.s[6], 3); line(ctx, [[cx, by], [cx + 22, by + 18]], col.s[6], 3); line(ctx, [[cx, by], [cx, by + 22]], col.s[6], 3);
    text(ctx, 'roots', cx + 34, by + 14, { color: col.muted, size: 10 });
    // leaf
    ctx.save(); ctx.globalAlpha = step >= 2 ? 0.55 + 0.15 * Math.sin(t * 3) : 0.35; ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.ellipse(cx, ly, lw, lh, 0, 0, 7); ctx.fill(); ctx.restore();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, ly, lw, lh, 0, 0, 7); ctx.stroke();
    // stomata
    [[-0.45, 1], [0.1, 1], [0.55, 1]].forEach(([f]) => { dot(ctx, cx + f * lw, ly + lh * 0.9 * Math.sqrt(1 - f * f), 4, col.panel, col.ink); });
    text(ctx, 'stomata', cx + lw * 0.55, ly + lh + 14, { color: col.muted, size: 10, align: 'center' });
    // chloroplast dots
    if (step >= 2) for (let i = 0; i < 9; i++) dot(ctx, cx - lw * 0.6 + (i % 3) * lw * 0.55 + 4 * Math.sin(t + i), ly - 14 + Math.floor(i / 3) * 14, 5, col.s[3], col.ink);
    if (step >= 0) for (let i = 0; i < 5; i++) { const y = by - ((t * 30 + i * (by - sy) / 5) % (by - sy)); dot(ctx, cx + (i % 2 ? 6 : -6) * 0.8, y, 3.5, col.s[0]); }
    text(ctx, 'H₂O', cx - 28, (sy + by) / 2 + 10, { color: col.s[0], size: 12, weight: 700, align: 'center' });
    if (step >= 1) for (let i = 0; i < 4; i++) { const f = ((t * 0.45 + i / 4) % 1), x = cx + lw + 60 - f * (lw + 60 - lw * 0.55), y = ly + lh + 30 - f * 30; dot(ctx, x, y, 4, col.muted); }
    if (step >= 1) text(ctx, 'CO₂ in', cx + lw + 24, ly + lh + 50, { color: col.ink, size: 12, weight: 700, align: 'center' });
    if (step >= 2) { for (let i = 0; i < 4; i++) { const x = cx - lw - 10 + i * 36; arrow(ctx, x, top + 14 + (i % 2) * 6, x + 30, ly - lh - 2, col.s[1], 2, 8); } text(ctx, 'sunlight', cx - lw - 10, top + 12, { color: col.s[1], size: 12, weight: 700 }); text(ctx, 'chlorophyll', cx - lw * 0.1, ly + 2, { color: col.panel, size: 10.5, weight: 700, align: 'center', halo: col.ink }); }
    if (step >= 3) { for (let i = 0; i < 4; i++) { const f = ((t * 0.5 + i / 4) % 1), x = cx - lw * 0.4 - f * (lw * 0.8 + 6), y = ly + lh * 0.8 + f * 28; dot(ctx, x, y, 4.5, col.s[7]); } text(ctx, 'O₂ out', cx - lw - 20, ly + lh + 34, { color: col.s[7], size: 12, weight: 700, align: 'center' }); }
    if (step >= 4) { ctx.save(); ctx.translate(cx + lw * 0.2, ly - 6); ctx.fillStyle = col.s[1]; ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; ctx.lineTo(Math.cos(a) * 12, Math.sin(a) * 12); } ctx.fill(); ctx.restore(); text(ctx, 'glucose', cx + lw * 0.2, ly - 24, { color: col.ink, size: 10.5, weight: 700, align: 'center', halo: col.panel }); }
    if (step >= 5) { for (let i = 0; i < 3; i++) { const f = ((t * 0.3 + i / 3) % 1); dot(ctx, cx + 12, sy + f * (by - sy - 10) * 0.9, 3.5, col.s[1]); } text(ctx, 'sugar → roots, fruits', cx - 12, sy + 40, { color: col.s[1], size: 10.5, weight: 700, align: 'right' }); }
    text(ctx, '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', w / 2, h - 34, { color: col.s[2], size: 12.5, weight: 700, align: 'center' });
    text(ctx, CAP[step], w / 2, h - 12, { color: col.ink, size: 10, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
