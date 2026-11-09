// Westgard multirule quality control on control results, run by run.
// Rules: Westgard JO, Barry PL, Hunt MR, Groth T (1981), Clinical Chemistry 27:493-501, and the extended
// rules (2of3-2s, 3-1s, 6x, 8x, 9x, 12x, 7T) described by Westgard (Basic QC Practices, 4th ed., 2016).
// Sigma metric: (TEa - |bias|) / CV, all in percent (Westgard and Westgard 2006).
//
// Conventions:
// - z = (result - target mean) / target SD. "Above 2 SD" means |z| > 2 (strictly), on one side.
// - "Within material": consecutive results of one control level, skipping runs where that level is missing.
// - "Across materials": all results in time order (run by run, level 1 first), so for two levels 4-1s can be
//   met by two levels in each of two runs. A rule is checked at a run only if the run's own results are in the window.
// - R-4s is checked within a run only: one level above +2 SD and another below -2 SD.

export type RuleId = '1-2s' | '1-3s' | '2-2s' | 'R-4s' | '4-1s' | '10x' | '2of3-2s' | '3-1s' | '6x' | '8x' | '9x' | '12x' | '7T';
export const RULES: { id: RuleId; text: string }[] = [
  { id: '1-2s', text: 'One result beyond 2 SD (warning)' },
  { id: '1-3s', text: 'One result beyond 3 SD' },
  { id: '2-2s', text: 'Two results beyond 2 SD on the same side' },
  { id: 'R-4s', text: 'In one run, one level beyond +2 SD and another beyond −2 SD' },
  { id: '4-1s', text: 'Four results in a row beyond 1 SD on the same side' },
  { id: '10x', text: 'Ten results in a row on the same side of the mean' },
  { id: '2of3-2s', text: 'Two of three results beyond 2 SD on the same side' },
  { id: '3-1s', text: 'Three results in a row beyond 1 SD on the same side' },
  { id: '6x', text: 'Six results in a row on the same side of the mean' },
  { id: '8x', text: 'Eight results in a row on the same side of the mean' },
  { id: '9x', text: 'Nine results in a row on the same side of the mean' },
  { id: '12x', text: 'Twelve results in a row on the same side of the mean' },
  { id: '7T', text: 'Seven results in a row each higher (or each lower) than the one before' },
];
export const CLASSIC: RuleId[] = ['1-2s', '1-3s', '2-2s', 'R-4s', '4-1s', '10x'];

export type Violation = { rule: RuleId; where: string; levels: number[] };
export type RunResult = { run: number; label: string; z: (number | null)[]; status: 'ok' | 'warning' | 'reject'; violations: Violation[] };

type Pt = { run: number; level: number; z: number; x: number };

function sameSide(w: Pt[], k: number): 1 | -1 | 0 {
  if (w.every((p) => p.z > k)) return 1;
  if (w.every((p) => p.z < -k)) return -1;
  return 0;
}

/**
 * Evaluate the rules for each run. `z[r][l]` is the z-score of level l in run r (null if missing), `x` the results.
 * With `gate`, the rejection rules are only checked on runs with a 1-2s warning (the classic 1981 flowchart).
 */
export function westgard(z: (number | null)[][], rules: RuleId[], opt: { gate?: boolean; x?: (number | null)[][]; labels?: string[]; warnOnly12s?: boolean } = {}): RunResult[] {
  const on = new Set(rules), L = Math.max(0, ...z.map((r) => r.length));
  const x = opt.x ?? z, warn12 = opt.warnOnly12s ?? true;
  const seqLevel: Pt[][] = Array.from({ length: L }, () => []), seqAll: Pt[] = [];
  const out: RunResult[] = [];
  z.forEach((row, r) => {
    const pts: Pt[] = [];
    row.forEach((v, l) => { if (v != null && Number.isFinite(v)) { const p = { run: r, level: l, z: v, x: (x[r]?.[l] ?? v) as number }; pts.push(p); seqLevel[l].push(p); seqAll.push(p); } });
    const vio: Violation[] = [];
    const add = (rule: RuleId, where: string, w: Pt[]) => { if (!vio.some((v) => v.rule === rule && v.where === where && v.levels.join() === [...new Set(w.map((p) => p.level))].sort().join())) vio.push({ rule, where, levels: [...new Set(w.map((p) => p.level))].sort((a, b) => a - b) }); };
    const has12s = pts.some((p) => Math.abs(p.z) > 2);
    if (on.has('1-2s') && has12s) for (const p of pts) if (Math.abs(p.z) > 2) add('1-2s', 'this run', [p]);
    const check = !opt.gate || has12s;
    if (check && pts.length) {
      if (on.has('1-3s')) for (const p of pts) if (Math.abs(p.z) > 3) add('1-3s', 'this run', [p]);
      if (on.has('R-4s')) { const hi = pts.filter((p) => p.z > 2), lo = pts.filter((p) => p.z < -2); if (hi.length && lo.length) add('R-4s', 'within the run', [...hi, ...lo]); }
      // n results beyond k SD on one side (and 2 of 3), within each material and across materials.
      // The last n results (at least `min` of them) of each level, and of all levels together.
      const windows = (n: number, min = n): { w: Pt[]; where: string }[] => {
        const ws: { w: Pt[]; where: string }[] = [];
        for (let l = 0; l < L; l++) { const s = seqLevel[l]; if (s.length >= min && s[s.length - 1].run === r) ws.push({ w: s.slice(-n), where: 'within the level' }); }
        if (L > 1 && seqAll.length >= min) { const w = seqAll.slice(-n); if (new Set(w.map((p) => p.level)).size > 1) ws.push({ w, where: 'across levels' }); }
        return ws;
      };
      const nk = (id: RuleId, n: number, k: number) => { if (on.has(id)) for (const { w, where } of windows(n)) if (sameSide(w, k)) add(id, where, w); };
      // 2-2s: within a run across levels, or the same level in two runs in a row.
      if (on.has('2-2s')) {
        const hi = pts.filter((p) => p.z > 2), lo = pts.filter((p) => p.z < -2);
        if (hi.length >= 2) add('2-2s', 'within the run', hi.slice(0, 2));
        if (lo.length >= 2) add('2-2s', 'within the run', lo.slice(0, 2));
        for (let l = 0; l < L; l++) { const s = seqLevel[l]; if (s.length >= 2 && s[s.length - 1].run === r && sameSide(s.slice(-2), 2)) add('2-2s', 'within the level', s.slice(-2)); }
      }
      nk('4-1s', 4, 1); nk('3-1s', 3, 1);
      if (on.has('2of3-2s')) for (const { w, where } of windows(3, 2)) for (const sgn of [1, -1]) if (w.filter((p) => sgn * p.z > 2).length >= 2 && w.some((p) => p.run === r && sgn * p.z > 2)) add('2of3-2s', where, w.filter((p) => sgn * p.z > 2));
      for (const [id, n] of [['6x', 6], ['8x', 8], ['9x', 9], ['10x', 10], ['12x', 12]] as [RuleId, number][]) nk(id, n, 0);
      if (on.has('7T')) for (let l = 0; l < L; l++) {
        const s = seqLevel[l];
        if (s.length >= 7 && s[s.length - 1].run === r) { const w = s.slice(-7); const up = w.every((p, i) => !i || p.x > w[i - 1].x), down = w.every((p, i) => !i || p.x < w[i - 1].x); if (up || down) add('7T', 'within the level', w); }
      }
    }
    const reject = vio.some((v) => v.rule !== '1-2s' || !warn12);
    out.push({ run: r, label: opt.labels?.[r] ?? String(r + 1), z: row, status: reject ? 'reject' : vio.length ? 'warning' : 'ok', violations: vio });
  });
  return out;
}

/** Mean, SD and CV (%) of one level's results. */
export function levelStats(v: number[]) {
  const n = v.length, m = v.reduce((s, x) => s + x, 0) / n;
  const sd = n > 1 ? Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / (n - 1)) : NaN;
  return { n, mean: m, sd, cv: (100 * sd) / Math.abs(m) };
}

/** Sigma metric = (TEa% − |bias%|) / CV%. */
export const sigmaMetric = (tea: number, bias: number, cv: number) => (tea - Math.abs(bias)) / cv;
