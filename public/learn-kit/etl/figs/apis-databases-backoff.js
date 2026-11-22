// 1.6 Watch it happen: an API call that fails and retries with exponential backoff (1.5, 3, 6 s), then meets
// a 429 with Retry-After: 20, waits as told, and succeeds. The time line grows one attempt per step.
import { canvas, axes, text, title, dot, line, calm, ease, loop } from '../../kit.js';

const ATT = [
  { t: 0, code: '503', ok: false, wait: 1.5, why: 'base wait 1.5 s' },
  { t: 1.5, code: '503', ok: false, wait: 3, why: 'double: 3 s' },
  { t: 4.5, code: '502', ok: false, wait: 6, why: 'double: 6 s' },
  { t: 10.5, code: '429', ok: false, wait: 20, why: 'Retry-After: 20 beats the 12 s rule' },
  { t: 30.5, code: '200', ok: true, wait: 0, why: 'success: land the page raw' },
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 300, min: 230, label: 'A time line of API retries with growing waits' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.7); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Retries with backoff', col);
    const A = axes(ctx, w, h, col, { x: [0, 34], y: [0, 1], xlabel: 'seconds since the first try', yt: [], fy: () => '', l: 14, r: 16, t: 60, b: 40, grid: false });
    const yy = A.Y(0.45);
    line(ctx, [[A.X(0), yy], [A.X(34), yy]], col.line, 1);
    for (let i = 0; i <= step; i++) {
      const a = ATT[i], grow = i === step ? ease(k) : 1;
      if (i < step && a.wait) {
        ctx.save(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.22;
        ctx.fillRect(A.X(a.t), yy - 9, A.X(a.t + a.wait) - A.X(a.t), 18); ctx.restore();
        if (A.X(a.t + a.wait) - A.X(a.t) > 26) text(ctx, a.wait + ' s', (A.X(a.t) + A.X(a.t + a.wait)) / 2, yy, { color: col.ink, size: 10, align: 'center', fit: false });
      }
      dot(ctx, A.X(a.t), yy, 6 * grow + 0.5, a.ok ? col.good || col.s[2] : col.bad || col.s[1]);
      text(ctx, a.code, A.X(a.t), i % 2 ? yy + 20 : yy - 18, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    }
    const a = ATT[step];
    text(ctx, `Attempt ${step + 1}: ${a.code}${a.ok ? '' : ', wait ' + a.wait + ' s'}`, 10, 38, { color: col.ink, size: 12.5, weight: 700 });
    text(ctx, a.why, 10, 54, { color: col.muted, size: 11.5 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
