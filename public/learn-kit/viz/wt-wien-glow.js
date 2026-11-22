// Hot things glow, and hotter things glow bluer. Planck's law gives the spectrum of a black body; slide the temperature
// (or jump to a lamp, the Sun, a hot star) and watch the peak move to shorter wavelength (Wien: λmax = 2898 µm K / T) and
// the total power climb as T⁴ (Stefan-Boltzmann). The grey band marks visible light, 400 to 700 nm.
import { canvas, axes, line, dot, text, title, row, slider, choice, readout } from '../kit.js';

const HC = 1.4388e-2; // second radiation constant, m K
const B = (lam, T) => 1 / (lam ** 5 * (Math.exp(HC / (lam * T)) - 1)); // relative
const PRE = { lamp: ['Bulb filament', 2800], sun: ['The Sun', 5772], star: ['Hot star', 10000], cool: ['Red dwarf', 3500] };
export default function (host) {
  let T = 5772, log = false;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Black-body spectrum with the peak wavelength and the visible band marked' });
  const ctl = row(host);
  choice(ctl, 'Examples', Object.entries(PRE).map(([k, v]) => [k, v[0]]), 'sun', (k) => { T = PRE[k][1]; sl.set(T); upd(); });
  const sl = slider(ctl, { label: 'Temperature', min: 1000, max: 12000, value: T, log: true, fmt: (v) => `${Math.round(v)} K`, oninput: (v) => { T = v; upd(); } });
  choice(row(host), 'Wavelength axis', [[false, 'Linear'], [true, 'Log']], log, (v) => { log = v; upd(); });
  const out = readout(host);
  const vis = (T_) => { let a = 0, b = 0; for (let l = 100e-9; l < 20e-6; l *= 1.01) { const d = B(l, T_) * l * 0.01; b += d; if (l >= 400e-9 && l <= 700e-9) a += d; } return a / b; };
  function upd() {
    const lm = 2.898e-3 / T;
    out.innerHTML = `T = ${Math.round(T)} K: peak at <b>${(lm * 1e9).toFixed(0)} nm</b> (${lm < 400e-9 ? 'ultraviolet' : lm > 700e-9 ? 'infrared' : 'visible'}), total power per area σT⁴ = <b>${(5.67e-8 * T ** 4 / 1e6).toFixed(2)} MW/m²</b> (${((T / 5772) ** 4).toFixed(2)}× the Sun's surface). Only about <b>${(vis(T) * 100).toFixed(0)} %</b> of it is visible light. Peak brightness per wavelength rises as T⁵ (×${(Math.pow(T / 5772, 5)).toFixed(2)} the Sun's); here every curve is drawn with its own peak at 1 so the shapes compare. Double T: peak wavelength halves, power ×16.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Black-body spectrum', col);
    const lmax = log ? 3e-6 : 3e-6, lmin = log ? 1e-7 : 0.05e-6, norm = B(2.898e-3 / T, T), top = 1.1;
    const A = axes(ctx, w, h, col, { x: log ? [0.1, 3] : [0, 3], y: [0, top], xlog: log, xlabel: 'wavelength (µm)', ylabel: 'intensity (peak = 1)', t: 34, l: 46, yt: [0, 0.5, 1], fy: (v) => v.toFixed(1), fx: (v) => (+v.toPrecision(2)).toString(), xt: log ? [0.1, 0.3, 1, 3] : [0, 1, 2, 3] });
    ctx.globalAlpha = 0.25; ctx.fillStyle = col.s[2]; ctx.fillRect(A.X(0.4), A.T, A.X(0.7) - A.X(0.4), A.B - A.T); ctx.globalAlpha = 1;
    text(ctx, 'visible', (A.X(0.4) + A.X(0.7)) / 2, A.T + 10, { color: col.s[2], size: 10, align: 'center', weight: 600 });
    const pts = [], pk = []; for (let k = 0; k <= 240; k++) { const l = log ? 0.1e-6 * Math.pow(30, k / 240) : (0.02e-6 + (3e-6 - 0.02e-6) * k / 240); pts.push([A.X(l * 1e6), A.Y(B(l, T) / norm)]); }
    ctx.save(); A.clip(); line(ctx, pts, col.s[3], 2.8);
    const lm = 2.898e-3 / T; line(ctx, [[A.X(lm * 1e6), A.B], [A.X(lm * 1e6), A.Y(B(lm, T) / norm)]], col.muted, 1.2, [4, 4]); dot(ctx, A.X(lm * 1e6), A.Y(B(lm, T) / norm), 5, col.s[0], col.panel);
    ctx.restore();
    text(ctx, `λmax = ${(lm * 1e9).toFixed(0)} nm`, Math.min(w - 80, A.X(lm * 1e6) + 8), A.Y(Math.min(top - 0.1, B(lm, T) / norm)) - 4, { color: col.ink, size: 11, weight: 600, halo: col.panel });
  };
  upd();
}
