// Skin depth: a changing field cannot get far into a conductor. The wave decays as e^{−z/δ} (and its phase turns by one
// radian each δ), with δ = 1/√(πfμσ). Choose a metal and slide the frequency from mains to microwaves. At 50 Hz the field
// reaches centimetres into copper; at 10 GHz it reaches only about a micrometre, so a thin silver coating carries high-frequency
// current just as well as solid metal, and a metal box screens radio waves.
import { canvas, axes, line, text, row, slider, choice, readout, loop } from '../kit.js';

const MET = { cu: ['Copper', 5.8e7, 1], al: ['Aluminium', 3.5e7, 1], fe: ['Iron (μr ≈ 200)', 1.0e7, 200], sea: ['Sea water', 4, 1] };
export default function (host) {
  let key = 'cu', lf = 3, t = 0, wr = 1;
  const cv = canvas(host, { aspect: 0.7, max: 340, min: 250, label: 'A wave decaying exponentially as it enters a conductor' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Material', Object.entries(MET).map(([k, v]) => [k, v[0]]), key, (v) => { key = v; upd(); });
  slider(c2, { label: 'Frequency', min: 0, max: 10, value: lf, step: 0.05, fmt: (x) => { const f = Math.pow(10, x); return f >= 1e9 ? (f / 1e9).toFixed(1) + ' GHz' : f >= 1e6 ? (f / 1e6).toFixed(1) + ' MHz' : f >= 1e3 ? (f / 1e3).toFixed(1) + ' kHz' : f.toFixed(0) + ' Hz'; }, oninput: (x) => { lf = x; upd(); } });
  const anim = loop(host, (dt) => { t += dt * 2; cv.redraw(); }); anim.button(c2);
  const out = readout(host);
  const delta = () => { const [, s, mu] = MET[key]; return 1 / Math.sqrt(Math.PI * Math.pow(10, lf) * 4e-7 * Math.PI * mu * s); };
  const fm = (m) => (m >= 1 ? m.toFixed(1) + ' m' : m >= 1e-3 ? (m * 1e3).toFixed(2) + ' mm' : (m * 1e6).toFixed(2) + ' µm');
  function upd() { const dl = delta(); out.innerHTML = `δ = 1/√(πfμσ) = <b>${fm(dl)}</b> for ${MET[key][0]}. The amplitude is ${Math.exp(-1) * 100 | 0}% at z = δ, ${(Math.exp(-3) * 100).toFixed(1)}% at 3δ, so about 95% of the current flows within 3δ = ${fm(3 * dl)} of the surface. For a 1 mm radius wire: ${dl > 1e-3 ? 'δ is bigger than the wire, current fills it' : 'current hugs the outer ' + ((1 - Math.pow(1 - dl / 1e-3, 2)) * 100).toFixed(0) + '% of the cross-section, so the effective resistance rises'}. Fields inside the metal also lag by z/δ radians.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const G = axes(ctx, w, h, col, { x: [0, 4], y: [-1.1, 1.1], xlabel: 'depth z into the metal (units of δ)', ylabel: 'E / E₀', l: 40, t: 24, b: 40, xt: [0, 1, 2, 3, 4], yt: [-1, 0, 1], fy: (v) => v });
    ctx.fillStyle = col.s[7]; ctx.globalAlpha = 0.12; ctx.fillRect(G.L, G.T, G.X(4) - G.L, G.B - G.T); ctx.globalAlpha = 1;
    const env = (z) => Math.exp(-z); line(ctx, Array.from({ length: 101 }, (_, i) => [G.X(i * 0.04), G.Y(env(i * 0.04))]), col.muted, 1.4, [4, 3]); line(ctx, Array.from({ length: 101 }, (_, i) => [G.X(i * 0.04), G.Y(-env(i * 0.04))]), col.muted, 1.4, [4, 3]);
    line(ctx, Array.from({ length: 201 }, (_, i) => { const z = i * 0.02; return [G.X(z), G.Y(env(z) * Math.cos(z - t))]; }), col.s[0], 2.6);
    line(ctx, [[G.X(1), G.T], [G.X(1), G.B]], col.s[5], 1.2, [3, 3]); text(ctx, 'z = δ: 37%', G.X(1) + 5, G.T + 10, { color: col.s[5], size: 10.5, weight: 700 });
    text(ctx, 'metal →', G.L + 6, G.B - 8, { color: col.muted, size: 10.5 }); text(ctx, 'envelope e^(−z/δ)', G.R - 4, G.T + 10, { color: col.muted, size: 10.5, align: 'right' });
  };
  upd();
}
