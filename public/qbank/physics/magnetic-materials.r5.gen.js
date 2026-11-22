// Round 5 extras for magnetic-materials: original questions, written 2026-11-22.
import { pick, int, choose, round, C } from '../_util.js';
const R = String.raw;
const muB = 9.274e-24;

export default {
  items: [
    { id: 'mgm-r5-01', type: 'nat', level: 2, exams: ['jam'], sub: 'curie law',
      q: R`A paramagnetic salt has susceptibility $\chi = 2.0\times10^{-4}$ at $300$ K. If it obeys Curie's law, its susceptibility at $75$ K is ______ $\times10^{-4}$.`,
      answer: 8, tol: 0.01, calc: () => 2 * 300 / 75,
      sol: R`Curie's law: $\chi = C/T$, so $\chi\propto1/T$. Cooling from $300$ K to $75$ K (a factor of 4) raises $\chi$ four times: $8.0\times10^{-4}$.`,
      trap: R`Making $\chi$ fall on cooling; thermal agitation is what fights the alignment.` },
    { id: 'mgm-r5-02', type: 'nat', level: 4, exams: ['jam'], sub: 'curie-weiss',
      q: R`Above its Curie temperature a ferromagnet obeys $\chi = \dfrac{C}{T - T_C}$. Its susceptibility at $1100$ K is three times its value at $1200$ K. $T_C$ is ______ K.`,
      answer: 1050, tol: 1, unit: 'K', calc: () => (3 * 1100 - 1200) / 2,
      sol: R`$\frac{\chi(1100)}{\chi(1200)} = \frac{1200 - T_C}{1100 - T_C} = 3$. So $1200 - T_C = 3300 - 3T_C$, $2T_C = 2100$, $T_C = 1050$ K.`,
      trap: R`Inverting the ratio; $\chi$ is larger at the lower temperature, closer to $T_C$.` },
    { id: 'mgm-r5-03', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'types of magnetism',
      q: R`A material has a small positive susceptibility (about $10^{-5}$) that hardly changes between $20$ K and $300$ K. It is most likely`,
      options: [R`a paramagnetic salt of isolated magnetic ions`, R`a ferromagnet above its Curie temperature`, R`a simple metal such as sodium, showing Pauli paramagnetism`, R`a superconductor`], answer: 2,
      sol: R`Isolated ions follow Curie's law ($\chi\propto1/T$) and a ferromagnet above $T_C$ follows Curie-Weiss; both change strongly with temperature. A superconductor has $\chi = -1$. In a metal only electrons near the Fermi level can flip their spins, which gives a small, temperature-independent positive $\chi$: Pauli paramagnetism.`,
      trap: R`Linking every positive $\chi$ with Curie's law.` },
    { id: 'mgm-r5-04', type: 'msq', level: 3, exams: ['jam'], sub: 'superconductors', format: 'statements',
      q: R`A type-I superconductor in a weak field acts as a perfect diamagnet. Which statements are true?`,
      options: [R`Magnetic field lines crowd into it`, R`Its susceptibility is $\chi = -1$`, R`$\vec B = 0$ inside it`, R`Its magnetisation is $\vec M = -\vec H$`],
      answer: [1, 2, 3],
      sol: R`Perfect diamagnetism means the field is expelled: $\vec B = \mu_0(\vec H + \vec M) = 0$, so $\vec M = -\vec H$ and $\chi = M/H = -1$. Field lines bend around it, not into it (crowding into a body is what a high-$\mu$ material such as iron does).`,
      trap: R`Confusing expulsion of flux (superconductor) with concentration of flux (iron).` },
    { id: 'mgm-r5-05', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'antiferromagnetism', format: 'graph in words',
      q: R`As a crystal is warmed from near $0$ K, its susceptibility rises, reaches a sharp peak at a temperature $T_N$, and then falls slowly as $1/(T + \theta)$ with $\theta > 0$. The material is`,
      options: [R`an antiferromagnet, with Néel temperature $T_N$`, R`a ferromagnet, with Curie temperature $T_N$`, R`a diamagnet`, R`an ideal paramagnet`], answer: 0,
      sol: R`Below $T_N$ neighbouring spins lock antiparallel and resist a field, so $\chi$ is small and grows as the order weakens on warming. At $T_N$ the order disappears and $\chi$ peaks. Above it the material is paramagnetic with Curie-Weiss form $C/(T + \theta)$, the positive $\theta$ reflecting the antiparallel coupling. A ferromagnet's $\chi$ diverges at $T_C$ instead of showing a finite peak.`,
      trap: R`Reading the peak as a ferromagnetic transition; a ferromagnet's $\chi$ blows up at $T_C$.` },
    { id: 'mgm-r5-06', type: 'nat', level: 2, exams: ['jam'], sub: 'magnetisation',
      q: R`A long solenoid with $2000$ turns per metre carries $3.0$ A. Its core is a linear material with $\chi_m = 2.0\times10^{-3}$. The magnetisation of the core is ______ A/m.`,
      answer: 12, tol: 0.01, unit: 'A/m', calc: () => 2e-3 * 2000 * 3,
      sol: R`For a long solenoid $H = nI = 2000\times3.0 = 6000$ A/m, set by the free current alone. Then $M = \chi_mH = 2.0\times10^{-3}\times6000 = 12$ A/m.`,
      trap: R`Multiplying by $\mu_0$; $M$ and $H$ share the unit A/m.` },
    { id: 'mgm-r5-07', type: 'mcq', level: 3, exams: ['jam'], sub: 'hysteresis', format: 'which is NOT',
      q: R`Which statement about choosing ferromagnetic materials is NOT correct?`,
      options: [R`A permanent magnet needs a large remanence`, R`A permanent magnet needs a large coercivity`, R`A transformer core should have a narrow hysteresis loop`, R`A transformer core should have a large coercivity to hold its magnetisation`], answer: 3,
      sol: R`A permanent magnet should keep a strong magnetisation (large remanence) and resist being demagnetised (large coercivity). A transformer core is cycled every half period; the energy lost per cycle is the loop area, so it needs a narrow loop and small coercivity.`,
      trap: R`Thinking every magnetic application wants a "strong" material with a wide loop.` },
    { id: 'mgm-r5-08', type: 'nat', level: 4, exams: ['jam'], sub: 'saturation',
      q: R`Iron has $8.5\times10^{28}$ atoms per m³, and at saturation each contributes about $2.2\mu_B$ ($\mu_B = 9.27\times10^{-24}$ J/T). Its saturation magnetisation is ______ $\times10^6$ A/m (two decimal places).`,
      answer: 1.73, tol: 0.01, unit: 'MA/m', calc: () => 8.5e28 * 2.2 * 9.27e-24 / 1e6,
      sol: R`At saturation every moment points the same way: $M_s = n\mu = 8.5\times10^{28}\times2.2\times9.27\times10^{-24} = 1.73\times10^6$ A/m. Then $\mu_0M_s\approx2.2$ T, close to measured values.`,
      trap: R`Dividing by the volume of one atom twice; $n$ already counts atoms per cubic metre.` },
    { id: 'mgm-r5-09', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'paramagnetism',
      q: R`Independent spin-$\tfrac12$ moments $\mu$ sit in a field $B$ at temperature $T$, with $\mu B = k_BT$. The magnetisation, as a fraction of its saturation value, is about`,
      options: [R`$0.33$`, R`$0.76$`, R`$0.50$`, R`$1.00$`], answer: 1,
      sol: R`Each moment is either along or against $B$, with populations $\propto e^{\pm x}$, $x = \mu B/k_BT$. The average moment is $\mu\frac{e^x - e^{-x}}{e^x + e^{-x}} = \mu\tanh x$. At $x = 1$: $\tanh 1 = 0.762$.`,
      trap: R`Using the weak-field Curie result $M/M_s = x/3$ (giving $0.33$), which is the classical Langevin limit and only valid for $x\ll1$.` },
    { id: 'mgm-r5-10', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'boundary conditions', format: 'statements',
      q: R`A field passes from soft iron ($\mu_r = 5000$) into air across a flat surface that carries no free current. Which statements are true?`,
      options: [R`The normal component of $\vec B$ is continuous`, R`The tangential component of $\vec H$ is continuous`, R`In the air, the field lines leave the iron almost at right angles to its surface`, R`The normal component of $\vec H$ is continuous`],
      answer: [0, 1, 2],
      sol: R`$\nabla\cdot\vec B = 0$ makes $B_\perp$ continuous; with no free surface current, $H_\parallel$ is continuous. Then $\tan\theta_{\rm air} = \frac{\mu_{\rm air}}{\mu_{\rm iron}}\tan\theta_{\rm iron}$, about $1/5000$ of the iron value, so lines leave almost normally. $H_\perp = B_\perp/\mu$ jumps by the factor $\mu_r$.`,
      trap: R`Taking both components of $\vec H$ as continuous.` },
  ],
  gens: [
    { id: 'mgm-r5g1', type: 'nat', level: 4, exams: ['jam'], sub: 'curie-weiss',
      make(r) {
        const Tc = pick(r, 300, 1100, 10), d1 = choose(r, [10, 20, 25, 40, 50]), m = choose(r, [2, 3, 4, 5]), T1 = Tc + d1, T2 = Tc + m * d1;
        return { q: `A ferromagnet obeys $\\chi = C/(T - T_C)$ above $T_C$. Its susceptibility at $${T1}$ K is $${m}$ times its value at $${T2}$ K. $T_C$ is ______ K.`,
          answer: Tc, tol: 0.5, unit: 'K', T1, T2, m,
          sol: `$\\frac{T_2 - T_C}{T_1 - T_C} = ${m}$, so $${T2} - T_C = ${m}(${T1} - T_C)$ and $T_C = \\frac{${m}\\times${T1} - ${T2}}{${m - 1}} = ${Tc}$ K.`,
          trap: 'The susceptibility is larger at the temperature nearer $T_C$.' };
      },
      verify: (p) => (p.m * p.T1 - p.T2) / (p.m - 1) },
    { id: 'mgm-r5g2', type: 'nat', level: 3, exams: ['jam'], sub: 'saturation',
      make(r) {
        const [name, n, mu] = choose(r, [['iron', 8.5, 2.2], ['nickel', 9.1, 0.6], ['cobalt', 9.0, 1.7], ['gadolinium', 3.0, 7.6]]);
        const Ms = n * 1e28 * mu * muB / 1e6;
        return { q: `${name[0].toUpperCase() + name.slice(1)} has $${n}\\times10^{28}$ atoms per m³, each carrying about $${mu}\\mu_B$ at saturation ($\\mu_B = 9.274\\times10^{-24}$ J/T). The saturation magnetisation is ______ $\\times10^6$ A/m (three decimal places).`,
          answer: round(Ms, 3), tol: 0.002, unit: 'MA/m', n, mu,
          sol: `$M_s = n\\mu = ${n}\\times10^{28}\\times${mu}\\times9.274\\times10^{-24} = ${round(Ms, 3)}\\times10^6$ A/m.`,
          trap: 'Magnetisation is moment per unit volume: multiply by the number density.' };
      },
      verify: (p) => p.n * 1e28 * p.mu * muB / 1e6 },
    { id: 'mgm-r5g3', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'paramagnetism',
      make(r) {
        const B = int(r, 1, 10), T = choose(r, [1, 2, 4, 10, 20, 50]), x = muB * B / (C.kB * T), f = Math.tanh(x);
        return { q: `Independent spin-$\\tfrac12$ moments of size $\\mu_B$ sit in a field of $${B}$ T at $${T}$ K. Their magnetisation as a fraction of saturation is ______ (three decimal places).`,
          answer: round(f, 3), tol: 0.002, B, T,
          sol: `$x = \\frac{\\mu_BB}{k_BT} = \\frac{9.274\\times10^{-24}\\times${B}}{1.381\\times10^{-23}\\times${T}} = ${round(x, 4)}$. Two-level populations give $M/M_s = \\tanh x = ${round(f, 3)}$.`,
          trap: 'The Curie form $x$ (or $x/3$ for classical moments) holds only for $x\\ll1$; use $\\tanh x$.' };
      },
      verify: (p) => Math.tanh(muB * p.B / (C.kB * p.T)) },
  ],
};
