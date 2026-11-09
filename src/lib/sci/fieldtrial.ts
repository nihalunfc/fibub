// Field trial layouts: completely randomised (CRD), randomised complete block (RCBD) and Latin square designs,
// randomised with a seeded generator so the same seed and inputs always give the same layout. Plain TypeScript,
// no DOM. Methods: Fisher-Yates shuffle (Knuth, TAOCP vol. 2, Algorithm P); the Latin square is a cyclic square
// with its rows, columns and treatment labels shuffled (Fisher and Yates' randomisation, as in Cochran and Cox,
// Experimental Designs).

export type DesignId = 'crd' | 'rcbd' | 'latin';
export type Plot = { plot: number; row: number; col: number; block: number; rep: number; trt: string };
export type Layout = { design: DesignId; rows: number; cols: number; plots: Plot[]; seed: number; treatments: string[]; reps: number };

/** mulberry32: a small, fast 32-bit seeded generator. Returns numbers in [0, 1). */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates shuffle of a copy, using rng(). */
export function shuffle<T>(a: T[], rng: () => number): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

/** Treatment names from text: one per line or comma separated; blank entries dropped. */
export function readTreatments(text: string): string[] {
  return text.split(/[\n,;\t]+/).map((s) => s.trim()).filter(Boolean);
}

export type Opts = {
  design: DesignId; treatments: string[]; reps: number; seed: number;
  /** CRD only: plots per row of the field map (default: the number of treatments). */
  cols?: number;
  /** Plot numbers: 'serial' (1, 2, 3 ...) or 'block' (101, 102 ... 201, 202 ...; rows for a Latin square and CRD). */
  numbering?: 'serial' | 'block';
  /** Serpentine numbering: every second row runs right to left, the way a planter drives up and down the field. */
  serpentine?: boolean;
};

export function design(o: Opts): Layout {
  const t = o.treatments.length;
  if (t < 2) throw new Error('Enter at least 2 treatments.');
  if (new Set(o.treatments).size !== t) throw new Error('Each treatment name must be different.');
  const rng = mulberry32(o.seed);
  let rows: number, cols: number, cells: { row: number; col: number; block: number; rep: number; trt: string }[] = [];
  let reps = o.reps;
  if (o.design === 'latin') {
    if (t > 26) throw new Error('A Latin square is limited to 26 treatments here (26 × 26 plots).');
    reps = t; rows = t; cols = t;
    const rp = shuffle([...Array(t).keys()], rng), cp = shuffle([...Array(t).keys()], rng), lp = shuffle(o.treatments, rng);
    for (let r = 0; r < t; r++) for (let c = 0; c < t; c++) cells.push({ row: r + 1, col: c + 1, block: r + 1, rep: c + 1, trt: lp[(rp[r] + cp[c]) % t] });
  } else {
    if (!(reps >= 1 && Number.isInteger(reps))) throw new Error('Replicates must be a whole number of 1 or more.');
    if (t * reps > 5000) throw new Error('That is over 5,000 plots. Use fewer treatments or replicates.');
    if (o.design === 'rcbd') {
      if (reps < 2) throw new Error('A randomised complete block design needs at least 2 blocks.');
      rows = reps; cols = t;
      for (let b = 0; b < reps; b++) shuffle(o.treatments, rng).forEach((trt, c) => cells.push({ row: b + 1, col: c + 1, block: b + 1, rep: b + 1, trt }));
    } else {
      cols = Math.max(1, Math.min(t * reps, Math.round(o.cols ?? t)));
      rows = Math.ceil((t * reps) / cols);
      const all = o.treatments.flatMap((trt) => Array.from({ length: reps }, (_, k) => ({ trt, rep: k + 1 })));
      shuffle(all, rng).forEach((p, i) => cells.push({ row: Math.floor(i / cols) + 1, col: (i % cols) + 1, block: 0, rep: p.rep, trt: p.trt }));
    }
  }
  const plots: Plot[] = [];
  const byRow = new Map<number, typeof cells>();
  for (const c of cells) { if (!byRow.has(c.row)) byRow.set(c.row, []); byRow.get(c.row)!.push(c); }
  let n = 0;
  for (const [r, rc] of [...byRow.entries()].sort((a, b) => a[0] - b[0])) {
    const ordered = rc.slice().sort((a, b) => (o.serpentine && r % 2 === 0 ? b.col - a.col : a.col - b.col));
    ordered.forEach((c, k) => { n++; plots.push({ ...c, plot: o.numbering === 'block' ? r * (cols >= 100 ? 1000 : 100) + k + 1 : n }); });
  }
  return { design: o.design, rows, cols, plots, seed: o.seed, treatments: o.treatments.slice(), reps };
}

/** Checks that the layout really is the design it claims. Returns a list of problems (empty when valid). */
export function validate(L: Layout): string[] {
  const out: string[] = [], t = L.treatments.length;
  const count = (ps: Plot[]) => { const m = new Map<string, number>(); for (const p of ps) m.set(p.trt, (m.get(p.trt) ?? 0) + 1); return m; };
  const once = (ps: Plot[], what: string) => {
    const m = count(ps);
    for (const tr of L.treatments) if (m.get(tr) !== 1) out.push(`${tr} appears ${m.get(tr) ?? 0} times in ${what}.`);
  };
  if (new Set(L.plots.map((p) => p.plot)).size !== L.plots.length) out.push('Two plots share a number.');
  if (new Set(L.plots.map((p) => `${p.row},${p.col}`)).size !== L.plots.length) out.push('Two plots share a place on the map.');
  const total = count(L.plots);
  for (const tr of L.treatments) if (total.get(tr) !== L.reps) out.push(`${tr} has ${total.get(tr) ?? 0} plots, not ${L.reps}.`);
  if (L.design === 'rcbd') for (let b = 1; b <= L.reps; b++) once(L.plots.filter((p) => p.block === b), `block ${b}`);
  if (L.design === 'latin') for (let k = 1; k <= t; k++) { once(L.plots.filter((p) => p.row === k), `row ${k}`); once(L.plots.filter((p) => p.col === k), `column ${k}`); }
  return out;
}

/** The layout as CSV, in plot-number order. */
export function toCsv(L: Layout): string {
  const head = L.design === 'rcbd' ? 'plot,block,column,treatment' : L.design === 'latin' ? 'plot,row,column,treatment' : 'plot,row,column,replicate,treatment';
  const q = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
  const rows = L.plots.slice().sort((a, b) => a.plot - b.plot).map((p) => (L.design === 'crd' ? [p.plot, p.row, p.col, p.rep, q(p.trt)] : [p.plot, p.row, p.col, q(p.trt)]).join(','));
  return [head, ...rows].join('\n') + '\n';
}

/** The skeleton of the analysis of variance for the layout (sources and degrees of freedom). */
export function dfTable(L: Layout): [string, number][] {
  const t = L.treatments.length, r = L.reps;
  if (L.design === 'crd') return [['Treatments', t - 1], ['Error', t * r - t], ['Total', t * r - 1]];
  if (L.design === 'rcbd') return [['Blocks', r - 1], ['Treatments', t - 1], ['Error', (r - 1) * (t - 1)], ['Total', t * r - 1]];
  return [['Rows', t - 1], ['Columns', t - 1], ['Treatments', t - 1], ['Error', (t - 1) * (t - 2)], ['Total', t * t - 1]];
}

export const EXAMPLE_TREATMENTS = ['Variety A', 'Variety B', 'Variety C', 'Variety D', 'Variety E'];
