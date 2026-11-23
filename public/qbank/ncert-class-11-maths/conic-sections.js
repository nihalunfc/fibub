// Class 11 Maths, Chapter 10 Conic Sections: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('cs');
const R = String.raw;
const AB = [[5, 3], [5, 4], [10, 6], [10, 8], [13, 5], [13, 12], [17, 8], [17, 15]];
const HB = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [8, 15], [15, 8]];

export default {
  topic: 'conic-sections', name: 'Conic Sections', n: 10,
  items: [
    m.mcq(1, 'sections', R`<p>A plane cuts a cone parallel to one of its slant lines (generators). The section is a:</p>`, R`parabola`, [R`circle`, R`ellipse`, R`hyperbola`], R`<p>Parallel to a generator gives a parabola. Perpendicular to the axis gives a circle; a tilt steeper than the generator on both nappes gives a hyperbola.</p>`),
    m.mcq(1, 'circle', R`<p>The centre and radius of the circle $x^2 + y^2 = 49$ are:</p>`, R`$(0, 0)$ and $7$`, [R`$(0, 0)$ and $49$`, R`$(7, 7)$ and $7$`, R`$(0, 0)$ and $\sqrt{7}$`], R`<p>$x^2 + y^2 = r^2$ with $r^2 = 49$, so $r = 7$.</p>`, { trap: 'Reading r² as r.' }),
    m.mcq(1, 'parabola', R`<p>The focus of the parabola $y^2 = 12x$ is:</p>`, R`$(3, 0)$`, [R`$(12, 0)$`, R`$(6, 0)$`, R`$(0, 3)$`], R`<p>$4a = 12$ gives $a = 3$; the focus is $(a, 0) = (3, 0)$.</p>`),
    m.mcq(2, 'ellipse', R`<p>The foci of $\dfrac{x^2}{25} + \dfrac{y^2}{9} = 1$ are:</p>`, R`$(\pm 4, 0)$`, [R`$(\pm 5, 0)$`, R`$(\pm 3, 0)$`, R`$(0, \pm 4)$`], R`<p>$c^2 = a^2 - b^2 = 25 - 9 = 16$, so $c = 4$ on the x-axis (the larger denominator is under $x^2$).</p>`),
    m.mcq(2, 'hyperbola', R`<p>The eccentricity of $\dfrac{x^2}{16} - \dfrac{y^2}{9} = 1$ is:</p>`, R`$\dfrac54$`, [R`$\dfrac45$`, R`$\dfrac35$`, R`$\dfrac75$`], R`<p>$c^2 = 16 + 9 = 25$, so $e = c/a = 5/4$.</p>`),
    m.mcq(2, 'circle', R`<p>The circle with centre $(2, -3)$ and radius $4$ is:</p>`, R`$(x-2)^2 + (y+3)^2 = 16$`, [R`$(x+2)^2 + (y-3)^2 = 16$`, R`$(x-2)^2 + (y+3)^2 = 4$`, R`$(x-2)^2 + (y-3)^2 = 16$`], R`<p>$(x - h)^2 + (y - k)^2 = r^2$ with $h = 2$, $k = -3$, $r^2 = 16$.</p>`),
    m.mcq(2, 'parabola', R`<p>The parabola with focus $(0, -3)$ and directrix $y = 3$ has the equation:</p>`, R`$x^2 = -12y$`, [R`$x^2 = 12y$`, R`$y^2 = -12x$`, R`$x^2 = -6y$`], R`<p>It opens downwards with $a = 3$, so $x^2 = -4ay = -12y$.</p>`),
    m.mcq(2, 'ellipse', R`<p>The latus rectum of $\dfrac{x^2}{36} + \dfrac{y^2}{20} = 1$ has length:</p>`, R`$\dfrac{20}{3}$`, [R`$\dfrac{10}{3}$`, R`$\dfrac{40}{6}\cdot 2$`, R`$\dfrac{36}{5}$`], R`<p>$2b^2/a = 2 \times 20 / 6 = 20/3$.</p>`),
    m.mcq(3, 'eccentricity', R`<p>The major axis of an ellipse is twice its minor axis. Its eccentricity is:</p>`, R`$\dfrac{\sqrt3}{2}$`, [R`$\dfrac12$`, R`$\dfrac{1}{\sqrt2}$`, R`$\dfrac{\sqrt3}{3}$`], R`<p>$a = 2b$, so $e = \sqrt{1 - b^2/a^2} = \sqrt{1 - 1/4} = \sqrt3/2$.</p>`),
    m.mcq(3, 'hyperbola', R`<p>A hyperbola has foci $(\pm 5, 0)$ and transverse axis of length 6. Its equation is:</p>`, R`$\dfrac{x^2}{9} - \dfrac{y^2}{16} = 1$`, [R`$\dfrac{x^2}{16} - \dfrac{y^2}{9} = 1$`, R`$\dfrac{x^2}{9} + \dfrac{y^2}{16} = 1$`, R`$\dfrac{x^2}{25} - \dfrac{y^2}{9} = 1$`], R`<p>$2a = 6$ gives $a = 3$; $c = 5$, so $b^2 = c^2 - a^2 = 16$.</p>`, { trap: 'Using c² = a² − b², which is the ellipse rule.' }),
    m.mcq(3, 'circle', R`<p>A circle passes through $(0, 0)$, $(4, 0)$ and $(0, 6)$. Its radius is:</p>`, R`$\sqrt{13}$`, [R`$5$`, R`$\sqrt{10}$`, R`$13$`], R`<p>The right angle at the origin means the hypotenuse from $(4, 0)$ to $(0, 6)$ is a diameter: length $\sqrt{16 + 36} = \sqrt{52}$, so $r = \sqrt{13}$.</p>`),
    m.mcq(2, 'sections', R`<p>A plane perpendicular to the axis of a cone (not through the vertex) gives a:</p>`, R`circle`, [R`parabola`, R`ellipse that is not a circle`, R`pair of lines`], R`<p>Every point of the section is at the same distance from the axis: a circle.</p>`),
    m.ar(2, 'eccentricity', R`A circle can be called an ellipse with eccentricity 0.`, R`In an ellipse $c^2 = a^2 - b^2$, and when $a = b$ we get $c = 0$.`, 0, R`<p>Both true; R shows why $e = c/a = 0$.</p>`),
    m.ar(2, 'parabola', R`Every point of a parabola is equally far from its focus and its directrix.`, R`The eccentricity of a parabola is 1.`, 0, R`<p>Both true. The definition is $PF = e \cdot PD$; with $e = 1$ this is $PF = PD$.</p>`),
    m.ar(3, 'hyperbola', R`The foci of $\dfrac{x^2}{9} - \dfrac{y^2}{16} = 1$ are $(\pm 5, 0)$.`, R`For a hyperbola $c^2 = a^2 + b^2$.`, 0, R`<p>$c^2 = 9 + 16 = 25$. Both true and R explains A.</p>`),
    m.ar(3, 'parabola', R`The latus rectum of $y^2 = 4ax$ has length $2a$.`, R`The latus rectum is the chord through the focus perpendicular to the axis.`, 3, R`<p>A is false: at $x = a$, $y = \pm 2a$ so the length is $4a$. R is true.</p>`),
    m.nat(2, 'circle', R`<p>Find the radius of the circle $x^2 + y^2 - 6x + 8y = 0$.</p>`, () => 5, 0, R`<p>$g = -3$, $f = 4$, $c = 0$: $r = \sqrt{9 + 16} = 5$.</p>`),
    m.nat(1, 'parabola', R`<p>Find the distance of the focus of $y^2 = 20x$ from the vertex.</p>`, () => 5, 0, R`<p>$4a = 20$, so $a = 5$.</p>`),
    m.nat(2, 'ellipse', R`<p>Find the distance between the foci of $9x^2 + 25y^2 = 225$.</p>`, () => 8, 0, R`<p>Divide by 225: $x^2/25 + y^2/9 = 1$. $c = \sqrt{25 - 9} = 4$, so $2c = 8$.</p>`),
    m.nat(3, 'eccentricity', R`<p>Find the eccentricity of $\dfrac{x^2}{169} + \dfrac{y^2}{144} = 1$ (4 decimal places).</p>`, () => 5 / 13, 0.001, R`<p>$c = \sqrt{169 - 144} = 5$, $e = 5/13 = 0.3846$.</p>`),
    m.nat(3, 'hyperbola', R`<p>Find the length of the latus rectum of $\dfrac{x^2}{16} - \dfrac{y^2}{9} = 1$.</p>`, () => 4.5, 0.001, R`<p>$2b^2/a = 2 \times 9 / 4 = 4.5$.</p>`),
    m.msq(3, 'parabola', R`<p>For the parabola $y^2 = 8x$, which statements are true? (Choose all that apply.)</p>`, [R`The focus is $(2, 0)$`, R`The directrix is $x = 2$`, R`The latus rectum has length 8`, R`The eccentricity is 1`], [0, 2, 3], R`<p>$a = 2$: focus $(2, 0)$, directrix $x = -2$, latus rectum $4a = 8$, $e = 1$. The directrix is $x = -2$, so the second is false.</p>`),
    m.msq(2, 'eccentricity', R`<p>Which of these conics have eccentricity less than 1? (Choose all that apply.)</p>`, [R`circle`, R`ellipse`, R`parabola`, R`hyperbola`], [0, 1], R`<p>Circle $e = 0$, ellipse $0 < e < 1$, parabola $e = 1$, hyperbola $e > 1$.</p>`),
  ],
  gens: [
    { id: 'cs-g01', type: 'nat', level: 2, exams: ['board'], sub: 'parabola',
      make(rng) { const a = pick(rng, 1, 6), x0 = pick(rng, 1, 9); return { a, x0, q: `<p>A point P of the parabola $y^2 = ${4 * a}x$ has x-coordinate ${x0}. Find its distance from the focus.</p>`, answer: x0 + a, tol: 0.01, sol: `<p>$PF = PD = x + a = ${x0} + ${a} = ${x0 + a}$.</p>` }; },
      verify: (p) => Math.hypot(p.x0 - p.a, Math.sqrt(4 * p.a * p.x0)) },
    { id: 'cs-g02', type: 'nat', level: 2, exams: ['board'], sub: 'ellipse',
      make(rng) { const [a, b] = choose(rng, AB), c = Math.sqrt(a * a - b * b); return { a, b, q: `<p>Find the eccentricity of $\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1$ (3 decimal places).</p>`, answer: c / a, tol: 0.002, sol: `<p>$c = \\sqrt{${a * a} - ${b * b}} = ${+c.toFixed(3)}$, $e = c/a = ${(c / a).toFixed(3)}$.</p>` }; },
      verify: (p) => Math.sqrt(1 - (p.b / p.a) ** 2) },
    { id: 'cs-g03', type: 'nat', level: 2, exams: ['board'], sub: 'hyperbola',
      make(rng) { const [a, b] = choose(rng, HB), c = Math.hypot(a, b); return { a, b, q: `<p>Find the distance between the foci of $\\dfrac{x^2}{${a * a}} - \\dfrac{y^2}{${b * b}} = 1$ (2 decimal places).</p>`, answer: 2 * c, tol: 0.01, sol: `<p>$c^2 = ${a * a} + ${b * b}$, so $2c = ${(2 * c).toFixed(2)}$.</p>` }; },
      verify: (p) => (2 * p.a) / Math.cos(Math.atan(p.b / p.a)) },
    { id: 'cs-g04', type: 'nat', level: 3, exams: ['board'], sub: 'circle',
      make(rng) { const h = pick(rng, -6, 6), k = pick(rng, -6, 6), Rr = pick(rng, 2, 9), c = h * h + k * k - Rr * Rr; return { g: -h, f: -k, c, q: `<p>Find the radius of the circle $x^2 + y^2 ${(-2 * h) < 0 ? '-' : '+'} ${Math.abs(2 * h)}x ${(-2 * k) < 0 ? '-' : '+'} ${Math.abs(2 * k)}y ${c < 0 ? '-' : '+'} ${Math.abs(c)} = 0$.</p>`, answer: Rr, tol: 0.01, sol: `<p>$r^2 = g^2 + f^2 - c = ${h * h} + ${k * k} - (${c}) = ${Rr * Rr}$, so $r = ${Rr}$.</p>` }; },
      verify: (p) => Math.sqrt((2 * p.f) ** 2 - 4 * (p.c - p.g * p.g)) / 2 },
    { id: 'cs-g05', type: 'nat', level: 2, exams: ['board'], sub: 'parabola',
      make(rng) { const a = pick(rng, 1, 9) / 2; return { a, q: `<p>Find the length of the latus rectum of $x^2 = ${4 * a}y$.</p>`, answer: 4 * a, tol: 0.01, sol: `<p>$4a = ${4 * a}$.</p>` }; },
      verify: (p) => 2 * Math.sqrt(4 * p.a * p.a) },
    { id: 'cs-g06', type: 'nat', level: 3, exams: ['board'], sub: 'ellipse',
      make(rng) { const [a, b] = choose(rng, AB); return { a, b, q: `<p>Find the length of the latus rectum of $\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1$ (2 decimal places).</p>`, answer: (2 * b * b) / a, tol: 0.01, sol: `<p>$2b^2/a = 2 \\times ${b * b} / ${a} = ${((2 * b * b) / a).toFixed(2)}$.</p>` }; },
      verify: (p) => { const c = Math.sqrt(p.a * p.a - p.b * p.b); return 2 * p.b * Math.sqrt(1 - (c / p.a) ** 2); } },
  ],
};
