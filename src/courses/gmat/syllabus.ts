// GMAT prep (nihal, 2026-11-22): the whole GMAT (Focus Edition format: Quantitative Reasoning, Verbal Reasoning
// and Data Insights) taught from zero, so a student can prepare alone, with no teacher. Plan:
// /mnt/project-files/gmat-gre-courses/plan.md. Every question is original: nothing is copied from GMAC.
//
// How it works: the long-course engine (src/courses/types.ts) with the lesson kit (`kit: true`): figures are JS
// modules in public/learn-kit/gmat/figs/, live problems in public/learn-kit/gmat/problems.js. The live problems
// come from the shared question bank (public/qbank/grad-quant/, also used by the GRE course), so each one makes
// fresh numbers every time. Checks: tests/gmat.mjs.
import type { CourseSyllabus } from '../types';

export const GMAT: CourseSyllabus = {
  id: 'gmat',
  name: 'GMAT prep',
  title: 'GMAT prep from zero: Quant, Verbal and Data Insights',
  text: 'Everything on the GMAT (Focus Edition format), taught from the basics so you can prepare alone: number properties, algebra, word problems, statistics, Critical Reasoning, Reading Comprehension and all five Data Insights question types, with worked examples you can step through, fresh practice questions every visit and full timed practice.',
  audience: 'For anyone applying to business school. School maths is enough to start: every method is built up step by step, and every question has a full worked solution.',
  updated: '2026-11-22',
  footnote: 'Independent free course, not part of or endorsed by GMAC. GMAT is a trademark of the Graduate Management Admission Council. Every question here is original. Test rules change: check mba.com before you book.',
  kit: true,
  parts: [
    { name: 'Part A: Start here', modules: [
      { n: 1, name: 'The exam and your plan', lessons: [
        ['1.1', 'what-is-the-gmat', 'What the GMAT is and how it is built'],
        ['1.2', 'gmat-scores', 'How GMAT scoring works'],
        ['1.3', 'study-plan', 'Your study plan: 6, 10 or 14 weeks'],
        ['1.4', 'mental-maths', 'Mental maths: the speed you need with no calculator'],
      ] },
    ] },
    { name: 'Part B: Quantitative Reasoning', modules: [
      { n: 2, name: 'Number properties', lessons: [
        ['2.1', 'integers-divisibility', 'Integers and divisibility rules'],
        ['2.2', 'primes-factors', 'Primes, factors, GCD and LCM'],
        ['2.3', 'odd-even-remainders', 'Odd, even, positive, negative and remainders'],
        ['2.4', 'exponents-roots', 'Exponents and roots'],
        ['2.5', 'fractions-decimals', 'Fractions, decimals and estimation'],
      ] },
      { n: 3, name: 'Algebra', lessons: [
        ['3.1', 'linear-equations', 'Linear equations and systems'],
        ['3.2', 'quadratics', 'Quadratics and factoring'],
        ['3.3', 'inequalities-absolute-value', 'Inequalities and absolute value'],
        ['3.4', 'functions-sequences', 'Functions, symbols and sequences'],
      ] },
      { n: 4, name: 'Word problems', lessons: [
        ['4.1', 'percents', 'Percents and percent change'],
        ['4.2', 'ratios-mixtures', 'Ratios, proportions and mixtures'],
        ['4.3', 'rates-work', 'Speed, distance, and work rates'],
        ['4.4', 'interest-profit', 'Profit, discounts and interest'],
        ['4.5', 'overlapping-sets', 'Overlapping sets and tables'],
      ] },
      { n: 5, name: 'Statistics, counting and probability', lessons: [
        ['5.1', 'averages', 'Averages and weighted averages'],
        ['5.2', 'median-range-sd', 'Median, range and standard deviation'],
        ['5.3', 'counting', 'Counting: arrangements and choices'],
        ['5.4', 'probability', 'Probability'],
        ['5.5', 'quant-review', 'Quant review: choosing the fastest method'],
      ] },
    ] },
    { name: 'Part C: Verbal Reasoning', modules: [
      { n: 6, name: 'Critical Reasoning', lessons: [
        ['6.1', 'critical-reasoning', 'Critical Reasoning: reading an argument'],
        ['6.2', 'assumptions', 'Assumption questions'],
        ['6.3', 'strengthen-weaken', 'Strengthen and weaken'],
        ['6.4', 'evaluate-flaw', 'Evaluate and flaw questions'],
        ['6.5', 'inference', 'Inference: what must be true'],
        ['6.6', 'boldface-paradox', 'Boldface and paradox questions'],
      ] },
      { n: 7, name: 'Reading Comprehension', lessons: [
        ['7.1', 'reading-method', 'Reading a passage fast and well'],
        ['7.2', 'main-idea-detail', 'Main idea and detail questions'],
        ['7.3', 'rc-inference', 'Inference and application questions'],
        ['7.4', 'structure-tone', 'Structure, purpose and tone'],
      ] },
    ] },
    { name: 'Part D: Data Insights', modules: [
      { n: 8, name: 'Data Insights', lessons: [
        ['8.1', 'data-sufficiency', 'Data Sufficiency: the method'],
        ['8.2', 'data-sufficiency-traps', 'Data Sufficiency traps'],
        ['8.3', 'table-analysis', 'Table Analysis'],
        ['8.4', 'graphics-interpretation', 'Graphics Interpretation'],
        ['8.5', 'two-part-analysis', 'Two-Part Analysis'],
        ['8.6', 'multi-source-reasoning', 'Multi-Source Reasoning'],
      ] },
    ] },
    { name: 'Part E: Test day', modules: [
      { n: 9, name: 'Strategy and full practice', lessons: [
        ['9.1', 'pacing', 'Pacing, guessing and the review screen'],
        ['9.2', 'practice-test', 'Full practice test'],
        ['9.3', 'after-the-test', 'After the test: scores, retakes and applications'],
      ] },
    ] },
  ],
};
