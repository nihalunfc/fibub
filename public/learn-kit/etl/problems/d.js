// Live problems for Pipeline to Dashboard, part d: Module 7 (see ../problems.js).
import { pick, n, steps, table } from './util.js';

const money = (v) => (v < 0 ? '−$' : '$') + Math.abs(v).toLocaleString('en-CA', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
const int = (v) => v.toLocaleString('en-CA');
const clock = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const r2 = (v) => Math.round(v * 100) / 100;

export default {
  // ---------- 7.1 Observability and incident response ----------
  'observability-incidents-budget': {
    title: 'error budget left for a freshness SLO',
    make(r) {
      const slo = [95, 97, 98, 99][pick(r, 0, 3)], days = [28, 30, 60, 90][pick(r, 0, 3)], misses = pick(r, 0, 4);
      const allowed = r2(((100 - slo) / 100) * days), answer = r2(allowed - misses);
      return {
        q: `<p>A hotel group promises that its revenue page has fresh data by 07:30 on <b>${slo}%</b> of days. Over the last <b>${days}</b> days the page was late on <b>${misses}</b> days. How many late days does the error budget have left? (A negative answer means the budget is already overspent.)</p>`,
        answer, unit: 'days', tol: 0, abs: 0.01,
        hint: 'Allowed late days = (100% − SLO) × number of days. Subtract the late days you have already had.',
        solution: steps(
          `Allowed misses: (100% − ${slo}%) × ${days} = ${100 - slo}% × ${days} = ${n(allowed)} days.`,
          `Already used: ${misses} late days.`,
          `Budget left: ${n(allowed)} − ${misses} = <b>${n(answer)} days</b>. ${answer < 0 ? 'Overspent: reliability work now comes before new features.' : 'Still inside the promise, but watch the trend.'}`),
        slo, days, misses,
      };
    },
    verify: (p) => p.days - (p.slo * p.days) / 100 - p.misses,
  },
  'observability-incidents-compliance': {
    title: 'freshness SLO compliance from 20 finish times',
    make(r) {
      const late = pick(r, 1, 4), times = [];
      for (let i = 0; i < 20; i++) times.push(pick(r, 380, 475, 5));          // on time: 06:20 to 07:55
      const used = new Set();
      for (let k = 0; k < late; k++) {
        let at = pick(r, 0, 19);
        while (used.has(at)) at = (at + 7) % 20;
        used.add(at);
        times[at] = pick(r, 483, 530, 1);                                    // late: 08:03 to 08:50
      }
      const answer = ((20 - late) / 20) * 100;
      const rows = [times.slice(0, 10).map(clock), times.slice(10).map(clock)];
      return {
        q: `<p>A restaurant chain's daily sales email must be sent by <b>08:00</b>. Here are the send times for the last 20 mornings (days 1 to 10 in the first row, 11 to 20 in the second):</p>${table(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], rows)}<p>What percentage of mornings met the deadline?</p>`,
        answer, unit: '%', tol: 0, abs: 0.01,
        hint: 'Count the times after 08:00. Compliance = on-time days ÷ all days × 100.',
        solution: steps(
          `Late mornings (after 08:00): ${times.filter((t) => t > 480).map(clock).join(', ')}, so ${late} of 20.`,
          `On time: 20 − ${late} = ${20 - late}.`,
          `Compliance: ${20 - late} ÷ 20 × 100 = <b>${answer}%</b>. Against a 95% SLO that is ${answer >= 95 ? 'just inside' : 'a broken promise'}.`),
        times,
      };
    },
    verify: (p) => (p.times.filter((t) => t <= 480).length / p.times.length) * 100,
  },

  // ---------- 7.2 CI/CD, environments and safe change ----------
  'cicd-safe-change-diff': {
    title: 'rows in a data diff between CI and prod',
    make(r) {
      const restaurants = pick(r, 12, 30), days = pick(r, 7, 30), prod = restaurants * days;
      const changed = pick(r, 6, 40), added = pick(r, 0, 6), removed = pick(r, 0, 6);
      const ci = prod - removed + added, answer = 2 * changed + added + removed;
      return {
        q: `<p>A pull request moves the business-day cut-off for one brand of a restaurant chain. Prod's <code>fct_restaurant_daily</code> has ${int(prod)} rows (${restaurants} restaurants × ${days} days). The CI build of the same table has ${int(ci)} rows. Compared with prod, ${changed} rows have a different sales value, ${added} restaurant-days exist only in CI and ${removed} exist only in prod. The diff query is <code>(ci except prod) union all (prod except ci)</code>. How many rows does it return?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'A changed row appears twice: its new version is in CI only, its old version is in prod only. Added and removed rows appear once each.',
        solution: steps(
          `<code>ci except prod</code>: the ${changed} new versions + the ${added} added rows = ${changed + added}.`,
          `<code>prod except ci</code>: the ${changed} old versions + the ${removed} removed rows = ${changed + removed}.`,
          `Together: ${changed + added} + ${changed + removed} = <b>${answer}</b> rows. Check that every one belongs to the brand you meant to change.`),
        prod, ci, changed, removed,
      };
    },
    verify: (p) => { const same = p.prod - p.changed - p.removed; return (p.ci - same) + (p.prod - same); },
  },

  // ---------- 7.3 Choosing tools ----------
  'choosing-tools-matrix': {
    title: 'winning score in a weighted decision matrix',
    make(r) {
      const W = [[0.5, 0.3, 0.2], [0.4, 0.4, 0.2], [0.4, 0.35, 0.25], [0.3, 0.3, 0.4], [0.45, 0.35, 0.2]][pick(r, 0, 4)];
      const a = [pick(r, 1, 5), pick(r, 2, 5), pick(r, 1, 5)], b = [pick(r, 1, 5), pick(r, 1, 5), pick(r, 2, 5)];
      const sa = r2(W[0] * a[0] + W[1] * a[1] + W[2] * a[2]), sb = r2(W[0] * b[0] + W[1] * b[1] + W[2] * b[2]);
      const answer = Math.max(sa, sb), win = sa > sb ? 'A' : sb > sa ? 'B' : 'a tie';
      return {
        q: `<p>A 40-store retail chain is choosing an orchestrator. The criteria and weights are: running cost ${W[0]}, fit with the team's skills ${W[1]}, partitions and backfills ${W[2]}. Scores from 1 (poor) to 5 (excellent):</p>${table(['', 'cost', 'skills fit', 'partitions'], [['Orchestrator A', ...a], ['Orchestrator B', ...b]])}<p>What is the <b>winning</b> weighted score?</p>`,
        answer, unit: 'points out of 5', tol: 0, abs: 0.006,
        hint: 'For each tool multiply each score by its weight and add. The weights already add up to 1. The winner is the larger total.',
        solution: steps(
          `A: ${W[0]} × ${a[0]} + ${W[1]} × ${a[1]} + ${W[2]} × ${a[2]} = ${sa}.`,
          `B: ${W[0]} × ${b[0]} + ${W[1]} × ${b[1]} + ${W[2]} × ${b[2]} = ${sb}.`,
          `Winner: ${win === 'a tie' ? 'a tie' : 'Orchestrator ' + win}, with <b>${answer}</b>. If the gap (${r2(Math.abs(sa - sb))}) is small, move each weight by 0.1 and see whether the winner flips.`),
        W, a, b,
      };
    },
    verify: (p) => Math.max(...[p.a, p.b].map((s) => s.reduce((t, v, i) => t + v * p.W[i], 0) / p.W.reduce((t, v) => t + v, 0))),
  },

  // ---------- 7.4 A low-cost open-source stack ----------
  'low-cost-open-stack-per-location': {
    title: 'platform cost per location per month',
    make(r) {
      const vm = pick(r, 80, 220, 10), store = pick(r, 5, 30, 5), hours = pick(r, 4, 16), rate = pick(r, 40, 90, 5), locs = pick(r, 20, 500, 10);
      const total = vm + store + hours * rate, answer = total / locs;
      return {
        q: `<p>A quick-service restaurant chain with <b>${locs}</b> locations runs an open-source data platform. Each month: the server costs ${money(vm)}, object storage costs ${money(store)}, and the data person spends ${hours} hours on upkeep at ${money(rate)} an hour (example prices). What does the platform cost <b>per location per month</b>?</p>`,
        answer, unit: '$ per location', tol: 0.005,
        hint: 'Add infrastructure and people time to get the monthly total, then divide by the number of locations.',
        solution: steps(
          `People time: ${hours} × ${money(rate)} = ${money(hours * rate)}.`,
          `Monthly total: ${money(vm)} + ${money(store)} + ${money(hours * rate)} = ${money(total)}.`,
          `Per location: ${money(total)} ÷ ${locs} = <b>${money(r2(answer))}</b> a month. This is the number a finance team can compare with every other cost per location.`),
        vm, store, hours, rate, locs,
      };
    },
    verify: (p) => p.vm / p.locs + p.store / p.locs + (p.hours * p.rate) / p.locs,
  },
  'low-cost-open-stack-storage': {
    title: 'raw data per year for sizing a platform',
    make(r) {
      const rest = pick(r, 40, 300, 10), lines = pick(r, 1500, 6000, 500), bytes = pick(r, 80, 160, 10);
      const answer = (rest * lines * 365 * bytes) / 1e9;
      return {
        q: `<p>You are sizing a platform for a restaurant chain with <b>${rest}</b> restaurants. Each restaurant sends about <b>${int(lines)}</b> order lines a day, and one raw order line takes about <b>${bytes}</b> bytes. How many <b>gigabytes</b> of raw data arrive in a year (365 days)? Use 1 GB = 10<sup>9</sup> bytes.</p>`,
        answer, unit: 'GB', tol: 0.005,
        hint: 'Rows a day = restaurants × lines. Multiply by 365, then by bytes per row, then divide by a billion.',
        solution: steps(
          `Rows a day: ${rest} × ${int(lines)} = ${int(rest * lines)}.`,
          `Rows a year: × 365 = ${int(rest * lines * 365)}.`,
          `Bytes: × ${bytes} = ${int(rest * lines * 365 * bytes)}; in GB: <b>${n(answer)} GB</b>. Parquet usually stores this several times smaller, so one modest server holds years of history.`),
        rest, lines, bytes,
      };
    },
    verify: (p) => ((p.rest * p.lines) / 1e6) * ((365 * p.bytes) / 1e3),
  },

  // ---------- 7.5 Performance and scale ----------
  'performance-scale-incremental': {
    title: 'run time after switching to incremental processing',
    make(r) {
      const years = pick(r, 1, 4), D = years * 365, look = pick(r, 3, 14), full = pick(r, 60, 300, 10);
      const answer = (full * (1 + look)) / D;
      return {
        q: `<p>A retailer's nightly staging step rebuilds all <b>${int(D)}</b> daily partitions of history and now takes <b>${full}</b> minutes. Each partition is about the same size. You switch it to incremental: each night it processes today's partition plus a look-back of the previous <b>${look}</b> days. About how many <b>minutes</b> will a nightly run take?</p>`,
        answer, unit: 'minutes', tol: 0.005,
        hint: 'Time per partition = full time ÷ number of partitions. An incremental run touches 1 + look-back partitions.',
        solution: steps(
          `Per partition: ${full} ÷ ${int(D)} = ${n(full / D)} min.`,
          `Partitions per incremental run: 1 + ${look} = ${1 + look}.`,
          `Run time: ${1 + look} × ${n(full / D)} = <b>${n(answer)} min</b>, a speed-up of ${int(D)} ÷ ${1 + look} ≈ ${n(D / (1 + look))} times, and it no longer grows every month.`),
        D, look, full,
      };
    },
    verify: (p) => p.full / (p.D / (1 + p.look)),
  },
  'performance-scale-compaction': {
    title: 'number of files after compacting small Parquet files',
    make(r) {
      const days = [28, 30, 31][pick(r, 0, 2)], per = pick(r, 100, 600, 20), kb = pick(r, 200, 900, 50), target = [128, 256, 512][pick(r, 0, 2)];
      const totalMb = (days * per * kb) / 1000, answer = Math.ceil(totalMb / target - 1e-9);
      return {
        q: `<p>A grocery chain's staging folder for one month holds ${days} daily partitions with <b>${per}</b> small Parquet files each, every file about <b>${kb}</b> KB. You compact the month into files of at most <b>${target}</b> MB each (use 1 MB = 1,000 KB). How many files will the month have after compaction?</p>`,
        answer, unit: 'files', tol: 0, abs: 0.01,
        hint: 'Total size = days × files × size. Divide by the target size and round up: a part-full last file still counts.',
        solution: steps(
          `Files before: ${days} × ${per} = ${int(days * per)}.`,
          `Total size: ${int(days * per)} × ${kb} KB = ${int(days * per * kb)} KB = ${int(totalMb)} MB.`,
          `Files after: ${int(totalMb)} ÷ ${target} = ${n(totalMb / target)}, rounded up to <b>${answer}</b>. Every query now opens ${answer} files instead of ${int(days * per)}.`),
        days, per, kb, target,
      };
    },
    verify: (p) => { let left = p.days * p.per * p.kb, f = 0; while (left > 0) { left -= p.target * 1000; f++; } return f; },
  },

  // ---------- 7.6 Capstone ----------
  'capstone-build-reconcile': {
    title: 'reconciliation gap between files and the report',
    make(r) {
      const raw = pick(r, 90000, 160000, 100), dup = pick(r, 800, 4000, 100), quar = pick(r, 3000, 12000, 100);
      const gap = pick(r, 2, 40, 1) * 50 * (r() < 0.5 ? -1 : 1), expected = raw - dup - quar, report = expected + gap;
      const answer = Math.abs(gap);
      return {
        q: `<p>For yesterday, the 12 stores of a grocery chain sent files whose sales add up to ${money(raw)}. The pipeline removed duplicate lines worth ${money(dup)} and quarantined one store's file worth ${money(quar)}. Nothing else should change the total. The morning email shows net sales of ${money(report)}. How large is the unexplained gap, in dollars?</p>`,
        answer, unit: '$', tol: 0, abs: 0.01,
        hint: 'Expected report = raw − duplicates − quarantined. The gap is the difference between that and what the email shows.',
        solution: steps(
          `Expected: ${money(raw)} − ${money(dup)} − ${money(quar)} = ${money(expected)}.`,
          `Shown: ${money(report)}, which is ${gap > 0 ? 'more' : 'less'} than expected.`,
          `Gap: |${money(report)} − ${money(expected)}| = <b>${money(answer)}</b>. The final asset check should block the email until this is explained.`),
        raw, dup, quar, report,
      };
    },
    verify: (p) => Math.abs(p.report + p.dup + p.quar - p.raw),
  },

  // ---------- 7.7 Ship and tell ----------
  'ship-and-tell-rubric': {
    title: 'interview rubric points from breadth first',
    make(r) {
      const k = pick(r, 7, 10), deep = pick(r, 2, 3), extra = pick(r, 1, 3);
      const sDeep = 2 * deep, sBroad = k + extra, answer = sBroad - sDeep;
      return {
        q: `<p>An interviewer scores a system-design answer on <b>${k}</b> areas, each 0, 1 or 2 points. Plan A goes deep on ${deep} areas (2 points each) and runs out of time before the rest. Plan B touches all ${k} areas at 1 point, then goes deep on the ${extra} the interviewer asks about (2 points each). How many <b>more</b> points does Plan B score?</p>`,
        answer, unit: 'points', tol: 0, abs: 0.01,
        hint: 'Plan A: 2 × deep areas. Plan B: 1 point for every area, plus 1 more for each area taken to 2.',
        solution: steps(
          `Plan A: ${deep} × 2 = ${sDeep} of ${2 * k}.`,
          `Plan B: ${k} × 1 + ${extra} × 1 extra = ${sBroad} of ${2 * k}.`,
          `Difference: ${sBroad} − ${sDeep} = <b>${answer}</b> points. Breadth first, then depth where they probe.`),
        k, deep, extra,
      };
    },
    verify: (p) => (p.k - p.extra) + 2 * p.extra - 2 * p.deep,
  },
};
