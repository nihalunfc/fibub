// Thermodynamics: the four standard processes on a P-V diagram for one mole of ideal gas starting at
// 300 K and 1 atm. Pick a process and a final volume; the shaded area is the work done by the gas, and the
// first law (Q = ΔU + W) splits the heat into internal energy and work.
import { canvas, axes, line, dot, text, row, slider, choice, readout } from '../../kit.js';

const R = 8.314, T0 = 300, P0 = 101325, V0 = (R * T0) / P0; // m³ (about 24.6 L)
export default function (host) {
  let proc = 'iso', gas = 'mono', f = 1.8;
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 260, label: 'Pressure against volume for isothermal, adiabatic, isobaric and isochoric processes' });
  const ctl = row(host);
  choice(ctl, 'Process', [['iso', 'Isothermal'], ['adia', 'Adiabatic'], ['bar', 'Isobaric'], ['chor', 'Isochoric']], proc, (v) => { proc = v; cv.redraw(); show(); });
  choice(ctl, 'Gas', [['mono', 'Monatomic'], ['di', 'Diatomic']], gas, (v) => { gas = v; cv.redraw(); show(); });
  slider(ctl, { label: 'End ÷ start', min: 0.5, max: 2.5, step: 0.05, value: f, fmt: (v) => `${v.toFixed(2)}`, oninput: (v) => { f = v; cv.redraw(); show(); } });
  const out = readout(host);
  const g = () => (gas === 'mono' ? 5 / 3 : 7 / 5), cv_ = () => R / (g() - 1);
  // end state and path for the current choice
  const path = () => {
    const pts = [], N = 60;
    for (let i = 0; i <= N; i++) {
      const s = i / N;
      if (proc === 'chor') pts.push([V0, P0 * (1 + (f - 1) * s)]);
      else { const V = V0 * (1 + (f - 1) * s); pts.push([V, proc === 'iso' ? (P0 * V0) / V : proc === 'adia' ? P0 * Math.pow(V0 / V, g()) : P0]); }
    }
    return pts;
  };
  const show = () => {
    const pts = path(), [V1, P1] = pts[pts.length - 1], T1 = (P1 * V1) / R;
    const W = proc === 'iso' ? R * T0 * Math.log(V1 / V0) : proc === 'adia' ? (P0 * V0 - P1 * V1) / (g() - 1) : proc === 'bar' ? P0 * (V1 - V0) : 0;
    const dU = cv_() * (T1 - T0), Q = dU + W, s = (x) => `${x >= 0 ? '+' : '−'}${Math.abs(x).toFixed(0)} J`;
    const rule = { iso: 'T constant, so ΔU = 0 and Q = W = nRT ln(V₂/V₁).', adia: 'No heat flows (Q = 0), so W = −ΔU: expanding cools the gas.', bar: 'P constant: W = PΔV and Q = nC_pΔT.', chor: 'V constant: no work, so Q = ΔU = nC_vΔT.' }[proc];
    out.innerHTML = `End: T = ${T1.toFixed(0)} K. Work by gas W = <b>${s(W)}</b>, ΔU = <b>${s(dU)}</b>, heat in Q = <b>${s(Q)}</b>. ${rule}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const L = 1000, kPa = 1000;
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [0, 2.7 * V0 * L], y: [0, 3.2 * P0 / kPa], xlabel: 'V (litres)', ylabel: 'P (kPa)', t: 26 });
    ctx.save(); clip();
    // faint isotherms for reference
    for (const T of [150, 300, 600]) { const iso = []; for (let i = 1; i <= 80; i++) { const V = (2.7 * V0 * i) / 80; iso.push([X(V * L), Y((R * T) / V / kPa)]); } line(ctx, iso, col.line, 1, [3, 4]); }
    const pts = path();
    if (proc !== 'chor') { ctx.fillStyle = col.soft; ctx.beginPath(); ctx.moveTo(X(pts[0][0] * L), Y(0)); pts.forEach(([V, P]) => ctx.lineTo(X(V * L), Y(P / kPa))); ctx.lineTo(X(pts[pts.length - 1][0] * L), Y(0)); ctx.closePath(); ctx.fill(); }
    line(ctx, pts.map(([V, P]) => [X(V * L), Y(P / kPa)]), col.s[0], 3);
    ctx.restore();
    dot(ctx, X(V0 * L), Y(P0 / kPa), 5, col.ink); text(ctx, 'start, 300 K', X(V0 * L) + 8, Y(P0 / kPa) - 10, { color: col.ink, size: 11 });
    const [V1, P1] = pts[pts.length - 1]; dot(ctx, X(V1 * L), Y(P1 / kPa), 5, col.s[3]);
    text(ctx, 'Shaded area = work done by the gas. Dashed: isotherms 150, 300, 600 K.', 60, 12, { color: col.muted, size: 11 });
  };
  cv.redraw(); show();
}
