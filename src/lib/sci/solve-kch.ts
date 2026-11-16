// "Solve my numbers" for the Kirchhoff solver: the classic two-loop problem (two cells each with a series resistor,
// and a middle resistor), with the junction and loop equations written out and solved. Plain maths, no DOM.
import { eng, sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

/** Millman's result for the two-cell, three-resistor network: potential of the top junction and the three currents. */
export function twoLoopSolve(E1: number, R1: number, E2: number, R2: number, R3: number) {
  const V = (E1 / R1 + E2 / R2) / (1 / R1 + 1 / R2 + 1 / R3);
  return { V, I1: (E1 - V) / R1, I2: (E2 - V) / R2, I3: V / R3 };
}
export type TwoLoop = { E1: number; R1: number; E2: number; R2: number; R3: number };

export function makeKchSpec(onSolve: (v: TwoLoop) => void): SSpec {
  const cell = ['V', 1], mv = ['mV', 1e-3], ohm = ['Ω', 1], k = ['kΩ', 1e3];
  return {
    id: 'kch',
    finds: [['all', 'All three currents']],
    fields: [
      { k: 'E1', label: 'Cell 1 emf E₁ (left)', units: [cell as [string, number], mv as [string, number]], neg: true, ph: 'e.g. 6' },
      { k: 'R1', label: 'Resistor R₁ (with cell 1)', units: [ohm as [string, number], k as [string, number]], ph: 'e.g. 2' },
      { k: 'E2', label: 'Cell 2 emf E₂ (right)', units: [cell as [string, number], mv as [string, number]], neg: true, ph: 'e.g. 4' },
      { k: 'R2', label: 'Resistor R₂ (with cell 2)', units: [ohm as [string, number], k as [string, number]], ph: 'e.g. 4' },
      { k: 'R3', label: 'Middle resistor R₃', units: [ohm as [string, number], k as [string, number]], ph: 'e.g. 6' },
    ],
    presets: [
      { name: '6 V and 4 V cells, 2, 4 and 6 Ω', find: 'all', vals: { E1: '6', R1: '2', E2: '4', R2: '4', R3: '6' } },
      { name: 'Two 12 V cells, 1 Ω each, 5 Ω load', find: 'all', vals: { E1: '12', R1: '1', E2: '12', R2: '1', R3: '5' } },
      { name: '10 V and 6 V cells, 3, 2 and 6 Ω', find: 'all', vals: { E1: '10', R1: '3', E2: '6', R2: '2', R3: '6' } },
      { name: 'A weak second cell (2 V) is charged', find: 'all', vals: { E1: '9', R1: '2', E2: '2', R2: '1', R3: '3' } },
    ],
    solve: (i: Record<string, SIn>): SOut => {
      const E1 = i.E1.v, E2 = i.E2.v, R1 = i.R1.v, R2 = i.R2.v, R3 = i.R3.v;
      if (![R1, R2, R3].every((r) => r > 0)) return { error: 'Each resistance must be above 0 Ω. If a cell has an internal resistance, add it to the resistor next to it.' };
      onSolve({ E1, R1, E2, R2, R3 });
      const { V, I1, I2, I3 } = twoLoopSolve(E1, R1, E2, R2, R3);
      const f = (x: number) => sf(x);
      const lines = [
        'Name the currents: I₁ flows out of cell 1 through R₁, I₂ out of cell 2 through R₂, and I₃ down through R₃.',
        'Junction rule (current in = current out): I₃ = I₁ + I₂',
        `Loop 1 (cell 1, R₁, R₃): E₁ − I₁ R₁ − I₃ R₃ = 0, so ${f(E1)} − ${f(R1)} I₁ − ${f(R3)} I₃ = 0`,
        `Loop 2 (cell 2, R₂, R₃): E₂ − I₂ R₂ − I₃ R₃ = 0, so ${f(E2)} − ${f(R2)} I₂ − ${f(R3)} I₃ = 0`,
        `Solving the three equations: the voltage across R₃ is V = (E₁/R₁ + E₂/R₂) ÷ (1/R₁ + 1/R₂ + 1/R₃) = ${f(V)} V`,
        `I₁ = (E₁ − V) ÷ R₁ = (${f(E1)} − ${f(V)}) ÷ ${f(R1)} = ${eng(I1, 'A')}`,
        `I₂ = (E₂ − V) ÷ R₂ = (${f(E2)} − ${f(V)}) ÷ ${f(R2)} = ${eng(I2, 'A')}`,
        `I₃ = V ÷ R₃ = ${f(V)} ÷ ${f(R3)} = ${eng(I3, 'A')}`,
        `Check the junction: I₁ + I₂ = ${f(I1 + I2)} A, and I₃ = ${f(I3)} A.`,
      ];
      const charging = Math.abs(I2) > 1e-12 && I2 < 0 ? ' I₂ is negative: the stronger cell 1 pushes current backwards through cell 2 and charges it.' : Math.abs(I1) > 1e-12 && I1 < 0 ? ' I₁ is negative: cell 1 is being charged by cell 2.' : '';
      return {
        answer: `I₁ = ${eng(I1, 'A')}, I₂ = ${eng(I2, 'A')}, I₃ = ${eng(I3, 'A')}.${charging}`,
        lines,
        tip: 'Common mistakes: a wrong sign in a loop equation (going through a resistor with the current drops the voltage by I R; going through a cell from its − to its + terminal adds E), and forgetting that a negative answer only means the current flows the other way. The circuit below has been redrawn with your numbers.',
      };
    },
  };
}
