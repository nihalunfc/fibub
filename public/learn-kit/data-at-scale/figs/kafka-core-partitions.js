// 5.2 Keys pick partitions, partitions keep order, and a consumer group shares the partitions:
// six sales events keyed by store land on three partitions; three consumers read them; one crashes and
// the group rebalances; a second group reads the same log from offset 0.
import { canvas, text, title, line, dot } from '../../kit.js';

const EV = [['s1', 0], ['s2', 1], ['s3', 2], ['s1', 0], ['s2', 1], ['s1', 0]]; // key, partition = hash(key) mod 3
const box = (ctx, x, y, w, h, fill, stroke) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, 5); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); } };

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 250, label: 'Kafka topic with three partitions, keyed events and a consumer group' });
  let s = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, ['A producer sends six sales events', 'hash(key) picks the partition', 'One consumer per partition', 'A consumer crashes: rebalance', 'A second group reads the same log'][s], col) + 10;
    const keyCol = { s1: col.s[0], s2: col.s[1], s3: col.s[2] };
    const L = 64, R = w - 96, rowH = (h - top - 30) / 3;
    // partitions (belts)
    for (let p = 0; p < 3; p++) {
      const y = top + p * rowH + rowH / 2;
      text(ctx, `P${p}`, 10, y, { color: col.ink, size: 12, weight: 700 });
      line(ctx, [[L - 8, y + 15], [R, y + 15]], col.line, 2);
    }
    // events
    const off = [0, 0, 0], tw = Math.min(46, (R - L) / 4);
    EV.forEach(([k, p], i) => {
      if (s === 0) {
        const x = L + i * Math.min(48, (R - L) / 6), y = top + rowH * 1.5;
        box(ctx, x, y - 13, tw - 6, 26, keyCol[k]);
        text(ctx, k, x + (tw - 6) / 2, y, { color: '#fff', size: 11, weight: 700, align: 'center' });
        return;
      }
      const o = off[p]++, x = L + o * tw, y = top + p * rowH + rowH / 2;
      box(ctx, x, y - 13, tw - 6, 26, keyCol[k]);
      text(ctx, `${k}·${o}`, x + (tw - 6) / 2, y, { color: '#fff', size: 10.5, weight: 700, align: 'center' });
    });
    if (s === 0) { text(ctx, 'keys: store s1, s2, s3', L, top + rowH * 1.5 + 30, { color: col.muted, size: 11 }); return; }
    // consumers
    const cx = w - 40, cy = (p) => top + p * rowH + rowH / 2;
    const groups = s === 2 ? [[0, 0], [1, 1], [2, 2]] : s >= 3 ? [[0, 0], [1, 1], [2, 0]] : [];
    if (s >= 2) {
      const alive = s >= 3 ? [0, 1] : [0, 1, 2];
      for (const [p, c] of groups) line(ctx, [[R + 4, cy(p)], [cx - 14, cy(c)]], col.s[4], 2, s >= 3 && p === 2 ? [5, 4] : null);
      [0, 1, 2].forEach((c) => {
        const dead = !alive.includes(c);
        dot(ctx, cx, cy(c), 13, dead ? col.panel : col.s[4], dead ? col.bad : null);
        text(ctx, dead ? '✕' : `C${c + 1}`, cx, cy(c), { color: dead ? col.bad : '#fff', size: 11, weight: 700, align: 'center' });
      });
      text(ctx, s >= 3 ? 'C1 takes over P2' : 'group "store-totals"', w - 8, h - 12, { color: col.muted, size: 11, align: 'right' });
    }
    if (s === 1) text(ctx, 'Same key, same partition, in order. Offsets count up per partition.', 10, h - 12, { color: col.muted, size: 11 });
    if (s === 4) {
      line(ctx, [[L - 4, top + 4], [L - 4, h - 26]], col.s[3], 3);
      text(ctx, 'group "fraud" starts at offset 0', L, h - 12, { color: col.s[3], size: 11, weight: 700 });
    }
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
