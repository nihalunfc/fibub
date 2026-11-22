// Round 4 extras for tensors: original questions, written 2026-11-22.
import { int, choose, shuffle, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'tns-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'counting components',
      q: R`A general (not symmetric) rank-2 tensor in three dimensions has how many components?`,
      options: [R`$6$`, R`$9$`, R`$3$`, R`$27$`], answer: 1,
      sol: R`Each of the two indices takes 3 values: $3^2 = 9$ components $T_{ij}$. (Symmetry would cut this to 6; rank 3 would give 27.)`,
      trap: R`6 is the count for a SYMMETRIC rank-2 tensor.` },
    { id: 'tns-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'Kronecker delta',
      q: R`With the summation convention, $\delta_{ij}A_j$ equals`,
      options: [R`$A_i$`, R`$3A_i$`, R`$A_j\delta_{ii}$`, R`$A_iA_j$`], answer: 0,
      sol: R`The sum over $j$ has only one non-zero term, $j = i$, where $\delta_{ii}$ (no sum) is 1. So $\delta_{ij}A_j = A_i$: the Kronecker delta renames an index.`,
      trap: R`$\delta_{ii}$ with the sum is 3, but here $i$ is a free index and is not summed.` },
    { id: 'tns-r4-03', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'contraction', format: 'integer',
      q: R`$T_{ij} = A_iB_j$ with $\mathbf A = (1, 2, 3)$ and $\mathbf B = (1, 0, -1)$. The trace $T_{ii}$ (summed) is ______.`,
      answer: -2, tol: 0, calc: () => 1 * 1 + 2 * 0 + 3 * -1,
      sol: R`$T_{ii} = A_iB_i = \mathbf A\cdot\mathbf B = 1 + 0 - 3 = -2$. Contracting the two indices of an outer product gives the dot product.`,
      trap: R`Adding all nine components $A_iB_j$ gives $(\sum A)(\sum B) = 0$, not the trace.` },
    { id: 'tns-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'symmetry',
      q: R`$S_{ij}$ is symmetric and $A_{ij}$ is antisymmetric (3D, summation convention). The full contraction $S_{ij}A_{ij}$ is`,
      options: [R`always positive`, R`always negative`, R`impossible to find without the components`, R`$0$`], answer: 3,
      sol: R`Rename the dummy indices $i\leftrightarrow j$: $S_{ij}A_{ij} = S_{ji}A_{ji} = (S_{ij})(-A_{ij}) = -S_{ij}A_{ij}$. A number equal to its own negative is 0.`,
      trap: R`Renaming summed indices is always allowed; it is the key step, not a trick.` },
    { id: 'tns-r4-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'invariants', format: 'integer',
      q: R`For $\sigma = \begin{pmatrix}2 & 1 & 0\\ 1 & 3 & 1\\ 0 & 1 & 1\end{pmatrix}$, the second invariant $I_2 = \tfrac12\left[(\sigma_{ii})^2 - \sigma_{ij}\sigma_{ij}\right]$ is ______.`,
      answer: 9, tol: 0, calc: () => (36 - 18) / 2,
      sol: R`$\sigma_{ii} = 2 + 3 + 1 = 6$. $\sigma_{ij}\sigma_{ij}$ is the sum of the squares of all entries: $4 + 1 + 0 + 1 + 9 + 1 + 0 + 1 + 1 = 18$. So $I_2 = \tfrac12(36 - 18) = 9$. It equals the sum of the principal $2\times2$ minors: $(6 - 1) + (2 - 0) + (3 - 1) = 9$, and is unchanged by rotations.`,
      trap: R`Squaring only the diagonal entries for $\sigma_{ij}\sigma_{ij}$ (giving 14) forgets the off-diagonal terms, which each appear twice.` },
    { id: 'tns-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'pseudotensors', format: 'statements',
      q: R`Under spatial inversion ($\mathbf r\to-\mathbf r$, $t$ unchanged), which statements are true?`,
      options: [R`$\mathbf E\cdot\mathbf B$ is a pseudoscalar`, R`$\mathbf B$ is an axial (pseudo) vector`, R`$\mathbf r\times\mathbf B$ is an axial vector`, R`$|\mathbf B|^2$ is a true scalar`], answer: [0, 1, 3],
      sol: R`$\mathbf E$ flips sign (polar vector: it is a force per charge). $\mathbf B$ does not flip: $\mathbf F = q\mathbf v\times\mathbf B$ with $\mathbf F$, $\mathbf v$ both flipping requires it, so $\mathbf B$ is axial. Then $\mathbf E\cdot\mathbf B$ flips: a pseudoscalar. $\mathbf r\times\mathbf B$ flips (polar $\times$ axial), so it is a POLAR vector. $|\mathbf B|^2$ is unchanged: a true scalar.`,
      trap: R`A cross product is not automatically axial: axial $\times$ polar is polar.` },
    { id: 'tns-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'inertia tensor',
      q: R`A thin uniform rod of mass 3 kg and length 2 m has its centre at the origin and lies along the direction $\hat n = (1, 1, 0)/\sqrt2$. Using $I_{ij} = \tfrac{ML^2}{12}(\delta_{ij} - n_in_j)$, the product of inertia $I_{xy}$ is ______ kg m$^2$ (one decimal place).`,
      answer: -0.5, tol: 0.01, calc: () => ((3 * 4) / 12) * (0 - 0.5),
      sol: R`$\frac{ML^2}{12} = \frac{3\cdot4}{12} = 1$ kg m$^2$. Off the diagonal $\delta_{xy} = 0$ and $n_xn_y = \tfrac12$, so $I_{xy} = -\tfrac12 = -0.5$ kg m$^2$. (The formula follows from $I_{ij} = \int(r^2\delta_{ij} - x_ix_j)\,dm$ with $\mathbf r = s\hat n$ along the rod: $\int s^2dm = ML^2/12$.)`,
      trap: R`Products of inertia carry a minus sign: $I_{xy} = -\int xy\,dm$.` },
    { id: 'tns-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'index notation',
      q: R`In index notation, the $i$th component of $\nabla\times(\nabla\times\mathbf A)$ is`,
      options: [R`$\partial_j\partial_jA_i - \partial_i\partial_jA_j$`, R`$\partial_i\partial_jA_j + \partial_j\partial_jA_i$`, R`$\partial_i\partial_jA_j - \partial_j\partial_jA_i$`, R`$\varepsilon_{ijk}\partial_j\partial_kA_i$`], answer: 2,
      sol: R`$[\nabla\times(\nabla\times\mathbf A)]_i = \varepsilon_{ijk}\partial_j\varepsilon_{klm}\partial_lA_m$. With $\varepsilon_{ijk}\varepsilon_{klm} = \varepsilon_{kij}\varepsilon_{klm} = \delta_{il}\delta_{jm} - \delta_{im}\delta_{jl}$: $\partial_j\partial_iA_j - \partial_j\partial_jA_i = \partial_i(\nabla\cdot\mathbf A) - \nabla^2A_i$.`,
      trap: R`Cycling the indices to bring $k$ to the front is needed before using the $\varepsilon\varepsilon$ identity; a slip there swaps the two terms.` },
    { id: 'tns-r4-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'metric', format: 'statements',
      q: R`A two-dimensional space has line element $ds^2 = dx^2 + 4\,dx\,dy + dy^2$. Which statements are true?`,
      options: [R`$g_{xy} = 2$`, R`The metric is positive definite`, R`$g^{xx} = -\tfrac13$`, R`The vector with components $(1, -1)$ has squared length 0`], answer: [0, 2],
      sol: R`$ds^2 = g_{ij}dx^idx^j$ counts the cross term twice: $2g_{xy} = 4$, so $g = \begin{pmatrix}1 & 2\\ 2 & 1\end{pmatrix}$. Its determinant is $-3 < 0$, so its eigenvalues ($3$ and $-1$) have opposite signs: not positive definite (it is Lorentzian). The inverse is $\frac{1}{-3}\begin{pmatrix}1 & -2\\ -2 & 1\end{pmatrix}$, so $g^{xx} = -\tfrac13$. For $v = (1, -1)$: $g_{ij}v^iv^j = 1 - 4 + 1 = -2$, not 0.`,
      trap: R`Reading $g_{xy} = 4$ straight from the line element forgets the symmetric double counting.` },
    { id: 'tns-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'curvature',
      q: R`The Riemann tensor in $n$ dimensions has $n^2(n^2 - 1)/12$ independent components. In three dimensions this is`,
      options: [R`$9$`, R`$6$`, R`$3$`, R`$20$`], answer: 1,
      sol: R`$\frac{9\cdot8}{12} = 6$, the same as the number of components of the symmetric Ricci tensor in 3D. That is why in three dimensions the Ricci tensor fixes the whole curvature (there is no Weyl part). In 4D the count is 20; in 2D it is 1 (just the Gaussian curvature).`,
      trap: R`20 is the familiar four-dimensional count.` },
    { id: 'tns-r4-11', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'curvature',
      q: R`For the surface of a sphere of radius $a = 2$ (metric $ds^2 = a^2(d\theta^2 + \sin^2\theta\,d\phi^2)$), the Ricci scalar is ______ (one decimal place).`,
      answer: 0.5, tol: 0.01, calc: () => 2 / 2 ** 2,
      sol: R`For a 2D surface the Ricci scalar is twice the Gaussian curvature: $R = 2K = 2/a^2$. With $a = 2$: $R = 0.5$. (From the Christoffel symbols $\Gamma^\theta_{\phi\phi} = -\sin\theta\cos\theta$ and $\Gamma^\phi_{\theta\phi} = \cot\theta$ one gets $R_{\theta\phi\theta\phi} = a^2\sin^2\theta$ and $R = 2/a^2$.)`,
      trap: R`Quoting the Gaussian curvature $1/a^2 = 0.25$ misses the factor 2.` },
    { id: 'tns-r4-12', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'rotation of tensors', format: 'integer',
      q: R`A 2D tensor has components $T = \begin{pmatrix}1 & 2\\ 3 & 4\end{pmatrix}$. The axes are rotated by $+90^\circ$, so that $x'_1 = x_2$ and $x'_2 = -x_1$. The new component $T'_{12}$ is ______.`,
      answer: -3, tol: 0, calc: () => 1 * -1 * 3,
      sol: R`$T'_{ij} = R_{ik}R_{jl}T_{kl}$ with $R = \begin{pmatrix}0 & 1\\ -1 & 0\end{pmatrix}$ (rows give the new axes in old components). $T'_{12} = R_{1k}R_{2l}T_{kl}$; only $R_{12} = 1$ and $R_{21} = -1$ are non-zero, so $T'_{12} = (1)(-1)T_{21} = -3$. In matrix form $T' = RTR^{\mathsf T} = \begin{pmatrix}4 & -3\\ -2 & 1\end{pmatrix}$.`,
      trap: R`Transforming only one index (as for a vector) gives a wrong component; each index gets its own $R$.` },
  ],
  gens: [
    { id: 'tns-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'four-vectors',
      make(r) {
        const A = [int(r, 2, 6), int(r, -2, 2), int(r, -2, 2), int(r, -1, 2)], B = [int(r, 1, 5), int(r, -2, 3), int(r, -2, 2), int(r, -2, 2)];
        const kind = choose(r, ['norm', 'dot']);
        const dot = (u, v) => u[0] * v[0] - u[1] * v[1] - u[2] * v[2] - u[3] * v[3];
        const v = kind === 'norm' ? dot(A, A) : dot(A, B);
        return { q: kind === 'norm'
            ? R`With $\eta_{\mu\nu} = \text{diag}(1, -1, -1, -1)$, the four-vector $A^\mu = (${A.join(', ')})$ has invariant $A_\mu A^\mu$ = ______.`
            : R`With $\eta_{\mu\nu} = \text{diag}(1, -1, -1, -1)$, the four-vectors $A^\mu = (${A.join(', ')})$ and $B^\mu = (${B.join(', ')})$ have $A_\mu B^\mu$ = ______.`,
          answer: v, tol: 0, A, B, kind,
          sol: kind === 'norm'
            ? R`Lower the index with $\eta$: $A_\mu = (${A[0]}, ${-A[1]}, ${-A[2]}, ${-A[3]})$. Then $A_\mu A^\mu = ${A[0] ** 2} - ${A[1] ** 2} - ${A[2] ** 2} - ${A[3] ** 2} = ${v}$${v > 0 ? ' (timelike)' : v < 0 ? ' (spacelike)' : ' (lightlike)'}. Every observer finds the same value.`
            : R`$A_\mu B^\mu = A^0B^0 - \mathbf A\cdot\mathbf B = ${A[0] * B[0]} - [(${A[1] * B[1]}) + (${A[2] * B[2]}) + (${A[3] * B[3]})] = ${v}$, the same in every inertial frame.`,
          trap: 'Adding all four products (Euclidean dot product) ignores the minus signs of the metric.' };
      },
      verify: (p) => {
        // boost both vectors along x with beta = 0.6 and recompute: the invariant must not change
        const b = 0.6, g = 1 / Math.sqrt(1 - b * b), boost = (u) => [g * (u[0] - b * u[1]), g * (u[1] - b * u[0]), u[2], u[3]];
        const u = boost(p.A), w = boost(p.kind === 'norm' ? p.A : p.B);
        return u[0] * w[0] - u[1] * w[1] - u[2] * w[2] - u[3] * w[3];
      } },
    { id: 'tns-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'metric',
      make(r) {
        const a = int(r, 1, 5), b = choose(r, [-2, -1, 1, 2, 3]), c0 = int(r, 1, 6), c = a * c0 - b * b === 0 ? c0 + 1 : c0, comp = choose(r, ['xx', 'xy', 'yy']);
        const D = a * c - b * b, inv = { xx: c / D, xy: -b / D, yy: a / D }, v = inv[comp];
        const cross = 2 * b;
        return { q: R`A two-dimensional space has line element $ds^2 = ${a === 1 ? '' : a}\,dx^2 ${cross < 0 ? '-' : '+'} ${Math.abs(cross)}\,dx\,dy + ${c === 1 ? '' : c}\,dy^2$. The component $g^{${comp[0]}${comp[1]}}$ of the inverse metric is ______ (four decimal places).`,
          answer: round(v, 4), tol: 0.0002, a, b, c, comp,
          sol: R`The cross term counts $g_{xy}$ twice, so $g = \begin{pmatrix}${a} & ${b}\\ ${b} & ${c}\end{pmatrix}$ with determinant $${a}\cdot${c} - (${b})^2 = ${D}$. The inverse of a $2\times2$ matrix: $g^{-1} = \frac{1}{${D}}\begin{pmatrix}${c} & ${-b}\\ ${-b} & ${a}\end{pmatrix}$. So $g^{${comp}} = ${round(v, 4)}$.`,
          trap: 'Taking $g_{xy}$ as the full coefficient of $dx\\,dy$ (twice too big), or inverting each component separately ($g^{xx} = 1/g_{xx}$ holds only for a diagonal metric).' };
      },
      verify: (p) => {
        // solve g * col = e_k by elimination
        const g11 = p.a, g12 = p.b, g22 = p.c;
        const col = (e1, e2) => { const y = (e2 - (g12 / g11) * e1) / (g22 - (g12 * g12) / g11); return [(e1 - g12 * y) / g11, y]; };
        return p.comp === 'xx' ? col(1, 0)[0] : p.comp === 'xy' ? col(0, 1)[0] : col(0, 1)[1];
      } },
    { id: 'tns-r4g3', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'pseudotensors',
      make(r) {
        const vecs = [['\\mathbf r', -1, 'position'], ['\\mathbf p', -1, 'momentum'], ['\\mathbf E', -1, 'electric field'], ['\\mathbf L', 1, 'angular momentum'], ['\\mathbf B', 1, 'magnetic field'], ['\\boldsymbol\\omega', 1, 'angular velocity']];
        const [X, Y, Z] = shuffle(r, vecs);
        const form = choose(r, ['dot', 'cross', 'triple']);
        let expr, sign, isScalar;
        if (form === 'dot') { expr = `${X[0]}\\cdot${Y[0]}`; sign = X[1] * Y[1]; isScalar = true; }
        else if (form === 'cross') { expr = `${X[0]}\\times${Y[0]}`; sign = X[1] * Y[1]; isScalar = false; }
        else { expr = `(${X[0]}\\times${Y[0]})\\cdot${Z[0]}`; sign = X[1] * Y[1] * Z[1]; isScalar = true; }
        const opts = ['a true scalar', 'a pseudoscalar', 'a polar (true) vector', 'an axial (pseudo) vector'];
        const correct = isScalar ? (sign > 0 ? 0 : 1) : (sign < 0 ? 2 : 3);
        const kind = (v) => (v[1] < 0 ? 'polar (it flips)' : 'axial (it does not flip)');
        const used = form === 'triple' ? [X, Y, Z] : [X, Y];
        return { q: R`Under spatial inversion ($\mathbf r\to-\mathbf r$), the quantity $${expr}$ behaves as`, options: opts, answer: correct,
          sol: R`Track the sign each factor picks up under inversion. ${used.map((v) => `$${v[0]}$ (${v[2]}) is ${kind(v)}`).join('; ')}. Dot and cross products are bilinear, so the result picks up the product of the signs: ${sign > 0 ? '$+1$' : '$-1$'}. ${isScalar ? `A scalar that ${sign > 0 ? 'keeps' : 'reverses'} its sign is ${sign > 0 ? 'a true scalar' : 'a pseudoscalar'}.` : `A vector that ${sign < 0 ? 'reverses' : 'keeps'} its components is ${sign < 0 ? 'polar' : 'axial'}.`}`,
          trap: 'A cross product is not automatically axial: count the signs of its factors.' };
      } },
  ],
};
