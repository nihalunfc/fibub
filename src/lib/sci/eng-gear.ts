// Gear trains, planetary sets and belt drives. Speeds in any unit (e.g. rpm), torques in any unit.

export type Mesh = { driver: number; driven: number; kind: 'external' | 'internal' | 'chain'; eff: number };
export type ShaftState = { speed: number; torque: number; dir: 1 | -1 };

/** A chain of meshes where the driven gear of one mesh shares its shaft with the driver of the next (a compound
 * train; an idler is a mesh whose driven gear is also the next driver, with equal teeth). External meshes reverse
 * the direction; internal (ring) gears and chain or belt sprockets keep it. Returns the state of each shaft, the
 * input shaft first. Torque passes through each mesh times the ratio and the mesh efficiency. */
export function train(meshes: Mesh[], speed: number, torque: number): { shafts: ShaftState[]; ratio: number; eff: number } {
  if (!meshes.length) throw new Error('Add at least one mesh.');
  const shafts: ShaftState[] = [{ speed, torque, dir: 1 }];
  let ratio = 1, eff = 1;
  for (const [i, m] of meshes.entries()) {
    if (!(m.driver > 0 && m.driven > 0)) throw new Error(`Mesh ${i + 1}: give both tooth counts.`);
    if (!(m.eff > 0 && m.eff <= 1)) throw new Error(`Mesh ${i + 1}: efficiency must be above 0 and at most 100 %.`);
    if (m.kind === 'internal' && m.driven === m.driver) throw new Error(`Mesh ${i + 1}: an internal gear needs more teeth than its pinion.`);
    const r = m.driven / m.driver, p = shafts[shafts.length - 1];
    ratio *= r; eff *= m.eff;
    shafts.push({ speed: p.speed / r, torque: p.torque * r * m.eff, dir: (m.kind === 'external' ? -p.dir : p.dir) as 1 | -1 });
  }
  return { shafts, ratio, eff };
}

/** Centre distance of a mesh with module m (mm): m(N1 + N2)/2, or m(N2 − N1)/2 for an internal gear. */
export const centreDistance = (m: number, mesh: Mesh) => (mesh.kind === 'internal' ? (m * Math.abs(mesh.driven - mesh.driver)) / 2 : (m * (mesh.driver + mesh.driven)) / 2);

/** Willis equation for a simple planetary set: (ωr − ωc) / (ωs − ωc) = −Ns / Nr. Give two of the three speeds
 * (the unknown as NaN) and get all three. */
export function planetary(Ns: number, Nr: number, ws: number, wr: number, wc: number): { ws: number; wr: number; wc: number; wp: number } {
  if (!(Ns > 0 && Nr > Ns)) throw new Error('The ring needs more teeth than the sun.');
  const k = Ns / Nr, unknown = [ws, wr, wc].filter((v) => !Number.isFinite(v)).length;
  if (unknown !== 1) throw new Error('Give exactly two of the three speeds.');
  if (!Number.isFinite(ws)) ws = wc - (wr - wc) / k;
  else if (!Number.isFinite(wr)) wr = wc - k * (ws - wc);
  else wc = (wr + k * ws) / (1 + k);
  // Planet speed about its own axis: (ωp − ωc) / (ωs − ωc) = −Ns / Np, with Np = (Nr − Ns)/2.
  const Np = (Nr - Ns) / 2;
  return { ws, wr, wc, wp: wc - (Ns / Np) * (ws - wc) };
}

/** Ideal (lossless) torque split in a planetary set: Ts : Tr : Tc = 1 : Nr/Ns : −(1 + Nr/Ns). */
export const planetaryTorques = (Ns: number, Nr: number, Ts: number) => ({ Ts, Tr: (Ts * Nr) / Ns, Tc: -Ts * (1 + Nr / Ns) });

/** Assembly check for equally spaced planets: Np whole, (Ns + Nr) / n whole. */
export function planetaryChecks(Ns: number, Nr: number, n: number) {
  const Np = (Nr - Ns) / 2;
  return { Np, wholePlanet: Number.isInteger(Np), assembles: Number.isInteger((Ns + Nr) / n), fits: n >= 1 && (Np + 2) < (Ns + Np) * Math.sin(Math.PI / n) };
}

/** Belt drive between pulleys D (larger) and d at centre distance C: belt length and wrap angles (radians), for an
 * open belt (both pulleys turn the same way) or a crossed belt (opposite ways). Pitch diameters. */
export function belt(D: number, d: number, C: number, crossed: boolean): { L: number; wrapSmall: number; wrapLarge: number; span: number } {
  if (D < d) [D, d] = [d, D];
  const s = crossed ? D + d : D - d;
  if (!(d > 0 && C > s / 2)) throw new Error('The pulleys overlap: make the centre distance larger.');
  const phi = Math.asin(s / (2 * C)), span = Math.sqrt(4 * C * C - s * s) / 2;
  const wrapSmall = crossed ? Math.PI + 2 * phi : Math.PI - 2 * phi, wrapLarge = Math.PI + 2 * phi;
  return { L: 2 * span + (D * wrapLarge + d * wrapSmall) / 2, wrapSmall, wrapLarge, span };
}

/** The common approximation L ≈ 2C + π(D + d)/2 + (D ∓ d)²/4C. */
export const beltApprox = (D: number, d: number, C: number, crossed: boolean) => 2 * C + (Math.PI * (D + d)) / 2 + (crossed ? D + d : D - d) ** 2 / (4 * C);

/** Centre distance for a given belt length (bisection on the exact length). */
export function beltCentre(D: number, d: number, L: number, crossed: boolean): number {
  const s = crossed ? D + d : Math.abs(D - d);
  let lo = s / 2 * (1 + 1e-12) + 1e-12, hi = Math.max(L, 1);
  if (!(belt(D, d, lo, crossed).L < L)) throw new Error('The belt is too short to go round these pulleys.');
  while (belt(D, d, hi, crossed).L < L) hi *= 2;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (belt(D, d, m, crossed).L < L) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
