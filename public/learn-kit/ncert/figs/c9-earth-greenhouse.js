// Class 9 Earth as a system (step player): how the greenhouse effect works. Short-wave sunlight comes in; about
// 30% is reflected; the rest warms land and sea; the warm surface sends out long-wave infrared; greenhouse gases
// (water vapour, CO2, methane) absorb it and re-emit in all directions, so some returns to the surface;
// more gas means more heat returned. Steps: sunlight, reflection, absorption, infrared, gases, extra gas.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Sunlight arriving, reflected, absorbed and re-emitted as heat by greenhouse gases' });
  const TT = ['Sunlight arrives', 'About 30% bounces back', 'The rest warms land and sea', 'The warm surface sends out heat (infrared)', 'Greenhouse gases catch some of it', 'More gas, more heat sent back'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col) + 10;
    const yAt = top + (h - top) * 0.45, ySf = h - 36, gx = w * 0.62;
    ctx.fillStyle = col.soft; ctx.fillRect(0, yAt - 20, w, 40);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.4; ctx.fillRect(0, ySf, w, 36); ctx.globalAlpha = 1;
    text(ctx, 'land and sea', 8, ySf + 18, { color: col.ink, size: 11, weight: 700 });
    text(ctx, 'atmosphere', 8, yAt, { color: col.muted, size: 10.5 });
    // greenhouse gas molecules (3-dot shapes), more in step 5
    const nGas = step === 5 ? 14 : 6;
    if (step >= 4) for (let k = 0; k < nGas; k++) {
      const gxk = w * 0.2 + ((k * 0.618) % 1) * w * 0.75, gyk = yAt - 12 + ((k * 0.37) % 1) * 24;
      dot(ctx, gxk - 4, gyk, 2.6, col.muted); dot(ctx, gxk, gyk, 2.6, col.ink); dot(ctx, gxk + 4, gyk, 2.6, col.muted);
    }
    const ph = (s, o = 0) => (((t * 0.35 + o + s) % 1) + 1) % 1;
    const pulse = (x0, y0, x1, y1, c, n, o = 0) => { for (let k = 0; k < n; k++) { const p = ph(k / n, o); dot(ctx, x0 + (x1 - x0) * p, y0 + (y1 - y0) * p, 3.2, c); } };
    const sun = col.s[2], heat = col.s[1];
    if (step <= 1) {
      dot(ctx, 30, top + 6, 11, sun);
    }
    if (step === 0) pulse(40, top + 8, w * 0.38, ySf, sun, 6);
    if (step === 1) {
      pulse(40, top + 8, w * 0.38, ySf, sun, 3);
      const rx = w * 0.38; for (let k = 0; k < 3; k++) { const p = ph(k / 3, 0.3); dot(ctx, rx + (w * 0.2) * p, ySf - (ySf - top - 14) * p, 3.2, sun); }
      text(ctx, 'reflected by clouds, ice, sea', w * 0.45, top + 22, { color: col.ink, size: 10.5, weight: 700 });
    }
    if (step === 2) {
      pulse(40, top + 8, w * 0.38, ySf, sun, 5);
      const g = 0.5 + 0.5 * Math.sin(t * 3); ctx.fillStyle = heat; ctx.globalAlpha = 0.2 + 0.25 * g; ctx.fillRect(w * 0.2, ySf, w * 0.4, 6); ctx.globalAlpha = 1;
      text(ctx, 'absorbed: the surface warms', w * 0.5, ySf - 8, { color: heat, size: 11, weight: 700, align: 'center' });
    }
    if (step >= 3) {
      pulse(w * 0.42, ySf, w * 0.42, top, heat, 4); pulse(w * 0.62, ySf, w * 0.62, top, heat, 4, 0.5);
      text(ctx, 'infrared (heat)', w * 0.3, ySf - 12, { color: heat, size: 10.5, weight: 700, align: 'center' });
    }
    if (step >= 4) {
      const n = step === 5 ? 5 : 3;
      for (let k = 0; k < n; k++) { const p = ph(k / n, 0.2); dot(ctx, w * 0.5 - 20 * p, yAt + 14 + (ySf - yAt - 16) * p, 3.2, heat); }
      arrow(ctx, w * 0.86, yAt + 18, w * 0.86, ySf - 4, heat, step === 5 ? 5 : 2.5, 9);
      text(ctx, step === 5 ? 'much returns' : 'some returns', w * 0.86 - 8, yAt + 40, { color: heat, size: 10.5, weight: 700, align: 'right' });
      text(ctx, step === 5 ? 'hotter surface' : 'warmer than without', gx - w * 0.2, ySf - 40, { color: col.ink, size: 11, weight: 700 });
    }
    if (step === 5) text(ctx, 'more CO₂, CH₄', w * 0.5, yAt - 28, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
