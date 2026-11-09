// Conventional (mass) and SI (molar) units for common lab tests. The molar masses come from the formulas and the
// standard atomic weights in chem.ts, so every factor can be traced: 1 mg/dL = 10 mg/L = 10 / M mmol/L.
import { parseFormula, molarMass } from './chem.ts';
import { num } from './num.ts';

export type Analyte = {
  id: string; name: string; formula: string; basis: string;
  units: string[];          // the first is the usual conventional unit, the second the usual SI unit
  charge?: number;          // for mEq/L
  note?: string;
};

export const ANALYTES: Analyte[] = [
  { id: 'glucose', name: 'Glucose', formula: 'C6H12O6', basis: 'glucose, C₆H₁₂O₆', units: ['mg/dL', 'mmol/L', 'mg/L', 'g/L'] },
  { id: 'chol', name: 'Cholesterol, total', formula: 'C27H46O', basis: 'cholesterol, C₂₇H₄₆O', units: ['mg/dL', 'mmol/L', 'g/L'] },
  { id: 'hdl', name: 'HDL cholesterol', formula: 'C27H46O', basis: 'cholesterol, C₂₇H₄₆O', units: ['mg/dL', 'mmol/L', 'g/L'], note: 'HDL and LDL are reported as the cholesterol they carry, so they use the molar mass of cholesterol.' },
  { id: 'ldl', name: 'LDL cholesterol', formula: 'C27H46O', basis: 'cholesterol, C₂₇H₄₆O', units: ['mg/dL', 'mmol/L', 'g/L'], note: 'HDL and LDL are reported as the cholesterol they carry, so they use the molar mass of cholesterol.' },
  { id: 'tg', name: 'Triglycerides', formula: 'C57H104O6', basis: 'triolein, C₅₇H₁₀₄O₆', units: ['mg/dL', 'mmol/L', 'g/L'], note: 'Triglycerides are a mixture; labs convert as if all were triolein, a typical triglyceride.' },
  { id: 'creat', name: 'Creatinine', formula: 'C4H7N3O', basis: 'creatinine, C₄H₇N₃O', units: ['mg/dL', 'µmol/L', 'mmol/L', 'mg/L'] },
  { id: 'urea', name: 'Urea', formula: 'CH4N2O', basis: 'urea, CH₄N₂O', units: ['mg/dL', 'mmol/L', 'g/L'], note: 'For the US "BUN" (urea nitrogen) choose Urea nitrogen (BUN) instead.' },
  { id: 'bun', name: 'Urea nitrogen (BUN)', formula: 'N2', basis: 'the 2 nitrogen atoms in one urea, N₂', units: ['mg/dL', 'mmol/L'], note: 'BUN weighs only the nitrogen in urea (2 N per molecule), so 1 mmol/L of urea is 28.014 mg/L of urea nitrogen. The mmol/L result is urea.' },
  { id: 'urate', name: 'Uric acid (urate)', formula: 'C5H4N4O3', basis: 'uric acid, C₅H₄N₄O₃', units: ['mg/dL', 'µmol/L', 'mmol/L'] },
  { id: 'ca', name: 'Calcium', formula: 'Ca', basis: 'calcium, Ca', units: ['mg/dL', 'mmol/L', 'mEq/L'], charge: 2 },
  { id: 'mg', name: 'Magnesium', formula: 'Mg', basis: 'magnesium, Mg', units: ['mg/dL', 'mmol/L', 'mEq/L'], charge: 2 },
  { id: 'phos', name: 'Phosphate (as phosphorus)', formula: 'P', basis: 'phosphorus, P', units: ['mg/dL', 'mmol/L'], note: 'Labs report "phosphate" as the phosphorus it contains, so the factor uses the atomic weight of P, not PO₄.' },
  { id: 'bili', name: 'Bilirubin', formula: 'C33H36N4O6', basis: 'bilirubin, C₃₃H₃₆N₄O₆', units: ['mg/dL', 'µmol/L'] },
  { id: 'hba1c', name: 'HbA1c', formula: '', basis: '', units: ['%', 'mmol/mol'], note: 'HbA1c is not a mass-to-moles change: it uses the IFCC-NGSP master equation, NGSP % = 0.09148 × IFCC + 2.152.' },
];
export const byId = (id: string) => ANALYTES.find((a) => a.id === id)!;

/** Molar mass in g/mol from the formula and standard atomic weights. */
export const molar = (a: Analyte) => molarMass(parseFormula(a.formula));

/** How many mmol/L one of this unit is, for an analyte of molar mass M (g/mol). */
export function toMmolPerL(unit: string, M: number, charge = 1): number {
  switch (unit) {
    case 'mg/dL': return 10 / M;
    case 'mg/L': return 1 / M;
    case 'g/L': return 1000 / M;
    case 'mmol/L': return 1;
    case 'µmol/L': return 1e-3;
    case 'mEq/L': return 1 / charge;
  }
  throw new Error(`Unknown unit ${unit}`);
}

// IFCC-NGSP master equation (Hoelzel et al. 2004, Clin Chem 50:166): NGSP (%) = 0.09148 × IFCC (mmol/mol) + 2.152.
export const ifccFromNgsp = (pct: number) => (pct - 2.152) / 0.09148;
export const ngspFromIfcc = (mmol: number) => 0.09148 * mmol + 2.152;

/** The factor: one `from` unit equals this many `to` units. */
export function factor(a: Analyte, from: string, to: string): number {
  if (a.id === 'hba1c') throw new Error('HbA1c has no single factor');
  const M = molar(a);
  return toMmolPerL(from, M, a.charge) / toMmolPerL(to, M, a.charge);
}

export function convert(a: Analyte, x: number, from: string, to: string): number {
  if (from === to) return x;
  if (a.id === 'hba1c') return from === '%' ? ifccFromNgsp(x) : ngspFromIfcc(x);
  return x * factor(a, from, to);
}

export type Row = { input: string; prefix: string; value: number; out: number; error?: string };

/** Convert a pasted column (one value per line; text after the first number, such as a unit or note, is ignored). */
export function convertList(text: string, a: Analyte, from: string, to: string): Row[] {
  const rows: Row[] = [];
  for (const raw of text.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.split(/[\t;]/)[0].trim().match(/^([<>≤≥]=?)?\s*(.*)$/)!;
    const prefix = m[1] ?? '', cell = m[2];
    const v = [cell, cell.split(',')[0], cell.split(/\s+/)[0]].map(num).find(Number.isFinite) ?? NaN;
    if (!Number.isFinite(v)) { rows.push({ input: line, prefix, value: NaN, out: NaN, error: 'not a number' }); continue; }
    if (v < 0) { rows.push({ input: line, prefix, value: v, out: NaN, error: 'below zero' }); continue; }
    rows.push({ input: line, prefix, value: v, out: convert(a, v, from, to) });
  }
  return rows;
}

/** Round to d decimals, or to 4 significant figures when d is null. */
export function fmt(x: number, d: number | null): string {
  if (!Number.isFinite(x)) return '';
  if (d != null) return x.toFixed(d);
  if (x === 0) return '0';
  const p = Math.max(0, 3 - Math.floor(Math.log10(Math.abs(x))));
  return x.toFixed(Math.min(p, 8));
}
