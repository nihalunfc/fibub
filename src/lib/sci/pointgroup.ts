// Molecular point groups: find the point group of a molecule from its 3D coordinates (XYZ), by testing rotation
// axes, mirror planes, inversion and improper axes, then following the usual flowchart. Also the flowchart on its
// own (answers to yes/no questions), group orders and what a group says about chirality and a dipole moment.
import { BY_SYMBOL } from './chem.ts';

export type Vec = [number, number, number];
export type Atom = { el: string; p: Vec };

const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: Vec, k: number): Vec => [a[0] * k, a[1] * k, a[2] * k];
const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: Vec) => Math.hypot(a[0], a[1], a[2]);
const unit = (a: Vec): Vec | null => { const n = norm(a); return n > 1e-6 ? mul(a, 1 / n) : null; };

/** Rotate v about the unit axis u by angle t (Rodrigues). */
export function rotate(v: Vec, u: Vec, t: number): Vec {
  const c = Math.cos(t), s = Math.sin(t);
  return add(add(mul(v, c), mul(cross(u, v), s)), mul(u, dot(u, v) * (1 - c)));
}
export const reflect = (v: Vec, n: Vec): Vec => sub(v, mul(n, 2 * dot(v, n)));

/** Read XYZ text: lines "El x y z" (the usual first two lines of an .xyz file are skipped automatically). */
export function parseXYZ(text: string): { atoms: Atom[]; bad: string[] } {
  const atoms: Atom[] = [], bad: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const t = raw.trim(); if (!t) continue;
    const f = t.split(/[\s,;]+/);
    if (f.length >= 4) {
      const el = f[0].replace(/[^A-Za-z]/g, ''), sym = el ? el[0].toUpperCase() + el.slice(1).toLowerCase() : '';
      const xyz = f.slice(1, 4).map(Number);
      if (BY_SYMBOL.has(sym) && xyz.every(Number.isFinite)) { atoms.push({ el: sym, p: xyz as Vec }); continue; }
    }
    if (!/^\d+$/.test(t) && atoms.length) bad.push(t); // a lone count line or the comment line before atoms is fine
  }
  return { atoms, bad };
}

/** Atoms moved so the centre of mass is at the origin. */
export function centre(atoms: Atom[]): Atom[] {
  let m = 0, c: Vec = [0, 0, 0];
  for (const a of atoms) { const w = BY_SYMBOL.get(a.el)!.weight; m += w; c = add(c, mul(a.p, w)); }
  c = mul(c, 1 / m);
  return atoms.map((a) => ({ el: a.el, p: sub(a.p, c) }));
}

/** Principal moments and axes of inertia (Jacobi rotation of the 3 × 3 tensor). */
export function inertia(atoms: Atom[]) {
  const I = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const a of atoms) {
    const w = BY_SYMBOL.get(a.el)!.weight, [x, y, z] = a.p;
    I[0][0] += w * (y * y + z * z); I[1][1] += w * (x * x + z * z); I[2][2] += w * (x * x + y * y);
    I[0][1] -= w * x * y; I[0][2] -= w * x * z; I[1][2] -= w * y * z;
  }
  I[1][0] = I[0][1]; I[2][0] = I[0][2]; I[2][1] = I[1][2];
  const V = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], A = I.map((r) => [...r]);
  for (let sweep = 0; sweep < 50; sweep++) {
    let off = 0; for (let p = 0; p < 3; p++) for (let q = p + 1; q < 3; q++) off += A[p][q] ** 2;
    if (off < 1e-22) break;
    for (let p = 0; p < 3; p++) for (let q = p + 1; q < 3; q++) {
      if (Math.abs(A[p][q]) < 1e-30) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < 3; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < 3; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < 3; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  const out = [0, 1, 2].map((i) => ({ m: A[i][i], axis: [V[0][i], V[1][i], V[2][i]] as Vec })).sort((a, b) => a.m - b.m);
  return out;
}

/** Does the operation f map every atom onto an atom of the same element, within tol (Å)? */
function isSym(atoms: Atom[], f: (v: Vec) => Vec, tol: number) {
  return atoms.every((a) => { const q = f(a.p); return atoms.some((b) => b.el === a.el && Math.abs(b.p[0] - q[0]) <= tol && Math.abs(b.p[1] - q[1]) <= tol && Math.abs(b.p[2] - q[2]) <= tol && norm(sub(b.p, q)) <= tol); });
}
const Cn = (atoms: Atom[], u: Vec, n: number, tol: number) => isSym(atoms, (v) => rotate(v, u, (2 * Math.PI) / n), tol);
const Sn = (atoms: Atom[], u: Vec, n: number, tol: number) => isSym(atoms, (v) => reflect(rotate(v, u, (2 * Math.PI) / n), u), tol);
const mirror = (atoms: Atom[], nrm: Vec, tol: number) => isSym(atoms, (v) => reflect(v, nrm), tol);
const inv = (atoms: Atom[], tol: number) => isSym(atoms, (v) => mul(v, -1), tol);

/** Unique directions (a and −a counted once). */
function uniqueDirs(vs: (Vec | null)[], same = 0.999) {
  const out: Vec[] = [];
  for (const v of vs) { if (!v) continue; if (!out.some((o) => Math.abs(dot(o, v)) > same)) out.push(v); }
  return out;
}

export type Result = { group: string; linear: boolean; top: string; elements: string[]; mainAxis?: Vec; order: number | null };

/** The point group of a molecule from its coordinates (Å). tol is how far an atom may sit from a perfect position. */
export function findPointGroup(input: Atom[], tol = 0.1): Result {
  const atoms = centre(input);
  if (atoms.length === 1) return { group: 'Kh', linear: false, top: 'single atom', elements: ['every rotation and reflection (a single atom)'], order: null };
  const mo = inertia(atoms), big = Math.max(mo[2].m, 1e-9);
  // Linear: every atom on the axis of the smallest moment.
  if (atoms.every((a) => norm(cross(a.p, mo[0].axis)) < tol)) {
    const g = inv(atoms, tol) ? 'D∞h' : 'C∞v';
    return { group: g, linear: true, top: 'linear', elements: g === 'D∞h' ? ['C∞ axis', 'σh', 'i', '∞ C₂', '∞ σv'] : ['C∞ axis', '∞ σv'], mainAxis: mo[0].axis, order: null };
  }
  const near = (a: number, b: number) => Math.abs(a - b) / big < 0.05;
  const top = near(mo[0].m, mo[2].m) ? 'spherical top' : near(mo[0].m, mo[1].m) || near(mo[1].m, mo[2].m) ? 'symmetric top' : 'asymmetric top';
  const pts = atoms.map((a) => a.p);
  const mids: Vec[] = []; for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) if (atoms[i].el === atoms[j].el) mids.push(mul(add(pts[i], pts[j]), 0.5));
  const hasI = inv(atoms, tol);
  // Candidate axes: principal axes, atoms, midpoints of like pairs, and (for near-cubic molecules) centroids of like triples.
  const extra: Vec[] = [];
  if (top === 'spherical top') {
    const shells = new Map<string, Vec[]>();
    for (let i = 0; i < atoms.length; i++) { const r = norm(pts[i]); if (r < tol) continue; const k = `${atoms[i].el}:${Math.round(r / Math.max(2 * tol, 0.05))}`; (shells.get(k) ?? shells.set(k, []).get(k)!).push(pts[i]); }
    for (const sh of shells.values()) { const t = sh.slice(0, 24); for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) for (let k = j + 1; k < t.length; k++) extra.push(mul(add(add(t[i], t[j]), t[k]), 1 / 3)); }
  }
  const dirs = uniqueDirs([...mo.map((m) => m.axis), ...pts, ...mids, ...extra].map(unit));
  const orderAt = (d: Vec) => { for (let k = 6; k >= 2; k--) if (Cn(atoms, d, k, tol)) return k; return 1; };
  // Axes found from slightly different atoms can point a degree or two apart: merge them, keeping the higher order.
  const axes: { d: Vec; n: number }[] = [];
  for (const a of dirs.map((d) => ({ d, n: orderAt(d) })).filter((a) => a.n > 1).sort((p, q) => q.n - p.n)) if (!axes.some((b) => Math.abs(dot(a.d, b.d)) > 0.98)) axes.push(a);
  const count = (n: number) => axes.filter((a) => a.n === n || (n === 2 && (a.n === 4 || a.n === 6)) || (n === 3 && a.n === 6)).length;
  if (count(5) >= 2) return { group: hasI ? 'Ih' : 'I', linear: false, top, elements: hasI ? ['6 C₅', '10 C₃', '15 C₂', 'i', '15 σ'] : ['6 C₅', '10 C₃', '15 C₂'], order: hasI ? 120 : 60 };
  if (count(4) >= 2) return { group: hasI ? 'Oh' : 'O', linear: false, top, elements: hasI ? ['3 C₄', '4 C₃', '6 C₂', 'i', '9 σ'] : ['3 C₄', '4 C₃', '6 C₂'], order: hasI ? 48 : 24 };
  if (count(3) >= 2) {
    if (hasI) return { group: 'Th', linear: false, top, elements: ['4 C₃', '3 C₂', 'i', '3 σh'], order: 24 };
    const td = axes.filter((a) => a.n === 2).some((a) => Sn(atoms, a.d, 4, tol));
    return { group: td ? 'Td' : 'T', linear: false, top, elements: td ? ['4 C₃', '3 C₂', '3 S₄', '6 σd'] : ['4 C₃', '3 C₂'], order: td ? 24 : 12 };
  }
  if (axes.length) {
    const nmax = Math.max(...axes.map((a) => a.n)), main = axes.filter((a) => a.n === nmax);
    // With several axes of the top order (D₂ family), prefer a principal axis so the answer does not depend on input order.
    const pick = main.find((a) => mo.some((m) => Math.abs(Math.abs(dot(m.axis, a.d)) - 1) < 1e-3)) ?? main[0];
    return axial(atoms, pts, mids, pick.d, nmax, hasI, tol, top);
  }
  const normals = uniqueDirs([...mo.map((m) => m.axis), ...pts.flatMap((p, i) => pts.slice(i + 1).map((q, k) => (atoms[i].el === atoms[i + 1 + k].el ? unit(sub(p, q)) : null)))]);
  if (normals.some((nn) => mirror(atoms, nn, tol))) return { group: 'Cs', linear: false, top, elements: ['σ'], order: 2 };
  if (hasI) return { group: 'Ci', linear: false, top, elements: ['i'], order: 2 };
  return { group: 'C1', linear: false, top, elements: ['E only'], order: 1 };
}

function axial(atoms: Atom[], pts: Vec[], mids: Vec[], u: Vec, n: number, hasI: boolean, tol: number, top: string): Result {
  const perp = (v: Vec) => unit(sub(v, mul(u, dot(v, u))));
  const cand = uniqueDirs([...pts, ...mids].map(perp));
  // Bisectors between neighbouring candidates also host C₂ axes (e.g. staggered ethane).
  const more: (Vec | null)[] = []; for (let i = 0; i < cand.length; i++) for (let j = i + 1; j < Math.min(cand.length, 40); j++) { more.push(unit(add(cand[i], cand[j]))); more.push(unit(sub(cand[i], cand[j]))); }
  const dirs = uniqueDirs([...cand, ...more, ...cand.map((d) => unit(cross(u, d)))]);
  const c2perp = uniqueDirs(dirs.filter((d) => Cn(atoms, d, 2, tol)), 0.98);
  const sh = mirror(atoms, u, tol);
  const sv = dirs.map((d) => unit(cross(u, d))).filter((nn): nn is Vec => !!nn && mirror(atoms, nn, tol));
  const nsv = uniqueDirs(sv, 0.98).length;
  const els = [`C${sub_(n)} main axis`];
  if (c2perp.length >= n) {
    const g = sh ? `D${n}h` : nsv ? `D${n}d` : `D${n}`;
    els.push(`${n} C₂ ⟂ main axis`); if (sh) els.push('σh'); if (nsv) els.push(`${nsv} vertical mirror plane${nsv > 1 ? 's' : ''} (σ${sh ? 'v' : 'd'})`); if (hasI) els.push('i');
    if (!sh && nsv) els.push(`S${sub_(2 * n)}`);
    return { group: g, linear: false, top, elements: els, mainAxis: u, order: orderOf(g) };
  }
  if (sh) { els.push('σh'); if (hasI) els.push('i'); return { group: `C${n}h`, linear: false, top, elements: els, mainAxis: u, order: 2 * n }; }
  if (nsv) { els.push(`${nsv} vertical mirror plane${nsv > 1 ? 's' : ''} (σv)`); return { group: `C${n}v`, linear: false, top, elements: els, mainAxis: u, order: 2 * n }; }
  if (Sn(atoms, u, 2 * n, tol)) { els.push(`S${sub_(2 * n)}`); if (hasI) els.push('i'); return { group: `S${2 * n}`, linear: false, top, elements: els, mainAxis: u, order: 2 * n }; }
  return { group: `C${n}`, linear: false, top, elements: els, mainAxis: u, order: n };
}

const SUBS = '₀₁₂₃₄₅₆₇₈₉';
export const sub_ = (n: number) => String(n).split('').map((d) => SUBS[+d]).join('');
/** The group name with subscripts, e.g. "D3h" → "D₃h". */
export const pretty = (g: string) => g.replace(/^([A-Z])(\d+|∞)?/, (_, a, d) => a + (d === undefined ? '' : d === '∞' ? '∞' : sub_(+d)));

/** Order of a point group (number of operations), or null for the infinite groups. */
export function orderOf(g: string): number | null {
  const m = g.match(/^([CDS])(\d+)([hvd]?)$/);
  if (m) { const n = +m[2]; if (m[1] === 'S') return n; if (m[1] === 'C') return m[3] ? 2 * n : n; return m[3] ? 4 * n : 2 * n; }
  return ({ C1: 1, Cs: 2, Ci: 2, T: 12, Td: 24, Th: 24, O: 24, Oh: 48, I: 60, Ih: 120 } as Record<string, number>)[g] ?? null;
}
/** Chiral: no improper operation (no mirror, no inversion, no Sn). */
export const isChiral = (g: string) => /^(C\d+|D\d+|C1|T|O|I)$/.test(g);
/** A permanent dipole is allowed only in C1, Cs, Cn and Cnv (and C∞v). */
export const isPolar = (g: string) => /^(C1|Cs|C\d+|C\d+v|C∞v)$/.test(g);

/** The flowchart from answers. */
export function flowchart(a: { linear: boolean; inversion: boolean; cubic: 'none' | 'T' | 'O' | 'I'; n: number; perpC2: boolean; sigmaH: boolean; sigmaV: boolean; s2n: boolean; mirror: boolean }) {
  if (a.linear) return a.inversion ? 'D∞h' : 'C∞v';
  if (a.cubic === 'I') return a.inversion ? 'Ih' : 'I';
  if (a.cubic === 'O') return a.inversion ? 'Oh' : 'O';
  if (a.cubic === 'T') return a.inversion ? 'Th' : a.mirror ? 'Td' : 'T';
  const n = a.n;
  if (n < 2) return a.mirror ? 'Cs' : a.inversion ? 'Ci' : 'C1';
  if (a.perpC2) return a.sigmaH ? `D${n}h` : a.sigmaV ? `D${n}d` : `D${n}`;
  if (a.sigmaH) return `C${n}h`;
  if (a.sigmaV) return `C${n}v`;
  if (a.s2n) return `S${2 * n}`;
  return `C${n}`;
}

// ---- Example molecules with idealised geometries, built here from typical bond lengths (Å) and angles. ----
const ring = (n: number, r: number, z = 0, phase = 0): Vec[] => Array.from({ length: n }, (_, k) => [r * Math.cos(phase + (2 * Math.PI * k) / n), r * Math.sin(phase + (2 * Math.PI * k) / n), z]);
const at = (el: string, p: Vec): Atom => ({ el, p });
const many = (el: string, ps: Vec[]) => ps.map((p) => at(el, p));
const tetra = (r: number): Vec[] => [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map((v) => mul(v as Vec, r / Math.sqrt(3)));
const PHI = (1 + Math.sqrt(5)) / 2;
const ico = (r: number): Vec[] => { const v: Vec[] = []; for (const a of [1, -1]) for (const b of [1, -1]) { v.push([0, a, b * PHI], [a, b * PHI, 0], [b * PHI, 0, a]); } return v.map((p) => mul(p, r / Math.hypot(1, PHI))); };
const bent = (r: number, ang: number): Vec[] => { const h = (ang * Math.PI) / 360; return [[r * Math.sin(h), r * Math.cos(h), 0], [-r * Math.sin(h), r * Math.cos(h), 0]]; };
const pyramid = (n: number, r: number, ang: number): Vec[] => { const t = (ang * Math.PI) / 180; return ring(n, r * Math.sin(t), -r * Math.cos(t)); };

function ethane(staggered: boolean): Atom[] {
  const c = 0.765, h = pyramid(3, 1.09, 180 - 111.2);
  return [at('C', [0, 0, c]), at('C', [0, 0, -c]), ...h.map((p) => at('H', [p[0], p[1], c - p[2]])), ...ring(3, Math.hypot(h[0][0], h[0][1]), 0, staggered ? Math.PI / 3 : 0).map((p) => at('H', [p[0], p[1], -c + h[0][2]]))];
}
function chair(): Atom[] {
  const out: Atom[] = [];
  for (let k = 0; k < 6; k++) {
    const t = (k * Math.PI) / 3, s = k % 2 ? 1 : -1, r = 1.45, z = 0.25 * s;
    out.push(at('C', [r * Math.cos(t), r * Math.sin(t), z]), at('H', [r * Math.cos(t), r * Math.sin(t), z + 1.09 * s]), at('H', [(r + 1.03) * Math.cos(t), (r + 1.03) * Math.sin(t), z - 0.36 * s]));
  }
  return out;
}

export const EXAMPLES: { id: string; name: string; group: string; atoms: () => Atom[] }[] = [
  { id: 'h2o', name: 'Water, H₂O', group: 'C2v', atoms: () => [at('O', [0, 0, 0]), ...many('H', bent(0.958, 104.5))] },
  { id: 'nh3', name: 'Ammonia, NH₃', group: 'C3v', atoms: () => [at('N', [0, 0, 0]), ...many('H', pyramid(3, 1.012, 112))] },
  { id: 'ch4', name: 'Methane, CH₄', group: 'Td', atoms: () => [at('C', [0, 0, 0]), ...many('H', tetra(1.09))] },
  { id: 'ch3cl', name: 'Chloromethane, CH₃Cl', group: 'C3v', atoms: () => [at('C', [0, 0, 0]), at('Cl', [0, 0, 1.78]), ...many('H', pyramid(3, 1.09, 180 - 108.5))] },
  { id: 'ch2cl2', name: 'Dichloromethane, CH₂Cl₂', group: 'C2v', atoms: () => [at('C', [0, 0, 0]), ...many('Cl', bent(1.77, 112)), ...bent(1.09, 112).map((p) => at('H', [0, -p[1], p[0]]))] },
  { id: 'chfclbr', name: 'Bromochlorofluoromethane, CHFClBr', group: 'C1', atoms: () => { const t = tetra(1); return [at('C', [0, 0, 0]), at('H', mul(t[0], 1.09)), at('F', mul(t[1], 1.35)), at('Cl', mul(t[2], 1.77)), at('Br', mul(t[3], 1.93))]; } },
  { id: 'hocl', name: 'Hypochlorous acid, HOCl', group: 'Cs', atoms: () => [at('O', [0, 0, 0]), at('Cl', [1.69, 0, 0]), at('H', [-0.25, 0.94, 0])] },
  { id: 'h2o2', name: 'Hydrogen peroxide, H₂O₂', group: 'C2', atoms: () => { const a = (94.8 * Math.PI) / 180, f = (111.5 * Math.PI) / 360; const h = (s: number): Vec => [s * (0.7375 - 0.97 * Math.cos(a)), 0.97 * Math.sin(a) * Math.cos(f), s * 0.97 * Math.sin(a) * Math.sin(f)]; return [at('O', [0.7375, 0, 0]), at('O', [-0.7375, 0, 0]), at('H', h(1)), at('H', h(-1))]; } },
  { id: 'c2h4', name: 'Ethylene, C₂H₄', group: 'D2h', atoms: () => [at('C', [0.665, 0, 0]), at('C', [-0.665, 0, 0]), ...[[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([a, b]) => at('H', [a * 1.23, b * 0.92, 0]))] },
  { id: 'dce', name: 'trans-1,2-Dichloroethylene', group: 'C2h', atoms: () => [at('C', [0.665, 0, 0]), at('C', [-0.665, 0, 0]), at('Cl', [1.55, 1.45, 0]), at('Cl', [-1.55, -1.45, 0]), at('H', [1.2, -0.94, 0]), at('H', [-1.2, 0.94, 0])] },
  { id: 'allene', name: 'Allene, H₂C=C=CH₂', group: 'D2d', atoms: () => [at('C', [0, 0, 0]), at('C', [0, 0, 1.31]), at('C', [0, 0, -1.31]), at('H', [0.93, 0, 1.87]), at('H', [-0.93, 0, 1.87]), at('H', [0, 0.93, -1.87]), at('H', [0, -0.93, -1.87])] },
  { id: 'bf3', name: 'Boron trifluoride, BF₃', group: 'D3h', atoms: () => [at('B', [0, 0, 0]), ...many('F', ring(3, 1.31))] },
  { id: 'tcb', name: '1,3,5-Trichlorobenzene', group: 'D3h', atoms: () => { const c = ring(6, 1.39), o = ring(6, 1.39 + 1.0, 0); return [...many('C', c), ...o.map((p, k) => (k % 2 ? at('H', mul(p, (1.39 + 1.08) / (1.39 + 1.0))) : at('Cl', mul(p, (1.39 + 1.74) / (1.39 + 1.0)))))]; } },
  { id: 'pcl5', name: 'Phosphorus pentachloride, PCl₅', group: 'D3h', atoms: () => [at('P', [0, 0, 0]), ...many('Cl', ring(3, 2.02)), at('Cl', [0, 0, 2.14]), at('Cl', [0, 0, -2.14])] },
  { id: 'ethane-ecl', name: 'Ethane, eclipsed', group: 'D3h', atoms: () => ethane(false) },
  { id: 'ethane-stg', name: 'Ethane, staggered', group: 'D3d', atoms: () => ethane(true) },
  { id: 'chair', name: 'Cyclohexane, chair', group: 'D3d', atoms: chair },
  { id: 'xef4', name: 'Xenon tetrafluoride, XeF₄', group: 'D4h', atoms: () => [at('Xe', [0, 0, 0]), ...many('F', ring(4, 1.95))] },
  { id: 'c6h6', name: 'Benzene, C₆H₆', group: 'D6h', atoms: () => [...many('C', ring(6, 1.39)), ...many('H', ring(6, 2.47))] },
  { id: 'sf6', name: 'Sulfur hexafluoride, SF₆', group: 'Oh', atoms: () => [at('S', [0, 0, 0]), ...many('F', [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map((v) => mul(v as Vec, 1.56)))] },
  { id: 'b12', name: 'Dodecaborate ion, B₁₂H₁₂²⁻', group: 'Ih', atoms: () => [...many('B', ico(1.7)), ...many('H', ico(2.9))] },
  { id: 'co2', name: 'Carbon dioxide, CO₂', group: 'D∞h', atoms: () => [at('C', [0, 0, 0]), at('O', [0, 0, 1.16]), at('O', [0, 0, -1.16])] },
  { id: 'hcn', name: 'Hydrogen cyanide, HCN', group: 'C∞v', atoms: () => [at('H', [0, 0, -1.07]), at('C', [0, 0, 0]), at('N', [0, 0, 1.16])] },
];

/** XYZ text for a list of atoms. */
export const toXYZ = (atoms: Atom[], title = '') => `${atoms.length}\n${title}\n` + atoms.map((a) => `${a.el.padEnd(2)} ${a.p.map((x) => x.toFixed(4).padStart(9)).join(' ')}`).join('\n');
