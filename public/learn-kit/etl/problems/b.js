// Live problems for Pipeline to Dashboard, part b: Modules 3 and 4 (see ../problems.js).
import { pick, n, steps, table } from './util.js';

const money = (v) => (v < 0 ? '−$' : '$') + Math.abs(v).toLocaleString('en-CA', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
const int = (v) => v.toLocaleString('en-CA');
const sum = (a) => a.reduce((s, v) => s + v, 0);

export default {
  // ---------- Module 3: Orchestrate with Dagster ----------
  'what-orchestrators-do-critical-path': {
    title: 'find the shortest possible run time of a pipeline graph',
    make(r) {
      const ex = pick(r, 6, 14), c = [pick(r, 3, 9), pick(r, 4, 12), pick(r, 2, 8)], m = pick(r, 3, 8), rep = pick(r, 1, 4);
      const answer = ex + Math.max(...c) + m + rep;
      return {
        q: `<p>A hotel group's morning pipeline: <b>extract</b> takes ${ex} min. Then three cleaning steps run side by side (no arrows between them): bookings ${c[0]} min, rates ${c[1]} min, guests ${c[2]} min. A <b>model</b> step needs all three and takes ${m} min, then the <b>report</b> takes ${rep} min. With enough workers, what is the shortest time the whole run can take?</p>`,
        answer, unit: 'minutes', tol: 0, abs: 0.01,
        hint: 'Parallel steps overlap, so only the slowest of them counts. Add the times along the longest path from start to end.',
        solution: steps(
          `The three cleans start together after extract; the model must wait for the slowest one: max(${c.join(', ')}) = ${Math.max(...c)} min.`,
          `Longest path: extract ${ex} + slowest clean ${Math.max(...c)} + model ${m} + report ${rep}.`,
          `Shortest run = <b>${answer} min</b>. Speeding up a step that is not on this path saves nothing.`),
        ex, c, m, rep,
      };
    },
    verify: (p) => p.c.reduce((best, v) => Math.max(best, p.ex + v + p.m + p.rep), 0),
  },
  'dagster-assets-latest-rows': {
    title: 'count rows after keeping the latest version of each booking',
    make(r) {
      const once = pick(r, 120, 400), twice = pick(r, 20, 80), thrice = pick(r, 3, 15);
      const raw = once + 2 * twice + 3 * thrice, answer = once + twice + thrice;
      return {
        q: `<p>A hotel's booking extract is a change feed: a booking appears again each time its status changes. Today's raw file has ${int(raw)} rows. ${int(once)} bookings appear once, ${twice} appear twice and ${thrice} appear three times. The <code>stg_bookings</code> asset keeps only the latest version of each booking. How many rows should its <code>rows</code> metadata show?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'After "keep the latest version", each booking is one row, however many times it appeared.',
        solution: steps(
          `Check the raw count: ${once} + 2 × ${twice} + 3 × ${thrice} = ${int(raw)} rows.`,
          `Latest version = one row per booking: ${once} + ${twice} + ${thrice} = <b>${int(answer)}</b> rows.`,
          `The other metadata field, status changes, is ${int(raw)} − ${int(answer)} = ${raw - answer}.`),
        raw, twice, thrice,
      };
    },
    verify: (p) => p.raw - p.twice - 2 * p.thrice,
  },
  'dagster-resources-config-ci': {
    title: 'time saved per day by testing with a fake resource',
    make(r) {
      const tests = pick(r, 20, 60, 5), real = pick(r, 2, 6, 0.5), fake = 0.05, runs = pick(r, 8, 30);
      const answer = (tests * (real - fake) * runs) / 60;
      return {
        q: `<p>A retailer's pipeline has ${tests} asset tests. With the real SFTP resource each test spends ${real} s connecting; with a fake folder resource that has the same <code>list_ready</code> method it spends ${fake} s. The test suite runs ${runs} times a day in CI. How many <b>minutes</b> a day does the fake resource save?</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: 'Saving per test × tests per run × runs per day gives seconds. Divide by 60.',
        solution: steps(
          `Saving per test: ${real} − ${fake} = ${n(real - fake)} s.`,
          `Per run: ${tests} × ${n(real - fake)} = ${n(tests * (real - fake))} s. Per day: × ${runs} = ${n(tests * (real - fake) * runs)} s.`,
          `In minutes: ÷ 60 = <b>${n(answer)} min</b>, and the tests no longer fail when the vendor's server is down.`),
        tests, real, fake, runs,
      };
    },
    verify: (p) => (p.tests * p.real * p.runs - p.tests * p.fake * p.runs) / 60,
  },
  'partitions-backfills-runtime': {
    title: 'how long a backfill takes with limited concurrency',
    make(r) {
      const days = pick(r, 9, 45), per = pick(r, 20, 90, 5), conc = pick(r, 2, 8);
      const waves = Math.ceil(days / conc), answer = (waves * per) / 60;
      return {
        q: `<p>A restaurant chain fixed a bug in its <code>stg_pos</code> cleaning rule. The bug affected ${days} daily partitions. Each partition run takes ${per} s, and the deployment allows at most ${conc} runs at once. Runs start in waves. How many <b>minutes</b> does the backfill take?</p>`,
        answer, unit: 'minutes', tol: 0.005,
        hint: `Waves = days ÷ runs at once, rounded <b>up</b> (a half-full last wave still takes a full ${per} s).`,
        solution: steps(
          `Waves: ${days} ÷ ${conc} = ${n(days / conc)}, rounded up to ${waves}.`,
          `Time: ${waves} × ${per} s = ${waves * per} s.`,
          `In minutes: <b>${n(answer)} min</b>. The other partitions are not touched.`),
        days, per, conc,
      };
    },
    verify: (p) => { let t = 0; for (let left = p.days; left > 0; left -= p.conc) t += p.per; return t / 60; },
  },
  'partitions-backfills-count': {
    title: 'count the partitions of a multi-partitioned asset',
    make(r) {
      const sites = pick(r, 4, 40), years = pick(r, 1, 3), extra = pick(r, 0, 1);
      const days = 365 * years + extra, answer = sites * days;
      return {
        q: `<p>A hotel group partitions an asset by date × hotel. It has ${sites} hotels and ${int(days)} days of history. How many partitions does Dagster track?</p>`,
        answer, unit: 'partitions', tol: 0, abs: 0.01,
        hint: 'A multi-partition has one partition per combination: multiply the two counts.',
        solution: steps(
          `Combinations: ${sites} hotels × ${int(days)} days.`,
          `= <b>${int(answer)}</b> partitions. ${answer > 20000 ? 'That is a lot to track and grows every day: partition by date and loop over hotels inside each run.' : 'A manageable number for now, but it grows by ' + sites + ' every day.'}`),
        sites, days,
      };
    },
    verify: (p) => p.days * p.sites,
  },
  'schedules-sensors-retries': {
    title: 'how many attempts a retry policy needs',
    make(r) {
      const p = pick(r, 0.05, 0.3, 0.05), target = [0.99, 0.999, 0.9999][pick(r, 0, 2)];
      const answer = Math.ceil(Math.log(1 - target) / Math.log(p) - 1e-9);
      return {
        q: `<p>An ad network's API times out on ${n(p * 100)} % of calls, independently each time. How many attempts in total (first try plus retries) does the <code>raw_ads</code> asset need so that it succeeds with probability at least ${n(target * 100, 5)} %?</p>`,
        answer, unit: 'attempts', tol: 0, abs: 0.01,
        hint: `All n attempts fail with probability p<sup>n</sup>. Find the smallest n with 1 − p<sup>n</sup> ≥ ${target}.`,
        solution: steps(
          `Need p<sup>n</sup> ≤ ${n(1 - target)}, with p = ${p}.`,
          `n ≥ log(${n(1 - target)}) ÷ log(${p}) = ${n(Math.log(1 - target) / Math.log(p))}, so n = ${answer}.`,
          `Check: 1 − ${p}<sup>${answer}</sup> = ${n(1 - p ** answer, 6)}. Set <code>max_retries=${answer - 1}</code>. (A schema error fails every time: no number of retries helps.)`),
        p, target,
      };
    },
    verify: (p) => { let k = 1; while (1 - p.p ** k < p.target - 1e-12) k++; return k; },
  },
  'asset-checks-deploy-tco': {
    title: 'compare the monthly cost of self-hosting and a managed plan',
    make(r) {
      const vm = pick(r, 30, 80, 5), hs = pick(r, 2, 8), rate = pick(r, 40, 90, 5), plan = pick(r, 150, 400, 25), hm = pick(r, 0.5, 1.5, 0.5);
      const self = vm + hs * rate, man = plan + hm * rate, answer = man - self;
      return {
        q: `<p>A small retailer compares two ways to run Dagster. <b>Self-hosted:</b> a VM at ${money(vm)} a month plus ${hs} hours of upkeep. <b>Managed:</b> ${money(plan)} a month plus ${hm} hours of upkeep. Staff time costs ${money(rate)} an hour. What is managed minus self-hosted, in dollars per month? (A negative answer means managed is cheaper.)</p>`,
        answer, unit: '$ per month', tol: 0, abs: 0.5,
        hint: 'Total cost = money paid + hours × hourly rate, for each option. Then subtract.',
        solution: steps(
          `Self-hosted: ${money(vm)} + ${hs} × ${money(rate)} = ${money(self)}.`,
          `Managed: ${money(plan)} + ${hm} × ${money(rate)} = ${money(man)}.`,
          `Managed − self-hosted = <b>${money(answer)}</b>. ${Math.abs(answer) < 60 ? 'Close enough that reliability and skills should decide.' : answer > 0 ? 'Self-hosting is cheaper, if the hours estimate is honest.' : 'The managed plan is cheaper once time is counted.'}`),
        vm, hs, rate, plan, hm,
      };
    },
    verify: (p) => p.plan - p.vm + (p.hm - p.hs) * p.rate,
  },
  'proof-hotel-dagster-adr': {
    title: 'group ADR from hotel totals',
    make(r) {
      const nights = [pick(r, 80, 300, 10), pick(r, 150, 500, 10), pick(r, 60, 250, 10)];
      const adr = [pick(r, 120, 260, 5), pick(r, 90, 180, 5), pick(r, 150, 320, 5)];
      const rev = nights.map((v, i) => v * adr[i]), answer = sum(rev) / sum(nights);
      return {
        q: `<p>Three hotels in a group, last night:</p>${table(['Hotel', 'Room nights sold', 'Room revenue'], nights.map((v, i) => [`H${i + 1}`, v, money(rev[i])]))}<p>What is the <b>group ADR</b> (average daily rate: room revenue per room night sold), in dollars?</p>`,
        answer, unit: '$', tol: 0.002,
        hint: 'ADR is a ratio: add up revenue and nights first, then divide. Do not average the three hotels’ ADRs.',
        solution: steps(
          `Total revenue: ${rev.map(money).join(' + ')} = ${money(sum(rev))}.`,
          `Total nights: ${nights.join(' + ')} = ${sum(nights)}.`,
          `Group ADR = ${money(sum(rev))} ÷ ${sum(nights)} = <b>${money(+answer.toFixed(2))}</b>. The plain average of ${adr.map(money).join(', ')} would be ${money(+(sum(adr) / 3).toFixed(2))}: wrong, because the hotels sold different numbers of nights.`),
        nights, adr,
      };
    },
    verify: (p) => p.nights.reduce((s, v, i) => s + (v / sum(p.nights)) * p.adr[i], 0),
  },
  'proof-hotel-dagster-occupancy': {
    title: 'occupancy on the books for one stay date',
    make(r) {
      const rooms = [pick(r, 80, 200, 10), pick(r, 100, 300, 10)], otb = rooms.map((v) => Math.round(v * pick(r, 0.4, 0.9, 0.05)));
      const answer = (100 * (otb[0] + otb[1])) / (rooms[0] + rooms[1]);
      return {
        q: `<p>For stay date 3 October, hotel H1 (${rooms[0]} rooms) has ${otb[0]} confirmed room nights on the books and hotel H2 (${rooms[1]} rooms) has ${otb[1]}. What is the two-hotel <b>occupancy on the books</b>, in percent?</p>`,
        answer, unit: '%', tol: 0.002,
        hint: 'Occupancy OTB = room nights on the books ÷ rooms available. Add both hotels first.',
        solution: steps(
          `On the books: ${otb[0]} + ${otb[1]} = ${otb[0] + otb[1]} room nights.`,
          `Rooms available: ${rooms[0]} + ${rooms[1]} = ${rooms[0] + rooms[1]}.`,
          `Occupancy OTB = ${otb[0] + otb[1]} ÷ ${rooms[0] + rooms[1]} = <b>${n(answer)} %</b>.`),
        rooms, otb,
      };
    },
    verify: (p) => 100 - (100 * (p.rooms[0] - p.otb[0] + p.rooms[1] - p.otb[1])) / (p.rooms[0] + p.rooms[1]),
  },

  // ---------- Module 4: Load to the warehouse ----------
  'where-data-lives-size': {
    title: 'estimate the size of a sales history before choosing a warehouse',
    make(r) {
      const stores = pick(r, 40, 400, 20), lines = pick(r, 500, 3000, 100), years = pick(r, 2, 5), bytes = pick(r, 80, 160, 10), ratio = pick(r, 5, 10);
      const raw = (stores * lines * 365 * years * bytes) / 1e9, answer = raw / ratio;
      return {
        q: `<p>A quick-service restaurant chain has ${stores} restaurants, each selling about ${int(lines)} order lines a day. It wants ${years} years of history (use 365 days a year). Each row is about ${bytes} bytes raw, and a column store compresses it about ${ratio} times. Estimate the <b>compressed</b> size in GB (1 GB = 10<sup>9</sup> bytes).</p>`,
        answer, unit: 'GB', tol: 0.01,
        hint: 'Raw bytes = restaurants × lines per day × days × bytes per row. Divide by 10⁹ for GB, then by the compression ratio.',
        solution: steps(
          `Rows: ${stores} × ${int(lines)} × ${365 * years} = ${n(stores * lines * 365 * years)}.`,
          `Raw: × ${bytes} bytes = ${n(raw)} GB.`,
          `Compressed: ÷ ${ratio} = <b>${n(answer)} GB</b>. ${answer < 500 ? 'One well-modelled SQL database handles this.' : 'Big enough to compare cloud column stores.'}`),
        stores, lines, years, bytes, ratio,
      };
    },
    verify: (p) => ((p.bytes / p.ratio) * p.years * 365 * p.lines * p.stores) / 1e9,
  },
  'azure-sql-hands-on-roundtrips': {
    title: 'network wait when loading in batches',
    make(r) {
      const rows = pick(r, 100000, 2000000, 50000), rtt = pick(r, 10, 60, 5), b = [1000, 5000, 10000, 50000][pick(r, 0, 3)];
      const trips = Math.ceil(rows / b), answer = (trips * rtt) / 1000;
      return {
        q: `<p>An ad network loads ${int(rows)} rows into Azure SQL. Each round trip to the database takes ${rtt} ms. With <code>fast_executemany</code> the rows go in batches of ${int(b)}. How many <b>seconds</b> are spent just waiting on round trips?</p>`,
        answer, unit: 's', tol: 0.005,
        hint: 'Trips = rows ÷ batch size (rounded up). Waiting = trips × round-trip time.',
        solution: steps(
          `Trips: ${int(rows)} ÷ ${int(b)} = ${int(trips)}.`,
          `Waiting: ${int(trips)} × ${rtt} ms = ${int(trips * rtt)} ms = <b>${n(answer)} s</b>.`,
          `Row by row it would be ${int(rows)} × ${rtt} ms = ${n((rows * rtt) / 1000)} s, about ${n((rows * rtt) / 3.6e6)} hours.`),
        rows, rtt, b,
      };
    },
    verify: (p) => (Math.ceil(p.rows / p.b) * p.rtt) / 1000,
  },
  'loading-patterns-merge-count': {
    title: 'rows in the target after a MERGE',
    make(r) {
      const target = pick(r, 2000, 9000, 100), staged = pick(r, 100, 400, 10), existing = Math.round(staged * pick(r, 0.5, 0.9, 0.05)), changed = Math.round(existing * pick(r, 0.1, 0.5, 0.1));
      const answer = target + staged - existing;
      return {
        q: `<p>An agency's <code>fct_ads_daily</code> has ${int(target)} rows. Today's look-back load puts ${staged} rows in staging. ${existing} of their keys (date, campaign) are already in the target, and ${changed} of those have new numbers. After the MERGE, how many rows does the target have?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Matched rows are updated (or skipped) in place: they do not add rows. Only keys not yet in the target are inserted.',
        solution: steps(
          `Inserted: ${staged} − ${existing} = ${staged - existing} new keys.`,
          `Updated: ${changed}; unchanged and skipped: ${existing - changed}. Neither changes the row count.`,
          `Target: ${int(target)} + ${staged - existing} = <b>${int(answer)}</b> rows. Run it again and the count stays the same: that is idempotence.`),
        target, staged, existing,
      };
    },
    verify: (p) => p.target - (p.existing - p.staged),
  },
  'loading-patterns-partial': {
    title: 'what a failed delete-insert leaves without a transaction',
    make(r) {
      const old = pick(r, 20000, 60000, 1000), add = pick(r, 500, 3000, 100), at = pick(r, 5000, old - 1000, 1000);
      return {
        q: `<p>A restaurant chain reloads one business day: delete the day's ${int(old)} rows, then insert ${int(old + add)} fresh rows. The insert crashes after ${int(at)} rows, and the two statements were <b>not</b> in a transaction. How many rows does that day now have in the warehouse?</p>`,
        answer: at, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Without a transaction, the delete already happened for good. Only the rows inserted before the crash are there.',
        solution: steps(
          `The delete committed on its own: ${int(old)} rows gone.`,
          `The insert stopped after ${int(at)} rows, and those stay.`,
          `Rows for the day: <b>${int(at)}</b>, so the report shows too little revenue. Inside one transaction the crash would roll back to the original ${int(old)}.`),
        old, at,
      };
    },
    verify: (p) => p.old - (p.old - p.at),
  },
  'postgres-duckdb-clickhouse-median': {
    title: 'cold time and warm median from benchmark runs',
    make(r) {
      const cold = pick(r, 1.5, 4, 0.1), base = pick(r, 0.3, 0.9, 0.01);
      const warm = [-0.03, 0.02, -0.01, 0.04].map((d, i) => +(base + d + pick(r, 0, 0.02, 0.01) * (i % 2 ? 1 : -1)).toFixed(2));
      const s = [...warm].sort((a, b) => a - b), answer = (s[1] + s[2]) / 2;
      return {
        q: `<p>You time the same query five times on DuckDB (seconds): ${[cold, ...warm].join(', ')}. The first run is cold (data read from disk). What is the <b>warm median</b>?</p>`,
        answer, unit: 's', tol: 0.001,
        hint: 'Leave out the cold first run, sort the other four, and take the middle. With four values, average the two middle ones.',
        solution: steps(
          `Cold run: ${cold} s. Report it separately.`,
          `Warm runs sorted: ${s.join(', ')}.`,
          `Median of four = (${s[1]} + ${s[2]}) ÷ 2 = <b>${n(answer)} s</b>.`),
        warm,
      };
    },
    verify: (p) => { const s = [...p.warm].sort((a, b) => b - a); return (s[1] + s[2]) / 2; },
  },
  'tsql-for-warehouses-levels': {
    title: 'page reads for an index seek',
    make(r) {
      const f = [200, 300, 400, 500][pick(r, 0, 3)], rows = [1e6, 5e6, 2e7, 1e8, 1e9][pick(r, 0, 4)];
      const answer = Math.ceil(Math.log(rows) / Math.log(f) - 1e-9);
      return {
        q: `<p>A B-tree index on a retailer's fact table has a fan-out of ${f} (each page points to ${f} pages below it). The table has ${n(rows)} rows. About how many page reads does a seek for one key need (the number of levels, rounded up)?</p>`,
        answer, unit: 'reads', tol: 0, abs: 0.01,
        hint: `Find the smallest L with ${f}<sup>L</sup> ≥ rows. That is log(rows) ÷ log(${f}), rounded up.`,
        solution: steps(
          `log(${n(rows)}) ÷ log(${f}) = ${n(Math.log(rows) / Math.log(f))}.`,
          `Rounded up: <b>${answer}</b> levels, so about ${answer} page reads.`,
          `A full scan would read every page of the table: thousands or millions of reads instead of ${answer}.`),
        f, rows,
      };
    },
    verify: (p) => { let L = 0, c = 1; while (c < p.rows) { c *= p.f; L++; } return L; },
  },
  'security-cost-azure-serverless': {
    title: 'billed hours for a serverless database',
    make(r) {
      const load = pick(r, 0.5, 2, 0.25), refresh = pick(r, 2, 6), mins = pick(r, 5, 15, 5), delay = pick(r, 1, 2, 0.5), days = 30;
      const day = load + delay + refresh * (mins / 60 + delay), answer = day * days;
      return {
        q: `<p>An agency's serverless Azure SQL database runs a ${load}-hour load each morning. Power BI then refreshes ${refresh} times a day, ${mins} minutes each, spread hours apart. After each burst of activity the database waits ${delay} h before it pauses (the auto-pause delay), and you pay for compute while it waits. Roughly how many compute hours are billed in a ${days}-day month?</p>`,
        answer, unit: 'hours', tol: 0.005,
        hint: 'Each activity window costs its own length plus the delay. Add up one day, then multiply by 30.',
        solution: steps(
          `Load: ${load} + ${delay} = ${n(load + delay)} h.`,
          `Each refresh: ${n(mins / 60)} + ${delay} = ${n(mins / 60 + delay)} h; × ${refresh} = ${n(refresh * (mins / 60 + delay))} h.`,
          `Per day ${n(day)} h; per month × ${days} = <b>${n(answer)} h</b>. Most of it is waiting to pause: line the refreshes up with the load to save it.`),
        load, refresh, mins, delay, days,
      };
    },
    verify: (p) => p.days * ((p.refresh + 1) * p.delay + p.load + (p.refresh * p.mins) / 60),
  },
  'proof-ads-warehouse-roas': {
    title: 'total ROAS across channels',
    make(r) {
      const ch = ['Search', 'Social', 'Display'];
      const spend = [pick(r, 4000, 12000, 500), pick(r, 2000, 8000, 500), pick(r, 1000, 5000, 500)], roas = [pick(r, 2.5, 5, 0.5), pick(r, 0.5, 2.5, 0.5), pick(r, 0.5, 2, 0.5)];
      const val = spend.map((s, i) => s * roas[i]), answer = sum(val) / sum(spend);
      return {
        q: `<p>An agency's client spent this month:</p>${table(['Channel', 'Spend', 'ROAS'], ch.map((c, i) => [c, money(spend[i]), roas[i]]))}<p>What is the client's <b>total ROAS</b> (conversion value ÷ spend) across all three channels?</p>`,
        answer, unit: '× spend', tol: 0.002,
        hint: 'Turn each ROAS back into conversion value (spend × ROAS), add the values and the spends, then divide.',
        solution: steps(
          `Values: ${val.map(money).join(' + ')} = ${money(sum(val))}.`,
          `Spend: ${spend.map(money).join(' + ')} = ${money(sum(spend))}.`,
          `Total ROAS = ${money(sum(val))} ÷ ${money(sum(spend))} = <b>${n(answer)}</b>. The plain mean of the three ROAS values, ${n(sum(roas) / 3)}, ignores how much was spent where.`),
        spend, roas,
      };
    },
    verify: (p) => p.spend.reduce((s, v, i) => s + (v / sum(p.spend)) * p.roas[i], 0),
  },
};
