// Turns one SQL SELECT into a Trace (./types.ts) for the table-animation engine, in the order SQL really
// works: FROM, JOIN, WHERE, GROUP BY, aggregate, HAVING, window, SELECT, DISTINCT, ORDER BY, LIMIT.
// Every in-between table comes from running small SQL queries through `exec`, so the database does the
// work and the picture can't disagree with the answer. Big tables are drawn on a small sample.
// Engine-neutral apart from the SQL dialect (SQLite: ROW_NUMBER() OVER (), rowid).
import type { Cell, Step, Trace, VTable } from './types.ts';

export type ExecResult = { columns: string[]; values: Cell[][] };
export type Exec = (sql: string) => Promise<ExecResult>;
type Tok = { t: string; u: string; s: number; e: number; d: number };

/** Split SQL into tokens with their bracket depth. Strings, quoted names and comments stay whole. */
export function tokenize(sql: string): Tok[] {
  const out: Tok[] = []; let i = 0, d = 0;
  while (i < sql.length) {
    const c = sql[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '-' && sql[i + 1] === '-') { while (i < sql.length && sql[i] !== '\n') i++; continue; }
    if (c === '/' && sql[i + 1] === '*') { const j = sql.indexOf('*/', i + 2); i = j < 0 ? sql.length : j + 2; continue; }
    const s = i;
    if (c === "'" || c === '"' || c === '`' || c === '[') {
      const close = c === '[' ? ']' : c; i++;
      while (i < sql.length) { if (sql[i] === close) { if (sql[i + 1] === close && close !== ']') { i += 2; continue; } i++; break; } i++; }
    } else if (/[A-Za-z_]/.test(c)) { while (i < sql.length && /[\w$]/.test(sql[i])) i++; }
    else if (/[0-9.]/.test(c)) { while (i < sql.length && /[0-9.eE]/.test(sql[i])) i++; }
    else if (/[<>!=|]/.test(c) && /[=<>|]/.test(sql[i + 1] ?? '')) i += 2;
    else i++;
    const t = sql.slice(s, i);
    if (t === ')') d--;
    out.push({ t, u: t.toUpperCase(), s, e: i, d });
    if (t === '(') d++;
  }
  return out;
}

const AGG = /\b(count|sum|avg|min|max|total|group_concat|string_agg)\s*\(/i;
const isIdent = (x: string) => /^([A-Za-z_][\w$]*|"[^"]+"|`[^`]+`|\[[^\]]+\])(\.([A-Za-z_][\w$]*|"[^"]+"|`[^`]+`|\[[^\]]+\]|\*))?$/.test(x.trim());
const unq = (x: string) => x.trim().replace(/^["`[]|["`\]]$/g, '');
const bare = (x: string) => unq(x.trim().replace(/^.*\./, ''));
const key = (r: Cell[]) => JSON.stringify(r);

/** Top-level pieces of `sql` split at depth-0 commas. */
function splitCommas(sql: string) {
  const toks = tokenize(sql), parts: string[] = []; let at = 0;
  for (const k of toks) if (k.t === ',' && k.d === 0) { parts.push(sql.slice(at, k.s).trim()); at = k.e; }
  parts.push(sql.slice(at).trim()); return parts.filter(Boolean);
}
/** A select item split into its expression and output name. */
export function selectItem(item: string) {
  const toks = tokenize(item); const n = toks.length;
  if (n >= 3 && toks[n - 2].u === 'AS' && toks[n - 2].d === 0) return { expr: item.slice(0, toks[n - 2].s).trim(), alias: unq(toks[n - 1].t) };
  if (n >= 2 && toks[n - 1].d === 0 && /^[A-Za-z_]\w*$/.test(toks[n - 1].t) && !/^(END|NULL|TRUE|FALSE|ASC|DESC)$/.test(toks[n - 1].u) && /^([\w"`\]]+|\)|'.*'|\d+)$/.test(toks[n - 2].t) && toks[n - 2].t !== '.' && !/^(AND|OR|NOT|IS|IN|LIKE|THEN|ELSE|WHEN|CASE|DISTINCT|BETWEEN)$/.test(toks[n - 2].u))
    return { expr: item.slice(0, toks[n - 1].s).trim(), alias: unq(toks[n - 1].t) };
  return { expr: item.trim(), alias: isIdent(item) ? bare(item) : item.trim() };
}

export type Parsed = {
  with: string; distinct: boolean; select: string; from: string; where: string; group: string; having: string; order: string; limit: string; offset: string;
};
const CLAUSES = ['SELECT', 'FROM', 'WHERE', 'GROUP', 'HAVING', 'WINDOW', 'ORDER', 'LIMIT', 'OFFSET'];

/** Split one SELECT statement into its clauses (only the outer level). Returns null for anything else. */
export function parseSelect(sqlIn: string): Parsed | null {
  const sql = sqlIn.trim().replace(/;+\s*$/, '');
  let toks = tokenize(sql); if (!toks.length) return null;
  let withPart = '', bodyStart = 0;
  if (toks[0].u === 'WITH') {
    const sel = toks.findIndex((k, i) => i > 0 && k.d === 0 && k.u === 'SELECT' && toks[i - 1].t === ')');
    if (sel < 0) return null;
    withPart = sql.slice(0, toks[sel].s).trim(); bodyStart = toks[sel].s;
  }
  const body = sql.slice(bodyStart); toks = tokenize(body);
  if (toks[0]?.u !== 'SELECT') return null;
  if (toks.some((k) => k.d === 0 && /^(UNION|INTERSECT|EXCEPT)$/.test(k.u))) return null;
  const at: Record<string, [number, number]> = {};
  toks.forEach((k, i) => {
    if (k.d !== 0 || !CLAUSES.includes(k.u)) return;
    if ((k.u === 'GROUP' || k.u === 'ORDER') && toks[i + 1]?.u !== 'BY') return;
    if (at[k.u]) return;
    at[k.u] = [k.s, (k.u === 'GROUP' || k.u === 'ORDER') ? toks[i + 1].e : k.e];
  });
  const starts = Object.values(at).map((v) => v[0]).sort((a, b) => a - b);
  const part = (name: string) => { const p = at[name]; if (!p) return ''; const end = starts.find((s) => s > p[0]) ?? body.length; return body.slice(p[1], end).trim(); };
  let select = part('SELECT'); let distinct = false;
  const m = /^(DISTINCT|ALL)\b/i.exec(select); if (m) { distinct = m[1].toUpperCase() === 'DISTINCT'; select = select.slice(m[0].length).trim(); }
  let limit = part('LIMIT'), offset = part('OFFSET');
  const lc = splitCommas(limit); if (lc.length === 2) { offset = lc[0]; limit = lc[1]; }
  if (part('WINDOW')) return null;
  return { with: withPart, distinct, select, from: part('FROM'), where: part('WHERE'), group: part('GROUP'), having: part('HAVING'), order: part('ORDER'), limit, offset };
}

type Source = { expr: string; alias: string; join: string; how: 'inner' | 'left' | 'right' | 'full' | 'cross'; cond: string; using: string[] };

/** Split a FROM clause into its tables and joins. */
export function parseFrom(from: string): Source[] | null {
  const toks = tokenize(from); const srcs: Source[] = [];
  let i = 0;
  const readSource = (join: string, how: Source['how']) => {
    const s = i;
    while (i < toks.length && !(toks[i].d === 0 && (toks[i].t === ',' || /^(JOIN|INNER|LEFT|RIGHT|FULL|CROSS|NATURAL|ON|USING)$/.test(toks[i].u)))) i++;
    const text = from.slice(toks[s]?.s ?? 0, toks[i - 1]?.e ?? 0).trim();
    if (!text) throw new Error('empty source');
    const tt = tokenize(text); let expr = text, alias = '';
    const last = tt[tt.length - 1];
    if (tt.length > 1 && last.d === 0 && (tt[tt.length - 2].u === 'AS' || tt[tt.length - 2].t === ')' || isIdent(text.slice(0, tt[tt.length - 2].e)))) {
      alias = unq(last.t); expr = text.slice(0, tt[tt.length - (tt[tt.length - 2].u === 'AS' ? 2 : 1)].s).trim();
    }
    if (!alias) { if (!isIdent(expr)) alias = `t${srcs.length + 1}`; else alias = bare(expr); }
    let cond = '', using: string[] = [];
    if (toks[i]?.u === 'ON') {
      const c = ++i; while (i < toks.length && !(toks[i].d === 0 && (toks[i].t === ',' || /^(JOIN|INNER|LEFT|RIGHT|FULL|CROSS|NATURAL)$/.test(toks[i].u)))) i++;
      cond = from.slice(toks[c].s, toks[i - 1].e).trim();
    } else if (toks[i]?.u === 'USING') {
      const c = ++i; while (i < toks.length && !(toks[i].d === 0 && toks[i].t === ')')) i++; i++;
      using = from.slice(toks[c].e, toks[i - 1].s).split(',').map((x) => unq(x));
    }
    srcs.push({ expr, alias, join, how, cond, using });
  };
  readSource('', 'inner');
  while (i < toks.length) {
    if (toks[i].t === ',') { i++; readSource(',', 'cross'); continue; }
    const s = i; let how: Source['how'] = 'inner';
    while (i < toks.length && toks[i].u !== 'JOIN') { const u = toks[i].u; if (u === 'LEFT') how = 'left'; else if (u === 'RIGHT') how = 'right'; else if (u === 'FULL') how = 'full'; else if (u === 'CROSS') how = 'cross'; else if (u === 'NATURAL') return null; i++; }
    if (i >= toks.length) return null;
    const join = from.slice(toks[s].s, toks[i].e); i++;
    readSource(join, how);
  }
  return srcs;
}

const HOW_NOTE: Record<Source['how'], string> = {
  inner: 'keeps only rows that have a partner on both sides',
  left: 'keeps every row on the left; where there is no partner, the right side is NULL',
  right: 'keeps every row on the right; where there is no partner, the left side is NULL',
  full: 'keeps every row from both sides, with NULLs where there is no partner',
  cross: 'pairs every row on the left with every row on the right',
};

/** Equality pairs in an ON condition that link earlier tables to table `alias`. */
function onPairs(cond: string, alias: string): [string, string][] {
  const out: [string, string][] = [];
  for (const piece of cond.split(/\s+AND\s+/i)) {
    const m = /^\(?\s*([\w."`]+)\s*=\s*([\w."`]+)\s*\)?$/.exec(piece.trim()); if (!m) continue;
    const [a, b] = [m[1], m[2]]; const mine = (x: string) => x.includes('.') && unq(x.split('.')[0]).toLowerCase() === alias.toLowerCase();
    if (mine(b) && !mine(a)) out.push([a.replace(/"/g, ''), b.replace(/"/g, '')]); else if (mine(a)) out.push([b.replace(/"/g, ''), a.replace(/"/g, '')]); else out.push([a, b]);
  }
  return out;
}


/** The window call inside an expression: [function call, OVER (...) contents], even when wrapped (ROUND(AVG(x) OVER (...), 2)). */
function windowCall(expr: string): [string, string, string] | null {
  const toks = tokenize(expr); const o = toks.findIndex((k, i) => k.u === 'OVER' && toks[i + 1]?.t === '(');
  if (o < 1 || toks[o - 1].t !== ')') return null;
  let i = o - 1; const d = toks[i].d; while (i > 0 && !(toks[i].t === '(' && toks[i].d === d)) i--;
  if (i < 1) return null; const fnStart = toks[i - 1].s;
  const open = toks[o + 1]; let j = o + 2; while (j < toks.length && !(toks[j].t === ')' && toks[j].d === open.d)) j++;
  if (j >= toks.length) return null;
  return [expr, expr.slice(fnStart, toks[o - 1].e), expr.slice(open.e, toks[j].s)];
}

const stripR = (r: ExecResult) => {
  const keep = r.columns.map((c, j) => (/^__\w+$/.test(c) ? -1 : j)).filter((j) => j >= 0);
  return { columns: keep.map((j) => r.columns[j]), values: r.values.map((row) => keep.map((j) => row[j])) };
};

export type TraceOpts = { cap?: number };

/** Build a step-by-step trace of a SELECT. Falls back to the plain result when the query is too unusual to draw. */
export async function traceSql(sql: string, exec: Exec, opts: TraceOpts = {}): Promise<Trace> {
  const cap = opts.cap ?? 8;
  const fallback = async (why: string): Promise<Trace> => {
    try { const r = await exec(sql); return { warn: why, steps: [{ kind: 'result', label: 'Result', note: 'The answer.', table: { name: 'result', cols: r.columns, rows: r.values } }] }; }
    catch { return { warn: why, steps: [] }; }
  };
  const p = parseSelect(sql);
  if (!p) return compound(sql, exec, cap, fallback);
  if (!p.from) return fallback('There is no table here, so there is nothing to animate.');
  let srcs: Source[] | null = null;
  try { srcs = parseFrom(p.from); } catch { srcs = null; }
  if (!srcs || srcs.length > 4) return fallback('This FROM clause is too unusual to draw step by step, so here is the result.');
  try { return await build(p, srcs, exec, cap); }
  catch (e) { return fallback(`This query could not be drawn step by step (${String((e as Error).message ?? e).slice(0, 120)}), so here is the result.`); }
}

async function compound(sql: string, exec: Exec, cap: number, fallback: (w: string) => Promise<Trace>): Promise<Trace> {
  const body = sql.trim().replace(/;+\s*$/, ''); const toks = tokenize(body);
  if (toks[0]?.u !== 'SELECT') return fallback('Only SELECT queries can be drawn step by step.');
  const cuts: { s: number; e: number; op: string }[] = [];
  toks.forEach((k, i) => { if (k.d === 0 && /^(UNION|INTERSECT|EXCEPT)$/.test(k.u)) { const all = toks[i + 1]?.u === 'ALL'; cuts.push({ s: k.s, e: all ? toks[i + 1].e : k.e, op: all ? `${k.u} ALL` : k.u }); } });
  if (!cuts.length) return fallback('This query is too unusual to draw step by step, so here is the result.');
  const parts: string[] = []; let at = 0; for (const c of cuts) { parts.push(body.slice(at, c.s).trim()); at = c.e; } parts.push(body.slice(at).trim());
  const tail = /\s(ORDER\s+BY|LIMIT)\s[\s\S]*$/i.exec(parts[parts.length - 1]); if (tail && !tokenize(tail[0]).some((k) => k.d < 0)) parts[parts.length - 1] = parts[parts.length - 1].slice(0, tail.index);
  try {
    const ins = await Promise.all(parts.map(async (q, k) => { const r = await exec(`SELECT * FROM (${q}) LIMIT ${cap}`); return { name: `part ${k + 1}`, cols: r.columns, rows: r.values } as VTable; }));
    const sampled = ins.map((t, k) => `SELECT * FROM (${parts[k]}) LIMIT ${cap}`);
    let joined = `SELECT * FROM (${sampled[0]})`; cuts.forEach((c, k) => { joined += ` ${c.op} SELECT * FROM (${sampled[k + 1]})`; });
    const r = await exec(joined);
    const from: [number, number][] = r.values.map((row) => { const kk = key(row); for (let t = 0; t < ins.length; t++) { const j = ins[t].rows.findIndex((x) => key(x) === kk); if (j >= 0) return [t, j]; } return [0, 0]; });
    const out: VTable = { name: 'result', cols: r.columns, rows: r.values };
    const ops = [...new Set(cuts.map((c) => c.op))].join(', ');
    const what: Record<string, string> = { UNION: 'stacks the rows and keeps each distinct row once', 'UNION ALL': 'stacks all the rows, copies included', INTERSECT: 'keeps rows that appear in both', EXCEPT: 'keeps rows of the first that are not in the second' };
    return { title: 'How this query runs', warn: ins.some((t) => t.rows.length >= cap) ? `Drawn on the first ${cap} rows of each part so the picture fits.` : undefined, steps: [
      ...ins.map((t, k): Step => ({ kind: 'source', label: `Part ${k + 1}`, note: `Part ${k + 1} is its own SELECT.`, table: t })),
      { kind: 'union', label: ops, note: `${ops} ${what[cuts[0].op] ?? 'combines the parts'}.`, inputs: ins, output: out, from, op: cuts[0].op },
    ] };
  } catch { return fallback('This query could not be drawn step by step, so here is the result.'); }
}

async function build(p: Parsed, srcs: Source[], exec: Exec, cap: number): Promise<Trace> {
  const W = p.with ? p.with + ' ' : '';
  const steps: Step[] = []; let sampledAny = false;
  // 1. Sample each source; a joined table keeps rows that match the sample so far, plus two that don't.
  const S: VTable[] = []; const frag: string[] = [];
  const rcols = srcs.map((_, i) => `__r${i}`);
  for (let i = 0; i < srcs.length; i++) {
    const s = srcs[i];
    const count = (await exec(`${W}SELECT COUNT(*) FROM ${s.expr}`)).values[0][0] as number;
    let inner = `SELECT * FROM ${s.expr} LIMIT ${cap}`;
    if (count > cap) {
      sampledAny = true;
      if (i > 0 && (s.cond || s.using.length) && isIdent(s.expr)) {
        const on = s.cond ? `ON ${s.cond}` : `USING (${s.using.join(', ')})`;
        const prev = `${frag.join(' ')} ${s.join} ${s.expr} AS ${s.alias} ${on}`;
        const smart = `SELECT * FROM ${s.expr} WHERE rowid IN (SELECT ${s.alias}.rowid FROM ${prev} LIMIT ${cap}) UNION ALL SELECT * FROM (SELECT * FROM ${s.expr} WHERE rowid NOT IN (SELECT ${s.alias}.rowid FROM ${prev}) LIMIT 2)`;
        try { await exec(`${W}SELECT COUNT(*) FROM (${smart})`); inner = smart; } catch { /* keep the plain sample */ }
      }
    }
    const src = `(SELECT *, ROW_NUMBER() OVER () - 1 AS __r${i} FROM (${inner})) AS ${s.alias}`;
    const t = stripR(await exec(`${W}SELECT * FROM ${src} ORDER BY __r${i}`));
    S.push({ name: s.alias === bare(s.expr) ? s.alias : `${bare(s.expr).startsWith('(') ? 'subquery' : bare(s.expr)} AS ${s.alias}`, cols: t.columns, rows: t.values });
    const on = s.cond ? ` ON ${s.cond}` : s.using.length ? ` USING (${s.using.join(', ')})` : '';
    frag.push(i === 0 ? src : `${s.join} ${src}${on}`);
  }
  const fromAll = frag.join(' ');
  const multi = srcs.length > 1;
  const disp = (upTo: number) => S.slice(0, upTo + 1).flatMap((t, i) => t.cols.map((c) => (multi ? `${srcs[i].alias}.${c}` : c)));
  const tuplesFor = async (upTo: number, where = '') => (await exec(`${W}SELECT ${rcols.slice(0, upTo + 1).join(', ')} FROM ${frag.slice(0, upTo + 1).join(' ')}${where ? ` WHERE ${where}` : ''} ORDER BY ${rcols.slice(0, upTo + 1).join(', ')}`)).values as (number | null)[][];
  const rowsOf = (tuples: (number | null)[][]) => tuples.map((tu) => tu.flatMap((r, i) => (r == null ? S[i].cols.map(() => null) : S[i].rows[r])));

  if (multi) S.forEach((t, i) => steps.push({ kind: 'source', label: `FROM ${bare(srcs[i].expr).startsWith('(') ? srcs[i].alias : bare(srcs[i].expr)}`, note: i === 0 ? `SQL starts with FROM: the table ${t.name}.` : `The next table, ${t.name}.`, table: t }));
  else steps.push({ kind: 'source', label: 'FROM', note: `SQL starts with FROM: it reads the table ${S[0].name}.`, table: S[0] });

  // 2. Joins, one at a time.
  let tuples = await tuplesFor(0); let J: VTable = { name: S[0].name, cols: disp(0), rows: rowsOf(tuples) };
  for (let i = 1; i < srcs.length; i++) {
    const next = await tuplesFor(i);
    const prevIndex = new Map(tuples.map((tu, k) => [key(tu), k]));
    const pairs: [number | null, number | null][] = next.map((tu) => { const pre = tu.slice(0, i); return [pre.every((x) => x == null) ? null : prevIndex.get(key(pre)) ?? null, tu[i]]; });
    const out: VTable = { name: `joined`, cols: disp(i), rows: rowsOf(next) };
    const on = srcs[i].using.length ? srcs[i].using.map((c) => [c, c] as [string, string]) : onPairs(srcs[i].cond, srcs[i].alias);
    const left: VTable = { ...J, cols: i === 1 && multi ? J.cols.map((c) => c.replace(/^[^.]*\./, '')) : J.cols };
    steps.push({ kind: 'join', label: srcs[i].join.trim().toUpperCase().replace(/\s+/g, ' ') === ',' ? 'CROSS JOIN' : srcs[i].join.trim().toUpperCase().replace(/\s+/g, ' '), note: `${srcs[i].join.trim() === ',' ? 'A comma' : srcs[i].join.trim().toUpperCase()} ${HOW_NOTE[srcs[i].how]}${srcs[i].cond ? ` (ON ${srcs[i].cond})` : ''}.`, left, right: S[i], how: srcs[i].how, on: on.map(([a, b]) => [a.includes('.') && i === 1 ? a.replace(/^[^.]*\./, '') : a, b.replace(/^[^.]*\./, '')]), pairs, output: out });
    tuples = next; J = out;
  }
  const order = rcols.join(', ');

  // 3. WHERE.
  let Wt = J, kept = tuples;
  if (p.where) {
    const r = await exec(`${W}SELECT CASE WHEN (${p.where}) THEN 1 ELSE 0 END FROM ${fromAll} ORDER BY ${order}`);
    const keep = r.values.map((v) => v[0] === 1);
    steps.push({ kind: 'filter', label: 'WHERE', note: `WHERE ${p.where}: each row is tested, and only rows where it is true stay.`, input: J, keep, cond: p.where });
    Wt = { name: 'filtered', cols: J.cols, rows: J.rows.filter((_, i) => keep[i]) }; kept = tuples.filter((_, i) => keep[i]);
  }
  const whereSql = p.where ? ` WHERE ${p.where}` : '';
  const items = splitCommas(p.select).map(selectItem);
  const plainSel = items.map((it) => it.expr).join(', ');
  const isAgg = !!p.group || (AGG.test(p.select) && !/\bOVER\b/i.test(p.select)) || !!p.having;
  let P: VTable;

  if (isAgg) {
    // 4. GROUP BY, aggregate, HAVING.
    const gexprs = p.group ? splitCommas(p.group).map((g) => { if (/^\d+$/.test(g)) return items[+g - 1]?.expr ?? g; const it = items.find((x) => x.alias.toLowerCase() === unq(g).toLowerCase() && !isIdent(x.expr)); return it ? it.expr : g; }) : [];
    let groupOf = kept.map(() => 0);
    if (gexprs.length) {
      const r = await exec(`${W}SELECT ${gexprs.map((g, k) => `${g} AS __g${k}`).join(', ')} FROM ${fromAll}${whereSql} ORDER BY ${order}`);
      const ids = new Map<string, number>(); groupOf = r.values.map((v) => { const kk = key(v); if (!ids.has(kk)) ids.set(kk, ids.size); return ids.get(kk)!; });
      steps.push({ kind: 'group', label: 'GROUP BY', note: `GROUP BY ${p.group}: rows with the same ${gexprs.length > 1 ? 'values' : 'value'} go into one group.`, input: Wt, by: gexprs, groupOf });
    }
    const gsel = gexprs.map((g, k) => `${g} AS __g${k}`);
    const r = await exec(`${W}SELECT ${[...gsel, p.select].join(', ')} FROM ${fromAll}${whereSql}${gexprs.length ? ` GROUP BY ${gexprs.join(', ')}` : ''}`);
    const gkeys = r.values.map((v) => key(v.slice(0, gexprs.length)));
    const firstKey = new Map<string, number>();
    if (gexprs.length) { const kr = await exec(`${W}SELECT ${gsel.join(', ')} FROM ${fromAll}${whereSql} ORDER BY ${order}`); kr.values.forEach((v, i) => { const kk = key(v); if (!firstKey.has(kk)) firstKey.set(kk, groupOf[i]); }); }
    const out = stripR(r); const byGroup = out.values.map((row, k) => ({ row, g: gexprs.length ? firstKey.get(gkeys[k]) ?? k : 0, k: gkeys[k] })).sort((a, b) => a.g - b.g);
    const aggT: VTable = { name: 'one row per group', cols: out.columns, rows: byGroup.map((x) => x.row) };
    const measures = items.map((it) => { const m = /^(\w+)\s*\(\s*(?:DISTINCT\s+)?([^()]*)\)$/i.exec(it.expr); return m && AGG.test(it.expr) ? { col: it.alias, fn: m[1], arg: m[2].trim() || undefined } : null; }).filter((x): x is { col: string; fn: string; arg: string | undefined } => !!x);
    const fns = [...new Set(measures.map((m) => m.fn.toUpperCase()))].join(', ') || 'aggregate';
    steps.push({ kind: 'aggregate', label: fns, note: gexprs.length ? `${fns} squeezes each group into one row.` : `With no GROUP BY, ${fns} squeezes every row into one.`, input: Wt, groupOf: kept.map((_, i) => groupOf[i]), output: aggT, measures });
    P = aggT;
    if (p.having) {
      const hr = await exec(`${W}SELECT ${[...gsel, `CASE WHEN (${p.having}) THEN 1 ELSE 0 END AS __h`].join(', ')} FROM ${fromAll}${whereSql}${gexprs.length ? ` GROUP BY ${gexprs.join(', ')}` : ''}`);
      const hk = new Map(hr.values.map((v) => [key(v.slice(0, gexprs.length)), v[v.length - 1] === 1]));
      const keep = byGroup.map((x) => hk.get(x.k) ?? true);
      steps.push({ kind: 'filter', label: 'HAVING', note: `HAVING ${p.having}: like WHERE, but it tests whole groups after they are summed.`, input: aggT, keep, cond: p.having });
      P = { name: 'groups kept', cols: aggT.cols, rows: aggT.rows.filter((_, i) => keep[i]) };
    }
  } else {
    // 5. Window functions, then SELECT.
    const r = stripR(await exec(`${W}SELECT ${p.select} FROM ${fromAll}${whereSql} ORDER BY ${order}`));
    const out: VTable = { name: 'selected', cols: r.columns, rows: r.values };
    const win = items.findIndex((it) => /\bOVER\s*\(/i.test(it.expr));
    if (win >= 0) {
      const it = items[win]; const wc = windowCall(it.expr); const m = wc ? [wc[0], wc[1], wc[2]] : null;
      if (m) {
        const spec = m[2]; const fn = (/^\s*(\w+)/.exec(m[1])?.[1] ?? '').toLowerCase();
        const part = /PARTITION\s+BY\s+([\s\S]*?)(?=\bORDER\s+BY\b|\bROWS\b|\bRANGE\b|\bGROUPS\b|$)/i.exec(spec)?.[1]?.trim() ?? '';
        const ord = /ORDER\s+BY\s+([\s\S]*?)(?=\bROWS\b|\bRANGE\b|\bGROUPS\b|$)/i.exec(spec)?.[1]?.trim() ?? '';
        const frame = /\b(ROWS|RANGE|GROUPS)\s+([\s\S]*)$/i.exec(spec)?.[2] ?? '';
        const ordExprs = ord ? splitCommas(ord).map((o) => o.replace(/\s+(ASC|DESC)?\s*(NULLS\s+(FIRST|LAST))?\s*$/i, '').trim()) : [];
        const wr = await exec(`${W}SELECT ROW_NUMBER() OVER (${part ? `PARTITION BY ${part} ` : ''}${ord ? `ORDER BY ${ord}` : ''}) AS __n${ordExprs.map((o, q) => `, ${o} AS __o${q}`).join('')}${part ? `, ${part} AS __p` : ''} FROM ${fromAll}${whereSql} ORDER BY ${order}`);
        const no = ordExprs.length;
        const pid = new Map<string, number>(); const partitionOf = wr.values.map((v) => { const kk = part ? key(v.slice(1 + no)) : '0'; if (!pid.has(kk)) pid.set(kk, pid.size); return pid.get(kk)!; });
        const peerKey = wr.values.map((v, i) => `${partitionOf[i]}|${key(v.slice(1, 1 + no))}`);
        const isRange = !frame || /^\s*RANGE\b/i.test(/\b(ROWS|RANGE|GROUPS)\b[\s\S]*$/i.exec(spec)?.[0] ?? '');
        const rn = wr.values.map((v) => v[0] as number);
        const ordIdx = wr.values.map((_, i) => i).sort((a, b) => partitionOf[a] - partitionOf[b] || rn[a] - rn[b]);
        const start = new Map<number, number>(), end = new Map<number, number>(); ordIdx.forEach((i, k) => { const pp = partitionOf[i]; if (!start.has(pp)) start.set(pp, k); end.set(pp, k); });
        const off = Number(/\(\s*[^,()]+,\s*(\d+)/.exec(m[1])?.[1] ?? 1);
        const bound = (txt: string, k: number, pp: number, isEnd: boolean) => {
          const t = txt.trim().toUpperCase();
          if (t.startsWith('UNBOUNDED PRECEDING')) return start.get(pp)!; if (t.startsWith('UNBOUNDED FOLLOWING')) return end.get(pp)!; if (t.startsWith('CURRENT')) return k;
          const n = /^(\d+)\s+(PRECEDING|FOLLOWING)/.exec(t); if (n) return Math.max(start.get(pp)!, Math.min(end.get(pp)!, n[2] === 'PRECEDING' ? k - +n[1] : k + +n[1]));
          return isEnd ? k : start.get(pp)!;
        };
        const frames: [number, number][] = ordIdx.map((i, k) => {
          const pp = partitionOf[i], a = start.get(pp)!, b = end.get(pp)!;
          if (fn === 'lag') return [Math.max(a, k - off), k]; if (fn === 'lead') return [k, Math.min(b, k + off)];
          const peerEnd = (q: number) => { let e = q; while (e + 1 <= b && peerKey[ordIdx[e + 1]] === peerKey[ordIdx[q]]) e++; return e; };
          const peerStart = (q: number) => { let e = q; while (e - 1 >= a && peerKey[ordIdx[e - 1]] === peerKey[ordIdx[q]]) e--; return e; };
          if (frame) {
            const bt = /BETWEEN\s+([\s\S]+?)\s+AND\s+([\s\S]+)$/i.exec(frame); let [x, y] = bt ? [bound(bt[1], k, pp, false), bound(bt[2], k, pp, true)] : [bound(frame, k, pp, false), k];
            if (isRange && ord) { if (/^\s*CURRENT/i.test(bt ? bt[2] : 'CURRENT')) y = peerEnd(k); if (bt && /^\s*CURRENT/i.test(bt[1])) x = peerStart(k); }
            return [x, y];
          }
          return ord ? [a, peerEnd(k)] : [a, b];
        });
        const j = r.columns.indexOf(it.alias) >= 0 ? r.columns.indexOf(it.alias) : win;
        steps.push({ kind: 'window', label: 'OVER', note: `${it.alias} = ${m[1].trim()} OVER (${spec.trim()}): each row looks at its own window of rows${part ? `, inside its ${part} group` : ''}, and no rows are merged.`, input: Wt, col: it.alias, expr: it.expr, partitionOf, order: ordIdx, frames, values: r.values.map((v) => v[j]) });
      }
    }
    const from = r.columns.map((c, j) => { const it = items[j]; if (it && (isIdent(it.expr) && !it.expr.endsWith('*'))) { const name = multi ? it.expr.replace(/"/g, '') : bare(it.expr); const k = Wt.cols.findIndex((x) => x === name || bare(x) === bare(name)); return k >= 0 ? Wt.cols[k] : null; } if (items.some((x) => x.expr.endsWith('*'))) { const k = Wt.cols.findIndex((x) => bare(x) === c); return k >= 0 ? Wt.cols[k] : null; } return null; });
    const exprs: Record<string, string> = {}; items.forEach((it, j) => { if (r.columns[j] && from[j] == null) exprs[r.columns[j]] = it.expr; });
    if (!(items.length === 1 && items[0].expr === '*' && !multi)) steps.push({ kind: 'project', label: 'SELECT', note: `SELECT picks the columns${Object.keys(exprs).length ? ' and works out new ones' : ''}: ${items.map((x) => x.expr).join(', ')}.`, input: Wt, output: out, from, exprs });
    P = out;
  }

  // 6. DISTINCT, ORDER BY, LIMIT.
  if (p.distinct) {
    const seen = new Set<string>(); const keep = P.rows.map((r) => { const kk = key(r); if (seen.has(kk)) return false; seen.add(kk); return true; });
    steps.push({ kind: 'filter', label: 'DISTINCT', note: 'DISTINCT drops rows that are exact copies of an earlier row.', input: P, keep });
    P = { name: 'distinct', cols: P.cols, rows: P.rows.filter((_, i) => keep[i]) };
  }
  const tailSql = `${W}SELECT ${p.distinct ? 'DISTINCT ' : ''}${p.select} FROM ${fromAll}${whereSql}${p.group ? ` GROUP BY ${p.group}` : ''}${p.having ? ` HAVING ${p.having}` : ''}`;
  if (p.order) {
    const r = stripR(await exec(`${tailSql} ORDER BY ${p.order}`));
    const pool = new Map<string, number[]>(); P.rows.forEach((row, i) => { const kk = key(row); (pool.get(kk) ?? pool.set(kk, []).get(kk)!).push(i); });
    const orderIdx = r.values.map((row) => pool.get(key(row))?.shift()).filter((x): x is number => x != null);
    if (orderIdx.length === P.rows.length) {
      steps.push({ kind: 'sort', label: 'ORDER BY', note: `ORDER BY ${p.order}: the rows are put in order${/\bDESC\b/i.test(p.order) ? ' (DESC means biggest first)' : ' (smallest first unless DESC)'}.`, input: P, by: splitCommas(p.order), order: orderIdx });
      P = { name: 'sorted', cols: P.cols, rows: orderIdx.map((i) => P.rows[i]) };
    }
  }
  if (p.limit) {
    const n = Number((await exec(`SELECT ${p.limit}`)).values[0][0]); const off = p.offset ? Number((await exec(`SELECT ${p.offset}`)).values[0][0]) : 0;
    steps.push({ kind: 'limit', label: 'LIMIT', note: `LIMIT ${p.limit}${off ? ` OFFSET ${off}` : ''}: only the first ${n} row${n === 1 ? '' : 's'}${off ? ` after skipping ${off}` : ''} are kept.`, input: P, n, offset: off });
    P = { name: 'limited', cols: P.cols, rows: P.rows.slice(off, off + n) };
  }
  steps.push({ kind: 'result', label: 'Result', note: 'The answer.', table: { ...P, name: 'result' } });
  return { title: 'How this query runs', steps, warn: sampledAny ? `Drawn on a small sample (up to ${cap} rows per table, with join partners picked to match) so the picture fits. The Run button gives the full answer.` : undefined };
}
