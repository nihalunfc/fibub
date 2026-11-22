// Checks every ```sql block in the SQL and data modelling lessons against the Northbay database:
// examples and answers run, "-- fails" examples really fail, exercises' starting code doesn't already pass,
// and "Show how it runs" can draw each SELECT. Run with `node tests/sql-course.mjs [slug ...]`.
import fs from 'node:fs';
import initSqlJs from 'sql.js';
import { northbay, createSql } from '../src/lib/sqllab/northbay.ts';
import { parseBlock, lastStatement } from '../src/lib/sqllab/blocks.ts';
import { traceSql } from '../src/lib/tableviz/sqltrace.ts';

const SQL = await initSqlJs();
const only = process.argv.slice(2);
let fails = 0, n = 0, drawn = 0, flat = 0;
const bad = (what) => { fails++; console.error(`✗ ${what}`); };
function fresh() {
  const db = new SQL.Database();
  for (const t of northbay()) { db.run(createSql(t)); const st = db.prepare(`INSERT INTO ${t.name} VALUES (${t.cols.map(() => '?').join(',')})`); for (const r of t.rows) st.run(r); st.free(); }
  return db;
}
const run = (db, sql) => { let last = null; for (const st of db.iterateStatements(sql)) { const columns = st.getColumnNames(); const values = []; while (st.step()) values.push(st.get()); st.free(); if (columns.length) last = { columns, values }; } return last; };
const norm = (r) => (r ? r.values.map((row) => row.map((v) => (typeof v === 'number' ? Math.round(v * 100) / 100 : v)).join('|')).sort().join('\n') : '');

for (const course of ['sql', 'data-modelling']) {
  const dir = `src/courses/${course}`; if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md')).sort()) {
    const slug = f.slice(0, -3); if (only.length && !only.includes(slug)) continue;
    const md = fs.readFileSync(`${dir}/${f}`, 'utf8');
    const seo = /^seoTitle:\s*['"]?(.*?)['"]?\s*$/m.exec(md)?.[1]; if (seo && seo.length > 60) bad(`${course}/${slug}: seoTitle is ${seo.length} characters (60 max)`);
    if ((md.match(/^  - q:/gm) ?? []).length !== 3) bad(`${course}/${slug}: quiz needs exactly 3 questions`);
    const db = fresh();
    const exec = async (q) => { const st = db.prepare(q); const columns = st.getColumnNames(); const values = []; while (st.step()) values.push(st.get()); st.free(); return { columns, values }; };
    for (const m of md.matchAll(/```sql\n([\s\S]*?)```/g)) {
      const spec = parseBlock(m[1]); const where = `${course}/${slug}: ${spec.task ?? spec.code.split('\n')[0]}`; n++;
      if (spec.mode === 'static') { try { run(db, spec.code); } catch (e) { if (!spec.fails) bad(`${where}: ${e.message}`); } continue; }
      let mine = null;
      try { mine = run(db, spec.code); if (spec.fails) bad(`${where}: meant to fail but ran`); } catch (e) { if (!spec.fails && spec.mode !== 'exercise') bad(`${where}: ${e.message}`); }
      if (spec.answer) {
        try {
          const want = run(db, spec.answer);
          if (!want) bad(`${where}: answer gives no table`);
          else if (!want.values.length) bad(`${where}: answer gives 0 rows`);
          else if (mine && norm(mine) === norm(want) && mine.columns.length === want.columns.length) bad(`${where}: starting code already passes`);
        } catch (e) { bad(`${where}: answer fails: ${e.message}`); }
      }
      if (spec.viz && !spec.fails) {
        const st = lastStatement(spec.answer ?? spec.code);
        if (/^\s*(SELECT|WITH)\b/i.test(st)) { const t = await traceSql(st, exec); if (t.steps.length > 1) drawn++; else { flat++; if (process.env.VERBOSE) console.log(`  (drawn as result only) ${where}: ${t.warn}`); } }
      }
    }
    db.close();
  }
}
console.log(fails ? `${fails} of ${n} SQL lesson blocks failed` : `All ${n} SQL lesson blocks passed (${drawn} drawn step by step, ${flat} as result only)`);
process.exit(fails ? 1 : 0);
