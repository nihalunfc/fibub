// Le Chatelier's principle for N₂O₄ ⇌ 2NO₂ (colourless ⇌ brown; endothermic). Press a button to disturb the equilibrium
// (add N₂O₄ or NO₂, squeeze or expand the vessel, heat or cool) and watch the concentrations drift to a new equilibrium
// while the readout compares Q with K. Rates are illustrative; K changes with temperature by the van 't Hoff equation.
import { canvas, axes, line, text, row, button, readout, loop, title } from '../kit.js';

const DH = 57200, R = 8.314, K0 = 0.2, T0 = 298; // J/mol, illustrative K (mol/L) at 298 K
const Kof = (T) => K0 * Math.exp(-(DH / R) * (1 / T - 1 / T0));
export default function (host) {
  let nA = 1.0, nB = 0.8, V = 4, T = 298, t = 0, hist = [], marks = [], acc = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 310, label: 'Concentrations of N₂O₄ and NO₂ over time as an equilibrium is disturbed' });
  const c1 = row(host), c2 = row(host);
  const dist = (name, f) => button(c1, name, () => { f(); marks.push({ t, name }); });
  dist('+ N₂O₄', () => { nA += 0.5; }); dist('+ NO₂', () => { nB += 0.5; });
  dist('Squeeze (V ÷ 2)', () => { V = Math.max(1, V / 2); }); dist('Expand (V × 2)', () => { V = Math.min(8, V * 2); });
  dist('Heat +30 K', () => { T = Math.min(400, T + 30); }); dist('Cool −30 K', () => { T = Math.max(250, T - 30); });
  button(c2, 'Reset', () => { nA = 1; nB = 0.8; V = 4; T = 298; hist = []; marks = []; t = 0; });
  const out = readout(host);
  loop(host, (dt) => {
    const K = Kof(T), kf = 0.8;
    for (let i = 0; i < 10; i++) {
      const s = Math.min(dt, 0.05) / 10, a = nA / V, b = nB / V, r = kf * a - (kf / K) * b * b; // mol/(L s)
      const dn = Math.max(-nA, Math.min(nB / 2, r * V * s)); nA -= dn; nB += 2 * dn;
    }
    t += dt; acc += dt;
    if (acc > 0.1) { acc = 0; hist.push({ t, a: nA / V, b: nB / V }); if (hist.length > 240) hist.shift(); }
    cv.redraw(); show();
  });
  function show() {
    const K = Kof(T), Q = (nB / V) ** 2 / (nA / V);
    const dir = Math.abs(Q - K) / K < 0.03 ? 'at equilibrium' : Q < K ? 'Q < K: net forward, more NO₂ (browner)' : 'Q > K: net backward, more N₂O₄ (paler)';
    out.innerHTML = `T = ${T} K, V = ${V} L. [N₂O₄] = ${(nA / V).toFixed(3)}, [NO₂] = ${(nB / V).toFixed(3)} mol/L. K = <b>${K.toFixed(3)}</b>, Q = <b>${Q.toFixed(3)}</b>: <b>${dir}</b>. Heating raises K (the forward reaction is endothermic); squeezing raises concentrations but K stays the same, so the side with fewer moles (N₂O₄) is favoured.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'N₂O₄ ⇌ 2NO₂', col);
    const bx = 10, bw = 78, by = 40, bh = 90, b = nB / V, a = nA / V;
    ctx.fillStyle = col.s[5]; ctx.globalAlpha = Math.min(0.75, b * 0.5); ctx.fillRect(bx, by, bw, bh); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    const na = Math.min(30, Math.round(a * 12)), nb = Math.min(40, Math.round(b * 12)), ph = t * 0.7;
    for (let i = 0; i < na; i++) { const x = bx + 8 + ((i * 37 + Math.sin(ph + i) * 3) % (bw - 16)), y = by + 8 + ((i * 53 + Math.cos(ph * 1.3 + i) * 3) % (bh - 16)); ctx.beginPath(); ctx.arc(x - 3, y, 3, 0, 7); ctx.arc(x + 3, y, 3, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); }
    for (let i = 0; i < nb; i++) { const x = bx + 8 + ((i * 29 + 11 + Math.sin(ph * 1.1 + i) * 3) % (bw - 16)), y = by + 8 + ((i * 41 + 7 + Math.cos(ph + i) * 3) % (bh - 16)); ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); }
    text(ctx, 'blue pairs: N₂O₄   orange: NO₂', bx, by + bh + 12, { color: col.muted, size: 10 });
    const A = axes(ctx, w, h, col, { x: [Math.max(0, t - 24), Math.max(24, t)], y: [0, 1.6], l: 40, t: 160, xlabel: 'time (s)', ylabel: 'mol/L', xt: [], fx: () => '' });
    ctx.save(); A.clip();
    [['a', 0], ['b', 1]].forEach(([k, ci]) => line(ctx, hist.map((p) => [A.X(p.t), A.Y(Math.min(1.6, p[k]))]), col.s[ci], 2.4));
    marks.forEach((m) => { if (m.t > t - 24) { const x = A.X(m.t); ctx.strokeStyle = col.muted; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(x, A.T); ctx.lineTo(x, A.B); ctx.stroke(); ctx.setLineDash([]); text(ctx, m.name, x + 2, A.T + 9, { color: col.muted, size: 9 }); } });
    ctx.restore();
    text(ctx, '[N₂O₄]', A.L + 4, A.T + 22, { color: col.s[0], size: 10, weight: 700 }); text(ctx, '[NO₂]', A.L + 54, A.T + 22, { color: col.s[1], size: 10, weight: 700 });
  };
  show();
}
