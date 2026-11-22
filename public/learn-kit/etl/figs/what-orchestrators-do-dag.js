// 3.1 The 06:15 run of the hotel graph, step by step: two sources in parallel, a staging step that fails once and
// is retried, then the fact table and the report. Boxes change colour: grey waiting, blue running, green done, red failed.
import { stepFig, graph, note } from './b-lib.js';

const NODES = [
  { id: 'raw', label: 'raw files', sub: '10 min', fx: 0, fy: 0 },
  { id: 'ref', label: 'hotels', sub: '1 min', fx: 0, fy: 1 },
  { id: 'stg', label: 'stg', sub: '9 min', fx: 0.34, fy: 0 },
  { id: 'fct', label: 'fct daily', sub: '5 min', fx: 0.67, fy: 0.5 },
  { id: 'rep', label: 'report', sub: '2 min', fx: 1, fy: 0.5 },
];
const EDGES = [['raw', 'stg'], ['stg', 'fct'], ['ref', 'fct'], ['fct', 'rep']];
const S = [
  {},
  { raw: 'run', ref: 'run' },
  { raw: 'done', ref: 'done', stg: 'fail' },
  { raw: 'done', ref: 'done', stg: 'done', fct: 'run' },
  { raw: 'done', ref: 'done', stg: 'done', fct: 'done', rep: 'done' },
];
const NOTE = ['06:15: nothing has run yet', 'No arrows between them: raw and hotels run side by side', 'stg times out; the orchestrator retries it', 'Retry works; fct waits for both of its parents', 'All green: 10 + 9 + 5 + 2 = 26 min on the longest path'];
export default function (host) {
  return stepFig(host, {
    label: 'A five-step pipeline graph where boxes turn from waiting to running to done, with one failure and retry',
    name: 'One run of the hotel graph', last: S.length - 1,
    draw(ctx, w, h, col, step) {
      graph(ctx, w, h, col, NODES, EDGES, S[step], { top: 44, bottom: 40, bh: 40 });
      note(ctx, NOTE[step], w, h, col);
    },
  });
}
