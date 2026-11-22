// Live problems for Data at Scale, part a: Modules 1-4 (see ../problems.js).
// Every company and number is synthetic. Prices are example rates stated in the question, never a price list.
import { pick, n, steps, table } from './util.js';

const fmtInt = (v) => Math.round(v).toLocaleString('en-CA');
const money = (v) => '$' + (+v).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const hm = (mins) => { const h = Math.floor(mins / 60), m = Math.round(mins % 60); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; };

export default {
  // ---------- Module 1: the big picture ----------
  'why-big-data-scaleout': {
    title: 'how long a scan takes on one machine and on a cluster',
    make(r) {
      const S = pick(r, 200, 1200, 100), rate = pick(r, 200, 500, 50), N = pick(r, 4, 20, 2), o = pick(r, 20, 90, 10);
      const one = (S * 1000) / rate, each = one / N, answer = (each + o) / 60;
      return {
        q: `<p>A supermarket chain keeps ${S} GB of till receipts. One machine reads data at ${rate} MB per second. The team splits the files evenly over a cluster of <b>${N} machines</b> that read at the same time. Starting the job and combining the small results adds ${o} seconds. How many <b>minutes</b> does the cluster take? (Use 1 GB = 1,000 MB.)</p>`,
        answer, unit: 'minutes', tol: 0.005,
        hint: 'First find how long one machine would take for all the data. Each of the N machines reads only 1/N of it, at the same time as the others. Then add the fixed overhead.',
        solution: steps(
          `One machine alone: ${fmtInt(S * 1000)} MB ÷ ${rate} MB/s = ${fmtInt(one)} s (about ${n(one / 60)} minutes).`,
          `Split ${N} ways, each machine reads ${n(S / N)} GB: ${fmtInt(one)} ÷ ${N} = ${n(each)} s.`,
          `Add start-up and combining: ${n(each)} + ${o} = ${n(each + o)} s = <b>${n(answer)} minutes</b>. The overhead is why tiny jobs gain little from a cluster.`),
        S, rate, N, o,
      };
    },
    verify: (p) => (p.S / p.N / p.rate * 1000 + p.o) / 60,
  },
  'the-map-sla': {
    title: 'count the mornings a nightly report misses its deadline',
    make(r) {
      const deadline = pick(r, 6, 7) * 60; // minutes after midnight
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const arrive = days.map(() => pick(r, 60, 240, 10)); // file lands between 01:00 and 04:00
      const run = days.map(() => pick(r, 90, 240, 10));
      // vary the week even for fixed seeds, so it never looks like one repeated day
      arrive.forEach((a, i) => { arrive[i] = 60 + ((a - 60 + i * 70) % 190); run[i] = 90 + ((run[i] - 90 + i * 40) % 160); });
      const start = arrive.map((a) => Math.max(120, a));
      const finish = start.map((s, i) => s + run[i]);
      const late = finish.filter((f) => f > deadline).length;
      return {
        q: `<p>A hotel group's nightly job is scheduled for 02:00 but waits for the bookings file if it has not landed yet. The finance report must be ready by <b>${hm(deadline)}</b>. Here is one week:</p>${table(['Day', 'File lands', 'Job runs for'], days.map((d, i) => [d, hm(arrive[i]), run[i] + ' min']))}<p>On how many days was the report <b>late</b>?</p>`,
        answer: late, unit: 'days', tol: 0, abs: 0.01,
        hint: 'For each day, the job starts at 02:00 or when the file lands, whichever is later. Finish = start + run time. Compare the finish with the deadline.',
        solution: steps(
          `Start times: ${start.map(hm).join(', ')}.`,
          `Finish times: ${finish.map(hm).join(', ')}.`,
          `Finishes after ${hm(deadline)}: <b>${late} day${late === 1 ? '' : 's'}</b>. A late file pushes the whole chain back, so freshness depends on the source as much as on the job.`),
        arrive, run, deadline,
      };
    },
    verify: (p) => p.arrive.reduce((c, a, i) => c + ((a > 120 ? a : 120) + p.run[i] > p.deadline ? 1 : 0), 0),
  },
  'who-uses-what-meters': {
    title: 'how much data smart meters send in a day',
    make(r) {
      const M = pick(r, 50, 400, 10) * 1000, k = [5, 15, 30][pick(r, 0, 2)], B = pick(r, 100, 300, 20);
      const per = 1440 / k, answer = (M * per * B) / 1e9;
      return {
        q: `<p>An electricity utility has ${fmtInt(M)} smart meters. Each meter sends one reading every ${k} minutes, and each reading (meter ID, time, kWh, voltage, status) takes about ${B} bytes as JSON. How many <b>GB</b> arrive per day? (1 GB = 10<sup>9</sup> bytes.)</p>`,
        answer, unit: 'GB per day', tol: 0.005,
        hint: 'Readings per meter per day = minutes in a day (1,440) ÷ minutes between readings. Multiply by meters and by bytes per reading.',
        solution: steps(
          `Readings per meter per day: 1,440 ÷ ${k} = ${per}.`,
          `Readings per day: ${fmtInt(M)} × ${per} = ${fmtInt(M * per)} (about ${n(M * per / 86400)} per second).`,
          `Bytes: ${fmtInt(M * per)} × ${B} = ${n(M * per * B)} bytes = <b>${n(answer)} GB per day</b>, or about ${n(answer * 365 / 1000)} TB a year before compression.`),
        M, k, B,
      };
    },
    verify: (p) => p.M * p.B * (24 * 60 / p.k) / 1e9,
  },

  // ---------- Module 2: Spark ----------
  'how-spark-works-waves': {
    title: 'tasks, waves and stage time in Spark',
    make(r) {
      const S = pick(r, 40, 400, 20), E = pick(r, 5, 20), c = pick(r, 2, 8, 2), t = pick(r, 20, 60, 5);
      const tasks = S * 8, slots = E * c, waves = Math.ceil(tasks / slots), answer = (waves * t) / 60;
      return {
        q: `<p>A retailer's Spark job reads ${S} GB of Parquet. Spark splits it into 128 MB partitions (1 GB = 1,024 MB), one task each. The cluster has ${E} executors with ${c} cores each, and each task takes about ${t} seconds. How many <b>minutes</b> does this stage take?</p>`,
        answer, unit: 'minutes', tol: 0.005,
        hint: 'Tasks = data ÷ partition size. Each core runs one task at a time, so tasks run in waves of (executors × cores). Round the number of waves up.',
        solution: steps(
          `Tasks: ${S} × 1,024 ÷ 128 = ${fmtInt(tasks)}.`,
          `Task slots: ${E} × ${c} = ${slots}, so waves = ⌈${fmtInt(tasks)} ÷ ${slots}⌉ = ${waves}.`,
          `Time: ${waves} × ${t} s = ${fmtInt(waves * t)} s = <b>${n(answer)} minutes</b>.`),
        S, E, c, t,
      };
    },
    verify: (p) => { let left = p.S * 1024 / 128, w = 0; while (left > 0) { left -= p.E * p.c; w++; } return w * p.t / 60; },
  },
  'pyspark-basics-rows': {
    title: 'count the rows left after cleaning and an inner join',
    make(r) {
      const R = pick(r, 8000, 9900, 10), d = pick(r, 20, 300, 1), f = pick(r, 100, 700, 1), g = pick(r, 5, 90, 1);
      const answer = R - d - f - g;
      return {
        q: `<p>A grocery chain tests its PySpark job on one region's day of till data: ${fmtInt(R)} rows. It runs <code>dropDuplicates()</code>, which removes ${fmtInt(d)} exact duplicate copies. Among the rows left, ${fmtInt(f)} are refunds (<code>qty &lt; 0</code>), and the job keeps only <code>qty &gt; 0</code>. Finally it does an <b>inner</b> join to the stores table, but ${fmtInt(g)} of the remaining rows have <code>store_id = 99</code>, a test till that is not in the stores table. How many rows come out?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.5,
        hint: 'Take each step in order: duplicates go, then refunds go, then an inner join drops rows with no match on the other side.',
        solution: steps(
          `After dropDuplicates: ${fmtInt(R)} − ${fmtInt(d)} = ${fmtInt(R - d)}.`,
          `After the qty filter: ${fmtInt(R - d)} − ${fmtInt(f)} = ${fmtInt(R - d - f)}.`,
          `The inner join drops the ${fmtInt(g)} unmatched rows: <b>${fmtInt(answer)} rows</b>. A left join would have kept them with an empty store name, so you could see and log them instead of losing them silently.`),
        R, d, f, g,
      };
    },
    verify: (p) => p.R - (p.d + p.f + p.g),
  },
  'spark-performance-broadcast': {
    title: 'network traffic of a shuffle join versus a broadcast join',
    make(r) {
      const B = pick(r, 500, 3000, 100), s = pick(r, 5, 80, 5), E = pick(r, 20, 100, 10);
      const smj = B * 1000 + s, bc = s * E, answer = (smj - bc) / 1000;
      return {
        q: `<p>An ad network joins a ${fmtInt(B)} GB impressions table to a ${s} MB campaigns table on ${E} executors. Assume a sort-merge join sends <b>both</b> tables across the network once, and a broadcast join sends <b>one copy of the small table to every executor</b> and does not move the big table. How many <b>GB</b> of network traffic does broadcasting save? (1 GB = 1,000 MB.)</p>`,
        answer, unit: 'GB', tol: 0.005,
        hint: 'Sort-merge traffic = big table + small table. Broadcast traffic = small table × number of executors. Subtract.',
        solution: steps(
          `Sort-merge join moves ${fmtInt(B * 1000)} MB + ${s} MB = ${fmtInt(smj)} MB.`,
          `Broadcast moves ${s} MB × ${E} executors = ${fmtInt(bc)} MB.`,
          `Saved: ${fmtInt(smj)} − ${fmtInt(bc)} = ${fmtInt(smj - bc)} MB ≈ <b>${n(answer, 4)} GB</b>. That is why Spark broadcasts small tables automatically under a size threshold.`),
        B, s, E,
      };
    },
    verify: (p) => p.B - p.s * (p.E - 1) / 1000,
  },
  'spark-performance-files': {
    title: 'how many files after compacting a partitioned table',
    make(r) {
      const S = pick(r, 60, 600, 20), D = pick(r, 7, 31), T = [256, 512][pick(r, 0, 1)];
      const per = Math.ceil((S * 1024) / D / T), answer = per * D, before = 200 * D;
      return {
        q: `<p>A nightly job writes ${S} GB of sales, spread evenly over ${D} date folders with <code>partitionBy("sale_date")</code>. Right now each folder gets 200 small files (one per shuffle partition), ${fmtInt(before)} files in all. You repartition so each folder holds files of about ${T} MB, never more. How many files will the table have in total? (1 GB = 1,024 MB.)</p>`,
        answer, unit: 'files', tol: 0, abs: 0.5,
        hint: 'Find the size of one date folder in MB, divide by the target file size and round up. Then multiply by the number of folders.',
        solution: steps(
          `One folder: ${S} × 1,024 ÷ ${D} = ${n(S * 1024 / D, 5)} MB.`,
          `Files per folder: ⌈${n(S * 1024 / D, 5)} ÷ ${T}⌉ = ${per}.`,
          `Total: ${per} × ${D} = <b>${fmtInt(answer)} files</b>, down from ${fmtInt(before)}. Fewer, bigger files mean fewer tasks and faster listing for every reader.`),
        S, D, T,
      };
    },
    verify: (p) => { let total = 0; const mb = p.S * 1024 / p.D; for (let i = 0; i < p.D; i++) { let f = 0; while (f * p.T < mb - 1e-9) f++; total += f; } return total; },
  },
  'spark-family-cost': {
    title: 'the monthly cost of a nightly Spark cluster',
    make(r) {
      const N = pick(r, 10, 40, 5), T = pick(r, 20, 90, 5), p = pick(r, 0.2, 0.8, 0.05);
      const nightly = N * (T / 60) * p, answer = nightly * 30;
      return {
        q: `<p>A bank's nightly risk job runs on ${N} machines for ${T} minutes. At an example rate of ${money(p)} per machine-hour (made up for this problem), what does it cost over a 30-night month? Count only the time the machines run.</p>`,
        answer, unit: '$', tol: 0.005,
        hint: 'Machine-hours per night = machines × hours. Cost per night = machine-hours × rate. Then multiply by 30.',
        solution: steps(
          `Machine-hours per night: ${N} × ${T} ÷ 60 = ${n(N * T / 60)}.`,
          `Cost per night: ${n(N * T / 60)} × ${money(p)} = ${money(nightly)}.`,
          `Per month: 30 × ${money(nightly)} = <b>${money(answer)}</b>. Twice the machines for half the time costs the same; only doing less work (fewer bytes, fewer shuffles) makes it cheaper.`),
        N, T, p,
      };
    },
    verify: (p) => p.N * p.p * p.T / 2,
  },

  // ---------- Module 3: Google Cloud ----------
  'gcp-tour-budget': {
    title: 'which day a budget alert fires',
    make(r) {
      const s = pick(r, 20, 120, 5), d = pick(r, 8, 25), B = Math.max(100, Math.round((s * d) / 0.9 / 100) * 100);
      const answer = Math.ceil((0.9 * B) / s - 1e-9);
      return {
        q: `<p>A retail data team sets a monthly Google Cloud budget of ${money(B)} with an alert at <b>90 %</b>. They spend a steady ${money(s)} a day. On which day of the month does the 90 % alert fire (the first day the running total reaches 90 % of the budget)?</p>`,
        answer, unit: 'day', tol: 0, abs: 0.01,
        hint: '90 % of the budget is the threshold. Divide it by the daily spend and round up to a whole day.',
        solution: steps(
          `Threshold: 0.9 × ${money(B)} = ${money(0.9 * B)}.`,
          `${money(0.9 * B)} ÷ ${money(s)} a day = ${n(0.9 * B / s)} days.`,
          `The running total first reaches it on <b>day ${answer}</b>. A budget alert only warns; it does not stop spending, so someone must act on it.`),
        s, B,
      };
    },
    verify: (p) => { let t = 0, day = 0; while (t < 0.9 * p.B - 1e-9) { t += p.s; day++; } return day; },
  },
  'gcs-data-lake-lifecycle': {
    title: 'monthly storage cost of a lake with lifecycle rules',
    make(r) {
      const S = pick(r, 20, 200, 10), y = pick(r, 3, 7);
      const std = 30 * S, near = 335 * S, arch = (y - 1) * 365 * S;
      const answer = std * 0.02 + near * 0.01 + arch * 0.0012;
      return {
        q: `<p>A grocery chain lands ${S} GB of raw files in its lake every day. A lifecycle rule keeps files in Standard for 30 days, moves them to Nearline until they are a year old, then to Archive, and deletes them after ${y} years. Once the lake is full (${y} years in), what is the monthly storage bill? Use these <b>example rates</b> (not a real price list): Standard $0.020, Nearline $0.010, Archive $0.0012 per GB per month. Use 365-day years.</p>`,
        answer, unit: '$ per month', tol: 0.005,
        hint: 'Count how many days of files sit in each class: 30 days in Standard, 365 − 30 = 335 in Nearline, and the remaining years in Archive. Multiply each by the daily size and its rate.',
        solution: steps(
          `Standard: 30 × ${S} = ${fmtInt(std)} GB × $0.020 = ${money(std * 0.02)}.`,
          `Nearline: 335 × ${S} = ${fmtInt(near)} GB × $0.010 = ${money(near * 0.01)}.`,
          `Archive: ${y - 1} × 365 × ${S} = ${fmtInt(arch)} GB × $0.0012 = ${money(arch * 0.0012)}.`,
          `Total: <b>${money(answer)} a month</b>. Without the rule, all ${fmtInt(std + near + arch)} GB in Standard would cost ${money((std + near + arch) * 0.02)}.`),
        S, y,
      };
    },
    verify: (p) => p.S * (0.6 + 3.35 + (p.y - 1) * 365 * 0.0012),
  },
  'bigquery-scan-cost': {
    title: 'bytes scanned and monthly cost of a dashboard query',
    make(r) {
      const R = pick(r, 2, 20), k = pick(r, 7, 90), runs = pick(r, 24, 96, 12), rate = [5, 6.25, 7.5][pick(r, 0, 2)];
      const bytes = R * 1e6 * 16 * k, tib = bytes / 2 ** 40, answer = tib * runs * 30 * rate;
      return {
        q: `<p>A restaurant chain's <code>sales</code> table in BigQuery is partitioned by <code>sale_date</code> and gets ${R} million rows a day. A dashboard query selects only <code>store_id</code> and <code>revenue</code> for the last ${k} days (a filter on <code>sale_date</code>). Both columns are 8 bytes each. The dashboard refreshes ${runs} times a day and nothing is cached. At an <b>example</b> on-demand rate of $${rate} per TiB scanned (check Google's pricing page for the real one), what does it cost per 30-day month? (1 TiB = 2<sup>40</sup> bytes.)</p>`,
        answer, unit: '$ per month', tol: 0.005,
        hint: 'Only the two chosen columns in the chosen partitions are read: rows per day × days × 16 bytes. Convert to TiB, then multiply by runs per month and the rate.',
        solution: steps(
          `Bytes per run: ${R} million × ${k} days × 16 bytes = ${n(bytes)} bytes = ${n(tib)} TiB.`,
          `Runs per month: ${runs} × 30 = ${runs * 30}, so ${n(tib * runs * 30)} TiB a month.`,
          `Cost: ${n(tib * runs * 30)} × $${rate} = <b>${money(answer)}</b>. A <code>SELECT *</code> over all history would cost many times more, and <code>LIMIT</code> would not help.`),
        R, k, runs, rate,
      };
    },
    verify: (p) => p.R * p.k * p.runs * p.rate * 30 * 16e6 / 1099511627776,
  },
  'dataproc-run-cost': {
    title: 'cost of an ephemeral Dataproc cluster with Spot workers',
    make(r) {
      const W = pick(r, 2, 6), S = pick(r, 4, 16, 2), p = pick(r, 0.2, 0.4, 0.02), d = pick(r, 60, 80, 5), T = pick(r, 30, 90, 5);
      const h = (T + 2) / 60, run = (1 + W) * p * h + S * p * (1 - d / 100) * h, answer = run * 30;
      return {
        q: `<p>A retailer runs its nightly Spark job on an ephemeral Dataproc cluster: 1 master and ${W} primary workers at an example rate of ${money(p)} per machine-hour, plus ${S} Spot secondary workers at a ${d} % discount. The cluster lives for the job's ${T} minutes plus 2 minutes to start. Ignoring other fees, what is the cost for a 30-night month?</p>`,
        answer, unit: '$ per month', tol: 0.005,
        hint: 'Hours per night = (job minutes + start-up) ÷ 60. Standard machines pay the full rate; Spot machines pay (1 − discount) of it.',
        solution: steps(
          `Cluster life: (${T} + 2) ÷ 60 = ${n(h)} h.`,
          `Standard machines: ${1 + W} × ${money(p)} × ${n(h)} = ${money((1 + W) * p * h)}.`,
          `Spot workers: ${S} × ${money(p)} × ${n(1 - d / 100)} × ${n(h)} = ${money(S * p * (1 - d / 100) * h)}.`,
          `Per night ${money(run)}, so 30 nights = <b>${money(answer)}</b>. The same cluster left running all month would cost about ${n(24 * 60 / (T + 2))} times as much.`),
        W, S, p, d, T,
      };
    },
    verify: (p) => 30 * p.p * (p.T + 2) / 60 * (1 + p.W + p.S * (100 - p.d) / 100),
  },
  'airflow-backfill-time': {
    title: 'how long a backfill takes with parallel runs',
    make(r) {
      const D = pick(r, 30, 120, 10), T = pick(r, 8, 40, 2), k = pick(r, 2, 8);
      const rounds = Math.ceil(D / k), answer = (rounds * T) / 60;
      return {
        q: `<p>A hotel group adds a new column and must backfill its <code>bookings_daily</code> DAG for the last ${D} days. Each daily run takes ${T} minutes, and the DAG allows <code>max_active_runs=${k}</code>, so ${k} days can run at the same time. How many <b>hours</b> will the backfill take?</p>`,
        answer, unit: 'hours', tol: 0.005,
        hint: 'Runs go in rounds of k at a time. Rounds = days ÷ k, rounded up. Each round takes one run time.',
        solution: steps(
          `Rounds: ⌈${D} ÷ ${k}⌉ = ${rounds}.`,
          `Time: ${rounds} × ${T} min = ${rounds * T} min.`,
          `That is <b>${n(answer)} hours</b>. Because each run overwrites only its own date, running days in parallel, or twice, is safe.`),
        D, T, k,
      };
    },
    verify: (p) => { let left = p.D, m = 0; while (left > 0) { left -= p.k; m += p.T; } return m / 60; },
  },

  // ---------- Module 4: databases ----------
  'database-zoo-scan': {
    title: 'time saved by a column store on one average',
    make(r) {
      const R = pick(r, 5, 50), c = pick(r, 10, 40, 2), v = pick(r, 200, 800, 50);
      const row = R * 1e6 * c * 8, col = R * 1e6 * 2 * 8, answer = (row - col) / (v * 1e6);
      return {
        q: `<p>A retailer's orders table has ${R} million rows and ${c} columns, each about 8 bytes. A manager asks for the average order value in one region, so the query needs only 2 columns (region and value). A row store must read whole rows; a column store reads only the 2 columns. Both read from disk at ${v} MB per second (1 MB = 10<sup>6</sup> bytes) and nothing is compressed. How many <b>seconds</b> does the column store save?</p>`,
        answer, unit: 'seconds', tol: 0.005,
        hint: 'Row store bytes = rows × all columns × 8. Column store bytes = rows × 2 columns × 8. Divide each by the disk speed and subtract.',
        solution: steps(
          `Row store reads ${R} M × ${c} × 8 = ${n(row)} bytes: ${n(row / (v * 1e6))} s.`,
          `Column store reads ${R} M × 2 × 8 = ${n(col)} bytes: ${n(col / (v * 1e6))} s.`,
          `Saved: <b>${n(answer)} seconds</b>, with ${c / 2} times less reading. Compression in real column stores widens the gap further.`),
        R, c, v,
      };
    },
    verify: (p) => p.R * 8 * (p.c - 2) / p.v,
  },
  'druid-rollup-rows': {
    title: 'count the rows after Druid rollup',
    make(r) {
      const mins = ['10:00', '10:01', '10:02'], camps = ['A', 'B'], devs = ['mobile', 'desktop'];
      const ev = Array.from({ length: 12 }, (_, i) => ({ t: mins[Math.floor(i / 4)], s: pick(r, 0, 59), c: camps[pick(r, 0, 1)], d: devs[pick(r, 0, 1)], clk: pick(r, 0, 1) }));
      // mix the rows so fixed seeds still give a varied table
      ev.forEach((e, i) => { e.s = (e.s + i * 13) % 60; if (i % 3 === 1) e.c = e.c === 'A' ? 'B' : 'A'; if (i % 5 === 2) e.d = e.d === 'mobile' ? 'desktop' : 'mobile'; if (i % 4 === 3) e.clk = 1 - e.clk; });
      const keys = new Set(ev.map((e) => `${e.t}|${e.c}|${e.d}`)), answer = keys.size;
      const groups = [...keys].sort();
      return {
        q: `<p>An ad platform streams these 12 raw events (one impression each) into Druid with rollup on: time truncated to the <b>minute</b>, dimensions <i>campaign</i> and <i>device</i>, impressions and clicks summed.</p>${table(['Time', 'Campaign', 'Device', 'Clicks'], ev.map((e) => [`${e.t}:${String(e.s).padStart(2, '0')}`, e.c, e.d, e.clk]))}<p>How many rows does Druid store?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Drop the seconds. Rows with the same minute, campaign and device become one stored row. Count the different combinations.',
        solution: steps(
          'Truncate every time to the minute, so 10:00:37 becomes 10:00.',
          `The different (minute, campaign, device) combinations are: ${groups.map((g) => g.replace(/\|/g, ', ')).join('; ')}.`,
          `That is <b>${answer} rows</b> instead of 12. Each keeps summed impressions and clicks; the individual events are gone, so the raw copy stays in the lake.`),
        ev,
      };
    },
    verify: (p) => { const seen = []; for (const e of p.ev) { const k = e.t + e.c + e.d; if (!seen.includes(k)) seen.push(k); } return seen.length; },
  },
  'bigtable-nodes': {
    title: 'how many Bigtable nodes a write rate needs',
    make(r) {
      const w = pick(r, 40, 400, 10) * 1000, c = pick(r, 8, 14) * 1000, u = [60, 70][pick(r, 0, 1)];
      const answer = Math.ceil(w / (c * u / 100) - 1e-9);
      return {
        q: `<p>A delivery app writes ${fmtInt(w)} GPS pings per second at peak into Bigtable. In the team's own load test, one node handled about ${fmtInt(c)} writes per second at full CPU. To leave headroom, they plan to keep each node at no more than <b>${u} %</b> of that. How many nodes do they need at peak? (In real life your own load test, not this number, decides.)</p>`,
        answer, unit: 'nodes', tol: 0, abs: 0.01,
        hint: `Usable writes per node = ${fmtInt(c)} × ${u} %. Divide the peak rate by it and round up.`,
        solution: steps(
          `Usable per node: ${fmtInt(c)} × ${u / 100} = ${fmtInt(c * u / 100)} writes/s.`,
          `${fmtInt(w)} ÷ ${fmtInt(c * u / 100)} = ${n(w / (c * u / 100))}.`,
          `Round up: <b>${answer} nodes</b>. This only works if the row keys spread writes evenly; with a hotspot, one node is overloaded however many you add.`),
        w, c, u,
      };
    },
    verify: (p) => { let k = 0; while (k * p.c * p.u / 100 < p.w - 1e-9) k++; return k; },
  },
  'elasticsearch-shards': {
    title: 'how many shards an index needs',
    make(r) {
      const G = pick(r, 100, 900, 20), t = [30, 40, 50][pick(r, 0, 2)], rep = pick(r, 1, 2);
      const p = Math.ceil(G / t - 1e-9), answer = p * (1 + rep);
      return {
        q: `<p>An online marketplace's product-search index holds ${G} GB of primary data. The team aims for shards of at most ${t} GB each and keeps ${rep} replica${rep > 1 ? 's' : ''} of every primary shard. How many shards (primaries plus replicas) will the cluster hold?</p>`,
        answer, unit: 'shards', tol: 0, abs: 0.01,
        hint: 'Primary shards = data ÷ maximum shard size, rounded up. Each primary also has the given number of replica copies.',
        solution: steps(
          `Primaries: ⌈${G} ÷ ${t}⌉ = ${p}.`,
          `Each has ${rep} replica${rep > 1 ? 's' : ''}: ${p} × ${rep} = ${p * rep} replica shards.`,
          `Total: ${p} + ${p * rep} = <b>${answer} shards</b>, using about ${fmtInt(G * (1 + rep))} GB of disk. Replicas protect against a lost node and share the search load.`),
        G, t, rep,
      };
    },
    verify: (p) => { let k = 0; while (k * p.t < p.G - 1e-9) k++; return k + k * p.rep; },
  },
};
