// Round 4 extras for defects-dislocations: original questions, written 2026-11-22.
import { pick, choose, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'], JG = ['jam', 'gate', 'net'];
const KEV = 8.617e-5; // Boltzmann constant in eV/K

export default {
  items: [
    { id: 'def-r4-01', type: 'mcq', level: 1, exams: JG, sub: 'point defects',
      q: R`In steel, small carbon atoms sit in the gaps between the much larger iron atoms. This kind of point defect is`,
      options: [R`a substitutional impurity`, R`a vacancy`, R`an interstitial impurity`, R`a Schottky defect`], answer: 2,
      sol: R`An impurity atom squeezed into the spaces between host atoms is an interstitial impurity. Only small atoms (H, B, C, N) fit this way. A substitutional impurity replaces a host atom on its own site, as zinc does in copper (brass).`,
      trap: R`Substitutional means taking a host atom's place, which needs a similar atomic size.` },
    { id: 'def-r4-02', type: 'nat', level: 2, exams: JG, sub: 'vacancy concentration',
      q: R`A metal has vacancy formation energy $1.00$ eV. Ignoring the formation entropy and taking $k_B = 8.617\times10^{-5}$ eV/K, the equilibrium vacancy fraction at $1000$ K is larger than at $800$ K by a factor of ______ (to one decimal place).`,
      answer: 18.2, tol: 0.1, calc: () => Math.exp((1 / 8.617e-5) * (1 / 800 - 1 / 1000)),
      sol: R`$n_v/N = e^{-E_v/k_BT}$, so the ratio is $\exp\left[\dfrac{E_v}{k_B}\left(\dfrac1{800} - \dfrac1{1000}\right)\right]$. $E_v/k_B = 11\,605$ K and $1/800 - 1/1000 = 2.5\times10^{-4}$ K$^{-1}$, giving $e^{2.901} = 18.2$. A $25\%$ rise in temperature multiplies the vacancy count eighteenfold.`,
      trap: R`Exponentials of $1/T$ do not scale like $T$: the ratio is not $1000/800 = 1.25$.` },
    { id: 'def-r4-03', type: 'mcq', level: 2, exams: JG, sub: 'dislocations',
      q: R`Which statement about where a dislocation line can end is correct?`,
      options: [R`It can end anywhere inside a perfect crystal.`, R`It can end only at a surface, at a grain boundary, at a node with other dislocations, or close on itself as a loop.`, R`It must always form a closed loop, so it can never reach a surface.`, R`It ends wherever its Burgers vector changes direction.`], answer: 1,
      sol: R`The Burgers vector is the same everywhere along a dislocation line, because the closure failure of a Burgers circuit cannot change as the circuit slides along the line through good crystal. If the line simply stopped inside perfect crystal, a circuit beyond the end would close and one before it would not, a contradiction. So lines end on free surfaces or boundaries, meet others at nodes (where the Burgers vectors add up), or close as loops.`,
      trap: R`The line direction can wander, but its Burgers vector cannot change along it.` },
    { id: 'def-r4-04', type: 'nat', level: 2, exams: G, sub: 'plastic strain', unit: '×10⁴',
      q: R`A cube of side $1.0$ mm is sheared plastically by edge dislocations of Burgers vector $0.25$ nm that glide right through it on parallel slip planes, each one moving the top relative to the bottom by $b$. The number of dislocations that must pass to give a shear strain of $1.0\%$ is ______ $\times10^4$ (to one decimal place).`,
      answer: 4, tol: 0.05, calc: () => 0.01 * 1e-3 / 0.25e-9 / 1e4,
      sol: R`A shear strain $\gamma$ over height $h$ means the top moves $\gamma h = 0.010\times1.0$ mm $= 10\ \mu$m. Each dislocation crossing the crystal adds $b = 0.25$ nm, so $n = 10^{-5}/0.25\times10^{-9} = 4.0\times10^4$ dislocations. Plastic flow is the sum of very many tiny atomic-scale steps.`,
      trap: R`Each dislocation that crosses gives a step of exactly one Burgers vector, not one lattice constant of any length.` },
    { id: 'def-r4-05', type: 'msq', level: 3, exams: JG, sub: 'point defects in ionic crystals', format: 'statements',
      q: R`An ionic crystal is compared with its perfect lattice. Which statements are correct?`,
      options: [R`Schottky defects make the measured density lower than the density calculated from the X-ray lattice constant.`, R`Frenkel defects leave the measured density essentially unchanged.`, R`Both kinds of defect keep the crystal electrically neutral.`, R`Schottky defects change the X-ray lattice constant but not the measured density.`], answer: [0, 1, 2],
      sol: R`A Schottky pair removes a cation and an anion to the surface: the same mass spreads over more volume, so the macroscopic density falls below the X-ray value, which counts full cells. A Frenkel defect only moves an ion from its site to an interstice, keeping mass and (nearly) volume. Both conserve charge (a pair of opposite vacancies, or a vacancy plus its own interstitial). The lattice constant changes only slightly; the density change is the main signature.`,
      trap: R`The density difference, not the lattice constant, is what reveals Schottky defects.` },
    { id: 'def-r4-06', type: 'mcq', level: 3, exams: G, sub: 'solute atmospheres',
      q: R`An edge dislocation has its extra half-plane above the slip plane. Solute atoms larger than the host atoms collect`,
      options: [R`just above the slip plane, in the compressed region`, R`just below the slip plane, in the region under tension`, R`equally above and below`, R`only far from the dislocation`], answer: 1,
      sol: R`The extra half-plane squeezes the material above the slip plane and stretches it below. A large solute atom relieves strain energy by sitting where the lattice is already stretched, just below the core; small solutes prefer the compressed side. These "Cottrell atmospheres" pin dislocations and cause the sharp yield point of mild steel.`,
      trap: R`The compressed side is where the extra half-plane is; large atoms go to the opposite side.` },
    { id: 'def-r4-07', type: 'nat', level: 4, exams: G, sub: 'line tension', unit: 'μm',
      q: R`A dislocation has line tension $T\approx\tfrac12Gb^2$ with $G = 40$ GPa and $b = 0.25$ nm. Under a resolved shear stress of $10$ MPa, a segment pinned at both ends bows out into an arc of radius $R$ given by $\tau b = T/R$. $R$ is ______ $\mu$m (to two decimal places).`,
      answer: 0.5, tol: 0.01, calc: () => (0.5 * 40e9 * 0.25e-9 ** 2) / (10e6 * 0.25e-9) * 1e6,
      sol: R`The force per unit length $\tau b$ balances the line tension on a curve of radius $R$: $R = T/\tau b = \tfrac12Gb^2/\tau b = Gb/2\tau = 40\times10^9\times0.25\times10^{-9}/(2\times10^7) = 5.0\times10^{-7}$ m $= 0.50\ \mu$m. A segment shorter than $2R = 1\ \mu$m cannot bow into a half-circle at this stress, which is the idea behind the Frank-Read source.`,
      trap: R`The line tension carries $b^2$ and the force $b$: one factor of $b$ cancels.` },
    { id: 'def-r4-08', type: 'msq', level: 4, exams: G, sub: 'partial dislocations', format: 'statements',
      q: R`In fcc metals, perfect dislocations split into two Shockley partials joined by a ribbon of stacking fault. Which statements are correct?`,
      options: [R`The lower the stacking-fault energy, the wider the ribbon between the partials.`, R`A wide ribbon makes cross-slip of screw dislocations harder.`, R`Metals with low stacking-fault energy (such as brass) tend to work-harden strongly and form annealing twins easily.`, R`Aluminium, with a high stacking-fault energy, has partials that are especially far apart.`], answer: [0, 1, 2],
      sol: R`The partials repel elastically (force $\propto1/d$) and the fault pulls them together with a constant force per length $\gamma$, so the width $d\propto1/\gamma$. To cross-slip, the split screw must first squeeze back into a perfect dislocation, which costs more the wider it is. Low-$\gamma$ metals therefore cross-slip with difficulty, store more dislocations (strong work hardening) and fault easily (twins). Aluminium has a high $\gamma$ (about $150$ mJ/m$^2$), so its partials nearly coincide.`,
      trap: R`Width goes as the inverse of the stacking-fault energy, not in proportion to it.` },
    { id: 'def-r4-09', type: 'nat', level: 5, exams: G, sub: 'divacancies', unit: '×10⁻⁷',
      q: R`In an fcc metal ($z = 12$ neighbours) at $1200$ K the single-vacancy fraction is $c_{1v} = 1.0\times10^{-4}$. Two vacancies on neighbouring sites bind with energy $B = 0.20$ eV, and the divacancy fraction (per lattice site) is $c_{2v} = \tfrac z2c_{1v}^2e^{B/k_BT}$. With $k_B = 8.617\times10^{-5}$ eV/K, $c_{2v}$ is ______ $\times10^{-7}$ (to two decimal places).`,
      answer: 4.15, tol: 0.03, calc: () => 6 * 1e-8 * Math.exp(0.2 / (8.617e-5 * 1200)) / 1e-7,
      sol: R`There are $z/2 = 6$ distinct neighbour pairs per site. $B/k_BT = 0.20/(8.617\times10^{-5}\times1200) = 1.934$, $e^{1.934} = 6.92$. $c_{2v} = 6\times(1.0\times10^{-4})^2\times6.92 = 4.15\times10^{-7}$. Each divacancy holds two vacancies, so about $2\times4.15\times10^{-7}/1.0\times10^{-4}\approx0.8\%$ of the vacancies are paired; the share rises near the melting point.`,
      trap: R`Counting $z$ pairs per site instead of $z/2$ counts every pair twice.` },
    { id: 'def-r4-10', type: 'mcq', level: 5, exams: G, sub: 'stress fields',
      q: R`A small solute atom that simply expands its surroundings equally in all directions (a pure dilatation) is placed near straight dislocations in an isotropic crystal. To first order in its misfit, it interacts with`,
      options: [R`screw dislocations only`, R`both edge and screw dislocations equally`, R`neither, because a dilatation produces no shear`, R`edge dislocations only`], answer: 3,
      sol: R`The first-order interaction energy is $-p\,\Delta V$, where $p$ is the hydrostatic pressure of the dislocation's stress field at the solute. An edge dislocation has a hydrostatic part ($\propto\sin\theta/r$): compression on one side of the slip plane, tension on the other. An isotropic screw dislocation's field is pure shear ($\sigma_{xz}$, $\sigma_{yz}$), with zero pressure, so a spherical misfit does not feel it. Screw dislocations interact only with solutes that distort the lattice unequally (for example carbon in bcc iron, which has a tetragonal strain field).`,
      trap: R`Pure shear has zero trace: there is no pressure for a dilatation to couple to.` },
  ],
  gens: [
    { id: 'def-r4g1', type: 'nat', level: 2, exams: JG, sub: 'vacancy concentration',
      make(r) {
        const E = pick(r, 0.6, 1.6, 0.05), T1 = pick(r, 400, 900, 50), T2 = round(T1 + pick(r, 100, 500, 50), 0), ratio = Math.exp((E / KEV) * (1 / T1 - 1 / T2));
        const e = ratio >= 1e4 ? Math.floor(Math.log10(ratio)) : 0, show = ratio / 10 ** e;
        return { q: `A metal has vacancy formation energy $${E}$ eV. Ignoring the formation entropy ($k_B = 8.617\\times10^{-5}$ eV/K), the equilibrium vacancy fraction at $${T2}$ K is larger than at $${T1}$ K by a factor of ______${e ? ` $\\times10^{${e}}$` : ''} (to two decimal places).`,
          answer: round(show, 2), tol: Math.max(0.01, round(show * 0.005, 2)), E, T1, T2, e,
          sol: `Ratio $= \\exp\\left[\\dfrac{E_v}{k_B}\\left(\\dfrac1{T_1} - \\dfrac1{T_2}\\right)\\right]$ with $E_v/k_B = ${Math.round(E / KEV)}$ K and $1/${T1} - 1/${T2} = ${round((1 / T1 - 1 / T2) * 1e4, 4)}\\times10^{-4}$ K$^{-1}$: exponent $${round((E / KEV) * (1 / T1 - 1 / T2), 3)}$, ratio $= ${round(show, 2)}${e ? `\\times10^{${e}}` : ''}$.`,
          trap: 'The exponent involves the difference of $1/T$, not of $T$.' };
      },
      verify: (p) => Math.exp((p.E / KEV) * (1 / p.T1 - 1 / p.T2)) / 10 ** p.e },
    { id: 'def-r4g2', type: 'nat', level: 4, exams: G, sub: 'line tension',
      make(r) {
        const Gm = pick(r, 20, 160, 5), b = pick(r, 0.22, 0.32, 0.01), ask = choose(r, ['R', 'tau']);
        const tau = pick(r, 2, 100, 1), Rr = pick(r, 0.1, 5, 0.1);
        const val = ask === 'R' ? Gm * 1e9 * b * 1e-9 / (2 * tau * 1e6) * 1e6 : Gm * 1e9 * b * 1e-9 / (2 * Rr * 1e-6) / 1e6;
        return { q: ask === 'R' ? `A dislocation segment ($G = ${Gm}$ GPa, $b = ${b}$ nm) pinned at both ends has line tension $T\\approx\\tfrac12Gb^2$. Under a resolved shear stress of $${tau}$ MPa it bows into an arc of radius $R$ with $\\tau b = T/R$. $R$ is ______ $\\mu$m (to three decimal places).` : `A dislocation segment ($G = ${Gm}$ GPa, $b = ${b}$ nm) has line tension $T\\approx\\tfrac12Gb^2$. The resolved shear stress needed to bend it into an arc of radius $${Rr}\\ \\mu$m (using $\\tau b = T/R$) is ______ MPa (to two decimal places).`,
          answer: ask === 'R' ? round(val, 3) : round(val, 2), tol: ask === 'R' ? Math.max(0.001, round(val * 0.003, 3)) : Math.max(0.01, round(val * 0.003, 2)), Gm, b, ask, tau, Rr, unit: ask === 'R' ? 'μm' : 'MPa',
          sol: `$\\tau b = \\tfrac12Gb^2/R$ gives $${ask === 'R' ? `R = Gb/2\\tau = ${Gm}\\times10^9\\times${b}\\times10^{-9}/(2\\times${tau}\\times10^6) = ${round(val, 3)}\\ \\mu\\text{m}` : `\\tau = Gb/2R = ${Gm}\\times10^9\\times${b}\\times10^{-9}/(2\\times${Rr}\\times10^{-6}) = ${round(val, 2)}\\text{ MPa}`}$.`,
          trap: 'One factor of $b$ cancels between the line tension ($\\propto b^2$) and the force per length ($\\tau b$).' };
      },
      verify: (p) => (p.ask === 'R' ? p.Gm * 1e9 * p.b * 1e-9 / (2 * p.tau * 1e6) * 1e6 : p.Gm * 1e9 * p.b * 1e-9 / (2 * p.Rr * 1e-6) / 1e6) },
    { id: 'def-r4g3', type: 'nat', level: 5, exams: G, sub: 'divacancies', unit: '%',
      make(r) {
        const [lat, z] = choose(r, [['fcc', 12], ['bcc', 8]]), c1 = pick(r, 0.5, 5, 0.5), T = pick(r, 800, 1400, 50), B = pick(r, 0.1, 0.4, 0.05);
        const c2 = (z / 2) * (c1 * 1e-4) ** 2 * Math.exp(B / (KEV * T)), share = 100 * 2 * c2 / (c1 * 1e-4 + 2 * c2);
        return { q: `In a ${lat} metal ($z = ${z}$ neighbours) at $${T}$ K the single-vacancy fraction is $${c1}\\times10^{-4}$. Divacancies have binding energy $${B}$ eV, and their fraction is $c_{2v} = \\tfrac z2c_{1v}^2e^{B/k_BT}$ ($k_B = 8.617\\times10^{-5}$ eV/K). The percentage of all vacancies that are paired in divacancies, $2c_{2v}/(c_{1v} + 2c_{2v})$, is ______ % (to two decimal places).`,
          answer: round(share, 2), tol: Math.max(0.01, round(share * 0.005, 2)), z, c1, T, B,
          sol: `$B/k_BT = ${round(B / (KEV * T), 4)}$, $e^{B/k_BT} = ${round(Math.exp(B / (KEV * T)), 4)}$. $c_{2v} = ${z / 2}\\times(${c1}\\times10^{-4})^2\\times${round(Math.exp(B / (KEV * T)), 4)} = ${round(c2 * 1e7, 4)}\\times10^{-7}$. Paired share $= 2c_{2v}/(c_{1v} + 2c_{2v}) = ${round(share, 2)}$%.`,
          trap: 'A divacancy holds two vacancies; count it twice when finding the share of vacancies.' };
      },
      verify: (p) => { const c2 = (p.z / 2) * (p.c1 * 1e-4) ** 2 * Math.exp(p.B / (KEV * p.T)); return 100 * 2 * c2 / (p.c1 * 1e-4 + 2 * c2); } },
  ],
};
