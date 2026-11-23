// Class 8 A Square and a Cube: the last digit of a square can only be 0, 1, 4, 5, 6 or 9. Count the last digits of
// n squared for n = 1 to N; the digits 2, 3, 7 and 8 never appear, so a number ending in them is not a square.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let N = 30;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 270, label: 'Bar chart of how often each last digit appears among squares' });
  const out = readout(host); const ctl = row(host);
  slider(ctl, { label: 'Squares of 1 to', min: 5, max: 100, step: 1, value: N, fmt: (v) => Math.round(v), oninput: (v) => { N = Math.round(v); sync(); } });
  const cnt = () => { const c = Array(10).fill(0); for (let i = 1; i <= N; i++) c[(i * i) % 10]++; return c; };
  function sync() { const c = cnt(); out.innerHTML = `Among the squares of 1 to ${N}, last digits seen: <b>${c.map((v, d) => (v ? d : '')).filter((x) => x !== '').join(', ')}</b>. Never seen: <b>${c.map((v, d) => (v ? '' : d)).filter((x) => x !== '').join(', ')}</b>. So 2, 3, 7, 8 can never end a square.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Last digits of squares', col), c = cnt(), mx = Math.max(...c, 1), bw = (w - 40) / 10, base = h - 30, H = base - top - 24;
    c.forEach((v, d) => {
      const x = 20 + d * bw, bh = (v / mx) * H, ok = v > 0;
      ctx.fillStyle = ok ? col.s[0] : col.s[3]; ctx.fillRect(x + 4, base - Math.max(bh, ok ? 0 : 3), bw - 8, Math.max(bh, ok ? 0 : 3));
      text(ctx, String(d), x + bw / 2, base + 14, { color: col.ink, size: 13, weight: 700, align: 'center' });
      text(ctx, ok ? String(v) : '0', x + bw / 2, base - Math.max(bh, 3) - 8, { color: ok ? col.ink : col.s[3], size: 11, align: 'center' });
    });
  };
  sync();
}
