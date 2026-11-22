// Round 4 extras for group-theory: original questions, written 2026-11-22.
import { int, choose } from '../_util.js';
const R = String.raw;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const phi = (n) => { let c = 0; for (let k = 1; k <= n; k++) if (gcd(k, n) === 1) c++; return c; };

export default {
  items: [
    { id: 'grp-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'axioms',
      q: R`In $\mathbb Z_7$ (the integers $0, 1, \dots, 6$ under addition modulo 7), the inverse of 3 is`,
      options: [R`$3$`, R`$-3$, which is not in the set`, R`$\tfrac13$`, R`$4$`], answer: 3,
      sol: R`The identity of addition mod 7 is 0, so the inverse of 3 is the element $x$ with $3 + x \equiv 0 \pmod 7$: $x = 4$. ($-3$ and 4 are the same class mod 7; $\tfrac13$ belongs to multiplication, which is not the group operation here.)`,
      trap: R`The inverse depends on the operation: here it undoes addition, not multiplication.` },
    { id: 'grp-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'cyclic groups',
      q: R`The set $\{1, -1, i, -i\}$ under ordinary multiplication is a group isomorphic to`,
      options: [R`the Klein four-group $\mathbb Z_2\times\mathbb Z_2$`, R`$\mathbb Z_2$`, R`$\mathbb Z_4$`, 'none: it is not closed'], answer: 2,
      sol: R`It is closed ($i\cdot i = -1$, $i\cdot(-i) = 1$, ...). The element $i$ has order 4: $i, i^2 = -1, i^3 = -i, i^4 = 1$, so it generates the whole set, which is therefore cyclic of order 4. The Klein group has no element of order 4 (every non-identity element squares to the identity), but here $i^2 = -1 \ne 1$.`,
      trap: R`Two groups of order 4 exist; look for an element of order 4.` },
    { id: 'grp-r4-03', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'cyclic groups',
      q: R`The number of elements of $\mathbb Z_{12}$ (addition modulo 12) that generate the whole group is ______.`,
      answer: 4, tol: 0, calc: () => phi(12),
      sol: R`$k$ generates $\mathbb Z_{12}$ exactly when $\gcd(k, 12) = 1$, so its multiples reach every class. These are $k = 1, 5, 7, 11$: four generators (Euler's $\varphi(12) = 4$).`,
      trap: R`Odd is not enough: 3 and 9 share the factor 3 with 12.` },
    { id: 'grp-r4-04', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'abelian groups', format: 'statements',
      q: R`Consider the symmetries of a rectangle that is not a square (rotations and reflections that map it onto itself). Which statements are true?`,
      options: ['The group has 4 elements', 'The group is cyclic', R`It is isomorphic to the Klein four-group $\mathbb Z_2\times\mathbb Z_2$`, 'It is abelian'], answer: [0, 2, 3],
      sol: R`The symmetries are the identity, the $180^\circ$ rotation and the reflections in the two lines through the centre parallel to the sides: 4 elements ($90^\circ$ turns and diagonal reflections fail for a non-square). Each non-identity element is undone by repeating it (order 2), so no element has order 4: not cyclic, and so it is the Klein group, which is abelian.`,
      trap: R`The square's group $D_4$ has 8 elements; the rectangle keeps only half of them.` },
    { id: 'grp-r4-05', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'homomorphisms',
      q: R`The matrices $\begin{pmatrix} 1 & a \\ 0 & 1 \end{pmatrix}$ with $a$ real form a group under matrix multiplication. It is isomorphic to`,
      options: [R`the non-zero reals under multiplication`, R`the reals under addition`, R`$SO(2)$`, R`$\mathbb Z$ under addition`], answer: 1,
      sol: R`$\begin{pmatrix} 1 & a \\ 0 & 1 \end{pmatrix}\begin{pmatrix} 1 & b \\ 0 & 1 \end{pmatrix} = \begin{pmatrix} 1 & a + b \\ 0 & 1 \end{pmatrix}$, so $a\mapsto$ the matrix turns addition into multiplication, one to one and onto: $(\mathbb R, +)$. The non-zero reals under multiplication contain $-1$, an element of order 2, which $(\mathbb R, +)$ lacks. $SO(2)$ is compact (angles wrap round), and $\mathbb Z$ is countable, so neither matches.`,
      trap: R`These shear matrices never return to the identity, unlike rotations.` },
    { id: 'grp-r4-06', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'subgroups',
      q: R`Count the rotations (not reflections) that map a cube onto itself, using orbit and stabiliser: any face can be moved to any of the 6 face positions, and the rotations that keep one face in place form a group of order 4. The rotation group of the cube has ______ elements.`,
      answer: 24, tol: 0, calc: () => 6 * 4,
      sol: R`The orbit-stabiliser theorem: $|G| = |\text{orbit}|\times|\text{stabiliser}| = 6\times4 = 24$. Check by listing: identity 1; $\pm90^\circ$ about 3 face axes: 6; $180^\circ$ about them: 3; $\pm120^\circ$ about 4 body diagonals: 8; $180^\circ$ about 6 edge axes: 6. Total 24 (the group is isomorphic to $S_4$, permuting the 4 body diagonals).`,
      trap: R`48 includes the reflections; rotations alone give 24.` },
    { id: 'grp-r4-07', type: 'nat', level: 4, exams: ['gate'], sub: 'conjugacy classes',
      q: R`The four corners of a square are each painted black or white. Two colourings count as the same if a rotation of the square turns one into the other. By Burnside's lemma (number of patterns = average number of colourings fixed by a group element), the number of different patterns is ______.`,
      answer: 6, tol: 0, calc: () => (16 + 2 + 4 + 2) / 4,
      sol: R`Rotation group $\mathbb Z_4$. The identity fixes all $2^4 = 16$ colourings. A $90^\circ$ or $270^\circ$ turn moves the corners in one 4-cycle, so only the 2 single-colour squares are fixed. The $180^\circ$ turn has two 2-cycles: $2^2 = 4$ fixed. Average: $(16 + 2 + 4 + 2)/4 = 6$. (They are: all black, all white, one black, one white, two adjacent black, two opposite black.)`,
      trap: R`Dividing $2^4$ by 4 gives 4, which is wrong: some colourings have symmetry and are counted fewer than 4 times.` },
    { id: 'grp-r4-08', type: 'mcq', level: 4, exams: ['gate'], sub: 'cyclic groups',
      q: R`Which of these direct products is cyclic?`,
      options: [R`$\mathbb Z_3\times\mathbb Z_4$`, R`$\mathbb Z_2\times\mathbb Z_4$`, R`$\mathbb Z_2\times\mathbb Z_2$`, R`$\mathbb Z_3\times\mathbb Z_3$`], answer: 0,
      sol: R`$\mathbb Z_m\times\mathbb Z_n$ is cyclic exactly when $\gcd(m, n) = 1$; then $(1, 1)$ has order $mn$. For $\mathbb Z_3\times\mathbb Z_4$, $(1, 1)$ has order $\operatorname{lcm}(3, 4) = 12$ = the group order, so it is $\mathbb Z_{12}$. In the others the largest order is the lcm, 4, 2 and 3, smaller than 8, 4 and 9.`,
      trap: R`A product of cyclic groups need not be cyclic; the orders must be coprime.` },
    { id: 'grp-r4-09', type: 'msq', level: 4, exams: ['gate'], sub: 'Lie groups', format: 'statements',
      q: R`About the orthogonal group $O(3)$ of real $3\times3$ matrices with $R^TR = I$, which statements are true?`,
      options: ['It is abelian', 'It has two connected pieces, which cannot be joined by a continuous path inside the group', R`Every element has determinant $+1$ or $-1$`, R`$SO(3)$ is a normal subgroup of index 2`], answer: [1, 2, 3],
      sol: R`$\det(R^TR) = (\det R)^2 = 1$, so $\det R = \pm1$. The determinant is continuous and can only take these two values, so rotations ($+1$) and rotation-reflections ($-1$, e.g. the inversion $-I$) form two separate pieces. $SO(3)$ is the kernel of the homomorphism $\det: O(3)\to\{\pm1\}$, so it is normal with two cosets. Rotations about different axes do not commute, so the group is not abelian.`,
      trap: R`Inversion $-I$ commutes with everything, but that does not make the whole group abelian.` },
    { id: 'grp-r4-10', type: 'nat', level: 5, exams: ['gate'], sub: 'conjugacy classes',
      q: R`Each face of a cube is painted black or white. Counting colourings that differ only by a rotation of the cube as the same, the number of different painted cubes is ______ (use Burnside's lemma with the 24 rotations).`,
      answer: 10, tol: 0, calc: () => (64 + 6 * 8 + 3 * 16 + 8 * 4 + 6 * 8) / 24,
      sol: R`A rotation fixes $2^c$ colourings, where $c$ is its number of cycles on the 6 faces. Identity: $2^6 = 64$. Six $\pm90^\circ$ face turns: cycles (top)(bottom)(4 sides) give $2^3$ each, 48. Three $180^\circ$ face turns: (top)(bottom)(2)(2): $2^4$ each, 48. Eight $\pm120^\circ$ diagonal turns: two 3-cycles, $2^2$ each, 32. Six $180^\circ$ edge turns: three 2-cycles, $2^3$ each, 48. Sum 240, divided by 24: 10.`,
      trap: R`Each rotation type must be weighted by how many rotations of that type there are.` },
  ],
  gens: [
    { id: 'grp-r4g1', type: 'nat', level: 4, exams: ['gate'], sub: 'conjugacy classes',
      make(r) {
        const n = int(r, 3, 8), k = int(r, 2, 4);
        let s = 0; const parts = [];
        for (let d = 1; d <= n; d++) if (n % d === 0) { s += phi(d) * k ** (n / d); parts.push(`${phi(d)}\\cdot${k}^{${n / d}}`); }
        const answer = s / n;
        return { q: R`A necklace has ${n} equally spaced beads on a circle, each one of ${k} colours. Counting necklaces that differ only by a rotation (not a flip) as the same, how many different necklaces are there?`,
          answer, tol: 0, n, k,
          sol: R`Burnside: average the number of colourings fixed by each rotation. A rotation by $s$ steps splits the beads into $\gcd(s, ${n})$ cycles and fixes $${k}^{\gcd(s, ${n})}$ colourings. Grouping rotations by $d = ${n}/\gcd$ (there are $\varphi(d)$ of each): $\dfrac1{${n}}\left(${parts.join(' + ')}\right) = \dfrac{${s}}{${n}} = ${answer}$.`,
          trap: 'Do not divide the total number of colourings by the group order; symmetric colourings are counted fewer times.' };
      },
      verify: (p) => { let s = 0; for (let t = 0; t < p.n; t++) s += p.k ** gcd(t, p.n); return s / p.n; } },
    { id: 'grp-r4g2', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'cyclic groups',
      make(r) {
        const n = choose(r, [12, 15, 18, 20, 24, 28, 30, 36, 40, 42]);
        const divs = []; for (let d = 2; d <= n; d++) if (n % d === 0) divs.push(d);
        const d = choose(r, divs), answer = phi(d);
        return { q: R`How many elements of $\mathbb Z_{${n}}$ (addition modulo ${n}) have order exactly ${d}?`,
          answer, tol: 0, n, d,
          sol: R`Since ${d} divides ${n}, $\mathbb Z_{${n}}$ has exactly one subgroup of order ${d}, which is cyclic, $\{0, ${n / d}, ${2 * n / d}, \dots\}$. The elements of order ${d} are its generators, and there are $\varphi(${d}) = ${answer}$ of them${d === n ? ' (they are the generators of the whole group)' : ''}.`,
          trap: 'Count generators of the order-$d$ subgroup with Euler\'s $\\varphi$, not all its elements.' };
      },
      verify: (p) => { let c = 0; for (let x = 0; x < p.n; x++) if (p.n / gcd(x, p.n) === p.d) c++; return c; } },
    { id: 'grp-r4g3', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'subgroups',
      make(r) {
        const solid = choose(r, [
          ['regular tetrahedron', 'faces', 4, 'triangles', 3], ['regular tetrahedron', 'vertices', 4, 'corners where 3 edges meet', 3],
          ['cube', 'vertices', 8, 'corners where 3 edges meet', 3], ['cube', 'edges', 12, 'edges', 2],
          ['regular octahedron', 'faces', 8, 'triangles', 3], ['regular octahedron', 'vertices', 6, 'corners where 4 edges meet', 4],
          ['regular dodecahedron', 'faces', 12, 'pentagons', 5], ['regular dodecahedron', 'edges', 30, 'edges', 2],
          ['regular icosahedron', 'vertices', 12, 'corners where 5 edges meet', 5], ['regular icosahedron', 'faces', 20, 'triangles', 3]]);
        const [name, what, N, desc, st] = solid, answer = N * st;
        return { q: R`A ${name} has ${N} ${what} (${desc}), and its rotations can carry any one of them to any other. The rotations that keep one of them in its place form a group of order ${st}. How many rotations map the ${name} onto itself?`,
          answer, tol: 0, N, st,
          sol: R`Orbit-stabiliser: $|G| = (\text{size of the orbit})\times(\text{order of the stabiliser}) = ${N}\times${st} = ${answer}$.${what === 'edges' ? ' (A rotation keeping an edge in place can only do nothing or flip it end to end: order 2.)' : ''}`,
          trap: 'The count is the same whichever kind of part you track: faces, vertices and edges all give the same group order.' };
      },
      verify: (p) => p.N * p.st },
  ],
};
