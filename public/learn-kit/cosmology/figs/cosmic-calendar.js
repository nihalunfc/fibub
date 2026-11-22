// 1.1 The cosmic calendar: 13.8 billion years squeezed into one year. Each step adds events; the last steps
// zoom into 31 December, then its final minute. Ages are rounded from the sources in the lesson.
import { canvas, text, line, dot, clamp, lerp, ease, calm, loop } from '../../kit.js';

const AGE = 13.8; // billion years
// [billion years ago, label, step it appears]
const EVENTS = [
  [13.8, 'Big Bang', 0],
  [13.4, 'First galaxies shine', 1],
  [10, 'Milky Way\'s disc settles', 1],
  [4.6, 'Sun and Earth form', 2],
  [3.8, 'First life on Earth', 2],
  [0.54, 'Animals with shells and bones', 3],
  [0.23, 'First dinosaurs', 3],
  [0.066, 'Dinosaurs die out', 3],
  [0.0003, 'Our species appears', 4],
  [0.000012, 'Farming begins', 5],
  [0.0000005, 'Telescopes (1609)', 5],
];
const DAY = 365.25;
const dayOf = (gya) => (1 - gya / AGE) * DAY; // day of the cosmic year (0 = 1 Jan 00:00)
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MDAYS = [31, 28.25, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function when(gya) {
  let d = dayOf(gya), m = 0;
  while (m < 11 && d >= MDAYS[m]) { d -= MDAYS[m]; m++; }
  const day = Math.floor(d) + 1, frac = d - Math.floor(d);
  const h = Math.floor(frac * 24), mi = Math.floor((frac * 24 - h) * 60), s = Math.round(((frac * 24 - h) * 60 - mi) * 60);
  if (m === 11 && day === 31) return `31 Dec, ${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${day} ${MONTHS[m]}`;
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 300, label: 'A one-year calendar with the history of the universe marked on it' });
  // view: [start day, end day] of the visible window
  const VIEWS = [[0, DAY], [0, DAY], [0, DAY], [0, DAY], [DAY - 1, DAY], [DAY - 1 / 1440, DAY]];
  let step = 0, view = [0, DAY], from = [0, DAY], k = 1;
  const anim = loop(host, (dt) => {
    if (k < 1) { k = Math.min(1, k + dt / 1.2); const e = ease(k); view = [lerp(from[0], VIEWS[step][0], e), lerp(from[1], VIEWS[step][1], e)]; cv.redraw(); }
  });
  cv.draw = (ctx, w, h, col) => {
    const L = 16, R = w - 16, Y = h * 0.3;
    const X = (d) => L + ((d - view[0]) / (view[1] - view[0])) * (R - L);
    // bar and its ticks
    ctx.fillStyle = col.soft; ctx.fillRect(L, Y - 14, R - L, 28);
    ctx.strokeStyle = col.line; ctx.strokeRect(L + 0.5, Y - 14.5, R - L, 28);
    const span = view[1] - view[0];
    ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    if (span > 30) {
      let d = 0;
      MDAYS.forEach((md, i) => { const x = X(d); line(ctx, [[x, Y - 14], [x, Y + 14]], col.line, 1); text(ctx, MONTHS[i], X(d + md / 2), Y, { color: col.muted, size: w < 420 ? 9 : 11, align: 'center' }); d += md; });
      text(ctx, 'One cosmic year = 13.8 billion years · one day ≈ 38 million years', w / 2, Y - 30, { color: col.ink, size: 12, weight: 600, align: 'center' });
    } else if (span > 0.01) {
      for (let hr = 0; hr <= 24; hr += 3) { const x = X(DAY - 1 + hr / 24); line(ctx, [[x, Y - 14], [x, Y + 14]], col.line, 1); text(ctx, `${hr}:00`, x, Y + 24, { color: col.muted, size: 10, align: 'center' }); }
      text(ctx, '31 December · one hour ≈ 1.6 million years', w / 2, Y - 30, { color: col.ink, size: 12, weight: 600, align: 'center' });
    } else {
      for (let s = 0; s <= 60; s += 10) { const x = X(DAY - (60 - s) / 86400); line(ctx, [[x, Y - 14], [x, Y + 14]], col.line, 1); text(ctx, `${s} s`, x, Y + 24, { color: col.muted, size: 10, align: 'center' }); }
      text(ctx, 'The last minute of 31 December · one second ≈ 440 years', w / 2, Y - 30, { color: col.ink, size: 12, weight: 600, align: 'center' });
    }
    // events: dots on the bar, labels stacked below
    const shown = EVENTS.filter((e) => e[2] <= step);
    const vis = shown.filter((e) => { const d = dayOf(e[0]); return d >= view[0] - 1e-9 && d <= view[1] + 1e-9; });
    let row = 0;
    const rowH = Math.min(22, (h - Y - 40) / Math.max(4, vis.length));
    for (const e of vis) {
      const x = clamp(X(dayOf(e[0])), L + 2, R - 2), ty = Y + 44 + row * rowH;
      const isNew = e[2] === step;
      const c = isNew ? col.s[0] : col.muted;
      line(ctx, [[x, Y + 6], [x, ty - 6]], c, 1);
      dot(ctx, x, Y, 5, c, col.panel);
      const left = x < w / 2;
      text(ctx, `${e[1]} · ${when(e[0])}`, x + (left ? 6 : -6), ty, { color: isNew ? col.ink : col.muted, size: w < 420 ? 11 : 12.5, weight: isNew ? 600 : 400, align: left ? 'left' : 'right', halo: col.panel });
      row++;
    }
  };
  cv.redraw();
  return {
    step(i) {
      from = view.slice(); step = i;
      if (calm()) { view = VIEWS[i].slice(); k = 1; cv.redraw(); } else { k = 0; anim.play(); }
    },
  };
}
