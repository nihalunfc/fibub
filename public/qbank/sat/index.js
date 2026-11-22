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
  ],
};
