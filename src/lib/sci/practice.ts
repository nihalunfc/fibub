// Practice problems: numeric questions with worked steps and answer checking. Every set comes from a seed, so the
// same seed, topics and number of problems give the same questions on any device (a teacher can share the set code).
// Given values are random but rounded to a stated number of significant figures (or decimal places), and the
// answer is worked out from those rounded values, then rounded by the usual school rules:
//  - multiplying and dividing: as many significant figures as the least precise value;
//  - adding and subtracting: as many decimal places as the least precise value;
//  - logarithms (pH): as many decimal places as the concentration has significant figures, and back again.
// Exact numbers (unit factors, the 1/2 in 1/2 at^2, 273.15) do not limit the answer.
// Plain TypeScript, no DOM.

export type Rule = { sf: number } | { dp: number };
export type Answer = { value: number; rounded: number; text: string; unit: string; rule: Rule; abs?: number; what: string };
export type Problem = { topic: string; variant: string; question: string; vars: Record<string, number>; steps: string[]; answer: Answer };
export type Topic = { id: string; field: 'Units' | 'Physics' | 'Chemistry' | 'Statistics'; name: string; blurb: string; make: (r: Rng) => Problem };
export type Rng = () => number;

// ---------- random numbers ----------
/** mulberry32: small, fast, same sequence everywhere for one 32-bit seed. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Mix the set seed with a problem number into a new 32-bit seed. */
export function mix(seed: number, i: number): number {
  let h = (seed ^ Math.imul(i + 1, 0x9e3779b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}
const choose = <T>(r: Rng, a: readonly T[]): T => a[Math.floor(r() * a.length)];

// ---------- numbers and significant figures ----------
const SUPD: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const supn = (n: number) => String(n).split('').map((c) => SUPD[c]).join('');
const minus = (s: string) => s.replace(/^-/, '−');

/** Round to n significant figures (as a number). */
/** Round to n significant figures, half away from zero on the decimal value (binary noise such as
 *  2.6749999999999998 for 2.675 is removed first by going through 15 significant figures). */
export function roundSF(x: number, n: number): number {
  if (x === 0 || !Number.isFinite(x)) return x;
  const e = Number(x.toExponential(14).split('e')[1]);
  const d = n - 1 - e;
  return d >= 0 ? roundDP(x, d) : Math.sign(x) * Math.round(Number((Math.abs(x) / 10 ** -d).toPrecision(12))) * 10 ** -d;
}
/** Round half away from zero to d decimal places, robust to binary noise such as 1.005. */
export function roundDP(x: number, d: number): number {
  const f = 10 ** d, y = Math.abs(x) * f;
  const r = Math.round(Number(y.toPrecision(12)));
  return (Math.sign(x) * r) / f;
}
/** x to n significant figures as text, keeping trailing zeros. Plain notation from 0.001 up to where the last
 *  significant figure is still in the units place and is not a 0 (100 to 3 figures would be unclear); otherwise
 *  scientific notation (a × 10ⁿ). */
export function fmtSF(x: number, n: number): string {
  if (x === 0) return n > 1 ? '0.' + '0'.repeat(n - 1) : '0';
  const r = roundSF(x, n);
  const e = Number(r.toExponential(14).split('e')[1]);
  const d = n - 1 - e;
  if (e >= -3 && d >= 0 && !(d === 0 && e > 0 && /0$/.test(r.toFixed(0)))) return minus(r.toFixed(d));
  const m = (r / 10 ** e).toFixed(n - 1);
  return `${minus(m)} × 10${supn(e)}`;
}
export const fmtDP = (x: number, d: number) => minus(roundDP(x, d).toFixed(d));
/** Unrounded working value: 6 significant figures, for the steps. */
export const w = (x: number) => {
  if (x === 0) return '0';
  const a = Math.abs(x);
  if (a >= 1e6 || a < 1e-3) { const [m, e] = x.toExponential(5).split('e'); return `${minus(m.replace(/\.?0+$/, ''))} × 10${supn(Number(e))}`; }
  return minus(String(Number(x.toPrecision(6))));
};
const fmtRule = (x: number, rule: Rule) => ('sf' in rule ? fmtSF(x, rule.sf) : fmtDP(x, rule.dp));
const roundRule = (x: number, rule: Rule) => ('sf' in rule ? roundSF(x, rule.sf) : roundDP(x, rule.dp));

/** A random value in [lo, hi], rounded to sf significant figures, avoiding whole numbers that end in 0 (their
 *  significant figures would be unclear, as in 250). */
export function val(r: Rng, lo: number, hi: number, sf: number): number {
  let v = 0;
  for (let k = 0; k < 40; k++) {
    v = roundSF(lo + (hi - lo) * r(), sf);
    if (!(fmtSF(v, sf).includes('×') && Math.abs(v) >= 1) && v >= lo && v <= hi) return v;
  }
  return v;
}
/** A random value with d decimal places in [lo, hi]. */
export const valDP = (r: Rng, lo: number, hi: number, d: number) => roundDP(lo + (hi - lo) * r(), d);
/** Log-uniform value with sf significant figures. */
export const valLog = (r: Rng, lo: number, hi: number, sf: number) => roundSF(10 ** (Math.log10(lo) + (Math.log10(hi) - Math.log10(lo)) * r()), sf);

/** Significant figures in a plain number written with d decimals (as in 12.30 or 0.0450). */
export function sfOfFixed(x: number, d: number): number {
  const s = Math.abs(roundDP(x, d)).toFixed(d).replace('.', '').replace(/^0+/, '');
  return Math.max(1, s.length);
}

function ans(value: number, rule: Rule, unit: string, what: string, abs?: number): Answer {
  const rounded = roundRule(value, rule);
  return { value, rounded, text: fmtRule(value, rule), unit, rule, what, ...(abs ? { abs } : {}) };
}
const sfStep = (n: number) => `Round to ${n} significant figure${n === 1 ? '' : 's'}, the fewest in the data`;
const exactStep = (n: number) => `The conversion factor is exact, so keep the ${n} significant figures of the data`;
const u = (x: number, n: number, unit: string) => `${fmtSF(x, n)}${unit ? ' ' + unit : ''}`;

// ---------- constants (general science, not tables) ----------
export const C = { g: 9.81, R: 8.314, c: 3.0e8, vSound: 343, atm: 101.325, cal: 4.184, inch: 2.54, Kw: 1.0e-14 };
export const COMPOUNDS = [
  { name: 'sodium chloride, NaCl', M: 58.44 },
  { name: 'potassium chloride, KCl', M: 74.55 },
  { name: 'sodium hydroxide, NaOH', M: 40.0 },
  { name: 'glucose, C₆H₁₂O₆', M: 180.16 },
  { name: 'calcium chloride, CaCl₂', M: 110.98 },
  { name: 'potassium nitrate, KNO₃', M: 101.1 },
] as const;
const fmtM = (M: number) => M.toFixed(2);

// ---------- topics ----------
export const TOPICS: Topic[] = [
  {
    id: 'units', field: 'Units', name: 'Unit conversion', blurb: 'km/h to m/s, kPa to atm, kcal to kJ, inches to cm, °C to K',
    make(r) {
      const v = choose(r, ['speed', 'pressure', 'energy', 'length', 'temperature'] as const);
      if (v === 'speed') {
        const x = val(r, 15, 130, 3);
        const a = x / 3.6;
        return { topic: 'units', variant: v, vars: { x }, question: `A train travels at ${u(x, 3, 'km/h')}. What is this speed in m/s?`,
          steps: ['1 km = 1000 m and 1 h = 3600 s, so 1 km/h = 1000 ÷ 3600 m/s, that is, divide by 3.6.', `v = ${u(x, 3, 'km/h')} ÷ 3.6 = ${w(a)} m/s`, `${exactStep(3)}: ${fmtSF(a, 3)} m/s.`],
          answer: ans(a, { sf: 3 }, 'm/s', 'speed') };
      }
      if (v === 'pressure') {
        const x = val(r, 60, 400, 3);
        const a = x / C.atm;
        return { topic: 'units', variant: v, vars: { x }, question: `A tyre gauge reads ${u(x, 3, 'kPa')}. What is this pressure in atmospheres (atm)?`,
          steps: ['1 atm = 101.325 kPa (exact, by definition).', `p = ${u(x, 3, 'kPa')} ÷ 101.325 kPa/atm = ${w(a)} atm`, `${exactStep(3)}: ${fmtSF(a, 3)} atm.`],
          answer: ans(a, { sf: 3 }, 'atm', 'pressure') };
      }
      if (v === 'energy') {
        const x = val(r, 100, 900, 3);
        const a = x * C.cal;
        return { topic: 'units', variant: v, vars: { x }, question: `A snack bar gives ${u(x, 3, 'kcal')}. How many kilojoules (kJ) is that?`,
          steps: ['1 kcal = 4.184 kJ (the thermochemical calorie, exact).', `E = ${u(x, 3, 'kcal')} × 4.184 kJ/kcal = ${w(a)} kJ`, `${exactStep(3)}: ${fmtSF(a, 3)} kJ.`],
          answer: ans(a, { sf: 3 }, 'kJ', 'energy') };
      }
      if (v === 'length') {
        const x = val(r, 2, 60, 3);
        const a = x * C.inch;
        return { topic: 'units', variant: v, vars: { x }, question: `A screen is ${u(x, 3, 'inches')} wide. How wide is it in centimetres?`,
          steps: ['1 inch = 2.54 cm (exact, by definition).', `L = ${u(x, 3, 'in')} × 2.54 cm/in = ${w(a)} cm`, `${exactStep(3)}: ${fmtSF(a, 3)} cm.`],
          answer: ans(a, { sf: 3 }, 'cm', 'length') };
      }
      const x = Math.round(-40 + 140 * r());
      const a = x + 273.15;
      return { topic: 'units', variant: v, vars: { x }, question: `The temperature is ${minus(String(x))} °C. What is it in kelvin?`,
        steps: ['T(K) = T(°C) + 273.15 (exact).', `T = ${minus(String(x))} + 273.15 = ${w(a)} K`, 'When adding, keep the decimal places of the least precise value. The temperature is given to whole degrees, so round to a whole number: ' + fmtDP(a, 0) + ' K.'],
        answer: ans(a, { dp: 0 }, 'K', 'temperature', 0.2) };
    },
  },
  {
    id: 'kinematics', field: 'Physics', name: 'Motion with constant acceleration', blurb: 'v = u + at, s = ut + ½at², braking distance',
    make(r) {
      const v = choose(r, ['final-speed', 'distance', 'braking'] as const);
      if (v === 'braking') {
        const u0 = val(r, 8, 35, 3), d = val(r, 2.5, 8, 3);
        const s = (u0 * u0) / (2 * d);
        return { topic: 'kinematics', variant: v, vars: { u: u0, d }, question: `A car moving at ${u(u0, 3, 'm/s')} brakes with a steady deceleration of ${u(d, 3, 'm/s²')}. How far does it travel before it stops?`,
          steps: ['Use v² = u² + 2as with final speed v = 0 and a = −' + fmtSF(d, 3) + ' m/s², so s = u² ÷ (2 × deceleration).', `s = ${fmtSF(u0, 3)}² ÷ (2 × ${fmtSF(d, 3)}) = ${w(u0 * u0)} ÷ ${w(2 * d)} = ${w(s)} m`, `${sfStep(3)}: ${fmtSF(s, 3)} m.`],
          answer: ans(s, { sf: 3 }, 'm', 'braking distance') };
      }
      const u0 = val(r, 1.5, 15, 3), a = val(r, 0.5, 4, 3), t = val(r, 2, 12, 3);
      if (v === 'final-speed') {
        const vf = u0 + a * t;
        return { topic: 'kinematics', variant: v, vars: { u: u0, a, t }, question: `A cyclist moving at ${u(u0, 3, 'm/s')} speeds up with a constant acceleration of ${u(a, 3, 'm/s²')} for ${u(t, 3, 's')}. What is the final speed?`,
          steps: ['Use v = u + at.', `v = ${fmtSF(u0, 3)} + ${fmtSF(a, 3)} × ${fmtSF(t, 3)} = ${fmtSF(u0, 3)} + ${w(a * t)} = ${w(vf)} m/s`, `${sfStep(3)}: ${fmtSF(vf, 3)} m/s.`],
          answer: ans(vf, { sf: 3 }, 'm/s', 'final speed') };
      }
      const s = u0 * t + 0.5 * a * t * t;
      return { topic: 'kinematics', variant: v, vars: { u: u0, a, t }, question: `A cyclist moving at ${u(u0, 3, 'm/s')} speeds up with a constant acceleration of ${u(a, 3, 'm/s²')} for ${u(t, 3, 's')}. How far does the cyclist travel in that time?`,
        steps: ['Use s = ut + ½at² (the ½ is exact).', `s = ${fmtSF(u0, 3)} × ${fmtSF(t, 3)} + ½ × ${fmtSF(a, 3)} × ${fmtSF(t, 3)}² = ${w(u0 * t)} + ${w(0.5 * a * t * t)} = ${w(s)} m`, `${sfStep(3)}: ${fmtSF(s, 3)} m.`],
        answer: ans(s, { sf: 3 }, 'm', 'distance') };
    },
  },
  {
    id: 'freefall', field: 'Physics', name: 'Free fall', blurb: 'time to fall and speed at the ground, g = 9.81 m/s²',
    make(r) {
      const v = choose(r, ['time', 'speed'] as const);
      const h = val(r, 1.2, 90, 3);
      if (v === 'time') {
        const t = Math.sqrt((2 * h) / C.g);
        return { topic: 'freefall', variant: v, vars: { h }, question: `A stone is dropped from rest from a height of ${u(h, 3, 'm')}. Ignoring air resistance, how long does it take to reach the ground? Use g = 9.81 m/s².`,
          steps: ['From rest, s = ½gt², so t = √(2h ÷ g).', `t = √(2 × ${fmtSF(h, 3)} ÷ 9.81) = √${w((2 * h) / C.g)} = ${w(t)} s`, `${sfStep(3)}: ${fmtSF(t, 3)} s.`],
          answer: ans(t, { sf: 3 }, 's', 'time') };
      }
      const s = Math.sqrt(2 * C.g * h);
      return { topic: 'freefall', variant: v, vars: { h }, question: `A ball is dropped from rest from a height of ${u(h, 3, 'm')}. Ignoring air resistance, how fast is it moving when it reaches the ground? Use g = 9.81 m/s².`,
        steps: ['From rest, v² = 2gh, so v = √(2gh).', `v = √(2 × 9.81 × ${fmtSF(h, 3)}) = √${w(2 * C.g * h)} = ${w(s)} m/s`, `${sfStep(3)}: ${fmtSF(s, 3)} m/s.`],
        answer: ans(s, { sf: 3 }, 'm/s', 'speed') };
    },
  },
  {
    id: 'energy', field: 'Physics', name: 'Kinetic and potential energy', blurb: 'E = ½mv², E = mgh',
    make(r) {
      const v = choose(r, ['kinetic', 'kinetic-car', 'potential'] as const);
      if (v === 'potential') {
        const m = val(r, 0.5, 80, 3), h = val(r, 1.2, 40, 3);
        const E = m * C.g * h;
        return { topic: 'energy', variant: v, vars: { m, h }, question: `A load of ${u(m, 3, 'kg')} is lifted ${u(h, 3, 'm')} straight up. How much gravitational potential energy does it gain? Use g = 9.81 m/s².`,
          steps: ['Use E = mgh.', `E = ${fmtSF(m, 3)} × 9.81 × ${fmtSF(h, 3)} = ${w(E)} J`, `${sfStep(3)}: ${fmtSF(E, 3)} J.`],
          answer: ans(E, { sf: 3 }, 'J', 'energy') };
      }
      const car = v === 'kinetic-car';
      const m = car ? val(r, 650, 990, 3) : val(r, 0.05, 0.6, 3), s = car ? val(r, 5, 30, 3) : val(r, 4, 40, 3);
      const E = 0.5 * m * s * s;
      return { topic: 'energy', variant: v, vars: { m, v: s }, question: car ? `A car of mass ${u(m, 3, 'kg')} is moving at ${u(s, 3, 'm/s')}. What is its kinetic energy?` : `A ball of mass ${u(m, 3, 'kg')} is thrown at ${u(s, 3, 'm/s')}. What is its kinetic energy?`,
        steps: ['Use E = ½mv² (the ½ is exact).', `E = ½ × ${fmtSF(m, 3)} × ${fmtSF(s, 3)}² = ½ × ${fmtSF(m, 3)} × ${w(s * s)} = ${w(E)} J`, `${sfStep(3)}: ${fmtSF(E, 3)} J.`],
        answer: ans(E, { sf: 3 }, 'J', 'kinetic energy') };
    },
  },
  {
    id: 'ohm', field: 'Physics', name: "Ohm's law and power", blurb: 'I = V/R, P = V²/R, resistors in parallel',
    make(r) {
      const v = choose(r, ['current', 'power', 'parallel'] as const);
      if (v === 'current') {
        const V = val(r, 1.5, 24, 3), R = val(r, 0.12, 9.9, 3);
        const I = (V / (R * 1000)) * 1000;
        return { topic: 'ohm', variant: v, vars: { V, R }, question: `A resistor of ${u(R, 3, 'kΩ')} is connected across a supply of ${u(V, 3, 'V')}. What current flows, in milliamps (mA)?`,
          steps: [`Convert the resistance: ${fmtSF(R, 3)} kΩ = ${w(R * 1000)} Ω.`, `Ohm's law: I = V ÷ R = ${fmtSF(V, 3)} ÷ ${w(R * 1000)} = ${w(I / 1000)} A`, `In milliamps: × 1000 = ${w(I)} mA.`, `${sfStep(3)}: ${fmtSF(I, 3)} mA.`],
          answer: ans(I, { sf: 3 }, 'mA', 'current') };
      }
      if (v === 'power') {
        const V = val(r, 3, 24, 3), R = val(r, 2.2, 99, 3);
        const P = (V * V) / R;
        return { topic: 'ohm', variant: v, vars: { V, R }, question: `A heater element of ${u(R, 3, 'Ω')} is connected to a supply of ${u(V, 3, 'V')}. What power does it use?`,
          steps: ['Combine P = VI with I = V/R: P = V² ÷ R.', `P = ${fmtSF(V, 3)}² ÷ ${fmtSF(R, 3)} = ${w(V * V)} ÷ ${fmtSF(R, 3)} = ${w(P)} W`, `${sfStep(3)}: ${fmtSF(P, 3)} W.`],
          answer: ans(P, { sf: 3 }, 'W', 'power') };
      }
      const R1 = val(r, 10, 990, 3), R2 = val(r, 10, 990, 3);
      const Rp = (R1 * R2) / (R1 + R2);
      return { topic: 'ohm', variant: v, vars: { R1, R2 }, question: `Resistors of ${u(R1, 3, 'Ω')} and ${u(R2, 3, 'Ω')} are connected in parallel. What is their combined resistance?`,
        steps: ['For two resistors in parallel, 1/R = 1/R₁ + 1/R₂, so R = R₁R₂ ÷ (R₁ + R₂).', `R = ${fmtSF(R1, 3)} × ${fmtSF(R2, 3)} ÷ (${fmtSF(R1, 3)} + ${fmtSF(R2, 3)}) = ${w(R1 * R2)} ÷ ${w(R1 + R2)} = ${w(Rp)} Ω`, `${sfStep(3)}: ${fmtSF(Rp, 3)} Ω.`],
        answer: ans(Rp, { sf: 3 }, 'Ω', 'resistance') };
    },
  },
  {
    id: 'waves', field: 'Physics', name: 'Wave speed', blurb: 'v = fλ for sound (343 m/s) and light (3.00 × 10⁸ m/s)',
    make(r) {
      const v = choose(r, ['sound', 'light'] as const);
      if (v === 'sound') {
        const f = val(r, 110, 990, 3);
        const L = C.vSound / f;
        return { topic: 'waves', variant: v, vars: { f }, question: `A sound of frequency ${u(f, 3, 'Hz')} travels through air at 343 m/s. What is its wavelength?`,
          steps: ['Use v = fλ, so λ = v ÷ f.', `λ = 343 ÷ ${fmtSF(f, 3)} = ${w(L)} m`, `${sfStep(3)}: ${fmtSF(L, 3)} m.`],
          answer: ans(L, { sf: 3 }, 'm', 'wavelength') };
      }
      const nm = val(r, 400, 700, 3);
      const f = C.c / (nm * 1e-9);
      return { topic: 'waves', variant: v, vars: { nm }, question: `Light has a wavelength of ${u(nm, 3, 'nm')}. What is its frequency? Use c = 3.00 × 10⁸ m/s.`,
        steps: [`Convert the wavelength: ${fmtSF(nm, 3)} nm = ${fmtSF(nm, 3)} × 10⁻⁹ m.`, `f = c ÷ λ = 3.00 × 10⁸ ÷ (${fmtSF(nm, 3)} × 10⁻⁹) = ${w(f)} Hz`, `${sfStep(3)}: ${fmtSF(f, 3)} Hz.`],
        answer: ans(f, { sf: 3 }, 'Hz', 'frequency') };
    },
  },
  {
    id: 'gas', field: 'Chemistry', name: 'Ideal gas law', blurb: 'pV = nRT for volume or amount, R = 8.314 J/(mol·K)',
    make(r) {
      const v = choose(r, ['volume', 'amount'] as const);
      const T = valDP(r, 5, 95, 1), P = val(r, 85, 250, 3);
      const TK = T + 273.15;
      if (v === 'volume') {
        const n = val(r, 0.12, 3, 3);
        const V = ((n * C.R * TK) / (P * 1000)) * 1000;
        return { topic: 'gas', variant: v, vars: { n, T, P }, question: `What volume do ${u(n, 3, 'mol')} of an ideal gas take up at ${fmtDP(T, 1)} °C and ${u(P, 3, 'kPa')}? Give the answer in litres. Use R = 8.314 J/(mol·K).`,
          steps: [`Convert to SI units: T = ${fmtDP(T, 1)} + 273.15 = ${w(TK)} K; p = ${fmtSF(P, 3)} kPa = ${w(P * 1000)} Pa.`, `V = nRT ÷ p = ${fmtSF(n, 3)} × 8.314 × ${w(TK)} ÷ ${w(P * 1000)} = ${w(V / 1000)} m³`, `1 m³ = 1000 L, so V = ${w(V)} L.`, `${sfStep(3)}: ${fmtSF(V, 3)} L.`],
          answer: ans(V, { sf: 3 }, 'L', 'volume') };
      }
      const VL = val(r, 0.5, 25, 3);
      const n = (P * 1000 * (VL / 1000)) / (C.R * TK);
      return { topic: 'gas', variant: v, vars: { V: VL, T, P }, question: `A flask of volume ${u(VL, 3, 'L')} holds an ideal gas at ${fmtDP(T, 1)} °C and ${u(P, 3, 'kPa')}. How many moles of gas are in it? Use R = 8.314 J/(mol·K).`,
        steps: [`Convert to SI units: T = ${fmtDP(T, 1)} + 273.15 = ${w(TK)} K; p = ${w(P * 1000)} Pa; V = ${fmtSF(VL, 3)} L = ${w(VL / 1000)} m³.`, `n = pV ÷ RT = ${w(P * 1000)} × ${w(VL / 1000)} ÷ (8.314 × ${w(TK)}) = ${w(n)} mol`, `${sfStep(3)}: ${fmtSF(n, 3)} mol.`],
        answer: ans(n, { sf: 3 }, 'mol', 'amount') };
    },
  },
  {
    id: 'molarity', field: 'Chemistry', name: 'Molarity', blurb: 'concentration from mass and volume, and the mass to weigh out',
    make(r) {
      const v = choose(r, ['concentration', 'mass'] as const);
      const cpd = choose(r, COMPOUNDS);
      const V = val(r, 50, 1000, 3);
      if (v === 'concentration') {
        const m = val(r, 0.5, 30, 3);
        const c = m / cpd.M / (V / 1000);
        return { topic: 'molarity', variant: v, vars: { m, V, M: cpd.M }, question: `${u(m, 3, 'g')} of ${cpd.name} (molar mass ${fmtM(cpd.M)} g/mol), is dissolved in water to make ${u(V, 3, 'mL')} of solution. What is the concentration in mol/L?`,
          steps: [`Moles: n = m ÷ M = ${fmtSF(m, 3)} ÷ ${fmtM(cpd.M)} = ${w(m / cpd.M)} mol.`, `Volume in litres: ${fmtSF(V, 3)} mL = ${w(V / 1000)} L.`, `c = n ÷ V = ${w(m / cpd.M)} ÷ ${w(V / 1000)} = ${w(c)} mol/L`, `${sfStep(3)}: ${fmtSF(c, 3)} mol/L.`],
          answer: ans(c, { sf: 3 }, 'mol/L', 'concentration') };
      }
      const c = val(r, 0.05, 2, 3);
      const m = c * (V / 1000) * cpd.M;
      return { topic: 'molarity', variant: v, vars: { c, V, M: cpd.M }, question: `What mass of ${cpd.name} (molar mass ${fmtM(cpd.M)} g/mol), do you need to make ${u(V, 3, 'mL')} of a ${u(c, 3, 'mol/L')} solution?`,
        steps: [`Moles needed: n = c × V = ${fmtSF(c, 3)} × ${w(V / 1000)} L = ${w(c * V / 1000)} mol.`, `Mass: m = n × M = ${w(c * V / 1000)} × ${fmtM(cpd.M)} = ${w(m)} g`, `${sfStep(3)}: ${fmtSF(m, 3)} g.`],
        answer: ans(m, { sf: 3 }, 'g', 'mass') };
    },
  },
  {
    id: 'dilution', field: 'Chemistry', name: 'Dilution', blurb: 'C₁V₁ = C₂V₂',
    make(r) {
      const c1 = val(r, 1, 12, 3);
      const c2 = val(r, 0.02, Math.min(0.9, c1 / 2), 3);
      const v2 = val(r, 50, 1000, 3);
      const v1 = (c2 * v2) / c1;
      return { topic: 'dilution', variant: 'volume', vars: { c1, c2, v2 }, question: `How many millilitres of a ${u(c1, 3, 'mol/L')} stock solution do you need to make ${u(v2, 3, 'mL')} of a ${u(c2, 3, 'mol/L')} solution?`,
        steps: ['The moles of solute do not change on dilution: C₁V₁ = C₂V₂, so V₁ = C₂V₂ ÷ C₁.', `V₁ = ${fmtSF(c2, 3)} × ${fmtSF(v2, 3)} ÷ ${fmtSF(c1, 3)} = ${w(c2 * v2)} ÷ ${fmtSF(c1, 3)} = ${w(v1)} mL`, `${sfStep(3)}: ${fmtSF(v1, 3)} mL. Make it up to ${fmtSF(v2, 3)} mL with water.`],
        answer: ans(v1, { sf: 3 }, 'mL', 'stock volume') };
    },
  },
  {
    id: 'halflife', field: 'Chemistry', name: 'Half-life', blurb: 'amount left after a time, and time to fall to an amount',
    make(r) {
      const v = choose(r, ['remaining', 'time'] as const);
      const unit = choose(r, ['hours', 'days', 'years'] as const);
      const T = val(r, 1.2, 30, 3), m0 = val(r, 10, 900, 3);
      if (v === 'remaining') {
        const t = val(r, 0.4 * T, 5 * T, 3);
        const m = m0 * 0.5 ** (t / T);
        return { topic: 'halflife', variant: v, vars: { T, m0, t }, question: `A radioactive isotope has a half-life of ${fmtSF(T, 3)} ${unit}. A sample starts with ${u(m0, 3, 'mg')} of it. How much is left after ${fmtSF(t, 3)} ${unit}?`,
          steps: ['Use m = m₀ × (½)^(t ÷ T½).', `Number of half-lives: t ÷ T½ = ${fmtSF(t, 3)} ÷ ${fmtSF(T, 3)} = ${w(t / T)}.`, `m = ${fmtSF(m0, 3)} × 0.5^${w(t / T)} = ${fmtSF(m0, 3)} × ${w(0.5 ** (t / T))} = ${w(m)} mg`, `${sfStep(3)}: ${fmtSF(m, 3)} mg.`],
          answer: ans(m, { sf: 3 }, 'mg', 'amount left') };
      }
      const m = val(r, m0 * 0.03, m0 * 0.8, 3);
      const t = T * Math.log2(m0 / m);
      return { topic: 'halflife', variant: v, vars: { T, m0, m }, question: `A radioactive isotope has a half-life of ${fmtSF(T, 3)} ${unit}. How long does it take for ${u(m0, 3, 'mg')} of it to decay until ${u(m, 3, 'mg')} is left? Give the answer in ${unit}.`,
        steps: ['From m = m₀ × (½)^(t ÷ T½): t = T½ × log₂(m₀ ÷ m) = T½ × ln(m₀ ÷ m) ÷ ln 2.', `m₀ ÷ m = ${fmtSF(m0, 3)} ÷ ${fmtSF(m, 3)} = ${w(m0 / m)}; log₂ of that = ${w(Math.log2(m0 / m))} half-lives.`, `t = ${fmtSF(T, 3)} × ${w(Math.log2(m0 / m))} = ${w(t)} ${unit}`, `${sfStep(3)}: ${fmtSF(t, 3)} ${unit}.`],
        answer: ans(t, { sf: 3 }, unit, 'time') };
    },
  },
  {
    id: 'ph', field: 'Chemistry', name: 'pH of strong acids and bases', blurb: 'pH = −log[H⁺], pOH, and [H⁺] from pH, at 25 °C',
    make(r) {
      const v = choose(r, ['acid', 'base', 'from-ph'] as const);
      if (v === 'from-ph') {
        const pH = valDP(r, 1.2, 4.8, 2);
        const h = 10 ** -pH;
        return { topic: 'ph', variant: v, vars: { pH }, question: `A solution of a strong acid has a pH of ${fmtDP(pH, 2)}. What is the hydrogen ion concentration [H⁺] in mol/L?`,
          steps: ['[H⁺] = 10^(−pH).', `[H⁺] = 10^(−${fmtDP(pH, 2)}) = ${w(h)} mol/L`, 'The pH has 2 decimal places, so [H⁺] has 2 significant figures: ' + fmtSF(h, 2) + ' mol/L.'],
          answer: ans(h, { sf: 2 }, 'mol/L', '[H⁺]') };
      }
      const sf = choose(r, [2, 3]);
      const c = valLog(r, 1.2e-4, 0.095, sf);
      if (v === 'acid') {
        const pH = -Math.log10(c);
        return { topic: 'ph', variant: v, vars: { c }, question: `What is the pH of a ${u(c, sf, 'mol/L')} solution of hydrochloric acid (HCl) at 25 °C?`,
          steps: ['HCl is a strong acid and dissociates completely, so [H⁺] = ' + fmtSF(c, sf) + ' mol/L.', `pH = −log₁₀[H⁺] = −log₁₀(${fmtSF(c, sf)}) = ${w(pH)}`, `The concentration has ${sf} significant figures, so give the pH to ${sf} decimal places: ${fmtDP(pH, sf)}.`],
          answer: ans(pH, { dp: sf }, '', 'pH', 0.02) };
      }
      const pOH = -Math.log10(c), pH = 14 - pOH;
      return { topic: 'ph', variant: v, vars: { c }, question: `What is the pH of a ${u(c, sf, 'mol/L')} solution of sodium hydroxide (NaOH) at 25 °C?`,
        steps: ['NaOH is a strong base and dissociates completely, so [OH⁻] = ' + fmtSF(c, sf) + ' mol/L.', `pOH = −log₁₀(${fmtSF(c, sf)}) = ${w(pOH)}`, `At 25 °C, pH + pOH = 14.00, so pH = 14.00 − ${w(pOH)} = ${w(pH)}`, `The concentration has ${sf} significant figures, so give the pH to ${sf} decimal places: ${fmtDP(pH, sf)}.`],
        answer: ans(pH, { dp: sf }, '', 'pH', 0.02) };
    },
  },
  {
    id: 'density', field: 'Chemistry', name: 'Density', blurb: 'ρ = m/V, mass from density, volume by displacement',
    make(r) {
      const v = choose(r, ['density', 'mass', 'displacement'] as const);
      if (v === 'mass') {
        const rho = val(r, 0.7, 11.3, 3), V = val(r, 2, 250, 3);
        const m = rho * V;
        return { topic: 'density', variant: v, vars: { rho, V }, question: `A liquid has a density of ${u(rho, 3, 'g/cm³')}. What is the mass of ${u(V, 3, 'cm³')} of it?`,
          steps: ['ρ = m ÷ V, so m = ρ × V.', `m = ${fmtSF(rho, 3)} × ${fmtSF(V, 3)} = ${w(m)} g`, `${sfStep(3)}: ${fmtSF(m, 3)} g.`],
          answer: ans(m, { sf: 3 }, 'g', 'mass') };
      }
      if (v === 'displacement') {
        const v1 = valDP(r, 20, 50, 1), dv = valDP(r, 3, 30, 1), v2 = roundDP(v1 + dv, 1), m = val(r, 8, 150, 3);
        const V = roundDP(v2 - v1, 1), sV = sfOfFixed(V, 1), n = Math.min(3, sV);
        const rho = m / V;
        return { topic: 'density', variant: v, vars: { v1, v2, m }, question: `A stone of mass ${u(m, 3, 'g')} is lowered into a measuring cylinder. The water level rises from ${fmtDP(v1, 1)} mL to ${fmtDP(v2, 1)} mL. What is the density of the stone in g/cm³?`,
          steps: [`Volume of the stone: V = ${fmtDP(v2, 1)} − ${fmtDP(v1, 1)} = ${fmtDP(V, 1)} mL = ${fmtDP(V, 1)} cm³ (subtracting keeps 1 decimal place, so V has ${sV} significant figures).`, `ρ = m ÷ V = ${fmtSF(m, 3)} ÷ ${fmtDP(V, 1)} = ${w(rho)} g/cm³`, `${sfStep(n)} (mass ${3}, volume ${sV}): ${fmtSF(rho, n)} g/cm³.`],
          answer: ans(rho, { sf: n }, 'g/cm³', 'density') };
      }
      const m = val(r, 5, 500, 3), V = val(r, 2, 200, 3);
      const rho = m / V;
      return { topic: 'density', variant: v, vars: { m, V }, question: `A block has a mass of ${u(m, 3, 'g')} and a volume of ${u(V, 3, 'cm³')}. What is its density?`,
        steps: ['ρ = m ÷ V.', `ρ = ${fmtSF(m, 3)} ÷ ${fmtSF(V, 3)} = ${w(rho)} g/cm³`, `${sfStep(3)}: ${fmtSF(rho, 3)} g/cm³.`],
        answer: ans(rho, { sf: 3 }, 'g/cm³', 'density') };
    },
  },
  {
    id: 'stats', field: 'Statistics', name: 'Mean and standard deviation', blurb: 'mean and sample standard deviation (n − 1) of a small data set',
    make(r) {
      const v = choose(r, ['mean', 'sd'] as const);
      const n = 5 + Math.floor(r() * 4);
      const centre = 10 + 30 * r(), spread = 0.5 + 3 * r();
      const xs = Array.from({ length: n }, () => valDP(r, centre - spread * 2, centre + spread * 2, 1));
      const sum = roundDP(xs.reduce((a, b) => a + b, 0), 1), mean = sum / n;
      const list = xs.map((x) => fmtDP(x, 1)).join(', ');
      const vars = Object.fromEntries(xs.map((x, i) => [`x${i + 1}`, x]));
      if (v === 'mean') {
        return { topic: 'stats', variant: v, vars, question: `Repeat measurements of a reaction time (in seconds) were: ${list}. What is the mean?`,
          steps: [`Add the values: ${list.replace(/, /g, ' + ')} = ${fmtDP(sum, 1)}.`, `Divide by the number of values (${n}): ${fmtDP(sum, 1)} ÷ ${n} = ${w(mean)} s`, `A common rule is to give a mean to one more decimal place than the data: ${fmtDP(mean, 2)} s.`],
          answer: ans(mean, { dp: 2 }, 's', 'mean', 0.01) };
      }
      const ss = xs.reduce((a, x) => a + (x - mean) ** 2, 0), sd = Math.sqrt(ss / (n - 1));
      return { topic: 'stats', variant: v, vars, question: `Repeat measurements of a reaction time (in seconds) were: ${list}. What is the sample standard deviation?`,
        steps: [`Mean: ${fmtDP(sum, 1)} ÷ ${n} = ${w(mean)} s.`, `Squared differences from the mean: ${xs.map((x) => w((x - mean) ** 2)).join(', ')}; their sum is ${w(ss)}.`, `Sample variance: divide by n − 1 = ${n - 1}: ${w(ss)} ÷ ${n - 1} = ${w(ss / (n - 1))}.`, `Standard deviation: s = √${w(ss / (n - 1))} = ${w(sd)} s`, `Give it to one more decimal place than the data: ${fmtDP(sd, 2)} s. (Dividing by n instead gives the population SD, ${fmtDP(Math.sqrt(ss / n), 2)} s.)`],
        answer: ans(sd, { dp: 2 }, 's', 'standard deviation') };
    },
  },
];
export const TOPIC_IDS = TOPICS.map((t) => t.id);

// ---------- sets ----------
export type SetSpec = { seed: number; count: number; topics: string[] };
export function makeSet(spec: SetSpec): Problem[] {
  const ts = spec.topics.map((id) => TOPICS.find((t) => t.id === id)).filter((t): t is Topic => !!t);
  if (!ts.length || spec.count < 1) return [];
  // Cycle through the topics, then shuffle the order with the seed, so every topic gets its share.
  const order = Array.from({ length: spec.count }, (_, i) => ts[i % ts.length]);
  const sr = mulberry32(mix(spec.seed, 99991));
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(sr() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  return order.map((t, i) => t.make(mulberry32(mix(spec.seed, i))));
}
/** A short code for a set: seed-count-topics, as in 48213-10-ohm.gas.ph */
export const setCode = (s: SetSpec) => `${s.seed}-${s.count}-${s.topics.join('.')}`;
export function parseCode(code: string): SetSpec | null {
  const m = code.trim().match(/^(\d{1,9})-(\d{1,2})-([a-z.]+)$/i);
  if (!m) return null;
  const topics = m[3].toLowerCase().split('.').filter((t) => TOPIC_IDS.includes(t));
  const count = Number(m[2]);
  if (!topics.length || count < 1 || count > 40) return null;
  return { seed: Number(m[1]), count, topics: [...new Set(topics)] };
}

// ---------- reading and checking an answer ----------
const SUPR: Record<string, string> = { '⁻': '-', '⁺': '+', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
export type Read = { value: number; sfMin: number; sfMax: number; dp: number };
/** Read a typed answer: 0.0250, 2.5e-3, 2.5 × 10^-3, 2.5x10⁻³, 1,250, −3.4. Text after the number (a unit) is
 *  ignored. Returns the value, the significant figures written (a range when trailing zeros of a whole number
 *  are unclear, as in 1200) and the decimal places written. */
export function readAnswer(s: string): Read | null {
  let t = s.trim().replace(/[−–]/g, '-').replace(/\s+/g, ' ');
  if (/^[+-]?\d{1,3}(,\d{3})+(\.\d*)?(\D|$)/.test(t)) t = t.replace(/,(?=\d{3})/g, '');
  else t = t.replace(/^([+-]?\d+),(\d+)/, '$1.$2');
  const m = t.match(/^([+-]?)(\d+\.?\d*|\.\d+)(?:\s*[eE]\s*([+-]?\d+)|\s*[x×*·]\s*10\s*(?:\^\s*\(?\s*([+-]?\d+)\s*\)?|([⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+)))?\s*(.*)$/);
  if (!m) return null;
  const [, sign, mant, e1, e2, e3, rest] = m;
  if (/^[\d.]/.test(rest) || /^[x×*·]\s*10/.test(rest)) return null;
  const exp = e1 ?? e2 ?? (e3 ? [...e3].map((c) => SUPR[c]).join('') : '0');
  const value = Number(`${sign}${mant}e${exp}`);
  if (!Number.isFinite(value)) return null;
  let sfMin: number, sfMax: number;
  const dp = mant.includes('.') ? mant.split('.')[1].length : 0;
  if (mant.includes('.')) {
    const d = mant.replace('.', '').replace(/^0+/, '');
    sfMin = sfMax = d.length || Math.max(1, dp);
  } else {
    const d = mant.replace(/^0+/, '');
    if (!d) { sfMin = sfMax = 1; }
    else { sfMax = d.length; sfMin = Math.max(1, d.replace(/0+$/, '').length); if (e1 ?? e2 ?? e3) sfMin = sfMax; }
  }
  return { value, sfMin, sfMax, dp: (e1 ?? e2 ?? e3) ? NaN : dp };
}

export type Verdict = { status: 'right' | 'right-rounding' | 'units' | 'wrong' | 'unread'; message: string };
/** Check a typed answer. tol is the relative tolerance (0.01 = 1 %) unless the answer has its own absolute one.
 *  A value is right if it is within tolerance of the exact answer or of the correctly rounded one. */
export function checkAnswer(typed: string, a: Answer, tol = 0.01): Verdict {
  const rd = readAnswer(typed);
  if (!rd) return { status: 'unread', message: 'Type a number, such as 0.0250, 2.5e-3 or 2.5 × 10^-3.' };
  const near = (x: number, y: number) => (a.abs !== undefined ? Math.abs(x - y) <= a.abs + 1e-12 : Math.abs(x - y) <= tol * Math.abs(y) + 1e-15);
  const full = `${a.text}${a.unit ? ' ' + a.unit : ''}`;
  if (near(rd.value, a.value) || near(rd.value, a.rounded)) {
    if ('sf' in a.rule) {
      if (rd.sfMin <= a.rule.sf && a.rule.sf <= rd.sfMax) return { status: 'right', message: `Right: ${full}.` };
      return { status: 'right-rounding', message: `Right value. To the precision of the data, write it with ${a.rule.sf} significant figures: ${full}.` };
    }
    if (rd.dp === a.rule.dp) return { status: 'right', message: `Right: ${full}.` };
    return { status: 'right-rounding', message: `Right value. To the precision of the data, write it with ${a.rule.dp} decimal place${a.rule.dp === 1 ? '' : 's'}: ${full}.` };
  }
  if (a.abs === undefined && rd.value !== 0 && a.value !== 0) {
    const k = Math.round(Math.log10(Math.abs(rd.value / a.value)));
    if (k !== 0 && Math.abs(rd.value / (a.value * 10 ** k)) - 1 <= tol && Math.sign(rd.value) === Math.sign(a.value))
      return { status: 'units', message: `Not quite: your answer is ${10 ** Math.abs(k) >= 1e4 ? '10' + supn(Math.abs(k)) : (10 ** Math.abs(k)).toLocaleString('en')} times too ${k > 0 ? 'big' : 'small'}. Check the unit conversions and powers of ten.` };
    if (Math.abs(rd.value + a.value) <= tol * Math.abs(a.value)) return { status: 'wrong', message: 'Not quite: check the sign.' };
  }
  return { status: 'wrong', message: 'Not quite. Try again, or show the steps.' };
}

/** Text the standard PDF fonts can draw: superscripts as ^n, subscripts as plain digits, Greek letters spelled. */
export function pdfPlain(s: string): string {
  return s
    .replace(/×\s?10([⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_, e: string) => `x 10^${[...e].map((c) => SUPR[c]).join('')}`)
    .replace(/[⁻⁺⁰⁴⁵⁶⁷⁸⁹]+/g, (e) => '^' + [...e].map((c) => SUPR[c]).join(''))
    .replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080))
    .replace(/ρ/g, 'rho').replace(/λ/g, 'lambda').replace(/Ω/g, 'ohm').replace(/√/g, 'sqrt').replace(/½/g, '1/2').replace(/−/g, '-');
}
