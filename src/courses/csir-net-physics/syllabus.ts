// CSIR NET Physical Sciences (nihal, 2026-11-22): a self-study course for the CSIR-UGC NET (JRF and lectureship).
// NET's core (Part B) overlaps GATE: each module starts with a roadmap lesson that links the GATE Physics lessons to
// study, then teaches what only NET asks (mostly Part C). Practice and mocks: shared physics bank, exam tag `net`.
import type { CourseSyllabus } from '../types';

export const NET_PHYSICS: CourseSyllabus = {
  id: 'csir-net-physics',
  name: 'CSIR NET Physics',
  title: 'CSIR NET Physical Sciences: the complete free course for JRF',
  text: 'A study plan for CSIR NET Physical Sciences that covers Parts A, B and C: roadmaps for every unit, lessons on the advanced topics only NET asks (group theory, scattering, relativistic quantum mechanics, chaos, fluctuations, experimental methods and more), and thousands of original questions with full solutions and timed mock tests with NET marking.',
  audience: 'For MSc physics students preparing for CSIR NET (JRF or lectureship). Core topics link to the GATE Physics lessons, so the two courses work as one.',
  updated: '2026-11-22',
  kit: true,
  footnote: 'Not affiliated with CSIR, UGC or the National Testing Agency. Check the official CSIR NET website for the current pattern. All questions are original.',
  extras: [
    { href: '/learn/courses/csir-net-physics/practice/', label: 'Practice questions, by topic' },
    { href: '/learn/courses/csir-net-physics/mock-test/', label: 'Timed mock tests' },
  ],
  parts: [
    { name: 'Part A: Plan and aptitude', modules: [
      { n: 1, name: 'Start here', lessons: [
        ['1.1', 'net-exam-pattern', 'The NET paper: Parts A, B and C, marking and cut-offs'],
        ['1.2', 'study-plan', 'A 6-month study plan using this course and GATE Physics'],
        ['1.3', 'part-a-aptitude', 'Part A: numerical, graphical and logical reasoning'],
      ] },
    ] },
    { name: 'Part B: Core, with NET extras', modules: [
      { n: 2, name: 'Mathematical methods', lessons: [
        ['2.1', 'maths-roadmap', 'Mathematical methods: what NET asks and where to study it'],
        ['2.2', 'group-theory', 'Group theory for physicists'],
        ['2.3', 'probability-distributions', 'Random variables and probability distributions'],
        ['2.4', 'numerical-methods', 'Numerical methods: roots, integration and ODEs'],
      ] },
      { n: 3, name: 'Classical mechanics', lessons: [
        ['3.1', 'mechanics-roadmap', 'Classical mechanics: what NET asks and where to study it'],
        ['3.2', 'hamilton-jacobi', 'Canonical transformations and Hamilton-Jacobi theory'],
        ['3.3', 'phase-space-stability', 'Phase space, fixed points and stability'],
        ['3.4', 'nonlinear-dynamics-chaos', 'Nonlinear dynamics and chaos'],
      ] },
      { n: 4, name: 'Electromagnetic theory', lessons: [
        ['4.1', 'em-roadmap', 'Electromagnetic theory: what NET asks and where to study it'],
        ['4.2', 'retarded-potentials', 'Retarded and Liénard-Wiechert potentials'],
        ['4.3', 'plasma-dispersion', 'Plasma oscillations and dispersion'],
      ] },
      { n: 5, name: 'Quantum mechanics', lessons: [
        ['5.1', 'quantum-roadmap', 'Quantum mechanics: what NET asks and where to study it'],
        ['5.2', 'scattering-theory', 'Scattering: Born approximation and partial waves'],
        ['5.3', 'relativistic-quantum', 'Klein-Gordon and Dirac equations'],
      ] },
      { n: 6, name: 'Thermodynamics and statistical physics', lessons: [
        ['6.1', 'stat-roadmap', 'Statistical physics: what NET asks and where to study it'],
        ['6.2', 'fluctuations-brownian', 'Fluctuations, diffusion and Brownian motion'],
        ['6.3', 'ising-landau', 'The Ising model and Landau theory'],
        ['6.4', 'transport', 'Kinetic theory of transport'],
      ] },
      { n: 7, name: 'Electronics and experimental methods', lessons: [
        ['7.1', 'electronics-roadmap', 'Electronics: what NET asks and where to study it'],
        ['7.2', 'errors-data-fitting', 'Measurement, errors and fitting data'],
        ['7.3', 'transducers-detectors', 'Transducers and detectors'],
        ['7.4', 'noise-lock-in', 'Noise, filtering and lock-in detection'],
      ] },
    ] },
    { name: 'Part C: Advanced units', modules: [
      { n: 8, name: 'Atomic and molecular physics', lessons: [
        ['8.1', 'atomic-roadmap', 'Atomic and molecular physics: what NET asks'],
        ['8.2', 'esr-nmr', 'Magnetic resonance: ESR and NMR'],
        ['8.3', 'electronic-spectra', 'Electronic spectra and the Franck-Condon principle'],
      ] },
      { n: 9, name: 'Condensed matter physics', lessons: [
        ['9.1', 'condensed-roadmap', 'Condensed matter: what NET asks'],
        ['9.2', 'defects-dislocations', 'Defects and dislocations'],
        ['9.3', 'dielectric-optical', 'Dielectric and optical properties of solids'],
        ['9.4', 'quantum-hall', 'The quantum Hall effect and low-dimensional systems'],
      ] },
      { n: 10, name: 'Nuclear and particle physics', lessons: [
        ['10.1', 'nuclear-roadmap', 'Nuclear and particle physics: what NET asks'],
        ['10.2', 'deuteron-nuclear-force', 'The deuteron and the nuclear force'],
        ['10.3', 'collective-model', 'The collective model and nuclear deformation'],
        ['10.4', 'quark-model', 'Isospin, strangeness and the quark model'],
      ] },
    ] },
  ],
};

export const NET_BANK = { bank: 'physics', exam: 'net', pattern: 'net' };
