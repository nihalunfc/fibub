// Class 10 Heredity: variation accumulates down the generations. Each time DNA is copied there is a small chance of a
// change. After g rounds of copying, the number of changes in a descendant follows a binomial pattern: most descendants carry
// few changes, a few carry more. Expected number with k changes = 2^g * C(g,k) p^k (1-p)^(g-k).
import { canvas, text, title, line, row, slider, readout } from '../../kit.js';

const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
export default function (host) {
  let g = 4, p = 0.2;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'Bar chart: how many descendants carry 0, 1, 2 or more DNA changes after several generations of copying' });
  const ctl = row(host);
  slider(ctl, { label: 'Generations', min: 0, max: 10, step: 1, value: g, fmt: (v) => String(v), oninput: (v) => { g = Math.round(v); say(); } });
  slider(ctl, { label: 'Chance of a change per copy', min: 0.02, max: 0.5, step: 0.01, value: p, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { p = v; say(); } });
  const out = readout(host);
  const dist = () => Array.from({ length: g + 1 }, (_, k) => Math.pow(2, g) * C(g, k) * Math.pow(p, k) * Math.pow(1 - p, g - k));
  function say() { const d = dist(), N = Math.pow(2, g); out.textContent = `After ${g} generations of two offspring each, there are ${N.toLocaleString('en-IN')} descendants. About ${Math.round(d[0]).toLocaleString('en-IN')} are still exact copies of the ancestor; the rest carry one or more changes. No two lines of descent are quite alike.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Changes pile up down the generations', col) + 14, gx = 40, gy = top + 6, gw = w - gx - 12, gh = h - gy - 54, d = dist(), mx = Math.max(...d, 1);
    line(ctx, [[gx, gy], [gx, gy + gh], [gx + gw, gy + gh]], col.line, 1.5);
    const bw = gw / (g + 1);
    d.forEach((v, k) => { const bh = (v / mx) * gh, x = gx + k * bw + bw * 0.12; ctx.fillStyle = k === 0 ? col.s[2] : col.s[0]; ctx.fillRect(x, gy + gh - bh, bw * 0.76, bh); if (bw > 22) text(ctx, String(k), x + bw * 0.38, gy + gh + 11, { color: col.muted, size: 10, align: 'center' }); if (bh > 14 && bw > 26) text(ctx, v >= 10 ? String(Math.round(v)) : v.toFixed(1), x + bw * 0.38, gy + gh - bh - 7, { color: col.ink, size: 9, align: 'center' }); });
    if (bw <= 22) { [0, g].forEach((k) => text(ctx, String(k), gx + k * bw + bw / 2, gy + gh + 11, { color: col.muted, size: 10, align: 'center' })); }
    text(ctx, 'number of DNA changes in a descendant', gx + gw / 2, gy + gh + 26, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'organisms', 6, gy - 6, { color: col.muted, size: 10 });
    text(ctx, 'green bar = exact copies of the ancestor', w / 2, h - 10, { color: col.muted, size: 10, align: 'center' });
  };
  say();
}
