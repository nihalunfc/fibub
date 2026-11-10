// Geological time (school level, Class 12 biology: evolution): eons, eras and periods with rounded ages, when major
// forms of life appeared, where an age falls in the time scale, and Earth's history squeezed into one year or one
// day. Ages in millions of years ago (Ma), rounded; estimates vary. Pure functions, no DOM.

export const EARTH_AGE = 4540; // Ma, about 4.54 billion years

export type Span = { name: string; from: number; to: number; rank: 'eon' | 'era' | 'period' };
/** Rounded boundaries after the International Commission on Stratigraphy chart. */
export const SPANS: Span[] = [
  { name: 'Hadean', from: 4540, to: 4000, rank: 'eon' }, { name: 'Archean', from: 4000, to: 2500, rank: 'eon' },
  { name: 'Proterozoic', from: 2500, to: 539, rank: 'eon' }, { name: 'Phanerozoic', from: 539, to: 0, rank: 'eon' },
  { name: 'Paleozoic', from: 539, to: 252, rank: 'era' }, { name: 'Mesozoic', from: 252, to: 66, rank: 'era' }, { name: 'Cenozoic', from: 66, to: 0, rank: 'era' },
  { name: 'Cambrian', from: 539, to: 485, rank: 'period' }, { name: 'Ordovician', from: 485, to: 444, rank: 'period' },
  { name: 'Silurian', from: 444, to: 419, rank: 'period' }, { name: 'Devonian', from: 419, to: 359, rank: 'period' },
  { name: 'Carboniferous', from: 359, to: 299, rank: 'period' }, { name: 'Permian', from: 299, to: 252, rank: 'period' },
  { name: 'Triassic', from: 252, to: 201, rank: 'period' }, { name: 'Jurassic', from: 201, to: 145, rank: 'period' },
  { name: 'Cretaceous', from: 145, to: 66, rank: 'period' }, { name: 'Paleogene', from: 66, to: 23, rank: 'period' },
  { name: 'Neogene', from: 23, to: 2.6, rank: 'period' }, { name: 'Quaternary', from: 2.6, to: 0, rank: 'period' },
];

export type Event = { id: string; label: string; ma: number };
/** Approximate, widely quoted round figures. */
export const EVENTS: Event[] = [
  { id: 'earth', label: 'Earth forms', ma: 4540 },
  { id: 'life', label: 'Earliest signs of life (microbes)', ma: 3700 },
  { id: 'oxygen', label: 'Oxygen builds up in the air', ma: 2400 },
  { id: 'eukaryote', label: 'First cells with a nucleus', ma: 1800 },
  { id: 'multicell', label: 'First many-celled algae', ma: 1000 },
  { id: 'cambrian', label: 'Burst of animal life (Cambrian)', ma: 538 },
  { id: 'fish', label: 'First fish (jawless)', ma: 500 },
  { id: 'plants', label: 'First land plants', ma: 470 },
  { id: 'amphibian', label: 'First four-legged animals', ma: 370 },
  { id: 'reptile', label: 'First reptiles', ma: 312 },
  { id: 'extinction', label: 'Great Permian extinction', ma: 252 },
  { id: 'dinosaur', label: 'First dinosaurs', ma: 233 },
  { id: 'mammal', label: 'First mammals', ma: 205 },
  { id: 'bird', label: 'First birds', ma: 150 },
  { id: 'flower', label: 'First flowering plants', ma: 130 },
  { id: 'kpg', label: 'Dinosaurs (except birds) die out', ma: 66 },
  { id: 'hominin', label: 'First human ancestors walk upright', ma: 7 },
  { id: 'sapiens', label: 'Modern humans (Homo sapiens)', ma: 0.3 },
];

/** The eon, era and period an age (Ma) falls in. */
export function placeOf(ma: number) {
  if (!(ma >= 0) || ma > EARTH_AGE) throw new Error(`The age must be between 0 and ${EARTH_AGE} million years.`);
  // a boundary age belongs to the older span (the K-Pg extinction at 66 Ma ends the Cretaceous)
  const find = (rank: Span['rank']) => SPANS.find((s) => s.rank === rank && ma >= s.to && (ma < s.from || (s.from === EARTH_AGE && ma <= s.from)))?.name ?? null;
  return { eon: find('eon'), era: find('era'), period: find('period') };
}

/** Share of Earth's history already passed at an age. */
export const elapsed = (ma: number) => (EARTH_AGE - ma) / EARTH_AGE;

/** Earth's history squeezed into a 365-day year from 1 Jan 00:00 to 31 Dec 24:00. */
export function onCalendar(ma: number) {
  const days = elapsed(ma) * 365, before = (ma / EARTH_AGE) * 365; // days before midnight on 31 December
  const dayIndex = Math.min(364, Math.floor(days)), mins = Math.floor((days - Math.floor(days)) * 1440);
  const MONTHS = [['January', 31], ['February', 28], ['March', 31], ['April', 30], ['May', 31], ['June', 30], ['July', 31], ['August', 31], ['September', 30], ['October', 31], ['November', 30], ['December', 31]] as const;
  let d = dayIndex, m = 0;
  while (d >= MONTHS[m][1]) { d -= MONTHS[m][1]; m++; }
  const h = Math.floor(Math.min(mins, 1439) / 60), mm = Math.min(mins, 1439) % 60;
  return { daysBefore: before, date: `${d + 1} ${MONTHS[m][0]}`, time: `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}` };
}

/** Earth's history squeezed into one 24-hour day: clock time and seconds before midnight. */
export function onClock(ma: number) {
  const secs = elapsed(ma) * 86400, before = (ma / EARTH_AGE) * 86400;
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = Math.floor(secs % 60);
  return { secondsBefore: before, time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` };
}
