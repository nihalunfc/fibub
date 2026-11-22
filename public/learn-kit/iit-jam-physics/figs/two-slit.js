// 3.7 Young's double slit. The strip shows what you would see on the screen (in the light's own colour); the graph
// shows the intensity. Sliders: wavelength, slit separation d, screen distance D and slit width a (a > 0 adds the
// single-slit envelope, so some fringes go missing). The fringe width lambda D / d is shown and marked.
import { canvas, axes, line, text, row, slider, readout, fmt } from '../../kit.js';

/** Rough colour of a visible wavelength in nm, as [r, g, b] 0..255. */
export function waveColour(nm) {
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else r = 1;
  const f = nm < 420 ? 0.3 + 0.7 * (nm - 380) / 40 : nm > 700 ? 0.3 + 0.7 * (780 - nm) / 80 : 1;
  return [r, g, b].map((c) => Math.round(255 * Math.pow(c * f, 0.8)));
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 280, label: 'Two-slit interference pattern and its intensity graph' });
  let lam = 550, d = 0.3, D = 1, a = 0;
  const ctl = row(host);
  const out = readout(host);
  const Y = 12; // half-width of the screen region shown, mm
  const I = (y) => {
    const s = (y * 1e-3) / D; // small angles: sin(theta) = y / D
    const delta = Math.PI * (d * 1e-3) * s / (lam * 1e-9);
    let env = 1;
    if (a > 0) { const b = Math.PI * (a * 1e-3) * s / (lam * 1e-9); env = Math.abs(b) < 1e-9 ? 1 : (Math.sin(b) / b) ** 2; }
    return env * Math.cos(delta) ** 2;
  };
  const beta = () => (lam * 1e-9 * D) / (d * 1e-3) * 1e3; // mm
  const show = () => {
    const miss = a > 0 ? ` With slits ${fmt(a, 2)} mm wide, every order that is a multiple of d/a = ${fmt(d / a, 3)} ${Number.isInteger(+(d / a).toFixed(6)) ? 'is missing' : 'would be missing if d/a were a whole number'}.` : '';
    out.innerHTML = `Fringe width β = λD/d = <b>${fmt(beta(), 3)} mm</b> (bright fringes at y = 0, ±β, ±2β, ...).${miss}`;
  };
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'Wavelength λ (nm)', min: 400, max: 700, step: 5, value: lam, fmt: (v) => fmt(v, 3), oninput: (v) => { lam = v; re(); } });
  slider(ctl, { label: 'Slit separation d (mm)', min: 0.1, max: 1, step: 0.01, value: d, fmt: (v) => fmt(v, 2), oninput: (v) => { d = v; if (a >= d) a = 0; re(); } });
  slider(ctl, { label: 'Screen distance D (m)', min: 0.5, max: 3, step: 0.1, value: D, fmt: (v) => fmt(v, 2), oninput: (v) => { D = v; re(); } });
  slider(ctl, { label: 'Slit width a (mm, 0 = very narrow)', min: 0, max: 0.2, step: 0.01, value: a, fmt: (v) => (v ? fmt(v, 2) : 'narrow'), oninput: (v) => { a = Math.min(v, d * 0.95); re(); } });

  cv.draw = (ctx, w, h, col) => {
    const [r, g, b] = waveColour(lam);
    const ax = axes(ctx, w, h, col, { x: [-Y, Y], y: [0, 1.1], t: h * 0.3, xlabel: 'position on screen y (mm)', ylabel: 'I / I₀', yt: [0, 0.5, 1] });
    // the screen strip
    const sT = 26, sB = h * 0.3 - 14;
    for (let px = ax.L; px <= ax.R; px++) {
      const y = -Y + ((px - ax.L) / (ax.R - ax.L)) * 2 * Y, v = I(y);
      ctx.fillStyle = `rgb(${Math.round(r * v)},${Math.round(g * v)},${Math.round(b * v)})`;
      ctx.fillRect(px, sT, 1.5, sB - sT);
    }
    text(ctx, 'what the screen shows', ax.L, sT - 8, { color: col.muted, size: 11 });
    const N = 900;
    ctx.save(); ax.clip();
    if (a > 0) {
      const env = (y) => { const s = (y * 1e-3) / D, q = Math.PI * (a * 1e-3) * s / (lam * 1e-9); return Math.abs(q) < 1e-9 ? 1 : (Math.sin(q) / q) ** 2; };
      line(ctx, Array.from({ length: N + 1 }, (_, i) => { const y = -Y + (2 * Y * i) / N; return [ax.X(y), ax.Y(env(y))]; }), col.muted, 1.2, [4, 4]);
    }
    line(ctx, Array.from({ length: N + 1 }, (_, i) => { const y = -Y + (2 * Y * i) / N; return [ax.X(y), ax.Y(I(y))]; }), `rgb(${r},${g},${b})`, 2);
    line(ctx, Array.from({ length: N + 1 }, (_, i) => { const y = -Y + (2 * Y * i) / N; return [ax.X(y), ax.Y(I(y))]; }), col.ink, 0.6);
    ctx.restore();
    // mark one fringe width
    const bw = beta();
    if (bw < Y) {
      const yy = ax.Y(1.05);
      line(ctx, [[ax.X(0), yy], [ax.X(bw), yy]], col.s[3], 2);
      text(ctx, 'β', ax.X(bw / 2), yy - 8, { color: col.s[3], size: 12, weight: 700, align: 'center' });
    }
  };
  re();
}
