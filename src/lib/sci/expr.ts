// A small, safe formula reader: turns text like "4*pi^2*L/T^2" into a fast function of named
// variables. No eval (the site's security policy forbids it, and it would be unsafe anyway).

export type Node =
  | { t: 'num'; v: number }
  | { t: 'var'; name: string }
  | { t: 'neg'; a: Node }
  | { t: 'bin'; op: '+' | '-' | '*' | '/' | '^'; a: Node; b: Node }
  | { t: 'fn'; name: string; args: Node[] };

const FN1: Record<string, (x: number) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos, atan: Math.atan,
  sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh, exp: Math.exp, ln: Math.log, log: Math.log10, log10: Math.log10, log2: Math.log2,
  sqrt: Math.sqrt, abs: Math.abs, cbrt: Math.cbrt,
};
const FN2: Record<string, (x: number, y: number) => number> = { atan2: Math.atan2, pow: Math.pow, hypot: Math.hypot, min: Math.min, max: Math.max };
const TRIG = new Set(['sin', 'cos', 'tan']), ATRIG = new Set(['asin', 'acos', 'atan', 'atan2']);
export const CONSTANTS: Record<string, number> = { pi: Math.PI, 'π': Math.PI };
export const FUNCTIONS = [...Object.keys(FN1), ...Object.keys(FN2)];

export class ExprError extends Error { at: number; constructor(msg: string, at: number) { super(msg); this.at = at; } }

type Tok = { k: 'num' | 'id' | 'op' | '(' | ')' | ','; v: string; at: number };
function lex(src: string): Tok[] {
  const s = src.replace(/[×·∙]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-').replace(/\*\*/g, '^').replace(/²/g, '^2').replace(/³/g, '^3').replace(/√/g, 'sqrt');
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) { i++; continue; }
    const num = /^(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?/.exec(s.slice(i));
    if (num) { out.push({ k: 'num', v: num[0], at: i }); i += num[0].length; continue; }
    const id = /^[A-Za-z_Ͱ-Ͽ][A-Za-z0-9_Ͱ-Ͽ]*/.exec(s.slice(i));
    if (id) { out.push({ k: 'id', v: id[0], at: i }); i += id[0].length; continue; }
    if ('+-*/^'.includes(ch)) { out.push({ k: 'op', v: ch, at: i }); i++; continue; }
    if (ch === '(' || ch === '[') { out.push({ k: '(', v: '(', at: i }); i++; continue; }
    if (ch === ')' || ch === ']') { out.push({ k: ')', v: ')', at: i }); i++; continue; }
    if (ch === ',' || ch === ';') { out.push({ k: ',', v: ',', at: i }); i++; continue; }
    throw new ExprError(`"${ch}" is not something a formula can use`, i);
  }
  return out;
}

/** Parse a formula. Implicit multiplication works: "2pi r", "4 L/T^2". */
export function parse(src: string): Node {
  const toks = lex(src);
  let p = 0;
  const peek = () => toks[p], next = () => toks[p++];
  const atEnd = () => p >= toks.length;
  const expect = (k: Tok['k']) => { const t = next(); if (!t || t.k !== k) throw new ExprError(k === ')' ? 'A bracket is not closed' : `Expected ${k}`, t?.at ?? src.length); return t; };
  function expr(): Node {
    let a = term();
    while (!atEnd() && peek().k === 'op' && (peek().v === '+' || peek().v === '-')) { const op = next().v as '+' | '-'; a = { t: 'bin', op, a, b: term() }; }
    return a;
  }
  function term(): Node {
    let a = unary();
    for (;;) {
      const t = peek();
      if (t && t.k === 'op' && (t.v === '*' || t.v === '/')) { next(); a = { t: 'bin', op: t.v as '*' | '/', a, b: unary() }; continue; }
      // Implicit multiplication: a number, name or bracket right after a value.
      if (t && (t.k === 'num' || t.k === 'id' || t.k === '(')) { a = { t: 'bin', op: '*', a, b: unary() }; continue; }
      return a;
    }
  }
  function unary(): Node {
    const t = peek();
    if (t && t.k === 'op' && (t.v === '-' || t.v === '+')) { next(); const a = unary(); return t.v === '-' ? { t: 'neg', a } : a; }
    return power();
  }
  function power(): Node {
    const a = atom();
    if (!atEnd() && peek().k === 'op' && peek().v === '^') { next(); return { t: 'bin', op: '^', a, b: unary() }; }
    return a;
  }
  function atom(): Node {
    const t = next();
    if (!t) throw new ExprError('The formula ends too soon', src.length);
    if (t.k === 'num') return { t: 'num', v: Number(t.v) };
    if (t.k === '(') { const e = expr(); expect(')'); return e; }
    if (t.k === 'id') {
      const name = t.v;
      if (!atEnd() && peek().k === '(' && (name in FN1 || name in FN2)) {
        next();
        const args: Node[] = [];
        if (peek()?.k !== ')') { args.push(expr()); while (peek()?.k === ',') { next(); args.push(expr()); } }
        expect(')');
        const want = name in FN1 ? 1 : 2;
        if (args.length !== want) throw new ExprError(`${name}() takes ${want} value${want > 1 ? 's' : ''}`, t.at);
        return { t: 'fn', name, args };
      }
      if (name in FN1 || name in FN2) throw new ExprError(`${name} needs brackets, like ${name}(x)`, t.at);
      if (name in CONSTANTS) return { t: 'num', v: CONSTANTS[name] };
      return { t: 'var', name };
    }
    throw new ExprError(t.k === ')' ? 'There is a ")" without a matching "("' : `Unexpected "${t.v}"`, t.at);
  }
  if (!toks.length) throw new ExprError('Type a formula', 0);
  const tree = expr();
  if (!atEnd()) throw new ExprError(`Unexpected "${peek().v}"`, peek().at);
  return tree;
}

/** Variable names in the order they first appear. */
export function variables(n: Node, out: string[] = []): string[] {
  if (n.t === 'var') { if (!out.includes(n.name)) out.push(n.name); }
  else if (n.t === 'neg') variables(n.a, out);
  else if (n.t === 'bin') { variables(n.a, out); variables(n.b, out); }
  else if (n.t === 'fn') n.args.forEach((a) => variables(a, out));
  return out;
}

/** Compile to a function taking values in the order of `names`. `degrees` makes sin/cos/tan take degrees and the inverse functions return them. */
export function compile(n: Node, names: string[], degrees = false): (v: ArrayLike<number>) => number {
  const D = Math.PI / 180;
  const c = (n: Node): ((v: ArrayLike<number>) => number) => {
    switch (n.t) {
      case 'num': { const k = n.v; return () => k; }
      case 'var': { const i = names.indexOf(n.name); if (i < 0) throw new ExprError(`No value for ${n.name}`, 0); return (v) => v[i]; }
      case 'neg': { const a = c(n.a); return (v) => -a(v); }
      case 'bin': {
        const a = c(n.a), b = c(n.b);
        switch (n.op) {
          case '+': return (v) => a(v) + b(v);
          case '-': return (v) => a(v) - b(v);
          case '*': return (v) => a(v) * b(v);
          case '/': return (v) => a(v) / b(v);
          case '^': return (v) => Math.pow(a(v), b(v));
        }
      }
      // falls through (unreachable)
      case 'fn': {
        const name = n.name, args = n.args.map(c);
        if (name in FN1) {
          const f = FN1[name], a = args[0];
          if (degrees && TRIG.has(name)) return (v) => f(a(v) * D);
          if (degrees && ATRIG.has(name)) return (v) => f(a(v)) / D;
          return (v) => f(a(v));
        }
        const f = FN2[name], [a, b] = args;
        if (degrees && name === 'atan2') return (v) => f(a(v), b(v)) / D;
        return (v) => f(a(v), b(v));
      }
    }
  };
  return c(n);
}

/** Split "g = 4 pi^2 L / T^2" into a result name and the formula. */
export function splitName(src: string): { name: string; formula: string } {
  const m = /^\s*([A-Za-z_Ͱ-Ͽ][\wͰ-Ͽ]*)\s*=(?!=)(.*)$/s.exec(src);
  return m ? { name: m[1], formula: m[2] } : { name: 'y', formula: src };
}
