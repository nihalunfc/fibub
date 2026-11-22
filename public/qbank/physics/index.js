// Physics question bank for university-level exams: IIT JAM, GATE and CSIR NET (courses iit-jam-physics,
// gate-physics, csir-net-physics). Every question is original, written for fibub from the published syllabi;
// none is copied from a past paper. Format: /mnt/project-files/qbank/spec.md. List a topic here only once its
// file exists (tests/qbank.mjs checks).
export default {
  id: 'physics',
  name: 'Physics: IIT JAM, GATE and CSIR NET',
  exams: { jam: 'IIT JAM', gate: 'GATE', net: 'CSIR NET' },
  units: [
    { id: 'math', name: 'Mathematical methods', topics: [
      { id: 'vector-calculus', name: 'Vectors and vector calculus' },
    ] },
  ],
};
