// Tree carbon: above-ground biomass from an allometric equation the user supplies (a·D^b, or a·(ρ·D²·H)^b with D in
// cm, H in m, ρ in g/cm³, biomass in kg dry matter), roots from a root-to-shoot ratio, carbon from a carbon fraction and
// CO₂ from the 44/12 mass ratio; sequestration from two measurements or a diameter growth rate. No DOM.

export type Allo = { form: 'd' | 'rdh'; a: number; b: number; rho: number };
export const CO2_PER_C = 44.0095 / 12.011;

/** Above-ground dry biomass (kg) of one tree. */
export const agb = (m: Allo, D: number, H: number) => (m.form === 'd' ? m.a * D ** m.b : m.a * (m.rho * D * D * H) ** m.b);

/** Whole-tree dry biomass, carbon and CO₂ equivalent (kg) from above-ground biomass. */
export function stock(agbKg: number, rootShoot: number, cf: number) {
  const total = agbKg * (1 + rootShoot), c = total * cf;
  return { agb: agbKg, bgb: agbKg * rootShoot, total, c, co2: c * CO2_PER_C };
}

export type Tree = { id: string; D: number; H: number; D0?: number; H0?: number };

/** Stock now for each tree and yearly CO₂ uptake: from an earlier measurement `years` ago, or by growing D by g cm/yr for a year (H kept). */
export function forest(trees: Tree[], m: Allo, rootShoot: number, cf: number, opts: { years?: number; g?: number }) {
  const rows = trees.map((t) => {
    const now = stock(agb(m, t.D, t.H), rootShoot, cf);
    let perYear = NaN;
    if (opts.years && opts.years > 0 && t.D0 !== undefined && Number.isFinite(t.D0)) {
      const before = stock(agb(m, t.D0, t.H0 !== undefined && Number.isFinite(t.H0) ? t.H0 : t.H), rootShoot, cf);
      perYear = (now.co2 - before.co2) / opts.years;
    } else if (opts.g !== undefined && Number.isFinite(opts.g)) {
      perYear = stock(agb(m, t.D + opts.g, t.H), rootShoot, cf).co2 - now.co2;
    }
    return { ...t, ...now, perYear };
  });
  const sum = (k: 'agb' | 'bgb' | 'total' | 'c' | 'co2' | 'perYear') => rows.reduce((s, r) => s + r[k], 0);
  return { rows, agb: sum('agb'), bgb: sum('bgb'), total: sum('total'), c: sum('c'), co2: sum('co2'), perYear: sum('perYear') };
}
