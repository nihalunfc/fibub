// Small finite groups by their multiplication (Cayley) table: cyclic Z_n, dihedral D_n, symmetric S3 and S4,
// alternating A4 and A5, the Klein four-group, the quaternion group Q8 and the unit groups Z_n^×. Element orders,
// inverses, conjugacy classes, centre, commutator subgroup, every subgroup (with which are normal), cosets,
// quotient groups and the subgroup lattice. Plain TypeScript, no DOM. Checked against sympy.combinatorics in
// tests/sci-tools/group-explorer.mjs.

export type Group = {
  name: string; kind: string;
  labels: string[];
  /** mul[a][b] = a·b (indices); element 0 is the identity. */
  mul: number[][];
  note: string;
};
export type Subgroup = { els: number[]; key: string; gens: number[] };

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const pow = (base: string, k: number) => (k === 0 ? '' : k === 1 ? base : `${base}^${k}`);

export function cyclic(n: number): Group {
  if (!(Number.isInteger(n) && n >= 1 && n <= 100)) throw new Error('Choose n from 1 to 100 for Z_n.');
  return { name: `Z${n}`, kind: 'cyclic', labels: Array.from({ length: n }, (_, i) => String(i)), mul: Array.from({ length: n }, (_, a) => Array.from({ length: n }, (_, b) => (a + b) % n)), note: `The integers 0 to ${n - 1} under addition mod ${n}.` };
}
/** Dihedral group of the regular n-gon, order 2n: r is a turn by 360°/n, s a reflection; s r s = r⁻¹. */
export function dihedral(n: number): Group {
  if (!(Number.isInteger(n) && n >= 2 && n <= 32)) throw new Error('Choose n from 2 to 32 for D_n (order 2n).');
  const idx = (k: number, m: number) => m * n + ((k % n) + n) % n;
  const labels: string[] = [];
  for (let m = 0; m < 2; m++) for (let k = 0; k < n; k++) labels.push(m === 0 ? (k ? pow('r', k) : 'e') : (k ? `${pow('r', k)}s` : 's'));
  const mul = labels.map((_, x) => labels.map((_, y) => {
    const a = x % n, b = Math.floor(x / n), c = y % n, d = Math.floor(y / n);
    return idx(a + (b ? -c : c), (b + d) % 2);
  }));
  return { name: `D${n}`, kind: 'dihedral', labels, mul, note: `Symmetries of a regular ${n}-gon: ${n} turns r^k and ${n} reflections r^k s. Order ${2 * n}. Products read right to left; s r s = r⁻¹.` };
}
/** Permutations of 1..k in cycle notation, e.g. (1 2 3)(4 5). Products are composed right to left: (στ)(x) = σ(τ(x)). */
export function cycleText(p: number[]): string {
  const seen = new Array(p.length).fill(false), out: string[] = [];
  for (let i = 0; i < p.length; i++) {
    if (seen[i] || p[i] === i) { seen[i] = true; continue; }
    const c: number[] = []; let j = i;
    while (!seen[j]) { seen[j] = true; c.push(j + 1); j = p[j]; }
    out.push(`(${c.join(' ')})`);
  }
  return out.join('') || 'e';
}
const sign = (p: number[]) => { let s = 1; const seen = new Array(p.length).fill(false); for (let i = 0; i < p.length; i++) { if (seen[i]) continue; let j = i, len = 0; while (!seen[j]) { seen[j] = true; j = p[j]; len++; } if (len % 2 === 0) s = -s; } return s; };
function perms(k: number): number[][] {
  if (k === 0) return [[]];
  const out: number[][] = [];
  for (const p of perms(k - 1)) for (let i = 0; i <= p.length; i++) out.push([...p.slice(0, i), k - 1, ...p.slice(i)]);
  return out;
}
function permGroup(name: string, kind: string, ps: number[][], note: string): Group {
  const id = ps.findIndex((p) => p.every((v, i) => v === i));
  ps = [ps[id], ...ps.filter((_, i) => i !== id)];
  // Order the rest by cycle type then text, so tables read well.
  const rest = ps.slice(1).map((p) => ({ p, t: cycleText(p) })).sort((a, b) => a.t.length - b.t.length || (a.t < b.t ? -1 : 1));
  ps = [ps[0], ...rest.map((r) => r.p)];
  const key = new Map(ps.map((p, i) => [p.join(), i]));
  const mul = ps.map((s) => ps.map((t) => key.get(t.map((x) => s[x]).join())!));
  return { name, kind, labels: ps.map(cycleText), mul, note };
}
export function symmetric(k: 3 | 4): Group {
  return permGroup(`S${k}`, 'symmetric', perms(k), `All ${k === 3 ? 6 : 24} permutations of ${k} objects, in cycle notation. Products read right to left: (στ)(x) = σ(τ(x)).`);
}
export function alternating(k: 4 | 5): Group {
  return permGroup(`A${k}`, 'alternating', perms(k).filter((p) => sign(p) === 1), `The ${k === 4 ? 12 : 60} even permutations of ${k} objects${k === 4 ? ' (rotations of a tetrahedron)' : ' (rotations of an icosahedron; the smallest non-abelian simple group)'}. Products read right to left.`);
}
export function klein(): Group {
  const labels = ['e', 'a', 'b', 'c'];
  return { name: 'V4', kind: 'klein', labels, mul: labels.map((_, x) => labels.map((_, y) => x ^ y)), note: 'The Klein four-group Z2 × Z2: every element is its own inverse, and the product of any two of a, b, c is the third.' };
}
export function quaternion(): Group {
  // Units ±1, ±i, ±j, ±k as (sign, unit) with unit 0..3 = 1, i, j, k.
  const labels = ['1', '−1', 'i', '−i', 'j', '−j', 'k', '−k'];
  const U = [[[1, 0], [1, 1], [1, 2], [1, 3]], [[1, 1], [-1, 0], [1, 3], [-1, 2]], [[1, 2], [-1, 3], [-1, 0], [1, 1]], [[1, 3], [1, 2], [-1, 1], [-1, 0]]];
  const dec = (x: number): [number, number] => [x % 2 ? -1 : 1, x >> 1];
  const enc = (s: number, u: number) => 2 * u + (s < 0 ? 1 : 0);
  const mul = labels.map((_, x) => labels.map((_, y) => { const [s1, u1] = dec(x), [s2, u2] = dec(y), [s3, u3] = U[u1][u2]; return enc(s1 * s2 * s3, u3); }));
  return { name: 'Q8', kind: 'quaternion', labels, mul, note: 'The quaternion group: ±1, ±i, ±j, ±k with i² = j² = k² = ijk = −1. Every subgroup is normal, yet it is not abelian.' };
}
export function units(n: number): Group {
  if (!(Number.isInteger(n) && n >= 2 && n <= 150)) throw new Error('Choose n from 2 to 150 for Z_n^×.');
  const els: number[] = []; for (let a = 1; a < n; a++) if (gcd(a, n) === 1) els.push(a);
  const key = new Map(els.map((a, i) => [a, i]));
  return { name: `Z${n}^×`, kind: 'units', labels: els.map(String), mul: els.map((a) => els.map((b) => key.get((a * b) % n)!)), note: `The ${els.length} numbers below ${n} that share no factor with it, under multiplication mod ${n}.` };
}

/** Check that a table is a group: closed, identity first, associative, inverses. Returns a message or null. */
export function validate(g: Group): string | null {
  const n = g.mul.length;
  for (let a = 0; a < n; a++) { if (g.mul[0][a] !== a || g.mul[a][0] !== a) return 'Element 0 is not the identity.'; if (!g.mul[a].includes(0)) return `${g.labels[a]} has no inverse.`; }
  for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) for (let c = 0; c < n; c++) if (g.mul[g.mul[a][b]][c] !== g.mul[a][g.mul[b][c]]) return 'Not associative.';
  return null;
}

// ---------- Properties ----------
export const inverse = (g: Group, a: number) => g.mul[a].indexOf(0);
export function order(g: Group, a: number): number { let x = a, k = 1; while (x !== 0) { x = g.mul[x][a]; k++; } return k; }
export const isAbelian = (g: Group) => g.mul.every((row, a) => row.every((ab, b) => ab === g.mul[b][a]));
export const conj = (g: Group, x: number, h: number) => g.mul[g.mul[x][h]][inverse(g, x)];
export function conjugacyClasses(g: Group): number[][] {
  const n = g.mul.length, seen = new Array(n).fill(false), out: number[][] = [];
  for (let a = 0; a < n; a++) {
    if (seen[a]) continue;
    const cls = new Set<number>(); for (let x = 0; x < n; x++) cls.add(conj(g, x, a));
    const c = [...cls].sort((p, q) => p - q); c.forEach((y) => (seen[y] = true)); out.push(c);
  }
  return out;
}
export function centre(g: Group): number[] { const n = g.mul.length; return [...Array(n).keys()].filter((a) => g.mul[a].every((ab, b) => ab === g.mul[b][a])); }
export function centraliser(g: Group, a: number): number[] { return [...Array(g.mul.length).keys()].filter((x) => g.mul[x][a] === g.mul[a][x]); }

/** The subgroup generated by some elements. */
export function generate(g: Group, gens: number[]): number[] {
  const inH = new Uint8Array(g.mul.length); inH[0] = 1; const list = [0];
  for (let i = 0; i < list.length; i++) for (const s of gens) { const y = g.mul[list[i]][s]; if (!inH[y]) { inH[y] = 1; list.push(y); } }
  return list.sort((a, b) => a - b);
}
const keyOf = (els: number[]) => els.join(',');
/** Commutator (derived) subgroup: generated by all a b a⁻¹ b⁻¹. */
export function derived(g: Group): number[] {
  const n = g.mul.length, cs = new Set<number>();
  for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) cs.add(g.mul[g.mul[a][b]][g.mul[inverse(g, a)][inverse(g, b)]]);
  return generate(g, [...cs]);
}
export const exponent = (g: Group) => g.mul.reduce((e, _, a) => { const o = order(g, a); return (e * o) / gcd(e, o); }, 1);

/** Every subgroup, smallest first: start from the cyclic ones and keep joining a subgroup with one more element. */
export function subgroups(g: Group): Subgroup[] {
  const n = g.mul.length, found = new Map<string, Subgroup>();
  const add = (els: number[], gens: number[]) => { const k = keyOf(els); if (!found.has(k)) { found.set(k, { els, key: k, gens }); return true; } return false; };
  add([0], []);
  for (let a = 1; a < n; a++) add(generate(g, [a]), [a]);
  let frontier = [...found.values()];
  while (frontier.length) {
    const next: Subgroup[] = [];
    for (const H of frontier) {
      const inH = new Uint8Array(n); H.els.forEach((x) => (inH[x] = 1));
      for (let a = 1; a < n; a++) {
        if (inH[a]) continue;
        const gens = [...H.gens, a], els = generate(g, gens);
        if (add(els, gens)) next.push(found.get(keyOf(els))!);
      }
    }
    frontier = next;
  }
  // Short generating sets: keep a generator only if it adds something.
  const subs = [...found.values()].map((H) => {
    const gens: number[] = []; let cur = [0];
    const want = H.els.length;
    // Try a single generator first (cyclic), then greedy.
    const single = H.els.find((x) => order(g, x) === want);
    if (single !== undefined && want > 1) return { ...H, gens: [single] };
    for (const x of H.els) { if (cur.length === want) break; if (!cur.includes(x)) { gens.push(x); cur = generate(g, gens); } }
    return { ...H, gens };
  });
  return subs.sort((A, B) => A.els.length - B.els.length || (A.key < B.key ? -1 : 1));
}
export function isNormal(g: Group, H: number[]): boolean {
  const inH = new Uint8Array(g.mul.length); H.forEach((x) => (inH[x] = 1));
  for (let x = 0; x < g.mul.length; x++) for (const h of H) if (!inH[conj(g, x, h)]) return false;
  return true;
}
/** Left cosets xH (or right cosets Hx), each listed once, in order of their first element. */
export function cosets(g: Group, H: number[], side: 'left' | 'right'): number[][] {
  const n = g.mul.length, seen = new Uint8Array(n), out: number[][] = [];
  for (let x = 0; x < n; x++) {
    if (seen[x]) continue;
    const c = H.map((h) => (side === 'left' ? g.mul[x][h] : g.mul[h][x])).sort((a, b) => a - b);
    c.forEach((y) => (seen[y] = 1)); out.push(c);
  }
  return out;
}
/** The quotient group G/H for a normal subgroup H, as a group whose elements are the cosets. */
export function quotient(g: Group, H: number[]): Group {
  const cs = cosets(g, H, 'left'), where = new Array(g.mul.length);
  cs.forEach((c, i) => c.forEach((x) => (where[x] = i)));
  const mul = cs.map((a) => cs.map((b) => where[g.mul[a[0]][b[0]]]));
  return { name: `${g.name}/H`, kind: 'quotient', labels: cs.map((c) => `${g.labels[c[0]]}H`), mul, note: '' };
}
/** For each subgroup, the subgroups just below it (maximal subgroups), for drawing the lattice. */
export function hasse(subs: Subgroup[]): [number, number][] {
  const sets = subs.map((s) => new Set(s.els));
  const contains = (big: number, small: number) => subs[small].els.length < subs[big].els.length && subs[big].els.length % subs[small].els.length === 0 && subs[small].els.every((x) => sets[big].has(x));
  const edges: [number, number][] = [];
  for (let b = 0; b < subs.length; b++) for (let s = 0; s < subs.length; s++) {
    if (!contains(b, s)) continue;
    let maximal = true;
    for (let m = 0; m < subs.length && maximal; m++) if (m !== b && m !== s && contains(b, m) && contains(m, s)) maximal = false;
    if (maximal) edges.push([s, b]);
  }
  return edges;
}
/** Summary numbers, used by the page and by the checks against sympy. */
export function summary(g: Group) {
  const n = g.mul.length, subs = subgroups(g), orders = g.mul.map((_, a) => order(g, a));
  const profile = new Map<number, number>(); orders.forEach((o) => profile.set(o, (profile.get(o) ?? 0) + 1));
  return {
    order: n, abelian: isAbelian(g), cyclic: orders.includes(n), centre: centre(g).length, classes: conjugacyClasses(g).length,
    derived: derived(g).length, exponent: exponent(g), subgroups: subs.length, normal: subs.filter((s) => isNormal(g, s.els)).length,
    profile: [...profile.entries()].sort((a, b) => a[0] - b[0]), subgroupOrders: subs.map((s) => s.els.length),
  };
}
