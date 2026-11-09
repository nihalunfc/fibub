// Crystallographic Information Files (CIF): a small reader for the cell, symmetry operations and atom sites, the
// expansion of the asymmetric unit to the full cell, bond lengths with periodic images, composition, formula units
// and density. Plain TypeScript with no DOM; checked against gemmi in tests/sci-tools.
import { volume, cartesian, toCart, type Cell, type Mat3 } from './miller.ts';
import { BY_SYMBOL, AVOGADRO } from './chem.ts';

export type CifBlock = { name: string; items: Map<string, string>; loops: { tags: string[]; rows: string[][] }[] };

/** Split CIF text into tokens: bare words, quoted strings and semicolon text fields; comments dropped. */
export function tokens(text: string): { v: string; quoted: boolean }[] {
  const out: { v: string; quoted: boolean }[] = [];
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (line.startsWith(';')) {
      const buf = [line.slice(1)];
      li++;
      while (li < lines.length && !lines[li].startsWith(';')) buf.push(lines[li++]);
      out.push({ v: buf.join('\n').trim(), quoted: true });
      continue;
    }
    let i = 0;
    while (i < line.length) {
      const ch = line[i];
      if (ch === ' ' || ch === '\t') { i++; continue; }
      if (ch === '#') break;
      if (ch === "'" || ch === '"') {
        let j = i + 1;
        while (j < line.length && !(line[j] === ch && (j + 1 === line.length || /\s/.test(line[j + 1])))) j++;
        out.push({ v: line.slice(i + 1, j), quoted: true });
        i = j + 1; continue;
      }
      let j = i; while (j < line.length && !/\s/.test(line[j])) j++;
      out.push({ v: line.slice(i, j), quoted: false });
      i = j;
    }
  }
  return out;
}

/** Data blocks with their single items and loops (tags in lower case). */
export function parseCif(text: string): CifBlock[] {
  const t = tokens(text), blocks: CifBlock[] = [];
  let cur: CifBlock | null = null, i = 0;
  const isKey = (k: { v: string; quoted: boolean }) => !k.quoted && (k.v.startsWith('_') || /^(loop_|data_|save_|global_|stop_)/i.test(k.v));
  while (i < t.length) {
    const k = t[i];
    if (!k.quoted && /^data_/i.test(k.v)) { cur = { name: k.v.slice(5), items: new Map(), loops: [] }; blocks.push(cur); i++; continue; }
    if (!cur) { cur = { name: '', items: new Map(), loops: [] }; blocks.push(cur); }
    if (!k.quoted && /^loop_$/i.test(k.v)) {
      i++;
      const tags: string[] = [];
      while (i < t.length && !t[i].quoted && t[i].v.startsWith('_')) tags.push(t[i++].v.toLowerCase());
      const vals: string[] = [];
      while (i < t.length && !isKey(t[i])) vals.push(t[i++].v);
      const rows: string[][] = [];
      for (let r = 0; r + tags.length <= vals.length; r += tags.length) rows.push(vals.slice(r, r + tags.length));
      if (tags.length) cur.loops.push({ tags, rows });
      continue;
    }
    if (!k.quoted && k.v.startsWith('_')) {
      const v = t[i + 1];
      if (v && !isKey(v)) { cur.items.set(k.v.toLowerCase(), v.v); i += 2; } else { cur.items.set(k.v.toLowerCase(), '?'); i++; }
      continue;
    }
    i++;
  }
  return blocks;
}

/** A CIF number: "5.6402(5)" → 5.6402; "?" and "." → NaN. */
export function cifNum(s: string | undefined): number {
  if (s == null) return NaN;
  const m = s.trim().match(/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?/);
  return m ? Number(m[0]) : NaN;
}
/** The standard uncertainty in brackets, in the value's units: "5.6402(5)" → 0.0005. */
export function cifSu(s: string | undefined): number {
  const m = s?.trim().match(/^[-+]?(\d*)\.?(\d*)(?:[eE]([-+]?\d+))?\((\d+)\)/);
  if (!m) return NaN;
  return Number(m[4]) * 10 ** (-(m[2].length) + (m[3] ? Number(m[3]) : 0));
}

export type SymOp = { R: number[][]; t: number[]; text: string };
/** A symmetry operation such as "-x+1/2, y, z+1/2" or "x-y,x,1/2+z". Throws with a plain message if unreadable. */
export function parseOp(s: string): SymOp {
  const parts = s.replace(/\s+/g, '').toLowerCase().split(',');
  if (parts.length !== 3) throw new Error(`"${s}" is not a symmetry operation (three parts like x, y, z).`);
  const R = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], t = [0, 0, 0];
  parts.forEach((p, row) => {
    const re = /([+-]?)(\d*\.?\d*(?:\/\d+)?)(\*?)([xyz]?)/g;
    let m: RegExpExecArray | null, any = false, pos = 0;
    while ((m = re.exec(p)) && m[0] !== '') {
      if (m.index !== pos) throw new Error(`"${s}" is not a symmetry operation.`);
      pos = re.lastIndex; any = true;
      const sign = m[1] === '-' ? -1 : 1;
      let val = 1;
      if (m[2]) { const [a, b] = m[2].split('/'); val = b ? Number(a) / Number(b) : Number(a); if (!Number.isFinite(val)) throw new Error(`"${s}" is not a symmetry operation.`); }
      if (m[4]) R[row]['xyz'.indexOf(m[4])] += sign * val;
      else if (m[2]) t[row] += sign * val;
      else throw new Error(`"${s}" is not a symmetry operation.`);
    }
    if (!any || pos !== p.length) throw new Error(`"${s}" is not a symmetry operation.`);
  });
  return { R, t, text: s };
}
export const applyOp = (o: SymOp, f: number[]) => [0, 1, 2].map((i) => o.R[i][0] * f[0] + o.R[i][1] * f[1] + o.R[i][2] * f[2] + o.t[i]);
const wrap = (x: number) => { const w = x - Math.floor(x); return w > 1 - 1e-9 ? 0 : w; };

export type Site = { label: string; el: string; f: number[]; occ: number };
export type Structure = { name: string; cell: Cell; sg: string; sgNum: string; ops: SymOp[]; sites: Site[]; formulaSum: string; zGiven: number; warnings: string[]; su: Partial<Record<keyof Cell, number>> };

/** Element symbol from a type symbol or label: "Na1+" → Na, "CL2" → Cl, "O1" → O. */
export function elementOf(s: string): string {
  const m = s.match(/^([A-Za-z]{1,2})/);
  if (!m) return '';
  const two = m[1][0].toUpperCase() + (m[1][1] ?? '').toLowerCase(), one = m[1][0].toUpperCase();
  return m[1].length === 2 && BY_SYMBOL.has(two) ? two : BY_SYMBOL.has(one) ? one : '';
}

/** The first data block with a cell and atom sites, read into a structure. Throws with a plain message. */
export function readStructure(text: string): Structure {
  const blocks = parseCif(text);
  const b = blocks.find((x) => x.items.has('_cell_length_a') && x.loops.some((l) => l.tags.includes('_atom_site_fract_x')));
  if (!b) throw new Error(blocks.some((x) => x.items.size || x.loops.length) ? 'No data block in this file has both a cell (_cell_length_a …) and atom sites with fractional coordinates (_atom_site_fract_x …).' : 'This does not look like a CIF file.');
  const g = (k: string) => b.items.get(k);
  const cell: Cell = { a: cifNum(g('_cell_length_a')), b: cifNum(g('_cell_length_b')), c: cifNum(g('_cell_length_c')), alpha: cifNum(g('_cell_angle_alpha')), beta: cifNum(g('_cell_angle_beta')), gamma: cifNum(g('_cell_angle_gamma')) };
  const su: Structure['su'] = { a: cifSu(g('_cell_length_a')), b: cifSu(g('_cell_length_b')), c: cifSu(g('_cell_length_c')) };
  const warnings: string[] = [];
  (['alpha', 'beta', 'gamma'] as const).forEach((k) => { if (!Number.isFinite(cell[k])) { cell[k] = 90; warnings.push(`No ${k} angle given; 90° assumed.`); } });
  if (![cell.a, cell.b, cell.c].every((x) => x > 0)) throw new Error('The cell lengths (_cell_length_a, _b, _c) are missing or not numbers.');
  const opLoop = b.loops.find((l) => l.tags.some((t) => t === '_symmetry_equiv_pos_as_xyz' || t === '_space_group_symop_operation_xyz'));
  let ops: SymOp[] = [];
  if (opLoop) {
    const k = opLoop.tags.findIndex((t) => t === '_symmetry_equiv_pos_as_xyz' || t === '_space_group_symop_operation_xyz');
    ops = opLoop.rows.map((r) => parseOp(r[k]));
  } else {
    const one = g('_symmetry_equiv_pos_as_xyz') ?? g('_space_group_symop_operation_xyz');
    ops = [parseOp(one ?? 'x,y,z')];
    if (!one) warnings.push('The file lists no symmetry operations, so only the atoms as listed are shown (as if the space group were P1).');
  }
  const al = b.loops.find((l) => l.tags.includes('_atom_site_fract_x'))!;
  const col = (t: string) => al.tags.indexOf(t);
  const [cl, ct, cx, cy, cz, co] = ['_atom_site_label', '_atom_site_type_symbol', '_atom_site_fract_x', '_atom_site_fract_y', '_atom_site_fract_z', '_atom_site_occupancy'].map(col);
  const sites: Site[] = [];
  al.rows.forEach((r, i) => {
    const label = cl >= 0 ? r[cl] : `Atom${i + 1}`;
    const el = elementOf(ct >= 0 && r[ct] !== '?' && r[ct] !== '.' ? r[ct] : label);
    const f = [cifNum(r[cx]), cifNum(r[cy]), cifNum(r[cz])];
    if (!f.every(Number.isFinite)) { warnings.push(`Site ${label} has no fractional coordinates and is left out.`); return; }
    if (!el) { warnings.push(`Site ${label}: element not recognised; left out.`); return; }
    const occ = co >= 0 && Number.isFinite(cifNum(r[co])) ? cifNum(r[co]) : 1;
    sites.push({ label, el, f, occ });
  });
  if (!sites.length) throw new Error('No atom sites could be read.');
  return {
    name: g('_chemical_name_mineral') ?? g('_chemical_name_common') ?? g('_chemical_name_systematic') ?? b.name,
    cell, su, sg: g('_space_group_name_h-m_alt') ?? g('_symmetry_space_group_name_h-m') ?? '', sgNum: g('_space_group_it_number') ?? g('_symmetry_int_tables_number') ?? '',
    ops, sites, formulaSum: g('_chemical_formula_sum') ?? '', zGiven: cifNum(g('_cell_formula_units_z')), warnings,
  };
}

export type Atom = { label: string; el: string; f: number[]; occ: number; site: number };
/** Every atom in the cell: each site under each operation, wrapped into [0, 1), duplicates (within `tol` Å) merged. */
export function expand(s: Structure, tol = 0.01): Atom[] {
  const M = cartesian(s.cell), out: Atom[] = [];
  s.sites.forEach((site, si) => {
    const mine: Atom[] = [];
    for (const op of s.ops) {
      const f = applyOp(op, site.f).map(wrap);
      const dup = mine.some((a) => { const d = a.f.map((x, i) => { const v = x - f[i]; return v - Math.round(v); }); const c = toCart(M, d); return Math.hypot(...c) < tol; });
      if (!dup) mine.push({ label: site.label, el: site.el, f, occ: site.occ, site: si });
    }
    out.push(...mine);
  });
  return out;
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
/** Atoms of each element in the cell (occupancies added), in Hill order. */
export function cellCounts(atoms: Atom[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const a of atoms) m.set(a.el, (m.get(a.el) ?? 0) + a.occ);
  const keys = [...m.keys()].sort((x, y) => (m.has('C') ? (x === 'C' ? -1 : y === 'C' ? 1 : x === 'H' ? -1 : y === 'H' ? 1 : x.localeCompare(y)) : x.localeCompare(y)));
  return new Map(keys.map((k) => [k, m.get(k)!]));
}
/** "Cl Na", "Na1 Cl1", "Ti O2" as counts. */
export function parseFormulaSum(s: string): Map<string, number> | null {
  const m = new Map<string, number>();
  const re = /([A-Z][a-z]?)(\d*\.?\d*)/g;
  let x: RegExpExecArray | null;
  const t = s.replace(/\s+/g, ' ').trim();
  if (!t) return null;
  while ((x = re.exec(t))) { if (!BY_SYMBOL.has(x[1])) return null; m.set(x[1], (m.get(x[1]) ?? 0) + (x[2] ? Number(x[2]) : 1)); }
  return m.size ? m : null;
}

export type Summary = { volume: number; counts: Map<string, number>; formula: string; Z: number; zSource: string; mass: number; density: number };
/** Volume (Å³), composition of the cell, formula and Z, and density (g/cm³) from atomic weights. */
export function summary(s: Structure, atoms: Atom[]): Summary {
  const V = volume(s.cell), counts = cellCounts(atoms);
  const mass = [...counts].reduce((t, [el, n]) => t + n * (BY_SYMBOL.get(el)?.weight ?? NaN), 0);
  const density = mass / (AVOGADRO * V * 1e-24);
  const fs = parseFormulaSum(s.formulaSum);
  let Z = NaN, zSource = '', fu = new Map<string, number>();
  if (fs && [...counts.keys()].every((k) => fs.has(k))) {
    const zs = [...fs].map(([el, n]) => (counts.get(el) ?? 0) / n);
    if (zs.every((z) => Math.abs(z - zs[0]) < 0.02 * zs[0])) { Z = zs[0]; zSource = 'from the cell contents and _chemical_formula_sum'; fu = fs; }
  }
  if (!Number.isFinite(Z)) {
    const ints = [...counts.values()].map((n) => Math.round(n));
    if ([...counts.values()].every((n) => Math.abs(n - Math.round(n)) < 0.01)) {
      Z = ints.reduce((a, b) => gcd(a, b), 0);
      fu = new Map([...counts].map(([el, n]) => [el, Math.round(n) / Z]));
      zSource = 'from the cell contents (smallest whole-number formula)';
    } else { Z = 1; fu = counts; zSource = 'partial occupancies: the formula is the whole cell'; }
  }
  const fmt = (n: number) => (Math.abs(n - 1) < 1e-9 ? '' : Number.isInteger(+n.toFixed(6)) ? String(Math.round(n)) : String(+n.toFixed(3)));
  const formula = [...fu].map(([el, n]) => el + fmt(n)).join('');
  return { volume: V, counts, formula, Z, zSource, mass, density };
}

export type Neighbour = { from: number; to: number; img: number[]; d: number };
/** Shortest distance between two atoms (any images), or between neighbours of one atom, in Å. */
export function neighbours(cell: Cell, atoms: Atom[], centres: number[], cutoff: number, minD = 0.1): Neighbour[] {
  const M = cartesian(cell);
  // How many cells to search along each axis: the cutoff over the spacing of the opposite faces.
  const V = volume(cell), cr = (a: number[], b: number[]) => Math.hypot(a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]);
  const faces = [V / cr(M[1], M[2]), V / cr(M[0], M[2]), V / cr(M[0], M[1])];
  const n = faces.map((h) => Math.ceil(cutoff / h) + 1);
  const out: Neighbour[] = [];
  for (const i of centres) for (let j = 0; j < atoms.length; j++) for (let a = -n[0]; a <= n[0]; a++) for (let b = -n[1]; b <= n[1]; b++) for (let c = -n[2]; c <= n[2]; c++) {
    const df = [atoms[j].f[0] + a - atoms[i].f[0], atoms[j].f[1] + b - atoms[i].f[1], atoms[j].f[2] + c - atoms[i].f[2]];
    const d = Math.hypot(...toCart(M, df));
    if (d > minD && d <= cutoff) out.push({ from: i, to: j, img: [a, b, c], d });
  }
  return out.sort((x, y) => x.d - y.d);
}
/** The shortest distance between any two atoms (periodic), Å. */
export function shortest(cell: Cell, atoms: Atom[]): number {
  let best = Infinity;
  const M = cartesian(cell);
  for (let i = 0; i < atoms.length; i++) for (let j = i; j < atoms.length; j++) for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) {
    const df = [atoms[j].f[0] + a - atoms[i].f[0], atoms[j].f[1] + b - atoms[i].f[1], atoms[j].f[2] + c - atoms[i].f[2]];
    const d = Math.hypot(...toCart(M, df));
    if (d > 0.1 && d < best) best = d;
  }
  return best;
}

export type BondRow = { a: string; b: string; d: number; n: number; site: number };
/** Bond table: for the first atom of each site, its neighbours within the cutoff, grouped by label and distance. */
export function bondTable(s: Structure, atoms: Atom[], cutoff: number): { rows: BondRow[]; cn: Map<string, number> } {
  const centres = s.sites.map((_, si) => atoms.findIndex((a) => a.site === si)).filter((i) => i >= 0);
  const nb = neighbours(s.cell, atoms, centres, cutoff);
  const rows: BondRow[] = [], cn = new Map<string, number>();
  for (const x of nb) {
    const A = atoms[x.from].label, B = atoms[x.to].label;
    cn.set(A, (cn.get(A) ?? 0) + atoms[x.to].occ);
    const r = rows.find((q) => q.a === A && q.b === B && Math.abs(q.d - x.d) < 1e-3);
    if (r) r.n++; else rows.push({ a: A, b: B, d: x.d, n: 1, site: atoms[x.from].site });
  }
  for (const c of centres) if (!cn.has(atoms[c].label)) cn.set(atoms[c].label, 0);
  return { rows: rows.sort((x, y) => x.site - y.site || x.d - y.d), cn };
}

/** Atoms to draw: the cell's atoms plus their copies on the far faces, edges and corners (within `eps` of the cell). */
export function displayAtoms(atoms: Atom[], eps = 0.02): (Atom & { k: number })[] {
  const out: (Atom & { k: number })[] = [];
  atoms.forEach((a, k) => {
    const opts = a.f.map((x) => (x < eps ? [x, x + 1] : x > 1 - eps ? [x, x - 1] : [x]));
    for (const x of opts[0]) for (const y of opts[1]) for (const z of opts[2]) if ([x, y, z].every((v) => v > -eps && v < 1 + eps)) out.push({ ...a, f: [x, y, z], k });
  });
  return out;
}

export { cartesian, toCart, volume };
export type { Cell, Mat3 };

// ---------- Examples (textbook structures with rounded values, written by fibub) ----------
const OPS_FM3M = ["x,y,z", "-y,x,z", "-x,-y,z", "y,-x,z", "x,-y,-z", "-y,-x,-z", "-x,y,-z", "y,x,-z", "z,x,y", "z,-y,x", "z,-x,-y", "z,y,-x", "-z,x,-y", "-z,-y,-x", "-z,-x,y", "-z,y,x", "-x,z,y", "y,z,x", "x,z,-y", "-y,z,-x", "-x,-z,-y", "y,-z,-x", "x,-z,y", "-y,-z,x", "-x,-y,-z", "y,-x,-z", "x,y,-z", "-y,x,-z", "-x,y,z", "y,x,z", "x,-y,z", "-y,-x,z", "-z,-x,-y", "-z,y,-x", "-z,x,y", "-z,-y,x", "z,-x,y", "z,y,x", "z,x,-y", "z,-y,-x", "x,-z,-y", "-y,-z,-x", "-x,-z,y", "y,-z,x", "x,z,y", "-y,z,x", "-x,z,-y", "y,z,-x", "x,y+1/2,z+1/2", "-y,x+1/2,z+1/2", "-x,-y+1/2,z+1/2", "y,-x+1/2,z+1/2", "x,-y+1/2,-z+1/2", "-y,-x+1/2,-z+1/2", "-x,y+1/2,-z+1/2", "y,x+1/2,-z+1/2", "z,x+1/2,y+1/2", "z,-y+1/2,x+1/2", "z,-x+1/2,-y+1/2", "z,y+1/2,-x+1/2", "-z,x+1/2,-y+1/2", "-z,-y+1/2,-x+1/2", "-z,-x+1/2,y+1/2", "-z,y+1/2,x+1/2", "-x,z+1/2,y+1/2", "y,z+1/2,x+1/2", "x,z+1/2,-y+1/2", "-y,z+1/2,-x+1/2", "-x,-z+1/2,-y+1/2", "y,-z+1/2,-x+1/2", "x,-z+1/2,y+1/2", "-y,-z+1/2,x+1/2", "-x,-y+1/2,-z+1/2", "y,-x+1/2,-z+1/2", "x,y+1/2,-z+1/2", "-y,x+1/2,-z+1/2", "-x,y+1/2,z+1/2", "y,x+1/2,z+1/2", "x,-y+1/2,z+1/2", "-y,-x+1/2,z+1/2", "-z,-x+1/2,-y+1/2", "-z,y+1/2,-x+1/2", "-z,x+1/2,y+1/2", "-z,-y+1/2,x+1/2", "z,-x+1/2,y+1/2", "z,y+1/2,x+1/2", "z,x+1/2,-y+1/2", "z,-y+1/2,-x+1/2", "x,-z+1/2,-y+1/2", "-y,-z+1/2,-x+1/2", "-x,-z+1/2,y+1/2", "y,-z+1/2,x+1/2", "x,z+1/2,y+1/2", "-y,z+1/2,x+1/2", "-x,z+1/2,-y+1/2", "y,z+1/2,-x+1/2", "x+1/2,y,z+1/2", "-y+1/2,x,z+1/2", "-x+1/2,-y,z+1/2", "y+1/2,-x,z+1/2", "x+1/2,-y,-z+1/2", "-y+1/2,-x,-z+1/2", "-x+1/2,y,-z+1/2", "y+1/2,x,-z+1/2", "z+1/2,x,y+1/2", "z+1/2,-y,x+1/2", "z+1/2,-x,-y+1/2", "z+1/2,y,-x+1/2", "-z+1/2,x,-y+1/2", "-z+1/2,-y,-x+1/2", "-z+1/2,-x,y+1/2", "-z+1/2,y,x+1/2", "-x+1/2,z,y+1/2", "y+1/2,z,x+1/2", "x+1/2,z,-y+1/2", "-y+1/2,z,-x+1/2", "-x+1/2,-z,-y+1/2", "y+1/2,-z,-x+1/2", "x+1/2,-z,y+1/2", "-y+1/2,-z,x+1/2", "-x+1/2,-y,-z+1/2", "y+1/2,-x,-z+1/2", "x+1/2,y,-z+1/2", "-y+1/2,x,-z+1/2", "-x+1/2,y,z+1/2", "y+1/2,x,z+1/2", "x+1/2,-y,z+1/2", "-y+1/2,-x,z+1/2", "-z+1/2,-x,-y+1/2", "-z+1/2,y,-x+1/2", "-z+1/2,x,y+1/2", "-z+1/2,-y,x+1/2", "z+1/2,-x,y+1/2", "z+1/2,y,x+1/2", "z+1/2,x,-y+1/2", "z+1/2,-y,-x+1/2", "x+1/2,-z,-y+1/2", "-y+1/2,-z,-x+1/2", "-x+1/2,-z,y+1/2", "y+1/2,-z,x+1/2", "x+1/2,z,y+1/2", "-y+1/2,z,x+1/2", "-x+1/2,z,-y+1/2", "y+1/2,z,-x+1/2", "x+1/2,y+1/2,z", "-y+1/2,x+1/2,z", "-x+1/2,-y+1/2,z", "y+1/2,-x+1/2,z", "x+1/2,-y+1/2,-z", "-y+1/2,-x+1/2,-z", "-x+1/2,y+1/2,-z", "y+1/2,x+1/2,-z", "z+1/2,x+1/2,y", "z+1/2,-y+1/2,x", "z+1/2,-x+1/2,-y", "z+1/2,y+1/2,-x", "-z+1/2,x+1/2,-y", "-z+1/2,-y+1/2,-x", "-z+1/2,-x+1/2,y", "-z+1/2,y+1/2,x", "-x+1/2,z+1/2,y", "y+1/2,z+1/2,x", "x+1/2,z+1/2,-y", "-y+1/2,z+1/2,-x", "-x+1/2,-z+1/2,-y", "y+1/2,-z+1/2,-x", "x+1/2,-z+1/2,y", "-y+1/2,-z+1/2,x", "-x+1/2,-y+1/2,-z", "y+1/2,-x+1/2,-z", "x+1/2,y+1/2,-z", "-y+1/2,x+1/2,-z", "-x+1/2,y+1/2,z", "y+1/2,x+1/2,z", "x+1/2,-y+1/2,z", "-y+1/2,-x+1/2,z", "-z+1/2,-x+1/2,-y", "-z+1/2,y+1/2,-x", "-z+1/2,x+1/2,y", "-z+1/2,-y+1/2,x", "z+1/2,-x+1/2,y", "z+1/2,y+1/2,x", "z+1/2,x+1/2,-y", "z+1/2,-y+1/2,-x", "x+1/2,-z+1/2,-y", "-y+1/2,-z+1/2,-x", "-x+1/2,-z+1/2,y", "y+1/2,-z+1/2,x", "x+1/2,z+1/2,y", "-y+1/2,z+1/2,x", "-x+1/2,z+1/2,-y", "y+1/2,z+1/2,-x"];
const OPS_P42MNM = ["x,y,z", "-y+1/2,x+1/2,z+1/2", "-x,-y,z", "y+1/2,-x+1/2,z+1/2", "x+1/2,-y+1/2,-z+1/2", "-y,-x,-z", "-x+1/2,y+1/2,-z+1/2", "y,x,-z", "-x,-y,-z", "y+1/2,-x+1/2,-z+1/2", "x,y,-z", "-y+1/2,x+1/2,-z+1/2", "-x+1/2,y+1/2,z+1/2", "y,x,z", "x+1/2,-y+1/2,z+1/2", "-y,-x,z"];
const OPS_P63MC = ["x,y,z", "x-y,x,z+1/2", "-y,x-y,z", "-x,-y,z+1/2", "-x+y,-x,z", "y,-x+y,z+1/2", "y,x,z+1/2", "x,x-y,z", "x-y,-y,z+1/2", "-y,-x,z", "-x,-x+y,z+1/2", "-x+y,y,z"];
function makeCif(name: string, title: string, cell: number[], sg: string, num: number, ops: string[], sites: [string, string, number, number, number][], formula: string): string {
  return `# ${title}\n# Written by fibub.com as an example: a textbook structure with rounded values.\ndata_${name}\n_chemical_name_common '${title}'\n_chemical_formula_sum '${formula}'\n_cell_length_a ${cell[0]}\n_cell_length_b ${cell[1]}\n_cell_length_c ${cell[2]}\n_cell_angle_alpha ${cell[3]}\n_cell_angle_beta ${cell[4]}\n_cell_angle_gamma ${cell[5]}\n_space_group_name_H-M_alt '${sg}'\n_space_group_IT_number ${num}\nloop_\n_space_group_symop_operation_xyz\n${ops.map((o) => `'${o}'`).join('\n')}\nloop_\n_atom_site_label\n_atom_site_type_symbol\n_atom_site_fract_x\n_atom_site_fract_y\n_atom_site_fract_z\n_atom_site_occupancy\n${sites.map((s) => `${s[0]} ${s[1]} ${s[2]} ${s[3]} ${s[4]} 1`).join('\n')}\n`;
}
export const EXAMPLES: { id: string; name: string; cif: string }[] = [
  { id: 'nacl', name: 'Rock salt, NaCl', cif: makeCif('NaCl', 'Rock salt (sodium chloride)', [5.64, 5.64, 5.64, 90, 90, 90], 'F m -3 m', 225, OPS_FM3M, [['Na1', 'Na', 0, 0, 0], ['Cl1', 'Cl', 0.5, 0.5, 0.5]], 'Cl Na') },
  { id: 'tio2', name: 'Rutile, TiO₂', cif: makeCif('TiO2', 'Rutile (titanium dioxide)', [4.59, 4.59, 2.96, 90, 90, 90], 'P 42/m n m', 136, OPS_P42MNM, [['Ti1', 'Ti', 0, 0, 0], ['O1', 'O', 0.305, 0.305, 0]], 'O2 Ti') },
  { id: 'zno', name: 'Wurtzite ZnO', cif: makeCif('ZnO', 'Zinc oxide (wurtzite)', [3.25, 3.25, 5.21, 90, 90, 120], 'P 63 m c', 186, OPS_P63MC, [['Zn1', 'Zn', 1 / 3, 2 / 3, 0], ['O1', 'O', 1 / 3, 2 / 3, 0.382]], 'O Zn').replace(/0\.3333333333333333/g, '0.33333').replace(/0\.6666666666666666/g, '0.66667') },
];
