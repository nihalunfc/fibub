// Live problems for sql, part a: Modules 1-4 (see ../problems.js). Each make(r) builds a small random table with
// pick(r, ...) only (never Math.random), and verify(p) works the answer out a second, different way.
import { pick, n, steps, rows, code } from './util.js';

const choose = (r, a) => a[pick(r, 0, a.length - 1)];
const sum = (a) => a.reduce((s, v) => s + v, 0);
const many = (r, min, max, f) => Array.from({ length: pick(r, min, max) }, (_, i) => f(i));
const q = (s) => `'${s}'`;

export default {
  // ---------- Module 1 ----------
  'sql-first-query-cells': {
    title: 'the size of a first answer',
    make(r) {
      const names = ['Asha', 'Ben', 'Chen', 'Dina', 'Eli', 'Fatima', 'Gus', 'Hiro'], cities = ['Toronto', 'Ottawa', 'Hamilton'];
      const t = many(r, 5, 8, (i) => ({ id: i + 1, name: names[i], city: choose(r, cities) })), city = t[0].city;
      const cols = choose(r, [['name'], ['name', 'city'], ['id', 'name', 'city']]), kept = t.filter((x) => x.city === city).length;
      const answer = kept * cols.length;
      return {
        q: `<p>The table customers:</p>${rows(t)}${code(`SELECT ${cols.join(', ')}\nFROM customers\nWHERE city = '${city}'`)}<p>How many <b>cells</b> (rows × columns) does the answer table have?</p>`,
        answer, unit: 'cells', tol: 0, abs: 0.01,
        hint: 'WHERE decides how many rows stay; SELECT decides how many columns. Multiply them.',
        solution: steps(`WHERE keeps the ${kept} row(s) where city is ${city}.`, `SELECT keeps ${cols.length} column(s): ${cols.join(', ')}.`, `${kept} × ${cols.length} = <b>${answer}</b> cells. The customers table itself is unchanged.`),
        t, city, cols,
      };
    },
    verify: (p) => { let c = 0; for (const x of p.t) if (x.city === p.city) c += p.cols.length; return c; },
  },
  'sql-receipt-rows': {
    title: 'receipts into rows',
    make(r) {
      const prods = ['Bagels', 'Kettle', 'Milk', 'Duvet', 'Puzzle', 'Eggs', 'Speaker'];
      const orders = many(r, 2, 4, (i) => { const k = pick(r, 1, 4), s = pick(r, 0, prods.length - k); return { order_id: 1001 + i, items: prods.slice(s, s + k).map((p) => ({ product: p, qty: pick(r, 1, 5) })) }; });
      const answer = sum(orders.map((o) => o.items.length));
      const list = orders.map((o) => `<li>Order ${o.order_id}: ${o.items.map((x) => `${x.qty} × ${x.product}`).join(', ')}</li>`).join('');
      return {
        q: `<p>Today's receipts:</p><ul>${list}</ul><p>Each receipt is one row in <code>orders</code>. How many rows do these receipts add to <code>order_items</code> (one row per product in an order)?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Count the different products on each receipt. The number in front (the quantity) goes in a column, not extra rows.',
        solution: steps(orders.map((o) => `Order ${o.order_id}: ${o.items.length} product(s)`).join('; ') + '.', `${orders.map((o) => o.items.length).join(' + ')} = <b>${answer}</b> rows in order_items, against ${orders.length} rows in orders.`),
        orders,
      };
    },
    verify: (p) => p.orders.flatMap((o) => o.items).length,
  },
  'sql-int-division': {
    title: 'whole-number division',
    make(r) {
      const t = many(r, 3, 6, (i) => ({ line: i + 1, quantity: pick(r, 1, 5) })), dec = pick(r, 0, 1) === 1;
      const s = sum(t.map((x) => x.quantity)), c = t.length, answer = dec ? s / c : Math.floor(s / c);
      const expr = dec ? 'SUM(quantity) * 1.0 / COUNT(*)' : 'SUM(quantity) / COUNT(*)';
      return {
        q: `<p>The table order_items:</p>${rows(t)}${code(`SELECT ${expr} AS avg_units\nFROM order_items`)}<p>What does SQLite return?${dec ? ' (2 decimal places is fine.)' : ''}</p>`,
        answer, unit: '', tol: dec ? 0.005 : 0, abs: 0.01,
        hint: dec ? 'Multiplying by 1.0 makes one side a decimal (REAL), so the remainder is kept.' : 'quantity is INTEGER and COUNT(*) is INTEGER. Whole number ÷ whole number drops the remainder.',
        solution: steps(`SUM(quantity) = ${t.map((x) => x.quantity).join(' + ')} = ${s}; COUNT(*) = ${c}.`, dec ? `${s} × 1.0 ÷ ${c} = <b>${n(answer, 4)}</b>.` : `${s} ÷ ${c} = ${n(s / c, 4)}, but both are whole numbers, so SQLite gives <b>${answer}</b>.`),
        t, dec,
      };
    },
    verify: (p) => { let s = 0; for (const x of p.t) s += x.quantity; const c = p.t.length; return p.dec ? s / c : (s - (s % c)) / c; },
  },
  'sql-run-order': {
    title: 'WHERE, GROUP BY, HAVING in order',
    make(r) {
      const cities = ['Toronto', 'Ottawa', 'Hamilton', 'Halifax'];
      const t = many(r, 6, 9, (i) => ({ order_id: 101 + i, city: choose(r, cities), amount: pick(r, 5, 90, 5) }));
      const x = pick(r, 10, 30, 5), y = pick(r, 40, 100, 10), tot = {};
      t.filter((o) => o.amount > x).forEach((o) => { tot[o.city] = (tot[o.city] || 0) + o.amount; });
      const keep = Object.keys(tot).filter((c) => tot[c] > y), answer = keep.length;
      return {
        q: `<p>The table orders:</p>${rows(t)}${code(`SELECT city, SUM(amount) AS total\nFROM orders\nWHERE amount > ${x}\nGROUP BY city\nHAVING SUM(amount) > ${y}`)}<p>How many rows does the answer have?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: `Run it in SQL's order: first drop orders of ${x} or less (WHERE), then total each city (GROUP BY), then drop cities whose total is ${y} or less (HAVING).`,
        solution: steps(`WHERE amount > ${x} keeps ${t.filter((o) => o.amount > x).length} order(s).`, `Totals per city: ${Object.keys(tot).map((c) => `${c} ${tot[c]}`).join(', ') || 'none'}.`, `HAVING SUM(amount) > ${y} keeps ${keep.join(', ') || 'no city'}: <b>${answer}</b> row(s).`),
        t, x, y,
      };
    },
    verify: (p) => { const m = new Map(); for (const o of p.t) if (o.amount > p.x) m.set(o.city, (m.get(o.city) || 0) + o.amount); return [...m.values()].filter((v) => v > p.y).length; },
  },
  // ---------- Module 2 ----------
  'sql-distinct-rows': {
    title: 'rows left after DISTINCT',
    make(r) {
      const t = many(r, 5, 9, () => ({ channel: choose(r, ['store', 'online']), status: choose(r, ['completed', 'cancelled']) }));
      const cols = choose(r, [['channel'], ['status'], ['channel', 'status']]), key = (x) => cols.map((c) => x[c]).join('|');
      const set = [...new Set(t.map(key))], answer = set.length;
      return {
        q: `<p>The table orders:</p>${rows(t)}${code(`SELECT DISTINCT ${cols.join(', ')}\nFROM orders`)}<p>How many rows does it return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: cols.length > 1 ? 'With two columns, DISTINCT keeps each different pair once.' : 'DISTINCT keeps each different value once.',
        solution: steps(`The different ${cols.length > 1 ? 'pairs' : 'values'}: ${set.map((s) => s.replace('|', ' + ')).join('; ')}.`, `So <b>${answer}</b> row(s), from ${t.length} in the table.`),
        t, cols,
      };
    },
    verify: (p) => { const seen = {}; let c = 0; for (const x of p.t) { const k = p.cols.map((col) => x[col]).join('/'); if (!seen[k]) { seen[k] = 1; c++; } } return c; },
  },
  'sql-where-filter': {
    title: 'rows that pass a WHERE',
    make(r) {
      const names = ['Bagels', 'Kettle', 'Duvet', 'Puzzle', 'Milk', 'Speaker', 'Pillow', 'Eggs', 'Toaster'];
      const t = many(r, 6, 9, (i) => ({ product: names[i], unit_price: pick(r, 5, 60, 5) }));
      const x = t[pick(r, 0, t.length - 1)].unit_price, op = choose(r, ['>', '>=', '<', '<=', '<>']);
      const test = { '>': (v) => v > x, '>=': (v) => v >= x, '<': (v) => v < x, '<=': (v) => v <= x, '<>': (v) => v !== x }[op];
      const kept = t.filter((p) => test(p.unit_price)), answer = kept.length;
      return {
        q: `<p>The table products:</p>${rows(t)}${code(`SELECT product, unit_price\nFROM products\nWHERE unit_price ${op} ${x}`)}<p>How many rows does it return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: op.includes('=') && op !== '<>' ? `"Or equal" means rows priced exactly ${x} count too.` : `Rows priced exactly ${x} ${op === '<>' ? 'are the ones dropped' : 'do not pass'}.`,
        solution: steps(`Test each price: unit_price ${op} ${x}.`, `Kept: ${kept.map((p) => `${p.product} (${p.unit_price})`).join(', ') || 'none'}.`, `<b>${answer}</b> row(s).`),
        t, x, op,
      };
    },
    verify: (p) => p.t.filter((o) => { const d = Math.sign(o.unit_price - p.x); return { '>': d === 1, '>=': d >= 0, '<': d === -1, '<=': d <= 0, '<>': d !== 0 }[p.op]; }).length,
  },
  'sql-and-or-precedence': {
    title: 'AND before OR',
    make(r) {
      const t = many(r, 6, 10, (i) => ({ order_id: 101 + i, store_id: choose(r, [4, 8, 9]), year: choose(r, [2024, 2025]) }));
      const br = pick(r, 0, 1) === 1;
      const pass = (o) => (br ? (o.store_id === 4 || o.store_id === 8) && o.year === 2025 : o.store_id === 4 || (o.store_id === 8 && o.year === 2025));
      const answer = t.filter(pass).length;
      const where = br ? '(store_id = 4 OR store_id = 8) AND year = 2025' : 'store_id = 4 OR store_id = 8 AND year = 2025';
      return {
        q: `<p>The table orders:</p>${rows(t)}${code(`SELECT order_id\nFROM orders\nWHERE ${where}`)}<p>How many rows does it return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: br ? 'The brackets come first: stores 4 and 8, and then only 2025.' : 'No brackets, so SQL does AND first: store 4 in any year, OR store 8 in 2025.',
        solution: steps(br ? 'Read it as: (store 4 or 8) and year 2025.' : 'Read it as: store 4 (any year) OR (store 8 AND year 2025).', `Rows that pass: ${t.filter(pass).map((o) => o.order_id).join(', ') || 'none'}.`, `<b>${answer}</b> row(s).`),
        t, br,
      };
    },
    verify: (p) => { const a = p.t.filter((o) => o.store_id === 4 && (!p.br || o.year === 2025)).length; return a + p.t.filter((o) => o.store_id === 8 && o.year === 2025).length; },
  },
  'sql-null-not-equal': {
    title: 'NULLs and not-equal',
    make(r) {
      const tiers = ['Gold', 'Silver', 'Bronze', null], t = many(r, 6, 10, (i) => ({ id: i + 1, tier: choose(r, tiers) }));
      const x = choose(r, ['Gold', 'Silver', 'Bronze']), withNull = pick(r, 0, 1) === 1;
      const answer = t.filter((c) => (c.tier !== null && c.tier !== x) || (withNull && c.tier === null)).length;
      const nulls = t.filter((c) => c.tier === null).length;
      return {
        q: `<p>The table customers:</p>${rows(t)}${code(`SELECT COUNT(*)\nFROM customers\nWHERE tier <> '${x}'${withNull ? ' OR tier IS NULL' : ''}`)}<p>What number does it return?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: withNull ? 'The OR tier IS NULL brings the blank rows back in.' : `NULL <> ${q(x)} is unknown, not true, so blank rows are dropped.`,
        solution: steps(`Rows with a tier other than ${x}: ${t.filter((c) => c.tier !== null && c.tier !== x).length}.`, `Rows with a NULL tier: ${nulls}, which ${withNull ? 'are added by OR tier IS NULL' : 'fail the test (unknown)'}.`, `Answer: <b>${answer}</b>.`),
        t, x, withNull,
      };
    },
    verify: (p) => p.t.length - p.t.filter((c) => c.tier === p.x).length - (p.withNull ? 0 : p.t.filter((c) => c.tier === null).length),
  },
  'sql-order-offset': {
    title: 'ORDER BY with LIMIT and OFFSET',
    make(r) {
      const items = ['Kettle', 'Bagels', 'Puzzle', 'Duvet', 'Speaker', 'Milk', 'Pillow', 'Eggs', 'Toaster'];
      const t = many(r, 6, 9, (i) => ({ item: items[i], amount: pick(r, 5, 95, 5) }));
      const desc = pick(r, 0, 1) === 1, k = pick(r, 1, 3), sorted = t.map((x) => x.amount).sort((a, b) => (desc ? b - a : a - b)), answer = sorted[k];
      return {
        q: `<p>The table orders:</p>${rows(t)}${code(`SELECT amount\nFROM orders\nORDER BY amount${desc ? ' DESC' : ''}\nLIMIT 1 OFFSET ${k}`)}<p>What amount does it return?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: `Sort ${desc ? 'biggest' : 'smallest'} first, skip the first ${k} row(s), then keep one. Tied amounts each take a place.`,
        solution: steps(`Sorted: ${sorted.join(', ')}.`, `Skip ${k}, keep the next: <b>${answer}</b>.`),
        t, desc, k,
      };
    },
    verify: (p) => { const a = p.t.map((x) => x.amount).sort((x, y) => x - y); return p.desc ? a[a.length - 1 - p.k] : a[p.k]; },
  },
  'sql-case-band': {
    title: 'counting a CASE band',
    make(r) {
      const t = many(r, 6, 10, (i) => ({ order_id: 101 + i, amount: pick(r, 5, 95, 5) }));
      const hi = pick(r, 50, 70, 10), lo = pick(r, 20, 40, 10), swap = pick(r, 0, 3) === 0, label = choose(r, ['Large', 'Medium', 'Small']);
      const band = (a) => (swap ? (a >= lo ? 'Medium' : a >= hi ? 'Large' : 'Small') : (a >= hi ? 'Large' : a >= lo ? 'Medium' : 'Small'));
      const answer = t.filter((o) => band(o.amount) === label).length;
      const whens = swap ? [`WHEN amount >= ${lo} THEN 'Medium'`, `WHEN amount >= ${hi} THEN 'Large'`] : [`WHEN amount >= ${hi} THEN 'Large'`, `WHEN amount >= ${lo} THEN 'Medium'`];
      return {
        q: `<p>The table orders:</p>${rows(t)}${code(`SELECT SUM(CASE WHEN size = '${label}' THEN 1 ELSE 0 END)\nFROM (\n  SELECT CASE\n           ${whens[0]}\n           ${whens[1]}\n           ELSE 'Small'\n         END AS size\n  FROM orders\n)`)}<p>How many orders are labelled <b>${label}</b>?</p>`,
        answer, unit: 'orders', tol: 0, abs: 0.01,
        hint: swap ? `Read the WHEN lines from the top. The first one (>= ${lo}) already catches every amount of ${hi} or more.` : 'Read the WHEN lines from the top; each row stops at the first true one.',
        solution: steps(`Labels: ${t.map((o) => `${o.amount} → ${band(o.amount)}`).join(', ')}.`, swap ? `Because >= ${lo} comes first, nothing ever reaches the Large line.` : `Large is ${hi} and up, Medium ${lo} up to ${hi}, Small below ${lo}.`, `${label}: <b>${answer}</b>.`),
        t, hi, lo, swap, label,
      };
    },
    verify: (p) => p.t.filter((o) => { const a = o.amount; const L = !p.swap && a >= p.hi, M = p.swap ? a >= p.lo : a < p.hi && a >= p.lo; return (L ? 'Large' : M ? 'Medium' : 'Small') === p.label; }).length,
  },
  // ---------- Module 3 ----------
  'sql-avg-skips-null': {
    title: 'AVG and blanks',
    make(r) {
      const t = many(r, 4, 7, (i) => ({ store: `S0${i + 1}`, size: i === 0 || pick(r, 0, 2) > 0 ? pick(r, 10, 30) * 1000 : null }));
      if (t.every((x) => x.size !== null)) t[t.length - 1].size = null;
      const fill = pick(r, 0, 1) === 1, vals = t.map((x) => x.size).filter((v) => v !== null);
      const answer = fill ? sum(vals) / t.length : sum(vals) / vals.length;
      return {
        q: `<p>The table stores:</p>${rows(t)}${code(`SELECT ${fill ? 'AVG(COALESCE(size, 0))' : 'AVG(size)'}\nFROM stores`)}<p>What does it return? (Whole number or 2 decimals is fine.)</p>`,
        answer, unit: 'sq ft', tol: 0.001,
        hint: fill ? 'COALESCE turns each blank into 0, so every row is counted.' : 'AVG skips NULLs: divide the total by the number of stores that have a size.',
        solution: steps(`Total of the sizes: ${sum(vals).toLocaleString('en-CA')}.`, fill ? `COALESCE makes the blanks 0, so divide by all ${t.length} rows.` : `${vals.length} stores have a size; the ${t.length - vals.length} blank(s) are skipped.`, `<b>${n(answer, 6)}</b> sq ft.`),
        t, fill,
      };
    },
    verify: (p) => { let s = 0, c = 0; for (const x of p.t) { if (x.size !== null) { s += x.size; c++; } else if (p.fill) c++; } return s / c; },
  },
  'sql-group-sum': {
    title: 'one row of a GROUP BY',
    make(r) {
      const t = many(r, 6, 9, (i) => ({ order_id: 101 + i, store: choose(r, ['S01', 'S02', 'S03']), qty: pick(r, 1, 9) }));
      const s = t[0].store, agg = choose(r, ['SUM', 'COUNT', 'MAX']), g = t.filter((x) => x.store === s).map((x) => x.qty);
      const answer = agg === 'SUM' ? sum(g) : agg === 'COUNT' ? g.length : Math.max(...g);
      const expr = agg === 'COUNT' ? 'COUNT(*)' : `${agg}(qty)`;
      return {
        q: `<p>The table orders:</p>${rows(t)}${code(`SELECT store, ${expr} AS v\nFROM orders\nGROUP BY store`)}<p>What is <b>v</b> on the <b>${s}</b> row?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: `Take only the ${s} rows (its group), then apply ${expr} to them.`,
        solution: steps(`${s} group: qty ${g.join(', ')}.`, `${expr} = <b>${answer}</b>.`),
        t, s, agg,
      };
    },
    verify: (p) => p.t.reduce((a, x) => (x.store !== p.s ? a : p.agg === 'SUM' ? a + x.qty : p.agg === 'COUNT' ? a + 1 : Math.max(a, x.qty)), 0),
  },
  'sql-having-groups': {
    title: 'groups that pass HAVING',
    make(r) {
      const t = many(r, 7, 10, (i) => ({ order_id: 101 + i, customer: choose(r, ['C1', 'C2', 'C3', 'C4']), amount: pick(r, 5, 60, 5) }));
      const w = choose(r, [0, 10, 20]), useCount = pick(r, 0, 1) === 1, h = useCount ? pick(r, 2, 3) : pick(r, 40, 90, 10);
      const g = {};
      t.filter((o) => o.amount > w).forEach((o) => { (g[o.customer] = g[o.customer] || []).push(o.amount); });
      const keep = Object.keys(g).filter((c) => (useCount ? g[c].length >= h : sum(g[c]) > h)), answer = keep.length;
      const hav = useCount ? `COUNT(*) >= ${h}` : `SUM(amount) > ${h}`;
      return {
        q: `<p>The table orders:</p>${rows(t)}${code(`SELECT customer\nFROM orders\n${w ? `WHERE amount > ${w}\n` : ''}GROUP BY customer\nHAVING ${hav}`)}<p>How many customers does it return?</p>`,
        answer, unit: 'customers', tol: 0, abs: 0.01,
        hint: `${w ? `WHERE first drops orders of ${w} or less, before any totals. ` : ''}Then group by customer and test each group's ${useCount ? 'count' : 'total'}.`,
        solution: steps(`${w ? `After WHERE amount > ${w}, per` : 'Per'} customer: ${Object.keys(g).sort().map((c) => `${c} ${useCount ? g[c].length + ' order(s)' : 'total ' + sum(g[c])}`).join(', ') || 'nothing left'}.`, `HAVING ${hav} keeps ${keep.sort().join(', ') || 'none'}: <b>${answer}</b>.`),
        t, w, useCount, h,
      };
    },
    verify: (p) => ['C1', 'C2', 'C3', 'C4'].filter((c) => { const a = p.t.filter((o) => o.customer === c && o.amount > p.w); return a.length > 0 && (p.useCount ? a.length >= p.h : a.reduce((s, o) => s + o.amount, 0) > p.h); }).length,
  },
  'sql-distinct-overlap': {
    title: 'distinct counts that do not add up',
    make(r) {
      const names = ['Asha', 'Ben', 'Chen', 'Dina', 'Eli'];
      const t = many(r, 6, 10, (i) => ({ month: i % 2 ? 'Feb' : 'Jan', customer: choose(r, names) }));
      const jan = new Set(t.filter((x) => x.month === 'Jan').map((x) => x.customer)), feb = new Set(t.filter((x) => x.month === 'Feb').map((x) => x.customer));
      const all = new Set(t.map((x) => x.customer)), ask = pick(r, 0, 1), answer = ask ? jan.size + feb.size - all.size : all.size;
      return {
        q: `<p>The table orders:</p>${rows(t)}<p>${ask ? 'You run <code>COUNT(DISTINCT customer)</code> for each month and add the two answers, then run it once over the whole table. What is <b>(sum of the two months) − (whole table)</b>?' : 'What does <code>SELECT COUNT(DISTINCT customer) FROM orders</code> return?'}</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: ask ? 'The difference is the number of customers who appear in both months: they are counted once in each month.' : 'Count each different name once, however many orders it has.',
        solution: steps(`January: {${[...jan].join(', ')}} = ${jan.size}. February: {${[...feb].join(', ')}} = ${feb.size}.`, `Whole table: {${[...all].join(', ')}} = ${all.size}.`, ask ? `${jan.size} + ${feb.size} − ${all.size} = <b>${answer}</b> customer(s) in both months.` : `<b>${answer}</b>.`),
        t, ask,
      };
    },
    verify: (p) => { const months = {}; p.t.forEach((x) => { months[x.customer] = months[x.customer] || {}; months[x.customer][x.month] = 1; }); const v = Object.values(months); return p.ask ? v.filter((m) => m.Jan && m.Feb).length : v.length; },
  },
  'sql-grain-aov': {
    title: 'average line or average order',
    make(r) {
      const t = [];
      const k = pick(r, 2, 4);
      for (let o = 1; o <= k; o++) for (let j = 0, m = pick(r, 1, 3); j < m; j++) t.push({ order_id: 1000 + o, line_value: pick(r, 5, 50, 5) });
      const aov = pick(r, 0, 1) === 1, tot = sum(t.map((x) => x.line_value)), answer = aov ? tot / k : tot / t.length;
      return {
        q: `<p>The table order_items (one row per product in an order):</p>${rows(t)}${code(aov ? 'SELECT SUM(line_value) * 1.0 / COUNT(DISTINCT order_id)\nFROM order_items' : 'SELECT AVG(line_value)\nFROM order_items')}<p>What does it return? (2 decimals is fine.)</p>`,
        answer, unit: '$', tol: 0.005,
        hint: aov ? 'Total of all lines divided by the number of different orders: the average order value.' : 'AVG works at the table grain, so this averages lines, not orders.',
        solution: steps(`Total = ${tot}. Lines = ${t.length}. Different orders = ${k}.`, aov ? `${tot} ÷ ${k} = <b>${n(answer, 4)}</b> per order.` : `${tot} ÷ ${t.length} = <b>${n(answer, 4)}</b> per line (not per order: that would be ${n(tot / k, 4)}).`),
        t, aov,
      };
    },
    verify: (p) => { const per = {}; p.t.forEach((x) => { per[x.order_id] = (per[x.order_id] || 0) + x.line_value; }); const v = Object.values(per), tot = v.reduce((a, b) => a + b, 0); return p.aov ? tot / v.length : tot / p.t.length; },
  },
  // ---------- Module 4 ----------
  'sql-key-dupes': {
    title: 'is it really a key?',
    make(r) {
      const t = many(r, 6, 10, () => ({ store_id: pick(r, 1, 8) })), answer = t.length - new Set(t.map((x) => x.store_id)).size;
      return {
        q: `<p>A column someone says is the primary key:</p>${rows(t)}${code('SELECT COUNT(*) - COUNT(DISTINCT store_id)\nFROM stores_copy')}<p>What does it return? (0 would mean store_id really is unique.)</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'COUNT(*) counts rows; COUNT(DISTINCT) counts each different id once. The gap is the number of extra copies.',
        solution: steps(`${t.length} rows; different ids: ${[...new Set(t.map((x) => x.store_id))].sort((a, b) => a - b).join(', ')}.`, `${t.length} − ${new Set(t.map((x) => x.store_id)).size} = <b>${answer}</b> extra cop${answer === 1 ? 'y' : 'ies'}${answer ? ', so it is not a key' : ': a true key'}.`),
        t,
      };
    },
    verify: (p) => { const s = p.t.map((x) => x.store_id).sort((a, b) => a - b); let d = 0; for (let i = 1; i < s.length; i++) if (s[i] === s[i - 1]) d++; return d; },
  },
  'sql-inner-join-rows': {
    title: 'rows after an inner join',
    make(r) {
      const m = pick(r, 3, 5), names = ['Asha', 'Ben', 'Chen', 'Dina', 'Eli'], cust = names.slice(0, m).map((nm, i) => ({ id: i + 1, name: nm }));
      const ord = many(r, 5, 9, (i) => ({ order_id: 101 + i, customer_id: pick(r, 1, 7) })), answer = ord.filter((o) => o.customer_id <= m).length;
      return {
        q: `<p>orders:</p>${rows(ord)}<p>customers:</p>${rows(cust)}${code('SELECT o.order_id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id')}<p>How many rows does it return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Each customer id appears once in customers, so every order matches at most once. Orders pointing at a missing customer are dropped.',
        solution: steps(`Customer ids that exist: 1 to ${m}.`, `Orphan orders (dropped): ${ord.filter((o) => o.customer_id > m).map((o) => o.order_id).join(', ') || 'none'}.`, `<b>${answer}</b> rows.`),
        ord, m,
      };
    },
    verify: (p) => p.ord.reduce((a, o) => a + (o.customer_id >= 1 && o.customer_id <= p.m ? 1 : 0), 0),
  },
  'sql-left-join-count': {
    title: 'rows after a left join',
    make(r) {
      const m = pick(r, 3, 6), cust = Array.from({ length: m }, (_, i) => ({ id: i + 1 }));
      const ord = many(r, 4, 8, (i) => ({ order_id: 101 + i, customer_id: pick(r, 1, m + 2) })), star = pick(r, 0, 1) === 1;
      const per = cust.map((c) => ord.filter((o) => o.customer_id === c.id).length);
      const answer = star ? sum(per.map((k) => Math.max(1, k))) : sum(per);
      return {
        q: `<p>customers:</p>${rows(cust)}<p>orders:</p>${rows(ord)}${code(`SELECT ${star ? 'COUNT(*)' : 'COUNT(o.order_id)'}\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id`)}<p>What number does it return?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: star ? 'Every customer gives one row per order, or one NULL-padded row if they have none. COUNT(*) counts the padded rows too.' : 'COUNT(o.order_id) skips the NULL-padded rows, and orders for missing customers never join.',
        solution: steps(`Orders per customer: ${per.map((k, i) => `${i + 1}: ${k}`).join(', ')}.`, star ? `Rows: ${per.map((k) => Math.max(1, k)).join(' + ')} = <b>${answer}</b> (customers with no orders still give one row).` : `Matched orders: ${per.join(' + ')} = <b>${answer}</b>. Orders for customers above ${m} are on the right side and are lost.`),
        cust, ord, star,
      };
    },
    verify: (p) => { let c = 0; for (const cu of p.cust) { let k = 0; for (const o of p.ord) if (o.customer_id === cu.id) k++; c += p.star ? k || 1 : k; } return c; },
  },
  'sql-anti-join-count': {
    title: 'NOT EXISTS, EXISTS and NOT IN',
    make(r) {
      const m = pick(r, 4, 7), cust = Array.from({ length: m }, (_, i) => ({ id: i + 1 }));
      const ord = many(r, 3, 7, (i) => ({ order_id: 101 + i, customer_id: pick(r, 0, 3) === 0 ? null : pick(r, 1, m) }));
      const kind = choose(r, ['NOT EXISTS', 'EXISTS', 'NOT IN']), has = new Set(ord.map((o) => o.customer_id)), anyNull = has.has(null);
      const without = cust.filter((c) => !has.has(c.id)).length;
      const answer = kind === 'EXISTS' ? m - without : kind === 'NOT IN' && anyNull ? 0 : without;
      const where = kind === 'NOT IN' ? 'WHERE c.id NOT IN (SELECT customer_id FROM orders)' : `WHERE ${kind} (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.id\n)`;
      return {
        q: `<p>customers:</p>${rows(cust)}<p>orders:</p>${rows(ord)}${code(`SELECT COUNT(*)\nFROM customers c\n${where}`)}<p>What number does it return?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: kind === 'NOT IN' ? 'Look for a NULL in orders.customer_id. If there is one, x NOT IN (...) is never true.' : kind === 'EXISTS' ? 'Count customers with at least one order, each once.' : 'Count customers with no order at all.',
        solution: steps(`Customer ids that have orders: ${[...has].filter((x) => x !== null).sort((a, b) => a - b).join(', ') || 'none'}${anyNull ? ' (plus a NULL from a guest order)' : ''}.`, `Customers without orders: ${without}; with orders: ${m - without}.`, kind === 'NOT IN' && anyNull ? 'The NULL makes every NOT IN test unknown, so the answer is <b>0</b>.' : `Answer: <b>${answer}</b>.`),
        cust, ord, kind,
      };
    },
    verify: (p) => {
      const ids = p.ord.map((o) => o.customer_id);
      if (p.kind === 'NOT IN' && ids.includes(null)) return 0;
      const matched = p.cust.filter((c) => ids.indexOf(c.id) >= 0).length;
      return p.kind === 'EXISTS' ? matched : p.cust.length - matched;
    },
  },
  'sql-fan-out-sum': {
    title: 'a total inflated by a join',
    make(r) {
      const ord = many(r, 2, 4, (i) => ({ order_id: 101 + i, amount: pick(r, 10, 90, 5) }));
      const parcels = ord.map((o) => ({ order_id: o.order_id, parcels: pick(r, 1, 3) }));
      const ship = parcels.flatMap((p) => Array.from({ length: p.parcels }, (_, j) => ({ shipment_id: `${p.order_id}-${j + 1}`, order_id: p.order_id })));
      const answer = sum(ord.map((o, i) => o.amount * parcels[i].parcels));
      return {
        q: `<p>orders:</p>${rows(ord)}<p>shipments (an order can go in several parcels):</p>${rows(ship)}${code('SELECT SUM(o.amount)\nFROM orders o\nJOIN shipments s ON s.order_id = o.order_id')}<p>What total does it return?</p>`,
        answer, unit: '$', tol: 0, abs: 0.01,
        hint: 'Each order is repeated once per parcel, and SUM adds every copy.',
        solution: steps(ord.map((o, i) => `${o.amount} × ${parcels[i].parcels}`).join(' + ') + ` = <b>${answer}</b>.`, `The true total is ${sum(ord.map((o) => o.amount))}. Aggregate shipments first (or skip the join) to avoid fan-out.`),
        ord, ship,
      };
    },
    verify: (p) => { let s = 0; for (const sh of p.ship) s += p.ord.find((o) => o.order_id === sh.order_id).amount; return s; },
  },
  'sql-self-join-pairs': {
    title: 'pairs from a self-join',
    make(r) {
      const t = many(r, 5, 9, (i) => ({ id: i + 1, city: choose(r, ['Toronto', 'Ottawa', 'Calgary']) }));
      const cond = choose(r, ['a.id < b.id', 'a.id <> b.id', '']), cnt = {};
      t.forEach((x) => { cnt[x.city] = (cnt[x.city] || 0) + 1; });
      const per = Object.values(cnt).map((k) => (cond === 'a.id < b.id' ? (k * (k - 1)) / 2 : cond ? k * (k - 1) : k * k)), answer = sum(per);
      return {
        q: `<p>The table customers:</p>${rows(t)}${code(`SELECT a.id, b.id\nFROM customers a\nJOIN customers b\n  ON a.city = b.city${cond ? `\n AND ${cond}` : ''}`)}<p>How many rows does it return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: cond === 'a.id < b.id' ? 'Within each city of k people there are k(k − 1)/2 pairs, each listed once.' : cond ? 'No self-pairs, but A–B and B–A are both listed: k(k − 1) per city.' : 'Every row pairs with every row in its city, itself included: k × k per city.',
        solution: steps(`People per city: ${Object.entries(cnt).map(([c, k]) => `${c} ${k}`).join(', ')}.`, `Pairs per city: ${per.join(' + ')} = <b>${answer}</b>.`),
        t, cond,
      };
    },
    verify: (p) => { let c = 0; for (const a of p.t) for (const b of p.t) if (a.city === b.city && (p.cond === 'a.id < b.id' ? a.id < b.id : p.cond ? a.id !== b.id : true)) c++; return c; },
  },
  'sql-set-op-rows': {
    title: 'rows from a set operation',
    make(r) {
      const names = ['Asha', 'Ben', 'Chen', 'Dina', 'Eli', 'Fatima'];
      const A = many(r, 3, 6, () => choose(r, names)), B = many(r, 3, 6, () => choose(r, names)), op = choose(r, ['UNION ALL', 'UNION', 'INTERSECT', 'EXCEPT']);
      const sa = new Set(A), sb = new Set(B);
      const res = op === 'UNION ALL' ? [...A, ...B] : op === 'UNION' ? [...new Set([...A, ...B])] : op === 'INTERSECT' ? [...sa].filter((x) => sb.has(x)) : [...sa].filter((x) => !sb.has(x));
      const answer = res.length;
      return {
        q: `<p>buyers_2024: <b>${A.join(', ')}</b><br>buyers_2025: <b>${B.join(', ')}</b></p>${code(`SELECT name FROM buyers_2024\n${op}\nSELECT name FROM buyers_2025`)}<p>How many rows does it return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: op === 'UNION ALL' ? 'UNION ALL keeps every row from both lists.' : `${op} returns each different row once.`,
        solution: steps(`Different names: 2024 {${[...sa].join(', ')}}, 2025 {${[...sb].join(', ')}}.`, `${op}: ${res.join(', ') || 'no rows'}.`, `<b>${answer}</b> row(s).`),
        A, B, op,
      };
    },
    verify: (p) => {
      if (p.op === 'UNION ALL') return p.A.length + p.B.length;
      const inA = {}, inB = {}; p.A.forEach((x) => { inA[x] = 1; }); p.B.forEach((x) => { inB[x] = 1; });
      const a = Object.keys(inA).length, both = Object.keys(inA).filter((x) => inB[x]).length;
      return p.op === 'UNION' ? a + Object.keys(inB).length - both : p.op === 'INTERSECT' ? both : a - both;
    },
  },
};
