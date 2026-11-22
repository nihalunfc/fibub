// Word arithmetic in an embedding space (a made-up 2D map: left-right is male to female, up-down is child to royal;
// the second group is country and capital). Pick an analogy: the figure moves the arrow that links the first pair to
// the third word and lands on the answer. Drag any word to see how a small change in the map changes the result.
import { canvas, text, row, choice, readout, title, arrow, dot } from '../kit.js';
import { pointer } from './_ai.js';

const P = { man: [-1.2, 0.1], woman: [1.1, 0.0], king: [-1.0, 2.1], queen: [1.2, 2.0], boy: [-1.3, -1.2], girl: [1.0, -1.3], prince: [-0.9, 1.0], princess: [1.0, 1.1],
  France: [3.4, -0.9], Paris: [3.6, 1.3], Italy: [4.9, -0.7], Rome: [5.1, 1.5], Spain: [6.3, -1.0], Madrid: [6.4, 1.2] };
const SETS = { a: ['king', 'man', 'woman'], b: ['prince', 'boy', 'girl'], c: ['Paris', 'France', 'Italy'], d: ['Madrid', 'Spain', 'France'] };
const X0 = -2.2, X1 = 7.4, Y0 = -2.1, Y1 = 3.0;
export default function (host) {
  let set = 'a'; const pos = JSON.parse(JSON.stringify(P));
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 250, label: 'A map of word vectors with an analogy drawn as arrows' });
  const ctl = row(host);
  choice(ctl, 'Analogy', [['a', 'king − man + woman'], ['b', 'prince − boy + girl'], ['c', 'Paris − France + Italy'], ['d', 'Madrid − Spain + France']], set, (v) => { set = v; show(); });
  const out = readout(host);
  const g = { L: 8, T: 34, W: 0, H: 0 };
  const px = ([x, y]) => [g.L + ((x - X0) / (X1 - X0)) * g.W, g.T + ((Y1 - y) / (Y1 - Y0)) * g.H];
  let drag = null;
  pointer(cv, (x, y, k) => {
    if (k === 'down') { let b = 22; drag = null; for (const [n, p] of Object.entries(pos)) { const q = px(p), d = Math.hypot(q[0] - x, q[1] - y); if (d < b) { b = d; drag = n; } } }
    else if (k === 'move' && drag) { pos[drag] = [X0 + ((x - g.L) / g.W) * (X1 - X0), Y1 - ((y - g.T) / g.H) * (Y1 - Y0)]; show(); }
    else if (k === 'up') drag = null;
  }, (x, y) => Object.values(pos).some((p) => { const q = px(p); return Math.hypot(q[0] - x, q[1] - y) < 22; }));
  const result = () => { const [a, b, c] = SETS[set].map((n) => pos[n]); const r = [a[0] - b[0] + c[0], a[1] - b[1] + c[1]];
    const d = Object.entries(pos).filter(([n]) => !SETS[set].includes(n)).map(([n, p]) => [n, Math.hypot(p[0] - r[0], p[1] - r[1])]).sort((m, n) => m[1] - n[1]); return { r, d }; };
  function show() { const { d } = result(), [a, b, c] = SETS[set]; out.innerHTML = `<b>${a} − ${b} + ${c}</b>: take the arrow from ${b} to ${a}, and walk it from ${c}. You land closest to <b>${d[0][0]}</b> (distance ${d[0][1].toFixed(2)}); next is ${d[1][0]} (${d[1][1].toFixed(2)}). Real embeddings have hundreds of directions, not two, but the same trick works.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    g.W = w - 16; g.H = h - 44; title(ctx, 'Drag a word to move it', col);
    const [A, B, C] = SETS[set].map((n) => px(pos[n])), { r, d } = result(), R = px(r);
    ctx.save(); ctx.strokeStyle = col.line; ctx.strokeRect(g.L, g.T, g.W, g.H); ctx.restore();
    arrow(ctx, B[0], B[1], A[0], A[1], col.s[0], 2.5); arrow(ctx, C[0], C[1], R[0], R[1], col.s[1], 2.5);
    ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(B[0], B[1]); ctx.lineTo(C[0], C[1]); ctx.moveTo(A[0], A[1]); ctx.lineTo(R[0], R[1]); ctx.stroke(); ctx.restore();
    Object.entries(pos).forEach(([n, p]) => { const q = px(p), hit = n === d[0][0], used = SETS[set].includes(n);
      dot(ctx, q[0], q[1], used ? 5 : 4, used ? col.s[0] : hit ? col.good : col.muted);
      text(ctx, n, q[0], q[1] + 13, { color: used || hit ? col.ink : col.muted, size: 10.5, weight: used || hit ? 700 : 400, align: 'center', halo: col.panel }); });
    ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(R[0], R[1], 8, 0, 7); ctx.stroke(); ctx.restore();
    text(ctx, 'result', R[0] + 10, R[1] - 10, { color: col.s[1], size: 10.5, weight: 700 });
  };
  show();
}
