// IELTS question bank (fibub, original practice material; nothing is copied from official tests).
// Used by the IELTS course (/learn/courses/ielts/) and its practice room. Shared grammar and vocabulary items
// live in the `english` bank. Levels: 1 ≈ band 5, 2 ≈ band 6, 3 ≈ band 7, 4 ≈ band 8, 5 ≈ band 9.
export default {
  id: 'ielts', name: 'IELTS practice',
  exams: { academic: 'IELTS Academic', general: 'IELTS General Training' },
  facets: {
    skill: { label: 'Skill', values: { listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking' } },
    part: { label: 'Part', values: { 1: 'Part 1', 2: 'Part 2', 3: 'Part 3', 4: 'Part 4' } },
    qtype: { label: 'Question type', values: {
      form: 'Form, note and table completion', mcq: 'Multiple choice', map: 'Maps and plans', matching: 'Matching',
      sentence: 'Sentence completion', short: 'Short answers', spelling: 'Spellings and numbers',
      tfng: 'True / False / Not Given', ynng: 'Yes / No / Not Given', headings: 'Matching headings', summary: 'Summary and note completion',
    } },
  },
  units: [
    { id: 'listening', name: 'Listening', topics: [
      { id: 'listening-part1', name: 'Part 1: everyday conversations' },
      { id: 'listening-part2', name: 'Part 2: everyday talks' },
      { id: 'listening-part3', name: 'Part 3: study discussions' },
      { id: 'listening-part4', name: 'Part 4: lectures' },
      { id: 'listening-spelling', name: 'Names, spellings and numbers (endless)' },
    ] },
    { id: 'reading', name: 'Reading', topics: [
      { id: 'reading-academic', name: 'Academic passages' },
    ] },
  ],
};
