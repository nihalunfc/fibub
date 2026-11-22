// English question bank (fibub, original practice material; nothing is copied from official tests).
// Shared vocabulary and grammar for the IELTS, CELPIP and TOEFL courses and their practice rooms.
// Every item is tagged for all three exams. Levels: 1 ≈ CLB 5 / band 5, 2 ≈ CLB 6-7 / band 6, 3 ≈ CLB 8 / band 7,
// 4 ≈ CLB 9 / band 8, 5 ≈ CLB 10+ / band 8.5+. Spelling: neutral, US where a choice is needed.
// Format: /mnt/project-files/qbank/spec.md. Topic id = file name.
export default {
  id: 'english', name: 'English vocabulary and grammar',
  exams: { ielts: 'IELTS', celpip: 'CELPIP', toefl: 'TOEFL' },
  facets: {
    skill: { label: 'Area', values: { vocabulary: 'Vocabulary', grammar: 'Grammar' } },
  },
  units: [
    { id: 'vocabulary', name: 'Vocabulary', topics: [
      // Word skills
      { id: 'word-families', name: 'Word families and word forms' },
      { id: 'collocations', name: 'Collocations: words that go together' },
      { id: 'spelling', name: 'Spelling' },
      { id: 'academic-words', name: 'Academic words' },
      { id: 'paraphrase', name: 'Paraphrase: same meaning, other words' },
      { id: 'phrasal-verbs', name: 'Phrasal verbs' },
      { id: 'confusing-words', name: 'Commonly confused words' },
      { id: 'prefixes-suffixes', name: 'Prefixes and suffixes' },
      // Words by theme
      { id: 'theme-work', name: 'Theme: work and jobs' },
      { id: 'theme-housing', name: 'Theme: housing and home' },
      { id: 'theme-health', name: 'Theme: health' },
      { id: 'theme-money', name: 'Theme: money and shopping' },
      { id: 'theme-transport', name: 'Theme: transport' },
      { id: 'theme-environment', name: 'Theme: the environment' },
      { id: 'theme-education', name: 'Theme: education' },
      { id: 'theme-technology', name: 'Theme: technology' },
      { id: 'theme-community', name: 'Theme: community and society' },
      { id: 'theme-travel', name: 'Theme: travel' },
      { id: 'theme-food', name: 'Theme: food' },
      { id: 'theme-science', name: 'Theme: science' },
    ] },
    { id: 'grammar', name: 'Grammar', topics: [
      { id: 'tenses', name: 'Tenses' },
      { id: 'complex-sentences', name: 'Complex sentences: relative and subordinate clauses' },
      { id: 'conditionals', name: 'Conditionals' },
      { id: 'passive', name: 'The passive' },
      { id: 'articles', name: 'Articles: a, an, the and none' },
      { id: 'punctuation', name: 'Punctuation' },
      { id: 'agreement', name: 'Subject-verb agreement and countable nouns' },
      { id: 'prepositions', name: 'Prepositions' },
      { id: 'common-errors', name: 'Common errors: find and fix' },
    ] },
  ],
};
