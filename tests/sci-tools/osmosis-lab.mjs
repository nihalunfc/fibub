// #1121 Osmosis lab. Equilibrium volumes were checked against a separate Python bisection of
// psi_cell(x) = psi_out (numpy 2.5, R = 8.314462618e-3 MPa·L/(mol·K), 25 °C); the zero crossing against
// numpy.interp; psi_s = -iCRT against the hand-worked value for 0.1 M sucrose at 27 °C (-0.2496 MPa).
import { eqVolume, equilibrium, SPECIMENS, SOLUTES, RT, crossZero, practical, rng, isotonicConc, volumeAt } from '../../src/lib/sci/osmosis.ts';

export default async (check) => {
  const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t;
  const py = [[0.3, 0, 4, 1.1602437256], [0.3, 0.1, 4, 1.1061119354], [0.3, 0.5, 4, 0.6], [2, 0, 1, 2.7820854627], [2, 0.4, 1, 2.2308499598], [0.4, 0.2, 5, 1.0838208223], [0.3, 0.15, 0, 2], [0.3, 1, 4, 0.3]];
  check('osmosis: equilibrium volume matches Python bisection', py.every(([o, c, e, x]) => near(eqVolume(o, c, e), x, 1e-8)));
  check('osmosis: psi_s = -iCRT for 0.1 M sucrose at 27 °C', near(-0.1 * RT(27), -0.249559, 1e-5));
  const [potato, , onion, rbc] = SPECIMENS, [sucrose, salt] = SOLUTES;
  const w = equilibrium(potato, sucrose, 0);
  check('osmosis: potato in water gains 8.0 % and is turgid', near(w.change, 8.012186, 1e-5) && w.state === 'turgid' && w.tonicity === 'hypotonic' && w.flow === 'in' && w.P > 0);
  check('osmosis: at equilibrium psi inside = psi outside', near(w.psi, w.psiOut, 1e-9) && near(equilibrium(potato, sucrose, 0.1).psi, equilibrium(potato, sucrose, 0.1).psiOut, 1e-9));
  const iso = equilibrium(potato, sucrose, 0.3);
  check('osmosis: isotonic sucrose gives no change', near(iso.change, 0, 1e-9) && iso.tonicity === 'isotonic' && iso.state === 'flaccid' && iso.flow === 'none');
  const hyp = equilibrium(potato, sucrose, 0.6);
  check('osmosis: hypertonic loses water, plasmolysis', near(hyp.change, -25, 1e-9) && hyp.state === 'plasmolysed' && hyp.flow === 'out' && hyp.P === 0);
  check('osmosis: salt counts twice (0.15 M NaCl isotonic with 0.3 osmol/L)', equilibrium(potato, salt, 0.15).tonicity === 'isotonic' && near(isotonicConc(potato, salt), 0.15));
  check('osmosis: red cell bursts in water, shrinks in strong salt', equilibrium(rbc, sucrose, 0).state === 'burst' && equilibrium(rbc, salt, 0.3).state === 'shrunk' && equilibrium(rbc, salt, 0.15).state === 'normal');
  check('osmosis: onion cell plasmolyses in 1 M sugar', equilibrium(onion, sucrose, 1).state === 'plasmolysed' && near(equilibrium(onion, sucrose, 1).x, 0.4));
  check('osmosis: time course starts at 1, ends at equilibrium', near(volumeAt(potato, 1.2, 0), 1) && near(volumeAt(potato, 1.2, 1000), 1.2) && near(volumeAt(potato, 1.2, potato.tau), 1.2 - 0.2 / Math.E));
  check('osmosis: zero crossing matches numpy.interp', near(crossZero([0, 0.2, 0.4, 0.6], [8, 2, -5, -12]), 0.2571428571, 1e-9) && Number.isNaN(crossZero([0, 1], [3, 4])) && crossZero([0, 0.5, 1], [4, 0, -3]) === 0.5);
  const run = practical(potato, sucrose, [0, 0.2, 0.4, 0.6, 0.8, 1], rng(7));
  const fr = crossZero(run.map((r) => r.c), run.map((r) => r.change));
  check('osmosis: virtual practical finds the sap close to 0.3 M', run.length === 6 && fr > 0.2 && fr < 0.4);
  check('osmosis: seeded runs repeat', JSON.stringify(practical(potato, sucrose, [0, 0.5], rng(3))) === JSON.stringify(practical(potato, sucrose, [0, 0.5], rng(3))));
};
