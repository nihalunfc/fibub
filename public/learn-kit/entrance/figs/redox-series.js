// The electrochemical series as a ladder of standard reduction potentials (25 °C, V). Pick two half-cells: the higher one
// is reduced (cathode), the lower one oxidised (anode); electrons flow from the lower to the higher, and E°cell is the gap.
import { canvas, text, row, slider, readout, arrow } from '../../kit.js';

const S = [
  ['Li⁺/Li', -3.05, 'Li'], ['K⁺/K', -2.93, 'K'], ['Mg²⁺/Mg', -2.37, 'Mg'], ['Al³⁺/Al', -1.66, 'Al'], ['Zn²⁺/Zn', -0.76, 'Zn'],
  ['Fe²⁺/Fe', -0.44, 'Fe'], ['Pb²⁺/Pb', -0.13, 'Pb'], ['H⁺/H₂', 0.0, 'H₂'], ['Cu²⁺/Cu', 0.34, 'Cu'], ['I₂/I⁻', 0.54, 'I⁻'],
  ['Fe³⁺/Fe²⁺', 0.77, 'Fe²⁺'], ['Ag⁺/Ag', 0.8, 'Ag'], ['Br₂/Br⁻', 1.07, 'Br⁻'], ['Cl₂/Cl⁻', 1.36, 'Cl⁻'], ['MnO₄⁻/Mn²⁺', 1.51, 'Mn²⁺'], ['F₂/F⁻', 2.87, 'F⁻'],
];

export default function (host) {
  let a = 4, b = 8; // Zn and Cu
  const cv = canvas(host, { aspect: 0.75, max: 420, min: 300, label: 'Electrochemical series with two chosen half-cells and the direction of electron flow' });
  const ctl = row(host);
  slider(ctl, { label: 'Half-cell 1', min: 0, max: S.length - 1, step: 1, value: a, fmt: (v) => S[Math.round(v)][0], oninput: (v) => { a = Math.round(v); cv.redraw(); show(); } });
  slider(ctl, { label: 'Half-cell 2', min: 0, max: S.length - 1, step: 1, value: b, fmt: (v) => S[Math.round(v)][0], oninput: (v) => { b = Math.round(v); cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    if (a === b) { out.innerHTML = 'Pick two different half-cells.'; return; }
    const [lo, hi] = S[a][1] < S[b][1] ? [S[a], S[b]] : [S[b], S[a]];
    out.innerHTML = `Cathode (reduced): <b>${hi[0]}</b>; anode (oxidised): <b>${lo[0]}</b>. E°<sub>cell</sub> = ${hi[1].toFixed(2)} − (${lo[1].toFixed(2)}) = <b>${(hi[1] - lo[1]).toFixed(2)} V</b>. The reduced form of the lower couple (${lo[2]}) can reduce the oxidised form of the higher one; the reverse does not happen on its own.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const T = 26, B = h - 16, Emin = -3.2, Emax = 3.0, Y = (E) => B - ((E - Emin) / (Emax - Emin)) * (B - T), x0 = Math.min(150, w * 0.42);
    text(ctx, 'stronger oxidising agents ↑', 10, 12, { color: col.muted, size: 10.5 });
    text(ctx, 'stronger reducing agents ↓', 10, h - 6, { color: col.muted, size: 10.5 });
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, T); ctx.lineTo(x0, B); ctx.stroke();
    // ticks every volt
    for (let E = -3; E <= 3; E++) { ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0 - 4, Y(E)); ctx.lineTo(x0 + 4, Y(E)); ctx.stroke(); text(ctx, `${E > 0 ? '+' : ''}${E} V`, x0 - 8, Y(E), { color: col.muted, size: 10, align: 'right' }); }
    // couples on the right, spaced so labels do not collide
    let lastY = 1e9;
    const ys = S.map(([, E]) => Y(E)).map((y) => { const yy = Math.min(y, lastY - 13); lastY = yy; return yy; });
    S.forEach(([name, E], i) => {
      const sel = i === a || i === b, y = Y(E), ly = ys[i];
      ctx.strokeStyle = sel ? col.s[0] : col.line; ctx.lineWidth = sel ? 2.5 : 1;
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 18, y); ctx.lineTo(x0 + 26, ly); ctx.stroke();
      text(ctx, `${name}  ${E > 0 ? '+' : ''}${E.toFixed(2)}`, x0 + 30, ly, { color: sel ? col.ink : col.muted, size: sel ? 11.5 : 10.5, weight: sel ? 700 : 400 });
    });
    if (a !== b) {
      const [lo, hi] = S[a][1] < S[b][1] ? [S[a], S[b]] : [S[b], S[a]];
      const xa = x0 - 46;
      arrow(ctx, xa, Y(lo[1]), xa, Y(hi[1]) + 4, col.s[2], 2.5);
      text(ctx, 'e⁻', xa - 6, (Y(lo[1]) + Y(hi[1])) / 2, { color: col.s[2], size: 12, weight: 700, align: 'right', halo: col.panel });
      text(ctx, `${(hi[1] - lo[1]).toFixed(2)} V`, xa - 6, (Y(lo[1]) + Y(hi[1])) / 2 + 15, { color: col.s[2], size: 11, align: 'right', halo: col.panel });
    }
  };
  cv.redraw(); show();
}
