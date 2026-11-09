// Dimensionless numbers of fluid flow and heat transfer, with plain regime notes.
// Definitions are standard (e.g. White, Fluid Mechanics; Incropera, Fundamentals of Heat and Mass Transfer).
// Regime thresholds are the usual rough textbook guides, not sharp limits.

export type Fluid = { id: string; name: string; rho: number; mu: number; c: number; sigma: number; cp: number; k: number; beta: number; M?: number };
/** Rounded properties near 20 °C and 1 atm (general, well-known values; edit for your conditions). */
export const FLUIDS: Fluid[] = [
  { id: 'water', name: 'Water, 20 °C', rho: 998, mu: 1.0e-3, c: 1480, sigma: 0.0728, cp: 4180, k: 0.598, beta: 2.1e-4 },
  { id: 'air', name: 'Air, 20 °C, 1 atm', rho: 1.204, mu: 1.81e-5, c: 343, sigma: NaN, cp: 1005, k: 0.0257, beta: 1 / 293.15, M: 0.02897 },
  { id: 'sea', name: 'Sea water, 20 °C', rho: 1025, mu: 1.08e-3, c: 1520, sigma: 0.073, cp: 3990, k: 0.596, beta: 2.5e-4 },
  { id: 'oil', name: 'Light oil (rounded, typical)', rho: 870, mu: 0.1, c: 1400, sigma: 0.03, cp: 1900, k: 0.14, beta: 7e-4 },
  { id: 'gly', name: 'Glycerol, 20 °C', rho: 1260, mu: 1.4, c: 1900, sigma: 0.063, cp: 2400, k: 0.29, beta: 5e-4 },
];

export type Geometry = 'pipe' | 'plate' | 'cylinder' | 'sphere' | 'channel' | 'other';
export type DimIn = {
  rho: number; mu: number; c: number; sigma: number; cp: number; k: number; beta: number; M?: number;
  U: number; L: number; geometry: Geometry; g?: number;
  dT?: number; // temperature difference driving natural convection, K
  f?: number; // a frequency (vortex shedding, oscillation), Hz
  p?: number; T?: number; // gas pressure (Pa) and temperature (K) for the Knudsen number
};
export type Num = { id: string; name: string; value: number; formula: string; note: string };

const KB = 1.380649e-23, NA = 6.02214076e23;

function reNote(re: number, g: Geometry): string {
  switch (g) {
    case 'pipe': return re < 2300 ? 'laminar pipe flow (below about 2300)' : re < 4000 ? 'transitional (2300 to 4000): may flip between laminar and turbulent' : 'turbulent pipe flow (above about 4000)';
    case 'plate': return re < 5e5 ? 'laminar boundary layer (transition usually near 5 × 10⁵)' : 'boundary layer likely turbulent (past about 5 × 10⁵)';
    case 'cylinder': return re < 1 ? 'creeping (Stokes) flow' : re < 47 ? 'steady wake with two attached eddies' : re < 2e5 ? 'Kármán vortex street behind the body' : re < 4e6 ? 'around the drag crisis: boundary layer turns turbulent, drag drops' : 'supercritical, turbulent wake';
    case 'sphere': return re < 1 ? 'creeping (Stokes) flow, drag = 3πμUD' : re < 20 ? 'steady, attached flow' : re < 1000 ? 'separated wake, starts shedding above about 300' : re < 3e5 ? 'Newton regime: drag coefficient roughly constant near 0.4 to 0.5' : 'drag crisis region';
    case 'channel': return re < 500 ? 'laminar open-channel flow (Re on hydraulic radius below about 500)' : re < 2000 ? 'transitional open-channel flow' : 'turbulent open-channel flow';
    default: return re < 1 ? 'viscous forces dominate' : re < 1000 ? 'viscous and inertial forces both matter' : 'inertia dominates: likely turbulent';
  }
}

export function dimensionless(p: DimIn): Num[] {
  const g = p.g ?? 9.80665, nu = p.mu / p.rho, out: Num[] = [];
  const Re = (p.rho * p.U * p.L) / p.mu;
  out.push({ id: 're', name: 'Reynolds Re', value: Re, formula: 'ρUL/μ', note: reNote(Re, p.geometry) });
  if (p.c > 0) { const Ma = p.U / p.c; out.push({ id: 'ma', name: 'Mach Ma', value: Ma, formula: 'U/c', note: Ma < 0.3 ? 'incompressible (below 0.3): density changes under 5 %' : Ma < 0.8 ? 'subsonic, compressible' : Ma < 1.2 ? 'transonic: shock waves appear' : Ma < 5 ? 'supersonic' : 'hypersonic' }); }
  const Fr = p.U / Math.sqrt(g * p.L);
  out.push({ id: 'fr', name: 'Froude Fr', value: Fr, formula: 'U/√(gL)', note: p.geometry === 'channel' ? (Fr < 0.95 ? 'subcritical: tranquil, waves can travel upstream' : Fr <= 1.05 ? 'critical' : 'supercritical: rapid, a hydraulic jump forms where it slows') : Fr < 1 ? 'gravity waves outrun the flow (below 1)' : 'flow faster than surface waves (above 1)' });
  if (p.sigma > 0) {
    const We = (p.rho * p.U * p.U * p.L) / p.sigma;
    out.push({ id: 'we', name: 'Weber We', value: We, formula: 'ρU²L/σ', note: We < 1 ? 'surface tension holds drops and jets together' : We < 12 ? 'drops deform' : 'drops and jets break up (above about 12)' });
    out.push({ id: 'ca', name: 'Capillary Ca', value: (p.mu * p.U) / p.sigma, formula: 'μU/σ', note: (p.mu * p.U) / p.sigma < 1e-3 ? 'surface tension dominates viscous forces' : 'viscous forces deform the interface' });
    const Bo = (p.rho * g * p.L * p.L) / p.sigma;
    out.push({ id: 'bo', name: 'Bond (Eötvös) Bo', value: Bo, formula: 'ρgL²/σ', note: Bo < 1 ? 'surface tension beats gravity: capillary scale' : 'gravity beats surface tension' });
    out.push({ id: 'oh', name: 'Ohnesorge Oh', value: p.mu / Math.sqrt(p.rho * p.sigma * p.L), formula: 'μ/√(ρσL)', note: p.mu / Math.sqrt(p.rho * p.sigma * p.L) < 0.1 ? 'low: inkjet-type drops form cleanly' : 'high: viscosity damps drop break-up' });
  }
  if (p.cp > 0 && p.k > 0) {
    const Pr = (p.cp * p.mu) / p.k;
    out.push({ id: 'pr', name: 'Prandtl Pr', value: Pr, formula: 'cₚμ/k', note: Pr < 0.1 ? 'heat spreads much faster than momentum (liquid metals)' : Pr < 2 ? 'heat and momentum spread alike (gases near 0.7)' : 'momentum spreads faster than heat (water, oils)' });
    const Pe = Re * Pr;
    out.push({ id: 'pe', name: 'Péclet Pe', value: Pe, formula: 'Re·Pr = UL/α', note: Pe < 1 ? 'heat moves mainly by conduction' : 'heat is carried mainly by the flow' });
    if (p.dT && p.beta > 0) {
      const Gr = (g * p.beta * Math.abs(p.dT) * p.L ** 3) / (nu * nu), Ra = Gr * Pr, Ri = Gr / (Re * Re);
      out.push({ id: 'gr', name: 'Grashof Gr', value: Gr, formula: 'gβΔT L³/ν²', note: 'buoyancy ÷ viscous forces' });
      out.push({ id: 'ra', name: 'Rayleigh Ra', value: Ra, formula: 'Gr·Pr', note: Ra < 1708 ? 'below 1708: no convection between heated plates (conduction only)' : Ra < 1e9 ? 'laminar natural convection (a vertical wall up to about 10⁹)' : 'turbulent natural convection (above about 10⁹)' });
      out.push({ id: 'ri', name: 'Richardson Ri', value: Ri, formula: 'Gr/Re²', note: Ri < 0.1 ? 'forced convection: buoyancy negligible' : Ri < 10 ? 'mixed convection' : 'natural convection dominates' });
    }
  }
  if (p.f && p.f > 0) { const St = (p.f * p.L) / p.U; out.push({ id: 'st', name: 'Strouhal St', value: St, formula: 'fL/U', note: Math.abs(St - 0.2) < 0.05 ? 'near 0.2: typical of vortex shedding from a bluff body' : St < 0.1 ? 'slow unsteadiness: quasi-steady flow' : 'fast unsteadiness compared with the flow time' }); }
  if (p.M && p.p && p.T && p.p > 0 && p.T > 0) {
    const m = p.M / NA, lam = (p.mu / p.p) * Math.sqrt((Math.PI * KB * p.T) / (2 * m)), Kn = lam / p.L;
    out.push({ id: 'kn', name: 'Knudsen Kn', value: Kn, formula: 'λ/L, λ = (μ/p)√(πkT/2m)', note: Kn < 0.01 ? 'continuum flow: the usual equations hold' : Kn < 0.1 ? 'slip flow: gas slips at walls' : Kn < 10 ? 'transitional: neither continuum nor free-molecular' : 'free-molecular flow: molecules hit walls more than each other' });
  }
  return out;
}
/** Mean free path from viscosity (hard-sphere kinetic theory, Chapman-Enskog first order). */
export const meanFreePath = (mu: number, p: number, T: number, M: number) => (mu / p) * Math.sqrt((Math.PI * KB * T) / (2 * (M / NA)));
