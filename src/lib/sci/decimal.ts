// Rounding numbers as they are written, digit by digit, so 1.005 to two decimals is 1.01 (as on paper and in
// Excel), not 1.00 (what binary floating point gives). Half rounds away from zero. Plain TypeScript, no DOM.

/** A decimal number: sign, its significant digits (no leading zeros; "" for zero) and the power of ten of the last digit. */
export type Dec = { neg: boolean; d: string; e: number };

const NUM = /^([-+−]?)(\d*)(?:\.(\d*))?(?:[eE]([-+−]?\d+))?$/;

/**
 * Read a number as typed: "12.50", "-0.003", "1.2e-5", "1,234.5" (thousands commas), "−4" (minus sign).
 * Returns null when it is not a plain number.
 */
export function parseDec(text: string): Dec | null {
  let t = text.trim().replace(/[\s\u00a0\u2009\u202f']/g, '');
  if (/^[-+−]?\d{1,3}(,\d{3})+(\.\d*)?([eE][-+−]?\d+)?$/.test(t)) t = t.replace(/,/g, '');
  const m = NUM.exec(t);
  if (!m || (!m[2] && !m[3])) return null;
  const int = m[2] ?? '', frac = m[3] ?? '';
  if (!int && !frac) return null;
  const exp = m[4] ? Number(m[4].replace('−', '-')) : 0;
  let d = (int + frac).replace(/^0+/, '');
  let e = exp - frac.length;
  if (!d) return { neg: false, d: '', e };
  return { neg: m[1] === '-' || m[1] === '−', d, e };
}

/** Round so the last digit kept is at 10^k, half away from zero. Digits already finer than that are kept as they are. */
export function roundAt(x: Dec, k: number): Dec {
  if (x.e >= k || !x.d) return x.d ? x : { neg: false, d: '', e: Math.min(x.e, k) };
  const drop = k - x.e; // digits to remove
  if (drop > x.d.length) return { neg: false, d: '', e: k };
  const keep = x.d.slice(0, x.d.length - drop), next = x.d[x.d.length - drop];
  let digits = keep || '0';
  if (next >= '5') {
    // add one to the kept digits
    const arr = digits.split('').map(Number);
    let j = arr.length - 1;
    while (j >= 0) { if (arr[j] === 9) { arr[j] = 0; j--; } else { arr[j]++; break; } }
    if (j < 0) arr.unshift(1);
    digits = arr.join('');
  }
  digits = digits.replace(/^0+/, '');
  return digits ? { neg: x.neg, d: digits, e: k } : { neg: false, d: '', e: k };
}

/** Power of ten of the leading digit (0 for 1 to 9.99, -3 for 0.00123). NaN for zero. */
export const lead = (x: Dec) => (x.d ? x.e + x.d.length - 1 : NaN);

/** Round to n significant figures (n ≥ 1). Zero stays zero. */
export function roundSig(x: Dec, n: number): Dec {
  if (!x.d) return x;
  const k = lead(x) - n + 1;
  let r = roundAt(x, k);
  // 9.99 to 2 figures carries to 10.0: drop the extra digit so 10 has 2 figures.
  if (r.d.length > n) r = { ...r, d: r.d.slice(0, n), e: r.e + (r.d.length - n) };
  // Pad to n digits (2.5 to 3 figures is 2.50).
  if (r.d.length < n) r = { ...r, d: r.d + '0'.repeat(n - r.d.length), e: r.e - (n - r.d.length) };
  return r;
}

/** Plain decimal text with at least `minDec` decimals (the digits after the point follow e). Uses "-" for minus. */
export function fixed(x: Dec, minDec = 0): string {
  let d = x.d || '0', e = x.d ? x.e : Math.min(0, -minDec);
  if (!x.d) { d = '0'; e = 0; }
  const decs = Math.max(0, -e, minDec);
  // Scale so the digit string has exactly `decs` decimals.
  if (-e < decs) { d = d + '0'.repeat(decs + e); e = -decs; }
  if (e > 0) { d = d + '0'.repeat(e); e = 0; }
  const n = -e;
  if (d.length <= n) d = '0'.repeat(n - d.length + 1) + d;
  const s = n ? `${d.slice(0, d.length - n)}.${d.slice(d.length - n)}` : d;
  return (x.neg && x.d ? '-' : '') + s;
}

/** Rounded to `decimals` places as text, e.g. toFixedDec("1.005", 2) = "1.01". Null when not a number. */
export function toFixedDec(text: string, decimals: number): string | null {
  const x = parseDec(text);
  if (!x) return null;
  const r = roundAt(x, -decimals);
  return fixed(r.d ? r : { neg: false, d: '', e: -decimals }, decimals);
}

/** Rounded to n significant figures as plain text, keeping trailing zeros that count ("2.50"). Null when not a number. */
export function toSigDec(text: string, n: number): string | null {
  const x = parseDec(text);
  if (!x) return null;
  if (!x.d) return n > 1 ? '0.' + '0'.repeat(n - 1) : '0';
  const r = roundSig(x, n);
  return fixed(r, Math.max(0, -r.e));
}

/** Mantissa and exponent of a rounded number for scientific notation: 0.000123 to 2 figures is ["1.2", -4]. */
export function sciParts(x: Dec, n: number, step = 1): { m: string; p: number } {
  if (!x.d) return { m: n > 1 ? '0.' + '0'.repeat(n - 1) : '0', p: 0 };
  const r = roundSig(x, n);
  const L = lead(r);
  const p = Math.floor(L / step) * step; // step 3 gives engineering notation
  const m: Dec = { neg: r.neg, d: r.d, e: r.e - p };
  return { m: fixed(m, Math.max(0, -m.e)), p };
}

/** A Dec as a JavaScript number (for sorting and checks, not for printing). */
export const toNumber = (x: Dec) => (x.d ? (x.neg ? -1 : 1) * Number(`${x.d}e${x.e}`) : 0);
