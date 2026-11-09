// Nanoparticle numbers: surface area to volume, specific surface area from density, atoms per particle and the share
// of atoms on the surface (spheres with a one-atom surface shell, and magic-number cuboctahedral or Mackay icosahedral
// clusters), particle number and molar concentration from a mass concentration, and the BET-equivalent diameter.
// Closed forms: S/V = 6/d, SSA = 6/(ρd); magic numbers N(n) = (10n³ + 15n² + 11n + 3)/3 with 10n² + 2 atoms in the
// outer shell (Mackay 1962; Benfield 1992, J. Chem. Soc. Faraday Trans. 88, 1107). Units: d in nm, ρ in g/cm³,
// M in g/mol, concentrations in mg/mL (= g/L).

export const NA = 6.02214076e23; // 1/mol, exact SI value

/** Volume (nm³), surface area (nm²), and S/V (1/nm) of a sphere of diameter d (nm). */
export function sphere(d: number) {
  return { V: (Math.PI * d ** 3) / 6, S: Math.PI * d * d, SV: 6 / d };
}
/** Specific surface area (m²/g) of spheres of diameter d (nm) and density ρ (g/cm³): 6/(ρ d). */
export const specificSurface = (d: number, rho: number) => 6000 / (rho * d);
/** BET-equivalent diameter (nm) from a specific surface area (m²/g): d = 6/(ρ SSA). */
export const betDiameter = (ssa: number, rho: number) => 6000 / (rho * ssa);
/** Mass of one particle (g). */
export const particleMass = (d: number, rho: number) => rho * sphere(d).V * 1e-21;
/** Volume per atom (nm³) from density and molar mass, and the diameter of a sphere of that volume (nm). */
export function atomVolume(rho: number, M: number) {
  const v = (M / (rho * NA)) * 1e21;
  return { v, da: Math.cbrt((6 * v) / Math.PI) };
}
/** Atoms (or formula units) in a sphere of diameter d, and those within one atom diameter da of its surface. */
export function sphereAtoms(d: number, rho: number, M: number, da?: number) {
  const a = atomVolume(rho, M), t = da ?? a.da;
  const N = sphere(d).V / a.v;
  const inner = d > 2 * t ? ((d - 2 * t) / d) ** 3 : 0;
  return { N, surface: N * (1 - inner), fraction: 1 - inner, da: t };
}

/** Magic-number cluster with n complete shells around a central atom (n = 0 is one atom): cuboctahedron or Mackay
 *  icosahedron, which have the same counts. Outer-shell atoms split into vertices, edges and faces. */
export function magic(n: number, shape: 'cubo' | 'ico') {
  const N = (10 * n ** 3 + 15 * n * n + 11 * n + 3) / 3;
  if (n === 0) return { N: 1, surface: 1, fraction: 1, vertex: 0, edge: 0, face: 0, edgeAtoms: 1 };
  const surface = 10 * n * n + 2, k = n - 1;
  const face = shape === 'cubo' ? 8 * ((k * (k - 1)) / 2) + 6 * k * k : 20 * ((k * (k - 1)) / 2);
  const edge = shape === 'cubo' ? 24 * k : 30 * k;
  return { N, surface, fraction: surface / N, vertex: 12, edge, face, edgeAtoms: n + 1 };
}
/** Shells needed for a cluster whose diameter (2n + 1) atom diameters is closest to d. */
export const shellsFor = (d: number, da: number) => Math.max(0, Math.round((d / da - 1) / 2));

/** Particles per mL and molar concentration (mol/L) from a mass concentration (mg/mL) and one particle's mass (g). */
export function numberConc(cMass: number, massOne: number) {
  const perML = (cMass * 1e-3) / massOne;
  return { perML, molar: (perML * 1000) / NA };
}
