// Class 9 Coordinates: reading a town map in two ways. Cell names (like C4) name a whole square; coordinates (x, y) name an exact
// crossing. Pick two places to see the walk along the streets (|dx| + |dy| blocks) against the straight line (Pythagoras).
import { canvas, text, title, row, choice, readout, dot, line } from '../../kit.js';

const num = (v) => String(v).replace('-', '−');
const P = { School: [1, 6], Temple: [5, 7], Market: [3, 3], Station: [7, 2], Park: [6, 5] };
const L = 'ABCDEFGH';
export default function (host) {
  let a = 'School', b = 'Station', view = 'c';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A town map with five places, shown with cell names or coordinates, and the street path and straight line between two places' });
  const ctl = row(host);
  choice(ctl, 'Labels', [['c', 'Cell names'], ['x', 'Coordinates']], view, (v) => { view = v; upd(); });
  const c1 = row(host); choice(c1, 'From', Object.keys(P).map((k) => [k, k]), a, (v) => { a = v; upd(); });
  const c2 = row(host); choice(c2, 'To', Object.keys(P).map((k) => [k, k]), b, (v) => { b = v; upd(); });
  const out = readout(host);
  const ref = (p) => (view === 'c' ? L[Math.min(7, p[0])] + (p[1] + 1) : '(' + p[0] + ', ' + p[1] + ')');
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, view === 'c' ? 'Cell names: column letter + row number' : 'Coordinates: (x, y) at the crossings', col);
    const top = t + 8, s = Math.min((w - 40) / 8, (h - top - 28) / 8), ox = (w - 8 * s) / 2 + 6, oy = top + 8 * s + 4;
    const X = (v) => ox + v * s, Y = (v) => oy - v * s;
    ctx.save(); ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(X(i), Y(0)); ctx.lineTo(X(i), Y(8)); ctx.moveTo(X(0), Y(i)); ctx.lineTo(X(8), Y(i)); ctx.stroke(); }
    ctx.restore();
    if (view === 'c') { for (let i = 0; i < 8; i++) { text(ctx, L[i], X(i + 0.5), Y(0) + 10, { color: col.muted, size: 11, align: 'center', weight: 700 }); text(ctx, String(i + 1), X(0) - 8, Y(i + 0.5), { color: col.muted, size: 11, align: 'right', weight: 700 }); } }
    else { for (let i = 0; i <= 8; i++) { text(ctx, String(i), X(i), Y(0) + 10, { color: col.muted, size: 10, align: 'center' }); text(ctx, String(i), X(0) - 6, Y(i), { color: col.muted, size: 10, align: 'right' }); } }
    const A = P[a], B = P[b];
    if (a !== b) {
      ctx.save(); ctx.setLineDash([6, 4]); line(ctx, [[X(A[0]), Y(A[1])], [X(B[0]), Y(A[1])], [X(B[0]), Y(B[1])]], col.s[0], 3); ctx.restore();
      line(ctx, [[X(A[0]), Y(A[1])], [X(B[0]), Y(B[1])]], col.s[5], 2.5);
    }
    let i = 0;
    for (const [k, p] of Object.entries(P)) {
      const cx = view === 'c' ? X(p[0] + 0.5) : X(p[0]), cy = view === 'c' ? Y(p[1] + 0.5) : Y(p[1]);
      dot(ctx, cx, cy, 7, k === a ? col.s[2] : k === b ? col.s[3] : col.s[7], col.ink);
      text(ctx, k + ' ' + ref(p), cx, cy - 13, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); i++;
    }
  };
  function upd() {
    const A = P[a], B = P[b], dx = Math.abs(A[0] - B[0]), dy = Math.abs(A[1] - B[1]), d = Math.hypot(dx, dy);
    out.innerHTML = a === b ? 'Pick two different places.' : `<b>${a}</b> ${ref(A)} to <b>${b}</b> ${ref(B)}. Along the streets: ${dx} + ${dy} = <b>${dx + dy}</b> blocks (dashed). In a straight line: √(${dx}² + ${dy}²) = <b>${(+d.toFixed(2))}</b> blocks. The straight line is never longer.`;
    cv.redraw();
  }
  upd();
}
