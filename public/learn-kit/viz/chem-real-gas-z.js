// Real gases against the ideal gas: the compressibility factor Z = PV/nRT from the van der Waals equation, plotted
// against pressure for five gases. Z = 1 is ideal. Slide the temperature: below the Boyle temperature (a/Rb) attractions
// pull Z under 1 first, then repulsion (the size b) pushes it above 1 at high pressure. Pick a gas to see its numbers.
import { canvas, axes, line, text, row, slider, choice, readout, title } from '../kit.js';

const R = 0.083145; // L bar / (mol K)
const GAS = { He: [0.0346, 0.0238], H2: [0.2476, 0.02661], N2: [1.370, 0.0387], CH4: [2.303, 0.0431], CO2: [3.640, 0.04267] };
const NAMES = Object.keys(GAS);
function Z(g, T, P) {
  const [a, b] = GAS[g], pv = (V) => R * T / (V - b) - a / (V * V);
  let hi = R * T / P * 20 + 5, lo = hi;
  for (let k = 0; k < 4000 && pv(lo) < P; k++) lo = Math.max(b * 1.0005, lo * 0.995);
  if (pv(lo) < P) return null;
  let l = lo, h = hi; if (pv(h) > P) return null;
  for (let i = 0; i < 60; i++) { const m = (l + h) / 2; pv(m) > P ? (l = m) : (h = m); }
  return (P * (l + h) / 2) / (R * T);
}
export default function (host) {
  let T = 300, gas = 'CO2';
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Compressibility factor Z against pressure for several gases' });
  const c1 = row(host);
  const sT = slider(c1, { label: 'Temperature (K)', min: 150, max: 900, step: 10, value: T, oninput: (v) => { T = v; set(); } });
  choice(row(host), 'Highlight', NAMES.map((n) => [n, n]), gas, (v) => { gas = v; set(); });
  const out = readout(host);
  function set() {
    const [a, b] = GAS[gas], TB = a / (R * b);
    const z = Z(gas, T, 100);
    out.innerHTML = `<b>${gas}</b>: a = ${a} L² bar mol⁻², b = ${b} L mol⁻¹. Boyle temperature a ÷ Rb = <b>${TB.toFixed(0)} K</b>. At ${T} K and 100 bar, Z = <b>${z ? z.toFixed(2) : 'n/a (liquid-like)'}</b> ${z ? (z < 0.995 ? '(attractions win: easier to compress than ideal)' : z > 1.005 ? '(repulsion wins: harder to compress than ideal)' : '(nearly ideal)') : ''}. ${T < TB ? 'T is below T_B: Z dips below 1 first.' : 'T is above T_B: Z only rises.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Z = PV/nRT at ${T} K (van der Waals)`, col);
    const A = axes(ctx, w, h, col, { x: [0, 400], y: [0.2, 1.8], xlabel: 'Pressure (bar)', ylabel: 'Z', t: 44, fx: (v) => v });
    line(ctx, [[A.X(0), A.Y(1)], [A.X(400), A.Y(1)]], col.muted, 1.5, [5, 4]);
    text(ctx, 'ideal Z = 1', A.L + 4, A.Y(1) + 9, { color: col.muted, size: 10 });
    NAMES.forEach((g, gi) => {
      const pts = []; for (let P = 1; P <= 400; P += 4) { const z = Z(g, T, P); if (z != null && z > 0 && z < 1.8 && z > 0.2) pts.push([A.X(P), A.Y(z)]); }
      line(ctx, pts, col.s[gi], g === gas ? 3.2 : 1.4);
      if (pts.length) { const e = pts[pts.length - 1]; text(ctx, g, Math.min(e[0] + 3, w - 24), e[1] - (g === gas ? 0 : 0), { color: col.s[gi], size: 10, weight: 700 }); }
    });
  };
  set();
}
