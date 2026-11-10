// Grade conversion for #1774. Plain TypeScript, no DOM. All conversions are approximate: every university has its own rules.

// India: CBSE's indicative percentage is CGPA x 9.5.
export const cgpaToPct = (c: number) => c * 9.5;
export const pctToCgpa = (p: number) => p / 9.5;
// Simple rescale, and the "topper" method some universities and evaluators use.
export const cgpaToUsSimple = (c: number, outOf = 10) => (c / outOf) * 4;
export const cgpaToUsTopper = (c: number, topper: number) => (c / topper) * 4;

export interface Band { min: number; letter: string; gpa: number }
// Common US college scale (percent to letter to points). Many schools differ.
export const US_TABLE: Band[] = [
  { min: 93, letter: 'A', gpa: 4.0 }, { min: 90, letter: 'A-', gpa: 3.7 }, { min: 87, letter: 'B+', gpa: 3.3 },
  { min: 83, letter: 'B', gpa: 3.0 }, { min: 80, letter: 'B-', gpa: 2.7 }, { min: 77, letter: 'C+', gpa: 2.3 },
  { min: 73, letter: 'C', gpa: 2.0 }, { min: 70, letter: 'C-', gpa: 1.7 }, { min: 67, letter: 'D+', gpa: 1.3 },
  { min: 63, letter: 'D', gpa: 1.0 }, { min: 60, letter: 'D-', gpa: 0.7 }, { min: 0, letter: 'F', gpa: 0 },
];
// OMSAS-style table (Ontario medical school applications): percent range to letter to 4.0 value.
export const OMSAS_TABLE: Band[] = [
  { min: 90, letter: 'A+', gpa: 4.0 }, { min: 85, letter: 'A', gpa: 3.9 }, { min: 80, letter: 'A-', gpa: 3.7 },
  { min: 77, letter: 'B+', gpa: 3.3 }, { min: 73, letter: 'B', gpa: 3.0 }, { min: 70, letter: 'B-', gpa: 2.7 },
  { min: 67, letter: 'C+', gpa: 2.3 }, { min: 63, letter: 'C', gpa: 2.0 }, { min: 60, letter: 'C-', gpa: 1.7 },
  { min: 57, letter: 'D+', gpa: 1.3 }, { min: 53, letter: 'D', gpa: 1.0 }, { min: 50, letter: 'D-', gpa: 0.7 },
  { min: 0, letter: 'F', gpa: 0 },
];
export const band = (table: Band[], pct: number): Band => table.find((b) => pct >= b.min) || table[table.length - 1];
export const bandTop = (table: Band[], b: Band): number => {
  const i = table.indexOf(b);
  return i === 0 ? 100 : table[i - 1].min - 1;
};
export const bandMid = (table: Band[], b: Band): number => (b.min + bandTop(table, b)) / 2;

export interface UkClass { min: number; name: string; usApprox: string }
export const UK_TABLE: UkClass[] = [
  { min: 70, name: 'First (1st)', usApprox: 'about 3.7 to 4.0' },
  { min: 60, name: 'Upper second (2:1)', usApprox: 'about 3.3 to 3.7' },
  { min: 50, name: 'Lower second (2:2)', usApprox: 'about 2.7 to 3.0' },
  { min: 40, name: 'Third (3rd)', usApprox: 'about 2.0' },
  { min: 0, name: 'Below a pass', usApprox: 'below 2.0' },
];
export const ukClass = (pct: number): UkClass => UK_TABLE.find((u) => pct >= u.min) || UK_TABLE[UK_TABLE.length - 1];

export interface Conversion {
  pct: number; cgpa: number;
  us: Band; omsas: Band; uk: UkClass;
  usSimple: number; // CGPA/10 x 4
  fromUs: boolean;
}
export type Source = 'percentage' | 'cgpa' | 'us';
export function convert(kind: Source, value: number): Conversion | null {
  if (!isFinite(value) || value < 0) return null;
  let pct: number;
  if (kind === 'percentage') { if (value > 100) return null; pct = value; }
  else if (kind === 'cgpa') { if (value > 10) return null; pct = cgpaToPct(value); }
  else { if (value > 4.3) return null; const b = US_TABLE.reduce((best, x) => (Math.abs(x.gpa - value) < Math.abs(best.gpa - value) - 1e-9 ? x : best), US_TABLE[0]); pct = bandMid(US_TABLE, b); }
  const cgpa = kind === 'cgpa' ? value : pctToCgpa(pct);
  return { pct, cgpa, us: band(US_TABLE, pct), omsas: band(OMSAS_TABLE, pct), uk: ukClass(pct), usSimple: cgpaToUsSimple(cgpa), fromUs: kind === 'us' };
}

// ---- course-weighted GPA ----
export type Scale = 'us' | 'omsas' | 'ten' | 'four';
const pointsOf = (t: Band[]) => Object.fromEntries(t.filter((b) => b.letter !== 'F').map((b) => [b.letter, b.gpa]).concat([['F', 0]]));
const US_PTS = { ...pointsOf(US_TABLE), 'A+': 4.0 };
const OMSAS_PTS = pointsOf(OMSAS_TABLE);
export function gradePoints(text: string, scale: Scale): number | null {
  const t = text.trim().toUpperCase().replace(/\s+/g, '');
  if (!t) return null;
  if (scale === 'us' || scale === 'omsas') {
    const m = (scale === 'us' ? US_PTS : OMSAS_PTS) as Record<string, number>;
    if (t in m) return m[t];
  }
  const n = Number(t);
  if (!isFinite(n) || n < 0) return null;
  const max = scale === 'ten' ? 10 : 4.3;
  return n <= max ? n : null;
}
export interface Course { name: string; grade: string; credits: string }
export function weightedGpa(courses: Course[], scale: Scale): { gpa: number; credits: number; used: number; skipped: number } | null {
  let pts = 0, cr = 0, used = 0, skipped = 0;
  for (const c of courses) {
    if (!c.grade.trim() && !c.credits.trim()) continue;
    const g = gradePoints(c.grade, scale), k = Number(c.credits);
    if (g === null || !isFinite(k) || k <= 0) { skipped++; continue; }
    pts += g * k; cr += k; used++;
  }
  return cr > 0 ? { gpa: pts / cr, credits: cr, used, skipped } : null;
}
