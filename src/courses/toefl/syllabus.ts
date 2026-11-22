// TOEFL iBT preparation (nihal, 2026-11-22): the TOEFL iBT as given from 21 January 2026 (shorter, adaptive,
// scored 1 to 6). Plan: /mnt/project-files/celpip-toefl-courses/plan.md. Everything here is original: no text,
// recordings or questions are copied from ETS material, and fibub is not part of ETS.
// Same engine and English figures as the CELPIP course (see src/courses/celpip/syllabus.ts); practice sets are
// public/learn-kit/toefl/sets/<name>.js, checked by tests/english.mjs.
import type { CourseSyllabus } from '../types';

export const TOEFL: CourseSyllabus = {
  id: 'toefl',
  name: 'TOEFL preparation',
  title: 'TOEFL iBT preparation: a complete free course for the 2026 test',
  text: 'A full course for the new TOEFL iBT: every task in Reading, Listening, Writing and Speaking explained, with listening practice read aloud, word-building drills for Complete the Words, sentence builders, timed writing and speaking practice, model answers, hundreds of original questions and a study plan.',
  audience: 'For students applying to universities in the USA, Canada and elsewhere, and anyone who needs a TOEFL score. Written in plain English for learners from about CEFR B1 up; no teacher needed.',
  updated: '2026-11-22',
  kit: true,
  footnote: 'fibub is an independent free site, not part of ETS or TOEFL, and every question here is original. The test format and score rules change: check ets.org/toefl and each university\'s own requirements. Practice runs in your browser; nothing you type or record is sent anywhere.',
  parts: [
    { name: 'Part A: Start here', modules: [
      { n: 1, name: 'Know the test', lessons: [
        ['1.1', 'what-is-toefl', 'What the TOEFL iBT is and who it is for'],
        ['1.2', 'test-format', 'The 2026 test, section by section'],
        ['1.3', 'scores-and-bands', 'Scores: the 1 to 6 bands, CEFR and the old 0 to 120'],
        ['1.4', 'adaptive-test', 'How the adaptive test works and what it means for you'],
        ['1.5', 'test-day', 'Test centre or Home Edition: test day step by step'],
        ['1.6', 'study-plan', 'Your study plan: from today to test day'],
      ] },
    ] },
    { name: 'Part B: Reading', modules: [
      { n: 2, name: 'Reading tasks', lessons: [
        ['2.1', 'complete-the-words', 'Complete the Words: fill the missing letters'],
        ['2.2', 'word-building', 'Word building: prefixes, suffixes and spelling patterns'],
        ['2.3', 'read-daily-life', 'Read in Daily Life: notices, emails and schedules'],
        ['2.4', 'academic-passage', 'Read an Academic Passage'],
        ['2.5', 'reading-question-types', 'Reading questions: detail, inference, vocabulary and purpose'],
        ['2.6', 'reading-speed', 'Reading faster without missing the point'],
      ] },
    ] },
    { name: 'Part C: Listening', modules: [
      { n: 3, name: 'Listening tasks', lessons: [
        ['3.1', 'listening-skills', 'How to listen for the TOEFL'],
        ['3.2', 'choose-a-response', 'Listen and Choose a Response'],
        ['3.3', 'listen-conversation', 'Listen to a Conversation'],
        ['3.4', 'listen-announcement', 'Listen to an Announcement'],
        ['3.5', 'academic-talk', 'Listen to an Academic Talk'],
        ['3.6', 'note-taking', 'Note-taking that actually helps'],
      ] },
    ] },
    { name: 'Part D: Writing', modules: [
      { n: 4, name: 'Writing tasks', lessons: [
        ['4.1', 'build-a-sentence', 'Build a Sentence: word order that works'],
        ['4.2', 'question-word-order', 'Questions, indirect questions and other word-order traps'],
        ['4.3', 'write-an-email', 'Write an Email'],
        ['4.4', 'academic-discussion', 'Write for an Academic Discussion'],
        ['4.5', 'writing-scoring', 'How TOEFL writing is scored'],
        ['4.6', 'grammar-fixes', 'The grammar mistakes that cost the most'],
      ] },
    ] },
    { name: 'Part E: Speaking', modules: [
      { n: 5, name: 'Speaking tasks', lessons: [
        ['5.1', 'listen-and-repeat', 'Listen and Repeat'],
        ['5.2', 'pronunciation', 'Stress, rhythm and linking: sounding clear'],
        ['5.3', 'take-an-interview', 'Take an Interview'],
        ['5.4', 'answer-structure', 'Structuring a spoken answer in seconds'],
        ['5.5', 'speaking-scoring', 'How TOEFL speaking is scored'],
      ] },
    ] },
    { name: 'Part F: Final stretch', modules: [
      { n: 6, name: 'Mock tests and test week', lessons: [
        ['6.1', 'mock-tests', 'Taking a full mock test at home'],
        ['6.2', 'final-week', 'The final week and the night before'],
        ['6.3', 'sending-scores', 'Scores, retakes and sending them to universities'],
      ] },
    ] },
  ],
};
