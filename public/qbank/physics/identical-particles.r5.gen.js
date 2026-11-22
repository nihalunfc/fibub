// Round 5 extras for identical-particles: original questions, written 2026-11-22.
import { int, choose } from '../_util.js';
const R = String.raw;

const hf = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
const binom = (n, k) => { if (k < 0 || k > n) return 0; let c = 1; for (let i = 0; i < k; i++) c = c * (n - i) / (i + 1); return Math.round(c); };
/** Ground energy (units of hbar^2 (2pi/L)^2 / 2m) of N fermions with g spin states on a ring. */
function ringE(N, g) { const ks = [0]; for (let k = 1; ks.length < N + 2; k++) ks.push(k, -k); let e = 0, left = N; for (const k of ks) { const t = Math.min(g, left); e += t * k * k; left -= t; if (!left) break; } return e; }
const ATOMS = [['$^{3}$He', 2, 3], ['$^{4}$He', 2, 4], ['$^{6}$Li', 3, 6], ['$^{7}$Li', 3, 7], ['$^{23}$Na', 11, 23], ['$^{40}$K', 19, 40], ['$^{41}$K', 19, 41], ['$^{87}$Rb', 37, 87], ['$^{85}$Rb', 37, 85], ['$^{133}$Cs', 55, 133], ['$^{171}$Yb', 70, 171], ['$^{174}$Yb', 70, 174], ['$^{88}$Sr', 38, 88], ['$^{87}$Sr', 38, 87]];

export default {
  items: [
    { id: 'qip-r5-01', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'composite particles',
      q: R`A neutral $^7$Li atom is built from protons, neutrons and electrons, all spin-$\tfrac12$ fermions. The total number of these constituents is ______ (and so the atom behaves as a boson or a fermion accordingly).`,
      answer: 10, tol: 0, calc: () => 3 + 4 + 3,
      sol: R`$Z = 3$ protons, $A - Z = 4$ neutrons, 3 electrons: 10 fermions. An even number of fermions makes a composite boson (its total spin is an integer, and swapping two such atoms swaps an even number of fermion pairs). So $^7$Li is a boson, while $^6$Li (9 constituents) is a fermion: both are used in cold-atom labs.`,
      trap: R`Counting only nucleons (7) gives the wrong statistics for the neutral atom; electrons count too.` },
    { id: 'qip-r5-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Slater determinants',
      q: R`Three identical fermions occupy three different orthonormal one-particle states. The normalisation factor in front of their $3\times3$ Slater determinant is`,
      options: [R`$\dfrac13$`, R`$\dfrac{1}{\sqrt3}$`, R`$\dfrac16$`, R`$\dfrac{1}{\sqrt6}$`], answer: 3,
      sol: R`The determinant is a sum of $3! = 6$ products, each a different permutation, all mutually orthogonal and each of norm 1. The total norm squared is 6, so the factor is $1/\sqrt{3!} = 1/\sqrt6$.`,
      trap: R`The count is $N!$ permutations, not $N$.` },
    { id: 'qip-r5-03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin states',
      q: R`The number of linearly independent spin states of three spin-$\tfrac12$ particles that are totally antisymmetric under every exchange is ______.`,
      answer: 0, tol: 0, calc: () => binom(2, 3),
      sol: R`A totally antisymmetric state of $N$ particles needs $N$ different one-particle states to fill a determinant. A spin $\tfrac12$ has only 2 states, so with 3 particles one is always repeated and the determinant vanishes: $\binom23 = 0$. This is why three electrons can never all share one spatial orbital: the spin part cannot supply the antisymmetry.`,
      trap: R`The total-spin-$\tfrac12$ states of three spins have mixed symmetry, not total antisymmetry.` },
    { id: 'qip-r5-04', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'spin states',
      q: R`Three spin-1 particles are combined. The number of linearly independent spin states that are totally antisymmetric under exchange of any pair is ______.`,
      answer: 1, tol: 0, calc: () => binom(3, 3),
      sol: R`Each spin 1 has 3 states ($m = 1, 0, -1$). A totally antisymmetric state uses each once: one determinant, $\binom33 = 1$. It is the total-spin-zero state (like $\epsilon_{ijk}$ built from three vectors), the only $S = 0$ state of three spin-1 particles.`,
      trap: R`Three particles with three states each can form exactly one fully antisymmetric combination, not zero.` },
    { id: 'qip-r5-05', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'exchange effects',
      q: R`Two non-interacting particles occupy different orbitals $\phi_a$ and $\phi_b$ (same spin state). Compared with distinguishable particles, the probability density of finding BOTH at the same point $x$ is, for identical bosons,`,
      options: [R`the same`, R`twice as large`, R`half as large`, R`zero`], answer: 1,
      sol: R`Bosons: $\psi = \tfrac{1}{\sqrt2}[\phi_a(x_1)\phi_b(x_2) + \phi_b(x_1)\phi_a(x_2)]$. At $x_1 = x_2 = x$: $\psi = \sqrt2\,\phi_a(x)\phi_b(x)$, so $|\psi|^2 = 2|\phi_a\phi_b|^2$, twice the distinguishable value. Fermions give zero there (the exchange hole). This bunching is seen in the Hanbury Brown-Twiss effect.`,
      trap: R`Zero is the fermion answer.` },
    { id: 'qip-r5-06', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'composite particles',
      q: R`Which of these neutral atoms behave as bosons?`,
      options: [R`$^{87}$Rb`, R`$^{23}$Na`, R`$^{40}$K`, R`$^{6}$Li`], answer: [0, 1],
      sol: R`Count protons + neutrons + electrons: $^{87}$Rb: $37 + 50 + 37 = 124$ (even, boson); $^{23}$Na: $11 + 12 + 11 = 34$ (boson); $^{40}$K: $19 + 21 + 19 = 59$ (fermion); $^6$Li: $3 + 3 + 3 = 9$ (fermion). For a neutral atom the electrons cancel the protons in parity, so the rule is simply: even neutron number means boson.`,
      trap: R`An even mass number does not decide it for a neutral atom: $^{40}$K has $A = 40$ but 21 neutrons.` },
    { id: 'qip-r5-07', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'exchange symmetry',
      q: R`In three dimensions exchanging two identical particles can only multiply the state by $\pm1$, but in two dimensions any phase $e^{i\theta}$ ("anyons") is allowed. The reason is that`,
      options: [R`in 2D the particles have no spin`, R`the exchange operator is not Hermitian in 2D`,
        R`in 2D a path that takes one particle around the other cannot be shrunk to nothing, so a double exchange need not be the identity`, R`2D systems always have a magnetic field`], answer: 2,
      sol: R`Swapping twice moves one particle around the other. In 3D that loop can be lifted over the other particle and shrunk to a point, so double exchange $= 1$ and a single exchange $= \pm1$. In 2D (with the particles' positions removed from the plane) the loop is caught around the other particle, so double exchange can carry any phase: the exchange group becomes the braid group. Anyons appear as quasiparticles in the fractional quantum Hall effect.`,
      trap: R`The $\pm1$ rule comes from topology of paths in 3D, not from spin or from the exchange operator itself.` },
    { id: 'qip-r5-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'spin states',
      q: R`Two identical spin-$\tfrac32$ particles are put in the SAME spatial orbital. Counting only spin, the number of allowed states is ______ if the particles are fermions (as they are).`,
      answer: 6, tol: 0, calc: () => binom(4, 2),
      sol: R`Same spatial orbital means a symmetric spatial part, so the spin part must be antisymmetric. With 4 one-particle spin states, antisymmetric pairs number $\binom42 = 6$: they are the total spins $S = 2$ (5 states) and $S = 0$ (1 state), the exchange-odd members of $\tfrac32\otimes\tfrac32 = 3\oplus2\oplus1\oplus0$ (a state of total $S$ built from two equal spins $s$ has exchange symmetry $(-1)^{2s - S}$). The symmetric ones ($S = 3, 1$: 10 states) are forbidden here.`,
      trap: R`The highest total spin $S = 2s$ is always symmetric, so here $S = 3$ and $S = 1$ are excluded; the allowed states are not the high-$S$ ones.` },
    { id: 'qip-r5-09', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Fermi filling',
      q: R`Four non-interacting particles are in a 1D infinite well (levels $n^2E_1$). The ground-state energy of 4 identical SPINLESS fermions divided by that of 4 spin-$\tfrac12$ fermions is ______.`,
      answer: 3, tol: 0.001, calc: () => (1 + 4 + 9 + 16) / (2 * (1 + 4)),
      sol: R`Spinless: one per level, $n = 1, 2, 3, 4$: $(1 + 4 + 9 + 16)E_1 = 30E_1$. Spin $\tfrac12$: two per level, $n = 1, 1, 2, 2$: $2(1 + 4)E_1 = 10E_1$. Ratio $= 3$. More internal states let fermions pack into lower levels.`,
      trap: R`Putting all four spin-$\tfrac12$ fermions into $n = 1$ ignores the Pauli principle: only two fit.` },
    { id: 'qip-r5-10', type: 'mcq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'exchange symmetry', format: 'not',
      q: R`Which statement about two electrons is NOT correct?`,
      options: [R`In a spin triplet state, their spatial wave function is symmetric`, R`The "exchange force" is not a new interaction; it is an effect of the required symmetry together with the Coulomb repulsion`,
        R`For two electrons in widely separated, non-overlapping wave packets, antisymmetrisation changes no measurable prediction`, R`In a spin-independent potential, if both are in the same spatial ground orbital, their spin state is the singlet`], answer: 0,
      sol: R`The total state must be antisymmetric: triplet (symmetric spin) needs an ANTISYMMETRIC spatial part, which vanishes at $\vec r_1 = \vec r_2$ and so lowers the Coulomb repulsion: the exchange energy. Non-overlapping packets give zero cross terms, so symmetrisation does nothing measurable. Same spatial orbital means symmetric space, hence antisymmetric spin: the singlet.`,
      trap: R`Spin and space symmetries are opposite for fermions.` },
  ],
  gens: [
    { id: 'qip-r5g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin states',
      make(r) {
        const s = int(r, 1, 5) / 2, N = int(r, 2, 3), sym = r() < 0.5, d = 2 * s + 1;
        const ans = sym ? binom(d + N - 1, N) : binom(d, N);
        return { q: R`${N === 2 ? 'Two' : 'Three'} spin-$${hf(s)}$ particles are combined. Counting spin states only, the number of linearly independent states that are totally ${sym ? 'symmetric' : 'antisymmetric'} under exchange is ______.`,
          answer: ans, tol: 0, s, N, sym,
          sol: R`Each particle has $2s + 1 = ${d}$ spin states. ${sym ? R`Symmetric states correspond to choosing ${N} states with repetition: $\binom{${d} + ${N} - 1}{${N}} = ${ans}$.` : R`Antisymmetric states need ${N} different states: $\binom{${d}}{${N}} = ${ans}$.`}`,
          trap: 'Symmetric counting allows repeats; antisymmetric counting does not.' };
      },
      verify: (p) => (p.sym ? binom(2 * p.s + p.N, p.N) : binom(2 * p.s + 1, p.N)) },
    { id: 'qip-r5g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Fermi filling',
      make(r) {
        const s = choose(r, [0, 0.5, 1.5]), g = 2 * s + 1, N = int(r, 2, 9);
        const e = ringE(N, g);
        return { q: R`${N} non-interacting identical spin-$${hf(s)}$ fermions move freely on a ring of circumference $L$, with one-particle energies $k^2\epsilon$, $k = 0, \pm1, \pm2, \dots$ and $\epsilon = \dfrac{\hbar^2}{2m}\left(\dfrac{2\pi}{L}\right)^2$. The ground-state energy is ______ $\epsilon$.`,
          answer: e, tol: 0, N, g,
          sol: R`Each $k$ holds $2s + 1 = ${g}$ fermions. Fill $k = 0$ first, then $k = \pm1$ (energy $\epsilon$ each), then $\pm2$ ($4\epsilon$), and so on, until all ${N} are placed. Adding $k^2$ over the filled states gives $${e}\,\epsilon$.`,
          trap: 'On a ring k and -k are different states with the same energy, and k = 0 is allowed.' };
      },
      verify: (p) => ringE(p.N, p.g) },
    { id: 'qip-r5g3', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'composite particles',
      make(r) {
        const [name, Z, A] = choose(r, ATOMS), q = choose(r, [0, 0, 1]);
        const n = Z + (A - Z) + (Z - q);
        return { q: R`${q ? `A singly charged ion ${name}$^+$` : `A neutral ${name} atom`} contains protons, neutrons and electrons. Their total number is ______, which decides whether it behaves as a boson (even) or a fermion (odd).`,
          answer: n, tol: 0, Z, A, qq: q,
          sol: R`Protons $${Z}$, neutrons $${A} - ${Z} = ${A - Z}$, electrons $${Z - q}$. Total $${n}$: ${n % 2 ? 'odd, a fermion' : 'even, a boson'}.`,
          trap: 'Count the electrons too, and remember an ion has lost one.' };
      },
      verify: (p) => p.A + p.Z - p.qq },
  ],
};
