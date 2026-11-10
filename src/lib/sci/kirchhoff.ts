// #1407 Kirchhoff solver: a DC network drawn on a 3 × 3 grid of junctions. Every resistor or cell is a branch
// with its own current; plain wires join junctions into one. Junction rule at each junction (all but one per
// connected part) and the loop rule round each independent loop (one per branch outside a spanning tree) give as
// many equations as branches, solved by Gaussian elimination. No DOM.
import { pick, r3, type Question } from './elec-quiz.ts';

export const COLS = 3, ROWS = 3;
export type Kind = 'empty' | 'wire' | 'resistor' | 'cell';
/** An edge of the grid: from end a (left or top) to end b (right or bottom). For a cell, plusAtB says which end is +. */
export type Edge = { kind: Kind; R: number; E: number; plusAtB: boolean };
export type EdgeId = string; // 'h<row><col>' joins (col,row)–(col+1,row); 'v<row><col>' joins (col,row)–(col,row+1)
export const NODE_NAMES = 'ABCDEFGHI';

export function edgeIds(): EdgeId[] {
  const ids: EdgeId[] = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS - 1; c++) ids.push(`h${r}${c}`);
  for (let r = 0; r < ROWS - 1; r++) for (let c = 0; c < COLS; c++) ids.push(`v${r}${c}`);
  return ids;
}
/** The two junctions (indices 0..8, row by row) an edge joins, a then b. */
export function ends(id: EdgeId): [number, number] {
  const r = +id[1], c = +id[2];
  return id[0] === 'h' ? [r * COLS + c, r * COLS + c + 1] : [r * COLS + c, (r + 1) * COLS + c];
}
export const edgeName = (id: EdgeId) => { const [a, b] = ends(id); return `${NODE_NAMES[a]}–${NODE_NAMES[b]}`; };

export type Branch = { id: EdgeId; n: number; a: number; b: number; R: number; E: number; kind: 'resistor' | 'cell' };
export type Equation = { kind: 'junction' | 'loop'; label: string; coef: number[]; rhs: number };
export type Solution =
  | { ok: true; branches: (Branch & { I: number; V: number; P: number })[]; equations: Equation[]; group: number[]; potentials: number[] }
  | { ok: false; error: string; branches: Branch[]; equations: Equation[]; group: number[] };

/** Solves A x = b by Gaussian elimination with partial pivoting; null when the system is singular. */
export function gauss(A: number[][], b: number[]): number[] | null {
  const n = b.length, M = A.map((row, i) => [...row, b[i]]);
  for (let k = 0; k < n; k++) {
    let p = k; for (let i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[p][k])) p = i;
    const scale = Math.max(1, ...M.map((r) => Math.abs(r[k])));
    if (Math.abs(M[p][k]) < 1e-10 * scale) return null;
    [M[k], M[p]] = [M[p], M[k]];
    for (let i = k + 1; i < n; i++) { const f = M[i][k] / M[k][k]; if (f) for (let j = k; j <= n; j++) M[i][j] -= f * M[k][j]; }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) { let s = M[i][n]; for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j]; x[i] = s / M[i][i]; }
  return x;
}

export function solve(net: Record<EdgeId, Edge>): Solution {
  // Join junctions linked by plain wire.
  const parent = Array.from({ length: COLS * ROWS }, (_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (const id of edgeIds()) if (net[id]?.kind === 'wire') { const [a, b] = ends(id), ra = find(a), rb = find(b); if (ra !== rb) parent[Math.max(ra, rb)] = Math.min(ra, rb); }
  const group = parent.map((_, i) => find(i));
  const branches: Branch[] = [];
  for (const id of edgeIds()) {
    const e = net[id]; if (!e || (e.kind !== 'resistor' && e.kind !== 'cell')) continue;
    const [a, b] = ends(id);
    // V_a − V_b = I R − E when the + end is b (going a → b the cell raises the potential by E).
    branches.push({ id, n: branches.length + 1, a: group[a], b: group[b], R: Math.max(0, e.R || 0), E: e.kind === 'cell' ? (e.plusAtB ? 1 : -1) * (e.E || 0) : 0, kind: e.kind });
  }
  const B = branches.length, equations: Equation[] = [];
  if (!B) return { ok: false, error: 'Add at least one resistor or cell.', branches, equations, group };
  const nodes = [...new Set(branches.flatMap((x) => [x.a, x.b]))].sort((x, y) => x - y);
  // Spanning tree over the junctions (breadth first), remembering the branch that reached each junction.
  const seen = new Map<number, { via: number; from: number; depth: number }>(), roots: number[] = [];
  for (const s of nodes) {
    if (seen.has(s)) continue;
    roots.push(s); seen.set(s, { via: -1, from: -1, depth: 0 });
    const queue = [s];
    while (queue.length) {
      const u = queue.shift()!;
      branches.forEach((x, k) => {
        const v = x.a === u ? x.b : x.b === u ? x.a : -1;
        if (v >= 0 && !seen.has(v)) { seen.set(v, { via: k, from: u, depth: seen.get(u)!.depth + 1 }); queue.push(v); }
      });
    }
  }
  const tree = new Set([...seen.values()].map((s) => s.via).filter((k) => k >= 0));
  // Junction rule: current leaving each junction adds to zero (skip one junction in each connected part).
  for (const u of nodes) {
    if (roots.includes(u)) continue;
    const coef = branches.map((x) => (x.a === u && x.b !== u ? 1 : x.b === u && x.a !== u ? -1 : 0));
    equations.push({ kind: 'junction', label: NODE_NAMES[u], coef, rhs: 0 });
  }
  // Loop rule round each loop made by a branch outside the tree: Σ s (I R) = Σ s E.
  branches.forEach((x, k) => {
    if (tree.has(k)) return;
    // Path in the tree from x.b back to x.a: walk both up to their common ancestor.
    const s = new Array(B).fill(0); s[k] = 1;
    let u = x.b, w = x.a;
    const up = (node: number) => seen.get(node)!;
    while (u !== w) {
      if (up(u).depth >= up(w).depth) { const t = up(u); s[t.via] += branches[t.via].a === u ? 1 : -1; u = t.from; }
      else { const t = up(w); s[t.via] += branches[t.via].b === w ? 1 : -1; w = t.from; }
    }
    const coef = s.map((si, j) => si * branches[j].R), rhs = s.reduce((acc, si, j) => acc + si * branches[j].E, 0);
    equations.push({ kind: 'loop', label: loopLabel(branches, s), coef, rhs });
  });
  const x = gauss(equations.map((e) => e.coef), equations.map((e) => e.rhs));
  if (!x) {
    const shorted = branches.some((b) => b.a === b.b && b.R === 0 && b.E !== 0);
    return { ok: false, error: shorted ? 'A cell with no resistance is joined end to end by plain wire (a short circuit): the current would be endless. Give it an internal resistance or add a resistor.' : 'These equations have no single answer: somewhere ideal cells or plain wires make a loop with no resistance in it. Add a resistor or an internal resistance to that loop.', branches, equations, group };
  }
  // Potentials: 0 V at each part's first junction, then V_b = V_a − I R + E along the tree.
  const potentials = new Array(COLS * ROWS).fill(NaN);
  for (const r of roots) potentials[r] = 0;
  const order = [...seen.entries()].sort((p, q) => p[1].depth - q[1].depth);
  for (const [node, t] of order) if (t.via >= 0) { const br = branches[t.via], I = x[t.via]; potentials[node] = br.b === node ? potentials[t.from] - I * br.R + br.E : potentials[t.from] + I * br.R - br.E; }
  for (let i = 0; i < potentials.length; i++) if (Number.isNaN(potentials[i]) && !Number.isNaN(potentials[group[i]])) potentials[i] = potentials[group[i]];
  return { ok: true, equations, group, potentials, branches: branches.map((b, k) => { const I = clean(x[k]); return { ...b, I, V: I * b.R, P: b.kind === 'cell' ? I * b.E : I * I * b.R }; }) };
}
const clean = (v: number) => (Math.abs(v) < 1e-12 ? 0 : v);

/** The loop as a list of junctions, e.g. "A → B → E → D → A", following the loop's direction. */
function loopLabel(branches: Branch[], s: number[]) {
  const used = branches.map((b, k) => ({ b, s: s[k] })).filter((u) => u.s !== 0);
  if (used.length === 1) return `${NODE_NAMES[used[0].b.a]} → ${NODE_NAMES[used[0].b.a]} (through I${sub(used[0].b.n)})`;
  const start = used[0].s > 0 ? used[0].b.a : used[0].b.b, names = [NODE_NAMES[start]];
  let at = start; const left = [...used];
  for (let i = 0; i < used.length && left.length; i++) {
    const k = left.findIndex((u) => (u.s > 0 ? u.b.a : u.b.b) === at);
    if (k < 0) break;
    const u = left.splice(k, 1)[0]; at = u.s > 0 ? u.b.b : u.b.a; names.push(NODE_NAMES[at]);
  }
  return `${names.join(' → ')} (through ${used.map((u) => 'I' + sub(u.b.n)).join(', ')})`;
}

const SUB = '₀₁₂₃₄₅₆₇₈₉';
export const sub = (n: number) => String(n).split('').map((d) => SUB[+d]).join('');
const fmt = (v: number) => String(Number(v.toPrecision(4)));
/** "2 I₁ − 6 I₃ = 6" style text for an equation. */
export function eqText(e: Equation) {
  let s = '';
  e.coef.forEach((c, j) => {
    if (!c) return;
    const a = Math.abs(c), t = `${a === 1 ? '' : fmt(a) + ' '}I${sub(j + 1)}`;
    s += s ? (c < 0 ? ` − ${t}` : ` + ${t}`) : c < 0 ? `−${t}` : t;
  });
  return `${s || '0'} = ${e.rhs < 0 ? '−' + fmt(-e.rhs) : fmt(e.rhs)}`;
}

const E = (kind: Kind, R = 0, Ev = 0, plusAtB = false): Edge => ({ kind, R, E: Ev, plusAtB });
/** Ready-made networks. */
export const PRESETS: Record<string, { name: string; net: Record<EdgeId, Edge> }> = {
  twoloop: { name: 'Two cells, three resistors', net: { h00: E('resistor', 2), h01: E('resistor', 4), v00: E('cell', 0, 6), v01: E('resistor', 6), v02: E('cell', 0, 4), h10: E('wire'), h11: E('wire') } },
  series: { name: 'One cell, series and parallel', net: { v00: E('cell', 0.5, 9), h00: E('resistor', 3), h01: E('wire'), v01: E('resistor', 6), v02: E('resistor', 12), h10: E('wire'), h11: E('wire') } },
  parallelcells: { name: 'Two cells in parallel', net: { v00: E('cell', 1, 12), v01: E('cell', 2, 10), v02: E('resistor', 5), h00: E('wire'), h01: E('wire'), h10: E('wire'), h11: E('wire') } },
  ladder: { name: 'Ladder of four resistors', net: { v00: E('cell', 0, 10), h00: E('resistor', 2), v01: E('resistor', 4), h01: E('resistor', 2), v02: E('resistor', 4), v10: E('wire'), v11: E('wire'), v12: E('wire'), h20: E('wire'), h21: E('wire') } },
};

/** The two-cell, three-resistor network in closed form (Millman): potential of the top rail and the three currents. */
export function twoLoop(E1: number, R1: number, E2: number, R2: number, R3: number) {
  const V = (E1 / R1 + E2 / R2) / (1 / R1 + 1 / R2 + 1 / R3);
  return { V, I1: (E1 - V) / R1, I2: (E2 - V) / R2, I3: V / R3 };
}

export function questions(rng: () => number = Math.random): Question[] {
  const E1 = pick(rng, [6, 9, 12]), E2 = pick(rng, [2, 3, 4]), Ra = pick(rng, [1, 2, 3]), Rb = pick(rng, [2, 4, 5]);
  const Is = (E1 - E2) / (Ra + Rb);
  const i1 = pick(rng, [1.5, 2, 2.5, 3]), i2 = pick(rng, [0.5, 1, 1.2]), i3 = i1 - i2;
  const e1 = pick(rng, [6, 10, 12]), e2 = pick(rng, [2, 4, 6]), r1 = pick(rng, [2, 4]), r2 = pick(rng, [2, 3, 6]), rc = pick(rng, [3, 6, 12]);
  const t = twoLoop(e1, r1, e2, r2, rc);
  return [
    { text: `A ${E1} V cell and a ${E2} V cell are joined in one loop with their + ends facing each other, with a ${Ra} Ω and a ${Rb} Ω resistor. What current flows, in amperes?`, answer: Is, unit: 'A', tol: 0.02,
      steps: ['Loop rule: the emfs oppose, so the net emf is the difference.', `I = (${E1} − ${E2}) / (${Ra} + ${Rb}) = ${r3(Is)} A`] },
    { text: `At a junction, ${i1} A flows in along one wire and ${i2} A flows out along another. How much flows out along the third wire, in amperes?`, answer: i3, unit: 'A', tol: 0.02,
      steps: ['Junction rule: current in = current out.', `${i1} = ${i2} + I, so I = ${r3(i3)} A`] },
    { text: `Two cells, ${e1} V with ${r1} Ω in series and ${e2} V with ${r2} Ω in series, are connected in parallel (+ to +) across a ${rc} Ω resistor. What is the current in the ${rc} Ω resistor, in amperes?`, answer: t.I3, unit: 'A', tol: 0.02,
      steps: ['Call V the voltage across the resistor. Junction rule: (E₁ − V)/R₁ + (E₂ − V)/R₂ = V/R₃.', `V (1/${r1} + 1/${r2} + 1/${rc}) = ${e1}/${r1} + ${e2}/${r2}, so V = ${r3(t.V)} V`, `I = V / ${rc} = ${r3(t.I3)} A`] },
    { text: `In the same circuit, what current flows through the ${e1} V cell, in amperes?`, answer: t.I1, unit: 'A', tol: 0.02,
      steps: [`I₁ = (E₁ − V) / R₁ = (${e1} − ${r3(t.V)}) / ${r1} = ${r3(t.I1)} A`] },
  ];
}
