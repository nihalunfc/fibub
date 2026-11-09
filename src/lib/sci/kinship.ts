// Kinship diagrams: people, their parents and their marriages; kin type notation from Ego (FBD, MZS…) worked
// out from the graph, generations, and a layered layout for drawing (see kinship-draw.ts).

export type Sex = 'm' | 'f' | 'u';
export type Person = { id: string; name: string; sex: Sex; dead?: boolean; parents: string[] };
export type Marriage = { a: string; b: string; divorced?: boolean };
export type Kin = { ego: string; people: Person[]; marriages: Marriage[] };

/** Primitive kin types: parent, child, sibling and spouse, by the sex of the person reached. */
const LETTER = {
  up: { m: 'F', f: 'M', u: 'P' },
  down: { m: 'S', f: 'D', u: 'C' },
  sib: { m: 'B', f: 'Z', u: 'G' },
  sp: { m: 'H', f: 'W', u: 'E' },
} as const;
export const WORD: Record<string, string> = { F: 'father', M: 'mother', P: 'parent', S: 'son', D: 'daughter', C: 'child', B: 'brother', Z: 'sister', G: 'sibling', H: 'husband', W: 'wife', E: 'spouse' };

type Step = { to: string; kind: keyof typeof LETTER };

/** Check ids, parents and marriages; returns a list of problems in plain words (empty when fine). */
export function validate(k: Kin): string[] {
  const out: string[] = [], ids = new Set<string>();
  for (const p of k.people) { if (ids.has(p.id)) out.push(`Two people share the id ${p.id}`); ids.add(p.id); }
  const byId = new Map(k.people.map((p) => [p.id, p]));
  if (!byId.has(k.ego)) out.push('Choose who is Ego');
  for (const p of k.people) {
    if (p.parents.length > 2) out.push(`${p.name} has more than two parents`);
    for (const q of p.parents) { if (!byId.has(q)) out.push(`${p.name} has a parent who is not in the list`); if (q === p.id) out.push(`${p.name} cannot be their own parent`); }
    if (p.parents.length === 2 && p.parents[0] === p.parents[1]) out.push(`${p.name} has the same person as both parents`);
  }
  for (const m of k.marriages) {
    if (!byId.has(m.a) || !byId.has(m.b)) out.push('A marriage names someone who is not in the list');
    else if (m.a === m.b) out.push(`${byId.get(m.a)!.name} cannot marry themselves`);
  }
  // A person cannot be their own ancestor.
  const state = new Map<string, number>();
  const visit = (id: string): boolean => {
    if (state.get(id) === 1) return true; if (state.get(id) === 2) return false;
    state.set(id, 1);
    for (const q of byId.get(id)?.parents ?? []) if (byId.has(q) && visit(q)) return true;
    state.set(id, 2); return false;
  };
  for (const p of k.people) if (visit(p.id)) { out.push(`${p.name} is shown as their own ancestor`); break; }
  return out;
}

/** Edges of the kinship graph from each person, in a fixed order: parents, siblings, spouses, children. */
export function edges(k: Kin): Map<string, Step[]> {
  const E = new Map<string, Step[]>(k.people.map((p) => [p.id, []]));
  const key = (p: Person) => [...p.parents].sort().join('|');
  for (const p of k.people) {
    for (const q of p.parents) E.get(p.id)?.push({ to: q, kind: 'up' });
    // Full siblings: the same known parent or parents.
    if (p.parents.length) for (const s of k.people) if (s.id !== p.id && key(s) === key(p)) E.get(p.id)!.push({ to: s.id, kind: 'sib' });
  }
  for (const m of k.marriages) { E.get(m.a)?.push({ to: m.b, kind: 'sp' }); E.get(m.b)?.push({ to: m.a, kind: 'sp' }); }
  for (const p of k.people) for (const q of p.parents) E.get(q)?.push({ to: p.id, kind: 'down' });
  return E;
}

/** generation: +1 for Ego's parents' generation, −1 for children's. */
export type Relation = { id: string; code: string; words: string; generation: number; steps: number; affinal: boolean };

/**
 * Kin type of everyone from Ego: the shortest chain of parent, child, sibling and spouse links (a spouse link
 * counts very slightly more, so blood chains win ties). Ego's code is "Ego"; unconnected people get "".
 */
export function relations(k: Kin): Map<string, Relation> {
  const byId = new Map(k.people.map((p) => [p.id, p])), E = edges(k);
  const cost = new Map<string, number>([[k.ego, 0]]), prev = new Map<string, { from: string; letter: string; kind: string }>();
  const done = new Set<string>();
  // Dijkstra on a small graph: a simple scan for the cheapest open node is fine.
  for (;;) {
    let best = '', bc = Infinity;
    for (const [id, c] of cost) if (!done.has(id) && c < bc - 1e-12) { best = id; bc = c; }
    if (!best) break;
    done.add(best);
    for (const s of E.get(best) ?? []) {
      const c = bc + (s.kind === 'sp' ? 1.001 : 1);
      if (!done.has(s.to) && c < (cost.get(s.to) ?? Infinity) - 1e-9) { cost.set(s.to, c); prev.set(s.to, { from: best, letter: LETTER[s.kind][byId.get(s.to)!.sex], kind: s.kind }); }
    }
  }
  const out = new Map<string, Relation>();
  for (const p of k.people) {
    if (p.id === k.ego) { out.set(p.id, { id: p.id, code: 'Ego', words: 'Ego', generation: 0, steps: 0, affinal: false }); continue; }
    if (!prev.has(p.id)) { out.set(p.id, { id: p.id, code: '', words: 'not connected to Ego in this diagram', generation: NaN, steps: NaN, affinal: false }); continue; }
    const letters: string[] = []; let gen = 0, aff = false;
    for (let id = p.id; id !== k.ego;) { const s = prev.get(id)!; letters.unshift(s.letter); gen += s.kind === 'up' ? -1 : s.kind === 'down' ? 1 : 0; if (s.kind === 'sp') aff = true; id = s.from; }
    out.set(p.id, { id: p.id, code: letters.join(''), words: letters.map((l) => WORD[l]).join("'s "), generation: -gen || 0, steps: letters.length, affinal: aff });
  }
  return out;
}

/** Couples that have children or are married: the "unions" descent lines hang from. */
export type Union = { a: string; b: string | null; married: boolean; divorced: boolean; children: string[] };
export function unions(k: Kin): Union[] {
  const list: Union[] = [], find = (a: string, b: string | null) => list.find((u) => (u.a === a && u.b === b) || (u.a === b && u.b === a));
  for (const m of k.marriages) if (!find(m.a, m.b)) list.push({ a: m.a, b: m.b, married: true, divorced: !!m.divorced, children: [] });
  for (const p of k.people) {
    if (!p.parents.length) continue;
    const [a, b = null] = p.parents;
    let u = find(a, b);
    if (!u) { u = { a, b, married: false, divorced: false, children: [] }; list.push(u); }
    u.children.push(p.id);
  }
  return list;
}

export type Placed = { id: string; x: number; gen: number };
export type Layout = { pos: Map<string, Placed>; gens: number; width: number; unions: Union[] };

/** Pool-adjacent-violators: the non-decreasing sequence closest (least squares) to y. */
function isotonic(y: number[]): number[] {
  const blocks: { v: number; n: number }[] = [];
  for (const v of y) { blocks.push({ v, n: 1 }); while (blocks.length > 1 && blocks[blocks.length - 2].v > blocks[blocks.length - 1].v) { const b = blocks.pop()!, a = blocks[blocks.length - 1]; a.v = (a.v * a.n + b.v * b.n) / (a.n + b.n); a.n += b.n; } }
  return blocks.flatMap((b) => Array(b.n).fill(b.v));
}

/**
 * A layered layout: one row per generation, spouses side by side, children under their parents. `slot` is the
 * horizontal room for one person. x is the person's centre.
 */
export function layout(k: Kin, slot = 100, gap = 20): Layout {
  const ids = k.people.map((p) => p.id), byId = new Map(k.people.map((p) => [p.id, p]));
  const U = unions(k);
  // Generations: breadth-first from Ego, then from anyone not yet reached.
  const gen = new Map<string, number>();
  const nb = (id: string): [string, number][] => [
    ...byId.get(id)!.parents.map((q) => [q, -1] as [string, number]),
    ...k.people.filter((c) => c.parents.includes(id)).map((c) => [c.id, 1] as [string, number]),
    ...U.filter((u) => u.b && (u.a === id || u.b === id)).map((u) => [u.a === id ? u.b! : u.a, 0] as [string, number]),
  ];
  const starts = [k.ego, ...ids].filter((id) => byId.has(id));
  for (const s of starts) {
    if (gen.has(s)) continue;
    gen.set(s, 0); const queue = [s];
    while (queue.length) { const id = queue.shift()!; for (const [o, d] of nb(id)) if (!gen.has(o)) { gen.set(o, gen.get(id)! + d); queue.push(o); } }
  }
  const g0 = Math.min(...gen.values()); for (const [id, g] of gen) gen.set(id, g - g0);
  const G = Math.max(...gen.values()) + 1;

  // Units: chains of spouses in the same generation.
  const spouses = new Map<string, string[]>(ids.map((id) => [id, []]));
  for (const u of U) if (u.b && gen.get(u.a) === gen.get(u.b)) { spouses.get(u.a)!.push(u.b); spouses.get(u.b)!.push(u.a); }
  const unitOf = new Map<string, number>(), units: string[][] = [];
  for (const id of ids) {
    if (unitOf.has(id)) continue;
    const comp: string[] = [], st = [id]; const seen = new Set([id]);
    while (st.length) { const x = st.pop()!; comp.push(x); for (const y of spouses.get(x)!) if (!seen.has(y)) { seen.add(y); st.push(y); } }
    let order: string[];
    const hub = comp.find((x) => spouses.get(x)!.length > 2);
    if (hub) { const rest = comp.filter((x) => x !== hub), h = Math.ceil(rest.length / 2); order = [...rest.slice(0, h), hub, ...rest.slice(h)]; }
    else {
      const start = comp.find((x) => spouses.get(x)!.length <= 1) ?? comp[0];
      order = []; const vis = new Set<string>(); let cur: string | undefined = start;
      while (cur) { order.push(cur); vis.add(cur); cur = spouses.get(cur)!.find((y) => !vis.has(y)); }
      for (const x of comp) if (!vis.has(x)) order.push(x);
      // Men to the left of a couple, as most diagrams draw them.
      if (order.length === 2 && byId.get(order[0])!.sex === 'f' && byId.get(order[1])!.sex === 'm') order.reverse();
    }
    const n = units.length; units.push(order); for (const x of order) unitOf.set(x, n);
  }
  const rows: number[][] = Array.from({ length: G }, () => []);
  units.forEach((u, i) => rows[gen.get(u[0])!].push(i));

  // Ordering by barycentres, a few sweeps down and up.
  const rank = new Map<string, number>();
  const setRanks = () => rows.forEach((r) => { let i = 0; for (const ui of r) for (const id of units[ui]) rank.set(id, i++); });
  setRanks();
  const meanOf = (xs: number[], dflt: number) => (xs.length ? xs.reduce((s, v) => s + v, 0) / xs.length : dflt);
  for (let sweep = 0; sweep < 8; sweep++) {
    const down = sweep % 2 === 0;
    const order = down ? rows.keys() : [...rows.keys()].reverse();
    for (const g of order) {
      const key = new Map<number, number>();
      for (const ui of rows[g]) {
        const own = meanOf(units[ui].map((id) => rank.get(id)!), 0);
        const rel = units[ui].flatMap((id) => (down ? byId.get(id)!.parents : k.people.filter((c) => c.parents.includes(id)).map((c) => c.id)).filter((o) => gen.get(o) === g + (down ? -1 : 1)).map((o) => rank.get(o)!));
        key.set(ui, meanOf(rel, own));
      }
      rows[g].sort((a, b) => key.get(a)! - key.get(b)! || 0);
      setRanks();
    }
  }

  // Coordinates: each row's units are kept in order and pulled towards their parents (or children).
  const x = new Map<string, number>();
  const unitW = (ui: number) => units[ui].length * slot;
  rows.forEach((r) => { let cx = 0; for (const ui of r) { units[ui].forEach((id, j) => x.set(id, cx + j * slot + slot / 2)); cx += unitW(ui) + gap; } });
  const unionMid = (u: Union) => (u.b ? (x.get(u.a)! + x.get(u.b)!) / 2 : x.get(u.a)!);
  const placeRow = (g: number, want: Map<number, number>) => {
    // want: desired left edge of each unit. Least-squares fit keeping order and spacing (isotonic regression).
    const r = rows[g]; let off = 0; const offs: number[] = [];
    for (const ui of r) { offs.push(off); off += unitW(ui) + gap; }
    const v = isotonic(r.map((ui, i) => want.get(ui)! - offs[i]));
    r.forEach((ui, i) => units[ui].forEach((id, j) => x.set(id, v[i] + offs[i] + j * slot + slot / 2)));
  };
  const left = (ui: number) => x.get(units[ui][0])! - slot / 2;
  for (let it = 0; it < 12; it++) {
    const down = it % 2 === 0;
    const order = down ? [...rows.keys()].slice(1) : [...rows.keys()].reverse().slice(1);
    for (const g of order) {
      const want = new Map<number, number>();
      for (const ui of rows[g]) {
        const targets: number[] = [];
        units[ui].forEach((id, j) => {
          if (down) {
            const u = U.find((u2) => u2.children.includes(id));
            if (u && gen.get(u.a) === g - 1) {
              // Centre the sibling group under the parents: this child's place in its group.
              const sibs = u.children.filter((c) => gen.get(c) === g).sort((a, b) => x.get(a)! - x.get(b)!);
              const groupMid = (x.get(sibs[0])! + x.get(sibs[sibs.length - 1])!) / 2;
              targets.push(left(ui) + (unionMid(u) - groupMid));
            }
          } else {
            for (const u of U.filter((u2) => (u2.a === id || u2.b === id) && u2.children.length)) {
              const kids = u.children.filter((c) => gen.get(c) === g + 1); if (!kids.length) continue;
              const km = kids.reduce((s, c) => s + x.get(c)!, 0) / kids.length;
              targets.push(left(ui) + (km - unionMid(u)));
            }
          }
          void j;
        });
        want.set(ui, targets.length ? meanOf(targets, left(ui)) : left(ui));
      }
      placeRow(g, want);
    }
  }
  // Shift so the leftmost person starts at 0.
  const minX = Math.min(...x.values()) - slot / 2;
  const pos = new Map<string, Placed>();
  for (const id of ids) pos.set(id, { id, x: x.get(id)! - minX, gen: gen.get(id)! });
  const width = Math.max(...[...pos.values()].map((p) => p.x)) + slot / 2;
  return { pos, gens: G, width, unions: U };
}

/** A kinship file as saved by the page. Throws with a plain message when it is not one. */
export function fromJson(text: string): Kin {
  let d: unknown;
  try { d = JSON.parse(text); } catch { throw new Error('This file is not valid JSON'); }
  const o = d as Record<string, unknown>;
  if (!o || !Array.isArray(o.people) || !Array.isArray(o.marriages)) throw new Error('This is not a kinship diagram file (it needs "people" and "marriages")');
  const people: Person[] = (o.people as Record<string, unknown>[]).map((p, i) => {
    const id = String(p.id ?? ''), name = String(p.name ?? '').slice(0, 60), sex = p.sex === 'm' || p.sex === 'f' ? p.sex : 'u';
    if (!id) throw new Error(`Person ${i + 1} has no id`);
    return { id, name: name || id, sex, dead: !!p.dead, parents: Array.isArray(p.parents) ? (p.parents as unknown[]).map(String).slice(0, 2) : [] };
  });
  const marriages: Marriage[] = (o.marriages as Record<string, unknown>[]).map((m) => ({ a: String(m.a ?? ''), b: String(m.b ?? ''), divorced: !!m.divorced }));
  if (people.length > 400) throw new Error('This file has more than 400 people, too many to draw here');
  const k = { ego: String(o.ego ?? people[0]?.id ?? ''), people, marriages };
  const bad = validate(k);
  if (bad.length) throw new Error(bad[0]);
  return k;
}
export const toJson = (k: Kin) => JSON.stringify({ format: 'fibub-kinship', version: 1, ego: k.ego, people: k.people.map((p) => ({ id: p.id, name: p.name, sex: p.sex, dead: !!p.dead, parents: p.parents })), marriages: k.marriages.map((m) => ({ a: m.a, b: m.b, divorced: !!m.divorced })) }, null, 2);
