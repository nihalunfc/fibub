// Password strength estimator. Plain TypeScript, no DOM. Nothing here stores or sends a password.
// A short built-in list of passwords and password words that turn up again and again in leaked password lists.
const COMMON = ('password passw0rd 123456 12345678 123456789 1234567890 12345 1234567 qwerty qwertyuiop 111111 000000 123123 abc123 ' +
  'iloveyou admin welcome monkey dragon letmein football baseball basketball soccer hockey master sunshine princess shadow ' +
  'superman batman michael jordan charlie donald freedom whatever trustno1 starwars hello login access secret mustang ' +
  'jennifer hunter ranger buster thomas tigger robert soccer harley andrew matthew daniel jessica ashley summer winter ' +
  'computer internet pokemon cheese chocolate butterfly flower purple orange banana cookie pepper ginger maggie ' +
  'liverpool chelsea arsenal manchester india canada london toronto delhi mumbai pakistan dubai america ' +
  'samsung google apple iphone facebook instagram youtube twitter microsoft killer killer1 qazwsx zaq12wsx ' +
  'asdfgh asdfghjkl zxcvbnm zxcvbn 1q2w3e4r 1qaz2wsx qwer1234 aa123456 password1 password123 admin123 root toor ' +
  'changeme default guest test test123 love lovely loveme angel angels baby babygirl family friends forever ' +
  'blessed jesus christ heaven god allah nothing anything monday tuesday sunday january august ' +
  'football1 hello123 welcome1 letmein1 666666 654321 7777777 888888 999999 121212 112233 696969 ' +
  'naruto anime ninja tiger lion eagle wolf bailey cooper buddy rocky lucky diamond silver golden ' +
  'money cash dollar rich mercedes ferrari porsche corvette yankees cowboys lakers warriors').split(' ');
export const LIST = [...new Set(COMMON)];
const ROWS = ['1234567890', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm', 'qazwsxedcrfvtgbyhnujmikolp'];
const LEET: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b', '9': 'g', '@': 'a', '$': 's', '!': 'i', '+': 't' };

export type M = { s: number; e: number; bits: number; why: string };
export const poolOf = (pw: string) => {
  let p = 0;
  if (/[a-z]/.test(pw)) p += 26; if (/[A-Z]/.test(pw)) p += 26; if (/[0-9]/.test(pw)) p += 10;
  if (/ /.test(pw)) p += 1; if (/[!-/:-@[-`{-~]/.test(pw)) p += 32; // a space adds one character, not the whole symbol set
  if (/[^\x20-\x7e]/.test(pw)) p += 100;
  return p;
};

export const findMatches = (pw: string, personal: string[] = []): M[] => {
  const out: M[] = [], n = pw.length, low = pw.toLowerCase();
  // Common words, also with capitals and with 1337 swaps (0 for o, 3 for e, @ for a ...).
  const variants = [low, [...low].map((c) => LEET[c] ?? c).join(''), [...low].map((c) => (c === '1' ? 'l' : LEET[c] ?? c)).join('')];
  for (let s = 0; s < n; s++) for (let e = s + 4; e <= n; e++) {
    const vi = variants.findIndex((v) => LIST.includes(v.slice(s, e)));
    if (vi < 0) continue;
    const raw = pw.slice(s, e), leet = raw.toLowerCase() !== variants[vi].slice(s, e), caps = /[A-Z]/.test(raw);
    out.push({ s, e, bits: Math.log2(LIST.length) + (caps ? 1 : 0) + (leet ? 1 : 0), why: `"${raw}" is${leet ? ', with letters swapped for look-alikes,' : ''} in the common-password list` });
  }
  // Words about the person (name, pet, birth year ...) that the person typed in: someone who knows them would try these first.
  for (const raw of personal) {
    const w = raw.trim().toLowerCase(); if (w.length < 3) continue;
    variants.forEach((v, vi) => {
      for (let at = v.indexOf(w); at >= 0; at = v.indexOf(w, at + 1)) out.push({ s: at, e: at + w.length, bits: Math.log2(64) + (vi ? 1 : 0), why: `"${pw.slice(at, at + w.length)}" is one of your own personal words` });
    });
  }
  // Sequences such as abc, 4321 (same step each time).
  for (let s = 0; s < n - 2; s++) {
    const d = low.charCodeAt(s + 1) - low.charCodeAt(s);
    if (Math.abs(d) !== 1 || !/[a-z0-9]/.test(low[s]) || !/[a-z0-9]/.test(low[s + 1])) continue;
    let e = s + 2; while (e < n && low.charCodeAt(e) - low.charCodeAt(e - 1) === d && /[a-z0-9]/.test(low[e])) e++;
    if (e - s >= 3) out.push({ s, e, bits: Math.log2(36) + 1 + Math.log2(e - s), why: `"${pw.slice(s, e)}" is a sequence` });
  }
  // Keyboard runs such as qwerty, asdf (forwards or backwards along a row).
  for (const row of ROWS) for (const r of [row, [...row].reverse().join('')]) {
    for (let s = 0; s < n; s++) {
      let e = s; while (e < n && r.includes(low.slice(s, e + 1))) e++;
      if (e - s >= 4) { out.push({ s, e, bits: Math.log2(40) + 1 + Math.log2(e - s), why: `"${pw.slice(s, e)}" is a run of keys next to each other` }); }
    }
  }
  // Repeats: one character (aaaa) or a short chunk (abab, 123123) over and over.
  for (let s = 0; s < n; s++) for (let L = 1; L <= 6; L++) {
    const chunk = pw.slice(s, s + L); if (chunk.length < L) break;
    let e = s + L; while (pw.slice(e, e + L) === chunk) e += L;
    const reps = (e - s) / L;
    if ((L === 1 && reps >= 3) || (L > 1 && reps >= 2)) out.push({ s, e, bits: L * Math.log2(poolOf(chunk)) + Math.log2(reps), why: `"${pw.slice(s, e)}" repeats "${chunk}"` });
  }
  // Years 1900-2039 and dates such as 15051990, 1990-05-15, 15/05/90.
  const re = /(?:19|20)\d\d/g; let m: RegExpExecArray | null;
  while ((m = re.exec(pw))) if (+m[0] <= 2039) out.push({ s: m.index, e: m.index + 4, bits: Math.log2(140), why: `"${m[0]}" looks like a year` });
  const dre = /(?=(\d{1,2}[-/.]?\d{1,2}[-/.]?(?:19|20)?\d\d|(?:19|20)\d\d[-/.]?\d{1,2}[-/.]?\d{1,2}))/g;
  while ((m = dre.exec(pw))) { if (m[1].replace(/\D/g, '').length >= 6) out.push({ s: m.index, e: m.index + m[1].length, bits: Math.log2(366 * 140), why: `"${m[1]}" looks like a date` }); dre.lastIndex = m.index + 1; }
  return out;
};

// Cheapest way to build the password from pieces: matched patterns, or single random characters.
export const MAX_ANALYSED = 256;
export const estimate = (pw: string, personal: string[] = []) => {
  // Very long input: look for patterns in the first part only and count the rest as random characters, so the page stays quick.
  const extra = Math.max(0, pw.length - MAX_ANALYSED); pw = pw.slice(0, MAX_ANALYSED);
  const n = pw.length, cb = Math.log2(poolOf(pw)), ms = findMatches(pw, personal);
  const dp = new Array(n + 1).fill(Infinity), back: (M | null)[] = new Array(n + 1).fill(null); dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i - 1] + cb; back[i] = null;
    for (const m of ms) if (m.e === i && dp[m.s] + m.bits < dp[i]) { dp[i] = dp[m.s] + m.bits; back[i] = m; }
  }
  const used: M[] = []; for (let i = n; i > 0;) { const m = back[i]; if (m) { used.unshift(m); i = m.s; } else i--; }
  const whole = used.length === 1 && used[0].s === 0 && used[0].e === n && used[0].why.includes('common-password');
  return { bits: dp[n] + extra * cb, used, whole, cb, pool: poolOf(pw), extra };
};


/** Counts of each kind of character, for the plain summary line. */
export function kinds(pw: string) {
  let lower = 0, upper = 0, digit = 0, symbol = 0;
  for (const c of pw) { if (/[a-z]/.test(c)) lower++; else if (/[A-Z]/.test(c)) upper++; else if (/[0-9]/.test(c)) digit++; else symbol++; }
  return { lower, upper, digit, symbol };
}
export const LEVELS = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
export const levelOf = (bits: number, whole: boolean) => (whole ? 0 : bits < 28 ? 0 : bits < 40 ? 1 : bits < 60 ? 2 : bits < 80 ? 3 : 4);
/** Extra characters of the same kind needed to reach a bit target (each random character adds `cb` bits). */
export const charsToReach = (bits: number, cb: number, target: number) => (bits >= target || cb <= 0 ? 0 : Math.ceil((target - bits) / cb));
