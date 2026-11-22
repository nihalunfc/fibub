// 11.6 Where gravity and quantum theory collide, on a map of mass against size (both log scales).
// Rising line: the Schwarzschild radius 2Gm/c². Squeeze a mass inside it and it is a black hole, so nothing
// ordinary sits below this line. Falling line: the reduced Compton wavelength ħ/(mc), the size of a particle's
// quantum fuzz: below it, quantum effects rule. The lines cross at m = √(ħc/2G) = m_P/√2 ≈ 1.5 × 10⁻⁸ kg and
// size √2 l_P ≈ 2.3 × 10⁻³⁵ m: the Planck scale, where both matter at once and neither theory works alone.
// Objects (mass kg, radius m): electron (its Compton wavelength, it has no known size), proton (0.84 fm), hydrogen
// atom (Bohr radius), person, Earth, Sun, neutron star (1.4 M☉, 12 km), Sun-mass black hole (2.95 km), M87* (6.5 × 10⁹ M☉).
import { canvas, axes, text, title, line, dot } from '../../kit.js';
import { G, C, M_SUN } from '../phys.js';

const HBAR = 1.054571817e-34;
const sup = (e) => String(e).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)]);

export default function (host) {
  const cv = canvas(host, { aspect: 0.85, max: 470, min: 340, label: 'Mass against size: the black-hole line and the quantum line cross at the Planck scale' });
  const rs = (m) => (2 * G * m) / (C * C), lc = (m) => HBAR / (m * C);
  const objs = [
    [9.109e-31, lc(9.109e-31), 'electron'], [1.673e-27, 8.4e-16, 'proton'], [1.674e-27, 5.29e-11, 'atom'],
    [70, 0.9, 'person'], [5.97e24, 6.37e6, 'Earth'], [M_SUN, 6.96e8, 'Sun'], [1.4 * M_SUN, 1.2e4, 'neutron star'],
    [M_SUN, rs(M_SUN), 'black hole'], [6.5e9 * M_SUN, rs(6.5e9 * M_SUN), 'M87*'],
  ];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Gravity meets quantum: the Planck scale', col);
    const A = axes(ctx, w, h, col, { x: [1e-32, 1e42], y: [1e-40, 1e16], xlog: true, ylog: true, t: top + 12, l: 50,
      xt: [1e-30, 1e-15, 1, 1e15, 1e30], yt: [1e-40, 1e-30, 1e-20, 1e-10, 1, 1e10], fx: (v) => '10' + sup(Math.round(Math.log10(v))), fy: (v) => (v === 1 ? '1' : '10' + sup(Math.round(Math.log10(v)))),
      xlabel: 'mass (kg)', ylabel: 'size (m)' });
    ctx.save(); A.clip();
    // shaded regions
    const poly = (pts, c) => { ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = c; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.restore(); };
    poly([[A.X(1e-32), A.B], [A.X(1e-32), A.Y(rs(1e-32))], [A.X(1e42), A.Y(rs(1e42))], [A.X(1e42), A.B]], col.ink);
    poly([[A.X(1e-32), A.B], [A.X(1e-32), A.Y(Math.min(1e16, lc(1e-32)))], [A.X(1e42), A.Y(lc(1e42))], [A.X(1e42), A.B]], col.s[0]);
    line(ctx, [[A.X(1e-32), A.Y(rs(1e-32))], [A.X(1e42), A.Y(rs(1e42))]], col.ink, 2.5);
    line(ctx, [[A.X(1e-32), A.Y(lc(1e-32))], [A.X(1e42), A.Y(lc(1e42))]], col.s[0], 2.5);
    ctx.restore();
    const mx = Math.sqrt((HBAR * C) / (2 * G));
    dot(ctx, A.X(mx), A.Y(rs(mx)), 7, col.s[3], col.panel);
    text(ctx, 'Planck scale', A.X(mx), A.Y(rs(mx)) - 14, { color: col.s[3], size: 12, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'black-hole line, 2Gm/c²', A.X(1e6) + 8, A.Y(rs(1e6)) + 6, { color: col.ink, size: 10.5, weight: 700, halo: col.panel });
    text(ctx, 'quantum line, ħ/mc', A.X(1e-21), A.Y(lc(1e-21)) - 10, { color: col.s[0], size: 10.5, weight: 700, halo: col.panel });
    text(ctx, 'too small: a black hole', A.X(1e25), A.Y(1e-28), { color: col.muted, size: 10.5, align: 'center', halo: col.panel });
    text(ctx, 'quantum fuzz', A.X(1e-25), A.Y(1e-36), { color: col.s[0], size: 10.5, align: 'center', halo: col.panel });
    for (const [m, r, lab] of objs) {
      dot(ctx, A.X(m), A.Y(r), 4, col.s[1], col.panel);
      const right = lab !== 'M87*' && lab !== 'neutron star';
      text(ctx, lab, A.X(m) + (right ? 7 : -7), A.Y(r) + (lab === 'black hole' ? 8 : lab === 'atom' ? -6 : 0), { color: col.ink, size: 10.5, align: right ? 'left' : 'right', halo: col.panel });
    }
  };
  cv.redraw();
}
