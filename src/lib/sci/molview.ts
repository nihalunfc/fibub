// Small-molecule files for the 3D viewer: XYZ (one or many frames), MOL and SDF (V2000), bonds guessed from distances
// when the file has none, distances, angles and dihedrals, formula, molar mass, centre of mass, rotation maths and
// XYZ text. Pure functions, no DOM.
import { ELEMENTS, BY_SYMBOL } from './chem.ts';

export type MAtom = { el: string; z: number; x: number; y: number; zc: number; charge: number; iso?: number };
export type MBond = { a: number; b: number; order: number };   // order 1, 2, 3, or 4 for aromatic (MOL type 4)
export type Molecule = { title: string; atoms: MAtom[]; bonds: MBond[]; bondsFromFile: boolean; format: 'XYZ' | 'MOL' | 'SDF'; props: [string, string][] };

export class MolError extends Error {}

/** Rounded single-bond covalent radii (Å) chosen by fibub for guessing bonds; elements not listed use 1.5 Å. */
export const RADII: Record<string, number> = {
  H: 0.3, Li: 1.25, Be: 0.95, B: 0.85, C: 0.75, N: 0.7, O: 0.65, F: 0.6, Na: 1.55, Mg: 1.4, Al: 1.2, Si: 1.1, P: 1.05, S: 1.05, Cl: 1.0,
  K: 1.95, Ca: 1.75, Ti: 1.4, V: 1.35, Cr: 1.3, Mn: 1.35, Fe: 1.3, Co: 1.25, Ni: 1.2, Cu: 1.3, Zn: 1.25, Ga: 1.25, Ge: 1.2, As: 1.2, Se: 1.2, Br: 1.15,
  Rb: 2.1, Sr: 1.9, Zr: 1.5, Mo: 1.45, Ru: 1.4, Rh: 1.4, Pd: 1.35, Ag: 1.45, Cd: 1.45, In: 1.45, Sn: 1.4, Sb: 1.4, Te: 1.35, I: 1.35,
  Cs: 2.3, Ba: 2.0, W: 1.45, Re: 1.4, Os: 1.35, Ir: 1.35, Pt: 1.3, Au: 1.3, Hg: 1.35, Tl: 1.45, Pb: 1.45, Bi: 1.5,
};
export const radius = (el: string) => RADII[el] ?? 1.5;
export const TOLERANCE = 0.45;

/** Conventional atom colours (CPK style), light and dark-page versions. */
const COLORS: Record<string, string> = { H: '#e8e8e8', C: '#6b6b6b', N: '#2f5fd0', O: '#e0301e', F: '#7fd04a', Cl: '#2fae2f', Br: '#9b2a1a', I: '#7a2fa0', S: '#e6c21a', P: '#f08a1a', B: '#f2a58a', Si: '#c9a77a', Fe: '#d8701f', Cu: '#c8803a', Zn: '#7d80b0', Na: '#8a4fe0', K: '#8a4fe0', Li: '#c070f0', Mg: '#4fb04f', Ca: '#4fb04f', Se: '#f0a020', Pt: '#c0c0d0', Pd: '#a0b8c0', Au: '#f0c020', Ni: '#5fb05f', Co: '#e090a0' };
export const atomColor = (el: string) => COLORS[el] ?? '#d07aa8';

function element(sym: string, line: number): { el: string; z: number } {
  let s = sym.trim();
  if (/^\d+$/.test(s)) { const e = ELEMENTS[Number(s) - 1]; if (!e) throw new MolError(`Line ${line}: atomic number ${s} does not exist.`); return { el: e.symbol, z: e.z }; }
  s = s.replace(/[^A-Za-z].*$/, '');           // "C1", "H12" → "C", "H"
  s = s.slice(0, 2);
  const tries = [s[0]?.toUpperCase() + (s[1]?.toLowerCase() ?? ''), s[0]?.toUpperCase()];
  for (const t of tries) { const e = t && BY_SYMBOL.get(t); if (e) return { el: e.symbol, z: e.z }; }
  if (s === 'D' || s === 'T') return { el: 'H', z: 1 };
  throw new MolError(`Line ${line}: "${sym.trim()}" is not an element symbol.`);
}

/** Read an XYZ file: one or more frames of "count, comment, then one line per atom: symbol x y z". */
export function parseXyz(text: string): Molecule[] {
  const L = text.replace(/\r/g, '').split('\n');
  const out: Molecule[] = [];
  let i = 0;
  while (i < L.length) {
    if (!L[i].trim()) { i++; continue; }
    const n = Number(L[i].trim());
    if (!Number.isInteger(n) || n < 1) throw new MolError(`Line ${i + 1}: an XYZ frame starts with the number of atoms, but this line is "${L[i].trim().slice(0, 40)}".`);
    const title = L[i + 1] ?? '';
    const atoms: MAtom[] = [];
    for (let k = 0; k < n; k++) {
      const ln = i + 2 + k, t = (L[ln] ?? '').trim().split(/\s+/);
      if (t.length < 4 || t[0] === '') throw new MolError(`Line ${ln + 1}: expected atom ${k + 1} of ${n} (symbol x y z), found ${L[ln] === undefined ? 'the end of the file' : `"${L[ln].trim().slice(0, 40)}"`}.`);
      const [x, y, z] = [t[1], t[2], t[3]].map((v) => Number(v.replace(/[dD]/, 'e')));
      if (![x, y, z].every(Number.isFinite)) throw new MolError(`Line ${ln + 1}: the coordinates "${t.slice(1, 4).join(' ')}" are not numbers.`);
      const e = element(t[0], ln + 1);
      atoms.push({ ...e, x, y, zc: z, charge: 0 });
    }
    out.push({ title: title.trim(), atoms, bonds: guessBonds(atoms), bondsFromFile: false, format: 'XYZ', props: [] });
    i += 2 + n;
  }
  if (!out.length) throw new MolError('The file is empty.');
  return out;
}

/** Read one MOL block (V2000). */
export function parseMol(text: string, format: 'MOL' | 'SDF' = 'MOL', startLine = 0): Molecule {
  const L = text.replace(/\r/g, '').split('\n');
  if (L.length < 4) throw new MolError(`Line ${startLine + 1}: a MOL record needs a three-line header and a counts line.`);
  const counts = L[3];
  if (/V3000/.test(counts)) throw new MolError(`Line ${startLine + 4}: this is a V3000 MOL file. Save it as V2000 (most programs offer it), or as XYZ.`);
  const na = Number(counts.slice(0, 3)), nb = Number(counts.slice(3, 6));
  if (!Number.isInteger(na) || !Number.isInteger(nb) || na < 1) throw new MolError(`Line ${startLine + 4}: the counts line "${counts.trim().slice(0, 40)}" does not give the number of atoms and bonds.`);
  const atoms: MAtom[] = [], bonds: MBond[] = [];
  const CHG: Record<number, number> = { 1: 3, 2: 2, 3: 1, 5: -1, 6: -2, 7: -3 };
  for (let k = 0; k < na; k++) {
    const l = L[4 + k];
    if (l === undefined) throw new MolError(`Line ${startLine + 5 + k}: the file ends before atom ${k + 1} of ${na}.`);
    const x = Number(l.slice(0, 10)), y = Number(l.slice(10, 20)), z = Number(l.slice(20, 30));
    if (![x, y, z].every(Number.isFinite) || !l.slice(30, 34).trim()) throw new MolError(`Line ${startLine + 5 + k}: atom ${k + 1} is not in the V2000 column layout.`);
    const e = element(l.slice(31, 34), startLine + 5 + k);
    atoms.push({ ...e, x, y, zc: z, charge: CHG[Number(l.slice(36, 39))] ?? 0 });
  }
  for (let k = 0; k < nb; k++) {
    const l = L[4 + na + k];
    if (l === undefined) throw new MolError(`Line ${startLine + 5 + na + k}: the file ends before bond ${k + 1} of ${nb}.`);
    const a = Number(l.slice(0, 3)) - 1, b = Number(l.slice(3, 6)) - 1, order = Number(l.slice(6, 9));
    if (!(a >= 0 && a < na && b >= 0 && b < na) || !(order >= 1 && order <= 8)) throw new MolError(`Line ${startLine + 5 + na + k}: bond ${k + 1} joins atoms that do not exist, or has an unknown type.`);
    bonds.push({ a, b, order: order <= 4 ? order : 1 });
  }
  // Properties block: M  CHG overrides the atom-line charges.
  let i = 4 + na + nb, sawChg = false;
  for (; i < L.length; i++) {
    const l = L[i];
    if (l.startsWith('M  END')) { i++; break; }
    if (l.startsWith('M  CHG')) {
      if (!sawChg) { for (const a of atoms) a.charge = 0; sawChg = true; }
      const t = l.slice(6).trim().split(/\s+/).map(Number);
      for (let k = 1; k + 1 < t.length; k += 2) if (atoms[t[k] - 1]) atoms[t[k] - 1].charge = t[k + 1];
    }
    if (l.startsWith('M  ISO')) {
      const t = l.slice(6).trim().split(/\s+/).map(Number);
      for (let k = 1; k + 1 < t.length; k += 2) if (atoms[t[k] - 1]) atoms[t[k] - 1].iso = t[k + 1];
    }
  }
  // SD data fields: "> <NAME>" then value lines up to a blank line.
  const props: [string, string][] = [];
  for (; i < L.length; i++) {
    const m = /^>.*<([^>]+)>/.exec(L[i]);
    if (!m) continue;
    const v: string[] = [];
    for (i++; i < L.length && L[i].trim() !== ''; i++) v.push(L[i]);
    props.push([m[1], v.join(' ').trim()]);
  }
  const title = L[0].trim() || (props.find(([k]) => /name|title|id/i.test(k))?.[1] ?? '');
  const noBonds = nb === 0 && na > 1;
  return { title, atoms, bonds: noBonds ? guessBonds(atoms) : bonds, bondsFromFile: !noBonds, format, props };
}

/** Read an SDF: MOL records separated by $$$$ lines. */
export function parseSdf(text: string): Molecule[] {
  const L = text.replace(/\r/g, '').split('\n');
  const out: Molecule[] = [];
  let start = 0;
  for (let i = 0; i <= L.length; i++) {
    if (i === L.length || L[i].trim() === '$$$$') {
      const block = L.slice(start, i);
      if (block.some((l) => l.trim())) out.push(parseMol(block.join('\n'), 'SDF', start));
      start = i + 1;
    }
  }
  if (!out.length) throw new MolError('The file is empty.');
  return out;
}

/** Guess the format from the name and the text, and read every molecule in it. */
export function parseAny(text: string, name = ''): Molecule[] {
  const ext = name.toLowerCase().split('.').pop() ?? '';
  const L = text.replace(/\r/g, '').split('\n');
  if (ext === 'xyz') return parseXyz(text);
  if (ext === 'sdf' || ext === 'sd') return parseSdf(text);
  if (ext === 'mol' || ext === 'mdl') return [parseMol(text)];
  if (/^(ATOM|HETATM|HEADER)/m.test(text) && !/V[23]000/.test(L[3] ?? '')) throw new MolError('This looks like a PDB file. For proteins and other PDB or mmCIF files, use the PDB structure viewer.');
  if (/V[23]000/.test(L[3] ?? '')) return text.includes('$$$$') ? parseSdf(text) : [parseMol(text)];
  if (/^\s*\d+\s*$/.test(L.find((l) => l.trim()) ?? '')) return parseXyz(text);
  throw new MolError('This does not look like an XYZ, MOL or SDF file. XYZ files start with the number of atoms; MOL files have V2000 on their fourth line.');
}

/** Bonds from distances: closer than the two radii added up plus the tolerance (and farther than 0.4 Å). */
export function guessBonds(atoms: MAtom[], tol = TOLERANCE): MBond[] {
  const out: MBond[] = [];
  const cell = 3.2, grid = new Map<string, number[]>();
  const key = (x: number, y: number, z: number) => `${Math.floor(x / cell)},${Math.floor(y / cell)},${Math.floor(z / cell)}`;
  atoms.forEach((a, i) => { const k = key(a.x, a.y, a.zc); const g = grid.get(k); if (g) g.push(i); else grid.set(k, [i]); });
  atoms.forEach((a, i) => {
    const gx = Math.floor(a.x / cell), gy = Math.floor(a.y / cell), gz = Math.floor(a.zc / cell);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
      for (const j of grid.get(`${gx + dx},${gy + dy},${gz + dz}`) ?? []) {
        if (j <= i) continue;
        const d = distance(a, atoms[j]);
        if (d > 0.4 && d <= radius(a.el) + radius(atoms[j].el) + tol) out.push({ a: i, b: j, order: 1 });
      }
    }
  });
  return out.sort((p, q) => p.a - q.a || p.b - q.b);
}

type P = { x: number; y: number; zc: number };
const sub = (a: P, b: P) => [a.x - b.x, a.y - b.y, a.zc - b.zc];
const dot = (u: number[], v: number[]) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
const cross = (u: number[], v: number[]) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
const norm = (u: number[]) => Math.hypot(u[0], u[1], u[2]);

export const distance = (a: P, b: P) => Math.hypot(a.x - b.x, a.y - b.y, a.zc - b.zc);
/** Angle a–b–c in degrees. */
export function angle(a: P, b: P, c: P): number {
  const u = sub(a, b), v = sub(c, b);
  return (Math.atan2(norm(cross(u, v)), dot(u, v)) * 180) / Math.PI;
}
/** Dihedral a–b–c–d in degrees, −180 to 180 (IUPAC sign: clockwise looking along b→c is positive). */
export function dihedral(a: P, b: P, c: P, d: P): number {
  const b1 = sub(b, a), b2 = sub(c, b), b3 = sub(d, c);
  return (Math.atan2(norm(b2) * dot(b1, cross(b2, b3)), dot(cross(b1, b2), cross(b2, b3))) * 180) / Math.PI;
}

/** Hill formula (charge given separately), molar mass (g/mol) from standard atomic weights, centre of mass and centroid (Å). */
export function summary(m: Molecule) {
  const c = new Map<string, number>();
  let M = 0, cx = 0, cy = 0, cz = 0, gx = 0, gy = 0, gz = 0, q = 0;
  for (const a of m.atoms) {
    c.set(a.el, (c.get(a.el) ?? 0) + 1);
    const e = ELEMENTS[a.z - 1], w = a.iso ? (e.isotopes.find((i) => i.a === a.iso)?.mass ?? a.iso) : e.weight;
    M += w; cx += w * a.x; cy += w * a.y; cz += w * a.zc; gx += a.x; gy += a.y; gz += a.zc; q += a.charge;
  }
  const hasC = c.has('C');
  const keys = [...c.keys()].sort((a, b) => (hasC ? (a === 'C' ? -1 : b === 'C' ? 1 : a === 'H' ? -1 : b === 'H' ? 1 : 0) : 0) || (a < b ? -1 : a > b ? 1 : 0));
  const formula = keys.map((k) => k + (c.get(k)! > 1 ? c.get(k) : '')).join('');
  const n = m.atoms.length;
  return { formula, mass: M, com: { x: cx / M, y: cy / M, zc: cz / M }, centroid: { x: gx / n, y: gy / n, zc: gz / n }, charge: q };
}

/** XYZ text. */
export function toXyz(m: Molecule, comment = m.title): string {
  return `${m.atoms.length}\n${comment.replace(/\n/g, ' ')}\n` + m.atoms.map((a) => `${a.el.padEnd(2)} ${a.x.toFixed(6).padStart(12)} ${a.y.toFixed(6).padStart(12)} ${a.zc.toFixed(6).padStart(12)}`).join('\n') + '\n';
}

// ---------- rotation (3×3 matrices, row-major) ----------
export type Mat = number[];
export const IDENTITY: Mat = [1, 0, 0, 0, 1, 0, 0, 0, 1];
export const mul = (a: Mat, b: Mat): Mat => [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c]));
export const rotX = (t: number): Mat => [1, 0, 0, 0, Math.cos(t), -Math.sin(t), 0, Math.sin(t), Math.cos(t)];
export const rotY = (t: number): Mat => [Math.cos(t), 0, Math.sin(t), 0, 1, 0, -Math.sin(t), 0, Math.cos(t)];
export const apply = (m: Mat, v: number[]) => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];

/** Principal axes of the atom positions (unit masses), for a starting view with the longest side across: returns a
 *  rotation that puts the largest spread along x and the smallest along z (towards the viewer). */
export function startView(m: Molecule): Mat {
  const n = m.atoms.length; if (n < 2) return IDENTITY;
  const c = summary(m).centroid;
  const C = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const a of m.atoms) { const v = [a.x - c.x, a.y - c.y, a.zc - c.zc]; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) C[i * 3 + j] += v[i] * v[j]; }
  // Jacobi eigen-decomposition of the 3×3 covariance.
  const A = [...C], V = [...IDENTITY];
  for (let sweep = 0; sweep < 30; sweep++) {
    for (const [p, q] of [[0, 1], [0, 2], [1, 2]]) {
      const apq = A[p * 3 + q]; if (Math.abs(apq) < 1e-12) continue;
      const th = (A[q * 3 + q] - A[p * 3 + p]) / (2 * apq), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
      const cs = 1 / Math.sqrt(t * t + 1), sn = t * cs;
      for (let k = 0; k < 3; k++) { const akp = A[k * 3 + p], akq = A[k * 3 + q]; A[k * 3 + p] = cs * akp - sn * akq; A[k * 3 + q] = sn * akp + cs * akq; }
      for (let k = 0; k < 3; k++) { const apk = A[p * 3 + k], aqk = A[q * 3 + k]; A[p * 3 + k] = cs * apk - sn * aqk; A[q * 3 + k] = sn * apk + cs * aqk; }
      for (let k = 0; k < 3; k++) { const vkp = V[k * 3 + p], vkq = V[k * 3 + q]; V[k * 3 + p] = cs * vkp - sn * vkq; V[k * 3 + q] = sn * vkp + cs * vkq; }
    }
  }
  const ev = [0, 1, 2].map((i) => ({ val: A[i * 4], vec: [V[i], V[3 + i], V[6 + i]] })).sort((a, b) => b.val - a.val);
  const r0 = ev[0].vec, r1 = ev[1].vec, r2 = cross(r0, r1);
  return [...r0, ...r1, ...r2];
}
