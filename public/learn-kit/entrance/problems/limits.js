// Live problems for Limits.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const sg = (v) => String(v).replace('-', '−');
const pm = (v, t) => `${v < 0 ? ' − ' : ' + '}${Math.abs(v)}${t}`;

export default {
  'lim-std': {
    title: 'a limit from the standard limits',
    make(r) {
      const kind = Math.floor(r() * 3), a = pick(r, 2, 9), b = pick(r, 2, 9);
      const forms = [`sin ${a}x / sin ${b}x`, `(e<sup>${a}x</sup> − 1) / ${b}x`, `tan ${a}x / ln(1 + ${b}x)`];
      const answer = a / b;
      return { kind, a, b,
        q: `<p>Find the limit as x → 0 of ${forms[kind]}.</p>`,
        answer, unit: '', tol: 0.002,
        hint: 'Make each piece look like a standard limit: sin(kx)/(kx) → 1, (e^(kx) − 1)/(kx) → 1, tan(kx)/(kx) → 1, ln(1 + kx)/(kx) → 1. Multiply and divide by the missing kx.',
        solution: steps(kind === 0 ? `Write it as [sin ${a}x/(${a}x)] ÷ [sin ${b}x/(${b}x)] × (${a}x)/(${b}x).` : kind === 1 ? `Write it as [(e<sup>${a}x</sup> − 1)/(${a}x)] × ${a}x/(${b}x).` : `Write it as [tan ${a}x/(${a}x)] ÷ [ln(1 + ${b}x)/(${b}x)] × (${a}x)/(${b}x).`, 'Each bracket tends to 1.', `So the limit is ${a}/${b} = <b>${n(answer, 4)}</b>.`) };
    },
    verify: (x) => { const t = 1e-6, f = [() => Math.sin(x.a * t) / Math.sin(x.b * t), () => Math.expm1(x.a * t) / (x.b * t), () => Math.tan(x.a * t) / Math.log1p(x.b * t)][x.kind]; return f(); },
  },
  'lim-inf': {
    title: 'limit at infinity of a rational function',
    make(r) {
      const p = pick(r, 1, 9), q2 = pick(r, 1, 9), c1 = pick(r, -9, 9), c2 = pick(r, -9, 9), d1 = pick(r, -9, 9), d2 = pick(r, -9, 9);
      const answer = p / q2;
      const poly = (A, B, C) => `${A}x²${B ? (B < 0 ? ' − ' : ' + ') + Math.abs(B) + 'x' : ''}${C ? (C < 0 ? ' − ' : ' + ') + Math.abs(C) : ''}`;
      return { p, q2, c1, c2, d1, d2,
        q: `<p>Find the limit as x → ∞ of (${poly(p, c1, c2)}) / (${poly(q2, d1, d2)}).</p>`,
        answer, unit: '', tol: 0.002,
        hint: 'Divide the top and the bottom by the highest power of x in the bottom (here x²). Every term with x in the denominator then tends to 0.',
        solution: steps(`Divide top and bottom by x²: (${p}${pm(c1, '/x')}${pm(c2, '/x²')}) / (${q2}${pm(d1, '/x')}${pm(d2, '/x²')}).`, 'As x → ∞, the terms with 1/x and 1/x² tend to 0.', `Limit = ${p}/${q2} = <b>${n(answer, 4)}</b>.`) };
    },
    verify: (x) => { const t = 1e7; return (x.p * t * t + x.c1 * t + x.c2) / (x.q2 * t * t + x.d1 * t + x.d2); },
  },
  'lim-oneinf': {
    title: 'a 1^∞ limit',
    make(r) {
      const a = pick(r, -4, 4) || 2, b = pick(r, 1, 5);
      const answer = Math.exp(a * b);
      return { a, b,
        q: `<p>Find the limit as x → ∞ of (1 ${a < 0 ? '−' : '+'} ${Math.abs(a)}/x)<sup>${b === 1 ? '' : b}x</sup>. Give a decimal.</p>`,
        answer, unit: '', tol: 0.002,
        hint: 'For a 1^∞ form, lim f^g = e^(lim g(f − 1)). Here f − 1 = a/x and g = bx.',
        solution: steps('The base tends to 1 and the power to ∞: a 1^∞ form.', `lim g(f − 1) = lim ${b}x × (${sg(a)}/x) = ${sg(a * b)}.`, `Limit = e<sup>${sg(a * b)}</sup> = <b>${n(answer, 5)}</b>.`) };
    },
    verify: (x) => { const t = 1e8; return Math.exp(x.b * t * Math.log1p(x.a / t)); },
  },
};
