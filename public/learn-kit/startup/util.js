// Shared helpers for the ML foundations live problems.
/** A random value from min to max in steps of `step`. */
export const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
/** Friendly number text (3 significant figures by default). */
export const n = (v, d = 3) => {
  const a = Math.abs(v);
  if (a !== 0 && (a >= 1e6 || a < 1e-3)) {
    const e = Math.floor(Math.log10(a)), m = v / 10 ** e;
    return `${+m.toPrecision(d)} × 10<sup>${e}</sup>`;
  }
  return (+v.toPrecision(d)).toLocaleString('en-CA', { maximumFractionDigits: 6 });
};
/** A numbered list of solution steps. */
export const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
/** A small HTML table from a header row and data rows. */
export const table = (head, rows) => `<table class="lk-tbl"><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
/** Money with a currency sign: m('in', 12345.6) → ₹12,346. */
export const m = (cc, v, d = 0) => `${v < 0 ? '−' : ''}${{ in: '₹', ca: '$', us: '$' }[cc]}${Math.abs(v).toLocaleString(cc === 'in' ? 'en-IN' : 'en-CA', { minimumFractionDigits: d, maximumFractionDigits: d })}`;
/** Tax on income through [upper limit, rate] bands (last limit Infinity). */
export const bands = (x, b) => { let t = 0, lo = 0; for (const [hi, r] of b) { if (x > lo) t += (Math.min(x, hi) - lo) * r; lo = hi; } return t; };
/** India new regime FY 2025-26: slab tax with the ₹12 lakh rebate (and marginal relief) plus 4 % cess. No surcharge (income under ₹50 lakh). */
export const IN_NEW = [[400000, 0], [800000, 0.05], [1200000, 0.1], [1600000, 0.15], [2000000, 0.2], [2400000, 0.25], [Infinity, 0.3]];
export const inTax = (x) => { let t = bands(x, IN_NEW); if (x <= 1200000) t = 0; else t = Math.min(t, x - 1200000); return t * 1.04; };
