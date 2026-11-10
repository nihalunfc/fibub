// Reflex arc and reaction time (#1303): nerve signal travel time, the falling-ruler reaction time (d = ½ g t²) and
// simple statistics of a set of tries. No DOM.

/** Standard gravity, m/s² (CODATA/BIPM conventional value). */
export const G = 9.80665;

/** Milliseconds for a nerve signal to travel `lengthM` metres at `speed` m/s. */
export const travelMs = (lengthM: number, speed: number) => (speed > 0 ? (1000 * lengthM) / speed : Infinity);

/** A reflex: travel along the nerves plus a delay at each synapse (ms). */
export const reflexMs = (lengthM: number, speed: number, synapses: number, synapseMs = 0.5) => travelMs(lengthM, speed) + synapses * synapseMs;

/** Reaction time (s) from the distance (cm) a dropped ruler falls before you catch it: t = √(2d/g). */
export const rulerTime = (cm: number, g = G) => (cm > 0 ? Math.sqrt((2 * cm) / 100 / g) : 0);

/** Distance (cm) a ruler falls in t seconds: d = ½ g t². */
export const rulerCm = (t: number, g = G) => 100 * 0.5 * g * t * t;

export function stats(ms: number[]) {
  const a = ms.filter((x) => Number.isFinite(x)).slice().sort((x, y) => x - y), n = a.length;
  if (!n) return { n: 0, mean: NaN, median: NaN, best: NaN, worst: NaN };
  const mean = a.reduce((s, x) => s + x, 0) / n;
  const median = n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2;
  return { n, mean, median, best: a[0], worst: a[n - 1] };
}

/** Nerve paths for the picture: rough round lengths in metres for a teenager or adult. */
export const PATHS = {
  see: { name: 'eye → brain → spinal cord → hand muscles', m: 1.0 },
  knee: { name: 'knee → spinal cord → thigh muscle (knee jerk)', m: 1.6 },
  hand: { name: 'fingertip → spinal cord → arm muscle (pull away from heat)', m: 1.6 },
};

/** Typical round nerve speeds, m/s. */
export const SPEEDS = { myelinated: 60, unmyelinated: 1 };
