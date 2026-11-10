// #1430 p-n junction. Diode equation, Zener breakdown, dynamic resistance (analytic VT / I) and the regulator
// checked against an independent Python version (math.expm1).
import * as P from '../../src/lib/sci/pnjunction.ts';
const rel = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.abs(b);
export default async (check) => {
  const { si, ge, zener } = P.DIODES;
  check('pn: thermal voltage at 300 K', rel(P.thermalVoltage(300), 0.025851999786));
  check('pn: Si current at 0.7 V equals Python', rel(P.current(si, 0.7), 0.005747545693658723));
  check('pn: Ge current at 0.3 V equals Python', rel(P.current(ge, 0.3), 0.0010959083162455422));
  check('pn: reverse current is −Is', rel(P.current(si, -5), -1e-14, 1e-6));
  check('pn: Zener at −6 V conducts 0.18 A', rel(P.current(zener, -6), -0.18000000000000999, 1e-9) && rel(P.current(zener, -5), -1e-14, 1e-6));
  check('pn: dynamic resistance = VT / I', rel(P.dynamicResistance(si, 0.7), 4.497919836370779, 1e-6));
  check('pn: depletion widens with reverse bias', rel(P.width(si, -5), 1.426784596817013) && P.width(si, 0) === P.W0 && P.width(si, 0.4) < P.W0 && P.width(si, 0.8) > 0);
  check('pn: barrier and bias names', Math.abs(P.barrier(si, 0.3) - 0.4) < 1e-12 && P.barrier(si, 0.9) === 0 && P.bias(0.2) === 'forward' && P.bias(-1) === 'reverse' && P.bias(0) === 'none');
  const r = P.regulator(12, 5.1, 220, 1000);
  check('pn: regulator currents', r.regulating && rel(r.iR, 0.031363636363636364) && rel(r.iZ, 0.026263636363636364) && r.vout === 5.1);
  const o = P.regulator(6, 5.1, 1000, 1000);
  check('pn: regulator drops out when Vin is too low', !o.regulating && o.vout === 3 && o.iZ === 0);
  let bad = 0; for (const f of [() => P.current(si, NaN), () => P.regulator(12, 5.1, 0, 100)]) { try { f(); } catch { bad++; } }
  check('pn: bad input refused', bad === 2);
};
