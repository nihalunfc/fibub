// 6.1 Compton scattering. Top: the wavelength shift against scattering angle, the same curve for every photon
// energy (it peaks at two Compton wavelengths at 180 degrees). Bottom: the scattered photon's energy and the
// electron's kinetic energy against angle for the chosen photon energy, which shows that high-energy photons lose
// a much larger share. Sliders set the angle and the incident photon energy.
import { canvas, axes, line, dot, text, row, slider, readout, fmt } from '../../kit.js';

const LC = 2.426, MC2 = 511; // pm, keV
const DEG = Math.PI / 180;

export default function (host) {
  const cv = canvas(host, { aspect: 0.85, max: 480, min: 340, label: 'Compton shift and scattered photon energy against scattering angle' });
  let th = 90, E = 100;
  const ctl = row(host);
  const out = readout(host);
  const Ep = (t) => E / (1 + (E / MC2) * (1 - Math.cos(t * DEG)));
  const show = () => {
    const d = LC * (1 - Math.cos(th * DEG)), e2 = Ep(th), T = E - e2;
    const phi = th === 0 ? 90 : Math.atan(1 / ((1 + E / MC2) * Math.tan(th * DEG / 2))) / DEG;
    out.innerHTML = `At θ = ${th}°: Δλ = λ<sub>C</sub>(1 − cos θ) = <b>${fmt(d, 3)} pm</b> for any photon. A ${fmt(E, 4)} keV photon (λ = ${fmt(1239.84 / E, 3)} pm) leaves with <b>${fmt(e2, 4)} keV</b>; the electron takes <b>${fmt(T, 4)} keV</b> (${Math.round(100 * T / E)}%) and moves off at ${fmt(phi, 3)}° to the beam.`;
  };
  slider(ctl, { label: 'Scattering angle θ (°)', min: 0, max: 180, step: 1, value: th, fmt: (v) => fmt(v, 3), oninput: (v) => { th = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Photon energy (keV)', min: 10, max: 3000, value: E, log: true, fmt: (v) => fmt(v, 3), oninput: (v) => { E = v; cv.redraw(); show(); } });

  cv.draw = (ctx, w, h, col) => {
    const ts = Array.from({ length: 181 }, (_, i) => i);
    const top = axes(ctx, w, h, col, { x: [0, 180], y: [0, 5.2], b: h * 0.53, t: 26, xt: [0, 45, 90, 135, 180], ylabel: 'Δλ (pm)' });
    line(ctx, ts.map((t) => [top.X(t), top.Y(LC * (1 - Math.cos(t * DEG)))]), col.s[0], 2.5);
    line(ctx, [[top.X(th), top.T], [top.X(th), top.B]], col.s[3], 1.5);
    dot(ctx, top.X(th), top.Y(LC * (1 - Math.cos(th * DEG))), 5, col.s[3]);
    text(ctx, 'shift: same for every photon energy', top.L + 6, top.T + 8, { color: col.s[0], size: 11, weight: 600 });
    text(ctx, '2λ_C', top.X(180) - 4, top.Y(2 * LC) - 8, { color: col.muted, size: 11, align: 'right' });
    const bot = axes(ctx, w, h, col, { x: [0, 180], y: [0, 100], t: h * 0.62, xt: [0, 45, 90, 135, 180], yt: [0, 50, 100], xlabel: 'scattering angle θ (degrees)', ylabel: '% of E' });
    line(ctx, ts.map((t) => [bot.X(t), bot.Y(100 * Ep(t) / E)]), col.s[1], 2.5);
    line(ctx, ts.map((t) => [bot.X(t), bot.Y(100 - 100 * Ep(t) / E)]), col.s[2], 2, [5, 4]);
    line(ctx, [[bot.X(th), bot.T], [bot.X(th), bot.B]], col.s[3], 1.5);
    dot(ctx, bot.X(th), bot.Y(100 * Ep(th) / E), 5, col.s[1]);
    text(ctx, 'photon keeps', bot.R - 6, bot.Y(100 * Ep(150) / E) - 10, { color: col.s[1], size: 11, weight: 600, align: 'right', halo: col.panel });
    text(ctx, 'electron gets (dashed)', bot.R - 6, bot.Y(100 - 100 * Ep(150) / E) + 12, { color: col.s[2], size: 11, align: 'right', halo: col.panel });
  };
  cv.redraw(); show();
}
