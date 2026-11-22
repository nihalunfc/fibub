// Live problems for the IELTS course: fresh numbers each time, an instant check, a hint and a worked solution.
// Placed in a lesson as <div class="problem" data-problem="id"></div>; tests/ielts.mjs runs each with 4 seeds.
import { overall, rawToBand, clbFor, fmtBand } from './bands.js';

const pick = (r, list) => list[Math.min(list.length - 1, Math.floor(r() * list.length))];
const int = (r, a, b) => a + Math.min(b - a, Math.floor(r() * (b - a + 1)));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const BANDS = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5];

export default {
  'overall-band': {
    title: 'work out the overall band',
    make(r) {
      const [l, rd, w, s] = [pick(r, BANDS), pick(r, BANDS), pick(r, BANDS.slice(0, 6)), pick(r, BANDS.slice(1, 7))];
      const sum = l + rd + w + s, mean = sum / 4, answer = overall(l, rd, w, s);
      return {
        q: `<p>A test taker scores Listening <b>${fmtBand(l)}</b>, Reading <b>${fmtBand(rd)}</b>, Writing <b>${fmtBand(w)}</b> and Speaking <b>${fmtBand(s)}</b>. What is the overall band?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Add the four bands and divide by 4. Then round to the nearest half band: .25 rounds up to .5 and .75 rounds up to the next whole band.',
        solution: steps(`Add: ${l} + ${rd} + ${w} + ${s} = ${sum}.`, `Divide by 4: ${sum} ÷ 4 = ${mean}.`, `Round to the nearest half band: <b>${fmtBand(answer)}</b>.`),
      };
    },
    verify(p) { const m = p.q.match(/<b>([\d.]+)<\/b>/g).map((x) => +x.replace(/<\/?b>/g, '')); return Math.round(((m[0] + m[1] + m[2] + m[3]) / 4) * 2 + 1e-9) / 2; },
  },
  'needed-writing': {
    title: 'find the Writing band you need',
    make(r) {
      const target = pick(r, [6, 6.5, 7, 7.5]);
      const l = target + pick(r, [0, 0.5, 1]), rd = target + pick(r, [0, 0.5]), s = target + pick(r, [-0.5, 0, 0.5]);
      // lowest writing band (step 0.5) that still gives the target overall
      let answer = 9;
      for (let w = 1; w <= 9; w += 0.5) if (overall(l, rd, w, s) >= target) { answer = w; break; }
      const need = target * 4 - 0.25 * 4;
      return {
        q: `<p>You need an overall band of <b>${fmtBand(target)}</b>. You already know you scored Listening ${fmtBand(l)}, Reading ${fmtBand(rd)} and Speaking ${fmtBand(s)}. What is the <b>lowest Writing band</b> that still gives you ${fmtBand(target)} overall (ignore any minimum per skill)?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: `An average of ${target - 0.25} already rounds up to ${fmtBand(target)}. So the four bands must add up to at least 4 × ${target - 0.25} = ${need}.`,
        solution: steps(`The mean must be at least ${target - 0.25}, so the total must be at least ${need}.`, `You have ${l} + ${rd} + ${s} = ${l + rd + s}.`, `Writing must be at least ${need} − ${l + rd + s} = ${need - l - rd - s}, and bands go in halves, so the lowest is <b>${fmtBand(answer)}</b>.`, 'Many universities and visas also set a minimum for each skill, so check that too.'),
      };
    },
    verify(p) { return p.answer; },
  },
  'listening-raw': {
    title: 'turn a Listening raw score into a band',
    make(r) {
      const raw = int(r, 18, 39), answer = rawToBand(raw, 'listening');
      return {
        q: `<p>You answer <b>${raw} of 40</b> Listening questions correctly. About what band is that? (Use the table in this lesson.)</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Find the row of the table whose raw-score range contains your score.',
        solution: steps(`${raw} correct answers falls in the row for band ${fmtBand(answer)}.`, 'The exact cut-offs move a little from test to test, so treat it as "about".'),
      };
    },
    verify(p) { return rawToBand(+p.q.match(/<b>(\d+) of 40/)[1], 'listening'); },
  },
  'reading-raw': {
    title: 'Academic or General Training: same score, different band',
    make(r) {
      const raw = int(r, 24, 38), paper = pick(r, ['academic', 'general']), answer = rawToBand(raw, paper);
      const name = paper === 'academic' ? 'Academic' : 'General Training';
      return {
        q: `<p>You get <b>${raw} of 40</b> in <b>${name}</b> Reading. About what band is that?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'General Training texts are easier, so you need more correct answers for the same band. Use the right column of the table.',
        solution: steps(`In the ${name} column, ${raw} correct is about band ${fmtBand(answer)}.`, `For comparison: ${raw} correct is about ${fmtBand(rawToBand(raw, 'academic'))} in Academic and ${fmtBand(rawToBand(raw, 'general'))} in General Training.`),
      };
    },
    verify(p) { const raw = +p.q.match(/<b>(\d+) of 40/)[1]; return rawToBand(raw, /Academic/.test(p.q) ? 'academic' : 'general'); },
  },
  'clb-level': {
    title: 'IELTS bands to a Canadian Language Benchmark',
    make(r) {
      const l = pick(r, [6, 7, 7.5, 8, 8.5]), rd = pick(r, [6, 6.5, 7, 8]), w = pick(r, [6, 6.5, 7, 7.5]), s = pick(r, [6, 6.5, 7, 7.5]);
      const each = [clbFor('listening', l), clbFor('reading', rd), clbFor('writing', w), clbFor('speaking', s)];
      const answer = Math.min(...each);
      return {
        q: `<p>For Canadian immigration your CLB level is often judged by your <b>lowest</b> skill. With General Training bands L ${fmtBand(l)}, R ${fmtBand(rd)}, W ${fmtBand(w)}, S ${fmtBand(s)}, what is the lowest CLB of the four skills?</p>`,
        answer, unit: 'CLB', tol: 0, abs: 0.01,
        hint: 'Convert each skill with the chart, one at a time. Listening needs higher bands than the other skills for the same CLB.',
        solution: steps(`Listening ${l} → CLB ${each[0]}; Reading ${rd} → CLB ${each[1]}; Writing ${w} → CLB ${each[2]}; Speaking ${s} → CLB ${each[3]}.`, `The lowest is <b>CLB ${answer}</b>.`),
      };
    },
    verify(p) { return p.answer; },
  },
  'study-hours': {
    title: 'plan your study hours',
    make(r) {
      const weeks = int(r, 4, 12), perDay = pick(r, [1, 1.5, 2]), days = int(r, 4, 6);
      const answer = weeks * perDay * days;
      return {
        q: `<p>You have <b>${weeks} weeks</b> until your test. You can study <b>${perDay} hours</b> a day on <b>${days} days</b> a week. How many hours of study is that in total?</p>`,
        answer, unit: 'hours', tol: 0, abs: 0.01,
        hint: 'Hours per week = hours per day × days per week. Then multiply by the number of weeks.',
        solution: steps(`Per week: ${perDay} × ${days} = ${perDay * days} hours.`, `Total: ${perDay * days} × ${weeks} = <b>${answer} hours</b>.`, 'Plan about a quarter of it as full timed practice, and the rest as skill work and review of mistakes.'),
      };
    },
    verify(p) { const n = p.q.match(/<b>([\d.]+) /g).map((x) => parseFloat(x.slice(3))); return n[0] * n[1] * n[2]; },
  },
  'words-per-minute': {
    title: 'can you write enough in the time?',
    make(r) {
      const words = pick(r, [260, 280, 300, 320]), minutes = pick(r, [30, 32, 35]);
      const answer = Math.round((words / minutes) * 10) / 10;
      return {
        q: `<p>For Task 2 you want to write about <b>${words} words</b>, and after planning and checking you have <b>${minutes} minutes</b> of writing time. How many words a minute must you write? (one decimal place)</p>`,
        answer, unit: 'words a minute', tol: 0.02,
        hint: 'Words ÷ minutes.',
        solution: steps(`${words} ÷ ${minutes} = <b>${answer}</b> words a minute.`, 'Time yourself on a practice essay: most people handwrite 10 to 15 words a minute when they are thinking at the same time.'),
      };
    },
    verify(p) { const n = p.q.match(/<b>(\d+) /g).map((x) => parseFloat(x.slice(3))); return n[0] / n[1]; },
  },
};
