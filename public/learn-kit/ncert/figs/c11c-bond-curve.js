// Class 11 Chemistry, Chemical Bonding: potential energy of two bonded atoms against their distance (a Morse curve, schematic).
// Far apart: no force. Closer: attraction lowers the energy. Too close: nuclei repel, energy shoots up. The minimum gives the bond length (r_e) and its depth the bond dissociation energy (D_e).
// V(r) = De [ (1 - exp(-a (r - re)))^2 - 1 ], taken from published re and De values; "a" sets how narrow the well is (schematic).
import { canvas, text, title, row, slider, choice, readout, dot, line } from '../../kit.js';

const MOL = { H2: ['H–H', 74, 436, 1.94], HCl: ['H–Cl', 127, 431, 1.87], N2: ['N≡N', 110, 945, 2.69], F2: ['F–F', 142, 159, 2.2] };
export default function (host) {
  let key = 'H2', r = 180;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Potential energy of two bonded atoms against distance with the bond length at the minimum' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'bond', Object.entries(MOL).map(([k, v]) => [k, v[0]]), key, (v) => { key = v; go(); });
  slider(ctl, { label: 'distance r (pm)', min: 45, max: 300, step: 1, value: r, fmt: (v) => v.toFixed(0), oninput: (v) => { r = v; go(); } });
  const V = (x) => { const [, re, De, a] = MOL[key]; const e = 1 - Math.exp(-a * (x - re) / 100); return De * (e * e - 1); };
  const go = () => { const [nm, re, De] = MOL[key]; const v = V(r); ro.textContent = `${nm}: bond length ${re} pm, bond energy ${De} kJ/mol. At r = ${r.toFixed(0)} pm the energy is ${v.toFixed(0)} kJ/mol (${r < re - 3 ? 'squeezed: repulsion wins' : r > re + 3 ? 'stretched: attraction pulls back' : 'at the best distance'}).`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `Energy of two atoms (${MOL[key][0]}) against distance`, col);
    const [nm, re, De] = MOL[key], L = 46, Rr = w - 14, T = t0 + 12, B = h - 88;
    const X = (x) => L + (x - 40) / 270 * (Rr - L), ymin = -De * 1.12, ymax = De * 0.6, Y = (v) => T + (ymax - v) / (ymax - ymin) * (B - T);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(Rr, B); ctx.stroke();
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(L, Y(0)); ctx.lineTo(Rr, Y(0)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, '0 (atoms far apart)', Rr - 2, Y(0) - 8, { color: col.muted, size: 10, align: 'right' });
    const pts = []; for (let x = 45; x <= 300; x += 2) { const v = Math.min(V(x), ymax); pts.push([X(x), Y(v)]); }
    line(ctx, pts, col.s[0], 2.5);
    text(ctx, 'energy (kJ/mol)', L + 8, T + 8, { color: col.muted, size: 10 }); text(ctx, 'distance r (pm)', Rr - 4, B - 8, { color: col.muted, size: 10.5, align: 'right' });
    ctx.strokeStyle = col.s[2]; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(re), Y(-De)); ctx.lineTo(X(re), B); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 're = ' + re + ' pm', X(re), B + 5, { color: col.s[2], size: 10.5, weight: 700, align: 'center', base: 'top' });
    text(ctx, 'D = ' + De, X(re) + 12, Y(-De) + 10, { color: col.s[2], size: 11, weight: 700 });
    dot(ctx, X(r), Y(Math.min(V(r), ymax)), 6, col.s[3], col.ink);
    // atoms
    const my = h - 34, scale = (Rr - L) / 270 * 0.9, a1 = w / 2 - r * scale / 2, a2 = w / 2 + r * scale / 2, rad = Math.max(8, Math.min(18, MOL[key][1] * scale * 0.42));
    for (const x of [a1, a2]) { ctx.beginPath(); ctx.arc(x, my, rad, 0, 7); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5; ctx.stroke(); }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a1 + rad, my + rad + 5); ctx.lineTo(a2 - rad, my + rad + 5); ctx.stroke();
  };
  go();
}
