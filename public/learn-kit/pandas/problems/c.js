// Live problems for Python pandas for analysis, part c: Modules 7-9 (see ../problems.js).
import { pick, n, steps, table } from './util.js';

const sum = (a) => a.reduce((s, v) => s + v, 0);
const mean = (a) => sum(a) / a.length;
const code = (s) => `<pre class="lk-code"><code>${s}</code></pre>`;
const iso = (d) => d.toISOString().slice(0, 10);
const day = (y, m, d) => new Date(Date.UTC(y, m, d));

export default {
  // ---------- Module 7 ----------
  'pd-daily-mean': {
    title: 'the daily average with quiet days',
    make(r) {
      const days = pick(r, 5, 8), sales = Array.from({ length: days }, () => (r() < 0.3 ? 0 : pick(r, 20, 90, 5)));
      if (sales.every((x) => x === 0)) sales[0] = 40;
      if (!sales.includes(0)) sales[days - 1] = 0;
      const shown = sales.map((v, i) => [iso(day(2026, 2, i + 1)), v]).filter((x) => x[1] > 0), answer = mean(sales);
      return {
        q: `<p>Daily totals from <code>groupby('date')</code> (days with no sales have no row):</p>${table(['date', 'revenue'], shown)}<p>The period runs from 2026-03-01 to 2026-03-${String(days).padStart(2, '0')}. What is the mean after <code>.asfreq('D', fill_value=0)</code>?</p>`,
        answer, unit: '', tol: 0.001,
        hint: `asfreq adds the missing days as 0, so divide the total by all ${days} days.`,
        solution: steps(`Total = ${sum(sales)} over ${days} days (${days - shown.length} with no sales).`, `${sum(sales)} ÷ ${days} = <b>${n(answer, 4)}</b>.`, `Without the quiet days it would wrongly be ${n(sum(sales) / shown.length, 4)}.`),
        sales,
      };
    },
    verify: (p) => p.sales.reduce((a, b) => a + b, 0) / p.sales.length,
  },
  'pd-resample-month': {
    title: 'a monthly total from daily rows',
    make(r) {
      const start = pick(r, 26, 29), k = pick(r, 4, 7), rows = Array.from({ length: k }, (_, i) => [day(2026, 2, start + i), pick(r, 10, 80, 5)]);
      const answer = sum(rows.filter((x) => x[0].getUTCMonth() === 3).map((x) => x[1]));
      return {
        q: `<p>A daily series:</p>${table(['date', 'revenue'], rows.map((x) => [iso(x[0]), x[1]]))}<p>What is the April value of <code>daily.resample('MS').sum()</code>?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'March has 31 days. Add only the rows dated in April.',
        solution: steps(`April rows: ${rows.filter((x) => x[0].getUTCMonth() === 3).map((x) => x[1]).join(' + ') || 'none'}.`, `Sum = <b>${answer}</b>. (A partial month: only ${rows.filter((x) => x[0].getUTCMonth() === 3).length} day(s) so far.)`),
        rows: rows.map((x) => [iso(x[0]), x[1]]),
      };
    },
    verify: (p) => p.rows.reduce((a, [d, v]) => a + (d.slice(5, 7) === '04' ? v : 0), 0),
  },
  'pd-rolling-mean': {
    title: 'one value of a rolling average',
    make(r) {
      const v = Array.from({ length: pick(r, 6, 9) }, () => pick(r, 5, 30)), w = pick(r, 3, 4), k = pick(r, w - 1, v.length - 1), win = v.slice(k - w + 1, k + 1), answer = mean(win);
      return {
        q: `${code(`s = pd.Series([${v.join(', ')}])\ns.rolling(${w}).mean()`)}<p>What is the value at position <b>${k}</b> (counting from 0)?</p>`,
        answer, unit: '', tol: 0.001,
        hint: `Average position ${k} and the ${w - 1} before it.`,
        solution: steps(`Window: positions ${k - w + 1} to ${k} = ${win.join(', ')}.`, `${sum(win)} ÷ ${w} = <b>${n(answer, 4)}</b>.`),
        v, w, k,
      };
    },
    verify: (p) => { let s = 0; for (let i = p.k; i > p.k - p.w; i--) s += p.v[i]; return s / p.w; },
  },
  'pd-pct-change': {
    title: 'growth with pct_change',
    make(r) {
      const v = Array.from({ length: pick(r, 4, 6) }, () => pick(r, 100, 400, 10)), k = pick(r, 1, v.length - 1), answer = (v[k] / v[k - 1] - 1) * 100;
      return {
        q: `${code(`s = pd.Series([${v.join(', ')}])\ns.pct_change() * 100`)}<p>What is the value at position <b>${k}</b>, in %?</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.001,
        hint: 'pct_change = this ÷ previous − 1.',
        solution: steps(`${v[k]} ÷ ${v[k - 1]} = ${n(v[k] / v[k - 1], 5)}.`, `− 1, × 100 = <b>${n(answer, 4)}</b> %.`),
        v, k,
      };
    },
    verify: (p) => (100 * (p.v[p.k] - p.v[p.k - 1])) / p.v[p.k - 1],
  },
  'pd-fiscal-year': {
    title: 'which fiscal year?',
    make(r) {
      const end = [3, 6, 9][pick(r, 0, 2)], names = { 3: 'MAR', 6: 'JUN', 9: 'SEP' }, d = day(pick(r, 2025, 2027), pick(r, 0, 11), pick(r, 1, 28));
      const m = d.getUTCMonth() + 1, answer = d.getUTCFullYear() + (m > end ? 1 : 0);
      return {
        q: `<p>Your fiscal year ends in month <b>${end}</b>, and is named after the calendar year it ends in. What does <code>pd.Timestamp('${iso(d)}').to_period('Q-${names[end]}').qyear</code> give?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: `Dates after the end month belong to the fiscal year that ends next calendar year.`,
        solution: steps(`Month ${m} is ${m > end ? 'after' : 'on or before'} month ${end}.`, `So it is in the fiscal year ending in ${answer}: <b>${answer}</b>.`),
        y: d.getUTCFullYear(), m, end,
      };
    },
    verify: (p) => (p.m <= p.end ? p.y : p.y + 1),
  },
  // ---------- Module 8 ----------
  'pd-chain-result': {
    title: 'follow a chain',
    make(r) {
      const t = Array.from({ length: pick(r, 5, 8) }, () => ({ store: ['S01', 'S02'][pick(r, 0, 1)], qty: pick(r, 1, 5), price: pick(r, 2, 10) })), k = pick(r, 2, 3), s = t[0].store;
      const answer = sum(t.filter((x) => x.qty >= k && x.store === s).map((x) => x.qty * x.price));
      return {
        q: `<p>df:</p>${table(['', 'store', 'qty', 'price'], t.map((x, i) => [i, x.store, x.qty, x.price]))}${code(`(df.query('qty >= ${k}')\n   .assign(revenue=lambda d: d.qty * d.price)\n   .groupby('store')['revenue'].sum())`)}<p>What is the value for <b>${s}</b>? (0 if no rows are left for it.)</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: `Step by step: keep rows with qty ≥ ${k}, compute qty × price, then add up the ${s} rows.`,
        solution: steps(`Kept ${s} rows: ${t.map((x, i) => (x.qty >= k && x.store === s ? `${i} (${x.qty} × ${x.price})` : null)).filter(Boolean).join(', ') || 'none'}.`, `Sum = <b>${answer}</b>.`),
        t, k, s,
      };
    },
    verify: (p) => p.t.reduce((a, x) => a + (x.store === p.s && !(x.qty < p.k) ? x.price * x.qty : 0), 0),
  },
  'pd-aov': {
    title: 'average order value from lines',
    make(r) {
      const lines = [];
      const orders = pick(r, 3, 5);
      for (let o = 1; o <= orders; o++) for (let j = pick(r, 1, 3); j > 0; j--) lines.push([o, pick(r, 5, 60, 5)]);
      const answer = sum(lines.map((x) => x[1])) / orders;
      return {
        q: `<p>Order lines:</p>${table(['order_id', 'revenue'], lines)}<p>What is the average order value (<code>revenue.sum() / order_id.nunique()</code>)?</p>`,
        answer, unit: '', tol: 0.001,
        hint: 'Count distinct orders, not lines.',
        solution: steps(`Revenue = ${sum(lines.map((x) => x[1]))}; orders = ${orders} (lines = ${lines.length}).`, `${sum(lines.map((x) => x[1]))} ÷ ${orders} = <b>${n(answer, 4)}</b>.`, `The mean line value, ${n(mean(lines.map((x) => x[1])), 4)}, is a different number.`),
        lines,
      };
    },
    verify: (p) => p.lines.reduce((a, x) => a + x[1], 0) / new Set(p.lines.map((x) => x[0])).size,
  },
  'pd-abc-count': {
    title: 'how many A items?',
    make(r) {
      const v = Array.from({ length: pick(r, 5, 8) }, () => pick(r, 2, 60)).sort((a, b) => b - a), tot = sum(v);
      let c = 0, answer = 0;
      for (const x of v) { if (c / tot < 0.8) answer++; c += x; }
      return {
        q: `<p>Revenue by product, sorted: <b>${v.join(', ')}</b>. An item is class A if the cumulative share <i>before</i> it is under 80 %. How many items are A?</p>`,
        answer, unit: 'items', tol: 0, abs: 0.01,
        hint: 'Work out the running total as a share of the grand total; an item is A while the share before it is below 80 %.',
        solution: steps(`Total ${tot}. Running shares: ${v.map((x, i) => n((100 * sum(v.slice(0, i + 1))) / tot, 3) + ' %').join(', ')}.`, `A items: the first <b>${answer}</b>.`),
        v,
      };
    },
    verify: (p) => { const tot = p.v.reduce((a, b) => a + b, 0); let k = 0, c = 0; while (k < p.v.length && c < 0.8 * tot) { c += p.v[k]; k++; } return k; },
  },
  'pd-rfm-score': {
    title: 'a monetary score with qcut',
    make(r) {
      const set = new Set();
      for (let i = 0; i < 10; i++) { let v = pick(r, 20, 900, 10); while (set.has(v)) v += 10; set.add(v); }
      const m = [...set], k = pick(r, 0, 9), below = m.filter((x) => x < m[k]).length, answer = Math.floor(below / 2) + 1;
      return {
        q: `<p>Ten customers spent: <b>${m.join(', ')}</b>. With <code>pd.qcut(monetary, 5, labels=[1, 2, 3, 4, 5])</code>, what M score does the customer who spent <b>${m[k]}</b> get?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Quintiles of 10 customers put 2 in each group: the lowest 2 get 1, the next 2 get 2, and so on.',
        solution: steps(`Sorted: ${[...m].sort((a, b) => a - b).join(', ')}.`, `${m[k]} is number ${below + 1} from the bottom, so it is in group <b>${answer}</b>.`),
        m, k,
      };
    },
    verify: (p) => Math.ceil(([...p.m].sort((a, b) => a - b).indexOf(p.m[p.k]) + 1) / 2),
  },
  'pd-retention': {
    title: 'a cohort retention cell',
    make(r) {
      const size = pick(r, 4, 8), months = ['Feb', 'Mar'], age = pick(r, 1, 2);
      const cust = Array.from({ length: size }, (_, i) => ({ c: `C${i + 1}`, Feb: r() < 0.5, Mar: r() < 0.45 }));
      const active = cust.filter((x) => x[months[age - 1]]).length, answer = (100 * active) / size;
      return {
        q: `<p>Every customer below first bought in <b>January</b> (the Jan cohort). Did they buy later?</p>${table(['customer', 'Feb', 'Mar'], cust.map((x) => [x.c, x.Feb ? 'yes' : 'no', x.Mar ? 'yes' : 'no']))}<p>What is the Jan cohort's retention at age <b>${age}</b>, in %?</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: `Age ${age} is ${months[age - 1]}. Count customers active then and divide by the cohort size.`,
        solution: steps(`Active in ${months[age - 1]}: ${active} of ${size}.`, `${active} ÷ ${size} × 100 = <b>${n(answer, 4)}</b> %.`),
        cust, age,
      };
    },
    verify: (p) => (100 * p.cust.filter((x) => (p.age === 1 ? x.Feb : x.Mar)).length) / p.cust.length,
  },
  'pd-ab-lift': {
    title: 'the lift in percentage points',
    make(r) {
      const ua = pick(r, 2000, 9000, 100), ub = ua + pick(r, -100, 100, 10), ca = Math.round(ua * pick(r, 0.04, 0.15, 0.005)), cb = Math.round(ub * pick(r, 0.04, 0.15, 0.005));
      const answer = 100 * (cb / ub - ca / ua);
      return {
        q: `${table(['group', 'users', 'converted'], [['A', ua, ca], ['B', ub, cb]])}<p>What is B's lift over A, in percentage points?</p>`,
        answer, unit: 'points', tol: 0.001, abs: 0.002,
        hint: 'Work out each rate (converted ÷ users), then subtract A from B and multiply by 100.',
        solution: steps(`A: ${ca} ÷ ${ua} = ${n((100 * ca) / ua, 4)} %. B: ${cb} ÷ ${ub} = ${n((100 * cb) / ub, 4)} %.`, `Lift = <b>${n(answer, 3)}</b> points. Next: its confidence interval.`),
        ua, ub, ca, cb,
      };
    },
    verify: (p) => (100 * (p.cb * p.ua - p.ca * p.ub)) / (p.ua * p.ub),
  },
  'pd-having-count': {
    title: 'WHERE, GROUP BY, HAVING',
    make(r) {
      const t = Array.from({ length: pick(r, 6, 9) }, () => ({ store: ['S01', 'S02', 'S03', 'WEB'][pick(r, 0, 3)], qty: pick(r, 1, 5), price: pick(r, 2, 10) })), p = pick(r, 3, 6), h = pick(r, 2, 5);
      const g = {};
      t.filter((x) => x.price > p).forEach((x) => { g[x.store] = (g[x.store] || 0) + x.qty; });
      const answer = Object.values(g).filter((v) => v > h).length;
      return {
        q: `<p>orders:</p>${table(['store', 'qty', 'price'], t.map((x) => [x.store, x.qty, x.price]))}<p>How many rows does this give? <code>SELECT store, SUM(qty) FROM orders WHERE price > ${p} GROUP BY store HAVING SUM(qty) > ${h}</code></p>`,
        answer, unit: 'stores', tol: 0, abs: 0.01,
        hint: `First drop rows with price ≤ ${p}, then total qty per store, then keep totals above ${h}.`,
        solution: steps(`After WHERE, per store: ${Object.entries(g).map(([s, v]) => `${s} ${v}`).join(', ') || 'nothing left'}.`, `Above ${h}: <b>${answer}</b>.`, `pandas: <code>df[df.price > ${p}].groupby('store').qty.sum().loc[lambda s: s > ${h}]</code>`),
        t, p, h,
      };
    },
    verify: (q) => { const stores = [...new Set(q.t.map((x) => x.store))]; return stores.filter((s) => q.t.filter((x) => x.store === s && x.price > q.p).reduce((a, x) => a + x.qty, 0) > q.h).length; },
  },
  'pd-where-sum': {
    title: 'a rule with np.where',
    make(r) {
      const t = Array.from({ length: pick(r, 4, 7) }, () => ({ qty: pick(r, 1, 5), price: pick(r, 4, 40, 2) })), k = pick(r, 2, 4), d = [0.9, 0.8][pick(r, 0, 1)];
      const pay = t.map((x) => (x.qty >= k ? x.price * d : x.price)), answer = sum(pay);
      return {
        q: `<p>df:</p>${table(['qty', 'price'], t.map((x) => [x.qty, x.price]))}${code(`np.where(df.qty >= ${k}, df.price * ${d}, df.price).sum()`)}<p>What does this give?</p>`,
        answer, unit: '', tol: 0.0001, abs: 0.001,
        hint: `Rows with qty ≥ ${k} use price × ${d}; the rest keep their price. Then add them up.`,
        solution: steps(`Per row: ${pay.map((x) => n(x, 5)).join(', ')}.`, `Sum = <b>${n(answer, 6)}</b>.`),
        t, k, d,
      };
    },
    verify: (p) => p.t.reduce((a, x) => a + x.price * (x.qty < p.k ? 1 : p.d), 0),
  },
  // ---------- Module 9 ----------
  'pd-growth-share': {
    title: "one store's share of the growth",
    make(r) {
      const st = ['S01', 'S02', 'WEB'], last = st.map(() => pick(r, 100, 200, 5)), now = last.map((x) => x + pick(r, -10, 40, 5));
      if (sum(now) <= sum(last)) now[2] += sum(last) - sum(now) + 20;
      const k = pick(r, 0, 2), answer = (100 * (now[k] - last[k])) / (sum(now) - sum(last));
      return {
        q: `${table(['store', 'last year', 'this year'], st.map((s, i) => [s, last[i], now[i]]))}<p>What share of the total growth comes from <b>${st[k]}</b>, in %? (Negative if it shrank.)</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: "Each store's change adds up to the total change; divide the store's change by the total change.",
        solution: steps(`Total change = ${sum(now)} − ${sum(last)} = ${sum(now) - sum(last)}.`, `${st[k]} change = ${now[k] - last[k]}.`, `${now[k] - last[k]} ÷ ${sum(now) - sum(last)} × 100 = <b>${n(answer, 4)}</b> %.`),
        last, now, k,
      };
    },
    verify: (p) => { const d = p.now.map((x, i) => x - p.last[i]); return (100 * d[p.k]) / d.reduce((a, b) => a + b, 0); },
  },
  'pd-repeat-share': {
    title: 'share of repeat customers',
    make(r) {
      const lines = [];
      let id = 1000;
      const custs = pick(r, 4, 6);
      for (let c = 1; c <= custs; c++) { const o = pick(r, 1, 3); for (let j = 0; j < o; j++) { id++; for (let l = pick(r, 1, 2); l > 0; l--) lines.push([`C${c}`, id]); } }
      const per = {}; lines.forEach(([c, o]) => { (per[c] ||= new Set()).add(o); });
      const answer = (100 * Object.values(per).filter((s) => s.size >= 2).length) / custs;
      return {
        q: `<p>Order lines:</p>${table(['customer', 'order_id'], lines)}<p>What percentage of customers placed 2 or more orders? (<code>(df.groupby('customer').order_id.nunique() >= 2).mean() * 100</code>)</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: 'Count distinct order_ids per customer; two lines of the same order are one order.',
        solution: steps(Object.entries(per).map(([c, s]) => `${c}: ${s.size}`).join(', ') + '.', `${Object.values(per).filter((s) => s.size >= 2).length} of ${custs} → <b>${n(answer, 4)}</b> %.`),
        lines,
      };
    },
    verify: (p) => { const m = new Map(); p.lines.forEach(([c, o]) => m.set(c, [...new Set([...(m.get(c) || []), o])])); return (100 * [...m.values()].filter((v) => v.length > 1).length) / m.size; },
  },
  'pd-cheat-rows': {
    title: 'follow the row count',
    make(r) {
      const a = pick(r, 100, 500, 10), b = pick(r, 100, 500, 10), d = pick(r, 2, 20), na = pick(r, 0, 15), bad = pick(r, 0, 10), answer = a + b - d - na - bad;
      return {
        q: `<p>Two monthly files have <b>${a}</b> and <b>${b}</b> rows. Then: <code>pd.concat</code>; <code>drop_duplicates()</code> removes <b>${d}</b>; <code>dropna(subset=['qty'])</code> removes <b>${na}</b>; <code>assign(revenue=...)</code>; <code>query('qty > 0')</code> removes <b>${bad}</b>. How many rows are left?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'concat adds rows; assign keeps the count; the others remove the rows stated.',
        solution: steps(`${a} + ${b} = ${a + b}.`, `− ${d} − ${na} − ${bad} = <b>${answer}</b>.`),
        a, b, d, na, bad,
      };
    },
    verify: (p) => p.a + p.b - (p.d + p.na + p.bad),
  },
};
