// Divisibility test machine (#1239): the school divisibility rules for 2 to 11 worked on the digits as text (exact
// for long numbers), digit sums, alternating sums, digital roots and casting out nines. Plain TypeScript, no DOM.

export const DIVISORS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

/** Clean a typed whole number to its digits ("12,345" → "12345"); null if not a whole number. */
export function cleanDigits(s: string): string | null {
  const t = s.replace(/[\s,_]/g, '');
  if (!/^\d+$/.test(t)) return null;
  return t.replace(/^0+(?=\d)/, '');
}

export const digitSum = (s: string) => s.split('').reduce((a, c) => a + Number(c), 0);

/** Alternating sum from the ones digit: ones − tens + hundreds − ... */
export const altSum = (s: string) => s.split('').reverse().reduce((a, c, i) => a + (i % 2 ? -1 : 1) * Number(c), 0);

/** The chain of digit sums down to one digit, e.g. "98765" → [35, 8]. Empty for a one-digit number. */
export function digitSumChain(s: string): number[] {
  const out: number[] = [];
  let t = s;
  while (t.length > 1) { const v = digitSum(t); out.push(v); t = String(v); }
  return out;
}

/** Digital root: 0 for 0, otherwise 1 to 9 (9 when the number is a multiple of 9). */
export const digitalRoot = (s: string) => { const n = BigInt(s); return n === 0n ? 0 : Number(((n - 1n) % 9n) + 1n); };

/** The 7 rule: drop the last digit and subtract twice it, until the number is small. Returns the chain. */
export function chain7(s: string): { from: bigint; a: bigint; b: bigint; to: bigint }[] {
  const out: { from: bigint; a: bigint; b: bigint; to: bigint }[] = [];
  let n = BigInt(s);
  while (n >= 70n || n <= -70n) {
    const neg = n < 0n, m = neg ? -n : n, a = m / 10n, b = m % 10n, to = a - 2n * b;
    out.push({ from: n, a, b, to: neg ? -to : to });
    n = neg ? -to : to;
  }
  return out;
}

export type Verdict = { d: number; yes: boolean; rem: number; test: string; why: string };

/** Apply the school rule for d to the digits s. `test` is the small number the rule looks at. */
export function rule(s: string, d: number): Verdict {
  const n = BigInt(s), rem = Number(n % BigInt(d)), yes = rem === 0, last = (k: number) => s.slice(-k).replace(/^0+(?=\d)/, '');
  switch (d) {
    case 2: return { d, yes, rem, test: last(1), why: `Look at the ones digit, ${last(1)}: it is ${yes ? '' : 'not '}even (0, 2, 4, 6, 8).` };
    case 5: return { d, yes, rem, test: last(1), why: `The ones digit is ${last(1)}: ${yes ? 'it is' : 'not'} 0 or 5.` };
    case 10: return { d, yes, rem, test: last(1), why: `The ones digit is ${last(1)}: ${yes ? 'it is' : 'not'} 0.` };
    case 4: return { d, yes, rem, test: last(2), why: `The last two digits make ${last(2)}, and ${last(2)} ${yes ? 'is' : 'is not'} a multiple of 4.` };
    case 8: return { d, yes, rem, test: last(3), why: `The last three digits make ${last(3)}, and ${last(3)} ${yes ? 'is' : 'is not'} a multiple of 8.` };
    case 3: case 9: { const ds = digitSum(s); return { d, yes, rem, test: String(ds), why: `Digit sum ${s.length > 1 ? s.split('').join(' + ') + ' = ' : ''}${ds}, which ${ds % d === 0 ? 'is' : 'is not'} a multiple of ${d}.` }; }
    case 6: { const ev = Number(s.slice(-1)) % 2 === 0, ds = digitSum(s), t3 = ds % 3 === 0; return { d, yes, rem, test: String(ds), why: `It must pass both 2 and 3. Even? ${ev ? 'yes' : 'no'}. Digit sum ${ds} a multiple of 3? ${t3 ? 'yes' : 'no'}.` }; }
    case 11: { const a = altSum(s); return { d, yes, rem, test: String(a), why: `Alternating sum from the right (+ − + …) = ${a}, which ${a % 11 === 0 ? 'is' : 'is not'} a multiple of 11.` }; }
    default: { const c = chain7(s), end = c.length ? c[c.length - 1].to : n; return { d, yes, rem, test: String(end), why: c.length ? `Drop the last digit and take away twice it: ${c.map((x) => `${x.a} − 2 × ${x.b} = ${x.to}`).join('; ')}. ${end} ${end % 7n === 0n ? 'is' : 'is not'} a multiple of 7.` : `${s} is small: check it directly. ${yes ? 'It is' : 'It is not'} a multiple of 7.` }; }
  }
}

/** Place value split for the 9 (and 3) rule: each digit d at place k is d × (10ᵏ − 1) + d. */
export const nineSplit = (s: string) => s.split('').map((c, i) => { const k = s.length - 1 - i; return { d: Number(c), k, nines: '9'.repeat(k) || '0' }; });

/** Place value split for the 11 rule: 10ᵏ = (multiple of 11) + 1 when k is even, − 1 when k is odd. */
export const elevenSplit = (s: string) => s.split('').map((c, i) => { const k = s.length - 1 - i; return { d: Number(c), k, sign: k % 2 ? -1 : 1 }; });
