// Bank: GRE-only quantitative questions (Quantitative Comparison, answer formats, geometry). The shared arithmetic,
// algebra and statistics questions are in grad-quant. Spec: /mnt/project-files/qbank/spec.md.
export default {
  id: 'gre-quant', name: 'GRE quantitative reasoning',
  exams: { gre: 'GRE' },
  units: [
    { id: 'formats', name: 'GRE question formats', topics: [ { id: 'qc', name: 'Quantitative Comparison' }, { id: 'formats', name: 'Numeric Entry and select-all' } ] },
    { id: 'geometry', name: 'Geometry', topics: [ { id: 'geometry', name: 'Angles, triangles, circles, coordinates and solids' } ] },
    { id: 'data', name: 'Data analysis', topics: [ { id: 'data', name: 'Quartiles and the normal curve' } ] },
  ],
};
