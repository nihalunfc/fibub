// Shared helpers for the extra-variety templates (<topic>.more.gen.js). Not a topic file (leading underscore).
import { int, shuffle, round } from '../_util.js';

/**
 * Build an MSQ from candidate statements [text, isTrue, reason]. Picks 1-3 statements to be the answers and fills to n.
 * not = true asks for the statements that are NOT correct (the false ones become the answers).
 * Returns { options, answer, sol } where sol lists every shown statement with its verdict and reason.
 */
export function msqOf(r, cands, { n = 4, not = false } = {}) {
  const seen = new Set();
  const uniq = cands.filter((c) => (seen.has(c[0]) ? false : (seen.add(c[0]), true)));
  const want = uniq.filter((c) => c[1] !== not), other = uniq.filter((c) => c[1] === not);
  const maxW = Math.min(want.length, n - 1, 3), minW = Math.min(want.length, Math.max(1, n - other.length));
  const k = int(r, minW, Math.max(minW, maxW));
  const chosen = shuffle(r, [...shuffle(r, want).slice(0, k), ...shuffle(r, other).slice(0, n - k)]);
  const options = chosen.map((c) => c[0]);
  const answer = chosen.flatMap((c, i) => (c[1] !== not ? [i] : []));
  const head = not ? 'The answers are the statements that are false.' : 'The answers are the statements that are true.';
  const sol = `${head}<ul>${chosen.map((c) => `<li>${c[0]}: <b>${c[1] ? 'true' : 'false'}</b>. ${c[2]}</li>`).join('')}</ul>`;
  return { options, answer, sol };
}

/** Polynomial-style sum of terms [[coef, symbol]] as TeX: [[3,'x^2'],[-1,'xy'],[2,'']] -> "3x^2 - xy + 2". */
export function terms(list) {
  let s = '';
  for (const [c0, sym] of list) {
    const c = round(c0, 6);
    if (c === 0) continue;
    const a = Math.abs(c), body = sym ? (a === 1 ? sym : `${a}${sym}`) : `${a}`;
    s += s ? (c < 0 ? ` - ${body}` : ` + ${body}`) : (c < 0 ? `-${body}` : body);
  }
  return s || '0';
}

/** Greatest common divisor of integers. */
export const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };

/** A reduced fraction n/d as TeX (\tfrac), integers shown plainly. */
export function frac(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d); n /= g; d /= g;
  if (d === 1) return `${n}`;
  return `${n < 0 ? '-' : ''}\\tfrac{${Math.abs(n)}}{${d}}`;
}

/** Simpson's rule with n (even) panels. */
export function simpson(f, a, b, n = 2000) {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}

/** Root of f on [a, b] by bisection (f(a) and f(b) of opposite sign). */
export function bisect(f, a, b, it = 200) {
  let fa = f(a);
  for (let i = 0; i < it; i++) { const m = (a + b) / 2, fm = f(m); if ((fm < 0) === (fa < 0)) { a = m; fa = fm; } else b = m; }
  return (a + b) / 2;
}

/** Minimum of a unimodal f on [a, b] by golden-section search. Returns [x, f(x)]. */
export function goldenMin(f, a, b, it = 200) {
  const g = (Math.sqrt(5) - 1) / 2;
  let c = b - g * (b - a), d = a + g * (b - a);
  for (let i = 0; i < it; i++) { if (f(c) < f(d)) b = d; else a = c; c = b - g * (b - a); d = a + g * (b - a); }
  const x = (a + b) / 2; return [x, f(x)];
}

/** Classic RK4 for y' = f(t, y) (y an array) from t0 to t1 in n steps. Returns y(t1). */
export function rk4(f, y0, t0, t1, n = 2000) {
  let y = y0.slice(); const h = (t1 - t0) / n;
  for (let i = 0; i < n; i++) {
    const t = t0 + i * h;
    const k1 = f(t, y), k2 = f(t + h / 2, y.map((v, j) => v + (h / 2) * k1[j]));
    const k3 = f(t + h / 2, y.map((v, j) => v + (h / 2) * k2[j])), k4 = f(t + h, y.map((v, j) => v + h * k3[j]));
    y = y.map((v, j) => v + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
  }
  return y;
}
