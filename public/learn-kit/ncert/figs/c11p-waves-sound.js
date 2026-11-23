// Class 11 Waves: speed of sound in a gas. Newton assumed the squeezing is slow and isothermal: v = sqrt(P / rho) = sqrt(RT / M), about 280 m/s in air at 0 C.
// Laplace saw that compressions are too fast for heat to flow: adiabatic, v = sqrt(gamma P / rho) = sqrt(gamma R T / M), 331 m/s at 0 C, which matches experiment.
// Pick a gas and a temperature; v rises with sqrt(T) and falls with sqrt(M). Dry-air-like gammas: air 1.40, He 1.67, H2 1.41, CO2 1.30.
import { canvas, text, title, line, row, slider, choice, readout } from '../../kit.js';

const GAS = { air: [28.97, 1.4, 'Air'], he: [4.003, 1.67, 'Helium'], h2: [2.016, 1.41, 'Hydrogen'], co2: [44.01, 1.3, 'CO₂'] };
export default function (host) {
  let g = 'air', T = 273.15 + 20, adi = true;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'Speed of sound in different gases with the Newton and Laplace formulas' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Formula', [[true, 'Laplace (adiabatic)'], [false, 'Newton (isothermal)']], adi, (v) => { adi = v; go(); });
  choice(ctl, 'Gas', Object.entries(GAS).map(([k, [, , n]]) => [k, n]), g, (v) => { g = v; go(); });
  slider(ctl, { label: 'temperature (°C)', min: -20, max: 100, step: 5, value: T - 273.15, fmt: (v) => v.toFixed(0), oninput: (v) => { T = v + 273.15; go(); } });
  const sp = (k, newton) => { const [M, ga] = GAS[k]; return Math.sqrt((newton ? 1 : ga) * 8.314 * T / (M * 1e-3)); };
  const go = () => { ro.innerHTML = `${GAS[g][2]} at ${(T - 273.15).toFixed(0)} °C: Newton ${sp(g, true).toFixed(0)} m/s, Laplace <b>${sp(g, false).toFixed(0)} m/s</b>. v ∝ √T (about +0.6 m/s per °C in air) and independent of pressure at fixed T.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Speed of sound (m/s)', col), keys = Object.keys(GAS), x0 = 74, x1 = w - 52, bh = Math.min(30, (h - top - 40) / 4 - 8), vmax = 1450;
    keys.forEach((k, i) => { const y = top + 14 + i * (bh + 12), v = sp(k, !adi);
      text(ctx, GAS[k][2], x0 - 8, y + bh / 2, { color: k === g ? col.ink : col.muted, size: 12, weight: k === g ? 700 : 400, align: 'right' });
      ctx.fillStyle = k === g ? col.s[0] : col.line; ctx.fillRect(x0, y, (x1 - x0) * v / vmax, bh);
      text(ctx, v.toFixed(0), x0 + (x1 - x0) * v / vmax + 5, y + bh / 2, { color: col.ink, size: 11.5, weight: 700 }); });
    const yy = top + 14 + 4 * (bh + 12) - 4; text(ctx, adi ? 'v = √(γRT/M): heat has no time to flow' : 'v = √(RT/M): too slow in practice, 15 % low', w / 2, yy + 8, { color: col.s[3], size: 11.5, weight: 700, align: 'center' });
  };
  go();
}
