// The collective model and nuclear deformation (CSIR NET Part C / GATE level): rotational bands of deformed even-even
// nuclei (E ∝ I(I+1), R4/2 = 10/3, gamma-ray energies, kinematic and dynamic moments of inertia), rigid and
// irrotational moments of inertia and pairing, intrinsic and spectroscopic quadrupole moments and B(E2), deformation
// parameter beta, odd-A bands and the decoupling parameter, gamma and beta bands, surface vibrations (phonons, two-phonon
// triplet, octupole), the Nilsson model, backbending and superdeformation, liquid-drop deformation energy and fission
// stability. Original questions for fibub.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './collective-model.more.gen.js';

const R = String.raw;
const HC = 197.327, MN = 939.0;
const K0 = 3 / Math.sqrt(5 * Math.PI);                 // Q0 = K0 Z R^2 beta
const qs = (Q0, I, K) => Q0 * (3 * K * K - I * (I + 1)) / ((I + 1) * (2 * I + 3));
const rigid = (A) => (HC * HC) / (2 * 0.4 * A * MN * (1.2 * Math.cbrt(A)) ** 2) * 1000; // hbar^2/2I_rigid in keV
const frac = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);

export default {
  topic: 'collective-model',
  items: [
    // ---------- level 1 ----------
    { id: 'coll-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'rotational bands',
      q: R`In the ground band of a well-deformed even-even nucleus, the level energies follow`,
      options: [R`$E\propto I$`, R`$E\propto I^2$ exactly, like a classical rotor with $I$ in place of $L$`, R`$E\propto I(I+1)$`, R`$E\propto(I + \tfrac12)$`], answer: 2,
      sol: R`A quantum symmetric top with moment of inertia $\mathcal I$ about an axis perpendicular to the symmetry axis has $E = \dfrac{\hbar^2}{2\mathcal I}I(I+1)$, from $\langle\vec I^2\rangle = I(I+1)\hbar^2$ (with $K = 0$).`,
      trap: R`$E\propto I + \tfrac12$ is a harmonic vibrator's ladder in phonon number, not in spin.` },
    { id: 'coll-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'rotational bands',
      q: R`The ground-state rotational band of an even-even deformed nucleus has the spin-parity sequence`,
      options: [R`$0^+, 1^+, 2^+, 3^+, \dots$`, R`$0^+, 2^+, 4^+, 6^+, \dots$`, R`$0^+, 1^-, 2^+, 3^-, \dots$`, R`$\tfrac12^+, \tfrac32^+, \tfrac52^+, \dots$`], answer: 1,
      sol: R`The intrinsic state has $K = 0$ and is symmetric under a rotation by $\pi$ about an axis perpendicular to the symmetry axis (reflection symmetry of the shape). That removes odd $I$, leaving $0^+, 2^+, 4^+, \dots$, all positive parity.`,
      trap: R`$0^+, 1^-, 2^+, 3^-$ is the pattern of a pear-shaped (octupole) nucleus without reflection symmetry.` },
    { id: 'coll-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'rotational bands',
      q: R`For an ideal rigid rotor, the ratio $R_{4/2} = E(4^+)/E(2^+)$ is`,
      options: [R`2.00`, R`2.50`, R`4.00`, R`3.33`], answer: 3,
      sol: R`$E(4)/E(2) = (4\times5)/(2\times3) = 20/6 = 10/3 = 3.33$. Measured values near 3.3 identify good rotors (most rare-earth nuclei with $150 < A < 190$ and the actinides).`,
      trap: R`4.00 would follow from $E\propto I^2$.` },
    { id: 'coll-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'vibrations',
      q: R`For a harmonic quadrupole vibrator, $E(4^+_1)/E(2^+_1)$ is`,
      options: [R`2.00`, R`3.33`, R`1.00`, R`2.50`], answer: 0,
      sol: R`The $2^+_1$ is one quadrupole phonon ($\hbar\omega$). Two phonons give a degenerate $0^+, 2^+, 4^+$ triplet at $2\hbar\omega$. So $E(4^+_1)/E(2^+_1) = 2$.`,
      trap: R`2.50 is the $\gamma$-soft (O(6)) limit, between vibrator and rotor.` },
    { id: 'coll-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'deformation',
      q: 'Permanently deformed nuclei are found mainly',
      options: ['at or near the magic numbers', 'only among the lightest nuclei (A < 20)', 'far from closed shells, e.g. the rare earths (150 < A < 190) and the actinides (A > 220)', 'only in odd-odd nuclei'], answer: 2,
      sol: R`Closed shells favour spherical shapes. With many valence nucleons of both kinds outside closed shells, the long-range quadrupole correlations win over pairing and the nucleus deforms: hence low $2^+$ energies and rotational bands mid-shell.`,
      trap: 'Doubly magic nuclei (¹⁶O, ²⁰⁸Pb) are the most spherical and have high first 2⁺ energies.' },
    { id: 'coll-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'rotational bands', unit: 'keV',
      q: R`The first $2^+$ state of a good rotor is at $90$ keV. Its $4^+$ level is at ______ keV.`,
      answer: 300, tol: 0.5, calc: () => 90 * 20 / 6,
      sol: R`$E(I) = E(2^+)\,I(I+1)/6$, so $E(4^+) = 90\times20/6 = 300$ keV.`,
      trap: R`$2\times90 = 180$ keV is the vibrator answer.` },

    // ---------- level 2 ----------
    { id: 'coll-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rotational bands', unit: 'keV',
      q: R`A rotational ground band has $E(2^+) = 80$ keV. The $6^+$ member lies at ______ keV.`,
      answer: 560, tol: 0.5, calc: () => 80 * 42 / 6,
      sol: R`$E(6)/E(2) = 42/6 = 7$, so $E(6^+) = 560$ keV.`,
      trap: 'The energies grow quadratically, not linearly, with spin.' },
    { id: 'coll-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'moment of inertia', unit: 'keV',
      q: R`A rotor has its first $2^+$ state at $90$ keV. The rotational constant $\hbar^2/2\mathcal I$ is ______ keV.`,
      answer: 15, tol: 0.05, calc: () => 90 / 6,
      sol: R`$E(2) = \dfrac{\hbar^2}{2\mathcal I}\times2\times3$, so $\hbar^2/2\mathcal I = 90/6 = 15$ keV, i.e. $\mathcal I/\hbar^2 = 33$ MeV$^{-1}$.`,
      trap: 'Divide by I(I+1) = 6, not by I = 2.' },
    { id: 'coll-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'gamma rays',
      q: R`In a $K = 0$ rotational band with constant $\hbar^2/2\mathcal I$, the E2 gamma rays $I \to I - 2$ have energies that`,
      options: [R`are all equal`, R`increase by a constant step of $8\hbar^2/2\mathcal I$ from one transition to the next`, R`decrease with spin`, R`increase as $I^3$`], answer: 1,
      sol: R`$E_\gamma(I) = \dfrac{\hbar^2}{2\mathcal I}[I(I+1) - (I-2)(I-1)] = \dfrac{\hbar^2}{2\mathcal I}(4I - 2)$. Raising $I$ by 2 adds $8\hbar^2/2\mathcal I$: a "picket fence" of evenly spaced lines in the gamma spectrum.`,
      trap: 'The levels are not evenly spaced, but the gamma rays between them are.' },
    { id: 'coll-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'vibrations',
      q: 'Two identical quadrupole phonons (each with angular momentum 2, parity +) can couple to which total spins?',
      options: [R`$0^+, 1^+, 2^+, 3^+, 4^+$`, R`$2^+$ only`, R`$0^+, 2^+, 4^+$`, R`$1^+, 3^+$`], answer: 2,
      sol: R`Two $j = 2$ objects give $J = 0$ to 4, but phonons are bosons, so the state must be symmetric: only even $J$ survive (for identical integer spins, the $J = 2j, 2j - 2, \dots$ states are symmetric). Hence the two-phonon triplet $0^+, 2^+, 4^+$.`,
      trap: 'Odd J would be antisymmetric under exchange of the two phonons.' },
    { id: 'coll-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'quadrupole moment',
      q: R`A nucleus with a positive intrinsic quadrupole moment $Q_0$ is`,
      options: ['prolate (cigar-shaped, elongated along its symmetry axis)', 'oblate (flattened, like a disc)', 'spherical', 'pear-shaped'], answer: 0,
      sol: R`$Q_0 = \int\rho(3z^2 - r^2)\,dV$ in the body frame. Charge stretched along $z$ makes $3z^2 > r^2$ on average: $Q_0 > 0$, prolate. Most deformed nuclei are prolate, with $\beta\approx0.2$ to 0.35.`,
      trap: 'The measured (spectroscopic) moment of a 2⁺ state in a prolate nucleus is negative; the intrinsic one is positive.' },
    { id: 'coll-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'quadrupole moment', unit: 'b',
      q: R`The spectroscopic quadrupole moment of a state of spin $I$ in a band of projection $K$ is $Q = Q_0\dfrac{3K^2 - I(I+1)}{(I+1)(2I+3)}$. For the $2^+$ state of a $K = 0$ band with $Q_0 = 7.0$ b, $Q$ = ______ b.`,
      answer: -2.0, tol: 0.01, calc: () => qs(7, 2, 0),
      sol: R`$Q = 7.0\times\dfrac{0 - 6}{3\times7} = 7.0\times(-2/7) = -2.0$ b. The negative sign for a prolate nucleus comes from the averaging of the rotating body over orientations in the lab.`,
      trap: 'The lab-frame moment has the opposite sign to Q₀ for K = 0, I = 2.' },
    { id: 'coll-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'quadrupole moment',
      q: R`A strongly deformed even-even nucleus has $Q_0 \approx 7$ b. Its measured (spectroscopic) quadrupole moment in the $0^+$ ground state is`,
      options: ['about 7 b', 'about −2 b', 'zero, because a spin-0 state cannot show a quadrupole moment in the lab', 'about +2 b'], answer: 2,
      sol: R`A state of spin 0 (or 1/2) is spherically symmetric on average in the lab, so its spectroscopic $Q$ vanishes whatever the intrinsic shape (the formula gives zero for $I = K = 0$). The deformation is measured instead through $B(E2; 0^+\to2^+)$ or the $Q$ of the $2^+$ state.`,
      trap: 'Intrinsic deformation and lab-frame quadrupole moment are different things.' },
    { id: 'coll-014', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'collective signatures', format: 'multi',
      q: 'Which observations indicate collective (many-nucleon) behaviour in an even-even nucleus?',
      options: ['Doubly magic nuclei have the lowest first 2⁺ energies of all.', 'Strongly enhanced E2 transitions, many times a single-particle (Weisskopf) estimate.', 'A ratio E(4⁺)/E(2⁺) close to 3.3.', 'A first 2⁺ state at only a few tens of keV.'], answer: [1, 2, 3],
      sol: R`Rotation and vibration involve many nucleons moving coherently, so E2 rates reach hundreds of Weisskopf units, the $2^+_1$ is very low (e.g. 80 keV against several MeV in $^{208}$Pb) and the spectrum follows $I(I+1)$. Doubly magic nuclei have the highest $2^+$ energies, the opposite of collectivity.`,
      trap: 'Low 2⁺ energies go with mid-shell, not magic, nuclei.' },
    { id: 'coll-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'odd-A bands',
      q: R`An odd-A deformed nucleus has a rotational band built on a $K = 5/2$ intrinsic state. The band's spins are`,
      options: [R`$\tfrac52, \tfrac92, \tfrac{13}2, \dots$ (steps of 2)`, R`$\tfrac12, \tfrac32, \tfrac52, \dots$`, R`$\tfrac52$ only`, R`$\tfrac52, \tfrac72, \tfrac92, \dots$ (steps of 1)`], answer: 3,
      sol: R`$I \ge K$, and for $K \ne 0$ all values $I = K, K + 1, K + 2, \dots$ occur (the reflection argument that removes odd $I$ for $K = 0$ does not apply). Both $\Delta I = 1$ (M1/E2) and $\Delta I = 2$ (E2) transitions are seen in such bands.`,
      trap: 'Only K = 0 bands skip every second spin.' },
    { id: 'coll-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'odd-A bands', unit: 'keV',
      q: R`A $K = 7/2$ band in an odd-A nucleus has $\hbar^2/2\mathcal I = 12$ keV. The energy of the $9/2$ member above the $7/2$ band head is ______ keV.`,
      answer: 108, tol: 0.5, calc: () => 12 * (4.5 * 5.5 - 3.5 * 4.5),
      sol: R`$E(I) = E_K + \dfrac{\hbar^2}{2\mathcal I}[I(I+1) - K(K+1)]$. $\tfrac92\cdot\tfrac{11}2 - \tfrac72\cdot\tfrac92 = 24.75 - 15.75 = 9$, so $\Delta E = 12\times9 = 108$ keV $= \dfrac{\hbar^2}{2\mathcal I}\cdot2(K+1)$.`,
      trap: 'Using I² instead of I(I+1) gives 96 keV.' },

    // ---------- level 3 ----------
    { id: 'coll-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'moment of inertia', unit: 'keV',
      q: R`Treat a nucleus with $A = 170$ as a rigid sphere of radius $R = 1.2A^{1/3}$ fm and mass $Am_N$ ($m_Nc^2 = 939$ MeV), so $\mathcal I_{rig} = \tfrac25Am_NR^2$. Then $\hbar^2/2\mathcal I_{rig}$ is ______ keV (two decimal places; $\hbar c = 197.3$ MeV fm).`,
      answer: 6.90, tol: 0.02, calc: () => rigid(170),
      sol: R`$R = 1.2\times170^{1/3} = 6.648$ fm, $R^2 = 44.20$ fm$^2$. $\mathcal Ic^2 = 0.4\times170\times939\times44.20 = 2.822\times10^6$ MeV fm$^2$. $\hbar^2/2\mathcal I = (\hbar c)^2/2\mathcal Ic^2 = 38937/5.644\times10^6$ MeV $= 6.90$ keV. A rigid rotor would put the $2^+$ at 41 keV; real nuclei here have it near 80 keV.`,
      trap: 'Rigid rotation overestimates the moment of inertia by about a factor of 2.' },
    { id: 'coll-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'moment of inertia',
      q: R`Measured moments of inertia of deformed nuclei lie between the irrotational-flow value and the rigid-body value (typically 30 to 50% of rigid). The main reason is`,
      options: ['nucleons are too heavy to rotate', 'pairing correlations make the nucleons partly superfluid, so not all of them follow the rotation rigidly', 'the Coulomb force opposes rotation', 'nuclei rotate only about their symmetry axis'], answer: 1,
      sol: R`Without pairing, independent nucleons in a deformed well give close to the rigid value (Inglis cranking). Pairing makes the nucleus behave partly like a superfluid, which can only rotate irrotationally (a much smaller $\mathcal I\propto\beta^2$). As pairing weakens at high spin, $\mathcal I$ rises towards rigid.`,
      trap: 'Rotation about the symmetry axis is not collective at all for a quantum system; it does not produce bands.' },
    { id: 'coll-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'moment of inertia',
      q: R`For a nucleus with $A = 170$, a rigid rotor would have $\hbar^2/2\mathcal I_{rig} = 6.90$ keV. The measured first $2^+$ is at $82$ keV. The ratio $\mathcal I/\mathcal I_{rig}$ is ______ (two decimal places).`,
      answer: 0.50, tol: 0.01, calc: () => 6 * 6.9 / 82,
      sol: R`$\hbar^2/2\mathcal I = 82/6 = 13.67$ keV. $\mathcal I/\mathcal I_{rig} = 6.90/13.67 = 0.50$: about half the rigid value, as pairing predicts.`,
      trap: 'The moment of inertia is inversely proportional to the rotational constant.' },
    { id: 'coll-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'deformation', unit: 'b',
      q: R`To first order in $\beta$, $Q_0 = \dfrac3{\sqrt{5\pi}}ZR^2\beta$. For $Z = 68$, $A = 166$ ($R = 1.2A^{1/3}$ fm) and $\beta = 0.30$, $Q_0$ is ______ b (two decimal places; 1 b $= 100$ fm$^2$).`,
      answer: 6.72, tol: 0.02, calc: () => K0 * 68 * (1.2 * Math.cbrt(166)) ** 2 * 0.3 / 100,
      sol: R`$R = 1.2\times166^{1/3} = 6.595$ fm, $R^2 = 43.50$ fm$^2$. $3/\sqrt{5\pi} = 0.7569$. $Q_0 = 0.7569\times68\times43.50\times0.30 = 672$ fm$^2 = 6.72$ b, about 30 times the quadrupole moment of a single proton spread over the nucleus.`,
      trap: '1 barn is 100 fm², so 672 fm² is 6.72 b, not 67.2 b.' },
    { id: 'coll-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'fission',
      q: R`In the liquid-drop model, a small spheroidal deformation $\varepsilon$ changes the surface and Coulomb energies to $E_S = E_S^0(1 + \tfrac25\varepsilon^2)$ and $E_C = E_C^0(1 - \tfrac15\varepsilon^2)$. The spherical shape becomes unstable (spontaneous fission without a barrier) when`,
      options: [R`$E_C^0 > E_S^0$`, R`$E_C^0 > 2E_S^0$`, R`$E_S^0 > 2E_C^0$`, R`$E_C^0 > \tfrac25E_S^0$`], answer: 1,
      sol: R`$\Delta E = \tfrac{\varepsilon^2}5(2E_S^0 - E_C^0)$. The sphere is stable while this is positive. Instability when $E_C^0 > 2E_S^0$, i.e. fissility $x = E_C^0/2E_S^0 > 1$, which with $E_C^0 = a_cZ^2/A^{1/3}$ and $E_S^0 = a_sA^{2/3}$ means $Z^2/A > 2a_s/a_c\approx50$.`,
      trap: 'Surface energy rises twice as fast with ε² as Coulomb energy falls; hence the factor 2.' },
    { id: 'coll-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fission',
      q: R`With semi-empirical coefficients $a_s = 17.8$ MeV and $a_c = 0.711$ MeV, the liquid-drop limit of stability against fission, $(Z^2/A)_{crit} = 2a_s/a_c$, is ______ (nearest whole number).`,
      answer: 50, tol: 0, calc: () => Math.round(2 * 17.8 / 0.711),
      sol: R`$2\times17.8/0.711 = 50.1$. Uranium-238 has $Z^2/A = 35.6$: below the limit, so it has a barrier (about 6 MeV) and fissions spontaneously only by slow tunnelling.`,
      trap: R`Not $a_s/a_c$ (25): the factor 2 comes from the different $\varepsilon^2$ coefficients.` },
    { id: 'coll-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'gamma rays', unit: 'keV',
      q: R`A $K = 0$ band has $\hbar^2/2\mathcal I = 14$ keV. The gamma ray from the $8^+$ to the $6^+$ member has energy ______ keV.`,
      answer: 420, tol: 0.5, calc: () => 14 * (72 - 42),
      sol: R`$E_\gamma = \dfrac{\hbar^2}{2\mathcal I}[8\cdot9 - 6\cdot7] = 14\times30 = 420$ keV $= 14\times(4\times8 - 2)$.`,
      trap: 'Using 8² − 6² = 28 gives 392 keV.' },
    { id: 'coll-024', type: 'mcq', level: 3, exams: ['net'], sub: 'odd-A bands',
      q: R`Bands built on $K = 1/2$ intrinsic states in odd-A nuclei often have an irregular level order (e.g. $3/2$ below $1/2$). This is described by`,
      options: ['the decoupling parameter, a Coriolis term that alternates in sign with spin', 'the pairing gap', 'the Coulomb energy of the odd proton', 'octupole vibrations'], answer: 0,
      sol: R`For $K = 1/2$ the Coriolis interaction connects the $\Omega = +1/2$ and $-1/2$ components directly, giving $E = \dfrac{\hbar^2}{2\mathcal I}\left[I(I+1) + a(-1)^{I+1/2}(I + \tfrac12)\right]$. Depending on $a$, levels pair up or invert.`,
      trap: 'The decoupling term exists only for K = 1/2.' },
    { id: 'coll-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'vibrations',
      q: R`Many even-even nuclei have a low-lying collective $3^-$ state. It is usually interpreted as`,
      options: ['a quadrupole (λ = 2) phonon', 'a rotational state of the ground band', 'a breathing (λ = 0) mode', 'an octupole (λ = 3) surface vibration, with parity (−1)^λ = −1'], answer: 3,
      sol: R`A surface mode $R = R_0[1 + \sum\alpha_{\lambda\mu}Y_{\lambda\mu}]$ has phonons of spin $\lambda$ and parity $(-1)^\lambda$. $\lambda = 2$ gives $2^+$, $\lambda = 3$ gives $3^-$ (pear-like oscillation), $\lambda = 0$ a high-lying compression mode, and $\lambda = 1$ is just a translation of the centre of mass, not an excitation.`,
      trap: 'Odd parity cannot appear in a K = 0 positive-parity ground band.' },
    { id: 'coll-026', type: 'msq', level: 3, exams: ['net'], sub: 'Nilsson model', format: 'multi',
      q: 'In the Nilsson model (single particles in an axially deformed potential), which statements are correct?',
      options: ['The total angular momentum j of a nucleon remains a good quantum number.', 'Its projection Ω on the symmetry axis is a good quantum number.', 'Each level is doubly degenerate (±Ω).', 'For prolate deformation, the low-Ω orbitals of a given j shell are pushed down in energy.'], answer: [1, 2, 3],
      sol: R`Axial symmetry conserves only $\Omega$; deformation mixes different $j$ (and $l$). Time-reversal symmetry gives the $\pm\Omega$ degeneracy, so each Nilsson level holds two nucleons. In a prolate well an orbit with small $\Omega$ lies close to the long axis, where the potential is deeper: it comes down; high-$\Omega$ orbits (equatorial) go up.`,
      trap: 'j is good only in a spherical potential.' },
    { id: 'coll-027', type: 'nat', level: 3, exams: ['net'], sub: 'quadrupole moment', unit: 'b',
      q: R`An odd-A nucleus has a $K = 3/2$ ground-state band head ($I = K = 3/2$) and intrinsic quadrupole moment $Q_0 = 6.0$ b. Its spectroscopic quadrupole moment is ______ b (two decimal places).`,
      answer: 1.20, tol: 0.01, calc: () => qs(6, 1.5, 1.5),
      sol: R`$Q = Q_0\dfrac{3K^2 - I(I+1)}{(I+1)(2I+3)} = 6.0\times\dfrac{27/4 - 15/4}{(5/2)(6)} = 6.0\times\dfrac3{15} = 1.20$ b. Even for $I = K$ the lab value is only a fraction of $Q_0$ (here 20%) because of quantum zero-point wobbling.`,
      trap: R`For $I = K$ the factor is $K(2K-1)/[(K+1)(2K+3)]$, not 1.` },
    { id: 'coll-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'vibrations',
      q: 'An even-even nucleus has levels at 0 (0⁺), 0.56 (2⁺), and a close group at 1.13 (4⁺), 1.13 (0⁺) and 1.21 (2⁺) MeV. This spectrum is best described as',
      options: ['a rigid rotor', 'a near-harmonic quadrupole vibrator (two-phonon triplet at about twice the 2⁺ energy)', 'a doubly magic nucleus with particle-hole states', 'an octupole-deformed rotor'], answer: 1,
      sol: R`$E(4^+)/E(2^+) = 1.13/0.56 = 2.0$, and the $0^+, 2^+, 4^+$ cluster at about $2E(2^+)$ is the two-phonon triplet, slightly split by anharmonicity. A rotor would put $4^+$ at $3.33\times0.56 = 1.87$ MeV.`,
      trap: 'A second 0⁺ near the 4⁺ is a hallmark of two-phonon states.' },
    { id: 'coll-029', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'gamma rays',
      q: R`Two consecutive E2 transitions in a $K = 0$ band of constant moment of inertia have energies $300$ keV ($I \to I - 2$) and $380$ keV ($I + 2 \to I$). The spin $I$ is ______.`,
      answer: 8, tol: 0, calc: () => { const A = (380 - 300) / 8; return (300 / A + 2) / 4; },
      sol: R`The step between consecutive lines is $8\hbar^2/2\mathcal I = 80$ keV, so $\hbar^2/2\mathcal I = 10$ keV. Then $E_\gamma(I) = 10(4I - 2) = 300$ gives $4I - 2 = 30$, $I = 8$. Spin assignments in high-spin bands are made this way.`,
      trap: 'The upper transition belongs to I + 2 → I; do not mix up which spin each line starts from.' },

    // ---------- level 4 ----------
    { id: 'coll-030', type: 'nat', level: 4, exams: ['net'], sub: 'B(E2)', unit: 'e² b²',
      q: R`In the rotational model, $B(E2; 0^+\to2^+) = \dfrac5{16\pi}e^2Q_0^2$. For $Q_0 = 6.0$ b, this is ______ $e^2$b$^2$ (two decimal places).`,
      answer: 3.58, tol: 0.01, calc: () => 5 / (16 * Math.PI) * 36,
      sol: R`$\dfrac5{16\pi} = 0.09947$; times $Q_0^2 = 36$ b$^2$: $3.58\,e^2$b$^2$. The downward $B(E2; 2^+\to0^+)$ is $\tfrac15$ of this (statistical factor $1/(2I_i + 1)$ ratio), $0.716\,e^2$b$^2$, hundreds of Weisskopf units.`,
      trap: 'Upward and downward B(E2) differ by (2I_f + 1)/(2I_i + 1) = 5.' },
    { id: 'coll-031', type: 'mcq', level: 4, exams: ['net'], sub: 'backbending',
      q: R`In some rare-earth nuclei, a plot of $2\mathcal I/\hbar^2$ against $(\hbar\omega)^2$ for the ground band bends back sharply near $I\approx14$ to 16. The accepted explanation is`,
      options: ['the nucleus becomes spherical', 'the Coriolis force breaks a pair of high-j nucleons (e.g. i₁₃/₂ neutrons) and aligns their angular momenta with the rotation axis, a new band crossing the ground band', 'electrons in the atom start to rotate', 'the pairing gap suddenly increases'], answer: 1,
      sol: R`At higher rotational frequency the Coriolis force acts against pairing most strongly for high-$j$, low-$\Omega$ orbits. A two-quasiparticle band with aligned $i_{13/2}$ angular momentum (about $12\hbar$) crosses the ground band; the yrast line switches to it, $\mathcal I$ jumps up and $\hbar\omega$ briefly decreases: backbending.`,
      trap: 'Pairing weakens, not strengthens, at the backbend.' },
    { id: 'coll-032', type: 'nat', level: 4, exams: ['net'], sub: 'moment of inertia', unit: 'MeV⁻¹',
      q: R`In a high-spin band, consecutive E2 gamma rays differ by $\Delta E_\gamma = 60$ keV. The dynamic moment of inertia $\mathcal I^{(2)} = 4\hbar^2/\Delta E_\gamma$, expressed as $\mathcal I^{(2)}/\hbar^2$, is ______ MeV$^{-1}$ (one decimal place).`,
      answer: 66.7, tol: 0.1, calc: () => 4 / 0.06,
      sol: R`$\mathcal I^{(2)}/\hbar^2 = 4/\Delta E_\gamma = 4/0.060$ MeV $= 66.7$ MeV$^{-1}$. For a rigid band $E_\gamma = (\hbar^2/2\mathcal I)(4I - 2)$ gives $\Delta E_\gamma = 8\hbar^2/2\mathcal I = 4\hbar^2/\mathcal I$, so $\mathcal I^{(2)} = \mathcal I$. Superdeformed bands show nearly constant $\Delta E_\gamma$ of about 50 to 60 keV.`,
      trap: R`$\mathcal I^{(2)}$ uses differences of gamma energies; the kinematic $\mathcal I^{(1)}$ uses $\hbar\omega/I$.` },
    { id: 'coll-033', type: 'msq', level: 4, exams: ['net'], sub: 'superdeformation', format: 'multi',
      q: 'Which statements about superdeformed bands are correct?',
      options: ['They correspond to an axis ratio of roughly 2 : 1.', 'Their gamma rays form a very regular picket fence with almost constant spacing.', 'Their moments of inertia are close to the rigid value for that shape.', 'They are the ground-state bands of most heavy nuclei.'], answer: [0, 1, 2],
      sol: R`Shell gaps at a 2:1 prolate shape (a second minimum in the energy surface) stabilise superdeformation at high spin, first in $^{152}$Dy. Pairing is quenched there, so $\mathcal I$ is nearly rigid and constant: the gamma spacing barely changes over 20 transitions. The bands are excited, high-spin structures, populated in heavy-ion fusion.`,
      trap: 'Superdeformed states lie several MeV above the yrast line at low spin; they are not ground states.' },
    { id: 'coll-034', type: 'nat', level: 4, exams: ['net'], sub: 'odd-A bands', unit: 'keV',
      q: R`A $K = 1/2$ band has $E(I) = E_0 + A\left[I(I+1) + a(-1)^{I+1/2}(I + \tfrac12)\right]$ with $A = 12$ keV and decoupling parameter $a = 0.5$. The $3/2$ level lies ______ keV above the $1/2$ level.`,
      answer: 54, tol: 0.5, calc: () => { const e = (I) => 12 * (I * (I + 1) + 0.5 * (-1) ** (I + 0.5) * (I + 0.5)); return e(1.5) - e(0.5); },
      sol: R`$I = \tfrac12$: $\tfrac34 + 0.5\times(-1)^1\times1 = 0.25$, energy $3$ keV. $I = \tfrac32$: $\tfrac{15}4 + 0.5\times(+1)\times2 = 4.75$, energy $57$ keV. Difference $54$ keV (without decoupling it would be $36$ keV).`,
      trap: R`The sign alternates: $(-1)^{I+1/2}$ is $-1$ for $I = \tfrac12$ and $+1$ for $\tfrac32$.` },
    { id: 'coll-035', type: 'mcq', level: 4, exams: ['net'], sub: 'vibrations',
      q: R`In the Bohr-Mottelson description of surface vibrations $R = R_0[1 + \sum_{\lambda\mu}\alpha_{\lambda\mu}Y^*_{\lambda\mu}]$, the $\lambda = 1$ term is left out because`,
      options: ['it has negative parity', 'it would violate charge conservation', 'to first order it is a displacement of the whole nucleus (centre-of-mass motion), not an internal excitation', 'its energy is infinite'], answer: 2,
      sol: R`$Y_{1\mu}$ is proportional to $x, y, z$, so $R_0\alpha_{1\mu}Y_{1\mu}$ just shifts the surface rigidly: the centre of mass moves and the shape is unchanged. Internal dipole motion of protons against neutrons exists (the giant dipole resonance), but that is not a surface oscillation of the whole drop.`,
      trap: 'The giant dipole resonance is protons against neutrons, a different kind of mode.' },
    { id: 'coll-036', type: 'mcq', level: 4, exams: ['net'], sub: 'vibrations',
      q: R`In a harmonic quadrupole vibrator, $B(E2; 2^+_2\to2^+_1)$ for the two-phonon $2^+$ state compared with $B(E2; 2^+_1\to0^+_1)$ is`,
      options: ['equal', 'twice as large', 'zero', 'half as large'], answer: 1,
      sol: R`The E2 operator is linear in phonon creation and destruction operators, so it changes phonon number by one: $\langle n = 2\|b^\dagger\|n = 1\rangle^2 = 2$ times $\langle1\|b^\dagger\|0\rangle^2$. Each two-phonon state decays to the one-phonon state with twice the strength; the crossover $2^+_2\to0^+$ (two phonons at once) is forbidden.`,
      trap: 'The two-phonon to ground-state transition is the forbidden one, not the 2₂ → 2₁.' },
    { id: 'coll-037', type: 'nat', level: 4, exams: ['net'], sub: 'deformation',
      q: R`A nucleus has surface $R(\theta) = R_0[1 + \beta Y_{20}(\theta)]$ with $\beta = 0.30$. The ratio of its long (polar) to short (equatorial) semi-axis is ______ (two decimal places). Use $Y_{20}(0) = \sqrt{5/4\pi}$ and $Y_{20}(\pi/2) = -\tfrac12\sqrt{5/4\pi}$.`,
      answer: 1.31, tol: 0.01, calc: () => { const c = Math.sqrt(5 / (4 * Math.PI)); return (1 + 0.3 * c) / (1 - 0.15 * c); },
      sol: R`$\sqrt{5/4\pi} = 0.6308$. Polar: $1 + 0.3\times0.6308 = 1.1892$. Equatorial: $1 - 0.15\times0.6308 = 0.9054$. Ratio $1.31$: a 30% elongation, typical of a well-deformed rare-earth nucleus.`,
      trap: 'The equator shrinks by half the stretch at the poles, so the ratio is not simply 1 + 0.63β.' },
    { id: 'coll-038', type: 'mcq', level: 4, exams: ['net'], sub: 'rotational bands',
      q: R`The so-called $\gamma$ band of a deformed even-even nucleus is a rotational band built on a $K = 2$ vibration. Its spins are`,
      options: [R`$2^+, 3^+, 4^+, 5^+, \dots$`, R`$0^+, 2^+, 4^+, \dots$`, R`$2^+, 4^+, 6^+, \dots$ only`, R`$1^-, 3^-, 5^-, \dots$`], answer: 0,
      sol: R`For $K \ne 0$ every $I \ge K$ appears, so $2^+, 3^+, 4^+, \dots$. The band head $2^+_\gamma$ (often near 1 MeV) comes from a vibration that breaks axial symmetry. The $\beta$ band ($K = 0$, a vibration preserving the axis) has $0^+, 2^+, 4^+, \dots$.`,
      trap: R`$0^+, 2^+, 4^+$ is the pattern of a $K = 0$ band such as the $\beta$ band.` },

    // ---------- level 5 ----------
    { id: 'coll-039', type: 'nat', level: 5, exams: ['net'], sub: 'fission', unit: 'MeV',
      q: R`A liquid drop has $E_S^0 = 600$ MeV and $E_C^0 = 900$ MeV. Using $E_S = E_S^0(1 + \tfrac25\varepsilon^2)$ and $E_C = E_C^0(1 - \tfrac15\varepsilon^2)$, the energy needed to deform it to $\varepsilon = 0.10$ is ______ MeV (two decimal places).`,
      answer: 0.60, tol: 0.01, calc: () => 0.01 / 5 * (1200 - 900),
      sol: R`$\Delta E = \tfrac25\varepsilon^2E_S^0 - \tfrac15\varepsilon^2E_C^0 = \tfrac{\varepsilon^2}5(2E_S^0 - E_C^0) = 0.002\times300 = 0.60$ MeV. Fissility $x = 900/1200 = 0.75$: stable, but the deformation stiffness is only a quarter of the Coulomb-free value.`,
      trap: 'Forgetting that the Coulomb term lowers the energy (opposite sign).' },
    { id: 'coll-040', type: 'nat', level: 5, exams: ['net'], sub: 'B(E2)', unit: 'b',
      q: R`A rotor has $B(E2; 2^+\to0^+) = 1.00\,e^2$b$^2$. In the rotational model $B(E2; 2^+\to0^+) = \dfrac1{16\pi}e^2Q_0^2$. The intrinsic quadrupole moment is ______ b (two decimal places).`,
      answer: 7.09, tol: 0.01, calc: () => Math.sqrt(16 * Math.PI * 1),
      sol: R`$Q_0 = \sqrt{16\pi B} = \sqrt{50.27} = 7.09$ b. (Check: $\tfrac15\times\tfrac5{16\pi}Q_0^2 = Q_0^2/16\pi$.) The predicted $2^+$ spectroscopic moment is then $-\tfrac27Q_0 = -2.03$ b, a test of the rigid-rotor picture.`,
      trap: R`Using the upward factor $5/16\pi$ with a downward $B(E2)$ gives $Q_0$ too small by $\sqrt5$.` },
    { id: 'coll-041', type: 'mcq', level: 5, exams: ['net'], sub: 'rotational bands',
      q: R`A deformed nucleus has $E(2^+) = 80.0$ keV and $E(4^+) = 264.0$ keV, so $R_{4/2} = 3.30$, slightly below 3.33. Fitting $E = AI(I+1) - B[I(I+1)]^2$ to these two levels gives`,
      options: [R`$B \approx 0.095$ keV, from the Coulomb repulsion between protons`, R`$B \approx 0.0095$ keV, because the moment of inertia decreases with spin`, R`$B \approx 0.0095$ keV, because centrifugal stretching (and weakening pairing) makes the moment of inertia grow with spin`, R`$B \approx -0.0095$ keV, because pairing grows with spin`], answer: 2,
      sol: R`$6A - 36B = 80$ and $20A - 400B = 264$. Multiply the first by $10/3$: $20A - 120B = 266.67$. Subtracting, $280B = 2.67$, so $B = 0.0095$ keV and $A = 13.39$ keV. A positive $B$ means the levels rise more slowly than $I(I+1)$, i.e. an effective $\mathcal I$ that grows with spin: the rotating nucleus stretches and its pairing weakens.`,
      trap: 'A smaller-than-rigid R4/2 means the moment of inertia increases with spin, not decreases.' },
    { id: 'coll-042', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'collective signatures', format: 'multi',
      q: R`Which assignments of $R_{4/2} = E(4^+_1)/E(2^+_1)$ to nuclear structure are standard?`,
      options: [R`$R_{4/2}\approx2.0$: harmonic vibrator`, R`$R_{4/2}\approx1.0$: well-deformed rotor`, R`$R_{4/2}\approx2.5$: $\gamma$-soft rotor`, R`$R_{4/2}\approx3.33$: axially symmetric rigid rotor`], answer: [0, 2, 3],
      sol: R`The three limits of the interacting boson model: U(5) vibrator ($R = 2$), O(6) $\gamma$-soft ($R = 2.5$), SU(3) rotor ($R = 10/3$). Real nuclei move from below 2 near closed shells, through 2 to 2.5 in transitional regions, to 3.3 mid-shell. A value near 1 would mean $4^+$ and $2^+$ almost degenerate, which happens only in special single-particle (seniority) cases near closed shells.`,
      trap: 'Rotors have the largest ratio, not the smallest.' },
  ],
  gens: [
    { id: 'coll-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rotational bands', unit: 'keV',
      make(r) {
        const E2 = pick(r, 40, 160, 1), I = choose(r, [4, 6, 8, 10, 12]), v = E2 * I * (I + 1) / 6;
        return { q: R`A well-deformed even-even nucleus has its first $2^+$ at $${E2}$ keV. In the rigid-rotor model, its $${I}^+$ ground-band level lies at ______ keV (one decimal place).`,
          answer: round(v, 1), tol: Math.max(0.1, round(v * 0.001, 2)), E2, I,
          sol: R`$E(I) = E(2^+)\,I(I+1)/6 = ${E2}\times${I * (I + 1)}/6 = ${round(v, 1)}$ keV.`,
          trap: 'Scale by I(I+1)/6, not by I/2 (vibrator) or I²/4.' };
      },
      verify: (p) => p.E2 * p.I * (p.I + 1) / 6 },
    { id: 'coll-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'gamma rays', unit: 'keV',
      make(r) {
        const A = pick(r, 6, 25, 0.5), I = choose(r, [2, 4, 6, 8, 10, 12, 14]), mode = choose(r, ['A', 'E2']);
        const v = A * (4 * I - 2);
        const given = mode === 'A' ? R`rotational constant $\hbar^2/2\mathcal I = ${A}$ keV` : R`first $2^+$ state at $${round(6 * A, 1)}$ keV`;
        return { q: R`A $K = 0$ rotational band has a ${given}. The E2 gamma ray from the $${I}^+$ to the $${I - 2}^+$ level has energy ______ keV (one decimal place).`,
          answer: round(v, 1), tol: Math.max(0.1, round(v * 0.001, 2)), A, I, mode,
          sol: R`${mode === 'E2' ? R`$\hbar^2/2\mathcal I = E(2^+)/6 = ${A}$ keV. ` : ''}$E_\gamma = \dfrac{\hbar^2}{2\mathcal I}[I(I+1) - (I-2)(I-1)] = ${A}\times(4\times${I} - 2) = ${round(v, 1)}$ keV.`,
          trap: R`$I(I+1) - (I-2)(I-1) = 4I - 2$, not $2I$.` };
      },
      verify: (p) => p.A * (4 * p.I - 2) },
    { id: 'coll-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'gamma rays',
      make(r) {
        const A = pick(r, 6, 20, 0.5), I = choose(r, [4, 6, 8, 10, 12, 14, 16]), e1 = round(A * (4 * I - 2), 1), e2 = round(A * (4 * I + 6), 1);
        return { q: R`Two consecutive E2 lines of a $K = 0$ band (constant moment of inertia) are at $${e1}$ keV and $${e2}$ keV. The lower one de-excites a level of spin $I$. Find $I$.`,
          answer: I, tol: 0, e1, e2,
          sol: R`The spacing is $8\hbar^2/2\mathcal I = ${round(e2 - e1, 1)}$ keV, so $\hbar^2/2\mathcal I = ${round((e2 - e1) / 8, 3)}$ keV. Then $4I - 2 = ${e1}/${round((e2 - e1) / 8, 3)} = ${round(e1 / ((e2 - e1) / 8), 2)}$, giving $I = ${I}$.`,
          trap: 'Find the rotational constant from the spacing first, then the spin from either line.' };
      },
      verify: (p) => (p.e1 / ((p.e2 - p.e1) / 8) + 2) / 4 },
    { id: 'coll-g04', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'collective signatures',
      make(r) {
        const kind = choose(r, ['rot', 'vib', 'gsoft', 'magic']), E2 = kind === 'magic' ? pick(r, 2000, 4500, 10) : kind === 'rot' ? pick(r, 60, 120, 1) : pick(r, 350, 800, 5);
        const ratio = { rot: pick(r, 3.25, 3.33, 0.01), vib: pick(r, 1.95, 2.15, 0.01), gsoft: pick(r, 2.4, 2.6, 0.01), magic: pick(r, 1.2, 1.6, 0.01) }[kind];
        const E4 = Math.round(E2 * ratio);
        const ans = { rot: 'a well-deformed axially symmetric rotor', vib: 'a near-harmonic quadrupole vibrator', gsoft: 'a γ-soft (transitional) nucleus', magic: 'a (near) closed-shell nucleus with non-collective excitations' }[kind];
        const o = mcqOptions(r, ans, ['a well-deformed axially symmetric rotor', 'a near-harmonic quadrupole vibrator', 'a γ-soft (transitional) nucleus', 'a (near) closed-shell nucleus with non-collective excitations'].filter((x) => x !== ans));
        return { q: `An even-even nucleus has its first 2⁺ at ${E2} keV and first 4⁺ at ${E4} keV. Its structure is best described as`, ...o,
          sol: R`$R_{4/2} = ${E4}/${E2} = ${round(E4 / E2, 2)}$. Rotor: about 3.33 with a low $2^+$ (below about 150 keV in heavy nuclei); vibrator: about 2; $\gamma$-soft: about 2.5; near closed shells $R_{4/2} < 2$ with a high $2^+$ (MeV). Hence ${ans}.`,
          trap: 'Use both the ratio and the absolute 2⁺ energy.' };
      } },
    { id: 'coll-g05', type: 'nat', level: 3, exams: ['net'], sub: 'quadrupole moment', unit: 'b',
      make(r) {
        const Q0 = pick(r, 2, 10, 0.1), K = choose(r, [0, 0, 0.5, 1.5, 2.5, 3.5, 2]), I = K === 0 ? choose(r, [2, 4, 6]) : K + int(r, 0, 3);
        const fK = K === 0.5 && I === 0.5 ? 1.5 : I;
        const v = qs(Q0, fK, K);
        return { q: R`A rotational band has $K = ${frac(K)}$ and intrinsic quadrupole moment $Q_0 = ${Q0}$ b. The spectroscopic quadrupole moment of its $I = ${frac(fK)}$ member is ______ b (three decimal places).`,
          answer: round(v, 3), tol: Math.max(0.002, round(Math.abs(v) * 0.002, 4)), Q0, K, fK,
          sol: R`$Q = Q_0\dfrac{3K^2 - I(I+1)}{(I+1)(2I+3)} = ${Q0}\times\dfrac{${round(3 * K * K, 4)} - ${round(fK * (fK + 1), 4)}}{${round(fK + 1, 2)}\times${round(2 * fK + 3, 2)}} = ${round(v, 3)}$ b.`,
          trap: 'For K = 0 the lab moment has the opposite sign to Q₀.' };
      },
      verify: (p) => qs(p.Q0, p.fK, p.K) },
    { id: 'coll-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'deformation',
      make(r) {
        const A = int(r, 150, 250), Z = Math.round(A * 0.4), mode = choose(r, ['Q', 'beta']), R2 = (1.2 * Math.cbrt(A)) ** 2;
        if (mode === 'Q') { const b = pick(r, 0.15, 0.35, 0.01), Q = K0 * Z * R2 * b / 100; return { q: R`A nucleus with $Z = ${Z}$, $A = ${A}$ has deformation $\beta = ${b}$. To first order, $Q_0 = \dfrac3{\sqrt{5\pi}}ZR^2\beta$ with $R = 1.2A^{1/3}$ fm. $Q_0$ is ______ b (two decimal places).`, answer: round(Q, 2), tol: Math.max(0.01, round(Q * 0.003, 3)), unit: 'b', A, Z, b, mode,
          sol: R`$R^2 = ${round(R2, 2)}$ fm$^2$; $Q_0 = 0.7569\times${Z}\times${round(R2, 2)}\times${b} = ${round(Q * 100, 1)}$ fm$^2 = ${round(Q, 2)}$ b.`, trap: '1 b = 100 fm².' }; }
        const Q = pick(r, 3, 12, 0.1), b = Q * 100 / (K0 * Z * R2);
        return { q: R`A nucleus with $Z = ${Z}$, $A = ${A}$ has intrinsic quadrupole moment $${Q}$ b. Using $Q_0 = \dfrac3{\sqrt{5\pi}}ZR^2\beta$ with $R = 1.2A^{1/3}$ fm, the deformation $\beta$ is ______ (three decimal places).`, answer: round(b, 3), tol: Math.max(0.001, round(b * 0.003, 4)), A, Z, Q, mode,
          sol: R`$\beta = Q_0/(0.7569ZR^2) = ${Q * 100}/(0.7569\times${Z}\times${round(R2, 2)}) = ${round(b, 3)}$.`, trap: 'Convert barns to fm² before dividing.' };
      },
      verify: (p) => { const R2 = (1.2 * Math.cbrt(p.A)) ** 2; return p.mode === 'Q' ? K0 * p.Z * R2 * p.b / 100 : p.Q * 100 / (K0 * p.Z * R2); } },
    { id: 'coll-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'moment of inertia', unit: 'keV',
      make(r) {
        const A = int(r, 150, 250), mode = choose(r, ['const', 'E2']), v = rigid(A) * (mode === 'E2' ? 6 : 1);
        return { q: R`Treat a nucleus with $A = ${A}$ as a rigid sphere ($R = 1.2A^{1/3}$ fm, $m_Nc^2 = 939$ MeV, $\hbar c = 197.327$ MeV fm). ${mode === 'E2' ? R`The energy of its first $2^+$ state as a rigid rotor` : R`Its rotational constant $\hbar^2/2\mathcal I_{rig}$`} is ______ keV (two decimal places).`,
          answer: round(v, 2), tol: Math.max(0.01, round(v * 0.003, 3)), A, mode,
          sol: R`$\mathcal I_{rig}c^2 = \tfrac25Am_Nc^2R^2 = 0.4\times${A}\times939\times${round((1.2 * Math.cbrt(A)) ** 2, 2)} = ${sci0(0.4 * A * MN * (1.2 * Math.cbrt(A)) ** 2)}$ MeV fm$^2$. $\hbar^2/2\mathcal I = (\hbar c)^2/2\mathcal Ic^2 = ${round(rigid(A), 3)}$ keV${mode === 'E2' ? R`; $E(2^+) = 6\times${round(rigid(A), 3)} = ${round(v, 2)}$ keV` : ''}.`,
          trap: 'Real nuclei have about half this moment of inertia (pairing), so their 2⁺ states lie about twice as high.' };
      },
      verify: (p) => rigid(p.A) * (p.mode === 'E2' ? 6 : 1) },
    { id: 'coll-g08', type: 'nat', level: 4, exams: ['net'], sub: 'B(E2)',
      make(r) {
        const mode = choose(r, ['B', 'Q']), dir = choose(r, ['up', 'down']), f = dir === 'up' ? 5 / (16 * Math.PI) : 1 / (16 * Math.PI);
        const lbl = dir === 'up' ? R`B(E2; 0^+\to2^+)` : R`B(E2; 2^+\to0^+)`;
        if (mode === 'B') { const Q = pick(r, 3, 10, 0.1), B = f * Q * Q; return { q: R`A rigid rotor has $Q_0 = ${Q}$ b. In the rotational model, $${lbl}$ is ______ $e^2$b$^2$ (three decimal places).`, answer: round(B, 3), tol: Math.max(0.001, round(B * 0.002, 4)), unit: 'e² b²', Q, f, mode,
          sol: R`$${lbl} = ${dir === 'up' ? R`\tfrac5{16\pi}` : R`\tfrac1{16\pi}`}e^2Q_0^2 = ${round(f, 5)}\times${round(Q * Q, 2)} = ${round(B, 3)}\,e^2$b$^2$.`, trap: 'Upward is five times downward for 0 ↔ 2.' }; }
        const B = pick(r, 0.2, 6, 0.05), Q = Math.sqrt(B / f);
        return { q: R`A rotor has $${lbl} = ${B}\,e^2$b$^2$. Its intrinsic quadrupole moment is ______ b (two decimal places).`, answer: round(Q, 2), tol: Math.max(0.01, round(Q * 0.002, 3)), unit: 'b', B, f, mode,
          sol: R`$Q_0 = \sqrt{${lbl}/(${dir === 'up' ? R`5/16\pi` : R`1/16\pi`})} = \sqrt{${B}/${round(f, 5)}} = ${round(Q, 2)}$ b.`, trap: 'Check whether the B(E2) given is upward or downward.' };
      },
      verify: (p) => (p.mode === 'B' ? p.f * p.Q * p.Q : Math.sqrt(p.B / p.f)) },
    { id: 'coll-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'odd-A bands', unit: 'keV',
      make(r) {
        const K = choose(r, [1.5, 2.5, 3.5, 4.5, 5.5]), n = int(r, 1, 3), A = pick(r, 8, 20, 0.5), I = K + n;
        const v = A * (I * (I + 1) - K * (K + 1));
        return { q: R`An odd-A nucleus has a rotational band on a $K = ${frac(K)}$ intrinsic state with $\hbar^2/2\mathcal I = ${A}$ keV. The $I = ${frac(I)}$ member lies ______ keV above the band head (one decimal place).`,
          answer: round(v, 1), tol: Math.max(0.1, round(v * 0.001, 2)), K, I, A,
          sol: R`$E(I) - E(K) = \dfrac{\hbar^2}{2\mathcal I}[I(I+1) - K(K+1)] = ${A}\times(${round(I * (I + 1), 2)} - ${round(K * (K + 1), 2)}) = ${round(v, 1)}$ keV.`,
          trap: 'The band starts at I = K, and K ≠ 0 bands contain every spin, odd and even steps.' };
      },
      verify: (p) => p.A * (p.I * (p.I + 1) - p.K * (p.K + 1)) },
    { id: 'coll-g10', type: 'nat', level: 4, exams: ['net'], sub: 'odd-A bands', unit: 'keV',
      make(r) {
        const A = pick(r, 8, 20, 0.5), a = choose(r, [-1, -0.5, 0.3, 0.5, 1, 1.5, 2]), I = choose(r, [1.5, 2.5, 3.5, 4.5]);
        const e = (J) => A * (J * (J + 1) + a * (-1) ** (J + 0.5) * (J + 0.5)), v = e(I) - e(0.5);
        return { q: R`A $K = 1/2$ band has $E(I) = E_0 + A\left[I(I+1) + a(-1)^{I+1/2}(I + \tfrac12)\right]$ with $A = ${A}$ keV and decoupling parameter $a = ${a}$. The $I = ${frac(I)}$ level lies ______ keV above (or, if negative, below) the $I = 1/2$ level (one decimal place).`,
          answer: round(v, 1), tol: Math.max(0.1, round(Math.abs(v) * 0.001, 2)), A, a, I,
          sol: R`$E(\tfrac12) - E_0 = A[0.75 - a] = ${round(e(0.5), 2)}$ keV. $E(${frac(I)}) - E_0 = A[${round(I * (I + 1), 2)} ${a * (-1) ** (I + 0.5) > 0 ? '+' : '-'} ${Math.abs(a)}\times${I + 0.5}] = ${round(e(I), 2)}$ keV. Difference $${round(v, 1)}$ keV.`,
          trap: R`$(-1)^{I+1/2}$ is $+1$ for $I = 3/2, 7/2, \dots$ and $-1$ for $1/2, 5/2, \dots$.` };
      },
      verify: (p) => { const e = (J) => p.A * (J * (J + 1) + p.a * (-1) ** (J + 0.5) * (J + 0.5)); return e(p.I) - e(0.5); } },
    { id: 'coll-g11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fission',
      make(r) {
        const A = int(r, 180, 300), Z = Math.round(A * pick(r, 0.38, 0.42, 0.005)), as = 17.8, ac = 0.711, mode = choose(r, ['x', 'dE']);
        const ES = as * A ** (2 / 3), EC = ac * Z * Z / Math.cbrt(A), x = EC / (2 * ES);
        if (mode === 'x') return { q: R`For a nucleus with $Z = ${Z}$, $A = ${A}$, take $E_S^0 = a_sA^{2/3}$ and $E_C^0 = a_cZ^2/A^{1/3}$ with $a_s = 17.8$ MeV, $a_c = 0.711$ MeV. Its fissility $x = E_C^0/2E_S^0$ is ______ (three decimal places).`, answer: round(x, 3), tol: 0.002, A, Z, mode,
          sol: R`$E_S^0 = 17.8\times${A}^{2/3} = ${round(ES, 1)}$ MeV and $E_C^0 = 0.711\times${Z * Z}/${A}^{1/3} = ${round(EC, 1)}$ MeV, so $x = ${round(x, 3)}$, equivalently $(Z^2/A)/50.07$.${x >= 1 ? ' Since x ≥ 1, the liquid drop has no fission barrier.' : ''}`, trap: 'x = 1 is the liquid-drop limit; real heavy nuclei have x of about 0.7 to 0.8.' };
        const eps = pick(r, 0.05, 0.2, 0.01), dE = eps * eps / 5 * (2 * ES - EC);
        return { q: R`For $Z = ${Z}$, $A = ${A}$ ($a_s = 17.8$ MeV, $a_c = 0.711$ MeV), the liquid-drop energy change for a spheroidal deformation $\varepsilon = ${eps}$ is $\Delta E = \tfrac{\varepsilon^2}5(2E_S^0 - E_C^0)$ = ______ MeV (two decimal places).`, answer: round(dE, 2), tol: Math.max(0.01, round(Math.abs(dE) * 0.004, 3)), unit: 'MeV', A, Z, eps, mode,
          sol: R`$E_S^0 = ${round(ES, 1)}$ MeV, $E_C^0 = ${round(EC, 1)}$ MeV. $\Delta E = (${round(eps * eps, 4)}/5)(${round(2 * ES, 1)} - ${round(EC, 1)}) = ${round(dE, 2)}$ MeV.`, trap: 'The Coulomb term enters with a minus sign: deformation lowers the Coulomb energy.' };
      },
      verify: (p) => { const ES = 17.8 * p.A ** (2 / 3), EC = 0.711 * p.Z * p.Z / Math.cbrt(p.A); return p.mode === 'x' ? EC / (2 * ES) : p.eps * p.eps / 5 * (2 * ES - EC); } },
    { id: 'coll-g12', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'rotational bands',
      make(r) {
        const c = choose(r, [
          ['the ground band of an even-even deformed nucleus (K = 0, positive parity)', R`$0^+, 2^+, 4^+, 6^+, \dots$`],
          ['a γ band (K = 2) in an even-even nucleus', R`$2^+, 3^+, 4^+, 5^+, \dots$`],
          ['a band on a K = 7/2 one-quasiparticle state of positive parity', R`$\tfrac72^+, \tfrac92^+, \tfrac{11}2^+, \dots$`],
          ['a K = 0⁻ octupole band in an even-even nucleus', R`$1^-, 3^-, 5^-, \dots$`],
          ['the two-phonon quadrupole multiplet of a vibrator', R`$0^+, 2^+, 4^+$ (degenerate)`],
        ]);
        const all = [R`$0^+, 2^+, 4^+, 6^+, \dots$`, R`$2^+, 3^+, 4^+, 5^+, \dots$`, R`$\tfrac72^+, \tfrac92^+, \tfrac{11}2^+, \dots$`, R`$1^-, 3^-, 5^-, \dots$`, R`$0^+, 2^+, 4^+$ (degenerate)`, R`$0^+, 1^+, 2^+, 3^+, \dots$`];
        const o = mcqOptions(r, c[1], all.filter((x) => x !== c[1]));
        return { q: `Which spin sequence belongs to ${c[0]}?`, ...o,
          sol: R`A band has $I \ge K$. For $K = 0$ the reflection symmetry of the intrinsic state allows only every second spin: even $I$ for $0^+$ bands, odd for $0^-$. For $K \ne 0$ all $I = K, K+1, \dots$ appear. Two phonons of spin 2 (bosons) couple only to $0, 2, 4$. Here: ${c[1]}.`,
          trap: 'Only K = 0 bands skip spins.' };
      } },
    ...more,
  ],
};
function sci0(v) { const e = Math.floor(Math.log10(v)); return `${(v / 10 ** e).toFixed(3)}\\times10^{${e}}`; }
