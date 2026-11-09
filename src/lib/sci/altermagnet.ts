// Altermagnet checker. For a collinear magnetic crystal it finds every symmetry operation of the crystal (ignoring
// spins), sorts them into those that keep each spin and those that swap the up and down sublattices, and classifies:
//   • net moment ≠ 0 → ferromagnet or ferrimagnet;
//   • a swap by a pure translation or by inversion (tT or PT symmetry) → conventional antiferromagnet, bands stay
//     spin-degenerate everywhere;
//   • swaps only by rotations or mirrors (possibly with a fractional translation) → altermagnet, with bands split by
//     spin in a pattern whose lowest symmetry-allowed form (degree 2, 4 or 6 in k: d-, g- or i-wave) is found here.
// This is the non-relativistic spin-group test (no spin–orbit coupling), the standard definition of altermagnetism.

export type V3 = [number, number, number];
export type M3 = [V3, V3, V3]; // rows
export type Atom = { el: string; f: V3; m: number }; // m: signed moment along the common axis (0 = non-magnetic)
export type Crystal = { cell: [number, number, number, number, number, number]; atoms: Atom[] };

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const mv = (M: M3, v: V3): V3 => [dot(M[0], v), dot(M[1], v), dot(M[2], v)];
const mm = (A: M3, B: M3): M3 => [0, 1, 2].map((i) => [0, 1, 2].map((j) => A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j])) as M3;
const tr = (A: M3): M3 => [0, 1, 2].map((i) => [0, 1, 2].map((j) => A[j][i])) as M3;
const det = (A: M3) => A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
function inv(A: M3): M3 {
  const d = det(A), c = (i: number, j: number) => { const r = [0, 1, 2].filter((x) => x !== i), s = [0, 1, 2].filter((x) => x !== j); return A[r[0]][s[0]] * A[r[1]][s[1]] - A[r[0]][s[1]] * A[r[1]][s[0]]; };
  return [0, 1, 2].map((i) => [0, 1, 2].map((j) => ((i + j) % 2 ? -1 : 1) * c(j, i) / d)) as M3;
}
const wrap = (x: number) => x - Math.round(x); // to (−½, ½]
const mod1 = (x: number) => { const y = x - Math.floor(x); return y > 1 - 1e-6 ? 0 : y; };

/** Lattice vectors as matrix columns, a along x and b in the xy plane (the usual convention). */
export function latticeMatrix([a, b, c, al, be, ga]: Crystal['cell']): M3 {
  const r = Math.PI / 180, ca = Math.cos(al * r), cb = Math.cos(be * r), cg = Math.cos(ga * r), sg = Math.sin(ga * r);
  const cx = c * cb, cy = (c * (ca - cb * cg)) / sg, cz = Math.sqrt(Math.max(c * c - cx * cx - cy * cy, 0));
  return [[a, b * cg, cx], [0, b * sg, cy], [0, 0, cz]];
}

export type Op = { W: M3; t: V3; R: M3; flip: boolean; name: string };
export type Result = {
  ops: Op[]; keep: Op[]; swap: Op[]; net: number; magnetic: number;
  kind: 'non-magnetic' | 'ferromagnet' | 'ferrimagnet' | 'antiferromagnet' | 'altermagnet' | 'not compensated by symmetry';
  why: string; wave?: 'd' | 'g' | 'i'; degree?: number; form?: string; formFn?: (k: V3) => number; byOp?: Op;
};

/** Every space-group operation {W|t} (fractional coordinates, modulo lattice translations) of the crystal, spins ignored. */
export function crystalOps(cr: Crystal, tolA = 0.1): { W: M3; t: V3 }[] {
  const A = latticeMatrix(cr.cell), G = mm(tr(A), A), scale = Math.max(G[0][0], G[1][1], G[2][2]);
  const els = new Map<string, number[]>();
  cr.atoms.forEach((a, i) => els.set(a.el, [...(els.get(a.el) ?? []), i]));
  const rare = [...els.values()].sort((x, y) => x.length - y.length)[0];
  const x0 = cr.atoms[rare[0]].f;
  const close = (d: V3) => { const w: V3 = [wrap(d[0]), wrap(d[1]), wrap(d[2])], c = mv(A, w); return Math.hypot(...c) < tolA; };
  const out: { W: M3; t: V3 }[] = [];
  const vals = [-1, 0, 1];
  for (let n = 0; n < 19683; n++) {
    const e: number[] = []; let k = n; for (let i = 0; i < 9; i++) { e.push(vals[k % 3]); k = Math.floor(k / 3); }
    const W: M3 = [[e[0], e[1], e[2]], [e[3], e[4], e[5]], [e[6], e[7], e[8]]];
    const dW = det(W); if (Math.abs(Math.abs(dW) - 1) > 1e-9) continue;
    const GW = mm(tr(W), mm(G, W));
    let metric = true; for (let i = 0; i < 3 && metric; i++) for (let j = 0; j < 3; j++) if (Math.abs(GW[i][j] - G[i][j]) > 1e-3 * scale) { metric = false; break; }
    if (!metric) continue;
    const wx0 = mv(W, x0), seen: V3[] = [];
    for (const j of rare) {
      const xj = cr.atoms[j].f, t: V3 = [mod1(xj[0] - wx0[0]), mod1(xj[1] - wx0[1]), mod1(xj[2] - wx0[2])];
      if (seen.some((s) => close([s[0] - t[0], s[1] - t[1], s[2] - t[2]]))) continue;
      const ok = cr.atoms.every((a) => { const y = mv(W, a.f); y[0] += t[0]; y[1] += t[1]; y[2] += t[2]; return (els.get(a.el) ?? []).some((j2) => close([y[0] - cr.atoms[j2].f[0], y[1] - cr.atoms[j2].f[1], y[2] - cr.atoms[j2].f[2]])); });
      if (ok) { seen.push(t); out.push({ W, t }); }
    }
  }
  return out;
}

/** Does {W|t} keep every moment (+1), swap every moment (−1), or neither (0)? */
function spinAction(cr: Crystal, W: M3, t: V3, tolA: number): 1 | -1 | 0 {
  const A = latticeMatrix(cr.cell);
  const close = (d: V3) => Math.hypot(...mv(A, [wrap(d[0]), wrap(d[1]), wrap(d[2])])) < tolA;
  let s = 0;
  for (const a of cr.atoms) {
    if (!a.m) continue;
    const y = mv(W, a.f); y[0] += t[0]; y[1] += t[1]; y[2] += t[2];
    const b = cr.atoms.find((c) => c.el === a.el && close([y[0] - c.f[0], y[1] - c.f[1], y[2] - c.f[2]]));
    if (!b) return 0;
    const r = b.m / a.m;
    const sign = Math.abs(r - 1) < 1e-6 ? 1 : Math.abs(r + 1) < 1e-6 ? -1 : 0;
    if (!sign || (s && sign !== s)) return 0;
    s = sign;
  }
  return (s || 1) as 1 | -1;
}

/** A short name for {W|t}: translation, inversion, n-fold rotation or screw, mirror or glide, rotoinversion. */
export function describe(W: M3, t: V3, A: M3): string {
  const R = mm(A, mm(W, inv(A))), d = det(R) > 0 ? 1 : -1;
  const P = R.map((r) => r.map((x) => d * x)) as M3, tc = Math.max(-1, Math.min(1, (P[0][0] + P[1][1] + P[2][2] - 1) / 2));
  const n = tc > 0.999 ? 1 : Math.round((2 * Math.PI) / Math.acos(tc));
  const tz: V3 = [wrap(t[0]), wrap(t[1]), wrap(t[2])], tnz = tz.some((x) => Math.abs(x) > 1e-6), tp: V3 = [mod1(t[0]), mod1(t[1]), mod1(t[2])];
  const frac = (x: number) => { for (const q of [2, 3, 4, 6]) if (Math.abs(x * q - Math.round(x * q)) < 1e-4) return Math.round(x * q) === 0 ? '0' : `${Math.round(x * q)}/${q}`; return x.toFixed(3); };
  const tText = `(${tp.map(frac).join(', ')})`;
  if (n === 1 && d === 1) return tnz ? `translation by ${tText}` : 'identity';
  if (n === 1 && d === -1) return 'inversion';
  // Rotation axis of the proper part, as a lattice direction.
  let axis: V3;
  if (n === 2) { const S = P.map((r, i) => r.map((x, j) => x + (i === j ? 1 : 0))) as M3; axis = [0, 1, 2].map((j) => [S[0][j], S[1][j], S[2][j]] as V3).sort((a, b) => Math.hypot(...b) - Math.hypot(...a))[0]; }
  else axis = [P[2][1] - P[1][2], P[0][2] - P[2][0], P[1][0] - P[0][1]];
  const fa = mv(inv(A), axis), mx = Math.max(...fa.map(Math.abs)) || 1;
  let dir = fa.map((x) => x / mx);
  for (const m of [1, 2, 3, 4, 6]) { const s = dir.map((x) => x * m); if (s.every((x) => Math.abs(x - Math.round(x)) < 0.05)) { dir = s.map(Math.round); break; } }
  const flipped = dir.find((x) => Math.abs(x) > 1e-9)! < 0; if (flipped) dir = dir.map((x) => -x);
  const dText = `[${dir.map((x) => (Math.abs(x - Math.round(x)) < 1e-6 ? Math.round(x) : +x.toFixed(2))).join(' ')}]`;
  const along = Math.abs(dot(mv(A, tz), axis)) / (Math.hypot(...axis) || 1) > 1e-3;
  const sense = n > 2 ? ` (${flipped ? '−' : '+'}${360 / n}°)` : '';
  if (d === 1) return `${n}-fold ${along ? 'screw' : 'rotation'}${sense} about ${dText}${tnz ? ` with translation ${tText}` : ''}`;
  if (n === 2) { const inPlane = tnz && Math.hypot(...mv(A, tz)) ** 2 - (dot(mv(A, tz), axis) / Math.hypot(...axis)) ** 2 > 1e-6; return `${inPlane ? 'glide' : 'mirror'} plane ⟂ ${dText}${tnz ? ` with translation ${tText}` : ''}`; }
  return `${n}-fold rotoinversion${sense} about ${dText}${tnz ? ` with translation ${tText}` : ''}`;
}

const isI = (W: M3, s: 1 | -1) => [0, 1, 2].every((i) => [0, 1, 2].every((j) => W[i][j] === (i === j ? s : 0)));

/** The lowest even degree (2, 4, 6) whose symmetry-allowed spin-splitting form is not zero, with that form. */
export function splittingForm(keep: Op[], swap: Op[]) {
  const group = [...keep.map((o) => ({ R: o.R, c: 1 })), ...swap.map((o) => ({ R: o.R, c: -1 }))];
  const full = [...group, ...group.map((g) => ({ R: g.R.map((r) => r.map((x) => -x)) as M3, c: g.c }))]; // Δ(−k) = Δ(k)
  // Fixed pseudo-random sample directions on the sphere.
  const pts: V3[] = []; let s = 7; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 60; i++) { const u = 2 * rnd() - 1, ph = 2 * Math.PI * rnd(), r = Math.sqrt(1 - u * u); pts.push([r * Math.cos(ph), r * Math.sin(ph), u]); }
  for (const deg of [2, 4, 6]) {
    const mons: V3[] = []; for (let a = deg; a >= 0; a--) for (let b = deg - a; b >= 0; b--) mons.push([a, b, deg - a - b]);
    const ev = (m: V3, k: V3) => k[0] ** m[0] * k[1] ** m[1] * k[2] ** m[2];
    const proj = (m: V3) => (k: V3) => full.reduce((acc, g) => acc + g.c * ev(m, mv(tr(g.R), k)), 0) / full.length;
    let best: { f: (k: V3) => number; norm: number } | null = null;
    for (const m of mons) { const f = proj(m), norm = Math.sqrt(pts.reduce((a, k) => a + f(k) ** 2, 0) / pts.length); if (norm > 1e-7 && (!best || norm > best.norm + 1e-9)) best = { f, norm }; }
    if (best) {
      // Coefficients on the monomial basis, by least squares on the sample points.
      const F = best.f, X = pts.map((k) => mons.map((m) => ev(m, k))), y = pts.map((k) => F(k));
      const coef = leastSquares(X, y), big = Math.max(...coef.map(Math.abs));
      const terms = coef.map((c, i) => ({ c: c / big, m: mons[i] })).filter((x) => Math.abs(x.c) > 1e-6);
      const name = (m: V3) => ['x', 'y', 'z'].map((v, i) => (m[i] ? `k${v}${m[i] > 1 ? '⁰¹²³⁴⁵⁶'[m[i]] : ''}` : '')).join('');
      const num = (c: number) => { const a = Math.abs(c); for (const q of [1, 2, 3, 4, 6]) if (Math.abs(a * q - Math.round(a * q)) < 1e-4) { const p = Math.round(a * q); return q === 1 ? (p === 1 ? '' : String(p)) : `(${p}/${q})`; } return a.toFixed(3); };
      const form = terms.map((x, i) => `${x.c < 0 ? (i ? ' − ' : '−') : i ? ' + ' : ''}${num(x.c)}${name(x.m)}`).join('');
      const fn = (k: V3) => terms.reduce((a, x) => a + x.c * ev(x.m, k), 0);
      return { degree: deg, wave: ({ 2: 'd', 4: 'g', 6: 'i' } as const)[deg as 2 | 4 | 6], form, fn };
    }
  }
  return null;
}

function leastSquares(X: number[][], y: number[]): number[] {
  const n = X[0].length, A = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => X.reduce((s, r) => s + r[i] * r[j], 0))), b = Array.from({ length: n }, (_, i) => X.reduce((s, r, k) => s + r[i] * y[k], 0));
  for (let i = 0; i < n; i++) A[i][i] += 1e-12;
  // Gaussian elimination with partial pivoting.
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
    for (let r = c + 1; r < n; r++) { const f = A[r][c] / A[c][c]; for (let k = c; k < n; k++) A[r][k] -= f * A[c][k]; b[r] -= f * b[c]; }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = b[r]; for (let k = r + 1; k < n; k++) s -= A[r][k] * x[k]; x[r] = s / A[r][r]; }
  return x;
}

export function classify(cr: Crystal, tolA = 0.1): Result {
  const A = latticeMatrix(cr.cell), Ai = inv(A);
  const ops: Op[] = [];
  for (const { W, t } of crystalOps(cr, tolA)) {
    const s = spinAction(cr, W, t, tolA);
    if (s === 0) continue;
    ops.push({ W, t, R: mm(A, mm(W, Ai)), flip: s === -1, name: describe(W, t, A) });
  }
  const keep = ops.filter((o) => !o.flip), swap = ops.filter((o) => o.flip);
  const mags = cr.atoms.filter((a) => a.m), net = cr.atoms.reduce((s, a) => s + a.m, 0);
  const base = { ops, keep, swap, net, magnetic: mags.length };
  if (!mags.length) return { ...base, kind: 'non-magnetic', why: 'No atom carries a moment.' };
  if (Math.abs(net) > 1e-9) {
    const allSame = mags.every((a) => Math.sign(a.m) === Math.sign(mags[0].m));
    return { ...base, kind: allSame ? 'ferromagnet' : 'ferrimagnet', why: `The moments add up to ${+net.toFixed(4)} per cell, so the magnet is not compensated.` };
  }
  if (!swap.length) return { ...base, kind: 'not compensated by symmetry', why: 'The moments cancel in this cell, but no symmetry swaps the up and down atoms, so nothing forces them to stay equal (a compensated ferrimagnet). Its bands are spin-split everywhere, like a ferromagnet’s.' };
  const tOp = swap.find((o) => isI(o.W, 1)), pOp = swap.find((o) => isI(o.W, -1));
  if (tOp) return { ...base, kind: 'antiferromagnet', byOp: tOp, why: `A pure ${tOp.name} swaps the up and down atoms. Combined with time reversal, this keeps every band spin-degenerate.` };
  if (pOp) return { ...base, kind: 'antiferromagnet', byOp: pOp, why: 'Inversion swaps the up and down atoms. Combined with time reversal (PT symmetry), this keeps every band spin-degenerate.' };
  const form = splittingForm(keep, swap);
  // Show the clearest swapping operation: a proper rotation or screw (highest order), then a mirror or glide.
  const rank = (o: Op) => (/rotoinversion/.test(o.name) ? 3 : /mirror|glide/.test(o.name) ? 2 : 1) * 10 - (Number(/^(\d)-fold/.exec(o.name)?.[1] ?? 0)) + (/\(−/.test(o.name) ? 0.5 : 0);
  const nice = [...swap].sort((a, b) => rank(a) - rank(b))[0];
  return { ...base, kind: 'altermagnet', byOp: nice, why: `Only rotations or mirrors swap the up and down atoms (for example a ${nice.name}), so the bands split by spin, with opposite signs in different directions.`, ...(form ? { wave: form.wave, degree: form.degree, form: form.form, formFn: form.fn } : {}) };
}

/** Parse "cell a b c α β γ" plus lines "El x y z [up|down|+|−|moment]". */
export function parseCrystal(text: string): { crystal: Crystal | null; bad: string[] } {
  const bad: string[] = []; let cell: Crystal['cell'] | null = null; const atoms: Atom[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim(); if (!line) continue;
    const p = line.split(/[\s,;]+/);
    if (/^(cell|lattice)$/i.test(p[0])) { const v = p.slice(1, 7).map(Number); if (v.length === 6 && v.every((x) => x > 0)) cell = v as Crystal['cell']; else bad.push(raw); continue; }
    if (!/^[A-Z][a-z]?\d*$/.test(p[0]) || p.length < 4) { bad.push(raw); continue; }
    const f = p.slice(1, 4).map((s) => { const m = /^(-?\d+)\/(\d+)$/.exec(s); return m ? Number(m[1]) / Number(m[2]) : Number(s); });
    if (!f.every(Number.isFinite)) { bad.push(raw); continue; }
    const sp = (p[4] ?? '').toLowerCase().replace('−', '-');
    const m = !sp || sp === '0' || sp === 'none' ? 0 : /^(up|u|\+|↑)$/.test(sp) ? 1 : /^(down|dn|d|-|↓)$/.test(sp) ? -1 : Number(sp);
    if (!Number.isFinite(m)) { bad.push(raw); continue; }
    atoms.push({ el: p[0].replace(/\d+$/, ''), f: f.map(mod1) as V3, m });
  }
  return { crystal: cell && atoms.length ? { cell, atoms } : null, bad };
}

/** Idealised example structures written by fibub (rounded lattice constants; not taken from any database). */
export const EXAMPLES: { id: string; name: string; text: string; note: string }[] = [
  { id: 'rutile', name: 'Rutile-type MO₂ (as proposed for RuO₂)', note: 'd-wave altermagnet in this idealised form; whether real RuO₂ is magnetic at all is still debated.', text: `cell 4.5 4.5 3.1 90 90 90
Ru 0 0 0 up
Ru 1/2 1/2 1/2 down
O 0.3 0.3 0
O 0.7 0.7 0
O 0.8 0.2 1/2
O 0.2 0.8 1/2` },
  { id: 'nias', name: 'NiAs-type MnTe', note: 'g-wave altermagnet; spin-split bands have been seen by ARPES.', text: `cell 4.15 4.15 6.7 90 90 120
Mn 0 0 0 up
Mn 0 0 1/2 down
Te 1/3 2/3 1/4
Te 2/3 1/3 3/4` },
  { id: 'crsb', name: 'NiAs-type CrSb', note: 'g-wave altermagnet with a large spin splitting.', text: `cell 4.1 4.1 5.45 90 90 120
Cr 0 0 0 up
Cr 0 0 1/2 down
Sb 1/3 2/3 1/4
Sb 2/3 1/3 3/4` },
  { id: 'bcc', name: 'Body-centred checkerboard (conventional antiferromagnet)', note: 'The body-centring translation swaps the spins.', text: `cell 3 3 3 90 90 90
Fe 0 0 0 up
Fe 1/2 1/2 1/2 down` },
  { id: 'chain', name: 'Antiferromagnetic chain with inversion centres', note: 'Inversion swaps the spins (PT symmetry).', text: `cell 6 4 4 90 90 90
Mn 0.25 0 0 up
Mn 0.75 0 0 down
O 0 0 0` },
  { id: 'ferri', name: 'Ferrimagnet with unequal moments', note: 'Two sublattices with different moments.', text: `cell 3 3 3 90 90 90
Fe 0 0 0 2.5
Fe 1/2 1/2 1/2 -1.5` },
];
