// Group theory for physicists (CSIR NET Part C, some GATE): group axioms, orders and Lagrange's theorem, cyclic and
// abelian groups, conjugacy classes, subgroups and homomorphisms, representations and characters (C3v / S3, D4, Q8,
// S4), the orthogonality theorem and reducing representations, Lie groups SO(N), SU(N), U(N), generators and
// commutators, SU(2) addition of angular momenta and SU(3) multiplets. Original questions for fibub.
import { int, choose, mcqOptions, round } from '../_util.js';

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const C3V = 'The character table of $C_{3v}$ (isomorphic to $S_3$), with classes $E$, $2C_3$, $3\\sigma_v$, is: $A_1$: $(1, 1, 1)$; $A_2$: $(1, 1, -1)$; $E$: $(2, -1, 0)$.';
const RED = 'The number of times irrep $i$ appears is $n_i = \\dfrac{1}{|G|}\\sum_{\\text{classes}} N_k\\,\\chi(C_k)\\,\\chi_i(C_k)^*$, where $N_k$ is the size of class $k$.';

export default {
  topic: 'group-theory',
  items: [
    // ---------- level 1 ----------
    { id: 'grp-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'axioms',
      q: 'Which of these is NOT a group under the stated operation?',
      options: ['The integers under addition', 'The non-zero real numbers under multiplication', 'The integers under multiplication', 'The set $\\{1, -1, i, -i\\}$ under multiplication'], answer: 2,
      sol: 'A group needs closure, associativity, an identity and an inverse for every element. The integers under multiplication have the identity 1, but 2 has no integer inverse ($1/2$ is not an integer), so they fail. The integers under addition (identity 0, inverse $-n$), the non-zero reals under multiplication (inverse $1/x$) and the fourth roots of unity (a cyclic group of order 4) are all groups.',
      trap: 'Zero must be removed for multiplication of reals; among the integers even that is not enough.' },
    { id: 'grp-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'permutation groups',
      q: 'The symmetric group $S_3$ (all permutations of three objects) has how many elements?',
      options: ['$3$', '$6$', '$9$', '$8$'], answer: 1,
      sol: 'There are $3! = 6$ ways to arrange three objects: the identity, three transpositions $(12), (13), (23)$ and two 3-cycles $(123), (132)$. $S_3$ is also the symmetry group of an equilateral triangle, $C_{3v}$ or $D_3$.' },
    { id: 'grp-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'cyclic groups',
      q: 'In the group $\\mathbb Z_{12}$ (integers under addition modulo 12), the order of the element 3 is ______.',
      answer: 4, tol: 0, calc: () => 12 / gcd(3, 12),
      sol: 'The order is the smallest $n$ with $n\\cdot 3 \\equiv 0 \\pmod{12}$: $3, 6, 9, 12 \\equiv 0$, so $n = 4$. In general the order of $k$ in $\\mathbb Z_N$ is $N/\\gcd(k, N) = 12/3 = 4$.',
      trap: 'The order is not the element itself; 3 has order 4, not 3.' },
    { id: 'grp-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Lagrange theorem',
      q: 'A group $G$ has 12 elements. Which of these CANNOT be the order of a subgroup of $G$?',
      options: ['$3$', '$4$', '$6$', '$5$'], answer: 3,
      sol: 'Lagrange\'s theorem: the order of a subgroup divides the order of the group. The divisors of 12 are 1, 2, 3, 4, 6, 12. Five does not divide 12, so no subgroup of order 5 exists.',
      trap: 'The converse of Lagrange is false: a divisor need not have a subgroup ($A_4$, order 12, has no subgroup of order 6). But a non-divisor never does.' },
    { id: 'grp-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'cyclic groups',
      q: 'Every group whose order is a prime number $p$ is',
      options: ['cyclic, and therefore abelian', 'non-abelian when $p > 2$', 'without any element of order $p$', 'a group with $p - 1$ subgroups'], answer: 0,
      sol: 'Take any element $g \\neq e$. Its order divides $p$ (Lagrange) and is not 1, so it is $p$: the powers of $g$ fill the whole group, which is therefore cyclic. Cyclic groups are abelian because $g^ag^b = g^{a+b} = g^bg^a$. The only subgroups are $\\{e\\}$ and $G$ itself.' },
    { id: 'grp-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Lie groups',
      q: 'The number of independent generators (real parameters) of the Lie group $SU(2)$ is ______.',
      answer: 3, tol: 0, calc: () => 2 * 2 - 1,
      sol: 'A $2\\times2$ complex matrix has 8 real parameters. Unitarity $U^\\dagger U = I$ imposes 4 real conditions, leaving 4 for $U(2)$; $\\det U = 1$ removes one more. So $SU(2)$ has $2^2 - 1 = 3$ generators, the Pauli matrices $\\sigma_k/2$.' },

    // ---------- level 2 ----------
    { id: 'grp-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'conjugacy classes',
      q: 'The symmetry group $C_{3v}$ of an equilateral triangle (rotations by $0, 120°, 240°$ and three reflections) has how many conjugacy classes?',
      options: ['$2$', '$3$', '$4$', '$6$'], answer: 1,
      sol: 'Conjugation preserves "what kind of operation" an element is: the identity is alone, the two rotations by $\\pm120°$ are conjugate to each other (a reflection turns one into the other), and the three reflections are conjugate (a rotation carries one mirror line to another). Classes: $\\{E\\}$, $\\{C_3, C_3^2\\}$, $\\{\\sigma_v, \\sigma_v\', \\sigma_v\'\'\\}$, three in all.',
      trap: 'Six counts the elements, not the classes; only in an abelian group is every element its own class.' },
    { id: 'grp-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'representations',
      q: 'The dimensions of the irreducible representations of $S_3$ are',
      options: ['$1, 1, 1, 1, 1, 1$', '$1, 2, 3$', '$1, 1, 2$', '$2, 2$'], answer: 2,
      sol: 'The number of irreps equals the number of classes, 3, and the squares of their dimensions add to the order, 6: $1^2 + 1^2 + 2^2 = 6$. They are the trivial rep, the sign rep and the 2-dimensional rep (the triangle\'s symmetry operations as $2\\times2$ matrices). Six 1-d irreps would need six classes (an abelian group); $1, 2, 3$ gives 14.' },
    { id: 'grp-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Lie groups',
      q: 'The number of generators of $SU(3)$ (the Gell-Mann matrices) is ______.',
      answer: 8, tol: 0, calc: () => 3 * 3 - 1,
      sol: '$SU(N)$ has $N^2 - 1$ generators: $N^2$ real parameters for a unitary $N\\times N$ matrix, minus one for $\\det U = 1$. For $N = 3$: $9 - 1 = 8$, the eight Gell-Mann matrices $\\lambda_a$ (and the eight gluons of QCD).' },
    { id: 'grp-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Lie groups',
      q: 'The rotation group $SO(4)$ in four dimensions has how many independent parameters?',
      options: ['$4$', '$6$', '$9$', '$16$'], answer: 1,
      sol: 'A rotation is generated by antisymmetric real matrices, and an antisymmetric $N\\times N$ matrix has $N(N-1)/2$ independent entries, one per plane of rotation. For $N = 4$: $4\\cdot3/2 = 6$ (planes $xy, xz, xw, yz, yw, zw$). Check: $SO(3)$ gives 3.',
      trap: 'In 3 dimensions the number of planes equals the number of axes, which hides the general rule: rotations happen in planes, not about axes.' },
    { id: 'grp-011', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'abelian groups',
      q: 'Which of these groups are abelian?',
      options: ['$\\mathbb Z_6$', '$S_3$', 'The Klein four-group $\\mathbb Z_2\\times\\mathbb Z_2$', 'The quaternion group $Q_8 = \\{\\pm1, \\pm i, \\pm j, \\pm k\\}$'], answer: [0, 2],
      sol: '$\\mathbb Z_6$ is cyclic, hence abelian. The Klein group is a direct product of abelian groups, hence abelian. In $S_3$, $(12)(13) = (132)$ but $(13)(12) = (123)$. In $Q_8$, $ij = k$ but $ji = -k$.' },
    { id: 'grp-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'axioms',
      q: 'In a group $G$, every element other than the identity has order 2. Then $G$ is necessarily',
      options: ['cyclic', 'of odd order', 'simple', 'abelian'], answer: 3,
      sol: 'Every element is its own inverse, $g = g^{-1}$. For any $a, b$: $ab = (ab)^{-1} = b^{-1}a^{-1} = ba$. So the group is abelian. It need not be cyclic (the Klein group $\\mathbb Z_2\\times\\mathbb Z_2$ is a counter-example), and its order is a power of 2, so it is even (when it is not trivial).' },
    { id: 'grp-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'SU(2)',
      q: 'Combining two spin-$\\tfrac12$ particles, the product representation $\\tfrac12\\otimes\\tfrac12$ of $SU(2)$ decomposes as',
      options: ['$0\\oplus1$', '$1\\oplus1$', '$\\tfrac12\\oplus\\tfrac12$', '$0\\oplus0\\oplus1$'], answer: 0,
      sol: 'For $j_1\\otimes j_2$, total $j$ runs from $|j_1 - j_2|$ to $j_1 + j_2$ in integer steps, each once: here $j = 0, 1$. Dimension check: $2\\times2 = 4 = 1 + 3$. The singlet is antisymmetric, the triplet symmetric under exchange.',
      trap: 'Count dimensions: $0\\oplus0\\oplus1$ gives 5 and $1\\oplus1$ gives 6, not 4.' },
    { id: 'grp-014', type: 'nat', level: 2, exams: ['net'], sub: 'conjugacy classes',
      q: 'Every group of order 15 is cyclic. The number of conjugacy classes of a group of order 15 is ______.',
      answer: 15, tol: 0, calc: () => 15,
      sol: 'A cyclic group is abelian, and in an abelian group $hgh^{-1} = g$ for every $h$, so each element forms its own class. Fifteen elements give fifteen classes, and hence fifteen 1-dimensional irreps.' },
    { id: 'grp-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'classification',
      q: 'How many non-isomorphic groups of order 4 are there?',
      options: ['$1$', '$2$', '$3$', '$4$'], answer: 1,
      sol: 'If some element has order 4, the group is cyclic, $\\mathbb Z_4$. Otherwise every non-identity element has order 2, which gives the Klein group $\\mathbb Z_2\\times\\mathbb Z_2$. Both are abelian. These are the only two; the smallest non-abelian group has order 6.' },
    { id: 'grp-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'SO(3)',
      q: 'The irreducible representations of the rotation group $SO(3)$ (not $SU(2)$) have dimensions',
      options: ['all positive integers', 'even integers only', 'odd integers only, $2l + 1$', '1 and 3 only'], answer: 2,
      sol: 'The irreps of $SO(3)$ are labelled by integer $l = 0, 1, 2, \\dots$ (the spherical harmonics $Y_{lm}$) with dimension $2l + 1$: 1, 3, 5, ... The even dimensions belong to half-integer $j$, which are representations of $SU(2)$ but only "double-valued" (projective) for $SO(3)$, since a $2\\pi$ rotation gives $-1$.',
      trap: 'Spin-$\\tfrac12$ needs $SU(2)$; $SO(3)$ alone has no 2-dimensional irrep.' },
    { id: 'grp-041', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Lie groups',
      q: 'The group $U(1)$ of phases $e^{i\\theta}$ under multiplication is isomorphic to',
      options: ['$SO(2)$', '$SU(2)$', '$\\mathbb Z_2$', '$SO(3)$'], answer: 0,
      sol: 'Map $e^{i\\theta}$ to the rotation matrix $\\begin{pmatrix}\\cos\\theta & -\\sin\\theta\\\\ \\sin\\theta & \\cos\\theta\\end{pmatrix}$. Multiplying phases adds angles, and so does composing plane rotations, so the map is an isomorphism. Both are abelian with one parameter; $SU(2)$ and $SO(3)$ have three and are non-abelian.' },
    { id: 'grp-043', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'permutation groups',
      q: 'The number of elements of order 2 in $S_3$ is ______.',
      answer: 3, tol: 0, calc: () => 3,
      sol: 'The elements of $S_3$ are $e$ (order 1), the transpositions $(12), (13), (23)$ (order 2) and the 3-cycles $(123), (132)$ (order 3). So three elements have order 2: the three reflections of the triangle.' },

    // ---------- level 3 ----------
    { id: 'grp-017', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'characters',
      q: 'In the two-dimensional irreducible representation of $C_{3v}$, the matrices represent the triangle\'s symmetry operations acting on the plane. The character of the class of rotations by $\\pm120°$ is',
      options: ['$2$', '$1$', '$0$', '$-1$'], answer: 3,
      sol: 'A rotation by $\\theta$ in the plane has trace $2\\cos\\theta$, so $\\chi(C_3) = 2\\cos120° = -1$. A reflection has eigenvalues $+1$ and $-1$, so its character is 0, and the identity has character 2. Row: $(2, -1, 0)$.' },
    { id: 'grp-018', type: 'nat', level: 3, exams: ['net'], sub: 'reducing representations',
      q: `${C3V} A reducible representation has characters $(5, 2, 1)$ on the three classes. The number of times $A_1$ appears in it is ______.`,
      answer: 2, tol: 0, calc: () => (5 * 1 + 2 * 2 * 1 + 3 * 1 * 1) / 6,
      sol: `${RED} Class sizes 1, 2, 3; $|G| = 6$. $n_{A_1} = \\tfrac16(1\\cdot5\\cdot1 + 2\\cdot2\\cdot1 + 3\\cdot1\\cdot1) = \\tfrac{12}{6} = 2$. Likewise $n_{A_2} = \\tfrac16(5 + 4 - 3) = 1$ and $n_E = \\tfrac16(10 - 4 + 0) = 1$. Check: $2(1) + 1(1) + 1(2) = 5$, the dimension.`,
      trap: 'Forgetting the class sizes (summing over classes instead of elements) gives $(5 + 2 + 1)/6$, not an integer: a sure sign of the mistake.' },
    { id: 'grp-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'representations',
      q: 'A group of order 8 has 5 conjugacy classes. The dimensions of its irreducible representations are',
      options: ['$1, 1, 2, 2, 2$', '$1, 1, 1, 1, 2$', '$1, 1, 1, 1, 1, 1, 1, 1$', '$1, 1, 1, 1, 2, 2$'], answer: 1,
      sol: 'Five classes means five irreps, and $\\sum d_i^2 = 8$ with $d_i \\geq 1$ and one $d = 1$ (the trivial rep). The only solution is $1 + 1 + 1 + 1 + 4 = 8$: four 1-d irreps and one 2-d. Both non-abelian groups of order 8, $D_4$ and $Q_8$, have this pattern. The first option sums to 14, the third has 8 irreps, the last has 6 irreps.' },
    { id: 'grp-020', type: 'mcq', level: 3, exams: ['net'], sub: 'SU(3)',
      q: 'In $SU(3)$, the product of two fundamental representations decomposes as',
      options: ['$8\\oplus1$', '$6\\oplus3$', '$6\\oplus\\bar3$', '$5\\oplus4$'], answer: 2,
      sol: 'The $3\\times3 = 9$ products $q_iq_j$ split into the symmetric part (6 components) and the antisymmetric part $\\epsilon_{ijk}q_jq_k$ (3 components). The antisymmetric part carries a lower index, so it transforms as $\\bar3$, not $3$. So $3\\otimes3 = 6\\oplus\\bar3$. (In contrast $3\\otimes\\bar3 = 8\\oplus1$, the mesons.)',
      trap: '$6\\oplus3$ has the right dimension; the antisymmetric pair is a $\\bar3$, which is why two quarks can bind like an antiquark (diquarks).' },
    { id: 'grp-021', type: 'mcq', level: 3, exams: ['net'], sub: 'SU(3)',
      q: 'Quark-antiquark states in the flavour $SU(3)$ of $u, d, s$ quarks fall into multiplets given by $3\\otimes\\bar3$. These are',
      options: ['an octet and a singlet', 'a decuplet and a singlet', 'two octets and a singlet', 'a sextet and an antitriplet'], answer: 0,
      sol: '$q^i\\bar q_j$ is a $3\\times3$ matrix; split it into its trace $\\delta^i_j\\,q^k\\bar q_k$ (1 component, invariant: the singlet) and the traceless part (8 components: the octet). $3\\otimes\\bar3 = 8\\oplus1$; the pseudoscalar mesons $\\pi, K, \\eta$ form the octet, $\\eta\'$ is mostly the singlet.' },
    { id: 'grp-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'SU(2)',
      q: 'The product representation $\\tfrac32\\otimes1$ of $SU(2)$ is decomposed into irreducible representations. The number of irreducible representations that appear is ______.',
      answer: 3, tol: 0, calc: () => 2 * Math.min(1.5, 1) + 1,
      sol: '$j$ runs from $|\\tfrac32 - 1| = \\tfrac12$ to $\\tfrac32 + 1 = \\tfrac52$: $j = \\tfrac12, \\tfrac32, \\tfrac52$, three irreps. Dimension check: $4\\times3 = 12 = 2 + 4 + 6$. In general there are $2\\min(j_1, j_2) + 1$ pieces.' },
    { id: 'grp-023', type: 'mcq', level: 3, exams: ['net'], sub: 'SU(2)',
      q: 'The centre of $SU(2)$ (the elements that commute with every element) is',
      options: ['the trivial group', '$U(1)$', '$\\mathbb Z_3$', '$\\mathbb Z_2 = \\{I, -I\\}$'], answer: 3,
      sol: 'By Schur\'s lemma an element commuting with all of an irrep (here the defining 2-d rep) is a multiple of the identity, $\\lambda I$. Then $\\det(\\lambda I) = \\lambda^2 = 1$ gives $\\lambda = \\pm1$. The centre is $\\{I, -I\\}\\cong\\mathbb Z_2$, and $SO(3) = SU(2)/\\mathbb Z_2$. For $SU(N)$ the centre is $\\mathbb Z_N$.' },
    { id: 'grp-024', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'SU(2)',
      q: 'Which statements about $SU(2)$ and $SO(3)$ are correct?',
      options: ['Their Lie algebras are isomorphic', 'Each rotation in $SO(3)$ corresponds to exactly two elements $\\pm U$ of $SU(2)$', 'Spin-$\\tfrac12$ is a true (single-valued) representation of $SO(3)$', '$SU(2)$ is simply connected (topologically a 3-sphere)'], answer: [0, 1, 3],
      sol: 'Both algebras are $[J_i, J_j] = i\\epsilon_{ijk}J_k$. The map $U \\mapsto R$ with $R_{ij} = \\tfrac12\\mathrm{tr}(\\sigma_iU\\sigma_jU^\\dagger)$ sends $U$ and $-U$ to the same rotation: a 2-to-1 cover. $SU(2)$ matrices $a_0I + i\\vec a\\cdot\\vec\\sigma$ with $a_0^2 + |\\vec a|^2 = 1$ form the 3-sphere, which is simply connected. Spin-$\\tfrac12$ changes sign under a $2\\pi$ rotation, so it is only a double-valued rep of $SO(3)$.' },
    { id: 'grp-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Lie groups',
      q: 'The dimension (number of generators) of the Lie group $SO(5)$ is ______.',
      answer: 10, tol: 0, calc: () => 5 * 4 / 2,
      sol: 'The generators of $SO(N)$ are the real antisymmetric $N\\times N$ matrices, with $N(N-1)/2$ independent entries: $5\\cdot4/2 = 10$.' },
    { id: 'grp-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'generators',
      q: 'With the $SU(2)$ generators $T_a = \\sigma_a/2$ built from the Pauli matrices, the commutator $[T_1, T_2]$ equals',
      options: ['$iT_3$', '$-iT_3$', '$2iT_3$', '$0$'], answer: 0,
      sol: '$\\sigma_1\\sigma_2 = i\\sigma_3$ and $\\sigma_2\\sigma_1 = -i\\sigma_3$, so $[\\sigma_1, \\sigma_2] = 2i\\sigma_3$. Dividing by 4: $[T_1, T_2] = \\tfrac14(2i\\sigma_3) = i\\sigma_3/2 = iT_3$. The structure constants are $\\epsilon_{abc}$, the same as for angular momentum.',
      trap: 'With the bare Pauli matrices the factor is $2i$; the factor 1/2 in each generator turns it into $i$.' },
    { id: 'grp-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'subgroups',
      q: 'Which subgroup of $S_3$ is normal (invariant under conjugation by every element)?',
      options: ['$\\{e, (12)\\}$', '$\\{e, (13)\\}$', '$\\{e, (123), (132)\\}$', '$\\{e, (23)\\}$'], answer: 2,
      sol: 'A normal subgroup is a union of whole conjugacy classes. The class of $(12)$ is all three transpositions, so $\\{e, (12)\\}$ is not normal: $(13)(12)(13) = (23)$. The alternating group $A_3 = \\{e, (123), (132)\\}$ contains the whole class of 3-cycles, and has index 2 (every subgroup of index 2 is normal). $S_3/A_3 \\cong \\mathbb Z_2$, the sign.' },
    { id: 'grp-028', type: 'mcq', level: 3, exams: ['net'], sub: 'Lie groups',
      q: 'The rank of $SU(4)$ (the largest number of mutually commuting generators) is',
      options: ['$2$', '$4$', '$15$', '$3$'], answer: 3,
      sol: 'The commuting generators can be taken diagonal, traceless and Hermitian: an $N\\times N$ diagonal traceless matrix has $N - 1$ free real entries. For $SU(4)$: rank 3, out of 15 generators. ($SU(2)$: rank 1, $J_z$; $SU(3)$: rank 2, $\\lambda_3$ and $\\lambda_8$.)' },
    { id: 'grp-042', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'representations',
      q: 'The cyclic group $\\mathbb Z_6$ has',
      options: ['3 irreps, of dimensions 1, 1, 2', '2 irreps, of dimensions 1 and $\\sqrt5$', '4 irreps, of dimensions 1, 1, 1, $\\sqrt3$', '6 irreps, all one-dimensional'], answer: 3,
      sol: 'An abelian group has every element in its own class, so 6 classes and 6 irreps, and $\\sum d_i^2 = 6$ forces all $d_i = 1$. They are $g^k \\mapsto e^{2\\pi i mk/6}$ for $m = 0, \\dots, 5$, where $g$ is the generator. The pattern 1, 1, 2 belongs to $S_3$, the non-abelian group of order 6.' },

    // ---------- level 4 ----------
    { id: 'grp-029', type: 'nat', level: 4, exams: ['net'], sub: 'conjugacy classes',
      q: 'The dihedral group $D_5$ (symmetries of a regular pentagon, order 10) has how many conjugacy classes?',
      answer: 4, tol: 0, calc: () => (5 + 3) / 2,
      sol: 'Elements: rotations $r^k$ ($k = 0, \\dots, 4$) and five reflections. Conjugating $r^k$ by a reflection gives $r^{-k}$, so the rotation classes are $\\{e\\}$, $\\{r, r^4\\}$, $\\{r^2, r^3\\}$. With 5 (odd) sides, every reflection axis passes through a vertex and all five reflections are conjugate: one class. Total 4. Check: four irreps with $1 + 1 + 4 + 4 = 10$, dimensions 1, 1, 2, 2.',
      trap: 'For even $n$ the reflections split into two classes (through vertices and through edges), so the count rule differs: $(n + 3)/2$ for odd $n$, $(n + 6)/2$ for even $n$.' },
    { id: 'grp-030', type: 'mcq', level: 4, exams: ['net'], sub: 'reducing representations',
      q: `${C3V} The three vertices of an equilateral triangle are permuted by its symmetry operations, giving a 3-dimensional permutation representation. It decomposes as`,
      options: ['$A_1\\oplus E$', '$A_2\\oplus E$', '$2A_1\\oplus A_2$', '$3A_1$'], answer: 0,
      sol: `The character of a permutation matrix is the number of points left fixed: $E$ fixes 3, a rotation fixes 0, a reflection fixes the one vertex on its mirror line. So $\\chi = (3, 0, 1)$. ${RED} $n_{A_1} = \\tfrac16(3 + 0 + 3) = 1$, $n_{A_2} = \\tfrac16(3 + 0 - 3) = 0$, $n_E = \\tfrac16(6 + 0 + 0) = 1$. So $A_1\\oplus E$; the $A_1$ is the symmetric sum of the three vertices.` },
    { id: 'grp-031', type: 'mcq', level: 4, exams: ['net'], sub: 'characters',
      q: 'The dihedral group $D_4$ and the quaternion group $Q_8$ (both of order 8) have the same',
      options: ['multiplication table, since they are isomorphic', 'character table', 'number of elements of order 2', 'number of subgroups of order 2'], answer: 1,
      sol: 'Both have 5 classes and irreps of dimensions 1, 1, 1, 1, 2, and their character tables are identical. They are not isomorphic: $Q_8$ has a single element of order 2 ($-1$), so one subgroup of order 2, while $D_4$ has five elements of order 2 (the rotation by $180°$ and four reflections). The classic lesson: the character table does not determine the group.' },
    { id: 'grp-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'SU(2)',
      q: 'Three spin-1 particles are combined: $1\\otimes1\\otimes1$. The number of multiplets with total $j = 1$ in the decomposition is ______.',
      answer: 3, tol: 0, calc: () => 1 + 1 + 1,
      sol: 'First $1\\otimes1 = 0\\oplus1\\oplus2$. Then combine each with the third spin: $0\\otimes1 = 1$; $1\\otimes1 = 0\\oplus1\\oplus2$; $2\\otimes1 = 1\\oplus2\\oplus3$. The $j = 1$ multiplets: one from each line, 3 in all. Dimension check: $27 = 1\\cdot1 + 3\\cdot3 + 2\\cdot5 + 1\\cdot7$ (one $j = 0$, three $j = 1$, two $j = 2$, one $j = 3$).' },
    { id: 'grp-033', type: 'mcq', level: 4, exams: ['net'], sub: 'Lie groups',
      q: 'The Poincaré group (Lorentz transformations together with space-time translations) has how many generators?',
      options: ['$4$', '$6$', '$10$', '$16$'], answer: 2,
      sol: 'The Lorentz group $SO(3, 1)$ has $4\\cdot3/2 = 6$ generators: 3 rotations $J_i$ and 3 boosts $K_i$. Translations in space and time add 4 more ($P^\\mu$). Total $6 + 4 = 10$.' },
    { id: 'grp-034', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'representations',
      q: 'For a finite group $G$, which statements are always true?',
      options: ['The number of irreducible representations equals the number of conjugacy classes', 'The squares of the dimensions of the irreps add up to $|G|$', 'The dimension of each irrep divides $|G|$', 'A non-abelian group has no one-dimensional irrep'], answer: [0, 1, 2],
      sol: 'The first two follow from the great orthogonality theorem; the divisibility of dimensions is a theorem of Frobenius. The last is false: every group has the trivial irrep, $g \\mapsto 1$, and $S_n$ also has the sign rep.' },
    { id: 'grp-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'homomorphisms',
      q: 'The map $\\phi: \\mathbb Z_{12}\\to\\mathbb Z_4$, $\\phi(n) = n \\bmod 4$, is a homomorphism. The order of its kernel is ______.',
      answer: 3, tol: 0, calc: () => 12 / 4,
      sol: 'The kernel is the set sent to the identity 0: $\\{0, 4, 8\\}$, three elements. Check with the first isomorphism theorem: $\\phi$ is onto, so $|\\mathbb Z_{12}|/|\\ker\\phi| = |\\mathbb Z_4|$, i.e. $12/3 = 4$.' },
    { id: 'grp-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'generators',
      q: 'The rotation generators in the 3-dimensional (vector) representation are $(J_k)_{ij} = -i\\epsilon_{kij}$. The Casimir operator $J^2 = J_1^2 + J_2^2 + J_3^2$ in this representation equals',
      options: ['$I$', '$3I$', '$\\tfrac34 I$', '$2I$'], answer: 3,
      sol: '$(J_k^2)_{il} = \\sum_j(-i)^2\\epsilon_{kij}\\epsilon_{kjl}$. Summing over $k$: $\\sum_{k,j}\\epsilon_{kij}\\epsilon_{kjl} = -\\sum_{k,j}\\epsilon_{kij}\\epsilon_{klj} = -2\\delta_{il}$, so $J^2 = (-1)(-2)I = 2I$. This is $j(j+1)$ with $j = 1$, as it must be for the vector rep. $\\tfrac34$ belongs to spin $\\tfrac12$.' },

    // ---------- level 5 ----------
    { id: 'grp-037', type: 'nat', level: 5, exams: ['net'], sub: 'SU(3)',
      q: 'The dimension of the $SU(3)$ irreducible representation with Dynkin labels $(p, q) = (2, 1)$ is ______. (Use $\\dim = \\tfrac12(p+1)(q+1)(p+q+2)$.)',
      answer: 15, tol: 0, calc: () => (3 * 2 * 5) / 2,
      sol: '$\\tfrac12(2+1)(1+1)(2+1+2) = \\tfrac12\\cdot3\\cdot2\\cdot5 = 15$. Checks of the formula: $(1, 0) = 3$, $(1, 1) = 8$, $(3, 0) = 10$. The 15 appears for example in $3\\otimes8 = 3\\oplus\\bar6\\oplus15$.' },
    { id: 'grp-038', type: 'mcq', level: 5, exams: ['net'], sub: 'reducing representations',
      q: `${C3V} The direct product $E\\otimes E$ of the 2-dimensional irrep with itself decomposes as`,
      options: ['$2A_1\\oplus E$', '$2E$', '$A_1\\oplus A_2\\oplus E$', '$A_1\\oplus 3A_2$'], answer: 2,
      sol: `Characters of a product rep multiply: $\\chi_{E\\otimes E} = (2^2, (-1)^2, 0^2) = (4, 1, 0)$. ${RED} $n_{A_1} = \\tfrac16(4 + 2 + 0) = 1$, $n_{A_2} = \\tfrac16(4 + 2 - 0) = 1$, $n_E = \\tfrac16(8 - 2 + 0) = 1$. So $E\\otimes E = A_1\\oplus A_2\\oplus E$ (the symmetric square $A_1\\oplus E$, the antisymmetric part $A_2$).`,
      trap: '$2A_1\\oplus E$ and $2E$ have the right dimension 4; only the characters decide.' },
    { id: 'grp-039', type: 'nat', level: 5, exams: ['net'], sub: 'permutation groups',
      q: 'The number of elements in the conjugacy class of the 3-cycle $(123)$ in $S_4$ is ______.',
      answer: 8, tol: 0, calc: () => (4 * 3 * 2) / 3,
      sol: 'In $S_n$, conjugacy classes are the cycle types. A 3-cycle in $S_4$ is fixed by choosing 3 of the 4 symbols ($\\binom43 = 4$ ways) and one of the $2! = 2$ cyclic orders: $4\\times2 = 8$. Equivalently $4\\cdot3\\cdot2/3$. Full list of $S_4$ classes: 1 + 6 (transpositions) + 3 (double transpositions) + 8 + 6 (4-cycles) = 24.' },
    { id: 'grp-040', type: 'mcq', level: 5, exams: ['net'], sub: 'representations',
      q: 'The symmetric group $S_4$ (order 24) has 5 conjugacy classes. The dimensions of its irreducible representations are',
      options: ['$1, 1, 2, 2, 4$', '$1, 1, 3, 3, 4$', '$1, 1, 2, 3, 3$', '$1, 2, 2, 3, 4$'], answer: 2,
      sol: 'Five irreps with $\\sum d_i^2 = 24$, two of them 1-d (trivial and sign, since $S_4$ has the sign homomorphism), and each $d_i$ dividing 24. $1 + 1 + 4 + 9 + 9 = 24$ works. The others sum to 26, 36 and 34. The two 3-d irreps are the rotations of a cube (or tetrahedron) and that rep times the sign.' },
  ],
  gens: [
    { id: 'grp-g01', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'cyclic groups',
      make(r) {
        const n = choose(r, [8, 9, 10, 12, 14, 15, 16, 18, 20, 24, 30]), k = int(r, 1, n - 1);
        const answer = n / gcd(k, n);
        return { q: `In $\\mathbb Z_{${n}}$ (integers under addition modulo ${n}), find the order of the element ${k}.`,
          answer, tol: 0, n, k,
          sol: `The order of $k$ in $\\mathbb Z_N$ is $N/\\gcd(k, N)$: the smallest $m$ with $mk$ a multiple of $N$. Here $\\gcd(${k}, ${n}) = ${gcd(k, n)}$, so the order is $${n}/${gcd(k, n)} = ${answer}$.`,
          trap: 'In an additive group "powers" are multiples: $k, 2k, 3k, \\dots$ until you reach 0.' };
      },
      verify: (p) => { let m = 1; while ((m * p.k) % p.n !== 0) m++; return m; } },
    { id: 'grp-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Lie groups',
      make(r) {
        const fam = choose(r, ['SU', 'SO', 'U', 'Sp']), N = int(r, 2, 7);
        const dim = { SU: N * N - 1, SO: N * (N - 1) / 2, U: N * N, Sp: N * (2 * N + 1) }[fam];
        const name = fam === 'Sp' ? `Sp(${2 * N})` : `${fam}(${N})`;
        const why = { SU: `$N^2 - 1 = ${N * N} - 1$: unitary matrices need $N^2$ real parameters, and $\\det U = 1$ removes one.`,
          SO: `$N(N-1)/2 = ${N}\\cdot${N - 1}/2$: the generators are real antisymmetric matrices, one per plane of rotation.`,
          U: `$N^2 = ${N * N}$: the generators are the $N\\times N$ Hermitian matrices.`,
          Sp: `$N(2N+1) = ${N}\\cdot${2 * N + 1}$ for $Sp(2N)$, the symmetric $2N\\times2N$ generators in the symplectic form.` }[fam];
        return { q: `Find the number of generators (the dimension) of the Lie group $${name}$.`, answer: dim, tol: 0, fam, N,
          sol: `For $${name}$ the dimension is ${why} So the answer is ${dim}.` };
      },
      verify: (p) => ({ SU: p.N * p.N - 1, SO: p.N * (p.N - 1) / 2, U: p.N * p.N, Sp: p.N * (2 * p.N + 1) }[p.fam]) },
    { id: 'grp-g03', type: 'nat', level: 3, exams: ['net'], sub: 'reducing representations',
      make(r) {
        const a = int(r, 0, 3), b = int(r, 0, 3), c = int(r, 1, 3);
        const chi = [a + b + 2 * c, a + b - c, a - b];
        const which = choose(r, ['A_1', 'A_2', 'E']);
        const row = { A_1: [1, 1, 1], A_2: [1, 1, -1], E: [2, -1, 0] }[which];
        const answer = (chi[0] * row[0] + 2 * chi[1] * row[1] + 3 * chi[2] * row[2]) / 6;
        return { q: `${C3V} A representation $\\Gamma$ has characters $(${chi.join(', ')})$. How many times does $${which}$ appear in $\\Gamma$?`,
          answer, tol: 0, chi, row,
          sol: `${RED} With class sizes 1, 2, 3: $n_{${which}} = \\tfrac16[1(${chi[0]})(${row[0]}) + 2(${chi[1]})(${row[1]}) + 3(${chi[2]})(${row[2]})] = \\tfrac16(${chi[0] * row[0] + 2 * chi[1] * row[1] + 3 * chi[2] * row[2]}) = ${answer}$. (In full, $\\Gamma = ${a}A_1 + ${b}A_2 + ${c}E$.)`,
          trap: 'Weight each class by its number of elements; leaving out the 2 and the 3 usually gives a fraction.' };
      },
      verify: (p) => (p.chi[0] * p.row[0] + 2 * p.chi[1] * p.row[1] + 3 * p.chi[2] * p.row[2]) / 6 },
    { id: 'grp-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'SU(2)',
      make(r) {
        const j1 = int(r, 1, 8) / 2, j2 = int(r, 1, 6) / 2;
        const ask = choose(r, ['count', 'max', 'states']);
        const show = (j) => (Number.isInteger(j) ? `${j}` : `\\tfrac{${2 * j}}{2}`);
        const answer = ask === 'count' ? 2 * Math.min(j1, j2) + 1 : ask === 'max' ? (2 * (j1 + j2) + 1) : (2 * j1 + 1) * (2 * j2 + 1);
        const what = { count: 'the number of irreducible representations in the decomposition', max: 'the dimension of the largest irreducible representation that appears', states: 'the total dimension of the product space' }[ask];
        return { q: `Two angular momenta $j_1 = ${show(j1)}$ and $j_2 = ${show(j2)}$ are combined, $j_1\\otimes j_2$ in $SU(2)$. Find ${what}.`,
          answer, tol: 0, j1, j2, ask,
          sol: `Total $j$ runs from $|j_1 - j_2| = ${show(Math.abs(j1 - j2))}$ to $j_1 + j_2 = ${show(j1 + j2)}$ in steps of 1, which is $2\\min(j_1, j_2) + 1 = ${2 * Math.min(j1, j2) + 1}$ irreps. The largest has dimension $2(j_1 + j_2) + 1 = ${2 * (j1 + j2) + 1}$, and the total dimension is $(2j_1 + 1)(2j_2 + 1) = ${(2 * j1 + 1) * (2 * j2 + 1)}$. Answer: ${answer}.` };
      },
      verify: (p) => {
        const js = []; for (let j = Math.abs(p.j1 - p.j2); j <= p.j1 + p.j2 + 1e-9; j++) js.push(j);
        return p.ask === 'count' ? js.length : p.ask === 'max' ? 2 * js[js.length - 1] + 1 : js.reduce((s, j) => s + 2 * j + 1, 0);
      } },
    { id: 'grp-g05', type: 'nat', level: 3, exams: ['net'], sub: 'conjugacy classes',
      make(r) {
        const n = int(r, 3, 12);
        const answer = n % 2 ? (n + 3) / 2 : (n + 6) / 2;
        return { q: `How many conjugacy classes does the dihedral group $D_{${n}}$ (symmetries of a regular ${n}-gon, order ${2 * n}) have?`,
          answer, tol: 0, n,
          sol: n % 2
            ? `Rotations: $\\{e\\}$ and the pairs $\\{r^k, r^{-k}\\}$ for $k = 1, \\dots, ${(n - 1) / 2}$, giving $${(n - 1) / 2 + 1}$ classes. With an odd number of sides all ${n} reflections are conjugate: 1 class. Total $(n + 3)/2 = ${answer}$.`
            : `Rotations: $\\{e\\}$, $\\{r^{${n / 2}}\\}$ (the half turn commutes with everything) and the pairs $\\{r^k, r^{-k}\\}$ for $k = 1, \\dots, ${n / 2 - 1}$, giving $${n / 2 + 1}$ classes. With an even number of sides the reflections split into two classes (axes through vertices, axes through edge midpoints). Total $(n + 6)/2 = ${answer}$.`,
          trap: 'Odd and even $n$ differ: for even $n$ the half-turn is a class of its own and the mirrors fall into two classes.' };
      },
      verify: (p) => {
        // count classes by brute force: elements (k, s) = r^k s^s; conjugate by every element
        const n = p.n, key = (k, s) => `${((k % n) + n) % n},${s}`, mul = ([a, s], [b, t]) => [s ? a - b : a + b, s ^ t];
        const inv = ([a, s]) => (s ? [a, 1] : [-a, 0]);
        const els = []; for (let s = 0; s < 2; s++) for (let k = 0; k < n; k++) els.push([k, s]);
        const seen = new Set(); let cls = 0;
        for (const g of els) { if (seen.has(key(...g))) continue; cls++; for (const h of els) { const c = mul(mul(h, g), inv(h)); seen.add(key(...c)); } }
        return cls;
      } },
    { id: 'grp-g06', type: 'nat', level: 4, exams: ['net'], sub: 'SU(3)',
      make(r) {
        const p = int(r, 0, 4), q = int(r, 0, 3) || (p ? 0 : 1);
        const answer = (p + 1) * (q + 1) * (p + q + 2) / 2;
        return { q: `Using $\\dim(p, q) = \\tfrac12(p+1)(q+1)(p+q+2)$, find the dimension of the $SU(3)$ irrep with Dynkin labels $(${p}, ${q})$.`,
          answer, tol: 0, p, qq: q,
          sol: `$\\tfrac12(${p + 1})(${q + 1})(${p + q + 2}) = ${answer}$. Reference points: $(1, 0) = 3$, $(0, 1) = \\bar3$, $(1, 1) = 8$, $(3, 0) = 10$. Swapping $p$ and $q$ gives the conjugate rep, of the same dimension.` };
      },
      verify: (x) => (x.p + 1) * (x.qq + 1) * (x.p + x.qq + 2) / 2 },
    { id: 'grp-g07', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Lagrange theorem',
      make(r) {
        const N = choose(r, [12, 18, 20, 24, 30, 36, 40, 42, 48, 60]);
        const divs = []; for (let d = 2; d < N; d++) if (N % d === 0) divs.push(d);
        const non = []; for (let d = 4; d < N; d++) if (N % d) non.push(d);
        const bad = choose(r, non);
        const a = int(r, 0, divs.length - 1), b = (a + 1 + int(r, 0, divs.length - 2)) % divs.length, c = (b + 1) % divs.length === a ? (b + 2) % divs.length : (b + 1) % divs.length;
        const o = mcqOptions(r, bad, [divs[a], divs[b], divs[c], divs[(c + 1) % divs.length]], (v) => `$${v}$`);
        return { q: `A finite group has order ${N}. Which of these CANNOT be the order of one of its subgroups?`, ...o,
          sol: `By Lagrange's theorem the order of a subgroup divides the order of the group. The divisors of ${N} are ${[1, ...divs, N].join(', ')}. ${bad} is not among them, so no subgroup of order ${bad} exists.`,
          trap: 'Lagrange rules out non-divisors; it does not promise a subgroup for every divisor.' };
      } },
    { id: 'grp-g08', type: 'nat', level: 3, exams: ['net'], sub: 'permutation groups',
      make(r) {
        const n = int(r, 4, 7), k = int(r, 2, n);
        let f = 1; for (let i = n - k + 1; i <= n; i++) f *= i;
        const answer = f / k;
        return { q: `How many ${k}-cycles are there in the symmetric group $S_{${n}}$ (equivalently, how many elements are in the conjugacy class of a single ${k}-cycle)?`,
          answer, tol: 0, n, k,
          sol: `Choose an ordered list of ${k} distinct symbols from ${n}: $${n}!/${n - k}! = ${f}$ ways. Each ${k}-cycle is counted ${k} times (any of its ${k} symbols can be written first), so there are $${f}/${k} = ${answer}$. In $S_n$ the conjugacy classes are exactly the cycle types.`,
          trap: 'Forgetting to divide by the cyclic rotations of the same cycle overcounts by the factor $k$.' };
      },
      verify: (p) => { let c = 1; for (let i = 0; i < p.k; i++) c *= (p.n - i); return c / p.k; } },
    { id: 'grp-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cyclic groups',
      make(r) {
        const m = int(r, 2, 12), n = int(r, 2, 12);
        const answer = m * n / gcd(m, n);
        return { q: `Find the largest order of any element of the direct product $\\mathbb Z_{${m}}\\times\\mathbb Z_{${n}}$.`,
          answer, tol: 0, m, n,
          sol: `The order of $(a, b)$ is the least common multiple of the orders of $a$ and $b$. Taking generators of both factors gives $\\mathrm{lcm}(${m}, ${n}) = ${m}\\cdot${n}/\\gcd(${m}, ${n}) = ${answer}$. ${gcd(m, n) === 1 ? `Since $\\gcd = 1$, this equals the order ${m * n}: the product is cyclic, $\\cong\\mathbb Z_{${m * n}}$.` : `Since $\\gcd(${m}, ${n}) = ${gcd(m, n)} > 1$, this is less than the order ${m * n}: the product is not cyclic.`}` };
      },
      verify: (p) => { let best = 0; for (let a = 0; a < p.m; a++) for (let b = 0; b < p.n; b++) { let k = 1; while ((k * a) % p.m || (k * b) % p.n) k++; best = Math.max(best, k); } return best; } },
    { id: 'grp-g10', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'SU(2)',
      make(r) {
        const j1 = int(r, 2, 6) / 2, j2 = int(r, 1, 4) / 2;
        const show = (j) => (Number.isInteger(j) ? `${j}` : `\\tfrac{${2 * j}}{2}`);
        const list = (lo, hi) => { const a = []; for (let j = lo; j <= hi + 1e-9; j++) a.push(show(j)); return `$${a.join('\\oplus ')}$`; };
        const lo = Math.abs(j1 - j2), hi = j1 + j2;
        const right = list(lo, hi);
        const wr = [list(lo, hi - 1), list(lo + 1, hi + 1), lo >= 1 ? list(lo - 1, hi) : list(lo, hi + 1), list(Math.max(lo, 0.5) + 0.5, hi + 0.5)];
        const o = mcqOptions(r, right, wr.filter((w) => w !== right), (v) => v);
        return { q: `The product $${show(j1)}\\otimes${show(j2)}$ of $SU(2)$ representations decomposes as`, ...o,
          sol: `Total $j$ runs from $|j_1 - j_2| = ${show(lo)}$ to $j_1 + j_2 = ${show(hi)}$ in integer steps, each once: ${right}. Dimension check: $(2j_1 + 1)(2j_2 + 1) = ${(2 * j1 + 1) * (2 * j2 + 1)}$, and the sum of $2j + 1$ over the list is the same.`,
          trap: 'Check dimensions: a list that does not add up to $(2j_1+1)(2j_2+1)$ is wrong at once.' };
      } },
    { id: 'grp-g11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'representations',
      make(r) {
        const G = choose(r, [['S_3', 6, [1, 1, 2]], ['D_4', 8, [1, 1, 1, 1, 2]], ['S_4', 24, [1, 1, 2, 3, 3]], ['A_4', 12, [1, 1, 1, 3]], ['D_5', 10, [1, 1, 2, 2]], ['D_6', 12, [1, 1, 1, 1, 2, 2]], ['A_5', 60, [1, 3, 3, 4, 5]], ['Q_8', 8, [1, 1, 1, 1, 2]]]);
        const [name, N, dims] = G;
        const i = int(r, 1, dims.length - 1), known = dims.filter((_, k) => k !== i), answer = dims[i];
        return { q: `The group $${name}$ has order ${N} and ${dims.length} conjugacy classes. All but one of its irreducible representations have dimensions ${known.join(', ')}. Find the dimension of the remaining irrep.`,
          answer, tol: 0, N, known,
          sol: `The squares of the irrep dimensions add up to the order: $${known.map((d) => `${d}^2`).join(' + ')} + d^2 = ${N}$, so $d^2 = ${N} - ${known.reduce((s, d) => s + d * d, 0)} = ${answer * answer}$ and $d = ${answer}$. (The number of irreps equals the number of classes, ${dims.length}, so exactly one is missing.)` };
      },
      verify: (p) => Math.sqrt(p.N - p.known.reduce((s, d) => s + d * d, 0)) },
    { id: 'grp-g12', type: 'nat', level: 4, exams: ['net'], sub: 'characters',
      make(r) {
        const j = int(r, 1, 6) / 2, th = choose(r, [[Math.PI / 2, '\\pi/2'], [Math.PI / 3, '\\pi/3'], [2 * Math.PI / 3, '2\\pi/3'], [Math.PI, '\\pi'], [Math.PI / 4, '\\pi/4']]);
        const answer = round(Math.sin((2 * j + 1) * th[0] / 2) / Math.sin(th[0] / 2), 4);
        const show = Number.isInteger(j) ? `${j}` : `\\tfrac{${2 * j}}{2}`;
        return { q: `Find the character $\\chi^{(j)}(\\theta) = \\mathrm{tr}\\,e^{-i\\theta J_z}$ of a rotation by $\\theta = ${th[1]}$ in the spin-$${show}$ representation of $SU(2)$.`,
          answer: Math.abs(answer) < 1e-9 ? 0 : answer, tol: 0.01, j, th: th[0],
          sol: `In a basis of $J_z$ eigenstates the rotation is diagonal with entries $e^{-im\\theta}$, $m = -j, \\dots, j$. The sum is a geometric series: $\\chi = \\sum_m e^{-im\\theta} = \\dfrac{\\sin[(2j+1)\\theta/2]}{\\sin(\\theta/2)} = \\dfrac{\\sin(${2 * j + 1}\\cdot${th[1]}/2)}{\\sin(${th[1]}/2)} = ${Math.abs(answer) < 1e-9 ? 0 : answer}$.`,
          trap: 'All rotations by the same angle form one class, so the character depends only on $\\theta$, not on the axis.' };
      },
      verify: (p) => { let s = 0; for (let m = -p.j; m <= p.j + 1e-9; m++) s += Math.cos(m * p.th); return s; } },
  ],
};
