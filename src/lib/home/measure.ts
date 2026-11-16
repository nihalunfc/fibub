// Tape measure and squareness maths for the Measure and mark lesson (#L375) and the Cut list (#T1011).
// Plain functions with no DOM, checked in tests/tools/measure-and-mark.mjs and tests/tools/cut-list.mjs.

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** Inches as whole + fraction to the nearest 1/den (den a power of 2, default 16), reduced: 5.375 -> {w:5,n:3,d:8}. */
export function toFraction(inches: number, den = 16) {
  const neg = inches < 0, t = Math.round(Math.abs(inches) * den);
  const w = Math.floor(t / den), r = t % den, g = r ? gcd(r, den) : 1;
  return { neg, w, n: r / g, d: r ? den / g : 1 };
}

/** "5 3/8" for 5.375 in; "3/4" for 0.75; "12" for 12. */
export function formatInches(inches: number, den = 16) {
  const f = toFraction(inches, den);
  const s = f.n ? (f.w ? `${f.w} ${f.n}/${f.d}` : `${f.n}/${f.d}`) : String(f.w);
  return (f.neg && (f.w || f.n) ? '-' : '') + s;
}

/**
 * Read a length typed as a decimal or with a fraction: "5 3/8", "5-3/8", "5+3/8", "3/8", "5.375", "5 3/8in", "5½".
 * NaN when it cannot be read.
 */
export function readLength(s: string): number {
  let t = s.trim().toLowerCase().replace(/(inches|inch|in|mm|"|”|″)$/, '').trim().replace(',', '.');
  const uni: Record<string, string> = { '½': ' 1/2', '¼': ' 1/4', '¾': ' 3/4', '⅛': ' 1/8', '⅜': ' 3/8', '⅝': ' 5/8', '⅞': ' 7/8' };
  t = t.replace(/[½¼¾⅛⅜⅝⅞]/g, (c) => uni[c]).trim();
  if (t === '') return NaN;
  if (/^\d*\.?\d+$/.test(t)) return Number(t);
  const m = t.match(/^(?:(\d+)\s*[\s+-]\s*)?(\d+)\s*\/\s*(\d+)$/);
  if (!m) return NaN;
  const d = +m[3]; if (!d) return NaN;
  return (m[1] ? +m[1] : 0) + +m[2] / d;
}

/** Squareness check with the 3-4-5 rule: the diagonal of a right angle with sides a and b is sqrt(a² + b²). */
export function squareCheck(a: number, b: number, diag: number) {
  const want = Math.hypot(a, b), off = diag - want;
  // Angle between the sides, from the cosine rule: d² = a² + b² - 2ab cos C.
  const c = Math.min(1, Math.max(-1, (a * a + b * b - diag * diag) / (2 * a * b)));
  return { want, off, angle: (Math.acos(c) * 180) / Math.PI };
}

/** How to read a metric tape at `mm`: the last numbered centimetre mark, then the small millimetre marks. */
export function metricWork(mm: number) {
  const cm = Math.floor(mm / 10), extra = Math.round(mm - cm * 10);
  return `Last numbered mark: ${cm} cm = ${cm * 10} mm. Then ${extra} small (1 mm) mark${extra === 1 ? '' : 's'}: ${cm * 10} + ${extra} = ${cm * 10 + extra} mm.`;
}

/** How to read an inch tape at `inches` (to 1/16): the last whole inch, then the sixteenths, reduced. */
export function inchWork(inches: number) {
  const w = Math.floor(inches + 1e-9), s = Math.round((inches - w) * 16);
  if (!s) return `It is right on the ${w} inch mark: ${w} in.`;
  const f = toFraction(s / 16);
  const red = f.d === 16 ? '' : ` = ${f.n}/${f.d}`;
  return `Last whole inch: ${w}. Then ${s} mark${s === 1 ? '' : 's'} of 1/16 in past it: ${s}/16${red}. Reading: ${formatInches(inches)} in.`;
}

/** A random tape reading for practice: whole mm from lo to hi, or inches to the nearest 1/16. */
export function randomReading(units: 'mm' | 'in', rand = Math.random) {
  if (units === 'mm') return 10 + Math.floor(rand() * 1490); // 10 to 1499 mm
  return 1 + Math.floor(rand() * 16 * 46) / 16;               // 1 to 46 15/16 in
}
