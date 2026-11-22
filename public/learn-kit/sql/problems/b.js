// Live problems for sql, part b: Modules 5-7 (subqueries and CTEs, window functions, dates, text and cleaning).
// See ../problems.js. Every make(r) uses only r for its numbers; every verify works the answer out another way.
import { pick, n, steps, rows, code } from './util.js';

const sum = (a) => a.reduce((s, v) => s + v, 0);
const CUST = ['Asha', 'Ben', 'Chen', 'Dina'];
/** A tiny orders table: order_id, customer, amount (whole dollars). */
const orders = (r, k, lo = 5, hi = 90, step = 5) => Array.from({ length: k }, (_, i) => ({ order_id: 101 + i, customer: CUST[pick(r, 0, 3)], amount: pick(r, lo, hi, step) }));
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const iso = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

export default {
  // ---------- Module 5: subqueries and CTEs ----------
  'sql-scalar-above-avg': {
    title: 'rows above the average',
    make(r) {
      const t = orders(r, pick(r, 5, 7)), amts = t.map((x) => x.amount), avg = sum(amts) / amts.length;
      const answer = amts.filter((a) => a > avg).length;
      return {
        q: `<p>The table mini:</p>${rows(t)}${code('SELECT COUNT(*)\nFROM mini\nWHERE amount > (SELECT AVG(amount) FROM mini)')}<p>What number does it return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Inside first: the subquery gives one number, the average. Then count the rows whose amount is strictly bigger.',
        solution: steps(`Average = ${sum(amts)} ÷ ${amts.length} = ${n(avg, 4)}.`, `Amounts above it: ${amts.filter((a) => a > avg).join(', ') || 'none'}.`, `Count: <b>${answer}</b>.`),
        amts,
      };
    },
    // a > mean  ⟺  a × count > total, so no division is needed.
    verify: (p) => { const tot = p.amts.reduce((s, v) => s + v, 0); let c = 0; for (const a of p.amts) if (a * p.amts.length > tot) c++; return c; },
  },
  'sql-in-semi-count': {
    title: 'IN keeps each row once',
    make(r) {
      const cust = [1, 2, 3, 4, 5].map((id) => ({ id, name: ['Asha', 'Ben', 'Chen', 'Dina', 'Eli'][id - 1] }));
      const o = Array.from({ length: pick(r, 5, 8) }, (_, i) => ({ order_id: 101 + i, customer_id: [1, 1, 2, 3, 3, 4, 9][pick(r, 0, 6)] }));
      const ids = new Set(o.map((x) => x.customer_id)), kept = cust.filter((c) => ids.has(c.id)), answer = kept.length;
      const joinRows = o.filter((x) => x.customer_id <= 5).length;
      return {
        q: `<p>customers has ids 1 to 5. orders:</p>${rows(o)}${code('SELECT COUNT(*)\nFROM customers\nWHERE id IN (SELECT customer_id FROM orders)')}<p>What number does it return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'IN asks "is this customer on the list?" once per customer. Repeats on the list do not matter, and 9 is not a customer.',
        solution: steps(`The list is ${[...ids].sort((a, b) => a - b).join(', ')}.`, `Customers on it: ${kept.map((c) => c.id).join(', ') || 'none'}.`, `Count: <b>${answer}</b>. (An inner join would give ${joinRows} rows, one per matching order.)`),
        o,
      };
    },
    verify: (p) => [1, 2, 3, 4, 5].filter((id) => p.o.some((x) => x.customer_id === id)).length,
  },
  'sql-not-in-null': {
    title: 'the NOT IN NULL trap',
    make(r) {
      const o = Array.from({ length: pick(r, 4, 6) }, (_, i) => ({ order_id: 101 + i, customer_id: [1, 2, 3, null][pick(r, 0, 3)] }));
      if (pick(r, 0, 1) === 1) o[o.length - 1].customer_id = 3;
      const hasNull = o.some((x) => x.customer_id == null), ids = new Set(o.map((x) => x.customer_id));
      const answer = hasNull ? 0 : [1, 2, 3, 4, 5].filter((id) => !ids.has(id)).length;
      return {
        q: `<p>customers has ids 1 to 5. orders:</p>${rows(o)}${code('SELECT COUNT(*)\nFROM customers\nWHERE id NOT IN (SELECT customer_id FROM orders)')}<p>What number does it return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Look for a NULL on the list. "id NOT IN (1, NULL)" means "id <> 1 AND id <> NULL", and anything compared with NULL is unknown, never true.',
        solution: hasNull
          ? steps('The list contains a NULL.', 'For every customer, "id <> NULL" is unknown, so the whole NOT IN is never true.', 'Count: <b>0</b>. NOT EXISTS would have found the customers with no orders.')
          : steps(`No NULL on the list: it is ${[...ids].sort((a, b) => a - b).join(', ')}.`, `Customers not on it: ${[1, 2, 3, 4, 5].filter((id) => !ids.has(id)).join(', ')}.`, `Count: <b>${answer}</b>.`),
        o,
      };
    },
    verify: (p) => (p.o.filter((x) => x.customer_id === null || x.customer_id === undefined).length ? 0 : 5 - new Set(p.o.map((x) => x.customer_id).filter((v) => v <= 5)).size),
  },
  'sql-correlated-above-own': {
    title: 'above their own average',
    make(r) {
      const t = orders(r, pick(r, 5, 8));
      const avgOf = (c) => { const a = t.filter((x) => x.customer === c).map((x) => x.amount); return sum(a) / a.length; };
      const keep = t.filter((x) => x.amount > avgOf(x.customer)), answer = keep.length;
      const custs = [...new Set(t.map((x) => x.customer))];
      return {
        q: `<p>The table o:</p>${rows(t)}${code('SELECT COUNT(*)\nFROM o\nWHERE amount > (SELECT AVG(o2.amount)\n                FROM o o2\n                WHERE o2.customer = o.customer)')}<p>What number does it return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: "The subquery is worked out again for every row, using that row's customer. Compare each order with its own customer's average.",
        solution: steps(custs.map((c) => `${c}: average ${n(avgOf(c), 4)}`).join('; ') + '.', `Orders above their own average: ${keep.map((x) => x.order_id).join(', ') || 'none'}.`, `Count: <b>${answer}</b>.`),
        t,
      };
    },
    verify: (p) => { const g = {}; for (const x of p.t) { g[x.customer] ??= [0, 0]; g[x.customer][0] += x.amount; g[x.customer][1]++; } return p.t.filter((x) => x.amount * g[x.customer][1] > g[x.customer][0]).length; },
  },
  'sql-cte-band-count': {
    title: 'counting customers in a CTE step',
    make(r) {
      const t = orders(r, pick(r, 6, 9), 10, 120, 10), cut = pick(r, 80, 160, 20);
      const tot = {}; t.forEach((x) => { tot[x.customer] = (tot[x.customer] ?? 0) + x.amount; });
      const answer = Object.values(tot).filter((v) => v >= cut).length;
      return {
        q: `<p>The table o:</p>${rows(t)}${code(`WITH spend AS (\n  SELECT customer, SUM(amount) AS total\n  FROM o\n  GROUP BY customer\n)\nSELECT COUNT(*) FROM spend WHERE total >= ${cut}`)}<p>What number does it return?</p>`,
        answer, unit: 'customers', tol: 0, abs: 0.01,
        hint: 'Do the CTE first: one row per customer with their total. Then count the rows of spend that reach the cut-off.',
        solution: steps(`spend: ${Object.entries(tot).map(([c, v]) => `${c} ${v}`).join(', ')}.`, `Totals of ${cut} or more: ${Object.values(tot).filter((v) => v >= cut).join(', ') || 'none'}.`, `Count: <b>${answer}</b>.`),
        t, cut,
      };
    },
    verify: (p) => CUST.filter((c) => { const s = p.t.filter((x) => x.customer === c).reduce((a, x) => a + x.amount, 0); return s > 0 && s >= p.cut; }).length,
  },
  'sql-recursive-rows': {
    title: 'how many rows a recursive CTE makes',
    make(r) {
      const a = pick(r, 1, 5), s = pick(r, 1, 3), b = pick(r, 10, 30);
      const answer = a >= b ? 1 : Math.ceil((b - a) / s) + 1, last = a + (answer - 1) * s;
      return {
        q: `${code(`WITH RECURSIVE nums(x) AS (\n  SELECT ${a}\n  UNION ALL\n  SELECT x + ${s} FROM nums WHERE x < ${b}\n)\nSELECT COUNT(*) FROM nums`)}<p>What number does it return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: `The anchor makes ${a}. Each round adds ${s} to the last row, but only if that last row is still below ${b}. Note the last row made can be ${b} or more.`,
        solution: steps(`Rows: ${a}, ${a + s}, ${a + 2 * s}, ... up to ${last}.`, `${last} is the first value that is not below ${b} (or the step stops after it), so nothing more is made.`, `Count: <b>${answer}</b>.`),
        a, s, b,
      };
    },
    verify: (p) => { let x = p.a, c = 1; while (x < p.b) { x += p.s; c++; } return c; },
  },
  // ---------- Module 6: window functions ----------
  'sql-over-partition': {
    title: 'a partition total on one row',
    make(r) {
      const t = orders(r, pick(r, 5, 7)), k = pick(r, 0, t.length - 1), c = t[k].customer;
      const answer = sum(t.filter((x) => x.customer === c).map((x) => x.amount));
      return {
        q: `<p>The table o:</p>${rows(t)}${code('SELECT order_id, amount,\n       SUM(amount) OVER (PARTITION BY customer) AS cust_total\nFROM o')}<p>What is cust_total on order <b>${t[k].order_id}</b>?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: `The window for this row holds only ${c}'s orders. Add their amounts; no rows are merged.`,
        solution: steps(`${c}'s orders: ${t.filter((x) => x.customer === c).map((x) => x.amount).join(' + ')}.`, `= <b>${answer}</b>, shown on every one of ${c}'s rows.`),
        t, k,
      };
    },
    verify: (p) => p.t.reduce((a, x) => a + (x.customer === p.t[p.k].customer ? x.amount : 0), 0),
  },
  'sql-rank-ties': {
    title: 'RANK or DENSE_RANK with ties',
    make(r) {
      const t = Array.from({ length: pick(r, 5, 7) }, (_, i) => ({ order_id: 101 + i, amount: [20, 45, 45, 60, 90, 20, 5][pick(r, 0, 6)] }));
      const k = pick(r, 0, t.length - 1), fn = ['RANK', 'DENSE_RANK'][pick(r, 0, 1)], v = t[k].amount;
      const ahead = t.filter((x) => x.amount > v), answer = 1 + (fn === 'RANK' ? ahead.length : new Set(ahead.map((x) => x.amount)).size);
      return {
        q: `<p>The table o:</p>${rows(t)}${code(`SELECT order_id, amount,\n       ${fn}() OVER (ORDER BY amount DESC) AS r\nFROM o`)}<p>What is r on order <b>${t[k].order_id}</b>?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: fn === 'RANK' ? 'RANK = 1 + the number of rows with a strictly bigger amount. Ties share a number and leave a gap.' : 'DENSE_RANK = 1 + the number of different amounts that are bigger. Ties share a number, no gaps.',
        solution: steps(`Amounts above ${v}: ${ahead.map((x) => x.amount).join(', ') || 'none'}.`, fn === 'RANK' ? `${ahead.length} rows ahead, so RANK = <b>${answer}</b>.` : `${answer - 1} different values ahead, so DENSE_RANK = <b>${answer}</b>.`),
        t, k, fn,
      };
    },
    verify: (p) => {
      const v = p.t[p.k].amount, sorted = p.t.map((x) => x.amount).sort((a, b) => b - a);
      if (p.fn === 'RANK') return sorted.indexOf(v) + 1;
      return [...new Set(sorted)].indexOf(v) + 1;
    },
  },
  'sql-top-n-sum': {
    title: 'top N per group',
    make(r) {
      const t = Array.from({ length: pick(r, 6, 9) }, (_, i) => ({ emp: i + 1, store: ['S1', 'S2'][pick(r, 0, 1)], salary: pick(r, 40, 95, 1) * 1000 }));
      const N = pick(r, 1, 2);
      const kept = ['S1', 'S2'].flatMap((s) => t.filter((x) => x.store === s).sort((a, b) => b.salary - a.salary || a.emp - b.emp).slice(0, N));
      const answer = sum(kept.map((x) => x.salary));
      return {
        q: `<p>The table staff:</p>${rows(t)}${code(`WITH ranked AS (\n  SELECT store, salary,\n         ROW_NUMBER() OVER (PARTITION BY store ORDER BY salary DESC, emp) AS rn\n  FROM staff\n)\nSELECT SUM(salary) FROM ranked WHERE rn <= ${N}`)}<p>What number does it return?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: `Number the rows inside each store from the highest salary down. Keep numbers 1${N === 2 ? ' and 2' : ''} in each store, then add up.`,
        solution: steps(`Kept: ${kept.map((x) => `${x.store} ${x.salary}`).join(', ')}.`, `Sum = <b>${answer}</b>.`),
        t, N,
      };
    },
    verify: (p) => { let s = 0; for (const x of p.t) { const better = p.t.filter((y) => y.store === x.store && (y.salary > x.salary || (y.salary === x.salary && y.emp < x.emp))).length; if (better < p.N) s += x.salary; } return s; },
  },
  'sql-lag-pct': {
    title: 'percentage change with LAG',
    make(r) {
      const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], t = Array.from({ length: pick(r, 4, 6) }, (_, i) => ({ month: mon[i], sales: pick(r, 200, 900, 10) }));
      const k = pick(r, 1, t.length - 1), prev = t[k - 1].sales, answer = (100 * (t[k].sales - prev)) / prev;
      return {
        q: `<p>The table monthly:</p>${rows(t)}${code('SELECT month, sales,\n       100.0 * (sales - LAG(sales) OVER (ORDER BY m)) / LAG(sales) OVER (ORDER BY m) AS pct\nFROM monthly')}<p>(m is the month number.) What is pct for <b>${t[k].month}</b>, in %?</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: 'LAG brings the previous month onto this row. Change ÷ the previous value × 100.',
        solution: steps(`LAG(sales) on ${t[k].month} = ${prev} (${t[k - 1].month}).`, `(${t[k].sales} − ${prev}) ÷ ${prev} × 100 = <b>${n(answer, 4)}</b> %.`),
        t, k,
      };
    },
    verify: (p) => (p.t[p.k].sales / p.t[p.k - 1].sales - 1) * 100,
  },
  'sql-running-total': {
    title: 'a running total',
    make(r) {
      const t = Array.from({ length: pick(r, 5, 7) }, (_, i) => ({ day: iso(2024, 12, i + 1), sales: pick(r, 50, 400, 10) }));
      const k = pick(r, 1, t.length - 1), answer = sum(t.slice(0, k + 1).map((x) => x.sales));
      return {
        q: `<p>The table daily:</p>${rows(t)}${code('SELECT day, sales,\n       SUM(sales) OVER (ORDER BY day ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running\nFROM daily')}<p>What is running on <b>${t[k].day}</b>?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'The frame runs from the first day down to this row. Add every sales value from the top to here.',
        solution: steps(`${t.slice(0, k + 1).map((x) => x.sales).join(' + ')}`, `= <b>${answer}</b>.`),
        t, k,
      };
    },
    // total of everything minus what comes after this row
    verify: (p) => p.t.reduce((a, x) => a + x.sales, 0) - p.t.slice(p.k + 1).reduce((a, x) => a + x.sales, 0),
  },
  'sql-range-ties': {
    title: 'the default frame with ties',
    make(r) {
      const t = Array.from({ length: pick(r, 5, 7) }, (_, i) => ({ order_id: 101 + i, amount: [5, 20, 45, 45, 60, 20][pick(r, 0, 5)] }));
      const k = pick(r, 0, t.length - 1), v = t[k].amount, answer = sum(t.filter((x) => x.amount <= v).map((x) => x.amount));
      return {
        q: `<p>The table o:</p>${rows(t)}${code('SELECT order_id, amount,\n       SUM(amount) OVER (ORDER BY amount) AS running\nFROM o')}<p>No frame is written, so the default RANGE frame is used. What is running on order <b>${t[k].order_id}</b>?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'RANGE treats rows with the same amount as one step: the sum includes every row whose amount is less than or equal to this one, ties included.',
        solution: steps(`Amounts ≤ ${v}: ${t.filter((x) => x.amount <= v).map((x) => x.amount).join(' + ')}.`, `= <b>${answer}</b>. Rows tied on ${v} all show the same value.`),
        t, k,
      };
    },
    verify: (p) => { const v = p.t[p.k].amount; return p.t.reduce((a, x) => a + x.amount, 0) - p.t.filter((x) => x.amount > v).reduce((a, x) => a + x.amount, 0); },
  },
  'sql-moving-avg': {
    title: 'a 3-row moving average',
    make(r) {
      const t = Array.from({ length: pick(r, 5, 7) }, (_, i) => ({ day: iso(2024, 12, i + 1), sales: pick(r, 60, 360, 6) }));
      const k = pick(r, 0, t.length - 1), win = t.slice(Math.max(0, k - 2), k + 1).map((x) => x.sales), answer = sum(win) / win.length;
      return {
        q: `<p>The table daily:</p>${rows(t)}${code('SELECT day, sales,\n       AVG(sales) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS avg3\nFROM daily')}<p>What is avg3 on <b>${t[k].day}</b>?</p>`,
        answer, unit: '', tol: 0.001, abs: 0.01,
        hint: 'The frame is this row and up to 2 rows before it. Near the top there are fewer rows, and AVG divides by how many are really there.',
        solution: steps(`Frame: ${win.join(', ')} (${win.length} row${win.length > 1 ? 's' : ''}).`, `${sum(win)} ÷ ${win.length} = <b>${n(answer, 5)}</b>.`),
        t, k,
      };
    },
    verify: (p) => { let s = 0, c = 0; for (let i = 0; i < p.t.length; i++) if (i <= p.k && i >= p.k - 2) { s += p.t[i].sales; c++; } return s / c; },
  },
  'sql-share-of-group': {
    title: 'share of a group',
    make(r) {
      const t = [];
      for (const yr of [2024, 2025]) for (const ch of ['online', 'store']) t.push({ yr, channel: ch, sales: pick(r, 100, 900, 10) });
      const k = pick(r, 0, 3), tot = sum(t.filter((x) => x.yr === t[k].yr).map((x) => x.sales)), answer = (100 * t[k].sales) / tot;
      return {
        q: `<p>The table c:</p>${rows(t)}${code('SELECT yr, channel, sales,\n       100.0 * sales / SUM(sales) OVER (PARTITION BY yr) AS pct_of_year\nFROM c')}<p>What is pct_of_year for <b>${t[k].channel} ${t[k].yr}</b>, in %?</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: `The window holds only the ${t[k].yr} rows. Divide this row's sales by their sum.`,
        solution: steps(`${t[k].yr} total = ${tot}.`, `${t[k].sales} ÷ ${tot} × 100 = <b>${n(answer, 4)}</b> %.`),
        t, k,
      };
    },
    // the shares of one year add up to 100, so this row's share is 100 minus the other row's share
    verify: (p) => { const me = p.t[p.k], other = p.t.find((x) => x.yr === me.yr && x !== me); return 100 - (100 * other.sales) / (other.sales + me.sales); },
  },
  'sql-ntile-size': {
    title: 'rows in an NTILE bucket',
    make(r) {
      const rowsN = pick(r, 7, 30), k = pick(r, 3, 6), j = pick(r, 1, k);
      const base = Math.floor(rowsN / k), extra = rowsN % k, answer = base + (j <= extra ? 1 : 0);
      return {
        q: `<p>A table has <b>${rowsN}</b> rows. You run <code>NTILE(${k}) OVER (ORDER BY amount)</code>. How many rows land in bucket <b>${j}</b>?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: `Share ${rowsN} rows as evenly as possible into ${k} buckets. If it does not divide exactly, the first buckets get one extra row each.`,
        solution: steps(`${rowsN} ÷ ${k} = ${base} remainder ${extra}.`, extra ? `Buckets 1 to ${extra} get ${base + 1} rows; the rest get ${base}.` : `Every bucket gets ${base}.`, `Bucket ${j}: <b>${answer}</b>.`),
        rowsN, k, j,
      };
    },
    // deal the rows one by one, filling bucket 1 first, the way NTILE does
    verify: (p) => { const sizes = Array(p.k).fill(0); let left = p.rowsN; for (let b = 0; b < p.k; b++) { sizes[b] = Math.ceil(left / (p.k - b)); left -= sizes[b]; } return sizes[p.j - 1]; },
  },
  // ---------- Module 7: dates, text and cleaning ----------
  'sql-days-between': {
    title: 'days between two dates',
    make(r) {
      const m1 = pick(r, 1, 11), d1 = pick(r, 1, 28), m2 = pick(r, m1 + 1, 12), d2 = pick(r, 1, 28);
      const a = iso(2025, m1, d1), b = iso(2025, m2, d2), answer = (Date.UTC(2025, m2 - 1, d2) - Date.UTC(2025, m1 - 1, d1)) / 864e5;
      return {
        q: `${code(`SELECT julianday('${b}') - julianday('${a}')`)}<p>What number does it return? (2025 is not a leap year.)</p>`,
        answer, unit: 'days', tol: 0, abs: 0.01,
        hint: 'julianday turns each date into a day number, so the difference is the number of days between them. Count the rest of the first month, the whole months in between, then the days into the last month.',
        solution: steps(`Rest of month ${m1}: ${DAYS[m1 - 1]} − ${d1} = ${DAYS[m1 - 1] - d1}.`, `Whole months between: ${sum(DAYS.slice(m1, m2 - 1))} days.`, `Plus ${d2} days into month ${m2}: total <b>${answer}</b>.`),
        m1, d1, m2, d2,
      };
    },
    verify: (p) => DAYS[p.m1 - 1] - p.d1 + DAYS.slice(p.m1, p.m2 - 1).reduce((s, v) => s + v, 0) + p.d2,
  },
  'sql-trim-groups': {
    title: 'groups after cleaning text',
    make(r) {
      const variants = ['Toronto', 'Toronto ', 'toronto', ' Toronto', 'TORONTO', 'Ottawa', 'Ottawa ', 'ottawa', 'Hamilton', 'Hamilton '];
      const vals = Array.from({ length: pick(r, 5, 8) }, () => variants[pick(r, 0, variants.length - 1)]);
      const f = ['city', 'TRIM(city)', 'LOWER(TRIM(city))'][pick(r, 0, 2)];
      const fn = { city: (s) => s, 'TRIM(city)': (s) => s.trim(), 'LOWER(TRIM(city))': (s) => s.trim().toLowerCase() }[f];
      const answer = new Set(vals.map(fn)).size;
      const shown = vals.map((v) => ({ city: `'${v.replace(/ /g, '&nbsp;')}'` }));
      return {
        q: `<p>The column city (quotes added so you can see the spaces):</p>${rows(shown)}${code(`SELECT ${f}, COUNT(*)\nFROM t\nGROUP BY ${f}`)}<p>How many rows does it return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'GROUP BY puts values in the same group only if they are exactly equal after the function. A space or a capital letter is a difference.',
        solution: steps(`After ${f} the values are: ${[...new Set(vals.map(fn))].map((v) => `'${v.replace(/ /g, '&nbsp;')}'`).join(', ')}.`, `That is <b>${answer}</b> different values, so ${answer} groups.`),
        vals, f,
      };
    },
    verify: (p) => { const seen = []; for (const v of p.vals) { let k = v; if (p.f !== 'city') k = k.replace(/^\s+|\s+$/g, ''); if (p.f === 'LOWER(TRIM(city))') k = k.toLowerCase(); if (!seen.includes(k)) seen.push(k); } return seen.length; },
  },
  'sql-int-division': {
    title: 'whole-number division',
    make(r) {
      const a = pick(r, 3, 60), b = pick(r, 70, 400), answer = Math.floor((100 * a) / b);
      return {
        q: `<p>A shop had <b>${a}</b> returns out of <b>${b}</b> orders, both stored as INTEGER.</p>${code(`SELECT 100 * returns / orders FROM t`)}<p>What does SQLite (or SQL Server) show?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Work left to right: 100 × returns is an integer, then integer ÷ integer drops the fraction.',
        solution: steps(`100 × ${a} = ${100 * a}.`, `${100 * a} ÷ ${b} = ${n((100 * a) / b, 4)}, and the fraction is dropped: <b>${answer}</b>.`, `Writing 100.0 gives the true ${n((100 * a) / b, 4)} %.`),
        a, b,
      };
    },
    verify: (p) => (100 * p.a - ((100 * p.a) % p.b)) / p.b,
  },
  'sql-dedupe-removed': {
    title: 'rows removed by a dedupe',
    make(r) {
      const pool = ['asha@x.ca', 'ASHA@x.ca', 'ben@x.ca', 'Ben@x.ca', 'chen@x.ca', 'dina@x.ca', null];
      const emails = Array.from({ length: pick(r, 6, 9) }, () => pool[pick(r, 0, pool.length - 1)]);
      const t = emails.map((e, i) => ({ id: i + 1, email: e }));
      const nulls = emails.filter((e) => e == null).length, real = emails.filter((e) => e != null);
      const answer = real.length - new Set(real.map((e) => e.toLowerCase())).size + Math.max(0, nulls - 1);
      return {
        q: `<p>The table people:</p>${rows(t)}${code('WITH r AS (\n  SELECT id, ROW_NUMBER() OVER (PARTITION BY LOWER(email) ORDER BY id) AS rn\n  FROM people\n)\nSELECT COUNT(*) FROM r WHERE rn > 1')}<p>How many rows would this dedupe throw away?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Each LOWER(email) value is one partition; every row after the first in a partition has rn > 1. Watch out: all the NULL emails fall into one partition together.',
        solution: steps(`Real emails: ${real.length} rows, ${new Set(real.map((e) => e.toLowerCase())).size} different after LOWER, so ${real.length - new Set(real.map((e) => e.toLowerCase())).size} extra.`, `NULL emails: ${nulls}, all in one partition, so ${Math.max(0, nulls - 1)} more thrown away${nulls > 1 ? ' (the NULL trap)' : ''}.`, `Total: <b>${answer}</b>.`),
        t,
      };
    },
    verify: (p) => { const g = new Map(); for (const x of p.t) { const k = x.email == null ? '\u0000null' : x.email.toLowerCase(); g.set(k, (g.get(k) ?? 0) + 1); } let s = 0; for (const v of g.values()) s += v - 1; return s; },
  },
  'sql-dq-orphans': {
    title: 'a data quality count',
    make(r) {
      const o = Array.from({ length: pick(r, 6, 9) }, (_, i) => ({ order_id: 101 + i, customer_id: [1, 2, 3, 4, 7, 8, null][pick(r, 0, 6)] }));
      const kind = ['orphans', 'missing'][pick(r, 0, 1)];
      const answer = kind === 'missing' ? o.filter((x) => x.customer_id == null).length : o.filter((x) => x.customer_id != null && x.customer_id > 5).length;
      const sqlText = kind === 'missing'
        ? 'SELECT COUNT(*) - COUNT(customer_id) AS missing\nFROM orders'
        : 'SELECT COUNT(*) AS orphans\nFROM orders o\nWHERE o.customer_id IS NOT NULL\n  AND NOT EXISTS (SELECT 1 FROM customers c\n                  WHERE c.id = o.customer_id)';
      return {
        q: `<p>customers has ids 1 to 5. orders:</p>${rows(o)}${code(sqlText)}<p>What number does the check return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: kind === 'missing' ? 'COUNT(*) counts every row; COUNT(customer_id) skips NULLs. The difference is the number of blanks.' : 'An orphan has a customer_id that is filled in but matches no customer. NULLs are left out on purpose (guest orders).',
        solution: kind === 'missing'
          ? steps(`${o.length} rows, ${o.length - answer} with a customer_id.`, `${o.length} − ${o.length - answer} = <b>${answer}</b>.`)
          : steps(`Filled-in ids with no customer: ${o.filter((x) => x.customer_id > 5).map((x) => x.customer_id).join(', ') || 'none'}.`, `Count: <b>${answer}</b>.`),
        o, kind,
      };
    },
    verify: (p) => p.o.reduce((a, x) => a + (p.kind === 'missing' ? (x.customer_id === null ? 1 : 0) : ([1, 2, 3, 4, 5].includes(x.customer_id) || x.customer_id === null ? 0 : 1)), 0),
  },
};
