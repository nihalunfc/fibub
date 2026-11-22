// 4.5 An index seek against a scan: a three-level B-tree finds one date in 3 page reads, while a scan reads every
// leaf page. Pages light up as they are read.
import { stepFig, box, note } from './b-lib.js';
import { line } from '../../kit.js';

const NOTE = ['A B-tree index on business_date: root, branches, leaves', 'Seek: read the root page, pick the right branch', 'Read one branch page', 'Read one leaf page: found, 3 reads in all', 'A scan ignores the tree and reads every leaf page'];
export default function (host) {
  return stepFig(host, {
    aspect: 0.55, label: 'A three-level index tree where a seek reads one page per level and a scan reads every leaf page',
    name: 'Seek or scan', last: 4,
    draw(ctx, w, h, col, step) {
      const top = 50, gap = (h - top - 44) / 3, bh = Math.min(26, gap - 12);
      const lv = [[0.5], [1 / 6, 0.5, 5 / 6], Array.from({ length: 9 }, (_, i) => (i + 0.5) / 9)];
      const bw = [w * 0.2, w * 0.2, (w - 20) / 9 - 4];
      const pos = (l, i) => ({ x: lv[l][i] * w - bw[l] / 2, y: top + l * gap });
      for (let i = 0; i < 3; i++) line(ctx, [[w / 2, top + bh], [pos(1, i).x + bw[1] / 2, pos(1, i).y]], col.line, 1);
      for (let i = 0; i < 9; i++) { const p = pos(1, Math.floor(i / 3)); line(ctx, [[p.x + bw[1] / 2, p.y + bh], [pos(2, i).x + bw[2] / 2, pos(2, i).y]], col.line, 1); }
      const on = (l, i) => (step === 4 ? l === 2 : (l === 0 && step >= 1) || (l === 1 && i === 2 && step >= 2) || (l === 2 && i === 6 && step >= 3));
      lv.forEach((xs, l) => xs.forEach((_, i) => { const p = pos(l, i); box(ctx, p.x, p.y, bw[l], bh, l === 0 ? 'root' : l === 1 ? ['Jan-Apr', 'May-Aug', 'Sep-Dec'][i] : '', col, { state: on(l, i) ? 'run' : 'idle', size: 10.5 }); }));
      note(ctx, NOTE[step], w, h, col);
    },
  });
}
