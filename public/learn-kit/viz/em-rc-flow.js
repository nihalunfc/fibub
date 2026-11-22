// An RC circuit you can watch. Dots are charge carriers moving round the loop (faster = more current); the plates
// show the stored charge. Choose Charge or Discharge, then change R and C. Time on the graph is in units of τ = RC:
// after 1τ the capacitor has reached 63% (charging) or fallen to 37% (discharging).
import { canvas, axes, line, text, row, slider, choice, button, readout, loop, dot } from '../kit.js';

export default function (host) {
  let mode = 'charge', R = 10, C = 100, V = 10, t = 0; // kΩ, µF, volts; t in units of τ
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 300, label: 'An RC circuit with moving charge carriers and its charging curves' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Switch', [['charge', 'Charging'], ['discharge', 'Discharging']], mode, (v) => { mode = v; t = 0; });
  slider(c2, { label: 'R', min: 1, max: 50, value: R, fmt: (v) => v.toFixed(0) + ' kΩ', oninput: (v) => { R = v; } });
  slider(c2, { label: 'C', min: 10, max: 500, value: C, fmt: (v) => v.toFixed(0) + ' µF', oninput: (v) => { C = v; } });
  const out = readout(host);
  let phase = 0;
  const anim = loop(host, (dt) => { t += dt * 0.5; if (t > 6) t = 0; phase += dt * Math.exp(-t) * 1.6 * (R < 12 ? 1.6 : 1); cv.redraw(); show(); });
  anim.button(ctl); button(ctl, 'Restart', () => { t = 0; });
  const vc = (x) => (mode === 'charge' ? V * (1 - Math.exp(-x)) : V * Math.exp(-x)), ic = (x) => (V / R) * Math.exp(-x);
  function show() { const tau = R * C / 1000; out.innerHTML = `τ = RC = ${R} kΩ × ${C} µF = <b>${tau.toFixed(2)} s</b>. At t = ${(t * tau).toFixed(2)} s (${t.toFixed(1)} τ): V<sub>C</sub> = <b>${vc(t).toFixed(2)} V</b>, I = <b>${ic(t).toFixed(3)} mA</b>, Q = ${(C * vc(t)).toFixed(0)} µC. The current is biggest at the start and the voltage on C can never jump.`; }
  cv.draw = (ctx, w, h, col) => {
    const L = 30, Rr = w * 0.46, T = 40, B = 140, path = [[L, T], [Rr, T], [Rr, 75], [Rr, 105], [Rr, B], [L, B]];
    line(ctx, [[L, T], [Rr, T], [Rr, 78]], col.ink, 1.8); line(ctx, [[Rr, 102], [Rr, B], [L, B], [L, T]], col.ink, 1.8);
    // dots along the loop
    const len = [], pts = [[L, T], [Rr, T], [Rr, B], [L, B], [L, T]]; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); len.push(d); tot += d; }
    const live = mode === 'charge' ? 1 : -1;
    for (let k = 0; k < 24; k++) { let d = (((k / 24 + live * phase * 0.12) % 1) + 1) % 1 * tot; let i = 0; while (d > len[i]) { d -= len[i]; i++; } const [a, b] = [pts[i], pts[i + 1]], f = d / len[i]; if (!(a[0] === Rr && a[1] === T && f > 0.9 && false)) dot(ctx, a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, 2.5, col.s[0]); }
    ctx.fillStyle = col.panel; ctx.fillRect(Rr - 24, 78, 48, 24); ctx.fillStyle = col.ink; ctx.fillRect(Rr - 20, 82, 40, 3); ctx.fillRect(Rr - 20, 95, 40, 3);
    const q = Math.round(6 * vc(t) / V); for (let i = 0; i < q; i++) { text(ctx, '+', Rr - 16 + i * 6.5, 76, { color: col.s[5], size: 11, weight: 700, align: 'center' }); text(ctx, '−', Rr - 16 + i * 6.5, 104, { color: col.s[0], size: 11, weight: 700, align: 'center' }); }
    text(ctx, 'C', Rr + 28, 90, { color: col.ink, size: 12, weight: 700 });
    ctx.fillStyle = col.panel; ctx.fillRect(L - 8, 70, 16, 40); ctx.strokeRect(L - 8, 70, 16, 40); text(ctx, 'R', L + 14, 90, { color: col.ink, size: 12, weight: 700 });
    text(ctx, mode === 'charge' ? `Battery ${V} V charging C` : 'C discharging through R', 10, 16, { color: col.ink, size: 12, weight: 700 });
    // graph
    const g = axes(ctx, w, h, col, { x: [0, 6], y: [0, V * 1.05], xlabel: 'time (units of τ)', ylabel: 'V_C (V)', l: 40, t: 160, b: 36, xt: [0, 1, 2, 3, 4, 5, 6], yt: [0, V / 2, V], fy: (v) => v.toFixed(0) });
    line(ctx, Array.from({ length: 61 }, (_, i) => [g.X(i / 10), g.Y(vc(i / 10))]), col.s[0], 2.4);
    line(ctx, Array.from({ length: 61 }, (_, i) => [g.X(i / 10), g.Y(ic(i / 10) * R)]), col.s[5], 1.8, [4, 3]);
    text(ctx, 'V_C', g.X(4.6), g.Y(mode === 'charge' ? V * 0.93 : V * 0.1) - 8, { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'I (scaled)', g.X(1.4), g.Y(V * 0.3), { color: col.s[5], size: 11, weight: 700 });
    line(ctx, [[g.X(t), g.T], [g.X(t), g.B]], col.muted, 1, [3, 3]); dot(ctx, g.X(t), g.Y(vc(t)), 5, col.s[0], col.panel);
  };
  show();
}
