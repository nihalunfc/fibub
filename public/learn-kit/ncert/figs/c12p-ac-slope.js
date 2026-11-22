// Class 12 Alternating Current: why an inductor makes the current lag and a capacitor makes it lead. Drag the time slider.
// Inductor: v = L di/dt, so the voltage is the SLOPE of the current curve (the tangent is drawn).
// Capacitor: i = dq/dt = C dv/dt, so the current is the SLOPE of the voltage curve.
// Where the slope is steepest the other quantity is largest, a quarter cycle apart.
import { canvas, axes, line, dot, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let el = 'L', x = 0.15;
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 270, label: 'Voltage and current curves with a tangent line showing that one is the slope of the other' });
  const ctl = row(host);
  choice(ctl, 'Element', [['L', 'Inductor'], ['C', 'Capacitor']], el, (v) => { el = v; upd(); });
  slider(ctl, { label: 'Time in one cycle', min: 0, max: 1, step: 0.01, value: x, fmt: (v) => `${(v * 360).toFixed(0)}°`, oninput: (v) => { x = v; upd(); } });
  const out = readout(host);
  // L: i = -cos(wt) (lags), v = sin(wt) = L di/dt. C: v = sin(wt), i = cos(wt) (leads) = C dv/dt.
  const ang = () => 2 * Math.PI * x;
  const iF = (u) => (el === 'L' ? -Math.cos(u) : Math.cos(u)), vF = (u) => Math.sin(u);
  function upd() {
    const u = ang();
    out.innerHTML = el === 'L' ? `Slope of the <b>current</b> curve now: ${Math.sin(u).toFixed(2)}, and the voltage is v = ${vF(u).toFixed(2)} V₀. Steepest current curve = largest voltage, so the current peak comes <b>later</b>: i lags v by 90°.`
      : `Slope of the <b>voltage</b> curve now: ${Math.cos(u).toFixed(2)}, and the current is i = ${iF(u).toFixed(2)} I₀. Steepest voltage curve = largest current, so the current peak comes <b>earlier</b>: i leads v by 90°.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, el === 'L' ? 'Inductor: v = L di/dt (v is the slope of i)' : 'Capacitor: i = C dv/dt (i is the slope of v)', col);
    const ax = axes(ctx, w, h, col, { x: [0, 1], y: [-1.3, 1.3], t: top + 6, xlabel: 'time (fraction of a cycle)', yt: [-1, 0, 1], xt: [0, 0.25, 0.5, 0.75, 1] });
    const mk = (f) => { const p = []; for (let k = 0; k <= 160; k++) { const u = k / 160; p.push([ax.X(u), ax.Y(f(2 * Math.PI * u))]); } return p; };
    ctx.save(); ax.clip();
    line(ctx, mk(vF), col.s[0], 2.5); line(ctx, mk(iF), col.s[1], 2.5);
    // tangent on the "integral" curve
    const u = ang(), tanOf = el === 'L' ? iF : vF, slope = el === 'L' ? Math.sin(u) : Math.cos(u), colT = el === 'L' ? col.s[1] : col.s[0];
    const dx = 0.12, y0 = tanOf(u), pxs = ax.X(x), pys = ax.Y(y0);
    const kpx = (ax.X(1) - ax.X(0)), kpy = (ax.Y(1) - ax.Y(0));
    // slope in data units per radian -> per x unit: slope*2π
    const sl = (slope * 2 * Math.PI * kpy) / kpx;
    line(ctx, [[pxs - dx * kpx, pys - sl * dx * kpx], [pxs + dx * kpx, pys + sl * dx * kpx]], col.s[3], 3);
    ctx.restore();
    dot(ctx, pxs, pys, 6, colT, col.panel);
    const other = el === 'L' ? vF(u) : iF(u), c2 = el === 'L' ? col.s[0] : col.s[1];
    dot(ctx, pxs, ax.Y(other), 6, c2, col.panel);
    line(ctx, [[pxs, ax.T], [pxs, ax.B]], col.line, 1, [3, 3]);
    text(ctx, 'v', ax.X(0.27), ax.Y(1.15), { color: col.s[0], size: 12, weight: 700, halo: col.panel });
    text(ctx, 'i', ax.X(0.74), ax.Y(el === 'L' ? 1.15 : 1.15), { color: col.s[1], size: 12, weight: 700, halo: col.panel });
    text(ctx, 'tangent = slope', ax.R - 4, ax.B - 8, { color: col.s[3], size: 11, weight: 700, align: 'right' });
  };
  upd();
}
