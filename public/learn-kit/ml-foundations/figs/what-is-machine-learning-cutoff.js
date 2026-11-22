// 1.1 Training the smallest learning machine, step by step: eight students on an hours line, a cut-off
// "pass if hours >= c" tried at c = 2, 4 and 6, with the wrong predictions ringed and counted.
import { canvas, text, title, line, dot, ease, loop, calm } from '../../kit.js';

const S = [[1, 0], [2, 0], [3, 1], [4, 0], [5, 0], [6, 1], [7, 1], [8, 1]]; // [hours, passed?]
const CUT = [null, 2, 4, 6, 6];
export default function (host) {
  const cv = canvas(host, { aspect: 0.42, max: 260, min: 200, label: 'Eight students on a line of study hours, with a cut-off being tried' });
  let step = 0, k = 1, from = 2;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt * 1.2); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const L = 30, R = w - 24, y0 = h * 0.56, X = (v) => L + (v / 9) * (R - L);
    line(ctx, [[L, y0], [R, y0]], col.line, 2);
    for (let v = 0; v <= 9; v++) text(ctx, String(v), X(v), y0 + 30, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'hours studied', (L + R) / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
    const c = CUT[step];
    let wrong = 0;
    for (const [hrs, ok] of S) {
      const miss = c != null && (hrs >= c ? 1 : 0) !== ok;
      if (miss) wrong++;
      dot(ctx, X(hrs), y0, 7, ok ? col.s[0] : col.s[1], miss ? col.bad || col.ink : null);
      text(ctx, ok ? 'P' : 'F', X(hrs), y0 - 17, { color: col.ink, size: 11, weight: 700, align: 'center' });
    }
    if (c != null) {
      const cx = X(from + (c - from) * ease(k)) - 0.5 * (R - L) / 9;
      line(ctx, [[cx, y0 - 44], [cx, y0 + 16]], col.ink, 2, [5, 4]);
      text(ctx, `c = ${c}`, cx, y0 - 52, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
      if (k >= 1) text(ctx, `${wrong} mistake${wrong === 1 ? '' : 's'}${step === 4 ? ' (the fewest: keep c = 6)' : ''}`, (L + R) / 2, 44, { color: col.ink, size: 13, weight: 700, align: 'center' });
    } else text(ctx, 'P = passed, F = failed', (L + R) / 2, 44, { color: col.muted, size: 12, align: 'center' });
    title(ctx, 'Rule: predict pass if hours ≥ c', col);
  };
  cv.redraw();
  return { step(i) { from = CUT[step] ?? 2; step = Math.min(i, CUT.length - 1); k = calm() || from === CUT[step] ? 1 : 0; cv.redraw(); anim.play(); } };
}
