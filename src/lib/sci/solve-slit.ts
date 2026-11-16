// "Solve my numbers" for the double slit (Young's fringes, β = λD/d) and the single slit (central maximum 2λD/a).
// Small-angle formulas used in school; a warning is given when the angle is too big for them. Plain maths, no DOM.
import { eng, sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const conv = (lines: string[], x: SIn | undefined, base: string, what: string) => { if (x && !x.blank && x.u !== base && x.typed !== x.v) lines.push(`Convert ${what}: ${sf(x.typed)} ${x.u} = ${sf(x.v, 4)} ${base}`); };
const nmText = (m: number) => `${sf(m * 1e9)} nm`;
const bigAngle = (x: number, D: number) => (x / D > 0.1 ? ' The angle here is fairly large, so the school formula is only approximate.' : '');
const ord = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10 < 4 ? n % 10 : 0]}`;
const TIP = 'Common mistakes: slit separation d in mm but wavelength in nm (put everything in metres first), and mixing up d (the gap between the two slits) with a (the width of one slit).';

export function young(i: Record<string, SIn>, c: { find: string }): SOut {
  const f = c.find, lines: string[] = [];
  for (const [x, b, w] of [[i.lam, 'm', 'the wavelength'], [i.d, 'm', 'the slit separation'], [i.D, 'm', 'the screen distance'], [i.beta, 'm', 'the fringe width']] as [SIn | undefined, string, string][]) {
    if (x && !x.blank && !(x.v > 0)) return { error: `${w[0].toUpperCase() + w.slice(1)} must be above zero.` };
    conv(lines, x, b, w);
  }
  if (i.n && !i.n.blank && (!(i.n.v >= 0) || !Number.isInteger(i.n.v))) return { error: 'The fringe number n is a whole number: 0 is the centre, 1 the first fringe, and so on.' };
  if (f === 'beta') {
    const b = (i.lam.v * i.D.v) / i.d.v;
    lines.push('Formula: β = λ D / d', `β = ${sf(i.lam.v)} × ${sf(i.D.v)} ÷ ${sf(i.d.v)} = ${sf(b)} m = ${sf(b * 1000)} mm`, `Angular fringe width: λ / d = ${sf(i.lam.v / i.d.v)} rad = ${sf(((i.lam.v / i.d.v) * 180) / Math.PI)}°`);
    return { answer: `The fringe width is ${sf(b * 1000)} mm.${bigAngle(b, i.D.v)}`, lines, tip: TIP };
  }
  if (f === 'lam') {
    const l = (i.beta.v * i.d.v) / i.D.v;
    lines.push('Formula turned round: λ = β d / D', `λ = ${sf(i.beta.v)} × ${sf(i.d.v)} ÷ ${sf(i.D.v)} = ${sf(l)} m = ${nmText(l)}`);
    return { answer: `The wavelength is ${nmText(l)}${l * 1e9 >= 380 && l * 1e9 <= 750 ? ' (visible light)' : ' (outside the visible range 380 to 750 nm, so check the numbers)'}.`, lines, tip: TIP };
  }
  if (f === 'd') {
    const d = (i.lam.v * i.D.v) / i.beta.v;
    lines.push('Formula turned round: d = λ D / β', `d = ${sf(i.lam.v)} × ${sf(i.D.v)} ÷ ${sf(i.beta.v)} = ${sf(d)} m = ${sf(d * 1000)} mm`);
    return { answer: `The slit separation is ${sf(d * 1000)} mm.`, lines, tip: TIP };
  }
  if (f === 'D') {
    const D = (i.beta.v * i.d.v) / i.lam.v;
    lines.push('Formula turned round: D = β d / λ', `D = ${sf(i.beta.v)} × ${sf(i.d.v)} ÷ ${sf(i.lam.v)} = ${sf(D)} m`);
    return { answer: `The screen must be ${sf(D)} m from the slits.`, lines, tip: TIP };
  }
  const n = i.n.v, dark = f === 'yn';
  if (dark && n < 1) return { error: 'Dark fringes are numbered from 1 (the first dark fringe is next to the centre).' };
  const b = (i.lam.v * i.D.v) / i.d.v, x = (dark ? n - 0.5 : n) * b;
  lines.push('Formula: β = λ D / d', `β = ${sf(i.lam.v)} × ${sf(i.D.v)} ÷ ${sf(i.d.v)} = ${sf(b * 1000)} mm`, dark ? `The ${ord(n)} dark fringe is at x = (n − ½) β = ${sf(n - 0.5)} × ${sf(b * 1000)} mm = ${sf(x * 1000)} mm` : `The ${ord(n)} bright fringe is at x = n β = ${sf(n)} × ${sf(b * 1000)} mm = ${sf(x * 1000)} mm`, `Path difference there: ${dark ? sf(n - 0.5) : sf(n)} λ = ${nmText((dark ? n - 0.5 : n) * i.lam.v)}`);
  return { answer: n === 0 && !dark ? 'The 0th bright fringe is the centre of the pattern, x = 0 mm.' : `The ${ord(n)} ${dark ? 'dark' : 'bright'} fringe is ${sf(x * 1000)} mm from the centre.${bigAngle(x, i.D.v)}`, lines, tip: TIP };
}

export function single(i: Record<string, SIn>, c: { find: string }): SOut {
  const f = c.find, lines: string[] = [];
  for (const [x, b, w] of [[i.lam, 'm', 'the wavelength'], [i.a, 'm', 'the slit width'], [i.D, 'm', 'the screen distance'], [i.W, 'm', 'the central maximum width']] as [SIn | undefined, string, string][]) {
    if (x && !x.blank && !(x.v > 0)) return { error: `${w[0].toUpperCase() + w.slice(1)} must be above zero.` };
    conv(lines, x, b, w);
  }
  const T = 'Common mistake: the central maximum is the distance between the two first minima, so it is 2λD/a, not λD/a. A narrower slit gives a wider pattern.';
  if (f === 'W' || f === 'xn') {
    const n = f === 'W' ? 1 : i.n.v;
    if (f === 'xn' && (!(n >= 1) || !Number.isInteger(n))) return { error: 'The minimum number n is a whole number from 1 (the first dark band beside the centre).' };
    if (n * i.lam.v >= i.a.v) return { error: `With a = ${nmText(i.a.v)} and λ = ${nmText(i.lam.v)} there is no ${f === 'W' ? 'first ' : ''}minimum: a slit this narrow (or narrower than the wavelength) spreads the light over all angles, so a sin θ = nλ has no solution.` };
    const x = (n * i.lam.v * i.D.v) / i.a.v;
    if (f === 'W') {
      lines.push('Minima: a sin θ = n λ, and for small angles the first one is at x₁ = λ D / a', `Central maximum = 2 x₁ = 2 λ D / a = 2 × ${sf(i.lam.v)} × ${sf(i.D.v)} ÷ ${sf(i.a.v)} = ${sf(2 * x)} m = ${sf(2 * x * 1000)} mm`, `Half-angle of the central maximum: sin θ = λ / a = ${sf(i.lam.v / i.a.v)}, θ = ${sf((Math.asin(i.lam.v / i.a.v) * 180) / Math.PI)}°`);
      return { answer: `The central bright band is ${sf(2 * x * 1000)} mm wide.${bigAngle(x, i.D.v)}`, lines, tip: T };
    }
    lines.push('Minima: a sin θ = n λ, so for small angles x = n λ D / a', `x = ${sf(n)} × ${sf(i.lam.v)} × ${sf(i.D.v)} ÷ ${sf(i.a.v)} = ${sf(x)} m = ${sf(x * 1000)} mm`);
    return { answer: `The ${ord(n)} dark minimum is ${sf(x * 1000)} mm from the centre.${bigAngle(x, i.D.v)}`, lines, tip: T };
  }
  if (f === 'lam') {
    const l = (i.W.v * i.a.v) / (2 * i.D.v);
    lines.push('Formula turned round: λ = W a / (2 D)', `λ = ${sf(i.W.v)} × ${sf(i.a.v)} ÷ (2 × ${sf(i.D.v)}) = ${sf(l)} m = ${nmText(l)}`);
    return { answer: `The wavelength is ${nmText(l)}.`, lines, tip: T };
  }
  if (f === 'a') {
    const a = (2 * i.lam.v * i.D.v) / i.W.v;
    lines.push('Formula turned round: a = 2 λ D / W', `a = 2 × ${sf(i.lam.v)} × ${sf(i.D.v)} ÷ ${sf(i.W.v)} = ${sf(a)} m = ${sf(a * 1000)} mm`);
    return { answer: `The slit is ${sf(a * 1000)} mm wide.`, lines, tip: T };
  }
  const D = (i.W.v * i.a.v) / (2 * i.lam.v);
  lines.push('Formula turned round: D = W a / (2 λ)', `D = ${sf(i.W.v)} × ${sf(i.a.v)} ÷ (2 × ${sf(i.lam.v)}) = ${sf(D)} m`);
  return { answer: `The screen is ${sf(D)} m from the slit.`, lines, tip: T };
}

const LAM: [string, number][] = [['nm', 1e-9], ['µm', 1e-6], ['Å', 1e-10], ['m', 1]];
const MM: [string, number][] = [['mm', 1e-3], ['µm', 1e-6], ['cm', 1e-2], ['m', 1]];
const DD: [string, number][] = [['m', 1], ['cm', 1e-2], ['mm', 1e-3]];
export const YOUNG_SPEC: SSpec = {
  id: 'young',
  finds: [['beta', 'Fringe width β'], ['lam', 'Wavelength λ'], ['d', 'Slit separation d'], ['D', 'Screen distance D'], ['xn', 'nth bright fringe'], ['yn', 'nth dark fringe']],
  fields: [
    { k: 'lam', label: 'Wavelength λ', units: LAM, ph: 'e.g. 600' },
    { k: 'd', label: 'Slit separation d', units: MM, ph: 'e.g. 0.25' },
    { k: 'D', label: 'Slits to screen D', units: DD, ph: 'e.g. 1' },
    { k: 'beta', label: 'Fringe width β', units: MM, show: (c) => ['lam', 'd', 'D'].includes(c.find), ph: 'e.g. 2.4' },
    { k: 'n', label: 'Fringe number n', units: [['', 1]], show: (c) => c.find === 'xn' || c.find === 'yn', ph: 'e.g. 3' },
  ],
  presets: [
    { name: '600 nm light, d = 0.25 mm, D = 1 m: find β', find: 'beta', vals: { lam: '600', d: '0.25', D: '1' } },
    { name: 'Sodium light 589 nm, d = 0.5 mm, D = 2 m', find: 'beta', vals: { lam: '589', d: '0.5', D: '2' } },
    { name: 'Fringes 1.2 mm apart, d = 0.5 mm, D = 1 m: find λ', find: 'lam', vals: { beta: '1.2', d: '0.5', D: '1' } },
    { name: '4th bright fringe: 500 nm, d = 0.2 mm, D = 1.5 m', find: 'xn', vals: { lam: '500', d: '0.2', D: '1.5', n: '4' } },
    { name: '2nd dark fringe: 650 nm, d = 1 mm, D = 2 m', find: 'yn', vals: { lam: '650', d: '1', D: '2', n: '2' } },
  ],
  solve: (i, c) => young(i, c),
};
export const SINGLE_SPEC: SSpec = {
  id: 'single',
  finds: [['W', 'Central maximum width'], ['xn', 'nth dark minimum'], ['lam', 'Wavelength λ'], ['a', 'Slit width a'], ['D', 'Screen distance D']],
  fields: [
    { k: 'lam', label: 'Wavelength λ', units: LAM, ph: 'e.g. 600' },
    { k: 'a', label: 'Slit width a', units: MM, ph: 'e.g. 0.05' },
    { k: 'D', label: 'Slit to screen D', units: DD, ph: 'e.g. 1' },
    { k: 'W', label: 'Central maximum width W', units: MM, show: (c) => ['lam', 'a', 'D'].includes(c.find), ph: 'e.g. 24' },
    { k: 'n', label: 'Minimum number n', units: [['', 1]], show: (c) => c.find === 'xn', ph: 'e.g. 2' },
  ],
  presets: [
    { name: '600 nm light, a = 0.05 mm, D = 1 m: find W', find: 'W', vals: { lam: '600', a: '0.05', D: '1' } },
    { name: '500 nm light, a = 0.2 mm, D = 2 m: find W', find: 'W', vals: { lam: '500', a: '0.2', D: '2' } },
    { name: 'Central band 12 mm, a = 0.1 mm, D = 1 m: find λ', find: 'lam', vals: { W: '12', a: '0.1', D: '1' } },
    { name: '2nd minimum: 650 nm, a = 0.1 mm, D = 1.5 m', find: 'xn', vals: { lam: '650', a: '0.1', D: '1.5', n: '2' } },
  ],
  solve: (i, c) => single(i, c),
};
