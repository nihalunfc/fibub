// Balanced and unbalanced forces (Learn): forces along a line add as signed numbers (right positive). No DOM.

/** Net force (N) along a line: right pulls positive, left pulls negative. */
export const netForce = (left: number[], right: number[]) => right.reduce((s, f) => s + f, 0) - left.reduce((s, f) => s + f, 0);
/** Acceleration (m/s²) from Newton's second law a = F/m. */
export const accel = (F: number, m: number) => (m > 0 ? F / m : 0);
/** Distance (m) moved from rest in time t under constant acceleration: s = ½at². */
export const distance = (a: number, t: number) => 0.5 * a * t * t;
/** Time (s) to move distance s from rest under acceleration a (Infinity if a = 0). */
export const timeTo = (s: number, a: number) => (a === 0 ? Infinity : Math.sqrt((2 * Math.abs(s)) / Math.abs(a)));
