// Orbits for the school kepler-orbits tool: a planet launched sideways at distance r0 from a star, in
// astronomical units and years (GM = 4π² AU³/yr²). Ellipse from the launch speed, position against time
// from Kepler's equation, swept areas, T² = a³, escape speed, and g above and below a planet's surface.
// Plain TypeScript, no DOM.

export const MU = 4 * Math.PI * Math.PI; // AU³/yr² for one solar mass
export const AU_PER_YR_KMS = 4.740470463533348; // 1 AU/yr in km/s (IAU AU and Julian year)

export type Orbit = { bound: true; a: number; e: number; b: number; T: number; rp: number; ra: number; launchAtPeri: boolean; vCirc: number; vEsc: number } | { bound: false; e: number; rp: number; vCirc: number; vEsc: number };

/** Orbit of a body launched at right angles to the line to the star, at distance r0 (AU) with speed v (AU/yr). */
export function orbit(r0: number, v: number, mu = MU): Orbit {
  const vCirc = Math.sqrt(mu / r0), vEsc = Math.SQRT2 * vCirc, eps = (v * v) / 2 - mu / r0;
  const e = Math.abs((r0 * v * v) / mu - 1);
  if (eps >= -1e-12) return { bound: false, e, rp: r0, vCirc, vEsc };
  const a = -mu / (2 * eps), b = a * Math.sqrt(1 - e * e), T = 2 * Math.PI * Math.sqrt((a * a * a) / mu);
  const launchAtPeri = v >= vCirc;
  return { bound: true, a, e, b, T, rp: a * (1 - e), ra: a * (1 + e), launchAtPeri, vCirc, vEsc };
}

/** Solve Kepler's equation M = E − e sin E for E (Newton's method). */
export function eccentricAnomaly(M: number, e: number): number {
  let E = e < 0.8 ? M : Math.PI;
  for (let i = 0; i < 60; i++) { const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-14) break; }
  return E;
}

/**
 * Position (AU) at time t (yr) after launch, in a frame with the star at the origin and the launch point
 * on the +x axis, moving towards +y.
 */
export function position(o: Extract<Orbit, { bound: true }>, t: number) {
  const n = (2 * Math.PI) / o.T, M0 = o.launchAtPeri ? 0 : Math.PI, M = M0 + n * t;
  const E = eccentricAnomaly(((M % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI), o.e);
  // perihelion on +x
  const x = o.a * (Math.cos(E) - o.e), y = o.b * Math.sin(E);
  // launched at aphelion: turn the ellipse round so the launch point is on +x, moving towards +y
  return o.launchAtPeri ? { x, y, r: Math.hypot(x, y) } : { x: -x, y: -y, r: Math.hypot(x, y) };
}

/** Area (AU²) swept by the line to the star between times t1 and t2 (within one orbit): (ab/2) × ΔM. */
export const sweptArea = (o: Extract<Orbit, { bound: true }>, t1: number, t2: number) => ((o.a * o.b) / 2) * ((2 * Math.PI) / o.T) * (t2 - t1);

/** Unbound path: step it with a simple symplectic integrator (for drawing only). */
export function openPath(r0: number, v: number, tMax: number, mu = MU, n = 4000) {
  let x = r0, y = 0, vx = 0, vy = v; const dt = tMax / n, xs = [x], ys = [y];
  for (let i = 0; i < n; i++) {
    let r = Math.hypot(x, y); vx -= (mu * x) / r ** 3 * dt / 2; vy -= (mu * y) / r ** 3 * dt / 2;
    x += vx * dt; y += vy * dt; r = Math.hypot(x, y);
    vx -= (mu * x) / r ** 3 * dt / 2; vy -= (mu * y) / r ** 3 * dt / 2;
    xs.push(x); ys.push(y);
  }
  return { x: xs, y: ys };
}

/** The planets: semi-major axis (AU) and orbital period (years), rounded. */
export const PLANETS: [string, number, number][] = [
  ['Mercury', 0.387, 0.241], ['Venus', 0.723, 0.615], ['Earth', 1, 1], ['Mars', 1.524, 1.881],
  ['Jupiter', 5.203, 11.86], ['Saturn', 9.537, 29.46], ['Uranus', 19.19, 84.01], ['Neptune', 30.07, 164.8],
];

// ---- gravity of a planet ----------------------------------------------------------------------------------
/** g at a distance r from the centre of a uniform planet of radius R with surface gravity g0: outside g0(R/r)², inside g0 r/R. */
export const gAt = (r: number, R: number, g0: number) => (r >= R ? g0 * (R / r) ** 2 : (g0 * r) / R);
/** Escape speed and the speed of a low circular orbit (m/s) from surface gravity g0 (m/s²) and radius R (m). */
export const surfaceSpeeds = (g0: number, R: number) => ({ orbit: Math.sqrt(g0 * R), escape: Math.sqrt(2 * g0 * R) });

// ---- Check yourself ----------------------------------------------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

export function questions(level: 9 | 11, rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const k = pick(rng, 2, 5), F = pick(rng, 2, 20) * 10; qs.push({ text: `Two bodies pull on each other with a gravitational force of ${F} N. If the distance between them becomes ${k} times bigger, what is the new force?`, ans: F / (k * k), unit: 'N', work: `F ∝ 1/r², so the force is divided by ${k}² = ${k * k}: ${F} ÷ ${k * k} = ${n(F / (k * k))} N.` }); }
  { const m = pick(rng, 20, 90); qs.push({ text: `A ${m} kg astronaut stands on the Moon, where g is 1.6 m/s². What is their weight there?`, ans: m * 1.6, unit: 'N', work: `Weight = m g = ${m} × 1.6 = ${n(m * 1.6)} N. The mass stays ${m} kg everywhere.` }); }
  { const k = pick(rng, 1, 3); qs.push({ text: `Taking g = 9.8 m/s² at the Earth's surface, what is g at a height of ${k} Earth radius${k > 1 ? 'es' : ''} above the surface?`, ans: 9.8 / (k + 1) ** 2, unit: 'm/s²', work: `The distance from the centre is ${k + 1}R, so g = 9.8 × (R ÷ ${k + 1}R)² = 9.8 ÷ ${(k + 1) ** 2} = ${n(9.8 / (k + 1) ** 2)} m/s².` }); }
  if (level === 11) {
    const a = [4, 9, 16, 25, 0.25][pick(rng, 0, 4)], T = a ** 1.5;
    qs.push({ text: `An asteroid orbits the Sun with a semi-major axis of ${a} AU. Using T² = a³ (T in years, a in AU), what is its period?`, ans: T, unit: 'years', work: `T = a^(3/2) = ${a}^1.5 = √${a}³ = ${n(T)} years.` });
    const d = [0.25, 0.5, 0.75][pick(rng, 0, 2)];
    qs.push({ text: `Taking g = 9.8 m/s² at the surface and a uniform Earth, what is g at a depth of ${d}R below the surface?`, ans: 9.8 * (1 - d), unit: 'm/s²', work: `Inside a uniform planet g = g₀(1 − d/R) = 9.8 × (1 − ${d}) = ${n(9.8 * (1 - d))} m/s².` });
  }
  return qs;
}
