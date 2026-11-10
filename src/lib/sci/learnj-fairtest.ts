// Fair test planner (Learn): a few everyday investigations, each with the things you could change, measure or keep
// the same. assess() reads a plan and says whether it is a fair test. Plain data and logic, no DOM.

export type Factor = { id: string; name: string; a: string; b: string };
export type Investigation = {
  id: string;
  question: string;
  /** The factor the question is about (the one to change). */
  change: string;
  factors: Factor[];
  /** What you could measure: the first is the one that answers the question. */
  measures: string[];
  /** A sentence on why the measure fits. */
  why: string;
};

export const INVESTIGATIONS: Investigation[] = [
  {
    id: 'salt-boil', question: 'Does adding salt make water boil sooner?', change: 'salt',
    factors: [
      { id: 'salt', name: 'Salt added', a: 'No salt', b: '2 spoons of salt' },
      { id: 'water', name: 'Amount of water', a: '500 mL', b: '300 mL' },
      { id: 'start', name: 'Starting temperature', a: 'Tap water, 25 °C', b: 'Warm water, 40 °C' },
      { id: 'flame', name: 'Flame size', a: 'Medium flame', b: 'High flame' },
      { id: 'pan', name: 'Pan', a: 'Steel pan', b: 'Aluminium pan' },
      { id: 'lid', name: 'Lid', a: 'No lid', b: 'Lid on' },
    ],
    measures: ['Time until it boils (minutes)', 'Colour of the water', 'How salty it tastes'],
    why: 'The question asks "sooner", so you time how long each pan takes to boil.',
  },
  {
    id: 'plant-light', question: 'Do bean plants grow taller with more light?', change: 'light',
    factors: [
      { id: 'light', name: 'Light', a: 'Sunny window', b: 'Dark cupboard' },
      { id: 'water', name: 'Water each day', a: '50 mL', b: '100 mL' },
      { id: 'soil', name: 'Soil', a: 'Garden soil', b: 'Sand' },
      { id: 'pot', name: 'Pot size', a: 'Small pot', b: 'Big pot' },
      { id: 'seed', name: 'Seeds', a: 'Same packet of beans', b: 'Different kind of bean' },
    ],
    measures: ['Height of the plant after 2 weeks (cm)', 'Colour of the pot', 'Number of times you looked at it'],
    why: 'The question asks "taller", so you measure the height of each plant after the same time.',
  },
  {
    id: 'sugar-dissolve', question: 'Does sugar dissolve faster in hot water?', change: 'temp',
    factors: [
      { id: 'temp', name: 'Water temperature', a: 'Cold, 15 °C', b: 'Hot, 60 °C' },
      { id: 'sugar', name: 'Amount of sugar', a: '1 spoon', b: '3 spoons' },
      { id: 'water', name: 'Amount of water', a: '200 mL', b: '100 mL' },
      { id: 'stir', name: 'Stirring', a: 'Stir 10 times', b: 'No stirring' },
      { id: 'kind', name: 'Kind of sugar', a: 'Granulated sugar', b: 'Sugar cubes' },
    ],
    measures: ['Time until no sugar is left (seconds)', 'Height of the glass', 'How sweet it tastes'],
    why: 'The question asks "faster", so you time how long the sugar takes to disappear.',
  },
  {
    id: 'ball-bounce', question: 'Does a ball bounce higher when dropped from higher up?', change: 'height',
    factors: [
      { id: 'height', name: 'Drop height', a: '50 cm', b: '100 cm' },
      { id: 'ball', name: 'Ball', a: 'Tennis ball', b: 'Cricket ball' },
      { id: 'floor', name: 'Floor', a: 'Tiled floor', b: 'Carpet' },
      { id: 'push', name: 'How it is let go', a: 'Just let go', b: 'Thrown down' },
    ],
    measures: ['Height of the first bounce (cm)', 'Colour of the ball', 'Sound it makes'],
    why: 'The question asks "higher", so you measure how high the first bounce goes.',
  },
  {
    id: 'ice-melt', question: 'Does covering ice with a cloth make it melt more slowly?', change: 'cover',
    factors: [
      { id: 'cover', name: 'Cover', a: 'No cloth', b: 'Wrapped in a cloth' },
      { id: 'size', name: 'Ice cube size', a: 'Small cube', b: 'Big cube' },
      { id: 'place', name: 'Where it sits', a: 'Shady table', b: 'Sunny window' },
      { id: 'dish', name: 'Dish', a: 'Steel plate', b: 'Plastic plate' },
    ],
    measures: ['Time until the ice has all melted (minutes)', 'Colour of the cloth', 'Shape of the plate'],
    why: 'The question asks "more slowly", so you time how long each piece of ice takes to melt.',
  },
];

export type Role = 'change' | 'same';
export type Plan = { inv: Investigation; roles: Record<string, Role>; measure: number; repeats: number };
export type Verdict = { fair: boolean; problems: string[]; good: string[]; changed: string[] };

/** Judge a plan. A fair test changes exactly the one factor the question is about, keeps every other factor the
 * same, and measures the thing that answers the question. Repeats make it reliable (advice, not a fairness rule). */
export function assess(p: Plan): Verdict {
  const changed = p.inv.factors.filter((f) => p.roles[f.id] === 'change').map((f) => f.id);
  const name = (id: string) => p.inv.factors.find((f) => f.id === id)!.name.toLowerCase();
  const problems: string[] = [], good: string[] = [];
  if (changed.length === 0) problems.push('Nothing is changed, so both tests are the same and cannot answer the question.');
  else if (changed.length > 1) problems.push(`${changed.length} things change at once (${changed.map(name).join(', ')}). If the result differs you cannot tell which one caused it.`);
  if (changed.length && !changed.includes(p.inv.change)) problems.push(`The question is about ${name(p.inv.change)}, so that is the thing to change.`);
  if (changed.length === 1 && changed[0] === p.inv.change) good.push(`Only ${name(p.inv.change)} changes, and everything else is kept the same.`);
  if (p.measure !== 0) problems.push(`"${p.inv.measures[p.measure]}" does not answer the question. ${p.inv.why}`);
  else good.push(p.inv.why);
  if (p.repeats < 3) problems.length === 0 && good.push(`Doing it ${p.repeats === 1 ? 'once' : 'twice'} works, but 3 repeats and an average make the result more reliable.`);
  else good.push(`${p.repeats} repeats, averaged, make one odd result matter less.`);
  return { fair: problems.length === 0, problems, good, changed };
}

/** Average of the numbers given (ignores blanks); NaN when there are none. */
export function mean(xs: number[]): number {
  const v = xs.filter((x) => Number.isFinite(x));
  return v.length ? v.reduce((s, x) => s + x, 0) / v.length : NaN;
}
/** Range (largest − smallest) of the numbers given; NaN when there are none. */
export function range(xs: number[]): number {
  const v = xs.filter((x) => Number.isFinite(x));
  return v.length ? Math.max(...v) - Math.min(...v) : NaN;
}
