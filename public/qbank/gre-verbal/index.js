// Bank: GRE-only verbal questions (Text Completion and Sentence Equivalence). Reading and argument questions are in
// grad-verbal, shared with the GMAT course. Spec: /mnt/project-files/qbank/spec.md. Every sentence is original.
export default {
  id: 'gre-verbal', name: 'GRE verbal reasoning',
  exams: { gre: 'GRE' },
  units: [
    { id: 'completion', name: 'Text Completion and Sentence Equivalence', topics: [
      { id: 'text-completion', name: 'Text Completion' }, { id: 'sentence-equivalence', name: 'Sentence Equivalence' } ] },
  ],
};
