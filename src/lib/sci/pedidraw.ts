// Pedigree drawing (plain logic, no DOM): read a family table, check it, place people in generations and
// left-to-right order, and draw it with the standard symbols of the NSGC pedigree nomenclature (Bennett et al.
// 2008): square male, circle female, diamond sex unknown, filled affected, central dot carrier, slash deceased,
// arrow and P for the proband, double line for a consanguineous couple, twin lines from one point (with a bar for
// identical twins), brackets for adoption, Roman numerals for generations and numbers for individuals.
import type { Painter } from './plot.ts';

export type Sex = 'M' | 'F' | 'U';
export type Person = {
  id: string; father: string; mother: string; sex: Sex;
  affected: boolean; carrier: boolean; deceased: boolean; proband: boolean;
  twin: string; adopted: '' | 'in' | 'out'; note: string;
};
export const COLUMNS = ['id', 'father', 'mother', 'sex', 'affected', 'carrier', 'deceased', 'proband', 'twin', 'adopted', 'note'] as const;

const yes = (s: string | undefined) => /^(y|yes|1|true|x|✓|affected|carrier|deceased|dead|proband)$/i.test((s ?? '').trim());
const none = (s: string | undefined) => { const t = (s ?? '').trim(); return /^(|-|–|0|\?|na|n\/a|unknown|none|\.)$/i.test(t) ? '' : t; };
function readSex(s: string | undefined): Sex | null {
  const t = (s ?? '').trim().toLowerCase();
  if (/^(m|male|man|boy|♂)$/.test(t)) return 'M';
  if (/^(f|female|woman|girl|♀)$/.test(t)) return 'F';
  if (/^(|u|unknown|\?|x)$/.test(t)) return 'U';
  return null;
}
const ALIAS: Record<string, RegExp> = {
  id: /^(id|name|person|individual)$/, father: /^(father|dad|sire|pat|paternal)/, mother: /^(mother|mum|mom|dam|mat|maternal)/,
  sex: /^(sex|gender)$/, affected: /^(affected|status|phenotype)$/, carrier: /^carrier/, deceased: /^(deceased|dead|died)$/,
  proband: /^(proband|index)$/, twin: /^twin/, adopted: /^adopt/, note: /^(note|notes|label|comment|age)$/,
};

/** Read rows (already split into cells). A header row naming the columns lets them come in any order. */
export function readPeople(rows: string[][]): { people: Person[]; errors: string[] } {
  const errors: string[] = [];
  if (!rows.length) return { people: [], errors };
  let col: Record<string, number> = Object.fromEntries(COLUMNS.map((c, i) => [c, i]));
  let body = rows;
  const head = rows[0].map((c) => c.trim().toLowerCase());
  if (head.some((h) => ALIAS.id.test(h)) && head.some((h) => ALIAS.father.test(h) || ALIAS.mother.test(h) || ALIAS.sex.test(h))) {
    col = {};
    for (const c of COLUMNS) col[c] = head.findIndex((h) => ALIAS[c].test(h));
    body = rows.slice(1);
  }
  const get = (r: string[], c: string) => (col[c] >= 0 ? r[col[c]] ?? '' : '');
  const people: Person[] = [];
  body.forEach((r, k) => {
    const line = k + 1 + (body === rows ? 0 : 1), id = get(r, 'id').trim();
    if (!id) { if (r.some((c) => c.trim())) errors.push(`Row ${line} has no id.`); return; }
    const sex = readSex(get(r, 'sex'));
    if (!sex) errors.push(`${id}: sex must be M, F or U (unknown), not "${get(r, 'sex')}".`);
    const ad = get(r, 'adopted').trim().toLowerCase();
    if (ad && !/^(in|out|no|-)$/.test(ad)) errors.push(`${id}: adopted must be "in", "out" or blank.`);
    people.push({ id, father: none(get(r, 'father')), mother: none(get(r, 'mother')), sex: sex ?? 'U', affected: yes(get(r, 'affected')), carrier: yes(get(r, 'carrier')), deceased: yes(get(r, 'deceased')), proband: yes(get(r, 'proband')), twin: get(r, 'twin').trim().replace(/^(-|no)$/i, ''), adopted: ad === 'in' || ad === 'out' ? ad : '', note: get(r, 'note').trim() });
  });
  return { people, errors };
}

/** The table as tab-separated text with a header row. */
export function toTable(people: Person[]): string {
  const b = (v: boolean) => (v ? 'yes' : '');
  return [COLUMNS.join('\t'), ...people.map((p) => [p.id, p.father, p.mother, p.sex, b(p.affected), b(p.carrier), b(p.deceased), b(p.proband), p.twin, p.adopted, p.note].join('\t'))].join('\n');
}

export type Problems = { errors: string[]; warnings: string[]; fatal: boolean };
/** Errors stop the drawing (missing or single parents, duplicates, loops); sex conflicts and twin mismatches are errors drawn anyway. */
export function checkPeople(people: Person[]): Problems {
  const errors: string[] = [], warnings: string[] = [];
  let fatal = false;
  const by = new Map<string, Person>();
  for (const p of people) { if (by.has(p.id)) { errors.push(`The id "${p.id}" is used twice.`); fatal = true; } by.set(p.id, p); }
  for (const p of people) {
    if (p.father === p.id || p.mother === p.id) { errors.push(`${p.id} is listed as their own parent.`); fatal = true; continue; }
    for (const [role, pid] of [['father', p.father], ['mother', p.mother]] as const) if (pid && !by.has(pid)) { errors.push(`Missing parent: ${p.id}'s ${role} "${pid}" is not in the table. Add a row for them.`); fatal = true; }
    if (!!p.father !== !!p.mother) { errors.push(`${p.id} has only one parent. Give both (add a row with sex U if the other parent is unknown), or neither.`); fatal = true; }
    if (p.father && p.father === p.mother) { errors.push(`${p.id} has the same person as father and mother.`); fatal = true; }
  }
  // Sex conflicts.
  const asFather = new Set(people.map((p) => p.father).filter(Boolean)), asMother = new Set(people.map((p) => p.mother).filter(Boolean));
  for (const id of asFather) { const q = by.get(id); if (q?.sex === 'F') errors.push(`Sex conflict: ${id} is a father but is marked female.`); else if (q?.sex === 'U') warnings.push(`${id} is a father but their sex is unknown (U).`); }
  for (const id of asMother) { const q = by.get(id); if (q?.sex === 'M') errors.push(`Sex conflict: ${id} is a mother but is marked male.`); else if (q?.sex === 'U') warnings.push(`${id} is a mother but their sex is unknown (U).`); }
  for (const id of asFather) if (asMother.has(id)) errors.push(`Sex conflict: ${id} is listed as a father of one person and a mother of another.`);
  // Loops: someone who is their own ancestor.
  if (!fatal) {
    const state = new Map<string, number>(), loops: string[] = [];
    const visit = (id: string, path: string[]) => {
      const s = state.get(id);
      if (s === 1) { loops.push([...path.slice(path.indexOf(id)), id].join(' → ')); return; }
      if (s === 2) return;
      state.set(id, 1);
      const p = by.get(id)!;
      for (const q of [p.father, p.mother]) if (q) visit(q, [...path, id]);
      state.set(id, 2);
    };
    for (const p of people) visit(p.id, []);
    for (const l of loops) { errors.push(`Loop: ${l} (each is listed as a parent of the next, so someone is their own ancestor).`); fatal = true; }
  }
  // Twins.
  const groups = new Map<string, Person[]>();
  for (const p of people) if (p.twin) groups.set(p.twin, [...(groups.get(p.twin) ?? []), p]);
  for (const [t, g] of groups) {
    if (g.length < 2) warnings.push(`Twin label "${t}" is used only by ${g[0].id}; give the same label to both twins.`);
    if (new Set(g.map((p) => `${p.father}|${p.mother}`)).size > 1) errors.push(`Twins "${t}" (${g.map((p) => p.id).join(', ')}) must have the same parents.`);
    if (/^mz/i.test(t) && new Set(g.map((p) => p.sex).filter((s) => s !== 'U')).size > 1) errors.push(`Identical (MZ) twins "${t}" must be the same sex.`);
  }
  const pro = people.filter((p) => p.proband);
  if (pro.length > 1) warnings.push(`${pro.length} people are marked as proband (${pro.map((p) => p.id).join(', ')}); usually there is one.`);
  return { errors, warnings, fatal };
}

/** All ancestors of a person (not including them). */
export function ancestors(people: Person[], id: string): Set<string> {
  const by = new Map(people.map((p) => [p.id, p])), out = new Set<string>(), stack = [id];
  while (stack.length) { const p = by.get(stack.pop()!); if (!p) continue; for (const q of [p.father, p.mother]) if (q && !out.has(q)) { out.add(q); stack.push(q); } }
  return out;
}
/** Partners are consanguineous (blood relatives) when they share an ancestor in the table, or one descends from the other. */
export function consanguineous(people: Person[], a: string, b: string): boolean {
  const A = ancestors(people, a), B = ancestors(people, b);
  if (A.has(b) || B.has(a)) return true;
  for (const x of A) if (B.has(x)) return true;
  return false;
}

export type Couple = { father: string; mother: string; children: string[]; consang: boolean };
export type Layout = {
  gen: Map<string, number>; x: Map<string, number>; rows: string[][]; label: Map<string, string>;
  couples: Couple[]; minGen: number; maxGen: number; warnings: string[];
};
export const roman = (n: number) => { const v = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']] as const; let s = ''; for (const [k, r] of v) while (n >= k) { s += r; n -= k; } return s; };

/** Isotonic (non-decreasing) least-squares fit by pool-adjacent-violators. */
function pava(y: number[]): number[] {
  const v: number[] = [], w: number[] = [], len: number[] = [];
  for (const yi of y) {
    v.push(yi); w.push(1); len.push(1);
    while (v.length > 1 && v[v.length - 2] > v[v.length - 1]) {
      const a = v.length - 2, nw = w[a] + w[a + 1];
      v[a] = (v[a] * w[a] + v[a + 1] * w[a + 1]) / nw; w[a] = nw; len[a] += len[a + 1];
      v.pop(); w.pop(); len.pop();
    }
  }
  const out: number[] = [];
  v.forEach((val, i) => { for (let k = 0; k < len[i]; k++) out.push(val); });
  return out;
}

/** Generations, left-to-right order and positions (in symbol spacings) for a checked pedigree. */
export function layout(people: Person[]): Layout {
  const by = new Map(people.map((p) => [p.id, p])), warnings: string[] = [], idx = new Map(people.map((p, i) => [p.id, i]));
  const cmap = new Map<string, Couple>();
  for (const p of people) if (p.father && p.mother) {
    const k = `${p.father}|${p.mother}`;
    if (!cmap.has(k)) cmap.set(k, { father: p.father, mother: p.mother, children: [], consang: consanguineous(people, p.father, p.mother) });
    cmap.get(k)!.children.push(p.id);
  }
  const couples = [...cmap.values()];
  const partners = new Map<string, string[]>(people.map((p) => [p.id, []]));
  for (const c of couples) { partners.get(c.father)!.push(c.mother); partners.get(c.mother)!.push(c.father); }
  // Generations: children below both parents, partners on the same row.
  const gen = new Map(people.map((p) => [p.id, 0]));
  let changed = true, it = 0;
  while (changed && it++ < people.length + 5) {
    changed = false;
    for (const p of people) if (p.father) { const g = Math.max(gen.get(p.father)!, gen.get(p.mother)!) + 1; if (g > gen.get(p.id)!) { gen.set(p.id, g); changed = true; } }
    for (const c of couples) { const g = Math.max(gen.get(c.father)!, gen.get(c.mother)!); for (const q of [c.father, c.mother]) if (gen.get(q)! < g) { gen.set(q, g); changed = true; } }
  }
  if (changed) warnings.push('Some partners could not be put on the same row as each other (a partner is also a descendant).');
  // A founder with no partner sits one row above their own children only; everyone else as computed.
  const gens = [...new Set(gen.values())].sort((a, b) => a - b), minGen = gens[0] ?? 0, maxGen = gens[gens.length - 1] ?? 0;
  const pos = new Map<string, number>(), rows: string[][] = [];
  const hasParents = (id: string) => !!by.get(id)!.father;
  for (let g = minGen; g <= maxGen; g++) {
    const inGen = people.filter((p) => gen.get(p.id) === g).map((p) => p.id), row: string[] = [], placed = new Set<string>();
    const put = (id: string) => {
      if (placed.has(id)) return;
      // Married-in partners (no parents drawn) go beside their partner: men to the left of women.
      const mates = partners.get(id)!.filter((q) => gen.get(q) === g && !hasParents(q) && !placed.has(q));
      const before = by.get(id)!.sex === 'F' ? mates.filter((q) => by.get(q)!.sex !== 'F') : [];
      for (const q of before) { row.push(q); placed.add(q); }
      row.push(id); placed.add(id);
      for (const q of mates) if (!placed.has(q)) { row.push(q); placed.add(q); }
    };
    if (g === minGen) for (const id of inGen) put(id);
    else {
      const sibships = couples.map((c) => ({ c, kids: c.children.filter((k) => gen.get(k) === g) })).filter((s) => s.kids.length)
        .sort((a, b) => ((pos.get(a.c.father) ?? 0) + (pos.get(a.c.mother) ?? 0)) - ((pos.get(b.c.father) ?? 0) + (pos.get(b.c.mother) ?? 0)));
      const groupOf = new Map<string, number>();
      sibships.forEach((s, i) => s.kids.forEach((k) => groupOf.set(k, i)));
      sibships.forEach((s, i) => {
        // Twins together; people married to someone in an earlier sibship first, to a later one last.
        const side = (k: string) => { const g2 = partners.get(k)!.filter((q) => groupOf.has(q)).map((q) => groupOf.get(q)!); return g2.some((v) => v < i) ? -1 : g2.some((v) => v > i) ? 1 : 0; };
        const order = [...s.kids].sort((a, b) => side(a) - side(b) || idx.get(a)! - idx.get(b)!);
        const done: string[] = [];
        for (const k of order) { if (done.includes(k)) continue; done.push(k); const t = by.get(k)!.twin; if (t) for (const o of order) if (o !== k && by.get(o)!.twin === t && !done.includes(o)) done.push(o); }
        for (const k of done) put(k);
      });
      for (const id of inGen) put(id);
    }
    rows.push(row);
    row.forEach((id, i) => pos.set(id, i));
  }
  // Positions: start evenly spaced, then pull children under their parents and parents over their children,
  // keeping each row's order and spacing (1 between partners and siblings, 1.5 elsewhere).
  const x = new Map<string, number>();
  const sameFamily = (a: string, b: string) => partners.get(a)!.includes(b) || (by.get(a)!.father !== '' && by.get(a)!.father === by.get(b)!.father && by.get(a)!.mother === by.get(b)!.mother);
  const gaps = rows.map((r) => r.map((id, i) => (i === 0 ? 0 : sameFamily(r[i - 1], id) ? 1 : 1.5)));
  const offs = gaps.map((g) => { let c = 0; return g.map((v) => (c += v)); });
  rows.forEach((r, ri) => r.forEach((id, i) => x.set(id, offs[ri][i])));
  const fit = (ri: number, want: number[]) => { const o = offs[ri], f = pava(want.map((v, i) => v - o[i])); rows[ri].forEach((id, i) => x.set(id, f[i] + o[i])); };
  const down = () => {
    for (let ri = 1; ri < rows.length; ri++) {
      const r = rows[ri], want = r.map((id) => x.get(id)!);
      const shift = new Map<string, number>();
      for (const c of couples) { const kids = c.children.filter((k) => r.includes(k)); if (!kids.length) continue; const mid = (x.get(c.father)! + x.get(c.mother)!) / 2, km = kids.reduce((s, k) => s + x.get(k)!, 0) / kids.length; for (const k of kids) shift.set(k, mid - km); }
      r.forEach((id, i) => {
        if (shift.has(id)) want[i] = x.get(id)! + shift.get(id)!;
        else { const m = partners.get(id)!.filter((q) => r.includes(q)); if (m.length) want[i] = m.reduce((s, q) => s + x.get(q)! + (r.indexOf(q) > i ? -1 : 1), 0) / m.length; }
      });
      fit(ri, want);
    }
  };
  const up = () => {
    for (let ri = rows.length - 2; ri >= 0; ri--) {
      const r = rows[ri], want = r.map((id) => x.get(id)!), acc = new Map<string, number[]>();
      for (const c of couples) {
        if (!r.includes(c.father) && !r.includes(c.mother)) continue;
        const km = c.children.reduce((s, k) => s + x.get(k)!, 0) / c.children.length, mid = (x.get(c.father)! + x.get(c.mother)!) / 2;
        for (const q of [c.father, c.mother]) if (r.includes(q)) acc.set(q, [...(acc.get(q) ?? []), x.get(q)! + km - mid]);
      }
      r.forEach((id, i) => { const a = acc.get(id); if (a) want[i] = a.reduce((s, v) => s + v, 0) / a.length; });
      fit(ri, want);
    }
  };
  for (let k = 0; k < 25; k++) { down(); up(); }
  down();
  const min = Math.min(...x.values());
  for (const [k, v] of x) x.set(k, v - min);
  const label = new Map<string, string>();
  rows.forEach((r, ri) => [...r].sort((a, b) => x.get(a)! - x.get(b)!).forEach((id, i) => label.set(id, `${roman(ri + 1)}-${i + 1}`)));
  return { gen, x, rows, label, couples, minGen, maxGen, warnings };
}

export type Colors = { ink: string; bg: string; muted: string; accent: string };
export const UNIT = 72, ROW = 130, S = 32, PAD = 46;
/** Size in pixels of the drawing of a layout. */
export function drawingSize(L: Layout): { w: number; h: number } {
  const maxX = Math.max(0, ...L.x.values());
  return { w: Math.round(PAD * 2 + 30 + maxX * UNIT + S), h: Math.round(30 + L.rows.length * ROW + 10) };
}
export const centre = (L: Layout, id: string): [number, number] => [PAD + 30 + S / 2 + L.x.get(id)! * UNIT, 30 + S / 2 + (L.rows.findIndex((r) => r.includes(id))) * ROW];

/** Draw the pedigree with a Painter (canvas or SVG). `selected` gets a dashed box (for the page only). */
export function drawPedigree(P: Painter, people: Person[], L: Layout, col: Colors, selected = '') {
  const by = new Map(people.map((p) => [p.id, p])), lw = 1.8, h = S / 2;
  // Generation numerals.
  L.rows.forEach((_, ri) => P.text(10, 30 + h + ri * ROW, roman(ri + 1), 15, col.ink, 'start', 'middle', 0, true));
  // Couples and lines of descent.
  for (const c of L.couples) {
    const [fx, fy] = centre(L, c.father), [mx, my] = centre(L, c.mother);
    const [ax, ay, bx, by2] = fx <= mx ? [fx, fy, mx, my] : [mx, my, fx, fy];
    if (c.consang) { P.line([[ax + h, ay - 3], [bx - h, by2 - 3]], col.ink, lw); P.line([[ax + h, ay + 3], [bx - h, by2 + 3]], col.ink, lw); }
    else P.line([[ax + h, ay], [bx - h, by2]], col.ink, lw);
    const dx = (ax + bx) / 2, dy = (ay + by2) / 2;
    const kids = c.children.map((k) => ({ id: k, c: centre(L, k) }));
    const sibY = Math.min(...kids.map((k) => k.c[1])) - h - 34;
    P.line([[dx, dy + (c.consang ? 3 : 0)], [dx, sibY]], col.ink, lw);
    // Twins hang from one point.
    const apex = new Map<string, number>();
    for (const t of new Set(kids.map((k) => by.get(k.id)!.twin).filter(Boolean))) { const g = kids.filter((k) => by.get(k.id)!.twin === t); if (g.length > 1) apex.set(t, g.reduce((s, k) => s + k.c[0], 0) / g.length); }
    const xs = kids.map((k) => { const t = by.get(k.id)!.twin; return apex.has(t) ? apex.get(t)! : k.c[0]; });
    P.line([[Math.min(dx, ...xs), sibY], [Math.max(dx, ...xs), sibY]], col.ink, lw);
    for (const k of kids) {
      const p = by.get(k.id)!, top = k.c[1] - h - (p.adopted ? 4 : 0), dash = p.adopted === 'in' ? [5, 4] : undefined;
      if (apex.has(p.twin)) P.line([[apex.get(p.twin)!, sibY], [k.c[0], top]], col.ink, lw, dash);
      else P.line([[k.c[0], sibY], [k.c[0], top]], col.ink, lw, dash);
    }
    for (const [t, ax2] of apex) {
      const g = kids.filter((k) => by.get(k.id)!.twin === t).sort((a, b) => a.c[0] - b.c[0]), y2 = sibY + (g[0].c[1] - h - sibY) / 2;
      const at = (k: { c: [number, number] }) => ax2 + ((k.c[0] - ax2) * (y2 - sibY)) / (k.c[1] - h - sibY);
      if (/^mz/i.test(t)) P.line([[at(g[0]), y2], [at(g[g.length - 1]), y2]], col.ink, lw);
      else if (/^\?/.test(t)) P.text(ax2, y2, '?', 14, col.ink, 'middle', 'middle', 0, true);
    }
  }
  // Symbols.
  for (const p of people) {
    const [cx, cy] = centre(L, p.id), fill = p.affected ? col.ink : col.bg;
    if (p.sex === 'M') P.poly([[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]], fill, col.ink, lw);
    else if (p.sex === 'F') P.circle(cx, cy, h, fill, col.ink, lw);
    else { const d = h * 1.2; P.poly([[cx, cy - d], [cx + d, cy], [cx, cy + d], [cx - d, cy]], fill, col.ink, lw); }
    if (p.carrier) P.circle(cx, cy, 4.5, p.affected ? col.bg : col.ink, null);
    if (p.deceased) P.line([[cx - h - 7, cy + h + 7], [cx + h + 7, cy - h - 7]], col.ink, lw);
    if (p.adopted) { const e = h + 7, t = 5; P.line([[cx - e + t, cy - h - 4], [cx - e, cy - h - 4], [cx - e, cy + h + 4], [cx - e + t, cy + h + 4]], col.ink, lw); P.line([[cx + e - t, cy - h - 4], [cx + e, cy - h - 4], [cx + e, cy + h + 4], [cx + e - t, cy + h + 4]], col.ink, lw); }
    if (p.proband) {
      const x1 = cx - h - 26, y1 = cy + h + 18, x2 = cx - h - 5, y2 = cy + h + 2;
      P.line([[x1, y1], [x2, y2]], col.ink, lw);
      const a = Math.atan2(y2 - y1, x2 - x1), hl = 8;
      P.poly([[x2, y2], [x2 - hl * Math.cos(a - 0.45), y2 - hl * Math.sin(a - 0.45)], [x2 - hl * Math.cos(a + 0.45), y2 - hl * Math.sin(a + 0.45)]], col.ink, null);
      P.text(x1 - 3, y1 + 1, 'P', 13, col.ink, 'end', 'middle', 0, true);
    }
    if (p.id === selected) P.line([[cx - h - 9, cy - h - 9], [cx + h + 9, cy - h - 9], [cx + h + 9, cy + h + 9], [cx - h - 9, cy + h + 9], [cx - h - 9, cy - h - 9]], col.accent, 1.5, [4, 3]);
    const num = L.label.get(p.id)!.split('-')[1];
    P.text(cx, cy + h + 10, num, 13, col.ink, 'middle', 'top', 0, true);
    const cut = (t: string) => (t.length > 11 ? t.slice(0, 10) + '…' : t);
    P.text(cx, cy + h + 26, cut(p.id), 11, col.muted, 'middle', 'top');
    if (p.note) P.text(cx, cy + h + 39, cut(p.note), 11, col.muted, 'middle', 'top');
  }
}

// ---------- Adding relatives ----------
const nextId = (people: Person[], base: string) => { const ids = new Set(people.map((p) => p.id)); let k = 1; while (ids.has(`${base}${k}`)) k++; return `${base}${k}`; };
const blank = (id: string, sex: Sex, father = '', mother = ''): Person => ({ id, father, mother, sex, affected: false, carrier: false, deceased: false, proband: false, twin: '', adopted: '', note: '' });

export function addParents(people: Person[], id: string): Person[] {
  const p = people.find((q) => q.id === id);
  if (!p) throw new Error(`No one with the id "${id}".`);
  if (p.father || p.mother) throw new Error(`${id} already has parents.`);
  const f = nextId(people, 'Father'), m = nextId([...people, blank(f, 'M')], 'Mother');
  return [...people.map((q) => (q.id === id ? { ...q, father: f, mother: m } : q)), blank(f, 'M'), blank(m, 'F')];
}
export function addChild(people: Person[], id: string, sex: Sex): { people: Person[]; added: string } {
  const p = people.find((q) => q.id === id);
  if (!p) throw new Error(`No one with the id "${id}".`);
  if (p.sex === 'U') throw new Error(`Set ${id}'s sex first, so the child's father and mother are clear.`);
  const kid = people.find((q) => (p.sex === 'M' ? q.father === id : q.mother === id));
  let out = [...people], partner = kid ? (p.sex === 'M' ? kid.mother : kid.father) : '';
  if (!partner) { partner = nextId(out, 'Partner'); out.push(blank(partner, p.sex === 'M' ? 'F' : 'M')); }
  const cid = nextId(out, sex === 'M' ? 'Son' : sex === 'F' ? 'Daughter' : 'Child');
  out.push(blank(cid, sex, p.sex === 'M' ? id : partner, p.sex === 'M' ? partner : id));
  return { people: out, added: cid };
}
export function addSibling(people: Person[], id: string, sex: Sex): { people: Person[]; added: string } {
  let out = people;
  if (!out.find((q) => q.id === id)?.father) out = addParents(out, id);
  const p = out.find((q) => q.id === id)!, sid = nextId(out, sex === 'M' ? 'Brother' : sex === 'F' ? 'Sister' : 'Sibling');
  return { people: [...out, blank(sid, sex, p.father, p.mother)], added: sid };
}
export function removePerson(people: Person[], id: string): Person[] {
  if (people.some((q) => q.father === id || q.mother === id)) throw new Error(`${id} has children in the pedigree; remove the children first.`);
  return people.filter((q) => q.id !== id);
}
