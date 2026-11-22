// Class 9 Sequences: matchstick patterns. A row of n triangles needs 2n + 1 sticks and a row of n squares needs
// 3n + 1. Each extra shape adds a fixed number of sticks (the common difference), so the counts form an AP.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const K = { tri: { name: 'Triangles', a: 3, d: 2, rule: '2n + 1' }, sq: { name: 'Squares', a: 4, d: 3, rule: '3n + 1' } };
export default function (host) {
  let k = 'tri', n = 4;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'A row of triangles or squares made from matchsticks and the number of sticks used' });
  const ctl = row(host);
  choice(ctl, 'Shape', Object.entries(K).map(([i, d]) => [i, d.name]), k, (v) => { k = v; sync(); });
  slider(ctl, { label: 'Number of shapes n', min: 1, max: 8, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; sync(); } });
  const out = readout(host);
  function sync() { const d = K[k], c = d.a + (n - 1) * d.d; out.innerHTML = `${n} ${d.name.toLowerCase()} use <b>${c}</b> sticks. Each new one adds ${d.d} sticks, so the counts ${Array.from({ length: Math.min(n, 6) }, (_, i) => d.a + i * d.d).join(', ')}${n > 6 ? ', ...' : ''} form an AP with first term ${d.a} and common difference ${d.d}. The rule is sticks = <b>${d.rule}</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const d = K[k], top = title(ctx, 'A row of ' + n + ' ' + d.name.toLowerCase(), col), s = Math.min((w - 40) / (k === 'tri' ? (n + 1) / 2 + 0.01 : n), 70, (h - top - 50) / (k === 'tri' ? 0.9 : 1.2)), total = k === 'tri' ? ((n + 1) / 2) * s : n * s, ox = (w - total) / 2, y1 = top + (h - top - 30) / 2 + (k === 'tri' ? s * 0.87 : s) / 2, stick = (x0, y0, x1, y1, c) => { ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.lineCap = 'butt'; };
    for (let i = 0; i < n; i++) {
      const c = i === n - 1 ? col.s[2] : col.s[0];
      if (k === 'tri') {
        const bx = ox + (i * s) / 2, up = i % 2 === 0;
        if (i === 0) stick(bx, y1, bx + s, y1, c);
        if (up) { stick(bx, y1, bx + s / 2, y1 - s * 0.87, c); stick(bx + s / 2, y1 - s * 0.87, bx + s, y1, c); if (i > 0) stick(bx, y1, bx + s, y1, c); }
        else { stick(bx, y1 - s * 0.87, bx + s, y1 - s * 0.87, c); stick(bx, y1 - s * 0.87, bx + s / 2, y1, c); stick(bx + s / 2, y1, bx + s, y1 - s * 0.87, c); }
      } else {
        const bx = ox + i * s;
        if (i === 0) stick(bx, y1 - s, bx, y1, c);
        stick(bx, y1 - s, bx + s, y1 - s, c); stick(bx, y1, bx + s, y1, c); stick(bx + s, y1 - s, bx + s, y1, c);
      }
    }
    text(ctx, K[k].a + (n - 1) * K[k].d + ' sticks', w / 2, h - 16, { color: col.ink, size: 15, weight: 700, align: 'center' });
  };
  sync();
}
