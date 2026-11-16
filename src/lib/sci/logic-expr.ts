// Truth table of a typed Boolean expression, with one column for every sub-expression (the working), the gate it
// matches, and its simplest sum-of-products form. Plain TypeScript, no DOM; uses the parser in logic.ts.
import { parseLogic, varsOf, evalLogic, minterms, minimise, sopText, posText, MAX_VARS, type BNode } from './logic.ts';

const SYM: Record<string, string> = { and: '∧', or: '∨', xor: '⊕', imp: '→', iff: '↔', nand: 'NAND', nor: 'NOR' };
/** The expression written out fully bracketed, with symbols a student can read. */
export function showNode(n: BNode, top = true): string {
  if (n.k === 'const') return n.v ? '1' : '0';
  if (n.k === 'var') return n.name;
  if (n.k === 'not') return `¬${n.a.k === 'var' || n.a.k === 'const' || n.a.k === 'not' ? showNode(n.a, false) : `(${showNode(n.a, true)})`}`;
  const s = `${showNode(n.a, false)} ${SYM[n.k]} ${showNode(n.b, false)}`;
  return top ? s : `(${s})`;
}
/** Sub-expressions in the order they are worked out, without repeats and without bare variables or constants. */
function subs(n: BNode, out: BNode[] = [], seen = new Set<string>()): BNode[] {
  if (n.k === 'var' || n.k === 'const') return out;
  if (n.k === 'not') subs(n.a, out, seen); else { subs(n.a, out, seen); subs(n.b, out, seen); }
  const key = showNode(n); if (!seen.has(key)) { seen.add(key); out.push(n); }
  return out;
}
const GATES: Record<string, string> = { '0001': 'an AND gate', '0111': 'an OR gate', '1110': 'a NAND gate', '1000': 'a NOR gate', '0110': 'an XOR gate', '1001': 'an XNOR gate' };
/** For 2 variables, the standard gate that gives the same outputs. */
export function gateName(col: string, k: number): string {
  if (k === 2) return GATES[col] ?? '';
  if (k === 1) return col === '01' ? 'just the input itself (a wire)' : col === '10' ? 'a NOT gate' : '';
  return '';
}

export type Analysis = {
  error?: string; vars: string[]; text: string; head: string[]; rows: number[][]; /* each row: inputs, steps, output */ outCol: number;
  ones: number; tautology: boolean; contradiction: boolean; gate: string; sop: string; pos: string; minterms: number[]; steps: string[];
};
export function analyse(src: string): Analysis {
  const empty = { vars: [], text: '', head: [], rows: [], outCol: 0, ones: 0, tautology: false, contradiction: false, gate: '', sop: '', pos: '', minterms: [], steps: [] } as Analysis;
  let node: BNode;
  try { node = parseLogic(src); } catch (e) { return { ...empty, error: (e as Error).message }; }
  const vars = varsOf(node);
  if (vars.length === 0) return { ...empty, error: 'Use at least one letter for an input, such as A. For example: A AND NOT B.' };
  if (vars.length > MAX_VARS) return { ...empty, error: `Up to ${MAX_VARS} inputs, please (this has ${vars.length}).` };
  const steps = subs(node), cols = steps.length > 8 ? [node] : steps;
  const k = vars.length, rows: number[][] = [];
  const mt = minterms(node, vars);
  for (let m = 0; m < 1 << k; m++) {
    const env: Record<string, boolean> = {};
    vars.forEach((v, i) => { env[v] = !!((m >> (k - 1 - i)) & 1); });
    const r = vars.map((v) => +env[v]);
    for (const s of cols) r.push(+evalLogic(s, env));
    if (cols[cols.length - 1] !== node) r.push(+evalLogic(node, env));
    rows.push(r);
  }
  const outs = cols[cols.length - 1] === node ? cols.map((x) => showNode(x)) : [...cols.map((x) => showNode(x)), showNode(node)];
  const head = [...vars, ...(node.k === 'var' ? [] : outs)];
  if (node.k === 'var') { const r = rows; for (const row of r) row.push(row[0]); head.push('Y'); }
  const outCol = head.length - 1, col = rows.map((r) => r[outCol]).join('');
  const mn = minimise(vars, mt);
  const nt = 'prime' as const;
  return {
    vars, text: showNode(node), head, rows, outCol, ones: mt.length, tautology: mt.length === 1 << k, contradiction: mt.length === 0,
    gate: gateName(col, k), sop: sopText(mn.sop, vars, nt), pos: posText(mn.pos, vars, nt), minterms: mt, steps: head.slice(k),
  };
}
