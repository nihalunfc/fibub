// Stereotaxic coordinates: scale atlas coordinates to an animal by its bregma-lambda distance, work out an angled
// approach, and check that the skull is flat. Lengths in mm, angles in degrees. AP is positive anterior of bregma,
// ML is the lateral distance from the midline, depth is positive below the skull surface at bregma (flat skull).

const RAD = Math.PI / 180;

export type Target = { ap: number; ml: number; dv: number };
export type ScaleMode = 'ap' | 'all';
/** Scale factor = measured ÷ reference bregma-lambda distance; applied to AP only or to all three axes. */
export function scaleTarget(t: Target, refBL: number, measBL: number, mode: ScaleMode): Target & { s: number } {
  const s = measBL / refBL;
  return { ap: t.ap * s, ml: mode === 'all' ? t.ml * s : t.ml, dv: mode === 'all' ? t.dv * s : t.dv, s };
}

export type Plane = 'ml' | 'ap';
/** Which way the tip of the angled arm points: toward the midline / away (ml plane), posterior / anterior (ap plane). */
export type Toward = 'medial' | 'lateral' | 'posterior' | 'anterior';
/**
 * An angled track that reaches the target with the arm tilted `angle` degrees from vertical in one plane.
 * Returns where the track crosses the skull plane (entry, relative to bregma), the distance to lower along the
 * arm from there, and the horizontal offset between entry and target.
 */
export function angled(t: Target, angle: number, plane: Plane, toward: Toward) {
  const off = t.dv * Math.tan(angle * RAD), len = t.dv / Math.cos(angle * RAD);
  let ap = t.ap, ml = t.ml;
  if (plane === 'ml') ml = toward === 'medial' ? t.ml + off : t.ml - off;
  else ap = toward === 'posterior' ? t.ap + off : t.ap - off;
  return { entry: { ap, ml }, length: len, offset: off };
}

/**
 * Skull-flat check from two DV readings a known distance apart (bregma and lambda, or left and right).
 * `down` is true when the frame's DV reading grows as the arm moves down. Returns the height difference
 * (positive when the second point is lower), the tilt angle and whether it is within tolerance.
 */
export function flatness(dv1: number, dv2: number, distance: number, tol: number, down = true) {
  const lower = down ? dv2 - dv1 : dv1 - dv2;
  return { diff: lower, angle: Math.atan2(lower, distance) / RAD, flat: Math.abs(lower) <= tol };
}
