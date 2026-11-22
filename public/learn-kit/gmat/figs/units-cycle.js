// 2.4 Units digits of powers repeat: watch the last digit of b^1, b^2, b^3, ... go round its cycle.
import { canvas, text, row, choice, slider, readout, title } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.32, max: 200, min: 150, label: 'The repeating units digits of powers' });
  let b = 7, e = 43;
  const ctl = row(host);
  choice(ctl, 'Base ends in', [2, 3, 4, 7, 8, 9].map((v) => [v, String(v)]), b, (v) => { b = v; cv.redraw(); say(); });
  slider(ctl, { label: 'Power', min: 1, max: 99, step: 1, value: e, fmt: (v) => String(Math.round(v)), oninput: (v) => { e = Math.round(v); cv.redraw(); say(); } });
  const out = readout(host);
  const cyc = () => { const c = []; let x = b % 10; do { c.push(x); x = (x * b) % 10; } while (x !== c[0]); return c; };
  const say = () => { const c = cyc(), k = ((e - 1) % c.length); out.innerHTML = `Cycle length ${c.length}: ${c.join(', ')}. Power ${e} ÷ ${c.length} leaves remainder ${e % c.length}${e % c.length === 0 ? ' (so the last place in the cycle)' : ''}, so ${b}<sup>${e}</sup> ends in <b>${c[k]}</b>.`; };
  cv.draw = (ctx, w, h, col) => {
    const c = cyc(), n = Math.min(12, Math.floor((w - 20) / 48)), k = (e - 1) % c.length;
    for (let i = 0; i < n; i++) {
      const x = 24 + i * ((w - 48) / (n - 1)), on = i % c.length === k;
      ctx.fillStyle = on ? col.s[i % c.length] : col.soft; ctx.fillRect(x - 18, h / 2 - 18, 36, 36);
      text(ctx, String(c[i % c.length]), x, h / 2, { color: on ? col.panel : col.ink, size: 16, weight: 700, align: 'center' });
      text(ctx, `${b}^${i + 1}`, x, h / 2 + 32, { color: col.muted, size: 10.5, align: 'center' });
    }
    title(ctx, `Last digits of ${b}¹, ${b}², ${b}³, ...: the pattern repeats`, col);
  };
  cv.redraw(); say();
}
