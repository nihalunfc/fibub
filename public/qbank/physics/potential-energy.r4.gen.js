// Round 4 extras for potential-energy (electrostatic potential and energy): original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const K = 9e9; // 1/(4 pi eps0), stated as 9.0e9 N m^2/C^2 in every question that needs it
const eps0 = 8.85e-12;

export default {
  items: [
    { id: 'pot-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'work and energy',
      q: R`A proton starts from rest and is accelerated through a potential difference of 2 kV. Its kinetic energy is`,
      options: ['2 eV', '2 keV', R`$3.2\times10^{-16}$ eV`, '1 keV'], answer: 1,
      sol: R`A charge $q$ falling through a potential difference $\Delta V$ gains $q\Delta V$. For charge $e$ and 2000 V this is 2000 eV $= 2$ keV ($= 3.2\times10^{-16}$ J). The electron-volt is defined exactly for this: the energy of charge $e$ through 1 V.`,
      trap: R`$3.2\times10^{-16}$ is the energy in joules, not in eV.` },
    { id: 'pot-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'equipotentials',
      q: R`A map shows equipotential lines drawn at equal steps of potential. In region P the lines are packed closest together. At P,`,
      options: ['the potential is highest', 'the electric field is weakest', 'the potential must be zero', 'the electric field is strongest'], answer: 3,
      sol: R`The field strength is the rate of change of potential with distance, $|E| = |\Delta V|/\Delta s$ across the lines. Equal steps of $V$ over the shortest distance means the steepest slope, so the strongest field. Closely packed lines say nothing about the value of $V$ itself, just as closely packed contour lines on a map mean a steep slope, not a high summit.`,
      trap: R`Crowded equipotentials mark where $V$ changes fastest, not where it is largest.` },
    { id: 'pot-r4-03', type: 'nat', level: 2, exams: ['jam'], sub: 'continuous distributions',
      q: R`A charge of 4.0 nC is spread uniformly along a thin plastic arc of radius 10 cm that covers a quarter circle. The potential at the centre of the circle (zero at infinity) is ______ V ($1/4\pi\epsilon_0 = 9.0\times10^9$ N m²/C²).`,
      answer: 360, tol: 1, unit: 'V', calc: () => (9e9 * 4e-9) / 0.1,
      sol: R`Potential is a scalar sum: every bit of charge $dq$ is the same distance $R$ from the centre, so $V = \int\dfrac{dq}{4\pi\epsilon_0R} = \dfrac{Q}{4\pi\epsilon_0R} = \dfrac{9\times10^9\times4\times10^{-9}}{0.1} = 360$ V. The shape of the arc (quarter, half, full ring) does not matter; it would matter for the field, a vector.`,
      trap: R`Multiplying by the arc fraction (to get 90 V) treats the given charge as if it were for a full ring.` },
    { id: 'pot-r4-04', type: 'mcq', level: 3, exams: ['jam'], sub: 'field from potential', format: 'graph',
      q: R`An infinite flat sheet in the plane $z = 0$ carries a uniform positive surface charge $\sigma$. Taking $V = 0$ on the sheet, the graph of $V$ against $z$ is`,
      options: [R`an upside-down V: $V = -\sigma|z|/(2\epsilon_0)$, falling linearly on both sides`, R`a V: $V = +\sigma|z|/(2\epsilon_0)$, rising on both sides`, 'a horizontal line (constant)', R`a curve falling as $1/|z|$ on both sides`], answer: 0,
      sol: R`The field is uniform, $\sigma/(2\epsilon_0)$, pointing away from the sheet on both sides. Moving along the field lowers the potential, so $V$ falls linearly with $|z|$ on both sides: $V = -\dfrac{\sigma|z|}{2\epsilon_0}$. The kink at $z = 0$ (slope jumping by $\sigma/\epsilon_0$) is the sheet's charge. Because $V$ grows without limit, it cannot be set to zero at infinity.`,
      trap: R`Positive charge means a potential peak, so the graph points up at the sheet, not down.` },
    { id: 'pot-r4-05', type: 'nat', level: 3, exams: ['jam'], sub: 'field energy',
      q: R`A parallel-plate capacitor with plates of area 200 cm², 0.50 mm apart in air, is charged to 500 V. Using the energy density of the field, the energy stored between the plates is ______ μJ ($\epsilon_0 = 8.85\times10^{-12}$ F/m, one decimal place).`,
      answer: 44.3, tol: 0.2, unit: 'μJ', calc: () => 0.5 * 8.85e-12 * (500 / 5e-4) ** 2 * 0.02 * 5e-4 * 1e6,
      sol: R`$E = V/d = 500/5\times10^{-4} = 10^6$ V/m. $u = \tfrac12\epsilon_0E^2 = \tfrac12\times8.85\times10^{-12}\times10^{12} = 4.43$ J/m³. Volume $= 0.02\times5\times10^{-4} = 10^{-5}$ m³, so $U = 4.43\times10^{-5}$ J $= 44.3$ μJ. Check: $C = \epsilon_0A/d = 354$ pF and $\tfrac12CV^2 = 44.3$ μJ.`,
      trap: R`The area is 200 cm² $= 0.02$ m², not 0.2 m².` },
    { id: 'pot-r4-06', type: 'msq', level: 3, exams: ['jam'], sub: 'dipole', format: 'statements',
      q: R`For a small electric dipole $\vec p$ (two charges $\pm q$ a short distance apart), which statements are correct?`,
      options: [R`Far away, its potential falls as $1/r^2$`, 'The potential is zero everywhere on the plane that bisects the dipole at right angles', 'The electric field is zero everywhere on that bisecting plane', R`On its axis, at distance $r$, the potential is $\dfrac{2p}{4\pi\epsilon_0r^2}$`], answer: [0, 1],
      sol: R`$V = \dfrac{p\cos\theta}{4\pi\epsilon_0r^2}$: it falls as $1/r^2$ and vanishes at $\theta = 90^\circ$, the bisecting plane (every point there is equidistant from $+q$ and $-q$). On that plane the field is not zero: it points parallel to $-\vec p$, with size $\dfrac{p}{4\pi\epsilon_0r^3}$. On the axis ($\theta = 0$) the potential is $\dfrac{p}{4\pi\epsilon_0r^2}$; the factor 2 belongs to the axial field, $\dfrac{2p}{4\pi\epsilon_0r^3}$.`,
      trap: R`Zero potential does not mean zero field: the field is the slope of $V$, and $V$ changes as you leave the plane.` },
    { id: 'pot-r4-07', type: 'mcq', level: 3, exams: ['jam'], sub: 'energy of charge systems',
      q: R`Two identical small metal spheres are far apart; one carries charge $Q$ and the other is neutral. They are joined by a long thin wire, which is then removed. The total electrostatic energy of the system`,
      options: ['is unchanged, since charge is conserved', 'doubles', 'halves', 'falls to a quarter'], answer: 2,
      sol: R`An isolated sphere of radius $R$ with charge $q$ stores $\dfrac{q^2}{8\pi\epsilon_0R}$. Before: $\dfrac{Q^2}{8\pi\epsilon_0R}$. After, each holds $Q/2$: $2\times\dfrac{(Q/2)^2}{8\pi\epsilon_0R} = \dfrac{Q^2}{16\pi\epsilon_0R}$, half as much. The other half is lost as heat in the wire (and a little radiation) while the charge flows, however thin the wire.`,
      trap: R`Charge is conserved, energy here is not: sharing charge always wastes energy.` },
    { id: 'pot-r4-08', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'poisson and laplace', format: 'statements',
      q: R`In a region of space with no charge, the potential obeys Laplace's equation $\nabla^2V = 0$. Which statements are correct?`,
      options: ['$V$ has no local maximum or minimum inside the region', 'The value of $V$ at any point equals its average over any sphere centred there and lying inside the region', '$V$ inside a closed region is fixed uniquely by its values on the boundary', 'Wherever $V = 0$, the electric field is also zero'], answer: [0, 1, 2],
      sol: R`Solutions of Laplace's equation are "as smooth as possible": the mean-value property holds, so a point cannot be higher (or lower) than all its neighbours, and extremes occur only on the boundary. That is also why a charge cannot be held in stable equilibrium by electrostatic fields alone (Earnshaw). The uniqueness theorem fixes $V$ from the boundary values. $V = 0$ at a point says nothing about its slope, so $\vec E = -\nabla V$ need not vanish there.`,
      trap: R`The value of $V$ depends on where you put the zero; the field depends only on how $V$ changes.` },
    { id: 'pot-r4-09', type: 'nat', level: 4, exams: ['jam'], sub: 'continuous distributions',
      q: R`A thin straight rod 20 cm long carries 4.0 nC spread uniformly. The potential at a point 10 cm from its midpoint, on the line through the midpoint perpendicular to the rod, is ______ V ($1/4\pi\epsilon_0 = 9.0\times10^9$ N m²/C², to the nearest volt).`,
      answer: 317, tol: 1, unit: 'V', calc: () => 9e9 * (4e-9 / 0.2) * 2 * Math.log((0.1 + Math.hypot(0.1, 0.1)) / 0.1),
      sol: R`With $\lambda = 4\times10^{-9}/0.2 = 2\times10^{-8}$ C/m and the rod from $-a$ to $a$ ($a = 0.1$ m) at distance $d = 0.1$ m: $V = \dfrac{\lambda}{4\pi\epsilon_0}\int_{-a}^{a}\dfrac{dx}{\sqrt{x^2 + d^2}} = \dfrac{\lambda}{4\pi\epsilon_0}\,2\ln\dfrac{a + \sqrt{a^2 + d^2}}{d} = 180\times2\ln(1 + \sqrt2) = 180\times1.763 = 317$ V.`,
      trap: R`Treating the rod as a point charge at its midpoint gives 360 V, too high: most of the rod is farther than 10 cm away.` },
    { id: 'pot-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'work and energy',
      q: R`A fixed thin ring of radius 10 cm carries $+50$ nC. A 1.0 g bead with charge $+2.0$ nC can slide without friction along a straight horizontal wire lying along the ring's axis. It is released from rest on the axis 10 cm from the ring's centre and is pushed away. Its speed far from the ring is ______ cm/s ($1/4\pi\epsilon_0 = 9.0\times10^9$ N m²/C², one decimal place).`,
      answer: 11.3, tol: 0.1, unit: 'cm/s', calc: () => 100 * Math.sqrt((2 * 2e-9 * 9e9 * 50e-9) / Math.hypot(0.1, 0.1) / 1e-3),
      sol: R`On the axis, $V(x) = \dfrac{Q}{4\pi\epsilon_0\sqrt{R^2 + x^2}}$. At $x = R = 0.1$ m: $V = \dfrac{9\times10^9\times5\times10^{-8}}{0.1414} = 3182$ V. Far away $V = 0$, so the bead gains $qV = 2\times10^{-9}\times3182 = 6.36\times10^{-6}$ J. $v = \sqrt{2\times6.36\times10^{-6}/10^{-3}} = 0.113$ m/s $= 11.3$ cm/s. (The centre is a point of equilibrium, but unstable along the axis, which is why the bead is pushed out.)`,
      trap: R`Using $kQ/x$ (a point charge at the centre) instead of the ring's distance $\sqrt{R^2 + x^2}$ overestimates the potential.` },
  ],
  gens: [
    { id: 'pot-r4g1', type: 'nat', level: 2, exams: ['jam'], sub: 'continuous distributions',
      make(r) {
        const Q = pick(r, 1, 20, 1), Rc = pick(r, 2, 30, 1), [frac, word] = choose(r, [[0.25, 'a quarter circle'], [0.5, 'a semicircle'], [1 / 3, 'one third of a circle'], [1 / 6, 'a 60° arc']]);
        const answer = round((K * Q * 1e-9) / (Rc / 100), 1);
        return { q: R`A charge of ${Q} nC is spread uniformly along a thin arc of radius ${Rc} cm that covers ${word}. Find the potential (V) at the centre of the circle, zero at infinity ($1/4\pi\epsilon_0 = 9.0\times10^9$ N m²/C²).`,
          answer, tol: Math.max(0.5, answer * 0.005), unit: 'V', Q, Rc, frac,
          sol: R`All the charge is the same distance from the centre, and potential adds as a scalar: $V = \dfrac{Q}{4\pi\epsilon_0R} = \dfrac{9\times10^9\times${Q}\times10^{-9}}{${round(Rc / 100, 3)}} = ${answer}$ V, whatever fraction of the circle the arc covers.`,
          trap: 'The arc length does not enter the potential at the centre; it would enter the field.' };
      },
      verify: (p) => (K * p.Q * 1e-9) / (p.Rc / 100) },
    { id: 'pot-r4g2', type: 'nat', level: 4, exams: ['jam'], sub: 'continuous distributions',
      make(r) {
        const Q = pick(r, 1, 10, 0.5), L = pick(r, 10, 60, 5), d = pick(r, 2, 30, 1);
        const a = L / 200, dd = d / 100, lam = (Q * 1e-9) / (L / 100), answer = round(K * lam * 2 * Math.log((a + Math.hypot(a, dd)) / dd), 1);
        return { q: R`A thin straight rod ${L} cm long carries ${Q} nC spread uniformly. Find the potential (V) at a point ${d} cm from its midpoint, on the perpendicular bisector of the rod ($1/4\pi\epsilon_0 = 9.0\times10^9$ N m²/C²).`,
          answer, tol: Math.max(0.5, answer * 0.005), unit: 'V', Q, L, d,
          sol: R`$\lambda = ${round(lam * 1e9, 4)}$ nC/m, half-length $a = ${a}$ m, $d = ${dd}$ m. $V = \dfrac{\lambda}{4\pi\epsilon_0}\,2\ln\dfrac{a + \sqrt{a^2 + d^2}}{d} = ${answer}$ V.`,
          trap: 'A point charge at the midpoint overestimates V; the rod is spread out.' };
      },
      verify: (p) => { const a = p.L / 200, dd = p.d / 100; return K * ((p.Q * 1e-9) / (p.L / 100)) * 2 * Math.log((a + Math.hypot(a, dd)) / dd); } },
    { id: 'pot-r4g3', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'work and energy',
      make(r) {
        const Q = pick(r, 10, 100, 10), Rr = pick(r, 5, 20, 1), xf = choose(r, [0.5, 0.75, 1, 1.5, 2]), qc = pick(r, 0.5, 5, 0.5), m = pick(r, 0.5, 5, 0.5);
        const x = Rr * xf, V = (K * Q * 1e-9) / (Math.hypot(Rr, x) / 100), answer = round(100 * Math.sqrt((2 * qc * 1e-9 * V) / (m * 1e-3)), 2);
        return { q: R`A fixed thin ring of radius ${Rr} cm carries $+${Q}$ nC. A bead of mass ${m} g and charge $+${qc}$ nC slides without friction along a straight horizontal wire on the ring's axis. Released from rest on the axis ${round(x, 2)} cm from the ring's centre, it is pushed away. Find its speed (cm/s) far from the ring ($1/4\pi\epsilon_0 = 9.0\times10^9$ N m²/C²).`,
          answer, tol: Math.max(0.02, answer * 0.005), unit: 'cm/s', Q, Rr, x, qc, m,
          sol: R`$V = \dfrac{Q}{4\pi\epsilon_0\sqrt{R^2 + x^2}} = ${round(V, 1)}$ V at the start, 0 far away. $\tfrac12mv^2 = qV$ gives $v = ${answer}$ cm/s.`,
          trap: 'Every bit of the ring is $\\sqrt{R^2 + x^2}$ from the bead, not $x$.' };
      },
      verify: (p) => { const V = (K * p.Q * 1e-9) / (Math.hypot(p.Rr, p.x) / 100); return 100 * Math.sqrt((2 * p.qc * 1e-9 * V) / (p.m * 1e-3)); } },
  ],
};
