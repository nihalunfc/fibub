// Thermal properties: the heating curve of water. A heater of fixed power warms ice from −20 °C to steam at
// 120 °C. The temperature rises on the sloped parts (Q = mcΔT, slope set by the specific heat) and stays flat
// while ice melts and water boils (Q = mL): the heat goes into breaking bonds, not into speeding molecules up.
import { canvas, axes, line, dot, text, row, slider, readout, loop } from '../../kit.js';

const C_ICE = 2100, C_W = 4186, C_ST = 2010, LF = 3.34e5, LV = 2.256e6;
export default function (host) {
  let m = 0.5, P = 2000, q = 0; // kg, W, joules supplied
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 250, label: 'Temperature of water against heat supplied, from ice to steam' });
  const ctl = row(host);
  slider(ctl, { label: 'Mass', min: 0.1, max: 1, step: 0.05, value: m, fmt: (v) => `${v.toFixed(2)} kg`, oninput: (v) => { m = v; q = 0; cv.redraw(); show(); } });
  slider(ctl, { label: 'Heater', min: 500, max: 3000, step: 100, value: P, fmt: (v) => `${v} W`, oninput: (v) => { P = v; cv.redraw(); show(); } });
  const anim = loop(host, (dt) => { q += P * dt * 60; if (q > stages()[4].end * 1.03) q = 0; cv.redraw(); show(); }); // 1 s on screen = 1 min of heating
  anim.button(ctl);
  const out = readout(host);
  const stages = () => {
    const s = [['ice warms', m * C_ICE * 20, -20, 0], ['ice melts', m * LF, 0, 0], ['water warms', m * C_W * 100, 0, 100], ['water boils', m * LV, 100, 100], ['steam warms', m * C_ST * 20, 100, 120]];
    let acc = 0; return s.map(([name, Q, T0, T1]) => { const o = { name, Q, T0, T1, start: acc, end: acc + Q }; acc += Q; return o; });
  };
  const state = (qq) => { const S = stages(); for (const s of S) if (qq <= s.end) return { s, T: s.T0 + ((s.T1 - s.T0) * (qq - s.start)) / s.Q }; const l = S[4]; return { s: l, T: 120 }; };
  const show = () => {
    const { s, T } = state(q), mins = q / P / 60;
    const why = s.T0 === s.T1 ? `Flat: the heat goes into ${s.name === 'ice melts' ? 'melting (L_f = 334 kJ/kg)' : 'boiling (L_v = 2256 kJ/kg)'}; the temperature does not change.` : `Sloped: Q = mcΔT; the slope is 1/(mc), so ${s.name === 'water warms' ? 'water, with its large c, rises slowest' : 'ice and steam (smaller c) rise faster than water'}.`;
    out.innerHTML = `After ${mins.toFixed(1)} min (${(q / 1000).toFixed(0)} kJ): <b>${T.toFixed(1)} °C</b>, ${s.name}. ${why} Boiling all the water takes ${(stages()[3].Q / P / 60).toFixed(1)} min, about ${(LV / (C_W * 100)).toFixed(1)} times as long as warming it from 0 to 100 °C.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const S = stages(), Qmax = S[4].end / 1000;
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [0, Qmax * 1.03], y: [-30, 130], xlabel: 'heat supplied (kJ)', ylabel: 'temperature (°C)', t: 26 });
    ctx.save(); clip();
    const pts = [[X(0), Y(-20)], ...S.map((s) => [X(s.end / 1000), Y(s.T1)])];
    line(ctx, pts, col.line, 2);
    const { T } = state(q), done = [[X(0), Y(-20)], ...S.filter((s) => s.end <= q).map((s) => [X(s.end / 1000), Y(s.T1)]), [X(q / 1000), Y(T)]];
    line(ctx, done, col.s[0], 3);
    dot(ctx, X(q / 1000), Y(T), 5, col.s[3]);
    ctx.restore();
    S.forEach((s, i) => { if (s.T0 === s.T1) text(ctx, s.name, X((s.start + s.end) / 2000), Y(s.T0) - 12, { color: col.s[1], size: 11, weight: 600, align: 'center' }); else if (i === 2) text(ctx, 'water warms', X((s.start + s.end) / 2000) + 8, Y(50), { color: col.muted, size: 11 }); });
  };
  cv.redraw(); show();
}
