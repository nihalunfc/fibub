// #1398 Respiration ATP ledger. Checked by hand: 4 + 10 × 3 + 2 × 2 = 38; 4 + 10 × 2.5 + 2 × 1.5 = 32;
// 6 CO₂ and 6 O₂ per glucose; RQ glucose 6/6 = 1, tripalmitin 51/72.5 = 0.70345 (= 102/145), malic acid 4/3,
// oxalic acid 2/0.5 = 4, oleic acid 18/25.5 = 0.70588.
import * as A from '../../src/lib/sci/respiration-atp.ts';
const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e;
export default async (check) => {
  const L = A.ledger(3, 'old');
  check('respiration: 38 ATP textbook count', L.total === 38 && L.substrateAtp === 4 && L.nadh === 10 && L.fadh === 2 && L.etsAtp === 34);
  check('respiration: 32 ATP newer count', A.aerobicTotal('new') === 32);
  check('respiration: 6 CO₂ and 6 O₂ per glucose', L.co2 === 6 && L.o2 === 6);
  check('respiration: after glycolysis 2 ATP, 2 NADH', A.ledger(0, 'old').total === 2 && A.ledger(0, 'old').nadh === 2);
  check('respiration: after Krebs 4 ATP, 10 NADH, 2 FADH₂, 6 CO₂', A.ledger(2, 'old').total === 4 && A.ledger(2, 'old').nadh === 10 && A.ledger(2, 'old').co2 === 6);
  check('respiration: scales with glucose', A.ledger(3, 'old', 5).total === 190);
  const R = (f) => A.rq(A.parseCHO(f)).rq;
  check('respiration: RQ glucose 1, tripalmitin 0.703, malic 1.333, oxalic 4, oleic 0.706', near(R('C6H12O6'), 1) && near(R('C51H98O6'), 102 / 145) && near(R('C4H6O5'), 4 / 3) && near(R('C2H2O4'), 4) && near(R('C18H34O2'), 18 / 25.5));
  check('respiration: formula reader', A.parseCHO('CH4').C === 1 && A.parseCHO('CH4').H === 4 && A.parseCHO('C6H12O6').O === 6 && A.parseCHO('NaCl') === null && A.parseCHO('H2O') === null);
};
