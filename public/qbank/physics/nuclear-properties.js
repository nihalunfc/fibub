// Nuclear size, spin and moments (GATE / CSIR NET level): radius and density, charge distributions from electron
// scattering (form factors, rms radius, Fermi shape, skin thickness), muonic atoms, mirror nuclei and Coulomb energy
// differences, Fermi gas, nuclear spin and parity, magnetic dipole moments (nuclear magneton, NMR, deuteron D state),
// electric quadrupole moments (intrinsic and spectroscopic), hyperfine counting, isospin labels.
// Original questions for fibub.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './nuclear-properties.more.gen.js';

const HBARC = 197.327;          // MeV fm
const E2 = 1.43996;             // e^2/(4 pi eps0) in MeV fm
const MUN_H = 7.62259;          // mu_N / h in MHz per tesla
const A0FM = 52917.72;          // Bohr radius in fm
const MMU = 206.768;            // muon mass / electron mass
const UME = 1822.888;           // 1 u in electron masses
const SYM = ['n', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'];
const nuc = (Z, A) => `${'{}'}^{${A}}\\text{${SYM[Z]}}`;
const half = (x) => (Number.isInteger(x) ? String(x) : `${2 * x}/2`);

export default {
  topic: 'nuclear-properties',
  items: [
    // ---------- level 1 ----------
    { id: 'npr-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'charge density',
      q: 'High-energy electron scattering shows that, for medium and heavy nuclei, the charge density near the centre',
      options: ['grows in proportion to $A$', 'falls as $A^{-1/3}$', 'is roughly the same for all of them, about $0.07$ to $0.08\\,e$ fm$^{-3}$', 'is zero, because the protons sit on the surface'], answer: 2,
      sol: 'Measured charge densities have a flat interior of nearly the same height for all medium and heavy nuclei, with a surface of nearly constant thickness. This saturation is why $R \\propto A^{1/3}$: adding nucleons adds volume at constant density. With $Z/A \\approx 0.4$ and $0.16$ nucleons fm$^{-3}$, the charge density is about $0.07\\,e$ fm$^{-3}$.',
      trap: 'Thinking a bigger nucleus must be denser, as gravitating bodies are.' },
    { id: 'npr-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'spin and parity',
      q: 'The ground state of every even-even nucleus (even $Z$ and even $N$) has spin and parity',
      options: ['$0^+$', '$1^+$', '$\\tfrac12^+$', '$0^-$'], answer: 0,
      sol: 'Like nucleons pair off into states of total angular momentum zero (the pairing force favours $j^2$ coupled to $J = 0$). With every proton and every neutron paired, the total is $J = 0$, and pairs of nucleons in the same orbit have parity $(\\pm1)^2 = +1$. No exception is known.',
      trap: 'Half-integer spins need an odd number of nucleons; $0^-$ would need an unpaired odd-parity excitation.' },
    { id: 'npr-003', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'spin and parity',
      q: 'Which of these nuclides must have a half-integer ground-state spin?',
      options: ['${}^{12}$C', '${}^{14}$N', '${}^{40}$Ca', '${}^{17}$O'], answer: 3,
      sol: 'A half-integer total angular momentum needs an odd number of spin-1/2 particles, so odd $A$. Only ${}^{17}$O ($A = 17$) qualifies; its spin is $5/2^+$, from the odd neutron in $1d_{5/2}$. ${}^{14}$N is odd-odd ($Z = N = 7$) with $A$ even, so its spin is an integer ($1^+$).',
      trap: 'An odd $Z$ alone does not make the spin half-integer: ${}^{14}$N has an odd neutron number too.' },
    { id: 'npr-004', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'magnetic moments',
      q: 'The nuclear magneton $\\mu_N = e\\hbar/2m_p$ compares with the Bohr magneton $\\mu_B$ as',
      options: ['$\\mu_N = 1836\\,\\mu_B$', '$\\mu_N \\approx \\mu_B/1836$', '$\\mu_N = \\mu_B$', '$\\mu_N \\approx \\mu_B/137$'], answer: 1,
      sol: 'The two have the same form with the electron mass replaced by the proton mass, so $\\mu_N/\\mu_B = m_e/m_p = 1/1836$. Hence $\\mu_N = 5.05\\times10^{-27}$ J/T $= 3.15\\times10^{-8}$ eV/T. This is why nuclear magnetic effects (hyperfine structure, NMR) are about a thousand times smaller than electronic ones.',
      trap: 'Dividing by $\\alpha^{-1} = 137$ confuses the magneton ratio with the fine-structure constant.' },
    { id: 'npr-005', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'density', unit: 'fm⁻³',
      q: 'If $R = R_0A^{1/3}$ with $R_0 = 1.2$ fm for a uniform sphere of nucleons, the number of nucleons per fm$^3$ is ______ (to three decimal places).',
      answer: 0.138, tol: 0.002, calc: () => 3 / (4 * Math.PI * 1.2 ** 3),
      sol: '$n = \\dfrac{A}{\\frac43\\pi R_0^3A} = \\dfrac{3}{4\\pi R_0^3} = \\dfrac{3}{4\\pi\\times1.728} = 0.138$ fm$^{-3}$, independent of $A$. (The central density from electron scattering, about $0.16$ fm$^{-3}$, is a little higher because the real edge is diffuse.)',
      trap: 'Keeping $A$ in the answer: it cancels.' },
    { id: 'npr-006', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'nomenclature',
      q: 'Nuclides with the same neutron number $N$ but different $Z$ are called',
      options: ['isotopes', 'isobars', 'isomers', 'isotones'], answer: 3,
      sol: 'Isotopes share $Z$, isobars share $A$, isotones share $N$ (the "n" is the reminder), and isomers are long-lived excited states of one nuclide. Example of isotones: ${}^{13}$C and ${}^{14}$N both have $N = 7$.',
      trap: 'Isomers are not different nuclides at all, just one nucleus in a long-lived excited state.' },

    // ---------- level 2 ----------
    { id: 'npr-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rms radius', unit: 'fm',
      q: 'Model ${}^{64}$Zn as a uniformly charged sphere of radius $R = 1.2A^{1/3}$ fm. Its root-mean-square charge radius is ______ fm (to two decimal places).',
      answer: 3.72, tol: 0.02, calc: () => Math.sqrt(0.6) * 1.2 * 4,
      sol: '$R = 1.2\\times64^{1/3} = 4.8$ fm. For a uniform sphere $\\langle r^2\\rangle = \\dfrac{\\int_0^R r^2\\,4\\pi r^2dr}{\\frac43\\pi R^3} = \\tfrac35R^2$, so $r_{rms} = \\sqrt{3/5}\\,R = 0.7746\\times4.8 = 3.72$ fm.',
      trap: 'Reporting $R$ itself: electron scattering measures the rms radius, which is smaller than the edge radius.' },
    { id: 'npr-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'form factor',
      q: 'For a spherical charge distribution normalised to 1, the form factor at small momentum transfer $q$ (with $\\hbar = 1$) behaves as',
      options: ['$F(q) \\approx q^2\\langle r^2\\rangle/6$', '$F(q) \\approx 1 + q^2\\langle r^2\\rangle/6$', '$F(q) \\approx 1 - q^2\\langle r^2\\rangle/6$', '$F(q) \\approx 1 - q\\,r_{rms}$'], answer: 2,
      sol: '$F(q) = \\int\\rho(r)\\dfrac{\\sin qr}{qr}\\,d^3r$. Expand $\\dfrac{\\sin x}{x} = 1 - \\dfrac{x^2}{6} + \\dots$: $F(q) = 1 - \\dfrac{q^2}{6}\\langle r^2\\rangle + \\dots$. So the initial slope against $q^2$ gives the rms radius whatever the shape, which is why it is the quantity quoted.',
      trap: 'The sign: the form factor starts at 1 and falls, because waves from different parts of the charge interfere destructively.' },
    { id: 'npr-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'electron scattering',
      q: 'Why are high-energy electrons, rather than alpha particles, the standard probe of the charge distribution of a nucleus?',
      options: ['Electrons are point-like and feel only the well-understood electromagnetic interaction, not the strong force', 'Electrons are heavier, so their wavelength is shorter', 'Alpha particles cannot reach the nucleus at any energy', 'Electrons are absorbed only by protons'], answer: 0,
      sol: 'The electron has no structure down to the smallest scales probed and interacts only through QED, so the cross-section factors into the Mott (point) cross-section times $|F(q)|^2$, and $F(q)$ is the Fourier transform of the charge density. An alpha particle is itself extended and feels the strong force once it touches the nucleus, which mixes in nuclear-force effects.',
      trap: 'Electrons are lighter, not heavier; their short wavelength comes from high energy.' },
    { id: 'npr-010', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'deuteron',
      q: 'Which statements about the deuteron are correct?',
      options: ['Its ground state is $J^\\pi = 1^+$', 'Its magnetic moment equals $\\mu_p + \\mu_n$ exactly', 'Its non-zero electric quadrupole moment shows a small $D$-state admixture, caused by the tensor force', 'It has a bound excited state with $J = 0$'], answer: [0, 2],
      sol: 'The deuteron is mainly ${}^3S_1$ ($J = 1$, even $L$, so positive parity). Its moment $0.857\\,\\mu_N$ differs slightly from $\\mu_p + \\mu_n = 0.880\\,\\mu_N$, and its quadrupole moment $0.286$ fm$^2$ is non-zero; both need about 4% of ${}^3D_1$, which only a non-central (tensor) force mixes in. It has no bound excited state: the ${}^1S_0$ $np$ state is unbound by about 70 keV.',
      trap: 'A pure $S$ state would have zero quadrupole moment; the moments are the evidence for the tensor force.' },
    { id: 'npr-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'NMR', unit: 'MHz',
      q: 'The proton has $g_p = 5.586$. In a $1.5$ T MRI magnet, the proton spin-flip (Larmor) frequency is ______ MHz (to one decimal place). Use $\\mu_N/h = 7.623$ MHz/T.',
      answer: 63.9, tol: 0.1, calc: () => 5.586 * 7.623 * 1.5,
      sol: 'For spin $\\tfrac12$ the two levels $m = \\pm\\tfrac12$ are split by $\\Delta E = g_p\\mu_NB$, so $f = g_p(\\mu_N/h)B = 5.586\\times7.623\\times1.5 = 63.9$ MHz.',
      trap: 'Using $\\mu_p = 2.793\\,\\mu_N$ in place of $g_p$ gives half the answer; the splitting is $2\\mu_pB$.' },
    { id: 'npr-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'quadrupole moment',
      q: 'A nucleus has ground-state spin $I = \\tfrac12$. Its measured (spectroscopic) electric quadrupole moment is',
      options: ['positive if the nucleus is prolate', 'zero, whatever the shape of the intrinsic charge distribution', 'negative if the nucleus is oblate', 'equal to its intrinsic quadrupole moment'], answer: 1,
      sol: 'The quadrupole operator is a rank-2 tensor. By the Wigner-Eckart theorem its expectation value in a state of spin $I$ vanishes unless $2I \\ge 2$, that is $I \\ge 1$. For $I = 0$ or $\\tfrac12$ the orientation averages out, so $Q = 0$ even if the intrinsic shape is deformed.',
      trap: 'Mixing up the intrinsic moment (shape in the body frame) with the moment you can measure in the lab.' },
    { id: 'npr-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'density', unit: 'km',
      q: 'A neutron star of $1.4$ solar masses ($M_\\odot = 1.989\\times10^{30}$ kg) is modelled as a uniform sphere at nuclear density, taking $R_0 = 1.2$ fm and nucleon mass $1.6605\\times10^{-27}$ kg. Its radius is ______ km (to one decimal place).',
      answer: 14.3, tol: 0.15, calc: () => { const rho = 1.6605e-27 / (4 / 3 * Math.PI * 1.2e-15 ** 3); return Math.cbrt(3 * 1.4 * 1.989e30 / (4 * Math.PI * rho)) / 1000; },
      sol: 'Nuclear mass density $\\rho = m_u/(\\frac43\\pi R_0^3) = 1.6605\\times10^{-27}/(7.238\\times10^{-45}) = 2.29\\times10^{17}$ kg/m$^3$. Volume $V = 2.785\\times10^{30}/2.29\\times10^{17} = 1.21\\times10^{13}$ m$^3$, so $R = (3V/4\\pi)^{1/3} = 1.43\\times10^4$ m $= 14.3$ km. Real neutron stars (11 to 13 km) are a little denser in the core.',
      trap: 'Using $R = R_0A^{1/3}$ directly with $A \\sim 10^{57}$ gives the same answer; the slip is losing a power of ten in the cube root.' },
    { id: 'npr-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'mirror nuclei',
      q: 'Which pair are mirror nuclei?',
      options: ['${}^{14}$C and ${}^{14}$N', '${}^{13}$C and ${}^{13}$N', '${}^{12}$C and ${}^{13}$C', '${}^{16}$O and ${}^{16}$N'], answer: 1,
      sol: 'Mirror nuclei have $Z$ and $N$ swapped. ${}^{13}$C has $Z = 6, N = 7$; ${}^{13}$N has $Z = 7, N = 6$. ${}^{14}$C ($6, 8$) and ${}^{14}$N ($7, 7$) are isobars but not mirrors; ${}^{16}$O ($8, 8$) and ${}^{16}$N ($7, 9$) likewise.',
      trap: 'Every mirror pair is an isobar pair, but not every isobar pair is a mirror pair.' },
    { id: 'npr-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Fermi distribution',
      q: 'Charge densities are well fitted by $\\rho(r) = \\rho_0/[1 + e^{(r - c)/a}]$. Going from ${}^{40}$Ca to ${}^{208}$Pb, the surface thickness $t$ (the 90% to 10% fall)',
      options: ['grows in proportion to $A^{1/3}$', 'shrinks in proportion to $A^{-1/3}$', 'doubles', 'stays nearly constant, about $2.3$ to $2.5$ fm'], answer: 3,
      sol: 'Fits give $c \\approx 1.07A^{1/3}$ fm and $a \\approx 0.54$ fm for all medium and heavy nuclei, so $t = 4a\\ln3 \\approx 2.4$ fm is the same. Only the half-density radius $c$ grows; heavy nuclei are relatively sharper-edged.',
      trap: 'Scaling everything with $A^{1/3}$: the skin is set by the range of the nuclear force, which does not change.' },
    { id: 'npr-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Fermi distribution', unit: 'fm',
      q: 'For the Fermi charge distribution $\\rho_0/[1 + e^{(r - c)/a}]$ with diffuseness $a = 0.55$ fm, the distance over which the density falls from 90% to 10% of $\\rho_0$ is ______ fm (to two decimal places). Treat $\\rho_0$ as the central density ($c \\gg a$).',
      answer: 2.42, tol: 0.02, calc: () => 4 * 0.55 * Math.log(3),
      sol: '$\\rho/\\rho_0 = f$ when $e^{(r - c)/a} = 1/f - 1$, so $r = c + a\\ln(1/f - 1)$. At $f = 0.9$: $r = c - a\\ln9$; at $f = 0.1$: $r = c + a\\ln9$. The difference is $2a\\ln9 = 4a\\ln3 = 4.394\\times0.55 = 2.42$ fm.',
      trap: 'Using $2a$ or $4a$ instead of $4a\\ln3$.' },
    { id: 'npr-017', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'magnetic moments',
      q: 'The neutron has spin $\\tfrac12$ and magnetic moment $\\mu_n = -1.913\\,\\mu_N$. This means',
      options: ['the neutron carries a small net negative charge', 'Dirac theory predicts $-1.913\\,\\mu_N$ for any neutral spin-$\\tfrac12$ particle', 'its moment points opposite to its spin, and a neutral particle with a moment must have internal charge structure', 'the neutron spin is really $\\tfrac32$'], answer: 2,
      sol: 'A negative moment means $\\vec\\mu$ is antiparallel to $\\vec S$. A structureless neutral Dirac particle would have $\\mu = 0$; a non-zero value shows charged constituents (quarks) inside. The naive quark model even predicts $\\mu_n/\\mu_p = -2/3$, close to the measured $-0.685$.',
      trap: 'The neutron is neutral to better than $10^{-21}e$; the moment comes from structure, not net charge.' },

    // ---------- level 3 ----------
    { id: 'npr-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hyperfine structure',
      q: 'An atomic level with $J = 5/2$ is seen to split into 4 hyperfine levels. The nuclear spin $I$ is ______.',
      answer: 1.5, tol: 0,
      sol: '$\\vec F = \\vec I + \\vec J$ takes values from $|I - J|$ to $I + J$: that is $2\\min(I, J) + 1$ levels. If $I \\ge J$ there would be $2J + 1 = 6$ levels. Seeing 4 means $I < J$ and $2I + 1 = 4$, so $I = 3/2$.',
      trap: 'Using $2J + 1$ or forgetting that the count is set by the smaller of $I$ and $J$.' },
    { id: 'npr-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'form factor', unit: 'degrees',
      q: 'Electrons of $400$ MeV scatter elastically from a nucleus modelled as a uniform sphere of radius $6.0$ fm. The first zero of the form factor is at $qR = 4.493$. Neglecting recoil, it appears at a scattering angle of ______ degrees (to one decimal place). Use $\\hbar c = 197.3$ MeV fm.',
      answer: 21.3, tol: 0.2, calc: () => 2 * Math.asin(4.493 / 6 * 197.327 / 800) * 180 / Math.PI,
      sol: 'For an ultrarelativistic electron $p = E/c$ and elastic momentum transfer is $\\hbar q = 2p\\sin(\\theta/2)$. Zero at $q = 4.493/6.0 = 0.749$ fm$^{-1}$: $\\sin(\\theta/2) = \\dfrac{q\\hbar c}{2E} = \\dfrac{0.749\\times197.3}{800} = 0.1847$, $\\theta/2 = 10.64^\\circ$, $\\theta = 21.3^\\circ$.',
      trap: 'Writing $q = p\\sin\\theta$; the momentum transfer is $2p\\sin(\\theta/2)$.' },
    { id: 'npr-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'mirror nuclei',
      q: 'After correcting for the neutron-proton mass difference, the binding energies of mirror nuclei such as ${}^{11}$B and ${}^{11}$C differ by an amount that',
      options: ['agrees well with the difference in their Coulomb energies, showing that the $nn$ and $pp$ nuclear forces are nearly equal', 'is about 8 MeV per nucleon, the full binding', 'is zero, because they have the same $A$', 'comes mainly from the pairing term'], answer: 0,
      sol: 'Swapping all protons and neutrons leaves the number of $np$ pairs unchanged and exchanges $pp$ with $nn$ pairs. If the nuclear force is charge symmetric ($V_{nn} = V_{pp}$), only the Coulomb energy differs, and the measured differences fit $\\Delta E_C = \\tfrac65 Z e^2/(4\\pi\\varepsilon_0R)$ with $R \\approx 1.2A^{1/3}$ fm. Pairing is the same in both (both odd-$A$).',
      trap: 'Mirror nuclei have the same pairing and asymmetry terms; only Coulomb distinguishes them.' },
    { id: 'npr-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'mirror nuclei', unit: 'fm',
      q: 'In a mirror pair with $A = 41$ the nucleus with $Z = 21$ decays by $\\beta^+$ to the one with $Z = 20$, with endpoint (maximum positron kinetic energy) $5.50$ MeV. Treat both as uniform spheres of the same radius $R$ and assume the nuclear forces are charge symmetric. Using $(m_n - m_H)c^2 = 0.782$ MeV, $m_ec^2 = 0.511$ MeV and $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm, $R$ = ______ fm (to two decimal places).',
      answer: 4.73, tol: 0.03, calc: () => 1.2 * 20 * 1.44 / (5.5 + 0.782 + 1.022),
      sol: 'With atomic masses, $\\beta^+$ needs $E_{max} = [M(21) - M(20)]c^2 - 2m_ec^2$. The heavier-$Z$ atom has one more H atom and one fewer neutron, and less binding by $\\Delta E_C$: $[M(21) - M(20)]c^2 = \\Delta E_C - 0.782$ MeV. So $\\Delta E_C = 5.50 + 1.022 + 0.782 = 7.304$ MeV. For uniform spheres $E_C = \\tfrac35Z(Z - 1)e^2/(4\\pi\\varepsilon_0R)$, and $\\Delta E_C = \\tfrac35[21\\cdot20 - 20\\cdot19]\\times1.44/R = \\tfrac65\\times20\\times1.44/R$. $R = 34.56/7.304 = 4.73$ fm (so $R_0 = 4.73/41^{1/3} = 1.37$ fm).',
      trap: 'Forgetting either the two electron masses or the neutron-hydrogen mass difference; each shifts $R$ by 10 to 15%.' },
    { id: 'npr-022', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'quadrupole moment',
      q: 'Which of these nuclei can have a non-zero spectroscopic electric quadrupole moment in their ground state?',
      options: ['${}^2$H ($I = 1$)', '${}^3$He ($I = \\tfrac12$)', '${}^7$Li ($I = \\tfrac32$)', '${}^{16}$O ($I = 0$)'], answer: [0, 2],
      sol: 'A measurable quadrupole moment needs $I \\ge 1$. The deuteron ($Q = +0.286$ fm$^2$) and ${}^7$Li ($Q = -4.0$ fm$^2$) qualify. ${}^3$He and ${}^{16}$O cannot show one whatever their intrinsic shape.',
      trap: 'Ruling out ${}^7$Li because its spin is half-integer: the rule is $I \\ge 1$, and $\\tfrac32 \\ge 1$.' },
    { id: 'npr-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'quadrupole moment', unit: 'b',
      q: 'A deformed nucleus has intrinsic quadrupole moment $Q_0 = 6.0$ b and ground-state spin $I = K = 7/2$. Its spectroscopic quadrupole moment $Q = Q_0\\dfrac{I(2I - 1)}{(I + 1)(2I + 3)}$ is ______ b (to two decimal places).',
      answer: 2.80, tol: 0.02, calc: () => 6 * 3.5 * 6 / (4.5 * 10),
      sol: '$\\dfrac{I(2I - 1)}{(I + 1)(2I + 3)} = \\dfrac{3.5\\times6}{4.5\\times10} = \\dfrac{21}{45} = 0.4667$. $Q = 0.4667\\times6.0 = 2.80$ b. The lab sees less than the intrinsic moment because the spin precesses and averages the shape.',
      trap: 'Taking $Q = Q_0$: the projection factor is always less than 1 and vanishes for $I = \\tfrac12$.' },
    { id: 'npr-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'quadrupole moment',
      q: 'Rare-earth nuclei such as ${}^{166}$Er have large positive intrinsic quadrupole moments. Their charge distribution is',
      options: ['spherical', 'prolate, elongated along the symmetry axis like a rugby ball', 'oblate, flattened like a disc', 'hollow at the centre'], answer: 1,
      sol: '$Q_0 = \\int\\rho(3z^2 - r^2)\\,d^3r$ is positive when charge is concentrated along the symmetry axis ($z^2$ large), that is a prolate shape. Oblate shapes give $Q_0 < 0$. Most deformed nuclei between closed shells (rare earths, actinides) are prolate.',
      trap: 'Getting the sign convention backwards; remember $3z^2 - r^2 > 0$ along the axis.' },
    { id: 'npr-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Fermi gas', unit: 'MeV',
      q: 'Treat nuclear matter with $N = Z$ and density $0.16$ nucleons fm$^{-3}$ as two Fermi gases (protons, neutrons), each with spin degeneracy 2. With $\\hbar c = 197.3$ MeV fm and nucleon mass $939$ MeV$/c^2$, the Fermi energy is ______ MeV (to one decimal place).',
      answer: 36.8, tol: 0.3, calc: () => { const kF = Math.cbrt(3 * Math.PI ** 2 * 0.08); return (197.327 * kF) ** 2 / (2 * 939); },
      sol: 'Each species has density $0.08$ fm$^{-3}$ and fills a sphere in $k$-space: $n = k_F^3/(3\\pi^2)$ (spin 2). $k_F = (3\\pi^2\\times0.08)^{1/3} = (2.369)^{1/3} = 1.333$ fm$^{-1}$. $E_F = \\dfrac{(\\hbar ck_F)^2}{2mc^2} = \\dfrac{(263.0)^2}{1878} = 36.8$ MeV.',
      trap: 'Putting all $0.16$ fm$^{-3}$ into one gas raises $k_F$ by $2^{1/3}$ and $E_F$ to about 58 MeV.' },
    { id: 'npr-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'muonic atoms',
      q: 'A negative muon ($m_\\mu = 207\\,m_e$) is captured by lead ($Z = 82$). Ignoring the finite nuclear size, the Bohr radius of its 1s orbit would be about',
      options: ['$0.5$ Å', '$250$ fm', '$0.03$ fm', '$3$ fm, smaller than the lead nucleus itself'], answer: 3,
      sol: '$r_1 = \\dfrac{a_0}{Z}\\dfrac{m_e}{m_\\mu} = \\dfrac{52\\,918\\ \\text{fm}}{82\\times207} = 3.1$ fm (reduced-mass correction negligible). The lead nucleus has $R \\approx 7$ fm, so the muon spends much of its time inside the charge, and its X-ray energies are very sensitive to the charge radius: a classic way to measure nuclear sizes.',
      trap: 'Forgetting either the factor $1/Z$ or the factor $m_e/m_\\mu$.' },
    { id: 'npr-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'electron scattering', unit: 'MeV',
      q: 'To resolve details of a charge distribution you need the reduced de Broglie wavelength $\\hbar/p$ of the probe to be at most $0.50$ fm. The minimum total energy of an electron for this is ______ MeV (to the nearest MeV). Use $\\hbar c = 197.3$ MeV fm.',
      answer: 395, tol: 1, calc: () => Math.hypot(197.327 / 0.5, 0.511),
      sol: '$pc = \\hbar c/(0.50\\text{ fm}) = 394.7$ MeV. $E = \\sqrt{(pc)^2 + (m_ec^2)^2} = \\sqrt{394.7^2 + 0.511^2} \\approx 394.7$ MeV: the electron is ultrarelativistic and $E \\approx pc$.',
      trap: 'Using the non-relativistic $p^2/2m$ gives an absurd $1.5\\times10^5$ MeV.' },
    { id: 'npr-028', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'spin and parity',
      q: 'Which statements about nuclear ground-state spins are correct?',
      options: ['Odd-$A$ nuclei have half-integer spin', 'Odd-odd nuclei have integer spin, which is always zero', 'Even-even nuclei have $J^\\pi = 0^+$', '${}^{14}$N (odd-odd) has spin 1'], answer: [0, 2, 3],
      sol: 'An odd number of spin-$\\tfrac12$ nucleons gives half-integer $J$. Odd-odd nuclei have integer $J$ but usually non-zero, because the odd proton and odd neutron couple their $j$ values (${}^2$H: 1, ${}^{14}$N: 1, ${}^{40}$K: 4, ${}^{50}$V: 6). Even-even nuclei are $0^+$.',
      trap: 'Pairing makes like nucleons couple to zero; an odd proton and an odd neutron are not alike.' },
    { id: 'npr-029', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'form factor', unit: 'fm',
      q: 'Elastic electron scattering at small momentum transfer gives $F(q) = 0.950$ at $q = 0.200$ fm$^{-1}$. Using $F \\approx 1 - q^2\\langle r^2\\rangle/6$, the rms charge radius is ______ fm (to two decimal places).',
      answer: 2.74, tol: 0.02, calc: () => Math.sqrt(6 * 0.05 / 0.04),
      sol: '$\\langle r^2\\rangle = \\dfrac{6(1 - F)}{q^2} = \\dfrac{6\\times0.050}{0.0400} = 7.50$ fm$^2$, so $r_{rms} = 2.74$ fm (about right for an $A \\approx 25$ nucleus).',
      trap: 'Forgetting the square root, or using $|F|^2$ (what the cross-section measures) as $F$.' },

    // ---------- level 4 ----------
    { id: 'npr-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Coulomb energy', unit: 'MeV',
      q: 'Model ${}^{208}$Pb ($Z = 82$) as a uniformly charged sphere with $R = 1.2A^{1/3}$ fm and Coulomb energy $\\tfrac35Z(Z - 1)e^2/(4\\pi\\varepsilon_0R)$. With $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm the Coulomb energy is ______ MeV (to the nearest 5 MeV).',
      answer: 807, tol: 5, calc: () => 0.6 * 82 * 81 * 1.44 / (1.2 * Math.cbrt(208)),
      sol: '$R = 1.2\\times208^{1/3} = 1.2\\times5.925 = 7.11$ fm. $E_C = 0.6\\times82\\times81\\times1.44/7.11 = 5739/7.11 = 807$ MeV, about half of the total binding energy (1636 MeV) that it has to fight.',
      trap: 'The self-energy of a uniform sphere has the factor $\\tfrac35$; using $Z^2$ instead of $Z(Z - 1)$ adds about 1%.' },
    { id: 'npr-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'form factor',
      q: 'A normalised charge distribution $\\rho(r) = e^{-r/a}/(8\\pi a^3)$ has form factor',
      options: ['$F(q) = e^{-q^2a^2/6}$', '$F(q) = 3(\\sin qa - qa\\cos qa)/(qa)^3$', '$F(q) = (1 + q^2a^2)^{-2}$', '$F(q) = (1 + q^2a^2)^{-1}$'], answer: 2,
      sol: 'For a spherical density $F(q) = \\dfrac{4\\pi}{q}\\int_0^\\infty r\\rho(r)\\sin(qr)\\,dr$. Using $\\int_0^\\infty re^{-br}\\sin(qr)\\,dr = \\dfrac{2bq}{(b^2 + q^2)^2}$ with $b = 1/a$: $F = \\dfrac{4\\pi}{q}\\cdot\\dfrac{1}{8\\pi a^3}\\cdot\\dfrac{2qa^3}{(1 + q^2a^2)^2} = (1 + q^2a^2)^{-2}$, the "dipole" form that fits the proton. Expanding gives $\\langle r^2\\rangle = 12a^2$.',
      trap: 'The Gaussian form belongs to a Gaussian density and the spherical Bessel form to a uniform sphere.' },
    { id: 'npr-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'form factor',
      q: 'The proton charge distribution is fitted by $\\rho \\propto e^{-r/a}$ with rms radius $0.84$ fm, so $F(q) = (1 + q^2a^2)^{-2}$ and $\\langle r^2\\rangle = 12a^2$. The form factor at $q = 2.0$ fm$^{-1}$ is ______ (to three decimal places).',
      answer: 0.655, tol: 0.004, calc: () => { const a2 = 0.84 ** 2 / 12; return 1 / (1 + 4 * a2) ** 2; },
      sol: '$a^2 = 0.84^2/12 = 0.0588$ fm$^2$. $q^2a^2 = 4.0\\times0.0588 = 0.2352$, so $F = 1/1.2352^2 = 0.655$. The cross-section is reduced by $F^2 = 0.43$ compared with a point proton.',
      trap: 'Using $a = 0.84$ fm directly instead of $a = r_{rms}/\\sqrt{12}$.' },
    { id: 'npr-033', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'magnetic moments',
      q: 'Which statements about nuclear magnetic dipole moments are correct?',
      options: ['Every even-even nucleus has zero magnetic moment in its ground state', 'In odd-$A$ nuclei the moment comes mostly from the single unpaired nucleon', 'A nucleus with $I = 0$ can still have a magnetic moment from orbital motion of its protons', 'The measured moments of odd-$A$ nuclei mostly lie between the two Schmidt lines'], answer: [0, 1, 3],
      sol: 'A dipole moment needs $I \\ge \\tfrac12$ (rank-1 tensor), so $0^+$ ground states have none, whatever the internal currents. The paired core contributes nothing, so the odd nucleon dominates. The single-particle (Schmidt) values bracket the data; real moments are pulled in by core polarisation and meson currents.',
      trap: 'Orbital currents exist inside a $0^+$ nucleus, but they cancel in total: no direction is singled out.' },
    { id: 'npr-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'quadrupole moment', unit: 'b',
      q: 'A deformed nucleus with $Z = 68$ is modelled as a uniformly charged spheroid with semi-axis $c = 7.8$ fm along the symmetry axis and $a = 6.6$ fm perpendicular to it. Its intrinsic quadrupole moment $Q_0 = \\tfrac25Z(c^2 - a^2)$ is ______ b (to two decimal places; $1$ b $= 100$ fm$^2$).',
      answer: 4.70, tol: 0.02, calc: () => 0.4 * 68 * (7.8 ** 2 - 6.6 ** 2) / 100,
      sol: '$c^2 - a^2 = 60.84 - 43.56 = 17.28$ fm$^2$. $Q_0 = 0.4\\times68\\times17.28 = 470.0$ fm$^2 = 4.70$ b, positive (prolate).',
      trap: 'Forgetting to convert fm$^2$ to barn, or squaring the difference $c - a$.' },
    { id: 'npr-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'isospin',
      q: 'The ground state of ${}^{14}$N has isospin $T = 0$. Its lowest $T = 1$ level (at $2.31$ MeV) is the isobaric analogue of',
      options: ['the first excited state of ${}^{14}$N', 'the ground states of ${}^{14}$C and ${}^{14}$O', 'the ground state of ${}^{13}$C', 'the ground state of ${}^{15}$N'], answer: 1,
      sol: 'A $T = 1$ triplet has $T_3 = -1, 0, +1$: one member in each of ${}^{14}$C ($Z = 6$), ${}^{14}$N ($Z = 7$) and ${}^{14}$O ($Z = 8$). ${}^{14}$C and ${}^{14}$O have $|Z - N| = 2$, so they cannot have $T = 0$; their ground states are $T = 1$, and the analogue in ${}^{14}$N is the $0^+$ level at $2.31$ MeV, with the same nuclear structure apart from Coulomb shifts.',
      trap: 'Analogue states share $A$; the other nuclides offered have a different mass number.' },
    { id: 'npr-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'density',
      q: 'If the saturation density of nuclear matter is $0.17$ nucleons fm$^{-3}$ and nuclei are uniform spheres $R = R_0A^{1/3}$, then $R_0$ is about',
      options: ['$1.40$ fm', '$0.89$ fm', '$1.12$ fm', '$1.25$ fm'], answer: 2,
      sol: '$\\rho_0 = 3/(4\\pi R_0^3)$ gives $R_0 = \\left(\\dfrac{3}{4\\pi\\times0.17}\\right)^{1/3} = (1.404)^{1/3} = 1.12$ fm. This matches the half-density radius $c \\approx 1.07$ to $1.12A^{1/3}$ fm from electron scattering; the larger $1.2$ to $1.25$ fm values come from the equivalent uniform radius, which counts the diffuse surface.',
      trap: 'Inverting $\\rho_0$ without the factor $3/4\\pi$ gives $0.89$ fm.' },
    { id: 'npr-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'neutron skin',
      q: 'Parity-violating electron scattering and other probes show that in ${}^{208}$Pb',
      options: ['protons extend about $0.3$ fm beyond the neutrons', 'the neutron and proton distributions have identical radii', 'neutrons are concentrated in the centre and protons on the surface', 'the neutron distribution extends a little (a few tenths of a fm) beyond the proton distribution: a neutron skin'], answer: 3,
      sol: 'With $N - Z = 44$ excess neutrons, the asymmetry energy is lowered by pushing some excess neutrons to the surface, while Coulomb repulsion pushes protons outward only weakly. Measurements give $r_n - r_p \\approx 0.2$ to $0.3$ fm. The skin is tied to the density dependence of the symmetry energy, which also sets neutron-star radii.',
      trap: 'Electron scattering alone sees only protons; the matter radius needs another probe.' },

    // ---------- level 5 ----------
    { id: 'npr-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'form factor', unit: 'fm',
      q: 'Electrons of $250$ MeV scattered elastically from ${}^{58}$Ni show the first diffraction minimum at $44.0^\\circ$. Model the charge as a uniform sphere, whose form factor first vanishes at $qR = 4.493$, and neglect recoil. The radius $R$ is ______ fm (to two decimal places). Use $\\hbar c = 197.33$ MeV fm.',
      answer: 4.73, tol: 0.03, calc: () => 4.493 / (2 * 250 / 197.327 * Math.sin(22 * Math.PI / 180)),
      sol: '$q = \\dfrac{2E}{\\hbar c}\\sin\\dfrac\\theta2 = \\dfrac{500}{197.33}\\sin22^\\circ = 2.534\\times0.3746 = 0.9492$ fm$^{-1}$. $R = 4.493/0.9492 = 4.73$ fm, giving $R_0 = 4.73/58^{1/3} = 1.22$ fm and $r_{rms} = \\sqrt{3/5}R = 3.67$ fm.',
      trap: 'Using $\\sin44^\\circ$ instead of $\\sin22^\\circ$.' },
    { id: 'npr-039', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'Fermi gas',
      q: 'In the Fermi gas model of a nucleus with $N = Z$ at $\\rho_0 = 0.16$ fm$^{-3}$, which statements are correct?',
      options: ['The Fermi energy is about $37$ MeV', 'The mean kinetic energy per nucleon is $\\tfrac35E_F \\approx 22$ MeV', 'Adding the separation energy of about 8 MeV, the potential well is about 45 MeV deep', 'The model gives the asymmetry energy entirely from the Coulomb repulsion'], answer: [0, 1, 2],
      sol: '$k_F = 1.33$ fm$^{-1}$ gives $E_F = 36.8$ MeV; the mean of $E$ over a filled Fermi sphere is $\\tfrac35E_F = 22$ MeV. The last nucleon sits at $E_F$ and is bound by about 8 MeV, so the well is $V_0 \\approx 37 + 8 = 45$ MeV deep. The Fermi gas gives a kinetic asymmetry energy: making $N \\ne Z$ forces one gas to fill higher states, $\\approx \\tfrac13E_F(N - Z)^2/A$, about half of the empirical asymmetry coefficient. Coulomb has nothing to do with it.',
      trap: 'The asymmetry term exists even for neutral "nucleons": it is a Pauli effect.' },
    { id: 'npr-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'deuteron', unit: '%',
      q: 'For the deuteron, a pure ${}^3S_1$ state would have $\\mu_S = \\mu_p + \\mu_n = 0.8798\\,\\mu_N$ and a pure ${}^3D_1$ state $\\mu_D = \\tfrac34 - \\tfrac12(\\mu_p + \\mu_n)$ in units of $\\mu_N$. The measured moment is $0.8574\\,\\mu_N$. Ignoring meson-exchange currents, the $D$-state probability is ______ % (to one decimal place).',
      answer: 3.9, tol: 0.1, calc: () => { const muS = 0.8798, muD = 0.75 - 0.5 * muS; return 100 * (muS - 0.8574) / (muS - muD); },
      sol: '$\\mu_D = 0.75 - 0.4399 = 0.3101\\,\\mu_N$. With probabilities $1 - P_D$ and $P_D$ (no interference term for a diagonal moment between different $L$): $0.8574 = 0.8798 - P_D(0.8798 - 0.3101)$, so $P_D = 0.0224/0.5697 = 0.039 = 3.9\\%$. The quadrupole moment points to a similar 4 to 7%.',
      trap: 'Taking the measured moment as $\\mu_p + \\mu_n$ hides the D state completely.' },
    { id: 'npr-041', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'electron scattering',
      q: 'Elastic electron scattering from a spherical nucleus: which statements are correct?',
      options: ['The cross-section is the point-charge (Mott) cross-section times $|F(q)|^2$', 'A sharper nuclear edge gives deeper, more distinct diffraction minima', 'The form factor depends on the electron energy and angle only through the momentum transfer $q$', 'Measuring at a single small $q$ fixes the whole charge distribution'], answer: [0, 1, 2],
      sol: 'In the first Born approximation the amplitude is the point amplitude times the Fourier transform of the charge density, $F(q)$, a function of $q$ alone. A sharp-edged sphere gives true zeros; a diffuse edge fills them in, which is how the skin thickness is measured. One small-$q$ point gives only $\\langle r^2\\rangle$; the shape needs a wide range of $q$.',
      trap: 'The small-$q$ slope gives the rms radius, nothing more.' },
    { id: 'npr-042', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'nomenclature',
      q: 'Which pairs are isobars?',
      options: ['${}^{40}$Ar and ${}^{40}$Ca', '${}^{14}$C and ${}^{14}$N', '${}^{3}$H and ${}^{3}$He', '${}^{12}$C and ${}^{13}$C'], answer: [0, 1, 2],
      sol: 'Isobars share the mass number $A$: 40, 14 and 3 in the first three pairs. ${}^{12}$C and ${}^{13}$C share $Z$, so they are isotopes. ${}^3$H and ${}^3$He are also a mirror pair.',
      trap: 'Isobars differ in $Z$; same-element pairs are isotopes.' },
  ],
  gens: [
    { id: 'npr-g01', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'rms radius',
      make(r) {
        const A = int(r, 8, 240), R0 = choose(r, [1.1, 1.2, 1.25]), R = R0 * Math.cbrt(A), rms = Math.sqrt(0.6) * R;
        return { q: `Model a nucleus of mass number $${A}$ as a uniform sphere with $R = ${R0}A^{1/3}$ fm. Its rms charge radius is ______ fm (to two decimal places).`,
          answer: round(rms, 2), tol: 0.02, unit: 'fm', A, R0,
          sol: `$R = ${R0}\\times${A}^{1/3} = ${round(R, 3)}$ fm. For a uniform sphere $\\langle r^2\\rangle = \\tfrac35R^2$, so $r_{rms} = 0.7746\\times${round(R, 3)} = ${round(rms, 2)}$ fm.`,
          trap: 'Giving the edge radius $R$ instead of $\\sqrt{3/5}R$.' };
      },
      verify: (p) => Math.sqrt(0.6) * p.R0 * Math.cbrt(p.A) },
    { id: 'npr-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'form factor',
      make(r) {
        const A = choose(r, [27, 40, 58, 90, 120, 165, 208]), E = pick(r, 150, 600, 50), R = 1.2 * Math.cbrt(A);
        const s = 4.493 * HBARC / (2 * E * R), th = 2 * Math.asin(s) * 180 / Math.PI;
        return { q: `Electrons of $${E}$ MeV scatter elastically from a nucleus with $A = ${A}$, modelled as a uniform sphere of radius $1.2A^{1/3}$ fm (first form-factor zero at $qR = 4.493$). Neglecting recoil, the first diffraction minimum is at ______ degrees (to one decimal place). Use $\\hbar c = 197.3$ MeV fm.`,
          answer: round(th, 1), tol: Math.max(0.15, round(th * 0.008, 2)), unit: 'degrees', A, E,
          sol: `$R = 1.2\\times${A}^{1/3} = ${round(R, 3)}$ fm, so the zero is at $q = 4.493/R = ${round(4.493 / R, 4)}$ fm$^{-1}$. With $\\hbar q = 2p\\sin(\\theta/2)$ and $pc = E$: $\\sin(\\theta/2) = q\\hbar c/2E = ${round(s, 4)}$, $\\theta = ${round(th, 1)}^\\circ$.`,
          trap: 'Using $q = p\\sin\\theta/\\hbar$ instead of $2p\\sin(\\theta/2)/\\hbar$.' };
      },
      verify: (p) => 2 * Math.asin(4.493 * HBARC / (2 * p.E * 1.2 * Math.cbrt(p.A))) * 180 / Math.PI },
    { id: 'npr-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'mirror nuclei',
      make(r) {
        const Z = int(r, 5, 20), A = 2 * Z + 1, R0 = choose(r, [1.2, 1.25, 1.3, 1.35, 1.4]), R = R0 * Math.cbrt(A);
        const dEC = 1.2 * Z * E2 / R, Emax = dEC - 0.782 - 1.022;
        return { q: `The mirror nuclei with $A = ${A}$ have $Z = ${Z}$ and $Z = ${Z + 1}$. Treat both as uniform spheres of radius $${R0}A^{1/3}$ fm and the nuclear force as charge symmetric. The endpoint kinetic energy of the positrons in the $\\beta^+$ decay of the $Z = ${Z + 1}$ member is ______ MeV (to two decimal places). Use $e^2/4\\pi\\varepsilon_0 = 1.440$ MeV fm, $(m_n - m_H)c^2 = 0.782$ MeV, $m_ec^2 = 0.511$ MeV.`,
          answer: round(Emax, 2), tol: 0.03, unit: 'MeV', Z, R0,
          sol: `$R = ${round(R, 3)}$ fm. Coulomb energy difference $\\Delta E_C = \\tfrac35[(Z + 1)Z - Z(Z - 1)]\\dfrac{e^2}{4\\pi\\varepsilon_0R} = \\tfrac65\\times${Z}\\times1.440/${round(R, 3)} = ${round(dEC, 3)}$ MeV. Atomic mass difference: $\\Delta Mc^2 = \\Delta E_C - 0.782 = ${round(dEC - 0.782, 3)}$ MeV. Positron endpoint $= \\Delta Mc^2 - 2m_ec^2 = ${round(Emax, 2)}$ MeV.`,
          trap: 'Forgetting the two electron masses for $\\beta^+$ with atomic masses, or the $n$-H mass difference.' };
      },
      verify: (p) => 1.2 * p.Z * E2 / (p.R0 * Math.cbrt(2 * p.Z + 1)) - 1.804 },
    { id: 'npr-g04', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'spin and parity',
      make(r) {
        const Z = int(r, 3, 36), N = Z + int(r, 0, 6), A = Z + N;
        const kind = Z % 2 === 0 && N % 2 === 0 ? 0 : A % 2 === 1 ? 1 : 2;
        const opts = ['exactly $0^+$', 'a half-integer', 'an integer, usually not zero', 'impossible to restrict without a measurement'];
        return { q: `The nuclide $${nuc(Z, A)}$ ($Z = ${Z}$, $N = ${N}$) has a ground-state spin that is`, options: opts, answer: kind,
          sol: kind === 0 ? `Even $Z$ and even $N$: every nucleon is paired to zero angular momentum, so the ground state is $0^+$.` : kind === 1 ? `$A = ${A}$ is odd: an odd number of spin-$\\tfrac12$ nucleons gives half-integer total angular momentum.` : `$Z$ and $N$ are both odd ($A = ${A}$ even): the odd proton and odd neutron couple their $j$ values to an integer, usually non-zero (deuteron 1, ${'{}'}^{14}$N 1, ${'{}'}^{40}$K 4).`,
          trap: 'Odd-odd nuclei are not $0^+$: pairing works only between like nucleons.', Z, N };
      } },
    { id: 'npr-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'NMR',
      make(r) {
        const nucs = [['${}^1$H', 0.5, 2.7928], ['${}^{13}$C', 0.5, 0.7024], ['${}^{19}$F', 0.5, 2.6289], ['${}^{31}$P', 0.5, 1.1316], ['${}^{2}$H', 1, 0.8574], ['${}^{7}$Li', 1.5, 3.2564], ['${}^{23}$Na', 1.5, 2.2175], ['${}^{27}$Al', 2.5, 3.6415]];
        const [n, I, mu] = choose(r, nucs), B = pick(r, 0.5, 11.7, 0.1), f = mu / I * MUN_H * B;
        return { q: `The nucleus ${n} has spin $I = ${half(I)}$ and magnetic moment $\\mu = ${mu}\\,\\mu_N$. In a field of $${B}$ T its NMR frequency (for $\\Delta m = 1$) is ______ MHz (to one decimal place). Use $\\mu_N/h = 7.6226$ MHz/T.`,
          answer: round(f, 1), tol: Math.max(0.1, round(f * 0.003, 2)), unit: 'MHz', I, mu, B,
          sol: `The levels are $E_m = -g\\mu_NBm$ with $g = \\mu/(I\\mu_N) = ${mu}/${half(I)} = ${round(mu / I, 4)}$. Adjacent levels differ by $g\\mu_NB$, so $f = ${round(mu / I, 4)}\\times7.6226\\times${B} = ${round(f, 1)}$ MHz.`,
          trap: 'Using $\\mu$ instead of $g = \\mu/I$; for spin $\\tfrac12$ that halves the frequency.' };
      },
      verify: (p) => p.mu / p.I * MUN_H * p.B },
    { id: 'npr-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'quadrupole moment',
      make(r) {
        const I = choose(r, [1, 1.5, 2, 2.5, 3, 3.5, 4.5]), Q0 = pick(r, 1.0, 8.0, 0.5), f = I * (2 * I - 1) / ((I + 1) * (2 * I + 3)), Q = Q0 * f;
        return { q: `A deformed nucleus has intrinsic quadrupole moment $Q_0 = ${Q0}$ b and a ground state with $I = K = ${half(I)}$. Its spectroscopic quadrupole moment $Q = Q_0\\dfrac{3K^2 - I(I + 1)}{(I + 1)(2I + 3)}$ is ______ b (to two decimal places).`,
          answer: round(Q, 2), tol: 0.02, unit: 'b', I, Q0,
          sol: `With $K = I$: $3I^2 - I(I + 1) = I(2I - 1)$, so the factor is $\\dfrac{I(2I - 1)}{(I + 1)(2I + 3)} = \\dfrac{${round(I * (2 * I - 1), 3)}}{${round((I + 1) * (2 * I + 3), 3)}} = ${round(f, 4)}$. $Q = ${round(f, 4)}\\times${Q0} = ${round(Q, 2)}$ b.`,
          trap: 'Setting $Q = Q_0$; the lab moment is always smaller.' };
      },
      verify: (p) => p.Q0 * (3 * p.I * p.I - p.I * (p.I + 1)) / ((p.I + 1) * (2 * p.I + 3)) },
    { id: 'npr-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Fermi gas',
      make(r) {
        const rho = pick(r, 0.12, 0.20, 0.01), sym = choose(r, ['symmetric', 'neutron']);
        const n = sym === 'symmetric' ? rho / 2 : rho, kF = Math.cbrt(3 * Math.PI ** 2 * n), EF = (HBARC * kF) ** 2 / (2 * 939);
        return { q: sym === 'symmetric' ? `Nuclear matter with $N = Z$ has total density $${rho}$ fm$^{-3}$. Treating protons and neutrons as separate Fermi gases (spin degeneracy 2), the Fermi energy is ______ MeV (to one decimal place). Use $\\hbar c = 197.33$ MeV fm, $mc^2 = 939$ MeV.` : `Pure neutron matter (as in a neutron star) has density $${rho}$ fm$^{-3}$. Treated as a non-relativistic Fermi gas with spin degeneracy 2, its Fermi energy is ______ MeV (to one decimal place). Use $\\hbar c = 197.33$ MeV fm, $mc^2 = 939$ MeV.`,
          answer: round(EF, 1), tol: Math.max(0.2, round(EF * 0.006, 2)), unit: 'MeV', rho, sym,
          sol: `Density of one species $n = ${round(n, 3)}$ fm$^{-3}$; $n = k_F^3/3\\pi^2$ gives $k_F = ${round(kF, 4)}$ fm$^{-1}$. $E_F = (\\hbar ck_F)^2/2mc^2 = ${round(HBARC * kF, 2)}^2/1878 = ${round(EF, 1)}$ MeV.`,
          trap: sym === 'symmetric' ? 'Putting all nucleons in one gas.' : 'Halving the density as if half were protons.' };
      },
      verify: (p) => (HBARC * Math.cbrt(3 * Math.PI ** 2 * (p.sym === 'symmetric' ? p.rho / 2 : p.rho))) ** 2 / 1878 },
    { id: 'npr-g08', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'nomenclature',
      make(r) {
        const Z = int(r, 6, 30), N = Z + int(r, 2, 5), A = Z + N, ask = choose(r, ['isobars', 'isotones', 'isotopes']);
        const cand = [[Z, N + 1, 'isotope'], [Z + 1, N, 'isotone'], [Z + 1, N - 1, 'isobar'], [N, Z, 'mirror'], [Z - 1, N + 2, 'none'], [Z + 2, N - 1, 'none2']];
        const good = (k) => (ask === 'isobars' ? k === 'isobar' || k === 'mirror' : ask === 'isotones' ? k === 'isotone' : k === 'isotope');
        const opts = cand.slice(0, 4).concat([cand[4]]);
        const options = opts.map(([z, n]) => `$${nuc(z, z + n)}$`), answer = opts.map((o, i) => (good(o[2]) ? i : -1)).filter((i) => i >= 0);
        return { q: `Which of these are ${ask} of $${nuc(Z, A)}$ ($Z = ${Z}$, $N = ${N}$)?`, options, answer,
          sol: `${ask === 'isobars' ? 'Isobars share $A' : ask === 'isotones' ? 'Isotones share $N' : 'Isotopes share $Z'} = ${ask === 'isobars' ? A : ask === 'isotones' ? N : Z}$. The options have ${opts.map(([z, n]) => `$(Z, N, A) = (${z}, ${n}, ${z + n})$`).join(', ')}.${ask === 'isobars' ? ' The mirror nucleus (Z and N swapped) is an isobar too.' : ''}`,
          trap: 'Isotopes share Z, isobars A, isotones N.', Z, N };
      } },
    { id: 'npr-g09', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'electron scattering',
      make(r) {
        const d = pick(r, 0.2, 2.0, 0.1), part = choose(r, ['electron', 'proton']), m = part === 'electron' ? 0.511 : 938.272;
        const pc = HBARC / d, T = Math.hypot(pc, m) - m;
        return { q: `To resolve structure of size $${d}$ fm, the reduced de Broglie wavelength $\\hbar/p$ of a probe ${part} should equal $${d}$ fm. Its kinetic energy must be ______ MeV (to the nearest 0.1 MeV). Use $\\hbar c = 197.33$ MeV fm and $mc^2 = ${m}$ MeV.`,
          answer: round(T, 1), tol: Math.max(0.1, round(T * 0.003, 2)), unit: 'MeV', d, m,
          sol: `$pc = \\hbar c/${d} = ${round(pc, 2)}$ MeV. $T = \\sqrt{(pc)^2 + (mc^2)^2} - mc^2 = ${round(T, 1)}$ MeV.${part === 'proton' ? ' For the proton the relativistic formula still matters at these momenta.' : ' The electron is ultrarelativistic, so $T \\approx pc$.'}`,
          trap: 'Using $p^2/2m$ for an electron with $pc \\gg mc^2$.' };
      },
      verify: (p) => Math.hypot(HBARC / p.d, p.m) - p.m },
    { id: 'npr-g10', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Fermi distribution',
      make(r) {
        const a = pick(r, 0.45, 0.65, 0.01), x = choose(r, [-3, -2, -1, 1, 2, 3]), ask = choose(r, ['ratio', 'skin']);
        const val = ask === 'ratio' ? 1 / (1 + Math.exp(x)) : 4 * a * Math.log(3);
        return { q: ask === 'ratio' ? `A charge density follows $\\rho(r) = \\rho_0/[1 + e^{(r - c)/a}]$ with $a = ${a}$ fm. At $r = c ${x > 0 ? '+' : '-'} ${round(Math.abs(x) * a, 3)}$ fm the ratio $\\rho/\\rho_0$ is ______ (to three decimal places).` : `For $\\rho(r) = \\rho_0/[1 + e^{(r - c)/a}]$ with $a = ${a}$ fm and $c \\gg a$, the 90% to 10% surface thickness is ______ fm (to two decimal places).`,
          answer: round(val, ask === 'ratio' ? 3 : 2), tol: ask === 'ratio' ? 0.002 : 0.02, a, x, ask,
          sol: ask === 'ratio' ? `$(r - c)/a = ${x}$, so $\\rho/\\rho_0 = 1/(1 + e^{${x}}) = ${round(val, 3)}$.` : `$\\rho/\\rho_0 = f$ at $r = c + a\\ln(1/f - 1)$; from $f = 0.9$ to $0.1$ the distance is $2a\\ln9 = 4a\\ln3 = 4.394\\times${a} = ${round(val, 2)}$ fm.`,
          trap: ask === 'ratio' ? 'At $r = c$ the density is half, not zero.' : 'Taking $t = 2a$.' };
      },
      verify: (p) => (p.ask === 'ratio' ? 1 / (1 + Math.exp(p.x)) : 4 * p.a * Math.log(3)) },
    { id: 'npr-g11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'muonic atoms',
      make(r) {
        const Z = int(r, 6, 36), A = choose(r, [2 * Z, 2 * Z + 1, 2 * Z + 2, 2 * Z + 4]);
        const mred = MMU * A * UME / (MMU + A * UME), r1 = A0FM / (Z * mred), R = 1.2 * Math.cbrt(A);
        return { q: `A negative muon ($m_\\mu = 206.77\\,m_e$) falls into the 1s orbit of an atom with $Z = ${Z}$, $A = ${A}$ (nuclear mass $${A}$ u, $1$ u $= 1822.9\\,m_e$). Treating the nucleus as a point, the Bohr radius of the orbit is ______ fm (to two decimal places). Use $a_0 = 52\\,918$ fm.`,
          answer: round(r1, 2), tol: Math.max(0.02, round(r1 * 0.004, 3)), unit: 'fm', Z, A,
          sol: `Reduced mass $\\mu = \\dfrac{206.77\\times${round(A * UME, 1)}}{206.77 + ${round(A * UME, 1)}}m_e = ${round(mred, 3)}\\,m_e$. $r_1 = \\dfrac{a_0}{Z}\\dfrac{m_e}{\\mu} = \\dfrac{52\\,918}{${Z}\\times${round(mred, 3)}} = ${round(r1, 2)}$ fm. Compare $R \\approx 1.2A^{1/3} = ${round(R, 2)}$ fm: ${r1 < 2 * R ? 'the orbit overlaps the nucleus strongly, so finite size shifts its levels a lot' : 'the orbit is still outside the nucleus but close enough to feel its size'}.`,
          trap: 'Forgetting the factor $1/Z$ or the reduced mass.' };
      },
      verify: (p) => A0FM * (MMU + p.A * UME) / (p.Z * MMU * p.A * UME) },
    { id: 'npr-g12', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'hyperfine structure',
      make(r) {
        const J = choose(r, [1.5, 2.5, 3.5, 4.5]), I = choose(r, [0.5, 1, 1.5, 2, 2.5, 3, 3.5].filter((x) => x < J));
        const n = Math.round(2 * I + 1);
        const o = mcqOptions(r, half(I), [half(J), half((n - 1) / 2 + 0.5), half(n), half(I + 1), half(I / 2 + 0.25)].filter((v) => v !== half(I)), (v) => `$I = ${v}$`);
        return { q: `An atomic level with $J = ${half(J)}$ splits into ${n} hyperfine levels. The nuclear spin is`, ...o,
          sol: `$F$ runs from $|I - J|$ to $I + J$, giving $2\\min(I, J) + 1$ levels. If $I \\ge J$ there would be $2J + 1 = ${2 * J + 1}$. Since only ${n} appear, $I < J$ and $2I + 1 = ${n}$: $I = ${half(I)}$.`,
          trap: 'Using $2J + 1$, or assuming the count always gives I.', I, J };
      } },
    ...more,
  ],
};
