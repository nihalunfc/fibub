// An AC generator. A coil turns at a steady rate in a uniform field B. The flux through it is Φ = NBA cosθ and the EMF it
// gives is ε = −dΦ/dt = NBAω sinθ: biggest when the coil is edge-on to the field (flux changing fastest), zero when
// face-on. Slow it down, add turns or a stronger field and watch both graphs. Drag the picture to turn the view.
import { canvas, axes, line, text, row, slider, readout, loop, dot } from '../kit.js';
import { orbit } from './_3d.js';
import { drawCoil } from './_em-coil.js';

export default function (host) {
  let N = 50, Bf = 0.3, f = 1, A = 0.02, th = 0.4, hist = [];
  const cv = canvas(host, { aspect: 1.05, max: 430, min: 340, label: 'A coil rotating in a magnetic field with flux and EMF graphs' });
  const cam = orbit(cv, { yaw: 0.5, pitch: 0.55 });
  const ctl = row(host), c2 = row(host);
  slider(ctl, { label: 'Turns N', min: 10, max: 200, value: N, step: 5, fmt: (x) => x, oninput: (x) => { N = x; show(); } });
  slider(ctl, { label: 'B', min: 0.1, max: 1, value: Bf, step: 0.05, fmt: (x) => x.toFixed(2) + ' T', oninput: (x) => { Bf = x; show(); } });
  slider(c2, { label: 'Turns per second', min: 0.25, max: 3, value: f, step: 0.05, fmt: (x) => x.toFixed(2) + ' Hz', oninput: (x) => { f = x; show(); } });
  const out = readout(host);
  const anim = loop(host, (dt) => { th += dt * 2 * Math.PI * Math.min(f, 1) * 0.6; /* drawn slower than the true rate */ hist.push([th, 0]); if (hist.length > 400) hist.shift(); cv.redraw(); show(); }); anim.button(c2);
  const peak = () => N * Bf * A * 2 * Math.PI * f;
  function show() { out.innerHTML = `ε<sub>0</sub> = NBAω = ${N} × ${Bf} T × 0.02 m² × 2π(${f} Hz) = <b>${peak().toFixed(2)} V</b> peak, rms ${(peak() / Math.SQRT2).toFixed(2)} V. Now: θ = ${((th * 180 / Math.PI % 360 + 360) % 360).toFixed(0)}°, flux = ${(N * Bf * A * Math.cos(th)).toFixed(3)} Wb, EMF = <b>${(peak() * Math.sin(th)).toFixed(2)} V</b>. Doubling the speed doubles the peak EMF <i>and</i> the frequency.`; }
  cv.draw = (ctx, w, h, col) => {
    const P = cam.proj(w, h, Math.min(w, h * 0.9) * 0.19, w / 2, h * 0.3);
    drawCoil(ctx, P, col, th, { a: 1, b: 0.7 });
    const G = axes(ctx, w, h, col, { x: [0, 4 * Math.PI], y: [-1.1, 1.1], xlabel: 'angle turned θ', ylabel: 'relative', l: 40, t: h * 0.62, b: 34, xt: [0, Math.PI, 2 * Math.PI, 3 * Math.PI, 4 * Math.PI], fx: (v) => (v / Math.PI).toFixed(0) + 'π', yt: [-1, 0, 1], fy: (v) => v });
    const pts = (fn) => Array.from({ length: 161 }, (_, i) => { const x = i / 160 * 4 * Math.PI; return [G.X(x), G.Y(fn(x))]; });
    line(ctx, pts(Math.cos), col.s[0], 2.2); line(ctx, pts(Math.sin), col.s[5], 2.2);
    const ph = ((th % (4 * Math.PI)) + 4 * Math.PI) % (4 * Math.PI); line(ctx, [[G.X(ph), G.T], [G.X(ph), G.B]], col.muted, 1, [3, 3]); dot(ctx, G.X(ph), G.Y(Math.cos(ph)), 4.5, col.s[0], col.panel); dot(ctx, G.X(ph), G.Y(Math.sin(ph)), 4.5, col.s[5], col.panel);
    text(ctx, 'flux Φ ∝ cosθ', G.L + 8, G.T + 10, { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'EMF ∝ sinθ', G.L + 8, G.T + 26, { color: col.s[5], size: 11, weight: 700 });
  };
  show();
}
