// 7.5 BJT output characteristics with the DC load line. A family of I_C against V_CE curves (beta = 100, Early
// voltage 80 V, soft saturation below about 0.3 V), the load line V_CE = V_CC - I_C R_C, and the Q-point where the
// curve for the chosen base current meets it. Sliders set V_CC, R_C and I_B; the readout names the region.
import { canvas, axes, line, dot, text, row, slider, readout, fmt } from '../../kit.js';

const BETA = 100, VA = 80;
// collector current in mA for base current ib (microamps) at collector-emitter voltage v (volts)
const ic = (ib, v) => (v <= 0 ? 0 : BETA * ib * 1e-3 * (1 + v / VA) * (1 - Math.exp(-v / 0.08)));

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'Transistor output characteristics with a DC load line and Q-point' });
  let Vcc = 12, Rc = 2, Ib = 30;
  const ctl = row(host);
  const out = readout(host);
  const q = () => {
    // solve v + ic(v) Rc = Vcc by bisection (the left side rises with v)
    let lo = 0, hi = Vcc;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (m + ic(Ib, m) * Rc > Vcc) ? (hi = m) : (lo = m); }
    return { v: lo, i: ic(Ib, lo) };
  };
  const show = () => {
    const Q = q();
    const region = Ib === 0 ? 'cut-off (no base current, no collector current)' : Q.v < 0.3 ? 'SATURATION: the load line limits I_C, so I_C < βI_B and the transistor is a closed switch' : 'active: I_C ≈ βI_B, so the stage can amplify';
    out.innerHTML = `Q-point: V<sub>CE</sub> = <b>${fmt(Q.v, 3)} V</b>, I<sub>C</sub> = <b>${fmt(Q.i, 3)} mA</b>. Load line from ${fmt(Vcc, 3)} V (I<sub>C</sub> = 0) to ${fmt(Vcc / Rc, 3)} mA (V<sub>CE</sub> = 0). Region: ${region}.`;
  };
  slider(ctl, { label: 'Supply V_CC (V)', min: 4, max: 20, step: 0.5, value: Vcc, fmt: (v) => fmt(v, 3), oninput: (v) => { Vcc = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Collector resistor R_C (kΩ)', min: 0.5, max: 10, step: 0.1, value: Rc, fmt: (v) => fmt(v, 3), oninput: (v) => { Rc = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Base current I_B (μA)', min: 0, max: 60, step: 1, value: Ib, fmt: (v) => fmt(v, 3), oninput: (v) => { Ib = v; cv.redraw(); show(); } });

  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [0, 20], y: [0, 8], r: 52, xlabel: 'V_CE (V)', ylabel: 'I_C (mA)' });
    ctx.save(); ax.clip();
    const vs = Array.from({ length: 201 }, (_, i) => (20 * i) / 200);
    for (let b = 10; b <= 60; b += 10) line(ctx, vs.map((v) => [ax.X(v), ax.Y(ic(b, v))]), col.muted, 1.2);
    if (Ib > 0) line(ctx, vs.map((v) => [ax.X(v), ax.Y(ic(Ib, v))]), col.s[0], 2.5);
    line(ctx, [[ax.X(0), ax.Y(Vcc / Rc)], [ax.X(Vcc), ax.Y(0)]], col.s[1], 2.5);
    ctx.restore();
    for (let b = 10; b <= 60; b += 10) text(ctx, `${b} μA`, ax.R + 4, ax.Y(ic(b, 20)), { color: col.muted, size: 10 });
    const Q = q();
    line(ctx, [[ax.X(Q.v), ax.Y(Q.i)], [ax.X(Q.v), ax.B]], col.s[3], 1, [3, 3]);
    line(ctx, [[ax.L, ax.Y(Q.i)], [ax.X(Q.v), ax.Y(Q.i)]], col.s[3], 1, [3, 3]);
    dot(ctx, ax.X(Q.v), ax.Y(Q.i), 6, col.s[3], col.panel);
    text(ctx, 'Q', ax.X(Q.v) + 9, ax.Y(Q.i) - 10, { color: col.s[3], size: 13, weight: 700 });
    const il = Math.min(Vcc / Rc, 8) * 0.55, vl = Vcc - il * Rc;
    text(ctx, 'load line', ax.X(vl) + 8, ax.Y(il) - 6, { color: col.s[1], size: 11, weight: 600 });
    text(ctx, 'saturation', ax.X(0.15), ax.T + 10, { color: col.muted, size: 10 });
    text(ctx, 'cut-off (I_B = 0) along this axis', ax.X(7), ax.B - 9, { color: col.muted, size: 10 });
  };
  cv.redraw(); show();
}
