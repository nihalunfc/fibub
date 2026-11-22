// Class 12 Chemistry, Electrochemistry: the electrochemical series and E0cell. Standard reduction potentials (V, 298 K, 1 M, 1 bar; CRC Handbook) are laid on a ladder.
// Pick any two half-cells: the one HIGHER on the ladder is reduced (cathode), the other is oxidised (anode); E0cell = E0(cathode) - E0(anode), and the cell works (dG < 0) only if E0cell > 0.
// Electrons run through the wire from the anode to the cathode.
import { canvas, text, title, line, dot, arrow, row, slider, readout } from '../../kit.js';

const HC = [['Li⁺/Li', -3.05], ['Mg²⁺/Mg', -2.37], ['Al³⁺/Al', -1.66], ['Zn²⁺/Zn', -0.76], ['Fe²⁺/Fe', -0.44], ['H⁺/H₂', 0.0], ['Cu²⁺/Cu', 0.34], ['Ag⁺/Ag', 0.80], ['Cl₂/Cl⁻', 1.36], ['F₂/F⁻', 2.87]];
export default function (host) {
  let a = 3, b = 6;
  const cv = canvas(host, { aspect: 1.05, max: 460, min: 340, label: 'Ladder of standard reduction potentials with two chosen half cells and the cell voltage' });
  const ctl = row(host), ro = readout(host);
  const s1 = slider(ctl, { label: 'half-cell 1', min: 0, max: 9, step: 1, value: a, fmt: (v) => HC[v][0], oninput: (v) => { a = v; go(); } });
  const s2 = slider(ctl, { label: 'half-cell 2', min: 0, max: 9, step: 1, value: b, fmt: (v) => HC[v][0], oninput: (v) => { b = v; go(); } });
  const go = () => {
    const [c, an] = HC[a][1] >= HC[b][1] ? [HC[a], HC[b]] : [HC[b], HC[a]];
    ro.textContent = a === b ? 'Choose two different half-cells.' : `Cathode (reduction): ${c[0]} (${c[1].toFixed(2)} V). Anode (oxidation): ${an[0]} (${an[1].toFixed(2)} V). E°cell = ${c[1].toFixed(2)} − (${an[1].toFixed(2)}) = ${(c[1] - an[1]).toFixed(2)} V.`; cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Standard reduction potentials E° (volts)', col) + 8, T = t0 + 8, B = h - 16, Y = (v) => B - (v + 3.4) / 6.5 * (B - T), x0 = 104;
    line(ctx, [[x0, T], [x0, B]], col.muted, 2);
    HC.forEach(([n, v], i) => { const sel = i === a || i === b; dot(ctx, x0, Y(v), sel ? 6 : 3.5, sel ? col.s[2] : col.muted, sel ? col.panel : null); text(ctx, `${n}  ${v > 0 ? '+' : ''}${v.toFixed(2)}`, x0 - 12, Y(v), { color: sel ? col.ink : col.muted, size: sel ? 12 : 10.5, weight: sel ? 700 : 400, align: 'right' }); });
    text(ctx, 'strong reducing agent ↓', w - 12, B - 6, { color: col.muted, size: 10, align: 'right' }); text(ctx, 'strong oxidising agent ↑', w - 12, T + 4, { color: col.muted, size: 10, align: 'right' });
    if (a === b) return;
    const [ci, ai] = HC[a][1] >= HC[b][1] ? [a, b] : [b, a], xc = x0 + 40, xa = x0 + 80, yc = Y(HC[ci][1]), ya = Y(HC[ai][1]);
    line(ctx, [[x0 + 8, yc], [xc, yc]], col.s[0], 2); line(ctx, [[x0 + 8, ya], [xa, ya]], col.s[3], 2);
    text(ctx, 'cathode', xc + 4, yc - 4, { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'anode', xa + 4, ya + 12, { color: col.s[3], size: 11, weight: 700 });
    const xm = x0 + 118, bw = Math.max(16, Math.min(34, w - xm - 80));
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.25; ctx.fillRect(xm, yc, bw, ya - yc); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.strokeRect(xm, yc, bw, ya - yc);
    text(ctx, `E°cell`, xm + bw + 6, (yc + ya) / 2 - 8, { color: col.ink, size: 11.5, weight: 700 }); text(ctx, `${(HC[ci][1] - HC[ai][1]).toFixed(2)} V`, xm + bw + 6, (yc + ya) / 2 + 8, { color: col.s[2], size: 12.5, weight: 700 });
    arrow(ctx, xa + 24, ya - 4, xa + 24, yc + 6, col.s[2], 2, 7); text(ctx, 'e⁻', xa + 30, (yc + ya) / 2, { color: col.s[2], size: 11, weight: 700 });
  };
  go();
}
