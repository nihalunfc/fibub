// #1337 River crossing: relative velocity in two dimensions. A boat with speed vb through the water is pointed
// at angle θ upstream from straight across a river of width d flowing at vr. Plain maths, no DOM. SI units.
const RAD = Math.PI / 180;

/** Ground velocity, crossing time and drift downstream (negative drift = lands upstream). */
export function cross(d: number, vr: number, vb: number, thetaDeg: number) {
  const th = thetaDeg * RAD, across = vb * Math.cos(th), along = vr - vb * Math.sin(th);
  const t = across > 1e-12 ? d / across : Infinity, drift = Number.isFinite(t) ? along * t : NaN;
  const speed = Math.hypot(across, along), course = Math.atan2(along, across) / RAD; // course: degrees downstream from straight across
  return { across, along, t, drift, speed, course, path: Number.isFinite(t) ? Math.hypot(d, drift) : Infinity };
}

/** Heading for the shortest time (straight across) and for no drift (upstream at sin θ = vr/vb, if the boat is faster). */
export function best(d: number, vr: number, vb: number) {
  const fast = { theta: 0, t: d / vb, drift: (vr * d) / vb };
  const can = vb > vr;
  const theta = can ? Math.asin(vr / vb) / RAD : NaN, t = can ? d / Math.sqrt(vb * vb - vr * vr) : Infinity;
  // If the boat is slower than the river, the least drift comes from heading at sin θ = vb/vr upstream.
  const least = can ? 0 : (d * Math.sqrt(vr * vr - vb * vb)) / vb, leastTheta = can ? theta : Math.asin(vb / vr) / RAD;
  return { fast, can, theta, t, least, leastTheta };
}

// ---- Check yourself ----------------------------------------------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string; tol?: number };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const d = pick(rng, 4, 20) * 10, vb = pick(rng, 2, 6), t = d / vb; qs.push({ text: `A boat that moves at ${vb} m/s through still water heads straight across a river ${d} m wide. How long does it take to cross? (The current does not change this.)`, ans: t, unit: 's', work: `Only the part of the velocity across the river matters: t = ${d} ÷ ${vb} = ${n(t)} s.` }); }
  { const d = pick(rng, 4, 20) * 10, vb = pick(rng, 2, 6), vr = pick(rng, 1, 4), x = (vr * d) / vb; qs.push({ text: `The same kind of boat (${vb} m/s) heads straight across a ${d} m river flowing at ${vr} m/s. How far downstream does it land?`, ans: x, unit: 'm', work: `Time to cross = ${d} ÷ ${vb} = ${n(d / vb)} s. In that time the water carries it ${vr} × ${n(d / vb)} = ${n(x)} m downstream.` }); }
  { const vr = pick(rng, 1, 4), vb = vr + pick(rng, 1, 4), th = Math.asin(vr / vb) / RAD; qs.push({ text: `A swimmer can swim at ${vb} m/s in still water. The river flows at ${vr} m/s. At what angle upstream from straight across must they aim to land directly opposite?`, ans: th, unit: '°', tol: 0.2, work: `The upstream part of the swimmer's velocity must cancel the river: ${vb} sin θ = ${vr}, so sin θ = ${n(vr / vb)} and θ = ${n(th)}°.` }); }
  { const a = pick(rng, 2, 8), b = pick(rng, 2, 8), r = Math.hypot(a, b); qs.push({ text: `Rain falls straight down at ${a} m/s. You cycle at ${b} m/s. How fast does the rain hit you, relative to you?`, ans: r, unit: 'm/s', work: `Relative to you the rain also moves backwards at ${b} m/s. The two are at 90°, so the speed is √(${a}² + ${b}²) = ${n(r)} m/s; tilt your umbrella forwards.` }); }
  return qs;
}
