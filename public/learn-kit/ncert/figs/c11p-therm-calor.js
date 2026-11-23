// Class 11 Thermal Properties of Matter (step player): calorimetry by the principle of mixing. A hot copper block (0.20 kg, c = 390 J/kg K, 100 degC) goes into 0.50 kg of water (c = 4186, 25 degC) in an insulated calorimeter.
// Heat lost by the hot body = heat gained by the cold one: m1 c1 (T1 - T) = m2 c2 (T - T2). Solving: T = (m1c1T1 + m2c2T2)/(m1c1 + m2c2) = 27.7 degC. The temperature curves approach each other and level off.
import { canvas, text, title, axes, line, dot, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 340, label: 'A hot metal block dropped into cool water, with heat lost equal to heat gained and the temperatures meeting' });
  const T = ['Hot block, cool water, insulated cup', 'Heat flows from hot to cold', 'Heat lost = heat gained', 'Solve for the final temperature', 'Both temperatures meet at 27.7 °C'];
  const m1 = 0.2, c1 = 390, T1 = 100, m2 = 0.5, c2 = 4186, T2 = 25, Tf = (m1 * c1 * T1 + m2 * c2 * T2) / (m1 * c1 + m2 * c2);
  loop(host, (dt) => { t += dt; if (step === 1 || step === 4) cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col) + 8, mix = (tt) => 1 - Math.exp(-tt * 1.2);
    if (step <= 3) {
      const cx = w / 2, bw = Math.min(150, w * 0.42), by = top + 100, bh = 90, p = step === 1 ? mix((t % 3)) : step >= 2 ? 1 : 0;
      const tw = step === 0 ? T2 : T2 + (Tf - T2) * p, tb = step === 0 ? T1 : T1 + (Tf - T1) * p, warm = (v) => `hsl(${Math.round(210 - (v - 20) * 2.1)},65%,${58}%)`;
      ctx.fillStyle = warm(tw); ctx.globalAlpha = 0.6; ctx.fillRect(cx - bw / 2, by, bw, bh); ctx.globalAlpha = 1; line(ctx, [[cx - bw / 2, by - 24], [cx - bw / 2, by + bh], [cx + bw / 2, by + bh], [cx + bw / 2, by - 24]], col.ink, 3);
      ctx.fillStyle = warm(tb); ctx.fillRect(cx - 22, by + 24, 44, 34); text(ctx, 'copper', cx, by + 41, { color: '#fff', size: 11, weight: 700, align: 'center', halo: 'rgba(0,0,0,0.35)' });
      text(ctx, tb.toFixed(1) + ' °C', cx, by + 74, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'water ' + tw.toFixed(1) + ' °C', cx + bw / 2 - 4, by + bh + 14, { color: col.ink, size: 11, weight: 700, align: 'right' });
      text(ctx, 'insulated cup: no heat escapes', cx, by - 34, { color: col.muted, size: 10.5, align: 'center' });
      if (step === 1) arrow(ctx, cx - 30, by + 40, cx - bw / 2 + 14, by + 40, col.s[1], 3, 8);
      const L = (s, i, c = col.ink, b = 700) => text(ctx, s, w / 2, by + bh + 38 + i * 19, { color: c, size: 12, weight: b, align: 'center' });
      if (step === 0) { L('copper: 0.20 kg, c = 390 J/(kg K), 100 °C', 0, col.ink, 400); L('water: 0.50 kg, c = 4186 J/(kg K), 25 °C', 1, col.ink, 400); }
      if (step === 1) L('hot body loses heat, cold body gains it', 0, col.s[1]);
      if (step === 2) { L('m₁c₁(T₁ − T) = m₂c₂(T − T₂)', 0, col.s[7]); L('(a hot body’s loss is positive in T₁ − T)', 1, col.muted, 400); }
      if (step === 3) { L('0.2×390×(100 − T) = 0.5×4186×(T − 25)', 0, col.ink, 600); L('7800 − 78T = 2093T − 52325', 1, col.ink, 600); L('T = 60125 / 2171 = 27.7 °C', 2, col.s[7]); }
    } else {
      const A = axes(ctx, w, h, col, { x: [0, 3], y: [20, 100], xlabel: 'time (arbitrary)', ylabel: 'temperature (°C)', l: 44, t: top + 6, xt: [], yt: [25, 50, 75, 100], fy: (v) => v });
      const pts = (a, b) => { const p = []; for (let i = 0; i <= 60; i++) { const x = i / 20; p.push([A.X(x), A.Y(a + (b - a) * mix(x))]); } return p; };
      line(ctx, pts(T1, Tf), col.s[1], 3); line(ctx, pts(T2, Tf), col.s[0], 3); line(ctx, [[A.L, A.Y(Tf)], [A.R, A.Y(Tf)]], col.muted, 1.5, [5, 4]);
      const x = Math.min(3, t % 4.5); dot(ctx, A.X(x), A.Y(T1 + (Tf - T1) * mix(x)), 5, col.s[1], col.panel); dot(ctx, A.X(x), A.Y(T2 + (Tf - T2) * mix(x)), 5, col.s[0], col.panel);
      text(ctx, 'copper cools a lot', A.X(1.6), A.Y(70), { color: col.s[1], size: 11, weight: 700 }); text(ctx, 'water warms a little', A.X(0.8), A.Y(36), { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'T = 27.7 °C', A.R - 4, A.Y(Tf) - 10, { color: col.ink, size: 11, weight: 700, align: 'right' });
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
