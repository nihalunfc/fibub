// Pure maths for the everyday body and movement tools (calorie, water, steps, pace, one-rep max).
// Plain TypeScript, no DOM. Checked in tests/everyday.mjs.

export const MI = 1.609344; // km in one international mile
export const LB = 0.45359237; // kg in one pound
export const IN = 2.54; // cm in one inch

// ---- Calorie calculator -------------------------------------------------
export type Sex = 'm' | 'f';
/** Mifflin-St Jeor (1990). kg, cm, years. */
export const bmrMifflin = (kg: number, cm: number, age: number, sex: Sex) => 10 * kg + 6.25 * cm - 5 * age + (sex === 'm' ? 5 : -161);
/** Revised Harris-Benedict (Roza and Shizgal 1984). */
export const bmrHarris = (kg: number, cm: number, age: number, sex: Sex) =>
  sex === 'm' ? 88.362 + 13.397 * kg + 4.799 * cm - 5.677 * age : 447.593 + 9.247 * kg + 3.098 * cm - 4.33 * age;
/** Katch-McArdle: uses lean body mass, from body fat percent. */
export const bmrKatch = (kg: number, bodyFatPct: number) => 370 + 21.6 * kg * (1 - bodyFatPct / 100);
/** Weeks to move from one weight to a goal at a steady weekly rate (kg per week, signed). NaN when the rate goes the wrong way. */
export const weeksToGoal = (kgNow: number, kgGoal: number, ratePerWeek: number) => {
  const diff = kgGoal - kgNow;
  if (diff === 0) return 0;
  if (!ratePerWeek || Math.sign(diff) !== Math.sign(ratePerWeek)) return NaN;
  return diff / ratePerWeek;
};
/** Split a daily target between meals; shares are relative and need not add to 100. */
export const mealSplit = (kcal: number, shares: number[]) => {
  const t = shares.reduce((a, b) => a + b, 0);
  return t > 0 ? shares.map((s) => (kcal * s) / t) : shares.map(() => NaN);
};

// ---- Water intake -------------------------------------------------------
/** Times (minutes from midnight) for n drinks spread from wake to bed; the last one lands before bed. */
export const drinkTimes = (n: number, wakeMin: number, bedMin: number) => {
  if (!(n >= 1) || n > 60) return [];
  let end = bedMin; if (end <= wakeMin) end += 1440;
  const step = (end - wakeMin) / n;
  return Array.from({ length: Math.floor(n) }, (_, i) => Math.round(wakeMin + i * step) % 1440);
};
/** Rule-of-thumb daily water from body weight (mL per kg), in litres. */
export const waterByWeight = (kg: number, mlPerKg: number) => (kg * mlPerKg) / 1000;

// ---- Steps to distance --------------------------------------------------
/** "5'7", "5 ft 7", "5-7" or plain inches -> inches. NaN when it cannot be read. */
export const parseFeetInches = (s: string) => {
  const t = s.trim().toLowerCase().replace(/["”″]/g, '').replace(/ft|feet|foot|[′’']/g, "'").replace(/in(ches)?/g, '');
  const m = /^(\d+(?:\.\d+)?)\s*['\- ]\s*(\d+(?:\.\d+)?)?\s*$/.exec(t);
  if (m) return +m[1] * 12 + (m[2] ? +m[2] : 0);
  const v = Number(t);
  return t !== '' && Number.isFinite(v) ? v : NaN;
};
export type StepRow = { steps: number; km: number; minutes: number; kcal: number };
/** One row of the common step-goal table. */
export const stepRow = (steps: number, strideCm: number, speedKmh: number, met: number, kg: number): StepRow => {
  const km = (steps * strideCm) / 100000, minutes = speedKmh > 0 ? (km / speedKmh) * 60 : NaN;
  return { steps, km, minutes, kcal: met > 0 && kg > 0 && minutes > 0 ? (met * kg * minutes) / 60 : NaN };
};

// ---- Pace ---------------------------------------------------------------
/** Time (s) to cover the first x of d (any unit) at an average pace p (s per unit), when the first half is run d_s slower and the second half d_s faster. */
export const cumTime = (x: number, d: number, p: number, shift: number) => {
  const h = d / 2;
  return x <= h ? (p + shift) * x : (p + shift) * h + (p - shift) * (x - h);
};
/** Riegel (1981): predicted time for distance d2 from time t1 at d1. */
export const riegel = (t1: number, d1: number, d2: number, k = 1.06) => t1 * Math.pow(d2 / d1, k);

// ---- One-rep max --------------------------------------------------------
export const epley = (w: number, r: number) => (r === 1 ? w : w * (1 + r / 30));
export const brzycki = (w: number, r: number) => (r === 1 ? w : r >= 37 ? NaN : (w * 36) / (37 - r));
export const lombardi = (w: number, r: number) => w * Math.pow(r, 0.1);
export const oconnor = (w: number, r: number) => w * (1 + r / 40);
export const wathan = (w: number, r: number) => (100 * w) / (48.8 + 53.8 * Math.exp(-0.075 * r));
export const mayhew = (w: number, r: number) => (100 * w) / (52.2 + 41.9 * Math.exp(-0.055 * r));
export const lander = (w: number, r: number) => (r >= 37 ? NaN : (100 * w) / (101.3 - 2.67123 * r));
export const FORMULAS: [string, (w: number, r: number) => number][] = [
  ['Epley', epley], ['Brzycki', brzycki], ['Lombardi', lombardi], ["O'Connor", oconnor], ['Wathan', wathan], ['Mayhew', mayhew], ['Lander', lander],
];
/** Weight you could lift for r reps given a one-rep max (Epley turned round). */
export const weightForReps = (orm: number, r: number) => (r <= 1 ? orm : orm / (1 + r / 30));
/** Plates on each side of a bar to reach a total, using the largest first. Returns plates and what is left over (per side). */
export const platesPerSide = (total: number, bar: number, plates: number[]) => {
  let left = (total - bar) / 2;
  if (!(left >= 0)) return { plates: [] as [number, number][], left: NaN };
  const out: [number, number][] = [];
  for (const p of [...plates].sort((a, b) => b - a)) {
    const n = Math.floor(left / p + 1e-9);
    if (n > 0) { out.push([p, n]); left -= n * p; }
  }
  return { plates: out, left: Math.round(left * 1000) / 1000 };
};
