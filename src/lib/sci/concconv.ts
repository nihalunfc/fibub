// Concentration converter: one concentration of one solute, written in every common unit.
// A liquid solution is a solute in one solvent; everything goes through the solute's mass fraction w, using the
// solute's molar mass M, the solution's density ρ, the solvent's molar mass Ms, the pure solute's density ρs (% v/v)
// and the equivalents per mole z (normality). A gas mixture is an ideal gas; everything goes through the solute's
// mole fraction x, using the temperature T and pressure P (molar volume RT/P), M and the other gas's molar mass Mg.
// Each conversion returns the steps it took, with the numbers, so the page can show the chain.
import { parseFormula, molarMass, FormulaError } from './chem.ts';
import { num, fmtExp } from './num.ts';

export const R = 6.02214076e23 * 1.380649e-23; // J/(mol·K) = NA·k, exact since 2019 (8.31446261815324)
export const AIR = 28.9647; // g/mol, dry air (the usual rounded composition)
export const WATER = 18.015; // g/mol, H2O from standard atomic weights

export type Phase = 'liquid' | 'gas';
/** M, Ms, Mg in g/mol; rho, rhoS in g/mL; T in K; P in kPa. Missing values are NaN or undefined. */
export type Params = { M?: number; rho?: number; Ms?: number; rhoS?: number; z?: number; T?: number; P?: number; Mg?: number };
export type Need = 'M' | 'rho' | 'Ms' | 'rhoS' | 'z' | 'TP' | 'Mg';
export const NEED_TEXT: Record<Need, string> = {
  M: 'the solute’s molar mass', rho: 'the solution’s density', Ms: 'the solvent’s molar mass', rhoS: 'the pure solute’s density',
  z: 'the equivalents per mole', TP: 'the temperature and pressure', Mg: 'the other gas’s molar mass',
};

type Step = { value: number; text: string };
type Def = {
  id: string; label: string; needs: Need[];
  /** Base (w or x) to this unit. */ to: (b: number, p: Required<Params>) => Step;
  /** This unit to the base. */ from: (v: number, p: Required<Params>) => Step;
};
export type UnitInfo = { id: string; label: string; needs: Need[] };

/** A number to 6 significant figures without padding zeros (exponent form for very large or small values). */
export const f = (x: number): string => {
  if (!Number.isFinite(x)) return x > 0 ? '∞' : '–';
  if (x === 0) return '0';
  const a = Math.abs(x);
  return a >= 1e6 || a < 1e-4 ? fmtExp(x, 6) : String(+x.toPrecision(6)).replace('-', '−');
};
const step = (value: number, formula: string, nums: string): Step => ({ value, text: `${formula} = ${nums} = ${f(value)}` });

/** A unit that is a fixed multiple of another (mmol/L from mol/L, ppb from w). */
function scaled(parent: Def, id: string, label: string, k: number): Def {
  return {
    id, label, needs: parent.needs,
    to: (b, p) => { const s = parent.to(b, p); const v = s.value * k; return { value: v, text: `${s.text} ${parent.label}; × ${f(k)} = ${f(v)} ${label}` }; },
    from: (v, p) => { const s = parent.from(v / k, p); return { value: s.value, text: `${f(v)} ${label} ÷ ${f(k)} = ${f(v / k)} ${parent.label}; ${s.text}` }; },
  };
}

// ---- Liquid: base is the mass fraction w (g of solute per g of solution). ----
const L_molL: Def = {
  id: 'molL', label: 'mol/L', needs: ['M', 'rho'],
  to: (w, p) => step(1000 * p.rho * w / p.M, 'c = 1000·ρ·w / M', `1000 × ${f(p.rho)} × ${f(w)} / ${f(p.M)}`),
  from: (c, p) => step(c * p.M / (1000 * p.rho), 'w = c·M / (1000·ρ)', `${f(c)} × ${f(p.M)} / (1000 × ${f(p.rho)})`),
};
const L_molkg: Def = {
  id: 'molkg', label: 'mol/kg', needs: ['M'],
  to: (w, p) => step(1000 * w / (p.M * (1 - w)), 'b = 1000·w / (M·(1 − w))', `1000 × ${f(w)} / (${f(p.M)} × ${f(1 - w)})`),
  from: (b, p) => step(b * p.M / (1000 + b * p.M), 'w = b·M / (1000 + b·M)', `${f(b)} × ${f(p.M)} / (1000 + ${f(b)} × ${f(p.M)})`),
};
const L_gL: Def = {
  id: 'gL', label: 'g/L', needs: ['rho'],
  to: (w, p) => step(1000 * p.rho * w, 'C = 1000·ρ·w', `1000 × ${f(p.rho)} × ${f(w)}`),
  from: (c, p) => step(c / (1000 * p.rho), 'w = C / (1000·ρ)', `${f(c)} / (1000 × ${f(p.rho)})`),
};
const L_w: Def = {
  id: 'w', label: 'mass fraction', needs: [],
  to: (w) => ({ value: w, text: `w = ${f(w)}` }),
  from: (w) => ({ value: w, text: `w = ${f(w)}` }),
};
const L_pwv: Def = {
  id: 'pwv', label: '% w/v', needs: ['rho'],
  to: (w, p) => step(100 * p.rho * w, '% w/v = 100·ρ·w', `100 × ${f(p.rho)} × ${f(w)}`),
  from: (v, p) => step(v / (100 * p.rho), 'w = (% w/v) / (100·ρ)', `${f(v)} / (100 × ${f(p.rho)})`),
};
const L_pvv: Def = {
  id: 'pvv', label: '% v/v', needs: ['rho', 'rhoS'],
  to: (w, p) => step(100 * p.rho * w / p.rhoS, '% v/v = 100·ρ·w / ρs', `100 × ${f(p.rho)} × ${f(w)} / ${f(p.rhoS)}`),
  from: (v, p) => step(v * p.rhoS / (100 * p.rho), 'w = (% v/v)·ρs / (100·ρ)', `${f(v)} × ${f(p.rhoS)} / (100 × ${f(p.rho)})`),
};
const L_x: Def = {
  id: 'x', label: 'mole fraction', needs: ['M', 'Ms'],
  to: (w, p) => step((w / p.M) / (w / p.M + (1 - w) / p.Ms), 'x = (w/M) / (w/M + (1 − w)/Ms)', `(${f(w)}/${f(p.M)}) / (${f(w)}/${f(p.M)} + ${f(1 - w)}/${f(p.Ms)})`),
  from: (x, p) => step(x * p.M / (x * p.M + (1 - x) * p.Ms), 'w = x·M / (x·M + (1 − x)·Ms)', `${f(x)} × ${f(p.M)} / (${f(x)} × ${f(p.M)} + ${f(1 - x)} × ${f(p.Ms)})`),
};
const L_N: Def = {
  id: 'N', label: 'eq/L (N)', needs: ['M', 'rho', 'z'],
  to: (w, p) => { const s = L_molL.to(w, p); const v = s.value * p.z; return { value: v, text: `${s.text} mol/L; N = z·c = ${f(p.z)} × ${f(s.value)} = ${f(v)}` }; },
  from: (n, p) => { const s = L_molL.from(n / p.z, p); return { value: s.value, text: `c = N / z = ${f(n)} / ${f(p.z)} = ${f(n / p.z)} mol/L; ${s.text}` }; },
};

const LIQUID: Def[] = [
  L_molL, scaled(L_molL, 'mmolL', 'mmol/L', 1e3), scaled(L_molL, 'umolL', 'µmol/L', 1e6), scaled(L_molL, 'nmolL', 'nmol/L', 1e9),
  L_molkg, scaled(L_molkg, 'mmolkg', 'mmol/kg', 1e3),
  L_gL, scaled(L_gL, 'mgL', 'mg/L', 1e3), scaled(L_gL, 'ugL', 'µg/L', 1e6),
  scaled(L_w, 'mgkg', 'mg/kg', 1e6),
  scaled(L_w, 'pww', '% w/w', 100), L_pwv, L_pvv,
  scaled(L_w, 'ppm', 'ppm (mass)', 1e6, ''), scaled(L_w, 'ppb', 'ppb (mass)', 1e9, ''), scaled(L_w, 'ppt', 'ppt (mass)', 1e12, ''),
  L_x, scaled(L_x, 'molpct', 'mol %', 100), L_N, L_w,
];

// ---- Gas (ideal): base is the mole fraction x. ----
const G_x: Def = {
  id: 'x', label: 'mole fraction', needs: [],
  to: (x) => ({ value: x, text: `x = ${f(x)}` }),
  from: (x) => ({ value: x, text: `x = ${f(x)}` }),
};
/** Total moles per litre of the mixture, P/(RT), with P in kPa. */
const nTot = (p: Required<Params>) => p.P / (R * p.T); // kPa·L = J, so this is mol/L
const G_molL: Def = {
  id: 'molL', label: 'mol/L', needs: ['TP'],
  to: (x, p) => step(x * nTot(p), 'c = x·P / (R·T)', `${f(x)} × ${f(p.P)} kPa / (8.314463 × ${f(p.T)} K)`),
  from: (c, p) => step(c / nTot(p), 'x = c·R·T / P', `${f(c)} × 8.314463 × ${f(p.T)} / ${f(p.P)}`),
};
const G_gL: Def = {
  id: 'gL', label: 'g/L', needs: ['TP', 'M'],
  to: (x, p) => step(x * nTot(p) * p.M, 'C = x·P·M / (R·T)', `${f(x)} × ${f(p.P)} × ${f(p.M)} / (8.314463 × ${f(p.T)})`),
  from: (c, p) => step(c / (nTot(p) * p.M), 'x = C·R·T / (P·M)', `${f(c)} × 8.314463 × ${f(p.T)} / (${f(p.P)} × ${f(p.M)})`),
};
const G_w: Def = {
  id: 'w', label: 'mass fraction', needs: ['M', 'Mg'],
  to: (x, p) => step(x * p.M / (x * p.M + (1 - x) * p.Mg), 'w = x·M / (x·M + (1 − x)·Mg)', `${f(x)} × ${f(p.M)} / (${f(x)} × ${f(p.M)} + ${f(1 - x)} × ${f(p.Mg)})`),
  from: (w, p) => step((w / p.M) / (w / p.M + (1 - w) / p.Mg), 'x = (w/M) / (w/M + (1 − w)/Mg)', `(${f(w)}/${f(p.M)}) / (${f(w)}/${f(p.M)} + ${f(1 - w)}/${f(p.Mg)})`),
};

const GAS: Def[] = [
  scaled(G_x, 'ppmv', 'ppmv', 1e6), scaled(G_x, 'ppbv', 'ppbv', 1e9), scaled(G_x, 'pptv', 'pptv', 1e12),
  scaled(G_x, 'pvv', '% v/v', 100),
  G_molL, scaled(G_molL, 'mmolL', 'mmol/L', 1e3), scaled(G_molL, 'umolL', 'µmol/L', 1e6), scaled(G_molL, 'nmolL', 'nmol/L', 1e9),
  G_gL, scaled(G_gL, 'mgL', 'mg/L', 1e3), scaled(G_gL, 'ugL', 'µg/L', 1e6), scaled(G_gL, 'mgm3', 'mg/m³', 1e6), scaled(G_gL, 'ugm3', 'µg/m³', 1e9),
  scaled(G_w, 'pww', '% w/w', 100), scaled(G_w, 'mgkg', 'mg/kg', 1e6),
  scaled(G_w, 'ppm', 'ppm (mass)', 1e6, ''), scaled(G_w, 'ppb', 'ppb (mass)', 1e9, ''), scaled(G_w, 'ppt', 'ppt (mass)', 1e12, ''),
  scaled(G_x, 'molpct', 'mol %', 100), G_x, G_w,
];

const TABLE: Record<Phase, Def[]> = { liquid: LIQUID, gas: GAS };
const def = (phase: Phase, id: string) => { const d = TABLE[phase].find((u) => u.id === id); if (!d) throw new Error(`Unknown unit ${id}`); return d; };

export const units = (phase: Phase): UnitInfo[] => TABLE[phase].map(({ id, label, needs }) => ({ id, label, needs }));
export const baseName = (phase: Phase) => (phase === 'liquid' ? 'mass fraction w' : 'mole fraction x');

const ok = (v: number | undefined) => typeof v === 'number' && Number.isFinite(v) && v > 0;
/** The values a unit needs that are missing or not positive. */
export function missing(phase: Phase, id: string, p: Params): Need[] {
  return def(phase, id).needs.filter((n) => (n === 'TP' ? !(ok(p.T) && ok(p.P)) : !ok(p[n])));
}
const full = (p: Params) => p as Required<Params>;

export class ConcError extends Error {}

/** A value in one unit to the base (w or x), with the steps. Throws ConcError when it is impossible. */
export function toBase(phase: Phase, id: string, v: number, p: Params): Step {
  const miss = missing(phase, id, p);
  if (miss.length) throw new ConcError(`To read ${def(phase, id).label} the page needs ${miss.map((m) => NEED_TEXT[m]).join(' and ')}.`);
  if (!(Number.isFinite(v) && v >= 0)) throw new ConcError('A concentration is a number of 0 or more.');
  const s = def(phase, id).from(v, full(p));
  if (!(s.value <= 1 + 1e-12)) throw new ConcError(`${f(v)} ${def(phase, id).label} would be more than pure solute (${baseName(phase)} ${f(s.value)}). Check the value${phase === 'liquid' ? ', the density' : ''} and the molar mass.`);
  return { value: Math.min(1, s.value), text: s.text };
}
/** The base (w or x) to one unit, with the steps; null when a value it needs is missing. */
export function fromBase(phase: Phase, id: string, b: number, p: Params): Step | null {
  if (missing(phase, id, p).length) return null;
  return def(phase, id).to(b, full(p));
}
/** One value from one unit to another (NaN if a needed value is missing). */
export function convert(phase: Phase, from: string, to: string, v: number, p: Params): number {
  const b = toBase(phase, from, v, p).value;
  return fromBase(phase, to, b, p)?.value ?? NaN;
}

export type Row = { id: string; label: string; value: number | null; missing: Need[]; chain: string[] };
/** Every unit for one input value: the value and the chain of steps from the input. */
export function convertAll(phase: Phase, from: string, v: number, p: Params): { base: number; into: string; rows: Row[] } {
  const into = toBase(phase, from, v, p);
  const base = baseName(phase);
  const rows = TABLE[phase].map((u) => {
    const miss = missing(phase, u.id, p);
    if (miss.length) return { id: u.id, label: u.label, value: null, missing: miss, chain: [] };
    const out = u.to(into.value, full(p));
    const chain = u.id === from ? [`${f(v)} ${u.label} (as typed)`] : [`${f(v)} ${def(phase, from).label} → ${base}: ${into.text}`, `${base} → ${u.label}: ${out.text}`];
    return { id: u.id, label: u.label, value: u.id === from ? v : out.value, missing: [], chain };
  });
  return { base: into.value, into: into.text, rows };
}

/** A molar mass typed as a number (g/mol) or as a formula ("NaCl", "CuSO4·5H2O"). "air" is dry air. */
export function readMolarMass(text: string): { M: number; formula: boolean } | string {
  const t = text.trim();
  if (!t) return 'empty';
  if (/^air$/i.test(t)) return { M: AIR, formula: false };
  const n = num(t);
  if (!Number.isNaN(n)) return n > 0 ? { M: n, formula: false } : 'A molar mass is a positive number of g/mol.';
  try { return { M: molarMass(parseFormula(t)), formula: true }; }
  catch (e) { return e instanceof FormulaError ? e.message : 'That is not a formula or a number.'; }
}
