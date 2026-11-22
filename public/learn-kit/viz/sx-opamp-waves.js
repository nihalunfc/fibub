// Op-amp circuits with live waveforms. Pick inverting, non-inverting, integrator or differentiator and an input shape (sine,
// square or triangle). The grey trace is V_in, the blue one V_out (clipped at the ±12 V supply rails, dashed). Inverting:
// V_out = −(R_f/R_in)V_in. Non-inverting: V_out = (1 + R_f/R_in)V_in. Integrator: V_out = −(1/RC)∫V_in dt (a square wave
// becomes a triangle). Differentiator: V_out = −RC dV_in/dt (a triangle becomes a square wave).
import { canvas, axes, line, text, row, slider, choice, readout, loop, title } from '../kit.js';

const RAIL = 12, N = 480;
const shape = (k, u) => { const x = u - Math.floor(u); if (k === 'sine') return Math.sin(2 * Math.PI * x); if (k === 'sq') return Math.max(-1, Math.min(1, Math.sin(2 * Math.PI * x) / 0.08)); return x < 0.25 ? 4 * x : x < 0.75 ? 2 - 4 * x : 4 * x - 4; };
export default function (host) {
  let kind = 'inv', wave = 'sine', ph = 0;
  const cv = canvas(host, { aspect: 0.7, max: 340, min: 260, label: 'Input and output waveforms of an op-amp circuit' });
  const ctl = row(host);
  choice(ctl, 'Circuit', [['inv', 'Inverting'], ['non', 'Non-inverting'], ['int', 'Integrator'], ['dif', 'Differentiator']], kind, (v) => { kind = v; show(); });
  choice(ctl, 'Input', [['sine', 'Sine'], ['sq', 'Square'], ['tri', 'Triangle']], wave, (v) => { wave = v; show(); });
  const sa = slider(ctl, { label: 'Input amplitude', min: 0.1, max: 3, step: 0.05, value: 1, fmt: (v) => v.toFixed(2) + ' V', oninput: () => show() });
  const sg = slider(ctl, { label: 'R_f/R_in', min: 1, max: 20, step: 0.5, value: 4, fmt: (v) => v.toFixed(1), oninput: () => show() });
  const st = slider(ctl, { label: 'RC (ms)', min: 0.1, max: 5, step: 0.1, value: 1, fmt: (v) => v.toFixed(1), oninput: () => show() });
  const sf = slider(ctl, { label: 'Frequency', min: 50, max: 1000, step: 10, value: 200, fmt: (v) => v + ' Hz', oninput: () => show() });
  loop(host, (dt) => { ph = (ph + dt * 0.3) % 1; cv.redraw(); }).button(row(host));
  const out = readout(host);
  // one period of V_out on a fine grid (steady state)
  const period = () => {
    const A = sa.value, T = 1 / sf.value, dt = T / N, vin = Array.from({ length: N }, (_, i) => A * shape(wave, i / N));
    let vo;
    if (kind === 'inv') vo = vin.map((v) => -sg.value * v);
    else if (kind === 'non') vo = vin.map((v) => (1 + sg.value) * v);
    else if (kind === 'int') { let s = 0; const F = vin.map((v) => (s += v * dt)); const m = F.reduce((a, b) => a + b, 0) / N; vo = F.map((f) => (-(f - m)) / (st.value / 1000)); }
    else vo = vin.map((v, i) => -(st.value / 1000) * ((vin[(i + 1) % N] - vin[(i + N - 1) % N]) / (2 * dt)));
    return { vin, vo: vo.map((v) => Math.max(-RAIL, Math.min(RAIL, v))), raw: vo };
  };
  const FORM = { inv: 'V_out = −(R_f/R_in) V_in', non: 'V_out = (1 + R_f/R_in) V_in', int: 'V_out = −(1/RC) ∫V_in dt', dif: 'V_out = −RC dV_in/dt' };
  function show() { queueMicrotask(() => cv.redraw());
    const P = period(), pk = Math.max(...P.raw.map(Math.abs)), clip = pk > RAIL + 0.01;
    out.innerHTML = `<b>${FORM[kind]}.</b> ${kind === 'inv' ? `Gain −${sg.value.toFixed(1)}: output is upside down and ${sg.value.toFixed(1)} times bigger.` : kind === 'non' ? `Gain ${(1 + sg.value).toFixed(1)}: same phase, never less than 1.` : kind === 'int' ? `RC = ${st.value.toFixed(1)} ms. For a sine of ${sf.value} Hz the gain is 1/(ωRC) = ${(1 / (2 * Math.PI * sf.value * st.value / 1000)).toFixed(2)} and the phase shifts by 90°; a square wave becomes a triangle.` : `RC = ${st.value.toFixed(1)} ms. For a sine of ${sf.value} Hz the gain is ωRC = ${(2 * Math.PI * sf.value * st.value / 1000).toFixed(2)}, with a 90° shift; a triangle becomes a square wave, and square edges give spikes.`} Peak output wanted: ${pk.toFixed(1)} V${clip ? ` : clipped at ±${RAIL} V` : ''}.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const P = period(), A = axes(ctx, w, h, col, { x: [0, 3], y: [-14, 14], xlabel: 'time (3 periods)', ylabel: 'volts', l: 40, t: 34, xt: [0, 1, 2, 3], yt: [-12, -6, 0, 6, 12], fx: (v) => v, grid: true });
    A.clip();
    line(ctx, [[A.X(0), A.Y(RAIL)], [A.X(3), A.Y(RAIL)]], col.bad, 1, [4, 4]); line(ctx, [[A.X(0), A.Y(-RAIL)], [A.X(3), A.Y(-RAIL)]], col.bad, 1, [4, 4]);
    const a = [], b = [];
    for (let i = 0; i <= 3 * N; i++) { const j = (i + Math.round(ph * N)) % N; a.push([A.X(i / N), A.Y(P.vin[j])]); b.push([A.X(i / N), A.Y(P.vo[j])]); }
    line(ctx, a, col.muted, 2); line(ctx, b, col.s[0], 2.5);
    
    text(ctx, 'V_in', A.L + 6, A.T + 10, { color: col.muted, size: 11, weight: 700 }); text(ctx, 'V_out', A.L + 46, A.T + 10, { color: col.s[0], size: 11, weight: 700 });
    title(ctx, ({ inv: 'Inverting amplifier', non: 'Non-inverting amplifier', int: 'Integrator', dif: 'Differentiator' })[kind], col);
  };
  show();
}
