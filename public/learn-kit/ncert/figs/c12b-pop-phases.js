// Class 12 Biology, Organisms and Populations (step player): the phases of logistic growth (r = 0.4, K = 100, N0 = 2).
// Lag (few individuals to breed), acceleration (growth rate rising), the inflection at N = K/2 where dN/dt = rK/4 is largest, deceleration as the
// environment resists, and the asymptote at K where births equal deaths.
import { canvas, axes, line, dot, text, title } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'An S-shaped population curve with one phase highlighted at a time: lag, acceleration, inflection, deceleration and carrying capacity' });
  const r = 0.4, K = 100, N0 = 2, N = (t) => K / (1 + ((K - N0) / N0) * Math.exp(-r * t)), T50 = Math.log((K - N0) / N0) / r;
  const TITLES = ['1. Lag phase', '2. Acceleration phase', '3. The turning point: N = K/2', '4. Deceleration phase', '5. Carrying capacity K'];
  const BANDS = [[0, 4], [4, T50], [T50 - 0.3, T50 + 0.3], [T50, 17], [17, 25]];
  const NOTES = ['Only a few individuals; they must find food, mates and settle in. Growth is slow.', 'More individuals breed, so more are born every day. The curve steepens: dN/dt keeps rising.', 'The steepest point. Growth per unit time is greatest, rK/4 = 10 per unit time here.', 'Food, space and other resources get scarce. Deaths rise, births fall: growth slows.', 'Births equal deaths, so the population stays at K (the carrying capacity).'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, TITLES[st], col);
    const a = axes(ctx, w, h, col, { x: [0, 25], y: [0, 115], xlabel: 'time', ylabel: 'N', l: 40, t: 30, b: 108, xt: [0, 5, 10, 15, 20, 25], yt: [0, 50, 100] });
    const [t0, t1] = BANDS[st]; ctx.fillStyle = col.soft; ctx.fillRect(a.X(t0), a.T, a.X(t1) - a.X(t0), a.B - a.T);
    const P = []; for (let t = 0; t <= 25; t += 0.25) P.push([a.X(t), a.Y(N(t))]); line(ctx, P, col.s[0], 2.5);
    ctx.setLineDash([5, 4]); line(ctx, [[a.L, a.Y(K)], [a.R, a.Y(K)]], col.muted, 1.2); line(ctx, [[a.L, a.Y(K / 2)], [a.X(T50), a.Y(K / 2)], [a.X(T50), a.B]], col.muted, 1); ctx.setLineDash([]);
    text(ctx, 'K', a.L + 5, a.Y(K) - 8, { color: col.muted, size: 11, weight: 700 }); text(ctx, 'K/2', a.L + 5, a.Y(K / 2) - 8, { color: col.muted, size: 10.5, weight: 700 });
    const tm = (t0 + t1) / 2, px = a.X(tm), py = a.Y(N(tm)), s = r * N(tm) * (K - N(tm)) / K;
    const dx = 40, slope = s * (a.Y(1) - a.Y(0)) / (a.X(1) - a.X(0)); line(ctx, [[px - dx, py - slope * dx], [px + dx, py + slope * dx]], col.s[2], 2.5); dot(ctx, px, py, 5, col.s[2], col.panel);
    text(ctx, `dN/dt = ${s.toFixed(1)} here`, w - 10, a.B + 30, { color: col.s[2], size: 11, weight: 700, align: 'right' });
    NOTES[st].match(/.{1,52}(\s|$)/g).forEach((ln, i) => text(ctx, ln.trim(), 10, a.B + 50 + i * 14, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 4); cv.redraw(); } };
}
