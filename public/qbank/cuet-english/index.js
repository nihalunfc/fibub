// CUET (UG) English (Section IA language test). Original passages and questions written for fibub
// (never copied from past papers or books). Used by /learn/courses/cuet/.
export default {
  id: 'cuet-english', name: 'CUET English',
  exams: { cuet: 'CUET (UG)' },
  units: [
    { id: 'reading', name: 'Reading comprehension', topics: [
      { id: 'reading-comprehension', name: 'Factual, narrative and literary passages' },
    ] },
    { id: 'vocabulary', name: 'Vocabulary', topics: [
      { id: 'synonyms-antonyms', name: 'Synonyms and antonyms' },
      { id: 'idioms-one-word', name: 'Idioms, phrases and one-word substitution' },
    ] },
    { id: 'verbal', name: 'Verbal ability and grammar', topics: [
      { id: 'error-spotting', name: 'Spotting errors and sentence correction' },
      { id: 'sentence-rearrangement', name: 'Rearranging sentences and parts' },
      { id: 'fill-in-blanks', name: 'Fill in the blanks and cloze passages' },
    ] },
  ],
};
