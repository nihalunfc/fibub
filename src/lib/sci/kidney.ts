// Kidney function estimates for teaching: Cockcroft-Gault creatinine clearance, CKD-EPI 2021 eGFR
// (creatinine, and creatinine with cystatin C; race-free), CKD-EPI 2012 cystatin C, MDRD 4-variable
// (IDMS-traceable, without its race term) and the KDIGO G stage. Plain maths, no DOM.
import { ibw, adjustedWeight, type Sex } from './body.ts';

/** µmol/L of creatinine per mg/dL (molar mass 113.12 g/mol). */
export const UMOL_PER_MGDL = 88.42;

/** Cockcroft and Gault (1976): creatinine clearance in mL/min, creatinine in mg/dL. */
export const cockcroftGault = (age: number, kg: number, scr: number, sex: Sex) => ((140 - age) * kg) / (72 * scr) * (sex === 'female' ? 0.85 : 1);

/** CKD-EPI 2021 creatinine equation (Inker et al., NEJM 2021), mL/min/1.73 m². */
export function ckdEpi2021Cr(scr: number, age: number, sex: Sex) {
  const f = sex === 'female', k = f ? 0.7 : 0.9, a = f ? -0.241 : -0.302, r = scr / k;
  return 142 * Math.min(r, 1) ** a * Math.max(r, 1) ** -1.2 * 0.9938 ** age * (f ? 1.012 : 1);
}
/** CKD-EPI 2021 creatinine-cystatin C equation (Inker et al., NEJM 2021), mL/min/1.73 m². */
export function ckdEpi2021CrCys(scr: number, scys: number, age: number, sex: Sex) {
  const f = sex === 'female', k = f ? 0.7 : 0.9, a = f ? -0.219 : -0.144, r = scr / k, c = scys / 0.8;
  return 135 * Math.min(r, 1) ** a * Math.max(r, 1) ** -0.544 * Math.min(c, 1) ** -0.323 * Math.max(c, 1) ** -0.778 * 0.9961 ** age * (f ? 0.963 : 1);
}
/** CKD-EPI 2012 cystatin C equation (Inker et al., NEJM 2012), mL/min/1.73 m². */
export function ckdEpi2012Cys(scys: number, age: number, sex: Sex) {
  const c = scys / 0.8;
  return 133 * Math.min(c, 1) ** -0.499 * Math.max(c, 1) ** -1.328 * 0.996 ** age * (sex === 'female' ? 0.932 : 1);
}
/** MDRD 4-variable, IDMS-traceable (Levey et al., Ann Intern Med 2006), without the race coefficient. */
export const mdrd4 = (scr: number, age: number, sex: Sex) => 175 * scr ** -1.154 * age ** -0.203 * (sex === 'female' ? 0.742 : 1);

/** KDIGO 2012 GFR categories. */
export const G_STAGES = [
  { min: 90, g: 'G1', name: 'Normal or high' },
  { min: 60, g: 'G2', name: 'Mildly decreased' },
  { min: 45, g: 'G3a', name: 'Mildly to moderately decreased' },
  { min: 30, g: 'G3b', name: 'Moderately to severely decreased' },
  { min: 15, g: 'G4', name: 'Severely decreased' },
  { min: -Infinity, g: 'G5', name: 'Kidney failure' },
];
export const gStage = (gfr: number) => G_STAGES.find((s) => gfr >= s.min)!;

export interface KidneyInput { age: number; sex: Sex; scr: number; unit: 'mgdl' | 'umol'; scys?: number; kg?: number; cm?: number; abwFactor?: number }
export interface KidneyRow { id: string; name: string; value: number; unit: string; note: string }
export interface KidneyResult { scrMg: number; egfr: KidneyRow[]; cg: KidneyRow[]; best: KidneyRow; stage: (typeof G_STAGES)[number]; notes: string[] }

export function kidney(inp: KidneyInput): KidneyResult {
  const { age, sex } = inp;
  if (!(age >= 18 && age <= 120)) throw new Error('Age should be 18 to 120 years: these equations are for adults.');
  if (!(inp.scr > 0)) throw new Error('Enter the serum creatinine as a number above zero.');
  const scrMg = inp.unit === 'umol' ? inp.scr / UMOL_PER_MGDL : inp.scr;
  if (scrMg < 0.1 || scrMg > 25) throw new Error(`That creatinine (${inp.scr} ${inp.unit === 'umol' ? 'µmol/L' : 'mg/dL'}) is outside 0.1 to 25 mg/dL (9 to 2200 µmol/L). Check the unit.`);
  if (inp.scys !== undefined && !(inp.scys >= 0.2 && inp.scys <= 15)) throw new Error('Cystatin C should be between 0.2 and 15 mg/L.');
  const U = 'mL/min/1.73 m²', notes: string[] = [];
  const egfr: KidneyRow[] = [{ id: 'cr2021', name: 'CKD-EPI 2021, creatinine', value: ckdEpi2021Cr(scrMg, age, sex), unit: U, note: 'Race-free; the usual first estimate' }];
  if (inp.scys !== undefined) {
    egfr.push({ id: 'crcys2021', name: 'CKD-EPI 2021, creatinine and cystatin C', value: ckdEpi2021CrCys(scrMg, inp.scys, age, sex), unit: U, note: 'Race-free; more accurate when both are measured' });
    egfr.push({ id: 'cys2012', name: 'CKD-EPI 2012, cystatin C', value: ckdEpi2012Cys(inp.scys, age, sex), unit: U, note: 'Cystatin C alone' });
  }
  egfr.push({ id: 'mdrd', name: 'MDRD 4-variable (IDMS)', value: mdrd4(scrMg, age, sex), unit: U, note: 'For comparison only; race term left out; poor above 60' });
  const cg: KidneyRow[] = [];
  if (inp.kg !== undefined) {
    if (!(inp.kg >= 20 && inp.kg <= 400)) throw new Error('Weight should be between 20 and 400 kg.');
    cg.push({ id: 'cg-actual', name: 'Cockcroft-Gault, actual weight', value: cockcroftGault(age, inp.kg, scrMg, sex), unit: 'mL/min', note: `${inp.kg.toFixed(1)} kg` });
    if (inp.cm !== undefined) {
      if (!(inp.cm >= 120 && inp.cm <= 250)) throw new Error('Height should be between 120 and 250 cm.');
      const ib = ibw(inp.cm, sex), ab = adjustedWeight(inp.kg, ib, inp.abwFactor ?? 0.4);
      cg.push({ id: 'cg-ideal', name: 'Cockcroft-Gault, ideal weight', value: cockcroftGault(age, ib, scrMg, sex), unit: 'mL/min', note: `Devine IBW ${ib.toFixed(1)} kg` });
      cg.push({ id: 'cg-adjusted', name: 'Cockcroft-Gault, adjusted weight', value: cockcroftGault(age, ab, scrMg, sex), unit: 'mL/min', note: `IBW + ${inp.abwFactor ?? 0.4} × (actual − IBW) = ${ab.toFixed(1)} kg` });
      if (inp.kg > 1.3 * ib) notes.push('Actual weight is more than 130 % of ideal weight: Cockcroft-Gault with actual weight tends to overestimate clearance; texts often use the adjusted weight instead.');
      if (inp.kg < ib) notes.push('Actual weight is below ideal weight: texts usually use the actual weight then.');
    }
  }
  const best = egfr.find((r) => r.id === 'crcys2021') ?? egfr[0];
  if (scrMg < 0.6) notes.push('Very low creatinine (low muscle mass) can make creatinine-based estimates too high.');
  notes.push('An eGFR in G1 or G2 is chronic kidney disease only with other signs of kidney damage (such as albuminuria) for more than 3 months.');
  return { scrMg, egfr, cg, best, stage: gStage(best.value), notes };
}
