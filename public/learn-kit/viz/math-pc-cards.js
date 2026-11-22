// Arrangements versus selections. Tap cards to pick r of the n. Permutations count the order you picked them in
// (ABC and CBA are different); combinations do not. Every group of r cards can be arranged in r! ways, which is why
// nPr = nCr × r!. Press "List all" to see the real list for small cases.
import { canvas, row, slider, button, readout, text } from '../kit.js';

const L = 'ABCDEFGH';
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
export default function (host) {
  let n = 5, r = 3, picked = [], listed = false;
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 190, label: 'Cards to pick for permutations and combinations' });
  const c = row(host);
  slider(c, { label: 'n cards', min: 3, max: 8, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = v; r = Math.min(r, n); picked = []; listed = false; cv.redraw(); show(); } });
  slider(c, { label: 'r chosen', min: 1, max: 5, step: 1, value: r, fmt: (v) => v, oninput: (v) => { r = Math.min(v, n); picked = []; listed = false; cv.redraw(); show(); } });
  const c2 = row(host);
  button(c2, 'Clear', () => { picked = []; cv.redraw(); show(); });
  button(c2, 'List all (combinations)', () => { listed = !listed; cv.redraw(); });
  const out = readout(host);
  const rects = () => Array.from({ length: n }, (_, i) => { const cw = Math.min(40, (cv.w - 20) / n - 4); return [10 + i * (cw + 4), 34, cw, cw * 1.35]; });
  cv.c.style.cursor = 'pointer';
  cv.c.addEventListener('click', (e) => { const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top; rects().forEach(([rx, ry, rw, rh], i) => { if (x >= rx && x <= rx + rw && y >= ry && y <= ry + rh) { const j = picked.indexOf(i); if (j >= 0) picked.splice(j, 1); else if (picked.length < r) picked.push(i); } }); cv.redraw(); show(); });
  const P = () => fact(n) / fact(n - r), C = () => P() / fact(r);
  function show() { out.innerHTML = `n = ${n}, r = ${r}. Order matters: ⁿPᵣ = ${n}!/${n - r}! = <b>${P()}</b>. Order does not matter: ⁿCᵣ = ⁿPᵣ / r! = ${P()} / ${fact(r)} = <b>${C()}</b>. ${picked.length === r ? `You picked <b>${picked.map((i) => L[i]).join('')}</b>: this one group can be lined up in ${fact(r)} different orders, e.g. ${picked.map((i) => L[i]).reverse().join('')}.` : `Pick ${r - picked.length} more card${r - picked.length === 1 ? '' : 's'}.`}`; }
  const combos = (m, k, s = 0, cur = [], out2 = []) => { if (cur.length === k) { out2.push(cur.map((i) => L[i]).join('')); return out2; } for (let i = s; i < m; i++) combos(m, k, i + 1, [...cur, i], out2); return out2; };
  cv.draw = (ctx, w, h, col) => {
    text(ctx, 'Tap cards to choose ' + r, 10, 14, { color: col.ink, size: 12, weight: 700 });
    rects().forEach(([x, y, cw, ch], i) => {
      const k = picked.indexOf(i), up = k >= 0; ctx.fillStyle = up ? col.s[0] : col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.roundRect(x, up ? y - 8 : y, cw, ch, 5); ctx.fill(); ctx.stroke();
      text(ctx, L[i], x + cw / 2, (up ? y - 8 : y) + ch / 2, { color: up ? col.bg : col.ink, size: 16, weight: 700, align: 'center' });
      if (up) text(ctx, String(k + 1), x + cw / 2, y + ch + 8, { color: col.s[1], size: 12, weight: 700, align: 'center' });
    });
    const y0 = 34 + Math.min(40, (w - 20) / n - 4) * 1.35 + 34;
    if (listed) {
      const list = combos(n, r), cw = 46, per = Math.max(1, Math.floor((w - 20) / cw));
      text(ctx, `${list.length} groups (each of the ${fact(r)} orders of a group is a different permutation)`, 10, y0 - 8, { color: col.muted, size: 11 });
      list.slice(0, per * Math.floor((h - y0) / 15)).forEach((s, i) => text(ctx, s, 12 + (i % per) * cw, y0 + 8 + Math.floor(i / per) * 15, { color: col.ink, size: 11, fit: false }));
    } else {
      const bw = w - 20, mx = P(); ctx.fillStyle = col.s[1]; ctx.fillRect(10, y0, bw, 14); ctx.fillStyle = col.s[0]; ctx.fillRect(10, y0 + 24, (bw * C()) / mx, 14);
      text(ctx, `ⁿPᵣ = ${P()}`, 14, y0 + 7, { color: col.ink, size: 11, weight: 700 }); text(ctx, `ⁿCᵣ = ${C()}`, 14, y0 + 31, { color: col.bg, size: 11, weight: 700 });
    }
  };
  show();
}
