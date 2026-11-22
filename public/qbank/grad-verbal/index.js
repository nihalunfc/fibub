// Bank: graduate admissions verbal reasoning, shared by the GMAT and GRE courses. Spec: /mnt/project-files/qbank/spec.md.
// Every argument and passage is original, written for fibub.
export default {
  id: 'grad-verbal', name: 'GMAT and GRE verbal reasoning',
  exams: { gmat: 'GMAT', gre: 'GRE' },
  units: [
    { id: 'cr', name: 'Critical Reasoning', topics: [
      { id: 'cr-assumption', name: 'Assumptions' }, { id: 'cr-strengthen-weaken', name: 'Strengthen and weaken' }, { id: 'cr-evaluate-flaw', name: 'Evaluate and flaw' },
      { id: 'cr-inference', name: 'Inference' }, { id: 'cr-boldface-paradox', name: 'Boldface and paradox' } ] },
    { id: 'rc', name: 'Reading Comprehension', topics: [ { id: 'rc-passages', name: 'Reading passages' } ] },
  ],
};
