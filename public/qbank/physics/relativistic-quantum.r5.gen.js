// Round 5 extras for relativistic-quantum: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

const AL = 1 / 137.035999, ME = 0.51099895; // MeV
const PARTS = [['electron', 0.51099895], ['muon', 105.6584], ['charged pion', 139.5704], ['proton', 938.272], ['kaon', 493.677]];

export default {
  items: [
    { id: 'netrq-r5-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Dirac spinors',
      q: R`The wave function of the Dirac equation in three space dimensions has how many components?`,
      options: [R`1`, R`2`, R`4`, R`8`], answer: 2,
      sol: R`The Dirac matrices must be at least $4\times4$, so the spinor has 4 components: two spin states for the positive-energy solutions and two for the negative-energy (antiparticle) solutions. Two components (Pauli spinors) suffice only in the non-relativistic limit or for massless particles (Weyl spinors).`,
      trap: R`Two components describe spin alone; relativity doubles them.` },
    { id: 'netrq-r5-02', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'relativistic kinematics', unit: 'MeV/c',
      q: R`A muon ($mc^2 = 105.66$ MeV) has kinetic energy equal to its rest energy. Its momentum is ______ MeV/$c$ (one decimal place).`,
      answer: 183, tol: 0.2, calc: () => Math.sqrt(3) * 105.66,
      sol: R`$E = K + mc^2 = 2mc^2$, so $\gamma = 2$. $(pc)^2 = E^2 - (mc^2)^2 = 3(mc^2)^2$, $pc = \sqrt3\times105.66 = 183.0$ MeV. Its speed is $v/c = pc/E = \sqrt3/2 = 0.866$.`,
      trap: R`$p = mv$ with $v = 0.866c$ gives 91.5 MeV/$c$; relativity needs $\gamma mv$.` },
    { id: 'netrq-r5-03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Dirac hydrogen',
      q: R`For a hydrogen-like ion with $Z = 80$, the Dirac $1s$ binding energy is $mc^2\left[1 - \sqrt{1 - (Z\alpha)^2}\right]$ and the Bohr value is $Z^2\times13.606$ eV. The ratio (Dirac binding)/(Bohr binding) is ______ (three decimal places; $\alpha = 1/137.036$, $mc^2 = 511.00$ keV).`,
      answer: 1.104, tol: 0.002, calc: () => 511.0 * (1 - Math.sqrt(1 - (80 * AL) ** 2)) / (6400 * 13.606e-3),
      sol: R`$(Z\alpha)^2 = (80/137.036)^2 = 0.3408$; $\sqrt{1 - 0.3408} = 0.8119$. Dirac binding $= 511.00\times0.1881 = 96.1$ keV. Bohr: $6400\times13.606$ eV $= 87.1$ keV. Ratio $= 1.104$. Expanding, the ratio is $1 + (Z\alpha)^2/4 + \dots = 1.085 + \dots$: the higher terms already matter at this $Z$.`,
      trap: R`The first-order fine-structure estimate ($1 + (Z\alpha)^2/4$) underestimates the effect for heavy ions.` },
    { id: 'netrq-r5-04', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Klein-Gordon equation',
      q: R`For a spin-0 particle in a Coulomb field, the Klein-Gordon $s$-state energies contain $\sqrt{\tfrac14 - (Z\alpha)^2}$. The nuclear charge at which this square root stops being real (for a point nucleus) is $Z = $ ______ (one decimal place; $1/\alpha = 137.036$).`,
      answer: 68.5, tol: 0.1, calc: () => 137.036 / 2,
      sol: R`The Klein-Gordon radial equation has an effective $l'(l' + 1) = l(l + 1) - (Z\alpha)^2$, giving $l' + \tfrac12 = \sqrt{(l + \tfrac12)^2 - (Z\alpha)^2}$. For $l = 0$ this is real only while $Z\alpha\le\tfrac12$: $Z\le137.036/2 = 68.5$. The Dirac equation for $j = \tfrac12$ has $\sqrt{1 - (Z\alpha)^2}$ instead and fails only at $Z = 137$. (Real nuclei have finite size, which removes both problems.)`,
      trap: R`$Z = 137$ is the Dirac limit; the spinless equation fails at half that.` },
    { id: 'netrq-r5-05', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Dirac matrices',
      q: R`A Dirac equation for a massive particle in two space dimensions, $i\hbar\partial_t\psi = [c(\alpha_xp_x + \alpha_yp_y) + \beta mc^2]\psi$, needs three mutually anticommuting matrices that each square to 1. The smallest possible size of these matrices is ______ (as in $n\times n$).`,
      answer: 2, tol: 0,
      sol: R`The Pauli matrices $\sigma_x, \sigma_y, \sigma_z$ are three mutually anticommuting $2\times2$ matrices with square 1, so $\alpha_x = \sigma_x$, $\alpha_y = \sigma_y$, $\beta = \sigma_z$ works: $n = 2$. In three space dimensions a fourth anticommuting matrix is needed, and none exists among $2\times2$ matrices, which forces $4\times4$. Two-component Dirac equations of this kind describe electrons in graphene.`,
      trap: R`$4\times4$ is needed only when four anticommuting matrices are required.` },
    { id: 'netrq-r5-06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'non-relativistic limit', unit: 'meV',
      q: R`The relativistic kinetic correction $-p^4/(8m^3c^2)$ shifts a hydrogen level by $-\dfrac{E_n^2}{2mc^2}\left(\dfrac{4n}{l + 1/2} - 3\right)$. For the ground state ($E_1 = -13.606$ eV, $mc^2 = 511.00$ keV) the shift is ______ meV (three decimal places, with sign).`,
      answer: -0.906, tol: 0.003, calc: () => -(13.606 ** 2) / (2 * 511.0e3) * 5 * 1e3,
      sol: R`$E_1^2/2mc^2 = 185.12/(1.022\times10^6)$ eV $= 1.811\times10^{-4}$ eV. The bracket for $n = 1$, $l = 0$ is $8 - 3 = 5$. Shift $= -5\times1.811\times10^{-4}$ eV $= -0.906$ meV. For $1s$ the Darwin term ($+0.725$ meV) cancels most of it, leaving the total fine-structure shift $-0.181$ meV.`,
      trap: R`The correction is always negative: relativity makes the kinetic energy grow more slowly with $p$.` },
    { id: 'netrq-r5-07', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'chirality and helicity', format: 'statements',
      q: R`Which statements about chirality and helicity of spin-$\tfrac12$ particles are correct?`,
      options: [R`A massless spin-$\tfrac12$ particle can be described by a two-component Weyl equation`,
        R`For a massless particle, chirality and helicity coincide (up to sign convention)`,
        R`A Dirac mass term couples the left- and right-handed chiral components`,
        R`For a free massive particle, chirality is conserved in time`], answer: [0, 1, 2],
      sol: R`With $m = 0$ the Dirac equation splits into two independent Weyl equations for $\psi_L$ and $\psi_R$, and $\gamma^5$ acts like helicity. The mass term $m\bar\psi\psi = m(\bar\psi_L\psi_R + \bar\psi_R\psi_L)$ mixes them, so for $m\ne0$ chirality ($\gamma^5$) does not commute with $H$ and oscillates; helicity $\vec\Sigma\cdot\hat p$ is conserved for a free particle, but it is frame dependent.`,
      trap: R`Helicity (conserved for a free particle) and chirality (conserved only if massless) are different operators once $m\ne0$.` },
    { id: 'netrq-r5-08', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'wave equations',
      q: R`Which wave equation is of first order in BOTH time and space derivatives?`,
      options: [R`The Schrödinger equation`, R`The Dirac equation`, R`The Klein-Gordon equation`, R`The classical wave equation`], answer: 1,
      sol: R`Schrödinger: first order in $t$, second in $x$ (not Lorentz symmetric). Klein-Gordon and the wave equation: second order in both. Dirac wanted first order in $t$ (so that a positive probability density survives) and, for relativity, then had to be first order in $x$ too; the price was matrix coefficients and a multi-component wave function.`,
      trap: R`The Schrödinger equation is first order only in time.` },
    { id: 'netrq-r5-09', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'relativistic kinematics',
      q: R`An electron has total energy $1.000$ MeV ($mc^2 = 0.511$ MeV). The phase velocity $E/p$ of its de Broglie wave, divided by $c$, is ______ (three decimal places).`,
      answer: 1.163, tol: 0.002, calc: () => 1 / Math.sqrt(1 - 0.511 ** 2),
      sol: R`$pc = \sqrt{E^2 - (mc^2)^2} = \sqrt{1 - 0.2611} = 0.8596$ MeV. $v_\text{phase} = E/p = c\times1.000/0.8596 = 1.163c$. It exceeds $c$ but carries no signal; the group velocity $pc^2/E = 0.860c$ is the particle's speed, and $v_\text{phase}v_\text{group} = c^2$.`,
      trap: R`A phase velocity above $c$ is allowed; only the group velocity must stay below it.` },
    { id: 'netrq-r5-10', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'hole theory', format: 'not',
      q: R`Which statement about the negative-energy solutions of the Dirac equation is NOT correct?`,
      options: [R`Filling them all (the Dirac sea) led Dirac to predict the positron`, R`A hole in the filled sea behaves as a particle of positive energy and opposite charge`,
        R`The sea picture relies on the Pauli principle, so it cannot be used for Klein-Gordon bosons`, R`They can be dropped consistently, because an external potential never mixes them with positive-energy solutions`], answer: 3,
      sol: R`A localised potential (or a localised wave packet) always contains negative-energy components; this is behind zitterbewegung and the Klein paradox. So they cannot be discarded. The other three are standard: hole theory predicted the positron (found in 1932), a missing negative-energy electron looks like positive energy and charge $+e$, and only fermions can fill a sea. Quantum field theory later replaced the sea with antiparticle operators.`,
      trap: R`Positive- and negative-energy states mix as soon as the wave function is localised on the scale of the Compton wavelength.` },
  ],
  gens: [
    { id: 'netrq-r5g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Dirac hydrogen',
      make(r) {
        const Z = int(r, 10, 100), B = ME * 1e3 * (1 - Math.sqrt(1 - (Z * AL) ** 2)), v = round(B, 2);
        return { q: R`Using the Dirac formula $E_{1s} = mc^2\sqrt{1 - (Z\alpha)^2}$ (including rest energy, point nucleus), the $1s$ binding energy of the hydrogen-like ion with $Z = ${Z}$ is ______ keV (two decimal places; $mc^2 = 510.999$ keV, $\alpha = 1/137.036$).`,
          answer: v, tol: Math.max(0.02, round(B * 0.002, 3)), unit: 'keV', Z,
          sol: R`$(Z\alpha)^2 = ${+((Z * AL) ** 2).toPrecision(5)}$; $\sqrt{1 - (Z\alpha)^2} = ${+Math.sqrt(1 - (Z * AL) ** 2).toPrecision(6)}$. Binding $= 510.999\times(1 - ${+Math.sqrt(1 - (Z * AL) ** 2).toPrecision(6)}) = ${v}$ keV. (Bohr would give $${round(Z * Z * 13.6057e-3, 2)}$ keV.)`,
          trap: 'Binding is mc^2 minus the Dirac energy, not the Dirac energy itself.' };
      },
      verify: (p) => ME * 1e3 * (1 - Math.sqrt(1 - (p.Z * AL) ** 2)) },
    { id: 'netrq-r5g2', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'relativistic kinematics',
      make(r) {
        const [name, m] = choose(r, PARTS), K = +(m * pick(r, 0.1, 10, 0.1)).toPrecision(3);
        const p = Math.sqrt(K * K + 2 * K * m), v = +p.toPrecision(4);
        return { q: R`A ${name} ($mc^2 = ${m}$ MeV) has kinetic energy $${K}$ MeV. Its momentum is ______ MeV/$c$ (four significant figures).`,
          answer: v, tol: +(v * 0.002).toPrecision(2), unit: 'MeV/c', m, K,
          sol: R`$E = K + mc^2$ and $(pc)^2 = E^2 - (mc^2)^2 = K^2 + 2Kmc^2 = ${+(K * K).toPrecision(5)} + ${+(2 * K * m).toPrecision(5)}$. So $pc = ${v}$ MeV.`,
          trap: 'Use E^2 = (pc)^2 + (mc^2)^2 with the TOTAL energy, not the kinetic energy.' };
      },
      verify: (p) => Math.sqrt(p.K * p.K + 2 * p.K * p.m) },
    { id: 'netrq-r5g3', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'relativistic kinematics',
      make(r) {
        const [name, m] = choose(r, PARTS), g = pick(r, 1.05, 20, 0.05), E = +(g * m).toPrecision(4), ask = choose(r, ['phase', 'group']);
        const pc = Math.sqrt(E * E - m * m), x = ask === 'phase' ? E / pc : pc / E, v = round(x, 4);
        return { q: R`A free ${name} ($mc^2 = ${m}$ MeV) has total energy $${E}$ MeV. The ${ask} velocity of its de Broglie wave, divided by $c$, is ______ (four decimal places).`,
          answer: v, tol: 0.0005, m, E, ask,
          sol: R`$pc = \sqrt{E^2 - (mc^2)^2} = ${+pc.toPrecision(5)}$ MeV. ${ask === 'phase' ? R`Phase velocity $E/p$: $E/(pc) = ${v}$.` : R`Group velocity $d E/dp = pc^2/E$: $pc/E = ${v}$.`} The phase and group velocities multiply to $c^2$.`,
          trap: 'Phase velocity exceeds c; group velocity (the particle speed) stays below it.' };
      },
      verify: (p) => { const pc = Math.sqrt(p.E * p.E - p.m * p.m); return p.ask === 'phase' ? p.E / pc : pc / p.E; } },
  ],
};
