// Class 10 Maths, Introduction to Trigonometry: live problems (original fibub questions). Ids start with c10m-trig-.
import { pick, choose, n, steps } from './_util.js';

const TR = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [6, 8, 10], [9, 12, 15]], R = Math.PI / 180;
const NM = { sin: 'sin', cos: 'cos', tan: 'tan', cosec: 'cosec', sec: 'sec', cot: 'cot' };
export default {
  'c10m-trig-ratio': {
    title: 'a trigonometric ratio from the sides',
    make(r) {
      const t = choose(r, TR), sw = choose(r, [0, 1]), o = sw ? t[1] : t[0], a = sw ? t[0] : t[1], h = t[2], ask = choose(r, ['sin', 'cos', 'tan', 'cosec', 'sec', 'cot']);
      const val = { sin: o / h, cos: a / h, tan: o / a, cosec: h / o, sec: h / a, cot: a / o }[ask], fr = { sin: [o, h], cos: [a, h], tan: [o, a], cosec: [h, o], sec: [h, a], cot: [a, o] }[ask];
      return { o, a, h, ask, q: `<p>In a right triangle ABC, right-angled at B, AB = ${a} and BC = ${o}. Find ${ask} A as a decimal (3 decimal places).</p>`, answer: val, unit: '', tol: 0.002,
        hint: 'Angle A: the side opposite is BC, the side adjacent is AB, and the hypotenuse is AC (Pythagoras).', solution: steps(`AC = √(${a}² + ${o}²) = √${a * a + o * o} = ${h}.`, `Opposite to A is BC = ${o}, adjacent is AB = ${a}.`, `${ask} A = ${fr[0]}/${fr[1]} = <b>${n(val, 4)}</b>.`) };
    },
    verify: (x) => { const A = Math.atan2(x.o, x.a), f = { sin: Math.sin, cos: Math.cos, tan: Math.tan, cosec: (v) => 1 / Math.sin(v), sec: (v) => 1 / Math.cos(v), cot: (v) => 1 / Math.tan(v) }[x.ask]; return f(A); },
  },
  'c10m-trig-given': {
    title: 'one ratio given, find another',
    make(r) {
      const t = choose(r, TR), sw = choose(r, [0, 1]), p = sw ? t[1] : t[0], b = sw ? t[0] : t[1], h = t[2], ask = choose(r, ['cos', 'tan', 'cot']);
      const val = { cos: b / h, tan: p / b, cot: b / p }[ask];
      return { p, h, ask, q: `<p>If sin A = ${p}/${h}, where A is an acute angle, find ${ask} A as a decimal (3 decimal places).</p>`, answer: val, unit: '', tol: 0.002,
        hint: 'Draw a right triangle with opposite side ' + p + ' and hypotenuse ' + h + ', then find the third side with Pythagoras.', solution: steps(`Opposite = ${p}, hypotenuse = ${h}.`, `Adjacent = √(${h}² − ${p}²) = √${h * h - p * p} = ${b}.`, `${ask} A = ${{ cos: `${b}/${h}`, tan: `${p}/${b}`, cot: `${b}/${p}` }[ask]} = <b>${n(val, 4)}</b>.`) };
    },
    verify: (x) => { const A = Math.asin(x.p / x.h); return { cos: Math.cos(A), tan: Math.tan(A), cot: 1 / Math.tan(A) }[x.ask]; },
  },
  'c10m-trig-special': {
    title: 'evaluate with the special angles',
    make(r) {
      const c1 = pick(r, 1, 4), c2 = pick(r, 1, 4), c3 = pick(r, 1, 4), kind = choose(r, [0, 1, 2]);
      const T = [[`${c1} sin 30° + ${c2} tan 45° − ${c3} cos 60°`, c1 * 0.5 + c2 - c3 * 0.5], [`${c1} cos² 45° + ${c2} sin² 60° + ${c3} tan² 45°`, c1 * 0.5 + c2 * 0.75 + c3], [`${c1} sin 60° cos 30° + ${c2} sin 30° cos 60° + ${c3} tan 45°`, c1 * 0.75 + c2 * 0.25 + c3]][kind];
      return { c1, c2, c3, kind, q: `<p>Find the value of ${T[0]}.</p>`, answer: T[1], tol: 0.002, abs: 0.001, unit: '',
        hint: 'Replace each ratio by its value: sin 30° = cos 60° = 1/2, tan 45° = 1, sin 60° = cos 30° = √3/2, cos 45° = 1/√2.', solution: steps('Put in the special value for each ratio.', `The expression equals <b>${n(T[1], 4)}</b>.`) };
    },
    verify: (x) => { const { c1, c2, c3, kind } = x; return [() => c1 * Math.sin(30 * R) + c2 * Math.tan(45 * R) - c3 * Math.cos(60 * R), () => c1 * Math.cos(45 * R) ** 2 + c2 * Math.sin(60 * R) ** 2 + c3 * Math.tan(45 * R) ** 2, () => c1 * Math.sin(60 * R) * Math.cos(30 * R) + c2 * Math.sin(30 * R) * Math.cos(60 * R) + c3 * Math.tan(45 * R)][kind](); },
  },
  'c10m-trig-angle': {
    title: 'find the angle from its ratio',
    make(r) {
      const th = choose(r, [30, 45, 60]), fn = choose(r, ['sin', 'cos', 'tan']), ex = { sin: { 30: '1/2', 45: '1/√2', 60: '√3/2' }, cos: { 30: '√3/2', 45: '1/√2', 60: '1/2' }, tan: { 30: '1/√3', 45: '1', 60: '√3' } }[fn][th];
      return { th, fn, q: `<p>In a right triangle, ${fn} θ = ${ex}, where θ is acute. Find θ in degrees.</p>`, answer: th, unit: '°', tol: 0.001,
        hint: 'Match the value with the table of special angles.', solution: steps(`${fn} θ = ${ex}.`, `From the table of special values, θ = <b>${th}°</b>.`) };
    },
    verify: (x) => { const v = { sin: Math.sin(x.th * R), cos: Math.cos(x.th * R), tan: Math.tan(x.th * R) }[x.fn]; const inv = { sin: Math.asin, cos: Math.acos, tan: Math.atan }[x.fn]; return inv(v) / R; },
  },
  'c10m-trig-expr': {
    title: 'a ratio expression from tan θ',
    make(r) {
      const t = choose(r, TR), sw = choose(r, [0, 1]), p = sw ? t[1] : t[0], b = sw ? t[0] : t[1];
      if (p === b) return this.make(r);
      return { p, b, q: `<p>If tan θ = ${p}/${b}, find the value of (sin θ + cos θ) / (sin θ − cos θ) as a decimal (3 decimal places).</p>`, answer: (p + b) / (p - b), unit: '', tol: 0.002, abs: 0.0005,
        hint: 'Divide the top and the bottom by cos θ so the expression is in terms of tan θ.', solution: steps('Divide top and bottom by cos θ: (tan θ + 1)/(tan θ − 1).', `= (${p}/${b} + 1)/(${p}/${b} − 1) = (${p} + ${b})/(${p} − ${b}) = <b>${n((p + b) / (p - b), 4)}</b>.`) };
    },
    verify: (x) => { const A = Math.atan(x.p / x.b); return (Math.sin(A) + Math.cos(A)) / (Math.sin(A) - Math.cos(A)); },
  },
  'c10m-trig-height': {
    title: 'altitude of an equilateral triangle',
    make(r) {
      const s = pick(r, 4, 30, 2);
      return { s, q: `<p>An equilateral triangle has each side ${s} cm. Using sin 60° = √3/2, find its altitude (height) in cm, to 2 decimal places.</p>`, answer: s * Math.sqrt(3) / 2, unit: 'cm', tol: 0.002,
        hint: 'The altitude is one leg of a right triangle with hypotenuse = the side and an angle of 60° at the base.', solution: steps(`In the right triangle formed, the hypotenuse is ${s} and the altitude is opposite the 60° angle.`, `Altitude = ${s} × sin 60° = ${s} × √3/2 = <b>${n(s * Math.sqrt(3) / 2, 4)} cm</b>.`) };
    },
    verify: (x) => Math.sqrt(x.s * x.s - (x.s / 2) ** 2),
  },
  'c10m-trig-side': {
    title: 'a side from the hypotenuse and an angle',
    make(r) {
      const th = choose(r, [30, 45, 60]), H = pick(r, 6, 40, 2), fn = choose(r, ['opposite', 'adjacent']);
      return { th, H, fn, q: `<p>In a right triangle the hypotenuse is ${H} cm and one acute angle is ${th}°. Find the length of the side <b>${fn}</b> to that angle, to 2 decimal places.</p>`, answer: fn === 'opposite' ? H * Math.sin(th * R) : H * Math.cos(th * R), unit: 'cm', tol: 0.002,
        hint: fn === 'opposite' ? 'sin θ = opposite / hypotenuse.' : 'cos θ = adjacent / hypotenuse.', solution: steps(fn === 'opposite' ? `sin ${th}° = opposite/${H}, so opposite = ${H} × sin ${th}°.` : `cos ${th}° = adjacent/${H}, so adjacent = ${H} × cos ${th}°.`, `= <b>${n(fn === 'opposite' ? H * Math.sin(th * R) : H * Math.cos(th * R), 4)} cm</b>.`) };
    },
    verify: (x) => (x.fn === 'opposite' ? Math.sqrt(x.H ** 2 - (x.H * Math.cos(x.th * R)) ** 2) : Math.sqrt(x.H ** 2 - (x.H * Math.sin(x.th * R)) ** 2)),
  },
};
