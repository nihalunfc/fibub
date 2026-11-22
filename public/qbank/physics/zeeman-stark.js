// Zeeman and Stark effects: normal and anomalous Zeeman patterns, the Landé g factor, polarisation of the components,
// the Paschen-Back regime, electron spin resonance, the linear Stark effect of hydrogen and the quadratic Stark effect.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './zeeman-stark.more.gen.js';
import more2 from './zeeman-stark.more2.gen.js';
import r4 from './zeeman-stark.r4.gen.js';

const MUB = 5.7884e-5;       // Bohr magneton, eV/T
const MUB_GHZ = 13.9962;     // mu_B/h, GHz/T
const MUB_CM = 0.46686;      // mu_B/hc, cm^-1/T
const EA0 = 5.29177e-11;     // e a0 in eV per (V/m)
const ALPHA_H = 4.5 * 1.11265e-10 * (5.29177e-11) ** 3;  // polarisability of H, C m^2/V
const LT = ['S', 'P', 'D', 'F', 'G', 'H', 'I', 'K'];
const fr = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
const sym = (S, L, J) => `^{${Math.round(2 * S + 1)}}${LT[L]}_{${fr(J)}}`;
const gJ = (S, L, J) => (J === 0 ? 0 : 1 + (J * (J + 1) + S * (S + 1) - L * (L + 1)) / (2 * J * (J + 1)));
const Ms = (J) => { const o = []; for (let m = -J; m <= J + 1e-9; m++) o.push(m); return o; };
/** Zeeman components (in units of mu_B B) of the E1 transition between levels u and l (each [S, L, J]). */
function comps(u, l) {
  const gu = gJ(...u), gl = gJ(...l), out = [];
  for (const mu of Ms(u[2])) for (const ml of Ms(l[2])) {
    if (Math.abs(mu - ml) > 1) continue;
    if (u[2] === l[2] && mu === 0 && ml === 0) continue;
    out.push(gu * mu - gl * ml);
  }
  return out;
}
const distinct = (a) => new Set(a.map((x) => Math.round(x * 1e6))).size;
const LEVELS = [[0.5, 0, 0.5], [0.5, 1, 0.5], [0.5, 1, 1.5], [0.5, 2, 1.5], [0.5, 2, 2.5], [0, 0, 0], [0, 1, 1], [0, 2, 2], [1, 0, 1], [1, 1, 0], [1, 1, 1], [1, 1, 2], [1, 2, 1], [1, 2, 2], [1, 2, 3], [1.5, 0, 1.5], [1.5, 2, 0.5], [2, 2, 4], [2, 2, 0], [2.5, 0, 2.5], [1.5, 3, 1.5], [1, 3, 2]];

export default {
  topic: 'zeeman-stark',
  items: [
    // ---------- level 1 ----------
    { id: 'zst-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'normal zeeman',
      q: 'The normal Zeeman effect (a symmetric triplet with spacing $\\mu_B B$) is seen for transitions between',
      options: ['singlet levels ($S = 0$)', 'doublet levels ($S = 1/2$)', 'any two levels with the same $J$', 'levels with $L = 0$ only'], answer: 0,
      sol: 'With $S = 0$, $g_J = 1$ for every level, so each level shifts by $\\mu_B B M$ and every allowed line is displaced by $\\mu_B B\\,\\Delta M$ with $\\Delta M = 0, \\pm1$: three lines. With spin, $g_J$ differs between the levels and the pattern is "anomalous".',
      trap: 'Historically "normal" because classical (Lorentz) theory explained it; it is actually the special case.' },
    { id: 'zst-002', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'normal zeeman',
      q: 'A singlet-singlet line (for example $^1D_2\\to{}^1P_1$) placed in a weak magnetic field splits into how many distinct lines? ______',
      answer: 3, tol: 0,
      sol: 'Both levels have $g = 1$. A component $M_u\\to M_l$ is shifted by $\\mu_B B(M_u - M_l) = \\mu_B B\\,\\Delta M$, and $\\Delta M$ can only be $-1, 0, +1$. Many transitions, but only three energies.',
      trap: 'Counting the 9 allowed $M_u\\to M_l$ transitions gives the number of components, not the number of distinct lines.' },
    { id: 'zst-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'lande g',
      q: 'The Landé $g$ factor of a $^2S_{1/2}$ level (taking $g_s = 2$) is',
      options: ['$1$', '$2$', '$2/3$', '$4/3$'], answer: 1,
      sol: '$g_J = 1 + \\dfrac{J(J+1) + S(S+1) - L(L+1)}{2J(J+1)} = 1 + \\dfrac{3/4 + 3/4 - 0}{3/2} = 2$. With $L = 0$ the moment is pure spin.',
      trap: '$g = 1$ is the orbital value; an $S$ level has no orbital moment.' },
    { id: 'zst-004', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'zeeman energy',
      q: 'A level with $g_J = 1$ is placed in a field of 2.0 T. The shift of its $M_J = +1$ sublevel is ______ $\\mu$eV (to one decimal place). Use $\\mu_B = 5.788\\times10^{-5}$ eV/T.',
      answer: 115.8, tol: 0.2, unit: 'μeV', calc: () => 5.788e-5 * 2 * 1e6,
      sol: '$\\Delta E = g_J\\mu_B B M_J = 1\\times5.788\\times10^{-5}\\times2.0\\times1 = 1.158\\times10^{-4}$ eV $= 115.8\\,\\mu$eV.',
      trap: 'The shift is tiny compared with optical photon energies (eV), which is why high resolution is needed.' },
    { id: 'zst-005', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'stark effect',
      q: 'Which statements about the Stark effect are correct?',
      options: ['Excited states of hydrogen show a linear Stark effect because states of opposite parity ($2s$, $2p$) are degenerate', 'The hydrogen ground state shows only a quadratic Stark effect', 'Ground states of alkali atoms show a quadratic Stark effect', 'The hydrogen $1s$ state has a linear Stark shift'], answer: [0, 1, 2],
      sol: 'A linear shift needs a non-zero $\\langle e\\vec E\\cdot\\vec r\\rangle$ within a degenerate level, which needs degenerate states of opposite parity. Hydrogen\'s $l$-degeneracy provides that for $n \\ge 2$. Non-degenerate states (H $1s$, alkali ground states) have definite parity, so the first-order shift vanishes and only the second-order (quadratic) shift remains.',
      trap: 'An atom in a non-degenerate state has no permanent electric dipole moment.' },
    { id: 'zst-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'zeeman energy',
      q: 'In a weak magnetic field, a level with $J = 2$ and $g_J \\ne 0$ splits into',
      options: ['2 sublevels', '3 sublevels', '5 sublevels', '4 sublevels'], answer: 2,
      sol: 'The sublevels are $M_J = -2, -1, 0, 1, 2$: $2J + 1 = 5$, equally spaced by $g_J\\mu_B B$.',
      trap: '$2J + 1$, not $J + 1$ or $2J$.' },

    // ---------- level 2 ----------
    { id: 'zst-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'normal zeeman',
      q: 'In the normal Zeeman effect at $B = 0.50$ T, the frequency separation between adjacent components is ______ GHz (to two decimal places). Use $\\mu_B/h = 14.00$ GHz/T.',
      answer: 7.00, tol: 0.02, unit: 'GHz', calc: () => 14.0 * 0.5,
      sol: '$\\Delta\\nu = \\mu_B B/h = eB/4\\pi m_e = 14.00\\times0.50 = 7.00$ GHz. (This is the Larmor frequency.)',
      trap: 'Using $eB/2\\pi m_e$ (the cyclotron frequency) gives twice the answer.' },
    { id: 'zst-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'lande g',
      q: 'The Landé $g$ factor of a $^2P_{1/2}$ level is',
      options: ['$4/3$', '$2$', '$1$', '$2/3$'], answer: 3,
      sol: '$g = 1 + \\dfrac{\\tfrac34 + \\tfrac34 - 2}{2\\times\\tfrac34} = 1 + \\dfrac{-1/2}{3/2} = 2/3$.',
      trap: '$4/3$ belongs to $^2P_{3/2}$.' },
    { id: 'zst-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'lande g',
      q: 'The Landé $g$ factor of a $^3P_1$ level is ______ (to two decimal places).',
      answer: 1.5, tol: 0.01, calc: () => 1 + (2 + 2 - 2) / 4,
      sol: '$S = 1$, $L = 1$, $J = 1$: $g = 1 + \\dfrac{2 + 2 - 2}{2\\times2} = 1.5$.',
      trap: 'With $S = L$, the $S(S+1)$ and $L(L+1)$ cancel, leaving $g = 1 + \\tfrac12 = 1.5$ for any $J \\ne 0$.' },
    { id: 'zst-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'anomalous zeeman',
      q: 'In a weak magnetic field the sodium $D_1$ line ($^2P_{1/2}\\to{}^2S_{1/2}$) and $D_2$ line ($^2P_{3/2}\\to{}^2S_{1/2}$) split into',
      options: ['4 and 6 lines', '3 and 3 lines', '6 and 4 lines', '2 and 4 lines'], answer: 0,
      sol: 'All $M$ transitions with $\\Delta M = 0, \\pm1$ have different energies because $g$ differs between the levels. $D_1$: $2\\times2$ sublevel pairs, all allowed: 4 lines at $\\pm\\tfrac23$, $\\pm\\tfrac43$ (units of $\\mu_BB$). $D_2$: 8 pairs minus 2 with $|\\Delta M| = 2$: 6 lines at $\\pm\\tfrac13, \\pm1, \\pm\\tfrac53$.',
      trap: 'The $3/2\\to-1/2$ and $-3/2\\to1/2$ pairs have $|\\Delta M| = 2$ and do not appear.' },
    { id: 'zst-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'polarisation',
      q: 'A normal Zeeman triplet is viewed along the direction of the magnetic field (longitudinal view). One sees',
      options: ['three lines, all linearly polarised', 'two lines, circularly polarised in opposite senses; the central line is absent', 'only the central line, linearly polarised', 'three lines, the central one circularly polarised'], answer: 1,
      sol: 'The $\\Delta M = 0$ ($\\pi$) component radiates like a dipole oscillating along $\\vec B$, which emits nothing along its own axis. The $\\Delta M = \\pm1$ ($\\sigma$) components are rotating dipoles in the plane perpendicular to $\\vec B$; seen along $\\vec B$ they are circularly polarised, opposite senses.',
      trap: 'In the transverse view all three appear, linearly polarised ($\\pi$ parallel to $\\vec B$, $\\sigma$ perpendicular).' },
    { id: 'zst-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'normal zeeman',
      q: 'The red cadmium line at 643.8 nm is a singlet line. In a 1.5 T field the wavelength separation between adjacent Zeeman components is ______ pm (to one decimal place). Use $\\mu_B/hc = 0.4669$ cm$^{-1}$/T.',
      answer: 29.0, tol: 0.2, unit: 'pm', calc: () => (643.8e-7) ** 2 * 0.4669 * 1.5 * 1e10,
      sol: '$\\Delta\\tilde\\nu = 0.4669\\times1.5 = 0.7004$ cm$^{-1}$. $\\Delta\\lambda = \\lambda^2\\Delta\\tilde\\nu = (6.438\\times10^{-5}\\text{ cm})^2\\times0.7004$ cm$^{-1}$ $= 2.903\\times10^{-9}$ cm $= 0.0290$ nm $= 29.0$ pm.',
      trap: 'Keep $\\lambda$ in cm when $\\tilde\\nu$ is in cm$^{-1}$; convert to pm only at the end.' },
    { id: 'zst-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'paschen-back',
      q: 'Which statements about the Paschen-Back effect are correct?',
      options: ['It occurs when $\\mu_B B$ is much larger than the fine-structure splitting', 'In it $m_l$ and $m_s$ are (approximately) good quantum numbers', 'The line pattern resembles the normal Zeeman triplet', '$J$ remains a good quantum number'], answer: [0, 1, 2],
      sol: 'When the Zeeman energy beats the spin-orbit energy, $\\vec L$ and $\\vec S$ precess independently about $\\vec B$; $J$ is no longer good. Energies $\\mu_BB(m_l + 2m_s)$; with $\\Delta m_s = 0$ and $\\Delta m_l = 0, \\pm1$, the shifts are $\\mu_BB\\Delta m_l$: a triplet (each line split slightly by residual spin-orbit).',
      trap: 'Only $M_J = m_l + m_s$ survives at every field strength; $J$ does not.' },
    { id: 'zst-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'esr',
      q: 'An X-band ESR spectrometer works with free radicals of $g = 2.0023$ at $B = 0.340$ T. The resonance frequency is ______ GHz (to two decimal places). Use $\\mu_B/h = 13.996$ GHz/T.',
      answer: 9.53, tol: 0.02, unit: 'GHz', calc: () => 2.0023 * 13.996 * 0.34,
      sol: '$h\\nu = g\\mu_BB$ for $\\Delta M_S = \\pm1$: $\\nu = 2.0023\\times13.996\\times0.340 = 9.53$ GHz.',
      trap: 'Forgetting $g$ gives 4.76 GHz.' },
    { id: 'zst-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'linear stark',
      q: 'In a uniform electric field $E$, the $n = 2$ level of hydrogen (ignoring fine structure and spin) splits into',
      options: ['two levels, $\\pm 3ea_0E$', 'four levels, $\\pm3ea_0E$ and $\\pm ea_0E$', 'three levels: $+3ea_0E$, $-3ea_0E$ and an unshifted pair', 'five equally spaced levels'], answer: 2,
      sol: 'Only $2s$ and $2p_0$ are coupled by $eEz$ ($\\Delta m = 0$, opposite parity), with $\\langle 2s|z|2p_0\\rangle = -3a_0$. Diagonalising gives $\\pm3ea_0E$. $2p_{\\pm1}$ stay unshifted (a degenerate pair). In parabolic language: $\\Delta E = \\tfrac32 n(n_1 - n_2)ea_0E$.',
      trap: 'The unshifted states are $2p_{\\pm1}$, not $2s$.' },
    { id: 'zst-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'anomalous zeeman',
      q: 'The root cause of the anomalous Zeeman effect is that',
      options: ['the field is too weak to split the lines into a triplet', 'the nucleus has a magnetic moment', 'electric quadrupole transitions mix in', 'the spin $g$ factor ($\\approx 2$) differs from the orbital one (1), so the magnetic moment is not parallel to $\\vec J$ and $g_J$ varies from level to level'], answer: 3,
      sol: '$\\vec\\mu = -\\mu_B(\\vec L + 2\\vec S)/\\hbar$, not $\\propto \\vec J$. Only its component along $\\vec J$ survives the precession, giving $g_J$, which depends on $L, S, J$. Different $g$ values in the upper and lower levels give more than three lines.',
      trap: 'If $g_s$ were 1, every pattern would be normal.' },

    // ---------- level 3 ----------
    { id: 'zst-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'anomalous zeeman',
      q: 'In a 2.0 T field, the outermost components of the sodium $D_2$ line are shifted by $\\pm\\tfrac53\\mu_BB$ from the zero-field line. That shift is ______ cm$^{-1}$ (to three decimal places). Use $\\mu_B/hc = 0.4669$ cm$^{-1}$/T.',
      answer: 1.556, tol: 0.003, unit: 'cm⁻¹', calc: () => (5 / 3) * 0.4669 * 2,
      sol: 'The component $M = \\tfrac12\\to-\\tfrac12$: $g_uM_u - g_lM_l = \\tfrac43\\cdot\\tfrac12 - 2\\cdot(-\\tfrac12) = \\tfrac23 + 1 = \\tfrac53$. Shift $= \\tfrac53\\times0.4669\\times2.0 = 1.556$ cm$^{-1}$.',
      trap: 'The largest shift is not from $M_u = 3/2$ (that gives $2 - 1 = 1$).' },
    { id: 'zst-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'lande g',
      q: 'The Landé $g$ factor of a $^4D_{1/2}$ level is ______.',
      answer: 0, tol: 0.001,
      sol: '$S = 3/2$, $L = 2$, $J = 1/2$: $g = 1 + \\dfrac{\\tfrac34 + \\tfrac{15}{4} - 6}{2\\times\\tfrac34} = 1 + \\dfrac{-1.5}{1.5} = 0$. The spin and orbital moments cancel along $\\vec J$: this level is not split by a weak field at all.',
      trap: 'A non-zero $J$ does not guarantee a Zeeman splitting.' },
    { id: 'zst-019', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'anomalous zeeman',
      q: 'For the sodium $D_1$ line in a weak field $B$, which statements are correct?',
      options: ['It splits into four lines', 'The $\\pi$ components are shifted by $\\pm\\tfrac23\\mu_BB$', 'The $\\sigma$ components are shifted by $\\pm\\tfrac43\\mu_BB$', 'An undisplaced central line remains'], answer: [0, 1, 2],
      sol: '$g_u = 2/3$, $g_l = 2$. $\\pi$ ($\\Delta M = 0$): $\\pm(\\tfrac23 - 2)\\tfrac12 = \\mp\\tfrac23$. $\\sigma$: $\\tfrac23(\\tfrac12) - 2(-\\tfrac12) = \\tfrac43$ and its mirror. No component has zero shift.',
      trap: 'Only patterns with $g_u = g_l$ (or $M = 0\\to0$ components) have an undisplaced line.' },
    { id: 'zst-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'linear stark',
      q: 'Hydrogen atoms in $n = 2$ are placed in a field of $1.0\\times10^7$ V/m. The energy separation between the highest and lowest Stark components is ______ meV (to two decimal places). Use $a_0 = 5.292\\times10^{-11}$ m.',
      answer: 3.18, tol: 0.02, unit: 'meV', calc: () => 6 * 5.292e-11 * 1e7 * 1e3,
      sol: 'The components are at $\\pm3ea_0E$, so the spread is $6ea_0E$. In eV: $6\\times5.292\\times10^{-11}\\times10^7 = 3.18\\times10^{-3}$ eV $= 3.18$ meV.',
      trap: '$ea_0E$ in eV is just $a_0E$ with $a_0$ in metres and $E$ in V/m.' },
    { id: 'zst-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'quadratic stark',
      q: 'If the electric field on a ground-state hydrogen atom is tripled, its Stark shift becomes',
      options: ['9 times larger', '3 times larger', 'unchanged', '27 times larger'], answer: 0,
      sol: 'The ground state is non-degenerate, so the shift is second order: $\\Delta E = -\\tfrac12\\alpha E^2$. Tripling $E$ multiplies the shift by 9.',
      trap: 'Linear scaling applies only to the degenerate excited levels.' },
    { id: 'zst-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'anomalous zeeman',
      q: 'The line $^3S_1\\to{}^3P_0$ is observed in a weak field. The spacing between adjacent Zeeman components, in units of $\\mu_BB$, is ______.',
      answer: 2, tol: 0,
      sol: 'The lower level has $J = 0$: one sublevel, unshifted. The upper level $^3S_1$ has $g = 2$ and $M = -1, 0, 1$. Components are at $2M\\mu_BB$: three lines spaced by $2\\mu_BB$, twice the normal spacing.',
      trap: 'Three lines, but not the normal triplet: the spacing is set by $g = 2$.' },
    { id: 'zst-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'paschen-back',
      q: 'The sodium $3p$ fine-structure splitting is 17.2 cm$^{-1}$ and $\\mu_B/hc = 0.467$ cm$^{-1}$/T. The field at which the Zeeman energy $\\mu_BB$ equals the fine-structure splitting is roughly',
      options: ['0.4 T', '37 T', '4 T', '370 T'], answer: 1,
      sol: '$B = 17.2/0.467 = 36.8$ T. Paschen-Back conditions for the sodium $3p$ level need tens of tesla. For lithium (0.34 cm$^{-1}$) about 0.7 T is enough.',
      trap: 'Light atoms reach the Paschen-Back regime at much lower fields.' },
    { id: 'zst-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'magnetic moments',
      q: 'The ground level of Gd$^{3+}$ is $^8S_{7/2}$. Its effective magnetic moment $g_J\\sqrt{J(J+1)}$, in Bohr magnetons, is ______ (to two decimal places).',
      answer: 7.94, tol: 0.01, calc: () => 2 * Math.sqrt(3.5 * 4.5),
      sol: '$L = 0$, so $g_J = 2$. $\\sqrt{J(J+1)} = \\sqrt{3.5\\times4.5} = \\sqrt{15.75} = 3.969$. $\\mu_{\\rm eff} = 7.94\\,\\mu_B$, close to the measured 7.9 to 8.0.',
      trap: 'The maximum component $g_JJ = 7\\,\\mu_B$ is the saturation moment, not $\\mu_{\\rm eff}$.' },
    { id: 'zst-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'polarisation',
      q: 'For Zeeman components, which statements are correct?',
      options: ['Viewed perpendicular to $\\vec B$, the $\\pi$ ($\\Delta M = 0$) lines are linearly polarised parallel to $\\vec B$', 'Viewed perpendicular to $\\vec B$, the $\\sigma$ ($\\Delta M = \\pm1$) lines are linearly polarised perpendicular to $\\vec B$', 'Viewed along $\\vec B$, the $\\pi$ lines are the strongest', 'Viewed along $\\vec B$, the $\\sigma^+$ and $\\sigma^-$ lines are circularly polarised in opposite senses'], answer: [0, 1, 3],
      sol: 'A $\\pi$ transition is a dipole oscillating along $\\vec B$: from the side it gives light polarised along $\\vec B$; along $\\vec B$ it gives nothing. A $\\sigma$ transition is a dipole rotating about $\\vec B$: from the side it looks like a linear oscillation perpendicular to $\\vec B$; along $\\vec B$ it is circular.',
      trap: 'Along the field the $\\pi$ lines vanish completely.' },
    { id: 'zst-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'lande g',
      q: 'The Landé $g$ factor of any singlet level ($S = 0$, $J = L \\ne 0$) is',
      options: ['$2$', '$0$', '$1$', '$J/(J+1)$'], answer: 2,
      sol: 'With $S = 0$ and $J = L$: $g = 1 + \\dfrac{J(J+1) + 0 - L(L+1)}{2J(J+1)} = 1$. The moment is purely orbital.',
      trap: 'This is why singlet lines show the normal effect.' },
    { id: 'zst-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'zeeman energy',
      q: 'In a field of 1.00 T, adjacent Zeeman sublevels of a $^2P_{3/2}$ level are separated by ______ GHz (to two decimal places). Use $\\mu_B/h = 13.996$ GHz/T.',
      answer: 18.66, tol: 0.02, unit: 'GHz', calc: () => (4 / 3) * 13.996,
      sol: '$g = 1 + \\dfrac{\\tfrac{15}{4} + \\tfrac34 - 2}{2\\times\\tfrac{15}{4}} = 1 + \\dfrac{2.5}{7.5} = \\tfrac43$. Spacing $= g\\mu_BB/h = \\tfrac43\\times13.996 = 18.66$ GHz.',
      trap: 'The sublevel spacing uses the level\'s own $g$; the line splitting involves both levels.' },
    { id: 'zst-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'lande g',
      q: 'Which of these levels is not split at all by a weak magnetic field?',
      options: ['$^2P_{1/2}$', '$^3P_1$', '$^2D_{3/2}$', '$^4D_{1/2}$'], answer: 3,
      sol: '$g(^2P_{1/2}) = 2/3$, $g(^3P_1) = 3/2$, $g(^2D_{3/2}) = 4/5$, $g(^4D_{1/2}) = 0$. With $g = 0$ both $M = \\pm\\tfrac12$ stay at the same energy.',
      trap: 'Small $J$ does not mean no splitting; only $J = 0$ or $g = 0$ gives none.' },

    // ---------- level 4 ----------
    { id: 'zst-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'anomalous zeeman',
      q: 'The line $^2D_{5/2}\\to{}^2P_{3/2}$ is placed in a weak magnetic field. The number of distinct Zeeman lines is ______.',
      answer: 12, tol: 0,
      sol: '$g(^2D_{5/2}) = 1 + \\dfrac{8.75 + 0.75 - 6}{17.5} = 6/5$, $g(^2P_{3/2}) = 4/3$. Pairs $M_u\\to M_l$ with $|\\Delta M| \\le 1$: for each of the 4 values of $M_l$ there are 3 values of $M_u$, so 12. Their shifts $\\tfrac65M_u - \\tfrac43M_l$ are all different (e.g. $\\pm1$, $\\pm0.2$, $\\pm1.4$, $\\pm1.133$, $\\pm0.067$, $\\pm1.267$), so 12 lines.',
      trap: 'Check that no two components coincide; with unequal $g$ values here they do not.' },
    { id: 'zst-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'paschen-back',
      q: 'In the strong-field (Paschen-Back) limit, the hydrogen $2p$ state with $m_l = 1$, $m_s = +\\tfrac12$ is shifted by $\\mu_BB(m_l + 2m_s)$. At $B = 5.0$ T this shift is ______ meV (to three decimal places). Use $\\mu_B = 5.788\\times10^{-5}$ eV/T.',
      answer: 0.579, tol: 0.002, unit: 'meV', calc: () => 2 * 5.788e-5 * 5 * 1e3,
      sol: '$m_l + 2m_s = 1 + 1 = 2$. $\\Delta E = 2\\times5.788\\times10^{-5}\\times5.0 = 5.79\\times10^{-4}$ eV $= 0.579$ meV.',
      trap: 'The spin contributes $2m_s$, not $m_s$.' },
    { id: 'zst-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'paschen-back',
      q: 'As the magnetic field on a $^2P$ term is raised from weak (Zeeman) to strong (Paschen-Back), which label remains a good quantum number throughout?',
      options: ['$M_J = m_l + m_s$', '$J$', '$m_l$', '$m_s$'], answer: 0,
      sol: 'The Hamiltonian $\\xi\\vec L\\cdot\\vec S + \\mu_BB(L_z + 2S_z)/\\hbar$ commutes with $J_z = L_z + S_z$ at every field (both terms are symmetric about the $z$ axis). $J$ is good only at weak field; $m_l$, $m_s$ only at strong field.',
      trap: 'States of the same $M_J$ never cross; they repel in the intermediate region.' },
    { id: 'zst-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'lande g',
      q: 'The ground level of Fe$^{2+}$ is $^5D_4$. Its Landé $g$ factor is ______ (to two decimal places).',
      answer: 1.5, tol: 0.01, calc: () => 1 + (20 + 6 - 6) / 40,
      sol: '$S = 2$, $L = 2$, $J = 4$: $g = 1 + \\dfrac{20 + 6 - 6}{2\\times20} = 1.5$.',
      trap: 'With $S = L$ the answer is 1.5 for every $J$; no need to compute $S(S+1) - L(L+1)$.' },
    { id: 'zst-033', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'quadratic stark',
      q: 'Which statements about the quadratic Stark effect are correct?',
      options: ['The shift is $-\\tfrac12\\alpha E^2$ with $\\alpha$ the static polarisability', 'For ground-state hydrogen $\\alpha = 4.5\\,(4\\pi\\varepsilon_0)a_0^3$', 'The second-order shift of a ground state is always downward', 'The linear Stark effect of hydrogen $n = 2$ comes from mixing $2p_{\\pm1}$ with $2s$'], answer: [0, 1, 2],
      sol: 'The second-order energy $\\sum_k|\\langle k|eEz|0\\rangle|^2/(E_0 - E_k)$ has every denominator negative for the ground state, so the shift is negative. The exact hydrogen result is $\\alpha = \\tfrac92(4\\pi\\varepsilon_0)a_0^3$. The $n = 2$ linear effect mixes $2s$ with $2p_0$ ($\\Delta m = 0$ for a field along $z$).',
      trap: '$eEz$ conserves $m$, so $2p_{\\pm1}$ cannot mix with $2s$.' },
    { id: 'zst-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'quadratic stark',
      q: 'For ground-state hydrogen, $\\Delta E = -\\tfrac12\\alpha E^2$ with $\\alpha = 4.5\\times4\\pi\\varepsilon_0a_0^3 = 7.42\\times10^{-41}$ C m$^2$/V. In a field of $1.0\\times10^8$ V/m the shift is ______ $\\mu$eV (to two decimal places, with sign).',
      answer: -2.32, tol: 0.02, unit: 'μeV', calc: () => -0.5 * 7.42e-41 * 1e16 / 1.602177e-19 * 1e6,
      sol: '$\\Delta E = -\\tfrac12\\times7.42\\times10^{-41}\\times10^{16} = -3.71\\times10^{-25}$ J $= -2.32\\times10^{-6}$ eV $= -2.32\\,\\mu$eV. Even at $10^8$ V/m (near the field that ionises Rydberg atoms easily) the ground-state shift is tiny.',
      trap: 'Square the field: $E^2 = 10^{16}$ V$^2$/m$^2$.' },
    { id: 'zst-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'anomalous zeeman',
      q: 'The line $^3P_1\\to{}^3S_1$ in a weak field splits into how many lines? (Recall: $M = 0\\to M = 0$ is forbidden when $\\Delta J = 0$.)',
      options: ['9', '6', '7', '3'], answer: 1,
      sol: '$g(^3P_1) = 3/2$, $g(^3S_1) = 2$. Of the 9 pairs $M_u, M_l \\in \\{-1, 0, 1\\}$, two have $|\\Delta M| = 2$ and $0\\to0$ is forbidden for $\\Delta J = 0$: 6 remain. Shifts $\\tfrac32M_u - 2M_l$: $\\pm\\tfrac12$ ($\\pi$), $\\pm\\tfrac32$, $\\pm2$ ($\\sigma$): six distinct lines.',
      trap: 'Forgetting the $0\\to0$ rule gives a seventh, undisplaced line that is not there.' },
    { id: 'zst-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'esr',
      q: 'An ESR line of a radical is observed at 9.500 GHz when $B = 0.3390$ T. The $g$ factor is ______ (to three decimal places). Use $\\mu_B/h = 13.996$ GHz/T.',
      answer: 2.002, tol: 0.001, calc: () => 9.5 / (13.996 * 0.339),
      sol: '$g = h\\nu/(\\mu_BB) = 9.500/(13.996\\times0.3390) = 9.500/4.7446 = 2.002$, close to the free-electron value 2.0023.',
      trap: 'Small deviations of $g$ from 2.0023 carry the chemical information; keep enough digits.' },

    // ---------- level 5 ----------
    { id: 'zst-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'linear stark',
      q: 'In parabolic coordinates the linear Stark shift of hydrogen is $\\Delta E = \\tfrac32 n(n_1 - n_2)ea_0E$ with $n_1 + n_2 + |m| + 1 = n$. For $n = 3$, the largest shift, in units of $ea_0E$, is ______.',
      answer: 9, tol: 0,
      sol: 'Largest $n_1 - n_2$ with $m = 0$: $n_1 = 2$, $n_2 = 0$, so $n_1 - n_2 = 2$. $\\Delta E = \\tfrac32\\times3\\times2 = 9\\,ea_0E$. The $n = 3$ level splits into 5 components ($n_1 - n_2 = -2, \\dots, 2$), equally spaced by $4.5\\,ea_0E$.',
      trap: 'The spread grows as $n(n-1)$: highly excited states are very sensitive to electric fields.' },
    { id: 'zst-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'anomalous zeeman',
      q: 'Which statements about Zeeman patterns in weak fields are correct?',
      options: ['If the upper and lower levels have the same $g$, the pattern is a normal-looking triplet', 'For $\\Delta J = 0$ the component $M = 0\\to M = 0$ is absent', 'In the Paschen-Back limit a $^2P\\to{}^2S$ line shows (to first order) three lines spaced by $\\mu_BB$', 'An anomalous pattern is symmetric about the zero-field line only if $g_u = g_l$'], answer: [0, 1, 2],
      sol: 'With $g_u = g_l = g$ the shifts are $g\\mu_BB\\Delta M$: three lines (spacing $g\\mu_BB$). The $0\\to0$ rule for $\\Delta J = 0$ follows from the Clebsch-Gordan coefficient $\\langle J0;10|J0\\rangle = 0$. In Paschen-Back, $\\Delta m_s = 0$ leaves shifts $\\mu_BB\\Delta m_l$. Every weak-field pattern is symmetric, because the component $-M_u\\to-M_l$ always mirrors $M_u\\to M_l$.',
      trap: 'Symmetry is guaranteed by $M\\to-M$; it says nothing about $g$.' },
    { id: 'zst-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'paschen-back',
      q: 'The $^2P_{3/2}$, $M_J = 3/2$ state of an alkali atom is the only state with that $M_J$ in the $^2P$ term, so its energy shift is linear in $B$ at all field strengths. At $B = 3.0$ T its magnetic shift is ______ $\\mu$eV (to the nearest integer). Use $\\mu_B = 57.88\\,\\mu$eV/T.',
      answer: 347, tol: 1, unit: 'μeV', calc: () => 2 * 57.88 * 3,
      sol: 'Weak-field: $g_JM_J = \\tfrac43\\times\\tfrac32 = 2$. Strong-field: $m_l + 2m_s = 1 + 1 = 2$. Same coefficient, as it must be for a state that cannot mix. Shift $= 2\\times57.88\\times3.0 = 347\\,\\mu$eV.',
      trap: 'The stretched state is the easy one; the $M_J = \\pm1/2$ states curve in the intermediate region.' },
    { id: 'zst-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'quadratic stark',
      q: 'The static polarisability of a hydrogen-like Rydberg state of principal quantum number $n$ grows roughly as',
      options: ['$n^2$', '$n^4$', '$n^7$', '$n^6$'], answer: 2,
      sol: 'In second order, $\\alpha \\sim 2\\sum|\\langle z\\rangle|^2/\\Delta E$. The dipole matrix elements to nearby states grow as $n^2a_0$ and the energy gaps shrink as $1/n^3$, so $\\alpha \\sim (n^2)^2/(n^{-3}) = n^7$. Rydberg atoms are enormously polarisable, which is why they are used as electric field sensors.',
      trap: 'Squaring the size ($n^2$) alone gives $n^4$, which misses the shrinking energy denominators.' },
    ...more2,
    ...r4.items,
  ],

  gens: [
    { id: 'zst-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'lande g',
      make(r) {
        const [S, L, J] = choose(r, LEVELS.filter((x) => x[2] > 0));
        const g = gJ(S, L, J);
        return { q: `The Landé $g$ factor of a $${sym(S, L, J)}$ level (with $g_s = 2$) is ______ (to three decimal places).`,
          answer: round(g, 3), tol: 0.002, S, L, J,
          sol: `$g_J = 1 + \\dfrac{J(J+1) + S(S+1) - L(L+1)}{2J(J+1)} = 1 + \\dfrac{${J * (J + 1)} + ${S * (S + 1)} - ${L * (L + 1)}}{${2 * J * (J + 1)}} = ${round(g, 4)}$.`,
          trap: 'The $S(S+1)$ term is added and the $L(L+1)$ term subtracted.' };
      },
      verify: (p) => gJ(p.S, p.L, p.J) },
    { id: 'zst-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'normal zeeman',
      make(r) {
        const lam = pick(r, 400, 700, 0.1), B = pick(r, 0.5, 3, 0.1);
        const dl = (lam * 1e-7) ** 2 * MUB_CM * B * 1e10;
        return { q: `A singlet line at ${lam} nm shows the normal Zeeman effect in a ${B} T field. The wavelength separation between adjacent components is ______ pm (to two decimal places). Use $\\mu_B/hc = 0.4669$ cm$^{-1}$/T.`,
          answer: round(dl, 2), tol: Math.max(0.01, round(dl * 0.005, 2)), unit: 'pm', lam, B,
          sol: `$\\Delta\\tilde\\nu = 0.4669\\times${B} = ${round(MUB_CM * B, 4)}$ cm$^{-1}$. $\\Delta\\lambda = \\lambda^2\\Delta\\tilde\\nu = (${lam}\\times10^{-7}\\text{ cm})^2\\times${round(MUB_CM * B, 4)} = ${round(dl / 1e10, 13)}$ cm $= ${round(dl, 2)}$ pm.`,
          trap: 'Use $\\Delta\\lambda = \\lambda^2\\Delta\\tilde\\nu$ with consistent units.' };
      },
      verify: (p) => (p.lam * 1e-7) ** 2 * 0.46686 * p.B * 1e10 },
    { id: 'zst-g03', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'anomalous zeeman',
      make(r) {
        const pairs = [];
        for (const u of LEVELS) for (const l of LEVELS) if (u !== l && u[0] === l[0] && Math.abs(u[1] - l[1]) === 1 && Math.abs(u[2] - l[2]) <= 1 && !(u[2] === 0 && l[2] === 0)) pairs.push([u, l]);
        const [u, l] = choose(r, pairs);
        const c = comps(u, l), n = distinct(c);
        return { q: `The transition $${sym(...u)}\\to{}${sym(...l)}$ is observed in a weak magnetic field. The number of distinct Zeeman lines is ______.`,
          answer: n, tol: 0, u, l,
          sol: `$g_u = ${round(gJ(...u), 4)}$, $g_l = ${round(gJ(...l), 4)}$. Allowed components: $\\Delta M = 0, \\pm1$${u[2] === l[2] ? ', and $M = 0\\to0$ is forbidden because $\\Delta J = 0$' : ''}: ${c.length} of them. Their shifts $g_uM_u - g_lM_l$ (units of $\\mu_BB$) take ${n} distinct values: ${[...new Set(c.map((x) => round(x, 3)))].sort((a, b) => a - b).join(', ')}.`,
          trap: 'Count distinct energies, and remember $0\\to0$ is forbidden when $\\Delta J = 0$.' };
      },
      verify: (p) => distinct(comps(p.u, p.l)) },
    { id: 'zst-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'anomalous zeeman',
      make(r) {
        const [u, l] = choose(r, [[[0.5, 1, 0.5], [0.5, 0, 0.5]], [[0.5, 1, 1.5], [0.5, 0, 0.5]], [[0.5, 2, 1.5], [0.5, 1, 0.5]], [[0.5, 2, 2.5], [0.5, 1, 1.5]], [[1, 1, 2], [1, 0, 1]], [[1, 1, 1], [1, 0, 1]]]);
        const mu = choose(r, Ms(u[2])), opts = Ms(l[2]).filter((m) => Math.abs(m - mu) <= 1 && !(u[2] === l[2] && m === 0 && mu === 0));
        const ml = choose(r, opts), B = pick(r, 0.5, 3, 0.5);
        const k = gJ(...u) * mu - gJ(...l) * ml, sh = k * MUB_CM * B;
        return { q: `For the transition $${sym(...u)}\\to{}${sym(...l)}$ in a field of ${B} T, the component $M_u = ${fr(mu)}\\to M_l = ${fr(ml)}$ is shifted from the zero-field line by ______ cm$^{-1}$ (to three decimal places, with sign; positive means higher frequency). Use $\\mu_B/hc = 0.4669$ cm$^{-1}$/T.`,
          answer: round(sh, 3), tol: Math.max(0.001, round(Math.abs(sh) * 0.005, 3)), unit: 'cm⁻¹', u, l, mu, ml, B,
          sol: `$g_u = ${round(gJ(...u), 4)}$, $g_l = ${round(gJ(...l), 4)}$. Shift $= (g_uM_u - g_lM_l)\\mu_BB = (${round(gJ(...u) * mu, 4)} - (${round(gJ(...l) * ml, 4)}))\\mu_BB = ${round(k, 4)}\\mu_BB$. Times $0.4669\\times${B}$: ${round(sh, 3)} cm$^{-1}$.`,
          trap: 'Upper minus lower: an upward shift of the upper sublevel raises the photon energy.' };
      },
      verify: (p) => (gJ(...p.u) * p.mu - gJ(...p.l) * p.ml) * MUB_CM * p.B },
    { id: 'zst-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'esr',
      make(r) {
        const [band, nu] = choose(r, [['L-band', 1.5], ['S-band', 3.0], ['X-band', 9.5], ['Q-band', 35], ['W-band', 94]]);
        const g = choose(r, [2.0023, 2.0036, 2.05, 1.98, 2.0]);
        const mode = choose(r, ['B', 'nu']);
        const B = nu / (g * MUB_GHZ);
        return { q: mode === 'B'
          ? `An ESR spectrometer (${band}) runs at ${nu} GHz. For a centre with $g = ${g}$, resonance occurs at $B = $ ______ T (to four decimal places). Use $\\mu_B/h = 13.996$ GHz/T.`
          : `A sample with $g = ${g}$ is placed in $B = ${round(B, 4)}$ T. Its ESR frequency is ______ GHz (to two decimal places). Use $\\mu_B/h = 13.996$ GHz/T.`,
          answer: mode === 'B' ? round(B, 4) : round(g * MUB_GHZ * round(B, 4), 2), tol: mode === 'B' ? Math.max(0.0001, round(B * 0.002, 4)) : Math.max(0.01, round(nu * 0.002, 2)), unit: mode === 'B' ? 'T' : 'GHz', g, nu, mode, Br: round(B, 4),
          sol: mode === 'B' ? `$h\\nu = g\\mu_BB$, so $B = \\nu/(g\\,\\mu_B/h) = ${nu}/(${g}\\times13.996) = ${round(B, 4)}$ T.` : `$\\nu = g(\\mu_B/h)B = ${g}\\times13.996\\times${round(B, 4)} = ${round(g * MUB_GHZ * round(B, 4), 2)}$ GHz.`,
          trap: 'The resonance condition is $h\\nu = g\\mu_BB$ (one quantum flips $M_S$ by 1).' };
      },
      verify: (p) => (p.mode === 'B' ? p.nu / (p.g * MUB_GHZ) : p.g * MUB_GHZ * p.Br) },
    { id: 'zst-g06', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'polarisation',
      make(r) {
        const view = choose(r, ['along', 'perpendicular to']), comp = choose(r, ['pi', 'sigma']);
        const right = view === 'along' ? (comp === 'pi' ? 'not seen at all' : 'circularly polarised') : (comp === 'pi' ? 'linearly polarised parallel to $\\vec B$' : 'linearly polarised perpendicular to $\\vec B$');
        const all = ['not seen at all', 'circularly polarised', 'linearly polarised parallel to $\\vec B$', 'linearly polarised perpendicular to $\\vec B$', 'unpolarised'];
        const o = mcqOptions(r, right, shuffle(r, all.filter((x) => x !== right)), (v) => v);
        return { q: `A Zeeman pattern is viewed ${view} the magnetic field. The ${comp === 'pi' ? '$\\pi$ ($\\Delta M = 0$)' : '$\\sigma$ ($\\Delta M = \\pm1$)'} components are`,
          options: o.options, answer: o.answer,
          sol: `${comp === 'pi' ? 'A $\\Delta M = 0$ transition is a dipole oscillating along $\\vec B$' : 'A $\\Delta M = \\pm1$ transition is a dipole rotating in the plane perpendicular to $\\vec B$'}. Viewed ${view} $\\vec B$: ${right}.`,
          trap: 'A linear dipole does not radiate along its own axis.' };
      } },
    { id: 'zst-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'linear stark',
      make(r) {
        const n = int(r, 2, 5), E = pick(r, 1, 50, 1) * 1e5;
        const mode = choose(r, ['count', 'spread']);
        const spread = 3 * n * (n - 1) * EA0 * E * 1e3;
        return { q: mode === 'count'
          ? `Ignoring fine structure, into how many distinct energy levels does the $n = ${n}$ level of hydrogen split in a uniform electric field (linear Stark effect)? ______`
          : `Ignoring fine structure, the linear Stark shift of hydrogen is $\\tfrac32n(n_1 - n_2)ea_0E$. For $n = ${n}$ in a field of ${round(E / 1e5, 0)}$\\times10^5$ V/m, the energy difference between the highest and lowest components is ______ meV (to three significant figures). Use $a_0 = 5.292\\times10^{-11}$ m.`,
          answer: mode === 'count' ? 2 * n - 1 : +spread.toPrecision(3), tol: mode === 'count' ? 0 : +(spread * 0.01).toPrecision(2), unit: mode === 'count' ? undefined : 'meV', n, E, mode,
          sol: mode === 'count'
            ? `$n_1 - n_2$ runs from $-(n-1)$ to $n-1$: $2n - 1 = ${2 * n - 1}$ distinct shifts (the outer ones non-degenerate, inner ones degenerate).`
            : `The extremes have $n_1 - n_2 = \\pm(n-1)$, so the spread is $3n(n-1)ea_0E = ${3 * n * (n - 1)}\\times5.292\\times10^{-11}\\times${round(E / 1e5, 0)}\\times10^5$ eV $= ${+spread.toPrecision(4)}$ meV.`,
          trap: 'The linear Stark pattern of level $n$ spans $3n(n-1)ea_0E$.' };
      },
      verify: (p) => (p.mode === 'count' ? 2 * p.n - 1 : 3 * p.n * (p.n - 1) * EA0 * p.E * 1e3) },
    { id: 'zst-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'quadratic stark',
      make(r) {
        const k = pick(r, 1, 9.9, 0.1), e = choose(r, [7, 8]), E = k * 10 ** e;
        const dE = -0.5 * ALPHA_H * E * E / 1.602177e-19 * 1e6;
        return { q: `For ground-state hydrogen, $\\alpha = \\tfrac92(4\\pi\\varepsilon_0)a_0^3 = 7.42\\times10^{-41}$ C m$^2$/V. In a field of $${k}\\times10^{${e}}$ V/m the quadratic Stark shift is ______ $\\mu$eV (to three significant figures, with sign).`,
          answer: +dE.toPrecision(3), tol: +Math.abs(dE * 0.01).toPrecision(2), unit: 'μeV', E,
          sol: `$\\Delta E = -\\tfrac12\\alpha E^2 = -\\tfrac12\\times7.42\\times10^{-41}\\times(${k}\\times10^{${e}})^2$ J $= ${(-0.5 * ALPHA_H * E * E).toExponential(3).replace(/e([+-]\d+)/, '\\times10^{$1}')}$ J $= ${+dE.toPrecision(4)}\\,\\mu$eV.`,
          trap: 'The shift is quadratic in the field and always negative for a ground state.' };
      },
      verify: (p) => -0.5 * 7.42e-41 * p.E ** 2 / 1.602177e-19 * 1e6 },
    { id: 'zst-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'paschen-back',
      make(r) {
        const l = int(r, 1, 3), ml = int(r, -l, l), ms = choose(r, [-0.5, 0.5]), B = pick(r, 1, 10, 0.5);
        const mode = choose(r, ['shift', 'count']);
        const set = new Set(); for (let m = -l; m <= l; m++) for (const s of [-1, 1]) set.add(m + s);
        const sh = (ml + 2 * ms) * MUB * B * 1e6;
        return { q: mode === 'shift'
          ? `In the Paschen-Back limit a one-electron state is shifted by $\\mu_BB(m_l + 2m_s)$. For a $${'spdf'[l]}$ electron with $m_l = ${ml}$ and $m_s = ${ms > 0 ? '+' : '-'}\\tfrac12$ at $B = ${B}$ T, the shift is ______ $\\mu$eV (to one decimal place, with sign). Use $\\mu_B = 57.88\\,\\mu$eV/T.`
          : `In the Paschen-Back limit, ignoring residual spin-orbit coupling, a one-electron $${'spdf'[l]}$ term ($l = ${l}$) splits into levels $\\mu_BB(m_l + 2m_s)$. How many distinct energies are there? ______`,
          answer: mode === 'shift' ? round(sh, 1) : set.size, tol: mode === 'shift' ? Math.max(0.1, round(Math.abs(sh) * 0.002, 1)) : 0, unit: mode === 'shift' ? 'μeV' : undefined, l, ml, ms, B, mode,
          sol: mode === 'shift' ? `$m_l + 2m_s = ${ml} + (${2 * ms}) = ${ml + 2 * ms}$. Shift $= ${ml + 2 * ms}\\times57.88\\times${B} = ${round(sh, 1)}\\,\\mu$eV.` : `$m_l + 2m_s$ takes values from $-l - 1 = ${-l - 1}$ to $l + 1 = ${l + 1}$; every integer in between occurs: ${set.size} distinct energies (the inner ones doubly degenerate).`,
          trap: 'Spin counts double: $2m_s = \\pm1$.' };
      },
      verify: (p) => (p.mode === 'shift' ? (p.ml + 2 * p.ms) * 57.884 * p.B : 2 * p.l + 3) },
    { id: 'zst-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'magnetic moments',
      make(r) {
        const [ion, S, L, J] = choose(r, [['Ce$^{3+}$', 0.5, 3, 2.5], ['Pr$^{3+}$', 1, 5, 4], ['Nd$^{3+}$', 1.5, 6, 4.5], ['Gd$^{3+}$', 3.5, 0, 3.5], ['Tb$^{3+}$', 3, 3, 6], ['Dy$^{3+}$', 2.5, 5, 7.5], ['Ho$^{3+}$', 2, 6, 8], ['Er$^{3+}$', 1.5, 6, 7.5], ['Yb$^{3+}$', 0.5, 3, 3.5], ['Mn$^{2+}$', 2.5, 0, 2.5]]);
        const mode = choose(r, ['eff', 'sat']);
        const g = gJ(S, L, J), v = mode === 'eff' ? g * Math.sqrt(J * (J + 1)) : g * J;
        return { q: mode === 'eff'
          ? `The free-ion ground level of ${ion} is $${sym(S, L, J)}$. Its effective moment $\\mu_{\\rm eff} = g_J\\sqrt{J(J+1)}\\,\\mu_B$ is ______ $\\mu_B$ (to two decimal places).`
          : `The free-ion ground level of ${ion} is $${sym(S, L, J)}$. Its saturation moment (largest component along a field) $g_JJ\\,\\mu_B$ is ______ $\\mu_B$ (to two decimal places).`,
          answer: round(v, 2), tol: 0.01, S, L, J, mode,
          sol: `$g_J = 1 + \\dfrac{${J * (J + 1)} + ${S * (S + 1)} - ${L * (L + 1)}}{${2 * J * (J + 1)}} = ${round(g, 4)}$. ${mode === 'eff' ? `$\\sqrt{J(J+1)} = ${round(Math.sqrt(J * (J + 1)), 4)}$, so $\\mu_{\\rm eff} = ${round(v, 2)}\\,\\mu_B$.` : `$g_JJ = ${round(g, 4)}\\times${fr(J)} = ${round(v, 2)}\\,\\mu_B$.`}`,
          trap: mode === 'eff' ? 'Use $\\sqrt{J(J+1)}$, not $J$.' : 'The saturation moment uses $J$, not $\\sqrt{J(J+1)}$.' };
      },
      verify: (p) => { const g = gJ(p.S, p.L, p.J); return p.mode === 'eff' ? g * Math.sqrt(p.J * (p.J + 1)) : g * p.J; } },
    { id: 'zst-g11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'lande g',
      make(r) {
        const g = choose(r, [2 / 3, 4 / 3, 1.5, 0.5, 1.2, 0.8, 2, 1, 7 / 6, 8 / 7]);
        const B = pick(r, 0.2, 2, 0.1), d = g * MUB_CM * B;
        return { q: `Adjacent Zeeman sublevels of an atomic level are found to be ${round(d, 4)} cm$^{-1}$ apart in a field of ${B} T. The Landé $g$ factor of the level is ______ (to two decimal places). Use $\\mu_B/hc = 0.46686$ cm$^{-1}$/T.`,
          answer: round(g, 2), tol: 0.01, d: round(d, 4), B,
          sol: `Adjacent sublevels differ by $g\\mu_BB$, so $g = ${round(d, 4)}/(0.46686\\times${B}) = ${round(round(d, 4) / (MUB_CM * B), 3)}$.`,
          trap: 'This is the spacing within one level, not between Zeeman lines.' };
      },
      verify: (p) => p.d / (MUB_CM * p.B) },
    { id: 'zst-g12', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'lande g',
      make(r) {
        const cond = choose(r, [['greater than 1', (g) => g > 1 + 1e-9], ['less than 1', (g) => g < 1 - 1e-9], ['equal to 1', (g) => Math.abs(g - 1) < 1e-9], ['equal to 2', (g) => Math.abs(g - 2) < 1e-9]]);
        const pool = LEVELS.filter((x) => x[2] > 0);
        const yes = pool.filter((x) => cond[1](gJ(...x))), no = pool.filter((x) => !cond[1](gJ(...x)));
        const k = int(r, 1, Math.min(3, yes.length));
        const ch = shuffle(r, [...shuffle(r, yes).slice(0, k), ...shuffle(r, no).slice(0, 4 - k)]);
        return { q: `Which of these levels have a Landé $g$ factor ${cond[0]}?`,
          options: ch.map((x) => `$${sym(...x)}$`), answer: ch.map((x, i) => (cond[1](gJ(...x)) ? i : -1)).filter((i) => i >= 0),
          sol: '$g_J = 1 + [J(J+1) + S(S+1) - L(L+1)]/2J(J+1)$. ' + ch.map((x) => `$${sym(...x)}$: $g = ${round(gJ(...x), 3)}$.`).join(' '),
          trap: '$g > 1$ when spin dominates the moment; $g < 1$ when $L(L+1)$ outweighs $S(S+1)$ in the numerator.' };
      } },
    ...more,
    ...r4.gens,
  ],
};
