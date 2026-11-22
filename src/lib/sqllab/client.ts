// The page side of the SQL practice database: one worker per page, shared by every editor on it.
// exec() times out after 8 seconds by ending the worker (a fresh database is built on the next call).
import type { Cell } from '../tableviz/types';

export type SqlResult = { ok: boolean; columns: string[]; values: Cell[][]; error?: string; changes?: number; hasTable?: boolean; ms?: number };
export type SchemaTable = { name: string; cols: { name: string; type: string }[]; rows: number };
let worker: Worker | null = null, seq = 0;
const pending = new Map<number, (m: any) => void>();
let schemaCache: SchemaTable[] | null = null;
const listeners = new Set<() => void>();

function start() {
  worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (e) => { pending.get(e.data.id)?.(e.data); pending.delete(e.data.id); };
}
function call(msg: object, timeout = 8000): Promise<any> {
  if (!worker) start();
  const id = ++seq;
  return new Promise((res) => {
    const t = setTimeout(() => { pending.delete(id); worker?.terminate(); worker = null; schemaCache = null; for (const [, r] of pending) r({ ok: false, error: 'stopped' }); pending.clear(); res({ ok: false, error: 'This query took more than 8 seconds, so it was stopped and the practice database was reset. Check for a join with no ON condition.' }); }, timeout);
    pending.set(id, (m) => { clearTimeout(t); res(m); });
    worker!.postMessage({ ...msg, id });
  });
}
/** Run SQL; the answer is the last statement's table. */
export async function sql(text: string): Promise<SqlResult> {
  const t0 = performance.now(); const r = await call({ type: 'exec', sql: text }, schemaCache ? 8000 : 20000);
  if (r.ok && r.changes) { schemaCache = null; listeners.forEach((f) => f()); }
  if (r.ok && /\b(CREATE|DROP|ALTER)\b/i.test(text)) { schemaCache = null; listeners.forEach((f) => f()); }
  return { ...r, columns: r.columns ?? [], values: r.values ?? [], ms: performance.now() - t0 };
}
/** For the step-by-step tracer: throws on an error. */
export async function execOrThrow(text: string) { const r = await sql(text); if (!r.ok) throw new Error(r.error); return { columns: r.columns, values: r.values }; }
export async function resetDb() { await call({ type: 'reset' }, 20000); schemaCache = null; listeners.forEach((f) => f()); }
export async function schema(): Promise<SchemaTable[]> { if (!schemaCache) { const r = await call({ type: 'schema' }, 20000); schemaCache = r.ok ? r.tables : []; } return schemaCache!; }
export const onSchemaChange = (f: () => void) => listeners.add(f);
