// Round 4 extras for reciprocal-lattice: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'], JG = ['jam', 'gate', 'net'];

// Number of points (h, k, l) of a simple cubic reciprocal lattice (spacing 2*pi/a) with |G| <= gmax (both in Å units).
function countG(a, gmax) {
  const lim = (gmax * a / (2 * Math.PI)) ** 2, m = Math.floor(Math.sqrt(lim));
  let n = 0;
  for (let h = -m; h <= m; h++) for (let k = -m; k <= m; k++) for (let l = -m; l <= m; l++) if (h * h + k * k + l * l <= lim + 1e-9) n++;
  return n;
}

export default {
  items: [
    { id: 'rl-r4-01', type: 'mcq', level: 1, exams: JG, sub: 'definition',
      q: R`Starting from a Bravais lattice, the reciprocal lattice is built, and then the reciprocal lattice of that reciprocal lattice is built (same definition, $\vec a_i\cdot\vec b_j = 2\pi\delta_{ij}$). The result is`,
      options: [R`the original lattice`, R`the original lattice scaled by $2\pi$`, R`the original lattice rotated by $90^\circ$`, R`a different lattice in general`], answer: 0,
      sol: R`The defining relation $\vec a_i\cdot\vec b_j = 2\pi\delta_{ij}$ is symmetric between the two sets of vectors: the $\vec a_i$ satisfy exactly the condition required of the reciprocal vectors of the $\vec b_j$. So taking the reciprocal twice returns the original lattice, just as a double Fourier transform returns the original function.`,
      trap: R`The factor $2\pi$ appears once in each direction and does not pile up.` },
    { id: 'rl-r4-02', type: 'msq', level: 2, exams: JG, sub: 'Brillouin zone', format: 'statements',
      q: R`A 1D chain of $N = 100$ cells, lattice constant $a = 0.50$ nm, obeys periodic boundary conditions. Which statements about the allowed wave vectors are correct?`,
      options: [R`Neighbouring allowed $k$ values are $0.126$ nm$^{-1}$ apart.`, R`The first Brillouin zone holds exactly $100$ allowed $k$ values.`, R`$k = +\pi/a$ and $k = -\pi/a$ are two different states, both counted in the zone.`, R`The first Brillouin zone is $4\pi/a$ wide.`], answer: [0, 1],
      sol: R`Periodicity over $Na$ gives $k = 2\pi m/Na$, spaced by $2\pi/(100\times0.50\text{ nm}) = 0.126$ nm$^{-1}$. The zone runs from $-\pi/a$ to $\pi/a$, width $2\pi/a$, and holds $(2\pi/a)/(2\pi/Na) = N = 100$ values. $\pi/a$ and $-\pi/a$ differ by the reciprocal-lattice vector $2\pi/a$, so they are the same state and are counted once.`,
      trap: R`The two zone edges are one point in $k$-space, not two.` },
    { id: 'rl-r4-03', type: 'mcq', level: 2, exams: JG, sub: '2D reciprocal',
      q: R`A 2D rectangular lattice has $a = 3$ Å along $x$ and $b = 6$ Å along $y$. Its first Brillouin zone is a rectangle that is`,
      options: [R`longer along $k_y$, with sides $2\pi/3$ and $2\pi/6$ Å$^{-1}$`, R`longer along $k_x$, with sides $2\pi/3$ and $2\pi/6$ Å$^{-1}$`, R`a square of side $2\pi/4.5$ Å$^{-1}$`, R`longer along $k_x$, with sides $6$ and $3$ Å$^{-1}$`], answer: 1,
      sol: R`The reciprocal vectors are $\vec b_1 = (2\pi/a)\hat x$ and $\vec b_2 = (2\pi/b)\hat y$. The zone is the rectangle $|k_x|\le\pi/a$, $|k_y|\le\pi/b$, with sides $2\pi/3$ along $k_x$ and $2\pi/6$ along $k_y$. The short real-space direction becomes the long direction in $k$-space.`,
      trap: R`Reciprocal space inverts lengths: the longer real axis gives the shorter zone side.` },
    { id: 'rl-r4-04', type: 'nat', level: 3, exams: G, sub: 'non-cubic spacing', unit: 'Å⁻¹',
      q: R`An orthorhombic crystal has $a = 3.0$ Å, $b = 4.0$ Å and $c = 5.0$ Å. The length of the reciprocal-lattice vector $\vec G_{123}$ is ______ Å$^{-1}$ (to two decimal places).`,
      answer: 5.34, tol: 0.02, calc: () => 2 * Math.PI * Math.sqrt(1 / 9 + 4 / 16 + 9 / 25),
      sol: R`For orthogonal axes, $\vec G_{hkl} = 2\pi(h/a, k/b, l/c)$. $|\vec G_{123}| = 2\pi\sqrt{(1/3)^2 + (2/4)^2 + (3/5)^2} = 2\pi\sqrt{0.1111 + 0.25 + 0.36} = 2\pi\times0.8492 = 5.34$ Å$^{-1}$, so $d_{123} = 2\pi/|\vec G| = 1.18$ Å.`,
      trap: R`Using $\sqrt{h^2 + k^2 + l^2}/a$ with one lattice constant only works for cubic crystals.` },
    { id: 'rl-r4-05', type: 'mcq', level: 3, exams: G, sub: 'zone volume',
      q: R`Which of these statements about the reciprocal lattice and Brillouin zone is NOT correct?`,
      options: [R`The volume of the first Brillouin zone times the volume of a primitive cell equals $(2\pi)^3$.`, R`Compressing a crystal so that its primitive cell volume halves doubles the volume of its first Brillouin zone.`, R`The first Brillouin zone of the bcc lattice has the same shape as the Wigner-Seitz cell of the fcc lattice.`, R`Adding a second kind of atom to the basis changes the reciprocal lattice.`], answer: 3,
      sol: R`$V_{BZ} = (2\pi)^3/V_{\rm cell}$, so halving the cell doubles the zone. The reciprocal of bcc is fcc, and the first zone is the Wigner-Seitz cell of the reciprocal lattice, a rhombic dodecahedron in both cases. The reciprocal lattice depends only on the Bravais lattice (the translations), not on the atoms in the basis: the basis enters only through the structure factor, which can make some $\vec G$ give zero intensity.`,
      trap: R`Missing reflections do not remove points from the reciprocal lattice; they only have zero structure factor.` },
    { id: 'rl-r4-06', type: 'nat', level: 3, exams: G, sub: 'hexagonal zone', unit: 'Å⁻²',
      q: R`Graphene has a 2D hexagonal (triangular) Bravais lattice with $a = 2.46$ Å. The area of its first Brillouin zone is ______ Å$^{-2}$ (to two decimal places).`,
      answer: 7.53, tol: 0.02, calc: () => (2 * Math.PI) ** 2 / (Math.sqrt(3) / 2 * 2.46 ** 2),
      sol: R`In 2D the zone area is $(2\pi)^2/A_{\rm cell}$. The primitive cell is a rhombus of area $\tfrac{\sqrt3}{2}a^2 = 0.8660\times6.0516 = 5.241$ Å$^2$. So $A_{BZ} = 39.48/5.241 = 7.53$ Å$^{-2}$. The zone is a hexagon with $\Gamma$-K distance $4\pi/3a = 1.70$ Å$^{-1}$.`,
      trap: R`The cell of graphene holds two carbon atoms, but the zone depends only on the area of the primitive cell of the lattice.` },
    { id: 'rl-r4-07', type: 'mcq', level: 4, exams: G, sub: 'reciprocal of fcc',
      q: R`For an fcc lattice with cube edge $a$, the X point of the Brillouin zone is $\vec k = \tfrac{2\pi}a(1, 0, 0)$. Which of these points is equivalent to it (differs from it by a reciprocal-lattice vector)?`,
      options: [R`$\tfrac{2\pi}a(0, 1, 0)$`, R`$\tfrac{2\pi}a(1, 1, 0)$`, R`$\tfrac{2\pi}a(-1, 0, 0)$`, R`$\tfrac{2\pi}a(\tfrac12, \tfrac12, \tfrac12)$`], answer: 2,
      sol: R`The reciprocal lattice of fcc is bcc: $\vec G = \tfrac{2\pi}a(h, k, l)$ with $h, k, l$ all even or all odd. Differences from X: to $(0,1,0)$ is $(-1, 1, 0)$, mixed, not allowed; to $(1,1,0)$ is $(0, 1, 0)$, mixed; to $(-1,0,0)$ is $(-2, 0, 0)$, all even, allowed; to $(\tfrac12,\tfrac12,\tfrac12)$ is not even an integer vector. So opposite X points are the same point, while the three X points along $x$, $y$ and $z$ are distinct.`,
      trap: R`Symmetry-related points (same energy by symmetry) are not necessarily equivalent (the same state).` },
    { id: 'rl-r4-08', type: 'nat', level: 4, exams: G, sub: 'Ewald limit',
      q: R`A simple cubic crystal has $a = 4.0$ Å. The number of reciprocal-lattice points (including the origin) with $|\vec G|\le4.0$ Å$^{-1}$ is ______.`,
      answer: 81, tol: 0, calc: () => countG(4.0, 4.0),
      sol: R`$|\vec G| = \tfrac{2\pi}a\sqrt N$ with $N = h^2 + k^2 + l^2$, so we need $N\le(4.0\times4.0/2\pi)^2 = 6.48$. Counting points: $N = 0$: $1$; $1$: $6$; $2$: $12$; $3$: $8$; $4$: $6$; $5$: $24$; $6$: $24$. Total $81$. (The volume estimate $\tfrac43\pi(4.0)^3/(2\pi/4)^3 = 69$ is rough at such small numbers.)`,
      trap: R`Counting families $\{hkl\}$ instead of individual points, or forgetting the negative indices.` },
    { id: 'rl-r4-09', type: 'msq', level: 4, exams: G, sub: 'conventional indices', format: 'statements',
      q: R`Using the conventional cubic (or orthorhombic) cell with $\vec G = 2\pi(h/a, k/b, l/c)$, which rules for the indices of true reciprocal-lattice vectors are correct?`,
      options: [R`bcc: $h + k + l$ even.`, R`fcc: $h, k, l$ all even or all odd.`, R`C-centred (extra point at the centre of the $ab$ face): $h + k$ even.`, R`bcc: $h, k, l$ all even or all odd.`], answer: [0, 1, 2],
      sol: R`A vector is in the reciprocal lattice when $e^{i\vec G\cdot\vec R} = 1$ for every lattice translation, including the centring ones. bcc adds $(\tfrac12,\tfrac12,\tfrac12)$: $\pi(h + k + l)$ must be a multiple of $2\pi$. fcc adds $(\tfrac12,\tfrac12,0)$ and its permutations: $h + k$, $k + l$, $h + l$ all even, i.e. all of one parity. C-centring adds $(\tfrac12,\tfrac12,0)$ only: $h + k$ even. The all-same-parity rule belongs to fcc, not bcc.`,
      trap: R`The bcc and fcc rules are easily swapped; check them against the centring vectors.` },
    { id: 'rl-r4-10', type: 'nat', level: 5, exams: G, sub: 'Fermi sphere in zone',
      q: R`A metal has a bcc lattice (one atom per lattice point). In the free-electron model, the number of electrons per atom for which the Fermi sphere just touches the nearest faces of the first Brillouin zone (at the N points) is ______ (to three decimal places).`,
      answer: 1.481, tol: 0.003, calc: () => Math.SQRT2 * Math.PI / 3,
      sol: R`The reciprocal lattice is fcc with shortest $\vec G = \tfrac{2\pi}a(1, 1, 0)$, so the nearest faces are $|\vec G|/2 = \sqrt2\pi/a$ from $\Gamma$. The primitive cell holds $a^3/2$, so $V_{BZ} = 16\pi^3/a^3$ and the zone holds $2$ electron states (with spin) per atom. Electrons per atom $= 2\times\dfrac{\tfrac43\pi(\sqrt2\pi/a)^3}{16\pi^3/a^3} = \dfrac{\sqrt2\pi}3 = 1.481$. Monovalent bcc metals (Na, K) have spherical Fermi surfaces well inside the zone; at $1.48$ electrons per atom the sphere would reach the faces.`,
      trap: R`The nearest face of the bcc zone is at $\sqrt2\pi/a$, not $\pi/a$.` },
  ],
  gens: [
    { id: 'rl-r4g1', type: 'nat', level: 3, exams: G, sub: 'non-cubic spacing', unit: 'Å⁻¹',
      make(r) {
        const a = pick(r, 2.5, 6, 0.1), b = pick(r, 2.5, 6, 0.1), c = pick(r, 2.5, 8, 0.1), h = int(r, 0, 3), k = int(r, 0, 3), l = int(r, 1, 3);
        const Gl = 2 * Math.PI * Math.sqrt((h / a) ** 2 + (k / b) ** 2 + (l / c) ** 2);
        return { q: `An orthorhombic crystal has $a = ${a}$ Å, $b = ${b}$ Å and $c = ${c}$ Å. The length of the reciprocal-lattice vector $\\vec G_{${h}${k}${l}}$ is ______ Å$^{-1}$ (to two decimal places).`,
          answer: round(Gl, 2), tol: Math.max(0.01, round(Gl * 0.003, 2)), a, b, c, h, k, l,
          sol: `$|\\vec G_{hkl}| = 2\\pi\\sqrt{(h/a)^2 + (k/b)^2 + (l/c)^2} = 2\\pi\\sqrt{${round((h / a) ** 2, 4)} + ${round((k / b) ** 2, 4)} + ${round((l / c) ** 2, 4)}} = ${round(Gl, 2)}$ Å$^{-1}$, so $d_{${h}${k}${l}} = 2\\pi/|\\vec G| = ${round(2 * Math.PI / Gl, 3)}$ Å.`,
          trap: 'Each index goes with its own lattice constant.' };
      },
      verify: (p) => 2 * Math.PI * Math.sqrt((p.h / p.a) ** 2 + (p.k / p.b) ** 2 + (p.l / p.c) ** 2) },
    { id: 'rl-r4g2', type: 'nat', level: 4, exams: G, sub: 'Ewald limit',
      make(r) {
        const a = pick(r, 2.5, 6, 0.05), gm = pick(r, 2, 5, 0.1), n = countG(a, gm), lim = (gm * a / (2 * Math.PI)) ** 2;
        return { q: `A simple cubic crystal has $a = ${a}$ Å. The number of reciprocal-lattice points (including the origin) with $|\\vec G|\\le${gm}$ Å$^{-1}$ is ______.`,
          answer: n, tol: 0, a, gm,
          sol: `$|\\vec G| = (2\\pi/a)\\sqrt{h^2 + k^2 + l^2}$, so we need $h^2 + k^2 + l^2\\le(${gm}\\times${a}/2\\pi)^2 = ${round(lim, 3)}$. Counting every integer triple, signs and orders separately, gives $${n}$ points. (Volume estimate: $\\tfrac43\\pi(${gm})^3/(2\\pi/${a})^3\\approx${Math.round((4 / 3) * Math.PI * lim ** 1.5)}$.)`,
          trap: 'Count individual points (all signs and permutations), not families.' };
      },
      verify: (p) => countG(p.a, p.gm) },
    { id: 'rl-r4g3', type: 'nat', level: 4, exams: G, sub: 'Fermi sphere in zone', unit: 'eV',
      make(r) {
        const [lat, f, tex, pt] = choose(r, [['simple cubic', 1, '\\pi/a', 'X'], ['body-centred cubic', Math.SQRT2, '\\sqrt2\\pi/a', 'N'], ['face-centred cubic', Math.sqrt(3), '\\sqrt3\\pi/a', 'L']]), a = pick(r, 2.8, 6, 0.01);
        const k = f * Math.PI / (a / 10), E = 0.0381 * k * k;
        return { q: `A ${lat} metal has cube edge $a = ${a}$ Å. With $\\hbar^2/2m_e = 0.0381$ eV nm$^2$, the free-electron kinetic energy at the nearest point of the first Brillouin-zone surface (the ${pt} point, $|\\vec k| = ${tex}$) is ______ eV (to two decimal places).`,
          answer: round(E, 2), tol: Math.max(0.01, round(E * 0.003, 2)), f, a,
          sol: `$|\\vec k| = ${tex} = ${round(k, 4)}$ nm$^{-1}$ (with $a = ${round(a / 10, 4)}$ nm). $E = \\dfrac{\\hbar^2k^2}{2m_e} = 0.0381\\times${round(k * k, 3)} = ${round(E, 2)}$ eV. A Fermi energy above this would mean the free-electron sphere crosses the zone face.`,
          trap: 'The nearest zone face depends on the lattice: $\\pi/a$ only for simple cubic.' };
      },
      verify: (p) => 0.0381 * (p.f * Math.PI / (p.a / 10)) ** 2 },
  ],
};
