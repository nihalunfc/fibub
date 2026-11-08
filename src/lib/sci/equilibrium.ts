// Chemical equilibrium: parse a reaction with coefficients and state symbols, solve the ICE table exactly for the
// extent of reaction, reaction quotient Q, Kp ↔ Kc, and van 't Hoff temperature dependence of K.

export type Term = { coef: number; text: string; phase?: 's' | 'l' | 'g' | 'aq'; nu: number; active: boolean };

/** "2 NO2(g) ⇌ N2O4(g)" → terms with signed coefficients (ν < 0 for reactants). Pure solids and liquids are inactive (not in K). */
export function parseReaction(text: string): Term[] {
  const sides = text.split(/\s*(?:<=>|<->|⇌|⇄|->|-->|→|⟶|=>|=)\s*/);
  if (sides.length !== 2 || !sides[0].trim() || !sides[1].trim()) throw new Error('Write the reaction with an arrow or ⇌ between the two sides, such as H2(g) + I2(g) ⇌ 2HI(g).');
  const out: Term[] = [];
  sides.forEach((side, si) => {
    for (let t of side.split(/\s+\+\s+|(?<=[A-Za-z0-9)\]])\+(?=\s*\d*\s*[A-Z([])/)) {
      t = t.trim(); if (!t) continue;
      const m = t.match(/^(\d+\/\d+|\d+(?:[.,]\d+)?)?\s*(.+?)\s*(?:\((s|l|g|aq)\))?$/i);
      if (!m) throw new Error(`Could not read "${t}".`);
      const coef = m[1] ? (m[1].includes('/') ? Number(m[1].split('/')[0]) / Number(m[1].split('/')[1]) : Number(m[1].replace(',', '.'))) : 1;
      if (!(coef > 0)) throw new Error(`The coefficient of "${t}" must be above zero.`);
      const phase = m[3]?.toLowerCase() as Term['phase'];
      out.push({ coef, text: m[2], phase, nu: si ? coef : -coef, active: phase !== 's' && phase !== 'l' });
    }
  });
  if (!out.some((x) => x.active)) throw new Error('At least one gas or dissolved species is needed: pure solids and liquids do not appear in K.');
  return out;
}

const lnQ = (terms: Term[], c: number[]) => terms.reduce((s, t, i) => (t.active ? s + t.nu * Math.log(c[i]) : s), 0);
/** Reaction quotient Q (Infinity if a product is present with no reactant, NaN if nothing is present). */
export function quotient(terms: Term[], c: number[]): number {
  let num = 1, den = 1;
  terms.forEach((t, i) => { if (!t.active) return; if (t.nu > 0) num *= c[i] ** t.nu; else den *= c[i] ** -t.nu; });
  if (den === 0) return num === 0 ? NaN : Infinity;
  return num / den;
}

export type Ice = { x: number; eq: number[]; Q: number; direction: 'forward' | 'reverse' | 'at equilibrium'; limiting?: number; conversion?: number };

/**
 * Solve Π cᵢ^νᵢ = K for the extent x (cᵢ = c0ᵢ + νᵢx). ln Q(x) rises with x, so bisection between the bounds set by
 * the species that run out works; near a bound the variable is the distance from it, so tiny K or huge K stay exact.
 */
export function solveIce(terms: Term[], c0: number[], K: number): Ice {
  if (!(K > 0)) throw new Error('K must be above zero.');
  if (c0.some((c, i) => terms[i].active && !(c >= 0))) throw new Error('Starting amounts must be zero or more.');
  const act = terms.map((t, i) => ({ t, i })).filter((a) => a.t.active);
  let lo = -Infinity, hi = Infinity, loI = -1, hiI = -1;
  for (const { t, i } of act) {
    const b = -c0[i] / t.nu;
    if (t.nu < 0 && b < hi) { hi = b; hiI = i; }
    if (t.nu > 0 && b > lo) { lo = b; loI = i; }
  }
  if (lo === hi) throw new Error('Nothing can react: give a starting amount to at least one reactant or product.');
  const lnK = Math.log(K);
  const f = (c: number[]) => lnQ(terms, c) - lnK;
  const conc = (x: number) => c0.map((c, i) => c + terms[i].nu * x);
  // Concentrations at a bound, with the species that runs out there set to exactly 0.
  const base = (xb: number, bi: number) => conc(xb).map((c, i) => (i === bi ? 0 : c));
  const geo = (fu: (u: number) => number, uh: number) => {
    // f rises with u from −∞ at u → 0; geometric bisection keeps full relative precision for tiny u.
    let ul = uh * 1e-300;
    for (let k = 0; k < 200 && uh / ul > 1 + 1e-15; k++) { const um = Math.sqrt(ul * uh); if (fu(um) < 0) ul = um; else uh = um; }
    return Math.sqrt(ul * uh);
  };
  // A finite bracket [a, b] with f(a) ≤ 0 ≤ f(b).
  let a = lo, b = hi;
  if (!Number.isFinite(a)) { let w = 1; do { a = b - w; w *= 2; } while (f(conc(a)) > 0 && w < 1e300); }
  if (!Number.isFinite(b)) { let w = 1; do { b = a + w; w *= 2; } while (f(conc(b)) < 0 && w < 1e300); }
  const mid = (a + b) / 2, fm = f(conc(mid));
  let x: number, eq: number[];
  if (fm >= 0 && Number.isFinite(lo)) {
    const bl = base(lo, loI), u = geo((u) => f(bl.map((c, i) => c + terms[i].nu * u)), mid - lo);
    x = lo + u; eq = bl.map((c, i) => c + terms[i].nu * u);
  } else if (fm < 0 && Number.isFinite(hi)) {
    const bh = base(hi, hiI), u = geo((u) => -f(bh.map((c, i) => c - terms[i].nu * u)), hi - mid);
    x = hi - u; eq = bh.map((c, i) => c - terms[i].nu * u);
  } else {
    let l = fm < 0 ? mid : a, h = fm < 0 ? b : mid;
    for (let k = 0; k < 300; k++) { const m = (l + h) / 2; if (f(conc(m)) < 0) l = m; else h = m; }
    x = (l + h) / 2; eq = conc(x);
  }
  const Q = quotient(terms, c0);
  const direction = Q === K ? 'at equilibrium' : !(Q < K) ? 'reverse' : 'forward';
  let limiting: number | undefined, conversion: number | undefined;
  if (hiI >= 0 && c0[hiI] > 0) { limiting = hiI; conversion = (100 * (c0[hiI] - eq[hiI])) / c0[hiI]; }
  return { x, eq, Q, direction: Math.abs(Math.log(Q / K)) < 1e-12 ? 'at equilibrium' : direction, limiting, conversion };
}

/** Δn of gases (products − reactants) for Kp = Kc(RT)^Δn. */
export const deltaNGas = (terms: Term[]) => terms.reduce((s, t) => (t.phase === 'g' ? s + t.nu : s), 0);
/** L·bar/(mol·K), for Kp in bar and Kc in mol/L. */
export const R_LBAR = 0.08314462618;
export const kpFromKc = (Kc: number, T: number, dn: number) => Kc * (R_LBAR * T) ** dn;
export const kcFromKp = (Kp: number, T: number, dn: number) => Kp / (R_LBAR * T) ** dn;
/** van 't Hoff: K at T2 from K at T1 and ΔH° (J/mol), assumed constant. */
export const kAtT = (K1: number, T1: number, T2: number, dH: number) => K1 * Math.exp((-dH / 8.314462618) * (1 / T2 - 1 / T1));
