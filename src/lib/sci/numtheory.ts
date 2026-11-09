// Exact number theory with BigInt: reading integer expressions, primality (Miller-Rabin, proven for n below
// 3.3 × 10^24, Baillie-PSW above), factorisation (trial division, then Pollard rho with Brent's cycle finding),
// gcd and lcm, extended Euclid, modular inverse and power, the Chinese remainder theorem (moduli need not be
// coprime), Euler's phi, Möbius mu, divisors and sigma, and continued fractions with their convergents.
// Plain TypeScript, no DOM. Checked against sympy in tests/sci-tools/number-theory-toolkit.mjs.

export const abs = (a: bigint) => (a < 0n ? -a : a);
/** Remainder in 0..m-1 for any sign of a (m > 0). */
export const mod = (a: bigint, m: bigint) => { const r = a % m; return r < 0n ? r + m : r; };

// ---------- Reading integers ----------
/**
 * An integer typed by a person, exactly: digits (spaces, commas and underscores ignored), and the operators
 * + − × ÷ (exact only), ^ (power), ! (factorial) and brackets, e.g. "2^127 - 1", "10! + 1", "3 × 5^4".
 */
export function parseInteger(src: string): bigint {
  const s = src.replace(/[−–]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/\*\*/g, '^').replace(/(\d)[,_ ](?=\d)/g, '$1').trim();
  if (!s) throw new Error('Type a whole number.');
  let i = 0;
  const peek = () => { while (s[i] === ' ') i++; return s[i]; };
  const fail = (m?: string): never => { throw new Error(m ?? `Could not read "${src.trim()}" as a whole number. Use digits and + − × ÷ ^ ! ( ).`); };
  const atom = (): bigint => {
    const c = peek();
    if (c === '(') { i++; const v = sum(); if (peek() !== ')') fail(); i++; return post(v); }
    const m = /^\d+/.exec(s.slice(i));
    if (!m) fail();
    i += m![0].length;
    if (m![0].length > 4000) fail('That number is too long (4000 digits at most).');
    return post(BigInt(m![0]));
  };
  const post = (v: bigint): bigint => {
    while (peek() === '!') { i++; if (v > 5000n) fail('Factorials up to 5000! only.'); let f = 1n; for (let k = 2n; k <= v; k++) f *= k; v = f; }
    return v;
  };
  const unary = (): bigint => { const c = peek(); if (c === '-') { i++; return -unary(); } if (c === '+') { i++; return unary(); } return power(); };
  const power = (): bigint => {
    const b = atom();
    if (peek() === '^') {
      i++; const e = unary();
      if (e < 0n) fail('Negative powers are not whole numbers.');
      if (abs(b) > 1n && e * BigInt(abs(b).toString(2).length) > 20000n) fail('That power is too large (about 6000 digits at most).');
      return b ** e;
    }
    return b;
  };
  const prod = (): bigint => {
    let v = unary();
    for (;;) {
      const c = peek();
      if (c === '*') { i++; v *= unary(); }
      else if (c === '/') { i++; const d = unary(); if (d === 0n) fail('Division by zero.'); if (v % d !== 0n) fail('That division does not give a whole number.'); v /= d; }
      else if (c === '%') { i++; const d = unary(); if (d === 0n) fail('Division by zero.'); v %= d; }
      else return v;
    }
  };
  const sum = (): bigint => {
    let v = prod();
    for (;;) { const c = peek(); if (c === '+') { i++; v += prod(); } else if (c === '-') { i++; v -= prod(); } else return v; }
  };
  const v = sum();
  if (peek() !== undefined) fail();
  return v;
}
/** A list of integers separated by commas, semicolons or new lines (each may be an expression like 2^5 − 1). */
export function parseList(src: string): bigint[] {
  return src.split(/[,;\n\t]/).map((t) => t.trim()).filter(Boolean).map(parseInteger);
}

// ---------- Basic arithmetic ----------
export function gcd(a: bigint, b: bigint): bigint { a = abs(a); b = abs(b); while (b) [a, b] = [b, a % b]; return a; }
export function lcm(a: bigint, b: bigint): bigint { return a === 0n || b === 0n ? 0n : abs(a / gcd(a, b) * b); }
export const gcdAll = (xs: bigint[]) => xs.reduce(gcd, 0n);
export const lcmAll = (xs: bigint[]) => xs.reduce(lcm, 1n);

export type EuclidStep = { q: bigint; r: bigint; s: bigint; t: bigint };
/** Extended Euclid: g = gcd(a, b) and x, y with a·x + b·y = g, plus the table of steps (r = a·s + b·t on each row). */
export function egcd(a: bigint, b: bigint): { g: bigint; x: bigint; y: bigint; steps: EuclidStep[] } {
  let [r0, r1] = [a, b], [s0, s1] = [1n, 0n], [t0, t1] = [0n, 1n];
  const steps: EuclidStep[] = [{ q: 0n, r: r0, s: s0, t: t0 }, { q: 0n, r: r1, s: s1, t: t1 }];
  while (r1 !== 0n) {
    const q = r0 / r1;
    [r0, r1] = [r1, r0 - q * r1]; [s0, s1] = [s1, s0 - q * s1]; [t0, t1] = [t1, t0 - q * t1];
    steps.push({ q, r: r1, s: s1, t: t1 });
  }
  if (r0 < 0n) { r0 = -r0; s0 = -s0; t0 = -t0; }
  return { g: r0, x: s0, y: t0, steps };
}
/** Inverse of a modulo m (m ≥ 1), or null when gcd(a, m) ≠ 1. */
export function modInv(a: bigint, m: bigint): bigint | null {
  if (m < 1n) throw new Error('The modulus must be 1 or more.');
  const { g, x } = egcd(mod(a, m), m);
  return g === 1n ? mod(x, m) : null;
}
/** a^e mod m by repeated squaring; a negative e uses the inverse (null if there is none). */
export function modPow(a: bigint, e: bigint, m: bigint): bigint | null {
  if (m < 1n) throw new Error('The modulus must be 1 or more.');
  if (e < 0n) { const inv = modInv(a, m); if (inv === null) return null; a = inv; e = -e; }
  let r = 1n % m, b = mod(a, m);
  while (e > 0n) { if (e & 1n) r = r * b % m; b = b * b % m; e >>= 1n; }
  return r;
}
/** Floor of the square root of n ≥ 0. */
export function isqrt(n: bigint): bigint {
  if (n < 0n) throw new Error('Square root of a negative number.');
  if (n < 2n) return n;
  let x = 1n << BigInt((n.toString(2).length + 1) >> 1);
  for (;;) { const y = (x + n / x) >> 1n; if (y >= x) return x; x = y; }
}
export const isSquare = (n: bigint) => n >= 0n && isqrt(n) ** 2n === n;

// ---------- Primality ----------
const SMALL: number[] = (() => { const N = 10000, s = new Uint8Array(N + 1), p: number[] = []; for (let i = 2; i <= N; i++) if (!s[i]) { p.push(i); for (let j = i * i; j <= N; j += i) s[j] = 1; } return p; })();
export const SMALL_PRIMES = SMALL;
/** Below this, Miller-Rabin with the first 13 prime bases (2 to 41) is a proof (Sorenson and Webster, 2015). */
export const MR_PROVEN = 3317044064679887385961981n;

function strongProbablePrime(n: bigint, a: bigint): boolean {
  let d = n - 1n, s = 0;
  while (!(d & 1n)) { d >>= 1n; s++; }
  let x = modPow(a, d, n)!;
  if (x === 1n || x === n - 1n) return true;
  for (let r = 1; r < s; r++) { x = x * x % n; if (x === n - 1n) return true; if (x === 1n) return false; }
  return false;
}
function jacobi(a: bigint, n: bigint): number {
  a = mod(a, n); let t = 1;
  while (a !== 0n) {
    while (!(a & 1n)) { a >>= 1n; const r = n % 8n; if (r === 3n || r === 5n) t = -t; }
    [a, n] = [n, a];
    if (a % 4n === 3n && n % 4n === 3n) t = -t;
    a %= n;
  }
  return n === 1n ? t : 0;
}
/** Strong Lucas probable prime test with Selfridge's parameters (n odd, not a square). */
export function strongLucas(n: bigint): boolean {
  let D = 5n;
  for (;;) { const j = jacobi(D, n); if (j === -1) break; if (j === 0 && abs(D) !== n) return false; D = D > 0n ? -(D + 2n) : -D + 2n; }
  const P = 1n, Q = (1n - D) / 4n;
  let d = n + 1n, s = 0;
  while (!(d & 1n)) { d >>= 1n; s++; }
  const half = (x: bigint) => { x = mod(x, n); if (x & 1n) x += n; return x / 2n; };
  // Binary Lucas chain for U_d, V_d, Q^d.
  let U = 0n, V = 2n, Qk = 1n;
  for (const bit of d.toString(2)) {
    // double
    U = mod(U * V, n); V = mod(V * V - 2n * Qk, n); Qk = mod(Qk * Qk, n);
    if (bit === '1') {
      const U2 = half(P * U + V), V2 = half(D * U + P * V);
      U = U2; V = V2; Qk = mod(Qk * Q, n);
    }
  }
  if (U === 0n || V === 0n) return true;
  for (let r = 1; r < s; r++) { V = mod(V * V - 2n * Qk, n); Qk = mod(Qk * Qk, n); if (V === 0n) return true; }
  return false;
}
/** Is n prime? `proof` says whether the answer is certain (always for composites and for n < 3.3 × 10^24). */
export function primality(n: bigint): { prime: boolean; proven: boolean; method: string } {
  if (n < 2n) return { prime: false, proven: true, method: 'Numbers below 2 are not prime.' };
  for (const p of SMALL.slice(0, 168)) { const b = BigInt(p); if (n === b) return { prime: true, proven: true, method: 'A small prime.' }; if (n % b === 0n) return { prime: false, proven: true, method: `Divisible by ${p}.` }; }
  if (n < 1000000n) return { prime: true, proven: true, method: 'No prime factor up to its square root (trial division).' };
  if (n < MR_PROVEN) {
    for (const a of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n]) if (!strongProbablePrime(n, a)) return { prime: false, proven: true, method: `Miller-Rabin: ${a} is a witness that it is composite.` };
    return { prime: true, proven: true, method: 'Miller-Rabin with the 13 prime bases 2 to 41, which is a proof below 3.3 × 10^24.' };
  }
  if (!strongProbablePrime(n, 2n)) return { prime: false, proven: true, method: 'Miller-Rabin: 2 is a witness that it is composite.' };
  if (isSquare(n)) return { prime: false, proven: true, method: 'It is a perfect square.' };
  if (!strongLucas(n)) return { prime: false, proven: true, method: 'Strong Lucas test fails, so it is composite.' };
  for (const a of [3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n]) if (!strongProbablePrime(n, a)) return { prime: false, proven: true, method: `Miller-Rabin: ${a} is a witness that it is composite.` };
  return { prime: true, proven: false, method: 'Baillie-PSW and Miller-Rabin with 13 bases: a probable prime. No number is known that passes these and is composite, but above 3.3 × 10^24 this is not a proof.' };
}
export const isPrime = (n: bigint) => primality(n).prime;
export function nextPrime(n: bigint): bigint { let p = n < 2n ? 2n : n + 1n; if (p > 2n && !(p & 1n)) p++; while (!isPrime(p)) p += p === 2n ? 1n : 2n; return p; }
export function prevPrime(n: bigint): bigint | null { if (n <= 2n) return null; let p = n - 1n; if (p > 2n && !(p & 1n)) p--; while (p >= 2n && !isPrime(p)) p -= p === 3n ? 1n : 2n; return p >= 2n ? p : null; }

// ---------- Factorisation ----------
/** One non-trivial factor of composite n by Pollard rho (Brent), or null if the budget runs out. */
export function pollardRho(n: bigint, deadline: number): bigint | null {
  if (!(n & 1n)) return 2n;
  for (let c = 1n; c < 50n; c++) {
    let y = 2n, r = 1, q = 1n, g = 1n, x = 0n, ys = 0n;
    const f = (v: bigint) => (v * v + c) % n;
    const m = 128;
    do {
      x = y;
      for (let i = 0; i < r; i++) y = f(y);
      let k = 0;
      do {
        ys = y;
        for (let i = 0; i < Math.min(m, r - k); i++) { y = f(y); q = q * abs(x - y) % n; }
        g = gcd(q, n); k += m;
        if (Date.now() > deadline) return null;
      } while (k < r && g === 1n);
      r *= 2;
    } while (g === 1n);
    if (g === n) { do { ys = f(ys); g = gcd(abs(x - ys), n); } while (g === 1n); }
    if (g !== n) return g;
  }
  return null;
}
export type Factorisation = { n: bigint; factors: [bigint, number][]; unfactored: bigint[]; complete: boolean; probable: boolean };
/**
 * Prime factorisation of |n| (n ≠ 0): trial division by primes below 10 000, then Pollard rho on what is left.
 * Parts that rho could not split within `ms` milliseconds are listed in `unfactored`. `probable` is true when a
 * "prime" factor above 3.3 × 10^24 is only a probable prime.
 */
export function factorise(n: bigint, ms = 1500): Factorisation {
  if (n === 0n) throw new Error('0 has no prime factorisation.');
  const out = new Map<bigint, number>(), add = (p: bigint, k = 1) => out.set(p, (out.get(p) ?? 0) + k);
  let m = abs(n), probable = false;
  for (const pn of SMALL) {
    const p = BigInt(pn);
    if (p * p > m) break;
    while (m % p === 0n) { add(p); m /= p; }
  }
  const unfactored: bigint[] = [], deadline = Date.now() + ms;
  const stack = m > 1n ? [m] : [];
  while (stack.length) {
    const x = stack.pop()!;
    const pr = primality(x);
    if (pr.prime) { add(x); if (!pr.proven) probable = true; continue; }
    // Perfect powers first: rho is slow on them.
    let split = false;
    for (let k = 2; k <= 64 && !split; k++) {
      const r = iroot(x, k);
      if (r > 1n && r ** BigInt(k) === x) { for (let j = 0; j < k; j++) stack.push(r); split = true; }
    }
    if (split) continue;
    const d = pollardRho(x, deadline);
    if (d === null) unfactored.push(x); else stack.push(d, x / d);
  }
  const factors = [...out.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
  return { n, factors, unfactored: unfactored.sort((a, b) => (a < b ? -1 : 1)), complete: unfactored.length === 0, probable };
}
/** Floor of the k-th root of x ≥ 0. */
export function iroot(x: bigint, k: number): bigint {
  if (x < 2n || k === 1) return x;
  const K = BigInt(k);
  let r = 1n << BigInt(Math.ceil(x.toString(2).length / k));
  for (;;) { const y = ((K - 1n) * r + x / r ** (K - 1n)) / K; if (y >= r) break; r = y; }
  while (r ** K > x) r--;
  while ((r + 1n) ** K <= x) r++;
  return r;
}

// ---------- Functions of the factorisation ----------
export function phiOf(f: [bigint, number][]): bigint { return f.reduce((acc, [p, k]) => acc * (p - 1n) * p ** BigInt(k - 1), 1n); }
export function sigmaOf(f: [bigint, number][], power = 1): bigint {
  const P = BigInt(power);
  return f.reduce((acc, [p, k]) => { let s = 0n; for (let j = 0; j <= k; j++) s += p ** (P * BigInt(j)); return acc * s; }, 1n);
}
export const tauOf = (f: [bigint, number][]) => f.reduce((acc, [, k]) => acc * BigInt(k + 1), 1n);
export const muOf = (f: [bigint, number][]) => (f.some(([, k]) => k > 1) ? 0 : f.length % 2 ? -1 : 1);
/** Carmichael's lambda: the exponent of the group of units mod n. */
export function lambdaOf(f: [bigint, number][]): bigint {
  return f.reduce((acc, [p, k]) => {
    const l = p === 2n && k >= 3 ? 2n ** BigInt(k - 2) : (p - 1n) * p ** BigInt(k - 1);
    return lcm(acc, l);
  }, 1n);
}
/** All positive divisors in order, or null if there would be more than `max`. */
export function divisorsOf(f: [bigint, number][], max = 100000): bigint[] | null {
  if (tauOf(f) > BigInt(max)) return null;
  let ds = [1n];
  for (const [p, k] of f) { const next: bigint[] = []; for (const d of ds) { let pp = 1n; for (let j = 0; j <= k; j++) { next.push(d * pp); pp *= p; } } ds = next; }
  return ds.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}
export function phi(n: bigint): bigint { const f = factorise(n, 5000); if (!f.complete) throw new Error('Could not factorise.'); return n === 1n ? 1n : phiOf(f.factors); }
/** Multiplicative order of a modulo n (gcd(a, n) = 1), from the factorisation of lambda(n). */
export function orderOf(a: bigint, n: bigint, fn: [bigint, number][]): bigint | null {
  if (n === 1n) return 1n;
  if (gcd(a, n) !== 1n) return null;
  let o = lambdaOf(fn);
  const fo = factorise(o, 2000);
  if (!fo.complete) return null;
  for (const [p] of fo.factors) while (o % p === 0n && modPow(a, o / p, n) === 1n) o /= p;
  return o;
}

// ---------- Chinese remainder theorem ----------
/** Solve x ≡ r_i (mod m_i) for all i. Moduli need not be coprime. Returns x in 0..M−1 and M, or null if no solution. */
export function crt(rs: bigint[], ms: bigint[]): { x: bigint; m: bigint } | null {
  let x = 0n, M = 1n;
  for (let i = 0; i < rs.length; i++) {
    const m = ms[i];
    if (m < 1n) throw new Error('Each modulus must be 1 or more.');
    const r = mod(rs[i], m);
    const { g, x: p } = egcd(M, m);
    if ((r - x) % g !== 0n) return null;
    const step = m / g;
    const k = mod((r - x) / g * p, step);
    x = x + M * k; M = M * step; x = mod(x, M);
  }
  return { x, m: M };
}
/** Solve a·x ≡ b (mod m): all solutions are x0 + k·step, there are g = gcd(a, m) of them below m (or none). */
export function linearCongruence(a: bigint, b: bigint, m: bigint): { x0: bigint; step: bigint; count: bigint } | null {
  if (m < 1n) throw new Error('The modulus must be 1 or more.');
  const g = gcd(a, m);
  if (g === 0n || mod(b, g) !== 0n) return null;
  const mm = m / g, inv = modInv(a / g, mm)!;
  return { x0: mod(b / g * inv, mm), step: mm, count: g };
}

// ---------- Continued fractions ----------
/** Simple continued fraction of p/q (q ≠ 0), exact; the last term is ≥ 2 unless the number is an integer. */
export function cfRational(p: bigint, q: bigint): bigint[] {
  if (q === 0n) throw new Error('The denominator cannot be 0.');
  if (q < 0n) { p = -p; q = -q; }
  const out: bigint[] = [];
  while (q !== 0n) { let a = p / q; if (p % q !== 0n && p < 0n) a -= 1n; out.push(a); [p, q] = [q, p - a * q]; }
  return out;
}
/** Continued fraction of √n: [a0; period], where the period repeats for ever (empty when n is a square). */
export function cfSqrt(n: bigint, maxPeriod = 10000): { a0: bigint; period: bigint[]; truncated: boolean } {
  if (n < 0n) throw new Error('Square root of a negative number.');
  const a0 = isqrt(n);
  if (a0 * a0 === n) return { a0, period: [], truncated: false };
  let m = 0n, d = 1n, a = a0; const period: bigint[] = [];
  while (period.length < maxPeriod) {
    m = d * a - m; d = (n - m * m) / d; a = (a0 + m) / d;
    period.push(a);
    if (a === 2n * a0) return { a0, period, truncated: false };
  }
  return { a0, period, truncated: true };
}
/** Terms that are certain for every number between lo and hi (both p/q with q > 0): used for π and e from long decimals. */
export function cfInterval(p1: bigint, q1: bigint, p2: bigint, q2: bigint, max = 200): bigint[] {
  const out: bigint[] = [];
  while (q1 !== 0n && q2 !== 0n && out.length < max) {
    const fl = (p: bigint, q: bigint) => { let a = p / q; if (p % q !== 0n && (p < 0n) !== (q < 0n)) a -= 1n; return a; };
    const a = fl(p1, q1), b = fl(p2, q2);
    if (a !== b) break;
    out.push(a);
    [p1, q1] = [q1, p1 - a * q1]; [p2, q2] = [q2, p2 - b * q2];
  }
  return out;
}
/** Convergents h_k / k_k of a continued fraction. */
export function convergents(a: bigint[]): [bigint, bigint][] {
  const out: [bigint, bigint][] = [];
  let h0 = 1n, h1 = 0n, k0 = 0n, k1 = 1n;
  for (const t of a) { const h = t * h0 + h1, k = t * k0 + k1; out.push([h, k]); h1 = h0; h0 = h; k1 = k0; k0 = k; }
  return out;
}
/** A decimal like "-3.14159" or "2.5e-3" as an exact fraction p/q in lowest terms. */
export function decimalToFraction(s: string): [bigint, bigint] {
  const m = /^\s*([-+]?)(\d*)(?:\.(\d*))?(?:e([-+]?\d+))?\s*$/i.exec(s.replace(/[−–]/g, '-'));
  if (!m || !(m[2] || m[3])) throw new Error(`"${s.trim()}" is not a decimal number.`);
  const digits = (m[2] || '') + (m[3] || ''), e = Number(m[4] || 0) - (m[3] || '').length;
  if (Math.abs(e) > 2000 || digits.length > 2000) throw new Error('That number is too long.');
  let p = BigInt(digits || '0'), q = 1n;
  if (e >= 0) p *= 10n ** BigInt(e); else q = 10n ** BigInt(-e);
  if (m[1] === '-') p = -p;
  const g = gcd(p, q) || 1n;
  return [p / g, q / g];
}
/** π and e to 100 decimal places (mathematical constants), for continued fractions with only certain terms. */
export const PI_100 = '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';
export const E_100 = '2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274';
/** Certain continued-fraction terms of a constant known to the given decimals (the true value lies within ±1 in the last place). */
export function cfConstant(dec: string): bigint[] {
  const [p, q] = decimalToFraction(dec);
  return cfInterval(p - 1n, q, p + 1n, q);
}

/** Write a factorisation as "2^3 × 3 × 5". */
export function factorText(f: [bigint, number][], unfactored: bigint[] = [], sign = 1n): string {
  const parts = f.map(([p, k]) => (k > 1 ? `${p}^${k}` : `${p}`)).concat(unfactored.map((u) => `(${u})`));
  return (sign < 0n ? '−1 × ' : '') + (parts.join(' × ') || '1');
}

/** Smallest x, y > 0 with x² − n·y² = 1 (Pell's equation), from the continued fraction of √n; null when n is a square. */
export function pell(n: bigint): { x: bigint; y: bigint } | null {
  const { a0, period, truncated } = cfSqrt(n);
  if (!period.length || truncated) return null;
  const L = period.length, terms = [a0];
  const want = L % 2 === 0 ? L : 2 * L;
  for (let i = 0; i < want - 1; i++) terms.push(period[i % L]);
  const [x, y] = convergents(terms).at(-1)!;
  return { x, y };
}
/** p/q as a decimal string with `digits` places, rounded toward zero, with "…" when it does not end. */
export function fracDecimal(p: bigint, q: bigint, digits = 15): string {
  if (q < 0n) { p = -p; q = -q; }
  const neg = p < 0n; let a = abs(p);
  const ip = a / q; let r = a % q, s = '';
  for (let i = 0; i < digits && r; i++) { r *= 10n; s += String(r / q); r %= q; }
  return (neg ? '−' : '') + ip + (s ? '.' + s : '') + (r ? '…' : '');
}
