// Class 9 Two Variables, One Line: a real equation. A chai costs 10 rupees and a samosa 15, and the whole budget is spent: 10x + 15y = budget.
// On the graph every point of the line is a mathematical solution, but only the whole-number points can really be bought.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';
import { plane, drawPlane, drawLine, pt } from './c9-line-lib.js';

export default function (host) {
  let B = 120, show = 'whole';
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'The line 10x + 15y = budget with the whole-number solutions marked' });
  const ctl = row(host);
  slider(ctl, { label: 'Budget', min: 60, max: 180, step: 30, value: B, fmt: (v) => '₹ ' + v, oninput: (v) => { B = v; sync(); } });
  choice(ctl, 'Show', [['whole', 'Only whole items'], ['all', 'Every point of the line']], show, (v) => { show = v; sync(); });
  const out = readout(host);
  const sols = () => { const r = []; for (let x = 0; 10 * x <= B; x++) { const y = (B - 10 * x) / 15; if (Number.isInteger(y)) r.push([x, y]); } return r; };
  function sync() { const s = sols(); out.innerHTML = `With ₹ ${B}: 10x + 15y = ${B}, x chai and y samosas. You can really buy: ${s.map(([x, y]) => `${x} chai + ${y} samosa`).join('; ')}. That is ${s.length} real solutions, but the line has endless points: (1, ${+((B - 10) / 15).toFixed(2)}) satisfies the equation, but nobody sells a part of a samosa.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, '10x + 15y = ' + B, col), v = plane(w, h, top, -1, 19, -1, 13);
    drawPlane(ctx, v, col); drawLine(ctx, v, 10, 15, B, col.s[0], show === 'all' ? 3.5 : 1.5, show === 'all' ? undefined : [4, 5]);
    sols().forEach(([x, y]) => pt(ctx, v, x, y, col.s[1], 6, col.ink));
    text(ctx, 'chai →', v.X(v.x1) - 2, v.Y(0) + 22, { color: col.muted, size: 10, align: 'right' }); text(ctx, 'samosa ↑ (y)', v.X(0) + 18, v.Y(v.y1) + 8, { color: col.muted, size: 10 });
  };
  sync();
}
