// Class 11 Chemistry, Structure of Atom: electromagnetic radiation. c = nu x lambda and E = h x nu = hc / lambda.
// Slide the wavelength (log scale) from gamma rays to radio waves; the figure names the region, shows the frequency and the
// energy of one photon (in eV) and of one mole of photons (kJ/mol). h = 6.626e-34 J s, c = 3.00e8 m/s.
import { canvas, text, title, row, slider, readout, loop } from '../../kit.js';

const REG = [[1e-11, 'gamma rays'], [1e-8, 'X-rays'], [4e-7, 'ultraviolet'], [7.5e-7, 'visible'], [1e-3, 'infrared'], [1e-1, 'microwave'], [1e9, 'radio waves']];
const region = (l) => REG.find((r) => l < r[0])[1];
export default function (host) {
  let lam = 5.5e-7, t = 0;
  const cv = canvas(host, { aspect: 0.52, max: 440, min: 300, label: 'A wave whose wavelength you set, with its frequency and photon energy' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'wavelength (m, log scale)', min: 1e-12, max: 1e3, value: lam, log: true, fmt: (v) => v.toExponential(1) + ' m', oninput: (v) => { lam = v; go(); } });
  const go = () => { const nu = 3e8 / lam, E = 6.626e-34 * nu; ro.textContent = `λ = ${lam.toExponential(2)} m → ν = c/λ = ${nu.toExponential(2)} Hz → E = hν = ${E.toExponential(2)} J = ${(E / 1.602e-19).toExponential(2)} eV per photon = ${(E * 6.022e23 / 1000).toExponential(2)} kJ/mol. Region: ${region(lam)}.`; cv.redraw(); };
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, region(lam), col) + 14, y0 = t0 + 44, A = 28, lg = Math.log10(lam), cycles = Math.max(0.6, Math.min(9, 4.5 - (lg + 6) * 0.45)), L = 14, W = w - 28;
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let i = 0; i <= 200; i++) { const x = L + W * i / 200, y = y0 + A * Math.sin(i / 200 * cycles * 6.283 - t * 3); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    text(ctx, `${cycles < 1 ? 'a fraction of a' : 'about ' + cycles.toFixed(1)} wavelength${cycles >= 1.5 ? 's' : ''} drawn (not to scale)`, w / 2, y0 + A + 14, { color: col.muted, size: 10.5, align: 'center' });
    const by = y0 + A + 46, f = (l) => (Math.log10(l) + 12) / 15; ctx.fillStyle = col.panel; ctx.fillRect(L, by, W, 22);
    for (let i = 0; i < 30; i++) { const l = 4e-7 + i / 29 * 3.5e-7, x = L + W * f(l); ctx.fillStyle = `hsl(${270 - i / 29 * 270},85%,52%)`; ctx.fillRect(x, by, W * 0.0089 * 3.5 + 1, 22); }
    REG.forEach((r, i) => { const x0 = L + W * (i ? f(REG[i - 1][0]) : 0), x1 = L + W * f(Math.min(r[0], 1e3)); ctx.strokeStyle = col.line; ctx.strokeRect(x0, by + 26, x1 - x0, 22); });
    [['γ', 0], ['X', 1], ['UV', 2], ['vis', 3], ['IR', 4], ['μw', 5], ['radio', 6]].forEach(([s, i]) => { const x0 = L + W * (i ? f(REG[i - 1][0]) : 0), x1 = L + W * f(Math.min(REG[i][0], 1e3)); text(ctx, s, (x0 + x1) / 2, by + 37, { color: col.muted, size: 10, align: 'center' }); });
    const mx = L + W * f(lam); ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(mx, by - 4); ctx.lineTo(mx - 6, by - 14); ctx.lineTo(mx + 6, by - 14); ctx.fill();
    text(ctx, 'short λ, high energy', L, by + 62, { color: col.muted, size: 10.5 }); text(ctx, 'long λ, low energy', L + W, by + 62, { color: col.muted, size: 10.5, align: 'right' });
  };
  go();
}
