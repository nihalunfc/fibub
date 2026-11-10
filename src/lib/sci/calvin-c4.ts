// Calvin cycle and C4 comparer (Learn #1397). No DOM.
// Calvin cycle bookkeeping (standard): each CO₂ fixed by RuBisCO onto RuBP (5C) gives 2 × 3-PGA (3C); reducing them to
// 2 G3P costs 2 ATP + 2 NADPH; regenerating RuBP costs 1 ATP. So 3 ATP + 2 NADPH per CO₂, 18 ATP + 12 NADPH per glucose.
// C4 plants spend 2 more ATP per CO₂ to regenerate PEP (pyruvate → PEP uses ATP → AMP), so 5 ATP + 2 NADPH.
// Photorespiration (teaching model): RuBisCO also grabs O₂. The ratio of oxygenation to carboxylation is
// φ = 2Γ*/C, where Γ* is the CO₂ level at which the two balance and C is the CO₂ level at RuBisCO. Each oxygenation
// loses 0.5 CO₂ and costs 3.5 ATP + 2 NADPH (commonly used figures). Γ* = 40 ppm × 1.05^(T − 25 °C) is a rounded,
// made-up teaching curve that rises with temperature; C = 0.7 × air CO₂ inside a C3 leaf and 10 × air CO₂ in the
// bundle sheath of a C4 leaf are rounded teaching values.

export function calvin(n: number) {
  return { co2: n, rubp: n, pga: 2 * n, atp: 3 * n, nadph: 2 * n, g3p: 2 * n, g3pOut: n / 3, g3pBack: (5 * n) / 3, glucose: n / 6, atpReduce: 2 * n, atpRegen: n };
}

export const gammaStar = (T: number) => 40 * Math.pow(1.05, T - 25);

export function pathway(type: 'C3' | 'C4', T: number, air: number) {
  const C = type === 'C3' ? 0.7 * air : 10 * air;
  const phi = (2 * gammaStar(T)) / C;
  const net = 1 - 0.5 * phi; // CO₂ kept per carboxylation
  const atpC = type === 'C3' ? 3 : 5;
  const atp = (atpC + 3.5 * phi) / net, nadph = (2 + 2 * phi) / net;
  return { C, phi, lost: (0.5 * phi) * 100, atp, nadph, net };
}

/** Temperature (°C, to 0.1) where C3 and C4 cost the same ATP per CO₂ kept, at a given air CO₂. */
export function crossover(air: number) {
  let lo = 0, hi = 60;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (pathway('C3', m, air).atp < pathway('C4', m, air).atp) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
