// "Solve my numbers" for the Argand plane: z op w with the working, modulus and argument of z, polar form back to
// a + bi, powers of z (De Moivre) and the roots of a quadratic that may be complex. Class 11 maths. No DOM.
import { type SSpec, type SIn, type SOut, sf } from '../learn/solvecore-b.ts';
import { cx, mul, div, pow, quadRoots, type C } from './school-complex.ts';

const D = 180 / Math.PI;
const p = (x: number) => (x < 0 ? `(${sf(x, 6)})` : sf(x, 6));
const clean = (z: C): C => { const s = Math.max(Math.abs(z.re), Math.abs(z.im), 1e-300); return cx(Math.abs(z.re) < 1e-10 * s ? 0 : z.re, Math.abs(z.im) < 1e-10 * s ? 0 : z.im); };
const imag = (b: number) => (Math.abs(b) === 1 ? 'i' : `${sf(Math.abs(b), 4)}i`);
/** a + bi written like a textbook: 3 − 2i, −i, 4, 0.5i. */
export function cs(z0: C, n = 4): string {
  const z = clean(z0), a = sf(z.re, n);
  if (z.im === 0) return a;
  const bi = Math.abs(z.im) === 1 ? 'i' : `${sf(Math.abs(z.im), n)}i`;
  if (z.re === 0) return `${z.im < 0 ? '−' : ''}${bi}`;
  return `${a} ${z.im < 0 ? '−' : '+'} ${bi}`;
}
const deg = (rad: number) => `${sf(rad * D, 5)}°`;
/** The principal argument of a + bi in radians, from the reference angle and the quadrant, as lines of working. */
function argWork(a: number, b: number): { th: number; lines: string[] } {
  if (b === 0) return a > 0 ? { th: 0, lines: ['z is on the positive real axis, so arg z = 0°.'] } : { th: Math.PI, lines: ['z is on the negative real axis, so arg z = 180° (π).'] };
  if (a === 0) return b > 0 ? { th: Math.PI / 2, lines: ['z is on the positive imaginary axis, so arg z = 90° (π/2).'] } : { th: -Math.PI / 2, lines: ['z is on the negative imaginary axis, so arg z = −90° (−π/2).'] };
  const al = Math.atan(Math.abs(b) / Math.abs(a)), lines = [`Reference angle α = tan⁻¹(|b| / |a|) = tan⁻¹(${sf(Math.abs(b), 6)} / ${sf(Math.abs(a), 6)}) = ${deg(al)}`];
  let th: number;
  if (a > 0 && b > 0) { th = al; lines.push(`z is in the first quadrant (a > 0, b > 0), so arg z = α = ${deg(th)}.`); }
  else if (a < 0 && b > 0) { th = Math.PI - al; lines.push(`z is in the second quadrant (a < 0, b > 0), so arg z = 180° − α = ${deg(th)}.`); }
  else if (a < 0) { th = al - Math.PI; lines.push(`z is in the third quadrant (a < 0, b < 0), so arg z = α − 180° = ${deg(th)} (or ${deg(th + 2 * Math.PI)} if you measure from 0° to 360°).`); }
  else { th = -al; lines.push(`z is in the fourth quadrant (a > 0, b < 0), so arg z = −α = ${deg(th)} (or ${deg(th + 2 * Math.PI)} from 0° to 360°).`); }
  return { th, lines };
}

export function arith(z: C, w: C, op: string): SOut {
  const [a, b, c, d] = [z.re, z.im, w.re, w.im];
  const zt = `(${cs(z, 6)})`, wt = `(${cs(w, 6)})`;
  if (op === 'add' || op === 'sub') {
    const s = op === 'add' ? 1 : -1, sy = op === 'add' ? '+' : '−', r = cx(a + s * c, b + s * d);
    return { answer: `z ${sy} w = ${cs(r)}.`, lines: [`z ${sy} w = ${zt} ${sy} ${wt}`, `= (a ${sy} c) + (b ${sy} d)i = (${p(a)} ${sy} ${p(c)}) + (${p(b)} ${sy} ${p(d)})i`, `= ${cs(r, 6)}`, 'Add or subtract the real parts together and the imaginary parts together.'], tip: 'Common mistake: adding a real part to an imaginary part. Keep the two columns separate. On the Argand plane, z + w is the fourth corner of the parallelogram.' };
  }
  if (op === 'mul') {
    const r = mul(z, w);
    return { answer: `z × w = ${cs(r)}.`, lines: [`z × w = ${zt} ${wt}`, '= (ac − bd) + (ad + bc)i, because i² = −1', `= (${p(a)}×${p(c)} − ${p(b)}×${p(d)}) + (${p(a)}×${p(d)} + ${p(b)}×${p(c)})i`, `= ${cs(r, 6)}`, `Check: |z| × |w| = ${sf(Math.hypot(a, b), 5)} × ${sf(Math.hypot(c, d), 5)} = ${sf(Math.hypot(a, b) * Math.hypot(c, d), 5)} = |z × w| = ${sf(Math.hypot(r.re, r.im), 5)}`], tip: 'Common mistake: forgetting that i × i = −1, so the product bd of the two imaginary parts comes in with a minus sign.' };
  }
  if (c === 0 && d === 0) return { error: 'You cannot divide by 0 (w = 0 + 0i). Change w.' };
  const den = c * c + d * d, nr = mul(z, cx(c, -d)), r = div(z, w)!;
  return { answer: `z ÷ w = ${cs(r)}.`, lines: [`z ÷ w = ${zt} / ${wt}`, `Multiply top and bottom by the conjugate of w, w̄ = ${cs(cx(c, -d), 6)}. The bottom becomes the real number c² + d² = ${p(c)}² + ${p(d)}² = ${sf(den, 6)}.`, `Top: ${zt} × (${cs(cx(c, -d), 6)}) = ${cs(nr, 6)}`, `z ÷ w = (${cs(nr, 6)}) / ${sf(den, 6)} = ${cs(r, 6)}`], tip: 'Common mistake: dividing the parts one by one (a ÷ c and b ÷ d). You must multiply by the conjugate to make the bottom real.' };
}

export function polar(z: C): SOut {
  const [a, b] = [z.re, z.im], r = Math.hypot(a, b);
  if (r === 0) return { error: 'z = 0 has modulus 0, and its argument is not defined. Try a number other than 0.' };
  const { th, lines } = argWork(a, b);
  return { answer: `|z| = ${sf(r, 5)} and arg z = ${deg(th)} (${sf(th, 4)} rad).`, lines: [`|z| = √(a² + b²) = √(${p(a)}² + ${p(b)}²) = √${sf(a * a + b * b, 6)} = ${sf(r, 5)}`, ...lines, `Polar form: z = ${sf(r, 4)}(cos ${deg(th)} + i sin ${deg(th)})`], tip: 'Common mistake: using tan⁻¹(b/a) without checking the quadrant. A calculator gives an angle between −90° and 90°, so for a < 0 you must add or subtract 180°.' };
}

export function rect(r: number, th: number, u: string, typed: number): SOut {
  if (r < 0) return { error: 'The modulus is a length, so it cannot be negative. Use a positive r and change the angle instead.' };
  const z = clean(cx(r * Math.cos(th), r * Math.sin(th))), t = u === 'degrees' ? `${sf(typed, 6)}°` : `${sf(typed, 6)} rad`;
  return { answer: `z = ${cs(z)}.`, lines: [`z = r(cos θ + i sin θ), with r = ${sf(r, 6)} and θ = ${t}`, `a = r cos θ = ${sf(r, 6)} × ${sf(Math.cos(th), 5)} = ${sf(z.re, 5)}`, `b = r sin θ = ${sf(r, 6)} × ${sf(Math.sin(th), 5)} = ${sf(z.im, 5)}`, `z = ${cs(z, 5)}`], tip: 'Common mistake: having the calculator in the wrong angle mode. Check that it is in degrees when θ is in degrees, and in radians when θ is in radians.' };
}

export function power(z: C, n: number): SOut {
  if (!Number.isInteger(n)) return { error: 'The power n must be a whole number such as 2, 5 or −3.' };
  if (Math.abs(n) > 60) return { error: 'Keep n between −60 and 60.' };
  const r = Math.hypot(z.re, z.im);
  if (r === 0) return n > 0 ? { answer: `0 to the power ${n} = 0.`, lines: ['0 to any positive power is 0.'] } : { error: 'Zero cannot be raised to a power of 0 or less. Try z ≠ 0.' };
  const res = pow(z, n);
  if (!Number.isFinite(res.re) || !Number.isFinite(res.im)) return { error: 'That power is too large to show. Try a smaller n or a smaller z.' };
  const { th } = argWork(z.re, z.im), nth = n * th, rn = Math.pow(r, n);
  let red = nth % (2 * Math.PI); if (red > Math.PI) red -= 2 * Math.PI; if (red <= -Math.PI) red += 2 * Math.PI;
  return { answer: `zⁿ = (${cs(z, 6)})^${n} = ${cs(res)}.`, lines: [`Write z in polar form: r = ${sf(r, 5)}, θ = ${deg(th)}`, 'De Moivre: zⁿ = rⁿ(cos nθ + i sin nθ)', `rⁿ = ${sf(r, 5)}^${n} = ${sf(rn, 5)}, nθ = ${n} × ${deg(th)} = ${deg(nth)}${Math.abs(nth) > Math.PI ? ` (the same direction as ${deg(red)})` : ''}`, `zⁿ = ${sf(rn, 5)}(cos ${deg(nth)} + i sin ${deg(nth)}) = ${cs(res, 6)}`], tip: 'Common mistake: raising a and b to the power separately. (a + bi)ⁿ is not aⁿ + bⁿiⁿ. Use De Moivre, or multiply out step by step.' };
}

export function quad(a: number, b: number, c: number): SOut {
  if (a === 0) return { error: 'With a = 0 this is not a quadratic. Type a number other than 0 for a.' };
  const r = quadRoots(a, b, c), [r1, r2] = r.roots, Dd = r.D;
  const lines = [`a = ${sf(a, 6)}, b = ${sf(b, 6)}, c = ${sf(c, 6)}`, `D = b² − 4ac = ${p(b)}² − 4(${p(a)})(${p(c)}) = ${sf(Dd, 6)}`];
  if (r.kind === 'complex') {
    lines.push('D < 0, so there are no real roots. The roots are a conjugate pair.', `x = (−b ± i√(−D)) / 2a = (${sf(-b, 6)} ± i√${sf(-Dd, 6)}) / ${sf(2 * a, 6)}`, `x = ${cs(r1, 6)} and x = ${cs(r2, 6)}`);
    return { answer: `The roots are ${cs(r1)} and ${cs(r2)}.`, lines: [...lines, `Check: sum = ${sf(-b / a, 5)} (−b/a) and product = ${sf(c / a, 5)} (c/a)`], tip: 'Common mistake: stopping at "D is negative, no roots". In complex numbers there are always two roots, and for real a, b, c they are conjugates.' };
  }
  if (r.kind === 'repeated') return { answer: `One repeated real root: x = ${cs(r1)}.`, lines: [...lines, 'D = 0, so the two roots are equal.', `x = −b / 2a = ${sf(-b, 6)} / ${sf(2 * a, 6)} = ${cs(r1, 6)}`] };
  return { answer: `The roots are real: x = ${cs(r1)} and x = ${cs(r2)}.`, lines: [...lines, 'D > 0, so there are two different real roots.', `x = (−b ± √D) / 2a = (${sf(-b, 6)} ± √${sf(Dd, 6)}) / ${sf(2 * a, 6)}`, `x = ${cs(r1, 6)} and x = ${cs(r2, 6)}`], tip: 'Common mistake: a wrong sign on −b. If b is negative, −b is positive.' };
}

const Z = (i: Record<string, SIn>, a: string, b: string): C => cx(i[a].v, i[b].v);
export const ARGAND_SPEC: SSpec = {
  id: 'argand',
  finds: [['arith', 'z and w: add, subtract, multiply, divide'], ['polar', 'Modulus and argument of z'], ['rect', 'Polar form to a + bi'], ['power', 'Power zⁿ (De Moivre)'], ['quad', 'Roots of a quadratic']],
  fields: [
    { k: 'op', label: 'Operation', kind: 'choice', options: [['add', 'z + w'], ['sub', 'z − w'], ['mul', 'z × w'], ['div', 'z ÷ w']], def: 'mul', show: (c) => c.find === 'arith' },
    { k: 'za', label: 'z: real part a', neg: true, ph: 'e.g. 3', show: (c) => ['arith', 'polar', 'power'].includes(c.find) },
    { k: 'zb', label: 'z: imaginary part b', neg: true, ph: 'e.g. 1', show: (c) => ['arith', 'polar', 'power'].includes(c.find) },
    { k: 'wa', label: 'w: real part c', neg: true, ph: 'e.g. 1', show: (c) => c.find === 'arith' },
    { k: 'wb', label: 'w: imaginary part d', neg: true, ph: 'e.g. 2', show: (c) => c.find === 'arith' },
    { k: 'n', label: 'Power n (whole number)', neg: true, ph: 'e.g. 8', show: (c) => c.find === 'power' },
    { k: 'r', label: 'Modulus r', ph: 'e.g. 2', show: (c) => c.find === 'rect' },
    { k: 'th', label: 'Argument θ', neg: true, units: [['degrees', Math.PI / 180], ['radians', 1]], ph: 'e.g. 60', show: (c) => c.find === 'rect' },
    { k: 'qa', label: 'a (of ax² + bx + c = 0)', neg: true, ph: 'e.g. 1', show: (c) => c.find === 'quad' },
    { k: 'qb', label: 'b', neg: true, ph: 'e.g. 2', show: (c) => c.find === 'quad' },
    { k: 'qc', label: 'c', neg: true, ph: 'e.g. 5', show: (c) => c.find === 'quad' },
  ],
  presets: [
    { name: '(3 + i)(1 + 2i)', find: 'arith', ch: { op: 'mul' }, vals: { za: '3', zb: '1', wa: '1', wb: '2' } },
    { name: '(3 + i) ÷ (1 + 2i)', find: 'arith', ch: { op: 'div' }, vals: { za: '3', zb: '1', wa: '1', wb: '2' } },
    { name: 'Modulus and argument of −3 + 4i', find: 'polar', vals: { za: '-3', zb: '4' } },
    { name: '2(cos 60° + i sin 60°) as a + bi', find: 'rect', vals: { r: '2', th: ['60', 'degrees'] } },
    { name: '(1 + i) to the power 8', find: 'power', vals: { za: '1', zb: '1', n: '8' } },
    { name: 'x² + 2x + 5 = 0', find: 'quad', vals: { qa: '1', qb: '2', qc: '5' } },
  ],
  solve: (i, c) => {
    if (c.find === 'arith') return arith(Z(i, 'za', 'zb'), Z(i, 'wa', 'wb'), c.ch.op || 'mul');
    if (c.find === 'polar') return polar(Z(i, 'za', 'zb'));
    if (c.find === 'rect') return rect(i.r.v, i.th.v, i.th.u, i.th.typed);
    if (c.find === 'power') return power(Z(i, 'za', 'zb'), i.n.v);
    return quad(i.qa.v, i.qb.v, i.qc.v);
  },
};
