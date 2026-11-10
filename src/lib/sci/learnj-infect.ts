// How an infection spreads (Learn): a town of people, each ill person meets a few random people a day and passes
// the illness on with some chance; people are ill for a fixed number of days, then immune. Vaccinated people start
// immune. A teaching model (a stochastic SIR model with random mixing), no DOM.

export type Town = { n: number; contacts: number; chance: number; days: number; vaccinated: number; seeds: number };
export type State = 0 | 1 | 2 | 3; // 0 susceptible, 1 ill, 2 recovered, 3 vaccinated
export type Day = { s: number; i: number; r: number; v: number; newCases: number };

/** Basic reproduction number: people infected by one ill person in a town where nobody is immune. */
export const r0 = (contacts: number, chance: number, days: number) => contacts * chance * days;
/** Herd immunity threshold: share that must be immune so each case causes less than one more. */
export const herdThreshold = (R0: number) => (R0 > 1 ? 1 - 1 / R0 : 0);
/** Effective reproduction number when only `susceptibleShare` of people can still catch it. */
export const rEff = (R0: number, susceptibleShare: number) => R0 * susceptibleShare;
/** Final share of susceptibles infected in a big town (SIR final-size equation z = 1 − e^(−R z)), by iteration. */
export function finalSize(R: number): number {
  if (R <= 1) return 0;
  let z = 0.5;
  for (let k = 0; k < 500; k++) z = 1 - Math.exp(-R * z);
  return z;
}

export function makeTown(t: Town, rand: () => number) {
  const state: State[] = new Array(t.n).fill(0), left: number[] = new Array(t.n).fill(0);
  const nv = Math.round(t.vaccinated * t.n);
  const order = Array.from({ length: t.n }, (_, i) => i);
  for (let i = t.n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  for (let k = 0; k < nv; k++) state[order[k]] = 3;
  let seeded = 0;
  for (let k = nv; k < t.n && seeded < t.seeds; k++) { state[order[k]] = 1; left[order[k]] = t.days; seeded++; }
  return { state, left };
}

/** Advance one day. Every ill person meets `contacts` random people (whole contacts, plus one more with the
 * leftover chance); a susceptible one they meet catches it with `chance`. Then each ill person has one fewer day
 * left, and recovers at zero. People infected today start being ill tomorrow. */
export function step(t: Town, town: { state: State[]; left: number[] }, rand: () => number): number {
  const { state, left } = town, n = state.length, fresh: number[] = [];
  for (let i = 0; i < n; i++) {
    if (state[i] !== 1) continue;
    const c = Math.floor(t.contacts) + (rand() < t.contacts - Math.floor(t.contacts) ? 1 : 0);
    for (let k = 0; k < c; k++) {
      const j = Math.floor(rand() * n);
      if (j !== i && state[j] === 0 && rand() < t.chance) { state[j] = 1; left[j] = -1; fresh.push(j); }
    }
  }
  for (let i = 0; i < n; i++) if (state[i] === 1 && left[i] > 0) { left[i]--; if (left[i] === 0) state[i] = 2; }
  for (const j of fresh) left[j] = t.days;
  return fresh.length;
}

export function count(state: State[], newCases = 0): Day {
  const d: Day = { s: 0, i: 0, r: 0, v: 0, newCases };
  for (const x of state) { if (x === 0) d.s++; else if (x === 1) d.i++; else if (x === 2) d.r++; else d.v++; }
  return d;
}

/** Run until nobody is ill (or maxDays). */
export function runAll(t: Town, rand: () => number, maxDays = 365): Day[] {
  const town = makeTown(t, rand), out = [count(town.state)];
  for (let d = 0; d < maxDays && out[out.length - 1].i > 0; d++) { const nc = step(t, town, rand); out.push(count(town.state, nc)); }
  return out;
}
