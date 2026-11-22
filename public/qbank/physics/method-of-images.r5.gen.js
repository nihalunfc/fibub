// Round 5 extras for method-of-images: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;
const k = 8.9875517923e9;

export default {
  items: [
    { id: 'gim-r5-01', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'corner',
      q: R`Two large earthed metal planes meet at a right angle. A charge $q$ sits at distance $a$ from each plane. The force on it is $F = \beta\dfrac{q^2}{4\pi\varepsilon_0a^2}$, where $\beta$ is ______ (three decimal places).`,
      answer: 0.229, tol: 0.002, calc: () => (2 * Math.SQRT2 - 1) / 8,
      sol: R`Place the charge at $(a, a)$. Images: $-q$ at $(-a, a)$, $-q$ at $(a, -a)$ and $+q$ at $(-a, -a)$. The two $-q$ images, at distance $2a$, each pull with $\frac{q^2}{4\pi\varepsilon_0(4a^2)}$ along $-\hat x$ and $-\hat y$. The $+q$ image, at $2\sqrt2a$, pushes with $\frac{q^2}{4\pi\varepsilon_0(8a^2)}$ along $(\hat x + \hat y)/\sqrt2$. Each component: $-\frac14 + \frac{1}{8\sqrt2} = -0.1616$. Magnitude: $\sqrt2\times0.1616 = \frac{2\sqrt2 - 1}{8} = 0.229$, directed into the corner.`,
      trap: R`Leaving out the third image (at the far corner), which is needed to make both planes equipotential.` },
    { id: 'gim-r5-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'corner',
      q: R`Two earthed conducting half-planes meet along a line at an angle of $60^\circ$. A point charge sits between them. The number of image charges needed is`,
      options: [R`$3$`, R`$5$`, R`$6$`, R`infinitely many`], answer: 1,
      sol: R`For a wedge of angle $\pi/n$ with integer $n$, the images (charge and its reflections) fill $2n$ positions around the edge, one of which is the real charge: $2n - 1$ images. Here $n = 3$, so $5$ images (alternating in sign).`,
      trap: R`Counting the real charge as an image (6).` },
    { id: 'gim-r5-03', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'sphere',
      q: R`A point charge $q$ is at distance $d$ from the centre of a metal sphere of radius $R < d$. Which statements are true?`,
      options: [R`If the sphere is earthed, the image charge has magnitude smaller than $|q|$`, R`If the sphere is earthed, the total charge induced on it equals the image charge`, R`If the sphere is earthed, the force on $q$ is attractive whatever its sign`, R`If the sphere is isolated and uncharged, the image $-qR/d$ at $R^2/d$ alone describes the field outside`],
      answer: [0, 1, 2],
      sol: R`For the earthed sphere the image is $q' = -qR/d$ (smaller than $q$) at $R^2/d$ from the centre; by Gauss's law the induced charge equals $q'$, and the force (towards the opposite-sign image) is attractive. An isolated neutral sphere must have zero net charge and need not be at zero potential, so a second image $+qR/d$ at the centre is needed.`,
      trap: R`Forgetting the extra central image for an isolated (not earthed) sphere.` },
    { id: 'gim-r5-04', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'sphere',
      q: R`A charge of $1.0\ \mu$C is $20$ cm from the centre of an isolated, uncharged metal sphere of radius $10$ cm. The magnitude of the force on the charge is ______ N (four decimal places; $\frac{1}{4\pi\varepsilon_0} = 9.0\times10^9$ N m² C⁻²).`,
      answer: 0.0875, tol: 0.0005, unit: 'N', calc: () => 9e9 * 1e-6 * (0.5e-6 / 0.15 ** 2 - 0.5e-6 / 0.2 ** 2),
      sol: R`Images: $q' = -qR/d = -0.50\ \mu$C at $R^2/d = 5$ cm from the centre (so $15$ cm from $q$), and $+0.50\ \mu$C at the centre ($20$ cm from $q$) to keep the sphere neutral. Force (attractive part minus repulsive part): $9\times10^9\times10^{-6}\left(\frac{0.5\times10^{-6}}{0.15^2} - \frac{0.5\times10^{-6}}{0.20^2}\right) = 9000(2.222 - 1.250)\times10^{-5} = 0.0875$ N, attractive.`,
      trap: R`Using only the earthed-sphere image, which gives $0.200$ N.` },
    { id: 'gim-r5-05', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'plane',
      q: R`A charge $q$ is held at height $d$ above a large earthed metal plane. The induced surface charge density directly below it is`,
      options: [R`$-\dfrac{q}{4\pi d^2}$`, R`$-\dfrac{q}{\pi d^2}$`, R`$-\dfrac{q}{2\pi d^2}$`, R`$-\dfrac{q}{4\pi\varepsilon_0d^2}$`], answer: 2,
      sol: R`Just above the plane the field is that of $q$ and its image $-q$: at the foot of the perpendicular both give $\frac{q}{4\pi\varepsilon_0d^2}$ downwards, total $\frac{q}{2\pi\varepsilon_0d^2}$. Then $\sigma = -\varepsilon_0E = -\frac{q}{2\pi d^2}$.`,
      trap: R`Counting only the real charge's field and missing the image's equal share.` },
    { id: 'gim-r5-06', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'line charge',
      q: R`A long straight wire carrying $1.0\ \mu$C/m runs parallel to a large earthed metal plane, $5.0$ cm above it. The force per metre pulling the wire towards the plane is ______ N/m (three decimal places; $\frac{1}{4\pi\varepsilon_0} = 9.0\times10^9$ N m² C⁻²).`,
      answer: 0.18, tol: 0.002, unit: 'N/m', calc: () => 2 * 9e9 * 1e-12 / 0.1,
      sol: R`The image is a line $-\lambda$ at distance $2h = 10$ cm. Its field at the wire is $\frac{\lambda}{2\pi\varepsilon_0(2h)} = \frac{2\times9\times10^9\times10^{-6}}{0.10}$ V/m, so the force per length is $\lambda E = \frac{2\times9\times10^9\times10^{-12}}{0.10} = 0.18$ N/m.`,
      trap: R`Using the point-charge $1/r^2$ law for a line charge, or the distance $h$ instead of $2h$.` },
    { id: 'gim-r5-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'dielectric half-space',
      q: R`A charge $q$ in vacuum is near the flat face of a large block of linear dielectric with $\varepsilon_r = 3$. For the field in the vacuum, the block can be replaced by an image charge (at the mirror point) of`,
      options: [R`$-q$`, R`$+q/2$`, R`$-q/3$`, R`$-q/2$`], answer: 3,
      sol: R`For a charge in medium 1 near medium 2, the image seen from medium 1 is $q' = -q\frac{\varepsilon_2 - \varepsilon_1}{\varepsilon_2 + \varepsilon_1}$. With $\varepsilon_1 = \varepsilon_0$, $\varepsilon_2 = 3\varepsilon_0$: $q' = -q\frac{2}{4} = -q/2$. The charge is attracted to the block; as $\varepsilon_r\to\infty$ the image tends to $-q$, the metal result.`,
      trap: R`Using the metal image $-q$, or $-q/\varepsilon_r$.` },
    { id: 'gim-r5-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'sphere',
      q: R`A $10$ nC charge is $15$ cm from the centre of an earthed metal sphere of radius $5.0$ cm. The attractive force on it is ______ $\mu$N (one decimal place; $\frac{1}{4\pi\varepsilon_0} = 9.0\times10^9$ N m² C⁻²).`,
      answer: 16.9, tol: 0.1, unit: 'μN', calc: () => 9e9 * (10e-9) ** 2 * 0.05 * 0.15 / (0.15 ** 2 - 0.05 ** 2) ** 2 * 1e6,
      sol: R`Image $q' = -qR/d = -3.33$ nC at $R^2/d = 1.67$ cm from the centre, i.e. $d - R^2/d = \frac{d^2 - R^2}{d} = 13.33$ cm from $q$. $F = \frac{q^2Rd}{4\pi\varepsilon_0(d^2 - R^2)^2} = \frac{9\times10^9\times10^{-16}\times0.05\times0.15}{(0.0200)^2} = 1.69\times10^{-5}$ N.`,
      trap: R`Measuring the image's distance from the sphere's centre instead of from the charge.` },
    { id: 'gim-r5-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'dipole images',
      q: R`A small electric dipole $\vec p$ is held above a large earthed metal plane. Its image dipole is`,
      options: [R`antiparallel to $\vec p$ if $\vec p$ is parallel to the plane, and parallel to $\vec p$ if $\vec p$ is perpendicular to the plane`, R`always antiparallel to $\vec p$`, R`always parallel to $\vec p$`, R`parallel to $\vec p$ if $\vec p$ is parallel to the plane, and antiparallel if perpendicular`], answer: 0,
      sol: R`Build the dipole from $\pm q$ and reflect each charge with its sign flipped. Parallel case: $+q$ at $(a, h)$, $-q$ at $(-a, h)$ give $-q$ at $(a, -h)$ and $+q$ at $(-a, -h)$, a dipole pointing along $-\hat x$: reversed. Perpendicular case: $+q$ at $h + a$, $-q$ at $h - a$ give $-q$ at $-(h + a)$ and $+q$ at $-(h - a)$; from $-q$ to $+q$ is still $+\hat z$: same direction.`,
      trap: R`Assuming every image is simply "minus" the original; reflecting positions also matters.` },
    { id: 'gim-r5-10', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'plane', format: 'statements',
      q: R`A charge $q$ is held at height $d$ above a large earthed metal plane. Which statements about the induced charge are true?`,
      options: [R`The total induced charge is $-q$`, R`Half of it lies within a circle of radius $\sqrt3\,d$ centred below $q$`, R`Its density is largest directly below $q$`, R`The field just above the plane is parallel to the plane`],
      answer: [0, 1, 2],
      sol: R`$\sigma(\rho) = -\frac{qd}{2\pi(\rho^2 + d^2)^{3/2}}$. Integrating to radius $\rho$: $Q(\rho) = -q\left(1 - \frac{d}{\sqrt{\rho^2 + d^2}}\right)$, which tends to $-q$, and equals $-q/2$ when $\sqrt{\rho^2 + d^2} = 2d$, i.e. $\rho = \sqrt3d$. $|\sigma|$ is largest at $\rho = 0$. At a conductor's surface the field is normal, not parallel.`,
      trap: R`Expecting half the charge within radius $d$; the tail of $\sigma$ is long.` },
  ],
  gens: [
    { id: 'gim-r5g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'sphere',
      make(r) {
        const Rc = int(r, 2, 10), d = Rc + int(r, 2, 20), q = choose(r, [1, 2, 5, 10, 20]), iso = r() < 0.5;
        const Rm = Rc / 100, dm = d / 100, qc = q * 1e-9, qi = qc * Rm / dm, Fe = k * qc * qi / (dm - Rm * Rm / dm) ** 2;
        const F = (iso ? Fe - k * qc * qi / (dm * dm) : Fe) * 1e6;
        return { q: `A $${q}$ nC charge is $${d}$ cm from the centre of ${iso ? 'an isolated, uncharged' : 'an earthed'} metal sphere of radius $${Rc}$ cm. The magnitude of the force on it is ______ $\\mu$N (three decimal places).`,
          answer: round(F, 3), tol: Math.max(0.001, round(F * 0.003, 3)), unit: 'μN', Rc, d, qn: q, iso,
          sol: `Image $-qR/d = -${round(q * Rc / d, 4)}$ nC at $R^2/d$ from the centre, $${round(d - Rc * Rc / d, 4)}$ cm from the charge${iso ? `, plus $+${round(q * Rc / d, 4)}$ nC at the centre to keep the sphere neutral` : ''}. $F = ${round(Fe * 1e6, 3)}\\ \\mu$N${iso ? ` $- ${round(k * qc * qi / (dm * dm) * 1e6, 3)}\\ \\mu$N $= ${round(F, 3)}\\ \\mu$N` : ''}, attractive.`,
          trap: iso ? 'An isolated neutral sphere needs a second image at its centre.' : 'Measure the image distance from the charge: $d - R^2/d$.' };
      },
      verify: (p) => { const Rm = p.Rc / 100, dm = p.d / 100, qc = p.qn * 1e-9, qi = qc * Rm / dm, Fe = k * qc * qi / (dm - Rm * Rm / dm) ** 2; return (p.iso ? Fe - k * qc * qi / (dm * dm) : Fe) * 1e6; } },
    { id: 'gim-r5g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'plane',
      make(r) {
        const d = int(r, 1, 10), rho = choose(r, [0, 1, 2, 3, 4]) * d, frac = 1 - d / Math.sqrt(rho * rho + d * d), q = choose(r, [1, 2, 4, 5, 10]);
        const ask = rho === 0 ? 'sig' : 'frac';
        const sig = q / (2 * Math.PI * (d / 100) ** 2);
        const ans = ask === 'sig' ? sig : 100 * frac;
        return { q: ask === 'sig' ? `A $${q}$ nC charge is $${d}$ cm above a large earthed metal plane. The magnitude of the induced surface charge density directly below it is ______ nC/m² (two decimal places).`
          : `A charge is $${d}$ cm above a large earthed metal plane. The percentage of the total induced charge that lies within $${rho}$ cm of the point directly below it is ______ % (two decimal places).`,
          answer: round(ans, 2), tol: Math.max(0.01, round(ans * 0.002, 2)), unit: ask === 'sig' ? 'nC/m²' : '%', d, rho, qn: q, ask,
          sol: ask === 'sig' ? `With the image, the field at the foot is $\\frac{q}{2\\pi\\varepsilon_0d^2}$, so $|\\sigma| = \\frac{q}{2\\pi d^2} = \\frac{${q}}{2\\pi\\times${(d / 100) ** 2}} = ${round(sig, 2)}$ nC/m².`
            : `$Q(\\rho)/Q_{\\rm total} = 1 - \\frac{d}{\\sqrt{\\rho^2 + d^2}} = 1 - \\frac{${d}}{\\sqrt{${rho * rho + d * d}}} = ${round(frac, 4)}$, i.e. $${round(100 * frac, 2)}\\%$.`,
          trap: 'Include the image: it doubles the field at the plane.' };
      },
      verify: (p) => (p.ask === 'sig' ? p.qn / (2 * Math.PI * (p.d / 100) ** 2) : 100 * (1 - p.d / Math.sqrt(p.rho * p.rho + p.d * p.d))) },
    { id: 'gim-r5g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'dielectric half-space',
      make(r) {
        const er = choose(r, [1.5, 2, 2.5, 3, 4, 5, 9, 80]), q = choose(r, [1, 2, 5, 10]), d = int(r, 1, 10);
        const qi = q * (er - 1) / (er + 1), F = k * q * 1e-9 * qi * 1e-9 / (2 * d / 100) ** 2 * 1e6;
        return { q: `A $${q}$ nC charge in air is $${d}$ cm from the flat face of a large block of dielectric with $\\varepsilon_r = ${er}$. The force attracting it to the block is ______ $\\mu$N (three decimal places).`,
          answer: round(F, 3), tol: Math.max(0.001, round(F * 0.003, 3)), unit: 'μN', er, qn: q, d,
          sol: `Image $q' = -q\\frac{\\varepsilon_r - 1}{\\varepsilon_r + 1} = -${round(qi, 4)}$ nC at distance $2d = ${2 * d}$ cm. $F = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q|q'|}{(2d)^2} = ${round(F, 3)}\\ \\mu$N.`,
          trap: 'The dielectric image is weaker than $-q$ by the factor $(\\varepsilon_r - 1)/(\\varepsilon_r + 1)$.' };
      },
      verify: (p) => { const qi = p.qn * (p.er - 1) / (p.er + 1); return k * p.qn * 1e-9 * qi * 1e-9 / (2 * p.d / 100) ** 2 * 1e6; } },
  ],
};
