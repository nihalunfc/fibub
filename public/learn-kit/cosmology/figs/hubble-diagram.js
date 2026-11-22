// 4.2 Hubble's law, in four steps, with made-up (synthetic) galaxies that behave like the real ones:
// (1) a 1929-style plot: nearby galaxies, distances under 2 Mpc, a lot of scatter and a slope near 500;
// (2) the same galaxies with today's corrected distances (about 7 times bigger): slope near 70;
// (3) supernovae out to 400 Mpc: the straight line is clear; (4) the two modern values, 67 and 73, and the gap
// between them (the Hubble tension). The best-fit line is a least-squares fit through the origin.
import { canvas, axes, text, title, line, dot, rng, loop, calm } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 290, label: 'Recession speed against distance for galaxies, with the best straight line' });
  let step = 0, t = 0;
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }, { autoplay: false });
  const r = rng(29);
  const gauss = () => { let s = 0; for (let i = 0; i < 6; i++) s += r(); return (s - 3) * 1.41; };
  // nearby galaxies: true distance 0.5-15 Mpc, speed = 70 d + own motion (σ 250 km/s)
  const near = Array.from({ length: 24 }, () => { const d = 0.6 + r() * 13; return { d, v: 70 * d + 250 * gauss() }; });
  const far = Array.from({ length: 40 }, () => { const d = 20 + r() * 380; return { d: d * (1 + 0.05 * gauss()), v: 70 * d + 250 * gauss() }; });
  const fit = (pts) => pts.reduce((s, p) => s + p.d * p.v, 0) / pts.reduce((s, p) => s + p.d * p.d, 0);
  cv.draw = (ctx, w, h, col) => {
    const k = calm() ? 1 : Math.min(1, t / 1.5);
    let pts, xr, yr, slope, lab;
    if (step === 0) { pts = near.map((p) => ({ d: p.d / 7, v: p.v })); xr = [0, 2.2]; yr = [-500, 1500]; }
    else if (step === 1) { pts = near; xr = [0, 15]; yr = [-500, 1500]; }
    else { pts = far; xr = [0, 420]; yr = [0, 32000]; }
    slope = fit(pts);
    const A = axes(ctx, w, h, col, { x: xr, y: yr, l: 60, t: 52, xlabel: 'Distance (millions of parsecs, Mpc)', ylabel: 'Speed away (km/s)' });
    ctx.save(); A.clip();
    const n = Math.ceil(pts.length * k);
    pts.slice(0, n).forEach((p) => dot(ctx, A.X(p.d), A.Y(p.v), 4, col.s[0], col.panel));
    if (k >= 1) {
      if (step < 3) line(ctx, [[A.X(0), A.Y(0)], [A.X(xr[1]), A.Y(slope * xr[1])]], col.s[3], 2);
      else {
        line(ctx, [[A.X(0), A.Y(0)], [A.X(xr[1]), A.Y(67 * xr[1])]], col.s[1], 2);
        line(ctx, [[A.X(0), A.Y(0)], [A.X(xr[1]), A.Y(73 * xr[1])]], col.s[3], 2);
      }
    }
    ctx.restore();
    if (k >= 1) {
      if (step < 3) lab = `best line: slope ≈ ${Math.round(slope / (step === 0 ? 10 : 1)) * (step === 0 ? 10 : 1)} km/s per Mpc`;
      else lab = 'early universe: 67 · distance ladder: 73';
      text(ctx, lab, A.L + 8, A.T + 12, { color: col.ink, size: 12, weight: 600, halo: col.panel });
      if (step === 3) {
        text(ctx, '67', A.X(330), A.Y(67 * 330) + 14, { color: col.s[1], size: 12, weight: 700, align: 'right', halo: col.panel });
        text(ctx, '73', A.X(290), A.Y(73 * 290) - 14, { color: col.s[3], size: 12, weight: 700, align: 'right', halo: col.panel });
      }
    }
    title(ctx, ['1929: nearby galaxies, distances too small', 'The same galaxies, distances corrected', 'Supernovae out to 400 Mpc: a clear straight line', 'Today: two careful methods, two answers'][step], col);
  };
  cv.redraw(); anim.play();
  return { step(i) { step = i; t = 0; cv.redraw(); anim.play(); } };
}
