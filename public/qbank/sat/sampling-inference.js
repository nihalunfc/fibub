// SAT Math · Problem-solving and data analysis · samples, margins of error and study design. Original (fibub).
import { int, choose, shuffleOpts, fmt, steps } from './_util.js';
const F = { section: 'math', domain: 'data' };

export default {
  topic: 'sampling-inference',
  gens: [
    { id: 'sat-si-g01', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'scale up a sample', facets: F, format: 'numeric',
      make(r) {
        const n = choose(r, [50, 80, 100, 120, 150, 200]), k = int(r, 2, n / 2 - 1), N = int(r, 4, 30) * 100;
        const ans = Math.round((k / n) * N);
        return { q: `<p>In a random sample of ${n} students from a school of ${N.toLocaleString('en-US')}, ${k} said they cycle to school. Based on the sample, about how many students in the whole school cycle to school? Round to the nearest whole number.</p>`, answer: ans, tol: 1, k, n, N,
          sol: steps(`Sample proportion: ${k}/${n} = ${fmt(k / n, 4)}.`, `Whole school: ${fmt(k / n, 4)} × ${N} ≈ <b>${ans}</b>.`) };
      },
      verify: (p) => Math.round((p.k / p.n) * p.N) },
    { id: 'sat-si-g02', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'margin of error', facets: F, format: 'single',
      make(r) {
        const est = int(r, 30, 70), moe = choose(r, [2, 3, 4, 5]);
        const right = `It is plausible that between ${est - moe}% and ${est + moe}% of all the town's voters support the plan.`;
        const o = shuffleOpts(r, right, [`Exactly ${est}% of all the town's voters support the plan.`, `Between ${est - moe}% and ${est + moe}% of the people in the sample support the plan.`, `At least ${est + moe}% of all the town's voters support the plan.`]);
        return { q: `<p>A random sample of voters in a town found that ${est}% support a new park plan, with a margin of error of ${moe} percentage points. Which conclusion is most appropriate?</p>`, ...o,
          sol: `<p>The margin of error gives a range of plausible values for the <i>whole population</i>: ${est} ± ${moe}. The sample's own figure is exactly ${est}%, so "the sample" option is not what the margin describes, and "exactly" claims too much. Answer: <b>${right}</b></p>` };
      } },
  ],
  items: [
    { id: 'sat-si-001', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'causation', facets: F,
      q: '<p>A researcher randomly chose 200 volunteers and randomly assigned half to drink green tea daily and half to drink water. After 8 weeks, the tea group had lower average blood pressure. Which conclusion is best supported?</p>',
      options: ['Drinking green tea daily likely causes lower blood pressure among people like these volunteers.', 'Drinking green tea lowers blood pressure for everyone in the country.', 'Green tea is related to blood pressure, but no cause can be suggested.', 'Water raises blood pressure.'], answer: 0,
      sol: '<p>Random <i>assignment</i> to groups lets you conclude cause and effect. But the people were volunteers, not a random sample of the country, so the result applies to people like them. Answer: the first option.</p>' },
    { id: 'sat-si-002', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'bias', facets: F,
      q: '<p>To estimate how many hours residents of a city exercise each week, a researcher surveys 300 people leaving a gym. Why is the estimate likely to be unreliable?</p>',
      options: ['The sample is not representative of all residents, since people at a gym probably exercise more than average.', 'The sample is too small to say anything.', 'Surveys can never be used to estimate averages.', 'The researcher should have surveyed 300 people at a library.'], answer: 0,
      sol: '<p>The problem is <b>who</b> was asked, not how many. People leaving a gym exercise more than typical residents, so the estimate will be too high. A library sample would be biased too; a random sample of all residents is what is needed.</p>' },
    { id: 'sat-si-003', type: 'mcq', marks: 1, level: 4, exams: ['sat'], sub: 'sample size', facets: F,
      q: '<p>Two random samples were taken from the same population to estimate a mean. Sample A has 100 people and sample B has 900 people. Which statement is most likely true?</p>',
      options: ['Sample B\'s estimate has a smaller margin of error.', 'Sample A\'s estimate has a smaller margin of error.', 'Both have the same margin of error.', 'Sample B\'s estimate must equal the true mean.'], answer: 0,
      sol: '<p>Larger random samples give more precise estimates, so <b>sample B</b> has the smaller margin of error (about a third as large here, since the margin shrinks with the square root of the sample size). No sample is guaranteed to hit the true mean exactly.</p>' },
  ],
};
