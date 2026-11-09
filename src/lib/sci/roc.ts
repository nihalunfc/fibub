// ROC analysis of a diagnostic marker for study and teaching: the empirical ROC curve, the area under it (AUC) with
// DeLong's standard error and interval, DeLong's test for two markers measured on the same subjects, the Youden
// cut-off and a table of sensitivity and specificity at every threshold. No DOM.
// Sources: Hanley and McNeil (1982) Radiology 143:29 (AUC as the Mann-Whitney statistic); DeLong, DeLong and
// Clarke-Pearson (1988) Biometrics 44:837; Sun and Xu (2014) IEEE Signal Processing Letters 21:1389 (fast
// mid-rank form); Youden (1950) Cancer 3:32. Results match scikit-learn (roc_curve, roc_auc_score) and a direct
// numpy DeLong implementation.
import { normCdf, normInv } from './stats.ts';
import { parseTable, num } from './num.ts';

export type RocPoint = { threshold: number; tp: number; fp: number; tn: number; fn: number; sens: number; spec: number; fpr: number; ppv: number; npv: number; lrPos: number; lrNeg: number; j: number };
export type RocResult = { auc: number; se: number; lo: number; hi: number; points: RocPoint[]; best: RocPoint; nPos: number; nNeg: number; z: number; p: number };

/** Mid-ranks (1-based, ties share the average rank). */
function midrank(x: number[]): number[] {
  const idx = x.map((_, i) => i).sort((a, b) => x[a] - x[b]), r = Array(x.length);
  let i = 0;
  while (i < idx.length) {
    let j = i;
    while (j + 1 < idx.length && x[idx[j + 1]] === x[idx[i]]) j++;
    const m = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) r[idx[k]] = m;
    i = j + 1;
  }
  return r;
}
/** DeLong placement values: V10 for each positive, V01 for each negative; their means are the AUC. */
function placements(pos: number[], neg: number[]) {
  const m = pos.length, n = neg.length;
  const tz = midrank([...pos, ...neg]), tx = midrank(pos), ty = midrank(neg);
  const v10 = pos.map((_, i) => (tz[i] - tx[i]) / n);
  const v01 = neg.map((_, j) => 1 - (tz[m + j] - ty[j]) / m);
  return { v10, v01 };
}
const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
const cov = (a: number[], b: number[]) => { const ma = mean(a), mb = mean(b); return a.reduce((s, x, i) => s + (x - ma) * (b[i] - mb), 0) / (a.length - 1); };

/** Every threshold: "positive" means score >= threshold. Thresholds run from high to low, starting above the top. */
export function rocPoints(pos: number[], neg: number[]): RocPoint[] {
  const m = pos.length, n = neg.length;
  const all = [...new Set([...pos, ...neg])].sort((a, b) => b - a);
  const ps = [...pos].sort((a, b) => b - a), ns = [...neg].sort((a, b) => b - a);
  const pts: RocPoint[] = [];
  const mk = (threshold: number, tp: number, fp: number): RocPoint => {
    const fn = m - tp, tn = n - fp, sens = tp / m, spec = tn / n;
    return { threshold, tp, fp, tn, fn, sens, spec, fpr: 1 - spec, ppv: tp + fp ? tp / (tp + fp) : NaN, npv: tn + fn ? tn / (tn + fn) : NaN, lrPos: spec < 1 ? sens / (1 - spec) : Infinity, lrNeg: spec > 0 ? (1 - sens) / spec : Infinity, j: sens + spec - 1 };
  };
  pts.push(mk(Infinity, 0, 0));
  let tp = 0, fp = 0, i = 0, k = 0;
  for (const t of all) {
    while (i < m && ps[i] >= t) { tp++; i++; }
    while (k < n && ns[k] >= t) { fp++; k++; }
    pts.push(mk(t, tp, fp));
  }
  return pts;
}

/** ROC analysis of one marker. `higher` true: larger values point to the condition. */
export function roc(pos: number[], neg: number[], higher = true, conf = 0.95): RocResult {
  if (pos.length < 2 || neg.length < 2) throw new Error(`ROC analysis needs at least 2 positive and 2 negative subjects (here ${pos.length} and ${neg.length}).`);
  const P = higher ? pos : pos.map((v) => -v), N = higher ? neg : neg.map((v) => -v);
  const { v10, v01 } = placements(P, N);
  const auc = mean(v10), se = Math.sqrt(cov(v10, v10) / P.length + cov(v01, v01) / N.length);
  const zc = normInv(1 - (1 - conf) / 2);
  const pts = rocPoints(P, N).map((p) => ({ ...p, threshold: higher ? p.threshold : -p.threshold }));
  // Youden's J: the largest sensitivity + specificity − 1; ties go to the first (strictest) threshold.
  let best = pts[0];
  for (const p of pts) if (p.j > best.j + 1e-12) best = p;
  const z = se > 0 ? (auc - 0.5) / se : NaN;
  return { auc, se, lo: Math.max(0, auc - zc * se), hi: Math.min(1, auc + zc * se), points: pts, best, nPos: P.length, nNeg: N.length, z, p: Number.isFinite(z) ? 2 * normCdf(-Math.abs(z)) : NaN };
}

export type RocCompare = { auc1: number; auc2: number; diff: number; se: number; lo: number; hi: number; z: number; p: number; corr: number };

/** DeLong's test of two correlated AUCs (two markers on the same subjects). */
export function compareRoc(pos1: number[], neg1: number[], pos2: number[], neg2: number[], higher1 = true, higher2 = true, conf = 0.95): RocCompare {
  const f = (a: number[], h: boolean) => (h ? a : a.map((v) => -v));
  const a = placements(f(pos1, higher1), f(neg1, higher1)), b = placements(f(pos2, higher2), f(neg2, higher2));
  const m = pos1.length, n = neg1.length;
  const s11 = cov(a.v10, a.v10) / m + cov(a.v01, a.v01) / n, s22 = cov(b.v10, b.v10) / m + cov(b.v01, b.v01) / n;
  const s12 = cov(a.v10, b.v10) / m + cov(a.v01, b.v01) / n;
  const auc1 = mean(a.v10), auc2 = mean(b.v10), diff = auc1 - auc2, se = Math.sqrt(Math.max(0, s11 + s22 - 2 * s12));
  const z = se > 0 ? diff / se : NaN, zc = normInv(1 - (1 - conf) / 2);
  return { auc1, auc2, diff, se, lo: diff - zc * se, hi: diff + zc * se, z, p: Number.isFinite(z) ? 2 * normCdf(-Math.abs(z)) : NaN, corr: s12 / Math.sqrt(s11 * s22) };
}

export type RocData = { labels: string[]; markers: string[]; rows: { y: string; v: number[] }[]; skipped: number };
/** Pasted rows: outcome, then one or two marker columns. A non-numeric first row of markers is the header. */
export function parseRoc(text: string): RocData {
  const all = parseTable(text);
  if (!all.length) throw new Error('Paste your data first: outcome (1 = has the condition, 0 = does not), then one or two marker columns.');
  const head = all[0].slice(1).some((c) => c.trim() !== '' && !Number.isFinite(num(c))) ? all[0] : null;
  const body = head ? all.slice(1) : all;
  const width = Math.max(...body.map((r) => r.length));
  if (width < 2) throw new Error('Each row needs the outcome and at least one marker value.');
  const k = Math.min(2, width - 1);
  const markers = Array.from({ length: k }, (_, j) => head?.[j + 1]?.trim() || `Marker ${j + 1}`);
  const rows: { y: string; v: number[] }[] = [];
  let skipped = 0;
  for (const r of body) {
    const y = (r[0] ?? '').trim(), v = markers.map((_, j) => num(r[j + 1]));
    if (!y || v.some((x) => !Number.isFinite(x))) { skipped++; continue; }
    rows.push({ y, v });
  }
  const labels = [...new Set(rows.map((r) => r.y))].sort((a, b) => (Number.isFinite(num(a)) && Number.isFinite(num(b)) ? num(a) - num(b) : a.localeCompare(b)));
  if (labels.length !== 2) throw new Error(labels.length < 2 ? 'The outcome column needs two different values (such as 1 and 0, or disease and healthy).' : `The outcome column has ${labels.length} different values (${labels.slice(0, 4).join(', ')}${labels.length > 4 ? ', …' : ''}); it needs exactly two.`);
  return { labels, markers, rows, skipped };
}
