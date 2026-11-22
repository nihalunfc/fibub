// GRE prep (nihal, 2026-11-22): the GRE General Test (the shorter format used since September 2023: Analytical
// Writing with one Issue task, two Verbal and two Quantitative sections) taught from zero, so a student can prepare
// alone. Plan: /mnt/project-files/gmat-gre-courses/plan.md. Every question is original: nothing is copied from ETS.
//
// The shared maths theory lives in the GMAT course (lessons link there); this course teaches what is GRE-only:
// Quantitative Comparison, the answer formats, geometry, data interpretation, Text Completion, Sentence
// Equivalence and the Issue essay. Figures: public/learn-kit/gre/figs/ (some re-export GMAT figures). Questions:
// public/qbank/gre-quant/, public/qbank/gre-verbal/, plus grad-quant and grad-verbal shared with GMAT.
// Checks: tests/gmat.mjs (covers both courses).
import type { CourseSyllabus } from '../types';

export const GRE: CourseSyllabus = {
  id: 'gre',
  name: 'GRE prep',
  title: 'GRE prep from zero: Quant, Verbal and the Issue essay',
  text: 'Everything on the GRE General Test, taught from the basics so you can prepare alone: Quantitative Comparison, every answer format, geometry and data interpretation, Text Completion, Sentence Equivalence, reading, and the Issue essay, with worked examples you can step through, fresh practice questions every visit and timed practice sections.',
  audience: 'For anyone applying to graduate school. School maths and everyday English are enough to start: every method is built step by step, and every question has a full worked solution.',
  updated: '2026-11-22',
  footnote: 'Independent free course, not part of or endorsed by ETS. GRE is a trademark of ETS. Every question here is original. Test rules change: check ets.org/gre before you book.',
  kit: true,
  parts: [
    { name: 'Part A: Start here', modules: [
      { n: 1, name: 'The exam and your plan', lessons: [
        ['1.1', 'what-is-the-gre', 'What the GRE is and how it is built'],
        ['1.2', 'gre-scores', 'How GRE scoring works'],
        ['1.3', 'gre-study-plan', 'Your study plan: 6, 10 or 14 weeks'],
      ] },
    ] },
    { name: 'Part B: Quantitative Reasoning', modules: [
      { n: 2, name: 'GRE question formats', lessons: [
        ['2.1', 'quantitative-comparison', 'Quantitative Comparison: the four answers'],
        ['2.2', 'qc-strategies', 'Quantitative Comparison strategies: simplify, plug in, compare'],
        ['2.3', 'numeric-entry-multiple-answer', 'Numeric Entry and select-all questions'],
        ['2.4', 'gre-calculator', 'The on-screen calculator: when it helps'],
      ] },
      { n: 3, name: 'Arithmetic and algebra (with the GMAT lessons)', lessons: [
        ['3.1', 'gre-arithmetic', 'Arithmetic for the GRE: a guided route through the shared lessons'],
        ['3.2', 'gre-algebra', 'Algebra for the GRE: a guided route through the shared lessons'],
      ] },
      { n: 4, name: 'Geometry', lessons: [
        ['4.1', 'lines-angles', 'Lines, angles and parallel lines'],
        ['4.2', 'triangles', 'Triangles: angles, Pythagoras and special triangles'],
        ['4.3', 'polygons-circles', 'Quadrilaterals, polygons and circles'],
        ['4.4', 'coordinate-geometry', 'Coordinate geometry: lines, slopes and graphs'],
        ['4.5', 'solids', 'Boxes, cylinders and other solids'],
      ] },
      { n: 5, name: 'Data analysis', lessons: [
        ['5.1', 'data-interpretation', 'Data interpretation sets: reading tables and charts'],
        ['5.2', 'distributions', 'Distributions: quartiles, box plots and the normal curve'],
        ['5.3', 'gre-counting-probability', 'Counting and probability for the GRE'],
        ['5.4', 'gre-quant-review', 'Quant review: a mixed timed set'],
      ] },
    ] },
    { name: 'Part C: Verbal Reasoning', modules: [
      { n: 6, name: 'Text Completion and Sentence Equivalence', lessons: [
        ['6.1', 'text-completion', 'Text Completion: find the clue, predict the word'],
        ['6.2', 'multi-blank-completion', 'Two- and three-blank completions'],
        ['6.3', 'sentence-equivalence', 'Sentence Equivalence: two words, one meaning'],
        ['6.4', 'vocabulary', 'Building vocabulary that sticks: roots, families and context'],
      ] },
      { n: 7, name: 'Reading', lessons: [
        ['7.1', 'gre-reading', 'GRE reading: short, long and argument passages'],
        ['7.2', 'gre-reading-questions', 'Select-all and select-in-passage questions'],
        ['7.3', 'gre-arguments', 'Argument passages: assumptions, strengthen and weaken'],
      ] },
    ] },
    { name: 'Part D: Analytical Writing', modules: [
      { n: 8, name: 'The Issue essay', lessons: [
        ['8.1', 'issue-task', 'The Issue task: what the readers score'],
        ['8.2', 'issue-plan', 'Plan in five minutes: position, reasons, examples'],
        ['8.3', 'issue-writing', 'Write it: structure, clear sentences, and checking'],
      ] },
    ] },
    { name: 'Part E: Test day', modules: [
      { n: 9, name: 'Put it together', lessons: [
        ['9.1', 'gre-pacing', 'Pacing, guessing and the section-adaptive test'],
        ['9.2', 'gre-practice-test', 'Practice test: Quant and Verbal sections'],
        ['9.3', 'gre-after-the-test', 'After the test: an error log and a plan'],
      ] },
    ] },
  ],
};
