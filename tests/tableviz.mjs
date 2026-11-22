// Checks for the shared table-animation engine's SQL tracer (src/lib/tableviz/sqltrace.ts) on a toy shop.
// Run with `node tests/tableviz.mjs`.
import initSqlJs from 'sql.js';
import { traceSql, parseSelect, parseFrom, selectItem } from '../src/lib/tableviz/sqltrace.ts';

let fails = 0, n = 0;
const ok = (cond, what) => { n++; if (!cond) { fails++; console.error(`✗ ${what}`); } };
const SQL = await initSqlJs();
const db = new SQL.Database();
db.run(`CREATE TABLE customers (id INTEGER, name TEXT, city TEXT);
INSERT INTO customers VALUES (1,'Asha','Toronto'),(2,'Ben','Ottawa'),(3,'Chen','Toronto'),(4,'Dina','Hamilton');
CREATE TABLE orders (id INTEGER, customer_id INTEGER, amount REAL, day TEXT);
INSERT INTO orders VALUES (10,1,30,'2026-01-02'),(11,1,12.5,'2026-01-05'),(12,2,8,'2026-01-05'),(13,3,40,'2026-01-07'),(14,9,5,'2026-01-08');`);
const exec = async (sql) => { const st = db.prepare(sql); const columns = st.getColumnNames(); const values = []; while (st.step()) values.push(st.get()); st.free(); return { columns, values }; };
const kinds = (t) => t.steps.map((s) => s.kind).join(' ');
const last = (t) => t.steps[t.steps.length - 1];

ok(selectItem('SUM(amount) AS total').alias === 'total', 'alias AS');
ok(selectItem('COUNT(*) n').alias === 'n', 'alias bare');
ok(selectItem('c.name').alias === 'name', 'qualified name');
ok(selectItem("CASE WHEN a > 1 THEN 'x' END flag").alias === 'flag', 'case alias');
ok(parseSelect('SELECT a FROM t WHERE b = 1 ORDER BY a DESC LIMIT 3').limit === '3', 'parse limit');
ok(parseSelect("WITH x AS (SELECT 1 AS a) SELECT a FROM x").with.startsWith('WITH'), 'parse with');
ok(parseFrom('orders o LEFT JOIN customers c ON o.customer_id = c.id').length === 2, 'parse from');
ok(parseFrom('orders o LEFT JOIN customers c ON o.customer_id = c.id')[1].how === 'left', 'left join');

let t = await traceSql('SELECT name, city FROM customers WHERE city = \'Toronto\' ORDER BY name DESC', exec);
ok(kinds(t) === 'source filter project sort result', `filter trace: ${kinds(t)}`);
ok(t.steps[1].keep.join() === 'true,false,true,false', 'where keep');
ok(last(t).table.rows.map((r) => r[0]).join() === 'Chen,Asha', 'sorted result');

t = await traceSql('SELECT c.name, o.amount FROM orders o LEFT JOIN customers c ON o.customer_id = c.id', exec);
ok(kinds(t) === 'source source join project result', `join trace: ${kinds(t)}`);
const j = t.steps[2];
ok(j.pairs.length === 5 && j.pairs[4][1] === null, 'left join keeps unmatched order with NULL');
ok(j.on[0].join() === 'customer_id,id', `on pair ${j.on[0]}`);

t = await traceSql('SELECT c.city, COUNT(*) AS n, SUM(o.amount) AS total FROM orders o JOIN customers c ON o.customer_id = c.id GROUP BY c.city HAVING SUM(o.amount) > 10 ORDER BY total DESC', exec);
ok(kinds(t) === 'source source join group aggregate filter sort result', `group trace: ${kinds(t)}`);
const agg = t.steps.find((s) => s.kind === 'aggregate');
ok(agg.output.rows.length === 2 && agg.measures.length === 2, 'two groups, two measures');
ok(JSON.stringify(last(t).table.rows) === JSON.stringify([['Toronto', 3, 82.5]]), `having result ${JSON.stringify(last(t).table.rows)}`);

t = await traceSql('SELECT COUNT(*) FROM orders', exec);
ok(kinds(t) === 'source aggregate result' && last(t).table.rows[0][0] === 5, `count all: ${kinds(t)}`);

t = await traceSql('SELECT id, amount, SUM(amount) OVER (ORDER BY id) AS running FROM orders', exec);
ok(kinds(t) === 'source window project result', `window: ${kinds(t)}`);
const w = t.steps[1]; ok(w.values[2] === 50.5 && w.frames[2].join() === '0,2', `running total ${w.values[2]} ${w.frames[2]}`);

t = await traceSql('SELECT customer_id, amount, LAG(amount) OVER (PARTITION BY customer_id ORDER BY day) AS prev FROM orders', exec);
ok(t.steps[1].kind === 'window' && t.steps[1].frames[1].join() === '0,1', 'lag frame');

t = await traceSql('SELECT DISTINCT city FROM customers', exec);
ok(kinds(t) === 'source project filter result' && last(t).table.rows.length === 3, `distinct: ${kinds(t)}`);

t = await traceSql("SELECT name FROM customers WHERE city = 'Toronto' UNION SELECT name FROM customers WHERE id = 2", exec);
ok(kinds(t) === 'source source union' && t.steps[2].output.rows.length === 3, `union: ${kinds(t)}`);

t = await traceSql('WITH big AS (SELECT * FROM orders WHERE amount > 10) SELECT customer_id, COUNT(*) FROM big GROUP BY customer_id', exec);
ok(kinds(t) === 'source group aggregate result', `cte: ${kinds(t)}`);

t = await traceSql('SELECT * FROM orders LIMIT 2 OFFSET 1', exec);
ok(kinds(t) === 'source limit result' && last(t).table.rows[0][0] === 11, `limit: ${kinds(t)}`);

// Sampling big tables: joins pick matching partners.
db.run('CREATE TABLE big (k INTEGER, v INTEGER)'); for (let i = 0; i < 200; i++) db.run('INSERT INTO big VALUES (?, ?)', [i, i * 2]);
db.run('CREATE TABLE big2 (k INTEGER, w TEXT)'); for (let i = 199; i >= 0; i--) db.run('INSERT INTO big2 VALUES (?, ?)', [i, 'w' + i]);
t = await traceSql('SELECT b.k, b2.w FROM big b JOIN big2 b2 ON b.k = b2.k', exec);
ok(t.warn && t.steps[2].pairs.length === 8, `sampled join pairs ${t.steps[2]?.pairs?.length}`);

t = await traceSql('SELECT nonsense FROM nowhere', exec);
ok(t.steps.length === 0 && t.warn, 'bad query falls back');

console.log(fails ? `${fails} of ${n} tableviz checks failed` : `All ${n} tableviz checks passed`);
process.exit(fails ? 1 : 0);
