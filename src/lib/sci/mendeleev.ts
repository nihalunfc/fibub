// Mendeleev's method for the school mendeleev-predictor tool: hide an element and predict its atomic mass or density
// from the four elements around it in the table (above, below, left, right), then compare with the real value; and
// Mendeleev's own 1871 predictions for eka-aluminium, eka-boron and eka-silicon. Plain TypeScript, no DOM.
import { TABLE } from './ptable.ts';
import { type Question, pick, one, n } from './h4quiz.ts';

/** Densities near room temperature (g/cm³), rounded: general reference values (white P, white Sn, grey Se). */
export const DENSITY: Record<number, number> = {
  13: 2.70, 14: 2.33, 15: 1.82, 16: 2.07, 30: 7.14, 31: 5.91, 32: 5.32, 33: 5.73, 34: 4.81, 35: 3.10,
  48: 8.65, 49: 7.31, 50: 7.29, 51: 6.69, 52: 6.24, 53: 4.93, 81: 11.85, 82: 11.34, 83: 9.79, 84: 9.2,
};
export const HIDDEN = [31, 32, 33, 34, 50, 51]; // Ga, Ge, As, Se, Sn, Sb: each has four neighbours with data
export const el = (z: number) => TABLE[z - 1];

/** The four neighbours (atomic numbers) of an element in the main table: above, below, left, right. */
export function neighbours(z: number) {
  const e = el(z), at = (p: number, g: number) => TABLE.find((x) => x.period === p && x.group === g)?.z ?? null;
  return { up: at(e.period - 1, e.group!), down: at(e.period + 1, e.group!), left: at(e.period, e.group! - 1), right: at(e.period, e.group! + 1) };
}
export type Prop = 'mass' | 'density';
export const valueOf = (z: number, p: Prop) => (p === 'mass' ? el(z).weight : DENSITY[z] ?? NaN);
/** Mendeleev-style prediction: the average of the four neighbours. */
export function predict(z: number, p: Prop) {
  const nb = neighbours(z), zs = [nb.up, nb.down, nb.left, nb.right].filter((x): x is number => x !== null);
  const vals = zs.map((x) => valueOf(x, p)), guess = vals.reduce((a, b) => a + b, 0) / vals.length, real = valueOf(z, p);
  return { nb, zs, vals, guess, real, errPct: ((guess - real) / real) * 100 };
}

/** Mendeleev's 1871 predictions and what was found (history of chemistry). */
export const ECKA = [
  { eka: 'Eka-aluminium', z: 31, found: 'gallium', year: 1875, predMass: 68, predDensity: 5.9, realDensity: 5.91, predOxide: 'Ea₂O₃', oxide: 'Ga₂O₃' },
  { eka: 'Eka-boron', z: 21, found: 'scandium', year: 1879, predMass: 44, predDensity: NaN, realDensity: 2.99, predOxide: 'Eb₂O₃', oxide: 'Sc₂O₃' },
  { eka: 'Eka-silicon', z: 32, found: 'germanium', year: 1886, predMass: 72, predDensity: 5.5, realDensity: 5.32, predOxide: 'EsO₂', oxide: 'GeO₂' },
];

// ---- Check yourself ---------------------------------------------------------------------------------
export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const z = one(rng, HIDDEN), p = predict(z, 'mass'), names = p.zs.map((x) => `${el(x).name} ${el(x).weight}`).join(', ');
    qs.push({ text: `Hide ${el(z).name}. Its four neighbours in the table have atomic masses ${names}. What atomic mass does their average predict?`, ans: p.guess, unit: 'u', work: `(${p.vals.join(' + ')}) ÷ 4 = ${n(p.guess, 2)} u. The real value is ${el(z).weight} u.`, tol: 0.05 }); }
  { const m = one(rng, ECKA), real = el(m.z).weight, e = ((m.predMass - real) / real) * 100;
    qs.push({ text: `Mendeleev predicted an atomic mass of ${m.predMass} for ${m.eka.toLowerCase()}. ${m.found[0].toUpperCase() + m.found.slice(1)} turned out to have ${real}. By what percentage was he off? (Give the size, ignore the sign.)`, ans: Math.abs(e), unit: '%', work: `|${m.predMass} − ${real}| ÷ ${real} × 100 = ${n(Math.abs(e), 2)} %.`, tol: 0.05 }); }
  { const a = pick(rng, 20, 40), b = a + pick(rng, 20, 40);
    qs.push({ text: `In a made-up table, the element above a gap has atomic mass ${a} and the one below has ${b}. Using just these two, what mass would you predict for the gap?`, ans: (a + b) / 2, unit: 'u', work: `Average: (${a} + ${b}) ÷ 2 = ${n((a + b) / 2, 1)} u.`, tol: 0.05 }); }
  { const m = one(rng, ECKA);
    qs.push({ text: `In which year was ${m.eka.toLowerCase()} (${m.found}) discovered?`, ans: m.year, unit: '', work: `${m.found[0].toUpperCase() + m.found.slice(1)} was found in ${m.year}, a few years after Mendeleev's 1871 prediction.`, tol: 0.01 }); }
  return qs;
}
