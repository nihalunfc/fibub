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
      { id: 'calculus-and-series', name: 'Limits, Taylor series and approximations' },
      { id: 'partial-derivatives', name: 'Partial derivatives and Jacobians' },
      { id: 'multiple-integrals', name: 'Double and triple integrals' },
      { id: 'vector-algebra', name: 'Vector algebra: dot, cross and triple products' },
      { id: 'vector-calculus', name: 'Vectors and vector calculus' },
      { id: 'integral-theorems', name: 'Gauss, Stokes and Green theorems' },
      { id: 'differential-equations', name: 'Differential equations' },
      { id: 'matrices', name: 'Matrices, determinants and eigenvalues' },
      { id: 'complex-numbers', name: 'Complex numbers' },
      { id: 'fourier-series', name: 'Fourier series' },
    ] },
    { id: 'mechanics', name: 'Mechanics and properties of matter', topics: [
      { id: 'newtons-laws-frames', name: 'Newton\'s laws, inertial and non-inertial frames' },
      { id: 'work-energy-collisions', name: 'Work, energy, momentum and collisions' },
      { id: 'variable-mass', name: 'Variable mass systems and rockets' },
      { id: 'central-forces', name: 'Central forces, orbits and Kepler\'s laws' },
      { id: 'moment-of-inertia', name: 'Moment of inertia and the axis theorems' },
      { id: 'rigid-body-rotation', name: 'Rotation, rolling and angular momentum' },
      { id: 'elasticity', name: 'Elasticity: stress, strain and the elastic constants' },
      { id: 'fluids', name: 'Fluids: surface tension, viscosity and Bernoulli' },
      { id: 'special-relativity', name: 'Special relativity: Lorentz transformations and E = mc²' },
    ] },
    { id: 'waves-optics', name: 'Oscillations, waves and optics', topics: [
      { id: 'simple-harmonic-motion', name: 'Simple harmonic motion' },
      { id: 'damped-forced-oscillations', name: 'Damped and forced oscillations, resonance' },
      { id: 'superposition-coupled', name: 'Superposition, Lissajous figures and coupled oscillators' },
      { id: 'waves', name: 'Waves: the wave equation, standing waves and group velocity' },
      { id: 'sound-doppler', name: 'Sound, beats and the Doppler effect' },
      { id: 'geometrical-optics', name: 'Geometrical optics: mirrors, lenses and systems' },
      { id: 'interference', name: 'Interference' },
      { id: 'diffraction', name: 'Diffraction' },
      { id: 'polarisation', name: 'Polarisation: Malus, Brewster and wave plates' },
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
    { id: 'modern', name: 'Modern physics', topics: [
      { id: 'photons', name: 'Photons: the photoelectric and Compton effects' },
      { id: 'matter-waves', name: 'Matter waves and the uncertainty principle' },
      { id: 'schrodinger-equation', name: 'The Schrödinger equation: wells, steps and tunnelling' },
      { id: 'atoms-x-rays', name: 'The Bohr atom, spectra and X-rays' },
    ] },
    { id: 'solid-state', name: 'Solid state physics and devices', topics: [
      { id: 'crystal-structure', name: 'Crystal structure, lattices and Miller indices' },
      { id: 'x-ray-diffraction', name: 'X-ray diffraction and Bragg\'s law' },
      { id: 'semiconductors', name: 'Semiconductors and the Fermi level' },
      { id: 'diodes', name: 'p-n junctions, diodes and Zener diodes' },
    ] },
    { id: 'electronics', name: 'Electronics', topics: [
      { id: 'transistors', name: 'Transistors and amplifiers' },
      { id: 'op-amps', name: 'Operational amplifiers' },
      { id: 'digital-logic', name: 'Logic gates and Boolean algebra' },
    ] },
    { id: 'nuclear', name: 'Nuclear physics', topics: [
      { id: 'nuclei-radioactivity', name: 'Nuclei, binding energy and radioactivity' },
    ] },
  ],
};
