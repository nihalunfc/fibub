// Electronic spectra of molecules and the Franck-Condon principle (CSIR NET Part C atomic and molecular physics):
// Born-Oppenheimer separation, vibronic band positions, progressions and sequences, Deslandres tables, Franck-Condon
// factors (displaced oscillators, Huang-Rhys factor), Birge-Sponer and Morse dissociation energies, thermochemical
// cycles, rotational structure (P, Q, R branches, Fortrat parabola, band heads and shading), diatomic term symbols
// and selection rules, MO bond orders, predissociation, fluorescence, phosphorescence and the Jablonski diagram.
// Original questions for CSIR NET (and GATE) practice (fibub). Pure vibrational and rotational spectra have their own topics.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './electronic-spectra.more.gen.js';
import more2 from './electronic-spectra.more2.gen.js';

const HBAR = 1.054571817e-34, U = 1.66053906660e-27, CCM = 2.99792458e10, C2 = 1.438777, EV = 8065.544;
const s3 = (x) => +x.toPrecision(3), t6 = (x) => +(Math.abs(x) * 0.006).toPrecision(2);
const sci = (x, d = 4) => { const e = Math.floor(Math.log10(Math.abs(x))); return `${+(x / 10 ** e).toPrecision(d)}\\times10^{${e}}`; };
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const pois = (S, n) => Math.exp(-S) * S ** n / fact(n);
const G = (we, wx, v) => we * (v + 0.5) - wx * (v + 0.5) ** 2;

export default {
  topic: 'electronic-spectra',
  items: [
    // ---------- level 1 ----------
    { id: 'els-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Born-Oppenheimer',
      q: 'The Born-Oppenheimer approximation, which lets us treat electronic and nuclear motion separately, rests on the fact that',
      options: ['electrons and nuclei have equal and opposite charges', 'nuclei are much heavier, so they move much more slowly than electrons', 'the nuclei are fixed in space', 'electrons do not feel the nuclear charge'], answer: 1,
      sol: 'With $M/m \\sim 10^3$ to $10^5$, electrons adjust almost instantly to any nuclear arrangement. The electronic energy at each separation $R$ then acts as the potential $U(R)$ in which the nuclei vibrate and rotate.',
      trap: 'The nuclei are not fixed; they move slowly on the electronic potential curve.' },
    { id: 'els-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Franck-Condon principle',
      q: 'The Franck-Condon principle says that during an electronic transition',
      options: ['the vibrational quantum number cannot change', 'the molecule must dissociate', 'the nuclear positions and velocities hardly change, so transitions are vertical on a potential-energy diagram', 'only the 0-0 band appears'], answer: 2,
      sol: 'An electronic transition takes about $10^{-15}$ s, a vibration about $10^{-13}$ s. The nuclei are caught where they are: the transition goes straight up (or down) at fixed $R$. Band intensities follow the overlap of the vibrational wavefunctions.',
      trap: 'Many vibrational bands appear; the principle sets their intensities, not a selection rule on $v$.' },
    { id: 'els-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'energy scales',
      q: 'Typical spacings for a diatomic molecule are, in order: electronic, vibrational, rotational',
      options: ['$\\sim$ 1 meV, 0.1 eV, a few eV', '$\\sim$ a few eV, 0.1 eV, 1 meV', 'all about 0.1 eV', '$\\sim$ 0.1 eV, a few eV, 1 meV'], answer: 1,
      sol: 'Electronic energies are a few eV (visible and UV), vibrational quanta about 0.1 to 0.5 eV (infrared), rotational constants about $10^{-4}$ to $10^{-3}$ eV (microwave). They scale roughly as $1 : (m/M)^{1/2} : m/M$.',
      trap: 'Electronic transitions lie in the visible and UV, not the infrared.' },
    { id: 'els-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'term symbols',
      q: 'A diatomic electronic state whose orbital angular momentum projection on the molecular axis is $\\Lambda = 1$ is labelled',
      options: ['$\\Sigma$', '$\\Delta$', '$\\Phi$', '$\\Pi$'], answer: 3,
      sol: 'By analogy with s, p, d, f: $\\Lambda = 0, 1, 2, 3$ are $\\Sigma, \\Pi, \\Delta, \\Phi$. The full symbol $^{2S+1}\\Lambda$ adds the spin multiplicity, with g/u and $\\pm$ where they apply.',
      trap: '$\\Lambda$ is a projection on the axis, not the total orbital angular momentum $L$ (not a good quantum number in a molecule).' },
    { id: 'els-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'luminescence',
      q: 'Compared with fluorescence, phosphorescence in organic molecules',
      options: ['is emitted from a triplet state to the singlet ground state and lasts much longer', 'is emitted at shorter wavelengths', 'happens only in the gas phase', 'comes from a higher singlet state'], answer: 0,
      sol: 'Fluorescence is spin-allowed $S_1 \\to S_0$ emission (nanoseconds). Phosphorescence is $T_1 \\to S_0$: spin-forbidden, so it lasts milliseconds to seconds, and it lies at longer wavelength because $T_1$ is below $S_1$.',
      trap: 'The triplet lies lower than the singlet, so phosphorescence is redder, not bluer.' },
    { id: 'els-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Franck-Condon principle',
      q: 'In the electronic spectrum of a diatomic molecule, the vibrational quantum number may change by',
      options: ['$\\pm1$ only', '0 only', 'any amount, with intensities set by Franck-Condon factors', 'even numbers only'], answer: 2,
      sol: 'The two electronic states have different potential curves, so their vibrational wavefunctions are not orthogonal to each other. Every $v\' \\leftarrow v\'\'$ band can appear, with intensity $\\propto|\\langle v\'|v\'\'\\rangle|^2$.',
      trap: '$\\Delta v = \\pm1$ is the rule for pure vibrational (infrared) transitions within one electronic state.' },

    // ---------- level 2 ----------
    { id: 'els-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'band positions',
      q: 'An upper electronic state has $T_e = 20\\,000$ cm$^{-1}$, $\\omega_e\' = 1000$ cm$^{-1}$, $\\omega_e\'x_e\' = 8$ cm$^{-1}$; the ground state has $\\omega_e\'\' = 1500$ cm$^{-1}$, $\\omega_e\'\'x_e\'\' = 10$ cm$^{-1}$. The 0-0 band lies at ______ cm$^{-1}$ (to one decimal place).',
      answer: 19750.5, tol: 0.1, unit: 'cm⁻¹', calc: () => 20000 + (500 - 2) - (750 - 2.5),
      sol: '$\\nu_{00} = T_e + G\'(0) - G\'\'(0)$ with $G(0) = \\omega_e/2 - \\omega_ex_e/4$. $G\'(0) = 500 - 2 = 498$, $G\'\'(0) = 750 - 2.5 = 747.5$. $\\nu_{00} = 20\\,000 + 498 - 747.5 = 19\\,750.5$ cm$^{-1}$.',
      trap: 'The 0-0 band differs from $T_e$ by the difference of the zero-point energies.' },
    { id: 'els-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'progressions',
      q: 'In the electronic absorption spectrum of a cold diatomic gas, the main series of bands is a',
      options: ['$v\'$ progression from $v\'\' = 0$: bands $v\' = 0, 1, 2, \\dots \\leftarrow v\'\' = 0$, spaced by the upper-state vibrational intervals', 'sequence with $\\Delta v = 0$', 'series spaced by the ground-state vibrational intervals', 'set of rotational lines only'], answer: 0,
      sol: 'Almost all molecules start in $v\'\' = 0$. Bands to $v\' = 0, 1, 2, \\dots$ form a progression whose spacing $\\Delta G\'(v + \\tfrac12)$ maps the upper potential curve and shrinks towards its dissociation limit.',
      trap: 'Ground-state spacings appear in emission progressions (fixed $v\'$), not in cold absorption.' },
    { id: 'els-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'progressions',
      q: 'In a Deslandres table of band positions, a "sequence" is a set of bands with',
      options: ['the same $v\'$', 'the same $v\'\'$', 'the same $\\Delta v = v\' - v\'\'$', 'the same rotational quantum number'], answer: 2,
      sol: 'Rows (fixed $v\'\'$) and columns (fixed $v\'$) are progressions. Diagonals, with fixed $\\Delta v$, are sequences; their bands lie close together when $\\omega_e\' \\approx \\omega_e\'\'$, and the members with $v\'\' > 0$ are hot bands.',
      trap: 'Progressions share one level; sequences share the change in $v$.' },
    { id: 'els-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'selection rules',
      q: 'For a homonuclear diatomic molecule in a $^1\\Sigma_g^+$ ground state, which electric-dipole transition is allowed?',
      options: ['$^1\\Sigma_g^+ \\leftarrow {}^1\\Sigma_g^+$', '$^3\\Sigma_u^+ \\leftarrow {}^1\\Sigma_g^+$', '$^1\\Sigma_u^+ \\leftarrow {}^1\\Sigma_g^+$', '$^1\\Sigma_u^- \\leftarrow {}^1\\Sigma_g^+$'], answer: 2,
      sol: 'Rules: $\\Delta\\Lambda = 0, \\pm1$; $\\Delta S = 0$; $g \\leftrightarrow u$ only; $\\Sigma^+ \\leftrightarrow \\Sigma^+$ and $\\Sigma^- \\leftrightarrow \\Sigma^-$ only. $^1\\Sigma_u^+$ satisfies all four. The others break $g \\leftrightarrow u$, $\\Delta S = 0$, or $+ \\leftrightarrow +$.',
      trap: 'Check every rule; each wrong option breaks exactly one.' },
    { id: 'els-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'term symbols',
      q: 'The ground state of the O$_2$ molecule is',
      options: ['$^1\\Sigma_g^+$', '$^3\\Sigma_g^-$', '$^1\\Delta_g$', '$^3\\Pi_u$'], answer: 1,
      sol: 'O$_2$ has two electrons in the doubly degenerate $\\pi_g^*$ orbitals. Hund\'s rule puts them in different orbitals with parallel spins: $S = 1$, $\\Lambda = 0$, and the antisymmetric spatial combination is $\\Sigma^-$; $\\pi_g\\times\\pi_g$ is g. Hence $^3\\Sigma_g^-$, and O$_2$ is paramagnetic. $^1\\Delta_g$ and $^1\\Sigma_g^+$ are its low excited states.',
      trap: 'Singlet oxygen ($^1\\Delta_g$) is an excited state, about 0.98 eV up.' },
    { id: 'els-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Franck-Condon principle',
      q: 'Which statements about Franck-Condon factors $q_{v\'v\'\'} = |\\langle v\'|v\'\'\\rangle|^2$ are correct?',
      options: ['If the two potential curves have nearly the same equilibrium separation, the 0-0 band is strongest in absorption from $v\'\' = 0$', 'If the upper curve is displaced to larger $R$, absorption from $v\'\' = 0$ shows a long progression peaking at $v\' > 0$', 'For fixed $v\'\'$, the factors summed over all upper levels (including the continuum) equal 1', 'The factors depend on the size of the electronic transition dipole'], answer: [0, 1, 2],
      sol: 'Overlaps depend only on the vibrational wavefunctions: identical curves make $\\langle v\'|0\\rangle = \\delta_{v\'0}$; a displacement spreads the overlap over many $v\'$. Completeness of the upper-state functions gives $\\sum_{v\'}q_{v\'v\'\'} = 1$. The electronic dipole sets the overall strength, not the relative band intensities.',
      trap: 'The electronic part multiplies all bands equally (to a good approximation).' },
    { id: 'els-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'molecular orbitals',
      q: 'Which of these has the largest bond order (and shortest bond)?',
      options: ['O$_2^-$', 'O$_2$', 'O$_2^{2-}$', 'O$_2^+$'], answer: 3,
      sol: 'O$_2$ has bond order $(8 - 4)/2 = 2$ with two electrons in antibonding $\\pi^*$. Removing one (O$_2^+$) gives 2.5; adding one or two gives 1.5 and 1. O$_2^+$ is the strongest and shortest bond of the four.',
      trap: 'Removing an antibonding electron strengthens the bond.' },
    { id: 'els-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'luminescence',
      q: 'Kasha\'s rule states that',
      options: ['emission comes from the lowest excited state of a given multiplicity, whichever state was excited', 'absorption always goes to the lowest excited state', 'the fluorescence yield is always 1', 'the Stokes shift is zero'], answer: 0,
      sol: 'Internal conversion and vibrational relaxation from higher states take picoseconds, much faster than emission (nanoseconds). So molecules excited to $S_2$ or higher first relax to $v = 0$ of $S_1$ and fluoresce from there.',
      trap: 'Exceptions exist (azulene fluoresces from $S_2$), but they are rare.' },
    { id: 'els-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'luminescence',
      q: 'The fluorescence of a dye in solution peaks at a longer wavelength than its absorption (the Stokes shift) mainly because',
      options: ['the excited molecule loses vibrational energy (and the solvent relaxes) before emitting', 'fluorescence comes from a triplet state', 'the photons lose energy in the solvent', 'emission goes to a higher electronic state'], answer: 0,
      sol: 'Absorption is vertical from $v = 0$ of $S_0$ into excited vibrational levels of $S_1$; these relax in picoseconds. Emission, also vertical, starts from $v = 0$ of $S_1$ and ends in excited vibrational levels of $S_0$. Both relaxations make the emitted photon smaller than the absorbed one.',
      trap: 'Only the 0-0 band is common to both spectra.' },
    { id: 'els-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Morse potential',
      q: 'An excited state is described by a Morse oscillator with $\\omega_e = 800$ cm$^{-1}$ and $\\omega_ex_e = 10$ cm$^{-1}$. The number of bound vibrational levels it supports (including $v = 0$) is ______.',
      answer: 40, tol: 0, calc: () => Math.floor(800 / 20 - 0.5) + 1,
      sol: '$G(v) = \\omega_e(v + \\tfrac12) - \\omega_ex_e(v + \\tfrac12)^2$ has its maximum at $v + \\tfrac12 = \\omega_e/2\\omega_ex_e = 40$, i.e. $v_{max} = 39.5$. The bound levels are $v = 0, 1, \\dots, 39$: 40 levels.',
      trap: 'Count from $v = 0$, so the number of levels is one more than the highest $v$.' },

    // ---------- level 3 ----------
    { id: 'els-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dissociation energy',
      q: 'The first two intervals of an upper-state progression are $\\Delta G(\\tfrac12) = 980$ cm$^{-1}$ and $\\Delta G(\\tfrac32) = 960$ cm$^{-1}$. Assuming $\\Delta G$ falls linearly to zero (a Birge-Sponer extrapolation), the dissociation energy $D_0$ of that state is ______ cm$^{-1}$ (to the nearest 10).',
      answer: 24500, tol: 5, unit: 'cm⁻¹', calc: () => 25000 - (500 - 2.5),
      sol: '$\\Delta G(v + \\tfrac12) = \\omega_e - 2\\omega_ex_e(v + 1)$. The drop of 20 per step gives $\\omega_ex_e = 10$, then $\\omega_e = 1000$ cm$^{-1}$. $\\Delta G$ reaches zero at $v + 1 = 50$; the sum of all intervals is $\\sum_{k=1}^{49}(1000 - 20k) = 49\\,000 - 24\\,500 = 24\\,500$ cm$^{-1}$ ($= D_e - G(0) = 25\\,000 - 497.5$).',
      trap: 'Birge-Sponer gives $D_0$ (from $v = 0$), not $D_e$ (from the minimum).' },
    { id: 'els-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dissociation energy',
      q: 'An absorption progression of a diatomic molecule converges at 56 900 cm$^{-1}$, beyond which there is a continuum. The upper state dissociates into one ground-state atom and one atom in an excited state 15 870 cm$^{-1}$ up. The ground-state dissociation energy $D_0\'\'$ is about (1 eV = 8065.5 cm$^{-1}$)',
      options: ['7.05 eV', '1.97 eV', '5.09 eV', '3.12 eV'], answer: 2,
      sol: 'The convergence limit is the energy, from $v\'\' = 0$, of the separated atoms in the upper channel: $D_0\'\' + E_{exc}$. So $D_0\'\' = 56\\,900 - 15\\,870 = 41\\,030$ cm$^{-1}$ $= 5.09$ eV.',
      trap: 'Taking the convergence limit itself (7.05 eV) forgets that one atom is left excited.' },
    { id: 'els-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Franck-Condon factors',
      q: 'Two electronic states have harmonic potentials of the same frequency, displaced so that the Huang-Rhys factor is $S = 1.5$. Then $|\\langle v\'|0\\rangle|^2 = e^{-S}S^{v\'}/v\'!$. The fraction of the absorption intensity from $v\'\' = 0$ that goes into the 0-0 band is ______ (to three decimal places).',
      answer: 0.223, tol: 0.002, calc: () => Math.exp(-1.5),
      sol: 'The factors form a Poisson distribution of mean $S$, summing to 1. The 0-0 share is $e^{-S} = e^{-1.5} = 0.223$; the 1-0 and 2-0 bands get $1.5e^{-1.5} = 0.335$ and $1.125e^{-1.5} = 0.251$.',
      trap: 'The Poisson form needs equal frequencies in both states.' },
    { id: 'els-020', type: 'mcq', level: 3, exams: ['net'], sub: 'Franck-Condon factors',
      q: 'For displaced harmonic potentials of equal frequency with Huang-Rhys factor $S = 3.4$, the most intense band of the absorption progression from $v\'\' = 0$ ends on',
      options: ['$v\' = 4$', '$v\' = 3$', '$v\' = 0$', '$v\' = 2$'], answer: 1,
      sol: 'Ratios of successive Poisson terms are $S/v\'$: $P(3)/P(2) = 3.4/3 > 1$ but $P(4)/P(3) = 3.4/4 < 1$. So $v\' = 3$ is strongest (for non-integer $S$, the peak is at $\\lfloor S\\rfloor$).',
      trap: 'Rounding $S$ to the nearest integer can give the wrong band; the peak is at the integer part.' },
    { id: 'els-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'band heads',
      q: 'In a $^1\\Sigma - {}^1\\Sigma$ band, $B\' = 1.6$ cm$^{-1}$ and $B\'\' = 1.9$ cm$^{-1}$. The band head forms',
      options: ['in the P branch, and the band is shaded to the violet', 'in the R branch near $J\'\' = 5$, and the band is shaded to the red', 'in the R branch near $J\'\' = 11$, shaded to the violet', 'nowhere, because there is no Q branch'], answer: 1,
      sol: 'With $m = J\'\' + 1$ for R and $m = -J\'\'$ for P, lines lie at $\\nu = \\nu_0 + (B\' + B\'\')m + (B\' - B\'\')m^2$. With $B\' < B\'\'$ the parabola turns back at $m = (B\' + B\'\')/2(B\'\' - B\') = 3.5/0.6 = 5.8$, i.e. in the R branch near $J\'\' = 5$. Lines then run back to lower wavenumber: shaded to the red.',
      trap: 'The upper state usually has the longer bond (smaller $B$), which is why most bands are red-degraded.' },
    { id: 'els-022', type: 'nat', level: 3, exams: ['net'], sub: 'band heads',
      q: 'For the band with $B\' = 1.6$ cm$^{-1}$ and $B\'\' = 1.9$ cm$^{-1}$, treating $m$ as continuous, the head lies ______ cm$^{-1}$ above the band origin $\\nu_0$ (to one decimal place).',
      answer: 10.2, tol: 0.1, unit: 'cm⁻¹', calc: () => (1.6 + 1.9) ** 2 / (4 * (1.9 - 1.6)),
      sol: 'At the turning point $m_h = -(B\' + B\'\')/2(B\' - B\'\')$, the parabola gives $\\nu_h - \\nu_0 = -(B\' + B\'\')^2/4(B\' - B\'\') = 3.5^2/(4\\times0.3) = 10.2$ cm$^{-1}$.',
      trap: 'The head is close to the origin when the two $B$ values differ a lot, and far away when they are nearly equal.' },
    { id: 'els-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'rotational structure',
      q: 'A Q branch ($\\Delta J = 0$) appears in the electronic band of a diatomic molecule for which transition?',
      options: ['$^1\\Sigma^+ - {}^1\\Sigma^+$', '$^1\\Pi - {}^1\\Sigma^+$', '$^3\\Sigma^- - {}^3\\Sigma^-$ (ignoring spin splitting)', '$^1\\Sigma^- - {}^1\\Sigma^-$'], answer: 1,
      sol: '$\\Delta J = 0$ is forbidden only when both states have $\\Lambda = 0$. A $^1\\Pi - {}^1\\Sigma$ band has P, Q and R branches; $\\Sigma - \\Sigma$ bands have only P and R, with a gap at the origin.',
      trap: 'The Q branch needs angular momentum about the axis in at least one of the states.' },
    { id: 'els-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'progressions',
      q: 'Absorption bands from $v\'\' = 0$ to $v\' = 0, 1, 2$ lie at 20 000, 20 480 and 20 940 cm$^{-1}$. The upper-state vibrational constant $\\omega_e\'$ is ______ cm$^{-1}$.',
      answer: 500, tol: 0, unit: 'cm⁻¹', calc: () => 480 + 2 * (480 - 460) / 2,
      sol: 'Intervals: $\\Delta G\'(\\tfrac12) = 480$ and $\\Delta G\'(\\tfrac32) = 460$. With $\\Delta G(v + \\tfrac12) = \\omega_e - 2\\omega_ex_e(v + 1)$: the difference $2\\omega_ex_e = 20$, so $\\omega_ex_e = 10$, and $\\omega_e = 480 + 20 = 500$ cm$^{-1}$.',
      trap: 'The first interval is $\\omega_e - 2\\omega_ex_e$, not $\\omega_e$.' },
    { id: 'els-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'luminescence',
      q: 'In the Jablonski diagram of an organic molecule, which statements are true?',
      options: ['Internal conversion is a radiationless transition between states of the same multiplicity', 'Intersystem crossing is a radiationless transition between states of different multiplicity', 'Phosphorescence lifetimes are typically far longer than fluorescence lifetimes', 'The fluorescence quantum yield is always 1'], answer: [0, 1, 2],
      sol: 'IC ($S_n \\to S_m$) and ISC ($S_1 \\to T_1$, helped by spin-orbit coupling) are non-radiative. Phosphorescence ($T_1 \\to S_0$) is spin-forbidden: ms to s against ns for fluorescence. Non-radiative losses compete with fluorescence, so the yield is usually below 1.',
      trap: 'Heavy atoms speed up intersystem crossing and lower the fluorescence yield.' },
    { id: 'els-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'predissociation',
      q: 'In an absorption progression, the rotational lines of bands above a certain $v\'$ suddenly become diffuse, although the bands still lie below the convergence limit. This is the signature of',
      options: ['the dissociation limit of the upper state', 'pressure broadening', 'predissociation: the bound upper levels couple to a crossing repulsive state', 'hot bands'], answer: 2,
      sol: 'Where a repulsive curve crosses the bound upper state, levels above the crossing can leak into it and fall apart in less than a rotational period. Their lifetime broadening blurs the rotational structure. True dissociation gives a continuum beyond the convergence limit instead.',
      trap: 'Predissociation happens below the convergence limit of the bound state.' },
    { id: 'els-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'luminescence',
      q: 'The fluorescence spectrum of many large molecules is roughly a mirror image of the $S_1 \\leftarrow S_0$ absorption band, reflected about the 0-0 line. This happens because',
      options: ['the vibrational level spacings and Franck-Condon factors are similar in $S_0$ and $S_1$', 'emission and absorption obey opposite selection rules', 'the solvent reflects the light', 'the molecule is symmetric'], answer: 0,
      sol: 'Absorption from $v = 0$ of $S_0$ samples the vibrational levels of $S_1$; emission from $v = 0$ of $S_1$ samples those of $S_0$. When the two potential surfaces have similar shape, the spacings and overlaps match, so the two spectra are mirror images in frequency about $\\nu_{00}$.',
      trap: 'The mirror is in frequency (energy), not exactly in wavelength.' },
    { id: 'els-028', type: 'mcq', level: 3, exams: ['net'], sub: 'rotational structure',
      q: 'For H$_2$ ($X\\,^1\\Sigma_g^+$ ground state), the Lyman bands go to $B\\,^1\\Sigma_u^+$ and the Werner bands to $C\\,^1\\Pi_u$. Which statement is correct?',
      options: ['Both band systems show P, Q and R branches', 'Only the Lyman bands show a Q branch', 'Only the Werner bands show a Q branch', 'Neither system is allowed'], answer: 2,
      sol: 'Both are allowed ($\\Delta S = 0$, $g \\leftrightarrow u$, $\\Delta\\Lambda = 0$ or 1). The Lyman bands ($\\Sigma - \\Sigma$) have only P and R branches; the Werner bands ($\\Pi - \\Sigma$) add a Q branch.',
      trap: 'A Q branch requires $\\Lambda \\neq 0$ in one of the two states.' },

    // ---------- level 4 ----------
    { id: 'els-029', type: 'nat', level: 4, exams: ['net'], sub: 'Franck-Condon factors',
      q: 'A diatomic molecule (reduced mass 7.00 u) has the same vibrational wavenumber, 1500 cm$^{-1}$, in two electronic states whose equilibrium separations differ by 0.100 Å. The Huang-Rhys factor $S = \\mu\\omega(\\Delta r)^2/2\\hbar$ is ______ (to two decimal places). Use $1\\ \\text{u} = 1.6605\\times10^{-27}$ kg, $c = 2.998\\times10^{10}$ cm/s, $\\hbar = 1.0546\\times10^{-34}$ J s.',
      answer: 1.56, tol: 0.01, calc: () => 7 * 1.6605e-27 * 2 * Math.PI * 2.998e10 * 1500 * 1e-22 / (2 * 1.0546e-34),
      sol: '$\\omega = 2\\pi c\\tilde\\nu = 2\\pi\\times2.998\\times10^{10}\\times1500 = 2.826\\times10^{14}$ rad/s. $\\mu = 1.162\\times10^{-26}$ kg. $\\mu\\omega(\\Delta r)^2 = 1.162\\times10^{-26}\\times2.826\\times10^{14}\\times10^{-22} = 3.285\\times10^{-34}$ J s; divided by $2\\hbar$: $S = 1.56$.',
      trap: 'Use the angular frequency $\\omega = 2\\pi c\\tilde\\nu$ with $c$ in cm/s.' },
    { id: 'els-030', type: 'mcq', level: 4, exams: ['net'], sub: 'Franck-Condon factors',
      q: 'For the molecule with $S = 1.56$ (equal frequencies in both states), the strongest band of the absorption progression from $v\'\' = 0$ is',
      options: ['$1 \\leftarrow 0$', '$0 \\leftarrow 0$', '$2 \\leftarrow 0$', '$3 \\leftarrow 0$'], answer: 0,
      sol: 'Poisson ratios: $q_{10}/q_{00} = S = 1.56 > 1$, $q_{20}/q_{10} = S/2 = 0.78 < 1$. So $1 \\leftarrow 0$ is strongest ($q = 1.56e^{-1.56} = 0.33$).',
      trap: 'The peak of a Poisson distribution is at the integer part of its mean.' },
    { id: 'els-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'band positions',
      q: 'An upper state has $T_e = 25\\,000$, $\\omega_e\' = 1200$, $\\omega_e\'x_e\' = 12$; the ground state has $\\omega_e\'\' = 1600$, $\\omega_e\'\'x_e\'\' = 15$ (all cm$^{-1}$). The hot band $v\' = 2 \\leftarrow v\'\' = 1$ lies at ______ cm$^{-1}$ (to the nearest whole number).',
      answer: 25559, tol: 1, unit: 'cm⁻¹', calc: () => 25000 + (1200 * 2.5 - 12 * 6.25) - (1600 * 1.5 - 15 * 2.25),
      sol: '$G\'(2) = 1200\\times2.5 - 12\\times6.25 = 2925$; $G\'\'(1) = 1600\\times1.5 - 15\\times2.25 = 2366.25$. $\\nu = T_e + G\'(2) - G\'\'(1) = 25\\,000 + 2925 - 2366.25 = 25\\,558.75 \\approx 25\\,559$ cm$^{-1}$.',
      trap: 'Both $G$ values are measured from their own potential minima, which is what $T_e$ separates.' },
    { id: 'els-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'hot bands',
      q: 'The ground state has $\\omega\'\' = 1600$ cm$^{-1}$. At 300 K, the population of $v\'\' = 1$ relative to $v\'\' = 0$ (which sets the relative strength of hot bands, other things equal) is about ($hc/k_B = 1.4388$ cm K)',
      options: ['0.21', '$4.6\\times10^{-4}$', '$2.1\\times10^{-2}$', '$4.6\\times10^{-2}$'], answer: 1,
      sol: '$N_1/N_0 = e^{-hc\\omega/k_BT} = e^{-1.4388\\times1600/300} = e^{-7.67} = 4.6\\times10^{-4}$. Hot bands are weak at room temperature unless the vibration is soft; heating the gas makes them grow.',
      trap: 'Use $hc/k_B$ in cm K with wavenumbers in cm$^{-1}$.' },
    { id: 'els-033', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'selection rules',
      q: 'Which are electric-dipole selection rules for electronic transitions of diatomic molecules (light molecules, Hund\'s case (a) or (b))?',
      options: ['$\\Delta\\Lambda = 0, \\pm1$', '$\\Delta S = 0$', '$\\Sigma^+ \\leftrightarrow \\Sigma^-$ is allowed', '$g \\leftrightarrow u$ for homonuclear molecules, never $g \\leftrightarrow g$'], answer: [0, 1, 3],
      sol: 'The dipole operator has components with $\\Lambda = 0$ ($z$) and $\\pm1$ ($x \\pm iy$), does not act on spin, is odd under inversion, and is symmetric under reflection in a plane containing the axis. So $\\Delta\\Lambda = 0, \\pm1$; $\\Delta S = 0$; $u \\leftrightarrow g$; and $\\Sigma^+ \\leftrightarrow \\Sigma^+$, $\\Sigma^- \\leftrightarrow \\Sigma^-$ only.',
      trap: 'The $\\pm$ label refers to reflection through a plane containing the axis; the dipole cannot change it for $\\Sigma$ states.' },
    { id: 'els-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'isotope effect',
      q: 'In a molecule, the separation of the $1 \\leftarrow 0$ and $0 \\leftarrow 0$ absorption bands is 500.0 cm$^{-1}$ (treat the upper state as harmonic). For an isotopic species whose reduced mass is 1.20 times larger, the same separation is ______ cm$^{-1}$ (to one decimal place).',
      answer: 456.4, tol: 0.1, unit: 'cm⁻¹', calc: () => 500 / Math.sqrt(1.2),
      sol: 'The separation is the upper-state vibrational quantum, $\\omega \\propto \\sqrt{k/\\mu}$, and the force constant is the same for both isotopes. $500.0/\\sqrt{1.20} = 456.4$ cm$^{-1}$.',
      trap: 'Frequencies scale as $\\mu^{-1/2}$, not $\\mu^{-1}$ (that is the rotational constant).' },
    { id: 'els-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'dissociation energy',
      q: 'Beyond the convergence limit of an absorption progression, the spectrum becomes a continuum because',
      options: ['the molecule ionises', 'the upper state is reached above its dissociation limit, so the atoms fly apart with any kinetic energy', 'the rotational lines merge', 'the ground state dissociates thermally'], answer: 1,
      sol: 'Above the dissociation limit of the upper curve the nuclear motion is unbound, so its energy is not quantised: any photon energy above the limit can be absorbed, the excess going into the kinetic energy of the fragments. This is photodissociation.',
      trap: 'Ionisation needs much more energy and gives Rydberg series, not this continuum.' },
    { id: 'els-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'rotational structure',
      q: 'In a $^1\\Sigma - {}^1\\Sigma$ band with $B\' = 1.5$ cm$^{-1}$ and $B\'\' = 1.7$ cm$^{-1}$, the gap between the first R line, R(0), and the first P line, P(1), is',
      options: ['3.2 cm$^{-1}$', '0.4 cm$^{-1}$', '6.4 cm$^{-1}$', '12.8 cm$^{-1}$'], answer: 2,
      sol: 'R(0): $m = 1$, $\\nu = \\nu_0 + (B\' + B\'\') + (B\' - B\'\')$. P(1): $m = -1$, $\\nu = \\nu_0 - (B\' + B\'\') + (B\' - B\'\')$. Difference $2(B\' + B\'\') = 6.4$ cm$^{-1}$, about twice the normal line spacing, because there is no line at $m = 0$ (the band origin).',
      trap: 'The missing line at the origin is the sign of a $\\Sigma - \\Sigma$ band.' },

    // ---------- level 5 ----------
    { id: 'els-037', type: 'nat', level: 5, exams: ['net'], sub: 'Franck-Condon factors',
      q: 'For displaced harmonic potentials of equal frequency, the $1 \\leftarrow 0$ Franck-Condon factor is $Se^{-S}$. As the displacement varies, its largest possible value is ______ (to three decimal places).',
      answer: 0.368, tol: 0.002, calc: () => Math.exp(-1),
      sol: '$\\frac{d}{dS}(Se^{-S}) = (1 - S)e^{-S} = 0$ at $S = 1$, giving $e^{-1} = 0.368$. With no displacement ($S = 0$) the band vanishes; with a large displacement the intensity moves to higher $v\'$.',
      trap: 'A larger displacement does not keep strengthening a given band; each band peaks at $S = v\'$.' },
    { id: 'els-038', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'molecular orbitals',
      q: 'Which of these molecules is paramagnetic in its ground state?',
      options: ['N$_2$', 'C$_2$', 'B$_2$', 'F$_2$'], answer: 2,
      sol: 'For B$_2$, C$_2$ and N$_2$ the $\\pi_u2p$ orbitals lie below $\\sigma_g2p$. B$_2$ has 6 valence electrons: $(\\sigma_g2s)^2(\\sigma_u^*2s)^2(\\pi_u2p)^2$, the last two in separate $\\pi$ orbitals with parallel spins: $^3\\Sigma_g^-$, paramagnetic. C$_2$ fills $\\pi_u$ ($^1\\Sigma_g^+$), N$_2$ adds $\\sigma_g$, and F$_2$ fills $\\pi_g^*$: all diamagnetic.',
      trap: 'If you put $\\sigma_g2p$ below $\\pi_u2p$ for B$_2$ you would wrongly predict a diamagnetic molecule.' },
    { id: 'els-039', type: 'nat', level: 5, exams: ['net'], sub: 'dissociation energy',
      q: 'A ground state has $D_0\'\' = 30\\,000$ cm$^{-1}$. The 0-0 band of a transition lies at 22 000 cm$^{-1}$, and the upper state dissociates into one ground-state atom and one atom excited by 12 000 cm$^{-1}$. The upper-state dissociation energy $D_0\'$ is ______ eV (to two decimal places). Use 1 eV = 8065.5 cm$^{-1}$.',
      answer: 2.48, tol: 0.01, unit: 'eV', calc: () => (30000 + 12000 - 22000) / 8065.5,
      sol: 'Energy cycle from $v\'\' = 0$ to the upper dissociation limit: $\\nu_{00} + D_0\' = D_0\'\' + E_{exc}$. $D_0\' = 30\\,000 + 12\\,000 - 22\\,000 = 20\\,000$ cm$^{-1}$ $= 2.48$ eV.',
      trap: 'Draw both curves and their asymptotes: the excited atom raises the upper asymptote by $E_{exc}$.' },
    { id: 'els-040', type: 'mcq', level: 5, exams: ['net'], sub: 'Franck-Condon principle',
      q: 'Absorption from a bound state to a purely repulsive upper state gives a continuum whose shape (the reflection principle) maps $|\\psi_{v\'\'}(R)|^2$ onto energy through the steep repulsive curve. Starting from $v\'\' = 1$ instead of $v\'\' = 0$, the continuum shows',
      options: ['a single narrower peak', 'a series of sharp lines', 'no absorption at all', 'two maxima with a minimum between them'], answer: 3,
      sol: 'At each $R$, the vertical transition reaches energy $U\'(R) - E\'\'$; for a steep, nearly linear $U\'$, energy is linear in $R$, so the spectrum copies $|\\psi(R)|^2$. The $v\'\' = 1$ function has one node, so the continuum has two humps with a dip between them (a single broad hump for $v\'\' = 0$).',
      trap: 'Bound-free spectra are continua; their structure comes from the nodes of the initial vibrational function.' },
    ...more2,
  ],
  gens: [
    { id: 'els-g01', type: 'nat', level: 3, exams: ['net'], sub: 'Franck-Condon factors',
      make(r) {
        const S = pick(r, 0.2, 5, 0.1), mode = choose(r, ['ratio', 'frac']), n = int(r, 1, 5), m = int(r, 0, 2);
        const ans = mode === 'ratio' ? pois(S, n) / pois(S, m === n ? 0 : m) : pois(S, n);
        const mm = m === n ? 0 : m;
        return { q: mode === 'ratio'
          ? `Two electronic states have equal vibrational frequencies and a Huang-Rhys factor $S = ${S}$, so $|\\langle v'|0\\rangle|^2 = e^{-S}S^{v'}/v'!$. The intensity ratio of the $${n} \\leftarrow 0$ to the $${mm} \\leftarrow 0$ band is ______ (to three significant figures).`
          : `Two electronic states have equal vibrational frequencies and a Huang-Rhys factor $S = ${S}$. The fraction of the absorption from $v'' = 0$ that goes into the $${n} \\leftarrow 0$ band, $e^{-S}S^{v'}/v'!$, is ______ (to three significant figures).`,
          answer: s3(ans), tol: t6(ans), S, n, mm, mode,
          sol: mode === 'ratio' ? `$\\dfrac{q_{${n}0}}{q_{${mm}0}} = \\dfrac{S^{${n}}/${n}!}{S^{${mm}}/${mm}!} = S^{${n - mm}}\\dfrac{${mm}!}{${n}!} = ${S}^{${n - mm}}\\times\\dfrac{${fact(mm)}}{${fact(n)}} = ${+ans.toPrecision(4)}$.` : `$e^{-${S}}\\times${S}^{${n}}/${n}! = ${round(Math.exp(-S), 5)}\\times${round(S ** n, 4)}/${fact(n)} = ${+ans.toPrecision(4)}$.`,
          trap: 'The $e^{-S}$ cancels in a ratio; it does not in an absolute fraction.' };
      },
      verify: (p) => (p.mode === 'ratio' ? pois(p.S, p.n) / pois(p.S, p.mm) : pois(p.S, p.n)) },
    { id: 'els-g02', type: 'mcq', level: 3, exams: ['net'], sub: 'Franck-Condon factors',
      make(r) {
        const S = int(r, 0, 6) + choose(r, [0.15, 0.3, 0.45, 0.6, 0.8]);
        const k = Math.floor(S);
        const show = (v) => `$${v} \\leftarrow 0$`;
        const o = mcqOptions(r, k, k === 0 ? [1, 2, 3] : [k + 1, k - 1, k + 2], show);
        return { q: `Displaced harmonic potentials of equal frequency have a Huang-Rhys factor $S = ${S}$. The strongest band of the absorption progression from $v'' = 0$ is`, options: o.options, answer: o.answer,
          sol: `The Franck-Condon factors are Poisson, $e^{-S}S^{v'}/v'!$, and successive ratios are $S/v'$. They exceed 1 while $v' < S$, so the peak is at $v' = \\lfloor S\\rfloor = ${k}$.`,
          trap: 'The peak is at the integer part of $S$, not at $S$ rounded.' };
      } },
    { id: 'els-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'band positions',
      make(r) {
        const Te = int(r, 150, 450) * 100, w1 = int(r, 40, 180) * 10, x1 = int(r, 3, 20), w2 = int(r, 60, 240) * 10, x2 = int(r, 4, 25);
        const v1 = int(r, 0, 4), v2 = int(r, 0, 2);
        const ans = Te + G(w1, x1, v1) - G(w2, x2, v2);
        return { q: `An upper state has $T_e = ${Te}$, $\\omega_e' = ${w1}$, $\\omega_e'x_e' = ${x1}$; the ground state has $\\omega_e'' = ${w2}$, $\\omega_e''x_e'' = ${x2}$ (all cm$^{-1}$). The band $v' = ${v1} \\leftarrow v'' = ${v2}$ lies at ______ cm$^{-1}$ (to one decimal place).`,
          answer: round(ans, 2), tol: 0.1, unit: 'cm⁻¹', Te, w1, x1, w2, x2, v1, v2,
          sol: `$G'(${v1}) = ${w1}\\times${v1 + 0.5} - ${x1}\\times${(v1 + 0.5) ** 2} = ${round(G(w1, x1, v1), 3)}$; $G''(${v2}) = ${w2}\\times${v2 + 0.5} - ${x2}\\times${(v2 + 0.5) ** 2} = ${round(G(w2, x2, v2), 3)}$. $\\nu = T_e + G' - G'' = ${round(ans, 3)}$ cm$^{-1}$.`,
          trap: 'Include the half in $(v + \\tfrac12)$ in both states, even for $v = 0$.' };
      },
      verify: (p) => p.Te + G(p.w1, p.x1, p.v1) - G(p.w2, p.x2, p.v2) },
    { id: 'els-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Morse potential',
      make(r) {
        const we = int(r, 30, 300) * 10, wx = int(r, 2, 40) * (choose(r, [0.5, 1])), mode = choose(r, ['De', 'D0', 'vmax']);
        const De = we * we / (4 * wx), D0 = De - G(we, wx, 0), vm = Math.ceil(we / (2 * wx) - 0.5) - 1;
        const vmax = Math.floor(we / (2 * wx) - 0.5 - 1e-9);
        const ans = mode === 'De' ? De : mode === 'D0' ? D0 : vmax;
        return { q: `An electronic state is a Morse oscillator with $\\omega_e = ${we}$ cm$^{-1}$ and $\\omega_ex_e = ${wx}$ cm$^{-1}$. ${mode === 'De' ? 'Its well depth $D_e$ is ______ cm$^{-1}$ (to three significant figures).' : mode === 'D0' ? 'Its dissociation energy from $v = 0$, $D_0$, is ______ cm$^{-1}$ (to three significant figures).' : 'The highest bound vibrational quantum number is ______.'}`,
          answer: mode === 'vmax' ? vmax : s3(ans), tol: mode === 'vmax' ? 0 : t6(ans), unit: mode === 'vmax' ? undefined : 'cm⁻¹', we, wx, mode, vm,
          sol: mode === 'vmax' ? `$G(v)$ peaks at $v + \\tfrac12 = \\omega_e/2\\omega_ex_e = ${round(we / (2 * wx), 4)}$, so the highest bound level is $v = ${vmax}$.` : `$D_e = \\omega_e^2/4\\omega_ex_e = ${we}^2/(4\\times${wx}) = ${+De.toPrecision(5)}$ cm$^{-1}$.${mode === 'D0' ? ` $G(0) = \\omega_e/2 - \\omega_ex_e/4 = ${round(G(we, wx, 0), 3)}$, so $D_0 = D_e - G(0) = ${+D0.toPrecision(5)}$ cm$^{-1}$.` : ''}`,
          trap: '$D_0$ is smaller than $D_e$ by the zero-point energy.' };
      },
      verify: (p) => (p.mode === 'De' ? p.we ** 2 / (4 * p.wx) : p.mode === 'D0' ? p.we ** 2 / (4 * p.wx) - G(p.we, p.wx, 0) : Math.floor(p.we / (2 * p.wx) - 0.5 - 1e-9)) },
    { id: 'els-g05', type: 'nat', level: 4, exams: ['net'], sub: 'dissociation energy',
      make(r) {
        const D0g = int(r, 150, 500) * 100, Ex = int(r, 50, 200) * 100, nu00 = int(r, 120, Math.floor((D0g + Ex) / 100) - 10) * 100, mode = choose(r, ['D0u', 'D0g', 'lim']);
        const D0u = D0g + Ex - nu00;
        let ans, q, sol;
        if (mode === 'D0u') { ans = D0u / EV; q = `The ground state has $D_0'' = ${D0g}$ cm$^{-1}$; the 0-0 band of a transition is at ${nu00} cm$^{-1}$; the upper state dissociates into a ground-state atom and an atom excited by ${Ex} cm$^{-1}$. The upper-state $D_0'$ is ______ eV (to three significant figures).`; sol = `$\\nu_{00} + D_0' = D_0'' + E_{exc}$: $D_0' = ${D0g} + ${Ex} - ${nu00} = ${D0u}$ cm$^{-1}$ $= ${+ans.toPrecision(4)}$ eV.`; }
        else if (mode === 'D0g') { const lim = nu00 + D0u; ans = (lim - Ex) / EV; q = `An absorption progression from $v'' = 0$ converges at ${lim} cm$^{-1}$, where the molecule dissociates into a ground-state atom and an atom excited by ${Ex} cm$^{-1}$. The ground-state $D_0''$ is ______ eV (to three significant figures).`; sol = `Convergence limit $= D_0'' + E_{exc}$, so $D_0'' = ${lim} - ${Ex} = ${lim - Ex}$ cm$^{-1}$ $= ${+ans.toPrecision(4)}$ eV.`; }
        else { ans = (nu00 + D0u) / EV; q = `The 0-0 band of a transition is at ${nu00} cm$^{-1}$ and the upper state has $D_0' = ${D0u}$ cm$^{-1}$. The absorption progression from $v'' = 0$ converges at ______ eV (to three significant figures).`; sol = `Limit $= \\nu_{00} + D_0' = ${nu00 + D0u}$ cm$^{-1}$ $= ${+ans.toPrecision(4)}$ eV.`; }
        return { q: q + ' Use 1 eV = 8065.5 cm$^{-1}$.', answer: s3(ans), tol: t6(ans), unit: 'eV', D0g, Ex, nu00, mode, sol,
          trap: 'Write the energy cycle: $\\nu_{00} + D_0\' = D_0\'\' + E_{exc}$, all measured from $v\'\' = 0$.' };
      },
      verify: (p) => { const D0u = p.D0g + p.Ex - p.nu00; return (p.mode === 'D0u' ? D0u : p.mode === 'D0g' ? p.D0g : p.nu00 + D0u) / EV; } },
    { id: 'els-g06', type: 'nat', level: 4, exams: ['net'], sub: 'band heads',
      make(r) {
        const B2 = pick(r, 0.3, 10, 0.05), dB = round(B2 * pick(r, 0.03, 0.3, 0.01), 3), sign = choose(r, [-1, 1]), mode = choose(r, ['J', 'off']);
        const B1 = round(B2 + sign * dB, 4);
        const mh = -(B1 + B2) / (2 * (B1 - B2)), off = -((B1 + B2) ** 2) / (4 * (B1 - B2));
        const red = B1 < B2;
        const Jh = red ? Math.round(mh) - 1 : Math.round(-mh);
        const ans = mode === 'J' ? Jh : off;
        return { q: `A $^1\\Sigma - {}^1\\Sigma$ band has $B' = ${B1}$ cm$^{-1}$ and $B'' = ${B2}$ cm$^{-1}$. ${mode === 'J' ? `The head forms in the ${red ? 'R' : 'P'} branch; the lower-state $J''$ of the line nearest the head is ______.` : 'Treating $m$ as continuous, the head lies ______ cm$^{-1}$ from the band origin (positive if above it; to three significant figures).'}`,
          answer: mode === 'J' ? Jh : s3(ans), tol: mode === 'J' ? 1 : t6(ans), unit: mode === 'J' ? undefined : 'cm⁻¹', B1, B2, mode,
          sol: `$\\nu = \\nu_0 + (B' + B'')m + (B' - B'')m^2$ turns at $m_h = -(B' + B'')/2(B' - B'') = ${round(mh, 3)}$${mode === 'J' ? `, i.e. ${red ? `$J'' = m - 1 \\approx ${Jh}$ in the R branch (band shaded to the red)` : `$J'' = -m \\approx ${Jh}$ in the P branch (band shaded to the violet)`}.` : `; there $\\nu_h - \\nu_0 = -(B' + B'')^2/4(B' - B'') = ${+off.toPrecision(4)}$ cm$^{-1}$.`}`,
          trap: '$m = J\'\' + 1$ in the R branch and $m = -J\'\'$ in the P branch.' };
      },
      verify: (p) => { const mh = -(p.B1 + p.B2) / (2 * (p.B1 - p.B2)); return p.mode === 'J' ? (p.B1 < p.B2 ? Math.round(mh) - 1 : Math.round(-mh)) : -((p.B1 + p.B2) ** 2) / (4 * (p.B1 - p.B2)); } },
    { id: 'els-g07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'band heads',
      make(r) {
        const B2 = pick(r, 0.5, 8, 0.05), longer = choose(r, [true, false]), f = pick(r, 0.75, 0.95, 0.01);
        const B1 = round(longer ? B2 * f : B2 / f, 3);
        const S = ['head in the R branch; band shaded (degraded) to the red', 'head in the P branch; band shaded (degraded) to the violet', 'no head; the lines are equally spaced', 'head in the Q branch at the band origin'];
        const k = B1 < B2 ? 0 : 1;
        const o = mcqOptions(r, S[k], S.filter((_, i) => i !== k));
        return { q: `A $^1\\Sigma - {}^1\\Sigma$ band has $B' = ${B1}$ cm$^{-1}$ (upper) and $B'' = ${B2}$ cm$^{-1}$ (lower). Its rotational structure has a`, options: o.options, answer: o.answer,
          sol: `$\\nu = \\nu_0 + (B' + B'')m + (B' - B'')m^2$. Here $B' ${B1 < B2 ? '<' : '>'} B''$, so the $m^2$ term is ${B1 < B2 ? 'negative and the R branch ($m > 0$) turns back: a head on the high-wavenumber side, lines running off to the red' : 'positive and the P branch ($m < 0$) turns back: a head on the low-wavenumber side, lines running off to the violet'}. ${B1 < B2 ? 'The upper state has the longer bond.' : 'The upper state has the shorter bond.'}`,
          trap: 'Smaller $B\'$ means a longer bond in the upper state, the usual case after exciting a bonding electron.' };
      } },
    { id: 'els-g08', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'selection rules',
      make(r) {
        const SETS = [
          ['$^1\\Sigma_g^+$ (homonuclear)', ['$^1\\Sigma_u^+$', '$^1\\Pi_u$'], ['$^1\\Sigma_g^+$', '$^1\\Pi_g$', '$^3\\Sigma_u^+$', '$^1\\Sigma_u^-$', '$^1\\Delta_u$', '$^3\\Pi_u$']],
          ['$^3\\Sigma_g^-$ (homonuclear)', ['$^3\\Sigma_u^-$', '$^3\\Pi_u$'], ['$^3\\Sigma_u^+$', '$^3\\Sigma_g^-$', '$^1\\Sigma_u^-$', '$^3\\Delta_u$', '$^3\\Pi_g$', '$^1\\Pi_u$']],
          ['$^1\\Sigma^+$ (heteronuclear)', ['$^1\\Sigma^+$', '$^1\\Pi$'], ['$^1\\Sigma^-$', '$^1\\Delta$', '$^3\\Sigma^+$', '$^3\\Pi$', '$^1\\Phi$']],
          ['$^2\\Pi$ (heteronuclear)', ['$^2\\Sigma^+$', '$^2\\Delta$', '$^2\\Pi$', '$^2\\Sigma^-$'], ['$^4\\Pi$', '$^2\\Phi$', '$^4\\Sigma^-$', '$^4\\Delta$']],
        ];
        const [g, ok, bad] = choose(r, SETS);
        const askForbidden = choose(r, [false, true]);
        let correct, wrongs;
        if (!askForbidden) { correct = choose(r, ok); wrongs = [bad[int(r, 0, 1)], bad[int(r, 2, 3)], bad[bad.length - 1]]; }
        else { correct = choose(r, bad); wrongs = ok.length >= 3 ? ok.slice(0, 3) : ok.concat(['all of the other options can be reached']); }
        const o = mcqOptions(r, correct, wrongs);
        return { q: `A diatomic molecule has a ${g} ground state. ${askForbidden ? 'Which upper state can NOT be reached by an electric-dipole transition from it?' : 'Which upper state can be reached from it by an electric-dipole transition?'}`, options: o.options, answer: o.answer,
          sol: `Check $\\Delta\\Lambda = 0, \\pm1$; $\\Delta S = 0$; $g \\leftrightarrow u$ (homonuclear only); $\\Sigma^+ \\leftrightarrow \\Sigma^+$, $\\Sigma^- \\leftrightarrow \\Sigma^-$. Allowed from ${g}: ${ok.join(', ')}. ${askForbidden ? `${correct} breaks at least one rule.` : `${correct} satisfies all of them.`}`,
          trap: 'Test every rule; most wrong choices break only one of them.' };
      } },
    { id: 'els-g09', type: 'nat', level: 4, exams: ['net'], sub: 'Franck-Condon factors',
      make(r) {
        const [nm, mu, w] = choose(r, [['H$_2$-like', 0.504, 4400], ['CO-like', 6.86, 2170], ['N$_2$-like', 7.0, 2360], ['O$_2$-like', 8.0, 1580], ['I$_2$-like', 63.45, 214], ['Cl$_2$-like', 17.48, 560], ['NO-like', 7.47, 1900], ['Na$_2$-like', 11.5, 159]]);
        const dr = pick(r, 0.01, 0.4, 0.005);
        const S = mu * U * 2 * Math.PI * CCM * w * (dr * 1e-10) ** 2 / (2 * HBAR);
        return { q: `For a ${nm} molecule (reduced mass ${mu} u, vibrational wavenumber ${w} cm$^{-1}$ taken equal in both electronic states), the equilibrium separations differ by ${dr} Å. The Huang-Rhys factor $S = \\mu\\omega(\\Delta r)^2/2\\hbar$ is ______ (to three significant figures).`,
          answer: s3(S), tol: t6(S), mu, w, dr,
          sol: `$\\omega = 2\\pi c\\tilde\\nu = ${sci(2 * Math.PI * CCM * w)}$ rad/s, $\\mu = ${sci(mu * U)}$ kg, $\\Delta r = ${dr}\\times10^{-10}$ m. $S = \\mu\\omega\\Delta r^2/2\\hbar = ${+S.toPrecision(4)}$. The progression peaks near $v' = \\lfloor S\\rfloor$.`,
          trap: 'Light, stiff molecules need a larger displacement for the same $S$.' };
      },
      verify: (p) => p.mu * U * 2 * Math.PI * CCM * p.w * (p.dr * 1e-10) ** 2 / (2 * HBAR) },
    { id: 'els-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'progressions',
      make(r) {
        const we = int(r, 20, 250) * 10, wx = int(r, 1, 25), nu0 = int(r, 120, 400) * 100, mode = choose(r, ['we', 'wx']);
        const b = [0, 1, 2].map((v) => nu0 + G(we, wx, v) - G(we, wx, 0));
        const ans = mode === 'we' ? we : wx;
        return { q: `Absorption bands from $v'' = 0$ to $v' = 0, 1, 2$ lie at ${b.map((x) => round(x, 2)).join(', ')} cm$^{-1}$. The upper-state ${mode === 'we' ? '$\\omega_e\'$' : 'anharmonicity constant $\\omega_e\'x_e\'$'} is ______ cm$^{-1}$.`,
          answer: ans, tol: 0.5, unit: 'cm⁻¹', b, mode,
          sol: `Intervals $\\Delta G(\\tfrac12) = ${round(b[1] - b[0], 2)}$ and $\\Delta G(\\tfrac32) = ${round(b[2] - b[1], 2)}$. Their difference is $2\\omega_ex_e = ${round(b[1] - b[0] - (b[2] - b[1]), 2)}$, so $\\omega_ex_e = ${wx}$ and $\\omega_e = \\Delta G(\\tfrac12) + 2\\omega_ex_e = ${we}$ cm$^{-1}$.`,
          trap: 'The first interval is $\\omega_e - 2\\omega_ex_e$.' };
      },
      verify: (p) => { const d1 = p.b[1] - p.b[0], d2 = p.b[2] - p.b[1], wx = (d1 - d2) / 2; return p.mode === 'we' ? d1 + 2 * wx : wx; } },
    { id: 'els-g11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hot bands',
      make(r) {
        const w = int(r, 10, 300) * 10, T = choose(r, [77, 300, 500, 1000, 2000]), v = int(r, 1, 2);
        const x = C2 * w * v / T, ans = Math.exp(-x);
        const tiny = ans < 1e-3;
        return { q: `The ground-state vibrational interval is ${w} cm$^{-1}$ (treat as harmonic). At ${T} K the population of $v'' = ${v}$ relative to $v'' = 0$ is ${tiny ? '$10^y$; $y$ is ______ (to two decimal places)' : '______ (to three significant figures)'}. Use $hc/k_B = 1.4388$ cm K.`,
          answer: tiny ? round(-x / Math.LN10, 2) : s3(ans), tol: tiny ? 0.01 : t6(ans), w, T, v, tiny,
          sol: `$N_${v}/N_0 = e^{-${v === 1 ? '' : v}hc\\omega/k_BT} = e^{-1.4388\\times${w}\\times${v}/${T}} = e^{-${round(x, 4)}}$${tiny ? ` $= 10^{-${round(x / Math.LN10, 3)}}$.` : ` $= ${+ans.toPrecision(4)}$.`} Hot bands from $v'' = ${v}$ scale with this population.`,
          trap: 'The energy above $v = 0$ is $v\\,hc\\omega$ for a harmonic oscillator; zero-point energy cancels.' };
      },
      verify: (p) => { const x = C2 * p.w * p.v / p.T; return p.tiny ? -x / Math.LN10 : Math.exp(-x); } },
    { id: 'els-g12', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'molecular orbitals',
      make(r) {
        const M = [['H$_2^+$', 0.5], ['H$_2$', 1], ['He$_2^+$', 0.5], ['Li$_2$', 1], ['B$_2$', 1], ['C$_2$', 2], ['N$_2$', 3], ['N$_2^+$', 2.5], ['O$_2$', 2], ['O$_2^+$', 2.5], ['O$_2^-$', 1.5], ['F$_2$', 1], ['NO', 2.5], ['CO', 3], ['CN$^-$', 3], ['O$_2^{2-}$', 1]];
        const [nm, bo] = choose(r, M);
        const all = [0.5, 1, 1.5, 2, 2.5, 3].filter((x) => x !== bo);
        const o = mcqOptions(r, bo, [all[int(r, 0, 1)], all[int(r, 2, 3)], all[4]], (x) => String(x));
        return { q: `In simple molecular-orbital theory, the bond order of ${nm} is`, options: o.options, answer: o.answer,
          sol: `Bond order $= \\tfrac12$(bonding electrons $-$ antibonding electrons). Filling the MOs in order (with $\\pi_u2p$ below $\\sigma_g2p$ up to N$_2$) gives ${bo} for ${nm}.`,
          trap: 'Electrons added to $\\pi^*$ lower the bond order; electrons removed from $\\pi^*$ raise it.' };
      } },
    { id: 'els-g13', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rotational structure',
      make(r) {
        const B2 = pick(r, 0.5, 10, 0.05), B1 = round(B2 * pick(r, 0.8, 1.05, 0.01), 3), nu0 = int(r, 150, 400) * 100, J = int(r, 0, 12), br = choose(r, ['R', 'P', 'gap']);
        const line = (m) => nu0 + (B1 + B2) * m + (B1 - B2) * m * m;
        const JJ = br === 'P' ? Math.max(1, J) : J;
        const ans = br === 'R' ? line(JJ + 1) - nu0 : br === 'P' ? line(-JJ) - nu0 : line(1) - line(-1);
        return { q: br === 'gap' ? `A $^1\\Sigma - {}^1\\Sigma$ band has $B' = ${B1}$ and $B'' = ${B2}$ cm$^{-1}$. The gap between the R(0) and P(1) lines is ______ cm$^{-1}$ (to three significant figures).`
          : `A $^1\\Sigma - {}^1\\Sigma$ band with origin $\\nu_0$ has $B' = ${B1}$ and $B'' = ${B2}$ cm$^{-1}$. The ${br}(${JJ}) line lies ______ cm$^{-1}$ from $\\nu_0$ (positive if above it; to three significant figures).`,
          answer: s3(ans), tol: Math.max(0.01, t6(ans)), unit: 'cm⁻¹', B1, B2, JJ, br,
          sol: `Lines: $\\nu = \\nu_0 + (B' + B'')m + (B' - B'')m^2$ with $m = J'' + 1$ (R) or $m = -J''$ (P). ${br === 'gap' ? `R(0) at $m = 1$, P(1) at $m = -1$: gap $= 2(B' + B'') = ${+ans.toPrecision(4)}$ cm$^{-1}$.` : `${br}(${JJ}): $m = ${br === 'R' ? JJ + 1 : -JJ}$, offset $= ${round(B1 + B2, 4)}\\times(${br === 'R' ? JJ + 1 : -JJ}) + (${round(B1 - B2, 4)})\\times${(br === 'R' ? JJ + 1 : JJ) ** 2} = ${+ans.toPrecision(4)}$ cm$^{-1}$.`}`,
          trap: 'R(J) uses $m = J + 1$; P(J) uses $m = -J$; there is no line at $m = 0$.' };
      },
      verify: (p) => { const L = (m) => (p.B1 + p.B2) * m + (p.B1 - p.B2) * m * m; return p.br === 'R' ? L(p.JJ + 1) : p.br === 'P' ? L(-p.JJ) : L(1) - L(-1); } },
    ...more,
  ],
};
