// Resting energy expenditure equations (kcal per day) and total energy = resting × activity factor.
// Mifflin MD, St Jeor ST et al. (1990) Am J Clin Nutr 51:241-247.
// Harris JA, Benedict FG (1919) A Biometric Study of Basal Metabolism in Man, Carnegie Institution of Washington pub. 279.
// Roza AM, Shizgal HM (1984) Am J Clin Nutr 40:168-182 (re-fit of Harris-Benedict).
// Katch-McArdle: 370 + 21.6 × lean body mass (kg), from Katch F, McArdle W, Nutrition, Weight Control and Exercise (1977).

export type Sex = 'male' | 'female';
export type Person = { sex: Sex; kg: number; cm: number; age: number; bodyFat?: number };

export const KJ_PER_KCAL = 4.184;
/** The simple "7700 kcal per kg of body weight" rule (about 3500 kcal per pound). Only a first guess: see the guide. */
export const KCAL_PER_KG = 7700;

export function check(p: Person) {
  if (!(p.kg >= 2 && p.kg <= 400)) throw new Error('Weight should be between 2 and 400 kg.');
  if (!(p.cm >= 40 && p.cm <= 250)) throw new Error('Height should be between 40 and 250 cm.');
  if (!(p.age >= 1 && p.age <= 120)) throw new Error('Age should be between 1 and 120 years.');
}

export const mifflin = (p: Person) => 10 * p.kg + 6.25 * p.cm - 5 * p.age + (p.sex === 'male' ? 5 : -161);

export const harrisBenedict = (p: Person) => p.sex === 'male'
  ? 66.4730 + 13.7516 * p.kg + 5.0033 * p.cm - 6.7550 * p.age
  : 655.0955 + 9.5634 * p.kg + 1.8496 * p.cm - 4.6756 * p.age;

export const rozaShizgal = (p: Person) => p.sex === 'male'
  ? 88.362 + 13.397 * p.kg + 4.799 * p.cm - 5.677 * p.age
  : 447.593 + 9.247 * p.kg + 3.098 * p.cm - 4.330 * p.age;

export const leanMass = (kg: number, bodyFat: number) => kg * (1 - bodyFat / 100);
export const katchMcArdle = (p: Person) => {
  if (p.bodyFat == null || !(p.bodyFat >= 2 && p.bodyFat <= 70)) return NaN;
  return 370 + 21.6 * leanMass(p.kg, p.bodyFat);
};

export const EQUATIONS = [
  { id: 'mifflin', name: 'Mifflin-St Jeor (1990)', f: mifflin },
  { id: 'hb1919', name: 'Harris-Benedict (1919)', f: harrisBenedict },
  { id: 'hb1984', name: 'Harris-Benedict, Roza-Shizgal (1984)', f: rozaShizgal },
  { id: 'katch', name: 'Katch-McArdle (lean mass)', f: katchMcArdle },
] as const;

/** Example activity factors, rounded and approximate (common teaching values; edit to suit). */
export const ACTIVITY = [
  { label: 'Mostly sitting, little exercise', f: 1.2 },
  { label: 'Light activity, 1 to 3 days a week', f: 1.375 },
  { label: 'Moderate activity, 3 to 5 days a week', f: 1.55 },
  { label: 'Hard activity, 6 to 7 days a week', f: 1.725 },
  { label: 'Very hard training or physical job', f: 1.9 },
];

export function results(p: Person, factor: number) {
  check(p);
  if (!(factor >= 1 && factor <= 2.5)) throw new Error('The activity factor should be between 1.0 and 2.5.');
  return EQUATIONS.map((e) => { const rest = e.f(p); return { id: e.id, name: e.name, rest, total: rest * factor }; });
}

/** Rough weight change per week (kg) for a steady daily energy gap (kcal/day; negative = deficit), by the 7700 kcal/kg rule. */
export const kgPerWeek = (gapKcalPerDay: number) => (gapKcalPerDay * 7) / KCAL_PER_KG;
/** Daily gap (kcal/day) that the 7700 kcal/kg rule links to a weekly change (kg/week). */
export const gapFor = (kgWeek: number) => (kgWeek * KCAL_PER_KG) / 7;

export const lbToKg = (lb: number) => lb * 0.45359237;
export const inToCm = (inch: number) => inch * 2.54;
