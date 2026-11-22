// 5.1 Van der Waals isotherms in reduced units p = 8t/(3v − 1) − 3/v² (p = P/P_c, v = V/V_c, t = T/T_c). Below the
// critical temperature the isotherm has a wiggle; the part where pressure rises with volume (shaded) is unstable and
// the real gas condenses instead. The dashed curve is the ideal gas at the same temperature.
import { canvas, axes, line, dot, row, slider, readout, fmt, title, text } from '../../kit.js';

const p = (v, t) => 8 * t / (3 * v - 1) - 3 / (v * v);

export default function (host) {
  const cv = canvas(host, { aspect: 0.65, max: 400, min: 260, label: 'Van der Waals isotherms near the critical point, with the ideal gas for comparison' });
  let t = 0.9;
  const ctl = row(host);
  slider(ctl, { label: 'T / T_c', min: 0.8, max: 1.4, step: 0.01, value: t, fmt: (v) => fmt(v, 3), oninput: (v) => { t = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    out.innerHTML = t < 0.995 ? `<b>Below T<sub>c</sub></b>: the isotherm has a maximum and a minimum. Between them dP/dV &gt; 0: the gas would expand when squeezed, which is unstable. A real gas splits into liquid and vapour at one constant pressure there (Maxwell's equal-area rule).`
      : t < 1.005 ? `<b>At T<sub>c</sub></b>: the maximum and minimum merge into a flat inflection at (1, 1), where ∂P/∂V = ∂²P/∂V² = 0. Solving those gives V<sub>c</sub> = 3b, P<sub>c</sub> = a/27b², T<sub>c</sub> = 8a/27Rb.`
      : `<b>Above T<sub>c</sub></b>: the pressure always falls as the volume grows. No liquid forms however hard you squeeze. As T rises the curve approaches the ideal gas (dashed) at large volume.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [0.4, 4], y: [0, 2.2], xlabel: 'reduced volume V/V_c', ylabel: 'reduced pressure P/P_c', t: 34 });
    title(ctx, `Van der Waals isotherm at T = ${fmt(t, 3)} T_c`, col);
    ctx.save(); ax.clip();
    const curve = (fn) => { const pts = []; for (let i = 0; i <= 400; i++) { const v = 0.4 + 3.6 * i / 400; pts.push([ax.X(v), ax.Y(fn(v))]); } return pts; };
    for (const tt of [0.85, 1, 1.2]) line(ctx, curve((v) => p(v, tt)), col.line, 1.4);
    line(ctx, curve((v) => 8 * t / (3 * v)), col.muted, 1.4, [5, 4]);
    if (t < 1) {
      let a = null, b = null;
      for (let i = 0; i < 2000; i++) { const v = 0.45 + 2.5 * i / 2000; if (p(v + 1e-4, t) > p(v, t)) { if (a === null) a = v; b = v; } }
      if (a !== null) {
        ctx.globalAlpha = 0.14; ctx.fillStyle = col.bad || col.s[3]; ctx.fillRect(ax.X(a), ax.T, ax.X(b) - ax.X(a), ax.B - ax.T); ctx.globalAlpha = 1;
        text(ctx, 'unstable: dP/dV > 0', ax.X((a + b) / 2), ax.T + 14, { color: col.ink, size: 11, weight: 600, align: 'center', halo: col.panel });
      }
    }
    line(ctx, curve((v) => p(v, t)), col.s[0], 3);
    dot(ctx, ax.X(1), ax.Y(1), 5, col.s[2], col.panel);
    text(ctx, 'critical point', ax.X(1) + 8, ax.Y(1) - 10, { color: col.s[2], size: 11, weight: 600, halo: col.panel });
    ctx.restore();
  };
  cv.redraw(); show();
}
