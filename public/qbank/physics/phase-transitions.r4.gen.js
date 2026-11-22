// Round 4 extras for phase-transitions: original questions, written 2026-11-22.
import { choose, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];
// Saturated water: temperature (deg C), specific volume of liquid and vapour (m^3/kg), standard steam-table values.
const STEAM = [[100, 0.001043, 1.6720], [120, 0.001060, 0.8919], [150, 0.001090, 0.39248], [180, 0.001127, 0.19384], [200, 0.001157, 0.12721]];

export default {
  items: [
    { id: 'phtr-r4-01', type: 'mcq', level: 1, exams: A, sub: 'first-order transitions',
      q: R`Water and steam coexist at $100\,^\circ$C and $1$ atm. Which molar quantity has the same value in both phases?`,
      options: [R`The molar Gibbs energy`, R`The molar entropy`, R`The molar volume`, R`The molar enthalpy`], answer: 0,
      sol: R`Two phases coexist in equilibrium only if moving a molecule from one to the other does not change $G$: their chemical potentials (molar Gibbs energies) are equal. Entropy, volume and enthalpy all jump; the jumps in $S$ and $H$ give the latent heat $L = T\Delta S = \Delta H$, and the jump in $V$ appears in the Clausius-Clapeyron equation.`,
      trap: R`At a first-order transition the first derivatives of $G$ jump while $G$ itself is continuous.` },
    { id: 'phtr-r4-02', type: 'nat', level: 2, exams: A, sub: 'coexistence',
      q: R`$1.0$ kg of water is held in a rigid $0.50$ m$^3$ vessel at $100\,^\circ$C, where liquid and vapour coexist (specific volumes $0.001043$ and $1.672$ m$^3$/kg). The fraction of the mass that is vapour is ______ (three decimal places).`,
      answer: 0.299, tol: 0.002, calc: () => (0.5 - 0.001043) / (1.672 - 0.001043),
      sol: R`With vapour fraction $x$, the specific volume is $v = (1 - x)v_l + xv_g$, so $x = \dfrac{v - v_l}{v_g - v_l} = \dfrac{0.5 - 0.001043}{1.672 - 0.001043} = 0.299$ (the lever rule). Although only 30% of the mass is vapour, it fills almost all of the volume.`,
      trap: R`The vapour fills over $99.9\%$ of the <b>volume</b>; the question asks for its share of the <b>mass</b>.` },
    { id: 'phtr-r4-03', type: 'mcq', level: 2, exams: A, sub: 'metastability',
      q: R`Pure water can be cooled several degrees below $0\,^\circ$C without freezing, but a ferromagnet cooled through its Curie point in zero field cannot stay non-magnetic. The reason is that`,
      options: [R`water has a much larger heat capacity than iron`, R`the Curie point depends on pressure, the freezing point does not`, R`magnetic forces act faster than the forces between water molecules`, R`a first-order transition has a free-energy barrier (a new phase must nucleate), while at a continuous transition the old state becomes unstable at once`], answer: 3,
      sol: R`At a first-order transition the two phases are separate minima of the free energy; below the melting point the liquid is still a local minimum, and forming ice requires a nucleus whose surface energy creates a barrier. So the liquid can persist (supercooling). At a continuous transition the single minimum at $m = 0$ splits: below $T_c$ the old state is a maximum, so fluctuations destroy it immediately. Hysteresis and metastability are marks of first-order transitions.`,
      trap: R`Supercooling is not about how fast heat is removed; it needs a barrier, which only first-order transitions have.` },
    { id: 'phtr-r4-04', type: 'nat', level: 3, exams: A, sub: 'Clausius-Clapeyron',
      q: R`The vapour pressure of ice is $611$ Pa at $273.16$ K, and its molar latent heat of sublimation is $51.0$ kJ/mol. Treating the vapour as ideal and $L$ as constant, the vapour pressure of ice at $263.15$ K is ______ Pa ($R = 8.314$ J mol$^{-1}$ K$^{-1}$).`,
      answer: 260, tol: 3, calc: () => 611 * Math.exp(-(51000 / 8.314) * (1 / 263.15 - 1 / 273.16)),
      sol: R`Integrating $d\ln P/dT = L/RT^2$: $\ln\dfrac{P_2}{P_1} = -\dfrac LR\Big(\dfrac{1}{T_2} - \dfrac{1}{T_1}\Big) = -6134\times(3.8001 - 3.6608)\times10^{-3} = -0.854$. So $P_2 = 611\times e^{-0.854} = 611\times0.426 = 260$ Pa. Sublimation, not evaporation, sets the humidity over snow; its latent heat is the sum of the heats of melting and of evaporation.`,
      trap: R`Using the latent heat of evaporation ($45$ kJ/mol near $0\,^\circ$C) gives about $287$ Pa, the vapour pressure over supercooled water, not over ice.` },
    { id: 'phtr-r4-05', type: 'mcq', level: 3, exams: G, sub: 'critical phenomena',
      q: R`Near its liquid-gas critical point, a clear fluid becomes milky and scatters light strongly (critical opalescence). This happens because`,
      options: [R`the fluid starts to boil and forms bubbles of visible size`, R`density fluctuations become correlated over distances comparable to the wavelength of light`, R`the latent heat becomes very large`, R`the molecules dissociate into ions`], answer: 1,
      sol: R`Light is scattered by fluctuations of density. Their strength grows with the compressibility, which diverges at the critical point, and their size is the correlation length $\xi$, which also diverges. When $\xi$ reaches hundreds of nanometres, regions of different density scatter visible light strongly. The latent heat goes to zero at the critical point, and there are no bubbles because the two phases have become identical.`,
      trap: R`At the critical point there is no separate gas phase to form bubbles; the scattering comes from fluctuations.` },
    { id: 'phtr-r4-06', type: 'msq', level: 4, exams: G, sub: 'nucleation', format: 'statements',
      q: R`In classical nucleation theory, a spherical nucleus of radius $r$ of a new phase has $\Delta G(r) = -\tfrac43\pi r^3\Delta g + 4\pi r^2\sigma$, with $\Delta g > 0$ the free-energy gain per unit volume and $\sigma$ the surface tension. Which statements are correct?`,
      options: [R`The critical radius is $r^* = 2\sigma/\Delta g$; smaller nuclei tend to shrink.`, R`The nucleation barrier is $\Delta G^* = \dfrac{16\pi\sigma^3}{3\Delta g^2}$.`, R`Close to the transition temperature, $\Delta g$ grows in proportion to the supercooling $\Delta T$, so the barrier falls as $1/\Delta T^2$.`, R`Homogeneous nucleation (in the bulk) is usually easier than nucleation on impurities or walls.`], answer: [0, 1, 2],
      sol: R`$d\Delta G/dr = -4\pi r^2\Delta g + 8\pi r\sigma = 0$ gives $r^* = 2\sigma/\Delta g$. Substituting: $\Delta G^* = -\tfrac43\pi\dfrac{8\sigma^3}{\Delta g^2} + 4\pi\dfrac{4\sigma^3}{\Delta g^2} = \dfrac{16\pi\sigma^3}{3\Delta g^2}$. Near the transition $\Delta g\approx L_v\Delta T/T_m$ (latent heat per volume), so $\Delta G^*\propto1/\Delta T^2$. A surface or impurity replaces part of the costly interface, lowering the barrier; that is why real liquids usually freeze on dust or container walls.`,
      trap: R`Impurities help nucleation; clean liquids in smooth containers supercool most.` },
    { id: 'phtr-r4-07', type: 'nat', level: 4, exams: G, sub: 'nucleation',
      q: R`Water is supercooled by $20$ K below its melting point ($273$ K). The latent heat of fusion per unit volume of ice is $3.06\times10^8$ J/m$^3$ and the ice-water surface tension is $0.030$ J/m$^2$. Using $\Delta g = L_v\Delta T/T_m$, the critical nucleus radius is ______ nm.`,
      answer: 2.68, tol: 0.03, calc: () => 2 * 0.03 * 273 / (3.06e8 * 20) * 1e9,
      sol: R`$\Delta g = 3.06\times10^8\times20/273 = 2.24\times10^7$ J/m$^3$. $r^* = 2\sigma/\Delta g = 0.060/2.24\times10^7 = 2.68\times10^{-9}$ m $= 2.68$ nm. Such a nucleus holds a few thousand molecules, which random fluctuations rarely assemble; that is why pure water supercools.`,
      trap: R`$r^* = \sigma/\Delta g$ (missing the 2) gives $1.34$ nm.` },
    { id: 'phtr-r4-08', type: 'mcq', level: 4, exams: G, sub: 'coexistence',
      q: R`The densities of coexisting liquid and vapour of a pure fluid, $\rho_l(T)$ and $\rho_g(T)$, are measured up to the critical point. Which statement describes the data well?`,
      options: [R`$\rho_l$ and $\rho_g$ both vary linearly with $T$ up to $T_c$`, R`$\rho_l - \rho_g$ vanishes linearly in $T_c - T$, as van der Waals theory predicts`, R`their average $\tfrac12(\rho_l + \rho_g)$ is close to a straight line in $T$ up to $T_c$, while $\rho_l - \rho_g\propto(T_c - T)^\beta$ with $\beta\approx0.33$`, R`$\rho_g$ exceeds $\rho_l$ just below $T_c$`], answer: 2,
      sol: R`The coexistence curve is nearly symmetric about its "diameter", which is close to linear (the law of rectilinear diameters, used to locate $\rho_c$). The width $\rho_l - \rho_g$ is the order parameter of the liquid-gas transition and vanishes as $(T_c - T)^\beta$, with $\beta\approx0.33$ (3D Ising class), not the mean-field $\tfrac12$. It is never linear in $T_c - T$.`,
      trap: R`Mean-field theory gives $\beta = \tfrac12$, not 1; real fluids give about $1/3$.` },
    { id: 'phtr-r4-09', type: 'mcq', level: 5, exams: G, sub: 'Landau theory',
      q: R`An order parameter $m$ couples to an elastic strain $e$: $F = a(T - T_c)m^2 + bm^4 + c\,m^2e + \tfrac12Ke^2$, with $b, K > 0$. Minimising over the strain first, the effective quartic coefficient of $m$ becomes`,
      options: [R`$b + \dfrac{c^2}{2K}$`, R`$b - \dfrac{c^2}{K}$`, R`$b - \dfrac{2c^2}{K}$`, R`$b - \dfrac{c^2}{2K}$`], answer: 3,
      sol: R`$\partial F/\partial e = cm^2 + Ke = 0$ gives $e = -cm^2/K$. Substituting: $cm^2e + \tfrac12Ke^2 = -\dfrac{c^2m^4}{K} + \dfrac{c^2m^4}{2K} = -\dfrac{c^2m^4}{2K}$. So $b_{\rm eff} = b - c^2/2K$. A strong enough coupling ($c^2 > 2bK$) makes $b_{\rm eff}$ negative and turns a continuous transition into a first-order one; this is how lattice strain can change the order of a transition.`,
      trap: R`Keeping only the coupling term at the optimum ($-c^2/K$) forgets the elastic energy stored in the strain.` },
    { id: 'phtr-r4-10', type: 'msq', level: 3, exams: G, sub: 'Ehrenfest classification', format: 'statements',
      q: R`At an Ehrenfest second-order transition, $S$ and $V$ are continuous while $C_P$, $\alpha$ and $\kappa_T$ jump. Which statements are correct?`,
      options: [R`The transition line obeys $\dfrac{dP}{dT} = \dfrac{\Delta C_P}{TV\Delta\alpha}$.`, R`The transition line obeys $\dfrac{dP}{dT} = \dfrac{\Delta\alpha}{\Delta\kappa_T}$.`, R`The Clausius-Clapeyron formula becomes $0/0$ and cannot be used.`, R`There is a latent heat equal to $T\Delta C_P$.`], answer: [0, 1, 2],
      sol: R`Along the line $S$ is continuous: $dS_1 = dS_2$ with $dS = (C_P/T)dT - V\alpha\,dP$ gives the first Ehrenfest equation. $V$ continuous with $dV = V\alpha\,dT - V\kappa_T\,dP$ gives the second. Clausius-Clapeyron, $\Delta S/\Delta V$, is $0/0$ here. With $\Delta S = 0$ there is no latent heat.`,
      trap: R`A jump in $C_P$ is not a latent heat: the entropy itself stays continuous.` },
  ],
  gens: [
    { id: 'phtr-r4g1', type: 'nat', level: 2, exams: A, sub: 'coexistence',
      make(r) {
        const [t, vl, vg] = choose(r, STEAM), m = choose(r, [0.5, 1, 2, 5]);
        const f = choose(r, [0.1, 0.2, 0.3, 0.5, 0.7]), V = round(m * (vl + f * (vg - vl)), 4);
        const x = (V / m - vl) / (vg - vl);
        return { q: `${m} kg of water fills a rigid vessel of $${V}$ m$^3$ at $${t}\\,^\\circ$C, where liquid and vapour coexist with specific volumes $${vl}$ and $${vg}$ m$^3$/kg. The mass fraction that is vapour is ______ (three decimal places).`,
          answer: round(x, 3), tol: 0.002, m, V, vl, vg,
          sol: `Lever rule: $x = \\dfrac{v - v_l}{v_g - v_l}$ with $v = ${V}/${m} = ${round(V / m, 5)}$ m$^3$/kg. $x = (${round(V / m, 5)} - ${vl})/(${vg} - ${vl}) = ${round(x, 3)}$.`,
          trap: 'Use the specific volume of the mixture ($V/m$), not the vessel volume itself.' };
      },
      verify: (p) => (p.V / p.m - p.vl) / (p.vg - p.vl) },
    { id: 'phtr-r4g2', type: 'nat', level: 3, exams: A, sub: 'Clausius-Clapeyron',
      make(r) {
        const s = choose(r, [['ice', 273.16, 611, 51.0], ['solid carbon dioxide', 194.7, 101325, 26.1], ['solid iodine', 386.7, 12100, 62.4], ['naphthalene', 353.4, 1000, 72.0]]);
        const dT = choose(r, [-20, -15, -10, -5]), T2 = round(s[1] + dT, 2);
        const P = s[2] * Math.exp(-(s[3] * 1e3 / 8.314) * (1 / T2 - 1 / s[1]));
        return { q: `The vapour pressure of ${s[0]} is $${s[2]}$ Pa at $${s[1]}$ K, and its molar latent heat of sublimation is about $${s[3]}$ kJ/mol. Treating the vapour as ideal and $L$ as constant, its vapour pressure at $${T2}$ K is ______ Pa.`,
          answer: round(P, P > 1000 ? 0 : 1), tol: Math.max(0.1, round(P * 0.01, 1)), T1: s[1], P1: s[2], L: s[3], T2,
          sol: `$\\ln\\dfrac{P_2}{P_1} = -\\dfrac LR\\Big(\\dfrac1{T_2} - \\dfrac1{T_1}\\Big) = ${round(Math.log(P / s[2]), 4)}$, so $P_2 = ${s[2]}\\times${round(P / s[2], 4)} = ${round(P, 1)}$ Pa.`,
          trap: 'Use kelvin and the latent heat in J/mol, with the minus sign: a colder solid has a lower vapour pressure.' };
      },
      verify: (p) => p.P1 * Math.exp(-(p.L * 1e3 / 8.314) * (1 / p.T2 - 1 / p.T1)) },
    { id: 'phtr-r4g3', type: 'nat', level: 4, exams: G, sub: 'nucleation',
      make(r) {
        const s = choose(r, [['water to ice', 273, 3.06e8, 0.030], ['liquid copper', 1358, 1.88e9, 0.177], ['liquid nickel', 1728, 2.53e9, 0.255], ['liquid aluminium', 933, 9.5e8, 0.093]]);
        const dT = choose(r, [5, 10, 20, 40, 80]);
        const rs = 2 * s[3] * s[1] / (s[2] * dT) * 1e9;
        const Ltex = `${+(s[2] / 10 ** Math.floor(Math.log10(s[2]))).toFixed(2)}\\times10^{${Math.floor(Math.log10(s[2]))}}`;
        return { q: `For the freezing of ${s[0]} (melting point $${s[1]}$ K, latent heat $${Ltex}$ J/m$^3$, solid-liquid surface tension $${s[3]}$ J/m$^2$), the critical nucleus radius at a supercooling of $${dT}$ K, using $\\Delta g = L_v\\Delta T/T_m$, is ______ nm.`,
          answer: round(rs, 3), tol: round(Math.max(0.001, rs * 0.01), 3), Tm: s[1], Lv: s[2], sg: s[3], dT,
          sol: `$\\Delta g = L_v\\Delta T/T_m = ${round(s[2] * dT / s[1] / 1e6, 3)}\\times10^6$ J/m$^3$. $r^* = 2\\sigma/\\Delta g = ${round(rs, 3)}$ nm.`,
          trap: 'The critical radius is $2\\sigma/\\Delta g$; it shrinks as $1/\\Delta T$.' };
      },
      verify: (p) => 2 * p.sg * p.Tm / (p.Lv * p.dT) * 1e9 },
  ],
};
