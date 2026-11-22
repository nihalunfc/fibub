// 4.3 A MERGE from a staging table into the target: match on (date, campaign), skip the unchanged row, update the
// changed one, insert the new ones, and count what happened for the audit table.
import { stepFig, box, note, link } from './b-lib.js';
import { text } from '../../kit.js';

const STG = [['09-14 C1', '120'], ['09-14 C2', '95'], ['09-15 C1', '130'], ['09-15 C2', '88']];
const TGT = [['09-13 C1', '110'], ['09-13 C2', '90'], ['09-14 C1', '120'], ['09-14 C2', '80']];
const NOTE = ['Staging holds the new load: 4 rows', 'Match on the key (date, campaign): 2 keys already exist', '09-14 C1 is identical: skip. 09-14 C2 changed 80 to 95: update', '2 keys are new: insert', 'Target: 6 rows. Audit: 2 inserted, 1 updated, 0 deleted'];
export default function (host) {
  return stepFig(host, {
    aspect: 0.7, max: 340, min: 260, label: 'A staging table merged into a target table: matched rows updated or skipped, new rows inserted',
    name: 'MERGE, one row at a time', last: 4,
    draw(ctx, w, h, col, step) {
      const top = 56, bw = w * 0.36, bh = Math.min(28, (h - top - 50) / 6 - 4), lx = 10, rx = w - bw - 10;
      text(ctx, 'staging', lx, top - 10, { color: col.muted, size: 11, weight: 600 });
      text(ctx, 'target', rx, top - 10, { color: col.muted, size: 11, weight: 600 });
      const tgt = TGT.map((r) => [...r]); if (step >= 2) tgt[3][1] = '95';
      const rows = step >= 3 ? [...tgt, STG[2], STG[3]] : tgt;
      rows.forEach((r, i) => {
        let st = 'idle';
        if (step >= 2 && i === 3) st = 'stale';
        if (step >= 3 && i >= 4) st = 'done';
        if (step === 1 && (i === 2 || i === 3)) st = 'key';
        if (step >= 2 && i === 2) st = 'skip';
        box(ctx, rx, top + i * (bh + 4), bw, bh, `${r[0]}  ${r[1]}`, col, { state: st, size: 10.5 });
      });
      STG.forEach((r, i) => {
        const st = step === 0 ? 'run' : step === 1 ? (i < 2 ? 'key' : 'idle') : step === 2 ? (i < 2 ? 'done' : 'idle') : 'done';
        const a = { x: lx, y: top + i * (bh + 4), w: bw, h: bh };
        box(ctx, a.x, a.y, a.w, a.h, `${r[0]}  ${r[1]}`, col, { state: st, size: 10.5 });
        const target = i < 2 ? i + 2 : i + 2;
        if ((step === 1 && i < 2) || (step === 2 && i === 1) || (step === 3 && i >= 2)) link(ctx, a, { x: rx, y: top + target * (bh + 4), w: bw, h: bh }, col.muted);
      });
      note(ctx, NOTE[step], w, h, col);
    },
  });
}
