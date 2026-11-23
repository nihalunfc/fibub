// Helpers for question bank data files (public/qbank/<bank>/<topic>.js). Plain ES module, no dependencies.
// Format: /mnt/project-files/qbank/spec.md. `rng` is the seeded generator passed to a template's make(rng).

/** A random value from min to max (inclusive) in steps of `step`. */
export const pick = (rng, min, max, step = 1) => +(min + Math.floor(rng() * (Math.floor((max - min) / step + 1e-9) + 1)) * step).toFixed(10);
/** A random integer from min to max inclusive. */
export const int = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
/** One element of an array. */
export const choose = (rng, arr) => arr[Math.floor(rng() * arr.length)];
/** Shuffle with the seeded rng. */
export function shuffle(rng, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
/** Friendly number: `sig` significant figures, scientific notation (as TeX) when very big or small. */
export function fmt(x, sig = 3) {
  if (!Number.isFinite(x)) return String(x);
  const a = Math.abs(x);
  if (a !== 0 && (a >= 1e5 || a < 1e-3)) {
    const e = Math.floor(Math.log10(a)), m = +(x / 10 ** e).toPrecision(sig);
    return m === 1 ? `10^{${e}}` : `${m}\\times 10^{${e}}`;
  }
  return String(+x.toPrecision(sig));
}
/** Round to `d` decimal places (for answers). */
export const round = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;
/**
 * Build MCQ options from the correct value and wrong values (numbers or strings), de-duplicated and shuffled.
 * `show` turns a value into option HTML. Returns { options, answer }.
 */
export function mcqOptions(rng, correct, wrongs, show = (v) => String(v)) {
  const seen = new Set([show(correct)]);
  const ws = [];
  for (const w of wrongs) { const s = show(w); if (!seen.has(s)) { seen.add(s); ws.push(s); } if (ws.length === 3) break; }
  let k = 2;
  while (ws.length < 3) { const v = typeof correct === 'number' ? correct * k : `${show(correct)} (${k})`; const s = show(v); if (!seen.has(s)) { seen.add(s); ws.push(s); } k++; }
  const all = shuffle(rng, [show(correct), ...ws]);
  return { options: all, answer: all.indexOf(show(correct)) };
}
/** Physical constants (CODATA 2018, SI). */
export const C = {
  c: 2.99792458e8, h: 6.62607015e-34, hbar: 1.054571817e-34, e: 1.602176634e-19, me: 9.1093837015e-31,
  mp: 1.67262192369e-27, mn: 1.67492749804e-27, kB: 1.380649e-23, NA: 6.02214076e23, R: 8.314462618,
  eps0: 8.8541878128e-12, mu0: 1.25663706212e-6, G: 6.6743e-11, sigma: 5.670374419e-8, a0: 5.29177210903e-11,
  u: 1.66053906660e-27, g: 9.8, Ry: 13.605693, hc_eVnm: 1239.84198,
};

/** Same as mcqOptions with the name used in the spec. */
export const shuffleOpts = (rng, correct, wrongs, show) => mcqOptions(rng, correct, wrongs, show);

/**
 * Tidy how signs read in generated text, without changing any number: "a + -3" → "a - 3", "a − −3" → "a + 3",
 * "×-2" → "×(-2)", a coefficient of 1 written as "1x" → "x", and zero terms such as "+ 0x" or a trailing "x + 0" dropped.
 * Also "-3^2" after "=", "(" or "\sqrt{" → "(-3)^2", "/-2" → "/(-2)", "(x - 0)" → "x", a leading "0x + " dropped,
 * and "1\sin", "1<i>x</i>", "1e^", "\sin1x" read without the 1 ("-3^\circ" is left alone).
 * Use only on templates whose text has been checked (e.g. "1s" can be an orbital, "1g" a mass).
 */
const POW = String.raw`(?:\^\{?\d+\}?|[²³]|<sup>\d+<\/sup>)?`;
const VAR = String.raw`(?:<i>[a-z]<\/i>|[a-z])`;
const ZERO_END = String.raw`(?=\s*(?:[=<>≥≤$,;]|\\[lg]e|&[lg]t;|$)|\.(?!\d))`;
const RE_ZERO_PAREN = new RegExp(String.raw`(^|[\d)(=+−\-\s$|{,])\((${VAR})\s*[+−-]\s*0\)`, 'g');
const RE_ZERO_TERM = new RegExp(String.raw`\s*[+−-]\s*0(?:\s?<b>[a-z]<\/b>|<i>[a-z]<\/i>|\s?\\hat\s?[a-z]|[a-z])${POW}(?![\w(_'{^²³₀-₉])`, 'g');
const RE_ZERO_LEAD = new RegExp(String.raw`(^|[=([,$]\s*|<p>|<li>|<br>)0(?:<i>[a-z]<\/i>|\\hat\s?[a-z]|[a-z])${POW}(?![\w(_'{^²³₀-₉])\s*([+−-])\s*`, 'g');
const RE_ZERO_TAIL = new RegExp(String.raw`((?<![A-Za-z\\(])[a-z]${POW}|(?<!\()<i>[a-z]<\/i>${POW}|\)${POW})\s*[+−-]\s*0(?:${ZERO_END}|(?=\)))`, 'g');
const zeroVec = (m, pre, v, op) => pre + (op === '+' ? '' : op);
/** The rules signs() applies, in order: [pattern, replacement]. */
export const SIGN_RULES = [
  [/(×|·|\/|\\cdot\s?|\\times\s?)([-−])(\d+(?:\.\d+)?)/g, '$1($2$3)'],
  [/([+−-]\s*)([-−])(\d+(?:\.\d+)?)(?=[²³]|\^(?!\{?\\circ))/g, '$1($2$3)'],
  [/((?:^|=|\(|\\sqrt\{)\s*)([-−])(\d+(?:\.\d+)?)(?=[²³]|\^(?!\{?\\circ))/g, '$1($2$3)'],
  [/([+−-])(\s*)([-−])(?=\d)/g, (m, op, sp, neg, i, str) => {
    const before = str.slice(0, i).trimEnd();
    if (before === '' || /[=(,[{|]$/.test(before)) return op === '+' ? neg : '';
    return op === '+' ? neg + sp : '+' + sp;
  }],
  [/(^|=\s*)0\s?(<b>[ijk]<\/b>|\\hat\s?[ijk])\s*([+−-])\s*/g, zeroVec],
  [/(^|=\s*)0\s?(<b>[ijk]<\/b>|\\hat\s?[ijk])\s*([+−-])\s*/g, zeroVec],
  [RE_ZERO_PAREN, '$1$2'],
  [RE_ZERO_TERM, ''],
  [/\s*[+−-]\s*0\s?(?:\\,)?\\(?:sin|cos|tan)(?:\^\{?\d+\}?)?\s?(?:\\theta|[a-z])(?![\w(])/g, ''],
  [RE_ZERO_LEAD, (m, pre, op) => pre + (op === '+' ? '' : op)],
  [RE_ZERO_TAIL, '$1'],
  [/(x(?:\^\{?\d\}?|[²³]|<sup>\d<\/sup>)?)\s*[+−-]\s*0(?![\d.\w\\])/g, '$1'],
  [/(\\(?:sin|cos|tan|cot|sec|csc))1([a-z])(?![a-zA-Z])/g, '$1 $2'],
  [/(^|[^\w.)\]}²³⁰¹⁴-⁹^\\/÷·×])([-−]?)1(?=(?:<b>|<i>|\\hat\s?)?[a-df-zλ](?![a-zA-Z(])|\\(?:sin|cos|tan|cot|sec|csc|ln|log|sqrt|lambda)(?![a-zA-Z])|\\vec\s?[a-zA-Z]|e\^)/g, '$1$2'],
  [/((?:^|=)\s*)1e(?=\s*(?:[=+\-−]|\\approx|\$))/g, '$1e'],
];
/** For templates where capital letters are variables, not units ("1A" is matrix A, not one ampere): "3A-1B" → "3A-B". */
export const CAPS_RULE = [/(^|[^\w.)\]}²³⁰¹⁴-⁹^\\/÷·×|])([-−]?)1(?=[A-Z](?![a-zA-Z(]))/g, '$1$2'];
export function signs(s) {
  if (typeof s !== 'string') return s;
  for (const [re, to] of SIGN_RULES) s = s.replace(re, to);
  return s;
}
/** Apply signs() to the text fields of a generated question (with caps, also CAPS_RULE). */
export const tidy = (p, caps = false) => {
  const f = caps ? (x) => (typeof x === 'string' ? signs(x).replace(...CAPS_RULE) : x) : signs;
  for (const k of ['q', 'sol', 'hint', 'solution']) if (typeof p[k] === 'string') p[k] = f(p[k]);
  if (Array.isArray(p.options)) p.options = p.options.map(f);
  return p;
};
/** Run tidy() on the output of the listed generated templates of a bank file (other templates are left alone).
 *  With ids null, every template except those in `except` is tidied. Ids in `caps` also get CAPS_RULE. */
export const tidyGens = (bank, ids, except = [], caps = []) => {
  for (const g of bank.gens ?? []) if ((ids ? ids.includes(g.id) : true) && !except.includes(g.id)) { const mk = g.make, c = caps.includes(g.id); g.make = (rng) => tidy(mk.call(g, rng), c); }
  return bank;
};
