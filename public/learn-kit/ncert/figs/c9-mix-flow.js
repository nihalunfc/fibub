// Class 9 Mixtures (step player): separating a three-part mixture of iron filings, sand and salt. Plan by property:
// iron is magnetic (magnet), salt dissolves in water but sand does not (add water and filter), then the salt solution
// is evaporated (or crystallised) to get the salt back. Each step uses a physical property, so nothing new is made.
import { canvas, text, title, dot, line, loop } from '../../kit.js';

const CAP = ['A mixture of iron filings, sand and salt. We pick a property that differs for each part.', 'Iron is magnetic. Pass a magnet over the mixture: the iron filings stick to it. Sand and salt are left.', 'Add water to the sand and salt and stir. Salt dissolves; sand does not.', 'Filter through filter paper. Sand stays on the paper (residue); salt solution passes through (filtrate).', 'Heat the filtrate in a dish. The water evaporates and the salt is left behind as a white solid.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'Separating iron, sand and salt with a magnet, water, a filter and evaporation' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const bowl = (ctx, x, y, r, col) => { ctx.beginPath(); ctx.moveTo(x - r, y); ctx.quadraticCurveTo(x, y + r * 0.9, x + r, y); ctx.closePath(); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['The mixture', 'Use a magnet', 'Add water', 'Filter', 'Evaporate'][step], col);
    const cy = h * 0.5, cx = w / 2;
    const iron = (x, y) => dot(ctx, x, y, 2.4, col.ink), sand = (x, y) => dot(ctx, x, y, 3, col.s[2]), salt = (x, y) => dot(ctx, x, y, 2.2, col.s[4], col.muted);
    if (step === 0 || step === 1) {
      bowl(ctx, cx, cy, 70, col);
      for (let i = 0; i < 18; i++) { const x = cx - 56 + (i * 29) % 112, y = cy + 3 + (i % 4) * 4; if (step === 1 && i % 3 === 0) continue; [iron, sand, salt][i % 3](x, y - (i % 3)); }
      if (step === 1) { const mx = cx + Math.sin(t * 1.5) * 20, my = cy - 60; ctx.fillStyle = col.bad; ctx.fillRect(mx - 22, my - 18, 22, 14); ctx.fillStyle = col.s[0]; ctx.fillRect(mx, my - 18, 22, 14); text(ctx, 'magnet', mx, my - 28, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); for (let i = 0; i < 6; i++) iron(mx - 20 + i * 8, my - 2 + (i % 2) * 4); text(ctx, 'iron filings stick', mx, my + 14, { color: col.ink, size: 10, align: 'center', halo: col.panel }); }
    }
    if (step === 2) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fillRect(cx - 55, cy - 40, 110, 80); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(cx - 55, cy - 50, 110, 90); for (let i = 0; i < 10; i++) sand(cx - 44 + i * 9, cy + 32 - (i % 3) * 3); for (let i = 0; i < 8; i++) { const p = (t * 0.4 + i / 8) % 1; dot(ctx, cx - 40 + i * 10, cy - 30 + p * 40, 1.6, col.s[4]); } line(ctx, [[cx + 10, cy - 74], [cx + 10 + Math.sin(t * 4) * 10, cy + 10]], col.muted, 3); text(ctx, 'salt dissolves, sand sinks', cx, cy + 56, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); }
    if (step === 3) { ctx.beginPath(); ctx.moveTo(cx - 40, cy - 60); ctx.lineTo(cx + 40, cy - 60); ctx.lineTo(cx + 6, cy - 6); ctx.lineTo(cx - 6, cy - 6); ctx.closePath(); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx - 34, cy - 56); ctx.lineTo(cx + 34, cy - 56); ctx.lineTo(cx + 3, cy - 12); ctx.lineTo(cx - 3, cy - 12); ctx.closePath(); ctx.strokeStyle = col.s[2]; ctx.stroke(); for (let i = 0; i < 9; i++) sand(cx - 24 + (i % 5) * 11, cy - 52 + Math.floor(i / 5) * 5); ctx.strokeStyle = col.ink; ctx.strokeRect(cx - 34, cy + 20, 68, 44); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.fillRect(cx - 33, cy + 64 - 20 * Math.min(1, t * 0.3 % 1 + 0.3), 66, 20 * Math.min(1, t * 0.3 % 1 + 0.3)); ctx.globalAlpha = 1; for (let i = 0; i < 3; i++) dot(ctx, cx, cy + ((t * 40 + i * 12) % 30) - 4, 1.8, col.s[0]); text(ctx, 'residue: sand', cx + 48, cy - 46, { color: col.s[2], size: 10.5, weight: 700 }); text(ctx, 'filtrate: salt solution', cx + 40, cy + 44, { color: col.s[0], size: 10.5, weight: 700 }); }
    if (step === 4) { bowl(ctx, cx, cy, 64, col); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.moveTo(cx - 50, cy + 6); ctx.quadraticCurveTo(cx, cy + 40, cx + 50, cy + 6); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; for (let i = 0; i < 12; i++) salt(cx - 40 + (i % 6) * 14, cy + 14 + Math.floor(i / 6) * 5); for (let i = 0; i < 6; i++) { const p = (t * 0.5 + i / 6) % 1; ctx.globalAlpha = 1 - p; dot(ctx, cx - 30 + i * 12, cy - p * 40, 2.4, col.s[0]); ctx.globalAlpha = 1; } for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(cx - 14 + i * 14, cy + 58); ctx.quadraticCurveTo(cx - 14 + i * 14 + 3 * Math.sin(t * 9 + i), cy + 46, cx - 14 + i * 14, cy + 48 - 6 * Math.abs(Math.sin(t * 7 + i))); ctx.strokeStyle = col.bad; ctx.lineWidth = 3; ctx.stroke(); } text(ctx, 'water vapour leaves; salt remains', cx, cy + 78, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); }
    const Ls = []; let cur = ''; ctx.font = '11px system-ui'; CAP[step].split(' ').forEach((wd) => { if (ctx.measureText((cur + ' ' + wd).trim()).width > w - 24 && cur) { Ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); Ls.push(cur);
    Ls.forEach((l, i) => text(ctx, l, w / 2, h - 12 - (Ls.length - 1 - i) * 14, { color: col.ink, size: 11, align: 'center' }));
    const key = [['iron', col.ink], ['sand', col.s[2]], ['salt', col.s[4]]]; key.forEach(([s, c], i) => { dot(ctx, 16 + i * 52, 44, 3, c); text(ctx, s, 24 + i * 52, 44, { color: col.muted, size: 10 }); });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
