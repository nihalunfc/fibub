// IUPAC names for small open-chain organic molecules, school level: a carbon chain up to C10 with methyl and
// ethyl branches, one double or triple bond, and one functional group (–OH, –CHO, –COOH, ketone C=O, –Cl, –Br).
// Follows the rules taught in school (1993 IUPAC style for choosing the chain: it must hold the principal group
// and the multiple bond, then be as long as possible) with current locant placement (but-2-ene, propan-2-ol).
// Plain maths, no DOM. Used by the #1104 carbon chain namer.

export type Group = 'none' | 'OH' | 'CHO' | 'COOH' | 'CO' | 'Cl' | 'Br';
export type Build = {
  n: number;                    // carbons in the drawn main chain, 1 to 10
  branches: number[][];         // branches[i] = lengths of alkyl branches on chain carbon i (0-based), 1 = methyl, 2 = ethyl
  bond: { kind: 'single' | 'double' | 'triple'; at: number }; // multiple bond between chain carbons at and at + 1 (0-based)
  group: { kind: Group; at: number };                          // chain carbon carrying the group (0-based)
};

// Carbon graph: atoms 0..n-1 are the drawn chain, branch carbons follow.
export type Graph = { nC: number; adj: number[][]; order: Map<string, number>; oh: number[]; oxo: number[]; hal: (string | null)[] };
export const key = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);

export function toGraph(b: Build): Graph {
  const adj: number[][] = [], order = new Map<string, number>();
  const add = () => { adj.push([]); return adj.length - 1; };
  const link = (a: number, c: number, o = 1) => { adj[a].push(c); adj[c].push(a); order.set(key(a, c), o); };
  for (let i = 0; i < b.n; i++) add();
  for (let i = 0; i + 1 < b.n; i++) link(i, i + 1, b.bond.kind !== 'single' && b.bond.at === i ? (b.bond.kind === 'double' ? 2 : 3) : 1);
  b.branches.forEach((list, i) => { for (const len of list || []) { let prev = i; for (let k = 0; k < len; k++) { const c = add(); link(prev, c); prev = c; } } });
  const nC = adj.length, oh = new Array(nC).fill(0), oxo = new Array(nC).fill(0), hal: (string | null)[] = new Array(nC).fill(null);
  const g = b.group;
  if (g.kind === 'OH') oh[g.at] = 1;
  if (g.kind === 'CO' || g.kind === 'CHO') oxo[g.at] = 1;
  if (g.kind === 'COOH') { oxo[g.at] = 1; oh[g.at] = 1; }
  if (g.kind === 'Cl' || g.kind === 'Br') hal[g.at] = g.kind;
  return { nC, adj, order, oh, oxo, hal };
}

/** Problems with a build (too many bonds on a carbon, a group in the wrong place), or an empty list. */
export function check(b: Build): string[] {
  const out: string[] = [];
  if (!Number.isInteger(b.n) || b.n < 1 || b.n > 10) out.push('The chain needs 1 to 10 carbons.');
  if (out.length) return out;
  if (b.bond.kind !== 'single' && (b.bond.at < 0 || b.bond.at >= b.n - 1)) out.push('A double or triple bond needs two carbons next to each other.');
  const g = b.group;
  if (g.kind !== 'none' && (g.at < 0 || g.at >= b.n)) out.push('Put the group on a carbon of the chain.');
  if ((g.kind === 'CHO' || g.kind === 'COOH') && g.at !== 0 && g.at !== b.n - 1) out.push(`${g.kind === 'CHO' ? 'An aldehyde (–CHO)' : 'A carboxylic acid (–COOH)'} can only be at the end of a chain.`);
  if (g.kind === 'CO' && (g.at === 0 || g.at === b.n - 1)) out.push('A ketone C=O must be inside the chain, with a carbon on each side (at the end it would be an aldehyde).');
  if (out.length) return out;
  const G = toGraph(b);
  for (let i = 0; i < b.n; i++) {
    const used = G.adj[i].reduce((s, j) => s + G.order.get(key(i, j))!, 0) + G.oh[i] + 2 * G.oxo[i] + (G.hal[i] ? 1 : 0);
    if (used > 4) out.push(`Carbon ${i + 1} would have ${used} bonds; carbon can only make 4.`);
    else if (g.kind === 'CHO' && g.at === i && used > 3) out.push('The aldehyde carbon (–CHO) also carries an H, so it cannot be part of a double or triple bond.');
  }
  return out;
}

const PREFIX: Record<string, string> = { Cl: 'chloro', Br: 'bromo' };
export const ROOT = ['', 'meth', 'eth', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec', 'undec', 'dodec', 'tridec', 'tetradec'];
const MULT = ['', '', 'di', 'tri', 'tetra', 'penta', 'hexa'];

type Feature = { path: number[]; pg: number[]; mult: number[]; dbl: number[]; subs: { loc: number; name: string }[] };

// Principal group by seniority: acid > aldehyde > ketone > alcohol; halogens are always prefixes.
function principal(G: Graph, c: number, deg: number): 'COOH' | 'CHO' | 'CO' | 'OH' | null {
  if (G.oxo[c] && G.oh[c]) return 'COOH';
  if (G.oxo[c]) return deg <= 1 ? 'CHO' : 'CO';
  if (G.oh[c]) return 'OH';
  return null;
}

function allPaths(G: Graph): number[][] {
  const out: number[][] = [];
  if (G.nC === 1) return [[0]];
  const leaves = G.adj.map((a, i) => (a.length <= 1 ? i : -1)).filter((i) => i >= 0);
  // Paths between any two carbons (a principal group may sit mid-chain, but the longest path ends at leaves; paths
  // that must end at a group carbon are covered because CHO/COOH carbons are leaves).
  for (const s of leaves) {
    const walk = (u: number, from: number, path: number[]) => {
      path.push(u);
      out.push(path.slice());
      for (const v of G.adj[u]) if (v !== from) walk(v, u, path);
      path.pop();
    };
    walk(s, -1, []);
  }
  return out;
}

/** Name of a branch hanging off `at` (going away from `from`), e.g. methyl, ethyl, (1-methylethyl). */
export function alkylName(G: Graph, at: number, from: number): string {
  // Longest chain inside the branch starting at its attachment carbon.
  const best = (u: number, p: number): number[] => { let b: number[] = []; for (const v of G.adj[u]) if (v !== p) { const c = best(v, u); if (c.length > b.length) b = c; } return [u, ...b]; };
  const chain = best(at, from);
  const subs: { loc: number; name: string }[] = [];
  chain.forEach((c, i) => { for (const v of G.adj[c]) if (v !== from && v !== chain[i - 1] && v !== chain[i + 1]) subs.push({ loc: i + 1, name: alkylName(G, v, c) }); });
  const base = ROOT[chain.length] + 'yl';
  if (!subs.length) return base;
  return '(' + prefixText(subs) + base + ')';
}

function prefixText(subs: { loc: number; name: string }[]) {
  const by = new Map<string, number[]>();
  for (const s of subs) by.set(s.name, [...(by.get(s.name) || []), s.loc]);
  const alpha = (s: string) => s.replace(/[()]/g, '').replace(/^\d[\d,-]*/, '');
  return [...by.entries()].sort((a, b) => alpha(a[0]).localeCompare(alpha(b[0]))).map(([name, locs]) => {
    locs.sort((a, b) => a - b);
    const m = locs.length > 1 ? (name.startsWith('(') ? ['', '', 'bis', 'tris', 'tetrakis'][locs.length] : MULT[locs.length]) : '';
    return `${locs.join(',')}-${m}${name}`;
  }).join('-');
}

function features(G: Graph, path: number[]): Feature {
  const pos = new Map(path.map((c, i) => [c, i + 1]));
  const deg = G.adj.map((a) => a.length);
  const pg: number[] = [], mult: number[] = [], dbl: number[] = [], subs: { loc: number; name: string }[] = [];
  path.forEach((c, i) => {
    if (principal(G, c, deg[c])) pg.push(i + 1);
    if (i + 1 < path.length) { const o = G.order.get(key(c, path[i + 1]))!; if (o > 1) { mult.push(i + 1); if (o === 2) dbl.push(i + 1); } }
    if (G.hal[c]) subs.push({ loc: i + 1, name: PREFIX[G.hal[c]!] ?? G.hal[c]! });
    for (const v of G.adj[c]) if (!pos.has(v)) subs.push({ loc: i + 1, name: alkylName(G, v, c) });
  });
  return { path, pg, mult, dbl, subs };
}

const cmpArr = (a: number[], b: number[]) => { for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0; };

export type NameResult = {
  name: string;
  chain: number[];          // graph carbons of the principal chain in numbering order
  length: number;
  series: string;
  general: string;          // general formula of the homologous series
  formula: string;          // molecular formula, e.g. C₄H₁₀O
  counts: { C: number; H: number; O: number; X: number; hal: string };
  steps: string[];
};

/** IUPAC name with steps. `opts.chain` forces the drawn chain (for wrong-answer choices), `opts.reverse` numbers from the wrong end. */
export function nameOf(b: Build, opts: { drawnChain?: boolean; reverse?: boolean } = {}): NameResult | string {
  const errs = check(b); if (errs.length) return errs[0];
  return nameGraph(toGraph(b), { ...opts, drawnN: b.n });
}

/** IUPAC name of any carbon tree (Graph). `hal` entries may also be ready-made prefixes such as "methoxy". */
export function nameGraph(G: Graph, opts: { drawnChain?: boolean; reverse?: boolean; drawnN?: number } = {}): NameResult {
  const drawnN = opts.drawnN ?? G.nC;
  const deg = G.adj.map((a) => a.length);
  const pgCarbons = [...Array(G.nC).keys()].filter((c) => principal(G, c, deg[c]));
  let paths = allPaths(G);
  if (opts.drawnChain) { const d = [...Array(drawnN).keys()]; paths = [d, d.slice().reverse()]; }
  const feats = paths.map((p) => features(G, p));
  const score = (f: Feature) => [-f.pg.length, -f.mult.length, -f.path.length, -f.subs.length];
  feats.sort((x, y) => {
    const a = score(x), c = score(y);
    for (let i = 0; i < 4; i++) if (a[i] !== c[i]) return a[i] - c[i];
    return cmpArr(x.pg, y.pg) || cmpArr(x.mult, y.mult) || cmpArr(x.dbl, y.dbl) || cmpArr(x.subs.map((s) => s.loc).sort((p, q) => p - q), y.subs.map((s) => s.loc).sort((p, q) => p - q))
      || cmpArr(alphaLocs(x), alphaLocs(y));
  });
  let f = feats[0];
  if (opts.reverse) f = features(G, f.path.slice().reverse());
  const L = f.path.length;
  const pgKind = pgCarbons.length ? principal(G, pgCarbons[0], deg[pgCarbons[0]])! : null;
  // Parent: root + an/en/yn + suffix.
  const multKind = f.mult.length ? (f.dbl.length ? 'en' : 'yn') : 'an';
  const suffix = pgKind === 'COOH' ? 'oic acid' : pgKind === 'CHO' ? 'al' : pgKind === 'CO' ? 'one' : pgKind === 'OH' ? 'ol' : 'e';
  const plain = !f.subs.length;
  const needMultLoc = multKind !== 'an' && !(L === 2 || (plain && L <= 3));
  const needPgLoc = (pgKind === 'OH' && !(plain && L <= 2)) || (pgKind === 'CO' && !(plain && L <= 3 && !f.mult.length));
  const stem = ROOT[L] + (multKind === 'an' ? 'an' : (needMultLoc ? `-${f.mult.join(',')}-` : '') + multKind);
  const parent = suffix === 'e' ? stem + 'e' : stem + (needPgLoc ? `-${f.pg.join(',')}-` : '') + suffix;
  // Ethane, ethene and ethyne with one substituent and no suffix group need no locant (chloroethene).
  const pre = f.subs.length ? (L <= 2 && f.subs.length === 1 && !pgKind ? f.subs[0].name : prefixText(f.subs)) : '';
  const name = pre ? pre + parent : parent;
  // Formula.
  let H = 0;
  for (let c = 0; c < G.nC; c++) H += 4 - G.adj[c].reduce((s, j) => s + G.order.get(key(c, j))!, 0) - G.oh[c] - 2 * G.oxo[c] - (G.hal[c] ? 1 : 0);
  H += G.oh.reduce((s, x) => s + x, 0);
  const O = G.oh.reduce((s, x) => s + x, 0) + G.oxo.reduce((s, x) => s + x, 0), X = G.hal.filter((h) => h === 'Cl' || h === 'Br').length, hal = G.hal.find((h) => h === 'Cl' || h === 'Br') || '';
  const sub = (k: number) => (k === 1 ? '' : String(k).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[+d]));
  const formula = `C${sub(G.nC)}H${sub(H)}${hal && X ? hal + sub(X) : ''}${O ? 'O' + sub(O) : ''}`;
  const [series, general] = seriesOf(pgKind, multKind, hal);
  // Steps.
  const steps: string[] = [];
  const what = [pgKind ? `the ${groupWord(pgKind)} carbon` : '', f.mult.length ? `the ${multKind === 'en' ? 'double' : 'triple'} bond` : ''].filter(Boolean).join(' and ');
  steps.push(`Longest chain${what ? ` that holds ${what}` : ''}: ${L} carbon${L === 1 ? '' : 's'} → root "${ROOT[L]}-".${opts.drawnChain ? '' : G.nC > L && L > drawnN && opts.drawnN !== undefined ? ' It is longer than the chain as drawn: it turns into a branch.' : ''}`);
  if (L > 1) {
    const why = pgKind ? `the ${groupWord(pgKind)} gets the lowest number (${f.pg.join(',')})` : f.mult.length ? `the ${multKind === 'en' ? 'double' : 'triple'} bond gets the lowest number (${f.mult.join(',')})` : f.subs.length ? `the branches get the lowest numbers (${f.subs.map((s) => s.loc).sort((p, q) => p - q).join(',')})` : 'either end gives the same name';
    steps.push(`Number the chain from the end where ${why}.`);
  }
  steps.push(multKind === 'an' ? 'All C–C bonds single → "-an-" (alkane family).' : `${multKind === 'en' ? 'Double' : 'Triple'} bond starting at carbon ${f.mult[0]} → "-${multKind}-"${needMultLoc ? ` with locant ${f.mult[0]}` : ''}.`);
  if (pgKind) steps.push(`${groupWord(pgKind)[0].toUpperCase() + groupWord(pgKind).slice(1)} → suffix "-${suffix}"${needPgLoc ? ` on carbon ${f.pg[0]}` : ''}.`);
  if (f.subs.length) steps.push(`Prefixes in alphabetical order, with their carbon numbers: ${pre.replace(/-$/, '')}.`);
  steps.push(`Put it together: ${name}.`);
  return { name, chain: f.path, length: L, series, general, formula, counts: { C: G.nC, H, O, X, hal }, steps };
}

function alphaLocs(f: Feature) { return f.subs.slice().sort((a, b) => a.name.replace(/[()]/g, '').localeCompare(b.name.replace(/[()]/g, ''))).map((s) => s.loc); }
const groupWord = (k: string) => ({ COOH: 'carboxylic acid', CHO: 'aldehyde', CO: 'ketone', OH: 'alcohol (–OH)' } as Record<string, string>)[k] || k;

export function seriesOf(pg: string | null, mult: string, hal: string): [string, string] {
  if (pg === 'COOH') return ['carboxylic acid', 'CₙH₂ₙ₊₁COOH'];
  if (pg === 'CHO') return ['aldehyde', 'CₙH₂ₙ₊₁CHO'];
  if (pg === 'CO') return ['ketone', 'CₙH₂ₙO'];
  if (pg === 'OH') return ['alcohol', 'CₙH₂ₙ₊₁OH'];
  if (hal) return ['haloalkane', `CₙH₂ₙ₊₁${hal}`];
  if (mult === 'en') return ['alkene', 'CₙH₂ₙ'];
  if (mult === 'yn') return ['alkyne', 'CₙH₂ₙ₋₂'];
  return ['alkane', 'CₙH₂ₙ₊₂'];
}

/** Empty build of n carbons. */
export const blank = (n: number): Build => ({ n, branches: Array.from({ length: n }, () => []), bond: { kind: 'single', at: 0 }, group: { kind: 'none', at: 0 } });
