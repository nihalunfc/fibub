// Transfection planner: which well gets which condition, and how much DNA, reagent, diluent and medium to pipette,
// scaled from amounts per well. Two tubes per condition (DNA in diluent; reagent in diluent, from one shared reagent
// mix), then combined and added to the wells. Starting amounts are rounded values made up by fibub, not a kit insert.
import { PLATES, wellName } from './plate.ts';

export { PLATES, wellName };
export const SIZES = [6, 12, 24, 48, 96, 384];

/** Kinds of condition: a plasmid (construct or control plasmid) gets DNA and reagent, mock gets reagent only,
 *  untransfected gets nothing but medium. */
export type Kind = 'construct' | 'control' | 'mock' | 'none';
export const KIND_LABEL: Record<Kind, string> = { construct: 'Construct (plasmid)', control: 'Control plasmid', mock: 'Mock (reagent only)', none: 'Untransfected' };
export const hasDna = (k: Kind) => k === 'construct' || k === 'control';
export const hasReagent = (k: Kind) => k !== 'none';

/** Amounts for one well. dna in ng, ratio in µL reagent per µg DNA, diluent and medium in µL, share = fraction of
 *  the diluent that goes in the DNA tube (the rest goes in the reagent tube). */
export type PerWell = { dna: number; ratio: number; diluent: number; share: number; medium: number };

/** Rounded starting amounts per well, made up by fibub: they grow roughly with the well's floor area. */
export const STARTS: Record<number, PerWell> = {
  6: { dna: 2500, ratio: 3, diluent: 250, share: 0.5, medium: 2000 },
  12: { dna: 1000, ratio: 3, diluent: 100, share: 0.5, medium: 1000 },
  24: { dna: 500, ratio: 3, diluent: 50, share: 0.5, medium: 500 },
  48: { dna: 250, ratio: 3, diluent: 25, share: 0.5, medium: 250 },
  96: { dna: 100, ratio: 3, diluent: 10, share: 0.5, medium: 100 },
  384: { dna: 25, ratio: 3, diluent: 5, share: 0.5, medium: 25 },
};

export type Cond = { id: number; name: string; kind: Kind; stock: number; reps: number };

/** The fill order of the wells (indices r*C+c), across rows or down columns, without the edge wells if asked. */
export function fillOrder(size: number, byColumn: boolean, skipEdge: boolean): number[] {
  const [R, C] = PLATES[size];
  const out: number[] = [];
  const outer = byColumn ? C : R, inner = byColumn ? R : C;
  for (let a = 0; a < outer; a++) for (let b = 0; b < inner; b++) {
    const r = byColumn ? b : a, c = byColumn ? a : b;
    if (skipEdge && R > 2 && C > 2 && (r === 0 || c === 0 || r === R - 1 || c === C - 1)) continue;
    out.push(r * C + c);
  }
  return out;
}

/** Auto layout: each condition's replicates one after another in fill order. map[i] = condition id, 0 = empty. */
export function autoLayout(size: number, conds: { id: number; reps: number }[], byColumn = false, skipEdge = false) {
  const [R, C] = PLATES[size];
  const map = new Array<number>(R * C).fill(0);
  const free = fillOrder(size, byColumn, skipEdge);
  const needed = conds.reduce((s, c) => s + Math.max(0, Math.round(c.reps)), 0);
  let k = 0;
  for (const c of conds) for (let i = 0; i < Math.round(c.reps); i++) if (k < free.length) map[free[k++]] = c.id;
  return { map, placed: k, needed, free: free.length };
}

/** How many wells each condition has on the map. */
export function countWells(map: number[]): Map<number, number> {
  const m = new Map<number, number>();
  for (const id of map) if (id) m.set(id, (m.get(id) ?? 0) + 1);
  return m;
}

export type Row = {
  id: number; name: string; kind: Kind; wells: number; makeFor: number;
  dnaNg: number; dnaUL: number; tubeDiluent: number; tubeVol: number; reagentMix: number; complexPerWell: number; complexMade: number;
};
export type Plan = {
  rows: Row[]; reagentPerWell: number; dnaTubePerWell: number; reagentTubePerWell: number; complexPerWell: number;
  mix: { wells: number; draw: number; reagent: number; diluent: number; total: number };
  wellsUsed: number; medium: number; diluentTotal: number; errors: string[]; warns: string[];
};

/**
 * The pipetting plan. Each condition's tubes are made for its wells × (1 + spare); the shared reagent mix is made
 * for everything the tubes draw from it × (1 + spare) again, since it is pipetted out once more.
 */
export function plan(pw: PerWell, conds: Cond[], wells: Map<number, number>, sparePct: number): Plan {
  const errors: string[] = [], warns: string[] = [];
  if (!(pw.dna > 0)) errors.push('DNA per well must be above zero.');
  if (!(pw.ratio > 0)) errors.push('Reagent per µg of DNA must be above zero.');
  if (!(pw.diluent >= 0)) errors.push('Diluent per well cannot be below zero.');
  if (!(pw.share >= 0 && pw.share <= 1)) errors.push('The share of diluent in the DNA tube is between 0 and 100 %.');
  if (!(pw.medium > 0)) errors.push('Medium per well must be above zero.');
  if (!(sparePct >= 0 && sparePct <= 100)) errors.push('Spare is between 0 and 100 %.');
  const s = 1 + (sparePct >= 0 ? sparePct : 0) / 100;
  const R = (pw.ratio * pw.dna) / 1000; // µL reagent per well
  const Vd = pw.diluent * pw.share, Vr = pw.diluent * (1 - pw.share) + R;
  const rows: Row[] = [];
  let draw = 0, mixWells = 0, used = 0, dil = 0;
  for (const c of conds) {
    const n = wells.get(c.id) ?? 0, m = n * s;
    used += n;
    const row: Row = { id: c.id, name: c.name, kind: c.kind, wells: n, makeFor: m, dnaNg: 0, dnaUL: 0, tubeDiluent: 0, tubeVol: 0, reagentMix: 0, complexPerWell: 0, complexMade: 0 };
    if (hasDna(c.kind)) {
      row.dnaNg = pw.dna * m;
      if (!(c.stock > 0)) { if (n) errors.push(`${c.name}: give the DNA stock in ng/µL.`); }
      else {
        row.dnaUL = row.dnaNg / c.stock;
        if (n && pw.dna / c.stock > Vd + 1e-9) errors.push(`${c.name}: the stock is too dilute. ${fmtUL(pw.dna / c.stock)} of DNA per well does not fit in the ${fmtUL(Vd)} DNA tube; it needs at least ${sigs(pw.dna / Vd, 3)} ng/µL, or more diluent in the DNA tube.`);
        else if (n && row.dnaUL < 0.5) warns.push(`${c.name}: only ${fmtUL(row.dnaUL)} of DNA, too little to pipette accurately. Dilute the stock first, or make more.`);
      }
    }
    if (hasReagent(c.kind)) {
      row.tubeDiluent = Vd * m - row.dnaUL;
      row.tubeVol = Vd * m;
      row.reagentMix = Vr * m;
      row.complexPerWell = Vd + Vr;
      row.complexMade = (Vd + Vr) * m;
      draw += row.reagentMix; mixWells += n; dil += Math.max(0, row.tubeDiluent);
    }
    rows.push(row);
  }
  const total = draw * s, reagent = Vr > 0 ? (R * total) / Vr : 0, mdil = total - reagent;
  dil += mdil;
  if (mixWells && reagent > 0 && reagent < 0.5) warns.push(`Only ${fmtUL(reagent)} of reagent in the reagent mix, too little to pipette accurately. Make more, or plan more wells.`);
  if (mixWells && pw.medium > 0 && (Vd + Vr) > 0.25 * pw.medium) warns.push(`Each well gets ${fmtUL(Vd + Vr)} of complex in ${fmtUL(pw.medium)} of medium, more than a quarter of the medium. Most protocols keep it nearer a tenth; check your reagent's instructions.`);
  if (pw.share === 1 && mixWells) warns.push('All the diluent is in the DNA tube, so the reagent goes in neat. Some reagents need diluting first; check their instructions.');
  return {
    rows, reagentPerWell: R, dnaTubePerWell: Vd, reagentTubePerWell: Vr, complexPerWell: Vd + Vr,
    mix: { wells: mixWells, draw, reagent, diluent: mdil, total },
    wellsUsed: used, medium: pw.medium * used * s, diluentTotal: dil, errors, warns,
  };
}

/** Significant figures, as a plain number string (no exponent for lab-sized numbers). */
export function sigs(x: number, n = 3): string {
  if (!Number.isFinite(x)) return '–';
  if (x === 0) return '0';
  const d = Math.max(0, n - 1 - Math.floor(Math.log10(Math.abs(x)) + 1e-9));
  return round(x, d).toFixed(d);
}
const round = (x: number, d: number) => { const f = 10 ** d; return Math.round((x + Math.sign(x) * 1e-9) * f) / f; };

/** A volume in µL as people pipette it: 2 decimals below 10 µL, 1 below 100, whole µL below 1000, then mL. */
export function fmtUL(v: number): string {
  if (!Number.isFinite(v)) return '–';
  if (Math.abs(v) >= 1000) return `${round(v / 1000, 2).toFixed(2)} mL`;
  if (Math.abs(v) >= 100) return `${round(v, 0).toFixed(0)} µL`;
  if (Math.abs(v) >= 10) return `${round(v, 1).toFixed(1)} µL`;
  return `${round(v, 2).toFixed(2)} µL`;
}
/** DNA mass: ng below 1000, else µg. */
export function fmtNg(v: number): string {
  if (!Number.isFinite(v)) return '–';
  return v >= 1000 ? `${sigs(v / 1000, 3)} µg` : `${sigs(v, 3)} ng`;
}

/** The example on the page: six conditions in triplicate on a 24-well plate. Stocks are made up. */
export const EXAMPLE: Cond[] = [
  { id: 1, name: 'Gene X', kind: 'construct', stock: 500, reps: 3 },
  { id: 2, name: 'Gene X mutant', kind: 'construct', stock: 400, reps: 3 },
  { id: 3, name: 'Empty vector', kind: 'control', stock: 1000, reps: 3 },
  { id: 4, name: 'GFP', kind: 'control', stock: 200, reps: 3 },
  { id: 5, name: 'Mock', kind: 'mock', stock: 0, reps: 3 },
  { id: 6, name: 'Untransfected', kind: 'none', stock: 0, reps: 3 },
];
