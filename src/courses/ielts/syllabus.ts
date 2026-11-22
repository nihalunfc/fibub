// IELTS preparation (nihal, 2026-11-22): a very detailed free course for IELTS Academic and General Training,
// with a large bank of original practice items across Listening, Reading, Writing and Speaking.
// Plan: /mnt/project-files/ielts-course/plan.md. Same engine as the other long text courses (src/courses/types.ts):
// a lesson goes live when src/courses/ielts/<slug>.md exists. Uses the rich lesson kit (public/learn-kit/,
// `kit: true`): step players, live problems, key points and the summary sheet. Practice items and the listening
// player live in public/learn-kit/ielts/ (bank/*.json, practice.js); the practice room is /learn/courses/ielts/practice/.
// All content is original: never copy Cambridge, IDP or British Council test material or band descriptor wording.
import type { CourseSyllabus } from '../types';

export const IELTS: CourseSyllabus = {
  id: 'ielts',
  name: 'IELTS preparation',
  title: 'IELTS preparation: Academic and General Training, band 5 to band 8+',
  text: 'A free, very detailed IELTS course for Academic and General Training: how each paper works, every question type with a method that works, model answers, and a practice room with thousands of original questions, listening you can play in the browser, and writing and speaking tasks with timers.',
  audience: 'For anyone taking IELTS for study, work or migration (Canada, the UK, Australia, New Zealand, the USA and more). Written in plain English for learners at about band 5 and up.',
  updated: '2026-11-22',
  footnote: 'fibub is an independent free site, not part of IELTS, the British Council, IDP or Cambridge University Press & Assessment, and uses no official test material. All questions are original practice. Test rules, fees and score requirements change: check ielts.org and the organisation you are applying to.',
  kit: true,
  parts: [
    { name: 'Part A: Know the test', modules: [
      { n: 1, name: 'Start here', lessons: [
        ['1.1', 'what-is-ielts', 'What IELTS is: Academic, General Training and UKVI'],
        ['1.2', 'test-format', 'The four papers, minute by minute'],
        ['1.3', 'band-scores', 'Band scores: how your marks become a band'],
        ['1.4', 'target-band', 'What band you need for study, work and migration'],
        ['1.5', 'study-plan', 'A study plan that fits your weeks'],
        ['1.6', 'computer-or-paper', 'Computer or paper, and booking the test'],
      ] },
    ] },
    { name: 'Part B: Listening', modules: [
      { n: 2, name: 'Listening', lessons: [
        ['2.1', 'listening-overview', 'How the Listening test works'],
        ['2.2', 'predict-the-answer', 'Predicting the answer before you hear it'],
        ['2.3', 'spelling-and-numbers', 'Names, spellings, numbers and dates'],
        ['2.4', 'form-note-completion', 'Form, note and table completion'],
        ['2.5', 'listening-multiple-choice', 'Multiple choice without falling for the traps'],
        ['2.6', 'maps-and-plans', 'Maps and plans'],
        ['2.7', 'listening-matching', 'Matching in Listening'],
        ['2.8', 'lecture-section-4', 'Part 4: following a lecture'],
        ['2.9', 'accents', 'Accents: British, Australian, North American and more'],
        ['2.10', 'listening-mistakes', 'Ten mistakes that cost Listening marks'],
      ] },
    ] },
    { name: 'Part C: Reading', modules: [
      { n: 3, name: 'Reading strategy', lessons: [
        ['3.1', 'reading-overview', 'How the Reading test works'],
        ['3.2', 'skim-and-scan', 'Skimming and scanning'],
        ['3.3', 'spot-the-paraphrase', 'Spotting the paraphrase'],
        ['3.4', 'reading-time-plan', 'A 60-minute plan for three passages'],
      ] },
      { n: 4, name: 'Reading question types', lessons: [
        ['4.1', 'true-false-not-given', 'True, False or Not Given'],
        ['4.2', 'yes-no-not-given', 'Yes, No or Not Given'],
        ['4.3', 'matching-headings', 'Matching headings'],
        ['4.4', 'matching-information', 'Which paragraph contains the information?'],
        ['4.5', 'matching-features', 'Matching features and people'],
        ['4.6', 'sentence-endings', 'Matching sentence endings'],
        ['4.7', 'reading-completion', 'Summary, note, table and flow-chart completion'],
        ['4.8', 'reading-multiple-choice', 'Multiple choice in Reading'],
        ['4.9', 'short-answers-diagrams', 'Short answers and diagram labels'],
        ['4.10', 'general-training-reading', 'General Training Reading: notices, workplace texts and the long passage'],
      ] },
    ] },
    { name: 'Part D: Writing', modules: [
      { n: 5, name: 'Academic Writing Task 1', lessons: [
        ['5.1', 'task1-academic-overview', 'What Task 1 asks, and how it is marked'],
        ['5.2', 'task1-overview-sentence', 'The overview: the sentence that decides your band'],
        ['5.3', 'line-graphs', 'Line graphs and the language of change'],
        ['5.4', 'bar-charts-tables', 'Bar charts and tables: comparing'],
        ['5.5', 'pie-charts', 'Pie charts and proportions'],
        ['5.6', 'process-diagrams', 'Process diagrams'],
        ['5.7', 'task1-maps', 'Maps: how a place changed'],
        ['5.8', 'mixed-charts', 'Two charts together'],
      ] },
      { n: 6, name: 'General Training Writing Task 1: letters', lessons: [
        ['6.1', 'letter-tone', 'Formal, semi-formal or informal: choosing the tone'],
        ['6.2', 'complaint-letters', 'Complaint letters'],
        ['6.3', 'request-letters', 'Requests, applications and enquiries'],
        ['6.4', 'informal-letters', 'Letters to friends'],
        ['6.5', 'letter-phrase-bank', 'Openings, closings and useful phrases'],
      ] },
      { n: 7, name: 'Writing Task 2: the essay', lessons: [
        ['7.1', 'task2-overview', 'What Task 2 asks, and the four marking areas'],
        ['7.2', 'essay-question-types', 'The five essay types and how to answer each'],
        ['7.3', 'plan-in-five-minutes', 'Planning in five minutes'],
        ['7.4', 'essay-introductions', 'Introductions that answer the question'],
        ['7.5', 'body-paragraphs', 'Body paragraphs: point, explain, example'],
        ['7.6', 'essay-conclusions', 'Conclusions'],
        ['7.7', 'coherence-cohesion', 'Coherence and cohesion without overusing linking words'],
        ['7.8', 'lexical-resource', 'Vocabulary for a higher band'],
        ['7.9', 'grammar-range-accuracy', 'Grammar range and accuracy'],
        ['7.10', 'model-essays', 'Model essays at band 6, 7 and 8, compared'],
      ] },
    ] },
    { name: 'Part E: Speaking', modules: [
      { n: 8, name: 'Speaking', lessons: [
        ['8.1', 'speaking-overview', 'How the Speaking test works'],
        ['8.2', 'speaking-part-1', 'Part 1: questions about you'],
        ['8.3', 'speaking-part-2', 'Part 2: the long turn with a cue card'],
        ['8.4', 'speaking-part-3', 'Part 3: discussion and opinions'],
        ['8.5', 'fluency', 'Fluency: keep talking without filler'],
        ['8.6', 'pronunciation', 'Pronunciation: stress, rhythm and clear sounds'],
        ['8.7', 'speaking-vocabulary', 'Vocabulary and idioms that sound natural'],
        ['8.8', 'speaking-mistakes', 'Mistakes that lower a Speaking band'],
      ] },
    ] },
    { name: 'Part F: Language toolkit', modules: [
      { n: 9, name: 'Grammar for band 7', lessons: [
        ['9.1', 'tenses', 'Tenses you actually need'],
        ['9.2', 'complex-sentences', 'Complex sentences: relative and subordinate clauses'],
        ['9.3', 'conditionals', 'Conditionals'],
        ['9.4', 'passive-voice', 'The passive, and when to use it'],
        ['9.5', 'articles', 'Articles: a, an, the and none'],
        ['9.6', 'punctuation', 'Punctuation that examiners notice'],
        ['9.7', 'common-errors', 'The 30 most common grammar errors'],
      ] },
      { n: 10, name: 'Vocabulary', lessons: [
        ['10.1', 'word-families', 'Word families: one root, four jobs'],
        ['10.2', 'collocations', 'Collocations: words that go together'],
        ['10.3', 'topic-vocabulary', 'Topic vocabulary for 20 common themes'],
        ['10.4', 'spelling-rules', 'Spelling: the rules and the usual traps'],
        ['10.5', 'paraphrase-toolkit', 'The paraphrase toolkit'],
      ] },
    ] },
    { name: 'Part G: Test ready', modules: [
      { n: 11, name: 'Mock tests and test day', lessons: [
        ['11.1', 'mock-tests', 'How to take a full mock test, and learn from it'],
        ['11.2', 'test-day', 'Test day, step by step'],
        ['11.3', 'results-and-retakes', 'Results, re-marks and One Skill Retake'],
        ['11.4', 'last-two-weeks', 'The last two weeks'],
      ] },
    ] },
  ],
};
