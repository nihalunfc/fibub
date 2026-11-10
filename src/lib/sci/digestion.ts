// Digestion journey (#1301): a teaching model of what happens to a meal's starch, protein, fat and fibre at each
// stop of the gut. The shares broken down at each stop are made-up round values for teaching, not measurements.
// No DOM.

export type Nutrient = 'starch' | 'protein' | 'fat' | 'fibre';
export const NUTRIENTS: { id: Nutrient; name: string; part: string; end: string }[] = [
  { id: 'starch', name: 'Starch', part: 'maltose', end: 'glucose' },
  { id: 'protein', name: 'Protein', part: 'peptides', end: 'amino acids' },
  { id: 'fat', name: 'Fat', part: 'fat droplets', end: 'fatty acids and glycerol' },
  { id: 'fibre', name: 'Fibre', part: '', end: '' },
];

/** At one stop, for one nutrient: share of the whole left that is broken part-way, share of the part-way left that
 *  becomes small units, and share of the small units that is absorbed into the blood or lymph. */
type Step = { split: number; finish: number; absorb: number };
const none: Step = { split: 0, finish: 0, absorb: 0 };

export type Stop = {
  id: string; name: string; hours: [number, number]; ph: string;
  juices: string[];
  /** Class 10 enzyme lines, then extra Class 11 lines. */
  enzymes10: string[]; enzymes11: string[];
  what: string;
  steps: Record<Nutrient, Step>;
};

export const STOPS: Stop[] = [
  { id: 'mouth', name: 'Mouth', hours: [0.01, 0.03], ph: 'about 7',
    juices: ['Saliva'],
    enzymes10: ['Salivary amylase: starch → maltose'],
    enzymes11: ['Lysozyme kills some bacteria'],
    what: 'Teeth chop the food, the tongue mixes it with saliva and rolls it into a soft ball (a bolus) to swallow.',
    steps: { starch: { split: 0.3, finish: 0, absorb: 0 }, protein: none, fat: none, fibre: none } },
  { id: 'oesophagus', name: 'Oesophagus', hours: [0.002, 0.003], ph: 'about 7',
    juices: ['Mucus'],
    enzymes10: ['No digestion here'], enzymes11: [],
    what: 'Waves of muscle squeezing (peristalsis) push the bolus down to the stomach, even if you are upside down.',
    steps: { starch: none, protein: none, fat: none, fibre: none } },
  { id: 'stomach', name: 'Stomach', hours: [2, 4], ph: 'about 1.5 to 2 (strong acid)',
    juices: ['Gastric juice: hydrochloric acid, pepsin and mucus'],
    enzymes10: ['Pepsin: protein → peptides', 'Hydrochloric acid kills germs and makes the stomach acidic so pepsin can work', 'Mucus protects the stomach lining from the acid'],
    enzymes11: ['Pepsin is made as inactive pepsinogen; the acid switches it on', 'Rennin (in babies) curdles milk protein', 'A little gastric lipase starts on fat'],
    what: 'The stomach churns the food with gastric juice for a few hours into a thick paste called chyme. The acid stops salivary amylase working.',
    steps: { starch: none, protein: { split: 0.4, finish: 0, absorb: 0 }, fat: { split: 0.05, finish: 0, absorb: 0 }, fibre: none } },
  { id: 'duodenum', name: 'Duodenum', hours: [0.3, 0.6], ph: 'about 7 to 8 (alkaline)',
    juices: ['Bile from the liver (kept in the gall bladder)', 'Pancreatic juice from the pancreas'],
    enzymes10: ['Bile: no enzyme; it makes the food alkaline and breaks fat into tiny droplets (emulsifies it)', 'Pancreatic amylase: starch → maltose', 'Trypsin: protein → peptides', 'Lipase: fat → fatty acids and glycerol'],
    enzymes11: ['Trypsinogen is switched on to trypsin by enterokinase from the gut wall', 'Chymotrypsin and carboxypeptidase cut peptides', 'Nucleases: DNA and RNA → nucleotides'],
    what: 'The first part of the small intestine. Bile and pancreatic juice pour in through ducts and the acid chyme is made alkaline.',
    steps: { starch: { split: 0.9, finish: 0, absorb: 0 }, protein: { split: 0.9, finish: 0.3, absorb: 0 }, fat: { split: 1, finish: 0.6, absorb: 0 }, fibre: none } },
  { id: 'ileum', name: 'Small intestine', hours: [3, 5], ph: 'about 7 to 8',
    juices: ['Intestinal juice from glands in the wall'],
    enzymes10: ['Intestinal juice finishes the job: maltose → glucose, peptides → amino acids, fats → fatty acids and glycerol', 'Villi (tiny finger-like folds) absorb the small units into the blood'],
    enzymes11: ['Maltase: maltose → glucose; sucrase and lactase split sucrose and lactose', 'Dipeptidases: dipeptides → amino acids', 'Fatty acids and glycerol go into the lacteals (lymph), the rest into blood capillaries'],
    what: 'The longest part of the gut, about 6 to 7 m in an adult. Its huge folded inner surface, covered in villi, absorbs digested food.',
    steps: { starch: { split: 1, finish: 1, absorb: 1 }, protein: { split: 1, finish: 1, absorb: 1 }, fat: { split: 1, finish: 1, absorb: 1 }, fibre: none } },
  { id: 'colon', name: 'Large intestine', hours: [12, 36], ph: 'about 6 to 7',
    juices: ['Mucus'],
    enzymes10: ['No enzymes of our own: most of the leftover water is absorbed here'],
    enzymes11: ['Gut bacteria feed on some fibre and make a few vitamins'],
    what: 'Water is soaked up, so the undigested waste (mostly fibre) becomes firm.',
    steps: { starch: none, protein: none, fat: none, fibre: none } },
  { id: 'anus', name: 'Rectum and anus', hours: [0, 0], ph: '—',
    juices: [],
    enzymes10: ['Waste is stored in the rectum and leaves through the anus (egestion), controlled by a ring of muscle (the anal sphincter)'],
    enzymes11: [],
    what: 'Fibre that we cannot digest leaves the body. It still did a job: it helped the gut muscles push food along.',
    steps: { starch: none, protein: none, fat: none, fibre: none } },
];

export type Amounts = { whole: number; part: number; end: number; absorbed: number };
export type Meal = Record<Nutrient, number>;

export const MEALS: { id: string; name: string; meal: Meal }[] = [
  { id: 'thali', name: 'Roti, dal and sabzi', meal: { starch: 60, protein: 18, fat: 12, fibre: 10 } },
  { id: 'rice', name: 'Plain rice', meal: { starch: 80, protein: 6, fat: 1, fibre: 2 } },
  { id: 'paneer', name: 'Paneer tikka', meal: { starch: 6, protein: 25, fat: 30, fibre: 2 } },
  { id: 'toast', name: 'Butter toast', meal: { starch: 40, protein: 8, fat: 16, fibre: 4 } },
];

/** The amounts (grams) of each nutrient after each stop: result[i] is the state when the food leaves stop i. */
export function journey(meal: Meal): Record<Nutrient, Amounts>[] {
  let s: Record<Nutrient, Amounts> = {} as Record<Nutrient, Amounts>;
  for (const n of NUTRIENTS) s[n.id] = { whole: Math.max(0, meal[n.id] || 0), part: 0, end: 0, absorbed: 0 };
  const out: Record<Nutrient, Amounts>[] = [];
  for (const st of STOPS) {
    const next = {} as Record<Nutrient, Amounts>;
    for (const n of NUTRIENTS) {
      const a = s[n.id], k = st.steps[n.id];
      const split = a.whole * k.split, whole = a.whole - split;
      let part = a.part + split;
      const fin = part * k.finish; part -= fin;
      let end = a.end + fin;
      const abs = end * k.absorb; end -= abs;
      next[n.id] = { whole, part, end, absorbed: a.absorbed + abs };
    }
    out.push(next); s = next;
  }
  return out;
}

/** Rough time from swallowing to reaching (the start of) stop i, as [shortest, longest] hours. */
export function timeTo(i: number): [number, number] {
  let lo = 0, hi = 0;
  for (let j = 0; j < i; j++) { lo += STOPS[j].hours[0]; hi += STOPS[j].hours[1]; }
  return [lo, hi];
}

/** Grams of all food still in the gut (not absorbed) after stop i. */
export const leftInGut = (st: Record<Nutrient, Amounts>) => NUTRIENTS.reduce((t, n) => t + st[n.id].whole + st[n.id].part + st[n.id].end, 0);
