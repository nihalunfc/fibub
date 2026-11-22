// A buffer against plain water (acetic acid / acetate, pKa 4.76, in 100 mL). Slide the amount of strong acid (+) or base (−)
// added in millimoles and watch the pH of each: water lurches by several units, the buffer barely moves until one
// of its two partners is used up. Change the ratio A⁻ : HA to see that the best buffer sits where pH = pKa (ratio 1).
import { canvas, axes, line, dot, text, row, slider, readout, title } from '../kit.js';

const PKA = 4.76, VL = 0.1;
const water = (x) => { const m = Math.abs(x) * 0.01; if (m < 1e-7) return 7; return x > 0 ? -Math.log10(m) : 14 + Math.log10(m); };
function buffer(tot, ratio, x) { // x mmol strong acid added (negative = base)
  let A = tot * ratio / (1 + ratio), HA = tot - A; A -= x; HA += x;
  if (A <= 1e-9) { const ex = (-A) * 0.01; return { pH: ex > 1e-9 ? -Math.log10(ex) : 2.9, A: 0, HA: tot, spent: 'A⁻' }; }
  if (HA <= 1e-9) { const ex = (-HA) * 0.01; return { pH: 14 + Math.log10(Math.max(ex, 1e-9)), A: tot, HA: 0, spent: 'HA' }; }
  return { pH: PKA + Math.log10(A / HA), A, HA, spent: null };
}
export default function (host) {
  let tot = 100, lr = 0, x = 0;
  const cv = canvas(host, { aspect: 0.9, max: 450, min: 310, label: 'pH of a buffer and of water against added acid or base' });
  const c = row(host);
  slider(c, { label: 'Strong acid added (mmol; negative = base)', min: -40, max: 40, step: 1, value: 0, oninput: (v) => { x = v; set(); } });
  slider(c, { label: 'Buffer amount (mmol)', min: 20, max: 200, step: 10, value: tot, oninput: (v) => { tot = v; set(); } });
  slider(c, { label: 'Ratio A⁻ : HA', min: 0.1, max: 10, value: 1, log: true, fmt: (v) => v.toFixed(2), oninput: (v) => { lr = v; set(); } });
  lr = 1;
  const out = readout(host);
  function set() {
    const b = buffer(tot, lr, x), b0 = buffer(tot, lr, 0);
    out.innerHTML = `Added ${x} mmol ${x >= 0 ? 'H⁺' : 'OH⁻'}: water pH <b>${water(x).toFixed(2)}</b> (from 7.00); buffer pH <b>${b.pH.toFixed(2)}</b> (from ${b0.pH.toFixed(2)}). Now ${b.A.toFixed(0)} mmol A⁻ and ${b.HA.toFixed(0)} mmol HA. ${b.spent ? `The buffer has run out of ${b.spent}, so it no longer resists.` : `Henderson-Hasselbalch: pH = ${PKA} + log(${b.A.toFixed(0)} ÷ ${b.HA.toFixed(0)}).`} Buffer capacity is best when the ratio is near 1.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'pH as you add acid or base', col);
    const A = axes(ctx, w, h, col, { x: [-40, 40], y: [0, 14], xlabel: 'mmol H⁺ added (negative: OH⁻ added)', ylabel: 'pH', t: 44, fx: (v) => v, xt: [-40, -20, 0, 20, 40], yt: [0, 2, 4, 6, 8, 10, 12, 14] });
    const mk = (f) => { const p = []; for (let k = -40; k <= 40; k += 0.5) p.push([A.X(k), A.Y(Math.max(0, Math.min(14, f(k))))]); return p; };
    line(ctx, mk(water), col.s[1], 2.2); line(ctx, mk((k) => buffer(tot, lr, k).pH), col.s[0], 2.8);
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(A.L, A.Y(PKA)); ctx.lineTo(A.R, A.Y(PKA)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'pKa 4.76', A.R - 2, A.Y(PKA) - 7, { color: col.muted, size: 10, align: 'right' });
    dot(ctx, A.X(x), A.Y(water(x)), 6, col.s[1], col.panel); dot(ctx, A.X(x), A.Y(Math.max(0, Math.min(14, buffer(tot, lr, x).pH))), 6, col.s[0], col.panel);
    text(ctx, 'water', A.L + 6, A.Y(12.5), { color: col.s[1], size: 11, weight: 700 }); text(ctx, 'buffer', A.L + 6, A.Y(11), { color: col.s[0], size: 11, weight: 700 });
  };
  set();
}
