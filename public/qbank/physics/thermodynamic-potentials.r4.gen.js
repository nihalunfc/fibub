// Round 4 extras for thermodynamic-potentials: original questions, written 2026-11-22.
import { choose, round } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const G = ['gate', 'net'];

export default {
  items: [
    { id: 'tpot-r4-01', type: 'mcq', level: 1, exams: A, sub: 'chemical potential',
      q: R`For a system made of a single kind of particle, the chemical potential $\mu$ equals`,
      options: [R`the Helmholtz energy per particle, $F/N$`, R`the internal energy per particle, $U/N$`, R`the Gibbs energy per particle, $G/N$`, R`the enthalpy per particle, $H/N$`], answer: 2,
      sol: R`$\mu = (\partial G/\partial N)_{T,P}$. At fixed $T$ and $P$, which are intensive, $G$ can only grow in proportion to $N$, so $G = N\mu(T, P)$ and $\mu = G/N$. For $F(T, V, N)$ the same argument fails, because $V$ is extensive and must grow with $N$; so $\mu \neq F/N$ in general.`,
      trap: R`$\mu = (\partial F/\partial N)_{T,V}$ is true, but that derivative is not $F/N$.` },
    { id: 'tpot-r4-02', type: 'msq', level: 2, exams: A, sub: 'Gibbs energy', format: 'statements',
      q: R`For a simple one-component system with $dG = -S\,dT + V\,dP + \mu\,dN$, which relations are correct?`,
      options: [R`$V = (\partial G/\partial P)_{T,N}$`, R`$(\partial G/\partial T)_{P,N} = S$`, R`$C_P = -T(\partial^2G/\partial T^2)_{P,N}$`, R`$\mu = (\partial G/\partial N)_{T,P}$`], answer: [0, 2, 3],
      sol: R`Read the coefficients of $dG$: $V = \partial G/\partial P$, $\mu = \partial G/\partial N$, and $\partial G/\partial T = -S$ (minus sign), so the second relation is wrong. Then $C_P = T(\partial S/\partial T)_P = -T(\partial^2G/\partial T^2)_P$. Because $C_P > 0$, $G(T)$ at fixed $P$ always curves downward.`,
      trap: R`The sign: $G$ falls with temperature at fixed pressure, since $S > 0$.` },
    { id: 'tpot-r4-03', type: 'nat', level: 3, exams: A, sub: 'Maxwell relations',
      q: R`Mercury at $300$ K has molar volume $1.48\times10^{-5}$ m$^3$ and volume expansion coefficient $1.81\times10^{-4}$ K$^{-1}$. Using $(\partial H/\partial P)_T = V(1 - T\alpha)$, its molar enthalpy rises by ______ J/mol when the pressure is raised by $50$ MPa at constant temperature (treat $V$ and $\alpha$ as constant).`,
      answer: 701, tol: 7, calc: () => 1.48e-5 * (1 - 300 * 1.81e-4) * 5e7,
      sol: R`From $dH = T\,dS + V\,dP$ and the Maxwell relation $(\partial S/\partial P)_T = -(\partial V/\partial T)_P = -V\alpha$: $(\partial H/\partial P)_T = V - TV\alpha = V(1 - T\alpha)$. Here $1 - 300\times1.81\times10^{-4} = 0.946$, so $\Delta H = 1.48\times10^{-5}\times0.946\times5\times10^7 = 701$ J/mol. The $T\alpha$ term is the heat released during the compression; for a liquid it is a small correction.`,
      trap: R`Using $\Delta H = V\Delta P$ ($740$ J/mol) forgets that $H$ also changes through $T\,dS$.` },
    { id: 'tpot-r4-04', type: 'mcq', level: 3, exams: G, sub: 'fundamental relations',
      q: R`A fundamental relation $S(U, V, N)$ must be first-order homogeneous (doubling $U$, $V$ and $N$ doubles $S$). Which candidate fails this test? ($A$ is a positive constant.)`,
      options: [R`$S = A\,(NVU)^{1/3}$`, R`$S = A\,(NVU)^{1/2}$`, R`$S = A\,U^{2/3}V^{2/3}N^{-1/3}$`, R`$S = AN\ln\!\big(UV/N^2\big)$`], answer: 1,
      sol: R`Scale everything by $\lambda$. $(NVU)^{1/3}\to\lambda(NVU)^{1/3}$; $U^{2/3}V^{2/3}N^{-1/3}\to\lambda^{2/3 + 2/3 - 1/3} = \lambda$; $N\ln(UV/N^2)\to\lambda N\ln(UV/N^2)$, since the ratio inside is unchanged. But $(NVU)^{1/2}\to\lambda^{3/2}(NVU)^{1/2}$: entropy would grow faster than the size of the system, so it is not extensive.`,
      trap: R`Count the total power of $U$, $V$ and $N$ together; it must equal one.` },
    { id: 'tpot-r4-05', type: 'mcq', level: 3, exams: G, sub: 'Maxwell relations',
      q: R`A soap film has surface tension $\sigma(T)$ that falls as the temperature rises, and $dF = -S\,dT + \sigma\,dA$. When the film is stretched slowly at constant temperature, it`,
      options: [R`gives out heat, since $\sigma > 0$`, R`exchanges no heat; all the energy is work`, R`absorbs heat equal to $\sigma\,\Delta A$`, R`absorbs heat, since $(\partial S/\partial A)_T = -d\sigma/dT > 0$`], answer: 3,
      sol: R`The Maxwell relation from $dF$ is $(\partial S/\partial A)_T = -(\partial\sigma/\partial T)_A$. Because $\sigma$ falls with temperature, this is positive: new surface has extra entropy, and at constant $T$ the film must absorb heat $T\Delta S = -T(d\sigma/dT)\Delta A$. The work $\sigma\Delta A$ is a separate input; together they make up the surface's internal energy.`,
      trap: R`$\sigma\Delta A$ is the work done on the film, not the heat.` },
    { id: 'tpot-r4-06', type: 'nat', level: 2, exams: G, sub: 'Maxwell relations',
      q: R`The surface tension of water near room temperature falls by $1.5\times10^{-4}$ N m$^{-1}$ per kelvin. When the area of a water surface is increased by $10$ cm$^2$ at a constant $300$ K, the heat it absorbs is ______ $\mu$J.`,
      answer: 45, tol: 0.5, calc: () => 300 * 1.5e-4 * 10e-4 * 1e6,
      sol: R`From $dF = -S\,dT + \sigma\,dA$, $(\partial S/\partial A)_T = -d\sigma/dT = 1.5\times10^{-4}$ J m$^{-2}$ K$^{-1}$. Heat $= T\Delta S = 300\times1.5\times10^{-4}\times10\times10^{-4} = 4.5\times10^{-5}$ J $= 45\ \mu$J. If the surface were stretched with no heat supplied, it would cool instead.`,
      trap: R`$10$ cm$^2$ is $10^{-3}$ m$^2$, not $10^{-2}$.` },
    { id: 'tpot-r4-07', type: 'msq', level: 4, exams: G, sub: 'Joule-Thomson effect', format: 'statements',
      q: R`A gas obeys $P(V - b) = RT$ per mole, with $b > 0$ constant and a constant $C_P$. Which statements are correct?`,
      options: [R`$(\partial H/\partial P)_T = b$`, R`Its Joule-Thomson coefficient is $\mu_{JT} = -b/C_P$.`, R`It has an inversion temperature, above which throttling warms it.`, R`It warms on throttling at every temperature.`], answer: [0, 1, 3],
      sol: R`$(\partial H/\partial P)_T = V - T(\partial V/\partial T)_P = V - T\cdot R/P = V - (V - b) = b$. Then $\mu_{JT} = (\partial T/\partial P)_H = -\dfrac{(\partial H/\partial P)_T}{C_P} = -\dfrac{b}{C_P} < 0$: a pressure drop always raises the temperature. With no attraction term there is nothing to cool the gas, so there is no inversion temperature.`,
      trap: R`Inversion needs both repulsion ($b$) and attraction ($a$); this gas has only repulsion.` },
    { id: 'tpot-r4-08', type: 'mcq', level: 4, exams: G, sub: 'thermodynamic identities',
      q: R`For a simple fluid with expansion coefficient $\alpha$ and isothermal compressibility $\kappa_T$, the derivative $(\partial U/\partial P)_T$ equals`,
      options: [R`$V(1 - T\alpha)$`, R`$TV\alpha - PV\kappa_T$`, R`$-TV\alpha$`, R`$-TV\alpha + PV\kappa_T$`], answer: 3,
      sol: R`$dU = T\,dS - P\,dV$, so $(\partial U/\partial P)_T = T(\partial S/\partial P)_T - P(\partial V/\partial P)_T$. The Maxwell relation from $G$ gives $(\partial S/\partial P)_T = -(\partial V/\partial T)_P = -V\alpha$, and $(\partial V/\partial P)_T = -V\kappa_T$. So $(\partial U/\partial P)_T = -TV\alpha + PV\kappa_T$. For an ideal gas $\alpha = 1/T$ and $\kappa_T = 1/P$, which gives zero, as it must.`,
      trap: R`$V(1 - T\alpha)$ is $(\partial H/\partial P)_T$, not $(\partial U/\partial P)_T$.` },
    { id: 'tpot-r4-09', type: 'nat', level: 5, exams: G, sub: 'fugacity',
      q: R`The fugacity $f$ of a gas is defined by $\mu = \mu^\circ(T) + RT\ln(f/P^\circ)$, with $f\to P$ at low pressure. For one mole of a gas obeying $P(V - b) = RT$ with $b = 3.2\times10^{-5}$ m$^3$/mol at $300$ K and $P = 1.0\times10^7$ Pa, the fugacity coefficient $f/P$ is ______ (three decimal places).`,
      answer: 1.137, tol: 0.002, calc: () => Math.exp(3.2e-5 * 1e7 / (8.314 * 300)),
      sol: R`At fixed $T$, $d\mu = V\,dP = (RT/P + b)\,dP$. For an ideal gas $d\mu = RT\,d\ln P$, so the extra term gives $RT\ln(f/P) = \int_0^Pb\,dP' = bP$. Then $\ln(f/P) = bP/RT = 3.2\times10^{-5}\times10^7/(8.314\times300) = 0.128$, and $f/P = e^{0.128} = 1.137$. A repulsive gas has $f > P$: it "escapes" more readily than an ideal gas at the same pressure.`,
      trap: R`Writing $f/P = 1 + bP/RT$ ($1.128$) keeps only the first term of the exponential.` },
    { id: 'tpot-r4-10', type: 'mcq', level: 2, exams: A, sub: 'Gibbs energy',
      q: R`At fixed pressure, the Gibbs energy $G$ of a substance is plotted against temperature. The curve`,
      options: [R`falls with slope $-S$ and bends downward, with curvature $-C_P/T$`, R`rises with slope $S$ and bends upward`, R`falls with slope $-S$ and bends upward`, R`is a straight line, since $S$ is constant`], answer: 0,
      sol: R`$(\partial G/\partial T)_P = -S < 0$, so $G$ falls. $(\partial^2G/\partial T^2)_P = -(\partial S/\partial T)_P = -C_P/T < 0$, so the slope grows steeper as $T$ rises: the curve bends downward. This is why, at a phase transition, the phase with the larger entropy (steeper curve) wins at higher temperature.`,
      trap: R`Positive entropy and positive heat capacity give a negative slope and a negative curvature.` },
  ],
  gens: [
    { id: 'tpot-r4g1', type: 'nat', level: 2, exams: G, sub: 'Maxwell relations',
      make(r) {
        const liq = choose(r, [['water', 1.5], ['ethanol', 0.9], ['glycerol', 0.6], ['mercury', 0.2], ['benzene', 1.3]]);
        const T = choose(r, [280, 290, 300, 310, 320]), dA = choose(r, [5, 10, 20, 50, 100]);
        const Q = T * liq[1] * 1e-4 * dA * 1e-4 * 1e6;
        return { q: `The surface tension of ${liq[0]} falls by about $${liq[1]}\\times10^{-4}$ N m$^{-1}$ per kelvin. When its surface area is increased by $${dA}$ cm$^2$ at a constant $${T}$ K, the heat absorbed is ______ $\\mu$J.`,
          answer: round(Q, 2), tol: round(Math.max(0.01, Q * 0.01), 2), T, s: liq[1], dA,
          sol: `$(\\partial S/\\partial A)_T = -d\\sigma/dT = ${liq[1]}\\times10^{-4}$ J m$^{-2}$ K$^{-1}$ (Maxwell relation from $dF = -S\\,dT + \\sigma\\,dA$). $Q = T\\Delta S = ${T}\\times${liq[1]}\\times10^{-4}\\times${dA}\\times10^{-4} = ${round(Q, 2)}\\ \\mu$J.`,
          trap: 'The heat is $-T(d\\sigma/dT)\\Delta A$, not the work $\\sigma\\Delta A$; and 1 cm$^2$ = $10^{-4}$ m$^2$.' };
      },
      verify: (p) => p.T * p.s * 1e-4 * p.dA * 1e-4 * 1e6 },
    { id: 'tpot-r4g2', type: 'nat', level: 5, exams: G, sub: 'fugacity',
      make(r) {
        const b = choose(r, [2.4, 3.2, 3.9, 4.3]), P = choose(r, [20, 50, 100, 150, 200]), T = choose(r, [250, 300, 350, 400, 500]);
        const phi = Math.exp(b * 1e-5 * P * 1e5 / (8.314 * T));
        return { q: `A gas obeys $P(V - b) = RT$ per mole with $b = ${b}\\times10^{-5}$ m$^3$/mol. At $${T}$ K and $${P}$ bar, its fugacity coefficient $f/P$ is ______ (three decimal places; $R = 8.314$ J mol$^{-1}$ K$^{-1}$).`,
          answer: round(phi, 3), tol: Math.max(0.001, round((phi - 1) * 0.01, 3)), b, P, T,
          sol: `$d\\mu = V\\,dP = (RT/P + b)\\,dP$, so $RT\\ln(f/P) = bP$. $\\ln(f/P) = ${b}\\times10^{-5}\\times${P}\\times10^5/(8.314\\times${T}) = ${round(Math.log(phi), 4)}$, $f/P = ${round(phi, 3)}$.`,
          trap: 'The correction is exponential: $f/P = e^{bP/RT}$, not $1 + bP/RT$.' };
      },
      verify: (p) => Math.exp(p.b * 1e-5 * p.P * 1e5 / (8.314 * p.T)) },
    { id: 'tpot-r4g3', type: 'nat', level: 3, exams: A, sub: 'Maxwell relations',
      make(r) {
        const liq = choose(r, [['water', 18.0, 2.1], ['mercury', 14.8, 1.81], ['ethanol', 58.4, 11.0], ['benzene', 89.4, 12.4], ['copper', 7.11, 0.50]]);
        const T = choose(r, [280, 300, 320, 350]), dP = choose(r, [10, 20, 50, 100]);
        const dH = liq[1] * 1e-6 * (1 - T * liq[2] * 1e-4) * dP * 1e6;
        return { q: `${liq[0][0].toUpperCase() + liq[0].slice(1)} has molar volume $${liq[1]}\\times10^{-6}$ m$^3$ and volume expansion coefficient $${liq[2]}\\times10^{-4}$ K$^{-1}$. Treating both as constant, its molar enthalpy rises by ______ J/mol when the pressure is raised by $${dP}$ MPa at a constant $${T}$ K.`,
          answer: round(dH, 1), tol: round(Math.max(0.1, dH * 0.01), 1), V: liq[1], al: liq[2], T, dP,
          sol: `$(\\partial H/\\partial P)_T = V - T(\\partial V/\\partial T)_P = V(1 - T\\alpha) = ${liq[1]}\\times10^{-6}\\times${round(1 - T * liq[2] * 1e-4, 4)}$ m$^3$/mol. Times $${dP}\\times10^6$ Pa: $${round(dH, 1)}$ J/mol.`,
          trap: 'Using $V\\Delta P$ alone ignores the heat released as the substance is compressed.' };
      },
      verify: (p) => p.V * 1e-6 * (1 - p.T * p.al * 1e-4) * p.dP * 1e6 },
  ],
};
