// Class 8 Earth (step player): the water cycle. The Sun heats oceans and lakes, so water evaporates; plants also release water vapour
// (transpiration). Rising vapour cools and condenses into cloud droplets; these fall as rain, snow or hail (precipitation); water then runs
// over the land into rivers (runoff) or soaks into the ground, and everything ends up back in the sea. The same water goes round again and again.
import { canvas, text, title, line, dot, arrow, loop, rng } from '../../kit.js';

const TITLES = ['Evaporation: the Sun heats the water', 'Condensation: vapour cools into clouds', 'Precipitation: rain and snow fall', 'Runoff and soaking in', 'Transpiration: plants give out water'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'The water cycle with sea, clouds, mountain, river, soil and plants' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const R = rng(6), Q = []; for (let i = 0; i < 14; i++) Q.push(R());
  cv.draw = (ctx, w, h, col) => {
    title(ctx, TITLES[step], col);
    const gy = h * 0.72, sx = w * 0.46;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.45; ctx.fillRect(0, gy, sx - 20, h - gy); ctx.globalAlpha = 1; text(ctx, 'sea', 10, h - 12, { color: col.ink, size: 10.5, weight: 700 });
    ctx.fillStyle = col.warn; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.moveTo(sx - 20, gy); ctx.lineTo(w * 0.7, gy - h * 0.34); ctx.lineTo(w, gy); ctx.lineTo(w, h); ctx.lineTo(sx - 20, h); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    text(ctx, 'land', w - 12, h - 12, { color: col.panel, size: 10.5, weight: 700, align: 'right' });
    line(ctx, [[w * 0.7 + 4, gy - h * 0.34 + 14], [w * 0.62, gy - 18], [sx, gy]], col.s[0], 3);
    dot(ctx, w - 40, 56, 15, col.warn, col.ink);
    const cl = (x, y, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col.panel; ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 13, 0, 7); ctx.arc(x + 17, y - 4, 16, 0, 7); ctx.arc(x + 34, y, 12, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); };
    cl(w * 0.28, h * 0.2, step >= 1 ? 1 : 0.15);
    const up = (x0, y0, y1, c, n) => { for (let i = 0; i < n; i++) { const k = (t * 0.35 + Q[i] ) % 1; ctx.save(); ctx.globalAlpha = 1 - k * 0.7; dot(ctx, x0 + (Q[(i + 3) % 14] - 0.5) * 60 + 6 * Math.sin(t * 2 + i), y0 + (y1 - y0) * k, 2.6, c); ctx.restore(); } };
    if (step === 0) { up(w * 0.22, gy, h * 0.26, col.s[2], 8); text(ctx, 'water vapour rises', w * 0.1, gy - 60, { color: col.s[2], size: 10.5, weight: 700 }); }
    if (step === 1) { up(w * 0.28, h * 0.5, h * 0.28, col.s[2], 6); text(ctx, 'cools, forms droplets', w * 0.04, h * 0.4, { color: col.ink, size: 10.5, weight: 700 }); }
    if (step === 2) { for (let i = 0; i < 12; i++) { const k = (t * 0.6 + Q[i]) % 1, x = w * 0.2 + Q[(i + 5) % 14] * w * 0.28; line(ctx, [[x, h * 0.28 + k * (gy - h * 0.3)], [x - 2, h * 0.28 + k * (gy - h * 0.3) + 8]], col.s[0], 2); } text(ctx, 'rain', w * 0.52, h * 0.4, { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'snow on peaks', w * 0.64, gy - h * 0.34 - 8, { color: col.ink, size: 10, weight: 700 }); }
    if (step === 3) { arrow(ctx, w * 0.68, gy - h * 0.26, w * 0.6, gy - 24, col.s[0], 2.5, 8); arrow(ctx, w * 0.6, gy - 20, sx + 6, gy + 6, col.s[0], 2.5, 8); text(ctx, 'runoff to river and sea', w * 0.56, gy - h * 0.2, { color: col.ink, size: 10.5, weight: 700 }); for (let i = 0; i < 6; i++) { const k = (t * 0.4 + i / 6) % 1; dot(ctx, w * 0.78 + i * 4, gy + 10 + k * (h - gy - 26), 2.8, col.s[0]); } text(ctx, 'seeps into the ground', w * 0.74, h - 12, { color: col.panel, size: 10, weight: 700, align: 'center' }); }
    if (step === 4) { [w * 0.78, w * 0.9].forEach((x, j) => { line(ctx, [[x, gy], [x, gy - 22]], col.ink, 3); dot(ctx, x, gy - 30, 10, col.good, col.ink); up(x, gy - 40, h * 0.3, col.s[2], 4); }); text(ctx, 'leaves release vapour', w * 0.82, gy - 72, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 4); t = 0; cv.redraw(); } };
}
