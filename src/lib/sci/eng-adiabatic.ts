// Heat of reaction from heats of formation (Hess), its change with temperature (Kirchhoff) with a polynomial heat
// capacity cp = a + bT + cT² + dT³ (J/(mol·K)), and the adiabatic outlet temperature of a reactor or burner at any
// conversion, with excess reactants and inert diluents, found by solving the energy balance. Plain TypeScript, no DOM.

export const T0 = 298.15;
export type Species = { name: string; nu: number; feed: number; dHf: number; M: number; cp: [number, number, number, number] };

/** cp (J/(mol·K)) at T. */
export const cpAt = (s: Pick<Species, 'cp'>, T: number) => s.cp[0] + T * (s.cp[1] + T * (s.cp[2] + T * s.cp[3]));
/** ∫ cp dT from T1 to T2, J/mol (exact for the polynomial). */
export function cpInt(s: Pick<Species, 'cp'>, T1: number, T2: number) {
  const F = (T: number) => T * (s.cp[0] + T * (s.cp[1] / 2 + T * (s.cp[2] / 3 + (T * s.cp[3]) / 4)));
  return F(T2) - F(T1);
}

/** Standard heat of reaction at 298.15 K, kJ per mol of reaction (per unit extent). */
export const dHr0 = (sp: Species[]) => sp.reduce((a, s) => a + s.nu * s.dHf, 0);
/** Heat of reaction at T by Kirchhoff's law, kJ per mol of reaction. */
export const dHrAt = (sp: Species[], T: number) => dHr0(sp) + sp.reduce((a, s) => a + s.nu * cpInt(s, T0, T), 0) / 1000;
/** Δcp of the reaction at T, J/(mol·K). */
export const dCp = (sp: Species[], T: number) => sp.reduce((a, s) => a + s.nu * cpAt(s, T), 0);

/** The limiting reactant: the smallest feed / |ν| among reactants (ν < 0). */
export function limiting(sp: Species[]) {
  let best = -1, r = Infinity;
  sp.forEach((s, i) => { if (s.nu < 0 && s.feed / -s.nu < r) { r = s.feed / -s.nu; best = i; } });
  return best;
}

/**
 * Adiabatic outlet temperature (K) for a feed at Tin (K) converted to `conversion` of the key reactant. Energy
 * balance along the path feed → 298.15 K → react → products heated to T:
 * Σ n_in ∫(Tin→T0) cp + ξ ΔrH(T0) + Σ n_out ∫(T0→T) cp = 0, solved by bisection then Newton.
 */
export function adiabatic(sp: Species[], Tin: number, conversion: number, key = limiting(sp)) {
  if (key < 0) return null;
  const xi = (conversion * sp[key].feed) / -sp[key].nu;
  const out = sp.map((s) => s.feed + s.nu * xi);
  const hin = sp.reduce((a, s) => a + s.feed * cpInt(s, Tin, T0), 0) / 1000; // kJ released cooling the feed to T0
  const q = -(hin + xi * dHr0(sp)); // kJ available to heat the products above T0
  const f = (T: number) => sp.reduce((a, s, i) => a + out[i] * cpInt(s, T0, T), 0) / 1000 - q;
  const cpOut = (T: number) => sp.reduce((a, s, i) => a + out[i] * cpAt(s, T), 0) / 1000;
  let lo = 50, hi = 6000;
  if (f(lo) > 0 || f(hi) < 0) return { xi, out, T: NaN, q, ok: false };
  for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; }
  let T = (lo + hi) / 2;
  for (let k = 0; k < 20; k++) { const d = cpOut(T); if (!(d > 0)) break; const n = T - f(T) / d; if (Math.abs(n - T) < 1e-12) { T = n; break; } T = n; }
  return { xi, out, T, q, ok: true };
}

/** Quick estimate ΔT = −ΔrH(Tin) ξ / Σ n_in cp_i(Tin) (constant cp of the feed), K. */
export function quickRise(sp: Species[], Tin: number, conversion: number, key = limiting(sp)) {
  const xi = (conversion * sp[key].feed) / -sp[key].nu;
  return (-dHrAt(sp, Tin) * xi * 1000) / sp.reduce((a, s) => a + s.feed * cpAt(s, Tin), 0);
}

/** Feed mass (kg) and energy released (kJ) at Tin for the given conversion. */
export function energyRelease(sp: Species[], Tin: number, conversion: number, key = limiting(sp)) {
  const xi = (conversion * sp[key].feed) / -sp[key].nu, mass = sp.reduce((a, s) => a + s.feed * s.M, 0) / 1000;
  const Q = -dHrAt(sp, Tin) * xi;
  return { xi, mass, Q, perKgFeed: Q / mass, perKgKey: Q / ((sp[key].feed * conversion * sp[key].M) / 1000) };
}

/** Read the species table: name, ν, feed mol, ΔfH° kJ/mol, M g/mol, cp a [, b, c, d]. */
export function readSpecies(text: string): { species: Species[]; error?: string } {
  const sp: Species[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim(); if (!line || line.startsWith('#')) continue;
    const f = line.split(/\s*[,;\t]\s*/);
    if (f.length < 6) {
      if (!Number.isFinite(Number(f[1]))) continue; // a header line
      return { species: sp, error: `"${line}" needs at least: name, ν, feed mol, ΔfH°, M, cp a.` };
    }
    const n = f.slice(1).map((x) => (x === '' ? 0 : Number(x)));
    if (n.slice(0, 5).some((x) => !Number.isFinite(x))) { if (sp.length === 0) continue; return { species: sp, error: `"${line}" has something that is not a number.` }; }
    if (n.some((x) => !Number.isFinite(x))) return { species: sp, error: `"${line}" has a cp coefficient that is not a number.` };
    if (n[1] < 0) return { species: sp, error: `The feed of ${f[0]} cannot be negative.` };
    if (!(n[3] > 0)) return { species: sp, error: `Give the molar mass of ${f[0]} (g/mol).` };
    sp.push({ name: f[0], nu: n[0], feed: n[1], dHf: n[2], M: n[3], cp: [n[4], n[5] ?? 0, n[6] ?? 0, n[7] ?? 0] });
  }
  if (!sp.some((s) => s.nu < 0) || !sp.some((s) => s.nu > 0)) return { species: sp, error: 'Give at least one reactant (negative ν) and one product (positive ν).' };
  return { species: sp };
}

// Methane burning in 10 % excess air. ΔfH° are rounded standard values; the cp lines (a + bT) are rough, made-up
// straight-line fits for illustration, not taken from any table.
export const EXAMPLE = `name, nu, feed mol, dHf kJ/mol, M g/mol, cp a, cp b
CH4, -1, 1, -74.6, 16.04, 20, 0.05
O2, -2, 2.2, 0, 32.00, 29, 0.005
N2, 0, 8.28, 0, 28.01, 28, 0.004
CO2, 1, 0, -393.5, 44.01, 33, 0.017
H2O(g), 2, 0, -241.8, 18.02, 30, 0.01`;
