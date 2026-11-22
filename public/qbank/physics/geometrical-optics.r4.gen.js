// Round 4 extras for geometrical-optics: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'gop-r4-01', type: 'nat', level: 2, exams: ['jam'], sub: 'reflection',
      q: R`A girl walks towards a plane mirror at $3$ m/s (relative to the ground) while the mirror is pushed towards her at $1$ m/s. Her image approaches her at ______ m/s.`,
      answer: 8, tol: 0, unit: 'm/s', calc: () => 2 * (3 + 1),
      sol: R`Put the girl at $x_g$ and the mirror at $x_m$. Her image sits as far behind the mirror as she is in front: $x_i = 2x_m - x_g$. With the girl moving at $+3$ m/s and the mirror at $-1$ m/s, $\dot x_i = 2(-1) - 3 = -5$ m/s. The image therefore approaches her at $3 - (-5) = 8$ m/s, which is twice the rate at which she and the mirror close in ($4$ m/s).`,
      trap: R`Adding the two speeds (4 m/s) gives how fast she nears the mirror, not her image; the image gap is twice the mirror gap.` },
    { id: 'gop-r4-02', type: 'msq', level: 2, exams: ['jam'], sub: 'reflection', format: 'statements',
      q: R`A man $1.80$ m tall, whose eyes are $10$ cm below the top of his head, wants to see his full height in a vertical plane mirror on a wall. Which statements are true?`,
      options: [R`The shortest mirror that works is $0.90$ m long`, R`Its top edge must be $1.75$ m above the floor`, R`Its bottom edge must be $0.90$ m above the floor`, R`If he steps back from the wall he needs a longer mirror`],
      answer: [0, 1],
      sol: R`Light from the top of his head reaches his eye after reflecting at the point halfway (in height) between head and eye: $(1.80 + 1.70)/2 = 1.75$ m. Light from his feet reflects halfway between feet and eye: $1.70/2 = 0.85$ m. So the mirror must run from $0.85$ m to $1.75$ m, a length $0.90$ m, half his height. These heights come from similar triangles and do not depend on how far he stands from the wall.`,
      trap: R`Placing the bottom edge at half his height (0.90 m); it is half the eye height, 0.85 m.` },
    { id: 'gop-r4-03', type: 'nat', level: 3, exams: ['jam'], sub: 'prisms',
      q: R`A thin glass prism of apex angle $4^\circ$ ($n = 1.54$) deviates light by $2.16^\circ$ in air. When the prism and the light are both under water ($n = 4/3$), the deviation is ______ degrees (two decimal places).`,
      answer: 0.62, tol: 0.01, unit: 'degrees', calc: () => (1.54 / (4 / 3) - 1) * 4,
      sol: R`For a thin prism $\delta = (n_{\rm rel} - 1)A$, where $n_{\rm rel}$ is the prism's index relative to its surroundings. In water $n_{\rm rel} = 1.54/1.333 = 1.155$, so $\delta = 0.155\times4^\circ = 0.62^\circ$, less than a third of the deviation in air.`,
      trap: R`Using $n_{\rm glass} - n_{\rm water} = 0.207$ instead of the ratio; that gives $0.83^\circ$.` },
    { id: 'gop-r4-04', type: 'mcq', level: 2, exams: ['jam'], sub: 'mirrors',
      q: R`A concave mirror has focal length $20$ cm in air. It is lowered into a tank of water ($n = 4/3$). Its focal length in water is`,
      options: [R`$15$ cm`, R`$20$ cm`, R`$26.7$ cm`, R`$80$ cm`], answer: 1,
      sol: R`A mirror works by reflection only, and the law of reflection (angle in = angle out) does not involve the refractive index. So $f = R/2$ is set by the shape alone and stays $20$ cm. Only lenses (and refracting surfaces) change their focal length in a new medium.`,
      trap: R`Applying the lens-in-liquid rule to a mirror.` },
    { id: 'gop-r4-05', type: 'msq', level: 3, exams: ['jam'], sub: 'thin lenses', format: 'statements',
      q: R`A convex lens forms a sharp real image of a candle on a screen. The lower half of the lens is then covered with black paper. Which statements are true?`,
      options: [R`Only the upper half of the candle's image remains`, R`The whole image is still formed`, R`The image stays at the same place on the screen`, R`The image is as bright as before`],
      answer: [1, 2],
      sol: R`Every point of the candle sends rays through every part of the lens, and all of them meet at the same image point. Covering half the lens removes half of those rays for every point, so the full image is still there, in the same place, but receives about half the light: it is dimmer.`,
      trap: R`Thinking each half of the lens images one half of the object.` },
    { id: 'gop-r4-06', type: 'nat', level: 4, exams: ['jam'], sub: 'thin lenses',
      q: R`A short pin of length $2$ mm lies along the axis of a thin convex lens of focal length $20$ cm, centred $30$ cm in front of it. The length of its image along the axis is about ______ mm.`,
      answer: 8, tol: 0.1, unit: 'mm', calc: () => { const u = -30, f = 20, v = 1 / (1 / f + 1 / u); return 2 * (v / u) ** 2; },
      sol: R`From $\frac1v - \frac1u = \frac1f$, differentiating gives $-\frac{dv}{v^2} + \frac{du}{u^2} = 0$, so $\frac{dv}{du} = \frac{v^2}{u^2} = m^2$. Here $u = -30$ cm gives $v = 60$ cm and $m = v/u = -2$. The longitudinal magnification is $m^2 = 4$, so the image is $4\times2 = 8$ mm long.`,
      trap: R`Using the lateral magnification (2) for a length along the axis; along the axis it is $m^2$.` },
    { id: 'gop-r4-07', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'spherical surface',
      q: R`A transparent sphere of radius $R$ focuses a parallel paraxial beam exactly on its back surface. Its refractive index is`,
      options: [R`$1.5$`, R`$\sqrt2$`, R`$2$`, R`$2.5$`], answer: 2,
      sol: R`At the first surface, $\frac{n}{v} - \frac{1}{\infty} = \frac{n - 1}{R}$, so the rays head for a point $v = \frac{nR}{n - 1}$ behind the front vertex. The back surface is $2R$ behind it, so $\frac{n}{n - 1} = 2$, i.e. $n = 2$. Then the rays meet on the back surface itself and the second refraction does not move that point.`,
      trap: R`Guessing ordinary glass (1.5); a glass ball focuses about $R/2$ beyond its back surface.` },
    { id: 'gop-r4-08', type: 'msq', level: 5, exams: ['gate'], sub: 'ray matrices', format: 'statements',
      q: R`A paraxial system in air is described by $\begin{pmatrix}y_2\\ \theta_2\end{pmatrix} = \begin{pmatrix}A & B\\ C & D\end{pmatrix}\begin{pmatrix}y_1\\ \theta_1\end{pmatrix}$. Which statements are true?`,
      options: [R`$AD - BC = 1$`, R`If $C = 0$, a parallel beam comes out parallel (the system is afocal)`, R`For two systems in a row, the total matrix is $M_1M_2$, where $M_1$ is the one the light meets first`, R`If $B = 0$, the input and output planes are object and image planes, and $A$ is the lateral magnification`],
      answer: [0, 1, 3],
      sol: R`Every translation and every thin lens has determinant 1 (the start and end media are the same), so the product does too. With $C = 0$, $\theta_2 = D\theta_1$ does not depend on $y_1$: parallel in, parallel out. With $B = 0$, $y_2 = Ay_1$ for every angle $\theta_1$, so all rays from one input point reach one output point: that is imaging, with magnification $A$. Matrices act on the column from the left, so the element met first stands on the right: $M = M_2M_1$.`,
      trap: R`Writing the matrices in the order the light meets them; the first element goes on the right.` },
    { id: 'gop-r4-09', type: 'mcq', level: 2, exams: ['jam'], sub: 'mirrors',
      q: R`Which of the following is NOT true of the image of a real object in a convex mirror?`,
      options: [R`It is real when the object is beyond the centre of curvature`, R`It is erect`, R`It lies behind the mirror, between the pole and the focus`, R`It is smaller than the object`], answer: 0,
      sol: R`A convex mirror spreads light out. With $\frac1v + \frac1u = \frac1f$ and $f > 0$, $u < 0$ (Cartesian), $v = \frac{uf}{u - f}$ is always positive and less than $f$: the image is virtual, behind the mirror, inside the focal length, erect and diminished, wherever the object is.`,
      trap: R`Carrying the concave-mirror rule "beyond C gives a real image" over to a convex mirror.` },
    { id: 'gop-r4-10', type: 'nat', level: 3, exams: ['jam'], sub: 'total internal reflection',
      q: R`A small lamp sits $2.0$ m below the flat surface of a pond ($n = 4/3$). Light leaves the water only through a bright circle on the surface, of radius ______ m (two decimal places).`,
      answer: 2.27, tol: 0.02, unit: 'm', calc: () => 2 / Math.sqrt((4 / 3) ** 2 - 1),
      sol: R`Rays meeting the surface beyond the critical angle $\theta_c$ are totally reflected. $\sin\theta_c = 3/4$, so $\tan\theta_c = \frac{3/4}{\sqrt{1 - 9/16}} = \frac{3}{\sqrt7}$. The circle has radius $r = h\tan\theta_c = 2.0\times\frac{3}{\sqrt7} = 2.27$ m.`,
      trap: R`Using $h\sin\theta_c$ or $h/\tan\theta_c$; draw the right triangle with depth $h$ as the side next to the angle.` },
    { id: 'gop-r4-11', type: 'mcq', level: 3, exams: ['jam'], sub: 'thin lenses',
      q: R`For a thin convex lens of focal length $f$, $1/v$ is plotted against $1/u$ (Cartesian signs, real objects so $u < 0$). The graph is`,
      options: [R`a straight line of slope $-1$ cutting the $1/v$ axis at $1/f$`, R`a straight line of slope $+1$ cutting the $1/v$ axis at $-1/f$`, R`a rectangular hyperbola`, R`a straight line of slope $+1$ cutting the $1/v$ axis at $1/f$`], answer: 3,
      sol: R`The lens formula $\frac1v - \frac1u = \frac1f$ rearranges to $\frac1v = \frac1u + \frac1f$: a straight line of slope $+1$ and intercept $1/f$. (With the "real is positive" convention one writes $\frac1v + \frac1u = \frac1f$ and gets slope $-1$; the question fixes Cartesian signs.) A rectangular hyperbola is the graph of $v$ against $u$.`,
      trap: R`Mixing the sign conventions, or plotting $v$ against $u$ instead of the reciprocals.` },
    { id: 'gop-r4-12', type: 'mcq', level: 3, exams: ['jam'], sub: 'total internal reflection',
      q: R`A right-angled isosceles glass prism is used to turn a beam through $90^\circ$: light enters one short face at normal incidence and must be totally reflected at the long face. The refractive index of the glass must exceed`,
      options: [R`$4/3$`, R`$\sqrt2$`, R`$1.5$`, R`$\sqrt3$`], answer: 1,
      sol: R`Entering normally, the beam does not bend and meets the long face at $45^\circ$. Total reflection needs $45^\circ > \theta_c$, i.e. $\sin\theta_c = 1/n < \sin45^\circ = 1/\sqrt2$, so $n > \sqrt2\approx1.414$. Ordinary glass ($n\approx1.5$) qualifies, which is why binoculars use such prisms.`,
      trap: R`Choosing 1.5 because "glass works"; the condition is the smallest index, $\sqrt2$.` },
  ],
  gens: [
    { id: 'gop-r4g1', type: 'nat', level: 3, exams: ['jam'], sub: 'prisms',
      make(r) {
        const A = int(r, 2, 8), [n, ntex] = choose(r, [[1.5, '1.50'], [1.6, '1.60'], [1.65, '1.65'], [1.72, '1.72']]);
        const [m, mtex, mname] = choose(r, [[4 / 3, '4/3', 'water'], [1.2, '1.20', 'a liquid'], [1.25, '1.25', 'a liquid'], [1.1, '1.10', 'a liquid']]);
        const d = (n / m - 1) * A;
        return { q: `A thin prism of apex angle $${A}^\\circ$ is made of glass with $n = ${ntex}$ and sits in ${mname} of index $${mtex}$. The deviation of a ray passing near minimum deviation is ______ degrees (three decimal places).`,
          answer: round(d, 3), tol: 0.003, unit: 'degrees', A, n, m,
          sol: `For a thin prism $\\delta = (n_{\\rm rel} - 1)A$ with $n_{\\rm rel} = ${ntex}/${mtex} = ${round(n / m, 4)}$. So $\\delta = ${round(n / m - 1, 4)}\\times${A}^\\circ = ${round(d, 3)}^\\circ$ (in air it would be $${round((n - 1) * A, 3)}^\\circ$).`,
          trap: 'Use the ratio of the indices, not their difference.' };
      },
      verify: (p) => (p.n / p.m - 1) * p.A },
    { id: 'gop-r4g2', type: 'nat', level: 4, exams: ['jam'], sub: 'thin lenses',
      make(r) {
        const f = choose(r, [10, 12, 15, 20, 25]), k = choose(r, [1.25, 1.5, 2.5, 3, 4]), L = choose(r, [1, 2, 3, 5]);
        const u = k * f, v = u * f / (u - f), mag = v / u, len = L * mag * mag;
        return { q: `A short wire of length $${L}$ mm lies along the axis of a thin convex lens of focal length $${f}$ cm, centred $${u}$ cm in front of it. Its image along the axis is about ______ mm long (two decimal places).`,
          answer: round(len, 2), tol: Math.max(0.01, round(len * 0.005, 2)), unit: 'mm', f, u, L,
          sol: `The image distance is $v = \\dfrac{uf}{u - f} = ${round(v, 3)}$ cm (real). The lateral magnification has size $|m| = v/u = ${round(mag, 4)}$. Differentiating the lens formula gives the longitudinal magnification $m^2 = ${round(mag * mag, 4)}$, so the image is $${L}\\times${round(mag * mag, 4)} = ${round(len, 2)}$ mm long.`,
          trap: 'Along the axis lengths scale with $m^2$, not $m$.' };
      },
      verify: (p) => { const v = p.u * p.f / (p.u - p.f); return p.L * (v / p.u) ** 2; } },
    { id: 'gop-r4g3', type: 'mcq', level: 2, exams: ['jam'], sub: 'reflection',
      make(r) {
        const a = int(r, 1, 6), b = int(r, 1, 4), toward = r() < 0.5;
        const right = toward ? 2 * (a + b) : 2 * Math.abs(a - b);
        const wrongs = toward ? [a + b, 2 * a + b, 2 * Math.abs(a - b), a + 2 * b, 4 * (a + b)] : [Math.abs(a - b), 2 * (a + b), a + b, 2 * a, 2 * a + 1, a + b + 1];
        const o = mcqOptions(r, right, wrongs, (x) => `$${x}$ m/s`);
        return { q: `A boy runs towards a plane mirror at $${a}$ m/s (ground frame) while the mirror moves at $${b}$ m/s ${toward ? 'towards him' : 'in the same direction as he runs (away from him)'}. The speed at which the gap between the boy and his image changes is`, ...o,
          sol: `The image stands as far behind the mirror as the boy is in front, so the boy-image gap is twice the boy-mirror gap. The boy-mirror gap changes at $${toward ? `${a} + ${b}` : `|${a} - ${b}|`} = ${right / 2}$ m/s, so the gap to the image changes at $${right}$ m/s.`,
          trap: 'The image gap is twice the mirror gap, so its rate is doubled too.' };
      } },
  ],
};
