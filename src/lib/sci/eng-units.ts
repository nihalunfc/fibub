// Engineering unit conversion with dimensional checking. Every factor is an exact definition (SI, the 1959
// international yard and pound, standard gravity 9.80665 m/s², the international table calorie and Btu, and so
// on), written as arithmetic on those definitions. Expressions such as "3 kN*m to lbf*ft" are parsed into a
// magnitude in SI base units and a dimension vector. No DOM.

/** Dimension exponents of [length, mass, time, current, temperature, amount, luminous intensity]. */
export type Dim = number[];
export const BASE = ['m', 'kg', 's', 'A', 'K', 'mol', 'cd'];
const DNAME = ['length', 'mass', 'time', 'current', 'temperature', 'amount', 'luminous intensity'];
const D = (L = 0, M = 0, T = 0, I = 0, K = 0, N = 0, J = 0): Dim => [L, M, T, I, K, N, J];

type U = { f: number; d: Dim; prefix?: boolean; offset?: number; name: string };
const units = new Map<string, U>();
const add = (names: string[], name: string, f: number, d: Dim, prefix = false, offset?: number) => { for (const n of names) units.set(n, { f, d, prefix, offset, name }); };

// Exact base definitions.
const IN = 0.0254, FT = 12 * IN, YD = 3 * FT, MI = 5280 * FT, LB = 0.45359237, G0 = 9.80665, LBF = LB * G0;
const GAL = 231 * IN ** 3, IMPGAL = 4.54609e-3, CAL = 4.184, CAL_IT = 4.1868, BTU = 1055.05585262, ATM = 101325;
// SI base and derived units (prefixes allowed).
add(['m', 'metre', 'meter', 'metres', 'meters'], 'metre', 1, D(1), true);
add(['g', 'gram', 'grams', 'gramme'], 'gram', 1e-3, D(0, 1), true);
add(['s', 'sec', 'second', 'seconds'], 'second', 1, D(0, 0, 1), true);
add(['A', 'amp', 'ampere', 'amperes'], 'ampere', 1, D(0, 0, 0, 1), true);
add(['K', 'kelvin'], 'kelvin', 1, D(0, 0, 0, 0, 1), true);
add(['mol', 'mole', 'moles'], 'mole', 1, D(0, 0, 0, 0, 0, 1), true);
add(['cd', 'candela'], 'candela', 1, D(0, 0, 0, 0, 0, 0, 1), true);
add(['N', 'newton', 'newtons'], 'newton', 1, D(1, 1, -2), true);
add(['Pa', 'pascal', 'pascals'], 'pascal', 1, D(-1, 1, -2), true);
add(['J', 'joule', 'joules'], 'joule', 1, D(2, 1, -2), true);
add(['W', 'watt', 'watts'], 'watt', 1, D(2, 1, -3), true);
add(['Hz', 'hertz'], 'hertz', 1, D(0, 0, -1), true);
add(['C', 'coulomb', 'coulombs'], 'coulomb', 1, D(0, 0, 1, 1), true);
add(['V', 'volt', 'volts'], 'volt', 1, D(2, 1, -3, -1), true);
add(['Ω', 'ohm', 'ohms'], 'ohm', 1, D(2, 1, -3, -2), true);
add(['S', 'siemens'], 'siemens', 1, D(-2, -1, 3, 2), true);
add(['F', 'farad', 'farads'], 'farad', 1, D(-2, -1, 4, 2), true);
add(['H', 'henry', 'henries'], 'henry', 1, D(2, 1, -2, -2), true);
add(['T', 'tesla'], 'tesla', 1, D(0, 1, -2, -1), true);
add(['Wb', 'weber'], 'weber', 1, D(2, 1, -2, -1), true);
add(['L', 'l', 'litre', 'liter', 'litres', 'liters'], 'litre', 1e-3, D(3), true);
add(['t', 'tonne', 'tonnes'], 'tonne', 1000, D(0, 1), true);
add(['bar'], 'bar', 1e5, D(-1, 1, -2), true);
add(['eV'], 'electronvolt', 1.602176634e-19, D(2, 1, -2), true);
add(['rad', 'radian', 'radians'], 'radian', 1, D(), true);
add(['sr', 'steradian'], 'steradian', 1, D());
add(['lm', 'lumen'], 'lumen', 1, D(0, 0, 0, 0, 0, 0, 1), true);
add(['lx', 'lux'], 'lux', 1, D(-2, 0, 0, 0, 0, 0, 1), true);
// Non-SI units (no prefixes).
add(['min', 'minute', 'minutes'], 'minute', 60, D(0, 0, 1));
add(['h', 'hr', 'hour', 'hours'], 'hour', 3600, D(0, 0, 1));
add(['d', 'day', 'days'], 'day', 86400, D(0, 0, 1));
add(['wk', 'week', 'weeks'], 'week', 7 * 86400, D(0, 0, 1));
add(['yr', 'year', 'years', 'a'], 'Julian year (365.25 d)', 365.25 * 86400, D(0, 0, 1));
add(['in', 'inch', 'inches'], 'inch', IN, D(1));
add(['ft', 'foot', 'feet'], 'foot', FT, D(1));
add(['yd', 'yard', 'yards'], 'yard', YD, D(1));
add(['mi', 'mile', 'miles'], 'mile', MI, D(1));
add(['nmi', 'NM'], 'nautical mile', 1852, D(1));
add(['mil', 'thou'], 'mil (thou)', IN / 1000, D(1));
add(['Å', 'angstrom'], 'ångström', 1e-10, D(1));
add(['au'], 'astronomical unit', 149597870700, D(1));
add(['ly'], 'light-year', 299792458 * 365.25 * 86400, D(1));
add(['ha', 'hectare', 'hectares'], 'hectare', 1e4, D(2));
add(['acre', 'acres'], 'acre (international)', 4840 * YD * YD, D(2));
add(['gal', 'galUS', 'USgal', 'gallon', 'gallons'], 'US gallon', GAL, D(3));
add(['impgal', 'galUK', 'UKgal'], 'imperial gallon', IMPGAL, D(3));
add(['qt'], 'US liquid quart', GAL / 4, D(3));
add(['pt'], 'US liquid pint', GAL / 8, D(3));
add(['floz', 'fl_oz'], 'US fluid ounce', GAL / 128, D(3));
add(['impfloz'], 'imperial fluid ounce', IMPGAL / 160, D(3));
add(['bbl', 'barrel', 'barrels'], 'oil barrel (42 US gal)', 42 * GAL, D(3));
add(['cc'], 'cubic centimetre', 1e-6, D(3));
add(['lb', 'lbm', 'pound', 'pounds'], 'pound (mass)', LB, D(0, 1));
add(['oz', 'ounce', 'ounces'], 'ounce (avoirdupois)', LB / 16, D(0, 1));
add(['gr', 'grain', 'grains'], 'grain', LB / 7000, D(0, 1));
add(['st', 'stone'], 'stone', 14 * LB, D(0, 1));
add(['ton', 'shortton', 'tonUS'], 'short ton (2000 lb)', 2000 * LB, D(0, 1));
add(['longton', 'tonUK'], 'long ton (2240 lb)', 2240 * LB, D(0, 1));
add(['slug'], 'slug', LBF / FT, D(0, 1));
add(['lbf'], 'pound-force', LBF, D(1, 1, -2));
add(['kgf', 'kp'], 'kilogram-force', G0, D(1, 1, -2));
add(['ozf'], 'ounce-force', LBF / 16, D(1, 1, -2));
add(['kip'], 'kip (1000 lbf)', 1000 * LBF, D(1, 1, -2));
add(['tonf'], 'short ton-force', 2000 * LBF, D(1, 1, -2));
add(['pdl', 'poundal'], 'poundal', LB * FT, D(1, 1, -2));
add(['dyn', 'dyne'], 'dyne', 1e-5, D(1, 1, -2));
add(['gn', 'g0', 'gₙ'], 'standard gravity', G0, D(1, 0, -2));
add(['Gal'], 'gal (cm/s²)', 0.01, D(1, 0, -2));
add(['psi'], 'pound per square inch', LBF / IN ** 2, D(-1, 1, -2));
add(['ksi'], 'kilopound per square inch', 1000 * LBF / IN ** 2, D(-1, 1, -2));
add(['psf'], 'pound per square foot', LBF / FT ** 2, D(-1, 1, -2));
add(['atm'], 'standard atmosphere', ATM, D(-1, 1, -2));
add(['at'], 'technical atmosphere (kgf/cm²)', G0 * 1e4, D(-1, 1, -2));
add(['Torr', 'torr'], 'torr', ATM / 760, D(-1, 1, -2));
add(['mmHg'], 'millimetre of mercury', 133.322387415, D(-1, 1, -2));
add(['inHg'], 'inch of mercury (conventional, 13.5951 g/cm³)', 13595.1 * G0 * IN, D(-1, 1, -2));
add(['mmH₂O', 'mmWC'], 'millimetre of water (conventional, 1000 kg/m³)', 1000 * G0 * 1e-3, D(-1, 1, -2));
add(['inH₂O', 'inWC'], 'inch of water (conventional, 1000 kg/m³)', 1000 * G0 * IN, D(-1, 1, -2));
add(['ftH₂O'], 'foot of water (conventional, 1000 kg/m³)', 1000 * G0 * FT, D(-1, 1, -2));
add(['cal', 'calorie', 'calories'], 'calorie (thermochemical)', CAL, D(2, 1, -2), true);
add(['calIT', 'cal_IT'], 'calorie (international table)', CAL_IT, D(2, 1, -2), true);
add(['Btu', 'BTU', 'btu'], 'British thermal unit (IT)', BTU, D(2, 1, -2));
add(['MMBtu'], 'million Btu', 1e6 * BTU, D(2, 1, -2));
add(['therm'], 'therm (100,000 IT Btu)', 1e5 * BTU, D(2, 1, -2));
add(['Wh'], 'watt-hour', 3600, D(2, 1, -2), true);
add(['erg'], 'erg', 1e-7, D(2, 1, -2));
add(['hp', 'bhp'], 'horsepower (mechanical, 550 ft·lbf/s)', 550 * FT * LBF, D(2, 1, -3));
add(['PS', 'hpM'], 'metric horsepower', 75 * G0, D(2, 1, -3));
add(['TR', 'RT'], 'ton of refrigeration (12,000 Btu/h)', (12000 * BTU) / 3600, D(2, 1, -3));
add(['P', 'poise'], 'poise', 0.1, D(-1, 1, -1), true);
add(['St', 'stokes'], 'stokes', 1e-4, D(2, 0, -1), true);
add(['kn', 'knot', 'knots'], 'knot', 1852 / 3600, D(1, 0, -1));
add(['mph'], 'mile per hour', MI / 3600, D(1, 0, -1));
add(['deg', '°', 'degree', 'degrees'], 'degree', Math.PI / 180, D());
add(['arcmin'], 'arcminute', Math.PI / 10800, D());
add(['arcsec'], 'arcsecond', Math.PI / 648000, D());
add(['grad', 'gon'], 'gradian', Math.PI / 200, D());
add(['rev', 'turn', 'r'], 'revolution', 2 * Math.PI, D());
add(['rpm'], 'revolution per minute', (2 * Math.PI) / 60, D(0, 0, -1));
add(['percent', '%'], 'percent', 0.01, D());
add(['ppm'], 'part per million', 1e-6, D());
// Temperatures: absolute when converted on their own, temperature differences inside compound units.
add(['°C', 'degC', '℃', 'celsius'], 'degree Celsius', 1, D(0, 0, 0, 0, 1), false, 273.15);
add(['°F', 'degF', '℉', 'fahrenheit'], 'degree Fahrenheit', 5 / 9, D(0, 0, 0, 0, 1), false, 459.67);
add(['°R', 'degR', 'rankine', 'Ra'], 'degree Rankine', 5 / 9, D(0, 0, 0, 0, 1));

const PREFIX: Record<string, number> = { Y: 1e24, Z: 1e21, E: 1e18, P: 1e15, T: 1e12, G: 1e9, M: 1e6, k: 1e3, h: 1e2, da: 1e1, d: 1e-1, c: 1e-2, m: 1e-3, µ: 1e-6, μ: 1e-6, u: 1e-6, n: 1e-9, p: 1e-12, f: 1e-15, a: 1e-18 };

export type Lookup = { f: number; d: Dim; offset?: number; label: string };
/** Find a unit by symbol or name, with an SI prefix if allowed. */
export function lookup(name: string): Lookup | null {
  const u = units.get(name);
  if (u) return { f: u.f, d: u.d, offset: u.offset, label: name };
  for (const p of ['da', ...Object.keys(PREFIX).filter((k) => k !== 'da')]) {
    if (name.startsWith(p) && name.length > p.length) {
      const b = units.get(name.slice(p.length));
      if (b && b.prefix) return { f: b.f * PREFIX[p], d: b.d, label: name };
    }
  }
  const lower = [...units.entries()].find(([k]) => k.length > 2 && k.toLowerCase() === name.toLowerCase());
  return lower ? { f: lower[1].f, d: lower[1].d, offset: lower[1].offset, label: name } : null;
}
const PNAME: Record<string, string> = { Y: 'yotta', Z: 'zetta', E: 'exa', P: 'peta', T: 'tera', G: 'giga', M: 'mega', k: 'kilo', h: 'hecto', da: 'deca', d: 'deci', c: 'centi', m: 'milli', µ: 'micro', μ: 'micro', u: 'micro', n: 'nano', p: 'pico', f: 'femto', a: 'atto' };
/** Name of a single unit symbol (with an SI prefix spelled out), or '' for compound expressions. */
export function unitName(sym: string): string {
  const s = sym.replace(/H2O/g, 'H₂O'), u = units.get(s);
  if (u) return u.name;
  for (const p of ['da', ...Object.keys(PNAME).filter((k) => k !== 'da')]) {
    const b = units.get(s.slice(p.length));
    if (s.startsWith(p) && b?.prefix) return PNAME[p] + b.name;
  }
  return '';
}

export type Quantity = { v: number; d: Dim; offsetUnit?: { f: number; offset: number; label: string }; units: number; text: string };

const SUPMAP: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
/**
 * Parse a quantity or unit expression: numbers, units, *, ·, ×, /, ^, ** and brackets; a space between units means
 * multiply; exponents may follow a unit directly (m2, m², s-1). "a/b*c" reads left to right as (a/b)·c.
 */
export function parse(src: string): Quantity {
  let s = src.trim().replace(/H2O/g, 'H₂O').replace(/\*\*/g, '^').replace(/[×·⋅]/g, '*').replace(/−/g, '-').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (m) => '^' + m.split('').map((c) => SUPMAP[c]).join(''));
  s = s.replace(/(\d),(\d{3})(?!\d)/g, '$1$2');
  if (!s) throw new Error('Type a unit or a quantity.');
  let i = 0, nUnits = 0;
  let single: Lookup | null = null;
  const peek = () => s[i];
  const ws = () => { while (s[i] === ' ') i++; };
  const num = () => { const m = /^(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?/.exec(s.slice(i)); if (!m) return null; i += m[0].length; return Number(m[0]); };
  const exponent = (): number | null => {
    const m = /^\^?\s*\(?\s*([-+]?\d+(?:\.\d+)?(?:\/\d+)?)\s*\)?/.exec(s.slice(i));
    if (!m || (!m[0].startsWith('^') && !/^[-+]?\d/.test(m[0]))) return null;
    i += m[0].length; const [a, b] = m[1].split('/'); return b ? Number(a) / Number(b) : Number(a);
  };
  type V = { v: number; d: Dim };
  const pow = (x: V, e: number): V => ({ v: Math.pow(x.v, e), d: x.d.map((k) => k * e) });
  const mul = (a: V, b: V, sign = 1): V => ({ v: sign > 0 ? a.v * b.v : a.v / b.v, d: a.d.map((k, j) => k + sign * b.d[j]) });
  const factor = (): V => {
    ws();
    let x: V;
    if (peek() === '(') { i++; x = expr(); ws(); if (peek() !== ')') throw new Error('A closing bracket ) is missing.'); i++; }
    else {
      let sign = 1;
      while (peek() === '-' || peek() === '+') { if (peek() === '-') sign = -sign; i++; ws(); }
      const n = num();
      if (n !== null) x = { v: sign * n, d: D() };
      else if (sign < 0) throw new Error('A minus sign must come before a number.');
      else {
        const m = /^[A-Za-zµμΩÅ°℃℉₂_%]+/.exec(s.slice(i));
        if (!m) throw new Error(`Unexpected "${s.slice(i, i + 8)}".`);
        const u = lookup(m[0]);
        if (!u) throw new Error(`Unknown unit "${m[0]}".`);
        i += m[0].length; nUnits++; single = u;
        x = { v: u.f, d: u.d };
        const e = exponent(); if (e !== null) { x = pow(x, e); if (e !== 1) single = null; }
        return x;
      }
    }
    ws(); if (peek() === '^') { const e = exponent(); if (e !== null) x = pow(x, e); }
    return x;
  };
  const expr = (): V => {
    let x = factor();
    for (;;) {
      ws();
      const c = peek();
      if (c === '*') { i++; x = mul(x, factor()); }
      else if (c === '/') { i++; x = mul(x, factor(), -1); }
      else if (c && c !== ')' && /[A-Za-z0-9.(µμΩÅ°℃℉%]/.test(c)) x = mul(x, factor());
      else return x;
    }
  };
  const r = expr();
  ws(); if (i < s.length) throw new Error(`Could not read "${s.slice(i)}".`);
  const one = single as Lookup | null;
  const offsetUnit = nUnits === 1 && one && one.offset !== undefined ? { f: one.f, offset: one.offset, label: one.label } : undefined;
  return { v: r.v, d: r.d, offsetUnit, units: nUnits, text: src.trim() };
}

/** Dimension as a formula such as L²·M·T⁻² (or "dimensionless"). */
export function dimText(d: Dim): string {
  const sym = ['L', 'M', 'T', 'I', 'Θ', 'N', 'J'], sup = (n: number) => (n === 1 ? '' : String(+n.toFixed(4)).split('').map((c) => ({ '-': '⁻', '.': '·', ...Object.fromEntries('0123456789'.split('').map((k, j) => [k, '⁰¹²³⁴⁵⁶⁷⁸⁹'[j]])) } as Record<string, string>)[c] ?? c).join(''));
  const parts = d.map((e, j) => (Math.abs(e) > 1e-12 ? sym[j] + sup(e) : '')).filter(Boolean);
  return parts.length ? parts.join('·') : 'dimensionless';
}
export const sameDim = (a: Dim, b: Dim) => a.every((x, j) => Math.abs(x - b[j]) < 1e-9);
/** The quantity in SI base units, as text. */
export function siText(d: Dim): string {
  const parts = d.map((e, j) => (Math.abs(e) > 1e-12 ? BASE[j] + (e === 1 ? '' : '^' + String(+e.toFixed(4))) : '')).filter(Boolean);
  return parts.join('·') || '1';
}
const KNOWN: [Dim, string][] = [[D(1), 'length'], [D(2), 'area'], [D(3), 'volume'], [D(0, 1), 'mass'], [D(0, 0, 1), 'time'], [D(1, 0, -1), 'speed'], [D(1, 0, -2), 'acceleration'], [D(1, 1, -2), 'force'], [D(-1, 1, -2), 'pressure or stress'], [D(2, 1, -2), 'energy, work or torque'], [D(2, 1, -3), 'power'], [D(0, 0, 0, 0, 1), 'temperature'], [D(3, 0, -1), 'volume flow'], [D(0, 1, -1), 'mass flow'], [D(-1, 1, -1), 'dynamic viscosity'], [D(2, 0, -1), 'kinematic viscosity or diffusivity'], [D(-3, 1), 'density'], [D(0, 0, -1), 'frequency or angular speed'], [D(), 'dimensionless or angle'], [D(1, 1, -3, 0, -1), 'thermal conductivity'], [D(0, 1, -3, 0, -1), 'heat transfer coefficient'], [D(2, 0, -2, 0, -1), 'specific heat'], [D(2, 0, -2), 'specific energy'], [D(2, 1, -3, -1), 'voltage'], [D(0, 0, 0, 1), 'current'], [D(1, 1, -1), 'momentum'], [D(-2, 1, -2), 'specific weight'], [D(0, 1, -3), 'heat flux (power per area)']];
export function dimName(d: Dim): string { const k = KNOWN.find(([x]) => sameDim(x, d)); return k ? k[1] : ''; }

export type Converted = { value: number; from: Quantity; to: Quantity; absolute: boolean; note: string };
/** Convert "lhs to rhs" (or lhs alone, to SI). Throws an Error with a plain message when dimensions differ. */
export function convert(input: string): Converted {
  const parts = input.split(/\s+(?:to|as|into)\s+|\s*(?:->|→|=>)\s*/);
  if (parts.length > 2) throw new Error('Use one "to", such as: 3 kN*m to lbf*ft');
  const from = parse(parts[0]);
  const to = parts[1] !== undefined ? parse(parts[1]) : { v: 1, d: from.d, units: 0, text: siText(from.d) } as Quantity;
  if (!sameDim(from.d, to.d)) {
    throw new Error(`The dimensions differ: "${from.text}" is ${dimText(from.d)}${dimName(from.d) ? ` (${dimName(from.d)})` : ''}, but "${to.text}" is ${dimText(to.d)}${dimName(to.d) ? ` (${dimName(to.d)})` : ''}.`);
  }
  // Absolute temperatures: a number with a single °C/°F/K/°R unit on each side.
  const tempAbs = sameDim(from.d, D(0, 0, 0, 0, 1)) && from.units === 1 && to.units <= 1 && (from.offsetUnit || to.offsetUnit);
  if (tempAbs) {
    const fOff = from.offsetUnit?.offset ?? 0, fF = from.offsetUnit?.f ?? from.v; // from.v includes the number
    const num = from.offsetUnit ? from.v / from.offsetUnit.f : 1;
    const kelvin = from.offsetUnit ? (num + fOff) * fF : from.v;
    const tOff = to.offsetUnit?.offset ?? 0, tF = to.offsetUnit?.f ?? to.v;
    return { value: kelvin / tF - tOff, from, to, absolute: true, note: 'Absolute temperatures (with the zero offset). Inside compound units such as W/(m·°C), °C and °F count as temperature differences.' };
  }
  const usesOffset = /°C|°F|degC|degF|℃|℉|celsius|fahrenheit/i.test(input);
  return { value: from.v / to.v, from, to, absolute: false, note: usesOffset ? '°C and °F inside a compound unit (or with a power) are treated as temperature differences: 1 °C = 1 K, 1 °F = 5/9 K.' : '' };
}

/** Quick-converter categories: each unit is an expression the parser reads. */
export const CATEGORIES: { id: string; name: string; units: string[] }[] = [
  { id: 'length', name: 'Length', units: ['m', 'km', 'cm', 'mm', 'µm', 'nm', 'in', 'ft', 'yd', 'mi', 'nmi', 'mil', 'Å', 'au', 'ly'] },
  { id: 'area', name: 'Area', units: ['m^2', 'km^2', 'cm^2', 'mm^2', 'ha', 'acre', 'in^2', 'ft^2', 'yd^2', 'mi^2'] },
  { id: 'volume', name: 'Volume', units: ['m^3', 'L', 'mL', 'cm^3', 'in^3', 'ft^3', 'yd^3', 'gal', 'qt', 'pt', 'floz', 'impgal', 'impfloz', 'bbl'] },
  { id: 'mass', name: 'Mass', units: ['kg', 'g', 'mg', 'µg', 't', 'lb', 'oz', 'gr', 'st', 'ton', 'longton', 'slug'] },
  { id: 'time', name: 'Time', units: ['s', 'ms', 'µs', 'ns', 'min', 'h', 'd', 'wk', 'yr'] },
  { id: 'speed', name: 'Speed', units: ['m/s', 'km/h', 'mph', 'ft/s', 'ft/min', 'kn'] },
  { id: 'accel', name: 'Acceleration', units: ['m/s^2', 'ft/s^2', 'in/s^2', 'gn', 'Gal'] },
  { id: 'force', name: 'Force', units: ['N', 'kN', 'MN', 'mN', 'dyn', 'kgf', 'lbf', 'ozf', 'kip', 'tonf', 'pdl'] },
  { id: 'pressure', name: 'Pressure and stress', units: ['Pa', 'kPa', 'MPa', 'GPa', 'bar', 'mbar', 'atm', 'at', 'psi', 'ksi', 'psf', 'Torr', 'mmHg', 'inHg', 'mmH2O', 'inH2O', 'ftH2O', 'N/mm^2'] },
  { id: 'energy', name: 'Energy and work', units: ['J', 'kJ', 'MJ', 'GJ', 'Wh', 'kWh', 'MWh', 'cal', 'kcal', 'calIT', 'Btu', 'MMBtu', 'therm', 'ft*lbf', 'eV', 'erg'] },
  { id: 'power', name: 'Power', units: ['W', 'kW', 'MW', 'hp', 'PS', 'Btu/h', 'ft*lbf/s', 'kcal/h', 'TR', 'erg/s'] },
  { id: 'temperature', name: 'Temperature', units: ['K', '°C', '°F', '°R'] },
  { id: 'vflow', name: 'Volume flow', units: ['m^3/s', 'm^3/h', 'm^3/d', 'L/s', 'L/min', 'L/h', 'gal/min', 'impgal/min', 'ft^3/s', 'ft^3/min', 'bbl/d', 'gal/d'] },
  { id: 'mflow', name: 'Mass flow', units: ['kg/s', 'kg/h', 'g/s', 't/h', 't/d', 'lb/s', 'lb/min', 'lb/h'] },
  { id: 'dvisc', name: 'Dynamic viscosity', units: ['Pa*s', 'mPa*s', 'P', 'cP', 'lbf*s/ft^2', 'lb/(ft*s)', 'lb/(ft*h)'] },
  { id: 'kvisc', name: 'Kinematic viscosity', units: ['m^2/s', 'mm^2/s', 'cSt', 'St', 'ft^2/s', 'ft^2/h'] },
  { id: 'density', name: 'Density', units: ['kg/m^3', 'g/cm^3', 'g/L', 'kg/L', 'lb/ft^3', 'lb/in^3', 'lb/gal', 'lb/impgal', 'slug/ft^3'] },
  { id: 'torque', name: 'Torque', units: ['N*m', 'kN*m', 'N*mm', 'lbf*ft', 'lbf*in', 'ozf*in', 'kgf*m'] },
  { id: 'angle', name: 'Angle', units: ['rad', 'deg', 'arcmin', 'arcsec', 'grad', 'rev', 'mrad'] },
  { id: 'freq', name: 'Frequency', units: ['Hz', 'kHz', 'MHz', 'GHz', '1/min', '1/h', '1/d'] },
  { id: 'rot', name: 'Rotational speed', units: ['rpm', 'rev/s', 'rad/s', 'deg/s', 'rev/h'] },
  { id: 'kcond', name: 'Thermal conductivity', units: ['W/(m*K)', 'W/(cm*K)', 'Btu/(h*ft*°F)', 'Btu*in/(h*ft^2*°F)', 'cal/(s*cm*K)', 'kcal/(h*m*K)'] },
  { id: 'htc', name: 'Heat transfer coefficient', units: ['W/(m^2*K)', 'kW/(m^2*K)', 'Btu/(h*ft^2*°F)', 'kcal/(h*m^2*K)'] },
  { id: 'cp', name: 'Specific heat', units: ['J/(kg*K)', 'kJ/(kg*K)', 'Btu/(lb*°F)', 'cal/(g*K)', 'kcal/(kg*K)'] },
  { id: 'senergy', name: 'Specific energy', units: ['J/kg', 'kJ/kg', 'MJ/kg', 'Btu/lb', 'kcal/kg', 'kWh/kg'] },
];

/** Convert a value between two units of one category (absolute for temperatures). */
export function quick(value: number, from: string, to: string): number {
  return convert(`${value} ${from} to ${to}`).value;
}
/** Display form of a unit expression: ^2 → ², * → ·, H2O → H₂O. */
export const pretty = (u: string) => u.replace(/\^(-?\d+)/g, (_, e: string) => e.split('').map((c) => ({ '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' } as Record<string, string>)[c]).join('')).replace(/\*/g, '·').replace(/H2O/g, 'H₂O');
export { DNAME };
