// Live problems for sql, part c: Modules 8-10 (see ../problems.js).
import { pick, n, steps, table, rows, code } from './util.js';

const sum = (a) => a.reduce((s, v) => s + v, 0);
const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'];

export default {
  // ---------- Module 8 ----------
  'sql-mom-growth': {
    title: 'month-over-month growth from LAG',
    make(r) {
      const k = pick(r, 3, 5), rev = Array.from({ length: k }, () => pick(r, 2000, 9000, 50)), m = months.slice(0, k);
      const prev = rev[k - 2], cur = rev[k - 1], answer = (100 * (cur - prev)) / prev;
      return {
        q: `<p>The CTE <code>monthly</code>:</p>${rows(m.map((x, i) => ({ month: x, revenue: rev[i] })))}${code('SELECT month,\n       100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))\n             / LAG(revenue) OVER (ORDER BY month) AS mom_pct\nFROM monthly')}<p>What is <code>mom_pct</code> for <b>${m[k - 1]}</b>? (A fall is negative.)</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: `LAG(revenue) on the ${m[k - 1]} row is the revenue of the row before it, ${m[k - 2]}. Growth = (new − old) ÷ old.`,
        solution: steps(`LAG gives ${prev} (the ${m[k - 2]} row).`, `(${cur} − ${prev}) ÷ ${prev} = ${n((cur - prev) / prev, 4)}.`, `× 100 = <b>${n(answer, 4)}</b> %.`),
        rev,
      };
    },
    verify: (p) => { const a = p.rev[p.rev.length - 1], b = p.rev[p.rev.length - 2]; return (a / b - 1) * 100; },
  },
  'sql-compound-growth': {
    title: 'two months of growth in a row',
    make(r) {
      const g1 = pick(r, -40, 60, 5), g2 = pick(r, -40, 60, 5), answer = ((1 + g1 / 100) * (1 + g2 / 100) - 1) * 100;
      return {
        q: `<p>Revenue changed by <b>${g1 > 0 ? '+' : ''}${g1} %</b> in March and then by <b>${g2 > 0 ? '+' : ''}${g2} %</b> in April. What is the total change from February to April, in %?</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: 'Growth multiplies, it does not add. Turn each % into a factor (+10 % is × 1.10), multiply, then turn back into a %.',
        solution: steps(`Factors: ${n(1 + g1 / 100, 4)} and ${n(1 + g2 / 100, 4)}.`, `${n(1 + g1 / 100, 4)} × ${n(1 + g2 / 100, 4)} = ${n((1 + g1 / 100) * (1 + g2 / 100), 4)}.`, `Change: <b>${n(answer, 4)}</b> % (not ${g1 + g2} %).`),
        g1, g2,
      };
    },
    verify: (p) => { const start = 1000, feb = start, apr = feb * (100 + p.g1) / 100 * (100 + p.g2) / 100; return (100 * (apr - feb)) / feb; },
  },
  'sql-cohort-retention': {
    title: 'one cell of a retention table',
    make(r) {
      const size = pick(r, 5, 8), k = pick(r, 1, 3);
      const t = Array.from({ length: size }, (_, i) => {
        const act = [0]; for (let m = 1; m <= 3; m++) if (r() < 0.45) act.push(m);
        return { customer: `C${i + 1}`, cohort: '2025-01', active_months: act.join(', ') };
      });
      const active = t.filter((x) => x.active_months.split(', ').map(Number).includes(k)).length, answer = (100 * active) / size;
      return {
        q: `<p>Every customer below started in January 2025. <code>active_months</code> lists the month numbers in which they ordered (0 = the first month).</p>${rows(t)}<p>What is the <b>month-${k}</b> retention of this cohort, in %?</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: `Count the customers whose list contains ${k}, then divide by the cohort size at month 0 (everyone).`,
        solution: steps(`Customers active in month ${k}: ${active}.`, `Cohort size at month 0: ${size}.`, `${active} ÷ ${size} × 100 = <b>${n(answer, 4)}</b> %.`),
        t, k,
      };
    },
    verify: (p) => (100 * p.t.filter((x) => x.active_months.split(', ').indexOf(String(p.k)) >= 0).length) / p.t.length,
  },
  'sql-funnel-overall': {
    title: 'overall conversion of a funnel',
    make(r) {
      const n1 = pick(r, 400, 1000, 10), n2 = Math.round(n1 * pick(r, 0.4, 0.9, 0.05)), n3 = Math.round(n2 * pick(r, 0.3, 0.9, 0.05)), n4 = Math.round(n3 * pick(r, 0.2, 0.8, 0.05));
      const answer = (100 * n4) / n1;
      return {
        q: `<p>A funnel table:</p>${table(['step', 'stage', 'n'], [[1, 'Visited', n1], [2, 'Signed up', n2], [3, 'First order', n3], [4, 'Second order', n4]])}<p>What is the <b>overall conversion</b> of step 4, in %?</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: 'Overall conversion divides a step by the FIRST step (FIRST_VALUE), not by the step before (LAG).',
        solution: steps(`${n4} ÷ ${n1} = ${n(n4 / n1, 4)}.`, `× 100 = <b>${n(answer, 4)}</b> %.`, `Check: the step rates ${n(n2 / n1, 3)} × ${n(n3 / n2, 3)} × ${n(n4 / n3, 3)} multiply to the same number.`),
        c: [n1, n2, n3, n4],
      };
    },
    verify: (p) => 100 * (p.c[1] / p.c[0]) * (p.c[2] / p.c[1]) * (p.c[3] / p.c[2]),
  },
  'sql-islands-count': {
    title: 'counting islands of days',
    make(r) {
      const days = []; for (let d = 1; d <= 20; d++) if (r() < 0.55) days.push(d);
      if (days.length < 3) days.push(21, 22, 25);
      let answer = 1; for (let i = 1; i < days.length; i++) if (days[i] !== days[i - 1] + 1) answer++;
      return {
        q: `<p>The online shop had sales on these days of March (distinct days, sorted):</p>${code(days.join(', '))}<p>Using <code>day − ROW_NUMBER()</code> as a group label, how many <b>islands</b> (runs of consecutive days) are there?</p>`,
        answer, unit: 'islands', tol: 0, abs: 0.01,
        hint: 'Inside a run, day and row number both go up by 1, so day − row number stays the same. Count how many different labels you get.',
        solution: steps(`Labels day − rn: ${days.map((d, i) => d - (i + 1)).join(', ')}.`, `Different labels: <b>${answer}</b>, so ${answer} islands.`),
        days,
      };
    },
    verify: (p) => new Set(p.days.map((d, i) => d - i - 1)).size,
  },
  'sql-ntile-score': {
    title: 'an NTILE score',
    make(r) {
      const cnt = pick(r, 7, 14), k = pick(r, 3, 5), i = pick(r, 1, cnt);
      const base = Math.floor(cnt / k), extra = cnt % k;
      let answer = 0, edge = 0; for (let b = 1; b <= k; b++) { edge += base + (b <= extra ? 1 : 0); if (i <= edge) { answer = b; break; } }
      return {
        q: `<p>${cnt} customers are sorted by spend, lowest first, and scored with <code>NTILE(${k}) OVER (ORDER BY monetary)</code>. What score does the customer in position <b>${i}</b> of that order get?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: `NTILE cuts ${cnt} rows into ${k} groups as equal as possible. When it doesn't divide evenly, the first groups get one extra row.`,
        solution: steps(`${cnt} = ${k} × ${base} + ${extra}, so the first ${extra} group(s) have ${base + 1} rows and the rest ${base}.`, `Group sizes: ${Array.from({ length: k }, (_, b) => base + (b < extra ? 1 : 0)).join(', ')}.`, `Position ${i} falls in group <b>${answer}</b>.`),
        cnt, k, i,
      };
    },
    verify: (p) => { const lab = []; for (let b = 1; b <= p.k; b++) { const size = Math.floor(p.cnt / p.k) + (b <= p.cnt % p.k ? 1 : 0); for (let j = 0; j < size; j++) lab.push(b); } return lab[p.i - 1]; },
  },
  'sql-pivot-cell': {
    title: 'one cell of a CASE pivot',
    make(r) {
      const deps = ['Grocery', 'Home', 'Toys'], t = Array.from({ length: pick(r, 6, 9) }, () => ({ department: deps[pick(r, 0, 2)], year: pick(r, 2024, 2025), revenue: pick(r, 10, 90, 5) }));
      const d = t[0].department, y = pick(r, 2024, 2025), answer = sum(t.filter((x) => x.department === d && x.year === y).map((x) => x.revenue));
      return {
        q: `<p>The long table <code>sales</code>:</p>${rows(t)}${code(`SELECT department,\n       SUM(CASE WHEN year = 2024 THEN revenue ELSE 0 END) AS rev_2024,\n       SUM(CASE WHEN year = 2025 THEN revenue ELSE 0 END) AS rev_2025\nFROM sales\nGROUP BY department`)}<p>What is <code>rev_${y}</code> on the <b>${d}</b> row?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: `Only the ${d} rows reach that group, and inside SUM the CASE lets through only year ${y}; every other row adds 0.`,
        solution: steps(`${d} rows in ${y}: ${t.filter((x) => x.department === d && x.year === y).map((x) => x.revenue).join(' + ') || 'none'}.`, `Total: <b>${answer}</b>.`),
        t, d, y,
      };
    },
    verify: (p) => { const all = p.t.filter((x) => x.department === p.d), other = all.filter((x) => x.year !== p.y); return sum(all.map((x) => x.revenue)) - sum(other.map((x) => x.revenue)); },
  },
  // ---------- Module 9 ----------
  'sql-index-reads': {
    title: 'reads for an index search',
    make(r) {
      const e = pick(r, 10, 30), size = 2 ** e - pick(r, 1, 1000), k = pick(r, 1, 50), lg = Math.ceil(Math.log2(size)), answer = lg + k;
      return {
        q: `<p>A table has <b>${size.toLocaleString('en-CA')}</b> rows, and <b>${k}</b> of them match <code>WHERE customer_id = 42</code>. With a B-tree index on customer_id, a search costs about ⌈log₂ n⌉ steps to find the first match plus one read per match. About how many reads is that?</p>`,
        answer, unit: 'reads', tol: 0, abs: 0.01,
        hint: '⌈log₂ n⌉ is how many times you can halve n before reaching 1. Then add one read per matching row.',
        solution: steps(`2<sup>${lg - 1}</sup> = ${(2 ** (lg - 1)).toLocaleString('en-CA')} < ${size.toLocaleString('en-CA')} ≤ 2<sup>${lg}</sup>, so ⌈log₂ n⌉ = ${lg}.`, `${lg} + ${k} = <b>${answer}</b> reads, against ${size.toLocaleString('en-CA')} for a full scan.`),
        size, k,
      };
    },
    verify: (p) => { let s = 0, v = 1; while (v < p.size) { v *= 2; s++; } return s + p.k; },
  },
  'sql-leftmost-prefix': {
    title: 'blocks in a composite index',
    make(r) {
      const d = pick(r, 10, 20), ns = pick(r, 3, 4), t = [];
      for (let s = 1; s <= ns; s++) {
        t.push({ store_id: s, order_day: pick(r, 1, d - 1) }); // every store has an early day, so blocks never touch
        const more = pick(r, 1, 3); for (let j = 0; j < more; j++) t.push({ store_id: s, order_day: pick(r, 1, 28) });
      }
      t.sort((a, b) => a.store_id - b.store_id || a.order_day - b.order_day);
      const answer = new Set(t.filter((x) => x.order_day >= d).map((x) => x.store_id)).size;
      return {
        q: `<p>An index on <code>(store_id, order_day)</code> keeps its entries in this order:</p>${rows(t)}<p>For <code>WHERE order_day &gt;= ${d}</code> (no store_id), the matching entries are scattered. How many separate unbroken <b>blocks</b> of the index hold them?</p>`,
        answer, unit: 'blocks', tol: 0, abs: 0.01,
        hint: 'Inside each store the days are sorted, so each store\'s matches sit together at the end of that store. Different stores are apart.',
        solution: steps(`Stores with a day ≥ ${d}: ${[...new Set(t.filter((x) => x.order_day >= d).map((x) => x.store_id))].join(', ') || 'none'}.`, `One block per such store: <b>${answer}</b>. With <code>store_id = …</code> as well, it would be one block: that is the leftmost prefix rule.`),
        t, d,
      };
    },
    verify: (p) => { let b = 0, inRun = false; for (const x of p.t) { const m = x.order_day >= p.d; if (m && !inRun) b++; inRun = m; } return b; },
  },
  'sql-int-division': {
    title: 'integer division',
    make(r) {
      const a = pick(r, 3, 95), b = pick(r, a + 1, 200), forms = ['a / b * 100', '100 * a / b', '100.0 * a / b'], f = pick(r, 0, 2);
      const expr = forms[f].replace('a', a).replace('b', b);
      const answer = f === 0 ? 0 : f === 1 ? Math.floor((100 * a) / b) : (100 * a) / b;
      return {
        q: `<p>In SQLite (or SQL Server, or PostgreSQL), what does <code>SELECT ${expr}</code> return?</p>`,
        answer, unit: '', tol: 0.0001, abs: 0.01,
        hint: 'Work left to right. An integer divided by an integer drops the fraction; once a decimal like 100.0 is involved, the fraction stays.',
        solution: f === 0 ? steps(`${a} / ${b} is integer division: ${a} is smaller than ${b}, so it gives 0.`, `0 × 100 = <b>0</b>.`)
          : f === 1 ? steps(`100 × ${a} = ${100 * a}.`, `${100 * a} / ${b} with integers drops the fraction: <b>${answer}</b>.`)
            : steps(`100.0 × ${a} = ${100 * a}.0, a decimal.`, `${100 * a}.0 / ${b} = <b>${n(answer, 5)}</b>.`),
        a, b, f,
      };
    },
    verify: (p) => { if (p.f === 0) return 0; const top = 100 * p.a; return p.f === 1 ? (top - (top % p.b)) / p.b : top / p.b; },
  },
  'sql-and-or': {
    title: 'AND before OR',
    make(r) {
      const st = ['completed', 'cancelled'], t = Array.from({ length: pick(r, 6, 10) }, () => ({ store_id: pick(r, 1, 3), status: st[r() < 0.7 ? 0 : 1] }));
      const answer = t.filter((x) => (x.status === 'completed' && x.store_id === 1) || x.store_id === 2).length;
      return {
        q: `<p>orders:</p>${rows(t)}<p>How many rows does this count? <code>SELECT COUNT(*) FROM orders WHERE status = 'completed' AND store_id = 1 OR store_id = 2</code></p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'AND binds tighter than OR, so it reads (completed AND store 1) OR store 2: every store-2 row counts, cancelled or not.',
        solution: steps(`Completed store-1 rows: ${t.filter((x) => x.status === 'completed' && x.store_id === 1).length}.`, `All store-2 rows: ${t.filter((x) => x.store_id === 2).length}.`, `Total: <b>${answer}</b>.`),
        t,
      };
    },
    verify: (p) => p.t.filter((x) => x.store_id === 2).length + p.t.filter((x) => x.store_id === 1 && x.status === 'completed').length,
  },
  'sql-transaction-rows': {
    title: 'rows after a transaction',
    make(r) {
      const t = Array.from({ length: pick(r, 5, 8) }, (_, i) => ({ product_id: 50 + i, unit_price: pick(r, 8, 40, 0.5) }));
      const cut = pick(r, 15, 30), add = pick(r, 1, 3), end = r() < 0.5 ? 'COMMIT' : 'ROLLBACK';
      const del = t.filter((x) => x.unit_price < cut).length, answer = end === 'COMMIT' ? t.length - del + add : t.length;
      return {
        q: `<p>price_list:</p>${rows(t)}${code(`BEGIN;\nDELETE FROM price_list WHERE unit_price < ${cut};\nINSERT INTO price_list (product_id, unit_price) VALUES ${Array.from({ length: add }, (_, j) => `(${70 + j}, 9.99)`).join(', ')};\n${end};\nSELECT COUNT(*) FROM price_list;`)}<p>What does the last line return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: end === 'COMMIT' ? 'COMMIT keeps every change: subtract the deleted rows and add the inserted ones.' : 'ROLLBACK throws away everything since BEGIN.',
        solution: end === 'COMMIT' ? steps(`DELETE removes ${del} row(s) with price below ${cut}.`, `INSERT adds ${add}.`, `COMMIT keeps both: ${t.length} − ${del} + ${add} = <b>${answer}</b>.`) : steps(`Inside the transaction the table changed (${t.length} − ${del} + ${add} = ${t.length - del + add} rows).`, `ROLLBACK undoes it all, so the count is back to <b>${answer}</b>.`),
        t, cut, add, end,
      };
    },
    verify: (p) => (p.end === 'ROLLBACK' ? p.t.length : p.t.filter((x) => x.unit_price >= p.cut).length + p.add),
  },
  // ---------- Module 10 ----------
  'sql-join-rows': {
    title: 'rows after joining order lines',
    make(r) {
      const o = Array.from({ length: pick(r, 4, 7) }, (_, i) => ({ order_id: 101 + i, lines: pick(r, 0, 4) }));
      const how = r() < 0.5 ? 'JOIN' : 'LEFT JOIN', answer = sum(o.map((x) => (how === 'JOIN' ? x.lines : Math.max(1, x.lines))));
      return {
        q: `<p>orders, with the number of rows each order has in order_items:</p>${rows(o)}<p>How many rows does <code>SELECT * FROM orders o ${how} order_items i ON i.order_id = o.order_id</code> give?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: how === 'JOIN' ? 'Each order is copied once per matching line; an order with 0 lines disappears from an inner join.' : 'Each order is copied once per line, and an order with 0 lines still appears once (with NULLs).',
        solution: steps(o.map((x) => (how === 'JOIN' ? x.lines : Math.max(1, x.lines))).join(' + ') + ` = <b>${answer}</b>.`, `So COUNT(*) here counts lines, not the ${o.length} orders: use COUNT(DISTINCT o.order_id) for orders.`),
        o, how,
      };
    },
    verify: (p) => p.o.reduce((a, x) => a + (x.lines === 0 ? (p.how === 'JOIN' ? 0 : 1) : x.lines), 0),
  },
  'sql-rate-not-additive': {
    title: 'combining two return rates',
    make(r) {
      const n1 = pick(r, 200, 900, 10), n2 = pick(r, 50, 300, 10), r1 = pick(r, 5, 60), r2 = pick(r, 5, 40), answer = (100 * (r1 + r2)) / (n1 + n2);
      return {
        q: `<p>Your casebook gives:</p>${table(['channel', 'completed_orders', 'orders_with_return'], [['store', n1, r1], ['online', n2, r2]])}<p>What is the overall return rate, in %?</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: 'A rate is not additive: don\'t average the two percentages. Add the counts, then divide.',
        solution: steps(`Returns: ${r1} + ${r2} = ${r1 + r2}. Orders: ${n1} + ${n2} = ${n1 + n2}.`, `${r1 + r2} ÷ ${n1 + n2} × 100 = <b>${n(answer, 4)}</b> %.`, `The plain average of ${n((100 * r1) / n1, 3)} % and ${n((100 * r2) / n2, 3)} % would be ${n((50 * r1) / n1 + (50 * r2) / n2, 3)} %: wrong.`),
        n1, n2, r1, r2,
      };
    },
    verify: (p) => { const w1 = p.n1 / (p.n1 + p.n2); return 100 * (w1 * (p.r1 / p.n1) + (1 - w1) * (p.r2 / p.n2)); },
  },
};
