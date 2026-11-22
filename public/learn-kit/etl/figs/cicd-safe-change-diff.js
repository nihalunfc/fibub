// 7.2 A data diff between the prod table and the CI build of a pull request: rows only in CI, rows only in prod,
// the symmetric difference confined to brand B, and what a side effect would look like.
import { stepFig, note } from './d-lib.js';
import { text } from '../../kit.js';

const PROD = [['A', 'Mon', '4,120'], ['A', 'Tue', '3,980'], ['B', 'Mon', '2,710'], ['B', 'Tue', '2,940'], ['C', 'Mon', '3,350']];
const CI = [['A', 'Mon', '4,120'], ['A', 'Tue', '3,980'], ['B', 'Mon', '2,655'], ['B', 'Tue', '2,890'], ['C', 'Mon', '3,350']];
const CI_BUG = [...CI.slice(0, 4), ['C', 'Mon', '3,310']];
const NOTE = [
  'Same table, two builds: prod and the pull request (CI)',
  'CI except prod: rows that exist only in the new build',
  'Prod except CI: the old versions of those rows',
  'Diff = 4 rows, all brand B: exactly the change we meant',
  'If brand C also moved, the change has a side effect: stop',
];

function tableAt(ctx, x, y, w, rows, head, col, mark) {
  const rh = 22, cw = [0.22, 0.3, 0.48].map((f) => f * w);
  text(ctx, head, x + w / 2, y - 12, { color: col.ink, size: 12, weight: 700, align: 'center', fit: false });
  ctx.save(); ctx.strokeStyle = col.line; ctx.lineWidth = 1;
  ['brand', 'day', 'sales'].forEach((s, j) => text(ctx, s, x + cw.slice(0, j).reduce((a, b) => a + b, 0) + 6, y + rh / 2, { color: col.muted, size: 10.5, weight: 600, fit: false }));
  rows.forEach((r, i) => {
    const ry = y + rh * (i + 1), m = mark(i);
    if (m) { ctx.globalAlpha = 0.22; ctx.fillStyle = m; ctx.fillRect(x, ry, w, rh); ctx.globalAlpha = 1; }
    ctx.beginPath(); ctx.moveTo(x, ry); ctx.lineTo(x + w, ry); ctx.stroke();
    r.forEach((s, j) => text(ctx, s, x + cw.slice(0, j).reduce((a, b) => a + b, 0) + 6, ry + rh / 2, { color: col.ink, size: 11.5, weight: m ? 650 : 400, fit: false }));
  });
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, rh * (rows.length + 1) - 1);
  ctx.restore();
}

export default function (host) {
  return stepFig(host, {
    aspect: 0.62, min: 240, label: 'Two small tables, prod and CI, with the rows that differ highlighted step by step',
    name: 'A data diff before merging', last: 4,
    draw(ctx, w, h, col, step) {
      const gap = 14, tw = (w - 20 - gap) / 2, y = 60;
      const ci = step === 4 ? CI_BUG : CI;
      const diff = (a, b) => (i) => a[i].join() !== b[i].join();
      const run = col.s[0], good = col.good || col.s[2], bad = col.bad || col.s[1];
      const ciMark = (i) => {
        if (!diff(ci, PROD)(i)) return null;
        if (step === 4 && i === 4) return bad;
        return step === 1 ? run : step >= 3 ? good : null;
      };
      const prodMark = (i) => {
        if (!diff(ci, PROD)(i)) return null;
        if (step === 4 && i === 4) return bad;
        return step === 2 ? run : step >= 3 ? good : null;
      };
      tableAt(ctx, 10, y, tw, PROD, 'prod', col, prodMark);
      tableAt(ctx, 10 + tw + gap, y, tw, ci, 'ci (pull request)', col, ciMark);
      note(ctx, NOTE[step], w, h, col);
    },
  });
}
