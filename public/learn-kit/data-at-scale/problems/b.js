// Live problems for Data at Scale, part b: Modules 5 to 8 (see ../problems.js).
import { pick, n, steps, table } from './util.js';

const fmt = (v) => Math.round(v).toLocaleString('en-CA');
const money = (v, d = 2) => '$' + (+v).toLocaleString('en-CA', { minimumFractionDigits: d, maximumFractionDigits: d });
const pad = (m) => String(m).padStart(2, '0');
const clock = (m) => (m < 0 ? `09:${pad(60 + m)}` : `10:${pad(m)}`);

// Late events: process in arrival order; the watermark is the largest event time seen so far minus the allowed lateness.
const lateRun = (evs, L, wEnd) => {
  let maxT = -1e9, counted = 0;
  for (const e of [...evs].sort((a, b) => a.arr - b.arr)) {
    if (e.t < wEnd && !(wEnd <= maxT - L)) counted++;
    maxT = Math.max(maxT, e.t);
  }
  return counted;
};

export default {
  // ---------- Module 5: Streaming with Kafka ----------
  'events-and-streams-peak': {
    title: 'work out the peak event rate a stream must handle',
    make(r) {
      const stores = pick(r, 300, 1200, 50), txns = pick(r, 400, 1200, 50), evPer = pick(r, 3, 6), share = pick(r, 12, 20), peakFactor = pick(r, 2, 4);
      const perDay = stores * txns * evPer, busyHour = perDay * share / 100, avgBusy = busyHour / 3600, answer = avgBusy * peakFactor;
      return {
        q: `<p>A quick-service restaurant chain has ${fmt(stores)} restaurants. Each serves about ${fmt(txns)} orders a day, and each order sends ${evPer} events to the stream (order placed, paid, ready and so on). The lunch hour carries ${share}% of the day's events, and the busiest minute of that hour runs at ${peakFactor} times the hour's average rate.</p><p>How many events per second must the stream handle at that peak?</p>`,
        answer, unit: 'events per second', tol: 0.01,
        hint: 'Events per day = restaurants × orders × events per order. Take the lunch-hour share, divide by 3,600 seconds, then multiply by the peak factor.',
        solution: steps(
          `Events per day = ${fmt(stores)} × ${fmt(txns)} × ${evPer} = ${fmt(perDay)}.`,
          `Lunch hour = ${share}% of that = ${fmt(busyHour)} events.`,
          `Average during lunch = ${fmt(busyHour)} ÷ 3,600 s = ${n(avgBusy)} events per second.`,
          `Peak = ${n(avgBusy)} × ${peakFactor} = <b>${n(answer)} events per second</b>. Size the system for the peak, not the daily average (${n(perDay / 86400)} per second).`),
        stores, txns, evPer, share, peakFactor,
      };
    },
    verify: (p) => (p.stores * p.txns * p.evPer) / 86400 * (24 * p.share / 100) * p.peakFactor,
  },
  'kafka-core-partitions': {
    title: 'choose how many partitions a topic needs',
    make(r) {
      const rate = pick(r, 6000, 48000, 1000), perConsumer = pick(r, 1500, 4000, 250), headroom = pick(r, 20, 50, 10);
      const need = rate * (1 + headroom / 100), answer = Math.ceil(need / perConsumer - 1e-9);
      return {
        q: `<p>An ad network's <code>ads.impressions.v1</code> topic receives ${fmt(rate)} messages per second at its busiest. One consumer in the billing group can process ${fmt(perConsumer)} messages per second. The team wants ${headroom}% headroom above the busiest rate.</p><p>What is the smallest number of partitions that lets the consumer group keep up?</p>`,
        answer, unit: 'partitions', tol: 0, abs: 0.01,
        hint: 'Each partition is read by exactly one consumer in a group, so you need at least as many partitions as consumers. Consumers needed = rate with headroom ÷ rate per consumer, rounded up.',
        solution: steps(
          `Rate with headroom = ${fmt(rate)} × ${1 + headroom / 100} = ${fmt(need)} messages per second.`,
          `Consumers needed = ${fmt(need)} ÷ ${fmt(perConsumer)} = ${n(need / perConsumer)}, rounded up to ${answer}.`,
          `A consumer group can use at most one consumer per partition, so the topic needs <b>${answer} partitions</b> (many teams round up further to leave room to grow).`),
        rate, perConsumer, headroom,
      };
    },
    verify: (p) => { let k = 1; while (k * p.perConsumer < p.rate * (1 + p.headroom / 100) - 1e-6) k++; return k; },
  },
  'kafka-core-lag': {
    title: 'work out consumer lag and the time to catch up',
    make(r) {
      const end = [0, 0, 0].map(() => pick(r, 40000, 90000, 500)), behind = [0, 0, 0].map(() => pick(r, 2000, 15000, 500));
      const committed = end.map((e, i) => e - behind[i]), lag = behind.reduce((s, v) => s + v, 0);
      const inRate = pick(r, 300, 900, 50), outRate = inRate + pick(r, 200, 800, 50), answer = lag / (outRate - inRate) / 60;
      return {
        q: `<p>A grocer's stock-update consumer group fell behind after a slow deploy. For the 3 partitions of its topic:</p>${table(['Partition', 'Latest offset', 'Committed offset'], end.map((e, i) => [i, fmt(e), fmt(committed[i])]))}<p>New messages keep arriving at ${inRate} per second, and the group now processes ${outRate} per second. How many <b>minutes</b> until the lag is back to zero?</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: 'Lag per partition = latest offset − committed offset. Add them up. The group gains on the backlog at (processing rate − arrival rate) messages per second.',
        solution: steps(
          `Lag = ${behind.map(fmt).join(' + ')} = ${fmt(lag)} messages.`,
          `Net catch-up speed = ${outRate} − ${inRate} = ${outRate - inRate} messages per second.`,
          `Time = ${fmt(lag)} ÷ ${outRate - inRate} = ${n(lag / (outRate - inRate))} s = <b>${n(answer)} minutes</b>.`),
        end, committed, inRate, outRate,
      };
    },
    verify: (p) => p.end.reduce((s, e, i) => s + e - p.committed[i], 0) / 60 / (p.outRate - p.inRate),
  },
  'kafka-reliability-dedup': {
    title: 'count the duplicates an at-least-once sink must remove',
    make(r) {
      const events = pick(r, 40000, 120000, 1000), once = pick(r, 1, 5, 0.5), twice = pick(r, 0.1, 0.8, 0.1), price = pick(r, 60, 180, 5);
      const d1 = Math.round(events * once / 100), d2 = Math.round(events * twice / 100), rows = events + d1 + 2 * d2, answer = rows - events;
      return {
        q: `<p>A hotel group streams ${fmt(events)} booking-payment events into its warehouse with <b>at-least-once</b> delivery. After a broker restart, ${once}% of the events were delivered one extra time and ${twice}% were delivered two extra times.</p><p>How many rows must the de-duplication step (keep one row per <code>event_id</code>) remove?</p>`,
        answer, unit: 'rows', tol: 0, abs: 0.5,
        hint: `Events delivered one extra time add 1 row each; events delivered two extra times add 2 rows each. The ${fmt(events)} real events stay.`,
        solution: steps(
          `One extra copy: ${once}% × ${fmt(events)} = ${fmt(d1)} rows.`,
          `Two extra copies: ${twice}% × ${fmt(events)} = ${fmt(d2)} events × 2 = ${fmt(2 * d2)} rows.`,
          `Rows landed = ${fmt(events)} + ${fmt(d1)} + ${fmt(2 * d2)} = ${fmt(rows)}. De-duplication removes <b>${fmt(answer)} rows</b>. Without it, revenue at an average ${money(price, 0)} a booking would be overstated by about ${money(answer * price, 0)}.`),
        d1, d2,
      };
    },
    verify: (p) => p.d1 + 2 * p.d2,
  },
  'stream-processing-late': {
    title: 'count which events a watermark lets into a window',
    make(r) {
      const L = pick(r, 2, 6);
      // six orders that arrive on time, plus two stragglers from the 10:00 window that arrive late
      const evs = [];
      for (let i = 0; i < 6; i++) { const arr = 3 * i + 1 + pick(r, 0, 1); evs.push({ t: arr - pick(r, 0, 1), arr }); }
      evs.push({ t: pick(r, 0, 4), arr: pick(r, 6, 9) }, { t: pick(r, 1, 4), arr: pick(r, 11, 19) });
      evs.sort((a, b) => a.arr - b.arr);
      evs.forEach((e, i) => { e.id = String.fromCharCode(65 + i); });
      const answer = lateRun(evs, L, 5);
      let maxT = -1e9; const ls = [];
      for (const e of evs) {
        const wm = maxT - L, inW = e.t < 5;
        const res = !inW ? 'belongs to a later window' : 5 <= wm ? '<b>dropped</b> (window already closed)' : '<b>counted</b>';
        ls.push(`${e.id}: watermark ${maxT < 0 ? 'not set yet' : clock(wm)}; happened ${clock(e.t)}, ${res}.`);
        maxT = Math.max(maxT, e.t);
      }
      ls.push(`Counted in the 10:00 to 10:05 window: <b>${answer}</b>. A longer watermark would count more late events but hold the result back longer.`);
      return {
        q: `<p>A stream job counts restaurant orders in 5-minute tumbling windows by <b>event time</b>, with a watermark of "largest event time seen so far minus ${L} minutes". An event whose window has ended at or before the watermark when it arrives is dropped. Events arrive in this order:</p>${table(['Event', 'Happened at', 'Arrived at'], evs.map((e) => [e.id, clock(e.t), clock(e.arr)]))}<p>How many events end up counted in the <b>10:00 to 10:05</b> window?</p>`,
        answer, unit: 'events', tol: 0, abs: 0.01,
        hint: 'Walk down the table in arrival order. Before each event, the watermark is (latest "happened at" so far) − lateness. The window is closed once the watermark reaches 10:05. Only events that happened before 10:05 belong to this window.',
        solution: steps(...ls),
        evs, L,
      };
    },
    verify: (p) => p.evs.filter((e, i) => e.t < 5 && !(Math.max(-1e9, ...p.evs.slice(0, i).map((x) => x.t)) - p.L >= 5)).length,
  },
  'stream-processing-windows': {
    title: 'count how many sliding windows each event lands in',
    make(r) {
      const size = pick(r, 10, 60, 5), slide = [1, 5, 5][Math.floor(r() * 3)], eventsPerMin = pick(r, 200, 900, 50);
      const per = size / slide, answer = eventsPerMin * per;
      return {
        q: `<p>A retail media team shows "clicks in the last ${size} minutes", updated every ${slide === 1 ? 'minute' : slide + ' minutes'}: a sliding window of ${size} minutes that moves on every ${slide === 1 ? 'minute' : slide + ' minutes'}. Clicks arrive at ${fmt(eventsPerMin)} a minute.</p><p>Each click is added to every window that covers it. How many window updates per minute does the job make?</p>`,
        answer, unit: 'updates per minute', tol: 0.001,
        hint: 'A click sits inside (window size ÷ slide) overlapping windows. Multiply by the clicks per minute.',
        solution: steps(
          `Windows covering one click = ${size} ÷ ${slide} = ${per}.`,
          `Updates per minute = ${fmt(eventsPerMin)} × ${per} = <b>${fmt(answer)}</b>. A tumbling window (slide = size) would need only ${fmt(eventsPerMin)}: overlap costs state and work.`),
        size, slide, eventsPerMin,
      };
    },
    verify: (p) => { let c = 0; for (let s = -p.size + p.slide; s <= 0; s += p.slide) c++; return c * p.eventsPerMin; },
  },

  // ---------- Module 6: Data platforms for AI and ML ----------
  'what-ml-needs-pit': {
    title: 'compute a point-in-time feature without leaking the future',
    make(r) {
      const asOf = pick(r, 12, 20);
      const days = []; let d = pick(r, 1, 3) - 30;
      while (d < 30) { days.push(d); d += pick(r, 2, 6); }
      const buys = days.filter((x) => x >= -19).slice(0, 12);
      const label = (x) => (x <= 0 ? `Oct ${31 + x}` : `Nov ${x}`);
      const inside = buys.filter((x) => x < asOf && x >= asOf - 30), answer = inside.length, naive = buys.filter((x) => x >= 1).length;
      return {
        q: `<p>A grocer is building a training row for loyalty member m42 with <code>as_of_date</code> = Nov ${asOf}. The feature is <b>buys_30d</b>: purchases in the 30 days <b>before</b> the as-of date, from ${label(asOf - 30)} up to Nov ${asOf - 1}. The member's purchase dates are:</p><p>${buys.map(label).join(', ')}</p><p>What value should buys_30d have?</p>`,
        answer, unit: 'purchases', tol: 0, abs: 0.01,
        hint: `Keep only dates from ${label(asOf - 30)} up to Nov ${asOf - 1}. A purchase on or after Nov ${asOf} had not happened yet on the as-of date.`,
        solution: steps(
          `Allowed range: ${label(asOf - 30)} to Nov ${asOf - 1}.`,
          `Inside it: ${inside.map(label).join(', ') || 'none'}.`,
          `buys_30d = <b>${answer}</b>. A careless join to "all purchases in November" would give ${naive}, which counts days after Nov ${asOf - 1}: that is leakage.`),
        buys, asOf,
      };
    },
    verify: (p) => p.buys.reduce((s, x) => s + (p.asOf - x >= 1 && p.asOf - x <= 30 ? 1 : 0), 0),
  },
  'feature-stores-mlops-online': {
    title: 'size an online feature store',
    make(r) {
      const members = pick(r, 2, 12) * 1e6, feats = pick(r, 20, 80, 5), bytes = 8, keyBytes = pick(r, 40, 120, 10), rep = pick(r, 2, 3);
      const perRow = feats * bytes + keyBytes, answer = members * perRow * rep / 1e9;
      return {
        q: `<p>A pharmacy chain serves ${n(members / 1e6)} million loyalty members' features from an online store for live offers. Each member row holds ${feats} numeric features of ${bytes} bytes each, plus about ${keyBytes} bytes of key and overhead. The store keeps ${rep} copies of everything for safety.</p><p>How many gigabytes (GB, 10<sup>9</sup> bytes) does the online store hold?</p>`,
        answer, unit: 'GB', tol: 0.01,
        hint: 'Bytes per row = features × 8 + overhead. Multiply by the number of members and by the number of copies, then divide by 10⁹.',
        solution: steps(
          `Bytes per row = ${feats} × ${bytes} + ${keyBytes} = ${perRow}.`,
          `One copy = ${n(members / 1e6)} million × ${perRow} bytes = ${n(members * perRow / 1e9)} GB.`,
          `With ${rep} copies: <b>${n(answer)} GB</b>. The online store holds only the latest value per member; the full history lives in the cheaper offline store.`),
        members, feats, bytes, keyBytes, rep,
      };
    },
    verify: (p) => (p.members * p.feats * p.bytes + p.members * p.keyBytes) * p.rep / 1e9,
  },
  'feature-stores-mlops-staleness': {
    title: 'work out the worst-case staleness of a materialised feature',
    make(r) {
      const every = [15, 30, 60, 120][Math.floor(r() * 4)], run = pick(r, 4, 25), upstream = pick(r, 5, 40, 5);
      const answer = upstream + every + run;
      return {
        q: `<p>An online feature <i>purchases in the last 7 days</i> is computed from a sales table that lands in the warehouse up to ${upstream} minutes after each sale. A materialisation job starts every ${every} minutes and takes ${run} minutes to copy fresh values to the online store.</p><p>In the worst case, how many minutes old is a sale before it shows up in the online feature?</p>`,
        answer, unit: 'minutes', tol: 0, abs: 0.01,
        hint: 'Add up the worst case of each wait: the sale lands late, just misses a job start, and then waits for the next job to finish.',
        solution: steps(
          `The sale lands in the warehouse up to ${upstream} minutes later.`,
          `It may just miss a job start, so it waits up to ${every} minutes for the next one.`,
          `That job takes ${run} minutes. Worst case = ${upstream} + ${every} + ${run} = <b>${answer} minutes</b>. If the model needs fresher data, this is the case for streaming features.`),
        every, run, upstream,
      };
    },
    verify: (p) => p.run + p.upstream + p.every,
  },
  'data-for-genai-chunks': {
    title: 'count the chunks to embed for a RAG index',
    make(r) {
      const docs = pick(r, 200, 3000, 100), tokens = pick(r, 1500, 6000, 100), size = [256, 400, 512, 800][Math.floor(r() * 4)], ov = [32, 50, 64, 100][Math.floor(r() * 4)];
      const per = Math.ceil((tokens - ov) / (size - ov) - 1e-9), answer = docs * per;
      return {
        q: `<p>A supermarket builds a help assistant over ${fmt(docs)} policy and product documents of about ${fmt(tokens)} tokens each. It splits each into chunks of ${size} tokens, with each chunk overlapping the previous one by ${ov} tokens.</p><p>How many chunks must be embedded? (Chunks per document = (tokens − overlap) ÷ (chunk size − overlap), rounded up.)</p>`,
        answer, unit: 'chunks', tol: 0, abs: 0.5,
        hint: 'Each new chunk moves forward by (chunk size − overlap) tokens. Work out chunks for one document, round up, then multiply by the number of documents.',
        solution: steps(
          `Step between chunks = ${size} − ${ov} = ${size - ov} tokens.`,
          `Chunks per document = (${fmt(tokens)} − ${ov}) ÷ ${size - ov} = ${n((tokens - ov) / (size - ov))}, rounded up to ${per}.`,
          `Total = ${fmt(docs)} × ${per} = <b>${fmt(answer)} chunks</b>. When one document changes, re-embed only its ${per} chunks, not all of them.`),
        docs, tokens, size, ov,
      };
    },
    verify: (p) => { let c = 0, start = 0; for (;;) { c++; if (start + p.size >= p.tokens) break; start += p.size - p.ov; } return c * p.docs; },
  },
  'data-for-genai-cosine': {
    title: 'compute the cosine similarity of two embeddings',
    make(r) {
      const a = [pick(r, -3, 5), pick(r, 1, 6), pick(r, -2, 4)], b = [pick(r, 1, 6), pick(r, -2, 5), pick(r, 0, 5)];
      const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2], na = Math.hypot(...a), nb = Math.hypot(...b), answer = dot / (na * nb);
      return {
        q: `<p>A tiny 3-number embedding model gives the search "rain coat" the vector <b>a</b> = (${a.join(', ')}) and the product "waterproof jacket" the vector <b>b</b> = (${b.join(', ')}). Real models use hundreds of numbers, but the sum is the same.</p><p>What is their cosine similarity? (1 = same direction, 0 = unrelated, −1 = opposite.)</p>`,
        answer, unit: '', tol: 0.005, abs: 0.002,
        hint: 'cos = (a · b) ÷ (|a| × |b|). The dot product multiplies matching numbers and adds them; |a| is the square root of the sum of squares.',
        solution: steps(
          `a · b = ${a.map((v, i) => `(${v})×(${b[i]})`).join(' + ')} = ${dot}.`,
          `|a| = √(${a.map((v) => v * v).join(' + ')}) = ${n(na, 4)}; |b| = √(${b.map((v) => v * v).join(' + ')}) = ${n(nb, 4)}.`,
          `cos = ${dot} ÷ (${n(na, 4)} × ${n(nb, 4)}) = <b>${n(answer, 3)}</b>. Vector search returns the chunks with the highest cosine to the question.`),
        a, b,
      };
    },
    verify: (p) => { const dot = p.a.reduce((s, v, i) => s + v * p.b[i], 0); return dot / Math.sqrt(p.a.reduce((s, v) => s + v * v, 0) * p.b.reduce((s, v) => s + v * v, 0)); },
  },
  'platform-architecture-replay': {
    title: 'estimate how long a kappa replay takes',
    make(r) {
      const days = pick(r, 7, 90), perDay = pick(r, 50, 600, 10), speed = pick(r, 20, 200, 10);
      const total = days * perDay * 1e6, answer = total / (speed * 1000) / 3600;
      return {
        q: `<p>A delivery app runs a <b>kappa</b> design: to fix a bug in its stream job, it replays the Kafka log from the start of retention. The topic keeps ${days} days of events at about ${perDay} million events a day. The fixed job can reprocess ${speed} thousand events per second while replaying.</p><p>How many <b>hours</b> will the replay take?</p>`,
        answer, unit: 'hours', tol: 0.01,
        hint: 'Events to replay = days × events per day. Divide by the replay speed in events per second, then by 3,600.',
        solution: steps(
          `Events = ${days} × ${perDay} million = ${n(total)}.`,
          `Seconds = ${n(total)} ÷ ${fmt(speed * 1000)} = ${n(total / (speed * 1000))}.`,
          `Hours = ${n(total / (speed * 1000))} ÷ 3,600 = <b>${n(answer)} hours</b>. If this is too slow, a lambda or lakehouse design reprocesses history in batch instead.`),
        days, perDay, speed,
      };
    },
    verify: (p) => (p.days * p.perDay) / (p.speed * 3.6),
  },

  // ---------- Module 7: Retail media, adtech and measurement ----------
  'retail-media-101-roas': {
    title: 'calculate ROAS for a sponsored products campaign',
    make(r) {
      const spend = pick(r, 4000, 30000, 500), roas = pick(r, 2.5, 9, 0.1), sales = Math.round(spend * roas);
      const answer = sales / spend;
      return {
        q: `<p>A snack brand spent ${money(spend, 0)} on sponsored products with a grocer. The grocer's report credits the campaign with ${money(sales, 0)} of attributed sales (14-day click window).</p><p>What is the campaign's <b>ROAS</b> (return on ad spend)?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'ROAS = attributed revenue ÷ ad spend. ACoS is the same two numbers the other way round.',
        solution: steps(
          `ROAS = ${money(sales, 0)} ÷ ${money(spend, 0)} = <b>${n(answer)}</b>, read as "${money(answer)} of sales per $1 of ads".`,
          `ACoS = ${money(spend, 0)} ÷ ${money(sales, 0)} = ${n(100 / answer)}%.`,
          'Both count attributed sales, which include shoppers who would have bought anyway. Lesson 7.3 shows how to measure the extra sales the ads caused.'),
        spend, sales,
      };
    },
    verify: (p) => 1 / (p.spend / p.sales),
  },
  'adtech-plumbing-auction': {
    title: 'find the winner and price of a sponsored products auction',
    make(r) {
      const names = ['Brand A', 'Brand B', 'Brand C', 'Brand D'];
      const bids = names.map((_, i) => +(pick(r, 0.4, 2.0, 0.05) + i * 0.03).toFixed(2)), ctr = names.map(() => pick(r, 1, 6, 0.5));
      const score = bids.map((b, i) => b * ctr[i]);
      const order = score.map((s, i) => i).sort((a, b) => score[b] - score[a]);
      const w = order[0], s2 = order[1], answer = +(score[s2] / ctr[w] + 0.01).toFixed(2);
      return {
        q: `<p>Four cola brands bid per click for the top search slot on "cola". The grocer's ad server ranks them by <b>score = bid × predicted click rate</b>. The winner pays the smallest bid that would still have matched the runner-up's score, plus $0.01 (a second-price rule).</p>${table(['Brand', 'Bid per click', 'Predicted CTR'], names.map((nm, i) => [nm, money(bids[i]), ctr[i] + '%']))}<p>What does the winner pay per click, in dollars?</p>`,
        answer, unit: '$ per click', tol: 0, abs: 0.011,
        hint: 'Compute each score. The winner has the highest. Its price = runner-up score ÷ winner\'s CTR, plus $0.01.',
        solution: steps(
          `Scores: ${names.map((nm, i) => `${nm} ${money(bids[i])} × ${ctr[i]} = ${n(score[i], 4)}`).join('; ')}.`,
          `Winner: ${names[w]} (score ${n(score[w], 4)}). Runner-up: ${names[s2]} (score ${n(score[s2], 4)}).`,
          `Price = ${n(score[s2], 4)} ÷ ${ctr[w]} + 0.01 = <b>${money(answer)} per click</b>, at or below its bid of ${money(bids[w])}. A brand with a lower bid can win if shoppers click its ad more.`),
        bids, ctr,
      };
    },
    verify: (p) => { const sc = p.bids.map((b, i) => [b * p.ctr[i], i]).sort((a, b) => b[0] - a[0]); return +(sc[1][0] / p.ctr[sc[0][1]] + 0.01).toFixed(2); },
  },
  'adtech-plumbing-pacing': {
    title: 'check whether a campaign is on pace',
    make(r) {
      const budget = pick(r, 10000, 80000, 1000), days = pick(r, 7, 30), day = pick(r, 2, days - 1), hour = pick(r, 6, 20);
      const plan = budget * ((day - 1) + hour / 24) / days, spent = Math.round(plan * pick(r, 0.7, 1.3, 0.05)), answer = spent - plan;
      return {
        q: `<p>A pet-food brand's campaign has a ${money(budget, 0)} budget spread evenly over ${days} days. It is now ${hour}:00 on day ${day}, and the live spend counter reads ${money(spent, 0)}.</p><p>How many dollars <b>ahead of plan</b> is it? (Give a negative number if it is behind.)</p>`,
        answer, unit: '$', tol: 0.002, abs: 1,
        hint: 'Time used = (full days done) + (hours today ÷ 24). Planned spend = budget × time used ÷ total days. Compare with the counter.',
        solution: steps(
          `Time used = ${day - 1} days + ${hour}/24 = ${n((day - 1) + hour / 24, 4)} days of ${days}.`,
          `Planned spend = ${money(budget, 0)} × ${n((day - 1) + hour / 24, 4)} ÷ ${days} = ${money(plan)}.`,
          `Ahead by ${money(spent, 0)} − ${money(plan)} = <b>${money(answer)}</b>. ${answer > 0 ? 'The pacing job should slow the bidding so the budget lasts to the end date.' : 'The pacing job can bid a little harder to catch up.'}`),
        budget, days, day, hour, spent,
      };
    },
    verify: (p) => p.spent - p.budget / p.days * (p.day - 1 + p.hour / 24),
  },
  'measurement-iroas': {
    title: 'calculate lift and incremental ROAS from a holdout test',
    make(r) {
      const nt = pick(r, 200, 900, 50) * 1000, nc = Math.round(nt / pick(r, 4, 9)), pc = pick(r, 1.5, 4, 0.1), lift = pick(r, 8, 30, 1);
      const pt = +(pc * (1 + lift / 100)).toFixed(2), bt = Math.round(nt * pt / 100), bc = Math.round(nc * pc / 100);
      const basket = pick(r, 8, 25), spend = pick(r, 15, 60) * 1000;
      const rt = bt / nt, rc = bc / nc, inc = (rt - rc) * nt, answer = inc * basket / spend;
      return {
        q: `<p>A coffee brand ran a campaign for a grocer's loyalty shoppers, with a random holdout that saw no ads.</p>${table(['Group', 'Shoppers', 'Bought the brand'], [['Exposed', fmt(nt), fmt(bt)], ['Holdout', fmt(nc), fmt(bc)]])}<p>The average brand basket is ${money(basket, 0)} and the media cost ${money(spend, 0)}. What is the <b>incremental ROAS</b> (incremental revenue ÷ spend)?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Rates first: buyers ÷ shoppers in each group. Incremental buyers = (exposed rate − holdout rate) × exposed shoppers. Revenue = that × basket.',
        solution: steps(
          `Exposed rate = ${fmt(bt)} ÷ ${fmt(nt)} = ${n(rt * 100, 4)}%; holdout rate = ${fmt(bc)} ÷ ${fmt(nc)} = ${n(rc * 100, 4)}%.`,
          `Incremental buyers = (${n(rt, 4)} − ${n(rc, 4)}) × ${fmt(nt)} = ${fmt(inc)}.`,
          `Incremental revenue = ${fmt(inc)} × ${money(basket, 0)} = ${money(inc * basket, 0)}.`,
          `iROAS = ${money(inc * basket, 0)} ÷ ${money(spend, 0)} = <b>${n(answer)}</b>. Attributed ROAS would have counted all ${fmt(bt)} exposed buyers: ${n(bt * basket / spend)}.`),
        nt, nc, bt, bc, basket, spend,
      };
    },
    verify: (p) => (p.bt - p.bc * p.nt / p.nc) * p.basket / p.spend,
  },
  'measurement-interval': {
    title: 'find the 95% interval of a measured lift',
    make(r) {
      const nt = pick(r, 100, 500, 50) * 1000, nc = pick(r, 50, 150, 10) * 1000, pc = pick(r, 1.5, 4, 0.1) / 100, pt = pc + pick(r, 0.1, 0.6, 0.05) / 100;
      const se = Math.sqrt(pt * (1 - pt) / nt + pc * (1 - pc) / nc), lo = (pt - pc - 1.96 * se) * 100;
      return {
        q: `<p>In a holdout test, ${fmt(nt)} exposed shoppers bought at ${n(pt * 100, 3)}% and ${fmt(nc)} holdout shoppers at ${n(pc * 100, 3)}%.</p><p>What is the <b>lower end</b> of the 95% confidence interval for the absolute lift, in percentage points?</p>`,
        answer: lo, unit: 'percentage points', tol: 0.01, abs: 0.002,
        hint: 'SE = √( p_t(1 − p_t)/n_t + p_c(1 − p_c)/n_c ), with rates as decimals. Lower end = (p_t − p_c) − 1.96 × SE. Multiply by 100 to get points.',
        solution: steps(
          `Lift = ${n(pt, 4)} − ${n(pc, 4)} = ${n(pt - pc, 3)} (${n((pt - pc) * 100, 3)} points).`,
          `SE = √(${n(pt, 4)} × ${n(1 - pt, 4)} ÷ ${fmt(nt)} + ${n(pc, 4)} × ${n(1 - pc, 4)} ÷ ${fmt(nc)}) = ${n(se, 3)}.`,
          `Lower end = ${n(pt - pc, 3)} − 1.96 × ${n(se, 3)} = ${n(lo / 100, 3)}, so <b>${n(lo, 3)} points</b>. ${lo > 0 ? 'It is above zero, so the lift is significant at 95%.' : 'It is below zero, so you cannot claim a lift yet.'}`),
        nt, nc, pt, pc,
      };
    },
    verify: (p) => 100 * ((p.pt - p.pc) - 1.96 * Math.hypot(Math.sqrt(p.pt * (1 - p.pt) / p.nt), Math.sqrt(p.pc * (1 - p.pc) / p.nc))),
  },
  'retail-media-platform-storage': {
    title: 'estimate storage for months of impression logs',
    make(r) {
      const perDay = pick(r, 50, 600, 10) * 1e6, rowBytes = pick(r, 300, 900, 50), ratio = pick(r, 5, 12), months = pick(r, 6, 24, 6);
      const tb = perDay * rowBytes / ratio * 30 * months / 1e12;
      return {
        q: `<p>A grocer's retail media network serves about ${n(perDay / 1e6)} million impressions a day. Each raw impression row is about ${rowBytes} bytes as JSON. Stored as Parquet in the lake it is ${ratio} times smaller. The network keeps ${months} months (count 30 days per month).</p><p>How many terabytes (TB, 10<sup>12</sup> bytes) of Parquet does it keep?</p>`,
        answer: tb, unit: 'TB', tol: 0.01,
        hint: 'Bytes per day = impressions × row size ÷ compression. Multiply by the days kept, then divide by 10¹².',
        solution: steps(
          `Raw per day = ${n(perDay)} × ${rowBytes} bytes = ${n(perDay * rowBytes / 1e9)} GB.`,
          `Parquet per day = ${n(perDay * rowBytes / 1e9)} ÷ ${ratio} = ${n(perDay * rowBytes / ratio / 1e9)} GB.`,
          `Kept = ${n(perDay * rowBytes / ratio / 1e9)} GB × ${30 * months} days = <b>${n(tb)} TB</b>. Multiply by your cloud's storage price per GB-month (check the official price list) for the monthly bill.`),
        perDay, rowBytes, ratio, months,
      };
    },
    verify: (p) => (p.perDay / 1e12) * 30 * p.months * (p.rowBytes / p.ratio),
  },
  'retail-media-platform-did': {
    title: 'read a store screen test with difference-in-differences',
    make(r) {
      const tb = pick(r, 40, 90, 0.5), cb = pick(r, 40, 90, 0.5), trend = pick(r, -3, 6, 0.5), eff = pick(r, 1, 8, 0.5);
      const ta = +(tb + trend + eff).toFixed(1), ca = +(cb + trend).toFixed(1), answer = +((ta - tb) - (ca - cb)).toFixed(2);
      return {
        q: `<p>A cola brand put in-store screens in 75 test stores and none in 75 matched control stores. Average weekly cola sales per store (in $000):</p>${table(['Stores', 'Before', 'During campaign'], [['Test (screens)', tb, ta], ['Control', cb, ca]])}<p>Using <b>difference-in-differences</b>, how much did the screens add per store per week, in $000?</p>`,
        answer, unit: '$000', tol: 0.001, abs: 0.05,
        hint: 'Change in test stores minus change in control stores. The control change is what would have happened anyway (season, prices, weather).',
        solution: steps(
          `Test change = ${ta} − ${tb} = ${n(ta - tb)}.`,
          `Control change = ${ca} − ${cb} = ${n(ca - cb)} (what the season did to every store).`,
          `Effect = ${n(ta - tb)} − (${n(ca - cb)}) = <b>${n(answer)}</b> thousand dollars per store per week.`),
        tb, ta, cb, ca,
      };
    },
    verify: (p) => (p.ta - p.ca) - (p.tb - p.cb),
  },

  // ---------- Module 8: What to learn next ----------
  'learning-path-weeks': {
    title: 'turn a learning plan into weeks',
    make(r) {
      const items = [['BigQuery in depth', pick(r, 10, 20)], ['dbt on BigQuery', pick(r, 6, 12)], ['PySpark', pick(r, 15, 30)], ['Airflow', pick(r, 6, 12)], ['Kafka and streaming', pick(r, 12, 24)]];
      const perWeek = pick(r, 5, 12), total = items.reduce((s, x) => s + x[1], 0), answer = Math.ceil(total / perWeek - 1e-9);
      return {
        q: `<p>You plan these steps, with honest hour estimates:</p>${table(['Step', 'Hours'], items)}<p>You can give ${perWeek} hours a week. How many weeks will the plan take (round up to whole weeks)?</p>`,
        answer, unit: 'weeks', tol: 0, abs: 0.01,
        hint: 'Add the hours, divide by hours per week, and round up.',
        solution: steps(
          `Total = ${items.map((x) => x[1]).join(' + ')} = ${total} hours.`,
          `${total} ÷ ${perWeek} = ${n(total / perWeek)}, rounded up to <b>${answer} weeks</b>. Put the steps in order so each project builds on the last.`),
        items, perWeek,
      };
    },
    verify: (p) => { let h = p.items.reduce((s, x) => s + x[1], 0), w = 0; while (h > 0) { h -= p.perWeek; w++; } return w; },
  },
  'postings-and-interviews-sizing': {
    title: 'do the back-of-envelope sizing an interviewer asks for',
    make(r) {
      const lines = pick(r, 1, 4, 0.5) * 1e9, bytes = pick(r, 80, 200, 10), ratio = pick(r, 4, 10), cols = pick(r, 20, 40, 5), used = pick(r, 3, 8), days = 30;
      const answer = lines / days * bytes / ratio * used / cols / 1e9;
      return {
        q: `<p>Interview prompt: "design a nightly pipeline for till lines". A national retail chain keeps ${n(lines / 1e9)} billion till lines covering the last ${days} days, about ${bytes} bytes each raw. In columnar storage they shrink ${ratio} times, spread evenly over ${cols} columns. The nightly report reads only <b>yesterday's</b> partition and only ${used} of the columns.</p><p>About how many GB does the nightly query scan?</p>`,
        answer, unit: 'GB', tol: 0.01,
        hint: 'One day = total ÷ 30. Compressed bytes = lines × bytes ÷ compression. A columnar store reads only the columns used: multiply by used ÷ total columns.',
        solution: steps(
          `One day of lines = ${n(lines)} ÷ ${days} = ${n(lines / days)}.`,
          `Compressed size of that day = ${n(lines / days)} × ${bytes} ÷ ${ratio} = ${n(lines / days * bytes / ratio / 1e9)} GB.`,
          `Columns read = ${used} of ${cols}, so scanned ≈ ${n(lines / days * bytes / ratio / 1e9)} × ${used}/${cols} = <b>${n(answer)} GB</b>. Saying this out loud shows you know partition pruning and columnar storage.`),
        lines, bytes, ratio, cols, used, days,
      };
    },
    verify: (p) => (p.lines * p.bytes * p.used) / (p.days * p.ratio * p.cols * 1e9),
  },
  'mini-projects-planted-lift': {
    title: 'plan the lift you plant in synthetic data',
    make(r) {
      const users = pick(r, 20, 100, 10) * 1000, hold = pick(r, 10, 20, 5), base = pick(r, 2, 6, 0.5), lift = pick(r, 10, 30, 5);
      const exposed = users * (1 - hold / 100), answer = exposed * base / 100 * lift / 100;
      return {
        q: `<p>For your capstone you generate ${fmt(users)} synthetic shoppers. ${hold}% go to a holdout that sees no ads. Without ads, a shopper buys the brand with probability ${base}%. You plant a true relative lift of +${lift}% for exposed shoppers.</p><p>How many <b>incremental buyers</b> should your measurement notebook recover, on average?</p>`,
        answer, unit: 'buyers', tol: 0.005,
        hint: 'Exposed shoppers = all × (1 − holdout share). Their extra buying rate = base rate × lift. Multiply.',
        solution: steps(
          `Exposed = ${fmt(users)} × ${n(1 - hold / 100)} = ${fmt(exposed)}.`,
          `Extra rate = ${base}% × ${lift}% = ${n(base * lift / 100)} percentage points.`,
          `Incremental buyers = ${fmt(exposed)} × ${n(base * lift / 1e4, 4)} = <b>${n(answer)}</b>. If your notebook's interval does not contain this, there is a bug in the pipeline or the maths.`),
        users, hold, base, lift,
      };
    },
    verify: (p) => (p.users - p.users * p.hold / 100) * (p.base * (1 + p.lift / 100) - p.base) / 100,
  },
  'free-sandboxes-queries': {
    title: 'count how many queries fit in a free monthly allowance',
    make(r) {
      const allowance = pick(r, 500, 1000, 100), size = pick(r, 20, 120, 5), share = pick(r, 10, 40, 5), days = [1, 7, 30][Math.floor(r() * 3)];
      const scan = size * share / 100 / days, answer = Math.floor(allowance / scan + 1e-9);
      return {
        q: `<p>Suppose your sandbox gives you ${allowance} GB of free query scanning a month (check the official docs for the real allowance). You practise on a ${size} GB public table. Your query reads columns that make up ${share}% of the table${days === 1 ? '' : `, and filters on the date so only 1 of the ${days} daily partitions is read`}.</p><p>How many times can you run it before the month's allowance is used up?</p>`,
        answer, unit: 'queries', tol: 0, abs: 0.01,
        hint: 'Bytes scanned per run = table size × share of columns' + (days === 1 ? '' : ' ÷ number of days (partition pruning)') + '. Divide the allowance by that and round down.',
        solution: steps(
          `Scanned per run = ${size} GB × ${share}%${days === 1 ? '' : ` ÷ ${days}`} = ${n(scan)} GB.`,
          `${allowance} ÷ ${n(scan)} = ${n(allowance / scan)}, rounded down to <b>${answer} runs</b>. <code>SELECT *</code> on the whole table would scan ${size} GB each time.`),
        allowance, size, share, days,
      };
    },
    verify: (p) => Math.floor((p.allowance * p.days * 100) / (p.size * p.share) + 1e-9),
  },
};
