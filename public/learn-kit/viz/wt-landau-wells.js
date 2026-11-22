// Landau theory of a phase transition: the free energy F(m) = a (T − Tc) m² + b m⁴ − h m as a landscape, with the order
// parameter m as a ball rolling in it. Above Tc there is one valley at m = 0; below Tc the valley splits in two, so the system
// must pick m = +m₀ or −m₀ (spontaneous symmetry breaking). A magnetic field h tilts the landscape. Shake adds thermal noise.
import { canvas, axes, line, dot, text, title, row, slider, button, readout, loop, rng } from '../kit.js';

export default function (host) {
  let T = 0.7, h = 0, m = 0.02, noise = 0.35, R = rng(3);
  const g = () => { let s = 0; for (let i = 0; i < 4; i++) s += R(); return (s - 2) * 1.73; };
  const F = (x) => (T - 1) * x * x + 0.5 * x ** 4 - h * x; // units: a=1, b=0.5, Tc=1
  const dF = (x) => 2 * (T - 1) * x + 2 * x ** 3 - h;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 300, label: 'A free-energy landscape F of m with a ball, and the equilibrium m against T' });
  const ctl = row(host);
  const sT = slider(ctl, { label: 'Temperature T/Tc', min: 0.3, max: 1.7, step: 0.01, value: T, fmt: (v) => v.toFixed(2), oninput: (v) => { T = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Field h', min: -0.4, max: 0.4, step: 0.02, value: h, fmt: (v) => v.toFixed(2), oninput: (v) => { h = v; cv.redraw(); show(); } });
  const c2 = row(host);
  const lp = loop(host, (dt) => { for (let i = 0; i < 6; i++) { m += -dF(m) * dt / 6 * 1.5 + Math.sqrt(2 * noise * 0.04 * dt / 6) * g() * 1.5; m = Math.max(-1.6, Math.min(1.6, m)); } cv.redraw(); show(); });
  lp.button(c2); button(c2, 'Kick the ball', () => { m = -m + (R() - 0.5) * 0.2; });
  const out = readout(host);
  const m0 = () => (T < 1 ? Math.sqrt(1 - T) : 0);
  function show() {
    out.innerHTML = `${T < 1 ? `Below T<sub>c</sub>: two valleys at m = ±√(1 − T/T<sub>c</sub>) = ±<b>${m0().toFixed(2)}</b>; the ball chooses one (broken symmetry). With a field the deeper valley wins.` : 'Above T<sub>c</sub>: a single valley at m ≈ h/(2(T−T<sub>c</sub>)): no spontaneous order.'} Ball at m = ${m.toFixed(2)}. The curvature at the bottom is the inverse susceptibility, which shrinks to zero as T → T<sub>c</sub> from above (critical slowing down: the ball rolls slowly).`;
  }
  cv.draw = (ctx, w, hh, col) => {
    title(ctx, 'F(m) at the chosen T', col);
    const top = hh * 0.58; ctx.save(); ctx.translate(0, 8);
    const A = axes(ctx, w, top, col, { x: [-1.5, 1.5], y: [-0.7, 1.3], xlabel: 'order parameter m', ylabel: 'F', t: 22, b: 34, l: 34, xt: [-1, 0, 1], yt: [0], fy: () => '0' });
    const pts = []; for (let x = -1.5; x <= 1.5; x += 0.03) pts.push([A.X(x), A.Y(F(x))]); ctx.save(); A.clip(); line(ctx, pts, col.s[0], 2.6); ctx.restore();
    dot(ctx, A.X(m), A.Y(Math.max(-0.7, Math.min(1.3, F(m)))) - 7, 7, col.s[3], col.panel);
    ctx.restore();
    ctx.save(); ctx.translate(0, top + 12);
    const B = axes(ctx, w, hh - top - 12, col, { x: [0.3, 1.7], y: [-1.1, 1.1], xlabel: 'T / Tc', ylabel: 'm', t: 6, b: 32, l: 34, yt: [-1, 0, 1], fx: (v) => v.toFixed(1) });
    const up = [], dn = []; for (let t = 0.3; t <= 1.0001; t += 0.01) { const s = Math.sqrt(1 - t); up.push([B.X(t), B.Y(s)]); dn.push([B.X(t), B.Y(-s)]); }
    line(ctx, up, col.s[1], 2); line(ctx, dn, col.s[1], 2); line(ctx, [[B.X(1), B.Y(0)], [B.X(1.7), B.Y(0)]], col.s[1], 2);
    dot(ctx, B.X(T), B.Y(Math.max(-1.05, Math.min(1.05, m))), 5.5, col.s[3], col.panel);
    ctx.restore();
  };
  show();
  return { step(i) { T = [1.5, 1.05, 0.8, 0.45][Math.min(3, i)]; h = 0; sT.set(T); m = 0.05; cv.redraw(); show(); } };
}
