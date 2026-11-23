// Class 12 Maths, Functions: build an arrow diagram from set A to set B. Tap an element of A to move its arrow to the next element of B
// (or remove it). A function needs exactly one arrow from every element of A; one-one means no two arrows meet; onto means every B is hit.
import { canvas, text, title, row, slider, button, dot, arrow } from '../../kit.js';

export default function (host) {
  let m = 3, k = 3, f = [0, 1, 2]; const pa = [], pb = [];
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'An arrow diagram from set A to set B with tests for function, one-one and onto' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Tap an element of A to change where its arrow goes', col), ax = w * 0.25, bx = w * 0.75, y0 = top + 26, y1 = top + 26 + 170;
    pa.length = 0; pb.length = 0;
    const yA = (i) => y0 + ((i + 0.5) * (y1 - y0)) / m, yB = (j) => y0 + ((j + 0.5) * (y1 - y0)) / k;
    text(ctx, 'A', ax, y0 - 8, { color: col.muted, size: 12, weight: 700, align: 'center' }); text(ctx, 'B', bx, y0 - 8, { color: col.muted, size: 12, weight: 700, align: 'center' });
    for (let i = 0; i < m; i++) if (f[i] >= 0 && f[i] < k) arrow(ctx, ax + 14, yA(i), bx - 14, yB(f[i]), col.s[0], 1.8, 7);
    const hit = Array(k).fill(0); f.slice(0, m).forEach((v) => v >= 0 && v < k && hit[v]++);
    for (let i = 0; i < m; i++) { pa.push([ax, yA(i)]); dot(ctx, ax, yA(i), 12, f[i] >= 0 && f[i] < k ? col.panel : col.bad, col.ink); text(ctx, String(i + 1), ax, yA(i), { color: f[i] >= 0 && f[i] < k ? col.ink : col.panel, size: 11, weight: 700, align: 'center' }); }
    for (let j = 0; j < k; j++) { dot(ctx, bx, yB(j), 12, hit[j] === 0 ? col.soft : hit[j] > 1 ? col.s[2] : col.panel, col.ink); text(ctx, 'pqrstu'[j], bx, yB(j), { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    const isF = f.slice(0, m).every((v) => v >= 0 && v < k), one = isF && hit.every((v) => v <= 1), onto = isF && hit.every((v) => v >= 1);
    const L = [[isF, isF ? 'A function: every element of A has exactly one arrow' : 'Not a function: some element of A has no arrow (red)'], [one, one ? 'One-one: no two arrows end at the same point' : isF ? 'Not one-one: two arrows meet (orange dot)' : 'One-one: needs a function first'], [onto, onto ? 'Onto: every element of B is hit' : isF ? 'Not onto: a point of B is left empty (grey)' : 'Onto: needs a function first']];
    L.forEach(([ok, s], i) => text(ctx, (ok ? '✓ ' : '✗ ') + s, 10, y1 + 24 + i * 19, { color: ok ? col.good : col.bad, size: 11, weight: 600 }));
    text(ctx, isF && one && onto ? 'Bijective: one-one and onto, so it has an inverse' : isF && one ? 'One-one, not onto' : isF && onto ? 'Onto, not one-one' : '', 10, y1 + 24 + 3 * 19 + 4, { color: col.ink, size: 12, weight: 700 });
  };
  cv.c.addEventListener('pointerdown', (e) => {
    const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top, i = pa.findIndex(([px, py]) => Math.hypot(px - x, py - y) < 18);
    if (i >= 0) { f[i] = f[i] + 1 >= k ? -1 : f[i] + 1; cv.redraw(); }
  });
  const r = row(host);
  const fix = () => { f = f.slice(0, m); while (f.length < m) f.push(-1); f = f.map((v) => (v >= k ? -1 : v)); cv.redraw(); };
  slider(r, { label: 'Size of A', min: 2, max: 5, step: 1, value: 3, fmt: String, oninput: (v) => { m = v; fix(); } });
  slider(r, { label: 'Size of B', min: 2, max: 5, step: 1, value: 3, fmt: String, oninput: (v) => { k = v; fix(); } });
  button(r, 'Clear arrows', () => { f = Array(m).fill(-1); cv.redraw(); });
  cv.redraw();
}
