// Round 4 extras for identical-particles: original questions, written 2026-11-22.
import { int, choose, round, shuffle } from '../_util.js';
const R = String.raw;

const binom = (n, k) => { if (k < 0 || k > n) return 0; let c = 1; for (let i = 0; i < k; i++) c = c * (n - i) / (i + 1); return Math.round(c); };
/** Ring: probability that |x1 - x2| < fL for two particles in plane waves differing by m quanta (sign -1 fermions, +1 bosons, 0 distinguishable). */
const ringP = (f, m, sg) => 2 * f + sg * Math.sin(2 * Math.PI * m * f) / (Math.PI * m);
const ringNum = (f, m, sg) => { let s = 0; const N = 20000; for (let i = 0; i < N; i++) { const u = -f + 2 * f * (i + 0.5) / N; s += (1 + sg * Math.cos(2 * Math.PI * m * u)) * 2 * f / N; } return s; };
/** Ground-state degeneracy of N spin-1/2 fermions in a d-dimensional isotropic oscillator (shell N has binom(N+d-1, d-1) orbitals). */
const hoDeg = (Ne, d) => { let left = Ne, sh = 0; for (;;) { const cap = 2 * binom(sh + d - 1, d - 1); if (left <= cap) return binom(cap, left); left -= cap; sh++; } };
/** Neutral atoms and ions: label, protons, mass number, electrons. */
const SPECIES = [['$^1$H atom', 1, 1, 1], ['$^2$H (deuterium) atom', 1, 2, 1], ['$^3$He atom', 2, 3, 2], ['$^4$He atom', 2, 4, 2], ['$^6$Li atom', 3, 6, 3], ['$^7$Li atom', 3, 7, 3],
  ['$^{23}$Na atom', 11, 23, 11], ['$^{40}$K atom', 19, 40, 19], ['$^{87}$Rb atom', 37, 87, 37], ['$^{4}$He$^+$ ion', 2, 4, 1], ['$\\alpha$ particle', 2, 4, 0], ['deuteron', 1, 2, 0],
  ['$^{6}$Li$^+$ ion', 3, 6, 2], ['$^{133}$Cs atom', 55, 133, 55], ['$^{171}$Yb atom', 70, 171, 70], ['$^{87}$Sr atom', 38, 87, 38], ['$^{88}$Sr atom', 38, 88, 38], ['$^{3}$He nucleus', 2, 3, 0]];

export default {
  items: [
    { id: 'qip-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'bosons and fermions',
      q: R`Which of these is a fermion?`,
      options: [R`a neutral $^4$He atom`, R`a neutral $^3$He atom`, R`a deuteron`, R`a neutral $^1$H atom`], answer: 1,
      sol: R`Count the spin-$\tfrac12$ constituents: an odd number makes a fermion. $^3$He: 2 protons + 1 neutron + 2 electrons = 5, odd: fermion. $^4$He: 6, deuteron: 2, $^1$H: 2 (proton + electron), all even: bosons.`,
      trap: R`Count electrons too for neutral atoms; a hydrogen atom is a boson although the proton and electron are fermions.` },
    { id: 'qip-r4-02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'counting states',
      q: R`Two electrons are placed in 4 available spatial orbitals (each orbital has two spin states). The number of distinct antisymmetric two-electron states is ______.`,
      answer: 28, tol: 0, calc: () => 8 * 7 / 2,
      sol: R`There are $4\times2 = 8$ single-particle spin-orbitals. An antisymmetric state is fixed by choosing which 2 are occupied: $\binom{8}{2} = 28$. Check by spin: both in the same orbital (4 ways, singlet only) gives 4; in different orbitals ($\binom42 = 6$ pairs) gives singlet + triplet = 4 states each, 24. Total 28.`,
      trap: R`$8\times8 = 64$ counts ordered pairs of distinguishable particles.` },
    { id: 'qip-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'exchange symmetry',
      q: R`Two electrons occupy the same spatial orbital $\phi(\vec r)$ (as in the helium ground state). Their spin state must be`,
      options: [R`the singlet`, R`one of the triplet states`, R`either a singlet or a triplet`, R`any product state such as $|{\uparrow\uparrow}\rangle$`], answer: 0,
      sol: R`The spatial part $\phi(\vec r_1)\phi(\vec r_2)$ is symmetric under exchange. The total state must be antisymmetric, so the spin part must be antisymmetric: the singlet $\tfrac{1}{\sqrt2}(|{\uparrow\downarrow}\rangle - |{\downarrow\uparrow}\rangle)$. This is the Pauli rule "two electrons per orbital, with opposite spins".`,
      trap: R`$|{\uparrow\uparrow}\rangle$ is a triplet state; it would need an antisymmetric spatial part, impossible with one orbital.` },
    { id: 'qip-r4-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'filling levels',
      q: R`Four identical non-interacting spinless fermions are in a 2D square infinite well with single-particle levels $(n_x^2 + n_y^2)\epsilon$. The ground-state energy is ______ $\epsilon$.`,
      answer: 20, tol: 0,
      sol: R`Each orbital holds one spinless fermion. Lowest orbitals: $(1,1)$: $2\epsilon$; $(1,2)$ and $(2,1)$: $5\epsilon$ each; $(2,2)$: $8\epsilon$. Total $2 + 5 + 5 + 8 = 20\epsilon$. (Spin-$\tfrac12$ electrons would pair up: $2\times2 + 2\times5 = 14\epsilon$.)`,
      trap: R`Spinless fermions cannot share the $(1,1)$ orbital at all.` },
    { id: 'qip-r4-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'bosonic enhancement',
      q: R`A single-particle mode already holds $N$ identical bosons. Compared with an empty mode, the rate at which one more boson is scattered into it is multiplied by`,
      options: [R`$N$`, R`$1/(N + 1)$`, R`$N + 1$`, R`$1$`], answer: 2,
      sol: R`The creation operator gives $a^\dagger|N\rangle = \sqrt{N+1}|N+1\rangle$, so transition rates into the mode carry $|\sqrt{N+1}|^2 = N + 1$. The "1" is the spontaneous part and $N$ the stimulated part. This bosonic enhancement drives stimulated emission in lasers and the growth of a Bose-Einstein condensate. For fermions the factor is $1 - N$, which blocks an occupied mode.`,
      trap: R`The factor is $N + 1$, not $N$: an empty mode still accepts particles.` },
    { id: 'qip-r4-06', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'bosons and fermions',
      q: R`Which of these nuclei are bosons?`,
      options: [R`$^{12}$C`, R`$^{13}$C`, R`$^{14}$N`, R`$^{6}$Li`], answer: [0, 2, 3],
      sol: R`A nucleus with an even number of nucleons ($A$ even) has integer spin and is a boson. $^{12}$C ($A = 12$), $^{14}$N ($A = 14$, spin 1) and $^6$Li ($A = 6$, spin 1) are bosons. $^{13}$C ($A = 13$, spin $\tfrac12$) is a fermion.`,
      trap: R`For a bare nucleus only nucleons count; $^{14}$N has odd numbers of protons and of neutrons, but their total is even.` },
    { id: 'qip-r4-07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'counting states',
      q: R`Two identical spin-1 bosons occupy two DIFFERENT spatial orbitals $\phi_a$ and $\phi_b$. The number of allowed (symmetric) two-particle states is ______.`,
      answer: 9, tol: 0, calc: () => 6 + 3,
      sol: R`Symmetric space $\times$ symmetric spin: the spin states of two spin-1 particles split into symmetric ($S = 2, 0$: $5 + 1 = 6$) and antisymmetric ($S = 1$: 3). With $\phi_a\ne\phi_b$ both spatial combinations exist: symmetric space with the 6 symmetric spin states, antisymmetric space with the 3 antisymmetric ones. Total $6 + 3 = 9$, the same as $3\times3$ for distinguishable particles in fixed different orbitals.`,
      trap: R`6 is the answer when both bosons are in the SAME orbital; with two orbitals the antisymmetric spatial state is also available.` },
    { id: 'qip-r4-08', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'exchange hole',
      q: R`Two identical spinless fermions on a ring of circumference $L$ occupy the plane waves $e^{i0}$ and $e^{2\pi ix/L}$ (normalised, antisymmetrised). The probability that the distance between them along the ring is less than $L/4$ is ______ (three decimal places).`,
      answer: 0.182, tol: 0.002, calc: () => 0.5 - 1 / Math.PI,
      sol: R`$\psi\propto e^{2\pi ix_2/L} - e^{2\pi ix_1/L}$, so $|\psi|^2\propto2 - 2\cos(2\pi s/L)$ with $s = x_1 - x_2$, and $s$ is spread over one period with weight $1 - \cos(2\pi s/L)$. $P(|s| < L/4) = \dfrac1L\int_{-L/4}^{L/4}\left(1 - \cos\dfrac{2\pi s}{L}\right)ds = \dfrac12 - \dfrac1\pi = 0.182$. Distinguishable particles give $0.5$ and bosons $0.5 + 1/\pi = 0.818$: antisymmetry digs an "exchange hole" around each fermion.`,
      trap: R`Forgetting the interference term gives 0.5, the value for distinguishable particles.` },
    { id: 'qip-r4-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'quantum statistics',
      q: R`Liquid $^4$He becomes superfluid at 2.17 K, but liquid $^3$He only below about 2.5 mK. The main reason for the huge difference is that`,
      options: [R`$^3$He is lighter, so its zero-point motion is smaller`, R`$^3$He has a much stronger interatomic attraction`, R`$^3$He is radioactive`,
        R`$^3$He atoms are fermions and must first form Cooper-like pairs, which happens only at very low temperature, while $^4$He atoms are bosons that can condense directly`], answer: 3,
      sol: R`$^4$He atoms (6 fermions each) are bosons and can Bose-condense into one state. $^3$He atoms (5 fermions) are fermions; the Pauli principle forbids them from sharing a state, so superfluidity needs pairs of atoms (spin-triplet, $p$-wave pairs), a weak effect that sets in only in the millikelvin range. A lighter atom has LARGER zero-point motion, and $^3$He is stable.`,
      trap: R`The chemistry of the two isotopes is almost identical; the difference is quantum statistics.` },
    { id: 'qip-r4-10', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'exchange effects',
      q: R`In the Heitler-London treatment of H$_2$, the bonding state has the two electrons in a spin singlet. The reason the singlet binds is that`,
      options: [R`the singlet has a lower magnetic energy`, R`its spatial wavefunction is symmetric, which piles electron density between the protons, and the exchange term then lowers the energy`,
        R`its spatial wavefunction is antisymmetric, which keeps the electrons apart`, R`the triplet violates the Pauli principle`], answer: 1,
      sol: R`Spin singlet means symmetric space: $\phi_A(1)\phi_B(2) + \phi_B(1)\phi_A(2)$. The interference term adds density in the bond region, where an electron is attracted by both protons; mathematically the (negative) exchange integral lowers the energy. The triplet has an antisymmetric spatial part with a node between the protons and is repulsive. Both states are allowed by Pauli; magnetic energies are tiny.`,
      trap: R`The spin itself does not bind; spin fixes the spatial symmetry, and the energy comes from the Coulomb terms.` },
    { id: 'qip-r4-11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'filling levels',
      q: R`Three non-interacting electrons are in a 3D isotropic harmonic oscillator (levels $(N + \tfrac32)\hbar\omega$, with $(N+1)(N+2)/2$ orbitals in shell $N$). The degeneracy of the three-electron ground state is ______.`,
      answer: 6, tol: 0, calc: () => hoDeg(3, 3),
      sol: R`Two electrons fill the $N = 0$ orbital (singlet, one way). The third goes into the $N = 1$ shell, which has 3 orbitals $\times$ 2 spin states $= 6$ spin-orbitals. So the ground level is 6-fold degenerate, with energy $2\times\tfrac32 + \tfrac52 = 5.5\,\hbar\omega$.`,
      trap: R`Counting only orbitals (3) forgets the spin of the odd electron.` },
    { id: 'qip-r4-12', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'exchange symmetry',
      q: R`Which of these are acceptable wavefunctions (up to normalisation) for two identical spinless bosons, with $\phi_a\ne\phi_b$?`,
      options: [R`$\phi_a(x_1)\phi_b(x_2) + \phi_b(x_1)\phi_a(x_2)$`, R`$\phi_a(x_1)\phi_a(x_2)$`,
        R`$\phi_a(x_1)\phi_b(x_2) - \phi_b(x_1)\phi_a(x_2)$`, R`$\phi_a(x_1)\phi_b(x_2)$`], answer: [0, 1],
      sol: R`Spinless bosons need $\psi(x_1, x_2) = \psi(x_2, x_1)$. The symmetrised sum and the doubly occupied product are symmetric. The difference is antisymmetric (fermions), and the plain product is neither: it labels which particle is in which state.`,
      trap: R`A product of two different orbitals is not symmetric unless it is symmetrised.` },
  ],
  gens: [
    { id: 'qip-r4g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'exchange hole',
      make(r) {
        const f = choose(r, [0.05, 0.1, 0.125, 0.2, 0.25, 0.3, 0.4]), m = int(r, 1, 3);
        const kind = choose(r, ['fermions', 'bosons']);
        const sg = kind === 'fermions' ? -1 : 1;
        const p = ringP(f, m, sg);
        return { q: R`Two identical spinless ${kind} on a ring of circumference $L$ occupy the plane waves $e^{i0}$ and $e^{2\pi i${m === 1 ? '' : m}x/L}$ (normalised, ${kind === 'fermions' ? 'antisymmetrised' : 'symmetrised'}). The probability that the distance between them along the ring is less than $${f}L$ is ______ (three decimal places).`,
          answer: round(p, 3), tol: 0.002, f, m, sg,
          sol: R`$|\psi|^2\propto1 ${sg < 0 ? '-' : '+'} \cos(2\pi ${m === 1 ? "" : m}s/L)$ in the separation $s$. $P = \dfrac1L\int_{-${f}L}^{${f}L}\left(1 ${sg < 0 ? '-' : '+'} \cos\dfrac{2\pi ${m === 1 ? "" : m}s}{L}\right)ds = ${2 * f} ${sg < 0 ? '-' : '+'} \dfrac{\sin(${round(2 * Math.PI * m * f, 4)})}{${m === 1 ? '' : m}\pi} = ${round(p, 3)}$. Distinguishable particles would give $${2 * f}$.`,
          trap: 'The exchange term lowers (fermions) or raises (bosons) the chance of being close.' };
      },
      verify: (p) => ringNum(p.f, p.m, p.sg) },
    { id: 'qip-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'filling levels',
      make(r) {
        const d = int(r, 1, 3);
        let Ne = int(r, 2, 16);
        if (hoDeg(Ne, d) === 1) Ne += 1; // prefer an open shell
        const g = hoDeg(Ne, d);
        const shells = []; let left = Ne, sh = 0;
        while (left > 0) { const cap = 2 * binom(sh + d - 1, d - 1); const k = Math.min(cap, left); shells.push([sh, cap, k]); left -= k; sh++; }
        const [ls, lcap, lk] = shells[shells.length - 1];
        return { q: R`${Ne} non-interacting electrons are in a ${d}D isotropic harmonic oscillator (shell $N$ has $\binom{N + ${d - 1}}{${d - 1}}$ orbitals, each holding two electrons). The degeneracy of the ${Ne}-electron ground state is ______.`,
          answer: g, tol: 0, Ne, d,
          sol: R`Fill shells: ${shells.map(([s, c, k]) => `$N = ${s}$ (room for ${c}): ${k}`).join('; ')}. Closed shells can be filled in one way only. The last shell $N = ${ls}$ has ${lcap} spin-orbitals for ${lk} electron${lk === 1 ? '' : 's'}: $\binom{${lcap}}{${lk}} = ${g}$.`,
          trap: 'Only the open shell matters; count spin-orbitals (orbitals times 2), not orbitals.' };
      },
      verify: (p) => { // brute force over shells, independent of hoDeg
        let left = p.Ne, sh = 0;
        for (;;) { let orb = 0; for (let a = 0; a <= sh; a++) for (let b = 0; b <= sh - a; b++) { const c = sh - a - b; if (p.d === 1 && (a !== sh)) continue; if (p.d === 2 && c !== 0) continue; orb++; } const cap = 2 * orb; if (left <= cap) { let v = 1; for (let i = 0; i < left; i++) v = v * (cap - i) / (i + 1); return Math.round(v); } left -= cap; sh++; }
      } },
    { id: 'qip-r4g3', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'bosons and fermions',
      make(r) {
        let four = shuffle(r, SPECIES).slice(0, 4);
        const isB = (s) => (s[2] + s[3]) % 2 === 0;
        if (!four.some(isB)) four = [SPECIES[3], ...four.slice(1)];
        return { q: R`Which of these behave as bosons?`,
          options: four.map((s) => s[0]), answer: four.map((s, i) => (isB(s) ? i : -1)).filter((i) => i >= 0),
          sol: R`Count the spin-$\tfrac12$ constituents (nucleons plus electrons): even means boson. ${four.map((s) => `${s[0]}: ${s[2]} nucleons + ${s[3]} electron${s[3] === 1 ? '' : 's'} = ${s[2] + s[3]}, ${isB(s) ? 'boson' : 'fermion'}`).join('; ')}.`,
          trap: 'Electrons count too: a neutral atom and its bare nucleus can have opposite statistics.' };
      } },
  ],
};
