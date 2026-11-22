// 2.2 Prime factor tree: type a number and watch it split into primes; the factor count and all factors follow.
import { canvas, text, line, row, slider, readout, title } from '../../kit.js';
const split = (n) => { for (let p = 2; p * p <= n; p++) if (n % p === 0) return [p, n / p]; return null; };
export default function (host, { data }) {
  const cv = canvas(host, { aspect: 0.55, max: 340, min: 240, label: 'A factor tree splitting a number into primes' });
  let n = +(data.n || 360);
  const ctl = row(host);
  slider(ctl, { label: 'Number', min: 12, max: 1000, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); cv.redraw(); say(); } });
  const out = readout(host);
  const say = () => {
    const pw = new Map(); let m = n; for (let p = 2; p * p <= m; p++) while (m % p === 0) { pw.set(p, (pw.get(p) || 0) + 1); m /= p; } if (m > 1) pw.set(m, (pw.get(m) || 0) + 1);
    const fs = []; for (let i = 1; i <= n; i++) if (n % i === 0) fs.push(i);
    const pf = [...pw].map(([p, e]) => (e > 1 ? `${p}<sup>${e}</sup>` : p)).join(' × ');
    out.innerHTML = `${n} = <b>${pf}</b>. Number of factors = ${[...pw.values()].map((e) => `(${e}+1)`).join(' × ')} = <b>${fs.length}</b>: ${fs.join(', ')}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    // a chain that leans right: each composite splits into its smallest prime (left, circled) and the rest (right)
    const chain = []; let v = n, s2;
    while ((s2 = split(v))) { chain.push([v, s2[0]]); v = s2[1]; }
    const levels = chain.length + 1, top = 46, dy = Math.min(40, (h - top - 30) / Math.max(1, levels - 1));
    const dx = Math.min(46, (w * 0.7) / Math.max(1, levels)), x0 = Math.max(40, w * 0.12);
    const ring = (x, y) => { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.stroke(); };
    chain.forEach(([c, p], i) => {
      const x = x0 + i * dx, y = top + i * dy, yn = y + dy;
      text(ctx, String(c), x, y, { color: col.ink, size: 13, align: 'center', halo: col.panel });
      line(ctx, [[x - 5, y + 9], [x - dx * 0.55, yn - 11]], col.line, 1.5);
      line(ctx, [[x + 5, y + 9], [x + dx - 4, yn - 11]], col.line, 1.5);
      text(ctx, String(p), x - dx * 0.6, yn, { color: col.s[2], size: 13, weight: 700, align: 'center' }); ring(x - dx * 0.6, yn);
    });
    const xl = x0 + chain.length * dx, yl = top + chain.length * dy;
    text(ctx, String(v), xl, yl, { color: col.s[2], size: 13, weight: 700, align: 'center' }); ring(xl, yl);
    text(ctx, 'Circled = prime: the tree stops there.', w - 12, h - 12, { color: col.muted, size: 10.5, align: 'right' });
    title(ctx, 'Split off the smallest prime until only primes are left', col);
  };
  cv.redraw(); say();
}
