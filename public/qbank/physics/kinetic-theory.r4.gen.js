// Round 4 extras for kinetic-theory: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round, C } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const G = ['gate', 'net'];

export default {
  items: [
    { id: 'kth-r4-01', type: 'mcq', level: 1, exams: A, sub: 'pressure',
      q: R`A fixed amount of ideal gas is held at constant volume while its absolute temperature is made four times larger. The average momentum given to the wall in one molecular collision becomes`,
      options: [R`$2$ times larger`, R`$4$ times larger`, R`$\sqrt2$ times larger`, R`unchanged`], answer: 0,
      sol: R`The momentum given in one collision is $2mv_x$, proportional to a typical speed, and speeds scale as $\sqrt T$. Quadrupling $T$ doubles the speed, so each collision delivers twice the momentum. The collision rate also doubles (molecules arrive twice as fast), which is why the pressure, the product of the two, rises four times.`,
      trap: R`Answering 4 confuses the momentum per collision with the pressure, which also includes the doubled collision rate.` },
    { id: 'kth-r4-02', type: 'nat', level: 2, exams: A, sub: 'equipartition',
      q: R`A pollen fragment of mass $1.0\times10^{-15}$ kg drifts in water at $300$ K. Treating its random (Brownian) motion with equipartition, its root-mean-square speed is ______ mm/s ($k_B = 1.38\times10^{-23}$ J/K).`,
      answer: 3.53, tol: 0.04, calc: () => Math.sqrt(3 * 1.380649e-23 * 300 / 1e-15) * 1e3,
      sol: R`Equipartition gives $\tfrac12 m\langle v^2\rangle = \tfrac32kT$ for any particle in thermal equilibrium, however large. So $v_{\rm rms} = \sqrt{3kT/m} = \sqrt{3\times1.38\times10^{-23}\times300/10^{-15}} = \sqrt{1.24\times10^{-5}} = 3.53\times10^{-3}$ m/s $= 3.53$ mm/s. The fragment never moves this fast for long: collisions with water molecules reverse its velocity many times per microsecond, so the visible wandering is far slower.`,
      trap: R`Using $\sqrt{kT/m}$ (one velocity component) gives $2.04$ mm/s.` },
    { id: 'kth-r4-03', type: 'mcq', level: 2, exams: A, sub: 'gas mixtures',
      q: R`A vessel contains $4$ g of helium ($M = 4$ g/mol) and $16$ g of oxygen ($M = 32$ g/mol) at the same temperature. The partial pressure of helium is what fraction of the total pressure?`,
      options: [R`$1/5$`, R`$1/2$`, R`$2/3$`, R`$1/3$`], answer: 2,
      sol: R`Each gas exerts the pressure it would alone, proportional to its number of molecules: $1$ mol of helium and $16/32 = 0.5$ mol of oxygen. The helium fraction is $1/1.5 = 2/3$. Kinetic theory explains why: every molecule, light or heavy, has the same average translational energy $\tfrac32kT$, so each contributes equally to the pressure.`,
      trap: R`$1/5$ is the mass fraction ($4/20$); pressure follows the number of moles, not the mass.` },
    { id: 'kth-r4-04', type: 'nat', level: 3, exams: A, sub: 'transport',
      q: R`Elementary kinetic theory gives $\eta = \tfrac13nm\bar v\lambda$ for the viscosity and $\kappa = \tfrac13nm\bar v\lambda\,c_v$ for the thermal conductivity, where $c_v$ is the specific heat per unit mass. Argon ($M = 40$ g/mol, monatomic) has $\eta = 2.2\times10^{-5}$ Pa s. The thermal conductivity predicted by this simple theory is ______ $\times10^{-3}$ W m$^{-1}$ K$^{-1}$.`,
      answer: 6.86, tol: 0.07, calc: () => 2.2e-5 * 1.5 * 8.314 / 0.040 * 1e3,
      sol: R`The two formulas differ only by $c_v$, so $\kappa = \eta c_v$. For a monatomic gas $c_v = \tfrac32R/M = 1.5\times8.314/0.040 = 311.8$ J kg$^{-1}$ K$^{-1}$. Then $\kappa = 2.2\times10^{-5}\times311.8 = 6.86\times10^{-3}$ W m$^{-1}$ K$^{-1}$. The measured value is about $2.5$ times larger (the Eucken factor), because fast molecules, which carry more energy, also travel farther between collisions; the simple model gives the right order and the right lack of pressure dependence.`,
      trap: R`Using the molar heat capacity $\tfrac32R$ without dividing by $M$ gives a number $25$ times too large.` },
    { id: 'kth-r4-05', type: 'mcq', level: 3, exams: A, sub: 'transport',
      q: R`A dilute gas of hard-sphere molecules in a sealed rigid container is heated from $300$ K to $1200$ K. Using $\eta = \tfrac13nm\bar v\lambda$, its viscosity`,
      options: [R`stays the same, since $n$ is fixed`, R`doubles`, R`becomes four times larger`, R`halves, since molecules collide more often`], answer: 1,
      sol: R`For hard spheres $\lambda = 1/(\sqrt2\pi d^2n)$, so $n\lambda$ is a constant and $\eta = \tfrac13m\bar v(n\lambda)$ depends only on $\bar v\propto\sqrt T$. Four times the temperature gives twice the mean speed and twice the viscosity. Gases, unlike liquids, become more viscous when heated: momentum is carried across the flow by faster molecules.`,
      trap: R`Expecting gases to thin out like liquids when heated; in a gas momentum is carried by the molecules themselves.` },
    { id: 'kth-r4-06', type: 'msq', level: 4, exams: A, sub: 'transport', format: 'statements',
      q: R`A dilute gas of hard-sphere molecules is held at a fixed temperature while its pressure is lowered (at first the mean free path stays far smaller than the container). Which statements are correct?`,
      options: [R`Its thermal conductivity does not change while the mean free path remains small compared with the container.`, R`Its self-diffusion coefficient grows in inverse proportion to the pressure.`, R`Its viscosity falls in proportion to the pressure.`, R`Once the mean free path exceeds the gap between two plates at different temperatures, the heat carried between them falls in proportion to the pressure.`], answer: [0, 1, 3],
      sol: R`$\kappa$ and $\eta$ contain $n\lambda$, which is independent of $n$, so both are independent of pressure (Maxwell's surprising result). $D = \tfrac13\bar v\lambda$ contains $\lambda\propto1/n$ alone, so $D\propto1/P$. When $\lambda$ exceeds the gap, molecules fly straight from plate to plate; each still carries a fixed energy, but their number is proportional to $n$, so the heat flow falls with pressure. This is how a vacuum flask and a Pirani gauge work.`,
      trap: R`Fewer molecules does not mean less viscosity: each one carries momentum proportionally farther.` },
    { id: 'kth-r4-07', type: 'msq', level: 3, exams: A, sub: 'pressure', format: 'statements',
      q: R`The pressure $P$ of a fixed mass of ideal gas is plotted against its density $\rho$, once at temperature $T_1$ and once at $T_2 > T_1$. Which statements are correct?`,
      options: [R`Both graphs are straight lines through the origin.`, R`The line for $T_2$ is the steeper one.`, R`The slope of each line equals $\tfrac13v_{\rm rms}^2$ at that temperature.`, R`The slope of each line equals $\tfrac13\bar v^2$, with $\bar v$ the mean speed.`], answer: [0, 1, 2],
      sol: R`Kinetic theory gives $P = \tfrac13\rho\,v_{\rm rms}^2$, and $v_{\rm rms}^2 = 3kT/m$ depends only on $T$. So at a fixed temperature $P\propto\rho$: a straight line through the origin with slope $\tfrac13v_{\rm rms}^2 = kT/m$, steeper at higher $T$. The mean speed $\bar v$ is smaller than $v_{\rm rms}$ ($\bar v^2 = \tfrac{8}{3\pi}v_{\rm rms}^2$), so the last statement is wrong.`,
      trap: R`The pressure formula averages $v^2$, not the square of the average speed.` },
    { id: 'kth-r4-08', type: 'nat', level: 3, exams: A, sub: 'mean free path',
      q: R`In a gas the mean free path is $50$ nm. Of the molecules that have just collided, the percentage that travel at least $120$ nm before their next collision is ______ %.`,
      answer: 9.07, tol: 0.1, calc: () => 100 * Math.exp(-120 / 50),
      sol: R`The chance of a collision in each short stretch $dx$ is $dx/\lambda$, independent of the distance already travelled, so the survival probability falls exponentially: $P(x) = e^{-x/\lambda}$. Here $P = e^{-120/50} = e^{-2.4} = 0.0907$, or $9.07\%$. The mean of this exponential distribution is $\lambda$ itself, which is what "mean free path" means.`,
      trap: R`Assuming every molecule travels exactly $\lambda$ gives $0\%$; free paths are spread out exponentially.` },
    { id: 'kth-r4-09', type: 'mcq', level: 5, exams: G, sub: 'wall collisions',
      q: R`Molecules of a Maxwellian gas (mean speed $\bar v$) strike a wall. Averaged over the molecules that hit the wall (each counted once per hit), their mean speed is`,
      options: [R`$\bar v$`, R`$\sqrt{3\pi/8}\,\bar v$`, R`$\tfrac{4}{\pi}\bar v$`, R`$\tfrac{3\pi}{8}\bar v$`], answer: 3,
      sol: R`Fast molecules hit the wall more often: the flux of molecules with speed $v$ is proportional to $v f(v)$. So the mean speed of hitting molecules is $\dfrac{\int v^2f\,dv}{\int vf\,dv} = \dfrac{\langle v^2\rangle}{\bar v} = \dfrac{3kT/m}{\bar v}$. With $\bar v^2 = 8kT/\pi m$, $3kT/m = \tfrac{3\pi}{8}\bar v^2$, so the answer is $\tfrac{3\pi}{8}\bar v\approx1.18\,\bar v$. The same flux weighting is why effusing molecules carry $2kT$ of kinetic energy each, not $\tfrac32kT$.`,
      trap: R`$\sqrt{3\pi/8}\,\bar v$ is just $v_{\rm rms}$; the flux weighting gives $\langle v^2\rangle/\langle v\rangle$, not $\sqrt{\langle v^2\rangle}$.` },
    { id: 'kth-r4-10', type: 'nat', level: 4, exams: A, sub: 'effusion',
      q: R`A $1.0$ L vessel of helium ($M = 4.0$ g/mol) is kept at $300$ K and leaks into vacuum through a pinhole of area $1.0\times10^{-8}$ m$^2$. The time for its pressure to fall to half is ______ s ($R = 8.314$ J mol$^{-1}$ K$^{-1}$).`,
      answer: 220, tol: 2.5, calc: () => 4 * 1e-3 / (Math.sqrt(8 * 8.314 * 300 / (Math.PI * 0.004)) * 1e-8) * Math.LN2,
      sol: R`Molecules escape at the effusion rate $\tfrac14n\bar vA$, so $\dfrac{dN}{dt} = -\dfrac{\bar vA}{4V}N$: exponential decay with time constant $\tau = \dfrac{4V}{\bar vA}$. Here $\bar v = \sqrt{8RT/\pi M} = \sqrt{8\times8.314\times300/(\pi\times0.004)} = 1260$ m/s, so $\tau = \dfrac{4\times10^{-3}}{1260\times10^{-8}} = 317$ s. At fixed temperature $P\propto N$, and the half-time is $\tau\ln2 = 220$ s.`,
      trap: R`Using $n\bar vA$ (dropping the $\tfrac14$) makes the leak four times faster: $55$ s.` },
  ],
  gens: [
    { id: 'kth-r4g1', type: 'nat', level: 2, exams: A, sub: 'equipartition',
      make(r) {
        const m = choose(r, [0.5, 1, 2, 5, 10, 20]), T = choose(r, [280, 290, 300, 310, 320, 350]);
        const v = Math.sqrt(3 * C.kB * T / (m * 1e-15)) * 1e3;
        return { q: `A small particle of mass $${m}\\times10^{-15}$ kg is suspended in a liquid at $${T}$ K. By equipartition, the root-mean-square speed of its Brownian motion is ______ mm/s.`,
          answer: round(v, 3), tol: round(v * 0.01, 3), m, T,
          sol: `$\\tfrac12m\\langle v^2\\rangle = \\tfrac32kT$, so $v_{\\rm rms} = \\sqrt{3kT/m} = \\sqrt{3\\times1.381\\times10^{-23}\\times${T}/(${m}\\times10^{-15})} = ${round(v, 3)}$ mm/s.`,
          trap: 'Equipartition holds for a large particle too; leaving out the 3 (one component only) gives a value $\\sqrt3$ times too small.' };
      },
      verify: (p) => Math.sqrt(3 * C.kB * p.T / (p.m * 1e-15)) * 1e3 },
    { id: 'kth-r4g2', type: 'mcq', level: 3, exams: A, sub: 'transport',
      make(r) {
        const a = choose(r, [4, 9, 0.25]), b = choose(r, [2, 3, 0.5]);
        const Q = [
          ['mean free path', a / b, '$\\lambda\\propto T/P$'],
          ['number of collisions per molecule per second', b / Math.sqrt(a), '$\\nu = \\bar v/\\lambda\\propto\\sqrt T\\cdot P/T = P/\\sqrt T$'],
          ['viscosity', Math.sqrt(a), '$\\eta\\propto\\bar v\\,(n\\lambda)\\propto\\sqrt T$, independent of $P$'],
          ['self-diffusion coefficient', a ** 1.5 / b, '$D = \\tfrac13\\bar v\\lambda\\propto\\sqrt T\\cdot T/P = T^{3/2}/P$'],
        ];
        const k = int(r, 0, 3), [name, f, why] = Q[k];
        const show = (x) => `$${round(x, 3)}$`;
        const wrong = Q.filter((_, i) => i !== k).map((x) => x[1]).concat([a, 1 / b, a / b ** 2]);
        const o = mcqOptions(r, f, wrong, show);
        return { q: `A dilute gas of hard-sphere molecules has its absolute temperature multiplied by $${a}$ and its pressure by $${b}$. By elementary kinetic theory, its ${name} is multiplied by`, ...o,
          sol: `Use $\\bar v\\propto\\sqrt T$ and $\\lambda\\propto1/n\\propto T/P$. For the ${name}: ${why}. With $T\\to${a}T$ and $P\\to${b}P$ the factor is $${round(f, 3)}$.`,
          trap: 'At fixed pressure the number density falls as the gas is heated, so the mean free path grows with $T$.' };
      } },
    { id: 'kth-r4g3', type: 'nat', level: 4, exams: A, sub: 'effusion',
      make(r) {
        const g = choose(r, [['helium', 4], ['neon', 20], ['nitrogen', 28], ['argon', 40], ['hydrogen', 2]]);
        const T = choose(r, [250, 300, 350, 400]), V = choose(r, [0.5, 1, 2, 5]), A_ = choose(r, [0.5, 1, 2, 5]);
        const vb = Math.sqrt(8 * 8.314 * T / (Math.PI * g[1] * 1e-3));
        const t = 4 * V * 1e-3 / (vb * A_ * 1e-8) * Math.LN2;
        return { q: `A $${V}$ L vessel of ${g[0]} ($M = ${g[1]}$ g/mol) is held at $${T}$ K and leaks into vacuum through a pinhole of area $${A_}\\times10^{-8}$ m$^2$. Its pressure falls to half in ______ s ($R = 8.314$ J mol$^{-1}$ K$^{-1}$).`,
          answer: round(t, 1), tol: round(Math.max(0.1, t * 0.01), 1), T, V, A: A_, M: g[1],
          sol: `$\\bar v = \\sqrt{8RT/\\pi M} = ${round(vb, 1)}$ m/s. Effusion gives $dN/dt = -\\tfrac14\\bar vA\\,N/V$, so $\\tau = 4V/(\\bar vA) = ${round(t / Math.LN2, 1)}$ s and the half-time is $\\tau\\ln2 = ${round(t, 1)}$ s.`,
          trap: 'The escape rate is $\\tfrac14n\\bar vA$; dropping the $\\tfrac14$ gives a time four times too short.' };
      },
      verify: (p) => 4 * p.V * 1e-3 / (Math.sqrt(8 * 8.314 * p.T / (Math.PI * p.M * 1e-3)) * p.A * 1e-8) * Math.LN2 },
  ],
};
