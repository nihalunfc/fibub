// Mineral formulae from electron-microprobe oxide wt%: cations per formula unit on a chosen oxygen basis, Fe³⁺
// by charge balance (Droop 1987, Mineral. Mag. 51, 431: F = 2X(1 − T/S)), and end-member proportions for olivine,
// pyroxene, feldspar, garnet and spinel. Oxide molar masses come from the periodic table in chem.ts.
// No DOM; checked against pyrolite and an independent NumPy script in tests/sci-tools/mineral-formula.mjs.
import { BY_SYMBOL } from './chem.ts';

export type Oxide = { key: string; cation: string; ion: string; nCat: number; nO: number };
/** Oxides read, with the ion each gives (Fe2O3 gives Fe³⁺, FeO gives Fe²⁺). */
export const OXIDES: Oxide[] = [
  ['SiO2', 'Si', 'Si', 1, 2], ['TiO2', 'Ti', 'Ti', 1, 2], ['ZrO2', 'Zr', 'Zr', 1, 2], ['Al2O3', 'Al', 'Al', 2, 3], ['Cr2O3', 'Cr', 'Cr', 2, 3], ['V2O3', 'V', 'V', 2, 3],
  ['Fe2O3', 'Fe', 'Fe3', 2, 3], ['FeO', 'Fe', 'Fe2', 1, 1], ['MnO', 'Mn', 'Mn', 1, 1], ['NiO', 'Ni', 'Ni', 1, 1], ['ZnO', 'Zn', 'Zn', 1, 1], ['MgO', 'Mg', 'Mg', 1, 1],
  ['CaO', 'Ca', 'Ca', 1, 1], ['SrO', 'Sr', 'Sr', 1, 1], ['BaO', 'Ba', 'Ba', 1, 1], ['Na2O', 'Na', 'Na', 2, 1], ['K2O', 'K', 'K', 2, 1], ['P2O5', 'P', 'P', 2, 5],
].map(([key, cation, ion, nCat, nO]) => ({ key, cation, ion, nCat, nO }) as Oxide);
export const BY_KEY = new Map(OXIDES.map((o) => [o.key, o]));
export const IONS = OXIDES.map((o) => o.ion);
export const ION_LABEL: Record<string, string> = { Fe3: 'Fe³⁺', Fe2: 'Fe²⁺' };
const CHARGE = (o: Oxide) => (2 * o.nO) / o.nCat;
export const molarMass = (o: Oxide) => o.nCat * BY_SYMBOL.get(o.cation)!.weight + o.nO * BY_SYMBOL.get('O')!.weight;

/** Header name to oxide key: case-insensitive; FeOt, FeO*, FeOT, FeO(t), FeOtot mean total iron as FeO (likewise Fe2O3). */
export function oxideKey(name: string): { key: string; total: boolean } | null {
  const n = name.trim().replace(/\s+/g, '').replace(/wt%|\(wt%\)|_wt$/i, '');
  const m = /^(fe2o3|feo)(t|tot|total|\*|\(t\)|\(tot\))?$/i.exec(n);
  if (m) return { key: m[1].toLowerCase() === 'feo' ? 'FeO' : 'Fe2O3', total: !!m[2] };
  const o = OXIDES.find((x) => x.key.toLowerCase() === n.toLowerCase());
  return o ? { key: o.key, total: false } : null;
}

export type Preset = { id: string; name: string; O: number; cat: number | null; fe: FeMode };
export type FeMode = 'analysed' | 'fe2' | 'droop';
/** Common mineral formula bases (oxygens, and the ideal cation total that Droop's method needs). */
export const PRESETS: Preset[] = [
  { id: 'olivine', name: 'Olivine', O: 4, cat: 3, fe: 'fe2' },
  { id: 'pyroxene', name: 'Pyroxene', O: 6, cat: 4, fe: 'droop' },
  { id: 'garnet', name: 'Garnet', O: 12, cat: 8, fe: 'droop' },
  { id: 'feldspar', name: 'Feldspar', O: 8, cat: 5, fe: 'fe2' },
  { id: 'spinel', name: 'Spinel', O: 4, cat: 3, fe: 'droop' },
  { id: 'amphibole', name: 'Amphibole (23 O, anhydrous)', O: 23, cat: null, fe: 'fe2' },
  { id: 'mica', name: 'Mica (11 O, anhydrous)', O: 11, cat: null, fe: 'fe2' },
  { id: 'other', name: 'Other', O: 6, cat: null, fe: 'fe2' },
];

export type Result = {
  apfu: Record<string, number>; sumCat: number; sumO: number; charge: number; total: number; totalAfter: number;
  fe3: number; fe2: number; droopF: number | null; capped: boolean; feO: number; fe2o3: number; // recalculated wt%
  endMembers: { name: string; value: number }[]; mgNum: number | null;
};

/** Formula of one analysis. wt maps oxide keys to wt%. X = oxygens; T = ideal cations (for Droop). */
export function formula(wt: Record<string, number>, X: number, opts: { fe: FeMode; T?: number | null; mineral?: string }): Result {
  const w: Record<string, number> = {};
  for (const o of OXIDES) w[o.key] = wt[o.key] > 0 ? wt[o.key] : 0;
  const total = Object.values(w).reduce((a, b) => a + b, 0);
  const mFeO = molarMass(BY_KEY.get('FeO')!), mFe2O3 = molarMass(BY_KEY.get('Fe2O3')!);
  if (opts.fe !== 'analysed') { w.FeO += (w.Fe2O3 * 2 * mFeO) / mFe2O3; w.Fe2O3 = 0; } // all iron as FeO first
  const mol: Record<string, number> = {};
  let O = 0;
  for (const o of OXIDES) { mol[o.key] = w[o.key] / molarMass(o); O += mol[o.key] * o.nO; }
  if (!(O > 0)) throw new Error('No oxides above zero.');
  const f = X / O, apfu: Record<string, number> = {};
  for (const o of OXIDES) apfu[o.ion] = mol[o.key] * o.nCat * f;
  let droopF: number | null = null, capped = false;
  if (opts.fe === 'droop') {
    const T = opts.T;
    if (!(T && T > 0)) throw new Error('Charge balance (Droop) needs the ideal number of cations for this oxygen basis.');
    const S = IONS.reduce((s, k) => s + apfu[k], 0);
    droopF = 2 * X * (1 - T / S);
    if (droopF > 0) {
      for (const k of IONS) apfu[k] *= T / S;
      const fe = apfu.Fe2;
      if (droopF > fe) capped = true;
      apfu.Fe3 = Math.min(droopF, fe); apfu.Fe2 = fe - apfu.Fe3;
    }
  }
  const sumCat = IONS.reduce((s, k) => s + apfu[k], 0);
  let charge = 0, sumO = 0;
  for (const o of OXIDES) { charge += apfu[o.ion] * CHARGE(o); sumO += (apfu[o.ion] * o.nO) / o.nCat; }
  // Recalculated FeO and Fe2O3 wt% (iron split as in the formula).
  const feT = apfu.Fe2 + apfu.Fe3, feOt = w.FeO + (w.Fe2O3 * 2 * mFeO) / mFe2O3;
  const feO = feT > 0 ? (feOt * apfu.Fe2) / feT : 0, fe2o3 = feT > 0 ? ((feOt * apfu.Fe3) / feT) * (mFe2O3 / (2 * mFeO)) : 0;
  const totalAfter = total - (wt.FeO > 0 ? wt.FeO : 0) - (wt.Fe2O3 > 0 ? wt.Fe2O3 : 0) + feO + fe2o3;
  const a = apfu, mgNum = a.Mg + a.Fe2 > 0 ? (100 * a.Mg) / (a.Mg + a.Fe2) : null;
  return { apfu, sumCat, sumO, charge, total, totalAfter, fe3: a.Fe3, fe2: a.Fe2, droopF, capped, feO, fe2o3, endMembers: endMembers(a, opts.mineral ?? 'other'), mgNum };
}

const pct = (parts: [string, number][]) => { const t = parts.reduce((s, [, v]) => s + v, 0); return t > 0 ? parts.map(([name, v]) => ({ name, value: (100 * v) / t })) : []; };

/** End-member proportions in mol %. */
export function endMembers(a: Record<string, number>, mineral: string): { name: string; value: number }[] {
  const feT = a.Fe2 + a.Fe3;
  switch (mineral) {
    case 'olivine': return pct([['Fo', a.Mg], ['Fa', feT], ['Tep', a.Mn]]);
    case 'pyroxene': return pct([['Wo', a.Ca], ['En', a.Mg], ['Fs', feT + a.Mn]]); // Fs from Fe²⁺ + Fe³⁺ + Mn (Morimoto 1988)
    case 'feldspar': return pct([['An', a.Ca], ['Ab', a.Na], ['Or', a.K]]);
    case 'garnet': {
      const x = pct([['Alm', a.Fe2], ['Prp', a.Mg], ['Sps', a.Mn], ['Grs', a.Ca]]), y = a.Fe3 + a.Al + a.Cr;
      return y > 0 ? [...x, { name: 'Y-site Fe³⁺ share (andradite)', value: (100 * a.Fe3) / y }, { name: 'Y-site Cr share (uvarovite)', value: (100 * a.Cr) / y }] : x;
    }
    case 'spinel': {
      const out: { name: string; value: number }[] = [];
      if (a.Cr + a.Al > 0) out.push({ name: 'Cr# = 100 Cr/(Cr + Al)', value: (100 * a.Cr) / (a.Cr + a.Al) });
      if (a.Fe3 + a.Cr + a.Al > 0) out.push({ name: 'Fe³⁺/(Fe³⁺ + Cr + Al) × 100', value: (100 * a.Fe3) / (a.Fe3 + a.Cr + a.Al) });
      return out;
    }
    default: return [];
  }
}

/** Read a table of analyses: one analysis per row (oxide names across the top) or per column (oxide names down
 *  the first column). Non-oxide text columns give the sample name; other columns (Total, H2O, F ...) are listed as ignored. */
export function readAnalyses(cells: string[][], num: (s: string) => number): { names: string[]; wt: Record<string, number>[]; ignored: string[]; feTotal: string[] } {
  if (cells.length < 2) throw new Error('Paste a header row of oxide names and at least one analysis.');
  const down = cells.filter((r) => oxideKey(r[0] ?? '')).length >= 2 && cells[0].filter((c) => oxideKey(c)).length < 2;
  const grid = down ? cells[0].map((_, j) => cells.map((r) => r[j] ?? '')) : cells; // transpose to one row per analysis
  const head = grid[0], keys = head.map((h) => oxideKey(h));
  if (keys.filter(Boolean).length < 2) throw new Error('No oxide names found: the header should name oxides such as SiO2, Al2O3, FeO, MgO.');
  const seen = new Set<string>();
  keys.forEach((k, j) => { if (k) { if (seen.has(k.key)) throw new Error(`${head[j]} appears twice in the header.`); seen.add(k.key); } });
  const ignored: string[] = [], feTotal: string[] = [];
  head.forEach((h, j) => { if (!keys[j] && j > 0 && h.trim()) ignored.push(h.trim()); if (keys[j]?.total) feTotal.push(h.trim()); });
  const names: string[] = [], wt: Record<string, number>[] = [];
  grid.slice(1).forEach((row, i) => {
    if (row.every((c) => !c.trim())) return;
    const r: Record<string, number> = {};
    keys.forEach((k, j) => {
      if (!k) return;
      const t = (row[j] ?? '').trim();
      if (!t || /^(-|—|n\.?d\.?|b\.?d\.?l\.?|<.*)$/i.test(t)) { r[k.key] = 0; return; }
      const v = num(t);
      if (!Number.isFinite(v) || v < 0) throw new Error(`Analysis ${i + 1}: "${t}" under ${head[j]} is not a wt% value.`);
      r[k.key] = v;
    });
    const nameCol = keys.findIndex((k, j) => !k && j === 0);
    names.push(nameCol === 0 && row[0]?.trim() ? row[0].trim() : `Analysis ${i + 1}`);
    wt.push(r);
  });
  if (!wt.length) throw new Error('No analyses below the header.');
  return { names, wt, ignored, feTotal };
}

/** Made-up, rounded example analyses for each preset (wt%; FeO is total iron). */
export const EXAMPLES: Record<string, string> = {
  olivine: 'Sample\tSiO2\tFeO\tMnO\tNiO\tMgO\tCaO\nOl-1\t40.5\t11.0\t0.15\t0.35\t48.0\t0.10\nOl-2\t39.2\t17.5\t0.25\t0.20\t43.0\t0.15',
  pyroxene: 'Sample\tSiO2\tTiO2\tAl2O3\tCr2O3\tFeO\tMnO\tMgO\tCaO\tNa2O\nCpx-1\t51.5\t0.6\t3.2\t0.5\t6.0\t0.15\t16.0\t21.0\t0.5\nCpx-2\t52.8\t0.3\t1.8\t0\t9.5\t0.3\t14.2\t20.5\t0.6\nOpx-1\t54.5\t0.15\t2.0\t0\t12.0\t0.25\t29.5\t1.2\t0',
  garnet: 'Sample\tSiO2\tTiO2\tAl2O3\tFeO\tMnO\tMgO\tCaO\nGrt-core\t38.5\t0.05\t21.5\t30.0\t2.0\t5.0\t2.8\nGrt-rim\t38.2\t0.02\t21.3\t32.5\t0.8\t4.2\t2.6',
  feldspar: 'Sample\tSiO2\tAl2O3\tFeO\tCaO\tNa2O\tK2O\tBaO\nPl-1\t55.0\t28.0\t0.3\t10.5\t5.4\t0.3\t0\nKfs-1\t64.5\t18.6\t0\t0.1\t1.2\t15.0\t0.3',
  spinel: 'Sample\tSiO2\tTiO2\tAl2O3\tCr2O3\tFeO\tMnO\tMgO\nSp-1\t0.1\t0.3\t40.0\t27.0\t15.0\t0.2\t17.0',
  amphibole: 'Sample\tSiO2\tTiO2\tAl2O3\tFeO\tMnO\tMgO\tCaO\tNa2O\tK2O\nAmp-1\t44.0\t1.5\t11.0\t13.0\t0.2\t13.5\t11.5\t1.8\t0.6',
  mica: 'Sample\tSiO2\tTiO2\tAl2O3\tFeO\tMnO\tMgO\tNa2O\tK2O\nBt-1\t36.5\t3.5\t15.0\t18.0\t0.2\t11.5\t0.2\t9.5',
  other: 'Sample\tSiO2\tAl2O3\tFeO\tMgO\tCaO\nX-1\t50.0\t10.0\t10.0\t15.0\t15.0',
};
