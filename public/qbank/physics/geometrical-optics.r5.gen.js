// Round 5 extras for geometrical-optics: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'gop-r5-01', type: 'nat', level: 4, exams: ['jam'], sub: 'silvered lens',
      q: R`A plano-convex glass lens ($n = 1.6$) has a curved face of radius $20$ cm. Its flat face is silvered, and light enters through the curved face. The combination behaves like a concave mirror of focal length ______ cm (one decimal place).`,
      answer: 16.7, tol: 0.2, unit: 'cm', calc: () => (20 / 0.6) / 2,
      sol: R`The lens alone has $\frac1f = (n - 1)\frac1R = \frac{0.6}{20}$, so $f = 33.3$ cm. Light crosses the lens, reflects at the flat mirror (power $0$) and crosses the lens again. The total power is $P = 2P_{\rm lens} + P_{\rm mirror} = \frac{2}{33.3} + 0$, and the equivalent mirror has $F = 1/P = 16.7$ cm.`,
      trap: R`Forgetting that light passes through the lens twice; the answer is half the lens focal length here, not the lens focal length.` },
    { id: 'gop-r5-02', type: 'mcq', level: 3, exams: ['jam'], sub: 'apparent depth',
      q: R`A beaker holds a $4.0$ cm layer of glass ($n = 1.5$) at the bottom with $6.0$ cm of water ($n = 4/3$) on top. A mark on the bottom, viewed from straight above, appears to be below the water surface by about`,
      options: [R`$10.0$ cm`, R`$7.5$ cm`, R`$7.2$ cm`, R`$5.5$ cm`], answer: 2,
      sol: R`Near-normal viewing: each layer looks thinner by its own index, and the apparent thicknesses add. Water: $6.0/(4/3) = 4.5$ cm. Glass: $4.0/1.5 = 2.67$ cm. Total $\approx 7.17$ cm, so about $7.2$ cm.`,
      trap: R`Dividing the total depth by one average index; each layer is reduced by its own index.` },
    { id: 'gop-r5-03', type: 'msq', level: 3, exams: ['jam'], sub: 'lens in a medium', format: 'statements',
      q: R`A thin biconvex glass lens ($n_g = 1.5$) has focal length $f$ in air. Which statements are true?`,
      options: [R`In water ($n = 4/3$) its focal length becomes $4f$`, R`In a liquid of index $1.5$ it has no focusing power`, R`In a liquid of index $1.7$ it diverges light`, R`A concave mirror's focal length also changes when it is put in water`],
      answer: [0, 1, 2],
      sol: R`Lens maker's formula in a medium of index $n_m$: $\frac1{f_m} = \left(\frac{n_g}{n_m} - 1\right)K$ with $K$ fixed by the curvatures. In air $\frac1f = 0.5K$. In water $\frac{n_g}{n_m} - 1 = 1.125 - 1 = 0.125$, so $f_m = 4f$. At $n_m = 1.5$ the bracket is $0$: no power. At $n_m = 1.7$ it is negative: the lens diverges. A mirror's focal length $R/2$ depends only on its shape, so the last statement is false.`,
      trap: R`Thinking a mirror behaves like a lens under water; reflection does not involve the index.` },
    { id: 'gop-r5-04', type: 'nat', level: 3, exams: ['jam'], sub: 'prisms',
      q: R`A prism of apex angle $50^\circ$ gives a minimum deviation of $30^\circ$ for yellow light. The refractive index of the glass for that light is ______ (two decimal places).`,
      answer: 1.52, tol: 0.01, calc: () => Math.sin(40 * Math.PI / 180) / Math.sin(25 * Math.PI / 180),
      sol: R`At minimum deviation the ray passes symmetrically: $n = \dfrac{\sin\frac{A + D_m}{2}}{\sin\frac{A}{2}} = \dfrac{\sin 40^\circ}{\sin 25^\circ} = \dfrac{0.6428}{0.4226} = 1.52$.`,
      trap: R`Using the thin-prism formula $D = (n - 1)A$; at $50^\circ$ it is far off ($n = 1.6$).` },
    { id: 'gop-r5-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'lens combinations',
      q: R`A thin convex lens ($f_1 = +20$ cm) and a thin concave lens ($f_2 = -30$ cm) sit on a common axis $10$ cm apart. The equivalent focal length of the pair is`,
      options: [R`$+60$ cm`, R`$-12$ cm`, R`$+12$ cm`, R`$+30$ cm`], answer: 3,
      sol: R`$\frac1F = \frac1{f_1} + \frac1{f_2} - \frac{d}{f_1f_2} = \frac1{20} - \frac1{30} - \frac{10}{(20)(-30)} = \frac{3 - 2 + 1}{60} = \frac{2}{60}$, so $F = +30$ cm.`,
      trap: R`Dropping the separation term gives $+60$ cm (lenses in contact).` },
    { id: 'gop-r5-06', type: 'nat', level: 4, exams: ['jam'], sub: 'displacement method',
      q: R`A lamp and a screen are fixed $90$ cm apart. A convex lens placed between them gives a sharp image at two positions that are $30$ cm apart. The focal length of the lens is ______ cm.`,
      answer: 20, tol: 0.1, unit: 'cm', calc: () => (90 ** 2 - 30 ** 2) / (4 * 90),
      sol: R`By symmetry the two positions swap object and image distances: $u + v = D = 90$ and $v - u = d = 30$, so $u = 30$, $v = 60$. Then $\frac1f = \frac1{30} + \frac1{60} = \frac{3}{60}$, $f = 20$ cm. In general $f = \frac{D^2 - d^2}{4D} = \frac{8100 - 900}{360} = 20$ cm.`,
      trap: R`Taking $f = D/4$; that is only the case when the two positions merge ($d = 0$).` },
    { id: 'gop-r5-07', type: 'nat', level: 3, exams: ['jam'], sub: 'optical fibre',
      q: R`A step-index fibre has core index $1.50$ and cladding index $1.45$. The largest angle to the axis at which light from air can enter the flat end and still be guided is ______ degrees (one decimal place).`,
      answer: 22.6, tol: 0.3, unit: '°', calc: () => Math.asin(Math.sqrt(1.5 ** 2 - 1.45 ** 2)) * 180 / Math.PI,
      sol: R`Guiding needs total internal reflection at the core-cladding wall, which sets the numerical aperture $\sin\theta_{\max} = \sqrt{n_1^2 - n_2^2} = \sqrt{2.25 - 2.1025} = \sqrt{0.1475} = 0.384$. So $\theta_{\max} = 22.6^\circ$.`,
      trap: R`Using the critical angle at the wall ($75.2^\circ$) as the answer; it must be converted through refraction at the end face.` },
    { id: 'gop-r5-08', type: 'mcq', level: 2, exams: ['jam'], sub: 'mirrors', format: 'graph in words',
      q: R`A small object is moved slowly along the axis of a concave mirror, from very far away towards the focus. The size of the real image`,
      options: [R`grows all the time, equals the object at the centre of curvature, and grows without limit as the object reaches the focus`, R`shrinks all the time`, R`grows until the object reaches the centre of curvature, then shrinks`, R`stays the same, because the mirror's focal length is fixed`], answer: 0,
      sol: R`For a real object, $|m| = \frac{f}{u - f}$ (with $u$ the object distance, $u > f$). As $u$ falls from very large to $f$, the denominator shrinks, so $|m|$ grows steadily: $|m| = 1$ at $u = 2f$ (the centre of curvature) and $|m|\to\infty$ as $u\to f$.`,
      trap: R`Picturing the image size peaking at the centre of curvature; $|m| = 1$ there, and it keeps growing.` },
    { id: 'gop-r5-09', type: 'mcq', level: 4, exams: ['jam'], sub: 'spherical surface',
      q: R`A small fish sits exactly at the centre of a spherical bowl of water ($n = 4/3$, radius $15$ cm; ignore the thin glass). Seen from outside, the fish appears`,
      options: [R`at the centre, at its true size`, R`at the centre, $4/3$ times larger`, R`$11.25$ cm from the near wall, $3/4$ as large`, R`$11.25$ cm from the near wall, at its true size`], answer: 1,
      sol: R`Refraction at one surface: $\frac{n_2}{v} - \frac{n_1}{u} = \frac{n_2 - n_1}{R}$ with $n_1 = 4/3$, $n_2 = 1$, $u = -15$ cm and $R = -15$ cm (centre on the object side). Then $\frac1v + \frac{4}{45} = \frac{1}{45}$, so $v = -15$ cm: the image is at the centre. Magnification $m = \frac{n_1v}{n_2u} = \frac{4}{3}$. Rays from the centre meet the surface normally and are not bent, so the position is unchanged, but the angle the fish subtends grows.`,
      trap: R`Applying the flat-surface apparent-depth rule $15/(4/3)$; the surface is curved and rays from the centre are not bent.` },
    { id: 'gop-r5-10', type: 'msq', level: 3, exams: ['jam'], sub: 'aberrations', format: 'statements',
      q: R`Which statements about chromatic aberration are true?`,
      options: [R`Two thin lenses in contact are achromatic when $\dfrac{\omega_1}{f_1} + \dfrac{\omega_2}{f_2} = 0$ ($\omega$ = dispersive power)`, R`An achromatic doublet in contact needs one converging and one diverging lens`, R`A single convex lens focuses blue light farther away than red light`, R`A mirror has no chromatic aberration`],
      answer: [0, 1, 3],
      sol: R`For lenses in contact, $P = P_1 + P_2$ and the change with colour is $\omega_1P_1 + \omega_2P_2$; setting it to zero gives the first statement. Since $\omega$ is positive for glass, $P_1$ and $P_2$ must have opposite signs. Blue light has the larger index, so a convex lens bends it more and focuses it nearer, not farther. Reflection does not depend on wavelength, so mirrors have none.`,
      trap: R`Reversing the colours: blue focuses closer to a convex lens.` },
  ],
  gens: [
    { id: 'gop-r5g1', type: 'nat', level: 3, exams: ['jam'], sub: 'displacement method',
      make(r) {
        const D = pick(r, 60, 150, 10), d = pick(r, 10, D - 30, 5), f = (D * D - d * d) / (4 * D);
        return { q: `An object and a screen are $${D}$ cm apart. A convex lens gives a sharp image on the screen at two positions $${d}$ cm apart. The focal length of the lens is ______ cm (two decimal places).`,
          answer: round(f, 2), tol: 0.02, unit: 'cm', D, d,
          sol: `The two positions swap $u$ and $v$: $u + v = ${D}$, $v - u = ${d}$, so $u = ${(D - d) / 2}$ cm and $v = ${(D + d) / 2}$ cm. Then $f = \\frac{uv}{u + v} = \\frac{D^2 - d^2}{4D} = \\frac{${D * D} - ${d * d}}{${4 * D}} = ${round(f, 2)}$ cm.`,
          trap: 'The separation of the two lens positions is $v - u$, not $u$ or $v$.' };
      },
      verify: (p) => (p.D * p.D - p.d * p.d) / (4 * p.D) },
    { id: 'gop-r5g2', type: 'nat', level: 3, exams: ['jam'], sub: 'lens combinations',
      make(r) {
        const f1 = choose(r, [10, 15, 20, 25, 40]), f2 = choose(r, [-50, -40, -25, 20, 30, 50]), d = choose(r, [0, 2, 5, 8, 10]);
        const P = 100 * (1 / f1 + 1 / f2 - d / (f1 * f2));
        return { q: `Thin lenses of focal lengths $${f1}$ cm and $${f2}$ cm stand $${d}$ cm apart on one axis. The power of the combination is ______ dioptres (two decimal places).`,
          answer: round(P, 2), tol: 0.02, unit: 'D', f1, f2, d,
          sol: `In metres: $P = \\frac1{f_1} + \\frac1{f_2} - \\frac{d}{f_1f_2} = \\frac{1}{${f1 / 100}} + \\frac{1}{${f2 / 100}} - \\frac{${d / 100}}{(${f1 / 100})(${f2 / 100})} = ${round(P, 2)}$ D.`,
          trap: 'Power in dioptres needs focal lengths in metres; keep the sign of a diverging lens.' };
      },
      verify: (p) => 100 * (1 / p.f1 + 1 / p.f2 - p.d / (p.f1 * p.f2)) },
    { id: 'gop-r5g3', type: 'mcq', level: 3, exams: ['jam'], sub: 'lens in a medium',
      make(r) {
        const ng = choose(r, [1.5, 1.6, 1.65, 1.7]), nl = choose(r, [1.2, 1.25, 1.33, 1.4]);
        const k = (ng - 1) / (ng / nl - 1), show = (v) => `$${round(v, 2)}f$`;
        const o = mcqOptions(r, k, [(ng - 1) / (ng - nl), nl, ng / nl, 1 / k], show);
        return { q: `A thin glass lens ($n = ${ng}$) has focal length $f$ in air. Immersed in a liquid of index $${nl}$, its focal length becomes`, ...o, ng, nl,
          sol: `$\\frac1{f_m} = \\left(\\frac{n_g}{n_m} - 1\\right)K$ and $\\frac1f = (n_g - 1)K$, so $\\frac{f_m}{f} = \\frac{n_g - 1}{n_g/n_m - 1} = \\frac{${round(ng - 1, 2)}}{${round(ng / nl - 1, 4)}} = ${round(k, 2)}$.`,
          trap: 'Use the ratio of indices $n_g/n_m$, not their difference.' };
      },
      verify: (p) => (p.ng - 1) / (p.ng / p.nl - 1) },
  ],
};
