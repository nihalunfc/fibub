// Reads a lesson's ```sql block: plain code, a "-- try" box, or an exercise with its task, hint and answer.
// Pure (no DOM), so tests/sql-course.mjs checks every block in every lesson. Markers: src/scripts/sqllab.ts.
import { tokenize } from '../tableviz/sqltrace.ts';

/** The last statement in the code, for drawing. */
export function lastStatement(code: string) {
  const toks = tokenize(code); let start = 0, last = '';
  for (const t of toks) if (t.t === ';' && t.d === 0) { const s = code.slice(start, t.s).trim(); if (s) last = s; start = t.e; }
  const tail = code.slice(start).trim(); return tail || last;
}
export type Spec = { mode: 'try' | 'exercise' | 'static'; code: string; task?: string; hint?: string; answer?: string; check?: 'set' | 'ordered' | 'none'; viz: boolean; fails?: boolean };
export function parseBlock(text: string): Spec {
  const lines = text.replace(/\s+$/, '').split('\n');
  const spec: Spec = { mode: 'static', code: '', viz: true };
  let i = 0;
  for (; i < lines.length; i++) {
    const l = lines[i].trim(); let m: RegExpExecArray | null;
    if (/^--\s*try\b/i.test(l)) spec.mode = 'try';
    else if ((m = /^--\s*exercise:\s*(.*)$/i.exec(l))) { spec.mode = 'exercise'; spec.task = spec.task ? `${spec.task} ${m[1]}` : m[1]; }
    else if ((m = /^--\s*hint:\s*(.*)$/i.exec(l))) spec.hint = spec.hint ? `${spec.hint} ${m[1]}` : m[1];
    else if ((m = /^--\s*check:\s*(\w+)/i.exec(l))) spec.check = m[1].toLowerCase() as Spec['check'];
    else if (/^--\s*fails\b/i.test(l)) { spec.fails = true; if (spec.mode === 'static') spec.mode = 'try'; }
    else if (/^--\s*noviz\b/i.test(l)) { spec.viz = false; if (spec.mode === 'static') spec.mode = 'try'; }
    else break;
  }
  const rest = lines.slice(i); const a = rest.findIndex((l) => /^--\s*answer:?\s*$/i.test(l.trim()));
  spec.code = (a >= 0 ? rest.slice(0, a) : rest).join('\n').trim();
  if (a >= 0) spec.answer = rest.slice(a + 1).join('\n').trim();
  if (spec.mode === 'static') spec.code = text.trim();
  if (spec.answer && !spec.check) spec.check = tokenize(lastStatement(spec.answer)).some((t) => t.d === 0 && t.u === 'ORDER') ? 'ordered' : 'set';
  return spec;
}

