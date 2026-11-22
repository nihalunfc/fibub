// Round 4 extras for moment-of-inertia: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'moi-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'point masses',
      q: R`Two small balls, each of mass $m$, are fixed to the ends of a light rod of length $L$. The moment of inertia about an axis through one ball, perpendicular to the rod, is`,
      options: [R`$mL^2/2$`, R`$mL^2$`, R`$2mL^2$`, R`$mL^2/4$`], answer: 1,
      sol: R`$I = \sum m_ir_i^2$. The ball on the axis has $r = 0$ and adds nothing; the other is at $r = L$: $I = mL^2$. (About the midpoint it would be $2m(L/2)^2 = mL^2/2$.)`,
      trap: R`$2mL^2$ wrongly counts both balls as being a distance $L$ from the axis.` },
    { id: 'moi-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'standard bodies',
      q: R`A thin uniform rod of mass $M$ and length $L$ has moment of inertia $I_1$ about the perpendicular axis through its centre. It is bent into a circular ring, whose moment of inertia about the axis through its centre perpendicular to its plane is $I_2$. The ratio $I_2/I_1$ is`,
      options: ['1', R`$\pi^2/3 \approx 3.29$`, R`$3/\pi^2 \approx 0.30$`, R`$1/2$`], answer: 2,
      sol: R`$I_1 = ML^2/12$. The ring has circumference $L$, so $R = L/(2\pi)$ and $I_2 = MR^2 = \dfrac{ML^2}{4\pi^2}$. Ratio $= \dfrac{12}{4\pi^2} = \dfrac{3}{\pi^2} \approx 0.30$. Bending brings every bit of the rod within $L/(2\pi) = 0.16L$ of the axis, while the straight rod's ends are $0.5L$ away.`,
      trap: R`Mass and length are unchanged, but the distances from the axis are not.` },
    { id: 'moi-r4-03', type: 'nat', level: 2, exams: ['jam'], sub: 'parallel axis',
      q: R`A 2.0 kg body has moment of inertia 0.50 kg m² about an axis 0.30 m from its centre of mass. About a parallel axis 0.50 m from its centre of mass, its moment of inertia is ______ kg m².`,
      answer: 0.82, tol: 0.005, unit: 'kg m²', calc: () => 0.5 - 2 * 0.3 ** 2 + 2 * 0.5 ** 2,
      sol: R`The parallel axis theorem links any axis to the one through the centre of mass. First go to the centre: $I_{\rm cm} = 0.50 - 2.0\times0.30^2 = 0.32$ kg m². Then out to the new axis: $I = 0.32 + 2.0\times0.50^2 = 0.82$ kg m².`,
      trap: R`Adding $M(0.2)^2$ (the distance between the two axes) is wrong: the theorem only works from the centre-of-mass axis.` },
    { id: 'moi-r4-04', type: 'nat', level: 3, exams: ['jam'], sub: 'radius of gyration',
      q: R`The Earth (mass $5.97\times10^{24}$ kg, radius $6.37\times10^6$ m) has moment of inertia $0.33MR^2$ about its axis, less than a uniform sphere's because it is denser towards the centre. It turns once in 86 164 s. Its rotational kinetic energy is ______ $\times10^{29}$ J (two decimal places).`,
      answer: 2.13, tol: 0.02, unit: '×10²⁹ J', calc: () => { const I = 0.33 * 5.97e24 * 6.37e6 ** 2, w = (2 * Math.PI) / 86164; return (0.5 * I * w * w) / 1e29; },
      sol: R`$I = 0.33\times5.97\times10^{24}\times(6.37\times10^6)^2 = 7.99\times10^{37}$ kg m². $\omega = 2\pi/86\,164 = 7.29\times10^{-5}$ rad/s (one turn relative to the stars). $K = \tfrac12I\omega^2 = \tfrac12\times7.99\times10^{37}\times5.32\times10^{-9} = 2.13\times10^{29}$ J.`,
      trap: R`Using $\tfrac25MR^2$ for a uniform sphere overestimates by about 21%.` },
    { id: 'moi-r4-05', type: 'msq', level: 3, exams: ['jam'], sub: 'standard bodies',
      q: R`Which of these have moment of inertia exactly $\tfrac12MR^2$ about the stated axis? (Each body is uniform, of mass $M$ and radius $R$.)`,
      options: ['A solid disc, about the axis through its centre perpendicular to its face', 'A thin ring, about one of its diameters', 'A half-disc (semicircular plate), about the axis perpendicular to its plane through the centre of the full circle', 'A thin spherical shell, about a diameter'], answer: [0, 1, 2],
      sol: R`Disc: $\tfrac12MR^2$. Ring: $MR^2$ about its axis, and by the perpendicular axis theorem each diameter gets half: $\tfrac12MR^2$. A half-disc is half the mass of a full disc at the same distances from that axis: $\tfrac12\cdot\tfrac12(2M)R^2 = \tfrac12MR^2$. A thin spherical shell has $\tfrac23MR^2$.`,
      trap: R`Cutting a disc in half halves both $I$ and $M$, so $I/M$ is unchanged.` },
    { id: 'moi-r4-06', type: 'mcq', level: 3, exams: ['jam'], sub: 'non-uniform density',
      q: R`A thin rod of length $L$ has a mass per unit length that grows linearly from zero at end A to a maximum at end B. Its total mass is $M$. Its moment of inertia about the axis through A perpendicular to the rod is`,
      options: [R`$ML^2/2$`, R`$ML^2/3$`, R`$2ML^2/3$`, R`$ML^2/4$`], answer: 0,
      sol: R`Take $\lambda = kx$ with $x$ measured from A. $M = \int_0^Lkx\,dx = kL^2/2$. $I_A = \int_0^Lkx\cdot x^2\,dx = kL^4/4 = \tfrac{kL^2}{2}\cdot\tfrac{L^2}{2} = \dfrac{ML^2}{2}$. More mass sits far from A than for a uniform rod ($ML^2/3$).`,
      trap: R`$ML^2/4$ forgets to express $k$ through the total mass.` },
    { id: 'moi-r4-07', type: 'nat', level: 3, exams: ['jam'], sub: 'composite bodies',
      q: R`A wheel is made of a thin rim (a ring of mass 2.0 kg and radius 0.40 m) and six thin straight spokes, each of mass 0.10 kg, running from the axle to the rim. Ignoring the hub, its moment of inertia about the axle is ______ kg m² (three decimal places).`,
      answer: 0.352, tol: 0.002, unit: 'kg m²', calc: () => 2 * 0.4 ** 2 + (6 * 0.1 * 0.4 ** 2) / 3,
      sol: R`Moments of inertia about the same axis add. Rim: $MR^2 = 2.0\times0.16 = 0.320$ kg m². Each spoke is a rod turning about one end: $\tfrac13mR^2 = \tfrac13\times0.10\times0.16$; six of them give $0.032$ kg m². Total $0.352$ kg m².`,
      trap: R`A spoke turns about its end, not its centre: use $mR^2/3$, not $mR^2/12$.` },
    { id: 'moi-r4-08', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'perpendicular axis',
      q: R`A uniform plate in the shape of a regular hexagon of side $a$ has mass $M$. Its moment of inertia about the axis through its centre perpendicular to the plate is`,
      options: [R`$\tfrac12Ma^2$`, R`$\tfrac13Ma^2$`, R`$\tfrac16Ma^2$`, R`$\tfrac{5}{12}Ma^2$`], answer: 3,
      sol: R`Split the hexagon into six equilateral triangles of side $a$ and mass $m = M/6$. About its own centroid (perpendicular axis) each has $ma^2/12$, and its centroid is $a/\sqrt3$ from the hexagon's centre. Parallel axis theorem: $m\left(\dfrac{a^2}{12} + \dfrac{a^2}{3}\right) = \dfrac{5}{12}ma^2$. Six of them: $\dfrac{5}{12}Ma^2$. (Compare a disc of radius $a$: $\tfrac12Ma^2$; the hexagon's corners lie on that circle but its edges come inside it.)`,
      trap: R`$\tfrac12Ma^2$ treats the hexagon as the disc through its corners.` },
    { id: 'moi-r4-09', type: 'msq', level: 4, exams: ['jam'], sub: 'point masses', format: 'statements',
      q: R`Three point masses $m$ sit at the corners of an equilateral triangle of side $a$ (light frame). Which statements are correct?`,
      options: [R`About the axis through the centroid perpendicular to the plane, $I = ma^2$`, R`About an axis along one side, $I = ma^2/2$`, R`About an axis along a median (through one corner and the centroid, in the plane), $I = ma^2/2$`, R`About the axis through one corner perpendicular to the plane, $I = 2ma^2$`], answer: [0, 2, 3],
      sol: R`Each corner is $a/\sqrt3$ from the centroid: $3m\cdot a^2/3 = ma^2$. Along one side, two masses are on the axis and the third is at the triangle's height $\tfrac{\sqrt3}{2}a$: $I = \tfrac34ma^2$, not $\tfrac12ma^2$. Along a median, one mass is on the axis and the other two are $a/2$ away: $2m(a/2)^2 = ma^2/2$. Through a corner, perpendicular: the other two are each $a$ away, $2ma^2$ (also $ma^2 + 3m(a/\sqrt3)^2$ by the parallel axis theorem).`,
      trap: R`For an axis along a side, the distance is the height of the triangle, $\tfrac{\sqrt3}{2}a$, not $a/2$.` },
    { id: 'moi-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'standard bodies',
      q: R`A uniform solid cone has mass 4.0 kg, base radius 0.30 m and height 0.80 m. Its moment of inertia about a diameter of its base is ______ kg m² (three decimal places).`,
      answer: 0.31, tol: 0.002, unit: 'kg m²', calc: () => (3 / 20) * 4 * 0.3 ** 2 + (1 / 10) * 4 * 0.8 ** 2,
      sol: R`About an axis through the apex perpendicular to the cone's axis: $I_{\rm apex} = \tfrac35M\left(\tfrac{R^2}{4} + h^2\right)$. The centre of mass is $\tfrac34h$ from the apex, so $I_{\rm cm} = I_{\rm apex} - M\left(\tfrac34h\right)^2 = \tfrac{3}{20}MR^2 + \tfrac{3}{80}Mh^2$. The base is $\tfrac h4$ from the centre of mass: $I_{\rm base} = I_{\rm cm} + M\tfrac{h^2}{16} = \tfrac{3}{20}MR^2 + \tfrac{1}{10}Mh^2 = 0.054 + 0.256 = 0.310$ kg m².`,
      trap: R`Shifting directly from the apex axis to the base with $Mh^2$ skips the centre of mass; the parallel axis theorem must go through it.` },
  ],
  gens: [
    { id: 'moi-r4g1', type: 'nat', level: 2, exams: ['jam'], sub: 'parallel axis',
      make(r) {
        const M = pick(r, 0.5, 5, 0.5), d1 = pick(r, 0.1, 0.5, 0.05), d2 = pick(r, 0.1, 0.8, 0.05), Icm = pick(r, 0.05, 1, 0.05);
        const I1 = round(Icm + M * d1 * d1, 4), answer = round(Icm + M * d2 * d2, 4);
        return { q: R`A ${M} kg body has moment of inertia ${I1} kg m² about an axis ${d1} m from its centre of mass. Find its moment of inertia (kg m²) about a parallel axis ${d2} m from its centre of mass.`,
          answer, tol: Math.max(0.001, answer * 0.005), unit: 'kg m²', M, d1, d2, I1,
          sol: R`$I_{\rm cm} = ${I1} - ${M}\times${d1}^2 = ${round(I1 - M * d1 * d1, 4)}$ kg m². Then $I = ${round(I1 - M * d1 * d1, 4)} + ${M}\times${d2}^2 = ${answer}$ kg m².`,
          trap: 'The parallel axis theorem only connects an axis to the parallel axis through the centre of mass.' };
      },
      verify: (p) => p.I1 - p.M * p.d1 ** 2 + p.M * p.d2 ** 2 },
    { id: 'moi-r4g2', type: 'nat', level: 3, exams: ['jam'], sub: 'composite bodies',
      make(r) {
        const Mr = pick(r, 0.5, 4, 0.5), Rr = pick(r, 0.2, 0.6, 0.05), n = choose(r, [3, 4, 5, 6, 8, 12]), ms = pick(r, 0.05, 0.3, 0.05);
        const answer = round(Mr * Rr * Rr + (n * ms * Rr * Rr) / 3, 4);
        return { q: R`A wheel has a thin rim (mass ${Mr} kg, radius ${Rr} m) and ${n} thin straight spokes of ${ms} kg each running from the axle to the rim. Ignoring the hub, find its moment of inertia about the axle in kg m².`,
          answer, tol: Math.max(0.0005, answer * 0.005), unit: 'kg m²', Mr, Rr, n, ms,
          sol: R`Rim: $MR^2 = ${round(Mr * Rr * Rr, 4)}$. Spokes: $${n}\times\tfrac13mR^2 = ${round((n * ms * Rr * Rr) / 3, 4)}$. Total $${answer}$ kg m².`,
          trap: 'Each spoke turns about its end: one third of mR².' };
      },
      verify: (p) => p.Mr * p.Rr ** 2 + (p.n * p.ms * p.Rr ** 2) / 3 },
    { id: 'moi-r4g3', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'standard bodies',
      make(r) {
        const M = pick(r, 1, 10, 0.5), Rc = pick(r, 0.1, 0.5, 0.05), h = pick(r, 0.2, 1.2, 0.1), ax = choose(r, ['base', 'cm', 'apex']);
        const I = { base: 0.15 * M * Rc * Rc + 0.1 * M * h * h, cm: 0.15 * M * Rc * Rc + 0.0375 * M * h * h, apex: 0.6 * M * (Rc * Rc / 4 + h * h) }[ax];
        const where = { base: 'a diameter of its base', cm: 'an axis through its centre of mass perpendicular to its symmetry axis', apex: 'an axis through its apex perpendicular to its symmetry axis' }[ax];
        const answer = round(I, 4);
        return { q: R`A uniform solid cone has mass ${M} kg, base radius ${Rc} m and height ${h} m. Find its moment of inertia (kg m²) about ${where}.`,
          answer, tol: Math.max(0.0005, answer * 0.005), unit: 'kg m²', M, Rc, h, ax: ['base', 'cm', 'apex'].indexOf(ax),
          sol: R`$I_{\rm apex} = \tfrac35M(\tfrac{R^2}{4} + h^2)$; the centre of mass is $\tfrac34h$ from the apex, so $I_{\rm cm} = \tfrac{3}{20}MR^2 + \tfrac{3}{80}Mh^2$; the base is $\tfrac h4$ beyond it, so $I_{\rm base} = \tfrac{3}{20}MR^2 + \tfrac1{10}Mh^2$. Here: $${answer}$ kg m².`,
          trap: 'Shift between parallel axes only through the centre of mass.' };
      },
      verify: (p) => [0.15 * p.M * p.Rc ** 2 + 0.1 * p.M * p.h ** 2, 0.15 * p.M * p.Rc ** 2 + 0.0375 * p.M * p.h ** 2, 0.6 * p.M * (p.Rc ** 2 / 4 + p.h ** 2)][p.ax] },
  ],
};
