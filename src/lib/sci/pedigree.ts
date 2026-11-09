// Pedigree checks, inbreeding and coancestry for plant (or animal) breeding, by the tabular method. Plain
// TypeScript, no DOM. Method: the numerator relationship matrix A built in pedigree order (Emik and Terrill 1949;
// Henderson 1976): a_ii = 1 + a_sd / 2 (or 1 + F for a founder), a_ij = (a_js + a_jd) / 2. The inbreeding
// coefficient is F_i = a_ii - 1 and the coancestry (coefficient of parentage) of two plants is f_ij = a_ij / 2,
// which is also the inbreeding coefficient their offspring would have.

export type Entry = { id: string; female: string | null; male: string | null; f0: number };
export type Ped = { ids: string[]; entries: Entry[]; index: Map<string, number>; gen: number[]; A: Float64Array; n: number; added: string[]; warnings: string[] };

const UNKNOWN = /^(|0|-|–|\?|na|n\/a|unknown|none|\.)$/i;
const clean = (s: string | undefined) => { const t = (s ?? '').trim(); return UNKNOWN.test(t) ? null : t; };

/** Split pasted text into rows of cells (tabs, commas or semicolons; runs of spaces only when nothing else). */
export function cells(text: string): string[][] {
  const lines = text.replace(/\r\n?/g, '\n').split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
  const sample = lines.slice(0, 20).join('\n');
  const sep = sample.includes('\t') ? /\t/ : sample.includes(';') ? /;/ : sample.includes(',') ? /,/ : /\s+/;
  return lines.map((l) => l.trim().split(sep).map((c) => c.trim()));
}
const isHeader = (r: string[]) => /^(id|plant|name|line|entry|individual|animal|cross|genotype)$/i.test(r[0] ?? '') || /female|male|mother|father|dam|sire|seed|pollen|parent/i.test(r.slice(1, 3).join(' '));

/** Read pedigree rows: id, female parent, male parent, and an optional founder inbreeding (0 to 1). */
export function readPedigree(text: string): Entry[] {
  const rows = cells(text);
  if (rows.length && isHeader(rows[0])) rows.shift();
  return rows.map((r, k) => {
    const id = (r[0] ?? '').trim();
    if (!id) throw new Error(`Line ${k + 1} has no plant name.`);
    const f0s = (r[3] ?? '').trim().replace(',', '.'), f0 = f0s === '' ? 0 : Number(f0s);
    if (!(f0 >= 0 && f0 <= 1)) throw new Error(`Line ${k + 1} (${id}): the founder inbreeding must be a number from 0 to 1.`);
    return { id, female: clean(r[1]), male: clean(r[2]), f0 };
  });
}

/** Read planned crosses: female, male, and an optional cross name. */
export function readPlan(text: string): { name: string; female: string; male: string }[] {
  const rows = cells(text);
  if (rows.length && /female|male|mother|father|seed|pollen|parent/i.test(rows[0].join(' '))) rows.shift();
  return rows.map((r, k) => {
    const female = (r[0] ?? '').trim(), male = (r[1] ?? '').trim();
    if (!female || !male) throw new Error(`Planned cross on line ${k + 1} needs a female and a male parent.`);
    return { name: (r[2] ?? '').trim() || `${female} × ${male}`, female, male };
  });
}

export const MAX = 2500;

/** Check the pedigree, order it parents first, and build the relationship matrix. Throws on errors that stop the sums. */
export function build(entries: Entry[], opts: { sexCheck?: boolean } = {}): Ped {
  const warnings: string[] = [];
  const byId = new Map<string, Entry>();
  for (const e of entries) {
    const old = byId.get(e.id);
    if (old) {
      if (old.female !== e.female || old.male !== e.male) throw new Error(`${e.id} is listed twice with different parents (${old.female ?? '?'} × ${old.male ?? '?'} and ${e.female ?? '?'} × ${e.male ?? '?'}).`);
      warnings.push(`${e.id} is listed twice; the repeat was ignored.`); continue;
    }
    if (e.female === e.id || e.male === e.id) throw new Error(`${e.id} is listed as its own parent.`);
    byId.set(e.id, { ...e });
  }
  const added: string[] = [];
  for (const e of [...byId.values()]) for (const p of [e.female, e.male]) if (p && !byId.has(p)) { byId.set(p, { id: p, female: null, male: null, f0: 0 }); added.push(p); }
  if (byId.size > MAX) throw new Error(`That is ${byId.size.toLocaleString('en')} plants; this tool takes up to ${MAX.toLocaleString('en')}.`);
  for (const e of byId.values()) if (e.f0 > 0 && (e.female || e.male)) warnings.push(`${e.id} has parents, so its founder inbreeding (${e.f0}) is ignored; it is worked out from the parents.`);
  if (opts.sexCheck) {
    const asF = new Set([...byId.values()].map((e) => e.female).filter(Boolean)), asM = new Set([...byId.values()].map((e) => e.male).filter(Boolean));
    for (const e of byId.values()) if (e.female && e.female === e.male) { asF.delete(e.female); asM.delete(e.female); }
    const both = [...asF].filter((x) => asM.has(x));
    if (both.length) warnings.push(`Used as both a female and a male parent: ${both.slice(0, 12).join(', ')}${both.length > 12 ? ` and ${both.length - 12} more` : ''}. Fine for hermaphrodite plants; check it if sexes are separate.`);
  }
  // Order parents before offspring (Kahn's algorithm); anything left over is in a loop.
  const kids = new Map<string, string[]>(), need = new Map<string, number>();
  for (const e of byId.values()) {
    const ps = [...new Set([e.female, e.male].filter((p): p is string => !!p))];
    need.set(e.id, ps.length);
    for (const p of ps) { if (!kids.has(p)) kids.set(p, []); kids.get(p)!.push(e.id); }
  }
  const order: string[] = [], queue = [...byId.keys()].filter((k) => need.get(k) === 0);
  while (queue.length) { const x = queue.shift()!; order.push(x); for (const c of kids.get(x) ?? []) { need.set(c, need.get(c)! - 1); if (need.get(c) === 0) queue.push(c); } }
  if (order.length < byId.size) {
    const left = [...byId.keys()].filter((k) => need.get(k)! > 0);
    throw new Error(`The pedigree has a loop: a plant is listed as its own ancestor. Plants caught in or after the loop: ${left.slice(0, 10).join(', ')}${left.length > 10 ? ' ...' : ''}.`);
  }
  const n = order.length, index = new Map(order.map((id, i) => [id, i])), list = order.map((id) => byId.get(id)!);
  const A = new Float64Array(n * n), gen = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    const e = list[i], s = e.female != null ? index.get(e.female)! : -1, d = e.male != null ? index.get(e.male)! : -1;
    gen[i] = Math.max(s >= 0 ? gen[s] + 1 : 0, d >= 0 ? gen[d] + 1 : 0);
    for (let j = 0; j < i; j++) {
      const v = ((s >= 0 ? A[j * n + s] : 0) + (d >= 0 ? A[j * n + d] : 0)) / 2;
      A[i * n + j] = v; A[j * n + i] = v;
    }
    A[i * n + i] = s >= 0 && d >= 0 ? 1 + A[s * n + d] / 2 : s < 0 && d < 0 ? 1 + e.f0 : 1;
  }
  return { ids: order, entries: list, index, gen, A, n, added, warnings };
}

/** Inbreeding coefficient F of a plant. */
export const inbreeding = (P: Ped, id: string) => P.A[P.index.get(id)! * (P.n + 1)] - 1;
/** Coancestry (coefficient of parentage) of two plants: the F their offspring would have. */
export function coancestry(P: Ped, a: string, b: string) {
  const i = P.index.get(a), j = P.index.get(b);
  if (i == null) throw new Error(`${a} is not in the pedigree.`);
  if (j == null) throw new Error(`${b} is not in the pedigree.`);
  return P.A[i * P.n + j] / 2;
}

/** The plant and all its ancestors, in pedigree order. */
export function ancestors(P: Ped, id: string): string[] {
  const keep = new Set<string>(), stack = [id];
  while (stack.length) { const x = stack.pop()!; if (keep.has(x)) continue; keep.add(x); const e = P.entries[P.index.get(x)!]; for (const p of [e.female, e.male]) if (p) stack.push(p); }
  return P.ids.filter((x) => keep.has(x));
}

/** Made-up example: four founder lines and crosses that show selfing, full-sib, half-sib and backcross matings. */
export const EXAMPLE_PED = `plant\tfemale\tmale
P1\t-\t-
P2\t-\t-
P3\t-\t-
P4\t-\t-
F1a\tP1\tP2
F1b\tP3\tP2
F1c\tP1\tP2
F2a\tF1a\tF1a
X1\tF1a\tF1c
X2\tF1a\tF1b
BC1\tF1a\tP1
S2\tF2a\tF2a
X3\tX2\tP4`;
export const EXAMPLE_PLAN = `female\tmale
X1\tX2
BC1\tF2a
S2\tX3
P4\tP3`;
