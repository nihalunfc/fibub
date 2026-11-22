// Run SQL on the Northbay practice database from the command line (for lesson writers checking numbers):
//   node scripts/northbay-query.mjs "SELECT COUNT(*) FROM orders"
import initSqlJs from 'sql.js';
import { northbay, createSql } from '../src/lib/sqllab/northbay.ts';
const SQL = await initSqlJs(); const db = new SQL.Database();
for (const t of northbay()) { db.run(createSql(t)); const st = db.prepare(`INSERT INTO ${t.name} VALUES (${t.cols.map(() => '?').join(',')})`); for (const r of t.rows) st.run(r); st.free(); }
for (const q of process.argv.slice(2)) {
  try { for (const st of db.iterateStatements(q)) { const cols = st.getColumnNames(); const rows = []; while (st.step()) rows.push(st.get()); st.free(); if (cols.length) { console.log(cols.join(' | ')); rows.slice(0, 50).forEach((r) => console.log(r.join(' | '))); console.log(`(${rows.length} rows)`); } } }
  catch (e) { console.log('ERROR:', e.message); }
}
