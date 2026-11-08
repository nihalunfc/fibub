// Crystal field theory: d-electron count of a metal ion, d-orbital splitting for common geometries, the lowest-energy
// electron arrangement for a given splitting Δ and pairing energy P (high or low spin), CFSE, unpaired electrons,
// spin-only magnetic moment, Jahn–Teller tendency, and Δ from an absorption band.

/** Group numbers of the d-block metals. */
const GROUP: Record<string, number> = {
  Sc: 3, Ti: 4, V: 5, Cr: 6, Mn: 7, Fe: 8, Co: 9, Ni: 10, Cu: 11, Zn: 12,
  Y: 3, Zr: 4, Nb: 5, Mo: 6, Tc: 7, Ru: 8, Rh: 9, Pd: 10, Ag: 11, Cd: 12,
  La: 3, Hf: 4, Ta: 5, W: 6, Re: 7, Os: 8, Ir: 9, Pt: 10, Au: 11, Hg: 12,
};
export const METALS = Object.keys(GROUP);
/** d electrons of Mⁿ⁺: group number minus the oxidation state. */
export function dCount(metal: string, ox: number): number {
  const g = GROUP[metal];
  if (g === undefined) throw new Error(`${metal} is not a d-block metal in this list.`);
  const d = g - ox;
  if (d < 0 || d > 10) throw new Error(`${metal} in oxidation state +${ox} would have ${d} d electrons, which is not possible.`);
  return d;
}

export type Level = { name: string; e: number }; // energy in units of Δ for the geometry (Δo for octahedral-derived ones)
export type Geometry = { id: string; name: string; levels: Level[]; deltaName: string; note: string };
/** One-electron energies of the five d orbitals, barycentre at zero. Square planar and square pyramidal in Δo units (Dq tables). */
export const GEOMETRIES: Geometry[] = [
  { id: 'oh', name: 'Octahedral', deltaName: 'Δo', note: 't2g at −0.4Δo, eg at +0.6Δo',
    levels: [{ name: 'dxy', e: -0.4 }, { name: 'dxz', e: -0.4 }, { name: 'dyz', e: -0.4 }, { name: 'dz²', e: 0.6 }, { name: 'dx²−y²', e: 0.6 }] },
  { id: 'td', name: 'Tetrahedral', deltaName: 'Δt', note: 'e at −0.6Δt, t2 at +0.4Δt; Δt is about 4/9 of Δo for the same metal and ligands',
    levels: [{ name: 'dz²', e: -0.6 }, { name: 'dx²−y²', e: -0.6 }, { name: 'dxy', e: 0.4 }, { name: 'dxz', e: 0.4 }, { name: 'dyz', e: 0.4 }] },
  { id: 'sp', name: 'Square planar', deltaName: 'Δo', note: 'energies in Δo of the matching octahedron: dx²−y² +1.228, dxy +0.228, dz² −0.428, dxz and dyz −0.514',
    levels: [{ name: 'dxz', e: -0.514 }, { name: 'dyz', e: -0.514 }, { name: 'dz²', e: -0.428 }, { name: 'dxy', e: 0.228 }, { name: 'dx²−y²', e: 1.228 }] },
  { id: 'spy', name: 'Square pyramidal', deltaName: 'Δo', note: 'energies in Δo: dx²−y² +0.914, dz² +0.086, dxy −0.086, dxz and dyz −0.457',
    levels: [{ name: 'dxz', e: -0.457 }, { name: 'dyz', e: -0.457 }, { name: 'dxy', e: -0.086 }, { name: 'dz²', e: 0.086 }, { name: 'dx²−y²', e: 0.914 }] },
];

export type Config = { occ: number[]; unpaired: number; pairs: number; cfse: number; energy: number };

/** Every arrangement of n electrons in the five orbitals, with its energy (Δ and P in the same unit). Sorted best first. */
export function arrangements(levels: Level[], n: number, delta: number, P: number): Config[] {
  const out: Config[] = [];
  const occ = [0, 0, 0, 0, 0];
  const rec = (i: number, left: number) => {
    if (i === 5) { if (left === 0) {
      const pairs = occ.filter((o) => o === 2).length, unpaired = occ.filter((o) => o === 1).length;
      const cfse = occ.reduce((s, o, k) => s + o * levels[k].e, 0);
      out.push({ occ: [...occ], unpaired, pairs, cfse, energy: cfse * delta + pairs * P });
    } return; }
    for (let o = 0; o <= Math.min(2, left); o++) { occ[i] = o; rec(i + 1, left - o); }
    occ[i] = 0;
  };
  rec(0, n);
  // Equal energies: more unpaired electrons first, then pairs drawn in the first orbitals of a set.
  const lex = (a: Config, b: Config) => { for (let i = 0; i < 5; i++) if (a.occ[i] !== b.occ[i]) return b.occ[i] - a.occ[i]; return 0; };
  return out.sort((a, b) => (Math.abs(a.energy - b.energy) > 1e-9 ? a.energy - b.energy : b.unpaired - a.unpaired || lex(a, b)));
}

/** Best arrangement for each possible number of unpaired electrons (the spin states worth comparing). */
export function spinStates(levels: Level[], n: number, delta: number, P: number): Config[] {
  const best = new Map<number, Config>();
  for (const c of arrangements(levels, n, delta, P)) if (!best.has(c.unpaired) || c.energy < best.get(c.unpaired)!.energy - 1e-12) best.set(c.unpaired, c);
  return [...best.values()].sort((a, b) => a.energy - b.energy);
}

/** Spin-only magnetic moment in Bohr magnetons. */
export const spinOnly = (unpaired: number) => Math.sqrt(unpaired * (unpaired + 2));

/** Term-like label of an octahedral or tetrahedral configuration, such as t2g⁴ eg². */
export function configLabel(geo: Geometry, occ: number[]): string {
  const sup = (n: number) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[n] ?? String(n);
  if (geo.id === 'oh') return `t2g${sup(occ[0] + occ[1] + occ[2])} eg${sup(occ[3] + occ[4])}`;
  if (geo.id === 'td') return `e${sup(occ[0] + occ[1])} t2${sup(occ[2] + occ[3] + occ[4])}`;
  return geo.levels.map((l, i) => (occ[i] ? `${l.name}${sup(occ[i])}` : '')).filter(Boolean).join(' ');
}

/** Jahn–Teller expectation for an octahedral configuration. */
export function jahnTeller(occ: number[]): 'strong' | 'weak' | 'none' {
  const eg = [occ[3], occ[4]], t = [occ[0], occ[1], occ[2]];
  const egEven = eg[0] === eg[1], tEven = t[0] === t[1] && t[1] === t[2];
  // Degenerate sets are unevenly filled when the count cannot be spread evenly.
  const egCount = eg[0] + eg[1], tCount = t[0] + t[1] + t[2];
  if (egCount === 1 || egCount === 3 || !egEven && egCount % 2 === 1) return 'strong';
  if (tCount % 3 !== 0 || !tEven) return 'weak';
  return 'none';
}

/** 1 cm⁻¹ in kJ/mol. */
export const CM_TO_KJ = 0.01196266;
/** Δ in cm⁻¹ from the wavelength (nm) of a d–d absorption band (for d¹, Δ equals the band energy). */
export const deltaFromNm = (nm: number) => 1e7 / nm;
/** The colour a solution looks when it absorbs light of this wavelength (approximate complementary colour). */
export function seenColour(nm: number): { absorbed: string; seen: string } {
  const bands: [number, string, string][] = [[400, 'violet', 'yellow-green'], [435, 'violet-blue', 'yellow'], [480, 'blue', 'orange'], [490, 'green-blue', 'red-orange'], [500, 'blue-green', 'red'], [560, 'green', 'red-violet'], [580, 'yellow-green', 'violet'], [595, 'yellow', 'blue'], [605, 'orange', 'green-blue'], [750, 'red', 'blue-green']];
  if (nm < 380) return { absorbed: 'ultraviolet', seen: 'colourless (absorbs no visible light)' };
  if (nm > 750) return { absorbed: 'near infrared', seen: 'nearly colourless or faintly coloured' };
  const b = bands.find(([max]) => nm <= max) ?? bands[bands.length - 1];
  return { absorbed: b[1], seen: b[2] };
}

/** The spectrochemical series, weak-field to strong-field. */
export const SPECTROCHEMICAL = ['I⁻', 'Br⁻', 'S²⁻', 'SCN⁻ (S-bound)', 'Cl⁻', 'NO₃⁻', 'F⁻', 'OH⁻', 'C₂O₄²⁻', 'H₂O', 'NCS⁻ (N-bound)', 'CH₃CN', 'pyridine', 'NH₃', 'en', 'bipy', 'phen', 'NO₂⁻', 'PPh₃', 'CN⁻', 'CO'];
