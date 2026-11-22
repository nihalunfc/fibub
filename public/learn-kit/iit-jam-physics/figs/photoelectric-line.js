// 6.1 The photoelectric straight line. Stopping potential against light frequency for three metals: parallel
// lines of slope h/e, each starting at its own threshold frequency (dashed below it, where no electrons come out).
// A slider sets the frequency; the readout gives the photon energy, K_max and the stopping potential for the
// chosen metal, or says that no electrons are emitted.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

const H_EV = 4.1357e-15; // Planck constant in eV s
const METALS = [['cs', 'caesium', 2.1], ['na', 'sodium', 2.3], ['zn', 'zinc', 4.3]];

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 420, min: 280, label: 'Stopping potential against frequency for three metals: parallel straight lines' });
  let nu = 8, metal = 'na'; // nu in units of 10^14 Hz
  const ctl = row(host);
  const out = readout(host);
  const phiOf = (id) => METALS.find((m) => m[0] === id)[2];
  const show = () => {
    const E = H_EV * nu * 1e14, phi = phiOf(metal), name = METALS.find((m) => m[0] === metal)[1];
    const nu0 = phi / H_EV / 1e14;
    out.innerHTML = `Photon energy hν = <b>${fmt(E, 3)} eV</b> (λ = ${fmt(1239.84 / E, 3)} nm). ${name[0].toUpperCase() + name.slice(1)}: work function ${phi} eV, threshold ${fmt(nu0, 3)}×10¹⁴ Hz. ` +
      (E > phi ? `K<sub>max</sub> = hν − φ = <b>${fmt(E - phi, 3)} eV</b>, so the stopping potential is <b>${fmt(E - phi, 3)} V</b>.` : '<b>No electrons</b>: each photon has less energy than the work function, however bright the light.');
  };
  slider(ctl, { label: 'Frequency (10¹⁴ Hz)', min: 2, max: 20, step: 0.1, value: nu, fmt: (v) => fmt(v, 3), oninput: (v) => { nu = v; cv.redraw(); show(); } });
  choice(ctl, 'Metal', METALS.map((m) => [m[0], m[1]]), metal, (v) => { metal = v; cv.redraw(); show(); });

  cv.draw = (ctx, w, h, col) => {
    const a = axes(ctx, w, h, col, { x: [0, 20], y: [-5, 6], xlabel: 'frequency ν (10¹⁴ Hz)', ylabel: 'stopping potential (V)', t: 28 });
    ctx.save(); a.clip();
    line(ctx, [[a.L, a.Y(0)], [a.R, a.Y(0)]], col.muted, 1);
    METALS.forEach(([id, name, phi], i) => {
      const nu0 = phi / H_EV / 1e14, V = (x) => H_EV * x * 1e14 - phi;
      const c = col.s[i], wdt = id === metal ? 3 : 1.6;
      line(ctx, [[a.X(0), a.Y(V(0))], [a.X(nu0), a.Y(0)]], c, 1, [4, 4]);
      line(ctx, [[a.X(nu0), a.Y(0)], [a.X(20), a.Y(V(20))]], c, wdt);
      dot(ctx, a.X(nu0), a.Y(0), 4, c);
      text(ctx, `${name} (φ = ${phi} eV)`, a.X(Math.min(19.5, nu0 + 6.5)), a.Y(V(Math.min(19.5, nu0 + 6.5))) - 10, { color: c, size: 11, weight: 600, align: 'right', halo: col.panel });
    });
    const phi = phiOf(metal), Vn = H_EV * nu * 1e14 - phi, ci = METALS.findIndex((m) => m[0] === metal);
    line(ctx, [[a.X(nu), a.T], [a.X(nu), a.B]], col.s[3], 1.5);
    if (Vn > 0) dot(ctx, a.X(nu), a.Y(Vn), 6, col.s[ci], col.panel);
    ctx.restore();
    text(ctx, 'every line has slope h/e; dashed: extrapolation to −φ/e', a.L + 6, a.B - 10, { color: col.muted, size: 11 });
  };
  cv.redraw(); show();
}
