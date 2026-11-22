// Round 4 extras for multipoles: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round, C } from '../_util.js';
const R = String.raw;
const k = 1 / (4 * Math.PI * C.eps0);

export default {
  items: [
    { id: 'mpl-r4-01', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'dipole moment',
      q: R`A thin spherical shell of radius $10$ cm carries surface charge $\sigma = \sigma_0\cos\theta$ with $\sigma_0 = 1.0\ \mu$C/m². Its dipole moment is ______ $\times10^{-9}$ C m (two decimal places).`,
      answer: 4.19, tol: 0.02, unit: '×10⁻⁹ C m', calc: () => 4 / 3 * Math.PI * 1e-6 * 0.1 ** 3 * 1e9,
      sol: R`By symmetry only $p_z$ survives: $p_z = \int z\sigma\,da = \int_0^{2\pi}\!\int_0^\pi(R\cos\theta)(\sigma_0\cos\theta)R^2\sin\theta\,d\theta\,d\phi = 2\pi\sigma_0R^3\cdot\frac23 = \frac{4\pi}{3}\sigma_0R^3$. Numbers: $\frac{4\pi}{3}\times10^{-6}\times10^{-3} = 4.19\times10^{-9}$ C m. (Its total charge is zero.)`,
      trap: R`Forgetting the $\cos\theta$ from $z = R\cos\theta$, which makes the integral vanish.` },
    { id: 'mpl-r4-02', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'dipole in a field',
      q: R`A small dipole sits near a long, positively charged straight wire, with its moment pointing directly away from the wire. The net force on the dipole`,
      options: [R`pushes it away from the wire`, R`pulls it towards the wire`, R`is zero; it feels only a torque`, R`is along the wire`], answer: 1,
      sol: R`The wire's field $E = \frac{\lambda}{2\pi\varepsilon_0s}$ points outward and weakens with $s$. The force on a dipole is $(\vec p\cdot\nabla)\vec E = p\frac{dE}{ds}\hat s = -\frac{p\lambda}{2\pi\varepsilon_0s^2}\hat s$: towards the wire. In words: the dipole's negative end, nearer the wire, is pulled harder than the positive end is pushed. A dipole lined up with a field is drawn into the stronger field.`,
      trap: R`Thinking a neutral dipole feels no force; in a non-uniform field it does.` },
    { id: 'mpl-r4-03', type: 'nat', level: 3, exams: ['jam'], sub: 'dipole in a field',
      q: R`A water molecule (dipole moment $6.2\times10^{-30}$ C m) points straight away from a sodium ion ($+e$) $0.50$ nm away. The size of their interaction energy is ______ eV (three decimal places).`,
      answer: 0.223, tol: 0.003, unit: 'eV', calc: () => 6.2e-30 * k * C.e / (0.5e-9) ** 2 / C.e,
      sol: R`The ion's field at the molecule is $E = \frac{ke}{r^2} = \frac{8.99\times10^9\times1.60\times10^{-19}}{(5.0\times10^{-10})^2} = 5.76\times10^9$ V/m. The energy of an aligned dipole is $U = -pE = -6.2\times10^{-30}\times5.76\times10^9 = -3.57\times10^{-20}$ J $= -0.223$ eV, several times $k_BT$ at room temperature ($0.026$ eV), which is why ions hold shells of water.`,
      trap: R`Using the charge-charge energy $\frac{ke^2}{r}$; a dipole's energy goes as $1/r^2$.` },
    { id: 'mpl-r4-04', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'quadrupole',
      q: R`Model a deformed nucleus of charge $Ze$ with $Z = 70$ as a uniformly charged prolate spheroid with semi-axes $c = 7.5$ fm (along the symmetry axis) and $a = 6.0$ fm. Its quadrupole moment $Q = \frac25Z(c^2 - a^2)$ is ______ barn (two decimal places; $1$ b $= 100$ fm²).`,
      answer: 5.67, tol: 0.03, unit: 'b', calc: () => 0.4 * 70 * (7.5 ** 2 - 6 ** 2) / 100,
      sol: R`$c^2 - a^2 = 56.25 - 36 = 20.25$ fm². $Q = 0.4\times70\times20.25 = 567$ fm² $= 5.67$ b. Positive $Q$ means a cigar (prolate) shape, stretched along the axis; a flattened (oblate) nucleus has $Q < 0$.`,
      trap: R`Dropping the factor $\frac25$ that comes from averaging $3z^2 - r^2$ over the uniform spheroid.` },
    { id: 'mpl-r4-05', type: 'nat', level: 1, exams: ['jam'], sub: 'dipole moment',
      q: R`Charges of $+2.0$ nC and $-2.0$ nC are $3.0$ mm apart. Their dipole moment is ______ $\times10^{-12}$ C m.`,
      answer: 6, tol: 0.01, unit: '×10⁻¹² C m', calc: () => 2e-9 * 3e-3 * 1e12,
      sol: R`$p = qd = 2.0\times10^{-9}\times3.0\times10^{-3} = 6.0\times10^{-12}$ C m, pointing from the negative charge to the positive one.`,
      trap: R`Doubling the charge ($q$ is the size of one charge, not the sum).` },
    { id: 'mpl-r4-06', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'dipole in a field',
      q: R`A long straight wire carries $10$ nC/m. A small dipole of moment $1.0\times10^{-12}$ C m sits $2.0$ cm from the wire, pointing radially away from it. The force on the dipole is ______ $\mu$N (three decimal places).`,
      answer: 0.449, tol: 0.005, unit: 'μN', calc: () => 1e-12 * 1e-8 / (2 * Math.PI * C.eps0 * 0.02 ** 2) * 1e6,
      sol: R`$F = p\frac{dE}{ds}$ with $E = \frac{\lambda}{2\pi\varepsilon_0s}$, so $|F| = \frac{p\lambda}{2\pi\varepsilon_0s^2} = \frac{10^{-12}\times10^{-8}\times1.80\times10^{10}}{4.0\times10^{-4}} = 4.49\times10^{-7}$ N, directed towards the wire.`,
      trap: R`Using $pE$ (which is a torque scale, not a force); the force needs the field's gradient.` },
    { id: 'mpl-r4-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'leading term',
      q: R`Three charges $+q$ sit at the corners of an equilateral triangle in the $xy$ plane, centred on the origin, and $-3q$ sits at the origin. Far away, the potential falls off as`,
      options: [R`$1/r$`, R`$1/r^2$`, R`$1/r^3$`, R`$1/r^4$`], answer: 2,
      sol: R`Total charge: $3q - 3q = 0$. Dipole: $q\sum\vec r_i = 0$ because the triangle's corners average to its centre. Quadrupole: with corners at distance $a$, $Q_{zz} = q\sum(3z_i^2 - r_i^2) = -3qa^2\ne0$ (and $Q_{xx} = Q_{yy} = \frac32qa^2$). The leading term is the quadrupole, $\propto1/r^3$.`,
      trap: R`Assuming the high symmetry kills the quadrupole too; the charges all lie in one plane, unlike the $z$ direction.` },
    { id: 'mpl-r4-08', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'leading term',
      q: R`Eight charges sit at the corners of a cube centred on the origin, $\pm q$ alternating so that every edge joins opposite charges (the charge at $(x, y, z)$ has the sign of $xyz$). Far away, the potential falls off as`,
      options: [R`$1/r$`, R`$1/r^2$`, R`$1/r^3$`, R`$1/r^4$`], answer: 3,
      sol: R`Write the charge as $q\,\text{sgn}(x)\text{sgn}(y)\text{sgn}(z)$. Any moment $\sum q\,x^ay^bz^c$ vanishes unless each of $x$, $y$, $z$ appears to an odd power (otherwise the sum over that coordinate's sign is zero). The lowest such product is $xyz$, of third order: the monopole, dipole and quadrupole all vanish and the octupole does not. So $V\propto1/r^4$.`,
      trap: R`Stopping at the quadrupole ($1/r^3$) as for the square of alternating charges.` },
    { id: 'mpl-r4-09', type: 'mcq', level: 1, exams: ['jam'], sub: 'dipole in a field',
      q: R`An electric dipole is placed in a uniform electric field. It feels`,
      options: [R`a torque (unless it is lined up with the field) but no net force`, R`a net force but no torque`, R`both a net force and a torque`, R`neither a force nor a torque`], answer: 0,
      sol: R`The forces $q\vec E$ and $-q\vec E$ on the two ends cancel, so there is no net force. They act at different points, so they form a couple: torque $\vec\tau = \vec p\times\vec E$, zero only when $\vec p$ is parallel or antiparallel to $\vec E$.`,
      trap: R`Thinking a field must push something charged; equal and opposite charges feel equal and opposite forces.` },
    { id: 'mpl-r4-10', type: 'mcq', level: 2, exams: ['jam'], sub: 'dipole field',
      q: R`For an ideal dipole $p\hat z$ at the origin, the potential is zero on`,
      options: [R`the $z$ axis`, R`a sphere passing through the origin`, R`the $xy$ plane`, R`no surface at all`], answer: 2,
      sol: R`$V = \frac{p\cos\theta}{4\pi\varepsilon_0r^2}$, which vanishes where $\cos\theta = 0$, i.e. $\theta = 90^\circ$: the whole equatorial ($xy$) plane. Each point there is equally far from the two ends of a physical dipole.`,
      trap: R`Confusing zero potential with zero field: the field on the $xy$ plane is not zero (it points along $-\hat z$).` },
    { id: 'mpl-r4-11', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'physical dipole', format: 'statements',
      q: R`A physical dipole is $+q$ at $z = d/2$ and $-q$ at $z = -d/2$. Which statements are true?`,
      options: [R`About the midpoint its quadrupole moment is zero, so the first correction to the ideal dipole potential falls as $1/r^4$`, R`About the position of $+q$ as origin, it has a non-zero quadrupole moment`, R`The ideal dipole is the limit $d\to0$, $q\to\infty$ with $qd$ fixed`, R`At the midpoint the field points from $-q$ towards $+q$`],
      answer: [0, 1, 2],
      sol: R`About the midpoint the distribution is odd under $z\to-z$, so all even moments (monopole, quadrupole, ...) vanish and the next term after the dipole is the octupole, $1/r^4$. With the total charge zero the dipole moment does not depend on the origin, but the quadrupole does once $\vec p\ne0$: about $+q$, the charge $-q$ at $z = -d$ gives $Q_{zz} = -2qd^2$. At the midpoint both charges push and pull a test charge towards $-q$: the field points from $+q$ to $-q$, opposite to $\vec p$.`,
      trap: R`Thinking the field between the charges points along $\vec p$; outside on the axis it does, between them it does not.` },
    { id: 'mpl-r4-12', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'multipole expansion', format: 'statements',
      q: R`Which statements about multipole moments are true?`,
      options: [R`A spherically symmetric distribution has only a monopole term outside it`, R`For a distribution with axial symmetry about $z$ and mirror symmetry under $z\to-z$, all odd-$l$ moments about the centre vanish`, R`If the total charge $Q\ne0$, the origin can be chosen so that the dipole moment is zero`, R`A single point charge placed at the origin has a non-zero quadrupole moment`],
      answer: [0, 1, 2],
      sol: R`Spherical symmetry: by Gauss's law the outside field is that of a point charge, so every $l\ge1$ moment is zero. Mirror symmetry makes $\rho$ even in $\cos\theta$, while $P_l$ for odd $l$ is odd, so those integrals vanish. Moving the origin by $\vec a$ changes $\vec p$ to $\vec p - Q\vec a$; choosing $\vec a = \vec p/Q$ (the "centre of charge") makes it zero. A point charge at the origin has $r = 0$ for its charge, so all its higher moments vanish.`,
      trap: R`Thinking moments never depend on the origin; only the lowest non-zero one is origin-independent.` },
  ],
  gens: [
    { id: 'mpl-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'dipole moment',
      make(r) {
        const ring = r() < 0.5, Rcm = int(r, 2, 20), s0 = int(r, 1, 9);
        const Rm = Rcm / 100, p = ring ? Math.PI * Rm * Rm * s0 * 1e-9 : 4 / 3 * Math.PI * Rm ** 3 * s0 * 1e-6;
        const val = ring ? p * 1e12 : p * 1e9;
        return { q: ring
          ? `A thin ring of radius $${Rcm}$ cm in the $xy$ plane carries line charge $\\lambda = \\lambda_0\\sin\\phi$ with $\\lambda_0 = ${s0}$ nC/m. Its dipole moment is ______ $\\times10^{-12}$ C m (three significant figures).`
          : `A thin spherical shell of radius $${Rcm}$ cm carries $\\sigma = \\sigma_0\\cos\\theta$ with $\\sigma_0 = ${s0}\\ \\mu$C/m². Its dipole moment is ______ $\\times10^{-9}$ C m (three significant figures).`,
          answer: +val.toPrecision(3), tol: +(val * 0.005).toPrecision(2), unit: ring ? '×10⁻¹² C m' : '×10⁻⁹ C m', ring, Rcm, s0,
          sol: ring
            ? `Only $p_y$ survives: $p_y = \\int_0^{2\\pi}(R\\sin\\phi)(\\lambda_0\\sin\\phi)R\\,d\\phi = \\pi R^2\\lambda_0 = \\pi\\times${Rm}^2\\times${s0}\\times10^{-9} = ${+val.toPrecision(3)}\\times10^{-12}$ C m.`
            : `Only $p_z$ survives: $p_z = \\int(R\\cos\\theta)\\sigma_0\\cos\\theta\\,R^2\\sin\\theta\\,d\\theta\\,d\\phi = \\frac{4\\pi}{3}\\sigma_0R^3 = ${+val.toPrecision(3)}\\times10^{-9}$ C m.`,
          trap: 'Multiply the charge density by the position coordinate before integrating.' };
      },
      verify: (p) => { const Rm = p.Rcm / 100; return p.ring ? Math.PI * Rm * Rm * p.s0 * 1e-9 * 1e12 : 4 / 3 * Math.PI * Rm ** 3 * p.s0 * 1e-6 * 1e9; } },
    { id: 'mpl-r4g2', type: 'nat', level: 3, exams: ['jam'], sub: 'dipole in a field',
      make(r) {
        const [mol, D] = choose(r, [['water', 1.85], ['ammonia', 1.47], ['HCl', 1.08], ['methanol', 1.70]]), z = choose(r, [1, 2]), rnm = choose(r, [0.3, 0.4, 0.5, 0.6, 0.8]);
        const p = D * 3.33564e-30, U = p * k * z * C.e / (rnm * 1e-9) ** 2 / C.e;
        return { q: `A ${mol} molecule (dipole moment $${D}$ D, $1$ D $= 3.336\\times10^{-30}$ C m) points straight away from an ion of charge $+${z === 1 ? '' : z}e$ that is $${rnm}$ nm away. The size of their interaction energy is ______ eV (three significant figures).`,
          answer: +U.toPrecision(3), tol: +(U * 0.006).toPrecision(2), unit: 'eV', D, z, rnm,
          sol: `$E = \\frac{k\\,${z === 1 ? '' : z}e}{r^2} = ${+(k * z * C.e / (rnm * 1e-9) ** 2).toPrecision(3)}$ V/m; $p = ${+p.toPrecision(3)}$ C m; $|U| = pE = ${+(U * C.e).toPrecision(3)}$ J $= ${+U.toPrecision(3)}$ eV.`,
          trap: 'Charge-dipole energy falls as $1/r^2$, not $1/r$.' };
      },
      verify: (p) => p.D * 3.33564e-30 * k * p.z * C.e / (p.rnm * 1e-9) ** 2 / C.e },
    { id: 'mpl-r4g3', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'leading term',
      make(r) {
        const cases = [
          ['$+q$ at $(a, 0, 0)$ only', 1, 'The total charge is $q\\ne0$, so the monopole term leads.'],
          ['$+q$ at $(a, 0, 0)$ and $-q$ at $(-a, 0, 0)$', 2, 'Zero net charge, dipole $2qa\\hat x\\ne0$.'],
          ['$+q$ at $z = \\pm a$ and $-2q$ at the origin', 3, 'Net charge and dipole vanish; $Q_{zz} = 4qa^2\\ne0$.'],
          ['$+q$ at $(a, 0, 0)$ and $(-a, 0, 0)$, $-q$ at $(0, a, 0)$ and $(0, -a, 0)$', 3, 'Net charge and dipole vanish; $Q_{xx} - Q_{yy}\\ne0$.'],
          ['$+q$ at $(a, 0, 0)$ and $(0, a, 0)$, $-q$ at $(-a, 0, 0)$ and $(0, -a, 0)$', 2, 'Zero net charge, but $\\vec p = 2qa(\\hat x + \\hat y)\\ne0$.'],
          ['$\\pm q$ alternating on the eight corners of a cube centred at the origin (sign of $xyz$)', 4, 'Every moment below third order vanishes by the sign pattern; the octupole $\\sum q\\,xyz$ does not.'],
          ['$+2q$ at the origin and $-q$ at $(0, 0, \\pm a)$', 3, 'Net charge and dipole vanish; $Q_{zz} = -4qa^2\\ne0$.'],
        ];
        const [desc, n, why] = choose(r, cases);
        const show = (m) => (m === 1 ? '$1/r$' : `$1/r^{${m}}$`);
        const o = mcqOptions(r, n, [1, 2, 3, 4].filter((m) => m !== n), show);
        return { q: `Charges: ${desc}. Far away, the potential falls off as`, ...o,
          sol: `${why} A leading $l$-pole term gives $V\\propto1/r^{l+1}$, so the potential goes as ${show(n)}.`,
          trap: 'Check the moments in order (charge, dipole, quadrupole, ...) and stop at the first non-zero one.' };
      } },
  ],
};
