// Extra question shapes for differential-equations (templates de-t21..t26). Imported by differential-equations.js.
import { int, choose, mcqOptions, round, shuffle } from '../_util.js';
import { msqOf, terms } from './_more.js';

const ex = (k, v = 'x') => (k === 0 ? '1' : `e^{${k === 1 ? '' : k === -1 ? '-' : k}${v}}`);

export default [
  { id: 'de-t21', type: 'mcq', level: 1, exams: ['jam'], sub: 'order and degree',
    make(r) {
      const k = int(r, 1, 3), p = int(r, 1, 3), a = int(r, 2, 5);
      const extra = r() < 0.5 ? null : choose(r, [['y^2', 'the term $y^2$'], ['y\\dfrac{dy}{dx}', 'the product $y\\,dy/dx$'], ['\\sin y', 'the term $\\sin y$']]);
      const lin = p === 1 && !extra;
      const top = k === 1 ? '\\dfrac{dy}{dx}' : `\\dfrac{d^{${k}}y}{dx^{${k}}}`;
      const lead = p === 1 ? top : `\\left(${top}\\right)^{${p}}`;
      const low = k === 1 ? `${a}xy` : `${a}x\\dfrac{dy}{dx}`;
      const eq = `${lead} + ${low}${extra ? ` + ${extra[0]}` : ''} = \\cos x`;
      const show = (o, d, l) => `order ${o}, degree ${d}, ${l ? 'linear' : 'non-linear'}`;
      const right = show(k, p, lin);
      const o = mcqOptions(r, right, shuffle(r, [show(p, k, lin), show(k, p, !lin), show(p, k, !lin), show(k, k === p ? p + 1 : k, lin), show(k + 1, p, lin)]));
      return { q: `The differential equation $$${eq}$$ is of`, ...o,
        sol: `The highest derivative is $${top}$, so the order is ${k}. It appears to the power ${p} and the equation is a polynomial in the derivatives, so the degree is ${p}. ${lin ? 'The unknown $y$ and its derivatives appear only to the first power and are not multiplied together, so it is linear (the $x$ in a coefficient is allowed).' : `It is non-linear because ${p > 1 ? `the highest derivative is raised to the power ${p}` : ''}${p > 1 && extra ? ' and ' : ''}${extra ? `${extra[1]} is not first-degree in $y$` : ''}.`}`,
        trap: 'Order is the highest derivative; degree is the power it is raised to. A coefficient like $x$ does not spoil linearity.' };
    } },
  { id: 'de-t22', type: 'msq', level: 3, exams: ['jam'], sub: 'constant coefficients',
    make(r) {
      let b, c;
      if (r() < 0.2) { const s = choose(r, [-2, -1, 1, 2, 3]); b = 2 * s; c = s * s; }
      else { b = int(r, -4, 6); c = choose(r, [-4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 8, 9]); }
      const disc = b * b - 4 * c;
      const re = disc >= 0 ? [(-b + Math.sqrt(disc)) / 2, (-b - Math.sqrt(disc)) / 2] : [-b / 2, -b / 2];
      const maxRe = Math.max(...re);
      const grows = maxRe > 0 || (disc === 0 && re[0] === 0);
      const roots = disc > 0 ? `$m = ${round(re[0], 3)}$ and $m = ${round(re[1], 3)}$` : disc === 0 ? `the repeated root $m = ${re[0]}$` : `$m = ${round(-b / 2, 3)}\\pm ${round(Math.sqrt(-disc) / 2, 3)}i$`;
      const why = `The characteristic equation $m^2 ${b < 0 ? '-' : '+'} ${Math.abs(b)}m ${c < 0 ? '-' : '+'} ${Math.abs(c)} = 0$ has discriminant $${disc}$ and ${roots}.`;
      const cands = [
        ['Every solution oscillates (crosses zero infinitely often)', disc < 0, `${why} ${disc < 0 ? 'Complex roots give $e^{\\alpha x}\\cos(\\beta x + \\phi)$.' : 'Real roots give exponentials, which cross zero at most once.'}`],
        ['Every solution tends to zero as $x\\to\\infty$', maxRe < 0, `${why} All solutions decay exactly when every root has negative real part.`],
        ['Some solution grows without bound as $x\\to\\infty$', grows, `${why} A root with positive real part gives a growing solution.`],
        ['The characteristic roots are real and distinct', disc > 0, why],
        ['The characteristic roots are equal', disc === 0, why],
        [`The sum of the characteristic roots is $${-b}$`, true, `The roots of $m^2 + bm + c = 0$ add up to $-b = ${-b}$.`],
      ];
      if (b !== 0) cands.push([`The sum of the characteristic roots is $${b}$`, false, `The roots add up to $-b = ${-b}$, not $b$.`]);
      const m = msqOf(r, cands);
      return { q: `Consider $y'' ${b < 0 ? '-' : '+'} ${Math.abs(b)}y' ${c < 0 ? '-' : '+'} ${Math.abs(c)}y = 0$. Which of the following statements are correct?`.replace('+ 0y\'', '').replace('  ', ' '), ...m,
        trap: 'Decay needs the real parts negative; oscillation needs complex roots. They are separate questions.' };
    } },
  { id: 'de-t23', type: 'nat', level: 2, exams: ['jam'], sub: 'constant coefficients', format: 'reverse',
    make(r) {
      const r1 = int(r, -4, 4); let r2 = int(r, -4, 3); if (r2 >= r1) r2 += 1;
      const askP = r() < 0.5, pp = -(r1 + r2) + 0, qq = r1 * r2 + 0;
      return { q: `The functions $y = ${ex(r1)}$ and $y = ${ex(r2)}$ both solve $y'' + p\\,y' + q\\,y = 0$. The value of $${askP ? 'p' : 'q'}$ is ______.`,
        answer: askP ? pp : qq, tol: 0, r1, r2, askP,
        sol: `$e^{mx}$ solves the equation when $m^2 + pm + q = 0$, so $${r1}$ and $${r2}$ are the roots: $m^2 + pm + q = (m - (${r1}))(m - (${r2}))$. Hence $p = -(${r1} + (${r2})) = ${pp}$ and $q = (${r1})(${r2}) = ${qq}$.`,
        trap: 'The sign of $p$: the roots add up to $-p$, not $p$.' };
    },
    verify: (p) => { const P = -(p.r1 * p.r1 - p.r2 * p.r2) / (p.r1 - p.r2); return (p.askP ? P : -p.r1 * p.r1 - P * p.r1) + 0; } },
  { id: 'de-t24', type: 'nat', level: 3, exams: ['jam'], sub: 'wronskian',
    make(r) {
      const kind = int(r, 0, 3);
      let f, g, x0, v, sol, fs, gs;
      if (kind === 0) {
        const a = int(r, -2, 2); let b = int(r, -2, 1); if (b >= a) b += 1; x0 = choose(r, [0, 0.5, 1]);
        fs = ex(a); gs = ex(b); v = (b - a) * Math.exp((a + b) * x0); f = { kind, a, b };
        sol = `For $f = e^{ax}$, $g = e^{bx}$: $W = e^{ax}\\cdot be^{bx} - ae^{ax}\\cdot e^{bx} = (b - a)e^{(a+b)x}$. Here $a = ${a}$, $b = ${b}$, so $W = ${b - a}e^{${a + b}x}$. At $x = ${x0}$: $${b - a}e^{${round((a + b) * x0, 4)}} = ${round(v, 4)}$.`;
      } else if (kind === 1) {
        const k = int(r, 1, 5); x0 = choose(r, [0, 0.3, 1, 2]);
        fs = `\\cos ${k === 1 ? '' : k}x`; gs = `\\sin ${k === 1 ? '' : k}x`; v = k; f = { kind, k };
        sol = `$W = \\cos ${k}x\\cdot ${k}\\cos ${k}x - (-${k}\\sin ${k}x)\\sin ${k}x = ${k}(\\cos^2 + \\sin^2) = ${k}$, the same at every $x$, including $x = ${x0}$.`;
      } else if (kind === 2) {
        const m = int(r, 1, 4); let n = int(r, 1, 3); if (n >= m) n += 1; x0 = int(r, 1, 3);
        fs = m === 1 ? 'x' : `x^{${m}}`; gs = n === 1 ? 'x' : `x^{${n}}`; v = (n - m) * x0 ** (m + n - 1); f = { kind, m, n };
        sol = `$W = x^{${m}}\\cdot ${n}x^{${n - 1}} - ${m}x^{${m - 1}}\\cdot x^{${n}} = (${n} - ${m})x^{${m + n - 1}}$. At $x = ${x0}$: $${n - m}\\times${x0}^{${m + n - 1}} = ${v}$.`;
      } else {
        const a = choose(r, [-1, -0.5, 0.5, 1]); x0 = choose(r, [0, 0.5, 1]);
        fs = `e^{${a}x}`; gs = `xe^{${a}x}`; v = Math.exp(2 * a * x0); f = { kind, a };
        sol = `$g' = e^{${a}x} + ${a}xe^{${a}x}$. $W = e^{${a}x}(e^{${a}x} + ${a}xe^{${a}x}) - ${a}e^{${a}x}\\cdot xe^{${a}x} = e^{${2 * a}x}$. At $x = ${x0}$: $${round(v, 4)}$.`;
      }
      return { q: `The Wronskian $W = fg' - f'g$ of $f = ${fs}$ and $g = ${gs}$, evaluated at $x = ${x0}$, is ______ (to four decimal places).`,
        answer: round(v, 4), tol: Math.max(0.0005, round(Math.abs(v) * 0.001, 4)), f, x0, sol,
        trap: kind === 1 ? 'The Wronskian of $\\cos kx$ and $\\sin kx$ does not depend on $x$.' : 'Keep the order $fg\' - f\'g$: swapping gives the opposite sign.' };
    },
    verify: (p) => {
      const F = p.f, fn = F.kind === 0 ? [(x) => Math.exp(F.a * x), (x) => Math.exp(F.b * x)] : F.kind === 1 ? [(x) => Math.cos(F.k * x), (x) => Math.sin(F.k * x)] : F.kind === 2 ? [(x) => x ** F.m, (x) => x ** F.n] : [(x) => Math.exp(F.a * x), (x) => x * Math.exp(F.a * x)];
      const h = 1e-5, d = (u) => (u(p.x0 + h) - u(p.x0 - h)) / (2 * h);
      return fn[0](p.x0) * d(fn[1]) - d(fn[0]) * fn[1](p.x0);
    } },
  { id: 'de-t25', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'forced equations',
    make(r) {
      if (r() < 0.5) {
        const w0 = int(r, 1, 4), res = r() < 0.5, w = res ? w0 : choose(r, [1, 2, 3, 4, 5].filter((x) => x !== w0));
        const W = w === 1 ? '' : w, c = `\\cos ${W}x`, s = `\\sin ${W}x`;
        const right = res ? `$x(A${c} + B${s})$` : `$A${c} + B${s}$`;
        const o = mcqOptions(r, right, [res ? `$A${c} + B${s}$` : `$x(A${c} + B${s})$`, `$A${c}$`, `$Ax${c}$`, `$Ae^{${W}x}$`]);
        return { q: `For $y'' + ${w0 === 1 ? '' : w0 * w0}y = 3\\cos ${W}x$, the right trial form for a particular solution is`, ...o,
          sol: `The homogeneous solutions are $\\cos ${w0 === 1 ? '' : w0}x$ and $\\sin ${w0 === 1 ? '' : w0}x$. ${res ? `The forcing has the same frequency, so $A\\cos + B\\sin$ would solve the homogeneous equation and give zero; multiply by $x$ (resonance): $x(A${c} + B${s})$.` : `The forcing frequency ${w} differs from ${w0}, so $A${c} + B${s}$ works (the sine term is needed in general, though here $B$ turns out to be $0$ because there is no $y'$ term).`}`,
          trap: 'At resonance the ordinary trial form is itself a homogeneous solution, so it must be multiplied by $x$.' };
      }
      const a = int(r, -3, 3), dbl = r() < 0.3; let b = dbl ? a : int(r, -3, 2); if (!dbl && b >= a) b += 1;
      const k = choose(r, dbl ? [a, a, a + 1] : [a, b, a + b === 0 ? 1 : a + b === a || a + b === b ? 4 : a + b]);
      const mult = (k === a ? 1 : 0) + (k === b ? 1 : 0);
      const E = ex(k), E2 = k === 0 ? '' : E;
      const forms = [`$A${E2}$`, `$Ax${E2}$`, `$Ax^2${E2}$`, `$A${E2} + Bx$`];
      const o = mcqOptions(r, forms[mult], forms.filter((_, i) => i !== mult));
      return { q: `For $${terms([[1, "y''"], [-(a + b), "y'"], [a * b, 'y']])} = ${E === '1' ? '5' : `5${E}`}$, the right trial form for a particular solution is`, ...o,
        sol: `The characteristic equation $${terms([[1, 'm^2'], [-(a + b), 'm'], [a * b, '']])} = 0$ has roots $${a}$ and $${b}$. The forcing is $${E === '1' ? 'e^{0x}' : E}$ with exponent $${k}$, which is ${mult === 0 ? 'not a root, so $A' + E2 + '$ works.' : mult === 1 ? 'a simple root, so multiply by $x$ once: $Ax' + E2 + '$.' : 'a double root, so multiply by $x^2$: $Ax^2' + E2 + '$.'}`,
        trap: 'Multiply by $x$ once for each time the exponent is a root of the characteristic equation.' };
    } },
  { id: 'de-t26', type: 'msq', level: 2, exams: ['jam'], sub: 'linearity',
    make(r) {
      const a = int(r, 2, 5);
      const lin = r() < 0.5;
      const L = [
        [`$y' + ${a}xy = \\sin x$`, true, true, `It has the form $y' + P(x)y = Q(x)$; not separable because of the $\\sin x$ term: $y' = \\sin x - ${a}xy$ does not factor.`],
        ["$y' + y^2 = x$", false, false, 'The $y^2$ makes it non-linear, and $x - y^2$ does not factor into $f(x)g(y)$.'],
        [`$xy' - y = x^{${a}}$`, true, false, `Divide by $x$: $y' - y/x = x^{${a - 1}}$, linear. $y' = y/x + x^{${a - 1}}$ does not factor.`],
        ["$y' = e^{x+y}$", false, true, '$e^{x+y} = e^xe^y$: separable, but non-linear in $y$.'],
        [`$y' = ${a}xy^2$`, false, true, `$dy/y^2 = ${a}x\\,dx$: separable; the $y^2$ makes it non-linear.`],
        ["$y' = (1 + y^2)/(1 + x^2)$", false, true, 'Separable: $dy/(1+y^2) = dx/(1+x^2)$; non-linear in $y$.'],
        [`$y' = (x^2 + ${a})y$`, true, true, `Linear (form $y' + P(x)y = 0$) and separable: $dy/y = (x^2 + ${a})dx$.`],
        ["$y' = x + y$", true, false, 'Linear ($y\' - y = x$), but $x + y$ is not a product $f(x)g(y)$.'],
        ["$y' = \\sin(xy)$", false, false, 'Neither: $\\sin(xy)$ is non-linear in $y$ and does not split into $f(x)g(y)$.'],
      ];
      const not = r() < 0.35;
      const cands = L.map(([s, isL, isS, why]) => [s, lin ? isL : isS, why]);
      const m = msqOf(r, cands, { not });
      const word = lin ? 'linear first-order equations' : 'separable equations';
      return { q: `Which of the following are ${not ? '<b>NOT</b> ' : ''}${word}?`, ...m,
        sol: m.sol.replace('statements that are true', `equations that are ${word.split(' ')[0]} (marked true)`).replace('statements that are false', `equations that are not ${word.split(' ')[0]} (marked false)`),
        trap: 'Linear and separable are different properties: an equation can be one, both or neither.' };
    } },
];
