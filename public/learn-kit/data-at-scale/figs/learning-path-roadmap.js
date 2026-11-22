// 8.1 The learning path as a road of nine stops, built outward from SQL and BI skills you already have.
// Each step lights up one stretch: the warehouse, processing and cloud, streaming and stores, then ML and the domain.
import { canvas, text, title, line, dot } from '../../kit.js';

const STOPS = ['BigQuery', 'dbt', 'PySpark', 'Airflow', 'GCS + Dataproc', 'Kafka', 'One serving store', 'ML platform', 'Retail media'];
const STAGES = [[-1, -1], [0, 1], [2, 4], [5, 6], [7, 8]];
const NAMES = ['Start from what you have: SQL, modelling, BI', 'Main roads: the warehouse, deeply', 'Transit lines: Spark, Airflow, the cloud', 'Neighbourhoods: streaming and a serving store', 'Destinations: ML platforms and the domain'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 260, label: 'A road map of nine learning steps' });
  let s = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, NAMES[s], col) + 12;
    // three rows of three stops, snaking left-right-left
    const rows = 3, rh = (h - top - 30) / rows, xs = [w * 0.17, w * 0.5, w * 0.83];
    const pos = STOPS.map((_, i) => { const r = Math.floor(i / 3), c = r % 2 ? 2 - (i % 3) : i % 3; return [xs[c], top + r * rh + rh / 2]; });
    line(ctx, pos, col.line, 6);
    const [a, b] = STAGES[s];
    if (a >= 0) line(ctx, pos.slice(0, b + 1), col.s[0], 6);
    STOPS.forEach((name, i) => {
      const [x, y] = pos[i], done = i < a, now = i >= a && i <= b;
      dot(ctx, x, y, now ? 11 : 8, now ? col.s[0] : done ? col.s[0] : col.panel, now || done ? null : col.muted);
      text(ctx, String(i + 1), x, y, { color: now || done ? '#fff' : col.muted, size: 10, weight: 700, align: 'center' });
      text(ctx, name, x, y + 20, { color: now ? col.ink : col.muted, size: 11, weight: now ? 700 : 400, align: 'center' });
    });
    if (s === 0) text(ctx, 'You already own the hardest skills to teach', 10, h - 12, { color: col.muted, size: 11.5 });
    else text(ctx, `Steps ${a + 1} to ${b + 1}`, 10, h - 12, { color: col.s[0], size: 11.5, weight: 700 });
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
