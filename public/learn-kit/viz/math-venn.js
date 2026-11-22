// Venn diagram of three sets with 16 items in the universe. Pick an operation (union, intersection, difference,
// complement, symmetric difference) or click regions yourself: the shaded part and the count n(...) follow, and the
// counting rule n(A∪B) = n(A) + n(B) − n(A∩B) is checked with real numbers.
import { canvas, text, row, choice, button, readout } from '../kit.js';

// region mask bits: 1 = in A, 2 = in B, 4 = in C; mask 0 is outside all three circles. Items per region:
const COUNT = [2, 3, 3, 2, 2, 1, 2, 1];
const OPS = {
  union: ['A ∪ B', (m) => m & 3], inter: ['A ∩ B', (m) => (m & 3) === 3], diff: ['A − B', (m) => (m & 1) && !(m & 2)],
  comp: ['A′ (not A)', (m) => !(m & 1)], sym: ['A △ B', (m) => ((m & 1) > 0) !== ((m & 2) > 0)], nor: ['(A ∪ B)′', (m) => !(m & 3)],
  all3: ['A ∩ B ∩ C', (m) => m === 7], any3: ['A ∪ B ∪ C', (m) => m > 0], bc: ['(A ∩ B) − C', (m) => m === 3],
};
export default function (host) {
  let sel = new Set([1, 3, 5, 7]), name = 'A (click regions to change)';
  const cv = canvas(host, { aspect: 0.72, max: 380, min: 260, label: 'Venn diagram of sets A, B and C with shaded regions' });
  const ctl = row(host);
  const setOp = (k) => { sel = new Set([0, 1, 2, 3, 4, 5, 6, 7].filter((m) => OPS[k][1](m))); name = OPS[k][0]; draw(); };
  choice(ctl, 'Operation', Object.entries(OPS).map(([k, v]) => [k, v[0]]), 'union', setOp);
  button(ctl, 'Clear', () => { sel = new Set(); name = 'your choice'; draw(); });
  const out = readout(host);
  let geo = null;
  const maskAt = (x, y) => { let m = 0; geo.c.forEach(([cx, cy], i) => { if ((x - cx) ** 2 + (y - cy) ** 2 <= geo.r ** 2) m |= 1 << i; }); return m; };
  cv.c.addEventListener('click', (e) => { const b = cv.c.getBoundingClientRect(), m = maskAt(e.clientX - b.left, e.clientY - b.top); sel.has(m) ? sel.delete(m) : sel.add(m); name = 'your choice'; draw(); });
  cv.c.style.cursor = 'pointer';
  function draw() { cv.redraw(); const n = (f) => COUNT.reduce((s, c, m) => s + (f(m) ? c : 0), 0); const nA = n((m) => m & 1), nB = n((m) => m & 2), nAB = n((m) => (m & 3) === 3), nU = n((m) => m & 3);
    out.innerHTML = `<b>${name}</b> has <b>${n((m) => sel.has(m))}</b> of the ${COUNT.reduce((s, c) => s + c, 0)} items. Check: n(A) = ${nA}, n(B) = ${nB}, n(A∩B) = ${nAB}, so n(A∪B) = ${nA} + ${nB} − ${nAB} = <b>${nA + nB - nAB}</b> (counted directly: ${nU}). Items outside every circle: ${COUNT[0]}.`; }
  cv.draw = (ctx, w, h, col) => {
    const R = Math.min(w * 0.25, h * 0.27), bx = 14, by = 28, bw = w - 28, bh = h - 40;
    const cx = w / 2, cy = by + bh * 0.43;
    geo = { r: R, c: [[cx - R * 0.55, cy - R * 0.4], [cx + R * 0.55, cy - R * 0.4], [cx, cy + R * 0.6]] };
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, bh);
    text(ctx, "U (16 items)", bx + 6, by + bh - 9, { color: col.muted, size: 11 });
    const cell = 3, cen = Array.from({ length: 8 }, () => [0, 0, 0]);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.38;
    for (let x = bx + 1; x < bx + bw; x += cell) for (let y = by + 1; y < by + bh; y += cell) {
      const m = maskAt(x + 1, y + 1); cen[m][0] += x; cen[m][1] += y; cen[m][2]++;
      if (sel.has(m)) ctx.fillRect(x, y, cell, cell);
    }
    ctx.globalAlpha = 1;
    geo.c.forEach(([x, y], i) => { ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.lineWidth = 2; ctx.strokeStyle = col.s[[0, 1, 2][i]]; ctx.stroke(); });
    [['A', 0], ['B', 1], ['C', 2]].forEach(([n, i]) => text(ctx, n, geo.c[i][0] + (i === 0 ? -R * 1.0 : i === 1 ? R * 1.0 : 0), geo.c[i][1] + (i === 2 ? R * 1.12 : -R * 0.95), { color: col.s[i], size: 14, weight: 700, align: 'center' }));
    cen.forEach((c, m) => { if (!c[2]) return; const x = m === 0 ? bx + bw - 18 : c[0] / c[2], y = m === 0 ? by + bh - 14 : c[1] / c[2]; text(ctx, String(COUNT[m]), x, y, { color: sel.has(m) ? col.ink : col.muted, size: 15, weight: 700, align: 'center' }); });
  };
  setOp('union');
}
