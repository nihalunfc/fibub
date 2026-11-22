// 5.1 The scale factor. Galaxies sit at fixed "map" positions (comoving coordinates, the grid labels); the real
// distance between them is a × the map distance. Slide a: the map stays the same, the real distances,
// the redshift of light sent at that time (z = 1/a − 1) and the background temperature (2.7 K / a) all follow.
import { canvas, text, title, line, dot, row, slider, readout, rng } from '../../kit.js';
import { T_CMB } from '../phys.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 280, label: 'A grid of galaxies drawn larger or smaller by the scale factor' });
  let a = 1;
  const ctl = row(host);
  slider(ctl, { label: 'Scale factor a', min: 0.1, max: 2, step: 0.01, value: a, fmt: (v) => v.toFixed(2), oninput: (v) => { a = v; show(); cv.redraw(); } });
  const out = readout(host);
  const r = rng(3), gal = [];
  for (let i = -4; i <= 4; i++) for (let j = -3; j <= 3; j++) gal.push([i + (r() - 0.5) * 0.5, j + (r() - 0.5) * 0.5]);
  const show = () => {
    const z = 1 / a - 1;
    out.innerHTML = a < 1
      ? `a = ${a.toFixed(2)}: every distance was <b>${(a * 100).toFixed(0)}%</b> of today's. Light sent then reaches us with redshift <b>z = ${z.toFixed(2)}</b>, and space was filled with light at <b>${(T_CMB / a).toFixed(1)} K</b>.`
      : a > 1 ? `a = ${a.toFixed(2)}: the future. Every distance will be <b>${a.toFixed(2)}×</b> today's, and the background light will have cooled to <b>${(T_CMB / a).toFixed(2)} K</b>.`
      : 'a = 1 is today, by definition. The map distance and the real distance are the same.';
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'One number, a, sets every distance at once', col) + 8;
    const cx = w / 2, cy = (top + h - 24) / 2, S = Math.min(w / 10, (h - top - 30) / 7) * 0.9;
    // the comoving grid, drawn at the real size a × map
    ctx.save(); ctx.beginPath(); ctx.rect(0, top, w, h - top - 26); ctx.clip();
    for (let i = -10; i <= 10; i++) {
      line(ctx, [[cx + i * a * S * 1.0, top], [cx + i * a * S, h]], col.line, 1);
      line(ctx, [[0, cy + i * a * S], [w, cy + i * a * S]], col.line, 1);
    }
    gal.forEach(([x, y]) => dot(ctx, cx + x * a * S, cy + y * a * S, 3.2, col.ink));
    const A = gal[30], B = gal[32];
    dot(ctx, cx + A[0] * a * S, cy + A[1] * a * S, 5.5, col.s[3]); dot(ctx, cx + B[0] * a * S, cy + B[1] * a * S, 5.5, col.s[0]);
    line(ctx, [[cx + A[0] * a * S, cy + A[1] * a * S], [cx + B[0] * a * S, cy + B[1] * a * S]], col.ink, 1.5, [4, 3]);
    ctx.restore();
    const map = Math.hypot(A[0] - B[0], A[1] - B[1]) * 100; // map units: Mpc
    text(ctx, `map distance ${map.toFixed(0)} Mpc × a = real distance ${(map * a).toFixed(0)} Mpc`, w / 2, h - 12, { color: col.ink, size: 12, weight: 600, align: 'center' });
  };
  show(); cv.redraw();
}
