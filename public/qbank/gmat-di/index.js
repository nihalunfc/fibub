// Bank: GMAT Data Insights. Spec: /mnt/project-files/qbank/spec.md. All data is made up for practice.
export default {
  id: 'gmat-di', name: 'GMAT Data Insights',
  exams: { gmat: 'GMAT' },
  units: [
    { id: 'ds', name: 'Data Sufficiency', topics: [
      { id: 'ds-numbers', name: 'Number properties' }, { id: 'ds-algebra', name: 'Algebra' }, { id: 'ds-word', name: 'Word problems' } ] },
    { id: 'di', name: 'Tables, graphs and two-part questions', topics: [
      { id: 'tables', name: 'Table Analysis' }, { id: 'graphs', name: 'Graphics Interpretation' }, { id: 'two-part', name: 'Two-Part Analysis' }, { id: 'msr', name: 'Multi-Source Reasoning' } ] },
  ],
};
