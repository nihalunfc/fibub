// Live problems for Pipeline to Dashboard, part c: Modules 5 and 6 (see ../problems.js).
// Exact counts and money are shown at full precision (no rounding to significant figures).
import { pick, n, steps, table } from './util.js';

const f = (v) => v.toLocaleString('en-CA');
const usd = (v, d = 0) => (v < 0 ? '−' : '') + '$' + Math.abs(v).toLocaleString('en-CA', { minimumFractionDigits: d, maximumFractionDigits: d });
const sum = (a) => a.reduce((s, v) => s + v, 0);

// 20 mornings of load finish times (minutes after 06:00): `late` of them after 07:00, the rest between 06:30 and 06:57.
function loadTimes(r) {
  const late = pick(r, 2, 6), s = pick(r, 0, 19), stepK = pick(r, 0, 1) ? 3 : 7;
  const lateAt = new Set(Array.from({ length: late }, (_, j) => (s + j * stepK) % 20));
  return Array.from({ length: 20 }, (_, i) => (lateAt.has(i) ? 62 + ((i * 11 + s) % 50) : 30 + ((i * 7 + s) % 28)));
}
const clock = (m) => `${String(6 + Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export default {
  // ---------- Module 5 ----------
  'dimensional-modelling-grain-fanout': {
    title: 'count the rows after a fan-out join',
    make(r) {
      const N = pick(r, 1200, 4800), X = pick(r, 150, 600), Y = pick(r, 40, 250);
      const answer = N + X + 2 * Y;
      return {
        q: `<p>A burger chain's fact table holds ${f(N)} order lines for one day. An analyst left-joins it to a <code>promotions</code> table on <code>menu_item_id</code>. That table has one row per item per active promotion. ${f(X)} of the order lines are for items with <b>2</b> active promotions, ${f(Y)} are for items with <b>3</b>, and every other line is for an item with 1 promotion or none.</p><p>How many rows come out of the join?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.5,
        hint: 'A left join repeats each order line once per matching promotion row, and keeps lines with no match once. Count the extra copies.',
        solution: steps(
          `Lines with 0 or 1 promotion come out once: ${f(N - X - Y)} rows.`,
          `Lines with 2 promotions come out twice: ${f(X)} × 2 = ${f(2 * X)} rows.`,
          `Lines with 3 promotions come out three times: ${f(Y)} × 3 = ${f(3 * Y)} rows.`,
          `Total: ${f(N - X - Y)} + ${f(2 * X)} + ${f(3 * Y)} = <b>${f(answer)} rows</b>, which is ${f(answer - N)} more than the ${f(N)} lines that exist. Any SUM over this result overstates revenue.`),
        N, X, Y,
      };
    },
    verify: (p) => (p.N - p.X - p.Y) * 1 + p.X * 2 + p.Y * 3,
  },
  'dimensional-modelling-grain-snapshot': {
    title: 'size a periodic snapshot fact table',
    make(r) {
      const S = pick(r, 5, 12), P = pick(r, 100, 900, 100), D = pick(r, 90, 92);
      const answer = S * P * D;
      return {
        q: `<p>A home-goods retailer wants a daily inventory snapshot: one row per store per SKU per day, with stock on hand. It has ${f(S)} stores, each stocking the same ${f(P)} SKUs. How many rows does the snapshot table gain over a quarter of ${D} days?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.5,
        hint: 'The grain sentence tells you the row count: one row for every combination of store, SKU and day.',
        solution: steps(
          `Rows per day = stores × SKUs = ${f(S)} × ${f(P)} = ${f(S * P)}.`,
          `Rows per quarter = ${f(S * P)} × ${D} = <b>${f(answer)} rows</b>.`,
          `A periodic snapshot grows with time even when nothing sells. That is normal; plan its storage and partition it by date.`),
        S, P, D,
      };
    },
    verify: (p) => Array.from({ length: p.S }, () => p.P * p.D).reduce((a, b) => a + b, 0),
  },
  'dimensions-scd2-rows': {
    title: 'count the rows in an SCD2 dimension',
    make(r) {
      const M = pick(r, 40, 120), c1 = pick(r, 10, 60), c2 = pick(r, 2, 15), c3 = pick(r, 3, 20);
      const answer = M + c1 + c2 + 1;
      return {
        q: `<p>A taco chain's <code>dim_menu_item</code> started the year with one row for each of its ${M} menu items, plus the unknown member (key −1). During the year:</p><ul><li>${c1} price changes (price is tracked as SCD2),</li><li>${c2} items moved to a different menu category (category is SCD2),</li><li>${c3} typos in item names were fixed (name is SCD1).</li></ul><p>No two changes hit the same item on the same day. How many rows does the dimension have at the end of the year?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.5,
        hint: 'Each SCD2 change closes one version and opens a new one: one extra row. An SCD1 change overwrites in place: no new row.',
        solution: steps(
          `Start: ${M} items + 1 unknown member = ${M + 1} rows.`,
          `SCD2 changes add a row each: ${c1} + ${c2} = ${c1 + c2} new rows.`,
          `SCD1 fixes add nothing: the ${c3} names are overwritten in every version.`,
          `Total: ${M + 1} + ${c1 + c2} = <b>${answer} rows</b>, of which exactly ${M + 1} have is_current = true.`),
        M, c1, c2, c3,
      };
    },
    verify: (p) => p.M + 1 + (p.c1 + p.c2 + p.c3) - p.c3,
  },
  'dimensions-scd2-list-revenue': {
    title: 'what overwriting a price does to history',
    make(r) {
      const p1 = Math.round((pick(r, 5, 7, 0.5) + 0.49) * 100), p2 = p1 + Math.round(pick(r, 0.3, 0.8, 0.1) * 100);
      const d = pick(r, 8, 20), q1 = pick(r, 300, 900), q2 = pick(r, 300, 900);
      const right = q1 * p1 + q2 * p2, wrong = (q1 + q2) * p2, answer = (wrong - right) / 100;
      return {
        q: `<p>The Classic Burger was $${(p1 / 100).toFixed(2)} until the price rose to $${(p2 / 100).toFixed(2)} at 00:00 on day ${d} of the month. Restaurants sold ${f(q1)} before the change and ${f(q2)} from the change onwards. A report values every sale at list price. By how many dollars does it overstate the month's revenue if price is SCD1 (overwritten) instead of SCD2 (each order joined to the version valid at its time)?</p>`,
        answer, unit: '$', tol: 0, abs: 0.006,
        hint: 'With SCD2 each sale uses the price valid at its time; with SCD1 every sale uses today\'s price. Work out both totals, or notice that only the sales before the change are valued differently.',
        solution: steps(
          `SCD2: ${f(q1)} × $${(p1 / 100).toFixed(2)} + ${f(q2)} × $${(p2 / 100).toFixed(2)} = ${usd(right / 100, 2)}.`,
          `SCD1: (${f(q1)} + ${f(q2)}) × $${(p2 / 100).toFixed(2)} = ${usd(wrong / 100, 2)}.`,
          `Overstatement: ${usd(wrong / 100, 2)} − ${usd(right / 100, 2)} = <b>${usd(answer, 2)}</b>: the ${f(q1)} earlier sales × the $${((p2 - p1) / 100).toFixed(2)} rise. The overwrite rewrote history.`),
        p1, p2, q1, q2,
      };
    },
    verify: (p) => (p.q1 * (p.p2 - p.p1)) / 100,
  },
  'senior-sql-spine': {
    title: 'count the missing days a date spine reveals',
    make(r) {
      const R = pick(r, 18, 40), D = pick(r, 28, 61), o = pick(r, 5, D - 5), m = pick(r, 15, 90);
      const spine = (R - 1) * D + o, T = spine - m;
      return {
        q: `<p>A pizza chain reports on ${R} restaurants over ${D} days. One of them opened late and should only appear for its last ${o} days (the spine filters on its open date). The daily revenue table has ${f(T)} rows, at most one per restaurant per day. After you left-join the spine to it, how many spine rows have <code>no_data = true</code>?</p>`,
        answer: m, unit: 'rows', tol: 0, abs: 0.5,
        hint: 'Spine rows = every restaurant × every day it was open. Rows with data are the ones the daily table fills; the rest are missing.',
        solution: steps(
          `Spine for the ${R - 1} restaurants open all period: ${R - 1} × ${D} = ${f((R - 1) * D)} rows.`,
          `Plus the late opener: ${o} rows. Spine total: ${f(spine)}.`,
          `Rows with data: ${f(T)}. Missing: ${f(spine)} − ${f(T)} = <b>${m} rows</b>. Without the spine, a ROWS-based moving average would silently skip those days.`),
        R, D, o, T,
      };
    },
    verify: (p) => (p.R - 1) * p.D + p.o - p.T,
  },
  'senior-sql-islands': {
    title: 'find the longest silent stretch with gaps and islands',
    make(r) {
      const st = pick(r, 1, 3), L = [pick(r, 1, 4), pick(r, 1, 5), pick(r, 1, 4)], g = [pick(r, 2, 4), pick(r, 2, 4)];
      const days = []; let d = st;
      L.forEach((len, i) => { for (let j = 0; j < len; j++) days.push(d + j); d += len + (g[i] ?? 0); });
      const grp = days.map((x, i) => x - (i + 1));
      const answer = Math.max(...L);
      return {
        q: `<p>A store's till files were missing on these days of the month: <b>${days.join(', ')}</b>. Using gaps and islands, how many days long is the longest run of consecutive missing days?</p>`,
        answer, unit: 'days', tol: 0, abs: 0.01,
        hint: 'Number the missing days 1, 2, 3, ... in order. Day minus that number stays the same inside a run; count how many share each value.',
        solution: steps(
          `row_number: ${days.map((_, i) => i + 1).join(', ')}.`,
          `day − row_number: ${grp.join(', ')}.`,
          `Group by that value: island sizes ${L.join(', ')}. The longest is <b>${answer} day${answer === 1 ? '' : 's'}</b>.`),
        days,
      };
    },
    verify: (p) => {
      let best = 1, cur = 1;
      for (let i = 1; i < p.days.length; i++) { cur = p.days[i] === p.days[i - 1] + 1 ? cur + 1 : 1; best = Math.max(best, cur); }
      return best;
    },
  },
  'dbt-basics-incremental': {
    title: 'rows saved by an incremental model',
    make(r) {
      const H = pick(r, 200, 600), per = pick(r, 400, 1500, 100), L = pick(r, 2, 4);
      const full = (H + 1) * per, inc = (L + 1) * per, answer = full - inc;
      return {
        q: `<p>A small coffee chain's <code>fct_order_lines</code> already holds ${H} business days of history, about ${f(per)} rows per day. Each morning one new day arrives. The incremental model rebuilds the new day plus the ${L} days before it (a ${L}-day look-back for late files). How many fewer rows does each morning's incremental run process than a full rebuild of all ${H + 1} days?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.5,
        hint: 'Full rebuild: every day including the new one. Incremental: the new day plus the look-back days. Subtract.',
        solution: steps(
          `Full rebuild: ${H + 1} days × ${f(per)} = ${f(full)} rows.`,
          `Incremental: (${L} + 1) days × ${f(per)} = ${f(inc)} rows.`,
          `Saved: ${f(full)} − ${f(inc)} = <b>${f(answer)} rows</b> every morning, about ${n(full / inc)} times less work.`),
        H, per, L,
      };
    },
    verify: (p) => (p.H - p.L) * p.per,
  },
  'dbt-in-dagster-backfill': {
    title: 'time a partitioned dbt backfill',
    make(r) {
      const P = pick(r, 30, 120), m = pick(r, 3, 9), c = pick(r, 2, 8);
      const waves = Math.ceil(P / c), answer = waves * m;
      return {
        q: `<p>You change a business rule in a chicken-wing chain's dbt model and backfill ${P} daily partitions from Dagster. Each partition's dbt run takes ${m} minutes, and the backfill may run ${c} partitions at once. Roughly how many minutes does the backfill take?</p>`,
        answer, unit: 'minutes', tol: 0, abs: 0.5,
        hint: `Runs go in waves of ${c}. Count the waves (round up: a half-full last wave still takes a full run), then multiply by the time per run.`,
        solution: steps(
          `Waves: ${P} ÷ ${c} = ${n(P / c)}, rounded up to ${waves}.`,
          `Time: ${waves} × ${m} = <b>${answer} minutes</b>.`,
          `Doubling concurrency only helps if the warehouse can take the extra load; check its limits first.`),
        P, m, c,
      };
    },
    verify: (p) => { let left = p.P, t = 0; while (left > 0) { left -= p.c; t += p.m; } return t; },
  },
  'metrics-semantic-layer-sss': {
    title: 'same-store sales growth',
    make(r) {
      const A = pick(r, 6000, 12000, 10) * 1000, g = pick(r, -4, 6, 0.1), B = Math.round((A * (1 + g / 100)) / 1000) * 1000;
      const k = pick(r, 10, 24), newS = pick(r, 2, 4), C = pick(r, 600, 1800, 10) * 1000, Z = pick(r, 200, 500, 10) * 1000;
      const answer = (B / A - 1) * 100;
      return {
        q: `<p>A restaurant group had ${k} restaurants open all of last year and all of this year. They sold ${usd(A)} last year and ${usd(B)} this year. One more restaurant sold ${usd(Z)} last year and then closed; ${newS} new restaurants opened this year and sold ${usd(C)} between them. What is same-store sales growth, in percent?</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: 'Same-store sales compares only the restaurants open in both whole periods. Leave out the closed one and the new ones.',
        solution: steps(
          `Comparable set: the ${k} restaurants. ${usd(B)} ÷ ${usd(A)} = ${(B / A).toFixed(5)}.`,
          `Growth: (${(B / A).toFixed(5)} − 1) × 100 = <b>${answer.toFixed(2)} %</b>.`,
          `Total growth would be (${usd(B + C)} ÷ ${usd(A + Z)} − 1) = ${(((B + C) / (A + Z) - 1) * 100).toFixed(2)} %, mixing in openings and closures.`),
        A, B,
      };
    },
    verify: (p) => ((p.B - p.A) / p.A) * 100,
  },
  'metrics-semantic-layer-avg-check': {
    title: 'average check as a ratio of sums',
    make(r) {
      const o = [pick(r, 300, 900), pick(r, 300, 900), pick(r, 900, 1600), pick(r, 300, 900)];
      const chk = [pick(r, 9, 13, 0.25), pick(r, 9, 13, 0.25), pick(r, 14, 18, 0.25), pick(r, 9, 13, 0.25)];
      const s = o.map((x, i) => Math.round(x * chk[i]));
      const answer = sum(s) / sum(o), avgAvg = sum(s.map((x, i) => x / o[i])) / 4;
      return {
        q: `<p>A sandwich shop's net sales and orders for four days:</p>${table(['Day', 'Net sales', 'Orders'], s.map((x, i) => [`Day ${i + 1}`, usd(x), f(o[i])]))}<p>What is the average check for the four days together (in dollars)?</p>`,
        answer, unit: '$', tol: 0.0005, abs: 0.005,
        hint: 'Average check is non-additive. Add up all the sales, add up all the orders, then divide once.',
        solution: steps(
          `Total net sales: ${s.map((x) => usd(x)).join(' + ')} = ${usd(sum(s))}.`,
          `Total orders: ${o.map(f).join(' + ')} = ${f(sum(o))}.`,
          `Average check: ${usd(sum(s))} ÷ ${f(sum(o))} = <b>$${answer.toFixed(2)}</b>. Averaging the four daily averages gives $${avgAvg.toFixed(2)}, which lets a quiet day count as much as the busy one.`),
        s, o,
      };
    },
    verify: (p) => p.s.reduce((a, b) => a + b, 0) / p.o.reduce((a, b) => a + b, 0),
  },
  'proof-restaurant-dbt-conservation': {
    title: 'find the revenue a transform lost',
    make(r) {
      const R = pick(r, 40000, 90000), d = pick(r, 100, 900), qu = pick(r, 50, 400), gap = pick(r, 0, 300, 10);
      const F = R - d - qu - gap;
      return {
        q: `<p>Your conservation test for one business date at a three-brand restaurant group reads: raw revenue ${usd(R)}, re-sent duplicates removed ${usd(d)}, quarantined rows ${usd(qu)}, revenue in <code>fct_order_lines</code> ${usd(F)}. How many dollars are unaccounted for (expected minus actual)?</p>`,
        answer: gap, unit: '$', tol: 0, abs: 0.5,
        hint: 'Expected fact revenue = raw − duplicates − quarantine. Compare it with what the fact table holds.',
        solution: steps(
          `Expected: ${usd(R)} − ${usd(d)} − ${usd(qu)} = ${usd(R - d - qu)}.`,
          `Actual: ${usd(F)}.`,
          gap ? `Unaccounted: ${usd(R - d - qu)} − ${usd(F)} = <b>${usd(gap)}</b>. The test fails: some transform drops or changes revenue, and it must be explained before release.` : `Unaccounted: <b>$0</b>. The test passes for this date.`),
        R, d, qu, F,
      };
    },
    verify: (p) => p.R - p.d - p.qu - p.F,
  },
  // ---------- Module 6 ----------
  'power-bi-models-bits': {
    title: 'size the index of a high-cardinality column',
    make(r) {
      const N = pick(r, 20, 80) * 1000000, D = pick(r, 2000000, 9000000, 1000);
      const bits = Math.ceil(Math.log2(D)), answer = (N * bits) / 8 / 1e6;
      return {
        q: `<p>A restaurant group's Import model has a fact table of ${f(N)} order lines. Its <code>order_time</code> column is stored to the second and has ${f(D)} distinct values. In the simple model where each row stores a dictionary index of ⌈log<sub>2</sub> D⌉ bits (before run-length encoding), how many megabytes (1 MB = 1,000,000 bytes) do the indexes for this column take?</p>`,
        answer, unit: 'MB', tol: 0.001,
        hint: 'Bits per row = the smallest whole number b with 2^b ≥ D. Multiply by the rows, divide by 8 for bytes, then by 1,000,000.',
        solution: steps(
          `2<sup>${bits - 1}</sup> = ${f(2 ** (bits - 1))} is less than ${f(D)} and 2<sup>${bits}</sup> = ${f(2 ** bits)} is at least that, so ${bits} bits per row.`,
          `${f(N)} × ${bits} = ${f(N * bits)} bits = ${f((N * bits) / 8)} bytes.`,
          `÷ 1,000,000 = <b>${f(answer)} MB</b>, plus a dictionary of ${f(D)} timestamps. Split into a date (a few hundred values) and a time to the minute (1,440 values) and the dictionaries shrink to almost nothing, and the sorted date column compresses into long runs.`),
        N, D,
      };
    },
    verify: (p) => { let b = 0; while (2 ** b < p.D) b++; return (p.N / 1e6) * (b / 8); },
  },
  'dax-correct-average-check': {
    title: 'the total row of a ratio measure',
    make(r) {
      const o = [pick(r, 40, 160), pick(r, 80, 240), pick(r, 30, 120)];
      const sales = o.map((x, i) => x * pick(r, [12, 16, 20][i], [18, 24, 30][i]));
      const answer = sum(sales) / sum(o), avg = sum(sales.map((x, i) => x / o[i])) / 3;
      return {
        q: `<p>A matrix shows <code>Average Check = DIVIDE([Net Sales], [Orders])</code> for three food-court stores:</p>${table(['Store', 'Net sales', 'Orders'], sales.map((x, i) => ['ABC'[i], usd(x), f(o[i])]))}<p>What does the measure show in the <b>Total</b> row (in dollars)?</p>`,
        answer, unit: '$', tol: 0.0005, abs: 0.005,
        hint: 'The total row evaluates the same measure with no store filter: total sales divided by total orders.',
        solution: steps(
          `Total net sales: ${sales.map((x) => usd(x)).join(' + ')} = ${usd(sum(sales))}.`,
          `Total orders: ${o.join(' + ')} = ${f(sum(o))}.`,
          `Total row: ${usd(sum(sales))} ÷ ${f(sum(o))} = <b>$${answer.toFixed(2)}</b>. Not the average of the three store values ($${avg.toFixed(2)}): that is correct behaviour, not a bug.`),
        sales, o,
      };
    },
    verify: (p) => p.sales.reduce((a, b) => a + b, 0) / p.o.reduce((a, b) => a + b, 0),
  },
  'dax-correct-occupancy': {
    title: 'group occupancy for a week',
    make(r) {
      const r1 = pick(r, 80, 160), r2 = pick(r, 180, 320);
      const n1 = Math.round(7 * r1 * pick(r, 0.55, 0.95, 0.01)), n2 = Math.round(7 * r2 * pick(r, 0.4, 0.8, 0.01));
      const answer = ((n1 + n2) / (7 * (r1 + r2))) * 100;
      return {
        q: `<p>Two hotels in a group, one week (7 nights). Hotel 1 has ${r1} rooms and sold ${f(n1)} room nights. Hotel 2 has ${r2} rooms and sold ${f(n2)}. What occupancy should the group total show, in percent?</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: 'Rooms available is rooms × nights in the filter context. Occupancy = room nights sold ÷ rooms available, both summed over the group.',
        solution: steps(
          `Rooms available: (${r1} + ${r2}) × 7 = ${f(7 * (r1 + r2))} room nights.`,
          `Sold: ${f(n1)} + ${f(n2)} = ${f(n1 + n2)}.`,
          `Occupancy: ${f(n1 + n2)} ÷ ${f(7 * (r1 + r2))} = <b>${answer.toFixed(2)} %</b>. The plain average of the two hotels' rates, ${(((n1 / (7 * r1)) + (n2 / (7 * r2))) * 50).toFixed(2)} %, ignores that Hotel 2 is bigger.`),
        r1, r2, n1, n2,
      };
    },
    verify: (p) => (100 * (p.n1 + p.n2)) / (7 * p.r1 + 7 * p.r2),
  },
  'ten-second-dashboards-bubble': {
    title: 'how much bigger a bubble looks',
    make(r) {
      const R = pick(r, 2, 6, 0.5), answer = R ** 0.7;
      return {
        q: `<p>On a map, the bubble for one region has ${R} times the area of another because its sales are ${R} times higher. If people perceive area roughly as (area)<sup>0.7</sup>, about how many times bigger does the larger bubble look?</p>`,
        answer, unit: '×', tol: 0.01,
        hint: `Perceived ratio = (area ratio)<sup>0.7</sup> = ${R}<sup>0.7</sup>.`,
        solution: steps(
          `Perceived ratio = ${R}<sup>0.7</sup> = <b>${answer.toFixed(2)}×</b>.`,
          `The real ratio is ${R}×, so readers underestimate the difference by about ${Math.round((1 - answer / R) * 100)} %.`,
          `A sorted bar chart next to the map shows the ${R}× difference at its true length.`),
        R,
      };
    },
    verify: (p) => Math.exp(0.7 * Math.log(p.R)),
  },
  'refresh-security-delivery-stale': {
    title: 'count the mornings a fixed refresh is stale',
    make(r) {
      const t = loadTimes(r), answer = t.filter((x) => x > 60).length;
      return {
        q: `<p>A hotel group's nightly load finished at these times over 20 mornings:</p><p>${t.map(clock).join(', ')}</p><p>The Power BI model refreshes on a fixed schedule at 07:00. On how many mornings did that refresh publish yesterday's data because the load had not finished?</p>`,
        answer, unit: 'mornings', tol: 0, abs: 0.01,
        hint: 'Count the finish times that are later than 07:00.',
        solution: steps(
          `Late finishes: ${t.filter((x) => x > 60).map(clock).join(', ')}.`,
          `That is <b>${answer} mornings</b> out of 20 (${answer * 5} %) where the dashboard showed stale numbers with no warning.`,
          `Triggering the refresh from the orchestrator when the load ends removes this whole class of problem.`),
        t,
      };
    },
    verify: (p) => p.t.reduce((s, x) => s + (x > 60 ? 1 : 0), 0),
  },
  'refresh-security-delivery-deadline': {
    title: 'count the mornings a triggered email misses its deadline',
    make(r) {
      const t = loadTimes(r), rf = pick(r, 12, 25), em = 2, cut = 120 - rf - em;
      const miss = t.filter((x) => x + rf + em > 120), answer = miss.length;
      return {
        q: `<p>The same hotel group now triggers the refresh when the load ends. The refresh takes ${rf} minutes and sending the email takes ${em} more. The email is due by 08:00. Load finish times over 20 mornings:</p><p>${t.map(clock).join(', ')}</p><p>On how many mornings would the email be late without a partial-data rule?</p>`,
        answer, unit: 'mornings', tol: 0, abs: 0.5,
        hint: `Work backwards from 08:00: the load must finish by 08:00 − ${rf} − ${em} minutes.`,
        solution: steps(
          `Latest safe finish: 08:00 − ${rf + em} minutes = ${clock(cut)}.`,
          answer ? `Finishes after ${clock(cut)}: ${miss.map(clock).join(', ')}.` : `No finish is later than ${clock(cut)}.`,
          `So <b>${answer} morning${answer === 1 ? '' : 's'}</b> would miss 08:00. For those, the agreed rule decides: send at 08:00 with a banner naming what is missing, or hold and notify.`),
        t, rf, em,
      };
    },
    verify: (p) => p.t.reduce((s, x) => s + (120 - x < p.rf + p.em ? 1 : 0), 0),
  },
  'open-source-bi-breakeven': {
    title: 'the break-even user count for self-hosted BI',
    make(r) {
      const p = pick(r, 10, 24), vm = pick(r, 40, 150, 5), h = pick(r, 2, 8), w = pick(r, 40, 90, 5), e = pick(r, 0, 1, 0.5);
      const fixed = vm + h * w, answer = Math.floor(fixed / (p - e)) + 1;
      return {
        q: `<p>A grocery chain compares two options for its managers' dashboards. A licensed tool, quoted at $${p} per user per month. Or self-hosted open-source BI: a server at $${vm} per month, ${h} hours of upkeep a month at $${w} an hour, and about $${e.toFixed(2)} per user per month for extra storage and email. What is the smallest number of users at which self-hosting is cheaper?</p>`,
        answer, unit: 'users', tol: 0, abs: 0.01,
        hint: 'Self-hosting is cheaper when p·u > fixed + e·u, so u > fixed ÷ (p − e). Take the next whole number.',
        solution: steps(
          `Fixed self-hosting cost: $${vm} + ${h} × $${w} = $${f(fixed)} a month.`,
          `Break-even: $${f(fixed)} ÷ ($${p} − $${e.toFixed(2)}) = ${(fixed / (p - e)).toFixed(3)} users.`,
          `The smallest whole number of users strictly above that: <b>${answer}</b>. Check the hidden costs too (sign-in, training, the time to build in a less familiar tool) before deciding.`),
        p, vm, h, w, e,
      };
    },
    verify: (q) => { let u = 1; while (q.p * u <= q.vm + q.h * q.w + q.e * u) u++; return u; },
  },
  'reconciliation-residual': {
    title: 'the residual of a reconciliation bridge',
    make(r) {
      const A = pick(r, 180000, 520000), t = Math.round((A * 0.13) / 1.13), tm = pick(r, 300, 2500), rf = pick(r, 500, 4000), res = pick(r, -400, 400, 10);
      const explained = A - t - tm + rf, B = explained + res;
      return {
        q: `<p>A store manager reports September sales of ${usd(A)}. You bridge it to your dashboard with evidence for each step:</p><ul><li>sales tax included in the store figure: −${usd(t)},</li><li>late-night sales on 30 Sept that the business-day rule books to 1 Oct: −${usd(tm)},</li><li>refunds the store nets out but the dashboard shows before refunds: +${usd(rf)}.</li></ul><p>The dashboard shows ${usd(B)}. What is the residual (dashboard minus explained figure), in dollars?</p>`,
        answer: res, unit: '$', tol: 0, abs: 0.5,
        hint: 'Apply each step to the store figure to get the explained figure, then subtract it from the dashboard number. Keep the sign.',
        solution: steps(
          `Explained: ${usd(A)} − ${usd(t)} − ${usd(tm)} + ${usd(rf)} = ${usd(explained)}.`,
          `Residual: ${usd(B)} − ${usd(explained)} = <b>${usd(res)}</b>.`,
          res ? `That residual is ${((Math.abs(res) / A) * 100).toFixed(3)} % of the store figure. Trace it to named rows (quarantine, a duplicate, a late file) before calling the bridge done.` : `The bridge closes exactly. Record the evidence for each step.`),
        A, t, tm, rf, B,
      };
    },
    verify: (p) => p.B - (p.A - p.t - p.tm + p.rf),
  },
  'proof-chain-dashboards-controls': {
    title: 'count the days a control-total check fails',
    make(r) {
      const fails = pick(r, 1, 3), s0 = pick(r, 0, 6);
      const failAt = new Set(Array.from({ length: fails }, (_, j) => (s0 + j * 3) % 7));
      const src = Array.from({ length: 7 }, (_, i) => 30000 + ((i * 7919 + s0 * 104729) % 25000));
      const wh = src.map((s, i) => (failAt.has(i) ? s - Math.round(s * (0.002 + 0.001 * ((i + s0) % 6))) : s - ((i * 3 + s0) % 4) * Math.round(s * 0.0001)));
      const answer = src.filter((s, i) => Math.abs(s - wh[i]) > s * 0.001).length;
      return {
        q: `<p>A daily control-total check compares each day's POS file totals with <code>fct_restaurant_daily</code>. It fails when the gap is more than 0.1 % of the source total.</p>${table(['Day', 'Source total', 'Warehouse'], src.map((s, i) => [`Day ${i + 1}`, usd(s), usd(wh[i])]))}<p>On how many days does the check fail?</p>`,
        answer, unit: 'days', tol: 0, abs: 0.01,
        hint: 'For each day, compute 0.1 % of the source total (source ÷ 1,000) and compare the gap with it.',
        solution: steps(
          ...src.map((s, i) => `Day ${i + 1}: gap ${usd(s - wh[i])}, limit ${usd(s / 1000, 2)}: ${Math.abs(s - wh[i]) > s * 0.001 ? '<b>fail</b>' : 'pass'}.`),
          `<b>${answer} day${answer === 1 ? '' : 's'}</b> fail. Each failure blocks the report and opens an investigation with the bridge method.`),
        src, wh,
      };
    },
    verify: (p) => p.src.reduce((c, s, i) => c + (1000 * Math.abs(s - p.wh[i]) > s ? 1 : 0), 0),
  },
  'proof-chain-dashboards-trust': {
    title: 'the weakest link in a chain of trust',
    make(r) {
      const P = [pick(r, 0.95, 0.99, 0.01), pick(r, 0.85, 0.92, 0.01), pick(r, 0.93, 0.98, 0.01), pick(r, 0.93, 0.97, 0.01)];
      const lo = P.indexOf(Math.min(...P)), Q = P.map((x, i) => (i === lo ? 0.99 : x));
      const answer = Q.reduce((a, b) => a * b, 1) * 100, before = P.reduce((a, b) => a * b, 1) * 100;
      const names = ['correct data', 'correct measures', 'fresh on time', 'clear to read'];
      return {
        q: `<p>Treat a report's trust as a chain of four links: ${names.map((x, i) => `${x} ${Math.round(P[i] * 100)} %`).join(', ')}. You can raise one link to 99 %. If you raise the weakest, what is the chance (in percent) that all four hold?</p>`,
        answer, unit: '%', tol: 0.002,
        hint: 'The chance all links hold is the product of the four. Find the smallest, replace it with 0.99, multiply.',
        solution: steps(
          `Now: ${P.map((x) => x.toFixed(2)).join(' × ')} = ${(before / 100).toFixed(4)}, about ${before.toFixed(1)} %.`,
          `Weakest link: ${names[lo]} at ${Math.round(P[lo] * 100)} %. Raise it to 99 %.`,
          `After: ${Q.map((x) => x.toFixed(2)).join(' × ')} = <b>${answer.toFixed(1)} %</b>. Raising any other link to 99 % would gain less.`),
        P,
      };
    },
    verify: (p) => { const s = [...p.P].sort((a, b) => a - b); return 99 * s[1] * s[2] * s[3]; },
  },
};
