// Virus titres from an endpoint dilution series (TCID50 by Reed–Muench and Spearman–Kärber) and from a plaque
// assay (PFU/mL with an exact Poisson interval). Dilutions are held as d = log10 of the dilution factor, so a
// 1:1000 (10⁻³) dilution is d = 3 and larger d is weaker. No DOM.
//
// Reed–Muench (1938): sort from strongest to weakest; cumulative infected wells are added up from the weakest
// dilution upwards, cumulative uninfected wells from the strongest downwards; the 50 % endpoint is interpolated
// on d between the two dilutions whose cumulative percentage infected brackets 50 %.
// Spearman–Kärber: from the weakest dilution where every well is infected (p = 1) to the last dilution, which
// must have none infected (p = 0), the endpoint is that first d plus the area under p(d) by the trapezium rule;
// with an even step this is d₀ − step/2 + step·Σp. Its standard error is
// sqrt(Σ wᵢ² pᵢ(1 − pᵢ)/(nᵢ − 1)), with wᵢ the half-distance between neighbours (the step, for an even series).
// A titre is 10^endpoint TCID50 per inoculum, divided by the inoculum volume for TCID50/mL. One TCID50 infects
// half the wells, so by the Poisson zero term e^−m = 0.5 it holds on average m = ln 2 ≈ 0.69 infectious units.
import { normInv, logGamma } from './stats.ts';

export type Row = { d: number; pos: number; n: number };
export type RMRow = Row & { neg: number; cumPos: number; cumNeg: number; pct: number };
export type RM = { rows: RMRow[]; above: number; below: number; pd: number; log50: number };
export type SK = { log50: number; se: number; lo: number; hi: number; from: number; to: number; conf: number };

const SUPS: Record<string, string> = { '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '·': '.' };

/**
 * A dilution as people write it, as d = log10 of the dilution factor: "1:1000", "1/1000", "10^-3", "10⁻³",
 * "10-3", "1e-3" or "0.001" (a fraction), "1000" (a factor) and "-3" (a log10 dilution) all give 3. NaN if unreadable.
 */
export function parseDilution(s: string): number {
  let t = String(s ?? '').trim().replace(/[−–]/g, '-').replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹·]/g, (c) => SUPS[c]).replace(/\s+/g, '');
  if (!t) return NaN;
  if (/[:/]/.test(t) || /^\d{1,3}(,\d{3})+$/.test(t)) t = t.replace(/,/g, ''); else t = t.replace(',', '.');
  let m = /^1[:/](\d+(?:\.\d+)?(?:e\d+)?)$/i.exec(t);
  if (m) { const f = Number(m[1]); return f >= 1 ? Math.log10(f) : NaN; }
  m = /^10(?:\^[-+]?|\*\*-?|-)(\d+(?:\.\d+)?)$/.exec(t);
  if (m) return Number(m[1]);
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return NaN;
  const x = Number(t);
  if (x < 0) return -x;
  if (x === 0) return NaN;
  return x >= 1 ? Math.log10(x) : -Math.log10(x);
}

/** "10⁻³" for whole steps, "10⁻²·⁵" for half-logs, "1:316" otherwise. */
export function dilutionLabel(d: number): string {
  const sup = (s: string) => s.replace(/./g, (c) => ({ '-': '⁻', '.': '·', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' } as Record<string, string>)[c] ?? c);
  if (Math.abs(d - Math.round(d)) < 1e-9) return d === 0 ? 'undiluted' : `10${sup(String(-Math.round(d)))}`;
  if (Math.abs(d * 2 - Math.round(d * 2)) < 1e-9) return `10${sup(String(-d))}`;
  const f = 10 ** d;
  return `1:${f >= 100 ? Math.round(f).toLocaleString('en-US') : Number(f.toPrecision(3))}`;
}
/** The same dilution as text a person can type back in: "10^-3". */
export const dilutionText = (d: number) => (Math.abs(d * 1000 - Math.round(d * 1000)) < 1e-6 ? `10^-${+d.toFixed(3)}` : `1:${+(10 ** d).toPrecision(6)}`);

/** Check and sort rows (strongest first). Throws a plain message for bad input. */
export function checkRows(rows: Row[]): Row[] {
  if (rows.length < 2) throw new Error('Type at least two dilutions, each with its infected and total wells.');
  rows.forEach((r, i) => {
    const k = `Dilution ${i + 1}`;
    if (!Number.isFinite(r.d) || r.d < 0) throw new Error(`${k}: write the dilution as 1:1000, 10^-3 or 0.001.`);
    if (!(Number.isInteger(r.n) && r.n >= 1)) throw new Error(`${k}: the number of wells must be a whole number, 1 or more.`);
    if (!(Number.isInteger(r.pos) && r.pos >= 0)) throw new Error(`${k}: the infected wells must be a whole number, 0 or more.`);
    if (r.pos > r.n) throw new Error(`${k}: more infected wells (${r.pos}) than wells (${r.n}).`);
  });
  const s = [...rows].sort((a, b) => a.d - b.d);
  for (let i = 1; i < s.length; i++) if (Math.abs(s[i].d - s[i - 1].d) < 1e-9) throw new Error(`The dilution ${dilutionLabel(s[i].d)} is listed twice. Put all its wells on one line.`);
  return s;
}

/** Reed–Muench 50 % endpoint, as log10 dilution factor. Throws when the series does not cross 50 %. */
export function reedMuench(input: Row[]): RM {
  const s = checkRows(input);
  const rows: RMRow[] = s.map((r) => ({ ...r, neg: r.n - r.pos, cumPos: 0, cumNeg: 0, pct: 0 }));
  let c = 0;
  for (let i = rows.length - 1; i >= 0; i--) { c += rows[i].pos; rows[i].cumPos = c; }
  c = 0;
  for (const r of rows) { c += r.neg; r.cumNeg = c; r.pct = (100 * r.cumPos) / (r.cumPos + r.cumNeg); }
  let a = -1;
  rows.forEach((r, i) => { if (r.pct >= 50) a = i; });
  if (a < 0) throw new Error('Fewer than half the wells are infected even at the strongest dilution, so the endpoint is stronger than your series. Add stronger dilutions.');
  if (a === rows.length - 1) throw new Error('Half or more of the wells are still infected at the weakest dilution, so the endpoint is beyond your series. Add weaker dilutions.');
  const A = rows[a], B = rows[a + 1];
  const pd = (A.pct - 50) / (A.pct - B.pct);
  return { rows, above: a, below: a + 1, pd, log50: A.d + pd * (B.d - A.d) };
}

/** Spearman–Kärber 50 % endpoint with its standard error and interval (default 95 %). */
export function spearmanKarber(input: Row[], conf = 0.95): SK {
  const s = checkRows(input);
  const p = s.map((r) => r.pos / r.n);
  let k0 = -1;
  p.forEach((x, i) => { if (x === 1) k0 = i; });
  if (k0 < 0) throw new Error('Spearman–Kärber needs a dilution where every well is infected. Add stronger dilutions.');
  const last = s.length - 1;
  if (p[last] !== 0) throw new Error('Spearman–Kärber needs the weakest dilution to have no infected wells. Add weaker dilutions.');
  let m = s[k0].d, v = 0;
  for (let i = k0; i < last; i++) m += ((s[i + 1].d - s[i].d) * (p[i] + p[i + 1])) / 2;
  for (let i = k0 + 1; i < last; i++) {
    if (p[i] <= 0 || p[i] >= 1 || s[i].n < 2) continue;
    const w = (s[i + 1].d - s[i - 1].d) / 2;
    v += (w * w * p[i] * (1 - p[i])) / (s[i].n - 1);
  }
  const se = Math.sqrt(v), z = normInv(0.5 + conf / 2);
  return { log50: m, se, lo: m - z * se, hi: m + z * se, from: k0, to: last, conf };
}

/** Raw proportions that rise again at a weaker dilution (index of the weaker row, in sorted order). */
export function reversals(input: Row[]): number[] {
  const s = [...input].sort((a, b) => a.d - b.d), out: number[] = [];
  for (let i = 1; i < s.length; i++) if (s[i].pos / s[i].n > s[i - 1].pos / s[i - 1].n + 1e-12) out.push(i);
  return out;
}

/** TCID50 per mL from an endpoint (log10 dilution factor) and the inoculum per well in mL. */
export const perMl = (log50: number, volMl: number) => 10 ** log50 / volMl;
/** Infectious units per TCID50 by the Poisson zero term: e^−m = 1/2, so m = ln 2. */
export const PFU_PER_TCID50 = Math.LN2;

// ---------- Plaque assay ----------
export type Plate = number | 'tntc';
export type PRow = { d: number; counts: Plate[] };
export type PRowOut = PRow & { mean: number; tntc: number; plates: number; sum: number; titre: number; used: boolean; why: string };
export type Plaque = { rows: PRowOut[]; total: number; volume: number; titre: number; lo: number; hi: number; conf: number; fallback: boolean; usedPlates: number };

/** Regularised lower incomplete gamma P(a, x) (series below a + 1, continued fraction above). */
export function gammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  const lg = logGamma(a);
  if (x < a + 1) {
    let ap = a, sum = 1 / a, del = sum;
    for (let n = 0; n < 10000; n++) { ap += 1; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-16) break; }
    return Math.min(1, sum * Math.exp(-x + a * Math.log(x) - lg));
  }
  const FP = 1e-300;
  let b = x + 1 - a, c = 1 / FP, d = 1 / b, h = d;
  for (let i = 1; i < 10000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < FP) d = FP;
    c = b + an / c; if (Math.abs(c) < FP) c = FP;
    d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return Math.max(0, 1 - Math.exp(-x + a * Math.log(x) - lg) * h);
}
/** x with P(a, x) = p, by bisection. */
function gammaInv(p: number, a: number): number {
  let lo = 0, hi = Math.max(1, a);
  while (gammaP(a, hi) < p) hi *= 2;
  for (let i = 0; i < 300 && hi - lo > 1e-14 * hi; i++) { const m = (lo + hi) / 2; if (gammaP(a, m) < p) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
/** Exact (Garwood) interval for a Poisson mean from one total count c. */
export function poissonCI(c: number, conf = 0.95): [number, number] {
  const a = (1 - conf) / 2;
  return [c === 0 ? 0 : gammaInv(a, c), gammaInv(1 - a, c + 1)];
}

/** Read a plate count: a whole number, or TNTC / "too many" / ">300" for a plate too crowded to count. */
export function parsePlate(s: string): Plate | null {
  const t = s.trim().toLowerCase();
  if (!t) return null;
  if (/^(tntc|tmtc|too ?many|many|>\s*\d*|confluent|c)$/.test(t)) return 'tntc';
  const x = Number(t.replace(/[\s,]/g, ''));
  return Number.isInteger(x) && x >= 0 ? x : NaN;
}

/**
 * Plaque titre (PFU/mL). Every dilution whose plates are all countable and whose mean count lies in the
 * countable range is pooled: titre = Σ plaques / Σ (volume × 10^−d) over those plates, the Poisson maximum
 * likelihood estimate, with an exact interval from the total count. When no dilution is in range, the
 * countable dilution whose mean is nearest the range is used and `fallback` is set.
 */
export function plaqueTitre(input: PRow[], volMl: number, min: number, max: number, conf = 0.95): Plaque {
  if (!(volMl > 0)) throw new Error('Type the volume put on each plate, in mL (above 0).');
  if (!(min >= 0 && max > min)) throw new Error('The countable range needs a lowest count of 0 or more and a highest count above it.');
  if (!input.length) throw new Error('Type the plaque counts for at least one dilution.');
  input.forEach((r, i) => {
    if (!Number.isFinite(r.d) || r.d < 0) throw new Error(`Dilution ${i + 1}: write the dilution as 1:1000, 10^-3 or 0.001.`);
    if (!r.counts.length) throw new Error(`Dilution ${i + 1}: type the plaque count of each plate, separated by commas.`);
    r.counts.forEach((c) => { if (c !== 'tntc' && !(Number.isInteger(c) && c >= 0)) throw new Error(`Dilution ${i + 1}: plaque counts are whole numbers (or TNTC for too many to count).`); });
  });
  const s = [...input].sort((a, b) => a.d - b.d);
  for (let i = 1; i < s.length; i++) if (Math.abs(s[i].d - s[i - 1].d) < 1e-9) throw new Error(`The dilution ${dilutionLabel(s[i].d)} is listed twice. Put all its plates on one line.`);
  const rows: PRowOut[] = s.map((r) => {
    const nums = r.counts.filter((c): c is number => c !== 'tntc');
    const tntc = r.counts.length - nums.length, sum = nums.reduce((a, b) => a + b, 0), mean = nums.length ? sum / nums.length : NaN;
    const titre = tntc ? NaN : mean / (volMl * 10 ** -r.d);
    const inRange = !tntc && mean >= min && mean <= max;
    return { ...r, mean, tntc, plates: r.counts.length, sum, titre, used: inRange, why: tntc ? 'too many to count' : mean > max ? 'above the range' : mean < min ? 'below the range' : 'in range' };
  });
  let fallback = false;
  if (!rows.some((r) => r.used)) {
    const cand = rows.filter((r) => !r.tntc && r.sum > 0);
    if (!cand.length) throw new Error(rows.every((r) => r.tntc) ? 'Every plate is too crowded to count. Plate weaker dilutions.' : 'No plaques on any countable plate. Plate stronger dilutions.');
    const dist = (r: PRowOut) => (r.mean > max ? Math.log(r.mean / max) : Math.log(min / r.mean));
    cand.sort((a, b) => dist(a) - dist(b))[0].used = true;
    fallback = true;
  }
  let total = 0, volume = 0, usedPlates = 0;
  for (const r of rows) if (r.used) { total += r.sum; volume += r.plates * volMl * 10 ** -r.d; usedPlates += r.plates; }
  const [a, b] = poissonCI(total, conf);
  return { rows, total, volume, titre: total / volume, lo: a / volume, hi: b / volume, conf, fallback, usedPlates };
}

// ---------- Pasted tables ----------
/** Rows of (dilution, infected, wells) from a pasted table. A header line is skipped. */
export function parseWells(table: string[][], numf: (s: string) => number): { rows: Row[]; errors: string[] } {
  const rows: Row[] = [], errors: string[] = [];
  table.forEach((r, i) => {
    const d = parseDilution(r[0] ?? ''), pos = numf(r[1] ?? ''), n = numf(r[2] ?? '');
    if (Number.isNaN(d) && i === 0) return;
    if (Number.isFinite(d) && Number.isInteger(pos) && Number.isInteger(n) && n >= 1 && pos >= 0 && pos <= n) rows.push({ d, pos, n });
    else errors.push(`Line ${i + 1} needs a dilution, the infected wells and the total wells.`);
  });
  return { rows, errors };
}
/** Rows of (dilution, plate 1, plate 2, ...) from a pasted table. A header line is skipped. */
export function parsePlates(table: string[][]): { rows: PRow[]; errors: string[] } {
  const rows: PRow[] = [], errors: string[] = [];
  table.forEach((r, i) => {
    const d = parseDilution(r[0] ?? '');
    if (Number.isNaN(d) && i === 0) return;
    const counts = r.slice(1).map(parsePlate).filter((c): c is Plate => c !== null);
    if (Number.isFinite(d) && counts.length && counts.every((c) => c === 'tntc' || Number.isFinite(c))) rows.push({ d, counts });
    else errors.push(`Line ${i + 1} needs a dilution and one or more plate counts.`);
  });
  return { rows, errors };
}

/** Made-up example: 10⁻¹ to 10⁻⁸ in 8 wells each, 0.1 mL per well. */
export const EXAMPLE_WELLS: Row[] = [
  { d: 1, pos: 8, n: 8 }, { d: 2, pos: 8, n: 8 }, { d: 3, pos: 8, n: 8 }, { d: 4, pos: 8, n: 8 },
  { d: 5, pos: 6, n: 8 }, { d: 6, pos: 3, n: 8 }, { d: 7, pos: 1, n: 8 }, { d: 8, pos: 0, n: 8 },
];
/** Made-up example: triplicate plates, 0.1 mL each. */
export const EXAMPLE_PLATES: PRow[] = [
  { d: 4, counts: ['tntc', 'tntc', 'tntc'] }, { d: 5, counts: [88, 97, 79] }, { d: 6, counts: [11, 7, 9] }, { d: 7, counts: [1, 0, 2] },
];
