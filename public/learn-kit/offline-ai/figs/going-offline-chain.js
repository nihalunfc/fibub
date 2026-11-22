// 9.6 Going offline: a setup is a chain. Five parts, each 90% likely to work offline untested; the chance the whole
// chain works is 0.9 × 0.9 × ... Steps: one part (0.9), two (0.81), five (0.59), then after the test (all checked: 1).
import { canvas, title, text, dot, line, loop, calm, ease } from '../../kit.js';

const NAMES = ['chat app', 'model', 'script', 'documents', 'search'];
const ST = [[1, false], [2, false], [5, false], [5, true]];
export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 270, min: 210, label: 'Five links in a chain, each with its own chance of working offline, and the chance for the whole chain' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.8); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k), [nOn, tested] = ST[step], y = h * 0.42, L = 30, R = w - 30;
    const xs = NAMES.map((_, i) => L + ((R - L) * i) / 4);
    title(ctx, tested ? 'After the ten-minute test: every part checked' : `${nOn} part${nOn > 1 ? 's' : ''}, each 90% likely to work`, col);
    line(ctx, [[xs[0], y], [xs[nOn - 1], y]], col.muted, 3);
    NAMES.forEach((nm, i) => {
      const on = i < nOn;
      dot(ctx, xs[i], y, 13, on ? (tested ? col.good || col.s[2] : col.s[0]) : col.soft, col.panel);
      text(ctx, tested && on ? '1' : on ? '0.9' : '', xs[i], y, { color: col.panel, size: 10.5, weight: 700, align: 'center' });
      text(ctx, nm, xs[i], y + 28, { color: on ? col.ink : col.muted, size: 10.5, align: 'center' });
    });
    const p = tested ? 1 : Math.pow(0.9, nOn);
    const barL = 12, barR = w - 12, by = h - 46;
    ctx.fillStyle = col.soft; ctx.fillRect(barL, by, barR - barL, 16);
    ctx.fillStyle = tested ? col.good || col.s[2] : col.s[1]; ctx.fillRect(barL, by, (barR - barL) * p * e, 16);
    const eq = tested ? 'whole setup works: yes, checked' : nOn === 1 ? 'whole setup works: 0.9 = 90%' : `whole setup works: 0.9${nOn === 2 ? '²' : '⁵'} = ${(p * 100).toFixed(0)}%`;
    text(ctx, eq, barL, by - 10, { color: col.ink, size: 12, weight: 700 });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
