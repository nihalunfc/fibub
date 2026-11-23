// Small helpers shared by the NCERT problem files.
/** A number from min to max in steps of `step`, using the seeded rand(). */
export const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
/** One item of a list. */
export const choose = (r, list) => list[Math.floor(r() * list.length) % list.length];
/** A number written for Indian readers, to d significant figures. */
export const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
/** A worked solution as numbered steps. */
export const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

/**
 * Tidy how signs read in generated text, without changing any number: "a + -3" → "a - 3", "a − −3" → "a + 3",
 * "×-2" → "×(-2)", a coefficient of 1 written as "1x" → "x", and zero terms such as "+ 0x" or a trailing "x + 0" dropped.
 * Use only on templates whose text has been checked (e.g. "1s" can be an orbital).
 */
export function signs(s) {
  if (typeof s !== 'string') return s;
  return s
    .replace(/(×|·|\\cdot\s?|\\times\s?)([-−])(\d+(?:\.\d+)?)/g, '$1($2$3)')
    .replace(/([+−-]\s*)([-−])(\d+(?:\.\d+)?)(?=[²³^])/g, '$1($2$3)')
    .replace(/([+−-])(\s*)([-−])(?=\d)/g, (m, op, sp, neg, i, str) => {
      const before = str.slice(0, i).trimEnd();
      if (before === '' || /[=(,[{|]$/.test(before)) return op === '+' ? neg : '';
      return op === '+' ? neg + sp : '+' + sp;
    })
    .replace(/(^|=\s*)0\s?(<b>[ijk]<\/b>|\\hat\s?[ijk])\s*([+−-])\s*/g, (m, pre, v, op) => pre + (op === '+' ? '' : op))
    .replace(/(^|=\s*)0\s?(<b>[ijk]<\/b>|\\hat\s?[ijk])\s*([+−-])\s*/g, (m, pre, v, op) => pre + (op === '+' ? '' : op))
    .replace(/\s*[+−-]\s*0\s?(<b>)?(\\hat\s?)?([a-z])(<\/b>)?(?![a-zA-Z(])/g, '')
    .replace(/(x(?:\^\{?\d\}?|[²³]|<sup>\d<\/sup>)?)\s*[+−-]\s*0(?![\d.\w])/g, '$1')
    .replace(/(^|[^\w.)\]}²³⁰¹⁴-⁹^\\])([-−]?)1(?=(?:<b>|\\hat\s?)?[a-df-zλ](?![a-zA-Z(]))/g, '$1$2');
}
/** Apply signs() to the text fields of a generated question. */
export const tidy = (p) => {
  for (const k of ['q', 'sol', 'hint', 'solution']) if (typeof p[k] === 'string') p[k] = signs(p[k]);
  if (Array.isArray(p.options)) p.options = p.options.map(signs);
  return p;
};
/** Run tidy() on the output of the listed problems of a file (other problems are left alone). */
export const tidyProblems = (set, ids) => {
  for (const id of ids) { const pr = set[id], mk = pr.make; pr.make = (r) => tidy(mk.call(pr, r)); }
  return set;
};
