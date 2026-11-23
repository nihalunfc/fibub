// Class 11 Maths, Probability: the axioms. Give each outcome a probability: (1) every P(w) >= 0, (2) the total over the whole sample space is 1, (3) the probability of an event is the sum of the
// probabilities of its outcomes (outcomes are mutually exclusive). Drag the bar tops: the checks turn green only when all three hold.
import { canvas, text, title, line, dot, row, readout, choice, button } from '../../kit.js';
import { drag } from '../c12m-lib.js';

const NM = ['heavy rain', 'light rain', 'cloudy', 'clear'], EVT = { wet: ['it rains', [0, 1]], dry: ['no rain', [2, 3]], not: ['not clear', [0, 1, 2]] };
export default function (host) {
  let P = [0.3, 0.2, 0.3, 0.2], ek = 'wet', G = null;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Four bars giving probabilities of four weather outcomes with checks for the axioms and the probability of an event' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Event E', Object.entries(EVT).map(([i, v]) => [i, v[0]]), ek, (v) => { ek = v; cv.redraw(); });
  button(ctl, 'Scale to add up to 1', () => { const t = P.reduce((a, b) => a + b, 0); if (t > 0) P = P.map((v) => Math.round((v / t) * 100) / 100); cv.redraw(); });
  button(ctl, 'Equally likely', () => { P = [0.25, 0.25, 0.25, 0.25]; cv.redraw(); });
  drag(cv, () => (G ? P.map((v, i) => ({ x: G.X(i), y: G.Y(v) })) : []), (i, px, py) => { P[i] = Math.max(0, Math.min(1, Math.round(((G.B - py) / (G.B - G.T)) * 20) / 20)); cv.redraw(); }, 26);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Tomorrow in Mumbai: give each outcome a probability', col), L = 36, Rr = w - 12, T = top + 12, B = top + 12 + (h - top) * 0.52;
    G = { T, B, X: (i) => L + ((i + 0.5) / 4) * (Rr - L), Y: (v) => B - v * (B - T) };
    for (let v = 0; v <= 1.001; v += 0.25) { line(ctx, [[L, G.Y(v)], [Rr, G.Y(v)]], col.line, 1); text(ctx, String(v), L - 5, G.Y(v), { color: col.muted, size: 10, align: 'right' }); }
    const E = EVT[ek][1]; const bw = ((Rr - L) / 4) * 0.6;
    P.forEach((v, i) => { const inE = E.includes(i), x = G.X(i); ctx.save(); ctx.globalAlpha = inE ? 0.7 : 0.35; ctx.fillStyle = inE ? col.s[2] : col.s[0]; ctx.fillRect(x - bw / 2, G.Y(v), bw, B - G.Y(v)); ctx.restore(); ctx.strokeStyle = inE ? col.s[2] : col.s[0]; ctx.lineWidth = 1.5; ctx.strokeRect(x - bw / 2, G.Y(v), bw, B - G.Y(v)); dot(ctx, x, G.Y(v), 7, col.s[3], col.panel); text(ctx, v.toFixed(2), x, G.Y(v) - 14, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); text(ctx, NM[i], x, B + 12, { color: col.ink, size: 10.5, align: 'center' }); });
    const tot = P.reduce((a, b) => a + b, 0), pe = E.reduce((a, i) => a + P[i], 0), a1 = P.every((v) => v >= 0), a2 = Math.abs(tot - 1) < 0.004;
    let y = B + 36; const ck = (ok, s) => { text(ctx, (ok ? '✓ ' : '✗ ') + s, 12, y, { color: ok ? col.good : col.bad, size: 12, weight: 700 }); y += 19; };
    ck(a1, 'Axiom 1: every P(w) ≥ 0'); ck(a2, `Axiom 2: total = ${tot.toFixed(2)} (must be 1)`); ck(true, `Axiom 3: P(E) = ${E.map((i) => P[i].toFixed(2)).join(' + ')} = ${pe.toFixed(2)}`);
    ro.innerHTML = a2 ? `A valid probability assignment. P(${EVT[ek][0]}) = <b>${pe.toFixed(2)}</b>, and the rest of the outcomes make up <b>${(1 - pe).toFixed(2)}</b>: P(E′) = 1 − P(E).` : `<b>Not a probability assignment yet</b>: the total is ${tot.toFixed(2)}. Drag the bars or press "Scale to add up to 1".`;
  };
  cv.redraw();
}
