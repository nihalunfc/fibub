// 9.3 Op-amp circuit picker. Choose a circuit and see its DC transfer curve V_out against V_in with the output
// limited at ±12 V: inverting and non-inverting amplifiers (gain), comparator (reference), inverting Schmitt trigger
// (hysteresis loop traced in both directions), precision half-wave rectifier, and log amplifier (log input axis).
import { canvas, row, slider, choice, readout, axes, line, dot, text, title, arrow, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 430, min: 280, label: 'Transfer curve of the chosen op-amp circuit, output voltage against input voltage with saturation' });
  let kind = 'schmitt', p = 0.25, vin = 1;
  const VS = 12, VT = 0.02585;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Circuit', [['inv', 'Inverting'], ['non', 'Non-inverting'], ['comp', 'Comparator'], ['schmitt', 'Schmitt'], ['rect', 'Super-diode'], ['log', 'Log amp']], kind, (v) => { kind = v; re(); });
  const ps = slider(ctl, { label: 'Setting (gain, reference or β)', min: 0, max: 1, step: 0.01, value: p, fmt: (v) => fmt(v, 2), oninput: (v) => { p = v; re(); } });
  slider(ctl, { label: 'Input V_in (V)', min: -5, max: 5, step: 0.01, value: vin, fmt: (v) => fmt(v, 3), oninput: (v) => { vin = v; re(); } });
  const sat = (v) => Math.max(-VS, Math.min(VS, v));
  const gain = () => 1 + Math.round(p * 19); // 1..20
  const vref = () => -4 + 8 * p;              // comparator reference -4..4 V
  const beta = () => 0.02 + 0.4 * p;          // Schmitt feedback fraction
  const Is = 1e-14, R = 1e4;
  const f = (x, up) => {
    switch (kind) {
      case 'inv': return sat(-gain() * x);
      case 'non': return sat(gain() * x);
      case 'comp': return x > vref() ? VS : -VS;
      case 'schmitt': return up ? (x < beta() * VS ? VS : -VS) : (x > -beta() * VS ? -VS : VS);
      case 'rect': return Math.max(0, x);
      case 'log': return x > 0 ? sat(-VT * Math.log(x / (R * Is))) : NaN;
    }
  };
  const show = () => {
    const x = kind === 'log' ? Math.max(1e-4, Math.abs(vin)) : vin;
    const lines = {
      inv: `Gain −R_f/R₁ = −${gain()}: V_out = ${fmt(f(x), 3)} V. It saturates once |V_in| > ${fmt(VS / gain(), 3)} V.`,
      non: `Gain 1 + R_f/R₁ = ${gain()}: V_out = ${fmt(f(x), 3)} V; input resistance essentially infinite.`,
      comp: `Open loop: the output slams to +12 V when V_in > V_ref = ${fmt(vref(), 3)} V and to −12 V below it. Noise near V_ref makes it chatter.`,
      schmitt: `Feedback fraction β = ${fmt(beta(), 3)}: thresholds ±βV_sat = ±${fmt(beta() * VS, 3)} V, hysteresis ${fmt(2 * beta() * VS, 3)} V. Noise smaller than this cannot make the output chatter.`,
      rect: `The diode sits inside the loop, so V_out = max(V_in, 0) even for millivolt signals: here ${fmt(f(x), 3)} V.`,
      log: `V_out = −V_T ln(V_in/RI_S) with R = 10 kΩ, I_S = 10⁻¹⁴ A: at V_in = ${fmt(x, 3)} V, V_out = ${fmt(f(x), 3)} V. Each decade of input moves the output by −59.5 mV.`,
    };
    out.innerHTML = lines[kind];
  };
  cv.draw = (ctx, W, H, col) => {
    const isLog = kind === 'log';
    const ax = isLog ? axes(ctx, W, H, col, { x: [1e-4, 10], y: [-1, 0], xlog: true, xlabel: 'V_in (V), log scale', ylabel: 'V_out (V)', t: 32 })
      : axes(ctx, W, H, col, { x: [-5, 5], y: [-14, 14], xlabel: 'V_in (V)', ylabel: 'V_out (V)', t: 32 });
    title(ctx, { inv: 'Inverting amplifier', non: 'Non-inverting amplifier', comp: 'Comparator (open loop)', schmitt: 'Inverting Schmitt trigger', rect: 'Precision half-wave rectifier', log: 'Logarithmic amplifier' }[kind], col);
    ctx.save(); ax.clip();
    if (!isLog) { line(ctx, [[ax.X(-5), ax.Y(0)], [ax.X(5), ax.Y(0)]], col.line, 1); line(ctx, [[ax.X(0), ax.Y(-14)], [ax.X(0), ax.Y(14)]], col.line, 1); }
    if (kind === 'schmitt') {
      const t = beta() * VS;
      line(ctx, [[ax.X(-5), ax.Y(VS)], [ax.X(t), ax.Y(VS)], [ax.X(t), ax.Y(-VS)], [ax.X(5), ax.Y(-VS)]], col.s[0], 2.6);
      line(ctx, [[ax.X(5), ax.Y(-VS)], [ax.X(-t), ax.Y(-VS)], [ax.X(-t), ax.Y(VS)], [ax.X(-5), ax.Y(VS)]], col.s[2], 2.6, [7, 4]);
      arrow(ctx, ax.X(t), ax.Y(VS * 0.4), ax.X(t), ax.Y(-VS * 0.4), col.s[0], 2);
      arrow(ctx, ax.X(-t), ax.Y(-VS * 0.4), ax.X(-t), ax.Y(VS * 0.4), col.s[2], 2);
    } else {
      const pts = [];
      if (isLog) for (let e = -4; e <= 1; e += 0.02) pts.push([ax.X(10 ** e), ax.Y(f(10 ** e))]);
      else for (let x = -5; x <= 5.0001; x += 0.01) pts.push([ax.X(x), ax.Y(f(x, true))]);
      line(ctx, pts, col.s[0], 2.6);
    }
    const x = isLog ? Math.max(1e-4, Math.abs(vin)) : vin, y = kind === 'schmitt' ? null : f(x, true);
    if (y !== null && Number.isFinite(y)) dot(ctx, ax.X(x), ax.Y(y), 6, col.s[4], col.panel);
    ctx.restore();
    if (kind === 'schmitt') { text(ctx, 'rising input', ax.X(-4.6), ax.Y(VS) + 14, { color: col.s[0], size: 11, weight: 700, halo: col.panel }); text(ctx, 'falling input', ax.X(1.2), ax.Y(-VS) - 14, { color: col.s[2], size: 11, weight: 700, halo: col.panel }); }
    if (!isLog) text(ctx, '±12 V rails', ax.R - 6, ax.Y(VS) + 12, { color: col.muted, size: 10.5, align: 'right', halo: col.panel });
  };
  re();
}
