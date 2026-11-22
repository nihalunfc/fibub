// 4.7 How old is the universe? The age depends on the expansion rate today (H0) and on how the expansion
// changed. Three curves: an empty universe (age = 1/H0), one full of matter only (2/3 of 1/H0) and the standard
// model with dark energy (Planck 2018 densities). The grey band is the age of the oldest stars. Slide H0.
import { canvas, axes, text, title, line, row, slider, readout } from '../../kit.js';
import { ageGyr, hubbleTimeGyr } from '../phys.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 290, label: 'Age of the universe against the Hubble constant for three kinds of universe' });
  let H0 = 70;
  const models = [
    ['empty: 1/H₀', (h) => hubbleTimeGyr(h)],
    ['standard (dark energy)', (h) => ageGyr(0, { H0: h, Om: 0.31, Or: 9e-5, OL: 0.69 })],
    ['matter only: ⅔ of 1/H₀', (h) => (2 / 3) * hubbleTimeGyr(h)],
  ];
  const curves = models.map(([, f]) => Array.from({ length: 26 }, (_, i) => { const h = 50 + i * 2; return [h, f(h)]; }));
  const ctl = row(host);
  slider(ctl, { label: 'Hubble constant H₀', min: 50, max: 100, step: 0.5, value: H0, fmt: (v) => `${v} km/s/Mpc`, oninput: (v) => { H0 = v; show(); cv.redraw(); } });
  const out = readout(host);
  const show = () => {
    const [e, s, m] = models.map(([, f]) => f(H0));
    out.innerHTML = `At H₀ = ${H0}: empty <b>${e.toFixed(1)}</b>, standard <b>${s.toFixed(1)}</b>, matter only <b>${m.toFixed(1)}</b> billion years. ${m < 12 ? 'A matter-only universe would be younger than its oldest stars.' : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [50, 100], y: [5, 21], t: 40, xlabel: 'Hubble constant H₀ (km/s per Mpc)', ylabel: 'Age (billion years)' });
    ctx.fillStyle = col.soft; ctx.fillRect(A.L + 1, A.Y(13.5), A.R - A.L - 1, A.Y(12) - A.Y(13.5));
    text(ctx, 'oldest stars', A.R - 6, A.Y(12.75), { color: col.muted, size: 11, align: 'right' });
    const cs = [col.s[1], col.s[3], col.s[0]];
    curves.forEach((c, i) => line(ctx, c.map(([x, y]) => [A.X(x), A.Y(y)]), cs[i], 2));
    // labels at the left end, stacked
    models.forEach(([name], i) => text(ctx, '— ' + name, A.R - 6, A.T + 10 + i * 16, { color: cs[i], size: 11.5, weight: 700, align: 'right', halo: col.panel }));
    line(ctx, [[A.X(H0), A.T], [A.X(H0), A.B]], col.ink, 1, [4, 3]);
    title(ctx, 'Faster expansion today means a younger universe', col);
  };
  show(); cv.redraw();
}
