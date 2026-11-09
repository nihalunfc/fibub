// Tick labels keep the decimals of the tick step (2.5 → "2.5", 0.25 steps → "0.75").
import { tickLabel } from '../../src/lib/sci/plot.ts';

export default async (check) => {
  const cases = [[2.5, 2.5, '2.5'], [5, 2.5, '5.0'], [0.75, 0.25, '0.75'], [0.5, 0.25, '0.50'], [10, 2, '10'],
    [0.2, 0.1, '0.2'], [300, 100, '300'], [1.5, 0.5, '1.5'], [-7.5, 2.5, '−7.5'], [0, 0.25, '0']];
  for (const [v, s, want] of cases) check(`tickLabel(${v}, step ${s}) is ${want}`, tickLabel(v, s) === want);
};
