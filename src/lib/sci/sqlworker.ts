// SQLite (sql.js, WebAssembly) in a worker, so a slow query never freezes the page and can be stopped.
import initSqlJs from 'sql.js/dist/sql-wasm.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

type Col = { name: string; type: 'INTEGER' | 'REAL' | 'TEXT' };
let db: any = null;
const ready = initSqlJs({ locateFile: () => wasmUrl }).then((SQL: any) => { db = new SQL.Database(); });
const q = (s: string) => `"${s.replace(/"/g, '""')}"`;

self.onmessage = async (e: MessageEvent) => {
  const m = e.data;
  try {
    await ready;
    if (m.type === 'load') {
      const cols: Col[] = m.cols;
      db.run(`DROP TABLE IF EXISTS ${q(m.name)}`);
      db.run(`CREATE TABLE ${q(m.name)} (${cols.map((c) => `${q(c.name)} ${c.type}`).join(', ')})`);
      const st = db.prepare(`INSERT INTO ${q(m.name)} VALUES (${cols.map(() => '?').join(',')})`);
      db.run('BEGIN');
      for (const r of m.rows) st.run(r);
      db.run('COMMIT'); st.free();
      (self as any).postMessage({ id: m.id, ok: true });
    } else if (m.type === 'drop') {
      db.run(`DROP TABLE IF EXISTS ${q(m.name)}`);
      (self as any).postMessage({ id: m.id, ok: true });
    } else if (m.type === 'exec') {
      const t0 = performance.now();
      const res = db.exec(m.sql);
      const last = res[res.length - 1];
      (self as any).postMessage({ id: m.id, ok: true, columns: last?.columns ?? [], values: last?.values ?? [], ms: performance.now() - t0, changes: db.getRowsModified() });
    }
  } catch (err) {
    (self as any).postMessage({ id: m.id, ok: false, error: String((err as Error).message ?? err) });
  }
};
