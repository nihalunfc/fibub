// SAR table maths: a compound series with R-group columns and an activity, turned into pIC50 (or pKi, pEC50...),
// ligand efficiency, LLE, an R-group by R-group potency matrix and matched pairs (compounds that differ at exactly
// one R position) with the average effect of each substituent change. No chemistry parsing: R groups are labels.
// Plain TypeScript, no DOM.
import { num } from './num.ts';

/** 2.303·R·T in kcal/mol, the usual rounded factor in ligand efficiency (1.364 at 298 K, 1.372 at 300 K). */
export const LE_K = 1.37;

export type Unit = 'pM' | 'nM' | 'uM' | 'mM' | 'M' | 'p';
export const UNITS: Record<Unit, string> = { pM: 'pM', nM: 'nM', uM: 'µM', mM: 'mM', M: 'M', p: 'already a p value (−log M)' };
const EXP: Record<Exclude<Unit, 'p'>, number> = { pM: 12, nM: 9, uM: 6, mM: 3, M: 0 };

export interface Cpd {
  row: number; id: string; r: string[]; raw: string; value: number; qual: '' | '<' | '>';
  p: number; ha: number; logp: number; le: number; lle: number;
}
export interface Series {
  rNames: string[]; actName: string; pName: string; unit: Unit; cpds: Cpd[];
  hasHA: boolean; hasLogP: boolean; haName: string; logpName: string; idName: string;
}
export interface Combo { key: string; r: string[]; p: number; n: number; ids: string[]; censored: boolean; qual: '' | '<' | '>' }
export interface Pair { pos: number; from: string; to: string; a: Combo; b: Combo; delta: number }
export interface Transform { pos: number; from: string; to: string; n: number; mean: number; sd: number; min: number; max: number; pairs: Pair[] }
export interface GroupScore { group: string; n: number; meanP: number; pairs: number; score: number }
export interface Matrix { rows: string[]; cols: string[]; cells: { mean: number; n: number; censored: boolean }[][] }

/** p value (−log10 of the molar value) from a value in a unit. */
export function toP(v: number, unit: Unit): number {
  if (unit === 'p') return v;
  return EXP[unit] - Math.log10(v);
}

/** The unit written in an activity header, such as "IC50 (nM)", "Ki uM" or "pIC50". null if none is written. */
export function unitFromHeader(h: string): Unit | null {
  const t = h.replace(/μ/g, 'µ');
  if (/^\s*p(ic|ec|ki|kd|ac|gi|ed|a\b|act)/i.test(t)) return 'p';
  if (/(^|[^a-z])pM\b/.test(t)) return 'pM';
  if (/(^|[^a-z])nM\b/i.test(t)) return 'nM';
  if (/(^|[^a-z])(µ|u)M\b/i.test(t)) return 'uM';
  if (/(^|[^a-z])mM\b/.test(t)) return 'mM';
  if (/[\s(\[]M[)\]]?\s*$/.test(t)) return 'M';
  return null;
}

const isAct = (h: string) => /ic50|ec50|ki\b|kd\b|ki[\s(]|kd[\s(]|^p(ic|ec|ki|kd|ac|a)\w*|activity|potency|^act\b|ac50|gi50|ed50/i.test(h.trim());
const isHA = (h: string) => /^\s*(ha|hac|nha|heavy)/i.test(h);
const isLogP = (h: string) => /^\s*c?log\s*[pd]|^\s*xlogp|^\s*alogp/i.test(h);
const isId = (h: string) => /^\s*(id|cpd|compound|name|code|number|molecule)\b|^\s*(#|no\.?)\s*$/i.test(h);

/** The p-scale name for an activity header: pIC50, pKi, pEC50, pKd, or the header itself when it is already p. */
export function pNameFor(h: string, unit: Unit): string {
  const t = h.trim();
  if (unit === 'p') { const m = t.match(/^p[A-Za-z0-9]+/); return m ? m[0] : 'pAct'; }
  const m = t.match(/ic50|ec50|ac50|gi50|ed50|ki|kd/i);
  if (!m) return 'pAct';
  const s = m[0].toLowerCase();
  return 'p' + (s === 'ki' ? 'Ki' : s === 'kd' ? 'Kd' : s.toUpperCase());
}

/**
 * Read a pasted table: a header row, then one compound per row. Columns are recognised by their headers: an ID
 * (ID, Cpd, Compound, Name), the activity (IC50, Ki, EC50, Kd, pIC50, Activity...), heavy atoms (HA, HAC, Heavy
 * atoms) and logP (logP, cLogP, logD); every other column is an R group. Activity values may start with < or >.
 */
export function parseSeries(rows: string[][], unitIn: Unit | 'auto' = 'auto'): Series {
  const R = rows.filter((r) => r.some((c) => c.trim() !== ''));
  if (R.length < 3) throw new Error('Paste a header row and at least two compounds (one per line).');
  const head = R[0].map((h) => h.trim());
  if (head.every((h) => h === '' || Number.isFinite(num(h)))) throw new Error('The first row must be the column names, such as ID, R1, R2, IC50 (nM).');
  const actCols = head.map((h, i) => (isAct(h) ? i : -1)).filter((i) => i >= 0);
  if (!actCols.length) throw new Error('No activity column found. Name it IC50, Ki, EC50, Kd, pIC50 or Activity, with the unit, e.g. "IC50 (nM)".');
  const act = actCols[0];
  const ha = head.findIndex((h, i) => i !== act && isHA(h));
  const lp = head.findIndex((h, i) => i !== act && isLogP(h));
  let id = head.findIndex((h, i) => i !== act && i !== ha && i !== lp && isId(h));
  const rCols = head.map((_, i) => i).filter((i) => i !== act && i !== ha && i !== lp && i !== id && !actCols.includes(i));
  if (id < 0 && rCols.length > 1 && head[rCols[0]] === '') { id = rCols.shift()!; }
  if (!rCols.length) throw new Error('No R-group columns found. Add columns such as R1 and R2 holding each compound\'s substituents.');
  if (rCols.length > 8) throw new Error('Up to 8 R-group columns, please.');
  let unit: Unit;
  if (unitIn === 'auto') {
    const u = unitFromHeader(head[act]);
    if (!u) throw new Error(`Say the unit of "${head[act]}": write it in the header, e.g. "IC50 (nM)", or pick it under Units.`);
    unit = u;
  } else unit = unitIn;
  const cpds: Cpd[] = [];
  for (let k = 1; k < R.length; k++) {
    const row = R[k], line = k + 1;
    const cid = id >= 0 ? (row[id] ?? '').trim() : '';
    const r = rCols.map((c) => (row[c] ?? '').trim());
    const miss = r.findIndex((x) => x === '');
    if (miss >= 0) throw new Error(`Line ${line}: ${head[rCols[miss]] || 'an R group'} is empty. Type the group, or H or – for none.`);
    const raw = (row[act] ?? '').trim();
    let qual: '' | '<' | '>' = '';
    const m = raw.match(/^([<>≤≥]=?)\s*(.*)$/);
    let t = raw;
    if (m) { qual = m[1][0] === '<' || m[1][0] === '≤' ? '<' : '>'; t = m[2]; }
    const v = num(t);
    if (!Number.isFinite(v)) throw new Error(`Line ${line}: the activity "${raw}" is not a number.`);
    if (unit !== 'p' && v <= 0) throw new Error(`Line ${line}: an ${head[act]} must be above 0.`);
    if (unit === 'p' && (v < 0 || v > 15)) throw new Error(`Line ${line}: ${raw} is outside the usual p range (0 to 15). Is the unit right?`);
    const p = toP(v, unit);
    // A value "<10 nM" means more potent than 10 nM, so pIC50 > 8; on the p scale the sign flips.
    const pq: '' | '<' | '>' = unit === 'p' ? qual : qual === '<' ? '>' : qual === '>' ? '<' : '';
    const hav = ha >= 0 ? num(row[ha]) : NaN, lpv = lp >= 0 ? num(row[lp]) : NaN;
    if (ha >= 0 && (row[ha] ?? '').trim() !== '' && !(hav > 0)) throw new Error(`Line ${line}: the heavy atom count "${row[ha]}" must be a whole number above 0.`);
    cpds.push({
      row: line, id: cid || `#${k}`, r, raw, value: v, qual: pq, p,
      ha: hav, logp: lpv, le: hav > 0 ? (LE_K * p) / hav : NaN, lle: Number.isFinite(lpv) ? p - lpv : NaN,
    });
  }
  if (cpds.length < 2) throw new Error('Give at least two compounds.');
  if (cpds.length > 2000) throw new Error('Up to 2000 compounds, please.');
  return {
    rNames: rCols.map((c, i) => head[c] || `R${i + 1}`), actName: head[act], pName: pNameFor(head[act], unit), unit, cpds,
    hasHA: ha >= 0 && cpds.some((c) => Number.isFinite(c.ha)), hasLogP: lp >= 0 && cpds.some((c) => Number.isFinite(c.logp)),
    haName: ha >= 0 ? head[ha] : '', logpName: lp >= 0 ? head[lp] : '', idName: id >= 0 ? head[id] || 'ID' : 'ID',
  };
}

const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;

/**
 * One entry per distinct set of R groups. Repeats are averaged on the p scale (the geometric mean of the IC50s).
 * A value given only as a limit (< or >) is left out of the mean when the same compound also has a measured value;
 * a compound with only limits is marked censored and left out of matched pairs.
 */
export function combos(s: Series): Combo[] {
  const map = new Map<string, Cpd[]>();
  for (const c of s.cpds) { const k = c.r.join('\u0001'); (map.get(k) ?? map.set(k, []).get(k)!).push(c); }
  return [...map.entries()].map(([key, cs]) => {
    const exact = cs.filter((c) => !c.qual), use = exact.length ? exact : cs;
    const censored = !exact.length;
    const quals = new Set(use.map((c) => c.qual));
    return { key, r: cs[0].r, p: mean(use.map((c) => c.p)), n: cs.length, ids: cs.map((c) => c.id), censored, qual: censored && quals.size === 1 ? use[0].qual : '' };
  });
}

/** Groups at one position, in the order they first appear. */
export function groupsAt(s: Series, pos: number): string[] {
  return [...new Set(s.cpds.map((c) => c.r[pos]))];
}

/**
 * Matched pairs: every two distinct compounds (R-group sets) that differ at exactly one position, both measured
 * (not censored). Each pair is oriented from the group that appears first in the table to the later one, and
 * delta = p(to) − p(from).
 */
export function matchedPairs(s: Series, cs = combos(s)): Pair[] {
  const order = s.rNames.map((_, i) => new Map(groupsAt(s, i).map((g, k) => [g, k])));
  const ok = cs.filter((c) => !c.censored), out: Pair[] = [];
  for (let i = 0; i < ok.length; i++) for (let j = i + 1; j < ok.length; j++) {
    let diff = -1, nd = 0;
    for (let k = 0; k < s.rNames.length; k++) if (ok[i].r[k] !== ok[j].r[k]) { diff = k; nd++; if (nd > 1) break; }
    if (nd !== 1) continue;
    let a = ok[i], b = ok[j];
    if (order[diff].get(a.r[diff])! > order[diff].get(b.r[diff])!) [a, b] = [b, a];
    out.push({ pos: diff, from: a.r[diff], to: b.r[diff], a, b, delta: b.p - a.p });
  }
  return out;
}

/** The average effect of each substituent change (position, from → to) over all its matched pairs. SD is the sample SD (n − 1). */
export function transforms(pairs: Pair[]): Transform[] {
  const map = new Map<string, Pair[]>();
  for (const p of pairs) { const k = `${p.pos}\u0001${p.from}\u0001${p.to}`; (map.get(k) ?? map.set(k, []).get(k)!).push(p); }
  return [...map.values()].map((ps) => {
    const d = ps.map((p) => p.delta), m = mean(d);
    const sd = d.length > 1 ? Math.sqrt(d.reduce((s, x) => s + (x - m) ** 2, 0) / (d.length - 1)) : NaN;
    return { pos: ps[0].pos, from: ps[0].from, to: ps[0].to, n: d.length, mean: m, sd, min: Math.min(...d), max: Math.max(...d), pairs: ps };
  }).sort((x, y) => x.pos - y.pos || Math.abs(y.mean) - Math.abs(x.mean));
}

/**
 * Each group at a position: how many compounds carry it, their mean p value, and its matched-pair score: the mean
 * of p(this group) − p(other group) over every matched pair at that position that involves it (all else equal).
 * Sorted best first by score; groups without pairs go last, by mean p.
 */
export function groupScores(s: Series, pos: number, pairs: Pair[], cs = combos(s)): GroupScore[] {
  return groupsAt(s, pos).map((g) => {
    const mine = cs.filter((c) => c.r[pos] === g && !c.censored);
    const d: number[] = [];
    for (const p of pairs) if (p.pos === pos) { if (p.to === g) d.push(p.delta); else if (p.from === g) d.push(-p.delta); }
    return { group: g, n: cs.filter((c) => c.r[pos] === g).length, meanP: mine.length ? mean(mine.map((c) => c.p)) : NaN, pairs: d.length, score: d.length ? mean(d) : NaN };
  }).sort((x, y) => (Number.isFinite(y.score) ? 1 : 0) - (Number.isFinite(x.score) ? 1 : 0) || (Number.isFinite(x.score) ? y.score - x.score : (y.meanP || -1e9) - (x.meanP || -1e9)));
}

/**
 * Potency matrix of one position (rows) against another (columns): each cell is the mean p value of the compounds
 * with that pair of groups (averaged over any other positions). Censored values count only when a cell has nothing else.
 * order 'input' keeps the table's order; 'potency' sorts rows and columns by their mean p value, best first.
 */
export function matrix(s: Series, ri: number, ci: number, order: 'input' | 'potency' = 'input', cs = combos(s)): Matrix {
  let rows = groupsAt(s, ri), cols = groupsAt(s, ci);
  const cell = (a: string, b: string) => {
    const m = cs.filter((c) => c.r[ri] === a && c.r[ci] === b), ex = m.filter((c) => !c.censored), use = ex.length ? ex : m;
    return { mean: use.length ? mean(use.map((c) => c.p)) : NaN, n: m.length, censored: !ex.length && m.length > 0 };
  };
  if (order === 'potency') {
    const avg = (list: number[]) => (list.length ? mean(list) : -Infinity);
    const rm = new Map(rows.map((a) => [a, avg(cs.filter((c) => c.r[ri] === a && !c.censored).map((c) => c.p))]));
    const cm = new Map(cols.map((b) => [b, avg(cs.filter((c) => c.r[ci] === b && !c.censored).map((c) => c.p))]));
    rows = [...rows].sort((x, y) => rm.get(y)! - rm.get(x)!); cols = [...cols].sort((x, y) => cm.get(y)! - cm.get(x)!);
  }
  return { rows, cols, cells: rows.map((a) => cols.map((b) => cell(a, b))) };
}

/** Back from a p value to a concentration in a unit, for showing "pIC50 7.25 = 56 nM". */
export function fromP(p: number, unit: Exclude<Unit, 'p'>): number {
  return 10 ** (EXP[unit] - p);
}

/** The page's made-up example series: two R positions, IC50 in nM, heavy atom counts and cLogP, one value given as a limit. */
export const EXAMPLE = `ID,R1,R2,IC50 (nM),HA,cLogP
SAR-01,H,NHMe,730,20,1.7
SAR-02,H,NMe2,2200,21,2.1
SAR-03,H,morpholino,190,24,1.7
SAR-04,H,NH-cPr,190,22,2.6
SAR-05,4-F,NHMe,340,21,1.8
SAR-06,4-F,NMe2,1300,22,2.1
SAR-07,4-F,morpholino,67,25,2.0
SAR-08,4-F,piperidino,220,25,3.2
SAR-09,4-F,NH-cPr,200,23,2.6
SAR-10,4-Cl,NHMe,150,21,2.4
SAR-11,4-Cl,NMe2,330,22,2.8
SAR-12,4-Cl,morpholino,5.6,25,2.6
SAR-13,4-Cl,piperidino,110,25,4.1
SAR-14,4-Cl,NH-cPr,51,23,3.0
SAR-15,4-OMe,NHMe,260,22,1.8
SAR-16,4-OMe,NMe2,710,23,2.1
SAR-17,4-OMe,morpholino,200,26,1.9
SAR-18,4-OMe,piperidino,220,26,3.1
SAR-19,3-CF3,NHMe,160,24,2.7
SAR-20,3-CF3,morpholino,90,28,2.7
SAR-21,3-CF3,piperidino,100,28,4.2
SAR-22,3-CF3,NH-cPr,39,26,3.3
SAR-23,4-CN,NHMe,750,22,1.2
SAR-24,4-CN,NMe2,>10000,23,1.6
SAR-25,4-CN,morpholino,260,26,1.1
`;
