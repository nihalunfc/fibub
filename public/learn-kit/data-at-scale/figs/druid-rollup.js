// 4.2 Watch it happen: Druid rollup of 8 raw ad events. Times are truncated to the minute, rows with the same
// (minute, campaign, device) are grouped, and each group is stored as one row with summed impressions and clicks.
import { canvas, text, title, ease, loop, calm } from '../../kit.js';

const RAW = [['10:00:04', 'A', 'mobile', 0], ['10:00:19', 'A', 'mobile', 1], ['10:00:33', 'B', 'desktop', 0], ['10:00:51', 'A', 'mobile', 0],
  ['10:01:02', 'A', 'mobile', 1], ['10:01:15', 'B', 'desktop', 0], ['10:01:40', 'B', 'desktop', 1], ['10:01:58', 'A', 'mobile', 0]];
const key = (r) => r[0].slice(0, 5) + r[1] + r[2];
const GROUPS = [...new Set(RAW.map(key))];
const OUT = GROUPS.map((g) => { const rs = RAW.filter((r) => key(r) === g); return [rs[0][0].slice(0, 5), rs[0][1], rs[0][2], rs.length, rs.reduce((s, r) => s + r[3], 0)]; });
const CAP = ['8 raw events arrive from Kafka', 'Truncate time to the minute', 'Same minute, campaign, device = same group', 'Store one row per group'];
export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 340, min: 270, label: 'Eight ad events grouped into four rolled-up rows' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.8); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, CAP[step], col);
    const T = 52, rowH = Math.min(24, (h - T - 34) / 9), e = ease(k), wide = w > 420, narrow = step === 3 && !wide;
    const lx = 10, rx = step === 3 ? (wide ? w * 0.52 : w * 0.5) : w;
    const c = (i) => col.s[GROUPS.indexOf(key(RAW[i]))];
    text(ctx, 'time', lx + 6, T, { color: col.muted, size: 10.5, weight: 600 });
    text(ctx, narrow ? 'camp · dev · clk' : 'camp · device · clicks', lx + 70, T, { color: col.muted, size: 10.5, weight: 600 });
    RAW.forEach((r, i) => {
      const y = T + (i + 1) * rowH;
      if (step >= 2) { ctx.fillStyle = c(i); ctx.globalAlpha = step === 2 ? 0.25 * e : 0.25; ctx.fillRect(lx, y - rowH / 2 + 1, Math.min(rx - lx - 10, 190), rowH - 2); ctx.globalAlpha = 1; ctx.fillStyle = c(i); ctx.fillRect(lx, y - rowH / 2 + 1, 4, rowH - 2); }
      const sec = r[0].slice(5);
      text(ctx, r[0].slice(0, 5), lx + 6, y, { color: col.ink, size: 11.5, fit: false });
      ctx.globalAlpha = step >= 1 ? Math.max(0.15, 1 - (step === 1 ? e : 1) * 0.85) : 1;
      text(ctx, sec, lx + 6 + 32, y, { color: col.ink, size: 11.5, fit: false });
      ctx.globalAlpha = 1;
      text(ctx, `${r[1]} · ${narrow ? (r[2] === 'mobile' ? 'mob' : 'desk') : r[2]} · ${r[3]}`, lx + 70, y, { color: col.ink, size: 11.5, fit: false });
    });
    if (step === 3) {
      ctx.globalAlpha = e;
      text(ctx, 'stored rows', rx + 8, T, { color: col.muted, size: 10.5, weight: 600, fit: false });
      OUT.forEach((o, i) => {
        const y = T + (i + 1) * rowH * 1.6;
        ctx.fillStyle = col.s[i]; ctx.fillRect(rx, y - rowH / 2 - 2, 4, rowH * 1.4);
        text(ctx, `${o[0]} · ${o[1]} · ${o[2]}`, rx + 8, y - 3, { color: col.ink, size: 11.5, weight: 700, fit: false });
        text(ctx, `imps ${o[3]}, clicks ${o[4]}`, rx + 8, y + 11, { color: col.muted, size: 11, fit: false });
      });
      ctx.globalAlpha = 1;
    }
    text(ctx, step === 3 ? '8 rows became 4: half the storage, same totals' : `${RAW.length} rows`, 8, h - 14, { color: col.ink, size: 12, weight: 700 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 3); k = calm() ? 1 : 0; cv.redraw(); if (!calm()) anim.play(); } };
}
