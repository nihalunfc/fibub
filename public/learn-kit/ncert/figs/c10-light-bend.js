// Class 10 Light (step player): WHY light bends. A slanted wavefront reaches the boundary; the part that enters the
// slower medium first slows down while the rest is still moving fast, so the wavefront swivels and the ray (which is
// always at right angles to the wavefronts) turns towards the normal. The wavefronts are drawn from the exact wave
// formula: the time a front arrives at (x, y) is (x sin i + y cos i)/v1 above the boundary and continues with
// speed v2 below it, which gives Snell's law sin i / sin r = v1 / v2 = n.
import { canvas, text, title, line, arrow, loop } from '../../kit.js';

const STEPS = [
  { n: 1, ray: false, t: 'Light as waves: the wavefronts are lines at right angles to the ray' },
  { n: 1.5, ray: false, t: 'The left end of each front enters glass first and slows down' },
  { n: 1.5, ray: true, t: 'The front swivels: the ray bends towards the normal' },
  { n: 2.4, ray: true, t: 'A slower medium (diamond, n = 2.4) bends it even more' },
  { n: 1.5, ray: true, t: 'Reverse the path: glass to air bends it away', rev: true },
];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Wavefronts of light crossing from air into glass and swivelling, which bends the ray' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const rad = Math.PI / 180;
  cv.draw = (ctx, w, h, col) => {
    const S = STEPS[Math.min(step, STEPS.length - 1)];
    title(ctx, S.t, col);
    const by = Math.round(h * 0.52), px = w / 2, th1 = 38 * rad, n = S.n, v1 = 60, v2 = v1 / n;
    ctx.save(); ctx.globalAlpha = 0.15; ctx.fillStyle = col.s[0]; ctx.fillRect(0, by, w, h - by); ctx.restore();
    line(ctx, [[0, by], [w, by]], col.ink, 2);
    text(ctx, `air: speed ${v1 === 60 ? 'c' : ''}`, 8, by - 12, { color: col.ink, size: 11, weight: 700, halo: col.panel });
    text(ctx, n === 1 ? 'air again (no change)' : `${n === 1.5 ? 'glass' : 'diamond'}: speed c/${n}`, 8, by + 14, { color: col.ink, size: 11, weight: 700, halo: col.panel });
    const s1 = Math.sin(th1), c1 = Math.cos(th1), s2 = Math.min(0.999, s1 * v2 / v1), c2 = Math.sqrt(1 - s2 * s2);
    const sp = 40, P = sp / v1, tm = (t * 0.55) % P, k0 = -6;
    // wavefront with arrival time T: above boundary y = (T v1 - x s1)/c1 ; below y = by + (T - x s1/v1 - by c1/v1) v2 / c2
    const xs = []; for (let x = -10; x <= w + 10; x += 6) xs.push(x);
    const yAbove = (x, T) => (T * v1 - x * s1) / c1, yBelow = (x, T) => by + (T - x * s1 / v1 - by * c1 / v1) * v2 / c2;
    ctx.lineWidth = 2;
    for (let k = -4; k < 30; k++) {
      const T = (k * P + tm) + (by * c1) / v1 * 0 - 0;
      const Tm = T + 0.2; // shift so the first front reaches the boundary at the left in view
      ctx.strokeStyle = col.s[2];
      ctx.beginPath(); let on = false;
      for (const x of xs) { const y = yAbove(x, Tm); if (y < by && y > 20) { on ? ctx.lineTo(x, y) : ctx.moveTo(x, y); on = true; } else on = false; }
      ctx.stroke();
      ctx.strokeStyle = col.s[1]; ctx.beginPath(); on = false;
      for (const x of xs) { const y = yBelow(x, Tm); if (y >= by && y < h - 4) { on ? ctx.lineTo(x, y) : ctx.moveTo(x, y); on = true; } else on = false; }
      ctx.stroke();
    }
    if (S.ray) {
      const L = 70, a1 = th1, a2 = Math.asin(s2);
      line(ctx, [[px, by - L - 10], [px, by + L + 10]], col.muted, 1.2, [5, 4]);
      arrow(ctx, px - L * s1, by - L * c1, px, by, col.ink, 2.6, 9); arrow(ctx, px, by, px + L * s2, by + L * c2, col.ink, 2.6, 9);
      text(ctx, 'i', px - 30 * Math.sin(a1 / 2) - 12, by - 30, { color: col.ink, size: 13, weight: 700, halo: col.panel }); text(ctx, 'r', px + 30 * Math.sin(a2 / 2) + 5, by + 34, { color: col.ink, size: 13, weight: 700, halo: col.panel });
      text(ctx, `sin i / sin r = ${(s1 / s2).toFixed(2)} = n`, w - 8, h - 12, { color: col.ink, size: 11.5, weight: 700, align: 'right', halo: col.panel });
    } else text(ctx, 'wavefront spacing = wavelength: shorter in the slower medium', 8, h - 12, { color: col.muted, size: 10.5 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, STEPS.length - 1); cv.redraw(); } };
}
