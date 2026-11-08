// Hückel molecular orbital theory for π systems: energies α + xβ, coefficients, occupations (with Hund's rule for
// degenerate levels), π energy, delocalisation energy, charges, bond orders and free valences. Heteroatoms use
// Streitwieser's h and k parameters (α_X = α + hβ, β_CX = kβ).

export type AtomType = { id: string; label: string; h: number; k: number; electrons: number };
export const ATOM_TYPES: AtomType[] = [
  { id: 'C', label: 'C (carbon)', h: 0, k: 1, electrons: 1 },
  { id: 'N', label: 'N, pyridine-like (one π electron)', h: 0.5, k: 1, electrons: 1 },
  { id: 'N:', label: 'N:, pyrrole-like (lone pair, two π electrons)', h: 1.5, k: 0.8, electrons: 2 },
  { id: 'O', label: 'O, carbonyl (one π electron)', h: 1, k: 1, electrons: 1 },
  { id: 'O:', label: 'O:, furan or ether (two π electrons)', h: 2, k: 0.8, electrons: 2 },
];

export type Atom = { h: number; k: number; electrons: number; label: string };
export type Molecule = { atoms: Atom[]; bonds: [number, number][] };

/** Eigen-decomposition of a real symmetric matrix by cyclic Jacobi rotations. Vectors are columns of `vectors`. */
export function jacobi(A: number[][]): { values: number[]; vectors: number[][] } {
  const n = A.length, a = A.map((r) => [...r]), v = A.map((_, i) => A.map((_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += a[p][q] ** 2;
    if (off < 1e-24) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(a[p][q]) < 1e-300) continue;
      const th = (a[q][q] - a[p][p]) / (2 * a[p][q]);
      const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - s * akq; a[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - s * aqk; a[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = v[k][p], vkq = v[k][q]; v[k][p] = c * vkp - s * vkq; v[k][q] = s * vkp + c * vkq; }
    }
  }
  return { values: a.map((r, i) => r[i]), vectors: v };
}

export type Orbital = { x: number; c: number[]; occ: number };
export type Huckel = {
  orbitals: Orbital[]; electrons: number; xTotal: number; homo: number; lumo: number;
  charges: number[]; bondOrders: { a: number; b: number; p: number }[]; freeValence: number[];
  delocalisation: number | null; cyclic: boolean; ringSize: number | null;
};

/** Solve a π system with `charge` (e.g. −1 for an anion). x is in units of β, E = α + xβ; larger x is lower in energy. */
export function solve(mol: Molecule, charge = 0): Huckel {
  const n = mol.atoms.length;
  if (n < 1) throw new Error('Give at least one atom.');
  const M = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? mol.atoms[i].h : 0)));
  for (const [a, b] of mol.bonds) {
    if (!(a >= 0 && a < n && b >= 0 && b < n) || a === b) throw new Error(`Bond ${a + 1}–${b + 1} names an atom that is not there.`);
    const k = mol.atoms[a].k * mol.atoms[b].k; // C–C 1, C–X k_X
    M[a][b] = M[b][a] = k;
  }
  const electrons = mol.atoms.reduce((s, at) => s + at.electrons, 0) - charge;
  if (electrons < 0 || electrons > 2 * n) throw new Error(`That leaves ${electrons} π electrons, but ${n} orbitals hold 0 to ${2 * n}.`);
  const { values, vectors } = jacobi(M);
  const order = values.map((x, i) => ({ x, i })).sort((p, q) => q.x - p.x);
  const orbitals: Orbital[] = order.map(({ x, i }) => {
    const c = vectors.map((r) => r[i]);
    // Sign convention: first non-zero coefficient positive.
    const f = c.find((z) => Math.abs(z) > 1e-9) ?? 1;
    return { x, c: c.map((z) => (f < 0 ? -z : z)), occ: 0 };
  });
  // Fill, sharing electrons evenly within a degenerate set (Hund's rule, averaged).
  let left = electrons;
  for (let i = 0; i < n && left > 0;) {
    let j = i; while (j + 1 < n && Math.abs(orbitals[j + 1].x - orbitals[i].x) < 1e-6) j++;
    const g = j - i + 1, put = Math.min(left, 2 * g);
    for (let k = i; k <= j; k++) orbitals[k].occ = put / g;
    left -= put; i = j + 1;
  }
  const occ = orbitals.filter((o) => o.occ > 0), homo = occ.length ? orbitals.indexOf(occ[occ.length - 1]) : -1;
  const lumo = orbitals.findIndex((o) => o.occ < 2 - 1e-9);
  const xTotal = orbitals.reduce((s, o) => s + o.occ * o.x, 0);
  const charges = mol.atoms.map((at, r) => at.electrons - orbitals.reduce((s, o) => s + o.occ * o.c[r] ** 2, 0));
  const bondOrders = mol.bonds.map(([a, b]) => ({ a, b, p: orbitals.reduce((s, o) => s + o.occ * o.c[a] * o.c[b], 0) }));
  const freeValence = mol.atoms.map((_, r) => Math.sqrt(3) - bondOrders.reduce((s, bo) => s + (bo.a === r || bo.b === r ? bo.p : 0), 0));
  // Delocalisation energy against isolated ethylene bonds (all-carbon systems only).
  const allC = mol.atoms.every((at) => at.h === 0 && at.k === 1 && at.electrons === 1);
  const localized = Math.min(Math.floor(electrons / 2), maxMatching(n, mol.bonds));
  const delocalisation = allC ? xTotal - 2 * localized : null;
  const deg = new Array(n).fill(0); mol.bonds.forEach(([a, b]) => { deg[a]++; deg[b]++; });
  const cyclic = mol.bonds.length >= n;
  const ringSize = cyclic && mol.bonds.length === n && deg.every((d) => d === 2) ? n : null;
  return { orbitals, electrons, xTotal, homo, lumo: lumo < 0 ? -1 : lumo, charges, bondOrders, freeValence, delocalisation, cyclic, ringSize };
}

/** Largest number of disjoint bonds (a matching), by exhaustive search for small systems. */
export function maxMatching(n: number, bonds: [number, number][]): number {
  const used = new Array(n).fill(false);
  let best = 0;
  const go = (i: number, count: number) => {
    if (count + (bonds.length - i) <= best) return;
    if (i === bonds.length) { best = Math.max(best, count); return; }
    const [a, b] = bonds[i];
    if (!used[a] && !used[b]) { used[a] = used[b] = true; go(i + 1, count + 1); used[a] = used[b] = false; }
    go(i + 1, count);
  };
  if (bonds.length <= 40) go(0, 0); else best = Math.floor(n / 2);
  return Math.min(best, Math.floor(n / 2));
}

/** Read "1-2, 2-3 3-4" (1-based) into 0-based bonds. */
export function parseBonds(text: string): [number, number][] {
  const out: [number, number][] = [];
  for (const m of text.matchAll(/(\d+)\s*[-–=]\s*(\d+)/g)) out.push([Number(m[1]) - 1, Number(m[2]) - 1]);
  return out;
}

const chain = (n: number): [number, number][] => Array.from({ length: n - 1 }, (_, i) => [i, i + 1]);
const ring = (n: number): [number, number][] => [...chain(n), [n - 1, 0]];
export const PRESETS: { id: string; name: string; n: number; bonds: [number, number][]; types?: Record<number, string>; charge: number }[] = [
  { id: 'ethylene', name: 'Ethylene', n: 2, bonds: chain(2), charge: 0 },
  { id: 'allyl+', name: 'Allyl cation', n: 3, bonds: chain(3), charge: 1 },
  { id: 'allyl', name: 'Allyl radical', n: 3, bonds: chain(3), charge: 0 },
  { id: 'allyl-', name: 'Allyl anion', n: 3, bonds: chain(3), charge: -1 },
  { id: 'butadiene', name: '1,3-Butadiene', n: 4, bonds: chain(4), charge: 0 },
  { id: 'hexatriene', name: '1,3,5-Hexatriene', n: 6, bonds: chain(6), charge: 0 },
  { id: 'cyclobutadiene', name: 'Cyclobutadiene', n: 4, bonds: ring(4), charge: 0 },
  { id: 'cp-', name: 'Cyclopentadienyl anion', n: 5, bonds: ring(5), charge: -1 },
  { id: 'benzene', name: 'Benzene', n: 6, bonds: ring(6), charge: 0 },
  { id: 'tropylium', name: 'Tropylium cation', n: 7, bonds: ring(7), charge: 1 },
  { id: 'cot', name: 'Cyclooctatetraene (planar)', n: 8, bonds: ring(8), charge: 0 },
  { id: 'naphthalene', name: 'Naphthalene', n: 10, bonds: [[0, 1], [1, 2], [2, 3], [3, 9], [9, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 0], [8, 9]], charge: 0 },
  { id: 'fulvene', name: 'Fulvene', n: 6, bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 5]], charge: 0 },
  { id: 'formaldehyde', name: 'Formaldehyde (C=O)', n: 2, bonds: chain(2), types: { 1: 'O' }, charge: 0 },
  { id: 'pyridine', name: 'Pyridine', n: 6, bonds: ring(6), types: { 0: 'N' }, charge: 0 },
  { id: 'pyrrole', name: 'Pyrrole', n: 5, bonds: ring(5), types: { 0: 'N:' }, charge: 0 },
  { id: 'furan', name: 'Furan', n: 5, bonds: ring(5), types: { 0: 'O:' }, charge: 0 },
];

/** Build a molecule from atom count, bonds and a map of atom index → type id (or {h, k, electrons}). */
export function build(n: number, bonds: [number, number][], types: Record<number, string | { h: number; k: number; electrons: number }> = {}): Molecule {
  const atoms: Atom[] = Array.from({ length: n }, (_, i) => {
    const t = types[i];
    if (t && typeof t === 'object') return { ...t, label: 'X' };
    const at = ATOM_TYPES.find((a) => a.id === (t ?? 'C'))!;
    return { h: at.h, k: at.k, electrons: at.electrons, label: at.id };
  });
  return { atoms, bonds };
}
