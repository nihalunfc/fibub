// School maths: heights and distances (Class 10 applications of trigonometry). Angle of elevation and
// depression, one observer, two observers on the same or opposite sides. Angles in degrees. No DOM.
import { rad, deg } from './trig-school.ts';

const tan = (d: number) => Math.tan(rad(d));

/**
 * One observer at horizontal distance d from the foot of a tower of height h, with eyes e above the ground.
 * Give any two of d, h, angle (and e) and get all three. The angle is measured at the eye.
 */
export function oneObserver(find: 'height' | 'distance' | 'angle', v: { d?: number; h?: number; angle?: number; e?: number }) {
  const e = v.e ?? 0;
  if (find === 'height') { const d = v.d!, a = v.angle!; return { d, angle: a, h: e + d * tan(a), rise: d * tan(a), e }; }
  if (find === 'distance') { const h = v.h!, a = v.angle!; return { h, angle: a, d: (h - e) / tan(a), rise: h - e, e }; }
  const h = v.h!, d = v.d!;
  return { h, d, angle: deg(Math.atan2(h - e, d)), rise: h - e, e };
}

/**
 * Two observers in a line with the tower, `s` apart. `same`: both on one side, the nearer sees the top at `near`°,
 * the farther at `far`° (near > far). Otherwise they stand on opposite sides with angles `near` and `far`.
 * Returns the height above eye level and each observer's distance from the foot.
 */
export function twoObservers(near: number, far: number, s: number, same: boolean) {
  const t1 = tan(near), t2 = tan(far);
  if (same) {
    if (!(near > far)) return null;
    const h = (s * t1 * t2) / (t1 - t2);
    return { h, x1: h / t1, x2: h / t2 };
  }
  const h = (s * t1 * t2) / (t1 + t2);
  return { h, x1: h / t1, x2: h / t2 };
}

/** Looking down from height H at angle of depression `angle`: horizontal distance to the object. */
export const depression = (H: number, angle: number) => H / tan(angle);

/** Values students use: tan 30° = 1/√3, tan 45° = 1, tan 60° = √3 (√3 ≈ 1.732). */
export const TAN_TEXT: Record<number, string> = { 30: '1/√3', 45: '1', 60: '√3' };
