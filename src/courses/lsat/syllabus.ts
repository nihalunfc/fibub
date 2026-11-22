// LSAT prep (nihal, 2026-11-22): the current LSAT (from August 2024: two Logical Reasoning sections, one Reading
// Comprehension section, one unscored section, no Logic Games) and LSAT Argumentative Writing. Every argument,
// passage and question here is written for fibub: nothing is copied from LSAC, released PrepTests or prep books.
// Official details are checked against LSAC's public pages and dated in each lesson.
//
// How it works: the long-course engine (src/courses/types.ts) plus the lesson kit (`kit: true`): figures are JS
// modules in public/learn-kit/lsat/figs/<name>.js, and practice questions are the shared question bank format
// (public/qbank/lsat/, spec /mnt/project-files/qbank/spec.md). Checks: tests/exams.mjs.
// GMAT Critical Reasoning (src/courses/gmat) links to these argument lessons instead of repeating them.
import type { CourseSyllabus } from '../types';

export const LSAT: CourseSyllabus = {
  id: 'lsat',
  name: 'LSAT prep',
  title: 'LSAT prep: logical reasoning and reading, explained simply, with original practice',
  text: 'Free preparation for the LSAT: how arguments are built, every Logical Reasoning question type, conditional logic, Reading Comprehension passages and Argumentative Writing, with practice questions and full explanations, all original.',
  audience: 'For anyone applying to law school in the USA or Canada. No background in law or logic needed: every lesson starts from everyday reasoning.',
  updated: '2026-11-22',
  kit: true,
  extras: [
    { href: '/learn/courses/lsat/practice/', label: 'Practice questions, by question type' },
    { href: '/learn/courses/lsat/mock-test/', label: 'Timed Logical Reasoning section' },
  ],
  footnote: 'LSAT is a trademark of the Law School Admission Council (LSAC), which is not involved with and does not endorse fibub. Every argument, passage and question here is original. Test details were checked on LSAC\'s website on 22 November 2026; check the official source before test day.',
  parts: [
    { name: 'Part A: The LSAT', modules: [
      { n: 1, name: 'Know the test', lessons: [
        ['1.1', 'how-the-lsat-works', 'How the LSAT works: sections, timing and scoring'],
        ['1.2', 'lsat-study-plan', 'A study plan for the LSAT'],
      ] },
    ] },
    { name: 'Part B: Logical Reasoning', modules: [
      { n: 2, name: 'How arguments work', lessons: [
        ['2.1', 'argument-anatomy', 'Argument anatomy: premises, conclusions and background'],
        ['2.2', 'main-conclusion', 'Finding the main conclusion'],
        ['2.3', 'role-of-statement', 'The role a statement plays'],
        ['2.4', 'conditional-logic', 'Conditional logic: if, only if, unless'],
        ['2.5', 'quantifiers', 'Quantifiers: all, most, some, none'],
        ['2.6', 'common-flaws', 'The common flaws, one by one'],
      ] },
      { n: 3, name: 'The assumption family', lessons: [
        ['3.1', 'necessary-assumption', 'Necessary assumptions'],
        ['3.2', 'sufficient-assumption', 'Sufficient assumptions'],
        ['3.3', 'strengthen', 'Strengthen'],
        ['3.4', 'weaken', 'Weaken'],
        ['3.5', 'evaluate', 'Evaluate the argument'],
        ['3.6', 'principle', 'Principle questions'],
      ] },
      { n: 4, name: 'Describing arguments', lessons: [
        ['4.1', 'flaw', 'Flaw questions'],
        ['4.2', 'method-of-reasoning', 'Method of reasoning'],
        ['4.3', 'parallel-reasoning', 'Parallel reasoning and parallel flaw'],
        ['4.4', 'point-at-issue', 'Point at issue: where two speakers disagree'],
      ] },
      { n: 5, name: 'Drawing conclusions', lessons: [
        ['5.1', 'inference-must-be-true', 'Must be true'],
        ['5.2', 'most-strongly-supported', 'Most strongly supported'],
        ['5.3', 'paradox', 'Resolve the paradox'],
      ] },
    ] },
    { name: 'Part C: Reading Comprehension', modules: [
      { n: 6, name: 'Reading like a lawyer', lessons: [
        ['6.1', 'rc-passage-mapping', 'Mapping a passage as you read'],
        ['6.2', 'rc-main-point', 'Main point and primary purpose'],
        ['6.3', 'rc-author-attitude', 'Author\'s attitude and viewpoints'],
        ['6.4', 'rc-detail-inference', 'Detail and inference questions'],
        ['6.5', 'rc-structure-function', 'Structure and function questions'],
        ['6.6', 'rc-comparative', 'Comparative passages'],
      ] },
    ] },
    { name: 'Part D: Writing and practice', modules: [
      { n: 7, name: 'Finish strong', lessons: [
        ['7.1', 'lsat-argumentative-writing', 'LSAT Argumentative Writing'],
        ['7.2', 'lsat-timing', 'Timing and pacing'],
        ['7.3', 'lsat-practice-test-1', 'Full practice test 1'],
        ['7.4', 'lsat-practice-test-2', 'Full practice test 2'],
      ] },
    ] },
  ],
};

export const LSAT_BANK = { bank: 'lsat', exam: 'lsat', pattern: 'lsat-lr' };
