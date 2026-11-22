// The Schrödinger equation in one dimension (and the cubic box): what a wavefunction must satisfy, normalisation
// and probabilities, stationary states and superpositions, the infinite square well, the finite well, steps and
// rectangular barriers (reflection, transmission, penetration depth, tunnelling), the harmonic oscillator and the
// delta-function well. Original questions for IIT JAM, GATE and CSIR NET practice (fibub).
import { pick, int, choose, mcqOptions, round } from '../_util.js';

const BOX = 0.376;     // h^2/(8 m_e) in eV nm^2, as stated in the questions
const H2M = 0.0381;    // hbar^2/(2 m_e) in eV nm^2, as stated
const boxP = (n, a, b) => (b - a) - (Math.sin(2 * n * Math.PI * b) - Math.sin(2 * n * Math.PI * a)) / (2 * n * Math.PI); // a, b as fractions of L
const simpson = (f, a, b, N = 2000) => { const h = (b - a) / N; let s = f(a) + f(b); for (let i = 1; i < N; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };

import * as Q5 from '../_util.js';
import more2 from './schrodinger-equation.more2.gen.js';
import r4 from './schrodinger-equation.r4.gen.js';

// Helpers for the variety templates (ids ending -t21 to -t25).
// q5msq: a statement MSQ with a random mix of true lines (from good) and false lines (from bad), at least one of each.
function q5msq(r, good, bad, n = 4) {
  const lo = Math.max(1, n - bad.length), hi = Math.max(lo, Math.min(good.length, n - 1));
  const k = Q5.int(r, lo, hi);
  const all = Q5.shuffle(r, [...Q5.shuffle(r, good).slice(0, k).map((s) => [s, 1]), ...Q5.shuffle(r, bad).slice(0, n - k).map((s) => [s, 0])]);
  return { options: all.map((x) => x[0]), answer: all.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0) };
}
// q5odd: an MCQ whose answer is the one line from `odd` placed among three lines from `rest`.
const q5odd = (r, odd, rest) => Q5.mcqOptions(r, Q5.choose(r, odd), Q5.shuffle(r, rest));
// q5frac: a fraction n/d (integers) in lowest terms, as TeX.
function q5frac(n, d) {
  const g = (a, b) => (b ? g(b, a % b) : Math.abs(a));
  const k = g(n, d) * Math.sign(d); const a = n / k, b = d / k;
  return b === 1 ? String(a) : `${a < 0 ? '-' : ''}\\tfrac{${Math.abs(a)}}{${b}}`;
}

export default {
  topic: 'schrodinger-equation',
  items: [
    // ---------- level 1 ----------
    { id: 'sch-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'infinite well',
      q: 'A particle is in the ground state of a one-dimensional infinite square well of width $L$, with energy $E_1$. If the width is doubled, the ground-state energy becomes',
      options: ['$E_1/2$', '$2E_1$', '$E_1/4$', '$4E_1$'], answer: 2,
      sol: '$E_n = n^2h^2/(8mL^2)$, so $E_1 \\propto 1/L^2$. Doubling $L$ divides the energy by 4. A roomier box lets the wave be longer, so its momentum and energy are lower.',
      trap: 'The energy goes as $1/L^2$, not $1/L$.' },
    { id: 'sch-002', type: 'nat', level: 1, exams: ['jam'], sub: 'infinite well', unit: 'eV',
      q: 'An electron is trapped in a one-dimensional infinite well of width $1.0$ nm. Take $h^2/(8m_e) = 0.376$ eV nm$^2$. The energy needed to lift it from the ground state to the first excited state is ______ eV (to two decimal places).',
      answer: 1.13, tol: 0.01, calc: () => (4 - 1) * BOX / 1,
      sol: '$E_n = n^2(0.376)/L^2$ eV with $L$ in nm. $E_1 = 0.376$ eV, $E_2 = 4\\times0.376 = 1.504$ eV. The gap is $3\\times0.376 = 1.13$ eV.',
      trap: 'The first excited state is $n = 2$, not $n = 1$; there is no $n = 0$ state in a box.' },
    { id: 'sch-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'acceptable wavefunctions',
      q: 'Which function could be the wavefunction of a bound particle on the whole line $-\\infty < x < \\infty$?',
      options: ['$e^{x}$', '$\\sin x$', '$1/x$', '$x\\,e^{-x^2}$'], answer: 3,
      sol: 'A bound state must be single-valued, continuous and square-integrable, $\\int|\\psi|^2dx$ finite. $x e^{-x^2}$ is all three. $e^x$ blows up as $x \\to \\infty$; $\\sin x$ never dies away, so its integral grows without limit; $1/x$ blows up at $x = 0$ and its square cannot be integrated there.',
      trap: 'A wavefunction is allowed to be zero at some points (nodes); it is not allowed to blow up or to fail to die away for a bound state.' },
    { id: 'sch-004', type: 'msq', level: 1, exams: ['jam'], sub: 'acceptable wavefunctions', format: 'multi',
      q: 'For a particle in a potential $V(x)$ that is finite everywhere, which conditions must a bound-state solution $\\psi(x)$ of the time-independent Schrödinger equation satisfy?',
      options: ['$\\psi$ is continuous.', '$d\\psi/dx$ is continuous.', '$\\int_{-\\infty}^{\\infty}|\\psi|^2dx$ is finite.', '$\\psi$ is real everywhere.'], answer: [0, 1, 2],
      sol: 'A jump in $\\psi$ would make $d^2\\psi/dx^2$ infinitely large, which a finite $V$ cannot balance; a kink (jump in $d\\psi/dx$) needs an infinite $V$ at that point (walls or delta functions). A bound state must be normalisable. It need not be real: any constant phase, or complex combinations, are allowed.',
      trap: 'At an infinite wall the slope can jump; only there is the second condition dropped.' },
    { id: 'sch-005', type: 'mcq', level: 1, exams: ['jam'], sub: 'infinite well',
      q: 'For the $n$-th stationary state of an infinite square well, the number of nodes strictly inside the well (not counting the walls) is',
      options: ['$n$', '$n - 1$', '$n + 1$', '$2n$'], answer: 1,
      sol: '$\\psi_n \\propto \\sin(n\\pi x/L)$ fits $n$ half-wavelengths into the box. Between $n$ half-loops there are $n - 1$ zero crossings inside. The ground state ($n = 1$) has none.',
      trap: 'The zeros at the walls are forced by the boundary and are not counted.' },
    { id: 'sch-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'harmonic oscillator',
      q: 'The energy levels of a one-dimensional quantum harmonic oscillator of angular frequency $\\omega$ are ($n = 0, 1, 2, \\dots$)',
      options: ['$n\\hbar\\omega$', '$(n + \\tfrac12)\\hbar\\omega$', '$(n + 1)\\hbar\\omega$', '$n^2\\hbar\\omega$'], answer: 1,
      sol: 'Solving the Schrödinger equation with $V = \\tfrac12m\\omega^2x^2$ gives equally spaced levels $(n + \\tfrac12)\\hbar\\omega$. The lowest energy is $\\tfrac12\\hbar\\omega$, not zero: the zero-point energy.',
      trap: 'Equal spacing is special to the oscillator; the box has spacing that grows as $n^2$.' },

    // ---------- level 2 ----------
    { id: 'sch-007', type: 'nat', level: 2, exams: ['jam'], sub: 'normalisation', unit: 'nm$^{-1/2}$',
      q: 'The wavefunction $\\psi(x) = A\\,e^{-|x|/a}$ with $a = 2.0$ nm describes a particle on the whole line. For $\\psi$ to be normalised, $A$ (real, positive) is ______ nm$^{-1/2}$ (to two decimal places).',
      answer: 0.71, tol: 0.01, calc: () => 1 / Math.sqrt(2),
      sol: '$\\int|\\psi|^2dx = A^2\\int_{-\\infty}^{\\infty}e^{-2|x|/a}dx = 2A^2\\int_0^\\infty e^{-2x/a}dx = 2A^2(a/2) = A^2a$. Setting this to 1: $A = 1/\\sqrt a = 1/\\sqrt{2.0} = 0.71$ nm$^{-1/2}$.',
      trap: 'Squaring $e^{-|x|/a}$ doubles the exponent: the decay length of $|\\psi|^2$ is $a/2$.' },
    { id: 'sch-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'stationary states',
      q: 'A particle is in a stationary state $\\Psi(x, t) = \\psi(x)e^{-iEt/\\hbar}$. Its probability density $|\\Psi|^2$',
      options: ['does not change with time', 'oscillates at angular frequency $E/\\hbar$', 'decays as $e^{-2Et/\\hbar}$', 'moves along $x$ at speed $E/p$'], answer: 0,
      sol: '$|\\Psi|^2 = \\psi^*e^{+iEt/\\hbar}\\psi e^{-iEt/\\hbar} = |\\psi|^2$. The phase factor has modulus 1, so the density, and every expectation value of an operator without explicit time dependence, stays fixed: hence "stationary".',
      trap: 'The wavefunction itself does change (its phase turns at $E/\\hbar$); the density does not.' },
    { id: 'sch-009', type: 'mcq', level: 2, exams: ['jam'], sub: 'step potential',
      q: 'A beam of particles with energy $E$ meets a potential step of height $V_0 < E$. Classically every particle would carry on. Quantum mechanically,',
      options: ['all particles carry on, as classically', 'some particles are reflected, even though they have enough energy to pass', 'all particles are reflected', 'the particles are reflected only if the step goes down instead of up'], answer: 1,
      sol: 'The wave number changes abruptly at the step (from $k_1$ to $k_2$), and matching $\\psi$ and $d\\psi/dx$ there needs a reflected wave. $R = [(k_1 - k_2)/(k_1 + k_2)]^2 > 0$. The same happens for a downward step: $R$ depends only on the mismatch of $k$.',
      trap: 'Reflection is a wave effect: any sudden change of wave number reflects some of the wave, as light reflects at glass.' },
    { id: 'sch-010', type: 'msq', level: 2, exams: ['jam'], sub: 'infinite well', format: 'multi',
      q: 'For the energy levels $E_n$ of a one-dimensional infinite square well, which ratios are correct?',
      options: ['$E_3/E_1 = 9$', '$E_4/E_2 = 4$', '$(E_3 - E_2)/(E_2 - E_1) = 5/3$', '$E_2/E_1 = 2$'], answer: [0, 1, 2],
      sol: '$E_n = n^2E_1$. So $E_3/E_1 = 9$, $E_4/E_2 = 16/4 = 4$, and $(9 - 4)/(4 - 1) = 5/3$. $E_2/E_1 = 4$, not 2.',
      trap: 'The levels go as $n^2$, so ratios of levels are squares of ratios of $n$.' },
    { id: 'sch-011', type: 'msq', level: 2, exams: ['jam'], sub: 'infinite well', format: 'statements',
      q: 'For a particle in a one-dimensional infinite square well, which statements are correct?',
      options: ['The ground-state energy is not zero.', 'The energies grow as $n^2$.', 'Wavefunctions with different $n$ are orthogonal.', 'In the ground state the particle is equally likely to be found anywhere in the well.'], answer: [0, 1, 2],
      sol: 'A zero-energy state would have $\\psi = 0$ everywhere; the lowest allowed is $E_1 = h^2/8mL^2 > 0$ (also required by the uncertainty principle). $E_n = n^2E_1$. $\\int\\sin(n\\pi x/L)\\sin(m\\pi x/L)dx = 0$ for $n \\ne m$. The ground-state density $\\propto\\sin^2(\\pi x/L)$ peaks at the centre and vanishes at the walls.',
      trap: 'A uniform density is the classical (or very large $n$) average, not the ground state.' },
    { id: 'sch-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'harmonic oscillator',
      q: 'A quantum harmonic oscillator has $\\hbar\\omega = 0.20$ eV. The energy of its second excited state is',
      options: ['$0.40$ eV', '$0.50$ eV', '$0.30$ eV', '$0.70$ eV'], answer: 1,
      sol: 'Second excited state means $n = 2$ ($n = 0$ is the ground state). $E_2 = (2 + \\tfrac12)(0.20) = 0.50$ eV.',
      trap: 'Forgetting the zero-point $\\tfrac12\\hbar\\omega$ gives $0.40$ eV; calling the second excited state $n = 3$ gives $0.70$ eV.' },
    { id: 'sch-013', type: 'mcq', level: 2, exams: ['jam'], sub: 'step potential',
      q: 'A particle of energy $E$ meets a step of height $V_0 > E$. Inside the step ($x > 0$) the wavefunction behaves as',
      options: ['$\\sin(\\kappa x)$ with $\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$', 'zero exactly', '$e^{-\\kappa x}$ with $\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$', '$e^{+\\kappa x}$ with $\\kappa = \\sqrt{2mE}/\\hbar$'], answer: 2,
      sol: 'For $x > 0$: $\\psi\'\' = (2m(V_0 - E)/\\hbar^2)\\psi = \\kappa^2\\psi$. Solutions are $e^{\\pm\\kappa x}$; the growing one is thrown out because $\\psi$ must stay finite. So $\\psi \\propto e^{-\\kappa x}$: the particle leaks a little way into the forbidden region.',
      trap: 'The wavefunction in a classically forbidden region is not zero; it decays.' },
    { id: 'sch-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'expectation values',
      q: 'A particle is in the $n$-th stationary state of an infinite well from $x = 0$ to $x = L$. The expectation value $\\langle x\\rangle$ is',
      options: ['$L/2$ for every $n$', '$L/n$', '$L/2$ only for odd $n$', '$0$'], answer: 0,
      sol: '$|\\psi_n|^2 = (2/L)\\sin^2(n\\pi x/L)$ is symmetric about the centre of the well for every $n$ (each state is even or odd about $x = L/2$, and its square is even). So the average position is the centre, $L/2$.',
      trap: '$\\langle x\\rangle = 0$ would be right if the well ran from $-L/2$ to $L/2$. Check where the origin is.' },
    { id: 'sch-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'infinite well',
      q: 'Taking $h^2/(8m_e) = 0.376$ eV nm$^2$, the ground-state energy of an electron in an infinite well of width $0.50$ nm is',
      options: ['$0.75$ eV', '$0.19$ eV', '$3.0$ eV', '$1.5$ eV'], answer: 3,
      sol: '$E_1 = 0.376/L^2 = 0.376/0.25 = 1.50$ eV.',
      trap: 'Dividing by $L$ instead of $L^2$ gives $0.75$ eV.' },
    { id: 'sch-016', type: 'nat', level: 2, exams: ['jam'], sub: 'infinite well', unit: 'nm',
      q: 'An electron in a $1.0$ nm infinite well drops from $n = 2$ to $n = 1$ and emits a photon. Taking $h^2/(8m_e) = 0.376$ eV nm$^2$ and $hc = 1240$ eV nm, the photon wavelength is ______ nm (to the nearest nm).',
      answer: 1099, tol: 3, calc: () => 1240 / (3 * BOX),
      sol: '$\\Delta E = (4 - 1)(0.376) = 1.128$ eV. $\\lambda = 1240/1.128 = 1099$ nm, in the near infrared. Shrinking the box raises the gap and shifts the light towards blue: the idea behind quantum-dot colours.',
      trap: 'Using $E_2$ alone ($1.504$ eV) instead of the difference.' },

    // ---------- level 3 ----------
    { id: 'sch-017', type: 'nat', level: 3, exams: ['jam'], sub: 'probabilities',
      q: 'A particle is in the ground state of an infinite well from $0$ to $L$. The probability of finding it in the middle third, $L/3 < x < 2L/3$, is ______ (to three decimal places).',
      answer: 0.609, tol: 0.002, calc: () => boxP(1, 1 / 3, 2 / 3),
      sol: '$P = \\dfrac2L\\int_{L/3}^{2L/3}\\sin^2\\dfrac{\\pi x}{L}dx = \\left[\\dfrac xL - \\dfrac{1}{2\\pi}\\sin\\dfrac{2\\pi x}{L}\\right]_{L/3}^{2L/3} = \\dfrac13 - \\dfrac{1}{2\\pi}\\left(\\sin\\dfrac{4\\pi}{3} - \\sin\\dfrac{2\\pi}{3}\\right) = \\dfrac13 + \\dfrac{\\sqrt3}{2\\pi} = 0.333 + 0.276 = 0.609$.',
      trap: 'The classical answer, $1/3$, ignores that the ground state crowds into the middle.' },
    { id: 'sch-018', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'tunnelling', unit: '$10^{-5}$',
      q: 'An electron of energy $1.0$ eV meets a rectangular barrier of height $5.0$ eV and width $0.50$ nm. Using $T \\approx e^{-2\\kappa a}$ with $\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$ and $\\hbar^2/(2m_e) = 0.0381$ eV nm$^2$, the transmission probability is ______ $\\times10^{-5}$ (to two decimal places).',
      answer: 3.55, tol: 0.05, calc: () => Math.exp(-2 * Math.sqrt(4 / H2M) * 0.5) / 1e-5,
      sol: '$\\kappa = \\sqrt{(V_0 - E)/(\\hbar^2/2m)} = \\sqrt{4.0/0.0381} = 10.25$ nm$^{-1}$. $2\\kappa a = 2(10.25)(0.50) = 10.25$. $T \\approx e^{-10.25} = 3.55\\times10^{-5}$.',
      trap: 'Using $V_0$ instead of $V_0 - E$ in $\\kappa$. And the exponent has $2\\kappa a$, because $T$ is the square of the amplitude ratio.' },
    { id: 'sch-019', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'tunnelling',
      q: 'For a thick barrier ($\\kappa a \\gg 1$) the transmission probability is $T$. If the barrier width is doubled (everything else the same), the transmission becomes about',
      options: ['$T/2$', '$T/4$', '$2T$', '$T^2$'], answer: 3,
      sol: '$T \\approx e^{-2\\kappa a}$ (times a factor near 1). Doubling $a$ gives $e^{-4\\kappa a} = (e^{-2\\kappa a})^2 = T^2$. If $T$ was $10^{-5}$, it becomes about $10^{-10}$.',
      trap: 'Tunnelling falls exponentially with width, not in proportion to it. This is why the scanning tunnelling microscope is so sensitive to height.' },
    { id: 'sch-020', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'superposition', format: 'statements',
      q: 'A particle in an infinite well is in the state $\\Psi = \\tfrac{1}{\\sqrt2}\\left(\\psi_1e^{-iE_1t/\\hbar} + \\psi_2e^{-iE_2t/\\hbar}\\right)$. Which statements are correct?',
      options: ['The probability density oscillates in time with angular frequency $(E_2 - E_1)/\\hbar$.', 'The expectation value of energy is $(E_1 + E_2)/2$.', 'A single energy measurement can give $(E_1 + E_2)/2$.', 'The state is not a stationary state.'], answer: [0, 1, 3],
      sol: '$|\\Psi|^2 = \\tfrac12[\\psi_1^2 + \\psi_2^2 + 2\\psi_1\\psi_2\\cos((E_2 - E_1)t/\\hbar)]$ (real $\\psi$\'s): it sloshes at $(E_2 - E_1)/\\hbar$, so the state is not stationary. Each measurement gives $E_1$ or $E_2$, each with probability $\\tfrac12$; the average is $(E_1 + E_2)/2$, but that value itself never turns up.',
      trap: 'The expectation value is an average over many measurements, not a possible result.' },
    { id: 'sch-021', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'superposition', unit: '$E_1$',
      q: 'A particle in an infinite well is in the normalised state $\\psi = \\sqrt{1/3}\\,\\psi_1 + \\sqrt{2/3}\\,\\psi_2$. Its expectation value of energy, in units of the ground-state energy $E_1$, is ______.',
      answer: 3, tol: 0, calc: () => 1 / 3 * 1 + 2 / 3 * 4,
      sol: '$\\langle E\\rangle = |c_1|^2E_1 + |c_2|^2E_2 = \\tfrac13E_1 + \\tfrac23(4E_1) = \\tfrac13E_1 + \\tfrac83E_1 = 3E_1$.',
      trap: 'Use the squares of the coefficients (probabilities), not the coefficients themselves.' },
    { id: 'sch-022', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'parity',
      q: 'A particle moves in a potential symmetric about $x = 0$, $V(-x) = V(x)$, with bound states labelled from the ground state upwards. The third-lowest bound state is',
      options: ['even', 'odd', 'neither even nor odd', 'even or odd depending on the depth of the well'], answer: 0,
      sol: 'In a symmetric potential each non-degenerate bound state has definite parity, and they alternate starting with an even ground state (no nodes). Ground: even; second: odd (one node); third: even (two nodes).',
      trap: 'Counting from $n = 0$ or $n = 1$ does not matter here: the third state up has two nodes and is even.' },
    { id: 'sch-023', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'expectation values',
      q: 'A particle is in a bound stationary state whose wavefunction $\\psi(x)$ is real. Its expectation value of momentum is',
      options: ['$\\hbar k$', '$\\sqrt{2mE}$', 'positive or negative depending on the state', 'zero'], answer: 3,
      sol: '$\\langle p\\rangle = -i\\hbar\\int\\psi\\,\\psi\'dx = -i\\hbar[\\psi^2/2]_{-\\infty}^{\\infty} = 0$ for a real, normalisable $\\psi$. Physically, the particle is equally likely to move either way.',
      trap: '$\\langle p\\rangle = 0$ does not mean $\\langle p^2\\rangle = 0$: the particle still has kinetic energy.' },
    { id: 'sch-024', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'cubic box',
      q: 'For a particle in a cubic box, $E = E_0(n_x^2 + n_y^2 + n_z^2)$. How many different states have $E = 14E_0$?',
      options: ['$3$', '$1$', '$6$', '$4$'], answer: 2,
      sol: '$14 = 1 + 4 + 9$ only (check: $14$ cannot be written with any other three positive squares). The numbers $1, 2, 3$ can be given to $x, y, z$ in $3! = 6$ orders, so the level is 6-fold degenerate.',
      trap: 'When the three quantum numbers are all different there are 6 arrangements; with two equal, 3; all equal, 1.' },
    { id: 'sch-025', type: 'mcq', level: 3, exams: ['jam'], sub: 'cubic box',
      q: 'For a particle in a cubic box, the energy of the first excited level divided by the ground-state energy is',
      options: ['$2$', '$3$', '$4$', '$1.5$'], answer: 0,
      sol: 'Ground $(1,1,1)$: $3E_0$. Next: $(2,1,1)$ and its rearrangements, $6E_0$. Ratio $6/3 = 2$.',
      trap: '$4$ is the one-dimensional ratio $E_2/E_1$.' },
    { id: 'sch-026', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'step potential', format: 'statements',
      q: 'A particle of energy $E$ meets a potential step of height $V_0 > E$ (step from $x = 0$ to infinity). Which statements are correct?',
      options: ['The reflection coefficient is exactly 1.', '$\\psi$ is not zero just inside the step.', 'The probability current inside the step is zero.', 'Inside the step $\\psi$ oscillates with wave number $\\sqrt{2m(V_0 - E)}/\\hbar$.'], answer: [0, 1, 2],
      sol: 'Inside, $\\psi = Ce^{-\\kappa x}$: nonzero but decaying, not oscillating. A real exponential (times a constant phase) carries no current, $j \\propto \\text{Im}(\\psi^*\\psi\') = 0$. So nothing is transmitted to infinity and everything is reflected: $R = 1$, even though the particle spends some time inside the step.',
      trap: 'Penetrating the step is not the same as getting through it; for that you need a barrier of finite width.' },
    { id: 'sch-027', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'step potential', unit: 'nm',
      q: 'An electron of energy $E$ meets a step $0.50$ eV higher than $E$. With $\\hbar^2/(2m_e) = 0.0381$ eV nm$^2$, the penetration depth $1/\\kappa$ (where $\\psi$ falls to $1/e$) is ______ nm (to three decimal places).',
      answer: 0.276, tol: 0.003, calc: () => 1 / Math.sqrt(0.5 / H2M),
      sol: '$\\kappa = \\sqrt{(V_0 - E)/(\\hbar^2/2m)} = \\sqrt{0.50/0.0381} = 3.623$ nm$^{-1}$, so $1/\\kappa = 0.276$ nm, about two atomic spacings.',
      trap: 'The probability density $|\\psi|^2$ falls to $1/e$ in half that distance, $1/(2\\kappa)$.' },
    { id: 'sch-028', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'step potential',
      q: 'A beam of particles of energy $E$ meets an upward step of height $V_0 = \\tfrac34E$. The fraction of the beam reflected is ______ (to three decimal places).',
      answer: 0.111, tol: 0.002, calc: () => { const q = Math.sqrt(1 - 0.75); return ((1 - q) / (1 + q)) ** 2; },
      sol: '$k_1 \\propto \\sqrt E$, $k_2 \\propto \\sqrt{E - V_0} = \\sqrt{E/4}$, so $k_2/k_1 = 1/2$. $R = \\left(\\dfrac{k_1 - k_2}{k_1 + k_2}\\right)^2 = \\left(\\dfrac{1/2}{3/2}\\right)^2 = \\dfrac19 = 0.111$.',
      trap: 'The transmission coefficient is not $|C/A|^2$ but $(k_2/k_1)|C/A|^2$; computing $R$ first and using $T = 1 - R$ avoids that slip.' },

    // ---------- level 4 ----------
    { id: 'sch-029', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'finite well',
      q: 'An electron is in a finite square well of width $1.0$ nm and depth $3.0$ eV. With $\\hbar^2/(2m_e) = 0.0381$ eV nm$^2$, the number of bound states is ______.',
      answer: 3, tol: 0, calc: () => 1 + Math.floor((0.5 * Math.sqrt(3 / H2M)) / (Math.PI / 2)),
      sol: 'Define $z_0 = (a/2)\\sqrt{2mV_0}/\\hbar = 0.5\\sqrt{3.0/0.0381} = 0.5\\times8.87 = 4.44$. The even and odd solutions appear one after another each time $z_0$ passes a multiple of $\\pi/2$, with the first (even) one always present. Number of bound states $= 1 + \\lfloor z_0/(\\pi/2)\\rfloor = 1 + \\lfloor 2.83\\rfloor = 3$.',
      trap: 'Using the full width $a$ in place of $a/2$ in $z_0$ doubles the count.' },
    { id: 'sch-030', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'expectation values', unit: '$L$',
      q: 'For the ground state of an infinite well from $0$ to $L$, $\\langle x^2\\rangle = L^2\\left(\\dfrac13 - \\dfrac{1}{2\\pi^2}\\right)$. The position uncertainty $\\Delta x$ is ______ $L$ (to three decimal places).',
      answer: 0.181, tol: 0.002, calc: () => Math.sqrt(1 / 3 - 1 / (2 * Math.PI ** 2) - 0.25),
      sol: '$\\langle x\\rangle = L/2$. $\\Delta x^2 = \\langle x^2\\rangle - \\langle x\\rangle^2 = L^2(0.33333 - 0.05066 - 0.25) = 0.03267L^2$. $\\Delta x = 0.181L$. (With $\\Delta p = \\pi\\hbar/L$ this gives $\\Delta x\\Delta p = 0.568\\hbar > \\hbar/2$, as it must.)',
      trap: 'Forgetting to subtract $\\langle x\\rangle^2 = L^2/4$.' },
    { id: 'sch-031', type: 'nat', level: 4, exams: ['jam', 'gate', 'net'], sub: 'harmonic oscillator',
      q: 'In the ground state of a harmonic oscillator, $|\\psi_0|^2 \\propto e^{-x^2/x_0^2}$, where $x = \\pm x_0$ are the classical turning points at energy $\\tfrac12\\hbar\\omega$. The probability of finding the particle outside the classically allowed region is ______ (to three decimal places).',
      answer: 0.157, tol: 0.002, calc: () => 1 - 2 / Math.sqrt(Math.PI) * simpson((u) => Math.exp(-u * u), 0, 1),
      sol: 'With $u = x/x_0$, $P(|x| > x_0) = \\dfrac{\\int_{|u|>1}e^{-u^2}du}{\\int e^{-u^2}du} = 1 - \\text{erf}(1) = 1 - 0.8427 = 0.157$. (Check the turning point: $\\tfrac12m\\omega^2x_0^2 = \\tfrac12\\hbar\\omega$ gives $x_0^2 = \\hbar/m\\omega$, and $\\psi_0 \\propto e^{-m\\omega x^2/2\\hbar}$, so $|\\psi_0|^2 \\propto e^{-x^2/x_0^2}$.)',
      trap: 'Almost 16% of the time the particle is where classical physics says it can never be.' },
    { id: 'sch-032', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'delta well',
      q: 'A particle of mass $m$ moves in the attractive potential $V(x) = -\\alpha\\,\\delta(x)$ with $\\alpha > 0$. Its bound states are',
      options: ['infinitely many, with $E_n \\propto -1/n^2$', 'exactly one, with $E = -m\\alpha^2/(2\\hbar^2)$', 'exactly two, one even and one odd', 'none, because the well has zero width'], answer: 1,
      sol: 'Outside $x = 0$, $\\psi = Ae^{-\\kappa|x|}$. Integrating the Schrödinger equation across the origin gives a jump in slope: $\\Delta\\psi\' = -(2m\\alpha/\\hbar^2)\\psi(0)$, i.e. $-2\\kappa = -2m\\alpha/\\hbar^2$, so $\\kappa = m\\alpha/\\hbar^2$ and $E = -\\hbar^2\\kappa^2/2m = -m\\alpha^2/2\\hbar^2$. An odd state would vanish at the origin, feel no delta function, and so cannot be bound. Exactly one bound state.',
      trap: 'In one dimension any attractive well, however thin, binds at least one state.' },
    { id: 'sch-033', type: 'msq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'time evolution', format: 'statements',
      q: 'Which statements are correct for a particle with Hamiltonian $H = p^2/2m + V(x)$, with $V$ not depending on time?',
      options: ['$[x, p] = i\\hbar$.', '$\\langle H\\rangle$ does not change with time for any state.', '$d\\langle x\\rangle/dt = \\langle p\\rangle/m$.', 'In a stationary state $\\langle x\\rangle$ oscillates at angular frequency $E/\\hbar$.'], answer: [0, 1, 2],
      sol: 'First: canonical commutator. Second: $d\\langle A\\rangle/dt = (i/\\hbar)\\langle[H, A]\\rangle$ and $[H, H] = 0$. Third: $[H, x] = -i\\hbar p/m$, giving $d\\langle x\\rangle/dt = \\langle p\\rangle/m$ (Ehrenfest). Fourth: false; in a stationary state every such expectation value is constant.',
      trap: 'Only superpositions of different energies make expectation values move.' },
    { id: 'sch-034', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'step potential',
      q: 'Particles of energy $E = 2V_0$ meet an upward step of height $V_0$. The transmission coefficient is closest to',
      options: ['$0.50$', '$0.71$', '$0.97$', '$0.03$'], answer: 2,
      sol: '$k_2/k_1 = \\sqrt{(E - V_0)/E} = 1/\\sqrt2 = 0.707$. $T = 4k_1k_2/(k_1 + k_2)^2 = 4(0.707)/(1.707)^2 = 2.828/2.914 = 0.971$. Equivalently $R = (0.293/1.707)^2 = 0.029$ and $T = 1 - R$.',
      trap: '$0.71$ is $k_2/k_1$ and $0.50$ is $(k_2/k_1)^2$; neither is the transmission coefficient.' },
    { id: 'sch-035', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'correspondence',
      q: 'For an infinite square well, the fractional gap $(E_{n+1} - E_n)/E_n$ for large $n$',
      options: ['falls like $2/n$, so the levels look continuous at high energy', 'tends to $1$', 'grows like $n$', 'stays at $3$'], answer: 0,
      sol: '$(E_{n+1} - E_n)/E_n = [(n + 1)^2 - n^2]/n^2 = (2n + 1)/n^2 \\approx 2/n$. The absolute gap grows, but compared with the energy itself it shrinks, so at high $n$ the levels merge into the classical continuum (Bohr\'s correspondence principle).',
      trap: 'The gap $E_{n+1} - E_n$ itself grows with $n$; the question asks about the ratio.' },
    { id: 'sch-036', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'tunnelling',
      q: 'An electron and a proton with the same energy $E$ meet the same rectangular barrier ($V_0 > E$, width $a$, with $\\kappa a \\gg 1$ for both). Compared with the electron, the proton\'s transmission probability is',
      options: ['the same, because only $E$ and $V_0$ matter', 'larger, because the proton is heavier', 'larger by a factor $\\sqrt{m_p/m_e}$', 'far smaller, by roughly the factor $e^{-2\\kappa_ea(\\sqrt{m_p/m_e} - 1)}$'], answer: 3,
      sol: '$\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar \\propto \\sqrt m$. So $\\kappa_p = 43\\kappa_e$ and $T_p/T_e \\approx e^{-2a(\\kappa_p - \\kappa_e)} = e^{-2\\kappa_ea(\\sqrt{m_p/m_e} - 1)}$, which is tiny. Heavier particles tunnel far less.',
      trap: 'Mass enters through $\\kappa$, inside the exponential, so it has a huge effect.' },
    { id: 'sch-037', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'delta well', unit: 'meV',
      q: 'An electron is bound by the potential $V = -\\alpha\\,\\delta(x)$ with $\\alpha = 0.10$ eV nm. Using $E = -m\\alpha^2/(2\\hbar^2)$ and $\\hbar^2/(2m_e) = 0.0381$ eV nm$^2$, its binding energy is ______ meV (to one decimal place).',
      answer: 65.6, tol: 0.3, calc: () => 0.1 ** 2 / (4 * H2M) * 1000,
      sol: 'Rewrite with the given constant: $m\\alpha^2/(2\\hbar^2) = \\alpha^2/(4\\cdot\\hbar^2/2m) = 0.010/(4\\times0.0381) = 0.0656$ eV $= 65.6$ meV.',
      trap: '$m/(2\\hbar^2) = 1/(4\\cdot\\hbar^2/2m)$: the factor 4 is easy to get wrong.' },

    // ---------- level 5 ----------
    { id: 'sch-038', type: 'nat', level: 5, exams: ['gate', 'net', 'jam'], sub: 'sudden change',
      q: 'A particle is in the ground state of an infinite well $0 < x < L$. Suddenly the right wall is moved to $x = 2L$, too fast for the wavefunction to change. The probability that the particle is then found in the ground state of the new, wider well is ______ (to three decimal places).',
      answer: 0.360, tol: 0.002, calc: () => 32 / (9 * Math.PI ** 2),
      sol: 'Old state $\\psi = \\sqrt{2/L}\\sin(\\pi x/L)$ on $(0, L)$, zero beyond. New ground state $\\phi_1 = \\sqrt{1/L}\\sin(\\pi x/2L)$ on $(0, 2L)$. Overlap $c = \\int_0^L\\psi\\phi_1dx = \\dfrac{\\sqrt2}{L}\\int_0^L\\sin\\dfrac{\\pi x}{L}\\sin\\dfrac{\\pi x}{2L}dx$. With $u = \\pi x/L$: $c = \\dfrac{\\sqrt2}{\\pi}\\int_0^\\pi\\sin u\\sin\\dfrac u2du = \\dfrac{\\sqrt2}{\\pi}\\cdot\\dfrac43 = \\dfrac{4\\sqrt2}{3\\pi}$. Probability $|c|^2 = 32/(9\\pi^2) = 0.360$.',
      trap: 'The new ground state is normalised over the new width $2L$: its amplitude is $\\sqrt{1/L}$, not $\\sqrt{2/L}$.' },
    { id: 'sch-039', type: 'msq', level: 5, exams: ['gate', 'net', 'jam'], sub: 'finite well', format: 'statements',
      q: 'Compare a finite square well of depth $V_0$ and width $a$ with an infinite well of the same width. Which statements are correct?',
      options: ['In one dimension the finite well always has at least one bound state.', 'Measured from the bottom of the well, each bound-state energy of the finite well is lower than the matching level of the infinite well.', 'The number of bound states depends on $V_0$ and $a$ only through the combination $V_0a^2$ (for a given mass).', 'The finite-well wavefunctions vanish at the walls.'], answer: [0, 1, 2],
      sol: 'First: the even solution exists for any $z_0 > 0$. Second: the wave leaks into the walls, so it is effectively longer and its energy lower. Third: the count is set by $z_0 = (a/2)\\sqrt{2mV_0}/\\hbar$, which depends on $V_0a^2$. Fourth: false; at the walls $\\psi$ joins smoothly on to decaying exponentials.',
      trap: 'Only the infinite well forces $\\psi = 0$ at the walls.' },
    { id: 'sch-040', type: 'nat', level: 5, exams: ['gate', 'net', 'jam'], sub: 'tunnelling',
      q: 'An electron of energy $1.0$ eV meets a barrier of height $2.0$ eV and width $0.20$ nm. Use the exact result $T = \\left[1 + \\dfrac{V_0^2\\sinh^2(\\kappa a)}{4E(V_0 - E)}\\right]^{-1}$ with $\\hbar^2/(2m_e) = 0.0381$ eV nm$^2$. $T$ is ______ (to three decimal places).',
      answer: 0.404, tol: 0.003, calc: () => { const k = Math.sqrt(1 / H2M), s = Math.sinh(k * 0.2); return 1 / (1 + 4 * s * s / (4 * 1 * 1)); },
      sol: '$\\kappa = \\sqrt{1.0/0.0381} = 5.123$ nm$^{-1}$, $\\kappa a = 1.025$, $\\sinh(1.025) = 1.214$, $\\sinh^2 = 1.473$. The prefactor $V_0^2/[4E(V_0 - E)] = 4/(4\\times1\\times1) = 1$. $T = 1/(1 + 1.473) = 0.404$.',
      trap: 'Here $\\kappa a \\approx 1$, so the thick-barrier formula $e^{-2\\kappa a} = 0.129$ is badly wrong. Check $\\kappa a$ before using it.' },
    { id: 'sch-041', type: 'nat', level: 5, exams: ['gate', 'net', 'jam'], sub: 'expansion in eigenstates',
      q: 'A particle in an infinite well $0 < x < L$ has the normalised wavefunction $\\psi(x) = \\sqrt{30/L^5}\\,x(L - x)$. The probability that an energy measurement gives the ground-state energy $E_1$ is ______ (to three decimal places).',
      answer: 0.999, tol: 0.001, calc: () => 960 / Math.PI ** 6,
      sol: '$c_1 = \\int_0^L\\sqrt{2/L}\\sin(\\pi x/L)\\sqrt{30/L^5}\\,x(L - x)dx$. With $u = \\pi x/L$, $\\int_0^\\pi u(\\pi - u)\\sin u\\,du = 4$, so $c_1 = \\sqrt{60}\\cdot4/\\pi^3 = 8\\sqrt{15}/\\pi^3$. Probability $|c_1|^2 = 960/\\pi^6 = 0.9986$, about $0.999$. The parabola is almost exactly the sine.',
      trap: 'Even $n$ give zero (the parabola is even about the centre); the remaining $0.14\\%$ is spread over $n = 3, 5, \\dots$' },
    { id: 'sch-042', type: 'mcq', level: 5, exams: ['gate', 'net', 'jam'], sub: 'harmonic oscillator',
      q: 'A harmonic oscillator is in the state $\\psi = (\\psi_0 + \\psi_1)/\\sqrt2$ at $t = 0$, with $\\psi_0, \\psi_1$ the two lowest real eigenfunctions. Which describes $\\langle x\\rangle(t)$?',
      options: ['It is zero at all times.', 'It oscillates at angular frequency $\\tfrac32\\omega$.', 'It oscillates at angular frequency $\\omega$, like the classical oscillator.', 'It decays to zero.'], answer: 2,
      sol: 'The diagonal terms $\\langle\\psi_0|x|\\psi_0\\rangle$ and $\\langle\\psi_1|x|\\psi_1\\rangle$ vanish by parity. The two cross terms, each with weight $\\tfrac12$, add to $\\langle x\\rangle(t) = \\text{Re}\\left[\\langle\\psi_0|x|\\psi_1\\rangle e^{-i(E_1 - E_0)t/\\hbar}\\right]$. $E_1 - E_0 = \\hbar\\omega$ and $\\langle\\psi_0|x|\\psi_1\\rangle = \\sqrt{\\hbar/2m\\omega} \\ne 0$, so $\\langle x\\rangle = \\sqrt{\\hbar/2m\\omega}\\cos\\omega t$: classical motion at $\\omega$.',
      trap: 'The frequency comes from the difference of the two energies, not from either energy alone ($\\tfrac32\\omega$ is $E_1/\\hbar$).' },
    ...more2,
    ...r4.items,
  ],

  gens: [
    { id: 'sch-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'infinite well', format: 'comparison',
      make(r) {
        const [wn, wd] = Q5.choose(r, [[2, 1], [3, 1], [1, 2], [3, 2]]), [mn, md, mname] = Q5.choose(r, [[1, 1, 'the same particle'], [4, 1, 'a particle 4 times as heavy'], [2, 1, 'a particle twice as heavy'], [1, 2, 'a particle half as heavy']]);
        const right = q5frac(md * wd * wd, mn * wn * wn);
        const o = Q5.mcqOptions(r, right, [q5frac(mn * wn * wn, md * wd * wd), q5frac(md * wd, mn * wn), q5frac(wd * wd, wn * wn), q5frac(md * wd * wd * 2, mn * wn * wn), q5frac(md * wd * wd, 2 * mn * wn * wn), q5frac(md * wn, mn * wd)], (s) => `$${s}$`);
        return { q: `A particle sits in the ground state of a one-dimensional infinite well. The well is made $${q5frac(wn, wd)}$ times as wide and filled instead with ${mname}. The new ground-state energy divided by the old one is`, ...o,
          sol: `$E_1 = \\dfrac{\\pi^2\\hbar^2}{2mL^2} \\propto \\dfrac1{mL^2}$. The ratio is $\\dfrac{1}{(${q5frac(mn, md)})(${q5frac(wn, wd)})^2} = ${right}$.`,
          trap: 'The energy falls as the square of the width, and also falls with mass.' };
      } },
    { id: 'sch-t22', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'acceptable wavefunctions', format: 'statements',
      make(r) {
        const not = r() < 0.5;
        const good = ['$e^{-x^2}$', '$x\\,e^{-x^2}$', '$\\dfrac{1}{1 + x^2}$', '$\\operatorname{sech} x$', '$\\dfrac{1}{\\sqrt{1 + x^2}}$'];
        const bad = ['$e^{x}$', '$\\sin x$', '$x$', '$1/x$', '$\\dfrac{1}{(1 + x^2)^{1/4}}$'];
        const o = not ? q5msq(r, bad, good) : q5msq(r, good, bad);
        return { q: `Which of these functions are ${not ? '<b>NOT</b> ' : ''}square-integrable over the whole real line ($-\\infty < x < \\infty$), so that they could be normalised as wavefunctions?`, ...o,
          sol: 'Need $\\int_{-\\infty}^{\\infty}|\\psi|^2dx$ finite. Gaussians and $\\operatorname{sech} x$ fall off exponentially: fine. $1/(1+x^2)$ squared goes as $x^{-4}$: fine. $1/\\sqrt{1+x^2}$ squared is $1/(1+x^2)$, whose integral is $\\pi$: fine, although it decays slowly. $(1+x^2)^{-1/4}$ squared is $(1+x^2)^{-1/2} \\sim 1/|x|$: the integral diverges logarithmically. $e^x$ blows up, $\\sin x$ and $x$ do not decay, and $1/x$ squared diverges at $x = 0$.',
          trap: '$|\\psi|^2$ must fall faster than $1/|x|$; $1/\\sqrt{1+x^2}$ just makes it.' };
      } },
    { id: 'sch-t23', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'expectation values', unit: 'nm',
      make(r) {
        const n = Q5.int(r, 1, 5), L = Q5.pick(r, 0.5, 5, 0.5);
        const dx = L * Math.sqrt(1 / 12 - 1 / (2 * Math.PI ** 2 * n * n));
        return { q: `A particle is in the stationary state $n = ${n}$ of an infinite well from $x = 0$ to $x = ${L}$ nm. The uncertainty $\\Delta x = \\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2}$ is ______ nm (to three decimal places).`,
          answer: Q5.round(dx, 3), tol: 0.002, n, L,
          sol: `With $\\psi_n = \\sqrt{2/L}\\sin(n\\pi x/L)$: $\\langle x\\rangle = L/2$ by symmetry and $\\langle x^2\\rangle = L^2\\left(\\dfrac13 - \\dfrac{1}{2n^2\\pi^2}\\right)$. So $\\Delta x = L\\sqrt{\\dfrac1{12} - \\dfrac{1}{2n^2\\pi^2}} = ${L}\\times${Q5.round(dx / L, 4)} = ${Q5.round(dx, 3)}$ nm. As $n$ grows it tends to the classical $L/\\sqrt{12}$.`,
          trap: '$\\langle x^2\\rangle$ is not $\\langle x\\rangle^2$; the difference tends to $L^2/12$, the value for a uniform spread.' };
      },
      verify: (p) => { const N = 400, h = p.L / N; let m1 = 0, m2 = 0; for (let i = 0; i <= N; i++) { const x = i * h, w = i === 0 || i === N ? 1 : i % 2 ? 4 : 2, d = 2 / p.L * Math.sin(p.n * Math.PI * x / p.L) ** 2; m1 += w * x * d; m2 += w * x * x * d; } m1 *= h / 3; m2 *= h / 3; return Math.sqrt(m2 - m1 * m1); } },
    { id: 'sch-t24', type: 'mcq', level: 2, exams: ['jam'], sub: 'stationary states', format: 'graph',
      make(r) {
        const k = Q5.int(r, 1, 4), box = r() < 0.5;
        const s = box ? (j) => `$${(j + 1) ** 2 === 1 ? '' : (j + 1) ** 2}E_1$` : (j) => `$${q5frac(2 * j + 1, 2)}\\hbar\\omega$`;
        const o = Q5.mcqOptions(r, s(k), [s(k - 1), s(k + 1), box ? `$${2 * (k + 1)}E_1$` : `$${k === 1 ? '' : k}\\hbar\\omega$`, box ? `$${k + 1}E_1$` : `$${k + 1}\\hbar\\omega$`]);
        return { q: `A sketch of an energy eigenfunction ${box ? 'of a particle in a one-dimensional infinite well' : 'of a one-dimensional harmonic oscillator'} crosses zero $${k}$ time${k > 1 ? 's' : ''} (not counting ${box ? 'the walls' : 'the tails at infinity'}). Its energy is ${box ? '(with $E_1$ the ground-state energy)' : ''}`, ...o,
          sol: box ? `The $n$-th state has $n - 1$ interior nodes, so $n = ${k + 1}$ and $E = n^2E_1 = ${(k + 1) ** 2}E_1$.` : `The state $n$ (counting from $n = 0$) has $n$ nodes, so $n = ${k}$ and $E = (n + \\tfrac12)\\hbar\\omega = ${q5frac(2 * k + 1, 2)}\\hbar\\omega$.`,
          trap: 'Node counting: the ground state has no nodes, so $k$ nodes means the $(k+1)$-th state.' };
      } },
    { id: 'sch-t25', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'step potential',
      make(r) {
        const E = Q5.int(r, 1, 20), V0 = Q5.int(r, 1, 20);
        const k1 = Math.sqrt(E), k2 = Math.sqrt(E + V0), T = 4 * k1 * k2 / (k1 + k2) ** 2;
        return { q: `Particles of kinetic energy $${E}$ eV move towards a step where the potential energy suddenly drops by $${V0}$ eV. The fraction transmitted past the step is ______ (to four decimal places).`,
          answer: Q5.round(T, 4), tol: 0.0002, E, V0,
          sol: `$k \\propto \\sqrt{\\text{kinetic energy}}$: $k_1 \\propto \\sqrt{${E}}$, $k_2 \\propto \\sqrt{${E + V0}}$. Matching $\\psi$ and $\\psi'$ at the step: $T = \\dfrac{4k_1k_2}{(k_1 + k_2)^2} = ${Q5.round(T, 4)}$. Classically every particle would pass; quantum mechanically a drop also reflects.`,
          trap: 'Waves reflect at any sudden change of $k$, downward steps included.' };
      },
      verify: (p) => { const a = Math.sqrt(p.E), b = Math.sqrt(p.E + p.V0); return 1 - ((a - b) / (a + b)) ** 2; } },
    { id: 'sch-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'infinite well',
      make(r) {
        const L = choose(r, [0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2]), n = int(r, 1, 4);
        const E = n * n * BOX / (L * L);
        return { q: `Taking $h^2/(8m_e) = 0.376$ eV nm$^2$, the energy of the $n = ${n}$ level of an electron in a one-dimensional infinite well of width $${L}$ nm is ______ eV (to three significant figures).`,
          answer: +E.toPrecision(3), tol: E * 0.006, unit: 'eV', n, L,
          sol: `$E_n = n^2h^2/(8mL^2) = ${n * n}\\times0.376/${L}^2 = ${+E.toPrecision(4)}$ eV.`,
          trap: 'The energy goes as $n^2$ and as $1/L^2$.' };
      },
      verify: (p) => p.n * p.n * BOX / (p.L * p.L) },
    { id: 'sch-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'infinite well',
      make(r) {
        const L = choose(r, [0.5, 0.8, 1, 1.5, 2, 2.5, 3]), lo = int(r, 1, 3), hi = lo + int(r, 1, 2);
        const dE = (hi * hi - lo * lo) * BOX / (L * L), lam = 1240 / dE;
        return { q: `An electron in an infinite well of width $${L}$ nm drops from $n = ${hi}$ to $n = ${lo}$. With $h^2/(8m_e) = 0.376$ eV nm$^2$ and $hc = 1240$ eV nm, the emitted photon's wavelength is ______ nm (to three significant figures).`,
          answer: +lam.toPrecision(3), tol: lam * 0.006, unit: 'nm', L, lo, hi,
          sol: `$\\Delta E = (${hi * hi} - ${lo * lo})(0.376)/${L}^2 = ${+dE.toPrecision(4)}$ eV. $\\lambda = 1240/\\Delta E = ${+lam.toPrecision(4)}$ nm.`,
          trap: 'Use the difference of the two levels, $(n_i^2 - n_f^2)E_1$.' };
      },
      verify: (p) => 1240 / ((p.hi ** 2 - p.lo ** 2) * BOX / p.L ** 2) },
    { id: 'sch-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'harmonic oscillator',
      make(r) {
        const hw = choose(r, [0.05, 0.1, 0.12, 0.2, 0.25, 0.3, 0.4, 0.5]), n = int(r, 0, 5);
        const E = (n + 0.5) * hw;
        const word = ['ground state', 'first excited state', 'second excited state', 'third excited state', 'fourth excited state', 'fifth excited state'][n];
        return { q: `A quantum harmonic oscillator has $\\hbar\\omega = ${hw}$ eV. The energy of its ${word} is ______ eV (to three decimal places).`,
          answer: round(E, 3), tol: 0.001, unit: 'eV', hw, n,
          sol: `The ${word} has $n = ${n}$ (counting from $n = 0$). $E = (${n} + \\tfrac12)(${hw}) = ${round(E, 3)}$ eV.`,
          trap: 'Remember the zero-point term $\\tfrac12\\hbar\\omega$, and that the ground state is $n = 0$.' };
      },
      verify: (p) => (p.n + 0.5) * p.hw },
    { id: 'sch-g04', type: 'nat', level: 3, exams: ['jam'], sub: 'probabilities',
      make(r) {
        const n = int(r, 1, 3);
        const [a, b, aT, bT] = choose(r, [[0, 0.25, '0', 'L/4'], [0, 1 / 3, '0', 'L/3'], [0.25, 0.75, 'L/4', '3L/4'], [1 / 3, 2 / 3, 'L/3', '2L/3'], [0, 0.5, '0', 'L/2'], [0.5, 0.75, 'L/2', '3L/4']]);
        const P = boxP(n, a, b);
        return { q: `A particle is in the $n = ${n}$ stationary state of an infinite well from $0$ to $L$. The probability of finding it between $x = ${aT}$ and $x = ${bT}$ is ______ (to three decimal places).`,
          answer: round(P, 3), tol: 0.002, n, a, b,
          sol: `$P = \\dfrac2L\\int\\sin^2\\dfrac{n\\pi x}{L}dx = \\left[\\dfrac xL - \\dfrac{1}{2n\\pi}\\sin\\dfrac{2n\\pi x}{L}\\right]_{${aT}}^{${bT}} = ${round(b - a, 4)} - \\dfrac{1}{${2 * n}\\pi}(${round(Math.sin(2 * n * Math.PI * b), 4)} - ${round(Math.sin(2 * n * Math.PI * a), 4)}) = ${round(P, 3)}$.`,
          trap: 'The classical answer is just the fraction of the length; quantum states crowd into their antinodes.' };
      },
      verify: (p) => simpson((x) => 2 * Math.sin(p.n * Math.PI * x) ** 2, p.a, p.b) },
    { id: 'sch-g05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'step potential',
      make(r) {
        const ratio = choose(r, [1.1, 1.2, 1.25, 1.5, 2, 3, 4, 5]); // E / V0
        const q = Math.sqrt(1 - 1 / ratio), R = ((1 - q) / (1 + q)) ** 2;
        return { q: `Particles with energy $E = ${ratio}V_0$ meet an upward potential step of height $V_0$. The reflection coefficient is ______ (to three decimal places).`,
          answer: round(R, 3), tol: 0.001, ratio,
          sol: `$k_2/k_1 = \\sqrt{(E - V_0)/E} = \\sqrt{1 - 1/${ratio}} = ${round(q, 4)}$. $R = \\left(\\dfrac{1 - ${round(q, 4)}}{1 + ${round(q, 4)}}\\right)^2 = ${round(R, 3)}$.`,
          trap: 'Classically $R = 0$ whenever $E > V_0$.' };
      },
      verify: (p) => { const k = Math.sqrt(1 - 1 / p.ratio); return 1 - 4 * k / (1 + k) ** 2; } },
    { id: 'sch-g06', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'tunnelling',
      make(r) {
        const E = choose(r, [0.5, 1, 1.5, 2]), V = E + choose(r, [1, 2, 3, 4]), a = choose(r, [0.3, 0.4, 0.5, 0.6, 0.8]);
        const k = Math.sqrt((V - E) / H2M), T = Math.exp(-2 * k * a);
        const ex = Math.floor(Math.log10(T)), m = T / 10 ** ex;
        return { q: `An electron of energy $${E}$ eV meets a barrier of height $${V}$ eV and width $${a}$ nm. Using $T \\approx e^{-2\\kappa a}$ and $\\hbar^2/(2m_e) = 0.0381$ eV nm$^2$, $T = x\\times10^{${ex}}$. Find $x$ (to two decimal places).`,
          answer: round(m, 2), tol: Math.max(0.01, round(m * 0.01, 2)), E, V, a, ex,
          sol: `$\\kappa = \\sqrt{(${V} - ${E})/0.0381} = ${round(k, 3)}$ nm$^{-1}$, $2\\kappa a = ${round(2 * k * a, 3)}$, $T = e^{-${round(2 * k * a, 3)}} = ${round(m, 3)}\\times10^{${ex}}$.`,
          trap: 'Use $V_0 - E$ in $\\kappa$, and remember the factor 2 in the exponent.' };
      },
      verify: (p) => Math.exp(-2 * Math.sqrt((p.V - p.E) / H2M) * p.a) / 10 ** p.ex },
    { id: 'sch-g07', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'cubic box',
      make(r) {
        const S = choose(r, [6, 9, 11, 12, 14, 17, 18, 19, 21, 22, 24, 26, 27]);
        let g = 0; for (let a = 1; a < 6; a++) for (let b = 1; b < 6; b++) for (let c = 1; c < 6; c++) if (a * a + b * b + c * c === S) g++;
        const o = mcqOptions(r, g, [1, 2, 3, 4, 6, 9].filter((v) => v !== g).sort(() => 0).slice(0, 3), (v) => `$${v}$`);
        return { q: `For a particle in a cubic box, $E = E_0(n_x^2 + n_y^2 + n_z^2)$ with $n_x, n_y, n_z = 1, 2, 3, \\dots$ How many states have $E = ${S}E_0$?`, ...o,
          sol: `List the triples of positive integers whose squares add to $${S}$, counting each order separately (e.g. $(2,1,1)$, $(1,2,1)$, $(1,1,2)$ are three states). There are $${g}$.`,
          trap: 'Different orders of the same numbers are different states; all-different triples give 6, two equal give 3, all equal give 1.' };
      } },
    { id: 'sch-g08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'superposition',
      make(r) {
        const n1 = 1, n2 = int(r, 2, 4), p1 = choose(r, [0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]);
        const E = p1 * n1 * n1 + (1 - p1) * n2 * n2;
        return { q: `A particle in an infinite well is in a superposition of $\\psi_1$ and $\\psi_${n2}$ only, with probability $${p1}$ of being found in $\\psi_1$. Its expectation value of energy is ______ times $E_1$ (to two decimal places).`,
          answer: round(E, 2), tol: 0.01, unit: '$E_1$', p1, n2,
          sol: `$\\langle E\\rangle = ${p1}E_1 + ${round(1 - p1, 2)}\\times${n2 * n2}E_1 = ${round(E, 2)}E_1$.`,
          trap: 'Weight each energy by its probability, and remember $E_n = n^2E_1$.' };
      },
      verify: (p) => p.p1 + (1 - p.p1) * p.n2 ** 2 },
    ...r4.gens,
  ],
};
