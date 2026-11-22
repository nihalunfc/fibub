// Small multiples. Eight lines on one chart tangle; the same eight in their own little panels do not. Switch between them,
// then choose whether the panels share one scale (fair comparison) or each get their own (shows each shape, but sizes
// mislead). Made-up weekly orders per store.
import { canvas, axes, line, text, title, row, choice, readout } from '../kit.js';
import { wob } from './_biz.js';

const N = ['North', 'South', 'East', 'West', 'Centre', 'Port', 'Hill', 'Lake'];
const D = N.map((n, s) => Array.from({ length: 20 }, (_, t) => (20 + s * s * 4) * (1 + 0.02 * t * (s % 3 - 1)) + 4 * wob(s * 20 + t)));
export default function (host) {
  let mode = 'multi', scale = 'same';
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 320, label: 'Eight store lines in one chart or in small panels' });
  const ctl = row(host);
  choice(ctl, 'Layout', [['one', 'One chart'], ['multi', 'Small multiples']], mode, (v) => { mode = v; cv.redraw(); show(); });
  choice(ctl, 'Scale', [['same', 'Same for all'], ['own', 'Each its own']], scale, (v) => { scale = v; cv.redraw(); show(); });
  const out = readout(host);
  function show() { out.innerHTML = mode === 'one' ? 'Eight lines cross and need a legend. You can follow one line only by hunting for its colour.' : scale === 'same' ? '<b>Same scale:</b> every panel is comparable, so you can see that Lake is far bigger than North, and which shapes are flat or rising.' : '<b>Own scale:</b> every shape is clear, but North now looks as big as Lake. Say so on the chart, or use the same scale when sizes matter.'; }
  cv.draw = (ctx, w, h, col) => {
    const all = D.flat(), lo = Math.min(...all), hi = Math.max(...all);
    if (mode === 'one') {
      title(ctx, 'Weekly orders by store', col);
      const a = axes(ctx, w, h, col, { t: 40, x: [1, 20], y: [0, hi * 1.05], xlabel: 'Week', l: 36 });
      D.forEach((d, s) => line(ctx, d.map((v, t) => [a.X(t + 1), a.Y(v)]), col.s[s % 8], 2));
      return;
    }
    title(ctx, 'Weekly orders, store by store', col);
    const cols = 4, gw = (w - 12) / cols, top = 36, gh = (h - top - 6) / 2;
    D.forEach((d, s) => {
      const x = 8 + (s % cols) * gw, y = top + Math.floor(s / cols) * gh, l = scale === 'same' ? 0 : Math.min(...d) * 0.9, u = scale === 'same' ? hi * 1.05 : Math.max(...d) * 1.05;
      ctx.strokeStyle = col.line; ctx.strokeRect(x, y + 12, gw - 8, gh - 22);
      text(ctx, N[s], x + 3, y + 5, { color: col.ink, size: 10.5, weight: 700, fit: false });
      line(ctx, d.map((v, t) => [x + 3 + (t / 19) * (gw - 14), y + gh - 12 - ((v - l) / (u - l)) * (gh - 28)]), col.s[0], 1.8);
      if (scale === 'own') text(ctx, Math.round(Math.max(...d)) + '', x + gw - 12, y + 5, { color: col.muted, size: 9, align: 'right', fit: false });
    });
    void lo;
  };
  show(); cv.redraw();
}
