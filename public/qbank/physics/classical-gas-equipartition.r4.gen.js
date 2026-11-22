// Round 4 extras for classical-gas-equipartition: original questions, written 2026-11-22.
import { choose, round, C } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const G = ['gate', 'net'];

export default {
  items: [
    { id: 'cgeq-r4-01', type: 'mcq', level: 1, exams: A, sub: 'equipartition',
      q: R`A bead slides without friction along a fixed horizontal circular wire and is in thermal equilibrium with the air around it at temperature $T$. Its mean kinetic energy is`,
      options: [R`$\tfrac12kT$`, R`$kT$`, R`$\tfrac32kT$`, R`zero, since it is confined to the wire`], answer: 0,
      sol: R`The bead has one coordinate (its angle along the wire) and its energy is $p^2/2m$ in the one momentum along the wire. One quadratic term gives $\tfrac12kT$. The wire's reaction removes the other two directions of motion, so they get no energy.`,
      trap: R`Giving it $\tfrac32kT$ counts directions of motion that the wire forbids.` },
    { id: 'cgeq-r4-02', type: 'nat', level: 2, exams: G, sub: 'thermal fluctuations',
      q: R`A torsion pendulum used in a sensitive balance has torsion constant $1.0\times10^{-13}$ N m/rad and sits in air at $300$ K. Its root-mean-square angular deflection from thermal agitation is ______ $\mu$rad.`,
      answer: 204, tol: 2, calc: () => Math.sqrt(1.380649e-23 * 300 / 1e-13) * 1e6,
      sol: R`The potential energy $\tfrac12\kappa\theta^2$ is a quadratic term, so $\tfrac12\kappa\langle\theta^2\rangle = \tfrac12kT$. Then $\theta_{\rm rms} = \sqrt{kT/\kappa} = \sqrt{4.14\times10^{-21}/10^{-13}} = 2.04\times10^{-4}$ rad $= 204\ \mu$rad. This thermal jitter sets the smallest torque such a balance can detect.`,
      trap: R`Using $\tfrac32kT$ or $kT$ for one quadratic term overestimates the jitter.` },
    { id: 'cgeq-r4-03', type: 'msq', level: 2, exams: A, sub: 'equipartition', format: 'statements',
      q: R`A mixture of helium and nitrogen (rigid diatomic, vibration frozen) is in equilibrium at temperature $T$ and behaves classically. Which statements are correct?`,
      options: [R`A helium atom and a nitrogen molecule have the same mean translational kinetic energy.`, R`A nitrogen molecule has $5/3$ times the mean total energy of a helium atom.`, R`Helium atoms and nitrogen molecules have the same rms speed.`, R`A nitrogen molecule's mean rotational energy is $kT$.`], answer: [0, 1, 3],
      sol: R`Each translational quadratic term carries $\tfrac12kT$ whatever the mass, so both have $\tfrac32kT$ of translational energy. Nitrogen adds two rotational terms ($kT$), giving $\tfrac52kT$, which is $5/3$ of helium's $\tfrac32kT$. Equal energies with different masses mean different speeds: $v_{\rm rms}\propto1/\sqrt m$, so helium is $\sqrt7$ times faster.`,
      trap: R`Equal energy is not equal speed.` },
    { id: 'cgeq-r4-04', type: 'nat', level: 3, exams: G, sub: 'thermal fluctuations',
      q: R`A $1.0$ pF capacitor is connected across a resistor, and the circuit sits at $300$ K. The root-mean-square thermal noise voltage on the capacitor is ______ $\mu$V.`,
      answer: 64.4, tol: 0.7, calc: () => Math.sqrt(1.380649e-23 * 300 / 1e-12) * 1e6,
      sol: R`The energy stored in the capacitor, $\tfrac12CV^2$, is quadratic in $V$, so in equilibrium $\tfrac12C\langle V^2\rangle = \tfrac12kT$. $V_{\rm rms} = \sqrt{kT/C} = \sqrt{4.14\times10^{-21}/10^{-12}} = 6.44\times10^{-5}$ V $= 64.4\ \mu$V. The resistance does not appear: a larger resistor makes more noise per unit bandwidth but over a narrower bandwidth. This "$kT/C$ noise" limits image sensors and sampling circuits.`,
      trap: R`Expecting the resistance to appear; the total noise on the capacitor depends only on $kT/C$.` },
    { id: 'cgeq-r4-05', type: 'nat', level: 3, exams: G, sub: 'energy distribution',
      q: R`Classical one-dimensional harmonic oscillators are in equilibrium at temperature $T$. The fraction of them with total energy above $3kT$ is ______ (three decimal places).`,
      answer: 0.050, tol: 0.001, calc: () => Math.exp(-3),
      sol: R`For $H = p^2/2m + \tfrac12m\omega^2x^2$ the phase-space area with energy below $E$ is an ellipse of area $2\pi E/\omega$, which grows linearly in $E$. So the density of states is constant and the energy distribution is a plain exponential, $P(E)\propto e^{-E/kT}$. The fraction above $3kT$ is $e^{-3} = 0.0498\approx0.050$.`,
      trap: R`A free particle in 3D has $P(E)\propto\sqrt Ee^{-E/kT}$; an oscillator in 1D has two quadratic terms and a flat density of states.` },
    { id: 'cgeq-r4-06', type: 'msq', level: 4, exams: G, sub: 'generalised equipartition', format: 'statements',
      q: R`For a classical system with $H(q, p)$ at temperature $T$, integrating by parts in the Boltzmann average gives $\langle(\partial H/\partial q)^2\rangle = kT\,\langle\partial^2H/\partial q^2\rangle$ whenever $e^{-H/kT}$ vanishes at the ends of the range of $q$. Which statements are correct?`,
      options: [R`The identity holds for any such potential, not only quadratic ones.`, R`For $H = p^2/2m + \tfrac12Kq^2$ it gives $\langle\tfrac12Kq^2\rangle = \tfrac12kT$.`, R`It shows that every degree of freedom carries $\tfrac12kT$ of potential energy.`, R`For a pendulum, $V = mgl(1 - \cos\theta)$, it gives $\langle\sin^2\theta\rangle = \dfrac{kT}{mgl}\langle\cos\theta\rangle$.`], answer: [0, 1, 3],
      sol: R`$\int(\partial_qH)^2e^{-\beta H}dq = -\beta^{-1}\int\partial_qH\,\partial_q(e^{-\beta H})dq = \beta^{-1}\int\partial_q^2H\,e^{-\beta H}dq$, valid for any $H$ with vanishing boundary terms. For $\tfrac12Kq^2$: $K^2\langle q^2\rangle = kTK$, so $\langle\tfrac12Kq^2\rangle = \tfrac12kT$. For the pendulum, $\partial_\theta V = mgl\sin\theta$ and $\partial^2_\theta V = mgl\cos\theta$, giving the stated result (on a full circle the ends are the same point, so the boundary terms cancel). A non-quadratic potential does not get $\tfrac12kT$: equipartition of $\tfrac12kT$ is special to quadratic terms.`,
      trap: R`The identity is general; the "$\tfrac12kT$ per term" rule is the special quadratic case.` },
    { id: 'cgeq-r4-07', type: 'mcq', level: 3, exams: G, sub: 'equipartition',
      q: R`Atoms adsorbed on a crystal surface glide freely along the surface but are bound perpendicular to it by a harmonic potential. Treated classically, their heat capacity per atom is`,
      options: [R`$\tfrac32k$`, R`$2k$`, R`$\tfrac52k$`, R`$3k$`], answer: 1,
      sol: R`Quadratic terms: kinetic energy in all three directions ($3$ terms) and the harmonic potential perpendicular to the surface ($1$ term). The free gliding adds no potential term. Four quadratic terms give $\langle E\rangle = 2kT$ and $C = 2k$ per atom.`,
      trap: R`$\tfrac52k$ counts a potential term for the sliding motion, which has none.` },
    { id: 'cgeq-r4-08', type: 'mcq', level: 4, exams: G, sub: 'generalised equipartition',
      q: R`A classical ideal gas is made of particles whose energy is some increasing function $\varepsilon(p)$ of momentum, for example the relativistic $\sqrt{p^2c^2 + m^2c^4}$. Its pressure is`,
      options: [R`$nkT$ only in the non-relativistic limit`, R`$\tfrac13nkT$ in the ultra-relativistic limit`, R`$nkT$, whatever $\varepsilon(p)$ is`, R`$\tfrac23$ of the kinetic energy density, whatever $\varepsilon(p)$ is`], answer: 2,
      sol: R`Kinetic theory gives $P = \tfrac13n\langle\mathbf p\cdot\mathbf v\rangle$ with $\mathbf v = \partial\varepsilon/\partial\mathbf p$. The generalised equipartition theorem says $\langle p_i\,\partial H/\partial p_i\rangle = kT$ for each component, so $\langle\mathbf p\cdot\mathbf v\rangle = 3kT$ and $P = nkT$ for any dispersion. What changes with $\varepsilon(p)$ is the energy: $P = \tfrac23u$ holds only for $\varepsilon\propto p^2$, and $P = \tfrac13u$ for $\varepsilon\propto p$.`,
      trap: R`$PV = NkT$ is about momentum transfer, not energy; it survives any dispersion law in a classical gas.` },
    { id: 'cgeq-r4-09', type: 'mcq', level: 5, exams: G, sub: 'classical dipoles',
      q: R`Classical rigid dipoles of moment $\mu$ that can rotate only in a plane containing a weak field $B$ (energy $-\mu B\cos\theta$) are compared with dipoles free to point anywhere in 3D. At the same small $\mu B/kT$, the ratio of the mean alignment $\langle\cos\theta\rangle$ in the plane to that in 3D is`,
      options: [R`$2/3$`, R`$1$`, R`$1/2$`, R`$3/2$`], answer: 3,
      sol: R`In the plane, $\langle\cos\theta\rangle = \dfrac{\int_0^{2\pi}\cos\theta\,e^{x\cos\theta}d\theta}{\int_0^{2\pi}e^{x\cos\theta}d\theta} = \dfrac{I_1(x)}{I_0(x)}\approx\dfrac x2$ for small $x = \mu B/kT$ (expand: numerator $\approx x\langle\cos^2\theta\rangle = x/2$). In 3D the Langevin function gives $x/3$, because $\langle\cos^2\theta\rangle = 1/3$ over a sphere. Ratio $= 3/2$: with fewer directions to wander in, a dipole aligns more readily.`,
      trap: R`The small-field response is $x\langle\cos^2\theta\rangle$: $1/2$ on a circle, $1/3$ on a sphere.` },
    { id: 'cgeq-r4-10', type: 'nat', level: 5, exams: G, sub: 'gas in gravity',
      q: R`A monatomic classical ideal gas fills a vertical cylinder of height $H$ in uniform gravity, with $mgH = kT$ at the temperature of interest. Its heat capacity at constant volume, $C_V/Nk$, is ______ (three decimal places).`,
      answer: 1.579, tol: 0.003, calc: () => 2.5 - Math.exp(1) / (Math.exp(1) - 1) ** 2,
      sol: R`The kinetic part gives $\tfrac32$. For the height, $\langle mgz\rangle = kT - \dfrac{mgH}{e^{mgH/kT} - 1}$ (from $Z_z = \int_0^He^{-mgz/kT}dz$). Differentiating with $x = mgH/kT$: $\dfrac{d\langle mgz\rangle}{d(kT)} = 1 - \dfrac{x^2e^x}{(e^x - 1)^2}$. At $x = 1$: $1 - e/(e - 1)^2 = 1 - 2.718/2.952 = 0.079$. Total $C_V/Nk = 1.5 + 0.079 = 1.579$. The limits check out: a very tall column ($x\to\infty$) gives $\tfrac52$, a short one ($x\to0$) gives $\tfrac32$.`,
      trap: R`Treating $mgz$ as a quadratic term (adding $\tfrac12$) or as the infinite-column result (adding 1) ignores the finite height.` },
  ],
  gens: [
    { id: 'cgeq-r4g1', type: 'nat', level: 3, exams: G, sub: 'thermal fluctuations',
      make(r) {
        const Cp = choose(r, [0.1, 0.5, 1, 2, 5, 10]), T = choose(r, [4, 77, 200, 300, 350]);
        const v = Math.sqrt(C.kB * T / (Cp * 1e-12)) * 1e6;
        return { q: `A $${Cp}$ pF capacitor is connected across a resistor at $${T}$ K. The root-mean-square thermal noise voltage across the capacitor is ______ $\\mu$V.`,
          answer: round(v, 2), tol: round(Math.max(0.01, v * 0.01), 2), Cp, T,
          sol: `Equipartition: $\\tfrac12C\\langle V^2\\rangle = \\tfrac12kT$, so $V_{\\rm rms} = \\sqrt{kT/C} = \\sqrt{1.381\\times10^{-23}\\times${T}/(${Cp}\\times10^{-12})} = ${round(v, 2)}\\ \\mu$V, independent of the resistance.`,
          trap: 'One quadratic term carries $\\tfrac12kT$; the resistance drops out of the total.' };
      },
      verify: (p) => Math.sqrt(C.kB * p.T / (p.Cp * 1e-12)) * 1e6 },
    { id: 'cgeq-r4g2', type: 'nat', level: 2, exams: G, sub: 'thermal fluctuations',
      make(r) {
        const T = choose(r, [4.2, 77, 300]), cant = r() < 0.5;
        const K = cant ? choose(r, [0.01, 0.05, 0.1, 0.5, 1, 5]) : choose(r, [1e-14, 5e-14, 1e-13, 5e-13, 1e-12]);
        const x = Math.sqrt(C.kB * T / K) * (cant ? 1e9 : 1e6);
        const Ktex = cant ? `${K}` : `${+(K / 10 ** Math.floor(Math.log10(K))).toFixed(1)}\\times10^{${Math.floor(Math.log10(K))}}`;
        return { q: cant
            ? `An atomic-force-microscope cantilever has spring constant $${Ktex}$ N/m and is at $${T}$ K. Its root-mean-square thermal deflection is ______ nm.`
            : `A torsion pendulum has torsion constant $${Ktex}$ N m/rad and is at $${T}$ K. Its root-mean-square thermal angular deflection is ______ $\\mu$rad.`,
          answer: round(x, 4), tol: Math.max(0.0001, round(x * 0.01, 4)), K, T, f: cant ? 1e9 : 1e6,
          sol: `The stored energy $\\tfrac12K${cant ? 'x' : '\\theta'}^2$ is one quadratic term, so $\\tfrac12K\\langle ${cant ? 'x' : '\\theta'}^2\\rangle = \\tfrac12kT$ and the rms value is $\\sqrt{kT/K} = ${round(x, 4)}$ ${cant ? 'nm' : '$\\mu$rad'}.`,
          trap: 'Equipartition gives $\\tfrac12kT$ to this single quadratic term, not $\\tfrac32kT$.' };
      },
      verify: (p) => Math.sqrt(C.kB * p.T / p.K) * p.f },
    { id: 'cgeq-r4g3', type: 'nat', level: 3, exams: G, sub: 'energy distribution',
      make(r) {
        const d = choose(r, [1, 2]), x = choose(r, [1, 1.5, 2, 2.5, 3, 4, 5]);
        const P = d === 1 ? Math.exp(-x) : (1 + x) * Math.exp(-x);
        return { q: `Classical ${d === 1 ? 'one' : 'two'}-dimensional isotropic harmonic oscillators are in equilibrium at temperature $T$. The fraction with total energy above $${x}kT$ is ______ (four decimal places).`,
          answer: round(P, 4), tol: Math.max(0.0005, round(P * 0.01, 4)), d, x,
          sol: d === 1
            ? `With 2 quadratic terms the density of states is constant, so $P(E)\\propto e^{-E/kT}$ and the fraction above $${x}kT$ is $e^{-${x}} = ${round(P, 4)}$.`
            : `With 4 quadratic terms the density of states grows as $E$, so $P(E)\\propto Ee^{-E/kT}$. The fraction above $xkT$ is $(1 + x)e^{-x} = ${round(1 + x, 2)}\\,e^{-${x}} = ${round(P, 4)}$.`,
          trap: 'The shape of the energy distribution depends on the number of quadratic terms, through the density of states.' };
      },
      verify: (p) => (p.d === 1 ? 1 : 1 + p.x) * Math.exp(-p.x) },
  ],
};
