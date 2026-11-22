// Live problems for data-modelling, part a: Modules 1-4 (see ../problems.js).
// Each make(r) builds a tiny random table from r only; verify works the answer out a different way.
import { pick, n, steps, table, rows, code } from './util.js';

const sum = (a) => a.reduce((s, v) => s + v, 0);
const STORES = ['S1', 'S2', 'S3', 'S4'];
const PRODS = ['Kettle', 'Bananas', 'Eggs', 'Duvet', 'Lego set', 'Earbuds'];
const DEPT = { Kettle: 'Home', Bananas: 'Grocery', Eggs: 'Grocery', Duvet: 'Home', 'Lego set': 'Kids', Earbuds: 'Tech' };
const one = (r, a) => a[pick(r, 0, a.length - 1)];

export default {
  // ---------- Module 1 ----------
  'dm-selectivity': {
    title: 'how much of the table a query touches',
    make(r) {
      const total = pick(r, 2000, 9000, 10), k = pick(r, 1, 6), answer = (100 * k) / total;
      return {
        q: `<p>order_items has <b>${total.toLocaleString('en-CA')}</b> rows. The till runs <code>SELECT * FROM order_items WHERE order_id = 2051</code> and order 2051 has <b>${k}</b> line(s).</p><p>What is the query's <b>selectivity</b> (rows touched ÷ rows in the table), as a percentage?</p>`,
        answer, unit: '%', tol: 0.005,
        hint: 'Selectivity = rows touched ÷ all rows. Multiply by 100 for a percentage. A tiny number means OLTP-style work.',
        solution: steps(`${k} ÷ ${total} = ${n(k / total, 4)}.`, `× 100 = <b>${n(answer, 4)}</b> %: a tiny slice, so this is OLTP work. A report over every line would have selectivity 100 %.`),
        total, k,
      };
    },
    verify: (p) => p.k / (p.total / 100),
  },
  'dm-1nf-rows': {
    title: 'rows after first normal form',
    make(r) {
      const t = Array.from({ length: pick(r, 3, 6) }, (_, i) => {
        const m = pick(r, 1, 4), s = pick(r, 0, PRODS.length - 1);
        return { order_id: 1040 + i, products: Array.from({ length: m }, (_, j) => PRODS[(s + j) % PRODS.length]).join(', ') };
      });
      const answer = sum(t.map((x) => x.products.split(', ').length));
      return {
        q: `<p>A spreadsheet keeps one row per order, with the products crammed into one cell:</p>${rows(t)}<p>You put it into <b>1NF</b>: one row per product on each order (an order line). How many rows does the new table have?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'In 1NF each cell holds one value, so each product in a list becomes its own row.',
        solution: steps(t.map((x) => `Order ${x.order_id}: ${x.products.split(', ').length}`).join('; ') + '.', `Add them: <b>${answer}</b> rows, keyed by (order_id, product).`),
        t,
      };
    },
    verify: (p) => p.t.reduce((a, x) => a + (x.products.match(/,/g) || []).length + 1, 0),
  },
  'dm-fanout-rows': {
    title: 'rows after a one-to-many join',
    make(r) {
      const st = STORES.slice(0, pick(r, 2, 4)), t = st.map((s) => ({ store: s, sale_rows: pick(r, 2, 9), employees: pick(r, 1, 4) }));
      const answer = sum(t.map((x) => x.sale_rows * x.employees));
      return {
        q: `<p>A wide sales table and an employees table, counted per store:</p>${rows(t)}<p>Someone joins every employee onto the sales rows with <code>JOIN employees e ON e.store = s.store</code>. How many rows come out?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Each sale row is copied once per employee of its store. Multiply per store, then add.',
        solution: steps(t.map((x) => `${x.store}: ${x.sale_rows} × ${x.employees} = ${x.sale_rows * x.employees}`).join('; ') + '.', `Total <b>${answer}</b> rows, against ${sum(t.map((x) => x.sale_rows))} real sales: fan-out.`),
        t,
      };
    },
    verify: (p) => { let c = 0; p.t.forEach((x) => { for (let i = 0; i < x.employees; i++) c += x.sale_rows; }); return c; },
  },
  'dm-guest-drop': {
    title: 'rows left after an inner join to customers',
    make(r) {
      const t = Array.from({ length: pick(r, 5, 9) }, (_, i) => ({ order_id: 1100 + i, customer_id: pick(r, 0, 3) === 0 ? null : pick(r, 1, 6) }));
      const how = ['INNER', 'LEFT'][pick(r, 0, 1)], answer = how === 'LEFT' ? t.length : t.filter((x) => x.customer_id != null).length;
      return {
        q: `<p>orders (NULL = a guest checkout; every other customer_id exists in customers):</p>${rows(t)}<p>How many rows does <code>orders o ${how} JOIN customers c ON c.customer_id = o.customer_id</code> return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: how === 'LEFT' ? 'A LEFT JOIN keeps every order, matched or not.' : 'NULL = anything is never true, so guest orders find no partner in an inner join.',
        solution: steps(`Guest orders: ${t.length - t.filter((x) => x.customer_id != null).length} of ${t.length}.`, how === 'LEFT' ? `LEFT keeps them all: <b>${answer}</b>.` : `INNER drops them: <b>${answer}</b> rows. The diagram's circle ("zero or one customer") warns you about this.`),
        t, how,
      };
    },
    verify: (p) => p.t.length - (p.how === 'LEFT' ? 0 : p.t.filter((x) => x.customer_id === null).length),
  },
  // ---------- Module 2 ----------
  'dm-return-rate': {
    title: 'returns per 100 sale lines',
    make(r) {
      const t = ['Oct', 'Nov', 'Dec'].map((m) => ({ month: m, sale_lines: pick(r, 150, 420), returns: pick(r, 3, 15) }));
      const answer = (100 * sum(t.map((x) => x.returns))) / sum(t.map((x) => x.sale_lines));
      return {
        q: `<p>Two business processes, counted by month:</p>${rows(t)}<p>Over the three months, how many returns were there <b>per 100 sale lines</b>?</p>`,
        answer, unit: 'per 100', tol: 0.005,
        hint: 'Add each process over the three months first, then divide. Do not average the three monthly rates.',
        solution: steps(`Returns: ${t.map((x) => x.returns).join(' + ')} = ${sum(t.map((x) => x.returns))}.`, `Sale lines: ${t.map((x) => x.sale_lines).join(' + ')} = ${sum(t.map((x) => x.sale_lines))}.`, `100 × ${sum(t.map((x) => x.returns))} ÷ ${sum(t.map((x) => x.sale_lines))} = <b>${n(answer, 4)}</b>.`),
        t,
      };
    },
    verify: (p) => p.t.reduce((a, x) => a + x.returns, 0) / (p.t.reduce((a, x) => a + x.sale_lines, 0) / 100),
  },
  'dm-mixed-grain': {
    title: 'summing an order total at line grain',
    make(r) {
      const t = [];
      for (let o = 0; o < pick(r, 2, 4); o++) {
        const lines = Array.from({ length: pick(r, 1, 4) }, () => pick(r, 2, 40));
        lines.forEach((amt) => t.push({ order_id: 1038 + o, line_amount: amt, order_total: sum(lines) }));
      }
      const answer = sum(t.map((x) => x.order_total));
      return {
        q: `<p>A fact table at the grain "one row per order line", with the order's total copied onto every line:</p>${rows(t)}<p>What does <code>SUM(order_total)</code> return?</p>`,
        answer, unit: '$', tol: 0, abs: 0.01,
        hint: 'Each order total is added once for every line of that order.',
        solution: steps(`Adding the column row by row: ${t.map((x) => x.order_total).join(' + ')} = <b>${answer}</b>.`, `The true sales are SUM(line_amount) = ${sum(t.map((x) => x.line_amount))}. order_total is not true at the line grain.`),
        t,
      };
    },
    verify: (p) => { const by = {}; p.t.forEach((x) => { by[x.order_id] = by[x.order_id] || { tot: x.order_total, k: 0 }; by[x.order_id].k++; }); return Object.values(by).reduce((a, o) => a + o.tot * o.k, 0); },
  },
  'dm-grain-rollup': {
    title: 'rows after rolling up to store per day',
    make(r) {
      const t = Array.from({ length: pick(r, 5, 9) }, () => ({ store: STORES[pick(r, 0, 2)], day: `Dec ${pick(r, 20, 22)}`, product: one(r, PRODS) }));
      const answer = new Set(t.map((x) => x.store + '|' + x.day)).size;
      return {
        q: `<p>Order lines at the atomic grain:</p>${rows(t)}<p>You roll them up with <code>GROUP BY store, day</code>. How many rows does the store-per-day table have?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'One row for each different (store, day) pair. Products disappear in the roll-up.',
        solution: steps(`Different pairs: ${[...new Set(t.map((x) => `${x.store} ${x.day}`))].join('; ')}.`, `So <b>${answer}</b> rows. You cannot get the products back from them.`),
        t,
      };
    },
    verify: (p) => p.t.filter((x, i) => p.t.findIndex((y) => y.store === x.store && y.day === x.day) === i).length,
  },
  'dm-avg-price': {
    title: 'an average price from additive facts',
    make(r) {
      const t = Array.from({ length: pick(r, 3, 5) }, () => ({ product: one(r, PRODS), quantity: pick(r, 1, 6), unit_price: pick(r, 2, 45) }));
      const q = sum(t.map((x) => x.quantity)), s = sum(t.map((x) => x.quantity * x.unit_price)), answer = s / q;
      return {
        q: `<p>Order lines:</p>${rows(t)}<p>The fact table stores <code>sales_amount = quantity × unit_price</code>. What is the <b>average price per unit</b>, SUM(sales_amount) ÷ SUM(quantity)?</p>`,
        answer, unit: '$', tol: 0.005,
        hint: 'Work out each line\'s sales_amount, add them, then divide by the total quantity. Do not average the prices.',
        solution: steps(`Sales: ${t.map((x) => `${x.quantity}×${x.unit_price}`).join(' + ')} = ${s}.`, `Units: ${q}.`, `${s} ÷ ${q} = <b>${n(answer, 4)}</b>.`),
        t,
      };
    },
    verify: (p) => { let w = 0; const q = p.t.reduce((a, x) => a + x.quantity, 0); p.t.forEach((x) => { w += (x.quantity / q) * x.unit_price; }); return w; },
  },
  'dm-star-region': {
    title: 'a region total through the store dimension',
    make(r) {
      const regs = ['Ontario South', 'Prairies'], dim = STORES.map((s) => ({ store_key: s, region: regs[pick(r, 0, 1)] }));
      const f = Array.from({ length: pick(r, 5, 8) }, () => ({ store_key: one(r, STORES), sales_amount: pick(r, 5, 80) }));
      const reg = dim[0].region, answer = sum(f.filter((x) => dim.find((d) => d.store_key === x.store_key).region === reg).map((x) => x.sales_amount));
      return {
        q: `<p>dim_store:</p>${rows(dim)}<p>fact_sales:</p>${rows(f)}<p>What does <code>SUM(f.sales_amount)</code> give for <b>${reg}</b> after joining the fact to dim_store?</p>`,
        answer, unit: '$', tol: 0, abs: 0.01,
        hint: `First find which store keys are in ${reg}. Then add the fact rows with those keys.`,
        solution: steps(`${reg} stores: ${dim.filter((d) => d.region === reg).map((d) => d.store_key).join(', ')}.`, `Their fact rows add to <b>${answer}</b>.`),
        dim, f, reg,
      };
    },
    verify: (p) => { const by = {}; p.f.forEach((x) => { by[x.store_key] = (by[x.store_key] || 0) + x.sales_amount; }); return p.dim.filter((d) => d.region === p.reg).reduce((a, d) => a + (by[d.store_key] || 0), 0); },
  },
  'dm-fact-join-fanout': {
    title: 'joining two fact tables directly',
    make(r) {
      const ps = ['P1', 'P2', 'P3'], t = ps.map((p) => ({ product: p, sale_rows: pick(r, 1, 6), sales_each: pick(r, 10, 50, 5), return_rows: pick(r, 0, 3) }));
      const answer = sum(t.map((x) => x.sale_rows * x.sales_each * x.return_rows));
      return {
        q: `<p>Per product: how many rows each fact table has, and each sale row's amount:</p>${rows(t)}<p>Someone writes <code>FROM fact_sales s JOIN fact_returns r ON r.product = s.product</code> and takes <code>SUM(s.sales_amount)</code>. What number comes out?</p>`,
        answer, unit: '$', tol: 0, abs: 0.01,
        hint: 'Each sale row pairs with every return row of the same product. A product with 0 returns drops out.',
        solution: steps(t.map((x) => `${x.product}: ${x.sale_rows} × ${x.sales_each} × ${x.return_rows}`).join('; ') + '.', `Total <b>${answer}</b>. The true sales are ${sum(t.map((x) => x.sale_rows * x.sales_each))}. Drill across instead.`),
        t,
      };
    },
    verify: (p) => p.t.filter((x) => x.return_rows > 0).reduce((a, x) => a + x.sales_each * x.sale_rows * x.return_rows, 0),
  },
  // ---------- Module 3 ----------
  'dm-fill-rate': {
    title: 'the fill rate of a transaction fact',
    make(r) {
      const P = pick(r, 3, 4), D = pick(r, 4, 6), t = Array.from({ length: pick(r, 4, 10) }, () => ({ product: `P${pick(r, 1, P)}`, day: pick(r, 1, D), qty: pick(r, 1, 3) }));
      const k = new Set(t.map((x) => x.product + '|' + x.day)).size, answer = (100 * k) / (P * D);
      return {
        q: `<p>A transaction fact over <b>${P}</b> products and <b>${D}</b> days (a row only when something sold):</p>${rows(t)}<p>What share of all possible (product, day) pairs has at least one row, as a percentage?</p>`,
        answer, unit: '%', tol: 0.005,
        hint: 'Count the different (product, day) pairs in the table, then divide by products × days.',
        solution: steps(`Different pairs: ${k}.`, `Possible pairs: ${P} × ${D} = ${P * D}.`, `${k} ÷ ${P * D} × 100 = <b>${n(answer, 4)}</b> %. The other pairs are empty: zero never appears as a row.`),
        t, P, D,
      };
    },
    verify: (p) => { let k = 0; for (let a = 1; a <= p.P; a++) for (let d = 1; d <= p.D; d++) if (p.t.some((x) => x.product === `P${a}` && x.day === d)) k++; return (100 * k) / (p.P * p.D); },
  },
  'dm-snapshot-avg': {
    title: 'true average daily sales',
    make(r) {
      const D = pick(r, 7, 10), t = [];
      for (let d = 1; d <= D; d++) if (pick(r, 0, 2) > 0 || d === 1) t.push({ day: d, sales: pick(r, 10, 90) });
      const answer = sum(t.map((x) => x.sales)) / D;
      return {
        q: `<p>A store's transaction fact for days 1 to <b>${D}</b> (days with no sale have no row):</p>${rows(t)}<p>A periodic snapshot keeps one row per day, with 0 on quiet days. What is the store's <b>average daily sales</b>?</p>`,
        answer, unit: '$', tol: 0.005,
        hint: `Divide by every day in the period (${D}), not by the number of rows.`,
        solution: steps(`Total: ${sum(t.map((x) => x.sales))}.`, `${sum(t.map((x) => x.sales))} ÷ ${D} days = <b>${n(answer, 4)}</b>. Averaging only the ${t.length} rows would give ${n(sum(t.map((x) => x.sales)) / t.length, 4)}, too high.`),
        t, D,
      };
    },
    verify: (p) => { const full = Array.from({ length: p.D }, (_, i) => (p.t.find((x) => x.day === i + 1) || { sales: 0 }).sales); return full.reduce((a, b) => a + b, 0) / full.length; },
  },
  'dm-acc-status': {
    title: 'lines still inside the return window',
    make(r) {
      const T = pick(r, 60, 90), t = Array.from({ length: pick(r, 5, 8) }, (_, i) => {
        const sold = pick(r, T - 50, T - 1), ret = pick(r, 0, 3) === 0 ? Math.min(T, sold + pick(r, 1, 20)) : null;
        return { line: i + 1, sold_day: sold, returned_day: ret };
      });
      const answer = t.filter((x) => x.returned_day == null && T - x.sold_day < 30).length;
      return {
        q: `<p>An accumulating snapshot of order lines. Days are numbered; the return window is <b>30 days</b> from the sale. Tonight is day <b>${T}</b>.</p>${rows(t)}<p>How many lines have status <b>window open</b> (not returned, and fewer than 30 days since the sale)?</p>`,
        answer, unit: 'lines', tol: 0, abs: 0.01,
        hint: `For each line with no return, work out ${T} − sold_day. Under 30 means the window is still open.`,
        solution: steps(t.map((x) => `line ${x.line}: ${x.returned_day != null ? 'returned' : T - x.sold_day < 30 ? `${T - x.sold_day} days, open` : `${T - x.sold_day} days, kept`}`).join('; ') + '.', `Window open: <b>${answer}</b>.`),
        t, T,
      };
    },
    verify: (p) => p.t.length - p.t.filter((x) => x.returned_day !== null).length - p.t.filter((x) => x.returned_day === null && x.sold_day + 30 <= p.T).length,
  },
  'dm-coverage-quiet': {
    title: 'covered store-days with no sale',
    make(r) {
      const S = pick(r, 2, 4), D = pick(r, 3, 5), sold = [];
      for (let s = 1; s <= S; s++) for (let d = 1; d <= D; d++) if (pick(r, 0, 2) === 0) sold.push({ store: `S${s}`, day: d, sales: pick(r, 5, 60) });
      const answer = S * D - sold.length;
      return {
        q: `<p>A promotion ran at <b>${S}</b> stores for <b>${D}</b> days, so the coverage table has one row per store per day. The sales fact, summed per store-day, has these rows:</p>${sold.length ? rows(sold) : '<p><i>(no rows: nothing sold)</i></p>'}<p>How many covered store-days had <b>no sale</b> (coverage EXCEPT sales)?</p>`,
        answer, unit: 'store-days', tol: 0, abs: 0.01,
        hint: 'Coverage has stores × days rows. Take away the store-days that appear in the sales table.',
        solution: steps(`Coverage: ${S} × ${D} = ${S * D}.`, `Store-days with a sale: ${sold.length}.`, `${S * D} − ${sold.length} = <b>${answer}</b>.`),
        S, D, sold,
      };
    },
    verify: (p) => { let q = 0; for (let s = 1; s <= p.S; s++) for (let d = 1; d <= p.D; d++) if (!p.sold.some((x) => x.store === `S${s}` && x.day === d)) q++; return q; },
  },
  'dm-avg-of-avgs': {
    title: 'the true average line value',
    make(r) {
      const t = ['Grocery', 'Home', 'Kids', 'Tech'].slice(0, pick(r, 2, 4)).map((d) => ({ department: d, lines: pick(r, 3, 60), sales: 0 }));
      t.forEach((x) => { x.sales = x.lines * pick(r, 4, 60); });
      const answer = sum(t.map((x) => x.sales)) / sum(t.map((x) => x.lines));
      return {
        q: `<p>Sales by department:</p>${rows(t)}<p>What is the <b>true average value of one line</b> across all departments?</p>`,
        answer, unit: '$', tol: 0.005,
        hint: 'Ratio of sums: total sales ÷ total lines. Averaging the department averages gives every department an equal vote.',
        solution: steps(`Total sales ${sum(t.map((x) => x.sales))}; total lines ${sum(t.map((x) => x.lines))}.`, `${sum(t.map((x) => x.sales))} ÷ ${sum(t.map((x) => x.lines))} = <b>${n(answer, 4)}</b>.`, `The average of averages would say ${n(sum(t.map((x) => x.sales / x.lines)) / t.length, 4)}.`),
        t,
      };
    },
    verify: (p) => { const L = p.t.reduce((a, x) => a + x.lines, 0); return p.t.reduce((a, x) => a + (x.sales / x.lines) * (x.lines / L), 0); },
  },
  'dm-distinct-sum': {
    title: 'summed monthly distinct customers',
    make(r) {
      const t = ['Jan', 'Feb', 'Mar'].map((m) => {
        const k = pick(r, 1, 4), s = pick(r, 1, 6);
        return { month: m, customers: Array.from({ length: k }, (_, j) => `C${((s + j * 2) % 7) + 1}`).join(', ') };
      });
      const months = t.map((x) => new Set(x.customers.split(', ')).size), all = new Set(t.flatMap((x) => x.customers.split(', '))).size;
      const answer = sum(months) - all;
      return {
        q: `<p>Customers who bought, by month:</p>${rows(t)}<p>A report adds the three monthly <code>COUNT(DISTINCT customer)</code> values. By how much does that sum <b>overstate</b> the real number of different customers in the quarter?</p>`,
        answer, unit: 'customers', tol: 0, abs: 0.01,
        hint: 'Count each month\'s different customers and add them. Then count the different customers over the whole quarter. Subtract.',
        solution: steps(`Monthly counts: ${months.join(' + ')} = ${sum(months)}.`, `Different customers in the quarter: ${all}.`, `Overstated by <b>${answer}</b>: the repeat customers.`),
        t,
      };
    },
    verify: (p) => { const seen = {}; let extra = 0; p.t.forEach((x) => new Set(x.customers.split(', ')).forEach((c) => { if (seen[c]) extra++; seen[c] = 1; })); return extra; },
  },
  // ---------- Module 4 ----------
  'dm-unknown-member': {
    title: 'fact rows sent to the unknown member',
    make(r) {
      const dim = [1, 2, 3, 4].slice(0, pick(r, 2, 4)).map((id, i) => ({ customer_key: i + 1, customer_id: id }));
      const f = Array.from({ length: pick(r, 5, 9) }, (_, i) => ({ line: i + 1, customer_id: pick(r, 0, 3) === 0 ? null : pick(r, 1, 5) }));
      const answer = f.filter((x) => x.customer_id == null || !dim.some((d) => d.customer_id === x.customer_id)).length;
      return {
        q: `<p>dim_customer (plus an unknown member, key −1):</p>${rows(dim)}<p>Source lines:</p>${rows(f)}${code('COALESCE(c.customer_key, -1) AS customer_key\nFROM lines l LEFT JOIN dim_customer c ON c.customer_id = l.customer_id')}<p>How many lines get customer_key <b>−1</b>?</p>`,
        answer, unit: 'lines', tol: 0, abs: 0.01,
        hint: 'A line goes to −1 when its customer_id is NULL or is not in dim_customer.',
        solution: steps(`Known ids: ${dim.map((d) => d.customer_id).join(', ')}.`, `Lines with NULL or another id: <b>${answer}</b>. None are lost; they all point at the unknown row.`),
        dim, f,
      };
    },
    verify: (p) => { const k = {}; p.dim.forEach((d) => { k[d.customer_id] = d.customer_key; }); return p.f.map((x) => (x.customer_id === null ? -1 : k[x.customer_id] ?? -1)).filter((v) => v === -1).length; },
  },
  'dm-weekend-days': {
    title: 'weekend rows in a date dimension',
    make(r) {
      const y = pick(r, 2024, 2026), m = pick(r, 1, 12), names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
      let answer = 0;
      for (let d = 1; d <= days; d++) { const w = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); if (w === 0 || w === 6) answer++; }
      return {
        q: `<p>Your date dimension has one row per day. How many rows of <b>${names[m - 1]} ${y}</b> have <code>is_weekend = 1</code> (Saturday or Sunday)?</p>`,
        answer, unit: 'days', tol: 0, abs: 0.01,
        hint: `Find the weekday of ${names[m - 1]} 1, count the days in the month, then count the Saturdays and Sundays.`,
        solution: steps(`${names[m - 1]} ${y} has ${days} days and starts on a ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(Date.UTC(y, m - 1, 1)).getUTCDay()]}.`, `Saturdays and Sundays: <b>${answer}</b>. The calendar table counts them for every report.`),
        y, m,
      };
    },
    verify: (p) => {
      const days = new Date(Date.UTC(p.y, p.m, 0)).getUTCDate(), w0 = new Date(Date.UTC(p.y, p.m - 1, 1)).getUTCDay();
      const full = Math.floor(days / 7) * 2; let extra = 0;
      for (let i = 0; i < days % 7; i++) { const w = (w0 + i) % 7; if (w === 0 || w === 6) extra++; }
      return full + extra;
    },
  },
  'dm-drill-across': {
    title: 'returns per 100 lines, drilled across',
    make(r) {
      const sales = Array.from({ length: pick(r, 6, 10) }, () => ({ product: one(r, PRODS) })), ret = Array.from({ length: pick(r, 1, 4) }, () => ({ product: one(r, PRODS) }));
      const dept = DEPT[sales[0].product], sl = sales.filter((x) => DEPT[x.product] === dept).length, rl = ret.filter((x) => DEPT[x.product] === dept).length, answer = (100 * rl) / sl;
      const dimRows = PRODS.map((p) => ({ product: p, department: DEPT[p] }));
      return {
        q: `<p>The shared dim_product:</p>${rows(dimRows)}<p>fact_sales lines:</p>${table(['product'], sales.map((x) => [x.product]))}<p>fact_returns rows:</p>${table(['product'], ret.map((x) => [x.product]))}<p>Drill across: what is the number of returns per 100 sale lines for <b>${dept}</b>?</p>`,
        answer, unit: 'per 100', tol: 0.005, abs: 0.01,
        hint: `Count ${dept} sale lines and ${dept} returns separately, using the department from dim_product. Then divide.`,
        solution: steps(`${dept} sale lines: ${sl}.`, `${dept} returns: ${rl}.`, `100 × ${rl} ÷ ${sl} = <b>${n(answer, 4)}</b>.`),
        sales, ret, dept,
      };
    },
    verify: (p) => { const c = (a) => a.reduce((s, x) => s + (DEPT[x.product] === p.dept ? 1 : 0), 0); return c(p.ret) / (c(p.sales) / 100); },
  },
  'dm-role-month': {
    title: 'returns in a month, by role',
    make(r) {
      const mons = ['Oct', 'Nov', 'Dec'], t = Array.from({ length: pick(r, 5, 9) }, () => {
        const om = pick(r, 0, 1), od = pick(r, 1, 28), lag = pick(r, 1, 25), d = od + lag;
        return { order_date: `${mons[om]} ${od}`, return_date: d > 30 ? `${mons[om + 1]} ${d - 30}` : `${mons[om]} ${d}` };
      });
      const role = ['order_date', 'return_date'][pick(r, 0, 1)], answer = t.filter((x) => x[role].startsWith('Nov')).length;
      return {
        q: `<p>A returns fact with two date roles (treat every month as 30 days):</p>${rows(t)}<p>How many returns are in <b>November</b> when you count by <b>${role.replace('_', ' ')}</b>?</p>`,
        answer, unit: 'returns', tol: 0, abs: 0.01,
        hint: `Only look at the ${role.replace('_', ' ')} column. The same row can sit in November in one role and in another month in the other.`,
        solution: steps(`Rows with ${role} in Nov: <b>${answer}</b>.`, `By the other role: ${t.filter((x) => x[role === 'order_date' ? 'return_date' : 'order_date'].startsWith('Nov')).length}. Both are right; label which one a chart uses.`),
        t, role,
      };
    },
    verify: (p) => p.t.length - p.t.filter((x) => x[p.role].slice(0, 3) !== 'Nov').length,
  },
  'dm-junk-rows': {
    title: 'rows in a junk dimension',
    make(r) {
      const a = pick(r, 2, 3), b = pick(r, 2, 4), c = pick(r, 2, 5), answer = a * b * c;
      return {
        q: `<p>You fold three flags into one junk dimension built with <code>CROSS JOIN</code>: channel has <b>${a}</b> values, status has <b>${b}</b>, payment type has <b>${c}</b>.</p><p>How many rows does the junk dimension have?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'A CROSS JOIN makes every combination: multiply the counts.',
        solution: steps(`${a} × ${b} × ${c} = <b>${answer}</b> rows, keys 1 to ${answer}.`, 'The fact table carries one small flags_key instead of three text columns.'),
        a, b, c,
      };
    },
    verify: (p) => { let k = 0; for (let i = 0; i < p.a; i++) for (let j = 0; j < p.b; j++) for (let l = 0; l < p.c; l++) k++; return k; },
  },
  'dm-basket-size': {
    title: 'lines per order with a degenerate dimension',
    make(r) {
      const t = [];
      for (let o = 0; o < pick(r, 2, 5); o++) for (let j = 0; j < pick(r, 1, 4); j++) t.push({ order_id: 3300 + o, product: PRODS[(o + j) % PRODS.length] });
      const orders = new Set(t.map((x) => x.order_id)).size, answer = t.length / orders;
      return {
        q: `<p>fact_sales at line grain, with order_id kept as a degenerate dimension:</p>${rows(t)}<p>What is <code>COUNT(*) * 1.0 / COUNT(DISTINCT order_id)</code>, the average lines per order?</p>`,
        answer, unit: 'lines', tol: 0.005,
        hint: 'COUNT(*) counts lines. COUNT(DISTINCT order_id) counts orders (baskets).',
        solution: steps(`Lines: ${t.length}. Orders: ${orders}.`, `${t.length} ÷ ${orders} = <b>${n(answer, 4)}</b>.`),
        t,
      };
    },
    verify: (p) => { const by = {}; p.t.forEach((x) => { by[x.order_id] = (by[x.order_id] || 0) + 1; }); const v = Object.values(by); return v.reduce((a, b) => a + b, 0) / v.length; },
  },
  'dm-rename-rows': {
    title: 'rows changed by a rename, star vs snowflake',
    make(r) {
      const cats = ['Electronics', 'Kitchen', 'Fruit', 'Toys'], depts = ['Tech', 'Home', 'Grocery', 'Kids'];
      const catDept = cats.map((c, i) => ({ category: c, department: i < 2 ? depts[pick(r, 0, 1)] : depts[pick(r, 2, 3)] }));
      const prods = Array.from({ length: pick(r, 5, 9) }, (_, i) => ({ product_id: i + 1, category: one(r, cats) }));
      const d = catDept[0].department, answer = prods.filter((p) => catDept.find((c) => c.category === p.category).department === d).length;
      return {
        q: `<p>Snowflake tables. dim_category:</p>${rows(catDept)}<p>dim_product:</p>${rows(prods)}<p>In the <b>star</b> version, department is copied onto every product row. How many product rows change when <b>${d}</b> is renamed? (In the snowflake, 1 row changes.)</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: `Walk up the hierarchy: find the categories in ${d}, then count the products in those categories.`,
        solution: steps(`Categories in ${d}: ${catDept.filter((c) => c.department === d).map((c) => c.category).join(', ')}.`, `Products in them: <b>${answer}</b>, so the star UPDATE changes ${answer} rows.`),
        catDept, prods, d,
      };
    },
    verify: (p) => { const inD = new Set(p.catDept.filter((c) => c.department === p.d).map((c) => c.category)); return p.prods.reduce((a, x) => a + (inD.has(x.category) ? 1 : 0), 0); },
  },
};
