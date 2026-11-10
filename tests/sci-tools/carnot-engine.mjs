// #1348 carnot-engine: checked against Python (numpy trapezoid integration of p dV round the cycle).
import { carnotEff, copFridge, copHeatPump, engineFlows, carnotCycle, cyclePressure, GAS_R } from '../../src/lib/sci/n2-thermal.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('carnot: 500 K / 300 K gives 40 %', near(carnotEff(500, 300), 0.4));
  check('carnot: COP fridge 1.5, heat pump 2.5, and pump = fridge + 1', near(copFridge(500, 300), 1.5) && near(copHeatPump(500, 300), 2.5) && near(copHeatPump(400, 270) - copFridge(400, 270), 1));
  const f = engineFlows(500, 300, 1000);
  check('carnot: 1000 J in gives 400 J work and 600 J out', near(f.W, 400) && near(f.Qc, 600));
  check('carnot: Q₂/Q₁ = T₂/T₁', near(f.Qc / 1000, 300 / 500));
  const n = 1000 / (GAS_R * 500 * Math.log(2));
  check('carnot: n for 1000 J at 500 K doubling volume = 347.03 mmol (Python)', near(n * 1000, 347.0326603587512, 1e-9));
  const c = carnotCycle(n, 500, 300, 1e-3, 2, 1.4);
  check('carnot: cycle Qh 1000 J, W 400 J', near(c.Qh, 1000) && near(c.W, 400));
  check('carnot: V3 = 7.17219 L, V4 = 3.58610 L (Python)', near(c.V[2], 0.00717219138186559) && near(c.V[3], 0.003586095690932795));
  check('carnot: corners on their isotherms and adiabats join up', near(cyclePressure(c, 1, c.V[2]), c.P[2]) && near(cyclePressure(c, 3, c.V[0]), c.P[0]));
  // Area inside the loop by trapezoids equals W.
  const legs = [[0, c.V[0], c.V[1]], [1, c.V[1], c.V[2]], [2, c.V[2], c.V[3]], [3, c.V[3], c.V[0]]];
  let A = 0; for (const [lg, a, b] of legs) { const N = 20000; for (let i = 0; i < N; i++) { const v0 = a + ((b - a) * i) / N, v1 = a + ((b - a) * (i + 1)) / N; A += 0.5 * (cyclePressure(c, lg, v0) + cyclePressure(c, lg, v1)) * (v1 - v0); } }
  check('carnot: area of the p–V loop = 400 J (numpy trapezoid gave 400.000)', Math.abs(A - 400) < 1e-3);
};
