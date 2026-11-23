// Class 8 Winds (step player): a sea breeze. In the day the land warms faster than the sea. Warm air over land
// expands and rises, leaving lower pressure near the ground; cooler, higher-pressure air from the sea flows in. At
// night the land cools faster than the sea and the flow reverses (a land breeze).
import { canvas, text, title, dot, arrow, loop, font } from '../../kit.js';

const NAMES = ['Day: land warms faster', 'Warm air rises over land', 'Cool sea air flows in', 'Night: it reverses'];
const CAP = ['Sun warms the land more quickly than the sea. The land is hotter than the water.', 'Air over the hot land warms, expands and rises. Near the ground the pressure falls: a low pressure patch.', 'Air over the sea is cooler with higher pressure. It moves toward the land: a sea breeze.', 'At night the land cools faster, the sea stays warmer, so air rises over the sea and the breeze blows out to sea.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Sea breeze and land breeze with rising warm air' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, NAMES[step], col);
    const sh = h * 0.6, mid = w * 0.5, night = step === 3;
    ctx.fillStyle = col.soft; ctx.fillRect(0, sh, mid, h * 0.1);
    ctx.fillStyle = col.line; ctx.fillRect(mid, sh, w - mid, h * 0.1);
    text(ctx, 'sea', mid * 0.5, sh + 14, { color: col.s[0], size: 11, weight: 700, align: 'center' }); text(ctx, 'land', mid + (w - mid) / 2, sh + 14, { color: col.muted, size: 11, weight: 700, align: 'center' });
    dot(ctx, w * 0.93, 56, 11, night ? col.muted : col.s[1]);
    const hotX = night ? mid * 0.5 : mid + (w - mid) / 2;
    text(ctx, night ? 'sea warmer' : 'land hotter', hotX, sh + 36, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
    if (step >= 1) for (let k = 0; k < 4; k++) { const f = (t * 0.5 + k / 4) % 1; arrow(ctx, hotX - 30 + k * 20, sh - 4 - f * 90, hotX - 30 + k * 20, sh - 20 - f * 90, col.s[1], 2.4, 7); }
    if (step >= 1) text(ctx, 'low pressure', hotX, sh - 118, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
    if (step >= 2 || night) { for (let k = 0; k < 4; k++) { const f = (t * 0.45 + k / 4) % 1; const fromX = night ? hotX + 80 : mid * 0.5 - 70, d = night ? -1 : 1; const x0 = night ? mid + (w - mid) * 0.9 - f * (mid + 40) : 20 + f * (mid + 40); arrow(ctx, night ? w - 20 - f * (w * 0.55) : 20 + f * (w * 0.55), sh - 10 - k * 10, (night ? w - 20 - f * (w * 0.55) : 20 + f * (w * 0.55)) + (night ? -22 : 22), sh - 10 - k * 10, col.s[0], 2.6, 7); } text(ctx, night ? 'land breeze' : 'sea breeze', w / 2, sh - 4 - 46, { color: col.s[0], size: 11.5, weight: 700, align: 'center' }); }
    ctx.font = font(11, 400);
    const L = []; let cur = ''; CAP[step].split(' ').forEach((wd) => { const s2 = cur ? cur + ' ' + wd : wd; if (ctx.measureText(s2).width > w - 24) { L.push(cur); cur = wd; } else cur = s2; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 10 - (L.length - 1 - i) * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 3); t = 0; cv.redraw(); } };
}
