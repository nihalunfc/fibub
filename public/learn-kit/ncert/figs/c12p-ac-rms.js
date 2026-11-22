// Class 12 Alternating Current (step player): why the rms value is V0/sqrt(2). Square the voltage (the heating goes as
// v squared), average the squares (sin squared has mean 1/2), then take the square root. Maths: <sin^2> = 1/2, so
// V_rms^2 = V0^2/2 and V_rms = V0/sqrt(2) = 0.707 V0.
import { canvas, axes, line, text, title, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.64, max: 440, min: 270, label: 'Voltage curve, its square, and the average of the square giving the rms value' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const TT = ['1. The voltage v = V₀ sin ωt', '2. Square it: v² = V₀² sin² ωt', '3. Its average is half the peak', '4. Take the square root: V_rms'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col);
    const sq = step >= 1;
    const ax = axes(ctx, w, h, col, { x: [0, 2], y: sq ? [-0.15, 1.15] : [-1.2, 1.2], t: top + 6, xlabel: 'time (in periods T)', ylabel: sq ? 'v² (in units of V₀²)' : 'v (in units of V₀)', yt: sq ? [0, 0.5, 1] : [-1, 0, 1], xt: [0, 0.5, 1, 1.5, 2] });
    ctx.save(); ax.clip();
    if (step === 0) {
      const pts = []; for (let k = 0; k <= 200; k++) { const x = k / 100; pts.push([ax.X(x), ax.Y(Math.sin(2 * Math.PI * x))]); }
      line(ctx, pts, col.s[0], 2.5);
    } else {
      const pts = []; for (let k = 0; k <= 200; k++) { const x = k / 100; pts.push([ax.X(x), ax.Y(Math.sin(2 * Math.PI * x) ** 2)]); }
      // fill under curve
      ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(0)); pts.forEach((p) => ctx.lineTo(p[0], p[1])); ctx.lineTo(ax.X(2), ax.Y(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      line(ctx, pts, col.s[0], 2.5);
      if (step >= 2) { const a = 0.5 + 0.08 * Math.sin(t * 4) * (step === 2 ? 1 : 0); line(ctx, [[ax.X(0), ax.Y(a)], [ax.X(2), ax.Y(a)]], col.s[3], 3); }
    }
    ctx.restore();
    if (step === 0) text(ctx, 'positive and negative halves would cancel on average', ax.L + 8, ax.B - 8, { color: col.muted, size: 11, base: 'bottom' });
    if (step === 1) text(ctx, 'always positive: heating never cancels', ax.L + 8, ax.T + 10, { color: col.muted, size: 11 });
    if (step === 2) text(ctx, 'mean of v² = V₀²/2', ax.R - 6, ax.Y(0.5) - 10, { color: col.s[3], size: 12, weight: 700, align: 'right', halo: col.panel });
    if (step === 3) {
      text(ctx, 'mean v² = V₀²/2', ax.R - 6, ax.Y(0.5) - 10, { color: col.s[3], size: 11.5, weight: 700, align: 'right', halo: col.panel });
      text(ctx, 'V_rms = √(V₀²/2) = V₀/√2 ≈ 0.707 V₀', ax.L + 8, ax.Y(0.5) + 24, { color: col.ink, size: 12, weight: 700, halo: col.panel });
      text(ctx, '325 V peak → 230 V rms', ax.L + 8, ax.Y(0.5) + 42, { color: col.muted, size: 11.5, weight: 600, halo: col.panel });
    }
  };
  return { step(i) { step = Math.min(3, i); cv.redraw(); } };
}
