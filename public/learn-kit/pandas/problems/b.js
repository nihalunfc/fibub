// Live problems for Python pandas for analysis, part b: Modules 4-6 (see ../problems.js).
import { pick, n, steps, table } from './util.js';
import { mini, show } from './a.js';

const sum = (a) => a.reduce((s, v) => s + v, 0);
const mean = (a) => sum(a) / a.length;
const code = (s) => `<pre class="lk-code"><code>${s}</code></pre>`;
const firstStore = (t) => t[0].store;

export default {
  // ---------- Module 4 ----------
  'pd-group-mean': {
    title: 'a group mean',
    make(r) {
      const t = mini(r, pick(r, 6, 9)), s = firstStore(t), g = t.filter((x) => x.store === s).map((x) => x.qty), answer = mean(g);
      return {
        q: `<p>The table df:</p>${show(t)}<p>In <code>df.groupby('store')['qty'].mean()</code>, what is the value for <b>${s}</b>?</p>`,
        answer, unit: '', tol: 0.001,
        hint: `Split: take only the ${s} rows. Apply: average their qty.`,
        solution: steps(`${s} rows have qty ${g.join(', ')}.`, `${sum(g)} ÷ ${g.length} = <b>${n(answer, 4)}</b>.`),
        t, s,
      };
    },
    verify: (p) => { let a = 0, c = 0; p.t.forEach((x) => { if (x.store === p.s) { a += x.qty; c++; } }); return a / c; },
  },
  'pd-agg-nunique': {
    title: 'lines versus customers',
    make(r) {
      const t = mini(r, pick(r, 6, 9)).map((x) => ({ ...x, customer: `C${pick(r, 1, 4)}` })), s = firstStore(t);
      const rows = t.filter((x) => x.store === s), answer = rows.length - new Set(rows.map((x) => x.customer)).size;
      return {
        q: `<p>The table df:</p>${show(t, ['store', 'customer', 'qty'])}<p>After <code>df.groupby('store').agg(lines=('qty', 'size'), customers=('customer', 'nunique'))</code>, what is <b>lines − customers</b> for <b>${s}</b>?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: "size counts every row; nunique counts each customer once, however many lines they have.",
        solution: steps(`${s}: ${rows.length} lines, customers ${[...new Set(rows.map((x) => x.customer))].join(', ')}.`, `${rows.length} − ${new Set(rows.map((x) => x.customer)).size} = <b>${answer}</b> repeat lines.`),
        t, s,
      };
    },
    verify: (p) => { const seen = {}; let lines = 0; p.t.forEach((x) => { if (x.store === p.s) { lines++; seen[x.customer] = 1; } }); return lines - Object.keys(seen).length; },
  },
  'pd-transform-share': {
    title: "a row's share of its group",
    make(r) {
      const t = mini(r, pick(r, 5, 8)), k = pick(r, 0, t.length - 1), s = t[k].store, tot = sum(t.filter((x) => x.store === s).map((x) => x.qty)), answer = (100 * t[k].qty) / tot;
      return {
        q: `<p>The table df:</p>${show(t)}${code("df['share'] = df['qty'] / df.groupby('store')['qty'].transform('sum')")}<p>What is the share on row <b>${k}</b>, as a percentage?</p>`,
        answer, unit: '%', tol: 0.001,
        hint: `transform('sum') puts the ${s} total on every ${s} row; divide row ${k}'s qty by it.`,
        solution: steps(`${s} total qty = ${tot}.`, `${t[k].qty} ÷ ${tot} × 100 = <b>${n(answer, 4)}</b> %.`),
        t, k,
      };
    },
    verify: (p) => { const s = p.t[p.k].store; return (100 * p.t[p.k].qty) / p.t.reduce((a, x) => a + (x.store === s ? x.qty : 0), 0); },
  },
  'pd-crosstab-share': {
    title: 'a row share in a crosstab',
    make(r) {
      const seg = ['Premium', 'Regular'], t = Array.from({ length: pick(r, 6, 10) }, () => ({ store: ['S01', 'WEB'][pick(r, 0, 1)], segment: seg[pick(r, 0, 1)] })), s = t[0].store;
      const rows = t.filter((x) => x.store === s), prem = rows.filter((x) => x.segment === 'Premium').length, answer = (100 * prem) / rows.length;
      return {
        q: `<p>The table df:</p>${show(t, ['store', 'segment'])}<p>In <code>pd.crosstab(df.store, df.segment, normalize='index')</code>, what is the Premium share for <b>${s}</b>, as a percentage?</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: `normalize='index' divides each count by its row total, so the ${s} row adds up to 100 %.`,
        solution: steps(`${s}: ${prem} Premium out of ${rows.length}.`, `${prem} ÷ ${rows.length} × 100 = <b>${n(answer, 4)}</b> %.`),
        t, s,
      };
    },
    verify: (p) => { let a = 0, c = 0; p.t.forEach((x) => { if (x.store === p.s) { c++; a += x.segment === 'Premium'; } }); return (100 * a) / c; },
  },
  'pd-cut-band': {
    title: 'how many land in a band',
    make(r) {
      const prices = Array.from({ length: pick(r, 6, 9) }, () => [pick(r, 1, 10), pick(r, 10, 50), pick(r, 50, 200, 5)][pick(r, 0, 2)]);
      const bands = ['budget', 'mid', 'premium'], b = pick(r, 0, 2), edges = [0, 10, 50, 1000];
      const answer = prices.filter((x) => x > edges[b] && x <= edges[b + 1]).length;
      return {
        q: `${code(`prices = pd.Series([${prices.join(', ')}])\nband = pd.cut(prices, [0, 10, 50, 1000], labels=['budget', 'mid', 'premium'])\n(band == '${bands[b]}').sum()`)}<p>What does the last line give?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Each band includes its right edge but not its left: (0, 10], (10, 50], (50, 1000]. So 10 is budget and 50 is mid.',
        solution: steps(`${bands[b]} is (${edges[b]}, ${edges[b + 1]}].`, `Prices in it: ${prices.filter((x) => x > edges[b] && x <= edges[b + 1]).join(', ') || 'none'}.`, `Count: <b>${answer}</b>.`),
        prices, b,
      };
    },
    verify: (p) => p.prices.filter((x) => (x <= 10 ? 0 : x <= 50 ? 1 : 2) === p.b).length,
  },
  // ---------- Module 5 ----------
  'pd-concat-rows': {
    title: 'stacking monthly files',
    make(r) {
      const k = pick(r, 2, 5), rows = Array.from({ length: k }, () => pick(r, 20, 400)), answer = sum(rows);
      return {
        q: `<p>You read ${k} monthly files with <b>${rows.join(', ')}</b> rows and the same columns, then run <code>pd.concat(frames, ignore_index=True)</code>. How many rows does the result have?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Stacking matches nothing and removes nothing: the rows simply add up.',
        solution: steps(`${rows.join(' + ')} = <b>${answer}</b>.`, 'If the count differs, a file was read twice or skipped.'),
        rows,
      };
    },
    verify: (p) => p.rows.reduce((a, b) => a + b, 0),
  },
  'pd-join-rows': {
    title: 'rows after an inner join',
    make(r) {
      const ids = ['S01', 'S02', 'S03', 'S04', 'S09'], t = Array.from({ length: pick(r, 5, 9) }, () => ({ store: ids[pick(r, 0, 4)], qty: pick(r, 1, 5) }));
      const known = ['S01', 'S02', 'S03'].slice(0, pick(r, 2, 3)), how = ['inner', 'left'][pick(r, 0, 1)];
      const answer = how === 'left' ? t.length : t.filter((x) => known.includes(x.store)).length;
      return {
        q: `<p>orders:</p>${show(t, ['store', 'qty'])}<p>The stores table has one row each for <b>${known.join(', ')}</b>. How many rows does <code>orders.merge(stores, on='store', how='${how}')</code> give?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: how === 'left' ? 'A left join on a unique key keeps every left row, matched or not.' : 'An inner join keeps only orders whose store is in the stores table.',
        solution: steps(how === 'left' ? `Every order stays (unmatched ones get N&#97;N for the store columns): <b>${answer}</b>.` : `Orders with a known store: ${t.map((x, i) => (known.includes(x.store) ? i : null)).filter((x) => x !== null).join(', ') || 'none'}.`, `So <b>${answer}</b> rows.`),
        t, known, how,
      };
    },
    verify: (p) => p.t.filter((x) => p.how === 'left' || p.known.indexOf(x.store) >= 0).length,
  },
  'pd-dupe-join': {
    title: 'revenue after a bad join',
    make(r) {
      const prods = ['P1', 'P2', 'P3'], t = Array.from({ length: pick(r, 3, 6) }, () => ({ product: prods[pick(r, 0, 2)], revenue: pick(r, 10, 90, 5) }));
      const copies = { P1: pick(r, 1, 3), P2: pick(r, 1, 2), P3: 1 }, answer = sum(t.map((x) => x.revenue * copies[x.product]));
      return {
        q: `<p>orders:</p>${show(t, ['product', 'revenue'])}<p>The products table lists P1 <b>${copies.P1}</b> time(s), P2 <b>${copies.P2}</b> time(s) and P3 once. After <code>orders.merge(products, on='product', how='left')</code>, what does <code>['revenue'].sum()</code> give?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Each order is copied once per matching product row, so its revenue counts that many times.',
        solution: steps(t.map((x) => `${x.revenue} × ${copies[x.product]}`).join(' + ') + ` = <b>${answer}</b>.`, `The true total is ${sum(t.map((x) => x.revenue))}; validate='many_to_one' would have stopped this.`),
        t, copies,
      };
    },
    verify: (p) => p.t.reduce((a, x) => a + Array(p.copies[x.product]).fill(x.revenue).reduce((s, v) => s + v, 0), 0),
  },
  'pd-map-sum': {
    title: 'rows left blank by map',
    make(r) {
      const ids = ['S01', 'S02', 'S03', 'S07', 'S08'], t = Array.from({ length: pick(r, 5, 9) }, () => ({ store: ids[pick(r, 0, 4)] }));
      const known = ids.slice(0, pick(r, 2, 4)), answer = t.filter((x) => !known.includes(x.store)).length;
      return {
        q: `<p>df:</p>${show(t, ['store'])}<p>The lookup dictionary has cities for <b>${known.join(', ')}</b> only. How many N&#97;N values does <code>df['store'].map(city).isna().sum()</code> count?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'map gives N&#97;N for every value that is not a key in the dictionary.',
        solution: steps(`Stores not in the lookup: ${[...new Set(t.map((x) => x.store).filter((s) => !known.includes(s)))].join(', ') || 'none'}.`, `Rows with them: <b>${answer}</b>.`, 'With replace instead, those rows would keep their code.'),
        t, known,
      };
    },
    verify: (p) => p.t.length - p.t.filter((x) => p.known.indexOf(x.store) >= 0).length,
  },
  // ---------- Module 6 ----------
  'pd-pivot-cell': {
    title: 'one cell of a pivot table',
    make(r) {
      const months = ['Jan', 'Feb'], t = Array.from({ length: pick(r, 6, 9) }, () => ({ store: ['S01', 'S02'][pick(r, 0, 1)], month: months[pick(r, 0, 1)], qty: pick(r, 1, 6) }));
      const s = t[0].store, m = t[0].month, agg = ['sum', 'mean'][pick(r, 0, 1)], v = t.filter((x) => x.store === s && x.month === m).map((x) => x.qty), answer = agg === 'sum' ? sum(v) : mean(v);
      return {
        q: `<p>df:</p>${show(t, ['store', 'month', 'qty'])}<p>In <code>df.pivot_table(index='store', columns='month', values='qty', aggfunc='${agg}')</code>, what is the cell for <b>${s}</b>, <b>${m}</b>?</p>`,
        answer, unit: '', tol: 0.001, abs: 0.001,
        hint: `Take the rows where store is ${s} and month is ${m}, then ${agg === 'sum' ? 'add' : 'average'} their qty.`,
        solution: steps(`Matching qty: ${v.join(', ')}.`, `${agg} = <b>${n(answer, 4)}</b>.`),
        t, s, m, agg,
      };
    },
    verify: (p) => { const v = p.t.filter((x) => x.store === p.s && x.month === p.m).map((x) => x.qty); const tot = v.reduce((a, b) => a + b, 0); return p.agg === 'sum' ? tot : tot / v.length; },
  },
  'pd-melt-rows': {
    title: 'rows after melt',
    make(r) {
      const rows = pick(r, 3, 40), ids = pick(r, 1, 2), cols = pick(r, 3, 12), answer = rows * cols;
      return {
        q: `<p>A wide table has <b>${rows}</b> rows, <b>${ids}</b> id column(s) and <b>${cols}</b> month columns. How many rows does <code>df.melt(id_vars=[...the ${ids} id column(s)...])</code> give?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Every value cell becomes one row; id columns are copied, not melted.',
        solution: steps(`${rows} rows × ${cols} melted columns = <b>${answer}</b>.`, `The id columns ride along on each row; the result has ${ids} + 2 columns.`),
        rows, cols,
      };
    },
    verify: (p) => Array.from({ length: p.cols }, () => p.rows).reduce((a, b) => a + b, 0),
  },
  'pd-unstack-cells': {
    title: 'empty cells after unstack',
    make(r) {
      const stores = ['S01', 'S02', 'S03'].slice(0, pick(r, 2, 3)), qtys = [1, 2, 3].slice(0, pick(r, 2, 3)), pairs = [];
      stores.forEach((s) => qtys.forEach((q) => { if (r() < 0.65) pairs.push([s, q, pick(r, 1, 9)]); }));
      if (!pairs.length) pairs.push([stores[0], qtys[0], 3]);
      const usedS = new Set(pairs.map((x) => x[0])).size, usedQ = new Set(pairs.map((x) => x[1])).size, answer = usedS * usedQ - pairs.length;
      return {
        q: `<p>The result of <code>df.groupby(['store', 'qty']).size()</code>:</p>${table(['store', 'qty', 'lines'], pairs)}<p>After <code>.unstack('qty')</code>, how many cells are N&#97;N?</p>`,
        answer, unit: 'cells', tol: 0, abs: 0.01,
        hint: 'The grid has one row per store and one column per qty that appears. Cells with no row in the list are N&#97;N.',
        solution: steps(`Grid: ${usedS} stores × ${usedQ} qty values = ${usedS * usedQ} cells.`, `Filled: ${pairs.length}. Empty: <b>${answer}</b>.`, 'unstack(fill_value=0) would show them as 0.'),
        pairs,
      };
    },
    verify: (p) => { const s = {}, q = {}; p.pairs.forEach(([a, b]) => { s[a] = 1; q[b] = 1; }); return Object.keys(s).length * Object.keys(q).length - p.pairs.length; },
  },
  'pd-multi-loc': {
    title: 'selecting from a MultiIndex',
    make(r) {
      const t = [];
      ['S01', 'S02'].forEach((s) => ['P101', 'P102', 'P103'].forEach((p) => { if (r() < 0.8) t.push([s, p, pick(r, 1, 20)]); }));
      if (!t.some((x) => x[0] === 'S01')) t.unshift(['S01', 'P101', 4]);
      const outer = t[0][0], answer = sum(t.filter((x) => x[0] === outer).map((x) => x[2]));
      return {
        q: `<p>s = <code>df.groupby(['store', 'product'])['qty'].sum()</code>:</p>${table(['store', 'product', 'qty'], t)}<p>What does <code>s.loc['${outer}'].sum()</code> give?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: `loc with only the outer label returns every product under ${outer}.`,
        solution: steps(`Under ${outer}: ${t.filter((x) => x[0] === outer).map((x) => `${x[1]} ${x[2]}`).join(', ')}.`, `Sum = <b>${answer}</b>.`),
        t, outer,
      };
    },
    verify: (p) => p.t.reduce((a, x) => a + (x[0] === p.outer ? x[2] : 0), 0),
  },
  'pd-tidy-cells': {
    title: 'rows that pass a filter after tidying',
    make(r) {
      const qs = ['Q1', 'Q2', 'Q3', 'Q4'].slice(0, pick(r, 2, 4)), wide = ['S01', 'S02', 'S03'].map((s) => [s, ...qs.map(() => pick(r, 50, 150, 10))]), cut = pick(r, 80, 120, 10);
      const answer = wide.reduce((a, row) => a + row.slice(1).filter((v) => v >= cut).length, 0);
      return {
        q: `<p>Wide budgets:</p>${table(['store', ...qs], wide)}<p>After <code>df.melt(id_vars='store', var_name='quarter', value_name='budget')</code>, how many rows does <code>.query('budget >= ${cut}')</code> keep?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: `Each cell becomes a row; count the cells that are ${cut} or more.`,
        solution: steps(`${wide.length} stores × ${qs.length} quarters = ${wide.length * qs.length} rows after melt.`, `Cells ≥ ${cut}: <b>${answer}</b>.`),
        wide, cut,
      };
    },
    verify: (p) => p.wide.flatMap((row) => row.slice(1)).filter((v) => !(v < p.cut)).length,
  },
};
