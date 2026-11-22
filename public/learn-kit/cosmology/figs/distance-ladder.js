// 2.6 The cosmic distance ladder. Each rung reaches farther and is calibrated by the rung below, so the
// uncertainties stack up. Set how good each rung is and see the error on the Hubble constant (the rungs'
// percentage errors add in quadrature: √(a² + b² + ...)). Ranges are rounded.
import { canvas, text, line, row, slider, readout } from '../../kit.js';

const RUNGS = [ // [name, from (ly, log10), to, default % error]
  ['Radar and spacecraft (Solar System)', -5, -3, 0.0],
  ['Parallax (Gaia)', 0.5, 4.5, 1.0],
  ['Cepheids and tip-of-red-giant stars', 3.5, 8, 1.5],
  ['Type Ia supernovae', 7, 10, 1.3],
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 380, min: 260, label: 'The rungs of the distance ladder and how their errors add up' });
  const err = RUNGS.map((r) => r[3]);
  const ctl = row(host);
  RUNGS.slice(1).forEach((r, i) => slider(ctl, { label: `${r[0].split(' (')[0]} error`, min: 0, max: 8, step: 0.1, value: r[3], fmt: (v) => `${v.toFixed(1)}%`, oninput: (v) => { err[i + 1] = v; cv.redraw(); show(); } }));
  const out = readout(host);
  const total = () => Math.sqrt(err.reduce((q, e) => q + e * e, 0));
  const show = () => { const t = total(); out.innerHTML = `Combined error on distances to far galaxies, and so on the Hubble constant: <b>±${t.toFixed(1)}%</b>, that is about ±${(t * 0.73).toFixed(1)} km/s/Mpc on 73. Recent ladder results quote close to 1.5%.`; };
  cv.draw = (ctx, w, h, col) => {
    const L = 12, R = w - 12, X = (lg) => L + ((lg + 5.5) / 16) * (R - L);
    const rh = Math.min(48, (h - 60) / RUNGS.length);
    RUNGS.forEach(([name, a, b], i) => {
      const y = h - 48 - (i + 1) * rh;
      text(ctx, `${name}${i ? `: ±${err[i].toFixed(1)}%` : ''}`, L, y + 8, { color: col.ink, size: 11, weight: 600 });
      ctx.fillStyle = col.s[i]; ctx.fillRect(X(a), y + 16, X(b) - X(a), rh - 22);
      if (i > 0) line(ctx, [[X(a) + 4, y + rh - 6], [X(a) + 4, y + rh + 18]], col.ink, 1.5);
    });
    line(ctx, [[L, h - 40], [R, h - 40]], col.muted, 1);
    [[-5, '1 AU'], [0, '1 ly'], [4.4, 'Milky Way'], [6.4, 'Andromeda'], [9, '1 billion ly']].filter((t) => w > 520 || t[1] !== 'Andromeda').forEach(([lg, s]) => { line(ctx, [[X(lg), h - 44], [X(lg), h - 36]], col.muted, 1); text(ctx, s, X(lg), h - 24, { color: col.muted, size: 10.5, align: 'center' }); });
    text(ctx, 'distance (light-years, each tick ×10) →', R, h - 8, { color: col.muted, size: 10, align: 'right' });
  };
  cv.redraw(); show();
}
