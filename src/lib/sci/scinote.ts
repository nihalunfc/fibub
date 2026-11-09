// Scientific notation formatter: numbers to scientific, engineering or SI-prefix form, rounded to significant
// figures, and value ± uncertainty rounded together (uncertainty to 1 or 2 significant figures, value to the same
// decimal place). Output as plain text, Unicode, LaTeX maths, siunitx and the concise "1.234(12)" form.
// Rounding is digit by digit (decimal.ts), half away from zero. Plain TypeScript, no DOM.
import { parseDec, roundAt, roundSig, fixed, lead, type Dec } from './decimal.ts';

export type Notation = 'sci' | 'eng' | 'si' | 'plain';
/** How many significant figures the uncertainty keeps. */
export type UncRule = 'pdg' | 'lead12' | 'two' | 'one';
export type Opts = { notation: Notation; sig: number; rule: UncRule; unit: string };

/** SI prefixes by power of ten (2022 SI, including ronna, quetta, ronto and quecto). */
export const PREFIXES: Record<number, { sym: string; tex: string; name: string }> = {
  30: { sym: 'Q', tex: '\\quetta', name: 'quetta' }, 27: { sym: 'R', tex: '\\ronna', name: 'ronna' }, 24: { sym: 'Y', tex: '\\yotta', name: 'yotta' }, 21: { sym: 'Z', tex: '\\zetta', name: 'zetta' },
  18: { sym: 'E', tex: '\\exa', name: 'exa' }, 15: { sym: 'P', tex: '\\peta', name: 'peta' }, 12: { sym: 'T', tex: '\\tera', name: 'tera' }, 9: { sym: 'G', tex: '\\giga', name: 'giga' },
  6: { sym: 'M', tex: '\\mega', name: 'mega' }, 3: { sym: 'k', tex: '\\kilo', name: 'kilo' }, 0: { sym: '', tex: '', name: '' }, [-3]: { sym: 'm', tex: '\\milli', name: 'milli' },
  [-6]: { sym: 'µ', tex: '\\micro', name: 'micro' }, [-9]: { sym: 'n', tex: '\\nano', name: 'nano' }, [-12]: { sym: 'p', tex: '\\pico', name: 'pico' }, [-15]: { sym: 'f', tex: '\\femto', name: 'femto' },
  [-18]: { sym: 'a', tex: '\\atto', name: 'atto' }, [-21]: { sym: 'z', tex: '\\zepto', name: 'zepto' }, [-24]: { sym: 'y', tex: '\\yocto', name: 'yocto' }, [-27]: { sym: 'r', tex: '\\ronto', name: 'ronto' },
  [-30]: { sym: 'q', tex: '\\quecto', name: 'quecto' },
};

/** One input line read: the value, an optional uncertainty, and a unit written after the numbers. */
export type Parsed = { v: Dec; u: Dec | null; unit: string };

const SUPS: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+' };
const NUMRE = String.raw`[-+]?(?:\d[\d,]*\.?\d*|\.\d+)`;

/**
 * Read "1234.5", "1.2e-5", "1.2 × 10^-5", "0.0123 ± 0.0004", "12.3 +/- 0.4 mm", "(1.23 ± 0.04)e-4", "1.234(12)",
 * "1.234(12)e-3", "12.3(1.2)" or two cells "12.3<tab>0.4". Returns an error message for anything else.
 */
export function parseLine(line: string): Parsed | string {
  let t = line.trim().replace(/[−–]/g, '-').replace(/\u00a0|\u2009|\u202f/g, ' ');
  if (!t) return 'empty';
  t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g, (s) => '^' + [...s].map((c) => SUPS[c]).join(''));
  // "× 10^-5", "x10^-5", "*10**-5", "·10^-5" become e-5.
  t = t.replace(/\s*(?:[×x*·⋅]|\\times)\s*10\s*(?:\^|\*\*)?\s*\{?\s*([-+]?\d+)\s*\}?/gi, 'e$1').replace(/E/g, 'e');
  t = t.replace(/\+\/-|\+-|\\pm/g, '±');
  let m: RegExpExecArray | null;
  const unitOf = (s: string) => s.trim().replace(/^\\,|^~/, '').trim();
  const okUnit = (s: string) => s === '' || /^[\p{L}°%'"/][^±()]*$/u.test(s);
  // (v ± u)e-4 unit
  if ((m = new RegExp(String.raw`^\(\s*(${NUMRE})\s*±\s*(${NUMRE})\s*\)\s*(e[-+]?\d+)?\s*(.*)$`).exec(t))) {
    const v = parseDec(m[1] + (m[3] ?? '')), u = parseDec(m[2] + (m[3] ?? ''));
    if (v && u && okUnit(unitOf(m[4]))) return { v, u, unit: unitOf(m[4]) };
  }
  // v ± u unit (each may have its own exponent)
  if ((m = new RegExp(String.raw`^(${NUMRE}(?:e[-+]?\d+)?)\s*±\s*(${NUMRE}(?:e[-+]?\d+)?)\s*(.*)$`).exec(t))) {
    const v = parseDec(m[1]), u = parseDec(m[2]);
    if (v && u && okUnit(unitOf(m[3]))) return { v, u, unit: unitOf(m[3]) };
  }
  // concise: 1.234(12)e-3 or 12.3(1.2)
  if ((m = new RegExp(String.raw`^(${NUMRE})\((\d+(?:\.\d+)?)\)\s*(e[-+]?\d+)?\s*(.*)$`).exec(t))) {
    const exp = m[3] ? Number(m[3].slice(1)) : 0;
    const v = parseDec(m[1] + (m[3] ?? ''));
    if (v && okUnit(unitOf(m[4]))) {
      let u: Dec | null;
      if (m[2].includes('.')) u = parseDec(m[2] + (m[3] ?? ''));
      else { const digits = m[2].replace(/^0+/, ''); const dec = /\.(\d*)/.exec(m[1])?.[1].length ?? 0; u = { neg: false, d: digits, e: exp - dec }; }
      if (u) return { v, u, unit: unitOf(m[4]) };
    }
  }
  // two cells: tab or semicolon
  let cells = t.split(/\t|;/).map((c) => c.trim()).filter((c) => c !== '');
  // "1500,25" (a CSV line) is two cells; "1,500" alone is one number.
  if (cells.length === 1 && t.includes(',') && !parseDec(t)) cells = t.split(',').map((c) => c.trim()).filter((c) => c !== '');
  if (cells.length === 2) { const v = parseDec(cells[0]), u = parseDec(cells[1]); if (v && u) return { v, u, unit: '' }; }
  if (cells.length > 2) return `"${line.trim()}" has more than two cells; give a value and, if you like, its uncertainty.`;
  // v unit
  if ((m = new RegExp(String.raw`^(${NUMRE}(?:e[-+]?\d+)?)\s*(.*)$`).exec(t))) {
    const v = parseDec(m[1]);
    if (v && okUnit(unitOf(m[2]))) return { v, u: null, unit: unitOf(m[2]) };
  }
  return `"${line.trim().slice(0, 40)}" is not a number.`;
}

/** Significant figures the uncertainty keeps, and the uncertainty rounded. */
export function roundUnc(u: Dec, rule: UncRule): { n: number; u: Dec } {
  if (rule === 'one') return { n: 1, u: fixSig(roundSig(u, 1), 1) };
  if (rule === 'two') return { n: 2, u: fixSig(roundSig(u, 2), 2) };
  const first3 = Number((u.d + '000').slice(0, 3));
  if (rule === 'lead12') { const n = first3 < 300 ? 2 : 1; let r = roundSig(u, n); if (n === 1 && r.d.length === 1 && r.d === '1') r = fixSig(r, 2); return { n: r.d.length, u: r }; }
  // Particle Data Group: the three leading digits 100-354 keep two figures, 355-949 one, 950-999 round up to 1000 and keep two.
  if (first3 <= 354) return { n: 2, u: roundSig(u, 2) };
  if (first3 <= 949) return { n: 1, u: roundSig(u, 1) };
  const up = roundSig(u, 1); // 0.0951 -> 0.1
  return { n: 2, u: fixSig(up, 2) };
}
/** Pad a rounded number with zeros to n digits (0.1 to 2 figures is 0.10). */
function fixSig(x: Dec, n: number): Dec { return x.d.length < n ? { ...x, d: x.d + '0'.repeat(n - x.d.length), e: x.e - (n - x.d.length) } : x; }

const shift = (x: Dec, p: number): Dec => ({ ...x, e: x.e - p });
const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const sup = (n: number) => String(n).split('').map((c) => SUP[c] ?? c).join('');

/** The result in every output form. */
export type Formatted = {
  value: string; unc: string | null; p: number; prefix: string; unit: string; uncSig: number; concise: string;
  plain: string; unicode: string; latex: string; siunitx: string; eValue: string; eUnc: string; note: string;
};

/** Text of a unit for siunitx: µ, °C, Ω and % written as its commands; anything else is passed as written (siunitx v3 reads literal units). */
export function siUnit(unit: string): string {
  return unit.replace(/°C/g, '\\degreeCelsius').replace(/°/g, '\\degree').replace(/[µμ]/g, '\\micro ').replace(/Ω/g, '\\ohm').replace(/%/g, '\\percent').replace(/\s+$/, '');
}
const texText = (s: string) => s.replace(/[\\&%$#_{}~^]/g, (c) => (c === '\\' ? '\\textbackslash{}' : c === '~' ? '\\textasciitilde{}' : c === '^' ? '\\textasciicircum{}' : '\\' + c));
/** A unit for LaTeX maths: \mathrm{...}, with µ as \mu. */
const texUnit = (u: string) => (u ? `\\,\\mathrm{${texText(u).replace(/[µμ]/g, '\\mu ').replace(/Ω/g, '\\Omega').replace(/°/g, '^{\\circ}')}}` : '');

// Units an SI prefix can stand in front of, to spot a unit that already has one ("µm", "kHz", "mM").
const BASE_UNITS = new Set(['m', 'g', 's', 'A', 'K', 'mol', 'cd', 'Hz', 'N', 'Pa', 'J', 'W', 'C', 'V', 'F', 'Ω', 'S', 'Wb', 'T', 'H', 'L', 'l', 'eV', 'Bq', 'Gy', 'Sv', 'M', 'lm', 'lx', 'kat', 'Da', 'bar', 'b']);
const IN_PREFIX: Record<string, number> = { c: -2, d: -1, h: 2, da: 1, u: -6, μ: -6 };
for (const [p, v] of Object.entries(PREFIXES)) if (v.sym) IN_PREFIX[v.sym] = Number(p);
/** A unit with a prefix split into the prefix's power of ten and the base unit: "µm" -> [-6, "m"]; "mol" -> null. */
export function splitPrefix(unit: string): [number, string] | null {
  if (BASE_UNITS.has(unit)) return null;
  for (const pre of ['da', ...Object.keys(IN_PREFIX).filter((k) => k !== 'da')]) {
    if (unit.startsWith(pre) && BASE_UNITS.has(unit.slice(pre.length))) return [IN_PREFIX[pre], unit.slice(pre.length)];
  }
  return null;
}

/** Format one value (and uncertainty). Throws an Error with a plain message for impossible requests. */
export function format(x: Parsed, o: Opts): Formatted {
  let unitIn = (o.unit || x.unit).trim();
  let v: Dec, u: Dec | null = null, uncSig = 0, note = '';
  if (o.notation === 'si') {
    const sp = splitPrefix(unitIn);
    if (sp) {
      note = `${unitIn} read as 10${sup(sp[0])} ${sp[1]}.`;
      x = { v: { ...x.v, e: x.v.e + sp[0] }, u: x.u ? { ...x.u, e: x.u.e + sp[0] } : null, unit: sp[1] };
      unitIn = sp[1];
    }
  }
  if (x.u) {
    if (x.u.neg) throw new Error('An uncertainty cannot be negative.');
    if (!x.u.d) throw new Error('The uncertainty is zero; leave it out to round the value to significant figures instead.');
    const r = roundUnc(x.u, o.rule);
    u = r.u; uncSig = r.n;
    v = roundAt(x.v, u.e);
    if (x.v.e > u.e && x.v.d) note = 'The value has fewer decimals than the uncertainty; zeros were added.';
    if (!v.d) v = { neg: false, d: '', e: u.e };
  } else {
    if (!(o.sig >= 1 && o.sig <= 20) && o.sig !== 0) throw new Error('Give 1 to 20 significant figures, or 0 to keep the figures as typed.');
    v = o.sig ? roundSig(x.v, o.sig) : x.v;
    if (!v.d) v = { neg: false, d: '', e: o.sig ? -(o.sig - 1) : x.v.e };
  }
  // The power of ten.
  const L = v.d ? lead(v) : u ? lead(u) : 0;
  let p = 0;
  let notation = o.notation;
  if (notation === 'si' && !unitIn) { notation = 'eng'; note = (note ? note + ' ' : '') + 'SI prefixes need a unit; shown in engineering notation. Type a unit such as m, g or Hz.'; }
  if (notation === 'sci') p = L;
  else if (notation === 'eng' || notation === 'si') p = Math.floor(L / 3) * 3;
  let prefix = '';
  if (notation === 'si') {
    if (PREFIXES[p]) prefix = PREFIXES[p].sym;
    else { note = (note ? note + ' ' : '') + 'No SI prefix this large or small; shown as a power of ten.'; }
  }
  const usePow = notation !== 'plain' && !(notation === 'si' && PREFIXES[p]);
  const pow = usePow ? p : 0;
  const decs = Math.max(0, -((u ? u.e : v.e) - p));
  const vm = fixed(shift(v, p), decs).replace(/^-/, '-');
  const um = u ? fixed(shift(u, p), decs) : null;
  // Concise form: the uncertainty's digits in the last place of the value.
  // When the uncertainty's last digit sits left of the value's last shown digit (120 ± 40), pad with zeros: 120(40).
  const uDigits = u ? (u.d || '0') + '0'.repeat(Math.max(0, u.e - p)) : '';
  const unit = prefix + unitIn;
  const minus = (s: string) => s.replace(/^-/, '−');
  // Unicode
  const pw = pow ? ` × 10${sup(pow)}` : '';
  const sp = unit ? ` ${unit}` : '';
  const unicode = um != null ? (pw || sp ? `(${minus(vm)} ± ${um})${pw}${sp}` : `${minus(vm)} ± ${um}`) : `${minus(vm)}${pw}${sp}`;
  const concise = um != null ? `${minus(vm)}(${uDigits})${pw}${sp}` : `${minus(vm)}${pw}${sp}`;
  // Plain ASCII: E notation and +/-.
  const pe = pow ? `e${pow}` : '';
  const asciiUnit = unit.replace(/µ/g, 'u').replace(/Ω/g, 'Ohm');
  const asp = asciiUnit ? ` ${asciiUnit}` : '';
  const plain = um != null ? (pe || asp ? `(${vm} +/- ${um})${pe}${asp}` : `${vm} +/- ${um}`) : `${vm}${pe}${asp}`;
  // LaTeX maths
  const tpw = pow ? ` \\times 10^{${pow}}` : '';
  const tunit = prefix === 'µ' ? `\\,\\mu${texUnit(unitIn).slice(2)}` : texUnit(prefix + unitIn);
  const latex = '$' + (um != null ? (tpw || tunit ? `(${vm} \\pm ${um})${tpw}${tunit}` : `${vm} \\pm ${um}`) : `${vm}${tpw}${tunit}`) + '$';
  // siunitx (version 3): \num or \qty, with the uncertainty in brackets.
  const sinum = `${vm}${um != null ? `(${uDigits})` : ''}${pow ? `e${pow}` : ''}`;
  const siu = (prefix ? PREFIXES[p].tex + ' ' : '') + siUnit(unitIn);
  const siunitx = siu.trim() ? `\\qty{${sinum}}{${siu.trim()}}` : `\\num{${sinum}}`;
  // Spreadsheet columns: the value and the uncertainty as plain numbers in E notation.
  const eValue = `${vm}${pe}`, eUnc = um != null ? `${um}${pe}` : '';
  return { value: vm, unc: um, p: pow, prefix, unit: unitIn, uncSig, concise, plain, unicode, latex, siunitx, eValue, eUnc, note };
}

/** Significant figures of a number as typed ("0.00120" has 3; "1200" is counted as 4). */
export const typedSig = (x: Dec) => Math.max(1, x.d.length);
