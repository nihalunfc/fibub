// lac operon (school level, Class 12 biology): the repressor switch (lactose as inducer), mutants with no repressor
// (i⁻) or an operator the repressor cannot hold (Oᶜ), the CAP-cAMP boost when glucose is absent (extension), and a
// teaching time course: glucose used first, then the operon switches on, eats the lactose and switches off.
// Made-up rate constants. Pure functions, no DOM.

export type Mutant = 'none' | 'i-' | 'oc';
export type Level = 'basic' | 'cap';

/** What the switch does for given sugars. */
export function state(lactose: boolean, glucose: boolean, mutant: Mutant = 'none', level: Level = 'basic') {
  const repressorMade = mutant !== 'i-';
  const repressorActive = repressorMade && !lactose; // allolactose (from lactose) binds the repressor and lifts it off
  const bound = repressorActive && mutant !== 'oc';
  const cap = level === 'cap' && !glucose; // little glucose → cAMP high → CAP-cAMP helps RNA polymerase bind
  const expression: 'off' | 'low' | 'high' | 'on' = bound ? 'off' : level === 'basic' ? 'on' : cap ? 'high' : 'low';
  return { repressorMade, repressorActive, bound, cap, expression };
}

export type Params = { alpha: number; delta: number; basal: number; kl: number; km: number; ki: number; kg: number; kgm: number; kc: number };
export const P: Params = { alpha: 0.05, delta: 0.02, basal: 0.01, kl: 0.05, km: 0.5, ki: 0.1, kg: 0.02, kgm: 0.1, kc: 0.05 };

/** Right-hand side: y = [glucose mM, lactose mM, enzyme level]. */
export function rhs(y: number[], mutant: Mutant, level: Level, p: Params = P): number[] {
  const [G, L, E] = y.map((v) => Math.max(0, v));
  const f = mutant === 'none' ? (L * L) / (p.ki * p.ki + L * L) : 1; // share of operators free of repressor
  const capF = level === 'cap' ? 1 / (1 + G / p.kc) : 1; // glucose keeps cAMP and so CAP low
  return [
    -p.kg * G / (p.kgm + G),
    -p.kl * E * L / (p.km + L),
    p.alpha * (p.basal + (1 - p.basal) * f) * capF - p.delta * E,
  ];
}

/** Runge-Kutta 4 from t = 0 to tEnd minutes. Starts with the operon at its basal level. */
export function simulate(G0: number, L0: number, mutant: Mutant, level: Level, tEnd = 400, dt = 0.5, p: Params = P) {
  if (!(G0 >= 0) || !(L0 >= 0) || !(tEnd > 0)) throw new Error('Sugars cannot be negative and the time must be above zero.');
  let y = [G0, L0, (p.alpha * p.basal) / p.delta];
  const t: number[] = [0], ys: number[][] = [y.slice()];
  const add = (a: number[], b: number[], h: number) => a.map((v, i) => v + h * b[i]);
  for (let s = 1; s * dt <= tEnd + 1e-9; s++) {
    const k1 = rhs(y, mutant, level, p), k2 = rhs(add(y, k1, dt / 2), mutant, level, p), k3 = rhs(add(y, k2, dt / 2), mutant, level, p), k4 = rhs(add(y, k3, dt), mutant, level, p);
    y = y.map((v, i) => Math.max(0, v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])));
    t.push(s * dt); ys.push(y.slice());
  }
  return { t, glucose: ys.map((v) => v[0]), lactose: ys.map((v) => v[1]), enzyme: ys.map((v) => v[2]) };
}

/** First time a series falls below a level (or NaN). */
export function timeBelow(t: number[], ys: number[], level: number): number {
  for (let i = 0; i < ys.length; i++) if (ys[i] < level) return t[i];
  return NaN;
}
