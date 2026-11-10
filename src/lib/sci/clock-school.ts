// School maths: angles made by clock hands (Class 9 rotations). The minute hand turns 6° a minute; the hour hand
// turns 30° an hour, which is 0.5° a minute. Angles are measured clockwise from 12. No DOM.

/** Positions of the hands in degrees clockwise from 12, for h hours (any whole or 12-hour value) and m minutes. */
export function hands(h: number, m: number): { hour: number; minute: number } {
  const total = (((h % 12) + 12) % 12) * 60 + m;
  return { hour: ((total * 0.5) % 360 + 360) % 360, minute: (((m * 6) % 360) + 360) % 360 };
}

/** The smaller angle between the hands (0 to 180) and the reflex angle (360 minus it). */
export function between(h: number, m: number): { small: number; reflex: number } {
  const { hour, minute } = hands(h, m);
  let d = Math.abs(hour - minute) % 360;
  if (d > 180) d = 360 - d;
  return { small: d, reflex: 360 - d };
}

/** The shortcut formula |30h − 5.5m| (before folding into 0..180). */
export const formula = (h: number, m: number) => Math.abs(30 * (h % 12) - 5.5 * m);

/** Times (minutes after 12:00, in 0..720) when the hands are `angle` degrees apart, sorted. */
export function timesAtAngle(angle: number): number[] {
  // minute − hour = 5.5 t (mod 360) must equal ±angle.
  const out: number[] = [];
  for (const target of angle === 0 || angle === 180 ? [angle] : [angle, 360 - angle]) {
    for (let k = 0; k < 12; k++) {
      const t = (target + 360 * k) / 5.5;
      if (t >= 0 && t < 720 - 1e-9) out.push(t);
    }
  }
  out.sort((a, b) => a - b);
  return out.filter((t, i) => i === 0 || t - out[i - 1] > 1e-9);
}

/** Minutes as h:mm with the leftover seconds, e.g. 65.4545 → "1:05 and 27 s". */
export function clockText(minutesAfter12: number): string {
  const t = ((minutesAfter12 % 720) + 720) % 720;
  let h = Math.floor(t / 60), m = Math.floor(t - h * 60), s = Math.round((t - h * 60 - m) * 60);
  if (s === 60) { s = 0; m += 1; if (m === 60) { m = 0; h += 1; } }
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, '0')}${s ? ` and ${s} s` : ''}`;
}
