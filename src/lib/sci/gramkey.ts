// An identification key for bacteria groups: a table of groups against yes/no lab tests (Gram stain, shape,
// catalase, oxidase and so on), read one test at a time (a dichotomous key built from the table), written out as a
// numbered printed key, or matched against a set of results with the groups ranked by how well they fit.
// The example table is written by fibub from general textbook microbiology, simplified for teaching. No DOM.

/** A group's expected result for one test: + positive, - negative, v variable (strains differ), '' not used. */
export type Val = '+' | '-' | 'v' | '';
export type Test = { name: string; yes: string; no: string };
export type Group = { name: string; note: string; vals: Val[] };
export type Key = { name: string; tests: Test[]; groups: Group[] };
export type Mode = 'order' | 'best';

export const LIMITS = { groups: 300, tests: 60, couplets: 1500 };

/** Read one cell as a result. Returns null when it is not a result we understand. */
export function readVal(s: string): Val | null {
  const t = s.trim().toLowerCase().replace(/[−–—]/g, '-');
  if (['', '?', '.', 'na', 'n/a', 'nd', 'not used', 'unknown'].includes(t)) return '';
  if (['+', 'pos', 'positive', 'yes', 'y', '1', 'true'].includes(t)) return '+';
  if (['-', 'neg', 'negative', 'no', 'n', '0', 'false'].includes(t)) return '-';
  if (['v', 'var', 'variable', 'd', '+/-', '±', '-/+', 'w', 'weak'].includes(t)) return 'v';
  return null;
}

/** Split a CSV/TSV/semicolon line, keeping commas inside "quoted" cells. */
function splitLine(line: string, sep: string): string[] {
  const out: string[] = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"' && !cur.trim()) { q = true; cur = ''; }
    else if (c === sep) { out.push(cur.trim()); cur = ''; }
    else cur += c;
  }
  out.push(cur.trim());
  return out;
}

const isYesRow = (s: string) => /^(\+|yes)( means| label|:)?$/i.test(s.trim()) || s.trim() === '+ means';
const isNoRow = (s: string) => /^([-−–]|no)( means| label|:)?$/i.test(s.trim());

/** Read a key from CSV/TSV text or JSON. Errors are plain sentences; a key with errors is still returned when usable. */
export function parseKey(text: string): { key: Key | null; errors: string[] } {
  const t = text.replace(/^﻿/, '').trim();
  if (!t) return { key: null, errors: ['The key is empty. Paste a table or use the example.'] };
  if (t.startsWith('{')) return parseJson(t);
  const lines = t.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  // The header row decides the separator: tabs, then whichever of commas and semicolons it has more of.
  const h0 = lines[0], count = (c: string) => h0.split(c).length - 1;
  const sep = h0.includes('\t') ? '\t' : count(';') > count(',') ? ';' : ',';
  const rows = lines.map((l) => splitLine(l, sep));
  const errors: string[] = [];
  const head = rows[0];
  const noteCol = head.findIndex((h, i) => i > 0 && /^(note|notes|comment)$/i.test(h));
  const testCols = head.map((_, i) => i).filter((i) => i > 0 && i !== noteCol && head[i]);
  if (!testCols.length) return { key: null, errors: ['The first row needs a column for the group names, then one column per test.'] };
  if (testCols.length > LIMITS.tests) return { key: null, errors: [`A key can have up to ${LIMITS.tests} tests; this one has ${testCols.length}.`] };
  const tests: Test[] = testCols.map((i) => ({ name: head[i], yes: 'Positive', no: 'Negative' }));
  const groups: Group[] = [];
  rows.slice(1).forEach((r, k) => {
    const line = k + 2;
    if (isYesRow(r[0])) { testCols.forEach((c, j) => { if (r[c]) tests[j].yes = r[c]; }); return; }
    if (isNoRow(r[0])) { testCols.forEach((c, j) => { if (r[c]) tests[j].no = r[c]; }); return; }
    if (!r[0]) { errors.push(`Row ${line} has no group name, so it was left out.`); return; }
    const vals: Val[] = testCols.map((c, j) => {
      const v = readVal(r[c] ?? '');
      if (v === null) { errors.push(`Row ${line} (${r[0]}), ${tests[j].name}: "${r[c]}" is not +, -, v or blank, so it was read as blank.`); return ''; }
      return v;
    });
    groups.push({ name: r[0], note: noteCol > 0 ? r[noteCol] ?? '' : '', vals });
  });
  return finish({ name: 'Your key', tests, groups }, errors);
}

function parseJson(t: string): { key: Key | null; errors: string[] } {
  let o: unknown;
  try { o = JSON.parse(t); } catch { return { key: null, errors: ['This looks like JSON but could not be read. Check the brackets and quotes.'] }; }
  const j = o as { name?: unknown; tests?: unknown; groups?: unknown };
  if (!Array.isArray(j.tests) || !Array.isArray(j.groups)) return { key: null, errors: ['A JSON key needs "tests" and "groups" lists (download the example as JSON to see the layout).'] };
  if (j.tests.length > LIMITS.tests) return { key: null, errors: [`A key can have up to ${LIMITS.tests} tests; this one has ${j.tests.length}.`] };
  const errors: string[] = [];
  const tests: Test[] = j.tests.map((x: unknown, i: number) => {
    const o2 = (typeof x === 'string' ? { name: x } : x ?? {}) as Record<string, unknown>;
    return { name: String(o2.name ?? `Test ${i + 1}`), yes: String(o2.yes ?? 'Positive'), no: String(o2.no ?? 'Negative') };
  });
  const groups: Group[] = [];
  j.groups.forEach((x: unknown, k: number) => {
    const g = (x ?? {}) as { name?: unknown; note?: unknown; results?: unknown };
    if (!g.name) { errors.push(`Group ${k + 1} has no name, so it was left out.`); return; }
    const res = (g.results ?? {}) as Record<string, unknown> | unknown[];
    const vals: Val[] = tests.map((te, i) => {
      const raw = Array.isArray(res) ? res[i] : (res as Record<string, unknown>)[te.name];
      const v = readVal(raw == null ? '' : String(raw));
      if (v === null) { errors.push(`${g.name}, ${te.name}: "${String(raw)}" is not +, -, v or blank, so it was read as blank.`); return ''; }
      return v;
    });
    groups.push({ name: String(g.name), note: g.note ? String(g.note) : '', vals });
  });
  return finish({ name: j.name ? String(j.name) : 'Your key', tests, groups }, errors);
}

function finish(key: Key, errors: string[]): { key: Key | null; errors: string[] } {
  if (key.groups.length > LIMITS.groups) return { key: null, errors: [`A key can have up to ${LIMITS.groups} groups; this one has ${key.groups.length}.`] };
  if (key.groups.length < 2) return { key: null, errors: [...errors, 'A key needs at least two groups (rows) to tell apart.'] };
  const seen = new Set<string>();
  for (const g of key.groups) { const n = g.name.toLowerCase(); if (seen.has(n)) errors.push(`"${g.name}" is listed twice.`); seen.add(n); }
  return { key, errors };
}

const csvCell = (s: string) => (/[",\n;\t]/.test(s) || /^\s|\s$/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

/** The key as CSV: a header, the "+ means" and "- means" rows, then one row per group. */
export function keyToCsv(key: Key): string {
  const hasNote = key.groups.some((g) => g.note);
  const rows = [
    ['Group', ...key.tests.map((t) => t.name), ...(hasNote ? ['Note'] : [])],
    ['+ means', ...key.tests.map((t) => t.yes), ...(hasNote ? [''] : [])],
    ['- means', ...key.tests.map((t) => t.no), ...(hasNote ? [''] : [])],
    ...key.groups.map((g) => [g.name, ...g.vals, ...(hasNote ? [g.note] : [])]),
  ];
  return rows.map((r) => r.map(csvCell).join(',')).join('\n') + '\n';
}

/** The key as JSON, with each group's results named by test. */
export function keyToJson(key: Key): string {
  return JSON.stringify({
    name: key.name,
    tests: key.tests,
    groups: key.groups.map((g) => ({ name: g.name, ...(g.note ? { note: g.note } : {}), results: Object.fromEntries(key.tests.map((t, i) => [t.name, g.vals[i]])) })),
  }, null, 2) + '\n';
}

/** Can this group give this answer? Variable and blank (not used) results never rule a group out. */
export const allows = (v: Val, a: '+' | '-') => v === a || v === 'v' || v === '';

/** Indices of the groups that fit every answer (answers: test index -> '+' or '-'). */
export function candidates(key: Key, answers: Map<number, '+' | '-'>, from?: number[]): number[] {
  const pool = from ?? key.groups.map((_, i) => i);
  return pool.filter((g) => [...answers].every(([t, a]) => allows(key.groups[g].vals[t], a)));
}

/** Where a test sends the groups: those that can be positive and those that can be negative. */
export function split(key: Key, cands: number[], t: number): { pos: number[]; neg: number[]; useful: boolean } {
  const pos = cands.filter((g) => allows(key.groups[g].vals[t], '+'));
  const neg = cands.filter((g) => allows(key.groups[g].vals[t], '-'));
  return { pos, neg, useful: pos.length > 0 && neg.length > 0 && (pos.length < cands.length || neg.length < cands.length) };
}

/** Expected number of groups left after the test, if every group is equally likely and goes down each branch it allows. */
export const expectedLeft = (pos: number, neg: number) => (pos * pos + neg * neg) / (pos + neg);

/**
 * The next test to do. 'order' takes the first useful test in the table's order (the lab order, Gram stain first);
 * 'best' takes the test that leaves the fewest groups on average, ties going to the earlier test.
 */
export function nextTest(key: Key, cands: number[], used: Set<number>, mode: Mode): number | null {
  let best: number | null = null, bestE = Infinity;
  for (let t = 0; t < key.tests.length; t++) {
    if (used.has(t)) continue;
    const s = split(key, cands, t);
    if (!s.useful) continue;
    if (mode === 'order') return t;
    const e = expectedLeft(s.pos.length, s.neg.length);
    if (e < bestE - 1e-12) { bestE = e; best = t; }
  }
  return best;
}

export type Node = { test: number; yes: Node; no: Node; n?: number } | { leaf: number[]; cut?: boolean };

/** The whole key as a tree. Groups with a variable or blank result go down both branches. */
export function buildTree(key: Key, mode: Mode): { tree: Node; couplets: number; cut: boolean } {
  let count = 0, cut = false;
  const grow = (cands: number[], used: Set<number>): Node => {
    if (cands.length <= 1) return { leaf: cands };
    const t = nextTest(key, cands, used, mode);
    if (t === null) return { leaf: cands };
    if (count >= LIMITS.couplets) { cut = true; return { leaf: cands, cut: true }; }
    count++;
    const s = split(key, cands, t), u = new Set(used).add(t);
    return { test: t, yes: grow(s.pos, u), no: grow(s.neg, u) };
  };
  const tree = grow(key.groups.map((_, i) => i), new Set());
  // Number the couplets in reading order (depth first, yes before no).
  let n = 0;
  const num = (nd: Node) => { if ('test' in nd) { nd.n = ++n; num(nd.yes); num(nd.no); } };
  num(tree);
  return { tree, couplets: n, cut };
}

const leafText = (key: Key, l: number[], cut?: boolean) =>
  cut ? 'key too long, stopped here' : l.length === 0 ? 'no group' : l.length === 1 ? key.groups[l[0]].name : `${l.map((g) => key.groups[g].name).join(' or ')} (not told apart by these tests)`;

/** The printed key: "1a. Gram stain: Gram-positive (purple) ... 2", one line per lead. */
export function keyLines(key: Key, tree: Node): string[] {
  const out: string[] = [];
  const walk = (nd: Node) => {
    if (!('test' in nd)) return;
    const t = key.tests[nd.test];
    const to = (c: Node) => ('test' in c ? `go to ${c.n}` : leafText(key, c.leaf, c.cut));
    out.push(`${nd.n}a. ${t.name}: ${t.yes} ... ${to(nd.yes)}`);
    out.push(`${nd.n}b. ${t.name}: ${t.no} ... ${to(nd.no)}`);
    walk(nd.yes); walk(nd.no);
  };
  if ('test' in tree) walk(tree); else out.push(`No test tells these groups apart: ${leafText(key, tree.leaf)}`);
  return out;
}

/** Every path through the tree, as the tests and answers that lead to each end. */
export function paths(key: Key, tree: Node): { steps: [number, '+' | '-'][]; leaf: number[] }[] {
  const out: { steps: [number, '+' | '-'][]; leaf: number[] }[] = [];
  const walk = (nd: Node, steps: [number, '+' | '-'][]) => {
    if ('test' in nd) { walk(nd.yes, [...steps, [nd.test, '+']]); walk(nd.no, [...steps, [nd.test, '-']]); }
    else out.push({ steps, leaf: nd.leaf });
  };
  walk(tree, []);
  return out;
}

export type Fit = { group: number; agree: number; variable: number; conflict: number; unused: number; score: number; conflicts: number[] };

/**
 * Rank the groups against a set of results (test index -> '+' or '-'). Each tested result agrees, conflicts, is
 * variable for that group (half a point) or is not used for it (left out). Score = (agree + variable / 2) / (agree +
 * variable + conflict) in %. Sorted by fewest conflicts, then score, then most agreements, then table order.
 */
export function rank(key: Key, results: Map<number, '+' | '-'>): Fit[] {
  const fits = key.groups.map((g, i): Fit => {
    let agree = 0, variable = 0, conflict = 0, unused = 0; const conflicts: number[] = [];
    for (const [t, a] of results) {
      const v = g.vals[t];
      if (v === '') unused++;
      else if (v === 'v') variable++;
      else if (v === a) agree++;
      else { conflict++; conflicts.push(t); }
    }
    const n = agree + variable + conflict;
    return { group: i, agree, variable, conflict, unused, score: n ? (100 * (agree + variable / 2)) / n : 0, conflicts };
  });
  return fits.sort((a, b) => a.conflict - b.conflict || b.score - a.score || b.agree - a.agree || a.group - b.group);
}

/** The example: common teaching groups, written by fibub from general textbook microbiology and simplified. */
export const EXAMPLE_KEY = `# Teaching example written by fibub from general textbook microbiology. Simplified: real strains vary.
# + positive, - negative, v variable (strains differ), blank = not used for that group.
Group,Gram stain,Shape,Catalase,Oxidase,Endospores,Coagulase,Beta-haemolysis,Optochin,Bile-esculin,Lactose (MacConkey),Motility,Indole,Citrate,Urease,H2S,Note
+ means,Gram-positive (purple),Cocci (round),Bubbles,Purple in seconds,Spores seen,Clots plasma,Clear zone on blood agar,Zone round the disc,Blackens the slope,Pink colonies,Motile,Red ring,Turns blue,Turns pink,Black colour,
- means,Gram-negative (pink),Rods,No bubbles,No colour,No spores,No clot,No clear zone,No zone,No blackening,Pale colonies,Not motile,No red ring,Stays green,No pink,No black,
Staphylococcus aureus,+,+,+,,-,+,v,,,,-,,,,,Clusters; golden colonies
Coagulase-negative staphylococci,+,+,+,,-,-,-,,,,-,,,,,Clusters; e.g. S. epidermidis
Streptococcus pyogenes,+,+,-,,-,,+,-,-,,-,,,,,Chains; group A
Streptococcus pneumoniae,+,+,-,,-,,-,+,-,,-,,,,,Pairs (lancet-shaped)
Viridans streptococci,+,+,-,,-,,-,-,-,,-,,,,,Chains; green (alpha) haemolysis
Enterococcus,+,+,-,,-,,-,-,+,,-,,,,,Pairs and short chains
Bacillus,+,-,+,,+,,v,,,,+,,,,,Large rods; aerobic
Clostridium,+,-,-,,+,,v,,,,v,,,,,Anaerobic
Listeria,+,-,+,,-,,+,,+,,+,,,,,Tumbling motility at room temperature
Corynebacterium,+,-,+,,-,,-,,,,-,,,,,Club-shaped rods
Escherichia coli,-,-,+,-,-,,,,,+,+,+,-,-,-,
Klebsiella,-,-,+,-,-,,,,,+,-,-,+,+,-,Mucoid colonies
Enterobacter,-,-,+,-,-,,,,,+,+,-,+,-,-,
Salmonella,-,-,+,-,-,,,,,-,+,-,v,-,+,
Shigella,-,-,+,-,-,,,,,-,-,v,-,-,-,
Proteus,-,-,+,-,-,,,,,-,+,v,v,+,+,Swarms over the plate
Pseudomonas aeruginosa,-,-,+,+,-,,,,,-,+,-,+,v,-,Green pigment; grape smell
Vibrio,-,-,+,+,-,,,,,v,+,+,v,-,-,Curved rods
Neisseria,-,+,+,+,-,,,,,,-,,,,,Kidney-shaped pairs
`;

/** Example results for the results table: a lactose-negative, H2S-positive, urease-negative rod. */
export const EXAMPLE_RESULTS: [string, '+' | '-'][] = [['Gram stain', '-'], ['Shape', '-'], ['Oxidase', '-'], ['Lactose (MacConkey)', '-'], ['Motility', '+'], ['Urease', '-'], ['H2S', '+']];
