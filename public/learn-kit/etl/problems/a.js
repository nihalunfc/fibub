// Live problems for Pipeline to Dashboard, part a: Modules 1 and 2 (see ../problems.js).
// Every company here is made up; prices are round teaching numbers, not quotes.
import { pick, n, steps, table } from './util.js';

const sum = (a) => a.reduce((s, v) => s + v, 0);
const median = (a) => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const money = (v) => '$' + v.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const int = (v) => Math.round(v).toLocaleString('en-CA');
const hhmm = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export default {
  // ---------- Module 1: Ingest anything ----------
  'platform-shape-raw-cost': {
    title: 'what an immutable raw layer costs to keep',
    make(r) {
      const files = pick(r, 12, 30), mb = pick(r, 2, 9, 0.5), months = pick(r, 12, 36, 6), price = pick(r, 0.015, 0.025, 0.001);
      const gb = (files * mb * 30 * months) / 1000, answer = gb * price;
      return {
        q: `<p>A grocery chain lands about <b>${files} files a day</b> into its raw layer, averaging <b>${mb} MB</b> each. Raw is never deleted. After <b>${months} months</b> (count 30 days a month, 1 GB = 1,000 MB), what is the monthly storage bill at <b>$${price} per GB-month</b>? (A round teaching price; check your provider for real ones.)</p>`,
        answer, unit: '$ per month', tol: 0.01,
        hint: 'First find how many GB are stored after all those months (files × MB × days ÷ 1,000), then multiply by the price per GB-month.',
        solution: steps(
          `Per day: ${files} × ${mb} MB = ${n(files * mb, 4)} MB.`,
          `Days kept: ${months} × 30 = ${months * 30} days, so ${n(files * mb, 4)} × ${months * 30} = ${int(files * mb * months * 30)} MB = ${n(gb, 4)} GB.`,
          `Bill: ${n(gb, 4)} GB × $${price} = <b>${money(answer)} a month</b>. Keeping every file you ever received usually costs less than one hour of an engineer's time.`),
        files, mb, months, price,
      };
    },
    verify: (p) => (p.files * p.mb / 1000) * 30 * p.months * p.price,
  },
  'engineering-setup-log-size': {
    title: 'how much space structured logs take',
    make(r) {
      const runs = pick(r, 4, 24, 4), files = pick(r, 10, 40, 2), per = pick(r, 2, 4), fixed = 6, bytes = pick(r, 160, 320, 20), days = pick(r, 30, 90, 30);
      const lines = runs * (files * per + fixed), answer = (lines * bytes * days) / 1e6;
      return {
        q: `<p>A restaurant chain's landing job runs <b>${runs} times a day</b>. Each run handles about <b>${files} files</b>, writes <b>${per} JSON log lines per file</b> plus <b>${fixed} lines</b> for start, summary and end. A line averages <b>${bytes} bytes</b>. How many <b>MB</b> of logs do you keep with <b>${days} days</b> of retention? (1 MB = 1,000,000 bytes.)</p>`,
        answer, unit: 'MB', tol: 0.01,
        hint: 'Lines per run = files × lines per file + the fixed lines. Then multiply by runs per day, bytes per line and days kept.',
        solution: steps(
          `Lines per run: ${files} × ${per} + ${fixed} = ${files * per + fixed}.`,
          `Lines per day: ${files * per + fixed} × ${runs} = ${int(lines)}.`,
          `Bytes kept: ${int(lines)} × ${bytes} × ${days} = ${int(lines * bytes * days)} bytes = <b>${n(answer, 4)} MB</b>. Small enough to keep, and searchable when 6 a.m. goes wrong.`),
        runs, files, per, fixed, bytes, days,
      };
    },
    verify: (p) => (p.runs * p.files * p.per * p.bytes * p.days + p.runs * p.fixed * p.bytes * p.days) / 1e6,
  },
  'landing-files-manifest': {
    title: 'count manifest rows after re-sends and corrections',
    make(r) {
      const d1 = pick(r, 14, 20), d2 = pick(r, 14, 20), resend = pick(r, 1, 4), fix = pick(r, 1, 3), runs = pick(r, 2, 4);
      const answer = d1 + d2 + fix;
      return {
        q: `<p>A burger chain's POS exports land in a shared folder. Your landing job keys its manifest on the <b>SHA-256 hash</b> of each file and runs <b>${runs} times a day</b>.</p><ul><li>Day 1: ${d1} new files.</li><li>Day 2: ${d2} new files, plus <b>${resend}</b> byte-identical re-sends of Day 1 files, plus <b>${fix}</b> corrected Day 1 files saved under the same names with new contents.</li></ul><p>How many rows are in the manifest at the end of Day 2?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'One row per distinct hash. Reruns and byte-identical re-sends produce hashes you already have; a correction has new bytes, so a new hash.',
        solution: steps(
          `Day 1: ${d1} new hashes. The other ${runs - 1} run${runs > 2 ? 's' : ''} that day find nothing new.`,
          `Day 2: ${d2} new files are new hashes. The ${resend} exact re-sends match existing hashes and are skipped. The ${fix} corrections have new bytes, so ${fix} new hashes.`,
          `Total: ${d1} + ${d2} + ${fix} = <b>${answer} rows</b>. Running ${runs} times a day changes nothing: the landing step is idempotent.`),
        d1, d2, resend, fix, runs,
      };
    },
    verify: (p) => {
      const seen = new Set();
      for (let run = 0; run < p.runs; run++) for (let i = 0; i < p.d1; i++) seen.add('d1-' + i);
      for (let run = 0; run < p.runs; run++) {
        for (let i = 0; i < p.d2; i++) seen.add('d2-' + i);
        for (let i = 0; i < p.resend; i++) seen.add('d1-' + i);
        for (let i = 0; i < p.fix; i++) seen.add('d1-' + i + '-v2');
      }
      return seen.size;
    },
  },
  'email-extraction-skipped': {
    title: 'how many emails a watermark overlap re-reads',
    make(r) {
      const stores = pick(r, 8, 14), overlap = pick(r, 1, 3), dup = pick(r, 1, 3);
      const fetched = stores * (overlap + 1) + dup, answer = fetched - stores;
      return {
        q: `<p>${stores} stores of a grocery chain each email one sales report at about 06:30 every day. Your job runs at 07:10. It fetches every message received after <b>(last watermark − ${overlap} day${overlap > 1 ? 's' : ''})</b>, where the watermark is yesterday's 07:10 run. Yesterday one manager pressed send ${dup + 1} times, so ${dup} extra identical email${dup > 1 ? 's' : ''} arrived. Everything before today is already landed. How many fetched attachments are <b>skipped as duplicates</b> today?</p>`,
        answer, unit: 'attachments', tol: 0, abs: 0.01,
        hint: `The window runs from ${overlap} day${overlap > 1 ? 's' : ''} before yesterday 07:10 up to now, so it holds ${overlap + 1} mornings of reports. Only today's reports are new.`,
        solution: steps(
          `Mornings inside the window: ${overlap} older + today = ${overlap + 1}. Reports fetched: ${stores} × ${overlap + 1} = ${stores * (overlap + 1)}, plus ${dup} resend${dup > 1 ? 's' : ''} = ${fetched}.`,
          `New today: ${stores} (one per store).`,
          `Skipped by the hash check: ${fetched} − ${stores} = <b>${answer}</b>. The overlap costs a few re-reads and buys safety against late or clock-skewed mail.`),
        stores, overlap, dup,
      };
    },
    verify: (p) => p.stores * p.overlap + p.dup,
  },
  'cloud-drives-sftp-delta': {
    title: 'how many files a change check downloads',
    make(r) {
      const y = pick(r, 300, 600, 10), del = pick(r, 0, 4), added = pick(r, 2, 12), changed = pick(r, 1, 6);
      const t = y - del + added, answer = added + changed;
      return {
        q: `<p>A hotel group's SharePoint export library held <b>${y}</b> files yesterday. Today the listing shows <b>${t}</b> files. <b>${del}</b> of yesterday's files were deleted, and <b>${changed}</b> files that were there yesterday now have a new eTag (changed content). Raw keeps deleted files. How many files must you download today?</p>`,
        answer, unit: 'files', tol: 0, abs: 0.01,
        hint: "New files = today's count − (yesterday's count − deleted). Download the new files plus the changed ones; deletions need no download.",
        solution: steps(
          `Files that survived from yesterday: ${y} − ${del} = ${y - del}.`,
          `New today: ${t} − ${y - del} = ${added}.`,
          `Download ${added} new + ${changed} changed = <b>${answer} files</b>. A delta API returns exactly this list, so you never re-list ${t} files.`),
        y, t, del, changed,
      };
    },
    verify: (p) => p.t - (p.y - p.del) + p.changed,
  },
  'apis-databases-backoff': {
    title: 'worst-case wait with exponential backoff',
    make(r) {
      const b = pick(r, 1, 3, 0.5), k = pick(r, 3, 6);
      const waits = Array.from({ length: k }, (_, i) => b * 2 ** i), answer = sum(waits);
      return {
        q: `<p>An ad network's API client retries a failed call up to <b>${k} times</b>. Before retry <i>i</i> it waits <b>${b} × 2<sup>i−1</sup> seconds</b> (no jitter, no Retry-After header). If every attempt fails, how many seconds does it spend waiting in total?</p>`,
        answer, unit: 's', tol: 0.001,
        hint: 'Write the waits out: the first is the base, and each one doubles the one before. Add them up (or use base × (2^k − 1)).',
        solution: steps(
          `Waits: ${waits.map((w) => n(w, 4)).join(' + ')} seconds.`,
          `Sum: <b>${n(answer, 4)} s</b>. The shortcut: ${b} × (2<sup>${k}</sup> − 1) = ${b} × ${2 ** k - 1}.`,
          'Doubling gives a struggling server room to recover. In real clients add a little random jitter, and always obey a Retry-After header when the server sends one.'),
        b, k,
      };
    },
    verify: (p) => p.b * (2 ** p.k - 1),
  },
  'apis-databases-lookback': {
    title: 'how long a look-back window takes under a rate limit',
    make(r) {
      const days = pick(r, 3, 14), accts = pick(r, 6, 30, 2), pages = pick(r, 2, 6), rate = pick(r, 20, 120, 10);
      const calls = days * accts * pages, answer = calls / rate;
      return {
        q: `<p>An ad agency pulls daily ad stats for <b>${accts}</b> client accounts. Late conversions keep changing numbers, so each morning it re-pulls the <b>last ${days} days</b>. Each account-day takes <b>${pages}</b> pages, one API call per page. The API allows <b>${rate} calls per minute</b>. What is the shortest time the morning pull can take, in minutes?</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: 'Calls per run = days × accounts × pages. Divide by the calls allowed per minute.',
        solution: steps(
          `Calls: ${days} × ${accts} × ${pages} = ${int(calls)}.`,
          `Time: ${int(calls)} ÷ ${rate} per minute = <b>${n(answer, 4)} minutes</b>.`,
          'If that is too slow for an 08:00 deadline, shorten the window to what the data needs (measure how much day totals still change after 3, 7 and 14 days) rather than hammering the API.'),
        days, accts, pages, rate,
      };
    },
    verify: (p) => (p.pages / p.rate) * p.accts * p.days,
  },
  'proof-retail-ingest-completeness': {
    title: 'completeness of a month of store files',
    make(r) {
      const stores = pick(r, 10, 16), days = pick(r, 28, 31), closed = pick(r, 0, 5), silent = pick(r, 2, 6), late = pick(r, 1, 5);
      const expected = stores * days - closed, received = expected - silent, answer = (100 * received) / expected;
      return {
        q: `<p>A grocery chain has <b>${stores} stores</b>; each should send one sales file a day for <b>${days} days</b>. One store was closed for renovation for <b>${closed}</b> day${closed === 1 ? '' : 's'} (not expected to send). Another store sent nothing for <b>${silent}</b> days. <b>${late}</b> files arrived a day late but did arrive. What is the completeness, in %?</p>`,
        answer, unit: '%', tol: 0.001,
        hint: 'Expected = stores × days − closed days. Received = expected − missing. Late files still count as received (lateness is a freshness problem, not a completeness one).',
        solution: steps(
          `Expected: ${stores} × ${days} − ${closed} = ${expected}.`,
          `Received: ${expected} − ${silent} = ${received} (the ${late} late files are in).`,
          `Completeness: ${received} ÷ ${expected} = <b>${n(answer, 4)} %</b>. A sales chart would show the silent store as a dip; this number shows it as missing.`),
        stores, days, closed, silent,
      };
    },
    verify: (p) => 100 * (1 - p.silent / (p.stores * p.days - p.closed)),
  },

  // ---------- Module 2: Clean and trust the data ----------
  'profiling-contracts-repeats': {
    title: 'separate re-sent rows from genuine repeat lines',
    make(r) {
      const rows = pick(r, 8000, 20000, 200), extra = pick(r, 150, 600, 10), resent = pick(r, 40, 140, 2);
      const distinct = rows - extra, answer = extra - resent;
      return {
        q: `<p>Profiling a taco chain's POS file: <code>count(*)</code> = <b>${int(rows)}</b>, and <code>count(distinct (order_id, menu_item_id))</code> = <b>${int(distinct)}</b>. You then find <b>${resent}</b> rows that are exact copies of an earlier row in the same file (a re-sent batch). The rest of the extra rows are the same item ordered twice on separate lines. How many genuine repeat lines are there?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Extra rows = rows − distinct keys. Some extras are true duplicates (the exact copies); the others are real repeat lines.',
        solution: steps(
          `Extra rows over the candidate key: ${int(rows)} − ${int(distinct)} = ${extra}.`,
          `True duplicates (exact copies): ${resent}.`,
          `Genuine repeat lines: ${extra} − ${resent} = <b>${answer}</b>. So (order_id, menu_item_id) is not a key: you need a line number, and only the ${resent} copies should be removed.`),
        rows, distinct, resent,
      };
    },
    verify: (p) => p.rows - p.distinct - p.resent,
  },
  'polars-duckdb-bytes': {
    title: 'how much a Parquet query actually reads',
    make(r) {
      const gb = pick(r, 4, 40, 2), cols = pick(r, 16, 40, 4), used = pick(r, 2, 5), keep = pick(r, 10, 60, 10), comp = pick(r, 3, 6);
      const answer = (gb * 1000 * used) / cols / keep / comp;
      return {
        q: `<p>A restaurant group's POS history is <b>${gb} GB</b> as CSV, with <b>${cols}</b> columns of about equal width. As Parquet it compresses about <b>${comp}×</b>. A query needs <b>${used}</b> columns, and its date filter keeps only <b>1 row group in ${keep}</b> (the others are skipped by their min/max statistics). About how many <b>MB</b> does it read from Parquet? (1 GB = 1,000 MB.)</p>`,
        answer, unit: 'MB', tol: 0.01,
        hint: 'Start from the CSV size in MB. Keep the share of columns used, then the share of row groups kept, then divide by the compression factor.',
        solution: steps(
          `CSV: ${gb} × 1,000 = ${int(gb * 1000)} MB.`,
          `Columns: × ${used}/${cols} = ${n((gb * 1000 * used) / cols, 4)} MB. Row groups: ÷ ${keep} = ${n((gb * 1000 * used) / cols / keep, 4)} MB.`,
          `Compression: ÷ ${comp} = <b>${n(answer, 4)} MB</b>, against ${int(gb * 1000)} MB for the CSV: about ${n((gb * 1000) / answer, 3)} times less to read.`),
        gb, cols, used, keep, comp,
      };
    },
    verify: (p) => (p.used / p.cols) * (1 / p.keep) * (1 / p.comp) * p.gb * 1000,
  },
  'messy-data-guide-business-day': {
    title: 'revenue for a business day that ends at 05:00',
    make(r) {
      const cut = pick(r, 4, 6);
      const times = [[14, pick(r, 6, 11) * 60 + pick(r, 0, 59)], [14, pick(r, 20, 23) * 60 + pick(r, 0, 59)], [15, pick(r, 0, cut - 1) * 60 + pick(r, 0, 59)], [15, (cut - 1) * 60 + pick(r, 30, 59)], [15, cut * 60 + pick(r, 0, 40)], [14, pick(r, 1, cut - 1) * 60 + pick(r, 0, 59)]];
      const amt = times.map((_, i) => pick(r, 8, 60, 0.25) + i * 0.5);
      const bday = times.map(([d, m]) => (m < cut * 60 ? d - 1 : d));
      const answer = sum(amt.filter((_, i) => bday[i] === 14));
      return {
        q: `<p>A wings restaurant's business day runs <b>${String(cut).padStart(2, '0')}:00</b> to <b>${String(cut - 1).padStart(2, '0')}:59</b> the next morning. What is the revenue for <b>business date 14 Sept</b>?</p>${table(['Order time', 'Amount'], times.map(([d, m], i) => [`${d} Sept ${hhmm(m)}`, money(amt[i])]))}`,
        answer, unit: '$', tol: 0.0005,
        hint: `Subtract ${cut} hours from each timestamp and take the calendar date of the result. An order before ${String(cut).padStart(2, '0')}:00 belongs to the day before.`,
        solution: steps(
          `Business dates: ${times.map(([d, m], i) => `${d} Sept ${hhmm(m)} → ${bday[i]}`).join('; ')}.`,
          `Orders on business date 14: ${amt.filter((_, i) => bday[i] === 14).map(money).join(' + ')}.`,
          `Revenue = <b>${money(answer)}</b>. The 14 Sept early-morning order belongs to the 13th, and the 15 Sept orders before ${String(cut).padStart(2, '0')}:00 belong to the 14th.`),
        times, amt, cut,
      };
    },
    verify: (p) => p.times.reduce((s, [d, m], i) => s + (new Date(Date.UTC(2026, 8, d, 0, m - p.cut * 60)).getUTCDate() === 14 ? p.amt[i] : 0), 0),
  },
  'messy-data-guide-micros': {
    title: 'turn micros and mixed currencies into one total',
    make(r) {
      const cad = [pick(r, 40, 400, 0.01), pick(r, 40, 400, 0.01), pick(r, 40, 400, 0.01)], usd = pick(r, 50, 300, 0.01), fx = pick(r, 1.3, 1.42, 0.01);
      const micros = [...cad, usd].map((v) => Math.round(v * 1e6));
      const answer = (micros[0] + micros[1] + micros[2]) / 1e6 + (micros[3] / 1e6) * fx;
      return {
        q: `<p>An ad agency's API returns spend in <b>micros</b> (millionths of the currency unit). Convert to <b>CAD</b> using the day's rate of <b>1 USD = ${fx} CAD</b> and give the total.</p>${table(['campaign', 'spend_micros', 'currency'], [['C3001', micros[0].toLocaleString('en-CA'), 'CAD'], ['C3002', micros[1].toLocaleString('en-CA'), 'CAD'], ['C3005', micros[3].toLocaleString('en-CA'), 'USD'], ['C3007', micros[2].toLocaleString('en-CA'), 'CAD']])}`,
        answer, unit: 'CAD', tol: 0.0005,
        hint: 'Divide every spend_micros by 1,000,000 first. Then multiply the USD row by the rate before adding.',
        solution: steps(
          `In units: ${money(micros[0] / 1e6)}, ${money(micros[1] / 1e6)}, ${money(micros[2] / 1e6)} CAD and ${money(micros[3] / 1e6)} USD.`,
          `USD to CAD: ${money(micros[3] / 1e6)} × ${fx} = ${money((micros[3] / 1e6) * fx)}.`,
          `Total: <b>${money(answer)} CAD</b>. Keep the original amount and currency in staging too, so anyone can check the conversion.`),
        micros, fx,
      };
    },
    verify: (p) => (p.micros[0] + p.micros[1] + p.micros[2] + p.micros[3] * p.fx) / 1e6,
  },
  'cleaning-with-ai-cascade': {
    title: 'what an extraction cascade costs',
    make(r) {
      const docs = pick(r, 1000, 5000, 500), ruleP = pick(r, 50, 80, 5), localP = pick(r, 60, 90, 5), bigP = pick(r, 70, 95, 5), price = pick(r, 0.02, 0.08, 0.01), human = pick(r, 1, 3, 0.5);
      const afterRules = Math.round((docs * (100 - ruleP)) / 100), toBig = Math.round((afterRules * (100 - localP)) / 100), toHuman = Math.round((toBig * (100 - bigP)) / 100);
      const answer = toBig * price + toHuman * human;
      return {
        q: `<p>A grocery chain receives <b>${int(docs)}</b> supplier invoices a month. Fixed-layout rules extract <b>${ruleP}%</b>. A free local model handles <b>${localP}%</b> of what is left. Whatever still fails validation goes to a hosted model at <b>$${price.toFixed(2)}</b> per document, which passes <b>${bigP}%</b>; the rest go to a person at <b>$${human.toFixed(2)}</b> each. What is the monthly cost? (Round each count to a whole document.)</p>`,
        answer, unit: '$', tol: 0.005,
        hint: 'Follow the documents down the tiers: what rules miss, what the local model misses, what the hosted model misses. Pay the hosted model for every document it sees, and a person for every one that still fails.',
        solution: steps(
          `Rules miss ${100 - ruleP}%: ${int(docs)} × ${(100 - ruleP) / 100} = ${int(afterRules)}.`,
          `The local model misses ${100 - localP}% of those: ${int(toBig)} go to the hosted model, costing ${int(toBig)} × $${price.toFixed(2)} = ${money(toBig * price)}.`,
          `It misses ${100 - bigP}%: ${int(toHuman)} to a person, costing ${int(toHuman)} × $${human.toFixed(2)} = ${money(toHuman * human)}.`,
          `Total: <b>${money(answer)}</b> a month. Each tier only sees what the cheaper tier before it could not handle.`),
        docs, ruleP, localP, bigP, price, human,
      };
    },
    verify: (p) => {
      const big = Math.round(((100 - p.localP) * Math.round(((100 - p.ruleP) * p.docs) / 100)) / 100);
      const people = Math.round(((100 - p.bigP) * big) / 100);
      return big * p.price + people * p.human;
    },
  },
  'duplicates-entity-resolution-nights': {
    title: 'room nights after keeping the latest version',
    make(r) {
      const ids = [512001, 512002, 512003, 512004, 512005];
      const rows = [];
      let rec = 1;
      const latest = {};
      for (const id of ids) {
        const nv = pick(r, 1, 3);
        let nights = pick(r, 1, 5);
        for (let v = 0; v < nv; v++) {
          let status = 'confirmed';
          if (v === nv - 1 && nv > 1) status = r() < 0.5 ? 'cancelled' : 'confirmed';
          if (v > 0 && status === 'confirmed') nights = Math.max(1, nights + (r() < 0.5 ? 1 : -1));
          rows.push({ id, status, nights, day: rec++ });
          latest[id] = { status, nights };
        }
      }
      const shown = [...rows].sort((a, b) => (a.id * 7 + a.day * 3) % 11 - (b.id * 7 + b.day * 3) % 11);
      const answer = sum(Object.values(latest).filter((l) => l.status === 'confirmed').map((l) => l.nights));
      return {
        q: `<p>A hotel group's PMS sends a change feed: a booking reappears whenever it changes. Staging keeps the <b>latest version per booking_id</b> (highest file number). How many <b>confirmed room nights</b> are in staging?</p>${table(['file #', 'booking_id', 'status', 'nights'], shown.map((x) => [x.day, x.id, x.status, x.nights]))}`,
        answer, unit: 'nights', tol: 0, abs: 0.01,
        hint: 'Group the rows by booking_id, keep the one with the highest file number, then add the nights of the confirmed ones.',
        solution: steps(
          `Latest versions: ${ids.map((id) => `${id} ${latest[id].status} (${latest[id].nights})`).join('; ')}.`,
          `Confirmed nights: ${ids.filter((id) => latest[id].status === 'confirmed').map((id) => latest[id].nights).join(' + ') || '0'}.`,
          `Total: <b>${answer}</b>. Adding up every row instead would count old versions and cancelled bookings, and overstate occupancy.`),
        rows,
      };
    },
    verify: (p) => {
      const best = new Map();
      for (const x of p.rows) if (!best.has(x.id) || best.get(x.id).day < x.day) best.set(x.id, x);
      return [...best.values()].reduce((s, x) => s + (x.status === 'confirmed' ? x.nights : 0), 0);
    },
  },
  'duplicates-entity-resolution-precision': {
    title: 'precision of a fuzzy store matcher',
    make(r) {
      const aliases = pick(r, 40, 80, 2), proposed = pick(r, 30, aliases - 4), wrong = pick(r, 1, 6);
      const right = proposed - wrong, answer = (100 * right) / proposed;
      return {
        q: `<p>You match <b>${aliases}</b> messy store names from three systems to a grocery chain's store list. At your chosen threshold the matcher proposes <b>${proposed}</b> matches; checking by hand shows <b>${wrong}</b> of them point to the wrong store (like "110" matched to store 101). What is the matcher's <b>precision</b>, in %?</p>`,
        answer, unit: '%', tol: 0.001,
        hint: 'Precision = correct proposals ÷ all proposals. Names it did not propose at all do not enter precision (they affect recall).',
        solution: steps(
          `Correct proposals: ${proposed} − ${wrong} = ${right}.`,
          `Precision: ${right} ÷ ${proposed} = <b>${n(answer, 4)} %</b>.`,
          `Recall is ${right} ÷ ${aliases} = ${n((100 * right) / aliases, 3)} %. The ${wrong} wrong ones and the ${aliases - proposed} unmatched names go into the reviewed mapping table, which overrides the score.`),
        proposed, wrong,
      };
    },
    verify: (p) => 100 - (100 * p.wrong) / p.proposed,
  },
  'quality-gates-robust-z': {
    title: 'robust z-score for a volume check',
    make(r) {
      const base = pick(r, 400, 900, 10);
      const offs = [-24, -10, 4, 12, 26], sh = pick(r, 0, 4);
      const past = offs.map((o, i) => base + offs[(i + sh) % 5] + pick(r, -3, 3));
      past.splice(pick(r, 0, 4), 0, base * pick(r, 3, 5));
      const x = Math.round(base * pick(r, 1.8, 2.4, 0.1));
      const med = median(past), mad = median(past.map((v) => Math.abs(v - med))), answer = (x - med) / (1.4826 * mad);
      return {
        q: `<p>Order lines for one restaurant on its last six Saturdays (one was a double load):</p>${table(['Sat', 1, 2, 3, 4, 5, 6], [['lines', ...past.map(int)]])}<p>This Saturday shows <b>${int(x)}</b> lines. What is its robust z-score, <code>(x − median) ÷ (1.4826 × MAD)</code>?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'Median of six values = average of the middle two after sorting. MAD = median of the distances |value − median|.',
        solution: steps(
          `Sorted: ${[...past].sort((a, b) => a - b).map(int).join(', ')}. Median = ${n(med, 5)}.`,
          `Distances from the median: ${past.map((v) => n(Math.abs(v - med), 4)).join(', ')}. MAD = ${n(mad, 4)}.`,
          `z̃ = (${int(x)} − ${n(med, 5)}) ÷ (1.4826 × ${n(mad, 4)}) = <b>${n(answer, 3)}</b>. Far beyond 3.5, so it is flagged; a mean-based z would be dragged by the double load and might miss it.`),
        past, x,
      };
    },
    verify: (p) => {
      const s = [...p.past].sort((a, b) => a - b), m = (s[2] + s[3]) / 2;
      const d = p.past.map((v) => Math.abs(v - m)).sort((a, b) => a - b);
      return (p.x - m) / (1.4826 * ((d[2] + d[3]) / 2));
    },
  },
  'quality-gates-freshness': {
    title: 'count freshness breaches',
    make(r) {
      const sla = pick(r, 5, 6) * 60, days = 10;
      const arr = Array.from({ length: days }, () => pick(r, 3 * 60 + 30, 7 * 60 + 10, 5));
      const answer = arr.filter((m) => m > sla).length;
      return {
        q: `<p>A hotel group's PMS extract must land by <b>${hhmm(sla)}</b> (a file landing at exactly ${hhmm(sla)} is on time). Arrival times over ten days:</p>${table(['day', ...arr.map((_, i) => i + 1)], [['landed', ...arr.map(hhmm)]])}<p>How many days breached the freshness rule?</p>`,
        answer, unit: 'days', tol: 0, abs: 0.01,
        hint: `Compare each time with ${hhmm(sla)}. Only times strictly later count.`,
        solution: steps(
          `Late days: ${arr.map((m, i) => (m > sla ? `day ${i + 1} (${hhmm(m)})` : null)).filter(Boolean).join(', ') || 'none'}.`,
          `Breaches: <b>${answer}</b> of 10.`,
          'Each breach becomes a "warn" or "fail" row in the DQ table with its runbook line, and a run of them is evidence for a conversation with the vendor.'),
        arr, sla,
      };
    },
    verify: (p) => p.arr.reduce((s, m) => s + (m - p.sla > 0 ? 1 : 0), 0),
  },
  'proof-qsr-clean-conservation': {
    title: 'find rows that vanished',
    make(r) {
      const good = pick(r, 40000, 60000, 7), quar = pick(r, 60, 250), dup = pick(r, 100, 400), lost = pick(r, 0, 40);
      const rin = good + quar + dup + lost;
      return {
        q: `<p>One day of a restaurant chain's cleaning run logs: rows in <b>${int(rin)}</b>, good rows <b>${int(good)}</b>, quarantined <b>${quar}</b>, duplicates removed <b>${dup}</b>. How many rows are unaccounted for?</p>`,
        answer: lost, unit: 'rows', tol: 0, abs: 0.01,
        hint: 'Conservation: rows in = good + quarantined + duplicates removed. Whatever is left over vanished.',
        solution: steps(
          `Accounted for: ${int(good)} + ${quar} + ${dup} = ${int(good + quar + dup)}.`,
          `Unaccounted: ${int(rin)} − ${int(good + quar + dup)} = <b>${lost}</b>.`,
          lost ? 'Any number above zero fails the conservation test: some step drops rows without counting them. Find it before anyone reads the dashboard.' : 'Zero: every row is explained, so the conservation test passes.'),
        rin, good, quar, dup,
      };
    },
    verify: (p) => p.rin - p.good - p.quar - p.dup,
  },
};
