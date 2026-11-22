// Extra question shapes for tensors (templates tns-m31..m35). Imported by tensors.js.
import { int, choose, mcqOptions, shuffle } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne } from './_odd.js';

export default [
  { id: 'tns-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'tensor basics', format: 'statements',
    make(r) {
      const n = int(r, 2, 5), not = r() < 0.5;
      const m = msqOf(r, [
        [`a symmetric rank-2 tensor in ${n} dimensions has ${(n * (n + 1)) / 2} independent components`, true, `Diagonal plus upper triangle: $n(n + 1)/2 = ${(n * (n + 1)) / 2}$.`],
        [`an antisymmetric rank-2 tensor in ${n} dimensions has ${(n * (n - 1)) / 2} independent components`, true, `Zero diagonal, upper triangle only: $n(n - 1)/2 = ${(n * (n - 1)) / 2}$.`],
        [`an antisymmetric rank-2 tensor in ${n} dimensions has ${(n * (n + 1)) / 2} independent components`, false, `The diagonal must vanish, leaving $n(n - 1)/2 = ${(n * (n - 1)) / 2}$.`],
        ['in three dimensions $\\delta_{ii} = 3$', true, '$\\delta_{11} + \\delta_{22} + \\delta_{33} = 3$.'],
        ['$\\varepsilon_{ijk}\\varepsilon_{ijk} = 6$', true, 'Six non-zero components, each $\\pm1$, squared and summed.'],
        ['$\\varepsilon_{ijk}\\varepsilon_{ijk} = 3$', false, 'There are $3! = 6$ non-zero components, each contributing 1.'],
        ['$S_{ij}A_{ij} = 0$ whenever $S$ is symmetric and $A$ antisymmetric', true, 'Relabelling $i \\leftrightarrow j$ gives $S_{ij}A_{ij} = -S_{ij}A_{ij}$.'],
        ['the trace $T_{ii}$ is the same in every rotated frame', true, '$T\'_{ii} = R_{ip}R_{iq}T_{pq} = \\delta_{pq}T_{pq} = T_{pp}$.'],
        ['the components of a vector are the same in every rotated frame', false, 'Components change as $v\'_i = R_{ij}v_j$; only the length is invariant.'],
        ['$a_ib_i$ (summed) is a rank-2 tensor', false, 'All indices are summed: it is a scalar, the dot product. $a_ib_j$ would be rank 2.'],
      ], { not });
      return { q: `Using the summation convention in Cartesian coordinates, which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'A repeated index is summed and disappears from the rank; free indices count the rank.' };
    } },
  { id: 'tns-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'physical tensors', format: 'match',
    make(r) {
      const L = { s: 'a true scalar (rank 0)', ps: 'a pseudoscalar', v: 'a polar (true) vector', av: 'an axial vector (pseudovector)', t2: 'a rank-2 tensor', t3: 'a rank-3 tensor', t4: 'a rank-4 tensor' };
      const cas = choose(r, [
        ['the moment of inertia of a rigid body about its centre of mass', 't2', '$L_i = I_{ij}\\omega_j$ links two vectors, so $I$ is rank 2.'],
        ['the angular momentum $\\vec L = \\vec r\\times\\vec p$', 'av', 'A cross product of two polar vectors does not flip under inversion: axial.'],
        ['the magnetic field $\\vec B$', 'av', 'From $\\vec F = q\\vec v\\times\\vec B$ with polar $\\vec F$ and $\\vec v$, $\\vec B$ must be axial.'],
        ['the elastic stiffness relating stress to strain in a crystal', 't4', '$\\sigma_{ij} = C_{ijkl}\\epsilon_{kl}$ links two rank-2 tensors.'],
        ['the quantity $\\vec E\\cdot\\vec B$', 'ps', 'Polar dotted with axial changes sign under inversion.'],
        ['the piezoelectric coefficient relating polarisation to stress', 't3', '$P_i = d_{ijk}\\sigma_{jk}$ links a vector to a rank-2 tensor.'],
        ['the electric conductivity of an anisotropic crystal', 't2', '$J_i = \\sigma_{ij}E_j$ links two vectors.'],
        ['the kinetic energy of a particle', 's', 'A scalar that does not change under rotation or inversion.'],
        ['the electric field $\\vec E$', 'v', 'It flips sign under inversion like position: polar.'],
        ['the torque $\\vec r\\times\\vec F$', 'av', 'Cross product of two polar vectors: axial.'],
        ['the helicity $\\vec S\\cdot\\hat p$ of a particle', 'ps', 'Axial spin dotted with polar momentum: changes sign under inversion.'],
      ]);
      return { q: `Under rotations and inversion of the axes, ${cas[0]} behaves as`, ...matchOne(r, L, cas),
        trap: 'Cross products of two true vectors are axial; dotting a true with an axial vector gives a pseudoscalar.' };
    } },
  { id: 'tns-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'invariants', format: 'conceptual',
    make(r) {
      const a = int(r, 1, 5), b = int(r, 1, 5), c = int(r, 1, 5), p = int(r, -2, 2), q = int(r, -2, 2), s = int(r, 1, 2);
      const T = [[a, p, 0], [p, b, q], [0, q, c]];
      const what = choose(r, ['trace', 'det', 'norm']);
      const tr = a + b + c, det = a * (b * c - q * q) - p * (p * c), nrm = a * a + b * b + c * c + 2 * p * p + 2 * q * q;
      const val = { trace: tr, det, norm: nrm }[what];
      const ws = { trace: [a, a + b, tr + 2 * p, tr + s], det: [a * b * c, det + p * p, tr, det + q * q * a], norm: [a * a + b * b + c * c, tr * tr, nrm - p * p, nrm + 1] }[what].filter((v) => v !== val);
      const name = { trace: 'the sum $T\'_{11} + T\'_{22} + T\'_{33}$', det: 'the determinant of the matrix $T\'_{ij}$', norm: 'the sum of squares of all nine components, $T\'_{ij}T\'_{ij}$' }[what];
      const o = mcqOptions(r, val, shuffle(r, ws));
      return { q: `A symmetric tensor has components $T = \\begin{pmatrix} ${T.map((row) => row.join(' & ')).join(' \\\\ ')} \\end{pmatrix}$ in one Cartesian frame. In a frame rotated by ${choose(r, ['$30^\\circ$ about the $z$-axis', '$45^\\circ$ about the $x$-axis', 'an arbitrary angle about the line $x = y = z$'])}, ${name} equals`, ...o,
        sol: `There is no need to rotate: the trace, the determinant and $T_{ij}T_{ij}$ are invariants (they are fixed by the eigenvalues, which a rotation does not change). Computing them in the original frame: trace $= ${tr}$, determinant $= ${a}(${b}\\cdot${c} - ${q * q}) - ${p * p}\\cdot${c} = ${det}$, and $T_{ij}T_{ij} = ${a * a} + ${b * b} + ${c * c} + 2(${p * p}) + 2(${q * q}) = ${nrm}$. So the answer is ${val}.`,
        trap: 'Individual components change under rotation; their invariant combinations do not. Remember that off-diagonal entries appear twice in $T_{ij}T_{ij}$.' };
    } },
  { id: 'tns-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'isotropic tensors',
    make(r) {
      const rank = int(r, 1, 4);
      const L = {
        1: 'the zero vector',
        2: 'a multiple of $\\delta_{ij}$',
        3: 'a multiple of $\\varepsilon_{ijk}$',
        4: 'a combination $\\alpha\\delta_{ij}\\delta_{kl} + \\beta\\delta_{ik}\\delta_{jl} + \\gamma\\delta_{il}\\delta_{jk}$',
        any: 'any symmetric tensor',
      };
      const why = {
        1: 'A non-zero vector picks out a direction, which a rotation would change.',
        2: 'Only $c\\,\\delta_{ij}$ looks the same in every frame; this is why an isotropic medium has $J_i = \\sigma E_i$ with a single conductivity.',
        3: 'Under proper rotations $\\varepsilon\'_{ijk} = \\det R\\,\\varepsilon_{ijk} = \\varepsilon_{ijk}$; up to a factor it is the only one.',
        4: 'All isotropic rank-4 tensors are built from pairs of Kronecker deltas; for an isotropic elastic solid this leaves only two constants (Lamé) once symmetry is used.',
      };
      return { q: `In three dimensions, a rank-${rank} Cartesian tensor whose components are the same in every frame obtained by a proper rotation must be`, ...matchOne(r, L, [null, String(rank), why[rank]]),
        trap: 'Isotropy forces a tensor to be built from $\\delta_{ij}$ and $\\varepsilon_{ijk}$ alone.' };
    } },
  { id: 'tns-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'index notation', format: 'which is NOT',
    make(r) {
      const not = r() < 0.6;
      const m = oneOf(r, [
        ['$A_i = B_{ij}C_j$', true, 'Free index $i$ on both sides; $j$ is summed.'],
        ['$T_{ij} = a_ib_j$', true, 'Free indices $i, j$ on both sides.'],
        ['$s = A_{ii}$', true, 'All indices summed: a scalar equals a scalar.'],
        ['$C_{ik} = A_{ij}B_{jk}$', true, 'Matrix product: free $i, k$ both sides.'],
        ['$v_i = \\varepsilon_{ijk}a_jb_k$', true, 'Cross product: free $i$, summed $j, k$.'],
        ['$A_i = B_{jj}$', false, 'The left has a free index $i$, the right none.'],
        ['$T_{ij} = a_ib_k$', false, 'Free indices do not match: $j$ on the left, $k$ on the right.'],
        ['$s = A_{ij}B_{jk}$', false, 'The right side still has free indices $i$ and $k$.'],
        ['$s = a_ib_ic_i$', false, 'An index may appear at most twice in a term.'],
      ], not);
      return { q: `Which equation is ${not ? '<b>NOT</b> a valid' : 'a valid'} tensor equation in index notation (summation convention)?`, ...m,
        trap: 'Every term must carry the same free indices, and no index may appear more than twice in a term.' };
    } },
];
