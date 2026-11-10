// IUPAC temporary (systematic) names and symbols for elements with atomic number above 100, built digit by digit
// from Latin and Greek number roots (nil, un, bi, tri, quad, pent, hex, sept, oct, enn) plus "ium", and read back.
// The official names of elements 101 to 118 come from the site's element list. Plain TypeScript, no DOM.
import { TABLE, groupOf, periodOf } from './ptable.ts';
import { type Question, pick, one } from './h4quiz.ts';

export const ROOTS = ['nil', 'un', 'bi', 'tri', 'quad', 'pent', 'hex', 'sept', 'oct', 'enn'];

/** The parts of the name, one per digit, after the spelling rules, and the final name and symbol. */
export function tempName(z: number) {
  const digits = String(Math.trunc(z)).split('').map(Number);
  const parts = digits.map((d) => ROOTS[d]);
  // "enn" before "nil" drops one n (ennil); the final "i" of bi and tri is dropped before "ium"
  for (let i = 0; i < parts.length - 1; i++) if (parts[i] === 'enn' && parts[i + 1] === 'nil') parts[i] = 'en';
  let tail = 'ium';
  const last = parts.length - 1;
  if (parts[last] === 'bi' || parts[last] === 'tri') tail = 'um';
  const lower = parts.join('') + tail;
  return {
    digits, roots: digits.map((d) => ROOTS[d]), parts, tail,
    name: lower[0].toUpperCase() + lower.slice(1),
    symbol: digits.map((d) => ROOTS[d][0]).join('').replace(/^./, (c) => c.toUpperCase()),
  };
}

/** Atomic number from a temporary name (any case, spaces ignored), or null. Works for 3-digit numbers. */
export function fromName(name: string): number | null {
  const s = name.trim().toLowerCase().replace(/\s+/g, '');
  if (!s) return null;
  for (let z = 100; z <= 999; z++) if (tempName(z).name.toLowerCase() === s) return z;
  return null;
}
/** Atomic number from a temporary symbol such as Uue (any case), or null. */
export function fromSymbol(sym: string): number | null {
  const s = sym.trim().toLowerCase();
  if (!/^[nubtqphsoe]{3}$/.test(s)) return null;
  const map: Record<string, number> = { n: 0, u: 1, b: 2, t: 3, q: 4, p: 5, h: 6, s: 7, o: 8, e: 9 };
  const z = Number(s.split('').map((c) => map[c]).join(''));
  return z >= 100 ? z : null;
}

/** Official name and symbol (for Z ≤ 118) and where it sits in the table (period 8 starts at 119). */
export function placeOf(z: number) {
  const known = z <= TABLE.length ? TABLE[z - 1] : null;
  let where: string;
  if (z <= 118) { const g = groupOf(z); where = g === null ? `period ${periodOf(z)}, f-block (actinoids)` : `period ${periodOf(z)}, group ${g}`; }
  else if (z === 119) where = 'period 8, group 1 (expected below francium)';
  else if (z === 120) where = 'period 8, group 2 (expected below radium)';
  else where = 'period 8 or later; its place is not settled';
  return { official: known ? { name: known.name, symbol: known.symbol } : null, where };
}

// ---- Check yourself ---------------------------------------------------------------------------------
export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  for (let i = 0; i < 3; i++) {
    const z = i === 0 ? one(rng, [104, 109, 112, 114, 116, 118]) : pick(rng, 119, 999), t = tempName(z);
    qs.push({ text: `What is the atomic number of the element with the temporary name ${t.name} (symbol ${t.symbol})?`, ans: z, unit: '', work: `Read it root by root: ${t.roots.map((r, k) => `${r} = ${t.digits[k]}`).join(', ')}, so Z = ${z}.`, tol: 0.01 });
  }
  { const z = one(rng, [119, 120]);
    qs.push({ text: `Element ${z} would be called ${tempName(z).name}. In which period of the periodic table would it sit?`, ans: 8, unit: '', work: 'Period 7 ends with element 118 (oganesson), so elements 119 and 120 would start period 8.', tol: 0.01 });
  }
  return qs;
}
