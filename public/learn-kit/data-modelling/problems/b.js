// Live problems for data-modelling, part b: Modules 5-8 (see ../problems.js).
import { pick, n, steps, table, rows, code } from './util.js';

const sum = (a) => a.reduce((s, v) => s + v, 0);
const CITIES = ['Toronto', 'Ottawa', 'Halifax', 'Calgary'];
const NAMES = ['Asha', 'Ben', 'Chloe', 'Dev', 'Elif'];
/** A date text, k days after 1 Jan 2025. */
const day = (k) => new Date(Date.UTC(2025, 0, 1 + k)).toISOString().slice(0, 10);
/** Random version start days, at least 20 days apart. */
const starts = (r, count) => { let d = 0; return Array.from({ length: count }, () => (d += pick(r, 20, 60))); };

export default {
  // ---------- Module 5: history ----------
  'dm-scd-rows': {
    title: 'rows in a type 2 dimension',
    make(r) {
      const cnt = pick(r, 3, 4), start = {};
      NAMES.slice(0, cnt).forEach((nm) => { start[nm] = CITIES[pick(r, 0, 3)]; });
      const ev = Array.from({ length: pick(r, 4, 6) }, () => ({ customer: NAMES[pick(r, 0, cnt - 1)], city: CITIES[pick(r, 0, 3)] }));
      let answer = cnt; const last = { ...start };
      ev.forEach((e) => { if (last[e.customer] !== e.city) { answer++; last[e.customer] = e.city; } });
      return {
        q: `<p>A customer dimension starts with one current row per customer:</p>${rows(Object.entries(start).map(([customer, city]) => ({ customer, city })))}<p>These updates arrive in order (a type 2 dimension adds a row only when the city really changes):</p>${rows(ev)}<p>How many rows does the dimension hold after all updates?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Start with one row per customer. Add one row for each update whose city differs from that customer\'s latest city.',
        solution: steps(`Start: ${cnt} rows.`, `Walk the updates in order, comparing each with the customer's latest city. ${answer - cnt} of them are real changes.`, `${cnt} + ${answer - cnt} = <b>${answer}</b> rows.`),
        start, ev,
      };
    },
    verify: (p) => Object.keys(p.start).reduce((t, c) => {
      const seq = [p.start[c], ...p.ev.filter((e) => e.customer === c).map((e) => e.city)];
      return t + 1 + seq.slice(1).filter((v, i) => v !== seq[i]).length;
    }, 0),
  },
  'dm-scd-type1-total': {
    title: 'what type 1 reports',
    make(r) {
      const t = ['Asha', 'Ben', 'Chloe'].map((customer) => ({ customer, was: CITIES[pick(r, 0, 1)], now: CITIES[pick(r, 2, 3)], sales: [pick(r, 20, 90, 10), pick(r, 20, 90, 10)] }));
      const target = t[0].now;
      const answer = sum(t.filter((x) => x.now === target).flatMap((x) => x.sales));
      return {
        q: `<p>Each customer moved once. All their sales happened while they lived in the old city.</p>${rows(t.map((x) => ({ customer: x.customer, old_city: x.was, new_city: x.now, sale_1: x.sales[0], sale_2: x.sales[1] })))}<p>The dimension uses <b>type 1</b> (overwrite). What total sales does a report by city show for <b>${target}</b>?</p>`,
        answer, unit: '$', tol: 0, abs: 0.01,
        hint: 'Type 1 keeps only the new city, so every sale of a customer is reported under their new city, even sales made before the move.',
        solution: steps(`Only the new city survives, so customers now in ${target}: ${t.filter((x) => x.now === target).map((x) => x.customer).join(', ')}.`, `Add all of their sales: <b>${answer}</b>.`),
        t, target,
      };
    },
    verify: (p) => { let s = 0; p.t.forEach((x) => x.sales.forEach((v) => { if (x.now === p.target) s += v; })); return s; },
  },
  'dm-scd2-load': {
    title: 'rows after a type 2 load',
    make(r) {
      const cnt = pick(r, 3, 5), dim = Array.from({ length: cnt }, (_, i) => ({ customer_id: i + 1, city: CITIES[pick(r, 0, 3)] }));
      const extra = pick(r, 1, 2), stg = Array.from({ length: cnt + extra }, (_, i) => ({ customer_id: i + 1, city: CITIES[pick(r, 0, 3)] }));
      let answer = cnt; stg.forEach((s) => { const cur = dim.find((d) => d.customer_id === s.customer_id); if (!cur || cur.city !== s.city) answer++; });
      return {
        q: `<p>The current dimension (one row per customer, all current):</p>${rows(dim)}<p>Tonight's staging set:</p>${rows(stg)}<p>A type 2 load expires the old row and inserts a new one for every <b>changed</b> customer, and inserts a row for every <b>new</b> customer. Unchanged customers are left alone. How many rows are in the dimension after the load (expired rows included)?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Rows after = rows before + one new row per changed customer + one per new customer. Expiring a row does not remove it.',
        solution: steps(`Before: ${cnt} rows.`, `Compare each staging row with the current city: ${answer - cnt} are changed or new.`, `${cnt} + ${answer - cnt} = <b>${answer}</b>.`),
        dim, stg,
      };
    },
    verify: (p) => {
      const out = p.dim.map((d) => ({ ...d, cur: true }));
      p.stg.forEach((s) => {
        const cur = out.find((o) => o.customer_id === s.customer_id && o.cur);
        if (cur && cur.city === s.city) return;
        if (cur) cur.cur = false;
        out.push({ ...s, cur: true });
      });
      return out.length;
    },
  },
  'dm-late-key': {
    title: 'which version does a late fact get?',
    make(r) {
      const st = starts(r, pick(r, 3, 4)), keys = st.map((_, i) => 101 + i), f = pick(r, st[0], st[st.length - 1] + 30);
      let answer = keys[0]; st.forEach((s, i) => { if (s <= f) answer = keys[i]; });
      const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum'];
      return {
        q: `<p>dim_customer holds these versions of one customer (valid_to is the next version's valid_from; the last one is open):</p>${rows(st.map((s, i) => ({ customer_key: keys[i], tier: tiers[i], valid_from: day(s) })))}<p>A sale dated <b>${day(f)}</b> arrives late. Which <b>customer_key</b> should the fact row carry? (Look up the version where valid_from &le; date &lt; valid_to.)</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Find the last version that started on or before the sale date.',
        solution: steps(`Versions that had already started by ${day(f)}: those with valid_from &le; ${day(f)}.`, `The latest of them is the one still open on that day: customer_key <b>${answer}</b>.`),
        st, keys, f,
      };
    },
    verify: (p) => { for (let i = 0; i < p.st.length; i++) { const to = i + 1 < p.st.length ? p.st[i + 1] : Infinity; if (p.f >= p.st[i] && p.f < to) return p.keys[i]; } return p.keys[0]; },
  },
  'dm-asof-sales': {
    title: 'sales "as it was"',
    make(r) {
      const up = pick(r, 20, 50), sales = Array.from({ length: pick(r, 5, 7) }, () => ({ day: pick(r, 1, 70), amount: pick(r, 10, 90, 10) })).sort((a, b) => a.day - b.day);
      const answer = sum(sales.filter((s) => s.day >= up).map((s) => s.amount));
      return {
        q: `<p>Asha was <b>Silver</b> until day ${up - 1} and became <b>Gold</b> on day ${up} (type 2 history). Her sales:</p>${rows(sales)}<p>Using the tier <b>as it was</b> on the sale day, what is the total of her <b>Gold</b> sales?</p>`,
        answer, unit: '$', tol: 0, abs: 0.01,
        hint: `Only sales on day ${up} or later happened while she was Gold.`,
        solution: steps(`Gold applies from day ${up} onward.`, `Add the amounts of those sales: <b>${answer}</b>.`),
        up, sales,
      };
    },
    verify: (p) => sum(p.sales.map((s) => s.amount)) - sum(p.sales.filter((s) => s.day < p.up).map((s) => s.amount)),
  },

  // ---------- Module 6: beyond Kimball ----------
  'dm-inmon-mart': {
    title: 'rows in a dependent data mart',
    make(r) {
      const regs = ['East', 'West'], mons = ['Jan', 'Feb', 'Mar'];
      const lines = Array.from({ length: pick(r, 6, 9) }, () => ({ month: mons[pick(r, 0, 2)], region: regs[pick(r, 0, 1)], amount: pick(r, 10, 60, 10) }));
      const answer = new Set(lines.map((l) => l.month + '|' + l.region)).size;
      return {
        q: `<p>The central warehouse holds these order lines:</p>${rows(lines)}<p>A dependent mart is built with <code>SELECT month, region, SUM(amount) FROM lines GROUP BY month, region</code>. How many rows does the mart table have?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'One mart row per different (month, region) pair.',
        solution: steps('List each distinct (month, region) pair that appears.', `There are <b>${answer}</b>.`),
        lines,
      };
    },
    verify: (p) => { const k = p.lines.map((l) => l.month + '|' + l.region).sort(); return k.filter((v, i) => v !== k[i - 1]).length; },
  },
  'dm-vault-rows': {
    title: 'rows in a small vault',
    make(r) {
      const orders = Array.from({ length: pick(r, 6, 9) }, () => ({ customer: `C${pick(r, 1, 3)}`, product: `P${pick(r, 1, 4)}` }));
      const answer = new Set(orders.map((o) => o.customer)).size + new Set(orders.map((o) => o.product)).size + new Set(orders.map((o) => o.customer + o.product)).size;
      return {
        q: `<p>These orders are loaded into a Data Vault with <b>hub_customer</b>, <b>hub_product</b> and <b>link_order</b> (one link row per different customer-product pair; hubs hold each business key once):</p>${rows(orders)}<p>How many rows are in the three tables together?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Count the distinct customers, the distinct products and the distinct customer-product pairs, then add them.',
        solution: steps('hub_customer: each customer once. hub_product: each product once.', 'link_order: each distinct pair once.', `Total <b>${answer}</b>.`),
        orders,
      };
    },
    verify: (p) => {
      const uniq = (a) => { const s = [...a].sort(); return s.filter((v, i) => v !== s[i - 1]).length; };
      return uniq(p.orders.map((o) => o.customer)) + uniq(p.orders.map((o) => o.product)) + uniq(p.orders.map((o) => o.customer + '/' + o.product));
    },
  },
  'dm-obt-double': {
    title: 'the double-counting trap',
    make(r) {
      const ords = Array.from({ length: pick(r, 3, 4) }, (_, i) => ({ order: 1001 + i, fee: pick(r, 4, 12, 2), lines: pick(r, 1, 4) }));
      const flat = ords.flatMap((o) => Array.from({ length: o.lines }, (_, k) => ({ order: o.order, line: k + 1, shipping_fee: o.fee })));
      const answer = sum(flat.map((x) => x.shipping_fee)) - sum(ords.map((o) => o.fee));
      return {
        q: `<p>Each order has one shipping fee. In the one big table the fee is copied onto every line:</p>${rows(flat)}<p><code>SELECT SUM(shipping_fee) FROM obt</code> gives too much. By how much is it <b>higher</b> than the true total of the order fees?</p>`,
        answer, unit: '$', tol: 0, abs: 0.01,
        hint: 'True total: one fee per order. The big table counts each fee once per line, so an order with 3 lines is counted 2 extra times.',
        solution: steps(`Sum over lines: ${sum(flat.map((x) => x.shipping_fee))}.`, `True total (one per order): ${sum(ords.map((o) => o.fee))}.`, `Difference: <b>${answer}</b>.`),
        ords, flat,
      };
    },
    verify: (p) => sum(p.ords.map((o) => o.fee * (o.lines - 1))),
  },
  'dm-lake-silver': {
    title: 'gold total from a messy bronze feed',
    make(r) {
      const bronze = []; let ld = 1;
      for (let id = 1; id <= pick(r, 4, 5); id++) for (let k = pick(r, 1, 2); k > 0; k--) bronze.push({ id, amount: pick(r, 0, 3) === 0 ? null : pick(r, 10, 90, 10), load: ld++ });
      const latest = {}; bronze.forEach((b) => { if (!latest[b.id] || b.load > latest[b.id].load) latest[b.id] = b; });
      const answer = sum(Object.values(latest).filter((b) => b.amount != null).map((b) => b.amount));
      return {
        q: `<p>The bronze layer has every row as it arrived (a row can be re-sent in a later load):</p>${rows(bronze)}<p><b>Silver</b> keeps the <b>latest</b> row per id (highest load), then drops rows whose amount is NULL. <b>Gold</b> is SUM(amount) over silver. What is gold's total?</p>`,
        answer, unit: '$', tol: 0, abs: 0.01,
        hint: 'First pick the highest load for each id. Only then check whether its amount is NULL.',
        solution: steps('Keep one row per id: the one with the highest load.', 'Drop the ones where amount is NULL.', `Add the rest: <b>${answer}</b>.`),
        bronze,
      };
    },
    verify: (p) => { const m = new Map(); [...p.bronze].sort((a, b) => a.load - b.load).forEach((b) => m.set(b.id, b.amount)); let s = 0; m.forEach((v) => { if (v != null) s += v; }); return s; },
  },

  // ---------- Module 7: building and running ----------
  'dm-layers-downstream': {
    title: 'what breaks downstream',
    make(r) {
      const stg = ['stg_a', 'stg_b', 'stg_c'], core = ['core_d', 'core_e'], marts = ['mart_f', 'mart_g'];
      const subset = (from) => { let m = pick(r, 1, 2 ** from.length - 1); return from.filter((_, i) => m & (1 << i)); };
      const deps = {};
      core.forEach((c) => { deps[c] = subset(stg); });
      marts.forEach((m) => { deps[m] = subset(core); });
      const seen = new Set(['stg_a']), queue = ['stg_a'];
      while (queue.length) { const x = queue.shift(); Object.keys(deps).forEach((m) => { if (deps[m].includes(x) && !seen.has(m)) { seen.add(m); queue.push(m); } }); }
      const answer = seen.size - 1;
      return {
        q: `<p>Each model and the models it reads from:</p>${rows(Object.entries(deps).map(([model, reads]) => ({ model, reads_from: reads.join(', ') })))}<p>The source behind <b>stg_a</b> changes shape. How many models are <b>downstream</b> of stg_a (directly or through other models, not counting stg_a)?</p>`,
        answer, unit: 'models', tol: 0, abs: 0.01,
        hint: 'First list the models that read stg_a. Then the models that read those, and so on.',
        solution: steps('Find every model that reads stg_a.', 'Then every model that reads one of those.', `Total downstream: <b>${answer}</b>.`),
        deps,
      };
    },
    verify: (p) => { const hit = new Set(['stg_a']); let grew = true; while (grew) { grew = false; for (const [m, rs] of Object.entries(p.deps)) if (!hit.has(m) && rs.some((x) => hit.has(x))) { hit.add(m); grew = true; } } return hit.size - 1; },
  },
  'dm-merge-rows': {
    title: 'rows after an upsert',
    make(r) {
      const all = [1, 2, 3, 4, 5, 6, 7, 8], some = (k) => { const a = [...all]; const o = []; while (o.length < k) o.push(a.splice(pick(r, 0, a.length - 1), 1)[0]); return o.sort((x, y) => x - y); };
      const tgt = some(pick(r, 4, 5)), bat = some(pick(r, 3, 4)), answer = new Set([...tgt, ...bat]).size;
      return {
        q: `<p>The target dimension has these customer_id values (one row each): <b>${tgt.join(', ')}</b>.</p><p>Tonight's batch has: <b>${bat.join(', ')}</b>.</p><p>An upsert (<code>INSERT ... ON CONFLICT (customer_id) DO UPDATE</code>) updates ids that exist and inserts the rest. How many rows does the target have afterwards?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Ids already there are updated in place (no new row). Only ids not in the target add a row.',
        solution: steps(`Already present: ${bat.filter((x) => tgt.includes(x)).length} of the batch, so they only update.`, `New ids: ${bat.filter((x) => !tgt.includes(x)).length}.`, `${tgt.length} + ${bat.filter((x) => !tgt.includes(x)).length} = <b>${answer}</b>.`),
        tgt, bat,
      };
    },
    verify: (p) => p.tgt.length + p.bat.filter((x) => p.tgt.indexOf(x) < 0).length,
  },
  'dm-hwm-load': {
    title: 'an incremental load with a high-water mark',
    make(r) {
      const mark = pick(r, 20, 40), orders = Array.from({ length: pick(r, 6, 8) }, (_, i) => ({ order_id: 5001 + i, updated_at: pick(r, 10, 60) }));
      const answer = orders.filter((o) => o.updated_at > mark).length;
      return {
        q: `<p>The last load stopped at the high-water mark <b>updated_at = ${mark}</b>. The source now holds:</p>${rows(orders)}${code(`INSERT INTO fact SELECT * FROM src WHERE updated_at > ${mark};`)}<p>How many rows does this incremental load pick up?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Count rows strictly above the mark. A row equal to the mark was already loaded.',
        solution: steps(`Keep rows with updated_at greater than ${mark}.`, `<b>${answer}</b> rows qualify.`),
        mark, orders,
      };
    },
    verify: (p) => p.orders.length - p.orders.filter((o) => o.updated_at <= p.mark).length,
  },
  'dm-rerun-dupes': {
    title: 'a load run twice',
    make(r) {
      const days = [1, 2, 3, 4].map((d) => ({ day: `Mon ${d}`.replace('Mon', 'Nov'), rows_loaded: pick(r, 20, 90, 10) })), k = pick(r, 0, 3);
      const answer = sum(days.map((d) => d.rows_loaded)) + days[k].rows_loaded;
      return {
        q: `<p>A fact table holds one load per day:</p>${rows(days)}<p>The job for <b>${days[k].day}</b> is accidentally run a second time. It only <b>appends</b> (no delete first) and loads the same ${days[k].rows_loaded} rows. How many rows does the table hold now?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'An append-only job that runs twice stores that day twice.',
        solution: steps(`Before the re-run: ${sum(days.map((d) => d.rows_loaded))} rows.`, `Add the repeated day: ${days[k].rows_loaded}.`, `<b>${answer}</b> rows. (A delete-the-window-then-insert load would still hold ${sum(days.map((d) => d.rows_loaded))}.)`),
        days, k,
      };
    },
    verify: (p) => p.days.reduce((t, d, i) => t + d.rows_loaded * (i === p.k ? 2 : 1), 0),
  },
  'dm-orphans': {
    title: 'orphans in a fact table',
    make(r) {
      const dimKeys = [1, 2, 3, 4].slice(0, pick(r, 3, 4)), fact = Array.from({ length: pick(r, 6, 9) }, (_, i) => ({ sale_id: 900 + i, product_key: pick(r, 0, 7) === 0 ? null : pick(r, 1, 6) }));
      const answer = fact.filter((f) => f.product_key != null && !dimKeys.includes(f.product_key)).length;
      return {
        q: `<p>dim_product has product_key values <b>${dimKeys.join(', ')}</b>.</p>${rows(fact)}<p>The <b>relationships</b> test counts <b>orphans</b>: fact rows whose key is filled in but matches no dimension row. (A NULL key fails the not-null test instead.) How many orphans?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Ignore NULL keys. Count the rest whose key is not in the list of dimension keys.',
        solution: steps('Skip the NULL keys.', `Of the filled keys, those not in ${dimKeys.join(', ')} are orphans: <b>${answer}</b>.`),
        dimKeys, fact,
      };
    },
    verify: (p) => { let c = 0; p.fact.forEach((f) => { if (f.product_key !== null && p.dimKeys.indexOf(f.product_key) < 0) c++; }); return c; },
  },
  'dm-measure-ratio': {
    title: 'a margin that stays right',
    make(r) {
      const t = Array.from({ length: pick(r, 4, 5) }, () => { const s = pick(r, 20, 100, 20); return { region: ['East', 'West'][pick(r, 0, 1)], sales: s, profit: s * pick(r, 1, 5) / 10 }; });
      const reg = t[0].region, sel = t.filter((x) => x.region === reg), answer = (100 * sum(sel.map((x) => x.profit))) / sum(sel.map((x) => x.sales));
      return {
        q: `<p>The fact table:</p>${rows(t)}<p>A slicer filters to <b>${reg}</b>. The measure is <code>Margin % = SUM(profit) / SUM(sales)</code>. What does the report show, as a percentage?</p>`,
        answer, unit: '%', tol: 0.001,
        hint: 'Add profit and sales over the filtered rows first, then divide. Do not average the row margins.',
        solution: steps(`${reg} rows: sales ${sum(sel.map((x) => x.sales))}, profit ${n(sum(sel.map((x) => x.profit)), 4)}.`, `${n(sum(sel.map((x) => x.profit)), 4)} ÷ ${sum(sel.map((x) => x.sales))} × 100 = <b>${n(answer, 4)}</b> %.`),
        t, reg,
      };
    },
    verify: (p) => { const sel = p.t.filter((x) => x.region === p.reg), tot = sum(sel.map((x) => x.sales)); return sum(sel.map((x) => (x.sales / tot) * (100 * x.profit / x.sales))); },
  },
  'dm-scan-cost': {
    title: 'data scanned by a dashboard query',
    make(r) {
      const cols = [{ column: 'order_date', bytes: 4 }, { column: 'store_key', bytes: 4 }, { column: 'revenue', bytes: 8 }, { column: 'comment', bytes: 100 }];
      const rpd = pick(r, 10, 50, 10), d = pick(r, 7, 30, 7), use = cols.slice(0, 3), bytes = sum(use.map((c) => c.bytes));
      const answer = (rpd * bytes * d) / 1000;
      return {
        q: `<p>A columnar fact table is partitioned by day and gets <b>${rpd} million</b> rows a day. Column sizes:</p>${rows(cols)}<p>A dashboard query reads only <code>order_date, store_key, revenue</code> and filters to the last <b>${d} days</b>, so the other partitions are pruned. How many <b>GB</b> does it scan? (1 GB = 10<sup>9</sup> bytes.)</p>`,
        answer, unit: 'GB', tol: 0.001,
        hint: 'Rows scanned = rows per day × days. Bytes per row = only the columns the query touches (the comment column is never read).',
        solution: steps(`Rows scanned: ${rpd} million × ${d} = ${rpd * d} million.`, `Bytes per row read: ${use.map((c) => c.bytes).join(' + ')} = ${bytes}.`, `${rpd * d} × 10<sup>6</sup> × ${bytes} ÷ 10<sup>9</sup> = <b>${n(answer, 4)}</b> GB.`),
        rpd, d, bytes,
      };
    },
    verify: (p) => (p.rpd * 1e6 * p.d * p.bytes) / 1e9,
  },

  // ---------- Module 8: capstone and interviews ----------
  'dm-bus-shared': {
    title: 'conformed dimensions in a bus matrix',
    make(r) {
      const procs = ['Sales', 'Returns', 'Inventory', 'Orders'], dims = ['Date', 'Product', 'Store', 'Customer', 'Supplier'];
      const m = procs.map((p) => dims.map((d) => (d === 'Date' || pick(r, 0, 2) > 0 ? 1 : 0)));
      const answer = dims.filter((_, j) => sum(m.map((row) => row[j])) >= 2).length;
      return {
        q: `<p>A bus matrix (1 = the process uses that dimension):</p>${table(['process', ...dims], procs.map((p, i) => [p, ...m[i]]))}<p>A dimension used by <b>two or more</b> processes must be conformed (shared). How many dimensions in this matrix must be conformed?</p>`,
        answer, unit: 'dimensions', tol: 0, abs: 0.01,
        hint: 'Add up each column. Count the columns with a total of 2 or more.',
        solution: steps('Total each dimension column.', `Columns with at least two 1s: <b>${answer}</b>.`),
        procs, dims, m,
      };
    },
    verify: (p) => { let c = 0; for (let j = 0; j < p.dims.length; j++) { let k = 0; for (let i = 0; i < p.procs.length; i++) if (p.m[i][j]) k++; if (k > 1) c++; } return c; },
  },
  'dm-key-version': {
    title: 'facts on an old version',
    make(r) {
      const st = starts(r, pick(r, 2, 3)), facts = Array.from({ length: pick(r, 6, 8) }, () => ({ order: 0, date: pick(r, st[0], st[st.length - 1] + 40) })).map((f, i) => ({ ...f, order: 7001 + i }));
      const answer = facts.filter((f) => f.date < st[st.length - 1]).length;
      return {
        q: `<p>One customer has ${st.length} versions in dim_customer (version 1 starts ${day(st[0])}):</p>${rows(st.map((s, i) => ({ version: i + 1, valid_from: day(s), is_current: i === st.length - 1 ? 1 : 0 })))}<p>Their orders, each looked up by date (valid_from &le; date &lt; valid_to):</p>${rows(facts.map((f) => ({ order: f.order, order_date: day(f.date) })))}<p>How many order facts point at a version that is <b>not</b> current?</p>`,
        answer, unit: 'orders', tol: 0, abs: 0.01,
        hint: 'An order points at the current version only if its date is on or after the last valid_from.',
        solution: steps(`The current version starts ${day(st[st.length - 1])}.`, `Orders before that date use an older version: <b>${answer}</b>.`),
        st, facts,
      };
    },
    verify: (p) => p.facts.length - p.facts.filter((f) => f.date >= p.st[p.st.length - 1]).length,
  },
  'dm-export-recon': {
    title: 'reconciling an export',
    make(r) {
      const t = ['customers', 'products', 'stores', 'orders', 'order_items'].map((name) => { const src = pick(r, 40, 400, 20); return { table: name, source_rows: src, cloud_rows: src - (pick(r, 0, 2) === 0 ? pick(r, 1, 9) : 0) }; });
      const answer = sum(t.map((x) => x.source_rows - x.cloud_rows));
      return {
        q: `<p>After loading Northbay into a cloud database, you compare row counts:</p>${rows(t)}<p>How many rows in total did not make it to the cloud?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'For each table, subtract cloud rows from source rows, then add the differences.',
        solution: steps('Difference per table (source minus cloud).', `Total missing: <b>${answer}</b>. Zero in every row is what a clean export shows.`),
        t,
      };
    },
    verify: (p) => sum(p.t.map((x) => x.source_rows)) - sum(p.t.map((x) => x.cloud_rows)),
  },
  'dm-bridge-alloc': {
    title: 'allocating with a bridge table',
    make(r) {
      const w = [[50, 50], [60, 40], [50, 30, 20], [70, 20, 10]][pick(r, 0, 3)], names = ['Asha', 'Ben', 'Chloe'].slice(0, w.length), amount = pick(r, 200, 1000, 100), k = pick(r, 0, w.length - 1);
      const answer = (amount * w[k]) / 100;
      return {
        q: `<p>A sale of <b>$${amount}</b> was made by a team. The bridge table has an allocation weight (percent) for each member:</p>${rows(names.map((employee, i) => ({ employee, weight_pct: w[i] })))}<p>How many dollars of the sale are allocated to <b>${names[k]}</b>?</p>`,
        answer, unit: '$', tol: 0.001,
        hint: 'Multiply the sale by the member\'s weight divided by 100. The weights add up to 100, so nothing is lost or counted twice.',
        solution: steps(`${amount} × ${w[k]} ÷ 100 = <b>${n(answer, 4)}</b>.`),
        w, amount, k,
      };
    },
    verify: (p) => p.amount * (p.w[p.k] / sum(p.w)),
  },
  'dm-bridge-total': {
    title: 'a bridge without weights',
    make(r) {
      const sales = Array.from({ length: pick(r, 3, 4) }, (_, i) => ({ sale: 1 + i, amount: pick(r, 100, 500, 100), team_size: pick(r, 1, 3) }));
      const answer = sum(sales.map((s) => s.amount * s.team_size)), truth = sum(sales.map((s) => s.amount));
      return {
        q: `<p>Each sale is joined to a bridge table with one row per team member, and the weights are ignored:</p>${rows(sales)}<p><code>SELECT SUM(amount) FROM fact JOIN bridge ...</code> repeats a sale once per member. What total does that query show? (The true total is ${truth}.)</p>`,
        answer, unit: '$', tol: 0, abs: 0.01,
        hint: 'Each sale appears team_size times after the join, so add amount × team_size for every sale.',
        solution: steps('Multiply each amount by its team size.', `Add them up: <b>${answer}</b>, against a true ${truth}. Multiplying by the weight fixes it.`),
        sales,
      };
    },
    verify: (p) => { let s = 0; p.sales.forEach((x) => { for (let i = 0; i < x.team_size; i++) s += x.amount; }); return s; },
  },
};
