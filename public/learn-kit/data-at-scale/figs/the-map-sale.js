// 1.2 Watch it happen: one cereal sale travels through the platform. Ten tools as boxes; each step lights the hop
// the sale takes next (till to Kafka, the live path to Druid, the lake, the nightly batch, BI, and ML serving).
import { canvas, text, title, line, dot, arrow, ease, loop, calm } from '../../kit.js';

const rr = (ctx, x, y, w, h, r = 6) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
const N = { till: [0.11, 0.24, 'Till'], kafka: [0.37, 0.24, 'Kafka'], stream: [0.63, 0.24, 'Stream job'], druid: [0.88, 0.24, 'Druid'],
  gcs: [0.37, 0.55, 'GCS lake'], spark: [0.63, 0.55, 'Spark'], bq: [0.88, 0.55, 'BigQuery'],
  bigtable: [0.37, 0.86, 'Bigtable'], vertex: [0.63, 0.86, 'Vertex AI'], bi: [0.88, 0.86, 'BI report'] };
const E = [['till', 'kafka'], ['kafka', 'stream'], ['stream', 'druid'], ['kafka', 'gcs'], ['gcs', 'spark'], ['spark', 'bq'], ['bq', 'bi'], ['bq', 'vertex'], ['vertex', 'bigtable']];
const PATHS = [['till', 'kafka'], ['kafka', 'stream', 'druid'], ['kafka', 'gcs'], ['gcs', 'spark', 'bq'], ['bq', 'bi'], ['bq', 'vertex', 'bigtable']];
const WHEN = ['10:02:00 · ingest', '10:02:01 · live dashboard', '10:05 · permanent copy', '02:00 next day · nightly batch', '06:00 · finance report', 'Weekly · model and app'];
export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 360, min: 260, label: 'Ten data tools as boxes, with the path one sale takes lit up step by step' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 1.2); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, WHEN[step], col);
    const top = 34, P = (id) => [N[id][0] * w, top + N[id][1] * (h - top - 10)];
    const bw = Math.min(84, w * 0.22), bh = 28;
    const lit = new Set(PATHS.slice(0, step + 1).flat()), cur = PATHS[step];
    const onCur = (a, b) => cur.some((x, i) => i && cur[i - 1] === a && x === b);
    for (const [a, b] of E) {
      const [x0, y0] = P(a), [x1, y1] = P(b), c = onCur(a, b) ? col.s[1] : lit.has(a) && lit.has(b) ? col.muted : col.line;
      const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
      // distance from a box centre to its edge along the arrow
      const off = Math.min(Math.abs(ux) > 1e-6 ? (bw / 2) / Math.abs(ux) : 1e9, Math.abs(uy) > 1e-6 ? (bh / 2) / Math.abs(uy) : 1e9) + 2;
      arrow(ctx, x0 + ux * off, y0 + uy * off, x1 - ux * off, y1 - uy * off, c, onCur(a, b) ? 2.5 : 1.5, 7);
    }
    for (const id of Object.keys(N)) {
      const [x, y] = P(id), on = lit.has(id), now = cur.includes(id);
      ctx.fillStyle = now ? col.s[1] : on ? col.soft : col.panel; rr(ctx, x - bw / 2, y - bh / 2, bw, bh); ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = now ? col.s[1] : on ? col.muted : col.line; ctx.stroke();
      text(ctx, N[id][2], x, y, { color: now ? '#fff' : on ? col.ink : col.muted, size: 11, weight: now ? 700 : 500, align: 'center', fit: false });
    }
    // the sale as a dot moving along the current path
    const e = ease(k), segs = cur.length - 1, pos = e * segs, i = Math.min(segs - 1, Math.floor(pos)), f = pos - i;
    const [ax, ay] = P(cur[i]), [bx, by] = P(cur[i + 1]);
    dot(ctx, ax + (bx - ax) * f, ay + (by - ay) * f - bh / 2 - 6, 5, col.s[2], col.panel);
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); k = calm() ? 1 : 0; cv.redraw(); if (!calm()) anim.play(); } };
}
