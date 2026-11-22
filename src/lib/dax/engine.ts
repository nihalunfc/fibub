// A small DAX engine for the Power BI course: enough of the language to learn measures, filter context,
// row context, CALCULATE, iterators and time intelligence, running in the browser on a small model.
// It is not Microsoft's engine; it follows the documented rules (dax.guide, learn.microsoft.com/dax) and
// is checked against hand-worked answers in tests/dax.mjs. Plain TypeScript, no DOM.
//
// Supported: measures (`Name = ...`), calculated columns (`Table[Col] = ...`), queries (`EVALUATE ...
// ORDER BY ...`), VAR/RETURN, the operators + - * / ^ & = == <> < > <= >= && || IN NOT, and the functions in FN below.
// Simplifications (said in the lessons): relationships are many-to-one, single direction; a table filter
// from FILTER(Fact, ...) filters the fact table only; ALLSELECTED removes the filters the visual adds.
import type { Trace, Step, VTable, Cell } from './trace';

export type Val = number | string | boolean | null;
export type Col = { table: string | null; name: string };
export type Tbl = { cols: Col[]; rows: Val[][] };
export type ModelSpec = {
  tables: { name: string; cols: string[]; rows: Val[][] }[];
  relationships: { many: string; fk: string; one: string; pk: string }[];
  dateTable?: { table: string; col: string };
};

export class DaxError extends Error {}
const err = (m: string): never => { throw new DaxError(m); };

// ---------- tokens ----------
type Tok = { t: 'num' | 'str' | 'col' | 'mref' | 'id' | 'op' | 'eof'; v: string; table?: string; line: number; first: boolean; pos: number };
export function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0, line = 1, lineStart = true;
  const push = (t: Tok['t'], v: string, pos: number, table?: string) => { out.push({ t, v, table, line, first: lineStart, pos }); lineStart = false; };
  while (i < src.length) {
    const c = src[i];
    if (c === '\n') { line++; lineStart = true; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if ((c === '/' && src[i + 1] === '/') || (c === '-' && src[i + 1] === '-')) { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { const e = src.indexOf('*/', i + 2); const end = e < 0 ? src.length : e + 2; for (let k = i; k < end; k++) if (src[k] === '\n') line++; i = end; continue; }
    const pos = i;
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] ?? ''))) {
      const m = /^[0-9]*\.?[0-9]+(e[+-]?[0-9]+)?/i.exec(src.slice(i))!; push('num', m[0], pos); i += m[0].length; continue;
    }
    if (c === '"') {
      let s = ''; i++;
      while (i < src.length) { if (src[i] === '"') { if (src[i + 1] === '"') { s += '"'; i += 2; continue; } break; } s += src[i++]; }
      if (src[i] !== '"') err(`A text value that starts with " on line ${line} never ends. Add the closing ".`);
      i++; push('str', s, pos); continue;
    }
    if (c === '[') {
      const e = src.indexOf(']', i); if (e < 0) err(`A [ on line ${line} has no closing ].`);
      push('mref', src.slice(i + 1, e).trim(), pos); i = e + 1; continue;
    }
    if (c === "'") {
      const e = src.indexOf("'", i + 1); if (e < 0) err(`A ' on line ${line} has no closing '.`);
      const name = src.slice(i + 1, e); i = e + 1;
      while (src[i] === ' ') i++;
      if (src[i] === '[') { const f = src.indexOf(']', i); if (f < 0) err(`A [ on line ${line} has no closing ].`); push('col', src.slice(i + 1, f).trim(), pos, name); i = f + 1; }
      else push('id', name, pos);
      continue;
    }
    if (/[A-Za-z_%#]/.test(c)) {
      // % and # are allowed so measure names like "Margin %" or "# Orders" work (they are not DAX operators).
      const m = /^[A-Za-z_%#][A-Za-z0-9_.%#]*/.exec(src.slice(i))!; i += m[0].length;
      if (src[i] === '[') { const f = src.indexOf(']', i); if (f < 0) err(`A [ on line ${line} has no closing ].`); push('col', src.slice(i + 1, f).trim(), pos, m[0]); i = f + 1; }
      else push('id', m[0], pos);
      continue;
    }
    const two = src.slice(i, i + 2);
    if (['&&', '||', '<=', '>=', '<>', '==', ':='].includes(two)) { push('op', two === ':=' ? '=' : two, pos); i += 2; continue; }
    if ('+-*/^&=<>(),{}'.includes(c)) { push('op', c, pos); i++; continue; }
    err(`I don't understand the character "${c}" on line ${line}.`);
  }
  out.push({ t: 'eof', v: '', line, first: true, pos: src.length });
  return out;
}

// ---------- syntax tree ----------
export type Node =
  | { k: 'num'; v: number } | { k: 'str'; v: string }
  | { k: 'col'; table: string; name: string } | { k: 'mref'; name: string } | { k: 'id'; name: string }
  | { k: 'call'; fn: string; args: Node[] } | { k: 'bin'; op: string; l: Node; r: Node } | { k: 'un'; op: string; e: Node }
  | { k: 'tab'; rows: Node[][] } | { k: 'var'; defs: [string, Node][]; ret: Node };
export type Stmt =
  | { k: 'measure'; name: string; e: Node; src: string }
  | { k: 'column'; table: string; name: string; e: Node; src: string }
  | { k: 'query'; e: Node; order: { e: Node; desc: boolean }[]; src: string };

class Parser {
  i = 0;
  toks: Tok[];
  constructor(toks: Tok[]) { this.toks = toks; }
  get p() { return this.toks[this.i]; }
  next() { return this.toks[this.i++]; }
  isOp(v: string) { return this.p.t === 'op' && this.p.v === v; }
  isKw(v: string) { return this.p.t === 'id' && this.p.v.toUpperCase() === v; }
  expect(v: string) { if (!this.isOp(v)) err(`Expected "${v}" on line ${this.p.line}${this.p.t === 'eof' ? ' (the formula ended too soon; is a bracket missing?)' : `, found "${this.p.v}"`}.`); this.next(); }
  expr(): Node { return this.or(); }
  or(): Node { let l = this.and(); while (this.isOp('||')) { this.next(); l = { k: 'bin', op: '||', l, r: this.and() }; } return l; }
  and(): Node { let l = this.not(); while (this.isOp('&&')) { this.next(); l = { k: 'bin', op: '&&', l, r: this.not() }; } return l; }
  not(): Node { if (this.isKw('NOT') && !(this.toks[this.i + 1]?.t === 'op' && this.toks[this.i + 1].v === '(')) { this.next(); return { k: 'un', op: 'NOT', e: this.not() }; } return this.cmp(); }
  cmp(): Node {
    let l = this.cat();
    for (;;) {
      if (this.p.t === 'op' && ['=', '==', '<>', '<', '>', '<=', '>='].includes(this.p.v)) { const op = this.next().v; l = { k: 'bin', op: op === '==' ? '=' : op, l, r: this.cat() }; }
      else if (this.isKw('IN')) { this.next(); l = { k: 'bin', op: 'IN', l, r: this.cat() }; }
      else if (this.isKw('NOT') && this.toks[this.i + 1]?.t === 'id' && this.toks[this.i + 1].v.toUpperCase() === 'IN') { this.next(); this.next(); l = { k: 'un', op: 'NOT', e: { k: 'bin', op: 'IN', l, r: this.cat() } }; }
      else return l;
    }
  }
  cat(): Node { let l = this.add(); while (this.isOp('&')) { this.next(); l = { k: 'bin', op: '&', l, r: this.add() }; } return l; }
  add(): Node { let l = this.mul(); while (this.isOp('+') || this.isOp('-')) { const op = this.next().v; l = { k: 'bin', op, l, r: this.mul() }; } return l; }
  mul(): Node { let l = this.pow(); while (this.isOp('*') || this.isOp('/')) { const op = this.next().v; l = { k: 'bin', op, l, r: this.pow() }; } return l; }
  pow(): Node { const l = this.unary(); if (this.isOp('^')) { this.next(); return { k: 'bin', op: '^', l, r: this.pow() }; } return l; }
  unary(): Node { if (this.isOp('-')) { this.next(); return { k: 'un', op: '-', e: this.unary() }; } if (this.isOp('+')) { this.next(); return this.unary(); } return this.prim(); }
  prim(): Node {
    const t = this.p;
    if (t.t === 'num') { this.next(); return { k: 'num', v: +t.v }; }
    if (t.t === 'str') { this.next(); return { k: 'str', v: t.v }; }
    if (t.t === 'col') { this.next(); return { k: 'col', table: t.table!, name: t.v }; }
    if (t.t === 'mref') { this.next(); return { k: 'mref', name: t.v }; }
    if (this.isOp('(')) { this.next(); const e = this.expr(); this.expect(')'); return e; }
    if (this.isOp('{')) {
      this.next(); const rows: Node[][] = [];
      if (!this.isOp('}')) for (;;) {
        if (this.isOp('(')) { this.next(); const r = [this.expr()]; while (this.isOp(',')) { this.next(); r.push(this.expr()); } this.expect(')'); rows.push(r); }
        else rows.push([this.expr()]);
        if (this.isOp(',')) { this.next(); continue; } break;
      }
      this.expect('}'); return { k: 'tab', rows };
    }
    if (t.t === 'id') {
      const up = t.v.toUpperCase();
      if (up === 'VAR') {
        const defs: [string, Node][] = [];
        while (this.isKw('VAR')) { this.next(); const n = this.next(); if (n.t !== 'id') err(`VAR needs a name on line ${n.line}.`); this.expect('='); defs.push([n.v, this.expr()]); }
        if (!this.isKw('RETURN')) err(`Every VAR needs a RETURN after it (line ${this.p.line}).`);
        this.next(); return { k: 'var', defs, ret: this.expr() };
      }
      this.next();
      if (this.isOp('(')) {
        this.next(); const args: Node[] = [];
        if (!this.isOp(')')) for (;;) { args.push(this.expr()); if (this.isOp(',')) { this.next(); continue; } break; }
        this.expect(')'); return { k: 'call', fn: up, args };
      }
      if (up === 'TRUE' || up === 'FALSE') return { k: 'call', fn: up, args: [] };
      return { k: 'id', name: t.v };
    }
    if (t.t === 'eof') err('The formula ended too soon. Is something missing after an operator or a comma?');
    return err(`Unexpected "${t.v}" on line ${t.line}.`);
  }
}

/** Split the editor text into statements: measures, calculated columns and EVALUATE queries. */
export function parseProgram(src: string): Stmt[] {
  const toks = tokenize(src);
  const starts: number[] = [];
  let depth = 0;
  const isDefAt = (i: number) => {
    const t = toks[i];
    if (t.t === 'id' && t.v.toUpperCase() === 'EVALUATE') return true;
    if ((t.t === 'col' || t.t === 'mref') && toks[i + 1].t === 'op' && toks[i + 1].v === '=') return true;
    if (t.t !== 'id' && !(t.t === 'num' && toks[i + 1].t === 'id' && toks[i + 1].line === t.line)) return false;
    let j = i; while ((toks[j].t === 'id' || toks[j].t === 'num') && toks[j].line === t.line) j++;
    return toks[j].t === 'op' && toks[j].v === '=' && toks[j].line === t.line && !['VAR', 'RETURN'].includes(t.v.toUpperCase());
  };
  for (let i = 0; i < toks.length - 1; i++) {
    const t = toks[i];
    if (depth === 0 && t.first && (t.t !== 'id' || !['DEFINE', 'MEASURE'].includes(t.v.toUpperCase())) && isDefAt(i)) starts.push(i);
    if (t.t === 'op' && (t.v === '(' || t.v === '{')) depth++;
    if (t.t === 'op' && (t.v === ')' || t.v === '}')) depth = Math.max(0, depth - 1);
  }
  if (!starts.length && toks.length > 1) err('Start with a name and an equals sign, like  Total Sales = SUM(Sales[Amount])  or with EVALUATE for a query.');
  const out: Stmt[] = [];
  starts.forEach((s, n) => {
    const end = n + 1 < starts.length ? starts[n + 1] : toks.length - 1;
    const part = [...toks.slice(s, end), { ...toks[toks.length - 1] }];
    const text = src.slice(toks[s].pos, toks[end].pos).trim();
    const P = new Parser(part);
    const t = P.p;
    if (t.t === 'id' && t.v.toUpperCase() === 'EVALUATE') {
      P.next(); const e = P.expr(); const order: { e: Node; desc: boolean }[] = [];
      if (P.isKw('ORDER')) { P.next(); if (!P.isKw('BY')) err('ORDER needs BY after it.'); P.next(); for (;;) { const oe = P.expr(); let desc = false; if (P.isKw('DESC')) { P.next(); desc = true; } else if (P.isKw('ASC')) P.next(); order.push({ e: oe, desc }); if (P.isOp(',')) { P.next(); continue; } break; } }
      if (P.p.t !== 'eof') err(`Unexpected "${P.p.v}" on line ${P.p.line}.`);
      out.push({ k: 'query', e, order, src: text });
      return;
    }
    let name = '', table: string | null = null;
    if (t.t === 'col') { table = t.table!; name = t.v; P.next(); }
    else if (t.t === 'mref') { name = t.v; P.next(); }
    else { const a = P.p.pos; while (P.p.t === 'id' || P.p.t === 'num') P.next(); name = src.slice(a, P.p.pos).trim(); }
    P.expect('=');
    const e = P.expr();
    if (P.p.t !== 'eof') err(`Unexpected "${P.p.v}" on line ${P.p.line}. Is an operator or a comma missing before it?`);
    out.push(table ? { k: 'column', table, name, e, src: text } : { k: 'measure', name, e, src: text });
  });
  return out;
}

// ---------- the model ----------
type Base = { name: string; cols: string[]; idx: Map<string, number>; rows: Val[][] };
type Filter = { table: string; cols: string[]; tuples: Val[][]; keep: Set<unknown>; visual?: boolean };
type Frame = { cols: Col[]; row: Val[] };
type Ctx = { filters: Filter[]; frames: Frame[]; vars: Map<string, Val | Tbl>; depth: number };
const lc = (s: string) => s.toLowerCase();
const key = (vals: Val[]) => (vals.length === 1 ? vals[0] : JSON.stringify(vals));
const ROW = '__row';

export class Model {
  tables = new Map<string, Base>();
  rels: ModelSpec['relationships'];
  dateTable?: { table: string; col: string };
  measures = new Map<string, { name: string; e: Node }>();
  trace: Step[] | null = null;
  private traceOff = 0;
  private visCache = new WeakMap<Filter[], Map<string, number[]>>();
  private pkIndex = new Map<string, Map<unknown, number>>();
  private calcDepth = 0;

  constructor(spec: ModelSpec) {
    for (const t of spec.tables) this.addTable(t.name, t.cols, t.rows.map((r) => [...r]));
    this.rels = spec.relationships.map((r) => ({ ...r }));
    this.dateTable = spec.dateTable;
  }
  addTable(name: string, cols: string[], rows: Val[][]) {
    const all = [...cols, ROW];
    rows.forEach((r, i) => { r.length = cols.length; r.push(i); });
    this.tables.set(lc(name), { name, cols: all, idx: new Map(all.map((c, i) => [lc(c), i])), rows });
  }
  base(name: string) { return this.tables.get(lc(name)) ?? err(`There is no table called '${name}'. Tables: ${[...this.tables.values()].map((t) => t.name).join(', ')}.`); }
  colIdx(table: string, col: string) {
    const b = this.base(table), i = b.idx.get(lc(col));
    if (i === undefined || col === ROW) err(`Table '${b.name}' has no column [${col}]. Its columns: ${b.cols.filter((c) => c !== ROW).join(', ')}.`);
    return i!;
  }
  /** Canonical names, so filters and look-ups agree whatever case the learner typed. */
  canon(c: Col): Col { if (!c.table) return c; const b = this.base(c.table); return { table: b.name, name: b.cols[this.colIdx(b.name, c.name)] }; }
  relsFrom(table: string) { return this.rels.filter((r) => lc(r.many) === lc(table)); }
  /** Tables reachable from `table` along many-to-one relationships (the "expanded table"). */
  expanded(table: string, seen = new Set<string>()): string[] {
    const b = this.base(table).name; if (seen.has(b)) return []; seen.add(b);
    return [b, ...this.relsFrom(b).flatMap((r) => this.expanded(r.one, seen))];
  }
  pk(one: string, pk: string) {
    const k = `${lc(one)}|${lc(pk)}`;
    let m = this.pkIndex.get(k);
    if (!m) { m = new Map(); const b = this.base(one), i = this.colIdx(one, pk); b.rows.forEach((r, n) => m!.set(r[i], n)); this.pkIndex.set(k, m); }
    return m;
  }
  isFiltered(table: string, filters: Filter[]): boolean {
    const b = this.base(table).name;
    return filters.some((f) => f.table === b) || this.relsFrom(b).some((r) => this.isFiltered(r.one, filters));
  }
  /** The row numbers of a table that the filter context lets through (filters flow from one side to many side). */
  visible(table: string, filters: Filter[]): number[] {
    const b = this.base(table);
    let cache = this.visCache.get(filters);
    if (!cache) { cache = new Map(); this.visCache.set(filters, cache); }
    const hit = cache.get(b.name); if (hit) return hit;
    let rows = b.rows.map((_, i) => i);
    for (const f of filters) if (f.table === b.name) {
      // Fast path for a whole-row filter (context transition): pick the rows directly.
      if (f.cols.length === 1 && f.cols[0] === ROW && rows.length === b.rows.length) { rows = (f.tuples.map((t) => t[0]) as number[]).filter((i) => i >= 0 && i < b.rows.length).sort((x, y) => x - y); continue; }
      const ix = f.cols.map((c) => b.idx.get(lc(c))!);
      rows = rows.filter((i) => f.keep.has(key(ix.map((x) => b.rows[i][x]))));
    }
    for (const r of this.relsFrom(b.name)) {
      if (!this.isFiltered(r.one, filters)) continue;
      const one = this.base(r.one), pi = this.colIdx(r.one, r.pk), fi = this.colIdx(b.name, r.fk);
      const ok = new Set(this.visible(r.one, filters).map((i) => one.rows[i][pi]));
      rows = rows.filter((i) => ok.has(b.rows[i][fi]));
    }
    cache.set(b.name, rows);
    return rows;
  }
  baseTbl(table: string, rows: number[]): Tbl {
    const b = this.base(table);
    return { cols: b.cols.map((c) => ({ table: b.name, name: c })), rows: rows.map((i) => b.rows[i]) };
  }
  /** Values of one column through the filter context (with RELATED-style look-ups not needed: base column). */
  colValues(c: Col, ctx: Ctx, all = false) {
    const cc = this.canon(c), b = this.base(cc.table!), i = this.colIdx(cc.table!, cc.name);
    const rows = all ? b.rows.map((_, n) => n) : this.visible(b.name, ctx.filters);
    return rows.map((n) => b.rows[n][i]);
  }

  // ----- filters -----
  makeFilter(table: string, cols: string[], tuples: Val[][], visual = false): Filter {
    const seen = new Map<unknown, Val[]>(); for (const t of tuples) seen.set(key(t), t);
    return { table: this.base(table).name, cols, tuples: [...seen.values()], keep: new Set(seen.keys()), visual };
  }
  /** Drop the filters on some columns of a table (all of its columns when cols is null). */
  removeCols(filters: Filter[], table: string, cols: string[] | null, keepOnly?: Set<string>): Filter[] {
    const b = this.base(table).name;
    const out: Filter[] = [];
    for (const f of filters) {
      if (f.table !== b) { out.push(f); continue; }
      if (cols === null && !keepOnly) continue;
      const drop = keepOnly ? f.cols.filter((c) => !keepOnly.has(lc(c))) : f.cols.filter((c) => cols!.some((x) => lc(x) === lc(c)));
      if (keepOnly && f.cols.includes(ROW)) {
        // A whole-row filter (from context transition) keeps only the listed columns' values of those rows.
        const tb = this.base(b), keepCols = [...keepOnly].filter((c) => tb.idx.has(c) && c !== ROW);
        if (keepCols.length) { const ix = keepCols.map((c) => tb.idx.get(c)!); out.push(this.makeFilter(b, keepCols.map((c) => tb.cols[tb.idx.get(c)!]), f.tuples.map((t) => ix.map((i) => tb.rows[t[0] as number][i])), f.visual)); }
        continue;
      }
      if (!drop.length) { out.push(f); continue; }
      const rest = f.cols.map((c, i) => [c, i] as const).filter(([c]) => !drop.includes(c));
      if (!rest.length) continue;
      out.push(this.makeFilter(b, rest.map(([c]) => c), f.tuples.map((t) => rest.map(([, i]) => t[i])), f.visual));
    }
    return out;
  }
  /** Filters that a table of values sets: one per base table among its columns. */
  filtersFromTable(t: Tbl): Filter[] {
    const by = new Map<string, number[]>();
    t.cols.forEach((c, i) => { if (c.table) { const b = this.base(c.table).name; by.set(b, [...(by.get(b) ?? []), i]); } });
    if (!by.size && t.cols.length) err('This table has no columns from the model, so it cannot be used as a filter.');
    return [...by].map(([table, ix]) => {
      const r = ix.find((i) => t.cols[i].name === ROW);
      if (r !== undefined) return this.makeFilter(table, [ROW], t.rows.map((row) => [row[r]]));
      return this.makeFilter(table, ix.map((i) => t.cols[i].name), t.rows.map((row) => ix.map((i) => row[i])));
    });
  }
  /** CALCULATE's overwrite rule: a new filter replaces the existing filters on the same columns. */
  overwrite(filters: Filter[], f: Filter): Filter[] {
    let base = filters;
    if (f.cols.includes(ROW)) base = this.removeCols(base, f.table, null);
    else if (this.dateTable && lc(f.table) === lc(this.dateTable.table) && f.cols.some((c) => lc(c) === lc(this.dateTable!.col))) base = this.removeCols(base, f.table, null);
    else base = this.removeCols(base, f.table, f.cols);
    return [...base, f];
  }
  /** Context transition: the current row(s) become filters. */
  transition(ctx: Ctx): Filter[] {
    let filters = ctx.filters;
    for (const fr of ctx.frames) for (const f of this.filtersFromTable({ cols: fr.cols, rows: [fr.row] }).filter(() => true)) filters = this.overwrite(filters, f);
    return filters;
  }

  // ----- evaluation -----
  newCtx(filters: Filter[] = []): Ctx { return { filters, frames: [], vars: new Map(), depth: 0 }; }
  scalar(n: Node, ctx: Ctx): Val {
    switch (n.k) {
      case 'num': return n.v;
      case 'str': return n.v;
      case 'col': return this.colInRow({ table: n.table, name: n.name }, ctx);
      case 'mref': return this.mref(n.name, ctx);
      case 'id': {
        const v = ctx.vars.get(lc(n.name));
        if (v !== undefined) { if (isTbl(v)) return this.one(v, n.name); return v; }
        if (['BLANK'].includes(n.name.toUpperCase())) return null;
        if (this.tables.has(lc(n.name))) err(`'${n.name}' is a table, but a single value is needed here. Did you mean COUNTROWS(${n.name}) or a column like ${n.name}[Amount]?`);
        return err(`I don't know "${n.name}". If it is a measure, put it in square brackets: [${n.name}].`);
      }
      case 'un': { const v = this.scalar(n.e, ctx); return n.op === '-' ? (v === null ? null : -num(v)) : !truthy(v); }
      case 'bin': return this.bin(n, ctx);
      case 'tab': { const t = this.table(n, ctx); return this.one(t, 'a table constructor'); }
      case 'var': return this.withVars(n, ctx, (c) => this.scalar(n.ret, c));
      case 'call': return this.call(n, ctx);
    }
  }
  withVars<T>(n: Extract<Node, { k: 'var' }>, ctx: Ctx, f: (c: Ctx) => T): T {
    const vars = new Map(ctx.vars); const c = { ...ctx, vars };
    for (const [name, e] of n.defs) vars.set(lc(name), isTableExpr(e, this, vars) ? this.table(e, c) : this.scalar(e, c));
    return f(c);
  }
  one(t: Tbl, what: string): Val {
    if (t.rows.length === 0) return null;
    if (t.rows.length === 1 && t.cols.filter((c) => c.name !== ROW).length === 1) return t.rows[0][t.cols.findIndex((c) => c.name !== ROW)];
    return err(`${what} gives a table with ${t.rows.length} rows, but one value is needed here.`);
  }
  colInRow(c: Col, ctx: Ctx): Val {
    const cc = this.canon(c);
    for (let i = ctx.frames.length - 1; i >= 0; i--) {
      const fr = ctx.frames[i];
      const j = fr.cols.findIndex((x) => x.table === cc.table && lc(x.name) === lc(cc.name));
      if (j >= 0) return fr.row[j];
    }
    return err(`A single value for column '${cc.table}'[${cc.name}] cannot be determined. A measure has no "current row": wrap the column in an aggregation such as SUM('${cc.table}'[${cc.name}]), or use an iterator such as SUMX.`);
  }
  mref(name: string, ctx: Ctx): Val {
    for (let i = ctx.frames.length - 1; i >= 0; i--) {
      const fr = ctx.frames[i], j = fr.cols.findIndex((x) => x.table === null && lc(x.name) === lc(name));
      if (j >= 0) return fr.row[j];
    }
    const m = this.measures.get(lc(name));
    if (m) {
      if (this.calcDepth > 40) err(`The measure [${m.name}] refers to itself (directly or through another measure).`);
      return this.calculate(m.e, [], ctx);
    }
    for (let i = ctx.frames.length - 1; i >= 0; i--) {
      const fr = ctx.frames[i], j = fr.cols.findIndex((x) => lc(x.name) === lc(name));
      if (j >= 0) return fr.row[j];
    }
    return err(`There is no measure called [${name}].${this.measures.size ? ` Measures so far: ${[...this.measures.values()].map((x) => `[${x.name}]`).join(', ')}.` : ' Define it first, on its own line: ' + name + ' = ...'}`);
  }
  bin(n: Extract<Node, { k: 'bin' }>, ctx: Ctx): Val {
    if (n.op === '&&') return truthy(this.scalar(n.l, ctx)) && truthy(this.scalar(n.r, ctx));
    if (n.op === '||') return truthy(this.scalar(n.l, ctx)) || truthy(this.scalar(n.r, ctx));
    if (n.op === 'IN') {
      const v = this.scalar(n.l, ctx), t = this.table(n.r, ctx);
      return t.rows.some((r) => eq(r[t.cols.findIndex((c) => c.name !== ROW)], v));
    }
    const a = this.scalar(n.l, ctx), b = this.scalar(n.r, ctx);
    switch (n.op) {
      case '+': return a === null && b === null ? null : num(a) + num(b);
      case '-': return a === null && b === null ? null : num(a) - num(b);
      case '*': return a === null || b === null ? null : num(a) * num(b);
      case '/': if (a === null) return null; if (num(b) === 0) return num(a) === 0 ? NaN : num(a) > 0 ? Infinity : -Infinity; return num(a) / num(b);
      case '^': return a === null ? null : num(a) ** num(b);
      case '&': return str(a) + str(b);
      case '=': return eq(a, b);
      case '<>': return !eq(a, b);
      default: { const c = cmp(a, b); return n.op === '<' ? c < 0 : n.op === '>' ? c > 0 : n.op === '<=' ? c <= 0 : c >= 0; }
    }
  }

  /** CALCULATE(expr, filters...): transition, then ALL-type modifiers, then the new filters overwrite. */
  calculate(e: Node, args: Node[], ctx: Ctx, extra: Tbl[] = [], asTable = false): any {
    let filters = this.transition(ctx);
    const adds: { f: Filter; keep: boolean }[] = [];
    const removes: ((fs: Filter[]) => Filter[])[] = [];
    const notes: string[] = [];
    for (const a of args) {
      const fn = a.k === 'call' ? a.fn : '';
      if (fn === 'ALL' || fn === 'REMOVEFILTERS' || fn === 'ALLNOBLANKROW') {
        if (a.k !== 'call') continue;
        if (!a.args.length) { removes.push(() => []); notes.push('removes every filter'); continue; }
        for (const x of a.args) {
          if (x.k === 'id' && this.tables.has(lc(x.name))) { const ex = this.expanded(x.name); removes.push((fs) => ex.reduce((acc, t) => this.removeCols(acc, t, null), fs)); notes.push(`removes the filters on ${this.base(x.name).name}${ex.length > 1 ? ` (and ${ex.slice(1).join(', ')}, which it looks up)` : ''}`); }
          else if (x.k === 'col') { const c = this.canon(x); removes.push((fs) => this.removeCols(fs, c.table!, [c.name])); notes.push(`removes the filter on ${c.table}[${c.name}]`); }
          else err(`${fn} inside CALCULATE takes a table or columns.`);
        }
        continue;
      }
      if (fn === 'ALLEXCEPT' && a.k === 'call') {
        const [t, ...cs] = a.args; if (!t || t.k !== 'id') err('ALLEXCEPT needs a table first.');
        const keep = new Set(cs.map((c) => (c.k === 'col' ? lc(this.canon(c).name) : err('ALLEXCEPT lists columns after the table.'))));
        const keepT = new Set(cs.map((c) => (c.k === 'col' ? this.canon(c).table! : '')));
        const ex = this.expanded((t as any).name);
        removes.push((fs) => ex.reduce((acc, tb) => (keepT.has(tb) ? this.removeCols(acc, tb, null, keep) : this.removeCols(acc, tb, null)), fs));
        notes.push(`removes the filters on ${this.base((t as any).name).name} except ${cs.map((c: any) => `[${c.name}]`).join(', ')}`);
        continue;
      }
      if (fn === 'ALLSELECTED' && a.k === 'call') {
        removes.push((fs) => fs.filter((f) => !f.visual || (a.args.length > 0 && !a.args.some((x) => (x.k === 'col' && f.cols.some((c) => lc(c) === lc(x.name))) || (x.k === 'id' && lc(x.name) === lc(f.table))))));
        notes.push('removes the filters the visual adds (keeps slicers and page filters)');
        continue;
      }
      if (fn === 'USERELATIONSHIP' || fn === 'CROSSFILTER') continue;
      let keepF = false, x = a;
      if (fn === 'KEEPFILTERS' && a.k === 'call') { keepF = true; x = a.args[0]; }
      if (isTableExpr(x, this, ctx.vars)) {
        const t = this.table(x, ctx);
        for (const f of this.filtersFromTable(t)) adds.push({ f, keep: keepF });
        notes.push(`${keepF ? 'adds' : 'sets'} a filter from ${short(x)}`);
      } else {
        // A true/false condition: FILTER(ALL(the columns it uses), condition).
        const cols = colsIn(x).map((c) => this.canon(c));
        if (!cols.length) err(`The filter "${short(x)}" doesn't use any column. A CALCULATE filter looks like Product[Category] = "Home".`);
        const tables = new Set(cols.map((c) => c.table));
        if (tables.size > 1) err(`A CALCULATE condition can use columns from one table only ("${short(x)}" uses ${[...tables].join(' and ')}). Use FILTER instead.`);
        const tb = cols[0].table!, names = [...new Set(cols.map((c) => c.name))];
        const ix = names.map((c) => this.colIdx(tb, c)), b = this.base(tb);
        const tuples = new Map<unknown, Val[]>(); for (const r of b.rows) { const tv = ix.map((i) => r[i]); tuples.set(key(tv), tv); }
        const colObjs = names.map((nm) => ({ table: tb, name: nm }));
        const kept = [...tuples.values()].filter((tv) => truthy(this.scalar(x, { ...ctx, frames: [...ctx.frames, { cols: colObjs, row: tv }] })));
        adds.push({ f: this.makeFilter(tb, names, kept), keep: keepF });
        notes.push(`${keepF ? 'adds' : 'sets'} ${short(x)}`);
      }
    }
    for (const t of extra) for (const f of this.filtersFromTable(t)) { adds.push({ f, keep: false }); notes.push(`sets a filter on ${f.table}[${f.cols.join(', ')}] (${f.tuples.length} value${f.tuples.length === 1 ? '' : 's'})`); }
    for (const r of removes) filters = r(filters);
    for (const { f, keep } of adds) filters = keep ? [...filters, f] : this.overwrite(filters, f);
    if (this.tracing && (notes.length || ctx.frames.length)) this.traceContext(`CALCULATE ${ctx.frames.length ? 'turns the current row into a filter (context transition) and ' : ''}${notes.join(', ') || 'keeps the filters'}.`, filters);
    const c2: Ctx = { filters, frames: [], vars: ctx.vars, depth: ctx.depth + 1 };
    this.calcDepth++;
    try { return asTable ? this.table(e, c2) : this.scalar(e, c2); } finally { this.calcDepth--; }
  }

  table(n: Node, ctx: Ctx): Tbl {
    if (n.k === 'id') {
      const v = ctx.vars.get(lc(n.name));
      if (v !== undefined) { if (!isTbl(v)) err(`The variable ${n.name} holds a single value, but a table is needed here.`); return v as Tbl; }
      const b = this.base(n.name); return this.baseTbl(b.name, this.visible(b.name, ctx.filters));
    }
    if (n.k === 'var') return this.withVars(n, ctx, (c) => this.table(n.ret, c));
    if (n.k === 'tab') {
      const rows = n.rows.map((r) => r.map((e) => this.scalar(e, ctx)));
      const w = Math.max(1, ...rows.map((r) => r.length));
      return { cols: Array.from({ length: w }, (_, i) => ({ table: null, name: w === 1 ? 'Value' : `Value${i + 1}` })), rows };
    }
    if (n.k === 'col') { err(`A column on its own isn't a table here. Use VALUES(${n.table}[${n.name}]) for its values.`); }
    if (n.k !== 'call') return err(`"${short(n)}" is a single value, but a table is needed here.`);
    const A = n.args, f = n.fn;
    const need = (k: number) => { if (A.length < k) err(`${f} needs at least ${k} argument${k > 1 ? 's' : ''}.`); };
    switch (f) {
      case 'FILTER': {
        need(2); const t = this.table(A[0], ctx);
        const keep = t.rows.map((r) => truthy(this.inRow(A[1], ctx, t.cols, r)));
        const out = { cols: t.cols, rows: t.rows.filter((_, i) => keep[i]) };
        if (this.tracing) this.traceFilter(t, keep, `FILTER keeps the rows where ${short(A[1])}: ${out.rows.length} of ${t.rows.length}.`);
        return out;
      }
      case 'ALL': case 'REMOVEFILTERS': case 'ALLNOBLANKROW': case 'ALLSELECTED': {
        if (!A.length) err(`${f} on its own works only as a CALCULATE filter.`);
        const filters = f === 'ALLSELECTED' ? ctx.filters.filter((x) => !x.visual) : [];
        if (A[0].k === 'id') { const b = this.base(A[0].name); return this.baseTbl(b.name, f === 'ALLSELECTED' ? this.visible(b.name, filters) : b.rows.map((_, i) => i)); }
        return this.distinct(A.map((a) => (a.k === 'col' ? this.canon(a) : err(`${f} takes a table or columns.`))), { ...ctx, filters });
      }
      case 'VALUES': case 'DISTINCT': {
        need(1);
        if (A[0].k === 'id' && !ctx.vars.has(lc(A[0].name))) { const b = this.base(A[0].name); return this.baseTbl(b.name, this.visible(b.name, ctx.filters)); }
        if (A[0].k === 'col') return this.distinct([this.canon(A[0])], ctx);
        const t = this.table(A[0], ctx); return dedupe(t);
      }
      case 'ALLEXCEPT': {
        need(2); const tb = (A[0] as any).name; const keep = A.slice(1).map((c) => this.canon(c as Col));
        const ex = this.expanded(tb);
        const filters = ex.reduce((acc, t) => this.removeCols(acc, t, null, new Set(keep.filter((k) => k.table === t).map((k) => lc(k.name)))), ctx.filters);
        const b = this.base(tb); return this.baseTbl(b.name, this.visible(b.name, filters));
      }
      case 'CALCULATETABLE': need(1); return this.calculate(A[0], A.slice(1), ctx, [], true);
      case 'RELATEDTABLE': { need(1); return this.calculate(A[0], [], ctx, [], true); }
      case 'SUMMARIZECOLUMNS': return this.summarizeColumns(A, ctx);
      case 'SUMMARIZE': return this.summarize(A, ctx);
      case 'ADDCOLUMNS': case 'SELECTCOLUMNS': {
        need(1); const t = this.table(A[0], ctx);
        const extra: [string, Node][] = [];
        for (let i = 1; i < A.length; i += 2) { const nm = A[i]; if (nm.k !== 'str') err(`${f} needs a name in quotes before each expression, like "Sales", [Total Sales].`); if (!A[i + 1]) err(`${f}: "${(nm as any).v}" has no expression after it.`); extra.push([(nm as any).v, A[i + 1]]); }
        const vals = t.rows.map((r) => extra.map(([, e]) => this.inRow(e, ctx, t.cols, r)));
        const newCols = extra.map(([nm, e]) => (f === 'SELECTCOLUMNS' && e.k === 'col' ? { ...this.canon(e), alias: nm } as any : { table: null, name: nm }));
        if (f === 'ADDCOLUMNS') return { cols: [...t.cols, ...newCols], rows: t.rows.map((r, i) => [...r, ...vals[i]]) };
        return { cols: newCols, rows: vals };
      }
      case 'TOPN': {
        need(2); const nTop = num(this.scalar(A[0], ctx)), t = this.table(A[1], ctx);
        if (A.length < 3) return { cols: t.cols, rows: t.rows.slice(0, nTop) };
        const keys = t.rows.map((r) => this.inRow(A[2], ctx, t.cols, r));
        const asc = A[3] ? orderArg(A[3], this, ctx) : false;
        const order = t.rows.map((_, i) => i).sort((a, b) => (asc ? 1 : -1) * cmp(keys[a], keys[b]));
        if (order.length <= nTop) return { cols: t.cols, rows: order.map((i) => t.rows[i]) };
        const cut = keys[order[nTop - 1]];
        return { cols: t.cols, rows: order.filter((i, k) => k < nTop || eq(keys[i], cut)).map((i) => t.rows[i]) };
      }
      case 'CROSSJOIN': {
        need(1); let t = this.table(A[0], ctx);
        for (const x of A.slice(1)) { const u = this.table(x, ctx); t = { cols: [...t.cols, ...u.cols], rows: t.rows.flatMap((r) => u.rows.map((s) => [...r, ...s])) }; }
        return t;
      }
      case 'UNION': { need(2); const ts = A.map((x) => this.table(x, ctx)); return { cols: ts[0].cols, rows: ts.flatMap((t) => t.rows) }; }
      case 'TREATAS': {
        need(2); const t = this.table(A[0], ctx);
        const cols = A.slice(1).map((c) => (c.k === 'col' ? this.canon(c) : err('TREATAS lists the columns to filter after the table.')));
        const vis = t.cols.map((c, i) => [c, i] as const).filter(([c]) => c.name !== ROW);
        if (vis.length !== cols.length) err(`TREATAS: the table has ${vis.length} column(s) but you listed ${cols.length}.`);
        return { cols, rows: t.rows.map((r) => vis.map(([, i]) => r[i])) };
      }
      case 'ROW': {
        const cols: Col[] = [], row: Val[] = [];
        for (let i = 0; i < A.length; i += 2) { cols.push({ table: null, name: (A[i] as any).v }); row.push(this.scalar(A[i + 1], ctx)); }
        return { cols, rows: [row] };
      }
      case 'CALENDAR': case 'CALENDARAUTO': {
        let a: string, b: string;
        if (f === 'CALENDAR') { need(2); a = str(this.scalar(A[0], ctx)); b = str(this.scalar(A[1], ctx)); }
        else { const ds = [...this.tables.values()].flatMap((t) => t.rows.flatMap((r) => r.filter((v) => typeof v === 'string' && /^\d{4}-\d\d-\d\d$/.test(v)))) as string[]; ds.sort(); a = ds[0].slice(0, 4) + '-01-01'; b = ds[ds.length - 1].slice(0, 4) + '-12-31'; }
        if (!/^\d{4}-\d\d-\d\d$/.test(a) || !/^\d{4}-\d\d-\d\d$/.test(b)) err('CALENDAR needs two dates, like CALENDAR(DATE(2025, 1, 1), DATE(2025, 12, 31)).');
        const rows: Val[][] = []; for (let d = a; d <= b && rows.length < 40000; d = addDays(d, 1)) rows.push([d]);
        return { cols: [{ table: null, name: 'Date' }], rows };
      }
      case 'GENERATESERIES': { need(2); const a = num(this.scalar(A[0], ctx)), b = num(this.scalar(A[1], ctx)), s = A[2] ? num(this.scalar(A[2], ctx)) : 1; const rows: Val[][] = []; for (let x = a; x <= b + 1e-9 && rows.length < 10000; x += s) rows.push([x]); return { cols: [{ table: null, name: 'Value' }], rows }; }
      case 'DATESYTD': case 'DATESQTD': case 'DATESMTD': {
        need(1); const c = this.dateCol(A[0]); const d = this.datesIn(c, ctx); if (!d.length) return { cols: [c], rows: [] };
        const last = d[d.length - 1];
        const start = f === 'DATESYTD' ? last.slice(0, 4) + '-01-01' : f === 'DATESMTD' ? last.slice(0, 8) + '01' : `${last.slice(0, 4)}-${String(Math.floor((+last.slice(5, 7) - 1) / 3) * 3 + 1).padStart(2, '0')}-01`;
        return this.dateRange(c, start, last);
      }
      case 'SAMEPERIODLASTYEAR': need(1); return this.shiftDates(this.dateCol(A[0]), -12, 'MONTH', ctx);
      case 'DATEADD': {
        need(3); const unit = (A[2] as any).name?.toUpperCase?.() ?? '';
        if (!['DAY', 'MONTH', 'QUARTER', 'YEAR'].includes(unit)) err('DATEADD needs DAY, MONTH, QUARTER or YEAR as its third argument.');
        const n2 = num(this.scalar(A[1], ctx));
        return unit === 'DAY' ? this.shiftDays(this.dateCol(A[0]), n2, ctx) : this.shiftDates(this.dateCol(A[0]), unit === 'YEAR' ? 12 * n2 : unit === 'QUARTER' ? 3 * n2 : n2, 'MONTH', ctx);
      }
      case 'PARALLELPERIOD': case 'PREVIOUSMONTH': case 'PREVIOUSYEAR': case 'PREVIOUSQUARTER': case 'NEXTMONTH': case 'NEXTYEAR': {
        need(1); const c = this.dateCol(A[0]); const d = this.datesIn(c, ctx); if (!d.length) return { cols: [c], rows: [] };
        let unit = f.replace(/^(PREVIOUS|NEXT)/, ''), n2 = f.startsWith('NEXT') ? 1 : -1;
        if (f === 'PARALLELPERIOD') { n2 = num(this.scalar(A[1], ctx)); unit = (A[2] as any).name.toUpperCase(); }
        const months = unit === 'YEAR' ? 12 : unit === 'QUARTER' ? 3 : 1;
        const anchor = n2 < 0 ? d[0] : d[d.length - 1];
        const s = periodStart(addMonths(anchor, n2 * months), months), e = addDays(addMonths(s, months * (f === 'PARALLELPERIOD' ? Math.max(1, monthsSpan(d, months)) : 1)), -1);
        return this.dateRange(c, s, e);
      }
      case 'DATESINPERIOD': {
        need(4); const c = this.dateCol(A[0]); const start = str(this.scalar(A[1], ctx)), n2 = num(this.scalar(A[2], ctx)); const unit = (A[3] as any).name?.toUpperCase?.();
        const end = unit === 'DAY' ? addDays(start, n2) : addMonths(start, (unit === 'YEAR' ? 12 : unit === 'QUARTER' ? 3 : 1) * n2);
        return n2 < 0 ? this.dateRange(c, addDays(end, 1), start) : this.dateRange(c, start, addDays(end, -1));
      }
      case 'DATESBETWEEN': { need(3); const c = this.dateCol(A[0]); const a = this.scalar(A[1], ctx), b = this.scalar(A[2], ctx); return this.dateRange(c, a === null ? '0000-01-01' : str(a), b === null ? '9999-12-31' : str(b)); }
      case 'FIRSTDATE': case 'LASTDATE': { need(1); const c = this.dateCol(A[0]); const d = this.datesIn(c, ctx); return { cols: [c], rows: d.length ? [[f === 'FIRSTDATE' ? d[0] : d[d.length - 1]]] : [] }; }
      case 'STARTOFMONTH': case 'ENDOFMONTH': case 'STARTOFYEAR': case 'ENDOFYEAR': {
        need(1); const c = this.dateCol(A[0]); const d = this.datesIn(c, ctx); if (!d.length) return { cols: [c], rows: [] };
        const v = f === 'STARTOFMONTH' ? d[0].slice(0, 8) + '01' : f === 'STARTOFYEAR' ? d[0].slice(0, 4) + '-01-01' : f === 'ENDOFYEAR' ? d[d.length - 1].slice(0, 4) + '-12-31' : addDays(addMonths(d[d.length - 1].slice(0, 8) + '01', 1), -1);
        return { cols: [c], rows: [[v]] };
      }
      case 'TOPNSKIP': default:
        if (FN_SCALAR.has(f)) return err(`${f} gives a single value, but a table is needed here.`);
        return err(`I don't know the function ${f}. (This practice engine covers the functions used in the course; see the cheat sheet.)`);
    }
  }
  inRow(e: Node, ctx: Ctx, cols: Col[], row: Val[]) { return this.scalar(e, { ...ctx, frames: [...ctx.frames, { cols, row }] }); }
  distinct(cols: Col[], ctx: Ctx): Tbl {
    const tb = cols[0].table!;
    if (cols.some((c) => c.table !== tb)) err('Columns from different tables: use SUMMARIZE or CROSSJOIN.');
    const b = this.base(tb), ix = cols.map((c) => this.colIdx(tb, c.name));
    const seen = new Map<unknown, Val[]>();
    for (const n of this.visible(tb, ctx.filters)) { const v = ix.map((i) => b.rows[n][i]); const k = key(v); if (!seen.has(k)) seen.set(k, v); }
    return { cols, rows: [...seen.values()] };
  }
  dateCol(n: Node): Col {
    if (n.k !== 'col') err('Time intelligence functions need a date column, such as \'Date\'[Date].');
    return this.canon(n as Col);
  }
  datesIn(c: Col, ctx: Ctx): string[] { return [...new Set(this.colValues(c, ctx).filter((v) => v !== null).map(String))].sort(); }
  dateRange(c: Col, a: string, b: string): Tbl {
    const all = [...new Set(this.colValues(c, this.newCtx(), true).map(String))].sort();
    return { cols: [c], rows: all.filter((d) => d >= a && d <= b).map((d) => [d]) };
  }
  shiftDays(c: Col, n: number, ctx: Ctx): Tbl {
    const all = new Set(this.colValues(c, this.newCtx(), true).map(String));
    return { cols: [c], rows: this.datesIn(c, ctx).map((d) => addDays(d, n)).filter((d) => all.has(d)).map((d) => [d]) };
  }
  /** Shift by whole months; a fully selected month maps to the whole target month (as DAX does). */
  shiftDates(c: Col, months: number, _u: string, ctx: Ctx): Tbl {
    const all = new Set(this.colValues(c, this.newCtx(), true).map(String));
    const d = this.datesIn(c, ctx), byM = new Map<string, string[]>();
    for (const x of d) byM.set(x.slice(0, 7), [...(byM.get(x.slice(0, 7)) ?? []), x]);
    const out = new Set<string>();
    for (const [m, ds] of byM) {
      const first = m + '-01', days = daysInMonth(first);
      if (ds.length === days) { const t = addMonths(first, months); for (let i = 0; i < daysInMonth(t); i++) out.add(addDays(t, i)); }
      else for (const x of ds) out.add(addMonths(x, months));
    }
    return { cols: [c], rows: [...out].filter((x) => all.has(x)).sort().map((x) => [x]) };
  }
  summarizeColumns(A: Node[], ctx: Ctx): Tbl {
    const group: Col[] = [], named: [string, Node][] = [];
    let c = ctx;
    for (let i = 0; i < A.length; i++) {
      const a = A[i];
      if (a.k === 'col') group.push(this.canon(a));
      else if (a.k === 'str') { if (!A[i + 1]) err(`SUMMARIZECOLUMNS: "${a.v}" has no expression after it.`); named.push([a.v, A[++i]]); }
      else { const t = this.table(a, c); let fs = c.filters; for (const f of this.filtersFromTable(t)) fs = this.overwrite(fs, f); c = { ...c, filters: fs }; }
    }
    const byT = new Map<string, Col[]>(); for (const g of group) byT.set(g.table!, [...(byT.get(g.table!) ?? []), g]);
    let combos: Val[][] = [[]], cols: Col[] = [];
    for (const [, gs] of byT) { const t = this.distinct(gs, c); combos = combos.flatMap((r) => t.rows.map((s) => [...r, ...s])); cols = [...cols, ...gs]; }
    const rows: Val[][] = [];
    for (const combo of combos) {
      let fs = c.filters;
      for (const f of this.filtersFromTable({ cols, rows: [combo] })) fs = this.overwrite(fs, f);
      const vals = named.map(([, e]) => this.noTrace(() => this.scalar(e, { ...c, filters: fs, frames: [] })));
      if (named.length && vals.every((v) => v === null)) continue;
      rows.push([...combo, ...vals]);
    }
    if (!group.length && !named.length) err('SUMMARIZECOLUMNS needs columns to group by or "Name", expression pairs.');
    return { cols: [...cols, ...named.map(([nm]) => ({ table: null, name: nm }))], rows };
  }
  summarize(A: Node[], ctx: Ctx): Tbl {
    if (!A.length) err('SUMMARIZE needs a table first.');
    const t = this.table(A[0], ctx); const group: Col[] = [], named: [string, Node][] = [];
    for (let i = 1; i < A.length; i++) { const a = A[i]; if (a.k === 'col') group.push(this.canon(a)); else if (a.k === 'str') named.push([a.v, A[++i]]); else err('SUMMARIZE takes columns to group by, then "Name", expression pairs.'); }
    const seen = new Map<unknown, Val[]>();
    for (const r of t.rows) { const v = group.map((g) => this.lookup(g, t.cols, r)); const k = key(v); if (!seen.has(k)) seen.set(k, v); }
    const rows = [...seen.values()].map((combo) => {
      let fs = ctx.filters; for (const f of this.filtersFromTable({ cols: group, rows: [combo] })) fs = this.overwrite(fs, f);
      return [...combo, ...named.map(([, e]) => this.noTrace(() => this.scalar(e, { ...ctx, filters: fs, frames: [] })))];
    });
    return { cols: [...group, ...named.map(([nm]) => ({ table: null, name: nm }))], rows };
  }
  /** A column's value for a row of a table, following relationships to dimension tables (like RELATED). */
  lookup(c: Col, cols: Col[], row: Val[]): Val {
    const j = cols.findIndex((x) => x.table === c.table && lc(x.name) === lc(c.name)); if (j >= 0) return row[j];
    const ri = cols.findIndex((x) => x.name === ROW);
    if (ri >= 0) { const from = cols[ri].table!; const v = this.relatedFrom(from, this.base(from).rows[row[ri] as number], c); if (v !== undefined) return v; }
    return err(`Column '${c.table}'[${c.name}] isn't in this table and can't be reached through a relationship.`);
  }
  relatedFrom(table: string, row: Val[], c: Col, seen = new Set<string>()): Val | undefined {
    if (seen.has(table)) return undefined; seen.add(table);
    for (const r of this.relsFrom(table)) {
      const fk = row[this.colIdx(table, r.fk)], n = this.pk(r.one, r.pk).get(fk);
      if (n === undefined) { if (lc(r.one) === lc(c.table!)) return null; continue; }
      const orow = this.base(r.one).rows[n];
      if (lc(r.one) === lc(c.table!)) return orow[this.colIdx(r.one, c.name)];
      const deeper = this.relatedFrom(this.base(r.one).name, orow, c, seen); if (deeper !== undefined) return deeper;
    }
    return undefined;
  }

  call(n: Extract<Node, { k: 'call' }>, ctx: Ctx): Val {
    const A = n.args, f = n.fn, S = (i: number) => this.scalar(A[i], ctx);
    const need = (k: number) => { if (A.length < k) err(`${f} needs ${k} argument${k > 1 ? 's' : ''}.`); };
    switch (f) {
      case 'TRUE': return true; case 'FALSE': return false; case 'BLANK': return null;
      case 'SUM': case 'AVERAGE': case 'MIN': case 'MAX': case 'COUNT': case 'COUNTA': case 'COUNTBLANK': case 'DISTINCTCOUNT': case 'DISTINCTCOUNTNOBLANK': {
        need(1);
        if ((f === 'MIN' || f === 'MAX') && A.length === 2) { const a = S(0), b = S(1); if (a === null) return b; if (b === null) return a; return (f === 'MIN' ? cmp(a, b) <= 0 : cmp(a, b) >= 0) ? a : b; }
        if (A[0].k !== 'col') err(`${f} takes a column, like ${f}(Sales[Amount]). To add up a calculation row by row, use ${f === 'SUM' ? 'SUMX' : f === 'AVERAGE' ? 'AVERAGEX' : f + 'X'}.`);
        const c = this.canon(A[0] as Col), vals = this.colValues(c, ctx);
        const r = aggregate(f, vals);
        if (this.tracing) this.traceAgg(f, c, ctx, r);
        return r;
      }
      case 'COUNTROWS': {
        const t = A.length ? this.table(A[0], ctx) : err('COUNTROWS needs a table, like COUNTROWS(Sales).');
        const r = t.rows.length || null;
        if (this.tracing && A[0].k === 'id') this.traceAgg('COUNTROWS', { table: (A[0] as any).name, name: '' }, ctx, r);
        return r;
      }
      case 'SUMX': case 'AVERAGEX': case 'MINX': case 'MAXX': case 'COUNTX': case 'COUNTAX': case 'CONCATENATEX': case 'PRODUCTX': {
        need(2); const t = this.table(A[0], ctx);
        this.traceOff++;
        let vals: Val[];
        try { vals = t.rows.map((r) => this.inRow(A[1], ctx, t.cols, r)); } finally { this.traceOff--; }
        let r: Val;
        if (f === 'CONCATENATEX') { const d = A[2] ? str(S(2)) : ''; r = vals.map(str).join(d); }
        else r = aggregate(f.slice(0, -1) === 'COUNTA' ? 'COUNTA' : f.slice(0, -1), vals);
        if (this.tracing) this.traceIter(f, t, A[1], vals, r, ctx);
        return r;
      }
      case 'RANKX': {
        need(2); const t = this.table(A[0], ctx);
        const vals = this.noTrace(() => t.rows.map((r) => this.inRow(A[1], ctx, t.cols, r)));
        const me = A[2] ? S(2) : this.noTrace(() => this.scalar(A[1], ctx));
        const asc = A[3] ? orderArg(A[3], this, ctx) : false;
        const dense = A[4] && A[4].k === 'id' && A[4].name.toUpperCase() === 'DENSE';
        const better = (v: Val) => (asc ? cmp(v, me) < 0 : cmp(v, me) > 0);
        if (dense) return new Set(vals.filter(better).map((v) => key([v]))).size + 1;
        return vals.filter(better).length + 1;
      }
      case 'CALCULATE': need(1); return this.calculate(A[0], A.slice(1), ctx);
      case 'TOTALYTD': case 'TOTALQTD': case 'TOTALMTD': {
        need(2); const t = this.table({ k: 'call', fn: 'DATES' + f.slice(5), args: [A[1]] }, ctx);
        return this.calculate(A[0], A.slice(2), ctx, [t]);
      }
      case 'DIVIDE': { need(2); const a = S(0), b = S(1); if (b === null || num(b) === 0) return A[2] ? S(2) : null; if (a === null) return null; return num(a) / num(b); }
      case 'IF': { need(2); return truthy(S(0)) ? S(1) : A[2] ? S(2) : null; }
      case 'IF.EAGER': { need(2); const a = S(1), b = A[2] ? S(2) : null; return truthy(S(0)) ? a : b; }
      case 'SWITCH': {
        need(3); const v = S(0);
        for (let i = 1; i + 1 < A.length; i += 2) if (eq(v, S(i))) return S(i + 1);
        return A.length % 2 === 0 ? S(A.length - 1) : null;
      }
      case 'AND': need(2); return truthy(S(0)) && truthy(S(1));
      case 'OR': need(2); return truthy(S(0)) || truthy(S(1));
      case 'NOT': need(1); return !truthy(S(0));
      case 'ISBLANK': need(1); return S(0) === null;
      case 'COALESCE': { for (let i = 0; i < A.length; i++) { const v = S(i); if (v !== null) return v; } return null; }
      case 'IFERROR': { need(2); try { const v = S(0); return typeof v === 'number' && !Number.isFinite(v) ? S(1) : v; } catch (e) { if (e instanceof DaxError) return S(1); throw e; } }
      case 'RELATED': {
        need(1); if (A[0].k !== 'col') err('RELATED takes a column from the "one" side, like RELATED(Product[Category]).');
        const c = this.canon(A[0] as Col);
        for (let i = ctx.frames.length - 1; i >= 0; i--) {
          const fr = ctx.frames[i], ri = fr.cols.findIndex((x) => x.name === ROW);
          if (ri < 0) continue;
          const from = fr.cols[ri].table!, v = this.relatedFrom(from, this.base(from).rows[fr.row[ri] as number], c);
          if (v !== undefined) return v;
        }
        return err(`RELATED(${c.table}[${c.name}]) needs a row of a table that has a relationship to ${c.table}, such as inside SUMX(Sales, ...) or in a calculated column of Sales.`);
      }
      case 'LOOKUPVALUE': {
        need(3); if (A[0].k !== 'col') err('LOOKUPVALUE starts with the column to return.');
        const res = this.canon(A[0] as Col), b = this.base(res.table!);
        const conds: [number, Val][] = []; for (let i = 1; i + 1 < A.length; i += 2) conds.push([this.colIdx(b.name, (A[i] as any).name), S(i + 1)]);
        const hits = new Set(b.rows.filter((r) => conds.every(([ci, v]) => eq(r[ci], v))).map((r) => r[this.colIdx(b.name, res.name)]));
        if (hits.size > 1) err('LOOKUPVALUE found more than one different value.'); return hits.size ? [...hits][0] : A.length % 2 === 0 ? S(A.length - 1) : null;
      }
      case 'SELECTEDVALUE': { need(1); const t = this.table({ k: 'call', fn: 'VALUES', args: [A[0]] }, ctx); return t.rows.length === 1 ? t.rows[0][0] : A[1] ? S(1) : null; }
      case 'HASONEVALUE': { need(1); return this.table({ k: 'call', fn: 'VALUES', args: [A[0]] }, ctx).rows.length === 1; }
      case 'ISFILTERED': case 'ISCROSSFILTERED': {
        need(1); const a = A[0];
        if (a.k === 'col') { const c = this.canon(a); return ctx.filters.some((x) => x.table === c.table && x.cols.some((y) => lc(y) === lc(c.name) || y === ROW)) || (f === 'ISCROSSFILTERED' && this.isFiltered(c.table!, ctx.filters)); }
        if (a.k === 'id') return f === 'ISCROSSFILTERED' ? this.isFiltered(a.name, ctx.filters) : ctx.filters.some((x) => lc(x.table) === lc(a.name));
        return err(`${f} takes a column or a table.`);
      }
      case 'ISINSCOPE': { need(1); const c = this.canon(A[0] as Col); return ctx.filters.some((x) => x.visual && x.table === c.table && x.cols.some((y) => lc(y) === lc(c.name))); }
      case 'ROUND': case 'ROUNDUP': case 'ROUNDDOWN': { need(1); const v = S(0); if (v === null) return null; const d = A[1] ? num(S(1)) : 0, p = 10 ** d, x = num(v) * p; return (f === 'ROUND' ? Math.sign(x) * Math.round(Math.abs(x) + 1e-9) : f === 'ROUNDUP' ? Math.sign(x) * Math.ceil(Math.abs(x) - 1e-9) : Math.trunc(x)) / p; }
      case 'INT': need(1); return S(0) === null ? null : Math.floor(num(S(0)));
      case 'ABS': need(1); return S(0) === null ? null : Math.abs(num(S(0)));
      case 'SQRT': need(1); return Math.sqrt(num(S(0)));
      case 'POWER': need(2); return num(S(0)) ** num(S(1));
      case 'MOD': need(2); { const a = num(S(0)), b = num(S(1)); return a - b * Math.floor(a / b); }
      case 'DATE': { need(3); const y = num(S(0)), m = num(S(1)), d = num(S(2)); return new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10); }
      case 'YEAR': case 'MONTH': case 'DAY': case 'QUARTER': case 'WEEKDAY': {
        need(1); const v = S(0); if (v === null) return null; const s = str(v); if (!/^\d{4}-\d\d-\d\d/.test(s)) err(`${f} needs a date.`);
        if (f === 'YEAR') return +s.slice(0, 4); if (f === 'MONTH') return +s.slice(5, 7); if (f === 'DAY') return +s.slice(8, 10); if (f === 'QUARTER') return Math.floor((+s.slice(5, 7) - 1) / 3) + 1;
        return new Date(s + 'T00:00:00Z').getUTCDay() + 1;
      }
      case 'EOMONTH': case 'EDATE': { need(2); const s = str(S(0)), k = num(S(1)); return f === 'EDATE' ? addMonths(s, k) : addDays(addMonths(s.slice(0, 8) + '01', k + 1), -1); }
      case 'DATEDIFF': { need(3); const a = str(S(0)), b = str(S(1)), u = (A[2] as any).name?.toUpperCase?.(); const days = (Date.parse(b) - Date.parse(a)) / 86400000; if (u === 'DAY') return days; if (u === 'MONTH') return (+b.slice(0, 4) - +a.slice(0, 4)) * 12 + (+b.slice(5, 7) - +a.slice(5, 7)); if (u === 'YEAR') return +b.slice(0, 4) - +a.slice(0, 4); return err('DATEDIFF needs DAY, MONTH or YEAR.'); }
      case 'TODAY': return '2025-12-31';
      case 'FORMAT': { need(2); return format(S(0), str(S(1))); }
      case 'LEN': need(1); return str(S(0)).length;
      case 'UPPER': need(1); return str(S(0)).toUpperCase();
      case 'LOWER': need(1); return str(S(0)).toLowerCase();
      case 'LEFT': need(1); return str(S(0)).slice(0, A[1] ? num(S(1)) : 1);
      case 'RIGHT': { need(1); const s = str(S(0)), k = A[1] ? num(S(1)) : 1; return s.slice(Math.max(0, s.length - k)); }
      case 'CONCATENATE': need(2); return str(S(0)) + str(S(1));
      case 'VALUE': need(1); return num(S(0));
      case 'CONTAINSSTRING': need(2); return str(S(0)).toLowerCase().includes(str(S(1)).toLowerCase());
      default: {
        // A table function used where a value is needed: allowed when it gives one value (like DAX).
        if (FN_TABLE.has(f)) return this.one(this.table(n, ctx), f);
        return err(`I don't know the function ${f}. (This practice engine covers the functions used in the course; see the cheat sheet.)`);
      }
    }
  }

  // ----- trace for the "show me what happened" player (format: src/lib/tableviz/types.ts) -----
  get tracing() { return this.trace !== null && this.traceOff === 0 && this.trace.length < 14; }
  noTrace<T>(f: () => T): T { this.traceOff++; try { return f(); } finally { this.traceOff--; } }
  /** Show a dimension table, the filters on it, and how they reach the fact table. */
  traceContext(note: string, filters: Filter[]) {
    const fact = this.factFor(filters);
    const dims = [...new Set(filters.map((f) => f.table))].filter((t) => t !== fact);
    const first = this.trace!.length;
    for (const d of dims.slice(0, 2)) {
      const b = this.base(d), vis = new Set(this.visible(d, filters));
      const sample = sampleRows(b.rows.map((_, i) => i), vis, 10);
      const vt = this.vtable(d, sample);
      const keep = sample.map((i) => vis.has(i));
      const r = this.relsFrom(fact).find((x) => x.one === d);
      if (r) {
        const fv = new Set(this.visible(fact, filters)), fb = this.base(fact);
        const fs = sampleRows(fb.rows.map((_, i) => i), fv, 10);
        this.trace!.push({ kind: 'propagate', note: `${d === dims[0] && first === this.trace!.length ? note + ' ' : ''}The filter on ${d} (${vis.size} of ${b.rows.length} rows) flows along the relationship to ${fact}: ${fv.size.toLocaleString('en')} of ${fb.rows.length.toLocaleString('en')} rows are left.`, from: vt, to: this.vtable(fact, fs), on: [r.pk, r.fk], fromKeep: keep, toKeep: fs.map((i) => fv.has(i)) } as Step);
      } else this.trace!.push({ kind: 'filter', note: `${note} ${d}: ${vis.size} of ${b.rows.length} rows are kept.`, input: vt, keep } as Step);
    }
    if (this.trace!.length === first) {
      const fb = this.base(fact), fv = new Set(this.visible(fact, filters)), fs = sampleRows(fb.rows.map((_, i) => i), fv, 10);
      this.trace!.push({ kind: 'filter', note: `${note} ${fact}: ${fv.size.toLocaleString('en')} of ${fb.rows.length.toLocaleString('en')} rows are left.`, input: this.vtable(fact, fs), keep: fs.map((i) => fv.has(i)) } as Step);
    }
  }
  factFor(filters: Filter[]) {
    const counts = new Map<string, number>(); for (const r of this.rels) counts.set(r.many, (counts.get(r.many) ?? 0) + 1);
    const facts = [...counts].sort((a, b) => b[1] - a[1]).map(([t]) => t);
    return facts.find((t) => filters.some((f) => f.table === t)) ?? facts[0] ?? [...this.tables.values()][0].name;
  }
  ensureContext(ctx: Ctx) { if (this.trace!.length === 0 && ctx.filters.length) this.traceContext('First, the filter context: the row of the visual filters the model.', ctx.filters); }
  traceAgg(fn: string, c: Col, ctx: Ctx, r: Val) {
    const b = this.base(c.table!), vis = this.visible(b.name, ctx.filters);
    this.ensureContext(ctx);
    const rows = vis.slice(0, 8), vt = this.vtable(b.name, rows);
    const col = c.name ? b.cols[this.colIdx(b.name, c.name)] : '';
    const out: VTable = { name: 'Result', cols: [col ? `${fn}(${col})` : `${fn}(${b.name})`], rows: [[cellOf(r)]] };
    this.trace!.push({ kind: 'aggregate', note: `${fn} ${fn === 'COUNTROWS' ? 'counts' : 'combines'} the ${vis.length.toLocaleString('en')} rows of ${b.name} that are still visible${vis.length > 8 ? ' (first 8 shown)' : ''}: ${fmtVal(r)}.`, input: vt, groupOf: rows.map(() => 0), output: out, measures: [{ col: out.cols[0], fn, arg: col || undefined }] } as Step);
  }
  traceIter(fn: string, t: Tbl, e: Node, vals: Val[], r: Val, ctx: Ctx) {
    this.ensureContext(ctx);
    const show = Math.min(8, t.rows.length);
    const vt = this.vtableOf(t, show);
    this.trace!.push({ kind: 'iterate', note: `${fn} goes through ${t.rows.length.toLocaleString('en')} row${t.rows.length === 1 ? '' : 's'} one at a time, works out ${short(e)} for each (row context), then ${fn === 'SUMX' ? 'adds them up' : 'combines them'}: ${fmtVal(r)}.`, input: vt, expr: short(e), values: vals.slice(0, show).map(cellOf), result: cellOf(r), fn } as Step);
  }
  traceFilter(t: Tbl, keep: boolean[], note: string) {
    const idx = t.rows.map((_, i) => i), kept = new Set(idx.filter((i) => keep[i]));
    const s = sampleRows(idx, kept, 12);
    const vt = this.vtableOf({ cols: t.cols, rows: s.map((i) => t.rows[i]) }, s.length);
    this.trace!.push({ kind: 'filter', note, input: vt, keep: s.map((i) => keep[i]) } as Step);
  }
  vtable(table: string, rows: number[]): VTable {
    const b = this.base(table), show = b.cols.map((c, i) => [c, i] as const).filter(([c]) => c !== ROW).slice(0, 7);
    return { name: b.name, cols: show.map(([c]) => c), rows: rows.map((n) => show.map(([, i]) => cellOf(b.rows[n][i]))) };
  }
  vtableOf(t: Tbl, n: number): VTable {
    const show = t.cols.map((c, i) => [c, i] as const).filter(([c]) => c.name !== ROW).slice(0, 7);
    const name = t.cols.find((c) => c.table)?.table ?? 'Table';
    return { name, cols: show.map(([c]) => c.name), rows: t.rows.slice(0, n).map((r) => show.map(([, i]) => cellOf(r[i]))) };
  }
}

// ---------- helpers ----------
const FN_TABLE = new Set(['CALENDAR', 'CALENDARAUTO', 'FILTER', 'ALL', 'ALLSELECTED', 'ALLEXCEPT', 'ALLNOBLANKROW', 'REMOVEFILTERS', 'VALUES', 'DISTINCT', 'CALCULATETABLE', 'RELATEDTABLE', 'SUMMARIZE', 'SUMMARIZECOLUMNS', 'ADDCOLUMNS', 'SELECTCOLUMNS', 'TOPN', 'CROSSJOIN', 'UNION', 'TREATAS', 'ROW', 'GENERATESERIES', 'DATESYTD', 'DATESQTD', 'DATESMTD', 'SAMEPERIODLASTYEAR', 'DATEADD', 'PARALLELPERIOD', 'PREVIOUSMONTH', 'PREVIOUSYEAR', 'PREVIOUSQUARTER', 'NEXTMONTH', 'NEXTYEAR', 'DATESINPERIOD', 'DATESBETWEEN', 'FIRSTDATE', 'LASTDATE', 'STARTOFMONTH', 'ENDOFMONTH', 'STARTOFYEAR', 'ENDOFYEAR', 'KEEPFILTERS']);
const FN_SCALAR = new Set(['SUM', 'AVERAGE', 'MIN', 'MAX', 'COUNT', 'COUNTA', 'COUNTROWS', 'DISTINCTCOUNT', 'SUMX', 'AVERAGEX', 'MINX', 'MAXX', 'COUNTX', 'CONCATENATEX', 'RANKX', 'CALCULATE', 'TOTALYTD', 'TOTALQTD', 'TOTALMTD', 'DIVIDE', 'IF', 'SWITCH', 'AND', 'OR', 'NOT', 'ISBLANK', 'COALESCE', 'RELATED', 'LOOKUPVALUE', 'SELECTEDVALUE', 'HASONEVALUE', 'ISFILTERED', 'ROUND', 'INT', 'ABS', 'DATE', 'YEAR', 'MONTH', 'DAY', 'FORMAT', 'BLANK', 'TRUE', 'FALSE']);
/** Every function name the engine knows (for the cheat sheet and the editor's hints). */
export const FUNCTIONS = [...new Set([...FN_TABLE, ...FN_SCALAR, 'IFERROR', 'ISINSCOPE', 'ISCROSSFILTERED', 'ROUNDUP', 'ROUNDDOWN', 'SQRT', 'POWER', 'MOD', 'QUARTER', 'WEEKDAY', 'EOMONTH', 'EDATE', 'DATEDIFF', 'TODAY', 'LEN', 'UPPER', 'LOWER', 'LEFT', 'RIGHT', 'CONCATENATE', 'VALUE', 'CONTAINSSTRING', 'COUNTBLANK', 'PRODUCTX', 'COUNTAX', 'USERELATIONSHIP', 'CROSSFILTER', 'ALLNOBLANKROW', 'IF.EAGER'])].sort();

function isTbl(v: unknown): v is Tbl { return !!v && typeof v === 'object' && 'rows' in (v as any); }
function isTableExpr(n: Node, m: Model, vars: Map<string, Val | Tbl>): boolean {
  if (n.k === 'tab') return true;
  if (n.k === 'id') { const v = vars.get(lc(n.name)); return v !== undefined ? isTbl(v) : m.tables.has(lc(n.name)); }
  if (n.k === 'var') return isTableExpr(n.ret, m, vars);
  return n.k === 'call' && FN_TABLE.has(n.fn);
}
function colsIn(n: Node): Col[] {
  if (n.k === 'col') return [{ table: n.table, name: n.name }];
  if (n.k === 'bin') return [...colsIn(n.l), ...colsIn(n.r)];
  if (n.k === 'un') return colsIn(n.e);
  if (n.k === 'call') return n.args.flatMap(colsIn);
  return [];
}
function orderArg(n: Node, m: Model, ctx: Ctx) {
  if (n.k === 'id') { const u = n.name.toUpperCase(); if (u === 'ASC') return true; if (u === 'DESC') return false; }
  return truthy(m.scalar(n, ctx));
}
export function truthy(v: Val) { return v === true || (typeof v === 'number' && v !== 0 && !Number.isNaN(v)) || (typeof v === 'string' && v !== ''); }
function num(v: Val): number {
  if (v === null) return 0; if (typeof v === 'boolean') return v ? 1 : 0; if (typeof v === 'number') return v;
  const x = Number(v); if (Number.isNaN(x)) err(`Cannot turn the text "${v}" into a number.`); return x;
}
function str(v: Val) { return v === null ? '' : typeof v === 'number' ? fmtNum(v) : String(v); }
function eq(a: Val, b: Val) { if (a === null) return b === null || b === 0 || b === '' || b === false; if (b === null) return a === 0 || a === '' || a === false; if (typeof a === 'string' && typeof b === 'string') return a.toLowerCase() === b.toLowerCase(); return a === b || (typeof a !== 'string' && typeof b !== 'string' && num(a) === num(b)); }
function cmp(a: Val, b: Val) {
  if (typeof a === 'string' || typeof b === 'string') { const x = a === null ? '' : String(a), y = b === null ? '' : String(b); return x < y ? -1 : x > y ? 1 : 0; }
  return num(a) - num(b);
}
function aggregate(f: string, vals: Val[]): Val {
  const nums = vals.filter((v) => typeof v === 'number' || typeof v === 'boolean').map(num);
  switch (f) {
    case 'SUM': return nums.length ? nums.reduce((a, b) => a + b, 0) : null;
    case 'PRODUCT': return nums.length ? nums.reduce((a, b) => a * b, 1) : null;
    case 'AVERAGE': return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
    case 'MIN': case 'MAX': {
      const nn = vals.filter((v) => v !== null); if (!nn.length) return null;
      return nn.reduce((a, b) => ((f === 'MIN' ? cmp(b, a) < 0 : cmp(b, a) > 0) ? b : a));
    }
    case 'COUNT': return vals.filter((v) => typeof v === 'number' || (typeof v === 'string' && /^\d{4}-\d\d-\d\d$/.test(v))).length || null;
    case 'COUNTA': return vals.filter((v) => v !== null).length || null;
    case 'COUNTBLANK': return vals.filter((v) => v === null || v === '').length || null;
    case 'DISTINCTCOUNT': return new Set(vals).size || null;
    case 'DISTINCTCOUNTNOBLANK': return new Set(vals.filter((v) => v !== null)).size || null;
  }
  return err(`Unknown aggregation ${f}.`);
}
function dedupe(t: Tbl): Tbl { const s = new Map<unknown, Val[]>(); for (const r of t.rows) s.set(key(r), r); return { cols: t.cols, rows: [...s.values()] }; }
function sampleRows(all: number[], kept: Set<number>, n: number) {
  // A small, readable sample: mostly kept rows with a few dropped ones, in table order.
  const k = all.filter((i) => kept.has(i)), d = all.filter((i) => !kept.has(i));
  const nk = Math.min(k.length, d.length ? Math.ceil(n * 0.6) : n), nd = Math.min(d.length, n - nk);
  const pick = (a: number[], m: number) => (m >= a.length ? a : Array.from({ length: m }, (_, i) => a[Math.floor((i * a.length) / m)]));
  return [...pick(k, nk), ...pick(d, nd)].sort((a, b) => a - b);
}
function cellOf(v: Val): Cell { return v === null ? null : typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : typeof v === 'number' ? +v.toFixed(4) : v; }
export function fmtNum(x: number) {
  if (!Number.isFinite(x)) return Number.isNaN(x) ? 'NaN' : x > 0 ? 'Infinity' : '-Infinity';
  const r = Math.round(x * 100) / 100;
  return Math.abs(r) >= 1000 ? r.toLocaleString('en', { maximumFractionDigits: 2 }) : String(r);
}
export function fmtVal(v: Val) { return v === null ? '(blank)' : typeof v === 'number' ? fmtNum(v) : typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : v; }
const PREC: Record<string, number> = { '||': 1, '&&': 2, '=': 3, '<>': 3, '<': 3, '>': 3, '<=': 3, '>=': 3, IN: 3, '&': 4, '+': 5, '-': 5, '*': 6, '/': 6, '^': 7 };
function short(n: Node): string {
  switch (n.k) {
    case 'num': return String(n.v); case 'str': return `"${n.v}"`; case 'col': return `${/\s/.test(n.table) ? `'${n.table}'` : n.table}[${n.name}]`; case 'mref': return `[${n.name}]`; case 'id': return n.name;
    case 'bin': { const p = PREC[n.op], w = (c: Node, right: boolean) => (c.k === 'bin' && (PREC[c.op] < p || (right && PREC[c.op] === p)) ? `(${short(c)})` : short(c)); return `${w(n.l, false)} ${n.op} ${w(n.r, true)}`; } case 'un': return n.op === '-' ? `-${short(n.e)}` : `NOT ${short(n.e)}`;
    case 'call': { const s = `${n.fn}(${n.args.map(short).join(', ')})`; return s.length > 70 ? `${n.fn}(...)` : s; }
    case 'tab': return '{...}'; case 'var': return 'VAR ... RETURN ' + short(n.ret);
  }
}
function format(v: Val, f: string): string {
  if (v === null) return '';
  if (typeof v === 'string' && /^\d{4}-\d\d-\d\d/.test(v)) {
    const M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const y = v.slice(0, 4), m = +v.slice(5, 7), d = +v.slice(8, 10);
    return f.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d/g, (t) => ({ yyyy: y, yy: y.slice(2), MMMM: M[m - 1], MMM: M[m - 1].slice(0, 3), MM: String(m).padStart(2, '0'), M: String(m), dd: String(d).padStart(2, '0'), d: String(d) } as any)[t]);
  }
  const x = num(v);
  if (/%/.test(f)) { const dec = (f.split('.')[1] ?? '').replace(/[^0]/g, '').length; return (x * 100).toFixed(dec) + '%'; }
  const dec = (f.split('.')[1] ?? '').replace(/[^0#]/g, '').length;
  const cur = f.trim().startsWith('$') ? '$' : '';
  const s = /,/.test(f) ? x.toLocaleString('en', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : x.toFixed(dec);
  return cur + s;
}
function addDays(d: string, n: number) { return new Date(Date.parse(d + 'T00:00:00Z') + n * 86400000).toISOString().slice(0, 10); }
function daysInMonth(d: string) { return new Date(Date.UTC(+d.slice(0, 4), +d.slice(5, 7), 0)).getUTCDate(); }
function addMonths(d: string, n: number) {
  const y = +d.slice(0, 4), m = +d.slice(5, 7) - 1 + n, day = +d.slice(8, 10);
  const yy = y + Math.floor(m / 12), mm = ((m % 12) + 12) % 12;
  const last = new Date(Date.UTC(yy, mm + 1, 0)).getUTCDate();
  return new Date(Date.UTC(yy, mm, Math.min(day, last))).toISOString().slice(0, 10);
}
function periodStart(d: string, months: number) { const m = +d.slice(5, 7) - 1; return `${d.slice(0, 4)}-${String(Math.floor(m / months) * months + 1).padStart(2, '0')}-01`; }
function monthsSpan(d: string[], months: number) { const a = d[0], b = d[d.length - 1]; const span = (+b.slice(0, 4) - +a.slice(0, 4)) * 12 + (+b.slice(5, 7) - +a.slice(5, 7)) + 1; return Math.ceil(span / months); }

// ---------- running a whole editor ----------
export type VisualRow = { label: Val[]; values: Val[] };
export type RunResult = {
  measures: string[]; columns: string[];
  visual?: { by: Col[]; rows: VisualRow[]; total: Val[] };
  query?: { cols: string[]; rows: Val[][] };
  trace?: Trace;
  error?: string;
};
export type RunOpts = {
  /** Columns the table visual groups by (none: a card showing the totals). */
  by?: Col[];
  /** Slicer: extra filters, as { column: values }. */
  slicers?: { col: Col; values: Val[] }[];
  /** Record the steps for one cell: the index of the visual row (-1 = total). */
  traceRow?: number;
  /** Which measure to trace (default: the last one). */
  traceMeasure?: string;
};

export function run(spec: ModelSpec | Model, code: string, opts: RunOpts = {}): RunResult {
  const m = spec instanceof Model ? spec : new Model(spec);
  m.measures.clear();
  const res: RunResult = { measures: [], columns: [] };
  try {
    const stmts = parseProgram(code);
    for (const s of stmts) {
      if (s.k === 'measure') {
        if (m.tables.has(lc(s.name))) err(`"${s.name}" is already a table name. Pick another name for the measure.`);
        m.measures.set(lc(s.name), { name: s.name, e: s.e }); res.measures.push(s.name);
      } else if (s.k === 'column') {
        const b = m.base(s.table);
        if (b.idx.has(lc(s.name))) err(`${b.name} already has a column called [${s.name}].`);
        const cols = b.cols.map((c) => ({ table: b.name, name: c }));
        const vals = b.rows.map((r) => m.scalar(s.e, { filters: [], frames: [{ cols, row: r }], vars: new Map(), depth: 0 }));
        // Insert the new column before the hidden row number.
        b.rows.forEach((r, i) => r.splice(r.length - 1, 0, vals[i]));
        b.cols.splice(b.cols.length - 1, 0, s.name);
        b.idx = new Map(b.cols.map((c, i) => [lc(c), i]));
        res.columns.push(`${b.name}[${s.name}]`);
      }
    }
    let filters: Filter[] = [];
    for (const sl of opts.slicers ?? []) { const c = m.canon(sl.col); filters = m.overwrite(filters, m.makeFilter(c.table!, [c.name], sl.values.map((v) => [v]))); }
    const query = [...stmts].reverse().find((s) => s.k === 'query') as Extract<Stmt, { k: 'query' }> | undefined;
    if (query) {
      const ctx = m.newCtx(filters);
      if (opts.traceRow !== undefined) m.trace = [];
      let t = m.table(query.e, ctx);
      if (query.order.length) {
        const keys = t.rows.map((r) => query.order.map((o) => m.inRow(o.e, ctx, t.cols, r)));
        const ix = t.rows.map((_, i) => i).sort((a, b) => { for (let k = 0; k < query.order.length; k++) { const c = cmp(keys[a][k], keys[b][k]); if (c) return query.order[k].desc ? -c : c; } return a - b; });
        t = { cols: t.cols, rows: ix.map((i) => t.rows[i]) };
      }
      const vis = t.cols.map((c, i) => [c, i] as const).filter(([c]) => c.name !== ROW);
      res.query = { cols: vis.map(([c]) => ((c as any).alias ? (c as any).alias : c.table ? `${c.table}[${c.name}]` : `[${c.name}]`)), rows: t.rows.map((r) => vis.map(([, i]) => r[i])) };
      if (m.trace) { res.trace = { title: 'What the query did', steps: m.trace }; m.trace = null; }
      return res;
    }
    if (!res.measures.length) return res;
    const by = (opts.by ?? []).map((c) => m.canon(c));
    const combos: Val[][] = by.length ? m.summarizeColumns(by.map((c) => ({ k: 'col', table: c.table!, name: c.name }) as Node), m.newCtx(filters)).rows.sort((a, b) => { for (let i = 0; i < a.length; i++) { const c = cmp(a[i], b[i]); if (c) return c; } return 0; }) : [];
    const cell = (combo: Val[] | null, name: string, trace: boolean) => {
      let fs = filters;
      if (combo) for (const f of m.filtersFromTable({ cols: by, rows: [combo] })) fs = m.overwrite(fs, { ...f, visual: true });
      if (trace) m.trace = [];
      try { return m.mref(name, m.newCtx(fs)); } finally { if (trace) { res.trace = { title: `How ${name} was worked out${combo ? ` for ${combo.map(fmtVal).join(', ')}` : ' for the total'}`, steps: m.trace ?? [] }; m.trace = null; } }
    };
    const tm = opts.traceMeasure ?? res.measures[res.measures.length - 1];
    const rows = combos.map((combo, i) => ({ label: combo, values: res.measures.map((nm) => cell(combo, nm, opts.traceRow === i && nm === tm)) }));
    const total = res.measures.map((nm) => cell(null, nm, opts.traceRow === -1 && nm === tm));
    res.visual = { by, rows: rows.filter((r) => r.values.some((v) => v !== null)), total };
  } catch (e) {
    if (e instanceof DaxError) res.error = e.message;
    else if (e instanceof RangeError) res.error = 'The formula went too deep (does a measure refer to itself?).';
    else throw e;
  }
  return res;
}
