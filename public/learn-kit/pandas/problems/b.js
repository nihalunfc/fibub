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
};
