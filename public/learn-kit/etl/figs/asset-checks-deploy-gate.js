// 3.6 A blocking asset check as a gate: stg materialises, the uniqueness check finds 3 duplicates and fails,
// otb and the report are not built, the fix lands, the check passes and the rest runs.
import { stepFig, graph, note } from './b-lib.js';

const NODES = [
  { id: 'stg', label: 'stg', fx: 0, fy: 0.5 },
  { id: 'chk', label: 'check', sub: 'unique id', fx: 0.34, fy: 0.5 },
  { id: 'otb', label: 'otb', fx: 0.67, fy: 0.5 },
  { id: 'rep', label: 'report', fx: 1, fy: 0.5 },
];
const EDGES = [['stg', 'chk'], ['chk', 'otb'], ['otb', 'rep']];
const S = [
  { stg: 'run' },
  { stg: 'done', chk: 'run' },
  { stg: 'done', chk: 'fail', otb: 'skip', rep: 'skip' },
  { stg: 'run' },
  { stg: 'done', chk: 'done', otb: 'done', rep: 'done' },
];
const NOTE = ['stg_bookings materialises', 'The blocking check counts duplicate booking ids', '3 duplicates: check fails, otb and report are skipped', 'You fix the dedup and rerun stg', '0 duplicates: the check passes and the rest is built'];
export default function (host) {
  return stepFig(host, {
    label: 'A pipeline where a failing blocking check stops the assets after it, then passes after a fix',
    name: 'A blocking check is a gate', last: 4,
    draw(ctx, w, h, col, step) {
      graph(ctx, w, h, col, NODES, EDGES, S[step], { top: 44, bottom: 40, bh: 40 });
      note(ctx, NOTE[step], w, h, col);
    },
  });
}
