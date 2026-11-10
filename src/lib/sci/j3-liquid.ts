// Liquid pressure with depth (Learn #1221): a bottle with three holes. Plain TypeScript, no DOM.
// Gauge pressure at depth d: P = ρ g d. Jet speed from a small hole (Torricelli, no losses): v = √(2 g d).
// A jet leaving sideways from a hole a height y above the floor lands x = v √(2y/g) = 2 √(d y) away.

export const G = 9.8; // m/s², rounded school value
export const ATM = 101325; // Pa, standard atmosphere

export type Liquid = { id: string; name: string; rho: number };
/** Densities in kg/m³: rounded general values. */
export const LIQUIDS: Liquid[] = [
  { id: 'water', name: 'Water', rho: 1000 },
  { id: 'sea', name: 'Salty sea water', rho: 1030 },
  { id: 'oil', name: 'Cooking oil', rho: 920 },
  { id: 'mercury', name: 'Mercury', rho: 13600 },
];

/** Hole heights above the bottom of the bottle, in m. The bottle is 0.30 m tall. */
export const HOLES = [0.05, 0.15, 0.25];
export const BOTTLE = 0.3;

/** Gauge pressure (Pa) at depth d (m) in a liquid of density rho. */
export const gauge = (rho: number, d: number) => rho * G * Math.max(0, d);
/** Jet speed (m/s) from a hole at depth d (m). */
export const speed = (d: number) => Math.sqrt(2 * G * Math.max(0, d));
/** Time to fall a height y (m). */
export const fallTime = (y: number) => Math.sqrt((2 * Math.max(0, y)) / G);
/** Where the jet lands, measured from the hole (m): depth d below the surface, y above the floor. */
export const reach = (d: number, y: number) => (d <= 0 ? 0 : speed(d) * fallTime(y));

export type Jet = { hole: number; y: number; depth: number; P: number; v: number; x: number; flowing: boolean };
/** All three jets for water level `level` (m above the bottle's bottom) with the bottle on a stand `stand` m high. */
export function jets(rho: number, level: number, stand: number): Jet[] {
  return HOLES.map((h, i) => {
    const d = level - h, flowing = d > 1e-9;
    return { hole: i, y: h + stand, depth: Math.max(0, d), P: gauge(rho, d), v: flowing ? speed(d) : 0, x: flowing ? reach(d, h + stand) : 0, flowing };
  });
}
/** Which hole sends its jet furthest (index), or −1 when none flows. */
export function furthest(js: Jet[]) { let b = -1; js.forEach((j, i) => { if (j.flowing && (b < 0 || j.x > js[b].x + 1e-12)) b = i; }); return b; }

/** The height of a hole (above the floor) that throws a jet furthest when the surface is H above the floor: H/2. */
export const bestHoleHeight = (surfaceAboveFloor: number) => surfaceAboveFloor / 2;

/** Teaching drain rate: each open hole has 1/400 of the bottle's cross-section. Level change in dt seconds. */
export const HOLE_RATIO = 1 / 400;
export function drain(level: number, dt: number): number {
  let L = level; const n = 20, h = dt / n;
  for (let k = 0; k < n; k++) { let q = 0; for (const y of HOLES) if (L > y) q += speed(L - y); L = Math.max(0, L - HOLE_RATIO * q * h); }
  return L;
}

export type Q = { q: string; ans: number; unit?: string; tol?: number; abs?: number; choices?: string[]; work: string };
const n3 = (x: number) => String(+x.toPrecision(3));
/** Fresh "Check yourself" questions; lvl '8' or '11'. */
export function questions(lvl: string, rnd: () => number = Math.random): Q[] {
  const ri = (lo: number, hi: number) => lo + Math.floor(rnd() * (hi - lo + 1));
  const d1 = ri(2, 30) / 2; // m (swimming pool / lake)
  const out: Q[] = [
    { q: `What is the pressure of the water (not counting the air) ${d1} m below the surface of a lake? Water's density is 1,000 kg/m³ and g = 9.8 m/s². Give it in kPa.`, ans: gauge(1000, d1) / 1000, unit: 'kPa', work: `P = ρgh = 1,000 × 9.8 × ${d1} = ${n3(gauge(1000, d1))} Pa = ${n3(gauge(1000, d1) / 1000)} kPa.` },
    { q: 'A tall bottle of water has holes near the top, the middle and the bottom. From which hole does water squirt out fastest?', ans: 2, choices: ['The top hole', 'The middle hole', 'The bottom hole', 'All the same'], work: 'The bottom hole is deepest. The pressure of a liquid grows with depth, so water is pushed out hardest there.' },
  ];
  const d2 = ri(2, 12) * 5; // cm
  const k = ri(2, 4);
  out.push({ q: `The pressure ${d2} cm below the surface of some water is P. What is the pressure ${k * d2} cm below the surface, as a multiple of P?`, ans: k, unit: '× P', abs: 0.01, work: `Pressure ∝ depth (P = ρgh): ${k * d2} cm is ${k} times deeper, so the pressure is ${k} P.` });
  if (lvl === '11') {
    const d3 = ri(5, 40) / 100, y3 = ri(10, 100) / 100, v = speed(d3), x = reach(d3, y3);
    out.push({ q: `Water leaks from a small hole ${d3 * 100} cm below the surface. How fast does it come out? (Torricelli, g = 9.8 m/s²)`, ans: v, unit: 'm/s', work: `v = √(2gh) = √(2 × 9.8 × ${d3}) = ${n3(v)} m/s.` });
    out.push({ q: `That hole is ${y3 * 100} cm above the floor and the jet leaves sideways. How far from the bottle does it land, in cm?`, ans: x * 100, unit: 'cm', work: `Fall time t = √(2y/g) = √(2 × ${y3} / 9.8) = ${n3(fallTime(y3))} s. Distance = v t = ${n3(v)} × ${n3(fallTime(y3))} = ${n3(x)} m = ${n3(x * 100)} cm (the same as 2√(hy) = 2√(${d3} × ${y3})).` });
  }
  return out;
}
