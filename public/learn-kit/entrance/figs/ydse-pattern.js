// Wave optics: the pattern on a screen from Young's double slit, or from a single slit. Change the colour (wavelength),
// the slit separation d (or width a) and the screen distance D. Double slit: equally spaced fringes, width β = λD/d.
// Single slit: a central maximum twice as wide as the others, width 2λD/a, with much fainter side maxima.
import { canvas, axes, line, row, slider, choice, readout, text, fmt } from '../../kit.js';

// rough colour of a wavelength in nm (for the fringe strip)
function rgb(nm) {
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else r = 1;
  return [r, g, b].map((v) => Math.round(255 * Math.max(0, Math.min(1, v))));
}
export default function (host) {
  let mode = 'double', lam = 550, d = 0.3, D = 1, a = 0.1;
  const cv = canvas(host, { aspect: 0.6, max: 360, min: 250, label: 'Intensity pattern on a screen from slits' });
  const ctl = row(host);
  choice(ctl, 'Slits', [['double', 'Double slit'], ['single', 'Single slit']], mode, (v) => { mode = v; upd(); });
  slider(ctl, { label: 'Wavelength', min: 400, max: 700, step: 10, value: lam, fmt: (v) => `${v} nm`, oninput: (v) => { lam = v; upd(); } });
  slider(ctl, { label: 'Separation d', min: 0.1, max: 1, step: 0.05, value: d, fmt: (v) => `${v} mm`, oninput: (v) => { d = v; upd(); } });
  slider(ctl, { label: 'Slit width a', min: 0.05, max: 0.5, step: 0.01, value: a, fmt: (v) => `${v} mm`, oninput: (v) => { a = v; upd(); } });
  slider(ctl, { label: 'Screen D', min: 0.5, max: 2, step: 0.1, value: D, fmt: (v) => `${v} m`, oninput: (v) => { D = v; upd(); } });
  const out = readout(host);
  const I = (y) => { // y in mm on the screen
    const th = (y * 1e-3) / D, L = lam * 1e-9;
    const aa = mode === 'double' ? Math.min(a, 0.9 * d) : a, b = (Math.PI * aa * 1e-3 * th) / L, env = Math.abs(b) < 1e-9 ? 1 : (Math.sin(b) / b) ** 2;
    if (mode === 'single') return env;
    const ph = (Math.PI * d * 1e-3 * th) / L; return env * Math.cos(ph) ** 2;
  };
  const upd = () => {
    cv.redraw();
    const beta = (lam * 1e-9 * D) / (d * 1e-3) * 1e3, w0 = (2 * lam * 1e-9 * D) / ((mode === 'double' ? Math.min(a, 0.9 * d) : a) * 1e-3) * 1e3;
    out.innerHTML = mode === 'double'
      ? `Fringe width β = λD/d = <b>${fmt(beta, 3)} mm</b>. About ${Math.floor(w0 / beta)} bright fringes fit inside the central diffraction envelope (2λD/a = ${fmt(w0, 3)} mm). Red light gives wider fringes than blue.`
      : `Central maximum width 2λD/a = <b>${fmt(w0, 3)} mm</b>; first minima at ±λD/a = ±${fmt(w0 / 2, 3)} mm. A narrower slit spreads the light more.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const Y = 20; // half-width of screen view in mm
    const strip = 26;
    const { X, Y: YY, L, R } = axes(ctx, w, h - strip - 6, col, { x: [-Y, Y], y: [0, 1.1], xlabel: 'position on screen (mm)', ylabel: 'intensity', t: 24, fy: (v) => v.toFixed(1) });
    const pts = []; for (let i = 0; i <= 800; i++) { const y = -Y + (2 * Y * i) / 800; pts.push([X(y), YY(I(y))]); }
    const [r, g, b] = rgb(lam);
    line(ctx, pts, `rgb(${r},${g},${b})`, 2);
    // fringe strip as seen on the screen
    for (let px = Math.floor(L); px < R; px++) { const y = -Y + ((px - L) / (R - L)) * 2 * Y, v = I(y); ctx.fillStyle = `rgba(${r},${g},${b},${v})`; ctx.fillRect(px, h - strip, 1, strip - 4); }
    ctx.strokeStyle = col.line; ctx.strokeRect(L, h - strip, R - L, strip - 4);
    text(ctx, 'screen', L - 6, h - strip / 2 - 2, { color: col.muted, size: 10, align: 'right' });
  };
  upd();
}
