// Magnetic resonance: ESR and NMR (CSIR NET Part C atomic and molecular physics): Larmor precession and resonance,
// gyromagnetic ratios and g factors, populations and Curie magnetisation, rotating frame, pulses, Bloch equations,
// T1 and T2, linewidths, spin echoes, inversion recovery, chemical shift and J coupling, multiplets, ESR hyperfine
// structure and line counts, transition-metal ions, zero-field splitting, MRI gradients and sensitivity.
// Original questions for CSIR NET (and GATE) practice (fibub). Zeeman energies and simple ESR g values are in `zeeman-stark`.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './esr-nmr.more.gen.js';
import more2 from './esr-nmr.more2.gen.js';
import r4 from './esr-nmr.r4.gen.js';
import r5 from './esr-nmr.r5.gen.js';

const H = 6.62607015e-34, KB = 1.380649e-23;
const s3 = (x) => +x.toPrecision(3), t6 = (x) => +(Math.abs(x) * 0.006).toPrecision(2);
// [name, gamma/2pi in MHz/T, spin]
const NUC = [['$^1$H', 42.577, 0.5], ['$^{13}$C', 10.708, 0.5], ['$^{19}$F', 40.078, 0.5], ['$^{31}$P', 17.235, 0.5], ['$^2$H', 6.536, 1], ['$^{23}$Na', 11.262, 1.5], ['$^{15}$N', 4.316, 0.5], ['$^{7}$Li', 16.546, 1.5]];
const MUB_H = 13.996;   // GHz/T
const binom = (n, k) => { let c = 1; for (let i = 1; i <= k; i++) c = c * (n - k + i) / i; return Math.round(c); };
const fr = (I) => (I === 0.5 ? '1/2' : I === 1.5 ? '3/2' : I === 2.5 ? '5/2' : I === 3.5 ? '7/2' : String(I));

import { tidyPhys } from './_signs.js';

const topicBank = {
  topic: 'esr-nmr',
  items: [
    // ---------- level 1 ----------
    { id: 'nmr-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Larmor frequency',
      q: 'The proton NMR (Larmor) frequency in a field of 1.0 T is about',
      options: ['42.6 MHz', '28.0 GHz', '267.5 MHz', '14.0 GHz'], answer: 0,
      sol: '$\\nu = \\gamma B/2\\pi$ with $\\gamma_p/2\\pi = 42.58$ MHz/T, so 42.6 MHz at 1 T (and 400 MHz at 9.4 T).',
      trap: '267.5 is $\\gamma_p$ in units of $10^6$ rad s$^{-1}$ T$^{-1}$, an angular frequency; 28 GHz is the electron.' },
    { id: 'nmr-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'nuclear spin',
      q: 'Which of these nuclei gives no NMR signal?',
      options: ['$^1$H', '$^{13}$C', '$^{12}$C', '$^{19}$F'], answer: 2,
      sol: '$^{12}$C has even numbers of protons and neutrons, so its ground-state spin is $I = 0$: no magnetic moment, no Zeeman levels. That is why organic carbon NMR uses the 1.1% of $^{13}$C ($I = 1/2$).',
      trap: 'Even-even nuclei always have $I = 0$ in their ground state.' },
    { id: 'nmr-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'ESR basics',
      q: 'Which of these gives an ESR signal?',
      options: ['N$_2$ molecules', 'Water', 'Helium atoms in the ground state', 'The methyl radical CH$_3^\\bullet$'], answer: 3,
      sol: 'ESR needs a net electron spin: an unpaired electron, as in a free radical (or a transition-metal ion). N$_2$, H$_2$O and ground-state He have all electrons paired ($S = 0$).',
      trap: 'Nuclear spins do not count for ESR; electron spins do.' },
    { id: 'nmr-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'nuclear spin',
      q: 'In a magnetic field, a nucleus of spin $I$ has how many Zeeman energy levels?',
      options: ['$2I$', '$2I + 1$', '$I + 1$', '$I(I + 1)$'], answer: 1,
      sol: '$E = -\\gamma\\hbar Bm_I$ with $m_I = -I, -I+1, \\dots, I$: $2I + 1$ equally spaced levels. With the rule $\\Delta m_I = \\pm1$ all transitions have the same frequency $\\gamma B/2\\pi$.',
      trap: '$I(I+1)$ appears in the size of the angular momentum, not in the number of levels.' },
    { id: 'nmr-005', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Larmor frequency',
      q: 'The magnetic field needed for a 600 MHz proton NMR spectrometer is ______ T (to two decimal places). Use $\\gamma_p/2\\pi = 42.577$ MHz/T.',
      answer: 14.09, tol: 0.01, unit: 'T', calc: () => 600 / 42.577,
      sol: '$B = \\nu/(\\gamma/2\\pi) = 600/42.577 = 14.09$ T. Spectrometers are named by their proton frequency.',
      trap: 'Use $\\gamma/2\\pi$ in MHz/T with the frequency in MHz.' },
    { id: 'nmr-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'ESR basics',
      q: 'In the same magnetic field, the ESR frequency of a free electron is larger than the proton NMR frequency by a factor of about',
      options: ['1836', '658', '42.6', '2.79'], answer: 1,
      sol: '$\\nu_e/\\nu_p = 28.025\\ \\text{GHz/T}/42.577\\ \\text{MHz/T} = 658$. The electron is 1836 times lighter, but the proton\'s $g$ factor (5.59) is larger than the electron\'s (2.00): $1836\\times2.0023/5.586 = 658$.',
      trap: 'The mass ratio alone (1836) ignores the different $g$ factors.' },

    // ---------- level 2 ----------
    { id: 'nmr-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Larmor frequency',
      q: 'On a "400 MHz" spectrometer (protons at 400.0 MHz), the $^{13}$C nuclei resonate at ______ MHz (to one decimal place). Use $\\gamma/2\\pi = 42.577$ MHz/T for $^1$H and $10.708$ MHz/T for $^{13}$C.',
      answer: 100.6, tol: 0.1, unit: 'MHz', calc: () => 400 * 10.708 / 42.577,
      sol: 'Same field, so frequencies scale with $\\gamma$: $400.0\\times10.708/42.577 = 100.6$ MHz.',
      trap: 'The field is fixed; only the gyromagnetic ratio changes.' },
    { id: 'nmr-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'chemical shift',
      q: 'On a 400 MHz spectrometer a proton line lies 1200 Hz above the TMS reference. Its chemical shift is',
      options: ['3.0 ppm', '0.3 ppm', '1.2 ppm', '30 ppm'], answer: 0,
      sol: '$\\delta = (\\nu - \\nu_{ref})/\\nu_0\\times10^6 = 1200/(400\\times10^6)\\times10^6 = 3.0$ ppm.',
      trap: 'Divide by the spectrometer frequency in Hz, then multiply by $10^6$.' },
    { id: 'nmr-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'J coupling',
      q: 'In the proton NMR spectrum of ethanol\'s ethyl group (CH$_3$CH$_2$–), ignoring coupling to OH, the CH$_2$ signal is',
      options: ['a triplet, 1:2:1', 'a doublet, 1:1', 'a quartet, 1:3:3:1', 'a single line'], answer: 2,
      sol: 'The CH$_2$ protons see three equivalent CH$_3$ protons, whose total $m$ can be $\\pm3/2$ (1 way each) or $\\pm1/2$ (3 ways each): $n + 1 = 4$ lines in the binomial ratio 1:3:3:1. The CH$_3$ signal is a 1:2:1 triplet from the two CH$_2$ protons.',
      trap: 'A group is split by its neighbours, not by its own equivalent protons.' },
    { id: 'nmr-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'hyperfine',
      q: 'The ESR spectrum of the methyl radical CH$_3^\\bullet$ in solution consists of',
      options: ['3 lines, 1:2:1', '4 lines, 1:3:3:1', '4 lines of equal intensity', '2 lines, 1:1'], answer: 1,
      sol: 'The unpaired electron couples equally to three protons ($I = 1/2$): $2nI + 1 = 4$ lines, intensities from the number of ways to make each total $M_I$: 1:3:3:1. The splitting is about 2.3 mT.',
      trap: 'Equal intensities would need a single nucleus of spin 3/2, not three equivalent protons.' },
    { id: 'nmr-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'hyperfine',
      q: 'A nitroxide spin label has its unpaired electron mainly on one $^{14}$N nucleus ($I = 1$). Its ESR spectrum in a mobile solution shows',
      options: ['2 lines of equal intensity', '3 lines, 1:2:1', '4 lines, 1:3:3:1', '3 lines of equal intensity'], answer: 3,
      sol: 'One nucleus of spin 1 has $m_I = -1, 0, +1$, each equally likely: three equally intense, equally spaced lines. A 1:2:1 triplet comes from two equivalent spin-1/2 nuclei instead.',
      trap: 'Binomial intensities arise from several equivalent nuclei, not from one nucleus of higher spin.' },
    { id: 'nmr-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'chemical shift',
      q: 'A sample is moved from a 300 MHz to a 600 MHz spectrometer. Which statements are true?',
      options: ['Chemical shifts in ppm are unchanged', 'Spin-spin couplings $J$ in Hz are unchanged', 'The separation in Hz between two chemically shifted lines doubles', 'The coupling constants $J$ in Hz double'], answer: [0, 1, 2],
      sol: 'Shielding fields are proportional to $B_0$, so shifts in Hz scale with $B_0$ and in ppm do not. $J$ comes from the nuclear spins\' interaction through the bonding electrons, independent of $B_0$. That is why higher fields spread multiplets apart and simplify spectra.',
      trap: 'Telling shift from coupling is exactly what running at two fields does.' },
    { id: 'nmr-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Larmor precession',
      q: 'A magnetic moment $\\boldsymbol\\mu = \\gamma\\mathbf J$ in a uniform field $\\mathbf B$ precesses about $\\mathbf B$ with angular frequency',
      options: ['$\\gamma B\\sin\\theta$, where $\\theta$ is the angle to the field', '$\\gamma B$, whatever the angle', '$\\gamma B/2$', '$\\gamma B\\cos\\theta$'], answer: 1,
      sol: '$d\\mathbf J/dt = \\boldsymbol\\mu\\times\\mathbf B = \\gamma\\mathbf J\\times\\mathbf B$, so $\\mathbf J$ rotates about $\\mathbf B$ at $\\omega = \\gamma B$ (Larmor). The angle only sets the size of the cone, not the rate.',
      trap: 'The torque is proportional to $\\sin\\theta$, but so is the radius of the cone; the rate is independent of angle.' },
    { id: 'nmr-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'pulses',
      q: 'A radio-frequency field of amplitude $B_1 = 1.0$ mT (in the rotating frame) acts on protons at resonance. The length of a 90° pulse is ______ μs (to two decimal places). Use $\\gamma_p = 2.675\\times10^8$ rad s$^{-1}$ T$^{-1}$.',
      answer: 5.87, tol: 0.02, unit: 'μs', calc: () => Math.PI / 2 / (2.675e8 * 1e-3) * 1e6,
      sol: 'In the rotating frame the magnetisation nutates about $B_1$ at $\\omega_1 = \\gamma B_1 = 2.675\\times10^5$ rad/s. A 90° turn takes $t = (\\pi/2)/\\omega_1 = 5.87$ μs.',
      trap: 'Use $\\gamma$ in rad s$^{-1}$ T$^{-1}$ with angles in radians.' },
    { id: 'nmr-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'relaxation',
      q: 'A homogeneously broadened NMR line (Lorentzian) has a full width at half maximum of 2.0 Hz. The transverse relaxation time $T_2$ is',
      options: ['0.50 s', '0.080 s', '3.1 s', '0.16 s'], answer: 3,
      sol: 'An FID decaying as $e^{-t/T_2}$ gives a Lorentzian of FWHM $\\Delta\\nu = 1/(\\pi T_2)$. So $T_2 = 1/(\\pi\\times2.0) = 0.16$ s.',
      trap: '$1/\\Delta\\nu = 0.5$ s forgets the $\\pi$.' },
    { id: 'nmr-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'relaxation',
      q: 'In an inversion-recovery experiment (180° pulse, wait $t$, 90° pulse), the signal passes through zero at $t = 0.35$ s. The longitudinal relaxation time $T_1$ is about',
      options: ['0.24 s', '0.35 s', '0.50 s', '0.70 s'], answer: 2,
      sol: 'After inversion, $M_z = M_0(1 - 2e^{-t/T_1})$, which is zero when $t = T_1\\ln2$. So $T_1 = 0.35/0.693 = 0.50$ s.',
      trap: 'The null comes at $0.69\\,T_1$, not at $T_1$.' },

    // ---------- level 3 ----------
    { id: 'nmr-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'populations',
      q: 'For protons at 300 K in a field where they resonate at 400 MHz, the fractional excess $(N_\\uparrow - N_\\downarrow)/N$ is ______ ppm (to one decimal place). Use $h = 6.626\\times10^{-34}$ J s and $k_B = 1.381\\times10^{-23}$ J/K.',
      answer: 32.0, tol: 0.2, unit: 'ppm', calc: () => 6.626e-34 * 400e6 / (2 * 1.381e-23 * 300) * 1e6,
      sol: 'For spin 1/2, $(N_\\uparrow - N_\\downarrow)/N = \\tanh(h\\nu/2k_BT) \\approx h\\nu/2k_BT = 6.626\\times10^{-34}\\times4\\times10^8/(2\\times1.381\\times10^{-23}\\times300) = 3.20\\times10^{-5}$: 32 ppm. NMR sees only this tiny excess, which is why it is insensitive.',
      trap: 'Use $h\\nu/2k_BT$ for the difference divided by the total; $h\\nu/k_BT$ is the difference divided by one population.' },
    { id: 'nmr-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'ESR basics',
      q: 'ESR spectrometers usually keep the microwave frequency fixed and sweep the magnetic field. The main reason is that',
      options: ['the resonant cavity and microwave source work efficiently only over a narrow band of frequencies', 'sweeping the field changes the g factor', 'the field cannot be held constant', 'the frequency would have to be swept through zero'], answer: 0,
      sol: 'Sensitivity comes from a high-Q resonant cavity, which by design works at one frequency (about 9.5 GHz at X-band). Sweeping the magnet is easy and leaves the microwave circuit tuned. Spectra are therefore plotted against field, usually as the first derivative from field modulation and lock-in detection.',
      trap: 'The g factor is a property of the radical, not of the sweep.' },
    { id: 'nmr-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hyperfine',
      q: 'The benzene radical anion C$_6$H$_6^-$ has its unpaired electron spread equally over six protons. In its ESR spectrum, the intensity of the strongest line divided by that of an outermost line is ______.',
      answer: 20, tol: 0, calc: () => binom(6, 3),
      sol: 'Six equivalent spin-1/2 nuclei: $2nI + 1 = 7$ lines with binomial intensities 1:6:15:20:15:6:1. The central line ($M_I = 0$, $\\binom63 = 20$ arrangements) over an outer one ($\\binom60 = 1$) gives 20.',
      trap: 'Count arrangements of the nuclear spins, $\\binom{n}{k}$.' },
    { id: 'nmr-020', type: 'mcq', level: 3, exams: ['net'], sub: 'hyperfine',
      q: 'A radical has its unpaired electron coupled to two different sets of four equivalent protons, with two different coupling constants (as in the naphthalene anion). The maximum number of ESR lines is',
      options: ['9', '16', '25', '8'], answer: 2,
      sol: 'Each set of four protons splits every line into $2\\times4\\times\\frac12 + 1 = 5$. Two independent sets give $5\\times5 = 25$ lines (if none overlap).',
      trap: 'Different sets multiply; only equivalent nuclei combine into one binomial pattern (8 protons would give 9).' },
    { id: 'nmr-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hyperfine',
      q: 'The hyperfine splitting of the hydrogen atom ground state is 1420.4 MHz. In an ESR spectrum of H atoms (g = 2.0023) it shows as two lines separated by about ______ mT (to one decimal place). Use $\\mu_B/h = 13.996$ GHz/T.',
      answer: 50.7, tol: 0.1, unit: 'mT', calc: () => 1420.4 / (2.0023 * 13.996),
      sol: 'To first order the two lines ($m_I = \\pm1/2$) are separated by $a/(g\\mu_B)$: $1420.4\\ \\text{MHz}/(2.0023\\times13.996\\ \\text{GHz/T}) = 1420.4/28.024$ mT $= 50.7$ mT.',
      trap: 'MHz divided by GHz/T gives mT.' },
    { id: 'nmr-022', type: 'mcq', level: 3, exams: ['net'], sub: 'hyperfine',
      q: 'The ESR spectrum of the CD$_3^\\bullet$ radical (deuterium has $I = 1$) has',
      options: ['4 lines, 1:3:3:1', '7 lines, 1:6:15:20:15:6:1', '7 lines, 1:3:6:7:6:3:1', '7 lines of equal intensity'], answer: 2,
      sol: '$2nI + 1 = 2\\times3\\times1 + 1 = 7$ lines. Intensities: the number of ways three spins with $m = -1, 0, 1$ add to $M = -3\\dots3$: 1, 3, 6, 7, 6, 3, 1. The splitting is smaller than in CH$_3$ by $\\gamma_D/\\gamma_H = 0.154$.',
      trap: 'Binomial (Pascal) intensities hold only for spin-1/2 nuclei.' },
    { id: 'nmr-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'spin echo',
      q: 'In a Hahn echo sequence (90°, wait $\\tau$, 180°), which statement is correct?',
      options: ['The echo appears at time $\\tau$ after the 180° pulse and its height decays with $T_2$, not $T_2^*$', 'The echo refocuses all dephasing, including true $T_2$ relaxation', 'The echo appears immediately after the 180° pulse', 'The echo height measures $T_1$'], answer: 0,
      sol: 'Spins dephase in an inhomogeneous field during $\\tau$; the 180° pulse reverses their phases, so they rephase at $2\\tau$. Static inhomogeneity ($T_2^*$) is undone; random spin-spin processes are not, so echo height $\\propto e^{-2\\tau/T_2}$.',
      trap: 'Only reversible (static) dephasing is refocused.' },
    { id: 'nmr-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'MRI',
      q: 'An MRI scanner applies a field gradient of 10 mT/m. The proton resonance frequencies at two points 1.0 cm apart along the gradient differ by ______ kHz (to two decimal places). Use $\\gamma_p/2\\pi = 42.577$ MHz/T.',
      answer: 4.26, tol: 0.01, unit: 'kHz', calc: () => 42.577e6 * 0.01 * 0.01 / 1e3,
      sol: '$\\Delta B = G\\Delta x = 10\\ \\text{mT/m}\\times0.010\\ \\text{m} = 0.10$ mT. $\\Delta\\nu = 42.577\\ \\text{MHz/T}\\times10^{-4}$ T $= 4.26$ kHz. Frequency encodes position.',
      trap: 'Convert the gradient to T/m before multiplying.' },
    { id: 'nmr-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'relaxation',
      q: 'Which statements about relaxation times are true?',
      options: ['$T_1$ involves exchange of energy between the spins and their surroundings (the lattice)', '$T_2$ can never exceed $2T_1$', 'The observed FID decay time $T_2^*$ is shorter than or equal to $T_2$ because of field inhomogeneity', 'In a mobile liquid, $T_1$ is always much longer than $T_2$'], answer: [0, 1, 2],
      sol: '$T_1$ restores $M_z$ by giving energy to the lattice. Anything that relaxes $M_z$ also destroys transverse coherence, so $1/T_2 \\ge 1/2T_1$. Inhomogeneity adds dephasing: $1/T_2^* = 1/T_2 + \\gamma\\Delta B_0$. In mobile liquids (fast motion) $T_1 \\approx T_2$; $T_1 \\gg T_2$ is typical of solids and viscous samples.',
      trap: 'Small molecules in non-viscous liquids have nearly equal $T_1$ and $T_2$.' },
    { id: 'nmr-026', type: 'mcq', level: 3, exams: ['net'], sub: 'g factor',
      q: 'Two radicals with $g = 2.0023$ and $g = 2.0060$ are studied at X-band, 9.50 GHz. Their resonance fields differ by about (use $\\mu_B/h = 13.996$ GHz/T)',
      options: ['0.18 mT', '0.63 mT', '2.3 mT', '6.3 mT'], answer: 1,
      sol: '$B = h\\nu/g\\mu_B$: $9.50/(13.996\\times2.0023) = 339.0$ mT and $9.50/(13.996\\times2.0060) = 338.4$ mT, so $\\Delta B \\approx B\\,\\Delta g/g = 339\\times0.0037/2.004 = 0.63$ mT. At Q-band (35 GHz) the same $\\Delta g$ gives 2.3 mT: higher frequencies resolve $g$ better.',
      trap: 'The separation from $\\Delta g$ grows with frequency; hyperfine splittings in field do not.' },
    { id: 'nmr-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'transition-metal ions',
      q: 'Dilute Mn$^{2+}$ ions ($^{55}$Mn, $I = 5/2$) in a cubic host show an ESR spectrum of',
      options: ['5 hyperfine lines', '11 hyperfine lines', '3 hyperfine lines', '6 hyperfine lines'], answer: 3,
      sol: 'One nucleus of spin $I$ gives $2I + 1$ hyperfine lines: $2\\times5/2 + 1 = 6$, the familiar Mn$^{2+}$ sextet used as a field marker.',
      trap: '$2I$ = 5 forgets the $+1$.' },
    { id: 'nmr-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'rotating frame',
      q: 'In a frame rotating at the Larmor frequency, with a resonant RF field $B_1$ along the rotating $x$ axis, the magnetisation',
      options: ['precesses about $B_0$ at the Larmor frequency', 'stays fixed along $z$', 'nutates about the $x$ axis at angular frequency $\\gamma B_1$', 'decays to zero immediately'], answer: 2,
      sol: 'In the rotating frame the static field is replaced by $B_0 - \\omega/\\gamma$, which is zero at resonance. Only $B_1$ remains, so $\\mathbf M$ precesses about it at $\\omega_1 = \\gamma B_1$: this is how a pulse of length $t$ turns $\\mathbf M$ by $\\gamma B_1t$.',
      trap: 'Off resonance the effective field tilts out of the $xy$ plane and the nutation is incomplete.' },

    // ---------- level 4 ----------
    { id: 'nmr-029', type: 'nat', level: 4, exams: ['net'], sub: 'populations',
      q: 'Water contains $6.69\\times10^{28}$ protons per m$^3$. The equilibrium (Curie) nuclear magnetisation at 300 K in 1.0 T, $M = N\\gamma^2\\hbar^2B/(4k_BT)$, is ______ mA/m (to two decimal places). Use $\\gamma = 2.675\\times10^8$ rad s$^{-1}$ T$^{-1}$, $\\hbar = 1.0546\\times10^{-34}$ J s, $k_B = 1.381\\times10^{-23}$ J/K.',
      answer: 3.21, tol: 0.02, unit: 'mA/m', calc: () => 6.69e28 * (2.675e8 * 1.0546e-34) ** 2 * 1 / (4 * 1.381e-23 * 300) * 1e3,
      sol: 'Each proton contributes $\\pm\\gamma\\hbar/2$ with excess fraction $\\gamma\\hbar B/2k_BT$, so $M = N(\\gamma\\hbar/2)(\\gamma\\hbar B/2k_BT)$. $\\gamma\\hbar = 2.821\\times10^{-26}$ J/T, squared $7.96\\times10^{-52}$; times $N$: $5.33\\times10^{-23}$; divided by $4k_BT = 1.657\\times10^{-20}$: $3.21\\times10^{-3}$ A/m.',
      trap: 'The magnetisation is tiny ($\\chi \\sim 4\\times10^{-9}$), swamped by the diamagnetism of the electrons in a static measurement; resonance picks it out.' },
    { id: 'nmr-030', type: 'mcq', level: 4, exams: ['net'], sub: 'solid-state NMR',
      q: 'Spinning a solid sample fast about an axis inclined at the "magic angle" to $B_0$ narrows its NMR lines because the dipolar coupling depends on the orientation through $3\\cos^2\\theta - 1$. The magic angle is',
      options: ['45.0°', '54.7°', '60.0°', '35.3°'], answer: 1,
      sol: 'Averaged over fast spinning, $3\\cos^2\\theta - 1$ becomes proportional to $3\\cos^2\\theta_R - 1$ for the rotor angle $\\theta_R$, which vanishes at $\\cos^2\\theta_R = 1/3$: $\\theta_R = 54.74°$. Dipolar broadening and chemical-shift anisotropy then average away.',
      trap: '35.3° is the complement of the magic angle.' },
    { id: 'nmr-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'spin echo',
      q: 'In a Hahn echo experiment with $T_2 = 80$ ms, the 180° pulse comes 20 ms after the 90° pulse. The echo amplitude, as a fraction of the initial FID amplitude, is ______ (to three decimal places).',
      answer: 0.607, tol: 0.002, calc: () => Math.exp(-40 / 80),
      sol: 'The echo forms at $2\\tau = 40$ ms and is reduced by irreversible $T_2$ decay: $e^{-2\\tau/T_2} = e^{-0.5} = 0.607$.',
      trap: 'The echo time is $2\\tau$, not $\\tau$.' },
    { id: 'nmr-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'J coupling',
      q: 'A proton is coupled to three equivalent methyl protons with $J_1 = 7$ Hz and to two equivalent methylene protons with $J_2 = 3$ Hz. Its first-order multiplet has at most',
      options: ['6 lines', '7 lines', '5 lines', '12 lines'], answer: 3,
      sol: 'The methyl group splits the line into a quartet (4 lines); each of these is split into a triplet (3) by the methylene pair: $4\\times3 = 12$ lines, a quartet of triplets. Only if $J_1 = J_2$ would they collapse to $3 + 2 + 1 = 6$ lines.',
      trap: 'The $n + 1$ rule with all five protons together needs all couplings equal.' },
    { id: 'nmr-033', type: 'msq', level: 4, exams: ['net'], sub: 'transition-metal ions',
      q: 'Which statements about ESR of transition-metal ions in crystals are correct?',
      options: ['The g factor can differ markedly from 2.0023 because of spin-orbit coupling', 'The g factor can depend on the orientation of the crystal in the field', 'Hyperfine coupling to the metal nucleus splits each line into $2I + 1$ components', 'Every ion with an even number of electrons gives a strong ESR signal at X-band'], answer: [0, 1, 2],
      sol: 'Spin-orbit coupling mixes orbital angular momentum into the ground state, shifting $g$ (Cu$^{2+}$: $g_\\parallel \\approx 2.3$) and making it anisotropic, a tensor. The metal nucleus gives $2I + 1$ lines (4 for Cu, 8 for V). Non-Kramers ions (even electron number) often have zero-field splittings larger than the microwave quantum and are ESR silent.',
      trap: 'Kramers ions (odd electron number) always keep a degenerate doublet at zero field; non-Kramers ions need not.' },
    { id: 'nmr-034', type: 'nat', level: 4, exams: ['net'], sub: 'zero-field splitting',
      q: 'A triplet ($S = 1$, $g = 2.0023$) has an axial zero-field splitting $D/hc = 0.100$ cm$^{-1}$. With the field along the axis, its two $\\Delta m_S = \\pm1$ ESR lines are separated by ______ mT (to the nearest whole number). Use $\\mu_B/h = 13.996$ GHz/T and $c = 2.998\\times10^{10}$ cm/s.',
      answer: 214, tol: 1, unit: 'mT', calc: () => 2 * 0.1 * 2.998e10 / 1e9 / (2.0023 * 13.996) * 1e3,
      sol: 'With $H = g\\mu_BBS_z + D[S_z^2 - S(S+1)/3]$, the transitions $0 \\leftrightarrow \\pm1$ occur at $g\\mu_BB = h\\nu \\mp D$: two lines $2D/g\\mu_B$ apart. $D/h = 0.100\\times2.998\\times10^{10} = 3.00$ GHz, so $2D/g\\mu_B = 6.00/(2.0023\\times13.996)$ T $= 0.214$ T $= 214$ mT.',
      trap: 'The separation is $2D$, not $D$.' },
    { id: 'nmr-035', type: 'mcq', level: 4, exams: ['net'], sub: 'rotating frame',
      q: 'Protons experience an RF field $B_1 = 0.10$ mT. At what frequency offset from resonance does the effective field in the rotating frame make 45° with the $z$ axis? (Use $\\gamma_p/2\\pi = 42.58$ MHz/T.)',
      options: ['4.26 kHz', '42.6 kHz', '2.13 kHz', '26.8 kHz'], answer: 0,
      sol: 'In the rotating frame $B_{eff}$ has components $B_1$ (transverse) and $\\Delta\\omega/\\gamma$ (along $z$). 45° needs $\\Delta\\omega/\\gamma = B_1$, i.e. $\\Delta\\nu = (\\gamma/2\\pi)B_1 = 42.58\\times10^6\\times10^{-4} = 4.26$ kHz.',
      trap: '26.8 kHz is $\\gamma B_1$ in rad/s, not a frequency in Hz.' },
    { id: 'nmr-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'relaxation',
      q: '90° pulses are repeated every 2.0 s on a sample with $T_1 = 1.5$ s (and $T_2 \\ll 2$ s). In the steady state, the signal after each pulse is ______ of the fully relaxed signal (to three decimal places).',
      answer: 0.736, tol: 0.002, calc: () => 1 - Math.exp(-2 / 1.5),
      sol: 'Each 90° pulse leaves $M_z = 0$ (and the transverse part decays before the next pulse). $M_z$ then recovers as $M_0(1 - e^{-t/T_1})$, so at the next pulse it is $1 - e^{-2.0/1.5} = 1 - 0.264 = 0.736$ of $M_0$.',
      trap: 'Pulsing faster than about $5T_1$ saturates the signal; this is the basis of $T_1$-weighted MRI contrast.' },

    // ---------- level 5 ----------
    { id: 'nmr-037', type: 'nat', level: 5, exams: ['net'], sub: 'sensitivity',
      q: 'At fixed field and temperature, the NMR signal per nucleus of spin 1/2 scales as $\\gamma^3$. Including the 1.07% natural abundance of $^{13}$C, its signal relative to the same number of carbon atoms\' worth of protons ($^1$H, 100%) is $k\\times10^{-4}$. The value of $k$ is ______ (to two decimal places). Use $\\gamma/2\\pi = 10.708$ and 42.577 MHz/T.',
      answer: 1.70, tol: 0.01, calc: () => (10.708 / 42.577) ** 3 * 0.0107 * 1e4,
      sol: 'One factor of $\\gamma$ from the population excess, one from the size of each moment, one from the induced EMF ($\\propto\\omega$). $(10.708/42.577)^3 = 0.2515^3 = 0.0159$; times 0.0107: $1.70\\times10^{-4}$. Hence the long averaging (and proton decoupling and polarisation transfer) in carbon NMR.',
      trap: 'Forgetting the abundance overestimates the carbon signal a hundredfold.' },
    { id: 'nmr-038', type: 'mcq', level: 5, exams: ['net'], sub: 'hyperfine',
      q: 'A nitroxide radical is made with $^{15}$N ($I = 1/2$, $|\\gamma| = 4.316$ MHz/T) instead of $^{14}$N ($I = 1$, $\\gamma = 3.077$ MHz/T). Assuming the same spin density, its ESR spectrum changes from',
      options: ['3 lines to 2 lines, with the splitting larger by a factor of about 1.40', '3 lines to 2 lines, with the same splitting', '3 lines to 4 lines, with the splitting smaller by 1.40', '2 lines to 3 lines, with the splitting larger by 1.40'], answer: 0,
      sol: '$^{14}$N gives $2I + 1 = 3$ lines; $^{15}$N gives 2. The hyperfine constant is proportional to the nuclear $g$ factor (to $\\gamma$): $4.316/3.077 = 1.40$ (the sign of $\\gamma$ does not change the line positions). Fewer, larger splittings make $^{15}$N labels easier to resolve.',
      trap: 'The hyperfine constant scales with the nuclear moment, not with the spin.' },
    { id: 'nmr-039', type: 'nat', level: 5, exams: ['net'], sub: 'populations',
      q: 'Free electron spins ($S = 1/2$) at 4.0 K are probed by W-band ESR at 94 GHz. The polarisation $(N_- - N_+)/N = \\tanh(h\\nu/2k_BT)$ is ______ (to three decimal places). Use $h = 6.626\\times10^{-34}$ J s, $k_B = 1.381\\times10^{-23}$ J/K.',
      answer: 0.511, tol: 0.002, calc: () => Math.tanh(6.626e-34 * 94e9 / (2 * 1.381e-23 * 4)),
      sol: '$h\\nu/2k_BT = 6.626\\times10^{-34}\\times9.4\\times10^{10}/(2\\times1.381\\times10^{-23}\\times4.0) = 0.5638$. $\\tanh(0.5638) = 0.511$. The high-temperature approximation ($0.564$) is already 10% off: at high field and low temperature electron spins become strongly polarised.',
      trap: 'Do not linearise when $h\\nu/2k_BT$ is not small.' },
    { id: 'nmr-040', type: 'mcq', level: 5, exams: ['net'], sub: 'Bloch equations',
      q: 'The steady-state solution of the Bloch equations gives a Lorentzian absorption line whose width and height depend on the saturation parameter $s = \\gamma^2B_1^2T_1T_2$ as width $\\propto\\sqrt{1 + s}$ and peak height $\\propto B_1/(1 + s)$. Raising $B_1$ from a very small value until $s = 3$ makes the line',
      options: ['twice as wide, and the peak absorption per unit $B_1$ falls to a quarter', 'four times as wide and half as high', 'unchanged in width but saturated', 'narrower, because more spins are excited'], answer: 0,
      sol: 'Width $\\propto\\sqrt{1 + s} = \\sqrt4 = 2$: power broadening. The absorption $\\chi\'\'$ at the peak scales as $1/(1 + s) = 1/4$ of its unsaturated value, because the population difference is reduced. Low RF power is used to measure true linewidths.',
      trap: 'Stronger driving broadens and saturates; it never narrows the line.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],
  gens: [
    { id: 'nmr-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Larmor frequency',
      make(r) {
        const [name, g] = choose(r, NUC), mode = choose(r, ['nu', 'B']), B = choose(r, [1.5, 3, 4.7, 7.05, 9.4, 11.7, 14.1, 18.8, 21.1]), nu = choose(r, [60, 100, 200, 300, 400, 500, 600, 800]);
        const ans = mode === 'nu' ? g * B : nu / g;
        return { q: mode === 'nu' ? `The NMR frequency of ${name} nuclei ($|\\gamma|/2\\pi = ${g}$ MHz/T) in a field of ${B} T is ______ MHz (to three significant figures).`
          : `The field at which ${name} nuclei ($|\\gamma|/2\\pi = ${g}$ MHz/T) resonate at ${nu} MHz is ______ T (to three significant figures).`,
          answer: s3(ans), tol: t6(ans), unit: mode === 'nu' ? 'MHz' : 'T', g, B, nu, mode,
          sol: mode === 'nu' ? `$\\nu = (\\gamma/2\\pi)B = ${g}\\times${B} = ${+ans.toPrecision(4)}$ MHz.` : `$B = \\nu/(\\gamma/2\\pi) = ${nu}/${g} = ${+ans.toPrecision(4)}$ T.`,
          trap: 'Use $\\gamma/2\\pi$ (MHz/T), not $\\gamma$ (rad s$^{-1}$ T$^{-1}$), for frequencies in hertz.' };
      },
      verify: (p) => (p.mode === 'nu' ? p.g * p.B : p.nu / p.g) },
    { id: 'nmr-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'populations',
      make(r) {
        const elec = choose(r, [false, false, true]);
        const T = choose(r, elec ? [4.2, 77, 300] : [4.2, 77, 300, 310]);
        let nu, label;
        if (elec) { const [band, f] = choose(r, [['X-band', 9.5], ['Q-band', 35], ['S-band', 3]]); nu = f * 1e9; label = `free-electron spins observed at ${band} (${f} GHz)`; }
        else { const [name, g] = choose(r, NUC.filter((n) => n[2] === 0.5)); const B = choose(r, [1.5, 3, 9.4, 14.1]); nu = g * B * 1e6; label = `${name} nuclei (spin 1/2, $\\gamma/2\\pi = ${g}$ MHz/T) in ${B} T`; }
        const x = H * nu / (2 * KB * T), ans = Math.tanh(x) * 1e6;
        return { q: `For ${label} at ${T} K, the fractional population difference $\\tanh(h\\nu/2k_BT)$ is ______ ppm (to three significant figures).`,
          answer: s3(ans), tol: t6(ans), unit: 'ppm', nu, T,
          sol: `$\\nu = ${+(nu / 1e6).toPrecision(5)}$ MHz. $h\\nu/2k_BT = 6.626\\times10^{-34}\\times${+(nu / 1e6).toPrecision(5)}\\times10^6/(2\\times1.381\\times10^{-23}\\times${T}) = ${+x.toPrecision(4)}$; $\\tanh$ of it $= ${+(ans / 1e6).toPrecision(4)} = ${+ans.toPrecision(4)}$ ppm.`,
          trap: 'Lower temperature and higher frequency both raise the polarisation; electrons beat protons by about 658 at equal field.' };
      },
      verify: (p) => Math.tanh(H * p.nu / (2 * KB * p.T)) * 1e6 },
    { id: 'nmr-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'pulses',
      make(r) {
        const [name, g] = choose(r, NUC.slice(0, 4)), th = choose(r, [30, 45, 90, 180, 270, 360]), mode = choose(r, ['t', 'B1']);
        const B1 = choose(r, [0.05, 0.1, 0.2, 0.5, 1, 2]), tp = choose(r, [2, 5, 8, 10, 25, 50]);
        const w1 = 2 * Math.PI * g * 1e6 * B1 * 1e-3, ans = mode === 't' ? (th * Math.PI / 180) / w1 * 1e6 : (th * Math.PI / 180) / (2 * Math.PI * g * 1e6 * tp * 1e-6) * 1e3;
        return { q: mode === 't' ? `An on-resonance RF field of $B_1 = ${B1}$ mT acts on ${name} nuclei ($\\gamma/2\\pi = ${g}$ MHz/T). A ${th}° pulse lasts ______ μs (to three significant figures).`
          : `A ${th}° pulse on ${name} nuclei ($\\gamma/2\\pi = ${g}$ MHz/T) lasts ${tp} μs. The RF amplitude $B_1$ in the rotating frame is ______ mT (to three significant figures).`,
          answer: s3(ans), tol: t6(ans), unit: mode === 't' ? 'μs' : 'mT', g, th, B1, tp, mode,
          sol: `The flip angle is $\\theta = \\gamma B_1t$ with $\\gamma = 2\\pi\\times${g}\\times10^6$ rad s$^{-1}$ T$^{-1}$ and $\\theta = ${th}° = ${round(th * Math.PI / 180, 4)}$ rad. ${mode === 't' ? `$t = \\theta/\\gamma B_1 = ${+ans.toPrecision(4)}$ μs.` : `$B_1 = \\theta/\\gamma t = ${+ans.toPrecision(4)}$ mT.`}`,
          trap: 'Equivalently, a 360° pulse lasts $1/[(\\gamma/2\\pi)B_1]$.' };
      },
      verify: (p) => { const g = 2 * Math.PI * p.g * 1e6, th = p.th * Math.PI / 180; return p.mode === 't' ? th / (g * p.B1 * 1e-3) * 1e6 : th / (g * p.tp * 1e-6) * 1e3; } },
    { id: 'nmr-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'chemical shift',
      make(r) {
        const nu0 = choose(r, [60, 90, 200, 300, 400, 500, 600, 800]), mode = choose(r, ['ppm', 'Hz', 'sep']);
        const d1 = pick(r, 0.5, 9.5, 0.05), d2 = pick(r, 0.5, 9.5, 0.05), dHz = int(r, 50, 4000);
        let ans, q, sol;
        if (mode === 'ppm') { ans = dHz / nu0; q = `On a ${nu0} MHz spectrometer a proton line lies ${dHz} Hz from TMS. Its chemical shift is ______ ppm (to two decimal places).`; sol = `$\\delta = ${dHz}/${nu0} = ${round(ans, 3)}$ ppm (Hz divided by MHz gives ppm).`; }
        else if (mode === 'Hz') { ans = d1 * nu0; q = `A proton at $\\delta = ${d1}$ ppm on a ${nu0} MHz spectrometer lies ______ Hz from TMS (to the nearest Hz).`; sol = `$${d1}\\times${nu0} = ${round(ans, 2)}$ Hz.`; }
        else { ans = Math.abs(d1 - d2) * nu0; q = `Two proton signals at $\\delta = ${d1}$ and $${d2}$ ppm are recorded at ${nu0} MHz. They are ______ Hz apart (to the nearest Hz).`; sol = `$|${d1} - ${d2}|\\times${nu0} = ${round(ans, 2)}$ Hz.`; }
        return { q, answer: mode === 'ppm' ? round(ans, 2) : Math.round(ans), tol: mode === 'ppm' ? 0.01 : 1, unit: mode === 'ppm' ? 'ppm' : 'Hz', nu0, d1, d2, dHz, mode, sol,
          trap: 'ppm times MHz gives Hz.' };
      },
      verify: (p) => (p.mode === 'ppm' ? p.dHz / p.nu0 : p.mode === 'Hz' ? Math.round(p.d1 * p.nu0) : Math.round(Math.abs(p.d1 - p.d2) * p.nu0)) },
    { id: 'nmr-g05', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'J coupling',
      make(r) {
        const n = int(r, 1, 6);
        const names = ['', 'doublet', 'triplet', 'quartet', 'quintet', 'sextet', 'septet'];
        const pat = (k) => `${names[k]}, ${Array.from({ length: k + 1 }, (_, i) => binom(k, i)).join(':')}`;
        const others = [1, 2, 3, 4, 5, 6].filter((k) => k !== n).map(pat);
        const fake = `${names[n]}, ${Array.from({ length: n + 1 }, () => 1).join(':')}`;
        const o = mcqOptions(r, pat(n), [fake, others[int(r, 0, 1)], others[int(r, 2, 4)], 'singlet, 1', ...others]);
        const env = ['', 'a single neighbouring CH proton', 'a neighbouring CH$_2$ group', 'a neighbouring CH$_3$ group', 'two equivalent neighbouring CH$_2$ groups', 'a CH$_2$ and a CH$_3$ group with equal couplings', 'two equivalent CH$_3$ groups (as the CH of an isopropyl group)'][n];
        return { q: `A proton couples equally (first-order spectrum) to ${n} equivalent spin-1/2 nuclei: ${env}. Its signal is a`, options: o.options, answer: o.answer,
          sol: `$n = ${n}$ equivalent spin-1/2 neighbours give $n + 1 = ${n + 1}$ lines with binomial intensities $\\binom{${n}}{k}$: ${pat(n)}.`,
          trap: 'Equal intensities would need one nucleus of higher spin, not several equivalent spin-1/2 nuclei.' };
      } },
    { id: 'nmr-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hyperfine',
      make(r) {
        const NU = [['$^1$H', 0.5], ['$^{14}$N', 1], ['$^2$H', 1], ['$^{19}$F', 0.5], ['$^{13}$C', 0.5], ['$^{23}$Na', 1.5], ['$^{63}$Cu', 1.5], ['$^{51}$V', 3.5], ['$^{55}$Mn', 2.5]];
        const sets = int(r, 1, 3), used = [];
        let lines = 1;
        const parts = [];
        for (let k = 0; k < sets; k++) { const [nm, I] = NU[(int(r, 0, 8) + k * 3) % 9]; const n = I >= 1.5 ? 1 : int(r, 1, 4); lines *= 2 * n * I + 1; parts.push(`${n} equivalent ${nm} ($I = ${fr(I)}$)`); used.push([n, I]); }
        return { q: `An unpaired electron couples to ${parts.join(', ')}${sets > 1 ? ', each set with its own distinct hyperfine constant' : ''}. The maximum number of ESR hyperfine lines is ______.`,
          answer: lines, tol: 0, used,
          sol: `Each set of $n$ equivalent nuclei of spin $I$ multiplies the number of lines by $2nI + 1$: ${used.map(([n, I]) => `$2\\times${n}\\times${fr(I)} + 1 = ${2 * n * I + 1}$`).join(', ')}. Total ${lines}.`,
          trap: 'Different sets multiply; within a set, equivalent nuclei add their spins.' };
      },
      verify: (p) => p.used.reduce((a, [n, I]) => a * (2 * n * I + 1), 1) },
    { id: 'nmr-g07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'g factor',
      make(r) {
        const g = round(choose(r, [1.98, 1.995, 2.0023, 2.004, 2.006, 2.01, 2.05, 2.1, 2.2, 2.3]), 4), [band, f] = choose(r, [['X-band', 9.5], ['X-band', 9.8], ['Q-band', 35], ['W-band', 94]]);
        const B = round(f / (MUB_H * g) * 1000, 1);
        const gv = f / (MUB_H * B / 1000);
        const show = (v) => v.toFixed(4);
        const o = mcqOptions(r, gv, [gv * 1.0012 + 0.004, gv / 2, gv * 1.02, gv * 0.985], show);
        return { q: `A paramagnetic sample absorbs at ${f} GHz (${band}) when the field is ${B} mT. Its g factor is (use $\\mu_B/h = 13.996$ GHz/T)`, options: o.options, answer: o.answer,
          sol: `$h\\nu = g\\mu_BB$, so $g = \\nu/[(\\mu_B/h)B] = ${f}/(13.996\\times${round(B / 1000, 4)}) = ${show(gv)}$.`,
          trap: 'Convert mT to T, and do not assume every sample has the free-electron value 2.0023.' };
      } },
    { id: 'nmr-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hyperfine',
      make(r) {
        const n = int(r, 2, 8), k = int(r, 1, Math.floor(n / 2) + 1);
        const ans = binom(n, k - 1);
        const ord = ['first', 'second', 'third', 'fourth', 'fifth'][k - 1];
        return { q: `A radical's unpaired electron couples equally to ${n} equivalent protons. In its ESR spectrum (${n + 1} lines), counting from the low-field end, the intensity of the ${ord} line relative to the outermost line is ______.`,
          answer: ans, tol: 0, n, k,
          sol: `The line with $k - 1$ proton spins flipped relative to the extreme arrangement has $\\binom{${n}}{${k - 1}} = ${ans}$ arrangements; the outermost has 1. Row ${n} of Pascal's triangle: ${Array.from({ length: n + 1 }, (_, i) => binom(n, i)).join(':')}.`,
          trap: 'Intensities follow Pascal\'s triangle only for spin-1/2 nuclei.' };
      },
      verify: (p) => binom(p.n, p.k - 1) },
    { id: 'nmr-g09', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'relaxation',
      make(r) {
        const mode = choose(r, ['T2', 'width', 'T2star']);
        const w = choose(r, [0.2, 0.5, 1, 2, 5, 10, 25, 100]), T2 = choose(r, [0.01, 0.05, 0.1, 0.5, 1, 2, 3]), dB = choose(r, [0.5, 1, 2, 5]);
        let ans, q, sol, unit;
        if (mode === 'T2') { ans = 1 / (Math.PI * w) * 1e3; unit = 'ms'; q = `A homogeneous Lorentzian NMR line has a full width at half maximum of ${w} Hz. Its $T_2$ is ______ ms (to three significant figures).`; sol = `$T_2 = 1/(\\pi\\Delta\\nu) = 1/(\\pi\\times${w}) = ${+ans.toPrecision(4)}$ ms.`; }
        else if (mode === 'width') { ans = 1 / (Math.PI * T2); unit = 'Hz'; q = `A nucleus has $T_2 = ${T2}$ s and the field is perfectly uniform. The FWHM of its NMR line is ______ Hz (to three significant figures).`; sol = `$\\Delta\\nu = 1/(\\pi T_2) = 1/(\\pi\\times${T2}) = ${+ans.toPrecision(4)}$ Hz.`; }
        else { const inh = dB * 1e-9 * 42.577e6; ans = 1 / (1 / T2 + Math.PI * inh) * 1e3; unit = 'ms'; q = `Protons with $T_2 = ${T2}$ s sit in a magnet whose field varies by ${dB} parts per billion over the sample at 1 T, adding an inhomogeneous width $\\Delta\\nu_{inh} = (\\gamma/2\\pi)\\Delta B$ (take $1/T_2^* = 1/T_2 + \\pi\\Delta\\nu_{inh}$, $\\gamma/2\\pi = 42.577$ MHz/T). $T_2^*$ is ______ ms (to three significant figures).`; sol = `$\\Delta\\nu_{inh} = 42.577\\times10^6\\times${dB}\\times10^{-9} = ${+inh.toPrecision(4)}$ Hz. $1/T_2^* = ${round(1 / T2, 4)} + \\pi\\times${+inh.toPrecision(4)} = ${+(1 / T2 + Math.PI * inh).toPrecision(4)}$ s$^{-1}$, so $T_2^* = ${+ans.toPrecision(4)}$ ms.`; }
        return { q, answer: s3(ans), tol: t6(ans), unit, w, T2, dB, mode, sol, trap: 'Linewidth in Hz is $1/\\pi T_2$, not $1/T_2$.' };
      },
      verify: (p) => (p.mode === 'T2' ? 1 / (Math.PI * p.w) * 1e3 : p.mode === 'width' ? 1 / (Math.PI * p.T2) : 1 / (1 / p.T2 + Math.PI * p.dB * 1e-9 * 42.577e6) * 1e3) },
    { id: 'nmr-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'relaxation',
      make(r) {
        const mode = choose(r, ['ir', 'null', 'echo', 'sat']);
        const T1 = choose(r, [0.2, 0.5, 0.8, 1, 1.5, 2, 3]), t = choose(r, [0.1, 0.2, 0.5, 1, 2, 3]), T2 = choose(r, [20, 50, 80, 100, 200]), tau = choose(r, [5, 10, 20, 30, 50]);
        let ans, q, sol, unit;
        if (mode === 'ir') { ans = 1 - 2 * Math.exp(-t / T1); unit = undefined; q = `After a 180° pulse, a sample with $T_1 = ${T1}$ s recovers for ${t} s. $M_z/M_0$ is then ______ (to three decimal places, with sign).`; sol = `$M_z/M_0 = 1 - 2e^{-t/T_1} = 1 - 2e^{-${round(t / T1, 4)}} = ${round(ans, 4)}$.`; }
        else if (mode === 'null') { ans = T1 * Math.LN2; unit = 's'; q = `In inversion recovery on a sample with $T_1 = ${T1}$ s, the signal is zero after a delay of ______ s (to three significant figures).`; sol = `$1 - 2e^{-t/T_1} = 0$ gives $t = T_1\\ln2 = ${T1}\\times0.6931 = ${+ans.toPrecision(4)}$ s.`; }
        else if (mode === 'echo') { ans = Math.exp(-2 * tau / T2); unit = undefined; q = `A 90°–$\\tau$–180° sequence with $\\tau = ${tau}$ ms on a sample with $T_2 = ${T2}$ ms gives an echo whose height, relative to the initial FID, is ______ (to three decimal places).`; sol = `The echo forms at $2\\tau = ${2 * tau}$ ms with height $e^{-2\\tau/T_2} = e^{-${round(2 * tau / T2, 4)}} = ${round(ans, 4)}$.`; }
        else { ans = 1 - Math.exp(-t / T1); unit = undefined; q = `After a saturating pulse ($M_z = 0$), a sample with $T_1 = ${T1}$ s recovers for ${t} s. $M_z/M_0$ is then ______ (to three decimal places).`; sol = `$M_z/M_0 = 1 - e^{-t/T_1} = 1 - e^{-${round(t / T1, 4)}} = ${round(ans, 4)}$.`; }
        return { q, answer: mode === 'null' ? s3(ans) : round(ans, 3), tol: mode === 'null' ? t6(ans) : 0.002, unit, T1, t, T2, tau, mode, sol,
          trap: 'Inversion starts from $-M_0$, so it recovers as $1 - 2e^{-t/T_1}$; saturation starts from zero.' };
      },
      verify: (p) => (p.mode === 'ir' ? 1 - 2 * Math.exp(-p.t / p.T1) : p.mode === 'null' ? p.T1 * Math.LN2 : p.mode === 'echo' ? Math.exp(-2 * p.tau / p.T2) : 1 - Math.exp(-p.t / p.T1)) },
    { id: 'nmr-g11', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Larmor frequency',
      make(r) {
        const H1 = choose(r, [200, 300, 400, 500, 600, 700, 800, 900]), [name, g] = choose(r, NUC.slice(1));
        const ans = H1 * g / 42.577;
        return { q: `On a spectrometer where protons resonate at ${H1} MHz, ${name} nuclei ($|\\gamma|/2\\pi = ${g}$ MHz/T; protons 42.577 MHz/T) resonate at ______ MHz (to three significant figures).`,
          answer: s3(ans), tol: t6(ans), unit: 'MHz', H1, g,
          sol: `Same field: $\\nu = ${H1}\\times${g}/42.577 = ${+ans.toPrecision(4)}$ MHz.`,
          trap: 'Frequencies scale with $\\gamma$ at a fixed field.' };
      },
      verify: (p) => p.H1 * p.g / 42.577 },
    { id: 'nmr-g12', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'MRI',
      make(r) {
        const G = choose(r, [1, 2, 5, 10, 20, 40]), mode = choose(r, ['df', 'dx', 'bw']), dx = choose(r, [0.5, 1, 2, 5, 10]), bw = choose(r, [10, 20, 50, 100, 200]), df = choose(r, [50, 100, 200, 500]);
        let ans, q, sol, unit;
        if (mode === 'df') { ans = 42.577e6 * G * 1e-3 * dx * 1e-3; unit = 'Hz'; q = `With a gradient of ${G} mT/m, proton frequencies at two points ${dx} mm apart along it differ by ______ Hz (to three significant figures).`; sol = `$\\Delta\\nu = (\\gamma/2\\pi)G\\Delta x = 42.577\\times10^6\\times${G}\\times10^{-3}\\times${dx}\\times10^{-3} = ${+ans.toPrecision(4)}$ Hz.`; }
        else if (mode === 'dx') { ans = df / (42.577e6 * G * 1e-3) * 1e3; unit = 'mm'; q = `In a gradient of ${G} mT/m, two proton signals ${df} Hz apart come from points ______ mm apart along the gradient (to three significant figures).`; sol = `$\\Delta x = \\Delta\\nu/[(\\gamma/2\\pi)G] = ${df}/(42.577\\times10^6\\times${G}\\times10^{-3})$ m $= ${+ans.toPrecision(4)}$ mm.`; }
        else { ans = bw * 1e3 / (42.577e6 * G * 1e-3) * 100; unit = 'cm'; q = `A receiver bandwidth of ${bw} kHz with a read gradient of ${G} mT/m covers a field of view of ______ cm (to three significant figures).`; sol = `FOV $= \\Delta\\nu/[(\\gamma/2\\pi)G] = ${bw}\\times10^3/(42.577\\times10^6\\times${G}\\times10^{-3})$ m $= ${+ans.toPrecision(4)}$ cm.`; }
        return { q: q + ' Use $\\gamma_p/2\\pi = 42.577$ MHz/T.', answer: s3(ans), tol: t6(ans), unit, G, dx, bw, df, mode, sol,
          trap: 'The gradient turns position into frequency: $\\nu(x) = (\\gamma/2\\pi)(B_0 + Gx)$.' };
      },
      verify: (p) => (p.mode === 'df' ? 42.577e6 * p.G * 1e-6 * p.dx : p.mode === 'dx' ? p.df / (42.577e6 * p.G * 1e-3) * 1e3 : p.bw * 1e3 / (42.577e6 * p.G * 1e-3) * 100) },
    { id: 'nmr-g13', type: 'nat', level: 4, exams: ['net'], sub: 'hyperfine',
      make(r) {
        const B0 = pick(r, 330, 350, 0.5), a = choose(r, [0.35, 0.5, 1.2, 1.6, 2.3, 2.5]), [nm, n, I] = choose(r, [['three equivalent protons', 3, 0.5], ['one $^{14}$N nucleus ($I = 1$)', 1, 1], ['two equivalent protons', 2, 0.5], ['four equivalent protons', 4, 0.5], ['one $^{55}$Mn nucleus ($I = 5/2$)', 1, 2.5], ['two equivalent $^{14}$N nuclei', 2, 1]]);
        const M = n * I, mode = choose(r, ['low', 'span']);
        const ans = mode === 'low' ? B0 - a * M : 2 * a * M;
        return { q: mode === 'low' ? `An ESR spectrum centred at ${B0} mT shows first-order hyperfine structure from ${nm} with hyperfine constant ${a} mT. The lowest-field line lies at ______ mT (to two decimal places).`
          : `An ESR spectrum shows first-order hyperfine structure from ${nm} with hyperfine constant ${a} mT. The total spread from the lowest- to the highest-field line is ______ mT (to two decimal places).`,
          answer: round(ans, 2), tol: 0.01, unit: 'mT', B0, a, n, I, mode,
          sol: `Lines sit at $B_0 - aM_I$ with $M_I$ from $-${fr(M)}$ to $+${fr(M)}$ (total $nI = ${fr(M)}$), i.e. ${2 * M + 1} lines spaced by $a$. ${mode === 'low' ? `Lowest: $${B0} - ${a}\\times${fr(M)} = ${round(ans, 3)}$ mT.` : `Spread $= 2nIa = ${round(ans, 3)}$ mT.`}`,
          trap: 'The spread is $2nI$ times the splitting, one less than the number of lines times $a$.' };
      },
      verify: (p) => (p.mode === 'low' ? p.B0 - p.a * p.n * p.I : 2 * p.a * p.n * p.I) },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};

// Tidy signs in generated text ("+ -3" -> "- 3", "1x" -> "x"); see _signs.js.
export default tidyPhys(topicBank, ["nmr-r5g3"]);
