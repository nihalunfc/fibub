// Shared helpers for the SQL and data modelling live problems.
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
/** A small SQL result-style table from objects (keys become the header). */
export const rows = (objs) => table(Object.keys(objs[0] ?? {}), objs.map((o) => Object.values(o).map((v) => (v == null ? '<i>NULL</i>' : v))));
/** Code shown in a problem. */
export const code = (s) => `<pre class="lk-code"><code>${s.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</code></pre>`;
