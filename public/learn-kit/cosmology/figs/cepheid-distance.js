// 2.3 How Hubble measured Andromeda (1923-25), in four steps: (1) a Cepheid's brightness rises and falls;
// (2) time one cycle; (3) Leavitt's law turns the period into the star's true power; (4) compare true power
// with how faint it looks to get the distance. The light curve is made up but shaped like a real Cepheid's;
// the period-luminosity line is a rounded modern version (V band). Hubble's own answer was about 900,000
// light-years; with today's calibration it is about 2.5 million.
import { canvas, text, line, dot, axes, ease, loop, calm } from '../../kit.js';

const P = 31.4; // days
const mag = (t) => { const ph = ((t / P) % 1 + 1) % 1; return 19.2 + 0.45 * (ph < 0.25 ? 1 - ph / 0.25 : (ph - 0.25) / 0.75) * 2 - 0.45; }; // sawtooth: fast rise, slow fall
export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'A Cepheid star\'s light curve, the period-luminosity law and the distance it gives' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt * 0.8); cv.redraw(); } }, { autoplay: false });
  const M = -2.4 * (Math.log10(P) - 1) - 4.1; // absolute magnitude from the period
  const mAvg = 19.2;
  const dPc = Math.pow(10, (mAvg - M + 5) / 5);
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    if (step <= 1) {
      const a = axes(ctx, w, h, col, { x: [0, 70], y: [20.0, 18.4], xlabel: 'days of watching', ylabel: 'magnitude (up = brighter)', t: 34, fy: (v) => v.toFixed(1) });
      const end = step === 0 ? 70 * e : 70, pts = [];
      for (let t = 0; t <= end; t += 0.5) pts.push([a.X(t), a.Y(mag(t))]);
      line(ctx, pts, col.s[0], 2);
      text(ctx, 'A Cepheid in the Andromeda nebula (made-up but realistic)', 10, 16, { color: col.ink, size: 12, weight: 600 });
      if (step === 1) {
        const t1 = 0.25 * P, t2 = t1 + P;
        line(ctx, [[a.X(t1), a.Y(18.75) - 14], [a.X(t2), a.Y(18.75) - 14]], col.s[1], 2);
        text(ctx, `one cycle = ${P} days`, (a.X(t1) + a.X(t2)) / 2, a.Y(18.75) - 24, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
      }
    } else {
      const a = axes(ctx, w, h, col, { t: step >= 3 ? 76 : 34, x: [1, 100], xlog: true, y: [-1.5, -7], xlabel: 'period (days)', ylabel: 'true power (abs. magnitude)', fy: (v) => v.toFixed(0), xt: [1, 3, 10, 30, 100], fx: (v) => String(v) });
      const pts = []; for (let p = 1; p <= 100; p *= 1.1) pts.push([a.X(p), a.Y(-2.4 * (Math.log10(p) - 1) - 4.1)]);
      line(ctx, pts, col.s[2], 2);
      text(ctx, 'Leavitt\'s law: slower Cepheids are more powerful', 10, 16, { color: col.ink, size: 12, weight: 600 });
      const x = a.X(P), y = a.Y(M);
      line(ctx, [[x, a.B], [x, y]], col.s[1], 1.5, [4, 3]);
      line(ctx, [[x, y], [a.L, y]], col.s[1], 1.5, [4, 3]);
      dot(ctx, x, y, 5, col.s[1]);
      text(ctx, `${P} days → M ≈ ${M.toFixed(1)}`, x + 8, y + 14, { color: col.ink, size: 12, weight: 700, halo: col.panel });
      if (step >= 3) {
        const ly = dPc * 3.2616;
        text(ctx, `It looks like m ≈ ${mAvg}, so m − M = ${(mAvg - M).toFixed(1)}`, a.L + 10, 44, { color: col.ink, size: 12, weight: 600, halo: col.panel });
        text(ctx, `distance ≈ ${(dPc / 1e6).toFixed(2)} million parsecs ≈ ${(ly / 1e6).toFixed(1)} million ly`, a.L + 10, 62, { color: col.ink, size: 12.5, weight: 700, halo: col.panel });
      }
    }
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
