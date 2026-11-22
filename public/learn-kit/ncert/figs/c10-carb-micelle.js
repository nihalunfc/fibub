// Class 10 Carbon (step player): how soap cleans. A soap molecule has an ionic head that loves water (hydrophilic) and
// a long hydrocarbon tail that loves oil (hydrophobic). In water the tails bury themselves in the grease and the heads
// stay out in the water, so the grease is broken into small droplets (micelles), each held in the water by the charged
// heads repelling each other, and rinsed away. Time-based motion inside each step.
import { canvas, text, title, line, dot, loop, rng, clamp } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Soap molecules surrounding a grease droplet to form a micelle that is washed away' });
  const T = ['A greasy stain on cloth', 'Add soap: molecules spread out', 'Tails dive into the grease', 'Rubbing lifts the grease off', 'Micelles are rinsed away'];
  const C = ['Oil and grease do not mix with water, so water alone cannot wash them off.', 'Each soap molecule: a round head that likes water (green) and a long tail that likes oil (orange).', 'The tails push into the grease; the heads stay in the water. The grease is surrounded.', 'Rubbing breaks the grease into tiny droplets, each wrapped in soap: a micelle.', 'Heads are all negatively charged, so micelles repel and stay apart, floating away with the water.'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const Rn = rng(3), S = Array.from({ length: 14 }, (_, i) => [Rn(), Rn(), i / 14 * 6.283, Rn()]);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col) + 6, ph = h - top - 50;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.1; ctx.fillRect(8, top + 6, w - 16, ph); ctx.globalAlpha = 1;
    // cloth
    const cy = top + ph - 6; if (step < 4) { ctx.strokeStyle = col.muted; ctx.lineWidth = 3; ctx.beginPath(); for (let x = 8; x < w - 8; x += 8) { ctx.moveTo(x, cy); ctx.lineTo(x + 4, cy - 6); } ctx.stroke(); text(ctx, 'cloth', w - 28, cy + 12, { color: col.muted, size: 10, align: 'center' }); }
    const gx = w / 2, gyc = step < 3 ? cy - 22 : top + ph * 0.5, gr = 24;
    const mol = (x, y, ang, a = 1) => { ctx.save(); ctx.globalAlpha = a; const tx = x + Math.cos(ang) * 16, ty = y + Math.sin(ang) * 16; line(ctx, [[x, y], [tx, ty]], col.s[1], 2.4); dot(ctx, x, y, 4.5, col.s[2]); ctx.restore(); };
    const drop = (x, y, r, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.55 * a; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore(); };
    if (step === 0) { drop(gx, gyc, gr + 4); text(ctx, 'grease', gx, gyc, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'water', 30, top + 20, { color: col.s[0], size: 10, weight: 700 }); }
    if (step === 1) { drop(gx, gyc, gr + 4); S.forEach(([a, b, ph2, s], i) => { const x = 20 + a * (w - 40), y = top + 18 + b * (ph - 70) + Math.sin(t * 1.5 + ph2) * 5; mol(x, y, ph2 + t * (0.3 + s * 0.3)); }); }
    if (step === 2) { const q = clamp(t / 3, 0, 1); drop(gx, gyc, gr + 4); S.forEach(([a, b, ph2], i) => { const th = (i / S.length) * 6.283, rx = gx + Math.cos(th) * (gr + 8), ry = gyc + Math.sin(th) * (gr + 8); const x0 = 20 + a * (w - 40), y0 = top + 18 + b * (ph - 70); const x = x0 + (rx - x0) * q, y = y0 + (ry - y0) * q; mol(x, y, q > 0.9 ? th + Math.PI : ph2 + t, 1); }); }
    const micelle = (cx, cyy, r, n, a = 1) => { drop(cx, cyy, r - 4, a); for (let i = 0; i < n; i++) { const th = i / n * 6.283; const x = cx + Math.cos(th) * (r + 6), y = cyy + Math.sin(th) * (r + 6); mol(x, y, th + Math.PI, a); } };
    if (step === 3) { const q = clamp(t / 3, 0, 1); micelle(gx - 40 * q, gyc - 10 * q, 22 - 6 * q, 14, 1); micelle(gx + 56 * q, gyc + 6 * q, 14, 9, q); micelle(gx + 10 * q, gyc - 56 * q + 20, 12, 8, q); micelle(gx - 60 * q, gyc + 40 * q, 11, 7, q); }
    if (step === 4) { for (let i = 0; i < 4; i++) { const x = ((t * 22 + i * w / 4) % (w + 40)) - 20, y = top + ph * (0.25 + 0.15 * i) + Math.sin(t * 2 + i) * 6; micelle(x, y, 13 - i, 9); } text(ctx, '→ drains away with the rinse water', w / 2, top + ph - 8, { color: col.muted, size: 10.5, align: 'center' }); }
    text(ctx, 'orange tail: loves oil · green head: loves water', w / 2, h - 32, { color: col.muted, size: 10, align: 'center' });
    const words = C[step].split(' '); let l1 = '', l2 = ''; words.forEach((wd) => { if ((l1 + ' ' + wd).length < w / 6 && !l2) l1 = (l1 + ' ' + wd).trim(); else l2 = (l2 + ' ' + wd).trim(); });
    text(ctx, l1, w / 2, h - 18, { color: col.ink, size: 10.5, align: 'center' }); if (l2) text(ctx, l2, w / 2, h - 5, { color: col.ink, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
