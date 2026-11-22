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
    const levels = []; let cur = n, depth = 0;
    const pos = [];
    const draw = (v, x, y, span, d) => {
      const s = split(v);
      text(ctx, String(v), x, y, { color: s ? col.ink : col.s[2], size: 13, weight: s ? 500 : 700, align: 'center', halo: col.panel });
      if (!s) { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.stroke(); return; }
      const dy = Math.min(46, (h - 40) / 9), yl = y + dy;
      line(ctx, [[x - 6, y + 9], [x - span / 2 + 4, yl - 9]], col.line, 1.5);
      line(ctx, [[x + 6, y + 9], [x + span / 2 - 4, yl - 9]], col.line, 1.5);
      draw(s[0], x - span / 2, yl, Math.max(26, span * 0.15), d + 1);
      draw(s[1], x + span / 2, yl, span * 0.62, d + 1);
    };
    draw(n, w * 0.3, 40, Math.min(110, w * 0.2), 0);
    text(ctx, 'Circled numbers are prime: the tree stops there.', w - 12, h - 12, { color: col.muted, size: 10.5, align: 'right' });
    title(ctx, 'Split off the smallest prime until only primes are left', col);
  };
  cv.redraw(); say();
}
