// The LSAT question bank (current LSAT format, from August 2024; not affiliated with LSAC). Every argument,
// passage and question is original and written for fibub. Shared qbank v1 format: /mnt/project-files/qbank/spec.md.
export default {
  id: 'lsat', name: 'LSAT',
  exams: { lsat: 'LSAT' },
  facets: {
    section: { label: 'Section', values: { lr: 'Logical Reasoning', rc: 'Reading Comprehension' } },
  },
  units: [],
};
