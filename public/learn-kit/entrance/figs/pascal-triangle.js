// Binomial theorem: Pascal's triangle up to row n (each number is the sum of the two above it), and below it the
// size of each term of (1 + x)ⁿ for a chosen x, so the reader sees the middle coefficient and the greatest term.
import { canvas, text, line, row, slider, readout, fmt } from '../../kit.js';

const C = (n, r) => { let c = 1; for (let i = 1; i <= r; i++) c = (c * (n - r + i)) / i; return Math.round(c); };

export default function (host) {
  let n = 6, x = 1;
  const cv = canvas(host, { aspect: 0.8, max: 460, min: 320, label: "Pascal's triangle and a bar chart of the terms of (1 + x) to the power n" });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'n', min: 1, max: 12, step: 1, value: n, oninput: (v) => { n = v; re(); } });
  slider(ctl, { label: 'x', min: 0.2, max: 4, step: 0.1, value: x, fmt: (v) => fmt(v, 2), oninput: (v) => { x = v; re(); } });
  const out = readout(host);
  const terms = () => Array.from({ length: n + 1 }, (_, r) => C(n, r) * x ** r);
  const greatest = () => { const t = terms(); const m = Math.max(...t); return t.map((v, i) => (Math.abs(v - m) < 1e-9 * m ? i : -1)).filter((i) => i >= 0); };
  const show = () => {
    const mid = n % 2 === 0 ? `one middle term, T${n / 2 + 1} (coefficient ${C(n, n / 2)})` : `two middle terms, T${(n + 1) / 2} and T${(n + 3) / 2} (coefficient ${C(n, (n - 1) / 2)})`;
    const g = greatest(), m = ((n + 1) * x) / (1 + x);
    out.innerHTML = `Row ${n} adds up to 2^${n} = ${2 ** n}. (1 + x)^${n} has ${n + 1} terms and ${mid}. With x = ${fmt(x, 2)}: (n + 1)x/(1 + x) = ${fmt(m, 4)}, so the greatest term is <b>${g.map((r) => 'T' + (r + 1)).join(' and ')}</b>${g.length > 1 ? ' (equal, because the test value is a whole number)' : ''}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = h * 0.5, rowH = (top - 24) / (n + 1), fs = Math.max(8, Math.min(13, rowH * 0.7, (w / (n + 2)) * 0.32));
    for (let i = 0; i <= n; i++) {
      for (let r = 0; r <= i; r++) {
        const cx = w / 2 + (r - i / 2) * Math.min(w / (n + 2), 44), cy = 20 + i * rowH + rowH / 2;
        text(ctx, String(C(i, r)), cx, cy, { color: i === n ? col.s[0] : col.muted, size: fs, weight: i === n ? 700 : 400, align: 'center', fit: false });
      }
    }
    // bars
    const t = terms(), m = Math.max(...t), g = greatest(), L = 30, R = w - 14, T = top + 18, B = h - 26, bw = (R - L) / (n + 1);
    line(ctx, [[L, B], [R, B]], col.muted, 1);
    text(ctx, `size of each term of (1 + x)^${n}`, L, T - 8, { color: col.ink, size: 12, weight: 700 });
    t.forEach((v, r) => {
      const bh = (v / m) * (B - T - 10), x0 = L + r * bw + bw * 0.15;
      ctx.fillStyle = g.includes(r) ? col.s[1] : col.s[0]; ctx.globalAlpha = g.includes(r) ? 1 : 0.6;
      ctx.fillRect(x0, B - bh, bw * 0.7, bh); ctx.globalAlpha = 1;
      text(ctx, 'T' + (r + 1), x0 + bw * 0.35, B + 12, { color: col.muted, size: Math.min(11, bw * 0.4), align: 'center', fit: false });
    });
  };
  re();
}
