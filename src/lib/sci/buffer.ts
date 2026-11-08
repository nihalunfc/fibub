// Buffer recipes: how much of each form, and how much strong acid or base, gives a chosen pH at a chosen temperature,
// concentration and ionic strength. Full charge balance over every pKa of the buffer (not only Henderson–Hasselbalch),
// activity corrections by the Davies equation, buffer capacity, and the pH drift when a buffer is used at another
// temperature. pKa values and their temperature slopes are rounded, approximate textbook values (±0.05).
import { parseFormula, molarMass } from './chem.ts';

/** One weighable form: `k` protons removed from the fully protonated species. */
export type Form = { name: string; formula: string; k: number; liquid?: { density: number } };
/** z0: charge of the fully protonated species. pKa: 25 °C, zero ionic strength. dT: change in each pKa per °C. */
export type Buffer = { id: string; name: string; z0: number; pKa: number[]; dT: number[]; forms: Form[]; note?: string };

const B = (id: string, name: string, z0: number, pKa: number[], dT: number[], forms: Form[], note?: string): Buffer => ({ id, name, z0, pKa, dT, forms, note });

export const BUFFERS: Buffer[] = [
  B('citrate', 'Citrate', 0, [3.15, 4.75, 6.4], [0, 0, 0], [
    { name: 'Citric acid, anhydrous', formula: 'C6H8O7', k: 0 }, { name: 'Citric acid monohydrate', formula: 'C6H8O7·H2O', k: 0 },
    { name: 'Trisodium citrate dihydrate', formula: 'Na3C6H5O7·2H2O', k: 3 }]),
  B('acetate', 'Acetate', 0, [4.75], [0], [
    { name: 'Acetic acid (glacial, liquid)', formula: 'C2H4O2', k: 0, liquid: { density: 1.049 } }, { name: 'Sodium acetate, anhydrous', formula: 'C2H3NaO2', k: 1 },
    { name: 'Sodium acetate trihydrate', formula: 'C2H3NaO2·3H2O', k: 1 }]),
  B('mes', 'MES', 0, [6.1], [-0.01], [{ name: 'MES (free acid)', formula: 'C6H13NO4S', k: 0 }, { name: 'MES sodium salt', formula: 'C6H12NNaO4S', k: 1 }]),
  B('bistris', 'Bis-Tris', 0, [6.5], [-0.015], [{ name: 'Bis-Tris (base)', formula: 'C8H19NO5', k: 1 }], 'The weighed base form takes up a proton below its pKa, so it is adjusted with HCl.'),
  B('phosphate', 'Phosphate (sodium)', 0, [2.15, 7.2, 12.35], [0.005, -0.003, -0.025], [
    { name: 'Sodium dihydrogen phosphate, anhydrous', formula: 'NaH2PO4', k: 1 },
    { name: 'Sodium dihydrogen phosphate monohydrate', formula: 'NaH2PO4·H2O', k: 1 }, { name: 'Sodium dihydrogen phosphate dihydrate', formula: 'NaH2PO4·2H2O', k: 1 },
    { name: 'Disodium hydrogen phosphate, anhydrous', formula: 'Na2HPO4', k: 2 }, { name: 'Disodium hydrogen phosphate heptahydrate', formula: 'Na2HPO4·7H2O', k: 2 },
    { name: 'Disodium hydrogen phosphate dodecahydrate', formula: 'Na2HPO4·12H2O', k: 2 }, { name: 'Trisodium phosphate dodecahydrate', formula: 'Na3PO4·12H2O', k: 3 }]),
  B('imidazole', 'Imidazole', 1, [6.95], [-0.02], [{ name: 'Imidazole (base)', formula: 'C3H4N2', k: 1 }]),
  B('mops', 'MOPS', 0, [7.2], [-0.015], [{ name: 'MOPS (free acid)', formula: 'C7H15NO4S', k: 0 }, { name: 'MOPS sodium salt', formula: 'C7H14NNaO4S', k: 1 }]),
  B('hepes', 'HEPES', 0, [7.5], [-0.015], [{ name: 'HEPES (free acid)', formula: 'C8H18N2O4S', k: 0 }, { name: 'HEPES sodium salt', formula: 'C8H17N2NaO4S', k: 1 }]),
  B('tricine', 'Tricine', 0, [8.05], [-0.02], [{ name: 'Tricine', formula: 'C6H13NO5', k: 0 }]),
  B('tris', 'Tris', 1, [8.05], [-0.03], [{ name: 'Tris base', formula: 'C4H11NO3', k: 1 }, { name: 'Tris hydrochloride', formula: 'C4H11NO3·HCl', k: 0 }],
    'Tris drifts about 0.03 pH units per °C, so set the pH at the temperature you will use it.'),
  B('bicine', 'Bicine', 0, [8.35], [-0.02], [{ name: 'Bicine', formula: 'C6H13NO4', k: 0 }]),
  B('taps', 'TAPS', 0, [8.4], [-0.02], [{ name: 'TAPS (free acid)', formula: 'C7H17NO6S', k: 0 }]),
  B('borate', 'Borate', 0, [9.25], [-0.01], [{ name: 'Boric acid', formula: 'H3BO3', k: 0 }], 'Borate forms polyborates above about 25 mM, so the real pH can differ more than for other buffers.'),
  B('ches', 'CHES', 0, [9.3], [-0.02], [{ name: 'CHES', formula: 'C8H17NO3S', k: 0 }]),
  B('glycine', 'Glycine', 1, [2.35, 9.8], [0, -0.025], [{ name: 'Glycine', formula: 'C2H5NO2', k: 1 }]),
  B('caps', 'CAPS', 0, [10.4], [-0.02], [{ name: 'CAPS', formula: 'C9H19NO3S', k: 0 }]),
];

export const formMass = (f: Form) => molarMass(parseFormula(f.formula));

/** pKw of water against temperature (°C), rounded values with linear interpolation. */
const KW: [number, number][] = [[0, 14.95], [10, 14.55], [20, 14.15], [25, 14.0], [30, 13.85], [37, 13.6], [40, 13.55], [50, 13.25], [60, 13.0], [80, 12.6], [100, 12.25]];
export function pKw(t: number): number {
  if (t <= KW[0][0]) return KW[0][1];
  for (let i = 1; i < KW.length; i++) if (t <= KW[i][0]) { const [a, pa] = KW[i - 1], [b, pb] = KW[i]; return pa + ((pb - pa) * (t - a)) / (b - a); }
  return KW[KW.length - 1][1];
}
/** Debye–Hückel A constant for water (per √(mol/L)), a simple straight line through its usual values: 0.491 at 0 °C to 0.52 near 40 °C. */
export const debyeA = (t: number) => 0.491 + 0.0007 * t;
/** Davies: log10 γ for charge z at ionic strength I. */
export const logGamma = (z: number, I: number, t: number) => { const s = Math.sqrt(Math.max(I, 0)); return -debyeA(t) * z * z * (s / (1 + s) - 0.3 * I); };

/** pKa values at temperature t (°C) and zero ionic strength. */
export const pKaAt = (b: Buffer, t: number) => b.pKa.map((p, i) => p + b.dT[i] * (t - 25));
/** Apparent pKa′ (pH as activity, the buffer species as concentrations) at ionic strength I. */
export function pKaApparent(b: Buffer, t: number, I: number): number[] {
  return pKaAt(b, t).map((p, i) => { const zHA = b.z0 - i, zA = b.z0 - i - 1; return p + logGamma(zA, I, t) - logGamma(zHA, I, t); });
}
/** Fractions α_i of the species with i protons removed, at pH (activity) and apparent pKa′. */
export function fractions(pH: number, pKa: number[]): number[] {
  // log of the unnormalised weights: w_0 = 0, w_i = Σ_{j<i} (pH − pKa_j)
  const lw = [0]; for (let i = 0; i < pKa.length; i++) lw.push(lw[i] + (pH - pKa[i]));
  const m = Math.max(...lw), w = lw.map((x) => 10 ** (x - m)), s = w.reduce((a, c) => a + c, 0);
  return w.map((x) => x / s);
}
export const nBar = (alpha: number[]) => alpha.reduce((s, a, i) => s + a * i, 0);

export type State = { pH: number; t: number; C: number; pKa: number[]; alpha: number[]; nbar: number; H: number; OH: number; I: number; beta: number; gamma1: number };

/**
 * Equilibrium state at a given pH: species, free H⁺ and OH⁻ (concentrations), ionic strength and buffer capacity.
 * C is the buffer total (mol/L); `spectator` returns the extra counter-ion concentration for this composition
 * (Na⁺ or Cl⁻ added with the forms and the titrant); `salt` is added NaCl (mol/L).
 */
export function stateAt(b: Buffer, pH: number, t: number, C: number, spectator: (nbar: number, H: number, OH: number) => number, salt = 0): State {
  let I = Math.max(C, 1e-6) / 2 + salt, st: State | null = null;
  for (let it = 0; it < 40; it++) {
    const pKa = pKaApparent(b, t, I), alpha = fractions(pH, pKa), nb = nBar(alpha);
    const g1 = 10 ** logGamma(1, I, t), H = 10 ** -pH / g1, OH = 10 ** (pH - pKw(t)) / g1;
    const ions = alpha.reduce((s, a, i) => s + a * (b.z0 - i) ** 2, 0) * C;
    const In = 0.5 * (ions + spectator(nb, H, OH) + H + OH + 2 * salt);
    const beta = 2.302585 * (H + OH + C * alpha.reduce((s, a, i) => s + a * (i - nb) ** 2, 0));
    st = { pH, t, C, pKa, alpha, nbar: nb, H, OH, I: In, beta, gamma1: g1 };
    if (Math.abs(In - I) < 1e-10) break;
    I = In;
  }
  return st!;
}

export type Recipe = {
  state: State;
  forms: { form: Form; mol: number; grams: number; mL?: number }[];
  /** Strong base (positive, NaOH) or strong acid (negative, HCl) to add, mol in the final volume. */
  titrant: number; titrantmL: number;
  ok: boolean; warn: string[];
};

/** Counter-ions brought in by a form: Na⁺ when it carries a negative charge, Cl⁻ when positive. */
const counterIons = (b: Buffer, k: number) => Math.abs(b.z0 - k);

/**
 * Weigh one form, then adjust with strong base or acid to reach the pH.
 * V in litres, C and Ct (titrant) in mol/L.
 */
export function oneForm(b: Buffer, form: Form, pH: number, t: number, C: number, V: number, Ct: number, salt = 0): Recipe {
  const spect = (nb: number, H: number, OH: number) => C * counterIons(b, form.k) + Math.abs(OH - H + C * (nb - form.k));
  const st = stateAt(b, pH, t, C, spect, salt);
  const per = st.OH - st.H + C * (st.nbar - form.k); // mol/L of strong base (− = acid)
  const mol = C * V, mm = formMass(form);
  const warn = rangeWarnings(b, st);
  return { state: st, forms: [{ form, mol, grams: mol * mm, mL: form.liquid ? (mol * mm) / form.liquid.density : undefined }], titrant: per * V, titrantmL: Ct > 0 ? (Math.abs(per) * V * 1000) / Ct : NaN, ok: true, warn };
}

/** Mix two forms (no titrant): amounts of each. Fails when the pH lies outside what the pair can reach. */
export function twoForms(b: Buffer, f1: Form, f2: Form, pH: number, t: number, C: number, V: number, salt = 0): Recipe {
  const [a, c] = f1.k <= f2.k ? [f1, f2] : [f2, f1];
  let x2 = 0;
  const spect = (nb: number, H: number, OH: number) => { const y = a.k === c.k ? 0 : (C * nb + OH - H - C * a.k) / (c.k - a.k); x2 = y; return (C - y) * counterIons(b, a.k) + y * counterIons(b, c.k); };
  const st = stateAt(b, pH, t, C, spect, salt);
  const ok = a.k !== c.k && x2 >= -1e-12 && x2 <= C + 1e-12;
  const y = Math.min(Math.max(x2, 0), C), x1 = C - y;
  const mk = (f: Form, molL: number) => { const mol = molL * V, g = mol * formMass(f); return { form: f, mol, grams: g, mL: f.liquid ? g / f.liquid.density : undefined }; };
  const warn = rangeWarnings(b, st);
  if (!ok) warn.unshift(a.k === c.k ? 'Choose two different forms.' : `These two forms only reach between pH ${pHFor(b, a, t, C, salt).toFixed(2)} and ${pHFor(b, c, t, C, salt).toFixed(2)}. Use the other recipe (one form plus acid or base).`);
  return { state: st, forms: [mk(a, x1), mk(c, y)], titrant: 0, titrantmL: 0, ok, warn };
}

function rangeWarnings(b: Buffer, st: State): string[] {
  const near = st.pKa.reduce((best, p) => (Math.abs(p - st.pH) < Math.abs(best - st.pH) ? p : best), st.pKa[0]);
  const w: string[] = [];
  if (Math.abs(near - st.pH) > 1) w.push(`pH ${st.pH} is more than 1 unit from the nearest pKa′ (${near.toFixed(2)}), so ${b.name} buffers poorly here.`);
  return w;
}

/**
 * pH of a solution whose composition is fixed: `base` mol/L of strong base equivalents above the fully protonated
 * species (C·n̄ + [OH⁻] − [H⁺]), with `counter` mol/L of spectator ions. Solved by bisection.
 */
export function pHOf(b: Buffer, t: number, C: number, base: number, counter: number, salt = 0): State {
  let lo = -1, hi = 15;
  const f = (pH: number) => { const s = stateAt(b, pH, t, C, () => counter, salt); return { s, g: C * s.nbar + s.OH - s.H - base }; };
  for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (f(m).g > 0) hi = m; else lo = m; }
  return f((lo + hi) / 2).s;
}
/** pH of a pure solution of one form at total C. */
export const pHFor = (b: Buffer, f: Form, t: number, C: number, salt = 0) => pHOf(b, t, C, C * f.k, C * counterIons(b, f.k), salt).pH;

/** The same recipe used at another temperature: composition fixed, pH moves with the pKa and pKw. */
export function pHAtOtherT(b: Buffer, r: Recipe, tUse: number, salt = 0): number {
  const s = r.state, base = s.C * s.nbar + s.OH - s.H;
  const counter = 2 * s.I - s.alpha.reduce((a, x, i) => a + x * (b.z0 - i) ** 2, 0) * s.C - s.H - s.OH - 2 * salt;
  return pHOf(b, tUse, s.C, base, Math.max(counter, 0), salt).pH;
}

/** Maximum buffer capacity near a pKa (for scale): β at pH = pKa′ for a single pair is 2.303·C/4. */
export const betaMaxSingle = (C: number) => 2.302585 * C / 4;
