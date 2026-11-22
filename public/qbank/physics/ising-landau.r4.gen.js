// Round 4 extras for ising-landau: original questions, written 2026-11-22.
import { choose, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
// Lattice name, coordination number z, exact (or high-precision numerical) kTc/J for the Ising ferromagnet.
const LATT = [['honeycomb', 3, 1.5187], ['square', 4, 2.2692], ['triangular', 6, 3.6410], ['simple cubic', 6, 4.5115], ['body-centred cubic', 8, 6.3548], ['face-centred cubic', 12, 9.7944]];

export default {
  items: [
    { id: 'netis-r4-01', type: 'mcq', level: 1, exams: G, sub: 'ground states',
      q: R`An Ising ferromagnet $H = -J\sum_{\langle ij\rangle}s_is_j$ ($J > 0$, each pair of neighbours counted once) has $N$ spins on a square lattice with periodic boundaries. Its ground-state energy is`,
      options: [R`$-NJ$`, R`$-2NJ$`, R`$-4NJ$`, R`$-NJ/2$`], answer: 1,
      sol: R`In the ground state all spins are parallel, so every bond contributes $-J$. Each spin has $z = 4$ neighbours, and each bond is shared by two spins, so there are $Nz/2 = 2N$ bonds. $E_0 = -2NJ$.`,
      trap: R`$-4NJ$ counts each bond twice, once from each end.` },
    { id: 'netis-r4-02', type: 'nat', level: 2, exams: G, sub: 'excitations',
      q: R`In the fully aligned ground state of the simple cubic Ising ferromagnet ($z = 6$, coupling $J$, no field), flipping one spin raises the energy by ______ $J$.`,
      answer: 12, tol: 0, calc: () => 2 * 6,
      sol: R`The flipped spin now disagrees with all 6 neighbours. Each of those bonds goes from $-J$ to $+J$, a change of $2J$, so the cost is $6\times2J = 12J$. At low temperature such flips are suppressed by $e^{-12J/kT}$, which is why the magnetisation stays very close to saturation there.`,
      trap: R`Each broken bond costs $2J$ (from $-J$ to $+J$), not $J$.` },
    { id: 'netis-r4-03', type: 'mcq', level: 3, exams: G, sub: 'mean-field theory',
      q: R`In the Bragg-Williams (mean-field) treatment of the Ising model, the free energy per spin is $f(m) = -\tfrac12zJm^2 - kT\,s(m)$ with $s(m) = \ln2 - \tfrac12[(1 + m)\ln(1 + m) + (1 - m)\ln(1 - m)]$. Expanded in powers of $m$, the coefficient of $m^4$ is`,
      options: [R`$-kT/12$`, R`$zJ/12$`, R`$kT/12$`, R`$kT/4$`], answer: 2,
      sol: R`Expand: $(1 + m)\ln(1 + m) + (1 - m)\ln(1 - m) = m^2 + \dfrac{m^4}{6} + \ldots$, so $s(m) = \ln2 - \dfrac{m^2}{2} - \dfrac{m^4}{12}$. Then $f = -kT\ln2 + \tfrac12(kT - zJ)m^2 + \dfrac{kT}{12}m^4 + \ldots$ The $m^2$ coefficient changes sign at $kT_c = zJ$, and the $m^4$ coefficient is positive, so the transition is continuous: a Landau free energy derived from the lattice model.`,
      trap: R`The quartic term comes from the entropy, so it carries $kT$, with a positive sign since $-kTs$ is added.` },
    { id: 'netis-r4-04', type: 'nat', level: 3, exams: G, sub: 'mean-field theory',
      q: R`The exact critical temperature of the honeycomb-lattice Ising ferromagnet ($z = 3$) is $kT_c/J = 2/\ln(2 + \sqrt3)$. Mean-field theory gives $kT_c = zJ$. The mean-field value is ______ times the exact one (three decimal places).`,
      answer: 1.975, tol: 0.003, calc: () => 3 / (2 / Math.log(2 + Math.sqrt(3))),
      sol: R`Exact: $2/\ln3.732 = 2/1.317 = 1.519$. Mean field: $3$. Ratio $= 3/1.519 = 1.975$. The error is largest for lattices with few neighbours, where the local field fluctuates most; for the face-centred cubic lattice ($z = 12$) mean field is only about 23% too high.`,
      trap: R`Using $\log_{10}$ in the exact formula gives a ratio near $0.86$, less than 1, which mean-field theory never gives.` },
    { id: 'netis-r4-05', type: 'msq', level: 3, exams: G, sub: 'Landau-Ginzburg theory', format: 'statements',
      q: R`Below $T_c$, Landau-Ginzburg theory $F = \int[c(\nabla m)^2 + a(T - T_c)m^2 + bm^4]\,dx$ allows a flat domain wall between regions with $m = -m_0$ and $m = +m_0$. Which statements are correct?`,
      options: [R`The wall's thickness is of the order of the correlation length $\xi$.`, R`The wall grows thicker as $T\to T_c$ from below.`, R`The wall's free energy per unit area falls to zero as $T\to T_c$.`, R`At the centre of the wall, $m = m_0/2$.`], answer: [0, 1, 2],
      sol: R`Minimising gives $m(x) = m_0\tanh(x/w)$ with $w = \sqrt{2c/a(T_c - T)}$, twice the correlation length below $T_c$, so the wall widens as $\xi\propto(T_c - T)^{-1/2}$ diverges. Its energy per area scales as $c\,m_0^2/\xi\propto(T_c - T)^{3/2}$, vanishing at $T_c$, which is why domains form and vanish freely near the transition. By symmetry $m = 0$ at the centre.`,
      trap: R`The profile is odd about the centre: $\tanh(0) = 0$, not $\tfrac12$.` },
    { id: 'netis-r4-06', type: 'nat', level: 4, exams: G, sub: 'mean-field theory',
      q: R`In mean-field theory, $m = \tanh\big[(kT_cm + h)/kT\big]$. At exactly $T = T_c$ with a field $h = 0.010\,kT_c$, the magnetisation is ______ (three decimal places).`,
      answer: 0.305, tol: 0.003, calc: () => { let m = 0.5; for (let i = 0; i < 4000; i++) m = Math.tanh(m + 0.01); return m; },
      sol: R`At $T = T_c$ the equation is $m = \tanh(m + 0.01)$. To lowest order, $\tanh y\approx y - y^3/3$ gives $m^3/3\approx0.01$, $m\approx0.311$: the critical isotherm $m\propto h^{1/3}$ ($\delta = 3$). Solving exactly (iterate $m\to\tanh(m + 0.01)$, which converges slowly here) gives $m = 0.305$. A field of 1% of $kT_c$ produces 30% magnetisation: the response at $T_c$ is huge.`,
      trap: R`Expecting $m\propto h$ (as above $T_c$) gives about $0.01$; at $T_c$ the susceptibility is infinite and $m\propto h^{1/3}$.` },
    { id: 'netis-r4-07', type: 'mcq', level: 4, exams: G, sub: 'antiferromagnets',
      q: R`An Ising antiferromagnet orders at its Néel temperature $T_N$. Near $T_N$,`,
      options: [R`the uniform susceptibility stays finite (with a cusp at $T_N$), while the staggered susceptibility diverges`, R`the uniform susceptibility diverges, as for a ferromagnet`, R`both susceptibilities stay finite`, R`the uniform susceptibility vanishes at $T_N$`], answer: 0,
      sol: R`The order parameter of an antiferromagnet is the staggered magnetisation (sublattice A minus sublattice B). Its conjugate field alternates in sign from site to site, and the response to that field diverges at $T_N$. A uniform field does not couple to the order parameter, so the ordinary susceptibility stays finite; it peaks with a cusp at $T_N$ and falls below it as the sublattices lock antiparallel.`,
      trap: R`The diverging response belongs to the field conjugate to the order parameter, which here is staggered.` },
    { id: 'netis-r4-08', type: 'msq', level: 3, exams: G, sub: 'phase diagram', format: 'statements',
      q: R`For a ferromagnetic Ising system in a uniform field $h$, which statements about its phase diagram in the $(h, T)$ plane are correct?`,
      options: [R`Below $T_c$, sweeping $h$ through zero causes a first-order transition.`, R`On that line the magnetisation jumps from $-m_0$ to $+m_0$.`, R`The line of first-order transitions ends at the critical point $h = 0$, $T = T_c$.`, R`Above $T_c$, the magnetisation also jumps when $h$ passes through zero.`], answer: [0, 1, 2],
      sol: R`Below $T_c$ the two ordered states are degenerate at $h = 0$; any field picks one, so $m$ jumps from $-m_0$ to $+m_0$: a first-order line along $h = 0$. As $T\to T_c$ the jump $2m_0$ shrinks to zero, ending the line at the critical point. Above $T_c$, $m = \chi h$ varies smoothly through zero. This is the same picture as the liquid-gas coexistence line ending at its critical point.`,
      trap: R`Above $T_c$ there is no spontaneous magnetisation, so nothing jumps.` },
    { id: 'netis-r4-09', type: 'nat', level: 5, exams: G, sub: 'finite-size scaling',
      q: R`In Monte Carlo simulations of the square-lattice Ising model, the peak of the susceptibility grows with lattice size as $\chi_{\max}\propto L^{\gamma/\nu}$, with $\gamma = 7/4$ and $\nu = 1$. Going from $L = 32$ to $L = 64$ multiplies $\chi_{\max}$ by ______ (two decimal places).`,
      answer: 3.36, tol: 0.02, calc: () => 2 ** 1.75,
      sol: R`Near $T_c$ the correlation length is cut off by $L$, so $\chi\sim\xi^{\gamma/\nu}$ becomes $\chi_{\max}\sim L^{\gamma/\nu} = L^{7/4}$. Doubling $L$ multiplies it by $2^{7/4} = 3.36$. Fitting such ratios over several sizes is how exponent ratios are measured in simulations.`,
      trap: R`Using $L^\gamma$ or the number of spins $L^2$ ignores that $\xi$ is the length that $L$ replaces.` },
    { id: 'netis-r4-10', type: 'mcq', level: 2, exams: G, sub: 'lattice counting',
      q: R`A $10\times10$ square lattice with periodic boundaries has how many nearest-neighbour bonds?`,
      options: [R`$100$`, R`$400$`, R`$50$`, R`$200$`], answer: 3,
      sol: R`Each of the $100$ sites has $4$ neighbours, and each bond joins two sites: $100\times4/2 = 200$. Equivalently, one horizontal and one vertical bond per site.`,
      trap: R`$400$ counts every bond twice.` },
  ],
  gens: [
    { id: 'netis-r4g1', type: 'nat', level: 2, exams: G, sub: 'excitations',
      make(r) {
        const [name, z] = choose(r, LATT.map((x) => [x[0], x[1]]).concat([['linear chain', 2]]));
        const J = choose(r, [0.5, 1, 2, 5, 10]), pair = r() < 0.5;
        const dE = (pair ? 4 * (z - 1) : 2 * z) * J;
        return { q: `In the aligned ground state of the ${name} Ising ferromagnet ($z = ${z}$, $J = ${J}$ meV, no field), ${pair ? 'two neighbouring spins are flipped together' : 'one spin is flipped'}. The energy rises by ______ meV.`,
          answer: round(dE, 2), tol: 0, z, J, pair,
          sol: pair
            ? `Each flipped spin disagrees with its $z - 1 = ${z - 1}$ other neighbours (the bond between the pair stays satisfied), so $2(z - 1) = ${2 * (z - 1)}$ bonds break, each costing $2J$: $\\Delta E = 4(z - 1)J = ${round(dE, 2)}$ meV.`
            : `The spin disagrees with all $z = ${z}$ neighbours; each broken bond costs $2J$: $\\Delta E = 2zJ = ${round(dE, 2)}$ meV.`,
          trap: 'A broken bond goes from $-J$ to $+J$, a cost of $2J$.' };
      },
      verify: (p) => (p.pair ? 4 * (p.z - 1) : 2 * p.z) * p.J },
    { id: 'netis-r4g2', type: 'nat', level: 3, exams: G, sub: 'mean-field theory',
      make(r) {
        const [name, z, ex] = choose(r, LATT);
        const x = z / ex;
        return { q: `For the ${name} Ising ferromagnet ($z = ${z}$), the accurate critical temperature is $kT_c = ${ex}J$. The mean-field prediction $kT_c = zJ$ is too high by a factor of ______ (three decimal places).`,
          answer: round(x, 3), tol: 0.002, z, ex,
          sol: `Ratio $= z/(kT_c/J) = ${z}/${ex} = ${round(x, 3)}$. Mean field ignores fluctuations of the neighbours' spins, which matter less when $z$ is large.`,
          trap: 'Mean-field theory always overestimates $T_c$, so the factor is above 1.' };
      },
      verify: (p) => p.z / p.ex },
    { id: 'netis-r4g3', type: 'nat', level: 5, exams: G, sub: 'finite-size scaling',
      make(r) {
        const cls = choose(r, [['2D Ising', 1.75, 0.125], ['3D Ising', 1.9635, 0.5183]]);
        const L1 = choose(r, [8, 16, 32]), k = choose(r, [2, 3, 4]), L2 = L1 * k, chi = r() < 0.5;
        const f = chi ? k ** cls[1] : k ** -cls[2];
        return { q: `In finite-size scaling for the ${cls[0]} class, ${chi ? `the susceptibility peak grows as $L^{\\gamma/\\nu}$ with $\\gamma/\\nu = ${cls[1]}$` : `the magnetisation at $T_c$ falls as $L^{-\\beta/\\nu}$ with $\\beta/\\nu = ${cls[2]}$`}. Going from $L = ${L1}$ to $L = ${L2}$ multiplies ${chi ? 'the peak susceptibility' : 'the magnetisation at $T_c$'} by ______ (three decimal places).`,
          answer: round(f, 3), tol: Math.max(0.002, round(f * 0.002, 3)), k, e: chi ? cls[1] : -cls[2],
          sol: `At $T_c$ the only length is $L$, so the quantity scales as a power of $L$: factor $= ${k}^{${chi ? cls[1] : -cls[2]}} = ${round(f, 3)}$.`,
          trap: 'Only the ratio $L_2/L_1$ matters, raised to the exponent ratio.' };
      },
      verify: (p) => p.k ** p.e },
  ],
};
