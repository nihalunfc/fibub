// A tiny language and its compiler, stage by stage: tokens (lexer), syntax tree (parser), stack bytecode
// (code generator) and a virtual machine that runs one instruction at a time. Whole numbers are BigInt, so
// results never overflow. No eval anywhere. Plain TypeScript, no DOM.
//
// The language:  x = 10;   print x * 2;   if x > 5 { ... } else { ... }   while x > 0 { ... }   # comment
// Operators, loosest first: or; and; not; == != < <= > >=; + -; * / %; unary -. Division and remainder round
// down (as Python's // and %). Comparisons and logic give 1 (true) or 0 (false); any non-zero value is true.

export class CompileError extends Error { line: number; col: number; stage: string; constructor(stage: string, msg: string, line: number, col: number) { super(msg); this.stage = stage; this.line = line; this.col = col; } }

export type TokKind = 'number' | 'name' | 'keyword' | 'operator' | 'punctuation' | 'end';
export type Token = { kind: TokKind; text: string; line: number; col: number };
const KEYWORDS = new Set(['if', 'else', 'while', 'print', 'and', 'or', 'not']);
const OPS = ['==', '!=', '<=', '>=', '<', '>', '+', '-', '*', '/', '%', '='];

export function lex(src: string): Token[] {
  const out: Token[] = [];
  let i = 0, line = 1, col = 1;
  const adv = (n: number) => { for (let k = 0; k < n; k++) { if (src[i] === '\n') { line++; col = 1; } else col++; i++; } };
  while (i < src.length) {
    const ch = src[i];
    if (ch === '#') { while (i < src.length && src[i] !== '\n') adv(1); continue; }
    if (/\s/.test(ch)) { adv(1); continue; }
    const rest = src.slice(i);
    const num = /^\d+/.exec(rest);
    if (num) {
      if (/^[A-Za-z_.]/.test(rest.slice(num[0].length))) throw new CompileError('Tokens', `"${rest.slice(0, num[0].length + 1)}": numbers are whole numbers, with no letters or decimal point`, line, col);
      out.push({ kind: 'number', text: num[0], line, col }); adv(num[0].length); continue;
    }
    const id = /^[A-Za-z_][A-Za-z0-9_]*/.exec(rest);
    if (id) { out.push({ kind: KEYWORDS.has(id[0]) ? 'keyword' : 'name', text: id[0], line, col }); adv(id[0].length); continue; }
    const op = OPS.find((o) => rest.startsWith(o));
    if (op) { out.push({ kind: 'operator', text: op, line, col }); adv(op.length); continue; }
    if ('(){};'.includes(ch)) { out.push({ kind: 'punctuation', text: ch, line, col }); adv(1); continue; }
    throw new CompileError('Tokens', `"${ch}" is not part of the language`, line, col);
  }
  out.push({ kind: 'end', text: 'end of program', line, col });
  return out;
}

export type Expr =
  | { t: 'num'; v: bigint; line: number }
  | { t: 'var'; name: string; line: number }
  | { t: 'bin'; op: string; a: Expr; b: Expr; line: number }
  | { t: 'un'; op: '-' | 'not'; a: Expr; line: number };
export type Stmt =
  | { t: 'assign'; name: string; e: Expr; line: number }
  | { t: 'print'; e: Expr; line: number }
  | { t: 'if'; c: Expr; then: Stmt[]; else: Stmt[] | null; line: number }
  | { t: 'while'; c: Expr; body: Stmt[]; line: number };

export function parse(toks: Token[]): Stmt[] {
  let p = 0;
  const peek = () => toks[p], next = () => toks[p++];
  const err = (msg: string, t = peek()): never => { throw new CompileError('Syntax tree', msg, t.line, t.col); };
  const is = (text: string) => peek().text === text && peek().kind !== 'number' && peek().kind !== 'name';
  const expect = (text: string, what = `"${text}"`) => { if (!is(text)) err(`Expected ${what} but found ${peek().kind === 'end' ? 'the end of the program' : `"${peek().text}"`}`); return next(); };
  function block(): Stmt[] { expect('{'); const body: Stmt[] = []; while (!is('}')) { if (peek().kind === 'end') err('A block opened with "{" is not closed with "}"'); body.push(stmt()); } next(); return body; }
  function stmt(): Stmt {
    const t = peek();
    if (t.kind === 'keyword' && t.text === 'print') { next(); const e = expr(); expect(';', '";" at the end of the line'); return { t: 'print', e, line: t.line }; }
    if (t.kind === 'keyword' && t.text === 'if') { next(); const c = expr(); const then = block(); let els: Stmt[] | null = null; if (is('else')) { next(); els = is('if') ? [stmt()] : block(); } return { t: 'if', c, then, else: els, line: t.line }; }
    if (t.kind === 'keyword' && t.text === 'while') { next(); const c = expr(); return { t: 'while', c, body: block(), line: t.line }; }
    if (t.kind === 'name') { next(); expect('=', `"=" after ${t.text}`); const e = expr(); expect(';', '";" at the end of the line'); return { t: 'assign', name: t.text, e, line: t.line }; }
    return err(t.kind === 'end' ? 'The program ends too soon' : `A statement cannot start with "${t.text}"`);
  }
  const level = (ops: string[], sub: () => Expr) => (): Expr => { let a = sub(); while (ops.includes(peek().text) && (peek().kind === 'operator' || peek().kind === 'keyword')) { const o = next(); a = { t: 'bin', op: o.text, a, b: sub(), line: o.line }; } return a; };
  function unary(): Expr {
    const t = peek();
    if (t.kind === 'operator' && t.text === '-') { next(); return { t: 'un', op: '-', a: unary(), line: t.line }; }
    return atom();
  }
  function notExpr(): Expr { const t = peek(); if (t.kind === 'keyword' && t.text === 'not') { next(); return { t: 'un', op: 'not', a: notExpr(), line: t.line }; } return cmp(); }
  function atom(): Expr {
    const t = next();
    if (t.kind === 'number') return { t: 'num', v: BigInt(t.text), line: t.line };
    if (t.kind === 'name') return { t: 'var', name: t.text, line: t.line };
    if (t.text === '(' && t.kind === 'punctuation') { const e = expr(); expect(')', '")" to close the bracket'); return e; }
    p--; return err(t.kind === 'end' ? 'The program ends in the middle of a sum' : `Expected a number, a name or "(" but found "${t.text}"`);
  }
  const mul = level(['*', '/', '%'], unary), add = level(['+', '-'], mul), cmp = level(['==', '!=', '<', '<=', '>', '>='], add);
  const and = level(['and'], notExpr), expr = level(['or'], and);
  const prog: Stmt[] = [];
  while (peek().kind !== 'end') prog.push(stmt());
  return prog;
}

// ---------- Tree for drawing ----------
export type TreeNode = { label: string; kids: TreeNode[] };
export function toTree(prog: Stmt[]): TreeNode {
  const e = (x: Expr): TreeNode => x.t === 'num' ? { label: x.v.toString(), kids: [] } : x.t === 'var' ? { label: x.name, kids: [] } : x.t === 'bin' ? { label: x.op, kids: [e(x.a), e(x.b)] } : { label: x.op, kids: [e(x.a)] };
  const s = (x: Stmt): TreeNode => {
    if (x.t === 'assign') return { label: `${x.name} =`, kids: [e(x.e)] };
    if (x.t === 'print') return { label: 'print', kids: [e(x.e)] };
    if (x.t === 'while') return { label: 'while', kids: [e(x.c), { label: 'do', kids: x.body.map(s) }] };
    return { label: 'if', kids: [e(x.c), { label: 'then', kids: x.then.map(s) }, ...(x.else ? [{ label: 'else', kids: x.else.map(s) }] : [])] };
  };
  return { label: 'program', kids: prog.map(s) };
}
/** Tidy-ish layout: leaves side by side, each parent centred over its children. Units: leaf slots and depth. */
export function layoutTree(root: TreeNode): { nodes: { label: string; x: number; y: number }[]; edges: [number, number][]; width: number; depth: number } {
  const nodes: { label: string; x: number; y: number }[] = [], edges: [number, number][] = [];
  let next = 0, depth = 0;
  const walk = (n: TreeNode, d: number): number => {
    const id = nodes.length; nodes.push({ label: n.label, x: 0, y: d }); depth = Math.max(depth, d);
    if (!n.kids.length) { nodes[id].x = next++; return id; }
    const kids = n.kids.map((k) => { const c = walk(k, d + 1); edges.push([id, c]); return c; });
    nodes[id].x = (nodes[kids[0]].x + nodes[kids[kids.length - 1]].x) / 2;
    return id;
  };
  walk(root, 0);
  return { nodes, edges, width: Math.max(1, next), depth };
}

// ---------- Bytecode ----------
export type Op = 'PUSH' | 'LOAD' | 'STORE' | 'ADD' | 'SUB' | 'MUL' | 'DIV' | 'MOD' | 'NEG' | 'NOT' | 'EQ' | 'NE' | 'LT' | 'LE' | 'GT' | 'GE' | 'AND' | 'OR' | 'PRINT' | 'JUMP' | 'JUMP_IF_ZERO' | 'HALT';
export type Ins = { op: Op; arg?: string; line: number };
const BIN: Record<string, Op> = { '+': 'ADD', '-': 'SUB', '*': 'MUL', '/': 'DIV', '%': 'MOD', '==': 'EQ', '!=': 'NE', '<': 'LT', '<=': 'LE', '>': 'GT', '>=': 'GE', and: 'AND', or: 'OR' };
export function compile(prog: Stmt[]): Ins[] {
  const code: Ins[] = [];
  const emit = (op: Op, line: number, arg?: string) => { code.push({ op, arg, line }); return code.length - 1; };
  const ex = (x: Expr) => {
    if (x.t === 'num') emit('PUSH', x.line, x.v.toString());
    else if (x.t === 'var') emit('LOAD', x.line, x.name);
    else if (x.t === 'un') { ex(x.a); emit(x.op === '-' ? 'NEG' : 'NOT', x.line); }
    else { ex(x.a); ex(x.b); emit(BIN[x.op], x.line); }
  };
  const st = (x: Stmt) => {
    if (x.t === 'assign') { ex(x.e); emit('STORE', x.line, x.name); }
    else if (x.t === 'print') { ex(x.e); emit('PRINT', x.line); }
    else if (x.t === 'while') {
      const top = code.length; ex(x.c); const jz = emit('JUMP_IF_ZERO', x.line);
      x.body.forEach(st); emit('JUMP', x.line, String(top)); code[jz].arg = String(code.length);
    } else {
      ex(x.c); const jz = emit('JUMP_IF_ZERO', x.line);
      x.then.forEach(st);
      if (x.else) { const j = emit('JUMP', x.line); code[jz].arg = String(code.length); x.else.forEach(st); code[j].arg = String(code.length); }
      else code[jz].arg = String(code.length);
    }
  };
  prog.forEach(st);
  emit('HALT', prog.length ? prog[prog.length - 1].line : 1);
  return code;
}

// ---------- Virtual machine ----------
export class RunError extends Error { line: number; constructor(msg: string, line: number) { super(msg); this.line = line; } }
export type VM = { pc: number; stack: bigint[]; vars: Map<string, bigint>; out: string[]; steps: number; halted: boolean };
export const newVM = (): VM => ({ pc: 0, stack: [], vars: new Map(), out: [], steps: 0, halted: false });
const floorDiv = (a: bigint, b: bigint) => { const q = a / b; return (a % b !== 0n && (a < 0n) !== (b < 0n)) ? q - 1n : q; };
const floorMod = (a: bigint, b: bigint) => a - b * floorDiv(a, b);
const LIM = 10n ** 10000n;
const truth = (b: boolean) => (b ? 1n : 0n);
/** Run one instruction. Throws RunError on a runtime error. */
export function stepVM(vm: VM, code: Ins[]): void {
  if (vm.halted) return;
  const ins = code[vm.pc], s = vm.stack;
  vm.steps++;
  const pop = () => s.pop()!;
  switch (ins.op) {
    case 'PUSH': s.push(BigInt(ins.arg!)); break;
    case 'LOAD': { const v = vm.vars.get(ins.arg!); if (v === undefined) throw new RunError(`${ins.arg} is used before it is given a value`, ins.line); s.push(v); break; }
    case 'STORE': vm.vars.set(ins.arg!, pop()); break;
    case 'NEG': s.push(-pop()); break;
    case 'NOT': s.push(truth(pop() === 0n)); break;
    case 'PRINT': vm.out.push(pop().toString()); break;
    case 'JUMP': vm.pc = Number(ins.arg); return;
    case 'JUMP_IF_ZERO': if (pop() === 0n) { vm.pc = Number(ins.arg); return; } break;
    case 'HALT': vm.halted = true; return;
    default: {
      const b = pop(), a = pop();
      if ((ins.op === 'DIV' || ins.op === 'MOD') && b === 0n) throw new RunError('Division by zero', ins.line);
      const r: Record<string, () => bigint> = { ADD: () => a + b, SUB: () => a - b, MUL: () => a * b, DIV: () => floorDiv(a, b), MOD: () => floorMod(a, b), EQ: () => truth(a === b), NE: () => truth(a !== b), LT: () => truth(a < b), LE: () => truth(a <= b), GT: () => truth(a > b), GE: () => truth(a >= b), AND: () => truth(a !== 0n && b !== 0n), OR: () => truth(a !== 0n || b !== 0n) };
      const v = r[ins.op]();
      if (v > LIM || v < -LIM) throw new RunError('A number grew past 10,000 digits', ins.line);
      s.push(v);
    }
  }
  vm.pc++;
}
/** Run to the end (or the step limit). */
export function runAll(code: Ins[], limit = 100000): VM & { error?: RunError; limited?: boolean } {
  const vm: VM & { error?: RunError; limited?: boolean } = newVM();
  try { while (!vm.halted) { if (vm.steps >= limit) { vm.limited = true; break; } stepVM(vm, code); } } catch (e) { vm.error = e as RunError; }
  return vm;
}

/** Every stage at once, for the page and the tests. */
export function build(src: string) { const tokens = lex(src); const ast = parse(tokens); return { tokens, ast, code: compile(ast) }; }
