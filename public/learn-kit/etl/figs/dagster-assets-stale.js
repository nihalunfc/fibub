// 3.2 Staleness flows down the graph: every asset is fresh, a code change in stg makes everything below it stale,
// and materialising in order brings them back. Amber dashed = stale.
import { stepFig, graph, note } from './b-lib.js';

const NODES = [
  { id: 'raw', label: 'raw', fx: 0, fy: 0 },
  { id: 'hot', label: 'hotels', fx: 0.34, fy: 1 },
  { id: 'stg', label: 'stg', fx: 0.34, fy: 0 },
  { id: 'otb', label: 'otb', fx: 0.67, fy: 0.5 },
  { id: 'rep', label: 'report', fx: 1, fy: 0.5 },
];
const EDGES = [['raw', 'stg'], ['stg', 'otb'], ['hot', 'otb'], ['otb', 'rep']];
const ALL = { raw: 'done', hot: 'done', stg: 'done', otb: 'done', rep: 'done' };
const S = [
  ALL,
  { ...ALL, stg: 'stale' },
  { ...ALL, stg: 'stale', otb: 'stale', rep: 'stale' },
  { ...ALL, stg: 'run', otb: 'stale', rep: 'stale' },
  ALL,
];
const NOTE = ['Every asset is up to date', 'You fix a bug in the stg code', 'otb and report read stg, so they are stale too', 'Materialise stg, then the ones below it', 'Fresh again; raw and hotels never re-ran'];
export default function (host) {
  return stepFig(host, {
    label: 'An asset graph where a change in the staging asset turns the assets below it stale, then fresh again',
    name: 'Staleness flows downhill', last: S.length - 1,
    draw(ctx, w, h, col, step) {
      graph(ctx, w, h, col, NODES, EDGES, S[step], { top: 44, bottom: 40, bh: 34 });
      note(ctx, NOTE[step], w, h, col);
    },
  });
}
