// Torque on a current loop, and the DC motor. The loop's normal makes angle θ with B and the torque is τ = NIAB sinθ,
// biggest when the loop is edge-on to the field, zero when face-on. Plain slip rings: the loop swings to rest at θ = 0.
// Split-ring commutator: the current reverses every half turn, so the torque never changes sign and the loop keeps
// spinning (a motor). Drag to turn the view.
import { canvas, axes, line, text, row, slider, choice, readout, loop, dot } from '../kit.js';
import { orbit } from './_3d.js';
import { drawCoil } from './_em-coil.js';

export default function (host) {
  let mode = 'ring', N = 20, I = 2, Bf = 0.5, th = 2.3, om = 0;
  const cv = canvas(host, { aspect: 0.95, max: 420, min: 320, label: 'A current loop in a magnetic field turning under a torque' });
  const cam = orbit(cv, { yaw: 0.5, pitch: 0.55 });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Connection', [['ring', 'Slip rings (no switch)'], ['split', 'Split ring (motor)']], mode, (v) => { mode = v; th = 2.3; om = 0; });
  slider(c2, { label: 'Turns N', min: 1, max: 50, value: N, step: 1, fmt: (x) => x, oninput: (x) => { N = x; show(); } });
  slider(c2, { label: 'Current I', min: 0.5, max: 5, value: I, step: 0.1, fmt: (x) => x.toFixed(1) + ' A', oninput: (x) => { I = x; show(); } });
  slider(c2, { label: 'B', min: 0.1, max: 1, value: Bf, step: 0.05, fmt: (x) => x.toFixed(2) + ' T', oninput: (x) => { Bf = x; show(); } });
  const out = readout(host);
  const Aa = 0.02, t0 = () => N * I * Aa * Bf; // loop 10 cm × 20 cm = 0.02 m²
  const tau = (a) => (mode === 'ring' ? -t0() * Math.sin(a) : t0() * Math.abs(Math.sin(a)));
  const anim = loop(host, (dt) => { for (let i = 0; i < 6; i++) { const h = dt / 6; om += (tau(th) / 0.05 - (mode === 'ring' ? 1.6 : 0.8) * om) * h; th += om * h; } cv.redraw(); show(); });
  anim.button(ctl);
  function show() { const a = ((th % 6.2832) + 6.2832) % 6.2832; out.innerHTML = `τ<sub>max</sub> = NIAB = ${N} × ${I} A × 0.02 m² × ${Bf} T = <b>${t0().toFixed(2)} N m</b>. Now θ = ${(a * 180 / Math.PI).toFixed(0)}°, τ = <b>${tau(th).toFixed(2)} N m</b>. ${mode === 'ring' ? 'The torque pulls θ back to 0 (loop face-on), so it rocks and settles.' : 'The commutator flips the current at θ = 0° and 180°, so the torque keeps the same sense.'}`; }
  cv.draw = (ctx, w, h, col) => {
    const P = cam.proj(w, h, Math.min(w, h * 0.9) * 0.19, w / 2, h * 0.33);
    drawCoil(ctx, P, col, th, { a: 1, b: 0.7 });
    const g = axes(ctx, w, h, col, { x: [0, 360], y: [-1, 1], xlabel: 'θ (degrees)', ylabel: 'torque / τmax', l: 40, t: h * 0.7, b: 30, xt: [0, 90, 180, 270, 360], yt: [-1, 0, 1], fy: (v) => v });
    line(ctx, Array.from({ length: 121 }, (_, i) => { const a = i * 3 * Math.PI / 180; return [g.X(i * 3), g.Y(tau(a) / (t0() || 1))]; }), col.s[0], 2.4);
    const a = (((th % 6.2832) + 6.2832) % 6.2832) * 180 / Math.PI; dot(ctx, g.X(a), g.Y(tau(th) / (t0() || 1)), 5, col.s[5], col.panel);
    text(ctx, mode === 'ring' ? 'Slip rings: τ = −τmax sinθ' : 'Split ring: τ = τmax |sinθ|', 10, 16, { color: col.ink, size: 12, weight: 700 });
  };
  show();
}
