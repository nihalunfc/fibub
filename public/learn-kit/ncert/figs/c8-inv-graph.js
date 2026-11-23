// Class 8 Science, Investigating: a graph shows a pattern in measurements. A spring stretches in proportion to the load
// (extension about 1.5 cm for each 100 g) but every real reading wobbles a little. Show the best-fit line, and see how
// one careless reading (an outlier) stands out. Values are made up for the picture (seeded, so always the same).
import { canvas, axes, line, dot, text, title, row, button, rng } from '../../kit.js';

export default function (host) {
  let showLine = false, odd = false, avg = false;
  const R = rng(7), loads = [100, 200, 300, 400, 500, 600];
  const noise = loads.map(() => (R() - 0.5) * 1.1), noise2 = loads.map(() => (R() - 0.5) * 1.1);
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Graph of spring extension against load with points and a best-fit line' });
  const ctl = row(host);
  const b1 = button(ctl, 'Draw best-fit line', () => { showLine = !showLine; b1.textContent = showLine ? 'Hide line' : 'Draw best-fit line'; cv.redraw(); });
  const b2 = button(ctl, 'Add a careless reading', () => { odd = !odd; b2.textContent = odd ? 'Remove careless reading' : 'Add a careless reading'; cv.redraw(); });
  const b3 = button(ctl, 'Use the mean of 2 readings', () => { avg = !avg; b3.textContent = avg ? 'Use single readings' : 'Use the mean of 2 readings'; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Spring stretch against load', col);
    const g = axes(ctx, w, h, col, { x: [0, 700], y: [0, 12], xlabel: 'load (g)', ylabel: 'extension (cm)', t: 30 });
    const { X, Y } = g;
    const pts = loads.map((l, i) => { let y = l * 0.015 + (avg ? (noise[i] + noise2[i]) / 2 : noise[i]); if (odd && i === 3) y += 2.6; return [l, y]; });
    if (showLine) { line(ctx, [[X(0), Y(0)], [X(700), Y(10.5)]], col.s[2], 2.2, [6, 4]); text(ctx, 'best-fit line', X(700) - 4, Y(10.5) - 12, { color: col.s[2], size: 10.5, align: 'right' }); }
    pts.forEach(([l, y], i) => { const o = odd && i === 3; dot(ctx, X(l), Y(y), 5, o ? col.bad : col.s[0]); if (o) text(ctx, 'odd one out', X(l) + 8, Y(y) - 8, { color: col.bad, size: 10.5 }); });
  };
  cv.redraw();
}
