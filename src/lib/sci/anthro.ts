// Anthropometric and skeletal indices from measurements, for study. Every index is a plain ratio of two
// measurements; class names are given only for BMI (adults) and the cephalic index, where they are general
// textbook knowledge. Not a medical or growth assessment.

export type Measures = Partial<Record<MeasureKey, number>>;
export const MEASURES = {
  weight: 'Weight (kg)',
  height: 'Height / stature (cm)',
  waist: 'Waist circumference (cm)',
  hip: 'Hip circumference (cm)',
  headLength: 'Head length, glabella to opisthocranion (mm)',
  headBreadth: 'Head breadth, maximum (mm)',
  nasalHeight: 'Nasal height (mm)',
  nasalBreadth: 'Nasal breadth (mm)',
  sittingHeight: 'Sitting height (cm)',
  humerus: 'Humerus length',
  radius: 'Radius length',
  femur: 'Femur length',
  tibia: 'Tibia length',
} as const;
export type MeasureKey = keyof typeof MEASURES;

export type IndexDef = { key: string; name: string; formula: string; needs: MeasureKey[]; f: (m: Required<Measures>) => number; classify?: (v: number) => string; digits: number };

export const bmiClass = (v: number) => (v < 18.5 ? 'Underweight' : v < 25 ? 'Healthy weight range' : v < 30 ? 'Overweight' : 'Obesity');
export const cephalicClass = (v: number) => (v < 75 ? 'Dolichocephalic (long-headed)' : v < 80 ? 'Mesocephalic' : 'Brachycephalic (broad-headed)');

export const INDICES: IndexDef[] = [
  { key: 'bmi', name: 'Body mass index (BMI)', formula: 'weight (kg) ÷ height (m)²', needs: ['weight', 'height'], f: (m) => m.weight / (m.height / 100) ** 2, classify: bmiClass, digits: 1 },
  { key: 'whr', name: 'Waist-to-hip ratio', formula: 'waist ÷ hip', needs: ['waist', 'hip'], f: (m) => m.waist / m.hip, digits: 2 },
  { key: 'whtr', name: 'Waist-to-height ratio', formula: 'waist ÷ height', needs: ['waist', 'height'], f: (m) => m.waist / m.height, digits: 2 },
  { key: 'cephalic', name: 'Cephalic index', formula: '100 × head breadth ÷ head length', needs: ['headBreadth', 'headLength'], f: (m) => (100 * m.headBreadth) / m.headLength, classify: cephalicClass, digits: 1 },
  { key: 'nasal', name: 'Nasal index', formula: '100 × nasal breadth ÷ nasal height', needs: ['nasalBreadth', 'nasalHeight'], f: (m) => (100 * m.nasalBreadth) / m.nasalHeight, digits: 1 },
  { key: 'cormic', name: 'Cormic index (relative sitting height)', formula: '100 × sitting height ÷ stature', needs: ['sittingHeight', 'height'], f: (m) => (100 * m.sittingHeight) / m.height, digits: 1 },
  { key: 'skelic', name: 'Skelic index (Manouvrier)', formula: '100 × (stature − sitting height) ÷ sitting height', needs: ['sittingHeight', 'height'], f: (m) => (100 * (m.height - m.sittingHeight)) / m.sittingHeight, digits: 1 },
  { key: 'intermembral', name: 'Intermembral index', formula: '100 × (humerus + radius) ÷ (femur + tibia)', needs: ['humerus', 'radius', 'femur', 'tibia'], f: (m) => (100 * (m.humerus + m.radius)) / (m.femur + m.tibia), digits: 1 },
  { key: 'brachial', name: 'Brachial index', formula: '100 × radius ÷ humerus', needs: ['radius', 'humerus'], f: (m) => (100 * m.radius) / m.humerus, digits: 1 },
  { key: 'crural', name: 'Crural index', formula: '100 × tibia ÷ femur', needs: ['tibia', 'femur'], f: (m) => (100 * m.tibia) / m.femur, digits: 1 },
  { key: 'humerofemoral', name: 'Humerofemoral index', formula: '100 × humerus ÷ femur', needs: ['humerus', 'femur'], f: (m) => (100 * m.humerus) / m.femur, digits: 1 },
];

/** Every index that the given measurements allow. Measurements must be above zero; sitting height below stature. */
export function indices(m: Measures): { def: IndexDef; value: number; cls: string }[] {
  const out: { def: IndexDef; value: number; cls: string }[] = [];
  for (const def of INDICES) {
    if (!def.needs.every((k) => Number.isFinite(m[k]) && (m[k] as number) > 0)) continue;
    if ((def.key === 'cormic' || def.key === 'skelic') && !((m.sittingHeight as number) < (m.height as number))) continue;
    const value = def.f(m as Required<Measures>);
    out.push({ def, value, cls: def.classify ? def.classify(value) : '' });
  }
  return out;
}

/** Problems with a set of measurements, in plain words. */
export function check(m: Measures): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(m)) if (v !== undefined && Number.isFinite(v) && !(v > 0)) out.push(`${MEASURES[k as MeasureKey]} must be above zero`);
  if (m.sittingHeight && m.height && m.sittingHeight >= m.height) out.push('Sitting height must be less than stature');
  if (m.headBreadth && m.headLength && m.headBreadth > m.headLength * 1.2) out.push('Head breadth is much larger than head length: check that the two are not swapped');
  return out;
}

/** Column names people use for each measurement, matched case-insensitively ignoring spaces, units and punctuation. */
const ALIASES: Record<MeasureKey, string[]> = {
  weight: ['weight', 'weightkg', 'mass', 'bodymass', 'wt'],
  height: ['height', 'heightcm', 'stature', 'ht'],
  waist: ['waist', 'waistcm', 'waistcircumference', 'wc'],
  hip: ['hip', 'hips', 'hipcm', 'hipcircumference'],
  headLength: ['headlength', 'hl', 'glabellaopisthocranion', 'maximumcraniallength', 'craniallength'],
  headBreadth: ['headbreadth', 'headwidth', 'hb', 'maximumcranialbreadth', 'cranialbreadth'],
  nasalHeight: ['nasalheight', 'noseheight', 'nh'],
  nasalBreadth: ['nasalbreadth', 'nasalwidth', 'nosebreadth', 'nosewidth', 'nb'],
  sittingHeight: ['sittingheight', 'sittingheightcm', 'sh'],
  humerus: ['humerus', 'humeruslength', 'hum'],
  radius: ['radius', 'radiuslength', 'rad'],
  femur: ['femur', 'femurlength', 'fem'],
  tibia: ['tibia', 'tibialength', 'tib'],
};
export function matchColumn(header: string): MeasureKey | null {
  const h = header.toLowerCase().replace(/\((kg|cm|mm|m|in|lb)\)|\b(kg|cm|mm)\b/g, '').replace(/[^a-z]/g, '');
  for (const [k, list] of Object.entries(ALIASES)) if (list.includes(h)) return k as MeasureKey;
  return null;
}

/** n, mean, SD (n − 1), min, quartiles (linear interpolation, as numpy's default) and max. */
export function summary(xs: number[]) {
  const v = xs.filter(Number.isFinite).sort((a, b) => a - b), n = v.length;
  if (!n) return { n: 0, mean: NaN, sd: NaN, min: NaN, q1: NaN, median: NaN, q3: NaN, max: NaN };
  const mean = v.reduce((s, x) => s + x, 0) / n;
  const sd = n > 1 ? Math.sqrt(v.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1)) : NaN;
  const qt = (p: number) => { const i = (n - 1) * p, lo = Math.floor(i), hi = Math.ceil(i); return v[lo] + (v[hi] - v[lo]) * (i - lo); };
  return { n, mean, sd, min: v[0], q1: qt(0.25), median: qt(0.5), q3: qt(0.75), max: v[n - 1] };
}
