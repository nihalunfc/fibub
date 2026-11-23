// Class 11 Thermodynamics: the four standard processes of an ideal gas on a P-V diagram, all starting from the same state (V1 = 2 L, P1 = 6 kPa, so P1V1 = 12 J). The shaded area under the path is the work done BY the gas, W = integral P dV.
// Isothermal: P V = const, W = P1V1 ln(V2/V1), dU = 0. Adiabatic (Q = 0): P V^gamma = const, W = (P1V1 - P2V2)/(gamma - 1). Isobaric: W = P (V2 - V1). Isochoric: W = 0. dU = (P2V2 - P1V1)/(gamma - 1), Q = dU + W. gamma = 5/3 (monatomic) or 7/5 (diatomic).
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let proc = 'iso', gas = 5 / 3, x = 0.6;
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 310, label: 'Pressure against volume for isothermal, adiabatic, isobaric and isochoric processes with the work shaded' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Process', [['iso', 'isothermal'], ['adi', 'adiabatic'], ['bar', 'isobaric'], ['cho', 'isochoric']], proc, (v) => { proc = v; go(); });
  choice(ctl, 'Gas', [[5 / 3, 'monatomic'], [7 / 5, 'diatomic']], gas, (v) => { gas = v; go(); });
  slider(ctl, { label: 'how far to go', min: 0.05, max: 1, step: 0.05, value: x, fmt: (v) => Math.round(v * 100) + ' %', oninput: (v) => { x = v; go(); } });
  const V1 = 2, P1 = 6;
  const end = () => { if (proc === 'cho') return { V: V1, P: P1 * (1 + x * 1.6) }; const V2 = proc === 'iso' || proc === 'adi' ? V1 + x * 6 : V1 + x * 4; if (proc === 'iso') return { V: V2, P: P1 * V1 / V2 }; if (proc === 'adi') return { V: V2, P: P1 * (V1 / V2) ** gas }; return { V: V2, P: P1 }; };
  const calc = () => { const e = end(), dU = (e.P * e.V - P1 * V1) / (gas - 1); let W = 0; if (proc === 'iso') W = P1 * V1 * Math.log(e.V / V1); else if (proc === 'adi') W = (P1 * V1 - e.P * e.V) / (gas - 1); else if (proc === 'bar') W = P1 * (e.V - V1); return { e, dU, W, Q: dU + W }; };
  const go = () => { const c = calc(); ro.textContent = `W (by gas) = ${c.W.toFixed(1)} J,  ΔU = ${c.dU.toFixed(1)} J,  Q = ΔU + W = ${c.Q.toFixed(1)} J.  ${{ iso: 'Temperature fixed: ΔU = 0, all heat becomes work.', adi: 'No heat flows (Q = 0): the work comes out of the gas’s own energy, so it cools.', bar: 'Heat goes partly into raising T and partly into pushing the piston.', cho: 'Volume fixed: no work, all the heat raises the temperature.' }[proc]}`; cv.redraw(); };
  const path = (p, V2) => { const pts = []; for (let i = 0; i <= 40; i++) { const V = V1 + (V2 - V1) * i / 40; pts.push([V, p === 'iso' ? P1 * V1 / V : p === 'adi' ? P1 * (V1 / V) ** gas : P1]); } return pts; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'P–V diagram: work is the area under the path', col), A = axes(ctx, w, h, col, { x: [0, 8], y: [0, 14], xlabel: 'volume V (litres)', ylabel: 'pressure P (kPa)', l: 44, t: top + 8, xt: [0, 2, 4, 6, 8], yt: [0, 4, 8, 12] }), c = calc();
    ctx.save(); A.clip();
    const T1 = [P1 * V1];
    line(ctx, path('iso', 8).map(([v, p]) => [A.X(v), A.Y(p)]), col.line, 1.5, [4, 3]); text(ctx, 'isotherm through the start', A.X(5), A.Y(P1 * V1 / 5) - 10, { color: col.muted, size: 10 });
    if (proc !== 'cho') { const pts = path(proc, c.e.V); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(A.X(V1), A.Y(0)); pts.forEach(([v, p]) => ctx.lineTo(A.X(v), A.Y(p))); ctx.lineTo(A.X(c.e.V), A.Y(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; line(ctx, pts.map(([v, p]) => [A.X(v), A.Y(p)]), col.s[1], 3.5); }
    else line(ctx, [[A.X(V1), A.Y(P1)], [A.X(V1), A.Y(c.e.P)]], col.s[1], 3.5);
    ctx.restore(); dot(ctx, A.X(V1), A.Y(P1), 5, col.s[0], col.panel); dot(ctx, A.X(c.e.V), A.Y(c.e.P), 5.5, col.s[3], col.panel);
    text(ctx, 'start', A.X(V1) + 8, A.Y(P1) - 10, { color: col.s[0], size: 10.5, weight: 700 }); text(ctx, proc === 'cho' ? 'no area: W = 0' : 'W = ' + c.W.toFixed(1) + ' J', A.R - 6, A.T + 12, { color: col.s[2], size: 11.5, weight: 700, align: 'right' });
  };
  go();
}
