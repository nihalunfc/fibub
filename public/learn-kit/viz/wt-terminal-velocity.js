// A steel ball falls through a thick liquid. Weight (minus buoyancy) pulls down, Stokes drag 6 pi eta r v pushes up, and
// the speed levels off at the terminal velocity v = 2 r² (rho - sigma) g / 9 eta. Change the radius and the liquid: it
// is r² that matters. The graph shows speed against time; the readout warns when Stokes' law stops being valid (Re > 1).
import { canvas, axes, line, dot, text, title, arrow, row, slider, choice, button, readout, loop } from '../kit.js';

const LQ = { glyc: ['Glycerine', 1260, 1.4], castor: ['Castor oil', 960, 0.99], olive: ['Olive oil', 910, 0.08], water: ['Water', 1000, 0.001] };
const RHO = 7800, G = 9.8, H = 0.3;
export default function (host) {
  let lq = 'glyc', r = 2, t = 0, y = 0, v = 0, tr = [];
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'A ball falling through a viscous liquid with its speed-time graph' });
  const ctl = row(host);
  choice(ctl, 'Liquid', Object.entries(LQ).map(([k, x]) => [k, x[0]]), lq, (x) => { lq = x; reset(); });
  slider(ctl, { label: 'Ball radius', min: 0.3, max: 5, step: 0.1, value: r, fmt: (x) => `${x} mm`, oninput: (x) => { r = x; reset(); } });
  const c2 = row(host);
  button(c2, 'Drop again', () => reset());
  const P = () => { const [, sg, eta] = LQ[lq], rr = r / 1000, vt = (2 * rr * rr * (RHO - sg) * G) / (9 * eta), tau = (2 * rr * rr * RHO) / (9 * eta), tf = H / vt + tau; return { sg, eta, rr, vt, tau, tf, Re: (sg * vt * 2 * rr) / eta }; };
  let T = 1, sim = 0;
  const lp = loop(host, (dt) => {
    const p = P(); sim += (dt * p.tf) / 5; // whole fall in about 5 s on screen
    while (t < sim && y < H) { const h = Math.min(p.tau / 20, 0.002); v += (G * (1 - p.sg / RHO) - (v * (p.eta * 9)) / (2 * p.rr * p.rr * RHO)) * h; y += v * h; t += h; if (tr.length < 400 && (!tr.length || t - tr[tr.length - 1][0] > p.tf / 300)) tr.push([t, v]); }
    if (y >= H && sim > p.tf * 1.4) reset(); else { cv.redraw(); show(); }
  });
  lp.button(c2);
  const out = readout(host);
  function reset() { t = 0; y = 0; v = 0; sim = 0; tr = []; cv.redraw(); show(); }
  function show() {
    const p = P();
    out.innerHTML = `Terminal speed v<sub>t</sub> = 2r²(ρ−σ)g/9η = <b>${p.vt < 1 ? (p.vt * 100).toFixed(2) + ' cm/s' : p.vt.toFixed(1) + ' m/s'}</b>; it gets there in a few time constants τ = ${p.tau < 0.1 ? (p.tau * 1000).toFixed(1) + ' ms' : p.tau.toFixed(2) + ' s'}. Now v = ${(v * 100).toFixed(2)} cm/s. Reynolds number ${p.Re < 100 ? p.Re.toFixed(2) : p.Re.toFixed(0)}: ${p.Re < 1 ? 'Stokes\' law is fine.' : '<b>above 1, so Stokes\' law is not valid here (drag grows faster than v).</b>'} Double the radius: ×4 faster.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const p = P(); title(ctx, `${LQ[lq][0]}: η = ${p.eta} Pa s`, col);
    const tx = 12, tw = Math.min(70, w * 0.2), ty = 40, th = h - 56;
    ctx.fillStyle = col.soft; ctx.fillRect(tx, ty, tw, th); ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.strokeRect(tx, ty, tw, th);
    const by = ty + 10 + (y / H) * (th - 20), br = Math.max(3, Math.min(tw / 2 - 4, 3 + r * 2.2));
    dot(ctx, tx + tw / 2, by, br, col.s[0], col.ink);
    const sc = 26 * Math.min(1, (v / p.vt) || 0) + 4;
    arrow(ctx, tx + tw + 10, by, tx + tw + 10, by + 4 + 24, col.bad, 2.5); text(ctx, 'weight − buoyancy', tx + tw + 16, by + 14, { color: col.bad, size: 10 });
    arrow(ctx, tx + tw + 10, by, tx + tw + 10, by - sc, col.good, 2.5); text(ctx, 'drag', tx + tw + 16, by - sc / 2 - 2, { color: col.good, size: 10 });
    ctx.save(); ctx.translate(tx + tw + 70, 36); const gw = w - tx - tw - 80, gh = h - 52;
    if (gw > 90) {
      const A = axes(ctx, gw, gh, col, { x: [0, p.tf * 1.1], y: [0, p.vt * 1.15], l: 38, r: 4, t: 6, b: 30, xlabel: 't (s)', ylabel: 'v (m/s)', fx: (x) => (+x.toPrecision(2)).toString(), fy: (x) => (+x.toPrecision(2)).toString() });
      line(ctx, [[A.X(0), A.Y(p.vt)], [A.X(p.tf * 1.1), A.Y(p.vt)]], col.muted, 1, [4, 4]);
      line(ctx, tr.map(([a, b]) => [A.X(a), A.Y(b)]), col.s[1], 2.5);
      text(ctx, 'v_t', A.X(p.tf * 1.1) - 4, A.Y(p.vt) - 8, { color: col.muted, size: 10, align: 'right' });
    }
    ctx.restore();
  };
  reset();
}
