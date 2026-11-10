// Radian ruler (Class 11 maths, trigonometric functions): degrees ↔ radians, angles as fractions of π, arc length
// s = r θ and sector area ½ r² θ. Plain TypeScript, no DOM.
export const toRad = (deg: number) => (deg * Math.PI) / 180;
export const toDeg = (rad: number) => (rad * 180) / Math.PI;
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** An angle in degrees as a multiple of π, when it is a whole number of degrees (or a half): 135 → "3π/4". */
export function piForm(deg: number): string | null {
  const h = Math.round(deg * 2);
  if (Math.abs(h - deg * 2) > 1e-9) return null;
  if (h === 0) return '0';
  let p = h, q = 360; const g = gcd(p, q); p /= g; q /= g;
  const sign = p < 0 ? '−' : ''; p = Math.abs(p);
  return `${sign}${p === 1 ? '' : p}π${q === 1 ? '' : '/' + q}`;
}
/** Read "3pi/4", "3π/4", "pi", "2.5" as radians. NaN if it cannot. */
export function readRad(src: string): number {
  const t = src.replace(/\s+/g, '').replace(/π/g, 'pi').toLowerCase();
  const m = t.match(/^(-?)(\d*\.?\d*)\*?pi(?:\/(\d+\.?\d*))?$/);
  if (m) { const k = m[2] === '' ? 1 : Number(m[2]), d = m[3] ? Number(m[3]) : 1; const v = (m[1] ? -1 : 1) * (k * Math.PI) / d; return Number.isFinite(v) && d !== 0 ? v : NaN; }
  const v = t === '' ? NaN : Number(t);
  return Number.isFinite(v) ? v : NaN;
}
/** Degrees, minutes and seconds to decimal degrees. */
export const dms = (d: number, m = 0, s = 0) => Math.sign(d || 1) * (Math.abs(d) + m / 60 + s / 3600);
export const arc = (r: number, rad: number) => r * rad;
export const sector = (r: number, rad: number) => 0.5 * r * r * rad;
