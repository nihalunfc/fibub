// Class 8 Quadrilaterals: the family tree of four-sided shapes. Tap a shape to see its rules; every shape also has all the
// rules of the shapes above it on its branch. A square is a rectangle, a rhombus and a parallelogram at once.
import { canvas, text, title, readout, touchGuard } from '../../kit.js';

const N = [
  { id: 'quad', t: 'Quadrilateral', x: 0.5, y: 0, up: null, r: 'Four sides, four angles adding to 360°, two diagonals.' },
  { id: 'trap', t: 'Trapezium', x: 0.17, y: 1, up: 'quad', r: 'One pair of parallel sides (rules above, plus this).' },
  { id: 'kite', t: 'Kite', x: 0.5, y: 1, up: 'quad', r: 'Two pairs of equal neighbouring sides; the diagonals cross at 90°.' },
  { id: 'para', t: 'Parallelogram', x: 0.83, y: 1, up: 'quad', r: 'Both pairs of opposite sides parallel and equal; opposite angles equal; diagonals bisect each other.' },
  { id: 'rect', t: 'Rectangle', x: 0.58, y: 2, up: 'para', r: 'A parallelogram with four right angles; the diagonals are equal.' },
  { id: 'rhom', t: 'Rhombus', x: 0.88, y: 2, up: 'para', r: 'A parallelogram with four equal sides; the diagonals cross at 90° and bisect the angles.' },
  { id: 'sq', t: 'Square', x: 0.73, y: 3, up: 'rect', up2: 'rhom', r: 'Four equal sides and four right angles: a rectangle and a rhombus together.' },
];
export default function (host) {
  let sel = 'sq', boxes = [];
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'Family tree of quadrilaterals: tap a shape' });
  const out = readout(host);
  const chain = (id) => { const s = new Set(); const f = (i) => { const n = N.find((x) => x.id === i); if (!n || s.has(i)) return; s.add(i); if (n.up) f(n.up); if (n.up2) f(n.up2); }; f(id); return s; };
  function sync() { const n = N.find((x) => x.id === sel), anc = [...chain(sel)].filter((i) => i !== sel).map((i) => N.find((x) => x.id === i).t); out.innerHTML = `<b>${n.t}</b>: ${n.r}${anc.length ? ` It also follows the rules of: ${anc.join(', ')}.` : ''}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Tap a shape in the family tree', col), bw = Math.min(100, w * 0.27), bh = 30, ys = (h - top - 30 - bh) / 3, ch = chain(sel); boxes = [];
    const pos = (n) => [Math.min(w - bw / 2 - 6, Math.max(bw / 2 + 6, n.x * w)), top + 14 + n.y * ys + bh / 2];
    N.forEach((n) => [n.up, n.up2].filter(Boolean).forEach((u) => { const a = pos(N.find((x) => x.id === u)), b = pos(n); const on = ch.has(n.id) && ch.has(u); ctx.strokeStyle = on ? col.s[3] : col.line; ctx.lineWidth = on ? 3 : 1.5; ctx.beginPath(); ctx.moveTo(a[0], a[1] + bh / 2); ctx.lineTo(b[0], b[1] - bh / 2); ctx.stroke(); }));
    N.forEach((n) => { const [x, y] = pos(n); boxes.push([n.id, x - bw / 2, y - bh / 2, bw, bh]); const on = n.id === sel, inch = ch.has(n.id); ctx.fillStyle = on ? col.s[3] : inch ? col.s[0] : col.soft; ctx.globalAlpha = on || inch ? 0.9 : 1; ctx.beginPath(); ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, 7); ctx.fill(); ctx.globalAlpha = 1; text(ctx, n.t, x, y, { color: on || inch ? col.panel : col.ink, size: 11.5, weight: 700, align: 'center' }); });
  };
  const hit = (x, y) => boxes.find((b) => x >= b[1] && x <= b[1] + b[3] && y >= b[2] && y <= b[2] + b[4]);
  touchGuard(cv.c, (x, y) => !!hit(x, y)); cv.c.style.cursor = 'pointer';
  cv.c.addEventListener('pointerdown', (e) => { const r = cv.c.getBoundingClientRect(), b = hit(e.clientX - r.left, e.clientY - r.top); if (b) { sel = b[0]; sync(); e.preventDefault(); } });
  sync();
}
