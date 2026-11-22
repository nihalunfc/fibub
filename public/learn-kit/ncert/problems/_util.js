// Small helpers shared by the NCERT problem files.
/** A number from min to max in steps of `step`, using the seeded rand(). */
export const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
/** One item of a list. */
export const choose = (r, list) => list[Math.floor(r() * list.length) % list.length];
/** A number written for Indian readers, to d significant figures. */
export const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
/** A worked solution as numbered steps. */
export const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
