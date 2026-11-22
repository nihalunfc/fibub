// Statistics for analysts (nihal, 2026-11-22): the statistics a data or BI analyst uses at work, from
// describing data to A/B tests, with simulations and the maths worked by hand. Plan:
// /mnt/project-files/analyst-courses/plan.md (9 modules, built over 3 PRs). Same engine as ML foundations
// (src/courses/types.ts): a lesson goes live when src/courses/statistics/<slug>.md exists; figures are
// <!--fig:name--> (src/courses/statistics/figures/index.ts); maths is LaTeX, turned into MathML at build time.
// The sums behind every simulation live in src/lib/stats/ and are checked by tests/stats.mjs.
import type { CourseSyllabus } from '../types';

export const STATISTICS: CourseSyllabus = {
  id: 'statistics',
  name: 'Statistics for analysts',
  title: 'Statistics for analysts: from averages to A/B tests',
  text: 'The statistics data and BI analysts use every week: describing data, probability, distributions, sampling, confidence intervals, hypothesis tests and A/B testing, with simulations you can play with and every formula worked by hand.',
  audience: 'For analysts, students and career changers. School maths is enough; each formula is explained symbol by symbol.',
  updated: '2026-11-22',
  footnote: 'Numbers in the examples are made up to show the idea unless a source is given. Simulations run in your browser; nothing you type is sent anywhere.',
  parts: [
    { name: 'Part A: Describing data and chance', modules: [
      { n: 1, name: 'Describing data', lessons: [
        ['1.1', 'why-statistics', 'Why analysts need statistics'],
        ['1.2', 'centre', 'The centre: mean, median and mode'],
        ['1.3', 'spread', 'The spread: range, variance, standard deviation and IQR'],
        ['1.4', 'shape-outliers', 'Shape, skew and outliers: reading a box plot'],
        ['1.5', 'percentiles-z-scores', 'Percentiles and z-scores: where one value stands'],
      ] },
      { n: 2, name: 'Probability for decisions', lessons: [
        ['2.1', 'probability-rules', 'Probability rules with pictures'],
        ['2.2', 'conditional-bayes', 'Conditional probability and Bayes: the base-rate trap'],
        ['2.3', 'expected-value', 'Expected value: is the promotion worth it?'],
        ['2.4', 'counting', 'Counting: combinations and permutations'],
      ] },
      { n: 3, name: 'Distributions', lessons: [
        ['3.1', 'random-variables', 'Random variables and distributions'],
        ['3.2', 'binomial', 'The binomial: how many of n say yes'],
        ['3.3', 'poisson', 'The Poisson: orders per hour and rare events'],
        ['3.4', 'normal-distribution', 'The normal distribution and its areas'],
        ['3.5', 'skewed-distributions', 'Waiting times and money: exponential and log-normal'],
        ['3.6', 'choosing-distribution', 'Which distribution fits your data'],
      ] },
    ] },
    { name: 'Part B: From a sample to the truth', modules: [
      { n: 4, name: 'Samples', lessons: [
        ['4.1', 'samples-populations', 'Populations and samples'],
        ['4.2', 'sampling-bias', 'Bias: survivorship, selection and non-response'],
        ['4.3', 'central-limit-theorem', 'The central limit theorem'],
        ['4.4', 'standard-error', 'Standard error: how much a sample result wobbles'],
        ['4.5', 'bootstrap', 'The bootstrap: resampling your own data'],
      ] },
      { n: 5, name: 'Estimation', lessons: [
        ['5.1', 'confidence-interval-mean', 'Confidence intervals for a mean'],
        ['5.2', 'confidence-interval-proportion', 'Confidence intervals for a proportion'],
        ['5.3', 'what-95-means', 'What "95 % confident" really means'],
        ['5.4', 'sample-size-planning', 'How big a sample do you need?'],
      ] },
      { n: 6, name: 'Hypothesis tests', lessons: [
        ['6.1', 'test-logic', 'The logic of a test: null, alternative and evidence'],
        ['6.2', 'p-values', 'P-values: what they are and what they are not'],
        ['6.3', 't-tests', 't-tests: one sample, two samples and paired'],
        ['6.4', 'errors-power', 'Type I and type II errors, and power'],
        ['6.5', 'chi-square', 'Chi-square tests for categories'],
        ['6.6', 'anova', 'ANOVA: comparing three or more groups'],
        ['6.7', 'non-parametric', 'When the data is not normal: rank tests'],
        ['6.8', 'multiple-comparisons', 'Many tests at once: the multiple comparisons trap'],
        ['6.9', 'effect-size', 'Effect size: significant is not the same as important'],
      ] },
    ] },
    { name: 'Part C: Statistics at work', modules: [
      { n: 7, name: 'A/B testing', lessons: [
        ['7.1', 'ab-test-design', 'Designing an A/B test'],
        ['7.2', 'ab-metrics', 'Choosing metrics: primary, secondary and guardrails'],
        ['7.3', 'ab-sample-size', 'Sample size and how long to run'],
        ['7.4', 'peeking', 'The peeking problem'],
        ['7.5', 'ab-analysis', 'Reading a conversion test from start to finish'],
        ['7.6', 'sample-ratio-mismatch', 'Sample ratio mismatch: when the split is broken'],
        ['7.7', 'bayesian-ab', 'The Bayesian view of an A/B test'],
        ['7.8', 'ab-pitfalls', 'Novelty effects, interference and when not to test'],
      ] },
      { n: 8, name: 'Relationships and business data', lessons: [
        ['8.1', 'correlation', 'Correlation: Pearson and Spearman'],
        ['8.2', 'regression-inference', 'Regression for explaining: coefficients, intervals and p-values'],
        ['8.3', 'simpsons-paradox', 'Confounding and Simpson\'s paradox'],
        ['8.4', 'time-series-basics', 'Time series: trend, seasonality and moving averages'],
        ['8.5', 'forecasting-basics', 'Simple forecasting and its uncertainty'],
        ['8.6', 'control-charts', 'Control charts: is this KPI drop real?'],
      ] },
      { n: 9, name: 'Capstone and interviews', lessons: [
        ['9.1', 'capstone-experiment-readout', 'Capstone: an experiment readout'],
        ['9.2', 'interview-questions', 'Statistics interview questions, answered'],
        ['9.3', 'which-test-when', 'Which test when: a one-page guide'],
      ] },
    ] },
  ],
};
