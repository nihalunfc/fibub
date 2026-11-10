// Bond enthalpy estimate for school chemistry (Class 11 thermodynamics): ΔH ≈ Σ(bonds broken) − Σ(bonds made),
// using rounded average bond enthalpies in kJ/mol. Plain maths, no DOM.

export type Bond = { id: string; label: string; kj: number };
/** Rounded average bond enthalpies (kJ/mol, gas phase). Averages over many molecules, so answers are estimates. */
export const BONDS: Bond[] = [
  { id: 'HH', label: 'H–H', kj: 436 }, { id: 'CH', label: 'C–H', kj: 413 }, { id: 'CC', label: 'C–C', kj: 347 },
  { id: 'C2C', label: 'C=C', kj: 614 }, { id: 'C3C', label: 'C≡C', kj: 839 }, { id: 'CO', label: 'C–O', kj: 358 },
  { id: 'C2O', label: 'C=O', kj: 799 }, { id: 'OH', label: 'O–H', kj: 463 }, { id: 'O2O', label: 'O=O', kj: 498 },
  { id: 'N3N', label: 'N≡N', kj: 945 }, { id: 'NH', label: 'N–H', kj: 391 }, { id: 'ClCl', label: 'Cl–Cl', kj: 243 },
  { id: 'HCl', label: 'H–Cl', kj: 431 }, { id: 'CCl', label: 'C–Cl', kj: 339 }, { id: 'BrBr', label: 'Br–Br', kj: 193 },
  { id: 'HBr', label: 'H–Br', kj: 366 }, { id: 'CBr', label: 'C–Br', kj: 276 },
];

export type Counts = Record<string, number>;
export type Reaction = { id: string; text: string; broken: Counts; made: Counts };
export const REACTIONS: Reaction[] = [
  { id: 'ch4', text: 'CH₄ + 2O₂ → CO₂ + 2H₂O (burning methane)', broken: { CH: 4, O2O: 2 }, made: { C2O: 2, OH: 4 } },
  { id: 'hcl', text: 'H₂ + Cl₂ → 2HCl', broken: { HH: 1, ClCl: 1 }, made: { HCl: 2 } },
  { id: 'h2o', text: '2H₂ + O₂ → 2H₂O (as steam)', broken: { HH: 2, O2O: 1 }, made: { OH: 4 } },
  { id: 'nh3', text: 'N₂ + 3H₂ → 2NH₃', broken: { N3N: 1, HH: 3 }, made: { NH: 6 } },
  { id: 'c2h4h2', text: 'C₂H₄ + H₂ → C₂H₆ (adding hydrogen to ethene)', broken: { C2C: 1, HH: 1 }, made: { CC: 1, CH: 2 } },
  { id: 'c2h4br2', text: 'C₂H₄ + Br₂ → C₂H₄Br₂ (bromine water test)', broken: { C2C: 1, BrBr: 1 }, made: { CC: 1, CBr: 2 } },
  { id: 'ch3cl', text: 'CH₄ + Cl₂ → CH₃Cl + HCl', broken: { CH: 1, ClCl: 1 }, made: { CCl: 1, HCl: 1 } },
  { id: 'hbr', text: '2HBr → H₂ + Br₂ (breaking up hydrogen bromide)', broken: { HBr: 2 }, made: { HH: 1, BrBr: 1 } },
];

export type Result = { broken: number; made: number; dH: number; lines: { label: string; n: number; kj: number; side: 'broken' | 'made' }[] };
/** Energy in (bonds broken), energy out (bonds made) and ΔH = in − out, all in kJ/mol of reaction as written. */
export function estimate(broken: Counts, made: Counts, values: Record<string, number> = {}): Result {
  const kj = (id: string) => values[id] ?? BONDS.find((b) => b.id === id)!.kj;
  const lab = (id: string) => BONDS.find((b) => b.id === id)?.label ?? id;
  const lines: Result['lines'] = [];
  let a = 0, b = 0;
  for (const [id, n] of Object.entries(broken)) if (n) { a += n * kj(id); lines.push({ label: lab(id), n, kj: kj(id), side: 'broken' }); }
  for (const [id, n] of Object.entries(made)) if (n) { b += n * kj(id); lines.push({ label: lab(id), n, kj: kj(id), side: 'made' }); }
  return { broken: a, made: b, dH: a - b, lines };
}
