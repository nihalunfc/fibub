// Retaining wall stability (cantilever or gravity), per metre run of wall, cohesionless backfill.
// Earth pressure by Rankine (sloping backfill) or Coulomb (wall friction δ) on a vertical plane through the
// heel end (the "virtual back"; the wall back itself when there is no heel). Water behind the wall, a uniform
// surcharge, optional passive resistance in front of the toe and optional uplift under the base.
// Checks: sliding, overturning about the toe, and bearing (eccentricity, toe and heel pressures).
// All factors are user inputs; nothing here is a code value. Units: m, kN, kN/m³, kPa, degrees.

const rad = (d: number) => (d * Math.PI) / 180;

/** Rankine active coefficient for a backfill sloping at β (pressure parallel to the slope). */
export function rankineKa(phi: number, beta = 0): number {
  const b = rad(beta), f = rad(phi), cb = Math.cos(b), r = Math.sqrt(Math.max(0, cb * cb - Math.cos(f) ** 2));
  if (beta > phi) return NaN;
  return (cb * (cb - r)) / (cb + r);
}
/** Rankine passive coefficient, level ground. */
export const rankineKp = (phi: number) => (1 + Math.sin(rad(phi))) / (1 - Math.sin(rad(phi)));

/** Coulomb active coefficient: wall back at θ from vertical (positive leaning over the backfill), wall friction δ, backfill slope β. */
export function coulombKa(phi: number, delta: number, beta = 0, theta = 0): number {
  const f = rad(phi), d = rad(delta), b = rad(beta), t = rad(theta);
  if (beta > phi) return NaN;
  const root = Math.sqrt((Math.sin(f + d) * Math.sin(f - b)) / (Math.cos(d + t) * Math.cos(t - b)));
  return Math.cos(f - t) ** 2 / (Math.cos(t) ** 2 * Math.cos(d + t) * (1 + root) ** 2);
}

export type WallInput = {
  H: number;        // height from the underside of the base to the top of the stem (backfill level at the stem)
  tTop: number; tBot: number; // stem thickness at top and bottom (back face vertical, front face battered)
  tb: number;       // base thickness
  toe: number; heel: number;  // base projections in front of and behind the stem
  gc: number;       // unit weight of the wall material
  gamma: number; gsat: number; phi: number; // backfill: moist and saturated unit weight, friction angle
  beta: number;     // backfill slope (degrees)
  method: 'rankine' | 'coulomb'; delta: number; // wall friction for Coulomb (degrees)
  q: number;        // uniform surcharge on the backfill (kPa)
  hw: number;       // water height above the underside of the base at the virtual back (0 = dry)
  uplift: boolean;  // water pressure under the base, from hw at the heel to 0 at the toe
  gw?: number;      // unit weight of water (9.81)
  mu: number;       // base friction coefficient
  Df: number;       // soil depth in front of the wall above the underside of the base (passive and soil on the toe)
  usePassive: boolean;
};

export type Force = { name: string; V: number; H: number; x: number; y: number; resist: 'both' | 'bearing' | 'sliding' | 'none' };

export type WallResult = {
  B: number; Hv: number; K: number; Kp: number; angle: number;
  forces: Force[];
  sumV: number; sumH: number; Mr: number; Mo: number; Pp: number;
  fsSliding: number; fsOverturning: number;
  R: number; xbar: number; e: number; qToe: number; qHeel: number; contact: number;
  pressure: { z: number; soil: number; water: number; surcharge: number }[]; // along the virtual back, z down from its top
};

export function retainingWall(w: WallInput): WallResult {
  const gw = w.gw ?? 9.81, B = w.toe + w.tBot + w.heel, tanb = Math.tan(rad(w.beta));
  const Hv = w.H + w.heel * tanb; // height of the virtual back
  const K = w.method === 'rankine' ? rankineKa(w.phi, w.beta) : coulombKa(w.phi, w.delta, w.beta, 0);
  const angle = w.method === 'rankine' ? w.beta : w.delta; // thrust angle above horizontal
  const ca = Math.cos(rad(angle)), sa = Math.sin(rad(angle));
  const hw = Math.min(Math.max(w.hw, 0), Hv), zw = Hv - hw, gsub = w.gsat - gw;
  const sv = (z: number) => (z <= zw ? w.gamma * z : w.gamma * zw + gsub * (z - zw)); // effective vertical stress
  const forces: Force[] = [];
  // Earth thrust (effective), surcharge and water on the virtual back, piecewise linear in z.
  const segs = hw > 0 && zw > 0 ? [[0, zw], [zw, Hv]] : [[0, Hv]];
  const addLinear = (name: string, p: (z: number) => number, inclined: boolean) => {
    let F = 0, Fy = 0; // Fy = Σ F_i × height above base of each piece's centroid
    for (const [z1, z2] of segs) {
      const p1 = p(z1), p2 = p(z2), d = z2 - z1, f = ((p1 + p2) / 2) * d;
      if (f <= 0) continue;
      const zc = z1 + (d * (p1 + 2 * p2)) / (3 * (p1 + p2));
      F += f; Fy += f * (Hv - zc);
    }
    if (F > 0) forces.push({ name, V: inclined ? F * sa : 0, H: inclined ? F * ca : F, x: B, y: Fy / F, resist: 'none' });
  };
  addLinear('Earth pressure', (z) => K * sv(z), true);
  if (w.q > 0) addLinear('Surcharge pressure', () => K * w.q, true);
  if (hw > 0) addLinear('Water pressure', (z) => (z > zw ? gw * (z - zw) : 0), false);
  // Weights (resisting both sliding and overturning).
  const hs = w.H - w.tb, xb = w.toe + w.tBot; // stem height; back face of the stem
  forces.push({ name: 'Base slab', V: B * w.tb * w.gc, H: 0, x: B / 2, y: 0, resist: 'both' });
  forces.push({ name: 'Stem (rectangle)', V: w.tTop * hs * w.gc, H: 0, x: xb - w.tTop / 2, y: 0, resist: 'both' });
  if (w.tBot > w.tTop) forces.push({ name: 'Stem (taper)', V: 0.5 * (w.tBot - w.tTop) * hs * w.gc, H: 0, x: w.toe + (2 / 3) * (w.tBot - w.tTop), y: 0, resist: 'both' });
  if (w.heel > 0) {
    // Soil over the heel: moist above the water level, saturated below (uplift handled separately).
    const wetH = Math.min(hw, w.H) - w.tb, sat = Math.max(0, wetH), dry = hs - sat;
    forces.push({ name: 'Soil over heel', V: w.heel * (dry * w.gamma + sat * w.gsat), H: 0, x: xb + w.heel / 2, y: 0, resist: 'both' });
    if (w.beta > 0) forces.push({ name: 'Sloping soil wedge', V: 0.5 * w.heel * w.heel * tanb * (hw > w.H ? w.gsat : w.gamma), H: 0, x: xb + (2 / 3) * w.heel, y: 0, resist: 'both' });
    if (w.q > 0) forces.push({ name: 'Surcharge on heel', V: w.q * w.heel, H: 0, x: xb + w.heel / 2, y: 0, resist: 'bearing' });
  }
  if (w.Df > w.tb && w.toe > 0) forces.push({ name: 'Soil over toe', V: w.toe * (w.Df - w.tb) * w.gamma, H: 0, x: w.toe / 2, y: 0, resist: 'both' });
  if (w.uplift && hw > 0) forces.push({ name: 'Uplift', V: -0.5 * gw * hw * B, H: 0, x: (2 / 3) * B, y: 0, resist: 'none' });
  const Kp = rankineKp(w.phi), Pp = w.usePassive && w.Df > 0 ? 0.5 * Kp * w.gamma * w.Df ** 2 : 0;
  // Sums. Earth/water thrust vertical components count as resisting (moment about the toe and normal force).
  const stab = forces.filter((f) => f.resist === 'both' || (f.resist === 'none' && f.V > 0));
  let Mr = 0, Mo = 0;
  for (const f of forces) {
    if (f.resist === 'bearing') continue;
    if (f.V > 0) Mr += f.V * f.x; else Mo += -f.V * f.x;
    Mo += f.H * f.y;
  }
  const Vslide = stab.reduce((s, f) => s + f.V, 0) + forces.filter((f) => f.V < 0).reduce((s, f) => s + f.V, 0);
  const sumH = forces.reduce((s, f) => s + f.H, 0);
  const fsSliding = (Vslide * w.mu + Pp) / sumH, fsOverturning = Mr / Mo;
  // Bearing: every vertical force including the surcharge on the heel.
  const R = forces.reduce((s, f) => s + f.V, 0);
  const Mnet = forces.reduce((s, f) => s + f.V * f.x - f.H * f.y, 0);
  const xbar = Mnet / R, e = B / 2 - xbar;
  let qToe: number, qHeel: number, contact = B;
  if (!(R > 0) || xbar <= 0 || xbar >= B) { contact = 0; qToe = xbar <= B / 2 ? Infinity : 0; qHeel = xbar > B / 2 ? Infinity : 0; } // resultant outside the base: the wall tips over
  else if (Math.abs(e) <= B / 6) { qToe = (R / B) * (1 + (6 * e) / B); qHeel = (R / B) * (1 - (6 * e) / B); }
  else if (e > 0) { contact = 3 * xbar; qToe = (2 * R) / contact; qHeel = 0; }
  else { contact = 3 * (B - xbar); qHeel = (2 * R) / contact; qToe = 0; }
  const pressure = [] as WallResult['pressure'];
  for (let i = 0; i <= 40; i++) { const z = (Hv * i) / 40; pressure.push({ z, soil: K * sv(z), water: z > zw ? gw * (z - zw) : 0, surcharge: K * w.q }); }
  return { B, Hv, K, Kp, angle, forces, sumV: Vslide, sumH, Mr, Mo, Pp, fsSliding, fsOverturning, R, xbar, e, qToe, qHeel, contact, pressure };
}
