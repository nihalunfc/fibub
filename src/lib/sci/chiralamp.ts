// Chiral amplification models for the 2026 Chemistry Nobel (Kagan: non-linear effects; Soai: asymmetric
// autocatalysis). Pure maths, no DOM. Used by the Chiral amplification lab and the Nobel series articles.
//
// Kagan's ML2 model (Guillaneux, Zhao, Samuel, Rainford and Kagan, JACS 1994): the catalyst carries two
// chiral ligands, so it exists as two homochiral complexes (RR amount x, SS amount y) and one heterochiral
// "meso" complex (RS, amount z), in equilibrium with K = z² / (x·y) (K = 4 is pure chance). If the meso
// complex reacts g times as fast as a homochiral one (g = 0: inactive), the product's ee is
//   ee_prod = ee_max · ee_aux · (1 + β) / (1 + g·β),   β = z / (x + y).

/** Shares of the RR, SS and RS complexes (x + y + z = 1) for ligand excess e (−1 to 1) and constant K. */
export function complexShares(e: number, K: number): { x: number; y: number; z: number } {
  e = Math.max(-1, Math.min(1, e));
  // With x = (1 − z + e)/2 and y = (1 − z − e)/2: z² = K·((1 − z)² − e²)/4 → (4 − K) z² + 2K z − K (1 − e²) = 0.
  const a = 4 - K, b = 2 * K, c = -K * (1 - e * e);
  let z: number;
  if (Math.abs(a) < 1e-12) z = -c / b;
  else { const d = Math.sqrt(Math.max(0, b * b - 4 * a * c)); const z1 = (-b + d) / (2 * a), z2 = (-b - d) / (2 * a); z = z1 >= -1e-12 && z1 <= 1 - Math.abs(e) + 1e-12 ? z1 : z2; }
  z = Math.max(0, Math.min(1 - Math.abs(e), z));
  return { x: (1 - z + e) / 2, y: (1 - z - e) / 2, z };
}

/** Kagan's ML2 result: product ee (same scale as eeMax) for ligand ee e, equilibrium K and meso reactivity g. */
export function ml2(e: number, K: number, g: number, eeMax = 1) {
  const { x, y, z } = complexShares(e, K);
  const beta = x + y > 0 ? z / (x + y) : Infinity;
  const ee = Number.isFinite(beta) ? eeMax * e * (1 + beta) / (1 + g * beta) : 0;
  return { ee, beta, x, y, z, rate: x + y + g * z }; // rate: relative to an enantiopure catalyst of the same amount
}

/**
 * One batch of Soai-type autocatalysis (a dimer model in the spirit of Kagan's ML2 and Blackmond's kinetic
 * studies): the product's own R and S molecules pair into RR, SS and RS dimers (equilibrium K); RR makes more R,
 * SS more S, and RS is inactive. Starts with seed product (amount `seed`, excess e0) and `feed` of starting
 * material, and runs until it is used up. Returns the final excess and the history.
 */
export function soaiBatch(e0: number, seed: number, feed: number, K: number, steps = 4000) {
  let R = (seed * (1 + e0)) / 2, S = (seed * (1 - e0)) / 2, A = feed;
  const hist: { conv: number; ee: number }[] = [{ conv: 0, ee: e0 }];
  for (let i = 0; i < steps && A > feed * 1e-6; i++) {
    const tot = R + S, e = (R - S) / tot;
    const { x, y } = complexShares(e, K);
    const rx = x * tot / 2, ry = y * tot / 2; // amounts of RR and SS dimers
    // Use a step that turns over at most 0.5% of what is left.
    const rate = (rx + ry) * A; const h = (0.005 * A) / Math.max(rate, 1e-300);
    const dR = rx * A * h, dS = ry * A * h;
    R += dR; S += dS; A -= dR + dS;
    if (i % 20 === 0) hist.push({ conv: 1 - A / feed, ee: (R - S) / (R + S) });
  }
  const ee = (R - S) / (R + S);
  hist.push({ conv: 1, ee });
  return { ee, R, S, hist };
}

/** Repeated batches: each batch's whole product seeds the next. Returns the excess after each round. */
export function soaiRounds(e0: number, rounds: number, seedFrac: number, K: number) {
  const out = [e0]; let e = e0;
  for (let i = 0; i < rounds; i++) { e = soaiBatch(e, seedFrac, 1, K).ee; out.push(e); }
  return out;
}
