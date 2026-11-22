// Class 9 Mixtures (step player): separating by sublimation. A mixture of ammonium chloride (sal ammoniac) and sand is
// heated in a china dish covered by an inverted funnel with a cotton plug. Ammonium chloride sublimes: the solid turns
// straight to vapour without melting; the vapour cools on the cold funnel wall and turns straight back to solid,
// which collects on the inner surface. Sand does not sublime and stays in the dish. Also: camphor, naphthalene, iodine.
import { canvas, text, title, dot, line, loop } from '../../kit.js';

const CAP = ['Sand and ammonium chloride are mixed. Only one of them can sublime (solid to gas without melting).', 'Cover the dish with an inverted funnel, plug the stem with cotton wool, and heat gently.', 'The ammonium chloride turns straight into vapour. The sand stays as it is.', 'The vapour reaches the cool wall of the funnel and turns straight back into a solid (deposition).', 'Pure ammonium chloride collects on the funnel. The sand is left in the dish: separated.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A china dish with sand and ammonium chloride under an inverted funnel as the solid sublimes onto the funnel wall' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['A mixture', 'Heat gently', 'Solid to vapour', 'Vapour to solid', 'Separated'][step], col);
    const cx = w / 2, dy = h * 0.66, dw = Math.min(w * 0.52, 190);
    if (step >= 1) { for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(cx - 20 + i * 20, dy + 40); ctx.quadraticCurveTo(cx - 20 + i * 20 + 4 * Math.sin(t * 9 + i), dy + 26, cx - 20 + i * 20, dy + 28 - 6 * Math.abs(Math.sin(t * 7 + i))); ctx.strokeStyle = col.bad; ctx.lineWidth = 3; ctx.stroke(); } }
    ctx.fillStyle = col.ink; ctx.fillRect(cx - 40, dy + 40, 80, 4);
    ctx.beginPath(); ctx.moveTo(cx - dw / 2, dy); ctx.quadraticCurveTo(cx, dy + 34, cx + dw / 2, dy); ctx.closePath(); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    const nSand = 14, nNH = step >= 4 ? 0 : step === 3 ? 3 : step === 2 ? 7 : 12;
    for (let i = 0; i < nSand; i++) dot(ctx, cx - dw * 0.4 + (i % 7) * dw * 0.12, dy + 5 + Math.floor(i / 7) * 5, 3.2, col.s[2]);
    for (let i = 0; i < nNH; i++) dot(ctx, cx - dw * 0.38 + ((i * 5) % 7) * dw * 0.115, dy + 2 + Math.floor(i / 7) * 6 - 4, 3, col.panel, col.s[0]);
    // funnel
    ctx.beginPath(); ctx.moveTo(cx - dw / 2 + 8, dy - 6); ctx.lineTo(cx - 8, dy - h * 0.38); ctx.lineTo(cx + 8, dy - h * 0.38); ctx.lineTo(cx + dw / 2 - 8, dy - 6); ctx.closePath(); ctx.fillStyle = col.soft; ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = col.line; ctx.fillRect(cx - 8, dy - h * 0.38 - 4, 16, 8); text(ctx, 'cotton plug', cx + 14, dy - h * 0.38 - 6, { color: col.muted, size: 10 });
    text(ctx, 'sand', cx - dw / 2, dy + 52, { color: col.s[2], size: 10.5, weight: 700 }); text(ctx, 'NH₄Cl', cx + dw / 2, dy + 52, { color: col.s[0], size: 10.5, weight: 700, align: 'right' });
    if (step === 2) for (let i = 0; i < 7; i++) { const p = ((t * 0.45 + i / 7) % 1); dot(ctx, cx - dw * 0.3 + i * dw * 0.1 + Math.sin(t * 4 + i) * 3, dy - 6 - p * h * 0.15, 2.6, col.s[3]); }
    if (step === 3) for (let i = 0; i < 6; i++) { const p = ((t * 0.4 + i / 6) % 1); const x = cx - dw * 0.3 + i * dw * 0.12, y = dy - 6 - p * h * 0.22; dot(ctx, x, y, 2.6, col.s[3]); }
    if (step >= 3) { const n = step === 4 ? 14 : 6; for (let i = 0; i < n; i++) { const f = (i + 1) / (n + 1); const x = cx - dw / 2 + 12 + (dw / 2 - 12 - 8) * f * 0.9 + 4, y = dy - 12 - (h * 0.38 - 12) * f * 0.9; dot(ctx, x, y, 2.4, col.panel, col.s[0]); dot(ctx, 2 * cx - x, y, 2.4, col.panel, col.s[0]); } if (step === 4) text(ctx, 'pure NH₄Cl deposits here', cx, dy - h * 0.38 - 22, { color: col.s[0], size: 10.5, weight: 700, align: 'center' }); }
    const L = []; let cur = ''; ctx.font = '11px system-ui'; CAP[step].split(' ').forEach((wd) => { if (ctx.measureText((cur + ' ' + wd).trim()).width > w - 24 && cur) { L.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, w / 2, h - 10 - (L.length - 1 - i) * 14, { color: col.ink, size: 11, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
