// Pedigree analyser (school level, Class 12 biology): for a three-generation family with affected and unaffected
// members, test which single-gene inheritance patterns fit (autosomal dominant or recessive, X-linked dominant or
// recessive, Y-linked) with full penetrance, by trying every genotype assignment; give the rule a pattern breaks and
// the people who must be carriers. Teaching examples only. Pure functions, no DOM.

export type Sex = 'M' | 'F';
export type Person = { id: string; sex: Sex; father?: string; mother?: string; affected: boolean };
export type Mode = 'AD' | 'AR' | 'XD' | 'XR' | 'Y';
export const MODES: { id: Mode; name: string }[] = [
  { id: 'AD', name: 'Autosomal dominant' }, { id: 'AR', name: 'Autosomal recessive' },
  { id: 'XD', name: 'X-linked dominant' }, { id: 'XR', name: 'X-linked recessive' }, { id: 'Y', name: 'Y-linked' },
];

/** Copies of the trait allele a person can carry. Males have one X (0 or 1); Y only in males. */
function genotypes(mode: Mode, sex: Sex): number[] {
  if (mode === 'Y') return sex === 'M' ? [0, 1] : [0];
  if ((mode === 'XD' || mode === 'XR') && sex === 'M') return [0, 1];
  return [0, 1, 2];
}
export function affectedBy(mode: Mode, sex: Sex, k: number): boolean {
  switch (mode) {
    case 'AD': case 'XD': return k >= 1;
    case 'AR': return k === 2;
    case 'XR': return sex === 'M' ? k === 1 : k === 2;
    case 'Y': return sex === 'M' && k === 1;
  }
}
/** Gametes (copies passed on) of a parent with k copies, for an autosome or the mother's X. */
const gam = (k: number) => (k === 0 ? [0] : k === 1 ? [0, 1] : [1]);
function childOk(mode: Mode, sex: Sex, k: number, fk: number, mk: number): boolean {
  if (mode === 'AD' || mode === 'AR') return gam(fk).some((a) => gam(mk).some((b) => a + b === k));
  if (mode === 'Y') return sex === 'M' ? k === fk : k === 0;
  // X-linked: a son's only X is from his mother; a daughter gets her father's X plus one of her mother's
  return sex === 'M' ? gam(mk).includes(k) : gam(mk).some((b) => fk + b === k);
}

/** Try every assignment. Returns whether the mode fits and, per person, the copy numbers seen in fitting assignments. */
export function fit(people: Person[], mode: Mode) {
  const byId = new Map(people.map((p) => [p.id, p]));
  // parents before children
  const order: Person[] = [], done = new Set<string>();
  const visit = (p: Person) => { if (done.has(p.id)) return; for (const q of [p.father, p.mother]) if (q) visit(byId.get(q)!); done.add(p.id); order.push(p); };
  people.forEach(visit);
  const seen = new Map<string, Set<number>>(people.map((p) => [p.id, new Set<number>()]));
  const g = new Map<string, number>();
  let count = 0;
  const go = (i: number) => {
    if (i === order.length) { count++; for (const [id, k] of g) seen.get(id)!.add(k); return; }
    const p = order[i];
    for (const k of genotypes(mode, p.sex)) {
      if (affectedBy(mode, p.sex, k) !== p.affected) continue;
      if (p.father && p.mother && !childOk(mode, p.sex, k, g.get(p.father)!, g.get(p.mother)!)) continue;
      g.set(p.id, k); go(i + 1); g.delete(p.id);
    }
  };
  go(0);
  const recessive = mode === 'AR' || mode === 'XR';
  const carriers = recessive ? people.filter((p) => !p.affected && seen.get(p.id)!.size > 0 && [...seen.get(p.id)!].every((k) => k >= 1)).map((p) => p.id) : [];
  return { fits: count > 0, assignments: count, carriers };
}

/** The simple rule each pattern breaks, read straight off parent-child pairs (null if none is broken). */
export function reason(people: Person[], mode: Mode): string | null {
  const byId = new Map(people.map((p) => [p.id, p]));
  for (const c of people) {
    if (mode === 'Y' && c.affected && c.sex === 'F') return `${c.id} is a female and affected, but females have no Y chromosome.`;
    const f = c.father ? byId.get(c.father) : undefined, m = c.mother ? byId.get(c.mother) : undefined;
    if (!f || !m) continue;
    switch (mode) {
      case 'AD': if (c.affected && !f.affected && !m.affected) return `${c.id} is affected but neither parent is: a dominant trait cannot skip a generation.`; break;
      case 'AR': if (!c.affected && f.affected && m.affected) return `${c.id} is unaffected but both parents are affected: two affected parents can only pass on the recessive allele.`; break;
      case 'XD':
        if (f.affected && c.sex === 'F' && !c.affected) return `${f.id} is an affected father with an unaffected daughter (${c.id}): he gives every daughter his X.`;
        if (c.sex === 'M' && c.affected && !m.affected) return `${c.id} is an affected son of an unaffected mother: a son's X comes from his mother.`;
        if (c.affected && !f.affected && !m.affected) return `${c.id} is affected but neither parent is.`;
        break;
      case 'XR':
        if (m.affected && c.sex === 'M' && !c.affected) return `${m.id} is an affected mother with an unaffected son (${c.id}): both her X chromosomes carry the allele.`;
        if (c.sex === 'F' && c.affected && !f.affected) return `${c.id} is an affected daughter of an unaffected father: she needs the allele on her father's X too.`;
        if (c.sex === 'F' && !c.affected && f.affected && m.affected) return `${c.id} is an unaffected daughter of two affected parents: she must get the allele from both.`;
        break;
      case 'Y':
        if (c.sex === 'M' && c.affected !== f.affected) return `${f.id} and his son ${c.id} differ: a Y chromosome passes unchanged from father to son.`;
        break;
    }
  }
  return null;
}

/** The fixed teaching family: grandparents, three children (two with partners), four grandchildren. */
export const LAYOUT: { id: string; sex: Sex; father?: string; mother?: string; sexFixed: boolean }[] = [
  { id: 'I-1', sex: 'M', sexFixed: true }, { id: 'I-2', sex: 'F', sexFixed: true },
  { id: 'II-1', sex: 'M', father: 'I-1', mother: 'I-2', sexFixed: true }, { id: 'II-2', sex: 'F', sexFixed: true },
  { id: 'II-3', sex: 'F', father: 'I-1', mother: 'I-2', sexFixed: true }, { id: 'II-4', sex: 'M', sexFixed: true },
  { id: 'II-5', sex: 'M', father: 'I-1', mother: 'I-2', sexFixed: false },
  { id: 'III-1', sex: 'M', father: 'II-1', mother: 'II-2', sexFixed: false }, { id: 'III-2', sex: 'F', father: 'II-1', mother: 'II-2', sexFixed: false },
  { id: 'III-3', sex: 'M', father: 'II-4', mother: 'II-3', sexFixed: false }, { id: 'III-4', sex: 'F', father: 'II-4', mother: 'II-3', sexFixed: false },
];
/** Made-up teaching families: which members are affected (and any sex changes). */
export const PRESETS: { id: string; label: string; affected: string[]; sex?: Record<string, Sex> }[] = [
  { id: 'skip', label: 'Skips a generation', affected: ['II-5', 'III-4'] },
  { id: 'every', label: 'In every generation', affected: ['I-1', 'II-1', 'II-3', 'III-1', 'III-4'] },
  { id: 'sons', label: 'Sons of carrier mothers', affected: ['I-1', 'III-3'] },
  { id: 'father-son', label: 'Father to son', affected: ['I-1', 'II-1', 'II-5', 'III-1'] },
];
export function family(affected: string[], sex: Record<string, Sex> = {}): Person[] {
  return LAYOUT.map((p) => ({ id: p.id, sex: sex[p.id] ?? p.sex, father: p.father, mother: p.mother, affected: affected.includes(p.id) }));
}
