// Every practice editor's solution in the Power BI course runs without an error (src/courses/power-bi/exercises.ts),
// and every starter either runs or gives a friendly DAX error (never a crash).
import { run, Model } from '../src/lib/dax/engine.ts';
import { northbayModel } from '../src/lib/dax/northbay.ts';
import { EXERCISES } from '../src/courses/power-bi/exercises.ts';
const spec = northbayModel();
const col = (s) => { const m = /^'?([^'[]+)'?\[([^\]]+)\]$/.exec(s); return m ? { table: m[1], name: m[2] } : null; };
let fails = 0, n = 0;
for (const [id, ex] of Object.entries(EXERCISES)) {
  const opts = { by: ex.by ? [col(ex.by)] : [], slicers: (ex.slicers ?? []).map((s) => ({ col: col(s.col), values: s.values })) };
  for (const [what, code] of [['solution', ex.solution], ['starter', ex.starter]]) {
    if (!code) continue;
    n++;
    try {
      const r = run(new Model(spec), code + (ex.append && what === 'solution' ? '\n' + ex.append : ''), opts);
      if (what === 'solution' && r.error) { fails++; console.error(`✗ ${id} solution: ${r.error}`); }
      if (what === 'solution' && !r.error && !r.query && !r.visual) { fails++; console.error(`✗ ${id} solution shows nothing`); }
    } catch (e) { fails++; console.error(`✗ ${id} ${what} crashed: ${e.stack}`); }
  }
}
console.log(`${n - fails}/${n} DAX exercise checks passed`);
if (fails) process.exit(1);
