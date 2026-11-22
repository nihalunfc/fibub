// The SAT question bank (digital SAT, College Board format as of 2026; not affiliated). Every question is
// original and written for fibub. Shared qbank v1 format: /mnt/project-files/qbank/spec.md.
// Facets: section (math, rw) and domain (the four College Board content domains per section).
export default {
  id: 'sat', name: 'SAT (digital)',
  exams: { sat: 'SAT' },
  facets: {
    section: { label: 'Section', values: { math: 'Math', rw: 'Reading and Writing' } },
    domain: { label: 'Domain', values: { algebra: 'Algebra', advanced: 'Advanced math', data: 'Problem-solving and data analysis', geometry: 'Geometry and trigonometry', info: 'Information and ideas', craft: 'Craft and structure', expression: 'Expression of ideas', conventions: 'Standard English conventions' } },
  },
  units: [
    { id: 'algebra', name: 'Algebra', topics: [
      { id: 'linear-equations', name: 'Linear equations in one variable' },
      { id: 'linear-functions', name: 'Linear functions' },
      { id: 'systems-of-equations', name: 'Systems of linear equations' },
      { id: 'linear-inequalities', name: 'Linear inequalities' },
      { id: 'linear-models', name: 'Linear models' },
    ] },
    { id: 'advanced', name: 'Advanced math', topics: [
      { id: 'equivalent-expressions', name: 'Equivalent expressions' },
      { id: 'quadratics', name: 'Quadratics' },
      { id: 'functions', name: 'Functions' },
      { id: 'exponential-functions', name: 'Exponential functions' },
      { id: 'polynomials-rational', name: 'Polynomials and rational expressions' },
      { id: 'radicals-exponents', name: 'Exponents and radicals' },
      { id: 'nonlinear-systems', name: 'Nonlinear systems' },
    ] },
    { id: 'data', name: 'Problem-solving and data analysis', topics: [
      { id: 'ratios-rates-percent', name: 'Ratios, rates and percentages' },
      { id: 'units-conversion', name: 'Units and density' },
      { id: 'one-variable-data', name: 'Mean, median and spread' },
      { id: 'two-variable-data', name: 'Scatterplots and two-way tables' },
      { id: 'probability', name: 'Probability' },
      { id: 'sampling-inference', name: 'Sampling and inference' },
    ] },
    { id: 'geometry', name: 'Geometry and trigonometry', topics: [
      { id: 'area-volume', name: 'Area and volume' },
      { id: 'lines-angles-triangles', name: 'Lines, angles and triangles' },
      { id: 'right-triangle-trig', name: 'Right-triangle trigonometry' },
      { id: 'circles', name: 'Circles' },
    ] },
    { id: 'info', name: 'Information and ideas', topics: [
      { id: 'central-ideas', name: 'Central ideas and details' },
      { id: 'textual-evidence', name: 'Command of evidence: text' },
      { id: 'quantitative-evidence', name: 'Command of evidence: data' },
      { id: 'inferences', name: 'Inferences' },
    ] },
    { id: 'craft', name: 'Craft and structure', topics: [
      { id: 'words-in-context', name: 'Words in context' },
      { id: 'text-structure-purpose', name: 'Text structure and purpose' },
      { id: 'cross-text', name: 'Cross-text connections' },
    ] },
    { id: 'expression', name: 'Expression of ideas', topics: [
      { id: 'transitions', name: 'Transitions' },
      { id: 'rhetorical-synthesis', name: 'Rhetorical synthesis' },
    ] },
    { id: 'conventions', name: 'Standard English conventions', topics: [
      { id: 'sentence-boundaries', name: 'Sentence boundaries' },
      { id: 'punctuation', name: 'Punctuation' },
      { id: 'subject-verb-agreement', name: 'Subject-verb agreement' },
      { id: 'pronouns-modifiers', name: 'Pronouns and modifiers' },
      { id: 'verb-forms', name: 'Verb tense and form' },
    ] },
  ],
};
