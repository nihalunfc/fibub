// Body size measures used in clinical teaching: BMI with the WHO adult classes, body surface area by four
// published formulas, ideal body weight (Devine, Robinson, Miller), adjusted body weight and lean body
// weight (Janmahasatian). Plain maths, no DOM. Heights in cm, weights in kg.

export type Sex = 'male' | 'female';
export const CM_PER_IN = 2.54, KG_PER_LB = 0.45359237;

/** Body mass index, kg/m². */
export const bmi = (kg: number, cm: number) => kg / (cm / 100) ** 2;

/** WHO adult BMI classes (WHO 2000, Technical Report Series 894). */
export const BMI_CLASSES: { min: number; name: string; tone: 'good' | 'warn' | 'bad' }[] = [
  { min: -Infinity, name: 'Underweight (severe thinness)', tone: 'bad' },
  { min: 16, name: 'Underweight (moderate thinness)', tone: 'warn' },
  { min: 17, name: 'Underweight (mild thinness)', tone: 'warn' },
  { min: 18.5, name: 'Normal range', tone: 'good' },
  { min: 25, name: 'Pre-obese (overweight)', tone: 'warn' },
  { min: 30, name: 'Obese class I', tone: 'warn' },
  { min: 35, name: 'Obese class II', tone: 'bad' },
  { min: 40, name: 'Obese class III', tone: 'bad' },
];
export function bmiClass(b: number) {
  let c = BMI_CLASSES[0];
  for (const k of BMI_CLASSES) if (b >= k.min) c = k;
  return c;
}

/** Body surface area in m², by formula. */
export const BSA = {
  mosteller: (kg: number, cm: number) => Math.sqrt((cm * kg) / 3600),
  dubois: (kg: number, cm: number) => 0.007184 * kg ** 0.425 * cm ** 0.725,
  haycock: (kg: number, cm: number) => 0.024265 * kg ** 0.5378 * cm ** 0.3964,
  gehanGeorge: (kg: number, cm: number) => 0.0235 * kg ** 0.51456 * cm ** 0.42246,
};
export const BSA_NAMES: Record<keyof typeof BSA, string> = { mosteller: 'Mosteller', dubois: 'DuBois and DuBois', haycock: 'Haycock', gehanGeorge: 'Gehan and George' };

/** Ideal body weight in kg: base + per inch over 5 feet. */
const IBW_RULES = {
  devine: { male: [50, 2.3], female: [45.5, 2.3] },
  robinson: { male: [52, 1.9], female: [49, 1.7] },
  miller: { male: [56.2, 1.41], female: [53.1, 1.36] },
} as const;
export type IbwRule = keyof typeof IBW_RULES;
export const IBW_NAMES: Record<IbwRule, string> = { devine: 'Devine', robinson: 'Robinson', miller: 'Miller' };
export function ibw(cm: number, sex: Sex, rule: IbwRule = 'devine') {
  const [base, per] = IBW_RULES[rule][sex];
  return base + per * (cm / CM_PER_IN - 60);
}

/** Adjusted body weight: IBW + factor × (actual − IBW); the factor is usually 0.4. */
export const adjustedWeight = (kg: number, ideal: number, factor = 0.4) => ideal + factor * (kg - ideal);

/** Lean body weight, Janmahasatian et al. 2005. */
export function leanWeight(kg: number, cm: number, sex: Sex) {
  const b = bmi(kg, cm);
  return sex === 'male' ? (9270 * kg) / (6680 + 216 * b) : (9270 * kg) / (8780 + 244 * b);
}

export interface BodyResult {
  kg: number; cm: number; sex: Sex; bmi: number; cls: (typeof BMI_CLASSES)[number];
  bsa: Record<keyof typeof BSA, number>;
  ibw: Record<IbwRule, number>; abw: number; abwFactor: number; pctIbw: number; lbw: number;
  notes: string[];
}

/** All the measures at once, with plain warnings for heights and weights where the formulas are weak. */
export function bodyMeasures(kg: number, cm: number, sex: Sex, abwFactor = 0.4): BodyResult {
  if (!(kg > 0) || !(cm > 0)) throw new Error('Enter a weight and a height above zero.');
  if (cm < 50 || cm > 250) throw new Error('Height should be between 50 and 250 cm (20 to 98 in).');
  if (kg < 1 || kg > 400) throw new Error('Weight should be between 1 and 400 kg (2.2 to 880 lb).');
  if (!(abwFactor >= 0 && abwFactor <= 1)) throw new Error('The adjusted-weight factor should be between 0 and 1.');
  const bsa = { mosteller: BSA.mosteller(kg, cm), dubois: BSA.dubois(kg, cm), haycock: BSA.haycock(kg, cm), gehanGeorge: BSA.gehanGeorge(kg, cm) };
  const ib = { devine: ibw(cm, sex, 'devine'), robinson: ibw(cm, sex, 'robinson'), miller: ibw(cm, sex, 'miller') };
  const b = bmi(kg, cm), notes: string[] = [];
  if (cm < 152.4) notes.push('Ideal body weight formulas were made for adults 5 ft (152.4 cm) or taller; below that they are extrapolated and can be meaningless.');
  if (kg < ib.devine) notes.push('Actual weight is below the Devine ideal weight, so the adjusted weight is below the actual weight; it is normally used only when actual weight is well above ideal.');
  if (cm < 140) notes.push('BMI classes and the adult weight formulas are for adults. For children use BMI-for-age charts.');
  return { kg, cm, sex, bmi: b, cls: bmiClass(b), bsa, ibw: ib, abw: adjustedWeight(kg, ib.devine, abwFactor), abwFactor, pctIbw: (100 * kg) / ib.devine, lbw: leanWeight(kg, cm, sex), notes };
}
