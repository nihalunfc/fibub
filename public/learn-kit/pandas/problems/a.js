// Live problems for Python pandas for analysis, part a: Modules 1-3 (see ../problems.js).
// Each one shows a small table or a line of pandas and asks what it gives, with fresh numbers each time.
import { pick, n, steps, table } from './util.js';

const sum = (a) => a.reduce((s, v) => s + v, 0);
const mean = (a) => sum(a) / a.length;
const STORES = ['S01', 'S02', 'S03', 'WEB'];
const code = (s) => `<pre class="lk-code"><code>${s}</code></pre>`;
/** A small orders table: store, qty, price (and discount). */
export const mini = (r, rows = 6) => Array.from({ length: rows }, () => ({ store: STORES[pick(r, 0, 3)], qty: pick(r, 1, 6), price: pick(r, 2, 30, 0.5), discount: [0, 0, 0.1, 0.2][pick(r, 0, 3)] }));
export const show = (t, cols = ['store', 'qty', 'price']) => table(['', ...cols], t.map((row, i) => [i, ...cols.map((c) => row[c])]));

export default {
  // ---------- Module 1 ----------
  'pd-why-lines': {
    title: 'what does the recipe give?',
    make(r) {
      const t = mini(r, 6), s = STORES.find((x) => t.some((row) => row.store === x)), answer = sum(t.filter((x) => x.store === s).map((x) => x.qty));
      return {
        q: `<p>The orders table:</p>${show(t)}<p>After <code>orders.groupby('store')['qty'].sum()</code>, what is the value for <b>${s}</b>?</p>`,
        answer, unit: 'units', tol: 0, abs: 0.01,
        hint: `Add the qty of every row whose store is ${s}.`,
        solution: steps(`Rows for ${s}: ${t.map((x, i) => (x.store === s ? i : null)).filter((x) => x !== null).join(', ')}.`, `qty: ${t.filter((x) => x.store === s).map((x) => x.qty).join(' + ')} = <b>${answer}</b>.`),
        t, s,
      };
    },
    verify: (p) => p.t.reduce((a, x) => a + (x.store === p.s ? x.qty : 0), 0),
  },
  'pd-list-index': {
    title: 'which item does the index give?',
    make(r) {
      const items = ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'WEB'].slice(0, pick(r, 4, 7)), i = pick(r, -items.length, items.length - 1), val = [10, 20, 30, 40, 50, 60, 70].slice(0, items.length);
      const answer = val.at(i);
      return {
        q: `${code(`sales = [${val.join(', ')}]\nsales[${i}]`)}<p>What does the last line give?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Positions count from 0 at the start; negative positions count from −1 at the end.',
        solution: steps(i >= 0 ? `Position ${i} counting 0, 1, 2... from the left.` : `Position ${i}: −1 is the last item, −2 the one before, and so on.`, `That item is <b>${answer}</b>.`),
        val, i,
      };
    },
    verify: (p) => p.val[(p.i + p.val.length) % p.val.length],
  },
  'pd-series-mean': {
    title: 'the mean of a Series',
    make(r) {
      const v = Array.from({ length: pick(r, 4, 7) }, () => pick(r, 50, 200, 5)), answer = mean(v) * 1.1;
      return {
        q: `${code(`s = pd.Series([${v.join(', ')}])\n(s * 1.1).mean()`)}<p>What does this give?</p>`,
        answer, unit: '', tol: 0.001,
        hint: 'Multiplying every value by 1.1 multiplies the mean by 1.1.',
        solution: steps(`Mean of s = ${sum(v)} ÷ ${v.length} = ${n(mean(v), 5)}.`, `× 1.1 = <b>${n(answer, 5)}</b>.`),
        v,
      };
    },
    verify: (p) => mean(p.v.map((x) => x * 1.1)),
  },
  'pd-df-total': {
    title: 'a new column, summed',
    make(r) {
      const t = mini(r, pick(r, 3, 6)), answer = sum(t.map((x) => x.qty * x.price));
      return {
        q: `<p>The table df:</p>${show(t)}${code("df['total'] = df['qty'] * df['price']\ndf['total'].sum()")}<p>What does the last line give?</p>`,
        answer, unit: '', tol: 0.0001, abs: 0.001,
        hint: 'Work out qty × price for each row, then add them up.',
        solution: steps(t.map((x) => `${x.qty} × ${x.price} = ${n(x.qty * x.price, 5)}`).join('; ') + '.', `Sum = <b>${n(answer, 6)}</b>.`),
        t,
      };
    },
    verify: (p) => p.t.reduce((a, x) => a + x.price * x.qty, 0),
  },
  'pd-read-rows': {
    title: 'rows after reading a file',
    make(r) {
      const lines = pick(r, 5, 40), blank = pick(r, 0, 3), answer = lines - 1;
      return {
        q: `<p>A CSV file has <b>${lines}</b> lines of text: the first line holds the column names, and every other line is one order. How many rows does <code>pd.read_csv('file.csv')</code> give? (Blank lines at the very end${blank ? `, here ${blank},` : ''} are ignored.)</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'The header line becomes the column names, not a row.',
        solution: steps(`${lines} lines − 1 header line = <b>${answer}</b> rows.`, 'Check it straight after reading with <code>df.shape</code>.'),
        lines,
      };
    },
    verify: (p) => p.lines - 1,
  },
  'pd-describe-mean': {
    title: 'what does describe() report?',
    make(r) {
      const v = Array.from({ length: 5 }, () => pick(r, 1, 9)).sort((a, b) => a - b), answer = v[2];
      return {
        q: `<p>A column qty holds <b>${v.join(', ')}</b>. In <code>df['qty'].describe()</code>, what number appears in the <b>50%</b> row?</p>`,
        answer, unit: '', tol: 0, abs: 0.001,
        hint: 'The 50% row is the median: the middle value after sorting.',
        solution: steps(`Sorted: ${v.join(', ')}.`, `The middle (3rd of 5) is <b>${answer}</b>.`),
        v,
      };
    },
    verify: (p) => [...p.v].sort((a, b) => a - b)[2],
  },
  // ---------- Module 2 ----------
  'pd-columns-count': {
    title: 'how many columns are left?',
    make(r) {
      const all = 8, keep = pick(r, 2, 6), drop = pick(r, 1, 3), answer = all - drop;
      return {
        q: `<p>orders has <b>${all}</b> columns. What is <code>orders.drop(columns=[${Array.from({ length: drop }, (_, i) => `'c${i + 1}'`).join(', ')}]).shape[1]</code>, if all those columns exist? (Ignore the separate line that keeps ${keep} columns.)</p>`,
        answer, unit: 'columns', tol: 0, abs: 0.01,
        hint: 'shape[1] is the number of columns; drop removes the ones you list.',
        solution: steps(`${all} − ${drop} = <b>${answer}</b>.`),
        all, drop,
      };
    },
    verify: (p) => p.all - p.drop,
  },
  'pd-iloc-slice': {
    title: 'loc or iloc: how many rows?',
    make(r) {
      const a = pick(r, 0, 3), b = a + pick(r, 1, 4), useLoc = r() < 0.5, answer = useLoc ? b - a + 1 : b - a;
      return {
        q: `<p>df has 10 rows labelled 0 to 9, in order. How many rows does <code>df.${useLoc ? 'loc' : 'iloc'}[${a}:${b}]</code> give?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'loc slices by label and includes the end; iloc slices by position and stops before the end.',
        solution: steps(useLoc ? `loc includes both ${a} and ${b}: ${b} − ${a} + 1 = <b>${answer}</b>.` : `iloc stops before position ${b}: ${b} − ${a} = <b>${answer}</b>.`),
        a, b, useLoc,
      };
    },
    verify: (p) => (p.useLoc ? p.b - p.a + 1 : p.b - p.a),
  },
  'pd-mask-count': {
    title: 'rows that pass two conditions',
    make(r) {
      const t = mini(r, 8), q = pick(r, 1, 4), s = STORES[pick(r, 0, 3)], answer = t.filter((x) => x.qty > q && x.store === s).length;
      return {
        q: `<p>The table df:</p>${show(t)}<p>How many rows does <code>df[(df['qty'] > ${q}) & (df['store'] == '${s}')]</code> keep?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'A row is kept only if both conditions are True for it.',
        solution: steps(`Rows with store ${s}: ${t.map((x, i) => (x.store === s ? `${i} (qty ${x.qty})` : null)).filter(Boolean).join(', ') || 'none'}.`, `Of those, qty > ${q}: <b>${answer}</b>.`),
        t, cut: q, s,
      };
    },
    verify: (p) => p.t.reduce((a, x) => a + (x.store === p.s) * (x.qty > p.cut), 0),
  },
  'pd-rank': {
    title: 'a rank after sorting',
    make(r) {
      const v = Array.from({ length: 6 }, (_, i) => 10 + i * 7 + pick(r, 0, 5)).sort(() => 0), shuffled = [...v]; for (let i = 5; i > 0; i--) { const j = pick(r, 0, i); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
      const k = pick(r, 0, 5), answer = [...shuffled].sort((a, b) => b - a).indexOf(shuffled[k]) + 1;
      return {
        q: `<p>qty = <b>${shuffled.join(', ')}</b> (rows 0 to 5). What is <code>df['qty'].rank(ascending=False)</code> for row <b>${k}</b> (qty ${shuffled[k]})?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'ascending=False gives rank 1 to the biggest value.',
        solution: steps(`Biggest first: ${[...shuffled].sort((a, b) => b - a).join(', ')}.`, `${shuffled[k]} is number <b>${answer}</b> in that list.`),
        shuffled, k,
      };
    },
    verify: (p) => p.shuffled.filter((x) => x > p.shuffled[p.k]).length + 1,
  },
  'pd-revenue': {
    title: 'revenue with a discount',
    make(r) {
      const q = pick(r, 1, 6), pr = pick(r, 3, 60, 0.5), d = [0, 0.05, 0.1, 0.15, 0.2, 0.25][pick(r, 0, 5)], answer = q * pr * (1 - d);
      return {
        q: `<p>A line has qty <b>${q}</b>, unit_price <b>${pr}</b> and discount <b>${d}</b>. What is <code>qty * unit_price * (1 - discount)</code>?</p>`,
        answer, unit: '', tol: 0.0001, abs: 0.001,
        hint: 'Discount is a share: 0.1 means 10 % off, so you pay 0.9 of the price.',
        solution: steps(`${q} × ${pr} = ${n(q * pr, 5)}.`, `× (1 − ${d}) = × ${n(1 - d)} = <b>${n(answer, 5)}</b>.`),
        qty: q, pr, d,
      };
    },
    verify: (p) => p.qty * p.pr - p.qty * p.pr * p.d,
  },
  'pd-between': {
    title: 'isin and between together',
    make(r) {
      const t = mini(r, 8), lo = pick(r, 1, 3), hi = lo + pick(r, 0, 2), set = [STORES[pick(r, 0, 1)], STORES[pick(r, 2, 3)]];
      const answer = t.filter((x) => set.includes(x.store) && x.qty >= lo && x.qty <= hi).length;
      return {
        q: `<p>The table df:</p>${show(t)}<p>How many rows does <code>df[df['store'].isin(['${set[0]}', '${set[1]}']) & df['qty'].between(${lo}, ${hi})]</code> keep?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: `Keep rows whose store is ${set[0]} or ${set[1]} and whose qty is from ${lo} to ${hi}, both ends included.`,
        solution: steps(`Matching rows: ${t.map((x, i) => (set.includes(x.store) && x.qty >= lo && x.qty <= hi ? i : null)).filter((x) => x !== null).join(', ') || 'none'}.`, `Count: <b>${answer}</b>.`),
        t, lo, hi, set,
      };
    },
    verify: (p) => p.t.reduce((a, x) => a + (p.set.indexOf(x.store) >= 0 && !(x.qty < p.lo || x.qty > p.hi)), 0),
  },
  // ---------- Module 3 ----------
  'pd-missing-mean': {
    title: 'the mean when values are missing',
    make(r) {
      const v = Array.from({ length: pick(r, 5, 8) }, () => (r() < 0.3 ? null : pick(r, 1, 9)));
      if (v.every((x) => x === null)) v[0] = pick(r, 1, 9);
      if (!v.some((x) => x === null)) v[v.length - 1] = null;
      const known = v.filter((x) => x !== null), answer = mean(known);
      return {
        q: `${code(`qty = pd.Series([${v.map((x) => (x === null ? 'None' : x)).join(', ')}])\nqty.mean()`)}<p>What does <code>qty.mean()</code> give? (None becomes N&#97;N.)</p>`,
        answer, unit: '', tol: 0.001,
        hint: 'pandas skips N&#97;N: add the known values and divide by how many are known, not by the full length.',
        solution: steps(`Known values: ${known.join(', ')} (${known.length} of ${v.length}).`, `${sum(known)} ÷ ${known.length} = <b>${n(answer, 4)}</b>.`, 'Dividing by all rows would quietly treat the gaps as zero.'),
        v,
      };
    },
    verify: (p) => { let s = 0, c = 0; for (const x of p.v) if (x != null) { s += x; c++; } return s / c; },
  },
  'pd-dupes': {
    title: 'rows left after drop_duplicates',
    make(r) {
      const t = Array.from({ length: pick(r, 5, 8) }, () => ({ order: 50001 + pick(r, 0, 3), store: STORES[pick(r, 0, 1)], qty: pick(r, 1, 2) }));
      const key = (x) => `${x.order}|${x.store}|${x.qty}`, answer = new Set(t.map(key)).size;
      return {
        q: `<p>The table df:</p>${show(t, ['order', 'store', 'qty'])}<p>How many rows does <code>df.drop_duplicates()</code> keep?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'A row is a duplicate only when every column matches an earlier row; the first copy stays.',
        solution: steps(`Distinct rows: ${[...new Set(t.map((x) => `(${x.order}, ${x.store}, ${x.qty})`))].join(', ')}.`, `That is <b>${answer}</b> rows.`),
        t,
      };
    },
    verify: (p) => p.t.filter((x, i) => p.t.findIndex((y) => y.order === x.order && y.store === x.store && y.qty === x.qty) === i).length,
  },
  'pd-text-sum': {
    title: 'sum after to_numeric',
    make(r) {
      const raw = Array.from({ length: pick(r, 4, 6) }, () => (r() < 0.25 ? ['n/a', '-', 'unknown'][pick(r, 0, 2)] : String(pick(r, 1, 40, 0.25))));
      if (raw.every((x) => isNaN(+x))) raw[0] = '5.5';
      const nums = raw.map((x) => (isNaN(+x) ? null : +x)), answer = sum(nums.filter((x) => x !== null));
      return {
        q: `${code(`price = pd.Series([${raw.map((x) => `'${x}'`).join(', ')}])\npd.to_numeric(price, errors='coerce').sum()`)}<p>What does the last line give?</p>`,
        answer, unit: '', tol: 0.0001, abs: 0.001,
        hint: "errors='coerce' turns text that is not a number into N&#97;N, and sum() skips N&#97;N.",
        solution: steps(`Converted: ${nums.map((x) => (x === null ? 'N&#97;N' : x)).join(', ')}.`, `Sum of the numbers = <b>${n(answer, 6)}</b>.`),
        raw,
      };
    },
    verify: (p) => p.raw.map(Number).filter((x) => !Number.isNaN(x)).reduce((a, b) => a + b, 0),
  },
  'pd-str-count': {
    title: 'distinct names after cleaning',
    make(r) {
      const base = ['harbourview', 'pine lake', 'riverside', 'old mill'].slice(0, pick(r, 2, 4));
      const mess = (s) => [s, s.toUpperCase(), ` ${s}`, `${s} `, s.replace(/\b\w/g, (c) => c.toUpperCase())][pick(r, 0, 4)];
      const raw = Array.from({ length: pick(r, 5, 8) }, () => mess(base[pick(r, 0, base.length - 1)]));
      const before = new Set(raw).size, after = new Set(raw.map((x) => x.trim().toLowerCase())).size, answer = before - after;
      return {
        q: `${code(`s = pd.Series([${raw.map((x) => `'${x}'`).join(', ')}])\ns.nunique() - s.str.strip().str.title().nunique()`)}<p>What does this give: how many false "different" names does cleaning remove?</p>`,
        answer, unit: 'names', tol: 0, abs: 0.01,
        hint: 'Count distinct spellings exactly as typed, then count distinct names once spaces and capitals are ignored.',
        solution: steps(`As typed: ${before} distinct values.`, `After strip and title: ${after} names.`, `${before} − ${after} = <b>${answer}</b>.`),
        raw,
      };
    },
    verify: (p) => { const a = {}, b = {}; p.raw.forEach((x) => { a[x] = 1; b[x.trim().toUpperCase()] = 1; }); return Object.keys(a).length - Object.keys(b).length; },
  },
  'pd-days-between': {
    title: 'days between two dates',
    make(r) {
      const d1 = new Date(Date.UTC(2026, pick(r, 0, 10), pick(r, 1, 28))), gap = pick(r, 3, 90), d2 = new Date(d1.getTime() + gap * 864e5);
      const f = (d) => d.toISOString().slice(0, 10);
      return {
        q: `${code(`a = pd.to_datetime('${f(d1)}')\nb = pd.to_datetime('${f(d2)}')\n(b - a).days`)}<p>What does the last line give?</p>`,
        answer: gap, unit: 'days', tol: 0, abs: 0.01,
        hint: 'Count the days month by month; remember how many days each month has.',
        solution: steps(`From ${f(d1)} to ${f(d2)}.`, `That is <b>${gap}</b> days.`),
        a: f(d1), b: f(d2),
      };
    },
    verify: (p) => Math.round((Date.parse(p.b) - Date.parse(p.a)) / 864e5),
  },
  'pd-rule-share': {
    title: 'share of rows that break a rule',
    make(r) {
      const t = mini(r, pick(r, 6, 10));
      t.forEach((x) => { if (r() < 0.2) x.qty = -x.qty; if (r() < 0.15) x.discount = 0.6; });
      const bad = t.filter((x) => !(x.qty > 0 && x.discount >= 0 && x.discount <= 0.5)).length, answer = (100 * bad) / t.length;
      return {
        q: `<p>The table df:</p>${show(t, ['store', 'qty', 'discount'])}<p>The rules: qty is positive and discount is from 0 to 0.5. What percentage of rows break at least one rule? (<code>(~ok).mean() * 100</code>)</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: 'Mark a row bad if qty ≤ 0 or discount is outside 0 to 0.5, count the bad rows and divide by all rows.',
        solution: steps(`Bad rows: ${t.map((x, i) => (!(x.qty > 0 && x.discount <= 0.5) ? i : null)).filter((x) => x !== null).join(', ') || 'none'} (${bad} of ${t.length}).`, `${bad} ÷ ${t.length} × 100 = <b>${n(answer, 4)}</b> %.`),
        t,
      };
    },
    verify: (p) => (100 * p.t.reduce((a, x) => a + (x.qty <= 0 || x.discount > 0.5 || x.discount < 0 ? 1 : 0), 0)) / p.t.length,
  },
  'pd-clean-rows': {
    title: 'rows after a cleaning pipeline',
    make(r) {
      const rows = pick(r, 300, 900, 10), dup = pick(r, 2, 30), neg = pick(r, 1, 12), test = pick(r, 0, 8), answer = rows - dup - neg - test;
      return {
        q: `<p>A raw export has <b>${rows}</b> rows. <code>drop_duplicates()</code> removes <b>${dup}</b>, the rule "qty > 0" drops <b>${neg}</b> refund lines kept elsewhere, and <b>${test}</b> rows from the test store are filtered out. Missing qty on 15 rows is filled, not dropped. How many clean rows are left?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Filling missing values keeps the rows; only the removals change the count.',
        solution: steps(`${rows} − ${dup} − ${neg} − ${test} = <b>${answer}</b>.`, 'The 15 filled rows are still there, now flagged.'),
        rows, dup, neg, test,
      };
    },
    verify: (p) => p.rows - (p.dup + p.neg + p.test),
  },
};
