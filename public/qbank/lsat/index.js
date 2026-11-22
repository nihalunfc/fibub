// The LSAT question bank (current LSAT format, from August 2024; not affiliated with LSAC). Every argument,
// passage and question is original and written for fibub. Shared qbank v1 format: /mnt/project-files/qbank/spec.md.
export default {
  id: 'lsat', name: 'LSAT',
  exams: { lsat: 'LSAT' },
  facets: {
    section: { label: 'Section', values: { lr: 'Logical Reasoning', rc: 'Reading Comprehension', writing: 'Argumentative Writing' } },
    qtype: { label: 'Question type', values: { 'must-be-true': 'Must be true', conditional: 'Conditional logic', 'main-point': 'Main point', role: 'Role', 'necessary-assumption': 'Necessary assumption', 'sufficient-assumption': 'Sufficient assumption', strengthen: 'Strengthen', weaken: 'Weaken', evaluate: 'Evaluate', principle: 'Principle', flaw: 'Flaw', method: 'Method of reasoning', parallel: 'Parallel reasoning', 'point-at-issue': 'Point at issue', mss: 'Most strongly supported', paradox: 'Paradox', rc: 'Reading Comprehension', writing: 'Argumentative Writing' } },
  },
  units: [
    { id: 'logic', name: 'Logic drills', topics: [
      { id: 'conditional-logic', name: 'Conditional logic' },
      { id: 'quantifiers', name: 'Quantifiers' },
    ] },
    { id: 'structure', name: 'Argument structure', topics: [
      { id: 'main-conclusion', name: 'Main point' },
      { id: 'role-of-statement', name: 'Role of a statement' },
    ] },
    { id: 'assumption-family', name: 'Assumption family', topics: [
      { id: 'necessary-assumption', name: 'Necessary assumption' },
      { id: 'sufficient-assumption', name: 'Sufficient assumption' },
      { id: 'strengthen', name: 'Strengthen' },
      { id: 'weaken', name: 'Weaken' },
      { id: 'evaluate', name: 'Evaluate' },
      { id: 'principle', name: 'Principle' },
    ] },
    { id: 'describe', name: 'Describe the reasoning', topics: [
      { id: 'flaw', name: 'Flaw' },
      { id: 'method-of-reasoning', name: 'Method of reasoning' },
      { id: 'parallel-reasoning', name: 'Parallel reasoning' },
      { id: 'point-at-issue', name: 'Point at issue' },
    ] },
    { id: 'inference', name: 'Inference and paradox', topics: [
      { id: 'inference-must-be-true', name: 'Must be true' },
      { id: 'most-strongly-supported', name: 'Most strongly supported' },
      { id: 'paradox', name: 'Paradox' },
    ] },
    { id: 'reading', name: 'Reading Comprehension', topics: [
      { id: 'rc-main-point', name: 'Main point and organisation' },
      { id: 'rc-author-attitude', name: 'Author\'s attitude' },
      { id: 'rc-detail-inference', name: 'Detail and inference' },
      { id: 'rc-structure-function', name: 'Structure and function' },
      { id: 'rc-comparative', name: 'Comparative passages' },
    ] },
    { id: 'writing', name: 'Argumentative Writing', topics: [
      { id: 'argumentative-writing', name: 'Practice prompts' },
    ] },
  ],
};
