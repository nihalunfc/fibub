// Nuclei, binding energy and radioactivity: nuclear size and density, mass defect and binding energy, the binding
// energy per nucleon curve, the semi-empirical mass formula and the valley of stability, alpha, beta and gamma
// decay and their Q values, the decay law, half-life, mean life and activity, successive decays and equilibrium,
// branching, dating. Original questions for IIT JAM, GATE and CSIR NET practice (fibub).
// Atomic masses are standard tabulated values (AME), rounded to 6 decimal places. Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round } from '../_util.js';

const U = 931.494; // MeV per u
const MH = 1.007825, MN = 1.008665; // hydrogen-1 atom and neutron, u
const YEAR = 3.156e7; // s
const NA = 6.02214076e23;

// nuclides for templates: [TeX symbol, Z, A, atomic mass in u]
const NUC = [
  ['{}^{2}\\mathrm{H}', 1, 2, 2.014102], ['{}^{4}\\mathrm{He}', 2, 4, 4.002603], ['{}^{7}\\mathrm{Li}', 3, 7, 7.016003],
  ['{}^{12}\\mathrm{C}', 6, 12, 12.000000], ['{}^{16}\\mathrm{O}', 8, 16, 15.994915], ['{}^{40}\\mathrm{Ca}', 20, 40, 39.962591],
  ['{}^{56}\\mathrm{Fe}', 26, 56, 55.934936], ['{}^{62}\\mathrm{Ni}', 28, 62, 61.928345], ['{}^{208}\\mathrm{Pb}', 82, 208, 207.976652],
  ['{}^{238}\\mathrm{U}', 92, 238, 238.050788],
];
const bePerA = (Z, A, M) => (Z * MH + (A - Z) * MN - M) * U / A;

import * as Q5 from '../_util.js';

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
  topic: 'nuclei-radioactivity',
  items: [
    // ---------- level 1 ----------
    { id: 'nbr-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'nuclear size',
      q: 'The radius of a nucleus of mass number $216$ is how many times the radius of a nucleus of mass number $27$?',
      options: ['$8$', '$2$', '$4$', '$\\sqrt8$'], answer: 1,
      sol: 'Nuclear radius grows as $R = R_0A^{1/3}$, so $R_1/R_2 = (216/27)^{1/3} = 8^{1/3} = 2$. The volume, not the radius, is 8 times larger: each nucleon takes up about the same space.',
      trap: '$8$ is the ratio of volumes (and masses), not radii.' },
    { id: 'nbr-002', type: 'nat', level: 1, exams: ['jam'], sub: 'decay law',
      q: 'A radioactive sample has a half-life of $10$ days. The fraction of the original nuclei left undecayed after $30$ days is ______ (to three decimal places).',
      answer: 0.125, tol: 0.001, calc: () => 2 ** (-30 / 10),
      sol: '$30$ days is three half-lives: $N/N_0 = (1/2)^3 = 1/8 = 0.125$.',
      trap: 'Subtracting a third each time ($1 - 3\\times\\tfrac13 = 0$) treats decay as linear; it is exponential.' },
    { id: 'nbr-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'beta decay',
      q: 'In $\\beta^-$ decay of a nucleus, the atomic number $Z$ and the mass number $A$ change as',
      options: ['$Z$ rises by 1, $A$ unchanged', '$Z$ falls by 1, $A$ unchanged', '$Z$ falls by 2, $A$ falls by 4', '$Z$ unchanged, $A$ falls by 1'], answer: 0,
      sol: 'Inside the nucleus a neutron turns into a proton: $n \\to p + e^- + \\bar\\nu_e$. The electron and antineutrino leave. One more proton means $Z + 1$; the number of nucleons is unchanged, so $A$ stays the same.',
      trap: '$Z$ falls by 1 in $\\beta^+$ decay and electron capture, the mirror processes.' },
    { id: 'nbr-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'conservation laws', format: 'single',
      q: 'Which of the following is NOT conserved in radioactive decays?',
      options: ['Electric charge', 'The total number of nucleons $A$', 'Total energy (including rest energy)', 'The number of neutrons'], answer: 3,
      sol: 'Charge, nucleon number and total energy (with momentum and angular momentum) are conserved in every decay. Neutrons are not: in $\\beta^-$ decay a neutron becomes a proton, and in $\\beta^+$ decay a proton becomes a neutron. Only their sum, $A$, is fixed.',
      trap: 'Nucleon number is conserved, but neutrons and protons can turn into each other.' },
    { id: 'nbr-005', type: 'mcq', level: 1, exams: ['jam'], sub: 'decay law',
      q: 'A nuclide has a half-life of $6.93$ s. Its mean life is about',
      options: ['$6.93$ s', '$4.80$ s', '$10.0$ s', '$0.1$ s'], answer: 2,
      sol: '$\\tau = 1/\\lambda$ and $T_{1/2} = \\ln2/\\lambda$, so $\\tau = T_{1/2}/\\ln2 = 6.93/0.693 = 10.0$ s. The mean life is always about 44% longer than the half-life.',
      trap: '$4.80$ s multiplies by $\\ln 2$ instead of dividing; $0.1$ s$^{-1}$ is $\\lambda$, not a time.' },
    { id: 'nbr-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'mass-energy',
      q: 'The energy equivalent of one atomic mass unit ($1$ u) is about',
      options: ['$0.511$ MeV', '$938.3$ MeV', '$931.5$ MeV', '$1.66\\times10^{-27}$ MeV'], answer: 2,
      sol: '$1\\text{ u} = 1.6605\\times10^{-27}$ kg; $E = mc^2 = 1.4924\\times10^{-10}$ J $= 931.5$ MeV. So multiplying a mass difference in u by $931.5$ gives energy in MeV.',
      trap: '$938.3$ MeV is the proton\'s rest energy and $0.511$ MeV the electron\'s; $1.66\\times10^{-27}$ is $1$ u in kg.' },

    // ---------- level 2 ----------
    { id: 'nbr-007', type: 'mcq', level: 2, exams: ['jam'], sub: 'nuclear size',
      q: 'Taking $R_0 = 1.2$ fm, the radius of a nucleus with $A = 125$ is',
      options: ['$1.2$ fm', '$150$ fm', '$5$ fm', '$6.0$ fm'], answer: 3,
      sol: '$R = R_0A^{1/3} = 1.2\\times125^{1/3} = 1.2\\times5 = 6.0$ fm.',
      trap: '$150$ fm multiplies by $A$; $5$ fm forgets $R_0$.' },
    { id: 'nbr-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'nuclear size',
      q: 'The density of nuclear matter is',
      options: ['about $10^{3}$ kg/m$^3$, like water', 'about $2\\times10^{17}$ kg/m$^3$, nearly the same for all nuclei', 'about $10^{30}$ kg/m$^3$, the same as the Sun', 'proportional to $A^{1/3}$, larger for heavy nuclei'], answer: 1,
      sol: 'Mass $\\approx Au$ and volume $\\tfrac43\\pi R_0^3A$, so $\\rho = \\dfrac{1.66\\times10^{-27}}{\\tfrac43\\pi(1.2\\times10^{-15})^3} = \\dfrac{1.66\\times10^{-27}}{7.24\\times10^{-45}} \\approx 2.3\\times10^{17}$ kg/m$^3$. $A$ cancels, so the density is the same for all nuclei: nuclear matter is nearly incompressible.',
      trap: '$10^{30}$ is the Sun\'s MASS in kg, not a density.' },
    { id: 'nbr-009', type: 'nat', level: 2, exams: ['jam'], sub: 'binding energy', unit: 'MeV',
      q: 'Atomic masses: ${}^4$He $4.002603$ u, ${}^1$H $1.007825$ u; neutron mass $1.008665$ u; $1$ u $= 931.5$ MeV/$c^2$. The binding energy of the ${}^4$He nucleus is ______ MeV (to one decimal place).',
      answer: 28.3, tol: 0.1, calc: () => (2 * 1.007825 + 2 * 1.008665 - 4.002603) * 931.5,
      sol: 'Mass defect: $\\Delta m = 2m_H + 2m_n - M(\\text{He}) = 2.015650 + 2.017330 - 4.002603 = 0.030377$ u. Using hydrogen ATOMS (not bare protons) keeps the electron masses balanced with the helium atom. $B = 0.030377\\times931.5 = 28.3$ MeV, about $7.1$ MeV per nucleon.',
      trap: 'Using the proton mass with the helium ATOMIC mass leaves two electron masses ($1.02$ MeV) in the wrong place.' },
    { id: 'nbr-010', type: 'nat', level: 2, exams: ['jam'], sub: 'activity', unit: 'Ci',
      q: 'A sample contains $10^{20}$ radioactive nuclei with decay constant $2\\times10^{-9}$ s$^{-1}$. Its activity is ______ Ci (to two decimal places; $1$ Ci $= 3.7\\times10^{10}$ Bq).',
      answer: 5.41, tol: 0.02, calc: () => 2e-9 * 1e20 / 3.7e10,
      sol: '$A = \\lambda N = 2\\times10^{-9}\\times10^{20} = 2\\times10^{11}$ Bq (decays per second). In curies: $2\\times10^{11}/3.7\\times10^{10} = 5.41$ Ci.',
      trap: 'Forgetting to convert from becquerel to curie.' },
    { id: 'nbr-011', type: 'msq', level: 2, exams: ['jam'], sub: 'gamma decay', format: 'statements',
      q: 'Which statements about gamma decay are correct?',
      options: ['$Z$ and $A$ both stay the same.', 'It happens when a nucleus drops from an excited state to a lower one.', 'Typical gamma-ray energies are from tens of keV to a few MeV.', 'Gamma rays are bent by a magnetic field.'], answer: [0, 1, 2],
      sol: 'A gamma ray is a photon emitted as a nucleus falls to a lower energy level, often just after an $\\alpha$ or $\\beta$ decay leaves the daughter excited. No nucleon changes identity, so $Z$ and $A$ stay the same. Nuclear levels are spaced by keV to MeV, so the photons carry those energies. Photons have no charge, so a magnetic field does not deflect them.',
      trap: 'Gamma rays carry energy and momentum, but no charge: magnetic fields cannot bend them.' },
    { id: 'nbr-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'decay chains',
      q: 'A nucleus emits one $\\alpha$ particle and then two $\\beta^-$ particles. The final nucleus is',
      options: ['an isotope of the original nucleus (same $Z$, $A$ four less)', 'an isobar of the original nucleus (same $A$)', 'the same nuclide as the original', 'a nucleus with $Z$ four less'], answer: 0,
      sol: 'The $\\alpha$ decay lowers $Z$ by 2 and $A$ by 4. Each $\\beta^-$ raises $Z$ by 1 and leaves $A$ alone. Net: $Z$ unchanged, $A - 4$. Same $Z$ means the same element: an isotope. For example ${}^{238}$U $\\to$ ${}^{234}$Th $\\to$ ${}^{234}$Pa $\\to$ ${}^{234}$U.',
      trap: 'Isobars share $A$, isotopes share $Z$. Here $Z$ is restored, $A$ is not.' },
    { id: 'nbr-013', type: 'mcq', level: 2, exams: ['jam'], sub: 'decay chains',
      q: '${}^{238}_{92}$U decays through a chain of $\\alpha$ and $\\beta^-$ decays to ${}^{206}_{82}$Pb. The number of $\\beta^-$ decays in the chain is',
      options: ['$8$', '$10$', '$6$', '$16$'], answer: 2,
      sol: 'Only $\\alpha$ decays change $A$: $(238 - 206)/4 = 8$ alpha decays. These lower $Z$ by $16$, to $76$. But lead has $Z = 82$, so six $\\beta^-$ decays (each $+1$) must raise it back: $76 + 6 = 82$.',
      trap: '$8$ is the number of alpha decays; $10$ is the drop in $Z$ without accounting for the alphas.' },
    { id: 'nbr-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'binding energy curve',
      q: 'For $A$ above about 20, the binding energy per nucleon stays close to $8$ MeV instead of growing with $A$. The main reason is that',
      options: ['the Coulomb repulsion cancels the nuclear attraction', 'heavy nuclei contain more neutrons than protons', 'the nuclear force is short-ranged, so each nucleon is bound only to its nearest neighbours', 'nucleons obey the Pauli principle'], answer: 2,
      sol: 'If every nucleon attracted every other one, the total binding would grow like $A^2$ and $B/A$ like $A$. Because the strong force acts only over about 1 to 2 fm, a nucleon in the interior feels only its neighbours, whose number does not grow with $A$. So $B \\propto A$ and $B/A$ is nearly constant: the force saturates. Coulomb repulsion and the neutron excess only cause the slow fall beyond $A \\approx 60$.',
      trap: 'The Coulomb term explains the slow decline for heavy nuclei, not the plateau itself.' },
    { id: 'nbr-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'decay law',
      q: 'What fraction of the nuclei in a sample decays during one mean life $\\tau$?',
      options: ['$50\\%$', '$63\\%$', '$37\\%$', '$69\\%$'], answer: 1,
      sol: 'After a time $\\tau = 1/\\lambda$, $N = N_0e^{-1} = 0.368N_0$ remain, so $1 - 0.368 = 0.632$, about $63\\%$, have decayed.',
      trap: '$37\\%$ is the fraction REMAINING; $50\\%$ belongs to the half-life.' },
    { id: 'nbr-016', type: 'msq', level: 2, exams: ['jam'], sub: 'decay modes', format: 'multi',
      q: 'Which of these decays leave the mass number $A$ unchanged?',
      options: ['$\\beta^-$ decay', '$\\beta^+$ decay', 'Electron capture', '$\\alpha$ decay'], answer: [0, 1, 2],
      sol: 'In all three beta processes one nucleon changes type ($n \\leftrightarrow p$) and the total number of nucleons stays the same. Alpha decay removes two protons and two neutrons, so $A$ falls by 4.',
      trap: 'Electron capture absorbs a particle, but an electron is not a nucleon, so $A$ is unchanged.' },
    { id: 'nbr-043', type: 'msq', level: 2, exams: ['jam'], sub: 'nuclear force', format: 'statements',
      q: 'Which statements about the nuclear (strong) force between nucleons are correct?',
      options: ['Its range is about 1 to 2 fm.', 'To a good approximation it is the same for $pp$, $nn$ and $np$ pairs.', 'It is attractive at all separations, however small.', 'It saturates: a nucleon interacts strongly only with a few neighbours.'], answer: [0, 1, 3],
      sol: 'The nuclear force falls off sharply beyond about 2 fm, which is why nuclei are so small. It is charge independent to a good approximation (the extra $pp$ Coulomb repulsion aside). Below about 0.5 fm it turns strongly repulsive (a "hard core"), which stops nuclei from collapsing and keeps the density constant. Its short range makes it saturate.',
      trap: 'Without the repulsive core nuclear matter would shrink; constant density is the clue that the force is not purely attractive.' },

    // ---------- level 3 ----------
    { id: 'nbr-017', type: 'nat', level: 3, exams: ['jam'], sub: 'alpha decay', unit: 'MeV',
      q: 'A nucleus of mass number $226$, at rest, undergoes alpha decay with $Q = 5.00$ MeV. Using mass numbers for the masses, the kinetic energy of the alpha particle is ______ MeV (to two decimal places).',
      answer: 4.91, tol: 0.01, calc: () => 5 * 222 / 226,
      sol: 'Momentum conservation: the alpha and the daughter ($A = 222$) fly apart with equal and opposite momenta $p$. Kinetic energy $p^2/2m$ is shared inversely to mass: $K_\\alpha = Q\\,\\dfrac{m_d}{m_\\alpha + m_d} = 5.00\\times\\dfrac{222}{226} = 4.91$ MeV. The daughter recoils with the remaining $0.09$ MeV.',
      trap: 'Giving the alpha all of $Q$ ignores the recoil of the daughter.' },
    { id: 'nbr-018', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'beta decay',
      q: 'Using ATOMIC masses, $\\beta^+$ decay from $(Z, A)$ to $(Z - 1, A)$ is possible only if $[M(Z, A) - M(Z-1, A)]c^2$ exceeds',
      options: ['$0$', '$0.511$ MeV', '$1.022$ MeV', '$931.5$ MeV'], answer: 2,
      sol: 'With nuclear masses the condition is $m_N(Z) > m_N(Z-1) + m_e$. Atomic masses include $Z$ electrons for the parent and $Z - 1$ for the daughter, so converting adds one more electron: $M(Z) > M(Z-1) + 2m_e$. Thus the atomic mass difference must exceed $2m_ec^2 = 1.022$ MeV. Electron capture has no such threshold (only $M(Z) > M(Z-1)$).',
      trap: 'One electron mass is the emitted positron; the second comes from the extra atomic electron the parent has.' },
    { id: 'nbr-019', type: 'nat', level: 3, exams: ['jam'], sub: 'dating', unit: 'years',
      q: 'The ${}^{14}$C activity per gram of carbon in an old piece of wood is $30\\%$ of that in living wood. With a half-life of $5730$ years, the age of the wood is ______ years (to the nearest ten years).',
      answer: 9950, tol: 60, calc: () => 5730 * Math.log(1 / 0.3) / Math.LN2,
      sol: '$A/A_0 = e^{-\\lambda t} = 0.30$, so $t = \\dfrac{\\ln(1/0.30)}{\\lambda} = T_{1/2}\\dfrac{\\ln(1/0.30)}{\\ln2} = 5730\\times\\dfrac{1.204}{0.693} = 9950$ years, about 1.74 half-lives.',
      trap: 'Using $\\log_{10}$ in one place and $\\ln$ in the other: the ratio $\\ln(1/0.3)/\\ln 2$ must use the same base top and bottom.' },
    { id: 'nbr-020', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'semi-empirical mass formula', format: 'statements',
      q: 'Which statements about the terms of the semi-empirical (liquid-drop) mass formula for the binding energy are correct?',
      options: ['The volume term is proportional to $A$.', 'The surface term reduces the binding and is proportional to $A^{2/3}$.', 'The Coulomb term is proportional to $Z(Z-1)/A^{1/3}$.', 'The asymmetry term favours nuclei with many more neutrons than protons.'], answer: [0, 1, 2],
      sol: 'Volume: each nucleon bound to its neighbours, $a_vA$. Surface: nucleons on the surface have fewer neighbours, $-a_sA^{2/3}$ (area $\\propto R^2 \\propto A^{2/3}$). Coulomb: $Z(Z-1)/2$ proton pairs at a typical distance $R \\propto A^{1/3}$. Asymmetry: $-a_a(N - Z)^2/A$, which is smallest at $N = Z$; it penalises any imbalance. The neutron excess of heavy nuclei comes from the Coulomb term, not from the asymmetry term.',
      trap: 'Heavy nuclei have $N > Z$ in spite of the asymmetry term, because Coulomb repulsion pushes the other way.' },
    { id: 'nbr-021', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'equilibrium',
      q: 'A parent with half-life $1600$ years decays to a daughter with half-life $3.82$ days, which decays further. In secular equilibrium, the ratio of the number of daughter nuclei to parent nuclei is ______ $\\times10^{-6}$ (to two decimal places; take $1$ year $= 365.25$ days).',
      answer: 6.54, tol: 0.02, calc: () => 3.82 / (1600 * 365.25) * 1e6,
      sol: 'In secular equilibrium the two activities are equal: $\\lambda_1N_1 = \\lambda_2N_2$, so $N_2/N_1 = \\lambda_1/\\lambda_2 = T_2/T_1 = 3.82/(1600\\times365.25) = 3.82/584\\,400 = 6.54\\times10^{-6}$.',
      trap: 'Equal activities, not equal numbers: the short-lived daughter is present in tiny amounts.' },
    { id: 'nbr-022', type: 'mcq', level: 3, exams: ['jam'], sub: 'branching',
      q: 'A nuclide decays by two independent modes. If only the first mode acted, its half-life would be $2$ h; if only the second, $3$ h. Its actual half-life is',
      options: ['$5$ h', '$2.5$ h', '$6$ h', '$1.2$ h'], answer: 3,
      sol: 'Decay constants add: $\\lambda = \\lambda_1 + \\lambda_2$, so $1/T = 1/T_1 + 1/T_2 = 1/2 + 1/3 = 5/6$ h$^{-1}$, $T = 1.2$ h. Two exits make the nucleus disappear faster than either alone.',
      trap: 'Adding or averaging half-lives gives a longer life, but two decay routes must shorten it.' },
    { id: 'nbr-023', type: 'nat', level: 3, exams: ['jam'], sub: 'binding energy', unit: 'MeV',
      q: 'The atomic mass of ${}^{16}$O is $15.994915$ u. With $m({}^1\\text{H}) = 1.007825$ u, $m_n = 1.008665$ u and $1$ u $= 931.494$ MeV/$c^2$, the binding energy per nucleon of ${}^{16}$O is ______ MeV (to two decimal places).',
      answer: 7.98, tol: 0.01, calc: () => (8 * 1.007825 + 8 * 1.008665 - 15.994915) * 931.494 / 16,
      sol: '$\\Delta m = 8(1.007825) + 8(1.008665) - 15.994915 = 8.062600 + 8.069320 - 15.994915 = 0.137005$ u. $B = 0.137005\\times931.494 = 127.62$ MeV. Per nucleon: $127.62/16 = 7.98$ MeV.',
      trap: 'Forgetting to divide by $A = 16$ gives the total, $127.6$ MeV.' },
    { id: 'nbr-024', type: 'mcq', level: 3, exams: ['jam'], sub: 'binding energy curve',
      q: 'The binding energy per nucleon rises steeply for light nuclei, peaks near $A \\approx 60$ and falls slowly for heavy nuclei. This explains why',
      options: ['fission of heavy nuclei and fusion of light nuclei both release energy, because both move the products towards the peak', 'only fission can release energy', 'only fusion can release energy', 'fusion of iron nuclei releases the most energy'], answer: 0,
      sol: 'Energy is released whenever the products are more tightly bound per nucleon than the starting nuclei. Splitting uranium ($B/A \\approx 7.6$ MeV) into two $A \\approx 120$ fragments ($\\approx 8.5$ MeV) gains about $0.9$ MeV per nucleon, around 200 MeV per fission. Fusing hydrogen into helium gains even more per nucleon. Iron sits at the top, so fusing or splitting it costs energy.',
      trap: 'Iron is the end point: it is the ash of stellar burning, not its best fuel.' },
    { id: 'nbr-025', type: 'mcq', level: 3, exams: ['jam'], sub: 'activity',
      q: 'A source has an activity of $800$ Bq and a half-life of $2$ h. Its activity $5$ h later is about',
      options: ['$141$ Bq', '$200$ Bq', '$160$ Bq', '$100$ Bq'], answer: 0,
      sol: '$5$ h is $2.5$ half-lives: $A = 800\\times2^{-2.5} = 800\\times0.1768 = 141$ Bq.',
      trap: '$200$ Bq stops at two half-lives; $160$ Bq treats the decay as linear between 2 and 3 half-lives.' },
    { id: 'nbr-026', type: 'mcq', level: 3, exams: ['jam'], sub: 'beta decay',
      q: 'The energy spectrum of the electrons from $\\beta^-$ decay is continuous, from zero up to a maximum. This shows that',
      options: ['the nucleus has a range of excited states', 'energy is not conserved in beta decay', 'the electron loses varying energy to the atomic electrons', 'a third particle (the antineutrino) shares the energy with the electron'], answer: 3,
      sol: 'In a two-body decay momentum and energy conservation fix the electron\'s energy, giving a sharp line. A continuous spectrum means a third body takes a variable share. Pauli proposed the (anti)neutrino in 1930; the maximum electron energy is the case where the antineutrino gets almost nothing.',
      trap: 'Bohr briefly considered giving up energy conservation; experiment sided with the neutrino.' },
    { id: 'nbr-027', type: 'msq', level: 3, exams: ['jam'], sub: 'stability', format: 'statements',
      q: 'Which statements about the stability of nuclei are correct?',
      options: ['Light stable nuclei have $N \\approx Z$.', 'Heavy stable nuclei have $N > Z$ because the Coulomb repulsion grows faster than the nuclear attraction.', 'Nuclei with too many neutrons for their $Z$ tend to undergo $\\beta^-$ decay.', 'Odd-odd nuclei are generally more stable than even-even nuclei.'], answer: [0, 1, 2],
      sol: 'For small $Z$ the asymmetry term makes $N = Z$ best. Coulomb energy grows like $Z^2/A^{1/3}$, so heavier nuclei shift towards more neutrons ($N/Z \\approx 1.5$ for lead). A neutron-rich nucleus moves towards the valley by turning a neutron into a proton: $\\beta^-$. Pairing makes even-even nuclei the MOST stable; only four stable odd-odd nuclei exist (${}^2$H, ${}^6$Li, ${}^{10}$B, ${}^{14}$N).',
      trap: 'Pairing works the other way: paired nucleons bind more, so even-even is best.' },
    { id: 'nbr-028', type: 'nat', level: 3, exams: ['jam'], sub: 'activity', unit: 'MBq',
      q: 'Find the activity of $1\\ \\mu$g of ${}^{60}$Co (half-life $5.27$ years, molar mass $60$ g/mol). Take $1$ year $= 3.156\\times10^7$ s and $N_A = 6.022\\times10^{23}$ mol$^{-1}$. The activity is ______ MBq (to one decimal place).',
      answer: 41.8, tol: 0.2, calc: () => (1e-6 / 60 * 6.022e23) * Math.LN2 / (5.27 * 3.156e7) / 1e6,
      sol: 'Number of nuclei: $N = (10^{-6}/60)\\times6.022\\times10^{23} = 1.004\\times10^{16}$. Decay constant: $\\lambda = \\ln2/(5.27\\times3.156\\times10^7\\text{ s}) = 4.168\\times10^{-9}$ s$^{-1}$. Activity $A = \\lambda N = 4.18\\times10^{7}$ Bq $= 41.8$ MBq.',
      trap: 'Leaving the half-life in years gives $\\lambda$ per year and an activity per year, not per second.' },
    { id: 'nbr-038', type: 'mcq', level: 3, exams: ['jam'], sub: 'alpha decay',
      q: 'A ${}^{226}$Ra nucleus at rest alpha decays with $Q = 4.87$ MeV. Using mass numbers for masses, the recoil kinetic energy of the daughter nucleus is about',
      options: ['$86$ keV', '$4.78$ MeV', '$21.5$ keV', '$4.87$ MeV'], answer: 0,
      sol: 'Equal and opposite momenta share $Q$ inversely to mass: $K_d = Q\\,m_\\alpha/(m_\\alpha + m_d) = 4.87\\times4/226 = 0.0862$ MeV $= 86$ keV. The alpha takes the rest, $4.78$ MeV. The recoil is small but large enough to knock the daughter atom out of a surface.',
      trap: '$4.78$ MeV is the alpha\'s share, not the recoil; $21.5$ keV divides $Q$ by 226 and forgets the factor 4.' },

    // ---------- level 4 ----------
    { id: 'nbr-029', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'alpha decay', unit: 'MeV',
      q: 'Atomic masses: ${}^{210}$Po $209.982874$ u, ${}^{206}$Pb $205.974465$ u, ${}^{4}$He $4.002603$ u; $1$ u $= 931.494$ MeV/$c^2$. For the alpha decay of ${}^{210}$Po at rest, the kinetic energy of the alpha particle is ______ MeV (to two decimal places; use mass numbers to share the energy).',
      answer: 5.31, tol: 0.01, calc: () => (209.982874 - 205.974465 - 4.002603) * 931.494 * 206 / 210,
      sol: '$Q = [M(\\text{Po}) - M(\\text{Pb}) - M(\\text{He})]c^2 = 0.005806\\times931.494 = 5.408$ MeV (atomic masses work because the electron numbers balance: $84 = 82 + 2$). The alpha gets $Q\\times206/210 = 5.31$ MeV; the lead recoils with $0.10$ MeV.',
      trap: 'Stopping at $Q = 5.41$ MeV forgets the recoil share.' },
    { id: 'nbr-030', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'semi-empirical mass formula',
      q: 'In the liquid-drop model the binding energy includes $-a_c\\dfrac{Z^2}{A^{1/3}} - a_a\\dfrac{(A - 2Z)^2}{A}$ with $a_c = 0.71$ MeV and $a_a = 23.7$ MeV. Ignoring the neutron-proton mass difference and pairing, the atomic number of the most stable isobar with $A = 125$ is ______ (to one decimal place; treat $Z$ as continuous).',
      answer: 52.6, tol: 0.1, calc: () => 125 / (2 + 0.71 / (2 * 23.7) * 125 ** (2 / 3)),
      sol: 'For fixed $A$, maximise the binding: $\\dfrac{d}{dZ}\\left[-a_c\\dfrac{Z^2}{A^{1/3}} - a_a\\dfrac{(A - 2Z)^2}{A}\\right] = -\\dfrac{2a_cZ}{A^{1/3}} + \\dfrac{4a_a(A - 2Z)}{A} = 0$. Solving, $Z_0 = \\dfrac{A}{2 + (a_c/2a_a)A^{2/3}}$. With $A^{2/3} = 25$ and $a_c/2a_a = 0.01498$: $Z_0 = 125/(2 + 0.3745) = 52.6$. The stable isobar is tellurium ($Z = 52$).',
      trap: 'The asymmetry term alone would give $Z = A/2 = 62.5$; the Coulomb term pulls $Z_0$ down.' },
    { id: 'nbr-031', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'successive decay', unit: 'h',
      q: 'A pure sample of a parent with half-life $10$ h decays to a daughter with half-life $2$ h. Starting with no daughter present, the daughter\'s activity is largest after ______ h (to two decimal places).',
      answer: 5.8, tol: 0.02, calc: () => { const l1 = Math.LN2 / 10, l2 = Math.LN2 / 2; return Math.log(l2 / l1) / (l2 - l1); },
      sol: 'The daughter number is $N_2 = \\dfrac{\\lambda_1N_0}{\\lambda_2 - \\lambda_1}(e^{-\\lambda_1t} - e^{-\\lambda_2t})$. Its activity peaks where $dN_2/dt = 0$: $\\lambda_1e^{-\\lambda_1t} = \\lambda_2e^{-\\lambda_2t}$, so $t_{max} = \\dfrac{\\ln(\\lambda_2/\\lambda_1)}{\\lambda_2 - \\lambda_1}$. Here $\\lambda_2/\\lambda_1 = 5$ and $\\lambda_2 - \\lambda_1 = 0.693(0.5 - 0.1) = 0.2773$ h$^{-1}$: $t_{max} = 1.609/0.2773 = 5.80$ h. At that moment the parent and daughter activities are equal.',
      trap: 'Guessing one daughter half-life (2 h) or one parent half-life (10 h).' },
    { id: 'nbr-032', type: 'msq', level: 4, exams: ['jam'], sub: 'activity', format: 'statements',
      q: 'Which statements are correct?',
      options: ['$1$ Ci $= 3.7\\times10^{10}$ Bq.', 'The activity of a single radionuclide halves every half-life.', 'The mean life is longer than the half-life.', 'The activity per gram (specific activity) of a pure radionuclide does not depend on its half-life.'], answer: [0, 1, 2],
      sol: 'The curie was set as about the activity of 1 g of radium: $3.7\\times10^{10}$ decays per second. $A = \\lambda N$ falls exactly like $N$. $\\tau = T_{1/2}/\\ln2 = 1.44T_{1/2}$. Specific activity is $\\lambda N_A/M = N_A\\ln2/(MT_{1/2})$: the shorter the half-life, the hotter each gram.',
      trap: 'Specific activity is inversely proportional to the half-life: a short-lived source is intense per gram.' },
    { id: 'nbr-033', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'alpha decay',
      q: 'Alpha emitters with slightly larger decay energies have enormously shorter half-lives (the Geiger-Nuttall rule). The reason is that',
      options: ['the alpha particle must tunnel through the Coulomb barrier, and the tunnelling probability depends exponentially on its energy', 'nuclei with larger decay energy have more alpha particles inside them', 'larger decay energy means a heavier nucleus with more protons', 'the alpha particle is pushed out faster by the strong force'], answer: 0,
      sol: 'A 5 MeV alpha meets a Coulomb barrier of about 25 MeV and can only escape by quantum tunnelling. The transmission goes as $e^{-2G}$, where the Gamow factor $G$ falls as the energy rises (roughly $G \\propto Z/\\sqrt{E}$). So a modest rise in energy changes the half-life by many powers of ten: from about $10^{17}$ s for ${}^{232}$Th to under a microsecond for ${}^{212}$Po.',
      trap: 'Classically the alpha could never get out at all; the rule is a fingerprint of tunnelling.' },
    { id: 'nbr-034', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'semi-empirical mass formula', unit: 'MeV',
      q: 'Use the semi-empirical binding energy $B = a_vA - a_sA^{2/3} - a_c\\dfrac{Z(Z-1)}{A^{1/3}} - a_a\\dfrac{(A - 2Z)^2}{A} + \\delta$ with $a_v = 15.8$, $a_s = 18.3$, $a_c = 0.714$, $a_a = 23.2$ MeV and $\\delta = +12/\\sqrt A$ MeV for even-even nuclei. For ${}^{56}$Fe ($Z = 26$), $B/A$ is ______ MeV (to two decimal places).',
      answer: 8.76, tol: 0.01, calc: () => { const A = 56, Z = 26, c = Math.cbrt(A); return (15.8 * A - 18.3 * c * c - 0.714 * Z * (Z - 1) / c - 23.2 * (A - 2 * Z) ** 2 / A + 12 / Math.sqrt(A)) / A; },
      sol: '$A^{1/3} = 3.826$, $A^{2/3} = 14.64$. Volume $15.8\\times56 = 884.8$. Surface $18.3\\times14.64 = 267.9$. Coulomb $0.714\\times26\\times25/3.826 = 121.3$. Asymmetry $23.2\\times4^2/56 = 6.6$. Pairing $+12/\\sqrt{56} = +1.6$. $B = 884.8 - 267.9 - 121.3 - 6.6 + 1.6 = 490.6$ MeV, so $B/A = 8.76$ MeV, close to the measured $8.79$ MeV.',
      trap: 'Forgetting the sign of the pairing term: even-even nuclei gain binding, odd-odd lose it.' },
    { id: 'nbr-035', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'beta decay',
      q: 'The atomic mass of a nuclide $(Z, A)$ exceeds that of its isobar $(Z - 1, A)$ by $0.6$ MeV/$c^2$. Which decays to $(Z-1, A)$ are energetically possible?',
      options: ['Electron capture only', '$\\beta^+$ decay only', 'Both $\\beta^+$ decay and electron capture', 'Neither'], answer: 0,
      sol: 'Electron capture needs only $M(Z) > M(Z - 1)$ (atomic masses), which holds. $\\beta^+$ decay needs $M(Z) - M(Z-1) > 2m_ec^2 = 1.022$ MeV, which fails for $0.6$ MeV. So only electron capture happens.',
      trap: 'Comparing $0.6$ MeV with one electron mass ($0.511$ MeV) wrongly allows $\\beta^+$.' },
    { id: 'nbr-037', type: 'mcq', level: 4, exams: ['jam'], sub: 'decay law',
      q: 'A sample contains two unrelated radionuclides, one short-lived and one long-lived. Its total activity is plotted as $\\ln A$ against time. The plot is',
      options: ['a straight line of slope equal to minus the sum of the two decay constants', 'a curve that is steep at first and becomes a straight line whose slope is minus the longer-lived nuclide\'s decay constant', 'a straight line of slope equal to minus the average decay constant', 'a curve that becomes steeper with time'], answer: 1,
      sol: '$A = A_1e^{-\\lambda_1t} + A_2e^{-\\lambda_2t}$ is not a single exponential, so $\\ln A$ is curved. Early on both contribute and the curve falls steeply. Once the short-lived part has died away, only $A_2e^{-\\lambda_2t}$ is left: a straight line of slope $-\\lambda_2$ (the smaller constant). Extending that line back and subtracting it reveals the short-lived part: the classic way to separate two half-lives.',
      trap: 'Decay constants add for one nuclide with two decay modes, not for two separate nuclides.' },
    { id: 'nbr-041', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'equilibrium',
      q: 'A very long-lived parent is freshly purified, so no daughter is present at first. The daughter\'s activity reaches $99\\%$ of the parent\'s activity after ______ daughter half-lives (to two decimal places).',
      answer: 6.64, tol: 0.01, calc: () => Math.log2(100),
      sol: 'With a constant parent activity, the daughter grows as $A_2 = A_1(1 - e^{-\\lambda_2t})$. Set $1 - e^{-\\lambda_2t} = 0.99$: $e^{-\\lambda_2t} = 0.01$, so $t = \\ln100/\\lambda_2 = T_2\\ln100/\\ln2 = 6.64\\,T_2$.',
      trap: 'Using the parent\'s half-life: the growth to equilibrium is set by the daughter.' },
    { id: 'nbr-044', type: 'msq', level: 4, exams: ['jam'], sub: 'decay law', format: 'multi',
      q: 'For a pure sample of a single radionuclide, which of these graphs against time are straight lines?',
      options: ['$\\ln A$ (activity)', '$A$', '$\\ln N$ (number of undecayed nuclei)', '$\\log_{10}$ of the count rate after the background has been subtracted'], answer: [0, 2, 3],
      sol: '$N = N_0e^{-\\lambda t}$ and $A = \\lambda N$, so $\\ln N$ and $\\ln A$ fall linearly with slope $-\\lambda$; $\\log_{10}$ just rescales the slope to $-\\lambda/\\ln10$. A count rate is proportional to $A$ once the constant background is removed. $A$ itself falls along an exponential curve, not a line.',
      trap: 'Without subtracting the background, the log plot of a count rate bends and flattens at late times.' },

    // ---------- level 5 ----------
    { id: 'nbr-036', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'decay law', unit: 'h',
      q: 'A source contains two unrelated radionuclides that start with EQUAL activities; their half-lives are $1$ h and $3$ h. The total activity falls to half its initial value after ______ h (to two decimal places).',
      answer: 1.65, tol: 0.01, calc: () => { let lo = 0, hi = 5; for (let i = 0; i < 60; i++) { const t = (lo + hi) / 2; if (2 ** -t + 2 ** (-t / 3) > 1) lo = t; else hi = t; } return lo; },
      sol: 'Total activity relative to its start: $\\tfrac12(2^{-t} + 2^{-t/3})$, with $t$ in hours. Set it to $\\tfrac12$: $2^{-t} + 2^{-t/3} = 1$. Let $x = 2^{-t/3}$, so $2^{-t} = x^3$: $x^3 + x - 1 = 0$. This cubic has one real root, $x = 0.6823$ (check: $0.3177 + 0.6823 = 1$). Then $t = -3\\log_2 0.6823 = 3\\times0.5515 = 1.65$ h.',
      trap: 'Averaging the half-lives (2 h) or using $1/T = 1/T_1 + 1/T_2$ (0.75 h): that rule is for one nuclide with two decay modes.' },
    { id: 'nbr-039', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'equilibrium', unit: 'μg',
      q: 'A sealed $1$ g sample of a parent nuclide ($A = 226$, half-life $1600$ years) has reached secular equilibrium with its daughter ($A = 222$, half-life $3.82$ days). The mass of daughter present is ______ $\\mu$g (to two decimal places; $1$ year $= 365.25$ days, use mass numbers as molar masses).',
      answer: 6.42, tol: 0.02, calc: () => 1e6 * (3.82 / (1600 * 365.25)) * (222 / 226),
      sol: 'Equal activities: $N_2/N_1 = T_2/T_1 = 6.537\\times10^{-6}$. Masses scale with number times molar mass: $m_2 = m_1\\,\\dfrac{N_2}{N_1}\\,\\dfrac{222}{226} = 1\\text{ g}\\times6.537\\times10^{-6}\\times0.9823 = 6.42\\times10^{-6}$ g $= 6.42\\ \\mu$g.',
      trap: 'Forgetting the molar mass ratio gives $6.54\\ \\mu$g: equilibrium fixes the number ratio, not the mass ratio.' },
    { id: 'nbr-040', type: 'msq', level: 5, exams: ['jam', 'gate'], sub: 'beta decay', format: 'statements',
      q: 'Using ATOMIC masses $M(Z, A)$ and neglecting atomic binding energies unless stated, which statements are correct?',
      options: ['For $\\beta^-$ decay, $Q = [M(Z, A) - M(Z+1, A)]c^2$.', 'For $\\beta^+$ decay, $Q = [M(Z, A) - M(Z-1, A) - 2m_e]c^2$.', 'For electron capture, $Q = [M(Z, A) - M(Z-1, A)]c^2$ minus the binding energy of the captured electron.', 'In $\\beta^-$ decay the antineutrino always carries away exactly half of $Q$.'], answer: [0, 1, 2],
      sol: '$\\beta^-$: the daughter ion has $Z$ electrons but needs $Z + 1$; the emitted electron fills that gap, so atomic masses subtract directly. $\\beta^+$: the daughter has one electron too many, and a positron is created: $2m_e$ extra. Electron capture uses an atomic electron that was already counted in $M(Z)$, so $Q$ is the plain difference less the energy needed to remove that electron from its shell. The antineutrino\'s share varies from decay to decay between 0 and $Q$; that is why the electron spectrum is continuous.',
      trap: 'The bookkeeping of electrons differs between the three modes: one formula does not fit all.' },
    { id: 'nbr-042', type: 'mcq', level: 5, exams: ['jam', 'gate'], sub: 'stability',
      q: 'Plotting atomic mass against $Z$ for a fixed mass number gives parabolas. For even $A$ there are two parabolas (even-even nuclei lower, odd-odd nuclei higher, because of pairing). A consequence is that',
      options: ['for even $A$ there is never more than one stable isobar', 'for even $A$ there can be two (or even three) stable isobars, and an odd-odd nucleus between them may decay both by $\\beta^-$ and by $\\beta^+$/electron capture', 'for odd $A$ there are usually several stable isobars', 'odd-odd nuclei with even $A$ cannot undergo beta decay'], answer: 1,
      sol: 'For odd $A$ the nuclei lie on one parabola and successive beta decays slide down to a single minimum: usually one stable isobar. For even $A$ beta decay hops between the two parabolas. An even-even nucleus near the bottom may lie below both its odd-odd neighbours, so it cannot beta decay even if another even-even isobar two steps away is lower still. That allows two stable isobars, such as ${}^{40}$Ar and ${}^{40}$Ca, with ${}^{40}$K between them decaying both ways.',
      trap: 'Single beta decays change $Z$ by one, so an even-even nucleus is "trapped" if both neighbours are heavier, even when it is not the absolute minimum.' },
  ],

  gens: [
    { id: 'nbr-t21', type: 'mcq', level: 1, exams: ['jam'], sub: 'decay modes',
      make(r) {
        const Z = Q5.int(r, 20, 92), A = Math.round(Z * Q5.pick(r, 2.1, 2.6, 0.05)), c = Q5.int(r, 0, 3);
        const [dZ, dA] = [[-2, -4], [1, 0], [-1, 0], [0, 0]][c];
        const names = ['alpha decay', 'beta-minus decay', 'beta-plus decay (or electron capture)', 'gamma decay (from an excited state)'];
        const o = Q5.mcqOptions(r, names[c], names.filter((x, i) => i !== c));
        return { q: `A nucleus with $Z = ${Z}$, $A = ${A}$${c === 3 ? ', left in an excited state,' : ''} decays to a nucleus with $Z = ${Z + dZ}$, $A = ${A + dA}$, emitting one particle (or photon). The decay is`, ...o,
          sol: 'Alpha: $Z - 2$, $A - 4$. Beta-minus ($n \\to p + e^- + \\bar\\nu$): $Z + 1$, same $A$. Beta-plus or electron capture ($p \\to n$): $Z - 1$, same $A$. Gamma: same $Z$ and $A$, lower energy. ' + `Here $\\Delta Z = ${dZ}$, $\\Delta A = ${dA}$: ${names[c]}.`,
          trap: 'Beta decay changes $Z$ but not $A$; only alpha decay changes $A$.' };
      } },
    { id: 'nbr-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'binding energy curve', format: 'statements',
      make(r) {
        const yes = r() < 0.5;
        const T = ['The binding energy per nucleon is largest, about $8.8$ MeV, near $A \\approx 56$-$62$.', 'Both fission of heavy nuclei and fusion of light nuclei release energy.', 'For $A > 20$ the binding energy per nucleon is roughly constant, near $8$ MeV, showing that the nuclear force saturates.',
          'All nuclei have roughly the same density.', '${}^4$He has a higher binding energy per nucleon than its neighbours.'];
        const F = ['The binding energy per nucleon keeps rising up to uranium.', 'The heaviest nuclei are the most tightly bound per nucleon.', 'The nuclear radius is proportional to the mass number $A$.',
          '${}^4$He has a lower binding energy per nucleon than its neighbours.', 'Fusion of two iron nuclei releases energy.'];
        const o = yes ? q5msq(r, T, F) : q5msq(r, F, T);
        return { q: `Which statements about nuclear binding energy are ${yes ? 'correct' : '<b>NOT</b> correct'}?`, ...o,
          sol: 'The $B/A$ curve rises steeply for light nuclei (with a spike at ${}^4$He, a doubly magic nucleus), peaks near iron and nickel at about $8.8$ MeV, then falls slowly to about $7.6$ MeV for uranium because of Coulomb repulsion. Moving towards the peak releases energy: fission from the heavy side, fusion from the light side; fusing iron would cost energy. $B/A$ is nearly constant because each nucleon binds only to its neighbours (saturation), and $R = R_0A^{1/3}$ makes the density the same for all nuclei.',
          trap: 'Radius goes as $A^{1/3}$, so volume (not radius) is proportional to $A$.' };
      } },
    { id: 'nbr-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'activity', unit: 'GBq',
      make(r) {
        const m = Q5.int(r, 1, 100), A = Q5.int(r, 50, 240), T = Q5.int(r, 1, 30), t = Q5.int(r, 0, 60);
        const lam = Math.LN2 / (T * 86400), N0 = m * 1e-6 / A * 6.022e23, act = lam * N0 * Math.exp(-lam * t * 86400) / 1e9;
        return { q: `A freshly made sample contains $${m}\\ \\mu$g of a pure radionuclide of mass number $${A}$ and half-life $${T}$ days. Its activity $${t}$ days later is ______ GBq (to three significant figures; molar mass $\\approx A$ g/mol, $N_A = 6.022\\times10^{23}$).`,
          answer: +act.toPrecision(3), tol: +(0.006 * act).toPrecision(2), m, A, T, t,
          sol: `$N_0 = \\dfrac{${m}\\times10^{-6}}{${A}}\\times6.022\\times10^{23} = ${Q5.fmt(N0, 4)}$. $\\lambda = \\ln2/T_{1/2} = 0.693/(${T}\\times86400\\ \\text{s}) = ${Q5.fmt(lam, 4)}$ s$^{-1}$. $A_0 = \\lambda N_0 = ${Q5.fmt(lam * N0 / 1e9, 4)}$ GBq, and after $${t}$ days $A = A_0\\,2^{-${t}/${T}} = ${+act.toPrecision(3)}$ GBq.`,
          trap: 'Use the decay constant in s$^{-1}$ (the becquerel is decays per second).' };
      },
      verify: (p) => { const lam = Math.LN2 / (p.T * 86400), N0 = p.m * 1e-6 / p.A * 6.022e23; return lam * N0 * 0.5 ** (p.t / p.T) / 1e9; } },
    { id: 'nbr-t24', type: 'mcq', level: 2, exams: ['jam'], sub: 'decay law', format: 'graph',
      make(r) {
        const log10 = r() < 0.5, x = log10 ? Q5.pick(r, 1, 20, 0.5) : Q5.pick(r, 0.02, 0.5, 0.01);
        const T = log10 ? x * Math.log10(2) : Math.LN2 / x;
        const s = (v) => `$${Q5.round(v, 2)}$ h`;
        const o = Q5.mcqOptions(r, T, log10 ? [x, x / 2, x * Math.LN2] : [1 / x, x * Math.LN2, Math.log10(2) / x], s);
        return { q: log10 ? `A graph of $\\log_{10}$(activity) against time for a pure radionuclide is a straight line that falls by $1$ (a factor of 10) every $${x}$ hours. The half-life is` : `A graph of $\\ln$(activity) against time for a pure radionuclide is a straight line of slope $-${x}$ per hour. The half-life is`, ...o,
          sol: log10 ? `A factor of 10 takes $\\ln10/\\lambda = ${x}$ h; a factor of 2 takes $\\ln2/\\lambda$. So $T_{1/2} = ${x}\\times\\dfrac{\\ln2}{\\ln10} = ${x}\\times0.301 = ${Q5.round(T, 2)}$ h.` : `$\\ln A = \\ln A_0 - \\lambda t$, so $\\lambda = ${x}$ h$^{-1}$ and $T_{1/2} = \\ln2/\\lambda = ${Q5.round(T, 2)}$ h.`,
          trap: 'Check which logarithm the graph uses: base 10 and base $e$ give slopes differing by $\\ln10 = 2.303$.' };
      } },
    { id: 'nbr-t25', type: 'nat', level: 3, exams: ['jam'], sub: 'mass-energy', unit: 'u',
      make(r) {
        const M = { n: ['n', 1.008665], p: ['{}^1\\mathrm H', 1.007825], d: ['{}^2\\mathrm H', 2.014102], t: ['{}^3\\mathrm H', 3.016049], h3: ['{}^3\\mathrm{He}', 3.016029], a: ['{}^4\\mathrm{He}', 4.002602], li6: ['{}^6\\mathrm{Li}', 6.015122], li7: ['{}^7\\mathrm{Li}', 7.016003] };
        const [L, Rr] = Q5.choose(r, [[['d', 't'], ['a', 'n']], [['p', 'li7'], ['a', 'a']], [['n', 'li6'], ['a', 't']], [['d', 'd'], ['h3', 'n']], [['d', 'd'], ['t', 'p']]]);
        const all = [...L.map((k) => [k, 1]), ...Rr.map((k) => [k, -1])], dup = (i) => all.filter((x) => x[0] === all[i][0]).length > 1;
        let hide = Q5.int(r, 0, 3); if (dup(hide)) hide = all.findIndex((x, i) => !dup(i));
        const Qv = +((L.reduce((s, k) => s + M[k][1], 0) - Rr.reduce((s, k) => s + M[k][1], 0)) * 931.494).toFixed(3);
        const known = all.filter((x, i) => i !== hide).reduce((s, [k, sg]) => s + sg * M[k][1], 0);
        const sg = all[hide][1], mass = sg * (Qv / 931.494 - known);
        const eq = `${L.map((k) => M[k][0]).join(' + ')} \\to ${Rr.map((k) => M[k][0]).join(' + ')}`;
        const given = all.filter((x, i) => i !== hide).map(([k]) => `$m(${M[k][0]}) = ${M[k][1]}$ u`).filter((v, i, a) => a.indexOf(v) === i).join(', ');
        return { q: `The reaction $${eq}$ releases $Q = ${Qv}$ MeV. Given ${given}, the mass of ${M[all[hide][0]][0] === 'n' ? 'the neutron' : `$${M[all[hide][0]][0]}$`} (one of the ${sg > 0 ? 'reactants' : 'products'}) is ______ u (to six decimal places; $1$ u $= 931.494$ MeV/$c^2$).`,
          answer: Q5.round(mass, 6), tol: 3e-6, Qv, known, sg,
          sol: `$Q = (\\text{mass of reactants} - \\text{mass of products})\\,c^2$. So $\\Delta m = ${Qv}/931.494 = ${Q5.round(Qv / 931.494, 6)}$ u. Solving the mass balance for the unknown: $m = ${Q5.round(mass, 6)}$ u.`,
          trap: 'Atomic masses already include the electrons; they balance on both sides here.' };
      },
      verify: (p) => (p.Qv / 931.494 - p.known) / p.sg },
    { id: 'nbr-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'decay law',
      make(r) {
        const T = choose(r, [2, 5, 8, 10, 12, 15, 20, 30]), k = choose(r, [0.5, 1, 1.5, 2, 2.5, 3, 4, 5]), t = round(T * k, 2);
        const unit = choose(r, ['hours', 'days', 'minutes']);
        const f = 2 ** (-t / T);
        return { q: `A radionuclide has a half-life of $${T}$ ${unit}. The fraction of the nuclei left after $${t}$ ${unit} is ______ (to three decimal places).`,
          answer: round(f, 3), tol: Math.max(0.001, round(f * 0.005, 3)), T, t,
          sol: `$t/T_{1/2} = ${t}/${T} = ${k}$ half-lives, so $N/N_0 = 2^{-${k}} = ${round(f, 4)}$.`,
          trap: 'Treating the decay as linear in time.' };
      },
      verify: (p) => 2 ** (-p.t / p.T) },
    { id: 'nbr-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'nuclear size', unit: 'fm',
      make(r) {
        const A = int(r, 4, 250), R0 = choose(r, [1.2, 1.25, 1.3]);
        const R = R0 * Math.cbrt(A);
        return { q: `Taking $R_0 = ${R0}$ fm, the radius of a nucleus with mass number $${A}$ is ______ fm (to two decimal places).`,
          answer: round(R, 2), tol: 0.02, unit: 'fm', A, R0,
          sol: `$R = R_0A^{1/3} = ${R0}\\times${A}^{1/3} = ${R0}\\times${round(Math.cbrt(A), 4)} = ${round(R, 2)}$ fm.`,
          trap: 'Using $A^{1/2}$ or $A$ instead of $A^{1/3}$.' };
      },
      verify: (p) => p.R0 * Math.cbrt(p.A) },
    { id: 'nbr-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'activity', unit: 'MBq',
      make(r) {
        const m = int(r, 1, 9), e = int(r, 14, 18), T = choose(r, [1, 2, 6, 8, 12, 24, 72]);
        const N = m * 10 ** e, lam = Math.LN2 / (T * 3600), A = lam * N / 1e6;
        return { q: `A sample contains $${m}\\times10^{${e}}$ nuclei of a radionuclide with half-life $${T}$ h. Its activity is ______ MBq (to three significant figures).`,
          answer: +A.toPrecision(3), tol: Math.abs(A) * 0.006, unit: 'MBq', N, T,
          sol: `$\\lambda = \\ln2/(${T}\\times3600\\text{ s}) = ${(lam).toPrecision(4)}$ s$^{-1}$. $A = \\lambda N = ${(lam * N).toPrecision(4)}$ Bq $= ${A.toPrecision(3)}$ MBq.`,
          trap: 'Leaving the half-life in hours gives decays per hour.' };
      },
      verify: (p) => Math.LN2 / (p.T * 3600) * p.N / 1e6 },
    { id: 'nbr-g04', type: 'nat', level: 3, exams: ['jam'], sub: 'alpha decay', unit: 'MeV',
      make(r) {
        const A = int(r, 146, 254), Q = pick(r, 4, 9, 0.01);
        const K = Q * (A - 4) / A;
        return { q: `A nucleus of mass number $${A}$ at rest undergoes alpha decay with $Q = ${Q}$ MeV. Using mass numbers for masses, the alpha particle's kinetic energy is ______ MeV (to three decimal places).`,
          answer: round(K, 3), tol: 0.003, unit: 'MeV', A, Q,
          sol: `$K_\\alpha = Q(A - 4)/A = ${Q}\\times${A - 4}/${A} = ${round(K, 3)}$ MeV; the daughter recoils with $${round(Q - K, 3)}$ MeV.`,
          trap: 'Giving the alpha all of $Q$.' };
      },
      verify: (p) => p.Q * (p.A - 4) / p.A },
    { id: 'nbr-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'dating', unit: 'years',
      make(r) {
        const f = pick(r, 0.05, 0.9, 0.01), T = 5730;
        const t = T * Math.log(1 / f) / Math.LN2;
        return { q: `A sample of old charcoal has $${round(f * 100, 0)}\\%$ of the ${'${}^{14}$'}C activity per gram of fresh charcoal. With a half-life of $5730$ years, its age is ______ years (to three significant figures).`,
          answer: +t.toPrecision(3), tol: Math.max(10, t * 0.006), unit: 'years', f,
          sol: `$t = T_{1/2}\\ln(A_0/A)/\\ln2 = 5730\\times\\ln(1/${f})/0.6931 = ${t.toPrecision(4)}$ years.`,
          trap: 'Mixing $\\log_{10}$ and $\\ln$.' };
      },
      verify: (p) => 5730 * Math.log(1 / p.f) / Math.LN2 },
    { id: 'nbr-g06', type: 'mcq', level: 2, exams: ['jam'], sub: 'decay chains',
      make(r) {
        const Z = int(r, 84, 94), A = 2 * Z + int(r, 40, 56), na = int(r, 1, 4), nb = int(r, 0, 4);
        const Zf = Z - 2 * na + nb, Af = A - 4 * na;
        const show = ([z, a]) => `$Z = ${z}$, $A = ${a}$`;
        const o = mcqOptions(r, [Zf, Af], [[Z - 2 * na - nb, Af], [Zf, A - 2 * na], [Z - na + nb, A - 4 * na], [Zf + 2, Af], [Zf, Af - 4]], show);
        return { q: `A nucleus with $Z = ${Z}$ and $A = ${A}$ emits ${na} alpha particle${na > 1 ? 's' : ''} and ${nb} $\\beta^-$ particle${nb === 1 ? '' : 's'}. The final nucleus has`, ...o,
          sol: `Each alpha: $Z - 2$, $A - 4$. Each $\\beta^-$: $Z + 1$, $A$ unchanged. $Z = ${Z} - 2(${na}) + ${nb} = ${Zf}$, $A = ${A} - 4(${na}) = ${Af}$.`,
          trap: 'Beta minus RAISES $Z$; it does not lower it.' };
      } },
    { id: 'nbr-g07', type: 'nat', level: 3, exams: ['jam'], sub: 'binding energy', unit: 'MeV',
      make(r) {
        const k = int(r, 0, NUC.length - 1), [s, Z, A, M] = NUC[k];
        const b = bePerA(Z, A, M);
        return { q: `The atomic mass of $${s}$ ($Z = ${Z}$) is $${M.toFixed(6)}$ u. With $m({}^1\\mathrm{H}) = ${MH}$ u, $m_n = ${MN}$ u and $1$ u $= ${U}$ MeV/$c^2$, its binding energy per nucleon is ______ MeV (to three decimal places).`,
          answer: round(b, 3), tol: 0.003, unit: 'MeV', k,
          sol: `$\\Delta m = ${Z}(${MH}) + ${A - Z}(${MN}) - ${M.toFixed(6)} = ${(Z * MH + (A - Z) * MN - M).toFixed(6)}$ u. $B = \\Delta m\\times${U} = ${round(b * A, 3)}$ MeV, and $B/A = ${round(b * A, 3)}/${A} = ${round(b, 3)}$ MeV.`,
          trap: 'Using the proton mass with an atomic mass, or forgetting to divide by $A$.' };
      },
      verify: (p) => { const [, Z, A, M] = NUC[p.k]; return bePerA(Z, A, M); } },
    { id: 'nbr-g08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'successive decay', unit: 'h',
      make(r) {
        let T1, T2;
        do { T1 = choose(r, [1, 2, 3, 5, 6, 8, 10, 12, 20]); T2 = choose(r, [0.5, 1, 2, 3, 4, 6, 15]); } while (T1 === T2);
        const l1 = Math.LN2 / T1, l2 = Math.LN2 / T2, t = Math.log(l2 / l1) / (l2 - l1);
        return { q: `A pure parent (half-life $${T1}$ h) decays to a radioactive daughter (half-life $${T2}$ h). Starting with no daughter, the daughter's activity is greatest after ______ h (to two decimal places).`,
          answer: round(t, 2), tol: Math.max(0.01, round(t * 0.003, 2)), unit: 'h', T1, T2,
          sol: `$t_{max} = \\ln(\\lambda_2/\\lambda_1)/(\\lambda_2 - \\lambda_1)$ with $\\lambda_1 = ${round(l1, 4)}$ h$^{-1}$ and $\\lambda_2 = ${round(l2, 4)}$ h$^{-1}$: $t_{max} = ${round(Math.log(l2 / l1), 4)}/${round(l2 - l1, 4)} = ${round(t, 2)}$ h.`,
          trap: 'The formula works whichever half-life is longer, since both the logarithm and the denominator change sign together.' };
      },
      verify: (p) => { const l1 = Math.LN2 / p.T1, l2 = Math.LN2 / p.T2; return Math.log(l2 / l1) / (l2 - l1); } },
  ],
};
