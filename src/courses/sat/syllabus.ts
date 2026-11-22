// Digital SAT prep (nihal, 2026-11-22): the whole test, Math and Reading and Writing, for students in the USA
// and anyone applying to US colleges. Every question here is written for fibub: nothing is copied from the
// College Board, Khan Academy or any prep book. Official details (timing, score ranges) are checked against the
// College Board's public pages and dated in each lesson.
//
// How it works: the long-course engine (src/courses/types.ts) plus the lesson kit (`kit: true`): figures are JS
// modules in public/learn-kit/sat/figs/<name>.js (one module can serve many lessons through data-* settings),
// live problems with fresh numbers are public/learn-kit/sat/problems.js, and the practice questions are the
// shared question bank format (public/qbank/sat/, spec /mnt/project-files/qbank/spec.md). Checks: tests/exams.mjs.
// GMAT and GRE (src/courses/gmat, src/courses/gre) link here for school-level maths basics.
import type { CourseSyllabus } from '../types';

export const SAT: CourseSyllabus = {
  id: 'sat',
  name: 'SAT prep',
  title: 'Digital SAT prep: every skill, explained simply, with thousands of practice questions',
  text: 'Free preparation for the digital SAT: how the adaptive test works, every Math skill from linear equations to circles, every Reading and Writing question type, and practice questions with full worked solutions, all original and written for fibub.',
  audience: 'For high school students taking the SAT (Grade 9 to 12) and anyone applying to US colleges. Start anywhere: each lesson begins from the basics.',
  updated: '2026-11-22',
  kit: true,
  extras: [
    { href: '/learn/courses/sat/practice/', label: 'Practice questions, by topic' },
    { href: '/learn/courses/sat/mock-test/', label: 'Timed Math practice test' },
  ],
  footnote: 'SAT is a trademark of the College Board, which is not involved with and does not endorse fibub. Every question here is original. Test details were checked on the College Board\'s website on 22 November 2026; check the official source before test day.',
  parts: [
    { name: 'Part A: The digital SAT', modules: [
      { n: 1, name: 'Know the test', lessons: [
        ['1.1', 'how-the-digital-sat-works', 'How the digital SAT works: sections, modules and timing'],
        ['1.2', 'sat-scoring', 'SAT scores: what 400 to 1600 means'],
        ['1.3', 'desmos-calculator', 'Using the built-in Desmos calculator well'],
        ['1.4', 'sat-study-plan', 'A study plan that works, and test-day tactics'],
      ] },
    ] },
    { name: 'Part B: Math', modules: [
      { n: 2, name: 'Algebra', lessons: [
        ['2.1', 'linear-equations', 'Linear equations in one variable'],
        ['2.2', 'linear-functions', 'Linear functions: slope, intercept and graphs'],
        ['2.3', 'systems-of-equations', 'Systems of two linear equations'],
        ['2.4', 'linear-inequalities', 'Linear inequalities'],
        ['2.5', 'linear-models', 'Turning word problems into linear models'],
      ] },
      { n: 3, name: 'Advanced math', lessons: [
        ['3.1', 'equivalent-expressions', 'Equivalent expressions: expand, factor, simplify'],
        ['3.2', 'quadratics', 'Quadratic equations and parabolas'],
        ['3.3', 'functions', 'Functions: notation, graphs and transformations'],
        ['3.4', 'exponential-functions', 'Exponential growth and decay'],
        ['3.5', 'polynomials-rational', 'Polynomials and rational expressions'],
        ['3.6', 'radicals-exponents', 'Exponents and radicals'],
        ['3.7', 'nonlinear-systems', 'Systems with a line and a curve'],
      ] },
      { n: 4, name: 'Problem-solving and data analysis', lessons: [
        ['4.1', 'ratios-rates-percent', 'Ratios, rates, proportions and percentages'],
        ['4.2', 'units-conversion', 'Units and conversions'],
        ['4.3', 'one-variable-data', 'One-variable data: mean, median, spread'],
        ['4.4', 'two-variable-data', 'Two-variable data: scatterplots and lines of best fit'],
        ['4.5', 'probability', 'Probability and two-way tables'],
        ['4.6', 'sampling-inference', 'Samples, margin of error and what you can conclude'],
      ] },
      { n: 5, name: 'Geometry and trigonometry', lessons: [
        ['5.1', 'area-volume', 'Area, perimeter and volume'],
        ['5.2', 'lines-angles-triangles', 'Lines, angles and triangles'],
        ['5.3', 'right-triangle-trig', 'Right triangles and trigonometry'],
        ['5.4', 'circles', 'Circles: arcs, sectors, radians and equations'],
      ] },
    ] },
    { name: 'Part C: Reading and Writing', modules: [
      { n: 6, name: 'Information and ideas', lessons: [
        ['6.1', 'central-ideas', 'Central ideas and details'],
        ['6.2', 'textual-evidence', 'Command of evidence: quotations'],
        ['6.3', 'quantitative-evidence', 'Command of evidence: tables and graphs'],
        ['6.4', 'inferences', 'Inferences: finishing the thought'],
      ] },
      { n: 7, name: 'Craft and structure', lessons: [
        ['7.1', 'words-in-context', 'Words in context'],
        ['7.2', 'text-structure-purpose', 'Text structure and purpose'],
        ['7.3', 'cross-text', 'Cross-text connections'],
      ] },
      { n: 8, name: 'Expression of ideas', lessons: [
        ['8.1', 'transitions', 'Transitions'],
        ['8.2', 'rhetorical-synthesis', 'Rhetorical synthesis: using notes for a goal'],
      ] },
      { n: 9, name: 'Standard English conventions', lessons: [
        ['9.1', 'sentence-boundaries', 'Sentence boundaries: periods, commas, semicolons'],
        ['9.2', 'punctuation', 'Colons, dashes, apostrophes and extra commas'],
        ['9.3', 'subject-verb-agreement', 'Subject-verb agreement'],
        ['9.4', 'pronouns-modifiers', 'Pronouns and modifiers'],
        ['9.5', 'verb-forms', 'Verb tense and form'],
      ] },
    ] },
    { name: 'Part D: Practice tests', modules: [
      { n: 10, name: 'Full practice', lessons: [
        ['10.1', 'sat-practice-test-1', 'Full practice test 1 (adaptive)'],
        ['10.2', 'sat-practice-test-2', 'Full practice test 2 (adaptive)'],
        ['10.3', 'sat-mistake-review', 'Reviewing mistakes to raise your score'],
      ] },
    ] },
  ],
};

/** The SAT question bank (public/qbank/sat/) as used by the practice and mock-test pages. */
export const SAT_BANK = { bank: 'sat', exam: 'sat', pattern: 'sat-math' };
