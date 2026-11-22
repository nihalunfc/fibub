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
      { id: 'integral-theorems', name: 'Gauss, Stokes and Green theorems' },
      { id: 'differential-equations', name: 'Differential equations' },
      { id: 'matrices', name: 'Matrices, determinants and eigenvalues' },
      { id: 'complex-numbers', name: 'Complex numbers' },
    ] },
    { id: 'mechanics', name: 'Mechanics and properties of matter', topics: [
      { id: 'newtons-laws-frames', name: 'Newton\'s laws, inertial and non-inertial frames' },
      { id: 'work-energy-collisions', name: 'Work, energy, momentum and collisions' },
      { id: 'central-forces', name: 'Central forces, orbits and Kepler\'s laws' },
      { id: 'moment-of-inertia', name: 'Moment of inertia and the axis theorems' },
    ] },
    { id: 'waves-optics', name: 'Oscillations, waves and optics', topics: [
      { id: 'simple-harmonic-motion', name: 'Simple harmonic motion' },
      { id: 'damped-forced-oscillations', name: 'Damped and forced oscillations, resonance' },
      { id: 'interference', name: 'Interference' },
      { id: 'diffraction', name: 'Diffraction' },
    ] },
    { id: 'em', name: 'Electricity and magnetism', topics: [
      { id: 'electrostatics-gauss', name: 'Electric fields and Gauss\'s law' },
      { id: 'potential-energy', name: 'Potential and electrostatic energy' },
      { id: 'magnetostatics', name: 'Magnetic fields: Biot-Savart and Ampère' },
      { id: 'induction', name: 'Electromagnetic induction and inductance' },
    ] },
    { id: 'thermal', name: 'Kinetic theory and thermodynamics', topics: [
      { id: 'kinetic-theory', name: 'Kinetic theory of gases' },
      { id: 'first-law', name: 'The first law: work, heat and processes' },
      { id: 'second-law-entropy', name: 'The second law, engines and entropy' },
      { id: 'thermodynamic-potentials', name: 'Thermodynamic potentials and Maxwell relations' },
    ] },
  ],
};
