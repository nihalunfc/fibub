// CELPIP preparation (nihal, 2026-11-22): CELPIP-General and CELPIP-General LS, for Canadian permanent residence
// and citizenship. Plan: /mnt/project-files/celpip-toefl-courses/plan.md. Everything here is original: no text,
// recordings or questions are copied from the official test or its practice material, and fibub is not part of
// Paragon Testing Enterprises (the test's owner).
//
// How it works: the long-course engine (src/courses/types.ts) plus the lesson kit (`kit: true`). The English figures
// (public/learn-kit/english/) are re-exported in public/learn-kit/celpip/figs/: drill (practice questions, with
// listening read aloud by the browser's own voices), speak (prep and speaking timer, optional recording kept on the
// device), write (timed writing pad with word count), score (CELPIP → CLB → Express Entry points), plan (study
// planner) and testmap. Practice sets are public/learn-kit/celpip/sets/<name>.js; tests/english.mjs checks them.
import type { CourseSyllabus } from '../types';

export const CELPIP: CourseSyllabus = {
  id: 'celpip',
  name: 'CELPIP preparation',
  title: 'CELPIP preparation: a complete free course for CELPIP-General and LS',
  text: 'Everything you need to reach your target CELPIP level for Canadian permanent residence or citizenship: every part of Listening, Reading, Writing and Speaking explained, with listening practice read aloud, timed writing and speaking practice, model answers, hundreds of original questions and a study plan.',
  audience: 'For anyone taking CELPIP-General (Express Entry and other immigration programmes) or CELPIP-General LS (citizenship). Written in plain English for learners at CLB 4 and up; no teacher needed.',
  updated: '2026-11-22',
  kit: true,
  footnote: 'fibub is an independent free site, not part of Paragon Testing Enterprises or CELPIP, and every question here is original. Test rules, times and immigration requirements change: check celpip.ca and canada.ca before you book. Practice runs in your browser; nothing you type or record is sent anywhere.',
  parts: [
    { name: 'Part A: Start here', modules: [
      { n: 1, name: 'Know the test', lessons: [
        ['1.1', 'what-is-celpip', 'What CELPIP is and who it is for'],
        ['1.2', 'test-format', 'The test, section by section'],
        ['1.3', 'scores-and-clb', 'CELPIP levels, CLB and Express Entry points'],
        ['1.4', 'test-day', 'Test day on the computer: what happens and how to prepare'],
        ['1.5', 'study-plan', 'Your study plan: from today to test day'],
        ['1.6', 'canadian-english', 'Everyday Canadian English: words, spelling and situations'],
      ] },
    ] },
    { name: 'Part B: Listening', modules: [
      { n: 2, name: 'Listening, part by part', lessons: [
        ['2.1', 'listening-strategies', 'How to listen in CELPIP: predict, note, decide'],
        ['2.2', 'listening-problem-solving', 'Listening Part 1: Problem Solving'],
        ['2.3', 'listening-daily-life', 'Listening Part 2: Daily Life Conversation'],
        ['2.4', 'listening-information', 'Listening Part 3: Listening for Information'],
        ['2.5', 'listening-news', 'Listening Part 4: News Item'],
        ['2.6', 'listening-discussion', 'Listening Part 5: Discussion'],
        ['2.7', 'listening-viewpoints', 'Listening Part 6: Viewpoints'],
        ['2.8', 'listening-traps', 'Listening traps and how to beat them'],
      ] },
    ] },
    { name: 'Part C: Reading', modules: [
      { n: 3, name: 'Reading, part by part', lessons: [
        ['3.1', 'reading-strategies', 'How to read in CELPIP: skim, scan, check'],
        ['3.2', 'reading-correspondence', 'Reading Part 1: Correspondence'],
        ['3.3', 'reading-diagram', 'Reading Part 2: Apply a Diagram'],
        ['3.4', 'reading-information', 'Reading Part 3: Reading for Information'],
        ['3.5', 'reading-viewpoints', 'Reading Part 4: Viewpoints'],
        ['3.6', 'vocabulary-in-context', 'Working out words from context'],
      ] },
    ] },
    { name: 'Part D: Writing', modules: [
      { n: 4, name: 'Writing tasks', lessons: [
        ['4.1', 'writing-rating', 'How CELPIP writing is rated'],
        ['4.2', 'writing-email', 'Writing Task 1: the email'],
        ['4.3', 'email-tone', 'Getting the tone right: formal, semi-formal, friendly'],
        ['4.4', 'writing-survey', 'Writing Task 2: responding to survey questions'],
        ['4.5', 'paragraphs-linking', 'Paragraphs and linking words that lift your score'],
        ['4.6', 'vocabulary-range', 'Vocabulary range: say it more precisely'],
        ['4.7', 'grammar-fixes', 'The grammar mistakes that cost the most'],
        ['4.8', 'writing-timing', 'Typing, timing and checking in 27 minutes'],
      ] },
    ] },
    { name: 'Part E: Speaking', modules: [
      { n: 5, name: 'The eight speaking tasks', lessons: [
        ['5.1', 'speaking-rating', 'How CELPIP speaking is rated'],
        ['5.2', 'speaking-advice', 'Speaking Task 1: Giving Advice'],
        ['5.3', 'speaking-experience', 'Speaking Task 2: Talking about a Personal Experience'],
        ['5.4', 'speaking-scene', 'Speaking Task 3: Describing a Scene'],
        ['5.5', 'speaking-predictions', 'Speaking Task 4: Making Predictions'],
        ['5.6', 'speaking-comparing', 'Speaking Task 5: Comparing and Persuading'],
        ['5.7', 'speaking-difficult', 'Speaking Task 6: Dealing with a Difficult Situation'],
        ['5.8', 'speaking-opinions', 'Speaking Task 7: Expressing Opinions'],
        ['5.9', 'speaking-unusual', 'Speaking Task 8: Describing an Unusual Situation'],
        ['5.10', 'fluency-pronunciation', 'Fluency and pronunciation without an accent coach'],
      ] },
    ] },
    { name: 'Part F: Final stretch', modules: [
      { n: 6, name: 'Mock tests and test week', lessons: [
        ['6.1', 'mock-tests', 'Taking a full mock test at home'],
        ['6.2', 'score-yourself', 'Scoring your own writing and speaking'],
        ['6.3', 'final-week', 'The final week and the night before'],
        ['6.4', 'after-the-test', 'Results, retakes and using your scores'],
      ] },
    ] },
  ],
};
