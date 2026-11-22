// Class 9 Sound: a sound wave is a longitudinal wave. Particles of air (rows of dots) move back and forth along the
// direction the wave travels. Where they bunch up the air is squeezed (compression, high pressure); where they spread
// out it is thin (rarefaction, low pressure). Displacement xi = a sin(kx - wt); the pressure change is proportional to
// -d(xi)/dx, so it is highest where the dots are most crowded. One red dot only vibrates about its home: the wave
// travels, the air does not. The frequency slider changes the wavelength (speed stays the same), drawn in slow motion.
import { canvas, text, title, dot, line, row, slider, loop, readout, choice, font } from '../../kit.js';

export default function (host) {
  let f = 2, t = 0, path = true;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Rows of air particles with compressions and rarefactions moving right and a pressure graph underneath' });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  anim.button(ctl);
  slider(ctl, { label: 'Frequency', min: 1, max: 4, step: 0.5, value: f, fmt: (v) => `${v} (slow motion)`, oninput: (v) => { f = v; upd(); } });
  choice(ctl, 'Red dot trail', [[1, 'Show'], [0, 'Hide']], 1, (v) => { path = !!v; cv.redraw(); });
  const out = readout(host);
  function upd() { out.innerHTML = `Frequency ${f} means ${f} compressions pass every second in this slow-motion picture. The red dot only swings left and right about its home; the squeeze travels on without it. More frequency, shorter wavelength (distance from one compression to the next).`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Air particles: compressions and rarefactions', col);
    const lam = 0.6 * w / f, k = 2 * Math.PI / lam, v = 0.3 * w, om = k * v, a = 0.36 / k;
    const cols = 40, rows = 5, x0 = 14, L = w - 28, sp = L / (cols - 1);
    const top = 56, rh = Math.min(15, h * 0.04);
    // C and R labels
    for (let m = -2; m < 8; m++) {
      const xc = (Math.PI + 2 * Math.PI * m + om * t) / k + x0, xr = (2 * Math.PI * m + om * t) / k + x0;
      if (xc > x0 + 6 && xc < x0 + L - 6) text(ctx, 'C', xc, 38, { color: col.s[1], size: 11, weight: 700, align: 'center' });
      if (xr > x0 + 6 && xr < x0 + L - 6) text(ctx, 'R', xr, 38, { color: col.s[0], size: 11, weight: 700, align: 'center' });
    }
    const mid = 20;
    for (let r = 0; r < rows; r++) for (let i = 0; i < cols; i++) {
      const xr0 = x0 + i * sp, xi = a * Math.sin(k * (xr0 - x0) - om * t);
      const y = top + r * rh;
      if (r === 2 && i === mid) {
        if (path) line(ctx, [[xr0 - a, y], [xr0 + a, y]], col.s[1], 2, [3, 3]);
        dot(ctx, xr0 + xi, y, 4.2, col.s[1]);
      } else dot(ctx, xr0 + xi, y, 2.6, col.muted);
    }
    text(ctx, 'home', x0 + mid * sp + 16, top + 4 * rh + 12, { color: col.s[1], size: 10, align: 'center' });
    ctx.save(); ctx.setLineDash([2, 4]); ctx.strokeStyle = col.s[1]; ctx.beginPath(); ctx.moveTo(x0 + mid * sp, top + 4 * rh + 6); ctx.lineTo(x0 + mid * sp, h * 0.9); ctx.stroke(); ctx.restore();
    // pressure graph
    const gy = h * 0.76, gh = h * 0.12, gl = x0, gr = x0 + L;
    line(ctx, [[gl, gy], [gr, gy]], col.line, 1.2);
    const pts = []; for (let px = 0; px <= L; px += 2) pts.push([gl + px, gy - gh * -Math.cos(k * px - om * t)]);
    line(ctx, pts, col.s[2], 2.4);
    text(ctx, 'high pressure', gl + 2, gy - gh - 9, { color: col.muted, size: 10 });
    text(ctx, 'low', gl + 2, gy + gh + 9, { color: col.muted, size: 10 });
    text(ctx, 'Pressure along the wave', gr - 2, h - 10, { color: col.ink, size: 10.5, align: 'right' });
    // wavelength ruler (fixed, always the true length of one wavelength in this picture)
    const ya = top + 5 * rh + 16;
    line(ctx, [[x0, ya], [x0 + lam, ya]], col.s[3], 2); line(ctx, [[x0, ya - 4], [x0, ya + 4]], col.s[3], 2); line(ctx, [[x0 + lam, ya - 4], [x0 + lam, ya + 4]], col.s[3], 2);
    text(ctx, 'one wavelength', x0 + lam + 6, ya, { color: col.s[3], size: 10, weight: 700 });
  };
  upd();
  return {};
}
