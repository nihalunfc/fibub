// #1283 Clock and turn angles: angles of the hands of a clock (hour hand 30° per hour plus 0.5° per minute,
// minute hand 6° per minute), the angle between them, the times in 12 hours when they make a given angle, and turns
// on a compass (fractions of a turn, clockwise or anticlockwise, which way you end up facing). Pure maths, no DOM.

export const wrap = (d: number) => ((d % 360) + 360) % 360;
/** Angles of the hands, degrees clockwise from 12. */
export function hands(h: number, m: number): { hour: number; minute: number } {
  return { hour: wrap(30 * (h % 12) + 0.5 * m), minute: wrap(6 * m) };
}
/** The smaller angle between the hands (0 to 180) and the reflex one. */
export function between(h: number, m: number): { small: number; reflex: number } {
  const { hour, minute } = hands(h, m);
  const d = Math.abs(hour - minute), small = Math.min(d, 360 - d);
  return { small, reflex: 360 - small };
}
/** Name of an angle. */
export function kind(a: number): string {
  const e = 1e-9;
  if (Math.abs(a) < e) return 'zero angle';
  if (a < 90 - e) return 'acute';
  if (Math.abs(a - 90) < e) return 'right angle';
  if (a < 180 - e) return 'obtuse';
  if (Math.abs(a - 180) < e) return 'straight angle';
  if (a < 360 - e) return 'reflex';
  return 'full turn';
}
/**
 * Times (minutes after 12:00, 0 ≤ t < 720) when the smaller angle between the hands is `a` degrees (0 to 180). The
 * minute hand gains 5.5° a minute on the hour hand, so (5.5 t) mod 360 must be a or 360 − a.
 */
export function timesAt(a: number): number[] {
  if (!(a >= 0 && a <= 180)) return [];
  const out: number[] = [];
  for (let k = 0; k < 12; k++) for (const g of a === 0 || a === 180 ? [a] : [a, 360 - a]) { const t = (360 * k + g) / 5.5; if (t < 720 - 1e-9) out.push(t); }
  return out.sort((x, y) => x - y);
}
/** "h:mm" (and seconds when not whole) for minutes after 12:00. */
export function clockText(t: number): string {
  const H = Math.floor(t / 60), m = t - 60 * H, mm = Math.floor(m + 1e-9), s = Math.round((m - mm) * 60);
  const [M, S] = s === 60 ? [mm + 1, 0] : [mm, s];
  return `${H === 0 ? 12 : H}:${String(M).padStart(2, '0')}${S ? `:${String(S).padStart(2, '0')}` : ''}`;
}

export const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
export const COMPASS_NAMES = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];
/** Facing direction after turning `turn` degrees (clockwise positive) from `start` (degrees from north). */
export function facing(start: number, turn: number): { bearing: number; name: string | null } {
  const b = wrap(start + turn), i = Math.round(b / 45);
  return { bearing: b, name: Math.abs(b - 45 * i) < 1e-9 ? COMPASS_NAMES[i % 8] : null };
}
/** A turn in words: "1 ¾ turns clockwise", "a quarter turn anticlockwise", "no turn". */
export function turnWords(turn: number): string {
  if (Math.abs(turn) < 1e-9) return 'no turn';
  const dir = turn > 0 ? 'clockwise' : 'anticlockwise', q = Math.abs(turn) / 90;
  if (Math.abs(q - Math.round(q)) > 1e-9) return `${+(Math.abs(turn) / 360).toFixed(4)} of a turn ${dir}`;
  const whole = Math.floor(Math.round(q) / 4), part = Math.round(q) % 4, frac = ['', '¼', '½', '¾'][part];
  if (!whole) return `${['', 'a quarter', 'a half', 'three quarters of a'][part]} turn ${dir}`;
  return `${whole}${frac ? ` ${frac}` : ''} turn${whole > 1 || frac ? 's' : ''} ${dir}`;
}
