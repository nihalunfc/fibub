// Class 8 Matter (step player): separating a mixture of iron filings, sand and salt by choosing a method that matches
// each property: a magnet for iron (magnetic), water to dissolve the salt (soluble), filtering to hold back the sand
// (insoluble grains too big for paper pores), and evaporation to get the salt back from the salt water.
import { canvas, text, title, dot, line, arrow, loop, font } from '../../kit.js';

const NAMES = ['The mixture', 'Use a magnet', 'Add water and stir', 'Filter', 'Evaporate'];
const CAP = ['Iron filings, sand and salt are mixed in a dish. Each has a different property we can use.', 'A magnet picks up the iron filings (iron is magnetic). Sand and salt are left.', 'Salt dissolves in water; sand does not. Stir well.', 'Pour through filter paper. Sand stays on the paper; salt water passes through.', 'Heat the salt water. The water evaporates and white salt crystals are left behind.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Separating iron, sand and salt with a magnet, water, a filter and evaporation' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const grains = (ctx, cx, cy, wd, n, c, s, sp = 1) => { for (let i = 0; i < n; i++) ctx.fillStyle = c, ctx.fillRect(cx - wd / 2 + ((i * 53 * sp) % wd) - 0, cy - 6 - ((i * 29) % 14) * 0.6, s, s); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, NAMES[step], col);
    const cy = h * 0.5, dx = w * 0.3;
    if (step === 0) { ctx.fillStyle = col.soft; ctx.fillRect(w * 0.2, cy, w * 0.6, 26); grains(ctx, w * 0.5, cy + 24, w * 0.55, 30, col.muted, 4); grains(ctx, w * 0.5, cy + 24, w * 0.55, 30, col.s[3], 4, 1.7); grains(ctx, w * 0.5, cy + 24, w * 0.55, 30, col.ink, 2.5, 2.3); text(ctx, 'iron + sand + salt', w / 2, cy + 46, { color: col.muted, size: 10.5, align: 'center' }); }
    if (step === 1) { const lift = Math.abs(Math.sin(t * 1.4)); ctx.fillStyle = col.soft; ctx.fillRect(w * 0.2, cy + 30, w * 0.6, 22); grains(ctx, w * 0.5, cy + 48, w * 0.55, 20, col.s[3], 4, 1.7); grains(ctx, w * 0.5, cy + 48, w * 0.55, 20, col.ink, 2.5, 2.3); ctx.fillStyle = col.s[1]; ctx.fillRect(w * 0.42, cy - 46 - lift * 8, w * 0.16, 16); ctx.fillStyle = col.muted; for (let i = 0; i < 8; i++) ctx.fillRect(w * 0.43 + i * 7, cy - 28 - lift * 8 + (i % 3) * 2, 4, 4); text(ctx, 'iron comes out', w * 0.75, cy - 38, { color: col.s[1], size: 10.5, weight: 700 }); }
    if (step === 2) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(w * 0.3, cy - 30, w * 0.4, 90); ctx.fillStyle = col.soft; ctx.fillRect(w * 0.3 + 1.5, cy, w * 0.4 - 3, 59); for (let i = 0; i < 14; i++) { ctx.fillStyle = col.s[3]; ctx.fillRect(w * 0.33 + (i * 37) % (w * 0.33), cy + 48 + ((i * 13) % 8), 4, 4); } for (let i = 0; i < 10; i++) dot(ctx, w * 0.35 + ((i * 41 + Math.sin(t * 2 + i) * 6) % (w * 0.3)), cy + 14 + ((i * 17) % 28) + Math.cos(t * 2 + i) * 4, 2, col.s[0]); text(ctx, 'salt dissolved', w * 0.5, cy - 40, { color: col.s[0], size: 10.5, weight: 700, align: 'center' }); text(ctx, 'sand sinks', w * 0.5, cy + 76, { color: col.muted, size: 10.5, align: 'center' }); }
    if (step === 3) { ctx.fillStyle = col.line; ctx.beginPath(); ctx.moveTo(w * 0.3, cy - 40); ctx.lineTo(w * 0.7, cy - 40); ctx.lineTo(w * 0.5, cy + 10); ctx.closePath(); ctx.fill(); grains(ctx, w * 0.5, cy - 16, 40, 12, col.s[3], 4, 1.4); const f = (t * 0.8) % 1; for (let k = 0; k < 3; k++) { const g = (f + k / 3) % 1; dot(ctx, w * 0.5, cy + 10 + g * 50, 3, col.s[0]); } ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(w * 0.38, cy + 62, w * 0.24, 40); ctx.fillStyle = col.soft; ctx.fillRect(w * 0.38 + 1.5, cy + 80, w * 0.24 - 3, 21); text(ctx, 'sand on paper', w * 0.76, cy - 16, { color: col.s[3], size: 10.5, weight: 700 }); text(ctx, 'salt water', w * 0.64, cy + 90, { color: col.s[0], size: 10.5, weight: 700 }); }
    if (step === 4) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(w * 0.5, cy + 14, 50, 0, Math.PI); ctx.stroke(); for (let k = 0; k < 4; k++) { const f = (t * 0.5 + k / 4) % 1; ctx.globalAlpha = 1 - f; dot(ctx, w * 0.5 - 24 + k * 16, cy - 6 - f * 54, 5, col.s[0]); ctx.globalAlpha = 1; } for (let k = 0; k < 4; k++) line(ctx, [[w * 0.5 - 30 + k * 20, cy + 78], [w * 0.5 - 26 + k * 20, cy + 66 - (k % 2) * 5]], col.s[1], 3); for (let i = 0; i < 12; i++) { ctx.fillStyle = col.ink; ctx.fillRect(w * 0.5 - 30 + (i * 7) % 60, cy + 58 + (i % 3) * 2, 4, 4); } text(ctx, 'steam leaves', w * 0.76, cy - 40, { color: col.s[0], size: 10.5, weight: 700 }); text(ctx, 'salt crystals stay', w * 0.5, cy + 100, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); }
    ctx.font = font(11, 400);
    const L = []; let cur = ''; CAP[step].split(' ').forEach((wd) => { const s2 = cur ? cur + ' ' + wd : wd; if (ctx.measureText(s2).width > w - 24) { L.push(cur); cur = wd; } else cur = s2; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 10 - (L.length - 1 - i) * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 4); t = 0; cv.redraw(); } };
}
