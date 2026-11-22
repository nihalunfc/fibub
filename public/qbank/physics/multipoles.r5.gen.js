// Round 5 extras for multipoles: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;
const k = 8.9875517923e9;

export default {
  items: [
    { id: 'mpl-r5-01', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'dipole moment',
      q: R`Charges $+2.0$ nC at $z = +2.0$ mm, $-1.0$ nC at $z = -2.0$ mm and $-1.0$ nC at the origin lie on the $z$-axis. The magnitude of their dipole moment is ______ pC m.`,
      answer: 6, tol: 0.01, unit: 'pC m', calc: () => (2 * 2 + -1 * -2 + 0) * 1e-9 * 1e-3 * 1e12,
      sol: R`The net charge is zero, so $\vec p = \sum q_i\vec r_i$ does not depend on the origin. $p_z = (+2.0)(+2.0) + (-1.0)(-2.0) + (-1.0)(0) = 4.0 + 2.0 = 6.0$ nC mm $= 6.0\times10^{-12}$ C m $= 6.0$ pC m.`,
      trap: R`Treating each pair separately and forgetting that a negative charge at negative $z$ adds to $p_z$.` },
    { id: 'mpl-r5-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'dipole field',
      q: R`An ideal dipole $\vec p$ is at the origin. Compare the field at distance $r$ on its axis with the field at the same distance on its perpendicular bisector (equator).`,
      options: [R`Equal in size, both along $\vec p$`, R`The equatorial field is twice as strong, along $\vec p$`, R`The axial field is twice as strong; both point along $\vec p$`, R`The axial field is twice as strong and points along $\vec p$; the equatorial field points opposite to $\vec p$`], answer: 3,
      sol: R`$\vec E = \frac{1}{4\pi\varepsilon_0r^3}[3(\vec p\cdot\hat r)\hat r - \vec p]$. On the axis $\hat r\parallel\vec p$: $\vec E = \frac{2\vec p}{4\pi\varepsilon_0r^3}$. On the equator $\vec p\cdot\hat r = 0$: $\vec E = -\frac{\vec p}{4\pi\varepsilon_0r^3}$, half as strong and reversed.`,
      trap: R`Forgetting the reversal on the equator.` },
    { id: 'mpl-r5-03', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'origin dependence', format: 'statements',
      q: R`Which statements about how multipole moments depend on the choice of origin are true?`,
      options: [R`If the total charge is zero, the dipole moment is the same about every origin`, R`If the total charge is not zero, some origin makes the dipole moment zero`, R`The quadrupole moment is the same about every origin, for any distribution`, R`The monopole moment (total charge) is the same about every origin`],
      answer: [0, 1, 3],
      sol: R`Shifting the origin by $\vec d$ changes $\vec p$ to $\vec p - Q\vec d$. With $Q = 0$ nothing changes; with $Q\ne0$, choosing $\vec d = \vec p/Q$ (the centre of charge) makes $\vec p = 0$. In general the lowest non-vanishing moment is origin-independent, while higher ones shift; a quadrupole moment changes under a shift when $Q$ or $\vec p$ is non-zero.`,
      trap: R`Thinking all moments are properties of the charges alone; only the lowest non-zero one is.` },
    { id: 'mpl-r5-04', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'quadrupole',
      q: R`Charges $+1.0$ nC sit at $z = \pm1.0$ cm and $-2.0$ nC at the origin. The exact potential on the axis at $z = 50$ cm is ______ mV (one decimal place; $\frac{1}{4\pi\varepsilon_0} = 9.0\times10^9$ N m² C⁻²).`,
      answer: 14.4, tol: 0.05, unit: 'mV', calc: () => 9e9 * 1e-9 * (1 / 0.49 + 1 / 0.51 - 2 / 0.5) * 1e3,
      sol: R`Exactly: $V = \frac{q}{4\pi\varepsilon_0}\left(\frac1{z - a} + \frac1{z + a} - \frac2z\right) = \frac{q}{4\pi\varepsilon_0}\frac{2a^2}{z(z^2 - a^2)}$. Numbers: $9\times10^9\times10^{-9}\times\frac{2\times10^{-4}}{0.5\times0.2499} = 1.44\times10^{-2}$ V. The quadrupole formula $\frac{2qa^2}{4\pi\varepsilon_0z^3}$ gives the same to three figures.`,
      trap: R`Expecting a dipole term; this arrangement has zero charge and zero dipole moment.` },
    { id: 'mpl-r5-05', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'dipole interactions',
      q: R`Two identical ideal dipoles of moment $p$ are a distance $r$ apart. Which arrangement has the lowest interaction energy?`,
      options: [R`In line, head to tail: $U = -\dfrac{2p^2}{4\pi\varepsilon_0r^3}$`, R`Side by side, parallel: $U = -\dfrac{p^2}{4\pi\varepsilon_0r^3}$`, R`Side by side, antiparallel: $U = -\dfrac{2p^2}{4\pi\varepsilon_0r^3}$`, R`In line, head to head: $U = -\dfrac{p^2}{4\pi\varepsilon_0r^3}$`], answer: 0,
      sol: R`$U = \frac{1}{4\pi\varepsilon_0r^3}[\vec p_1\cdot\vec p_2 - 3(\vec p_1\cdot\hat r)(\vec p_2\cdot\hat r)]$. Head to tail: $p^2 - 3p^2 = -2p^2$. Side by side parallel: $+p^2$ (unfavourable), antiparallel: $-p^2$. Head to head: $-p^2 + 3p^2 = +2p^2$. So head to tail is lowest, at $-2p^2/(4\pi\varepsilon_0r^3)$; the other options carry wrong values.`,
      trap: R`Guessing that parallel side-by-side dipoles attract like parallel currents; they repel.` },
    { id: 'mpl-r5-06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'dipole moment',
      q: R`A ring of radius $10$ cm in the $xy$ plane carries line charge $\lambda = \lambda_0\cos\phi$ with $\lambda_0 = 2.0$ nC/m. The magnitude of its dipole moment is ______ pC m (one decimal place).`,
      answer: 62.8, tol: 0.2, unit: 'pC m', calc: () => Math.PI * 2e-9 * 0.1 ** 2 * 1e12,
      sol: R`$\vec p = \int\lambda\,\vec r\,dl = \int_0^{2\pi}\lambda_0\cos\phi\,(R\cos\phi\,\hat x + R\sin\phi\,\hat y)R\,d\phi = \pi\lambda_0R^2\,\hat x$. Numbers: $\pi\times2.0\times10^{-9}\times0.01 = 6.28\times10^{-11}$ C m. The net charge $\int\lambda_0\cos\phi\,R\,d\phi$ is zero, so this is origin-independent.`,
      trap: R`Dropping one factor of $R$ (one from $\vec r$, one from $dl$).` },
    { id: 'mpl-r5-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'leading term',
      q: R`A ring in the $xy$ plane carries line charge $\lambda = \lambda_0\sin2\phi$. Far away, its potential falls off as`,
      options: [R`$1/r^2$`, R`$1/r^3$`, R`$1/r$`, R`$1/r^4$`], answer: 1,
      sol: R`Total charge: $\int\sin2\phi\,d\phi = 0$. Dipole: $\int\sin2\phi\cos\phi\,d\phi = 0$ and $\int\sin2\phi\sin\phi\,d\phi = 0$. Quadrupole: $Q_{xy}\propto\int\sin2\phi\,\cos\phi\sin\phi\,d\phi = \frac12\int\sin^22\phi\,d\phi = \frac\pi2\ne0$. The leading term is the quadrupole, $\propto1/r^3$.`,
      trap: R`Assuming any non-uniform ring has a dipole moment; $\sin2\phi$ has the symmetry of a quadrupole.` },
    { id: 'mpl-r5-08', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'average field',
      q: R`All the charges of a neutral molecule, with dipole moment $1.0\times10^{-12}$ C m, lie inside a sphere of radius $1.0$ cm. The average of the molecule's electric field over the volume of that sphere has magnitude ______ V/m ($\frac{1}{4\pi\varepsilon_0} = 9.0\times10^9$ N m² C⁻²).`,
      answer: 9000, tol: 20, unit: 'V/m', calc: () => 9e9 * 1e-12 / 0.01 ** 3,
      sol: R`For charges inside a sphere, the field averaged over the sphere is $\vec E_{\rm avg} = -\frac{\vec p}{4\pi\varepsilon_0R^3}$ (whatever the details of the distribution). Magnitude: $\frac{9\times10^9\times10^{-12}}{10^{-6}} = 9.0\times10^3$ V/m, pointing opposite to $\vec p$.`,
      trap: R`Expecting the average to be zero by symmetry; inside the sphere the field mostly opposes $\vec p$.` },
    { id: 'mpl-r5-09', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'dipole field',
      q: R`For an ideal dipole along $\hat z$, at what angle $\theta$ from the $z$-axis is the field perpendicular to the axis (no $z$-component)?`,
      options: [R`$35.3^\circ$`, R`$45^\circ$`, R`$54.7^\circ$`, R`$90^\circ$`], answer: 2,
      sol: R`$E_r\propto2\cos\theta$ and $E_\theta\propto\sin\theta$. Then $E_z = E_r\cos\theta - E_\theta\sin\theta\propto2\cos^2\theta - \sin^2\theta = 3\cos^2\theta - 1$. This vanishes at $\cos\theta = 1/\sqrt3$, $\theta = 54.7^\circ$. On the equator ($90^\circ$) the field is along $-\hat z$, not perpendicular.`,
      trap: R`Picking $90^\circ$; on the equator the field is antiparallel to the axis.` },
    { id: 'mpl-r5-10', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'quadrupole', format: 'statements',
      q: R`The traceless quadrupole tensor is $Q_{ij} = \sum q(3x_ix_j - r^2\delta_{ij})$. Which statements are true?`,
      options: [R`$Q_{xx} + Q_{yy} + Q_{zz} = 0$`, R`For a distribution symmetric about the $z$-axis, $Q_{xx} = Q_{yy} = -\tfrac12Q_{zz}$`, R`A uniformly charged sphere has zero quadrupole moment about its centre`, R`A positive charge stretched along $z$ (cigar shaped) has $Q_{zz} < 0$`],
      answer: [0, 1, 2],
      sol: R`The trace is $\sum q(3r^2 - 3r^2) = 0$. Axial symmetry makes $Q_{xx} = Q_{yy}$, and the zero trace then fixes each as $-Q_{zz}/2$. A sphere has $\langle x^2\rangle = \langle y^2\rangle = \langle z^2\rangle$, so every component vanishes. Stretching along $z$ makes $3z^2 > r^2$ on average, so $Q_{zz} > 0$ (prolate); an oblate (squashed) body gives $Q_{zz} < 0$.`,
      trap: R`Getting the sign for prolate and oblate shapes backwards.` },
  ],
  gens: [
    { id: 'mpl-r5g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'dipole moment',
      make(r) {
        const q1 = choose(r, [1, 2, 3, 4]), q2 = choose(r, [1, 2, 3]), q3 = -(q1 + q2);
        const z1 = int(r, 1, 5), z2 = -int(r, 1, 5), z3 = choose(r, [0, 6, 7, -6, -7]), p = q1 * z1 + q2 * z2 + q3 * z3;
        return { q: `Charges $${q1}$ nC at $z = ${z1}$ mm, $${q2}$ nC at $z = ${z2}$ mm and $${q3}$ nC at $z = ${z3}$ mm lie on the $z$-axis. Their dipole moment $p_z$ is ______ pC m (with sign).`,
          answer: p, tol: 0, unit: 'pC m', q1, q2, q3, z1, z2, z3,
          sol: `The net charge is zero, so $p_z = \\sum q_iz_i$ does not depend on the origin: $(${q1})(${z1}) + (${q2})(${z2}) + (${q3})(${z3}) = ${p}$ nC mm $= ${p}$ pC m.`,
          trap: '1 nC mm = $10^{-12}$ C m = 1 pC m; keep every sign.' };
      },
      verify: (p) => p.q1 * p.z1 + p.q2 * p.z2 + p.q3 * p.z3 },
    { id: 'mpl-r5g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'dipole moment',
      make(r) {
        const Rc = int(r, 2, 20), l0 = choose(r, [0.5, 2, 3, 5]), sinv = r() < 0.5, p = Math.PI * l0 * (Rc / 100) ** 2 * 1e3;
        return { q: `A ring of radius $${Rc}$ cm in the $xy$ plane carries $\\lambda = ${l0}\\${sinv ? 'sin' : 'cos'}\\phi$ nC/m. The magnitude of its dipole moment is ______ pC m (two decimal places).`,
          answer: round(p, 2), tol: Math.max(0.01, round(p * 0.002, 2)), unit: 'pC m', Rc, l0,
          sol: `$\\vec p = \\int\\lambda\\vec r\\,dl = \\pi\\lambda_0R^2\\,\\hat ${sinv ? 'y' : 'x'} = \\pi\\times${l0}\\times10^{-9}\\times${round((Rc / 100) ** 2, 6)} = ${round(p, 2)}$ pC m.`,
          trap: 'One factor of $R$ comes from the position, one from $dl$.' };
      },
      verify: (p) => Math.PI * p.l0 * (p.Rc / 100) ** 2 * 1e3 },
    { id: 'mpl-r5g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'dipole interactions',
      make(r) {
        const [desc, f] = choose(r, [['in line, head to tail', -2], ['in line, head to head', 2], ['side by side, parallel', 1], ['side by side, antiparallel', -1]]);
        const p1 = int(r, 2, 8), p2 = int(r, 2, 8), rn = choose(r, [0.3, 0.4, 0.5, 0.8, 1]);
        const U = k * p1 * 1e-30 * p2 * 1e-30 * f / (rn * 1e-9) ** 3 / 1.602176634e-22;
        return { q: `Two point dipoles of moments $${p1}\\times10^{-30}$ C m and $${p2}\\times10^{-30}$ C m are $${rn}$ nm apart, ${desc}. Their interaction energy is ______ meV (two decimal places, with sign).`,
          answer: round(U, 2), tol: Math.max(0.01, round(Math.abs(U) * 0.003, 2)), unit: 'meV', p1, p2, rn, f,
          sol: `$U = \\frac{1}{4\\pi\\varepsilon_0r^3}[\\vec p_1\\cdot\\vec p_2 - 3(\\vec p_1\\cdot\\hat r)(\\vec p_2\\cdot\\hat r)] = ${f}\\frac{p_1p_2}{4\\pi\\varepsilon_0r^3}$ here. $= ${f}\\times\\frac{8.988\\times10^9\\times${p1 * p2}\\times10^{-60}}{(${rn}\\times10^{-9})^3} = ${round(U, 2)}$ meV.`,
          trap: 'The angular factor is $-2$ head to tail, $+2$ head to head, $+1$ side by side parallel.' };
      },
      verify: (p) => k * p.p1 * 1e-30 * p.p2 * 1e-30 * p.f / (p.rn * 1e-9) ** 3 / 1.602176634e-22 },
  ],
};
