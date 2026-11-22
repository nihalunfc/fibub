// Makes the SQL in course lessons live (SQL and data modelling courses). In the lesson Markdown:
//   ```sql  with a first line "-- try"            → an editor with Run and "Show how it runs"
//   ```sql  with "-- exercise: <task>" lines,       → an exercise: Check, Hint, Show answer
//            optional "-- hint: …", "-- check: ordered|set|none", "-- noviz", "-- fails" (an error on purpose; tests expect it),
//            the starting code, then "-- answer:" and the answer
//   any other ```sql block                          → stays as code, with a "Try it" button
// Also any element with [data-sql-box] (its text is the starting code). All run in the Northbay
// practice database in a worker (src/lib/sqllab/); nothing leaves the page.
import { mountRunner, type RunOutput } from '../lib/runner/runner';
import { sql, execOrThrow, resetDb, schema } from '../lib/sqllab/client';
import { traceSql } from '../lib/tableviz/sqltrace';
import { parseBlock, lastStatement, type Spec } from '../lib/sqllab/blocks';
import { explainError } from '../lib/sqllab/errors';

export const SANDBOX = '/learn/courses/sql/sandbox/';

export async function runSql(code: string): Promise<RunOutput> {
  if (!code.trim()) return { ok: false, error: 'Type some SQL first.' };
  const r = await sql(code);
  if (!r.ok) return { ok: false, error: explainError(r.error ?? '', code, await schema().catch(() => [])) };
  if (!r.hasTable) return { ok: true, note: r.changes ? `Done: ${r.changes} row${r.changes === 1 ? '' : 's'} changed.` : 'Done. (This statement changes the database and returns no rows.)' };
  return { ok: true, tables: [{ cols: r.columns, rows: r.values }] };
}

export async function explainSql(code: string) {
  const st = lastStatement(code);
  if (!/^\s*(SELECT|WITH)\b/i.test(st.replace(/^(\s*--[^\n]*\n)+/, ''))) return { steps: [], warn: 'Only a SELECT can be drawn step by step. Run the other statements first, then draw a SELECT.' };
  return traceSql(st, execOrThrow);
}

function mount(host: HTMLElement, spec: Spec) {
  mountRunner(host, {
    lang: 'SQL', code: spec.code, task: spec.task, hint: spec.hint, answer: spec.answer, checkMode: spec.check,
    run: runSql, explain: spec.viz ? explainSql : undefined,
    extras: [
      { label: 'Reset database', onClick: async () => { await resetDb(); } },
      { label: 'Open in sandbox', onClick: (code) => { window.open(`${SANDBOX}#q=${encodeURIComponent(code)}`, '_blank', 'noopener'); } },
    ],
  });
}

export function liven(root: ParentNode = document) {
  const pres = [...root.querySelectorAll<HTMLElement>('pre:not([data-rn])')].filter((p) => p.dataset.language === 'sql' || p.querySelector(':scope > code.language-sql'));
  for (const pre of pres) {
    pre.dataset.rn = '1';
    const spec = parseBlock(pre.textContent ?? '');
    if (spec.mode === 'static') {
      const p = document.createElement('p'); p.className = 'rn-try';
      const b = document.createElement('button'); b.type = 'button'; b.className = 'rn-link'; b.textContent = 'Try it yourself ▶';
      b.addEventListener('click', () => { const box = document.createElement('div'); pre.replaceWith(box); p.remove(); mount(box, { ...spec, mode: 'try' }); box.querySelector('textarea')?.focus(); });
      p.append(b); pre.after(p);
    } else { const box = document.createElement('div'); pre.replaceWith(box); mount(box, spec); }
  }
  for (const el of root.querySelectorAll<HTMLElement>('[data-sql-box]:not([data-rn])')) { el.dataset.rn = '1'; const spec = parseBlock(el.textContent ?? ''); mount(el, spec.mode === 'static' ? { ...spec, mode: 'try' } : spec); }
}
if (typeof document !== 'undefined') liven();
