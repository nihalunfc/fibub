// 5.4 Event-time tumbling windows of 5 minutes with a watermark of "latest event time seen minus 3 minutes".
// Events appear as they arrive; the watermark line moves; a window closes when the watermark passes its end;
// a very late event for a closed window goes to the late pile.
import { canvas, axes, text, title, line, dot } from '../../kit.js';

const L = 3;
// event time and arrival time, in minutes after 10:00
const EV = [{ t: 1, a: 1 }, { t: 3, a: 3.5 }, { t: 2, a: 6 }, { t: 6, a: 6.5 }, { t: 8, a: 8.5 }, { t: 9.5, a: 10 }, { t: 4, a: 12 }, { t: 11, a: 12.5 }];
const NOW = [3.6, 6.6, 10.2, 12.8];
const NAMES = ['Events land in their 5-minute window by event time', 'A late event still fits: its window is open', 'Watermark passes 10:05: the window is final', 'Too late: the event goes to the late pile'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.58, max: 330, min: 240, label: 'Tumbling windows on an event-time axis with a moving watermark' });
  let s = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, NAMES[s], col);
    const A = axes(ctx, w, h, col, { x: [0, 15], y: [0, 1], xt: [0, 5, 10, 15], fx: (v) => `10:${String(v).padStart(2, '0')}`, yt: [], xlabel: 'event time (when it happened)', l: 14, r: 14, t: top + 18, grid: false });
    const now = NOW[s], arrived = EV.filter((e) => e.a <= now);
    // watermark is computed event by event so we know which arrivals were too late
    let maxT = -1e9; const status = [];
    for (const e of arrived) { const wm = maxT - L, end = Math.floor(e.t / 5) * 5 + 5; status.push(end <= wm ? 'late' : 'ok'); maxT = Math.max(maxT, e.t); }
    const wm = maxT - L;
    for (let k = 0; k < 3; k++) {
      const closed = k * 5 + 5 <= wm, x0 = A.X(k * 5) + 2, x1 = A.X(k * 5 + 5) - 2;
      ctx.fillStyle = closed ? col.soft : col.panel; ctx.strokeStyle = closed ? col.s[0] : col.line; ctx.lineWidth = closed ? 2 : 1;
      ctx.beginPath(); ctx.roundRect(x0, A.T, x1 - x0, A.B - A.T - 4, 6); ctx.fill(); ctx.stroke();
      const cnt = arrived.filter((e, i) => status[i] === 'ok' && e.t >= k * 5 && e.t < k * 5 + 5).length;
      text(ctx, closed ? `final: ${cnt}` : `open: ${cnt}`, (x0 + x1) / 2, A.T + 14, { color: closed ? col.s[0] : col.muted, size: 11, weight: 700, align: 'center' });
    }
    arrived.forEach((e, i) => {
      const y = A.T + 34 + (i % 4) * ((A.B - A.T - 46) / 4);
      if (status[i] === 'late') { text(ctx, '✕ late', A.X(e.t), y, { color: col.bad, size: 11, weight: 700, align: 'center' }); return; }
      dot(ctx, A.X(e.t), y, 6, e.a - e.t > 1 ? col.s[2] : col.s[1]);
    });
    if (wm > 0) {
      line(ctx, [[A.X(wm), A.T - 6], [A.X(wm), A.B]], col.s[3], 2, [5, 4]);
      text(ctx, `watermark 10:${String(Math.floor(wm)).padStart(2, '0')}`, A.X(wm) + 4, A.T - 8, { color: col.s[3], size: 10.5, weight: 700 });
    }
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
