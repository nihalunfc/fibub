// 9.1 How the 1998 teams caught distant supernovae "on demand" (the batch search). Step 1: a reference picture of
// a patch of sky full of faint galaxies, taken just after new moon. Step 2: the same patch about three weeks later:
// one galaxy has a new point of light. Step 3: subtract the two pictures: everything that did not change vanishes
// and the supernova is left. Step 4: follow-up telescopes measure its light curve (peak and fading speed) and its
// spectrum (to prove it is a Type Ia and get the redshift). Galaxies and the light curve are drawn, not real data.
import { canvas, text, title, line, dot, rng, loop, calm, axes } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 300, label: 'A patch of sky before and after a supernova appears, the difference picture and its light curve' });
  let step = 0, t = 0;
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); if (t > 2) anim.pause(); }, { autoplay: false });
  const r = rng(117);
  const gals = Array.from({ length: 34 }, () => ({ x: 0.04 + r() * 0.92, y: 0.06 + r() * 0.88, s: 2 + r() * 6, e: 0.4 + r() * 0.6, a: r() * Math.PI, b: 0.35 + r() * 0.5 }));
  const host0 = gals[11]; host0.s = 7; host0.b = 0.8;
  const sn = { x: host0.x + 0.012, y: host0.y - 0.01 };
  const noise = Array.from({ length: 90 }, () => ({ x: r(), y: r(), v: r() }));
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, ['1. Reference picture, just after new moon', '2. The same patch, three weeks later', '3. Subtract: only the change is left', '4. Follow it up: light curve and spectrum'][step], col);
    const k = calm() ? 1 : Math.min(1, t / 1.2);
    if (step < 3) {
      const L = 10, T = top + 6, W = w - 20, H = h - T - 10;
      ctx.save();
      ctx.fillStyle = col.soft; ctx.fillRect(L, T, W, H);
      ctx.strokeStyle = col.line; ctx.strokeRect(L + 0.5, T + 0.5, W - 1, H - 1);
      ctx.beginPath(); ctx.rect(L, T, W, H); ctx.clip();
      const S = Math.min(W, H) / 300;
      if (step < 2) {
        for (const g of gals) {
          ctx.save(); ctx.translate(L + g.x * W, T + g.y * H); ctx.rotate(g.a);
          ctx.globalAlpha = g.b; ctx.fillStyle = col.muted;
          ctx.beginPath(); ctx.ellipse(0, 0, g.s * S * 1.6, g.s * S * 1.6 * g.e, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
      } else {
        // residual noise of the subtraction, faded in
        ctx.globalAlpha = 0.35 * k;
        for (const p of noise) dot(ctx, L + p.x * W, T + p.y * H, 0.8 + p.v, col.muted);
        ctx.globalAlpha = 1;
        // the galaxies fade away
        for (const g of gals) {
          ctx.save(); ctx.translate(L + g.x * W, T + g.y * H); ctx.rotate(g.a);
          ctx.globalAlpha = g.b * (1 - k); ctx.fillStyle = col.muted;
          ctx.beginPath(); ctx.ellipse(0, 0, g.s * S * 1.6, g.s * S * 1.6 * g.e, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
      }
      if (step >= 1) {
        const x = L + sn.x * W, y = T + sn.y * H, rr = 4 + 1.5 * (step === 1 ? k : 1);
        dot(ctx, x, y, rr, col.s[1], col.panel);
        ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
      if (step >= 1) {
        const x = L + sn.x * W, y = T + sn.y * H, below = y < T + H * 0.6;
        text(ctx, step === 1 ? 'a new point of light' : 'the supernova', x, below ? y + 30 : y - 30, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.soft });
      }
    } else {
      // light curve: rise ~18 days to peak, then fall; drawn up to t·k
      const A = axes(ctx, w, h, col, { x: [-20, 60], y: [0, 1.1], t: top + 10, l: 50, xlabel: 'Days from peak brightness', ylabel: 'Brightness', fy: (v) => (+v.toFixed(1)) + '' });
      const f = (d) => (d < 0 ? Math.exp(-((d / 11) ** 2)) : 0.08 + 0.92 * Math.exp(-d / 22) * (1 - 0.15 * Math.sin(Math.min(d, 40) / 40 * Math.PI)));
      const pts = [];
      for (let d = -20; d <= -20 + 80 * k; d += 0.5) pts.push([A.X(d), A.Y(f(d))]);
      ctx.save(); A.clip(); line(ctx, pts, col.s[1], 2.5); ctx.restore();
      if (k >= 1) {
        dot(ctx, A.X(0), A.Y(1), 5, col.ink, col.panel);
        text(ctx, 'peak: true brightness', A.X(0) + 9, A.Y(1), { color: col.ink, size: 11.5, weight: 600, halo: col.panel });
        text(ctx, 'fading speed corrects the peak', A.X(9), A.Y(0.86), { color: col.muted, size: 11, halo: col.panel });
        text(ctx, 'spectrum: Type Ia? redshift?', A.X(9), A.Y(0.74), { color: col.muted, size: 11, halo: col.panel });
      }
    }
  };
  cv.redraw(); anim.play();
  return { step(i) { step = Math.min(3, i); t = 0; cv.redraw(); anim.play(); } };
}
