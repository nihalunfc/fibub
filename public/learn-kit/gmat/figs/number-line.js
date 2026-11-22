// 3.3 Absolute value as distance: |x − c| < d is every point less than d away from c.
import { canvas, text, line, dot, row, slider, choice, readout, title } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.3, max: 190, min: 150, label: 'An absolute value inequality on a number line' });
  let c = 3, d = 5, rel = '<';
  const ctl = row(host), f = (v) => String(Math.round(v));
  slider(ctl, { label: 'Centre c', min: -6, max: 6, step: 1, value: c, fmt: f, oninput: (v) => { c = Math.round(v); go(); } });
  slider(ctl, { label: 'Distance d', min: 1, max: 6, step: 1, value: d, fmt: f, oninput: (v) => { d = Math.round(v); go(); } });
  choice(ctl, 'Sign', [['<', '<'], ['≤', '≤'], ['>', '>']], rel, (v) => { rel = v; go(); });
  const out = readout(host);
  const go = () => { cv.redraw(); const cnt = rel === '<' ? 2 * d - 1 : 2 * d + 1; out.innerHTML = rel === '>' ? `|x − ${c}| &gt; ${d} means x &lt; ${c - d} or x &gt; ${c + d}: more than ${d} away from ${c}, in either direction.` : `|x − ${c}| ${rel === '<' ? '&lt;' : '≤'} ${d} means ${c - d} ${rel === '<' ? '&lt;' : '≤'} x ${rel === '<' ? '&lt;' : '≤'} ${c + d}. It holds <b>${cnt}</b> integers.`; };
  cv.draw = (ctx, w, h, col) => {
    const L = 20, R = w - 20, y = h * 0.55, X = (v) => L + ((v + 13) / 26) * (R - L);
    line(ctx, [[L, y], [R, y]], col.line, 2);
    for (let v = -12; v <= 12; v++) { line(ctx, [[X(v), y - 4], [X(v), y + 4]], col.line, 1); if (v % 2 === 0 || w > 520) text(ctx, String(v), X(v), y + 16, { color: col.muted, size: 10, align: 'center' }); }
    const segs = rel === '>' ? [[-13, c - d], [c + d, 13]] : [[c - d, c + d]];
    for (const [a, b] of segs) line(ctx, [[X(a), y], [X(b), y]], col.s[0], 6);
    for (let v = -12; v <= 12; v++) { const dist = Math.abs(v - c), inn = rel === '<' ? dist < d : rel === '≤' ? dist <= d : dist > d; if (inn) dot(ctx, X(v), y, 3.5, col.ink); }
    for (const e of [c - d, c + d]) dot(ctx, X(e), y, 6, rel === '≤' ? col.s[0] : col.panel, col.s[0]);
    dot(ctx, X(c), y - 22, 4, col.s[1]); text(ctx, `centre ${c}`, X(c), y - 34, { color: col.ink, size: 11, align: 'center' });
    title(ctx, 'Open circle = end point not included; filled = included', col);
  };
  go();
}
