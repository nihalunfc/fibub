// Binding energy and the semi-empirical mass formula (GATE / CSIR NET level): mass excess, separation energies
// (S_n, S_p, S_2n), pairing and the odd-even zigzag, the five liquid-drop terms and their origins, the Coulomb
// coefficient from the radius, the line of stability and mass parabolas (odd and even A), beta Q values and alpha Q
// values from the formula, double beta decay, fission: symmetric-fission energy, the fissility limit and the
// deformation energy. Original questions for fibub.
import { pick, int, choose, mcqOptions, round } from '../_util.js';

const AV = 15.8, AS = 18.3, AC = 0.714, AA = 23.2, AP = 12;   // MeV; pairing delta = AP/sqrt(A)
const U = 931.494, DNH = 0.782;                              // MeV per u; (m_n - m_H)c^2
const pair = (Z, A) => (A % 2 ? 0 : (Z % 2 ? -1 : 1) * AP / Math.sqrt(A));
const BE = (Z, A) => { const c = Math.cbrt(A); return AV * A - AS * c * c - AC * Z * (Z - 1) / c - AA * (A - 2 * Z) ** 2 / A + pair(Z, A); };
const Z0s = (A) => A / (2 + AC / (2 * AA) * A ** (2 / 3));
const COEF = `$a_v = ${AV}$, $a_s = ${AS}$, $a_c = ${AC}$, $a_a = ${AA}$ MeV and $\\delta = \\pm${AP}/\\sqrt A$ MeV`;
const SEMF = '$B = a_vA - a_sA^{2/3} - a_c\\dfrac{Z(Z - 1)}{A^{1/3}} - a_a\\dfrac{(A - 2Z)^2}{A} + \\delta$';
// atomic masses in u (AME 2020)
const M = { n: 1.00866492, H1: 1.00782503, H2: 2.01410178, H3: 3.01604928, He3: 3.01602932, He4: 4.00260325, Li6: 6.01512289, Li7: 7.01600344, Be7: 7.01692872, Be8: 8.00530510, Be9: 9.01218307, B10: 10.01293695, B11: 11.00930536, C12: 12, C13: 13.00335484, C14: 14.00324199, N14: 14.00307400, N15: 15.00010890, O15: 15.00306562, O16: 15.99491462, O17: 16.99913176, O18: 17.99915961, F19: 18.99840316, Ne20: 19.99244018 };
const lab = (k) => { const [, s, a] = k.match(/^([A-Z][a-z]?)(\d+)$/); return `${'{}'}^{${a}}\\text{${s}}`; };
const SN = [['H2', 'H1'], ['He4', 'He3'], ['Li7', 'Li6'], ['Be9', 'Be8'], ['B11', 'B10'], ['C13', 'C12'], ['C14', 'C13'], ['N15', 'N14'], ['O16', 'O15'], ['O17', 'O16'], ['O18', 'O17']];
const SP = [['He3', 'H2'], ['He4', 'H3'], ['Be7', 'Li6'], ['B10', 'Be9'], ['C12', 'B11'], ['N14', 'C13'], ['N15', 'C14'], ['O16', 'N15'], ['O15', 'N14'], ['F19', 'O18']];
// odd A whose most stable Z is clearly away from a half-integer (so the stable isobar is unambiguous)
const ODD_A = [];
for (let A = 21; A <= 239; A += 2) { const f = Z0s(A) % 1; if (Math.abs(f - 0.5) > 0.22) ODD_A.push(A); }

export default {
  topic: 'binding-energy-semf',
  items: [
    // ---------- level 1 ----------
    { id: 'bse-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'liquid-drop terms',
      q: 'Which term of the semi-empirical mass formula, proportional to $A$, expresses the saturation of nuclear forces?',
      options: ['the surface term', 'the Coulomb term', 'the volume term', 'the asymmetry term'], answer: 2,
      sol: 'If every nucleon is bound only to its few nearest neighbours (short-range, saturating forces), each contributes the same binding, so $B \\propto A$: the volume term $a_vA$. If every nucleon attracted every other, $B$ would grow like $A^2$.',
      trap: 'The surface term grows as $A^{2/3}$ and reduces the binding.' },
    { id: 'bse-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'liquid-drop terms',
      q: 'The surface term $-a_sA^{2/3}$ in the mass formula reflects that',
      options: ['nucleons on the surface have fewer neighbours to bind with, and the number of them grows as the area, $\\propto R^2 \\propto A^{2/3}$', 'protons repel at the surface', 'the surface is made only of neutrons', 'surface nucleons move faster than the speed of light'], answer: 0,
      sol: 'The volume term over-counts: a nucleon at the surface has neighbours on one side only. The deficit is proportional to the number of surface nucleons, that is to the area $4\\pi R^2 \\propto A^{2/3}$. It is the nuclear version of surface tension.',
      trap: 'Coulomb repulsion has its own term, depending on $Z$.' },
    { id: 'bse-003', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'pairing',
      q: 'The pairing term $\\delta$ in the mass formula is',
      options: ['positive for every nucleus', 'zero for even-even nuclei', 'negative for odd-$A$ nuclei', 'positive for even-even, zero for odd-$A$ and negative for odd-odd nuclei'], answer: 3,
      sol: 'Two like nucleons in the same orbit coupled to $J = 0$ gain extra binding. Even-even nuclei have all nucleons paired ($\\delta > 0$), odd-$A$ nuclei one unpaired ($\\delta = 0$), and odd-odd nuclei one unpaired proton and one unpaired neutron ($\\delta < 0$ relative to the average). A common size is $|\\delta| \\approx 12/\\sqrt A$ MeV.',
      trap: 'The reference is odd $A$, not even-even.' },
    { id: 'bse-004', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'separation energy', unit: 'MeV',
      q: 'The binding energies of ${}^{12}$C and ${}^{13}$C are $92.162$ MeV and $97.108$ MeV. The neutron separation energy of ${}^{13}$C is ______ MeV (to three decimal places).',
      answer: 4.946, tol: 0.002, calc: () => 97.108 - 92.162,
      sol: 'Removing a neutron from ${}^{13}$C leaves ${}^{12}$C. $S_n = B({}^{13}\\text{C}) - B({}^{12}\\text{C}) = 97.108 - 92.162 = 4.946$ MeV, well below the average $B/A = 7.47$ MeV because the extra neutron sits alone in a new orbit.',
      trap: 'Taking $B/A$ of ${}^{13}$C as the energy to remove one nucleon.' },
    { id: 'bse-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'mass excess',
      q: 'The mass excess $\\Delta = (M - A\\,\\text{u})c^2$ is zero by definition for',
      options: ['${}^1$H', '${}^{12}$C', '${}^{16}$O', '${}^{56}$Fe'], answer: 1,
      sol: 'The atomic mass unit is defined as one twelfth of the mass of a neutral ${}^{12}$C atom, so $M({}^{12}\\text{C}) = 12$ u exactly and $\\Delta = 0$. ${}^1$H has $\\Delta = +7.289$ MeV, ${}^{56}$Fe $-60.6$ MeV. Tables list $\\Delta$ because differences of $\\Delta$ give Q values directly when $A$ balances.',
      trap: 'The unit is not based on hydrogen or oxygen (older chemistry scales used oxygen).' },
    { id: 'bse-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'liquid-drop terms',
      q: 'The asymmetry term $-a_a(N - Z)^2/A$ originates mainly from',
      options: ['Coulomb repulsion between protons', 'the surface tension of the nucleus', 'the Pauli exclusion principle: with $N \\ne Z$ one kind of nucleon must fill higher levels', 'the magnetic moments of the nucleons'], answer: 2,
      sol: 'Protons and neutrons fill separate ladders of levels. Moving nucleons from one ladder to the other to make $N \\ne Z$ puts them into higher, emptier levels and costs kinetic energy (plus some potential energy, since the $np$ force is the most attractive). The Fermi gas gives a cost $\\propto (N - Z)^2/A$.',
      trap: 'Coulomb pushes towards $N > Z$; the asymmetry term pushes back towards $N = Z$.' },

    // ---------- level 2 ----------
    { id: 'bse-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Coulomb term', unit: 'MeV',
      q: 'If nuclei are uniformly charged spheres with $R = R_0A^{1/3}$, $R_0 = 1.25$ fm, the Coulomb coefficient $a_c$ in $a_cZ(Z - 1)/A^{1/3}$ is ______ MeV (to three decimal places). Use $e^2/4\\pi\\varepsilon_0 = 1.440$ MeV fm.',
      answer: 0.691, tol: 0.002, calc: () => 0.6 * 1.44 / 1.25,
      sol: 'The electrostatic energy of a uniform sphere is $\\tfrac35Q^2/(4\\pi\\varepsilon_0R)$; counting only pairs of distinct protons replaces $Z^2$ by $Z(Z - 1)$. So $a_c = \\tfrac35\\dfrac{e^2}{4\\pi\\varepsilon_0R_0} = 0.6\\times1.440/1.25 = 0.691$ MeV, close to fitted values ($0.69$ to $0.72$ MeV).',
      trap: 'Missing the $\\tfrac35$ of a uniform sphere (or using $\\tfrac12$ for a shell).' },
    { id: 'bse-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'separation energy', unit: 'MeV',
      q: 'Atomic masses: ${}^{16}$O $15.994915$ u, ${}^{15}$N $15.000109$ u, ${}^1$H $1.007825$ u; $1$ u $= 931.494$ MeV$/c^2$. The proton separation energy of ${}^{16}$O is ______ MeV (to two decimal places).',
      answer: 12.13, tol: 0.01, calc: () => (15.000109 + 1.007825 - 15.994915) * 931.494,
      sol: '$S_p = [M({}^{15}\\text{N}) + M({}^1\\text{H}) - M({}^{16}\\text{O})]c^2 = (16.007934 - 15.994915)\\times931.494 = 0.013019\\times931.494 = 12.13$ MeV. Using the hydrogen atom (not a bare proton) keeps the electron count balanced: 8 on each side.',
      trap: 'Using the proton mass with atomic masses leaves one electron mass ($0.511$ MeV) unbalanced.' },
    { id: 'bse-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'pairing',
      q: 'Along a chain of isotopes, the neutron separation energy $S_n$ zigzags: it is larger for even $N$ than for the odd-$N$ neighbours. The main reason is',
      options: ['the Coulomb term', 'the surface term', 'the asymmetry term', 'pairing: removing a neutron from an even-$N$ nucleus breaks a pair'], answer: 3,
      sol: 'For even $N$, the last neutron is paired; removing it also costs the pairing energy. For odd $N$ the last neutron is alone and comes off more easily. The Coulomb term does not change with $N$, and the asymmetry term changes smoothly.',
      trap: 'The asymmetry term makes $S_n$ fall steadily with $N$, not zigzag.' },
    { id: 'bse-010', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'liquid-drop terms',
      q: 'For a fixed mass number $A$, which terms of the mass formula change from one isobar to another?',
      options: ['the volume term', 'the Coulomb term', 'the asymmetry term', 'the pairing term'], answer: [1, 2, 3],
      sol: 'Volume and surface depend only on $A$. The Coulomb term depends on $Z(Z - 1)$, the asymmetry term on $(A - 2Z)^2$, and the pairing term on whether $Z$ (and so $N$) is even or odd. These three shape the mass parabolas of isobars.',
      trap: 'Forgetting that for even $A$ changing $Z$ by one switches between even-even and odd-odd.' },
    { id: 'bse-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'liquid-drop terms',
      q: 'With $a_s = 18.3$ MeV, the surface term reduces the binding energy per nucleon of ${}^{27}$Al by about',
      options: ['$0.68$ MeV', '$6.1$ MeV', '$18.3$ MeV', '$2.0$ MeV'], answer: 1,
      sol: 'Per nucleon, $a_sA^{2/3}/A = a_sA^{-1/3} = 18.3/3 = 6.1$ MeV. For light nuclei this is a large fraction of the volume term (about 16 MeV); it is the main reason light nuclei are less bound per nucleon.',
      trap: 'Dividing by $A$ twice, or using $A^{2/3}$ instead of $A^{-1/3}$.' },
    { id: 'bse-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'mass parabola',
      q: 'For odd $A$, the atomic masses of isobars plotted against $Z$ lie on a single parabola. As a result,',
      options: ['there is usually exactly one beta-stable isobar', 'there are always two stable isobars', 'no odd-$A$ nucleus is stable', 'odd-$A$ nuclei decay by double beta decay'], answer: 0,
      sol: 'With $\\delta = 0$ every odd-$A$ isobar lies on the same parabola in $Z$. Nuclei on the low-$Z$ side $\\beta^-$ decay downhill, those on the high-$Z$ side $\\beta^+$ decay or capture electrons, and only the one nearest the minimum is stable. (Rare exceptions such as $A = 113, 123$ have a near-degenerate pair with one decaying extremely slowly.)',
      trap: 'Two parabolas, and so possibly two or three stable isobars, belong to even $A$.' },
    { id: 'bse-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'binding curve',
      q: 'Along the stability line the binding energy per nucleon falls slowly beyond $A \\approx 60$. In the mass formula this is because',
      options: ['the surface term per nucleon grows with $A$', 'the Coulomb energy per nucleon grows roughly as $Z^2/A^{4/3} \\propto A^{2/3}$', 'the volume term decreases', 'the pairing term becomes negative'], answer: 1,
      sol: 'Per nucleon, the surface term $a_sA^{-1/3}$ shrinks with $A$, which makes $B/A$ rise for light nuclei. The Coulomb term per nucleon $a_cZ^2/A^{4/3}$ with $Z \\approx 0.4A$ grows as $A^{2/3}$ and wins for heavy nuclei (helped by the asymmetry term as $N - Z$ grows). The maximum is where the two slopes balance.',
      trap: 'The surface term per nucleon decreases with $A$; it explains the rise, not the fall.' },
    { id: 'bse-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'separation energy', unit: 'MeV',
      q: 'Binding energies: ${}^{16}$O $127.619$ MeV, ${}^{18}$O $139.807$ MeV. The two-neutron separation energy of ${}^{18}$O is ______ MeV (to three decimal places).',
      answer: 12.188, tol: 0.002, calc: () => 139.807 - 127.619,
      sol: '$S_{2n}({}^{18}\\text{O}) = B({}^{18}\\text{O}) - B({}^{16}\\text{O}) = 12.188$ MeV. $S_{2n}$ is smooth along a chain because it removes a whole pair, so it is the preferred quantity for spotting shell closures.',
      trap: 'Halving it gives the average per neutron, not the separation energy asked for.' },
    { id: 'bse-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'liquid-drop terms',
      q: 'The fitted volume coefficient $a_v \\approx 16$ MeV, but no nucleus has $B/A$ above $8.8$ MeV. Why?',
      options: ['$a_v$ is measured for neutron stars only', 'nuclei are not saturated', 'the surface, Coulomb and asymmetry terms together take away roughly 7 to 8 MeV per nucleon', 'the pairing term is always negative'], answer: 2,
      sol: '$a_v$ is the binding per nucleon of infinite, symmetric nuclear matter without Coulomb forces. In a real nucleus near $A = 60$: surface about $4.7$, Coulomb about $2.1$, asymmetry about $0.3$ MeV per nucleon, leaving about $8.8$ MeV.',
      trap: 'Pairing is a small correction of order $12/\\sqrt A$ MeV in total, not per nucleon.' },
    { id: 'bse-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Coulomb term', unit: 'MeV',
      q: 'With $a_c = 0.714$ MeV, the Coulomb term $a_cZ(Z - 1)/A^{1/3}$ for ${}^{56}$Fe ($Z = 26$) is ______ MeV (to one decimal place).',
      answer: 121.3, tol: 0.2, calc: () => 0.714 * 26 * 25 / Math.cbrt(56),
      sol: '$Z(Z - 1) = 650$, $56^{1/3} = 3.826$. $E_C = 0.714\\times650/3.826 = 121.3$ MeV, about 2.2 MeV per nucleon of the total binding $492$ MeV.',
      trap: 'Using $A^{2/3}$ in the denominator.' },

    // ---------- level 3 ----------
    { id: 'bse-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'stability line',
      q: 'Minimising the mass formula over $Z$ at fixed $A$ (neglecting the $n$-H mass difference and using $Z^2$ for $Z(Z - 1)$) gives $Z_0 = \\dfrac{A}{2 + (a_c/2a_a)A^{2/3}}$. With $a_c = 0.714$ MeV and $a_a = 23.2$ MeV, the most stable isobar with $A = 125$ has $Z$ = ______ (nearest integer).',
      answer: 52, tol: 0, calc: () => Math.round(125 / (2 + 0.714 / 46.4 * 125 ** (2 / 3))),
      sol: '$a_c/2a_a = 0.714/46.4 = 0.01539$; $125^{2/3} = 25$. $Z_0 = 125/(2 + 0.3847) = 52.4$, so $Z = 52$ (tellurium; ${}^{125}$Te is indeed stable).',
      trap: 'Taking $Z = A/2$: the Coulomb term pushes heavy nuclei to $N > Z$.' },
    { id: 'bse-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'mass parabola',
      q: 'For even $A$, the isobars lie on two parabolas separated by $2\\delta$. A consequence is that',
      options: ['odd-odd nuclei are always stable', 'even-even nuclei always $\\beta$-decay', 'only one isobar can be stable for each even $A$', 'many odd-odd nuclei (such as ${}^{64}$Cu and ${}^{40}$K) can decay both by $\\beta^-$ and by $\\beta^+$/electron capture, to two different even-even neighbours'], answer: 3,
      sol: 'Odd-odd isobars sit on the upper parabola. An odd-odd nucleus near the bottom has both even-even neighbours below it, so both decays are open: ${}^{64}$Cu goes 39% $\\beta^-$ to ${}^{64}$Zn and 61% EC/$\\beta^+$ to ${}^{64}$Ni. On the lower parabola there can be two (occasionally three) stable even-even isobars.',
      trap: 'Only four light odd-odd nuclei (${}^2$H, ${}^6$Li, ${}^{10}$B, ${}^{14}$N) are stable.' },
    { id: 'bse-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fission', unit: 'MeV',
      q: 'A nucleus with $Z = 92$, $A = 236$ splits into two identical halves ($Z = 46$, $A = 118$). Keeping only the surface and Coulomb terms, with $a_s = 18.3$ MeV, $a_c = 0.714$ MeV and $Z^2$ in place of $Z(Z - 1)$, the energy released is ______ MeV (to the nearest MeV).',
      answer: 180, tol: 2, calc: () => 18.3 * 236 ** (2 / 3) * (1 - 2 ** (1 / 3)) + 0.714 * 92 * 92 / Math.cbrt(236) * (1 - 2 ** (-2 / 3)),
      sol: 'Volume and asymmetry terms are unchanged by a symmetric split (both linear in $A$ and $(A - 2Z)^2/A$). Surface: $E_s = a_sA^{2/3} = 18.3\\times38.19 = 698.9$ MeV becomes $2\\times698.9/2^{2/3}$, an increase of $698.9(2^{1/3} - 1) = 181.6$ MeV. Coulomb: $E_C = 0.714\\times8464/6.180 = 977.9$ MeV becomes $2\\times977.9/2^{5/3}$, a decrease of $977.9(1 - 2^{-2/3}) = 361.9$ MeV. $Q = 361.9 - 181.6 = 180$ MeV.',
      trap: 'Forgetting that each fragment has half the charge: the Coulomb energy of each is $E_C/2^{5/3}$, not $E_C/2$.' },
    { id: 'bse-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'fission',
      q: 'In the liquid-drop picture of fission, which statements are correct?',
      options: ['A small deformation raises the surface energy and lowers the Coulomb energy', 'A drop becomes unstable against any small deformation when $E_C^{(0)} > 2E_s^{(0)}$, that is $Z^2/A \\gtrsim 2a_s/a_c \\approx 50$', 'For uranium, $Z^2/A \\approx 36$, so a fission barrier of a few MeV remains', 'The fission barrier grows as $Z^2/A$ grows'], answer: [0, 1, 2],
      sol: 'For a spheroid with small deformation $\\varepsilon$: $E_s = E_s^{(0)}(1 + \\tfrac25\\varepsilon^2)$, $E_C = E_C^{(0)}(1 - \\tfrac15\\varepsilon^2)$, so $\\Delta E = \\tfrac{\\varepsilon^2}{5}(2E_s^{(0)} - E_C^{(0)})$. It is negative (no barrier) when $a_cZ^2/A^{1/3} > 2a_sA^{2/3}$, i.e. $Z^2/A > 2a_s/a_c \\approx 51$. Uranium ($92^2/238 = 35.6$) is below, with a barrier of about 6 MeV; the barrier shrinks as $Z^2/A$ grows.',
      trap: 'The barrier falls, not rises, with $Z^2/A$; that is why superheavy nuclei fission spontaneously.' },
    { id: 'bse-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'fission',
      q: 'With $a_s = 18.3$ MeV and $a_c = 0.714$ MeV (and $Z^2$ for the Coulomb term), the liquid drop loses all resistance to small deformations when $Z^2/A$ exceeds about',
      options: ['$18$', '$51$', '$36$', '$25.6$'], answer: 1,
      sol: 'Condition $E_C^{(0)} = 2E_s^{(0)}$: $a_cZ^2A^{-1/3} = 2a_sA^{2/3}$, so $Z^2/A = 2a_s/a_c = 36.6/0.714 = 51.3$. (18 is where symmetric fission first releases energy; 36 is uranium; 25.6 is $a_s/a_c$.)',
      trap: '$Q > 0$ for fission (about $Z^2/A > 18$) is not the same as having no barrier.' },
    { id: 'bse-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'mass parabola',
      q: 'Using $Z_0 = A/(2 + 0.01539A^{2/3})$, the beta-stable isobar with $A = 135$ has $Z$ equal to (Xe 54, Cs 55, Ba 56, La 57)',
      options: ['$54$ (Xe)', '$55$ (Cs)', '$56$ (Ba)', '$57$ (La)'], answer: 2,
      sol: '$135^{2/3} = 26.32$; $Z_0 = 135/(2 + 0.405) = 56.1$. For odd $A$ the one isobar nearest the minimum is stable: ${}^{135}$Ba. ${}^{135}$Xe and ${}^{135}$Cs $\\beta^-$ decay towards it, ${}^{135}$La captures electrons.',
      trap: 'Rounding $A/2.4$ or forgetting the $A^{2/3}$ dependence.' },
    { id: 'bse-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'beta Q value', unit: 'MeV',
      q: 'For odd $A$, $Q_{\\beta^-}(Z \\to Z + 1) = (m_n - m_H)c^2 + B(Z + 1, A) - B(Z, A)$. With the mass formula ($a_c = 0.714$, $a_a = 23.2$ MeV, $Z(Z - 1)$ Coulomb) and $(m_n - m_H)c^2 = 0.782$ MeV, $Q_{\\beta^-}$ for $A = 135$, $Z = 53 \\to 54$ is ______ MeV (to two decimal places).',
      answer: 5.27, tol: 0.03, calc: () => 0.782 - 2 * 0.714 * 53 / Math.cbrt(135) + 23.2 * 4 * (135 - 106 - 1) / 135,
      sol: 'Volume, surface and (odd $A$) pairing cancel. Coulomb: $-a_c[(Z + 1)Z - Z(Z - 1)]/A^{1/3} = -2a_cZ/A^{1/3} = -2\\times0.714\\times53/5.130 = -14.75$ MeV. Asymmetry: $-a_a[(A - 2Z - 2)^2 - (A - 2Z)^2]/A = 4a_a(A - 2Z - 1)/A = 4\\times23.2\\times28/135 = 19.25$ MeV. $Q = 0.782 - 14.75 + 19.25 = 5.27$ MeV (the measured value for ${}^{135}$I is $2.6$ MeV: the formula is rough this far from the minimum).',
      trap: 'Dropping the $n$-H mass difference, which matters whenever atomic masses are used.' },
    { id: 'bse-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'liquid-drop terms',
      q: 'In the Fermi gas picture, why is the asymmetry energy proportional to $(N - Z)^2/A$ rather than to $(N - Z)^2$?',
      options: ['the spacing of single-particle levels near the Fermi energy shrinks as $1/A$, so each transferred nucleon costs less in a bigger nucleus', 'the Coulomb energy cancels part of it', 'the surface grows as $A^{2/3}$', 'the nuclear force weakens with distance'], answer: 0,
      sol: 'Moving $k = (N - Z)/2$ nucleons from one ladder to the other raises each by about $k$ level spacings $\\Delta$, a total of $\\sim k^2\\Delta$. With $\\Delta \\propto E_F/A$ (more levels below a fixed $E_F$ in a bigger nucleus), the cost is $\\propto (N - Z)^2/A$.',
      trap: 'Thinking of it as an interaction between all pairs, which would give a different $A$ dependence.' },
    { id: 'bse-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'pairing', unit: 'MeV',
      q: 'Three neighbouring isotopes of an element have binding energies $B(N - 1) = 1002.40$ MeV, $B(N) = 1011.95$ MeV ($N$ even) and $B(N + 1) = 1018.50$ MeV. The neutron pairing gap $\\Delta = \\tfrac12[2B(N) - B(N - 1) - B(N + 1)]$ is ______ MeV (to two decimal places).',
      answer: 1.50, tol: 0.01, calc: () => (2 * 1011.95 - 1002.40 - 1018.50) / 2,
      sol: '$S_n(N) = 1011.95 - 1002.40 = 9.55$ MeV, $S_n(N + 1) = 1018.50 - 1011.95 = 6.55$ MeV. $\\Delta = \\tfrac12(9.55 - 6.55) = 1.50$ MeV, close to $12/\\sqrt A$ for $A \\approx 64$; for real heavy nuclei it is about 1 MeV.',
      trap: 'Forgetting the factor $\\tfrac12$: the zigzag in $S_n$ is twice the gap.' },
    { id: 'bse-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'limits of the model',
      q: 'The mass formula with standard coefficients predicts $B/A \\approx 5$ MeV for ${}^4$He, while the measured value is $7.07$ MeV. The best explanation is',
      options: ['the Coulomb term is wrong for $Z = 2$', '${}^4$He is a doubly closed (doubly magic) system of two protons and two neutrons in the lowest $s$ orbit, an effect outside the liquid-drop model', 'the volume coefficient is larger for light nuclei', 'the pairing term is negative for ${}^4$He'], answer: 1,
      sol: 'The liquid drop has no shells. ${}^4$He fills the $1s_{1/2}$ level for both protons and neutrons, and its tight binding (with $S_n \\approx 20.6$ MeV) is a shell effect. The same extra binding at magic numbers (${}^{16}$O, ${}^{40}$Ca, ${}^{208}$Pb) motivates the shell model.',
      trap: 'Pairing is already positive for ${}^4$He and is far too small to explain 8 MeV of extra binding.' },
    { id: 'bse-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'separation energy',
      q: 'Which statements about separation energies are correct?',
      options: ['$S_n$ drops sharply for the first neutron added beyond a magic number', 'Towards neutron-rich isotopes $S_n$ falls towards zero, which defines the neutron drip line', '$S_p$ is always larger than $S_n$ in the same nucleus', 'For an odd-$N$ nucleus $S_n$ is usually smaller than for its even-$N$ neighbours'], answer: [0, 1, 3],
      sol: 'After a shell closure the next neutron goes into a new, higher shell, so $S_n$ jumps down (${}^{208}$Pb 7.37 MeV, ${}^{209}$Pb 3.94 MeV). Adding neutrons raises the neutron Fermi level until $S_n \\to 0$ (drip line). Pairing makes odd-$N$ values smaller. $S_p$ is smaller than $S_n$ on the proton-rich side (${}^{8}$B has $S_p = 0.14$ MeV), so statement three fails.',
      trap: 'Coulomb repulsion helps remove protons; on the proton-rich side $S_p$ is the smaller one.' },
    { id: 'bse-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'mass excess', unit: 'MeV',
      q: 'The atomic mass of ${}^{56}$Fe is $55.934936$ u. With $1$ u $= 931.494$ MeV$/c^2$, its mass excess is ______ MeV (to two decimal places).',
      answer: -60.61, tol: 0.01, calc: () => (55.934936 - 56) * 931.494,
      sol: '$\\Delta = (M - A)\\times931.494 = (55.934936 - 56)\\times931.494 = -0.065064\\times931.494 = -60.61$ MeV. A negative mass excess means the atom weighs less than $A$ units, as for most medium nuclei.',
      trap: 'Dropping the sign: the mass excess is negative here.' },

    // ---------- level 4 ----------
    { id: 'bse-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'mass formula', unit: 'MeV',
      q: `Use ${SEMF} with ${COEF} ($+$ for even-even). For ${'{}'}^{120}$Sn ($Z = 50$), $B/A$ is ______ MeV (to two decimal places).`,
      answer: 8.50, tol: 0.02, calc: () => BE(50, 120) / 120,
      sol: '$A^{1/3} = 4.932$, $A^{2/3} = 24.33$. Volume $1896.0$; surface $-445.2$; Coulomb $-0.714\\times2450/4.932 = -354.7$; asymmetry $-23.2\\times400/120 = -77.3$; pairing $+12/\\sqrt{120} = +1.10$. $B = 1019.9$ MeV, $B/A = 8.50$ MeV (measured $8.505$ MeV).',
      trap: 'Using $(N - Z)$ in place of $(N - Z)^2$, or forgetting the pairing sign for even-even.' },
    { id: 'bse-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'mass parabola',
      q: 'For even $A$ with $\\delta = \\pm a_p/\\sqrt A$, the vertical separation between the odd-odd and even-even mass parabolas is',
      options: ['$a_p/\\sqrt A$', 'zero', '$a_p/A$', '$2a_p/\\sqrt A$'], answer: 3,
      sol: 'Even-even nuclei are bound more by $\\delta$, odd-odd less by $\\delta$, so their masses differ by $2\\delta = 2a_p/\\sqrt A$ at the same $Z$ (about 2.4 MeV for $A = 100$ with $a_p = 12$ MeV). This gap is what can make a single $\\beta$ step from an even-even nucleus uphill while a double step is downhill.',
      trap: 'Each family is shifted by $\\delta$ in opposite directions, so the gap is $2\\delta$.' },
    { id: 'bse-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'alpha Q value', unit: 'MeV',
      q: `Using ${SEMF} with ${COEF} for the heavy nuclei and the measured $B({}^4\\text{He}) = 28.296$ MeV, the alpha-decay energy $Q_\\alpha$ of ${'{}'}^{238}$U ($Z = 92$) is ______ MeV (to one decimal place).`,
      answer: 4.6, tol: 0.1, calc: () => BE(90, 234) + 28.296 - BE(92, 238),
      sol: '$Q_\\alpha = B(90, 234) + B({}^4\\text{He}) - B(92, 238)$. The formula gives $B(92, 238) = 3760.4 - 702.8 - 964.6 - 284.2 + 0.8 = 1809.6$ MeV and $B(90, 234) = 3697.2 - 694.9 - 928.1 - 289.1 + 0.8 = 1785.9$ MeV, so $Q_\\alpha = 1785.9 + 28.3 - 1809.6 = 4.6$ MeV, close to the measured $4.27$ MeV. Alpha emission is energetically allowed for heavy nuclei because ${}^4$He is so tightly bound.',
      trap: 'Using the formula for ${}^4$He as well: it under-binds helium by about 8 MeV and gives the wrong sign.' },
    { id: 'bse-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'mass parabola',
      q: 'Which statements about beta stability of even-$A$ isobars are correct?',
      options: ['Two even-even isobars, two units apart in $Z$, can both be stable against single beta decay', 'Apart from ${}^2$H, ${}^6$Li, ${}^{10}$B and ${}^{14}$N, no odd-odd nucleus is stable', 'An even-even nucleus whose single-beta daughter lies higher in mass can still decay by double beta decay to the next even-even isobar', 'Every even $A$ has exactly one stable isobar'], answer: [0, 1, 2],
      sol: 'On the lower (even-even) parabola, two neighbouring members separated by an odd-odd isobar (higher by about $2\\delta$) can both be stable against single beta decay, as ${}^{76}$Ge and ${}^{76}$Se are. The heavier one can still go by second-order double beta decay, with half-lives above $10^{19}$ years. Many even $A$ have two or three stable isobars, so statement four fails.',
      trap: 'Single-$\\beta$ stability does not forbid $\\beta\\beta$ decay.' },
    { id: 'bse-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Coulomb term',
      q: 'If the fitted Coulomb coefficient is $a_c = 0.714$ MeV and nuclei are uniform spheres, the implied radius parameter $R_0$ is ($e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm)',
      options: ['$2.02$ fm', '$0.71$ fm', '$1.44$ fm', '$1.21$ fm'], answer: 3,
      sol: '$a_c = \\tfrac35\\dfrac{e^2}{4\\pi\\varepsilon_0R_0}$, so $R_0 = 0.6\\times1.44/0.714 = 1.21$ fm, agreeing with electron scattering. This agreement is a nice consistency check of the liquid-drop picture.',
      trap: 'Dropping the $\\tfrac35$ gives $2.02$ fm.' },
    { id: 'bse-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'fission',
      q: 'A liquid drop is deformed into a spheroid with small parameter $\\varepsilon$ at constant volume. Its energy changes by',
      options: ['$\\Delta E = \\tfrac{\\varepsilon^2}{5}(2E_s^{(0)} - E_C^{(0)})$', '$\\Delta E = \\tfrac{\\varepsilon^2}{5}(E_s^{(0)} - 2E_C^{(0)})$', '$\\Delta E = \\varepsilon(E_s^{(0)} - E_C^{(0)})$', '$\\Delta E = \\tfrac{2\\varepsilon^2}{5}(E_s^{(0)} + E_C^{(0)})$'], answer: 0,
      sol: 'To second order, the surface area grows: $E_s = E_s^{(0)}(1 + \\tfrac25\\varepsilon^2)$, and charges move apart: $E_C = E_C^{(0)}(1 - \\tfrac15\\varepsilon^2)$. Adding: $\\Delta E = \\tfrac{\\varepsilon^2}5(2E_s^{(0)} - E_C^{(0)})$. No linear term appears because the sphere is an extremum.',
      trap: 'A term linear in $\\varepsilon$ would make the sphere unstable for one sign of deformation.' },
    { id: 'bse-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'separation energy', unit: 'MeV',
      q: `Using ${SEMF} with ${COEF}, the neutron separation energy of ${'{}'}^{208}$Pb ($Z = 82$), $S_n = B(82, 208) - B(82, 207)$, is ______ MeV (to one decimal place).`,
      answer: 7.2, tol: 0.1, calc: () => BE(82, 208) - BE(82, 207),
      sol: 'Volume $+15.8$; surface $-18.3(208^{2/3} - 207^{2/3}) = -18.3\\times0.1126 = -2.06$; Coulomb $-0.714[6642\\times208^{-1/3} - 6642\\times207^{-1/3}] = +1.29$ (the extra neutron enlarges the nucleus and eases the repulsion); asymmetry $-23.2(44^2/208 - 43^2/207) = -23.2\\times0.3756 = -8.71$; pairing $+12/\\sqrt{208} = +0.83$ (${}^{207}$Pb has none). Total $7.2$ MeV (measured $7.37$ MeV).',
      trap: 'Forgetting that ${}^{208}$Pb has the pairing bonus and ${}^{207}$Pb does not.' },
    { id: 'bse-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Coulomb term',
      q: 'The Coulomb term is written with $Z(Z - 1)$ rather than $Z^2$ because',
      options: ['the nucleus is not a perfect sphere', 'protons are partly neutral', 'a single proton does not repel itself: the energy counts the $Z(Z - 1)/2$ distinct pairs', 'of the pairing between protons'], answer: 2,
      sol: 'Smearing $Ze$ uniformly includes the self-energy of each proton smeared over the whole volume. Counting only distinct pairs, $Z(Z - 1)/2$, removes it. The difference matters for light nuclei: for $Z = 1$ there should be no Coulomb energy at all.',
      trap: 'For heavy nuclei the difference is only about 1%, so either form appears in exam questions; read which one is given.' },

    // ---------- level 5 ----------
    { id: 'bse-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'stability line',
      q: 'Minimise the atomic mass $M(Z, A) = Zm_H + (A - Z)m_n - B/c^2$ over $Z$ at fixed odd $A$, with $B$ containing $-a_cZ(Z - 1)/A^{1/3} - a_a(A - 2Z)^2/A$, $a_c = 0.714$ MeV, $a_a = 23.2$ MeV and $(m_n - m_H)c^2 = 0.782$ MeV. For $A = 199$, the minimum is at $Z_0$ = ______ (to two decimal places).',
      answer: 79.60, tol: 0.03, calc: () => { const c = Math.cbrt(199); return (4 * 23.2 + 0.782 + 0.714 / c) / (2 * 0.714 / c + 8 * 23.2 / 199); },
      sol: '$\\partial(Mc^2)/\\partial Z = -0.782 + a_c(2Z - 1)/A^{1/3} - 4a_a(A - 2Z)/A = 0$ gives $Z_0 = \\dfrac{4a_a + 0.782 + a_cA^{-1/3}}{2a_cA^{-1/3} + 8a_a/A}$. With $A^{1/3} = 5.838$: numerator $92.8 + 0.782 + 0.1223 = 93.70$, denominator $0.2446 + 0.9327 = 1.1773$, $Z_0 = 79.60$. The nearest integer is 80, and ${}^{199}$Hg is indeed the stable $A = 199$ isobar.',
      trap: 'The $n$-H mass difference pushes $Z_0$ up slightly: a proton plus electron is lighter than a neutron.' },
    { id: 'bse-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'limits of the model',
      q: 'Which statements about the semi-empirical mass formula are correct?',
      options: ['Its maximum of $B/A$ near $A \\approx 60$ comes from the competition between the falling surface term per nucleon and the rising Coulomb term per nucleon', 'It fits most measured masses to within a few MeV, but under-binds nuclei at magic numbers', 'The volume coefficient corresponds to the binding per nucleon of infinite symmetric nuclear matter without Coulomb forces', 'The asymmetry coefficient is entirely potential energy, with no kinetic part'], answer: [0, 1, 2],
      sol: 'Statements one and three restate the meaning of the terms. Shell closures add 2 to 5 MeV of binding the smooth formula cannot capture, so magic nuclei sit above it. The Fermi gas shows about half of $a_a$ is kinetic (Pauli), the rest coming from the stronger $np$ attraction.',
      trap: 'The asymmetry term exists even without any interaction difference: it is a Pauli effect.' },
    { id: 'bse-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'fission',
      q: 'Keep only the surface and Coulomb terms (with $Z^2$), $a_s = 18.3$ MeV, $a_c = 0.714$ MeV. Symmetric fission into two equal halves releases energy only if $Z^2/A$ exceeds ______ (to one decimal place).',
      answer: 18.0, tol: 0.1, calc: () => 18.3 / 0.714 * (2 ** (1 / 3) - 1) / (1 - 2 ** (-2 / 3)),
      sol: '$Q = a_cZ^2A^{-1/3}(1 - 2^{-2/3}) - a_sA^{2/3}(2^{1/3} - 1) > 0$ requires $\\dfrac{Z^2}{A} > \\dfrac{a_s}{a_c}\\cdot\\dfrac{2^{1/3} - 1}{1 - 2^{-2/3}} = 25.63\\times\\dfrac{0.2599}{0.3700} = 18.0$. That happens near $A \\approx 90$ along the stability line: fission is exothermic for all heavier nuclei but blocked by a barrier.',
      trap: 'Confusing this with the no-barrier limit $2a_s/a_c \\approx 51$.' },
    { id: 'bse-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'binding curve',
      q: 'Along the line of stability (use the continuous $Z_0$ from minimising the mass, with $a_v = 15.8$, $a_s = 18.3$, $a_c = 0.714$, $a_a = 23.2$ MeV, $Z(Z - 1)$ Coulomb, no pairing, and $(m_n - m_H)c^2 = 0.782$ MeV), $B/A$ is largest at $A \\approx$ ______ (integer; within 3).',
      answer: 63, tol: 3, calc: () => { let best = 0, bA = 0; for (let A = 10; A <= 250; A++) { const c = Math.cbrt(A), z = (4 * 23.2 + 0.782 + 0.714 / c) / (2 * 0.714 / c + 8 * 23.2 / A); const b = (15.8 * A - 18.3 * c * c - 0.714 * z * (z - 1) / c - 23.2 * (A - 2 * z) ** 2 / A) / A; if (b > best) { best = b; bA = A; } } return bA; },
      sol: 'Scanning $A$ (or setting $d(B/A)/dA = 0$) with $Z = Z_0(A)$, the maximum is broad and sits at $A \\approx 60$ to $65$ with $B/A \\approx 8.76$ MeV. Roughly: $d/dA$ of $a_sA^{-1/3}$ equals $d/dA$ of the Coulomb-plus-asymmetry energy per nucleon there. The measured maximum is at ${}^{62}$Ni (8.795 MeV), with ${}^{58}$Fe and ${}^{56}$Fe just below.',
      trap: 'The curve is very flat near the top; anywhere from about 56 to 66 is "the peak" within the formula\'s accuracy.' },
    { id: 'bse-041', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'double beta decay', unit: 'MeV',
      q: 'Atomic masses: ${}^{76}$Ge $75.921403$ u, ${}^{76}$Se $75.919214$ u. The $Q$ value for double beta decay ${}^{76}\\text{Ge} \\to {}^{76}\\text{Se} + 2e^- + 2\\bar\\nu_e$ is ______ MeV (to two decimal places). Use $1$ u $= 931.494$ MeV$/c^2$.',
      answer: 2.04, tol: 0.01, calc: () => (75.921403 - 75.919214) * 931.494,
      sol: 'With atomic masses the two emitted electrons are accounted for by the two extra atomic electrons of Se, so $Q_{\\beta\\beta} = [M({}^{76}\\text{Ge}) - M({}^{76}\\text{Se})]c^2 = 0.002189\\times931.494 = 2.04$ MeV. The intermediate ${}^{76}$As lies higher, so single beta decay is forbidden and ${}^{76}$Ge lives about $2\\times10^{21}$ years.',
      trap: 'Subtracting two electron masses: that is needed for $\\beta^+$ with atomic masses, not $\\beta^-$.' },
    { id: 'bse-042', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'binding curve',
      q: 'Judging from the binding energy per nucleon curve, which processes release energy?',
      options: ['${}^2\\text{H} + {}^2\\text{H} \\to {}^4\\text{He}$', '${}^{56}\\text{Fe} \\to 2\\,{}^{28}\\text{Si}$', '${}^{238}\\text{U} \\to$ two nuclei with $A \\approx 119$', '$2\\,{}^{56}\\text{Fe} \\to {}^{112}\\text{Cd}$'], answer: [0, 2],
      sol: 'Energy is released when the products have a larger total binding: moving towards the peak near $A = 60$. Deuterium fusion (1.11 to 7.07 MeV per nucleon) and uranium fission (7.6 to about 8.5) do. Splitting iron or fusing two irons moves away from the peak and absorbs energy.',
      trap: 'Fusion is not always exothermic: beyond iron it costs energy.' },
    { id: 'bse-043', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'pairing',
      q: 'Which statements about the pairing energy are correct?',
      options: ['Its size is roughly $12/\\sqrt A$ MeV, about 1 MeV in heavy nuclei', 'It explains why only four stable odd-odd nuclei exist', 'It gives odd-$A$ isobars two separate mass parabolas', 'It causes the odd-even zigzag of neutron separation energies'], answer: [0, 1, 3],
      sol: 'Pairing lifts odd-odd nuclei above their even-even neighbours by about $2\\delta$, so they nearly always have a downhill decay. It produces the zigzag in $S_n$ and $S_p$. Odd-$A$ isobars all have $\\delta = 0$, so they share one parabola; two parabolas belong to even $A$.',
      trap: 'Mixing up which $A$ has two parabolas.' },
  ],
  gens: [
    { id: 'bse-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'separation energy',
      make(r) {
        const isN = r() < 0.5, [X, Y] = choose(r, isN ? SN : SP);
        const S = (M[Y] + (isN ? M.n : M.H1) - M[X]) * U;
        return { q: `Atomic masses: $${lab(X)}$ $${M[X].toFixed(6)}$ u, $${lab(Y)}$ $${M[Y].toFixed(6)}$ u, ${isN ? `neutron $${M.n.toFixed(6)}$ u` : `${'$'}{}^1$H $${M.H1.toFixed(6)}$ u`}; $1$ u $= 931.494$ MeV$/c^2$. The ${isN ? 'neutron' : 'proton'} separation energy of $${lab(X)}$ is ______ MeV (to two decimal places).`,
          answer: round(S, 2), tol: 0.01, unit: 'MeV', X, Y, isN,
          sol: `$S_${isN ? 'n' : 'p'} = [M(${lab(Y)}) + ${isN ? 'm_n' : 'M({}^1\\text{H})'} - M(${lab(X)})]c^2 = (${(M[Y] + (isN ? M.n : M.H1)).toFixed(6)} - ${M[X].toFixed(6)})\\times931.494 = ${round(S, 2)}$ MeV.${isN ? '' : ' The hydrogen atom keeps the electron count balanced.'}`,
          trap: isN ? 'Using the binding energy per nucleon instead of the energy to remove the last neutron.' : 'Using the bare proton mass with atomic masses.' };
      },
      verify: (p) => (M[p.Y] + (p.isN ? M.n : M.H1) - M[p.X]) * U },
    { id: 'bse-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Coulomb term',
      make(r) {
        const A = int(r, 20, 240), Z = Math.round(Z0s(A)), ac = choose(r, [0.69, 0.70, 0.711, 0.714, 0.72]), E = ac * Z * (Z - 1) / Math.cbrt(A);
        return { q: `With $a_c = ${ac}$ MeV, the Coulomb term $a_cZ(Z - 1)/A^{1/3}$ for a nucleus with $Z = ${Z}$, $A = ${A}$ is ______ MeV (to one decimal place).`,
          answer: round(E, 1), tol: Math.max(0.1, round(E * 0.003, 2)), unit: 'MeV', A, Z, ac,
          sol: `$Z(Z - 1) = ${Z * (Z - 1)}$, $A^{1/3} = ${round(Math.cbrt(A), 4)}$, so $E_C = ${ac}\\times${Z * (Z - 1)}/${round(Math.cbrt(A), 4)} = ${round(E, 1)}$ MeV, or ${round(E / A, 2)} MeV per nucleon.`,
          trap: 'Dividing by $A^{2/3}$ instead of $A^{1/3}$.' };
      },
      verify: (p) => p.ac * p.Z * (p.Z - 1) / Math.cbrt(p.A) },
    { id: 'bse-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'stability line',
      make(r) {
        const A = int(r, 20, 250), z = Z0s(A);
        return { q: `Using $Z_0 = \\dfrac{A}{2 + (a_c/2a_a)A^{2/3}}$ with $a_c = ${AC}$ MeV and $a_a = ${AA}$ MeV, the most stable charge for $A = ${A}$ is $Z_0$ = ______ (to one decimal place).`,
          answer: round(z, 1), tol: 0.1, A,
          sol: `$a_c/2a_a = ${round(AC / (2 * AA), 5)}$ and $A^{2/3} = ${round(A ** (2 / 3), 3)}$, so $Z_0 = ${A}/(2 + ${round(AC / (2 * AA) * A ** (2 / 3), 4)}) = ${round(z, 1)}$. ${A > 40 ? `That is $N/Z = ${round((A - z) / z, 2)}$: heavy nuclei need extra neutrons to dilute the Coulomb repulsion.` : 'Light nuclei sit close to $N = Z$.'}`,
          trap: 'Taking $Z = A/2$.' };
      },
      verify: (p) => Z0s(p.A) },
    { id: 'bse-g04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'mass parabola',
      make(r) {
        const A = choose(r, ODD_A), z = Z0s(A), Zs = Math.round(z), off = int(r, 0, 3);
        const opts = [0, 1, 2, 3].map((i) => Zs - off + i), options = opts.map((v) => `$Z = ${v}$`);
        return { q: `For odd $A = ${A}$, using $Z_0 = A/(2 + ${round(AC / (2 * AA), 5)}A^{2/3})$, which isobar is beta-stable?`, options, answer: off,
          sol: `$Z_0 = ${A}/(2 + ${round(AC / (2 * AA) * A ** (2 / 3), 4)}) = ${round(z, 2)}$. For odd $A$ there is one mass parabola and the isobar nearest its minimum, $Z = ${Zs}$, is stable. Lower $Z$ decays by $\\beta^-$, higher $Z$ by $\\beta^+$ or electron capture.`,
          trap: 'Rounding $A/2$ instead of using the Coulomb-shifted minimum.', A };
      } },
    { id: 'bse-g05', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'mass formula',
      make(r) {
        const A = int(r, 30, 240), Z = Math.round(Z0s(A)) + int(r, -1, 1), b = BE(Z, A);
        const kind = A % 2 ? 'odd $A$, $\\delta = 0$' : Z % 2 ? 'odd-odd, $\\delta < 0$' : 'even-even, $\\delta > 0$';
        return { q: `Use ${SEMF} with ${COEF}. For $Z = ${Z}$, $A = ${A}$ (${kind}), the binding energy per nucleon is ______ MeV (to two decimal places).`,
          answer: round(b / A, 2), tol: 0.02, unit: 'MeV', Z, A,
          sol: `$A^{1/3} = ${round(Math.cbrt(A), 4)}$. Volume $${round(AV * A, 1)}$; surface $-${round(AS * A ** (2 / 3), 1)}$; Coulomb $-${round(AC * Z * (Z - 1) / Math.cbrt(A), 1)}$; asymmetry $-${round(AA * (A - 2 * Z) ** 2 / A, 2)}$; pairing $${round(pair(Z, A), 2)}$. $B = ${round(b, 1)}$ MeV and $B/A = ${round(b / A, 2)}$ MeV.`,
          trap: 'Getting the pairing sign wrong, or using $A^{2/3}$ in the Coulomb term.' };
      },
      verify: (p) => BE(p.Z, p.A) / p.A },
    { id: 'bse-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'beta Q value',
      make(r) {
        const A = choose(r, ODD_A.filter((a) => a > 40)), Z = Math.round(Z0s(A)) - int(r, 1, 4);
        const Q = DNH + BE(Z + 1, A) - BE(Z, A);
        return { q: `For odd $A = ${A}$, find $Q_{\\beta^-}$ for $Z = ${Z} \\to ${Z + 1}$ from the mass formula: $Q = (m_n - m_H)c^2 + B(Z + 1, A) - B(Z, A)$ with $a_c = ${AC}$ MeV, $a_a = ${AA}$ MeV, $Z(Z - 1)$ Coulomb and $(m_n - m_H)c^2 = 0.782$ MeV. $Q$ = ______ MeV (to two decimal places).`,
          answer: round(Q, 2), tol: 0.03, unit: 'MeV', A, Z,
          sol: `Only Coulomb and asymmetry change. Coulomb: $-2a_cZ/A^{1/3} = -${round(2 * AC * Z / Math.cbrt(A), 3)}$ MeV. Asymmetry: $+4a_a(A - 2Z - 1)/A = ${round(4 * AA * (A - 2 * Z - 1) / A, 3)}$ MeV. $Q = 0.782 - ${round(2 * AC * Z / Math.cbrt(A), 3)} + ${round(4 * AA * (A - 2 * Z - 1) / A, 3)} = ${round(Q, 2)}$ MeV.`,
          trap: 'Forgetting $(m_n - m_H)c^2$, or using $(A - 2Z)$ instead of $(A - 2Z - 1)$ from the difference of squares.' };
      },
      verify: (p) => DNH - 2 * AC * p.Z / Math.cbrt(p.A) + 4 * AA * (p.A - 2 * p.Z - 1) / p.A },
    { id: 'bse-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fission',
      make(r) {
        const Z = 2 * int(r, 40, 52), A = 2 * Math.round((Z * 2.55) / 2), Q = AS * A ** (2 / 3) * (1 - 2 ** (1 / 3)) + AC * Z * Z / Math.cbrt(A) * (1 - 2 ** (-2 / 3));
        return { q: `A nucleus with $Z = ${Z}$, $A = ${A}$ splits into two identical halves. Keeping only the surface and Coulomb terms ($a_s = ${AS}$ MeV, $a_c = ${AC}$ MeV, $Z^2$ form), the energy released is ______ MeV (to the nearest MeV).`,
          answer: Math.round(Q), tol: 2, unit: 'MeV', Z, A,
          sol: `Surface rises by $a_sA^{2/3}(2^{1/3} - 1) = ${round(AS * A ** (2 / 3) * (2 ** (1 / 3) - 1), 1)}$ MeV; Coulomb falls by $a_cZ^2A^{-1/3}(1 - 2^{-2/3}) = ${round(AC * Z * Z / Math.cbrt(A) * (1 - 2 ** (-2 / 3)), 1)}$ MeV. $Q = ${Math.round(Q)}$ MeV.`,
          trap: 'Each fragment keeps a Coulomb energy $E_C/2^{5/3}$, not $E_C/4$.' };
      },
      verify: (p) => AS * p.A ** (2 / 3) * (1 - 2 ** (1 / 3)) + AC * p.Z * p.Z / Math.cbrt(p.A) * (1 - 2 ** (-2 / 3)) },
    { id: 'bse-g08', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'liquid-drop terms',
      make(r) {
        const T = [['volume', 'is proportional to $A$ and expresses saturation'], ['surface', 'is proportional to $A^{2/3}$ and counts nucleons with fewer neighbours'], ['Coulomb', 'is proportional to $Z(Z - 1)/A^{1/3}$'], ['asymmetry', 'is proportional to $(N - Z)^2/A$ and comes from the Pauli principle'], ['pairing', 'is positive for even-even, zero for odd $A$ and negative for odd-odd nuclei'], ['Coulomb', 'pushes the stability line towards $N > Z$ in heavy nuclei'], ['surface', 'makes light nuclei less bound per nucleon'], ['asymmetry', 'vanishes when $N = Z$']];
        const [name, desc] = choose(r, T);
        const o = mcqOptions(r, name, ['volume', 'surface', 'Coulomb', 'asymmetry', 'pairing'].filter((x) => x !== name), (v) => `the ${v} term`);
        return { q: `In the semi-empirical mass formula, which term ${desc}?`, ...o,
          sol: `It is the ${name} term. Summary: volume $+a_vA$; surface $-a_sA^{2/3}$; Coulomb $-a_cZ(Z - 1)/A^{1/3}$; asymmetry $-a_a(N - Z)^2/A$; pairing $\\pm\\delta$ or 0.`,
          trap: 'The surface and Coulomb terms both reduce binding but depend on different quantities.', name };
      } },
    { id: 'bse-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'pairing',
      make(r) {
        const B0 = pick(r, 400, 1600, 0.05), Se = pick(r, 7.5, 11.5, 0.05), gap = pick(r, 0.8, 2.2, 0.05), So = round(Se - 2 * gap - pick(r, 0, 0.3, 0.05), 2);
        const B1 = round(B0 + Se, 2), B2 = round(B1 + So, 2), D = (2 * B1 - B0 - B2) / 2;
        return { q: `Three neighbouring isotopes have binding energies $B(N - 1) = ${B0.toFixed(2)}$ MeV, $B(N) = ${B1.toFixed(2)}$ MeV ($N$ even) and $B(N + 1) = ${B2.toFixed(2)}$ MeV. The neutron pairing gap $\\Delta = \\tfrac12[2B(N) - B(N - 1) - B(N + 1)]$ is ______ MeV (to two decimal places).`,
          answer: round(D, 2), tol: 0.01, unit: 'MeV', B0, B1, B2,
          sol: `$S_n(N) = ${round(B1 - B0, 2)}$ MeV and $S_n(N + 1) = ${round(B2 - B1, 2)}$ MeV. $\\Delta = \\tfrac12(${round(B1 - B0, 2)} - ${round(B2 - B1, 2)}) = ${round(D, 2)}$ MeV.`,
          trap: 'Reporting the full difference of separation energies, which is $2\\Delta$.' };
      },
      verify: (p) => (2 * p.B1 - p.B0 - p.B2) / 2 },
    { id: 'bse-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'fission',
      make(r) {
        const Z = int(r, 82, 100), A = 2 * Math.round(Z * 1.27), e = choose(r, [0.05, 0.08, 0.1, 0.12, 0.15]);
        const Es = AS * A ** (2 / 3), Ec = AC * Z * Z / Math.cbrt(A), dE = e * e / 5 * (2 * Es - Ec);
        return { q: `A nucleus with $Z = ${Z}$, $A = ${A}$ is deformed at constant volume into a spheroid with $\\varepsilon = ${e}$. With $E_s = a_sA^{2/3}$, $E_C = a_cZ^2/A^{1/3}$, $a_s = ${AS}$ MeV and $a_c = ${AC}$ MeV, the liquid-drop energy rises by ______ MeV (to two decimal places).`,
          answer: round(dE, 2), tol: Math.max(0.01, round(Math.abs(dE) * 0.005, 3)), unit: 'MeV', Z, A, e,
          sol: `$E_s = ${round(Es, 1)}$ MeV, $E_C = ${round(Ec, 1)}$ MeV. $\\Delta E = \\tfrac{\\varepsilon^2}5(2E_s - E_C) = \\tfrac{${e}^2}{5}\\times${round(2 * Es - Ec, 1)} = ${round(dE, 2)}$ MeV. $Z^2/A = ${round(Z * Z / A, 1)}$ is below $2a_s/a_c = 51$, so the sphere is stable but the restoring energy is small.`,
          trap: 'Using $E_s - E_C$: the surface coefficient is $\\tfrac25$ and the Coulomb one $\\tfrac15$.' };
      },
      verify: (p) => p.e * p.e / 5 * (2 * AS * p.A ** (2 / 3) - AC * p.Z * p.Z / Math.cbrt(p.A)) },
    { id: 'bse-g11', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'mass excess',
      make(r) {
        const k = choose(r, Object.keys(M).filter((x) => x !== 'n' && x !== 'C12')), A = +k.match(/\d+/)[0], D = (M[k] - A) * U;
        return { q: `The atomic mass of $${lab(k)}$ is $${M[k].toFixed(6)}$ u. With $1$ u $= 931.494$ MeV$/c^2$, its mass excess $\\Delta = (M - A\\,\\text{u})c^2$ is ______ MeV (to three decimal places).`,
          answer: round(D, 3), tol: 0.002, unit: 'MeV', k,
          sol: `$\\Delta = (${M[k].toFixed(6)} - ${A})\\times931.494 = ${round(M[k] - A, 6)}\\times931.494 = ${round(D, 3)}$ MeV.`,
          trap: 'Dropping the sign when the mass is below $A$ u.' };
      },
      verify: (p) => (M[p.k] - +p.k.match(/\d+/)[0]) * U },
  ],
};
