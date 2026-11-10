// A school dichotomous key: eight drawn animals with yes/no features, a ready-made key to follow, and the pieces to
// build your own key one question at a time. Plain TypeScript, no DOM.

export type Org = { id: string; name: string; traits: Record<string, boolean> };
export type Q = { id: string; text: string };
export const QUESTIONS: Q[] = [
  { id: 'backbone', text: 'Does it have a backbone?' }, { id: 'legs', text: 'Does it have legs?' }, { id: 'wings', text: 'Does it have wings?' },
  { id: 'feathers', text: 'Is it covered in feathers?' }, { id: 'fur', text: 'Is it covered in fur?' }, { id: 'fins', text: 'Does it have fins?' },
  { id: 'scales', text: 'Is its body covered in scales?' }, { id: 'six', text: 'Does it have exactly six legs?' }, { id: 'eight', text: 'Does it have eight legs?' },
  { id: 'moist', text: 'Does it have smooth, moist skin?' },
];
const T = (s: string) => Object.fromEntries(QUESTIONS.map((q) => [q.id, s.split(' ').includes(q.id)]));
export const ORGS: Org[] = [
  { id: 'worm', name: 'Earthworm', traits: T('moist') },
  { id: 'spider', name: 'Spider', traits: T('legs eight') },
  { id: 'butterfly', name: 'Butterfly', traits: T('legs wings six') },
  { id: 'fish', name: 'Fish', traits: T('backbone fins scales') },
  { id: 'frog', name: 'Frog', traits: T('backbone legs moist') },
  { id: 'snake', name: 'Snake', traits: T('backbone scales') },
  { id: 'pigeon', name: 'Pigeon', traits: T('backbone legs wings feathers') },
  { id: 'cat', name: 'Cat', traits: T('backbone legs fur') },
];
export const org = (id: string) => ORGS.find((o) => o.id === id)!;
export const qText = (id: string) => QUESTIONS.find((q) => q.id === id)!.text;

export type Node = { q: string; yes: Node; no: Node } | { org: string };
const N = (q: string, yes: Node, no: Node): Node => ({ q, yes, no }), O = (id: string): Node => ({ org: id });
/** The ready-made key. */
export const KEY: Node = N('backbone',
  N('feathers', O('pigeon'), N('fur', O('cat'), N('legs', O('frog'), N('fins', O('fish'), O('snake'))))),
  N('legs', N('wings', O('butterfly'), O('spider')), O('worm')));

/** Follow a key with a list of yes/no answers; returns the node reached and the path of questions. */
export function follow(key: Node, answers: boolean[]): { node: Node; path: { q: string; a: boolean }[] } {
  let node = key; const path: { q: string; a: boolean }[] = [];
  for (const a of answers) { if ('org' in node) break; path.push({ q: node.q, a }); node = a ? node.yes : node.no; }
  return { node, path };
}
/** The right answers for an organism (what the key would ask and the true replies). */
export function route(key: Node, id: string): { q: string; a: boolean }[] {
  const o = org(id), path: { q: string; a: boolean }[] = []; let node = key;
  while (!('org' in node)) { const a = o.traits[node.q]; path.push({ q: node.q, a }); node = a ? node.yes : node.no; }
  return path;
}
/** Does the key name every organism exactly once, and lead each one to itself? */
export function check(key: Node, ids = ORGS.map((o) => o.id)): boolean {
  const leaves: string[] = []; const walk = (n: Node) => { if ('org' in n) leaves.push(n.org); else { walk(n.yes); walk(n.no); } }; walk(key);
  if (leaves.length !== ids.length || new Set(leaves).size !== ids.length) return false;
  return ids.every((id) => { let n = key; while (!('org' in n)) n = org(id).traits[n.q] ? n.yes : n.no; return n.org === id; });
}

/** Split a group with a question. Null if everyone gives the same answer (the question doesn't help). */
export function split(group: string[], q: string): { yes: string[]; no: string[] } | null {
  const yes = group.filter((id) => org(id).traits[q]), no = group.filter((id) => !org(id).traits[q]);
  return yes.length && no.length ? { yes, no } : null;
}

/** A key being built: a tree whose unfinished leaves are groups of more than one organism. */
export type Build = { q: string; yes: Build; no: Build } | { group: string[] };
/** The first unfinished group, in reading order, or null when every group has one member. */
export function nextGroup(b: Build): string[] | null {
  if ('group' in b) return b.group.length > 1 ? b.group : null;
  return nextGroup(b.yes) ?? nextGroup(b.no);
}
/** Use question q on the first unfinished group. Returns the new tree, or an error message. */
export function addQuestion(b: Build, q: string): Build | string {
  const g = nextGroup(b);
  if (!g) return 'Every group already has one animal: the key is finished.';
  const s = split(g, q);
  if (!s) return `"${qText(q)}" gets the same answer from all of ${g.map((id) => org(id).name).join(', ')}, so it doesn't split them.`;
  let done = false;
  const rec = (n: Build): Build => {
    if (done) return n;
    if ('group' in n) { if (n.group === g) { done = true; return { q, yes: { group: s.yes }, no: { group: s.no } }; } return n; }
    return { q: n.q, yes: rec(n.yes), no: rec(n.no) };
  };
  return rec(b);
}
export const questionsUsed = (b: Build): number => ('group' in b ? 0 : 1 + questionsUsed(b.yes) + questionsUsed(b.no));
/** Longest path (most questions anyone must answer). */
export const depth = (b: Build | Node): number => ('q' in b ? 1 + Math.max(depth(b.yes as Build), depth(b.no as Build)) : 0);
