// Class 11 Maths, Combinations: nCr read from Pascal's triangle. Each entry is the sum of the two above it
// (nCr = (n−1)C(r−1) + (n−1)Cr), and row n lists nC0, nC1, ..., nCn. The triangle is symmetric: nCr = nC(n−r).
// Tap an entry to see its two parents light up, with the formula n!/(r!(n−r)!) worked out.
import { canvas, row, slider, readout, text, title, touchGuard } from '../../kit.js';

const C = (n, r) => { let v = 1; for (let i = 1; i <= r; i++) v = (v * (n - r + i)) / i; return Math.round(v); };
export default function (host) {
  let N = 6, sel = [5, 2], pos = [];
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'Pascal triangle where tapping an entry shows the two entries above it that add up to it' });
  const c1 = row(host), out = readout(host);
  slider(c1, { label: 'rows', min: 3, max: 9, step: 1, value: N, fmt: String, oninput: (v) => { N = v; if (sel[0] > N) sel = [N, Math.floor(N / 2)]; re(); } });
  const re = () => { cv.redraw(); const [n, r] = sel; out.innerHTML = `${n}C${r} = ${n}!/(${r}! × ${n - r}!) = <b>${C(n, r)}</b>.${n > 0 && r > 0 && r < n ? ` It is ${C(n - 1, r - 1)} + ${C(n - 1, r)} from the row above (${n - 1}C${r - 1} + ${n - 1}C${r}).` : ' The edges of the triangle are always 1.'} By symmetry ${n}C${r} = ${n}C${n - r}.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, "Pascal's triangle: tap an entry", col), rows = N + 1, rh = (h - top - 8) / rows, cw = Math.min(40, (w - 16) / rows); pos = [];
    for (let n = 0; n <= N; n++) for (let r = 0; r <= n; r++) {
      const x = w / 2 + (r - n / 2) * cw, y = top + 8 + (n + 0.5) * rh, isSel = sel[0] === n && sel[1] === r, par = sel[0] - 1 === n && (sel[1] === r || sel[1] - 1 === r) && sel[1] > 0 && sel[1] < sel[0], sym = sel[0] === n && sel[0] - sel[1] === r && r !== sel[1];
      pos.push([n, r, x, y]);
      if (isSel || par || sym) { ctx.fillStyle = isSel ? col.s[1] : par ? col.s[0] : col.s[2]; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.arc(x, y, Math.min(cw / 2 - 1, rh / 2 + 3), 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
      text(ctx, String(C(n, r)), x, y, { color: isSel ? col.s[1] : col.ink, size: Math.max(10, Math.min(14, cw / 2.6 * (String(C(n, r)).length > 2 ? 0.8 : 1))), weight: isSel ? 700 : 500, align: 'center' });
    }
    text(ctx, 'row n, entry r = nCr (counting from 0)', w / 2, h - 6, { color: col.muted, size: 10.5, align: 'center' });
  };
  const hit = (x, y) => { let b = null, bd = 1e9; for (const p of pos) { const d = Math.hypot(p[2] - x, p[3] - y); if (d < bd) { bd = d; b = p; } } return bd < 26 ? b : null; };
  cv.c.addEventListener('pointerdown', (e) => { const r = cv.c.getBoundingClientRect(), b = hit(e.clientX - r.left, e.clientY - r.top); if (b) { sel = [b[0], b[1]]; re(); } });
  re();
}
