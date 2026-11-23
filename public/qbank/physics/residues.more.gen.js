// Extra question shapes for residues (templates res-m31..m35). Imported by residues.js.
import { int, choose, mcqOptions, shuffle } from '../_util.js';
import { msqOf, terms, frac } from './_more.js';
import { matchOne } from './_odd.js';

export default [
  { id: 'res-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'computing residues', format: 'statements',
    make(r) {
      const k = int(r, 2, 4), a = int(r, 2, 5), not = r() < 0.5;
      const m = msqOf(r, [
        [`the residue of $f'/f$ at a zero of $f$ of order ${k} is ${k}`, true, `Near the zero $f = (z - z_0)^{${k}}g$ with $g(z_0) \\ne 0$, so $f'/f = \\tfrac{${k}}{z - z_0} + g'/g$.`],
        [`the residue of $f'/f$ at a pole of $f$ of order ${k} is $-${k}$`, true, `Now $f = (z - z_0)^{-${k}}g$, so $f'/f = \\tfrac{-${k}}{z - z_0} + g'/g$.`],
        [`the residue of $f'/f$ at a pole of $f$ of order ${k} is ${k}`, false, `The sign is negative: $-${k}$.`],
        ['the residue at a removable singularity is 0', true, 'The Laurent series has no negative powers at all.'],
        ['the residue of an even function at $z = 0$ is 0', true, 'Its Laurent series about 0 contains only even powers, so no $z^{-1}$ term.'],
        ['the residue of $g\'$ at an isolated singularity of $g$ is 0', true, 'Differentiating a Laurent series term by term never produces a $z^{-1}$ term.'],
        [`$\\text{Res}_{z=0}\\,z^{-${k}} = 1$`, false, `The only term is $z^{-${k}}$, not $z^{-1}$, so the residue is 0.`],
        [`$\\text{Res}_{z=0}\\,e^{${a}/z} = ${a}$`, true, `$e^{${a}/z} = 1 + \\tfrac{${a}}{z} + \\tfrac{${a * a}}{2z^2} + \\dots$`],
        [`$\\text{Res}_{z=0}\\,e^{${a}/z} = 0$ because $e^{w}$ is entire`, false, `The singularity at 0 is essential; the $1/z$ coefficient is ${a}.`],
        ['for a function with finitely many singularities, the residues at the finite points plus the residue at infinity add up to zero', true, 'A very large circle can be read either as enclosing every finite singularity or as a small loop round $\\infty$ in the opposite sense.'],
      ], { not });
      return { q: `Which of the following statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The residue is only the coefficient of $(z - z_0)^{-1}$; other negative powers contribute nothing to a contour integral.' };
    } },
  { id: 'res-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'argument principle',
    make(r) {
      const pts = shuffle(r, [-4, -3, -2, -1, 0, 1, 2, 3, 4]);
      const [a, b, c] = pts, p = int(r, 1, 3), q = int(r, 1, 3), s = int(r, 1, 3), R = int(r, 0, 3) + 0.5;
      const ins = (x) => Math.abs(x) < R;
      const N = (ins(a) ? p : 0) + (ins(b) ? q : 0) - (ins(c) ? s : 0);
      const zf = (x, e) => `${x === 0 ? 'z' : `(z ${x < 0 ? '+' : '-'} ${Math.abs(x)})`}${e === 1 ? '' : `^{${e}}`}`;
      const o = mcqOptions(r, N, shuffle(r, [p + q - s, N + 2 * (ins(c) ? s : 0), -N, (ins(a) ? p : 0) + (ins(b) ? q : 0), p + q + s, N + 1, N - 1]));
      return { q: `For $f(z) = \\dfrac{${zf(a, p)}${zf(b, q)}}{${zf(c, s)}}$, the value of $\\displaystyle\\frac{1}{2\\pi i}\\oint_{|z| = ${R}}\\frac{f'(z)}{f(z)}\\,dz$ (anticlockwise) is`, ...o,
        sol: `By the argument principle the integral counts zeros minus poles inside the contour, each with its multiplicity. Inside $|z| \\lt ${R}$: zero at ${a} of order ${p} (${ins(a) ? 'inside' : 'outside'}), zero at ${b} of order ${q} (${ins(b) ? 'inside' : 'outside'}), pole at ${c} of order ${s} (${ins(c) ? 'inside' : 'outside'}). So the value is ${N}.`,
        trap: 'Poles count negatively, and only points inside the contour count.' };
    } },
  { id: 'res-m33', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Fourier-type integrals', format: 'graph in words',
    make(r) {
      const a = int(r, 1, 4), ak = a === 1 ? '|k|' : `${a}|k|`;
      const L = {
        cusp: `real and even in $k$, with a kink (cusp) at $k = 0$, where it peaks, and decaying as $e^{-${ak}}$`,
        odd: 'purely imaginary and odd in $k$, jumping at $k = 0$, and decaying exponentially',
        smooth: `real and even in $k$, smooth (no kink) at $k = 0$, decaying as $|k|e^{-${ak}}$ for large $|k|$`,
        gauss: 'a Gaussian in $k$',
        flat: 'independent of $k$',
      };
      const cas = choose(r, [
        [`\\dfrac{1}{x^2 + ${a * a}}`, 'cusp', `For $k \\gt 0$ close in the upper half-plane: $I = 2\\pi i\\cdot\\dfrac{e^{-${a}k}}{2\\cdot${a}i} = \\dfrac{\\pi}{${a}}e^{-${a}k}$; for $k \\lt 0$ close below. So $I(k) = \\dfrac{\\pi}{${a}}e^{-${a}|k|}$, whose slope jumps from $+\\pi$ to $-\\pi$ at $k = 0$.`],
        [`\\dfrac{x}{x^2 + ${a * a}}`, 'odd', `For $k \\gt 0$: $2\\pi i\\cdot\\dfrac{${a}i\\,e^{-${a}k}}{2\\cdot${a}i} = i\\pi e^{-${a}k}$; for $k \\lt 0$ closing below gives $-i\\pi e^{${a}k}$. So $I(k) = i\\pi\\,\\text{sgn}(k)\\,e^{-${a}|k|}$, which jumps by $2\\pi i$ at $k = 0$ (the integrand decays only like $1/x$).`],
        [`\\dfrac{1}{(x^2 + ${a * a})^2}`, 'smooth', `The double pole at $${a}i$ gives $I(k) = \\dfrac{\\pi}{2\\cdot${a}^3}(1 + ${a}|k|)e^{-${a}|k|}$. Its slope at $0^+$ is $\\propto -${a}^2k \\to 0$, so there is no kink: the faster decay of the integrand ($1/x^4$) makes the transform smoother.`],
      ]);
      return { q: `For real $k$, consider $I(k) = \\displaystyle\\int_{-\\infty}^{\\infty}e^{ikx}\\,${cas[0]}\\,dx$. As a function of $k$, $I(k)$ is`, ...matchOne(r, L, cas),
        trap: 'A slowly decaying integrand gives a transform with a jump or kink at $k = 0$; faster decay gives a smoother transform.' };
    } },
  { id: 'res-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'residue at infinity',
    make(r) {
      const al = int(r, 1, 4), be = int(r, 2, 5), m = int(r, 1, 3), c = int(r, 1, 6), d = int(r, -3, 3), e = int(r, 1, 5), two = r() < 0.35;
      const P = terms([[al, m === 1 ? 'z' : `z^{${m}}`], [c, '']]);
      const Q = terms([[be, `z^{${two ? m + 2 : m + 1}}`], [d, 'z'], [e, '']]);
      const val = two ? '0' : `${frac(al, be) === '1' ? '' : frac(al, be)}\\cdot 2\\pi i`;
      const w = [`${frac(be, al)}\\cdot 2\\pi i`, `${frac(al * (m + 1), be)}\\cdot 2\\pi i`, '2\\pi i', '0', `${frac(al, be)}\\cdot 2\\pi i`, `${frac(2 * al, be)}\\cdot 2\\pi i`, `${frac(-al, be)}\\cdot 2\\pi i`, `${frac(al, be)}\\cdot \\pi i`].map((x) => x.replace(/^1\\cdot /, '').replace(/^-1\\cdot /, '-'));
      const o = mcqOptions(r, `$${val}$`, shuffle(r, w.map((x) => `$${x}$`)));
      return { q: `$R$ is large enough that every zero of the denominator lies inside $|z| = R$. Then $\\displaystyle\\oint_{|z| = R}\\frac{${P}}{${Q}}\\,dz$ (anticlockwise) equals`, ...o,
        sol: two
          ? `The degree of the denominator exceeds that of the numerator by 2, so the integrand falls like $1/R^2$ while the length of the circle grows like $R$: the integral tends to 0 as $R \\to \\infty$. Since it does not depend on $R$ once every pole is inside, it is exactly 0 (the residues add up to zero).`
          : `Instead of finding the ${m + 1} poles, use the behaviour at large $|z|$: the integrand is $\\dfrac{${al}z^{${m}} + \\dots}{${be}z^{${m + 1}} + \\dots} = \\dfrac{${frac(al, be)}}{z} + O(z^{-2})$. The integral round a large circle is $2\\pi i$ times the coefficient of $1/z$ (minus the residue at infinity), so it equals $${val}$.`,
        trap: 'You do not need the individual poles: the large-$|z|$ behaviour gives the sum of all the residues at once.' };
    } },
  { id: 'res-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'choosing a contour', format: 'match',
    make(r) {
      const a = int(r, 2, 5), n = choose(r, [3, 5]), k = int(r, 1, 4), s = int(r, 2, 4);
      const L = {
        unit: 'put $z = e^{i\\theta}$ and integrate round the unit circle',
        semi: 'close with a large semicircle, whose arc gives nothing because the integrand falls at least as fast as $1/|z|^2$',
        jordan: 'replace the cosine by $e^{ikz}$ and close in the upper half-plane (Jordan\'s lemma kills the arc)',
        key: 'use a keyhole contour round a branch cut along the positive real axis',
        wedge: `use a wedge (pie-slice) contour of opening angle $2\\pi/${n}$`,
        indent: 'use $e^{ikz}/z$ with a small semicircle round $z = 0$ (principal value)',
      };
      const cas = choose(r, [
        [`\\int_0^{2\\pi}\\frac{d\\theta}{${a} + \\cos\\theta}`, 'unit', 'With $z = e^{i\\theta}$, $\\cos\\theta = (z + 1/z)/2$ and $d\\theta = dz/(iz)$; the integrand becomes rational in $z$.'],
        [`\\int_{-\\infty}^{\\infty}\\frac{dx}{x^4 + ${a * a}}`, 'semi', 'A rational integrand whose denominator is 4 degrees higher: the arc contribution vanishes and only the upper half-plane poles count.'],
        [`\\int_{-\\infty}^{\\infty}\\frac{\\cos ${k}x}{x^2 + ${a * a}}\\,dx`, 'jordan', `$\\cos ${k}z$ grows in both half-planes, so use $\\text{Re}\\,e^{i${k}z}$, which decays in the upper half-plane.`],
        [`\\int_0^{\\infty}\\frac{x^{-1/${s}}}{1 + x}\\,dx`, 'key', `$z^{-1/${s}}$ is multivalued; its values just above and below the cut differ by $e^{-2\\pi i/${s}}$, which is what the keyhole uses.`],
        [`\\int_0^{\\infty}\\frac{dx}{1 + x^{${n}}}`, 'wedge', `Rotating by $2\\pi/${n}$ leaves $z^{${n}}$ unchanged, so the two straight sides of the wedge give multiples of the same integral, with one pole $e^{i\\pi/${n}}$ inside. (With ${n} odd the integrand is not even, so a semicircle does not help.)`],
        [`\\int_{-\\infty}^{\\infty}\\frac{\\sin ${k}x}{x}\\,dx`, 'indent', '$\\sin kx/x$ is fine at 0, but $e^{ikz}/z$ has a pole there, so the contour detours round it on a small semicircle.'],
      ]);
      return { q: `Which is the natural contour method for $\\displaystyle ${cas[0]}$?`, ...matchOne(r, L, cas),
        trap: 'Match the contour to the integrand: trigonometric over a full period, rational, oscillatory, multivalued or rotationally symmetric.' };
    } },
];
