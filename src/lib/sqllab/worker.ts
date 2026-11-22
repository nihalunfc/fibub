// SQLite in a worker for the SQL courses: builds the Northbay practice database on start, runs the
// learner's SQL and answers with the last statement's table (column names even when there are no rows).
// A slow query never freezes the page; the page can end the worker and start again (./client.ts).
import initSqlJs from 'sql.js/dist/sql-wasm.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { northbay, createSql } from './northbay';

let SQLc: any = null, db: any = null;
function fresh() {
  if (db) db.close();
  db = new SQLc.Database();
  db.run('BEGIN');
  for (const t of northbay()) {
    db.run(createSql(t));
    const st = db.prepare(`INSERT INTO ${t.name} VALUES (${t.cols.map(() => '?').join(',')})`);
    for (const r of t.rows) st.run(r);
    st.free();
  }
  db.run('COMMIT');
}
const ready = initSqlJs({ locateFile: () => wasmUrl }).then((S: any) => { SQLc = S; fresh(); });

function run(sql: string) {
  let last: { columns: string[]; values: unknown[][] } | null = null; let changes = 0;
  for (const st of db.iterateStatements(sql)) {
    try {
      const columns: string[] = st.getColumnNames(); const values: unknown[][] = [];
      while (st.step()) { values.push(st.get()); if (values.length > 50000) break; }
      if (columns.length) last = { columns, values }; else changes += db.getRowsModified();
    } finally { st.free(); }
  }
  return { columns: last?.columns ?? [], values: last?.values ?? [], changes, hasTable: !!last };
}

self.onmessage = async (e: MessageEvent) => {
  const m = e.data;
  try {
    await ready;
    if (m.type === 'exec') (self as any).postMessage({ id: m.id, ok: true, ...run(m.sql) });
    else if (m.type === 'reset') { fresh(); (self as any).postMessage({ id: m.id, ok: true }); }
    else if (m.type === 'schema') {
      const t = run("SELECT name FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY name").values.map((v) => v[0] as string);
      const tables = t.map((name) => ({ name, cols: run(`SELECT name, type FROM pragma_table_info('${name.replace(/'/g, "''")}')`).values.map((v) => ({ name: v[0], type: v[1] })), rows: run(`SELECT COUNT(*) FROM "${name.replace(/"/g, '""')}"`).values[0][0] }));
      (self as any).postMessage({ id: m.id, ok: true, tables });
    }
  } catch (err) {
    (self as any).postMessage({ id: m.id, ok: false, error: String((err as Error).message ?? err) });
  }
};
