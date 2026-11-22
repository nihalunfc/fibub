// IIT JAM Physics (nihal, 2026-11-22): a complete, self-study course for the Joint Admission Test for Masters, from
// first principles to top-rank problems. Lessons follow the official JAM Physics syllabus; practice questions and
// mock tests come from the shared physics question bank (public/qbank/physics/, engine src/lib/qbank/), filtered
// to exam tag `jam`. Every question is original; none is copied from a past paper.
// Lesson kit on (public/learn-kit/iit-jam-physics/): figures, step players, live problems, summary sheets.
import type { CourseSyllabus } from '../types';

export const JAM_PHYSICS: CourseSyllabus = {
  id: 'iit-jam-physics',
  name: 'IIT JAM Physics',
  title: 'IIT JAM Physics: the complete free course, from basics to top rank',
  text: 'Every topic in the IIT JAM Physics syllabus taught from scratch, with animations, worked examples and the tricks examiners use, then thousands of practice questions (MCQ, MSQ and NAT) sorted by topic and difficulty, with full solutions and timed mock tests marked the JAM way.',
  audience: 'For BSc physics students preparing for IIT JAM. You need Class 12 physics and maths; everything else is built up step by step.',
  updated: '2026-11-22',
  kit: true,
  footnote: 'Not affiliated with IIT or the JAM organising institute. Exam pattern as published for recent years: always check the official JAM website before the exam. All questions are original.',
  extras: [
    { href: '/learn/courses/iit-jam-physics/practice/', label: 'Practice questions, by topic' },
    { href: '/learn/courses/iit-jam-physics/mock-test/', label: 'Timed mock tests' },
  ],
  parts: [
    { name: 'Part A: The toolkit', modules: [
      { n: 1, name: 'Mathematical methods', lessons: [
        ['1.1', 'calculus-and-series', 'Calculus refresher: limits, Taylor series and approximations'],
        ['1.2', 'partial-derivatives', 'Partial derivatives, Jacobians and exact differentials'],
        ['1.3', 'multiple-integrals', 'Double and triple integrals in any coordinates'],
        ['1.4', 'vector-algebra', 'Vector algebra: dot, cross and triple products'],
        ['1.5', 'vector-calculus', 'Gradient, divergence and curl'],
        ['1.6', 'integral-theorems', 'Gauss, Stokes and Green: the integral theorems'],
        ['1.7', 'differential-equations', 'First and second order differential equations'],
        ['1.8', 'matrices', 'Matrices, determinants and eigenvalues'],
        ['1.9', 'complex-numbers', 'Complex numbers and Euler\'s formula'],
        ['1.10', 'fourier-series', 'Fourier series'],
      ] },
    ] },
    { name: 'Part B: Mechanics and matter', modules: [
      { n: 2, name: 'Mechanics and properties of matter', lessons: [
        ['2.1', 'newtons-laws-frames', 'Newton\'s laws, inertial and non-inertial frames'],
        ['2.2', 'work-energy-collisions', 'Work, energy, momentum and collisions'],
        ['2.3', 'variable-mass', 'Variable mass systems and rockets'],
        ['2.4', 'central-forces', 'Central forces, orbits and Kepler\'s laws'],
        ['2.5', 'moment-of-inertia', 'Moment of inertia and the axis theorems'],
        ['2.6', 'rigid-body-rotation', 'Rotation, rolling and angular momentum'],
        ['2.7', 'elasticity', 'Elasticity: stress, strain and the elastic constants'],
        ['2.8', 'fluids', 'Fluids: surface tension, viscosity and Bernoulli'],
        ['2.9', 'special-relativity', 'Special relativity: Lorentz transformations and E = mc²'],
      ] },
      { n: 3, name: 'Oscillations, waves and optics', lessons: [
        ['3.1', 'simple-harmonic-motion', 'Simple harmonic motion'],
        ['3.2', 'damped-forced-oscillations', 'Damped and forced oscillations, resonance'],
        ['3.3', 'superposition-coupled', 'Superposition, Lissajous figures and coupled oscillators'],
        ['3.4', 'waves', 'Waves: the wave equation, standing waves and group velocity'],
        ['3.5', 'sound-doppler', 'Sound, beats and the Doppler effect'],
        ['3.6', 'geometrical-optics', 'Geometrical optics: mirrors, lenses and systems'],
        ['3.7', 'interference', 'Interference: Young, thin films, Newton\'s rings and Michelson'],
        ['3.8', 'diffraction', 'Diffraction: single slit, gratings and resolving power'],
        ['3.9', 'polarisation', 'Polarisation: Malus, Brewster and wave plates'],
      ] },
    ] },
    { name: 'Part C: Fields and heat', modules: [
      { n: 4, name: 'Electricity and magnetism', lessons: [
        ['4.1', 'electrostatics-gauss', 'Electric fields and Gauss\'s law'],
        ['4.2', 'potential-energy', 'Potential and electrostatic energy'],
        ['4.3', 'conductors-images', 'Conductors, Laplace\'s equation and images'],
        ['4.4', 'dielectrics', 'Dielectrics and capacitors'],
        ['4.5', 'magnetostatics', 'Magnetic fields: Biot-Savart and Ampère'],
        ['4.6', 'magnetic-materials', 'Magnetic materials: B, H and M'],
        ['4.7', 'induction', 'Electromagnetic induction and inductance'],
        ['4.8', 'circuits', 'DC transients and AC circuits'],
        ['4.9', 'maxwell-em-waves', 'Maxwell\'s equations and electromagnetic waves'],
      ] },
      { n: 5, name: 'Kinetic theory and thermodynamics', lessons: [
        ['5.1', 'kinetic-theory', 'Kinetic theory: Maxwell\'s speeds, mean free path, equipartition'],
        ['5.2', 'first-law', 'The first law: work, heat and processes'],
        ['5.3', 'second-law-entropy', 'The second law, engines and entropy'],
        ['5.4', 'thermodynamic-potentials', 'Thermodynamic potentials and Maxwell relations'],
        ['5.5', 'phase-changes', 'Phase changes and the Clausius-Clapeyron equation'],
        ['5.6', 'blackbody-radiation', 'Blackbody radiation'],
      ] },
    ] },
    { name: 'Part D: Modern physics and devices', modules: [
      { n: 6, name: 'Modern physics', lessons: [
        ['6.1', 'photons', 'Photons: the photoelectric and Compton effects'],
        ['6.2', 'matter-waves', 'Matter waves and the uncertainty principle'],
        ['6.3', 'schrodinger-equation', 'The Schrödinger equation: wells, steps and tunnelling'],
        ['6.4', 'atoms-x-rays', 'The Bohr atom, spectra and X-rays'],
        ['6.5', 'nuclei-radioactivity', 'Nuclei, binding energy and radioactivity'],
        ['6.6', 'nuclear-reactions', 'Nuclear reactions, fission and fusion'],
      ] },
      { n: 7, name: 'Solid state physics and electronics', lessons: [
        ['7.1', 'crystal-structure', 'Crystal structure, lattices and Miller indices'],
        ['7.2', 'x-ray-diffraction', 'X-ray diffraction and Bragg\'s law'],
        ['7.3', 'semiconductors', 'Semiconductors and the Fermi level'],
        ['7.4', 'diodes', 'p-n junctions, diodes and Zener diodes'],
        ['7.5', 'transistors', 'Transistors and amplifiers'],
        ['7.6', 'op-amps', 'Operational amplifiers'],
        ['7.7', 'digital-logic', 'Logic gates and Boolean algebra'],
      ] },
      { n: 8, name: 'Exam craft', lessons: [
        ['8.1', 'jam-exam-pattern', 'The JAM paper: sections, marking and timing'],
        ['8.2', 'problem-solving-tricks', 'Solving faster: dimensions, limits, symmetry and elimination'],
      ] },
    ] },
  ],
};

/** Which question bank topics go with each module (practice pages list them in this order). */
export const JAM_BANK = { bank: 'physics', exam: 'jam', pattern: 'jam' };
