// Colour, peak wavelength and power of a star from its surface temperature. Slide T from a cool red dwarf to a hot blue star; the
// disc shows the colour we would see, the curve is the blackbody spectrum (Planck) with the visible band shaded, and the readout
// gives Wien's law (peak wavelength = 2.898×10⁶ nm·K ÷ T), the spectral class and the luminosity L ∝ R²T⁴ for a radius you choose.
import { canvas, text, row, slider, readout, axes, line, dot, title } from '../kit.js';

const bb = (l, T) => { const h = 6.626e-34, c = 3e8, k = 1.381e-23, x = h * c / (l * 1e-9 * k * T); return 1 / (Math.pow(l, 5) * (Math.exp(Math.min(700, x)) - 1)); };
function colour(T) { // Tanner Helland blackbody approximation
  const t = Math.max(1000, Math.min(40000, T)) / 100; let r, g, b;
  r = t <= 66 ? 255 : 329.7 * Math.pow(t - 60, -0.1332); g = t <= 66 ? 99.47 * Math.log(t) - 161.1 : 288.1 * Math.pow(t - 60, -0.0755); b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5 * Math.log(t - 10) - 305.0;
  const cl = (v) => Math.max(0, Math.min(255, Math.round(v))); return `rgb(${cl(r)},${cl(g)},${cl(b)})`;
}
const cls = (T) => (T >= 30000 ? 'O' : T >= 10000 ? 'B' : T >= 7500 ? 'A' : T >= 6000 ? 'F' : T >= 5200 ? 'G' : T >= 3700 ? 'K' : 'M');
export default function (host) {
  let T = 5772, Rs = 1;
  const cv = canvas(host, { aspect: 0.75, max: 380, min: 290, label: 'Star colour disc and blackbody spectrum for a chosen temperature' });
  const c1 = row(host);
  slider(c1, { label: 'Surface temperature', min: 2500, max: 30000, value: T, log: true, fmt: (v) => `${Math.round(v / 10) * 10} K`, oninput: (v) => { T = v; show(); } });
  slider(c1, { label: 'Radius', min: 0.1, max: 100, value: Rs, log: true, fmt: (v) => `${v < 10 ? v.toFixed(1) : Math.round(v)} R☉`, oninput: (v) => { Rs = v; show(); } });
  const out = readout(host);
  function show() {
    const L = Rs * Rs * Math.pow(T / 5772, 4);
    out.innerHTML = `T = ${Math.round(T)} K: class <b>${cls(T)}</b>, peak at <b>${(2.898e6 / T).toFixed(0)} nm</b> (${2.898e6 / T < 380 ? 'ultraviolet' : 2.898e6 / T > 750 ? 'infrared' : 'visible'}). With radius ${Rs.toFixed(1)} R☉ its luminosity is <b>${L < 1e-2 ? L.toExponential(1) : L < 100 ? L.toFixed(2) : Math.round(L).toLocaleString()} L☉</b> (L = 4πR²σT⁴). Doubling the temperature makes each square metre shine 16 times more. Stars are not pure blackbodies, but the colour and peak follow this closely.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'A star and its blackbody spectrum', col);
    const rr = Math.min(34, 10 + 8 * Math.log10(Rs + 1) * 4), cx = 46, cy = 70; ctx.beginPath(); ctx.arc(cx, cy, Math.max(8, rr), 0, 7); ctx.fillStyle = colour(T); ctx.fill();
    text(ctx, `class ${cls(T)}`, cx + 50, cy, { color: col.ink, size: 13, weight: 700 });
    const A = axes(ctx, w, h, col, { x: [100, 2000], y: [0, 1.15], t: 118, l: 40, b: 34, xlabel: 'wavelength (nm)', xt: [400, 700, 1000, 1500, 2000], fx: (v) => v, yt: [], fy: () => '', grid: false, ylabel: 'relative intensity' });
    for (let l = 380; l < 750; l += 4) { ctx.fillStyle = `hsl(${270 - ((l - 380) / 370) * 270},90%,55%)`; ctx.globalAlpha = 0.28; ctx.fillRect(A.X(l), A.T, A.X(l + 4) - A.X(l) + 0.5, A.B - A.T); } ctx.globalAlpha = 1;
    const pk = 2.898e6 / T, mx = bb(pk, T), pts = []; for (let l = 100; l <= 2000; l += 10) pts.push([A.X(l), A.Y(bb(l, T) / mx)]);
    line(ctx, pts, col.ink, 2.4);
    if (pk >= 100 && pk <= 2000) { dot(ctx, A.X(pk), A.Y(1), 4.5, col.s[5]); text(ctx, `peak ${pk.toFixed(0)} nm`, Math.min(w - 70, A.X(pk) + 8), A.Y(1) + 6, { color: col.s[5], size: 10.5, weight: 700 }); }
    text(ctx, 'visible', A.X(565), A.B - 8, { color: col.muted, size: 10, align: 'center' });
  };
  show();
}
