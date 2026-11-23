// Class 12 Maths, Relations: "same remainder when divided by n" is an equivalence relation. It cuts the numbers 1 to 12 into n
// classes with no overlap (a partition). Slide n, tap a number to see everything related to it.
import { canvas, text, title, slider, row, dot, readout } from '../../kit.js';

export default function (host) {
  let n = 3, sel = 5; const pos = [];
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'The numbers 1 to 12 grouped into classes by their remainder on division by n' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `a ~ b when a and b leave the same remainder on dividing by ${n}`, col);
    const per = n <= 3 ? n : n <= 4 ? 2 : 3, rows = Math.ceil(n / per), bw = (w - 20) / per, bh = (h - top - 12) / rows;
    pos.length = 0;
    for (let r = 0; r < n; r++) {
      const bx = 10 + (r % per) * bw, by = top + 6 + Math.floor(r / per) * bh, c = col.s[r % 8];
      ctx.fillStyle = c; ctx.globalAlpha = 0.14; ctx.fillRect(bx + 3, by + 3, bw - 6, bh - 6); ctx.globalAlpha = 1;
      ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);
      text(ctx, `remainder ${r}`, bx + 8, by + 14, { color: col.muted, size: 10.5 });
      const members = []; for (let v = 1; v <= 12; v++) if (v % n === r) members.push(v);
      const cols = Math.max(1, Math.floor((bw - 16) / 26));
      members.forEach((v, i) => {
        const x = bx + 20 + (i % cols) * 26, y = by + 36 + Math.floor(i / cols) * 26, on = v % n === sel % n;
        pos.push([x, y, v]);
        dot(ctx, x, y, 11, on ? c : col.panel, c);
        text(ctx, String(v), x, y, { color: on ? col.panel : col.ink, size: 11, weight: 700, align: 'center' });
      });
    }
    out.textContent = `Class of ${sel}: ${[...Array(12)].map((_, i) => i + 1).filter((v) => v % n === sel % n).join(', ')}. There ${n === 1 ? "is 1 class" : "are " + n + " classes"}; every number is in exactly one.`;
  };
  cv.c.addEventListener('pointerdown', (e) => {
    const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
    const p = pos.find(([px, py]) => Math.hypot(px - x, py - y) < 14); if (p) { sel = p[2]; cv.redraw(); }
  });
  slider(row(host), { label: 'n', min: 1, max: 6, step: 1, value: 3, fmt: (v) => String(v), oninput: (v) => { n = v; cv.redraw(); } });
  cv.redraw();
}
