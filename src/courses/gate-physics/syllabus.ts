// GATE Physics (PH) (nihal, 2026-11-22): a complete self-study course at MSc level, from the GATE PH syllabus.
// Updated 2026-11-24 to the revised GATE 2027 PH syllabus (checked): added Measurements and error analysis (9.8) and Optical physics (3.11, 3.12);
// topics dropped from 2027 stay as background, marked "Not in the GATE 2027 syllabus" in their lessons (nothing deleted).
// Basics already taught in IIT JAM Physics (src/courses/iit-jam-physics/) are linked, not repeated.
// Practice questions and mocks: shared physics bank (public/qbank/physics/), exam tag `gate`. All questions original.
import type { CourseSyllabus } from '../types';

export const GATE_PHYSICS: CourseSyllabus = {
  id: 'gate-physics',
  name: 'GATE Physics',
  title: 'GATE Physics (PH): the complete free course, from MSc basics to top rank',
  text: 'Every section of the GATE Physics syllabus, from mathematical physics and quantum mechanics to solid state, nuclear physics and electronics, taught step by step with animations and worked examples, then thousands of original MCQ, MSQ and NAT questions by topic and difficulty, full solutions and timed mock tests marked the GATE way.',
  audience: 'For MSc physics students and BSc graduates preparing for GATE PH. Undergraduate basics are linked to the IIT JAM Physics course whenever you need a refresher.',
  updated: '2026-11-24',
  kit: true,
  footnote: 'Not affiliated with the IITs, IISc or the GATE organising institute. The general aptitude part of GATE is not covered here. Check the official GATE website for the current pattern. All questions are original.',
  extras: [
    { href: '/learn/courses/gate-physics/practice/', label: 'Practice questions, by topic' },
    { href: '/learn/courses/gate-physics/mock-test/', label: 'Timed mock tests' },
  ],
  parts: [
    { name: 'Part A: Mathematical physics', modules: [
      { n: 1, name: 'Mathematical physics', lessons: [
        ['1.1', 'linear-vector-spaces', 'Linear vector spaces and Dirac notation'],
        ['1.2', 'matrices-eigenvalues', 'Hermitian and unitary matrices, diagonalisation'],
        ['1.3', 'complex-analysis', 'Analytic functions and Cauchy\'s theorem'],
        ['1.4', 'residues', 'The residue theorem and real integrals'],
        ['1.5', 'fourier-laplace-transforms', 'Fourier and Laplace transforms'],
        ['1.6', 'special-functions', 'Series solutions: Legendre, Bessel and Hermite'],
        ['1.7', 'partial-differential-equations', 'Partial differential equations and separation of variables'],
        ['1.8', 'delta-greens-functions', 'The Dirac delta and Green\'s functions'],
        ['1.9', 'tensors', 'Tensors'],
        ['1.10', 'probability', 'Probability and statistics for physicists'],
      ] },
    ] },
    { name: 'Part B: Mechanics and fields', modules: [
      { n: 2, name: 'Classical mechanics', lessons: [
        ['2.1', 'lagrangian-mechanics', 'Lagrangian mechanics'],
        ['2.2', 'hamiltonian-mechanics', 'Hamiltonian mechanics'],
        ['2.3', 'poisson-brackets', 'Poisson brackets and canonical transformations'],
        ['2.4', 'central-force-scattering', 'Central forces and scattering'],
        ['2.5', 'normal-modes', 'Small oscillations and normal modes'],
        ['2.6', 'rigid-body-dynamics', 'Rigid body dynamics: inertia tensor and Euler\'s equations'],
        ['2.7', 'relativistic-kinematics', 'Four-vectors and relativistic kinematics'],
      ] },
      { n: 3, name: 'Electromagnetic theory and optics', lessons: [
        ['3.1', 'boundary-value-problems', 'Boundary value problems and Laplace\'s equation'],
        ['3.2', 'method-of-images', 'The method of images'],
        ['3.3', 'multipoles', 'Multipole expansion'],
        ['3.4', 'fields-in-matter', 'Fields in matter: polarisation and magnetisation'],
        ['3.5', 'potentials-gauges', 'Potentials, gauges and Maxwell\'s equations'],
        ['3.6', 'em-waves-media', 'Electromagnetic waves in matter, conductors and plasmas'],
        ['3.7', 'fresnel-equations', 'Reflection, refraction and the Fresnel equations'],
        ['3.8', 'waveguides', 'Waveguides'],
        ['3.9', 'radiation', 'Radiation from dipoles and accelerated charges'],
        ['3.10', 'covariant-electrodynamics', 'Electrodynamics and relativity'],
        ['3.11', 'interference-diffraction', 'Optical physics: coherence, interference and diffraction'],
        ['3.12', 'polarisation-ray-optics', 'Optical physics: polarisation, Jones calculus and ray matrices'],
      ] },
    ] },
    { name: 'Part C: Quantum and statistical physics', modules: [
      { n: 4, name: 'Quantum mechanics', lessons: [
        ['4.1', 'postulates-operators', 'Postulates, operators and expectation values'],
        ['4.2', 'commutators-uncertainty', 'Commutators and the uncertainty relation'],
        ['4.3', 'one-dimensional-potentials', 'One-dimensional potentials: wells, barriers and delta potentials'],
        ['4.4', 'harmonic-oscillator', 'The quantum harmonic oscillator and ladder operators'],
        ['4.5', 'angular-momentum', 'Angular momentum'],
        ['4.6', 'hydrogen-atom', 'The hydrogen atom'],
        ['4.7', 'spin-addition', 'Spin and the addition of angular momenta'],
        ['4.8', 'perturbation-theory', 'Time-independent perturbation theory'],
        ['4.9', 'variational-wkb', 'The variational method and WKB'],
        ['4.10', 'time-dependent-perturbation', 'Time-dependent perturbation theory and Fermi\'s golden rule'],
        ['4.11', 'identical-particles', 'Identical particles'],
      ] },
      { n: 5, name: 'Thermodynamics and statistical physics', lessons: [
        ['5.1', 'ensembles', 'Microstates, entropy and the ensembles'],
        ['5.2', 'partition-functions', 'Partition functions and free energy'],
        ['5.3', 'classical-gas-equipartition', 'The classical ideal gas and equipartition'],
        ['5.4', 'quantum-statistics', 'Bose-Einstein and Fermi-Dirac statistics'],
        ['5.5', 'photon-phonon-gases', 'Blackbody radiation and Bose-Einstein condensation'],
        ['5.6', 'fermi-gas', 'The Fermi gas'],
        ['5.7', 'phase-transitions', 'Phase transitions'],
      ] },
    ] },
    { name: 'Part D: Atoms, solids, nuclei and electronics', modules: [
      { n: 6, name: 'Atomic and molecular physics', lessons: [
        ['6.1', 'fine-structure', 'Hydrogen spectra and fine structure'],
        ['6.2', 'ls-jj-coupling', 'Many-electron atoms: LS and jj coupling'],
        ['6.3', 'zeeman-stark', 'Zeeman and Stark effects'],
        ['6.4', 'rotational-spectra', 'Rotational spectra'],
        ['6.5', 'vibrational-spectra', 'Vibrational spectra'],
        ['6.6', 'raman', 'Raman spectroscopy'],
        ['6.7', 'lasers', 'Einstein coefficients and lasers'],
      ] },
      { n: 7, name: 'Solid state physics', lessons: [
        ['7.1', 'reciprocal-lattice', 'Bravais lattices and the reciprocal lattice'],
        ['7.2', 'structure-factor', 'Diffraction and the structure factor'],
        ['7.3', 'bonding', 'Bonding in solids'],
        ['7.4', 'phonons', 'Lattice vibrations and phonons'],
        ['7.5', 'heat-capacity', 'Heat capacity: Einstein and Debye'],
        ['7.6', 'free-electron-model', 'The free electron model'],
        ['7.7', 'band-theory', 'Band theory'],
        ['7.8', 'semiconductors-hall', 'Semiconductors and the Hall effect'],
        ['7.9', 'magnetism', 'Dia-, para- and ferromagnetism'],
        ['7.10', 'superconductivity', 'Superconductivity'],
      ] },
      { n: 8, name: 'Nuclear and particle physics', lessons: [
        ['8.1', 'nuclear-properties', 'Nuclear size, spin and moments'],
        ['8.2', 'binding-energy-semf', 'Binding energy and the semi-empirical mass formula'],
        ['8.3', 'shell-model', 'The nuclear shell model'],
        ['8.4', 'radioactive-decays', 'Alpha, beta and gamma decay'],
        ['8.5', 'nuclear-reactions', 'Nuclear reactions and Q values'],
        ['8.6', 'particles-quarks', 'Elementary particles and quarks'],
        ['8.7', 'conservation-laws', 'Conservation laws and symmetries'],
      ] },
      { n: 9, name: 'Electronics and measurements', lessons: [
        ['9.1', 'semiconductor-devices', 'Diodes, BJTs, FETs and MOSFETs'],
        ['9.2', 'amplifiers-feedback', 'Amplifiers and feedback'],
        ['9.3', 'op-amp-circuits', 'Op-amp circuits'],
        ['9.4', 'oscillators', 'Oscillators'],
        ['9.5', 'combinational-logic', 'Combinational logic'],
        ['9.6', 'sequential-logic', 'Flip-flops, counters and registers'],
        ['9.7', 'adc-dac', 'ADCs and DACs'],
        ['9.8', 'measurements-error-analysis', 'Measurements and error analysis'],
      ] },
      { n: 10, name: 'Exam craft', lessons: [
        ['10.1', 'gate-exam-pattern', 'The GATE PH paper: sections, marking and timing'],
        ['10.2', 'gate-strategy', 'A GATE strategy: what to attempt first and when to skip'],
      ] },
    ] },
  ],
};

export const GATE_BANK = { bank: 'physics', exam: 'gate', pattern: 'gate' };
